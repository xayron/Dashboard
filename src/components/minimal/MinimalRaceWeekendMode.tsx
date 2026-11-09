import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Calendar, CloudSun, Timer } from 'lucide-react';
import { AudioBanner } from '../common/AudioBanner';

export const MinimalRaceWeekendMode: React.FC = () => {
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
    <div className={`w-full h-full p-10 flex flex-col justify-between overflow-hidden bg-transparent select-none font-sans ${isLight ? 'text-neutral-900' : 'text-neutral-100'}`}>
      {/* 1. TOP HEADING */}
      <div className={`flex items-baseline justify-between pb-5 border-b ${isLight ? 'border-neutral-200' : 'border-white/10'}`}>
        <div>
          <span className={`text-[11px] font-mono tracking-widest uppercase block mb-1 ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>
            Round {f1.activeRound} of {f1.totalRounds} • {f1.country}
          </span>
          <h1 className={`text-3xl font-light tracking-tight ${isLight ? 'text-neutral-900' : 'text-white'}`}>{f1.raceName}</h1>
          <p className={`text-xs font-light mt-0.5 ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>{f1.circuitName}</p>
        </div>

        <div className="text-right">
          <span className={`text-[11px] font-mono uppercase block ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>Next Up</span>
          <span className={`text-base font-medium ${isLight ? 'text-neutral-900' : 'text-white'}`}>{f1.nextSession.name}</span>
          <span className="text-xs font-mono font-medium block mt-0.5" style={{ color: 'var(--color-accent)' }}>{f1.nextSession.countdownFormatted}</span>
        </div>
      </div>

      {/* 2. MAIN 3-COLUMN GRID */}
      <div className="grid grid-cols-12 gap-8 flex-1 min-h-0 pt-6">
        {/* Left Column (5 cols): Hero Countdown & Circuit Metrics */}
        <div className={`col-span-5 flex flex-col justify-between border-r pr-8 ${isLight ? 'border-neutral-200' : 'border-white/10'}`}>
          {/* Hero Countdown Card */}
          <div className="flex flex-col justify-between flex-1 pb-4">
            <div>
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono uppercase tracking-widest ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  Target Session
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full" style={{
                  backgroundColor: 'var(--theme-accent-soft)',
                  color: 'var(--color-accent)',
                }}>
                  Live in IST
                </span>
              </div>
              <h2 className={`text-2xl font-light tracking-tight mt-1 ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                {f1.nextSession.name}
              </h2>
              <p className={`text-xs font-mono mt-0.5 flex items-center ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                <Calendar size={12} className="mr-1 text-neutral-400" />
                {f1.nextSession.istTimeFormatted}
              </p>
            </div>

            {/* Clean Large Digits */}
            <div className={`my-4 p-5 rounded-xl border flex items-center justify-around font-mono ${
              isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-white/[0.02] border-white/10'
            }`}>
              <div className="text-center">
                <span className={`text-3xl font-light block ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                  {f1.nextSession.countdownFormatted.split(' ')[0] || '00'}
                </span>
                <span className={`text-[9px] uppercase tracking-widest ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>Days / Hrs</span>
              </div>
              <span className="text-xl text-neutral-400 font-light">:</span>
              <div className="text-center">
                <span className="text-3xl font-light block" style={{ color: 'var(--color-accent)' }}>
                  {f1.nextSession.countdownFormatted.split(' ')[1] || '00m'}
                </span>
                <span className={`text-[9px] uppercase tracking-widest ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>Minutes</span>
              </div>
            </div>

            {/* Quick Circuit Specs */}
            <div className="grid grid-cols-3 gap-2">
              <div className={`p-2.5 rounded-lg border ${isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-white/[0.02] border-white/5'}`}>
                <span className={`text-[9px] font-mono uppercase block ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>Laps</span>
                <span className="font-mono text-xs font-medium">50 Laps</span>
              </div>
              <div className={`p-2.5 rounded-lg border ${isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-white/[0.02] border-white/5'}`}>
                <span className={`text-[9px] font-mono uppercase block ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>Length</span>
                <span className="font-mono text-xs font-medium">6.201 km</span>
              </div>
              <div className={`p-2.5 rounded-lg border ${isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-white/[0.02] border-white/5'}`}>
                <span className={`text-[9px] font-mono uppercase block ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>DRS</span>
                <span className="font-mono text-xs font-medium" style={{ color: 'var(--color-accent)' }}>2 Zones</span>
              </div>
            </div>
          </div>

          {/* Track Conditions */}
          <div className={`pt-3 border-t flex items-center justify-between text-xs ${isLight ? 'border-neutral-200 text-neutral-600' : 'border-white/10 text-neutral-400'}`}>
            <div className="flex items-center space-x-2">
              <CloudSun size={15} style={{ color: 'var(--color-accent)' }} />
              <span className="font-mono">{weather.temperature}°C {weather.condition}</span>
            </div>
            <span className="font-mono text-[11px]">Wind {weather.windSpeed} km/h • Hum {weather.humidity}%</span>
          </div>
        </div>

        {/* Center Column (4 cols): Weekend Sessions */}
        <div className={`col-span-4 flex flex-col border-r pr-8 ${isLight ? 'border-neutral-200' : 'border-white/10'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-xs uppercase tracking-widest font-medium ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
              Weekend Sessions (IST)
            </h3>
            <span className={`text-[10px] font-mono ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>UTC+5:30</span>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-[56vh] pr-1">
            {sessionsList.map((s) => {
              const isNext = f1.nextSession.name.toLowerCase().includes(s.label.toLowerCase());
              return (
                <div
                  key={s.key}
                  className={`flex items-center justify-between py-2 px-3 rounded-lg border transition-all ${
                    isNext
                      ? isLight
                        ? 'border-neutral-400 bg-neutral-100 font-medium'
                        : 'border-white/20 bg-white/[0.05] font-medium'
                      : isLight
                        ? 'border-neutral-200/60 bg-transparent'
                        : 'border-white/5 bg-transparent'
                  }`}
                >
                  <div>
                    <span className={`text-xs block ${isLight ? 'text-neutral-900' : 'text-neutral-100'}`}>{s.label}</span>
                    <span className={`text-[11px] font-mono ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>{s.data?.istTime}</span>
                  </div>
                  <span
                    className="text-[10px] font-mono uppercase px-2 py-0.5 rounded"
                    style={isNext ? {
                      backgroundColor: 'var(--theme-accent-soft)',
                      color: 'var(--color-accent)',
                    } : undefined}
                  >
                    {s.data?.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (3 cols): Driver Standings */}
        <div className="col-span-3 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-xs uppercase tracking-widest font-medium ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
              Standings
            </h3>
            <span className={`text-[10px] font-mono uppercase ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>PTS</span>
          </div>

          <div className="space-y-1.5 overflow-y-auto max-h-[56vh] pr-1">
            {f1.standings.map((driver) => (
              <div
                key={driver.driverCode}
                className={`flex items-center justify-between py-1.5 px-2 rounded border text-xs font-light ${
                  isLight ? 'border-neutral-200/60 hover:bg-neutral-50' : 'border-white/5 hover:bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <span className={`w-4 font-mono text-[11px] ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    {driver.position}
                  </span>
                  <span
                    className="w-1 h-3.5 rounded-full shrink-0"
                    style={{ backgroundColor: driver.teamColor || '#888' }}
                  />
                  <div className="truncate">
                    <span className={`font-light block truncate ${isLight ? 'text-neutral-800' : 'text-neutral-200'}`}>{driver.driver}</span>
                    <span className={`text-[10px] block truncate ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>{driver.team}</span>
                  </div>
                </div>
                <span className="font-mono text-xs font-medium shrink-0 ml-1" style={{ color: 'var(--color-accent)' }}>
                  {driver.points}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. BOTTOM BAR */}
      <div className={`flex items-center justify-between pt-3 border-t text-xs font-mono ${
        isLight ? 'border-neutral-200 text-neutral-500' : 'border-white/10 text-neutral-500'
      }`}>
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>F1 Telemetry Connected via Jolpica-F1</span>
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
