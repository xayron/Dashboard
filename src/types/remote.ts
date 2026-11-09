import type {
  ColorMode,
  DashboardMode,
  F1WidgetId,
  UIStyle,
} from './dashboard';
import type { ThemeId } from './theme';

export type SettingsLayout = 'drawer' | 'modal';

export interface RemoteMediaState {
  title: string;
  artist: string;
  album: string;
  entityId: string;
  state: 'playing' | 'paused' | 'idle' | 'off';
  volume: number; // 0 to 1
  position: number; // seconds
  duration: number; // seconds
  entityPicture?: string;
}

export interface RemoteWeatherState {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  highTemp: number;
  lowTemp: number;
  rainProbability: number;
}

export interface RemoteTask {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface RemoteSystemHealth {
  haConnected: boolean;
  haStatus: 'connected' | 'mock' | 'disconnected' | 'connecting';
  networkLatencyMs: number;
  lastHeartbeat: string;
}

export interface DashboardStateSnapshot {
  activeMode: DashboardMode;
  autoCalculatedMode: DashboardMode;
  manualOverrideMode: DashboardMode | null;
  isRaceWeekendSimulated: boolean;
  theme: ThemeId;
  uiStyle: UIStyle;
  colorMode: ColorMode;
  settingsLayout: SettingsLayout;
  isKioskBarVisible: boolean;
  isSettingsOpen: boolean;
  f1ActiveWidgets: F1WidgetId[];
  f1AutoFit: boolean;
  media: RemoteMediaState;
  weather: RemoteWeatherState;
  tasks: RemoteTask[];
  systemHealth: RemoteSystemHealth;
  connectedRemotesCount?: number;
}

export type RemoteCommand =
  | { type: 'SET_MODE'; mode: DashboardMode | null }
  | { type: 'SET_RACE_SIMULATION'; enabled: boolean }
  | {
      type: 'MEDIA_CONTROL';
      action: 'play' | 'pause' | 'toggle' | 'next' | 'prev' | 'volume' | 'seek';
      value?: number;
    }
  | { type: 'SET_THEME'; theme: ThemeId }
  | { type: 'SET_UI_STYLE'; style: UIStyle }
  | { type: 'SET_COLOR_MODE'; mode: ColorMode }
  | { type: 'TOGGLE_F1_WIDGET'; id: F1WidgetId }
  | { type: 'SET_F1_AUTOFIT'; enabled: boolean }
  | { type: 'TOGGLE_TASK'; id: string }
  | { type: 'ADD_TASK'; text: string }
  | { type: 'TOGGLE_KIOSK_BAR' }
  | { type: 'TOGGLE_SETTINGS'; open?: boolean }
  | { type: 'SYSTEM_COMMAND'; command: 'reload' | 'dpms_sleep' | 'dpms_wake' }
  | { type: 'REQUEST_SNAPSHOT' };

export type HubMessage =
  | { type: 'STATE_UPDATE'; state: Partial<DashboardStateSnapshot> }
  | { type: 'COMMAND'; command: RemoteCommand }
  | { type: 'CLIENT_COUNT'; count: number };
