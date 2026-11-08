import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Camera, MapPin } from 'lucide-react';

export const NeumorphicAmbientMode: React.FC = () => {
  const { currentPhoto, photoProgress, now, weather } = useDashboard();

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return (
    <div className="relative w-full h-full bg-[#1a1d24] overflow-hidden flex flex-col justify-between p-10 select-none">
      {/* Background Photo Framed as Plate */}
      <div className="absolute inset-0 z-0 p-8 flex items-center justify-center bg-[#1a1d24]">
        <div className="w-full h-full rounded-3xl overflow-hidden p-3 bg-[#1a1d24] shadow-[8px_8px_20px_#101217,-8px_-8px_20px_#242831]">
          <img
            src={currentPhoto.url}
            alt={currentPhoto.title}
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
      </div>

      {/* Top Bar: Embossed Clock Pill */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="px-5 py-2.5 rounded-2xl bg-[#1a1d24]/90 backdrop-blur-md shadow-[5px_5px_12px_#101217,-5px_-5px_12px_#242831] text-white flex items-center space-x-2">
          <span className="text-3xl font-light">{hours}:{minutes}</span>
          <span className="text-xs text-neutral-400 font-bold border-l border-neutral-600 pl-2">IST</span>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-[#1a1d24]/90 backdrop-blur-md shadow-[5px_5px_12px_#101217,-5px_-5px_12px_#242831] text-xs font-medium text-neutral-300">
          {weather.temperature}°C • {weather.condition}
        </div>
      </div>

      {/* Bottom Bar: Metadata Pill & Concave Bar */}
      <div className="relative z-10">
        <div className="p-4 rounded-2xl bg-[#1a1d24]/95 backdrop-blur-md shadow-[6px_6px_14px_#101217,-6px_-6px_14px_#242831] max-w-md text-white mb-3">
          <div className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider mb-0.5">
            PHOTO SHOWCASE
          </div>
          <h2 className="text-base font-bold truncate">{currentPhoto.title}</h2>
          {currentPhoto.location && (
            <p className="text-xs text-neutral-400 mt-0.5 flex items-center">
              <MapPin size={11} className="mr-1 text-blue-400" /> {currentPhoto.location}
            </p>
          )}
        </div>

        {/* 15s Concave Bar */}
        <div className="w-full h-2 rounded-full bg-[#1a1d24] shadow-[inset_2px_2px_5px_#101217,inset_-2px_-2px_5px_#242831] p-0.5 overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-100 ease-linear shadow-sm"
            style={{ width: `${photoProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
