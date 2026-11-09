import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { FileCheck, Shield, Database, Radio, Activity, CheckSquare } from 'lucide-react';

export const CivicHeader: React.FC = () => {
  const { systemHealth, activeMode, weather } = useDashboard();

  return (
    <header className="w-full bg-[#070b14] text-[#f8fafc] px-8 py-2.5 border-b border-slate-700/60 flex items-center justify-between text-xs font-sans select-none z-30">
      {/* Brand & Verification Stamp */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 border-r border-slate-700/60 pr-4">
          <div className="w-2.5 h-2.5 bg-amber-500 rounded-sm shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
          <span className="font-extrabold tracking-tight text-white text-sm">ANDHBHAKT.ORG</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase">
            CIVIC AUDIT
          </span>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
          <span className="text-emerald-400 font-semibold flex items-center space-x-1">
            <FileCheck size={13} />
            <span>CAG AUDITED</span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-300">PUBLIC ARCHIVE #{activeMode.toUpperCase()}</span>
        </div>
      </div>

      {/* Audit Telemetry & Host Health */}
      <div className="flex items-center space-x-6 text-xs text-slate-400 font-mono">
        <div className="flex items-center space-x-1.5">
          <Activity size={13} className="text-emerald-400" />
          <span className="text-slate-500">IMD:</span>
          <span className="text-slate-200 font-medium">{weather.temperature}°C ({weather.condition})</span>
        </div>

        <span className="text-slate-700">|</span>

        <div className="flex items-center space-x-1.5">
          <Database size={13} className="text-slate-400" />
          <span className="text-slate-500">CPU:</span>
          <span className="text-slate-200 font-medium">{systemHealth.cpuUsage}%</span>
        </div>

        <span className="text-slate-700">|</span>

        <div className="flex items-center space-x-1.5">
          <Radio size={13} className={systemHealth.haStatus === 'connected' ? 'text-emerald-400' : 'text-amber-400'} />
          <span className="text-slate-500">HA LINK:</span>
          <span className="text-slate-200 font-medium uppercase">{systemHealth.haStatus}</span>
        </div>

        <div className="hidden lg:flex items-center space-x-1.5 pl-3 border-l border-slate-700/60">
          <span className="px-2 py-0.5 text-[10px] bg-emerald-950/40 text-emerald-300 border border-emerald-500/40 font-bold uppercase tracking-wider">
            100% OPEN SOURCE
          </span>
        </div>
      </div>
    </header>
  );
};
