import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Radio } from 'lucide-react';

export const NeumorphicHeader: React.FC = () => {
  const { systemHealth, activeMode, weather } = useDashboard();

  return (
    <header className="w-full bg-[#1a1d24] text-neutral-300 px-8 py-3 flex items-center justify-between text-xs select-none z-30 shadow-[0_4px_12px_#101217]">
      <div className="flex items-center space-x-3">
        <div className="px-3 py-1 rounded-xl bg-[#1a1d24] shadow-[inset_2px_2px_5px_#101217,inset_-2px_-2px_5px_#242831] font-bold text-white tracking-wider text-[11px] uppercase">
          TACTILE DISPLAY 15.6
        </div>
        <span className="text-neutral-500 font-medium">/</span>
        <span className="text-blue-400 font-semibold uppercase tracking-wider text-[11px]">
          {activeMode}
        </span>
      </div>

      <div className="flex items-center space-x-4 text-xs">
        <div className="px-3 py-1 rounded-xl bg-[#1a1d24] shadow-[3px_3px_6px_#101217,-3px_-3px_6px_#242831] font-medium text-neutral-200">
          {weather.temperature}°C {weather.condition}
        </div>
        <div className="px-3 py-1 rounded-xl bg-[#1a1d24] shadow-[3px_3px_6px_#101217,-3px_-3px_6px_#242831] font-mono text-neutral-400">
          CPU {systemHealth.cpuUsage}% • RAM {systemHealth.ramUsage}%
        </div>
        <div className="px-3 py-1 rounded-xl bg-[#1a1d24] shadow-[3px_3px_6px_#101217,-3px_-3px_6px_#242831] text-emerald-400 font-medium flex items-center">
          <Radio size={12} className="mr-1.5 animate-pulse" />
          <span>HA {systemHealth.haStatus.toUpperCase()}</span>
        </div>
      </div>
    </header>
  );
};
