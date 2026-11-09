import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Flag, Trophy, Calendar, Activity } from 'lucide-react';

export const CivicRaceWeekendMode: React.FC = () => {
  const { f1 } = useDashboard();

  return (
    <div className="w-full h-full p-8 flex flex-col justify-between overflow-hidden bg-[#f1f5f9] text-[#0f172a] select-none font-sans">
      {/* Top Banner: Race Weekend Masthead */}
      <div className="p-5 bg-white border border-slate-300 rounded-xl shadow-sm flex items-center justify-between mb-4 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#f97316] via-slate-300 to-[#16a34a]" />

        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-500">
            <span className="text-[#f97316] font-extrabold uppercase">FORMULA 1 WORLD CHAMPIONSHIP</span>
            <span>•</span>
            <span className="font-bold">ROUND {f1.activeRound} OF {f1.totalRounds}</span>
            <span>•</span>
            <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 font-bold">
              RACE WEEKEND
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 mt-1">{f1.raceName}</h1>
          <p className="text-xs font-mono text-slate-500 mt-0.5">{f1.circuitName} — {f1.location}</p>
        </div>

        <div className="text-right border-l border-slate-200 pl-6 font-mono">
          <span className="text-[10px] text-slate-500 uppercase block font-bold">Upcoming Session</span>
          <span className="text-sm font-bold text-slate-900">{f1.nextSession.name}</span>
          <span className="text-xs text-[#f97316] block font-black mt-0.5">{f1.nextSession.countdownFormatted}</span>
        </div>
      </div>

      {/* Grid: Timetable & Championship Table */}
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Sessions Schedule */}
        <div className="col-span-5 flex flex-col bg-white border border-slate-300 rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3 text-xs font-mono text-slate-500">
            <span className="font-bold text-slate-800 flex items-center space-x-1.5">
              <Calendar size={14} className="text-[#f97316]" />
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
                  className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{s.name}</span>
                    <span className="text-[11px] text-slate-500">{s.istTime}</span>
                  </div>
                  <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold border ${
                    s.status.toLowerCase() === 'completed'
                      ? 'bg-slate-100 text-slate-500 border-slate-300'
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
        <div className="col-span-7 flex flex-col bg-white border border-slate-300 rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3 text-xs font-mono text-slate-500">
            <span className="font-bold text-slate-800 flex items-center space-x-1.5">
              <Trophy size={14} className="text-[#f97316]" />
              <span>DRIVERS' STANDINGS</span>
            </span>
            <span className="text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
              TOP 10
            </span>
          </div>

          <div className="space-y-1.5 overflow-y-auto flex-1 font-mono text-xs pr-1">
            {f1.standings.map((driver) => (
              <div
                key={driver.number}
                className="p-2 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-400 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-6 font-bold text-slate-400">
                    #{driver.position}
                  </span>
                  <div>
                    <span className="font-bold text-slate-900">{driver.driver}</span>
                    <span className="text-[10px] text-slate-500 ml-2 font-medium">{driver.team}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="font-black text-slate-900">{driver.points} PTS</span>
                  <span className="text-[10px] text-slate-400 font-bold">#{driver.number}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
