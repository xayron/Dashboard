import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Newspaper, Activity, Database, Radio, CheckCircle } from 'lucide-react';

export const CivicHeader: React.FC = () => {
  const { systemHealth, activeMode, weather } = useDashboard();

  return (
    <header className="w-full bg-[#0f172a] text-white px-8 py-2.5 border-b-2 border-slate-300 relative select-none z-30 shadow-md">
      {/* Tricolor Institutional Accent Line */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#f97316] via-white to-[#16a34a]" />

      <div className="flex items-center justify-between">
        {/* Brand & Verification Stamp */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 border-r border-slate-700 pr-4">
            <span className="px-2 py-0.5 text-xs font-black bg-[#f97316] text-slate-950 rounded uppercase tracking-wider">
              PUBLIC GAZETTE
            </span>
            <span className="font-bold tracking-tight text-slate-200 text-sm">
              DAILY REPORT
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-300 font-mono">
            <span className="px-2 py-0.5 bg-emerald-900/60 text-emerald-300 border border-emerald-500/50 rounded flex items-center space-x-1 font-semibold">
              <Newspaper size={13} />
              <span>EDITION 15.6"</span>
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-amber-400 font-bold uppercase tracking-wider">
              {activeMode.toUpperCase()} VIEW
            </span>
          </div>
        </div>

        {/* System Telemetry & Status */}
        <div className="flex items-center space-x-6 text-xs text-slate-300 font-mono">
          <div className="flex items-center space-x-1.5">
            <Activity size={13} className="text-[#f97316]" />
            <span className="text-slate-400">WEATHER:</span>
            <span className="text-white font-semibold">{weather.temperature}°C ({weather.condition})</span>
          </div>

          <span className="text-slate-600">|</span>

          <div className="flex items-center space-x-1.5">
            <Database size={13} className="text-slate-400" />
            <span className="text-slate-400">CPU:</span>
            <span className="text-white font-semibold">{systemHealth.cpuUsage}%</span>
          </div>

          <span className="text-slate-600">|</span>

          <div className="flex items-center space-x-1.5">
            <Radio size={13} className={systemHealth.haStatus === 'connected' ? 'text-emerald-400' : 'text-amber-400'} />
            <span className="text-slate-400">HOME ASSISTANT:</span>
            <span className="text-white font-semibold uppercase">{systemHealth.haStatus}</span>
          </div>

          <div className="hidden lg:flex items-center space-x-1.5 pl-3 border-l border-slate-700">
            <span className="px-2 py-0.5 text-[10px] bg-white text-slate-900 font-extrabold uppercase rounded shadow-sm">
              SYSTEM ONLINE
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
