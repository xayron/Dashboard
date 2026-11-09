import React, { useState } from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Calendar, CloudSun, Award } from 'lucide-react';
import { AudioBanner } from '../common/AudioBanner';
import { F1WidgetsColumn } from '../f1/F1WidgetsColumn';

export const CivicRaceWeekendMode: React.FC = () => {
  const { now, f1, media, weather, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  const cardClass = isLight
    ? 'bg-white border border-slate-300 rounded-xl shadow-sm text-slate-900'
    : 'bg-slate-900/90 border border-slate-700 rounded-xl shadow-md text-slate-100';

  const mutedClass = isLight ? 'text-slate-500' : 'text-slate-400';
  const borderDivider = isLight ? 'border-slate-100' : 'border-slate-800';

  return (
    <div className={`w-full h-full p-8 flex flex-col justify-between overflow-hidden bg-transparent select-none font-sans ${
      isLight ? 'text-slate-900' : 'text-slate-100'
    }`}>
      {/* 1. TOP BANNER: RACE WEEKEND MASTHEAD */}
      <div className={`p-4 ${cardClass} flex items-center justify-between mb-3.5 relative overflow-hidden`}>
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#f97316] via-slate-300 to-[#16a34a]" />

        <div>
          <div className={`flex items-center space-x-2 text-xs font-mono ${mutedClass}`}>
            <span style={{ color: 'var(--color-accent, #f97316)' }} className="font-extrabold uppercase">FORMULA 1 WORLD CHAMPIONSHIP</span>
            <span>•</span>
            <span className="font-bold">ROUND {f1.activeRound} OF {f1.totalRounds}</span>
            <span>•</span>
            <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 font-bold">
              RACE WEEKEND
            </span>
          </div>
          <h1 className={`text-2xl font-mono font-black tracking-tight mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>{f1.raceName}</h1>
          <p className={`text-xs font-mono mt-0.5 ${mutedClass}`}>{f1.circuitName} — {f1.location}</p>
        </div>

        <div className="flex items-center space-x-6">
          {/* Circuit Weather Beside Clock */}
          <div className={`text-right border-l pl-6 font-mono ${isLight ? 'border-slate-200' : 'border-slate-700'}`}>
            <span className={`text-[10px] uppercase block font-bold ${mutedClass}`}>Track Meteorological</span>
            <span className={`text-base font-black tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {weather.temperature}°C {weather.condition}
            </span>
            <span className="text-xs block font-mono font-bold mt-0.5" style={{ color: 'var(--color-accent, #f97316)' }}>
              Wind {weather.windSpeed} km/h • Hum {weather.humidity}%
            </span>
          </div>

          <div className={`text-right border-l pl-6 font-mono ${isLight ? 'border-slate-200' : 'border-slate-700'}`}>
            <span className={`text-[10px] uppercase block font-bold ${mutedClass}`}>Official Clock • IST</span>
            <span className={`text-base font-black tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
            </span>
            <span className="text-xs block font-black mt-0.5" style={{ color: 'var(--color-accent, #f97316)' }}>UTC+5:30 // TRACKSIDE</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN CUSTOMIZABLE F1 WIDGETS GRID */}
      <div className="flex-1 my-2.5 min-h-0 flex flex-col">
        <F1WidgetsColumn f1={f1} uiStyle="civic" isLight={isLight} className="h-full flex-1" />
      </div>

      {/* 3. BOTTOM BAR */}
      <div className={`flex items-center justify-between pt-2 text-xs font-mono ${mutedClass}`}>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>F1 Telemetry Connected via Jolpica-F1 Service (2026 Feed)</span>
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
