import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { HudBox } from './HudBox';
import { CheckCircle2, CircleDashed, Compass } from 'lucide-react';
import { AudioBanner } from '../common/AudioBanner';

export const HudMorningMode: React.FC = () => {
  const { now, weather, aqi, events, tasks, toggleTask, f1, finance, media, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const dateFormatted = now.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).toUpperCase();

  return (
    <div className={`w-full h-full p-6 flex flex-col justify-between overflow-hidden bg-transparent font-mono select-none ${
      isLight ? 'text-slate-900' : 'text-cyan-100'
    }`}>
      {/* Top Banner: Tactical Briefing & Audio Banner */}
      <div
        className="flex items-center justify-between mb-4 pb-3 border-b"
        style={{ borderColor: 'var(--theme-accent-soft)' }}
      >
        <div className="flex items-center space-x-3">
          <div
            className="p-2 border"
            style={{
              backgroundColor: 'var(--theme-accent-soft)',
              borderColor: 'var(--color-accent)',
              color: 'var(--color-accent)',
            }}
          >
            <Compass size={18} className="animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className={`text-lg font-black tracking-widest ${isLight ? 'text-slate-900' : 'text-white'}`}>TACTICAL_MORNING_BRIEF</h1>
              <span
                className="px-2 py-0.5 text-[9px] border font-bold"
                style={{
                  backgroundColor: 'var(--theme-accent-soft)',
                  borderColor: 'var(--color-accent)',
                  color: 'var(--color-accent)',
                }}
              >
                STATUS://OPTIMAL
              </span>
            </div>
            <p className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
              SOLAR_CYCLE: DAWN {weather.sunrise} // PEAK_THERMAL {weather.highTemp}°C
            </p>
          </div>
        </div>

        {media.state === 'playing' && <AudioBanner compact={true} />}
      </div>

      {/* 3-Column 1080p Grid */}
      <div className="grid grid-cols-12 gap-5 flex-1 min-h-0">
        {/* Left Column: Chrono & Atmospheric Sensors (Cols 1-4) */}
        <div className="col-span-4 flex flex-col space-y-4">
          <HudBox title="CHRONO_TELEMETRY" code="SYNC//GPS" glowColor="cyan">
            <div className="flex flex-col items-center justify-center py-2">
              <div className="text-6xl font-black tracking-widest flex items-baseline">
                <span
                  style={{
                    color: 'var(--color-accent)',
                    textShadow: isLight ? 'none' : '0 0 16px var(--color-glow)',
                  }}
                >
                  {hours}:{minutes}
                </span>
                <span className="text-2xl ml-2 animate-pulse" style={{ color: 'var(--color-accent)' }}>
                  :{seconds}
                </span>
              </div>
              <div
                className="text-xs font-bold mt-2 tracking-widest border-t pt-1.5 w-full text-center"
                style={{ color: 'var(--color-accent)', borderColor: 'var(--theme-accent-soft)' }}
              >
                DATE: {dateFormatted}
              </div>
            </div>
          </HudBox>

          <HudBox title="ATMOSPHERIC_SENSORS" code="LOC://SURFACE" glowColor="cyan" className="flex-1">
            <div className="space-y-2 pt-1 text-xs">
              <div
                className="flex justify-between items-center p-2 border"
                style={{ backgroundColor: 'var(--theme-accent-soft)', borderColor: 'var(--theme-accent-soft)' }}
              >
                <span className={isLight ? 'text-slate-600' : 'text-gray-400'}>TEMPERATURE:</span>
                <span className="font-bold" style={{ color: 'var(--color-accent)' }}>
                  {weather.temperature}°C (FEEL: {weather.apparentTemperature}°C)
                </span>
              </div>
              <div
                className={`flex justify-between items-center p-2 border ${
                  isLight ? 'bg-cyan-50/50 border-cyan-200/50' : 'bg-black/30'
                }`}
                style={{ borderColor: 'var(--theme-accent-soft)' }}
              >
                <span className={isLight ? 'text-slate-600' : 'text-gray-400'}>ATMOSPHERE:</span>
                <span className={`font-bold uppercase ${isLight ? 'text-slate-900' : 'text-white'}`}>{weather.condition}</span>
              </div>
              <div
                className={`flex justify-between items-center p-2 border ${
                  isLight ? 'bg-cyan-50/50 border-cyan-200/50' : 'bg-black/30'
                }`}
                style={{ borderColor: 'var(--theme-accent-soft)' }}
              >
                <span className={isLight ? 'text-slate-600' : 'text-gray-400'}>AIR_QUALITY:</span>
                <span className="font-bold" style={{ color: 'var(--color-accent)' }}>
                  AQI {aqi.usAqi} [{aqi.label.toUpperCase()}]
                </span>
              </div>
              <div
                className={`flex justify-between items-center p-2 border ${
                  isLight ? 'bg-cyan-50/50 border-cyan-200/50' : 'bg-black/30'
                }`}
                style={{ borderColor: 'var(--theme-accent-soft)' }}
              >
                <span className={isLight ? 'text-slate-600' : 'text-gray-400'}>HUMIDITY // WIND:</span>
                <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {weather.humidity}% // {weather.windSpeed} KM/H
                </span>
              </div>
            </div>
          </HudBox>
        </div>

        {/* Center Column: Mission Timetable & Directives (Cols 5-8) */}
        <div className="col-span-4 flex flex-col space-y-4">
          <HudBox title="MISSION_SCHEDULE" code={`${events.length}_OPERATIONS`} glowColor="amber" className="flex-1">
            <div className="space-y-2 overflow-y-auto max-h-[30vh] pr-1">
              {events.slice(0, 4).map((evt) => (
                <div
                  key={evt.id}
                  className={`p-2.5 border-l-2 border-t border-r border-b ${
                    isLight ? 'bg-cyan-50/60' : 'bg-[#061122]/80'
                  }`}
                  style={{
                    borderLeftColor: 'var(--color-accent)',
                    borderTopColor: 'var(--theme-accent-soft)',
                    borderRightColor: 'var(--theme-accent-soft)',
                    borderBottomColor: 'var(--theme-accent-soft)',
                  }}
                >
                  <div className="flex items-center justify-between text-[10px]" style={{ color: 'var(--color-accent)' }}>
                    <span>⏱ {evt.startTime} - {evt.endTime}</span>
                    <span className="text-[9px] uppercase tracking-widest opacity-80">
                      [{evt.category}]
                    </span>
                  </div>
                  <h4 className={`text-xs font-bold mt-0.5 truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{evt.title}</h4>
                  {evt.location && (
                    <p className={`text-[10px] mt-0.5 truncate ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>LOC: {evt.location}</p>
                  )}
                </div>
              ))}
            </div>
          </HudBox>

          <HudBox title="TACTICAL_DIRECTIVES" code="QUEUE" glowColor="emerald" className="flex-1">
            <div className="space-y-1.5 overflow-y-auto max-h-[28vh] pr-1">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-2 border cursor-pointer flex items-center justify-between transition-all ${
                    task.completed
                      ? isLight
                        ? 'bg-slate-200/60 border-slate-300 text-slate-400 line-through'
                        : 'bg-black/60 border-gray-800 text-gray-600 line-through'
                      : isLight ? 'text-slate-900' : 'text-white'
                  }`}
                  style={task.completed ? undefined : {
                    borderColor: 'var(--theme-accent-soft)',
                    backgroundColor: 'var(--theme-accent-soft)',
                  }}
                >
                  <div className="flex items-center space-x-2 min-w-0">
                    {task.completed ? (
                      <CheckCircle2 size={14} className={isLight ? 'text-slate-400 shrink-0' : 'text-gray-600 shrink-0'} />
                    ) : (
                      <CircleDashed size={14} className="shrink-0 animate-spin-slow" style={{ color: 'var(--color-accent)' }} />
                    )}
                    <span className="text-xs truncate">{task.title}</span>
                  </div>
                  {task.dueTime && (
                    <span className="text-[9px] font-mono shrink-0 ml-1" style={{ color: 'var(--color-accent)' }}>
                      [{task.dueTime}]
                    </span>
                  )}
                </div>
              ))}
            </div>
          </HudBox>
        </div>

        {/* Right Column: Financial Feeds & F1 Telemetry (Cols 9-12) */}
        <div className="col-span-4 flex flex-col space-y-4">
          <HudBox title="MARKET_TELEMETRY" code="LIVE_FEED" glowColor="cyan" className="flex-1">
            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              {finance.map((item) => {
                const isUp = item.change >= 0;
                return (
                  <div
                    key={item.id}
                    className={`p-2 border flex flex-col justify-between ${
                      isLight ? 'bg-cyan-50/60 border-cyan-300/40' : 'bg-[#050e20] border-cyan-500/25'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className={`font-bold truncate ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>{item.symbol}</span>
                      <span className={`font-bold ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {isUp ? '▲' : '▼'}{Math.abs(item.changePercent).toFixed(1)}%
                      </span>
                    </div>
                    <div className={`text-sm font-black mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>{item.price}</div>
                  </div>
                );
              })}
            </div>
          </HudBox>

          <HudBox
            title="F1_TACTICAL_RADAR"
            code={`ROUND_${f1.activeRound}`}
            glowColor="amber"
          >
            <div className="space-y-2 pt-1 text-xs">
              <div>
                <h4 className="text-sm font-bold truncate" style={{ color: 'var(--color-accent)' }}>{f1.raceName}</h4>
                <p className={`text-[11px] truncate ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>{f1.circuitName}</p>
              </div>

              <div className={`p-2 border flex items-center justify-between ${
                isLight ? 'bg-cyan-50/60 border-cyan-300/40' : 'bg-[#050e20] border-cyan-500/30'
              }`}>
                <div>
                  <span className={`text-[9px] block uppercase ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>TARGET_SESSION</span>
                  <span className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{f1.nextSession.name}</span>
                </div>
                <div className="text-right">
                  <span className={`text-[9px] block uppercase ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>COUNTDOWN</span>
                  <span className="text-sm font-black text-rose-500">{f1.nextSession.countdownFormatted}</span>
                </div>
              </div>
            </div>
          </HudBox>
        </div>
      </div>
    </div>
  );
};
