import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Sparkles, MapPin } from 'lucide-react';

export const RetrowaveAmbientMode: React.FC = () => {
  const { currentPhoto, photoProgress, now, weather } = useDashboard();

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return (
    <div className="relative w-full h-full bg-[#150424] overflow-hidden flex flex-col justify-between p-8 select-none">
      {/* Background Photo with Neon Tint */}
      <div className="absolute inset-0 z-0 bg-black">
        <img
          src={currentPhoto.url}
          alt={currentPhoto.title}
          className="w-full h-full object-cover opacity-85 filter contrast-125 saturate-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#150424] via-transparent to-[#150424]/60" />
      </div>

      {/* Top Bar: Neon Sunset Clock */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="bg-[#1e0736]/90 border-2 border-pink-500 rounded-2xl px-5 py-2.5 shadow-[0_0_25px_rgba(255,0,127,0.4)] text-white flex items-center space-x-2">
          <span className="text-3xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-400 to-rose-400">
            {hours}:{minutes}
          </span>
          <span className="text-xs text-amber-300 font-bold border-l border-pink-500/40 pl-2">
            IST
          </span>
        </div>

        <div className="bg-[#1e0736]/90 border border-amber-500 rounded-2xl px-4 py-2 shadow-[0_0_15px_rgba(245,158,11,0.3)] text-xs text-amber-300 font-bold uppercase">
          {weather.temperature}°C // {weather.condition}
        </div>
      </div>

      {/* Bottom Bar: Photo Badge & Laser Bar */}
      <div className="relative z-10">
        <div className="bg-[#1e0736]/95 border-2 border-pink-500/80 rounded-2xl p-4 max-w-md shadow-[0_0_25px_rgba(255,0,127,0.3)] text-white mb-3">
          <div className="text-[10px] text-amber-300 font-black italic uppercase tracking-widest mb-0.5">
            NEON GALLERY // 1984
          </div>
          <h2 className="text-lg font-black italic tracking-wide">{currentPhoto.title}</h2>
          {currentPhoto.location && (
            <p className="text-xs text-pink-300 mt-0.5 flex items-center font-medium">
              <MapPin size={12} className="mr-1 text-amber-400" /> {currentPhoto.location}
            </p>
          )}
        </div>

        {/* 15s Laser Progress Bar */}
        <div className="w-full h-2 rounded-full bg-[#1e0736] border border-pink-500/50 p-0.5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 shadow-[0_0_12px_#ff007f] transition-all duration-100 ease-linear"
            style={{ width: `${photoProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
