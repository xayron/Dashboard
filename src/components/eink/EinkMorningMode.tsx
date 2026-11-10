import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Feather } from 'lucide-react';
import { AudioBanner } from '../common/AudioBanner';
import { MorningWidgetsGrid } from '../morning/MorningWidgetsGrid';

export const EinkMorningMode: React.FC = () => {
  const { weather, media, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  return (
    <div className={`w-full h-full p-8 flex flex-col justify-between overflow-hidden bg-transparent font-serif select-none ${
      isLight ? 'text-[#1c1917]' : 'text-[#f5f2eb]'
    }`}>
      {/* Top Masthead & Audio Banner */}
      <div className={`flex items-center justify-between pb-3 mb-4 border-b-2 shrink-0 ${
        isLight ? 'border-stone-800' : 'border-stone-500'
      }`}>
        <div className="flex items-center space-x-3">
          <div
            className={`p-2 border-2 ${isLight ? 'bg-[#ede8df]' : 'bg-[#292524]'}`}
            style={{ borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}
          >
            <Feather size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight uppercase">Morning Dispatch &amp; Almanac</h1>
            <p className={`text-xs italic ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
              Dawn broke at {weather.sunrise} • Estimated high of <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>{weather.highTemp}°C</span> today
            </p>
          </div>
        </div>

        {media.state === 'playing' && (
          <AudioBanner
            compact={true}
            className={isLight ? 'bg-[#ede8df] border-stone-800 text-stone-900' : 'bg-[#292524] border-stone-500 text-stone-100'}
          />
        )}
      </div>

      {/* Main Resizable 12-Column Slot Grid */}
      <div className="flex-1 min-h-0 flex flex-col">
        <MorningWidgetsGrid uiStyle="eink" isLight={isLight} className="h-full flex-1" />
      </div>
    </div>
  );
};
