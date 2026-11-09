import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { CheckSquare, Square, Flag, Feather } from 'lucide-react';
import { AudioBanner } from '../common/AudioBanner';

export const EinkMorningMode: React.FC = () => {
  const { now, weather, aqi, events, tasks, toggleTask, f1, finance, media } = useDashboard();

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  const dateFormatted = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="w-full h-full p-8 flex flex-col justify-between overflow-hidden bg-[#f5f2eb] text-[#1c1917] font-serif select-none">
      {/* Top Masthead & Audio Banner */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-stone-800">
        <div className="flex items-center space-x-3">
          <div
            className="p-2 border-2 bg-[#ede8df]"
            style={{ borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}
          >
            <Feather size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight uppercase">Morning Dispatch &amp; Almanac</h1>
            <p className="text-xs text-stone-600 italic">
              Dawn broke at {weather.sunrise} • Estimated high of <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>{weather.highTemp}°C</span> today
            </p>
          </div>
        </div>

        {media.state === 'playing' && <AudioBanner compact={true} className="bg-[#ede8df] border-stone-800 text-stone-900" />}
      </div>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left Column: Clock & Almanac (Cols 1-4) */}
        <div className="col-span-4 flex flex-col justify-between border-r-2 border-stone-300 pr-6">
          <div className="p-4 border-2 border-stone-800 bg-[#ede8df] shadow-[2px_2px_0px_#1c1917]">
            <div
              className="text-xs uppercase font-bold tracking-widest border-b border-stone-400 pb-1 mb-2"
              style={{ color: 'var(--color-accent)' }}
            >
              Current Timepiece // IST
            </div>
            <div className="text-6xl font-bold tracking-tight text-center py-1">
              {hours}:{minutes}
            </div>
            <div className="text-xs text-center italic text-stone-600 border-t border-stone-400 pt-1.5 mt-2">
              {dateFormatted}
            </div>
          </div>

          <div className="p-4 border-2 border-stone-800 bg-[#ede8df] shadow-[2px_2px_0px_#1c1917] flex-1 mt-4 flex flex-col justify-between">
            <div className="text-xs uppercase font-bold tracking-widest text-stone-600 border-b border-stone-400 pb-1 mb-2">
              Weather &amp; Atmosphere
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-stone-300 pb-1">
                <span>Observed Temp:</span>
                <strong style={{ color: 'var(--color-accent)' }}>{weather.temperature}°C ({weather.condition})</strong>
              </div>
              <div className="flex justify-between border-b border-stone-300 pb-1">
                <span>Apparent Feel:</span>
                <span>{weather.apparentTemperature}°C</span>
              </div>
              <div className="flex justify-between border-b border-stone-300 pb-1">
                <span>Air Purity:</span>
                <strong>AQI {aqi.usAqi} ({aqi.label})</strong>
              </div>
              <div className="flex justify-between border-b border-stone-300 pb-1">
                <span>Relative Humidity:</span>
                <span>{weather.humidity}%</span>
              </div>
              <div className="flex justify-between">
                <span>Sunset Dusk:</span>
                <span>{weather.sunset}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: Engagements & Prioritised Affairs (Cols 5-8) */}
        <div className="col-span-4 flex flex-col justify-between border-r-2 border-stone-300 pr-6">
          {/* Engagements */}
          <div className="flex-1 mb-4 flex flex-col min-h-0">
            <div className="flex items-center justify-between border-b-2 border-stone-800 pb-1 mb-3">
              <h3 className="text-xs uppercase font-bold tracking-widest text-stone-900">
                Today&apos;s Engagements
              </h3>
              <span className="text-[11px] font-bold" style={{ color: 'var(--color-accent)' }}>
                {events.length} listed
              </span>
            </div>
            <div className="space-y-2.5 overflow-y-auto pr-1 flex-1">
              {events.slice(0, 3).map((evt) => (
                <div key={evt.id} className="p-2 border border-stone-400 bg-[#ede8df]">
                  <span className="text-[10px] font-mono uppercase font-bold block" style={{ color: 'var(--color-accent)' }}>
                    {evt.startTime} - {evt.endTime}
                  </span>
                  <h4 className="text-xs font-bold mt-0.5 truncate">{evt.title}</h4>
                  {evt.location && (
                    <p className="text-[10px] italic text-stone-600 truncate">{evt.location}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Tasks */}
          <div className="flex-1 flex flex-col min-h-0 pt-2 border-t-2 border-stone-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs uppercase font-bold tracking-widest text-stone-900">
                Docket of Duties
              </h3>
              <span className="text-[11px] font-bold" style={{ color: 'var(--color-accent)' }}>
                {tasks.filter(t => t.completed).length}/{tasks.length} resolved
              </span>
            </div>
            <div className="space-y-2 overflow-y-auto pr-1 flex-1">
              {tasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className="flex items-start space-x-2 cursor-pointer group text-xs"
                >
                  {task.completed ? (
                    <CheckSquare size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--color-accent)' }} />
                  ) : (
                    <Square size={14} className="mt-0.5 text-stone-500 shrink-0" />
                  )}
                  <span className={`leading-snug truncate ${task.completed ? 'line-through text-stone-500' : 'text-stone-900 font-medium'}`}>
                    {task.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Commercial Markets & Grand Prix Dispatch (Cols 9-12) */}
        <div className="col-span-4 flex flex-col justify-between">
          {/* Commercial Markets */}
          <div className="flex-1 mb-4 flex flex-col min-h-0">
            <div className="flex items-center justify-between border-b-2 border-stone-800 pb-1 mb-3">
              <h3 className="text-xs uppercase font-bold tracking-widest text-stone-900">
                Financial Exchanges
              </h3>
              <span className="text-[10px] uppercase font-bold text-stone-600">Trading Live</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {finance.map((item) => {
                const isUp = item.change >= 0;
                return (
                  <div key={item.id} className="p-2 border border-stone-400 bg-[#ede8df] flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold uppercase text-stone-700 truncate">{item.symbol}</span>
                      <span className="font-mono text-[10px] font-bold">
                        {isUp ? '▲' : '▼'}{Math.abs(item.changePercent).toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-xs font-bold text-stone-900 mt-1 font-mono">{item.price}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Grand Prix Dispatch */}
          <div className="pt-2 border-t-2 border-stone-800">
            <div className="flex items-center justify-between mb-1 text-[10px] uppercase font-bold text-stone-600">
              <span className="flex items-center">
                <Flag size={11} className="mr-1" />
                Grand Prix Circuit
              </span>
              <span>Round {f1.activeRound}/{f1.totalRounds}</span>
            </div>
            <h4 className="text-xs font-bold truncate text-stone-900">{f1.raceName}</h4>
            <p className="text-[11px] italic text-stone-600 truncate">{f1.circuitName}</p>

            <div className="mt-2 p-2 border border-stone-800 bg-[#ede8df] flex items-center justify-between text-xs">
              <div>
                <span className="text-[9px] uppercase font-bold text-stone-600 block">Next Gathering</span>
                <span className="font-bold text-stone-900">{f1.nextSession.name}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] uppercase font-bold text-stone-600 block">Remaining</span>
                <span className="font-mono font-bold text-stone-900">{f1.nextSession.countdownFormatted}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
