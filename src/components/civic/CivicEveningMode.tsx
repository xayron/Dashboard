import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, Disc, Music, CheckCircle2 } from 'lucide-react';

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
    <div className="w-full h-full p-8 flex flex-col justify-center items-center bg-[#f1f5f9] text-[#0f172a] select-none font-sans">
      <div className="w-full max-w-4xl bg-white border border-slate-300 rounded-2xl p-8 flex space-x-10 items-center relative overflow-hidden shadow-lg">
        {/* Tricolor Header Accent */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#f97316] via-white to-[#16a34a]" />

        {/* Top Mode Label */}
        <div className="absolute top-3.5 right-6 flex items-center space-x-2 font-mono text-[11px] text-slate-500 font-bold">
          <Music size={14} className="text-[#f97316]" />
          <span>NOW PLAYING // MEDIA CENTER</span>
        </div>

        {/* Media Artwork / Cover Plate */}
        <div className="relative w-72 h-72 bg-slate-100 border border-slate-300 rounded-xl p-2.5 shrink-0 flex flex-col justify-between shadow-sm">
          <div className="relative flex-1 overflow-hidden rounded-lg flex items-center justify-center bg-slate-900 border border-slate-200">
            {media.entityPicture ? (
              <img
                src={media.entityPicture}
                alt={media.title}
                className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-105' : 'scale-100'}`}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-4 text-center">
                <Disc size={64} className={`text-slate-400 mb-2 ${isPlaying ? 'animate-spin-slow' : ''}`} />
                <span className="text-xs font-mono text-slate-300 uppercase tracking-wider">{media.title}</span>
              </div>
            )}

            {/* Overlaid Verified Tag */}
            <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-white/95 border border-slate-300 rounded text-[9px] font-mono text-emerald-800 font-bold flex items-center space-x-1 shadow-sm">
              <CheckCircle2 size={11} className="text-emerald-600" />
              <span>STEREO</span>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono text-slate-600 font-semibold">
            <span>HOME ASSISTANT</span>
            <span className="text-[#f97316] font-bold">HIGH FIDELITY</span>
          </div>
        </div>

        {/* Track Metadata & Controls */}
        <div className="flex-1 flex flex-col justify-between h-72 py-1">
          <div>
            <div className="flex items-center space-x-2 mb-2 font-mono text-[10px]">
              <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                isPlaying
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                {isPlaying ? 'PLAYING' : 'PAUSED'}
              </span>
              <span className="text-slate-500 font-semibold">AUDIO OUTPUT</span>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-slate-950 truncate">
              {media.title || 'No Media Playing'}
            </h1>
            <p className="text-base text-slate-600 font-medium truncate mt-1">
              {media.artist || 'Waiting for audio playback...'}
            </p>
            {media.album && (
              <p className="text-xs font-mono text-slate-400 truncate mt-1">
                ALBUM: {media.album}
              </p>
            )}
          </div>

          {/* Scrubber Progress Bar */}
          <div className="my-2">
            <div
              onClick={handleScrub}
              className="group relative w-full h-3 bg-slate-100 border border-slate-300 rounded-full cursor-pointer p-0.5"
            >
              <div
                className="h-full bg-[#f97316] rounded-full transition-all duration-100 ease-linear shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-xs font-mono text-slate-500 font-semibold mt-1.5">
              <span>{formatSeconds(livePosition)}</span>
              <span className="text-[10px] text-slate-400 font-bold">LIVE POSITION</span>
              <span>{formatSeconds(duration)}</span>
            </div>
          </div>

          {/* Playback Controls & Volume */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => mediaControl('prev')}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-slate-700 transition-colors shadow-sm"
                title="Previous Track"
              >
                <SkipBack size={16} />
              </button>

              <button
                onClick={() => mediaControl('toggle')}
                className="p-3 bg-[#f97316] hover:bg-[#ea580c] text-white rounded-xl font-bold transition-colors shadow-md"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={18} fill="white" /> : <Play size={18} fill="white" />}
              </button>

              <button
                onClick={() => mediaControl('next')}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-slate-700 transition-colors shadow-sm"
                title="Next Track"
              >
                <SkipForward size={16} />
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-600 font-bold">
              <Volume2 size={16} className="text-slate-500" />
              <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-slate-800 rounded-full" style={{ width: `${volume}%` }} />
              </div>
              <span className="w-8 text-right font-black text-slate-900">{volume}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
