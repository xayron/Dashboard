import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Crosshair, Cpu, Wifi, Activity } from 'lucide-react';

export const HudHeader: React.FC = () => {
  const { systemHealth, activeMode, weather } = useDashboard();

  return (
    <header className="w-full bg-[#030712] border-b border-cyan-500/40 px-6 py-2.5 flex items-center justify-between text-xs font-mono text-cyan-300 z-30 select-none shadow-[0_4px_15px_rgba(0,240,255,0.08)]">
      {/* System Identification */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1.5 px-2 py-0.5 bg-cyan-950/60 border border-cyan-500/50 text-cyan-400 font-bold text-[11px]">
          <Crosshair size={13} className="animate-spin-slow" />
          <span>CYBERDECK//V4.2</span>
        </div>
        <div className="text-gray-400 text-[11px]">
          NODE: <span className="text-white font-bold">ALPHA-15</span>
        </div>
        <div className="text-gray-400 text-[11px]">
          MODE: <span className="text-amber-400 font-bold uppercase">[{activeMode}]</span>
        </div>
      </div>

      {/* Center Radar Coordinates */}
      <div className="hidden md:flex items-center space-x-2 text-[10px] text-cyan-500/80">
        <span>LOC://19.0760°N,72.8777°E</span>
        <span>•</span>
        <span className="text-cyan-300">{weather.temperature}°C {weather.condition.toUpperCase()}</span>
      </div>

      {/* Telemetry Readouts */}
      <div className="flex items-center space-x-4 text-[11px]">
        <div className="flex items-center space-x-1 text-cyan-300">
          <Cpu size={12} />
          <span>CPU:{systemHealth.cpuUsage}%</span>
        </div>
        <div className="flex items-center space-x-1 text-cyan-300">
          <Activity size={12} />
          <span>RAM:{systemHealth.ramUsage}%</span>
        </div>
        <div className="flex items-center space-x-1 px-2 py-0.5 bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
          <Wifi size={11} className="animate-pulse" />
          <span>HA://LINKED</span>
        </div>
      </div>
    </header>
  );
};
