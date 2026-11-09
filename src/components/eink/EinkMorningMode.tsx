import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { CheckSquare, Square, Feather } from 'lucide-react';
import { AudioBanner } from '../common/AudioBanner';

export const EinkMorningMode: React.FC = () => {
  const { now, weather, aqi, events, tasks, toggleTask, f1, finance, media, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  const dateFormatted = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className={`w-full h-full p-8 flex flex-col justify-between overflow-hidden bg-transparent font-serif select-none ${
      isLight ? 'text-[#1c1917]' : 'text-[#f5f2eb]'
    }`}>
      {/* Top Masthead & Audio Banner */}
      <div className={`flex items-center justify-between pb-3 mb-4 border-b-2 ${
        isLight ? 'border-stone-800' : 'border-stone-500'
      }`}>
        <div className="flex items-center space-x-3">
          <div
            className={`p-2 border-2 ${isLight ? 'bg-[#ede8df]' : 'bg-[#292524]'}`}
            style={{ borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}
          >
            <Feather size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight uppercase">Morning Dispatch &amp; Almanac</h1>
            <p className={`text-xs italic ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
              Dawn broke at {weather.sunrise} • Estimated high of <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>{weather.highTemp}°C</span> today
            </p>
          </div>
        </div>

        {media.state === 'playing' && (
          <AudioBanner
            compact={true}
            className={isLight ? 'bg-[#ede8df] border-stone-800 text-stone-900' : 'bg-[#292524] border-stone-500 text-stone-100'}
          />
        )}
      </div>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left Column: Clock & Almanac (Cols 1-4) */}
        <div className={`col-span-4 flex flex-col justify-between border-r-2 pr-6 ${
          isLight ? 'border-stone-300' : 'border-stone-700'
        }`}>
          <div className={`p-4 border-2 ${
            isLight
              ? 'border-stone-800 bg-[#ede8df] shadow-[2px_2px_0px_#1c1917]'
              : 'border-stone-500 bg-[#292524] shadow-[2px_2px_0px_#000]'
          }`}>
            <div
              className={`text-xs uppercase font-bold tracking-widest border-b pb-1 mb-2 ${
                isLight ? 'border-stone-400' : 'border-stone-600'
              }`}
              style={{ color: 'var(--color-accent)' }}
            >
              Current Timepiece // IST
            </div>
            <div className="text-6xl font-bold tracking-tight text-center py-1">
              {hours}:{minutes}
            </div>
            <div className={`text-xs text-center italic border-t pt-1.5 mt-2 ${
              isLight ? 'text-stone-600 border-stone-400' : 'text-stone-400 border-stone-600'
            }`}>
              {dateFormatted}
            </div>
          </div>

          <div className={`p-4 border-2 flex-1 mt-4 flex flex-col justify-between ${
            isLight
              ? 'border-stone-800 bg-[#ede8df] shadow-[2px_2px_0px_#1c1917]'
              : 'border-stone-500 bg-[#292524] shadow-[2px_2px_0px_#000]'
          }`}>
            <div className={`text-xs uppercase font-bold tracking-widest border-b pb-1 mb-2 ${
              isLight ? 'text-stone-600 border-stone-400' : 'text-stone-400 border-stone-600'
            }`}>
              Weather &amp; Atmosphere
            </div>
            <div className="space-y-2 text-xs">
              <div className={`flex justify-between border-b pb-1 ${isLight ? 'border-stone-300' : 'border-stone-700'}`}>
                <span>Observed Temp:</span>
                <strong style={{ color: 'var(--color-accent)' }}>{weather.temperature}°C ({weather.condition})</strong>
              </div>
              <div className={`flex justify-between border-b pb-1 ${isLight ? 'border-stone-300' : 'border-stone-700'}`}>
                <span>Apparent Feel:</span>
                <span>{weather.apparentTemperature}°C</span>
              </div>
              <div className={`flex justify-between border-b pb-1 ${isLight ? 'border-stone-300' : 'border-stone-700'}`}>
                <span>Air Purity:</span>
                <strong>AQI {aqi.usAqi} ({aqi.label})</strong>
              </div>
              <div className={`flex justify-between border-b pb-1 ${isLight ? 'border-stone-300' : 'border-stone-700'}`}>
                <span>Relative Humidity:</span>
                <span>{weather.humidity}%</span>
              </div>
              <div className="flex justify-between pt-0.5">
                <span>Solar Epilogue:</span>
                <span>Sunset at {weather.sunset}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: Registry of Engagements (Cols 5-8) */}
        <div className={`col-span-4 flex flex-col justify-between border-r-2 pr-6 ${
          isLight ? 'border-stone-300' : 'border-stone-700'
        }`}>
          {/* Engagements / Calendar */}
          <div className="flex-1 mb-4 flex flex-col min-h-0">
            <h3 className={`text-xs uppercase font-bold tracking-widest border-b-2 pb-1 mb-3 ${
              isLight ? 'text-stone-900 border-stone-800' : 'text-stone-100 border-stone-500'
            }`}>
              Registry of Engagements
            </h3>
            <div className="space-y-3 overflow-y-auto pr-1 flex-1">
              {events.slice(0, 3).map((evt) => (
                <div key={evt.id} className={`p-2.5 border ${
                  isLight ? 'border-stone-400 bg-[#ede8df]' : 'border-stone-600 bg-[#292524]'
                }`}>
                  <div className="flex items-center justify-between text-xs font-mono font-bold" style={{ color: 'var(--color-accent)' }}>
                    <span>{evt.startTime} — {evt.endTime}</span>
                    <span className="uppercase text-[10px]">{evt.category}</span>
                  </div>
                  <h4 className="text-xs font-bold mt-1 line-clamp-1">{evt.title}</h4>
                  {evt.location && (
                    <p className={`text-[10px] italic mt-0.5 ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>At: {evt.location}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Tasks */}
          <div className={`pt-3 border-t-2 ${isLight ? 'border-stone-800' : 'border-stone-500'}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs uppercase font-bold tracking-widest">
                Docket of Duties
              </h3>
              <span className="text-xs font-mono font-bold" style={{ color: 'var(--color-accent)' }}>
                {tasks.filter(t => t.completed).length} / {tasks.length} Resolved
              </span>
            </div>
            <div className="space-y-2 max-h-[26vh] overflow-y-auto pr-1">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className="flex items-start space-x-2 text-xs cursor-pointer group"
                >
                  <div className="mt-0.5 shrink-0" style={{ color: 'var(--color-accent)' }}>
                    {task.completed ? <CheckSquare size={14} /> : <Square size={14} />}
                  </div>
                  <span className={`leading-snug truncate ${
                    task.completed
                      ? isLight ? 'line-through text-stone-400' : 'line-through text-stone-500'
                      : ''
                  }`}>
                    {task.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Financial Gazette & Motorsport Almanac (Cols 9-12) */}
        <div className="col-span-4 flex flex-col justify-between">
          {/* Financial Markets */}
          <div className="flex-1 mb-4 flex flex-col min-h-0">
            <h3 className={`text-xs uppercase font-bold tracking-widest border-b-2 pb-1 mb-3 ${
              isLight ? 'text-stone-900 border-stone-800' : 'text-stone-100 border-stone-500'
            }`}>
              Bourse &amp; Indices
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              {finance.map((item) => {
                const isUp = item.change >= 0;
                return (
                  <div
                    key={item.id}
                    className={`p-2.5 border flex flex-col justify-between ${
                      isLight
                        ? 'border-stone-800 bg-[#ede8df] shadow-[2px_2px_0px_#1c1917]'
                        : 'border-stone-500 bg-[#292524] shadow-[2px_2px_0px_#000]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold truncate">{item.symbol}</span>
                      <span className="font-mono text-[10px] font-bold">
                        {isUp ? '+' : ''}{item.changePercent.toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-sm font-bold font-mono mt-1">{item.price}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* F1 Countdown Card */}
          <div className={`p-4 border-2 ${
            isLight
              ? 'border-stone-800 bg-[#ede8df] shadow-[2px_2px_0px_#1c1917]'
              : 'border-stone-500 bg-[#292524] shadow-[2px_2px_0px_#000]'
          }`}>
            <div className={`text-[10px] uppercase font-mono border-b pb-1 mb-2 ${
              isLight ? 'text-stone-600 border-stone-400' : 'text-stone-400 border-stone-600'
            }`}>
              Prix Automobile • Round {f1.activeRound}/{f1.totalRounds}
            </div>
            <h4 className="text-sm font-bold uppercase truncate" style={{ color: 'var(--color-accent)' }}>{f1.raceName}</h4>
            <p className={`text-xs italic ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>{f1.circuitName}</p>

            <div className={`mt-2.5 pt-2 border-t flex justify-between items-center text-xs ${
              isLight ? 'border-stone-400' : 'border-stone-600'
            }`}>
              <span>Next Trial: <strong>{f1.nextSession.name}</strong></span>
              <span className="font-mono font-bold" style={{ color: 'var(--color-accent)' }}>{f1.nextSession.countdownFormatted}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
