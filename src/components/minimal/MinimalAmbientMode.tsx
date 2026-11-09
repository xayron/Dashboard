import React from 'react';
import { useDashboard } from '../../state/DashboardContext';

export const MinimalAmbientMode: React.FC = () => {
  const { currentPhoto, photoProgress, now, weather, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return (
    <div className={`relative w-full h-full overflow-hidden flex flex-col justify-between p-12 select-none transition-colors duration-300 ${
      isLight ? 'bg-slate-50 text-neutral-900' : 'bg-black text-white'
    }`}>
      {/* Minimal Ambient Backdrop */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className={`w-full h-full bg-cover bg-center filter blur-3xl scale-110 ${
            isLight ? 'opacity-25' : 'opacity-30'
          }`}
          style={{ backgroundImage: `url(${currentPhoto.url})` }}
        />
        <div className={`absolute inset-0 ${
          isLight
            ? 'bg-gradient-to-t from-slate-50/90 via-slate-50/30 to-slate-50/60'
            : 'bg-gradient-to-t from-black/80 via-black/20 to-black/50'
        }`} />
      </div>

      {/* Floating Photo with True Aspect Ratio */}
      <div className="absolute inset-0 z-0 flex items-center justify-center p-8">
        <img
          key={currentPhoto.url}
          src={currentPhoto.url}
          alt={currentPhoto.title}
          className={`relative z-0 max-w-[92vw] max-h-[84vh] object-contain shadow-2xl transition-opacity duration-1000 ${
            isLight ? 'border border-black/5' : 'border border-white/10'
          }`}
          style={{ aspectRatio: currentPhoto.aspectRatio }}
        />
      </div>

      {/* Top Bar: Whispering Clock */}
      <div className={`relative z-10 flex items-baseline justify-between drop-shadow-md ${
        isLight ? 'text-neutral-900' : 'text-white'
      }`}>
        <div className="text-5xl font-extralight tracking-tighter">
          {hours}:{minutes}
        </div>
        <div className={`text-xs font-light ${isLight ? 'text-neutral-600' : 'text-neutral-300'}`}>
          {weather.temperature}°C {weather.condition}
        </div>
      </div>

      {/* Bottom Bar: Photo Credit & 15s Hairline */}
      <div className="relative z-10">
        <div className="mb-4 drop-shadow-md">
          <h2 className={`text-xl font-light tracking-wide ${
            isLight ? 'text-neutral-900' : 'text-white'
          }`}>{currentPhoto.title}</h2>
          {currentPhoto.location && (
            <p className={`text-xs font-light mt-0.5 ${
              isLight ? 'text-neutral-600' : 'text-neutral-300'
            }`}>{currentPhoto.location}</p>
          )}
        </div>

        {/* 15s Hairline Bar */}
        <div className={`w-full h-0.5 overflow-hidden ${
          isLight ? 'bg-black/10' : 'bg-white/20'
        }`}>
          <div
            className="h-full transition-all duration-100 ease-linear"
            style={{
              width: `${photoProgress}%`,
              backgroundColor: 'var(--color-accent)',
            }}
          />
        </div>
      </div>
    </div>
  );
};
