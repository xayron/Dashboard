import React, { useState } from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Gauge, Calendar, CloudSun, Award } from 'lucide-react';
import { AudioBanner } from '../common/AudioBanner';

export const RetrowaveRaceWeekendMode: React.FC = () => {
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
    <div className={`relative w-full h-full p-6 flex flex-col justify-between overflow-hidden bg-transparent select-none ${
      isLight ? 'text-pink-950' : 'text-pink-100'
    }`}>
      {/* 80s Perspective Floor Lines */}
      <div
        className="absolute inset-x-0 bottom-0 h-64 pointer-events-none opacity-20 z-0"
        style={{
          backgroundImage: 'linear-gradient(to right, var(--color-accent, #ff007f) 1px, transparent 1px), linear-gradient(to bottom, var(--color-accent, #ff007f) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          transform: 'perspective(300px) rotateX(60deg)',
          transformOrigin: 'bottom center',
        }}
      />

      {/* 1. TOP BANNER */}
      <div className={`relative z-10 p-4 rounded-2xl border-2 flex items-center justify-between mb-3.5 ${
        isLight
          ? 'bg-pink-50/90 border-pink-400 shadow-[0_0_25px_rgba(236,72,153,0.18)] text-slate-900'
          : 'bg-[#1e0736]/90 border-pink-500 shadow-[0_0_30px_rgba(255,0,127,0.3)] text-pink-100'
      }`}
      style={{ borderColor: 'var(--color-accent)' }}
      >
        <div className="flex items-center space-x-3.5">
          <div
            className="p-2.5 rounded-xl bg-gradient-to-tr from-pink-600 to-amber-500 text-white shadow-md"
            style={{ boxShadow: isLight ? 'none' : '0 0 15px var(--color-accent)' }}
          >
            <Gauge size={22} className="animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-[10px] px-2 py-0.5 font-black uppercase rounded border ${
                isLight ? 'bg-pink-100 text-pink-900 border-pink-300' : 'bg-pink-950 text-amber-300 border-pink-500'
              }`}>
                STAGE {f1.activeRound}/{f1.totalRounds}
              </span>
              <h1 className={`text-xl font-black italic tracking-wide uppercase ${
                isLight ? 'text-slate-900' : 'text-white drop-shadow-[0_0_10px_rgba(255,0,127,0.6)]'
              }`}>
                {f1.raceName}
              </h1>
            </div>
            <p className={`text-xs font-bold mt-0.5 ${isLight ? 'text-slate-600' : 'text-pink-300'}`}>
              CIRCUIT: {f1.circuitName} • {f1.location}
            </p>
          </div>
        </div>

        <div className={`text-right px-4 py-2 rounded-xl border ${
          isLight ? 'bg-white/80 border-pink-300' : 'bg-pink-950/70 border-pink-500/50'
        }`}>
          <span className={`text-[10px] uppercase font-bold block ${isLight ? 'text-pink-800' : 'text-amber-300'}`}>GRID TIME // IST</span>
          <span className="text-sm font-black font-mono tracking-wider" style={{ color: 'var(--color-accent)' }}>
            {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
          </span>
          <span className="text-xs font-black font-mono text-rose-500 block">UTC+5:30 // TRACKSIDE</span>
        </div>
      </div>

      {/* 2. MAIN 3-COLUMN GRID */}
      <div className="relative z-10 grid grid-cols-12 gap-5 flex-1 min-h-0">
        {/* Left Column (5 cols): Hero Countdown, Circuit Telemetry & Prev Checkpoint */}
        <div className="col-span-5 flex flex-col space-y-3">
          {/* Hero Countdown Card (Compact) */}
          <div
            className={`p-3.5 rounded-2xl border-2 ${
              isLight
                ? 'bg-pink-50/90 border-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.15)]'
                : 'bg-[#1e0736]/90 border-pink-500 shadow-[0_0_25px_rgba(255,0,127,0.25)]'
            }`}
            style={{ borderColor: 'var(--color-accent)' }}
          >
            <div className="flex items-center justify-between border-b pb-1.5" style={{ borderColor: isLight ? 'rgba(236,72,153,0.3)' : 'rgba(255,0,127,0.3)' }}>
              <span className={`text-[10px] font-black uppercase tracking-wider ${isLight ? 'text-pink-800' : 'text-amber-300'}`}>
                NEXT CHECKPOINT COUNTDOWN
              </span>
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${
                isLight ? 'bg-pink-200 text-pink-900 border-pink-400' : 'bg-pink-950 text-rose-300 border-pink-500'
              }`}>
                LIVE IN IST
              </span>
            </div>

            {/* Horizontal Split */}
            <div className="flex items-center justify-between py-2">
              <div>
                <h2 className={`text-lg font-black italic tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {f1.nextSession.name}
                </h2>
                <p className={`text-xs font-mono font-bold mt-0.5 flex items-center ${isLight ? 'text-slate-600' : 'text-pink-300'}`}>
                  <Calendar size={12} className="mr-1.5 text-rose-500" />
                  {f1.nextSession.istTimeFormatted}
                </p>
              </div>

              {/* Compact Neon Countdown */}
              <div className={`px-3 py-1.5 rounded-xl border-2 text-center ${
                isLight ? 'bg-white/80 border-pink-300 shadow-sm' : 'bg-black/60 border-pink-500/50'
              }`}>
                <div className={`text-[8px] uppercase font-black tracking-wider ${isLight ? 'text-pink-700' : 'text-amber-300'}`}>
                  TIME REMAINING
                </div>
                <div className="text-base font-black font-mono text-rose-500 tracking-wider animate-pulse drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]">
                  {f1.nextSession.countdownFormatted}
                </div>
              </div>
            </div>

            {/* Quick Circuit Specs */}
            <div className="grid grid-cols-4 gap-1.5 text-xs pt-1">
              <div className={`p-1.5 rounded-xl border text-center ${isLight ? 'bg-white/70 border-pink-200' : 'bg-black/40 border-pink-500/30'}`}>
                <span className={`block text-[8px] uppercase font-bold ${isLight ? 'text-pink-800' : 'text-amber-300'}`}>Laps</span>
                <span className="font-mono font-black text-xs">50</span>
              </div>
              <div className={`p-1.5 rounded-xl border text-center ${isLight ? 'bg-white/70 border-pink-200' : 'bg-black/40 border-pink-500/30'}`}>
                <span className={`block text-[8px] uppercase font-bold ${isLight ? 'text-pink-800' : 'text-amber-300'}`}>Length</span>
                <span className="font-mono font-black text-xs">6.2 KM</span>
              </div>
              <div className={`p-1.5 rounded-xl border text-center ${isLight ? 'bg-white/70 border-pink-200' : 'bg-black/40 border-pink-500/30'}`}>
                <span className={`block text-[8px] uppercase font-bold ${isLight ? 'text-pink-800' : 'text-amber-300'}`}>DRS Boost</span>
                <span className="font-mono font-black text-xs text-rose-500">2 ZONES</span>
              </div>
              <div className={`p-1.5 rounded-xl border text-center ${isLight ? 'bg-white/70 border-pink-200' : 'bg-black/40 border-pink-500/30'}`}>
                <span className={`block text-[8px] uppercase font-bold ${isLight ? 'text-pink-800' : 'text-amber-300'}`}>Record</span>
                <span className="font-mono font-black text-xs text-amber-400">{f1.circuitLapRecord?.lapTime || '1:35.4'}</span>
              </div>
            </div>
          </div>

          {/* Previous Checkpoint Podium Card */}
          {f1.lastRace && (
            <div
              className={`p-2.5 rounded-xl border-2 text-xs ${
                isLight ? 'bg-pink-50/90 border-pink-300' : 'bg-[#1e0736]/90 border-pink-500/40'
              }`}
            >
              <div className="flex items-center justify-between pb-1 border-b border-pink-500/30 text-[10px] font-black uppercase">
                <span className="flex items-center space-x-1">
                  <Award size={12} className="text-amber-400" />
                  <span>PREV PODIUM: {f1.lastRace.raceName}</span>
                </span>
                <span className="text-purple-400">FL: {f1.lastRace.fastestLapDriver} ({f1.lastRace.fastestLapTime})</span>
              </div>
              <div className="grid grid-cols-3 gap-1 pt-1 text-[10px]">
                <div className="truncate"><span className="text-amber-400 font-bold">1st:</span> {f1.lastRace.winner}</div>
                <div className="truncate"><span className="text-pink-300 font-bold">2nd:</span> {f1.lastRace.p2.split(' ')[0]} {f1.lastRace.p2.split(' ')[1]}</div>
                <div className="truncate"><span className="text-pink-300 font-bold">3rd:</span> {f1.lastRace.p3.split(' ')[0]} {f1.lastRace.p3.split(' ')[1]}</div>
              </div>
            </div>
          )}

          {/* Track Weather Card */}
          <div
            className={`p-2.5 rounded-2xl border-2 flex items-center justify-between text-xs ${
              isLight ? 'bg-pink-50/90 border-pink-300' : 'bg-[#1e0736]/90 border-pink-500/40'
            }`}
          >
            <div className="flex items-center space-x-2">
              <CloudSun size={18} className="text-amber-400" />
              <div>
                <span className="font-mono font-black text-xs block">{weather.temperature}°C {weather.condition}</span>
                <span className={`text-[9px] font-bold uppercase ${isLight ? 'text-pink-700' : 'text-pink-300/80'}`}>CIRCUIT CONDITIONS</span>
              </div>
            </div>
            <div className="text-right font-mono text-[10px] font-bold">
              <div>HUM: {weather.humidity}%</div>
              <div className="text-rose-500">WIND: {weather.windSpeed} KM/H</div>
            </div>
          </div>
        </div>

        {/* Center Column (4 cols): Highway Checkpoints */}
        <div className="col-span-4 flex flex-col">
          <div
            className={`p-4 rounded-2xl border-2 h-full flex flex-col ${
              isLight
                ? 'bg-pink-50/90 border-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.15)]'
                : 'bg-[#1e0736]/90 border-pink-500 shadow-[0_0_25px_rgba(255,0,127,0.25)]'
            }`}
            style={{ borderColor: 'var(--color-accent)' }}
          >
            <span className={`text-[10px] font-black uppercase tracking-wider border-b pb-2 mb-3 ${
              isLight ? 'text-pink-800 border-pink-200' : 'text-amber-300 border-pink-500/30'
            }`}>
              HIGHWAY CHECKPOINTS (IST)
            </span>
            <div className="space-y-2 overflow-y-auto max-h-[56vh] pr-1">
              {sessionsList.map((s) => {
                const isNext = f1.nextSession.name.toLowerCase().includes(s.label.toLowerCase());
                return (
                  <div
                    key={s.key}
                    className={`p-2 rounded-xl border flex items-center justify-between ${
                      isNext
                        ? isLight
                          ? 'bg-pink-200/80 border-pink-500 font-bold text-slate-900 shadow-sm'
                          : 'bg-gradient-to-r from-pink-600/40 to-purple-600/40 border-pink-400 font-bold text-white shadow-[0_0_15px_rgba(255,0,127,0.3)]'
                        : isLight
                          ? 'bg-white/80 border-pink-200 text-slate-800'
                          : 'bg-[#120320] border-pink-500/25 text-pink-200'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-black uppercase block">{s.label}</span>
                      <span className={`text-[11px] font-mono ${isLight ? 'text-slate-600' : 'text-pink-300/80'}`}>{s.data?.istTime}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                      isNext
                        ? 'bg-pink-500 text-white border-pink-400'
                        : isLight
                          ? 'bg-pink-100 text-pink-900 border-pink-300'
                          : 'bg-black/40 text-pink-300 border-pink-500/40'
                    }`}>
                      {s.data?.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (3 cols): Speedway Standings with Toggle */}
        <div className="col-span-3 flex flex-col">
          <div
            className={`p-4 rounded-2xl border-2 h-full flex flex-col ${
              isLight
                ? 'bg-pink-50/90 border-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.15)]'
                : 'bg-[#1e0736]/90 border-pink-500 shadow-[0_0_25px_rgba(255,0,127,0.25)]'
            }`}
            style={{ borderColor: 'var(--color-accent)' }}
          >
            <div className="flex items-center justify-between border-b pb-2 mb-3">
              <div className="flex space-x-1 text-[10px] font-black uppercase">
                <button
                  onClick={() => setStandingsTab('drivers')}
                  className={`px-1.5 py-0.5 rounded ${standingsTab === 'drivers' ? 'bg-pink-500 text-white' : 'text-pink-400'}`}
                >
                  PILOTS
                </button>
                <button
                  onClick={() => setStandingsTab('constructors')}
                  className={`px-1.5 py-0.5 rounded ${standingsTab === 'constructors' ? 'bg-pink-500 text-white' : 'text-pink-400'}`}
                >
                  SQUADS
                </button>
              </div>
              <span className={`text-[9px] font-mono font-bold ${isLight ? 'text-pink-700' : 'text-amber-300'}`}>PTS</span>
            </div>

            <div className="space-y-1.5 overflow-y-auto max-h-[56vh] pr-1">
              {standingsTab === 'drivers' ? (
                f1.standings.map((driver) => (
                  <div
                    key={driver.driverCode}
                    className={`p-2 rounded-xl border flex items-center justify-between text-xs ${
                      isLight
                        ? 'bg-white/80 border-pink-200 text-slate-900'
                        : 'bg-[#120320] border-pink-500/25 text-pink-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <span className={`w-4 font-mono font-black ${isLight ? 'text-pink-700' : 'text-amber-300'}`}>
                        #{driver.position}
                      </span>
                      <span
                        className="w-1.5 h-3.5 rounded-full shrink-0"
                        style={{ backgroundColor: driver.teamColor || '#ff007f' }}
                      />
                      <div className="truncate">
                        <span className={`font-black uppercase block truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{driver.driver}</span>
                        <span className={`text-[9px] block truncate ${isLight ? 'text-pink-700' : 'text-pink-300/70'}`}>({driver.team})</span>
                      </div>
                    </div>
                    <span className="font-mono font-black shrink-0 ml-1" style={{ color: 'var(--color-accent)' }}>
                      {driver.points}
                    </span>
                  </div>
                ))
              ) : (
                (f1.constructorStandings || []).map((team) => (
                  <div
                    key={team.team}
                    className={`p-2 rounded-xl border flex items-center justify-between text-xs ${
                      isLight
                        ? 'bg-white/80 border-pink-200 text-slate-900'
                        : 'bg-[#120320] border-pink-500/25 text-pink-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <span className={`w-4 font-mono font-black ${isLight ? 'text-pink-700' : 'text-amber-300'}`}>
                        #{team.position}
                      </span>
                      <span
                        className="w-1.5 h-3.5 rounded-full shrink-0"
                        style={{ backgroundColor: team.teamColor || '#ff007f' }}
                      />
                      <div className="truncate">
                        <span className={`font-black uppercase block truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{team.team}</span>
                        <span className={`text-[9px] block truncate ${isLight ? 'text-pink-700' : 'text-pink-300/70'}`}>
                          {team.wins > 0 ? `${team.wins} WINS` : '0 WINS'}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono font-black shrink-0 ml-1" style={{ color: 'var(--color-accent)' }}>
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
      <div className={`relative z-10 flex items-center justify-between pt-2 border-t text-xs font-bold ${
        isLight ? 'border-pink-300 text-pink-800' : 'border-pink-500/30 text-pink-300/80'
      }`}>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
          <span>SPEEDWAY_TELEMETRY: 2026 LIVE STREAM ACTIVE</span>
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
