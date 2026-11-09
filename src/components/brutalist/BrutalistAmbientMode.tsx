import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Camera, MapPin, Clock } from 'lucide-react';

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

      {/* Center Stage Neo-Brutalist Photo Frame (Correct Aspect Ratio) */}
      <div className="absolute inset-0 z-0 flex items-center justify-center p-8">
        <div className={`max-w-[90vw] max-h-[82vh] p-2 flex items-center justify-center transition-all duration-300 ${
          isLight
            ? 'bg-white border-4 border-black shadow-[8px_8px_0px_#000]'
            : 'bg-black border-4 border-white shadow-[8px_8px_0px_var(--color-accent,#ffff00)]'
        }`}>
          <img
            key={currentPhoto.url}
            src={currentPhoto.url}
            alt={currentPhoto.title}
            className="max-w-full max-h-[78vh] object-contain filter contrast-110"
            style={{ aspectRatio: currentPhoto.aspectRatio }}
          />
        </div>
      </div>

      {/* Top Bar: Floating Brutalist Clock & Weather Badge */}
      <div className="relative z-10 flex items-center justify-between">
        <div className={`px-5 py-2.5 border-4 flex items-center space-x-3 transition-all duration-300 ${
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
          className={`px-4 py-2 border-4 font-black text-sm uppercase transition-all duration-300 ${
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

      {/* Bottom Bar: Photo metadata card & 15s timer bar */}
      <div className="relative z-10">
        <div className={`p-4 border-4 max-w-lg mb-3 transition-all duration-300 ${
          isLight
            ? 'bg-white text-black border-black shadow-[6px_6px_0px_#000]'
            : 'bg-black/95 text-white border-white shadow-[6px_6px_0px_#00f0ff]'
        }`}>
          <div className="flex items-center space-x-2 font-black text-xs uppercase mb-1" style={{ color: 'var(--color-accent)' }}>
            <Camera size={14} />
            <span>PHOTO SHOWCASE</span>
          </div>
          <h2 className="text-xl font-black uppercase tracking-tight truncate">{currentPhoto.title}</h2>
          {currentPhoto.location && (
            <p className={`text-xs font-bold mt-1 uppercase flex items-center ${
              isLight ? 'text-neutral-600' : 'text-neutral-300'
            }`}>
              <MapPin size={12} className="mr-1" style={{ color: 'var(--color-accent)' }} /> {currentPhoto.location}
            </p>
          )}
        </div>

        {/* 15s Progress Bar */}
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
