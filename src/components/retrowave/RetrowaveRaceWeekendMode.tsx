import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Gauge } from 'lucide-react';

export const RetrowaveRaceWeekendMode: React.FC = () => {
  const { f1, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  return (
    <div className={`relative w-full h-full p-6 flex flex-col justify-between overflow-hidden bg-transparent select-none ${
      isLight ? 'text-pink-950' : 'text-pink-100'
    }`}>
      {/* 80s Perspective Floor Lines */}
      <div
        className="absolute inset-x-0 bottom-0 h-64 pointer-events-none opacity-20 z-0"
        style={{
          backgroundImage: 'linear-gradient(to right, var(--color-accent, #ff007f) 1px, transparent 1px), linear-gradient(to bottom, var(--color-accent, #ff007f) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          transform: 'perspective(300px) rotateX(60deg)',
          transformOrigin: 'bottom center',
        }}
      />

      {/* Top Banner */}
      <div className={`relative z-10 p-4 rounded-2xl border-2 flex items-center justify-between mb-4 ${
        isLight
          ? 'bg-pink-50/90 border-pink-400 shadow-[0_0_25px_rgba(236,72,153,0.18)] text-slate-900'
          : 'bg-[#1e0736]/90 border-pink-500 shadow-[0_0_30px_rgba(255,0,127,0.3)] text-pink-100'
      }`}
      style={{ borderColor: 'var(--color-accent)' }}
      >
        <div className="flex items-center space-x-3.5">
          <div
            className="p-2.5 rounded-xl bg-gradient-to-tr from-pink-600 to-amber-500 text-white shadow-md"
            style={{ boxShadow: isLight ? 'none' : '0 0 15px var(--color-accent)' }}
          >
            <Gauge size={22} className="animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-[10px] px-2 py-0.5 font-black uppercase rounded border ${
                isLight ? 'bg-pink-100 text-pink-900 border-pink-300' : 'bg-pink-950 text-amber-300 border-pink-500'
              }`}>
                STAGE {f1.activeRound}/{f1.totalRounds}
              </span>
              <h1 className={`text-xl font-black italic tracking-wide uppercase ${
                isLight ? 'text-slate-900' : 'text-white drop-shadow-[0_0_10px_rgba(255,0,127,0.6)]'
              }`}>
                {f1.raceName}
              </h1>
            </div>
            <p className={`text-xs font-bold mt-0.5 ${isLight ? 'text-slate-600' : 'text-pink-300'}`}>
              CIRCUIT: {f1.circuitName} • {f1.location}
            </p>
          </div>
        </div>

        <div className={`text-right px-4 py-2 rounded-xl border ${
          isLight ? 'bg-white/80 border-pink-300' : 'bg-pink-950/70 border-pink-500/50'
        }`}>
          <span className={`text-[10px] uppercase font-bold block ${isLight ? 'text-pink-800' : 'text-amber-300'}`}>TARGET CHECKPOINT</span>
          <span className="text-sm font-black" style={{ color: 'var(--color-accent)' }}>{f1.nextSession.name}</span>
          <span className="text-xs font-black font-mono text-rose-500 block">{f1.nextSession.countdownFormatted}</span>
        </div>
      </div>

      {/* Grid: Sessions & Leaderboard */}
      <div className="relative z-10 grid grid-cols-12 gap-5 flex-1 min-h-0">
        {/* Sessions */}
        <div className="col-span-5 flex flex-col">
          <div
            className={`p-4 rounded-2xl border-2 h-full flex flex-col ${
              isLight
                ? 'bg-pink-50/90 border-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.15)]'
                : 'bg-[#1e0736]/90 border-pink-500 shadow-[0_0_25px_rgba(255,0,127,0.25)]'
            }`}
            style={{ borderColor: 'var(--color-accent)' }}
          >
            <span className={`text-[10px] font-black uppercase tracking-wider border-b pb-2 mb-3 ${
              isLight ? 'text-pink-800 border-pink-200' : 'text-amber-300 border-pink-500/30'
            }`}>
              HIGHWAY CHECKPOINTS (IST)
            </span>
            <div className="space-y-3">
              {Object.entries(f1.sessions).map(([key, s]) => {
                if (!s) return null;
                const isNext = f1.nextSession.name.toLowerCase().includes(s.name.toLowerCase());
                return (
                  <div
                    key={key}
                    className={`p-2.5 rounded-xl border flex items-center justify-between ${
                      isNext
                        ? isLight
                          ? 'bg-pink-200/80 border-pink-500 font-bold text-slate-900 shadow-sm'
                          : 'bg-gradient-to-r from-pink-600/40 to-purple-600/40 border-pink-400 font-bold text-white shadow-[0_0_15px_rgba(255,0,127,0.3)]'
                        : isLight
                          ? 'bg-white/80 border-pink-200 text-slate-800'
                          : 'bg-[#120320] border-pink-500/25 text-pink-200'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-black uppercase block">{s.name}</span>
                      <span className={`text-[11px] font-mono ${isLight ? 'text-slate-600' : 'text-pink-300/80'}`}>{s.istTime}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                      isNext
                        ? 'bg-pink-500 text-white border-pink-400'
                        : isLight
                          ? 'bg-pink-100 text-pink-900 border-pink-300'
                          : 'bg-black/40 text-pink-300 border-pink-500/40'
                    }`}>
                      {s.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Driver Leaderboard */}
        <div className="col-span-7 flex flex-col">
          <div
            className={`p-4 rounded-2xl border-2 h-full flex flex-col ${
              isLight
                ? 'bg-pink-50/90 border-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.15)]'
                : 'bg-[#1e0736]/90 border-pink-500 shadow-[0_0_25px_rgba(255,0,127,0.25)]'
            }`}
            style={{ borderColor: 'var(--color-accent)' }}
          >
            <span className={`text-[10px] font-black uppercase tracking-wider border-b pb-2 mb-3 ${
              isLight ? 'text-pink-800 border-pink-200' : 'text-amber-300 border-pink-500/30'
            }`}>
              SPEEDWAY STANDINGS // TOP PILOTS
            </span>
            <div className="space-y-2 overflow-y-auto max-h-[50vh] pr-1">
              {f1.standings.map((driver) => (
                <div
                  key={driver.number}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                    isLight ? 'bg-white/80 border-pink-200 text-slate-900' : 'bg-[#120320] border-pink-500/25 text-pink-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`w-5 font-black ${isLight ? 'text-pink-800' : 'text-amber-300'}`}>
                      P{driver.position}
                    </span>
                    <span
                      className="w-1.5 h-4 rounded-full"
                      style={{ backgroundColor: driver.teamColor || '#ff007f' }}
                    />
                    <span className="font-black uppercase">{driver.driver}</span>
                    <span className={`text-[10px] uppercase ${isLight ? 'text-slate-600' : 'text-pink-300/70'}`}>({driver.team})</span>
                  </div>
                  <span className="font-mono font-black" style={{ color: 'var(--color-accent)' }}>
                    {driver.points} PTS
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
