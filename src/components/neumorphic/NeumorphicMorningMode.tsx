import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { CheckCircle2, Circle, Coffee, Sunrise } from 'lucide-react';
import { AudioBanner } from '../common/AudioBanner';

export const NeumorphicMorningMode: React.FC = () => {
  const { now, weather, aqi, events, tasks, toggleTask, finance, media, news, setManualOverrideMode, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const dateFormatted = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const cardClass = isLight
    ? 'bg-[#e2e8f0] shadow-[6px_6px_14px_#cbd5e1,-6px_-6px_14px_#ffffff] text-slate-900'
    : 'bg-[#1a1d24] shadow-[6px_6px_14px_#101217,-6px_-6px_14px_#242831] text-neutral-200';

  const insetClass = isLight
    ? 'bg-[#e2e8f0] shadow-[inset_2px_2px_5px_#cbd5e1,inset_-2px_-2px_5px_#ffffff]'
    : 'bg-[#1a1d24] shadow-[inset_2px_2px_5px_#101217,inset_-2px_-2px_5px_#242831]';

  return (
    <div className={`w-full h-full p-8 flex flex-col justify-between overflow-hidden bg-transparent select-none ${
      isLight ? 'text-slate-900' : 'text-neutral-200'
    }`}>
      {/* Top Banner: Greeting & Audio */}
      <div className="flex items-center justify-between pb-4 mb-4">
        <div className="flex items-center space-x-3.5">
          <div
            className={`p-3 rounded-2xl ${cardClass}`}
            style={{ color: 'var(--color-accent)' }}
          >
            <Coffee size={22} />
          </div>
          <div>
            <h1 className={`text-xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>Morning Overview</h1>
            <p className={`text-xs mt-0.5 flex items-center ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
              <Sunrise size={12} className="mr-1.5" style={{ color: 'var(--color-accent)' }} />
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
          <div className={`p-6 rounded-3xl ${cardClass} flex flex-col items-center`}>
            <span className={`text-[10px] uppercase font-bold tracking-widest mb-1 ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>
              INDIAN STANDARD TIME
            </span>
            <div className={`text-6xl font-light tracking-tight flex items-baseline ${isLight ? 'text-slate-900' : 'text-white'}`}>
              <span>{hours}:{minutes}</span>
              <span className="text-2xl ml-2 font-mono" style={{ color: 'var(--color-accent)' }}>
                :{seconds}
              </span>
            </div>
            <div className={`text-xs mt-2 font-medium ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
              {dateFormatted}
            </div>
          </div>

          <div className={`p-6 rounded-3xl ${cardClass} flex-1 flex flex-col justify-between`}>
            <div className="flex items-baseline justify-between border-b pb-3" style={{ borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.06)' }}>
              <div>
                <span className={`text-3xl font-light ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {weather.temperature}°<span style={{ color: 'var(--color-accent)' }}>C</span>
                </span>
                <span className={`text-xs ml-2 ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>{weather.condition}</span>
              </div>
              <span className="text-xs font-medium" style={{ color: 'var(--color-accent)' }}>
                AQI {aqi.usAqi} ({aqi.label})
              </span>
            </div>

            <div className={`grid grid-cols-2 gap-4 text-xs pt-4 ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
              <div className={`p-3 rounded-2xl ${insetClass}`}>
                <span className={`block text-[10px] uppercase ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>Feels Like</span>
                <span className={`font-medium ${isLight ? 'text-slate-900' : 'text-neutral-200'}`}>{weather.apparentTemperature}°C</span>
              </div>
              <div className={`p-3 rounded-2xl ${insetClass}`}>
                <span className={`block text-[10px] uppercase ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>Humidity</span>
                <span className={`font-medium ${isLight ? 'text-slate-900' : 'text-neutral-200'}`}>{weather.humidity}%</span>
              </div>
              <div className={`p-3 rounded-2xl ${insetClass}`}>
                <span className={`block text-[10px] uppercase ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>Wind</span>
                <span className={`font-medium ${isLight ? 'text-slate-900' : 'text-neutral-200'}`}>{weather.windSpeed} km/h</span>
              </div>
              <div className={`p-3 rounded-2xl ${insetClass}`}>
                <span className={`block text-[10px] uppercase ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>Sunset</span>
                <span className={`font-medium ${isLight ? 'text-slate-900' : 'text-neutral-200'}`}>{weather.sunset}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: Schedule & Priorities (Cols 5-8) */}
        <div className="col-span-4 flex flex-col space-y-6">
          {/* Today's Agenda */}
          <div className={`p-6 rounded-3xl ${cardClass} flex-1 flex flex-col min-h-0`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-xs uppercase font-bold tracking-wider ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                Today&apos;s Schedule
              </h3>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${insetClass} ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
                {events.length} Events
              </span>
            </div>
            <div className="space-y-3 overflow-y-auto pr-1 flex-1">
              {events.slice(0, 3).map((evt) => (
                <div key={evt.id} className={`p-3.5 rounded-2xl ${insetClass}`}>
                  <div className="flex items-center justify-between text-xs font-mono font-medium" style={{ color: 'var(--color-accent)' }}>
                    <span>{evt.startTime} — {evt.endTime}</span>
                    <span className="text-[10px] uppercase">{evt.category}</span>
                  </div>
                  <h4 className={`text-xs font-medium mt-1 truncate ${isLight ? 'text-slate-900' : 'text-neutral-200'}`}>{evt.title}</h4>
                  {evt.location && (
                    <p className={`text-[10px] mt-0.5 truncate ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>{evt.location}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Tasks */}
          <div className={`p-6 rounded-3xl ${cardClass} flex-1 flex flex-col min-h-0`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-xs uppercase font-bold tracking-wider ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                Priorities
              </h3>
              <span className="text-xs font-mono font-medium" style={{ color: 'var(--color-accent)' }}>
                {tasks.filter(t => t.completed).length}/{tasks.length} Done
              </span>
            </div>
            <div className="space-y-2 overflow-y-auto pr-1 flex-1">
              {tasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-2.5 rounded-2xl ${insetClass} flex items-center justify-between cursor-pointer group`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div style={{ color: 'var(--color-accent)' }}>
                      {task.completed ? <CheckCircle2 size={16} /> : <Circle size={16} className={isLight ? 'text-slate-400' : 'text-neutral-500'} />}
                    </div>
                    <span className={`text-xs truncate ${task.completed ? (isLight ? 'text-slate-400 line-through' : 'text-neutral-500 line-through') : (isLight ? 'text-slate-900' : 'text-neutral-200')}`}>
                      {task.title}
                    </span>
                  </div>
                  {task.dueTime && (
                    <span className={`text-[10px] font-mono shrink-0 ml-1 ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>
                      {task.dueTime}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Financial Markets & F1 Radar (Cols 9-12) */}
        <div className="col-span-4 flex flex-col space-y-6">
          {/* Financial Markets */}
          <div className={`p-6 rounded-3xl ${cardClass} flex-1 flex flex-col min-h-0`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-xs uppercase font-bold tracking-wider ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                Markets
              </h3>
              <span className="text-[10px] font-mono font-medium" style={{ color: 'var(--color-accent)' }}>Live</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {finance.map((item) => {
                const isUp = item.change >= 0;
                return (
                  <div key={item.id} className={`p-3 rounded-2xl ${insetClass} flex flex-col justify-between`}>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className={`font-bold truncate ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>{item.symbol}</span>
                      <span className={`font-mono text-[10px] font-bold ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {isUp ? '+' : ''}{item.changePercent.toFixed(1)}%
                      </span>
                    </div>
                    <div className={`text-xs font-bold mt-1 ${isLight ? 'text-slate-900' : 'text-neutral-200'}`}>{item.price}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top News Card */}
          <div className={`p-6 rounded-3xl cursor-pointer ${cardClass}`} onClick={() => setManualOverrideMode('news')}>
            <div className={`flex items-center justify-between mb-2 text-[10px] uppercase font-mono ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>
              <span className="font-bold">Top Headlines</span>
              <span className="text-emerald-500 font-bold">Live Feed</span>
            </div>
            {news.slice(0, 2).map((item, idx) => (
              <div key={item.id} className={idx > 0 ? 'mt-2.5 pt-2' : ''}>
                <div className="flex justify-between text-[10px] mb-0.5">
                  <span style={{ color: 'var(--color-accent)' }}>{item.source}</span>
                  <span className={isLight ? 'text-slate-500' : 'text-neutral-400'}>{item.time}</span>
                </div>
                <h4 className="text-xs font-bold truncate">{item.title}</h4>
                {(item.snippet || item.summary) && (
                  <p className={`text-[10px] mt-0.5 line-clamp-2 ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
                    {item.snippet || item.summary}
                  </p>
                )}
              </div>
            ))}
            <div className={`mt-3 p-2 rounded-2xl ${insetClass} text-center text-[10px] font-bold`} style={{ color: 'var(--color-accent)' }}>
              View All Headlines &rarr;
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
