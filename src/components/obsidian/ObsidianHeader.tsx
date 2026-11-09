import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { ShieldCheck, Activity, Cpu, HardDrive, Radio, CheckCircle } from 'lucide-react';

export const ObsidianHeader: React.FC = () => {
  const { systemHealth, activeMode, weather } = useDashboard();

  return (
    <header className="w-full bg-[#08080a] text-[#eef0f3] px-8 py-2.5 border-b border-white/[0.12] flex items-center justify-between text-xs font-mono select-none z-30">
      {/* Brand & Air-gap Status */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 border-r border-white/[0.12] pr-4">
          <div className="w-2 h-2 rounded-none bg-[#5fd49b] shadow-[0_0_8px_rgba(95,212,155,0.6)] animate-pulse" />
          <span className="font-bold tracking-widest text-[#eef0f3] text-sm">OBSIDIAN // OPS</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 text-[10px] bg-[#5fd49b]/10 border border-[#5fd49b]/30 text-[#5fd49b] font-medium tracking-wider">
            AIR-GAP SECURED
          </span>
          <span className="text-[#54565e]">|</span>
          <span className="text-[#9a9da6] text-[11px] tracking-wide">
            FACET://{activeMode.toUpperCase()}_STAGE
          </span>
        </div>
      </div>

      {/* Operator Rail & Telemetry */}
      <div className="flex items-center space-x-6 text-xs text-[#9a9da6]">
        <div className="flex items-center space-x-1.5">
          <Activity size={13} className="text-[#5fd49b]" />
          <span className="text-[#54565e]">ENV:</span>
          <span className="text-[#eef0f3] font-medium">{weather.temperature}°C ({weather.condition})</span>
        </div>

        <span className="text-white/[0.08]">/</span>

        <div className="flex items-center space-x-1.5">
          <Cpu size={13} className="text-[#9a9da6]" />
          <span className="text-[#54565e]">CPU:</span>
          <span className="text-[#eef0f3] font-medium">{systemHealth.cpuUsage}%</span>
        </div>

        <span className="text-white/[0.08]">/</span>

        <div className="flex items-center space-x-1.5">
          <HardDrive size={13} className="text-[#9a9da6]" />
          <span className="text-[#54565e]">MEM:</span>
          <span className="text-[#eef0f3] font-medium">{systemHealth.ramUsage}%</span>
        </div>

        <span className="text-white/[0.08]">/</span>

        <div className="flex items-center space-x-1.5">
          <Radio size={13} className={systemHealth.haStatus === 'connected' ? 'text-[#5fd49b]' : 'text-[#e3b341]'} />
          <span className="text-[#54565e]">HA LINK:</span>
          <span className="text-[#eef0f3] font-medium uppercase">{systemHealth.haStatus}</span>
        </div>

        <div className="hidden lg:flex items-center space-x-1.5 pl-2 border-l border-white/[0.12]">
          <ShieldCheck size={14} className="text-[#5fd49b]" />
          <span className="text-[10px] text-[#5fd49b] tracking-widest font-bold">HSM PROVEN</span>
        </div>
      </div>
    </header>
  );
};
