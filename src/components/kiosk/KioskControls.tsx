import React from 'react';
import {
  Layers,
  Flame,
  Moon,
  Sun,
  Camera,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Settings,
  X,
} from 'lucide-react';
import { useDashboard } from '../../state/DashboardContext';
import type { DashboardMode } from '../../types/dashboard';

export const KioskControls: React.FC = () => {
  const {
    activeMode,
    autoCalculatedMode,
    manualOverrideMode,
    setManualOverrideMode,
    isRaceWeekendSimulated,
    setIsRaceWeekendSimulated,
    isKioskBarVisible,
    toggleKioskBar,
    setIsSettingsOpen,
    nextPhoto,
    prevPhoto,
    colorMode,
    toggleColorMode,
  } = useDashboard();

  if (!isKioskBarVisible) {
    return (
      <div className="fixed bottom-3 right-3 z-50">
        <button
          onClick={toggleKioskBar}
          title="Show Kiosk Bar (Press 'M')"
          className="p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-gray-300 hover:text-white border border-white/10 shadow-2xl backdrop-blur-lg transition-all"
        >
          <Layers size={18} />
        </button>
      </div>
    );
  }

  const modes: Array<{ id: DashboardMode; label: string; icon: React.ReactNode }> = [
    { id: 'race', label: 'Race Weekend', icon: <Flame size={14} className="text-red-400" /> },
    { id: 'evening', label: 'Evening', icon: <Moon size={14} className="text-purple-400" /> },
    { id: 'morning', label: 'Morning', icon: <Sun size={14} className="text-amber-400" /> },
    { id: 'ambient', label: 'Ambient', icon: <Camera size={14} className="text-emerald-400" /> },
  ];

  return (
    <div className="fixed bottom-4 inset-x-0 mx-auto max-w-fit z-50 select-none animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div className="glass-panel px-4 py-2.5 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.6)] border border-white/15 flex items-center space-x-3">
        {/* Mode Label */}
        <div className="flex items-center space-x-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider pr-2 border-r border-white/10">
          <Layers size={14} className="text-blue-400" />
          <span>Mode:</span>
        </div>

        {/* Mode Switcher Buttons */}
        <div className="flex items-center space-x-1">
          {/* Auto Button */}
          <button
            onClick={() => setManualOverrideMode(null)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              manualOverrideMode === null
                ? 'bg-blue-600 text-white shadow-lg ring-1 ring-blue-400'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <RotateCcw size={12} />
            <span>Auto ({autoCalculatedMode})</span>
          </button>

          {/* Individual Modes */}
          {modes.map(m => {
            const isSelected = activeMode === m.id && manualOverrideMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setManualOverrideMode(m.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-white/20 text-white shadow-md ring-1 ring-white/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {m.icon}
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Race Weekend Simulation Switch */}
        <div className="pl-2 border-l border-white/10 flex items-center space-x-2">
          <button
            onClick={() => setIsRaceWeekendSimulated(!isRaceWeekendSimulated)}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all flex items-center space-x-1 ${
              isRaceWeekendSimulated
                ? 'bg-red-600/30 text-red-300 border-red-500/50'
                : 'text-gray-400 border-white/10 hover:text-white'
            }`}
            title="Simulate F1 Race Weekend (Thurs-Sun)"
          >
            <Flame size={12} className={isRaceWeekendSimulated ? 'text-red-400' : 'text-gray-400'} />
            <span>F1: {isRaceWeekendSimulated ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Ambient Carousel Controls */}
        <div className="pl-2 border-l border-white/10 flex items-center space-x-1">
          <button
            onClick={prevPhoto}
            title="Previous Photo"
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={nextPhoto}
            title="Next Photo"
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Light / Dark Mode Toggle */}
        <button
          onClick={toggleColorMode}
          title={`Switch to ${colorMode === 'dark' ? 'Light' : 'Dark'} Mode (Press 'D')`}
          className="px-2 py-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center space-x-1"
        >
          {colorMode === 'dark' ? (
            <Sun size={15} className="text-amber-400" />
          ) : (
            <Moon size={15} className="text-indigo-400" />
          )}
          <span className="text-[11px] font-bold uppercase">{colorMode === 'dark' ? 'Light' : 'Dark'}</span>
        </button>

        {/* Settings button */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          title="Settings: Styles, Themes, HA, Weather, Photos (Press 'S')"
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <Settings size={16} />
        </button>

        {/* Dismiss Kiosk Bar */}
        <button
          onClick={toggleKioskBar}
          title="Hide Bar (Press 'M' to reopen)"
          className="p-1 rounded-lg text-gray-500 hover:text-gray-300 transition-all"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
};
