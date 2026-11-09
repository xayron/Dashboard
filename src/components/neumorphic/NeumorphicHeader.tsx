import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Radio, Sun, Moon } from 'lucide-react';

export const NeumorphicHeader: React.FC = () => {
  const { systemHealth, activeMode, weather, colorMode, toggleColorMode } = useDashboard();

  return (
    <header className="w-full bg-transparent text-neutral-300 px-8 py-3 flex items-center justify-between text-xs select-none z-30">
      <div className="flex items-center space-x-3">
        <div className="px-3 py-1 rounded-xl bg-[#1a1d24] shadow-[inset_2px_2px_5px_#101217,inset_-2px_-2px_5px_#242831] font-bold tracking-wider text-[11px] uppercase">
          TACTILE DISPLAY
        </div>
        <span className="opacity-40 font-medium">/</span>
        <span className="font-semibold uppercase tracking-wider text-[11px]" style={{ color: 'var(--color-accent)' }}>
          {activeMode}
        </span>
      </div>

      <div className="flex items-center space-x-4 text-xs">
        <div className="px-3 py-1 rounded-xl bg-[#1a1d24] shadow-[3px_3px_6px_#101217,-3px_-3px_6px_#242831] font-medium">
          {weather.temperature}°C {weather.condition}
        </div>
        <div className="px-3 py-1 rounded-xl bg-[#1a1d24] shadow-[3px_3px_6px_#101217,-3px_-3px_6px_#242831] font-mono opacity-80">
          CPU {systemHealth.cpuUsage}% • RAM {systemHealth.ramUsage}%
        </div>
        <button
          onClick={toggleColorMode}
          title="Toggle Neumorphic Light / Dark Mode"
          className="px-3 py-1 rounded-xl bg-[#1a1d24] shadow-[3px_3px_6px_#101217,-3px_-3px_6px_#242831] hover:shadow-[inset_2px_2px_4px_#101217,inset_-2px_-2px_4px_#242831] font-bold text-[11px] uppercase flex items-center space-x-1 cursor-pointer"
          style={{ color: 'var(--color-accent)' }}
        >
          {colorMode === 'dark' ? <Sun size={12} /> : <Moon size={12} />}
          <span>{colorMode.toUpperCase()}</span>
        </button>
      </div>
    </header>
  );
};
