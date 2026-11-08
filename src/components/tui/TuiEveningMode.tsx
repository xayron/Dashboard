import React, { useState } from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { TuiBox } from './TuiBox';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

export const TuiEveningMode: React.FC = () => {
  const { media, weather, now } = useDashboard();
  const [isPlaying, setIsPlaying] = useState(media.state === 'playing');
  const [volume, setVolume] = useState(media.volume || 65);

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${mins}:${String(s).padStart(2, '0')}`;
  };

  const progressPercent = media.duration > 0 ? (media.position / media.duration) * 100 : 45;
  const totalBlocks = 36;
  const filledBlocks = Math.round((progressPercent / 100) * totalBlocks);
  const progressBarAscii = `[${'█'.repeat(filledBlocks)}${'░'.repeat(totalBlocks - filledBlocks)}]`;

  const volBlocks = 12;
  const filledVol = Math.round((volume / 100) * volBlocks);
  const volBarAscii = `[${'█'.repeat(filledVol)}${'░'.repeat(volBlocks - filledVol)}]`;

  return (
    <div className="w-full h-full p-8 flex flex-col justify-between overflow-hidden bg-black font-mono text-gray-200 select-none">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-emerald-500/40 text-xs">
        <div className="flex items-center space-x-2 text-emerald-400 font-bold">
          <span>&gt; NCMPCPP_TERMINAL_AUDIO_PLAYER</span>
          <span className="text-gray-500">::</span>
          <span className="text-white">v0.9.2-git</span>
          <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px]">
            [{isPlaying ? 'PLAYING' : 'PAUSED'}]
          </span>
        </div>

        <div className="text-gray-400">
          SUNSET: {weather.sunset} | NIGHT_COND: {weather.condition.toUpperCase()} ({weather.temperature}°C)
        </div>
      </div>

      {/* Main Center Terminal Hero */}
      <div className="flex-1 my-6 flex items-center justify-center">
        <div className="w-full max-w-4xl border-2 border-emerald-500/50 bg-black/95 p-6 shadow-[0_0_30px_rgba(16,185,129,0.15)] flex space-x-8 items-center">
          {/* Left: Terminal Framed Album Art */}
          <div className="relative w-64 h-64 border-2 border-emerald-500/60 p-1.5 shrink-0 bg-black flex flex-col items-center justify-center">
            <div className="absolute -top-3 left-3 bg-black px-2 text-[10px] text-emerald-400 font-bold">
              [COVER_ART]
            </div>
            {media.entityPicture ? (
              <img
                src={media.entityPicture}
                alt={media.title}
                className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all"
              />
            ) : (
              <div className="text-center text-xs text-emerald-600 font-bold">
                [NO_COVER_AVAILABLE]
              </div>
            )}
            <div className="absolute -bottom-3 right-3 bg-black px-2 text-[10px] text-gray-500">
              600x600 px
            </div>
          </div>

          {/* Right: Audio Metadata & Terminal Equalizer */}
          <div className="flex-1 flex flex-col justify-between h-64 py-1">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">
                  DEVICE: <span className="text-emerald-400 font-bold">{media.entityId || 'Living Room Cast Speaker'}</span>
                </span>
                <span className="text-xs text-gray-400">
                  FORMAT: <span className="text-emerald-300 font-bold">FLAC 24-bit 96kHz</span>
                </span>
              </div>

              {/* Title & Artist */}
              <h1 className="text-3xl font-extrabold text-white tracking-wide truncate">
                {media.title}
              </h1>
              <p className="text-lg text-emerald-400 font-bold mt-1 truncate">
                &gt;&gt; {media.artist}
              </p>
              {media.album && (
                <p className="text-xs text-gray-400 mt-0.5 truncate">
                  ALBUM: {media.album}
                </p>
              )}
            </div>

            {/* ASCII Audio Equalizer Bars */}
            <div className="my-2 p-2 bg-emerald-950/20 border border-emerald-500/30">
              <div className="flex items-end space-x-1.5 h-6">
                {[3, 6, 2, 7, 5, 8, 4, 7, 3, 6, 8, 5, 7, 4, 2, 6, 8, 5, 3].map((level, i) => (
                  <span
                    key={i}
                    className="flex-1 text-center text-xs text-emerald-400 leading-none select-none font-extrabold"
                  >
                    {isPlaying ? [' ', '▂', '▃', '▄', '▅', '▆', '▇', '█'][level % 8] : ' '}
                  </span>
                ))}
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="text-xs text-emerald-300 font-mono tracking-wider flex items-center justify-between">
                <span>{formatSeconds(media.position || 112)}</span>
                <span className="text-emerald-400 font-bold">{progressBarAscii}</span>
                <span>{formatSeconds(media.duration || 243)}</span>
              </div>
            </div>

            {/* Controls & Volume */}
            <div className="flex items-center justify-between pt-2 border-t border-emerald-500/30 text-xs">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-900 font-bold"
                >
                  [{isPlaying ? 'PAUSE' : 'PLAY'}]
                </button>
                <button className="px-2 py-1 bg-white/5 border border-white/20 text-gray-300 hover:text-white">
                  [&lt;&lt; PREV]
                </button>
                <button className="px-2 py-1 bg-white/5 border border-white/20 text-gray-300 hover:text-white">
                  [NEXT &gt;&gt;]
                </button>
              </div>

              <div className="flex items-center space-x-2 text-gray-300">
                <span className="text-gray-400">VOL:</span>
                <span className="text-emerald-400 font-bold">{volBarAscii} {volume}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: System Telemetry */}
      <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-emerald-500/40">
        <div>
          STATUS: <span className="text-emerald-400 font-bold">ALL AUDIO SYSTEMS NOMINAL</span>
        </div>
        <div>
          STANDBY: <span className="text-gray-200">SCHEDULED AT 00:00 IST</span>
        </div>
      </div>
    </div>
  );
};
