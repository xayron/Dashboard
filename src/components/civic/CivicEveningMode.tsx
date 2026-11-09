import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, Disc, Radio, FileCheck, CheckCircle2 } from 'lucide-react';

export const CivicEveningMode: React.FC = () => {
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
    <div className="w-full h-full p-8 flex flex-col justify-center items-center bg-[#070b14] text-[#f8fafc] select-none font-sans">
      <div className="w-full max-w-4xl bg-[#0f172a] border border-slate-700/60 p-8 flex space-x-10 items-center relative overflow-hidden shadow-2xl">
        {/* Civic Transparency Badge */}
        <div className="absolute top-3 right-4 flex items-center space-x-2 font-mono text-[10px] text-slate-400">
          <FileCheck size={12} className="text-emerald-400" />
          <span>BROADCAST ARCHIVE // PUBLIC DOMAIN</span>
        </div>

        {/* Media Artwork / Cover Plate */}
        <div className="relative w-72 h-72 bg-[#1e293b]/70 border border-slate-700/60 p-2 shrink-0 flex flex-col justify-between">
          <div className="relative flex-1 overflow-hidden flex items-center justify-center bg-black border border-slate-800">
            {media.entityPicture ? (
              <img
                src={media.entityPicture}
                alt={media.title}
                className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-105' : 'scale-100'}`}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-4 text-center">
                <Disc size={64} className={`text-slate-500 mb-2 ${isPlaying ? 'animate-spin-slow' : ''}`} />
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">{media.title}</span>
              </div>
            )}

            {/* Overlaid Verified Tag */}
            <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/80 border border-emerald-500/40 text-[9px] font-mono text-emerald-300 flex items-center space-x-1">
              <CheckCircle2 size={10} />
              <span>OFFICIAL FEED</span>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>MEDIA STREAM</span>
            <span className="text-amber-400">256 KBPS AAC</span>
          </div>
        </div>

        {/* Track Metadata & Civic Controls */}
        <div className="flex-1 flex flex-col justify-between h-72 py-1">
          <div>
            <div className="flex items-center space-x-2 mb-2 font-mono text-[10px]">
              <span className={`px-2 py-0.5 border ${
                isPlaying
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-950/40 text-amber-300 border-amber-500/40'
              }`}>
                {isPlaying ? 'TRANSMITTING' : 'PAUSED'}
              </span>
              <span className="text-slate-400">HA AUDIO ENTITY</span>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-white truncate">
              {media.title || 'No Media Active'}
            </h1>
            <p className="text-base text-slate-300 truncate mt-1">
              {media.artist || 'Waiting for media stream...'}
            </p>
            {media.album && (
              <p className="text-xs font-mono text-slate-500 truncate mt-1">
                ALBUM: {media.album}
              </p>
            )}
          </div>

          {/* Scrubber Progress Bar */}
          <div className="my-2">
            <div
              onClick={handleScrub}
              className="group relative w-full h-3 bg-[#1e293b] border border-slate-700/60 cursor-pointer p-0.5"
            >
              <div
                className="h-full bg-amber-500 transition-all duration-100 ease-linear"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-xs font-mono text-slate-400 mt-1.5">
              <span>{formatSeconds(livePosition)}</span>
              <span className="text-[10px] text-slate-500 font-mono">BROADCAST LOG #{Math.floor(livePosition * 7)}</span>
              <span>{formatSeconds(duration)}</span>
            </div>
          </div>

          {/* Playback Controls & Volume */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => mediaControl('prev')}
                className="p-2.5 bg-[#1e293b] border border-slate-700/60 hover:border-slate-500 text-slate-200 transition-colors"
                title="Previous Track"
              >
                <SkipBack size={16} />
              </button>

              <button
                onClick={() => mediaControl('toggle')}
                className="p-3 bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={18} fill="#020617" /> : <Play size={18} fill="#020617" />}
              </button>

              <button
                onClick={() => mediaControl('next')}
                className="p-2.5 bg-[#1e293b] border border-slate-700/60 hover:border-slate-500 text-slate-200 transition-colors"
                title="Next Track"
              >
                <SkipForward size={16} />
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
              <Volume2 size={15} />
              <div className="w-24 h-2 bg-[#1e293b] border border-slate-700/60 p-0.5">
                <div className="h-full bg-slate-200" style={{ width: `${volume}%` }} />
              </div>
              <span className="w-8 text-right font-bold text-slate-200">{volume}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
