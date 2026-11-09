import React, { useState } from 'react';
import {
  Timer,
  Trophy,
  MapPin,
  Calendar,
  Flame,
  Award,
  Zap,
  Gauge,
  Users,
  ChevronRight,
  CloudSun,
} from 'lucide-react';
import { useDashboard } from '../../state/DashboardContext';
import { ClockWidget } from '../common/ClockWidget';
import { WeatherWidget } from '../common/WeatherWidget';
import { AudioBanner } from '../common/AudioBanner';
import { F1WidgetsColumn } from '../f1/F1WidgetsColumn';

export const RaceWeekendMode: React.FC = () => {
  const { f1, media, weather, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

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
      <div className={`relative z-10 flex items-start justify-between pb-3.5 border-b ${
        isLight ? 'border-slate-200' : 'border-white/10'
      }`}>
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-2xl bg-red-600 text-white shadow-lg shadow-red-600/40">
            <Flame size={26} className="animate-pulse" />
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
            <h1 className={`text-2xl font-extrabold font-display tracking-tight mt-0.5 ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              {f1.raceName}
            </h1>
            <p className={`text-xs font-medium ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>{f1.circuitName}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Track Weather Beside Clock */}
          <div className={`glass-panel px-4 py-2 rounded-2xl border flex items-center space-x-2.5 ${
            isLight ? 'bg-white/80 border-slate-200 shadow-sm text-slate-800' : 'border-white/10 bg-white/[0.03] text-white'
          }`}>
            <CloudSun size={18} className="text-amber-500 shrink-0" />
            <div>
              <div className="text-xs font-bold leading-none">{weather.temperature}°C {weather.condition}</div>
              <div className={`text-[10px] font-mono mt-0.5 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                Wind {weather.windSpeed} km/h • Hum {weather.humidity}%
              </div>
            </div>
          </div>

          {/* Clock Widget */}
          <div className={`glass-panel px-5 py-2 rounded-2xl border ${
            isLight ? 'bg-white/80 border-slate-200 shadow-sm' : 'border-white/10'
          }`}>
            <ClockWidget size="compact" showSeconds={true} />
          </div>
        </div>
      </div>

      {/* 2. MAIN CUSTOMIZABLE F1 WIDGETS GRID */}
      <div className="relative z-10 flex-1 my-2.5 min-h-0 flex flex-col">
        <F1WidgetsColumn f1={f1} uiStyle="modern" isLight={isLight} className="h-full flex-1" />
      </div>

      {/* 3. BOTTOM BAR: OVERRIDE SAFETY AUDIO BANNER */}
      <div className="relative z-10 flex items-center justify-between pt-1.5">
        <div className={`text-xs flex items-center space-x-2 ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>F1 Telemetry Connected via Jolpica-F1 Service (Live Feed)</span>
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
