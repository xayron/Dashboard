import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { AudioBanner } from '../common/AudioBanner';
import { MorningWidgetsGrid } from '../morning/MorningWidgetsGrid';

export const TuiMorningMode: React.FC = () => {
  const { weather, media, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  return (
    <div className={`w-full h-full p-6 flex flex-col justify-between overflow-hidden bg-transparent font-mono select-none ${
      isLight ? 'text-slate-800' : 'text-gray-200'
    }`}>
      {/* Top Telemetry Header */}
      <div className={`flex items-center justify-between pb-3 mb-4 border-b-2 shrink-0 ${
        isLight ? 'border-black/20' : 'border-white/20'
      }`}>
        <div className="flex items-center space-x-3">
          <span
            className="px-2 py-0.5 text-black font-black tracking-widest text-xs"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            [SYSTEM_INIT]
          </span>
          <span className={`font-bold text-sm tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}>
            MORNING_DISPATCH // TTY-1
          </span>
          <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
            (DAWN: {weather.sunrise} | HIGH: {weather.highTemp}°C)
          </span>
        </div>

        {media.state === 'playing' && <AudioBanner compact={true} />}
      </div>

      {/* Main Resizable 12-Column Slot Grid */}
      <div className="flex-1 min-h-0 flex flex-col">
        <MorningWidgetsGrid uiStyle="tui" isLight={isLight} className="h-full flex-1" />
      </div>
    </div>
  );
};
