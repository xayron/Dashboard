export type DashboardMode = 'race' | 'evening' | 'morning' | 'ambient' | 'news';
export type UIStyle = 'modern' | 'tui' | 'brutalist' | 'minimal' | 'hud' | 'eink' | 'retrowave' | 'neumorphic' | 'obsidian' | 'civic';
export type ColorMode = 'dark' | 'light';

export type NewsCategory = 'All' | 'Top Stories' | 'World' | 'Tech' | 'Business' | 'Science';

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  category: NewsCategory;
  summary?: string;
  url?: string;
  isBreaking?: boolean;
}

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
  position: number; // in seconds — snapshot from HA at positionUpdatedAt
  positionUpdatedAt: number; // Date.now() when HA last reported position
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

export interface F1ConstructorStanding {
  position: number;
  team: string;
  points: number;
  wins: number;
  teamColor: string;
}

export interface F1LastRacePodium {
  raceName: string;
  circuitName: string;
  winner: string;
  winnerTeam: string;
  p2: string;
  p2Team: string;
  p3: string;
  p3Team: string;
  fastestLapDriver: string;
  fastestLapTime: string;
  fastestLapTeam: string;
}

export interface F1CircuitLapRecord {
  lapTime: string;
  driver: string;
  year: string;
}

export interface F1QualifyingResult {
  raceName: string;
  poleDriver: string;
  poleTeam: string;
  poleTime: string;
  p2Driver: string;
  p2Team: string;
  p2Time: string;
  p3Driver: string;
  p3Team: string;
  p3Time: string;
}

export interface F1PitStopRecord {
  raceName: string;
  team: string;
  driver: string;
  duration: string;
  lap: number;
}

export interface F1TitleBattle {
  leader: string;
  leaderTeam: string;
  leaderPoints: number;
  leaderColor: string;
  contender: string;
  contenderTeam: string;
  contenderPoints: number;
  contenderColor: string;
  pointsGap: number;
  roundsRemaining: number;
  maxPointsAvailable: number;
  teamLeader: string;
  teamContender: string;
  teamLeaderPoints: number;
  teamContenderPoints: number;
  teamPointsGap: number;
}

export interface F1UpcomingRace {
  round: number;
  raceName: string;
  circuitName: string;
  country: string;
  dateStr: string;
  istDate: string;
  countdown: string;
}

export interface F1CircuitTelemetry {
  fullThrottlePercent: number;
  gearShiftsPerLap: number;
  topSpeedKmh: number;
  pitLaneLossSec: number;
  tyreAllocation: string;
}

export interface F1NewsItem {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  timeAgo?: string;
  source: string;
  snippet?: string;
  thumbnail?: string;
}

export type F1WidgetSize = 'compact' | 'normal';

export type F1WidgetId =
  | 'countdown'
  | 'podium'
  | 'titleBattle'
  | 'qualifying'
  | 'pitstop'
  | 'upcomingRaces'
  | 'circuitTelemetry'
  | 'news';

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
    targetDate?: string;
    days?: number;
    hours?: number;
    mins?: number;
    secs?: number;
  };
  standings: F1DriverStanding[];
  constructorStandings?: F1ConstructorStanding[];
  lastRace?: F1LastRacePodium;
  circuitLapRecord?: F1CircuitLapRecord;
  qualifyingResult?: F1QualifyingResult;
  pitStopRecord?: F1PitStopRecord;
  titleBattle?: F1TitleBattle;
  upcomingRaces?: F1UpcomingRace[];
  circuitTelemetry?: F1CircuitTelemetry;
  news?: F1NewsItem[];
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
