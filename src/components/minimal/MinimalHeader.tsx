import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Sun, Moon } from 'lucide-react';

export const MinimalHeader: React.FC = () => {
  const { systemHealth, activeMode, weather, colorMode, toggleColorMode } = useDashboard();

  return (
    <header className="w-full px-10 py-3 border-b border-white/10 flex items-center justify-between text-xs text-neutral-400 select-none bg-transparent backdrop-blur-sm z-30">
      <div className="flex items-center space-x-3">
        <span className="font-medium tracking-widest text-[11px] uppercase">
          Smart Display
        </span>
        <span className="opacity-40">/</span>
        <span className="font-light uppercase tracking-wider" style={{ color: 'var(--color-accent)' }}>
          {activeMode}
        </span>
      </div>

      <div className="flex items-center space-x-6 text-[11px] font-mono tracking-wide">
        <span>{weather.temperature}°C {weather.condition}</span>
        <span className="opacity-40">|</span>
        <span>CPU {systemHealth.cpuUsage}%</span>
        <span>RAM {systemHealth.ramUsage}%</span>
        <span className="opacity-40">|</span>
        <button
          onClick={toggleColorMode}
          title="Toggle Light / Dark Mode"
          className="flex items-center space-x-1 cursor-pointer hover:opacity-100"
          style={{ color: 'var(--color-accent)' }}
        >
          {colorMode === 'dark' ? <Sun size={12} /> : <Moon size={12} />}
          <span className="uppercase text-[10px]">{colorMode}</span>
        </button>
      </div>
    </header>
  );
};
