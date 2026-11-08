import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { CheckCircle2, Circle, Coffee, Flag, Sunrise } from 'lucide-react';
import { AudioBanner } from '../common/AudioBanner';

export const NeumorphicMorningMode: React.FC = () => {
  const { now, weather, aqi, events, tasks, toggleTask, f1, finance, media } = useDashboard();

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const dateFormatted = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="w-full h-full p-8 flex flex-col justify-between overflow-hidden bg-[#1a1d24] text-neutral-200 select-none">
      {/* Top Banner: Greeting & Audio */}
      <div className="flex items-center justify-between pb-4 mb-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-[#1a1d24] shadow-[4px_4px_8px_#101217,-4px_-4px_8px_#242831] text-amber-400">
            <Coffee size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Morning Overview</h1>
            <p className="text-xs text-neutral-400 mt-0.5 flex items-center">
              <Sunrise size={12} className="mr-1.5 text-amber-400" />
              Sunrise at {weather.sunrise} • Today&apos;s high {weather.highTemp}°C
            </p>
          </div>
        </div>

        {media.state === 'playing' && <AudioBanner compact={true} />}
      </div>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left Column: Clock & Weather (Cols 1-4) */}
        <div className="col-span-4 flex flex-col space-y-6">
          <div className="p-6 rounded-3xl bg-[#1a1d24] shadow-[6px_6px_14px_#101217,-6px_-6px_14px_#242831] flex flex-col items-center">
            <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest mb-1">
              INDIAN STANDARD TIME
            </span>
            <div className="text-6xl font-light text-white tracking-tight flex items-baseline">
              <span>{hours}:{minutes}</span>
              <span className="text-2xl text-blue-400 ml-2 font-mono">:{seconds}</span>
            </div>
            <div className="text-xs text-neutral-400 mt-2 font-medium">
              {dateFormatted}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#1a1d24] shadow-[6px_6px_14px_#101217,-6px_-6px_14px_#242831] flex-1 flex flex-col justify-between text-xs">
            <div className="flex items-center justify-between border-b border-neutral-700/50 pb-2">
              <span className="text-neutral-400 font-bold uppercase text-[10px] tracking-wider">Atmospheric Data</span>
              <span className="text-blue-400 font-bold">{weather.temperature}°C</span>
            </div>
            <div className="space-y-2 pt-2">
              <div className="flex justify-between">
                <span className="text-neutral-400">Sky Condition:</span>
                <span className="text-white font-medium">{weather.condition}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Apparent Feel:</span>
                <span className="text-neutral-200">{weather.apparentTemperature}°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Air Quality:</span>
                <span className="text-emerald-400 font-medium">AQI {aqi.usAqi} ({aqi.label})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Relative Humidity:</span>
                <span className="text-neutral-200">{weather.humidity}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Sunset:</span>
                <span className="text-amber-400">{weather.sunset}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: Schedule & Priorities (Cols 5-8) */}
        <div className="col-span-4 flex flex-col space-y-6">
          <div className="p-5 rounded-3xl bg-[#1a1d24] shadow-[6px_6px_14px_#101217,-6px_-6px_14px_#242831] flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between border-b border-neutral-700/50 pb-2 mb-3">
              <span className="text-neutral-400 font-bold uppercase text-[10px] tracking-wider">Today&apos;s Schedule</span>
              <span className="text-neutral-500 text-xs font-mono">{events.length} Events</span>
            </div>
            <div className="space-y-2.5 overflow-y-auto pr-1 flex-1 text-xs">
              {events.slice(0, 3).map((evt) => (
                <div
                  key={evt.id}
                  className="p-3 rounded-2xl bg-[#1a1d24] shadow-[inset_2px_2px_5px_#101217,inset_-2px_-2px_5px_#242831]"
                >
                  <span className="text-[10px] font-mono text-blue-400 font-bold block">
                    {evt.startTime} - {evt.endTime}
                  </span>
                  <h4 className="text-xs font-bold text-white mt-0.5 truncate">{evt.title}</h4>
                  {evt.location && (
                    <p className="text-[10px] text-neutral-400 mt-0.5 truncate">{evt.location}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#1a1d24] shadow-[6px_6px_14px_#101217,-6px_-6px_14px_#242831] flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between border-b border-neutral-700/50 pb-2 mb-2">
              <span className="text-neutral-400 font-bold uppercase text-[10px] tracking-wider">Tasks &amp; Action</span>
              <span className="text-emerald-400 text-xs font-mono">
                {tasks.filter(t => t.completed).length}/{tasks.length} Done
              </span>
            </div>
            <div className="space-y-2 overflow-y-auto pr-1 flex-1 text-xs">
              {tasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className="p-2.5 rounded-xl bg-[#1a1d24] shadow-[3px_3px_6px_#101217,-3px_-3px_6px_#242831] hover:shadow-[inset_2px_2px_4px_#101217,inset_-2px_-2px_4px_#242831] cursor-pointer flex items-center space-x-2.5 transition-all"
                >
                  {task.completed ? (
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  ) : (
                    <Circle size={16} className="text-neutral-500 shrink-0" />
                  )}
                  <span className={`truncate ${task.completed ? 'line-through text-neutral-500' : 'text-neutral-200'}`}>
                    {task.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Markets & Grand Prix Radar (Cols 9-12) */}
        <div className="col-span-4 flex flex-col space-y-6">
          <div className="p-5 rounded-3xl bg-[#1a1d24] shadow-[6px_6px_14px_#101217,-6px_-6px_14px_#242831] flex-1 flex flex-col">
            <div className="flex items-center justify-between border-b border-neutral-700/50 pb-2 mb-3">
              <span className="text-neutral-400 font-bold uppercase text-[10px] tracking-wider">Markets at Open</span>
              <span className="text-emerald-400 text-xs font-mono">Live</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {finance.map((item) => {
                const isUp = item.change >= 0;
                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-[#1a1d24] shadow-[inset_2px_2px_5px_#101217,inset_-2px_-2px_5px_#242831] flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-neutral-400 font-medium truncate">{item.symbol}</span>
                      <span className={`font-mono text-[10px] font-bold ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isUp ? '+' : ''}{item.changePercent.toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white mt-1.5">{item.price}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#1a1d24] shadow-[6px_6px_14px_#101217,-6px_-6px_14px_#242831]">
            <div className="flex items-center justify-between text-[10px] font-bold text-neutral-400 uppercase mb-1">
              <span className="flex items-center text-red-400">
                <Flag size={11} className="mr-1" /> Grand Prix
              </span>
              <span>Round {f1.activeRound}/{f1.totalRounds}</span>
            </div>
            <h4 className="text-sm font-bold text-white truncate">{f1.raceName}</h4>
            <p className="text-xs text-neutral-400 truncate">{f1.circuitName}</p>

            <div className="mt-2.5 p-3 rounded-2xl bg-[#1a1d24] shadow-[inset_2px_2px_5px_#101217,inset_-2px_-2px_5px_#242831] flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase block">Next Session</span>
                <span className="text-neutral-200 font-medium">{f1.nextSession.name}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-neutral-500 uppercase block">Countdown</span>
                <span className="text-sm font-bold font-mono text-red-400">{f1.nextSession.countdownFormatted}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
