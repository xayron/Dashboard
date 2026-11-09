import React, { useState } from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Calendar, CloudSun, Award } from 'lucide-react';
import { AudioBanner } from '../common/AudioBanner';
import { F1WidgetsColumn } from '../f1/F1WidgetsColumn';

export const ObsidianRaceWeekendMode: React.FC = () => {
  const { now, f1, media, weather, colorMode, f1WidgetSizes, setF1WidgetSize } = useDashboard();
  const isLight = colorMode === 'light';
  const [standingsTab, setStandingsTab] = useState<'drivers' | 'constructors'>('drivers');

  const scheduleSize = f1WidgetSizes?.schedule || 'normal';
  const isScheduleCompact = scheduleSize === 'compact';

  const standingsSize = f1WidgetSizes?.standings || 'normal';
  const isStandingsCompact = standingsSize === 'compact';

  const sessionsList = [
    { key: 'fp1', label: 'Practice 1', data: f1.sessions.fp1 },
    { key: 'fp2', label: 'Practice 2', data: f1.sessions.fp2 },
    { key: 'fp3', label: 'Practice 3', data: f1.sessions.fp3 },
    { key: 'sprintQualifying', label: 'Sprint Shootout', data: f1.sessions.sprintQualifying },
    { key: 'sprint', label: 'Sprint Race', data: f1.sessions.sprint },
    { key: 'qualifying', label: 'Qualifying', data: f1.sessions.qualifying },
    { key: 'race', label: 'Grand Prix (Race)', data: f1.sessions.race },
  ].filter(s => s.data !== undefined);

  const cardClass = isLight
    ? 'bg-white/95 border border-slate-200 text-slate-900 shadow-sm'
    : 'bg-[#0f0f15] border border-white/[0.14] text-[#eef0f3] shadow-lg';

  const innerClass = isLight
    ? 'bg-slate-50 border border-slate-200 text-slate-900'
    : 'bg-[#08080c] border border-white/[0.08] text-[#eef0f3]';

  const mutedClass = isLight ? 'text-slate-500' : 'text-[#9a9da6]';
  const borderDivider = isLight ? 'border-slate-200' : 'border-white/[0.08]';

  return (
    <div className={`w-full h-full p-8 flex flex-col justify-between overflow-hidden bg-transparent select-none font-sans relative ${
      isLight ? 'text-slate-900' : 'text-[#eef0f3]'
    }`}>
      {/* 1. TOP BANNER: RACE WEEKEND MASTHEAD */}
      <div className={`p-4 ${cardClass} flex items-center justify-between mb-3.5`}>
        <div>
          <div className={`flex items-center space-x-2 text-xs font-mono ${mutedClass}`}>
            <span style={{ color: 'var(--color-accent, #5fd49b)' }} className="font-bold">FORMULA 1 WORLD CHAMPIONSHIP</span>
            <span>•</span>
            <span>ROUND {f1.activeRound} OF {f1.totalRounds}</span>
            <span>•</span>
            <span
              className="px-1.5 py-0.5 border"
              style={{
                backgroundColor: 'var(--theme-accent-soft)',
                borderColor: 'var(--color-accent, #5fd49b)',
                color: 'var(--color-accent, #5fd49b)',
              }}
            >
              LIVE TELEMETRY
            </span>
          </div>
          <h1 className={`text-2xl font-bold tracking-tight mt-1 ${isLight ? 'text-slate-900' : 'text-[#eef0f3]'}`}>{f1.raceName}</h1>
          <p className={`text-xs font-mono mt-0.5 ${mutedClass}`}>{f1.circuitName} — {f1.location}</p>
        </div>

        <div className="flex items-center space-x-6">
          {/* Circuit Weather Beside Clock */}
          <div className={`text-right border-l pl-6 font-mono ${isLight ? 'border-slate-200' : 'border-white/[0.12]'}`}>
            <span className={`text-[10px] uppercase block ${mutedClass}`}>Track Weather</span>
            <span className={`text-base font-bold tracking-wider ${isLight ? 'text-slate-900' : 'text-[#eef0f3]'}`}>
              {weather.temperature}°C {weather.condition}
            </span>
            <span className="text-xs block font-mono mt-0.5" style={{ color: 'var(--color-accent, #5fd49b)' }}>
              Wind {weather.windSpeed} km/h • Hum {weather.humidity}%
            </span>
          </div>

          <div className={`text-right border-l pl-6 font-mono ${isLight ? 'border-slate-200' : 'border-white/[0.12]'}`}>
            <span className={`text-[10px] uppercase block ${mutedClass}`}>System Clock • IST</span>
            <span className={`text-base font-bold tracking-wider ${isLight ? 'text-slate-900' : 'text-[#eef0f3]'}`}>
              {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
            </span>
            <span className="text-xs block font-bold mt-0.5" style={{ color: 'var(--color-accent, #5fd49b)' }}>UTC+5:30 // TELEMETRY</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN 3-COLUMN GRID */}
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left Column (5 cols): Dynamic Configurable F1 Widgets with Auto-Fitting */}
        <F1WidgetsColumn f1={f1} uiStyle="obsidian" isLight={isLight} className="col-span-5" />

        {/* Center Column (4 cols): Weekend Timetable */}
        <div className={`col-span-4 flex flex-col ${cardClass} p-5`}>
          <div className={`flex items-center justify-between border-b pb-2 mb-3 text-xs font-mono ${borderDivider} ${mutedClass}`}>
            <span className={`font-bold flex items-center space-x-1.5 ${isLight ? 'text-slate-900' : 'text-[#eef0f3]'}`}>
              <Calendar size={13} style={{ color: 'var(--color-accent, #5fd49b)' }} />
              <span>WEEKEND TIMETABLE</span>
            </span>
            <div className="flex items-center space-x-2">
              <span>IST</span>
              <div className={`flex items-center space-x-0.5 border rounded overflow-hidden ${isLight ? 'border-slate-300' : 'border-white/[0.14]'}`}>
                <button
                  onClick={() => setF1WidgetSize('schedule', 'compact')}
                  className={`px-1 py-0.5 text-[9px] font-bold ${
                    isScheduleCompact
                      ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                      : `${mutedClass} hover:text-white`
                  }`}
                  title="Compact size (S)"
                >
                  S
                </button>
                <button
                  onClick={() => setF1WidgetSize('schedule', 'normal')}
                  className={`px-1 py-0.5 text-[9px] font-bold ${
                    !isScheduleCompact
                      ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                      : `${mutedClass} hover:text-white`
                  }`}
                  title="Normal size (M)"
                >
                  M
                </button>
              </div>
            </div>
          </div>

          <div className={`${isScheduleCompact ? 'space-y-1' : 'space-y-2'} overflow-y-auto font-mono flex-1 max-h-[56vh] pr-1`}>
            {sessionsList.map((s) => {
              const isNext = f1.nextSession.name.toLowerCase().includes(s.label.toLowerCase());
              return (
                <div
                  key={s.key}
                  className={`${isScheduleCompact ? 'p-1.5' : 'p-2.5'} ${innerClass} flex items-center justify-between ${
                    isNext ? 'border-l-4' : ''
                  }`}
                  style={isNext ? { borderLeftColor: 'var(--color-accent)' } : undefined}
                >
                  <div>
                    <span className={`${isScheduleCompact ? 'text-[11px]' : 'text-xs'} font-bold block ${isLight ? 'text-slate-900' : 'text-[#eef0f3]'}`}>{s.label}</span>
                    <span className={`${isScheduleCompact ? 'text-[10px]' : 'text-[11px]'} ${mutedClass}`}>{s.data?.istTime}</span>
                  </div>
                  <span
                    className={`text-[10px] uppercase font-mono ${isScheduleCompact ? 'px-1.5 py-0.2' : 'px-2 py-0.5'} border ${
                      s.data?.status.toLowerCase() === 'completed'
                        ? isLight ? 'bg-slate-200 text-slate-500 border-slate-300' : 'bg-white/[0.04] text-[#54565e] border-white/[0.08]'
                        : ''
                    }`}
                    style={s.data?.status.toLowerCase() !== 'completed' ? {
                      backgroundColor: 'var(--theme-accent-soft)',
                      borderColor: 'var(--color-accent)',
                      color: 'var(--color-accent)',
                    } : undefined}
                  >
                    {s.data?.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (3 cols): World Drivers Championship with Switcher */}
        <div className={`col-span-3 flex flex-col ${cardClass} p-5`}>
          <div className={`flex items-center justify-between border-b pb-2 mb-3 text-xs font-mono ${borderDivider}`}>
            <div className="flex space-x-1">
              <button
                onClick={() => setStandingsTab('drivers')}
                className={`px-1.5 py-0.5 border text-[10px] uppercase ${
                  standingsTab === 'drivers'
                    ? 'border-emerald-500 font-bold text-emerald-400 bg-emerald-950/30'
                    : 'border-transparent text-gray-500'
                }`}
              >
                Drivers
              </button>
              <button
                onClick={() => setStandingsTab('constructors')}
                className={`px-1.5 py-0.5 border text-[10px] uppercase ${
                  standingsTab === 'constructors'
                    ? 'border-emerald-500 font-bold text-emerald-400 bg-emerald-950/30'
                    : 'border-transparent text-gray-500'
                }`}
              >
                Teams
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-[10px] ${mutedClass}`}>PTS</span>
              <div className={`flex items-center space-x-0.5 border rounded overflow-hidden ${isLight ? 'border-slate-300' : 'border-white/[0.14]'}`}>
                <button
                  onClick={() => setF1WidgetSize('standings', 'compact')}
                  className={`px-1 py-0.5 text-[9px] font-bold ${
                    isStandingsCompact
                      ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                      : `${mutedClass} hover:text-white`
                  }`}
                  title="Compact size (S)"
                >
                  S
                </button>
                <button
                  onClick={() => setF1WidgetSize('standings', 'normal')}
                  className={`px-1 py-0.5 text-[9px] font-bold ${
                    !isStandingsCompact
                      ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                      : `${mutedClass} hover:text-white`
                  }`}
                  title="Normal size (M)"
                >
                  M
                </button>
              </div>
            </div>
          </div>

          <div className={`${isStandingsCompact ? 'space-y-1' : 'space-y-1.5'} overflow-y-auto max-h-[56vh] font-mono flex-1 pr-1`}>
            {standingsTab === 'drivers' ? (
              f1.standings.map((driver) => (
                <div
                  key={driver.driverCode}
                  className={`${isStandingsCompact ? 'p-1' : 'p-2'} ${innerClass} flex items-center justify-between text-xs`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span className={`w-4 font-bold ${mutedClass}`}>
                      #{driver.position}
                    </span>
                    <span
                      className={`w-1.5 ${isStandingsCompact ? 'h-2.5' : 'h-3.5'} shrink-0`}
                      style={{ backgroundColor: driver.teamColor || '#888' }}
                    />
                    <div className="truncate">
                      {isStandingsCompact ? (
                        <div className="flex items-center space-x-1.5">
                          <span className={`font-bold uppercase ${isLight ? 'text-slate-900' : 'text-[#eef0f3]'}`}>{driver.driverCode || driver.driver}</span>
                          <span className={`text-[9px] truncate ${mutedClass}`}>({driver.team})</span>
                        </div>
                      ) : (
                        <>
                          <span className={`font-bold uppercase block truncate ${isLight ? 'text-slate-900' : 'text-[#eef0f3]'}`}>{driver.driver}</span>
                          <span className={`text-[9px] block truncate ${mutedClass}`}>({driver.team})</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className="font-bold shrink-0 ml-1" style={{ color: 'var(--color-accent, #5fd49b)' }}>
                    {driver.points}
                  </span>
                </div>
              ))
            ) : (
              (f1.constructorStandings || []).map((team) => (
                <div
                  key={team.team}
                  className={`${isStandingsCompact ? 'p-1' : 'p-2'} ${innerClass} flex items-center justify-between text-xs`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span className={`w-4 font-bold ${mutedClass}`}>
                      #{team.position}
                    </span>
                    <span
                      className={`w-1.5 ${isStandingsCompact ? 'h-2.5' : 'h-3.5'} shrink-0`}
                      style={{ backgroundColor: team.teamColor || '#888' }}
                    />
                    <div className="truncate">
                      <span className={`font-bold uppercase block truncate ${isLight ? 'text-slate-900' : 'text-[#eef0f3]'}`}>{team.team}</span>
                      {!isStandingsCompact && (
                        <span className={`text-[9px] block truncate ${mutedClass}`}>
                          {team.wins > 0 ? `${team.wins} wins` : '0 wins'}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="font-bold shrink-0 ml-1" style={{ color: 'var(--color-accent, #5fd49b)' }}>
                    {team.points}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 3. BOTTOM BAR */}
      <div className={`flex items-center justify-between pt-2 text-xs font-mono ${mutedClass}`}>
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-accent)' }} />
          <span>F1 Telemetry: Jolpica Feed Sync Active (2026 Season)</span>
        </div>

        {media.state === 'playing' && (
          <div>
            <AudioBanner compact={true} />
          </div>
        )}
      </div>
    </div>
  );
};
