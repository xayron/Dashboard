import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Check, Flame, Flag, Sun, Sparkles } from 'lucide-react';
import { AudioBanner } from '../common/AudioBanner';

export const RetrowaveMorningMode: React.FC = () => {
  const { now, weather, aqi, events, tasks, toggleTask, f1, finance, media } = useDashboard();

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const dateFormatted = now.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
  }).toUpperCase();

  return (
    <div className="w-full h-full p-6 flex flex-col justify-between overflow-hidden bg-[#0c0317] font-mono text-cyan-200 select-none">
      {/* Top Banner & Audio */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-fuchsia-500/40">
        <div>
          <h1 className="text-xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-fuchsia-400 to-cyan-400 drop-shadow-[0_0_12px_rgba(255,42,133,0.5)]">
            NEON SUNRISE BRIEFING
          </h1>
          <p className="text-[11px] text-pink-300 mt-0.5">
            DAWN WAS AT {weather.sunrise} • PEAK HEAT {weather.highTemp}°C
          </p>
        </div>

        {media.state === 'playing' && <AudioBanner compact={true} />}
      </div>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-12 gap-5 flex-1 min-h-0">
        {/* Left Column: Neon Clock & Weather (Cols 1-4) */}
        <div className="col-span-4 flex flex-col space-y-4">
          <div className="p-4 border-2 border-pink-500 bg-[#150729] shadow-[0_0_20px_rgba(255,42,133,0.25)] flex flex-col items-center">
            <span className="text-[10px] text-pink-400 font-bold uppercase tracking-widest mb-1">CHRONO//IST</span>
            <div className="text-6xl font-black text-white tracking-widest flex items-baseline">
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-200 to-cyan-400">
                {hours}:{minutes}
              </span>
              <span className="text-2xl text-pink-500 ml-2 animate-pulse">:{seconds}</span>
            </div>
            <div className="text-xs text-fuchsia-300 font-bold mt-2 border-t border-fuchsia-500/30 pt-1.5 w-full text-center">
              {dateFormatted}
            </div>
          </div>

          <div className="p-4 border-2 border-cyan-500/60 bg-[#150729] shadow-[0_0_20px_rgba(0,240,255,0.2)] flex-1 flex flex-col justify-between text-xs">
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest border-b border-cyan-500/30 pb-1">
              ATMOSPHERICS
            </span>
            <div className="space-y-2 pt-1 font-bold">
              <div className="flex justify-between border-b border-cyan-500/20 pb-1">
                <span className="text-gray-400">TEMPERATURE:</span>
                <span className="text-white">{weather.temperature}°C ({weather.condition.toUpperCase()})</span>
              </div>
              <div className="flex justify-between border-b border-cyan-500/20 pb-1">
                <span className="text-gray-400">FEELS LIKE:</span>
                <span className="text-cyan-300">{weather.apparentTemperature}°C</span>
              </div>
              <div className="flex justify-between border-b border-cyan-500/20 pb-1">
                <span className="text-gray-400">AIR QUALITY:</span>
                <span className="text-emerald-400">AQI {aqi.usAqi} [{aqi.label.toUpperCase()}]</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">SUNSET:</span>
                <span className="text-amber-400">{weather.sunset}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: Neon Timetable & Directives (Cols 5-8) */}
        <div className="col-span-4 flex flex-col space-y-4">
          <div className="p-4 border-2 border-fuchsia-500/60 bg-[#150729] shadow-[0_0_20px_rgba(217,70,239,0.2)] flex-1 flex flex-col min-h-0">
            <span className="text-[10px] text-fuchsia-400 font-bold uppercase tracking-widest border-b border-fuchsia-500/30 pb-1 mb-2">
              TODAY&apos;S TIMELINE
            </span>
            <div className="space-y-2 overflow-y-auto pr-1 flex-1 text-xs">
              {events.slice(0, 3).map((evt) => (
                <div key={evt.id} className="p-2 border border-pink-500/40 bg-pink-950/20">
                  <div className="flex justify-between text-[10px] text-pink-400 font-bold">
                    <span>{evt.startTime} - {evt.endTime}</span>
                    <span className="uppercase text-cyan-400">{evt.category}</span>
                  </div>
                  <h4 className="text-white font-bold mt-0.5 truncate">{evt.title}</h4>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border-2 border-emerald-500/60 bg-[#150729] shadow-[0_0_20px_rgba(16,185,129,0.2)] flex-1 flex flex-col min-h-0">
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest border-b border-emerald-500/30 pb-1 mb-2">
              TASK QUEUE
            </span>
            <div className="space-y-1.5 overflow-y-auto pr-1 flex-1 text-xs">
              {tasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className="flex items-center space-x-2 cursor-pointer p-1.5 border border-emerald-500/30 bg-emerald-950/20"
                >
                  <span className={task.completed ? 'text-gray-500' : 'text-emerald-400 font-bold'}>
                    {task.completed ? '[✓]' : '[ ]'}
                  </span>
                  <span className={`truncate text-xs ${task.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                    {task.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Synthwave Markets & Outrun Grand Prix (Cols 9-12) */}
        <div className="col-span-4 flex flex-col space-y-4">
          <div className="p-4 border-2 border-cyan-500/60 bg-[#150729] shadow-[0_0_20px_rgba(0,240,255,0.2)] flex-1 flex flex-col">
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest border-b border-cyan-500/30 pb-1 mb-2">
              WALL_STREET//CYBER
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {finance.map((item) => {
                const isUp = item.change >= 0;
                return (
                  <div key={item.id} className="p-2 border border-cyan-500/30 bg-cyan-950/30 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-gray-400 font-bold truncate">{item.symbol}</span>
                      <span className={`font-bold ${isUp ? 'text-emerald-400' : 'text-pink-400'}`}>
                        {isUp ? '+' : ''}{item.changePercent.toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white mt-1">{item.price}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 border-2 border-pink-500/60 bg-[#150729] shadow-[0_0_20px_rgba(255,42,133,0.25)]">
            <div className="flex items-center justify-between text-[10px] font-bold text-pink-400 uppercase mb-1">
              <span>OUTRUN GP</span>
              <span>ROUND {f1.activeRound}/{f1.totalRounds}</span>
            </div>
            <h4 className="text-sm font-bold text-white truncate">{f1.raceName}</h4>
            <p className="text-[11px] text-gray-400 truncate">{f1.circuitName}</p>

            <div className="mt-2.5 p-2 bg-pink-950/40 border border-pink-500/40 flex items-center justify-between text-xs">
              <div>
                <span className="text-[9px] text-pink-300 block uppercase">TARGET</span>
                <span className="text-white font-bold">{f1.nextSession.name}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-pink-300 block uppercase">COUNTDOWN</span>
                <span className="text-sm font-black text-pink-400">{f1.nextSession.countdownFormatted}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
