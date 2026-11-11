import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { ClockWidget } from '../common/ClockWidget';
import { WeatherWidget } from '../common/WeatherWidget';
import { AudioBanner } from '../common/AudioBanner';
import { PhotoStack } from '../ambient/PhotoStack';

export const AmbientMode: React.FC = () => {
  const { currentPhoto, photoProgress, media, colorMode } = useDashboard();
  const isLight = colorMode === 'light';
  const { orientation, url } = currentPhoto;

  const isPortrait = orientation === 'portrait';
  const isStandard = orientation === 'standard';

  return (
    <div className={`relative w-full h-full flex flex-col justify-between overflow-hidden select-none transition-colors duration-300 ${
      isLight ? 'bg-slate-100 text-slate-900' : 'bg-black text-white'
    }`}>
      {/* 1. BACKGROUND / WINGS RENDERING ENGINE */}
      {isPortrait ? (
        /* Portrait Mode: Dual-Blur Wings Backdrop */
        <div className="absolute inset-0 z-0 flex pointer-events-none overflow-hidden">
          {/* Left Wing (blurred, darkened) */}
          <div
            className={`w-1/2 h-full bg-cover bg-center transform scale-110 filter blur-[40px] transition-all duration-1000 ease-in-out ${
              isLight ? 'brightness-[0.8] contrast-105 opacity-30' : 'brightness-[0.38] contrast-125'
            }`}
            style={{ backgroundImage: `url(${url})` }}
          />
          {/* Right Wing (blurred, darkened, slightly mirrored) */}
          <div
            className={`w-1/2 h-full bg-cover bg-center transform scale-110 -scale-x-100 filter blur-[40px] transition-all duration-1000 ease-in-out ${
              isLight ? 'brightness-[0.8] contrast-105 opacity-30' : 'brightness-[0.38] contrast-125'
            }`}
            style={{ backgroundImage: `url(${url})` }}
          />
          {/* Subtle vignette gradient */}
          <div className={`absolute inset-0 ${
            isLight
              ? 'bg-gradient-to-t from-slate-100/80 via-transparent to-slate-100/50'
              : 'bg-gradient-to-t from-black/60 via-transparent to-black/40'
          }`} />
        </div>
      ) : isStandard ? (
        /* Standard / Squarish Mode: Mild blur backdrop */
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div
            className={`w-full h-full bg-cover bg-center transform scale-105 filter blur-[30px] transition-all duration-1000 ease-in-out ${
              isLight ? 'brightness-[0.8] opacity-35' : 'brightness-[0.4]'
            }`}
            style={{ backgroundImage: `url(${url})` }}
          />
          <div className={`absolute inset-0 ${isLight ? 'bg-white/30' : 'bg-black/30'}`} />
        </div>
      ) : (
        /* Landscape Mode: Blurred ambient backdrop and subtle gradient */
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div
            className={`w-full h-full bg-cover bg-center transform scale-110 filter blur-[35px] transition-all duration-1000 ease-in-out ${
              isLight ? 'brightness-[0.8] contrast-105 opacity-35' : 'brightness-[0.35] contrast-110'
            }`}
            style={{ backgroundImage: `url(${url})` }}
          />
          <div className={`absolute inset-0 z-10 ${
            isLight
              ? 'bg-gradient-to-t from-slate-100/80 via-transparent to-slate-100/40'
              : 'bg-gradient-to-t from-black/60 via-transparent to-black/30'
          }`} />
        </div>
      )}

      {/* 2. PHOTO STACK RENDERING ENGINE (Interactive Multi-Layer Physical Photo Deck) */}
      <div className="absolute inset-0 z-10 flex items-center justify-center p-1 sm:p-2 md:p-3 pointer-events-auto">
        <PhotoStack isLight={isLight} uiStyle="modern" />
      </div>

      {/* 3. DYNAMIC UI WIDGET OVERLAYS */}
      <div className="relative z-20 w-full h-full flex flex-col justify-between p-6 md:p-10 pointer-events-none">
        {/* Top Section: Clock & Weather */}
        <div className="flex justify-between items-start">
          <div className="glass-panel p-5 md:p-6 rounded-3xl shadow-2xl pointer-events-auto max-w-xs md:max-w-md">
            <ClockWidget size="normal" showSeconds={true} showDate={true} />
          </div>

          <div className="pointer-events-auto max-w-xs md:max-w-sm">
            <WeatherWidget layout="compact" />
          </div>
        </div>

        {/* Bottom Section: Media Audio Banner if playing */}
        <div className="flex justify-between items-end pb-3">
          {media.state === 'playing' ? (
            <div className="pointer-events-auto max-w-md">
              <AudioBanner />
            </div>
          ) : (
            <div />
          )}
        </div>
      </div>

      {/* 4. 15-SECOND TIMER BAR */}
      <div className="absolute inset-x-0 bottom-0 z-30 pointer-events-none">
        <div className={`w-full h-1 overflow-hidden ${isLight ? 'bg-black/10' : 'bg-white/10'}`}>
          <div
            className="h-full transition-all duration-100 ease-linear"
            style={{
              width: `${photoProgress}%`,
              backgroundColor: 'var(--color-accent, #38bdf8)',
              boxShadow: isLight ? 'none' : '0 0 8px var(--color-glow, rgba(56,189,248,0.5))',
            }}
          />
        </div>
      </div>
    </div>
  );
};
