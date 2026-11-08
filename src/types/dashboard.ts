export type DashboardMode = 'race' | 'evening' | 'morning' | 'ambient';

export interface HAConnectionConfig {
  haUrl: string;
  accessToken: string;
  useMock: boolean;
  preferredMediaPlayer?: string;
}

export type HAStatus = 'connected' | 'connecting' | 'disconnected' | 'mock';

export interface MediaPlayerData {
  state: 'playing' | 'paused' | 'idle' | 'off';
  title: string;
  artist: string;
  album: string;
  entityPicture: string;
  duration: number; // in seconds
  position: number; // in seconds
  volume: number; // 0 - 100
  accentColor?: string;
  entityId?: string;
}

export interface WeatherData {
  temperature: number;
  apparentTemperature: number;
  condition: string;
  conditionCode: number;
  highTemp: number;
  lowTemp: number;
  rainProbability: number;
  humidity: number;
  uvIndex: number;
  windSpeed: number;
  sunrise: string; // HH:mm
  sunset: string; // HH:mm
  isDay: boolean;
  hourly: Array<{
    time: string; // e.g. "09:00"
    temp: number;
    pop: number; // prob of precip %
    conditionCode: number;
  }>;
  daily: Array<{
    day: string; // "Mon", "Tue"
    date: string;
    high: number;
    low: number;
    conditionCode: number;
    rainProb: number;
  }>;
}

export interface AQIData {
  pm25: number;
  pm10: number;
  usAqi: number;
  label: 'Good' | 'Moderate' | 'Unhealthy for Sensitive' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
  color: string;
}

export interface F1Session {
  name: string;
  utcTime: string;
  istTime: string;
  status: 'upcoming' | 'live' | 'completed';
}

export interface F1DriverStanding {
  position: number;
  driver: string;
  driverCode: string;
  team: string;
  points: number;
  number: number;
  teamColor: string;
}

export interface F1Data {
  isRaceWeekend: boolean;
  activeRound: number;
  totalRounds: number;
  raceName: string;
  circuitName: string;
  location: string;
  country: string;
  countryCode: string;
  circuitMapUrl?: string;
  sessions: {
    fp1?: F1Session;
    fp2?: F1Session;
    fp3?: F1Session;
    sprintQualifying?: F1Session;
    sprint?: F1Session;
    qualifying?: F1Session;
    race: F1Session;
  };
  nextSession: {
    name: string;
    istTimeFormatted: string;
    diffMs: number;
    countdownFormatted: string;
  };
  standings: F1DriverStanding[];
}

export interface FinanceItem {
  id: string;
  symbol: string;
  name: string;
  price: string;
  change: number;
  changePercent: number;
  currency: string;
  sparkline: number[];
  unit?: string;
}

export type PhotoOrientation = 'landscape' | 'standard' | 'portrait';

export interface PhotoItem {
  id: string;
  url: string;
  thumbnailUrl?: string;
  title: string;
  location?: string;
  aspectRatio: number; // width / height
  orientation: PhotoOrientation;
  credit?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string; // ISO or HH:mm
  endTime: string;
  isAllDay: boolean;
  location?: string;
  category: 'work' | 'personal' | 'fitness' | 'reminder';
}

export interface TodoTask {
  id: string;
  title: string;
  completed: boolean;
  dueTime?: string;
  priority: 'high' | 'medium' | 'low';
}

export interface SystemHealth {
  cpuUsage: number; // percentage
  ramUsage: number; // percentage
  diskUsage: number; // percentage
  networkLatencyMs: number;
  uptimeHours: number;
  haStatus: HAStatus;
}
