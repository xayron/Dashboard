import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { PhotoStack } from '../ambient/PhotoStack';

export const RetrowaveAmbientMode: React.FC = () => {
  const { currentPhoto, photoProgress, now, weather, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return (
    <div className={`relative w-full h-full overflow-hidden flex flex-col justify-between p-8 select-none transition-colors duration-300 ${
      isLight ? 'bg-[#fdf4ff] text-slate-900' : 'bg-[#150424] text-white'
    }`}>
      {/* Neon Gradient Ambient Backdrop */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className={`w-full h-full bg-cover bg-center filter blur-3xl scale-110 saturate-150 ${
            isLight ? 'opacity-25' : 'opacity-35'
          }`}
          style={{ backgroundImage: `url(${currentPhoto.url})` }}
        />
        <div className={`absolute inset-0 ${
          isLight
            ? 'bg-gradient-to-t from-[#fdf4ff] via-transparent to-[#fdf4ff]/70'
            : 'bg-gradient-to-t from-[#150424] via-transparent to-[#150424]/60'
        }`} />
      </div>

      {/* Center Laser Neon Photo Stack */}
      <div className="absolute inset-0 z-10 flex items-center justify-center p-1 sm:p-2 md:p-3 pointer-events-auto">
        <PhotoStack isLight={isLight} uiStyle="retrowave" />
      </div>

      {/* Top Bar: Neon Sunset Clock */}
      <div className="relative z-20 flex items-center justify-between pointer-events-none">
        <div className={`border-2 rounded-2xl px-5 py-2.5 flex items-center space-x-2 transition-colors duration-300 pointer-events-auto ${
          isLight
            ? 'bg-white/90 border-pink-400 text-slate-900 shadow-md'
            : 'bg-[#1e0736]/90 border-pink-500 text-white shadow-[0_0_25px_rgba(255,0,127,0.4)]'
        }`}>
          <span className="text-3xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-pink-600 to-rose-600">
            {hours}:{minutes}
          </span>
          <span className={`text-xs font-bold border-l pl-2 ${
            isLight ? 'border-pink-300 text-pink-700' : 'border-pink-500/40 text-amber-300'
          }`}>
            IST
          </span>
        </div>

        <div className={`border rounded-2xl px-4 py-2 text-xs font-bold uppercase transition-colors duration-300 pointer-events-auto ${
          isLight
            ? 'bg-white/90 border-pink-300 text-pink-800 shadow-sm'
            : 'bg-[#1e0736]/90 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] text-amber-300'
        }`}>
          {weather.temperature}°C // {weather.condition}
        </div>
      </div>

      {/* Bottom Bar: 15s Laser Progress Bar */}
      <div className="relative z-20 pointer-events-none">
        <div className={`w-full h-2 rounded-full border p-0.5 overflow-hidden ${
          isLight ? 'bg-pink-100 border-pink-300' : 'bg-[#1e0736] border-pink-500/50'
        }`}>
          <div
            className="h-full rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 shadow-[0_0_12px_#ff007f] transition-all duration-100 ease-linear"
            style={{ width: `${photoProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
