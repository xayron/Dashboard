import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Clock } from 'lucide-react';
import { PhotoStack } from '../ambient/PhotoStack';

export const BrutalistAmbientMode: React.FC = () => {
  const { currentPhoto, photoProgress, now, weather, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return (
    <div className={`relative w-full h-full overflow-hidden flex flex-col justify-between p-8 select-none transition-colors duration-300 ${
      isLight ? 'bg-white text-black' : 'bg-black text-white'
    }`}>
      {/* Background Ambient Backdrop */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className={`w-full h-full bg-cover bg-center filter blur-[40px] scale-110 ${
            isLight ? 'opacity-25 brightness-95' : 'opacity-35 brightness-75'
          }`}
          style={{ backgroundImage: `url(${currentPhoto.url})` }}
        />
        <div className={`absolute inset-0 ${isLight ? 'bg-white/40' : 'bg-black/40'}`} />
      </div>

      {/* Center Stage Neo-Brutalist Photo Stack */}
      <div className="absolute inset-0 z-10 flex items-center justify-center p-1 sm:p-2 md:p-3 pointer-events-auto">
        <PhotoStack isLight={isLight} uiStyle="brutalist" />
      </div>

      {/* Top Bar: Floating Brutalist Clock & Weather Badge */}
      <div className="relative z-20 flex items-center justify-between pointer-events-none">
        <div className={`px-5 py-2.5 border-4 flex items-center space-x-3 transition-all duration-300 pointer-events-auto ${
          isLight
            ? 'bg-white text-black border-black shadow-[6px_6px_0px_#000]'
            : 'bg-black text-white border-4 border-white shadow-[6px_6px_0px_var(--color-accent,#ffff00)]'
        }`}>
          <Clock size={20} style={{ color: 'var(--color-accent)' }} />
          <span className="text-3xl font-black font-mono tracking-tight">{hours}:{minutes}</span>
          <span className={`text-xs font-black uppercase border-l-2 pl-3 ${
            isLight ? 'border-black text-slate-800' : 'border-white/40 text-yellow-300'
          }`}>
            IST
          </span>
        </div>

        <div
          className={`px-4 py-2 border-4 font-black text-sm uppercase transition-all duration-300 pointer-events-auto ${
            isLight ? 'border-black shadow-[5px_5px_0px_#000]' : 'border-white shadow-[5px_5px_0px_#fff]'
          }`}
          style={{
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-accent-contrast, #000000)',
          }}
        >
          {weather.temperature}°C • {weather.condition}
        </div>
      </div>

      {/* Bottom Bar: 15s timer bar */}
      <div className="relative z-20 pointer-events-none">
        <div className={`w-full h-3 border-2 p-0.5 ${
          isLight ? 'bg-neutral-200 border-black' : 'bg-black border-white'
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
