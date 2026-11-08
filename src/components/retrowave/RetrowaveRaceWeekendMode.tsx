import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Flame, Flag, Trophy, Gauge, Sparkles } from 'lucide-react';

export const RetrowaveRaceWeekendMode: React.FC = () => {
  const { f1 } = useDashboard();

  return (
    <div className="relative w-full h-full p-6 flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#150424] via-[#23073b] to-[#36094d] text-pink-100 select-none">
      {/* 80s Perspective Floor Lines */}
      <div
        className="absolute inset-x-0 bottom-0 h-64 pointer-events-none opacity-20 z-0"
        style={{
          backgroundImage: 'linear-gradient(to right, #ff007f 1px, transparent 1px), linear-gradient(to bottom, #ff007f 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          transform: 'perspective(300px) rotateX(60deg)',
          transformOrigin: 'bottom center',
        }}
      />

      {/* Top Banner */}
      <div className="relative z-10 p-4 rounded-2xl bg-[#1e0736]/90 border-2 border-pink-500 shadow-[0_0_30px_rgba(255,0,127,0.3)] flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-pink-600 to-amber-500 text-white shadow-[0_0_15px_#ff007f]">
            <Gauge size={22} className="animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] bg-pink-950 text-amber-300 border border-pink-500 px-2 py-0.5 font-black uppercase rounded">
                STAGE {f1.activeRound}/{f1.totalRounds}
              </span>
              <h1 className="text-xl font-black italic text-white tracking-wide uppercase drop-shadow-[0_0_10px_rgba(255,0,127,0.6)]">
                {f1.raceName}
              </h1>
            </div>
            <p className="text-xs font-bold text-pink-300 mt-0.5">
              CIRCUIT: {f1.circuitName} • {f1.location}
            </p>
          </div>
        </div>

        <div className="text-right px-4 py-2 rounded-xl bg-pink-950/70 border border-pink-500/50">
          <span className="text-[10px] text-amber-300 uppercase font-bold block">TARGET CHECKPOINT</span>
          <span className="text-sm font-black text-white">{f1.nextSession.name}</span>
          <span className="text-xs font-black font-mono text-pink-400 block">{f1.nextSession.countdownFormatted}</span>
        </div>
      </div>

      {/* Grid: Sessions & Leaderboard */}
      <div className="relative z-10 grid grid-cols-12 gap-5 flex-1 min-h-0">
        {/* Sessions */}
        <div className="col-span-5 flex flex-col">
          <div className="p-4 rounded-2xl border-2 border-pink-500/60 bg-[#1e0736]/90 shadow-[0_0_20px_rgba(255,0,127,0.2)] h-full flex flex-col">
            <span className="text-[10px] text-amber-300 font-black uppercase tracking-wider border-b border-pink-500/40 pb-2 mb-3">
              RACE WEEKEND CHECKPOINTS // IST
            </span>
            <div className="space-y-3">
              {Object.entries(f1.sessions).map(([key, s]) => {
                if (!s) return null;
                const isNext = f1.nextSession.name.toLowerCase().includes(s.name.toLowerCase());
                return (
                  <div
                    key={key}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                      isNext
                        ? 'bg-gradient-to-r from-pink-950/80 to-purple-950/80 border-pink-400 text-amber-200 shadow-[0_0_20px_rgba(255,0,127,0.35)]'
                        : 'bg-[#150424]/60 border-pink-500/20 text-pink-200/60'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-black text-white block">{s.name}</span>
                      <span className="text-[11px] font-mono text-pink-300">{s.istTime}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded border border-current font-black uppercase">
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
          <div className="p-4 rounded-2xl border-2 border-pink-500/60 bg-[#1e0736]/90 shadow-[0_0_20px_rgba(255,0,127,0.2)] h-full flex flex-col">
            <span className="text-[10px] text-amber-300 font-black uppercase tracking-wider border-b border-pink-500/40 pb-2 mb-3">
              CHAMPIONSHIP RADAR
            </span>
            <div className="space-y-2 overflow-y-auto max-h-[50vh] pr-1">
              {f1.standings.map((driver) => (
                <div
                  key={driver.number}
                  className="p-2.5 rounded-xl bg-[#150424]/80 border border-pink-500/30 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 text-amber-300 font-black text-sm italic">
                      #{driver.position}
                    </span>
                    <span
                      className="w-1.5 h-4 rounded-full"
                      style={{ backgroundColor: driver.teamColor || '#ff007f' }}
                    />
                    <div>
                      <span className="font-black text-white">{driver.driver}</span>
                      <span className="text-[11px] text-pink-300/80 ml-2">({driver.team})</span>
                    </div>
                  </div>
                  <span className="font-mono font-black text-amber-300">{driver.points} PTS</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
