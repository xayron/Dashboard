import {
  createConnection,
  subscribeEntities,
  callService as wsCallService,
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

const MOCK_PLAYLIST: Array<Omit<MediaPlayerData, 'position' | 'positionUpdatedAt' | 'state' | 'volume'>> = [
  {
    title: 'Midnight City (Remastered)',
    artist: 'M83',
    album: "Hurry Up, We're Dreaming",
    entityPicture: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=600&q=80',
    duration: 243,
    accentColor: '#8b5cf6',
    entityId: 'media_player.mock_living_room',
  },
  {
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    entityPicture: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    duration: 200,
    accentColor: '#ef4444',
    entityId: 'media_player.mock_living_room',
  },
  {
    title: 'Resonance',
    artist: 'HOME',
    album: 'Odyssey',
    entityPicture: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    duration: 212,
    accentColor: '#06b6d4',
    entityId: 'media_player.mock_living_room',
  },
];

export class HomeAssistantService {
  private connection: Connection | null = null;
  private status: HAStatus = 'disconnected';
  private entities: HassEntities = {};
  private listeners: Array<(entities: HassEntities, status: HAStatus) => void> = [];
  private config: HAConnectionConfig;
  private mockInterval: number | null = null;

  // Mock player state
  private mockIndex = 0;
  private mockPlaying = false;
  private mockPosition = 0;
  private mockVolume = 68;

  constructor() {
    this.config = getSavedHAConfig();
  }

  public subscribe(listener: (entities: HassEntities, status: HAStatus) => void): () => void {
    this.listeners.push(listener);
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
    const rawPic = attr.entity_picture || attr.entity_picture_local || attr.media_image_url || attr.album_art;
    if (!rawPic || typeof rawPic !== 'string') return '';

    if (/^https?:\/\//i.test(rawPic)) {
      return rawPic;
    }

    const haBase = (this.config.haUrl || '').trim().replace(/\/+$/, '');
    if (!haBase) return rawPic;

    const cleanPath = rawPic.startsWith('/') ? rawPic : `/${rawPic}`;
    let fullUrl = `${haBase}${cleanPath}`;

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
    serviceData: Record<string, unknown> = {},
    target?: { entity_id?: string | string[] }
  ): Promise<void> {
    if (!this.connection || this.status !== 'connected') {
      console.warn(`[HA] Cannot call ${domain}.${service} — not connected to real HA`);
      return;
    }
    try {
      const mergedData = { ...serviceData };
      if (target?.entity_id && !mergedData.entity_id) {
        mergedData.entity_id = target.entity_id;
      }
      await wsCallService(this.connection, domain, service, mergedData, target);
    } catch (err) {
      console.error(`[HA] callService ${domain}.${service} failed`, err);
    }
  }

  // Controls simulated mock media
  public controlMockMedia(
    action: 'play' | 'pause' | 'toggle' | 'next' | 'prev' | 'volume' | 'seek',
    value?: number
  ): void {
    if (action === 'toggle') {
      this.mockPlaying = !this.mockPlaying;
      if (!this.mockPlaying) this.mockPosition = 0;
    } else if (action === 'play') {
      this.mockPlaying = true;
    } else if (action === 'pause') {
      this.mockPlaying = false;
      this.mockPosition = 0;
    } else if (action === 'next') {
      this.mockIndex = (this.mockIndex + 1) % MOCK_PLAYLIST.length;
      this.mockPosition = 0;
      this.mockPlaying = true;
    } else if (action === 'prev') {
      this.mockIndex = (this.mockIndex - 1 + MOCK_PLAYLIST.length) % MOCK_PLAYLIST.length;
      this.mockPosition = 0;
      this.mockPlaying = true;
    } else if (action === 'volume' && value !== undefined) {
      this.mockVolume = Math.max(0, Math.min(100, Math.round(value)));
    } else if (action === 'seek' && value !== undefined) {
      const cur = MOCK_PLAYLIST[this.mockIndex];
      this.mockPosition = Math.max(0, Math.min(cur.duration, Math.round(value)));
    }
    this.notify();
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

      let active: any = null;
      if (this.config.preferredMediaPlayer) {
        const preferred = mediaPlayers.find(p => p.entity_id === this.config.preferredMediaPlayer);
        if (preferred && preferred.state === 'playing') {
          active = preferred;
        }
      }

      if (!active) {
        active = mediaPlayers.find(p => p.state === 'playing' && (p.attributes?.entity_picture || p.attributes?.media_title));
      }
      if (!active) {
        active = mediaPlayers.find(p => p.state === 'playing');
      }

      // If no media is actively playing in real HA
      if (!active || active.state !== 'playing') {
        const fallbackEntityId = this.config.preferredMediaPlayer || mediaPlayers[0]?.entity_id || 'media_player.living_room';
        return {
          state: 'idle',
          title: '',
          artist: '',
          album: '',
          entityPicture: '',
          duration: 0,
          position: 0,
          positionUpdatedAt: Date.now(),
          volume: 50,
          accentColor: '#8b5cf6',
          entityId: fallbackEntityId,
        };
      }

      const attr = active.attributes || {};
      const albumArtUrl = this.resolveAlbumArt(attr);

      let positionUpdatedAt = Date.now();
      if (attr.media_position_updated_at) {
        const parsed = new Date(attr.media_position_updated_at).getTime();
        if (!isNaN(parsed)) {
          positionUpdatedAt = parsed;
        }
      }

      return {
        state: 'playing',
        title: attr.media_title || 'Unknown Track',
        artist: attr.media_artist || attr.app_name || attr.friendly_name || 'Cast Stream',
        album: attr.media_album_name || '',
        entityPicture: albumArtUrl,
        duration: attr.media_duration || 0,
        position: attr.media_position ?? 0,
        positionUpdatedAt,
        volume: Math.round((attr.volume_level ?? 0.5) * 100),
        accentColor: '#8b5cf6',
        entityId: active.entity_id,
      };
    }

    // Mock Mode fallback
    if (!this.mockPlaying) {
      return {
        state: 'idle',
        title: '',
        artist: '',
        album: '',
        entityPicture: '',
        duration: 0,
        position: 0,
        positionUpdatedAt: Date.now(),
        volume: this.mockVolume,
        accentColor: '#8b5cf6',
        entityId: 'media_player.mock_living_room',
      };
    }

    const currentMock = MOCK_PLAYLIST[this.mockIndex] || MOCK_PLAYLIST[0];
    return {
      state: 'playing',
      title: currentMock.title,
      artist: currentMock.artist,
      album: currentMock.album,
      entityPicture: currentMock.entityPicture,
      duration: currentMock.duration,
      position: this.mockPosition,
      positionUpdatedAt: Date.now(),
      volume: this.mockVolume,
      accentColor: currentMock.accentColor,
      entityId: currentMock.entityId || 'media_player.mock_living_room',
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

  private startMockMode(): void {
    this.setStatus('mock');
    if (this.mockInterval) clearInterval(this.mockInterval);
    this.mockInterval = window.setInterval(() => {
      if (this.mockPlaying) {
        const cur = MOCK_PLAYLIST[this.mockIndex] || MOCK_PLAYLIST[0];
        this.mockPosition = (this.mockPosition + 1) % (cur.duration || 240);
        this.notify();
      }
    }, 1000);
  }
}

export const haService = new HomeAssistantService();
