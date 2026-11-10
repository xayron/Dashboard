import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Activity } from 'lucide-react';
import { AudioBanner } from '../common/AudioBanner';
import { MorningWidgetsGrid } from '../morning/MorningWidgetsGrid';

export const ObsidianMorningMode: React.FC = () => {
  const { weather, media, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  const mutedClass = isLight ? 'text-slate-500' : 'text-[#9a9da6]';

  return (
    <div className={`w-full h-full p-6 flex flex-col justify-between overflow-hidden bg-transparent select-none font-sans relative ${
      isLight ? 'text-slate-900' : 'text-[#eef0f3]'
    }`}>
      {/* Obsidian Crystal Glow Effect */}
      <div
        className="absolute top-0 inset-x-0 h-64 pointer-events-none opacity-25 z-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, var(--color-glow, rgba(95,212,155,0.2)), transparent 70%)',
        }}
      />

      {/* Top Briefing Rail */}
      <div className={`relative z-10 flex items-center justify-between mb-4 pb-3 border-b shrink-0 ${
        isLight ? 'border-slate-200' : 'border-white/[0.12]'
      }`}>
        <div className="flex items-center space-x-3">
          <div
            className={`p-2 border ${isLight ? 'bg-slate-100 border-slate-300' : 'bg-[#101017] border-white/[0.18]'}`}
            style={{ color: 'var(--color-accent)' }}
          >
            <Activity size={20} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className={`text-xl font-bold tracking-tight font-display ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Obsidian Dispatch
              </h1>
              <span
                className="px-2 py-0.5 text-[10px] font-mono tracking-wider uppercase border"
                style={{
                  backgroundColor: 'var(--theme-accent-soft)',
                  borderColor: 'var(--color-accent)',
                  color: 'var(--color-accent)',
                }}
              >
                DAILY NEXUS
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${mutedClass}`}>
              Sunrise was at {weather.sunrise} • Anticipated high {weather.highTemp}°C
            </p>
          </div>
        </div>

        {media.state === 'playing' && <AudioBanner compact={true} />}
      </div>

      {/* Main Resizable 12-Column Slot Grid */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col">
        <MorningWidgetsGrid uiStyle="obsidian" isLight={isLight} className="h-full flex-1" />
      </div>
    </div>
  );
};
