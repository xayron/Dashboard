import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Clock } from 'lucide-react';
import { AudioBanner } from '../common/AudioBanner';
import { MorningWidgetsGrid } from '../morning/MorningWidgetsGrid';

export const CivicMorningMode: React.FC = () => {
  const { weather, media, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  const mutedClass = isLight ? 'text-slate-500' : 'text-slate-400';

  return (
    <div className={`w-full h-full p-6 flex flex-col justify-between overflow-hidden bg-transparent select-none font-sans ${
      isLight ? 'text-slate-900' : 'text-slate-100'
    }`}>
      {/* Top Banner: Morning Briefing & Audio Banner */}
      <div className={`flex items-center justify-between mb-4 pb-3 border-b-2 shrink-0 ${isLight ? 'border-slate-300' : 'border-slate-700'}`}>
        <div className="flex items-center space-x-3">
          <div
            className="p-2.5 rounded-lg border shadow-xs flex items-center justify-center transition-colors"
            style={{
              backgroundColor: 'var(--theme-accent-soft)',
              borderColor: 'var(--color-accent, #f97316)',
              color: 'var(--color-accent, #f97316)',
            }}
          >
            <Clock size={20} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className={`text-xl font-mono font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                MORNING OVERVIEW
              </h1>
              <span
                className="px-2 py-0.5 text-[10px] font-mono font-bold rounded border"
                style={{
                  backgroundColor: 'var(--theme-accent-soft)',
                  color: 'var(--color-accent)',
                  borderColor: 'var(--color-accent)',
                }}
              >
                DAILY REPORT
              </span>
            </div>
            <p className={`text-xs font-mono mt-0.5 ${mutedClass}`}>
              SUNRISE AT {weather.sunrise} // SUNSET AT {weather.sunset} • EXPECTED HIGH {weather.highTemp}°C
            </p>
          </div>
        </div>

        {media.state === 'playing' && <AudioBanner compact={true} />}
      </div>

      {/* Main Resizable 12-Column Slot Grid */}
      <div className="flex-1 min-h-0 flex flex-col">
        <MorningWidgetsGrid uiStyle="civic" isLight={isLight} className="h-full flex-1" />
      </div>
    </div>
  );
};
