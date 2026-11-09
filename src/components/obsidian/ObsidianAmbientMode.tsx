import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Camera, MapPin, Image, Activity } from 'lucide-react';

export const ObsidianAmbientMode: React.FC = () => {
  const { currentPhoto, photoProgress, now, weather, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return (
    <div className={`relative w-full h-full overflow-hidden flex flex-col justify-between p-10 font-sans select-none transition-colors duration-300 ${
      isLight ? 'bg-[#f8fafc] text-slate-900' : 'bg-[#050507] text-[#eef0f3]'
    }`}>
      {/* Cold Facet Plate with True Aspect Ratio */}
      <div className={`absolute inset-0 z-0 flex items-center justify-center p-8 transition-colors duration-300 ${
        isLight ? 'bg-[#f8fafc]' : 'bg-[#050507]'
      }`}>
        <div className={`w-full h-full p-4 shadow-2xl relative flex items-center justify-center overflow-hidden transition-colors duration-300 ${
          isLight
            ? 'border border-slate-300 bg-white'
            : 'border border-white/[0.14] bg-[#08080c]'
        }`}>
          <div
            className={`absolute inset-0 bg-cover bg-center filter blur-3xl scale-110 pointer-events-none ${
              isLight ? 'opacity-15' : 'opacity-20'
            }`}
            style={{ backgroundImage: `url(${currentPhoto.url})` }}
          />
          <img
            key={currentPhoto.url}
            src={currentPhoto.url}
            alt={currentPhoto.title}
            className={`relative z-0 max-w-full max-h-full object-contain filter contrast-105 shadow-2xl border ${
              isLight ? 'border-slate-200' : 'border-white/[0.08]'
            }`}
            style={{ aspectRatio: currentPhoto.aspectRatio }}
          />
          {/* Facet Edge Light Reflection */}
          <div className={`absolute inset-0 pointer-events-none border ${
            isLight ? 'border-slate-300/40' : 'border-white/[0.08]'
          }`} />
        </div>
      </div>

      {/* Top Bar: Telemetry Masthead */}
      <div className="relative z-10 flex items-center justify-between">
        <div className={`backdrop-blur-md px-5 py-2.5 flex items-center space-x-3 transition-colors duration-300 border ${
          isLight
            ? 'bg-white/90 border-slate-300 text-slate-900 shadow-sm'
            : 'bg-[#0f0f15]/90 border-white/[0.14] text-[#eef0f3]'
        }`}>
          <span className="text-3xl font-mono font-bold tracking-tight">{hours}:{minutes}</span>
          <span className={`text-sm font-mono ${isLight ? 'text-slate-500' : 'text-[#9a9da6]'}`}>:{seconds}</span>
          <span
            className="text-[10px] font-mono border-l pl-3 font-semibold"
            style={{
              borderColor: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.12)',
              color: 'var(--color-accent)',
            }}
          >
            AMBIENT DISPLAY
          </span>
        </div>

        <div className={`backdrop-blur-md px-4 py-2 text-xs font-mono transition-colors duration-300 border ${
          isLight
            ? 'bg-white/90 border-slate-300 text-slate-800 shadow-sm'
            : 'bg-[#0f0f15]/90 border-white/[0.14] text-[#eef0f3]'
        }`}>
          {weather.temperature}°C • {weather.condition}
        </div>
      </div>

      {/* Bottom Bar: Photo Information */}
      <div className="relative z-10">
        <div className={`backdrop-blur-md p-4 max-w-lg mb-3 transition-colors duration-300 border ${
          isLight
            ? 'bg-white/95 border-slate-300 text-slate-900 shadow-sm'
            : 'bg-[#0f0f15]/95 border-white/[0.14] text-[#eef0f3]'
        }`}>
          <div className={`flex items-center justify-between text-[10px] font-mono mb-1 ${
            isLight ? 'text-slate-500' : 'text-[#9a9da6]'
          }`}>
            <span className="flex items-center space-x-1.5" style={{ color: 'var(--color-accent)' }}>
              <Image size={11} />
              <span>PHOTO GALLERY</span>
            </span>
            <span>PHOTO #{Math.floor(photoProgress * 10) + 1}</span>
          </div>
          <h2 className="text-base font-bold truncate">{currentPhoto.title}</h2>
          {currentPhoto.location && (
            <p className={`text-xs font-mono mt-0.5 flex items-center space-x-1 ${
              isLight ? 'text-slate-500' : 'text-[#9a9da6]'
            }`}>
              <MapPin size={11} style={{ color: 'var(--color-accent)' }} />
              <span>{currentPhoto.location}</span>
            </p>
          )}
        </div>

        {/* 15s Progress Bar */}
        <div className={`w-full h-1.5 border p-0.5 ${
          isLight ? 'bg-slate-200 border-slate-300' : 'bg-[#08080c] border-white/[0.12]'
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
