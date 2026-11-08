import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Flag, Trophy, Gauge } from 'lucide-react';

export const NeumorphicRaceWeekendMode: React.FC = () => {
  const { f1 } = useDashboard();

  return (
    <div className="w-full h-full p-8 flex flex-col justify-between overflow-hidden bg-[#1a1d24] text-neutral-200 select-none">
      {/* Top Banner */}
      <div className="p-4 rounded-3xl bg-[#1a1d24] shadow-[6px_6px_14px_#101217,-6px_-6px_14px_#242831] flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-2.5 rounded-2xl bg-[#1a1d24] shadow-[inset_2px_2px_5px_#101217,inset_-2px_-2px_5px_#242831] text-red-400">
            <Gauge size={22} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] px-2 py-0.5 rounded-lg bg-[#1a1d24] shadow-[inset_1px_1px_3px_#101217,inset_-1px_-1px_3px_#242831] text-red-400 font-bold uppercase">
                Round {f1.activeRound}/{f1.totalRounds}
              </span>
              <h1 className="text-xl font-bold text-white tracking-tight">{f1.raceName}</h1>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              {f1.circuitName} • {f1.location}
            </p>
          </div>
        </div>

        <div className="text-right px-4 py-2 rounded-2xl bg-[#1a1d24] shadow-[inset_2px_2px_5px_#101217,inset_-2px_-2px_5px_#242831]">
          <span className="text-[10px] text-neutral-500 uppercase block">Next Session</span>
          <span className="text-sm font-bold text-white">{f1.nextSession.name}</span>
          <span className="text-xs font-mono font-bold text-red-400 block">{f1.nextSession.countdownFormatted}</span>
        </div>
      </div>

      {/* Grid: Sessions & Standings */}
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Sessions */}
        <div className="col-span-5 flex flex-col">
          <div className="p-5 rounded-3xl bg-[#1a1d24] shadow-[6px_6px_14px_#101217,-6px_-6px_14px_#242831] h-full flex flex-col">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider border-b border-neutral-700/50 pb-2 mb-3">
              Weekend Sessions (IST)
            </span>
            <div className="space-y-3">
              {Object.entries(f1.sessions).map(([key, s]) => {
                if (!s) return null;
                const isNext = f1.nextSession.name.toLowerCase().includes(s.name.toLowerCase());
                return (
                  <div
                    key={key}
                    className={`p-3 rounded-2xl flex items-center justify-between text-xs transition-all ${
                      isNext
                        ? 'bg-[#1a1d24] shadow-[inset_3px_3px_6px_#101217,inset_-3px_-3px_6px_#242831] border border-red-500/30'
                        : 'bg-[#1a1d24] shadow-[3px_3px_6px_#101217,-3px_-3px_6px_#242831]'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-white block">{s.name}</span>
                      <span className="text-[11px] font-mono text-neutral-400">{s.istTime}</span>
                    </div>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-lg bg-[#1a1d24] shadow-[inset_1px_1px_3px_#101217,inset_-1px_-1px_3px_#242831]">
                      {s.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Drivers Leaderboard */}
        <div className="col-span-7 flex flex-col">
          <div className="p-5 rounded-3xl bg-[#1a1d24] shadow-[6px_6px_14px_#101217,-6px_-6px_14px_#242831] h-full flex flex-col">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider border-b border-neutral-700/50 pb-2 mb-3">
              Championship Standings
            </span>
            <div className="space-y-2 overflow-y-auto max-h-[50vh] pr-1">
              {f1.standings.map((driver) => (
                <div
                  key={driver.number}
                  className="p-2.5 rounded-2xl bg-[#1a1d24] shadow-[inset_2px_2px_5px_#101217,inset_-2px_-2px_5px_#242831] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-5 font-mono text-neutral-500 font-bold">
                      #{driver.position}
                    </span>
                    <span
                      className="w-1.5 h-4 rounded-full"
                      style={{ backgroundColor: driver.teamColor || '#3b82f6' }}
                    />
                    <div>
                      <span className="font-bold text-white">{driver.driver}</span>
                      <span className="text-neutral-500 text-[11px] ml-2">({driver.team})</span>
                    </div>
                  </div>
                  <span className="font-bold font-mono text-neutral-200">{driver.points} PTS</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
