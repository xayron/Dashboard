import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Server,
  Cloud,
  Moon,
  Sun,
  Save,
  Check,
  Image as ImageIcon,
  RotateCcw,
  FolderOpen,
  Palette,
  PanelRight,
  AppWindow,
  Search,
  ChevronDown,
  ChevronsUpDown,
  Sliders,
  Sparkles,
  Layers,
  Monitor,
} from 'lucide-react';
import { useDashboard, UI_STYLES } from '../../state/DashboardContext';
import { haService, getSavedHAConfig, saveHAConfig } from '../../services/homeAssistant';
import { getSavedCoords, saveCoords, type WeatherCoords } from '../../services/weatherService';
import { photoService } from '../../services/photoService';
import { THEMES, type ThemeId } from '../../types/theme';

type SectionId = 'themes' | 'ha' | 'weather' | 'photos' | 'display';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    theme,
    setTheme,
    uiStyle,
    setUiStyle,
    colorMode,
    setColorMode,
    settingsLayout,
    setSettingsLayout,
    toggleSettingsLayout,
  } = useDashboard();

  const [haConfig, setHaConfig] = useState(getSavedHAConfig());
  const [coords, setCoords] = useState<WeatherCoords>(getSavedCoords());
  const [isSaved, setIsSaved] = useState(false);
  const [photoSource, setPhotoSource] = useState(photoService.getSource());
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');

  // Search & Navigation States
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | SectionId>('all');
  const [expandedSections, setExpandedSections] = useState<Record<SectionId, boolean>>({
    themes: true,
    ha: false,
    weather: false,
    photos: false,
    display: false,
  });

  // Close on Escape key press
  useEffect(() => {
    if (!isSettingsOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSettingsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSettingsOpen, setIsSettingsOpen]);

  if (!isSettingsOpen) return null;

  const isDrawer = settingsLayout === 'drawer';

  const handleSaveHA = () => {
    haService.updateConfig(haConfig);
    saveHAConfig(haConfig);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleSaveWeather = () => {
    saveCoords(coords);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
    window.location.reload();
  };

  const handleAddPhoto = () => {
    if (!customPhotoUrl.trim()) return;
    const current = [...photoService.getPhotos()];
    current.unshift({
      id: `custom-${Date.now()}`,
      url: customPhotoUrl.trim(),
      title: 'Custom Photo',
      location: 'Personal Gallery',
      aspectRatio: 1.6,
      orientation: 'landscape',
      credit: 'User Added',
    });
    photoService.saveCustomPhotos(current);
    setCustomPhotoUrl('');
    setPhotoSource('custom');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleResetPhotos = () => {
    photoService.resetToShowcase();
    setPhotoSource('showcase');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const CITY_PRESETS = [
    { city: 'New Delhi', latitude: 28.6139, longitude: 77.2090 },
    { city: 'Mumbai', latitude: 19.0760, longitude: 72.8777 },
    { city: 'Bengaluru', latitude: 12.9716, longitude: 77.5946 },
    { city: 'Kolkata', latitude: 22.5726, longitude: 88.3639 },
    { city: 'Hyderabad', latitude: 17.3850, longitude: 78.4867 },
    { city: 'London', latitude: 51.5074, longitude: -0.1278 },
  ];

  const toggleSection = (id: SectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleExpandAll = () => {
    const allExpanded = Object.values(expandedSections).every(Boolean);
    const nextState = !allExpanded;
    setExpandedSections({
      themes: nextState,
      ha: nextState,
      weather: nextState,
      photos: nextState,
      display: nextState,
    });
  };

  // Section metadata, live badges, and search keywords
  const activeStyleName = UI_STYLES.find((s) => s.id === uiStyle)?.name || uiStyle;
  const activeThemeName = THEMES[theme]?.name || theme;

  const sectionsConfig: Array<{
    id: SectionId;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    badge: string;
    keywords: string;
  }> = [
    {
      id: 'themes',
      title: 'Visual Design Styles & Themes',
      subtitle: 'Interface paradigm, light/dark mode, and signature color palettes',
      icon: <Palette size={18} className="text-purple-400" />,
      badge: `${activeStyleName} • ${colorMode.toUpperCase()} • ${activeThemeName}`,
      keywords: 'theme visual style layout dark light mode palette color accent neon cyberpunk terminal tui brutalist minimal hud eink retrowave neumorphic obsidian civic',
    },
    {
      id: 'ha',
      title: 'Home Assistant Integration',
      subtitle: 'IoT server URL, access tokens, media players, and live mock mode',
      icon: <Server size={18} className="text-emerald-400" />,
      badge: haConfig.useMock ? 'Mock Mode' : (haConfig.haUrl ? 'Connected' : 'Unconfigured'),
      keywords: 'home assistant ha iot smart home token url entity media player speakers light mock automation websocket',
    },
    {
      id: 'weather',
      title: 'Weather & Geographic Location',
      subtitle: 'Preset cities, custom coordinates, and live ambient forecasting',
      icon: <Cloud size={18} className="text-blue-400" />,
      badge: coords.city || `${coords.latitude.toFixed(2)}°, ${coords.longitude.toFixed(2)}°`,
      keywords: 'weather aqi city location latitude longitude coordinates forecast temperature rain open-meteo delhi mumbai london',
    },
    {
      id: 'photos',
      title: 'Photos & Wallpaper Gallery',
      subtitle: 'Local folder storage, custom URLs, and ratio-preserving showcase',
      icon: <ImageIcon size={18} className="text-pink-400" />,
      badge: `${photoService.getPhotos().length} Photos • ${photoSource.toUpperCase()}`,
      keywords: 'photos wallpaper pictures aspect ratio gallery custom url images local storage showcase media background',
    },
    {
      id: 'display',
      title: 'Display & Hardware Kiosk',
      subtitle: 'Right drawer vs modal layout, hardware specs, and kiosk flags',
      icon: <Monitor size={18} className="text-amber-400" />,
      badge: `${isDrawer ? 'Right Drawer' : 'Modal'} • 1080p Kiosk`,
      keywords: 'display layout sleep screen drawer modal kiosk chromium flags presentation resolution hardware hdmi auto-sleep',
    },
  ];

  // Filtering based on active category & search query
  const filteredSections = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return sectionsConfig.filter((sec) => {
      // Category filter match
      if (categoryFilter !== 'all' && sec.id !== categoryFilter) {
        return false;
      }
      // Search query match
      if (q) {
        const fullHaystack = `${sec.title} ${sec.subtitle} ${sec.badge} ${sec.keywords}`.toLowerCase();
        return fullHaystack.includes(q);
      }
      return true;
    });
  }, [searchQuery, categoryFilter, activeStyleName, activeThemeName, colorMode, haConfig, coords, photoSource]);

  const allAreExpanded = Object.values(expandedSections).every(Boolean);

  return (
    <div
      className={`fixed inset-0 z-50 select-none ${
        isDrawer
          ? 'overflow-hidden flex justify-end'
          : 'flex items-center justify-center p-4 sm:p-6'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Dashboard Settings"
    >
      {/* Dimmed Backdrop (Light-dismiss on click) */}
      <div
        onClick={() => setIsSettingsOpen(false)}
        className="fixed inset-0 bg-black/65 backdrop-blur-sm animate-backdrop-in"
        aria-hidden="true"
      />

      {/* Settings Container: Right-Side Drawer or Centered Floating Panel */}
      <div
        className={`relative z-10 glass-panel border shadow-2xl flex flex-col ${
          isDrawer
            ? 'h-full w-full max-w-xl md:max-w-2xl border-l border-y-0 border-r-0 border-white/15 bg-slate-950/95 animate-drawer-in'
            : 'w-full max-w-2xl rounded-3xl border-white/15 overflow-hidden max-h-[90vh] animate-modal-in'
        }`}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0 bg-white/5">
          <div className="flex items-center space-x-2.5">
            <Sliders size={20} className="text-blue-400" />
            <h2 className="text-xl font-bold font-display text-white">Dashboard Settings</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono">
              Smart Display
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Quick Switch Layout Button (Drawer <-> Floating Modal) */}
            <button
              type="button"
              onClick={toggleSettingsLayout}
              title={isDrawer ? 'Switch to Floating Modal' : 'Switch to Right Drawer'}
              aria-label={isDrawer ? 'Switch to Floating Modal' : 'Switch to Right Drawer'}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center space-x-1.5"
            >
              {isDrawer ? (
                <>
                  <AppWindow size={15} className="text-blue-400" />
                  <span className="hidden sm:inline">Floating Modal</span>
                </>
              ) : (
                <>
                  <PanelRight size={15} className="text-blue-400" />
                  <span className="hidden sm:inline">Right Drawer</span>
                </>
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              title="Close Settings (Esc)"
              aria-label="Close Settings"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Practical Subheader: Search Bar, Category Filters, and Expand/Collapse All */}
        <div className="px-6 py-3 border-b border-white/10 bg-slate-900/60 shrink-0 space-y-2.5">
          {/* Search Box */}
          <div className="relative flex items-center">
            <Search size={15} className="absolute left-3.5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search settings (themes, colors, weather, home assistant, display...)"
              className="w-full pl-9 pr-9 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-blue-500/70 focus:bg-white/10 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 p-1 rounded-md text-gray-400 hover:text-white transition-colors"
                title="Clear search"
                aria-label="Clear search"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Category Chips and Expand All Action */}
          <div className="flex items-center justify-between text-xs overflow-x-auto pt-0.5 space-x-2">
            <div className="flex items-center space-x-1.5 shrink-0">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  categoryFilter === 'all'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white/5 text-gray-400 hover:text-gray-200 hover:bg-white/10'
                }`}
              >
                All ({sectionsConfig.length})
              </button>
              {sectionsConfig.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setCategoryFilter(s.id);
                    setExpandedSections((prev) => ({ ...prev, [s.id]: true }));
                  }}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center space-x-1 shrink-0 ${
                    categoryFilter === s.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white/5 text-gray-400 hover:text-gray-200 hover:bg-white/10'
                  }`}
                >
                  <span>{s.title.split('&')[0].trim()}</span>
                </button>
              ))}
            </div>

            <button
              onClick={toggleExpandAll}
              className="text-[11px] font-semibold text-gray-400 hover:text-blue-300 transition-colors flex items-center space-x-1 shrink-0 pl-2 border-l border-white/10"
              title={allAreExpanded ? 'Collapse All Sections' : 'Expand All Sections'}
            >
              <ChevronsUpDown size={13} />
              <span>{allAreExpanded ? 'Collapse All' : 'Expand All'}</span>
            </button>
          </div>
        </div>

        {/* Sections Content Area */}
        <div className={`overflow-y-auto px-6 py-4 space-y-3.5 ${isDrawer ? 'flex-1 min-h-0' : 'max-h-[64vh]'}`}>
          {filteredSections.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <p className="text-gray-400 text-sm">No settings matching &quot;{searchQuery}&quot;</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all"
              >
                Clear Search & Show All
              </button>
            </div>
          ) : (
            filteredSections.map((sec) => {
              // Automatically expand if user is actively searching
              const isOpen = searchQuery.trim() !== '' ? true : !!expandedSections[sec.id];

              return (
                <div
                  key={sec.id}
                  className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden transition-all hover:border-white/20"
                >
                  {/* Collapsible Section Header Trigger */}
                  <button
                    type="button"
                    onClick={() => toggleSection(sec.id)}
                    aria-expanded={isOpen}
                    aria-controls={`section-${sec.id}`}
                    className="w-full px-5 py-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center space-x-3 min-w-0 pr-3">
                      <div className="p-2 rounded-xl bg-white/5 border border-white/10 shrink-0">
                        {sec.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-bold text-white truncate">{sec.title}</h3>
                        </div>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{sec.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      <span className="hidden sm:inline-block px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-white/5 text-blue-300 border border-white/10">
                        {sec.badge}
                      </span>
                      <div
                        className={`p-1 rounded-lg text-gray-400 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-white' : ''
                        }`}
                      >
                        <ChevronDown size={18} />
                      </div>
                    </div>
                  </button>

                  {/* Collapsible Content using CSS Grid row transition */}
                  <div
                    id={`section-${sec.id}`}
                    role="region"
                    aria-label={sec.title}
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="p-5 border-t border-white/10 bg-black/20 space-y-6">
                        {/* ===================== SECTION 1: THEMES & STYLES ===================== */}
                        {sec.id === 'themes' && (
                          <div className="space-y-6">
                            {/* Visual Design Styles */}
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                                  Visual Design Styles (10 Paradigms)
                                </h4>
                                <span className="text-[11px] text-gray-400 font-mono">Press &apos;T&apos; to cycle</span>
                              </div>
                              <p className="text-xs text-gray-400 mb-3">
                                Switch the overarching visual interface paradigm. Each design style features custom typography, borders, headers, and mode layouts.
                              </p>

                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                                {UI_STYLES.map((style) => {
                                  const isSelected = uiStyle === style.id;
                                  return (
                                    <div
                                      key={style.id}
                                      onClick={() => setUiStyle(style.id)}
                                      className={`p-3 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between ${
                                        isSelected
                                          ? 'bg-blue-600/15 border-blue-500 shadow-lg ring-1 ring-blue-500/50'
                                          : 'bg-white/5 border-white/10 hover:border-white/20'
                                      }`}
                                    >
                                      <div>
                                        <div className="flex items-center justify-between mb-1">
                                          <h5 className="text-xs font-bold text-white">{style.name}</h5>
                                          {isSelected && (
                                            <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-blue-500 text-white">
                                              ACTIVE
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-[10px] font-semibold text-blue-400">{style.tagline}</p>
                                        <p className="text-[10px] text-gray-400 mt-1 leading-snug line-clamp-2">
                                          {style.description}
                                        </p>
                                      </div>

                                      <div className="mt-2.5 pt-1.5 border-t border-white/10 text-[9px] text-gray-400 font-mono flex items-center justify-between">
                                        <span>STYLE: {style.id.toUpperCase()}</span>
                                        {isSelected && <Check size={11} className="text-blue-400" />}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Interface Mode (Light / Dark) */}
                            <div className="pt-4 border-t border-white/10">
                              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
                                <div>
                                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                                    {colorMode === 'dark' ? <Moon size={15} className="text-blue-400" /> : <Sun size={15} className="text-amber-400" />}
                                    <span>Interface Mode (Light / Dark)</span>
                                  </h4>
                                  <p className="text-xs text-gray-400 mt-0.5">
                                    Toggle Light or Dark mode. Integrates chosen theme colors across all 10 styles.
                                  </p>
                                </div>

                                <div className="flex items-center space-x-1 p-1 bg-black/40 rounded-xl border border-white/10 shrink-0">
                                  <button
                                    onClick={() => setColorMode('dark')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                                      colorMode === 'dark'
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                                  >
                                    <Moon size={13} />
                                    <span>Dark</span>
                                  </button>
                                  <button
                                    onClick={() => setColorMode('light')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                                      colorMode === 'light'
                                        ? 'bg-amber-400 text-black shadow-md font-extrabold'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                                  >
                                    <Sun size={13} />
                                    <span>Light</span>
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Color Palettes */}
                            <div className="pt-4 border-t border-white/10">
                              <div className="mb-3">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                                  Color Palette & Accent Hue
                                </h4>
                                <p className="text-xs text-gray-400">
                                  Signature accent hues, glows, and indicators applied dynamically across the active style.
                                </p>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                {(Object.keys(THEMES) as ThemeId[]).map((tId) => {
                                  const t = THEMES[tId];
                                  const isSelected = theme === tId;
                                  const activePalette = colorMode === 'light' ? t.lightColors : t.colors;
                                  return (
                                    <div
                                      key={tId}
                                      onClick={() => setTheme(tId)}
                                      className={`p-3 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between ${
                                        isSelected
                                          ? 'border-white/50 shadow-xl ring-2'
                                          : 'border-white/10 hover:border-white/25 bg-white/5'
                                      }`}
                                      style={{
                                        backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.08)' : undefined,
                                        borderColor: isSelected ? activePalette.accent : undefined,
                                      }}
                                    >
                                      <div>
                                        <div className="flex items-center justify-between mb-1">
                                          <h5 className="text-xs font-bold text-white">{t.name}</h5>
                                          <div className="flex space-x-1 items-center">
                                            {activePalette.swatches.map((c, i) => (
                                              <div
                                                key={i}
                                                className="w-3 h-3 rounded-full border border-black/40 shadow-sm"
                                                style={{ backgroundColor: c }}
                                              />
                                            ))}
                                          </div>
                                        </div>

                                        <p className="text-[10px] font-semibold" style={{ color: activePalette.accent }}>
                                          {t.tagline}
                                        </p>
                                        <p className="text-[10px] text-gray-400 mt-1 leading-snug">
                                          {t.description}
                                        </p>
                                      </div>

                                      <div className="mt-2.5 pt-1.5 border-t border-white/10 flex items-center justify-between text-xs">
                                        <span className="text-[9px] text-gray-400 uppercase font-mono">
                                          {tId}
                                        </span>
                                        {isSelected && (
                                          <span className="flex items-center text-[10px] font-bold" style={{ color: activePalette.accent }}>
                                            <Check size={12} className="mr-1" /> Active
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* ===================== SECTION 2: HOME ASSISTANT ===================== */}
                        {sec.id === 'ha' && (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
                              <div>
                                <h4 className="text-sm font-semibold text-white">Simulated Mock Mode</h4>
                                <p className="text-xs text-gray-400">Use realistic live mock data when HA server is offline</p>
                              </div>
                              <input
                                type="checkbox"
                                checked={haConfig.useMock}
                                onChange={(e) => setHaConfig({ ...haConfig, useMock: e.target.checked })}
                                className="w-5 h-5 rounded accent-blue-500 cursor-pointer"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                                Home Assistant Base URL
                              </label>
                              <input
                                type="text"
                                value={haConfig.haUrl}
                                disabled={haConfig.useMock}
                                onChange={(e) => setHaConfig({ ...haConfig, haUrl: e.target.value })}
                                placeholder="http://homeassistant.local:8123"
                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                                Long-Lived Access Token
                              </label>
                              <input
                                type="password"
                                value={haConfig.accessToken}
                                disabled={haConfig.useMock}
                                onChange={(e) => setHaConfig({ ...haConfig, accessToken: e.target.value })}
                                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50"
                              />
                              <p className="text-[11px] text-gray-400 mt-1">
                                Generated in your HA User Profile → Long-Lived Access Tokens.
                              </p>
                            </div>

                            {!haConfig.useMock && (
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                                  Target Media Player Entity
                                </label>
                                <select
                                  value={haConfig.preferredMediaPlayer || ''}
                                  onChange={(e) => setHaConfig({ ...haConfig, preferredMediaPlayer: e.target.value || undefined })}
                                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500"
                                >
                                  <option value="">Auto-Detect Active Player (Playing &gt; Paused)</option>
                                  {haService.getAvailableMediaPlayers().map((p) => (
                                    <option key={p.entity_id} value={p.entity_id}>
                                      {p.friendly_name} ({p.entity_id}) • {p.state}
                                    </option>
                                  ))}
                                </select>
                                <p className="text-[11px] text-gray-400 mt-1">
                                  Select a specific speaker or let the dashboard automatically track whichever speaker starts playing.
                                </p>
                              </div>
                            )}

                            <button
                              onClick={handleSaveHA}
                              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md"
                            >
                              {isSaved ? <Check size={16} /> : <Save size={16} />}
                              <span>{isSaved ? 'Saved & Reconnected!' : 'Save Home Assistant Config'}</span>
                            </button>
                          </div>
                        )}

                        {/* ===================== SECTION 3: WEATHER & LOCATION ===================== */}
                        {sec.id === 'weather' && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                                City Preset
                              </label>
                              <div className="grid grid-cols-3 gap-2">
                                {CITY_PRESETS.map((p) => (
                                  <button
                                    key={p.city}
                                    onClick={() => setCoords(p)}
                                    className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-left ${
                                      coords.city === p.city
                                        ? 'bg-blue-600/30 text-white border-blue-500 shadow-sm'
                                        : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                                    }`}
                                  >
                                    {p.city}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                                  Latitude
                                </label>
                                <input
                                  type="number"
                                  step="0.0001"
                                  value={coords.latitude}
                                  onChange={(e) => setCoords({ ...coords, latitude: parseFloat(e.target.value) })}
                                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                                  Longitude
                                </label>
                                <input
                                  type="number"
                                  step="0.0001"
                                  value={coords.longitude}
                                  onChange={(e) => setCoords({ ...coords, longitude: parseFloat(e.target.value) })}
                                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
                                />
                              </div>
                            </div>

                            <button
                              onClick={handleSaveWeather}
                              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md"
                            >
                              {isSaved ? <Check size={16} /> : <Save size={16} />}
                              <span>{isSaved ? 'Saved!' : 'Save & Refresh Weather'}</span>
                            </button>
                          </div>
                        )}

                        {/* ===================== SECTION 4: PHOTOS & STORAGE ===================== */}
                        {sec.id === 'photos' && (
                          <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                              <div className="flex items-center space-x-2 text-white font-bold text-sm mb-1">
                                <FolderOpen size={16} className="text-blue-400" />
                                <span>Local Directory Storage</span>
                              </div>
                              <p className="text-xs text-gray-300 leading-relaxed">
                                You can drop any photos (<code className="text-blue-300">.jpg</code>, <code className="text-blue-300">.png</code>, <code className="text-blue-300">.webp</code>) into the local folder:
                              </p>
                              <div className="mt-2 p-2.5 rounded-xl bg-black/60 font-mono text-xs text-emerald-400 select-all border border-white/10">
                                Dashboard/public/photos/
                              </div>
                              <p className="text-[11px] text-gray-400 mt-2">
                                The dashboard automatically scans this directory via the built-in <code className="text-gray-300">/api/photos</code> endpoint, preserves authentic aspect ratios without stretching, and displays them.
                              </p>
                            </div>

                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                                Add Custom Photo URL
                              </label>
                              <div className="flex space-x-2">
                                <input
                                  type="url"
                                  value={customPhotoUrl}
                                  onChange={(e) => setCustomPhotoUrl(e.target.value)}
                                  placeholder="https://example.com/photo.jpg"
                                  className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
                                />
                                <button
                                  onClick={handleAddPhoto}
                                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                                >
                                  Add
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-white/10">
                              <div className="text-xs text-gray-400">
                                Current Source:{' '}
                                <span className="font-bold text-white capitalize">{photoSource}</span> (
                                {photoService.getPhotos().length} photos)
                              </div>
                              <button
                                onClick={handleResetPhotos}
                                className="px-3 py-1.5 rounded-xl glass-pill text-xs font-semibold text-gray-300 hover:text-white flex items-center space-x-1.5 transition-all cursor-pointer"
                              >
                                <RotateCcw size={13} />
                                <span>Reset to Showcase</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* ===================== SECTION 5: DISPLAY & HARDWARE ===================== */}
                        {sec.id === 'display' && (
                          <div className="space-y-4 text-xs text-gray-300">
                            {/* Presentation Layout Option */}
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="text-sm font-bold text-white mb-0.5">Settings Presentation Layout</h4>
                                  <p className="text-gray-400 text-xs">
                                    Choose whether settings appears as a side drawer sliding in from the right or a centered floating panel.
                                  </p>
                                </div>
                                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30 uppercase">
                                  {settingsLayout}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-3 pt-1">
                                <button
                                  type="button"
                                  onClick={() => setSettingsLayout('drawer')}
                                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-start space-x-3 cursor-pointer ${
                                    settingsLayout === 'drawer'
                                      ? 'bg-blue-600/15 border-blue-500 shadow-lg ring-1 ring-blue-500/50 text-white'
                                      : 'bg-white/5 border-white/10 hover:border-white/20 text-gray-300'
                                  }`}
                                >
                                  <PanelRight size={20} className={settingsLayout === 'drawer' ? 'text-blue-400 mt-0.5' : 'text-gray-400 mt-0.5'} />
                                  <div>
                                    <div className="text-xs font-bold text-white">Right Drawer (Default)</div>
                                    <div className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                                      Full-height side panel anchored to the right edge with smooth slide-in.
                                    </div>
                                  </div>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setSettingsLayout('modal')}
                                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-start space-x-3 cursor-pointer ${
                                    settingsLayout === 'modal'
                                      ? 'bg-blue-600/15 border-blue-500 shadow-lg ring-1 ring-blue-500/50 text-white'
                                      : 'bg-white/5 border-white/10 hover:border-white/20 text-gray-300'
                                  }`}
                                >
                                  <AppWindow size={20} className={settingsLayout === 'modal' ? 'text-blue-400 mt-0.5' : 'text-gray-400 mt-0.5'} />
                                  <div>
                                    <div className="text-xs font-bold text-white">Floating Panel</div>
                                    <div className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                                      Classic centered glass modal dialogue window with backdrop blur.
                                    </div>
                                  </div>
                                </button>
                              </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                              <h4 className="text-sm font-bold text-white mb-1">Kiosk Hardware Specifications</h4>
                              <p className="text-gray-400 leading-relaxed">
                                Display target: Full HD (1920x1080) at 100% DPI scale.
                                Auto-sleep: Screen sleeps between 00:00 and 06:00 IST via DPMS or smart plug.
                              </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                              <h4 className="text-sm font-bold text-white mb-2">Chromium Kiosk Flags</h4>
                              <pre className="p-3 rounded-xl bg-black/60 font-mono text-[11px] text-gray-300 overflow-x-auto">
{`chromium-browser \\
  --noerrdialogs \\
  --disable-infobars \\
  --kiosk \\
  --disable-pinch \\
  --overscroll-history-navigation=0 \\
  http://localhost:3000`}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
