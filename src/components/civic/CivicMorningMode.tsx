import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Clock, Database, ArrowUpRight, ArrowDownRight, Wind, Droplets, Sun, Calendar, CheckSquare, CheckCircle2, CircleDashed, TrendingUp, Flag } from 'lucide-react';
import { AudioBanner } from '../common/AudioBanner';

export const CivicMorningMode: React.FC = () => {
  const { now, weather, aqi, events, tasks, toggleTask, f1, finance, media, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const dateFormatted = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });

  const cardClass = isLight
    ? 'bg-white border border-slate-300 rounded-xl shadow-sm text-slate-900'
    : 'bg-slate-900/90 border border-slate-700 rounded-xl shadow-md text-slate-100';

  const innerClass = isLight
    ? 'bg-slate-50 border border-slate-200 rounded-lg text-slate-900'
    : 'bg-slate-800/80 border border-slate-700/80 rounded-lg text-slate-100';

  const mutedClass = isLight ? 'text-slate-500' : 'text-slate-400';
  const borderDivider = isLight ? 'border-slate-100' : 'border-slate-800';

  return (
    <div className={`w-full h-full p-6 flex flex-col justify-between overflow-hidden bg-transparent select-none font-sans ${
      isLight ? 'text-slate-900' : 'text-slate-100'
    }`}>
      {/* Top Banner: Morning Briefing & Audio Banner */}
      <div className={`flex items-center justify-between mb-4 pb-3 border-b-2 ${isLight ? 'border-slate-300' : 'border-slate-700'}`}>
        <div className="flex items-center space-x-3">
          <div
            className={`p-2.5 rounded-lg shadow-sm ${isLight ? 'bg-slate-900 text-white' : 'bg-slate-800 text-white'}`}
            style={{ color: 'var(--color-accent, #f97316)' }}
          >
            <Clock size={20} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className={`text-xl font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                MORNING OVERVIEW
              </h1>
              <span
                className="px-2 py-0.5 text-[10px] font-mono font-bold rounded border"
                style={{
                  backgroundColor: 'var(--theme-accent-soft)',
                  color: 'var(--color-accent)',
                  borderColor: 'var(--color-accent)',
                }}
              >
                DAILY REPORT
              </span>
            </div>
            <p className={`text-xs font-mono mt-0.5 ${mutedClass}`}>
              SUNRISE AT {weather.sunrise} // SUNSET AT {weather.sunset} • EXPECTED HIGH {weather.highTemp}°C
            </p>
          </div>
        </div>

        {media.state === 'playing' && <AudioBanner compact={true} />}
      </div>

      {/* 3-Column 1080p Grid */}
      <div className="grid grid-cols-12 gap-5 flex-1 min-h-0">
        {/* Left Column: Clock & Weather (Cols 1-4) */}
        <div className="col-span-4 flex flex-col space-y-4">
          {/* Clock Card */}
          <div className={`p-5 ${cardClass} flex flex-col justify-between`}>
            <div className={`flex items-center justify-between border-b pb-2.5 text-xs font-mono ${borderDivider} ${mutedClass}`}>
              <span className={`flex items-center space-x-1.5 font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                <Clock size={14} style={{ color: 'var(--color-accent, #f97316)' }} />
                <span>CURRENT TIME</span>
              </span>
              <span
                className="text-[10px] px-2 py-0.5 rounded font-bold border"
                style={{
                  backgroundColor: 'var(--theme-accent-soft)',
                  color: 'var(--color-accent)',
                  borderColor: 'var(--color-accent)',
                }}
              >
                LIVE
              </span>
            </div>

            <div className="py-4 text-center">
              <div className={`text-6xl font-mono font-black tracking-tight flex items-baseline justify-center ${
                isLight ? 'text-slate-950' : 'text-white'
              }`}>
                <span>{hours}:{minutes}</span>
                <span className="text-2xl font-mono ml-2" style={{ color: 'var(--color-accent, #f97316)' }}>:{seconds}</span>
              </div>
              <div className={`text-xs font-bold mt-2 uppercase tracking-wide ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                {dateFormatted} • IST (UTC+05:30)
              </div>
            </div>

            <div className={`pt-2.5 border-t flex items-center justify-between text-[11px] font-mono ${borderDivider} ${mutedClass}`}>
              <span>SOLAR: {weather.sunrise} DAWN – {weather.sunset} DUSK</span>
              <span className="text-emerald-500 font-bold">ACCURATE</span>
            </div>
          </div>

          {/* Weather & Environmental Conditions Card */}
          <div className={`p-5 ${cardClass} flex-1 flex flex-col justify-between`}>
            <div className={`flex items-center justify-between border-b pb-2 text-xs font-mono ${borderDivider} ${mutedClass}`}>
              <span className={`flex items-center space-x-1.5 font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                <Database size={14} style={{ color: 'var(--color-accent, #f97316)' }} />
                <span>WEATHER &amp; ENVIRONMENT</span>
              </span>
              <span className="text-[10px] font-semibold">{weather.condition.toUpperCase()}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 my-2">
              <div className={`p-3 ${innerClass}`}>
                <span className={`text-[10px] font-mono uppercase font-bold block ${mutedClass}`}>
                  Temperature
                </span>
                <div className={`text-3xl font-mono font-black mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {weather.temperature}°C
                </div>
                <span className={`text-[11px] block mt-0.5 font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Feels like {weather.apparentTemperature}°C
                </span>
              </div>

              <div className={`p-3 rounded-lg border ${
                isLight
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-emerald-950/40 border-emerald-700/60 text-emerald-200'
              }`}>
                <span className="text-[10px] font-mono uppercase font-bold block opacity-80">
                  Air Quality Index
                </span>
                <div className={`text-3xl font-mono font-black mt-0.5 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                  {aqi.usAqi}
                </div>
                <span className="text-[11px] font-bold block mt-0.5 uppercase">
                  {aqi.label}
                </span>
              </div>
            </div>

            <div className={`grid grid-cols-3 gap-2 text-[11px] font-mono border-t pt-2 ${borderDivider} ${mutedClass}`}>
              <div className="flex items-center space-x-1">
                <Wind size={13} />
                <span>{weather.windSpeed} km/h</span>
              </div>
              <div className="flex items-center space-x-1">
                <Droplets size={13} className="text-blue-500" />
                <span>{weather.humidity}% RH</span>
              </div>
              <div className="flex items-center space-x-1">
                <Sun size={13} className="text-amber-500" />
                <span>UV {weather.uvIndex} INDEX</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: Today's Schedule & Tasks (Cols 5-8) */}
        <div className="col-span-4 flex flex-col space-y-4">
          {/* Today's Schedule */}
          <div className={`p-5 ${cardClass} flex-1 flex flex-col justify-between`}>
            <div className={`flex items-center justify-between border-b pb-2 text-xs font-mono ${borderDivider} ${mutedClass}`}>
              <span className={`flex items-center space-x-1.5 font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                <Calendar size={14} style={{ color: 'var(--color-accent, #f97316)' }} />
                <span>TODAY&apos;S SCHEDULE</span>
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${isLight ? 'bg-slate-100 text-slate-600' : 'bg-slate-800 text-slate-300'}`}>
                {events.length} UPCOMING
              </span>
            </div>

            <div className="space-y-2.5 overflow-y-auto max-h-[220px] my-2 pr-1 font-mono">
              {events.length === 0 ? (
                <div className={`text-xs py-6 text-center italic ${mutedClass}`}>No events scheduled for today</div>
              ) : (
                events.map((ev) => (
                  <div
                    key={ev.id}
                    className={`p-3 ${innerClass} flex items-center justify-between`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className={`text-xs font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{ev.title}</div>
                      <div className={`text-[10px] mt-0.5 flex items-center space-x-2 ${mutedClass}`}>
                        <span>{ev.startTime} – {ev.endTime}</span>
                        {ev.location && <span>• {ev.location}</span>}
                      </div>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 font-bold uppercase rounded border"
                      style={{
                        backgroundColor: 'var(--theme-accent-soft)',
                        borderColor: 'var(--color-accent)',
                        color: 'var(--color-accent)',
                      }}
                    >
                      CALENDAR
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className={`pt-2 border-t flex items-center justify-between text-[11px] font-mono ${borderDivider} ${mutedClass}`}>
              <span>GOOGLE CALENDAR</span>
              <span className="text-emerald-500 font-bold">SYNCED</span>
            </div>
          </div>

          {/* Tasks & To-Dos */}
          <div className={`p-5 ${cardClass} flex-1 flex flex-col justify-between`}>
            <div className={`flex items-center justify-between border-b pb-2 text-xs font-mono ${borderDivider} ${mutedClass}`}>
              <span className={`flex items-center space-x-1.5 font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                <CheckSquare size={14} style={{ color: 'var(--color-accent, #f97316)' }} />
                <span>TASKS &amp; TO-DOS</span>
              </span>
              <span
                className="text-[10px] px-2 py-0.5 rounded font-bold border"
                style={{
                  backgroundColor: 'var(--theme-accent-soft)',
                  borderColor: 'var(--color-accent)',
                  color: 'var(--color-accent)',
                }}
              >
                {tasks.filter(t => !t.completed).length} PENDING
              </span>
            </div>

            <div className="space-y-2 overflow-y-auto max-h-[220px] my-2 pr-1 font-mono">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-2.5 border rounded-lg transition-all cursor-pointer flex items-center justify-between ${
                    task.completed
                      ? isLight ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-slate-800/40 border-slate-800 opacity-50'
                      : innerClass
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                    {task.completed ? (
                      <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                    ) : (
                      <CircleDashed size={15} style={{ color: 'var(--color-accent, #f97316)' }} className="shrink-0" />
                    )}
                    <span className={`text-xs truncate font-medium ${task.completed ? 'line-through text-slate-400' : (isLight ? 'text-slate-800' : 'text-slate-200')}`}>
                      {task.title}
                    </span>
                  </div>
                  {task.dueTime && (
                    <span className={`text-[10px] font-bold shrink-0 ${mutedClass}`}>
                      [{task.dueTime}]
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className={`pt-2 border-t flex items-center justify-between text-[11px] font-mono ${borderDivider} ${mutedClass}`}>
              <span>GOOGLE TASKS</span>
              <span>TAP TO COMPLETE</span>
            </div>
          </div>
        </div>

        {/* Right Column: Market Watch & Formula 1 (Cols 9-12) */}
        <div className="col-span-4 flex flex-col space-y-4">
          {/* Market Watch */}
          <div className={`p-5 ${cardClass} flex-1 flex flex-col justify-between`}>
            <div className={`flex items-center justify-between border-b pb-2 text-xs font-mono ${borderDivider} ${mutedClass}`}>
              <span className={`flex items-center space-x-1.5 font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                <TrendingUp size={14} style={{ color: 'var(--color-accent, #f97316)' }} />
                <span>MARKET WATCH</span>
              </span>
              <span
                className="text-[10px] px-2 py-0.5 rounded font-bold border"
                style={{
                  backgroundColor: 'var(--theme-accent-soft)',
                  borderColor: 'var(--color-accent)',
                  color: 'var(--color-accent)',
                }}
              >
                LIVE QUOTES
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 my-2 font-mono">
              {finance.map((item) => {
                const isUp = item.change >= 0;
                return (
                  <div
                    key={item.id}
                    className={`p-3 ${innerClass} flex flex-col justify-between`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className={`font-bold ${mutedClass}`}>{item.symbol}</span>
                      <span className={`text-[10px] font-bold flex items-center ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                        {isUp ? <ArrowUpRight size={12} className="mr-0.5" /> : <ArrowDownRight size={12} className="mr-0.5" />}
                        {Math.abs(item.changePercent).toFixed(2)}%
                      </span>
                    </div>
                    <div className={`text-base font-black mt-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {item.price}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={`pt-2 border-t flex items-center justify-between text-[11px] font-mono ${borderDivider} ${mutedClass}`}>
              <span>NSE / NASDAQ / LSE</span>
              <span className="text-emerald-500 font-bold">REAL-TIME</span>
            </div>
          </div>

          {/* Formula 1 */}
          <div className={`p-5 ${cardClass} flex flex-col justify-between`}>
            <div className={`flex items-center justify-between border-b pb-2 text-xs font-mono ${borderDivider} ${mutedClass}`}>
              <span className={`flex items-center space-x-1.5 font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                <Flag size={14} style={{ color: 'var(--color-accent, #f97316)' }} />
                <span>FORMULA 1</span>
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                isLight ? 'bg-slate-100 text-slate-700 border-slate-300' : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}>
                ROUND {f1.activeRound} OF {f1.totalRounds}
              </span>
            </div>

            <div className="my-2 space-y-2 font-mono">
              <div>
                <h4 className={`text-sm font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{f1.raceName}</h4>
                <p className={`text-xs truncate mt-0.5 ${mutedClass}`}>{f1.circuitName}</p>
              </div>

              <div className={`p-3 ${innerClass} flex items-center justify-between`}>
                <div>
                  <span className={`text-[10px] uppercase block font-bold ${mutedClass}`}>Target Session</span>
                  <span className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{f1.nextSession.name}</span>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] uppercase block font-bold ${mutedClass}`}>Countdown</span>
                  <span className="text-sm font-black" style={{ color: 'var(--color-accent, #f97316)' }}>
                    {f1.nextSession.countdownFormatted}
                  </span>
                </div>
              </div>
            </div>

            <div className={`pt-2 border-t flex items-center justify-between text-[11px] font-mono ${borderDivider} ${mutedClass}`}>
              <span>FIA OFFICIAL DATA STREAM</span>
              <span className="font-bold">UP TO DATE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
