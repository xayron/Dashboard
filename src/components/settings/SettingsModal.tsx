import React, { useState, useEffect } from 'react';
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

  const isLight = colorMode === 'light';

  // Global UI Style Design Tokens
  const isTui = uiStyle === 'tui';
  const isBrutalist = uiStyle === 'brutalist';
  const isMinimal = uiStyle === 'minimal';
  const isHud = uiStyle === 'hud';
  const isEink = uiStyle === 'eink';
  const isRetrowave = uiStyle === 'retrowave';
  const isNeumorphic = uiStyle === 'neumorphic';
  const isObsidian = uiStyle === 'obsidian';
  const isCivic = uiStyle === 'civic';

  // Font family
  const fontClass = isTui || isHud ? 'font-mono' : isEink || isCivic ? 'font-serif' : 'font-sans';

  // Corner radius tokens
  const isSharp = isTui || isBrutalist || isHud || isEink;
  const radiusLg = isSharp ? 'rounded-none' : isCivic ? 'rounded-xl' : 'rounded-2xl';
  const radiusMd = isSharp ? 'rounded-none' : isCivic ? 'rounded-lg' : 'rounded-xl';
  const radiusSm = isSharp ? 'rounded-none' : isCivic ? 'rounded' : 'rounded-lg';
  const radiusPill = isSharp ? 'rounded-none' : 'rounded-full';

  const [haConfig, setHaConfig] = useState(getSavedHAConfig());
  const [coords, setCoords] = useState<WeatherCoords>(getSavedCoords());
  const [isSaved, setIsSaved] = useState(false);
  const [photoSource, setPhotoSource] = useState(photoService.getSource());
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');

  // Search & Expansion States
  const [searchQuery, setSearchQuery] = useState('');
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
  const activeStyleName = UI_STYLES.find((s) => s.id === uiStyle)?.name || uiStyle || 'Modern';
  const activeThemeName = (theme && THEMES[theme]?.name) || theme || 'Obsidian';
  const safeColorMode = (colorMode || 'dark').toUpperCase();
  const safePhotoSource = (photoSource || 'showcase').toUpperCase();
  const safeCoordsBadge =
    coords?.city ||
    (typeof coords?.latitude === 'number' && typeof coords?.longitude === 'number'
      ? `${coords.latitude.toFixed(2)}°, ${coords.longitude.toFixed(2)}°`
      : 'Default Location');

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
      icon: <Palette size={18} className={isLight ? 'text-purple-600' : 'text-purple-400'} />,
      badge: `${activeStyleName} • ${safeColorMode} • ${activeThemeName}`,
      keywords: 'theme visual style layout dark light mode palette color accent neon cyberpunk terminal tui brutalist minimal hud eink retrowave neumorphic obsidian civic',
    },
    {
      id: 'ha',
      title: 'Home Assistant Integration',
      subtitle: 'IoT server URL, access tokens, media players, and live mock mode',
      icon: <Server size={18} className={isLight ? 'text-emerald-600' : 'text-emerald-400'} />,
      badge: haConfig?.useMock ? 'Mock Mode' : (haConfig?.haUrl ? 'Connected' : 'Unconfigured'),
      keywords: 'home assistant ha iot smart home token url entity media player speakers light mock automation websocket',
    },
    {
      id: 'weather',
      title: 'Weather & Geographic Location',
      subtitle: 'Preset cities, custom coordinates, and live ambient forecasting',
      icon: <Cloud size={18} className={isLight ? 'text-blue-600' : 'text-blue-400'} />,
      badge: safeCoordsBadge,
      keywords: 'weather aqi city location latitude longitude coordinates forecast temperature rain open-meteo delhi mumbai london',
    },
    {
      id: 'photos',
      title: 'Photos & Wallpaper Gallery',
      subtitle: 'Local folder storage, custom URLs, and ratio-preserving showcase',
      icon: <ImageIcon size={18} className={isLight ? 'text-pink-600' : 'text-pink-400'} />,
      badge: `${photoService?.getPhotos()?.length || 0} Photos • ${safePhotoSource}`,
      keywords: 'photos wallpaper pictures aspect ratio gallery custom url images local storage showcase media background',
    },
    {
      id: 'display',
      title: 'Display & Hardware Kiosk',
      subtitle: 'Right drawer vs modal layout, hardware specs, and kiosk flags',
      icon: <Monitor size={18} className={isLight ? 'text-amber-600' : 'text-amber-400'} />,
      badge: `${isDrawer ? 'Right Drawer' : 'Modal'} • 1080p Kiosk`,
      keywords: 'display layout sleep screen drawer modal kiosk chromium flags presentation resolution hardware hdmi auto-sleep',
    },
  ];

  // Direct filtering across all sections without tabs
  const q = searchQuery.toLowerCase().trim();
  const filteredSections = sectionsConfig.filter((sec) => {
    if (q) {
      const fullHaystack = `${sec.title} ${sec.subtitle} ${sec.badge} ${sec.keywords}`.toLowerCase();
      return fullHaystack.includes(q);
    }
    return true;
  });

  const allAreExpanded = Object.values(expandedSections).every(Boolean);

  // Style-Specific Dynamic CSS Resolvers
  const getDrawerClasses = () => {
    if (isTui) {
      return 'h-full w-full max-w-xl md:max-w-2xl border-l-2 border-[var(--color-accent,#10b981)] bg-black text-[var(--color-accent,#10b981)] rounded-none shadow-[0_0_35px_var(--color-glow,rgba(16,185,129,0.25))] animate-drawer-in';
    }
    if (isBrutalist) {
      return `h-full w-full max-w-xl md:max-w-2xl border-l-4 rounded-none animate-drawer-in ${
        isLight
          ? 'bg-white text-black border-black shadow-[-8px_0px_0px_#000]'
          : 'bg-black text-white border-white shadow-[-8px_0px_0px_#fff]'
      }`;
    }
    if (isHud) {
      return 'h-full w-full max-w-xl md:max-w-2xl border-l-2 border-[var(--color-accent,#06b6d4)]/60 bg-[#040814]/98 text-[#e0f2fe] rounded-none shadow-[0_0_30px_var(--color-glow,rgba(6,182,212,0.25))] animate-drawer-in';
    }
    if (isEink) {
      return `h-full w-full max-w-xl md:max-w-2xl border-l-2 rounded-none animate-drawer-in ${
        isLight
          ? 'border-stone-800 bg-[#ede8df] text-stone-900 shadow-[-4px_0px_0px_#1c1917]'
          : 'border-stone-600 bg-[#292524] text-stone-100 shadow-[-4px_0px_0px_#0c0a09]'
      }`;
    }
    if (isRetrowave) {
      return 'h-full w-full max-w-xl md:max-w-2xl border-l-2 border-pink-500/60 bg-[#150424]/98 text-pink-50 rounded-l-3xl shadow-[-10px_0_35px_rgba(236,72,153,0.35)] animate-drawer-in';
    }
    if (isNeumorphic) {
      return `h-full w-full max-w-xl md:max-w-2xl border-l rounded-l-3xl animate-drawer-in ${
        isLight
          ? 'bg-[#e2e8f0] text-slate-800 border-slate-300 shadow-[-12px_0px_24px_#cbd5e1]'
          : 'bg-[#1a1d24] text-slate-100 border-slate-800 shadow-[-12px_0px_24px_#101217]'
      }`;
    }
    if (isObsidian) {
      return 'h-full w-full max-w-xl md:max-w-2xl border-l border-white/15 bg-[#0a0a0f]/98 text-slate-100 rounded-none shadow-2xl animate-drawer-in';
    }
    if (isCivic) {
      return `h-full w-full max-w-xl md:max-w-2xl border-l-2 rounded-none animate-drawer-in ${
        isLight
          ? 'bg-[#f8fafc] text-slate-900 border-slate-300 shadow-xl'
          : 'bg-[#0f172a] text-white border-slate-700 shadow-2xl'
      }`;
    }
    if (isMinimal) {
      return `h-full w-full max-w-xl md:max-w-2xl border-l border-y-0 border-r-0 rounded-none animate-drawer-in ${
        isLight
          ? 'bg-white text-slate-900 border-slate-200/80 shadow-xl'
          : 'bg-[#09090b] text-white border-white/10 shadow-2xl'
      }`;
    }
    // Modern Glass
    return `h-full w-full max-w-xl md:max-w-2xl border-l border-y-0 border-r-0 rounded-l-3xl animate-drawer-in ${
      isLight
        ? 'bg-white/95 text-slate-900 border-slate-200 shadow-2xl'
        : 'bg-slate-950/95 text-white border-white/15 shadow-2xl'
    }`;
  };

  const getModalClasses = () => {
    if (isTui) {
      return 'w-full max-w-2xl border-2 border-[var(--color-accent,#10b981)] bg-black text-[var(--color-accent,#10b981)] rounded-none shadow-[0_0_35px_var(--color-glow,rgba(16,185,129,0.3))] overflow-hidden max-h-[90vh] animate-modal-in';
    }
    if (isBrutalist) {
      return `w-full max-w-2xl border-4 rounded-none overflow-hidden max-h-[90vh] animate-modal-in ${
        isLight
          ? 'bg-white text-black border-black shadow-[8px_8px_0px_#000]'
          : 'bg-black text-white border-white shadow-[8px_8px_0px_#fff]'
      }`;
    }
    if (isHud) {
      return 'w-full max-w-2xl border-2 border-[var(--color-accent,#06b6d4)]/60 bg-[#040814]/98 text-[#e0f2fe] rounded-none shadow-[0_0_35px_var(--color-glow,rgba(6,182,212,0.3))] overflow-hidden max-h-[90vh] animate-modal-in';
    }
    if (isEink) {
      return `w-full max-w-2xl border-2 rounded-none overflow-hidden max-h-[90vh] animate-modal-in ${
        isLight
          ? 'border-stone-800 bg-[#ede8df] text-stone-900 shadow-[4px_4px_0px_#1c1917]'
          : 'border-stone-600 bg-[#292524] text-stone-100 shadow-[4px_4px_0px_#0c0a09]'
      }`;
    }
    if (isRetrowave) {
      return 'w-full max-w-2xl border-2 border-pink-500/60 bg-[#150424]/98 text-pink-50 rounded-3xl shadow-[0_0_40px_rgba(236,72,153,0.4)] overflow-hidden max-h-[90vh] animate-modal-in';
    }
    if (isNeumorphic) {
      return `w-full max-w-2xl rounded-3xl overflow-hidden max-h-[90vh] animate-modal-in ${
        isLight
          ? 'neumorphic-card text-slate-800'
          : 'neumorphic-card text-slate-100'
      }`;
    }
    if (isObsidian) {
      return 'w-full max-w-2xl border border-white/15 bg-[#0a0a0f]/98 text-slate-100 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] animate-modal-in';
    }
    if (isCivic) {
      return `w-full max-w-2xl border-2 rounded-xl overflow-hidden max-h-[90vh] animate-modal-in ${
        isLight
          ? 'bg-[#f8fafc] text-slate-900 border-slate-300 shadow-xl'
          : 'bg-[#0f172a] text-white border-slate-700 shadow-2xl'
      }`;
    }
    if (isMinimal) {
      return `w-full max-w-2xl border rounded-2xl overflow-hidden max-h-[90vh] animate-modal-in ${
        isLight
          ? 'bg-white text-slate-900 border-slate-200/80 shadow-xl'
          : 'bg-[#09090b] text-white border-white/10 shadow-2xl'
      }`;
    }
    // Modern Glass
    return `w-full max-w-2xl border rounded-3xl overflow-hidden max-h-[90vh] animate-modal-in ${
      isLight
        ? 'bg-white/95 text-slate-900 border-slate-200 shadow-2xl'
        : 'bg-slate-900/95 text-white border-white/15 shadow-2xl'
    }`;
  };

  const getHeaderTitle = () => {
    if (isTui) return 'debjit@kiosk-1080p:~$ settings --configure';
    if (isBrutalist) return 'SMART DISPLAY // SETTINGS';
    if (isHud) return '// SYS.CONFIG // TAC-01';
    if (isEink) return 'Gazette & Almanac // Settings';
    if (isCivic) return 'PUBLIC GAZETTE // PREFERENCES';
    if (isRetrowave) return 'SYNTHWAVE CONFIG // V1.0';
    if (isObsidian) return 'OBSIDIAN INTELLIGENCE // CONFIG';
    if (isNeumorphic) return 'Dashboard Settings';
    if (isMinimal) return 'Settings';
    return 'Dashboard Settings';
  };

  const getHeaderBadge = () => {
    if (isTui) return '[SYS: READY]';
    if (isBrutalist) return 'v1.0 // ACTIVE';
    if (isHud) return 'SYS: ONLINE';
    if (isEink) return 'Kiosk Edition';
    if (isCivic) return 'OFFICIAL RECORD';
    if (isRetrowave) return 'NEON RAD';
    if (isObsidian) return 'OPS.READY';
    if (isNeumorphic) return 'Neumorph';
    if (isMinimal) return 'Config';
    return 'Smart Display';
  };

  const getSectionCardClass = () => {
    if (isTui) {
      return 'rounded-none border border-[var(--color-accent,#10b981)]/50 bg-black/90 hover:border-[var(--color-accent,#10b981)] transition-colors';
    }
    if (isBrutalist) {
      return `rounded-none border-2 transition-all ${
        isLight
          ? 'border-black bg-white shadow-[3px_3px_0px_#000]'
          : 'border-white bg-black shadow-[3px_3px_0px_#fff]'
      }`;
    }
    if (isHud) {
      return 'rounded-none border border-[var(--color-accent,#06b6d4)]/40 bg-[#050c1f]/90 hover:border-[var(--color-accent,#06b6d4)]/80 transition-colors';
    }
    if (isEink) {
      return `rounded-none border-2 transition-all ${
        isLight ? 'border-stone-800 bg-[#f5f2eb]' : 'border-stone-500 bg-[#1c1917]'
      }`;
    }
    if (isRetrowave) {
      return 'rounded-2xl border border-pink-500/30 bg-purple-950/40 hover:border-pink-500/70 shadow-[0_0_15px_rgba(236,72,153,0.15)] transition-all';
    }
    if (isNeumorphic) {
      return `rounded-2xl transition-all ${isLight ? 'neumorphic-card' : 'neumorphic-card'}`;
    }
    if (isObsidian) {
      return 'rounded-xl border border-white/10 bg-[#0f0f15] hover:border-white/25 transition-all';
    }
    if (isCivic) {
      return `rounded-lg border transition-all ${
        isLight ? 'border-slate-300 bg-white shadow-xs' : 'border-slate-700 bg-slate-900'
      }`;
    }
    if (isMinimal) {
      return `rounded-xl border transition-all ${
        isLight ? 'border-slate-200 bg-white' : 'border-white/10 bg-slate-900/40'
      }`;
    }
    // Modern
    return `rounded-2xl border transition-all ${
      isLight ? 'border-slate-200 bg-white shadow-xs hover:border-slate-300' : 'border-white/10 bg-white/5 hover:border-white/20'
    }`;
  };

  const getInputClass = () => {
    if (isTui) {
      return 'rounded-none border border-[var(--color-accent,#10b981)] bg-black text-[var(--color-accent,#10b981)] font-mono placeholder-[var(--color-accent,#10b981)]/40 focus:outline-none focus:ring-1 focus:ring-[var(--color-accent,#10b981)]';
    }
    if (isBrutalist) {
      return `rounded-none border-2 font-bold focus:outline-none ${
        isLight
          ? 'border-black bg-white text-black shadow-[2px_2px_0px_#000] focus:shadow-[4px_4px_0px_#000]'
          : 'border-white bg-black text-white shadow-[2px_2px_0px_#fff] focus:shadow-[4px_4px_0px_#fff]'
      }`;
    }
    if (isHud) {
      return 'rounded-none border border-[var(--color-accent,#06b6d4)]/50 bg-[#030712] text-[var(--color-accent,#06b6d4)] font-mono placeholder-[var(--color-accent,#06b6d4)]/40 focus:outline-none focus:border-[var(--color-accent,#06b6d4)]';
    }
    if (isEink) {
      return `rounded-none border-2 font-serif focus:outline-none ${
        isLight
          ? 'border-stone-800 bg-white text-stone-900 focus:border-black'
          : 'border-stone-500 bg-stone-900 text-stone-100 focus:border-stone-300'
      }`;
    }
    if (isRetrowave) {
      return 'rounded-xl border border-pink-500/40 bg-purple-950/60 text-pink-200 placeholder-pink-400/40 focus:outline-none focus:border-pink-400 focus:shadow-[0_0_12px_rgba(236,72,153,0.3)]';
    }
    if (isNeumorphic) {
      return `rounded-xl neumorphic-inset border-none focus:outline-none ${
        isLight ? 'text-slate-800' : 'text-slate-100'
      }`;
    }
    if (isObsidian) {
      return 'rounded-xl border border-white/10 bg-[#06060a] text-slate-100 placeholder-slate-500 focus:outline-none focus:border-white/30';
    }
    if (isCivic) {
      return `rounded-lg border text-sm transition-all focus:outline-none focus:border-orange-500 ${
        isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
      }`;
    }
    if (isMinimal) {
      return `rounded-xl border text-sm transition-all focus:outline-none focus:border-slate-400 ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-white/10 text-white'
      }`;
    }
    // Modern
    return `rounded-xl border text-sm transition-all focus:outline-none focus:border-blue-500 ${
      isLight ? 'bg-white border-slate-300 text-slate-900 shadow-xs' : 'bg-white/5 border-white/10 text-white'
    }`;
  };

  const getPrimaryButtonClass = () => {
    if (isTui) {
      return 'rounded-none border-2 border-[var(--color-accent,#10b981)] bg-[var(--color-accent,#10b981)]/20 text-[var(--color-accent,#10b981)] hover:bg-[var(--color-accent,#10b981)] hover:text-black font-mono font-bold uppercase transition-colors';
    }
    if (isBrutalist) {
      return `rounded-none border-2 font-black uppercase tracking-wider transition-all ${
        isLight
          ? 'border-black bg-black text-white hover:bg-neutral-800 shadow-[3px_3px_0px_var(--color-accent,#facc15)]'
          : 'border-white bg-white text-black hover:bg-neutral-200 shadow-[3px_3px_0px_var(--color-accent,#facc15)]'
      }`;
    }
    if (isHud) {
      return 'rounded-none border-2 border-[var(--color-accent,#06b6d4)] bg-[var(--color-accent,#06b6d4)]/20 text-[var(--color-accent,#06b6d4)] hover:bg-[var(--color-accent,#06b6d4)] hover:text-black font-mono font-bold uppercase tracking-wider transition-colors';
    }
    if (isEink) {
      return `rounded-none border-2 font-serif font-bold uppercase transition-colors ${
        isLight
          ? 'border-stone-800 bg-stone-900 text-stone-50 hover:bg-stone-800'
          : 'border-stone-400 bg-stone-200 text-stone-950 hover:bg-white'
      }`;
    }
    if (isRetrowave) {
      return 'rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all';
    }
    if (isNeumorphic) {
      return `rounded-xl font-bold transition-all ${
        isLight ? 'neumorphic-card text-blue-700 hover:text-blue-800' : 'neumorphic-card text-blue-400 hover:text-blue-300'
      }`;
    }
    if (isObsidian) {
      return 'rounded-xl border border-white/20 bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-lg transition-all';
    }
    if (isCivic) {
      return 'rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold shadow-sm transition-all';
    }
    if (isMinimal) {
      return `rounded-xl font-bold transition-all ${
        isLight ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white text-slate-900 hover:bg-slate-100'
      }`;
    }
    // Modern
    return 'rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md transition-all';
  };

  const getSecondaryButtonClass = () => {
    if (isTui) {
      return 'rounded-none border border-[var(--color-accent,#10b981)] bg-black text-[var(--color-accent,#10b981)] hover:bg-[var(--color-accent,#10b981)] hover:text-black font-mono text-xs';
    }
    if (isBrutalist) {
      return `rounded-none border-2 font-black uppercase text-xs ${
        isLight
          ? 'border-black bg-neutral-100 text-black shadow-[2px_2px_0px_#000] hover:bg-black hover:text-white'
          : 'border-white bg-neutral-900 text-white shadow-[2px_2px_0px_#fff] hover:bg-white hover:text-black'
      }`;
    }
    if (isHud) {
      return 'rounded-none border border-[var(--color-accent,#06b6d4)]/60 bg-[#030712] text-[var(--color-accent,#06b6d4)] font-mono text-xs hover:bg-[var(--color-accent,#06b6d4)]/20';
    }
    if (isEink) {
      return `rounded-none border-2 font-serif text-xs ${
        isLight
          ? 'border-stone-800 bg-[#ede8df] text-stone-900 hover:bg-stone-900 hover:text-white'
          : 'border-stone-500 bg-[#292524] text-stone-100 hover:bg-white hover:text-stone-950'
      }`;
    }
    if (isNeumorphic) {
      return `rounded-xl neumorphic-card text-xs font-semibold ${isLight ? 'text-slate-700' : 'text-slate-200'}`;
    }
    if (isCivic) {
      return `rounded-lg border text-xs font-semibold ${
        isLight ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100' : 'bg-slate-800 border-slate-600 text-slate-200'
      }`;
    }
    return `rounded-xl border text-xs font-semibold transition-all ${
      isLight ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs' : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border-white/10'
    }`;
  };

  const getBadgeClass = () => {
    if (isTui) {
      return 'rounded-none border border-[var(--color-accent,#10b981)] bg-[var(--color-accent,#10b981)]/15 text-[var(--color-accent,#10b981)] font-mono text-[10px] px-2 py-0.5';
    }
    if (isBrutalist) {
      return `rounded-none border-2 font-black text-[10px] uppercase px-2 py-0.5 ${
        isLight ? 'border-black bg-neutral-100 text-black shadow-[1px_1px_0px_#000]' : 'border-white bg-neutral-900 text-white shadow-[1px_1px_0px_#fff]'
      }`;
    }
    if (isHud) {
      return 'rounded-none border border-[var(--color-accent,#06b6d4)]/60 bg-[var(--color-accent,#06b6d4)]/10 text-[var(--color-accent,#06b6d4)] font-mono text-[10px] px-2 py-0.5';
    }
    if (isEink) {
      return `rounded-none border text-[10px] font-serif px-2 py-0.5 ${
        isLight ? 'border-stone-800 bg-stone-200 text-stone-900' : 'border-stone-500 bg-stone-800 text-stone-100'
      }`;
    }
    if (isCivic) {
      return `rounded text-[10px] font-bold border px-2 py-0.5 ${
        isLight ? 'border-slate-300 bg-slate-100 text-orange-600' : 'border-slate-700 bg-slate-800 text-orange-400'
      }`;
    }
    if (isRetrowave) {
      return 'rounded-full border border-pink-500/40 bg-pink-500/15 text-pink-300 font-mono text-[10px] px-2.5 py-0.5';
    }
    if (isNeumorphic) {
      return `rounded-full text-[10px] font-mono px-2.5 py-0.5 ${
        isLight ? 'bg-slate-200 text-slate-700' : 'bg-slate-800 text-slate-300'
      }`;
    }
    if (isMinimal) {
      return `rounded-full text-[10px] font-mono px-2 py-0.5 ${
        isLight ? 'bg-slate-100 text-slate-600' : 'bg-white/5 text-slate-300'
      }`;
    }
    if (isObsidian) {
      return `rounded-full text-[10px] font-mono px-2.5 py-0.5 border ${
        isLight ? 'bg-slate-100 text-blue-700 border-slate-200' : 'bg-blue-500/15 text-blue-300 border-blue-500/30'
      }`;
    }
    // Modern
    return `rounded-full text-[10px] font-mono px-2.5 py-0.5 border ${
      isLight ? 'bg-slate-100 text-blue-700 border-slate-200' : 'bg-white/5 text-blue-300 border-white/10'
    }`;
  };

  return (
    <div
      className={`fixed inset-0 z-50 select-none ${fontClass} ${
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
        className={`fixed inset-0 backdrop-blur-sm animate-backdrop-in ${
          isLight ? 'bg-slate-900/40' : 'bg-black/70'
        }`}
        aria-hidden="true"
      />

      {/* Settings Container: Right-Side Drawer or Centered Floating Panel */}
      <div
        className={`relative z-10 shadow-2xl flex flex-col transition-all duration-300 overflow-hidden ${
          isDrawer ? getDrawerClasses() : getModalClasses()
        }`}
      >
        {/* Tricolor Institutional Accent Line for Civic Style */}
        {isCivic && (
          <div
            className="absolute top-0 inset-x-0 h-1.5 z-30"
            style={{
              background: 'linear-gradient(to right, var(--color-accent, #f97316), white, #16a34a)',
            }}
          />
        )}

        {/* Top Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b shrink-0 ${
            isTui
              ? 'border-[var(--color-accent,#10b981)] bg-black text-[var(--color-accent,#10b981)]'
              : isBrutalist
              ? isLight
                ? 'border-black bg-white text-black border-b-4'
                : 'border-white bg-black text-white border-b-4'
              : isHud
              ? 'border-[var(--color-accent,#06b6d4)]/40 bg-[#060c1d] text-[#e0f2fe]'
              : isEink
              ? isLight
                ? 'border-stone-800 bg-[#f5f2eb] text-stone-900 border-b-2'
                : 'border-stone-600 bg-[#1c1917] text-stone-100 border-b-2'
              : isCivic
              ? isLight
                ? 'border-slate-300 bg-slate-100 text-slate-900 border-b-2'
                : 'border-slate-700 bg-slate-900 text-white border-b-2'
              : isRetrowave
              ? 'border-pink-500/30 bg-purple-950/50 text-pink-50'
              : isNeumorphic
              ? isLight
                ? 'border-slate-300 bg-[#e2e8f0] text-slate-800'
                : 'border-slate-800 bg-[#1a1d24] text-slate-100'
              : isLight
              ? 'bg-white/80 border-slate-200 text-slate-900'
              : 'bg-white/5 border-white/10 text-white'
          }`}
        >
          <div className="flex items-center space-x-2.5">
            <Sliders size={18} className={isTui ? 'text-[var(--color-accent,#10b981)]' : isHud ? 'text-[var(--color-accent,#06b6d4)]' : isLight ? 'text-blue-600' : 'text-blue-400'} />
            <h2 className="text-base sm:text-lg font-bold font-display tracking-tight">
              {getHeaderTitle()}
            </h2>
            <span className={getBadgeClass()}>
              {getHeaderBadge()}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Quick Switch Layout Button (Drawer <-> Floating Modal) */}
            <button
              type="button"
              onClick={toggleSettingsLayout}
              title={isDrawer ? 'Switch to Floating Modal' : 'Switch to Right Drawer'}
              aria-label={isDrawer ? 'Switch to Floating Modal' : 'Switch to Right Drawer'}
              className={`px-2.5 py-1.5 text-xs font-semibold border transition-all flex items-center space-x-1.5 cursor-pointer ${getSecondaryButtonClass()}`}
            >
              {isDrawer ? (
                <>
                  <AppWindow size={14} />
                  <span className="hidden sm:inline">Floating Modal</span>
                </>
              ) : (
                <>
                  <PanelRight size={14} />
                  <span className="hidden sm:inline">Right Drawer</span>
                </>
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={() => setIsSettingsOpen(false)}
              className={`p-2 transition-all cursor-pointer ${
                isTui
                  ? 'border border-[var(--color-accent,#10b981)] text-[var(--color-accent,#10b981)] hover:bg-[var(--color-accent,#10b981)] hover:text-black rounded-none'
                  : isBrutalist
                  ? isLight
                    ? 'border-2 border-black bg-white text-black shadow-[2px_2px_0px_#000] hover:bg-black hover:text-white rounded-none'
                    : 'border-2 border-white bg-black text-white shadow-[2px_2px_0px_#fff] hover:bg-white hover:text-black rounded-none'
                  : isEink
                  ? 'border-2 border-stone-800 text-stone-900 hover:bg-stone-800 hover:text-white rounded-none'
                  : isLight
                  ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl'
                  : 'text-gray-400 hover:text-white hover:bg-white/10 rounded-xl'
              }`}
              title="Close Settings (Esc)"
              aria-label="Close Settings"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Subheader: Search Bar + Collapse All Action */}
        <div
          className={`px-6 py-3 border-b shrink-0 ${
            isTui
              ? 'border-[var(--color-accent,#10b981)]/40 bg-black/90'
              : isBrutalist
              ? isLight
                ? 'border-black bg-white border-b-4'
                : 'border-white bg-black border-b-4'
              : isHud
              ? 'border-[var(--color-accent,#06b6d4)]/30 bg-[#050c1f]'
              : isEink
              ? isLight
                ? 'border-stone-800 bg-[#ede8df] border-b-2'
                : 'border-stone-600 bg-[#292524] border-b-2'
              : isCivic
              ? isLight
                ? 'border-slate-300 bg-white'
                : 'border-slate-700 bg-slate-900'
              : isRetrowave
              ? 'border-pink-500/20 bg-purple-950/40'
              : isNeumorphic
              ? isLight
                ? 'border-slate-300 bg-[#e2e8f0]'
                : 'border-slate-800 bg-[#1a1d24]'
              : isLight
              ? 'bg-white border-slate-200'
              : 'bg-slate-900/60 border-white/10'
          }`}
        >
          <div className="flex items-center space-x-2.5">
            {/* Search Input Container */}
            <div className="relative flex-1 flex items-center">
              <Search
                size={14}
                className={`absolute left-3.5 pointer-events-none ${
                  isTui
                    ? 'text-[var(--color-accent,#10b981)]'
                    : isHud
                    ? 'text-[var(--color-accent,#06b6d4)]'
                    : isLight
                    ? 'text-slate-400'
                    : 'text-gray-400'
                }`}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isTui ? 'grep -i "settings" ...' : isBrutalist ? 'SEARCH PREFERENCES...' : isHud ? 'QUERY.PARAM...' : 'Search all settings...'}
                className={`w-full pl-9 pr-9 py-2 text-xs transition-all ${getInputClass()}`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute right-3 p-1 transition-colors cursor-pointer ${
                    isTui
                      ? 'text-[var(--color-accent,#10b981)]'
                      : isLight
                      ? 'text-slate-400 hover:text-slate-700'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Collapse All / Expand All Button directly to the right of search */}
            <button
              type="button"
              onClick={toggleExpandAll}
              title={allAreExpanded ? 'Collapse All Sections' : 'Expand All Sections'}
              aria-label={allAreExpanded ? 'Collapse All Sections' : 'Expand All Sections'}
              className={`px-3 py-2 text-xs font-semibold border transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${getSecondaryButtonClass()}`}
            >
              <ChevronsUpDown size={14} />
              <span className="hidden sm:inline">
                {isTui
                  ? allAreExpanded
                    ? '[-] COLLAPSE'
                    : '[+] EXPAND'
                  : allAreExpanded
                  ? 'Collapse All'
                  : 'Expand All'}
              </span>
            </button>
          </div>
        </div>

        {/* Sections Content Area */}
        <div
          className={`overflow-y-auto px-6 py-4 space-y-3.5 ${
            isDrawer ? 'flex-1 min-h-0' : 'max-h-[64vh]'
          }`}
        >
          {filteredSections.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <p className={`text-sm ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                {isTui ? `grep: no matches found for "${searchQuery}"` : `No settings matching "${searchQuery}"`}
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className={`px-3.5 py-1.5 text-xs font-bold cursor-pointer ${getPrimaryButtonClass()}`}
              >
                {isTui ? '[RESET SEARCH]' : 'Clear Search & Show All'}
              </button>
            </div>
          ) : (
            filteredSections.map((sec) => {
              // Automatically expand if user is actively searching
              const isOpen = searchQuery.trim() !== '' ? true : !!expandedSections[sec.id];

              return (
                <div
                  key={sec.id}
                  className={`overflow-hidden transition-all ${getSectionCardClass()}`}
                >
                  {/* Collapsible Section Header Trigger */}
                  <button
                    type="button"
                    onClick={() => toggleSection(sec.id)}
                    aria-expanded={isOpen}
                    aria-controls={`section-${sec.id}`}
                    className={`w-full px-5 py-3.5 flex items-center justify-between text-left cursor-pointer transition-colors ${
                      isTui
                        ? 'hover:bg-[var(--color-accent,#10b981)]/10'
                        : isBrutalist
                        ? isLight
                          ? 'hover:bg-neutral-100'
                          : 'hover:bg-neutral-900'
                        : isLight
                        ? 'hover:bg-slate-50/80'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0 pr-3">
                      <div
                        className={`p-2 shrink-0 ${radiusMd} ${
                          isTui
                            ? 'border border-[var(--color-accent,#10b981)]/60 bg-[var(--color-accent,#10b981)]/15 text-[var(--color-accent,#10b981)]'
                            : isBrutalist
                            ? isLight
                              ? 'border-2 border-black bg-amber-300 text-black shadow-[1px_1px_0px_#000]'
                              : 'border-2 border-white bg-amber-400 text-black shadow-[1px_1px_0px_#fff]'
                            : isHud
                            ? 'border border-[var(--color-accent,#06b6d4)]/60 bg-[var(--color-accent,#06b6d4)]/15 text-[var(--color-accent,#06b6d4)]'
                            : isEink
                            ? isLight
                              ? 'border border-stone-800 bg-stone-200 text-stone-900'
                              : 'border border-stone-500 bg-stone-800 text-stone-100'
                            : isLight
                            ? 'bg-slate-100 border border-slate-200 text-blue-600'
                            : 'bg-white/5 border border-white/10 text-blue-400'
                        }`}
                      >
                        {sec.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3
                            className={`text-sm font-bold truncate ${
                              isTui
                                ? 'text-[var(--color-accent,#10b981)] font-mono'
                                : isBrutalist
                                ? 'uppercase tracking-wide font-black'
                                : isHud
                                ? 'text-[#e0f2fe] font-mono'
                                : isLight
                                ? 'text-slate-900'
                                : 'text-white'
                            }`}
                          >
                            {isTui ? `[+] ${sec.title}` : sec.title}
                          </h3>
                        </div>
                        <p className={`text-xs truncate mt-0.5 ${isTui ? 'opacity-70 font-mono' : isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                          {sec.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      <span className={`hidden sm:inline-block ${getBadgeClass()}`}>
                        {sec.badge}
                      </span>
                      <div
                        className={`p-1 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      >
                        <ChevronDown size={18} />
                      </div>
                    </div>
                  </button>

                  {/* Collapsible Content */}
                  <div
                    id={`section-${sec.id}`}
                    role="region"
                    aria-label={sec.title}
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div
                        className={`p-5 border-t space-y-6 ${
                          isTui
                            ? 'border-[var(--color-accent,#10b981)]/40 bg-black/95 text-[var(--color-accent,#10b981)] font-mono'
                            : isBrutalist
                            ? isLight
                              ? 'border-t-2 border-black bg-neutral-50 text-black'
                              : 'border-t-2 border-white bg-neutral-950 text-white'
                            : isHud
                            ? 'border-[var(--color-accent,#06b6d4)]/30 bg-[#030712] text-[#e0f2fe] font-mono'
                            : isEink
                            ? isLight
                              ? 'border-stone-800 bg-[#ede8df] text-stone-900 font-serif'
                              : 'border-stone-600 bg-[#292524] text-stone-100 font-serif'
                            : isCivic
                            ? isLight
                              ? 'border-slate-300 bg-slate-50 text-slate-900'
                              : 'border-slate-700 bg-slate-900/80 text-white'
                            : isRetrowave
                            ? 'border-pink-500/30 bg-purple-950/50 text-pink-50'
                            : isNeumorphic
                            ? isLight
                              ? 'border-slate-300 bg-[#e2e8f0] text-slate-800'
                              : 'border-slate-800 bg-[#1a1d24] text-slate-100'
                            : isLight
                            ? 'border-slate-200 bg-slate-50/70 text-slate-900'
                            : 'border-white/10 bg-black/20 text-white'
                        }`}
                      >
                        {/* ===================== SECTION 1: THEMES & STYLES ===================== */}
                        {sec.id === 'themes' && (
                          <div className="space-y-6">
                            {/* Visual Design Styles */}
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="text-xs font-bold uppercase tracking-wider">
                                  {isTui ? '--- [UI_PARADIGMS: 10] ---' : 'Visual Design Styles (10 Paradigms)'}
                                </h4>
                                <span className={`text-[11px] font-mono opacity-70`}>
                                  Press &apos;T&apos; to cycle
                                </span>
                              </div>
                              <p className="text-xs mb-3 opacity-80">
                                Switch the overarching visual interface paradigm. Each design style features custom typography, borders, headers, and mode layouts.
                              </p>

                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                                {UI_STYLES.map((style) => {
                                  const isSelected = uiStyle === style.id;
                                  return (
                                    <div
                                      key={style.id}
                                      onClick={() => setUiStyle(style.id)}
                                      className={`p-3 cursor-pointer transition-all border flex flex-col justify-between ${radiusMd} ${
                                        isSelected
                                          ? isTui
                                            ? 'border-2 border-[var(--color-accent,#10b981)] bg-[var(--color-accent,#10b981)]/20 shadow-[0_0_15px_var(--color-glow,rgba(16,185,129,0.3))]'
                                            : isBrutalist
                                            ? isLight
                                              ? 'border-2 border-black bg-amber-300 text-black shadow-[3px_3px_0px_#000]'
                                              : 'border-2 border-white bg-amber-400 text-black shadow-[3px_3px_0px_#fff]'
                                            : isHud
                                            ? 'border-2 border-[var(--color-accent,#06b6d4)] bg-[var(--color-accent,#06b6d4)]/20 shadow-[0_0_15px_var(--color-glow,rgba(6,182,212,0.3))]'
                                            : isLight
                                            ? 'bg-blue-50 border-blue-500 shadow-md ring-1 ring-blue-400/50'
                                            : 'bg-blue-600/15 border-blue-500 shadow-lg ring-1 ring-blue-500/50'
                                          : isTui
                                          ? 'border border-[var(--color-accent,#10b981)]/30 bg-black/60 hover:border-[var(--color-accent,#10b981)]/80'
                                          : isBrutalist
                                          ? isLight
                                            ? 'border-2 border-black bg-white shadow-[2px_2px_0px_#000] hover:shadow-[3px_3px_0px_#000]'
                                            : 'border-2 border-white bg-black shadow-[2px_2px_0px_#fff] hover:shadow-[3px_3px_0px_#fff]'
                                          : isHud
                                          ? 'border border-[var(--color-accent,#06b6d4)]/30 bg-black/60 hover:border-[var(--color-accent,#06b6d4)]/70'
                                          : isLight
                                          ? 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                                          : 'bg-white/5 border-white/10 hover:border-white/20'
                                      }`}
                                    >
                                      <div>
                                        <div className="flex items-center justify-between mb-1">
                                          <h5 className="text-xs font-bold">
                                            {style.name}
                                          </h5>
                                          {isSelected && (
                                            <span className={getBadgeClass()}>
                                              ACTIVE
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-[10px] font-semibold opacity-90">
                                          {style.tagline}
                                        </p>
                                        <p className="text-[10px] mt-1 leading-snug line-clamp-2 opacity-75">
                                          {style.description}
                                        </p>
                                      </div>

                                      <div
                                        className="mt-2.5 pt-1.5 border-t border-current/15 text-[9px] font-mono flex items-center justify-between opacity-80"
                                      >
                                        <span>STYLE: {style.id.toUpperCase()}</span>
                                        {isSelected && <Check size={11} />}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Interface Mode (Light / Dark) */}
                            <div className="pt-4 border-t border-current/15">
                              <div
                                className={`flex items-center justify-between p-3.5 border ${radiusMd} ${
                                  isTui
                                    ? 'border-[var(--color-accent,#10b981)]/40 bg-black/70'
                                    : isBrutalist
                                    ? isLight
                                      ? 'border-2 border-black bg-white shadow-[2px_2px_0px_#000]'
                                      : 'border-2 border-white bg-black shadow-[2px_2px_0px_#fff]'
                                    : isHud
                                    ? 'border-[var(--color-accent,#06b6d4)]/40 bg-black/60'
                                    : isLight
                                    ? 'bg-white border-slate-200 shadow-xs'
                                    : 'bg-white/5 border-white/10'
                                }`}
                              >
                                <div>
                                  <h4 className="text-xs font-bold uppercase tracking-wider flex items-center space-x-2">
                                    {colorMode === 'dark' ? (
                                      <Moon size={15} />
                                    ) : (
                                      <Sun size={15} />
                                    )}
                                    <span>Interface Mode (Light / Dark)</span>
                                  </h4>
                                  <p className="text-xs mt-0.5 opacity-75">
                                    Toggle Light or Dark mode. Integrates chosen theme colors across all 10 styles.
                                  </p>
                                </div>

                                <div
                                  className={`flex items-center space-x-1 p-1 border shrink-0 ${radiusMd} ${
                                    isTui
                                      ? 'border-[var(--color-accent,#10b981)]/40 bg-black'
                                      : isBrutalist
                                      ? isLight
                                        ? 'border-2 border-black bg-neutral-100'
                                        : 'border-2 border-white bg-neutral-900'
                                      : isLight
                                      ? 'bg-slate-100 border-slate-200'
                                      : 'bg-black/40 border-white/10'
                                  }`}
                                >
                                  <button
                                    onClick={() => setColorMode('dark')}
                                    className={`px-3 py-1.5 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${radiusSm} ${
                                      colorMode === 'dark'
                                        ? isTui
                                          ? 'bg-[var(--color-accent,#10b981)] text-black font-mono font-bold'
                                          : isBrutalist
                                          ? 'bg-black text-white border border-white'
                                          : 'bg-blue-600 text-white shadow-md'
                                        : 'opacity-60 hover:opacity-100'
                                    }`}
                                  >
                                    <Moon size={13} />
                                    <span>Dark</span>
                                  </button>
                                  <button
                                    onClick={() => setColorMode('light')}
                                    className={`px-3 py-1.5 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${radiusSm} ${
                                      colorMode === 'light'
                                        ? isTui
                                          ? 'bg-[var(--color-accent,#10b981)] text-black font-mono font-bold'
                                          : isBrutalist
                                          ? 'bg-amber-300 text-black border border-black font-black'
                                          : 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                                        : 'opacity-60 hover:opacity-100'
                                    }`}
                                  >
                                    <Sun size={13} />
                                    <span>Light</span>
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Color Palettes */}
                            <div className="pt-4 border-t border-current/15">
                              <div className="mb-3">
                                <h4 className="text-xs font-bold uppercase tracking-wider mb-1">
                                  {isTui ? '--- [PALETTES: HEX_THEMES] ---' : 'Color Palette & Accent Hue'}
                                </h4>
                                <p className="text-xs opacity-75">
                                  Signature accent hues, glows, and indicators applied dynamically across the active style.
                                </p>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                {(Object.keys(THEMES) as ThemeId[]).map((tId) => {
                                  const t = THEMES[tId];
                                  if (!t) return null;
                                  const isSelected = theme === tId;
                                  const activePalette = (colorMode === 'light' ? t.lightColors : t.colors) || t.colors;
                                  if (!activePalette) return null;

                                  return (
                                    <div
                                      key={tId}
                                      onClick={() => setTheme(tId)}
                                      className={`p-3 cursor-pointer transition-all border flex flex-col justify-between ${radiusMd} ${
                                        isSelected
                                          ? isTui
                                            ? 'border-2 border-[var(--color-accent,#10b981)] bg-[var(--color-accent,#10b981)]/20 shadow-[0_0_15px_var(--color-glow,rgba(16,185,129,0.3))]'
                                            : isBrutalist
                                            ? isLight
                                              ? 'border-2 border-black bg-white shadow-[3px_3px_0px_#000] ring-2 ring-black'
                                              : 'border-2 border-white bg-black shadow-[3px_3px_0px_#fff] ring-2 ring-white'
                                            : isLight
                                            ? 'border-slate-400 shadow-md ring-2 bg-slate-50'
                                            : 'border-white/50 shadow-xl ring-2 bg-white/10'
                                          : isTui
                                          ? 'border border-[var(--color-accent,#10b981)]/30 bg-black/60'
                                          : isBrutalist
                                          ? isLight
                                            ? 'border-2 border-black bg-white shadow-[2px_2px_0px_#000]'
                                            : 'border-2 border-white bg-black shadow-[2px_2px_0px_#fff]'
                                          : isLight
                                          ? 'border-slate-200 hover:border-slate-300 bg-white shadow-xs'
                                          : 'border-white/10 hover:border-white/25 bg-white/5'
                                      }`}
                                      style={{
                                        borderColor: isSelected ? activePalette.accent : undefined,
                                      }}
                                    >
                                      <div>
                                        <div className="flex items-center justify-between mb-1">
                                          <h5 className="text-xs font-bold">
                                            {t.name}
                                          </h5>
                                          <div className="flex space-x-1 items-center">
                                            {activePalette.swatches.map((c, i) => (
                                              <div
                                                key={i}
                                                className={`w-3 h-3 border border-black/30 shadow-xs ${radiusSm}`}
                                                style={{ backgroundColor: c }}
                                              />
                                            ))}
                                          </div>
                                        </div>

                                        <p className="text-[10px] font-semibold" style={{ color: activePalette.accent }}>
                                          {t.tagline}
                                        </p>
                                        <p className="text-[10px] mt-1 leading-snug opacity-75">
                                          {t.description}
                                        </p>
                                      </div>

                                      <div
                                        className="mt-2.5 pt-1.5 border-t border-current/15 flex items-center justify-between text-xs opacity-80"
                                      >
                                        <span className="text-[9px] uppercase font-mono">
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
                            <div
                              className={`flex items-center justify-between p-3.5 border ${radiusMd} ${
                                isTui
                                  ? 'border-[var(--color-accent,#10b981)]/40 bg-black/60'
                                  : isBrutalist
                                  ? isLight
                                    ? 'border-2 border-black bg-white shadow-[2px_2px_0px_#000]'
                                    : 'border-2 border-white bg-black shadow-[2px_2px_0px_#fff]'
                                  : isLight
                                  ? 'bg-white border-slate-200 shadow-xs'
                                  : 'bg-white/5 border-white/10'
                              }`}
                            >
                              <div>
                                <h4 className="text-sm font-semibold">
                                  {isTui ? '[SIMULATED_MOCK_MODE]' : 'Simulated Mock Mode'}
                                </h4>
                                <p className="text-xs opacity-75">
                                  Use realistic live mock data when HA server is offline
                                </p>
                              </div>
                              <input
                                type="checkbox"
                                checked={haConfig.useMock}
                                onChange={(e) => setHaConfig({ ...haConfig, useMock: e.target.checked })}
                                className="w-5 h-5 accent-blue-600 cursor-pointer"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-80">
                                {isTui ? 'HA_BASE_URL:' : 'Home Assistant Base URL'}
                              </label>
                              <input
                                type="text"
                                value={haConfig.haUrl}
                                disabled={haConfig.useMock}
                                onChange={(e) => setHaConfig({ ...haConfig, haUrl: e.target.value })}
                                placeholder="http://homeassistant.local:8123"
                                className={`w-full px-4 py-2.5 text-sm transition-all disabled:opacity-50 ${getInputClass()}`}
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-80">
                                {isTui ? 'ACCESS_TOKEN:' : 'Long-Lived Access Token'}
                              </label>
                              <input
                                type="password"
                                value={haConfig.accessToken}
                                disabled={haConfig.useMock}
                                onChange={(e) => setHaConfig({ ...haConfig, accessToken: e.target.value })}
                                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                                className={`w-full px-4 py-2.5 text-sm transition-all disabled:opacity-50 ${getInputClass()}`}
                              />
                              <p className="text-[11px] mt-1 opacity-70">
                                Generated in your HA User Profile → Long-Lived Access Tokens.
                              </p>
                            </div>

                            {!haConfig.useMock && (
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-80">
                                  {isTui ? 'TARGET_MEDIA_PLAYER:' : 'Target Media Player Entity'}
                                </label>
                                <select
                                  value={haConfig.preferredMediaPlayer || ''}
                                  onChange={(e) => setHaConfig({ ...haConfig, preferredMediaPlayer: e.target.value || undefined })}
                                  className={`w-full px-4 py-2.5 text-sm transition-all ${getInputClass()}`}
                                >
                                  <option value="">Auto-Detect Active Player (Playing &gt; Paused)</option>
                                  {(haService?.getAvailableMediaPlayers?.() || []).map((p) => (
                                    <option key={p.entity_id} value={p.entity_id}>
                                      {p.friendly_name} ({p.entity_id}) • {p.state}
                                    </option>
                                  ))}
                                </select>
                                <p className="text-[11px] mt-1 opacity-70">
                                  Select a specific speaker or let the dashboard automatically track whichever speaker starts playing.
                                </p>
                              </div>
                            )}

                            <button
                              onClick={handleSaveHA}
                              className={`w-full py-2.5 text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer ${getPrimaryButtonClass()}`}
                            >
                              {isSaved ? <Check size={16} /> : <Save size={16} />}
                              <span>{isSaved ? (isTui ? '[SAVED_AND_CONNECTED]' : 'Saved & Reconnected!') : (isTui ? '[SAVE_HA_CONFIG]' : 'Save Home Assistant Config')}</span>
                            </button>
                          </div>
                        )}

                        {/* ===================== SECTION 3: WEATHER & LOCATION ===================== */}
                        {sec.id === 'weather' && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80">
                                {isTui ? 'CITY_PRESETS:' : 'City Preset'}
                              </label>
                              <div className="grid grid-cols-3 gap-2">
                                {CITY_PRESETS.map((p) => {
                                  const isSelected = coords.city === p.city;
                                  return (
                                    <button
                                      key={p.city}
                                      onClick={() => setCoords(p)}
                                      className={`p-2.5 text-xs font-semibold border transition-all text-left cursor-pointer ${radiusMd} ${
                                        isSelected
                                          ? isTui
                                            ? 'border-2 border-[var(--color-accent,#10b981)] bg-[var(--color-accent,#10b981)] text-black font-bold'
                                            : isBrutalist
                                            ? isLight
                                              ? 'border-2 border-black bg-amber-300 text-black shadow-[2px_2px_0px_#000] font-black'
                                              : 'border-2 border-white bg-amber-400 text-black shadow-[2px_2px_0px_#fff] font-black'
                                            : isLight
                                            ? 'bg-blue-50 text-blue-900 border-blue-400 shadow-xs font-bold'
                                            : 'bg-blue-600/30 text-white border-blue-500 shadow-sm'
                                          : isTui
                                          ? 'border border-[var(--color-accent,#10b981)]/30 bg-black text-[var(--color-accent,#10b981)]'
                                          : isBrutalist
                                          ? isLight
                                            ? 'border-2 border-black bg-white text-black shadow-[1px_1px_0px_#000]'
                                            : 'border-2 border-white bg-black text-white shadow-[1px_1px_0px_#fff]'
                                          : isLight
                                          ? 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-xs'
                                          : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                                      }`}
                                    >
                                      {p.city}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-80">
                                  Latitude
                                </label>
                                <input
                                  type="number"
                                  step="0.0001"
                                  value={coords.latitude}
                                  onChange={(e) => setCoords({ ...coords, latitude: parseFloat(e.target.value) })}
                                  className={`w-full px-4 py-2 text-sm transition-all ${getInputClass()}`}
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-80">
                                  Longitude
                                </label>
                                <input
                                  type="number"
                                  step="0.0001"
                                  value={coords.longitude}
                                  onChange={(e) => setCoords({ ...coords, longitude: parseFloat(e.target.value) })}
                                  className={`w-full px-4 py-2 text-sm transition-all ${getInputClass()}`}
                                />
                              </div>
                            </div>

                            <button
                              onClick={handleSaveWeather}
                              className={`w-full py-2.5 text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer ${getPrimaryButtonClass()}`}
                            >
                              {isSaved ? <Check size={16} /> : <Save size={16} />}
                              <span>{isSaved ? (isTui ? '[SAVED]' : 'Saved!') : (isTui ? '[SAVE_WEATHER]' : 'Save & Refresh Weather')}</span>
                            </button>
                          </div>
                        )}

                        {/* ===================== SECTION 4: PHOTOS & STORAGE ===================== */}
                        {sec.id === 'photos' && (
                          <div className="space-y-4">
                            <div
                              className={`p-4 border ${radiusMd} ${
                                isTui
                                  ? 'border-[var(--color-accent,#10b981)]/40 bg-black/60'
                                  : isBrutalist
                                  ? isLight
                                    ? 'border-2 border-black bg-white shadow-[2px_2px_0px_#000]'
                                    : 'border-2 border-white bg-black shadow-[2px_2px_0px_#fff]'
                                  : isLight
                                  ? 'bg-white border-slate-200 shadow-xs'
                                  : 'bg-white/5 border-white/10'
                              }`}
                            >
                              <div className="flex items-center space-x-2 font-bold text-sm mb-1">
                                <FolderOpen size={16} />
                                <span>Local Directory Storage</span>
                              </div>
                              <p className="text-xs leading-relaxed opacity-80">
                                You can drop any photos (<code className="font-bold underline">.jpg</code>, <code className="font-bold underline">.png</code>, <code className="font-bold underline">.webp</code>) into the local folder:
                              </p>
                              <div
                                className={`mt-2 p-2.5 font-mono text-xs select-all border ${radiusSm} ${
                                  isTui
                                    ? 'border-[var(--color-accent,#10b981)] bg-black text-[var(--color-accent,#10b981)]'
                                    : isBrutalist
                                    ? 'border-2 border-black bg-neutral-100 text-black font-bold'
                                    : isLight
                                    ? 'bg-slate-100 text-emerald-800 border-slate-200'
                                    : 'bg-black/60 text-emerald-400 border-white/10'
                                }`}
                              >
                                Dashboard/public/photos/
                              </div>
                              <p className="text-[11px] mt-2 opacity-70">
                                The dashboard automatically scans this directory via the built-in <code>/api/photos</code> endpoint, preserves authentic aspect ratios without stretching, and displays them.
                              </p>
                            </div>

                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-80">
                                Add Custom Photo URL
                              </label>
                              <div className="flex space-x-2">
                                <input
                                  type="url"
                                  value={customPhotoUrl}
                                  onChange={(e) => setCustomPhotoUrl(e.target.value)}
                                  placeholder="https://example.com/photo.jpg"
                                  className={`flex-1 px-4 py-2 text-sm transition-all ${getInputClass()}`}
                                />
                                <button
                                  onClick={handleAddPhoto}
                                  className={`px-4 py-2 text-xs font-bold transition-all cursor-pointer ${getPrimaryButtonClass()}`}
                                >
                                  Add
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-current/15">
                              <div className="text-xs opacity-80">
                                Current Source:{' '}
                                <span className="font-bold capitalize">
                                  {photoSource}
                                </span>{' '}
                                ({photoService.getPhotos().length} photos)
                              </div>
                              <button
                                onClick={handleResetPhotos}
                                className={`px-3 py-1.5 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${getSecondaryButtonClass()}`}
                              >
                                <RotateCcw size={13} />
                                <span>Reset to Showcase</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* ===================== SECTION 5: DISPLAY & HARDWARE ===================== */}
                        {sec.id === 'display' && (
                          <div className="space-y-4 text-xs">
                            {/* Presentation Layout Option */}
                            <div
                              className={`p-4 border space-y-3 ${radiusMd} ${
                                isTui
                                  ? 'border-[var(--color-accent,#10b981)]/40 bg-black/60'
                                  : isBrutalist
                                  ? isLight
                                    ? 'border-2 border-black bg-white shadow-[2px_2px_0px_#000]'
                                    : 'border-2 border-white bg-black shadow-[2px_2px_0px_#fff]'
                                  : isLight
                                  ? 'bg-white border-slate-200 shadow-xs'
                                  : 'bg-white/5 border-white/10'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="text-sm font-bold mb-0.5">
                                    Settings Presentation Layout
                                  </h4>
                                  <p className="text-xs opacity-75">
                                    Choose whether settings appears as a side drawer sliding in from the right or a centered floating panel.
                                  </p>
                                </div>
                                <span className={getBadgeClass()}>
                                  {settingsLayout}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-3 pt-1">
                                <button
                                  type="button"
                                  onClick={() => setSettingsLayout('drawer')}
                                  className={`p-3.5 border text-left transition-all flex items-start space-x-3 cursor-pointer ${radiusLg} ${
                                    settingsLayout === 'drawer'
                                      ? isTui
                                        ? 'border-2 border-[var(--color-accent,#10b981)] bg-[var(--color-accent,#10b981)]/20 shadow-[0_0_15px_var(--color-glow,rgba(16,185,129,0.3))]'
                                        : isBrutalist
                                        ? isLight
                                          ? 'border-2 border-black bg-amber-300 text-black shadow-[3px_3px_0px_#000]'
                                          : 'border-2 border-white bg-amber-400 text-black shadow-[3px_3px_0px_#fff]'
                                        : isLight
                                        ? 'bg-blue-50 border-blue-500 shadow-xs ring-1 ring-blue-400/50 text-slate-900'
                                        : 'bg-blue-600/15 border-blue-500 shadow-lg ring-1 ring-blue-500/50 text-white'
                                      : isTui
                                      ? 'border border-[var(--color-accent,#10b981)]/30 bg-black/60'
                                      : isBrutalist
                                      ? isLight
                                        ? 'border-2 border-black bg-white shadow-[2px_2px_0px_#000]'
                                        : 'border-2 border-white bg-black shadow-[2px_2px_0px_#fff]'
                                      : isLight
                                      ? 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 shadow-xs'
                                      : 'bg-white/5 border-white/10 hover:border-white/20 text-gray-300'
                                  }`}
                                >
                                  <PanelRight size={20} className="mt-0.5" />
                                  <div>
                                    <div className="text-xs font-bold">
                                      Right Drawer (Default)
                                    </div>
                                    <div className="text-[11px] mt-0.5 leading-relaxed opacity-75">
                                      Full-height side panel anchored to the right edge with smooth slide-in.
                                    </div>
                                  </div>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setSettingsLayout('modal')}
                                  className={`p-3.5 border text-left transition-all flex items-start space-x-3 cursor-pointer ${radiusLg} ${
                                    settingsLayout === 'modal'
                                      ? isTui
                                        ? 'border-2 border-[var(--color-accent,#10b981)] bg-[var(--color-accent,#10b981)]/20 shadow-[0_0_15px_var(--color-glow,rgba(16,185,129,0.3))]'
                                        : isBrutalist
                                        ? isLight
                                          ? 'border-2 border-black bg-amber-300 text-black shadow-[3px_3px_0px_#000]'
                                          : 'border-2 border-white bg-amber-400 text-black shadow-[3px_3px_0px_#fff]'
                                        : isLight
                                        ? 'bg-blue-50 border-blue-500 shadow-xs ring-1 ring-blue-400/50 text-slate-900'
                                        : 'bg-blue-600/15 border-blue-500 shadow-lg ring-1 ring-blue-500/50 text-white'
                                      : isTui
                                      ? 'border border-[var(--color-accent,#10b981)]/30 bg-black/60'
                                      : isBrutalist
                                      ? isLight
                                        ? 'border-2 border-black bg-white shadow-[2px_2px_0px_#000]'
                                        : 'border-2 border-white bg-black shadow-[2px_2px_0px_#fff]'
                                      : isLight
                                      ? 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 shadow-xs'
                                      : 'bg-white/5 border-white/10 hover:border-white/20 text-gray-300'
                                  }`}
                                >
                                  <AppWindow size={20} className="mt-0.5" />
                                  <div>
                                    <div className="text-xs font-bold">
                                      Floating Panel
                                    </div>
                                    <div className="text-[11px] mt-0.5 leading-relaxed opacity-75">
                                      Centered modal dialogue window with backdrop blur.
                                    </div>
                                  </div>
                                </button>
                              </div>
                            </div>

                            <div
                              className={`p-4 border ${radiusMd} ${
                                isTui
                                  ? 'border-[var(--color-accent,#10b981)]/40 bg-black/60'
                                  : isBrutalist
                                  ? isLight
                                    ? 'border-2 border-black bg-white shadow-[2px_2px_0px_#000]'
                                    : 'border-2 border-white bg-black shadow-[2px_2px_0px_#fff]'
                                  : isLight
                                  ? 'bg-white border-slate-200 shadow-xs'
                                  : 'bg-white/5 border-white/10'
                              }`}
                            >
                              <h4 className="text-sm font-bold mb-1">
                                Kiosk Hardware Specifications
                              </h4>
                              <p className="leading-relaxed opacity-75">
                                Display target: Full HD (1920x1080) at 100% DPI scale.
                                Auto-sleep: Screen sleeps between 00:00 and 06:00 IST via DPMS or smart plug.
                              </p>
                            </div>

                            <div
                              className={`p-4 border ${radiusMd} ${
                                isTui
                                  ? 'border-[var(--color-accent,#10b981)]/40 bg-black/60'
                                  : isBrutalist
                                  ? isLight
                                    ? 'border-2 border-black bg-white shadow-[2px_2px_0px_#000]'
                                    : 'border-2 border-white bg-black shadow-[2px_2px_0px_#fff]'
                                  : isLight
                                  ? 'bg-white border-slate-200 shadow-xs'
                                  : 'bg-white/5 border-white/10'
                              }`}
                            >
                              <h4 className="text-sm font-bold mb-2">
                                Chromium Kiosk Flags
                              </h4>
                              <pre
                                className={`p-3 font-mono text-[11px] overflow-x-auto border ${radiusSm} ${
                                  isTui
                                    ? 'bg-black border-[var(--color-accent,#10b981)]/60 text-[var(--color-accent,#10b981)]'
                                    : isBrutalist
                                    ? 'bg-neutral-100 border-2 border-black text-black font-bold'
                                    : isLight
                                    ? 'bg-slate-100 border-slate-200 text-slate-800'
                                    : 'bg-black/60 border-white/10 text-gray-300'
                                }`}
                              >
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
