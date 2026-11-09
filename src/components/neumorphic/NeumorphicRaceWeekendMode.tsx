import React, { useState } from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Gauge, Calendar, CloudSun, Award } from 'lucide-react';
import { AudioBanner } from '../common/AudioBanner';
import { F1WidgetsColumn } from '../f1/F1WidgetsColumn';

export const NeumorphicRaceWeekendMode: React.FC = () => {
  const { now, f1, media, weather, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  const cardClass = isLight
    ? 'bg-[#e2e8f0] shadow-[6px_6px_14px_#cbd5e1,-6px_-6px_14px_#ffffff] text-slate-900'
    : 'bg-[#1a1d24] shadow-[6px_6px_14px_#101217,-6px_-6px_14px_#242831] text-neutral-200';

  const insetClass = isLight
    ? 'bg-[#e2e8f0] shadow-[inset_2px_2px_5px_#cbd5e1,inset_-2px_-2px_5px_#ffffff]'
    : 'bg-[#1a1d24] shadow-[inset_2px_2px_5px_#101217,inset_-2px_-2px_5px_#242831]';

  return (
    <div className={`w-full h-full p-8 flex flex-col justify-between overflow-hidden bg-transparent select-none ${
      isLight ? 'text-slate-900' : 'text-neutral-200'
    }`}>
      {/* 1. TOP BANNER */}
      <div className={`p-4 rounded-3xl ${cardClass} flex items-center justify-between mb-3.5`}>
        <div className="flex items-center space-x-3.5">
          <div className={`p-2.5 rounded-2xl ${insetClass} text-red-500`}>
            <Gauge size={22} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-[10px] px-2 py-0.5 rounded-lg ${insetClass} text-red-500 font-bold uppercase`}>
                Round {f1.activeRound}/{f1.totalRounds}
              </span>
              <h1 className={`text-xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>{f1.raceName}</h1>
            </div>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
              {f1.circuitName} • {f1.location}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Track Weather Beside Clock */}
          <div className={`text-right px-4 py-2 rounded-2xl ${insetClass}`}>
            <span className={`text-[10px] uppercase block font-medium ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>Circuit Weather</span>
            <span className={`text-sm font-bold font-mono tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {weather.temperature}°C {weather.condition}
            </span>
            <span className={`text-[10px] font-mono block mt-0.5 ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>
              Wind {weather.windSpeed} km/h • Hum {weather.humidity}%
            </span>
          </div>

          <div className={`text-right px-4 py-2 rounded-2xl ${insetClass}`}>
            <span className={`text-[10px] uppercase block font-medium ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>Official Time (IST)</span>
            <span className={`text-sm font-bold font-mono tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
            </span>
            <span className="text-xs font-mono font-bold text-red-500 block">UTC+5:30</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN CUSTOMIZABLE F1 WIDGETS GRID */}
      <div className="flex-1 my-2.5 min-h-0 flex flex-col">
        <F1WidgetsColumn f1={f1} uiStyle="neumorphic" isLight={isLight} className="h-full flex-1" />
      </div>

      {/* 3. BOTTOM BAR */}
      <div className={`flex items-center justify-between pt-2 text-xs ${
        isLight ? 'text-slate-500' : 'text-neutral-500'
      }`}>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>F1 Telemetry Connected (2026 Grid Sync)</span>
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
