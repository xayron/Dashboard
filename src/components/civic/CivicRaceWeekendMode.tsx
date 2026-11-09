import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Flag, Trophy, FileCheck, Calendar, Activity } from 'lucide-react';

export const CivicRaceWeekendMode: React.FC = () => {
  const { f1 } = useDashboard();

  return (
    <div className="w-full h-full p-8 flex flex-col justify-between overflow-hidden bg-[#070b14] text-[#f8fafc] select-none font-sans">
      {/* Top Banner: Civic Motorsport Masthead */}
      <div className="p-4 bg-[#0f172a] border border-slate-700/60 flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <span className="text-amber-400 font-bold">FIA GRAND PRIX SCRUTINY</span>
            <span>•</span>
            <span>ROUND {f1.activeRound} OF {f1.totalRounds}</span>
            <span>•</span>
            <span className="text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 border border-emerald-500/30 font-bold">
              OFFICIAL RECORD
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white mt-1">{f1.raceName}</h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">{f1.circuitName} — {f1.location}</p>
        </div>

        <div className="text-right border-l border-slate-700/60 pl-6 font-mono">
          <span className="text-[10px] text-slate-400 uppercase block">Upcoming Session</span>
          <span className="text-sm font-bold text-white">{f1.nextSession.name}</span>
          <span className="text-xs text-amber-400 block font-black mt-0.5">{f1.nextSession.countdownFormatted}</span>
        </div>
      </div>

      {/* Grid: Timetable & Championship Table */}
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Sessions Schedule */}
        <div className="col-span-5 flex flex-col bg-[#0f172a] border border-slate-700/60 p-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3 text-xs font-mono text-slate-400">
            <span className="font-bold text-slate-200 flex items-center space-x-1.5">
              <Calendar size={13} className="text-amber-400" />
              <span>OFFICIAL PROGRAMME</span>
            </span>
            <span>INDIAN STANDARD TIME</span>
          </div>

          <div className="space-y-2.5 overflow-y-auto font-mono flex-1">
            {Object.entries(f1.sessions).map(([key, s]) => {
              if (!s) return null;
              return (
                <div
                  key={key}
                  className="p-3 bg-[#1e293b]/70 border border-slate-700/50 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-white block">{s.name}</span>
                    <span className="text-[11px] text-slate-400">{s.istTime}</span>
                  </div>
                  <span className={`text-[10px] uppercase font-mono px-2 py-0.5 border ${
                    s.status.toLowerCase() === 'completed'
                      ? 'bg-slate-800/80 text-slate-500 border-slate-700'
                      : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40 font-bold'
                  }`}>
                    {s.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Drivers Standings */}
        <div className="col-span-7 flex flex-col bg-[#0f172a] border border-slate-700/60 p-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3 text-xs font-mono text-slate-400">
            <span className="font-bold text-slate-200 flex items-center space-x-1.5">
              <Trophy size={13} className="text-amber-400" />
              <span>CHAMPIONSHIP SCORECARD</span>
            </span>
            <span className="text-emerald-400 font-bold">POINTS AUDITED</span>
          </div>

          <div className="space-y-1.5 overflow-y-auto flex-1 font-mono text-xs pr-1">
            {f1.standings.map((driver) => (
              <div
                key={driver.number}
                className="p-2 bg-[#1e293b]/70 border border-slate-700/40 hover:border-slate-500 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-6 font-bold text-slate-400">
                    #{driver.position}
                  </span>
                  <div>
                    <span className="font-bold text-white">{driver.driver}</span>
                    <span className="text-[10px] text-slate-400 ml-2">{driver.team}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="font-black text-white">{driver.points} PTS</span>
                  <span className="text-[10px] text-slate-500">#{driver.number}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
