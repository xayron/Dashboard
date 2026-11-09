import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Calendar } from 'lucide-react';

export const ObsidianRaceWeekendMode: React.FC = () => {
  const { f1, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  const cardClass = isLight
    ? 'bg-white/95 border border-slate-200 text-slate-900 shadow-sm'
    : 'bg-[#0f0f15] border border-white/[0.14] text-[#eef0f3] shadow-lg';

  const innerClass = isLight
    ? 'bg-slate-50 border border-slate-200 text-slate-900'
    : 'bg-[#08080c] border border-white/[0.08] text-[#eef0f3]';

  const mutedClass = isLight ? 'text-slate-500' : 'text-[#9a9da6]';
  const borderDivider = isLight ? 'border-slate-200' : 'border-white/[0.08]';

  return (
    <div className={`w-full h-full p-8 flex flex-col justify-between overflow-hidden bg-transparent select-none font-sans relative ${
      isLight ? 'text-slate-900' : 'text-[#eef0f3]'
    }`}>
      {/* Top Banner: Race Weekend Masthead */}
      <div className={`p-4 ${cardClass} flex items-center justify-between mb-4`}>
        <div>
          <div className={`flex items-center space-x-2 text-xs font-mono ${mutedClass}`}>
            <span style={{ color: 'var(--color-accent, #5fd49b)' }} className="font-bold">FORMULA 1 WORLD CHAMPIONSHIP</span>
            <span>•</span>
            <span>ROUND {f1.activeRound} OF {f1.totalRounds}</span>
            <span>•</span>
            <span
              className="px-1.5 py-0.5 border"
              style={{
                backgroundColor: 'var(--theme-accent-soft)',
                borderColor: 'var(--color-accent, #5fd49b)',
                color: 'var(--color-accent, #5fd49b)',
              }}
            >
              LIVE TELEMETRY
            </span>
          </div>
          <h1 className={`text-2xl font-bold tracking-tight mt-1 ${isLight ? 'text-slate-900' : 'text-[#eef0f3]'}`}>{f1.raceName}</h1>
          <p className={`text-xs font-mono mt-0.5 ${mutedClass}`}>{f1.circuitName} — {f1.location}</p>
        </div>

        <div className={`text-right border-l pl-6 font-mono ${isLight ? 'border-slate-200' : 'border-white/[0.12]'}`}>
          <span className={`text-[10px] uppercase block ${mutedClass}`}>Next Session</span>
          <span className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-[#eef0f3]'}`}>{f1.nextSession.name}</span>
          <span className="text-xs block font-bold mt-0.5" style={{ color: 'var(--color-accent, #5fd49b)' }}>{f1.nextSession.countdownFormatted}</span>
        </div>
      </div>

      {/* Grid: Timetable & Championship Standings */}
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Sessions Schedule */}
        <div className={`col-span-5 flex flex-col ${cardClass} p-5`}>
          <div className={`flex items-center justify-between border-b pb-2 mb-3 text-xs font-mono ${borderDivider} ${mutedClass}`}>
            <span className={`font-bold flex items-center space-x-1.5 ${isLight ? 'text-slate-900' : 'text-[#eef0f3]'}`}>
              <Calendar size={13} style={{ color: 'var(--color-accent, #5fd49b)' }} />
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
                    <span className={`text-xs font-bold block ${isLight ? 'text-slate-900' : 'text-[#eef0f3]'}`}>{s.name}</span>
                    <span className={`text-[11px] ${mutedClass}`}>{s.istTime}</span>
                  </div>
                  <span
                    className={`text-[10px] uppercase font-mono px-2 py-0.5 border ${
                      s.status.toLowerCase() === 'completed'
                        ? isLight ? 'bg-slate-200 text-slate-500 border-slate-300' : 'bg-white/[0.04] text-[#54565e] border-white/[0.08]'
                        : ''
                    }`}
                    style={s.status.toLowerCase() !== 'completed' ? {
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
        </div>

        {/* Drivers Standings */}
        <div className={`col-span-7 flex flex-col ${cardClass} p-5`}>
          <div className={`flex items-center justify-between border-b pb-2 mb-3 text-xs font-mono ${borderDivider} ${mutedClass}`}>
            <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-[#eef0f3]'}`}>WORLD DRIVERS CHAMPIONSHIP</span>
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
                    className="w-1.5 h-4"
                    style={{ backgroundColor: driver.teamColor || '#888' }}
                  />
                  <div>
                    <span className={`font-bold uppercase ${isLight ? 'text-slate-900' : 'text-[#eef0f3]'}`}>{driver.driver}</span>
                    <span className={`text-[10px] ml-2 ${mutedClass}`}>({driver.team})</span>
                  </div>
                </div>
                <span className="font-bold" style={{ color: 'var(--color-accent, #5fd49b)' }}>
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
