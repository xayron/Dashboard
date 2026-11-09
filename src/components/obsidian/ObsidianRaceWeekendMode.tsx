import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Flag, Trophy, Compass, ShieldCheck, Activity } from 'lucide-react';

export const ObsidianRaceWeekendMode: React.FC = () => {
  const { f1 } = useDashboard();

  return (
    <div className="w-full h-full p-8 flex flex-col justify-between overflow-hidden bg-[#08080a] text-[#eef0f3] select-none font-sans">
      {/* Top Banner: Circuit Telemetry Masthead */}
      <div className="p-4 bg-[#15151b] border border-white/[0.12] flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#9a9da6]">
            <span className="text-[#5fd49b] font-bold">FIA TELEMETRY AIR-GAP</span>
            <span>•</span>
            <span>ROUND {f1.activeRound} OF {f1.totalRounds}</span>
            <span>•</span>
            <span className="text-[#5fd49b] bg-[#5fd49b]/10 px-1.5 py-0.5 border border-[#5fd49b]/30">VERIFIED TIMINGS</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#eef0f3] mt-1">{f1.raceName}</h1>
          <p className="text-xs font-mono text-[#9a9da6] mt-0.5">{f1.circuitName} — {f1.location}</p>
        </div>

        <div className="text-right border-l border-white/[0.12] pl-6 font-mono">
          <span className="text-[10px] text-[#54565e] uppercase block">Target Session</span>
          <span className="text-sm font-bold text-[#eef0f3]">{f1.nextSession.name}</span>
          <span className="text-xs text-[#5fd49b] block font-bold mt-0.5">{f1.nextSession.countdownFormatted}</span>
        </div>
      </div>

      {/* Grid: Timetable & Championship Standings */}
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Sessions Schedule */}
        <div className="col-span-5 flex flex-col bg-[#15151b] border border-white/[0.12] p-5">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 mb-3 text-xs font-mono text-[#9a9da6]">
            <span className="font-bold text-[#eef0f3] flex items-center space-x-1.5">
              <Activity size={13} className="text-[#5fd49b]" />
              <span>OFFICIAL TIMETABLE</span>
            </span>
            <span>IST (UTC+5:30)</span>
          </div>

          <div className="space-y-2.5 overflow-y-auto font-mono flex-1">
            {Object.entries(f1.sessions).map(([key, s]) => {
              if (!s) return null;
              return (
                <div
                  key={key}
                  className="p-3 bg-[#0e0e12] border border-white/[0.08] flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-[#eef0f3] block">{s.name}</span>
                    <span className="text-[11px] text-[#9a9da6]">{s.istTime}</span>
                  </div>
                  <span className={`text-[10px] uppercase font-mono px-2 py-0.5 border ${
                    s.status.toLowerCase() === 'completed'
                      ? 'bg-white/[0.04] text-[#54565e] border-white/[0.08]'
                      : 'bg-[#5fd49b]/10 text-[#5fd49b] border-[#5fd49b]/30'
                  }`}>
                    {s.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Drivers Standings */}
        <div className="col-span-7 flex flex-col bg-[#15151b] border border-white/[0.12] p-5">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 mb-3 text-xs font-mono text-[#9a9da6]">
            <span className="font-bold text-[#eef0f3] flex items-center space-x-1.5">
              <Trophy size={13} className="text-[#e3b341]" />
              <span>DRIVERS' WORLD CHAMPIONSHIP</span>
            </span>
            <span className="text-[#5fd49b]">TOP 10 VERIFIED</span>
          </div>

          <div className="space-y-1.5 overflow-y-auto flex-1 font-mono text-xs pr-1">
            {f1.standings.map((driver) => (
              <div
                key={driver.number}
                className="p-2 bg-[#0e0e12] border border-white/[0.06] hover:border-white/[0.18] transition-colors flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-6 font-bold text-[#9a9da6]">
                    #{driver.position}
                  </span>
                  <div>
                    <span className="font-bold text-[#eef0f3]">{driver.driver}</span>
                    <span className="text-[10px] text-[#54565e] ml-2">{driver.team}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="font-bold text-[#eef0f3]">{driver.points} PTS</span>
                  <span className="text-[10px] text-[#54565e]">#{driver.number}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
