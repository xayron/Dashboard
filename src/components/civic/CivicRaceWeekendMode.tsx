import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Calendar } from 'lucide-react';

export const CivicRaceWeekendMode: React.FC = () => {
  const { f1, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  const cardClass = isLight
    ? 'bg-white border border-slate-300 rounded-xl shadow-sm text-slate-900'
    : 'bg-slate-900/90 border border-slate-700 rounded-xl shadow-md text-slate-100';

  const innerClass = isLight
    ? 'bg-slate-50 border border-slate-200 rounded-lg text-slate-900'
    : 'bg-slate-800/80 border border-slate-700/80 rounded-lg text-slate-100';

  const mutedClass = isLight ? 'text-slate-500' : 'text-slate-400';
  const borderDivider = isLight ? 'border-slate-100' : 'border-slate-800';

  return (
    <div className={`w-full h-full p-8 flex flex-col justify-between overflow-hidden bg-transparent select-none font-sans ${
      isLight ? 'text-slate-900' : 'text-slate-100'
    }`}>
      {/* Top Banner: Race Weekend Masthead */}
      <div className={`p-5 ${cardClass} flex items-center justify-between mb-4 relative overflow-hidden`}>
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#f97316] via-slate-300 to-[#16a34a]" />

        <div>
          <div className={`flex items-center space-x-2 text-xs font-mono ${mutedClass}`}>
            <span style={{ color: 'var(--color-accent, #f97316)' }} className="font-extrabold uppercase">FORMULA 1 WORLD CHAMPIONSHIP</span>
            <span>•</span>
            <span className="font-bold">ROUND {f1.activeRound} OF {f1.totalRounds}</span>
            <span>•</span>
            <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 font-bold">
              RACE WEEKEND
            </span>
          </div>
          <h1 className={`text-2xl font-black tracking-tight mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>{f1.raceName}</h1>
          <p className={`text-xs font-mono mt-0.5 ${mutedClass}`}>{f1.circuitName} — {f1.location}</p>
        </div>

        <div className={`text-right border-l pl-6 font-mono ${isLight ? 'border-slate-200' : 'border-slate-700'}`}>
          <span className={`text-[10px] uppercase block font-bold ${mutedClass}`}>Upcoming Session</span>
          <span className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{f1.nextSession.name}</span>
          <span className="text-xs block font-black mt-0.5" style={{ color: 'var(--color-accent, #f97316)' }}>{f1.nextSession.countdownFormatted}</span>
        </div>
      </div>

      {/* Grid: Timetable & Championship Table */}
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Sessions Schedule */}
        <div className={`col-span-5 flex flex-col ${cardClass} p-5`}>
          <div className={`flex items-center justify-between border-b pb-2 mb-3 text-xs font-mono ${borderDivider} ${mutedClass}`}>
            <span className={`font-bold flex items-center space-x-1.5 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
              <Calendar size={14} style={{ color: 'var(--color-accent, #f97316)' }} />
              <span>WEEKEND TIMETABLE</span>
            </span>
            <span>IST (UTC+5:30)</span>
          </div>

          <div className="space-y-2.5 overflow-y-auto font-mono flex-1">
            {Object.entries(f1.sessions).map(([key, s]) => {
              if (!s) return null;
              return (
                <div
                  key={key}
                  className={`p-3 ${innerClass} flex items-center justify-between`}
                >
                  <div>
                    <span className={`text-xs font-bold block ${isLight ? 'text-slate-900' : 'text-white'}`}>{s.name}</span>
                    <span className={`text-[11px] ${mutedClass}`}>{s.istTime}</span>
                  </div>
                  <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold border ${
                    s.status.toLowerCase() === 'completed'
                      ? isLight ? 'bg-slate-100 text-slate-500 border-slate-300' : 'bg-slate-800 text-slate-400 border-slate-700'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  }`}>
                    {s.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Drivers Standings */}
        <div className={`col-span-7 flex flex-col ${cardClass} p-5`}>
          <div className={`flex items-center justify-between border-b pb-2 mb-3 text-xs font-mono ${borderDivider} ${mutedClass}`}>
            <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>WORLD DRIVERS CHAMPIONSHIP</span>
            <span>OFFICIAL STANDINGS</span>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[50vh] font-mono flex-1">
            {f1.standings.map((driver) => (
              <div
                key={driver.number}
                className={`p-2.5 ${innerClass} flex items-center justify-between text-xs`}
              >
                <div className="flex items-center space-x-3">
                  <span className={`w-5 font-bold ${mutedClass}`}>
                    #{driver.position}
                  </span>
                  <span
                    className="w-1.5 h-4 rounded-sm"
                    style={{ backgroundColor: driver.teamColor || '#888' }}
                  />
                  <div>
                    <span className={`font-bold uppercase ${isLight ? 'text-slate-900' : 'text-white'}`}>{driver.driver}</span>
                    <span className={`text-[11px] ml-2 ${mutedClass}`}>({driver.team})</span>
                  </div>
                </div>
                <span className="font-bold" style={{ color: 'var(--color-accent, #f97316)' }}>
                  {driver.points} PTS
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
