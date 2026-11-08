import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Crosshair, MapPin, Radio } from 'lucide-react';

export const HudAmbientMode: React.FC = () => {
  const { currentPhoto, photoProgress, now, weather } = useDashboard();

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return (
    <div className="relative w-full h-full bg-[#030712] overflow-hidden flex flex-col justify-between p-8 font-mono select-none">
      {/* Background Photo with Tactical Scanline Overlay */}
      <div className="absolute inset-0 z-0 bg-black">
        <img
          src={currentPhoto.url}
          alt={currentPhoto.title}
          className="w-full h-full object-cover opacity-85 filter contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-[#030712]/60" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f0ff08_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff08_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      </div>

      {/* Top Bar: Tactical Telemetry */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="bg-[#04091a]/90 border border-cyan-500/50 p-3 shadow-[0_0_20px_rgba(0,240,255,0.15)] flex items-center space-x-3">
          <Crosshair size={18} className="text-cyan-400" />
          <span className="text-3xl font-black text-white">{hours}:{minutes}</span>
          <span className="text-xs text-cyan-400 border-l border-cyan-500/40 pl-2">
            IST//UTC+5:30
          </span>
        </div>

        <div className="bg-[#04091a]/90 border border-cyan-500/50 px-3 py-2 text-xs text-cyan-300">
          SURFACE: {weather.temperature}°C // {weather.condition.toUpperCase()}
        </div>
      </div>

      {/* Bottom Bar: Target Metadata & HUD Bar */}
      <div className="relative z-10">
        <div className="bg-[#04091a]/90 border border-cyan-500/50 p-4 max-w-md mb-3 shadow-[0_0_25px_rgba(0,240,255,0.1)]">
          <div className="flex items-center space-x-2 text-[10px] text-cyan-400 mb-1">
            <Radio size={12} className="animate-pulse" />
            <span>OPTICAL_SURVEILLANCE//FEED</span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-wide">{currentPhoto.title}</h2>
          {currentPhoto.location && (
            <p className="text-xs text-gray-400 mt-0.5 flex items-center">
              <MapPin size={11} className="mr-1 text-cyan-400" /> {currentPhoto.location}
            </p>
          )}
        </div>

        {/* 15s Vector Progress Bar */}
        <div className="w-full h-2 bg-[#04091a] border border-cyan-500/40 p-0.5">
          <div
            className="h-full bg-cyan-400 shadow-[0_0_10px_#00f0ff] transition-all duration-100 ease-linear"
            style={{ width: `${photoProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
