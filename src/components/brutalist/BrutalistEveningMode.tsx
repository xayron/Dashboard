import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, Disc3 } from 'lucide-react';

export const BrutalistEveningMode: React.FC = () => {
  const { media, livePosition, mediaControl, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  const isPlaying = media.state === 'playing';
  if (!isPlaying) return null;

  const volume = media.volume ?? 68;

  const formatSeconds = (sec: number) => {
    const s = Math.max(0, Math.floor(sec));
    const mins = Math.floor(s / 60);
    const remainder = s % 60;
    return `${mins}:${String(remainder).padStart(2, '0')}`;
  };

  const duration = isPlaying ? (media.duration || 0) : 0;
  const currentPos = isPlaying ? livePosition : 0;
  const progressPercent = isPlaying && duration > 0 ? Math.min(100, Math.max(0, (currentPos / duration) * 100)) : 0;

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!media.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    mediaControl('seek', ratio * media.duration);
  };

  return (
    <div className={`w-full h-full p-8 flex flex-col justify-center items-center bg-transparent select-none ${isLight ? 'text-black' : 'text-white'}`}>
      <div className={`w-full max-w-4xl border-4 p-8 flex space-x-10 items-center ${
        isLight
          ? 'border-black bg-white shadow-[8px_8px_0px_#000000]'
          : 'border-white bg-black shadow-[8px_8px_0px_#ffffff]'
      }`}>
        {/* Album Artwork Frame */}
        <div
          className={`relative w-72 h-72 border-4 shrink-0 flex items-center justify-center overflow-hidden ${
            isLight
              ? 'border-black bg-neutral-100 shadow-[6px_6px_0px_#000000]'
              : 'border-white bg-neutral-900 shadow-[6px_6px_0px_#ffff00]'
          }`}
        >
          {media.entityPicture ? (
            <img
              src={media.entityPicture}
              alt={media.title}
              className={`w-full h-full object-cover transition-transform duration-500 ${isPlaying ? 'scale-105' : 'scale-100'}`}
            />
          ) : (
            <div className="flex flex-col items-center text-center p-4">
              <Disc3 size={64} className="mb-2 animate-spin-slow" style={{ color: 'var(--color-accent)' }} />
              <span className="text-xs font-black uppercase tracking-wider">{media.title}</span>
            </div>
          )}
          <div
            className={`absolute top-2 left-2 px-2 py-0.5 font-black text-[10px] uppercase border ${
              isLight ? 'bg-white text-black border-black' : 'bg-black text-yellow-400 border-white'
            }`}
          >
            AUDIO//STREAM
          </div>
        </div>

        {/* Details & Controls */}
        <div className="flex-1 flex flex-col justify-between h-72 py-1">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span
                className={`px-2 py-0.5 text-black font-black text-xs uppercase tracking-wider border border-black ${
                  isLight ? 'shadow-[2px_2px_0px_#000]' : 'shadow-[2px_2px_0px_#fff]'
                }`}
                style={{ backgroundColor: 'var(--color-accent, #22d3ee)' }}
              >
                {media.entityId ? media.entityId.replace('media_player.', '').toUpperCase() : 'MAIN SPEAKER'}
              </span>
              <span className={`text-xs font-mono font-bold ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                STATUS: {isPlaying ? '▶ PLAYING' : '⏸ PAUSED'}
              </span>
            </div>

            <h1 className="text-4xl font-black uppercase tracking-tight line-clamp-1">
              {media.title}
            </h1>
            <p className="text-xl font-bold mt-1 uppercase tracking-wide truncate" style={{ color: 'var(--color-accent)' }}>
              {media.artist}
            </p>
            {media.album && (
              <p className={`text-xs font-bold uppercase mt-0.5 truncate ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                ALBUM: {media.album}
              </p>
            )}
          </div>

          {/* Scrub Bar */}
          <div className="my-2">
            <div
              onClick={handleScrub}
              title="Click to seek"
              className={`w-full h-5 border-2 cursor-pointer relative flex items-center p-0.5 ${
                isLight ? 'bg-neutral-200 border-black' : 'bg-neutral-900 border-white'
              }`}
            >
              <div
                className="h-full transition-[width] duration-300 ease-linear"
                style={{ width: `${progressPercent}%`, backgroundColor: 'var(--color-accent, #facc15)' }}
              />
            </div>
            <div className={`flex justify-between items-center text-xs font-mono font-bold mt-1.5 ${isLight ? 'text-neutral-700' : 'text-neutral-300'}`}>
              <span style={{ color: 'var(--color-accent)' }}>{formatSeconds(livePosition)}</span>
              <span>{formatSeconds(media.duration)}</span>
            </div>
          </div>

          {/* Buttons & Volume */}
          <div className={`flex items-center justify-between pt-2 border-t-2 ${isLight ? 'border-black/30' : 'border-white/30'}`}>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => mediaControl('prev')}
                className={`px-4 py-2 font-black text-xs uppercase border-2 hover:translate-x-0.5 active:translate-y-0.5 ${
                  isLight
                    ? 'bg-neutral-100 text-black border-black shadow-[3px_3px_0px_#000]'
                    : 'bg-white text-black border-2 border-black shadow-[3px_3px_0px_#fff]'
                }`}
              >
                &lt;&lt; PREV
              </button>

              <button
                onClick={() => mediaControl('toggle')}
                className={`px-6 py-2 font-black text-sm uppercase border-2 border-black hover:translate-x-0.5 active:translate-y-0.5 ${
                  isLight ? 'shadow-[3px_3px_0px_#000]' : 'shadow-[3px_3px_0px_#fff]'
                }`}
                style={{
                  backgroundColor: 'var(--color-accent, #facc15)',
                  color: 'var(--color-accent-contrast, #000000)',
                }}
              >
                {isPlaying ? 'PAUSE ||' : 'PLAY ▶'}
              </button>

              <button
                onClick={() => mediaControl('next')}
                className={`px-4 py-2 font-black text-xs uppercase border-2 hover:translate-x-0.5 active:translate-y-0.5 ${
                  isLight
                    ? 'bg-neutral-100 text-black border-black shadow-[3px_3px_0px_#000]'
                    : 'bg-white text-black border-2 border-black shadow-[3px_3px_0px_#fff]'
                }`}
              >
                NEXT &gt;&gt;
              </button>
            </div>

            {/* Volume indicator */}
            <div className="flex items-center space-x-2">
              <Volume2 size={16} />
              <span className="font-mono font-black text-xs">{volume}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
