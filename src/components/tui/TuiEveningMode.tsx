import React from 'react';
import { useDashboard } from '../../state/DashboardContext';

export const TuiEveningMode: React.FC = () => {
  const { media, livePosition, mediaControl, weather, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

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
  const totalBlocks = 36;
  const filledBlocks = Math.round((progressPercent / 100) * totalBlocks);
  const progressBarAscii = `[${'█'.repeat(filledBlocks)}${'░'.repeat(Math.max(0, totalBlocks - filledBlocks))}]`;

  const volBlocks = 12;
  const filledVol = Math.round((volume / 100) * volBlocks);
  const volBarAscii = `[${'█'.repeat(filledVol)}${'░'.repeat(Math.max(0, volBlocks - filledVol))}]`;

  return (
    <div className={`w-full h-full p-8 flex flex-col justify-between overflow-hidden bg-transparent font-mono select-none ${
      isLight ? 'text-slate-800' : 'text-gray-200'
    }`}>
      {/* Top Banner */}
      <div
        className="flex items-center justify-between pb-3 border-b text-xs"
        style={{ borderColor: 'var(--color-accent-soft)' }}
      >
        <div className="flex items-center space-x-2 font-bold" style={{ color: 'var(--color-accent)' }}>
          <span>&gt; NCMPCPP_TERMINAL_AUDIO_PLAYER</span>
          <span className={isLight ? 'text-slate-400' : 'text-gray-500'}>::</span>
          <span className={isLight ? 'text-slate-900' : 'text-white'}>v0.9.2-git</span>
          <span
            className="px-2 py-0.5 text-[10px] border"
            style={{
              backgroundColor: 'var(--theme-accent-soft)',
              borderColor: 'var(--color-accent)',
              color: 'var(--color-accent)',
            }}
          >
            [{isPlaying ? 'PLAYING' : 'PAUSED'}]
          </span>
        </div>

        <div className={isLight ? 'text-slate-500' : 'text-gray-400'}>
          SUNSET: {weather.sunset} | NIGHT_COND: {weather.condition.toUpperCase()} ({weather.temperature}°C)
        </div>
      </div>

      {/* Main Center Terminal Hero */}
      <div className="flex-1 my-6 flex items-center justify-center">
        <div
          className={`w-full max-w-4xl border-2 p-6 flex space-x-8 items-center ${
            isLight ? 'bg-white/95 shadow-md' : 'bg-black/95 shadow-[0_0_30px_rgba(0,0,0,0.5)]'
          }`}
          style={{
            borderColor: 'var(--color-accent)',
            boxShadow: `0 0 25px var(--color-glow)`,
          }}
        >
          {/* Left: Terminal Framed Album Art */}
          <div
            className={`relative w-64 h-64 border-2 p-1.5 shrink-0 flex flex-col items-center justify-center ${
              isLight ? 'bg-slate-100' : 'bg-black'
            }`}
            style={{ borderColor: 'var(--color-accent)' }}
          >
            <div
              className={`absolute -top-3 left-3 px-2 text-[10px] font-bold ${
                isLight ? 'bg-white' : 'bg-black'
              }`}
              style={{ color: 'var(--color-accent)' }}
            >
              [COVER_ART]
            </div>
            {media.entityPicture ? (
              <img
                src={media.entityPicture}
                alt={media.title}
                className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all"
              />
            ) : (
              <div className="text-center text-xs font-bold" style={{ color: 'var(--color-accent)' }}>
                [NO_COVER_AVAILABLE]
              </div>
            )}
            <div className={`absolute -bottom-3 right-3 px-2 text-[10px] ${
              isLight ? 'bg-white text-slate-500' : 'bg-black text-gray-500'
            }`}>
              600x600 px
            </div>
          </div>

          {/* Right: Audio Metadata & Terminal Equalizer */}
          <div className="flex-1 flex flex-col justify-between h-64 py-1">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                  DEVICE: <span className="font-bold" style={{ color: 'var(--color-accent)' }}>{media.entityId || 'Living Room Cast Speaker'}</span>
                </span>
                <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                  FORMAT: <span className="font-bold" style={{ color: 'var(--color-accent)' }}>FLAC 24-bit 96kHz</span>
                </span>
              </div>

              {/* Title & Artist */}
              <h1 className={`text-3xl font-extrabold tracking-wide truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {media.title}
              </h1>
              <p className="text-lg font-bold mt-1 truncate" style={{ color: 'var(--color-accent)' }}>
                &gt;&gt; {media.artist}
              </p>
              {media.album && (
                <p className={`text-xs mt-0.5 truncate ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                  ALBUM: {media.album}
                </p>
              )}
            </div>

            {/* ASCII Audio Equalizer Bars */}
            <div
              className="my-2 p-2 border"
              style={{
                backgroundColor: 'var(--theme-accent-soft)',
                borderColor: 'var(--color-accent-soft)',
              }}
            >
              <div className="flex items-end space-x-1.5 h-6">
                {[3, 6, 2, 7, 5, 8, 4, 7, 3, 6, 8, 5, 7, 4, 2, 6, 8, 5, 3].map((level, i) => (
                  <span
                    key={i}
                    className="flex-1 text-center text-xs leading-none select-none font-extrabold"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    {isPlaying ? [' ', '▂', '▃', '▄', '▅', '▆', '▇', '█'][level % 8] : ' '}
                  </span>
                ))}
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div
                className="text-xs font-mono tracking-wider flex items-center justify-between"
                style={{ color: 'var(--color-accent)' }}
              >
                <span>{formatSeconds(livePosition)}</span>
                <span className="font-bold tracking-normal">{progressBarAscii}</span>
                <span>{formatSeconds(media.duration)}</span>
              </div>
            </div>

            {/* Controls & Volume */}
            <div
              className="flex items-center justify-between pt-2 border-t text-xs"
              style={{ borderColor: 'var(--color-accent-soft)' }}
            >
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => mediaControl('prev')}
                  className={`px-2 py-1 border transition-colors ${
                    isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' : 'bg-white/5 border-white/20 text-gray-300 hover:text-white'
                  }`}
                >
                  [&lt;&lt; PREV]
                </button>
                <button
                  onClick={() => mediaControl('toggle')}
                  className="px-3 py-1 font-bold border transition-all"
                  style={{
                    backgroundColor: 'var(--color-accent)',
                    borderColor: 'var(--color-accent)',
                    color: 'var(--color-accent-contrast, #ffffff)',
                  }}
                >
                  [{isPlaying ? 'PAUSE' : 'PLAY'}]
                </button>
                <button
                  onClick={() => mediaControl('next')}
                  className={`px-2 py-1 border transition-colors ${
                    isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' : 'bg-white/5 border-white/20 text-gray-300 hover:text-white'
                  }`}
                >
                  [NEXT &gt;&gt;]
                </button>
              </div>

              <div className={`flex items-center space-x-2 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                <span className={isLight ? 'text-slate-500' : 'text-gray-400'}>VOL:</span>
                <button
                  onClick={() => mediaControl('volume', Math.max(0, volume - 10))}
                  className={`px-1 text-xs ${isLight ? 'hover:text-black' : 'hover:text-white'}`}
                >
                  [-]
                </button>
                <span className="font-bold" style={{ color: 'var(--color-accent)' }}>{volBarAscii} {volume}%</span>
                <button
                  onClick={() => mediaControl('volume', Math.min(100, volume + 10))}
                  className={`px-1 text-xs ${isLight ? 'hover:text-black' : 'hover:text-white'}`}
                >
                  [+]
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: System Telemetry */}
      <div
        className={`flex items-center justify-between text-xs pt-3 border-t ${
          isLight ? 'text-slate-500' : 'text-gray-400'
        }`}
        style={{ borderColor: 'var(--color-accent-soft)' }}
      >
        <div>
          STATUS: <span className="font-bold" style={{ color: 'var(--color-accent)' }}>ALL AUDIO SYSTEMS NOMINAL</span>
        </div>
        <div>
          STANDBY: <span className={isLight ? 'text-slate-700' : 'text-gray-200'}>SCHEDULED AT 00:00 IST</span>
        </div>
      </div>
    </div>
  );
};
