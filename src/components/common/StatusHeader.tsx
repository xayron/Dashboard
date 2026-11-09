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
  Newspaper,
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
      case 'news':
        return {
          label: 'News Mode',
          icon: <Newspaper size={14} className={isLight ? 'text-blue-600' : 'text-blue-400'} />,
          color: isLight
            ? 'border-blue-300 bg-blue-50 text-blue-800'
            : 'border-blue-500/40 bg-blue-950/40 text-blue-300',
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
            className={`text-[11px] underline px-1 transition-colors ${
              isLight ? 'text-slate-600 hover:text-slate-900' : 'text-gray-400 hover:text-white'
            }`}
          >
            Reset to Auto ({autoCalculatedMode})
          </button>
        )}
      </div>

      {/* Right: HA Status, Latency & Controls */}
      <div className="flex items-center space-x-3">
        {/* Home Assistant Status */}
        <div
          className={`flex items-center space-x-1.5 text-xs glass-pill px-3 py-1 rounded-full ${
            isLight ? 'text-slate-700' : 'text-gray-300'
          }`}
        >
          <Server size={13} className={systemHealth.haStatus === 'connected' ? 'text-green-500' : isLight ? 'text-blue-600' : 'text-blue-400'} />
          <span className="font-medium">
            HA: {systemHealth.haStatus === 'connected' ? 'Online' : 'Simulated'}
          </span>
          <span className={`w-2 h-2 rounded-full ${systemHealth.haStatus === 'connected' ? 'bg-green-500 animate-pulse' : isLight ? 'bg-blue-500' : 'bg-blue-400'}`} />
        </div>

        {/* Network Latency */}
        <div
          className={`flex items-center space-x-1 text-xs glass-pill px-2.5 py-1 rounded-full font-mono-numbers ${
            isLight ? 'text-slate-600' : 'text-gray-400'
          }`}
        >
          <Wifi size={13} className={isLight ? 'text-slate-500' : 'text-gray-400'} />
          <span>{systemHealth.networkLatencyMs}ms</span>
        </div>

        {/* Quick Kiosk Control Toggle */}
        <button
          onClick={toggleKioskBar}
          title="Toggle Kiosk Controls (Press 'M')"
          className={`p-2 rounded-xl transition-all border ${
            isKioskBarVisible
              ? ''
              : isLight
              ? 'glass-pill text-slate-700 hover:text-slate-900 hover:border-slate-300 border-transparent'
              : 'glass-pill text-gray-300 hover:text-white border-transparent'
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
          className={`p-2 rounded-xl glass-pill transition-all flex items-center justify-center ${
            isLight
              ? 'text-slate-700 hover:text-slate-900 hover:border-slate-300'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          {isLight ? <Moon size={16} className="text-purple-600" /> : <Sun size={16} className="text-amber-400" />}
        </button>

        {/* News Feed Page Toggle */}
        <button
          onClick={() => setManualOverrideMode(activeMode === 'news' ? null : 'news')}
          title="Top News & Headlines (Press 'N')"
          aria-label="News Headlines"
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            activeMode === 'news'
              ? 'glass-pill font-bold ring-2 ring-blue-500 text-blue-400'
              : isLight
              ? 'glass-pill text-slate-700 hover:text-slate-900 hover:bg-black/5 hover:border-slate-300'
              : 'glass-pill text-gray-300 hover:text-white hover:border-white/30'
          }`}
        >
          <Newspaper size={16} />
        </button>

        {/* Settings Button */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          title="Settings (Press 'S')"
          aria-label="Settings"
          className={`p-2 rounded-xl glass-pill transition-all cursor-pointer ${
            isLight
              ? 'text-slate-700 hover:text-slate-900 hover:bg-black/5 hover:border-slate-300'
              : 'text-gray-300 hover:text-white hover:border-white/30'
          }`}
        >
          <Settings size={16} className={isLight ? 'text-slate-700 hover:text-slate-900' : 'text-gray-300 hover:text-white'} />
        </button>
      </div>
    </header>
  );
};
