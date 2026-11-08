import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, Disc } from 'lucide-react';

export const EinkEveningMode: React.FC = () => {
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
    <div className="w-full h-full p-12 flex flex-col justify-center items-center bg-[#f5f2eb] text-[#1c1917] font-serif select-none">
      <div className="w-full max-w-3xl border-4 border-stone-800 bg-[#ede8df] p-8 shadow-[6px_6px_0px_#1c1917] flex space-x-10 items-center">
        {/* Album Artwork Frame */}
        <div className="relative w-64 h-64 border-2 border-stone-800 p-1.5 shrink-0 bg-white shadow-[3px_3px_0px_#1c1917] flex items-center justify-center overflow-hidden">
          {media.entityPicture ? (
            <img
              src={media.entityPicture}
              alt={media.title}
              className="w-full h-full object-cover filter grayscale contrast-125 hover:grayscale-0 transition-all"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <Disc size={56} className="text-stone-700 mb-2" />
              <span className="text-xs uppercase font-bold">{media.title}</span>
            </div>
          )}
          <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-stone-800 text-white text-[9px] font-mono uppercase">
            GRAMOPHONE
          </div>
        </div>

        {/* Metadata & Editorial Controls */}
        <div className="flex-1 flex flex-col justify-between h-64 py-1">
          <div>
            <div className="flex items-center justify-between mb-1.5 text-xs text-stone-600 font-mono">
              <span className="uppercase font-bold">
                AUDITORIUM: {media.entityId ? media.entityId.replace('media_player.', '').toUpperCase() : 'PARLOUR'}
              </span>
              <span>{isPlaying ? '▶ RUNNING' : '⏸ SILENCE'}</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-stone-900 line-clamp-1">
              {media.title}
            </h1>
            <p className="text-lg italic text-stone-700 mt-0.5 truncate">
              {media.artist}
            </p>
            {media.album && (
              <p className="text-xs text-stone-500 font-sans mt-0.5 truncate uppercase">
                RECORDED WORK: {media.album}
              </p>
            )}
          </div>

          {/* Progress Bar */}
          <div className="my-2">
            <div
              onClick={handleScrub}
              title="Click to seek"
              className="w-full h-3 bg-stone-300 border border-stone-800 cursor-pointer relative flex items-center p-0.5"
            >
              <div
                className="h-full bg-stone-800 transition-[width] duration-300 ease-linear"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-xs font-mono text-stone-600 mt-1">
              <span>{formatSeconds(livePosition)}</span>
              <span>{formatSeconds(media.duration)}</span>
            </div>
          </div>

          {/* Controls & Volume */}
          <div className="flex items-center justify-between pt-2 border-t border-stone-400">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => mediaControl('prev')}
                className="px-3 py-1.5 bg-white border border-stone-800 text-xs font-bold shadow-[2px_2px_0px_#1c1917] hover:bg-stone-100"
              >
                &lt;&lt; PREV
              </button>
              <button
                onClick={() => mediaControl('toggle')}
                className="px-5 py-1.5 bg-stone-800 text-white border border-stone-900 text-xs font-bold shadow-[2px_2px_0px_#444] hover:bg-stone-900 flex items-center space-x-1"
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
              </button>
              <button
                onClick={() => mediaControl('next')}
                className="px-3 py-1.5 bg-white border border-stone-800 text-xs font-bold shadow-[2px_2px_0px_#1c1917] hover:bg-stone-100"
              >
                NEXT &gt;&gt;
              </button>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <Volume2 size={16} className="text-stone-800" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => mediaControl('volume', Number(e.target.value))}
                className="w-20 h-1.5 bg-stone-400 accent-stone-800 cursor-pointer"
              />
              <span className="font-mono text-stone-800 font-bold">{volume}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
