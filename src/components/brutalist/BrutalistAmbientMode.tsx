import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Camera, MapPin, Clock } from 'lucide-react';

export const BrutalistAmbientMode: React.FC = () => {
  const { currentPhoto, photoProgress, now, weather } = useDashboard();

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex flex-col justify-between p-8 select-none">
      {/* Background Ambient Backdrop */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="w-full h-full bg-cover bg-center filter blur-[40px] opacity-35 scale-110 brightness-75"
          style={{ backgroundImage: `url(${currentPhoto.url})` }}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Center Stage Neo-Brutalist Photo Frame (Correct Aspect Ratio) */}
      <div className="absolute inset-0 z-0 flex items-center justify-center p-8">
        <div className="max-w-[90vw] max-h-[82vh] p-2 bg-black border-4 border-white shadow-[8px_8px_0px_#ffff00] flex items-center justify-center">
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
        <div className="bg-black text-white px-5 py-2.5 border-4 border-white shadow-[6px_6px_0px_#ffff00] flex items-center space-x-3">
          <Clock size={20} className="text-yellow-400" />
          <span className="text-3xl font-black font-mono tracking-tight">{hours}:{minutes}</span>
          <span className="text-xs font-black uppercase text-yellow-300 border-l-2 border-white/40 pl-3">
            IST
          </span>
        </div>

        <div className="bg-yellow-400 text-black px-4 py-2 border-4 border-black shadow-[5px_5px_0px_#000] font-black text-sm uppercase">
          {weather.temperature}°C • {weather.condition}
        </div>
      </div>

      {/* Bottom Bar: Photo metadata card & 15s timer bar */}
      <div className="relative z-10">
        <div className="bg-black/95 text-white p-4 border-4 border-white shadow-[6px_6px_0px_#00f0ff] max-w-lg mb-3">
          <div className="flex items-center space-x-2 text-cyan-400 font-black text-xs uppercase mb-1">
            <Camera size={14} />
            <span>PHOTO SHOWCASE // 15.6&quot;</span>
          </div>
          <h2 className="text-xl font-black uppercase tracking-tight text-white">{currentPhoto.title}</h2>
          {currentPhoto.location && (
            <p className="text-xs font-bold text-neutral-300 mt-1 uppercase flex items-center">
              <MapPin size={12} className="mr-1 text-yellow-400" /> {currentPhoto.location}
            </p>
          )}
        </div>

        {/* 15s Progress Bar */}
        <div className="w-full h-3 bg-black border-2 border-white p-0.5">
          <div
            className="h-full bg-yellow-400 transition-all duration-100 ease-linear"
            style={{ width: `${photoProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
