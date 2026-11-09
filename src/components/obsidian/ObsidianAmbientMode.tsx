import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Camera, MapPin, ShieldCheck, Activity } from 'lucide-react';

export const ObsidianAmbientMode: React.FC = () => {
  const { currentPhoto, photoProgress, now, weather } = useDashboard();

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return (
    <div className="relative w-full h-full bg-[#08080a] overflow-hidden flex flex-col justify-between p-10 font-sans select-none">
      {/* Background Photo Framed as Cold Facet Plate */}
      <div className="absolute inset-0 z-0 flex items-center justify-center bg-[#08080a] p-8">
        <div className="w-full h-full border border-white/[0.12] p-2 bg-[#0e0e12] shadow-2xl relative">
          <img
            src={currentPhoto.url}
            alt={currentPhoto.title}
            className="w-full h-full object-cover filter contrast-105"
          />
          {/* Facet Edge Light Reflection */}
          <div className="absolute inset-0 border border-white/[0.08] pointer-events-none" />
        </div>
      </div>

      {/* Top Bar: Telemetry Masthead */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="bg-[#15151b]/90 backdrop-blur-md border border-white/[0.12] px-5 py-2.5 text-[#eef0f3] flex items-center space-x-3">
          <span className="text-3xl font-mono font-bold tracking-tight">{hours}:{minutes}</span>
          <span className="text-sm font-mono text-[#9a9da6]">:{seconds}</span>
          <span className="text-[10px] font-mono text-[#5fd49b] border-l border-white/[0.12] pl-3">
            AIR-GAP AMBIENT
          </span>
        </div>

        <div className="bg-[#15151b]/90 backdrop-blur-md border border-white/[0.12] px-4 py-2 text-xs font-mono text-[#eef0f3]">
          {weather.temperature}°C • {weather.condition}
        </div>
      </div>

      {/* Bottom Bar: Curatorial Proof Receipt */}
      <div className="relative z-10">
        <div className="bg-[#15151b]/95 backdrop-blur-md border border-white/[0.12] p-4 max-w-lg text-[#eef0f3] mb-3">
          <div className="flex items-center justify-between text-[10px] font-mono text-[#9a9da6] mb-1">
            <span className="flex items-center space-x-1.5 text-[#5fd49b]">
              <ShieldCheck size={11} />
              <span>AIR-GAP ARCHIVE SPECIMEN</span>
            </span>
            <span>INDEX #{Math.floor(photoProgress * 10)}</span>
          </div>
          <h2 className="text-base font-bold truncate">{currentPhoto.title}</h2>
          {currentPhoto.location && (
            <p className="text-xs font-mono text-[#9a9da6] mt-0.5 flex items-center space-x-1">
              <MapPin size={11} className="text-[#e3b341]" />
              <span>{currentPhoto.location}</span>
            </p>
          )}
        </div>

        {/* 15s Progress Bar */}
        <div className="w-full h-1.5 bg-[#0e0e12] border border-white/[0.12] p-0.5">
          <div
            className="h-full bg-[#5fd49b] transition-all duration-100 ease-linear"
            style={{ width: `${photoProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
