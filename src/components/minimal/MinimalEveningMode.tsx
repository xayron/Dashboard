import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

export const MinimalEveningMode: React.FC = () => {
  const { media, livePosition, mediaControl } = useDashboard();

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
    <div className="w-full h-full p-16 flex flex-col justify-center items-center bg-[#09090b] text-neutral-100 select-none">
      <div className="w-full max-w-3xl flex items-center space-x-14">
        {/* Album Artwork */}
        <div className="w-72 h-72 rounded-2xl overflow-hidden shadow-2xl bg-neutral-900 shrink-0 border border-white/10">
          {media.entityPicture ? (
            <img
              src={media.entityPicture}
              alt={media.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-600">
              No Cover
            </div>
          )}
        </div>

        {/* Metadata & Controls */}
        <div className="flex-1 flex flex-col justify-between h-72 py-2">
          <div>
            <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-500 block mb-2">
              {media.entityId ? media.entityId.replace('media_player.', '') : 'Audio Out'}
            </span>
            <h1 className="text-3xl font-light text-white tracking-tight line-clamp-1">
              {media.title}
            </h1>
            <p className="text-base font-light text-neutral-400 mt-1 truncate">
              {media.artist}
            </p>
            {media.album && (
              <p className="text-xs font-light text-neutral-600 mt-0.5 truncate">
                {media.album}
              </p>
            )}
          </div>

          {/* Hairline Progress Bar */}
          <div className="my-4">
            <div
              onClick={handleScrub}
              title="Click to seek"
              className="w-full h-1 bg-neutral-800 rounded-full cursor-pointer relative flex items-center group py-2"
            >
              <div
                className="h-1 bg-white rounded-full transition-[width] duration-300 ease-linear"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] font-mono text-neutral-500 mt-1">
              <span>{formatSeconds(livePosition)}</span>
              <span>{formatSeconds(media.duration)}</span>
            </div>
          </div>

          {/* Playback Controls & Volume */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-6 text-neutral-400">
              <button
                onClick={() => mediaControl('prev')}
                className="hover:text-white transition-colors"
                title="Previous track"
              >
                <SkipBack size={18} />
              </button>
              <button
                onClick={() => mediaControl('toggle')}
                className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
              </button>
              <button
                onClick={() => mediaControl('next')}
                className="hover:text-white transition-colors"
                title="Next track"
              >
                <SkipForward size={18} />
              </button>
            </div>

            <div className="flex items-center space-x-2 text-neutral-500">
              <Volume2 size={16} />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => mediaControl('volume', Number(e.target.value))}
                className="w-20 h-1 bg-neutral-800 appearance-none accent-white cursor-pointer"
              />
              <span className="text-[11px] font-mono text-neutral-400 w-7 text-right">{volume}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
