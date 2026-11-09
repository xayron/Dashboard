import React from 'react';
import { useDashboard } from '../../state/DashboardContext';

export const MinimalAmbientMode: React.FC = () => {
  const { currentPhoto, photoProgress, now, weather } = useDashboard();

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex flex-col justify-between p-12 select-none">
      {/* Minimal Ambient Backdrop */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="w-full h-full bg-cover bg-center filter blur-3xl opacity-30 scale-110"
          style={{ backgroundImage: `url(${currentPhoto.url})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/50" />
      </div>

      {/* Floating Photo with True Aspect Ratio */}
      <div className="absolute inset-0 z-0 flex items-center justify-center p-8">
        <img
          key={currentPhoto.url}
          src={currentPhoto.url}
          alt={currentPhoto.title}
          className="relative z-0 max-w-[92vw] max-h-[84vh] object-contain shadow-2xl transition-opacity duration-1000"
          style={{ aspectRatio: currentPhoto.aspectRatio }}
        />
      </div>

      {/* Top Bar: Whispering Clock */}
      <div className="relative z-10 flex items-baseline justify-between text-white drop-shadow-md">
        <div className="text-5xl font-extralight tracking-tighter">
          {hours}:{minutes}
        </div>
        <div className="text-xs font-light text-neutral-300">
          {weather.temperature}°C {weather.condition}
        </div>
      </div>

      {/* Bottom Bar: Photo Credit & 15s Hairline */}
      <div className="relative z-10">
        <div className="mb-4 drop-shadow-md">
          <h2 className="text-xl font-light text-white tracking-wide">{currentPhoto.title}</h2>
          {currentPhoto.location && (
            <p className="text-xs font-light text-neutral-300 mt-0.5">{currentPhoto.location}</p>
          )}
        </div>

        {/* 15s Hairline Bar */}
        <div className="w-full h-0.5 bg-white/20 overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-100 ease-linear"
            style={{ width: `${photoProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
