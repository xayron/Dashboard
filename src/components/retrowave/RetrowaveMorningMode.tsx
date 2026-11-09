import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Check, Sunrise, Sparkles } from 'lucide-react';
import { AudioBanner } from '../common/AudioBanner';

export const RetrowaveMorningMode: React.FC = () => {
  const { now, weather, aqi, events, tasks, toggleTask, finance, media, news, setManualOverrideMode, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const dateFormatted = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).toUpperCase();

  return (
    <div className={`relative w-full h-full p-6 flex flex-col justify-between overflow-hidden bg-transparent select-none ${
      isLight ? 'text-pink-950' : 'text-pink-100'
    }`}>
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
      <div
        className="relative z-10 flex items-center justify-between mb-4 pb-3 border-b"
        style={{ borderColor: 'var(--theme-accent-soft)' }}
      >
        <div className="flex items-center space-x-3">
          <div
            className="p-2 rounded-xl bg-gradient-to-tr from-pink-600 to-amber-500 text-white shadow-md"
            style={{ boxShadow: isLight ? 'none' : '0 0 16px var(--color-accent)' }}
          >
            <Sunrise size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-black italic tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-pink-500 to-rose-500">
              MIAMI SUNRISE // 1984
            </h1>
            <p className={`text-xs font-bold flex items-center mt-0.5 tracking-wide ${isLight ? 'text-pink-700' : 'text-amber-300'}`}>
              <Sparkles size={12} className="mr-1" style={{ color: 'var(--color-accent)' }} />
              Dawn broke at {weather.sunrise} • Peak highway heat {weather.highTemp}°C
            </p>
          </div>
        </div>

        {media.state === 'playing' && (
          <AudioBanner
            compact={true}
            className={isLight ? 'bg-pink-100/90 border-pink-400 text-slate-900' : 'bg-[#24083d]/90 border-pink-500 text-white'}
          />
        )}
      </div>

      {/* 3-Column Grid */}
      <div className="relative z-10 grid grid-cols-12 gap-5 flex-1 min-h-0">
        {/* Left Column: Neon Sunset Clock & Weather (Cols 1-4) */}
        <div className="col-span-4 flex flex-col space-y-4">
          <div
            className={`p-5 rounded-2xl border-2 flex flex-col items-center ${
              isLight
                ? 'bg-pink-50/90 border-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.18)]'
                : 'bg-[#1d0633]/90'
            }`}
            style={{
              borderColor: 'var(--color-accent)',
              boxShadow: isLight ? undefined : '0 0 25px var(--theme-accent-soft)',
            }}
          >
            <span className={`text-[10px] font-black italic uppercase tracking-widest mb-1 ${
              isLight ? 'text-pink-800' : 'text-amber-300'
            }`}>
              PACIFIC TIMEWAY // IST
            </span>
            <div className="text-6xl font-black italic tracking-wider flex items-baseline justify-center">
              <span className={`text-transparent bg-clip-text ${
                isLight
                  ? 'bg-gradient-to-b from-pink-900 via-pink-600 to-amber-600'
                  : 'bg-gradient-to-b from-white via-amber-200 to-pink-500 drop-shadow-[0_0_15px_rgba(255,0,127,0.6)]'
              }`}>
                {hours}:{minutes}
              </span>
              <span className="text-2xl ml-2 animate-pulse font-mono" style={{ color: 'var(--color-accent)' }}>
                :{seconds}
              </span>
            </div>
            <div
              className="text-xs font-black italic mt-2 border-t pt-2 w-full text-center tracking-widest"
              style={{ color: 'var(--color-accent)', borderColor: 'var(--theme-accent-soft)' }}
            >
              {dateFormatted}
            </div>
          </div>

          <div
            className={`p-4 rounded-2xl border-2 flex-1 flex flex-col justify-between text-xs ${
              isLight
                ? 'bg-pink-50/90 border-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.18)]'
                : 'bg-[#1d0633]/90'
            }`}
            style={{
              borderColor: 'var(--color-accent)',
              boxShadow: isLight ? undefined : '0 0 20px var(--theme-accent-soft)',
            }}
          >
            <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: 'var(--theme-accent-soft)' }}>
              <span className={`text-[10px] font-black uppercase tracking-wider ${isLight ? 'text-pink-800' : 'text-amber-300'}`}>Atmosphere // Miami</span>
              <span className="font-black text-sm" style={{ color: 'var(--color-accent)' }}>{weather.temperature}°C</span>
            </div>
            <div className="space-y-2 pt-2 font-bold text-xs">
              <div className={`flex justify-between border-b pb-1 ${isLight ? 'border-pink-200' : 'border-white/10'}`}>
                <span className={isLight ? 'text-slate-600 uppercase' : 'text-pink-300/70 uppercase'}>Condition:</span>
                <span className={`uppercase font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{weather.condition}</span>
              </div>
              <div className={`flex justify-between border-b pb-1 ${isLight ? 'border-pink-200' : 'border-white/10'}`}>
                <span className={isLight ? 'text-slate-600 uppercase' : 'text-pink-300/70 uppercase'}>Heat Index:</span>
                <span className={isLight ? 'text-amber-700' : 'text-amber-300'}>{weather.apparentTemperature}°C</span>
              </div>
              <div className={`flex justify-between border-b pb-1 ${isLight ? 'border-pink-200' : 'border-white/10'}`}>
                <span className={isLight ? 'text-slate-600 uppercase' : 'text-pink-300/70 uppercase'}>Air Purity:</span>
                <span className={isLight ? 'text-emerald-700 font-bold' : 'text-emerald-400 font-bold'}>AQI {aqi.usAqi} ({aqi.label.toUpperCase()})</span>
              </div>
              <div className="flex justify-between">
                <span className={isLight ? 'text-slate-600 uppercase' : 'text-pink-300/70 uppercase'}>Sunset Drive:</span>
                <span className={`font-black ${isLight ? 'text-amber-700' : 'text-amber-400'}`}>{weather.sunset}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: Neon Schedule & Directives (Cols 5-8) */}
        <div className="col-span-4 flex flex-col space-y-4">
          <div
            className={`p-4 rounded-2xl border-2 flex-1 flex flex-col min-h-0 ${
              isLight
                ? 'bg-pink-50/90 border-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.18)]'
                : 'bg-[#1d0633]/90'
            }`}
            style={{
              borderColor: 'var(--color-accent)',
              boxShadow: isLight ? undefined : '0 0 20px var(--theme-accent-soft)',
            }}
          >
            <div className="flex items-center justify-between border-b pb-2 mb-3" style={{ borderColor: 'var(--theme-accent-soft)' }}>
              <span className={`text-[10px] font-black uppercase tracking-widest ${isLight ? 'text-pink-800' : 'text-amber-300'}`}>
                SYNTH-SCHEDULE // {events.length} STOPS
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-black text-black" style={{ backgroundColor: 'var(--color-accent)' }}>
                ACTIVE
              </span>
            </div>
            <div className="space-y-2 overflow-y-auto max-h-[28vh] pr-1">
              {events.slice(0, 4).map((evt) => (
                <div
                  key={evt.id}
                  className={`p-2.5 rounded-xl border ${
                    isLight ? 'bg-white/80 border-pink-300 text-slate-900' : 'bg-[#120320] border-pink-500/30 text-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-black" style={{ color: 'var(--color-accent)' }}>
                    <span>{evt.startTime} — {evt.endTime}</span>
                    <span className="text-[9px] uppercase tracking-wider">{evt.category}</span>
                  </div>
                  <h4 className="text-xs font-black mt-0.5 truncate">{evt.title}</h4>
                  {evt.location && (
                    <p className={`text-[10px] mt-0.5 truncate ${isLight ? 'text-slate-600' : 'text-pink-300/70'}`}>📍 {evt.location}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div
            className={`p-4 rounded-2xl border-2 flex-1 flex flex-col min-h-0 ${
              isLight
                ? 'bg-pink-50/90 border-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.18)]'
                : 'bg-[#1d0633]/90'
            }`}
            style={{
              borderColor: 'var(--color-accent)',
              boxShadow: isLight ? undefined : '0 0 20px var(--theme-accent-soft)',
            }}
          >
            <div className="flex items-center justify-between border-b pb-2 mb-2" style={{ borderColor: 'var(--theme-accent-soft)' }}>
              <span className={`text-[10px] font-black uppercase tracking-widest ${isLight ? 'text-pink-800' : 'text-amber-300'}`}>
                MISSIONS &amp; DRIFT
              </span>
              <span className="text-[10px] font-mono font-bold" style={{ color: 'var(--color-accent)' }}>
                {tasks.filter(t => !t.completed).length} REMAINING
              </span>
            </div>
            <div className="space-y-1.5 overflow-y-auto max-h-[26vh] pr-1">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-2 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                    task.completed
                      ? isLight
                        ? 'bg-pink-100/60 border-pink-200 text-slate-400 line-through'
                        : 'bg-black/40 border-pink-900/60 text-pink-400/40 line-through'
                      : isLight
                        ? 'bg-white/80 border-pink-300 text-slate-900'
                        : 'bg-[#120320] border-pink-500/40 text-pink-100'
                  }`}
                >
                  <div className="flex items-center space-x-2 min-w-0">
                    <div
                      className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 border ${
                        task.completed ? 'text-black' : 'border-pink-400'
                      }`}
                      style={task.completed ? { backgroundColor: 'var(--color-accent)' } : undefined}
                    >
                      {task.completed && <Check size={10} strokeWidth={3} />}
                    </div>
                    <span className="text-xs font-bold truncate">{task.title}</span>
                  </div>
                  {task.dueTime && (
                    <span className="text-[9px] font-mono font-bold shrink-0 ml-1" style={{ color: 'var(--color-accent)' }}>
                      {task.dueTime}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Neon Ticker & Grand Prix (Cols 9-12) */}
        <div className="col-span-4 flex flex-col space-y-4">
          <div
            className={`p-4 rounded-2xl border-2 flex-1 flex flex-col min-h-0 ${
              isLight
                ? 'bg-pink-50/90 border-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.18)]'
                : 'bg-[#1d0633]/90'
            }`}
            style={{
              borderColor: 'var(--color-accent)',
              boxShadow: isLight ? undefined : '0 0 20px var(--theme-accent-soft)',
            }}
          >
            <div className="flex items-center justify-between border-b pb-2 mb-2" style={{ borderColor: 'var(--theme-accent-soft)' }}>
              <span className={`text-[10px] font-black uppercase tracking-wider ${isLight ? 'text-pink-800' : 'text-amber-300'}`}>WALL STREET // 1984</span>
              <span className="text-[10px] font-mono font-bold" style={{ color: 'var(--color-accent)' }}>LIVE TICK</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              {finance.map((item) => {
                const isUp = item.change >= 0;
                return (
                  <div
                    key={item.id}
                    className={`p-2 rounded-xl border flex flex-col justify-between ${
                      isLight ? 'bg-white/80 border-pink-300 text-slate-900' : 'bg-[#120320] border-pink-500/30 text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className={`font-black truncate ${isLight ? 'text-slate-600' : 'text-pink-300'}`}>{item.symbol}</span>
                      <span className={`font-mono font-bold ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {isUp ? '+' : ''}{item.changePercent.toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-sm font-black font-mono mt-1">{item.price}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Neon News Wire */}
          <div
            onClick={() => setManualOverrideMode('news')}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
              isLight
                ? 'bg-pink-50/90 border-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.18)]'
                : 'bg-[#1d0633]/90'
            }`}
            style={{
              borderColor: 'var(--color-accent)',
              boxShadow: isLight ? undefined : '0 0 20px var(--theme-accent-soft)',
            }}
          >
            <div className="flex items-center justify-between text-[10px] uppercase font-bold border-b pb-1.5 mb-2" style={{ borderColor: 'var(--theme-accent-soft)' }}>
              <span className={isLight ? 'text-pink-800' : 'text-amber-300'}>SYNTH NEWS // BROADCAST</span>
              <span className="font-mono text-cyan-400 font-black">LIVE FEED</span>
            </div>
            {news.slice(0, 2).map((item, idx) => (
              <div key={item.id} className={idx > 0 ? 'mt-2 pt-1.5 border-t border-pink-500/20' : ''}>
                <div className="flex justify-between text-[10px] font-bold">
                  <span style={{ color: 'var(--color-accent)' }}>{item.source}</span>
                  <span className={isLight ? 'text-slate-500' : 'text-pink-300/70'}>{item.time}</span>
                </div>
                <h4 className="text-xs font-black uppercase truncate mt-0.5">{item.title}</h4>
                {(item.snippet || item.summary) && (
                  <p className={`text-[10px] mt-0.5 line-clamp-2 ${isLight ? 'text-pink-900/80' : 'text-pink-200/80'}`}>
                    {item.snippet || item.summary}
                  </p>
                )}
              </div>
            ))}
            <div className={`mt-2.5 pt-1.5 border-t flex items-center justify-between text-[10px] font-bold ${
              isLight ? 'border-pink-300 text-pink-700' : 'border-pink-500/30 text-pink-300'
            }`}>
              <span>GLOBAL REUTERS WIRE</span>
              <span className="text-cyan-400">VIEW DISPATCH &rarr;</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
