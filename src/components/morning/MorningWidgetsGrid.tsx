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
} from 'lucide-react';
import { BrutalistBox } from '../brutalist/BrutalistBox';
import { HudBox } from '../hud/HudBox';
import { TuiBox } from '../tui/TuiBox';

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
];

export const DEFAULT_MORNING_SLOT_LAYOUT: Record<MorningWidgetId, MorningWidgetLayoutItem> = {
  clock:    { col: 1, row: 1, colSpan: 4, rowSpan: 1 },
  weather:  { col: 1, row: 2, colSpan: 4, rowSpan: 2 },
  calendar: { col: 5, row: 1, colSpan: 4, rowSpan: 2 },
  tasks:    { col: 5, row: 3, colSpan: 4, rowSpan: 1 },
  markets:  { col: 9, row: 1, colSpan: 4, rowSpan: 2 },
  news:     { col: 9, row: 3, colSpan: 4, rowSpan: 1 },
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
          return deoverlapAll(merged, Object.keys(merged) as MorningWidgetId[]);
        }
      }
    } catch (e) {}
    return DEFAULT_MORNING_SLOT_LAYOUT;
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
          prev[id].col !== deoverlapped[id]?.col
        ) {
          changed = true;
          break;
        }
      }
      return changed ? deoverlapped : prev;
    });
  }, [morningActiveWidgets]);

  const [resizingState, setResizingState] = useState<ResizingState | null>(null);
  const [movingState, setMovingState] = useState<MovingState | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const resetSlotLayout = () => {
    setSlotLayout(DEFAULT_MORNING_SLOT_LAYOUT);
    try {
      localStorage.setItem('dashboard_morning_slot_layout', JSON.stringify(DEFAULT_MORNING_SLOT_LAYOUT));
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
            <div className={`font-extrabold tracking-wider flex items-baseline font-mono ${isTall ? 'text-5xl' : 'text-3xl'}`}>
              <span>{hours}:{minutes}</span>
              <span className="text-xl ml-2 animate-pulse tabular-nums" style={{ color: 'var(--color-accent)' }}>:{seconds}</span>
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
              <span className={`font-black tracking-tight ${isTall ? 'text-5xl' : 'text-3xl'}`}>{hours}:{minutes}</span>
              <span className="text-xl font-bold text-red-500 animate-pulse tabular-nums">:{seconds}</span>
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
            <div className={`font-black tracking-widest text-cyan-400 flex items-baseline ${isTall ? 'text-5xl' : 'text-3xl'}`}>
              <span>{hours}:{minutes}</span>
              <span className="text-xl ml-1 text-rose-500 animate-pulse tabular-nums">:{seconds}</span>
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
              <span className="font-extrabold tracking-tight text-3xl xl:text-4xl">
                {hours}:{minutes}
              </span>
              <span className="text-lg xl:text-xl font-bold animate-pulse tabular-nums" style={{ color: 'var(--color-accent)' }}>
                :{seconds}
              </span>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold tracking-wide" style={{ color: 'var(--color-accent)' }}>
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
              <span className={`font-extrabold tracking-tight ${isTall ? 'text-5xl xl:text-6xl' : 'text-3xl xl:text-4xl'}`}>
                {hours}:{minutes}
              </span>
              <span className="text-lg xl:text-xl font-bold animate-pulse tabular-nums" style={{ color: 'var(--color-accent)' }}>
                :{seconds}
              </span>
            </div>

            <div>
              <p className="text-xs font-medium tracking-wide truncate" style={{ color: 'var(--color-accent)' }}>
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

  // 3. TODAY'S SCHEDULE (CALENDAR)
  const renderCalendarWidget = (layout: MorningWidgetLayoutItem) => {
    const isCompact = layout.colSpan <= 3 && layout.rowSpan === 1;
    const isTall = layout.rowSpan >= 2;
    const maxItems = layout.rowSpan === 1 ? (layout.colSpan >= 6 ? 4 : 2) : 5;
    const displayEvents = events.slice(0, maxItems);

    if (uiStyle === 'tui') {
      return (
        <TuiBox
          title="CALENDAR_AGENDA"
          badge={`${events.length} EVENTS`}
          headerRight={renderCardControls('calendar')}
          className="h-full flex flex-col justify-between"
        >
          <div className="flex-1 flex flex-col justify-start space-y-1.5 overflow-y-auto pr-0.5 min-h-0 font-mono text-xs">
            {displayEvents.map((evt) => (
              <div key={evt.id} className="p-1 border border-black/20 dark:border-white/20 flex items-center justify-between">
                <span className="text-[10px] text-cyan-400 font-bold mr-2">&gt; {evt.startTime}</span>
                <span className="truncate flex-1 font-bold">{evt.title}</span>
              </div>
            ))}
            {events.length === 0 && <div className="text-[10px] opacity-60">NO_EVENTS_TODAY</div>}
          </div>
        </TuiBox>
      );
    }

    if (uiStyle === 'brutalist') {
      return (
        <BrutalistBox
          title="TODAY'S SCHEDULE"
          badge={`${events.length} EVENTS`}
          headerRight={renderCardControls('calendar')}
          className="h-full flex flex-col justify-between"
        >
          <div className="flex-1 flex flex-col justify-start space-y-1.5 overflow-y-auto pr-0.5 min-h-0 font-mono text-xs">
            {displayEvents.map((evt) => (
              <div key={evt.id} className="p-1.5 border-2 border-black dark:border-white flex items-center justify-between">
                <span className="text-[10px] font-black mr-2 bg-yellow-400 text-black px-1">{evt.startTime}</span>
                <span className="truncate flex-1 font-black">{evt.title}</span>
              </div>
            ))}
            {events.length === 0 && <div className="text-xs font-bold opacity-60">NO SCHEDULED EVENTS</div>}
          </div>
        </BrutalistBox>
      );
    }

    if (uiStyle === 'hud') {
      return (
        <HudBox
          title="SCHEDULE_LOG"
          code={`${events.length}_EVTS`}
          glowColor="cyan"
          headerRight={renderCardControls('calendar')}
          className="h-full flex flex-col justify-between"
        >
          <div className="flex-1 flex flex-col justify-start space-y-1.5 overflow-y-auto pr-0.5 min-h-0 font-mono text-xs text-cyan-200">
            {displayEvents.map((evt) => (
              <div key={evt.id} className="p-1.5 border border-cyan-500/30 bg-cyan-950/20 flex items-center justify-between">
                <span className="text-[10px] text-cyan-400 font-bold mr-2">[{evt.startTime}]</span>
                <span className="truncate flex-1 font-bold">{evt.title}</span>
              </div>
            ))}
            {events.length === 0 && <div className="text-[10px] opacity-60">ALL_CLEAR // NO_ENTRIES</div>}
          </div>
        </HudBox>
      );
    }

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

        <div className="flex-1 flex flex-col justify-start space-y-1.5 overflow-y-auto pr-0.5 min-h-0 py-0.5">
          {displayEvents.map((evt) => (
            <div key={evt.id} className={`p-2 rounded-xl border flex items-center justify-between text-xs ${getInnerClass()}`}>
              <div className="flex items-center space-x-2 truncate min-w-0">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30 shrink-0">
                  {evt.startTime}
                </span>
                <span className="font-semibold truncate">{evt.title}</span>
              </div>
              {evt.location && isTall && (
                <span className="text-[10px] opacity-70 flex items-center shrink-0 ml-2">
                  <MapPin size={10} className="mr-0.5 text-red-400" />
                  {evt.location}
                </span>
              )}
            </div>
          ))}
          {events.length === 0 && (
            <div className="py-4 text-center text-xs opacity-60 font-mono">No events scheduled for today.</div>
          )}
        </div>
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

  const renderWidget = (id: MorningWidgetId) => {
    const layout = slotLayout[id] || DEFAULT_MORNING_SLOT_LAYOUT[id];
    switch (id) {
      case 'clock':
        return renderClockWidget(layout);
      case 'weather':
        return renderWeatherWidget(layout);
      case 'calendar':
        return renderCalendarWidget(layout);
      case 'tasks':
        return renderTasksWidget(layout);
      case 'markets':
        return renderMarketsWidget(layout);
      case 'news':
        return renderNewsWidget(layout);
      default:
        return null;
    }
  };

  return (
    <div className={`h-full flex flex-col space-y-2.5 relative min-h-0 ${fontClass} ${className}`}>
      {/* Top Bar with Widget Management & Slot Grid Controls */}
      <div className="flex items-center justify-between px-1 shrink-0">
        <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-wider opacity-75">
          <span>Morning Grid ({visibleWidgets.length})</span>
          <span className="opacity-40">|</span>
          <span className="opacity-80">12-Col Resizable</span>
        </div>

        <div className="flex items-center space-x-1.5">
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

      {/* Slot-Based 12-Column Grid with 8-Direction Mouse-Drag Resizing & Positioning */}
      <div
        ref={gridRef}
        className="grid grid-cols-12 gap-4 overflow-y-auto pr-1 flex-1 min-h-0 relative select-none"
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
                  : 'z-10 transition-all duration-150'
              }`}
            >
              {/* Widget Content Card */}
              {renderWidget(w.id)}

              {/* 8-Direction Interactive Resize Handles */}
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

            {/* Reset Grid Layout Action */}
            <div className="my-2.5 p-2 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold block">Slot-Based Grid Layout</span>
                <span className="text-[10px] text-gray-400">Drag headers to place anywhere, drag edges to resize</span>
              </div>
              <button
                type="button"
                onClick={resetSlotLayout}
                className="flex items-center space-x-1 px-2.5 py-1 text-[10px] font-mono font-bold rounded-lg border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
              >
                <RotateCcw size={11} />
                <span>Reset Grid</span>
              </button>
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
