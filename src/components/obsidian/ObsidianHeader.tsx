import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { ShieldCheck, Activity, Cpu, HardDrive, Radio, CheckCircle } from 'lucide-react';

export const ObsidianHeader: React.FC = () => {
  const { systemHealth, activeMode, weather } = useDashboard();

  return (
    <header className="w-full bg-[#050507] text-[#eef0f3] px-8 py-2.5 border-b border-white/[0.12] flex items-center justify-between text-xs font-mono select-none z-30">
      {/* Title & Mode Status */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 border-r border-white/[0.12] pr-4">
          <div
            className="w-2 h-2 rounded-none animate-pulse"
            style={{
              backgroundColor: 'var(--color-accent, #5fd49b)',
              boxShadow: '0 0 8px var(--color-glow, rgba(95,212,155,0.6))',
            }}
          />
          <span className="font-bold tracking-widest text-[#eef0f3] text-sm">SMART DISPLAY // 15.6"</span>
        </div>
        <div className="flex items-center space-x-2">
          <span
            className="px-2 py-0.5 text-[10px] font-medium tracking-wider border"
            style={{
              backgroundColor: 'var(--color-accent-soft, rgba(95,212,155,0.1))',
              borderColor: 'var(--color-accent, #5fd49b)',
              color: 'var(--color-accent, #5fd49b)',
            }}
          >
            {activeMode.toUpperCase()} MODE
          </span>
          <span className="text-[#54565e]">|</span>
          <span className="text-[#9a9da6] text-[11px] tracking-wide">
            FACET INTERFACE
          </span>
        </div>
      </div>

      {/* Hardware & Environment Telemetry */}
      <div className="flex items-center space-x-6 text-xs text-[#9a9da6]">
        <div className="flex items-center space-x-1.5">
          <Activity size={13} style={{ color: 'var(--color-accent, #5fd49b)' }} />
          <span className="text-[#54565e]">WEATHER:</span>
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
          <span className="text-[#54565e]">RAM:</span>
          <span className="text-[#eef0f3] font-medium">{systemHealth.ramUsage}%</span>
        </div>

        <span className="text-white/[0.08]">/</span>

        <div className="flex items-center space-x-1.5">
          <Radio size={13} style={{ color: systemHealth.haStatus === 'connected' ? 'var(--color-accent, #5fd49b)' : '#e3b341' }} />
          <span className="text-[#54565e]">HOME ASSISTANT:</span>
          <span className="text-[#eef0f3] font-medium uppercase">{systemHealth.haStatus}</span>
        </div>

        <div className="hidden lg:flex items-center space-x-1.5 pl-2 border-l border-white/[0.12]">
          <ShieldCheck size={14} style={{ color: 'var(--color-accent, #5fd49b)' }} />
          <span style={{ color: 'var(--color-accent, #5fd49b)' }} className="text-[10px] tracking-widest font-bold">SYSTEM ONLINE</span>
        </div>
      </div>
    </header>
  );
};
