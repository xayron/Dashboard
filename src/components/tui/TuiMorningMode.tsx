import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { TuiBox } from './TuiBox';

export const TuiMorningMode: React.FC = () => {
  const { now, weather, aqi, events, tasks, toggleTask, f1, finance } = useDashboard();

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
    <div className="w-full h-full p-6 flex flex-col justify-between overflow-hidden bg-black font-mono text-gray-200 select-none">
      {/* 3-Column 1080p Grid */}
      <div className="grid grid-cols-12 gap-5 flex-1 min-h-0">
        {/* Left Column: Clock & Terminal Weather (Cols 1-4) */}
        <div className="col-span-4 flex flex-col space-y-4">
          {/* Big ASCII Clock Box */}
          <TuiBox title="SYSTEM_CLOCK" badge="IST UTC+5:30">
            <div className="flex flex-col items-center justify-center py-4">
              <div className="text-6xl font-extrabold text-white tracking-wider flex items-baseline">
                <span>{hours}:{minutes}</span>
                <span className="text-2xl text-emerald-400 ml-2 animate-pulse">{seconds}</span>
              </div>
              <div className="mt-2 text-sm text-emerald-300/80 font-bold tracking-widest border-t border-emerald-500/30 pt-2 w-full text-center">
                {dateFormatted}
              </div>
              <div className="text-[11px] text-gray-400 mt-1">
                SUNRISE: {weather.sunrise} | SUNSET: {weather.sunset}
              </div>
            </div>
          </TuiBox>

          {/* ASCII Weather Station */}
          <TuiBox title="METEOROLOGICAL_TELEMETRY" badge="OPEN-METEO" className="flex-1">
            <div className="space-y-3 pt-1 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-gray-800">
                <span className="text-gray-400">TEMPERATURE:</span>
                <span className="text-xl font-bold text-white">{weather.temperature}°C ({weather.apparentTemperature}°C FEELS)</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400">SKY_CONDITION:</span>
                <span className="text-emerald-300 font-bold uppercase">{weather.condition}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400">PRECIP_PROB:</span>
                <span className="text-blue-400 font-bold">{weather.rainProbability}%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400">WIND_VELOCITY:</span>
                <span className="text-gray-200">{weather.windSpeed} KM/H</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400">UV_RADIATION:</span>
                <span className="text-amber-400 font-bold">{weather.uvIndex} (INDEX)</span>
              </div>

              <div className="pt-2 border-t border-gray-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-400">AIR_QUALITY (AQI):</span>
                  <span className="font-bold text-amber-400">{aqi.usAqi} [{aqi.label.toUpperCase()}]</span>
                </div>
                <div className="text-[11px] text-amber-500 tracking-wider font-mono">
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
                <div key={evt.id} className="p-2 border border-emerald-500/20 bg-emerald-950/20 hover:border-emerald-500/50">
                  <div className="flex items-center justify-between text-emerald-400 font-bold">
                    <span>[{evt.startTime} - {evt.endTime}]</span>
                    <span className="text-[10px] text-gray-400 uppercase">#{idx + 1}</span>
                  </div>
                  <div className="text-white font-semibold mt-0.5">{evt.title}</div>
                  {evt.location && (
                    <div className="text-[10px] text-gray-400 mt-0.5">LOC: {evt.location}</div>
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
                    task.completed ? 'border-gray-800 text-gray-500 bg-black' : 'border-emerald-500/30 text-white bg-emerald-950/10 hover:border-emerald-400'
                  }`}
                >
                  <span className={`font-bold ${task.completed ? 'text-gray-600' : 'text-emerald-400'}`}>
                    {task.completed ? '[X]' : '[ ]'}
                  </span>
                  <span className={`flex-1 truncate ${task.completed ? 'line-through' : ''}`}>
                    {task.title}
                  </span>
                  {task.priority === 'high' && (
                    <span className="text-[10px] text-red-400 font-bold uppercase">[HIGH]</span>
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
                  <div key={item.id} className="p-2 border border-gray-800 bg-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-gray-400 text-[10px] font-bold">{item.name}</div>
                      <div className="text-white font-extrabold text-sm">{item.price}</div>
                    </div>
                    <div className={`text-right font-bold ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                      <div>{isPos ? '+' : ''}{item.changePercent.toFixed(2)}% {isPos ? '▲' : '▼'}</div>
                      <div className="text-[10px] text-gray-500">{isPos ? '+' : ''}{item.change}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TuiBox>

          {/* F1 Radar Box */}
          <TuiBox title="F1_TELEMETRY_RADAR" badge={`RD ${f1.activeRound}/${f1.totalRounds}`}>
            <div className="space-y-2 text-xs">
              <div className="text-red-400 font-bold text-sm truncate">{f1.raceName}</div>
              <div className="text-gray-400 text-[11px]">{f1.circuitName} ({f1.country})</div>

              <div className="p-2 bg-red-950/20 border border-red-500/40 mt-2">
                <div className="text-[10px] text-gray-400 uppercase">NEXT_SESSION: {f1.nextSession.name}</div>
                <div className="text-white font-bold">{f1.nextSession.istTimeFormatted}</div>
                <div className="text-red-400 font-extrabold text-lg mt-1">
                  T-MINUS: {f1.nextSession.countdownFormatted}
                </div>
              </div>
            </div>
          </TuiBox>
        </div>
      </div>
    </div>
  );
};
