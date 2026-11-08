import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, Disc, Crosshair, Radio } from 'lucide-react';

export const HudEveningMode: React.FC = () => {
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
    <div className="w-full h-full p-8 flex flex-col justify-center items-center bg-[#030712] font-mono text-cyan-200 select-none">
      <div className="relative w-full max-w-4xl border border-cyan-500/50 bg-[#04091a]/95 p-8 shadow-[0_0_35px_rgba(0,240,255,0.12)] flex space-x-10 items-center">
        {/* 4 Corner HUD Reticles */}
        <span className="absolute -top-[2px] -left-[2px] w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
        <span className="absolute -top-[2px] -right-[2px] w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
        <span className="absolute -bottom-[2px] -left-[2px] w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
        <span className="absolute -bottom-[2px] -right-[2px] w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

        {/* Album Artwork Frame with Tactical Reticle */}
        <div className="relative w-72 h-72 border border-cyan-500/60 p-2 shrink-0 bg-black flex items-center justify-center overflow-hidden">
          <div className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-cyan-950/90 border border-cyan-500/60 text-cyan-300 text-[10px]">
            SONIC://FEED
          </div>
          {media.entityPicture ? (
            <img
              src={media.entityPicture}
              alt={media.title}
              className={`w-full h-full object-cover filter contrast-125 transition-transform duration-700 ${isPlaying ? 'scale-105' : 'scale-100'}`}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-cyan-500 text-center p-4">
              <Disc size={64} className="animate-spin-slow mb-2" />
              <span className="text-xs uppercase">{media.title}</span>
            </div>
          )}
          {/* Cyan Vector Scanlines */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent pointer-events-none" />
        </div>

        {/* Details & Telemetry Controls */}
        <div className="flex-1 flex flex-col justify-between h-72 py-1">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 bg-cyan-950 border border-cyan-500/50 text-cyan-400 font-bold text-xs">
                NODE: {media.entityId ? media.entityId.replace('media_player.', '').toUpperCase() : 'TRANSMITTER'}
              </span>
              <span className="text-xs text-amber-400 font-bold">
                SIGNAL: {isPlaying ? '● LIVE STREAMING' : '○ STANDBY'}
              </span>
            </div>

            <h1 className="text-3xl font-black text-white tracking-wide truncate">
              {media.title}
            </h1>
            <p className="text-lg text-cyan-300 font-bold mt-1 truncate">
              &gt; {media.artist}
            </p>
            {media.album && (
              <p className="text-xs text-cyan-600 mt-0.5 truncate">
                ARCHIVE: {media.album}
              </p>
            )}
          </div>

          {/* Equalizer Spectrum */}
          <div className="flex items-end space-x-1 h-5 my-2">
            {[4, 12, 8, 16, 20, 10, 18, 14, 8, 16, 20, 12, 6, 14, 18, 10, 16].map((lvl, idx) => (
              <span
                key={idx}
                className="flex-1 bg-cyan-400 transition-all duration-200"
                style={{
                  height: isPlaying ? `${Math.max(3, (lvl + (idx % 3) * 3))}px` : '3px',
                  opacity: 0.8 + (idx % 2) * 0.2,
                }}
              />
            ))}
          </div>

          {/* Scrubber */}
          <div className="my-2">
            <div
              onClick={handleScrub}
              title="Seek Position"
              className="w-full h-3 bg-cyan-950/60 border border-cyan-500/40 cursor-pointer relative flex items-center p-0.5"
            >
              <div
                className="h-full bg-cyan-400 shadow-[0_0_10px_#00f0ff] transition-[width] duration-300 ease-linear"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-xs text-cyan-400 mt-1">
              <span>{formatSeconds(livePosition)}</span>
              <span>{formatSeconds(media.duration)}</span>
            </div>
          </div>

          {/* Controls & Volume */}
          <div className="flex items-center justify-between pt-2 border-t border-cyan-500/30">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => mediaControl('prev')}
                className="px-3 py-1.5 bg-cyan-950/60 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-900 text-xs"
              >
                [&lt;&lt; PREV]
              </button>
              <button
                onClick={() => mediaControl('toggle')}
                className="px-5 py-1.5 bg-cyan-500 text-black font-black border border-cyan-400 hover:bg-cyan-400 text-xs shadow-[0_0_15px_rgba(0,240,255,0.4)] flex items-center space-x-1.5"
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
              </button>
              <button
                onClick={() => mediaControl('next')}
                className="px-3 py-1.5 bg-cyan-950/60 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-900 text-xs"
              >
                [NEXT &gt;&gt;]
              </button>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <Volume2 size={15} className="text-cyan-400" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => mediaControl('volume', Number(e.target.value))}
                className="w-20 h-1 bg-cyan-950 accent-cyan-400 cursor-pointer"
              />
              <span className="text-cyan-300 w-8 text-right">{volume}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
