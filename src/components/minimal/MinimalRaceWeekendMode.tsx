import React, { useState } from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Calendar, CloudSun, Award, Zap } from 'lucide-react';
import { AudioBanner } from '../common/AudioBanner';
import { F1WidgetsColumn } from '../f1/F1WidgetsColumn';

export const MinimalRaceWeekendMode: React.FC = () => {
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

  return (
    <div className={`w-full h-full p-8 flex flex-col justify-between overflow-hidden bg-transparent select-none font-sans ${isLight ? 'text-neutral-900' : 'text-neutral-100'}`}>
      {/* 1. TOP HEADING */}
      <div className={`flex items-baseline justify-between pb-4 border-b ${isLight ? 'border-neutral-200' : 'border-white/10'}`}>
        <div>
          <span className={`text-[11px] font-mono tracking-widest uppercase block mb-1 ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>
            Round {f1.activeRound} of {f1.totalRounds} • {f1.country}
          </span>
          <h1 className={`text-2xl font-light tracking-tight ${isLight ? 'text-neutral-900' : 'text-white'}`}>{f1.raceName}</h1>
          <p className={`text-xs font-light mt-0.5 ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>{f1.circuitName}</p>
        </div>

        <div className="text-right">
          <span className={`text-[11px] font-mono uppercase block ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>Official Time (IST)</span>
          <span className={`text-base font-medium font-mono ${isLight ? 'text-neutral-900' : 'text-white'}`}>
            {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
          </span>
          <span className="text-xs font-mono font-medium block mt-0.5" style={{ color: 'var(--color-accent)' }}>UTC+5:30</span>
        </div>
      </div>

      {/* 2. MAIN 3-COLUMN GRID */}
      <div className="grid grid-cols-12 gap-7 flex-1 min-h-0 pt-4">
        {/* Left Column (5 cols): Dynamic Configurable F1 Widgets with Auto-Fitting */}
        <F1WidgetsColumn f1={f1} uiStyle="minimal" isLight={isLight} className={`col-span-5 border-r pr-7 ${isLight ? 'border-neutral-200' : 'border-white/10'}`} />

        {/* Center Column (4 cols): Weekend Sessions */}
        <div className={`col-span-4 flex flex-col border-r pr-7 ${isLight ? 'border-neutral-200' : 'border-white/10'}`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`text-xs uppercase tracking-widest font-medium ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
              Weekend Sessions (IST)
            </h3>
            <span className={`text-[10px] font-mono ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>UTC+5:30</span>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[56vh] pr-1">
            {sessionsList.map((s) => {
              const isNext = f1.nextSession.name.toLowerCase().includes(s.label.toLowerCase());
              return (
                <div
                  key={s.key}
                  className={`flex items-center justify-between py-1.5 px-2.5 rounded-lg border transition-all ${
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

        {/* Right Column (3 cols): Driver & Constructor Standings */}
        <div className="col-span-3 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-1 text-xs">
              <button
                onClick={() => setStandingsTab('drivers')}
                className={`text-[11px] uppercase tracking-wider transition-all ${
                  standingsTab === 'drivers'
                    ? 'font-bold underline underline-offset-4'
                    : isLight ? 'text-neutral-400 hover:text-neutral-800' : 'text-neutral-500 hover:text-neutral-200'
                }`}
              >
                Drivers
              </button>
              <span className={isLight ? 'text-neutral-300' : 'text-neutral-600'}>/</span>
              <button
                onClick={() => setStandingsTab('constructors')}
                className={`text-[11px] uppercase tracking-wider transition-all ${
                  standingsTab === 'constructors'
                    ? 'font-bold underline underline-offset-4'
                    : isLight ? 'text-neutral-400 hover:text-neutral-800' : 'text-neutral-500 hover:text-neutral-200'
                }`}
              >
                Teams
              </button>
            </div>
            <span className={`text-[10px] font-mono uppercase ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>PTS</span>
          </div>

          <div className="space-y-1 overflow-y-auto max-h-[56vh] pr-1">
            {standingsTab === 'drivers' ? (
              f1.standings.map((driver) => (
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
                      className="w-1 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: driver.teamColor || '#888' }}
                    />
                    <div className="truncate">
                      <span className={`font-light block truncate ${isLight ? 'text-neutral-800' : 'text-neutral-200'}`}>{driver.driver}</span>
                      <span className={`text-[9px] block truncate ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>{driver.team}</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-medium shrink-0 ml-1" style={{ color: 'var(--color-accent)' }}>
                    {driver.points}
                  </span>
                </div>
              ))
            ) : (
              (f1.constructorStandings || []).map((team) => (
                <div
                  key={team.team}
                  className={`flex items-center justify-between py-1.5 px-2 rounded border text-xs font-light ${
                    isLight ? 'border-neutral-200/60 hover:bg-neutral-50' : 'border-white/5 hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <span className={`w-4 font-mono text-[11px] ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      {team.position}
                    </span>
                    <span
                      className="w-1 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: team.teamColor || '#888' }}
                    />
                    <div className="truncate">
                      <span className={`font-light block truncate ${isLight ? 'text-neutral-800' : 'text-neutral-200'}`}>{team.team}</span>
                      <span className={`text-[9px] block truncate ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>
                        {team.wins > 0 ? `${team.wins} wins` : '0 wins'}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-medium shrink-0 ml-1" style={{ color: 'var(--color-accent)' }}>
                    {team.points}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 3. BOTTOM BAR */}
      <div className={`flex items-center justify-between pt-2.5 border-t text-xs font-mono ${
        isLight ? 'border-neutral-200 text-neutral-500' : 'border-white/10 text-neutral-500'
      }`}>
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>F1 Telemetry: Jolpica API Live Feed</span>
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
