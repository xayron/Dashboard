import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Newspaper, Activity, Database, Radio, Sun, Moon } from 'lucide-react';

export const CivicHeader: React.FC = () => {
  const { systemHealth, activeMode, weather, colorMode, toggleColorMode } = useDashboard();
  const isLight = colorMode === 'light';

  return (
    <header className={`w-full px-8 py-2.5 border-b-2 relative select-none z-30 shadow-md ${
      isLight ? 'bg-slate-100 text-slate-900 border-slate-300' : 'bg-[#0f172a] text-white border-slate-700'
    }`}>
      {/* Tricolor Institutional Accent Line */}
      <div
        className="absolute top-0 inset-x-0 h-1"
        style={{
          background: 'linear-gradient(to right, var(--color-accent, #f97316), white, #16a34a)',
        }}
      />

      <div className="flex items-center justify-between">
        {/* Brand & Verification Stamp */}
        <div className="flex items-center space-x-3">
          <div className={`flex items-center space-x-2 border-r pr-4 ${isLight ? 'border-slate-300' : 'border-slate-700'}`}>
            <span
              className="px-2 py-0.5 text-xs font-black text-slate-950 rounded uppercase tracking-wider"
              style={{ backgroundColor: 'var(--color-accent, #f97316)' }}
            >
              PUBLIC GAZETTE
            </span>
            <span className={`font-bold tracking-tight text-sm ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
              DAILY REPORT
            </span>
          </div>

          <div className={`flex items-center space-x-2 text-xs font-mono ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
            <span className={`px-2 py-0.5 rounded flex items-center space-x-1 font-semibold border ${
              isLight ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-emerald-900/60 text-emerald-300 border-emerald-500/50'
            }`}>
              <Newspaper size={13} />
              <span>EDITION 15.6"</span>
            </span>
            <span className={isLight ? 'text-slate-400' : 'text-slate-500'}>•</span>
            <span
              className="font-bold uppercase tracking-wider"
              style={{ color: 'var(--color-accent, #f97316)' }}
            >
              {activeMode.toUpperCase()} VIEW
            </span>
          </div>
        </div>

        {/* System Telemetry & Status */}
        <div className={`flex items-center space-x-5 text-xs font-mono ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
          <div className="flex items-center space-x-1.5">
            <Activity size={13} style={{ color: 'var(--color-accent, #f97316)' }} />
            <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>WEATHER:</span>
            <span className="font-semibold">{weather.temperature}°C ({weather.condition})</span>
          </div>

          <span className={isLight ? 'text-slate-300' : 'text-slate-600'}>|</span>

          <div className="flex items-center space-x-1.5">
            <Database size={13} className={isLight ? 'text-slate-500' : 'text-slate-400'} />
            <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>CPU:</span>
            <span className="font-semibold">{systemHealth.cpuUsage}%</span>
          </div>

          <span className={isLight ? 'text-slate-300' : 'text-slate-600'}>|</span>

          <div className="flex items-center space-x-1.5">
            <Radio size={13} className={systemHealth.haStatus === 'connected' ? 'text-emerald-500' : 'text-amber-500'} />
            <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>HA:</span>
            <span className="font-semibold uppercase">{systemHealth.haStatus}</span>
          </div>

          <div className={`flex items-center space-x-2 pl-3 border-l ${isLight ? 'border-slate-300' : 'border-slate-700'}`}>
            <button
              onClick={toggleColorMode}
              className={`flex items-center space-x-1 px-2.5 py-1 text-[11px] font-bold rounded border transition-colors ${
                isLight
                  ? 'bg-white hover:bg-slate-200 text-slate-800 border-slate-300'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-600'
              }`}
              title="Toggle Light / Dark mode (or press 'D')"
            >
              {isLight ? <Moon size={12} className="text-indigo-600" /> : <Sun size={12} className="text-amber-400" />}
              <span className="uppercase">{isLight ? 'DARK' : 'LIGHT'}</span>
            </button>
            <span className={`hidden lg:inline-block px-2 py-0.5 text-[10px] font-extrabold uppercase rounded shadow-sm ${
              isLight ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
            }`}>
              SYSTEM ONLINE
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
