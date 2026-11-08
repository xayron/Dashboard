import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { TuiBox } from './TuiBox';

export const TuiRaceWeekendMode: React.FC = () => {
  const { f1, media, now } = useDashboard();

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
    <div className="w-full h-full p-6 flex flex-col justify-between overflow-hidden bg-black font-mono text-gray-200 select-none">
      {/* Top Telemetry Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-red-600/60 text-xs">
        <div className="flex items-center space-x-3">
          <span className="px-2 py-0.5 bg-red-600 text-white font-black tracking-widest text-xs">
            [F1-PITWALL]
          </span>
          <span className="text-white font-bold text-sm tracking-wide">{f1.raceName.toUpperCase()}</span>
          <span className="text-gray-400">({f1.circuitName.toUpperCase()})</span>
        </div>

        <div className="flex items-center space-x-3 text-red-400 font-bold">
          <span className="animate-pulse">● LIVE_TELEMETRY</span>
          <span className="text-gray-500">|</span>
          <span className="text-white">ROUND {f1.activeRound}/{f1.totalRounds}</span>
        </div>
      </div>

      {/* Main 3-Column Grid */}
      <div className="grid grid-cols-12 gap-5 flex-1 my-4 min-h-0">
        {/* Left Col (5 cols): Next Session Hero & Track Metrics */}
        <div className="col-span-5 flex flex-col space-y-4">
          <TuiBox
            title="NEXT_SESSION_COUNTDOWN"
            badge="LIVE IN IST"
            badgeColor="text-red-400"
            className="flex-1 border-red-500/50"
          >
            <div className="flex flex-col justify-between h-full py-2">
              <div>
                <div className="text-xs text-gray-400">TARGET_EVENT:</div>
                <div className="text-2xl font-black text-white mt-0.5">{f1.nextSession.name.toUpperCase()}</div>
                <div className="text-xs text-red-400 mt-1 font-bold">&gt;&gt; {f1.nextSession.istTimeFormatted}</div>
              </div>

              {/* Huge T-Minus Terminal Box */}
              <div className="my-3 p-4 bg-red-950/20 border-2 border-red-500/60 text-center">
                <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                  COUNTDOWN TO SESSION GREEN LIGHT
                </div>
                <div className="text-4xl font-black text-red-500 mt-1 tracking-wider animate-pulse">
                  T-{f1.nextSession.countdownFormatted}
                </div>
              </div>

              {/* Circuit Stats Table */}
              <div className="grid grid-cols-3 gap-2 text-[11px] pt-2 border-t border-gray-800">
                <div className="p-1.5 bg-white/5 border border-white/10">
                  <div className="text-gray-400 text-[10px]">LAPS</div>
                  <div className="text-white font-bold">50 LAPS</div>
                </div>
                <div className="p-1.5 bg-white/5 border border-white/10">
                  <div className="text-gray-400 text-[10px]">CIRCUIT</div>
                  <div className="text-white font-bold">6.201 KM</div>
                </div>
                <div className="p-1.5 bg-white/5 border border-white/10">
                  <div className="text-gray-400 text-[10px]">DRS ZONES</div>
                  <div className="text-red-400 font-bold">2 ZONES</div>
                </div>
              </div>
            </div>
          </TuiBox>
        </div>

        {/* Center Col (4 cols): Session Schedule in IST */}
        <div className="col-span-4 flex flex-col">
          <TuiBox
            title="WEEKEND_TIMETABLE_IST"
            badge="UTC+5:30"
            className="flex-1"
          >
            <div className="space-y-1.5 overflow-y-auto max-h-[58vh] pr-1 text-xs">
              {sessionsList.map((s) => {
                const isCurrentNext = s.data?.name === f1.nextSession.name;
                return (
                  <div
                    key={s.key}
                    className={`p-2 border transition-all ${
                      isCurrentNext
                        ? 'border-red-500 bg-red-950/30 text-white font-bold'
                        : 'border-gray-800 bg-white/5 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold">{s.label}</span>
                      <span className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded ${
                        s.data?.status === 'live'
                          ? 'bg-red-600 text-white animate-pulse'
                          : s.data?.status === 'completed'
                          ? 'bg-gray-800 text-gray-400'
                          : isCurrentNext
                          ? 'bg-red-900 text-red-200 border border-red-500'
                          : 'bg-emerald-950 text-emerald-400'
                      }`}>
                        [{s.data?.status.toUpperCase()}]
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1 font-mono">{s.data?.istTime}</div>
                  </div>
                );
              })}
            </div>
          </TuiBox>
        </div>

        {/* Right Col (3 cols): Driver Championship Standings */}
        <div className="col-span-3 flex flex-col">
          <TuiBox
            title="DRIVER_STANDINGS"
            badge="TOP 8"
            className="flex-1"
          >
            <div className="space-y-1 overflow-y-auto max-h-[58vh] pr-1 text-xs">
              <div className="flex items-center justify-between pb-1 border-b border-gray-800 text-[10px] text-gray-500 font-bold uppercase">
                <span>POS DRIVER</span>
                <span>PTS</span>
              </div>
              {f1.standings.map((driver) => (
                <div
                  key={driver.driverCode}
                  className="p-1.5 border border-gray-900 bg-white/5 hover:bg-white/10 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span className="text-gray-400 font-bold w-4">{String(driver.position).padStart(2, '0')}</span>
                    <span className="text-white font-bold truncate">{driver.driverCode}</span>
                    <span className="text-[10px] text-gray-400 truncate">({driver.team})</span>
                  </div>
                  <span className="font-extrabold text-white">{driver.points}</span>
                </div>
              ))}
            </div>
          </TuiBox>
        </div>
      </div>

      {/* Bottom Status / Compact Audio Banner */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-800 text-xs text-gray-400">
        <div>
          STATUS: <span className="text-red-400 font-bold">[RACE_WEEKEND_MODE_PRIORITY_1]</span>
        </div>

        {media.state === 'playing' && (
          <div className="p-1.5 border border-emerald-500/40 bg-black text-emerald-400 flex items-center space-x-2 text-xs">
            <span className="animate-pulse">● AUDIO:</span>
            <span className="text-white font-bold truncate max-w-xs">{media.title}</span>
            <span className="text-gray-400 truncate max-w-xs">- {media.artist}</span>
          </div>
        )}
      </div>
    </div>
  );
};
