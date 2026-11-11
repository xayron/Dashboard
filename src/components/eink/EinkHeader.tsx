import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { BookOpen, Sun, Moon, Settings, Maximize2 } from 'lucide-react';

export const EinkHeader: React.FC = () => {
  const { systemHealth, activeMode, weather, colorMode, toggleColorMode, setIsSettingsOpen, toggleKioskMode } = useDashboard();

  return (
    <header className="w-full bg-[#ede8df] text-[#1c1917] px-8 py-2.5 border-b-2 border-stone-800 flex items-center justify-between text-xs font-serif select-none z-30">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1.5 font-bold tracking-widest uppercase text-sm border-r-2 border-stone-800 pr-3">
          <BookOpen size={15} style={{ color: 'var(--color-accent)' }} />
          <span>The Daily Chronicle</span>
        </div>
        <span className="italic text-stone-600">Editorial Edition • {activeMode.toUpperCase()} VIEW</span>
      </div>

      <div className="flex items-center space-x-5 text-xs font-serif">
        <span>Temp: <strong>{weather.temperature}°C</strong> ({weather.condition})</span>
        <span className="text-stone-400">§</span>
        <span>CPU: <strong>{systemHealth.cpuUsage}%</strong></span>
        <span>RAM: <strong>{systemHealth.ramUsage}%</strong></span>
        <span className="text-stone-400">§</span>
        <button
          onClick={toggleColorMode}
          title="Toggle Inverted / Parchment E-Ink"
          className="px-2 py-0.5 border border-stone-800 cursor-pointer font-sans text-[10px] font-bold uppercase flex items-center space-x-1"
          style={{ borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}
        >
          {colorMode === 'dark' ? <Moon size={10} /> : <Sun size={10} />}
          <span>{colorMode === 'dark' ? 'DARK INK' : 'LIGHT INK'}</span>
        </button>
        <button
          onClick={toggleKioskMode}
          title="Enter Kiosk Mode (Press 'K')"
          aria-label="Enter Kiosk Mode"
          className="p-1 border border-stone-800 cursor-pointer hover:bg-stone-300 transition-colors"
          style={{ borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}
        >
          <Maximize2 size={12} />
        </button>
        <button
          onClick={() => setIsSettingsOpen(true)}
          title="Settings (Press 'S')"
          aria-label="Settings"
          className="p-1 border border-stone-800 cursor-pointer hover:bg-stone-300 transition-colors"
          style={{ borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}
        >
          <Settings size={12} />
        </button>
      </div>
    </header>
  );
};
