import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { TuiBox } from './TuiBox';

export const TuiAmbientMode: React.FC = () => {
  const { currentPhoto, photoProgress, nextPhoto, prevPhoto, media, now, weather, aqi, colorMode } = useDashboard();
  const isLight = colorMode === 'light';
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
    <div className={`relative w-full h-full flex flex-col justify-between overflow-hidden bg-transparent font-mono select-none ${
      isLight ? 'text-slate-800' : 'text-gray-200'
    }`}>
      {/* 1. BACKGROUND ENGINE (Preserving identical Aspect Ratio Logic) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-50">
        {isPortrait ? (
          <div className="w-full h-full flex">
            <div
              className="w-1/2 h-full bg-cover bg-center filter blur-[40px] brightness-[0.3]"
              style={{ backgroundImage: `url(${url})` }}
            />
            <div
              className="w-1/2 h-full bg-cover bg-center -scale-x-100 filter blur-[40px] brightness-[0.3]"
              style={{ backgroundImage: `url(${url})` }}
            />
          </div>
        ) : (
          <div
            className="w-full h-full bg-cover bg-center filter blur-[35px] brightness-[0.3]"
            style={{ backgroundImage: `url(${url})` }}
          />
        )}
      </div>

      {/* 2. CENTER STAGE PHOTO (True Aspect Ratio, No Stretching/Cropping) */}
      <div className="absolute inset-0 z-0 flex items-center justify-center p-4">
        <img
          key={url}
          src={url}
          alt={title}
          className="max-h-full max-w-full object-contain border border-stone-800 shadow-2xl transition-opacity duration-700"
        />
      </div>

      {/* 3. DYNAMIC ASCII TELEMETRY OVERLAYS */}
      {isPortrait ? (
        <div className="relative z-10 w-full h-full flex justify-between p-8 pointer-events-none">
          {/* Left Sideband: Shifted Clock */}
          <div className="w-[28%] flex flex-col justify-between pointer-events-auto space-y-4">
            <TuiBox title="SYS_CLOCK" badge="IST" className="w-full">
              <div className="py-2 text-center">
                <div className={`text-4xl font-extrabold tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {hours}:{minutes}
                  <span className="text-xl ml-1 font-mono" style={{ color: 'var(--color-accent)' }}>:{seconds}</span>
                </div>
                <div className="text-xs font-bold mt-1" style={{ color: 'var(--color-accent)' }}>{dateFormatted}</div>
              </div>
            </TuiBox>

            {media.state === 'playing' && (
              <TuiBox title="NOW_PLAYING" badge="AUDIO" className="mt-auto">
                <div className="text-xs">
                  <div className={`font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{media.title}</div>
                  <div className={`truncate mt-0.5 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>{media.artist}</div>
                </div>
              </TuiBox>
            )}
          </div>

          {/* Right Sideband: Terminal Weather & EXIF */}
          <div className="w-[28%] flex flex-col justify-between items-end pointer-events-auto space-y-4">
            <TuiBox title="ATMOSPHERIC" badge="WX" className="w-full">
              <div className="text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className={isLight ? 'text-slate-500' : 'text-gray-400'}>TEMP:</span>
                  <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{weather.temperature}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className={isLight ? 'text-slate-500' : 'text-gray-400'}>COND:</span>
                  <span className="uppercase truncate font-bold" style={{ color: 'var(--color-accent)' }}>{weather.condition}</span>
                </div>
                <div className="flex justify-between">
                  <span className={isLight ? 'text-slate-500' : 'text-gray-400'}>AQI:</span>
                  <span className="text-amber-500 font-bold">{aqi.usAqi} ({aqi.label})</span>
                </div>
              </div>
            </TuiBox>

            {/* EXIF Metadata Box */}
            <TuiBox title="FRAME_METADATA" badge="EXIF" className="w-full mt-auto text-xs">
              <div className="space-y-1 text-[11px]">
                <div className={`font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{title}</div>
                {location && <div className={isLight ? 'text-slate-600' : 'text-gray-300'}>LOC: {location}</div>}
                {credit && <div className={isLight ? 'text-slate-500' : 'text-gray-400'}>BY: {credit}</div>}
                <div className="pt-1 border-t text-[10px]" style={{ color: 'var(--color-accent)', borderColor: 'var(--color-accent-soft)' }}>
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
              <div className={`text-3xl font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {hours}:{minutes}<span className="text-lg ml-1" style={{ color: 'var(--color-accent)' }}>{seconds}</span>
              </div>
              <div className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>{dateFormatted}</div>
            </TuiBox>

            <TuiBox title="WX_STATUS" badge="OPEN-METEO" className="pointer-events-auto min-w-[200px]">
              <div className="text-xs flex items-center justify-between">
                <span className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{weather.temperature}°C</span>
                <span className="font-bold uppercase" style={{ color: 'var(--color-accent)' }}>{weather.condition}</span>
              </div>
            </TuiBox>
          </div>

          <div className="flex justify-between items-end">
            <TuiBox title="MEDIA_FILE" badge="ACTIVE" className="pointer-events-auto max-w-md">
              <div className={`text-xs font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{title}</div>
              <div className={`text-[10px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                {location || 'Unspecified'} | RATIO: {aspectRatio.toFixed(2)}
              </div>
            </TuiBox>

            {media.state === 'playing' && (
              <TuiBox title="AUDIO_STREAM" badge="LIVE" className="pointer-events-auto max-w-sm">
                <div className="text-xs font-bold truncate" style={{ color: 'var(--color-accent)' }}>{media.title}</div>
                <div className={`text-[10px] truncate ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>{media.artist}</div>
              </TuiBox>
            )}
          </div>
        </div>
      )}

      {/* 4. TERMINAL TIMER & PHOTO NAVIGATION */}
      <div
        className={`relative z-20 w-full border-t p-2 flex items-center justify-between text-xs px-6 ${
          isLight ? 'bg-white/95 text-slate-700' : 'bg-black/90 text-gray-400'
        }`}
        style={{ borderColor: 'var(--color-accent-soft)' }}
      >
        <div className="flex items-center space-x-2">
          <button
            onClick={prevPhoto}
            className={`px-2 py-0.5 font-bold ${
              isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            [&lt; PREV]
          </button>
          <button
            onClick={nextPhoto}
            className={`px-2 py-0.5 font-bold ${
              isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            [NEXT &gt;]
          </button>
        </div>

        {/* Character Progress Line */}
        <div className="flex items-center space-x-2 font-mono">
          <span className={isLight ? 'text-slate-500' : 'text-gray-400'}>ROTATION:</span>
          <span className="font-bold" style={{ color: 'var(--color-accent)' }}>{progressBarAscii}</span>
          <span className={`text-[11px] ${isLight ? 'text-slate-800' : 'text-white'}`}>{Math.round((photoProgress / 100) * 15)}s / 15s</span>
        </div>
      </div>
    </div>
  );
};
