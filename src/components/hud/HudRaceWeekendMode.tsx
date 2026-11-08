import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { HudBox } from './HudBox';
import { Flag, Trophy, Gauge, Target, Compass } from 'lucide-react';

export const HudRaceWeekendMode: React.FC = () => {
  const { f1 } = useDashboard();

  return (
    <div className="w-full h-full p-6 flex flex-col justify-between overflow-hidden bg-[#030712] font-mono text-cyan-200 select-none">
      {/* Top Telemetry Header */}
      <div className="p-3 bg-[#050e20] border border-cyan-500/50 shadow-[0_0_20px_rgba(0,240,255,0.08)] flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-cyan-950 border border-cyan-500/60 text-cyan-400">
            <Gauge size={22} className="animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] bg-red-950/80 text-red-400 border border-red-500/50 px-2 py-0.5">
                ROUND {f1.activeRound}/{f1.totalRounds}
              </span>
              <h1 className="text-xl font-black text-white tracking-wide">{f1.raceName}</h1>
            </div>
            <p className="text-xs text-cyan-500 mt-0.5">
              CIRCUIT: {f1.circuitName} // {f1.location}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-gray-400 block">TARGET SESSION</span>
          <span className="text-sm font-bold text-amber-400">{f1.nextSession.name}</span>
          <span className="text-xs text-cyan-300 block">{f1.nextSession.countdownFormatted}</span>
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
                        ? 'bg-cyan-950/50 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                        : 'bg-[#04091a] border-cyan-500/20 text-gray-400'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-white block">{s.name}</span>
                      <span className="text-[11px] text-cyan-400">{s.istTime}</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 border border-current">
                      [{s.status.toUpperCase()}]
                    </span>
                  </div>
                );
              })}
            </div>
          </HudBox>
        </div>

        {/* Drivers Standings */}
        <div className="col-span-7 flex flex-col">
          <HudBox title="CHAMPIONSHIP_TELEMETRY" code="DRIVERS" glowColor="amber" className="h-full">
            <div className="space-y-2 overflow-y-auto max-h-[50vh] pr-1">
              {f1.standings.map((driver) => (
                <div
                  key={driver.number}
                  className="p-2 bg-[#04091a] border border-cyan-500/25 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-5 text-amber-400 font-bold">
                      #{driver.position}
                    </span>
                    <span
                      className="w-1.5 h-4"
                      style={{ backgroundColor: driver.teamColor || '#00f0ff' }}
                    />
                    <div>
                      <span className="font-bold text-white">{driver.driver}</span>
                      <span className="text-[11px] text-gray-500 ml-2">[{driver.team}]</span>
                    </div>
                  </div>
                  <span className="font-bold text-cyan-300">{driver.points} PTS</span>
                </div>
              ))}
            </div>
          </HudBox>
        </div>
      </div>
    </div>
  );
};
