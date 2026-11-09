import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, Disc } from 'lucide-react';

export const EinkEveningMode: React.FC = () => {
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
    <div className={`w-full h-full p-12 flex flex-col justify-center items-center bg-transparent font-serif select-none ${
      isLight ? 'text-[#1c1917]' : 'text-[#f5f2eb]'
    }`}>
      <div className={`w-full max-w-3xl border-4 p-8 flex space-x-10 items-center ${
        isLight
          ? 'border-stone-800 bg-[#ede8df] shadow-[6px_6px_0px_#1c1917]'
          : 'border-stone-500 bg-[#292524] shadow-[6px_6px_0px_#000]'
      }`}>
        {/* Album Artwork Frame */}
        <div className={`relative w-64 h-64 border-2 p-1.5 shrink-0 flex items-center justify-center overflow-hidden ${
          isLight
            ? 'border-stone-800 bg-white shadow-[3px_3px_0px_#1c1917]'
            : 'border-stone-500 bg-stone-900 shadow-[3px_3px_0px_#000]'
        }`}>
          {media.entityPicture ? (
            <img
              src={media.entityPicture}
              alt={media.title}
              className="w-full h-full object-cover filter grayscale contrast-125 hover:grayscale-0 transition-all"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <Disc size={56} className="mb-2" style={{ color: 'var(--color-accent)' }} />
              <span className="text-xs uppercase font-bold">{media.title}</span>
            </div>
          )}
          <div className={`absolute top-2 left-2 px-1.5 py-0.5 text-[9px] font-mono uppercase ${
            isLight ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-900'
          }`}>
            GRAMOPHONE
          </div>
        </div>

        {/* Metadata & Editorial Controls */}
        <div className="flex-1 flex flex-col justify-between h-64 py-1">
          <div>
            <span className={`text-[11px] font-mono uppercase block mb-1 ${
              isLight ? 'text-stone-600' : 'text-stone-400'
            }`}>
              Sound Chamber // {media.entityId ? media.entityId.replace('media_player.', '').toUpperCase() : 'SALON AUDIO'}
            </span>
            <h1 className="text-3xl font-bold tracking-tight line-clamp-1">
              {media.title}
            </h1>
            <p className="text-base italic mt-1 truncate" style={{ color: 'var(--color-accent)' }}>
              {media.artist}
            </p>
            {media.album && (
              <p className={`text-xs mt-0.5 truncate ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
                Collection: {media.album}
              </p>
            )}
          </div>

          {/* Scrub Track */}
          <div className="my-2">
            <div
              onClick={handleScrub}
              title="Click to seek"
              className={`w-full h-4 border-2 cursor-pointer relative flex items-center p-0.5 ${
                isLight ? 'bg-white border-stone-800' : 'bg-stone-900 border-stone-500'
              }`}
            >
              <div
                className="h-full transition-[width] duration-300 ease-linear"
                style={{ width: `${progressPercent}%`, backgroundColor: 'var(--color-accent)' }}
              />
            </div>
            <div className={`flex justify-between items-center text-xs font-mono mt-1 ${
              isLight ? 'text-stone-600' : 'text-stone-400'
            }`}>
              <span style={{ color: 'var(--color-accent)' }}>{formatSeconds(livePosition)}</span>
              <span>{formatSeconds(media.duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className={`flex items-center justify-between pt-2 border-t-2 ${
            isLight ? 'border-stone-800' : 'border-stone-500'
          }`}>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => mediaControl('prev')}
                className={`px-3 py-1 text-xs uppercase font-bold border ${
                  isLight
                    ? 'border-stone-800 bg-[#ede8df] hover:bg-stone-300'
                    : 'border-stone-500 bg-[#292524] hover:bg-stone-700'
                }`}
              >
                Prev
              </button>

              <button
                onClick={() => mediaControl('toggle')}
                className={`px-5 py-1 text-xs uppercase font-bold border-2 ${
                  isLight
                    ? 'border-stone-800 bg-stone-900 text-white'
                    : 'border-stone-200 bg-stone-100 text-stone-900'
                }`}
              >
                {isPlaying ? 'Halt ||' : 'Play ▶'}
              </button>

              <button
                onClick={() => mediaControl('next')}
                className={`px-3 py-1 text-xs uppercase font-bold border ${
                  isLight
                    ? 'border-stone-800 bg-[#ede8df] hover:bg-stone-300'
                    : 'border-stone-500 bg-[#292524] hover:bg-stone-700'
                }`}
              >
                Next
              </button>
            </div>

            <div className={`flex items-center space-x-2 text-xs font-mono ${
              isLight ? 'text-stone-600' : 'text-stone-400'
            }`}>
              <Volume2 size={16} />
              <span>{volume}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
