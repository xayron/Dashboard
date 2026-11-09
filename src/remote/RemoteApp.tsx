import React, { useState, useEffect } from 'react';
import {
  Layers,
  Flame,
  Moon,
  Sun,
  Camera,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  RotateCcw,
  Power,
  Check,
  Palette,
  Sliders,
  Smartphone,
  Wifi,
  Radio,
  RefreshCw,
  Plus,
  Droplets,
  Wind,
  CheckSquare,
  Square,
  Info,
  Tv,
  Music,
  Settings,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useRemoteSocket } from './useRemoteSocket';
import type { DashboardMode, F1WidgetId, UIStyle } from '../types/dashboard';
import type { ThemeId } from '../types/theme';
import { THEMES } from '../types/theme';
import { UI_STYLES } from '../state/DashboardContext';

type TabType = 'control' | 'media' | 'styles' | 'f1_tasks' | 'system';

export const RemoteApp: React.FC = () => {
  const { state, connectionStatus, sendCommand } = useRemoteSocket();
  const [activeTab, setActiveTab] = useState<TabType>('control');
  const [newTaskText, setNewTaskText] = useState('');
  const [dpmsLoading, setDpmsLoading] = useState(false);
  const [dpmsStatus, setDpmsStatus] = useState<string | null>(null);

  // Volume slider local state to allow smooth dragging before dispatch
  const [localVolume, setLocalVolume] = useState<number>(Math.round((state.media.volume || 0.5) * 100));

  useEffect(() => {
    setLocalVolume(Math.round((state.media.volume || 0.5) * 100));
  }, [state.media.volume]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setLocalVolume(val);
    sendCommand({
      type: 'MEDIA_CONTROL',
      action: 'volume',
      value: val,
    });
  };

  const handleDpms = async (action: 'sleep' | 'wake') => {
    setDpmsLoading(true);
    try {
      sendCommand({
        type: 'SYSTEM_COMMAND',
        command: action === 'sleep' ? 'dpms_sleep' : 'dpms_wake',
      });
      const res = await fetch(`/api/system/dpms?action=${action}`);
      const data = await res.json();
      setDpmsStatus(`Display ${action === 'sleep' ? 'powered off' : 'woken up'}`);
      setTimeout(() => setDpmsStatus(null), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setDpmsLoading(false);
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    sendCommand({
      type: 'ADD_TASK',
      text: newTaskText.trim(),
    });
    setNewTaskText('');
  };

  const formatSeconds = (sec: number) => {
    if (!sec || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isLight = state.colorMode === 'light';

  const modes: Array<{
    id: DashboardMode;
    label: string;
    desc: string;
    icon: React.ReactNode;
    color: string;
  }> = [
    {
      id: 'race',
      label: 'Race Weekend',
      desc: 'Live telemetry, sessions & standings',
      icon: <Flame size={20} className="text-red-400" />,
      color: 'border-red-500/40 bg-red-950/20',
    },
    {
      id: 'evening',
      label: 'Now Playing / Evening',
      desc: 'Ambient backdrop & audio spectrum',
      icon: <Moon size={20} className="text-purple-400" />,
      color: 'border-purple-500/40 bg-purple-950/20',
    },
    {
      id: 'morning',
      label: 'Morning Briefing',
      desc: 'Agenda, weather radar & markets',
      icon: <Sun size={20} className="text-amber-400" />,
      color: 'border-amber-500/40 bg-amber-950/20',
    },
    {
      id: 'ambient',
      label: 'Ambient Clock',
      desc: 'Scenic photos & minimal clock',
      icon: <Camera size={20} className="text-emerald-400" />,
      color: 'border-emerald-500/40 bg-emerald-950/20',
    },
  ];

  const f1Widgets: Array<{ id: F1WidgetId; label: string; desc: string }> = [
    { id: 'countdown', label: 'Session Countdown', desc: 'Live countdown to FP/Quali/Race' },
    { id: 'podium', label: 'Championship Podium', desc: 'Top 3 drivers with photos & points' },
    { id: 'titleBattle', label: 'Constructors Battle', desc: 'Team standings & telemetry' },
    { id: 'qualifying', label: 'Qualifying Grid', desc: 'Driver grid positions & sector times' },
    { id: 'pitstop', label: 'Pit Stop Strategy', desc: 'Tire compounds & pit windows' },
    { id: 'upcomingRaces', label: 'Season Calendar', desc: 'Upcoming Grand Prix dates' },
    { id: 'circuitTelemetry', label: 'Track Telemetry', desc: 'Circuit map, DRS zones & speed' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans pb-24 selection:bg-blue-500/30 overflow-y-auto">
      {/* Top Mobile Status Header */}
      <header className="sticky top-0 z-40 px-4 py-3 bg-slate-900/90 backdrop-blur-xl border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Smartphone size={18} />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight">Display Remote</h1>
            <p className="text-[10px] text-gray-400">Smart Display Dashboard</p>
          </div>
        </div>

        {/* Live Connection Pill */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-white/10 text-[11px]">
          <span
            className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected'
                ? 'bg-emerald-400 animate-pulse'
                : connectionStatus === 'connecting'
                ? 'bg-amber-400 animate-pulse'
                : 'bg-red-400'
            }`}
          />
          <span className="capitalize font-medium text-gray-300">
            {connectionStatus === 'connected' ? 'Connected' : connectionStatus}
          </span>
        </div>
      </header>

      {/* Main Tab Content */}
      <main className="flex-1 px-4 py-4 max-w-lg mx-auto w-full space-y-4">
        {/* TAB 1: CONTROL */}
        {activeTab === 'control' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Active Mode Status Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800/70 border border-white/10 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    Current Mode
                  </span>
                  <h2 className="text-xl font-extrabold capitalize text-white flex items-center space-x-2 mt-0.5">
                    <span>{state.activeMode} Mode</span>
                    {state.manualOverrideMode && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                        Manual
                      </span>
                    )}
                  </h2>
                </div>
                {state.manualOverrideMode !== null ? (
                  <button
                    onClick={() => sendCommand({ type: 'SET_MODE', mode: null })}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 hover:bg-blue-500/30 transition flex items-center space-x-1"
                  >
                    <RotateCcw size={13} />
                    <span>Auto ({state.autoCalculatedMode})</span>
                  </button>
                ) : (
                  <span className="text-xs text-emerald-400 font-medium flex items-center space-x-1">
                    <Sparkles size={13} />
                    <span>Auto ({state.autoCalculatedMode})</span>
                  </span>
                )}
              </div>
            </div>

            {/* Mode Switcher Grid */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Switch Display Mode
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {modes.map((m) => {
                  const isSelected = state.activeMode === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => sendCommand({ type: 'SET_MODE', mode: m.id })}
                      className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between h-24 ${
                        isSelected
                          ? `${m.color} ring-2 ring-blue-500/50 shadow-md`
                          : 'bg-slate-900/60 border-white/10 hover:bg-slate-800/60 text-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                          {m.icon}
                        </div>
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{m.label}</div>
                        <div className="text-[10px] text-gray-400 line-clamp-1">{m.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* F1 Race Simulation Switch */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
                  <Flame size={18} />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Simulate Race Weekend</div>
                  <div className="text-[11px] text-gray-400">Forces full F1 telemetry view</div>
                </div>
              </div>
              <button
                onClick={() =>
                  sendCommand({
                    type: 'SET_RACE_SIMULATION',
                    enabled: !state.isRaceWeekendSimulated,
                  })
                }
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  state.isRaceWeekendSimulated ? 'bg-red-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    state.isRaceWeekendSimulated ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Display & Hardware Power */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                <span>Display & Screen Controls</span>
                <Tv size={14} className="text-gray-400" />
              </h3>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleDpms('sleep')}
                  disabled={dpmsLoading}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-white/10 text-gray-200 transition text-xs font-bold flex items-center justify-center space-x-2"
                >
                  <Power size={14} className="text-red-400" />
                  <span>Screen Sleep</span>
                </button>
                <button
                  onClick={() => handleDpms('wake')}
                  disabled={dpmsLoading}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-white/10 text-gray-200 transition text-xs font-bold flex items-center justify-center space-x-2"
                >
                  <Sparkles size={14} className="text-emerald-400" />
                  <span>Wake Screen</span>
                </button>
              </div>

              {dpmsStatus && (
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 text-center text-xs border border-emerald-500/30 animate-in fade-in">
                  {dpmsStatus}
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/10">
                <button
                  onClick={() =>
                    sendCommand({ type: 'SYSTEM_COMMAND', command: 'reload' })
                  }
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition text-[11px] font-semibold flex flex-col items-center space-y-1"
                >
                  <RefreshCw size={14} />
                  <span>Reload Kiosk</span>
                </button>
                <button
                  onClick={() => sendCommand({ type: 'TOGGLE_KIOSK_BAR' })}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition text-[11px] font-semibold flex flex-col items-center space-y-1"
                >
                  <Layers size={14} />
                  <span>Kiosk Bar</span>
                </button>
                <button
                  onClick={() => sendCommand({ type: 'TOGGLE_SETTINGS' })}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition text-[11px] font-semibold flex flex-col items-center space-y-1"
                >
                  <Settings size={14} />
                  <span>Settings UI</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MEDIA PLAYER */}
        {activeTab === 'media' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Now Playing Visual Card */}
            <div className="p-5 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 shadow-xl flex flex-col items-center text-center relative overflow-hidden">
              {/* Album Art or Fallback */}
              <div className="relative w-44 h-44 rounded-2xl overflow-hidden shadow-2xl border border-white/15 my-2 flex items-center justify-center bg-slate-800">
                {state.media.entityPicture ? (
                  <img
                    src={state.media.entityPicture}
                    alt="Album Art"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Music size={56} className="text-blue-400 opacity-60" />
                )}
                {state.media.state === 'playing' && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-500/80 text-white text-[10px] font-bold backdrop-blur-md">
                    LIVE
                  </div>
                )}
              </div>

              {/* Title & Artist */}
              <div className="mt-3 w-full px-2">
                <h3 className="text-lg font-bold text-white truncate">
                  {state.media.title || 'No Media Playing'}
                </h3>
                <p className="text-xs text-gray-400 truncate mt-0.5">
                  {state.media.artist || 'Idle'} {state.media.album ? `• ${state.media.album}` : ''}
                </p>
              </div>

              {/* Position Progress Bar */}
              {state.media.duration > 0 && (
                <div className="w-full mt-4 space-y-1">
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-blue-500 h-full transition-all"
                      style={{
                        width: `${Math.min(
                          100,
                          (state.media.position / state.media.duration) * 100
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-gray-400">
                    <span>{formatSeconds(state.media.position)}</span>
                    <span>{formatSeconds(state.media.duration)}</span>
                  </div>
                </div>
              )}

              {/* Playback Controls */}
              <div className="flex items-center space-x-6 mt-4">
                <button
                  onClick={() =>
                    sendCommand({ type: 'MEDIA_CONTROL', action: 'prev' })
                  }
                  className="p-3 rounded-full bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition active:scale-95"
                >
                  <SkipBack size={22} />
                </button>
                <button
                  onClick={() =>
                    sendCommand({ type: 'MEDIA_CONTROL', action: 'toggle' })
                  }
                  className="p-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30 transition active:scale-95"
                >
                  {state.media.state === 'playing' ? (
                    <Pause size={28} />
                  ) : (
                    <Play size={28} className="translate-x-0.5" />
                  )}
                </button>
                <button
                  onClick={() =>
                    sendCommand({ type: 'MEDIA_CONTROL', action: 'next' })
                  }
                  className="p-3 rounded-full bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition active:scale-95"
                >
                  <SkipForward size={22} />
                </button>
              </div>
            </div>

            {/* Volume Control Card */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Volume2 size={15} />
                  <span>Volume</span>
                </span>
                <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md">
                  {localVolume}%
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    const next = localVolume === 0 ? 30 : 0;
                    setLocalVolume(next);
                    sendCommand({
                      type: 'MEDIA_CONTROL',
                      action: 'volume',
                      value: next,
                    });
                  }}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
                >
                  {localVolume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={localVolume}
                  onChange={handleVolumeChange}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STYLES & THEMES */}
        {activeTab === 'styles' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Dark / Light Mode Toggle */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {state.colorMode === 'light' ? <Sun size={18} /> : <Moon size={18} />}
                </div>
                <div>
                  <div className="text-sm font-bold text-white capitalize">
                    {state.colorMode} Mode
                  </div>
                  <div className="text-[11px] text-gray-400">Color scheme for display</div>
                </div>
              </div>
              <button
                onClick={() =>
                  sendCommand({
                    type: 'SET_COLOR_MODE',
                    mode: state.colorMode === 'dark' ? 'light' : 'dark',
                  })
                }
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/10 transition"
              >
                Switch to {state.colorMode === 'dark' ? 'Light' : 'Dark'}
              </button>
            </div>

            {/* Themes Palette */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                <span>Color Theme</span>
                <Palette size={14} className="text-gray-400" />
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(THEMES) as ThemeId[]).map((tId) => {
                  const tDef = THEMES[tId];
                  const isSelected = state.theme === tId;
                  const activeColors = isLight ? tDef.lightColors : tDef.colors;
                  return (
                    <button
                      key={tId}
                      onClick={() => sendCommand({ type: 'SET_THEME', theme: tId })}
                      className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                        isSelected
                          ? 'border-blue-400 bg-blue-500/20 ring-1 ring-blue-400'
                          : 'border-white/10 bg-slate-800/60 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex space-x-1 mb-2">
                        {activeColors.swatches.map((color, idx) => (
                          <span
                            key={idx}
                            className="w-3 h-3 rounded-full border border-white/20"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-white capitalize">
                        {tDef.name.replace(/ Deep| Intelligence| System/g, '')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* UI Design Styles Grid */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                10 UI Design Archetypes
              </h3>
              <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
                {UI_STYLES.map((style) => {
                  const isSelected = state.uiStyle === style.id;
                  return (
                    <button
                      key={style.id}
                      onClick={() => sendCommand({ type: 'SET_UI_STYLE', style: style.id })}
                      className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500/20 ring-1 ring-blue-500 text-white'
                          : 'border-white/10 bg-slate-800/40 hover:bg-slate-800/80 text-gray-300'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold flex items-center space-x-2">
                          <span>{style.name}</span>
                          <span className="text-[10px] font-normal text-gray-400">
                            • {style.tagline}
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">
                          {style.description}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: F1 & TASKS */}
        {activeTab === 'f1_tasks' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* F1 Widgets Selector */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Flame size={14} className="text-red-400" />
                  <span>F1 Active Widgets</span>
                </h3>
                <span className="text-[10px] text-gray-400">
                  {state.f1ActiveWidgets.length} Active
                </span>
              </div>

              <div className="space-y-2">
                {f1Widgets.map((w) => {
                  const isActive = state.f1ActiveWidgets.includes(w.id);
                  return (
                    <button
                      key={w.id}
                      onClick={() =>
                        sendCommand({ type: 'TOGGLE_F1_WIDGET', id: w.id })
                      }
                      className={`w-full p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                        isActive
                          ? 'bg-red-950/20 border-red-500/40 text-white'
                          : 'bg-slate-800/40 border-white/10 text-gray-400'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-white">{w.label}</div>
                        <div className="text-[10px] text-gray-400">{w.desc}</div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                          isActive
                            ? 'bg-red-500 border-red-400 text-white'
                            : 'border-white/20'
                        }`}
                      >
                        {isActive && <Check size={12} strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Checklist / Tasks */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                <span>To-Do Checklist</span>
                <CheckSquare size={14} className="text-gray-400" />
              </h3>

              {/* Add Task Input */}
              <form onSubmit={handleAddTask} className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Add item to dashboard..."
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  className="flex-1 bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition shrink-0"
                >
                  <Plus size={16} />
                </button>
              </form>

              {/* Tasks List */}
              <div className="space-y-1.5 max-h-56 overflow-y-auto">
                {state.tasks && state.tasks.length > 0 ? (
                  state.tasks.map((task) => (
                    <button
                      key={task.id}
                      onClick={() =>
                        sendCommand({ type: 'TOGGLE_TASK', id: task.id })
                      }
                      className="w-full p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-white/10 text-left transition flex items-center space-x-2.5"
                    >
                      {task.completed ? (
                        <CheckSquare size={16} className="text-emerald-400 shrink-0" />
                      ) : (
                        <Square size={16} className="text-gray-400 shrink-0" />
                      )}
                      <span
                        className={`text-xs ${
                          task.completed ? 'line-through text-gray-400' : 'text-gray-200'
                        }`}
                      >
                        {task.title}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-4 text-xs text-gray-500">
                    No tasks found
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SYSTEM & SETTINGS */}
        {activeTab === 'system' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* System Status Card */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                <span>Display Diagnostics</span>
                <Radio size={14} className="text-gray-400" />
              </h3>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-800/60 border border-white/10">
                  <div className="text-gray-400 text-[10px]">Home Assistant</div>
                  <div className="font-bold mt-0.5 flex items-center space-x-1">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        state.systemHealth.haStatus === 'connected' ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}
                    />
                    <span>{state.systemHealth.haStatus === 'connected' ? 'Connected' : 'Mock/Offline'}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/60 border border-white/10">
                  <div className="text-gray-400 text-[10px]">Connected Remotes</div>
                  <div className="font-bold mt-0.5 flex items-center space-x-1">
                    <Smartphone size={13} className="text-blue-400" />
                    <span>{state.connectedRemotesCount || 1} Device</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Weather Radar Card */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold">
                    Weather Overview
                  </div>
                  <div className="text-lg font-extrabold text-white">
                    {state.weather.temperature}°C • {state.weather.condition}
                  </div>
                </div>
                <div className="flex space-x-2 text-xs text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Droplets size={12} className="text-blue-400" />
                    <span>{state.weather.humidity}%</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Wind size={12} className="text-teal-400" />
                    <span>{state.weather.windSpeed} km/h</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Photos Parked Note */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-dashed border-white/15 text-xs space-y-1.5">
              <div className="flex items-center space-x-2 text-gray-300 font-bold">
                <Camera size={14} className="text-emerald-400" />
                <span>Photos Configuration</span>
              </div>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Photos are stored and configured directly on the smart display host machine (under <code className="text-blue-300">public/photos</code> or local storage). Remote management for photos is parked for host device isolation.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Sticky Ergonomic Tab Navigation */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-white/10 px-2 py-2 flex justify-around items-center max-w-lg mx-auto">
        <button
          onClick={() => setActiveTab('control')}
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition ${
            activeTab === 'control'
              ? 'text-blue-400 font-bold'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Layers size={18} />
          <span className="text-[10px] mt-0.5">Control</span>
        </button>

        <button
          onClick={() => setActiveTab('media')}
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition ${
            activeTab === 'media'
              ? 'text-blue-400 font-bold'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Music size={18} />
          <span className="text-[10px] mt-0.5">Media</span>
        </button>

        <button
          onClick={() => setActiveTab('styles')}
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition ${
            activeTab === 'styles'
              ? 'text-blue-400 font-bold'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Palette size={18} />
          <span className="text-[10px] mt-0.5">Styles</span>
        </button>

        <button
          onClick={() => setActiveTab('f1_tasks')}
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition ${
            activeTab === 'f1_tasks'
              ? 'text-blue-400 font-bold'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Flame size={18} />
          <span className="text-[10px] mt-0.5">F1 & Tasks</span>
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition ${
            activeTab === 'system'
              ? 'text-blue-400 font-bold'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Settings size={18} />
          <span className="text-[10px] mt-0.5">System</span>
        </button>
      </nav>
    </div>
  );
};

export default RemoteApp;
