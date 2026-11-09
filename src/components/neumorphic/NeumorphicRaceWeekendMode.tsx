import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Gauge } from 'lucide-react';

export const NeumorphicRaceWeekendMode: React.FC = () => {
  const { f1, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  const cardClass = isLight
    ? 'bg-[#e2e8f0] shadow-[6px_6px_14px_#cbd5e1,-6px_-6px_14px_#ffffff] text-slate-900'
    : 'bg-[#1a1d24] shadow-[6px_6px_14px_#101217,-6px_-6px_14px_#242831] text-neutral-200';

  const insetClass = isLight
    ? 'bg-[#e2e8f0] shadow-[inset_2px_2px_5px_#cbd5e1,inset_-2px_-2px_5px_#ffffff]'
    : 'bg-[#1a1d24] shadow-[inset_2px_2px_5px_#101217,inset_-2px_-2px_5px_#242831]';

  return (
    <div className={`w-full h-full p-8 flex flex-col justify-between overflow-hidden bg-transparent select-none ${
      isLight ? 'text-slate-900' : 'text-neutral-200'
    }`}>
      {/* Top Banner */}
      <div className={`p-4 rounded-3xl ${cardClass} flex items-center justify-between mb-4`}>
        <div className="flex items-center space-x-3.5">
          <div className={`p-2.5 rounded-2xl ${insetClass} text-red-500`}>
            <Gauge size={22} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-[10px] px-2 py-0.5 rounded-lg ${insetClass} text-red-500 font-bold uppercase`}>
                Round {f1.activeRound}/{f1.totalRounds}
              </span>
              <h1 className={`text-xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>{f1.raceName}</h1>
            </div>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
              {f1.circuitName} • {f1.location}
            </p>
          </div>
        </div>

        <div className={`text-right px-4 py-2 rounded-2xl ${insetClass}`}>
          <span className={`text-[10px] uppercase block ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>Next Session</span>
          <span className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{f1.nextSession.name}</span>
          <span className="text-xs font-mono font-bold text-red-500 block">{f1.nextSession.countdownFormatted}</span>
        </div>
      </div>

      {/* Grid: Sessions & Standings */}
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Sessions */}
        <div className="col-span-5 flex flex-col">
          <div className={`p-5 rounded-3xl ${cardClass} h-full flex flex-col`}>
            <span className={`text-[10px] font-bold uppercase tracking-wider border-b pb-2 mb-3 ${
              isLight ? 'text-slate-500 border-slate-300' : 'text-neutral-400 border-neutral-700/50'
            }`}>
              Weekend Sessions (IST)
            </span>
            <div className="space-y-3">
              {Object.entries(f1.sessions).map(([key, s]) => {
                if (!s) return null;
                const isNext = f1.nextSession.name.toLowerCase().includes(s.name.toLowerCase());
                return (
                  <div
                    key={key}
                    className={`p-3 rounded-2xl flex items-center justify-between ${
                      isNext
                        ? isLight
                          ? 'bg-[#cbd5e1] shadow-[inset_2px_2px_5px_#94a3b8,inset_-2px_-2px_5px_#f1f5f9] font-bold text-slate-900'
                          : 'bg-[#222731] shadow-[inset_2px_2px_5px_#0e1014,inset_-2px_-2px_5px_#2c323f] font-bold text-white'
                        : insetClass
                    }`}
                  >
                    <div>
                      <span className="text-xs font-medium block">{s.name}</span>
                      <span className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>{s.istTime}</span>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-lg uppercase ${
                        isNext ? 'text-white' : (isLight ? 'text-slate-500' : 'text-neutral-400')
                      }`}
                      style={isNext ? { backgroundColor: 'var(--color-accent)' } : undefined}
                    >
                      {s.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Drivers Standings */}
        <div className="col-span-7 flex flex-col">
          <div className={`p-5 rounded-3xl ${cardClass} h-full flex flex-col`}>
            <span className={`text-[10px] font-bold uppercase tracking-wider border-b pb-2 mb-3 ${
              isLight ? 'text-slate-500 border-slate-300' : 'text-neutral-400 border-neutral-700/50'
            }`}>
              Driver Standings
            </span>
            <div className="space-y-2 overflow-y-auto max-h-[50vh] pr-1">
              {f1.standings.map((driver) => (
                <div
                  key={driver.number}
                  className={`p-2.5 rounded-2xl ${insetClass} flex items-center justify-between text-xs`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`w-5 font-mono text-[11px] ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>
                      #{driver.position}
                    </span>
                    <span
                      className="w-1.5 h-3.5 rounded-full"
                      style={{ backgroundColor: driver.teamColor || '#888' }}
                    />
                    <span className={`font-medium ${isLight ? 'text-slate-900' : 'text-neutral-200'}`}>{driver.driver}</span>
                    <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>({driver.team})</span>
                  </div>
                  <span className="font-mono font-medium" style={{ color: 'var(--color-accent)' }}>
                    {driver.points} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
