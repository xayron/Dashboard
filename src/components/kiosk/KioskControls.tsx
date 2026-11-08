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
  Palette,
  Terminal,
  Crosshair,
  Sparkles,
  Square,
  Minus,
} from 'lucide-react';
import { useDashboard } from '../../state/DashboardContext';
import type { DashboardMode } from '../../types/dashboard';
import { THEMES, type ThemeId } from '../../types/theme';

export const KioskControls: React.FC = () => {
  const {
    uiStyle,
    toggleUiStyle,
    theme,
    setTheme,
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

  const themeList: ThemeId[] = ['obsidian', 'cyberpunk', 'amber', 'nordic', 'emerald', 'monochrome'];
  const cycleTheme = () => {
    const curIdx = themeList.indexOf(theme);
    const nextIdx = (curIdx + 1) % themeList.length;
    setTheme(themeList[nextIdx]);
  };

  const currentThemeDef = THEMES[theme] || THEMES.obsidian;

  return (
    <div className="fixed bottom-4 inset-x-0 mx-auto max-w-fit z-50 select-none animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div className="glass-panel px-4 py-2.5 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.6)] border border-white/15 flex items-center space-x-3">
        {/* Mode Label */}
        <div className="flex items-center space-x-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider pr-2 border-r border-white/10">
          <Layers size={14} style={{ color: currentThemeDef.colors.accent }} />
          <span>Mode:</span>
        </div>

        {/* Mode Switcher Buttons */}
        <div className="flex items-center space-x-1">
          {/* Auto Button */}
          <button
            onClick={() => setManualOverrideMode(null)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              manualOverrideMode === null
                ? 'text-white shadow-lg ring-1'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            style={{
              backgroundColor: manualOverrideMode === null ? currentThemeDef.colors.accent : undefined,
              borderColor: manualOverrideMode === null ? currentThemeDef.colors.accent : undefined,
            }}
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

        {/* Theme Quick Switcher Pill */}
        <div className="pl-2 border-l border-white/10 flex items-center space-x-1">
          <button
            onClick={cycleTheme}
            title={`Current Theme: ${currentThemeDef.name}. Click to cycle next theme.`}
            className="px-2.5 py-1.5 rounded-xl glass-pill text-xs font-semibold text-gray-200 hover:text-white flex items-center space-x-1.5 transition-all hover:scale-105"
          >
            <Palette size={13} style={{ color: currentThemeDef.colors.accent }} />
            <span className="hidden md:inline">{currentThemeDef.name}</span>
            <div
              className="w-2.5 h-2.5 rounded-full border border-white/30"
              style={{ backgroundColor: currentThemeDef.colors.accent }}
            />
          </button>
        </div>

        {/* UI Design Style Switcher Pill */}
        <div className="pl-2 border-l border-white/10 flex items-center space-x-1">
          <button
            onClick={toggleUiStyle}
            title="Cycle Design Style: Modern Glass → Retro TUI → Neo-Brutalist → Swiss Minimal → Cyber HUD (Press 'T')"
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border flex items-center space-x-1.5 transition-all hover:scale-105 ${
              uiStyle === 'tui'
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60 font-mono'
                : uiStyle === 'brutalist'
                ? 'bg-yellow-400 text-black border-black shadow-[2px_2px_0px_#fff] font-black'
                : uiStyle === 'minimal'
                ? 'bg-neutral-800 text-white border-white/30 font-light'
                : uiStyle === 'hud'
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-400/60 font-mono shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                : 'glass-pill text-gray-200 hover:text-white border-white/15'
            }`}
          >
            {uiStyle === 'tui' && <Terminal size={13} className="text-emerald-400" />}
            {uiStyle === 'brutalist' && <Square size={12} className="text-black fill-black" />}
            {uiStyle === 'minimal' && <Minus size={13} className="text-neutral-300" />}
            {uiStyle === 'hud' && <Crosshair size={13} className="text-cyan-400" />}
            {uiStyle === 'modern' && <Sparkles size={13} className="text-indigo-400" />}

            <span className="capitalize">
              {uiStyle === 'modern' ? 'Glass' : uiStyle === 'tui' ? 'TUI' : uiStyle === 'brutalist' ? 'Brutal' : uiStyle === 'minimal' ? 'Minimal' : 'HUD'}
            </span>
          </button>
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

        {/* Settings button */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          title="Settings (Press 'S')"
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
