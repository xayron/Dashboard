import React from 'react';
import {
  Sunrise,
  Coffee,
} from 'lucide-react';
import { useDashboard } from '../../state/DashboardContext';
import { AudioBanner } from '../common/AudioBanner';
import { MorningWidgetsGrid } from '../morning/MorningWidgetsGrid';

export const MorningMode: React.FC = () => {
  const { weather, media, colorMode, uiStyle } = useDashboard();
  const isLight = colorMode === 'light';

  return (
    <div className="w-full h-full px-6 pt-1 pb-5 xl:pb-6 flex flex-col justify-between overflow-hidden bg-transparent select-none">
      {/* Top Bar: Morning Greeting & Key Timings */}
      <div className={`flex items-center justify-between mb-3 pb-2.5 border-b shrink-0 ${isLight ? 'border-black/[0.08]' : 'border-white/10'}`}>
        <div className="flex items-center space-x-3">
          <div
            className="p-2 rounded-xl border"
            style={{
              backgroundColor: 'var(--theme-accent-soft)',
              borderColor: 'var(--color-accent)',
              color: 'var(--color-accent)',
            }}
          >
            <Coffee size={20} />
          </div>
          <div>
            <h1 className={`text-lg xl:text-xl font-bold font-display tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>Morning Briefing</h1>
            <p className={`text-xs flex items-center mt-0.5 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
              <Sunrise size={13} className="mr-1.5" style={{ color: 'var(--color-accent)' }} />
              Sunrise at {weather.sunrise} • Have a productive day ahead
            </p>
          </div>
        </div>

        {media.state === 'playing' && <AudioBanner />}
      </div>

      {/* Main Resizable 12-Column Slot Grid */}
      <div className="flex-1 min-h-0 flex flex-col">
        <MorningWidgetsGrid uiStyle={uiStyle || 'modern'} isLight={isLight} className="h-full flex-1" />
      </div>
    </div>
  );
};
