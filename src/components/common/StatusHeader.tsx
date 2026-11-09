import React from 'react';
import {
  Wifi,
  Settings,
  Flame,
  Moon,
  Sun,
  Camera,
  Server,
  Layers,
} from 'lucide-react';
import { useDashboard } from '../../state/DashboardContext';

export const StatusHeader: React.FC = () => {
  const {
    activeMode,
    autoCalculatedMode,
    manualOverrideMode,
    setManualOverrideMode,
    systemHealth,
    setIsSettingsOpen,
    toggleKioskBar,
    isKioskBarVisible,
    colorMode,
    toggleColorMode,
  } = useDashboard();

  const isLight = colorMode === 'light';

  const getModeInfo = () => {
    switch (activeMode) {
      case 'race':
        return {
          label: 'Race Weekend Mode',
          icon: <Flame size={14} className="text-red-500 animate-pulse" />,
          color: isLight
            ? 'border-red-400 bg-red-50 text-red-700'
            : 'border-red-500/40 bg-red-950/40 text-red-300',
        };
      case 'evening':
        return {
          label: 'Evening Mode',
          icon: <Moon size={14} className={isLight ? 'text-purple-600' : 'text-purple-400'} />,
          color: isLight
            ? 'border-purple-300 bg-purple-50 text-purple-700'
            : 'border-purple-500/40 bg-purple-950/40 text-purple-300',
        };
      case 'morning':
        return {
          label: 'Morning Mode',
          icon: <Sun size={14} className={isLight ? 'text-amber-600' : 'text-amber-400'} />,
          color: isLight
            ? 'border-amber-300 bg-amber-50 text-amber-800'
            : 'border-amber-500/40 bg-amber-950/40 text-amber-300',
        };
      case 'ambient':
      default:
        return {
          label: 'Ambient Mode',
          icon: <Camera size={14} className={isLight ? 'text-emerald-600' : 'text-emerald-400'} />,
          color: isLight
            ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
            : 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300',
        };
    }
  };

  const modeInfo = getModeInfo();

  return (
    <header className="w-full flex items-center justify-between px-6 py-3.5 z-40 select-none">
      {/* Left: Mode Badge & Auto Indicator */}
      <div className="flex items-center space-x-3">
        <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-md ${modeInfo.color}`}>
          {modeInfo.icon}
          <span>{modeInfo.label}</span>
          {manualOverrideMode && (
            <span className="text-[10px] px-1.5 py-0.2 bg-white/20 rounded-full font-mono uppercase">
              Manual Override
            </span>
          )}
        </div>

        {manualOverrideMode && (
          <button
            onClick={() => setManualOverrideMode(null)}
            className="text-[11px] text-gray-400 hover:text-white underline px-1 transition-colors"
          >
            Reset to Auto ({autoCalculatedMode})
          </button>
        )}
      </div>

      {/* Right: HA Status, Latency & Controls */}
      <div className="flex items-center space-x-3">
        {/* Home Assistant Status */}
        <div className="flex items-center space-x-1.5 text-xs text-gray-300 glass-pill px-3 py-1 rounded-full">
          <Server size={13} className={systemHealth.haStatus === 'connected' ? 'text-green-400' : 'text-blue-400'} />
          <span className="font-medium">
            HA: {systemHealth.haStatus === 'connected' ? 'Online' : 'Simulated'}
          </span>
          <span className={`w-2 h-2 rounded-full ${systemHealth.haStatus === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-blue-400'}`} />
        </div>

        {/* Network Latency */}
        <div className="flex items-center space-x-1 text-xs text-gray-400 glass-pill px-2.5 py-1 rounded-full font-mono-numbers">
          <Wifi size={13} className="text-gray-400" />
          <span>{systemHealth.networkLatencyMs}ms</span>
        </div>

        {/* Quick Kiosk Control Toggle */}
        <button
          onClick={toggleKioskBar}
          title="Toggle Kiosk Controls (Press 'M')"
          className={`p-2 rounded-xl transition-all border ${
            isKioskBarVisible ? '' : 'glass-pill text-gray-300 hover:text-white border-transparent'
          }`}
          style={isKioskBarVisible ? {
            backgroundColor: 'var(--theme-accent-soft)',
            borderColor: 'var(--color-accent)',
            color: 'var(--color-accent)',
          } : undefined}
        >
          <Layers size={16} />
        </button>

        {/* Light / Dark Mode Toggle */}
        <button
          onClick={toggleColorMode}
          title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode (Press 'D')`}
          className="p-2 rounded-xl glass-pill text-gray-300 hover:text-white transition-all flex items-center justify-center"
        >
          {isLight ? <Moon size={16} className="text-purple-600" /> : <Sun size={16} className="text-amber-400" />}
        </button>

        {/* Settings Button */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          title="Settings (Press 'S')"
          className="p-2 rounded-xl glass-pill text-gray-300 hover:text-white hover:border-white/30 transition-all"
        >
          <Settings size={16} />
        </button>
      </div>
    </header>
  );
};
