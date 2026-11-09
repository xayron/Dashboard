import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { ShieldCheck, CheckCircle2, CircleDashed, Terminal, Activity, ArrowUpRight, ArrowDownRight, Clock, Wind, Droplets, Sun, Radio, Compass, Lock, Calendar, CheckSquare, TrendingUp, Flag } from 'lucide-react';
import { AudioBanner } from '../common/AudioBanner';

export const ObsidianMorningMode: React.FC = () => {
  const { now, weather, aqi, events, tasks, toggleTask, f1, finance, media } = useDashboard();

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
    <div className="w-full h-full p-6 flex flex-col justify-between overflow-hidden bg-[#050507] text-[#eef0f3] select-none font-sans relative">
      {/* Obsidian Crystal Glow Effect */}
      <div
        className="absolute top-0 inset-x-0 h-64 pointer-events-none opacity-25 z-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, var(--color-glow, rgba(95,212,155,0.2)), transparent 70%)',
        }}
      />

      {/* Top Briefing Rail */}
      <div className="relative z-10 flex items-center justify-between mb-4 pb-3 border-b border-white/[0.12]">
        <div className="flex items-center space-x-3">
          <div
            className="p-2 bg-[#101017] border border-white/[0.18]"
            style={{
              color: 'var(--color-accent, #5fd49b)',
              boxShadow: '0 0 15px var(--color-glow, rgba(95,212,155,0.2))',
            }}
          >
            <Clock size={18} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold font-mono tracking-widest text-[#eef0f3]">
                MORNING BRIEFING
              </h1>
              <span
                className="px-2 py-0.5 text-[10px] font-mono border"
                style={{
                  backgroundColor: 'var(--color-accent-soft, rgba(95,212,155,0.1))',
                  borderColor: 'var(--color-accent, #5fd49b)',
                  color: 'var(--color-accent, #5fd49b)',
                }}
              >
                SYSTEM ACTIVE
              </span>
            </div>
            <p className="text-xs font-mono text-[#9a9da6] mt-0.5">
              SUNRISE AT {weather.sunrise} // SUNSET AT {weather.sunset} • EXPECTED HIGH {weather.highTemp}°C
            </p>
          </div>
        </div>

        {media.state === 'playing' && <AudioBanner compact={true} />}
      </div>

      {/* 3-Column 1080p Grid */}
      <div className="relative z-10 grid grid-cols-12 gap-5 flex-1 min-h-0">
        {/* Left Column: Clock & Weather (Cols 1-4) */}
        <div className="col-span-4 flex flex-col space-y-4">
          {/* Clock Facet Card */}
          <div className="p-5 bg-[#0f0f15] border border-white/[0.14] relative overflow-hidden flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 text-xs font-mono text-[#9a9da6]">
              <span className="flex items-center space-x-1.5 text-[#eef0f3]">
                <Clock size={13} style={{ color: 'var(--color-accent, #5fd49b)' }} />
                <span className="font-bold tracking-wider">CURRENT TIME</span>
              </span>
              <span
                className="text-[10px] px-2 py-0.5 border"
                style={{
                  backgroundColor: 'var(--color-accent-soft, rgba(95,212,155,0.1))',
                  borderColor: 'var(--color-accent, #5fd49b)',
                  color: 'var(--color-accent, #5fd49b)',
                }}
              >
                LIVE
              </span>
            </div>

            <div className="py-4 text-center">
              <div className="text-6xl font-mono font-bold tracking-tight text-[#eef0f3] flex items-baseline justify-center">
                <span>{hours}:{minutes}</span>
                <span className="text-2xl font-mono ml-2" style={{ color: 'var(--color-accent, #5fd49b)' }}>:{seconds}</span>
              </div>
              <div className="text-xs font-mono text-[#9a9da6] mt-2 tracking-widest">
                {dateFormatted} • TIMEZONE: IST (UTC+5:30)
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-[#9a9da6]">
              <span className="text-[#54565e]">NTP SYNCHRONIZED</span>
              <span className="font-bold" style={{ color: 'var(--color-accent, #5fd49b)' }}>ACCURATE</span>
            </div>
          </div>

          {/* Weather & Atmospheric Conditions Card */}
          <div className="p-5 bg-[#0f0f15] border border-white/[0.14] flex-1 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 text-xs font-mono text-[#9a9da6]">
              <span className="flex items-center space-x-1.5 text-[#eef0f3]">
                <Activity size={13} style={{ color: 'var(--color-accent, #5fd49b)' }} />
                <span className="font-bold tracking-wider">WEATHER & ENVIRONMENT</span>
              </span>
              <span className="text-[10px] text-[#9a9da6]">{weather.condition.toUpperCase()}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 my-2 font-mono">
              <div className="p-3 bg-[#08080c] border border-white/[0.08]">
                <span className="text-[10px] text-[#9a9da6] uppercase block">Temperature</span>
                <div className="text-3xl font-bold text-[#eef0f3] mt-0.5">
                  {weather.temperature}°C
                </div>
                <span className="text-[11px] text-[#9a9da6] block mt-0.5">Feels like {weather.apparentTemperature}°C</span>
              </div>

              <div className="p-3 bg-[#08080c] border border-white/[0.08]">
                <span className="text-[10px] text-[#9a9da6] uppercase block">Air Quality</span>
                <div className="text-3xl font-bold mt-0.5" style={{ color: 'var(--color-accent, #5fd49b)' }}>
                  {aqi.usAqi}
                </div>
                <span className="text-[11px] block mt-0.5 uppercase" style={{ color: 'var(--color-accent, #5fd49b)' }}>{aqi.label}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-[#9a9da6] border-t border-white/[0.08] pt-2">
              <div className="flex items-center space-x-1">
                <Wind size={12} className="text-[#9a9da6]" />
                <span>{weather.windSpeed} km/h</span>
              </div>
              <div className="flex items-center space-x-1">
                <Droplets size={12} className="text-[#9a9da6]" />
                <span>{weather.humidity}% HUM</span>
              </div>
              <div className="flex items-center space-x-1">
                <Sun size={12} className="text-[#e3b341]" />
                <span>UV {weather.uvIndex}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: Today's Schedule & Tasks (Cols 5-8) */}
        <div className="col-span-4 flex flex-col space-y-4">
          {/* Today's Schedule */}
          <div className="p-5 bg-[#0f0f15] border border-white/[0.14] flex-1 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 text-xs font-mono text-[#9a9da6]">
              <span className="flex items-center space-x-1.5 text-[#eef0f3]">
                <Calendar size={13} style={{ color: 'var(--color-accent, #5fd49b)' }} />
                <span className="font-bold tracking-wider">TODAY'S SCHEDULE</span>
              </span>
              <span className="text-[10px] text-[#9a9da6]">{events.length} UPCOMING</span>
            </div>

            <div className="space-y-2.5 overflow-y-auto max-h-[220px] my-2 pr-1 font-mono">
              {events.length === 0 ? (
                <div className="text-xs text-[#54565e] py-6 text-center italic">No events scheduled for today</div>
              ) : (
                events.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-2.5 bg-[#08080c] border border-white/[0.08] hover:border-white/[0.25] transition-colors flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-bold text-[#eef0f3] truncate">{ev.title}</div>
                      <div className="text-[10px] text-[#9a9da6] mt-0.5 flex items-center space-x-2">
                        <span>{ev.startTime} – {ev.endTime}</span>
                        {ev.location && <span>• {ev.location}</span>}
                      </div>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 bg-white/[0.06] text-[#9a9da6] border border-white/[0.1] shrink-0">
                      CALENDAR
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-[#54565e]">
              <span>GOOGLE CALENDAR</span>
              <span style={{ color: 'var(--color-accent, #5fd49b)' }}>SYNCED</span>
            </div>
          </div>

          {/* Tasks & To-Dos */}
          <div className="p-5 bg-[#0f0f15] border border-white/[0.14] flex-1 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 text-xs font-mono text-[#9a9da6]">
              <span className="flex items-center space-x-1.5 text-[#eef0f3]">
                <CheckSquare size={13} style={{ color: 'var(--color-accent, #5fd49b)' }} />
                <span className="font-bold tracking-wider">TASKS & TO-DOS</span>
              </span>
              <span className="text-[10px] text-[#e3b341] bg-[#e3b341]/10 px-1.5 py-0.5 border border-[#e3b341]/30">
                {tasks.filter(t => !t.completed).length} PENDING
              </span>
            </div>

            <div className="space-y-2 overflow-y-auto max-h-[220px] my-2 pr-1 font-mono">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-2.5 bg-[#08080c] border transition-all cursor-pointer flex items-center justify-between ${
                    task.completed
                      ? 'border-white/[0.04] opacity-50'
                      : 'border-white/[0.14] hover:border-white/[0.3]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                    {task.completed ? (
                      <CheckCircle2 size={14} style={{ color: 'var(--color-accent, #5fd49b)' }} className="shrink-0" />
                    ) : (
                      <CircleDashed size={14} className="text-[#e3b341] shrink-0" />
                    )}
                    <span className={`text-xs truncate ${task.completed ? 'line-through text-[#54565e]' : 'text-[#eef0f3]'}`}>
                      {task.title}
                    </span>
                  </div>
                  {task.dueTime && (
                    <span className="text-[10px] text-[#9a9da6] shrink-0">
                      {task.dueTime}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-[#54565e]">
              <span>GOOGLE TASKS</span>
              <span className="text-[#9a9da6]">TAP TO TOGGLE</span>
            </div>
          </div>
        </div>

        {/* Right Column: Market Watch & Formula 1 (Cols 9-12) */}
        <div className="col-span-4 flex flex-col space-y-4">
          {/* Market Watch */}
          <div className="p-5 bg-[#0f0f15] border border-white/[0.14] flex-1 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 text-xs font-mono text-[#9a9da6]">
              <span className="flex items-center space-x-1.5 text-[#eef0f3]">
                <TrendingUp size={13} style={{ color: 'var(--color-accent, #5fd49b)' }} />
                <span className="font-bold tracking-wider">MARKET WATCH</span>
              </span>
              <span
                className="text-[10px] px-1.5 py-0.5 border rounded-sm"
                style={{
                  backgroundColor: 'var(--color-accent-soft, rgba(95,212,155,0.1))',
                  borderColor: 'var(--color-accent, #5fd49b)',
                  color: 'var(--color-accent, #5fd49b)',
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
                    className="p-3 bg-[#08080c] border border-white/[0.08] flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#9a9da6] font-bold">{item.symbol}</span>
                      <span
                        className="text-[10px] flex items-center"
                        style={{ color: isUp ? 'var(--color-accent, #5fd49b)' : '#e3b341' }}
                      >
                        {isUp ? <ArrowUpRight size={11} className="mr-0.5" /> : <ArrowDownRight size={11} className="mr-0.5" />}
                        {Math.abs(item.changePercent).toFixed(2)}%
                      </span>
                    </div>
                    <div className="text-base font-bold text-[#eef0f3] mt-1.5">
                      {item.price}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-[#54565e]">
              <span>NSE / NASDAQ / LSE</span>
              <span style={{ color: 'var(--color-accent, #5fd49b)' }}>REAL-TIME</span>
            </div>
          </div>

          {/* Formula 1 */}
          <div className="p-5 bg-[#0f0f15] border border-white/[0.14] flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 text-xs font-mono text-[#9a9da6]">
              <span className="flex items-center space-x-1.5 text-[#eef0f3]">
                <Flag size={13} className="text-[#e3b341]" />
                <span className="font-bold tracking-wider">FORMULA 1</span>
              </span>
              <span className="text-[10px] text-[#e3b341] bg-[#e3b341]/10 px-1.5 py-0.5 border border-[#e3b341]/30">
                ROUND {f1.activeRound} OF {f1.totalRounds}
              </span>
            </div>

            <div className="my-2 space-y-2 font-mono">
              <div>
                <h4 className="text-sm font-bold text-[#eef0f3] truncate">{f1.raceName}</h4>
                <p className="text-xs text-[#9a9da6] truncate mt-0.5">{f1.circuitName}</p>
              </div>

              <div className="p-3 bg-[#08080c] border border-white/[0.08] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#54565e] uppercase block">Target Session</span>
                  <span className="text-xs font-bold text-[#eef0f3]">{f1.nextSession.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#54565e] uppercase block">Countdown</span>
                  <span className="text-sm font-bold" style={{ color: 'var(--color-accent, #5fd49b)' }}>
                    {f1.nextSession.countdownFormatted}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-[#54565e]">
              <span>FIA OFFICIAL DATA FEED</span>
              <span className="text-[#eef0f3]">UP TO DATE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
