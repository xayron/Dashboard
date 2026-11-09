import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, Disc, Music } from 'lucide-react';

export const ObsidianEveningMode: React.FC = () => {
  const { media, livePosition, mediaControl, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  const isPlaying = media.state === 'playing';
  if (!isPlaying) return null;

  const volume = media.volume ?? 70;

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
    ? 'bg-white/95 border border-slate-200 text-slate-900 shadow-xl'
    : 'bg-[#0f0f15] border border-white/[0.14] text-[#eef0f3] shadow-2xl';

  const innerClass = isLight
    ? 'bg-slate-50 border border-slate-200 text-slate-900'
    : 'bg-[#08080c] border border-white/[0.12] text-[#eef0f3]';

  const mutedClass = isLight ? 'text-slate-500' : 'text-[#9a9da6]';

  return (
    <div className={`w-full h-full p-8 flex flex-col justify-center items-center bg-transparent select-none font-sans relative ${
      isLight ? 'text-slate-900' : 'text-[#eef0f3]'
    }`}>
      <div className={`w-full max-w-4xl ${cardClass} p-8 flex space-x-10 items-center relative overflow-hidden`}>
        {/* Top Mode Label */}
        <div className={`absolute top-3.5 right-6 flex items-center space-x-2 font-mono text-[10px] ${mutedClass}`}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-accent, #5fd49b)' }} />
          <span>NOW PLAYING // MEDIA CENTER</span>
        </div>

        {/* Media Artwork / Cover Facet Plate */}
        <div className={`relative w-72 h-72 ${innerClass} p-2 shrink-0 flex flex-col justify-between`}>
          <div className="relative flex-1 overflow-hidden flex items-center justify-center bg-black/60 border border-white/[0.08]">
            {media.entityPicture ? (
              <img
                src={media.entityPicture}
                alt={media.title}
                className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-105' : 'scale-100'}`}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-4 text-center">
                <Disc size={64} className={`mb-2 ${isPlaying ? 'animate-spin-slow' : ''}`} style={{ color: 'var(--color-accent)' }} />
                <span className={`text-xs font-mono uppercase tracking-wider ${mutedClass}`}>{media.title}</span>
              </div>
            )}

            {/* Status Chip */}
            <div
              className="absolute bottom-2 left-2 px-2 py-0.5 border text-[9px] font-mono flex items-center space-x-1"
              style={{
                backgroundColor: 'var(--theme-accent-soft)',
                borderColor: 'var(--color-accent)',
                color: 'var(--color-accent)',
              }}
            >
              <Music size={10} />
              <span>STEREO</span>
            </div>
          </div>

          <div className={`mt-2 pt-2 border-t flex items-center justify-between text-[10px] font-mono ${
            isLight ? 'border-slate-200' : 'border-white/[0.08]'
          } ${mutedClass}`}>
            <span>BITRATE: 320 KBPS</span>
            <span>48.0 KHZ</span>
          </div>
        </div>

        {/* Track Details & Playback Controls */}
        <div className="flex-1 flex flex-col justify-between h-72 py-1">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span
                className="px-2 py-0.5 border text-[10px] font-mono tracking-wider uppercase font-bold"
                style={{
                  backgroundColor: 'var(--theme-accent-soft)',
                  borderColor: 'var(--color-accent)',
                  color: 'var(--color-accent)',
                }}
              >
                {media.entityId ? media.entityId.replace('media_player.', '').toUpperCase() : 'ZONE AUDIO'}
              </span>
              <span className={`text-xs font-mono ${mutedClass}`}>
                SOURCE: {media.entityId ? media.entityId.replace('media_player.', '').toUpperCase() : 'MEDIA STREAM'}
              </span>
            </div>

            <h1 className={`text-3xl font-bold tracking-tight line-clamp-1 ${isLight ? 'text-slate-900' : 'text-[#eef0f3]'}`}>
              {media.title}
            </h1>
            <p className="text-lg font-mono mt-1 truncate" style={{ color: 'var(--color-accent, #5fd49b)' }}>
              {media.artist}
            </p>
            {media.album && (
              <p className={`text-xs font-mono mt-0.5 truncate ${mutedClass}`}>
                ALBUM: {media.album}
              </p>
            )}
          </div>

          {/* Scrub Track */}
          <div className="my-2">
            <div
              onClick={handleScrub}
              title="Click to seek"
              className={`w-full h-2.5 border cursor-pointer relative flex items-center p-0.5 ${
                isLight ? 'bg-slate-200 border-slate-300' : 'bg-[#08080c] border-white/[0.14]'
              }`}
            >
              <div
                className="h-full transition-[width] duration-300 ease-linear"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: 'var(--color-accent, #5fd49b)',
                  boxShadow: isLight ? 'none' : '0 0 10px var(--color-glow, rgba(95,212,155,0.4))',
                }}
              />
            </div>
            <div className={`flex justify-between items-center text-xs font-mono mt-1 ${mutedClass}`}>
              <span style={{ color: 'var(--color-accent, #5fd49b)' }}>{formatSeconds(livePosition)}</span>
              <span>{formatSeconds(media.duration)}</span>
            </div>
          </div>

          {/* Controls & Volume */}
          <div className={`flex items-center justify-between pt-2 border-t ${
            isLight ? 'border-slate-200' : 'border-white/[0.1]'
          }`}>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => mediaControl('prev')}
                className={`px-3 py-1.5 border font-mono text-xs tracking-wider transition-colors ${
                  isLight
                    ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
                    : 'bg-[#08080c] border-white/[0.12] text-[#eef0f3] hover:border-white/[0.3]'
                }`}
              >
                &lt;&lt; PREV
              </button>

              <button
                onClick={() => mediaControl('toggle')}
                className="px-5 py-1.5 border font-mono font-bold text-xs tracking-wider transition-all"
                style={{
                  backgroundColor: 'var(--color-accent, #5fd49b)',
                  borderColor: 'var(--color-accent, #5fd49b)',
                  color: 'var(--color-accent-contrast, #ffffff)',
                  boxShadow: isLight ? 'none' : '0 0 12px var(--color-glow, rgba(95,212,155,0.3))',
                }}
              >
                {isPlaying ? 'PAUSE ||' : 'PLAY ▶'}
              </button>

              <button
                onClick={() => mediaControl('next')}
                className={`px-3 py-1.5 border font-mono text-xs tracking-wider transition-colors ${
                  isLight
                    ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
                    : 'bg-[#08080c] border-white/[0.12] text-[#eef0f3] hover:border-white/[0.3]'
                }`}
              >
                NEXT &gt;&gt;
              </button>
            </div>

            <div className={`flex items-center space-x-2 text-xs font-mono ${mutedClass}`}>
              <Volume2 size={16} style={{ color: 'var(--color-accent, #5fd49b)' }} />
              <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-[#eef0f3]'}`}>{volume}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
