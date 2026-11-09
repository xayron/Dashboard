import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Camera, MapPin, Image, Activity } from 'lucide-react';

export const ObsidianAmbientMode: React.FC = () => {
  const { currentPhoto, photoProgress, now, weather } = useDashboard();

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return (
    <div className="relative w-full h-full bg-[#050507] overflow-hidden flex flex-col justify-between p-10 font-sans select-none">
      {/* Cold Facet Plate with True Aspect Ratio */}
      <div className="absolute inset-0 z-0 flex items-center justify-center bg-[#050507] p-8">
        <div className="w-full h-full border border-white/[0.14] p-4 bg-[#08080c] shadow-2xl relative flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center filter blur-3xl opacity-20 scale-110 pointer-events-none"
            style={{ backgroundImage: `url(${currentPhoto.url})` }}
          />
          <img
            key={currentPhoto.url}
            src={currentPhoto.url}
            alt={currentPhoto.title}
            className="relative z-0 max-w-full max-h-full object-contain filter contrast-105 shadow-2xl"
            style={{ aspectRatio: currentPhoto.aspectRatio }}
          />
          {/* Facet Edge Light Reflection */}
          <div className="absolute inset-0 border border-white/[0.08] pointer-events-none" />
        </div>
      </div>

      {/* Top Bar: Telemetry Masthead */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="bg-[#0f0f15]/90 backdrop-blur-md border border-white/[0.14] px-5 py-2.5 text-[#eef0f3] flex items-center space-x-3">
          <span className="text-3xl font-mono font-bold tracking-tight">{hours}:{minutes}</span>
          <span className="text-sm font-mono text-[#9a9da6]">:{seconds}</span>
          <span className="text-[10px] font-mono text-[#5fd49b] border-l border-white/[0.12] pl-3">
            AMBIENT DISPLAY
          </span>
        </div>

        <div className="bg-[#0f0f15]/90 backdrop-blur-md border border-white/[0.14] px-4 py-2 text-xs font-mono text-[#eef0f3]">
          {weather.temperature}°C • {weather.condition}
        </div>
      </div>

      {/* Bottom Bar: Photo Information */}
      <div className="relative z-10">
        <div className="bg-[#0f0f15]/95 backdrop-blur-md border border-white/[0.14] p-4 max-w-lg text-[#eef0f3] mb-3">
          <div className="flex items-center justify-between text-[10px] font-mono text-[#9a9da6] mb-1">
            <span className="flex items-center space-x-1.5 text-[#5fd49b]">
              <Image size={11} />
              <span>PHOTO GALLERY</span>
            </span>
            <span>PHOTO #{Math.floor(photoProgress * 10) + 1}</span>
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
        <div className="w-full h-1.5 bg-[#08080c] border border-white/[0.12] p-0.5">
          <div
            className="h-full bg-[#5fd49b] transition-all duration-100 ease-linear"
            style={{ width: `${photoProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
