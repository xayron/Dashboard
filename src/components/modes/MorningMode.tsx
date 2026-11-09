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
  const { weather, events, tasks, toggleTask, f1, media, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  return (
    <div className="w-full h-full p-8 flex flex-col justify-between overflow-hidden bg-transparent select-none">
      {/* Top Bar: Morning Greeting & Key Timings */}
      <div className={`flex items-center justify-between mb-6 pb-4 border-b ${isLight ? 'border-black/[0.08]' : 'border-white/10'}`}>
        <div className="flex items-center space-x-3">
          <div
            className="p-2.5 rounded-2xl border"
            style={{
              backgroundColor: 'var(--theme-accent-soft)',
              borderColor: 'var(--color-accent)',
              color: 'var(--color-accent)',
            }}
          >
            <Coffee size={24} />
          </div>
          <div>
            <h1 className={`text-2xl font-bold font-display tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>Morning Briefing</h1>
            <p className={`text-xs flex items-center mt-0.5 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
              <Sunrise size={13} className="mr-1.5" style={{ color: 'var(--color-accent)' }} />
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
          <div
            className="glass-panel p-6 rounded-3xl shadow-xl border"
            style={{ borderColor: 'var(--color-panel-border)' }}
          >
            <ClockWidget size="large" showSeconds={true} showDate={true} />
          </div>

          <div className="flex-1">
            <WeatherWidget layout="detailed" className="h-full" />
          </div>
        </div>

        {/* Center Column: Calendar & Today's Tasks (Cols 5-8) */}
        <div className="col-span-4 flex flex-col space-y-5">
          {/* Calendar Agenda */}
          <div
            className="glass-panel p-5 rounded-3xl border flex-1 flex flex-col min-h-0"
            style={{ borderColor: 'var(--color-panel-border)' }}
          >
            <div className={`flex items-center justify-between mb-3 pb-2 border-b ${isLight ? 'border-black/[0.08]' : 'border-white/10'}`}>
              <div className={`flex items-center space-x-2 text-sm font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <Calendar size={16} style={{ color: 'var(--color-accent)' }} />
                <span>Today's Schedule</span>
              </div>
              <span className={`text-xs font-mono-numbers ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>{events.length} Events</span>
            </div>

            <div className="space-y-2.5 overflow-y-auto pr-1 flex-1">
              {events.slice(0, 4).map(event => (
                <div
                  key={event.id}
                  className={`p-3 rounded-2xl border transition-all flex items-start space-x-3 ${
                    isLight ? 'bg-black/[0.03] border-black/[0.06] hover:border-black/[0.12]' : 'bg-white/5 border-white/5 hover:border-white/15'
                  }`}
                >
                  <div
                    className="px-2 py-1 rounded-xl font-mono-numbers text-xs font-bold shrink-0"
                    style={{
                      backgroundColor: 'var(--theme-accent-soft)',
                      color: 'var(--color-accent)',
                    }}
                  >
                    {event.startTime}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{event.title}</p>
                    {event.location && (
                      <p className={`text-xs flex items-center mt-0.5 truncate ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                        <MapPin size={11} className="mr-1 shrink-0" style={{ color: 'var(--color-accent)' }} />
                        {event.location}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Tasks / Reminders */}
          <div
            className="glass-panel p-5 rounded-3xl border flex-1 flex flex-col min-h-0"
            style={{ borderColor: 'var(--color-panel-border)' }}
          >
            <div className={`flex items-center justify-between mb-3 pb-2 border-b ${isLight ? 'border-black/[0.08]' : 'border-white/10'}`}>
              <div className={`flex items-center space-x-2 text-sm font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <CheckCircle2 size={16} style={{ color: 'var(--color-accent)' }} />
                <span>Priorities & Tasks</span>
              </div>
              <span className="text-xs font-mono-numbers" style={{ color: 'var(--color-accent)' }}>
                {tasks.filter(t => t.completed).length}/{tasks.length} Done
              </span>
            </div>

            <div className="space-y-2 overflow-y-auto pr-1 flex-1">
              {tasks.map(task => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-2.5 rounded-2xl flex items-center space-x-3 cursor-pointer transition-all border ${
                    task.completed
                      ? (isLight ? 'bg-black/[0.02] border-black/[0.04] opacity-50' : 'bg-white/5 border-white/5 opacity-60')
                      : (isLight ? 'bg-black/[0.04] border-black/[0.08] hover:border-black/[0.15]' : 'bg-white/10 border-white/10 hover:border-white/20')
                  }`}
                >
                  {task.completed ? (
                    <CheckCircle2 size={18} className="shrink-0" style={{ color: 'var(--color-accent)' }} />
                  ) : (
                    <Circle size={18} className={isLight ? 'text-slate-400 shrink-0' : 'text-gray-400 shrink-0'} />
                  )}
                  <span className={`text-xs font-medium flex-1 truncate ${
                    task.completed
                      ? (isLight ? 'line-through text-slate-400' : 'line-through text-gray-400')
                      : (isLight ? 'text-slate-800' : 'text-gray-100')
                  }`}>
                    {task.title}
                  </span>
                  {task.priority === 'high' && (
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-600 border border-rose-500/30">
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
          <div className="glass-panel p-5 rounded-3xl border flex-1 flex flex-col" style={{ borderColor: 'var(--color-panel-border)' }}>
            <div className={`flex items-center justify-between mb-3 pb-2 border-b ${isLight ? 'border-black/[0.08]' : 'border-white/10'}`}>
              <div className={`flex items-center space-x-2 text-sm font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <TrendingUp size={16} className="text-emerald-500" />
                <span>Markets at Open</span>
              </div>
              <span className={`text-xs font-mono-numbers ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>Realtime</span>
            </div>

            <div className="flex-1">
              <FinanceTicker mode="grid" />
            </div>
          </div>

          {/* F1 Countdown Card in Morning */}
          <div className={`glass-panel p-5 rounded-3xl border ${
            isLight
              ? 'border-red-200 bg-red-50/40'
              : 'border-white/10 bg-gradient-to-br from-red-950/30 to-black/40'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-red-500 uppercase tracking-wider">
                <Flag size={14} />
                <span>Next Grand Prix</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-600 font-mono-numbers border border-red-500/30">
                Round {f1.activeRound}/{f1.totalRounds}
              </span>
            </div>

            <h3 className={`text-base font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{f1.raceName}</h3>
            <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>{f1.circuitName}</p>

            <div className={`mt-3 p-3 rounded-2xl border flex items-center justify-between ${
              isLight ? 'bg-white/60 border-red-200' : 'bg-white/5 border-white/10'
            }`}>
              <div>
                <span className={`text-[10px] uppercase font-semibold ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>Next Session: {f1.nextSession.name}</span>
                <p className={`text-xs font-mono-numbers font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{f1.nextSession.istTimeFormatted}</p>
              </div>
              <div className="text-right">
                <span className={`text-[10px] uppercase font-semibold ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>Countdown</span>
                <p className="text-sm font-mono-numbers font-extrabold text-red-500">{f1.nextSession.countdownFormatted}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
