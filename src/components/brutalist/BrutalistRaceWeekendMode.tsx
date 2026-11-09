import React, { useState } from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { BrutalistBox } from './BrutalistBox';
import { Flame, MapPin, Calendar, Award, Zap, CloudSun } from 'lucide-react';
import { AudioBanner } from '../common/AudioBanner';
import { F1WidgetsColumn } from '../f1/F1WidgetsColumn';

export const BrutalistRaceWeekendMode: React.FC = () => {
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
    <div className={`w-full h-full p-6 flex flex-col justify-between overflow-hidden bg-transparent select-none ${isLight ? 'text-black' : 'text-white'}`}>
      {/* 1. TOP BANNER */}
      <div className={`p-4 bg-red-600 text-white border-4 border-black flex items-center justify-between mb-3.5 ${
        isLight ? 'shadow-[5px_5px_0px_#000]' : 'shadow-[5px_5px_0px_#fff]'
      }`}>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-black text-yellow-400">
            <Flame size={24} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black uppercase tracking-widest bg-black px-2 py-0.5">
                ROUND {f1.activeRound}/{f1.totalRounds}
              </span>
              <h1 className="text-xl font-black uppercase tracking-tight">{f1.raceName}</h1>
            </div>
            <p className="text-xs font-bold text-red-100 flex items-center mt-0.5 uppercase">
              <MapPin size={12} className="mr-1" /> {f1.circuitName} • {f1.location}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Track Weather Beside Clock */}
          <div className={`px-3 py-1.5 border-2 border-white text-left ${
            isLight ? 'bg-yellow-400 text-black shadow-[3px_3px_0px_#000]' : 'bg-yellow-400 text-black shadow-[3px_3px_0px_#fff]'
          }`}>
            <span className="text-[9px] font-black uppercase tracking-wider block">CIRCUIT WEATHER</span>
            <div className="font-mono font-black text-sm flex items-center space-x-1.5">
              <span>{weather.temperature}°C {weather.condition.toUpperCase()}</span>
            </div>
            <span className="text-[9px] font-mono font-bold block">WIND {weather.windSpeed} KM/H</span>
          </div>

          <div className={`bg-black text-yellow-400 px-4 py-2 border-2 border-white text-right ${
            isLight ? 'shadow-[3px_3px_0px_#000]' : 'shadow-[3px_3px_0px_#000]'
          }`}>
            <span className="text-[10px] font-black uppercase tracking-wider block text-white">LIVE TIME • IST</span>
            <span className="text-base font-black text-yellow-300 font-mono tracking-wider">
              {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
            </span>
            <span className="text-[10px] font-mono font-bold block text-red-400 uppercase">UTC+5:30 TRACKSIDE</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN 3-COLUMN GRID */}
      <div className="grid grid-cols-12 gap-5 flex-1 min-h-0">
        {/* Left Column (5 cols): Dynamic Configurable F1 Widgets with Auto-Fitting */}
        <F1WidgetsColumn f1={f1} uiStyle="brutalist" isLight={isLight} className="col-span-5" />

        {/* Center Column (4 cols): Weekend Sessions (IST) */}
        <div className="col-span-4 flex flex-col">
          <BrutalistBox
            title="WEEKEND SCHEDULE (IST)"
            badge="LIVE TIMINGS"
            badgeColor="bg-yellow-400 text-black"
            className="h-full"
          >
            <div className="space-y-2 overflow-y-auto max-h-[56vh] pr-1 pt-1">
              {sessionsList.map((s) => {
                const isNext = f1.nextSession.name.toLowerCase().includes(s.label.toLowerCase());
                return (
                  <div
                    key={s.key}
                    className={`p-2 border-2 flex items-center justify-between ${
                      isNext
                        ? 'text-black border-black font-black'
                        : isLight
                          ? 'bg-neutral-100 text-black border-black shadow-[2px_2px_0px_#000]'
                          : 'bg-neutral-900 text-white border-white/40 shadow-[2px_2px_0px_#fff]'
                    }`}
                    style={isNext ? {
                      backgroundColor: 'var(--color-accent, #facc15)',
                      boxShadow: isLight ? '3px 3px 0px #000' : '3px 3px 0px #fff'
                    } : undefined}
                  >
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider block">{s.label}</span>
                      <span className="text-[11px] font-mono">{s.data?.istTime}</span>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-black uppercase border border-current">
                      {s.data?.status.toUpperCase()}
                    </span>
                  </div>
                );
              })}
            </div>
          </BrutalistBox>
        </div>

        {/* Right Column (3 cols): World Championship Standings with Toggle */}
        <div className="col-span-3 flex flex-col">
          <BrutalistBox
            title={standingsTab === 'drivers' ? 'DRIVERS (WDC)' : 'TEAMS (WCC)'}
            badge={
              <div className="flex space-x-1">
                <button
                  onClick={() => setStandingsTab('drivers')}
                  className={`px-1.5 py-0.2 text-[9px] font-black uppercase ${standingsTab === 'drivers' ? 'bg-black text-yellow-400' : 'text-neutral-500'}`}
                >
                  WDC
                </button>
                <button
                  onClick={() => setStandingsTab('constructors')}
                  className={`px-1.5 py-0.2 text-[9px] font-black uppercase ${standingsTab === 'constructors' ? 'bg-black text-yellow-400' : 'text-neutral-500'}`}
                >
                  WCC
                </button>
              </div>
            }
            badgeColor="bg-cyan-400 text-black"
            shadowColor={isLight ? 'shadow-[5px_5px_0px_#000]' : 'shadow-[5px_5px_0px_#00f0ff]'}
            className="h-full"
          >
            <div className="space-y-1.5 overflow-y-auto max-h-[56vh] pr-1 pt-1">
              {standingsTab === 'drivers' ? (
                f1.standings.map((driver) => (
                  <div
                    key={driver.driverCode}
                    className={`p-1.5 border-2 flex items-center justify-between text-xs ${
                      isLight
                        ? 'bg-neutral-100 border-black shadow-[2px_2px_0px_#000] text-black'
                        : 'bg-neutral-900 border-white/60 shadow-[2px_2px_0px_#fff] text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <span className={`w-5 h-5 font-black flex items-center justify-center text-[10px] shrink-0 ${
                        isLight ? 'bg-black text-white' : 'bg-white text-black'
                      }`}>
                        {driver.position}
                      </span>
                      <span
                        className="w-1.5 h-4 shrink-0"
                        style={{ backgroundColor: driver.teamColor || '#ff0000' }}
                      />
                      <div className="truncate">
                        <span className="font-black text-xs uppercase block truncate">{driver.driver}</span>
                        <span className={`text-[9px] uppercase truncate block ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>{driver.team}</span>
                      </div>
                    </div>
                    <div className="font-mono font-black text-xs shrink-0 ml-1" style={{ color: 'var(--color-accent)' }}>
                      {driver.points} PTS
                    </div>
                  </div>
                ))
              ) : (
                (f1.constructorStandings || []).map((team) => (
                  <div
                    key={team.team}
                    className={`p-1.5 border-2 flex items-center justify-between text-xs ${
                      isLight
                        ? 'bg-neutral-100 border-black shadow-[2px_2px_0px_#000] text-black'
                        : 'bg-neutral-900 border-white/60 shadow-[2px_2px_0px_#fff] text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <span className={`w-5 h-5 font-black flex items-center justify-center text-[10px] shrink-0 ${
                        isLight ? 'bg-black text-white' : 'bg-white text-black'
                      }`}>
                        {team.position}
                      </span>
                      <span
                        className="w-1.5 h-4 shrink-0"
                        style={{ backgroundColor: team.teamColor || '#ff0000' }}
                      />
                      <div className="truncate">
                        <span className="font-black text-xs uppercase block truncate">{team.team}</span>
                        <span className={`text-[9px] uppercase truncate block ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                          {team.wins > 0 ? `${team.wins} WINS` : '0 WINS'}
                        </span>
                      </div>
                    </div>
                    <div className="font-mono font-black text-xs shrink-0 ml-1" style={{ color: 'var(--color-accent)' }}>
                      {team.points} PTS
                    </div>
                  </div>
                ))
              )}
            </div>
          </BrutalistBox>
        </div>
      </div>

      {/* 3. BOTTOM BAR */}
      <div className={`flex items-center justify-between pt-2 border-t-2 border-black text-xs font-black uppercase ${
        isLight ? 'text-neutral-800' : 'text-neutral-300'
      }`}>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-red-600 animate-pulse border border-black" />
          <span>F1_PITWALL: 2026 LIVE TELEMETRY FEED</span>
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
