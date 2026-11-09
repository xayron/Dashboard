import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { HudBox } from './HudBox';
import { Gauge, Calendar, CloudSun } from 'lucide-react';
import { AudioBanner } from '../common/AudioBanner';

export const HudRaceWeekendMode: React.FC = () => {
  const { f1, media, weather, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  const sessionsList = [
    { key: 'fp1', label: 'FP1', data: f1.sessions.fp1 },
    { key: 'fp2', label: 'FP2', data: f1.sessions.fp2 },
    { key: 'fp3', label: 'FP3', data: f1.sessions.fp3 },
    { key: 'sprintQualifying', label: 'SPRINT_QUAL', data: f1.sessions.sprintQualifying },
    { key: 'sprint', label: 'SPRINT_RACE', data: f1.sessions.sprint },
    { key: 'qualifying', label: 'QUALIFYING', data: f1.sessions.qualifying },
    { key: 'race', label: 'GRAND_PRIX', data: f1.sessions.race },
  ].filter(s => s.data !== undefined);

  return (
    <div className={`w-full h-full p-6 flex flex-col justify-between overflow-hidden bg-transparent font-mono select-none ${
      isLight ? 'text-slate-900' : 'text-cyan-200'
    }`}>
      {/* 1. TOP TELEMETRY HEADER */}
      <div className={`p-3 border flex items-center justify-between mb-4 ${
        isLight
          ? 'bg-cyan-50/80 border-cyan-400/50 shadow-[0_0_20px_rgba(0,180,216,0.1)]'
          : 'bg-[#050e20] border-cyan-500/50 shadow-[0_0_20px_rgba(0,240,255,0.08)]'
      }`}>
        <div className="flex items-center space-x-3">
          <div
            className="p-2 border"
            style={{
              backgroundColor: 'var(--theme-accent-soft)',
              borderColor: 'var(--color-accent)',
              color: 'var(--color-accent)',
            }}
          >
            <Gauge size={22} className="animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] bg-red-950/80 text-red-400 border border-red-500/50 px-2 py-0.5">
                ROUND {f1.activeRound}/{f1.totalRounds}
              </span>
              <h1 className={`text-xl font-black tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}>{f1.raceName}</h1>
            </div>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-cyan-400'}`}>
              CIRCUIT: {f1.circuitName} // {f1.location}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className={`text-[10px] block ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>TARGET SESSION</span>
          <span className="text-sm font-bold" style={{ color: 'var(--color-accent)' }}>{f1.nextSession.name}</span>
          <span className={`text-xs block ${isLight ? 'text-slate-600' : 'text-cyan-300'}`}>{f1.nextSession.countdownFormatted}</span>
        </div>
      </div>

      {/* 2. MAIN 3-COLUMN GRID */}
      <div className="grid grid-cols-12 gap-5 flex-1 min-h-0">
        {/* Left Column (5 cols): Next Session Hero & Circuit Telemetry */}
        <div className="col-span-5 flex flex-col space-y-4">
          <HudBox title="NEXT_SESSION_COUNTDOWN" code="LIVE_IST" glowColor="cyan" className="flex-1">
            <div className="flex flex-col justify-between h-full py-1">
              <div>
                <span className={`text-[10px] block ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>TARGET_EVENT</span>
                <span className={`text-2xl font-black tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}>{f1.nextSession.name}</span>
                <span className="text-xs font-mono block mt-1 flex items-center" style={{ color: 'var(--color-accent)' }}>
                  <Calendar size={13} className="mr-1.5" />
                  {f1.nextSession.istTimeFormatted}
                </span>
              </div>

              {/* T-Minus Display */}
              <div className={`my-3 p-3.5 border text-center ${
                isLight ? 'bg-cyan-100/60 border-cyan-400' : 'bg-black/60 border-cyan-500/50'
              }`}>
                <div className={`text-[10px] uppercase tracking-widest ${isLight ? 'text-slate-600' : 'text-cyan-300'}`}>
                  COUNTDOWN TO GREEN LIGHT
                </div>
                <div className="text-3xl font-black font-mono mt-1 tracking-wider text-rose-500 animate-pulse">
                  T-{f1.nextSession.countdownFormatted}
                </div>
              </div>

              {/* Circuit Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className={`p-2 border ${isLight ? 'bg-white/80 border-cyan-200' : 'bg-black/40 border-cyan-500/20'}`}>
                  <span className={`block text-[9px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>LAPS</span>
                  <span className="font-bold">50 LAPS</span>
                </div>
                <div className={`p-2 border ${isLight ? 'bg-white/80 border-cyan-200' : 'bg-black/40 border-cyan-500/20'}`}>
                  <span className={`block text-[9px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>LENGTH</span>
                  <span className="font-bold">6.201 KM</span>
                </div>
                <div className={`p-2 border ${isLight ? 'bg-white/80 border-cyan-200' : 'bg-black/40 border-cyan-500/20'}`}>
                  <span className={`block text-[9px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>DRS</span>
                  <span className="font-bold text-rose-500">2 ZONES</span>
                </div>
              </div>
            </div>
          </HudBox>

          <HudBox title="CIRCUIT_TELEMETRY" code="METEO" glowColor="cyan">
            <div className="flex items-center justify-between py-1 text-xs">
              <div className="flex items-center space-x-2.5">
                <CloudSun size={20} style={{ color: 'var(--color-accent)' }} />
                <div>
                  <div className="font-bold">{weather.temperature}°C {weather.condition}</div>
                  <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>AMBIENT TRACK TEMP</div>
                </div>
              </div>
              <div className="text-right font-mono text-[11px]">
                <div>HUMIDITY: {weather.humidity}%</div>
                <div style={{ color: 'var(--color-accent)' }}>WIND: {weather.windSpeed} KM/H</div>
              </div>
            </div>
          </HudBox>
        </div>

        {/* Center Column (4 cols): Sessions Timeline */}
        <div className="col-span-4 flex flex-col">
          <HudBox title="SESSION_TIMELINE" code="IST_ZONE" glowColor="cyan" className="h-full">
            <div className="space-y-2.5 overflow-y-auto max-h-[56vh] pr-1 pt-1">
              {sessionsList.map((s) => {
                const isNext = f1.nextSession.name.toLowerCase().includes(s.label.toLowerCase());
                return (
                  <div
                    key={s.key}
                    className={`p-2.5 border flex items-center justify-between ${
                      isNext
                        ? isLight
                          ? 'bg-cyan-100/90 border-cyan-500 font-bold text-slate-900'
                          : 'bg-cyan-950/80 border-cyan-400 font-bold text-cyan-200 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                        : isLight
                          ? 'bg-white/80 border-cyan-200/60 text-slate-700'
                          : 'bg-black/40 border-cyan-500/20 text-cyan-400/80'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold block">{s.label}</span>
                      <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>{s.data?.istTime}</span>
                    </div>
                    <span
                      className="px-2 py-0.5 text-[10px] border uppercase"
                      style={isNext ? {
                        backgroundColor: 'var(--theme-accent-soft)',
                        borderColor: 'var(--color-accent)',
                        color: 'var(--color-accent)',
                      } : undefined}
                    >
                      {s.data?.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </HudBox>
        </div>

        {/* Right Column (3 cols): Pilot Telemetry Standings */}
        <div className="col-span-3 flex flex-col">
          <HudBox title="PILOT_TELEMETRY" code="CHAMPIONSHIP" glowColor="amber" className="h-full">
            <div className="space-y-2 overflow-y-auto max-h-[56vh] pr-1 pt-1">
              {f1.standings.map((driver) => (
                <div
                  key={driver.driverCode}
                  className={`p-2 border flex items-center justify-between text-xs ${
                    isLight
                      ? 'bg-cyan-50/60 border-cyan-200/60 text-slate-800'
                      : 'bg-black/40 border-cyan-500/20 text-cyan-300'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <span className={`w-4 font-bold ${isLight ? 'text-slate-500' : 'text-cyan-500'}`}>
                      #{driver.position}
                    </span>
                    <span
                      className="w-1.5 h-4 shrink-0"
                      style={{ backgroundColor: driver.teamColor || '#ff0000' }}
                    />
                    <div className="truncate">
                      <span className={`font-bold block truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{driver.driver}</span>
                      <span className={`text-[10px] block truncate ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>({driver.team})</span>
                    </div>
                  </div>
                  <span className="font-bold shrink-0 ml-1" style={{ color: 'var(--color-accent)' }}>
                    {driver.points} PTS
                  </span>
                </div>
              ))}
            </div>
          </HudBox>
        </div>
      </div>

      {/* 3. BOTTOM STATUS BAR */}
      <div className={`flex items-center justify-between pt-2 border-t text-xs ${
        isLight ? 'border-cyan-200 text-slate-600' : 'border-cyan-500/20 text-cyan-400/80'
      }`}>
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>PITWALL_ONLINE // JOLPICA_FEED_ACTIVE</span>
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
