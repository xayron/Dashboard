import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type {
  AQIData,
  CalendarEvent,
  DashboardMode,
  F1Data,
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
import { getF1Data } from '../services/f1Service';
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

interface DashboardContextType {
  uiStyle: UIStyle;
  setUiStyle: (style: UIStyle) => void;
  toggleUiStyle: () => void;
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
  isKioskBarVisible: boolean;
  toggleKioskBar: () => void;
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

    const isLightStyle = uiStyle === 'eink' || uiStyle === 'civic';
    document.documentElement.style.colorScheme = isLightStyle ? 'light' : 'dark';

    const currentThemeDef = THEMES[theme] || THEMES.obsidian;
    document.documentElement.style.setProperty('--theme-accent', currentThemeDef.colors.accent);
    document.documentElement.style.setProperty('--theme-border', currentThemeDef.colors.border);
    document.documentElement.style.setProperty('--theme-bg', currentThemeDef.colors.bg);

    if (uiStyle === 'eink') {
      document.body.style.backgroundColor = '#f5f2eb';
    } else if (uiStyle === 'civic') {
      document.body.style.backgroundColor = '#f1f5f9';
    } else if (uiStyle === 'tui') {
      document.body.style.backgroundColor = '#000000';
    } else if (uiStyle === 'brutalist') {
      document.body.style.backgroundColor = '#111111';
    } else if (uiStyle === 'minimal') {
      document.body.style.backgroundColor = '#09090b';
    } else if (uiStyle === 'hud') {
      document.body.style.backgroundColor = '#030712';
    } else if (uiStyle === 'retrowave') {
      document.body.style.backgroundColor = '#150424';
    } else if (uiStyle === 'neumorphic') {
      document.body.style.backgroundColor = '#1a1d24';
    } else if (uiStyle === 'obsidian') {
      document.body.style.backgroundColor = '#050507';
    } else {
      document.body.style.backgroundColor = currentThemeDef.colors.bg;
    }
  }, [theme, uiStyle]);

  const [now, setNow] = useState<Date>(new Date());
  const [manualOverrideMode, setManualOverrideMode] = useState<DashboardMode | null>(null);
  const [isRaceWeekendSimulated, setIsRaceWeekendSimulated] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isKioskBarVisible, setIsKioskBarVisible] = useState<boolean>(true);

  // Data states
  const initialData = getFallbackWeatherAndAQI();
  const [weather, setWeather] = useState<WeatherData>(initialData.weather);
  const [aqi, setAqi] = useState<AQIData>(initialData.aqi);
  const [f1, setF1] = useState<F1Data>(() => ({
    isRaceWeekend: false,
    activeRound: 22,
    totalRounds: 24,
    raceName: 'Las Vegas Grand Prix',
    circuitName: 'Las Vegas Strip Circuit',
    location: 'Las Vegas, NV',
    country: 'United States',
    countryCode: 'US',
    sessions: {
      fp1: { name: 'Practice 1', utcTime: '', istTime: 'Fri 08:00 IST', status: 'upcoming' },
      qualifying: { name: 'Qualifying', utcTime: '', istTime: 'Sat 11:30 IST', status: 'upcoming' },
      race: { name: 'Grand Prix', utcTime: '', istTime: 'Sun 11:30 IST', status: 'upcoming' },
    },
    nextSession: { name: 'Qualifying', istTimeFormatted: 'Saturday • 11:30 IST', diffMs: 50000000, countdownFormatted: '14h 32m' },
    standings: [],
  }));
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
        position: parsed.position,
        localTime: Date.now(),
        state: parsed.state,
      });
      setLivePosition(parsed.position);
      setSystemHealth(haService.parseSystemHealth());
    });
    return () => {
      unsub();
      haService.disconnect();
    };
  }, []);

  // Advance livePosition locally every 500ms when playing (avoids waiting for HA push)
  useEffect(() => {
    if (lastSync.state !== 'playing') {
      setLivePosition(lastSync.position);
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
  }, [lastSync, media.duration]);

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

  // Compute auto calculated mode based on Section 2 State Machine specifications:
  // Priority 1: Race Weekend Mode (Thursday 00:00 through Sunday 23:59 IST of an F1 race week)
  // Priority 2: Evening / Now-Playing Mode (Speaker state == "playing" OR (Time >= Sunset and Time < 23:00))
  // Priority 3: Morning Mode (Time >= 06:00 and Time < 12:00)
  // Priority 4: Ambient Mode (Default idle / afternoon / late night fallback or 5min inactivity)
  const autoCalculatedMode = useMemo<DashboardMode>(() => {
    // Priority 1: Race Weekend
    if (f1.isRaceWeekend || isRaceWeekendSimulated) {
      return 'race';
    }

    // Inactivity timeout: after 5 minutes of no user interaction in the afternoon (12:00 - 17:00), drop to Ambient
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeStr = `${String(currentHours).padStart(2, '0')}:${String(currentMinutes).padStart(2, '0')}`;
    const isFiveMinutesIdle = Date.now() - lastUserInteraction > 5 * 60 * 1000;

    // Priority 2: Evening / Now-Playing Mode
    // Speaker is playing OR Time is between Sunset and 23:00
    const isPlaying = media.state === 'playing';
    const isEveningTime = currentTimeStr >= (weather.sunset || '18:00') && currentHours < 23;

    if (isPlaying || isEveningTime) {
      return 'evening';
    }

    // Priority 3: Morning Mode
    // Time >= 06:00 and Time < 12:00
    if (currentHours >= 6 && currentHours < 12) {
      return 'morning';
    }

    // If afternoon and idle for 5+ min -> Ambient
    if (currentHours >= 12 && isFiveMinutesIdle) {
      return 'ambient';
    }

    // Priority 4: Ambient Mode (Default Idle)
    return 'ambient';
  }, [f1.isRaceWeekend, isRaceWeekendSimulated, media.state, now, weather.sunset, lastUserInteraction]);

  const activeMode = manualOverrideMode || autoCalculatedMode;

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
        isKioskBarVisible,
        toggleKioskBar,
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
