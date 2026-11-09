import React, { useState } from 'react';
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
];

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
    f1WidgetSizes,
    setF1WidgetSize,
    setAllF1WidgetSizes,
  } = useDashboard();

  const uiStyle = propUiStyle || contextUiStyle;
  const isLight = propIsLight !== undefined ? propIsLight : colorMode === 'light';

  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // Filter to currently selected active widgets
  const visibleWidgets = React.useMemo(() => {
    return F1_AVAILABLE_WIDGETS.filter((w) => f1ActiveWidgets.includes(w.id));
  }, [f1ActiveWidgets]);

  // Style Tokens per visual theme
  const getCardClass = (size: F1WidgetSize = 'normal') => {
    const pad = size === 'compact' ? 'p-2.5' : 'p-3.5';

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

  // Helper size controls inside each widget card header
  const renderSizeToggle = (widgetId: F1WidgetId) => {
    const currentSize = f1WidgetSizes[widgetId] || 'normal';
    return (
      <div className="flex items-center space-x-1 opacity-60 hover:opacity-100 transition-opacity">
        {(['compact', 'normal'] as F1WidgetSize[]).map((sz) => (
          <button
            key={sz}
            type="button"
            title={`Set widget size: ${sz}`}
            onClick={(e) => {
              e.stopPropagation();
              setF1WidgetSize(widgetId, sz);
            }}
            className={`px-1.5 py-0.2 text-[9px] font-mono uppercase font-bold rounded transition-colors ${
              currentSize === sz
                ? 'bg-blue-600 text-white font-extrabold shadow-xs'
                : 'bg-black/10 hover:bg-black/20 text-current'
            }`}
          >
            {sz === 'compact' ? 'S' : 'M'}
          </button>
        ))}
      </div>
    );
  };

  // 1. COUNTDOWN WIDGET
  const renderCountdownWidget = (size: F1WidgetSize) => {
    const isCompact = size === 'compact';

    if (uiStyle === 'tui') {
      return (
        <TuiBox
          key="countdown"
          title="NEXT_SESSION_COUNTDOWN"
          badge={isCompact ? f1.nextSession.countdownFormatted : 'LIVE IN IST'}
          badgeColor="text-red-500"
          className="border-red-500/50"
        >
          <div className="py-0.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-red-500/30">
              <div>
                <div className={`text-[9px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>TARGET:</div>
                <div className={`${isCompact ? 'text-sm font-bold' : 'text-base font-black'} mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {f1.nextSession.name.toUpperCase()}
                </div>
                <div className="text-[11px] text-red-500 mt-0.5 font-bold">&gt;&gt; {f1.nextSession.istTimeFormatted}</div>
              </div>
              <div className={`px-2.5 py-1 border border-red-500/60 text-center ${isLight ? 'bg-red-50' : 'bg-red-950/20'}`}>
                <div className="text-[8px] uppercase tracking-wider font-bold opacity-75">T-MINUS</div>
                <div className={`${isCompact ? 'text-sm' : 'text-base'} font-black text-red-500 tracking-wider animate-pulse`}>
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
          title="NEXT SESSION COUNTDOWN"
          badge={isCompact ? f1.nextSession.countdownFormatted : 'LIVE IN IST'}
          badgeColor="bg-red-600 text-white"
        >
          <div className="py-0.5">
            <div className="flex items-center justify-between pb-1.5 border-b-2 border-black">
              <div>
                <div className="text-[9px] font-black uppercase tracking-wider opacity-75">TARGET SESSION</div>
                <div className={`${isCompact ? 'text-sm' : 'text-base'} font-black uppercase tracking-tight`}>
                  {f1.nextSession.name}
                </div>
                <div className="text-xs font-mono font-bold mt-0.5 flex items-center text-red-500">
                  <Calendar size={11} className="mr-1" />
                  {f1.nextSession.istTimeFormatted}
                </div>
              </div>
              <div
                className="px-2.5 py-1 border-2 border-black text-center shadow-[2px_2px_0px_#000]"
                style={{ backgroundColor: 'var(--color-accent, #facc15)' }}
              >
                <div className="text-[8px] font-black uppercase tracking-widest text-black">T-MINUS</div>
                <div className="text-sm font-black font-mono text-black tracking-wider">
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
        <HudBox key="countdown" title="NEXT_SESSION_COUNTDOWN" code={isCompact ? f1.nextSession.countdownFormatted : 'LIVE_IST'} glowColor="cyan">
          <div className="py-0.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-cyan-500/20">
              <div>
                <span className="text-[9px] block opacity-75">TARGET_EVENT</span>
                <span className={`${isCompact ? 'text-sm font-bold' : 'text-base font-black'} tracking-wide`}>{f1.nextSession.name}</span>
                <span className="text-xs font-mono block mt-0.5 flex items-center" style={{ color: 'var(--color-accent)' }}>
                  <Calendar size={11} className="mr-1" />
                  {f1.nextSession.istTimeFormatted}
                </span>
              </div>
              <div className={`px-2.5 py-1 border text-center ${isLight ? 'bg-cyan-100/60 border-cyan-400' : 'bg-black/60 border-cyan-500/50'}`}>
                <div className="text-[8px] uppercase tracking-widest opacity-80">T-MINUS</div>
                <div className="text-sm font-black font-mono tracking-wider text-rose-500 animate-pulse">
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
      <div key="countdown" className={`border shadow-md relative overflow-hidden ${getCardClass(size)}`}>
        <div className="flex items-center justify-between pb-1.5 border-b border-red-500/10">
          <div className={`flex items-center space-x-1.5 text-[11px] uppercase font-extrabold tracking-widest ${
            isLight ? 'text-red-600' : 'text-red-400'
          }`}>
            <Timer size={13} />
            <span>Next Session Countdown</span>
          </div>
          <div className="flex items-center space-x-2">
            {renderSizeToggle('countdown')}
            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-red-600 text-white shadow-sm">
              LIVE IST
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between py-2">
          <div>
            <h2 className={`${isCompact ? 'text-base font-bold' : 'text-lg font-bold'}`}>
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
                  <span className={`${isCompact ? 'text-xs' : 'text-sm'} font-extrabold block leading-tight tabular-nums`}>
                    {String(f1.nextSession.days).padStart(2, '0')}
                  </span>
                  <span className="text-[7px] uppercase tracking-wider block opacity-70">Days</span>
                </div>
                <span className="text-xs text-red-500 font-bold">:</span>
              </>
            )}
            <div className="text-center min-w-[24px]">
              <span className={`${isCompact ? 'text-xs' : 'text-sm'} font-extrabold block leading-tight tabular-nums`}>
                {String(f1.nextSession.hours ?? 0).padStart(2, '0')}
              </span>
              <span className="text-[7px] uppercase tracking-wider block opacity-70">Hrs</span>
            </div>
            <span className="text-xs text-red-500 font-bold">:</span>
            <div className="text-center min-w-[24px]">
              <span className={`${isCompact ? 'text-xs' : 'text-sm'} font-extrabold block leading-tight tabular-nums`}>
                {String(f1.nextSession.mins ?? 0).padStart(2, '0')}
              </span>
              <span className="text-[7px] uppercase tracking-wider block opacity-70">Min</span>
            </div>
            <span className="text-xs text-red-500 font-bold">:</span>
            <div className="text-center min-w-[24px]">
              <span className={`${isCompact ? 'text-xs' : 'text-sm'} font-extrabold text-red-500 block leading-tight tabular-nums animate-pulse`}>
                {String(f1.nextSession.secs ?? 0).padStart(2, '0')}
              </span>
              <span className="text-[7px] uppercase tracking-wider block opacity-70">Sec</span>
            </div>
          </div>
        </div>

        {!isCompact && (
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
        <TuiBox key="podium" title="PREV_GP_PODIUM" badge={f1.lastRace.raceName.toUpperCase()} badgeColor="text-amber-400">
          <div className="text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-amber-400 font-bold">P1: {f1.lastRace.winner.toUpperCase()} ({f1.lastRace.winnerTeam})</span>
              <span className="text-[10px] text-purple-400 font-mono">FL: {f1.lastRace.fastestLapDriver} [{f1.lastRace.fastestLapTime}]</span>
            </div>
            {!isCompact && (
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-gray-800">
                <span className={isLight ? 'text-slate-600' : 'text-gray-400'}>P2: {f1.lastRace.p2}</span>
                <span className={isLight ? 'text-slate-600' : 'text-gray-400'}>P3: {f1.lastRace.p3}</span>
              </div>
            )}
          </div>
        </TuiBox>
      );
    }

    if (uiStyle === 'brutalist') {
      return (
        <BrutalistBox
          key="podium"
          title={`PREV GP: ${f1.lastRace.raceName.toUpperCase()}`}
          badge={`FL: ${f1.lastRace.fastestLapDriver} (${f1.lastRace.fastestLapTime})`}
          badgeColor="bg-purple-600 text-white"
        >
          {isCompact ? (
            <div className="py-0.5 text-xs font-black flex items-center justify-between">
              <span className="text-amber-500">🥇 P1: {f1.lastRace.winner}</span>
              <span>🥈 P2: {f1.lastRace.p2.split(' ')[0]}</span>
              <span>🥉 P3: {f1.lastRace.p3.split(' ')[0]}</span>
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
        <HudBox key="podium" title="LAST_GP_PODIUM" code={f1.lastRace.raceName.toUpperCase()} glowColor="amber">
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between text-amber-400 font-bold">
              <span>P1: {f1.lastRace.winner} ({f1.lastRace.winnerTeam})</span>
              <span className="text-[10px] text-purple-400 font-mono">FL: {f1.lastRace.fastestLapDriver} [{f1.lastRace.fastestLapTime}]</span>
            </div>
            {!isCompact && (
              <div className="grid grid-cols-2 gap-2 text-[10px] pt-1 border-t border-cyan-500/20">
                <span className={isLight ? 'text-slate-600' : 'text-gray-400'}>P2: {f1.lastRace.p2}</span>
                <span className={isLight ? 'text-slate-600' : 'text-gray-400'}>P3: {f1.lastRace.p3}</span>
              </div>
            )}
          </div>
        </HudBox>
      );
    }

    return (
      <div key="podium" className={`border ${getCardClass(size)}`}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] uppercase font-bold tracking-wider flex items-center space-x-1.5 opacity-80">
            <Award size={12} className="text-amber-500" />
            <span>PREV GP: {f1.lastRace.raceName}</span>
          </span>
          <div className="flex items-center space-x-2">
            {renderSizeToggle('podium')}
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center space-x-1">
              <Zap size={9} />
              <span>FL: {f1.lastRace.fastestLapDriver} ({f1.lastRace.fastestLapTime})</span>
            </span>
          </div>
        </div>

        {isCompact ? (
          <div className="flex items-center justify-between text-xs py-0.5">
            <span className="font-bold text-amber-500 truncate">🥇 {f1.lastRace.winner}</span>
            <span className="truncate opacity-80">🥈 {f1.lastRace.p2.split(' ')[0]}</span>
            <span className="truncate opacity-80">🥉 {f1.lastRace.p3.split(' ')[0]}</span>
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
        <TuiBox key="titleBattle" title="TITLE_FIGHT_TELEMETRY" badge={`GAP +${battle.pointsGap} PTS`} badgeColor="text-emerald-400">
          <div className="text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 font-bold">P1: {battle.leader} ({battle.leaderPoints} pts)</span>
              <span className="text-red-400 font-bold">P2: {battle.contender} ({battle.contenderPoints} pts)</span>
            </div>
            <div className="w-full bg-gray-900 border border-gray-700 h-2 flex">
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
          title="CHAMPIONSHIP TITLE FIGHT"
          badge={`+${battle.pointsGap} PTS GAP`}
          badgeColor="bg-black text-yellow-300"
        >
          <div className="py-0.5 text-xs space-y-1">
            <div className="flex items-center justify-between font-black">
              <span style={{ color: battle.leaderColor }}>P1 {battle.leader} ({battle.leaderPoints})</span>
              <span style={{ color: battle.contenderColor }}>P2 {battle.contender} ({battle.contenderPoints})</span>
            </div>
            <div className="w-full border-2 border-black h-2.5 bg-neutral-200 overflow-hidden flex">
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
        <HudBox key="titleBattle" title="WDC_TITLE_BATTLE_INDEX" code={`GAP_${battle.pointsGap}PTS`} glowColor="cyan">
          <div className="text-xs space-y-1 py-0.5">
            <div className="flex items-center justify-between font-mono">
              <span className="font-bold text-cyan-300">P1 {battle.leader}: {battle.leaderPoints} PTS</span>
              <span className="font-bold text-rose-400">P2 {battle.contender}: {battle.contenderPoints} PTS</span>
            </div>
            <div className="w-full bg-black/60 border border-cyan-500/40 h-2 flex">
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
      <div key="titleBattle" className={`border ${getCardClass(size)}`}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] uppercase font-bold tracking-wider flex items-center space-x-1.5 opacity-80">
            <Trophy size={12} className="text-emerald-500" />
            <span>TITLE BATTLE (P1 VS P2)</span>
          </span>
          <div className="flex items-center space-x-2">
            {renderSizeToggle('titleBattle')}
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              +{battle.pointsGap} PTS GAP
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs font-bold mb-1">
          <span className="truncate" style={{ color: battle.leaderColor }}>{battle.leader} ({battle.leaderPoints} pts)</span>
          <span className="truncate text-right" style={{ color: battle.contenderColor }}>{battle.contender} ({battle.contenderPoints} pts)</span>
        </div>
        <div className={`w-full h-2 rounded-full overflow-hidden flex border ${isLight ? 'border-slate-300 bg-slate-200' : 'border-white/10 bg-black/40'}`}>
          <div className="bg-emerald-500 h-full" style={{ width: `${Math.min(95, Math.max(5, (battle.leaderPoints / (battle.leaderPoints + battle.contenderPoints)) * 100))}%` }} />
          <div className="bg-rose-500 h-full flex-1" />
        </div>
        {!isCompact && (
          <div className="flex items-center justify-between text-[10px] font-mono mt-1 opacity-75">
            <span>WCC: {battle.teamLeader} +{battle.teamPointsGap} over {battle.teamContender}</span>
            <span>{battle.roundsRemaining} rounds left</span>
          </div>
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
        <TuiBox key="qualifying" title="PREV_QUALIFYING_GRID" badge="POLE POSITION" badgeColor="text-yellow-400">
          <div className="text-xs space-y-1">
            <div className="flex items-center justify-between text-yellow-400 font-bold">
              <span>POLE: {quali.poleDriver.toUpperCase()} ({quali.poleTeam})</span>
              <span className="font-mono">{quali.poleTime}</span>
            </div>
            {!isCompact && (
              <div className="grid grid-cols-2 gap-2 text-[10px] pt-1 border-t border-gray-800 text-gray-400">
                <span>P2: {quali.p2Driver} [{quali.p2Time}]</span>
                <span>P3: {quali.p3Driver} [{quali.p3Time}]</span>
              </div>
            )}
          </div>
        </TuiBox>
      );
    }

    if (uiStyle === 'brutalist') {
      return (
        <BrutalistBox key="qualifying" title="QUALIFYING SHOOTOUT" badge="FRONT ROW" badgeColor="bg-yellow-400 text-black">
          <div className="py-0.5 text-xs space-y-1">
            <div className="flex items-center justify-between font-black">
              <span className="text-amber-500">POLE: {quali.poleDriver} ({quali.poleTeam})</span>
              <span className="font-mono bg-black text-yellow-300 px-1">{quali.poleTime}</span>
            </div>
            {!isCompact && (
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1 border-t-2 border-black">
                <span>P2: {quali.p2Driver} ({quali.p2Time})</span>
                <span>P3: {quali.p3Driver} ({quali.p3Time})</span>
              </div>
            )}
          </div>
        </BrutalistBox>
      );
    }

    return (
      <div key="qualifying" className={`border ${getCardClass(size)}`}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] uppercase font-bold tracking-wider flex items-center space-x-1.5 opacity-80">
            <Zap size={12} className="text-amber-500" />
            <span>QUALIFYING: {quali.raceName}</span>
          </span>
          <div className="flex items-center space-x-2">
            {renderSizeToggle('qualifying')}
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              POLE: {quali.poleTime}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs font-bold mb-1">
          <span className="text-amber-500">🏆 1st: {quali.poleDriver} ({quali.poleTeam})</span>
          <span className="font-mono text-[11px] text-amber-400">{quali.poleTime}</span>
        </div>
        {!isCompact && (
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono opacity-80 pt-1 border-t border-current/10">
            <span>2nd: {quali.p2Driver} ({quali.p2Time})</span>
            <span>3rd: {quali.p3Driver} ({quali.p3Time})</span>
          </div>
        )}
      </div>
    );
  };

  // 5. PIT STOP WIDGET
  const renderPitStopWidget = (size: F1WidgetSize) => {
    const pit = f1.pitStopRecord;
    if (!pit) return null;
    const isCompact = size === 'compact';

    if (uiStyle === 'tui') {
      return (
        <TuiBox key="pitstop" title="DHL_FASTEST_PITSTOP" badge={pit.duration} badgeColor="text-yellow-400">
          <div className="text-xs flex items-center justify-between">
            <span className="font-bold">{pit.driver} • {pit.team}</span>
            <span className="text-[10px] text-gray-400">LAP {pit.lap} • RECORD</span>
          </div>
        </TuiBox>
      );
    }

    if (uiStyle === 'brutalist') {
      return (
        <BrutalistBox key="pitstop" title="FASTEST PIT STOP AWARD" badge={pit.duration} badgeColor="bg-yellow-400 text-black">
          <div className="py-0.5 text-xs flex items-center justify-between font-black">
            <span>{pit.driver} • {pit.team}</span>
            <span className="font-mono bg-black text-white px-1.5 py-0.5">LAP {pit.lap}</span>
          </div>
        </BrutalistBox>
      );
    }

    return (
      <div key="pitstop" className={`border flex items-center justify-between text-xs ${getCardClass(size)}`}>
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Wrench size={13} />
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold block opacity-70">
              DHL FASTEST PIT STOP ({pit.raceName})
            </span>
            <span className="font-bold text-[11px]">{pit.driver} • {pit.team}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {renderSizeToggle('pitstop')}
          <div className="text-right">
            <span className="text-sm font-extrabold font-mono text-amber-500 block leading-tight">{pit.duration}</span>
            <span className="text-[8px] font-mono opacity-70">Lap {pit.lap}</span>
          </div>
        </div>
      </div>
    );
  };

  // 6. UPCOMING RACES WIDGET
  const renderUpcomingRacesWidget = (size: F1WidgetSize) => {
    const races = f1.upcomingRaces;
    if (!races || races.length === 0) return null;
    const isCompact = size === 'compact';
    const displayRaces = isCompact ? races.slice(0, 1) : races;

    if (uiStyle === 'tui') {
      return (
        <TuiBox key="upcomingRaces" title="SEASON_CALENDAR_UPCOMING" badge="NEXT ROUNDS" badgeColor="text-cyan-400">
          <div className="space-y-1 text-xs">
            {displayRaces.map((r) => (
              <div key={r.round} className="flex items-center justify-between font-mono text-[11px]">
                <span>R{r.round}: {r.raceName.toUpperCase()}</span>
                <span className="text-cyan-400 font-bold">{r.countdown} [{r.istDate.split('•')[0]}]</span>
              </div>
            ))}
          </div>
        </TuiBox>
      );
    }

    return (
      <div key="upcomingRaces" className={`border ${getCardClass(size)}`}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] uppercase font-bold tracking-wider flex items-center space-x-1.5 opacity-80">
            <Flag size={12} className="text-cyan-400" />
            <span>UPCOMING GRAND PRIX</span>
          </span>
          <div className="flex items-center space-x-2">
            {renderSizeToggle('upcomingRaces')}
            <span className="text-[9px] font-mono font-bold opacity-75">2026 CALENDAR</span>
          </div>
        </div>
        <div className="space-y-1 text-xs">
          {displayRaces.map((r) => (
            <div key={r.round} className={`p-1.5 rounded-xl border flex items-center justify-between ${getInnerClass()}`}>
              <div>
                <span className="font-bold text-[11px]">R{r.round} • {r.raceName}</span>
                <p className="text-[9px] opacity-75">{r.istDate}</p>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                in {r.countdown}
              </span>
            </div>
          ))}
        </div>
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
        <TuiBox key="circuitTelemetry" title="CIRCUIT_TECH_TELEMETRY" badge="SPEC SHEET" badgeColor="text-cyan-400">
          <div className="grid grid-cols-4 gap-1 text-[10px] font-mono text-center">
            <div className="p-1 border border-gray-800">
              <div className="text-[8px] text-gray-500">THROTTLE</div>
              <div className="font-bold text-cyan-400">{tel.fullThrottlePercent}%</div>
            </div>
            <div className="p-1 border border-gray-800">
              <div className="text-[8px] text-gray-500">SHIFTS</div>
              <div className="font-bold">{tel.gearShiftsPerLap}</div>
            </div>
            <div className="p-1 border border-gray-800">
              <div className="text-[8px] text-gray-500">SPEED</div>
              <div className="font-bold text-red-400">{tel.topSpeedKmh} KM/H</div>
            </div>
            <div className="p-1 border border-gray-800">
              <div className="text-[8px] text-gray-500">PIT LOSS</div>
              <div className="font-bold text-amber-400">{tel.pitLaneLossSec}s</div>
            </div>
          </div>
        </TuiBox>
      );
    }

    return (
      <div key="circuitTelemetry" className={`border ${getCardClass(size)}`}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] uppercase font-bold tracking-wider flex items-center space-x-1.5 opacity-80">
            <Gauge size={12} className="text-cyan-400" />
            <span>CIRCUIT TECHNICAL SPECS</span>
          </span>
          <div className="flex items-center space-x-2">
            {renderSizeToggle('circuitTelemetry')}
            <span className="text-[9px] font-mono opacity-70">{tel.tyreAllocation}</span>
          </div>
        </div>
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
      </div>
    );
  };

  const renderWidgetInTheme = (id: F1WidgetId) => {
    const size = f1WidgetSizes[id] || 'normal';
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
      default:
        return null;
    }
  };

  return (
    <div className={`h-full flex flex-col space-y-2.5 relative min-h-0 ${fontClass} ${className}`}>
      {/* Top Bar with Widget Management & Size Controls */}
      <div className="flex items-center justify-between px-1 shrink-0">
        <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-wider opacity-75">
          <span>Active ({visibleWidgets.length})</span>
          <span className="opacity-40">|</span>
          <span className="opacity-80">Manual Sizing</span>
        </div>

        <div className="flex items-center space-x-1.5">
          {/* Quick Global Size Presets */}
          <div className="flex items-center space-x-0.5 mr-1 bg-black/10 dark:bg-white/10 p-0.5 rounded-lg">
            {(['compact', 'normal'] as F1WidgetSize[]).map((sz) => (
              <button
                key={sz}
                type="button"
                title={`Resize all widgets to ${sz}`}
                onClick={() => setAllF1WidgetSizes(sz)}
                className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold hover:bg-black/15 dark:hover:bg-white/15 transition-colors cursor-pointer"
              >
                {sz === 'compact' ? 'S' : 'M'}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsPickerOpen(true)}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-xl text-[11px] font-medium border transition-all cursor-pointer ${
              isLight
                ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800 shadow-sm'
                : 'bg-white/10 hover:bg-white/15 border-white/10 text-white'
            }`}
            title="Configure F1 Widgets & Sizes"
          >
            <Sliders size={12} />
            <span>F1 Widgets</span>
          </button>
        </div>
      </div>

      {/* Render Active Widgets */}
      <div className="space-y-2.5 overflow-y-auto pr-0.5 flex-1 min-h-0">
        {visibleWidgets.map((w) => renderWidgetInTheme(w.id))}
      </div>

      {/* Interactive Widget Selector & Manual Sizing Popover / Modal */}
      {isPickerOpen && (
        <div className="absolute inset-0 z-50 p-4 rounded-3xl bg-black/92 backdrop-blur-md border border-white/20 flex flex-col justify-between text-white animate-in fade-in zoom-in-95 duration-200">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/15">
              <div className="flex items-center space-x-2">
                <Sliders size={18} className="text-amber-400" />
                <h3 className="text-sm font-bold tracking-tight">F1 Widgets &amp; Size Adjuster</h3>
              </div>
              <button
                onClick={() => setIsPickerOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Global Sizing Bar */}
            <div className="my-2.5 p-2 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold block">Global Widget Sizing</span>
                <span className="text-[10px] text-gray-400">Scale all widgets simultaneously</span>
              </div>
              <div className="flex items-center space-x-1">
                {(['compact', 'normal'] as F1WidgetSize[]).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setAllF1WidgetSizes(sz)}
                    className="px-2.5 py-1 text-[10px] font-mono font-bold rounded-lg border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
                  >
                    {sz === 'compact' ? 'S (Compact)' : 'M (Normal)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Widgets List with Individual Size Selectors */}
            <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
              {F1_AVAILABLE_WIDGETS.map((widget) => {
                const isActive = f1ActiveWidgets.includes(widget.id);
                const currentSize = f1WidgetSizes[widget.id] || 'normal';
                const Icon = widget.icon;
                return (
                  <div
                    key={widget.id}
                    onClick={() => toggleF1Widget(widget.id)}
                    className={`w-full p-2 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'bg-white/15 border-white/30 text-white'
                        : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className={`p-1.5 rounded-lg border ${isActive ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' : 'bg-white/5 border-white/10 text-gray-500'}`}>
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
                      {/* Individual Widget Size Picker */}
                      <div className="flex items-center space-x-0.5 bg-black/40 p-0.5 rounded-lg border border-white/15">
                        {(['compact', 'normal'] as F1WidgetSize[]).map((sz) => {
                          const isSzActive = currentSize === sz;
                          return (
                            <button
                              key={sz}
                              type="button"
                              title={`Set ${widget.name} to ${sz}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setF1WidgetSize(widget.id, sz);
                              }}
                              className={`px-1.5 py-0.5 text-[9px] font-mono font-bold rounded transition-colors cursor-pointer ${
                                isSzActive ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-400 hover:text-white'
                              }`}
                            >
                              {sz === 'compact' ? 'S' : 'M'}
                            </button>
                          );
                        })}
                      </div>

                      <div
                        onClick={() => toggleF1Widget(widget.id)}
                        className={`w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer ${
                          isActive ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-gray-600'
                        }`}
                      >
                        {isActive && <Check size={12} strokeWidth={3} />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2.5 border-t border-white/15 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setF1ActiveWidgets(['countdown', 'podium'])}
                className="px-2 py-1 rounded-lg text-[10px] border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 cursor-pointer"
              >
                Compact (2)
              </button>
              <button
                onClick={() => setF1ActiveWidgets(['countdown', 'podium', 'titleBattle', 'pitstop', 'qualifying'])}
                className="px-2 py-1 rounded-lg text-[10px] border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 cursor-pointer"
              >
                Default (5)
              </button>
              <button
                onClick={() => setF1ActiveWidgets(F1_AVAILABLE_WIDGETS.map((w) => w.id))}
                className="px-2 py-1 rounded-lg text-[10px] border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 cursor-pointer"
              >
                All (7)
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
