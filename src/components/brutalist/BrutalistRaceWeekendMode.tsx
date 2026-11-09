import React, { useState } from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { BrutalistBox } from './BrutalistBox';
import { Flame, MapPin, Calendar, Award, Zap, CloudSun } from 'lucide-react';
import { AudioBanner } from '../common/AudioBanner';
import { F1WidgetsColumn } from '../f1/F1WidgetsColumn';

export const BrutalistRaceWeekendMode: React.FC = () => {
  const { now, f1, media, weather, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  return (
    <div className={`w-full h-full p-6 flex flex-col justify-between overflow-hidden bg-transparent select-none ${isLight ? 'text-black' : 'text-white'}`}>
      {/* 1. TOP BANNER */}
      <div className={`p-4 bg-red-600 text-white border-4 border-black flex items-center justify-between mb-3.5 ${
        isLight ? 'shadow-[5px_5px_0px_#000]' : 'shadow-[5px_5px_0px_#fff]'
      }`}>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-black text-yellow-400">
            <Flame size={24} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black uppercase tracking-widest bg-black px-2 py-0.5">
                ROUND {f1.activeRound}/{f1.totalRounds}
              </span>
              <h1 className="text-xl font-black uppercase tracking-tight">{f1.raceName}</h1>
            </div>
            <p className="text-xs font-bold text-red-100 flex items-center mt-0.5 uppercase">
              <MapPin size={12} className="mr-1" /> {f1.circuitName} • {f1.location}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Track Weather Beside Clock */}
          <div className={`px-3 py-1.5 border-2 border-white text-left ${
            isLight ? 'bg-yellow-400 text-black shadow-[3px_3px_0px_#000]' : 'bg-yellow-400 text-black shadow-[3px_3px_0px_#fff]'
          }`}>
            <span className="text-[9px] font-black uppercase tracking-wider block">CIRCUIT WEATHER</span>
            <div className="font-mono font-black text-sm flex items-center space-x-1.5">
              <span>{weather.temperature}°C {weather.condition.toUpperCase()}</span>
            </div>
            <span className="text-[9px] font-mono font-bold block">WIND {weather.windSpeed} KM/H</span>
          </div>

          <div className={`bg-black text-yellow-400 px-4 py-2 border-2 border-white text-right ${
            isLight ? 'shadow-[3px_3px_0px_#000]' : 'shadow-[3px_3px_0px_#000]'
          }`}>
            <span className="text-[10px] font-black uppercase tracking-wider block text-white">LIVE TIME • IST</span>
            <span className="text-base font-black text-yellow-300 font-mono tracking-wider">
              {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
            </span>
            <span className="text-[10px] font-mono font-bold block text-red-400 uppercase">UTC+5:30 TRACKSIDE</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN CUSTOMIZABLE F1 WIDGETS GRID */}
      <div className="flex-1 my-2.5 min-h-0 flex flex-col">
        <F1WidgetsColumn f1={f1} uiStyle="brutalist" isLight={isLight} className="h-full flex-1" />
      </div>

      {/* 3. BOTTOM BAR */}
      <div className={`flex items-center justify-between pt-2 border-t-2 border-black text-xs font-black uppercase ${
        isLight ? 'text-neutral-800' : 'text-neutral-300'
      }`}>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-red-600 animate-pulse border border-black" />
          <span>F1_PITWALL: 2026 LIVE TELEMETRY FEED</span>
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
