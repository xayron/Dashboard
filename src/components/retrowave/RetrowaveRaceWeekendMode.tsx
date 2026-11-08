import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Flame, Flag, Trophy, Gauge } from 'lucide-react';

export const RetrowaveRaceWeekendMode: React.FC = () => {
  const { f1 } = useDashboard();

  return (
    <div className="w-full h-full p-6 flex flex-col justify-between overflow-hidden bg-[#0c0317] font-mono text-cyan-200 select-none">
      {/* Top Banner */}
      <div className="p-3 bg-[#16062b] border-2 border-pink-500 shadow-[0_0_25px_rgba(255,42,133,0.25)] flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-pink-600 to-fuchsia-600 text-white">
            <Gauge size={22} className="animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] bg-pink-950 text-pink-300 border border-pink-500/60 px-2 py-0.5 font-bold uppercase">
                ROUND {f1.activeRound}/{f1.totalRounds}
              </span>
              <h1 className="text-xl font-black text-white tracking-wide uppercase">{f1.raceName}</h1>
            </div>
            <p className="text-xs text-pink-400 mt-0.5">
              CIRCUIT: {f1.circuitName} // {f1.location}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-gray-400 block uppercase">SESSION TARGET</span>
          <span className="text-sm font-bold text-amber-400">{f1.nextSession.name}</span>
          <span className="text-xs font-black text-pink-400 block">{f1.nextSession.countdownFormatted}</span>
        </div>
      </div>

      {/* Grid: Sessions & Leaderboard */}
      <div className="grid grid-cols-12 gap-5 flex-1 min-h-0">
        {/* Sessions */}
        <div className="col-span-5 flex flex-col">
          <div className="p-4 border-2 border-fuchsia-500/60 bg-[#150729] shadow-[0_0_20px_rgba(217,70,239,0.2)] h-full flex flex-col">
            <span className="text-[10px] text-fuchsia-400 font-bold uppercase tracking-widest border-b border-fuchsia-500/30 pb-1 mb-3">
              TIMETABLE//IST
            </span>
            <div className="space-y-3">
              {Object.entries(f1.sessions).map(([key, s]) => {
                if (!s) return null;
                const isNext = f1.nextSession.name.toLowerCase().includes(s.name.toLowerCase());
                return (
                  <div
                    key={key}
                    className={`p-2.5 border flex items-center justify-between ${
                      isNext
                        ? 'bg-gradient-to-r from-pink-950/80 to-fuchsia-950/80 border-pink-400 text-pink-200 shadow-[0_0_15px_rgba(255,42,133,0.3)]'
                        : 'bg-black/40 border-fuchsia-500/20 text-gray-400'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-white block">{s.name}</span>
                      <span className="text-[11px] text-cyan-400">{s.istTime}</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 border border-current font-bold">
                      [{s.status.toUpperCase()}]
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Drivers Standings */}
        <div className="col-span-7 flex flex-col">
          <div className="p-4 border-2 border-cyan-500/60 bg-[#150729] shadow-[0_0_20px_rgba(0,240,255,0.2)] h-full flex flex-col">
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest border-b border-cyan-500/30 pb-1 mb-3">
              DRIVERS LEADERBOARD
            </span>
            <div className="space-y-2 overflow-y-auto max-h-[50vh] pr-1">
              {f1.standings.map((driver) => (
                <div
                  key={driver.number}
                  className="p-2 bg-black/40 border border-cyan-500/30 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-5 text-amber-400 font-bold">
                      #{driver.position}
                    </span>
                    <span
                      className="w-1.5 h-4"
                      style={{ backgroundColor: driver.teamColor || '#ff2a85' }}
                    />
                    <div>
                      <span className="font-bold text-white">{driver.driver}</span>
                      <span className="text-[11px] text-pink-400 ml-2">[{driver.team}]</span>
                    </div>
                  </div>
                  <span className="font-bold text-cyan-300">{driver.points} PTS</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
