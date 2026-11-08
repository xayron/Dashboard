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
  WeatherData,
} from '../types/dashboard';
import { haService } from '../services/homeAssistant';
import { fetchWeatherData, getFallbackWeatherAndAQI } from '../services/weatherService';
import { getF1Data } from '../services/f1Service';
import { getFinanceData } from '../services/financeService';
import { photoService } from '../services/photoService';
import { getCalendarEvents, getTodoTasks } from '../services/calendarService';

interface DashboardContextType {
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

  // Subscribe to Home Assistant service
  useEffect(() => {
    haService.connect();
    const unsub = haService.subscribe((_entities, _status) => {
      setMedia(haService.parseActiveMediaPlayer());
      setSystemHealth(haService.parseSystemHealth());
    });
    return () => {
      unsub();
      haService.disconnect();
    };
  }, []);

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
