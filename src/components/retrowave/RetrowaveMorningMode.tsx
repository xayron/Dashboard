import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Sunrise } from 'lucide-react';
import { AudioBanner } from '../common/AudioBanner';
import { MorningWidgetsGrid } from '../morning/MorningWidgetsGrid';

export const RetrowaveMorningMode: React.FC = () => {
  const { weather, media, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  return (
    <div className={`relative w-full h-full p-6 flex flex-col justify-between overflow-hidden bg-transparent select-none ${
      isLight ? 'text-pink-950' : 'text-pink-100'
    }`}>
      {/* 80s Perspective Grid Floor at bottom */}
      <div
        className="absolute inset-x-0 bottom-0 h-64 pointer-events-none opacity-25 z-0"
        style={{
          backgroundImage: 'linear-gradient(to right, var(--color-accent, #ff007f) 1px, transparent 1px), linear-gradient(to bottom, var(--color-accent, #ff007f) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          transform: 'perspective(300px) rotateX(60deg)',
          transformOrigin: 'bottom center',
        }}
      />

      {/* Top Banner & Audio */}
      <div
        className="relative z-10 flex items-center justify-between mb-4 pb-3 border-b shrink-0"
        style={{ borderColor: 'var(--theme-accent-soft)' }}
      >
        <div className="flex items-center space-x-3">
          <div
            className="p-2 rounded-xl bg-gradient-to-tr from-pink-600 to-amber-500 text-white shadow-md"
            style={{ boxShadow: isLight ? 'none' : '0 0 16px var(--color-accent)' }}
          >
            <Sunrise size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-black italic tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-pink-500 to-rose-500">
              MIAMI SUNRISE // 1984
            </h1>
            <p className={`text-xs mt-0.5 tracking-wide font-mono ${isLight ? 'text-pink-800' : 'text-pink-300'}`}>
              DAWN AT {weather.sunrise} • EXPECTED MAX {weather.highTemp}°C // SYNTHWAVE ACTIVE
            </p>
          </div>
        </div>

        {media.state === 'playing' && <AudioBanner compact={true} />}
      </div>

      {/* Main Resizable 12-Column Slot Grid */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col">
        <MorningWidgetsGrid uiStyle="retrowave" isLight={isLight} className="h-full flex-1" />
      </div>
    </div>
  );
};
