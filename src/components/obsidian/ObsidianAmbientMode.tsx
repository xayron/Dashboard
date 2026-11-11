import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { PhotoStack } from '../ambient/PhotoStack';

export const ObsidianAmbientMode: React.FC = () => {
  const { currentPhoto, photoProgress, now, weather, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return (
    <div className={`relative w-full h-full overflow-hidden flex flex-col justify-between p-10 font-sans select-none transition-colors duration-300 ${
      isLight ? 'bg-[#f8fafc] text-slate-900' : 'bg-[#050507] text-[#eef0f3]'
    }`}>
      {/* Background Ambient Backdrop */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className={`w-full h-full bg-cover bg-center filter blur-3xl scale-110 ${
            isLight ? 'opacity-15' : 'opacity-20'
          }`}
          style={{ backgroundImage: `url(${currentPhoto.url})` }}
        />
      </div>

      {/* Center Faceted Obsidian Photo Stack */}
      <div className="absolute inset-0 z-10 flex items-center justify-center p-1 sm:p-2 md:p-3 pointer-events-auto">
        <PhotoStack isLight={isLight} uiStyle="obsidian" />
      </div>

      {/* Top Bar: Telemetry Masthead */}
      <div className="relative z-20 flex items-center justify-between pointer-events-none">
        <div className={`backdrop-blur-md px-5 py-2.5 flex items-center space-x-3 transition-colors duration-300 border pointer-events-auto ${
          isLight
            ? 'bg-white/90 border-slate-300 text-slate-900 shadow-sm'
            : 'bg-[#0f0f15]/90 border-white/[0.14] text-[#eef0f3]'
        }`}>
          <span className="text-3xl font-mono font-bold tracking-tight">{hours}:{minutes}</span>
          <span className={`text-sm font-mono ${isLight ? 'text-slate-500' : 'text-[#9a9da6]'}`}>:{seconds}</span>
          <span
            className="text-[10px] font-mono border-l pl-3 font-semibold"
            style={{
              borderColor: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.12)',
              color: 'var(--color-accent)',
            }}
          >
            AMBIENT DISPLAY
          </span>
        </div>

        <div className={`backdrop-blur-md px-4 py-2 text-xs font-mono transition-colors duration-300 border pointer-events-auto ${
          isLight
            ? 'bg-white/90 border-slate-300 text-slate-800 shadow-sm'
            : 'bg-[#0f0f15]/90 border-white/[0.14] text-[#eef0f3]'
        }`}>
          {weather.temperature}°C • {weather.condition}
        </div>
      </div>

      {/* Bottom Bar: 15s Progress Bar */}
      <div className="relative z-20 pointer-events-none">
        <div className={`w-full h-1.5 border p-0.5 ${
          isLight ? 'bg-slate-200 border-slate-300' : 'bg-[#08080c] border-white/[0.12]'
        }`}>
          <div
            className="h-full transition-all duration-100 ease-linear"
            style={{
              width: `${photoProgress}%`,
              backgroundColor: 'var(--color-accent)',
            }}
          />
        </div>
      </div>
    </div>
  );
};
