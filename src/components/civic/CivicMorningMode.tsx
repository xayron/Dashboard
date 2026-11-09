import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { FileCheck, CheckCircle2, CircleDashed, Calendar, Database, ArrowUpRight, ArrowDownRight, Clock, Wind, Droplets, Sun, Flag, AlertTriangle, ShieldAlert, Award } from 'lucide-react';
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
    <div className="w-full h-full p-6 flex flex-col justify-between overflow-hidden bg-[#f1f5f9] text-[#0f172a] select-none font-sans">
      {/* Top Banner: Civic Audit Masthead & Audio Banner */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-slate-300">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-[#0f172a] text-[#f97316] rounded-lg shadow-sm">
            <FileCheck size={20} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                GOVERNANCE & CIVIC TRANSPARENCY SCORECARD
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-red-100 border border-red-300 text-red-700 font-bold rounded">
                PIB CLAIM VS CAG AUDIT
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              DATA SOURCES: CAG AUDITS • IMD METEOROLOGY • ECI AFFIDAVITS • SEBI FISCAL DATA
            </p>
          </div>
        </div>

        {media.state === 'playing' && <AudioBanner compact={true} />}
      </div>

      {/* 3-Column 1080p Grid */}
      <div className="grid grid-cols-12 gap-5 flex-1 min-h-0">
        {/* Left Column: Official Standard Time & CPCB Meteorological Audit (Cols 1-4) */}
        <div className="col-span-4 flex flex-col space-y-4">
          {/* Official Chrono Card */}
          <div className="p-5 bg-white border border-slate-300 rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 text-xs font-mono text-slate-500">
              <span className="flex items-center space-x-1.5 text-slate-800 font-bold">
                <Clock size={14} className="text-[#f97316]" />
                <span>INDIAN STANDARD TIME (IST)</span>
              </span>
              <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-bold border border-emerald-300">
                CSIR-NPL SYNC
              </span>
            </div>

            <div className="py-4 text-center">
              <div className="text-6xl font-mono font-black tracking-tight text-slate-950 flex items-baseline justify-center">
                <span>{hours}:{minutes}</span>
                <span className="text-2xl text-[#f97316] font-mono ml-2">:{seconds}</span>
              </div>
              <div className="text-xs font-bold text-slate-600 mt-2 uppercase tracking-wide">
                {dateFormatted} • UTC+05:30
              </div>
            </div>

            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>SOLAR: {weather.sunrise} DAWN – {weather.sunset} DUSK</span>
              <span className="text-emerald-700 font-bold">CERTIFIED</span>
            </div>
          </div>

          {/* Meteorological & Environmental Audit Card */}
          <div className="p-5 bg-white border border-slate-300 rounded-xl shadow-sm flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-xs font-mono text-slate-500">
              <span className="flex items-center space-x-1.5 text-slate-800 font-bold">
                <Database size={14} className="text-[#f97316]" />
                <span>CPCB / IMD ENVIRONMENTAL AUDIT</span>
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">STATION RECORD</span>
            </div>

            <div className="grid grid-cols-2 gap-3 my-2">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">
                  Ground Temperature
                </span>
                <div className="text-3xl font-mono font-black text-slate-900 mt-0.5">
                  {weather.temperature}°C
                </div>
                <span className="text-[11px] text-slate-600 block mt-0.5 font-medium">
                  {weather.condition} • Feels {weather.apparentTemperature}°C
                </span>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <span className="text-[10px] font-mono text-emerald-800 uppercase font-bold block">
                  Air Quality Index (AQI)
                </span>
                <div className="text-3xl font-mono font-black text-emerald-700 mt-0.5">
                  {aqi.usAqi}
                </div>
                <span className="text-[11px] text-emerald-800 font-bold block mt-0.5 uppercase">
                  {aqi.label}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-600 border-t border-slate-100 pt-2">
              <div className="flex items-center space-x-1">
                <Wind size={13} className="text-slate-400" />
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

        {/* Center Column: Public Gazette & Civic Directives Pipeline (Cols 5-8) */}
        <div className="col-span-4 flex flex-col space-y-4">
          {/* Public Gazette Schedule */}
          <div className="p-5 bg-white border border-slate-300 rounded-xl shadow-sm flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-xs font-mono text-slate-500">
              <span className="flex items-center space-x-1.5 text-slate-800 font-bold">
                <Calendar size={14} className="text-[#f97316]" />
                <span>PUBLIC GAZETTE & ENGAGEMENTS</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-bold">
                {events.length} LOGGED
              </span>
            </div>

            <div className="space-y-2.5 overflow-y-auto max-h-[220px] my-2 pr-1 font-mono">
              {events.length === 0 ? (
                <div className="text-xs text-slate-400 py-6 text-center italic">No public gazette engagements logged</div>
              ) : (
                events.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3 bg-slate-50 border border-slate-200 hover:border-slate-400 rounded-lg transition-colors flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-bold text-slate-900 truncate">{ev.title}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 flex items-center space-x-2">
                        <span>{ev.startTime} – {ev.endTime}</span>
                        {ev.location && <span>• {ev.location}</span>}
                      </div>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 font-bold uppercase rounded">
                      PUBLIC
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>OFFICIAL CALENDAR FEED</span>
              <span className="text-emerald-700 font-bold">VERIFIED</span>
            </div>
          </div>

          {/* Civic Directives / CAG Audit Action Items */}
          <div className="p-5 bg-white border border-slate-300 rounded-xl shadow-sm flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-xs font-mono text-slate-500">
              <span className="flex items-center space-x-1.5 text-slate-800 font-bold">
                <ShieldAlert size={14} className="text-[#f97316]" />
                <span>CAG AUDIT DIRECTIVES PIPELINE</span>
              </span>
              <span className="text-[10px] text-red-700 bg-red-100 px-2 py-0.5 rounded font-bold border border-red-300">
                PUBLIC SCRUTINY
              </span>
            </div>

            <div className="space-y-2 overflow-y-auto max-h-[220px] my-2 pr-1 font-mono">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-2.5 border rounded-lg transition-all cursor-pointer flex items-center justify-between ${
                    task.completed
                      ? 'bg-slate-50 border-slate-200 opacity-60'
                      : 'bg-white border-slate-300 hover:border-[#f97316] shadow-sm'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                    {task.completed ? (
                      <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    ) : (
                      <CircleDashed size={15} className="text-[#f97316] shrink-0" />
                    )}
                    <span className={`text-xs truncate font-medium ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {task.title}
                    </span>
                  </div>
                  {task.dueTime && (
                    <span className="text-[10px] text-slate-500 font-bold shrink-0">
                      [{task.dueTime}]
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>CITIZEN INQUIRY: ACTIVE</span>
              <span className="text-slate-600 font-bold">CLICK TO UPDATE</span>
            </div>
          </div>
        </div>

        {/* Right Column: Public Fiscal Ledger & Motorsport Technical Scrutiny (Cols 9-12) */}
        <div className="col-span-4 flex flex-col space-y-4">
          {/* Public Fiscal Ledger */}
          <div className="p-5 bg-white border border-slate-300 rounded-xl shadow-sm flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-xs font-mono text-slate-500">
              <span className="flex items-center space-x-1.5 text-slate-800 font-bold">
                <Database size={14} className="text-[#f97316]" />
                <span>PUBLIC FISCAL INDICATORS</span>
              </span>
              <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                RBI / SEBI
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 my-2 font-mono">
              {finance.map((item) => {
                const isUp = item.change >= 0;
                return (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-600 font-bold">{item.symbol}</span>
                      <span className={`text-[10px] font-bold flex items-center ${isUp ? 'text-emerald-700' : 'text-red-600'}`}>
                        {isUp ? <ArrowUpRight size={12} className="mr-0.5" /> : <ArrowDownRight size={12} className="mr-0.5" />}
                        {Math.abs(item.changePercent).toFixed(2)}%
                      </span>
                    </div>
                    <div className="text-base font-black text-slate-900 mt-1.5">
                      {item.price}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>INDEX: REAL-TIME LEDGER</span>
              <span className="text-emerald-700 font-bold">T+0 SYNC</span>
            </div>
          </div>

          {/* Motorsport Scrutiny / F1 Telemetry */}
          <div className="p-5 bg-white border border-slate-300 rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-xs font-mono text-slate-500">
              <span className="flex items-center space-x-1.5 text-slate-800 font-bold">
                <Flag size={14} className="text-[#f97316]" />
                <span>MOTORSPORT TECHNICAL SCRUTINY</span>
              </span>
              <span className="text-[10px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded font-bold border border-slate-300">
                ROUND {f1.activeRound}
              </span>
            </div>

            <div className="my-2 space-y-2 font-mono">
              <div>
                <h4 className="text-sm font-bold text-slate-900 truncate">{f1.raceName}</h4>
                <p className="text-xs text-slate-500 truncate mt-0.5">{f1.circuitName}</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Target Session</span>
                  <span className="text-xs font-bold text-slate-900">{f1.nextSession.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Scrutiny Lock</span>
                  <span className="text-sm font-black text-[#f97316]">{f1.nextSession.countdownFormatted}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>FIA OFFICIAL DATA STREAM</span>
              <span className="text-slate-800 font-bold">AUDITED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
