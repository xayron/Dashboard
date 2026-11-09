import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

export const MinimalEveningMode: React.FC = () => {
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
    <div className={`w-full h-full p-16 flex flex-col justify-center items-center bg-transparent select-none ${isLight ? 'text-neutral-900' : 'text-neutral-100'}`}>
      <div className="w-full max-w-3xl flex items-center space-x-14">
        {/* Album Artwork */}
        <div className={`w-72 h-72 rounded-2xl overflow-hidden shrink-0 border ${
          isLight ? 'bg-neutral-100 border-neutral-200 shadow-xl' : 'bg-neutral-900 border-white/10 shadow-2xl'
        }`}>
          {media.entityPicture ? (
            <img
              src={media.entityPicture}
              alt={media.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${isLight ? 'text-neutral-400' : 'text-neutral-600'}`}>
              No Cover
            </div>
          )}
        </div>

        {/* Metadata & Controls */}
        <div className="flex-1 flex flex-col justify-between h-72 py-2">
          <div>
            <span className={`text-[11px] font-mono tracking-widest uppercase block mb-2 ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>
              {media.entityId ? media.entityId.replace('media_player.', '') : 'Audio Out'}
            </span>
            <h1 className={`text-3xl font-light tracking-tight line-clamp-1 ${isLight ? 'text-neutral-900' : 'text-white'}`}>
              {media.title}
            </h1>
            <p className={`text-base font-light mt-1 truncate ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
              {media.artist}
            </p>
            {media.album && (
              <p className={`text-xs font-light mt-0.5 truncate ${isLight ? 'text-neutral-400' : 'text-neutral-600'}`}>
                {media.album}
              </p>
            )}
          </div>

          {/* Hairline Progress Bar */}
          <div className="my-4">
            <div
              onClick={handleScrub}
              title="Click to seek"
              className={`w-full h-1 rounded-full cursor-pointer relative flex items-center group py-2 ${
                isLight ? 'bg-neutral-200' : 'bg-neutral-800'
              }`}
            >
              <div
                className="h-1 rounded-full transition-[width] duration-300 ease-linear"
                style={{ width: `${progressPercent}%`, backgroundColor: 'var(--color-accent)' }}
              />
            </div>
            <div className={`flex justify-between items-center text-xs font-mono mt-1 ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>
              <span style={{ color: 'var(--color-accent)' }}>{formatSeconds(livePosition)}</span>
              <span>{formatSeconds(media.duration)}</span>
            </div>
          </div>

          {/* Controls & Volume */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => mediaControl('prev')}
                className={`transition-colors ${isLight ? 'text-neutral-500 hover:text-neutral-900' : 'text-neutral-400 hover:text-white'}`}
              >
                <SkipBack size={20} />
              </button>

              <button
                onClick={() => mediaControl('toggle')}
                className="w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-md"
                style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-contrast, #ffffff)' }}
              >
                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
              </button>

              <button
                onClick={() => mediaControl('next')}
                className={`transition-colors ${isLight ? 'text-neutral-500 hover:text-neutral-900' : 'text-neutral-400 hover:text-white'}`}
              >
                <SkipForward size={20} />
              </button>
            </div>

            <div className={`flex items-center space-x-2 text-xs font-mono ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>
              <Volume2 size={16} />
              <span>{volume}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
