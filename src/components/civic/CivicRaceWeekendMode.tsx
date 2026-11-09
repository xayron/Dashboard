import React, { useState } from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Calendar, CloudSun, Award } from 'lucide-react';
import { AudioBanner } from '../common/AudioBanner';

export const CivicRaceWeekendMode: React.FC = () => {
  const { now, f1, media, weather, colorMode } = useDashboard();
  const isLight = colorMode === 'light';
  const [standingsTab, setStandingsTab] = useState<'drivers' | 'constructors'>('drivers');

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
      <div className={`p-4 ${cardClass} flex items-center justify-between mb-3.5 relative overflow-hidden`}>
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
          <span className={`text-[10px] uppercase block font-bold ${mutedClass}`}>Official Clock • IST</span>
          <span className={`text-base font-black tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
          </span>
          <span className="text-xs block font-black mt-0.5" style={{ color: 'var(--color-accent, #f97316)' }}>UTC+5:30 // TRACKSIDE</span>
        </div>
      </div>

      {/* 2. MAIN 3-COLUMN GRID */}
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left Column (5 cols): Hero Countdown, Circuit Telemetry & Previous GP */}
        <div className="col-span-5 flex flex-col space-y-3">
          {/* Hero Countdown Card (Compact) */}
          <div className={`p-4 ${cardClass}`}>
            <div className="flex items-center justify-between border-b pb-1.5" style={{ borderColor: isLight ? '#e2e8f0' : '#334155' }}>
              <span className={`text-[10px] font-mono uppercase tracking-wider font-bold ${mutedClass}`}>
                Target Session Countdown
              </span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold bg-orange-100 text-orange-800 border border-orange-300">
                LIVE IN IST
              </span>
            </div>

            {/* Horizontal Split */}
            <div className="flex items-center justify-between py-2">
              <div>
                <h2 className={`text-lg font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {f1.nextSession.name}
                </h2>
                <p className={`text-xs font-mono mt-0.5 flex items-center ${mutedClass}`}>
                  <Calendar size={12} className="mr-1.5 text-orange-500" />
                  {f1.nextSession.istTimeFormatted}
                </p>
              </div>

              {/* Compact Countdown Digits */}
              <div className={`px-3 py-1.5 ${innerClass} flex items-center space-x-2 font-mono`}>
                <div className="text-center">
                  <span className={`text-lg font-black block leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {f1.nextSession.countdownFormatted.split(' ')[0] || '00'}
                  </span>
                  <span className={`text-[8px] uppercase tracking-wider font-bold ${mutedClass}`}>Days/Hrs</span>
                </div>
                <span className="text-sm font-black" style={{ color: 'var(--color-accent, #f97316)' }}>:</span>
                <div className="text-center">
                  <span className="text-lg font-black block leading-tight" style={{ color: 'var(--color-accent, #f97316)' }}>
                    {f1.nextSession.countdownFormatted.split(' ')[1] || '00m'}
                  </span>
                  <span className={`text-[8px] uppercase tracking-wider font-bold ${mutedClass}`}>Mins</span>
                </div>
              </div>
            </div>

            {/* Circuit Quick Telemetry */}
            <div className="grid grid-cols-4 gap-1.5 font-mono text-xs pt-1">
              <div className={`p-1.5 ${innerClass} text-center`}>
                <span className={`block text-[8px] uppercase font-bold ${mutedClass}`}>Laps</span>
                <span className="font-bold text-xs">50</span>
              </div>
              <div className={`p-1.5 ${innerClass} text-center`}>
                <span className={`block text-[8px] uppercase font-bold ${mutedClass}`}>Length</span>
                <span className="font-bold text-xs">6.2 KM</span>
              </div>
              <div className={`p-1.5 ${innerClass} text-center`}>
                <span className={`block text-[8px] uppercase font-bold ${mutedClass}`}>DRS</span>
                <span className="font-bold text-xs text-orange-500">2 ZONES</span>
              </div>
              <div className={`p-1.5 ${innerClass} text-center`}>
                <span className={`block text-[8px] uppercase font-bold ${mutedClass}`}>Record</span>
                <span className="font-bold text-xs text-amber-500">{f1.circuitLapRecord?.lapTime || '1:35.4'}</span>
              </div>
            </div>
          </div>

          {/* Previous GP Podium Card */}
          {f1.lastRace && (
            <div className={`p-2.5 ${cardClass} text-xs font-mono`}>
              <div className="flex items-center justify-between pb-1 border-b text-[10px]" style={{ borderColor: isLight ? '#e2e8f0' : '#334155' }}>
                <span className="font-bold flex items-center space-x-1">
                  <Award size={12} className="text-amber-500" />
                  <span>PREV GP: {f1.lastRace.raceName}</span>
                </span>
                <span className="text-purple-400">FL: {f1.lastRace.fastestLapDriver} ({f1.lastRace.fastestLapTime})</span>
              </div>
              <div className="grid grid-cols-3 gap-1 pt-1 text-[10px]">
                <div className="truncate"><span className="text-amber-500 font-bold">1st:</span> {f1.lastRace.winner}</div>
                <div className="truncate"><span className="font-bold">2nd:</span> {f1.lastRace.p2.split(' ')[0]} {f1.lastRace.p2.split(' ')[1]}</div>
                <div className="truncate"><span className="font-bold">3rd:</span> {f1.lastRace.p3.split(' ')[0]} {f1.lastRace.p3.split(' ')[1]}</div>
              </div>
            </div>
          )}

          {/* Track Conditions Card */}
          <div className={`p-2.5 ${cardClass} flex items-center justify-between text-xs font-mono`}>
            <div className="flex items-center space-x-2">
              <CloudSun size={18} className="text-orange-500" />
              <div>
                <span className="font-bold text-xs block">{weather.temperature}°C {weather.condition}</span>
                <span className={`text-[9px] ${mutedClass}`}>Circuit Climate</span>
              </div>
            </div>
            <div className="text-right text-[10px]">
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

          <div className="space-y-2 overflow-y-auto font-mono flex-1 max-h-[56vh] pr-1">
            {sessionsList.map((s) => {
              const isNext = f1.nextSession.name.toLowerCase().includes(s.label.toLowerCase());
              return (
                <div
                  key={s.key}
                  className={`p-2.5 ${innerClass} flex items-center justify-between ${
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

        {/* Right Column (3 cols): World Drivers Championship with Switcher */}
        <div className={`col-span-3 flex flex-col ${cardClass} p-5`}>
          <div className={`flex items-center justify-between border-b pb-2 mb-3 text-xs font-mono ${borderDivider}`}>
            <div className="flex space-x-1 text-[10px] font-bold">
              <button
                onClick={() => setStandingsTab('drivers')}
                className={`px-2 py-0.5 rounded ${
                  standingsTab === 'drivers' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Drivers
              </button>
              <button
                onClick={() => setStandingsTab('constructors')}
                className={`px-2 py-0.5 rounded ${
                  standingsTab === 'constructors' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Teams
              </button>
            </div>
            <span className={`text-[9px] font-mono ${mutedClass}`}>PTS</span>
          </div>

          <div className="space-y-1.5 overflow-y-auto max-h-[56vh] font-mono flex-1 pr-1">
            {standingsTab === 'drivers' ? (
              f1.standings.map((driver) => (
                <div
                  key={driver.driverCode}
                  className={`p-2 ${innerClass} flex items-center justify-between text-xs`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span className={`w-4 font-bold ${mutedClass}`}>
                      #{driver.position}
                    </span>
                    <span
                      className="w-1.5 h-3.5 rounded-sm shrink-0"
                      style={{ backgroundColor: driver.teamColor || '#888' }}
                    />
                    <div className="truncate">
                      <span className={`font-bold uppercase block truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{driver.driver}</span>
                      <span className={`text-[9px] block truncate ${mutedClass}`}>({driver.team})</span>
                    </div>
                  </div>
                  <span className="font-bold shrink-0 ml-1" style={{ color: 'var(--color-accent, #f97316)' }}>
                    {driver.points}
                  </span>
                </div>
              ))
            ) : (
              (f1.constructorStandings || []).map((team) => (
                <div
                  key={team.team}
                  className={`p-2 ${innerClass} flex items-center justify-between text-xs`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span className={`w-4 font-bold ${mutedClass}`}>
                      #{team.position}
                    </span>
                    <span
                      className="w-1.5 h-3.5 rounded-sm shrink-0"
                      style={{ backgroundColor: team.teamColor || '#888' }}
                    />
                    <div className="truncate">
                      <span className={`font-bold uppercase block truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{team.team}</span>
                      <span className={`text-[9px] block truncate ${mutedClass}`}>
                        {team.wins > 0 ? `${team.wins} wins` : '0 wins'}
                      </span>
                    </div>
                  </div>
                  <span className="font-bold shrink-0 ml-1" style={{ color: 'var(--color-accent, #f97316)' }}>
                    {team.points}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 3. BOTTOM BAR */}
      <div className={`flex items-center justify-between pt-2 text-xs font-mono ${mutedClass}`}>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>F1 Telemetry Connected via Jolpica-F1 Service (2026 Feed)</span>
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
