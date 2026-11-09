import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type {
  AQIData,
  CalendarEvent,
  ColorMode,
  DashboardMode,
  F1Data,
  F1WidgetId,
  F1WidgetSize,
  FinanceItem,
  MediaPlayerData,
  PhotoItem,
  SystemHealth,
  TodoTask,
  UIStyle,
  WeatherData,
} from '../types/dashboard';
import { haService } from '../services/homeAssistant';
import { fetchWeatherData, getFallbackWeatherAndAQI } from '../services/weatherService';
import { getF1Data, getFallbackF1Data } from '../services/f1Service';
import { getFinanceData } from '../services/financeService';
import { photoService } from '../services/photoService';
import { getCalendarEvents, getTodoTasks } from '../services/calendarService';

import { THEMES, type ThemeId, type ThemeDefinition } from '../types/theme';

export interface UIStyleInfo {
  id: UIStyle;
  name: string;
  tagline: string;
  description: string;
}

export const UI_STYLES: UIStyleInfo[] = [
  {
    id: 'modern',
    name: 'Modern Glass',
    tagline: 'Glassmorphism & Depth',
    description: 'Translucent frosted glass panels with dynamic ambient glow and smooth blurs.',
  },
  {
    id: 'tui',
    name: 'Retro Terminal',
    tagline: 'Phosphor Green Monospace',
    description: 'NCurses ASCII command center with block graphs and pure terminal aesthetics.',
  },
  {
    id: 'brutalist',
    name: 'Neo-Brutalist',
    tagline: 'High-Impact Industrial',
    description: 'Solid contrast borders, offset hard drop-shadows, and vivid pop stickers.',
  },
  {
    id: 'minimal',
    name: 'Swiss Minimal',
    tagline: 'Architectural Typographic',
    description: 'Ultra-thin hairline dividers, oversized clean numerals, and zero visual clutter.',
  },
  {
    id: 'hud',
    name: 'Cyber HUD',
    tagline: 'Tactical Cockpit Avionics',
    description: 'Sci-fi telemetry cockpit with targeting reticles, corner brackets, and cyan meters.',
  },
  {
    id: 'eink',
    name: 'Paper & Ink',
    tagline: 'Warm E-Paper Editorial',
    description: 'Serif newspaper typography, warm matte paper, and crisp ink borders.',
  },
  {
    id: 'retrowave',
    name: '80s Synthwave',
    tagline: 'Outrun Neon Glow',
    description: 'Deep midnight indigo, hot laser magenta, electric cyan, and sunset gradients.',
  },
  {
    id: 'neumorphic',
    name: 'Soft Neumorphic',
    tagline: 'Embossed Tactile Titanium',
    description: 'Soft sculpted matte surfaces with dual inner/outer shadows and physical buttons.',
  },
  {
    id: 'obsidian',
    name: 'Stealth Facet',
    tagline: 'Crystalline Dark Monolith',
    description: 'Void black surfaces with razor lit facet borders, cryptographic telemetry, and emerald status indicators.',
  },
  {
    id: 'civic',
    name: 'Public Gazette',
    tagline: 'Institutional Data Ledger',
    description: 'High-contrast institutional layout with crisp white scorecards, tricolor accents, and official audit typography.',
  },
];

const UI_STYLE_ORDER: UIStyle[] = ['modern', 'tui', 'brutalist', 'minimal', 'hud', 'eink', 'retrowave', 'neumorphic', 'obsidian', 'civic'];

export type SettingsLayout = 'drawer' | 'modal';

export const DEFAULT_F1_WIDGETS: F1WidgetId[] = [
  'countdown',
  'podium',
  'titleBattle',
  'pitstop',
  'qualifying',
];

export const DEFAULT_F1_WIDGET_SIZES: Record<F1WidgetId, F1WidgetSize> = {
  countdown: 'normal',
  podium: 'normal',
  titleBattle: 'normal',
  qualifying: 'normal',
  pitstop: 'normal',
  upcomingRaces: 'normal',
  circuitTelemetry: 'normal',
};

