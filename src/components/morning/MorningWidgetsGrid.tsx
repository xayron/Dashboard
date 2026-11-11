import React, { useState, useEffect, useRef } from 'react';
import { useDashboard } from '../../state/DashboardContext';
import type { MorningWidgetId, MorningWidgetLayoutItem, UIStyle } from '../../types/dashboard';
import {
  Clock,
  Calendar,
  CheckCircle2,
  Circle,
  Sunrise,
  Sunset,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  Newspaper,
  ExternalLink,
  RotateCcw,
  Sliders,
  X,
  GripVertical,
  Check,
  ChevronUp,
  ChevronDown,
  Droplets,
  Wind,
  ShieldAlert,
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudRain,
  CloudSnow,
  CloudRainWind,
  CloudLightning,
  Moon,
  CloudMoon,
  Flame,
  Timer,
  Car,
  Gauge,
  Download,
  Upload,
  Save,
  AlertCircle,
} from 'lucide-react';
import { BrutalistBox } from '../brutalist/BrutalistBox';
import { HudBox } from '../hud/HudBox';
import { TuiBox } from '../tui/TuiBox';
import {
  downloadLayoutBackup,
  readBackupFromFile,
  saveQuickSnapshot,
  restoreQuickSnapshot,
  getQuickSnapshot,
} from '../../services/layoutBackupService';
import type { GridLayoutBackup } from '../../types/dashboard';

export interface MorningWidgetDef {
  id: MorningWidgetId;
  name: string;
  badge: string;
  description: string;
  icon: React.ElementType;
}

export const MORNING_AVAILABLE_WIDGETS: MorningWidgetDef[] = [
  {
    id: 'clock',
    name: 'Digital Clock & Date',
    badge: 'IST TIME',
    description: 'System time in IST, seconds pulse, full calendar date & sunrise times.',
    icon: Clock,
  },
  {
    id: 'weather',
    name: 'Weather Station',
    badge: 'CONDITIONS',
    description: 'Current temperature, condition, feels like, humidity, wind & AQI gauge.',
    icon: CloudSun,
  },
  {
    id: 'calendar',
    name: "Today's Schedule",
    badge: 'AGENDA',
    description: 'Upcoming calendar events, start times, and meeting locations.',
    icon: Calendar,
  },
  {
    id: 'tasks',
    name: 'Priorities & Checklist',
    badge: 'TASKS',
    description: 'Interactive to-do list with click-to-complete and priority tags.',
    icon: CheckCircle2,
  },
  {
    id: 'markets',
    name: 'Markets at Open',
    badge: 'LIVE STOCKS',
    description: 'Live indices, currencies, crypto and day performance sparklines.',
    icon: TrendingUp,
  },
  {
    id: 'news',
    name: 'Morning Briefing Wire',
    badge: 'TOP STORIES',
    description: 'Curated morning news headlines and breaking news wire.',
    icon: Newspaper,
  },
  {
    id: 'timeProgress',
    name: 'Time & Year Progress',
    badge: 'CHRONO',
    description: 'Year, quarter, and month elapsed progress bars with week and day countdown.',
    icon: Timer,
  },
  {
    id: 'traffic',
    name: 'Traffic to Office',
    badge: 'COMMUTE',
    description: 'Live commute route, ETA, distance, delay alerts, and congestion status.',
    icon: Car,
  },
  {
    id: 'aqi',
    name: 'Current AQI',
    badge: 'AIR QUALITY',
    description: 'Dedicated US AQI meter, PM2.5/PM10 breakdown, and health advisories.',
    icon: Gauge,
  },
];

export const DEFAULT_MORNING_SLOT_LAYOUT: Record<MorningWidgetId, MorningWidgetLayoutItem> = {
  clock:        { col: 1, row: 1, colSpan: 4, rowSpan: 1 },
  weather:      { col: 1, row: 2, colSpan: 4, rowSpan: 2 },
  timeProgress: { col: 1, row: 4, colSpan: 4, rowSpan: 1 },
  calendar:     { col: 5, row: 1, colSpan: 4, rowSpan: 2 },
  tasks:        { col: 5, row: 3, colSpan: 4, rowSpan: 1 },
  traffic:      { col: 5, row: 4, colSpan: 4, rowSpan: 1 },
  markets:      { col: 9, row: 1, colSpan: 4, rowSpan: 2 },
  news:         { col: 9, row: 3, colSpan: 4, rowSpan: 1 },
  aqi:          { col: 9, row: 4, colSpan: 4, rowSpan: 1 },
};

export const collides = (a: MorningWidgetLayoutItem, b: MorningWidgetLayoutItem): boolean => {
  return !(
    a.col + a.colSpan <= b.col ||
    b.col + b.colSpan <= a.col ||
    a.row + a.rowSpan <= b.row ||
    b.row + b.rowSpan <= a.row
  );
};

export function resolveCollisions(
  baseLayout: Record<MorningWidgetId, MorningWidgetLayoutItem>,
  activeId: MorningWidgetId,
  activeItem: MorningWidgetLayoutItem,
  widgetIds: MorningWidgetId[]
): Record<MorningWidgetId, MorningWidgetLayoutItem> {
  const result: Record<MorningWidgetId, MorningWidgetLayoutItem> = {
    ...baseLayout,
    [activeId]: { ...activeItem },
  };

  const otherIds = widgetIds.filter((id) => id !== activeId);

  let changed = true;
  let iterations = 0;
  const MAX_ITERATIONS = 40;

  while (changed && iterations < MAX_ITERATIONS) {
    changed = false;
    iterations++;

    // 1. Any other widget colliding with the actively moved/resized widget MUST shift down below it
    for (const otherId of otherIds) {
      const otherItem = result[otherId];
      if (!otherItem) continue;
      if (collides(result[activeId], otherItem)) {
        result[otherId] = {
          ...otherItem,
          row: result[activeId].row + result[activeId].rowSpan,
        };
        changed = true;
      }
    }

    // 2. Cascade down any secondary collisions among the other widgets
    const currentSorted = [...otherIds].sort((a, b) => {
      const rowA = result[a]?.row ?? 1;
      const rowB = result[b]?.row ?? 1;
      if (rowA !== rowB) return rowA - rowB;
      const colA = result[a]?.col ?? 1;
      const colB = result[b]?.col ?? 1;
      return colA - colB;
    });

    for (let i = 0; i < currentSorted.length; i++) {
      const idA = currentSorted[i];
      const itemA = result[idA];
      if (!itemA) continue;

      for (let j = i + 1; j < currentSorted.length; j++) {
        const idB = currentSorted[j];
        const itemB = result[idB];
        if (!itemB) continue;

        if (collides(itemA, itemB)) {
          result[idB] = {
            ...itemB,
            row: itemA.row + itemA.rowSpan,
          };
          changed = true;
        }
      }
    }
  }

  return result;
}

export function deoverlapAll(
  layout: Record<MorningWidgetId, MorningWidgetLayoutItem>,
  widgetIds: MorningWidgetId[]
): Record<MorningWidgetId, MorningWidgetLayoutItem> {
  const result: Record<MorningWidgetId, MorningWidgetLayoutItem> = { ...layout };
  for (const id of widgetIds) {
    if (!result[id] && DEFAULT_MORNING_SLOT_LAYOUT[id]) {
      result[id] = { ...DEFAULT_MORNING_SLOT_LAYOUT[id] };
    }
  }

  let changed = true;
  let iterations = 0;
  const MAX_ITERATIONS = 40;

  while (changed && iterations < MAX_ITERATIONS) {
    changed = false;
    iterations++;

    const currentSorted = [...widgetIds].sort((a, b) => {
      const itemA = result[a] || DEFAULT_MORNING_SLOT_LAYOUT[a];
      const itemB = result[b] || DEFAULT_MORNING_SLOT_LAYOUT[b];
      if (itemA.row !== itemB.row) return itemA.row - itemB.row;
      return itemA.col - itemB.col;
    });

    for (let i = 0; i < currentSorted.length; i++) {
      const idA = currentSorted[i];
      const itemA = result[idA];
      if (!itemA) continue;

      for (let j = i + 1; j < currentSorted.length; j++) {
        const idB = currentSorted[j];
        const itemB = result[idB];
        if (!itemB) continue;

        if (collides(itemA, itemB)) {
          result[idB] = {
            ...itemB,
            row: itemA.row + itemA.rowSpan,
          };
          changed = true;
        }
      }
    }
  }

  return result;
}

interface MorningWidgetsGridProps {
  uiStyle?: UIStyle;
  isLight?: boolean;
  className?: string;
}

