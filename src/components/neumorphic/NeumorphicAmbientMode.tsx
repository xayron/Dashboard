import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { PhotoStack } from '../ambient/PhotoStack';

export const NeumorphicAmbientMode: React.FC = () => {
  const { currentPhoto, photoProgress, now, weather, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  const baseBg = isLight ? 'bg-[#e2e8f0]' : 'bg-[#14171c]';
  const pillShadow = isLight
    ? 'shadow-[5px_5px_12px_#b8bec9,-5px_-5px_12px_#ffffff]'
    : 'shadow-[5px_5px_12px_#0a0c0f,-5px_-5px_12px_#1e2229]';
  const concaveShadow = isLight
    ? 'shadow-[inset_2px_2px_5px_#b8bec9,inset_-2px_-2px_5px_#ffffff]'
    : 'shadow-[inset_2px_2px_5px_#0a0c0f,inset_-2px_-2px_5px_#1e2229]';

  return (
    <div className={`relative w-full h-full overflow-hidden flex flex-col justify-between p-10 select-none transition-colors duration-300 ${
      isLight ? 'bg-[#e2e8f0] text-slate-800' : 'bg-[#14171c] text-white'
    }`}>
      {/* Background Ambient Backdrop */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="w-full h-full bg-cover bg-center filter blur-3xl opacity-20 scale-110"
          style={{ backgroundImage: `url(${currentPhoto.url})` }}
        />
      </div>

      {/* Center Tactile Neumorphic Photo Stack */}
      <div className="absolute inset-0 z-10 flex items-center justify-center p-1 sm:p-2 md:p-3 pointer-events-auto">
        <PhotoStack isLight={isLight} uiStyle="neumorphic" />
      </div>

      {/* Top Bar: Embossed Clock Pill */}
      <div className="relative z-20 flex items-center justify-between pointer-events-none">
        <div className={`px-5 py-2.5 rounded-2xl backdrop-blur-md flex items-center space-x-2 transition-all duration-300 pointer-events-auto ${
          isLight ? 'bg-[#e2e8f0]/95 text-slate-900' : 'bg-[#14171c]/95 text-white'
        } ${pillShadow}`}>
          <span className="text-3xl font-light">{hours}:{minutes}</span>
          <span className={`text-xs font-bold border-l pl-2 ${
            isLight ? 'text-slate-500 border-slate-400' : 'text-neutral-400 border-neutral-600'
          }`}>IST</span>
        </div>

        <div className={`px-4 py-2 rounded-2xl backdrop-blur-md text-xs font-medium transition-all duration-300 pointer-events-auto ${
          isLight ? 'bg-[#e2e8f0]/95 text-slate-700' : 'bg-[#14171c]/95 text-neutral-300'
        } ${pillShadow}`}>
          {weather.temperature}°C • {weather.condition}
        </div>
      </div>

      {/* Bottom Bar: 15s Concave Bar */}
      <div className="relative z-20 pointer-events-none">
        <div className={`w-full h-2 rounded-full p-0.5 overflow-hidden transition-all duration-300 ${baseBg} ${concaveShadow}`}>
          <div
            className="h-full rounded-full transition-all duration-100 ease-linear shadow-xs"
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
