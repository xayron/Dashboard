import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, Disc } from 'lucide-react';

export const RetrowaveEveningMode: React.FC = () => {
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

  return (
    <div className={`relative w-full h-full p-8 flex flex-col justify-center items-center bg-transparent select-none ${
      isLight ? 'text-pink-950' : 'text-pink-100'
    }`}>
      {/* 80s Perspective Floor Lines */}
      <div
        className="absolute inset-x-0 bottom-0 h-64 pointer-events-none opacity-20 z-0"
        style={{
          backgroundImage: 'linear-gradient(to right, var(--color-accent, #ff007f) 1px, transparent 1px), linear-gradient(to bottom, var(--color-accent, #ff007f) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          transform: 'perspective(300px) rotateX(60deg)',
          transformOrigin: 'bottom center',
        }}
      />

      <div
        className={`relative z-10 w-full max-w-4xl rounded-3xl border-2 p-8 flex space-x-10 items-center ${
          isLight
            ? 'bg-pink-50/95 border-pink-400 shadow-[0_0_35px_rgba(236,72,153,0.2)] text-slate-900'
            : 'bg-[#1e0736]/95 border-pink-500 shadow-[0_0_40px_rgba(255,0,127,0.35)] text-pink-100'
        }`}
        style={{ borderColor: 'var(--color-accent)' }}
      >
        {/* Cassette Tape / Album Cover Frame */}
        <div className={`relative w-72 h-72 rounded-2xl border-2 p-2 shrink-0 flex flex-col justify-between overflow-hidden ${
          isLight ? 'bg-white border-pink-400 shadow-md' : 'bg-black border-pink-500 shadow-[0_0_25px_rgba(255,0,127,0.4)]'
        }`}
        style={{ borderColor: 'var(--color-accent)' }}
        >
          {/* Neon Cassette Header Bar */}
          <div className="flex items-center justify-between px-2 py-1 bg-gradient-to-r from-pink-600 to-amber-500 text-white rounded-t-lg text-[10px] font-black uppercase tracking-widest shadow-sm">
            <span>MAXELL // XL-II 90</span>
            <span className="font-mono">{isPlaying ? 'SIDE A' : 'STOP'}</span>
          </div>

          {/* Album Picture or Disc */}
          <div className="relative flex-1 my-1.5 rounded-lg overflow-hidden flex items-center justify-center bg-black/60">
            {media.entityPicture ? (
              <img
                src={media.entityPicture}
                alt={media.title}
                className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-105' : 'scale-100'}`}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-4">
                <Disc size={64} className="animate-spin-slow mb-2" style={{ color: 'var(--color-accent)' }} />
                <span className="text-xs font-black uppercase text-pink-300">{media.title}</span>
              </div>
            )}
          </div>

          {/* Cassette bottom line */}
          <div className="flex items-center justify-between px-2 py-0.5 text-[9px] font-mono text-pink-300 border-t border-pink-500/40">
            <span>HIGH BIAS 70µs EQ</span>
            <span>CHROMA NOISE REDUCTION</span>
          </div>
        </div>

        {/* Neon Track Details & Sunset Controls */}
        <div className="flex-1 flex flex-col justify-between h-72 py-1">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span
                className="px-2.5 py-0.5 rounded-full text-black font-black text-[10px] uppercase tracking-wider"
                style={{ backgroundColor: 'var(--color-accent, #ff007f)' }}
              >
                {media.entityId ? media.entityId.replace('media_player.', '').toUpperCase() : 'BOOMBOX OUT'}
              </span>
              <span className={`text-xs font-mono font-bold ${isLight ? 'text-pink-800' : 'text-amber-300'}`}>
                {isPlaying ? '● STEREO PLAYING' : '○ DECK PAUSED'}
              </span>
            </div>

            <h1 className="text-3xl font-black italic tracking-wide line-clamp-1">
              {media.title}
            </h1>
            <p className="text-xl font-bold mt-1 italic truncate" style={{ color: 'var(--color-accent)' }}>
              {media.artist}
            </p>
            {media.album && (
              <p className={`text-xs uppercase tracking-wide mt-0.5 truncate ${isLight ? 'text-slate-600' : 'text-pink-300/80'}`}>
                ALBUM: {media.album}
              </p>
            )}
          </div>

          {/* Glowing Scrub Bar */}
          <div className="my-2">
            <div
              onClick={handleScrub}
              title="Click to seek"
              className={`w-full h-3 rounded-full cursor-pointer relative flex items-center p-0.5 border ${
                isLight ? 'bg-pink-100 border-pink-300' : 'bg-black/60 border-pink-500/50'
              }`}
            >
              <div
                className="h-full rounded-full transition-[width] duration-300 ease-linear"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: 'var(--color-accent, #ff007f)',
                  boxShadow: '0 0 12px var(--color-glow)',
                }}
              />
            </div>
            <div className={`flex justify-between items-center text-xs font-mono font-bold mt-1 ${isLight ? 'text-slate-600' : 'text-pink-300'}`}>
              <span style={{ color: 'var(--color-accent)' }}>{formatSeconds(livePosition)}</span>
              <span>{formatSeconds(media.duration)}</span>
            </div>
          </div>

          {/* Vintage Transport Keys & Volume */}
          <div className={`flex items-center justify-between pt-2 border-t ${
            isLight ? 'border-pink-200' : 'border-pink-500/30'
          }`}>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => mediaControl('prev')}
                className={`px-3 py-1.5 rounded-xl border font-bold text-xs uppercase transition-all ${
                  isLight
                    ? 'bg-white border-pink-300 text-slate-800 hover:bg-pink-100'
                    : 'bg-black/40 border-pink-500/40 text-pink-200 hover:bg-pink-950/60'
                }`}
              >
                &lt;&lt; REW
              </button>

              <button
                onClick={() => mediaControl('toggle')}
                className="px-6 py-1.5 rounded-xl font-black text-xs uppercase transition-transform hover:scale-105 active:scale-95 shadow-lg"
                style={{
                  backgroundColor: 'var(--color-accent, #ff007f)',
                  color: 'var(--color-accent-contrast, #ffffff)',
                  boxShadow: '0 0 20px var(--color-glow)',
                }}
              >
                {isPlaying ? 'PAUSE [||]' : 'PLAY [▶]'}
              </button>

              <button
                onClick={() => mediaControl('next')}
                className={`px-3 py-1.5 rounded-xl border font-bold text-xs uppercase transition-all ${
                  isLight
                    ? 'bg-white border-pink-300 text-slate-800 hover:bg-pink-100'
                    : 'bg-black/40 border-pink-500/40 text-pink-200 hover:bg-pink-950/60'
                }`}
              >
                FFWD &gt;&gt;
              </button>
            </div>

            <div className="flex items-center space-x-2 text-xs font-bold">
              <Volume2 size={16} style={{ color: 'var(--color-accent)' }} />
              <span className="font-mono">{volume}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
