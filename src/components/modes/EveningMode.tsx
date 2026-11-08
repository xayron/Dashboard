import React, { useState, useEffect } from 'react';
import {
  Music,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Radio,
  Moon,
  Sparkles,
  Sliders,
} from 'lucide-react';
import { useDashboard } from '../../state/DashboardContext';
import { ClockWidget } from '../common/ClockWidget';
import { WeatherWidget } from '../common/WeatherWidget';

export const EveningMode: React.FC = () => {
  const { media, weather } = useDashboard();
  const [isPlaying, setIsPlaying] = useState<boolean>(media.state === 'playing');
  const [volume, setVolume] = useState<number>(media.volume || 65);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [media.entityPicture]);

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${mins}:${String(s).padStart(2, '0')}`;
  };

  const progressPercent = media.duration > 0 ? (media.position / media.duration) * 100 : 45;

  return (
    <div className="relative w-full h-full p-10 flex flex-col justify-between overflow-hidden bg-black select-none">
      {/* 1. DYNAMIC VIBRANT BACKGROUND ALBUM ART EXTRACTION */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {media.entityPicture && !imageError ? (
          <div
            className="w-full h-full bg-cover bg-center transform scale-125 filter blur-[90px] opacity-35 brightness-75 contrast-125 transition-all duration-1000"
            style={{ backgroundImage: `url(${media.entityPicture})` }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-black filter blur-[80px]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-black/80" />
      </div>

      {/* 2. TOP ROW: EVENING AMBIENCE & CLOCK */}
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <Moon size={28} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-bold font-display text-white">Evening Now Playing</h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center">
                <Sparkles size={11} className="mr-1 text-purple-300" />
                Cozy Vibe
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Sunset was at {weather.sunset} • Screen auto-sleep scheduled at 00:00
            </p>
          </div>
        </div>

        <div className="glass-panel px-6 py-3 rounded-2xl border border-white/10">
          <ClockWidget size="normal" showSeconds={true} showDate={true} />
        </div>
      </div>

      {/* 3. CENTER HERO: NOW-PLAYING AUDIO EXPERIENCE */}
      <div className="relative z-10 flex-1 my-6 flex items-center justify-center">
        <div className="w-full max-w-4xl glass-panel p-8 rounded-3xl border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl flex items-center space-x-10">
          {/* Large Vinyl / Album Cover with shadow */}
          <div className="relative w-72 h-72 rounded-3xl overflow-hidden shrink-0 shadow-2xl border border-white/20 group bg-gray-900 flex items-center justify-center">
            {media.entityPicture && !imageError ? (
              <img
                src={media.entityPicture}
                alt={media.title}
                onError={() => setImageError(true)}
                className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-105' : 'scale-100'}`}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-950 to-purple-950 text-indigo-300 p-6 text-center">
                <Music size={56} className="mb-2 opacity-60" />
                <span className="text-xs font-semibold text-gray-300">{media.title || 'Now Playing'}</span>
                <span className="text-[10px] text-gray-400 mt-1">{media.artist}</span>
              </div>
            )}
            {/* Soft inner glow */}
            <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-3xl pointer-events-none" />
          </div>

          {/* Right: Metadata, Equalizer, Controls */}
          <div className="flex-1 flex flex-col justify-between h-72 py-1">
            <div>
              {/* Media badge & Equalizer */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-widest text-indigo-400 font-bold flex items-center">
                  <Radio size={14} className="mr-1.5 animate-pulse text-indigo-400" />
                  {media.entityId ? media.entityId.replace('media_player.', '') : 'Living Room Cast Speaker'}
                </span>

                {/* Animated sound spectrum equalizer bars */}
                <div className="flex items-end space-x-1 h-5">
                  {[12, 20, 8, 24, 16, 28, 14, 22, 10, 18].map((h, i) => (
                    <span
                      key={i}
                      className="w-1 bg-gradient-to-t from-indigo-500 to-purple-400 rounded-full transition-all duration-300"
                      style={{
                        height: isPlaying ? `${Math.max(4, (h + (i % 3) * 4))}px` : '4px',
                        animation: isPlaying ? `pulse-glow ${0.8 + (i % 4) * 0.2}s infinite ease-in-out` : 'none',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Title & Artist */}
              <h1 className="text-3xl font-extrabold font-display text-white tracking-tight line-clamp-1 drop-shadow-md">
                {media.title}
              </h1>
              <p className="text-lg font-medium text-gray-300 mt-1 truncate">
                {media.artist}
              </p>
              {media.album && (
                <p className="text-xs text-gray-400 mt-0.5 truncate">
                  {media.album}
                </p>
              )}
            </div>

            {/* Scrub / Progress Bar */}
            <div className="my-4">
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden cursor-pointer">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.6)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-xs font-mono-numbers text-gray-400 mt-1.5">
                <span>{formatSeconds(media.position || 112)}</span>
                <span>{formatSeconds(media.duration || 243)}</span>
              </div>
            </div>

            {/* Playback Controls & Volume */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              {/* Media Controls */}
              <div className="flex items-center space-x-4">
                <button
                  className="p-2.5 rounded-full glass-pill text-gray-300 hover:text-white transition-all hover:scale-105"
                  title="Previous Track"
                >
                  <SkipBack size={20} />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-purple-600/30 transition-all hover:scale-110 active:scale-95"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
                </button>
                <button
                  className="p-2.5 rounded-full glass-pill text-gray-300 hover:text-white transition-all hover:scale-105"
                  title="Next Track"
                >
                  <SkipForward size={20} />
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center space-x-2.5">
                <Volume2 size={18} className="text-gray-400" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-24 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <span className="text-xs font-mono-numbers text-gray-400 w-8 text-right">{volume}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM BAR: EVENING WEATHER SNAPSHOT & AMBIENT STATUS */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="max-w-md">
          <WeatherWidget layout="compact" />
        </div>

        <div className="glass-panel px-4 py-2 rounded-xl border border-white/10 text-xs text-gray-400 flex items-center space-x-3">
          <span className="flex items-center text-purple-300">
            <Sliders size={13} className="mr-1.5" />
            Home Lighting: Warm Dim 2700K
          </span>
          <span className="w-1 h-1 rounded-full bg-gray-600" />
          <span>Volume Limiter: Max 80dB</span>
        </div>
      </div>
    </div>
  );
};
