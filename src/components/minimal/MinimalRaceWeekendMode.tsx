import React from 'react';
import { useDashboard } from '../../state/DashboardContext';

export const MinimalRaceWeekendMode: React.FC = () => {
  const { f1, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  return (
    <div className={`w-full h-full p-12 flex flex-col justify-between overflow-hidden bg-transparent select-none font-sans ${isLight ? 'text-neutral-900' : 'text-neutral-100'}`}>
      {/* Top Heading */}
      <div className={`flex items-baseline justify-between pb-6 border-b ${isLight ? 'border-neutral-200' : 'border-white/10'}`}>
        <div>
          <span className={`text-[11px] font-mono tracking-widest uppercase block mb-1 ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>
            Round {f1.activeRound} of {f1.totalRounds} • {f1.country}
          </span>
          <h1 className={`text-3xl font-light tracking-tight ${isLight ? 'text-neutral-900' : 'text-white'}`}>{f1.raceName}</h1>
          <p className={`text-xs font-light mt-0.5 ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>{f1.circuitName}</p>
        </div>

        <div className="text-right">
          <span className={`text-[11px] font-mono uppercase block ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>Next Up</span>
          <span className={`text-base font-light ${isLight ? 'text-neutral-900' : 'text-white'}`}>{f1.nextSession.name}</span>
          <span className={`text-xs font-mono block mt-0.5 ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>{f1.nextSession.countdownFormatted}</span>
        </div>
      </div>

      {/* Grid: Timetable & Standings */}
      <div className="grid grid-cols-12 gap-10 flex-1 min-h-0 pt-6">
        {/* Sessions */}
        <div className={`col-span-5 flex flex-col border-r pr-10 ${isLight ? 'border-neutral-200' : 'border-white/10'}`}>
          <h3 className={`text-xs uppercase tracking-widest font-medium mb-4 ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>
            Weekend Sessions (IST)
          </h3>
          <div className="space-y-4">
            {Object.entries(f1.sessions).map(([key, s]) => {
              if (!s) return null;
              return (
                <div key={key} className={`flex items-center justify-between py-1 border-b ${isLight ? 'border-neutral-200/60' : 'border-white/5'}`}>
                  <div>
                    <span className={`text-xs font-light block ${isLight ? 'text-neutral-800' : 'text-neutral-200'}`}>{s.name}</span>
                    <span className={`text-[11px] font-mono ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>{s.istTime}</span>
                  </div>
                  <span className={`text-[10px] font-mono uppercase ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>
                    {s.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Drivers Table */}
        <div className="col-span-7 flex flex-col">
          <h3 className={`text-xs uppercase tracking-widest font-medium mb-4 ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>
            Driver Standings
          </h3>
          <div className="space-y-2 overflow-y-auto max-h-[50vh] pr-2">
            {f1.standings.map((driver) => (
              <div
                key={driver.number}
                className={`flex items-center justify-between py-1.5 border-b text-xs font-light ${
                  isLight ? 'border-neutral-200/60' : 'border-white/5'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={`w-5 font-mono text-[11px] ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    {driver.position}
                  </span>
                  <span
                    className="w-1 h-3.5 rounded-full"
                    style={{ backgroundColor: driver.teamColor || '#888' }}
                  />
                  <span className={`font-light ${isLight ? 'text-neutral-800' : 'text-neutral-200'}`}>{driver.driver}</span>
                  <span className={`text-[11px] ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>{driver.team}</span>
                </div>
                <span className="font-mono text-xs font-medium" style={{ color: 'var(--color-accent)' }}>{driver.points} pts</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
