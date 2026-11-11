import React from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Flame, Moon, Sun, Camera, Newspaper } from 'lucide-react';
import { useDashboard } from '../../state/DashboardContext';
import type { DashboardMode } from '../../types/dashboard';

export const CarouselIndicator: React.FC = () => {
  const {
    activeMode,
    autoCalculatedMode,
    manualOverrideMode,
    setManualOverrideMode,
    media,
    colorMode,
    isKioskBarVisible,
    isKioskMode,
  } = useDashboard();

  if (!isKioskBarVisible || isKioskMode) return null;

  const isLight = colorMode === 'light';
  const isPlaying = media.state === 'playing';

  const modes: Array<{
    id: DashboardMode;
    label: string;
    icon: React.ReactNode;
  }> = [
    { id: 'morning', label: 'Morning', icon: <Sun size={12} className="text-amber-400" /> },
    { id: 'news', label: 'News', icon: <Newspaper size={12} className="text-cyan-400" /> },
    { id: 'ambient', label: 'Ambient', icon: <Camera size={12} className="text-emerald-400" /> },
    { id: 'race', label: 'Race Weekend', icon: <Flame size={12} className="text-red-400" /> },
    ...(isPlaying
      ? [{ id: 'evening' as DashboardMode, label: 'Now Playing', icon: <Moon size={12} className="text-purple-400" /> }]
      : []),
  ];

  const currentIdx = modes.findIndex(m => m.id === activeMode);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prevIdx = (currentIdx - 1 + modes.length) % modes.length;
    setManualOverrideMode(modes[prevIdx].id);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIdx = (currentIdx + 1) % modes.length;
    setManualOverrideMode(modes[nextIdx].id);
  };

  return (
    <nav
      aria-label="Dashboard Page Carousel"
      className="fixed bottom-3 inset-x-0 mx-auto max-w-fit z-40 select-none animate-in fade-in slide-in-from-bottom-2 duration-300"
    >
      <div
        className={`px-3 py-1.5 rounded-full border shadow-lg backdrop-blur-md flex items-center space-x-2 transition-all ${
          isLight
            ? 'bg-white/80 border-black/10 text-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.08)]'
            : 'bg-slate-900/80 border-white/15 text-white shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
        }`}
      >
        {/* Prev Arrow */}
        <button
          onClick={handlePrev}
          title="Previous Page"
          aria-label="Previous Page"
          className={`p-1 rounded-full transition-all cursor-pointer ${
            isLight
              ? 'text-slate-500 hover:text-slate-900 hover:bg-black/5'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <ChevronLeft size={13} />
        </button>

        {/* Carousel Indicator Dots */}
        <div className="flex items-center space-x-1.5 px-0.5">
          {modes.map((m) => {
            const isActive = activeMode === m.id;

            return (
              <button
                key={m.id}
                onClick={() => {
                  if (isActive && manualOverrideMode !== null) {
                    setManualOverrideMode(null);
                  } else {
                    setManualOverrideMode(m.id);
                  }
                }}
                title={`${m.label}${isActive ? (manualOverrideMode === null ? ' (Auto)' : ' (Active)') : ''}`}
                aria-label={m.label}
                className="group relative py-1 focus:outline-none cursor-pointer flex items-center justify-center"
              >
                <div
                  className={`rounded-full transition-all duration-300 ${
                    isActive
                      ? 'w-6 h-2 shadow-sm'
                      : 'w-2 h-2 hover:scale-125'
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundColor: 'var(--color-accent, #3b82f6)',
                          boxShadow: isLight
                            ? '0 0 6px var(--color-accent, #3b82f6)'
                            : '0 0 10px var(--color-glow, rgba(59, 130, 246, 0.6))',
                        }
                      : {
                          backgroundColor: isLight ? 'rgba(0, 0, 0, 0.22)' : 'rgba(255, 255, 255, 0.3)',
                        }
                  }
                />

                {/* Tooltip on hover */}
                <span
                  className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg border z-50 ${
                    isLight
                      ? 'bg-slate-900 text-white border-black/10'
                      : 'bg-black/95 text-white border-white/15'
                  }`}
                >
                  {m.label}
                  {isActive && manualOverrideMode === null ? ' • Auto' : ''}
                </span>
              </button>
            );
          })}
        </div>

        {/* Next Arrow */}
        <button
          onClick={handleNext}
          title="Next Page"
          aria-label="Next Page"
          className={`p-1 rounded-full transition-all cursor-pointer ${
            isLight
              ? 'text-slate-500 hover:text-slate-900 hover:bg-black/5'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <ChevronRight size={13} />
        </button>

        {/* Manual Override Indicator / Reset Button */}
        {manualOverrideMode !== null && (
          <button
            onClick={() => setManualOverrideMode(null)}
            title={`Reset to Auto Mode (${autoCalculatedMode})`}
            className={`flex items-center space-x-1 text-[10px] font-mono uppercase pl-1.5 pr-2 py-0.5 rounded-full border transition-all cursor-pointer ${
              isLight
                ? 'bg-black/5 hover:bg-black/10 border-black/10 text-slate-700'
                : 'bg-white/10 hover:bg-white/20 border-white/15 text-gray-200'
            }`}
          >
            <RotateCcw size={10} />
            <span>Auto</span>
          </button>
        )}
      </div>
    </nav>
  );
};
