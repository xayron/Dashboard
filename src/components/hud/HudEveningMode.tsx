import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, Disc } from 'lucide-react';

export const HudEveningMode: React.FC = () => {
  const { media, livePosition, mediaControl, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  const isPlaying = media.state === 'playing';
  const volume = media.volume ?? 68;

  const formatSeconds = (sec: number) => {
    const s = Math.max(0, Math.floor(sec));
    const mins = Math.floor(s / 60);
    const remainder = s % 60;
    return `${mins}:${String(remainder).padStart(2, '0')}`;
  };

  const duration = media.duration || 1;
  const progressPercent = Math.min(100, Math.max(0, (livePosition / duration) * 100));

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!media.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    mediaControl('seek', ratio * media.duration);
  };

  return (
    <div className={`w-full h-full p-8 flex flex-col justify-center items-center bg-transparent font-mono select-none ${
      isLight ? 'text-slate-900' : 'text-cyan-200'
    }`}>
      <div
        className={`relative w-full max-w-4xl border p-8 flex space-x-10 items-center ${
          isLight
            ? 'bg-cyan-50/90 border-cyan-400/60 shadow-[0_0_35px_rgba(0,180,216,0.15)] text-slate-900'
            : 'bg-[#04091a]/95 border-cyan-500/50 shadow-[0_0_35px_rgba(0,240,255,0.12)] text-cyan-200'
        }`}
      >
        {/* 4 Corner HUD Reticles */}
        <span className="absolute -top-[2px] -left-[2px] w-4 h-4 border-t-2 border-l-2" style={{ borderColor: 'var(--color-accent)' }} />
        <span className="absolute -top-[2px] -right-[2px] w-4 h-4 border-t-2 border-r-2" style={{ borderColor: 'var(--color-accent)' }} />
        <span className="absolute -bottom-[2px] -left-[2px] w-4 h-4 border-b-2 border-l-2" style={{ borderColor: 'var(--color-accent)' }} />
        <span className="absolute -bottom-[2px] -right-[2px] w-4 h-4 border-b-2 border-r-2" style={{ borderColor: 'var(--color-accent)' }} />

        {/* Album Artwork Frame with Tactical Reticle */}
        <div className={`relative w-72 h-72 border p-2 shrink-0 flex items-center justify-center overflow-hidden ${
          isLight ? 'bg-white border-cyan-400/60' : 'bg-black border-cyan-500/60'
        }`}>
          <div
            className="absolute top-2 left-2 z-10 px-2 py-0.5 border text-[10px]"
            style={{
              backgroundColor: 'var(--theme-accent-soft)',
              borderColor: 'var(--color-accent)',
              color: 'var(--color-accent)',
            }}
          >
            SONIC://FEED
          </div>
          {media.entityPicture ? (
            <img
              src={media.entityPicture}
              alt={media.title}
              className={`w-full h-full object-cover filter contrast-125 transition-transform duration-700 ${isPlaying ? 'scale-105' : 'scale-100'}`}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-4" style={{ color: 'var(--color-accent)' }}>
              <Disc size={64} className="animate-spin-slow mb-2" />
              <span className="text-xs uppercase tracking-widest">{media.title}</span>
            </div>
          )}
        </div>

        {/* Tactical Info & HUD Controls */}
        <div className="flex-1 flex flex-col justify-between h-72 py-1">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span
                className="px-2 py-0.5 text-[10px] tracking-widest uppercase border"
                style={{
                  backgroundColor: 'var(--theme-accent-soft)',
                  borderColor: 'var(--color-accent)',
                  color: 'var(--color-accent)',
                }}
              >
                TARGET: {media.entityId ? media.entityId.replace('media_player.', '').toUpperCase() : 'MAIN_MODULE'}
              </span>
              <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                FREQ: {isPlaying ? 'STREAMING_ONLINE' : 'STREAM_STANDBY'}
              </span>
            </div>

            <h1 className={`text-3xl font-black tracking-wider line-clamp-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {media.title}
            </h1>
            <p className="text-lg font-bold mt-1 tracking-wide truncate" style={{ color: 'var(--color-accent)' }}>
              {media.artist}
            </p>
            {media.album && (
              <p className={`text-xs mt-0.5 truncate ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                ARCHIVE: {media.album}
              </p>
            )}
          </div>

          {/* Tactical Scrub Line */}
          <div className="my-2">
            <div
              onClick={handleScrub}
              title="Click to seek"
              className={`w-full h-3 border cursor-pointer relative flex items-center p-0.5 ${
                isLight ? 'bg-cyan-100/60 border-cyan-400/50' : 'bg-black/60 border-cyan-500/40'
              }`}
            >
              <div
                className="h-full transition-[width] duration-300 ease-linear"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: 'var(--color-accent)',
                  boxShadow: '0 0 10px var(--color-glow)',
                }}
              />
            </div>
            <div className={`flex justify-between items-center text-xs font-mono mt-1 ${isLight ? 'text-slate-600' : 'text-cyan-300'}`}>
              <span style={{ color: 'var(--color-accent)' }}>{formatSeconds(livePosition)}</span>
              <span>{formatSeconds(media.duration)}</span>
            </div>
          </div>

          {/* Buttons & Output Level */}
          <div className={`flex items-center justify-between pt-2 border-t ${
            isLight ? 'border-cyan-300/40' : 'border-cyan-500/30'
          }`}>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => mediaControl('prev')}
                className={`px-3 py-1.5 border text-xs tracking-wider transition-colors ${
                  isLight
                    ? 'bg-cyan-100/80 border-cyan-400/60 text-slate-900 hover:bg-cyan-200/80'
                    : 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/50'
                }`}
              >
                &lt;&lt; PREV
              </button>

              <button
                onClick={() => mediaControl('toggle')}
                className="px-5 py-1.5 border font-black text-xs tracking-widest transition-transform hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: 'var(--color-accent)',
                  borderColor: 'var(--color-accent)',
                  color: 'var(--color-accent-contrast, #ffffff)',
                  boxShadow: '0 0 15px var(--color-glow)',
                }}
              >
                {isPlaying ? 'PAUSE [||]' : 'EXECUTE [▶]'}
              </button>

              <button
                onClick={() => mediaControl('next')}
                className={`px-3 py-1.5 border text-xs tracking-wider transition-colors ${
                  isLight
                    ? 'bg-cyan-100/80 border-cyan-400/60 text-slate-900 hover:bg-cyan-200/80'
                    : 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/50'
                }`}
              >
                NEXT &gt;&gt;
              </button>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <Volume2 size={16} style={{ color: 'var(--color-accent)' }} />
              <span className="font-bold">{volume}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
