import React from 'react';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Sunrise,
  Coffee,
  TrendingUp,
  MapPin,
  Clock,
  Flag,
} from 'lucide-react';
import { useDashboard } from '../../state/DashboardContext';
import { ClockWidget } from '../common/ClockWidget';
import { WeatherWidget } from '../common/WeatherWidget';
import { FinanceTicker } from '../common/FinanceTicker';
import { AudioBanner } from '../common/AudioBanner';

export const MorningMode: React.FC = () => {
  const { weather, events, tasks, toggleTask, f1, media } = useDashboard();

  return (
    <div className="w-full h-full p-8 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 select-none">
      {/* Top Bar: Morning Greeting & Key Timings */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Coffee size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display text-white tracking-tight">Morning Briefing</h1>
            <p className="text-xs text-gray-400 flex items-center mt-0.5">
              <Sunrise size={13} className="mr-1.5 text-amber-400" />
              Sunrise at {weather.sunrise} • Have a productive day ahead
            </p>
          </div>
        </div>

        {media.state === 'playing' && <AudioBanner />}
      </div>

      {/* Main 3-Column 1080p Grid */}
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left Column: Clock & Detailed Weather (Cols 1-4) */}
        <div className="col-span-4 flex flex-col space-y-5">
          <div className="glass-panel p-6 rounded-3xl shadow-xl border border-white/10">
            <ClockWidget size="large" showSeconds={true} showDate={true} />
          </div>

          <div className="flex-1">
            <WeatherWidget layout="detailed" className="h-full" />
          </div>
        </div>

        {/* Center Column: Calendar & Today's Tasks (Cols 5-8) */}
        <div className="col-span-4 flex flex-col space-y-5">
          {/* Calendar Agenda */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
              <div className="flex items-center space-x-2 text-sm font-bold text-white uppercase tracking-wider">
                <Calendar size={16} className="text-blue-400" />
                <span>Today's Schedule</span>
              </div>
              <span className="text-xs text-gray-400 font-mono-numbers">{events.length} Events</span>
            </div>

            <div className="space-y-2.5 overflow-y-auto pr-1 flex-1">
              {events.slice(0, 4).map(event => (
                <div
                  key={event.id}
                  className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/15 transition-all flex items-start space-x-3"
                >
                  <div className="px-2 py-1 rounded-xl bg-blue-500/20 text-blue-300 font-mono-numbers text-xs font-bold shrink-0">
                    {event.startTime}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{event.title}</p>
                    {event.location && (
                      <p className="text-xs text-gray-400 flex items-center mt-0.5 truncate">
                        <MapPin size={11} className="mr-1 text-emerald-400 shrink-0" />
                        {event.location}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Tasks / Reminders */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
              <div className="flex items-center space-x-2 text-sm font-bold text-white uppercase tracking-wider">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>Priorities & Tasks</span>
              </div>
              <span className="text-xs text-emerald-400 font-mono-numbers">
                {tasks.filter(t => t.completed).length}/{tasks.length} Done
              </span>
            </div>

            <div className="space-y-2 overflow-y-auto pr-1 flex-1">
              {tasks.map(task => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-2.5 rounded-2xl flex items-center space-x-3 cursor-pointer transition-all border ${
                    task.completed ? 'bg-white/5 border-white/5 opacity-60' : 'bg-white/10 border-white/10 hover:border-white/20'
                  }`}
                >
                  {task.completed ? (
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                  ) : (
                    <Circle size={18} className="text-gray-400 shrink-0" />
                  )}
                  <span className={`text-xs font-medium flex-1 truncate ${task.completed ? 'line-through text-gray-400' : 'text-gray-100'}`}>
                    {task.title}
                  </span>
                  {task.priority === 'high' && (
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      High
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Financial Markets & F1 Radar (Cols 9-12) */}
        <div className="col-span-4 flex flex-col space-y-5">
          {/* Markets Overview */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
              <div className="flex items-center space-x-2 text-sm font-bold text-white uppercase tracking-wider">
                <TrendingUp size={16} className="text-emerald-400" />
                <span>Markets at Open</span>
              </div>
              <span className="text-xs text-gray-400 font-mono-numbers">Realtime</span>
            </div>

            <div className="flex-1">
              <FinanceTicker mode="grid" />
            </div>
          </div>

          {/* F1 Countdown Card in Morning */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 bg-gradient-to-br from-red-950/30 to-black/40">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-red-400 uppercase tracking-wider">
                <Flag size={14} />
                <span>Next Grand Prix</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-mono-numbers border border-red-500/30">
                Round {f1.activeRound}/{f1.totalRounds}
              </span>
            </div>

            <h3 className="text-base font-bold text-white truncate">{f1.raceName}</h3>
            <p className="text-xs text-gray-300">{f1.circuitName}</p>

            <div className="mt-3 p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase text-gray-400 font-semibold">Next Session: {f1.nextSession.name}</span>
                <p className="text-xs font-mono-numbers text-white font-bold">{f1.nextSession.istTimeFormatted}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase text-gray-400 font-semibold">Countdown</span>
                <p className="text-sm font-mono-numbers font-extrabold text-red-400">{f1.nextSession.countdownFormatted}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
