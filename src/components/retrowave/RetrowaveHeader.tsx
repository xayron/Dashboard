import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Sparkles, Radio, Zap, Sun, Moon, Settings } from 'lucide-react';

export const RetrowaveHeader: React.FC = () => {
  const { systemHealth, activeMode, weather, colorMode, toggleColorMode, setIsSettingsOpen } = useDashboard();

  return (
    <header
      className="w-full bg-transparent border-b-2 px-8 py-2.5 flex items-center justify-between text-xs select-none z-30"
      style={{
        borderColor: 'var(--color-accent, #ec4899)',
        boxShadow: '0 4px 25px var(--color-glow, rgba(255,0,127,0.35))',
      }}
    >
      {/* 80s Outrun Sliced Sun Logo & Title */}
      <div className="flex items-center space-x-3.5">
        {/* Sliced Neon Sun Icon */}
        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gradient-to-t from-pink-600 via-rose-500 to-amber-400 p-0.5 flex flex-col justify-between shadow-[0_0_15px_#ff007f]">
          <div className="w-full h-1 bg-black/60 mt-2" />
          <div className="w-full h-1 bg-black/60" />
          <div className="w-full h-1 bg-black/60 mb-1" />
        </div>

        <div>
          <span className="text-sm font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-400 to-fuchsia-400 drop-shadow-[0_0_8px_rgba(255,0,127,0.6)]">
            OUTRUN // 1984
          </span>
          <span
            className="ml-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
            style={{
              backgroundColor: 'var(--color-accent-soft, rgba(236,72,153,0.2))',
              borderColor: 'var(--color-accent, #ec4899)',
              color: 'var(--color-accent, #ec4899)',
            }}
          >
            {activeMode}
          </span>
        </div>
      </div>

      {/* Retro Sunset Readouts */}
      <div className="flex items-center space-x-5 text-xs font-bold">
        <span className="text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">
          {weather.temperature}°C {weather.condition.toUpperCase()}
        </span>
        <span className="text-pink-500">★</span>
        <span className="text-pink-200">CPU {systemHealth.cpuUsage}%</span>
        <span className="text-pink-200">RAM {systemHealth.ramUsage}%</span>
        <span className="text-pink-500">★</span>
        <button
          onClick={toggleColorMode}
          title="Toggle Daytime / Night Outrun"
          className="flex items-center space-x-1 px-2 py-0.5 rounded-full border text-[10px] uppercase cursor-pointer"
          style={{
            borderColor: 'var(--color-accent)',
            backgroundColor: 'var(--theme-accent-soft)',
            color: 'var(--color-accent)',
          }}
        >
          {colorMode === 'dark' ? <Sun size={11} /> : <Moon size={11} />}
          <span>{colorMode.toUpperCase()}</span>
        </button>
        <button
          onClick={() => setIsSettingsOpen(true)}
          title="Settings (Press 'S')"
          aria-label="Settings"
          className="p-1 rounded-full border cursor-pointer hover:brightness-125 transition-all shadow-[0_0_10px_rgba(255,0,127,0.3)]"
          style={{
            borderColor: 'var(--color-accent)',
            backgroundColor: 'var(--theme-accent-soft)',
            color: 'var(--color-accent)',
          }}
        >
          <Settings size={12} />
        </button>
      </div>
    </header>
  );
};
