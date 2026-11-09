import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, Disc, Music } from 'lucide-react';

export const CivicEveningMode: React.FC = () => {
  const { media, livePosition, mediaControl, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

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

  const cardClass = isLight
    ? 'bg-white border border-slate-300 rounded-2xl text-slate-900 shadow-lg'
    : 'bg-slate-900/95 border border-slate-700 rounded-2xl text-slate-100 shadow-2xl';

  const innerClass = isLight
    ? 'bg-slate-100 border border-slate-300 rounded-xl'
    : 'bg-slate-800 border border-slate-700 rounded-xl';

  const mutedClass = isLight ? 'text-slate-500' : 'text-slate-400';

  return (
    <div className={`w-full h-full p-8 flex flex-col justify-center items-center bg-transparent select-none font-sans ${
      isLight ? 'text-slate-900' : 'text-slate-100'
    }`}>
      <div className={`w-full max-w-4xl ${cardClass} p-8 flex space-x-10 items-center relative overflow-hidden`}>
        {/* Tricolor Header Accent */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#f97316] via-white to-[#16a34a]" />

        {/* Top Mode Label */}
        <div className={`absolute top-3.5 right-6 flex items-center space-x-2 font-mono text-[11px] font-bold ${mutedClass}`}>
          <Music size={14} style={{ color: 'var(--color-accent, #f97316)' }} />
          <span>NOW PLAYING // MEDIA CENTER</span>
        </div>

        {/* Media Artwork / Cover Plate */}
        <div className={`relative w-72 h-72 ${innerClass} p-2.5 shrink-0 flex flex-col justify-between shadow-sm`}>
          <div className="relative flex-1 overflow-hidden rounded-lg flex items-center justify-center bg-slate-950 border border-slate-800">
            {media.entityPicture ? (
              <img
                src={media.entityPicture}
                alt={media.title}
                className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-105' : 'scale-100'}`}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-4 text-center">
                <Disc size={64} className={`mb-2 ${isPlaying ? 'animate-spin-slow' : ''}`} style={{ color: 'var(--color-accent, #f97316)' }} />
                <span className={`text-xs font-mono font-bold uppercase tracking-wider ${mutedClass}`}>{media.title}</span>
              </div>
            )}

            {/* Official Badge */}
            <div className="absolute top-2 left-2 px-2 py-0.5 bg-slate-900/90 text-white border border-slate-700 text-[10px] font-mono font-bold rounded">
              AUDIO BROADCAST
            </div>
          </div>

          <div className={`mt-2 pt-2 border-t flex items-center justify-between text-[11px] font-mono ${
            isLight ? 'border-slate-200' : 'border-slate-700'
          } ${mutedClass}`}>
            <span>BITRATE: HIGH QUALITY</span>
            <span className="font-bold" style={{ color: 'var(--color-accent, #f97316)' }}>STEREO FEED</span>
          </div>
        </div>

        {/* Track Details & Playback Controls */}
        <div className="flex-1 flex flex-col justify-between h-72 py-1">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span
                className="px-2.5 py-0.5 border text-[11px] font-mono font-bold uppercase rounded shadow-xs"
                style={{
                  backgroundColor: 'var(--theme-accent-soft)',
                  borderColor: 'var(--color-accent)',
                  color: 'var(--color-accent)',
                }}
              >
                {media.entityId ? media.entityId.replace('media_player.', '').toUpperCase() : 'MAIN AUDIO'}
              </span>
              <span className={`text-xs font-mono font-semibold ${mutedClass}`}>
                SOURCE: {media.entityId ? media.entityId.replace('media_player.', '').toUpperCase() : 'AIRPLAY'}
              </span>
            </div>

            <h1 className={`text-3xl font-extrabold tracking-tight line-clamp-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {media.title}
            </h1>
            <p className="text-lg font-bold mt-1 truncate" style={{ color: 'var(--color-accent, #f97316)' }}>
              {media.artist}
            </p>
            {media.album && (
              <p className={`text-xs font-mono mt-0.5 truncate ${mutedClass}`}>
                COLLECTION: {media.album}
              </p>
            )}
          </div>

          {/* Scrub Track */}
          <div className="my-2">
            <div
              onClick={handleScrub}
              title="Click to seek"
              className={`w-full h-3 rounded-full cursor-pointer relative flex items-center p-0.5 border ${
                isLight ? 'bg-slate-200 border-slate-300' : 'bg-slate-800 border-slate-700'
              }`}
            >
              <div
                className="h-full rounded-full transition-[width] duration-300 ease-linear"
                style={{ width: `${progressPercent}%`, backgroundColor: 'var(--color-accent, #f97316)' }}
              />
            </div>
            <div className={`flex justify-between items-center text-xs font-mono font-bold mt-1.5 ${mutedClass}`}>
              <span style={{ color: 'var(--color-accent, #f97316)' }}>{formatSeconds(livePosition)}</span>
              <span>{formatSeconds(media.duration)}</span>
            </div>
          </div>

          {/* Controls & Volume */}
          <div className={`flex items-center justify-between pt-2 border-t ${
            isLight ? 'border-slate-200' : 'border-slate-800'
          }`}>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => mediaControl('prev')}
                className={`px-3 py-1.5 border font-mono font-bold text-xs rounded-lg transition-colors shadow-xs ${
                  isLight
                    ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
                    : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                }`}
              >
                &lt;&lt; PREV
              </button>

              <button
                onClick={() => mediaControl('toggle')}
                className="px-6 py-2 rounded-lg font-mono font-black text-xs uppercase transition-transform hover:scale-105 active:scale-95 shadow-md"
                style={{
                  backgroundColor: 'var(--color-accent, #f97316)',
                  color: 'var(--color-accent-contrast, #ffffff)',
                }}
              >
                {isPlaying ? 'PAUSE ||' : 'PLAY ▶'}
              </button>

              <button
                onClick={() => mediaControl('next')}
                className={`px-3 py-1.5 border font-mono font-bold text-xs rounded-lg transition-colors shadow-xs ${
                  isLight
                    ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
                    : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                }`}
              >
                NEXT &gt;&gt;
              </button>
            </div>

            <div className={`flex items-center space-x-2 text-xs font-mono font-bold ${mutedClass}`}>
              <Volume2 size={16} style={{ color: 'var(--color-accent, #f97316)' }} />
              <span className={isLight ? 'text-slate-900' : 'text-white'}>{volume}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
