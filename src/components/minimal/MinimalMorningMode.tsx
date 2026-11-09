import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Check, Flag } from 'lucide-react';
import { AudioBanner } from '../common/AudioBanner';

export const MinimalMorningMode: React.FC = () => {
  const { now, weather, aqi, events, tasks, toggleTask, f1, finance, media } = useDashboard();

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const dateFormatted = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="w-full h-full p-8 flex flex-col justify-between overflow-hidden bg-transparent text-neutral-100 select-none font-sans">
      {/* Top Greeting & Now Playing Audio Banner */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-accent)' }} />
            <h1 className="text-xl font-light text-white tracking-wide">Morning Briefing</h1>
          </div>
          <p className="text-xs font-light text-neutral-500 mt-0.5">
            Sunrise was at {weather.sunrise} • Today&apos;s expected high {weather.highTemp}°C
          </p>
        </div>

        {media.state === 'playing' && <AudioBanner compact={true} />}
      </div>

      {/* 3-Column 1080p Grid */}
      <div className="grid grid-cols-12 gap-8 flex-1 min-h-0">
        {/* Left Column: Clock & Weather (Cols 1-4) */}
        <div className="col-span-4 flex flex-col justify-between border-r border-white/10 pr-8">
          <div>
            <div className="text-7xl font-extralight tracking-tighter text-white flex items-baseline">
              <span>{hours}:{minutes}</span>
              <span className="text-2xl ml-2 font-mono font-light" style={{ color: 'var(--color-accent)' }}>
                :{seconds}
              </span>
            </div>
            <p className="text-xs font-light mt-2 tracking-wide" style={{ color: 'var(--color-accent)' }}>
              {dateFormatted}
            </p>
          </div>

          <div className="space-y-3 pt-6 border-t border-white/10">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-light text-white">
                {weather.temperature}°<span style={{ color: 'var(--color-accent)' }}>C</span>
              </span>
              <span className="text-xs font-light text-neutral-400">{weather.condition}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-light text-neutral-400 pt-2 border-t border-white/5">
              <div>
                <span className="block text-[10px] uppercase text-neutral-500">Feels Like</span>
                <span className="text-neutral-200">{weather.apparentTemperature}°C</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase text-neutral-500">Air Quality</span>
                <span className="text-neutral-200">AQI {aqi.usAqi} ({aqi.label})</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase text-neutral-500">Humidity</span>
                <span className="text-neutral-200">{weather.humidity}%</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase text-neutral-500">Sunset</span>
                <span className="text-neutral-200">{weather.sunset}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: Schedule & Priorities (Cols 5-8) */}
        <div className="col-span-4 flex flex-col justify-between border-r border-white/10 pr-8">
          {/* Schedule */}
          <div className="flex-1 mb-4 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3 pb-1 border-b border-white/10">
              <h3 className="text-xs uppercase tracking-widest text-neutral-400 font-medium">
                Today&apos;s Schedule
              </h3>
              <span className="text-[10px] font-mono text-neutral-500">{events.length} Events</span>
            </div>
            <div className="space-y-3 overflow-y-auto pr-1 flex-1">
              {events.slice(0, 3).map((evt) => (
                <div key={evt.id} className="group">
                  <span className="text-[11px] font-mono block font-medium" style={{ color: 'var(--color-accent)' }}>
                    {evt.startTime} — {evt.endTime}
                  </span>
                  <h4 className="text-xs font-light text-neutral-200 mt-0.5 leading-snug truncate">
                    {evt.title}
                  </h4>
                  {evt.location && (
                    <p className="text-[10px] text-neutral-500 font-light truncate">{evt.location}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Tasks */}
          <div className="flex-1 flex flex-col min-h-0 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs uppercase tracking-widest text-neutral-400 font-medium">
                Priorities
              </h3>
              <span className="text-[10px] font-mono font-medium" style={{ color: 'var(--color-accent)' }}>
                {tasks.filter(t => t.completed).length}/{tasks.length} Done
              </span>
            </div>
            <div className="space-y-2 overflow-y-auto pr-1 flex-1">
              {tasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className="flex items-start space-x-2.5 cursor-pointer group"
                >
                  <div className="mt-0.5 shrink-0">
                    {task.completed ? (
                      <div
                        className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-black"
                        style={{ backgroundColor: 'var(--color-accent)' }}
                      >
                        <Check size={10} strokeWidth={3} />
                      </div>
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-neutral-600 group-hover:border-white transition-colors" />
                    )}
                  </div>
                  <p
                    className={`text-xs font-light leading-snug truncate ${
                      task.completed ? 'text-neutral-600 line-through' : 'text-neutral-300'
                    }`}
                  >
                    {task.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Financial Markets & F1 Radar (Cols 9-12) */}
        <div className="col-span-4 flex flex-col justify-between">
          {/* Financial Markets */}
          <div className="flex-1 mb-4 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3 pb-1 border-b border-white/10">
              <h3 className="text-xs uppercase tracking-widest text-neutral-400 font-medium">
                Markets at Open
              </h3>
              <span className="text-[10px] font-mono text-neutral-500">Live</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {finance.map((item) => {
                const isUp = item.change >= 0;
                return (
                  <div key={item.id} className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-neutral-400 font-light truncate">{item.symbol}</span>
                      <span className={`font-mono text-[10px] ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isUp ? '+' : ''}{item.changePercent.toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-xs font-light text-neutral-100 mt-1">{item.price}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* F1 Countdown Card */}
          <div className="pt-3 border-t border-white/10">
            <div className="flex items-center justify-between mb-1 text-[10px] uppercase font-mono text-neutral-500">
              <span className="flex items-center">
                <Flag size={10} className="mr-1 text-red-400" />
                Next Grand Prix
              </span>
              <span>Round {f1.activeRound}/{f1.totalRounds}</span>
            </div>
            <h4 className="text-sm font-light text-white truncate">{f1.raceName}</h4>
            <p className="text-xs text-neutral-500 truncate">{f1.circuitName}</p>

            <div className="mt-2.5 p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase block">Next Session</span>
                <span className="text-neutral-300 font-light">{f1.nextSession.name}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-neutral-500 uppercase block">Countdown</span>
                <span className="text-sm font-mono text-red-400">{f1.nextSession.countdownFormatted}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
