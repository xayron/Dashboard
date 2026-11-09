import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Camera, MapPin, Image } from 'lucide-react';

export const CivicAmbientMode: React.FC = () => {
  const { currentPhoto, photoProgress, now, weather, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return (
    <div className={`relative w-full h-full overflow-hidden flex flex-col justify-between p-10 font-sans select-none transition-colors duration-300 ${
      isLight ? 'bg-[#f1f5f9] text-slate-900' : 'bg-[#0b1120] text-slate-100'
    }`}>
      {/* Exhibition Plate Frame with Correct Aspect Ratio */}
      <div className={`absolute inset-0 z-0 flex items-center justify-center p-8 transition-colors duration-300 ${
        isLight ? 'bg-[#f1f5f9]' : 'bg-[#0b1120]'
      }`}>
        <div className={`w-full h-full border-2 p-4 shadow-xl rounded-2xl relative flex items-center justify-center overflow-hidden transition-colors duration-300 ${
          isLight ? 'border-slate-300 bg-white' : 'border-slate-700 bg-slate-900/90 shadow-2xl'
        }`}>
          {/* Subtle archival paper wash in the matting */}
          <div
            className={`absolute inset-0 bg-cover bg-center filter blur-3xl scale-110 pointer-events-none ${
              isLight ? 'opacity-15' : 'opacity-25'
            }`}
            style={{ backgroundImage: `url(${currentPhoto.url})` }}
          />
          <img
            key={currentPhoto.url}
            src={currentPhoto.url}
            alt={currentPhoto.title}
            className={`relative z-0 max-w-full max-h-full object-contain rounded-xl filter contrast-105 shadow-md border ${
              isLight ? 'border-slate-200' : 'border-slate-700'
            }`}
            style={{ aspectRatio: currentPhoto.aspectRatio }}
          />
        </div>
      </div>

      {/* Top Bar: Clock & Conditions */}
      <div className="relative z-10 flex items-center justify-between">
        <div className={`backdrop-blur-md border rounded-xl px-5 py-2.5 shadow-md flex items-center space-x-3 transition-colors duration-300 ${
          isLight ? 'bg-white/95 border-slate-300 text-slate-900' : 'bg-slate-900/95 border-slate-700 text-white'
        }`}>
          <span className="text-3xl font-mono font-black tracking-tight">{hours}:{minutes}</span>
          <span className="text-sm font-mono font-bold" style={{ color: 'var(--color-accent, #f97316)' }}>:{seconds}</span>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border uppercase ${
            isLight
              ? 'text-emerald-800 bg-emerald-100 border-emerald-300'
              : 'text-emerald-300 bg-emerald-950/80 border-emerald-500/50'
          }`}>
            AMBIENT DISPLAY
          </span>
        </div>

        <div className={`backdrop-blur-md border rounded-xl px-4 py-2 text-xs font-mono font-bold shadow-md transition-colors duration-300 ${
          isLight ? 'bg-white/95 border-slate-300 text-slate-800' : 'bg-slate-900/95 border-slate-700 text-slate-200'
        }`}>
          {weather.temperature}°C • {weather.condition}
        </div>
      </div>

      {/* Bottom Bar: Photo Metadata */}
      <div className="relative z-10">
        <div className={`backdrop-blur-md border rounded-xl p-4 max-w-lg mb-3 shadow-md transition-colors duration-300 ${
          isLight ? 'bg-white/95 border-slate-300 text-slate-900' : 'bg-slate-900/95 border-slate-700 text-white'
        }`}>
          <div className={`flex items-center justify-between text-[10px] font-mono mb-1 ${
            isLight ? 'text-slate-500' : 'text-slate-400'
          }`}>
            <span className={`flex items-center space-x-1.5 font-bold ${
              isLight ? 'text-emerald-700' : 'text-emerald-400'
            }`}>
              <Image size={13} />
              <span>PHOTO GALLERY</span>
            </span>
            <span className="font-bold">PHOTO #{Math.floor(photoProgress * 10) + 1}</span>
          </div>
          <h2 className={`text-base font-mono font-extrabold truncate ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>{currentPhoto.title}</h2>
          {currentPhoto.location && (
            <p className={`text-xs font-mono mt-0.5 flex items-center space-x-1 font-medium ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}>
              <MapPin size={12} style={{ color: 'var(--color-accent, #f97316)' }} />
              <span>{currentPhoto.location}</span>
            </p>
          )}
        </div>

        {/* 15s Progress Bar */}
        <div className={`w-full h-2 border rounded-full p-0.5 ${
          isLight ? 'bg-slate-200 border-slate-300' : 'bg-slate-800 border-slate-700'
        }`}>
          <div
            className="h-full rounded-full transition-all duration-100 ease-linear"
            style={{
              width: `${photoProgress}%`,
              backgroundColor: 'var(--color-accent, #f97316)',
            }}
          />
        </div>
      </div>
    </div>
  );
};