interface DashboardContextType {
  uiStyle: UIStyle;
  setUiStyle: (style: UIStyle) => void;
  toggleUiStyle: () => void;
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
  toggleColorMode: () => void;
  theme: ThemeId;
  themeDef: ThemeDefinition;
  setTheme: (theme: ThemeId) => void;
  activeMode: DashboardMode;
  autoCalculatedMode: DashboardMode;
  manualOverrideMode: DashboardMode | null;
  setManualOverrideMode: (mode: DashboardMode | null) => void;
  isRaceWeekendSimulated: boolean;
  setIsRaceWeekendSimulated: (val: boolean) => void;
  now: Date;
  weather: WeatherData;
  aqi: AQIData;
  f1: F1Data;
  media: MediaPlayerData;
  /** Computed live position in seconds (advances locally every second between HA pushes) */
  livePosition: number;
  mediaControl: (action: 'play' | 'pause' | 'toggle' | 'next' | 'prev' | 'volume' | 'seek', value?: number) => void;
  finance: FinanceItem[];
  currentPhoto: PhotoItem;
  photoProgress: number; // 0 to 100 for the 15-second timer bar
  nextPhoto: () => void;
  prevPhoto: () => void;
  events: CalendarEvent[];
  tasks: TodoTask[];
  toggleTask: (id: string) => void;
  systemHealth: SystemHealth;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  settingsLayout: SettingsLayout;
  setSettingsLayout: (layout: SettingsLayout) => void;
  toggleSettingsLayout: () => void;
  isKioskBarVisible: boolean;
  toggleKioskBar: () => void;
  f1ActiveWidgets: F1WidgetId[];
  setF1ActiveWidgets: (widgets: F1WidgetId[]) => void;
  toggleF1Widget: (id: F1WidgetId) => void;
  f1WidgetSizes: Record<F1WidgetId, F1WidgetSize>;
  setF1WidgetSize: (id: F1WidgetId, size: F1WidgetSize) => void;
  setAllF1WidgetSizes: (size: F1WidgetSize) => void;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [uiStyle, setUiStyleState] = useState<UIStyle>(() => {
    try {
      const saved = localStorage.getItem('dashboard_ui_style') as UIStyle;
      if (UI_STYLE_ORDER.includes(saved)) return saved;
    } catch (e) {}
    return 'modern';
  });

  const setUiStyle = (s: UIStyle) => {
    setUiStyleState(s);
    try {
      localStorage.setItem('dashboard_ui_style', s);
    } catch (e) {}
  };

  const toggleUiStyle = () => {
    const nextIdx = (UI_STYLE_ORDER.indexOf(uiStyle) + 1) % UI_STYLE_ORDER.length;
    setUiStyle(UI_STYLE_ORDER[nextIdx]);
  };

