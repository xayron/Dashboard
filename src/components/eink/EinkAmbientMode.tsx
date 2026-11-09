import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Camera, MapPin } from 'lucide-react';

export const EinkAmbientMode: React.FC = () => {
  const { currentPhoto, photoProgress, now, weather } = useDashboard();

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return (
    <div className="relative w-full h-full bg-[#f5f2eb] overflow-hidden flex flex-col justify-between p-10 font-serif select-none">
      {/* Background Photo Framed as Curatorial Plate with Correct Aspect Ratio */}
      <div className="absolute inset-0 z-0 flex items-center justify-center bg-[#f5f2eb] p-6">
        <div className="w-full h-full border-4 border-stone-800 p-4 bg-[#fdfbf7] shadow-[6px_6px_0px_#1c1917] flex items-center justify-center relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center filter blur-2xl opacity-10 scale-110 grayscale pointer-events-none"
            style={{ backgroundImage: `url(${currentPhoto.url})` }}
          />
          <img
            key={currentPhoto.url}
            src={currentPhoto.url}
            alt={currentPhoto.title}
            className="relative z-0 max-w-full max-h-full object-contain border-2 border-stone-400 shadow-sm filter contrast-105"
            style={{ aspectRatio: currentPhoto.aspectRatio }}
          />
        </div>
      </div>

      {/* Top Bar: Plate Badge */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="bg-[#ede8df] border-2 border-stone-800 px-4 py-2 shadow-[3px_3px_0px_#1c1917] text-[#1c1917]">
          <span className="text-3xl font-bold tracking-tight">{hours}:{minutes}</span>
          <span className="text-xs uppercase italic ml-2 border-l border-stone-400 pl-2">IST</span>
        </div>

        <div className="bg-[#ede8df] border-2 border-stone-800 px-3 py-1.5 shadow-[3px_3px_0px_#1c1917] text-xs font-bold text-stone-800">
          {weather.temperature}°C • {weather.condition}
        </div>
      </div>

      {/* Bottom Bar: Curatorial Stamp */}
      <div className="relative z-10">
        <div className="bg-[#ede8df]/95 border-2 border-stone-800 p-3 max-w-md shadow-[4px_4px_0px_#1c1917] text-[#1c1917] mb-2">
          <div className="text-[10px] uppercase font-bold tracking-widest text-stone-600 mb-0.5">
            Photographic Plate
          </div>
          <h2 className="text-base font-bold truncate">{currentPhoto.title}</h2>
          {currentPhoto.location && (
            <p className="text-xs italic text-stone-600 mt-0.5">{currentPhoto.location}</p>
          )}
        </div>

        {/* 15s Progress Bar */}
        <div className="w-full h-2 bg-stone-300 border border-stone-800 p-0.5">
          <div
            className="h-full bg-stone-800 transition-all duration-100 ease-linear"
            style={{ width: `${photoProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
