import React from 'react';
import { Music, Play, Pause, Volume2, SkipForward } from 'lucide-react';
import { useDashboard } from '../../state/DashboardContext';

interface AudioBannerProps {
  className?: string;
  onClick?: () => void;
}

export const AudioBanner: React.FC<AudioBannerProps> = ({ className = '', onClick }) => {
  const { media } = useDashboard();

  if (media.state === 'off' || media.state === 'idle') return null;

  const isPlaying = media.state === 'playing';

  return (
    <div
      onClick={onClick}
      className={`glass-panel rounded-2xl p-3 flex items-center space-x-3.5 shadow-2xl border border-white/15 max-w-sm cursor-pointer hover:border-white/30 transition-all ${className}`}
    >
      {/* Album Art with pulse */}
      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-md bg-gray-900">
        {media.entityPicture ? (
          <img src={media.entityPicture} alt={media.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-indigo-950/80 text-indigo-400">
            <Music size={20} />
          </div>
        )}
        {isPlaying && (
          <div className="absolute inset-0 bg-blue-500/20 ring-1 ring-inset ring-white/20 rounded-xl pointer-events-none" />
        )}
      </div>

      {/* Track Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-1.5">
          <div className="flex space-x-0.5 items-end h-3 w-3 shrink-0">
            <span className={`w-0.5 bg-green-400 rounded-full ${isPlaying ? 'animate-pulse h-3' : 'h-1'}`} />
            <span className={`w-0.5 bg-green-400 rounded-full ${isPlaying ? 'animate-bounce h-2' : 'h-2'}`} />
            <span className={`w-0.5 bg-green-400 rounded-full ${isPlaying ? 'animate-pulse h-3' : 'h-1.5'}`} />
          </div>
          <p className="text-xs font-semibold text-white truncate">{media.title}</p>
        </div>
        <p className="text-[11px] text-gray-400 truncate mt-0.5">{media.artist}</p>
      </div>

      {/* Mini Controls */}
      <div className="flex items-center space-x-2 text-gray-300 pr-1">
        <div className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white">
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </div>
      </div>
    </div>
  );
};
