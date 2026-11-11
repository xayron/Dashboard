import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { PhotoStack } from '../ambient/PhotoStack';

export const CivicAmbientMode: React.FC = () => {
  const { currentPhoto, photoProgress, now, weather, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return (
    <div className={`relative w-full h-full overflow-hidden flex flex-col justify-between p-10 font-sans select-none transition-colors duration-300 ${
      isLight ? 'bg-[#f1f5f9] text-slate-900' : 'bg-[#0b1120] text-slate-100'
    }`}>
      {/* Background Archival Paper Wash Backdrop */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className={`w-full h-full bg-cover bg-center filter blur-3xl scale-110 ${
            isLight ? 'opacity-15' : 'opacity-25'
          }`}
          style={{ backgroundImage: `url(${currentPhoto.url})` }}
        />
      </div>

      {/* Center Civic Exhibition Photo Stack */}
      <div className="absolute inset-0 z-10 flex items-center justify-center p-1 sm:p-2 md:p-3 pointer-events-auto">
        <PhotoStack isLight={isLight} uiStyle="civic" />
      </div>

      {/* Top Bar: Clock & Conditions */}
      <div className="relative z-20 flex items-center justify-between pointer-events-none">
        <div className={`backdrop-blur-md border rounded-xl px-5 py-2.5 shadow-md flex items-center space-x-3 transition-colors duration-300 pointer-events-auto ${
          isLight ? 'bg-white/95 border-slate-300 text-slate-900' : 'bg-slate-900/95 border-slate-700 text-white'
        }`}>
          <span className="text-3xl font-mono font-black tracking-tight">{hours}:{minutes}</span>
          <span className="text-sm font-mono font-bold" style={{ color: 'var(--color-accent, #f97316)' }}>:{seconds}</span>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border uppercase ${
            isLight
              ? 'text-emerald-800 bg-emerald-100 border-emerald-300'
              : 'text-emerald-300 bg-emerald-950/80 border-emerald-500/50'
          }`}>
            AMBIENT DISPLAY
          </span>
        </div>

        <div className={`backdrop-blur-md border rounded-xl px-4 py-2 text-xs font-mono font-bold shadow-md transition-colors duration-300 pointer-events-auto ${
          isLight ? 'bg-white/95 border-slate-300 text-slate-800' : 'bg-slate-900/95 border-slate-700 text-slate-200'
        }`}>
          {weather.temperature}°C • {weather.condition}
        </div>
      </div>

      {/* Bottom Bar: 15s Progress Bar */}
      <div className="relative z-20 pointer-events-none">
        <div className={`w-full h-2 border rounded-full p-0.5 ${
          isLight ? 'bg-slate-200 border-slate-300' : 'bg-slate-800 border-slate-700'
        }`}>
          <div
            className="h-full rounded-full transition-all duration-100 ease-linear"
            style={{
              width: `${photoProgress}%`,
              backgroundColor: 'var(--color-accent, #f97316)',
            }}
          />
        </div>
      </div>
    </div>
  );
};
