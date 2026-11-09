import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { ShieldCheck, Activity, Cpu, HardDrive, Radio, CheckCircle, Sun, Moon, Settings } from 'lucide-react';

export const ObsidianHeader: React.FC = () => {
  const { systemHealth, activeMode, weather, colorMode, toggleColorMode, setIsSettingsOpen } = useDashboard();
  const isLight = colorMode === 'light';

  return (
    <header className={`w-full px-8 py-2.5 border-b flex items-center justify-between text-xs font-mono select-none z-30 transition-colors ${
      isLight
        ? 'bg-white/90 text-slate-900 border-slate-200 shadow-xs'
        : 'bg-transparent text-[#eef0f3] border-white/[0.12]'
    }`}>
      {/* Title & Mode Status */}
      <div className="flex items-center space-x-3">
        <div className={`flex items-center space-x-2 border-r pr-4 ${isLight ? 'border-slate-200' : 'border-white/[0.12]'}`}>
          <div
            className="w-2 h-2 rounded-none animate-pulse"
            style={{
              backgroundColor: 'var(--color-accent, #5fd49b)',
              boxShadow: '0 0 8px var(--color-glow, rgba(95,212,155,0.6))',
            }}
          />
          <span className={`font-bold tracking-widest text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>SMART DISPLAY</span>
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
          <span className={isLight ? 'text-slate-300' : 'text-[#54565e]'}>|</span>
          <span className={`text-[11px] tracking-wide ${isLight ? 'text-slate-600' : 'text-[#9a9da6]'}`}>
            FACET INTERFACE
          </span>
        </div>
      </div>

      {/* Hardware & Environment Telemetry */}
      <div className={`flex items-center space-x-6 text-xs ${isLight ? 'text-slate-600' : 'text-[#9a9da6]'}`}>
        <div className="flex items-center space-x-1.5">
          <Activity size={13} style={{ color: 'var(--color-accent, #5fd49b)' }} />
          <span className={isLight ? 'text-slate-400' : 'text-[#54565e]'}>WEATHER:</span>
          <span className={`font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>{weather.temperature}°C ({weather.condition})</span>
        </div>

        <span className={isLight ? 'text-slate-300' : 'text-white/[0.08]'}>/</span>

        <div className="flex items-center space-x-1.5">
          <Cpu size={13} className={isLight ? 'text-slate-600' : 'text-[#9a9da6]'} />
          <span className={isLight ? 'text-slate-400' : 'text-[#54565e]'}>CPU:</span>
          <span className={`font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>{systemHealth.cpuUsage}%</span>
        </div>

        <span className={isLight ? 'text-slate-300' : 'text-white/[0.08]'}>/</span>

        <button
          onClick={toggleColorMode}
          title="Toggle Light / Dark Mode"
          className="flex items-center space-x-1.5 px-2 py-0.5 border cursor-pointer text-[10px] uppercase font-bold transition-all"
          style={{
            borderColor: 'var(--color-accent)',
            color: 'var(--color-accent)',
            backgroundColor: 'var(--theme-accent-soft)',
          }}
        >
          {colorMode === 'dark' ? <Sun size={11} /> : <Moon size={11} />}
          <span>{colorMode.toUpperCase()}</span>
        </button>

        <button
          onClick={() => setIsSettingsOpen(true)}
          title="Settings (Press 'S')"
          aria-label="Settings"
          className="p-1 border cursor-pointer transition-all hover:brightness-125"
          style={{
            borderColor: 'var(--color-accent)',
            color: 'var(--color-accent)',
            backgroundColor: 'var(--theme-accent-soft)',
          }}
        >
          <Settings size={12} />
        </button>
      </div>
    </header>
  );
};
