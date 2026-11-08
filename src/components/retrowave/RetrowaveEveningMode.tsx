import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, Disc, Radio } from 'lucide-react';

export const RetrowaveEveningMode: React.FC = () => {
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
    <div className="w-full h-full p-8 flex flex-col justify-center items-center bg-[#0c0317] font-mono text-cyan-200 select-none">
      <div className="w-full max-w-4xl border-2 border-pink-500 bg-[#16062b] p-8 shadow-[0_0_40px_rgba(255,42,133,0.3)] flex space-x-10 items-center">
        {/* Neon Framed Artwork */}
        <div className="relative w-72 h-72 border-2 border-cyan-400 p-1.5 shrink-0 bg-black shadow-[0_0_25px_rgba(0,240,255,0.3)] flex items-center justify-center overflow-hidden">
          {media.entityPicture ? (
            <img
              src={media.entityPicture}
              alt={media.title}
              className={`w-full h-full object-cover filter contrast-125 transition-transform duration-700 ${isPlaying ? 'scale-105' : 'scale-100'}`}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-pink-400">
              <Disc size={64} className="animate-spin-slow mb-2" />
              <span className="text-xs uppercase font-bold">{media.title}</span>
            </div>
          )}
          <div className="absolute top-2 left-2 px-2 py-0.5 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-[10px] uppercase shadow-sm">
            MIAMI//AUDIO
          </div>
        </div>

        {/* Track Info & Neon Controls */}
        <div className="flex-1 flex flex-col justify-between h-72 py-1">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                CHANNEL: {media.entityId ? media.entityId.replace('media_player.', '').toUpperCase() : 'STEREO'}
              </span>
              <span className="text-xs font-bold text-pink-400">
                {isPlaying ? '▶ SYNTHESIZING' : '⏸ PAUSED'}
              </span>
            </div>

            <h1 className="text-3xl font-black text-white tracking-wide truncate drop-shadow-[0_0_10px_rgba(255,42,133,0.6)]">
              {media.title}
            </h1>
            <p className="text-xl font-bold text-pink-400 mt-1 truncate">
              {media.artist}
            </p>
            {media.album && (
              <p className="text-xs text-fuchsia-300 mt-0.5 truncate">
                ALBUM: {media.album}
              </p>
            )}
          </div>

          {/* Equalizer Bars */}
          <div className="flex items-end space-x-1 h-5 my-2">
            {[4, 12, 8, 18, 20, 14, 16, 22, 12, 18, 24, 10, 16, 8, 14, 20, 16].map((h, i) => (
              <span
                key={i}
                className="flex-1 bg-gradient-to-t from-pink-600 via-fuchsia-500 to-cyan-400"
                style={{
                  height: isPlaying ? `${Math.max(4, (h + (i % 3) * 4))}px` : '4px',
                }}
              />
            ))}
          </div>

          {/* Neon Scrubber */}
          <div className="my-2">
            <div
              onClick={handleScrub}
              title="Click to seek"
              className="w-full h-3 bg-fuchsia-950/60 border border-fuchsia-500/50 cursor-pointer relative flex items-center p-0.5"
            >
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-cyan-400 shadow-[0_0_12px_#ff2a85] transition-[width] duration-300 ease-linear"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-xs text-pink-400 mt-1">
              <span>{formatSeconds(livePosition)}</span>
              <span>{formatSeconds(media.duration)}</span>
            </div>
          </div>

          {/* Playback Buttons & Volume */}
          <div className="flex items-center justify-between pt-2 border-t border-fuchsia-500/30">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => mediaControl('prev')}
                className="px-3 py-1.5 bg-fuchsia-950/80 border border-fuchsia-500/50 text-cyan-300 hover:text-white text-xs font-bold"
              >
                [&lt;&lt; PREV]
              </button>
              <button
                onClick={() => mediaControl('toggle')}
                className="px-6 py-1.5 bg-gradient-to-r from-pink-600 to-fuchsia-600 text-white font-black text-xs border border-pink-400 shadow-[0_0_15px_rgba(255,42,133,0.5)] flex items-center space-x-1.5"
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
              </button>
              <button
                onClick={() => mediaControl('next')}
                className="px-3 py-1.5 bg-fuchsia-950/80 border border-fuchsia-500/50 text-cyan-300 hover:text-white text-xs font-bold"
              >
                [NEXT &gt;&gt;]
              </button>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <Volume2 size={16} className="text-cyan-400" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => mediaControl('volume', Number(e.target.value))}
                className="w-20 h-1 bg-fuchsia-950 accent-pink-500 cursor-pointer"
              />
              <span className="text-cyan-300 w-8 text-right font-bold">{volume}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
