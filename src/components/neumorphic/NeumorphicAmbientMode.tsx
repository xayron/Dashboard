import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Camera, MapPin } from 'lucide-react';

export const NeumorphicAmbientMode: React.FC = () => {
  const { currentPhoto, photoProgress, now, weather, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  const baseBg = isLight ? 'bg-[#e2e8f0]' : 'bg-[#14171c]';
  const wellShadow = isLight
    ? 'shadow-[8px_8px_20px_#b8bec9,-8px_-8px_20px_#ffffff]'
    : 'shadow-[8px_8px_20px_#0a0c0f,-8px_-8px_20px_#1e2229]';
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
      {/* Background Photo Framed in Tactile Neumorphic Well */}
      <div className={`absolute inset-0 z-0 p-8 flex items-center justify-center transition-colors duration-300 ${baseBg}`}>
        <div className={`w-full h-full rounded-3xl overflow-hidden p-4 flex items-center justify-center relative transition-all duration-300 ${baseBg} ${wellShadow}`}>
          <div
            className="absolute inset-0 bg-cover bg-center filter blur-3xl opacity-20 scale-110 pointer-events-none"
            style={{ backgroundImage: `url(${currentPhoto.url})` }}
          />
          <img
            key={currentPhoto.url}
            src={currentPhoto.url}
            alt={currentPhoto.title}
            className={`relative z-0 max-w-full max-h-full object-contain rounded-2xl shadow-lg border ${
              isLight ? 'border-slate-300/60' : 'border-white/10'
            }`}
            style={{ aspectRatio: currentPhoto.aspectRatio }}
          />
        </div>
      </div>

      {/* Top Bar: Embossed Clock Pill */}
      <div className="relative z-10 flex items-center justify-between">
        <div className={`px-5 py-2.5 rounded-2xl backdrop-blur-md flex items-center space-x-2 transition-all duration-300 ${
          isLight ? 'bg-[#e2e8f0]/95 text-slate-900' : 'bg-[#14171c]/95 text-white'
        } ${pillShadow}`}>
          <span className="text-3xl font-light">{hours}:{minutes}</span>
          <span className={`text-xs font-bold border-l pl-2 ${
            isLight ? 'text-slate-500 border-slate-400' : 'text-neutral-400 border-neutral-600'
          }`}>IST</span>
        </div>

        <div className={`px-4 py-2 rounded-2xl backdrop-blur-md text-xs font-medium transition-all duration-300 ${
          isLight ? 'bg-[#e2e8f0]/95 text-slate-700' : 'bg-[#14171c]/95 text-neutral-300'
        } ${pillShadow}`}>
          {weather.temperature}°C • {weather.condition}
        </div>
      </div>

      {/* Bottom Bar: Metadata Pill & Concave Bar */}
      <div className="relative z-10">
        <div className={`p-4 rounded-2xl backdrop-blur-md max-w-md mb-3 transition-all duration-300 ${
          isLight ? 'bg-[#e2e8f0]/95 text-slate-900' : 'bg-[#14171c]/95 text-white'
        } ${pillShadow}`}>
          <div className={`text-[10px] uppercase font-bold tracking-wider mb-0.5 ${
            isLight ? 'text-slate-500' : 'text-neutral-400'
          }`}>
            PHOTO SHOWCASE
          </div>
          <h2 className="text-base font-bold truncate">{currentPhoto.title}</h2>
          {currentPhoto.location && (
            <p className={`text-xs mt-0.5 flex items-center ${
              isLight ? 'text-slate-600' : 'text-neutral-400'
            }`}>
              <MapPin size={11} className="mr-1" style={{ color: 'var(--color-accent)' }} /> {currentPhoto.location}
            </p>
          )}
        </div>

        {/* 15s Concave Bar */}
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
