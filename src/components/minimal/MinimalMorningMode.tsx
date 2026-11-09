import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Check, Flag } from 'lucide-react';
import { AudioBanner } from '../common/AudioBanner';

export const MinimalMorningMode: React.FC = () => {
  const { now, weather, aqi, events, tasks, toggleTask, f1, finance, media, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const dateFormatted = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={`w-full h-full p-8 flex flex-col justify-between overflow-hidden bg-transparent select-none font-sans ${isLight ? 'text-neutral-900' : 'text-neutral-100'}`}>
      {/* Top Greeting & Now Playing Audio Banner */}
      <div className={`flex items-center justify-between pb-4 mb-4 border-b ${isLight ? 'border-neutral-200' : 'border-white/10'}`}>
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-accent)' }} />
            <h1 className={`text-xl font-light tracking-wide ${isLight ? 'text-neutral-900' : 'text-white'}`}>Morning Briefing</h1>
          </div>
          <p className={`text-xs font-light mt-0.5 ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
            Sunrise was at {weather.sunrise} • Today&apos;s expected high {weather.highTemp}°C
          </p>
        </div>

        {media.state === 'playing' && <AudioBanner compact={true} />}
      </div>

      {/* 3-Column 1080p Grid */}
      <div className="grid grid-cols-12 gap-8 flex-1 min-h-0">
        {/* Left Column: Clock & Weather (Cols 1-4) */}
        <div className={`col-span-4 flex flex-col justify-between border-r pr-8 ${isLight ? 'border-neutral-200' : 'border-white/10'}`}>
          <div>
            <div className={`text-7xl font-extralight tracking-tighter flex items-baseline ${isLight ? 'text-neutral-900' : 'text-white'}`}>
              <span>{hours}:{minutes}</span>
              <span className="text-2xl ml-2 font-mono font-light" style={{ color: 'var(--color-accent)' }}>
                :{seconds}
              </span>
            </div>
            <p className="text-xs font-light mt-2 tracking-wide" style={{ color: 'var(--color-accent)' }}>
              {dateFormatted}
            </p>
          </div>

          <div className={`space-y-3 pt-6 border-t ${isLight ? 'border-neutral-200' : 'border-white/10'}`}>
            <div className="flex items-baseline justify-between">
              <span className={`text-3xl font-light ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                {weather.temperature}°<span style={{ color: 'var(--color-accent)' }}>C</span>
              </span>
              <span className={`text-xs font-light ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>{weather.condition}</span>
            </div>

            <div className={`grid grid-cols-2 gap-3 text-xs font-light pt-2 border-t ${
              isLight ? 'border-neutral-100 text-neutral-600' : 'border-white/5 text-neutral-400'
            }`}>
              <div>
                <span className={`block text-[10px] uppercase ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>Feels Like</span>
                <span className={isLight ? 'text-neutral-800' : 'text-neutral-200'}>{weather.apparentTemperature}°C</span>
              </div>
              <div>
                <span className={`block text-[10px] uppercase ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>Air Quality</span>
                <span className={isLight ? 'text-neutral-800' : 'text-neutral-200'}>AQI {aqi.usAqi} ({aqi.label})</span>
              </div>
              <div>
                <span className={`block text-[10px] uppercase ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>Humidity</span>
                <span className={isLight ? 'text-neutral-800' : 'text-neutral-200'}>{weather.humidity}%</span>
              </div>
              <div>
                <span className={`block text-[10px] uppercase ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>Sunset</span>
                <span className={isLight ? 'text-neutral-800' : 'text-neutral-200'}>{weather.sunset}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: Schedule & Priorities (Cols 5-8) */}
        <div className={`col-span-4 flex flex-col justify-between border-r pr-8 ${isLight ? 'border-neutral-200' : 'border-white/10'}`}>
          {/* Schedule */}
          <div className="flex-1 mb-4 flex flex-col min-h-0">
            <div className={`flex items-center justify-between mb-3 pb-1 border-b ${isLight ? 'border-neutral-200' : 'border-white/10'}`}>
              <h3 className={`text-xs uppercase tracking-widest font-medium ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                Today&apos;s Schedule
              </h3>
              <span className={`text-[10px] font-mono ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>{events.length} Events</span>
            </div>
            <div className="space-y-3 overflow-y-auto pr-1 flex-1">
              {events.slice(0, 3).map((evt) => (
                <div key={evt.id} className="group">
                  <span className="text-[11px] font-mono block font-medium" style={{ color: 'var(--color-accent)' }}>
                    {evt.startTime} — {evt.endTime}
                  </span>
                  <h4 className={`text-xs font-light mt-0.5 leading-snug truncate ${isLight ? 'text-neutral-800' : 'text-neutral-200'}`}>
                    {evt.title}
                  </h4>
                  {evt.location && (
                    <p className={`text-[10px] font-light truncate ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>{evt.location}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Tasks */}
          <div className={`flex-1 flex flex-col min-h-0 pt-3 border-t ${isLight ? 'border-neutral-200' : 'border-white/10'}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className={`text-xs uppercase tracking-widest font-medium ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
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
                        className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: 'var(--color-accent)' }}
                      >
                        <Check size={10} strokeWidth={3} />
                      </div>
                    ) : (
                      <div className={`w-3.5 h-3.5 rounded-full border transition-colors ${
                        isLight ? 'border-neutral-300 group-hover:border-neutral-900' : 'border-neutral-600 group-hover:border-white'
                      }`} />
                    )}
                  </div>
                  <p
                    className={`text-xs font-light leading-snug truncate ${
                      task.completed
                        ? isLight ? 'text-neutral-400 line-through' : 'text-neutral-600 line-through'
                        : isLight ? 'text-neutral-800' : 'text-neutral-300'
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
            <div className={`flex items-center justify-between mb-3 pb-1 border-b ${isLight ? 'border-neutral-200' : 'border-white/10'}`}>
              <h3 className={`text-xs uppercase tracking-widest font-medium ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                Markets at Open
              </h3>
              <span className={`text-[10px] font-mono ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>Live</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {finance.map((item) => {
                const isUp = item.change >= 0;
                return (
                  <div
                    key={item.id}
                    className={`p-2.5 rounded-xl flex flex-col justify-between border ${
                      isLight ? 'bg-neutral-100/80 border-neutral-200/80' : 'bg-white/5 border-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className={`font-light truncate ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>{item.symbol}</span>
                      <span className={`font-mono text-[10px] ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {isUp ? '+' : ''}{item.changePercent.toFixed(1)}%
                      </span>
                    </div>
                    <div className={`text-xs font-medium mt-1 ${isLight ? 'text-neutral-900' : 'text-neutral-100'}`}>{item.price}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* F1 Countdown Card */}
          <div className={`pt-3 border-t ${isLight ? 'border-neutral-200' : 'border-white/10'}`}>
            <div className={`flex items-center justify-between mb-1 text-[10px] uppercase font-mono ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>
              <span className="flex items-center">
                <Flag size={10} className="mr-1 text-red-500" />
                Next Grand Prix
              </span>
              <span>Round {f1.activeRound}/{f1.totalRounds}</span>
            </div>
            <h4 className={`text-sm font-medium truncate ${isLight ? 'text-neutral-900' : 'text-white'}`}>{f1.raceName}</h4>
            <p className={`text-xs truncate ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>{f1.circuitName}</p>

            <div className={`mt-2.5 p-2.5 rounded-xl border flex items-center justify-between text-xs ${
              isLight ? 'bg-neutral-100/80 border-neutral-200/80' : 'bg-white/5 border-white/5'
            }`}>
              <div>
                <span className={`text-[10px] uppercase block ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>Next Session</span>
                <span className={`font-light ${isLight ? 'text-neutral-800' : 'text-neutral-300'}`}>{f1.nextSession.name}</span>
              </div>
              <div className="text-right">
                <span className={`text-[10px] uppercase block ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>Countdown</span>
                <span className="text-sm font-mono text-red-500">{f1.nextSession.countdownFormatted}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