  const [colorMode, setColorModeState] = useState<ColorMode>(() => {
    try {
      const saved = localStorage.getItem('dashboard_color_mode') as ColorMode;
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {}
    return 'dark';
  });

  const setColorMode = (m: ColorMode) => {
    setColorModeState(m);
    try {
      localStorage.setItem('dashboard_color_mode', m);
    } catch (e) {}
  };

  const toggleColorMode = () => {
    setColorMode(colorMode === 'dark' ? 'light' : 'dark');
  };

  const [theme, setThemeState] = useState<ThemeId>(() => {
    try {
      const saved = localStorage.getItem('dashboard_theme') as ThemeId;
      if (saved && THEMES[saved]) return saved;
    } catch (e) {}
    return 'obsidian';
  });

  const setTheme = (t: ThemeId) => {
    setThemeState(t);
    try {
      localStorage.setItem('dashboard_theme', t);
    } catch (e) {}
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-style', uiStyle);
    document.documentElement.setAttribute('data-color-mode', colorMode);

    const isLight = colorMode === 'light';
    document.documentElement.style.colorScheme = isLight ? 'light' : 'dark';

    const currentThemeDef = THEMES[theme] || THEMES.obsidian;
    const activeColors = isLight ? currentThemeDef.lightColors : currentThemeDef.colors;

    document.documentElement.style.setProperty('--theme-accent', activeColors.accent);
    document.documentElement.style.setProperty('--color-accent', activeColors.accent);
    const contrastColor = isLight
      ? '#ffffff'
      : (theme === 'amber' || theme === 'nordic' || theme === 'emerald' || theme === 'monochrome')
        ? '#000000'
        : '#ffffff';
    document.documentElement.style.setProperty('--color-accent-contrast', contrastColor);
    document.documentElement.style.setProperty('--theme-border', activeColors.border);
    document.documentElement.style.setProperty('--theme-bg', activeColors.bg);
    document.documentElement.style.setProperty('--color-bg-base', activeColors.bg);
    document.documentElement.style.setProperty('--color-panel-bg', activeColors.card);

    document.body.style.backgroundColor = activeColors.bg;
  }, [theme, uiStyle, colorMode]);

  const [now, setNow] = useState<Date>(new Date());
  const [manualOverrideMode, setManualOverrideMode] = useState<DashboardMode | null>(null);
  const [isRaceWeekendSimulated, setIsRaceWeekendSimulated] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [settingsLayout, setSettingsLayoutState] = useState<SettingsLayout>(() => {
    try {
      const saved = localStorage.getItem('dashboard_settings_layout') as SettingsLayout;
      if (saved === 'drawer' || saved === 'modal') return saved;
    } catch (e) {}
    return 'drawer'; // Default to right-side drawer
  });

  const setSettingsLayout = (l: SettingsLayout) => {
    setSettingsLayoutState(l);
    try {
      localStorage.setItem('dashboard_settings_layout', l);
    } catch (e) {}
  };

  const toggleSettingsLayout = () => {
    setSettingsLayout(settingsLayout === 'drawer' ? 'modal' : 'drawer');
  };

  const [isKioskBarVisible, setIsKioskBarVisible] = useState<boolean>(true);

  // F1 Custom Widgets state
  const [f1ActiveWidgets, setF1ActiveWidgetsState] = useState<F1WidgetId[]>(() => {
    try {
      const saved = localStorage.getItem('dashboard_f1_active_widgets');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_F1_WIDGETS;
  });

  const setF1ActiveWidgets = (widgets: F1WidgetId[]) => {
    setF1ActiveWidgetsState(widgets);
    try {
      localStorage.setItem('dashboard_f1_active_widgets', JSON.stringify(widgets));
    } catch (e) {}
  };

  const toggleF1Widget = (id: F1WidgetId) => {
    const next = f1ActiveWidgets.includes(id)
      ? f1ActiveWidgets.filter(w => w !== id)
      : [...f1ActiveWidgets, id];
    setF1ActiveWidgets(next);
  };

  const [f1WidgetSizes, setF1WidgetSizesState] = useState<Record<F1WidgetId, F1WidgetSize>>(() => {
    try {
      const saved = localStorage.getItem('dashboard_f1_widget_sizes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed === 'object' && parsed !== null) {
          return { ...DEFAULT_F1_WIDGET_SIZES, ...parsed };
        }
      }
    } catch (e) {}
    return DEFAULT_F1_WIDGET_SIZES;
  });

