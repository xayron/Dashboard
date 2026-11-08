import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, Disc, Radio, CassetteTape } from 'lucide-react';

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
    <div className="relative w-full h-full p-8 flex flex-col justify-center items-center bg-gradient-to-b from-[#150424] via-[#23073b] to-[#36094d] text-pink-100 select-none">
      {/* 80s Perspective Floor Lines */}
      <div
        className="absolute inset-x-0 bottom-0 h-64 pointer-events-none opacity-20 z-0"
        style={{
          backgroundImage: 'linear-gradient(to right, #ff007f 1px, transparent 1px), linear-gradient(to bottom, #ff007f 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          transform: 'perspective(300px) rotateX(60deg)',
          transformOrigin: 'bottom center',
        }}
      />

      <div className="relative z-10 w-full max-w-4xl rounded-3xl border-2 border-pink-500 bg-[#1e0736]/95 p-8 shadow-[0_0_40px_rgba(255,0,127,0.35)] flex space-x-10 items-center">
        {/* Cassette Tape / Album Cover Frame */}
        <div className="relative w-72 h-72 rounded-2xl border-2 border-pink-500 p-2 shrink-0 bg-black shadow-[0_0_25px_rgba(255,0,127,0.4)] flex flex-col justify-between overflow-hidden">
          {/* Neon Cassette Header Bar */}
          <div className="flex items-center justify-between px-2 py-1 bg-gradient-to-r from-pink-600 to-amber-500 text-white rounded-t-lg text-[10px] font-black uppercase tracking-widest shadow-sm">
            <span>MAXELL // XL-II 90</span>
            <span className="font-mono">{isPlaying ? 'SIDE A' : 'STOP'}</span>
          </div>

          {/* Album Picture or Cassette Spools */}
          <div className="relative flex-1 my-1.5 rounded-lg overflow-hidden flex items-center justify-center bg-neutral-900 border border-pink-500/40">
            {media.entityPicture ? (
              <img
                src={media.entityPicture}
                alt={media.title}
                className={`w-full h-full object-cover filter contrast-125 transition-transform duration-700 ${isPlaying ? 'scale-105' : 'scale-100'}`}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-4 text-center">
                <Disc size={64} className={`text-pink-500 mb-2 ${isPlaying ? 'animate-spin-slow' : ''}`} />
                <span className="text-xs font-black uppercase">{media.title}</span>
              </div>
            )}

            {/* Glowing Cassette Window Overlay */}
            <div className="absolute bottom-2 inset-x-4 py-1 px-3 bg-black/80 rounded border border-pink-500/60 flex items-center justify-between text-[10px] font-mono font-bold text-amber-300">
              <span className={`inline-block w-3 h-3 rounded-full border border-pink-400 ${isPlaying ? 'animate-spin' : ''}`}>
                ☼
              </span>
              <span>TAPE 042</span>
              <span className={`inline-block w-3 h-3 rounded-full border border-pink-400 ${isPlaying ? 'animate-spin' : ''}`}>
                ☼
              </span>
            </div>
          </div>
        </div>

        {/* Track Info & Neon Controls */}
        <div className="flex-1 flex flex-col justify-between h-72 py-1">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black italic uppercase tracking-wider text-amber-300">
                MIAMI WALKMAN // {media.entityId ? media.entityId.replace('media_player.', '').toUpperCase() : 'STEREO'}
              </span>
              <span className="text-xs font-bold font-mono text-pink-400 flex items-center">
                <span className={`w-2 h-2 rounded-full mr-1.5 ${isPlaying ? 'bg-pink-500 animate-ping' : 'bg-gray-600'}`} />
                {isPlaying ? 'PLAYING' : 'PAUSED'}
              </span>
            </div>

            <h1 className="text-3xl font-black italic tracking-wide text-white truncate drop-shadow-[0_0_12px_rgba(255,0,127,0.7)]">
              {media.title}
            </h1>
            <p className="text-lg font-bold text-pink-400 mt-1 truncate">
              {media.artist}
            </p>
            {media.album && (
              <p className="text-xs font-bold text-amber-300/80 mt-0.5 truncate uppercase">
                ALBUM: {media.album}
              </p>
            )}
          </div>

          {/* Neon Equalizer Spectrum */}
          <div className="flex items-end space-x-1 h-5 my-2">
            {[4, 14, 8, 20, 24, 12, 18, 26, 14, 22, 28, 12, 18, 8, 16, 24, 18].map((h, i) => (
              <span
                key={i}
                className="flex-1 rounded-t bg-gradient-to-t from-pink-600 via-rose-500 to-amber-400 shadow-[0_0_8px_#ff007f]"
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
              className="w-full h-3 rounded-full bg-pink-950/60 border border-pink-500/50 cursor-pointer relative flex items-center p-0.5"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-pink-500 to-amber-400 shadow-[0_0_12px_#ff007f] transition-[width] duration-300 ease-linear"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-xs font-mono font-bold text-amber-300 mt-1">
              <span>{formatSeconds(livePosition)}</span>
              <span>{formatSeconds(media.duration)}</span>
            </div>
          </div>

          {/* Physical Style Tape Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-pink-500/40">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => mediaControl('prev')}
                className="px-3.5 py-1.5 rounded-xl bg-pink-950/80 border border-pink-500 text-pink-200 hover:text-white text-xs font-black uppercase shadow-[0_0_10px_rgba(255,0,127,0.2)] active:translate-y-0.5"
              >
                &lt;&lt; REW
              </button>
              <button
                onClick={() => mediaControl('toggle')}
                className="px-6 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-amber-500 text-white font-black text-xs border border-pink-400 shadow-[0_0_20px_rgba(255,0,127,0.6)] flex items-center space-x-1.5 active:scale-95"
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
              </button>
              <button
                onClick={() => mediaControl('next')}
                className="px-3.5 py-1.5 rounded-xl bg-pink-950/80 border border-pink-500 text-pink-200 hover:text-white text-xs font-black uppercase shadow-[0_0_10px_rgba(255,0,127,0.2)] active:translate-y-0.5"
              >
                FFWD &gt;&gt;
              </button>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <Volume2 size={16} className="text-amber-400" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => mediaControl('volume', Number(e.target.value))}
                className="w-20 h-1.5 bg-pink-950 accent-pink-500 cursor-pointer"
              />
              <span className="font-mono text-amber-300 font-bold w-8 text-right">{volume}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
