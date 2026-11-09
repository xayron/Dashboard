import React, { useState, useEffect } from 'react';
import { Music, Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { useDashboard } from '../../state/DashboardContext';

interface AudioBannerProps {
  className?: string;
  onClick?: () => void;
  /** When true, only show the compact pill (no progress bar / skip buttons) */
  compact?: boolean;
}

export const AudioBanner: React.FC<AudioBannerProps> = ({ className = '', onClick, compact = false }) => {
  const { media, livePosition, mediaControl } = useDashboard();
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [media.entityPicture]);

  if (media.state === 'off' || media.state === 'idle') return null;

  const isPlaying = media.state === 'playing';
  const duration = media.duration || 1;
  const progressPct = Math.min((livePosition / duration) * 100, 100);

  const fmt = (s: number) => {
    const sec = Math.round(s);
    return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
  };

  if (compact) {
    // Minimal pill used in race mode / portrait layout
    return (
      <div
        onClick={onClick}
        className={`glass-panel rounded-2xl p-3 flex items-center space-x-3 shadow-2xl border border-white/15 max-w-xs cursor-pointer hover:border-white/30 transition-all ${className}`}
      >
        <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 shadow-md bg-gray-900 flex items-center justify-center">
          {media.entityPicture && !imageError ? (
            <img
              src={media.entityPicture}
              alt={media.title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center bg-black/60"
              style={{ color: 'var(--color-accent)' }}
            >
              <Music size={16} />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-white truncate">{media.title}</p>
          <p className="text-[11px] text-gray-400 truncate">{media.artist}</p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); mediaControl('toggle'); }}
          className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all"
          style={isPlaying ? { color: 'var(--color-accent)', backgroundColor: 'var(--theme-accent-soft)' } : { color: '#ffffff' }}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={13} /> : <Play size={13} />}
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`glass-panel rounded-2xl p-3.5 flex flex-col shadow-2xl border border-white/15 max-w-sm cursor-pointer hover:border-white/30 transition-all ${className}`}
    >
      {/* Top row: album art + track info + play/pause */}
      <div className="flex items-center space-x-3.5">
        {/* Album art */}
        <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-md bg-gray-900 flex items-center justify-center">
          {media.entityPicture && !imageError ? (
            <img
              src={media.entityPicture}
              alt={media.title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center bg-black/60"
              style={{ color: 'var(--color-accent)' }}
            >
              <Music size={20} />
            </div>
          )}
          {isPlaying && (
            <div
              className="absolute inset-0 ring-1 ring-inset rounded-xl pointer-events-none"
              style={{ backgroundColor: 'var(--theme-accent-soft)', borderColor: 'var(--color-accent)' }}
            />
          )}
        </div>

        {/* Track info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1.5">
            <div className="flex space-x-0.5 items-end h-3 w-3 shrink-0">
              <span
                className={`w-0.5 rounded-full ${isPlaying ? 'animate-pulse h-3' : 'h-1'}`}
                style={{ backgroundColor: 'var(--color-accent)' }}
              />
              <span
                className={`w-0.5 rounded-full ${isPlaying ? 'animate-bounce h-2' : 'h-2'}`}
                style={{ backgroundColor: 'var(--color-accent)' }}
              />
              <span
                className={`w-0.5 rounded-full ${isPlaying ? 'animate-pulse h-3' : 'h-1.5'}`}
                style={{ backgroundColor: 'var(--color-accent)' }}
              />
            </div>
            <p className="text-xs font-semibold text-white truncate">{media.title}</p>
          </div>
          <p className="text-[11px] text-gray-400 truncate mt-0.5">{media.artist}</p>
        </div>

        {/* Controls */}
        <div
          className="flex items-center space-x-1 text-gray-300 pr-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => mediaControl('prev')}
            className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all"
            title="Previous track"
          >
            <SkipBack size={13} />
          </button>
          <button
            onClick={() => mediaControl('toggle')}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all"
            style={isPlaying ? { color: 'var(--color-accent)', backgroundColor: 'var(--theme-accent-soft)' } : { color: '#ffffff' }}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button
            onClick={() => mediaControl('next')}
            className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all"
            title="Next track"
          >
            <SkipForward size={13} />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {duration > 0 && (
        <div className="mt-2.5 flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
          <span className="text-[10px] text-gray-500 w-7 text-right tabular-nums">{fmt(livePosition)}</span>
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
              mediaControl('seek', ratio * duration);
            }}
            title="Click to seek"
            className="flex-1 relative h-2 bg-white/10 rounded-full overflow-hidden cursor-pointer"
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-300 ease-linear"
              style={{ width: `${progressPct}%`, backgroundColor: 'var(--color-accent)' }}
            />
          </div>
          <span className="text-[10px] text-gray-500 w-7 tabular-nums">{fmt(duration)}</span>
        </div>
      )}
    </div>
  );
};
