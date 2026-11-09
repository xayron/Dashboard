import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { FileCheck, CheckCircle2, CircleDashed, Calendar, Database, ArrowUpRight, ArrowDownRight, Clock, Wind, Droplets, Sun, Flag, AlertCircle } from 'lucide-react';
import { AudioBanner } from '../common/AudioBanner';

export const CivicMorningMode: React.FC = () => {
  const { now, weather, aqi, events, tasks, toggleTask, f1, finance, media } = useDashboard();

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const dateFormatted = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });

  return (
    <div className="w-full h-full p-6 flex flex-col justify-between overflow-hidden bg-[#070b14] text-[#f8fafc] select-none font-sans">
      {/* Top Banner: Civic Audit Masthead & Audio Banner */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700/60">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-[#0f172a] border border-amber-500/40 text-amber-400">
            <FileCheck size={18} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-black tracking-tight text-white">PUBLIC ACCOUNTABILITY SCORECARD</h1>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
                AUDIT: CURRENT
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              OPEN-DATA REPOSITORY • IMD SOLAR CYCLE: DAWN {weather.sunrise} // DUSK {weather.sunset}
            </p>
          </div>
        </div>

        {media.state === 'playing' && <AudioBanner compact={true} />}
      </div>

      {/* 3-Column 1080p Grid */}
      <div className="grid grid-cols-12 gap-5 flex-1 min-h-0">
        {/* Left Column: Official Chrono & Meteorological Audit (Cols 1-4) */}
        <div className="col-span-4 flex flex-col space-y-4">
          {/* Civic Chrono Card */}
          <div className="p-5 bg-[#0f172a] border border-slate-700/60 flex flex-col justify-between relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs font-mono text-slate-400">
              <span className="flex items-center space-x-1.5 text-slate-200">
                <Clock size={13} className="text-amber-400" />
                <span className="font-bold">STANDARD TIME AUDIT</span>
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 border border-emerald-500/30">
                NPL SYNCED
              </span>
            </div>

            <div className="py-4 text-center">
              <div className="text-6xl font-mono font-black tracking-tight text-white flex items-baseline justify-center">
                <span>{hours}:{minutes}</span>
                <span className="text-2xl text-amber-400 font-mono ml-2">:{seconds}</span>
              </div>
              <div className="text-xs text-slate-300 font-medium mt-2">
                {dateFormatted} • IST (UTC+05:30)
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>LEDGER: INDIAN GAZETTE</span>
              <span className="text-emerald-400 font-semibold">VALIDATED</span>
            </div>
          </div>

          {/* Meteorological & Air Quality Audit */}
          <div className="p-5 bg-[#0f172a] border border-slate-700/60 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs font-mono text-slate-400">
              <span className="flex items-center space-x-1.5 text-slate-200">
                <Database size={13} className="text-amber-400" />
                <span className="font-bold">METEOROLOGICAL AUDIT</span>
              </span>
              <span className="text-[10px] text-slate-400">CPCB / IMD DATA</span>
            </div>

            <div className="grid grid-cols-2 gap-3 my-2">
              <div className="p-3 bg-[#1e293b]/70 border border-slate-700/50">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Ambient Reading</span>
                <div className="text-3xl font-mono font-black text-white mt-0.5">
                  {weather.temperature}°C
                </div>
                <span className="text-[11px] text-slate-300 block mt-0.5">{weather.condition} • Feels {weather.apparentTemperature}°C</span>
              </div>

              <div className="p-3 bg-[#1e293b]/70 border border-slate-700/50">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Air Quality Index</span>
                <div className="text-3xl font-mono font-black text-emerald-400 mt-0.5">
                  {aqi.usAqi}
                </div>
                <span className="text-[11px] text-emerald-300 font-semibold block mt-0.5 uppercase">{aqi.label}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-400 border-t border-slate-800 pt-2">
              <div className="flex items-center space-x-1">
                <Wind size={12} className="text-slate-400" />
                <span>{weather.windSpeed} km/h</span>
              </div>
              <div className="flex items-center space-x-1">
                <Droplets size={12} className="text-slate-400" />
                <span>{weather.humidity}% RH</span>
              </div>
              <div className="flex items-center space-x-1">
                <Sun size={12} className="text-amber-400" />
                <span>UV {weather.uvIndex}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: Public Gazette & Civic Action Pipeline (Cols 5-8) */}
        <div className="col-span-4 flex flex-col space-y-4">
          {/* Public Gazette: Calendar Engagements */}
          <div className="p-5 bg-[#0f172a] border border-slate-700/60 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs font-mono text-slate-400">
              <span className="flex items-center space-x-1.5 text-slate-200">
                <Calendar size={13} className="text-amber-400" />
                <span className="font-bold">PUBLIC GAZETTE SCHEDULE</span>
              </span>
              <span className="text-[10px] text-slate-400">{events.length} LOGGED</span>
            </div>

            <div className="space-y-2.5 overflow-y-auto max-h-[220px] my-2 pr-1 font-mono">
              {events.length === 0 ? (
                <div className="text-xs text-slate-500 py-6 text-center italic">No scheduled public engagements</div>
              ) : (
                events.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-2.5 bg-[#1e293b]/70 border border-slate-700/50 hover:border-slate-500 transition-colors flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-bold text-white truncate">{ev.title}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 flex items-center space-x-2">
                        <span>{ev.startTime} – {ev.endTime}</span>
                        {ev.location && <span>• {ev.location}</span>}
                      </div>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 shrink-0 font-bold uppercase">
                      PUBLIC
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>SOURCE: WORKSPACE CALENDAR</span>
              <span className="text-emerald-400">VERIFIED FEED</span>
            </div>
          </div>

          {/* Civic Action Directives / Tasks */}
          <div className="p-5 bg-[#0f172a] border border-slate-700/60 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs font-mono text-slate-400">
              <span className="flex items-center space-x-1.5 text-slate-200">
                <FileCheck size={13} className="text-amber-400" />
                <span className="font-bold">CIVIC DIRECTIVES PIPELINE</span>
              </span>
              <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 border border-amber-500/30 font-bold">
                SCRUTINY ACTIVE
              </span>
            </div>

            <div className="space-y-2 overflow-y-auto max-h-[220px] my-2 pr-1 font-mono">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-2.5 bg-[#1e293b]/70 border transition-all cursor-pointer flex items-center justify-between ${
                    task.completed
                      ? 'border-slate-800 opacity-60'
                      : 'border-slate-700 hover:border-amber-500/50'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                    {task.completed ? (
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                    ) : (
                      <CircleDashed size={14} className="text-amber-400 shrink-0" />
                    )}
                    <span className={`text-xs truncate ${task.completed ? 'line-through text-slate-500' : 'text-slate-200 font-medium'}`}>
                      {task.title}
                    </span>
                  </div>
                  {task.dueTime && (
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {task.dueTime}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>CITIZEN OVERSIGHT: ENABLED</span>
              <span className="text-slate-400">CLICK TO UPDATE</span>
            </div>
          </div>
        </div>

        {/* Right Column: Public Fiscal Indicators & Circuit Radar (Cols 9-12) */}
        <div className="col-span-4 flex flex-col space-y-4">
          {/* Public Fiscal Indicators */}
          <div className="p-5 bg-[#0f172a] border border-slate-700/60 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs font-mono text-slate-400">
              <span className="flex items-center space-x-1.5 text-slate-200">
                <Database size={13} className="text-amber-400" />
                <span className="font-bold">PUBLIC FISCAL INDICATORS</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">SEBI / NSE</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 my-2 font-mono">
              {finance.map((item) => {
                const isUp = item.change >= 0;
                return (
                  <div
                    key={item.id}
                    className="p-3 bg-[#1e293b]/70 border border-slate-700/50 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-300 font-bold">{item.symbol}</span>
                      <span className={`text-[10px] font-bold flex items-center ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isUp ? <ArrowUpRight size={11} className="mr-0.5" /> : <ArrowDownRight size={11} className="mr-0.5" />}
                        {Math.abs(item.changePercent).toFixed(2)}%
                      </span>
                    </div>
                    <div className="text-base font-black text-white mt-1.5">
                      {item.price}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>INDEX: REAL-TIME LEDGER</span>
              <span className="text-emerald-400 font-semibold">T+0 SYNC</span>
            </div>
          </div>

          {/* Grand Prix Scrutiny / F1 Telemetry */}
          <div className="p-5 bg-[#0f172a] border border-slate-700/60 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs font-mono text-slate-400">
              <span className="flex items-center space-x-1.5 text-slate-200">
                <Flag size={13} className="text-amber-400" />
                <span className="font-bold">MOTORSPORT SCRUTINY</span>
              </span>
              <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 border border-amber-500/30 font-bold">
                ROUND {f1.activeRound}
              </span>
            </div>

            <div className="my-2 space-y-2 font-mono">
              <div>
                <h4 className="text-sm font-bold text-white truncate">{f1.raceName}</h4>
                <p className="text-xs text-slate-400 truncate mt-0.5">{f1.circuitName}</p>
              </div>

              <div className="p-3 bg-[#1e293b]/70 border border-slate-700/50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Next Trial</span>
                  <span className="text-xs font-bold text-white">{f1.nextSession.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase block">Scrutiny Lock</span>
                  <span className="text-sm font-black text-amber-400">{f1.nextSession.countdownFormatted}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>FIA OFFICIAL DATA FEED</span>
              <span className="text-slate-200">VERIFIED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
