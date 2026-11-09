import React, { useState } from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { TuiBox } from './TuiBox';
import { F1WidgetsColumn } from '../f1/F1WidgetsColumn';

export const TuiRaceWeekendMode: React.FC = () => {
  const { now, f1, media, weather, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

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

      {/* Main Customizable F1 Widgets Grid */}
      <div className="flex-1 my-2.5 min-h-0 flex flex-col">
        <F1WidgetsColumn f1={f1} uiStyle="tui" isLight={isLight} className="h-full flex-1" />
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
