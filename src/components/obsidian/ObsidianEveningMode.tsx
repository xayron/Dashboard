import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, Disc, Music, Activity, Radio } from 'lucide-react';

export const ObsidianEveningMode: React.FC = () => {
  const { media, livePosition, mediaControl } = useDashboard();

  const isPlaying = media.state === 'playing';
  const volume = media.volume ?? 70;

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
    <div className="w-full h-full p-8 flex flex-col justify-center items-center bg-[#050507] text-[#eef0f3] select-none font-sans relative">
      <div className="w-full max-w-4xl bg-[#0f0f15] border border-white/[0.14] p-8 flex space-x-10 items-center relative overflow-hidden shadow-2xl">
        {/* Top Mode Label */}
        <div className="absolute top-3.5 right-6 flex items-center space-x-2 font-mono text-[10px] text-[#9a9da6]">
          <span className="w-1.5 h-1.5 bg-[#5fd49b] rounded-full animate-pulse" />
          <span>NOW PLAYING // MEDIA CENTER</span>
        </div>

        {/* Media Artwork / Cover Facet Plate */}
        <div className="relative w-72 h-72 bg-[#08080c] border border-white/[0.12] p-2 shrink-0 flex flex-col justify-between">
          <div className="relative flex-1 overflow-hidden flex items-center justify-center bg-black border border-white/[0.08]">
            {media.entityPicture ? (
              <img
                src={media.entityPicture}
                alt={media.title}
                className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-105' : 'scale-100'}`}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-4 text-center">
                <Disc size={64} className={`text-[#9a9da6] mb-2 ${isPlaying ? 'animate-spin-slow' : ''}`} />
                <span className="text-xs font-mono text-[#9a9da6] uppercase tracking-wider">{media.title}</span>
              </div>
            )}

            {/* Status Chip */}
            <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/80 border border-white/[0.12] text-[9px] font-mono text-[#5fd49b] flex items-center space-x-1">
              <Music size={10} />
              <span>STEREO</span>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono text-[#9a9da6]">
            <span>AUDIO STREAM</span>
            <span>HIGH FIDELITY</span>
          </div>
        </div>

        {/* Track Metadata & Controls */}
        <div className="flex-1 flex flex-col justify-between h-72 py-1">
          <div>
            <div className="flex items-center space-x-2 mb-2 font-mono text-[10px]">
              <span className={`px-2 py-0.5 border ${
                isPlaying ? 'bg-[#5fd49b]/10 text-[#5fd49b] border-[#5fd49b]/30' : 'bg-white/5 text-[#9a9da6] border-white/10'
              }`}>
                {isPlaying ? 'PLAYING' : 'PAUSED'}
              </span>
              <span className="text-[#9a9da6]">HOME ASSISTANT MEDIA</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#eef0f3] truncate">
              {media.title || 'No Media Playing'}
            </h1>
            <p className="text-base text-[#9a9da6] truncate mt-1">
              {media.artist || 'Waiting for audio playback...'}
            </p>
            {media.album && (
              <p className="text-xs font-mono text-[#54565e] truncate mt-1">
                ALBUM: {media.album}
              </p>
            )}
          </div>

          {/* Scrubber Progress Bar */}
          <div className="my-2">
            <div
              onClick={handleScrub}
              className="group relative w-full h-3 bg-[#08080c] border border-white/[0.12] cursor-pointer p-0.5"
            >
              <div
                className="h-full bg-[#5fd49b] transition-all duration-100 ease-linear"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-xs font-mono text-[#9a9da6] mt-1.5">
              <span>{formatSeconds(livePosition)}</span>
              <span className="text-[10px] text-[#54565e]">LIVE POSITION</span>
              <span>{formatSeconds(duration)}</span>
            </div>
          </div>

          {/* Playback & Volume Telemetry */}
          <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => mediaControl('prev')}
                className="p-2.5 bg-[#08080c] border border-white/[0.12] hover:border-white/[0.3] text-[#eef0f3] transition-colors"
                title="Previous Track"
              >
                <SkipBack size={16} />
              </button>

              <button
                onClick={() => mediaControl('toggle')}
                className="p-3 bg-[#5fd49b] text-[#050507] font-bold hover:bg-[#5fd49b]/90 transition-colors"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={18} fill="#050507" /> : <Play size={18} fill="#050507" />}
              </button>

              <button
                onClick={() => mediaControl('next')}
                className="p-2.5 bg-[#08080c] border border-white/[0.12] hover:border-white/[0.3] text-[#eef0f3] transition-colors"
                title="Next Track"
              >
                <SkipForward size={16} />
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center space-x-2 text-xs font-mono text-[#9a9da6]">
              <Volume2 size={15} />
              <div className="w-24 h-2 bg-[#08080c] border border-white/[0.12] p-0.5">
                <div className="h-full bg-[#eef0f3]" style={{ width: `${volume}%` }} />
              </div>
              <span className="w-8 text-right font-bold text-[#eef0f3]">{volume}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
