import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { HudBox } from './HudBox';
import { Gauge } from 'lucide-react';

export const HudRaceWeekendMode: React.FC = () => {
  const { f1, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  return (
    <div className={`w-full h-full p-6 flex flex-col justify-between overflow-hidden bg-transparent font-mono select-none ${
      isLight ? 'text-slate-900' : 'text-cyan-200'
    }`}>
      {/* Top Telemetry Header */}
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

      {/* Grid: Sessions & Leaderboard */}
      <div className="grid grid-cols-12 gap-5 flex-1 min-h-0">
        {/* Sessions */}
        <div className="col-span-5 flex flex-col">
          <HudBox title="SESSION_TIMELINE" code="IST_ZONE" glowColor="cyan" className="h-full">
            <div className="space-y-3 pt-1">
              {Object.entries(f1.sessions).map(([key, s]) => {
                if (!s) return null;
                const isNext = f1.nextSession.name.toLowerCase().includes(s.name.toLowerCase());
                return (
                  <div
                    key={key}
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
                      <span className="text-xs font-bold block">{s.name}</span>
                      <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>{s.istTime}</span>
                    </div>
                    <span
                      className="px-2 py-0.5 text-[10px] border uppercase"
                      style={isNext ? {
                        backgroundColor: 'var(--theme-accent-soft)',
                        borderColor: 'var(--color-accent)',
                        color: 'var(--color-accent)',
                      } : undefined}
                    >
                      {s.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </HudBox>
        </div>

        {/* Drivers Standings */}
        <div className="col-span-7 flex flex-col">
          <HudBox title="PILOT_TELEMETRY" code="CHAMPIONSHIP" glowColor="amber" className="h-full">
            <div className="space-y-2 overflow-y-auto max-h-[50vh] pr-1">
              {f1.standings.map((driver) => (
                <div
                  key={driver.number}
                  className={`p-2 border flex items-center justify-between text-xs ${
                    isLight
                      ? 'bg-cyan-50/60 border-cyan-200/60 text-slate-800'
                      : 'bg-black/40 border-cyan-500/20 text-cyan-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`w-5 font-bold ${isLight ? 'text-slate-500' : 'text-cyan-500'}`}>
                      #{driver.position}
                    </span>
                    <span
                      className="w-1.5 h-4"
                      style={{ backgroundColor: driver.teamColor || '#ff0000' }}
                    />
                    <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{driver.driver}</span>
                    <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>({driver.team})</span>
                  </div>
                  <span className="font-bold" style={{ color: 'var(--color-accent)' }}>
                    {driver.points} PTS
                  </span>
                </div>
              ))}
            </div>
          </HudBox>
        </div>
      </div>
    </div>
  );
};
