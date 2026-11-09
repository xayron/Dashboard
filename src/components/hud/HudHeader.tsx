import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Crosshair, Cpu, Wifi, Activity, Sun, Moon } from 'lucide-react';

export const HudHeader: React.FC = () => {
  const { systemHealth, activeMode, weather, colorMode, toggleColorMode } = useDashboard();

  return (
    <header
      className="w-full bg-transparent border-b px-6 py-2.5 flex items-center justify-between text-xs font-mono z-30 select-none"
      style={{
        borderColor: 'var(--theme-accent-soft)',
        color: 'var(--color-accent)',
      }}
    >
      {/* System Identification */}
      <div className="flex items-center space-x-3">
        <div
          className="flex items-center space-x-1.5 px-2 py-0.5 border font-bold text-[11px]"
          style={{
            backgroundColor: 'var(--theme-accent-soft)',
            borderColor: 'var(--color-accent)',
            color: 'var(--color-accent)',
          }}
        >
          <Crosshair size={13} className="animate-spin-slow" />
          <span>CYBERDECK//V4.2</span>
        </div>
        <div className="text-gray-400 text-[11px]">
          NODE: <span className="font-bold" style={{ color: 'var(--color-accent)' }}>ALPHA-15</span>
        </div>
        <div className="text-gray-400 text-[11px]">
          MODE: <span className="font-bold uppercase">[{activeMode}]</span>
        </div>
      </div>

      {/* Center Radar Coordinates */}
      <div className="hidden md:flex items-center space-x-2 text-[10px] opacity-80">
        <span>LOC://19.0760°N,72.8777°E</span>
        <span>•</span>
        <span>{weather.temperature}°C {weather.condition.toUpperCase()}</span>
      </div>

      {/* Telemetry Readouts */}
      <div className="flex items-center space-x-4 text-[11px]">
        <div className="flex items-center space-x-1">
          <Cpu size={12} />
          <span>CPU:{systemHealth.cpuUsage}%</span>
        </div>
        <div className="flex items-center space-x-1">
          <Activity size={12} />
          <span>RAM:{systemHealth.ramUsage}%</span>
        </div>
        <button
          onClick={toggleColorMode}
          title="Toggle Light / Dark HUD (Press 'D')"
          className="flex items-center space-x-1 px-2 py-0.5 border text-[10px] font-bold cursor-pointer"
          style={{
            backgroundColor: 'var(--theme-accent-soft)',
            borderColor: 'var(--color-accent)',
            color: 'var(--color-accent)',
          }}
        >
          {colorMode === 'dark' ? <Sun size={11} /> : <Moon size={11} />}
          <span>{colorMode.toUpperCase()}</span>
        </button>
      </div>
    </header>
  );
};
