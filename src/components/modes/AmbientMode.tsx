import React from 'react';
import { ChevronLeft, ChevronRight, MapPin, Camera } from 'lucide-react';
import { useDashboard } from '../../state/DashboardContext';
import { ClockWidget } from '../common/ClockWidget';
import { WeatherWidget } from '../common/WeatherWidget';
import { AudioBanner } from '../common/AudioBanner';

export const AmbientMode: React.FC = () => {
  const { currentPhoto, photoProgress, nextPhoto, prevPhoto, media, colorMode } = useDashboard();
  const isLight = colorMode === 'light';
  const { orientation, url, title, location, credit } = currentPhoto;

  const isPortrait = orientation === 'portrait';
  const isStandard = orientation === 'standard';
  const isLandscape = orientation === 'landscape';

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
            className={`w-1/2 h-full bg-cover bg-center transform scale-110 filter blur-[40px] ${
              isLight ? 'brightness-[0.8] contrast-105 opacity-30' : 'brightness-[0.38] contrast-125'
            }`}
            style={{ backgroundImage: `url(${url})` }}
          />
          {/* Right Wing (blurred, darkened, slightly mirrored) */}
          <div
            className={`w-1/2 h-full bg-cover bg-center transform scale-110 -scale-x-100 filter blur-[40px] ${
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
            className={`w-full h-full bg-cover bg-center transform scale-105 filter blur-[30px] ${
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
            className={`w-full h-full bg-cover bg-center transform scale-110 filter blur-[35px] ${
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

      {/* 2. CENTER STAGE IMAGE RENDERING (True Aspect Ratio, No Stretching/Cropping) */}
      <div className="absolute inset-0 z-0 flex items-center justify-center p-8">
        {isLandscape ? (
          <img
            key={url}
            src={url}
            alt={title}
            className={`max-h-full max-w-full object-contain rounded-2xl border transition-opacity duration-1000 ease-in-out ${
              isLight
                ? 'shadow-[0_15px_40px_rgba(0,0,0,0.12)] border-black/10'
                : 'shadow-[0_20px_50px_rgba(0,0,0,0.7)] border-white/10'
            }`}
            style={{ aspectRatio: currentPhoto.aspectRatio }}
          />
        ) : isStandard ? (
          <img
            key={url}
            src={url}
            alt={title}
            className={`max-h-full max-w-[85vw] object-contain rounded-2xl border transition-opacity duration-1000 ease-in-out ${
              isLight
                ? 'shadow-[0_15px_40px_rgba(0,0,0,0.12)] border-black/10'
                : 'shadow-2xl border-white/10'
            }`}
            style={{ aspectRatio: currentPhoto.aspectRatio }}
          />
        ) : (
          /* Portrait: Center Stage uncropped photo */
          <div className="relative h-full py-4 flex items-center justify-center shadow-2xl">
            <img
              key={url}
              src={url}
              alt={title}
              className={`h-full w-auto max-w-full object-contain rounded-2xl border transition-opacity duration-1000 ease-in-out ${
                isLight
                  ? 'shadow-[0_15px_40px_rgba(0,0,0,0.12)] border-black/10'
                  : 'shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-white/10'
              }`}
              style={{ aspectRatio: currentPhoto.aspectRatio }}
            />
          </div>
        )}
      </div>

      {/* 3. DYNAMIC UI WIDGET SHIFTING ENGINE */}
      {/*
        Rule from Spec:
        "UI Widget Shift (Ambient Mode): Relocate clock and weather overlays into the
        left and right blurred sidebands so the photo content remains completely unobscured."
      */}
      {isPortrait ? (
        /* Portrait Layout: Overlays shifted into the left and right blurred sidebands */
        <div className="relative z-10 w-full h-full flex justify-between p-10 pointer-events-none">
          {/* Left Blurred Sideband: Shifted Clock & Audio Banner */}
          <div className="w-[28%] flex flex-col justify-between pointer-events-auto">
            <div className="glass-panel p-6 rounded-3xl shadow-2xl">
              <ClockWidget size="normal" showSeconds={true} showDate={true} />
            </div>

            {media.state === 'playing' && (
              <div className="mt-auto">
                <AudioBanner />
              </div>
            )}
          </div>

          {/* Right Blurred Sideband: Shifted Weather & Photo Info */}
          <div className="w-[28%] flex flex-col justify-between items-end pointer-events-auto">
            <div className="w-full">
              <WeatherWidget layout="card" />
            </div>

            {/* Photo Metadata in right wing */}
            <div className="mt-auto glass-panel p-4 rounded-2xl text-right w-full">
              <h3 className={`text-sm font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{title}</h3>
              {location && (
                <p className={`text-xs flex items-center justify-end mt-0.5 ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
                  <MapPin size={11} className="mr-1" style={{ color: 'var(--color-accent)' }} />
                  {location}
                </p>
              )}
              {credit && (
                <p className={`text-[10px] mt-1 flex items-center justify-end ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                  <Camera size={10} className="mr-1" />
                  Photo by {credit}
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Landscape / Standard Layout: Overlays anchored at top-left and top-right */
        <div className="relative z-10 w-full h-full flex flex-col justify-between p-10 pointer-events-none">
          {/* Top Section */}
          <div className="flex justify-between items-start">
            <div className="glass-panel p-6 rounded-3xl shadow-2xl pointer-events-auto max-w-md">
              <ClockWidget size="normal" showSeconds={true} showDate={true} />
            </div>

            <div className="pointer-events-auto max-w-sm">
              <WeatherWidget layout="compact" />
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex justify-between items-end">
            {/* Photo Metadata */}
            <div className="glass-panel px-4 py-2.5 rounded-2xl text-left pointer-events-auto max-w-md">
              <h3 className={`text-sm font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{title}</h3>
              <div className={`flex items-center space-x-3 text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
                {location && (
                  <span className="flex items-center">
                    <MapPin size={12} className="mr-1" style={{ color: 'var(--color-accent)' }} />
                    {location}
                  </span>
                )}
                {credit && (
                  <span className={`text-[11px] flex items-center ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                    <Camera size={11} className="mr-1" />
                    {credit}
                  </span>
                )}
              </div>
            </div>

            {/* Corner audio banner if playing */}
            {media.state === 'playing' && (
              <div className="pointer-events-auto">
                <AudioBanner />
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. PHOTO NAVIGATION CONTROLS & 15-SECOND TIMER BAR */}
      <div className="absolute inset-x-0 bottom-0 z-20 pointer-events-auto">
        {/* Subtle hover navigation arrows */}
        <button
          onClick={prevPhoto}
          title="Previous Photo"
          className={`absolute left-4 bottom-6 p-2.5 rounded-full backdrop-blur-md transition-all border ${
            isLight
              ? 'bg-white/70 hover:bg-white text-slate-800 border-black/10 shadow-md'
              : 'bg-black/40 hover:bg-black/70 text-white/70 hover:text-white border-white/10'
          }`}
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={nextPhoto}
          title="Next Photo"
          className={`absolute right-4 bottom-6 p-2.5 rounded-full backdrop-blur-md transition-all border ${
            isLight
              ? 'bg-white/70 hover:bg-white text-slate-800 border-black/10 shadow-md'
              : 'bg-black/40 hover:bg-black/70 text-white/70 hover:text-white border-white/10'
          }`}
        >
          <ChevronRight size={20} />
        </button>

        {/* 15-Second Progress Line at very bottom */}
        <div className={`w-full h-1 overflow-hidden ${isLight ? 'bg-black/10' : 'bg-white/10'}`}>
          <div
            className="h-full transition-all duration-100 ease-linear"
            style={{
              width: `${photoProgress}%`,
              backgroundColor: 'var(--color-accent)',
              boxShadow: isLight ? 'none' : '0 0 8px var(--color-glow)',
            }}
          />
        </div>
      </div>
    </div>
  );
};
