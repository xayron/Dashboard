import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Sparkles, MapPin } from 'lucide-react';

export const RetrowaveAmbientMode: React.FC = () => {
  const { currentPhoto, photoProgress, now, weather } = useDashboard();

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return (
    <div className="relative w-full h-full bg-[#0c0317] overflow-hidden flex flex-col justify-between p-8 font-mono select-none">
      {/* Background Photo with Neon Tint */}
      <div className="absolute inset-0 z-0 bg-black">
        <img
          src={currentPhoto.url}
          alt={currentPhoto.title}
          className="w-full h-full object-cover opacity-85 filter contrast-125 saturate-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0317] via-transparent to-[#0c0317]/50" />
      </div>

      {/* Top Bar: Neon Clock */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="bg-[#16062b]/90 border-2 border-pink-500 px-4 py-2 shadow-[0_0_20px_rgba(255,42,133,0.3)] text-white flex items-center space-x-2">
          <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400">
            {hours}:{minutes}
          </span>
          <span className="text-xs text-pink-400 font-bold border-l border-pink-500/40 pl-2">
            IST
          </span>
        </div>

        <div className="bg-[#16062b]/90 border border-cyan-400 px-3 py-1.5 shadow-[0_0_15px_rgba(0,240,255,0.25)] text-xs text-cyan-300 font-bold">
          {weather.temperature}°C // {weather.condition.toUpperCase()}
        </div>
      </div>

      {/* Bottom Bar: Photo Badge & Laser Bar */}
      <div className="relative z-10">
        <div className="bg-[#16062b]/90 border border-pink-500/80 p-3.5 max-w-md shadow-[0_0_20px_rgba(255,42,133,0.25)] text-white mb-3">
          <div className="text-[10px] text-pink-400 font-bold uppercase tracking-widest mb-0.5">
            NEON_GALLERY//1984
          </div>
          <h2 className="text-lg font-black truncate">{currentPhoto.title}</h2>
          {currentPhoto.location && (
            <p className="text-xs text-cyan-300 mt-0.5 flex items-center">
              <MapPin size={11} className="mr-1 text-pink-400" /> {currentPhoto.location}
            </p>
          )}
        </div>

        {/* 15s Laser Progress Bar */}
        <div className="w-full h-2 bg-[#16062b] border border-pink-500/40 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-cyan-400 shadow-[0_0_10px_#ff2a85] transition-all duration-100 ease-linear"
            style={{ width: `${photoProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