export const MorningWidgetsGrid: React.FC<MorningWidgetsGridProps> = ({
  uiStyle: propUiStyle,
  isLight: propIsLight,
  className = '',
}) => {
  const {
    now,
    weather,
    aqi,
    events,
    tasks,
    toggleTask,
    finance,
    news,
    morningActiveWidgets,
    setMorningActiveWidgets,
    toggleMorningWidget,
    moveMorningWidget,
    reorderMorningWidgets,
    colorMode,
    uiStyle: contextUiStyle,
    isKioskMode,
  } = useDashboard();

  const uiStyle = propUiStyle || contextUiStyle;
  const isLight = propIsLight !== undefined ? propIsLight : colorMode === 'light';

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

  interface ResizingState {
    widgetId: MorningWidgetId;
    dir: ResizeDirection;
    startX: number;
    startY: number;
    startScrollTop: number;
    startCol: number;
    startRow: number;
    startColSpan: number;
    startRowSpan: number;
    baseLayout: Record<MorningWidgetId, MorningWidgetLayoutItem>;
  }

  interface MovingState {
    widgetId: MorningWidgetId;
    startX: number;
    startY: number;
    startScrollTop: number;
    startCol: number;
    startRow: number;
    colSpan: number;
    rowSpan: number;
    baseLayout: Record<MorningWidgetId, MorningWidgetLayoutItem>;
  }

  const [slotLayout, setSlotLayout] = useState<Record<MorningWidgetId, MorningWidgetLayoutItem>>(() => {
    try {
      const saved = localStorage.getItem('dashboard_morning_slot_layout');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed === 'object' && parsed !== null) {
          const merged = { ...DEFAULT_MORNING_SLOT_LAYOUT, ...parsed };
          return deoverlapAll(merged, morningActiveWidgets);
        }
      }
    } catch (e) {}
    return deoverlapAll(DEFAULT_MORNING_SLOT_LAYOUT, morningActiveWidgets);
  });

  const latestSlotLayoutRef = useRef(slotLayout);
  useEffect(() => {
    latestSlotLayoutRef.current = slotLayout;
  }, [slotLayout]);

  // Ensure active widgets never overlap if active list changes
  useEffect(() => {
    setSlotLayout((prev) => {
      const deoverlapped = deoverlapAll(prev, morningActiveWidgets);
      let changed = false;
      for (const id of morningActiveWidgets) {
        if (
          !prev[id] ||
          prev[id].row !== deoverlapped[id]?.row ||
          prev[id].col !== deoverlapped[id]?.col ||
          prev[id].colSpan !== deoverlapped[id]?.colSpan ||
          prev[id].rowSpan !== deoverlapped[id]?.rowSpan
        ) {
          changed = true;
          break;
        }
      }
      if (changed) {
        try {
          localStorage.setItem('dashboard_morning_slot_layout', JSON.stringify(deoverlapped));
        } catch (e) {}
        return deoverlapped;
      }
      return prev;
    });
  }, [morningActiveWidgets]);

  const [resizingState, setResizingState] = useState<ResizingState | null>(null);
  const [movingState, setMovingState] = useState<MovingState | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [backupFeedback, setBackupFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setBackupFeedback({ type, message });
    setTimeout(() => setBackupFeedback(null), 4000);
  };

  // Listen for global layout restore event
  useEffect(() => {
    const handleRestore = (e: Event) => {
      const customEvent = e as CustomEvent<GridLayoutBackup>;
      if (customEvent.detail?.morning?.slotLayout) {
        setSlotLayout(customEvent.detail.morning.slotLayout);
      } else {
        try {
          const saved = localStorage.getItem('dashboard_morning_slot_layout');
          if (saved) setSlotLayout(JSON.parse(saved));
        } catch (err) {}
      }
    };
    window.addEventListener('dashboard_layout_restored', handleRestore);
    return () => window.removeEventListener('dashboard_layout_restored', handleRestore);
  }, []);

  const handleExport = () => {
    downloadLayoutBackup('morning');
    showFeedback('success', 'Morning layout exported as JSON.');
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const res = await readBackupFromFile(file);
    if (res.success) {
      showFeedback('success', `Restored ${res.restored?.join(' & ') || 'layout'} successfully!`);
    } else {
      showFeedback('error', res.error || 'Failed to restore layout from file.');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleQuickSnapshotSave = () => {
    const res = saveQuickSnapshot();
    if (res.success) {
      showFeedback('success', 'Quick snapshot saved to browser storage.');
    } else {
      showFeedback('error', 'Failed to save snapshot.');
    }
  };

  const handleQuickSnapshotRestore = () => {
    const res = restoreQuickSnapshot();
    if (res.success) {
      showFeedback('success', 'Quick snapshot restored successfully.');
    } else {
      showFeedback('error', res.error || 'No saved snapshot found.');
    }
  };

  const resetSlotLayout = () => {
    setSlotLayout(DEFAULT_MORNING_SLOT_LAYOUT);
    try {
      localStorage.setItem('dashboard_morning_slot_layout', JSON.stringify(DEFAULT_MORNING_SLOT_LAYOUT));
      showFeedback('success', 'Reset morning grid to default slot layout.');
    } catch (e) {}
  };

  // Mouse Move & Mouse Up Listener for 8-Direction Resizing and Slot Moving with Collision Auto-Shift
  useEffect(() => {
    if (!movingState && !resizingState) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!gridRef.current) return;
      const gridRect = gridRef.current.getBoundingClientRect();
      const gap = 16;
      const cellW = (gridRect.width - gap * 11) / 12;
      const cellH = 140;

      if (movingState) {
        const currentScrollTop = gridRef.current ? gridRef.current.scrollTop : 0;
        const deltaX = e.clientX - movingState.startX;
        const deltaY = (e.clientY - movingState.startY) + (currentScrollTop - movingState.startScrollTop);

        const deltaCols = Math.round(deltaX / (cellW + gap));
        const deltaRows = Math.round(deltaY / (cellH + gap));

        const newCol = Math.max(1, Math.min(13 - movingState.colSpan, movingState.startCol + deltaCols));
        const newRow = Math.max(1, movingState.startRow + deltaRows);

        const newLayout = resolveCollisions(
          movingState.baseLayout,
          movingState.widgetId,
          {
            col: newCol,
            row: newRow,
            colSpan: movingState.colSpan,
            rowSpan: movingState.rowSpan,
          },
          morningActiveWidgets
        );

        setSlotLayout(newLayout);
      } else if (resizingState) {
        const currentScrollTop = gridRef.current ? gridRef.current.scrollTop : 0;
        const deltaX = e.clientX - resizingState.startX;
        const deltaY = (e.clientY - resizingState.startY) + (currentScrollTop - resizingState.startScrollTop);

        const deltaCols = Math.round(deltaX / (cellW + gap));
        const deltaRows = Math.round(deltaY / (cellH + gap));

        const { dir, startCol, startRow, startColSpan, startRowSpan, widgetId, baseLayout } = resizingState;

        let newCol = startCol;
        let newRow = startRow;
        let newColSpan = startColSpan;
        let newRowSpan = startRowSpan;

        if (dir.includes('e')) {
          newColSpan = Math.max(2, Math.min(13 - startCol, startColSpan + deltaCols));
        } else if (dir.includes('w')) {
          const maxLeftShift = startColSpan - 2;
          const shift = Math.max(-startCol + 1, Math.min(maxLeftShift, -deltaCols));
          newCol = startCol - shift;
          newColSpan = startColSpan + shift;
        }

        if (dir.includes('s')) {
          newRowSpan = Math.max(1, Math.min(6, startRowSpan + deltaRows));
        } else if (dir.includes('n')) {
          const maxUpShift = startRowSpan - 1;
          const shift = Math.max(-startRow + 1, Math.min(maxUpShift, -deltaRows));
          newRow = startRow - shift;
          newRowSpan = startRowSpan + shift;
        }

        const newLayout = resolveCollisions(
          baseLayout,
          widgetId,
          {
            col: newCol,
            row: newRow,
            colSpan: newColSpan,
            rowSpan: newRowSpan,
          },
          morningActiveWidgets
        );

        setSlotLayout(newLayout);
      }
    };

    const handleMouseUp = () => {
      setMovingState(null);
      setResizingState(null);
      try {
        localStorage.setItem('dashboard_morning_slot_layout', JSON.stringify(latestSlotLayoutRef.current));
      } catch (e) {}
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [movingState, resizingState, morningActiveWidgets]);

  const handleMoveStart = (e: React.MouseEvent, widgetId: MorningWidgetId) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a') || target.closest('input')) return;
    e.preventDefault();
    const current = slotLayout[widgetId] || DEFAULT_MORNING_SLOT_LAYOUT[widgetId];
    setMovingState({
      widgetId,
      startX: e.clientX,
      startY: e.clientY,
      startScrollTop: gridRef.current ? gridRef.current.scrollTop : 0,
      startCol: current.col,
      startRow: current.row,
      colSpan: current.colSpan,
      rowSpan: current.rowSpan,
      baseLayout: { ...slotLayout },
    });
  };

  const handleResizeStart = (e: React.MouseEvent, widgetId: MorningWidgetId, dir: ResizeDirection) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const current = slotLayout[widgetId] || DEFAULT_MORNING_SLOT_LAYOUT[widgetId];
    setResizingState({
      widgetId,
      dir,
      startX: e.clientX,
      startY: e.clientY,
      startScrollTop: gridRef.current ? gridRef.current.scrollTop : 0,
      startCol: current.col,
      startRow: current.row,
      startColSpan: current.colSpan,
      startRowSpan: current.rowSpan,
      baseLayout: { ...slotLayout },
    });
  };

  const visibleWidgets = React.useMemo(() => {
    return morningActiveWidgets
      .map((id) => MORNING_AVAILABLE_WIDGETS.find((w) => w.id === id))
      .filter((w): w is MorningWidgetDef => Boolean(w));
  }, [morningActiveWidgets]);

  // Card Theme classes
  const getCardClass = (isCompact: boolean) => {
    const pad = isCompact
      ? 'p-2.5 xl:p-3 h-full overflow-hidden flex flex-col justify-between'
      : 'p-3 xl:p-3.5 h-full overflow-hidden flex flex-col justify-between';

    if (uiStyle === 'tui') {
      return `${pad} ${
        isLight
          ? 'bg-white/95 border border-black/30 font-mono text-slate-900 rounded-none shadow-xs'
          : 'bg-black/90 border border-white/20 font-mono text-gray-100 rounded-none shadow-md'
      }`;
    }
    if (uiStyle === 'brutalist') {
      return `${pad} ${
        isLight
          ? 'bg-white border-2 border-black text-black rounded-none shadow-[3px_3px_0px_#000]'
          : 'bg-black border-2 border-white text-white rounded-none shadow-[3px_3px_0px_#fff]'
      }`;
    }
    if (uiStyle === 'hud') {
      return `${pad} ${
        isLight
          ? 'bg-white/95 border border-cyan-500/40 text-slate-900 font-mono rounded-none shadow-xs'
          : 'bg-[#040814]/90 border border-cyan-500/40 text-cyan-100 font-mono rounded-none shadow-[0_0_15px_rgba(0,240,255,0.1)]'
      }`;
    }
    if (uiStyle === 'minimal') {
      return `${pad} ${
        isLight
          ? 'bg-neutral-50/90 border border-neutral-200 rounded-2xl text-neutral-900 shadow-xs'
          : 'bg-white/[0.03] border border-white/10 rounded-2xl text-neutral-100 shadow-md'
      }`;
    }
    if (uiStyle === 'eink') {
      return `${pad} ${
        isLight
          ? 'border-2 border-stone-800 bg-[#ede8df] text-[#1c1917] rounded-none'
          : 'border-2 border-stone-600 bg-[#292524] text-[#f5f2eb] rounded-none'
      }`;
    }
    if (uiStyle === 'retrowave') {
      return `${pad} ${
        isLight
          ? 'bg-pink-50/90 border-2 border-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.15)] text-pink-950 rounded-2xl'
          : 'bg-[#1e0736]/90 border-2 border-pink-500 shadow-[0_0_25px_rgba(255,0,127,0.25)] text-pink-100 rounded-2xl'
      }`;
    }
    if (uiStyle === 'neumorphic') {
      return `${pad} ${
        isLight
          ? 'bg-[#e2e8f0] shadow-[5px_5px_10px_#cbd5e1,-5px_-5px_10px_#ffffff] text-slate-900 rounded-2xl'
          : 'bg-[#1a1d24] shadow-[5px_5px_10px_#101217,-5px_-5px_10px_#242831] text-neutral-200 rounded-2xl'
      }`;
    }
    if (uiStyle === 'obsidian') {
      return `${pad} ${
        isLight
          ? 'bg-white/95 border border-slate-200 text-slate-900 shadow-sm rounded-2xl'
          : 'bg-[#0f0f15] border border-white/[0.14] text-[#eef0f3] shadow-md rounded-2xl'
      }`;
    }
    if (uiStyle === 'civic') {
      return `${pad} ${
        isLight
          ? 'bg-white border border-slate-300 rounded-2xl shadow-sm text-slate-900'
          : 'bg-slate-900/90 border border-slate-700 rounded-2xl shadow-md text-slate-100'
      }`;
    }
    // Modern Glass
    return `${pad} ${
      isLight
        ? 'glass-panel bg-white/80 border border-slate-200 rounded-2xl text-slate-900 shadow-sm'
        : 'glass-panel border border-white/10 bg-white/[0.03] rounded-2xl text-white shadow-md'
    }`;
  };

  const getInnerClass = () => {
    if (uiStyle === 'tui') {
      return isLight ? 'bg-black/[0.04] border border-black/20 font-mono' : 'bg-white/5 border border-white/10 font-mono';
    }
    if (uiStyle === 'brutalist') {
      return isLight ? 'bg-white border-2 border-black' : 'bg-neutral-900 border-2 border-white';
    }
    if (uiStyle === 'hud') {
      return isLight ? 'bg-cyan-50/70 border border-cyan-500/30 font-mono' : 'bg-cyan-950/20 border border-cyan-500/30 font-mono text-cyan-200';
    }
    if (uiStyle === 'minimal') {
      return isLight ? 'bg-neutral-100 border border-neutral-200' : 'bg-white/5 border border-white/10';
    }
    if (uiStyle === 'eink') {
      return isLight ? 'border border-stone-400 bg-stone-200/60' : 'border border-stone-600 bg-stone-800/60';
    }
    if (uiStyle === 'retrowave') {
      return isLight ? 'bg-white/70 border border-pink-200' : 'bg-black/40 border border-pink-500/30';
    }
    if (uiStyle === 'neumorphic') {
      return isLight
        ? 'bg-[#e2e8f0] shadow-[inset_2px_2px_4px_#cbd5e1,inset_-2px_-2px_4px_#ffffff]'
        : 'bg-[#1a1d24] shadow-[inset_2px_2px_4px_#101217,inset_-2px_-2px_4px_#242831]';
    }
    if (uiStyle === 'civic') {
      return isLight ? 'bg-slate-50 border border-slate-200' : 'bg-slate-800/80 border border-slate-700/80';
    }
    // Modern Glass
    return isLight ? 'bg-black/[0.03] border border-black/[0.06]' : 'bg-white/5 border border-white/10';
  };

  const fontClass = uiStyle === 'tui' || uiStyle === 'hud' ? 'font-mono' : uiStyle === 'eink' ? 'font-serif' : 'font-sans';

  // Render header control items with Dimension Pill and Grip Handle at far right
  const renderCardControls = (widgetId: MorningWidgetId) => {
    if (isKioskMode) return null;
    const layout = slotLayout[widgetId] || DEFAULT_MORNING_SLOT_LAYOUT[widgetId];
    const isActivelyMoved = movingState?.widgetId === widgetId;
    const isActivelyResized = resizingState?.widgetId === widgetId;

    return (
      <div className="flex items-center space-x-1.5 opacity-80 hover:opacity-100 transition-opacity">
        {/* Dimension & Slot Pill */}
        <span
          className={`text-[9px] font-mono px-1.5 py-0.5 rounded border transition-colors ${
            isActivelyMoved || isActivelyResized
              ? 'bg-blue-500/20 text-blue-400 border-blue-500/40 font-bold'
              : 'bg-black/10 dark:bg-white/10 border-black/5 dark:border-white/10 text-current/70'
          }`}
          title={`Slot: Col ${layout.col}, Row ${layout.row} | Size: ${layout.colSpan} cols × ${layout.rowSpan} rows (Drag edges or corners to resize)`}
        >
          {layout.colSpan}×{layout.rowSpan}
        </span>

        {/* Drag Handle Grip */}
        <div
          onMouseDown={(e) => handleMoveStart(e, widgetId)}
          title="Drag to place anywhere on the grid"
          className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-black/15 dark:hover:bg-white/15 text-current/70 hover:text-current transition-colors"
        >
          <GripVertical size={13} />
        </div>
      </div>
    );
  };

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const dateFormatted = now.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
  const dayNumber = now.getDate();
  const monthLong = now.toLocaleDateString('en-US', { month: 'long' });
  const monthShort = now.toLocaleDateString('en-US', { month: 'short' });
  const yearNumber = now.getFullYear();

  // 1. CLOCK WIDGET
  const renderClockWidget = (layout: MorningWidgetLayoutItem) => {
    const isCompact = layout.colSpan <= 3 && layout.rowSpan === 1;
    const isTall = layout.rowSpan >= 2;
    const isWide = layout.colSpan >= 5 && !isTall;

    if (uiStyle === 'tui') {
      return (
        <TuiBox
          title="SYSTEM_CLOCK"
          badge="IST UTC+5:30"
          headerRight={renderCardControls('clock')}
          className="h-full flex flex-col justify-between"
        >
          <div className="flex flex-col items-center justify-center py-2 flex-1">
            <div className={`font-extrabold tracking-wider flex items-baseline font-mono ${isTall ? 'text-6xl sm:text-7xl' : 'text-4xl sm:text-5xl'}`}>
              <span>{hours}:{minutes}</span>
              <span className="text-2xl sm:text-3xl ml-2 animate-pulse tabular-nums" style={{ color: 'var(--color-accent)' }}>:{seconds}</span>
            </div>
            <div className="mt-1 text-xs font-bold tracking-widest text-center" style={{ color: 'var(--color-accent)' }}>
              {dateFormatted.toUpperCase()}
            </div>
            {isTall && (
              <div className="text-[10px] mt-2 opacity-70 font-mono">
                SUNRISE: {weather.sunrise} | SUNSET: {weather.sunset}
              </div>
            )}
          </div>
        </TuiBox>
      );
    }

    if (uiStyle === 'brutalist') {
      return (
        <BrutalistBox
          title="SYSTEM TIME"
          badge="IST"
          headerRight={renderCardControls('clock')}
          className="h-full flex flex-col justify-between"
        >
          <div className="flex flex-col justify-between flex-1 py-1">
            <div className="flex items-baseline space-x-2 font-mono">
              <span className={`font-black tracking-tight leading-none ${isTall ? 'text-6xl sm:text-7xl' : 'text-4xl sm:text-5xl'}`}>{hours}:{minutes}</span>
              <span className="text-2xl sm:text-3xl font-black text-red-500 animate-pulse tabular-nums">:{seconds}</span>
            </div>
            <div className="font-mono text-xs font-bold uppercase mt-1 border-t-2 border-black pt-1">
              {dateFormatted}
            </div>
            {isTall && (
              <div className="text-[10px] font-mono opacity-80 mt-1">
                Sunrise {weather.sunrise} • Sunset {weather.sunset}
              </div>
            )}
          </div>
        </BrutalistBox>
      );
    }

    if (uiStyle === 'hud') {
      return (
        <HudBox
          title="SYS_TIME"
          code="IST_ZONE"
          glowColor="cyan"
          headerRight={renderCardControls('clock')}
          className="h-full flex flex-col justify-between"
        >
          <div className="flex flex-col justify-between flex-1 py-1 font-mono">
            <div className={`font-black tracking-widest text-cyan-400 flex items-baseline leading-none ${isTall ? 'text-6xl sm:text-7xl' : 'text-4xl sm:text-5xl'}`}>
              <span>{hours}:{minutes}</span>
              <span className="text-2xl sm:text-3xl ml-1 text-rose-500 animate-pulse tabular-nums">:{seconds}</span>
            </div>
            <div className="text-xs uppercase tracking-wider text-cyan-300 mt-1">
              {dateFormatted}
            </div>
            {isTall && (
              <div className="text-[10px] text-gray-400 mt-1">
                DAWN: {weather.sunrise} // DUSK: {weather.sunset}
              </div>
            )}
          </div>
        </HudBox>
      );
    }

    // Default Glass / Modern / Minimal / Civic
    return (
      <div className={getCardClass(isCompact)}>
        <div className="flex items-center justify-between mb-1 shrink-0">
          <span className="text-[10px] uppercase font-bold tracking-wider flex items-center space-x-1.5 opacity-80 truncate">
            <Clock size={12} className="text-amber-500 shrink-0" />
            <span className="truncate">{isCompact ? 'Time' : 'System Time (IST)'}</span>
          </span>
          <div className="flex items-center space-x-1.5 shrink-0">
            {!isCompact && (
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-500 border border-amber-500/20 font-bold">
                UTC+5:30
              </span>
            )}
            {renderCardControls('clock')}
          </div>
        </div>

        {isWide ? (
          <div className="flex-1 flex items-center justify-between min-h-0 py-0.5">
            <div className="flex items-baseline space-x-1.5 font-mono">
              <span className="font-black tracking-tight text-4xl sm:text-5xl xl:text-6xl leading-none">
                {hours}:{minutes}
              </span>
              <span className="text-xl sm:text-2xl font-bold animate-pulse tabular-nums" style={{ color: 'var(--color-accent)' }}>
                :{seconds}
              </span>
            </div>
            <div className="text-right">
              <p className="text-xs sm:text-sm font-semibold tracking-wide" style={{ color: 'var(--color-accent)' }}>
                {dateFormatted}
              </p>
              <p className="text-[10px] opacity-70 mt-0.5 font-mono">
                Dawn {weather.sunrise} • Dusk {weather.sunset}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-center min-h-0 py-0.5 space-y-1">
            <div className="flex items-baseline space-x-1.5 font-mono">
              <span className={`font-black tracking-tight leading-none ${isTall ? 'text-6xl sm:text-7xl xl:text-8xl' : 'text-4xl sm:text-5xl xl:text-6xl'}`}>
                {hours}:{minutes}
              </span>
              <span className={`font-bold animate-pulse tabular-nums ${isTall ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`} style={{ color: 'var(--color-accent)' }}>
                :{seconds}
              </span>
            </div>

            <div className="mt-0.5">
              <p className="text-xs sm:text-sm font-semibold tracking-wide truncate" style={{ color: 'var(--color-accent)' }}>
                {dateFormatted}
              </p>
              {isTall && (
                <div className={`mt-2 pt-2 border-t text-[11px] flex items-center justify-between opacity-80 ${isLight ? 'border-black/10' : 'border-white/10'}`}>
                  <span className="flex items-center">
                    <Sunrise size={12} className="mr-1 text-amber-400" /> Sunrise {weather.sunrise}
                  </span>
                  <span className="flex items-center">
                    <Sunset size={12} className="mr-1 text-rose-400" /> Sunset {weather.sunset}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Helper to render weather icon by condition code
  const renderWeatherIcon = (code: number, isDay: boolean, size = 18) => {
    if (code === 0) return isDay ? <Sun size={size} className="text-amber-400" /> : <Moon size={size} className="text-indigo-300" />;
    if (code <= 3) return isDay ? <CloudSun size={size} className="text-amber-300" /> : <CloudMoon size={size} className="text-slate-300" />;
    if (code <= 48) return <CloudFog size={size} className="text-gray-400" />;
    if (code <= 67) return <CloudRain size={size} className="text-blue-400" />;
    if (code <= 77) return <CloudSnow size={size} className="text-cyan-200" />;
    if (code <= 82) return <CloudRainWind size={size} className="text-blue-500" />;
    return <CloudLightning size={size} className="text-yellow-400" />;
  };

  // 2. WEATHER WIDGET
  const renderWeatherWidget = (layout: MorningWidgetLayoutItem) => {
    const isCompact = layout.colSpan <= 3 && layout.rowSpan === 1;
    const isTall = layout.rowSpan >= 2;
    const isWide = layout.colSpan >= 5;

    if (uiStyle === 'tui') {
      return (
        <TuiBox
          title="WEATHER_STATION"
          badge={weather.condition.toUpperCase()}
          headerRight={renderCardControls('weather')}
          className="h-full flex flex-col justify-between"
        >
          <div className="flex flex-col justify-between flex-1 py-1 font-mono text-xs min-h-0">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold">{weather.temperature}°C</span>
              <span className="text-xs opacity-75">{weather.highTemp}° / {weather.lowTemp}°</span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[10px] mt-1.5 border-t pt-1">
              <div>FEELS: {weather.apparentTemperature}°C</div>
              <div>AQI: {aqi.usAqi} ({aqi.label})</div>
              <div>HUMIDITY: {weather.humidity}%</div>
              <div>WIND: {weather.windSpeed} km/h</div>
            </div>
            {isTall && weather.hourly && weather.hourly.length > 0 && (
              <div className="mt-2 pt-1 border-t border-dashed border-emerald-500/30">
                <div className="text-[9px] uppercase tracking-wider text-emerald-400 font-bold mb-1">
                  &gt; HOURLY_FORECAST
                </div>
                <div className="grid grid-cols-5 gap-1 text-[10px]">
                  {weather.hourly.slice(0, 5).map((h, i) => (
                    <div key={i} className="text-center p-1 bg-black/40 border border-emerald-500/20 rounded">
                      <div className="text-[9px] opacity-70">{h.time}</div>
                      <div className="font-bold my-0.5">{h.temp}°</div>
                      <div className="text-[8px] text-cyan-400">{h.pop}%</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TuiBox>
      );
    }

    if (uiStyle === 'brutalist') {
      return (
        <BrutalistBox
          title="METEOROLOGY"
          badge={`${weather.temperature}°C`}
          headerRight={renderCardControls('weather')}
          className="h-full flex flex-col justify-between"
        >
          <div className="flex flex-col justify-between flex-1 py-1 font-mono min-h-0">
            <div className="flex items-baseline justify-between border-b-2 border-black pb-1">
              <span className="text-2xl font-black">{weather.condition}</span>
              <span className="text-xs font-bold">{weather.highTemp}° / {weather.lowTemp}°</span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[10px] pt-1">
              <div>FEELS: {weather.apparentTemperature}°C</div>
              <div>AQI: {aqi.usAqi}</div>
              <div>WIND: {weather.windSpeed}KM/H</div>
              <div>HUM: {weather.humidity}%</div>
            </div>
            {isTall && weather.hourly && weather.hourly.length > 0 && (
              <div className="mt-2 pt-1 border-t-2 border-black">
                <div className="text-[9px] font-black uppercase mb-1">UPCOMING HOURS</div>
                <div className="grid grid-cols-5 gap-1 text-[10px]">
                  {weather.hourly.slice(0, 5).map((h, i) => (
                    <div key={i} className="border border-black p-1 text-center bg-yellow-200 text-black">
                      <div className="text-[8px] font-bold">{h.time}</div>
                      <div className="font-black text-[11px]">{h.temp}°</div>
                      <div className="text-[8px]">{h.pop}%</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </BrutalistBox>
      );
    }

    if (uiStyle === 'hud') {
      return (
        <HudBox
          title="ATMOSPHERE"
          code={`${weather.temperature}C_TEMP`}
          glowColor="cyan"
          headerRight={renderCardControls('weather')}
          className="h-full flex flex-col justify-between"
        >
          <div className="flex flex-col justify-between flex-1 py-1 font-mono min-h-0">
            <div className="flex items-baseline justify-between text-cyan-400">
              <span className="text-3xl font-black">{weather.temperature}°C</span>
              <span className="text-xs text-rose-400">{weather.condition}</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[10px] mt-2 border-t border-cyan-500/20 pt-1 text-gray-300">
              <span>FEEL: {weather.apparentTemperature}°C</span>
              <span>AQI: {aqi.usAqi} ({aqi.label})</span>
              <span>WIND: {weather.windSpeed}KM/H</span>
              <span>HUM: {weather.humidity}%</span>
            </div>
            {isTall && weather.hourly && weather.hourly.length > 0 && (
              <div className="mt-2 pt-1 border-t border-cyan-500/30">
                <div className="text-[9px] uppercase tracking-wider text-cyan-300 font-bold mb-1 flex items-center justify-between">
                  <span>RADAR_PROJECTION</span>
                  <span className="text-[8px] text-cyan-500">HOURLY</span>
                </div>
                <div className="grid grid-cols-5 gap-1 text-[10px]">
                  {weather.hourly.slice(0, 5).map((h, i) => (
                    <div key={i} className="text-center p-1 bg-cyan-950/40 border border-cyan-500/30 rounded">
                      <div className="text-[8px] text-cyan-400/70">{h.time}</div>
                      <div className="font-bold text-cyan-200">{h.temp}°</div>
                      <div className="text-[8px] text-teal-400">{h.pop}%</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </HudBox>
      );
    }

    // Default Glass / Minimal / Civic
    return (
      <div className={getCardClass(isCompact)}>
        <div className="flex items-center justify-between mb-1 shrink-0">
          <span className="text-[10px] uppercase font-bold tracking-wider flex items-center space-x-1.5 opacity-80 truncate">
            <CloudSun size={12} className="text-cyan-400 shrink-0" />
            <span className="truncate">{isCompact ? 'Weather' : 'Local Weather & AQI'}</span>
          </span>
          <div className="flex items-center space-x-1.5 shrink-0">
            {!isCompact && (
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-500 border border-cyan-500/20 font-bold">
                AQI {aqi.usAqi}
              </span>
            )}
            {renderCardControls('weather')}
          </div>
        </div>

        {/* 1-row layout (height 140px) */}
        {!isTall ? (
          <div className="flex-1 flex items-center justify-between min-h-0 py-0.5">
            <div>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-3xl font-black tracking-tight">
                  {weather.temperature}°
                </span>
                <span className="text-xs font-semibold opacity-75">{weather.condition}</span>
              </div>
              <p className="text-[10px] opacity-70 mt-0.5 font-mono">
                H {weather.highTemp}° • L {weather.lowTemp}°
              </p>
            </div>

            {isWide ? (
              <div className="flex items-center space-x-3">
                <div className="grid grid-cols-2 gap-1 text-xs font-mono text-center">
                  <div className={`px-2 py-0.5 rounded-lg border ${getInnerClass()}`}>
                    <span className="block text-[7px] uppercase opacity-70">Feels</span>
                    <span className="font-bold text-[11px] block">{weather.apparentTemperature}°</span>
                  </div>
                  <div className={`px-2 py-0.5 rounded-lg border ${getInnerClass()}`}>
                    <span className="block text-[7px] uppercase opacity-70">AQI</span>
                    <span className="font-bold text-[11px] text-emerald-400 block">{aqi.usAqi}</span>
                  </div>
                </div>
                {/* 4-hour forecast strip */}
                {weather.hourly && weather.hourly.length > 0 && (
                  <div className="flex items-center space-x-1">
                    {weather.hourly.slice(0, 4).map((h, i) => (
                      <div
                        key={i}
                        className={`flex flex-col items-center px-1.5 py-1 rounded-lg border text-center ${getInnerClass()}`}
                      >
                        <span className="text-[8px] opacity-70 font-mono-numbers">{h.time}</span>
                        <div className="my-0.5">{renderWeatherIcon(h.conditionCode, true, 13)}</div>
                        <span className="text-[10px] font-bold font-mono-numbers">{h.temp}°</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <div className={`px-2 py-1 rounded-lg border text-center font-mono ${getInnerClass()}`}>
                  <span className="block text-[7px] uppercase opacity-70">Feels</span>
                  <span className="font-bold text-[11px] block">{weather.apparentTemperature}°</span>
                </div>
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  {renderWeatherIcon(weather.conditionCode, weather.isDay, 20)}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* 2+ row layout */
          <div className="flex-1 flex flex-col justify-between min-h-0 py-0.5">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-baseline space-x-1.5">
                  <span className="font-black tracking-tight text-3xl sm:text-4xl xl:text-5xl font-mono-numbers">
                    {weather.temperature}°
                  </span>
                  <span className="text-xs font-semibold opacity-75">{weather.condition}</span>
                </div>
                <p className="text-[10px] opacity-70 mt-0.5 font-mono">
                  High {weather.highTemp}° • Low {weather.lowTemp}°
                </p>
              </div>
              <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                {renderWeatherIcon(weather.conditionCode, weather.isDay, 26)}
              </div>
            </div>

            <div className={`grid grid-cols-4 gap-1.5 py-1.5 border-t text-xs font-mono text-center ${isLight ? 'border-black/10' : 'border-white/10'}`}>
              <div className={`p-1 rounded-lg border ${getInnerClass()}`}>
                <span className="block text-[7px] uppercase opacity-70">Feels</span>
                <span className="font-bold text-[11px] block">{weather.apparentTemperature}°</span>
              </div>
              <div className={`p-1 rounded-lg border ${getInnerClass()}`}>
                <span className="block text-[7px] uppercase opacity-70">Humidity</span>
                <span className="font-bold text-[11px] block">{weather.humidity}%</span>
              </div>
              <div className={`p-1 rounded-lg border ${getInnerClass()}`}>
                <span className="block text-[7px] uppercase opacity-70">Wind</span>
                <span className="font-bold text-[11px] block">{weather.windSpeed}k</span>
              </div>
              <div className={`p-1 rounded-lg border ${getInnerClass()}`}>
                <span className="block text-[7px] uppercase opacity-70 flex items-center justify-center">
                  <Droplets size={8} className="mr-0.5 text-blue-400" />Rain
                </span>
                <span className="font-bold text-[11px] text-blue-400 block">{weather.rainProbability}%</span>
              </div>
            </div>

            {/* Upcoming Hourly Forecast */}
            {weather.hourly && weather.hourly.length > 0 && (
              <div className={`pt-1.5 border-t ${isLight ? 'border-black/10' : 'border-white/10'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] uppercase tracking-wider font-semibold opacity-60">
                    Upcoming Hours
                  </span>
                  <span className="text-[9px] font-mono opacity-50">6-hr Forecast</span>
                </div>
                <div className="grid grid-cols-6 gap-1">
                  {weather.hourly.slice(0, 6).map((h, i) => (
                    <div
                      key={i}
                      className={`flex flex-col items-center p-1 rounded-lg border text-center ${getInnerClass()}`}
                    >
                      <span className="text-[9px] opacity-70 font-mono-numbers">{h.time}</span>
                      <div className="my-0.5">
                        {renderWeatherIcon(h.conditionCode, true, 14)}
                      </div>
                      <span className="text-[10px] font-bold font-mono-numbers">{h.temp}°</span>
                      <span className="text-[8px] text-blue-400 font-mono-numbers flex items-center mt-0.5">
                        <Droplets size={7} className="mr-0.5 shrink-0" />
                        {h.pop}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* If 3+ rows, also show daily forecast */}
            {layout.rowSpan >= 3 && weather.daily && weather.daily.length > 0 && (
              <div className={`pt-1.5 border-t mt-1.5 ${isLight ? 'border-black/10' : 'border-white/10'}`}>
                <div className="text-[9px] uppercase tracking-wider font-semibold opacity-60 mb-1">
                  Daily Forecast
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {weather.daily.slice(0, 4).map((d, i) => (
                    <div
                      key={i}
                      className={`flex flex-col items-center p-1 rounded-lg border text-center ${getInnerClass()}`}
                    >
                      <span className="text-[9px] font-bold">{d.day}</span>
                      <div className="my-0.5">
                        {renderWeatherIcon(d.conditionCode, true, 13)}
                      </div>
                      <span className="text-[9px] font-mono-numbers font-semibold">
                        {d.high}°/{d.low}°
                      </span>
                      <span className="text-[8px] text-blue-400 font-mono-numbers">
                        {d.rainProb}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // 3. TODAY'S SCHEDULE (CALENDAR & MEETINGS)
  const renderCalendarWidget = (layout: MorningWidgetLayoutItem) => {
    const isCompact = layout.colSpan <= 3 && layout.rowSpan === 1;
    const isTall = layout.rowSpan >= 2;

    if (uiStyle === 'tui') {
      return (
        <TuiBox
          title="CALENDAR_AGENDA"
          badge={`${monthShort.toUpperCase()}_${dayNumber}`}
          headerRight={renderCardControls('calendar')}
          className="h-full flex flex-col justify-between"
        >
          <div className="flex flex-col justify-between flex-1 py-1 font-mono text-xs min-h-0">
            {/* Big Date Header */}
            <div className="flex items-baseline justify-between border-b border-dashed border-emerald-500/30 pb-1.5 mb-1.5">
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-extrabold text-cyan-400">{dayNumber}</span>
                <div>
                  <div className="font-bold">{dayName.toUpperCase()}</div>
                  <div className="text-[9px] opacity-70">{monthShort.toUpperCase()} {yearNumber}</div>
                </div>
              </div>
              <div className="text-right text-[10px] text-emerald-400">
                [{events.length} EVENTS]
              </div>
            </div>

            {/* Events at the Bottom */}
            <div className="flex-1 flex flex-col space-y-1 overflow-y-auto pr-0.5 min-h-0">
              {events.map((evt) => (
                <div key={evt.id} className="p-1 border border-black/20 dark:border-white/20 flex items-center justify-between text-[11px]">
                  <span className="text-[10px] text-cyan-400 font-bold mr-2">&gt; {evt.startTime}</span>
                  <span className="truncate flex-1 font-bold">{evt.title}</span>
                </div>
              ))}
              {events.length === 0 && <div className="text-[10px] opacity-60">NO_EVENTS_TODAY</div>}
            </div>
          </div>
        </TuiBox>
      );
    }

    if (uiStyle === 'brutalist') {
      return (
        <BrutalistBox
          title="SCHEDULE & AGENDA"
          badge={`${dayNumber} ${monthShort.toUpperCase()}`}
          headerRight={renderCardControls('calendar')}
          className="h-full flex flex-col justify-between"
        >
          <div className="flex flex-col justify-between flex-1 py-1 font-mono min-h-0">
            {/* Big Date Header */}
            <div className="flex items-baseline justify-between border-b-2 border-black pb-1 mb-1.5">
              <div className="flex items-baseline space-x-2">
                <span className="text-5xl font-black text-black dark:text-white leading-none">{dayNumber}</span>
                <div>
                  <div className="font-black text-sm uppercase leading-tight">{dayName}</div>
                  <div className="text-[10px] font-bold opacity-75">{monthLong} {yearNumber}</div>
                </div>
              </div>
              <div className="bg-yellow-400 text-black px-1.5 py-0.5 text-[10px] font-black border border-black">
                {events.length} EVTS
              </div>
            </div>

            {/* Events at the Bottom */}
            <div className="flex-1 flex flex-col space-y-1.5 overflow-y-auto pr-0.5 min-h-0">
              {events.map((evt) => (
                <div key={evt.id} className="p-1.5 border-2 border-black dark:border-white flex items-center justify-between text-xs">
                  <span className="text-[10px] font-black mr-2 bg-yellow-400 text-black px-1">{evt.startTime}</span>
                  <span className="truncate flex-1 font-black">{evt.title}</span>
                </div>
              ))}
              {events.length === 0 && <div className="text-xs font-bold opacity-60">NO SCHEDULED EVENTS</div>}
            </div>
          </div>
        </BrutalistBox>
      );
    }

    if (uiStyle === 'hud') {
      return (
        <HudBox
          title="SCHEDULE_LOG"
          code={`DATE_${dayNumber}_${monthShort.toUpperCase()}`}
          glowColor="cyan"
          headerRight={renderCardControls('calendar')}
          className="h-full flex flex-col justify-between"
        >
          <div className="flex flex-col justify-between flex-1 py-1 font-mono min-h-0 text-cyan-200">
            {/* Big Date Header */}
            <div className="flex items-baseline justify-between border-b border-cyan-500/30 pb-1.5 mb-1.5">
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl sm:text-5xl font-black text-cyan-400 leading-none">{dayNumber}</span>
                <div>
                  <div className="font-bold text-xs uppercase text-cyan-300">{dayName}</div>
                  <div className="text-[9px] text-teal-400/80">{monthLong} {yearNumber}</div>
                </div>
              </div>
              <div className="text-[10px] text-rose-400 font-mono">
                {events.length} SCHEDULED
              </div>
            </div>

            {/* Events at the Bottom */}
            <div className="flex-1 flex flex-col space-y-1.5 overflow-y-auto pr-0.5 min-h-0 text-xs">
              {events.map((evt) => (
                <div key={evt.id} className="p-1.5 border border-cyan-500/30 bg-cyan-950/20 flex items-center justify-between">
                  <span className="text-[10px] text-cyan-400 font-bold mr-2">[{evt.startTime}]</span>
                  <span className="truncate flex-1 font-bold">{evt.title}</span>
                </div>
              ))}
              {events.length === 0 && <div className="text-[10px] opacity-60">ALL_CLEAR // NO_ENTRIES</div>}
            </div>
          </div>
        </HudBox>
      );
    }

    // Default Glass / Minimal / Civic / Neumorphic / Retrowave / Obsidian / Eink
    return (
      <div className={getCardClass(isCompact)}>
        <div className="flex items-center justify-between mb-1 shrink-0">
          <span className="text-[10px] uppercase font-bold tracking-wider flex items-center space-x-1.5 opacity-80 truncate">
            <Calendar size={12} className="text-purple-400 shrink-0" />
            <span className="truncate">{isCompact ? 'Schedule' : "Today's Schedule"}</span>
          </span>
          <div className="flex items-center space-x-1.5 shrink-0">
            {!isCompact && (
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-400 border border-purple-500/20 font-bold">
                {events.length} Events
              </span>
            )}
            {renderCardControls('calendar')}
          </div>
        </div>

        {/* 1-row layout (height 140px) */}
        {!isTall ? (
          <div className="flex-1 flex items-center justify-between min-h-0 py-0.5 space-x-3">
            {/* Big Date Callout */}
            <div className="flex items-baseline space-x-2 shrink-0">
              <span className="text-4xl sm:text-5xl font-black tracking-tight font-mono-numbers text-purple-400">
                {dayNumber}
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-bold leading-tight uppercase tracking-wider">{dayName.slice(0, 3)}</span>
                <span className="text-[10px] opacity-70 font-mono">{monthShort} {yearNumber}</span>
              </div>
            </div>

            {/* Next upcoming event on the right */}
            <div className="flex-1 min-w-0">
              {events.length > 0 ? (
                <div className={`p-1.5 rounded-xl border flex items-center space-x-2 text-xs truncate ${getInnerClass()}`}>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30 shrink-0">
                    {events[0].startTime}
                  </span>
                  <span className="font-semibold truncate">{events[0].title}</span>
                </div>
              ) : (
                <div className="text-xs opacity-60 font-mono text-center">No events today</div>
              )}
            </div>
          </div>
        ) : (
          /* 2+ row layout */
          <div className="flex-1 flex flex-col justify-between min-h-0 py-0.5">
            {/* Big Date Header */}
            <div className="flex items-center justify-between pb-2 border-b border-purple-500/20 shrink-0">
              <div className="flex items-center space-x-3">
                <span className="text-5xl sm:text-6xl font-black tracking-tight font-mono-numbers text-purple-400 leading-none">
                  {dayNumber}
                </span>
                <div className="flex flex-col">
                  <span className="text-base sm:text-lg font-bold leading-tight tracking-tight">
                    {dayName}
                  </span>
                  <span className="text-xs opacity-70 font-mono">
                    {monthLong} {yearNumber}
                  </span>
                </div>
              </div>

              <div className="text-right font-mono">
                <span className="text-[10px] text-purple-400 font-semibold block">
                  {events.length > 0 ? `Next: ${events[0].startTime}` : 'All Clear'}
                </span>
                <span className="text-[9px] opacity-60 block">
                  {events.length} meeting{events.length === 1 ? '' : 's'} today
                </span>
              </div>
            </div>

            {/* Events at the Bottom */}
            <div className="flex-1 flex flex-col justify-start min-h-0 mt-2">
              <div className="text-[9px] uppercase font-bold tracking-wider opacity-60 mb-1.5 shrink-0 flex items-center justify-between">
                <span>Upcoming Agenda</span>
                <span className="font-mono text-[8px] opacity-70">Scroll for more</span>
              </div>

              <div className="flex-1 flex flex-col space-y-1.5 overflow-y-auto pr-0.5 min-h-0">
                {events.map((evt) => (
                  <div key={evt.id} className={`p-2 rounded-xl border flex items-center justify-between text-xs shrink-0 ${getInnerClass()}`}>
                    <div className="flex items-center space-x-2 truncate min-w-0">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30 shrink-0">
                        {evt.startTime}
                      </span>
                      <span className="font-semibold truncate">{evt.title}</span>
                    </div>
                    {evt.location && (
                      <span className="text-[10px] opacity-70 flex items-center shrink-0 ml-2">
                        <MapPin size={10} className="mr-0.5 text-red-400" />
                        {evt.location}
                      </span>
                    )}
                  </div>
                ))}
                {events.length === 0 && (
                  <div className="py-4 text-center text-xs opacity-60 font-mono">
                    No scheduled meetings today. Enjoy your day!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 4. PRIORITIES & TASKS
  const renderTasksWidget = (layout: MorningWidgetLayoutItem) => {
    const isCompact = layout.colSpan <= 3 && layout.rowSpan === 1;
    const isTall = layout.rowSpan >= 2;
    const maxItems = layout.rowSpan === 1 ? (layout.colSpan >= 6 ? 4 : 2) : 6;
    const displayTasks = tasks.slice(0, maxItems);
    const completedCount = tasks.filter((t) => t.completed).length;

    if (uiStyle === 'tui') {
      return (
        <TuiBox
          title="TASKS_CHECKLIST"
          badge={`${completedCount}/${tasks.length} DONE`}
          headerRight={renderCardControls('tasks')}
          className="h-full flex flex-col justify-between"
        >
          <div className="flex-1 flex flex-col justify-start space-y-1 overflow-y-auto pr-0.5 min-h-0 font-mono text-xs">
            {displayTasks.map((t) => (
              <div
                key={t.id}
                onClick={() => toggleTask(t.id)}
                className={`p-1 border border-black/20 dark:border-white/20 flex items-center space-x-2 cursor-pointer ${
                  t.completed ? 'opacity-40 line-through' : ''
                }`}
              >
                <span>{t.completed ? '[X]' : '[ ]'}</span>
                <span className="truncate flex-1">{t.title}</span>
              </div>
            ))}
          </div>
        </TuiBox>
      );
    }

    if (uiStyle === 'brutalist') {
      return (
        <BrutalistBox
          title="PRIORITIES & TASKS"
          badge={`${completedCount}/${tasks.length} DONE`}
          headerRight={renderCardControls('tasks')}
          className="h-full flex flex-col justify-between"
        >
          <div className="flex-1 flex flex-col justify-start space-y-1.5 overflow-y-auto pr-0.5 min-h-0 font-mono text-xs">
            {displayTasks.map((t) => (
              <div
                key={t.id}
                onClick={() => toggleTask(t.id)}
                className={`p-1.5 border-2 border-black dark:border-white flex items-center space-x-2 cursor-pointer ${
                  t.completed ? 'opacity-40 line-through' : ''
                }`}
              >
                <span className="font-black">{t.completed ? '■' : '□'}</span>
                <span className="truncate flex-1 font-bold">{t.title}</span>
              </div>
            ))}
          </div>
        </BrutalistBox>
      );
    }

    if (uiStyle === 'hud') {
      return (
        <HudBox
          title="ACTION_ITEMS"
          code={`${completedCount}/${tasks.length}_DONE`}
          glowColor="cyan"
          headerRight={renderCardControls('tasks')}
          className="h-full flex flex-col justify-between"
        >
          <div className="flex-1 flex flex-col justify-start space-y-1 overflow-y-auto pr-0.5 min-h-0 font-mono text-xs text-cyan-200">
            {displayTasks.map((t) => (
              <div
                key={t.id}
                onClick={() => toggleTask(t.id)}
                className={`p-1.5 border border-cyan-500/30 bg-cyan-950/20 flex items-center space-x-2 cursor-pointer ${
                  t.completed ? 'opacity-40 line-through' : ''
                }`}
              >
                <span className="text-cyan-400">{t.completed ? '☑' : '☐'}</span>
                <span className="truncate flex-1 font-medium">{t.title}</span>
              </div>
            ))}
          </div>
        </HudBox>
      );
    }

    return (
      <div className={getCardClass(isCompact)}>
        <div className="flex items-center justify-between mb-1 shrink-0">
          <span className="text-[10px] uppercase font-bold tracking-wider flex items-center space-x-1.5 opacity-80 truncate">
            <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
            <span className="truncate">{isCompact ? 'Tasks' : 'Priorities & Checklist'}</span>
          </span>
          <div className="flex items-center space-x-1.5 shrink-0">
            {!isCompact && (
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-bold">
                {completedCount}/{tasks.length} Done
              </span>
            )}
            {renderCardControls('tasks')}
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-start space-y-1.5 overflow-y-auto pr-0.5 min-h-0 py-0.5">
          {displayTasks.map((t) => (
            <div
              key={t.id}
              onClick={() => toggleTask(t.id)}
              className={`p-1.5 rounded-xl border flex items-center space-x-2 text-xs cursor-pointer transition-all ${
                t.completed ? 'opacity-50 line-through' : 'hover:opacity-100'
              } ${getInnerClass()}`}
            >
              {t.completed ? (
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
              ) : (
                <Circle size={14} className="text-gray-400 shrink-0" />
              )}
              <span className="truncate flex-1 font-medium">{t.title}</span>
              {t.priority === 'high' && (
                <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase font-bold shrink-0">
                  High
                </span>
              )}
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="py-4 text-center text-xs opacity-60 font-mono">All tasks completed!</div>
          )}
        </div>
      </div>
    );
  };

  // 5. FINANCIAL MARKETS
  const renderMarketsWidget = (layout: MorningWidgetLayoutItem) => {
    const isCompact = layout.colSpan <= 3 && layout.rowSpan === 1;
    const isTall = layout.rowSpan >= 2;
    const maxItems = layout.rowSpan === 1 ? (layout.colSpan >= 6 ? 4 : 2) : 6;
    const displayItems = finance.slice(0, maxItems);

    if (uiStyle === 'tui') {
      return (
        <TuiBox
          title="MARKETS_TICKER"
          badge="REALTIME"
          headerRight={renderCardControls('markets')}
          className="h-full flex flex-col justify-between"
        >
          <div className="flex-1 flex flex-col justify-start space-y-1.5 overflow-y-auto pr-0.5 min-h-0 font-mono text-xs">
            {displayItems.map((item) => {
              const isPos = item.change >= 0;
              return (
                <div key={item.id} className="p-1 border border-black/20 dark:border-white/20 flex items-center justify-between">
                  <span className="font-bold">{item.symbol}</span>
                  <div className="text-right">
                    <span>{item.price}</span>
                    <span className={`ml-2 text-[10px] ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isPos ? '+' : ''}{item.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </TuiBox>
      );
    }

    if (uiStyle === 'brutalist') {
      return (
        <BrutalistBox
          title="MARKETS AT OPEN"
          badge="LIVE"
          headerRight={renderCardControls('markets')}
          className="h-full flex flex-col justify-between"
        >
          <div className="flex-1 flex flex-col justify-start space-y-1.5 overflow-y-auto pr-0.5 min-h-0 font-mono text-xs">
            {displayItems.map((item) => {
              const isPos = item.change >= 0;
              return (
                <div key={item.id} className="p-1.5 border-2 border-black dark:border-white flex items-center justify-between">
                  <div>
                    <span className="font-black block">{item.name}</span>
                    <span className="text-[9px] opacity-70">{item.symbol}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black block">{item.price}</span>
                    <span className={`text-[10px] font-black ${isPos ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {isPos ? '+' : ''}{item.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </BrutalistBox>
      );
    }

    if (uiStyle === 'hud') {
      return (
        <HudBox
          title="EXCHANGE_INDICES"
          code="LIVE_FEED"
          glowColor="cyan"
          headerRight={renderCardControls('markets')}
          className="h-full flex flex-col justify-between"
        >
          <div className="flex-1 flex flex-col justify-start space-y-1.5 overflow-y-auto pr-0.5 min-h-0 font-mono text-xs text-cyan-200">
            {displayItems.map((item) => {
              const isPos = item.change >= 0;
              return (
                <div key={item.id} className="p-1.5 border border-cyan-500/30 bg-cyan-950/20 flex items-center justify-between">
                  <span className="font-bold">{item.symbol}</span>
                  <div className="text-right">
                    <span>{item.price}</span>
                    <span className={`ml-2 text-[10px] ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isPos ? '+' : ''}{item.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </HudBox>
      );
    }

    return (
      <div className={getCardClass(isCompact)}>
        <div className="flex items-center justify-between mb-1 shrink-0">
          <span className="text-[10px] uppercase font-bold tracking-wider flex items-center space-x-1.5 opacity-80 truncate">
            <TrendingUp size={12} className="text-emerald-400 shrink-0" />
            <span className="truncate">{isCompact ? 'Markets' : 'Markets at Open'}</span>
          </span>
          <div className="flex items-center space-x-1.5 shrink-0">
            {!isCompact && (
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-bold">
                REALTIME
              </span>
            )}
            {renderCardControls('markets')}
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-start space-y-1.5 overflow-y-auto pr-0.5 min-h-0 py-0.5">
          {displayItems.map((item) => {
            const isPos = item.change >= 0;
            return (
              <div key={item.id} className={`p-2 rounded-xl border flex items-center justify-between text-xs font-mono ${getInnerClass()}`}>
                <div className="truncate min-w-0 mr-2">
                  <span className="font-bold block truncate">{item.name}</span>
                  <span className="text-[9px] opacity-70 block">{item.symbol}</span>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold">{item.price}</div>
                  <div className={`text-[10px] font-bold flex items-center justify-end ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isPos ? <ArrowUpRight size={11} className="mr-0.5" /> : <ArrowDownRight size={11} className="mr-0.5" />}
                    {Math.abs(item.changePercent).toFixed(2)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // 6. NEWS WIDGET
  const renderNewsWidget = (layout: MorningWidgetLayoutItem) => {
    const isCompact = layout.colSpan <= 3 && layout.rowSpan === 1;
    const isTall = layout.rowSpan >= 2;
    const maxNews = layout.rowSpan === 1 ? (layout.colSpan >= 6 ? 2 : 1) : 4;
    const displayNews = news.slice(0, maxNews);

    if (uiStyle === 'tui') {
      return (
        <TuiBox
          title="NEWS_DISPATCH"
          badge="WIRE"
          headerRight={renderCardControls('news')}
          className="h-full flex flex-col justify-between"
        >
          <div className="flex-1 flex flex-col justify-start space-y-1.5 overflow-y-auto pr-0.5 min-h-0 font-mono text-xs">
            {displayNews.map((item, idx) => (
              <div key={item.id || idx} className="p-1 border border-black/20 dark:border-white/20">
                <div className="text-[9px] text-amber-400 font-bold">[{item.source}]</div>
                <div className="font-bold truncate mt-0.5">{item.title}</div>
              </div>
            ))}
          </div>
        </TuiBox>
      );
    }

    if (uiStyle === 'brutalist') {
      return (
        <BrutalistBox
          title="MORNING WIRE"
          badge="LIVE"
          headerRight={renderCardControls('news')}
          className="h-full flex flex-col justify-between"
        >
          <div className="flex-1 flex flex-col justify-start space-y-1.5 overflow-y-auto pr-0.5 min-h-0 font-mono text-xs">
            {displayNews.map((item, idx) => (
              <div key={item.id || idx} className="p-1.5 border-2 border-black dark:border-white">
                <span className="text-[9px] font-black uppercase bg-red-600 text-white px-1 mr-1">{item.source}</span>
                <span className="font-black">{item.title}</span>
              </div>
            ))}
          </div>
        </BrutalistBox>
      );
    }

    if (uiStyle === 'hud') {
      return (
        <HudBox
          title="INTEL_FEED"
          code="WIRE_LIVE"
          glowColor="cyan"
          headerRight={renderCardControls('news')}
          className="h-full flex flex-col justify-between"
        >
          <div className="flex-1 flex flex-col justify-start space-y-1.5 overflow-y-auto pr-0.5 min-h-0 font-mono text-xs text-cyan-200">
            {displayNews.map((item, idx) => (
              <div key={item.id || idx} className="p-1.5 border border-cyan-500/30 bg-cyan-950/20">
                <div className="text-[9px] text-rose-400 font-bold">&gt; {item.source}</div>
                <div className="font-medium truncate mt-0.5">{item.title}</div>
              </div>
            ))}
          </div>
        </HudBox>
      );
    }

    return (
      <div className={getCardClass(isCompact)}>
        <div className="flex items-center justify-between mb-1 shrink-0">
          <span className="text-[10px] uppercase font-bold tracking-wider flex items-center space-x-1.5 opacity-80 truncate">
            <Newspaper size={12} className="text-red-500 shrink-0" />
            <span className="truncate">{isCompact ? 'Wire' : 'Morning News Briefing'}</span>
          </span>
          <div className="flex items-center space-x-1.5 shrink-0">
            {!isCompact && (
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-red-500/15 text-red-500 border border-red-500/20 font-bold">
                LIVE
              </span>
            )}
            {renderCardControls('news')}
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-start space-y-1.5 overflow-y-auto pr-0.5 min-h-0 py-0.5">
          {displayNews.map((item, idx) => (
            <a
              key={item.id || idx}
              href={item.url || '#'}
              target="_blank"
              rel="noreferrer"
              className={`p-2 rounded-xl border flex flex-col justify-between text-xs hover:opacity-100 transition-opacity block group ${getInnerClass()}`}
            >
              <div className="font-semibold line-clamp-2 leading-tight group-hover:text-amber-400 transition-colors">
                {item.title}
              </div>
              <div className="flex items-center justify-between text-[9px] opacity-70 mt-1 font-mono">
                <span className="font-bold text-red-500">[{item.source}]</span>
                <span className="flex items-center">
                  Open <ExternalLink size={8} className="ml-0.5" />
                </span>
              </div>
            </a>
          ))}
          {news.length === 0 && (
            <div className="py-4 text-center text-xs opacity-60 font-mono">Loading morning headlines...</div>
          )}
        </div>
      </div>
    );
  };

  // 7. TIME PROGRESS WIDGET (Year / Quarter / Month Progress Bar)
  const renderTimeProgressWidget = (layout: MorningWidgetLayoutItem) => {
    const isCompact = layout.colSpan <= 3 && layout.rowSpan === 1;
    const isTall = layout.rowSpan >= 2;

    const now = new Date();
    const year = now.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year + 1, 0, 1);
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    const totalDaysInYear = isLeap ? 366 : 365;
    const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const yearPercent = Math.min(100, Math.max(0, ((now.getTime() - startOfYear.getTime()) / (endOfYear.getTime() - startOfYear.getTime())) * 100));
    const daysLeftInYear = Math.max(0, totalDaysInYear - dayOfYear);

    const quarterNum = Math.floor(now.getMonth() / 3) + 1;
    const startOfQuarter = new Date(year, (quarterNum - 1) * 3, 1);
    const endOfQuarter = new Date(year, quarterNum * 3, 1);
    const quarterPercent = Math.min(100, Math.max(0, ((now.getTime() - startOfQuarter.getTime()) / (endOfQuarter.getTime() - startOfQuarter.getTime())) * 100));
    const daysLeftInQuarter = Math.max(0, Math.ceil((endOfQuarter.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

    const monthName = now.toLocaleString('en-US', { month: 'short' });
    const dayOfMonth = now.getDate();
    const daysInMonth = new Date(year, now.getMonth() + 1, 0).getDate();
    const monthPercent = Math.min(100, Math.max(0, (dayOfMonth / daysInMonth) * 100));
    const daysLeftInMonth = Math.max(0, daysInMonth - dayOfMonth);

    const weekNum = Math.ceil((dayOfYear + startOfYear.getDay()) / 7);

    if (uiStyle === 'tui') {
      return (
        <TuiBox
          title="CHRONO_PROGRESS"
          badge={`W${weekNum} / D${dayOfYear}`}
          headerRight={renderCardControls('timeProgress')}
          className="h-full flex flex-col justify-between"
        >
          <div className="flex flex-col justify-between flex-1 py-0.5 font-mono text-xs min-h-0 space-y-1">
            <div>
              <div className="flex justify-between text-[10px] mb-0.5">
                <span>YEAR_{year}</span>
                <span>{yearPercent.toFixed(1)}% ({daysLeftInYear}d left)</span>
              </div>
              <div className="h-1.5 w-full bg-black/40 border border-emerald-500/30 overflow-hidden">
                <div className="h-full bg-emerald-400" style={{ width: `${yearPercent}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] mb-0.5">
                <span>QUARTER_Q{quarterNum}</span>
                <span>{quarterPercent.toFixed(1)}% ({daysLeftInQuarter}d left)</span>
              </div>
              <div className="h-1.5 w-full bg-black/40 border border-cyan-500/30 overflow-hidden">
                <div className="h-full bg-cyan-400" style={{ width: `${quarterPercent}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] mb-0.5">
                <span>MONTH_{monthName.toUpperCase()}</span>
                <span>{monthPercent.toFixed(1)}% ({daysLeftInMonth}d left)</span>
              </div>
              <div className="h-1.5 w-full bg-black/40 border border-amber-500/30 overflow-hidden">
                <div className="h-full bg-amber-400" style={{ width: `${monthPercent}%` }} />
              </div>
            </div>
            {isTall && (
              <div className="grid grid-cols-3 gap-1 pt-1.5 border-t border-dashed border-emerald-500/30 text-center text-[10px]">
                <div>WEEK: {weekNum}/52</div>
                <div>DAY: {dayOfYear}/{totalDaysInYear}</div>
                <div>PACE: ON_TRACK</div>
              </div>
            )}
          </div>
        </TuiBox>
      );
    }

    if (uiStyle === 'brutalist') {
      return (
        <BrutalistBox
          title="TIME PASSAGE"
          badge={`${yearPercent.toFixed(0)}% YEAR`}
          headerRight={renderCardControls('timeProgress')}
          className="h-full flex flex-col justify-between"
        >
          <div className="flex flex-col justify-between flex-1 py-0.5 font-mono min-h-0 space-y-1">
            <div>
              <div className="flex justify-between text-[9px] font-black uppercase mb-0.5">
                <span>YEAR {year}</span>
                <span>{yearPercent.toFixed(1)}% • {daysLeftInYear}D LEFT</span>
              </div>
              <div className="h-1.5 w-full bg-neutral-200 border border-black overflow-hidden">
                <div className="h-full bg-yellow-400" style={{ width: `${yearPercent}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[9px] font-black uppercase mb-0.5">
                <span>QUARTER Q{quarterNum}</span>
                <span>{quarterPercent.toFixed(1)}% • {daysLeftInQuarter}D LEFT</span>
              </div>
              <div className="h-1.5 w-full bg-neutral-200 border border-black overflow-hidden">
                <div className="h-full bg-lime-400" style={{ width: `${quarterPercent}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[9px] font-black uppercase mb-0.5">
                <span>MONTH {monthName.toUpperCase()}</span>
                <span>{monthPercent.toFixed(1)}% • {daysLeftInMonth}D LEFT</span>
              </div>
              <div className="h-1.5 w-full bg-neutral-200 border border-black overflow-hidden">
                <div className="h-full bg-cyan-400" style={{ width: `${monthPercent}%` }} />
              </div>
            </div>
            {isTall && (
              <div className="grid grid-cols-3 gap-1 pt-1.5 border-t-2 border-black text-center text-[10px] font-black">
                <div className="border border-black bg-yellow-200 p-0.5">W{weekNum}/52</div>
                <div className="border border-black bg-lime-200 p-0.5">D{dayOfYear}/{totalDaysInYear}</div>
                <div className="border border-black bg-cyan-200 p-0.5">ON TRACK</div>
              </div>
            )}
          </div>
        </BrutalistBox>
      );
    }

    if (uiStyle === 'hud') {
      return (
        <HudBox
          title="TEMPORAL_CYCLE"
          code={`W${weekNum}_D${dayOfYear}`}
          glowColor="cyan"
          headerRight={renderCardControls('timeProgress')}
          className="h-full flex flex-col justify-between"
        >
          <div className="flex flex-col justify-between flex-1 py-0.5 font-mono text-xs min-h-0 space-y-1.5">
            <div>
              <div className="flex justify-between text-[10px] text-cyan-300 mb-0.5">
                <span>CYCLE_{year}</span>
                <span className="font-bold">{yearPercent.toFixed(1)}% [{daysLeftInYear}D REMAIN]</span>
              </div>
              <div className="h-1.5 w-full bg-cyan-950/60 border border-cyan-500/40 rounded-sm overflow-hidden">
                <div className="h-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" style={{ width: `${yearPercent}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] text-teal-300 mb-0.5">
                <span>SECTOR_Q{quarterNum}</span>
                <span className="font-bold">{quarterPercent.toFixed(1)}% [{daysLeftInQuarter}D REMAIN]</span>
              </div>
              <div className="h-1.5 w-full bg-cyan-950/60 border border-teal-500/40 rounded-sm overflow-hidden">
                <div className="h-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)]" style={{ width: `${quarterPercent}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] text-indigo-300 mb-0.5">
                <span>PHASE_{monthName.toUpperCase()}</span>
                <span className="font-bold">{monthPercent.toFixed(1)}% [{daysLeftInMonth}D REMAIN]</span>
              </div>
              <div className="h-1.5 w-full bg-cyan-950/60 border border-indigo-500/40 rounded-sm overflow-hidden">
                <div className="h-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" style={{ width: `${monthPercent}%` }} />
              </div>
            </div>
            {isTall && (
              <div className="grid grid-cols-3 gap-1 pt-1.5 border-t border-cyan-500/20 text-center text-[10px] text-cyan-300">
                <div className="border border-cyan-500/30 p-0.5 rounded">W{weekNum}/52</div>
                <div className="border border-cyan-500/30 p-0.5 rounded">D{dayOfYear}/{totalDaysInYear}</div>
                <div className="border border-cyan-500/30 p-0.5 rounded text-emerald-400">ON_TRACK</div>
              </div>
            )}
          </div>
        </HudBox>
      );
    }

    // Default Glass / Minimal / Civic / Neumorphic / Retrowave / Obsidian / Eink
    return (
      <div className={getCardClass(isCompact)}>
        <div className="flex items-center justify-between mb-1 shrink-0">
          <span className="text-[10px] uppercase font-bold tracking-wider flex items-center space-x-1.5 opacity-80 truncate">
            <Timer size={12} className="text-indigo-400 shrink-0" />
            <span className="truncate">{isCompact ? 'Progress' : 'Time & Year Progress'}</span>
          </span>
          <div className="flex items-center space-x-1.5 shrink-0">
            {!isCompact && (
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 font-bold">
                W{weekNum} • Day {dayOfYear}
              </span>
            )}
            {renderCardControls('timeProgress')}
          </div>
        </div>

        {/* 1-row layout (height 140px) */}
        {!isTall ? (
          layout.colSpan >= 6 ? (
            /* Wide 1-row: 3-column side-by-side progress cards */
            <div className="flex-1 grid grid-cols-3 gap-2 min-h-0 items-center py-0.5">
              <div className={`p-2 rounded-xl border flex flex-col justify-between h-full ${getInnerClass()}`}>
                <div className="flex justify-between items-baseline text-[10px] font-mono">
                  <span className="font-semibold">{year} Year</span>
                  <span className="font-bold text-indigo-400">{yearPercent.toFixed(1)}%</span>
                </div>
                <div className={`h-1.5 w-full rounded-full overflow-hidden my-1 ${isLight ? 'bg-slate-200' : 'bg-white/10'}`}>
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: `${yearPercent}%` }} />
                </div>
                <span className="text-[9px] opacity-60 font-mono">{daysLeftInYear}d left</span>
              </div>

              <div className={`p-2 rounded-xl border flex flex-col justify-between h-full ${getInnerClass()}`}>
                <div className="flex justify-between items-baseline text-[10px] font-mono">
                  <span className="font-semibold">Q{quarterNum} Quarter</span>
                  <span className="font-bold text-violet-400">{quarterPercent.toFixed(1)}%</span>
                </div>
                <div className={`h-1.5 w-full rounded-full overflow-hidden my-1 ${isLight ? 'bg-slate-200' : 'bg-white/10'}`}>
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500" style={{ width: `${quarterPercent}%` }} />
                </div>
                <span className="text-[9px] opacity-60 font-mono">{daysLeftInQuarter}d left</span>
              </div>

              <div className={`p-2 rounded-xl border flex flex-col justify-between h-full ${getInnerClass()}`}>
                <div className="flex justify-between items-baseline text-[10px] font-mono">
                  <span className="font-semibold">{monthName} Month</span>
                  <span className="font-bold text-teal-400">{monthPercent.toFixed(1)}%</span>
                </div>
                <div className={`h-1.5 w-full rounded-full overflow-hidden my-1 ${isLight ? 'bg-slate-200' : 'bg-white/10'}`}>
                  <div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400" style={{ width: `${monthPercent}%` }} />
                </div>
                <span className="text-[9px] opacity-60 font-mono">{daysLeftInMonth}d left</span>
              </div>
            </div>
          ) : (
            /* Standard 1-row (e.g. 4 cols x 1 row) */
            <div className="flex-1 flex flex-col justify-between min-h-0 py-0.5 space-y-1.5">
              {/* Year bar */}
              <div>
                <div className="flex items-center justify-between text-[10px] mb-0.5 font-mono">
                  <span className="font-semibold opacity-90">{year} Year</span>
                  <div className="space-x-1.5 text-[9px]">
                    <span className="font-bold text-indigo-400">{yearPercent.toFixed(1)}%</span>
                    <span className="opacity-50">({daysLeftInYear}d left)</span>
                  </div>
                </div>
                <div className={`h-1.5 w-full rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-white/10'}`}>
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                    style={{ width: `${yearPercent}%` }}
                  />
                </div>
              </div>

              {/* Quarter bar */}
              <div>
                <div className="flex items-center justify-between text-[10px] mb-0.5 font-mono">
                  <span className="font-semibold opacity-90">Quarter {quarterNum}</span>
                  <div className="space-x-1.5 text-[9px]">
                    <span className="font-bold text-violet-400">{quarterPercent.toFixed(1)}%</span>
                    <span className="opacity-50">({daysLeftInQuarter}d left)</span>
                  </div>
                </div>
                <div className={`h-1.5 w-full rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-white/10'}`}>
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-500"
                    style={{ width: `${quarterPercent}%` }}
                  />
                </div>
              </div>

              {/* Month bar */}
              <div>
                <div className="flex items-center justify-between text-[10px] mb-0.5 font-mono">
                  <span className="font-semibold opacity-90">{monthName} Month</span>
                  <div className="space-x-1.5 text-[9px]">
                    <span className="font-bold text-teal-400">{monthPercent.toFixed(1)}%</span>
                    <span className="opacity-50">({daysLeftInMonth}d left)</span>
                  </div>
                </div>
                <div className={`h-1.5 w-full rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-white/10'}`}>
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${monthPercent}%` }}
                  />
                </div>
              </div>
            </div>
          )
        ) : (
          /* 2+ row layout */
          <div className="flex-1 flex flex-col justify-between min-h-0 py-1 space-y-2.5">
            {/* Year bar */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1 font-mono">
                <span className="font-semibold text-xs opacity-90">{year} Full Year</span>
                <div className="space-x-1.5 text-[10px]">
                  <span className="font-bold text-indigo-400">{yearPercent.toFixed(1)}%</span>
                  <span className="opacity-60">({daysLeftInYear} days remaining)</span>
                </div>
              </div>
              <div className={`h-2.5 w-full rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-white/10'}`}>
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                  style={{ width: `${yearPercent}%` }}
                />
              </div>
            </div>

            {/* Quarter bar */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1 font-mono">
                <span className="font-semibold text-xs opacity-90">Quarter {quarterNum}</span>
                <div className="space-x-1.5 text-[10px]">
                  <span className="font-bold text-violet-400">{quarterPercent.toFixed(1)}%</span>
                  <span className="opacity-60">({daysLeftInQuarter} days remaining)</span>
                </div>
              </div>
              <div className={`h-2.5 w-full rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-white/10'}`}>
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${quarterPercent}%` }}
                />
              </div>
            </div>

            {/* Month bar */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1 font-mono">
                <span className="font-semibold text-xs opacity-90">{monthName} Month</span>
                <div className="space-x-1.5 text-[10px]">
                  <span className="font-bold text-teal-400">{monthPercent.toFixed(1)}%</span>
                  <span className="opacity-60">({daysLeftInMonth} days remaining)</span>
                </div>
              </div>
              <div className={`h-2.5 w-full rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-white/10'}`}>
                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${monthPercent}%` }}
                />
              </div>
            </div>

            {/* Bottom 3-grid summary */}
            <div className={`grid grid-cols-3 gap-1.5 pt-2 border-t text-center font-mono text-xs ${isLight ? 'border-black/10' : 'border-white/10'}`}>
              <div className={`p-1.5 rounded-lg border ${getInnerClass()}`}>
                <span className="block text-[8px] uppercase opacity-70">Week</span>
                <span className="font-bold text-indigo-400">{weekNum} / 52</span>
              </div>
              <div className={`p-1.5 rounded-lg border ${getInnerClass()}`}>
                <span className="block text-[8px] uppercase opacity-70">Day of Year</span>
                <span className="font-bold">{dayOfYear} / {totalDaysInYear}</span>
              </div>
              <div className={`p-1.5 rounded-lg border ${getInnerClass()}`}>
                <span className="block text-[8px] uppercase opacity-70">Pace</span>
                <span className="font-bold text-emerald-400">On Track</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 8. TRAFFIC TO OFFICE WIDGET
  const renderTrafficWidget = (layout: MorningWidgetLayoutItem) => {
    const isCompact = layout.colSpan <= 3 && layout.rowSpan === 1;
    const isTall = layout.rowSpan >= 2;

    // Route calculation & ETA
    const now = new Date();
    const etaDate = new Date(now.getTime() + 34 * 60 * 1000);
    const etaString = etaDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (uiStyle === 'tui') {
      return (
        <TuiBox
          title="COMMUTE_TELEMETRY"
          badge="ETA 34M"
          headerRight={renderCardControls('traffic')}
          className="h-full flex flex-col justify-between"
        >
          <div className="flex flex-col justify-between flex-1 py-1 font-mono text-xs min-h-0">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-extrabold text-amber-400">34 MIN</span>
                <span className="text-[10px] ml-1.5 text-rose-400">+8m delay</span>
              </div>
              <span className="text-[10px] opacity-75">ETA: {etaString}</span>
            </div>
            <div className="text-[10px] text-gray-300 mt-1">
              ROUTE: Outer Ring Rd Exp (18.4 km)
            </div>
            <div className="text-[10px] text-amber-400/90 border-t border-dashed border-amber-500/30 pt-1 mt-1">
              STATUS: Moderate congestion at Flyover
            </div>
            {isTall && (
              <div className="text-[9px] opacity-70 border-t pt-1 mt-1">
                ALT: Airport Bypass (41 min • Clear)
              </div>
            )}
          </div>
        </TuiBox>
      );
    }

    if (uiStyle === 'brutalist') {
      return (
        <BrutalistBox
          title="COMMUTE ROUTE"
          badge="34 MIN"
          headerRight={renderCardControls('traffic')}
          className="h-full flex flex-col justify-between"
        >
          <div className="flex flex-col justify-between flex-1 py-1 font-mono min-h-0">
            <div className="flex items-baseline justify-between border-b-2 border-black pb-1">
              <div>
                <span className="text-2xl font-black">34 MIN</span>
                <span className="text-xs font-bold text-red-600 ml-1.5">+8M DELAY</span>
              </div>
              <span className="text-xs font-bold">ARRIVE {etaString}</span>
            </div>
            <div className="text-[10px] font-bold pt-1">
              HOME ➔ TECH PARK (18.4 KM)
            </div>
            <div className="bg-amber-200 border border-black p-1 text-[9px] font-black uppercase mt-1">
              MODERATE CONGESTION ON FLYOVER
            </div>
          </div>
        </BrutalistBox>
      );
    }

    if (uiStyle === 'hud') {
      return (
        <HudBox
          title="TRANSIT_RADAR"
          code="ORR_EXP_18K"
          glowColor="amber"
          headerRight={renderCardControls('traffic')}
          className="h-full flex flex-col justify-between"
        >
          <div className="flex flex-col justify-between flex-1 py-1 font-mono text-xs min-h-0">
            <div className="flex items-baseline justify-between text-amber-400">
              <span className="text-3xl font-black">34<span className="text-sm font-normal">MIN</span></span>
              <span className="text-xs text-rose-400">+8M DELAY</span>
            </div>
            <div className="text-[10px] text-cyan-300 mt-1">
              WAYPOINT: TECH PARK HQ • ETA {etaString}
            </div>
            <div className="flex items-center space-x-1 mt-1.5">
              <div className="h-1 flex-1 bg-emerald-500 rounded" />
              <div className="h-1 flex-1 bg-amber-500 rounded" />
              <div className="h-1 flex-1 bg-rose-500 rounded animate-pulse" />
              <div className="h-1 flex-1 bg-emerald-500 rounded" />
            </div>
            {isTall && (
              <div className="text-[9px] text-gray-400 border-t border-cyan-500/20 pt-1 mt-1">
                BACKUP: BYPASS EXP // 41 MIN // CLEAR
              </div>
            )}
          </div>
        </HudBox>
      );
    }

    // Default Glass / Minimal / Civic
    return (
      <div className={getCardClass(isCompact)}>
        <div className="flex items-center justify-between mb-1.5 shrink-0">
          <span className="text-[10px] uppercase font-bold tracking-wider flex items-center space-x-1.5 opacity-80 truncate">
            <Car size={12} className="text-amber-400 shrink-0" />
            <span className="truncate">{isCompact ? 'Commute' : 'Traffic to Office'}</span>
          </span>
          <div className="flex items-center space-x-1.5 shrink-0">
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-500 border border-amber-500/20 font-bold">
              +8m Delay
            </span>
            {renderCardControls('traffic')}
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between min-h-0 py-0.5">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-2xl sm:text-3xl font-black tracking-tight font-mono-numbers">
                  34
                </span>
                <span className="text-xs font-semibold opacity-75">min</span>
                <span className="text-[10px] font-mono text-amber-500 font-semibold">(26m typical)</span>
              </div>
              <p className="text-[10px] opacity-70 mt-0.5 font-mono truncate">
                via Outer Ring Rd Exp • 18.4 km
              </p>
            </div>
            <div className="text-right">
              <div className="text-[11px] font-mono font-bold text-emerald-400">
                ETA {etaString}
              </div>
              <div className="text-[9px] opacity-60">Leave by {new Date(now.getTime() + 10 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          </div>

          {/* Route traffic density bar */}
          <div className="my-1">
            <div className="flex items-center justify-between text-[9px] opacity-60 mb-0.5 font-mono">
              <span>Home</span>
              <span className="text-amber-400">Flyover bottleneck</span>
              <span>Office</span>
            </div>
            <div className="flex items-center space-x-1 h-1.5 w-full rounded-full overflow-hidden">
              <div className="h-full w-2/5 bg-emerald-500 rounded-l" />
              <div className="h-full w-2/5 bg-amber-500 animate-pulse" />
              <div className="h-full w-1/5 bg-emerald-400 rounded-r" />
            </div>
          </div>

          {/* Alternate route or extra detail when tall */}
          {isTall && (
            <div className={`pt-2 border-t text-xs font-mono flex items-center justify-between ${isLight ? 'border-black/10' : 'border-white/10'}`}>
              <div className="truncate min-w-0 mr-2">
                <span className="block text-[8px] uppercase opacity-60">Alternative Route</span>
                <span className="font-semibold text-[11px] truncate block">via Metro & Bypass</span>
              </div>
              <div className="text-right shrink-0">
                <span className="font-bold text-[11px] block">41 min</span>
                <span className="text-[9px] text-emerald-400 block">Clear flow</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 9. CURRENT AQI WIDGET
  const renderAqiWidget = (layout: MorningWidgetLayoutItem) => {
    const isCompact = layout.colSpan <= 3 && layout.rowSpan === 1;
    const isTall = layout.rowSpan >= 2;

    const getAdvisory = (score: number) => {
      if (score <= 50) return 'Air quality is excellent. Ideal for outdoor activities.';
      if (score <= 100) return 'Moderate air quality. Sensitive individuals should take note.';
      if (score <= 150) return 'Unhealthy for sensitive groups. Reduce heavy outdoor exertion.';
      return 'Unhealthy air conditions. Mask recommended outside.';
    };

    if (uiStyle === 'tui') {
      return (
        <TuiBox
          title="ATMOSPHERIC_AQI"
          badge={`AQI_${aqi.usAqi}`}
          headerRight={renderCardControls('aqi')}
          className="h-full flex flex-col justify-between"
        >
          <div className="flex flex-col justify-between flex-1 py-1 font-mono text-xs min-h-0">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold">{aqi.usAqi} AQI</span>
              <span className="text-xs uppercase font-bold" style={{ color: aqi.color }}>
                {aqi.label}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[10px] mt-1.5 border-t pt-1">
              <div>PM2.5: {aqi.pm25} ug/m3</div>
              <div>PM10: {aqi.pm10} ug/m3</div>
              <div>OZONE: 34 ppb</div>
              <div>NO2: 18 ppb</div>
            </div>
            {isTall && (
              <div className="text-[9px] opacity-75 mt-1 border-t pt-1">
                ADVISORY: {getAdvisory(aqi.usAqi)}
              </div>
            )}
          </div>
        </TuiBox>
      );
    }

    if (uiStyle === 'brutalist') {
      return (
        <BrutalistBox
          title="AIR QUALITY"
          badge={`AQI ${aqi.usAqi}`}
          headerRight={renderCardControls('aqi')}
          className="h-full flex flex-col justify-between"
        >
          <div className="flex flex-col justify-between flex-1 py-1 font-mono min-h-0">
            <div className="flex items-baseline justify-between border-b-2 border-black pb-1">
              <span className="text-3xl font-black">{aqi.usAqi}</span>
              <span className="text-xs font-black uppercase px-1.5 py-0.5 border border-black bg-yellow-200">
                {aqi.label}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[10px] pt-1">
              <div>PM2.5: {aqi.pm25} µG/M³</div>
              <div>PM10: {aqi.pm10} µG/M³</div>
            </div>
            {isTall && (
              <div className="bg-black text-white p-1 text-[8px] font-bold uppercase mt-1">
                {getAdvisory(aqi.usAqi)}
              </div>
            )}
          </div>
        </BrutalistBox>
      );
    }

    if (uiStyle === 'hud') {
      return (
        <HudBox
          title="PARTICULATE_INDEX"
          code={`AQI_${aqi.usAqi}`}
          glowColor="cyan"
          headerRight={renderCardControls('aqi')}
          className="h-full flex flex-col justify-between"
        >
          <div className="flex flex-col justify-between flex-1 py-1 font-mono text-xs min-h-0">
            <div className="flex items-baseline justify-between text-cyan-400">
              <span className="text-3xl font-black">{aqi.usAqi}</span>
              <span className="text-xs font-bold uppercase" style={{ color: aqi.color }}>
                {aqi.label}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[10px] text-gray-300 border-t border-cyan-500/20 pt-1 mt-1">
              <span>PM2.5: {aqi.pm25} ug/m3</span>
              <span>PM10: {aqi.pm10} ug/m3</span>
            </div>
            {isTall && (
              <div className="text-[9px] text-cyan-300/80 border-t border-cyan-500/20 pt-1 mt-1">
                ADVISORY: {getAdvisory(aqi.usAqi)}
              </div>
            )}
          </div>
        </HudBox>
      );
    }

    // Default Glass / Minimal / Civic
    return (
      <div className={getCardClass(isCompact)}>
        <div className="flex items-center justify-between mb-1.5 shrink-0">
          <span className="text-[10px] uppercase font-bold tracking-wider flex items-center space-x-1.5 opacity-80 truncate">
            <Gauge size={12} className="text-cyan-400 shrink-0" />
            <span className="truncate">{isCompact ? 'AQI' : 'Current Air Quality'}</span>
          </span>
          <div className="flex items-center space-x-1.5 shrink-0">
            <span
              className="text-[9px] font-mono px-2 py-0.5 rounded-full border font-bold"
              style={{
                borderColor: `${aqi.color}60`,
                backgroundColor: `${aqi.color}20`,
                color: aqi.color,
              }}
            >
              {aqi.label}
            </span>
            {renderCardControls('aqi')}
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between min-h-0 py-0.5">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline space-x-2">
              <span
                className="text-3xl sm:text-4xl font-black tracking-tight font-mono-numbers"
                style={{ color: aqi.color }}
              >
                {aqi.usAqi}
              </span>
              <span className="text-xs font-semibold opacity-70">US AQI</span>
            </div>
            <div className="text-right font-mono text-[10px]">
              <span className="opacity-60 block">Dominant</span>
              <span className="font-bold">PM 2.5</span>
            </div>
          </div>

          {/* Pollutant mini chips */}
          <div className="grid grid-cols-3 gap-1 text-center font-mono my-1">
            <div className={`p-1 rounded-lg border text-[10px] ${getInnerClass()}`}>
              <span className="block text-[7px] uppercase opacity-70">PM 2.5</span>
              <span className="font-bold text-[10px]">{aqi.pm25} <span className="text-[7px]">µg</span></span>
            </div>
            <div className={`p-1 rounded-lg border text-[10px] ${getInnerClass()}`}>
              <span className="block text-[7px] uppercase opacity-70">PM 10</span>
              <span className="font-bold text-[10px]">{aqi.pm10} <span className="text-[7px]">µg</span></span>
            </div>
            <div className={`p-1 rounded-lg border text-[10px] ${getInnerClass()}`}>
              <span className="block text-[7px] uppercase opacity-70">Ozone</span>
              <span className="font-bold text-[10px]">34 <span className="text-[7px]">ppb</span></span>
            </div>
          </div>

          {/* Health notice */}
          <div className={`text-[9px] leading-tight px-2 py-1 rounded-lg border truncate font-mono ${getInnerClass()}`}>
            <span className="opacity-90">{getAdvisory(aqi.usAqi)}</span>
          </div>

          {/* Extra detail when tall */}
          {isTall && (
            <div className={`pt-2 border-t mt-1 text-[10px] font-mono ${isLight ? 'border-black/10' : 'border-white/10'}`}>
              <div className="flex items-center justify-between text-[9px] opacity-70 mb-1">
                <span>6-Hour Forecast</span>
                <span>Trend: Stable</span>
              </div>
              <div className="grid grid-cols-6 gap-1 text-center text-[9px]">
                {['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'].map((time, idx) => (
                  <div key={idx} className={`p-1 rounded border ${getInnerClass()}`}>
                    <span className="block text-[8px] opacity-60">{time}</span>
                    <span className="font-bold text-[10px] text-emerald-400">Good</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderWidget = (id: MorningWidgetId) => {
    const layout = slotLayout[id] || DEFAULT_MORNING_SLOT_LAYOUT[id];
    switch (id) {
      case 'clock':
        return renderClockWidget(layout);
      case 'weather':
        return renderWeatherWidget(layout);
      case 'timeProgress':
        return renderTimeProgressWidget(layout);
      case 'calendar':
        return renderCalendarWidget(layout);
      case 'tasks':
        return renderTasksWidget(layout);
      case 'traffic':
        return renderTrafficWidget(layout);
      case 'markets':
        return renderMarketsWidget(layout);
      case 'news':
        return renderNewsWidget(layout);
      case 'aqi':
        return renderAqiWidget(layout);
      default:
        return null;
    }
  };

  return (
    <div className={`h-full flex flex-col ${isKioskMode ? 'space-y-0' : 'space-y-2.5'} relative min-h-0 ${fontClass} ${className}`}>
      {/* Top Bar with Widget Management & Slot Grid Controls */}
      {!isKioskMode && (
        <div className="flex items-center justify-between px-1 shrink-0">
          <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-wider opacity-75">
            <span>Morning Grid ({visibleWidgets.length})</span>
            <span className="opacity-40">|</span>
            <span className="opacity-80">12-Col Resizable</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileImport}
              accept=".json,application/json"
              className="hidden"
            />

            <button
              type="button"
              onClick={handleExport}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl text-[10px] font-mono border transition-all cursor-pointer ${
                isLight
                  ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 shadow-xs'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300 hover:text-white'
              }`}
              title="Download morning grid layout backup (.json)"
            >
              <Download size={11} />
              <span>Backup</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl text-[10px] font-mono border transition-all cursor-pointer ${
                isLight
                  ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 shadow-xs'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300 hover:text-white'
              }`}
              title="Restore morning grid layout from backup file (.json)"
            >
              <Upload size={11} />
              <span>Restore</span>
            </button>

            <button
              type="button"
              onClick={resetSlotLayout}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl text-[10px] font-mono border transition-all cursor-pointer ${
                isLight
                  ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 shadow-xs'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300 hover:text-white'
              }`}
              title="Reset morning widgets to default slot coordinates"
            >
              <RotateCcw size={11} />
              <span>Reset Grid</span>
            </button>

            <button
              onClick={() => setIsPickerOpen(true)}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-xl text-[11px] font-medium border transition-all cursor-pointer ${
                isLight
                  ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800 shadow-sm'
                  : 'bg-white/10 hover:bg-white/15 border-white/10 text-white'
              }`}
              title="Configure Morning Widgets"
            >
              <Sliders size={12} />
              <span>Widgets</span>
            </button>
          </div>
        </div>
      )}

      {/* Backup / Restore Feedback Banner */}
      {backupFeedback && (
        <div className="absolute top-9 right-1 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
          <div
            className={`px-3 py-1 rounded-xl border shadow-xl text-xs font-mono font-medium flex items-center space-x-2 backdrop-blur-md ${
              backupFeedback.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200 shadow-emerald-950/50'
                : 'bg-rose-950/90 border-rose-500/50 text-rose-200 shadow-rose-950/50'
            }`}
          >
            {backupFeedback.type === 'success' ? (
              <Check size={13} className="text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle size={13} className="text-rose-400 shrink-0" />
            )}
            <span>{backupFeedback.message}</span>
          </div>
        </div>
      )}

      {/* Slot-Based 12-Column Grid with 8-Direction Mouse-Drag Resizing & Positioning */}
      <div
        ref={gridRef}
        className="grid grid-cols-12 gap-4 overflow-y-auto overflow-x-hidden pr-2 flex-1 min-h-0 relative select-none"
        style={{ gridAutoRows: '140px' }}
      >
        {/* Visual Blueprint Grid Matrix during Move or Resize */}
        {(movingState || resizingState) && (
          <div
            className="absolute inset-0 pointer-events-none grid grid-cols-12 gap-4 z-0"
            style={{ gridAutoRows: '140px' }}
          >
            {Array.from({ length: 48 }).map((_, i) => (
              <div
                key={i}
                className="border border-dashed border-blue-500/20 dark:border-blue-400/20 rounded-2xl bg-blue-500/[0.02] flex items-center justify-center"
              >
                <span className="text-[9px] font-mono opacity-20">
                  {Math.floor(i / 12) + 1}:{(i % 12) + 1}
                </span>
              </div>
            ))}
          </div>
        )}

        {visibleWidgets.map((w) => {
          const layout = slotLayout[w.id] || DEFAULT_MORNING_SLOT_LAYOUT[w.id];
          const isActivelyMoved = movingState?.widgetId === w.id;
          const isActivelyResized = resizingState?.widgetId === w.id;
          const isInteracting = Boolean(movingState || resizingState);

          return (
            <div
              key={w.id}
              style={{
                gridColumn: `${layout.col} / span ${layout.colSpan}`,
                gridRow: `${layout.row} / span ${layout.rowSpan}`,
              }}
              className={`relative group h-full flex flex-col ${
                isActivelyMoved
                  ? 'opacity-85 shadow-2xl z-30 ring-2 ring-blue-500 rounded-2xl'
                  : isActivelyResized
                  ? 'shadow-2xl z-30 ring-2 ring-amber-400 rounded-2xl'
                  : isInteracting
                  ? 'z-10 transition-all duration-150'
                  : 'z-10'
              }`}
            >
              {/* Widget Content Card */}
              {renderWidget(w.id)}

              {/* 8-Direction Interactive Resize Handles */}
              {!isKioskMode && (
                <>
                  {/* North */}
                  <div
                    onMouseDown={(e) => handleResizeStart(e, w.id, 'n')}
                    className="absolute -top-1 left-3 right-3 h-2.5 cursor-ns-resize z-20 group-hover:bg-amber-400/20 hover:!bg-amber-400/60 rounded-full transition-colors"
                    title="Drag to resize height (North)"
                  />
                  {/* South */}
                  <div
                    onMouseDown={(e) => handleResizeStart(e, w.id, 's')}
                    className="absolute -bottom-1 left-3 right-3 h-2.5 cursor-ns-resize z-20 group-hover:bg-amber-400/20 hover:!bg-amber-400/60 rounded-full transition-colors"
                    title="Drag to resize height (South)"
                  />
                  {/* West */}
                  <div
                    onMouseDown={(e) => handleResizeStart(e, w.id, 'w')}
                    className="absolute -left-1 top-3 bottom-3 w-2.5 cursor-ew-resize z-20 group-hover:bg-amber-400/20 hover:!bg-amber-400/60 rounded-full transition-colors"
                    title="Drag to resize width (West)"
                  />
                  {/* East */}
                  <div
                    onMouseDown={(e) => handleResizeStart(e, w.id, 'e')}
                    className="absolute -right-1 top-3 bottom-3 w-2.5 cursor-ew-resize z-20 group-hover:bg-amber-400/20 hover:!bg-amber-400/60 rounded-full transition-colors"
                    title="Drag to resize width (East)"
                  />
                  {/* North-West */}
                  <div
                    onMouseDown={(e) => handleResizeStart(e, w.id, 'nw')}
                    className="absolute -top-1.5 -left-1.5 w-4 h-4 cursor-nwse-resize z-30 flex items-center justify-center group-hover:opacity-100 opacity-0 transition-opacity"
                    title="Drag to resize corner (North-West)"
                  >
                    <div className="w-2 h-2 rounded-full bg-amber-400 border border-black/40 shadow-xs" />
                  </div>
                  {/* North-East */}
                  <div
                    onMouseDown={(e) => handleResizeStart(e, w.id, 'ne')}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 cursor-nesw-resize z-30 flex items-center justify-center group-hover:opacity-100 opacity-0 transition-opacity"
                    title="Drag to resize corner (North-East)"
                  >
                    <div className="w-2 h-2 rounded-full bg-amber-400 border border-black/40 shadow-xs" />
                  </div>
                  {/* South-West */}
                  <div
                    onMouseDown={(e) => handleResizeStart(e, w.id, 'sw')}
                    className="absolute -bottom-1.5 -left-1.5 w-4 h-4 cursor-nesw-resize z-30 flex items-center justify-center group-hover:opacity-100 opacity-0 transition-opacity"
                    title="Drag to resize corner (South-West)"
                  >
                    <div className="w-2 h-2 rounded-full bg-amber-400 border border-black/40 shadow-xs" />
                  </div>
                  {/* South-East (Corner Resize Handle) */}
                  <div
                    onMouseDown={(e) => handleResizeStart(e, w.id, 'se')}
                    className="absolute -bottom-1.5 -right-1.5 w-4 h-4 cursor-nwse-resize z-30 flex items-center justify-center group-hover:opacity-100 opacity-0 transition-opacity"
                    title="Drag to resize width and height (South-East)"
                  >
                    <div className="w-2 h-2 rounded-full bg-amber-400 border border-black/40 shadow-xs" />
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Interactive Widget Selector & Slot Grid Popover / Modal */}
      {isPickerOpen && (
        <div className="absolute inset-0 z-50 p-4 rounded-3xl bg-black/92 backdrop-blur-md border border-white/20 flex flex-col justify-between text-white animate-in fade-in zoom-in-95 duration-200">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/15">
              <div className="flex items-center space-x-2">
                <Sliders size={18} className="text-amber-400" />
                <h3 className="text-sm font-bold tracking-tight">Morning Widgets &amp; Slot Grid</h3>
              </div>
              <button
                onClick={() => setIsPickerOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Layout Backup, Presets & Reset Controls */}
            <div className="my-2.5 p-2.5 rounded-xl border border-white/10 bg-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold block">Grid Layout Backup &amp; Presets</span>
                  <span className="text-[10px] text-gray-400">Save custom slot positions to a file or quick snapshot</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={handleExport}
                    className="flex items-center space-x-1 px-2.5 py-1 text-[10px] font-mono font-bold rounded-lg border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 transition-all cursor-pointer"
                    title="Export Morning Grid layout to JSON file"
                  >
                    <Download size={11} />
                    <span>Export JSON</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-1 px-2.5 py-1 text-[10px] font-mono font-bold rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 transition-all cursor-pointer"
                    title="Import layout from JSON file"
                  >
                    <Upload size={11} />
                    <span>Import JSON</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1.5 border-t border-white/10 text-[10px] font-mono">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleQuickSnapshotSave}
                    className="flex items-center space-x-1 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-gray-200 cursor-pointer transition-colors"
                    title="Save current layout snapshot to browser storage"
                  >
                    <Save size={10} />
                    <span>Save Snapshot</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleQuickSnapshotRestore}
                    className="flex items-center space-x-1 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-gray-200 cursor-pointer transition-colors"
                    title="Restore quick snapshot from browser storage"
                  >
                    <RotateCcw size={10} />
                    <span>Restore Snapshot</span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={resetSlotLayout}
                  className="flex items-center space-x-1 text-gray-400 hover:text-white underline cursor-pointer"
                  title="Reset to default factory layout"
                >
                  <RotateCcw size={10} />
                  <span>Reset Defaults</span>
                </button>
              </div>
            </div>

            {/* Active & Arranged Widgets List with Drag & Up/Down Controls */}
            <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
              <div className="flex items-center justify-between pb-1 text-[10px] uppercase font-mono text-gray-400">
                <span>Active Widgets ({visibleWidgets.length}) • Drag or use arrows to rearrange</span>
              </div>

              {visibleWidgets.map((widget, idx) => {
                const layout = slotLayout[widget.id] || DEFAULT_MORNING_SLOT_LAYOUT[widget.id];
                const Icon = widget.icon;
                const canMoveUp = idx > 0;
                const canMoveDown = idx < visibleWidgets.length - 1;

                return (
                  <div
                    key={widget.id}
                    draggable
                    onDragStart={() => setDraggedIdx(idx)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (draggedIdx !== null && draggedIdx !== idx) {
                        reorderMorningWidgets(draggedIdx, idx);
                        setDraggedIdx(null);
                      }
                    }}
                    className={`w-full p-2 rounded-xl border text-left transition-all flex items-center justify-between bg-white/15 border-white/30 text-white ${
                      draggedIdx === idx ? 'opacity-50 ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-white p-0.5">
                        <GripVertical size={14} />
                      </div>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        #{idx + 1}
                      </span>
                      <div className="p-1.5 rounded-lg border bg-amber-500/20 border-amber-500/40 text-amber-400">
                        <Icon size={14} />
                      </div>
                      <div>
                        <div className="text-xs font-bold flex items-center space-x-2">
                          <span>{widget.name}</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-gray-300">
                            {widget.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400">{widget.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                      {/* Slot Coordinates & Size Pill */}
                      {layout && (
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-black/40 border border-white/15 text-amber-400">
                          Col {layout.col}, Row {layout.row} ({layout.colSpan}×{layout.rowSpan})
                        </span>
                      )}

                      {/* Reorder Up / Down Buttons */}
                      <div className="flex items-center space-x-0.5 bg-black/40 p-0.5 rounded-lg border border-white/15">
                        <button
                          type="button"
                          title="Move Up"
                          disabled={!canMoveUp}
                          onClick={() => moveMorningWidget(widget.id, 'up')}
                          className={`p-1 rounded text-xs transition-colors ${
                            canMoveUp ? 'hover:bg-white/20 text-white cursor-pointer' : 'opacity-20 cursor-not-allowed text-gray-500'
                          }`}
                        >
                          <ChevronUp size={12} strokeWidth={2.5} />
                        </button>
                        <button
                          type="button"
                          title="Move Down"
                          disabled={!canMoveDown}
                          onClick={() => moveMorningWidget(widget.id, 'down')}
                          className={`p-1 rounded text-xs transition-colors ${
                            canMoveDown ? 'hover:bg-white/20 text-white cursor-pointer' : 'opacity-20 cursor-not-allowed text-gray-500'
                          }`}
                        >
                          <ChevronDown size={12} strokeWidth={2.5} />
                        </button>
                      </div>

                      {/* Remove / Toggle Active */}
                      <button
                        type="button"
                        title="Remove from layout"
                        onClick={() => toggleMorningWidget(widget.id)}
                        className="w-5 h-5 rounded-md border flex items-center justify-center bg-emerald-600 border-emerald-500 text-white hover:bg-red-600 hover:border-red-500 transition-colors cursor-pointer"
                      >
                        <Check size={12} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Inactive Widgets available to add */}
              {MORNING_AVAILABLE_WIDGETS.filter((w) => !morningActiveWidgets.includes(w.id)).length > 0 && (
                <div className="pt-2 mt-2 border-t border-white/10">
                  <div className="text-[10px] uppercase font-mono text-gray-400 mb-1">
                    Available to Add ({MORNING_AVAILABLE_WIDGETS.filter((w) => !morningActiveWidgets.includes(w.id)).length})
                  </div>
                  <div className="space-y-1">
                    {MORNING_AVAILABLE_WIDGETS.filter((w) => !morningActiveWidgets.includes(w.id)).map((widget) => {
                      const Icon = widget.icon;
                      return (
                        <div
                          key={widget.id}
                          onClick={() => toggleMorningWidget(widget.id)}
                          className="w-full p-2 rounded-xl border text-left transition-all flex items-center justify-between bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white cursor-pointer"
                        >
                          <div className="flex items-center space-x-2.5">
                            <div className="p-1.5 rounded-lg border bg-white/5 border-white/10 text-gray-400">
                              <Icon size={14} />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-gray-300">{widget.name}</div>
                              <p className="text-[10px] text-gray-500">{widget.description}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-gray-300 hover:bg-emerald-500 hover:text-white transition-colors">
                            + Add
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-white/15 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setMorningActiveWidgets(MORNING_AVAILABLE_WIDGETS.map((w) => w.id))}
                className="text-[11px] text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                All ({MORNING_AVAILABLE_WIDGETS.length})
              </button>
            </div>
            <button
              onClick={() => setIsPickerOpen(false)}
              className="px-4 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 font-bold text-xs text-black shadow-lg cursor-pointer transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
