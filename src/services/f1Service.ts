import type {
  F1Data,
  F1DriverStanding,
  F1ConstructorStanding,
  F1LastRacePodium,
  F1CircuitLapRecord,
  F1Session,
  F1QualifyingResult,
  F1PitStopRecord,
  F1TitleBattle,
  F1UpcomingRace,
  F1CircuitTelemetry,
  F1NewsItem,
} from '../types/dashboard';

const JOLPICA_BASE = 'https://api.jolpi.ca/ergast/f1';

// Convert UTC ISO timestamp string to IST (UTC+5:30) formatted string
export const formatToIST = (dateStr?: string, timeStr?: string): { formatted: string; dateObj: Date } => {
  if (!dateStr) {
    const d = new Date();
    return { formatted: 'TBD', dateObj: d };
  }

  const iso = timeStr ? `${dateStr}T${timeStr}` : `${dateStr}T12:00:00Z`;
  const d = new Date(iso);

  // IST options
  const formatted = d.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }) + ' IST';

  return { formatted, dateObj: d };
};

// Check if a given date falls between Thursday 00:00 and Sunday 23:59 IST of the race week
export const isDateInRaceWeekend = (raceDateStr: string, testDate: Date = new Date()): boolean => {
  const raceDate = new Date(`${raceDateStr}T23:59:59Z`);
  
  const raceSundayIST = new Date(raceDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const thursdayIST = new Date(raceSundayIST);
  thursdayIST.setDate(raceSundayIST.getDate() - 3);
  thursdayIST.setHours(0, 0, 0, 0);

  const sundayNightIST = new Date(raceSundayIST);
  sundayNightIST.setHours(23, 59, 59, 999);

  const currentIST = new Date(testDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

  return currentIST >= thursdayIST && currentIST <= sundayNightIST;
};

export const TEAM_COLORS: Record<string, string> = {
  'Mercedes': '#27F4D2',
  'Mercedes-Benz': '#27F4D2',
  'Ferrari': '#E8002D',
  'Scuderia Ferrari': '#E8002D',
  'Red Bull': '#3671C6',
  'Red Bull Racing': '#3671C6',
  'McLaren': '#FF8000',
  'Aston Martin': '#229971',
  'Alpine': '#0093CC',
  'Alpine F1 Team': '#0093CC',
  'Williams': '#64C4FF',
  'Williams Racing': '#64C4FF',
  'RB': '#6692FF',
  'RB F1 Team': '#6692FF',
  'Racing Bulls': '#6692FF',
  'Kick Sauber': '#52E252',
  'Sauber': '#52E252',
  'Haas': '#B6BABD',
  'Haas F1 Team': '#B6BABD',
  'Audi': '#EE0000',
  'Cadillac': '#B8860B',
  'Cadillac F1 Team': '#B8860B',
};

export const CIRCUIT_LAP_RECORDS: Record<string, F1CircuitLapRecord> = {
  vegas: { lapTime: '1:35.490', driver: 'Charles Leclerc', year: '2023' },
  interlagos: { lapTime: '1:10.540', driver: 'Valtteri Bottas', year: '2018' },
  monza: { lapTime: '1:21.046', driver: 'Rubens Barrichello', year: '2004' },
  silverstone: { lapTime: '1:27.097', driver: 'Max Verstappen', year: '2020' },
  spa: { lapTime: '1:46.286', driver: 'Valtteri Bottas', year: '2018' },
  yas_marina: { lapTime: '1:26.103', driver: 'Max Verstappen', year: '2021' },
  albert_park: { lapTime: '1:19.813', driver: 'Charles Leclerc', year: '2024' },
  suzuka: { lapTime: '1:30.983', driver: 'Lewis Hamilton', year: '2019' },
  bahrain: { lapTime: '1:31.447', driver: 'Pedro de la Rosa', year: '2005' },
  jeddah: { lapTime: '1:30.734', driver: 'Lewis Hamilton', year: '2021' },
  miami: { lapTime: '1:29.708', driver: 'Max Verstappen', year: '2023' },
  monaco: { lapTime: '1:12.909', driver: 'Lewis Hamilton', year: '2021' },
  villeneuve: { lapTime: '1:13.078', driver: 'Valtteri Bottas', year: '2019' },
  red_bull_ring: { lapTime: '1:05.619', driver: 'Carlos Sainz', year: '2020' },
  hungaroring: { lapTime: '1:16.627', driver: 'Lewis Hamilton', year: '2020' },
  zandvoort: { lapTime: '1:11.097', driver: 'Lewis Hamilton', year: '2021' },
  baku: { lapTime: '1:43.009', driver: 'Charles Leclerc', year: '2019' },
  marina_bay: { lapTime: '1:34.486', driver: 'Daniel Ricciardo', year: '2024' },
  americas: { lapTime: '1:36.169', driver: 'Charles Leclerc', year: '2019' },
  rodriguez: { lapTime: '1:17.774', driver: 'Valtteri Bottas', year: '2021' },
  losail: { lapTime: '1:24.319', driver: 'Max Verstappen', year: '2023' },
};

const FALLBACK_STANDINGS: F1DriverStanding[] = [
  { position: 1, driver: 'Andrea Kimi Antonelli', driverCode: 'ANT', team: 'Mercedes', points: 390, number: 12, teamColor: '#27F4D2' },
  { position: 2, driver: 'Max Verstappen', driverCode: 'VER', team: 'Red Bull', points: 279, number: 3, teamColor: '#3671C6' },
  { position: 3, driver: 'George Russell', driverCode: 'RUS', team: 'Mercedes', points: 262, number: 63, teamColor: '#27F4D2' },
  { position: 4, driver: 'Lewis Hamilton', driverCode: 'HAM', team: 'Ferrari', points: 261, number: 44, teamColor: '#E8002D' },
  { position: 5, driver: 'Charles Leclerc', driverCode: 'LEC', team: 'Ferrari', points: 249, number: 16, teamColor: '#E8002D' },
  { position: 6, driver: 'Lando Norris', driverCode: 'NOR', team: 'McLaren', points: 246, number: 1, teamColor: '#FF8000' },
  { position: 7, driver: 'Oscar Piastri', driverCode: 'PIA', team: 'McLaren', points: 152, number: 81, teamColor: '#FF8000' },
  { position: 8, driver: 'Isack Hadjar', driverCode: 'HAD', team: 'Red Bull', points: 122, number: 6, teamColor: '#3671C6' },
  { position: 9, driver: 'Liam Lawson', driverCode: 'LAW', team: 'RB F1 Team', points: 89, number: 30, teamColor: '#6692FF' },
  { position: 10, driver: 'Pierre Gasly', driverCode: 'GAS', team: 'Alpine', points: 42, number: 10, teamColor: '#0093CC' },
  { position: 11, driver: 'Esteban Ocon', driverCode: 'OCO', team: 'Haas', points: 27, number: 31, teamColor: '#B6BABD' },
  { position: 12, driver: 'Oliver Bearman', driverCode: 'BEA', team: 'Haas', points: 24, number: 87, teamColor: '#B6BABD' },
  { position: 13, driver: 'Nico Hülkenberg', driverCode: 'HUL', team: 'Audi', points: 20, number: 27, teamColor: '#EE0000' },
  { position: 14, driver: 'Carlos Sainz', driverCode: 'SAI', team: 'Williams', points: 19, number: 55, teamColor: '#64C4FF' },
  { position: 15, driver: 'Yuki Tsunoda', driverCode: 'TSU', team: 'RB F1 Team', points: 16, number: 22, teamColor: '#6692FF' },
  { position: 16, driver: 'Alexander Albon', driverCode: 'ALB', team: 'Williams', points: 12, number: 23, teamColor: '#64C4FF' },
  { position: 17, driver: 'Gabriel Bortoleto', driverCode: 'BOR', team: 'Audi', points: 8, number: 5, teamColor: '#EE0000' },
  { position: 18, driver: 'Lance Stroll', driverCode: 'STR', team: 'Aston Martin', points: 5, number: 18, teamColor: '#229971' },
  { position: 19, driver: 'Fernando Alonso', driverCode: 'ALO', team: 'Aston Martin', points: 4, number: 14, teamColor: '#229971' },
  { position: 20, driver: 'Jack Doohan', driverCode: 'DOO', team: 'Alpine', points: 2, number: 7, teamColor: '#0093CC' },
];

const FALLBACK_CONSTRUCTORS: F1ConstructorStanding[] = [
  { position: 1, team: 'Mercedes', points: 652, wins: 12, teamColor: '#27F4D2' },
  { position: 2, team: 'Ferrari', points: 510, wins: 2, teamColor: '#E8002D' },
  { position: 3, team: 'Red Bull', points: 415, wins: 3, teamColor: '#3671C6' },
  { position: 4, team: 'McLaren', points: 398, wins: 3, teamColor: '#FF8000' },
  { position: 5, team: 'RB F1 Team', points: 114, wins: 0, teamColor: '#6692FF' },
  { position: 6, team: 'Alpine', points: 69, wins: 0, teamColor: '#0093CC' },
  { position: 7, team: 'Haas', points: 31, wins: 0, teamColor: '#B6BABD' },
  { position: 8, team: 'Audi', points: 28, wins: 0, teamColor: '#EE0000' },
  { position: 9, team: 'Williams', points: 12, wins: 0, teamColor: '#64C4FF' },
  { position: 10, team: 'Aston Martin', points: 7, wins: 0, teamColor: '#229971' },
];

const FALLBACK_LAST_RACE: F1LastRacePodium = {
  raceName: 'Brazilian Grand Prix',
  circuitName: 'Autódromo José Carlos Pace',
  winner: 'Lando Norris',
  winnerTeam: 'McLaren',
  p2: 'Max Verstappen (+14.6s)',
  p2Team: 'Red Bull',
  p3: 'Isack Hadjar (+24.4s)',
  p3Team: 'Red Bull',
  fastestLapDriver: 'Kimi Antonelli',
  fastestLapTime: '1:12.689',
  fastestLapTeam: 'Mercedes',
};

const FALLBACK_QUALIFYING: F1QualifyingResult = {
  raceName: 'Brazilian Grand Prix',
  poleDriver: 'Lando Norris',
  poleTeam: 'McLaren',
  poleTime: '1:09.512',
  p2Driver: 'George Russell',
  p2Team: 'Mercedes',
  p2Time: '1:09.685 (+0.173s)',
  p3Driver: 'Andrea Kimi Antonelli',
  p3Team: 'Mercedes',
  p3Time: '1:09.702 (+0.190s)',
};

const FALLBACK_PITSTOP: F1PitStopRecord = {
  raceName: 'Brazilian Grand Prix',
  team: 'Red Bull Racing',
  driver: 'Max Verstappen',
  duration: '2.04s',
  lap: 29,
};

const FALLBACK_UPCOMING_RACES: F1UpcomingRace[] = [
  {
    round: 22,
    raceName: 'Qatar Grand Prix',
    circuitName: 'Lusail International Circuit',
    country: 'Qatar',
    dateStr: '2026-11-29',
    istDate: 'Sun, 29 Nov • 22:30 IST',
    countdown: '19d',
  },
  {
    round: 23,
    raceName: 'Abu Dhabi Grand Prix',
    circuitName: 'Yas Marina Circuit',
    country: 'United Arab Emirates',
    dateStr: '2026-12-06',
    istDate: 'Sun, 6 Dec • 18:30 IST',
    countdown: '26d',
  },
  {
    round: 24,
    raceName: 'Australian Grand Prix',
    circuitName: 'Albert Park Circuit',
    country: 'Australia',
    dateStr: '2027-03-14',
    istDate: 'Sun, 14 Mar • 10:30 IST',
    countdown: '124d',
  },
];

export const FALLBACK_F1_NEWS: F1NewsItem[] = [
  {
    id: 'f1-news-1',
    title: 'How the Racing Bulls pendulum is swinging back towards Lawson',
    link: 'https://www.autosport.com/f1/news/how-the-racing-bulls-pendulum-is-swinging-back-towards-lawson/10873320/',
    pubDate: '2026-11-09T11:54:39Z',
    timeAgo: '12h ago',
    source: 'Autosport',
    snippet: 'Liam Lawson continues to strengthen his case for 2026 with consistent points finishes and aggressive racecraft across the Americas.',
  },
  {
    id: 'f1-news-2',
    title: 'Oscar Piastri and Mark Webber mutually terminate management agreement',
    link: 'https://www.autosport.com/f1/news/oscar-piastri-splits-from-mark-webber-management/10873258/',
    pubDate: '2026-11-09T08:43:40Z',
    timeAgo: '15h ago',
    source: 'Autosport',
    snippet: 'The McLaren star and former Red Bull winner conclude their long-standing partnership on amicable terms after securing multiple GP victories.',
  },
  {
    id: 'f1-news-3',
    title: 'FIA boss planning to end age limits for motorsport governing office holders',
    link: 'https://www.bbc.co.uk/sport/formula1/articles/cr9dz7w1xgxvo',
    pubDate: '2026-11-09T15:20:35Z',
    timeAgo: '8h ago',
    source: 'BBC Sport',
    snippet: 'FIA president Mohammed Ben Sulayem is planning constitutional amendments to remove the 75-year age ceiling for key leadership positions.',
  },
  {
    id: 'f1-news-4',
    title: 'Norris sparkles in Sao Paulo despite dramatic pre-race firework mishap',
    link: 'https://www.bbc.co.uk/sport/formula1/articles/c6gr8e822kzqo',
    pubDate: '2026-11-08T23:44:53Z',
    timeAgo: '1d ago',
    source: 'BBC Sport',
    snippet: 'Lando Norris delivers a wet-weather clinic at Interlagos to claim victory as Mercedes mathematically secure the constructors title.',
  },
  {
    id: 'f1-news-5',
    title: 'Hamilton insists Ferrari tensions with Leclerc are resolved: "We\'ve squashed it"',
    link: 'https://www.autosport.com/f1/news/lewis-hamilton-insists-ferrari-tensions-with-charles-leclerc-are-over-weve-squashed-it/10872775/',
    pubDate: '2026-11-07T21:48:47Z',
    timeAgo: '2d ago',
    source: 'Motorsport.com',
    snippet: 'Lewis Hamilton reveals he and future teammate Charles Leclerc cleared the air personally without needing Fred Vasseur to intervene.',
  },
];

const cleanHtmlText = (text?: string): string => {
  if (!text) return '';
  return text
    .replace(/<[^>]*>?/gm, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const formatTimeAgo = (dateStr?: string): string => {
  if (!dateStr) return 'Recently';
  try {
    const cleanDate = dateStr.includes('T') ? dateStr : dateStr.replace(' ', 'T') + (dateStr.includes('Z') ? '' : 'Z');
    const d = new Date(cleanDate);
    const diffMs = Date.now() - d.getTime();
    if (isNaN(diffMs)) return 'Recently';
    const diffMin = Math.round(diffMs / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  } catch {
    return 'Recently';
  }
};

export const fetchF1News = async (): Promise<F1NewsItem[]> => {
  const feeds = [
    {
      source: 'Autosport',
      url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.autosport.com/rss/f1/news/',
    },
    {
      source: 'BBC Sport',
      url: 'https://api.rss2json.com/v1/api.json?rss_url=https://feeds.bbci.co.uk/sport/formula1/rss.xml',
    },
  ];

  for (const feed of feeds) {
    try {
      const res = await fetch(feed.url);
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'ok' && Array.isArray(data.items) && data.items.length > 0) {
          const parsed = data.items.slice(0, 8).map((item: any, idx: number) => {
            const rawSnippet = cleanHtmlText(item.description || item.content);
            const snippet = rawSnippet.replace(/Keep reading.*/i, '').trim();
            return {
              id: item.guid || `${feed.source}-${idx}-${Date.now()}`,
              title: cleanHtmlText(item.title),
              link: item.link || 'https://www.autosport.com/f1',
              pubDate: item.pubDate,
              timeAgo: formatTimeAgo(item.pubDate),
              source: feed.source,
              snippet: snippet.length > 120 ? `${snippet.slice(0, 120)}…` : snippet,
              thumbnail: item.thumbnail || item.enclosure?.link,
            };
          });
          if (parsed.length > 0) return parsed;
        }
      }
    } catch (e) {
      console.warn(`[F1 News] Could not fetch ${feed.source} feed:`, e);
    }
  }

  return FALLBACK_F1_NEWS;
};

export const CIRCUIT_TELEMETRY: Record<string, F1CircuitTelemetry> = {
  vegas: {
    fullThrottlePercent: 78,
    gearShiftsPerLap: 68,
    topSpeedKmh: 352,
    pitLaneLossSec: 21.4,
    tyreAllocation: 'C3 (Hard) • C4 (Med) • C5 (Soft)',
  },
  interlagos: {
    fullThrottlePercent: 70,
    gearShiftsPerLap: 58,
    topSpeedKmh: 334,
    pitLaneLossSec: 20.8,
    tyreAllocation: 'C2 (Hard) • C3 (Med) • C4 (Soft)',
  },
  monza: {
    fullThrottlePercent: 84,
    gearShiftsPerLap: 46,
    topSpeedKmh: 356,
    pitLaneLossSec: 24.2,
    tyreAllocation: 'C3 (Hard) • C4 (Med) • C5 (Soft)',
  },
  silverstone: {
    fullThrottlePercent: 72,
    gearShiftsPerLap: 52,
    topSpeedKmh: 338,
    pitLaneLossSec: 20.5,
    tyreAllocation: 'C1 (Hard) • C2 (Med) • C3 (Soft)',
  },
  default: {
    fullThrottlePercent: 74,
    gearShiftsPerLap: 62,
    topSpeedKmh: 342,
    pitLaneLossSec: 21.5,
    tyreAllocation: 'C3 (Hard) • C4 (Med) • C5 (Soft)',
  },
};

export const computeTitleBattle = (
  standings: F1DriverStanding[],
  constructorStandings: F1ConstructorStanding[],
  activeRound: number = 21,
  totalRounds: number = 24
): F1TitleBattle => {
  const d1 = standings[0] || FALLBACK_STANDINGS[0];
  const d2 = standings[1] || FALLBACK_STANDINGS[1];
  const c1 = constructorStandings[0] || FALLBACK_CONSTRUCTORS[0];
  const c2 = constructorStandings[1] || FALLBACK_CONSTRUCTORS[1];
  const roundsRemaining = Math.max(0, totalRounds - activeRound);
  const maxPointsAvailable = roundsRemaining * 26;

  return {
    leader: d1.driver,
    leaderTeam: d1.team,
    leaderPoints: d1.points,
    leaderColor: d1.teamColor || '#27F4D2',
    contender: d2.driver,
    contenderTeam: d2.team,
    contenderPoints: d2.points,
    contenderColor: d2.teamColor || '#3671C6',
    pointsGap: Math.max(0, d1.points - d2.points),
    roundsRemaining,
    maxPointsAvailable,
    teamLeader: c1.team,
    teamContender: c2.team,
    teamLeaderPoints: c1.points,
    teamContenderPoints: c2.points,
    teamPointsGap: Math.max(0, c1.points - c2.points),
  };
};

const fetchLastQualifying = async (): Promise<F1QualifyingResult> => {
  try {
    const res = await fetch(`${JOLPICA_BASE}/current/last/qualifying.json`);
    if (res.ok) {
      const data = await res.json();
      const race = data.MRData?.RaceTable?.Races?.[0];
      const results = race?.QualifyingResults;
      if (race && Array.isArray(results) && results.length >= 3) {
        const q1 = results[0];
        const q2 = results[1];
        const q3 = results[2];
        return {
          raceName: race.raceName,
          poleDriver: `${q1.Driver.givenName} ${q1.Driver.familyName}`,
          poleTeam: q1.Constructor?.name || 'Team',
          poleTime: q1.Q3 || q1.Q2 || q1.Q1 || '1:09.512',
          p2Driver: `${q2.Driver.givenName} ${q2.Driver.familyName}`,
          p2Team: q2.Constructor?.name || 'Team',
          p2Time: q2.Q3 || q2.Q2 || q2.Q1 || '1:09.685',
          p3Driver: `${q3.Driver.givenName} ${q3.Driver.familyName}`,
          p3Team: q3.Constructor?.name || 'Team',
          p3Time: q3.Q3 || q3.Q2 || q3.Q1 || '1:09.702',
        };
      }
    }
  } catch (e) {}
  return FALLBACK_QUALIFYING;
};

const fetchLastPitStops = async (): Promise<F1PitStopRecord> => {
  try {
    const res = await fetch(`${JOLPICA_BASE}/current/last/pitstops.json`);
    if (res.ok) {
      const data = await res.json();
      const race = data.MRData?.RaceTable?.Races?.[0];
      const stops = race?.PitStops;
      if (race && Array.isArray(stops) && stops.length > 0) {
        const sorted = [...stops].sort((a: any, b: any) => parseFloat(a.duration || '99') - parseFloat(b.duration || '99'));
        const fastest = sorted[0];
        return {
          raceName: race.raceName,
          team: 'DHL Fastest Stop',
          driver: fastest.driverId ? fastest.driverId.toUpperCase() : 'Max Verstappen',
          duration: `${fastest.duration}s`,
          lap: Number(fastest.lap) || 29,
        };
      }
    }
  } catch (e) {}
  return FALLBACK_PITSTOP;
};

const fetchUpcomingRaces = async (activeRound: number = 21): Promise<F1UpcomingRace[]> => {
  try {
    const res = await fetch(`${JOLPICA_BASE}/current.json`);
    if (res.ok) {
      const data = await res.json();
      const races = data.MRData?.RaceTable?.Races;
      if (Array.isArray(races)) {
        const upcoming = races.filter((r: any) => Number(r.round) > activeRound).slice(0, 3);
        if (upcoming.length > 0) {
          const now = new Date();
          return upcoming.map((r: any) => {
            const { formatted, dateObj } = formatToIST(r.date, r.time);
            const diffDays = Math.max(1, Math.round((dateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
            return {
              round: Number(r.round),
              raceName: r.raceName,
              circuitName: r.Circuit?.circuitName || 'Circuit',
              country: r.Circuit?.Location?.country || 'Global',
              dateStr: r.date,
              istDate: formatted,
              countdown: `${diffDays}d`,
            };
          });
        }
      }
    }
  } catch (e) {}
  return FALLBACK_UPCOMING_RACES;
};

const fetchLiveStandings = async (): Promise<F1DriverStanding[]> => {
  try {
    const res = await fetch(`${JOLPICA_BASE}/current/driverStandings.json`);
    if (res.ok) {
      const data = await res.json();
      const list = data.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings;
      if (Array.isArray(list) && list.length > 0) {
        return list.map((item: any) => {
          const teamName = item.Constructors?.[0]?.name || 'Unknown';
          return {
            position: Number(item.position),
            driver: `${item.Driver.givenName} ${item.Driver.familyName}`,
            driverCode: item.Driver.code || item.Driver.familyName.slice(0, 3).toUpperCase(),
            team: teamName,
            points: Number(item.points),
            number: Number(item.Driver.permanentNumber || item.position),
            teamColor: TEAM_COLORS[teamName] || '#888888',
          };
        });
      }
    }
  } catch (e) {
    // fallback
  }
  return FALLBACK_STANDINGS;
};

const fetchConstructorStandings = async (): Promise<F1ConstructorStanding[]> => {
  try {
    const res = await fetch(`${JOLPICA_BASE}/current/constructorStandings.json`);
    if (res.ok) {
      const data = await res.json();
      const list = data.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings;
      if (Array.isArray(list) && list.length > 0) {
        return list.map((item: any) => {
          const teamName = item.Constructor?.name || 'Unknown';
          return {
            position: Number(item.position),
            team: teamName,
            points: Number(item.points),
            wins: Number(item.wins || 0),
            teamColor: TEAM_COLORS[teamName] || '#888888',
          };
        });
      }
    }
  } catch (e) {
    // fallback
  }
  return FALLBACK_CONSTRUCTORS;
};

const fetchLastRacePodium = async (): Promise<F1LastRacePodium | undefined> => {
  try {
    const res = await fetch(`${JOLPICA_BASE}/current/last/results.json`);
    if (res.ok) {
      const data = await res.json();
      const race = data.MRData?.RaceTable?.Races?.[0];
      const results = race?.Results;
      if (race && Array.isArray(results) && results.length >= 3) {
        const p1 = results[0];
        const p2 = results[1];
        const p3 = results[2];

        // Find fastest lap winner
        const fastest = results.find((r: any) => r.FastestLap?.rank === '1') || results[0];

        return {
          raceName: race.raceName,
          circuitName: race.Circuit?.circuitName || 'Circuit',
          winner: `${p1.Driver.givenName} ${p1.Driver.familyName}`,
          winnerTeam: p1.Constructor?.name || 'Team',
          p2: `${p2.Driver.givenName} ${p2.Driver.familyName} (${p2.Time?.time || '+gap'})`,
          p2Team: p2.Constructor?.name || 'Team',
          p3: `${p3.Driver.givenName} ${p3.Driver.familyName} (${p3.Time?.time || '+gap'})`,
          p3Team: p3.Constructor?.name || 'Team',
          fastestLapDriver: `${fastest.Driver.givenName} ${fastest.Driver.familyName}`,
          fastestLapTime: fastest.FastestLap?.Time?.time || '1:12.689',
          fastestLapTeam: fastest.Constructor?.name || 'Team',
        };
      }
    }
  } catch (e) {
    // fallback
  }
  return FALLBACK_LAST_RACE;
};

export const getF1Data = async (forceRaceWeekendSim: boolean = false): Promise<F1Data> => {
  try {
    const [
      nextRes,
      lastRes,
      driverStandings,
      constructorStandings,
      lastRace,
      qualifyingResult,
      pitStopRecord,
      upcomingRaces,
      news,
    ] = await Promise.all([
      fetch(`${JOLPICA_BASE}/current/next.json`),
      fetch(`${JOLPICA_BASE}/current/last.json`),
      fetchLiveStandings(),
      fetchConstructorStandings(),
      fetchLastRacePodium(),
      fetchLastQualifying(),
      fetchLastPitStops(),
      fetchUpcomingRaces(21),
      fetchF1News(),
    ]);

    let targetRace: any = null;

    if (nextRes.ok) {
      const data = await nextRes.json();
      targetRace = data.MRData?.RaceTable?.Races?.[0];
    }

    // If next race is not found (e.g. season end or between races), fallback to last race
    if (!targetRace && lastRes.ok) {
      const lastData = await lastRes.json();
      targetRace = lastData.MRData?.RaceTable?.Races?.[0];
    }

    if (targetRace) {
      return parseJolpicaRace(
        targetRace,
        forceRaceWeekendSim,
        driverStandings,
        constructorStandings,
        lastRace,
        qualifyingResult,
        pitStopRecord,
        upcomingRaces,
        news
      );
    }

    const fallback = getFallbackF1Data(forceRaceWeekendSim);
    return {
      ...fallback,
      standings: driverStandings,
      constructorStandings,
      lastRace: lastRace || FALLBACK_LAST_RACE,
      qualifyingResult,
      pitStopRecord,
      upcomingRaces,
      news,
      titleBattle: computeTitleBattle(driverStandings, constructorStandings, 21, 24),
    };
  } catch (err) {
    console.warn('Jolpica F1 API failed or offline. Using rich schedule fallback.', err);
  }

  return getFallbackF1Data(forceRaceWeekendSim);
};

const parseJolpicaRace = (
  race: any,
  forceRaceWeekendSim: boolean,
  liveStandings: F1DriverStanding[] = FALLBACK_STANDINGS,
  constructorStandings: F1ConstructorStanding[] = FALLBACK_CONSTRUCTORS,
  lastRace: F1LastRacePodium = FALLBACK_LAST_RACE,
  qualifyingResult: F1QualifyingResult = FALLBACK_QUALIFYING,
  pitStopRecord: F1PitStopRecord = FALLBACK_PITSTOP,
  upcomingRaces: F1UpcomingRace[] = FALLBACK_UPCOMING_RACES,
  news: F1NewsItem[] = FALLBACK_F1_NEWS,
): F1Data => {
  const fp1Info = formatToIST(race.FirstPractice?.date, race.FirstPractice?.time);
  const fp2Info = race.SecondPractice ? formatToIST(race.SecondPractice.date, race.SecondPractice.time) : undefined;
  const fp3Info = race.ThirdPractice ? formatToIST(race.ThirdPractice.date, race.ThirdPractice.time) : undefined;
  const sprintQualiInfo = race.SprintQualifying ? formatToIST(race.SprintQualifying.date, race.SprintQualifying.time) : undefined;
  const sprintInfo = race.Sprint ? formatToIST(race.Sprint.date, race.Sprint.time) : undefined;
  const qualiInfo = formatToIST(race.Qualifying?.date, race.Qualifying?.time);
  const raceInfo = formatToIST(race.date, race.time);

  const now = new Date();

  const getStatus = (targetDate: Date): F1Session['status'] => {
    const diff = targetDate.getTime() - now.getTime();
    if (diff < -7200000) return 'completed'; // 2 hours after start
    if (diff <= 0) return 'live';
    return 'upcoming';
  };

  const sessions: F1Data['sessions'] = {
    fp1: {
      name: 'Practice 1',
      utcTime: `${race.FirstPractice?.date}T${race.FirstPractice?.time || '12:00:00Z'}`,
      istTime: fp1Info.formatted,
      status: getStatus(fp1Info.dateObj),
    },
    qualifying: {
      name: 'Qualifying',
      utcTime: `${race.Qualifying?.date}T${race.Qualifying?.time || '15:00:00Z'}`,
      istTime: qualiInfo.formatted,
      status: getStatus(qualiInfo.dateObj),
    },
    race: {
      name: 'Grand Prix',
      utcTime: `${race.date}T${race.time || '14:00:00Z'}`,
      istTime: raceInfo.formatted,
      status: getStatus(raceInfo.dateObj),
    },
  };

  if (fp2Info) {
    sessions.fp2 = {
      name: 'Practice 2',
      utcTime: `${race.SecondPractice.date}T${race.SecondPractice.time}`,
      istTime: fp2Info.formatted,
      status: getStatus(fp2Info.dateObj),
    };
  }

  if (fp3Info) {
    sessions.fp3 = {
      name: 'Practice 3',
      utcTime: `${race.ThirdPractice.date}T${race.ThirdPractice.time}`,
      istTime: fp3Info.formatted,
      status: getStatus(fp3Info.dateObj),
    };
  }

  if (sprintQualiInfo) {
    sessions.sprintQualifying = {
      name: 'Sprint Shootout',
      utcTime: `${race.SprintQualifying.date}T${race.SprintQualifying.time}`,
      istTime: sprintQualiInfo.formatted,
      status: getStatus(sprintQualiInfo.dateObj),
    };
  }

  if (sprintInfo) {
    sessions.sprint = {
      name: 'Sprint Race',
      utcTime: `${race.Sprint.date}T${race.Sprint.time}`,
      istTime: sprintInfo.formatted,
      status: getStatus(sprintInfo.dateObj),
    };
  }

  // Find next upcoming session
  const allSessions = [
    { name: 'Practice 1', d: fp1Info.dateObj, fmt: fp1Info.formatted },
    fp2Info ? { name: 'Practice 2', d: fp2Info.dateObj, fmt: fp2Info.formatted } : null,
    fp3Info ? { name: 'Practice 3', d: fp3Info.dateObj, fmt: fp3Info.formatted } : null,
    sprintQualiInfo ? { name: 'Sprint Shootout', d: sprintQualiInfo.dateObj, fmt: sprintQualiInfo.formatted } : null,
    sprintInfo ? { name: 'Sprint Race', d: sprintInfo.dateObj, fmt: sprintInfo.formatted } : null,
    { name: 'Qualifying', d: qualiInfo.dateObj, fmt: qualiInfo.formatted },
    { name: 'Grand Prix Race', d: raceInfo.dateObj, fmt: raceInfo.formatted },
  ].filter(Boolean) as Array<{ name: string; d: Date; fmt: string }>;

  const futureSession = allSessions.find(s => s.d.getTime() > now.getTime());
  let targetName = 'Qualifying';
  let targetFmt = 'Saturday • 09:30 IST';
  let targetDate = new Date(now.getTime() + 14 * 3600 * 1000 + 32 * 60 * 1000 + 45 * 1000);

  if (futureSession) {
    targetName = futureSession.name;
    targetFmt = futureSession.fmt;
    targetDate = futureSession.d;
  } else {
    // If all sessions of current round completed, check upcoming calendar
    const nextUpcoming = upcomingRaces.find(r => new Date(r.dateStr).getTime() > now.getTime());
    if (nextUpcoming) {
      targetName = `${nextUpcoming.raceName} (Grand Prix)`;
      targetFmt = `${nextUpcoming.istDate} • 19:30 IST`;
      targetDate = new Date(`${nextUpcoming.dateStr}T14:00:00Z`);
    }
  }

  const diffMs = Math.max(0, targetDate.getTime() - now.getTime());
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
  const countdownFormatted = diffMs <= 0
    ? '00h 00m 00s'
    : `${days > 0 ? `${days}d ` : ''}${hours.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;

  const isWeekend = forceRaceWeekendSim || isDateInRaceWeekend(race.date, now);
  const circuitId = race.Circuit?.circuitId || 'vegas';
  const activeRound = Number(race.round) || 21;

  return {
    isRaceWeekend: isWeekend,
    activeRound,
    totalRounds: 24,
    raceName: race.raceName,
    circuitName: race.Circuit.circuitName,
    location: race.Circuit.Location.locality,
    country: race.Circuit.Location.country,
    countryCode: 'US',
    circuitMapUrl: 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/USA_Circuit.png',
    sessions,
    nextSession: {
      name: targetName,
      istTimeFormatted: targetFmt,
      targetDate: targetDate.toISOString(),
      diffMs,
      countdownFormatted,
      days,
      hours,
      mins,
      secs,
    },
    standings: liveStandings,
    constructorStandings,
    lastRace,
    circuitLapRecord: CIRCUIT_LAP_RECORDS[circuitId] || { lapTime: '1:35.490', driver: 'Charles Leclerc', year: '2023' },
    qualifyingResult,
    pitStopRecord,
    titleBattle: computeTitleBattle(liveStandings, constructorStandings, activeRound, 24),
    upcomingRaces,
    circuitTelemetry: CIRCUIT_TELEMETRY[circuitId] || CIRCUIT_TELEMETRY.default,
    news,
  };
};

export const getFallbackF1Data = (forceRaceWeekendSim: boolean = false): F1Data => {
  const fallbackTarget = new Date(Date.now() + 14 * 3600 * 1000 + 32 * 60 * 1000 + 45 * 1000);
  const diffMs = Math.max(0, fallbackTarget.getTime() - Date.now());
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
  const countdownFormatted = `${days > 0 ? `${days}d ` : ''}${hours.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;

  return {
    isRaceWeekend: forceRaceWeekendSim,
    activeRound: 21,
    totalRounds: 24,
    raceName: 'Formula 1 Las Vegas Grand Prix',
    circuitName: 'Las Vegas Strip Street Circuit',
    location: 'Las Vegas, Nevada',
    country: 'United States',
    countryCode: 'US',
    circuitMapUrl: 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Las_Vegas_Circuit.png',
    sessions: {
      fp1: {
        name: 'Practice 1',
        utcTime: '2026-11-20T00:30:00Z',
        istTime: 'Fri, 20 Nov • 06:00 IST',
        status: 'completed',
      },
      fp2: {
        name: 'Practice 2',
        utcTime: '2026-11-20T04:00:00Z',
        istTime: 'Fri, 20 Nov • 09:30 IST',
        status: 'completed',
      },
      fp3: {
        name: 'Practice 3',
        utcTime: '2026-11-21T00:30:00Z',
        istTime: 'Sat, 21 Nov • 06:00 IST',
        status: 'upcoming',
      },
      qualifying: {
        name: 'Qualifying',
        utcTime: '2026-11-21T04:00:00Z',
        istTime: 'Sat, 21 Nov • 09:30 IST',
        status: 'upcoming',
      },
      race: {
        name: 'Grand Prix (50 Laps)',
        utcTime: '2026-11-22T04:00:00Z',
        istTime: 'Sun, 22 Nov • 09:30 IST',
        status: 'upcoming',
      },
    },
    nextSession: {
      name: 'Qualifying',
      istTimeFormatted: 'Saturday • 09:30 IST',
      targetDate: fallbackTarget.toISOString(),
      diffMs,
      countdownFormatted,
      days,
      hours,
      mins,
      secs,
    },
    standings: FALLBACK_STANDINGS,
    constructorStandings: FALLBACK_CONSTRUCTORS,
    lastRace: FALLBACK_LAST_RACE,
    circuitLapRecord: { lapTime: '1:35.490', driver: 'Charles Leclerc', year: '2023' },
    qualifyingResult: FALLBACK_QUALIFYING,
    pitStopRecord: FALLBACK_PITSTOP,
    titleBattle: computeTitleBattle(FALLBACK_STANDINGS, FALLBACK_CONSTRUCTORS, 21, 24),
    upcomingRaces: FALLBACK_UPCOMING_RACES,
    circuitTelemetry: CIRCUIT_TELEMETRY.vegas,
    news: FALLBACK_F1_NEWS,
  };
};
