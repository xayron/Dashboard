import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, Disc } from 'lucide-react';

export const NeumorphicEveningMode: React.FC = () => {
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

  const cardClass = isLight
    ? 'bg-[#e2e8f0] shadow-[10px_10px_25px_#cbd5e1,-10px_-10px_25px_#ffffff] text-slate-900'
    : 'bg-[#1a1d24] shadow-[10px_10px_25px_#101217,-10px_-10px_25px_#242831] text-neutral-200';

  const insetClass = isLight
    ? 'bg-[#e2e8f0] shadow-[inset_4px_4px_10px_#cbd5e1,inset_-4px_-4px_10px_#ffffff]'
    : 'bg-[#1a1d24] shadow-[inset_4px_4px_10px_#101217,inset_-4px_-4px_10px_#242831]';

  const btnClass = isLight
    ? 'bg-[#e2e8f0] shadow-[4px_4px_8px_#cbd5e1,-4px_-4px_8px_#ffffff] text-slate-700 active:shadow-[inset_2px_2px_5px_#cbd5e1,inset_-2px_-2px_5px_#ffffff]'
    : 'bg-[#1a1d24] shadow-[4px_4px_8px_#101217,-4px_-4px_8px_#242831] text-neutral-300 active:shadow-[inset_2px_2px_5px_#101217,inset_-2px_-2px_5px_#242831]';

  return (
    <div className={`w-full h-full p-12 flex flex-col justify-center items-center bg-transparent select-none ${
      isLight ? 'text-slate-900' : 'text-neutral-200'
    }`}>
      <div className={`w-full max-w-4xl p-8 rounded-3xl ${cardClass} flex space-x-10 items-center`}>
        {/* Sculpted Artwork Frame */}
        <div className={`w-72 h-72 rounded-3xl p-3 ${insetClass} shrink-0 flex items-center justify-center overflow-hidden`}>
          {media.entityPicture ? (
            <img
              src={media.entityPicture}
              alt={media.title}
              className={`w-full h-full object-cover rounded-2xl transition-transform duration-700 ${isPlaying ? 'scale-105' : 'scale-100'}`}
            />
          ) : (
            <div className={`flex flex-col items-center justify-center ${isLight ? 'text-slate-400' : 'text-neutral-500'}`}>
              <Disc size={64} className="animate-spin-slow mb-2" style={{ color: 'var(--color-accent)' }} />
              <span className="text-xs font-bold uppercase">{media.title}</span>
            </div>
          )}
        </div>

        {/* Track Metadata & Tactile Controls */}
        <div className="flex-1 flex flex-col justify-between h-72 py-1">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[11px] font-mono tracking-wider uppercase px-3 py-1 rounded-full ${insetClass} ${
                isLight ? 'text-slate-600' : 'text-neutral-400'
              }`}>
                {media.entityId ? media.entityId.replace('media_player.', '') : 'Sound Dock'}
              </span>
              <span className="text-xs font-mono font-medium" style={{ color: 'var(--color-accent)' }}>
                {isPlaying ? 'Playing' : 'Paused'}
              </span>
            </div>

            <h1 className={`text-3xl font-bold tracking-tight line-clamp-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {media.title}
            </h1>
            <p className="text-lg font-medium mt-1 truncate" style={{ color: 'var(--color-accent)' }}>
              {media.artist}
            </p>
            {media.album && (
              <p className={`text-xs mt-0.5 truncate ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                {media.album}
              </p>
            )}
          </div>

          {/* Sculpted Progress Bar */}
          <div className="my-2">
            <div
              onClick={handleScrub}
              title="Click to seek"
              className={`w-full h-3 rounded-full cursor-pointer relative flex items-center p-0.5 ${insetClass}`}
            >
              <div
                className="h-full rounded-full transition-[width] duration-300 ease-linear shadow-sm"
                style={{ width: `${progressPercent}%`, backgroundColor: 'var(--color-accent)' }}
              />
            </div>
            <div className={`flex justify-between items-center text-xs font-mono mt-1 ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
              <span style={{ color: 'var(--color-accent)' }}>{formatSeconds(livePosition)}</span>
              <span>{formatSeconds(media.duration)}</span>
            </div>
          </div>

          {/* Tactile Buttons & Volume */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => mediaControl('prev')}
                className={`p-3 rounded-2xl ${btnClass}`}
              >
                <SkipBack size={18} />
              </button>

              <button
                onClick={() => mediaControl('toggle')}
                className="p-4 rounded-2xl transition-transform hover:scale-105 active:scale-95 shadow-md"
                style={{
                  backgroundColor: 'var(--color-accent)',
                  color: 'var(--color-accent-contrast, #ffffff)',
                }}
              >
                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
              </button>

              <button
                onClick={() => mediaControl('next')}
                className={`p-3 rounded-2xl ${btnClass}`}
              >
                <SkipForward size={18} />
              </button>
            </div>

            <div className={`flex items-center space-x-2 text-xs font-mono px-3 py-1.5 rounded-xl ${insetClass}`}>
              <Volume2 size={16} style={{ color: 'var(--color-accent)' }} />
              <span>{volume}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
