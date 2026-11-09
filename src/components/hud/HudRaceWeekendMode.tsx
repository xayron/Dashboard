import React, { useState } from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { HudBox } from './HudBox';
import { Gauge, Calendar, CloudSun, Award, Zap } from 'lucide-react';
import { AudioBanner } from '../common/AudioBanner';
import { F1WidgetsColumn } from '../f1/F1WidgetsColumn';

export const HudRaceWeekendMode: React.FC = () => {
  const { now, f1, media, weather, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  return (
    <div className={`w-full h-full p-6 flex flex-col justify-between overflow-hidden bg-transparent font-mono select-none ${
      isLight ? 'text-slate-900' : 'text-cyan-200'
    }`}>
      {/* 1. TOP TELEMETRY HEADER */}
      <div className={`p-3 border flex items-center justify-between mb-3.5 ${
        isLight
          ? 'bg-cyan-50/80 border-cyan-400/50 shadow-[0_0_20px_rgba(0,180,216,0.1)]'
          : 'bg-[#050e20] border-cyan-500/50 shadow-[0_0_20px_rgba(0,240,255,0.08)]'
      }`}>
        <div className="flex items-center space-x-3">
          <div
            className="p-2 border"
            style={{
              backgroundColor: 'var(--theme-accent-soft)',
              borderColor: 'var(--color-accent)',
              color: 'var(--color-accent)',
            }}
          >
            <Gauge size={22} className="animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] bg-red-950/80 text-red-400 border border-red-500/50 px-2 py-0.5">
                ROUND {f1.activeRound}/{f1.totalRounds}
              </span>
              <h1 className={`text-xl font-black tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}>{f1.raceName}</h1>
            </div>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-cyan-400'}`}>
              CIRCUIT: {f1.circuitName} // {f1.location}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Circuit Weather Beside Clock */}
          <div className={`px-3 py-1.5 border text-right font-mono ${
            isLight ? 'bg-cyan-100/60 border-cyan-400 text-slate-800' : 'bg-black/60 border-cyan-500/40 text-cyan-300'
          }`}>
            <span className="text-[9px] block opacity-75">CIRCUIT_METEO</span>
            <span className="text-sm font-bold block leading-none">{weather.temperature}°C // {weather.condition.toUpperCase()}</span>
            <span className="text-[9px] block opacity-75 mt-0.5">WIND: {weather.windSpeed} KM/H // HUM: {weather.humidity}%</span>
          </div>

          <div className="text-right">
            <span className={`text-[10px] block ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>SYSTEM_TIME // IST</span>
            <span className="text-sm font-bold font-mono tracking-wider" style={{ color: 'var(--color-accent)' }}>
              {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
            </span>
            <span className={`text-[10px] block ${isLight ? 'text-slate-600' : 'text-cyan-300'}`}>UTC+5:30 // TELEMETRY</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN CUSTOMIZABLE F1 WIDGETS GRID */}
      <div className="flex-1 my-2.5 min-h-0 flex flex-col">
        <F1WidgetsColumn f1={f1} uiStyle="hud" isLight={isLight} className="h-full flex-1" />
      </div>

      {/* 3. BOTTOM STATUS BAR */}
      <div className={`flex items-center justify-between pt-2 border-t text-xs ${
        isLight ? 'border-cyan-200 text-slate-600' : 'border-cyan-500/20 text-cyan-400/80'
      }`}>
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>PITWALL_ONLINE // JOLPICA_2026_LIVE_FEED</span>
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
