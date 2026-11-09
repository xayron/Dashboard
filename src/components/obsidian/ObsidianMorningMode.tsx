import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { ShieldCheck, CheckCircle2, CircleDashed, Terminal, Activity, ArrowUpRight, ArrowDownRight, Clock, Wind, Droplets, Sun, Radio, Compass, Lock, Hash } from 'lucide-react';
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
          background: 'radial-gradient(ellipse at 50% 0%, rgba(95,212,155,0.2), transparent 70%)',
        }}
      />

      {/* Top Evidence Rail */}
      <div className="relative z-10 flex items-center justify-between mb-4 pb-3 border-b border-white/[0.12]">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-[#101017] border border-white/[0.18] text-[#5fd49b] shadow-[0_0_15px_rgba(95,212,155,0.2)]">
            <Lock size={18} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold font-mono tracking-widest text-[#eef0f3]">
                OBSIDIAN INTELLIGENCE // GOVERNED AIR-GAP
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-[#5fd49b]/10 border border-[#5fd49b]/40 text-[#5fd49b]">
                RECEIPT://VERIFIED
              </span>
            </div>
            <p className="text-xs font-mono text-[#9a9da6] mt-0.5">
              HSM NODE 01 • PROOF HASH: SHA256//B74C..9E1A • SOLAR DAWN {weather.sunrise} // DUSK {weather.sunset}
            </p>
          </div>
        </div>

        {media.state === 'playing' && <AudioBanner compact={true} />}
      </div>

      {/* 3-Column 1080p Grid */}
      <div className="relative z-10 grid grid-cols-12 gap-5 flex-1 min-h-0">
        {/* Left Column: Chrono & Atmospheric Sensors (Cols 1-4) */}
        <div className="col-span-4 flex flex-col space-y-4">
          {/* Chrono Facet Card */}
          <div className="p-5 bg-[#0f0f15] border border-white/[0.14] relative overflow-hidden flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 text-xs font-mono text-[#9a9da6]">
              <span className="flex items-center space-x-1.5 text-[#eef0f3]">
                <Clock size={13} className="text-[#5fd49b]" />
                <span className="font-bold tracking-wider">[01] CHRONO TELEMETRY</span>
              </span>
              <span className="text-[10px] text-[#5fd49b] bg-[#5fd49b]/10 px-2 py-0.5 border border-[#5fd49b]/30">
                PTP//ATOMIC
              </span>
            </div>

            <div className="py-4 text-center">
              <div className="text-6xl font-mono font-bold tracking-tight text-[#eef0f3] flex items-baseline justify-center">
                <span>{hours}:{minutes}</span>
                <span className="text-2xl text-[#5fd49b] font-mono ml-2">:{seconds}</span>
              </div>
              <div className="text-xs font-mono text-[#9a9da6] mt-2 tracking-widest">
                {dateFormatted} • TIMEZONE: IST (UTC+5:30)
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-[#9a9da6]">
              <span className="text-[#54565e]">HASH: 8F2A..91D0</span>
              <span className="text-[#5fd49b] font-bold">AIR-GAP PROVEN</span>
            </div>
          </div>

          {/* Atmospheric Sensors Facet Card */}
          <div className="p-5 bg-[#0f0f15] border border-white/[0.14] flex-1 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 text-xs font-mono text-[#9a9da6]">
              <span className="flex items-center space-x-1.5 text-[#eef0f3]">
                <Activity size={13} className="text-[#5fd49b]" />
                <span className="font-bold tracking-wider">[02] ATMOSPHERIC SENSORS</span>
              </span>
              <span className="text-[10px] text-[#9a9da6]">IMD METEOROLOGY</span>
            </div>

            <div className="grid grid-cols-2 gap-3 my-2 font-mono">
              <div className="p-3 bg-[#08080c] border border-white/[0.08]">
                <span className="text-[10px] text-[#9a9da6] uppercase block">Ambient Temp</span>
                <div className="text-3xl font-bold text-[#eef0f3] mt-0.5">
                  {weather.temperature}°C
                </div>
                <span className="text-[11px] text-[#9a9da6] block mt-0.5">Feels {weather.apparentTemperature}°C</span>
              </div>

              <div className="p-3 bg-[#08080c] border border-white/[0.08]">
                <span className="text-[10px] text-[#9a9da6] uppercase block">Air Quality Index</span>
                <div className="text-3xl font-bold text-[#5fd49b] mt-0.5">
                  {aqi.usAqi}
                </div>
                <span className="text-[11px] text-[#5fd49b] block mt-0.5 uppercase">{aqi.label}</span>
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

        {/* Center Column: Engagements & Governed Directives (Cols 5-8) */}
        <div className="col-span-4 flex flex-col space-y-4">
          {/* Action Rail: Calendar Engagements */}
          <div className="p-5 bg-[#0f0f15] border border-white/[0.14] flex-1 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 text-xs font-mono text-[#9a9da6]">
              <span className="flex items-center space-x-1.5 text-[#eef0f3]">
                <Terminal size={13} className="text-[#5fd49b]" />
                <span className="font-bold tracking-wider">[03] SCHEDULED ENGAGEMENTS</span>
              </span>
              <span className="text-[10px] text-[#9a9da6]">{events.length} QUEUED</span>
            </div>

            <div className="space-y-2.5 overflow-y-auto max-h-[220px] my-2 pr-1 font-mono">
              {events.length === 0 ? (
                <div className="text-xs text-[#54565e] py-6 text-center italic">No scheduled operations logged</div>
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
                      CAL-ID
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-[#54565e]">
              <span>LEDGER: GOOGLE WORKSPACE</span>
              <span className="text-[#5fd49b]">ENCRYPTED</span>
            </div>
          </div>

          {/* Governed Directives (Tasks) */}
          <div className="p-5 bg-[#0f0f15] border border-white/[0.14] flex-1 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 text-xs font-mono text-[#9a9da6]">
              <span className="flex items-center space-x-1.5 text-[#eef0f3]">
                <ShieldCheck size={13} className="text-[#5fd49b]" />
                <span className="font-bold tracking-wider">[04] GOVERNED DIRECTIVES</span>
              </span>
              <span className="text-[10px] text-[#e3b341] bg-[#e3b341]/10 px-1.5 py-0.5 border border-[#e3b341]/30">
                ACTION REQUIRED
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
                      : 'border-white/[0.14] hover:border-[#5fd49b]/50'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                    {task.completed ? (
                      <CheckCircle2 size={14} className="text-[#5fd49b] shrink-0" />
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
              <span>OPERATOR LOOP: ACTIVE</span>
              <span className="text-[#9a9da6]">CLICK TO SIGN</span>
            </div>
          </div>
        </div>

        {/* Right Column: Capital Markets & Motorsport Radar (Cols 9-12) */}
        <div className="col-span-4 flex flex-col space-y-4">
          {/* Capital Markets Telemetry */}
          <div className="p-5 bg-[#0f0f15] border border-white/[0.14] flex-1 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 text-xs font-mono text-[#9a9da6]">
              <span className="flex items-center space-x-1.5 text-[#eef0f3]">
                <Activity size={13} className="text-[#5fd49b]" />
                <span className="font-bold tracking-wider">[05] CAPITAL TELEMETRY</span>
              </span>
              <span className="text-[10px] text-[#5fd49b]">LIVE FEED</span>
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
                      <span className={`text-[10px] flex items-center ${isUp ? 'text-[#5fd49b]' : 'text-[#e3b341]'}`}>
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
              <span>FEED: NSE / NASDAQ / LSE</span>
              <span className="text-[#5fd49b]">T+0 STREAM</span>
            </div>
          </div>

          {/* Motorsport Radar / F1 Telemetry */}
          <div className="p-5 bg-[#0f0f15] border border-white/[0.14] flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 text-xs font-mono text-[#9a9da6]">
              <span className="flex items-center space-x-1.5 text-[#eef0f3]">
                <Compass size={13} className="text-[#e3b341]" />
                <span className="font-bold tracking-wider">[06] MOTORSPORT APEX</span>
              </span>
              <span className="text-[10px] text-[#e3b341] bg-[#e3b341]/10 px-1.5 py-0.5 border border-[#e3b341]/30">
                ROUND {f1.activeRound}
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
                  <span className="text-sm font-bold text-[#5fd49b]">{f1.nextSession.countdownFormatted}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-[#54565e]">
              <span>FIA OFFICIAL DATA STREAM</span>
              <span className="text-[#eef0f3]">SYNCED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
