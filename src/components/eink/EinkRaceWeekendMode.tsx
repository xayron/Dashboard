import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Flag, Trophy } from 'lucide-react';

export const EinkRaceWeekendMode: React.FC = () => {
  const { f1 } = useDashboard();

  return (
    <div className="w-full h-full p-8 flex flex-col justify-between overflow-hidden bg-[#f5f2eb] text-[#1c1917] font-serif select-none">
      {/* Top Banner */}
      <div className="p-4 border-2 border-stone-800 bg-[#ede8df] shadow-[3px_3px_0px_#1c1917] flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono uppercase text-stone-600">
            <span>MOTORSPORT GAZETTE</span>
            <span>•</span>
            <span>ROUND {f1.activeRound} OF {f1.totalRounds}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight uppercase text-stone-900 mt-0.5">{f1.raceName}</h1>
          <p className="text-xs italic text-stone-600">{f1.circuitName} — {f1.location}</p>
        </div>

        <div className="text-right border-l border-stone-400 pl-4">
          <span className="text-[10px] font-mono uppercase text-stone-600 block">Upcoming Trial</span>
          <span className="text-sm font-bold text-stone-900">{f1.nextSession.name}</span>
          <span className="text-xs font-mono text-stone-600 block font-bold">{f1.nextSession.countdownFormatted}</span>
        </div>
      </div>

      {/* Grid: Timetable & Championship */}
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Sessions */}
        <div className="col-span-5 flex flex-col border-r-2 border-stone-300 pr-6">
          <h3 className="text-xs uppercase font-bold tracking-widest text-stone-900 border-b-2 border-stone-800 pb-1 mb-3">
            Programme of the Weekend
          </h3>
          <div className="space-y-3">
            {Object.entries(f1.sessions).map(([key, s]) => {
              if (!s) return null;
              return (
                <div key={key} className="p-2 border border-stone-400 bg-[#ede8df] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold block">{s.name}</span>
                    <span className="text-[11px] font-mono text-stone-600">{s.istTime}</span>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-1 border border-stone-600">
                    {s.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Drivers Standings */}
        <div className="col-span-7 flex flex-col">
          <h3 className="text-xs uppercase font-bold tracking-widest text-stone-900 border-b-2 border-stone-800 pb-1 mb-3">
            Drivers&apos; Championship Table
          </h3>
          <div className="space-y-1.5 overflow-y-auto max-h-[50vh] pr-1 text-xs">
            {f1.standings.map((driver) => (
              <div
                key={driver.number}
                className="p-1.5 border-b border-stone-300 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-5 font-mono font-bold text-stone-600">
                    #{driver.position}
                  </span>
                  <div>
                    <span className="font-bold text-stone-900">{driver.driver}</span>
                    <span className="text-stone-600 italic text-[11px] ml-1.5">({driver.team})</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-stone-900">{driver.points} pts</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
