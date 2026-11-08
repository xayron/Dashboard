import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TuiBox } from './TuiBox';

export const TuiAmbientMode: React.FC = () => {
  const { currentPhoto, photoProgress, nextPhoto, prevPhoto, media, now, weather, aqi } = useDashboard();
  const { orientation, url, title, location, credit, aspectRatio } = currentPhoto;

  const isPortrait = orientation === 'portrait';
  const isStandard = orientation === 'standard';
  const isLandscape = orientation === 'landscape';

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const dateFormatted = now.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  }).toUpperCase();

  const totalBlocks = 30;
  const filledBlocks = Math.round((photoProgress / 100) * totalBlocks);
  const progressBarAscii = `[${'█'.repeat(filledBlocks)}${'░'.repeat(totalBlocks - filledBlocks)}]`;

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-black font-mono select-none">
      {/* 1. BACKGROUND ENGINE (Preserving identical Aspect Ratio Logic) */}
      {isPortrait ? (
        <div className="absolute inset-0 z-0 flex pointer-events-none overflow-hidden opacity-60">
          <div
            className="w-1/2 h-full bg-cover bg-center filter blur-[40px] brightness-[0.3]"
            style={{ backgroundImage: `url(${url})` }}
          />
          <div
            className="w-1/2 h-full bg-cover bg-center -scale-x-100 filter blur-[40px] brightness-[0.3]"
            style={{ backgroundImage: `url(${url})` }}
          />
        </div>
      ) : isStandard ? (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-50">
          <div
            className="w-full h-full bg-cover bg-center filter blur-[30px] brightness-[0.35]"
            style={{ backgroundImage: `url(${url})` }}
          />
        </div>
      ) : null}

      {/* 2. CENTER STAGE PHOTO */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        {isLandscape ? (
          <img
            key={url}
            src={url}
            alt={title}
            className="w-full h-full object-cover"
            style={{ objectPosition: '50% 35%' }}
          />
        ) : isStandard ? (
          <div className="p-2 border-2 border-emerald-500/50 bg-black/80">
            <img key={url} src={url} alt={title} className="max-h-[85vh] max-w-[80vw] object-contain" />
          </div>
        ) : (
          /* Portrait uncropped with terminal borders */
          <div className="relative h-full py-6 flex items-center justify-center">
            <div className="h-full border-2 border-emerald-500/60 p-1.5 bg-black shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <img key={url} src={url} alt={title} className="h-full w-auto object-contain" />
            </div>
          </div>
        )}
      </div>

      {/* 3. TUI WIDGET OVERLAYS WITH DYNAMIC WIDGET SHIFT */}
      {isPortrait ? (
        /* Portrait Shift: Overlays moved into left and right sidebands */
        <div className="relative z-10 w-full h-full flex justify-between p-8 pointer-events-none">
          {/* Left Sideband: Terminal Clock & Status */}
          <div className="w-[28%] flex flex-col justify-between pointer-events-auto space-y-4">
            <TuiBox title="TTY1_CLOCK" badge="IST">
              <div className="py-2 text-center">
                <div className="text-5xl font-black text-white tracking-wider">
                  {hours}:{minutes}<span className="text-emerald-400 text-xl ml-1">{seconds}</span>
                </div>
                <div className="text-xs text-emerald-400 mt-1 font-bold">{dateFormatted}</div>
              </div>
            </TuiBox>

            {media.state === 'playing' && (
              <TuiBox title="NOW_PLAYING" badge="AUDIO" className="mt-auto">
                <div className="text-xs">
                  <div className="text-white font-bold truncate">{media.title}</div>
                  <div className="text-gray-400 truncate mt-0.5">{media.artist}</div>
                </div>
              </TuiBox>
            )}
          </div>

          {/* Right Sideband: Terminal Weather & EXIF */}
          <div className="w-[28%] flex flex-col justify-between items-end pointer-events-auto space-y-4">
            <TuiBox title="ATMOSPHERIC" badge="WX" className="w-full">
              <div className="text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-400">TEMP:</span>
                  <span className="text-white font-bold">{weather.temperature}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">COND:</span>
                  <span className="text-emerald-300 uppercase truncate font-bold">{weather.condition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">AQI:</span>
                  <span className="text-amber-400 font-bold">{aqi.usAqi} ({aqi.label})</span>
                </div>
              </div>
            </TuiBox>

            {/* EXIF Metadata Box */}
            <TuiBox title="FRAME_METADATA" badge="EXIF" className="w-full mt-auto text-xs">
              <div className="space-y-1 text-[11px]">
                <div className="text-white font-bold truncate">{title}</div>
                {location && <div className="text-gray-300">LOC: {location}</div>}
                {credit && <div className="text-gray-400">BY: {credit}</div>}
                <div className="text-emerald-400 pt-1 border-t border-gray-800 text-[10px]">
                  RATIO: {aspectRatio.toFixed(2)} [PORTRAIT_WING_ENGAGED]
                </div>
              </div>
            </TuiBox>
          </div>
        </div>
      ) : (
        /* Landscape / Standard Overlays */
        <div className="relative z-10 w-full h-full flex flex-col justify-between p-8 pointer-events-none">
          <div className="flex justify-between items-start">
            <TuiBox title="SYS_CLOCK" badge="IST" className="pointer-events-auto min-w-[240px]">
              <div className="text-3xl font-extrabold text-white">
                {hours}:{minutes}<span className="text-emerald-400 text-lg ml-1">{seconds}</span>
              </div>
              <div className="text-xs text-gray-400 mt-0.5">{dateFormatted}</div>
            </TuiBox>

            <TuiBox title="WX_STATUS" badge="OPEN-METEO" className="pointer-events-auto min-w-[200px]">
              <div className="text-xs flex items-center justify-between">
                <span className="text-xl font-bold text-white">{weather.temperature}°C</span>
                <span className="text-emerald-300 font-bold uppercase">{weather.condition}</span>
              </div>
            </TuiBox>
          </div>

          <div className="flex justify-between items-end">
            <TuiBox title="MEDIA_FILE" badge="ACTIVE" className="pointer-events-auto max-w-md">
              <div className="text-xs font-bold text-white truncate">{title}</div>
              <div className="text-[10px] text-gray-400 mt-0.5">
                {location || 'Unspecified'} | RATIO: {aspectRatio.toFixed(2)}
              </div>
            </TuiBox>

            {media.state === 'playing' && (
              <TuiBox title="AUDIO_STREAM" badge="LIVE" className="pointer-events-auto max-w-sm">
                <div className="text-xs text-emerald-400 font-bold truncate">{media.title}</div>
                <div className="text-[10px] text-gray-400 truncate">{media.artist}</div>
              </TuiBox>
            )}
          </div>
        </div>
      )}

      {/* 4. TERMINAL TIMER & PHOTO NAVIGATION */}
      <div className="relative z-20 w-full bg-black/90 border-t border-emerald-500/40 p-2 flex items-center justify-between text-xs text-gray-400 px-6">
        <div className="flex items-center space-x-2">
          <button
            onClick={prevPhoto}
            className="px-2 py-0.5 bg-white/10 hover:bg-white/20 text-white font-bold"
          >
            [&lt; PREV]
          </button>
          <button
            onClick={nextPhoto}
            className="px-2 py-0.5 bg-white/10 hover:bg-white/20 text-white font-bold"
          >
            [NEXT &gt;]
          </button>
        </div>

        {/* Character Progress Line */}
        <div className="flex items-center space-x-2 font-mono">
          <span className="text-gray-400">ROTATION:</span>
          <span className="text-emerald-400 font-bold">{progressBarAscii}</span>
          <span className="text-white text-[11px]">{Math.round((photoProgress / 100) * 15)}s / 15s</span>
        </div>
      </div>
    </div>
  );
};
