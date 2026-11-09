import React, { useState } from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Gauge, Calendar, CloudSun, Award } from 'lucide-react';
import { AudioBanner } from '../common/AudioBanner';

export const NeumorphicRaceWeekendMode: React.FC = () => {
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
    ? 'bg-[#e2e8f0] shadow-[6px_6px_14px_#cbd5e1,-6px_-6px_14px_#ffffff] text-slate-900'
    : 'bg-[#1a1d24] shadow-[6px_6px_14px_#101217,-6px_-6px_14px_#242831] text-neutral-200';

  const insetClass = isLight
    ? 'bg-[#e2e8f0] shadow-[inset_2px_2px_5px_#cbd5e1,inset_-2px_-2px_5px_#ffffff]'
    : 'bg-[#1a1d24] shadow-[inset_2px_2px_5px_#101217,inset_-2px_-2px_5px_#242831]';

  return (
    <div className={`w-full h-full p-8 flex flex-col justify-between overflow-hidden bg-transparent select-none ${
      isLight ? 'text-slate-900' : 'text-neutral-200'
    }`}>
      {/* 1. TOP BANNER */}
      <div className={`p-4 rounded-3xl ${cardClass} flex items-center justify-between mb-3.5`}>
        <div className="flex items-center space-x-3.5">
          <div className={`p-2.5 rounded-2xl ${insetClass} text-red-500`}>
            <Gauge size={22} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-[10px] px-2 py-0.5 rounded-lg ${insetClass} text-red-500 font-bold uppercase`}>
                Round {f1.activeRound}/{f1.totalRounds}
              </span>
              <h1 className={`text-xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>{f1.raceName}</h1>
            </div>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
              {f1.circuitName} • {f1.location}
            </p>
          </div>
        </div>

        <div className={`text-right px-4 py-2 rounded-2xl ${insetClass}`}>
          <span className={`text-[10px] uppercase block font-medium ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>Official Time (IST)</span>
          <span className={`text-sm font-bold font-mono tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
          </span>
          <span className="text-xs font-mono font-bold text-red-500 block">UTC+5:30</span>
        </div>
      </div>

      {/* 2. MAIN 3-COLUMN GRID */}
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left Column (5 cols): Hero Countdown, Circuit Telemetry & Previous GP */}
        <div className="col-span-5 flex flex-col space-y-3">
          {/* Hero Countdown Card (Compact) */}
          <div className={`p-4 rounded-3xl ${cardClass}`}>
            <div className="flex items-center justify-between border-b pb-1.5" style={{ borderColor: isLight ? '#cbd5e1' : '#2a2f3b' }}>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                Target Session
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${insetClass} text-red-500 uppercase`}>
                Live in IST
              </span>
            </div>

            {/* Horizontal Split */}
            <div className="flex items-center justify-between py-2">
              <div>
                <h2 className={`text-lg font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {f1.nextSession.name}
                </h2>
                <p className={`text-xs font-mono mt-0.5 flex items-center ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                  <Calendar size={12} className="mr-1.5 text-red-500" />
                  {f1.nextSession.istTimeFormatted}
                </p>
              </div>

              {/* Inset Countdown Display (Compact) */}
              <div className={`px-3 py-1.5 rounded-2xl ${insetClass} flex items-center space-x-2 font-mono`}>
                <div className="text-center">
                  <span className={`text-lg font-bold block leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {f1.nextSession.countdownFormatted.split(' ')[0] || '00'}
                  </span>
                  <span className={`text-[8px] uppercase tracking-wider block ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>Days/Hrs</span>
                </div>
                <span className="text-sm text-red-500 font-bold">:</span>
                <div className="text-center">
                  <span className="text-lg font-bold text-red-500 block leading-tight">
                    {f1.nextSession.countdownFormatted.split(' ')[1] || '00m'}
                  </span>
                  <span className={`text-[8px] uppercase tracking-wider block ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>Mins</span>
                </div>
              </div>
            </div>

            {/* Circuit Telemetry */}
            <div className="grid grid-cols-4 gap-1.5 text-xs pt-1">
              <div className={`p-1.5 rounded-xl ${insetClass} text-center`}>
                <span className={`block text-[8px] uppercase font-bold ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>Laps</span>
                <span className="font-mono font-bold text-xs">50</span>
              </div>
              <div className={`p-1.5 rounded-xl ${insetClass} text-center`}>
                <span className={`block text-[8px] uppercase font-bold ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>Length</span>
                <span className="font-mono font-bold text-xs">6.2 KM</span>
              </div>
              <div className={`p-1.5 rounded-xl ${insetClass} text-center`}>
                <span className={`block text-[8px] uppercase font-bold ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>DRS</span>
                <span className="font-mono font-bold text-xs text-red-500">2 ZONES</span>
              </div>
              <div className={`p-1.5 rounded-xl ${insetClass} text-center`}>
                <span className={`block text-[8px] uppercase font-bold ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>Record</span>
                <span className="font-mono font-bold text-xs text-amber-500">{f1.circuitLapRecord?.lapTime || '1:35.4'}</span>
              </div>
            </div>
          </div>

          {/* Previous GP Podium Card */}
          {f1.lastRace && (
            <div className={`p-3 rounded-2xl ${cardClass} text-xs`}>
              <div className="flex items-center justify-between pb-1 border-b text-[10px] font-bold" style={{ borderColor: isLight ? '#cbd5e1' : '#2a2f3b' }}>
                <span className="flex items-center space-x-1">
                  <Award size={12} className="text-amber-500" />
                  <span>PREV GP: {f1.lastRace.raceName}</span>
                </span>
                <span className="text-purple-400">FL: {f1.lastRace.fastestLapDriver} ({f1.lastRace.fastestLapTime})</span>
              </div>
              <div className="grid grid-cols-3 gap-1 pt-1 text-[10px]">
                <div className="truncate"><span className="text-amber-500 font-bold">1st:</span> {f1.lastRace.winner}</div>
                <div className="truncate"><span className="text-slate-400 font-bold">2nd:</span> {f1.lastRace.p2.split(' ')[0]} {f1.lastRace.p2.split(' ')[1]}</div>
                <div className="truncate"><span className="text-amber-700 font-bold">3rd:</span> {f1.lastRace.p3.split(' ')[0]} {f1.lastRace.p3.split(' ')[1]}</div>
              </div>
            </div>
          )}

          {/* Track Conditions Card */}
          <div className={`p-2.5 rounded-2xl ${cardClass} flex items-center justify-between text-xs`}>
            <div className="flex items-center space-x-2">
              <CloudSun size={18} className="text-amber-500" />
              <div>
                <span className="font-mono font-bold text-xs block">{weather.temperature}°C {weather.condition}</span>
                <span className={`text-[9px] ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>Track Ambient</span>
              </div>
            </div>
            <div className="text-right font-mono text-[10px]">
              <div>Humidity: {weather.humidity}%</div>
              <div className="text-red-500">Wind: {weather.windSpeed} km/h</div>
            </div>
          </div>
        </div>

        {/* Center Column (4 cols): Weekend Sessions */}
        <div className="col-span-4 flex flex-col">
          <div className={`p-5 rounded-3xl ${cardClass} h-full flex flex-col`}>
            <span className={`text-[10px] font-bold uppercase tracking-wider border-b pb-2 mb-3 ${
              isLight ? 'text-slate-500 border-slate-300' : 'text-neutral-400 border-neutral-700/50'
            }`}>
              Weekend Sessions (IST)
            </span>
            <div className="space-y-2 overflow-y-auto max-h-[56vh] pr-1">
              {sessionsList.map((s) => {
                const isNext = f1.nextSession.name.toLowerCase().includes(s.label.toLowerCase());
                return (
                  <div
                    key={s.key}
                    className={`p-2.5 rounded-2xl flex items-center justify-between ${
                      isNext
                        ? isLight
                          ? 'bg-[#cbd5e1] shadow-[inset_2px_2px_5px_#94a3b8,inset_-2px_-2px_5px_#f1f5f9] font-bold text-slate-900'
                          : 'bg-[#222731] shadow-[inset_2px_2px_5px_#0e1014,inset_-2px_-2px_5px_#2c323f] font-bold text-white'
                        : insetClass
                    }`}
                  >
                    <div>
                      <span className="text-xs font-medium block">{s.label}</span>
                      <span className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>{s.data?.istTime}</span>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-lg uppercase ${
                        isNext ? 'text-white' : (isLight ? 'text-slate-500' : 'text-neutral-400')
                      }`}
                      style={isNext ? { backgroundColor: 'var(--color-accent)' } : undefined}
                    >
                      {s.data?.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (3 cols): Driver & Constructor Standings */}
        <div className="col-span-3 flex flex-col">
          <div className={`p-5 rounded-3xl ${cardClass} h-full flex flex-col`}>
            <div className="flex items-center justify-between border-b pb-2 mb-3">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setStandingsTab('drivers')}
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-lg ${
                    standingsTab === 'drivers' ? insetClass + ' text-red-500' : 'text-neutral-500'
                  }`}
                >
                  Drivers
                </button>
                <button
                  onClick={() => setStandingsTab('constructors')}
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-lg ${
                    standingsTab === 'constructors' ? insetClass + ' text-red-500' : 'text-neutral-500'
                  }`}
                >
                  Teams
                </button>
              </div>
              <span className={`text-[9px] font-mono ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>PTS</span>
            </div>

            <div className="space-y-1.5 overflow-y-auto max-h-[56vh] pr-1">
              {standingsTab === 'drivers' ? (
                f1.standings.map((driver) => (
                  <div
                    key={driver.driverCode}
                    className={`p-2 rounded-2xl ${insetClass} flex items-center justify-between text-xs`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <span className={`w-4 font-mono text-[11px] ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>
                        #{driver.position}
                      </span>
                      <span
                        className="w-1.5 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: driver.teamColor || '#888' }}
                      />
                      <div className="truncate">
                        <span className={`font-medium block truncate ${isLight ? 'text-slate-900' : 'text-neutral-200'}`}>{driver.driver}</span>
                        <span className={`text-[9px] block truncate ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>({driver.team})</span>
                      </div>
                    </div>
                    <span className="font-mono font-medium shrink-0 ml-1" style={{ color: 'var(--color-accent)' }}>
                      {driver.points}
                    </span>
                  </div>
                ))
              ) : (
                (f1.constructorStandings || []).map((team) => (
                  <div
                    key={team.team}
                    className={`p-2 rounded-2xl ${insetClass} flex items-center justify-between text-xs`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <span className={`w-4 font-mono text-[11px] ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>
                        #{team.position}
                      </span>
                      <span
                        className="w-1.5 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: team.teamColor || '#888' }}
                      />
                      <div className="truncate">
                        <span className={`font-medium block truncate ${isLight ? 'text-slate-900' : 'text-neutral-200'}`}>{team.team}</span>
                        <span className={`text-[9px] block truncate ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>
                          {team.wins > 0 ? `${team.wins} wins` : '0 wins'}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono font-medium shrink-0 ml-1" style={{ color: 'var(--color-accent)' }}>
                      {team.points}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM BAR */}
      <div className={`flex items-center justify-between pt-2 text-xs ${
        isLight ? 'text-slate-500' : 'text-neutral-500'
      }`}>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>F1 Telemetry Connected (2026 Grid Sync)</span>
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
