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
    colorMode,
    toggleColorMode,
  } = useDashboard();

  const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

  return (
    <header
      className="w-full bg-transparent px-6 py-2.5 flex items-center justify-between font-mono text-xs select-none z-40 border-b"
      style={{
        borderColor: 'var(--color-accent, #10b981)',
        color: 'var(--color-accent, #10b981)',
      }}
    >
      {/* Left: Shell Prompt & Mode */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1.5 font-bold">
          <Terminal size={15} style={{ color: 'var(--color-accent, #10b981)' }} />
          <span>debjit@kiosk-1080p:~$</span>
        </div>

        <span className="opacity-40">|</span>

        <div className="flex items-center space-x-2">
          <span className="text-gray-400 uppercase">MODE:</span>
          <span
            className="px-2 py-0.5 font-bold uppercase border"
            style={{
              backgroundColor: 'var(--color-accent-soft, rgba(16, 185, 129, 0.15))',
              borderColor: 'var(--color-accent, #10b981)',
              color: 'var(--color-accent, #10b981)',
            }}
          >
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

        {/* Light / Dark Mode Toggle */}
        <button
          onClick={toggleColorMode}
          title="Toggle Light / Dark Mode (Press 'D')"
          className="px-2 py-0.5 border text-[10px] font-bold"
          style={{ borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}
        >
          [{colorMode === 'dark' ? 'DARK' : 'LIGHT'}]
        </button>

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
