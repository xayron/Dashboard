import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Calendar, CloudSun } from 'lucide-react';
import { AudioBanner } from '../common/AudioBanner';

export const EinkRaceWeekendMode: React.FC = () => {
  const { f1, media, weather, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  const sessionsList = [
    { key: 'fp1', label: 'Practice 1', data: f1.sessions.fp1 },
    { key: 'fp2', label: 'Practice 2', data: f1.sessions.fp2 },
    { key: 'fp3', label: 'Practice 3', data: f1.sessions.fp3 },
    { key: 'sprintQualifying', label: 'Sprint Shootout', data: f1.sessions.sprintQualifying },
    { key: 'sprint', label: 'Sprint Race', data: f1.sessions.sprint },
    { key: 'qualifying', label: 'Qualifying', data: f1.sessions.qualifying },
    { key: 'race', label: 'Grand Prix (Race)', data: f1.sessions.race },
  ].filter(s => s.data !== undefined);

  return (
    <div className={`w-full h-full p-8 flex flex-col justify-between overflow-hidden bg-transparent font-serif select-none ${
      isLight ? 'text-[#1c1917]' : 'text-[#f5f2eb]'
    }`}>
      {/* 1. TOP BANNER */}
      <div className={`p-4 border-2 flex items-center justify-between mb-4 ${
        isLight
          ? 'border-stone-800 bg-[#ede8df] shadow-[3px_3px_0px_#1c1917]'
          : 'border-stone-500 bg-[#292524] shadow-[3px_3px_0px_#000]'
      }`}>
        <div>
          <div className={`flex items-center space-x-2 text-xs font-mono uppercase ${
            isLight ? 'text-stone-600' : 'text-stone-400'
          }`}>
            <span>MOTORSPORT GAZETTE</span>
            <span>•</span>
            <span>ROUND {f1.activeRound} OF {f1.totalRounds}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight uppercase mt-0.5">{f1.raceName}</h1>
          <p className={`text-xs italic ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>{f1.circuitName} — {f1.location}</p>
        </div>

        <div className={`text-right border-l pl-4 ${isLight ? 'border-stone-400' : 'border-stone-600'}`}>
          <span className={`text-[10px] font-mono uppercase block ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>Upcoming Trial</span>
          <span className="text-sm font-bold" style={{ color: 'var(--color-accent)' }}>{f1.nextSession.name}</span>
          <span className={`text-xs font-mono block font-bold ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>{f1.nextSession.countdownFormatted}</span>
        </div>
      </div>

      {/* 2. MAIN 3-COLUMN GRID */}
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left Column (5 cols): Hero Countdown & Circuit Specifications */}
        <div className={`col-span-5 flex flex-col justify-between border-r-2 pr-6 ${
          isLight ? 'border-stone-300' : 'border-stone-700'
        }`}>
          {/* Hero Countdown Card */}
          <div className="flex flex-col justify-between flex-1 pb-3">
            <div>
              <div className="flex items-center justify-between border-b pb-1">
                <span className={`text-[10px] font-mono uppercase tracking-widest ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
                  Target Session
                </span>
                <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 border ${
                  isLight ? 'border-stone-800 bg-stone-200' : 'border-stone-500 bg-stone-800'
                }`}>
                  Live in IST
                </span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight mt-1.5">{f1.nextSession.name}</h2>
              <p className={`text-xs font-mono mt-0.5 flex items-center ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
                <Calendar size={13} className="mr-1.5" />
                {f1.nextSession.istTimeFormatted}
              </p>
            </div>

            {/* Big Countdown Digits */}
            <div className={`my-3 p-4 border-2 text-center ${
              isLight ? 'border-stone-800 bg-[#ede8df]' : 'border-stone-600 bg-[#292524]'
            }`}>
              <div className={`text-[9px] uppercase font-mono tracking-widest ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
                Time Remaining To Green Flag
              </div>
              <div className="text-3xl font-bold font-mono mt-1" style={{ color: 'var(--color-accent)' }}>
                {f1.nextSession.countdownFormatted}
              </div>
            </div>

            {/* Circuit Specifications */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className={`p-2 border ${isLight ? 'border-stone-400 bg-[#ede8df]' : 'border-stone-600 bg-[#292524]'}`}>
                <span className={`block text-[9px] font-mono uppercase ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>Laps</span>
                <span className="font-mono font-bold text-xs">50 LAPS</span>
              </div>
              <div className={`p-2 border ${isLight ? 'border-stone-400 bg-[#ede8df]' : 'border-stone-600 bg-[#292524]'}`}>
                <span className={`block text-[9px] font-mono uppercase ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>Circuit</span>
                <span className="font-mono font-bold text-xs">6.201 KM</span>
              </div>
              <div className={`p-2 border ${isLight ? 'border-stone-400 bg-[#ede8df]' : 'border-stone-600 bg-[#292524]'}`}>
                <span className={`block text-[9px] font-mono uppercase ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>DRS Zones</span>
                <span className="font-mono font-bold text-xs" style={{ color: 'var(--color-accent)' }}>2 ZONES</span>
              </div>
            </div>
          </div>

          {/* Local Weather Conditions */}
          <div className={`pt-2 border-t-2 flex items-center justify-between text-xs font-mono ${
            isLight ? 'border-stone-300 text-stone-700' : 'border-stone-700 text-stone-400'
          }`}>
            <div className="flex items-center space-x-2">
              <CloudSun size={16} />
              <span>{weather.temperature}°C {weather.condition}</span>
            </div>
            <span>Wind {weather.windSpeed} km/h • Hum {weather.humidity}%</span>
          </div>
        </div>

        {/* Center Column (4 cols): Programme of the Weekend */}
        <div className={`col-span-4 flex flex-col border-r-2 pr-6 ${
          isLight ? 'border-stone-300' : 'border-stone-700'
        }`}>
          <h3 className={`text-xs uppercase font-bold tracking-widest border-b-2 pb-1 mb-3 ${
            isLight ? 'text-stone-900 border-stone-800' : 'text-stone-100 border-stone-500'
          }`}>
            Programme of the Weekend
          </h3>
          <div className="space-y-2.5 overflow-y-auto max-h-[56vh] pr-1">
            {sessionsList.map((s) => {
              const isNext = f1.nextSession.name.toLowerCase().includes(s.label.toLowerCase());
              return (
                <div
                  key={s.key}
                  className={`p-2 border flex items-center justify-between ${
                    isNext
                      ? isLight
                        ? 'border-stone-900 bg-stone-300 font-bold'
                        : 'border-stone-300 bg-stone-800 font-bold'
                      : isLight
                        ? 'border-stone-400 bg-[#ede8df]'
                        : 'border-stone-600 bg-[#292524]'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold block">{s.label}</span>
                    <span className={`text-[11px] font-mono ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>{s.data?.istTime}</span>
                  </div>
                  <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 border ${
                    isLight ? 'border-stone-600' : 'border-stone-500'
                  }`}
                  style={isNext ? { color: 'var(--color-accent)' } : undefined}
                  >
                    {s.data?.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (3 cols): Championship Standings */}
        <div className="col-span-3 flex flex-col">
          <h3 className={`text-xs uppercase font-bold tracking-widest border-b-2 pb-1 mb-3 ${
            isLight ? 'text-stone-900 border-stone-800' : 'text-stone-100 border-stone-500'
          }`}>
            Standings
          </h3>
          <div className="space-y-1.5 overflow-y-auto max-h-[56vh] pr-1">
            {f1.standings.map((driver) => (
              <div
                key={driver.driverCode}
                className={`p-2 border flex items-center justify-between text-xs ${
                  isLight
                    ? 'border-stone-300 bg-[#ede8df]'
                    : 'border-stone-700 bg-[#292524]'
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  <span className={`w-4 font-mono font-bold ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                    #{driver.position}
                  </span>
                  <span
                    className="w-1.5 h-4 shrink-0"
                    style={{ backgroundColor: driver.teamColor || '#888' }}
                  />
                  <div className="truncate">
                    <span className="font-bold uppercase block truncate">{driver.driver}</span>
                    <span className={`text-[10px] italic block truncate ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>({driver.team})</span>
                  </div>
                </div>
                <span className="font-mono font-bold shrink-0 ml-1" style={{ color: 'var(--color-accent)' }}>
                  {driver.points} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. BOTTOM BAR */}
      <div className={`flex items-center justify-between pt-2 border-t-2 text-xs font-mono ${
        isLight ? 'border-stone-800 text-stone-600' : 'border-stone-600 text-stone-400'
      }`}>
        <div className="flex items-center space-x-2">
          <span>● TELEMETRY: DISPATCHED VIA JOLPICA RACING SERVICES</span>
        </div>

        {media.state === 'playing' && (
          <div>
            <AudioBanner compact={true} />
          </div>
        )}
      </div>
    </div>
  );
};
