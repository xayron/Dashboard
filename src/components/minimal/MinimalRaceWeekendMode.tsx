import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Trophy, Clock } from 'lucide-react';

export const MinimalRaceWeekendMode: React.FC = () => {
  const { f1 } = useDashboard();

  return (
    <div className="w-full h-full p-12 flex flex-col justify-between overflow-hidden bg-[#09090b] text-neutral-100 select-none">
      {/* Top Heading */}
      <div className="flex items-baseline justify-between pb-6 border-b border-white/10">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-neutral-500 uppercase block mb-1">
            Round {f1.activeRound} of {f1.totalRounds} • {f1.country}
          </span>
          <h1 className="text-3xl font-light text-white tracking-tight">{f1.raceName}</h1>
          <p className="text-xs text-neutral-400 font-light mt-0.5">{f1.circuitName}</p>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-mono text-neutral-500 uppercase block">Next Up</span>
          <span className="text-base font-light text-white">{f1.nextSession.name}</span>
          <span className="text-xs font-mono text-neutral-400 block mt-0.5">{f1.nextSession.countdownFormatted}</span>
        </div>
      </div>

      {/* Grid: Timetable & Standings */}
      <div className="grid grid-cols-12 gap-10 flex-1 min-h-0 pt-6">
        {/* Sessions */}
        <div className="col-span-5 flex flex-col border-r border-white/10 pr-10">
          <h3 className="text-xs uppercase tracking-widest text-neutral-500 font-medium mb-4">
            Weekend Sessions (IST)
          </h3>
          <div className="space-y-4">
            {Object.entries(f1.sessions).map(([key, s]) => {
              if (!s) return null;
              return (
                <div key={key} className="flex items-center justify-between py-1 border-b border-white/5">
                  <div>
                    <span className="text-xs font-light text-neutral-200 block">{s.name}</span>
                    <span className="text-[11px] font-mono text-neutral-500">{s.istTime}</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase text-neutral-500">
                    {s.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Drivers Table */}
        <div className="col-span-7 flex flex-col">
          <h3 className="text-xs uppercase tracking-widest text-neutral-500 font-medium mb-4">
            Driver Standings
          </h3>
          <div className="space-y-2 overflow-y-auto max-h-[50vh] pr-2">
            {f1.standings.map((driver) => (
              <div
                key={driver.number}
                className="flex items-center justify-between py-1.5 border-b border-white/5 text-xs font-light"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-5 text-neutral-500 font-mono text-[11px]">
                    {driver.position}
                  </span>
                  <span
                    className="w-1 h-3.5 rounded-full"
                    style={{ backgroundColor: driver.teamColor || '#fff' }}
                  />
                  <span className="text-neutral-200">{driver.driver}</span>
                  <span className="text-neutral-500 text-[11px]">({driver.team})</span>
                </div>
                <span className="font-mono text-neutral-300">{driver.points} pts</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
