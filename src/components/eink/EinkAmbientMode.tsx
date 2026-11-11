import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { PhotoStack } from '../ambient/PhotoStack';

export const EinkAmbientMode: React.FC = () => {
  const { currentPhoto, photoProgress, now, weather, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return (
    <div className={`relative w-full h-full overflow-hidden flex flex-col justify-between p-10 font-serif select-none transition-colors duration-300 ${
      isLight ? 'bg-[#f5f2eb] text-[#1c1917]' : 'bg-[#1c1917] text-[#f5f2eb]'
    }`}>
      {/* Background Curatorial Backdrop */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className={`w-full h-full bg-cover bg-center filter blur-2xl grayscale ${
            isLight ? 'opacity-10' : 'opacity-20'
          }`}
          style={{ backgroundImage: `url(${currentPhoto.url})` }}
        />
      </div>

      {/* Center Curatorial Photo Stack */}
      <div className="absolute inset-0 z-10 flex items-center justify-center p-1 sm:p-2 md:p-3 pointer-events-auto">
        <PhotoStack isLight={isLight} uiStyle="eink" />
      </div>

      {/* Top Bar: Plate Badge */}
      <div className="relative z-20 flex items-center justify-between pointer-events-none">
        <div className={`border-2 px-4 py-2 transition-colors duration-300 pointer-events-auto ${
          isLight
            ? 'bg-[#ede8df] border-stone-800 shadow-[3px_3px_0px_#1c1917] text-[#1c1917]'
            : 'bg-[#292524] border-stone-400 shadow-[3px_3px_0px_#000] text-[#f5f2eb]'
        }`}>
          <span className="text-3xl font-bold tracking-tight">{hours}:{minutes}</span>
          <span className={`text-xs uppercase italic ml-2 border-l pl-2 ${
            isLight ? 'border-stone-400 text-stone-600' : 'border-stone-600 text-stone-400'
          }`}>IST</span>
        </div>

        <div className={`border-2 px-3 py-1.5 shadow-[3px_3px_0px_#1c1917] text-xs font-bold transition-colors duration-300 pointer-events-auto ${
          isLight
            ? 'bg-[#ede8df] border-stone-800 text-stone-800'
            : 'bg-[#292524] border-stone-400 text-stone-200'
        }`}>
          {weather.temperature}°C • {weather.condition}
        </div>
      </div>

      {/* Bottom Bar: 15s Progress Bar */}
      <div className="relative z-20 pointer-events-none">
        <div className={`w-full h-2 border p-0.5 ${
          isLight ? 'bg-stone-300 border-stone-800' : 'bg-stone-800 border-stone-600'
        }`}>
          <div
            className={`h-full transition-all duration-100 ease-linear ${
              isLight ? 'bg-stone-800' : 'bg-stone-200'
            }`}
            style={{ width: `${photoProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
