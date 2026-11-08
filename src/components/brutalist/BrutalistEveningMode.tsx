import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, Radio, Disc3 } from 'lucide-react';

export const BrutalistEveningMode: React.FC = () => {
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
    <div className="w-full h-full p-8 flex flex-col justify-center items-center bg-[#0d0d0d] text-white select-none">
      <div className="w-full max-w-4xl border-4 border-white bg-black p-8 shadow-[8px_8px_0px_#ffffff] flex space-x-10 items-center">
        {/* Album Artwork Frame */}
        <div className="relative w-72 h-72 border-4 border-white bg-neutral-900 shrink-0 shadow-[6px_6px_0px_#ffff00] flex items-center justify-center overflow-hidden">
          {media.entityPicture ? (
            <img
              src={media.entityPicture}
              alt={media.title}
              className={`w-full h-full object-cover transition-transform duration-500 ${isPlaying ? 'scale-105' : 'scale-100'}`}
            />
          ) : (
            <div className="flex flex-col items-center text-center p-4">
              <Disc3 size={64} className="text-yellow-400 mb-2 animate-spin-slow" />
              <span className="text-xs font-black uppercase tracking-wider">{media.title}</span>
            </div>
          )}
          <div className="absolute top-2 left-2 px-2 py-0.5 bg-black text-yellow-400 font-black text-[10px] uppercase border border-white">
            AUDIO//STREAM
          </div>
        </div>

        {/* Details & Controls */}
        <div className="flex-1 flex flex-col justify-between h-72 py-1">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 bg-cyan-400 text-black font-black text-xs uppercase tracking-wider border border-black shadow-[2px_2px_0px_#fff]">
                {media.entityId ? media.entityId.replace('media_player.', '').toUpperCase() : 'MAIN SPEAKER'}
              </span>
              <span className="text-xs font-mono font-bold text-neutral-400">
                STATUS: {isPlaying ? '▶ PLAYING' : '⏸ PAUSED'}
              </span>
            </div>

            <h1 className="text-4xl font-black text-white uppercase tracking-tight line-clamp-1">
              {media.title}
            </h1>
            <p className="text-xl font-bold text-yellow-400 mt-1 uppercase tracking-wide truncate">
              {media.artist}
            </p>
            {media.album && (
              <p className="text-xs font-bold text-neutral-400 uppercase mt-0.5 truncate">
                ALBUM: {media.album}
              </p>
            )}
          </div>

          {/* Scrub Bar */}
          <div className="my-2">
            <div
              onClick={handleScrub}
              title="Click to seek"
              className="w-full h-5 bg-neutral-900 border-2 border-white cursor-pointer relative flex items-center p-0.5"
            >
              <div
                className="h-full bg-yellow-400 transition-[width] duration-300 ease-linear"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-xs font-mono font-bold text-neutral-300 mt-1.5">
              <span className="text-yellow-400">{formatSeconds(livePosition)}</span>
              <span>{formatSeconds(media.duration)}</span>
            </div>
          </div>

          {/* Buttons & Volume */}
          <div className="flex items-center justify-between pt-2 border-t-2 border-white/30">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => mediaControl('prev')}
                className="px-4 py-2 bg-white text-black font-black text-xs uppercase border-2 border-black shadow-[3px_3px_0px_#fff] hover:translate-x-0.5 active:translate-y-0.5"
              >
                &lt;&lt; PREV
              </button>
              <button
                onClick={() => mediaControl('toggle')}
                className="px-6 py-2 bg-yellow-400 text-black font-black text-sm uppercase border-2 border-black shadow-[4px_4px_0px_#fff] hover:translate-x-0.5 active:translate-y-0.5 flex items-center space-x-1.5"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
              </button>
              <button
                onClick={() => mediaControl('next')}
                className="px-4 py-2 bg-white text-black font-black text-xs uppercase border-2 border-black shadow-[3px_3px_0px_#fff] hover:translate-x-0.5 active:translate-y-0.5"
              >
                NEXT &gt;&gt;
              </button>
            </div>

            <div className="flex items-center space-x-2 bg-neutral-900 px-3 py-1.5 border border-white">
              <Volume2 size={16} className="text-yellow-400" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => mediaControl('volume', Number(e.target.value))}
                className="w-20 h-2 bg-neutral-700 accent-yellow-400 cursor-pointer"
              />
              <span className="text-xs font-mono font-bold w-8 text-right">{volume}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
