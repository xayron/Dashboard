import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Compass } from 'lucide-react';
import { AudioBanner } from '../common/AudioBanner';
import { MorningWidgetsGrid } from '../morning/MorningWidgetsGrid';

export const HudMorningMode: React.FC = () => {
  const { weather, media, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  return (
    <div className={`w-full h-full p-6 flex flex-col justify-between overflow-hidden bg-transparent font-mono select-none ${
      isLight ? 'text-slate-900' : 'text-cyan-100'
    }`}>
      {/* Top Banner: Tactical Briefing & Audio Banner */}
      <div
        className="flex items-center justify-between mb-4 pb-3 border-b shrink-0"
        style={{ borderColor: 'var(--theme-accent-soft)' }}
      >
        <div className="flex items-center space-x-3">
          <div
            className="p-2 border"
            style={{
              backgroundColor: 'var(--theme-accent-soft)',
              borderColor: 'var(--color-accent)',
              color: 'var(--color-accent)',
            }}
          >
            <Compass size={18} className="animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className={`text-lg font-black tracking-widest ${isLight ? 'text-slate-900' : 'text-white'}`}>TACTICAL_MORNING_BRIEF</h1>
              <span
                className="px-2 py-0.5 text-[9px] border font-bold"
                style={{
                  backgroundColor: 'var(--theme-accent-soft)',
                  borderColor: 'var(--color-accent)',
                  color: 'var(--color-accent)',
                }}
              >
                SYS_ONLINE
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-cyan-400/80'}`}>
              DAWN {weather.sunrise} // PEAK_SOLAR {weather.highTemp}°C • VISIBILITY OPTIMAL
            </p>
          </div>
        </div>

        {media.state === 'playing' && <AudioBanner compact={true} />}
      </div>

      {/* Main Resizable 12-Column Slot Grid */}
      <div className="flex-1 min-h-0 flex flex-col">
        <MorningWidgetsGrid uiStyle="hud" isLight={isLight} className="h-full flex-1" />
      </div>
    </div>
  );
};
