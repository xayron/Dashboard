import type { F1Data, F1DriverStanding, F1Session } from '../types/dashboard';

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
  
  // Convert testDate to IST time components
  const istFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  });
  
  // Calculate Thursday of that race week
  // A race is typically on Sunday. Race weekend starts on Thursday before the race.
  const raceSundayIST = new Date(raceDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const thursdayIST = new Date(raceSundayIST);
  thursdayIST.setDate(raceSundayIST.getDate() - 3);
  thursdayIST.setHours(0, 0, 0, 0);

  const sundayNightIST = new Date(raceSundayIST);
  sundayNightIST.setHours(23, 59, 59, 999);

  const currentIST = new Date(testDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

  return currentIST >= thursdayIST && currentIST <= sundayNightIST;
};

const TEAM_COLORS: Record<string, string> = {
  'Red Bull': '#3671C6',
  'McLaren': '#FF8000',
  'Ferrari': '#E8002D',
  'Mercedes': '#27F4D2',
  'Aston Martin': '#229971',
  'Alpine': '#0093CC',
  'Williams': '#64C4FF',
  'RB': '#6692FF',
  'Kick Sauber': '#52E252',
  'Haas': '#B6BABD',
};

const FALLBACK_STANDINGS: F1DriverStanding[] = [
  { position: 1, driver: 'Max Verstappen', driverCode: 'VER', team: 'Red Bull', points: 393, number: 1, teamColor: '#3671C6' },
  { position: 2, driver: 'Lando Norris', driverCode: 'NOR', team: 'McLaren', points: 331, number: 4, teamColor: '#FF8000' },
  { position: 3, driver: 'Charles Leclerc', driverCode: 'LEC', team: 'Ferrari', points: 307, number: 16, teamColor: '#E8002D' },
  { position: 4, driver: 'Oscar Piastri', driverCode: 'PIA', team: 'McLaren', points: 262, number: 81, teamColor: '#FF8000' },
  { position: 5, driver: 'Carlos Sainz', driverCode: 'SAI', team: 'Ferrari', points: 244, number: 55, teamColor: '#E8002D' },
  { position: 6, driver: 'George Russell', driverCode: 'RUS', team: 'Mercedes', points: 192, number: 63, teamColor: '#27F4D2' },
  { position: 7, driver: 'Lewis Hamilton', driverCode: 'HAM', team: 'Mercedes', points: 190, number: 44, teamColor: '#27F4D2' },
  { position: 8, driver: 'Sergio Perez', driverCode: 'PER', team: 'Red Bull', points: 151, number: 11, teamColor: '#3671C6' },
];

const fetchLiveStandings = async (): Promise<F1DriverStanding[]> => {
  try {
    const res = await fetch('https://api.jolpica.com/ergast/f1/current/driverStandings.json');
    if (res.ok) {
      const data = await res.json();
      const list = data.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings;
      if (Array.isArray(list) && list.length > 0) {
        return list.slice(0, 10).map((item: any) => {
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

export const getF1Data = async (forceRaceWeekendSim: boolean = false): Promise<F1Data> => {
  try {
    const [raceRes, standings] = await Promise.all([
      fetch('https://api.jolpica.com/ergast/f1/current/next.json'),
      fetchLiveStandings(),
    ]);

    if (raceRes.ok) {
      const data = await raceRes.json();
      const race = data.MRData.RaceTable.Races[0];
      if (race) {
        return parseJolpicaRace(race, forceRaceWeekendSim, standings);
      }
    }
    const fallback = getFallbackF1Data(forceRaceWeekendSim);
    return { ...fallback, standings };
  } catch (err) {
    console.warn('Jolpica F1 API failed or offline. Using rich schedule fallback.', err);
  }

  return getFallbackF1Data(forceRaceWeekendSim);
};

const parseJolpicaRace = (race: any, forceRaceWeekendSim: boolean, liveStandings: F1DriverStanding[] = FALLBACK_STANDINGS): F1Data => {
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
    sprintInfo ? { name: 'Sprint Race', d: sprintInfo.dateObj, fmt: sprintInfo.formatted } : null,
    { name: 'Qualifying', d: qualiInfo.dateObj, fmt: qualiInfo.formatted },
    { name: 'Grand Prix Race', d: raceInfo.dateObj, fmt: raceInfo.formatted },
  ].filter(Boolean) as Array<{ name: string; d: Date; fmt: string }>;

  const next = allSessions.find(s => s.d.getTime() > now.getTime()) || allSessions[allSessions.length - 1];
  const diffMs = Math.max(0, next.d.getTime() - now.getTime());

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const countdownFormatted = `${days > 0 ? `${days}d ` : ''}${hours}h ${mins}m`;

  const isWeekend = forceRaceWeekendSim || isDateInRaceWeekend(race.date, now);

  return {
    isRaceWeekend: isWeekend,
    activeRound: Number(race.round) || 22,
    totalRounds: 24,
    raceName: race.raceName,
    circuitName: race.Circuit.circuitName,
    location: race.Circuit.Location.locality,
    country: race.Circuit.Location.country,
    countryCode: 'US',
    circuitMapUrl: 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/USA_Circuit.png',
    sessions,
    nextSession: {
      name: next.name,
      istTimeFormatted: next.fmt,
      diffMs,
      countdownFormatted,
    },
    standings: liveStandings,
  };
};

export const getFallbackF1Data = (forceRaceWeekendSim: boolean = false): F1Data => {
  // Las Vegas Grand Prix simulation
  return {
    isRaceWeekend: forceRaceWeekendSim,
    activeRound: 22,
    totalRounds: 24,
    raceName: 'Formula 1 Heineken Silver Las Vegas Grand Prix',
    circuitName: 'Las Vegas Strip Circuit',
    location: 'Las Vegas, Nevada',
    country: 'United States',
    countryCode: 'US',
    circuitMapUrl: 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Las_Vegas_Circuit.png',
    sessions: {
      fp1: {
        name: 'Practice 1',
        utcTime: '2026-11-20T02:30:00Z',
        istTime: 'Fri, 20 Nov • 08:00 IST',
        status: 'completed',
      },
      fp2: {
        name: 'Practice 2',
        utcTime: '2026-11-20T06:00:00Z',
        istTime: 'Fri, 20 Nov • 11:30 IST',
        status: 'completed',
      },
      fp3: {
        name: 'Practice 3',
        utcTime: '2026-11-21T02:30:00Z',
        istTime: 'Sat, 21 Nov • 08:00 IST',
        status: 'upcoming',
      },
      qualifying: {
        name: 'Qualifying',
        utcTime: '2026-11-21T06:00:00Z',
        istTime: 'Sat, 21 Nov • 11:30 IST',
        status: 'upcoming',
      },
      race: {
        name: 'Grand Prix (50 Laps)',
        utcTime: '2026-11-22T06:00:00Z',
        istTime: 'Sun, 22 Nov • 11:30 IST',
        status: 'upcoming',
      },
    },
    nextSession: {
      name: 'Qualifying',
      istTimeFormatted: 'Saturday • 11:30 IST',
      diffMs: 52400000,
      countdownFormatted: '14h 32m',
    },
    standings: FALLBACK_STANDINGS,
  };
};
