import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Camera, MapPin, FileCheck } from 'lucide-react';

export const CivicAmbientMode: React.FC = () => {
  const { currentPhoto, photoProgress, now, weather } = useDashboard();

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return (
    <div className="relative w-full h-full bg-[#070b14] overflow-hidden flex flex-col justify-between p-10 font-sans select-none">
      {/* Background Photo Framed as Civic Photographic Plate */}
      <div className="absolute inset-0 z-0 flex items-center justify-center bg-[#070b14] p-8">
        <div className="w-full h-full border border-slate-700/60 p-2 bg-[#0f172a] shadow-2xl relative">
          <img
            src={currentPhoto.url}
            alt={currentPhoto.title}
            className="w-full h-full object-cover filter contrast-105"
          />
        </div>
      </div>

      {/* Top Bar: Official Clock & Conditions */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="bg-[#0f172a]/95 backdrop-blur-md border border-slate-700/60 px-5 py-2.5 text-white flex items-center space-x-3">
          <span className="text-3xl font-mono font-black tracking-tight">{hours}:{minutes}</span>
          <span className="text-sm font-mono text-amber-400">:{seconds}</span>
          <span className="text-[10px] font-mono text-emerald-400 border-l border-slate-700/60 pl-3 uppercase">
            PUBLIC DOMAIN VIEW
          </span>
        </div>

        <div className="bg-[#0f172a]/95 backdrop-blur-md border border-slate-700/60 px-4 py-2 text-xs font-mono text-slate-200">
          {weather.temperature}°C • {weather.condition}
        </div>
      </div>

      {/* Bottom Bar: Curatorial Plate Stamp */}
      <div className="relative z-10">
        <div className="bg-[#0f172a]/95 backdrop-blur-md border border-slate-700/60 p-4 max-w-lg text-white mb-3">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
            <span className="flex items-center space-x-1.5 text-emerald-400 font-bold">
              <FileCheck size={11} />
              <span>CIVIC ARCHIVE RECORD</span>
            </span>
            <span>EXHIBIT #{Math.floor(photoProgress * 10)}</span>
          </div>
          <h2 className="text-base font-bold truncate">{currentPhoto.title}</h2>
          {currentPhoto.location && (
            <p className="text-xs font-mono text-slate-400 mt-0.5 flex items-center space-x-1">
              <MapPin size={11} className="text-amber-400" />
              <span>{currentPhoto.location}</span>
            </p>
          )}
        </div>

        {/* 15s Progress Bar */}
        <div className="w-full h-1.5 bg-[#0f172a] border border-slate-700/60 p-0.5">
          <div
            className="h-full bg-amber-500 transition-all duration-100 ease-linear"
            style={{ width: `${photoProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
