import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { ShieldAlert, Zap, Radio, Terminal, Sun, Moon } from 'lucide-react';

export const BrutalistHeader: React.FC = () => {
  const { systemHealth, activeMode, colorMode, toggleColorMode } = useDashboard();
  const isLight = colorMode === 'light';

  return (
    <header
      className={`w-full px-6 py-2.5 border-b-4 flex items-center justify-between z-30 select-none transition-colors ${
        isLight
          ? 'bg-white text-black border-black shadow-[0_4px_0px_#000]'
          : 'bg-black text-white border-white shadow-[0_4px_0px_#fff]'
      }`}
    >
      {/* Brand & Mode */}
      <div className="flex items-center space-x-3">
        <div
          className={`px-2.5 py-1 font-black text-xs uppercase tracking-widest border-2 ${
            isLight
              ? 'bg-black text-white border-black shadow-[2px_2px_0px_#000]'
              : 'bg-white text-black border-white shadow-[2px_2px_0px_#fff]'
          }`}
        >
          SMART DISPLAY
        </div>
        <div className="flex items-center space-x-1.5 font-black text-xs uppercase tracking-wide">
          <span>MODE:</span>
          <span
            className={`px-2 py-0.5 font-extrabold text-[11px] border-2 ${
              isLight ? 'border-black shadow-[2px_2px_0px_#000]' : 'border-white shadow-[2px_2px_0px_#fff]'
            }`}
            style={{
              backgroundColor: 'var(--color-accent, #facc15)',
              color: 'var(--color-accent-contrast, #000000)',
            }}
          >
            {activeMode.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Telemetry Pills */}
      <div className="flex items-center space-x-4 text-xs font-black">
        <div
          className={`flex items-center space-x-1.5 px-2.5 py-1 border-2 ${
            isLight
              ? 'bg-neutral-100 text-black border-black shadow-[2px_2px_0px_#000]'
              : 'bg-neutral-900 text-white border-white shadow-[2px_2px_0px_#fff]'
          }`}
        >
          <Zap size={13} style={{ color: 'var(--color-accent)' }} />
          <span>CPU {systemHealth.cpuUsage}%</span>
        </div>
        <div
          className={`flex items-center space-x-1.5 px-2.5 py-1 border-2 ${
            isLight
              ? 'bg-neutral-100 text-black border-black shadow-[2px_2px_0px_#000]'
              : 'bg-neutral-900 text-white border-white shadow-[2px_2px_0px_#fff]'
          }`}
        >
          <span>RAM {systemHealth.ramUsage}%</span>
        </div>
        <button
          onClick={toggleColorMode}
          title="Toggle Light / Dark Mode"
          className={`flex items-center space-x-1.5 px-2.5 py-1 border-2 cursor-pointer font-black transition-colors ${
            isLight
              ? 'bg-black text-white border-black hover:bg-neutral-800 shadow-[2px_2px_0px_#000]'
              : 'bg-white text-black border-white hover:bg-neutral-200 shadow-[2px_2px_0px_#fff]'
          }`}
        >
          {colorMode === 'dark' ? <Sun size={12} className="text-yellow-400" /> : <Moon size={12} className="text-indigo-600" />}
          <span className="text-[10px] uppercase">{colorMode.toUpperCase()}</span>
        </button>
      </div>
    </header>
  );
};
