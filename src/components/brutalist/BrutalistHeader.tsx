import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { ShieldAlert, Zap, Radio, Terminal } from 'lucide-react';

export const BrutalistHeader: React.FC = () => {
  const { systemHealth, activeMode, uiStyle, toggleUiStyle } = useDashboard();

  return (
    <header
      className="w-full text-black px-6 py-2 border-b-4 border-black flex items-center justify-between z-30 select-none shadow-[0_4px_0px_#000]"
      style={{ backgroundColor: 'var(--color-accent, #facc15)' }}
    >
      {/* Brand & Mode */}
      <div className="flex items-center space-x-3">
        <div className="px-2.5 py-1 bg-black text-white font-black text-xs uppercase tracking-widest border border-black shadow-[2px_2px_0px_#fff]">
          DISPLAY//15.6&quot;
        </div>
        <div className="flex items-center space-x-1.5 font-black text-xs uppercase tracking-wide">
          <span>MODE:</span>
          <span className="px-2 py-0.5 bg-black text-yellow-300 font-extrabold text-[11px]">
            {activeMode.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Telemetry Pills */}
      <div className="flex items-center space-x-4 text-xs font-black">
        <div className="flex items-center space-x-1.5 bg-white px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_#000]">
          <Zap size={13} className="text-black" />
          <span>CPU {systemHealth.cpuUsage}%</span>
        </div>
        <div className="flex items-center space-x-1.5 bg-white px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_#000]">
          <span>RAM {systemHealth.ramUsage}%</span>
        </div>
        <div className="flex items-center space-x-1.5 bg-black text-white px-2 py-0.5 border border-black">
          <Radio size={12} className="text-green-400 animate-pulse" />
          <span>HA: {systemHealth.haStatus.toUpperCase()}</span>
        </div>
      </div>
    </header>
  );
};
