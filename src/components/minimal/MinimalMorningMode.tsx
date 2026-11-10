import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { AudioBanner } from '../common/AudioBanner';
import { MorningWidgetsGrid } from '../morning/MorningWidgetsGrid';

export const MinimalMorningMode: React.FC = () => {
  const { weather, media, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  return (
    <div className={`w-full h-full px-8 xl:px-10 pt-2 pb-6 flex flex-col justify-between overflow-hidden bg-transparent select-none font-sans ${isLight ? 'text-neutral-900' : 'text-neutral-100'}`}>
      {/* Top Greeting & Now Playing Audio Banner */}
      <div className={`flex items-center justify-between pb-3 mb-3 border-b shrink-0 ${isLight ? 'border-neutral-200' : 'border-white/10'}`}>
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-accent)' }} />
            <h1 className={`text-lg xl:text-xl font-light tracking-wide ${isLight ? 'text-neutral-900' : 'text-white'}`}>Morning Briefing</h1>
          </div>
          <p className={`text-xs font-light mt-0.5 ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
            Sunrise was at {weather.sunrise} • Today&apos;s expected high {weather.highTemp}°C
          </p>
        </div>

        {media.state === 'playing' && <AudioBanner />}
      </div>

      {/* Main Resizable 12-Column Slot Grid */}
      <div className="flex-1 min-h-0 flex flex-col">
        <MorningWidgetsGrid uiStyle="minimal" isLight={isLight} className="h-full flex-1" />
      </div>
    </div>
  );
};
