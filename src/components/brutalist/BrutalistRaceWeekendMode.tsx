import React, { useState } from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { BrutalistBox } from './BrutalistBox';
import { Flame, MapPin, Calendar, Award, Zap, CloudSun } from 'lucide-react';
import { AudioBanner } from '../common/AudioBanner';

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

      {/* 2. MAIN 3-COLUMN GRID */}
      <div className="grid grid-cols-12 gap-5 flex-1 min-h-0">
        {/* Left Column (5 cols): Next Session Hero, Circuit Telemetry & Previous GP */}
        <div className="col-span-5 flex flex-col space-y-3">
          {/* Hero Countdown Box (Compact) */}
          <BrutalistBox
            title="NEXT SESSION COUNTDOWN"
            badge="LIVE IN IST"
            badgeColor="bg-red-600 text-white"
          >
            <div className="py-1">
              <div className="flex items-center justify-between pb-2 border-b-2 border-black">
                <div>
                  <div className={`text-[9px] font-black uppercase tracking-wider ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                    TARGET SESSION
                  </div>
                  <div className="text-lg font-black uppercase tracking-tight">
                    {f1.nextSession.name}
                  </div>
                  <div className="text-xs font-mono font-bold mt-0.5 flex items-center text-red-500">
                    <Calendar size={12} className="mr-1.5" />
                    {f1.nextSession.istTimeFormatted}
                  </div>
                </div>

                {/* Compact Countdown Box */}
                <div
                  className={`px-3 py-1.5 border-2 border-black text-center ${
                    isLight ? 'shadow-[2px_2px_0px_#000]' : 'shadow-[2px_2px_0px_#fff]'
                  }`}
                  style={{ backgroundColor: 'var(--color-accent, #facc15)' }}
                >
                  <div className="text-[8px] font-black uppercase tracking-widest text-black">
                    T-MINUS
                  </div>
                  <div className="text-base font-black font-mono text-black tracking-wider">
                    {f1.nextSession.countdownFormatted}
                  </div>
                </div>
              </div>

              {/* Circuit Quick Telemetry */}
              <div className="grid grid-cols-4 gap-1.5 text-xs pt-2">
                <div className={`p-1 border-2 border-black text-center ${isLight ? 'bg-neutral-100 shadow-[2px_2px_0px_#000]' : 'bg-neutral-900 shadow-[2px_2px_0px_#fff]'}`}>
                  <span className={`block text-[8px] font-black uppercase ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>Laps</span>
                  <span className="font-mono font-black text-xs">50</span>
                </div>
                <div className={`p-1 border-2 border-black text-center ${isLight ? 'bg-neutral-100 shadow-[2px_2px_0px_#000]' : 'bg-neutral-900 shadow-[2px_2px_0px_#fff]'}`}>
                  <span className={`block text-[8px] font-black uppercase ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>Length</span>
                  <span className="font-mono font-black text-xs">6.2 KM</span>
                </div>
                <div className={`p-1 border-2 border-black text-center ${isLight ? 'bg-neutral-100 shadow-[2px_2px_0px_#000]' : 'bg-neutral-900 shadow-[2px_2px_0px_#fff]'}`}>
                  <span className={`block text-[8px] font-black uppercase ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>DRS</span>
                  <span className="font-mono font-black text-xs text-red-500">2 ZONES</span>
                </div>
                <div className={`p-1 border-2 border-black text-center ${isLight ? 'bg-neutral-100 shadow-[2px_2px_0px_#000]' : 'bg-neutral-900 shadow-[2px_2px_0px_#fff]'}`}>
                  <span className={`block text-[8px] font-black uppercase ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>Record</span>
                  <span className="font-mono font-black text-xs text-amber-500">{f1.circuitLapRecord?.lapTime || '1:35.4'}</span>
                </div>
              </div>
            </div>
          </BrutalistBox>

          {/* Previous GP Podium Card */}
          {f1.lastRace && (
            <BrutalistBox
              title={`PREV GP: ${f1.lastRace.raceName.toUpperCase()}`}
              badge={`FL: ${f1.lastRace.fastestLapDriver} (${f1.lastRace.fastestLapTime})`}
              badgeColor="bg-purple-600 text-white"
            >
              <div className="grid grid-cols-3 gap-2 text-xs py-0.5">
                <div className={`p-1.5 border-2 border-black ${isLight ? 'bg-yellow-300 shadow-[2px_2px_0px_#000]' : 'bg-yellow-400 text-black shadow-[2px_2px_0px_#fff]'}`}>
                  <div className="font-black text-[10px]">🥇 P1 WINNER</div>
                  <div className="font-black truncate">{f1.lastRace.winner}</div>
                </div>
                <div className={`p-1.5 border-2 border-black ${isLight ? 'bg-neutral-100 shadow-[2px_2px_0px_#000]' : 'bg-neutral-900 text-white shadow-[2px_2px_0px_#fff]'}`}>
                  <div className="font-black text-[10px]">🥈 P2</div>
                  <div className="font-black truncate">{f1.lastRace.p2.split(' ')[0]} {f1.lastRace.p2.split(' ')[1]}</div>
                </div>
                <div className={`p-1.5 border-2 border-black ${isLight ? 'bg-neutral-100 shadow-[2px_2px_0px_#000]' : 'bg-neutral-900 text-white shadow-[2px_2px_0px_#fff]'}`}>
                  <div className="font-black text-[10px]">🥉 P3</div>
                  <div className="font-black truncate">{f1.lastRace.p3.split(' ')[0]} {f1.lastRace.p3.split(' ')[1]}</div>
                </div>
              </div>
            </BrutalistBox>
          )}

          {/* Track Conditions Box */}
          <BrutalistBox
            title="TRACK CONDITIONS"
            badge="LOCAL METEO"
            badgeColor="bg-cyan-400 text-black"
          >
            <div className="flex items-center justify-between py-0.5">
              <div className="flex items-center space-x-2.5">
                <CloudSun size={20} className="text-amber-500" />
                <div>
                  <div className="font-mono font-black text-sm">{weather.temperature}°C</div>
                  <div className={`text-[10px] font-black uppercase ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>{weather.condition}</div>
                </div>
              </div>
              <div className="text-right font-mono text-[11px] font-bold">
                <div>HUM: {weather.humidity}%</div>
                <div className="text-red-500">WIND: {weather.windSpeed} KM/H</div>
              </div>
            </div>
          </BrutalistBox>
        </div>

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
