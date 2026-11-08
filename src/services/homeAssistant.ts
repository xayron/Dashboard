import {
  createConnection,
  subscribeEntities,
  type Connection,
  type HassEntities,
} from 'home-assistant-js-websocket';
import type { HAConnectionConfig, HAStatus, MediaPlayerData, SystemHealth } from '../types/dashboard';

const STORAGE_KEY = 'ha_dashboard_config';

export const getSavedHAConfig = (): HAConnectionConfig => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading HA config from storage', e);
  }
  const envUrl = (import.meta as any).env?.VITE_HA_URL;
  const envToken = (import.meta as any).env?.VITE_HA_TOKEN;
  return {
    haUrl: envUrl || 'http://homeassistant.local:8123',
    accessToken: envToken || '',
    useMock: !(envUrl && envToken),
  };
};

export const saveHAConfig = (config: HAConnectionConfig): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
};

export class HomeAssistantService {
  private connection: Connection | null = null;
  private status: HAStatus = 'disconnected';
  private entities: HassEntities = {};
  private listeners: Array<(entities: HassEntities, status: HAStatus) => void> = [];
  private config: HAConnectionConfig;
  private mockInterval: number | null = null;

  constructor() {
    this.config = getSavedHAConfig();
  }

  public subscribe(listener: (entities: HassEntities, status: HAStatus) => void): () => void {
    this.listeners.push(listener);
    // Emit current state immediately
    listener(this.entities, this.status);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public async connect(): Promise<void> {
    if (this.config.useMock || !this.config.accessToken) {
      this.startMockMode();
      return;
    }

    try {
      this.setStatus('connecting');
      // Create authenticated WebSocket connection
      const auth = {
        data: {
          hassUrl: this.config.haUrl.replace(/\/$/, ''),
          access_token: this.config.accessToken,
          expires: Date.now() + 365 * 24 * 60 * 60 * 1000,
          clientId: 'smart-kiosk-dashboard',
        },
        wsUrl: `${this.config.haUrl.replace(/^http/, 'ws').replace(/\/$/, '')}/api/websocket`,
        accessToken: this.config.accessToken,
        expired: false,
      };

      const conn = await createConnection({ auth: auth as any });
      this.connection = conn;
      this.setStatus('connected');

      subscribeEntities(conn, (entities) => {
        this.entities = entities;
        this.notify();
      });

      conn.addEventListener('disconnected', () => {
        this.setStatus('disconnected');
      });

      conn.addEventListener('ready', () => {
        this.setStatus('connected');
      });

    } catch (err) {
      console.warn('Could not connect to Home Assistant server. Falling back to simulated live mock mode.', err);
      this.startMockMode();
    }
  }

  public disconnect(): void {
    if (this.mockInterval) {
      window.clearInterval(this.mockInterval);
      this.mockInterval = null;
    }
    if (this.connection) {
      this.connection.close();
      this.connection = null;
    }
    this.setStatus('disconnected');
  }

  public updateConfig(newConfig: Partial<HAConnectionConfig>): void {
    this.config = { ...this.config, ...newConfig };
    saveHAConfig(this.config);
    this.disconnect();
    this.connect();
  }

  public getConfig(): HAConnectionConfig {
    return this.config;
  }

  public getEntities(): HassEntities {
    return this.entities;
  }

  public getStatus(): HAStatus {
    return this.status;
  }

  private setStatus(status: HAStatus): void {
    this.status = status;
    this.notify();
  }

  private notify(): void {
    this.listeners.forEach(listener => listener(this.entities, this.status));
  }

  // Resolve full, valid album art URL handling both absolute and relative HA proxies
  public resolveAlbumArt(attr?: Record<string, any>): string {
    if (!attr) return '';
    // Check all common album art attribute keys
    const rawPic = attr.entity_picture || attr.entity_picture_local || attr.media_image_url || attr.album_art;
    if (!rawPic || typeof rawPic !== 'string') return '';

    // 1. If it's already an absolute URL (e.g. Spotify CDN, Cast CDN, web stream)
    if (/^https?:\/\//i.test(rawPic)) {
      return rawPic;
    }

    // 2. If it's a relative path on Home Assistant (e.g. /api/media_player_proxy/...)
    const haBase = (this.config.haUrl || '').trim().replace(/\/+$/, '');
    if (!haBase) return rawPic;

    const cleanPath = rawPic.startsWith('/') ? rawPic : `/${rawPic}`;
    let fullUrl = `${haBase}${cleanPath}`;

    // 3. If Home Assistant proxy URL does not include a token and we have an accessToken,
    // append authSig parameter so HA allows unauthenticated <img> tag loading
    if (!fullUrl.includes('token=') && this.config.accessToken) {
      const sep = fullUrl.includes('?') ? '&' : '?';
      fullUrl = `${fullUrl}${sep}authSig=${encodeURIComponent(this.config.accessToken)}`;
    }

    return fullUrl;
  }

  // Send a service call to Home Assistant (e.g. media_player.media_play)
  public async callService(
    domain: string,
    service: string,
    serviceData: Record<string, unknown> = {}
  ): Promise<void> {
    if (!this.connection || this.status !== 'connected') {
      console.warn(`[HA] Cannot call ${domain}.${service} — not connected`);
      return;
    }
    try {
      await this.connection.sendMessagePromise({
        type: 'call_service',
        domain,
        service,
        service_data: serviceData,
      });
    } catch (err) {
      console.error(`[HA] callService ${domain}.${service} failed`, err);
    }
  }

  // Returns list of all detected media_player entities
  public getAvailableMediaPlayers(): Array<{ entity_id: string; friendly_name: string; state: string }> {
    if (!this.entities) return [];
    return Object.keys(this.entities)
      .filter(key => key.startsWith('media_player.'))
      .map(key => ({
        entity_id: key,
        friendly_name: this.entities[key]?.attributes?.friendly_name || key,
        state: this.entities[key]?.state || 'unknown',
      }));
  }

  // Parses active media player entity or provides mock playback
  public parseActiveMediaPlayer(): MediaPlayerData {
    // Search for media_player entities in real HA state if connected
    if (this.status === 'connected' && this.entities) {
      const mediaPlayers = Object.keys(this.entities)
        .filter(key => key.startsWith('media_player.'))
        .map(key => ({ ...this.entities[key], entity_id: key }));

      // 1. Check if user configured a preferred media player
      let active: any = null;
      if (this.config.preferredMediaPlayer) {
        active = mediaPlayers.find(p => p.entity_id === this.config.preferredMediaPlayer);
      }

      // 2. If not specified or preferred is not active, pick highest priority:
      if (!active) {
        // Priority 1: Playing player with album art or title
        active = mediaPlayers.find(p => p.state === 'playing' && (p.attributes?.entity_picture || p.attributes?.media_title));
      }
      if (!active) {
        // Priority 2: Any player that is 'playing'
        active = mediaPlayers.find(p => p.state === 'playing');
      }
      if (!active) {
        // Priority 3: Paused player with album art or title
        active = mediaPlayers.find(p => p.state === 'paused' && (p.attributes?.entity_picture || p.attributes?.media_title));
      }
      if (!active) {
        // Priority 4: Any player that has album art or title
        active = mediaPlayers.find(p => p.attributes?.entity_picture || p.attributes?.media_title);
      }
      if (!active && mediaPlayers.length > 0) {
        active = mediaPlayers[0];
      }

      if (active && active.attributes) {
        const attr = active.attributes;
        const albumArtUrl = this.resolveAlbumArt(attr);

        // HA reports media_position_updated_at as an ISO string; convert to epoch ms
        const updatedAtRaw = attr.media_position_updated_at as string | undefined;
        const positionUpdatedAt = updatedAtRaw ? new Date(updatedAtRaw).getTime() : Date.now();

        return {
          state: (active.state === 'playing' ? 'playing' : active.state === 'paused' ? 'paused' : 'idle'),
          title: attr.media_title || (active.state === 'playing' ? 'Unknown Track' : 'No Media Playing'),
          artist: attr.media_artist || attr.app_name || attr.friendly_name || 'Cast Stream',
          album: attr.media_album_name || '',
          entityPicture: albumArtUrl,
          duration: attr.media_duration || 0,
          position: attr.media_position || 0,
          positionUpdatedAt,
          volume: Math.round((attr.volume_level ?? 0.5) * 100),
          accentColor: '#8b5cf6',
          entityId: active.entity_id,
        };
      }
    }

    // Default simulated now-playing state (ambient synthwave / lofi for evening vibe)
    return {
      state: 'playing',
      title: 'Midnight City (Remastered)',
      artist: 'M83',
      album: 'Hurry Up, We\'re Dreaming',
      entityPicture: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=600&q=80',
      duration: 243,
      position: this.mockPosition,
      positionUpdatedAt: this.mockPositionUpdatedAt,
      volume: 68,
      accentColor: '#8b5cf6',
    };
  }

  public parseSystemHealth(): SystemHealth {
    if (this.status === 'connected' && this.entities) {
      const cpu = Number(this.entities['sensor.processor_use']?.state) || 18;
      const ram = Number(this.entities['sensor.memory_use_percent']?.state) || 34;
      const disk = Number(this.entities['sensor.disk_use_percent']?.state) || 52;
      return {
        cpuUsage: cpu,
        ramUsage: ram,
        diskUsage: disk,
        networkLatencyMs: 14,
        uptimeHours: 312,
        haStatus: this.status,
      };
    }

    return {
      cpuUsage: 14,
      ramUsage: 32,
      diskUsage: 48,
      networkLatencyMs: 9,
      uptimeHours: 184,
      haStatus: this.status,
    };
  }

  private mockPosition = 112;
  private mockPositionUpdatedAt = Date.now();

  private startMockMode(): void {
    this.setStatus('mock');
    this.mockPosition = 112;
    this.mockPositionUpdatedAt = Date.now();
    // Advance mock position every second so the progress bar moves
    this.mockInterval = window.setInterval(() => {
      this.mockPosition = (this.mockPosition + 1) % 243;
      this.mockPositionUpdatedAt = Date.now();
      this.notify();
    }, 1000);
  }
}

export const haService = new HomeAssistantService();
