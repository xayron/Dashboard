import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Calendar, CloudSun } from 'lucide-react';
import { AudioBanner } from '../common/AudioBanner';

export const CivicRaceWeekendMode: React.FC = () => {
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

  const cardClass = isLight
    ? 'bg-white border border-slate-300 rounded-xl shadow-sm text-slate-900'
    : 'bg-slate-900/90 border border-slate-700 rounded-xl shadow-md text-slate-100';

  const innerClass = isLight
    ? 'bg-slate-50 border border-slate-200 rounded-lg text-slate-900'
    : 'bg-slate-800/80 border border-slate-700/80 rounded-lg text-slate-100';

  const mutedClass = isLight ? 'text-slate-500' : 'text-slate-400';
  const borderDivider = isLight ? 'border-slate-100' : 'border-slate-800';

  return (
    <div className={`w-full h-full p-8 flex flex-col justify-between overflow-hidden bg-transparent select-none font-sans ${
      isLight ? 'text-slate-900' : 'text-slate-100'
    }`}>
      {/* 1. TOP BANNER: RACE WEEKEND MASTHEAD */}
      <div className={`p-5 ${cardClass} flex items-center justify-between mb-4 relative overflow-hidden`}>
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#f97316] via-slate-300 to-[#16a34a]" />

        <div>
          <div className={`flex items-center space-x-2 text-xs font-mono ${mutedClass}`}>
            <span style={{ color: 'var(--color-accent, #f97316)' }} className="font-extrabold uppercase">FORMULA 1 WORLD CHAMPIONSHIP</span>
            <span>•</span>
            <span className="font-bold">ROUND {f1.activeRound} OF {f1.totalRounds}</span>
            <span>•</span>
            <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 font-bold">
              RACE WEEKEND
            </span>
          </div>
          <h1 className={`text-2xl font-black tracking-tight mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>{f1.raceName}</h1>
          <p className={`text-xs font-mono mt-0.5 ${mutedClass}`}>{f1.circuitName} — {f1.location}</p>
        </div>

        <div className={`text-right border-l pl-6 font-mono ${isLight ? 'border-slate-200' : 'border-slate-700'}`}>
          <span className={`text-[10px] uppercase block font-bold ${mutedClass}`}>Upcoming Session</span>
          <span className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{f1.nextSession.name}</span>
          <span className="text-xs block font-black mt-0.5" style={{ color: 'var(--color-accent, #f97316)' }}>{f1.nextSession.countdownFormatted}</span>
        </div>
      </div>

      {/* 2. MAIN 3-COLUMN GRID */}
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left Column (5 cols): Hero Countdown & Circuit Telemetry */}
        <div className="col-span-5 flex flex-col space-y-4">
          {/* Hero Countdown Card */}
          <div className={`p-5 ${cardClass} flex-1 flex flex-col justify-between`}>
            <div>
              <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: isLight ? '#e2e8f0' : '#334155' }}>
                <span className={`text-[10px] font-mono uppercase tracking-wider font-bold ${mutedClass}`}>
                  Target Session Countdown
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold bg-orange-100 text-orange-800 border border-orange-300">
                  LIVE IN IST
                </span>
              </div>
              <h2 className={`text-2xl font-black tracking-tight mt-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {f1.nextSession.name}
              </h2>
              <p className={`text-xs font-mono mt-1 flex items-center ${mutedClass}`}>
                <Calendar size={13} className="mr-1.5 text-orange-500" />
                {f1.nextSession.istTimeFormatted}
              </p>
            </div>

            {/* Big Countdown Digits */}
            <div className={`my-3 p-4 ${innerClass} flex items-center justify-around font-mono`}>
              <div className="text-center">
                <span className={`text-3xl font-black block ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {f1.nextSession.countdownFormatted.split(' ')[0] || '00'}
                </span>
                <span className={`text-[9px] uppercase tracking-widest font-bold ${mutedClass}`}>Days / Hrs</span>
              </div>
              <span className="text-xl font-black" style={{ color: 'var(--color-accent, #f97316)' }}>:</span>
              <div className="text-center">
                <span className="text-3xl font-black block" style={{ color: 'var(--color-accent, #f97316)' }}>
                  {f1.nextSession.countdownFormatted.split(' ')[1] || '00m'}
                </span>
                <span className={`text-[9px] uppercase tracking-widest font-bold ${mutedClass}`}>Minutes</span>
              </div>
            </div>

            {/* Circuit Quick Telemetry */}
            <div className="grid grid-cols-3 gap-2 font-mono text-xs">
              <div className={`p-2.5 ${innerClass} text-center`}>
                <span className={`block text-[9px] uppercase font-bold ${mutedClass}`}>Laps</span>
                <span className="font-bold text-xs">50 LAPS</span>
              </div>
              <div className={`p-2.5 ${innerClass} text-center`}>
                <span className={`block text-[9px] uppercase font-bold ${mutedClass}`}>Length</span>
                <span className="font-bold text-xs">6.201 KM</span>
              </div>
              <div className={`p-2.5 ${innerClass} text-center`}>
                <span className={`block text-[9px] uppercase font-bold ${mutedClass}`}>DRS</span>
                <span className="font-bold text-xs text-orange-500">2 ZONES</span>
              </div>
            </div>
          </div>

          {/* Track Conditions Card */}
          <div className={`p-3.5 ${cardClass} flex items-center justify-between text-xs font-mono`}>
            <div className="flex items-center space-x-2.5">
              <CloudSun size={20} className="text-orange-500" />
              <div>
                <span className="font-bold block">{weather.temperature}°C {weather.condition}</span>
                <span className={`text-[10px] ${mutedClass}`}>Circuit Climate</span>
              </div>
            </div>
            <div className="text-right text-[11px]">
              <div>Humidity: {weather.humidity}%</div>
              <div className="text-orange-500">Wind: {weather.windSpeed} km/h</div>
            </div>
          </div>
        </div>

        {/* Center Column (4 cols): Weekend Timetable */}
        <div className={`col-span-4 flex flex-col ${cardClass} p-5`}>
          <div className={`flex items-center justify-between border-b pb-2 mb-3 text-xs font-mono ${borderDivider} ${mutedClass}`}>
            <span className={`font-bold flex items-center space-x-1.5 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
              <Calendar size={14} style={{ color: 'var(--color-accent, #f97316)' }} />
              <span>WEEKEND TIMETABLE</span>
            </span>
            <span>IST (UTC+5:30)</span>
          </div>

          <div className="space-y-2.5 overflow-y-auto font-mono flex-1 max-h-[56vh] pr-1">
            {sessionsList.map((s) => {
              const isNext = f1.nextSession.name.toLowerCase().includes(s.label.toLowerCase());
              return (
                <div
                  key={s.key}
                  className={`p-3 ${innerClass} flex items-center justify-between ${
                    isNext ? 'border-l-4 border-orange-500' : ''
                  }`}
                >
                  <div>
                    <span className={`text-xs font-bold block ${isLight ? 'text-slate-900' : 'text-white'}`}>{s.label}</span>
                    <span className={`text-[11px] ${mutedClass}`}>{s.data?.istTime}</span>
                  </div>
                  <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold border ${
                    s.data?.status.toLowerCase() === 'completed'
                      ? isLight ? 'bg-slate-100 text-slate-500 border-slate-300' : 'bg-slate-800 text-slate-400 border-slate-700'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  }`}>
                    {s.data?.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (3 cols): World Drivers Championship */}
        <div className={`col-span-3 flex flex-col ${cardClass} p-5`}>
          <div className={`flex items-center justify-between border-b pb-2 mb-3 text-xs font-mono ${borderDivider} ${mutedClass}`}>
            <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>DRIVERS CHAMPIONSHIP</span>
            <span>PTS</span>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[56vh] font-mono flex-1 pr-1">
            {f1.standings.map((driver) => (
              <div
                key={driver.driverCode}
                className={`p-2.5 ${innerClass} flex items-center justify-between text-xs`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <span className={`w-4 font-bold ${mutedClass}`}>
                    #{driver.position}
                  </span>
                  <span
                    className="w-1.5 h-4 rounded-sm shrink-0"
                    style={{ backgroundColor: driver.teamColor || '#888' }}
                  />
                  <div className="truncate">
                    <span className={`font-bold uppercase block truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{driver.driver}</span>
                    <span className={`text-[10px] block truncate ${mutedClass}`}>({driver.team})</span>
                  </div>
                </div>
                <span className="font-bold shrink-0 ml-1" style={{ color: 'var(--color-accent, #f97316)' }}>
                  {driver.points} PTS
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. BOTTOM BAR */}
      <div className={`flex items-center justify-between pt-2 text-xs font-mono ${mutedClass}`}>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>F1 Telemetry Connected via Jolpica-F1 Service</span>
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
