import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { TuiBox } from './TuiBox';

export const TuiMorningMode: React.FC = () => {
  const { now, weather, aqi, events, tasks, toggleTask, finance, news, setManualOverrideMode, colorMode } = useDashboard();
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

  const aqiBar = (val: number, max: number = 300) => {
    const totalChars = 14;
    const filled = Math.min(totalChars, Math.round((val / max) * totalChars));
    return `[${'█'.repeat(filled)}${'░'.repeat(totalChars - filled)}]`;
  };

  return (
    <div className={`w-full h-full p-6 flex flex-col justify-between overflow-hidden bg-transparent font-mono select-none ${
      isLight ? 'text-slate-800' : 'text-gray-200'
    }`}>
      {/* 3-Column 1080p Grid */}
      <div className="grid grid-cols-12 gap-5 flex-1 min-h-0">
        {/* Left Column: Clock & Terminal Weather (Cols 1-4) */}
        <div className="col-span-4 flex flex-col space-y-4">
          {/* Big ASCII Clock Box */}
          <TuiBox title="SYSTEM_CLOCK" badge="IST UTC+5:30">
            <div className="flex flex-col items-center justify-center py-4">
              <div className={`text-6xl font-extrabold tracking-wider flex items-baseline ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                <span>{hours}:{minutes}</span>
                <span
                  className="text-2xl ml-2 animate-pulse font-mono-numbers"
                  style={{ color: 'var(--color-accent)' }}
                >
                  {seconds}
                </span>
              </div>
              <div
                className="mt-2 text-sm font-bold tracking-widest border-t pt-2 w-full text-center"
                style={{ color: 'var(--color-accent)', borderColor: 'var(--theme-accent-soft)' }}
              >
                {dateFormatted}
              </div>
              <div className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                SUNRISE: {weather.sunrise} | SUNSET: {weather.sunset}
              </div>
            </div>
          </TuiBox>

          {/* ASCII Weather Station */}
          <TuiBox title="METEOROLOGICAL_TELEMETRY" badge="OPEN-METEO" className="flex-1">
            <div className="space-y-3 pt-1 text-xs">
              <div className={`flex items-center justify-between pb-2 border-b ${
                isLight ? 'border-slate-200' : 'border-gray-800'
              }`}>
                <span className={isLight ? 'text-slate-500' : 'text-gray-400'}>TEMPERATURE:</span>
                <span className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {weather.temperature}°C ({weather.apparentTemperature}°C FEELS)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className={isLight ? 'text-slate-500' : 'text-gray-400'}>SKY_CONDITION:</span>
                <span className="font-bold uppercase" style={{ color: 'var(--color-accent)' }}>
                  {weather.condition}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className={isLight ? 'text-slate-500' : 'text-gray-400'}>PRECIP_PROB:</span>
                <span className="text-blue-500 font-bold">{weather.rainProbability}%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className={isLight ? 'text-slate-500' : 'text-gray-400'}>WIND_VELOCITY:</span>
                <span className={isLight ? 'text-slate-800' : 'text-gray-200'}>{weather.windSpeed} KM/H</span>
              </div>

              <div className="flex items-center justify-between">
                <span className={isLight ? 'text-slate-500' : 'text-gray-400'}>UV_RADIATION:</span>
                <span className="text-amber-500 font-bold">{weather.uvIndex} (INDEX)</span>
              </div>

              <div className={`pt-2 border-t ${isLight ? 'border-slate-200' : 'border-gray-800'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className={isLight ? 'text-slate-500' : 'text-gray-400'}>AIR_QUALITY (AQI):</span>
                  <span className="font-bold text-amber-500">{aqi.usAqi} [{aqi.label.toUpperCase()}]</span>
                </div>
                <div className="text-[11px] text-amber-600 tracking-wider font-mono">
                  {aqiBar(aqi.usAqi)} PM2.5: {aqi.pm25} | PM10: {aqi.pm10}
                </div>
              </div>
            </div>
          </TuiBox>
        </div>

        {/* Center Column: Calendar & Tasks (Cols 5-8) */}
        <div className="col-span-4 flex flex-col space-y-4">
          {/* Calendar Agenda */}
          <TuiBox title="TASKWARRIOR_AGENDA" badge={`${events.length} ENTRIES`} className="flex-1">
            <div className="space-y-2 overflow-y-auto max-h-[35vh] pr-1 text-xs">
              {events.map((evt, idx) => (
                <div
                  key={evt.id}
                  className="p-2 border transition-colors"
                  style={{
                    borderColor: 'var(--theme-accent-soft)',
                    backgroundColor: 'var(--theme-accent-soft)',
                  }}
                >
                  <div className="flex items-center justify-between font-bold" style={{ color: 'var(--color-accent)' }}>
                    <span>[{evt.startTime} - {evt.endTime}]</span>
                    <span className={`text-[10px] uppercase ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>#{idx + 1}</span>
                  </div>
                  <div className={`font-semibold mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>{evt.title}</div>
                  {evt.location && (
                    <div className={`text-[10px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>LOC: {evt.location}</div>
                  )}
                </div>
              ))}
            </div>
          </TuiBox>

          {/* Checklist */}
          <TuiBox title="CRITICAL_TODOS" badge="INTERACTIVE" className="flex-1">
            <div className="space-y-1.5 overflow-y-auto max-h-[30vh] pr-1 text-xs">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-1.5 cursor-pointer border transition-colors flex items-center space-x-2 ${
                    task.completed
                      ? (isLight ? 'border-slate-200 text-slate-400 bg-slate-100' : 'border-gray-800 text-gray-500 bg-black/40')
                      : (isLight ? 'text-slate-900 bg-black/[0.02]' : 'text-white bg-black/30')
                  }`}
                  style={task.completed ? undefined : {
                    borderColor: 'var(--theme-accent-soft)',
                  }}
                >
                  <span
                    className="font-bold"
                    style={{ color: task.completed ? '#94a3b8' : 'var(--color-accent)' }}
                  >
                    {task.completed ? '[X]' : '[ ]'}
                  </span>
                  <span className={`flex-1 truncate ${task.completed ? 'line-through' : ''}`}>
                    {task.title}
                  </span>
                  {task.priority === 'high' && (
                    <span className="text-[10px] text-red-500 font-bold uppercase">[HIGH]</span>
                  )}
                </div>
              ))}
            </div>
          </TuiBox>
        </div>

        {/* Right Column: Financial Markets & F1 Teaser (Cols 9-12) */}
        <div className="col-span-4 flex flex-col space-y-4">
          {/* Markets Monitor */}
          <TuiBox title="FINANCIAL_TELEGRAPH" badge="MARKET_OPEN" className="flex-1">
            <div className="space-y-2 text-xs">
              {finance.map((item) => {
                const isPos = item.change >= 0;
                return (
                  <div
                    key={item.id}
                    className={`p-2 border flex items-center justify-between ${
                      isLight ? 'border-slate-200 bg-black/[0.02]' : 'border-gray-800 bg-white/5'
                    }`}
                  >
                    <div>
                      <div className={`text-[10px] font-bold ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>{item.name}</div>
                      <div className={`font-extrabold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>{item.price}</div>
                    </div>
                    <div className={`text-right font-bold ${isPos ? 'text-emerald-500' : 'text-rose-500'}`}>
                      <div>{isPos ? '+' : ''}{item.changePercent.toFixed(2)}% {isPos ? '▲' : '▼'}</div>
                      <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>{isPos ? '+' : ''}{item.change}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TuiBox>

          {/* Global News Wire Box */}
          <TuiBox title="INTEL_NEWS_WIRE" badge="LIVE">
            <div className="space-y-2 text-xs cursor-pointer" onClick={() => setManualOverrideMode('news')}>
              {news.slice(0, 2).map((item) => (
                <div key={item.id} className={`p-1.5 border ${isLight ? 'bg-black/[0.03] border-black/15' : 'bg-white/5 border-white/10'}`}>
                  <div className="flex justify-between text-[10px] mb-0.5">
                    <span style={{ color: 'var(--color-accent)' }}>&gt; {item.source}</span>
                    <span className={isLight ? 'text-slate-500' : 'text-gray-400'}>{item.time}</span>
                  </div>
                  <div className="font-bold truncate">{item.title}</div>
                  {(item.snippet || item.summary) && (
                    <div className={`text-[10px] mt-0.5 line-clamp-2 ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                      {item.snippet || item.summary}
                    </div>
                  )}
                </div>
              ))}
              <div className="text-[10px] text-right font-bold pt-1" style={{ color: 'var(--color-accent)' }}>
                [EXPAND_FULL_DISPATCH &gt;&gt;]
              </div>
            </div>
          </TuiBox>
        </div>
      </div>
    </div>
  );
};
