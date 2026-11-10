import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Sunrise, Coffee } from 'lucide-react';
import { AudioBanner } from '../common/AudioBanner';
import { MorningWidgetsGrid } from '../morning/MorningWidgetsGrid';

export const BrutalistMorningMode: React.FC = () => {
  const { weather, media, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  return (
    <div className={`w-full h-full p-6 flex flex-col justify-between overflow-hidden bg-transparent select-none ${isLight ? 'text-black' : 'text-white'}`}>
      {/* Top Bar: Morning Header & Audio Banner */}
      <div className={`flex items-center justify-between mb-4 pb-3 border-b-2 shrink-0 ${isLight ? 'border-black/30' : 'border-white/40'}`}>
        <div className="flex items-center space-x-3">
          <div
            className={`p-2 text-black border-2 border-black ${isLight ? 'shadow-[3px_3px_0px_#000]' : 'shadow-[3px_3px_0px_#fff]'}`}
            style={{ backgroundColor: 'var(--color-accent, #facc15)' }}
          >
            <Coffee size={20} />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight flex items-center">
              MORNING BRIEFING
              <span
                className={`ml-2 px-2 py-0.5 text-black text-[10px] font-black border border-black ${isLight ? 'shadow-[2px_2px_0px_#000]' : 'shadow-[2px_2px_0px_#fff]'}`}
                style={{ backgroundColor: 'var(--color-accent, #facc15)' }}
              >
                DAILY DOSSIER
              </span>
            </h1>
            <p className={`text-xs font-bold flex items-center mt-0.5 uppercase ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
              <Sunrise size={12} className="mr-1" style={{ color: 'var(--color-accent, #facc15)' }} />
              Sunrise at {weather.sunrise} • Target high {weather.highTemp}°C
            </p>
          </div>
        </div>

        {media.state === 'playing' && <AudioBanner compact={true} />}
      </div>

      {/* Main Resizable 12-Column Slot Grid */}
      <div className="flex-1 min-h-0 flex flex-col">
        <MorningWidgetsGrid uiStyle="brutalist" isLight={isLight} className="h-full flex-1" />
      </div>
    </div>
  );
};
