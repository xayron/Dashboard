import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, Disc } from 'lucide-react';

export const NeumorphicEveningMode: React.FC = () => {
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
    <div className="w-full h-full p-12 flex flex-col justify-center items-center bg-[#1a1d24] text-neutral-200 select-none">
      <div className="w-full max-w-4xl p-8 rounded-3xl bg-[#1a1d24] shadow-[10px_10px_25px_#101217,-10px_-10px_25px_#242831] flex space-x-10 items-center">
        {/* Sculpted Artwork Frame */}
        <div className="w-72 h-72 rounded-3xl p-3 bg-[#1a1d24] shadow-[inset_4px_4px_10px_#101217,inset_-4px_-4px_10px_#242831] shrink-0 flex items-center justify-center overflow-hidden">
          {media.entityPicture ? (
            <img
              src={media.entityPicture}
              alt={media.title}
              className={`w-full h-full object-cover rounded-2xl transition-transform duration-700 ${isPlaying ? 'scale-105' : 'scale-100'}`}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-neutral-500">
              <Disc size={64} className="animate-spin-slow mb-2" />
              <span className="text-xs font-bold uppercase">{media.title}</span>
            </div>
          )}
        </div>

        {/* Track Metadata & Tactile Controls */}
        <div className="flex-1 flex flex-col justify-between h-72 py-1">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase text-blue-400 font-bold">
                SPEAKER: {media.entityId ? media.entityId.replace('media_player.', '').toUpperCase() : 'MAIN'}
              </span>
              <span className="text-xs text-neutral-400">
                {isPlaying ? '● Playing' : '○ Paused'}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-white tracking-tight line-clamp-1">
              {media.title}
            </h1>
            <p className="text-lg text-neutral-300 font-medium mt-1 truncate">
              {media.artist}
            </p>
            {media.album && (
              <p className="text-xs text-neutral-500 mt-0.5 truncate">
                {media.album}
              </p>
            )}
          </div>

          {/* Concave Progress Bar */}
          <div className="my-3">
            <div
              onClick={handleScrub}
              title="Click to seek"
              className="w-full h-3 rounded-full bg-[#1a1d24] shadow-[inset_2px_2px_5px_#101217,inset_-2px_-2px_5px_#242831] cursor-pointer relative flex items-center p-0.5"
            >
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-[width] duration-300 ease-linear shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-xs font-mono text-neutral-400 mt-1.5">
              <span>{formatSeconds(livePosition)}</span>
              <span>{formatSeconds(media.duration)}</span>
            </div>
          </div>

          {/* Controls & Volume */}
          <div className="flex items-center justify-between pt-2 border-t border-neutral-700/40">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => mediaControl('prev')}
                className="w-10 h-10 rounded-2xl bg-[#1a1d24] shadow-[4px_4px_8px_#101217,-4px_-4px_8px_#242831] hover:shadow-[inset_2px_2px_4px_#101217,inset_-2px_-2px_4px_#242831] flex items-center justify-center text-neutral-300 hover:text-white transition-all active:scale-95"
                title="Previous track"
              >
                <SkipBack size={16} />
              </button>
              <button
                onClick={() => mediaControl('toggle')}
                className="w-14 h-14 rounded-2xl bg-[#1a1d24] shadow-[5px_5px_10px_#101217,-5px_-5px_10px_#242831] hover:shadow-[inset_3px_3px_6px_#101217,inset_-3px_-3px_6px_#242831] flex items-center justify-center text-blue-400 hover:text-blue-300 transition-all active:scale-95"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
              </button>
              <button
                onClick={() => mediaControl('next')}
                className="w-10 h-10 rounded-2xl bg-[#1a1d24] shadow-[4px_4px_8px_#101217,-4px_-4px_8px_#242831] hover:shadow-[inset_2px_2px_4px_#101217,inset_-2px_-2px_4px_#242831] flex items-center justify-center text-neutral-300 hover:text-white transition-all active:scale-95"
                title="Next track"
              >
                <SkipForward size={16} />
              </button>
            </div>

            <div className="flex items-center space-x-2.5 px-3 py-1.5 rounded-2xl bg-[#1a1d24] shadow-[inset_2px_2px_5px_#101217,inset_-2px_-2px_5px_#242831] text-xs">
              <Volume2 size={16} className="text-neutral-400" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => mediaControl('volume', Number(e.target.value))}
                className="w-20 h-1.5 bg-neutral-700 accent-blue-500 cursor-pointer"
              />
              <span className="font-mono text-neutral-300 w-7 text-right">{volume}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
