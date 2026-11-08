import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { BrutalistBox } from './BrutalistBox';
import { Flame, Flag, Trophy, Timer, MapPin } from 'lucide-react';

export const BrutalistRaceWeekendMode: React.FC = () => {
  const { f1 } = useDashboard();

  return (
    <div className="w-full h-full p-6 flex flex-col justify-between overflow-hidden bg-[#111111] text-white select-none">
      {/* Top Banner */}
      <div className="p-4 bg-red-600 text-white border-4 border-black shadow-[5px_5px_0px_#fff] flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-black text-yellow-400">
            <Flame size={24} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black uppercase tracking-widest bg-black px-2 py-0.5">
                ROUND {f1.activeRound}/{f1.totalRounds}
              </span>
              <h1 className="text-xl font-black uppercase tracking-tight">{f1.raceName}</h1>
            </div>
            <p className="text-xs font-bold text-red-100 flex items-center mt-0.5 uppercase">
              <MapPin size={12} className="mr-1" /> {f1.circuitName} • {f1.location}
            </p>
          </div>
        </div>

        <div className="bg-black text-yellow-400 px-4 py-2 border-2 border-white shadow-[3px_3px_0px_#000] text-right">
          <span className="text-[10px] font-black uppercase tracking-wider block text-white">NEXT SESSION</span>
          <span className="text-sm font-black text-yellow-300">{f1.nextSession.name}</span>
          <span className="text-xs font-mono font-bold block text-red-400">{f1.nextSession.countdownFormatted}</span>
        </div>
      </div>

      {/* Grid: Sessions & Leaderboard */}
      <div className="grid grid-cols-12 gap-5 flex-1 min-h-0">
        {/* Sessions Timetable */}
        <div className="col-span-5 flex flex-col">
          <BrutalistBox
            title="WEEKEND SCHEDULE (IST)"
            badge="LIVE TIMINGS"
            badgeColor="bg-yellow-400 text-black"
            className="h-full"
          >
            <div className="space-y-3 pt-1">
              {Object.entries(f1.sessions).map(([key, s]) => {
                if (!s) return null;
                const isNext = f1.nextSession.name.toLowerCase().includes(s.name.toLowerCase());
                return (
                  <div
                    key={key}
                    className={`p-3 border-2 flex items-center justify-between ${
                      isNext
                        ? 'bg-yellow-400 text-black border-black shadow-[4px_4px_0px_#fff] font-black'
                        : 'bg-neutral-900 text-white border-white/40 shadow-[2px_2px_0px_#fff]'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider block">{s.name}</span>
                      <span className="text-[11px] font-mono">{s.istTime}</span>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-black uppercase border border-current">
                      {s.status.toUpperCase()}
                    </span>
                  </div>
                );
              })}
            </div>
          </BrutalistBox>
        </div>

        {/* Driver Leaderboard */}
        <div className="col-span-7 flex flex-col">
          <BrutalistBox
            title="WORLD CHAMPIONSHIP STANDINGS"
            badge="TOP DRIVERS"
            badgeColor="bg-cyan-400 text-black"
            shadowColor="shadow-[5px_5px_0px_#00f0ff]"
            className="h-full"
          >
            <div className="space-y-2 overflow-y-auto max-h-[50vh] pr-1">
              {f1.standings.map((driver) => (
                <div
                  key={driver.number}
                  className="p-2.5 bg-neutral-900 border-2 border-white/60 shadow-[3px_3px_0px_#fff] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 bg-white text-black font-black flex items-center justify-center text-xs">
                      P{driver.position}
                    </span>
                    <span
                      className="w-1.5 h-6 shrink-0"
                      style={{ backgroundColor: driver.teamColor || '#ff0000' }}
                    />
                    <div>
                      <span className="font-black text-sm text-white uppercase">{driver.driver}</span>
                      <span className="text-[10px] text-neutral-400 uppercase ml-2">({driver.team})</span>
                    </div>
                  </div>
                  <div className="font-mono font-black text-sm text-yellow-400">
                    {driver.points} PTS
                  </div>
                </div>
              ))}
            </div>
          </BrutalistBox>
        </div>
      </div>
    </div>
  );
};
