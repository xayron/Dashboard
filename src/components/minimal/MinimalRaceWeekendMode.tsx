import React, { useState } from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Calendar, CloudSun, Award, Zap } from 'lucide-react';
import { AudioBanner } from '../common/AudioBanner';
import { F1WidgetsColumn } from '../f1/F1WidgetsColumn';

export const MinimalRaceWeekendMode: React.FC = () => {
  const { now, f1, media, weather, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  return (
    <div className={`w-full h-full px-8 xl:px-10 pt-2 pb-6 flex flex-col justify-between overflow-hidden bg-transparent select-none font-sans ${isLight ? 'text-neutral-900' : 'text-neutral-100'}`}>
      {/* 1. TOP HEADING */}
      <div className={`flex items-baseline justify-between pb-4 border-b ${isLight ? 'border-neutral-200' : 'border-white/10'}`}>
        <div>
          <span className={`text-[11px] font-mono tracking-widest uppercase block mb-1 ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>
            Round {f1.activeRound} of {f1.totalRounds} • {f1.country}
          </span>
          <h1 className={`text-2xl font-light tracking-tight ${isLight ? 'text-neutral-900' : 'text-white'}`}>{f1.raceName}</h1>
          <p className={`text-xs font-light mt-0.5 ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>{f1.circuitName}</p>
        </div>

        <div className="flex items-center space-x-5">
          {/* Track Weather Beside Clock */}
          <div className="text-right">
            <span className={`text-[11px] font-mono uppercase block ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>Circuit Weather</span>
            <span className={`text-base font-light font-mono ${isLight ? 'text-neutral-900' : 'text-white'}`}>
              {weather.temperature}°C {weather.condition}
            </span>
            <span className="text-xs font-mono block mt-0.5 opacity-70">Wind {weather.windSpeed} km/h • Hum {weather.humidity}%</span>
          </div>

          <div className={`h-8 w-px ${isLight ? 'bg-neutral-200' : 'bg-white/10'}`} />

          <div className="text-right">
            <span className={`text-[11px] font-mono uppercase block ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>Official Time (IST)</span>
            <span className={`text-base font-medium font-mono ${isLight ? 'text-neutral-900' : 'text-white'}`}>
              {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
            </span>
            <span className="text-xs font-mono font-medium block mt-0.5" style={{ color: 'var(--color-accent)' }}>UTC+5:30</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN CUSTOMIZABLE F1 WIDGETS GRID */}
      <div className="flex-1 my-2.5 min-h-0 flex flex-col pt-2">
        <F1WidgetsColumn f1={f1} uiStyle="minimal" isLight={isLight} className="h-full flex-1" />
      </div>

      {/* 3. BOTTOM BAR */}
      <div className={`flex items-center justify-between pt-2.5 border-t text-xs font-mono ${
        isLight ? 'border-neutral-200 text-neutral-500' : 'border-white/10 text-neutral-500'
      }`}>
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>F1 Telemetry: Jolpica API Live Feed</span>
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
