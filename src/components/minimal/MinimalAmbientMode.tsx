import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { PhotoStack } from '../ambient/PhotoStack';

export const MinimalAmbientMode: React.FC = () => {
  const { currentPhoto, photoProgress, now, weather, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return (
    <div className={`relative w-full h-full overflow-hidden flex flex-col justify-between p-8 md:p-12 select-none transition-colors duration-300 ${
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

      {/* Center Photo Stack */}
      <div className="absolute inset-0 z-10 flex items-center justify-center p-4 pointer-events-auto">
        <PhotoStack isLight={isLight} uiStyle="minimal" />
      </div>

      {/* Top Bar: Whispering Clock */}
      <div className={`relative z-20 flex items-baseline justify-between drop-shadow-md pointer-events-none ${
        isLight ? 'text-neutral-900' : 'text-white'
      }`}>
        <div className="text-4xl md:text-5xl font-extralight tracking-tighter">
          {hours}:{minutes}
        </div>
        <div className={`text-xs font-light ${isLight ? 'text-neutral-600' : 'text-neutral-300'}`}>
          {weather.temperature}°C {weather.condition}
        </div>
      </div>

      {/* Bottom Bar: 15s Hairline */}
      <div className="relative z-20 pointer-events-none">
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
