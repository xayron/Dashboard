import React, { useState } from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { TuiBox } from './TuiBox';
import { F1WidgetsColumn } from '../f1/F1WidgetsColumn';

export const TuiRaceWeekendMode: React.FC = () => {
  const { now, f1, media, weather, colorMode, f1WidgetSizes, setF1WidgetSize } = useDashboard();
  const isLight = colorMode === 'light';
  const [standingsTab, setStandingsTab] = useState<'drivers' | 'constructors'>('drivers');

  const scheduleSize = f1WidgetSizes?.schedule || 'normal';
  const isScheduleCompact = scheduleSize === 'compact';
  const standingsSize = f1WidgetSizes?.standings || 'normal';
  const isStandingsCompact = standingsSize === 'compact';

  const sessionsList = [
    { key: 'fp1', label: 'FP1', data: f1.sessions.fp1 },
    { key: 'fp2', label: 'FP2', data: f1.sessions.fp2 },
    { key: 'fp3', label: 'FP3', data: f1.sessions.fp3 },
    { key: 'sprintQualifying', label: 'SPRINT_QUAL', data: f1.sessions.sprintQualifying },
    { key: 'sprint', label: 'SPRINT_RACE', data: f1.sessions.sprint },
    { key: 'qualifying', label: 'QUALIFYING', data: f1.sessions.qualifying },
    { key: 'race', label: 'GRAND_PRIX', data: f1.sessions.race },
  ].filter(s => s.data !== undefined);

  return (
    <div className={`w-full h-full p-6 flex flex-col justify-between overflow-hidden bg-transparent font-mono select-none ${
      isLight ? 'text-slate-800' : 'text-gray-200'
    }`}>
      {/* Top Telemetry Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-red-600/60 text-xs">
        <div className="flex items-center space-x-3">
          <span className="px-2 py-0.5 bg-red-600 text-white font-black tracking-widest text-xs">
            [F1-PITWALL]
          </span>
          <span className={`font-bold text-sm tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}>{f1.raceName.toUpperCase()}</span>
          <span className={isLight ? 'text-slate-500' : 'text-gray-400'}>({f1.circuitName.toUpperCase()})</span>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          {/* Track Weather Beside Clock */}
          <div className={`px-2.5 py-1 border ${
            isLight ? 'bg-slate-50 border-slate-300 text-slate-800' : 'bg-black/60 border-cyan-500/40 text-cyan-400'
          }`}>
            <span className="font-bold">{weather.temperature}°C {weather.condition.toUpperCase()}</span>
            <span className={`text-[10px] ml-1.5 font-mono ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>WIND: {weather.windSpeed}KM/H</span>
          </div>

          {/* Clock */}
          <div className={`px-2.5 py-1 border ${
            isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-black/60 border-red-500/50 text-white'
          }`}>
            <span className="text-red-500 font-bold">IST: </span>
            <span className="font-mono font-bold">
              {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-red-500 font-bold ml-1">
            <span className="animate-pulse">● LIVE</span>
            <span className={isLight ? 'text-slate-400' : 'text-gray-500'}>|</span>
            <span className={isLight ? 'text-slate-900' : 'text-white'}>R{f1.activeRound}/{f1.totalRounds}</span>
          </div>
        </div>
      </div>

      {/* Main 3-Column Grid */}
      <div className="grid grid-cols-12 gap-5 flex-1 my-3.5 min-h-0">
        {/* Left Col (5 cols): Dynamic Configurable F1 Widgets with Auto-Fitting */}
        <F1WidgetsColumn f1={f1} uiStyle="tui" isLight={isLight} className="col-span-5" />

        {/* Center Col (4 cols): Session Schedule in IST */}
        <div className="col-span-4 flex flex-col">
          <TuiBox
            title="WEEKEND_TIMETABLE_IST"
            badge={
              <div className="flex items-center space-x-1.5">
                <div className="flex items-center space-x-0.5 bg-black/20 dark:bg-white/10 p-0.5 rounded">
                  {(['compact', 'normal'] as const).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      title={`Set Schedule size: ${sz}`}
                      onClick={() => setF1WidgetSize('schedule', sz)}
                      className={`px-1 py-0.2 text-[8px] font-mono uppercase font-bold rounded cursor-pointer ${
                        scheduleSize === sz ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      [{sz === 'compact' ? 'S' : 'M'}]
                    </button>
                  ))}
                </div>
                <span>UTC+5:30</span>
              </div>
            }
            className="flex-1"
          >
            <div className={`${isScheduleCompact ? 'space-y-1' : 'space-y-1.5'} overflow-y-auto max-h-[58vh] pr-1 text-xs`}>
              {sessionsList.map((s) => {
                const isCurrentNext = s.data?.name === f1.nextSession.name;
                return (
                  <div
                    key={s.key}
                    className={`${isScheduleCompact ? 'p-1.5' : 'p-2'} border transition-all ${
                      isCurrentNext
                        ? (isLight ? 'border-red-500 bg-red-50 text-red-950 font-bold' : 'border-red-500 bg-red-950/30 text-white font-bold')
                        : (isLight ? 'border-slate-200 bg-black/[0.02] text-slate-800' : 'border-gray-800 bg-white/5 text-gray-300')
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold">{s.label}</span>
                      <span className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded ${
                        s.data?.status === 'live'
                          ? 'bg-red-600 text-white animate-pulse'
                          : s.data?.status === 'completed'
                          ? (isLight ? 'bg-slate-200 text-slate-600' : 'bg-gray-800 text-gray-400')
                          : isCurrentNext
                          ? 'bg-red-600 text-white border border-red-500'
                          : (isLight ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-950 text-emerald-400')
                      }`}>
                        [{s.data?.status.toUpperCase()}]
                      </span>
                    </div>
                    <div className={`text-[11px] mt-1 font-mono ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>{s.data?.istTime}</div>
                  </div>
                );
              })}
            </div>
          </TuiBox>
        </div>

        {/* Right Col (3 cols): Driver & Constructor Standings */}
        <div className="col-span-3 flex flex-col">
          <TuiBox
            title={standingsTab === 'drivers' ? 'DRIVER_STANDINGS' : 'TEAM_STANDINGS'}
            badge={
              <div className="flex items-center space-x-1.5">
                <div className="flex space-x-0.5">
                  <button
                    onClick={() => setStandingsTab('drivers')}
                    className={`px-1 py-0.2 text-[8px] font-bold ${standingsTab === 'drivers' ? 'bg-red-600 text-white' : 'text-gray-400'}`}
                  >
                    [WDC]
                  </button>
                  <button
                    onClick={() => setStandingsTab('constructors')}
                    className={`px-1 py-0.2 text-[8px] font-bold ${standingsTab === 'constructors' ? 'bg-red-600 text-white' : 'text-gray-400'}`}
                  >
                    [WCC]
                  </button>
                </div>
                <div className="flex items-center space-x-0.5 bg-black/20 dark:bg-white/10 p-0.5 rounded">
                  {(['compact', 'normal'] as const).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      title={`Set Standings size: ${sz}`}
                      onClick={() => setF1WidgetSize('standings', sz)}
                      className={`px-1 py-0.2 text-[8px] font-mono uppercase font-bold rounded cursor-pointer ${
                        standingsSize === sz ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      [{sz === 'compact' ? 'S' : 'M'}]
                    </button>
                  ))}
                </div>
              </div>
            }
            className="flex-1"
          >
            <div className={`${isStandingsCompact ? 'space-y-0.5' : 'space-y-1'} overflow-y-auto max-h-[58vh] pr-1 text-xs`}>
              <div className={`flex items-center justify-between pb-1 border-b text-[10px] font-bold uppercase ${
                isLight ? 'border-slate-200 text-slate-500' : 'border-gray-800 text-gray-500'
              }`}>
                <span>{standingsTab === 'drivers' ? 'POS DRIVER' : 'POS CONSTRUCTOR'}</span>
                <span>PTS</span>
              </div>

              {standingsTab === 'drivers' ? (
                f1.standings.map((driver) => (
                  <div
                    key={driver.driverCode}
                    className={`${isStandingsCompact ? 'p-1' : 'p-1.5'} border flex items-center justify-between ${
                      isLight ? 'border-slate-200 bg-black/[0.02] hover:bg-black/[0.05]' : 'border-gray-900 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <span className={`font-bold w-4 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>{String(driver.position).padStart(2, '0')}</span>
                      <div className="w-1 h-3 shrink-0" style={{ backgroundColor: driver.teamColor }} />
                      <span className={`font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{driver.driverCode}</span>
                      {!isStandingsCompact && (
                        <span className={`text-[10px] truncate ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>({driver.team})</span>
                      )}
                    </div>
                    <span className={`font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>{driver.points}</span>
                  </div>
                ))
              ) : (
                (f1.constructorStandings || []).map((team) => (
                  <div
                    key={team.team}
                    className={`${isStandingsCompact ? 'p-1' : 'p-1.5'} border flex items-center justify-between ${
                      isLight ? 'border-slate-200 bg-black/[0.02] hover:bg-black/[0.05]' : 'border-gray-900 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <span className={`font-bold w-4 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>{String(team.position).padStart(2, '0')}</span>
                      <div className="w-1 h-3 shrink-0" style={{ backgroundColor: team.teamColor }} />
                      <span className={`font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{team.team}</span>
                    </div>
                    <span className={`font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>{team.points}</span>
                  </div>
                ))
              )}
            </div>
          </TuiBox>
        </div>
      </div>

      {/* Bottom Status / Compact Audio Banner */}
      <div className={`flex items-center justify-between pt-2 border-t text-xs ${
        isLight ? 'border-slate-200 text-slate-500' : 'border-gray-800 text-gray-400'
      }`}>
        <div>
          STATUS: <span className="text-red-500 font-bold">[RACE_WEEKEND_MODE_PRIORITY_1]</span>
        </div>

        {media.state === 'playing' && (
          <div
            className={`p-1.5 border flex items-center space-x-2 text-xs ${
              isLight ? 'bg-white text-slate-900 border-slate-300' : 'bg-black text-gray-200'
            }`}
            style={{ borderColor: 'var(--color-accent)' }}
          >
            <span className="animate-pulse" style={{ color: 'var(--color-accent)' }}>● AUDIO:</span>
            <span className={`font-bold truncate max-w-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>{media.title}</span>
            <span className={`truncate max-w-xs ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>- {media.artist}</span>
          </div>
        )}
      </div>
    </div>
  );
};
