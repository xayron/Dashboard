import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Crosshair } from 'lucide-react';
import { PhotoStack } from '../ambient/PhotoStack';

export const HudAmbientMode: React.FC = () => {
  const { currentPhoto, photoProgress, now, weather, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return (
    <div className={`relative w-full h-full overflow-hidden flex flex-col justify-between p-8 font-mono select-none transition-colors duration-300 ${
      isLight ? 'bg-slate-100 text-slate-900' : 'bg-[#030712] text-cyan-200'
    }`}>
      {/* Tactical Ambient Backdrop */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className={`w-full h-full bg-cover bg-center filter blur-2xl scale-110 ${
            isLight ? 'opacity-20' : 'opacity-25'
          }`}
          style={{ backgroundImage: `url(${currentPhoto.url})` }}
        />
        <div className={`absolute inset-0 ${
          isLight
            ? 'bg-gradient-to-t from-slate-100 via-transparent to-slate-100/70'
            : 'bg-gradient-to-t from-[#030712] via-transparent to-[#030712]/60'
        }`} />
        {/* Subtle grid pattern */}
        <div className={`absolute inset-0 ${
          isLight
            ? 'bg-[linear-gradient(to_right,#0284c710_1px,transparent_1px),linear-gradient(to_bottom,#0284c710_1px,transparent_1px)] bg-[size:4rem_4rem]'
            : 'bg-[linear-gradient(to_right,#00f0ff08_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff08_1px,transparent_1px)] bg-[size:4rem_4rem]'
        }`} />
      </div>

      {/* Center Tactical Photo Stack */}
      <div className="absolute inset-0 z-10 flex items-center justify-center p-1 sm:p-2 md:p-3 pointer-events-auto">
        <PhotoStack isLight={isLight} uiStyle="hud" />
      </div>

      {/* Top Bar: Tactical Telemetry */}
      <div className="relative z-20 flex items-center justify-between pointer-events-none">
        <div className={`border p-3 flex items-center space-x-3 transition-colors duration-300 pointer-events-auto ${
          isLight
            ? 'bg-white/95 border-cyan-400/60 shadow-md text-slate-900'
            : 'bg-[#04091a]/90 border-cyan-500/50 shadow-[0_0_20px_rgba(0,240,255,0.15)] text-white'
        }`}>
          <Crosshair size={18} style={{ color: 'var(--color-accent)' }} />
          <span className={`text-3xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>{hours}:{minutes}</span>
          <span className={`text-xs border-l pl-2 ${
            isLight ? 'border-cyan-300 text-cyan-700' : 'border-cyan-500/40 text-cyan-400'
          }`}>
            IST//UTC+5:30
          </span>
        </div>

        <div className={`border px-3 py-2 text-xs transition-colors duration-300 pointer-events-auto ${
          isLight
            ? 'bg-white/95 border-cyan-400/60 shadow-md text-slate-800'
            : 'bg-[#04091a]/90 border-cyan-500/50 text-cyan-300'
        }`}>
          SURFACE: {weather.temperature}°C // {weather.condition.toUpperCase()}
        </div>
      </div>

      {/* Bottom Bar: HUD Vector Progress Bar */}
      <div className="relative z-20 pointer-events-none">
        <div className={`w-full h-2 border p-0.5 ${
          isLight ? 'bg-slate-200 border-slate-300' : 'bg-[#04091a] border-cyan-500/40'
        }`}>
          <div
            className="h-full transition-all duration-100 ease-linear"
            style={{
              width: `${photoProgress}%`,
              backgroundColor: 'var(--color-accent)',
              boxShadow: isLight ? 'none' : '0 0 10px var(--color-glow)',
            }}
          />
        </div>
      </div>
    </div>
  );
};
