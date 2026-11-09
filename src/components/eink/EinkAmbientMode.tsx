import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Camera, MapPin } from 'lucide-react';

export const EinkAmbientMode: React.FC = () => {
  const { currentPhoto, photoProgress, now, weather, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return (
    <div className={`relative w-full h-full overflow-hidden flex flex-col justify-between p-10 font-serif select-none transition-colors duration-300 ${
      isLight ? 'bg-[#f5f2eb] text-[#1c1917]' : 'bg-[#1c1917] text-[#f5f2eb]'
    }`}>
      {/* Background Photo Framed as Curatorial Plate with Correct Aspect Ratio */}
      <div className={`absolute inset-0 z-0 flex items-center justify-center p-6 transition-colors duration-300 ${
        isLight ? 'bg-[#f5f2eb]' : 'bg-[#1c1917]'
      }`}>
        <div className={`w-full h-full border-4 p-4 flex items-center justify-center relative overflow-hidden transition-colors duration-300 ${
          isLight
            ? 'border-stone-800 bg-[#fdfbf7] shadow-[6px_6px_0px_#1c1917]'
            : 'border-stone-400 bg-[#292524] shadow-[6px_6px_0px_#000]'
        }`}>
          <div
            className={`absolute inset-0 bg-cover bg-center filter blur-2xl grayscale pointer-events-none ${
              isLight ? 'opacity-10' : 'opacity-20'
            }`}
            style={{ backgroundImage: `url(${currentPhoto.url})` }}
          />
          <img
            key={currentPhoto.url}
            src={currentPhoto.url}
            alt={currentPhoto.title}
            className={`relative z-0 max-w-full max-h-full object-contain border-2 shadow-sm filter contrast-105 ${
              isLight ? 'border-stone-400' : 'border-stone-600'
            }`}
            style={{ aspectRatio: currentPhoto.aspectRatio }}
          />
        </div>
      </div>

      {/* Top Bar: Plate Badge */}
      <div className="relative z-10 flex items-center justify-between">
        <div className={`border-2 px-4 py-2 transition-colors duration-300 ${
          isLight
            ? 'bg-[#ede8df] border-stone-800 shadow-[3px_3px_0px_#1c1917] text-[#1c1917]'
            : 'bg-[#292524] border-stone-400 shadow-[3px_3px_0px_#000] text-[#f5f2eb]'
        }`}>
          <span className="text-3xl font-bold tracking-tight">{hours}:{minutes}</span>
          <span className={`text-xs uppercase italic ml-2 border-l pl-2 ${
            isLight ? 'border-stone-400 text-stone-600' : 'border-stone-600 text-stone-400'
          }`}>IST</span>
        </div>

        <div className={`border-2 px-3 py-1.5 shadow-[3px_3px_0px_#1c1917] text-xs font-bold transition-colors duration-300 ${
          isLight
            ? 'bg-[#ede8df] border-stone-800 text-stone-800'
            : 'bg-[#292524] border-stone-400 text-stone-200'
        }`}>
          {weather.temperature}°C • {weather.condition}
        </div>
      </div>

      {/* Bottom Bar: Curatorial Stamp */}
      <div className="relative z-10">
        <div className={`border-2 p-3 max-w-md mb-2 transition-colors duration-300 ${
          isLight
            ? 'bg-[#ede8df]/95 border-stone-800 shadow-[4px_4px_0px_#1c1917] text-[#1c1917]'
            : 'bg-[#292524]/95 border-stone-400 shadow-[4px_4px_0px_#000] text-[#f5f2eb]'
        }`}>
          <div className={`text-[10px] uppercase font-bold tracking-widest mb-0.5 ${
            isLight ? 'text-stone-600' : 'text-stone-400'
          }`}>
            Photographic Plate
          </div>
          <h2 className="text-base font-bold truncate">{currentPhoto.title}</h2>
          {currentPhoto.location && (
            <p className={`text-xs italic mt-0.5 ${
              isLight ? 'text-stone-600' : 'text-stone-400'
            }`}>{currentPhoto.location}</p>
          )}
        </div>

        {/* 15s Progress Bar */}
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
