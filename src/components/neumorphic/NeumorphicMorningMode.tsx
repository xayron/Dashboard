import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Coffee, Sunrise } from 'lucide-react';
import { AudioBanner } from '../common/AudioBanner';
import { MorningWidgetsGrid } from '../morning/MorningWidgetsGrid';

export const NeumorphicMorningMode: React.FC = () => {
  const { weather, media, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  const cardClass = isLight
    ? 'bg-[#e2e8f0] shadow-[6px_6px_14px_#cbd5e1,-6px_-6px_14px_#ffffff] text-slate-900'
    : 'bg-[#1a1d24] shadow-[6px_6px_14px_#101217,-6px_-6px_14px_#242831] text-neutral-200';

  return (
    <div className={`w-full h-full p-8 flex flex-col justify-between overflow-hidden bg-transparent select-none ${
      isLight ? 'text-slate-900' : 'text-neutral-200'
    }`}>
      {/* Top Banner: Greeting & Audio */}
      <div className="flex items-center justify-between pb-4 mb-4 shrink-0">
        <div className="flex items-center space-x-3.5">
          <div
            className={`p-3 rounded-2xl ${cardClass}`}
            style={{ color: 'var(--color-accent)' }}
          >
            <Coffee size={22} />
          </div>
          <div>
            <h1 className={`text-xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>Morning Overview</h1>
            <p className={`text-xs mt-0.5 flex items-center ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
              <Sunrise size={12} className="mr-1.5" style={{ color: 'var(--color-accent)' }} />
              Sunrise at {weather.sunrise} • Today&apos;s high {weather.highTemp}°C
            </p>
          </div>
        </div>

        {media.state === 'playing' && <AudioBanner compact={true} />}
      </div>

      {/* Main Resizable 12-Column Slot Grid */}
      <div className="flex-1 min-h-0 flex flex-col">
        <MorningWidgetsGrid uiStyle="neumorphic" isLight={isLight} className="h-full flex-1" />
      </div>
    </div>
  );
};
