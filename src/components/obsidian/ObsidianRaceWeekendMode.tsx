import React, { useState } from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Calendar, CloudSun, Award } from 'lucide-react';
import { AudioBanner } from '../common/AudioBanner';
import { F1WidgetsColumn } from '../f1/F1WidgetsColumn';

export const ObsidianRaceWeekendMode: React.FC = () => {
  const { now, f1, media, weather, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  const cardClass = isLight
    ? 'bg-white/95 border border-slate-200 text-slate-900 shadow-sm'
    : 'bg-[#0f0f15] border border-white/[0.14] text-[#eef0f3] shadow-lg';

  const mutedClass = isLight ? 'text-slate-500' : 'text-[#9a9da6]';

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

      {/* 2. MAIN CUSTOMIZABLE F1 WIDGETS GRID */}
      <div className="flex-1 my-2.5 min-h-0 flex flex-col">
        <F1WidgetsColumn f1={f1} uiStyle="obsidian" isLight={isLight} className="h-full flex-1" />
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
