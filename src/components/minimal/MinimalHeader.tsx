import React from 'react';
import { useDashboard } from '../../state/DashboardContext';

export const MinimalHeader: React.FC = () => {
  const { systemHealth, activeMode, weather } = useDashboard();

  return (
    <header className="w-full px-10 py-3 border-b border-white/10 flex items-center justify-between text-xs text-neutral-400 select-none bg-black/60 backdrop-blur-sm z-30">
      <div className="flex items-center space-x-3">
        <span className="text-white font-medium tracking-widest text-[11px] uppercase">
          Kiosk 15.6
        </span>
        <span className="text-neutral-600">/</span>
        <span className="text-neutral-300 font-light uppercase tracking-wider">
          {activeMode}
        </span>
      </div>

      <div className="flex items-center space-x-6 text-[11px] font-mono tracking-wide">
        <span>{weather.temperature}°C {weather.condition}</span>
        <span className="text-neutral-700">|</span>
        <span>CPU {systemHealth.cpuUsage}%</span>
        <span>RAM {systemHealth.ramUsage}%</span>
        <span className="text-neutral-700">|</span>
        <span className="flex items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block mr-1.5" />
          HA {systemHealth.haStatus}
        </span>
      </div>
    </header>
  );
};
