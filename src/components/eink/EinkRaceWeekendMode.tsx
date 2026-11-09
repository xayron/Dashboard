import React, { useState } from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Calendar, CloudSun, Award } from 'lucide-react';
import { AudioBanner } from '../common/AudioBanner';
import { F1WidgetsColumn } from '../f1/F1WidgetsColumn';

export const EinkRaceWeekendMode: React.FC = () => {
  const { now, f1, media, weather, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  return (
    <div className={`w-full h-full p-8 flex flex-col justify-between overflow-hidden bg-transparent font-serif select-none ${
      isLight ? 'text-[#1c1917]' : 'text-[#f5f2eb]'
    }`}>
      {/* 1. TOP BANNER */}
      <div className={`p-4 border-2 flex items-center justify-between mb-3.5 ${
        isLight
          ? 'border-stone-800 bg-[#ede8df] shadow-[3px_3px_0px_#1c1917]'
          : 'border-stone-500 bg-[#292524] shadow-[3px_3px_0px_#000]'
      }`}>
        <div>
          <div className={`flex items-center space-x-2 text-xs font-mono uppercase ${
            isLight ? 'text-stone-600' : 'text-stone-400'
          }`}>
            <span>MOTORSPORT GAZETTE</span>
            <span>•</span>
            <span>ROUND {f1.activeRound} OF {f1.totalRounds}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight uppercase mt-0.5">{f1.raceName}</h1>
          <p className={`text-xs italic ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>{f1.circuitName} — {f1.location}</p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Circuit Weather Beside Clock */}
          <div className={`text-right border-l pl-4 font-mono ${isLight ? 'border-stone-400' : 'border-stone-600'}`}>
            <span className={`text-[10px] uppercase block ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>Almanac Weather</span>
            <span className="text-base font-bold block leading-none">
              {weather.temperature}°C {weather.condition}
            </span>
            <span className={`text-xs block mt-0.5 ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>Wind {weather.windSpeed} km/h • Hum {weather.humidity}%</span>
          </div>

          <div className={`text-right border-l pl-4 ${isLight ? 'border-stone-400' : 'border-stone-600'}`}>
            <span className={`text-[10px] font-mono uppercase block ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>Gazette Time • IST</span>
            <span className="text-base font-bold font-mono" style={{ color: 'var(--color-accent)' }}>
              {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
            </span>
            <span className={`text-xs font-mono block ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>UTC+5:30</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN CUSTOMIZABLE F1 WIDGETS GRID */}
      <div className="flex-1 my-2.5 min-h-0 flex flex-col">
        <F1WidgetsColumn f1={f1} uiStyle="eink" isLight={isLight} className="h-full flex-1" />
      </div>

      {/* 3. BOTTOM BAR */}
      <div className={`flex items-center justify-between pt-2 border-t-2 text-xs font-mono ${
        isLight ? 'border-stone-800 text-stone-600' : 'border-stone-600 text-stone-400'
      }`}>
        <div className="flex items-center space-x-2">
          <span>● TELEMETRY: DISPATCHED VIA JOLPICA RACING SERVICES (2026 LIVE)</span>
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
