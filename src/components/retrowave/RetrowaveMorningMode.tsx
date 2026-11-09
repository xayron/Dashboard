import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Check, Flame, Flag, Sunrise, Trophy, Sparkles } from 'lucide-react';
import { AudioBanner } from '../common/AudioBanner';

export const RetrowaveMorningMode: React.FC = () => {
  const { now, weather, aqi, events, tasks, toggleTask, f1, finance, media } = useDashboard();

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const dateFormatted = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).toUpperCase();

  return (
    <div className="relative w-full h-full p-6 flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#150424] via-[#23073b] to-[#36094d] text-pink-100 select-none">
      {/* 80s Perspective Grid Floor at bottom */}
      <div
        className="absolute inset-x-0 bottom-0 h-64 pointer-events-none opacity-25 z-0"
        style={{
          backgroundImage: 'linear-gradient(to right, var(--color-accent, #ff007f) 1px, transparent 1px), linear-gradient(to bottom, var(--color-accent, #ff007f) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          transform: 'perspective(300px) rotateX(60deg)',
          transformOrigin: 'bottom center',
        }}
      />

      {/* Top Banner & Audio */}
      <div className="relative z-10 flex items-center justify-between mb-4 pb-3 border-b border-pink-500/50">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-pink-600 to-amber-500 text-white shadow-[0_0_15px_#ff007f]">
            <Sunrise size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-black italic tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-400 to-rose-400 drop-shadow-[0_0_12px_rgba(255,0,127,0.7)]">
              MIAMI SUNRISE // 1984
            </h1>
            <p className="text-xs font-bold text-amber-300 flex items-center mt-0.5 tracking-wide">
              <Sparkles size={12} className="mr-1 text-pink-400" />
              Dawn broke at {weather.sunrise} • Peak highway heat {weather.highTemp}°C
            </p>
          </div>
        </div>

        {media.state === 'playing' && <AudioBanner compact={true} className="bg-[#24083d]/90 border-pink-500 text-white" />}
      </div>

      {/* 3-Column Grid */}
      <div className="relative z-10 grid grid-cols-12 gap-5 flex-1 min-h-0">
        {/* Left Column: Neon Sunset Clock & Weather (Cols 1-4) */}
        <div className="col-span-4 flex flex-col space-y-4">
          <div className="p-5 rounded-2xl border-2 border-pink-500/80 bg-[#1d0633]/90 shadow-[0_0_25px_rgba(255,0,127,0.3)] flex flex-col items-center">
            <span className="text-[10px] text-amber-300 font-black italic uppercase tracking-widest mb-1">
              PACIFIC TIMEWAY // IST
            </span>
            <div className="text-6xl font-black italic tracking-wider flex items-baseline justify-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-200 to-pink-500 drop-shadow-[0_0_15px_rgba(255,0,127,0.6)]">
                {hours}:{minutes}
              </span>
              <span className="text-2xl text-amber-400 ml-2 animate-pulse font-mono">:{seconds}</span>
            </div>
            <div className="text-xs font-black italic text-pink-300 mt-2 border-t border-pink-500/40 pt-2 w-full text-center tracking-widest">
              {dateFormatted}
            </div>
          </div>

          <div className="p-4 rounded-2xl border-2 border-pink-500/60 bg-[#1d0633]/90 shadow-[0_0_20px_rgba(255,0,127,0.2)] flex-1 flex flex-col justify-between text-xs">
            <div className="flex items-center justify-between border-b border-pink-500/40 pb-2">
              <span className="text-[10px] text-amber-300 font-black uppercase tracking-wider">Atmosphere // Miami</span>
              <span className="text-pink-400 font-black text-sm">{weather.temperature}°C</span>
            </div>
            <div className="space-y-2 pt-2 font-bold text-xs">
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span className="text-pink-300/70 uppercase">Condition:</span>
                <span className="text-white uppercase">{weather.condition}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span className="text-pink-300/70 uppercase">Heat Index:</span>
                <span className="text-amber-300">{weather.apparentTemperature}°C</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span className="text-pink-300/70 uppercase">Air Purity:</span>
                <span className="text-emerald-400">AQI {aqi.usAqi} ({aqi.label.toUpperCase()})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-pink-300/70 uppercase">Sunset Drive:</span>
                <span className="text-amber-400 font-black">{weather.sunset}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: Neon Schedule & Directives (Cols 5-8) */}
        <div className="col-span-4 flex flex-col space-y-4">
          <div className="p-4 rounded-2xl border-2 border-pink-500/60 bg-[#1d0633]/90 shadow-[0_0_20px_rgba(255,0,127,0.2)] flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between border-b border-pink-500/40 pb-2 mb-2">
              <span className="text-[10px] text-amber-300 font-black uppercase tracking-wider">Today&apos;s Itinerary</span>
              <span className="text-xs font-mono font-bold text-pink-400">{events.length} Events</span>
            </div>
            <div className="space-y-2 overflow-y-auto pr-1 flex-1 text-xs">
              {events.slice(0, 3).map((evt) => (
                <div
                  key={evt.id}
                  className="p-2.5 rounded-xl border border-pink-500/40 bg-gradient-to-r from-pink-950/40 to-purple-950/40 shadow-sm"
                >
                  <div className="flex justify-between text-[10px] font-bold text-amber-400">
                    <span>{evt.startTime} - {evt.endTime}</span>
                    <span className="uppercase text-pink-300 font-mono">[{evt.category}]</span>
                  </div>
                  <h4 className="text-white font-bold mt-0.5 truncate">{evt.title}</h4>
                  {evt.location && (
                    <p className="text-[10px] text-pink-300/70 mt-0.5 truncate">📍 {evt.location}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl border-2 border-pink-500/60 bg-[#1d0633]/90 shadow-[0_0_20px_rgba(255,0,127,0.2)] flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between border-b border-pink-500/40 pb-2 mb-2">
              <span className="text-[10px] text-amber-300 font-black uppercase tracking-wider">Mission Directives</span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {tasks.filter(t => t.completed).length}/{tasks.length} Done
              </span>
            </div>
            <div className="space-y-1.5 overflow-y-auto pr-1 flex-1 text-xs">
              {tasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className="flex items-center space-x-2 cursor-pointer p-2 rounded-xl border border-pink-500/30 bg-pink-950/30 hover:border-pink-400 transition-all"
                >
                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                    task.completed ? 'bg-pink-600 border-pink-500 text-white' : 'border-pink-400'
                  }`}>
                    {task.completed && <Check size={12} />}
                  </div>
                  <span className={`truncate text-xs font-medium ${task.completed ? 'line-through text-pink-300/40' : 'text-white'}`}>
                    {task.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Wall Street Sunset & Outrun GP (Cols 9-12) */}
        <div className="col-span-4 flex flex-col space-y-4">
          <div className="p-4 rounded-2xl border-2 border-pink-500/60 bg-[#1d0633]/90 shadow-[0_0_20px_rgba(255,0,127,0.2)] flex-1 flex flex-col">
            <div className="flex items-center justify-between border-b border-pink-500/40 pb-2 mb-2">
              <span className="text-[10px] text-amber-300 font-black uppercase tracking-wider">Wall Street 1984</span>
              <span className="text-xs font-mono font-bold text-emerald-400">Live Quotes</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {finance.map((item) => {
                const isUp = item.change >= 0;
                return (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl border border-pink-500/30 bg-[#2b0a4a]/70 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-pink-300 font-bold truncate">{item.symbol}</span>
                      <span className={`font-bold font-mono ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isUp ? '+' : ''}{item.changePercent.toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-sm font-black text-white mt-1 font-mono">{item.price}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 rounded-2xl border-2 border-amber-500/70 bg-[#1d0633]/90 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
            <div className="flex items-center justify-between text-[10px] font-bold text-amber-400 uppercase mb-1">
              <span className="flex items-center">
                <Flag size={12} className="mr-1 text-pink-400" />
                OUTRUN GRAND PRIX
              </span>
              <span>Round {f1.activeRound}/{f1.totalRounds}</span>
            </div>
            <h4 className="text-sm font-black text-white truncate">{f1.raceName}</h4>
            <p className="text-xs text-pink-300/80 truncate">{f1.circuitName}</p>

            <div className="mt-2.5 p-2.5 rounded-xl bg-pink-950/60 border border-pink-500/40 flex items-center justify-between text-xs">
              <div>
                <span className="text-[9px] text-amber-300 font-bold uppercase block">Next Race Session</span>
                <span className="text-white font-bold">{f1.nextSession.name}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-amber-300 font-bold uppercase block">Turbo Countdown</span>
                <span className="text-sm font-black font-mono text-amber-400">{f1.nextSession.countdownFormatted}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
