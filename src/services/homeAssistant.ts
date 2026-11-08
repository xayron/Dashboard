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

  // Parses active media player entity or provides mock playback
  public parseActiveMediaPlayer(): MediaPlayerData {
    // Search for media_player entities in real HA state if connected
    if (this.status === 'connected' && this.entities) {
      const mediaPlayers = Object.keys(this.entities)
        .filter(key => key.startsWith('media_player.'))
        .map(key => this.entities[key]);

      const playing = mediaPlayers.find(p => p.state === 'playing');
      const active = playing || mediaPlayers[0];

      if (active && active.attributes) {
        const attr = active.attributes;
        return {
          state: (active.state === 'playing' ? 'playing' : active.state === 'paused' ? 'paused' : 'idle'),
          title: attr.media_title || 'No Media Playing',
          artist: attr.media_artist || attr.app_name || 'Cast Stream',
          album: attr.media_album_name || '',
          entityPicture: attr.entity_picture ? `${this.config.haUrl}${attr.entity_picture}` : '',
          duration: attr.media_duration || 0,
          position: attr.media_position || 0,
          volume: Math.round((attr.volume_level ?? 0.5) * 100),
          accentColor: '#3b82f6',
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
      position: 112,
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

  private startMockMode(): void {
    this.setStatus('mock');
    // Periodically update mock attributes slightly for lifelike behavior
    let progress = 112;
    this.mockInterval = window.setInterval(() => {
      progress = (progress + 1) % 243;
      this.notify();
    }, 1000);
  }
}

export const haService = new HomeAssistantService();
