import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Check, Circle } from 'lucide-react';

export const MinimalMorningMode: React.FC = () => {
  const { now, weather, aqi, events, tasks, toggleTask } = useDashboard();

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  const dateFormatted = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="w-full h-full p-12 flex flex-col justify-between overflow-hidden bg-[#09090b] text-neutral-100 select-none font-sans">
      <div className="grid grid-cols-12 gap-10 flex-1 min-h-0">
        {/* Left Column: Architectural Clock & Weather (Cols 1-5) */}
        <div className="col-span-5 flex flex-col justify-between border-r border-white/10 pr-10">
          <div>
            <div className="text-8xl font-extralight tracking-tighter text-white">
              {hours}:{minutes}
            </div>
            <p className="text-sm font-light text-neutral-400 mt-2 tracking-wide">
              {dateFormatted}
            </p>
          </div>

          <div className="space-y-4 pt-8 border-t border-white/10">
            <div className="flex items-baseline justify-between">
              <span className="text-4xl font-light text-white">{weather.temperature}°C</span>
              <span className="text-xs font-light text-neutral-400">{weather.condition}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-light text-neutral-400 pt-2 border-t border-white/5">
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

        {/* Center Column: Clean Schedule (Cols 6-8) */}
        <div className="col-span-4 flex flex-col border-r border-white/10 pr-10">
          <h3 className="text-xs uppercase tracking-widest text-neutral-500 font-medium mb-6">
            Today&apos;s Schedule
          </h3>
          <div className="space-y-5 overflow-y-auto max-h-[58vh] pr-2">
            {events.map((evt) => (
              <div key={evt.id} className="group">
                <span className="text-xs font-mono text-neutral-500 block">
                  {evt.startTime} — {evt.endTime}
                </span>
                <h4 className="text-sm font-light text-neutral-200 mt-1 leading-snug">
                  {evt.title}
                </h4>
                {evt.location && (
                  <p className="text-xs text-neutral-500 font-light mt-0.5">{evt.location}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Quiet Tasks (Cols 9-12) */}
        <div className="col-span-3 flex flex-col">
          <h3 className="text-xs uppercase tracking-widest text-neutral-500 font-medium mb-6">
            Action Items
          </h3>
          <div className="space-y-4 overflow-y-auto max-h-[58vh]">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className="flex items-start space-x-3 cursor-pointer group"
              >
                <div className="mt-0.5 shrink-0">
                  {task.completed ? (
                    <div className="w-4 h-4 rounded-full bg-white text-black flex items-center justify-center">
                      <Check size={11} />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-neutral-600 group-hover:border-white transition-colors" />
                  )}
                </div>
                <div className="min-w-0">
                  <p
                    className={`text-xs font-light leading-snug transition-all ${
                      task.completed ? 'text-neutral-600 line-through' : 'text-neutral-300'
                    }`}
                  >
                    {task.title}
                  </p>
                  {task.dueTime && (
                    <span className="text-[10px] text-neutral-600 font-mono block mt-0.5">
                      {task.dueTime}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
