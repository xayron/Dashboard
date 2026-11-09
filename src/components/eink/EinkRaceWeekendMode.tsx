import React from 'react';
import { useDashboard } from '../../state/DashboardContext';

export const EinkRaceWeekendMode: React.FC = () => {
  const { f1, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  return (
    <div className={`w-full h-full p-8 flex flex-col justify-between overflow-hidden bg-transparent font-serif select-none ${
      isLight ? 'text-[#1c1917]' : 'text-[#f5f2eb]'
    }`}>
      {/* Top Banner */}
      <div className={`p-4 border-2 flex items-center justify-between mb-4 ${
        isLight
          ? 'border-stone-800 bg-[#ede8df] shadow-[3px_3px_0px_#1c1917]'
          : 'border-stone-500 bg-[#292524] shadow-[3px_3px_0px_#000]'
      }`}>
        <div>
          <div className={`flex items-center space-x-2 text-xs font-mono uppercase ${
            isLight ? 'text-stone-600' : 'text-stone-400'
          }`}>
            <span>MOTORSPORT GAZETTE</span>
            <span>•</span>
            <span>ROUND {f1.activeRound} OF {f1.totalRounds}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight uppercase mt-0.5">{f1.raceName}</h1>
          <p className={`text-xs italic ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>{f1.circuitName} — {f1.location}</p>
        </div>

        <div className={`text-right border-l pl-4 ${isLight ? 'border-stone-400' : 'border-stone-600'}`}>
          <span className={`text-[10px] font-mono uppercase block ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>Upcoming Trial</span>
          <span className="text-sm font-bold" style={{ color: 'var(--color-accent)' }}>{f1.nextSession.name}</span>
          <span className={`text-xs font-mono block font-bold ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>{f1.nextSession.countdownFormatted}</span>
        </div>
      </div>

      {/* Grid: Timetable & Championship */}
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Sessions */}
        <div className={`col-span-5 flex flex-col border-r-2 pr-6 ${
          isLight ? 'border-stone-300' : 'border-stone-700'
        }`}>
          <h3 className={`text-xs uppercase font-bold tracking-widest border-b-2 pb-1 mb-3 ${
            isLight ? 'text-stone-900 border-stone-800' : 'text-stone-100 border-stone-500'
          }`}>
            Programme of the Weekend
          </h3>
          <div className="space-y-3">
            {Object.entries(f1.sessions).map(([key, s]) => {
              if (!s) return null;
              return (
                <div
                  key={key}
                  className={`p-2 border flex items-center justify-between ${
                    isLight
                      ? 'border-stone-400 bg-[#ede8df]'
                      : 'border-stone-600 bg-[#292524]'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold block">{s.name}</span>
                    <span className={`text-[11px] font-mono ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>{s.istTime}</span>
                  </div>
                  <span className={`text-[10px] uppercase font-mono px-1 border ${
                    isLight ? 'border-stone-600' : 'border-stone-500'
                  }`}>
                    {s.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Championship Table */}
        <div className="col-span-7 flex flex-col">
          <h3 className={`text-xs uppercase font-bold tracking-widest border-b-2 pb-1 mb-3 ${
            isLight ? 'text-stone-900 border-stone-800' : 'text-stone-100 border-stone-500'
          }`}>
            Championship Standings
          </h3>
          <div className="space-y-2 overflow-y-auto max-h-[50vh] pr-2">
            {f1.standings.map((driver) => (
              <div
                key={driver.number}
                className={`p-2 border flex items-center justify-between text-xs ${
                  isLight
                    ? 'border-stone-300 bg-[#ede8df]'
                    : 'border-stone-700 bg-[#292524]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={`w-5 font-mono font-bold ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                    #{driver.position}
                  </span>
                  <span
                    className="w-1.5 h-4"
                    style={{ backgroundColor: driver.teamColor || '#888' }}
                  />
                  <div>
                    <span className="font-bold uppercase">{driver.driver}</span>
                    <span className={`text-[11px] italic ml-2 ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>({driver.team})</span>
                  </div>
                </div>
                <span className="font-mono font-bold" style={{ color: 'var(--color-accent)' }}>
                  {driver.points} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
