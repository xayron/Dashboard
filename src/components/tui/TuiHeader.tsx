import React from 'react';
import { Terminal, Shield, Wifi, ToggleLeft, ToggleRight, Settings } from 'lucide-react';
import { useDashboard } from '../../state/DashboardContext';

export const TuiHeader: React.FC = () => {
  const {
    activeMode,
    autoCalculatedMode,
    manualOverrideMode,
    setManualOverrideMode,
    systemHealth,
    uiStyle,
    toggleUiStyle,
    setIsSettingsOpen,
    now,
  } = useDashboard();

  const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

  return (
    <header className="w-full bg-black border-b border-emerald-500/40 px-6 py-2.5 flex items-center justify-between font-mono text-xs select-none z-40 text-emerald-400">
      {/* Left: Shell Prompt & Mode */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1.5 font-bold">
          <Terminal size={15} className="text-emerald-400" />
          <span>debjit@kiosk-1080p:~$</span>
        </div>

        <span className="text-emerald-500/50">|</span>

        <div className="flex items-center space-x-2">
          <span className="text-gray-400 uppercase">MODE:</span>
          <span className="px-2 py-0.5 bg-emerald-950/80 border border-emerald-500/40 font-bold uppercase text-emerald-300">
            [{activeMode}]
          </span>
          {manualOverrideMode && (
            <button
              onClick={() => setManualOverrideMode(null)}
              className="text-[10px] text-amber-400 hover:underline uppercase"
            >
              [RESET AUTO: {autoCalculatedMode}]
            </button>
          )}
        </div>
      </div>

      {/* Right: Telemetry, Style Toggle, Settings */}
      <div className="flex items-center space-x-4">
        {/* Style toggle pill */}
        <button
          onClick={toggleUiStyle}
          title="Toggle GUI / TUI Mode (Press 'T')"
          className="px-2.5 py-1 bg-emerald-950/90 hover:bg-emerald-900/60 border border-emerald-400 text-emerald-300 font-bold flex items-center space-x-1.5 transition-all"
        >
          <span>UI: [TUI ACTIVE]</span>
          <span className="text-[10px] text-gray-400 font-normal">(Press 'T')</span>
        </button>

        {/* HA Status */}
        <div className="flex items-center space-x-1.5">
          <span className="text-gray-400">HA:</span>
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
            systemHealth.haStatus === 'connected' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500' : 'bg-blue-950 text-blue-400 border border-blue-500'
          }`}>
            [{systemHealth.haStatus.toUpperCase()}]
          </span>
        </div>

        {/* Latency */}
        <div className="flex items-center space-x-1 text-gray-300">
          <Wifi size={13} className="text-emerald-400" />
          <span>{systemHealth.networkLatencyMs}ms</span>
        </div>

        {/* Clock */}
        <div className="text-white font-bold bg-white/5 px-2 py-0.5 border border-white/20">
          {timeFormatted} IST
        </div>

        {/* Settings button */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          title="Settings (Press 'S')"
          className="p-1 text-gray-400 hover:text-white transition-colors"
        >
          <Settings size={15} />
        </button>
      </div>
    </header>
  );
};
