import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Camera, MapPin, FileCheck, Award } from 'lucide-react';

export const CivicAmbientMode: React.FC = () => {
  const { currentPhoto, photoProgress, now, weather } = useDashboard();

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return (
    <div className="relative w-full h-full bg-[#f1f5f9] overflow-hidden flex flex-col justify-between p-10 font-sans select-none">
      {/* Background Photo Framed as Civic Archive Plate */}
      <div className="absolute inset-0 z-0 flex items-center justify-center bg-[#f1f5f9] p-8">
        <div className="w-full h-full border-2 border-slate-300 p-2.5 bg-white shadow-xl rounded-2xl relative">
          <img
            src={currentPhoto.url}
            alt={currentPhoto.title}
            className="w-full h-full object-cover rounded-xl filter contrast-105"
          />
        </div>
      </div>

      {/* Top Bar: Official Clock & Conditions */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="bg-white/95 backdrop-blur-md border border-slate-300 rounded-xl px-5 py-2.5 text-slate-900 shadow-md flex items-center space-x-3">
          <span className="text-3xl font-mono font-black tracking-tight">{hours}:{minutes}</span>
          <span className="text-sm font-mono text-[#f97316] font-bold">:{seconds}</span>
          <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-bold border border-emerald-300 uppercase">
            PUBLIC ARCHIVE
          </span>
        </div>

        <div className="bg-white/95 backdrop-blur-md border border-slate-300 rounded-xl px-4 py-2 text-xs font-mono text-slate-800 font-bold shadow-md">
          {weather.temperature}°C • {weather.condition}
        </div>
      </div>

      {/* Bottom Bar: Curatorial Plate Stamp */}
      <div className="relative z-10">
        <div className="bg-white/95 backdrop-blur-md border border-slate-300 rounded-xl p-4 max-w-lg text-slate-900 mb-3 shadow-md">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-1">
            <span className="flex items-center space-x-1.5 text-emerald-700 font-bold">
              <FileCheck size={13} />
              <span>CIVIC ARCHIVE RECORD</span>
            </span>
            <span className="font-bold">EXHIBIT #{Math.floor(photoProgress * 10)}</span>
          </div>
          <h2 className="text-base font-extrabold text-slate-900 truncate">{currentPhoto.title}</h2>
          {currentPhoto.location && (
            <p className="text-xs font-mono text-slate-500 mt-0.5 flex items-center space-x-1 font-medium">
              <MapPin size={12} className="text-[#f97316]" />
              <span>{currentPhoto.location}</span>
            </p>
          )}
        </div>

        {/* 15s Progress Bar */}
        <div className="w-full h-2 bg-slate-200 border border-slate-300 rounded-full p-0.5">
          <div
            className="h-full bg-[#f97316] rounded-full transition-all duration-100 ease-linear"
            style={{ width: `${photoProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
