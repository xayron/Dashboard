import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Sparkles, Radio } from 'lucide-react';

export const RetrowaveHeader: React.FC = () => {
  const { systemHealth, activeMode, weather } = useDashboard();

  return (
    <header className="w-full bg-[#0c0317] border-b-2 border-fuchsia-500/60 shadow-[0_0_20px_rgba(255,42,133,0.3)] px-8 py-2.5 flex items-center justify-between text-xs font-mono text-cyan-300 select-none z-30">
      <div className="flex items-center space-x-3">
        <div className="px-2.5 py-0.5 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white font-black text-xs tracking-widest uppercase border border-pink-400 shadow-[0_0_10px_#ff2a85]">
          SYNTHWAVE//1984
        </div>
        <span className="text-pink-400 font-bold uppercase tracking-wider">
          MODE: {activeMode}
        </span>
      </div>

      <div className="flex items-center space-x-5 text-xs">
        <span className="text-cyan-400 font-bold">{weather.temperature}°C {weather.condition.toUpperCase()}</span>
        <span className="text-fuchsia-500">◆</span>
        <span>CPU {systemHealth.cpuUsage}%</span>
        <span>RAM {systemHealth.ramUsage}%</span>
        <span className="text-fuchsia-500">◆</span>
        <span className="text-pink-400 font-bold flex items-center">
          <Radio size={12} className="mr-1 text-pink-400 animate-pulse" />
          HA: {systemHealth.haStatus.toUpperCase()}
        </span>
      </div>
    </header>
  );
};