  const setF1WidgetSize = (id: F1WidgetId, size: F1WidgetSize) => {
    setF1WidgetSizesState(prev => {
      const next = { ...prev, [id]: size };
      try {
        localStorage.setItem('dashboard_f1_widget_sizes', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const setAllF1WidgetSizes = (size: F1WidgetSize) => {
    const next: Record<F1WidgetId, F1WidgetSize> = {
      countdown: size,
      podium: size,
      titleBattle: size,
      qualifying: size,
      pitstop: size,
      upcomingRaces: size,
      circuitTelemetry: size,
    };
    setF1WidgetSizesState(next);
    try {
      localStorage.setItem('dashboard_f1_widget_sizes', JSON.stringify(next));
    } catch (e) {}
  };

  // Data states
  const initialData = getFallbackWeatherAndAQI();
  const [weather, setWeather] = useState<WeatherData>(initialData.weather);
  const [aqi, setAqi] = useState<AQIData>(initialData.aqi);
  const [f1, setF1] = useState<F1Data>(() => getFallbackF1Data());
  const [media, setMedia] = useState<MediaPlayerData>(() => haService.parseActiveMediaPlayer());
  // livePosition ticks forward locally every second between HA WebSocket pushes
  const [livePosition, setLivePosition] = useState<number>(0);
  const [finance, setFinance] = useState<FinanceItem[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [tasks, setTasks] = useState<TodoTask[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>(() => haService.parseSystemHealth());

  // Photo carousel state (15-second rotation)
  const [currentPhoto, setCurrentPhoto] = useState<PhotoItem>(() => photoService.getCurrentPhoto());
  const [photoProgress, setPhotoProgress] = useState<number>(0);

  // Inactivity tracking for 5-minute ambient timeout
  const [lastUserInteraction, setLastUserInteraction] = useState<number>(Date.now());

  // Record user interactions for ambient timeout
  useEffect(() => {
    const handleActivity = () => {
      setLastUserInteraction(Date.now());
    };
    window.addEventListener('mousemove', handleActivity, { passive: true });
    window.addEventListener('keydown', handleActivity, { passive: true });
    window.addEventListener('touchstart', handleActivity, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, []);

  // Keyboard shortcut: 'm' toggles mode selector / kiosk bar, 's' toggles settings
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'm' || e.key === 'M') {
        setIsKioskBarVisible(prev => !prev);
      } else if (e.key === 's' || e.key === 'S') {
        setIsSettingsOpen(prev => !prev);
      } else if (e.key === 't' || e.key === 'T') {
        toggleUiStyle();
      } else if (e.key === 'd' || e.key === 'D') {
        toggleColorMode();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // 1-second clock tick
  useEffect(() => {
    const clockTimer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(clockTimer);
  }, []);

  // Photo carousel timer: 15 seconds cycle with progress bar updates every 100ms
  useEffect(() => {
    const CYCLE_MS = 15000;
    const INTERVAL_MS = 100;
    const step = (INTERVAL_MS / CYCLE_MS) * 100;

    const timer = setInterval(() => {
      setPhotoProgress(prev => {
        if (prev >= 100) {
          setCurrentPhoto(photoService.advance());
          return 0;
        }
        return prev + step;
      });
    }, INTERVAL_MS);

    return () => clearInterval(timer);
  }, []);

  // Local timestamp when media state was received/updated for accurate local interpolation
  const [lastSync, setLastSync] = useState<{ position: number; localTime: number; state: string }>({
    position: media.position,
    localTime: Date.now(),
    state: media.state,
  });

  // Subscribe to Home Assistant service
  useEffect(() => {
    haService.connect();
    const unsub = haService.subscribe((_entities, _status) => {
      const parsed = haService.parseActiveMediaPlayer();
      setMedia(parsed);
      setLastSync({
        position: parsed.state === 'playing' ? parsed.position : 0,
        localTime: Date.now(),
        state: parsed.state,
      });
      setLivePosition(parsed.state === 'playing' ? parsed.position : 0);
      setSystemHealth(haService.parseSystemHealth());
    });
    return () => {
      unsub();
      haService.disconnect();
    };
  }, []);

  // Advance livePosition locally every 500ms when playing (avoids waiting for HA push)
  useEffect(() => {
    if (media.state !== 'playing' || lastSync.state !== 'playing') {
      setLivePosition(0);
      return;
    }
    const updateTick = () => {
      const elapsed = (Date.now() - lastSync.localTime) / 1000;
      const nextPos = Math.min(lastSync.position + Math.max(0, elapsed), media.duration || 999999);
      setLivePosition(nextPos);
    };
    updateTick();
    const id = setInterval(updateTick, 500);
    return () => clearInterval(id);
  }, [lastSync, media.duration, media.state]);

  // Media player control — supports both live Home Assistant & simulated mock mode
  const mediaControl = (
    action: 'play' | 'pause' | 'toggle' | 'next' | 'prev' | 'volume' | 'seek',
    value?: number
  ) => {
    // If in mock mode, route directly to mock media controller
    if (haService.getStatus() === 'mock') {
      haService.controlMockMedia(action, value);
      const updated = haService.parseActiveMediaPlayer();
      setMedia(updated);
      setLastSync({
        position: updated.position,
        localTime: Date.now(),
        state: updated.state,
      });
      setLivePosition(updated.position);
      return;
    }

    const entityId = media.entityId;
    if (!entityId) {
      console.warn('[HA] No media player entityId available to control');
      return;
    }

    const target = { entity_id: entityId };

    if (action === 'toggle') {
      const nextState = media.state === 'playing' ? 'paused' : 'playing';
      setMedia(m => ({ ...m, state: nextState }));
      setLastSync(s => ({ ...s, state: nextState, localTime: Date.now() }));
      haService.callService('media_player', 'media_play_pause', {}, target);
    } else if (action === 'play') {
      setMedia(m => ({ ...m, state: 'playing' }));
      setLastSync(s => ({ ...s, state: 'playing', localTime: Date.now() }));
      haService.callService('media_player', 'media_play', {}, target);
    } else if (action === 'pause') {
      setMedia(m => ({ ...m, state: 'paused' }));
      setLastSync(s => ({ ...s, state: 'paused', localTime: Date.now() }));
      haService.callService('media_player', 'media_pause', {}, target);
    } else if (action === 'next') {
      haService.callService('media_player', 'media_next_track', {}, target);
    } else if (action === 'prev') {
      haService.callService('media_player', 'media_previous_track', {}, target);
    } else if (action === 'volume' && value !== undefined) {
      const vol = Math.max(0, Math.min(100, Math.round(value)));
      setMedia(m => ({ ...m, volume: vol }));
      haService.callService('media_player', 'volume_set', { volume_level: vol / 100 }, target);
    } else if (action === 'seek' && value !== undefined) {
      const seekSec = Math.max(0, Math.min(media.duration || 9999, value));
      setLivePosition(seekSec);
      setLastSync({ position: seekSec, localTime: Date.now(), state: media.state });
      haService.callService('media_player', 'media_seek', { seek_position: seekSec }, target);
    }
  };

  // Periodic data refresh
  useEffect(() => {
    const loadWeather = async () => {
      const data = await fetchWeatherData();
      setWeather(data.weather);
      setAqi(data.aqi);
    };

    const loadF1 = async () => {
      const data = await getF1Data(isRaceWeekendSimulated);
      setF1(data);
    };

    const loadFinance = async () => {
      const data = await getFinanceData();
      setFinance(data);
    };

    const loadCalendarAndTasks = async () => {
      const [evts, tsks] = await Promise.all([getCalendarEvents(), getTodoTasks()]);
      setEvents(evts);
      setTasks(tsks);
    };

    const loadPhotos = async () => {
      const photos = await photoService.initPhotos();
      if (photos.length > 0) {
        setCurrentPhoto(photoService.getCurrentPhoto());
      }
    };

    loadWeather();
    loadF1();
    loadFinance();
    loadCalendarAndTasks();
    loadPhotos();

    const weatherTimer = setInterval(loadWeather, 15 * 60 * 1000);
    const f1Timer = setInterval(loadF1, 10 * 60 * 1000);
    const financeTimer = setInterval(loadFinance, 60 * 1000);

    return () => {
      clearInterval(weatherTimer);
      clearInterval(f1Timer);
      clearInterval(financeTimer);
    };
  }, [isRaceWeekendSimulated]);

  // Compute auto calculated mode based on State Machine specifications:
  // Priority 1: Race Weekend Mode (Thursday 00:00 through Sunday 23:59 IST of an F1 race week)
  // Priority 2: Media Playing Mode (Speaker state == "playing" ONLY)
  // Priority 3: Morning Mode (Time >= 06:00 and Time < 12:00)
  // Priority 4: Ambient Mode (Default idle / afternoon / evening / late night fallback or 5min inactivity)
  const autoCalculatedMode = useMemo<DashboardMode>(() => {
    // Priority 1: Race Weekend
    if (f1.isRaceWeekend || isRaceWeekendSimulated) {
      return 'race';
    }

    // Priority 2: Media Playing Mode (ONLY when media is actively playing)
    if (media.state === 'playing') {
      return 'evening';
    }

    // Inactivity timeout: after 5 minutes of no user interaction in the afternoon (12:00 - 17:00), drop to Ambient
    const currentHours = now.getHours();
    const isFiveMinutesIdle = Date.now() - lastUserInteraction > 5 * 60 * 1000;

    // Priority 3: Morning Mode (Time >= 06:00 and Time < 12:00)
    if (currentHours >= 6 && currentHours < 12) {
      return 'morning';
    }

    // If afternoon and idle for 5+ min -> Ambient
    if (currentHours >= 12 && isFiveMinutesIdle) {
      return 'ambient';
    }

    // Priority 4: Ambient Mode (Default Idle)
    return 'ambient';
  }, [f1.isRaceWeekend, isRaceWeekendSimulated, media.state, now, lastUserInteraction]);

  // Remove the media playing page when media is not playing
  const resolvedManualMode = (manualOverrideMode === 'evening' && media.state !== 'playing')
    ? null
    : manualOverrideMode;

  const activeMode = (resolvedManualMode || autoCalculatedMode) === 'evening' && media.state !== 'playing'
    ? 'ambient'
    : (resolvedManualMode || autoCalculatedMode);

  const nextPhoto = () => {
    setCurrentPhoto(photoService.advance());
    setPhotoProgress(0);
  };

  const prevPhoto = () => {
    const photos = photoService.getPhotos();
    const curIdx = photos.findIndex(p => p.id === currentPhoto.id);
    const prevIdx = (curIdx - 1 + photos.length) % photos.length;
    setCurrentPhoto(photoService.goToIndex(prevIdx));
    setPhotoProgress(0);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const toggleKioskBar = () => {
    setIsKioskBarVisible(prev => !prev);
  };

  return (
    <DashboardContext.Provider
      value={{
        uiStyle,
        setUiStyle,
        toggleUiStyle,
        colorMode,
        setColorMode,
        toggleColorMode,
        theme,
        themeDef: THEMES[theme] || THEMES.obsidian,
        setTheme,
        activeMode,
        autoCalculatedMode,
        manualOverrideMode,
        setManualOverrideMode,
        isRaceWeekendSimulated,
        setIsRaceWeekendSimulated,
        now,
        weather,
        aqi,
        f1,
        media,
        livePosition,
        mediaControl,
        finance,
        currentPhoto,
        photoProgress,
        nextPhoto,
        prevPhoto,
        events,
        tasks,
        toggleTask,
        systemHealth,
        isSettingsOpen,
        setIsSettingsOpen,
        settingsLayout,
        setSettingsLayout,
        toggleSettingsLayout,
        isKioskBarVisible,
        toggleKioskBar,
        f1ActiveWidgets,
        setF1ActiveWidgets,
        toggleF1Widget,
        f1WidgetSizes,
        setF1WidgetSize,
        setAllF1WidgetSizes,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
};
