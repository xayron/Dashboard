import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { TuiBox } from './TuiBox';
import { PhotoStack } from '../ambient/PhotoStack';

export const TuiAmbientMode: React.FC = () => {
  const { currentPhoto, photoProgress, media, now, weather, colorMode } = useDashboard();
  const isLight = colorMode === 'light';
  const { orientation, url } = currentPhoto;

  const isPortrait = orientation === 'portrait';

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
      {/* 1. BACKGROUND ENGINE */}
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

      {/* 2. PHOTO STACK RENDERING ENGINE */}
      <div className="absolute inset-0 z-10 flex items-center justify-center p-1 sm:p-2 md:p-3 pointer-events-auto">
        <PhotoStack isLight={isLight} uiStyle="tui" />
      </div>

      {/* 3. DYNAMIC ASCII TELEMETRY OVERLAYS */}
      <div className="relative z-20 w-full h-full flex flex-col justify-between p-6 md:p-8 pointer-events-none">
        <div className="flex justify-between items-start">
          <TuiBox title="SYS_CLOCK" badge="IST" className="pointer-events-auto min-w-[220px]">
            <div className={`text-3xl font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {hours}:{minutes}<span className="text-lg ml-1" style={{ color: 'var(--color-accent)' }}>:{seconds}</span>
            </div>
            <div className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>{dateFormatted}</div>
          </TuiBox>

          <TuiBox title="WX_STATUS" badge="METEO" className="pointer-events-auto min-w-[180px]">
            <div className="text-xs flex items-center justify-between">
              <span className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{weather.temperature}°C</span>
              <span className="font-bold uppercase ml-3" style={{ color: 'var(--color-accent)' }}>{weather.condition}</span>
            </div>
          </TuiBox>
        </div>

        <div className="flex justify-between items-end">
          {media.state === 'playing' ? (
            <TuiBox title="AUDIO_STREAM" badge="LIVE" className="pointer-events-auto max-w-sm">
              <div className="text-xs font-bold truncate" style={{ color: 'var(--color-accent)' }}>{media.title}</div>
              <div className={`text-[10px] truncate ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>{media.artist}</div>
            </TuiBox>
          ) : (
            <div />
          )}
        </div>
      </div>

      {/* 4. TERMINAL TIMER PROGRESS LINE */}
      <div
        className={`relative z-20 w-full border-t p-2 flex items-center justify-end text-xs px-6 pointer-events-none ${
          isLight ? 'bg-white/95 text-slate-700' : 'bg-black/90 text-gray-400'
        }`}
        style={{ borderColor: 'var(--color-accent-soft)' }}
      >
        <div className="flex items-center space-x-2 font-mono">
          <span className={isLight ? 'text-slate-500' : 'text-gray-400'}>ROTATION:</span>
          <span className="font-bold" style={{ color: 'var(--color-accent)' }}>{progressBarAscii}</span>
          <span className={`text-[11px] ${isLight ? 'text-slate-800' : 'text-white'}`}>{Math.round((photoProgress / 100) * 15)}s / 15s</span>
        </div>
      </div>
    </div>
  );
};
