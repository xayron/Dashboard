import React, { useState } from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Gauge, Calendar, CloudSun, Award } from 'lucide-react';
import { AudioBanner } from '../common/AudioBanner';
import { F1WidgetsColumn } from '../f1/F1WidgetsColumn';

export const RetrowaveRaceWeekendMode: React.FC = () => {
  const { now, f1, media, weather, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  return (
    <div className={`relative w-full h-full p-6 flex flex-col justify-between overflow-hidden bg-transparent select-none ${
      isLight ? 'text-pink-950' : 'text-pink-100'
    }`}>
      {/* 80s Perspective Floor Lines */}
      <div
        className="absolute inset-x-0 bottom-0 h-64 pointer-events-none opacity-20 z-0"
        style={{
          backgroundImage: 'linear-gradient(to right, var(--color-accent, #ff007f) 1px, transparent 1px), linear-gradient(to bottom, var(--color-accent, #ff007f) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          transform: 'perspective(300px) rotateX(60deg)',
          transformOrigin: 'bottom center',
        }}
      />

      {/* 1. TOP BANNER */}
      <div className={`relative z-10 p-4 rounded-2xl border-2 flex items-center justify-between mb-3.5 ${
        isLight
          ? 'bg-pink-50/90 border-pink-400 shadow-[0_0_25px_rgba(236,72,153,0.18)] text-slate-900'
          : 'bg-[#1e0736]/90 border-pink-500 shadow-[0_0_30px_rgba(255,0,127,0.3)] text-pink-100'
      }`}
      style={{ borderColor: 'var(--color-accent)' }}
      >
        <div className="flex items-center space-x-3.5">
          <div
            className="p-2.5 rounded-xl bg-gradient-to-tr from-pink-600 to-amber-500 text-white shadow-md"
            style={{ boxShadow: isLight ? 'none' : '0 0 15px var(--color-accent)' }}
          >
            <Gauge size={22} className="animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-[10px] px-2 py-0.5 font-black uppercase rounded border ${
                isLight ? 'bg-pink-100 text-pink-900 border-pink-300' : 'bg-pink-950 text-amber-300 border-pink-500'
              }`}>
                STAGE {f1.activeRound}/{f1.totalRounds}
              </span>
              <h1 className={`text-xl font-black italic tracking-wide uppercase ${
                isLight ? 'text-slate-900' : 'text-white drop-shadow-[0_0_10px_rgba(255,0,127,0.6)]'
              }`}>
                {f1.raceName}
              </h1>
            </div>
            <p className={`text-xs font-bold mt-0.5 ${isLight ? 'text-slate-600' : 'text-pink-300'}`}>
              CIRCUIT: {f1.circuitName} • {f1.location}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Circuit Weather Beside Clock */}
          <div className={`text-right px-3.5 py-1.5 rounded-xl border font-mono ${
            isLight ? 'bg-white/80 border-pink-300' : 'bg-pink-950/70 border-pink-500/50'
          }`}>
            <span className={`text-[9px] uppercase font-bold block ${isLight ? 'text-pink-800' : 'text-amber-300'}`}>CIRCUIT METEO</span>
            <span className="text-sm font-black block leading-none" style={{ color: 'var(--color-accent)' }}>
              {weather.temperature}°C {weather.condition}
            </span>
            <span className="text-[9px] font-bold text-rose-500 block mt-0.5">WIND {weather.windSpeed} KM/H // HUM {weather.humidity}%</span>
          </div>

          <div className={`text-right px-4 py-2 rounded-xl border ${
            isLight ? 'bg-white/80 border-pink-300' : 'bg-pink-950/70 border-pink-500/50'
          }`}>
            <span className={`text-[10px] uppercase font-bold block ${isLight ? 'text-pink-800' : 'text-amber-300'}`}>GRID TIME // IST</span>
            <span className="text-sm font-black font-mono tracking-wider" style={{ color: 'var(--color-accent)' }}>
              {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
            </span>
            <span className="text-xs font-black font-mono text-rose-500 block">UTC+5:30 // TRACKSIDE</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN CUSTOMIZABLE F1 WIDGETS GRID */}
      <div className="relative z-10 flex-1 my-2.5 min-h-0 flex flex-col">
        <F1WidgetsColumn f1={f1} uiStyle="retrowave" isLight={isLight} className="h-full flex-1" />
      </div>

      {/* 3. BOTTOM BAR */}
      <div className={`relative z-10 flex items-center justify-between pt-2 border-t text-xs font-bold ${
        isLight ? 'border-pink-300 text-pink-800' : 'border-pink-500/30 text-pink-300/80'
      }`}>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
          <span>SPEEDWAY_TELEMETRY: 2026 LIVE STREAM ACTIVE</span>
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
