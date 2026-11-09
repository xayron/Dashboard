import React, { useState, useEffect, useRef } from 'react';
import { useDashboard } from '../../state/DashboardContext';
import type { F1WidgetId, F1WidgetSize, UIStyle } from '../../types/dashboard';
import {
  Timer,
  Calendar,
  Award,
  Zap,
  Trophy,
  Wrench,
  Flag,
  Gauge,
  CloudSun,
  Sliders,
  Check,
  X,
  Maximize2,
  Minimize2,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Newspaper,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { BrutalistBox } from '../brutalist/BrutalistBox';
import { HudBox } from '../hud/HudBox';
import { TuiBox } from '../tui/TuiBox';
import { WeatherWidget } from '../common/WeatherWidget';

export interface F1WidgetDef {
  id: F1WidgetId;
  name: string;
  badge: string;
  description: string;
  icon: React.ElementType;
}

export const F1_AVAILABLE_WIDGETS: F1WidgetDef[] = [
  {
    id: 'countdown',
    name: 'Target Session Countdown',
    badge: 'LIVE IST',
    description: 'Upcoming session countdown, IST date/time, and circuit telemetry specs.',
    icon: Timer,
  },
  {
    id: 'podium',
    name: 'Previous GP Podium',
    badge: 'LAST RACE',
    description: 'Top 3 finishers and DHL fastest lap winner from the previous Grand Prix.',
    icon: Award,
  },
  {
    id: 'titleBattle',
    name: 'Championship Title Fight',
    badge: 'WDC / WCC GAP',
    description: 'Leader vs Contender points margin, remaining rounds, and constructor lead.',
    icon: Trophy,
  },
  {
    id: 'qualifying',
    name: 'Qualifying Shootout',
    badge: 'POLE POSITION',
    description: 'Pole position time and front row grid battle from the previous race.',
    icon: Zap,
  },
  {
    id: 'pitstop',
    name: 'DHL Fastest Pit Stop',
    badge: 'CREW RECORD',
    description: 'Fastest pit stop duration, team, driver, and lap number.',
    icon: Wrench,
  },
  {
    id: 'upcomingRaces',
    name: 'Upcoming Grand Prix Calendar',
    badge: 'CALENDAR',
    description: 'Next 2-3 races on the official FIA calendar with IST timings.',
    icon: Flag,
  },
  {
    id: 'circuitTelemetry',
    name: 'Circuit Technical Telemetry',
    badge: 'TECH DATA',
    description: 'Full throttle %, gear changes per lap, speed traps, and pit delta.',
    icon: Gauge,
  },
  {
    id: 'news',
    name: 'F1 News & Paddock Wire',
    badge: 'LIVE WIRE',
    description: 'Latest breaking F1 headlines, paddock reports, and driver news.',
    icon: Newspaper,
  },
  {
    id: 'schedule',
    name: 'Weekend Session Schedule',
    badge: 'TIMETABLE',
    description: 'FP1, FP2, FP3, Qualifying, and Race start times in IST with live status.',
    icon: Calendar,
  },
  {
    id: 'standings',
    name: 'Championship Standings',
    badge: 'WDC / WCC',
    description: 'Driver & constructor championship standings with live points.',
    icon: Trophy,
  },
];

export interface F1WidgetLayoutItem {
  col: number;      // 1 to 12
  row: number;      // 1 to N
  colSpan: number;  // 2 to 12
  rowSpan: number;  // 1 to 6
}

export const DEFAULT_F1_SLOT_LAYOUT: Record<F1WidgetId, F1WidgetLayoutItem> = {
  countdown:        { col: 1,  row: 1, colSpan: 6, rowSpan: 1 },
  circuitTelemetry: { col: 7,  row: 1, colSpan: 6, rowSpan: 1 },
  schedule:         { col: 1,  row: 2, colSpan: 3, rowSpan: 2 },
  standings:        { col: 4,  row: 2, colSpan: 3, rowSpan: 2 },
  titleBattle:      { col: 7,  row: 2, colSpan: 3, rowSpan: 1 },
  pitstop:          { col: 10, row: 2, colSpan: 3, rowSpan: 1 },
  qualifying:       { col: 7,  row: 3, colSpan: 3, rowSpan: 1 },
  upcomingRaces:    { col: 10, row: 3, colSpan: 3, rowSpan: 1 },
  news:             { col: 1,  row: 4, colSpan: 6, rowSpan: 2 },
  podium:           { col: 7,  row: 4, colSpan: 6, rowSpan: 1 },
};

export const WIDGETS_WITH_LARGE: F1WidgetId[] = ['schedule', 'standings', 'news'];

// Widgets whose natural content is a vertical list or timetable.
export const VERTICAL_MEDIUM_WIDGETS: F1WidgetId[] = [
  'standings',
  'schedule',
  'news',
  'upcomingRaces',
];

export const isVerticalMediumWidget = (id?: F1WidgetId, size: F1WidgetSize = 'normal') => {
  return size === 'normal' && id !== undefined && VERTICAL_MEDIUM_WIDGETS.includes(id);
};

export const COMPACT_3COL_WIDGETS: F1WidgetId[] = ['schedule', 'standings', 'news'];

export const isNarrowCompactWidget = (id?: F1WidgetId, size: F1WidgetSize = 'compact') => {
  return size === 'compact' && id !== undefined && !COMPACT_3COL_WIDGETS.includes(id);
};

interface F1WidgetsColumnProps {
  uiStyle?: UIStyle;
  isLight?: boolean;
  className?: string;
  f1?: any;
}

export const F1WidgetsColumn: React.FC<F1WidgetsColumnProps> = ({
  uiStyle: propUiStyle,
  isLight: propIsLight,
  className = '',
}) => {
  const {
    f1,
    weather,
    uiStyle: contextUiStyle,
    colorMode,
    f1ActiveWidgets,
    setF1ActiveWidgets,
    toggleF1Widget,
    moveF1Widget,
    reorderF1Widgets,
    f1WidgetSizes,
    setF1WidgetSize,
    setAllF1WidgetSizes,
  } = useDashboard();

  const uiStyle = propUiStyle || contextUiStyle;
  const isLight = propIsLight !== undefined ? propIsLight : colorMode === 'light';

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [gridDraggedId, setGridDraggedId] = useState<F1WidgetId | null>(null);
  const [gridDragOverId, setGridDragOverId] = useState<F1WidgetId | null>(null);
  const [standingsTab, setStandingsTab] = useState<'drivers' | 'constructors'>('drivers');

  type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

  interface ResizingState {
    widgetId: F1WidgetId;
    dir: ResizeDirection;
    startX: number;
    startY: number;
    startCol: number;
    startRow: number;
    startColSpan: number;
    startRowSpan: number;
  }

  interface MovingState {
    widgetId: F1WidgetId;
    startX: number;
    startY: number;
    startCol: number;
    startRow: number;
    colSpan: number;
    rowSpan: number;
  }

  const [slotLayout, setSlotLayout] = useState<Record<F1WidgetId, F1WidgetLayoutItem>>(() => {
    try {
      const saved = localStorage.getItem('dashboard_f1_slot_layout');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed === 'object' && parsed !== null) {
          return { ...DEFAULT_F1_SLOT_LAYOUT, ...parsed };
        }
      }
    } catch (e) {}
    return DEFAULT_F1_SLOT_LAYOUT;
  });

  const [resizingState, setResizingState] = useState<ResizingState | null>(null);
  const [movingState, setMovingState] = useState<MovingState | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const resetSlotLayout = () => {
    setSlotLayout(DEFAULT_F1_SLOT_LAYOUT);
    try {
      localStorage.setItem('dashboard_f1_slot_layout', JSON.stringify(DEFAULT_F1_SLOT_LAYOUT));
    } catch (e) {}
  };

  // Mouse Move & Mouse Up Listener for 8-Direction Resizing and Slot Moving
  useEffect(() => {
    if (!movingState && !resizingState) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!gridRef.current) return;
      const gridRect = gridRef.current.getBoundingClientRect();
      const gap = 12;
      const cellW = (gridRect.width - gap * 11) / 12;
      const cellH = 140;

      if (movingState) {
        const deltaX = e.clientX - movingState.startX;
        const deltaY = e.clientY - movingState.startY;

        const deltaCols = Math.round(deltaX / (cellW + gap));
        const deltaRows = Math.round(deltaY / (cellH + gap));

        const newCol = Math.max(1, Math.min(13 - movingState.colSpan, movingState.startCol + deltaCols));
        const newRow = Math.max(1, movingState.startRow + deltaRows);

        setSlotLayout((prev) => ({
          ...prev,
          [movingState.widgetId]: {
            ...prev[movingState.widgetId],
            col: newCol,
            row: newRow,
          },
        }));
      } else if (resizingState) {
        const deltaX = e.clientX - resizingState.startX;
        const deltaY = e.clientY - resizingState.startY;

        const deltaCols = Math.round(deltaX / (cellW + gap));
        const deltaRows = Math.round(deltaY / (cellH + gap));

        const { dir, startCol, startRow, startColSpan, startRowSpan, widgetId } = resizingState;

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

        setSlotLayout((prev) => ({
          ...prev,
          [widgetId]: { col: newCol, row: newRow, colSpan: newColSpan, rowSpan: newRowSpan },
        }));
      }
    };

    const handleMouseUp = () => {
      setMovingState(null);
      setResizingState(null);
      try {
        localStorage.setItem('dashboard_f1_slot_layout', JSON.stringify(slotLayout));
      } catch (e) {}
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [movingState, resizingState, slotLayout]);

  const handleMoveStart = (e: React.MouseEvent, widgetId: F1WidgetId) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a') || target.closest('input')) return;
    e.preventDefault();
    const current = slotLayout[widgetId] || DEFAULT_F1_SLOT_LAYOUT[widgetId];
    setMovingState({
      widgetId,
      startX: e.clientX,
      startY: e.clientY,
      startCol: current.col,
      startRow: current.row,
      colSpan: current.colSpan,
      rowSpan: current.rowSpan,
    });
  };

  const handleResizeStart = (e: React.MouseEvent, widgetId: F1WidgetId, dir: ResizeDirection) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const current = slotLayout[widgetId] || DEFAULT_F1_SLOT_LAYOUT[widgetId];
    setResizingState({
      widgetId,
      dir,
      startX: e.clientX,
      startY: e.clientY,
      startCol: current.col,
      startRow: current.row,
      startColSpan: current.colSpan,
      startRowSpan: current.rowSpan,
    });
  };

  // Map f1ActiveWidgets in exact user-defined order
  const visibleWidgets = React.useMemo(() => {
    return f1ActiveWidgets
      .map((id) => F1_AVAILABLE_WIDGETS.find((w) => w.id === id))
      .filter((w): w is F1WidgetDef => Boolean(w));
  }, [f1ActiveWidgets]);

  // Card Theme classes - fills 100% of the slot's dimensions
  const getCardClass = (size: F1WidgetSize = 'normal', widgetId?: F1WidgetId) => {
    const pad =
      size === 'compact'
        ? 'p-2.5 h-full overflow-hidden flex flex-col justify-between'
        : 'p-3.5 h-full overflow-hidden flex flex-col justify-between';

    if (uiStyle === 'minimal') {
      return `${pad} ${
        isLight
          ? 'bg-neutral-50/80 border border-neutral-200 rounded-xl text-neutral-900'
          : 'bg-white/[0.02] border border-white/10 rounded-xl text-neutral-100'
      }`;
    }
    if (uiStyle === 'eink') {
      return `${pad} ${
        isLight
          ? 'border-2 border-stone-800 bg-[#ede8df] text-[#1c1917]'
          : 'border-2 border-stone-600 bg-[#292524] text-[#f5f2eb]'
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
          ? 'bg-white/95 border border-slate-200 text-slate-900 shadow-sm rounded-xl'
          : 'bg-[#0f0f15] border border-white/[0.14] text-[#eef0f3] shadow-md rounded-xl'
      }`;
    }
    if (uiStyle === 'civic') {
      return `${pad} ${
        isLight
          ? 'bg-white border border-slate-300 rounded-xl shadow-sm text-slate-900'
          : 'bg-slate-900/90 border border-slate-700 rounded-xl shadow-md text-slate-100'
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
    if (uiStyle === 'obsidian') {
      return isLight ? 'bg-slate-50 border border-slate-200' : 'bg-[#08080c] border border-white/[0.08]';
    }
    if (uiStyle === 'civic') {
      return isLight ? 'bg-slate-50 border border-slate-200' : 'bg-slate-800/80 border border-slate-700/80';
    }
    return isLight ? 'bg-slate-100 border border-slate-200' : 'bg-white/5 border border-white/10';
  };

  const fontClass = uiStyle === 'tui' || uiStyle === 'hud' ? 'font-mono' : uiStyle === 'eink' ? 'font-serif' : 'font-sans';

  // Helper controls (Dimension Indicator + Drag Move Handle) inside each widget card header
  const renderCardControls = (widgetId: F1WidgetId) => {
    const layout = slotLayout[widgetId] || DEFAULT_F1_SLOT_LAYOUT[widgetId];
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

  const renderSizeToggle = renderCardControls;

  // 1. COUNTDOWN WIDGET
  const renderCountdownWidget = (size: F1WidgetSize) => {
    const isCompact = size === 'compact';

    if (uiStyle === 'tui') {
      return (
        <TuiBox
          key="countdown"
          title={isCompact ? 'COUNTDOWN' : 'NEXT_SESSION_COUNTDOWN'}
          badge={isCompact ? f1.nextSession.countdownFormatted : 'LIVE IN IST'}
          badgeColor="text-red-500"
          className={`border-red-500/50 ${isCompact ? 'h-full flex flex-col justify-between' : ''}`}
        >
          <div className="py-0.5 flex flex-col justify-between h-full">
            <div className={!isCompact ? 'flex items-center justify-between pb-1.5 border-b border-red-500/30' : 'space-y-1'}>
              <div>
                <div className={`text-[8px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>TARGET:</div>
                <div className="text-xs font-bold truncate mt-0.5">
                  {f1.nextSession.name.toUpperCase()}
                </div>
                <div className="text-[10px] text-red-500 mt-0.5 font-mono truncate">&gt;&gt; {f1.nextSession.istTimeFormatted}</div>
              </div>
              <div className={`px-2 py-1 border border-red-500/60 text-center ${isLight ? 'bg-red-50' : 'bg-red-950/20'} ${isCompact ? 'mt-1' : ''}`}>
                <div className="text-[7px] uppercase tracking-wider font-bold opacity-75">T-MINUS</div>
                <div className="text-xs font-black text-red-500 tracking-wider animate-pulse font-mono tabular-nums">
                  T-{f1.nextSession.countdownFormatted}
                </div>
              </div>
            </div>

            {!isCompact && (
              <div className="grid grid-cols-4 gap-1 text-[10px] pt-1.5">
                <div className={`p-1 border text-center ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                  <div className="text-[8px] opacity-70">LAPS</div>
                  <div className="font-bold">50 LAPS</div>
                </div>
                <div className={`p-1 border text-center ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                  <div className="text-[8px] opacity-70">CIRCUIT</div>
                  <div className="font-bold">6.201 KM</div>
                </div>
                <div className={`p-1 border text-center ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                  <div className="text-[8px] opacity-70">DRS</div>
                  <div className="text-red-500 font-bold">2 ZONES</div>
                </div>
                <div className={`p-1 border text-center ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                  <div className="text-[8px] opacity-70">RECORD</div>
                  <div className="text-amber-500 font-bold">{f1.circuitLapRecord?.lapTime || '1:35.490'}</div>
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
          key="countdown"
          title={isCompact ? 'COUNTDOWN' : 'NEXT SESSION COUNTDOWN'}
          badge={isCompact ? f1.nextSession.countdownFormatted : 'LIVE IN IST'}
          badgeColor="bg-red-600 text-white"
          className={isCompact ? 'h-full flex flex-col justify-between' : ''}
        >
          <div className="py-0.5 flex flex-col justify-between h-full">
            <div className={!isCompact ? 'flex items-center justify-between pb-1.5 border-b-2 border-black' : 'space-y-1'}>
              <div>
                <div className="text-[8px] font-black uppercase tracking-wider opacity-75">TARGET</div>
                <div className="text-xs font-black uppercase tracking-tight truncate">
                  {f1.nextSession.name}
                </div>
                <div className="text-[10px] font-mono font-bold mt-0.5 flex items-center text-red-500 truncate">
                  <Calendar size={10} className="mr-1 shrink-0" />
                  {f1.nextSession.istTimeFormatted}
                </div>
              </div>
              <div
                className={`px-2 py-1 border-2 border-black text-center shadow-[1px_1px_0px_#000] ${isCompact ? 'mt-1' : ''}`}
                style={{ backgroundColor: 'var(--color-accent, #facc15)' }}
              >
                <div className="text-[7px] font-black uppercase tracking-widest text-black">T-MINUS</div>
                <div className="text-xs font-black font-mono text-black tracking-wider tabular-nums">
                  {f1.nextSession.countdownFormatted}
                </div>
              </div>
            </div>

            {!isCompact && (
              <div className="grid grid-cols-4 gap-1.5 text-xs pt-1.5">
                <div className={`p-1 border-2 border-black text-center ${isLight ? 'bg-neutral-100 shadow-[1px_1px_0px_#000]' : 'bg-neutral-900 shadow-[1px_1px_0px_#fff]'}`}>
                  <span className="block text-[8px] font-black uppercase opacity-75">Laps</span>
                  <span className="font-mono font-black text-xs">50</span>
                </div>
                <div className={`p-1 border-2 border-black text-center ${isLight ? 'bg-neutral-100 shadow-[1px_1px_0px_#000]' : 'bg-neutral-900 shadow-[1px_1px_0px_#fff]'}`}>
                  <span className="block text-[8px] font-black uppercase opacity-75">Length</span>
                  <span className="font-mono font-black text-xs">6.2 KM</span>
                </div>
                <div className={`p-1 border-2 border-black text-center ${isLight ? 'bg-neutral-100 shadow-[1px_1px_0px_#000]' : 'bg-neutral-900 shadow-[1px_1px_0px_#fff]'}`}>
                  <span className="block text-[8px] font-black uppercase opacity-75">DRS</span>
                  <span className="font-mono font-black text-xs text-red-500">2 ZONES</span>
                </div>
                <div className={`p-1 border-2 border-black text-center ${isLight ? 'bg-neutral-100 shadow-[1px_1px_0px_#000]' : 'bg-neutral-900 shadow-[1px_1px_0px_#fff]'}`}>
                  <span className="block text-[8px] font-black uppercase opacity-75">Record</span>
                  <span className="font-mono font-black text-xs text-amber-500">{f1.circuitLapRecord?.lapTime || '1:35.4'}</span>
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
          key="countdown"
          title={isCompact ? 'COUNTDOWN' : 'NEXT_SESSION_COUNTDOWN'}
          code={isCompact ? f1.nextSession.countdownFormatted : 'LIVE_IST'}
          glowColor="cyan"
          className={isCompact ? 'h-full flex flex-col justify-between' : ''}
        >
          <div className="py-0.5 flex flex-col justify-between h-full">
            <div className={!isCompact ? 'flex items-center justify-between pb-1.5 border-b border-cyan-500/20' : 'space-y-1'}>
              <div>
                <span className="text-[8px] block opacity-75">TARGET</span>
                <span className="text-xs font-black tracking-wide truncate block">{f1.nextSession.name}</span>
                <span className="text-[10px] font-mono block mt-0.5 flex items-center truncate" style={{ color: 'var(--color-accent)' }}>
                  <Calendar size={10} className="mr-1 shrink-0" />
                  {f1.nextSession.istTimeFormatted}
                </span>
              </div>
              <div className={`px-2 py-1 border text-center ${isLight ? 'bg-cyan-100/60 border-cyan-400' : 'bg-black/60 border-cyan-500/50'} ${isCompact ? 'mt-1' : ''}`}>
                <div className="text-[7px] uppercase tracking-widest opacity-80">T-MINUS</div>
                <div className="text-xs font-black font-mono tracking-wider text-rose-500 animate-pulse tabular-nums">
                  T-{f1.nextSession.countdownFormatted}
                </div>
              </div>
            </div>

            {!isCompact && (
              <div className="grid grid-cols-4 gap-1.5 text-xs pt-2">
                <div className={`p-1 border text-center ${isLight ? 'bg-white/80 border-cyan-200' : 'bg-black/40 border-cyan-500/20'}`}>
                  <span className="block text-[8px] opacity-75">LAPS</span>
                  <span className="font-bold text-xs">50</span>
                </div>
                <div className={`p-1 border text-center ${isLight ? 'bg-white/80 border-cyan-200' : 'bg-black/40 border-cyan-500/20'}`}>
                  <span className="block text-[8px] opacity-75">LENGTH</span>
                  <span className="font-bold text-xs">6.2 KM</span>
                </div>
                <div className={`p-1 border text-center ${isLight ? 'bg-white/80 border-cyan-200' : 'bg-black/40 border-cyan-500/20'}`}>
                  <span className="block text-[8px] opacity-75">DRS</span>
                  <span className="font-bold text-rose-500 text-xs">2 ZONES</span>
                </div>
                <div className={`p-1 border text-center ${isLight ? 'bg-white/80 border-cyan-200' : 'bg-black/40 border-cyan-500/20'}`}>
                  <span className="block text-[8px] opacity-75">RECORD</span>
                  <span className="font-bold text-amber-400 text-xs">{f1.circuitLapRecord?.lapTime || '1:35.4'}</span>
                </div>
              </div>
            )}
          </div>
        </HudBox>
      );
    }

    // Default Glass / Minimal / Neumorphic / Eink / Retrowave / Obsidian / Civic
    return (
      <div key="countdown" className={`border shadow-md relative overflow-hidden ${getCardClass(size, 'countdown')}`}>
        <div className="flex items-center justify-between pb-1.5 border-b border-red-500/10">
          <div className={`flex items-center space-x-1.5 text-[10px] uppercase font-extrabold tracking-widest ${
            isLight ? 'text-red-600' : 'text-red-400'
          }`}>
            <Timer size={12} />
            <span className="truncate">{isCompact ? 'Countdown' : 'Next Session Countdown'}</span>
          </div>
          <div className="flex items-center space-x-1.5 shrink-0">
            {renderSizeToggle('countdown')}
            {!isCompact && (
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-red-600 text-white shadow-sm">
                LIVE IST
              </span>
            )}
          </div>
        </div>

        {isCompact ? (
          <div className="py-1.5 flex flex-col justify-between flex-1 space-y-1.5">
            <div>
              <h2 className="text-xs font-extrabold truncate">
                {f1.nextSession.name}
              </h2>
              <p className="text-[10px] font-mono opacity-75 truncate flex items-center mt-0.5">
                <Calendar size={10} className="mr-1 text-red-500 shrink-0" />
                {f1.nextSession.istTimeFormatted}
              </p>
            </div>
            <div className={`p-1.5 rounded-xl border text-center font-mono ${getInnerClass()}`}>
              <span className="text-[7px] uppercase tracking-wider block opacity-70">T-Minus</span>
              <span className="text-xs font-black text-red-500 block leading-tight tabular-nums animate-pulse mt-0.5">
                {f1.nextSession.countdownFormatted}
              </span>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between py-2">
              <div>
                <h2 className="text-lg font-bold">
                  {f1.nextSession.name}
                </h2>
                <p className="text-xs font-mono mt-0.5 flex items-center opacity-75">
                  <Calendar size={11} className="mr-1 text-red-500" />
                  {f1.nextSession.istTimeFormatted}
                </p>
              </div>
              <div className={`px-2 py-1 rounded-xl border flex items-center space-x-1 font-mono ${getInnerClass()}`}>
                {(f1.nextSession.days ?? 0) > 0 && (
                  <>
                    <div className="text-center min-w-[24px]">
                      <span className="text-sm font-extrabold block leading-tight tabular-nums">
                        {String(f1.nextSession.days).padStart(2, '0')}
                      </span>
                      <span className="text-[7px] uppercase tracking-wider block opacity-70">Days</span>
                    </div>
                    <span className="text-xs text-red-500 font-bold">:</span>
                  </>
                )}
                <div className="text-center min-w-[24px]">
                  <span className="text-sm font-extrabold block leading-tight tabular-nums">
                    {String(f1.nextSession.hours ?? 0).padStart(2, '0')}
                  </span>
                  <span className="text-[7px] uppercase tracking-wider block opacity-70">Hrs</span>
                </div>
                <span className="text-xs text-red-500 font-bold">:</span>
                <div className="text-center min-w-[24px]">
                  <span className="text-sm font-extrabold block leading-tight tabular-nums">
                    {String(f1.nextSession.mins ?? 0).padStart(2, '0')}
                  </span>
                  <span className="text-[7px] uppercase tracking-wider block opacity-70">Min</span>
                </div>
                <span className="text-xs text-red-500 font-bold">:</span>
                <div className="text-center min-w-[24px]">
                  <span className="text-sm font-extrabold text-red-500 block leading-tight tabular-nums animate-pulse">
                    {String(f1.nextSession.secs ?? 0).padStart(2, '0')}
                  </span>
                  <span className="text-[7px] uppercase tracking-wider block opacity-70">Sec</span>
                </div>
              </div>
            </div>

            <div className={`grid grid-cols-4 gap-1.5 pt-1.5 border-t border-current/10 text-xs`}>
              <div className={`p-1 rounded-lg text-center ${getInnerClass()}`}>
                <span className="block text-[8px] uppercase opacity-70">Laps</span>
                <span className="font-mono font-bold text-xs">50</span>
              </div>
              <div className={`p-1 rounded-lg text-center ${getInnerClass()}`}>
                <span className="block text-[8px] uppercase opacity-70">Length</span>
                <span className="font-mono font-bold text-xs">6.2 km</span>
              </div>
              <div className={`p-1 rounded-lg text-center ${getInnerClass()}`}>
                <span className="block text-[8px] uppercase opacity-70">DRS</span>
                <span className="font-mono font-bold text-red-500 text-xs">2 Zones</span>
              </div>
              <div className={`p-1 rounded-lg text-center ${getInnerClass()}`}>
                <span className="block text-[8px] uppercase opacity-70">Record</span>
                <span className="font-mono font-bold text-amber-500 text-xs">
                  {f1.circuitLapRecord?.lapTime || '1:35.4'}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  // 2. PODIUM WIDGET
  const renderPodiumWidget = (size: F1WidgetSize) => {
    if (!f1.lastRace) return null;
    const isCompact = size === 'compact';

    if (uiStyle === 'tui') {
      return (
        <TuiBox
          key="podium"
          title={isCompact ? 'PREV_PODIUM' : 'PREV_GP_PODIUM'}
          badge={isCompact ? f1.lastRace.winner.split(' ')[0].toUpperCase() : f1.lastRace.raceName.toUpperCase()}
          badgeColor="text-amber-400"
          className={isCompact ? 'h-full flex flex-col justify-between' : ''}
        >
          {isCompact ? (
            <div className="text-xs space-y-1 py-0.5 flex flex-col justify-between h-full font-mono">
              <div className="text-amber-400 font-bold truncate">P1: {f1.lastRace.winner.toUpperCase()}</div>
              <div className="text-[10px] text-gray-400 truncate">P2: {f1.lastRace.p2.split(' ')[0]} • P3: {f1.lastRace.p3.split(' ')[0]}</div>
              <div className="text-[9px] text-purple-400 truncate">FL: {f1.lastRace.fastestLapTime}</div>
            </div>
          ) : (
            <div className="text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-amber-400 font-bold">P1: {f1.lastRace.winner.toUpperCase()} ({f1.lastRace.winnerTeam})</span>
                <span className="text-[10px] text-purple-400 font-mono">FL: {f1.lastRace.fastestLapDriver} [{f1.lastRace.fastestLapTime}]</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-gray-800">
                <span className={isLight ? 'text-slate-600' : 'text-gray-400'}>P2: {f1.lastRace.p2}</span>
                <span className={isLight ? 'text-slate-600' : 'text-gray-400'}>P3: {f1.lastRace.p3}</span>
              </div>
            </div>
          )}
        </TuiBox>
      );
    }

    if (uiStyle === 'brutalist') {
      return (
        <BrutalistBox
          key="podium"
          title={isCompact ? 'PREV PODIUM' : `PREV GP: ${f1.lastRace.raceName.toUpperCase()}`}
          badge={isCompact ? f1.lastRace.fastestLapTime : `FL: ${f1.lastRace.fastestLapDriver} (${f1.lastRace.fastestLapTime})`}
          badgeColor="bg-purple-600 text-white"
          className={isCompact ? 'h-full flex flex-col justify-between' : ''}
        >
          {isCompact ? (
            <div className="py-1 space-y-1.5 text-xs font-black flex flex-col justify-between h-full">
              <div className={`p-1 border border-black ${isLight ? 'bg-yellow-300' : 'bg-yellow-400 text-black'}`}>
                <span className="text-[8px] block opacity-75">🥇 WINNER</span>
                <div className="truncate text-xs font-black">{f1.lastRace.winner}</div>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono px-0.5">
                <span className="truncate">🥈 {f1.lastRace.p2.split(' ')[0]}</span>
                <span className="truncate">🥉 {f1.lastRace.p3.split(' ')[0]}</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1.5 text-xs py-0.5">
              <div className={`p-1.5 border-2 border-black ${isLight ? 'bg-yellow-300 shadow-[1px_1px_0px_#000]' : 'bg-yellow-400 text-black shadow-[1px_1px_0px_#fff]'}`}>
                <div className="font-black text-[9px]">🥇 P1 WINNER</div>
                <div className="font-black truncate text-[11px]">{f1.lastRace.winner}</div>
              </div>
              <div className={`p-1.5 border-2 border-black ${isLight ? 'bg-neutral-100 shadow-[1px_1px_0px_#000]' : 'bg-neutral-900 text-white shadow-[1px_1px_0px_#fff]'}`}>
                <div className="font-black text-[9px]">🥈 P2</div>
                <div className="font-black truncate text-[11px]">{f1.lastRace.p2.split(' ')[0]} {f1.lastRace.p2.split(' ')[1]}</div>
              </div>
              <div className={`p-1.5 border-2 border-black ${isLight ? 'bg-neutral-100 shadow-[1px_1px_0px_#000]' : 'bg-neutral-900 text-white shadow-[1px_1px_0px_#fff]'}`}>
                <div className="font-black text-[9px]">🥉 P3</div>
                <div className="font-black truncate text-[11px]">{f1.lastRace.p3.split(' ')[0]} {f1.lastRace.p3.split(' ')[1]}</div>
              </div>
            </div>
          )}
        </BrutalistBox>
      );
    }

    if (uiStyle === 'hud') {
      return (
        <HudBox
          key="podium"
          title={isCompact ? 'PODIUM' : 'LAST_GP_PODIUM'}
          code={isCompact ? f1.lastRace.winner.split(' ')[0].toUpperCase() : f1.lastRace.raceName.toUpperCase()}
          glowColor="amber"
          className={isCompact ? 'h-full flex flex-col justify-between' : ''}
        >
          {isCompact ? (
            <div className="space-y-1 text-xs py-0.5 font-mono flex flex-col justify-between h-full">
              <div className="text-amber-400 font-bold truncate">P1: {f1.lastRace.winner}</div>
              <div className="text-[10px] text-cyan-300 truncate">P2: {f1.lastRace.p2.split(' ')[0]} • P3: {f1.lastRace.p3.split(' ')[0]}</div>
              <div className="text-[9px] text-purple-400 truncate">FL: {f1.lastRace.fastestLapTime}</div>
            </div>
          ) : (
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between text-amber-400 font-bold">
                <span>P1: {f1.lastRace.winner} ({f1.lastRace.winnerTeam})</span>
                <span className="text-[10px] text-purple-400 font-mono">FL: {f1.lastRace.fastestLapDriver} [{f1.lastRace.fastestLapTime}]</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] pt-1 border-t border-cyan-500/20">
                <span className={isLight ? 'text-slate-600' : 'text-gray-400'}>P2: {f1.lastRace.p2}</span>
                <span className={isLight ? 'text-slate-600' : 'text-gray-400'}>P3: {f1.lastRace.p3}</span>
              </div>
            </div>
          )}
        </HudBox>
      );
    }

    return (
      <div key="podium" className={`border ${getCardClass(size, 'podium')}`}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] uppercase font-bold tracking-wider flex items-center space-x-1.5 opacity-80 truncate">
            <Award size={12} className="text-amber-500 shrink-0" />
            <span className="truncate">{isCompact ? 'Prev Podium' : `PREV GP: ${f1.lastRace.raceName}`}</span>
          </span>
          <div className="flex items-center space-x-1.5 shrink-0">
            {renderSizeToggle('podium')}
            {!isCompact && (
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center space-x-1">
                <Zap size={9} />
                <span>FL: {f1.lastRace.fastestLapDriver} ({f1.lastRace.fastestLapTime})</span>
              </span>
            )}
          </div>
        </div>

        {isCompact ? (
          <div className="space-y-1.5 py-1 flex-1 flex flex-col justify-between">
            <div className={`p-1.5 rounded-xl border flex items-center justify-between ${
              isLight ? 'bg-amber-50/70 border-amber-200' : 'bg-amber-500/10 border-amber-500/20'
            }`}>
              <div className="flex items-center space-x-1.5 min-w-0">
                <span className="text-amber-500 font-extrabold text-xs">🥇</span>
                <span className="font-bold text-xs truncate">{f1.lastRace.winner}</span>
              </div>
              <span className="text-[8px] opacity-70 font-mono shrink-0">{f1.lastRace.winnerTeam}</span>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono px-0.5 opacity-80">
              <span className="truncate">🥈 {f1.lastRace.p2.split(' ')[0]}</span>
              <span className="truncate">🥉 {f1.lastRace.p3.split(' ')[0]}</span>
            </div>
            <div className="text-[8px] font-mono text-purple-400 flex items-center space-x-1 px-0.5 truncate">
              <Zap size={8} className="shrink-0" />
              <span className="truncate">FL: {f1.lastRace.fastestLapDriver} ({f1.lastRace.fastestLapTime})</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className={`p-1.5 rounded-xl border flex items-center space-x-1.5 ${
              isLight ? 'bg-amber-50/60 border-amber-200' : 'bg-amber-500/10 border-amber-500/20'
            }`}>
              <span className="text-amber-500 font-extrabold text-xs">🥇 P1</span>
              <div className="truncate">
                <p className="font-bold truncate text-[11px]">{f1.lastRace.winner}</p>
                <p className="text-[8px] truncate opacity-70">{f1.lastRace.winnerTeam}</p>
              </div>
            </div>
            <div className={`p-1.5 rounded-xl border flex items-center space-x-1.5 ${getInnerClass()}`}>
              <span className="text-slate-400 font-bold text-xs">🥈 P2</span>
              <div className="truncate">
                <p className="font-bold truncate text-[11px]">{f1.lastRace.p2.split(' ')[0]} {f1.lastRace.p2.split(' ')[1]}</p>
                <p className="text-[8px] truncate opacity-70">{f1.lastRace.p2Team}</p>
              </div>
            </div>
            <div className={`p-1.5 rounded-xl border flex items-center space-x-1.5 ${getInnerClass()}`}>
              <span className="text-amber-700 font-bold text-xs">🥉 P3</span>
              <div className="truncate">
                <p className="font-bold truncate text-[11px]">{f1.lastRace.p3.split(' ')[0]} {f1.lastRace.p3.split(' ')[1]}</p>
                <p className="text-[8px] truncate opacity-70">{f1.lastRace.p3Team}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 3. TITLE BATTLE WIDGET
  const renderTitleBattleWidget = (size: F1WidgetSize) => {
    const battle = f1.titleBattle;
    if (!battle) return null;
    const isCompact = size === 'compact';

    if (uiStyle === 'tui') {
      return (
        <TuiBox
          key="titleBattle"
          title={isCompact ? 'TITLE_FIGHT' : 'TITLE_FIGHT_TELEMETRY'}
          badge={`+${battle.pointsGap} PTS`}
          badgeColor="text-emerald-400"
          className={isCompact ? 'h-full flex flex-col justify-between' : ''}
        >
          <div className="text-xs space-y-1 py-0.5 flex flex-col justify-between h-full font-mono">
            <div className="space-y-0.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-emerald-400 font-bold truncate">P1: {battle.leader}</span>
                <span className="text-gray-400 font-mono text-[10px] shrink-0">{battle.leaderPoints}p</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-red-400 font-bold truncate">P2: {battle.contender}</span>
                <span className="text-gray-400 font-mono text-[10px] shrink-0">{battle.contenderPoints}p</span>
              </div>
            </div>
            <div className="w-full bg-gray-900 border border-gray-700 h-1.5 flex mt-1">
              <div className="bg-emerald-500 h-full" style={{ width: `${Math.min(95, Math.max(5, (battle.leaderPoints / (battle.leaderPoints + battle.contenderPoints)) * 100))}%` }} />
              <div className="bg-red-500 h-full flex-1" />
            </div>
            {!isCompact && (
              <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
                <span>WCC: {battle.teamLeader} +{battle.teamPointsGap} pts</span>
                <span>{battle.roundsRemaining} RDS LEFT</span>
              </div>
            )}
          </div>
        </TuiBox>
      );
    }

    if (uiStyle === 'brutalist') {
      return (
        <BrutalistBox
          key="titleBattle"
          title={isCompact ? 'TITLE FIGHT' : 'CHAMPIONSHIP TITLE FIGHT'}
          badge={`+${battle.pointsGap} PTS`}
          badgeColor="bg-black text-yellow-300"
          className={isCompact ? 'h-full flex flex-col justify-between' : ''}
        >
          <div className="py-0.5 text-xs space-y-1 flex flex-col justify-between h-full">
            <div className="space-y-0.5 font-black">
              <div className="flex items-center justify-between">
                <span className="truncate" style={{ color: battle.leaderColor }}>P1 {battle.leader}</span>
                <span className="font-mono text-[10px]">{battle.leaderPoints}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="truncate" style={{ color: battle.contenderColor }}>P2 {battle.contender}</span>
                <span className="font-mono text-[10px]">{battle.contenderPoints}</span>
              </div>
            </div>
            <div className="w-full border-2 border-black h-2 bg-neutral-200 overflow-hidden flex my-0.5">
              <div className="h-full bg-emerald-400" style={{ width: `${Math.min(95, Math.max(5, (battle.leaderPoints / (battle.leaderPoints + battle.contenderPoints)) * 100))}%` }} />
              <div className="h-full bg-rose-500 flex-1" />
            </div>
            {!isCompact && (
              <div className="flex items-center justify-between text-[10px] font-black uppercase">
                <span>WCC: {battle.teamLeader} (+{battle.teamPointsGap} PTS)</span>
                <span>{battle.roundsRemaining} ROUNDS LEFT</span>
              </div>
            )}
          </div>
        </BrutalistBox>
      );
    }

    if (uiStyle === 'hud') {
      return (
        <HudBox
          key="titleBattle"
          title={isCompact ? 'TITLE_GAP' : 'WDC_TITLE_BATTLE_INDEX'}
          code={`+${battle.pointsGap}PTS`}
          glowColor="cyan"
          className={isCompact ? 'h-full flex flex-col justify-between' : ''}
        >
          <div className="text-xs space-y-1 py-0.5 font-mono flex flex-col justify-between h-full">
            <div className="space-y-0.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-cyan-300 truncate">P1: {battle.leader}</span>
                <span className="text-[10px] opacity-75">{battle.leaderPoints}p</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-rose-400 truncate">P2: {battle.contender}</span>
                <span className="text-[10px] opacity-75">{battle.contenderPoints}p</span>
              </div>
            </div>
            <div className="w-full bg-black/60 border border-cyan-500/40 h-1.5 flex my-0.5">
              <div className="bg-cyan-400 h-full shadow-[0_0_8px_#06b6d4]" style={{ width: `${Math.min(95, Math.max(5, (battle.leaderPoints / (battle.leaderPoints + battle.contenderPoints)) * 100))}%` }} />
              <div className="bg-rose-500 h-full flex-1" />
            </div>
            {!isCompact && (
              <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
                <span>WCC: {battle.teamLeader} (+{battle.teamPointsGap} PTS)</span>
                <span>ROUNDS_LEFT: {battle.roundsRemaining}</span>
              </div>
            )}
          </div>
        </HudBox>
      );
    }

    return (
      <div key="titleBattle" className={`border ${getCardClass(size, 'titleBattle')}`}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] uppercase font-bold tracking-wider flex items-center space-x-1.5 opacity-80 truncate">
            <Trophy size={12} className="text-emerald-500 shrink-0" />
            <span className="truncate">{isCompact ? 'Title Battle' : 'TITLE BATTLE (P1 VS P2)'}</span>
          </span>
          <div className="flex items-center space-x-1 shrink-0">
            {renderSizeToggle('titleBattle')}
            {!isCompact && (
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                +{battle.pointsGap} PTS GAP
              </span>
            )}
          </div>
        </div>

        {isCompact ? (
          <div className="space-y-1.5 py-0.5 flex-1 flex flex-col justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="truncate" style={{ color: battle.leaderColor }}>P1 {battle.leader}</span>
                <span className="font-mono text-[9px] opacity-80 shrink-0">{battle.leaderPoints}p</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="truncate" style={{ color: battle.contenderColor }}>P2 {battle.contender}</span>
                <span className="font-mono text-[9px] opacity-80 shrink-0">{battle.contenderPoints}p</span>
              </div>
            </div>
            <div className={`w-full h-1.5 rounded-full overflow-hidden flex border ${isLight ? 'border-slate-300 bg-slate-200' : 'border-white/10 bg-black/40'}`}>
              <div className="bg-emerald-500 h-full" style={{ width: `${Math.min(95, Math.max(5, (battle.leaderPoints / (battle.leaderPoints + battle.contenderPoints)) * 100))}%` }} />
              <div className="bg-rose-500 h-full flex-1" />
            </div>
            <div className="flex items-center justify-between text-[8px] font-mono opacity-80 pt-0.5 border-t border-black/10 dark:border-white/10">
              <span className="text-emerald-500 font-bold truncate mr-1">+{battle.pointsGap} PTS GAP</span>
              <span className="shrink-0">{battle.roundsRemaining} RDS LEFT</span>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="truncate" style={{ color: battle.leaderColor }}>{battle.leader} ({battle.leaderPoints} pts)</span>
              <span className="truncate text-right" style={{ color: battle.contenderColor }}>{battle.contender} ({battle.contenderPoints} pts)</span>
            </div>
            <div className={`w-full h-2 rounded-full overflow-hidden flex border ${isLight ? 'border-slate-300 bg-slate-200' : 'border-white/10 bg-black/40'}`}>
              <div className="bg-emerald-500 h-full" style={{ width: `${Math.min(95, Math.max(5, (battle.leaderPoints / (battle.leaderPoints + battle.contenderPoints)) * 100))}%` }} />
              <div className="bg-rose-500 h-full flex-1" />
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono mt-1 opacity-75">
              <span>WCC: {battle.teamLeader} +{battle.teamPointsGap} over {battle.teamContender}</span>
              <span>{battle.roundsRemaining} rounds left</span>
            </div>
          </>
        )}
      </div>
    );
  };

  // 4. QUALIFYING WIDGET
  const renderQualifyingWidget = (size: F1WidgetSize) => {
    const quali = f1.qualifyingResult;
    if (!quali) return null;
    const isCompact = size === 'compact';

    if (uiStyle === 'tui') {
      return (
        <TuiBox
          key="qualifying"
          title={isCompact ? 'QUALIFYING' : 'PREV_QUALIFYING_GRID'}
          badge="POLE"
          badgeColor="text-yellow-400"
          className={isCompact ? 'h-full flex flex-col justify-between' : ''}
        >
          <div className="text-xs space-y-1 py-0.5 flex flex-col justify-between h-full font-mono">
            <div className="text-yellow-400 font-bold truncate">POLE: {quali.poleDriver.toUpperCase()}</div>
            <div className="text-gray-400 font-mono text-[10px]">{quali.poleTime} • {quali.poleTeam}</div>
            {!isCompact ? (
              <div className="grid grid-cols-2 gap-2 text-[10px] pt-1 border-t border-gray-800 text-gray-400">
                <span>P2: {quali.p2Driver} [{quali.p2Time}]</span>
                <span>P3: {quali.p3Driver} [{quali.p3Time}]</span>
              </div>
            ) : (
              <div className="text-[9px] text-gray-500 truncate">P2: {quali.p2Driver}</div>
            )}
          </div>
        </TuiBox>
      );
    }

    if (uiStyle === 'brutalist') {
      return (
        <BrutalistBox
          key="qualifying"
          title={isCompact ? 'QUALIFYING' : 'QUALIFYING SHOOTOUT'}
          badge="POLE"
          badgeColor="bg-yellow-400 text-black"
          className={isCompact ? 'h-full flex flex-col justify-between' : ''}
        >
          <div className="py-0.5 text-xs space-y-1 flex flex-col justify-between h-full font-black">
            <div className="flex items-center justify-between">
              <span className="text-amber-500 truncate">POLE: {quali.poleDriver}</span>
              <span className="font-mono bg-black text-yellow-300 px-1 text-[10px] shrink-0">{quali.poleTime}</span>
            </div>
            <div className="text-[9px] opacity-75 font-mono truncate">{quali.poleTeam}</div>
            {!isCompact ? (
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1 border-t-2 border-black">
                <span>P2: {quali.p2Driver} ({quali.p2Time})</span>
                <span>P3: {quali.p3Driver} ({quali.p3Time})</span>
              </div>
            ) : (
              <div className="text-[9px] font-mono opacity-80 truncate">P2: {quali.p2Driver}</div>
            )}
          </div>
        </BrutalistBox>
      );
    }

    return (
      <div key="qualifying" className={`border ${getCardClass(size, 'qualifying')}`}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] uppercase font-bold tracking-wider flex items-center space-x-1.5 opacity-80 truncate">
            <Zap size={12} className="text-amber-500 shrink-0" />
            <span className="truncate">{isCompact ? 'Qualifying' : `QUALIFYING: ${quali.raceName}`}</span>
          </span>
          <div className="flex items-center space-x-1 shrink-0">
            {renderSizeToggle('qualifying')}
            {!isCompact && (
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                POLE: {quali.poleTime}
              </span>
            )}
          </div>
        </div>

        {isCompact ? (
          <div className="space-y-1.5 py-1 flex-1 flex flex-col justify-between">
            <div className={`p-1.5 rounded-xl border flex items-center justify-between ${
              isLight ? 'bg-amber-50/70 border-amber-200' : 'bg-amber-500/10 border-amber-500/20'
            }`}>
              <div className="truncate">
                <span className="text-[7px] font-bold uppercase block text-amber-500">POLE POSITION</span>
                <span className="font-bold text-xs truncate block">{quali.poleDriver}</span>
                <span className="text-[8px] opacity-70 truncate block">{quali.poleTeam}</span>
              </div>
              <span className="font-mono font-extrabold text-xs text-amber-400 shrink-0">{quali.poleTime}</span>
            </div>
            <div className="text-[9px] font-mono opacity-80 truncate">
              P2: {quali.p2Driver} • P3: {quali.p3Driver}
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="text-amber-500">🏆 1st: {quali.poleDriver} ({quali.poleTeam})</span>
              <span className="font-mono text-[11px] text-amber-400">{quali.poleTime}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono opacity-80 pt-1 border-t border-current/10">
              <span>2nd: {quali.p2Driver} ({quali.p2Time})</span>
              <span>3rd: {quali.p3Driver} ({quali.p3Time})</span>
            </div>
          </>
        )}
      </div>
    );
  };

  // 5. PIT STOP WIDGET
  // 5. DHL FASTEST PIT STOP WIDGET
  const renderPitStopWidget = (size: F1WidgetSize) => {
    const pit = f1.pitStopRecord;
    if (!pit) return null;
    const isCompact = size === 'compact';
    const numDuration = parseFloat(pit.duration) || 2.1;
    const stationaryEst = (numDuration > 5 ? numDuration * 0.09 : numDuration).toFixed(2);
    const laneEst = (numDuration > 5 ? numDuration * 0.91 : numDuration + 19.4).toFixed(1);

    if (uiStyle === 'tui') {
      return (
        <TuiBox
          key="pitstop"
          title={isCompact ? 'FASTEST_PIT' : 'DHL_FASTEST_PITSTOP'}
          badge={pit.duration}
          badgeColor="text-yellow-400"
          className={isCompact ? 'h-full flex flex-col justify-between' : ''}
        >
          <div className="text-xs space-y-1.5 py-0.5 flex flex-col justify-between h-full font-mono">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-white truncate">{pit.driver}</div>
                <div className="text-[9px] text-gray-400 truncate">{pit.team} • LAP {pit.lap}</div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-amber-400 font-bold block">{pit.duration}</span>
                <span className="text-[8px] text-yellow-500 uppercase">DHL RECORD</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[8px] pt-1 border-t border-gray-800">
              <div><span className="opacity-60">STOP:</span> ~{stationaryEst}s</div>
              <div><span className="opacity-60">LANE:</span> ~{laneEst}s</div>
            </div>
          </div>
        </TuiBox>
      );
    }

    if (uiStyle === 'brutalist') {
      return (
        <BrutalistBox
          key="pitstop"
          title={isCompact ? 'FASTEST PIT' : 'FASTEST PIT STOP AWARD'}
          badge={pit.duration}
          badgeColor="bg-yellow-400 text-black"
          className={isCompact ? 'h-full flex flex-col justify-between' : ''}
        >
          <div className="py-0.5 text-xs space-y-1.5 flex flex-col justify-between h-full font-black">
            <div className="flex items-center justify-between">
              <div className="truncate mr-1">
                <span className="truncate block">{pit.driver}</span>
                <span className="text-[9px] opacity-75 font-mono truncate block">{pit.team} • L{pit.lap}</span>
              </div>
              <span className="font-mono bg-black text-yellow-300 px-1.5 py-0.5 text-xs shrink-0 shadow-[1px_1px_0px_#000]">
                {pit.duration}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[8px] font-mono pt-1 border-t-2 border-black">
              <div>STOP: ~{stationaryEst}s</div>
              <div>LANE: ~{laneEst}s</div>
            </div>
          </div>
        </BrutalistBox>
      );
    }

    return (
      <div key="pitstop" className={`border ${getCardClass(size, 'pitstop')}`}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-1.5 opacity-80 truncate">
            <Wrench size={12} className="text-amber-400 shrink-0" />
            <span className="text-[10px] uppercase font-bold tracking-wider truncate">
              {isCompact ? 'Fastest Pit' : `DHL FASTEST PIT STOP (${pit.raceName})`}
            </span>
          </div>
          <div className="flex items-center space-x-1 shrink-0">
            {renderSizeToggle('pitstop')}
          </div>
        </div>

        {isCompact ? (
          <div className="py-0.5 flex-1 flex flex-col justify-between space-y-1">
            <div className="flex items-center justify-between">
              <div className="truncate mr-2">
                <span className="font-bold text-xs block truncate leading-tight">{pit.driver}</span>
                <span className="text-[9px] opacity-70 block truncate">{pit.team}</span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-sm font-black font-mono text-amber-500 block leading-tight">{pit.duration}</span>
                <span className="text-[8px] font-mono opacity-70 block">Lap {pit.lap}</span>
              </div>
            </div>
            {/* Rich Telemetry Row to fill gaps completely */}
            <div className="grid grid-cols-3 gap-1 text-[8px] font-mono pt-1 border-t border-black/10 dark:border-white/10 text-center">
              <div className={`p-0.5 rounded ${getInnerClass()}`}>
                <span className="opacity-60 block text-[7px]">STOP</span>
                <span className="font-bold text-amber-500">~{stationaryEst}s</span>
              </div>
              <div className={`p-0.5 rounded ${getInnerClass()}`}>
                <span className="opacity-60 block text-[7px]">LANE</span>
                <span className="font-bold">~{laneEst}s</span>
              </div>
              <div className={`p-0.5 rounded ${getInnerClass()}`}>
                <span className="opacity-60 block text-[7px]">AWARD</span>
                <span className="font-bold text-yellow-400">DHL #1</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-between py-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5 truncate">
                <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                  <Wrench size={13} />
                </div>
                <div className="truncate">
                  <span className="font-bold text-[11px] block truncate">{pit.driver} • {pit.team}</span>
                  <span className="text-[9px] block opacity-70">Official DHL Pit Record</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-sm font-extrabold font-mono text-amber-500 block leading-tight">{pit.duration}</span>
                <span className="text-[8px] font-mono opacity-70">Lap {pit.lap} • {pit.raceName}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-[9px] font-mono text-center">
              <div className={`p-1 rounded-lg border ${getInnerClass()}`}>
                <span className="text-[7px] uppercase block opacity-60">Stationary Stop</span>
                <span className="font-bold text-amber-400">~{stationaryEst}s</span>
              </div>
              <div className={`p-1 rounded-lg border ${getInnerClass()}`}>
                <span className="text-[7px] uppercase block opacity-60">Pit Lane Delta</span>
                <span className="font-bold text-slate-300">~{laneEst}s</span>
              </div>
              <div className={`p-1 rounded-lg border ${getInnerClass()}`}>
                <span className="text-[7px] uppercase block opacity-60">Award Rank</span>
                <span className="font-bold text-yellow-400">DHL Season Best</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 6. UPCOMING RACES WIDGET
  const renderUpcomingRacesWidget = (size: F1WidgetSize) => {
    const races = f1.upcomingRaces;
    if (!races || races.length === 0) return null;
    const isCompact = size === 'compact';
    const displayRaces = isCompact ? races.slice(0, 1) : races.slice(0, 4);

    if (uiStyle === 'tui') {
      return (
        <TuiBox
          key="upcomingRaces"
          title={isCompact ? 'NEXT_GP' : 'SEASON_CALENDAR_UPCOMING'}
          badge="CALENDAR"
          badgeColor="text-cyan-400"
          className="h-full flex flex-col justify-between"
        >
          <div className="space-y-1 text-xs py-0.5 flex flex-col justify-between h-full font-mono">
            {displayRaces.map((r) => (
              <div key={r.round} className="space-y-0.5">
                <div className="truncate font-bold">R{r.round}: {r.raceName.toUpperCase()}</div>
                <div className="text-cyan-400 text-[10px] truncate">{r.countdown} [{r.istDate.split('•')[0]}]</div>
              </div>
            ))}
          </div>
        </TuiBox>
      );
    }

    return (
      <div key="upcomingRaces" className={`border ${getCardClass(size, 'upcomingRaces')}`}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] uppercase font-bold tracking-wider flex items-center space-x-1.5 opacity-80 truncate">
            <Flag size={12} className="text-cyan-400 shrink-0" />
            <span className="truncate">{isCompact ? 'Next GP' : 'UPCOMING GRAND PRIX'}</span>
          </span>
          <div className="flex items-center space-x-1 shrink-0">
            {renderSizeToggle('upcomingRaces')}
            {!isCompact && <span className="text-[9px] font-mono font-bold opacity-75">2026 CALENDAR</span>}
          </div>
        </div>

        {isCompact ? (
          <div className="py-1 flex-1 flex flex-col justify-between space-y-1">
            <div className="font-bold text-xs truncate">R{displayRaces[0].round} • {displayRaces[0].raceName}</div>
            <div className="text-[9px] opacity-75 font-mono truncate">{displayRaces[0].istDate}</div>
            <div className="mt-0.5">
              <span className="text-[9px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20 inline-block">
                in {displayRaces[0].countdown}
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-1.5 text-xs overflow-y-auto pr-0.5 flex-1">
            {displayRaces.map((r) => (
              <div key={r.round} className={`p-1.5 rounded-xl border flex items-center justify-between ${getInnerClass()}`}>
                <div className="truncate mr-1">
                  <span className="font-bold text-[11px] block truncate">R{r.round} • {r.raceName}</span>
                  <p className="text-[9px] opacity-75 truncate">{r.istDate}</p>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20 shrink-0">
                  in {r.countdown}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // 7. CIRCUIT TECHNICAL TELEMETRY WIDGET
  const renderCircuitTelemetryWidget = (size: F1WidgetSize) => {
    const tel = f1.circuitTelemetry;
    if (!tel) return null;
    const isCompact = size === 'compact';

    if (uiStyle === 'tui') {
      return (
        <TuiBox
          key="circuitTelemetry"
          title={isCompact ? 'CIRCUIT_TECH' : 'CIRCUIT_TECH_TELEMETRY'}
          badge="SPECS"
          badgeColor="text-cyan-400"
          className={isCompact ? 'h-full flex flex-col justify-between' : ''}
        >
          <div className={`grid ${isCompact ? 'grid-cols-2 gap-1 text-[9px]' : 'grid-cols-4 gap-1 text-[10px]'} font-mono text-center`}>
            <div className="p-1 border border-gray-800">
              <div className="text-[7px] text-gray-500">THROTTLE</div>
              <div className="font-bold text-cyan-400">{tel.fullThrottlePercent}%</div>
            </div>
            <div className="p-1 border border-gray-800">
              <div className="text-[7px] text-gray-500">SPEED</div>
              <div className="font-bold text-red-400">{tel.topSpeedKmh}k</div>
            </div>
            <div className="p-1 border border-gray-800">
              <div className="text-[7px] text-gray-500">SHIFTS</div>
              <div className="font-bold">{tel.gearShiftsPerLap}</div>
            </div>
            <div className="p-1 border border-gray-800">
              <div className="text-[7px] text-gray-500">PIT LOSS</div>
              <div className="font-bold text-amber-400">{tel.pitLaneLossSec}s</div>
            </div>
          </div>
        </TuiBox>
      );
    }

    return (
      <div key="circuitTelemetry" className={`border ${getCardClass(size, 'circuitTelemetry')}`}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] uppercase font-bold tracking-wider flex items-center space-x-1.5 opacity-80 truncate">
            <Gauge size={12} className="text-cyan-400 shrink-0" />
            <span className="truncate">{isCompact ? 'Circuit Tech' : 'CIRCUIT TECHNICAL SPECS'}</span>
          </span>
          <div className="flex items-center space-x-1 shrink-0">
            {renderSizeToggle('circuitTelemetry')}
            {!isCompact && <span className="text-[9px] font-mono opacity-70">{tel.tyreAllocation}</span>}
          </div>
        </div>

        {isCompact ? (
          <div className="grid grid-cols-2 gap-1 text-center font-mono py-1 flex-1 items-center">
            <div className={`p-1 rounded-lg border ${getInnerClass()}`}>
              <span className="text-[7px] uppercase block opacity-70">Throttle</span>
              <span className="font-bold text-xs text-cyan-400">{tel.fullThrottlePercent}%</span>
            </div>
            <div className={`p-1 rounded-lg border ${getInnerClass()}`}>
              <span className="text-[7px] uppercase block opacity-70">Speed</span>
              <span className="font-bold text-xs text-red-400">{tel.topSpeedKmh}k</span>
            </div>
            <div className={`p-1 rounded-lg border ${getInnerClass()}`}>
              <span className="text-[7px] uppercase block opacity-70">Shifts</span>
              <span className="font-bold text-xs">{tel.gearShiftsPerLap}</span>
            </div>
            <div className={`p-1 rounded-lg border ${getInnerClass()}`}>
              <span className="text-[7px] uppercase block opacity-70">Pit Loss</span>
              <span className="font-bold text-xs text-amber-400">{tel.pitLaneLossSec}s</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-1.5 text-xs text-center font-mono">
            <div className={`p-1 rounded-xl border ${getInnerClass()}`}>
              <span className="text-[7px] uppercase block opacity-70">Throttle</span>
              <span className="font-bold text-cyan-400">{tel.fullThrottlePercent}%</span>
            </div>
            <div className={`p-1 rounded-xl border ${getInnerClass()}`}>
              <span className="text-[7px] uppercase block opacity-70">Shifts</span>
              <span className="font-bold">{tel.gearShiftsPerLap}</span>
            </div>
            <div className={`p-1 rounded-xl border ${getInnerClass()}`}>
              <span className="text-[7px] uppercase block opacity-70">Max Speed</span>
              <span className="font-bold text-red-400">{tel.topSpeedKmh} km/h</span>
            </div>
            <div className={`p-1 rounded-xl border ${getInnerClass()}`}>
              <span className="text-[7px] uppercase block opacity-70">Pit Delta</span>
              <span className="font-bold text-amber-400">{tel.pitLaneLossSec}s</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 8. F1 NEWS & PADDOCK WIRE WIDGET
  const renderNewsWidget = (size: F1WidgetSize) => {
    const news = f1.news || [];
    if (news.length === 0) return null;
    const isCompact = size === 'compact';
    const isLarge = size === 'large';
    const displayNews = isCompact ? news.slice(0, 2) : isLarge ? news.slice(0, 8) : news.slice(0, 4);
    const leadStory = news[0];
    const wireStories = news.slice(1, 8);

    if (uiStyle === 'tui') {
      return (
        <TuiBox
          key="news"
          title={isCompact ? 'F1_WIRE' : isLarge ? 'F1_BREAKING_NEWS_&_WIRE' : 'F1_PADDOCK_WIRE'}
          badge="LIVE"
          badgeColor="text-amber-400"
          className="h-full flex flex-col justify-between"
        >
          {isLarge ? (
            <div className="space-y-2 text-xs py-0.5 font-mono flex-1 flex flex-col justify-between">
              {leadStory && (
                <a
                  href={leadStory.link}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 border border-amber-500/30 bg-amber-950/20 hover:border-amber-400 flex flex-col justify-between block group"
                >
                  <div>
                    <div className="flex items-center justify-between text-[9px] opacity-75 mb-1">
                      <span className="text-amber-400 font-bold">[{leadStory.source.toUpperCase()}]</span>
                      <span>{leadStory.timeAgo}</span>
                    </div>
                    <div className="font-bold text-xs leading-snug group-hover:text-amber-300">
                      {leadStory.title}
                    </div>
                    {leadStory.snippet && (
                      <p className="text-[10px] opacity-75 mt-1 line-clamp-2 leading-normal">
                        {leadStory.snippet}
                      </p>
                    )}
                  </div>
                  <div className="text-[9px] text-amber-400 font-bold mt-1.5 pt-1 border-t border-amber-500/20">
                    &gt;&gt; READ_FULL_DISPATCH
                  </div>
                </a>
              )}
              <div className="space-y-1.5 overflow-y-auto flex-1 pr-0.5">
                <div className="text-[8px] font-bold text-gray-400 uppercase pb-0.5 border-b border-amber-500/20">
                  Latest Paddock Dispatches ({wireStories.length})
                </div>
                {wireStories.map((item: any, idx: number) => (
                  <a
                    key={item.id || idx}
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 border border-amber-500/20 block hover:border-amber-400 transition-colors"
                  >
                    <div className="flex items-center space-x-1.5 text-[9px] opacity-75">
                      <span className="text-amber-400 font-bold">[{item.source.toUpperCase()}]</span>
                      <span>{item.timeAgo}</span>
                    </div>
                    <div className="line-clamp-2 font-bold leading-tight mt-0.5">
                      {item.title}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-1.5 text-xs py-0.5 flex flex-col justify-between h-full font-mono">
              {displayNews.map((item: any, idx: number) => (
                <a
                  key={item.id || idx}
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="group block space-y-0.5 hover:text-amber-300 transition-colors"
                >
                  <div className="flex items-center space-x-1.5 text-[9px] opacity-75">
                    <span className="text-amber-400 font-bold">[{item.source.toUpperCase()}]</span>
                    <span>{item.timeAgo}</span>
                  </div>
                  <div className="line-clamp-2 font-bold group-hover:underline leading-tight">
                    {item.title}
                  </div>
                </a>
              ))}
            </div>
          )}
        </TuiBox>
      );
    }

    if (uiStyle === 'brutalist') {
      return (
        <BrutalistBox
          key="news"
          title={isCompact ? 'F1 WIRE' : isLarge ? 'F1 BREAKING NEWS & PADDOCK WIRE' : 'F1 PADDOCK NEWS'}
          badge={isCompact ? 'WIRE' : 'BREAKING'}
          badgeColor="bg-red-600 text-white"
          className="h-full flex flex-col justify-between"
        >
          {isLarge ? (
            <div className="space-y-2 py-0.5 flex-1 flex flex-col justify-between">
              {leadStory && (
                <a
                  href={leadStory.link}
                  target="_blank"
                  rel="noreferrer"
                  className={`p-2.5 border-2 border-black flex flex-col justify-between ${
                    isLight ? 'bg-amber-100 shadow-[2px_2px_0px_#000]' : 'bg-neutral-900 text-white shadow-[2px_2px_0px_#fff]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-wider mb-1">
                      <span className="text-red-600 font-black">★ LEAD • {leadStory.source}</span>
                      <span className="font-mono">{leadStory.timeAgo}</span>
                    </div>
                    <div className="text-xs font-black leading-snug hover:underline">
                      {leadStory.title}
                    </div>
                    {leadStory.snippet && (
                      <p className="text-[10px] font-medium opacity-80 mt-1 line-clamp-2">{leadStory.snippet}</p>
                    )}
                  </div>
                  <div className="text-[9px] font-black uppercase tracking-wider text-red-600 mt-1.5 pt-1 border-t-2 border-black">
                    FULL ARTICLE &gt;&gt;
                  </div>
                </a>
              )}
              <div className="space-y-1.5 overflow-y-auto flex-1 pr-0.5">
                <div className="text-[9px] font-black uppercase tracking-wider opacity-75 pb-0.5 border-b-2 border-black">
                  Paddock Wire ({wireStories.length})
                </div>
                {wireStories.map((item: any, idx: number) => (
                  <a
                    key={item.id || idx}
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className={`block p-1.5 border-2 border-black ${
                      isLight ? 'bg-neutral-100 shadow-[1px_1px_0px_#000]' : 'bg-neutral-900 text-white shadow-[1px_1px_0px_#fff]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-wider mb-0.5 opacity-80">
                      <span className="text-red-500 font-black">{item.source}</span>
                      <span className="font-mono">{item.timeAgo}</span>
                    </div>
                    <div className="text-[11px] font-black leading-snug line-clamp-2 hover:underline">
                      {item.title}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-2 py-0.5 flex flex-col justify-between h-full">
              {displayNews.map((item: any, idx: number) => (
                <a
                  key={item.id || idx}
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className={`block p-1.5 border-2 border-black transition-transform hover:-translate-y-0.5 ${
                    isLight ? 'bg-neutral-100 shadow-[1px_1px_0px_#000]' : 'bg-neutral-900 shadow-[1px_1px_0px_#fff]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-wider mb-0.5 opacity-80">
                    <span className="text-red-500 font-black">{item.source}</span>
                    <span className="font-mono">{item.timeAgo}</span>
                  </div>
                  <div className="text-[11px] font-black leading-snug line-clamp-2 hover:underline">
                    {item.title}
                  </div>
                  {!isCompact && item.snippet && (
                    <p className="text-[9px] opacity-75 line-clamp-1 mt-0.5">{item.snippet}</p>
                  )}
                </a>
              ))}
            </div>
          )}
        </BrutalistBox>
      );
    }

    if (uiStyle === 'hud') {
      return (
        <HudBox
          key="news"
          title={isCompact ? 'PADDOCK_FEED' : isLarge ? 'F1_PADDOCK_FEED_&_HEADLINES' : 'F1_PADDOCK_NEWS_FEED'}
          code="LIVE_WIRE"
          glowColor="cyan"
          className="h-full flex flex-col justify-between"
        >
          {isLarge ? (
            <div className="space-y-2 py-0.5 font-mono flex-1 flex flex-col justify-between">
              {leadStory && (
                <a
                  href={leadStory.link}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded border border-cyan-500/30 bg-cyan-950/20 hover:border-cyan-400/60 transition-colors flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between text-[8px] text-cyan-400 mb-0.5">
                      <span className="font-bold">★ LEAD_WIRE • {leadStory.source}</span>
                      <span className="opacity-75">{leadStory.timeAgo}</span>
                    </div>
                    <div className="text-xs font-bold text-white group-hover:text-cyan-200 line-clamp-2 leading-snug">
                      {leadStory.title}
                    </div>
                    {leadStory.snippet && (
                      <p className="text-[9px] text-slate-300 mt-1 line-clamp-2 leading-normal">
                        {leadStory.snippet}
                      </p>
                    )}
                  </div>
                  <div className="text-[8px] text-cyan-400 font-bold mt-1 pt-0.5 border-t border-cyan-500/20">
                    &gt;&gt; OPEN_DISPATCH
                  </div>
                </a>
              )}
              <div className="space-y-1 overflow-y-auto flex-1 pr-0.5">
                <div className="text-[8px] font-bold text-cyan-400 uppercase pb-0.5 border-b border-cyan-500/20">
                  // PADDOCK_DISPATCHES ({wireStories.length})
                </div>
                {wireStories.map((item: any, idx: number) => (
                  <a
                    key={item.id || idx}
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="group block p-1.5 rounded border border-cyan-500/20 bg-cyan-950/20 hover:border-cyan-400/50 transition-colors"
                  >
                    <div className="flex items-center justify-between text-[8px] text-cyan-400 mb-0.5">
                      <span className="font-bold">[{item.source}]</span>
                      <span className="opacity-75">{item.timeAgo}</span>
                    </div>
                    <div className="text-[10px] text-slate-200 group-hover:text-cyan-200 line-clamp-2 font-bold leading-tight">
                      {item.title}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-1.5 py-0.5 flex flex-col justify-between h-full font-mono">
              {displayNews.map((item: any, idx: number) => (
                <a
                  key={item.id || idx}
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="group block p-1.5 rounded border border-cyan-500/20 bg-cyan-950/20 hover:border-cyan-400/50 transition-colors"
                >
                  <div className="flex items-center justify-between text-[8px] text-cyan-400 mb-0.5">
                    <span className="font-bold">[{item.source}]</span>
                    <span className="opacity-75">{item.timeAgo}</span>
                  </div>
                  <div className="text-[10px] text-slate-200 group-hover:text-cyan-200 line-clamp-2 font-bold leading-tight">
                    {item.title}
                  </div>
                </a>
              ))}
            </div>
          )}
        </HudBox>
      );
    }

    // Modern Glass / Default Theme (supports Minimal, Retrowave, Neumorphic, Obsidian, Civic)
    return (
      <div key="news" className={`border ${getCardClass(size, 'news')}`}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] uppercase font-bold tracking-wider flex items-center space-x-1.5 opacity-80 truncate">
            <Newspaper size={12} className="text-red-500 shrink-0" />
            <span className="truncate">{isCompact ? 'Paddock Wire' : isLarge ? 'F1 PADDOCK NEWS & WIRE (DEEP FEED)' : 'F1 PADDOCK NEWS & WIRE'}</span>
          </span>
          <div className="flex items-center space-x-1 shrink-0">
            {renderSizeToggle('news')}
            {!isCompact && (
              <span className="text-[9px] font-mono font-bold text-red-500 bg-red-500/10 px-1.5 py-0.2 rounded border border-red-500/20">
                LIVE
              </span>
            )}
          </div>
        </div>

        {isCompact ? (
          <div className="py-1 flex-1 flex flex-col justify-between space-y-1.5">
            {displayNews.map((item: any, idx: number) => (
              <a
                key={item.id || idx}
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className={`p-1.5 rounded-lg border block hover:opacity-100 transition-opacity ${getInnerClass()}`}
              >
                <div className="flex items-center justify-between text-[8px] opacity-75 mb-0.5">
                  <span className="font-bold text-red-500 truncate mr-1">{item.source}</span>
                  <span className="font-mono shrink-0">{item.timeAgo}</span>
                </div>
                <div className="text-[10px] font-bold leading-tight line-clamp-2 hover:underline">
                  {item.title}
                </div>
              </a>
            ))}
          </div>
        ) : isLarge ? (
          <div className="space-y-2 py-0.5 flex-1 flex flex-col justify-between">
            {/* Top: Featured Lead Story Card */}
            {leadStory && (
              <a
                href={leadStory.link}
                target="_blank"
                rel="noreferrer"
                className={`p-2.5 rounded-xl border flex flex-col justify-between group hover:opacity-100 transition-all ${getInnerClass()}`}
              >
                <div>
                  <div className="flex items-center justify-between text-[9px] mb-1">
                    <span className="font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded text-[8px] uppercase tracking-wider">
                      ★ LEAD STORY • {leadStory.source}
                    </span>
                    <span className="opacity-60 font-mono text-[9px]">{leadStory.timeAgo}</span>
                  </div>
                  <h4 className="font-extrabold text-xs leading-snug group-hover:text-blue-500 transition-colors line-clamp-2">
                    {leadStory.title}
                  </h4>
                  {leadStory.snippet && (
                    <p className="text-[10px] opacity-75 line-clamp-2 mt-1 leading-relaxed">
                      {leadStory.snippet}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-1 text-[9px] text-blue-500 font-bold mt-1.5 pt-1 border-t border-black/10 dark:border-white/10">
                  <span>Read Full Coverage</span>
                  <ExternalLink size={10} />
                </div>
              </a>
            )}

            {/* Bottom: Vertical Paddock Wire Feed */}
            <div className="space-y-1.5 overflow-y-auto flex-1 pr-0.5">
              <div className="text-[9px] font-bold uppercase tracking-wider text-gray-400 pb-0.5 border-b border-black/10 dark:border-white/10">
                Paddock Wire Feed ({wireStories.length} Stories)
              </div>
              {wireStories.map((item: any, idx: number) => (
                <a
                  key={item.id || idx}
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className={`p-2 rounded-xl border flex flex-col justify-between group hover:opacity-100 transition-all ${getInnerClass()}`}
                >
                  <div className="flex items-center justify-between text-[9px] mb-1">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-red-500 bg-red-500/10 px-1.5 py-0.2 rounded text-[8px] uppercase tracking-wider">
                        {item.source}
                      </span>
                      <span className="opacity-60 font-mono text-[9px]">{item.timeAgo}</span>
                    </div>
                    <ExternalLink size={10} className="opacity-40 group-hover:opacity-100 transition-opacity text-current shrink-0" />
                  </div>
                  <div className="font-bold text-[11px] leading-snug group-hover:text-blue-500 transition-colors line-clamp-2">
                    {item.title}
                  </div>
                </a>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-1.5 text-xs overflow-y-auto pr-0.5 flex-1">
            {displayNews.map((item: any, idx: number) => (
              <a
                key={item.id || idx}
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className={`p-2 rounded-xl border flex flex-col justify-between group hover:opacity-100 transition-all ${getInnerClass()}`}
              >
                <div className="flex items-center justify-between text-[9px] mb-1">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-red-500 bg-red-500/10 px-1.5 py-0.2 rounded text-[8px] uppercase tracking-wider">
                      {item.source}
                    </span>
                    <span className="opacity-60 font-mono text-[9px]">{item.timeAgo}</span>
                  </div>
                  <ExternalLink size={10} className="opacity-40 group-hover:opacity-100 transition-opacity text-current shrink-0" />
                </div>
                <div className="font-bold text-[11px] leading-snug group-hover:text-blue-500 transition-colors line-clamp-2">
                  {item.title}
                </div>
                {item.snippet && (
                  <p className="text-[9px] opacity-70 line-clamp-1 mt-1 leading-normal">
                    {item.snippet}
                  </p>
                )}
              </a>
            ))}
          </div>
        )}
      </div>
    );
  };

  // 9. WEEKEND SCHEDULE WIDGET
  const renderScheduleWidget = (size: F1WidgetSize) => {
    const isCompact = size === 'compact';
    const isLarge = size === 'large';
    const sList = [
      { key: 'fp1', label: 'Practice 1', data: f1.sessions?.fp1 },
      { key: 'fp2', label: 'Practice 2', data: f1.sessions?.fp2 },
      { key: 'fp3', label: 'Practice 3', data: f1.sessions?.fp3 },
      { key: 'sprintQualifying', label: 'Sprint Shootout', data: f1.sessions?.sprintQualifying },
      { key: 'sprint', label: 'Sprint Race', data: f1.sessions?.sprint },
      { key: 'qualifying', label: 'Qualifying', data: f1.sessions?.qualifying },
      { key: 'race', label: 'Grand Prix', data: f1.sessions?.race },
    ].filter(s => Boolean(s.data));

    const displaySessions = isCompact ? sList.slice(0, 3) : sList;

    if (uiStyle === 'tui') {
      return (
        <TuiBox
          key="schedule"
          title={isCompact ? 'SCHEDULE' : isLarge ? 'WEEKEND_TIMETABLE_DEEP' : 'WEEKEND_SCHEDULE_IST'}
          badge="IST SYNC"
          badgeColor="text-red-400"
          className="h-full flex flex-col justify-between"
        >
          {isLarge ? (
            <div className="space-y-2 text-xs py-0.5 font-mono flex-1 flex flex-col justify-between">
              <div className="p-2 border border-red-500/30 bg-red-950/20 space-y-1.5">
                <div className="flex items-center justify-between text-[9px] text-red-400 font-bold">
                  <span>&gt;&gt; NEXT SESSION</span>
                  <span className="animate-pulse">LIVE SYNC</span>
                </div>
                <div className="text-sm font-black text-white truncate">{f1.nextSession?.name?.toUpperCase()}</div>
                <div className="text-[10px] text-gray-300 font-mono">{f1.nextSession?.istTimeFormatted}</div>
                <div className="p-1.5 border border-red-500/50 bg-black/60 text-center my-1">
                  <span className="text-[8px] text-red-400 block">T-MINUS COUNTDOWN</span>
                  <span className="text-base font-black text-red-500 font-mono tracking-widest animate-pulse">
                    T-{f1.nextSession?.countdownFormatted}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[9px] pt-1 border-t border-red-500/20 text-gray-300">
                  <span>RECORD: <b className="text-amber-400">{f1.circuitLapRecord?.lapTime || '1:35.490'}</b></span>
                  <span>{f1.circuitLapRecord?.driver} ({f1.circuitLapRecord?.year})</span>
                </div>
              </div>

              <div className="space-y-1 overflow-y-auto flex-1 pr-0.5">
                <div className="text-[9px] font-bold text-gray-400 pb-0.5 border-b border-red-500/20 uppercase">
                  Complete Session Timetable ({sList.length})
                </div>
                {sList.map((s) => (
                  <div key={s.key} className="p-1.5 border border-red-500/20 flex items-center justify-between text-[11px]">
                    <span className="truncate">{s.label}</span>
                    <span className="text-red-400 font-bold ml-1 font-mono shrink-0">{s.data?.istTime.split('•')[1] || s.data?.istTime}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-1 text-xs py-0.5 flex flex-col justify-between h-full font-mono">
              {displaySessions.map((s) => (
                <div key={s.key} className="flex items-center justify-between">
                  <span className="truncate">{s.label}</span>
                  <span className="text-red-400 font-bold ml-1 shrink-0">{s.data?.istTime.split('•')[1] || s.data?.istTime}</span>
                </div>
              ))}
            </div>
          )}
        </TuiBox>
      );
    }

    if (uiStyle === 'brutalist') {
      return (
        <BrutalistBox
          key="schedule"
          title={isCompact ? 'SCHEDULE' : isLarge ? 'WEEKEND TIMETABLE & TELEMETRY' : 'WEEKEND SCHEDULE (IST)'}
          badge={isCompact ? 'IST' : 'OFFICIAL TIMETABLE'}
          badgeColor="bg-red-600 text-white"
          className="h-full flex flex-col justify-between"
        >
          {isLarge ? (
            <div className="space-y-2 py-0.5 flex-1 flex flex-col justify-between">
              <div className={`p-2.5 border-2 border-black space-y-1.5 ${isLight ? 'bg-amber-100' : 'bg-neutral-900'}`}>
                <div className="text-[9px] font-black uppercase tracking-wider opacity-75">NEXT ON TRACK</div>
                <div className="text-sm font-black uppercase truncate">{f1.nextSession?.name}</div>
                <div className="text-[10px] font-mono font-bold text-red-600">{f1.nextSession?.istTimeFormatted}</div>
                <div className="p-1.5 border-2 border-black bg-amber-400 text-black text-center shadow-[2px_2px_0px_#000]">
                  <div className="text-[8px] font-black uppercase tracking-widest">T-MINUS COUNTDOWN</div>
                  <div className="text-base font-black font-mono tracking-wider">T-{f1.nextSession?.countdownFormatted}</div>
                </div>
                <div className="flex items-center justify-between text-[9px] font-black pt-1 border-t-2 border-black">
                  <span>RECORD: {f1.circuitLapRecord?.lapTime || '1:35.490'}</span>
                  <span>{f1.circuitLapRecord?.driver} ({f1.circuitLapRecord?.year})</span>
                </div>
              </div>

              <div className="space-y-1.5 overflow-y-auto flex-1 pr-0.5">
                <div className="text-[9px] font-black uppercase tracking-wider opacity-75 pb-0.5 border-b-2 border-black">
                  All Weekend Sessions ({sList.length})
                </div>
                {sList.map((s) => (
                  <div
                    key={s.key}
                    className={`p-1.5 border-2 border-black flex items-center justify-between text-[11px] font-black ${
                      isLight ? 'bg-neutral-100' : 'bg-neutral-900 text-white'
                    }`}
                  >
                    <span className="truncate">{s.label}</span>
                    <span className="font-mono text-red-500 ml-1 shrink-0">{s.data?.istTime.split('•')[1] || s.data?.istTime}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-1.5 py-0.5 flex flex-col justify-between h-full">
              {displaySessions.map((s) => (
                <div
                  key={s.key}
                  className={`p-1.5 border-2 border-black flex items-center justify-between text-[11px] font-bold ${
                    isLight ? 'bg-neutral-100' : 'bg-neutral-900 text-white'
                  }`}
                >
                  <span className="truncate">{s.label}</span>
                  <span className="font-mono text-red-500 ml-1 shrink-0">{s.data?.istTime.split('•')[1] || s.data?.istTime}</span>
                </div>
              ))}
            </div>
          )}
        </BrutalistBox>
      );
    }

    if (uiStyle === 'hud') {
      return (
        <HudBox
          key="schedule"
          title={isCompact ? 'SCHEDULE' : isLarge ? 'FULL_SESSION_TIMETABLE' : 'SESSION_TIMETABLE_IST'}
          code="IST_SYNC"
          glowColor="cyan"
          className="h-full flex flex-col justify-between"
        >
          {isLarge ? (
            <div className="space-y-2 py-0.5 font-mono text-[10px] flex-1 flex flex-col justify-between">
              <div className="p-2 rounded border border-cyan-500/30 bg-cyan-950/20 space-y-1.5">
                <div className="text-[8px] text-cyan-400 uppercase font-bold">&gt;&gt; TARGET SESSION</div>
                <div className="text-xs font-bold text-white truncate">{f1.nextSession?.name}</div>
                <div className="text-[9px] text-slate-300">{f1.nextSession?.istTimeFormatted}</div>
                <div className="p-1.5 rounded border border-cyan-500/50 bg-black/60 text-center">
                  <div className="text-[8px] uppercase tracking-wider text-cyan-400">T-MINUS COUNTDOWN</div>
                  <div className="text-sm font-bold text-cyan-300 font-mono tracking-wider animate-pulse">
                    T-{f1.nextSession?.countdownFormatted}
                  </div>
                </div>
                <div className="flex items-center justify-between text-[8px] pt-1 border-t border-cyan-500/20 text-slate-300">
                  <span>RECORD: {f1.circuitLapRecord?.lapTime || '1:35.490'}</span>
                  <span>{f1.circuitLapRecord?.driver}</span>
                </div>
              </div>

              <div className="space-y-1 overflow-y-auto flex-1 pr-0.5">
                <div className="text-[8px] font-bold text-cyan-400 pb-0.5 border-b border-cyan-500/20 uppercase">
                  // FULL_SESSION_TIMETABLE ({sList.length})
                </div>
                {sList.map((s) => (
                  <div key={s.key} className="p-1.5 rounded border border-cyan-500/20 flex items-center justify-between">
                    <span className="text-slate-200 truncate">{s.label}</span>
                    <span className="text-cyan-400 font-bold ml-1 shrink-0">{s.data?.istTime.split('•')[1] || s.data?.istTime}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-1 py-0.5 flex flex-col justify-between h-full font-mono text-[10px]">
              {displaySessions.map((s) => (
                <div key={s.key} className="p-1 rounded border border-cyan-500/20 flex items-center justify-between">
                  <span className="text-slate-200 truncate">{s.label}</span>
                  <span className="text-cyan-400 font-bold ml-1 shrink-0">{s.data?.istTime.split('•')[1] || s.data?.istTime}</span>
                </div>
              ))}
            </div>
          )}
        </HudBox>
      );
    }

    return (
      <div key="schedule" className={`border ${getCardClass(size, 'schedule')}`}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] uppercase font-bold tracking-wider flex items-center space-x-1.5 opacity-80 truncate">
            <Calendar size={12} className="text-red-500 shrink-0" />
            <span className="truncate">{isCompact ? 'Schedule' : isLarge ? 'WEEKEND TIMETABLE & TELEMETRY' : 'WEEKEND SCHEDULE (IST)'}</span>
          </span>
          <div className="flex items-center space-x-1 shrink-0">
            {renderSizeToggle('schedule')}
            {!isCompact && <span className="text-[9px] font-mono opacity-70">UTC+5:30</span>}
          </div>
        </div>

        {isCompact ? (
          <div className="space-y-1 py-1 flex-1 flex flex-col justify-between">
            {displaySessions.map((s) => (
              <div key={s.key} className={`p-1 rounded-lg border flex items-center justify-between text-[10px] ${getInnerClass()}`}>
                <span className="font-bold truncate mr-1">{s.label}</span>
                <span className="font-mono font-bold text-red-500 shrink-0">{s.data?.istTime.split('•')[1] || s.data?.istTime}</span>
              </div>
            ))}
          </div>
        ) : isLarge ? (
          <div className="space-y-2 py-0.5 flex-1 flex flex-col justify-between">
            {/* Top: Next Session Spotlight Card */}
            <div className={`p-2.5 rounded-xl border flex flex-col justify-between space-y-1.5 ${getInnerClass()}`}>
              <div>
                <div className="flex items-center justify-between text-[9px] uppercase font-bold text-red-500 mb-0.5">
                  <span>Next On Track</span>
                  <span className="flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span>LIVE SYNC</span>
                  </span>
                </div>
                <h4 className="text-xs font-bold truncate leading-tight">{f1.nextSession?.name}</h4>
                <p className="text-[10px] opacity-70 font-mono mt-0.5">{f1.nextSession?.istTimeFormatted}</p>
              </div>

              <div className="p-2 rounded-xl border border-red-500/30 bg-red-500/10 text-center">
                <div className="text-[8px] uppercase font-mono font-bold tracking-wider opacity-75">T-Minus Countdown</div>
                <div className="text-base font-black font-mono text-red-500 tracking-wider mt-0.5 animate-pulse tabular-nums">
                  T-{f1.nextSession?.countdownFormatted}
                </div>
              </div>

              <div className="flex items-center justify-between text-[9px] pt-1 border-t border-black/10 dark:border-white/10">
                <span className="font-bold text-amber-500">Record: {f1.circuitLapRecord?.lapTime || '1:35.490'}</span>
                <span className="opacity-70 truncate ml-1">{f1.circuitLapRecord?.driver} ({f1.circuitLapRecord?.year})</span>
              </div>
            </div>

            {/* Bottom: Complete Timetable List */}
            <div className="space-y-1.5 overflow-y-auto flex-1 pr-0.5">
              <div className="text-[9px] font-bold uppercase tracking-wider opacity-70 pb-0.5 border-b border-black/10 dark:border-white/10">
                Weekend Sessions (IST)
              </div>
              {sList.map((s) => {
                const isNext = f1.nextSession?.name === s.data?.name;
                return (
                  <div
                    key={s.key}
                    className={`p-2 rounded-xl border flex items-center justify-between transition-all ${
                      isNext ? 'border-red-500 ring-1 ring-red-500/40 bg-red-500/10' : getInnerClass()
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <div
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          s.data?.status === 'live'
                            ? 'bg-red-500 animate-ping'
                            : s.data?.status === 'completed'
                            ? 'bg-gray-400'
                            : 'bg-emerald-500'
                        }`}
                      />
                      <div className="truncate">
                        <span className="font-bold text-[11px] block truncate">{s.label}</span>
                        <span className="text-[9px] opacity-70 font-mono truncate">{s.data?.istTime}</span>
                      </div>
                    </div>
                    <span className="text-[8px] uppercase font-bold font-mono px-1.5 py-0.5 rounded bg-black/20 text-current shrink-0">
                      {s.data?.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-1.5 text-xs overflow-y-auto pr-0.5 flex-1">
            {displaySessions.map((s) => {
              const isNext = f1.nextSession?.name === s.data?.name;
              return (
                <div
                  key={s.key}
                  className={`p-2 rounded-xl border flex items-center justify-between ${
                    isNext ? 'border-red-500 ring-1 ring-red-500/40 bg-red-500/10' : getInnerClass()
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        s.data?.status === 'live'
                          ? 'bg-red-500 animate-ping'
                          : s.data?.status === 'completed'
                          ? 'bg-gray-400'
                          : 'bg-emerald-500'
                      }`}
                    />
                    <div className="truncate">
                      <span className="font-bold text-[11px] block truncate">{s.label}</span>
                      <span className="text-[9px] opacity-70 font-mono truncate">{s.data?.istTime}</span>
                    </div>
                  </div>
                  <span className="text-[9px] uppercase font-bold font-mono px-1.5 py-0.5 rounded bg-black/20 text-current shrink-0">
                    {s.data?.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // 10. STANDINGS WIDGET
  const renderStandingsWidget = (size: F1WidgetSize) => {
    const isCompact = size === 'compact';
    const isLarge = size === 'large';
    const drivers = (f1.standings || []).slice(0, isCompact ? 4 : isLarge ? 20 : 10);
    const constructors = (f1.constructorStandings || []).slice(0, isCompact ? 4 : 10);

    if (uiStyle === 'tui') {
      return (
        <TuiBox
          key="standings"
          title={isCompact ? 'STANDINGS' : isLarge ? 'FULL_CHAMPIONSHIP_STANDINGS' : standingsTab === 'drivers' ? 'WDC_STANDINGS' : 'WCC_STANDINGS'}
          badge={standingsTab === 'drivers' ? 'WDC' : 'WCC'}
          badgeColor="text-amber-400"
          className="h-full flex flex-col justify-between"
        >
          <div className="space-y-1 text-xs py-0.5 flex flex-col justify-between h-full font-mono flex-1">
            <div className="flex items-center justify-between pb-1 border-b border-amber-400/20 text-[10px]">
              <div className="flex space-x-2">
                <button
                  onClick={() => setStandingsTab('drivers')}
                  className={`hover:underline cursor-pointer ${standingsTab === 'drivers' ? 'text-amber-400 font-bold' : 'text-gray-500'}`}
                >
                  [DRIVERS {isLarge ? '(ALL)' : ''}]
                </button>
                <button
                  onClick={() => setStandingsTab('constructors')}
                  className={`hover:underline cursor-pointer ${standingsTab === 'constructors' ? 'text-amber-400 font-bold' : 'text-gray-500'}`}
                >
                  [TEAMS]
                </button>
              </div>
              <span className="text-gray-400">PTS</span>
            </div>
            <div className="space-y-1 overflow-y-auto flex-1 pr-0.5">
              {standingsTab === 'drivers' ? (
                drivers.map((d: any) => (
                  <div key={d.driverCode} className="flex items-center justify-between text-[11px]">
                    <span className="truncate">P{d.position} {d.driver} ({d.driverCode})</span>
                    <span className="text-amber-400 font-bold ml-1">{d.points}P</span>
                  </div>
                ))
              ) : (
                constructors.map((c: any) => (
                  <div key={c.team} className="flex items-center justify-between text-[11px]">
                    <span className="truncate">P{c.position} {c.team}</span>
                    <span className="text-amber-400 font-bold ml-1">{c.points}P</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </TuiBox>
      );
    }

    if (uiStyle === 'brutalist') {
      return (
        <BrutalistBox
          key="standings"
          title={isCompact ? 'STANDINGS' : isLarge ? 'CHAMPIONSHIP STANDINGS (DEEP)' : standingsTab === 'drivers' ? 'DRIVER STANDINGS' : 'TEAM STANDINGS'}
          badge={standingsTab === 'drivers' ? 'WDC' : 'WCC'}
          badgeColor="bg-amber-400 text-black"
          className="h-full flex flex-col justify-between"
        >
          <div className="space-y-1.5 py-0.5 flex flex-col justify-between h-full flex-1">
            <div className="flex items-center justify-between pb-1 border-b-2 border-black text-[10px]">
              <div className="flex space-x-1">
                <button
                  onClick={() => setStandingsTab('drivers')}
                  className={`px-1.5 py-0.5 border border-black font-bold uppercase cursor-pointer ${
                    standingsTab === 'drivers' ? 'bg-amber-400 text-black' : 'bg-transparent text-gray-600'
                  }`}
                >
                  Drivers {isLarge ? '(Top 20)' : ''}
                </button>
                <button
                  onClick={() => setStandingsTab('constructors')}
                  className={`px-1.5 py-0.5 border border-black font-bold uppercase cursor-pointer ${
                    standingsTab === 'constructors' ? 'bg-amber-400 text-black' : 'bg-transparent text-gray-600'
                  }`}
                >
                  Teams
                </button>
              </div>
              <span className="font-mono font-bold">PTS</span>
            </div>
            <div className="space-y-1 overflow-y-auto flex-1 pr-0.5">
              {standingsTab === 'drivers' ? (
                drivers.map((d: any) => (
                  <div
                    key={d.driverCode}
                    className={`p-1.5 border-2 border-black flex items-center justify-between text-[11px] font-black ${
                      isLight ? 'bg-neutral-100' : 'bg-neutral-900 text-white'
                    }`}
                  >
                    <span className="truncate">P{d.position} • {d.driver}</span>
                    <span className="font-mono text-amber-500 shrink-0 ml-1">{d.points} PTS</span>
                  </div>
                ))
              ) : (
                constructors.map((c: any) => (
                  <div
                    key={c.team}
                    className={`p-1.5 border-2 border-black flex items-center justify-between text-[11px] font-black ${
                      isLight ? 'bg-neutral-100' : 'bg-neutral-900 text-white'
                    }`}
                  >
                    <span className="truncate">P{c.position} • {c.team}</span>
                    <span className="font-mono text-amber-500 shrink-0 ml-1">{c.points} PTS</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </BrutalistBox>
      );
    }

    if (uiStyle === 'hud') {
      return (
        <HudBox
          key="standings"
          title={isCompact ? 'STANDINGS' : isLarge ? 'FULL_CHAMPIONSHIP_STANDINGS' : standingsTab === 'drivers' ? 'PILOT_RANKS' : 'CONSTRUCTOR_RANKS'}
          code={standingsTab === 'drivers' ? 'WDC' : 'WCC'}
          glowColor="amber"
          className="h-full flex flex-col justify-between"
        >
          <div className="space-y-1 py-0.5 flex flex-col justify-between h-full font-mono text-[10px] flex-1">
            <div className="flex items-center justify-between pb-1 border-b border-amber-500/20">
              <div className="flex space-x-1">
                <button
                  onClick={() => setStandingsTab('drivers')}
                  className={`px-1 py-0.2 rounded border cursor-pointer ${
                    standingsTab === 'drivers' ? 'border-amber-400 text-amber-400 bg-amber-500/20' : 'border-transparent text-gray-500'
                  }`}
                >
                  DRV {isLarge ? '(ALL)' : ''}
                </button>
                <button
                  onClick={() => setStandingsTab('constructors')}
                  className={`px-1 py-0.2 rounded border cursor-pointer ${
                    standingsTab === 'constructors' ? 'border-amber-400 text-amber-400 bg-amber-500/20' : 'border-transparent text-gray-500'
                  }`}
                >
                  CON
                </button>
              </div>
              <span className="text-amber-400">PTS</span>
            </div>
            <div className="space-y-1 overflow-y-auto flex-1 pr-0.5">
              {standingsTab === 'drivers' ? (
                drivers.map((d: any) => (
                  <div key={d.driverCode} className="p-1 rounded border border-amber-500/20 flex items-center justify-between">
                    <span className="text-slate-200 truncate">P{d.position} {d.driverCode} • {d.driver}</span>
                    <span className="text-amber-400 font-bold shrink-0 ml-1">{d.points}P</span>
                  </div>
                ))
              ) : (
                constructors.map((c: any) => (
                  <div key={c.team} className="p-1 rounded border border-amber-500/20 flex items-center justify-between">
                    <span className="text-slate-200 truncate">P{c.position} {c.team}</span>
                    <span className="text-amber-400 font-bold shrink-0 ml-1">{c.points}P</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </HudBox>
      );
    }

    return (
      <div key="standings" className={`border ${getCardClass(size, 'standings')}`}>
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center space-x-2 truncate">
            <span className="text-[10px] uppercase font-bold tracking-wider flex items-center space-x-1.5 opacity-80 truncate">
              <Trophy size={12} className="text-amber-500 shrink-0" />
              <span className="truncate">
                {isCompact
                  ? 'Standings'
                  : isLarge
                  ? 'CHAMPIONSHIP STANDINGS (DEEP)'
                  : standingsTab === 'drivers'
                  ? 'DRIVER STANDINGS'
                  : 'CONSTRUCTOR STANDINGS'}
              </span>
            </span>

            {/* Drivers / Teams Tab Switcher */}
            <div className="flex items-center space-x-0.5 p-0.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-[9px]">
              <button
                type="button"
                onClick={() => setStandingsTab('drivers')}
                className={`px-1.5 py-0.2 rounded font-bold transition-all cursor-pointer ${
                  standingsTab === 'drivers'
                    ? 'bg-amber-500 text-black shadow-xs font-extrabold'
                    : 'text-gray-400 hover:text-current'
                }`}
              >
                Drivers {isLarge ? '(Top 20)' : ''}
              </button>
              <button
                type="button"
                onClick={() => setStandingsTab('constructors')}
                className={`px-1.5 py-0.2 rounded font-bold transition-all cursor-pointer ${
                  standingsTab === 'constructors'
                    ? 'bg-amber-500 text-black shadow-xs font-extrabold'
                    : 'text-gray-400 hover:text-current'
                }`}
              >
                Teams
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-1 shrink-0">
            {renderSizeToggle('standings')}
            {!isCompact && <span className="text-[9px] font-mono opacity-70">PTS</span>}
          </div>
        </div>

        {isCompact ? (
          <div className="space-y-1 py-1 flex-1 flex flex-col justify-between">
            {standingsTab === 'drivers' ? (
              drivers.map((d: any) => (
                <div key={d.driverCode} className={`p-1 rounded-lg border flex items-center justify-between text-[10px] ${getInnerClass()}`}>
                  <div className="flex items-center space-x-1.5 truncate">
                    <span className="font-mono font-bold opacity-60 w-3 text-center">{d.position}</span>
                    <div className="w-1.5 h-3 rounded-full shrink-0" style={{ backgroundColor: d.teamColor }} />
                    <span className="font-bold truncate">{d.driverCode}</span>
                  </div>
                  <span className="font-mono font-extrabold text-amber-500 shrink-0 ml-1">{d.points}</span>
                </div>
              ))
            ) : (
              constructors.map((c: any) => (
                <div key={c.team} className={`p-1 rounded-lg border flex items-center justify-between text-[10px] ${getInnerClass()}`}>
                  <div className="flex items-center space-x-1.5 truncate">
                    <span className="font-mono font-bold opacity-60 w-3 text-center">{c.position}</span>
                    <div className="w-1.5 h-3 rounded-full shrink-0" style={{ backgroundColor: c.teamColor }} />
                    <span className="font-bold truncate">{c.team}</span>
                  </div>
                  <span className="font-mono font-extrabold text-amber-500 shrink-0 ml-1">{c.points}</span>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-1 text-xs overflow-y-auto pr-0.5 flex-1">
            {standingsTab === 'drivers' ? (
              drivers.map((d: any) => (
                <div key={d.driverCode} className={`p-1.5 rounded-xl border flex items-center justify-between ${getInnerClass()}`}>
                  <div className="flex items-center space-x-2 truncate">
                    <span className="font-mono font-bold opacity-60 w-3 text-center text-xs">{d.position}</span>
                    <div className="w-1.5 h-4 rounded-full shrink-0" style={{ backgroundColor: d.teamColor }} />
                    <div className="truncate">
                      <span className="font-bold text-[11px] block truncate">{d.driver}</span>
                      <span className="text-[9px] opacity-70 truncate block">{d.team}</span>
                    </div>
                  </div>
                  <span className="font-mono font-extrabold text-xs text-amber-500 shrink-0">{d.points} PTS</span>
                </div>
              ))
            ) : (
              constructors.map((c: any) => (
                <div key={c.team} className={`p-1.5 rounded-xl border flex items-center justify-between ${getInnerClass()}`}>
                  <div className="flex items-center space-x-2.5 truncate">
                    <span className="font-mono font-bold opacity-60 w-3 text-center text-xs">{c.position}</span>
                    <div className="w-1.5 h-4 rounded-full shrink-0" style={{ backgroundColor: c.teamColor }} />
                    <div className="truncate">
                      <span className="font-bold text-[11px] block truncate">{c.team}</span>
                      <span className="text-[9px] opacity-70 truncate block">
                        {c.wins > 0 ? `${c.wins} Win${c.wins > 1 ? 's' : ''}` : '0 Wins'}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono font-extrabold text-xs text-amber-500 shrink-0">{c.points} PTS</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  };

  const renderWidgetInTheme = (id: F1WidgetId) => {
    const layout = slotLayout[id] || DEFAULT_F1_SLOT_LAYOUT[id];
    const isLarge = (layout.colSpan >= 5 && layout.rowSpan >= 2) || layout.rowSpan >= 3;
    const isCompact = layout.colSpan <= 3 && layout.rowSpan === 1;
    const size: F1WidgetSize = isLarge ? 'large' : isCompact ? 'compact' : 'normal';
    switch (id) {
      case 'countdown':
        return renderCountdownWidget(size);
      case 'podium':
        return renderPodiumWidget(size);
      case 'titleBattle':
        return renderTitleBattleWidget(size);
      case 'qualifying':
        return renderQualifyingWidget(size);
      case 'pitstop':
        return renderPitStopWidget(size);
      case 'upcomingRaces':
        return renderUpcomingRacesWidget(size);
      case 'circuitTelemetry':
        return renderCircuitTelemetryWidget(size);
      case 'news':
        return renderNewsWidget(size);
      case 'schedule':
        return renderScheduleWidget(size);
      case 'standings':
        return renderStandingsWidget(size);
      default:
        return null;
    }
  };

  return (
    <div className={`h-full flex flex-col space-y-2.5 relative min-h-0 ${fontClass} ${className}`}>
      {/* Top Bar with Widget Management & Slot Grid Controls */}
      <div className="flex items-center justify-between px-1 shrink-0">
        <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-wider opacity-75">
          <span>Active ({visibleWidgets.length})</span>
          <span className="opacity-40">|</span>
          <span className="opacity-80">Slot-Based Grid</span>
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
            title="Reset all widgets to default slot coordinates"
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
            title="Configure F1 Widgets"
          >
            <Sliders size={12} />
            <span>F1 Widgets</span>
          </button>
        </div>
      </div>

      {/* Slot-Based 12-Column Grid with 8-Direction Mouse-Drag Resizing & Positioning */}
      <div
        ref={gridRef}
        className="grid grid-cols-12 gap-3 overflow-y-auto pr-1 flex-1 min-h-0 relative select-none"
        style={{ gridAutoRows: '140px' }}
      >
        {/* Visual Blueprint Grid Matrix during Move or Resize */}
        {(movingState || resizingState) && (
          <div
            className="absolute inset-0 pointer-events-none grid grid-cols-12 gap-3 z-0"
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
          const layout = slotLayout[w.id] || DEFAULT_F1_SLOT_LAYOUT[w.id];
          const isActivelyMoved = movingState?.widgetId === w.id;
          const isActivelyResized = resizingState?.widgetId === w.id;

          return (
            <div
              key={w.id}
              style={{
                gridColumn: `${layout.col} / span ${layout.colSpan}`,
                gridRow: `${layout.row} / span ${layout.rowSpan}`,
              }}
              className={`relative group transition-shadow ${
                isActivelyMoved
                  ? 'opacity-85 shadow-2xl z-30 ring-2 ring-blue-500 rounded-2xl'
                  : isActivelyResized
                  ? 'shadow-2xl z-30 ring-2 ring-amber-400 rounded-2xl'
                  : 'z-10'
              }`}
            >
              {/* Widget Content Card */}
              {renderWidgetInTheme(w.id)}

              {/* 8-Direction Interactive Resize Handles */}
              {/* North */}
              <div
                onMouseDown={(e) => handleResizeStart(e, w.id, 'n')}
                className="absolute -top-1 left-2 right-2 h-2.5 cursor-ns-resize z-20 group-hover:bg-amber-400/20 hover:!bg-amber-400/60 rounded-full transition-colors"
                title="Drag to resize height (North)"
              />
              {/* South */}
              <div
                onMouseDown={(e) => handleResizeStart(e, w.id, 's')}
                className="absolute -bottom-1 left-2 right-2 h-2.5 cursor-ns-resize z-20 group-hover:bg-amber-400/20 hover:!bg-amber-400/60 rounded-full transition-colors"
                title="Drag to resize height (South)"
              />
              {/* West */}
              <div
                onMouseDown={(e) => handleResizeStart(e, w.id, 'w')}
                className="absolute -left-1 top-2 bottom-2 w-2.5 cursor-ew-resize z-20 group-hover:bg-amber-400/20 hover:!bg-amber-400/60 rounded-full transition-colors"
                title="Drag to resize width (West)"
              />
              {/* East */}
              <div
                onMouseDown={(e) => handleResizeStart(e, w.id, 'e')}
                className="absolute -right-1 top-2 bottom-2 w-2.5 cursor-ew-resize z-20 group-hover:bg-amber-400/20 hover:!bg-amber-400/60 rounded-full transition-colors"
                title="Drag to resize width (East)"
              />
              {/* North-West */}
              <div
                onMouseDown={(e) => handleResizeStart(e, w.id, 'nw')}
                className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 cursor-nwse-resize z-30 flex items-center justify-center group-hover:opacity-100 opacity-0 transition-opacity"
                title="Drag to resize corner (North-West)"
              >
                <div className="w-2 h-2 rounded-full bg-amber-400 border border-black/40 shadow-xs" />
              </div>
              {/* North-East */}
              <div
                onMouseDown={(e) => handleResizeStart(e, w.id, 'ne')}
                className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 cursor-nesw-resize z-30 flex items-center justify-center group-hover:opacity-100 opacity-0 transition-opacity"
                title="Drag to resize corner (North-East)"
              >
                <div className="w-2 h-2 rounded-full bg-amber-400 border border-black/40 shadow-xs" />
              </div>
              {/* South-West */}
              <div
                onMouseDown={(e) => handleResizeStart(e, w.id, 'sw')}
                className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 cursor-nesw-resize z-30 flex items-center justify-center group-hover:opacity-100 opacity-0 transition-opacity"
                title="Drag to resize corner (South-West)"
              >
                <div className="w-2 h-2 rounded-full bg-amber-400 border border-black/40 shadow-xs" />
              </div>
              {/* South-East (Primary Corner Indicator) */}
              <div
                onMouseDown={(e) => handleResizeStart(e, w.id, 'se')}
                className="absolute -bottom-1.5 -right-1.5 w-4 h-4 cursor-nwse-resize z-30 flex items-center justify-center"
                title="Drag to resize width and height (South-East)"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400/70 hover:bg-amber-400 border border-black/30 shadow-xs transition-colors" />
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
                <h3 className="text-sm font-bold tracking-tight">F1 Widgets &amp; Slot Grid</h3>
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
                const layout = slotLayout[widget.id] || DEFAULT_F1_SLOT_LAYOUT[widget.id];
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
                        reorderF1Widgets(draggedIdx, idx);
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
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-gray-300">
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
                          onClick={() => moveF1Widget(widget.id, 'up')}
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
                          onClick={() => moveF1Widget(widget.id, 'down')}
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
                        onClick={() => toggleF1Widget(widget.id)}
                        className="w-5 h-5 rounded-md border flex items-center justify-center bg-emerald-600 border-emerald-500 text-white hover:bg-red-600 hover:border-red-500 transition-colors cursor-pointer"
                      >
                        <Check size={12} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Inactive Widgets available to add */}
              {F1_AVAILABLE_WIDGETS.filter((w) => !f1ActiveWidgets.includes(w.id)).length > 0 && (
                <div className="pt-2 mt-2 border-t border-white/10">
                  <div className="text-[10px] uppercase font-mono text-gray-400 mb-1">
                    Available to Add ({F1_AVAILABLE_WIDGETS.filter((w) => !f1ActiveWidgets.includes(w.id)).length})
                  </div>
                  <div className="space-y-1">
                    {F1_AVAILABLE_WIDGETS.filter((w) => !f1ActiveWidgets.includes(w.id)).map((widget) => {
                      const Icon = widget.icon;
                      return (
                        <div
                          key={widget.id}
                          onClick={() => toggleF1Widget(widget.id)}
                          className="w-full p-2 rounded-xl border text-left transition-all flex items-center justify-between bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white cursor-pointer"
                        >
                          <div className="flex items-center space-x-2.5">
                            <div className="p-1.5 rounded-lg border bg-white/5 border-white/10 text-gray-400">
                              <Icon size={14} />
                            </div>
                            <div>
                              <div className="text-xs font-bold flex items-center space-x-2">
                                <span>{widget.name}</span>
                                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-gray-400">
                                  {widget.badge}
                                </span>
                              </div>
                              <p className="text-[10px] text-gray-400">{widget.description}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="px-2 py-1 text-[10px] font-bold rounded-lg border border-white/20 bg-white/10 hover:bg-blue-600 hover:border-blue-500 text-white transition-all cursor-pointer"
                          >
                            + Add
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2.5 border-t border-white/15 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setF1ActiveWidgets(['countdown', 'schedule', 'standings'])}
                className="px-2 py-1 rounded-lg text-[10px] border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 cursor-pointer"
              >
                Classic (3)
              </button>
              <button
                onClick={() => setF1ActiveWidgets(['countdown', 'schedule', 'standings', 'news', 'podium', 'titleBattle'])}
                className="px-2 py-1 rounded-lg text-[10px] border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 cursor-pointer"
              >
                Paddock (6)
              </button>
              <button
                onClick={() => setF1ActiveWidgets(F1_AVAILABLE_WIDGETS.map((w) => w.id))}
                className="px-2 py-1 rounded-lg text-[10px] border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 cursor-pointer"
              >
                All ({F1_AVAILABLE_WIDGETS.length})
              </button>
            </div>
            <button
              onClick={() => setIsPickerOpen(false)}
              className="px-4 py-1 rounded-xl bg-red-600 hover:bg-red-500 font-bold text-xs text-white shadow-lg cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
