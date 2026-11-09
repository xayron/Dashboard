import React from 'react';
import {
  Flag,
  Timer,
  Trophy,
  MapPin,
  Calendar,
  CloudSun,
  Flame,
} from 'lucide-react';
import { useDashboard } from '../../state/DashboardContext';
import { ClockWidget } from '../common/ClockWidget';
import { WeatherWidget } from '../common/WeatherWidget';
import { AudioBanner } from '../common/AudioBanner';

export const RaceWeekendMode: React.FC = () => {
  const { f1, media, colorMode, weather } = useDashboard();
  const isLight = colorMode === 'light';

  const sessionsList = [
    { key: 'fp1', label: 'Practice 1', data: f1.sessions.fp1 },
    { key: 'fp2', label: 'Practice 2', data: f1.sessions.fp2 },
    { key: 'fp3', label: 'Practice 3', data: f1.sessions.fp3 },
    { key: 'sprintQualifying', label: 'Sprint Shootout', data: f1.sessions.sprintQualifying },
    { key: 'sprint', label: 'Sprint Race', data: f1.sessions.sprint },
    { key: 'qualifying', label: 'Qualifying', data: f1.sessions.qualifying },
    { key: 'race', label: 'Grand Prix (Race)', data: f1.sessions.race },
  ].filter(s => s.data !== undefined);

  return (
    <div className={`relative w-full h-full p-8 flex flex-col justify-between overflow-hidden select-none ${
      isLight ? 'bg-transparent text-slate-900' : 'bg-gradient-to-br from-black via-zinc-950 to-red-950/30 text-white'
    }`}>
      {/* Background carbon-fiber & red glow styling */}
      <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none ${
        isLight ? 'bg-red-500/10' : 'bg-red-600/10'
      }`} />
      <div className={`absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none ${
        isLight ? 'bg-orange-500/10' : 'bg-red-900/10'
      }`} />

      {/* 1. TOP HEADER: RACE NAME, CIRCUIT & LIVE CLOCK */}
      <div className={`relative z-10 flex items-start justify-between pb-4 border-b ${
        isLight ? 'border-slate-200' : 'border-white/10'
      }`}>
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-2xl bg-red-600 text-white shadow-lg shadow-red-600/40">
            <Flame size={28} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                isLight ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-red-600/20 text-red-400 border border-red-500/30'
              }`}>
                Formula 1 • Round {f1.activeRound} of {f1.totalRounds}
              </span>
              <span className={`text-xs flex items-center font-medium ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                <MapPin size={12} className="mr-1 text-red-500" />
                {f1.location}, {f1.country}
              </span>
            </div>
            <h1 className={`text-3xl font-extrabold font-display tracking-tight mt-0.5 ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              {f1.raceName}
            </h1>
            <p className={`text-sm font-medium ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>{f1.circuitName}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className={`glass-panel px-5 py-2.5 rounded-2xl border ${
            isLight ? 'bg-white/80 border-slate-200 shadow-sm' : 'border-white/10'
          }`}>
            <ClockWidget size="compact" showSeconds={true} />
          </div>
        </div>
      </div>

      {/* 2. MAIN 1080P GRID: COUNTDOWN, SESSIONS & STANDINGS */}
      <div className="relative z-10 grid grid-cols-12 gap-6 flex-1 my-5 min-h-0">
        {/* Left Col (5 cols): Next Session Hero & Track Stats */}
        <div className="col-span-5 flex flex-col space-y-5">
          {/* Hero Countdown Card */}
          <div className={`glass-panel p-6 rounded-3xl border shadow-xl relative overflow-hidden flex flex-col justify-between flex-1 ${
            isLight
              ? 'border-red-200 bg-gradient-to-br from-red-50/90 via-white/80 to-slate-50/90 text-slate-900'
              : 'border-red-500/30 bg-gradient-to-br from-red-950/40 via-black/60 to-zinc-950/80 text-white'
          }`}>
            <div className="flex items-center justify-between">
              <div className={`flex items-center space-x-2 text-xs uppercase font-extrabold tracking-widest ${
                isLight ? 'text-red-600' : 'text-red-400'
              }`}>
                <Timer size={16} />
                <span>Next Session Countdown</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase bg-red-600 text-white shadow-sm">
                LIVE IN IST
              </span>
            </div>

            <div className="my-4">
              <h2 className={`text-2xl font-bold font-display ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {f1.nextSession.name}
              </h2>
              <p className={`text-sm font-mono-numbers mt-1 flex items-center ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
                <Calendar size={14} className="mr-1.5 text-red-500" />
                {f1.nextSession.istTimeFormatted}
              </p>

              {/* Big Countdown Digits */}
              <div className={`mt-4 p-4 rounded-2xl border flex items-center justify-around font-mono-numbers ${
                isLight ? 'bg-white/80 border-slate-200 shadow-inner' : 'bg-black/60 border-white/10'
              }`}>
                <div className="flex flex-col items-center">
                  <span className={`text-4xl font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {f1.nextSession.countdownFormatted.split(' ')[0] || '00'}
                  </span>
                  <span className={`text-[10px] uppercase tracking-widest font-semibold mt-1 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                    Days / Hrs
                  </span>
                </div>
                <span className="text-2xl text-red-500 font-bold">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-extrabold text-red-500">
                    {f1.nextSession.countdownFormatted.split(' ')[1] || '00m'}
                  </span>
                  <span className={`text-[10px] uppercase tracking-widest font-semibold mt-1 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                    Minutes
                  </span>
                </div>
              </div>
            </div>

            {/* Track telemetry quick facts */}
            <div className={`grid grid-cols-3 gap-2 pt-3 border-t text-xs ${
              isLight ? 'border-slate-200' : 'border-white/10'
            }`}>
              <div className={`p-2 rounded-xl ${isLight ? 'bg-slate-100 border border-slate-200' : 'bg-white/5'}`}>
                <span className={`block text-[10px] uppercase ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>Laps</span>
                <span className={`font-mono-numbers font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>50 Laps</span>
              </div>
              <div className={`p-2 rounded-xl ${isLight ? 'bg-slate-100 border border-slate-200' : 'bg-white/5'}`}>
                <span className={`block text-[10px] uppercase ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>Circuit Length</span>
                <span className={`font-mono-numbers font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>6.201 km</span>
              </div>
              <div className={`p-2 rounded-xl ${isLight ? 'bg-slate-100 border border-slate-200' : 'bg-white/5'}`}>
                <span className={`block text-[10px] uppercase ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>DRS Zones</span>
                <span className="font-mono-numbers font-bold text-red-500 text-sm">2 Zones</span>
              </div>
            </div>
          </div>

          {/* Weather Snapshot for Circuit */}
          <div className="h-36">
            <WeatherWidget layout="compact" className="h-full" />
          </div>
        </div>

        {/* Center Col (4 cols): Session Schedule in IST */}
        <div className={`col-span-4 glass-panel p-5 rounded-3xl border flex flex-col min-h-0 shadow-xl ${
          isLight ? 'bg-white/70 border-slate-200' : 'border-white/10'
        }`}>
          <div className={`flex items-center justify-between mb-4 pb-2 border-b ${
            isLight ? 'border-slate-200' : 'border-white/10'
          }`}>
            <div className={`flex items-center space-x-2 text-sm font-bold uppercase tracking-wider ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              <Calendar size={16} className="text-red-500" />
              <span>Weekend Schedule (IST)</span>
            </div>
            <span className={`text-[11px] font-mono-numbers ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>UTC+5:30</span>
          </div>

          <div className="space-y-2.5 overflow-y-auto pr-1 flex-1">
            {sessionsList.map((s) => {
              const isCurrentNext = s.data?.name === f1.nextSession.name;
              return (
                <div
                  key={s.key}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                    isCurrentNext
                      ? isLight
                        ? 'bg-red-50 border-red-400 shadow-md'
                        : 'bg-red-950/40 border-red-500/60 shadow-lg shadow-red-900/20'
                      : isLight
                        ? 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        : 'bg-white/5 border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        s.data?.status === 'live'
                          ? 'bg-red-500 animate-ping'
                          : s.data?.status === 'completed'
                          ? isLight ? 'bg-slate-400' : 'bg-gray-500'
                          : 'bg-emerald-500'
                      }`}
                    />
                    <div>
                      <h4 className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{s.label}</h4>
                      <p className={`text-[11px] font-mono-numbers mt-0.5 ${isLight ? 'text-slate-500' : 'text-gray-300'}`}>{s.data?.istTime}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      s.data?.status === 'live'
                        ? 'bg-red-600 text-white animate-pulse'
                        : s.data?.status === 'completed'
                        ? isLight ? 'bg-slate-200 text-slate-600' : 'bg-white/10 text-gray-400'
                        : isCurrentNext
                        ? isLight ? 'bg-red-600 text-white' : 'bg-red-500/30 text-red-200 border border-red-500/40'
                        : isLight ? 'bg-blue-100 text-blue-700' : 'bg-blue-500/20 text-blue-300'
                    }`}
                  >
                    {s.data?.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col (3 cols): Driver Championship Standings */}
        <div className={`col-span-3 glass-panel p-5 rounded-3xl border flex flex-col min-h-0 shadow-xl ${
          isLight ? 'bg-white/70 border-slate-200' : 'border-white/10'
        }`}>
          <div className={`flex items-center justify-between mb-4 pb-2 border-b ${
            isLight ? 'border-slate-200' : 'border-white/10'
          }`}>
            <div className={`flex items-center space-x-2 text-sm font-bold uppercase tracking-wider ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              <Trophy size={16} className="text-amber-500" />
              <span>Standings</span>
            </div>
            <span className={`text-[11px] font-bold uppercase ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>PTS</span>
          </div>

          <div className="space-y-1.5 overflow-y-auto pr-1 flex-1">
            {f1.standings.map(driver => (
              <div
                key={driver.driverCode}
                className={`p-2.5 rounded-xl transition-all flex items-center justify-between text-xs ${
                  isLight
                    ? 'bg-slate-50 hover:bg-slate-100 border border-slate-200'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span className={`font-mono-numbers font-bold w-4 text-center ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                    {driver.position}
                  </span>
                  <div
                    className="w-1 h-5 rounded-full"
                    style={{ backgroundColor: driver.teamColor }}
                  />
                  <div className="truncate max-w-[110px]">
                    <p className={`font-bold leading-none truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{driver.driver}</p>
                    <p className={`text-[10px] mt-0.5 truncate ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>{driver.team}</p>
                  </div>
                </div>

                <span className={`font-mono-numbers font-extrabold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {driver.points}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. BOTTOM BAR: OVERRIDE SAFETY AUDIO BANNER */}
      <div className="relative z-10 flex items-center justify-between pt-2">
        <div className={`text-xs flex items-center space-x-2 ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>F1 Telemetry Connected via Jolpica-F1 Service</span>
        </div>

        {media.state === 'playing' && (
          <div>
            <AudioBanner />
          </div>
        )}
      </div>
    </div>
  );
};
