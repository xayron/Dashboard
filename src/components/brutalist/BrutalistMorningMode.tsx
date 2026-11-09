import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { BrutalistBox } from './BrutalistBox';
import { CheckSquare, Square, Sunrise, Coffee } from 'lucide-react';
import { AudioBanner } from '../common/AudioBanner';

export const BrutalistMorningMode: React.FC = () => {
  const { now, weather, aqi, events, tasks, toggleTask, finance, media, news, setManualOverrideMode, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const dateFormatted = now.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).toUpperCase();

  return (
    <div className={`w-full h-full p-6 flex flex-col justify-between overflow-hidden bg-transparent select-none ${isLight ? 'text-black' : 'text-white'}`}>
      {/* Top Bar: Morning Header & Audio Banner */}
      <div className={`flex items-center justify-between mb-4 pb-3 border-b-2 ${isLight ? 'border-black/30' : 'border-white/40'}`}>
        <div className="flex items-center space-x-3">
          <div
            className={`p-2 text-black border-2 border-black ${isLight ? 'shadow-[3px_3px_0px_#000]' : 'shadow-[3px_3px_0px_#fff]'}`}
            style={{ backgroundColor: 'var(--color-accent, #facc15)' }}
          >
            <Coffee size={20} />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight flex items-center">
              MORNING BRIEFING
              <span
                className={`ml-2 px-2 py-0.5 text-black text-[10px] font-black border border-black ${isLight ? 'shadow-[2px_2px_0px_#000]' : 'shadow-[2px_2px_0px_#fff]'}`}
                style={{ backgroundColor: 'var(--color-accent, #facc15)' }}
              >
                DAILY DOSSIER
              </span>
            </h1>
            <p className={`text-xs font-bold flex items-center mt-0.5 uppercase ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
              <Sunrise size={12} className="mr-1" style={{ color: 'var(--color-accent, #facc15)' }} />
              Sunrise at {weather.sunrise} • Target high {weather.highTemp}°C
            </p>
          </div>
        </div>

        {media.state === 'playing' && <AudioBanner compact={true} />}
      </div>

      {/* 3-Column 1080p Grid */}
      <div className="grid grid-cols-12 gap-5 flex-1 min-h-0">
        {/* Left Column: Clock & Meteo (Cols 1-4) */}
        <div className="col-span-4 flex flex-col space-y-4">
          <BrutalistBox
            title="CLOCK"
            badge="IST +05:30"
            badgeColor="bg-cyan-400 text-black"
            shadowColor={isLight ? 'shadow-[5px_5px_0px_#000]' : 'shadow-[5px_5px_0px_#00f0ff]'}
          >
            <div className="py-2 text-center">
              <div className="text-6xl font-black tracking-tight flex items-baseline justify-center">
                <span>{hours}:{minutes}</span>
                <span className="text-2xl ml-2 font-mono" style={{ color: 'var(--color-accent, #facc15)' }}>:{seconds}</span>
              </div>
              <div className={`mt-2 py-1 font-black text-xs uppercase tracking-widest border border-black ${
                isLight ? 'bg-black text-white shadow-[2px_2px_0px_#555]' : 'bg-white text-black shadow-[2px_2px_0px_#000]'
              }`}>
                {dateFormatted}
              </div>
            </div>
          </BrutalistBox>

          <BrutalistBox
            title="METEO"
            badge={`${weather.temperature}°C`}
            badgeColor="bg-yellow-400 text-black"
            className="flex-1"
          >
            <div className="space-y-2 pt-1 text-xs font-bold">
              <div className={`flex justify-between items-center p-2 border ${
                isLight ? 'bg-neutral-100 border-black/20 text-black' : 'bg-neutral-900 border-white/20 text-white'
              }`}>
                <span className={isLight ? 'text-neutral-600 uppercase' : 'text-neutral-400 uppercase'}>CONDITION:</span>
                <span className="uppercase" style={{ color: 'var(--color-accent)' }}>{weather.condition}</span>
              </div>
              <div className={`flex justify-between items-center p-2 border ${
                isLight ? 'bg-neutral-100 border-black/20 text-black' : 'bg-neutral-900 border-white/20 text-white'
              }`}>
                <span className={isLight ? 'text-neutral-600 uppercase' : 'text-neutral-400 uppercase'}>FEELS LIKE:</span>
                <span>{weather.apparentTemperature}°C</span>
              </div>
              <div className={`flex justify-between items-center p-2 border ${
                isLight ? 'bg-neutral-100 border-black/20 text-black' : 'bg-neutral-900 border-white/20 text-white'
              }`}>
                <span className={isLight ? 'text-neutral-600 uppercase' : 'text-neutral-400 uppercase'}>AIR QUALITY:</span>
                <span className="font-black" style={{ color: 'var(--color-accent)' }}>AQI {aqi.usAqi} • {aqi.label.toUpperCase()}</span>
              </div>
              <div className={`flex justify-between items-center p-2 border ${
                isLight ? 'bg-neutral-100 border-black/20 text-black' : 'bg-neutral-900 border-white/20 text-white'
              }`}>
                <span className={isLight ? 'text-neutral-600 uppercase' : 'text-neutral-400 uppercase'}>SUNRISE / SET:</span>
                <span>{weather.sunrise} / {weather.sunset}</span>
              </div>
            </div>
          </BrutalistBox>
        </div>

        {/* Center Column: Agenda & Tasks (Cols 5-8) */}
        <div className="col-span-4 flex flex-col space-y-4">
          <BrutalistBox
            title="SCHEDULE"
            badge={`${events.length} EVENTS`}
            badgeColor="bg-fuchsia-400 text-black"
            shadowColor={isLight ? 'shadow-[5px_5px_0px_#000]' : 'shadow-[5px_5px_0px_#e879f9]'}
            className="flex-1"
          >
            <div className="space-y-2 overflow-y-auto max-h-[30vh] pr-1">
              {events.slice(0, 4).map((evt) => (
                <div
                  key={evt.id}
                  className={`p-2.5 border-2 ${
                    isLight
                      ? 'bg-neutral-100 border-black shadow-[2px_2px_0px_#000] text-black'
                      : 'bg-neutral-900 border-white/80 shadow-[2px_2px_0px_#fff] text-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-black uppercase" style={{ color: 'var(--color-accent)' }}>
                    <span>{evt.startTime} — {evt.endTime}</span>
                    <span className={`px-1.5 py-0.2 font-bold text-[9px] uppercase ${isLight ? 'bg-black text-white' : 'bg-white text-black'}`}>
                      {evt.category}
                    </span>
                  </div>
                  <h4 className="text-xs font-black mt-0.5 truncate">{evt.title}</h4>
                  {evt.location && (
                    <p className={`text-[10px] mt-0.5 truncate uppercase ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>📍 {evt.location}</p>
                  )}
                </div>
              ))}
            </div>
          </BrutalistBox>

          <BrutalistBox
            title="ACTION ITEMS"
            badge={`${tasks.filter(t => !t.completed).length} PENDING`}
            badgeColor="bg-lime-400 text-black"
            shadowColor={isLight ? 'shadow-[5px_5px_0px_#000]' : 'shadow-[5px_5px_0px_#a3e635]'}
            className="flex-1"
          >
            <div className="space-y-2 overflow-y-auto max-h-[28vh] pr-1">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-2 border-2 cursor-pointer flex items-center justify-between transition-all ${
                    task.completed
                      ? isLight
                        ? 'bg-neutral-200 border-neutral-400 text-neutral-500 line-through'
                        : 'bg-neutral-900/60 border-neutral-700 text-neutral-500 line-through'
                      : isLight
                        ? 'bg-white border-black shadow-[2px_2px_0px_#000] text-black hover:translate-x-0.5'
                        : 'bg-black border-white shadow-[2px_2px_0px_#fff] text-white hover:translate-x-0.5'
                  }`}
                >
                  <div className="flex items-center space-x-2 min-w-0">
                    {task.completed ? (
                      <CheckSquare size={14} className="shrink-0" style={{ color: 'var(--color-accent)' }} />
                    ) : (
                      <Square size={14} className="shrink-0" style={{ color: 'var(--color-accent)' }} />
                    )}
                    <span className="text-xs font-bold truncate">{task.title}</span>
                  </div>
                  {task.dueTime && (
                    <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 shrink-0 ml-1 ${
                      isLight ? 'bg-neutral-200 text-black' : 'bg-neutral-800 text-neutral-300'
                    }`}>
                      {task.dueTime}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </BrutalistBox>
        </div>

        {/* Right Column: Markets & F1 Radar (Cols 9-12) */}
        <div className="col-span-4 flex flex-col space-y-4">
          <BrutalistBox
            title="MARKETS AT OPEN"
            badge="LIVE FEEDS"
            badgeColor="bg-lime-400 text-black"
            className="flex-1"
          >
            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              {finance.map((item) => {
                const isUp = item.change >= 0;
                return (
                  <div
                    key={item.id}
                    className={`p-2 border-2 flex flex-col justify-between ${
                      isLight
                        ? 'bg-white border-black shadow-[2px_2px_0px_#000] text-black'
                        : 'bg-neutral-900 border-white/60 shadow-[2px_2px_0px_#fff] text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black uppercase truncate ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>{item.symbol}</span>
                      <span
                        className={`text-[10px] font-black flex items-center ${
                          isUp ? 'text-lime-600 dark:text-lime-400' : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {isUp ? '+' : ''}{item.changePercent.toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-sm font-black mt-1">{item.price}</div>
                  </div>
                );
              })}
            </div>
          </BrutalistBox>

          <BrutalistBox
            title="TOP HEADLINES"
            badge="LIVE NEWS"
            badgeColor="bg-black text-white"
            shadowColor={isLight ? 'shadow-[5px_5px_0px_#000]' : 'shadow-[5px_5px_0px_#facc15]'}
          >
            <div className="space-y-2 pt-1 text-xs cursor-pointer" onClick={() => setManualOverrideMode('news')}>
              {news.slice(0, 3).map((item) => (
                <div key={item.id} className={`p-2 border-2 ${
                  isLight ? 'bg-white border-black shadow-[2px_2px_0px_#000]' : 'bg-neutral-900 border-white shadow-[2px_2px_0px_#fff]'
                }`}>
                  <div className="flex items-center justify-between text-[9px] font-black uppercase mb-0.5">
                    <span style={{ color: 'var(--color-accent)' }}>{item.source}</span>
                    <span className={isLight ? 'text-neutral-500' : 'text-neutral-400'}>{item.time}</span>
                  </div>
                  <p className="font-black line-clamp-1">{item.title}</p>
                  {(item.snippet || item.summary) && (
                    <p className={`text-[10px] mt-0.5 line-clamp-2 ${isLight ? 'text-neutral-600' : 'text-neutral-300'}`}>
                      {item.snippet || item.summary}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </BrutalistBox>
        </div>
      </div>
    </div>
  );
};
