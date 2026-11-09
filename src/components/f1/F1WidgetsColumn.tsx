import React, { useState, useEffect, useRef } from 'react';
import { useDashboard } from '../../state/DashboardContext';
import type { F1WidgetId, UIStyle } from '../../types/dashboard';
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
  Sparkles,
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
  approxHeight: number;
}

export const F1_AVAILABLE_WIDGETS: F1WidgetDef[] = [
  {
    id: 'countdown',
    name: 'Target Session Countdown',
    badge: 'LIVE IST',
    description: 'Upcoming session countdown, IST date/time, and circuit telemetry specs.',
    icon: Timer,
    approxHeight: 140,
  },
  {
    id: 'podium',
    name: 'Previous GP Podium',
    badge: 'LAST RACE',
    description: 'Top 3 finishers and DHL fastest lap winner from the previous Grand Prix.',
    icon: Award,
    approxHeight: 80,
  },
  {
    id: 'titleBattle',
    name: 'Championship Title Fight',
    badge: 'WDC / WCC GAP',
    description: 'Leader vs Contender points margin, remaining rounds, and constructor lead.',
    icon: Trophy,
    approxHeight: 85,
  },
  {
    id: 'qualifying',
    name: 'Qualifying Shootout',
    badge: 'POLE POSITION',
    description: 'Pole position time and front row grid battle from the previous race.',
    icon: Zap,
    approxHeight: 80,
  },
  {
    id: 'pitstop',
    name: 'DHL Fastest Pit Stop',
    badge: 'CREW RECORD',
    description: 'Fastest pit stop duration, team, driver, and lap number.',
    icon: Wrench,
    approxHeight: 70,
  },
  {
    id: 'upcomingRaces',
    name: 'Upcoming Grand Prix Calendar',
    badge: 'CALENDAR',
    description: 'Next 2-3 races on the official FIA calendar with IST timings.',
    icon: Flag,
    approxHeight: 95,
  },
  {
    id: 'circuitTelemetry',
    name: 'Circuit Technical Telemetry',
    badge: 'TECH DATA',
    description: 'Full throttle %, gear changes per lap, speed traps, and pit delta.',
    icon: Gauge,
    approxHeight: 80,
  },
  {
    id: 'trackWeather',
    name: 'Circuit Track Conditions',
    badge: 'METEO',
    description: 'Track and air weather conditions, humidity, and wind speed.',
    icon: CloudSun,
    approxHeight: 80,
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
}) => {
  const {
    f1,
    weather,
    uiStyle: contextUiStyle,
    colorMode,
    f1ActiveWidgets,
    setF1ActiveWidgets,
    toggleF1Widget,
    f1AutoFit,
    setF1AutoFit,
  } = useDashboard();

  const uiStyle = propUiStyle || contextUiStyle;
  const isLight = propIsLight !== undefined ? propIsLight : colorMode === 'light';

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number>(720);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // Measure container height to dynamically auto-fit widgets
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.height > 50) {
          setContainerHeight(entry.contentRect.height);
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Determine which widgets to render based on user selection + height
  const visibleWidgets = React.useMemo(() => {
    const active = F1_AVAILABLE_WIDGETS.filter((w) => f1ActiveWidgets.includes(w.id));
    if (!f1AutoFit) {
      return active;
    }

    // Dynamic height calculation:
    // Available height: containerHeight minus spacing (~12px gap per widget) and control header (~32px)
    const usableHeight = containerHeight - 32;
    let accumulatedHeight = 0;
    const selected: F1WidgetDef[] = [];

    for (const widget of active) {
      if (accumulatedHeight + widget.approxHeight + 12 <= usableHeight || selected.length < 2) {
        selected.push(widget);
        accumulatedHeight += widget.approxHeight + 12;
      } else {
        break;
      }
    }

    return selected.length > 0 ? selected : active.slice(0, 2);
  }, [f1ActiveWidgets, f1AutoFit, containerHeight]);

  // Style Tokens per visual theme
  const getCardClass = () => {
    if (uiStyle === 'minimal') {
      return isLight
        ? 'bg-neutral-50/80 border border-neutral-200 rounded-xl text-neutral-900'
        : 'bg-white/[0.02] border border-white/10 rounded-xl text-neutral-100';
    }
    if (uiStyle === 'eink') {
      return isLight
        ? 'border-2 border-stone-800 bg-[#ede8df] text-[#1c1917]'
        : 'border-2 border-stone-600 bg-[#292524] text-[#f5f2eb]';
    }
    if (uiStyle === 'retrowave') {
      return isLight
        ? 'bg-pink-50/90 border-2 border-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.15)] text-pink-950 rounded-2xl'
        : 'bg-[#1e0736]/90 border-2 border-pink-500 shadow-[0_0_25px_rgba(255,0,127,0.25)] text-pink-100 rounded-2xl';
    }
    if (uiStyle === 'neumorphic') {
      return isLight
        ? 'bg-[#e2e8f0] shadow-[5px_5px_10px_#cbd5e1,-5px_-5px_10px_#ffffff] text-slate-900 rounded-2xl'
        : 'bg-[#1a1d24] shadow-[5px_5px_10px_#101217,-5px_-5px_10px_#242831] text-neutral-200 rounded-2xl';
    }
    if (uiStyle === 'obsidian') {
      return isLight
        ? 'bg-white/95 border border-slate-200 text-slate-900 shadow-sm rounded-xl'
        : 'bg-[#0f0f15] border border-white/[0.14] text-[#eef0f3] shadow-md rounded-xl';
    }
    if (uiStyle === 'civic') {
      return isLight
        ? 'bg-white border border-slate-300 rounded-xl shadow-sm text-slate-900'
        : 'bg-slate-900/90 border border-slate-700 rounded-xl shadow-md text-slate-100';
    }
    // Modern Glass
    return isLight
      ? 'glass-panel bg-white/80 border border-slate-200 rounded-2xl text-slate-900 shadow-sm'
      : 'glass-panel border border-white/10 bg-white/[0.03] rounded-2xl text-white shadow-md';
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

  const cardClass = getCardClass();
  const innerClass = getInnerClass();
  const fontClass = uiStyle === 'tui' || uiStyle === 'hud' ? 'font-mono' : uiStyle === 'eink' ? 'font-serif' : 'font-sans';

  // 1. COUNTDOWN WIDGET
  const renderCountdownWidget = () => {
    if (uiStyle === 'tui') {
      return (
        <TuiBox
          key="countdown"
          title="NEXT_SESSION_COUNTDOWN"
          badge="LIVE IN IST"
          badgeColor="text-red-500"
          className="border-red-500/50"
        >
          <div className="py-1">
            <div className="flex items-center justify-between pb-2 border-b border-red-500/30">
              <div>
                <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>TARGET_EVENT:</div>
                <div className={`text-lg font-black mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>{f1.nextSession.name.toUpperCase()}</div>
                <div className="text-xs text-red-500 mt-0.5 font-bold">&gt;&gt; {f1.nextSession.istTimeFormatted}</div>
              </div>
              <div className={`px-3 py-1.5 border border-red-500/60 text-center ${isLight ? 'bg-red-50' : 'bg-red-950/20'}`}>
                <div className={`text-[8px] uppercase tracking-wider font-bold ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                  T-MINUS
                </div>
                <div className="text-base font-black text-red-500 tracking-wider animate-pulse">
                  T-{f1.nextSession.countdownFormatted}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-1.5 text-[10px] pt-2">
              <div className={`p-1 border text-center ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                <div className={`text-[8px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>LAPS</div>
                <div className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>50 LAPS</div>
              </div>
              <div className={`p-1 border text-center ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                <div className={`text-[8px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>CIRCUIT</div>
                <div className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>6.201 KM</div>
              </div>
              <div className={`p-1 border text-center ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                <div className={`text-[8px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>DRS</div>
                <div className="text-red-500 font-bold">2 ZONES</div>
              </div>
              <div className={`p-1 border text-center ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                <div className={`text-[8px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>RECORD</div>
                <div className="text-amber-500 font-bold">{f1.circuitLapRecord?.lapTime || '1:35.490'}</div>
              </div>
            </div>
          </div>
        </TuiBox>
      );
    }

    if (uiStyle === 'brutalist') {
      return (
        <BrutalistBox
          key="countdown"
          title="NEXT SESSION COUNTDOWN"
          badge="LIVE IN IST"
          badgeColor="bg-red-600 text-white"
        >
          <div className="py-1">
            <div className="flex items-center justify-between pb-2 border-b-2 border-black">
              <div>
                <div className={`text-[9px] font-black uppercase tracking-wider ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                  TARGET SESSION
                </div>
                <div className="text-lg font-black uppercase tracking-tight">
                  {f1.nextSession.name}
                </div>
                <div className="text-xs font-mono font-bold mt-0.5 flex items-center text-red-500">
                  <Calendar size={12} className="mr-1.5" />
                  {f1.nextSession.istTimeFormatted}
                </div>
              </div>
              <div
                className={`px-3 py-1.5 border-2 border-black text-center ${
                  isLight ? 'shadow-[2px_2px_0px_#000]' : 'shadow-[2px_2px_0px_#fff]'
                }`}
                style={{ backgroundColor: 'var(--color-accent, #facc15)' }}
              >
                <div className="text-[8px] font-black uppercase tracking-widest text-black">
                  T-MINUS
                </div>
                <div className="text-base font-black font-mono text-black tracking-wider">
                  {f1.nextSession.countdownFormatted}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-1.5 text-xs pt-2">
              <div className={`p-1 border-2 border-black text-center ${isLight ? 'bg-neutral-100 shadow-[2px_2px_0px_#000]' : 'bg-neutral-900 shadow-[2px_2px_0px_#fff]'}`}>
                <span className={`block text-[8px] font-black uppercase ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>Laps</span>
                <span className="font-mono font-black text-xs">50</span>
              </div>
              <div className={`p-1 border-2 border-black text-center ${isLight ? 'bg-neutral-100 shadow-[2px_2px_0px_#000]' : 'bg-neutral-900 shadow-[2px_2px_0px_#fff]'}`}>
                <span className={`block text-[8px] font-black uppercase ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>Length</span>
                <span className="font-mono font-black text-xs">6.2 KM</span>
              </div>
              <div className={`p-1 border-2 border-black text-center ${isLight ? 'bg-neutral-100 shadow-[2px_2px_0px_#000]' : 'bg-neutral-900 shadow-[2px_2px_0px_#fff]'}`}>
                <span className={`block text-[8px] font-black uppercase ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>DRS</span>
                <span className="font-mono font-black text-xs text-red-500">2 ZONES</span>
              </div>
              <div className={`p-1 border-2 border-black text-center ${isLight ? 'bg-neutral-100 shadow-[2px_2px_0px_#000]' : 'bg-neutral-900 shadow-[2px_2px_0px_#fff]'}`}>
                <span className={`block text-[8px] font-black uppercase ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>Record</span>
                <span className="font-mono font-black text-xs text-amber-500">{f1.circuitLapRecord?.lapTime || '1:35.4'}</span>
              </div>
            </div>
          </div>
        </BrutalistBox>
      );
    }

    if (uiStyle === 'hud') {
      return (
        <HudBox key="countdown" title="NEXT_SESSION_COUNTDOWN" code="LIVE_IST" glowColor="cyan">
          <div className="py-1">
            <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
              <div>
                <span className={`text-[9px] block ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>TARGET_EVENT</span>
                <span className={`text-lg font-black tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}>{f1.nextSession.name}</span>
                <span className="text-xs font-mono block mt-0.5 flex items-center" style={{ color: 'var(--color-accent)' }}>
                  <Calendar size={12} className="mr-1.5" />
                  {f1.nextSession.istTimeFormatted}
                </span>
              </div>
              <div className={`px-3 py-1.5 border text-center ${
                isLight ? 'bg-cyan-100/60 border-cyan-400' : 'bg-black/60 border-cyan-500/50'
              }`}>
                <div className={`text-[8px] uppercase tracking-widest ${isLight ? 'text-slate-600' : 'text-cyan-300'}`}>
                  T-MINUS
                </div>
                <div className="text-base font-black font-mono tracking-wider text-rose-500 animate-pulse">
                  T-{f1.nextSession.countdownFormatted}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-1.5 text-xs pt-2">
              <div className={`p-1.5 border text-center ${isLight ? 'bg-white/80 border-cyan-200' : 'bg-black/40 border-cyan-500/20'}`}>
                <span className={`block text-[8px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>LAPS</span>
                <span className="font-bold text-xs">50</span>
              </div>
              <div className={`p-1.5 border text-center ${isLight ? 'bg-white/80 border-cyan-200' : 'bg-black/40 border-cyan-500/20'}`}>
                <span className={`block text-[8px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>LENGTH</span>
                <span className="font-bold text-xs">6.2 KM</span>
              </div>
              <div className={`p-1.5 border text-center ${isLight ? 'bg-white/80 border-cyan-200' : 'bg-black/40 border-cyan-500/20'}`}>
                <span className={`block text-[8px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>DRS</span>
                <span className="font-bold text-rose-500 text-xs">2 ZONES</span>
              </div>
              <div className={`p-1.5 border text-center ${isLight ? 'bg-white/80 border-cyan-200' : 'bg-black/40 border-cyan-500/20'}`}>
                <span className={`block text-[8px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>RECORD</span>
                <span className="font-bold text-amber-400 text-xs">{f1.circuitLapRecord?.lapTime || '1:35.4'}</span>
              </div>
            </div>
          </div>
        </HudBox>
      );
    }

    // Default Glass / Minimal / Neumorphic / Eink / Retrowave / Obsidian / Civic
    return (
      <div
        key="countdown"
        className={`p-4 border shadow-md relative overflow-hidden ${cardClass}`}
      >
        <div className="flex items-center justify-between pb-2 border-b border-red-500/10">
          <div className={`flex items-center space-x-2 text-[11px] uppercase font-extrabold tracking-widest ${
            isLight ? 'text-red-600' : 'text-red-400'
          }`}>
            <Timer size={14} />
            <span>Next Session Countdown</span>
          </div>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-red-600 text-white shadow-sm">
            LIVE IN IST
          </span>
        </div>
        <div className="flex items-center justify-between py-2">
          <div>
            <h2 className="text-lg font-bold">
              {f1.nextSession.name}
            </h2>
            <p className="text-xs font-mono mt-0.5 flex items-center opacity-75">
              <Calendar size={12} className="mr-1.5 text-red-500" />
              {f1.nextSession.istTimeFormatted}
            </p>
          </div>
          <div className={`px-3 py-1.5 rounded-xl border flex items-center space-x-2 font-mono ${innerClass}`}>
            <div className="text-center">
              <span className="text-xl font-extrabold block leading-tight">
                {f1.nextSession.countdownFormatted.split(' ')[0] || '00'}
              </span>
              <span className="text-[8px] uppercase tracking-wider block opacity-70">
                Days/Hrs
              </span>
            </div>
            <span className="text-base text-red-500 font-bold">:</span>
            <div className="text-center">
              <span className="text-xl font-extrabold text-red-500 block leading-tight">
                {f1.nextSession.countdownFormatted.split(' ')[1] || '00m'}
              </span>
              <span className="text-[8px] uppercase tracking-wider block opacity-70">
                Mins
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/10 text-xs">
          <div className={`p-1.5 rounded-xl text-center ${innerClass}`}>
            <span className="block text-[9px] uppercase opacity-70">Laps</span>
            <span className="font-mono font-bold text-xs">50 Laps</span>
          </div>
          <div className={`p-1.5 rounded-xl text-center ${innerClass}`}>
            <span className="block text-[9px] uppercase opacity-70">Length</span>
            <span className="font-mono font-bold text-xs">6.201 km</span>
          </div>
          <div className={`p-1.5 rounded-xl text-center ${innerClass}`}>
            <span className="block text-[9px] uppercase opacity-70">DRS</span>
            <span className="font-mono font-bold text-red-500 text-xs">2 Zones</span>
          </div>
          <div className={`p-1.5 rounded-xl text-center ${innerClass}`}>
            <span className="block text-[9px] uppercase opacity-70">Lap Record</span>
            <span className="font-mono font-bold text-amber-500 text-xs">
              {f1.circuitLapRecord?.lapTime || '1:35.490'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // 2. PODIUM WIDGET
  const renderPodiumWidget = () => {
    if (!f1.lastRace) return null;

    if (uiStyle === 'tui') {
      return (
        <TuiBox key="podium" title="PREV_GP_PODIUM" badge={f1.lastRace.raceName.toUpperCase()} badgeColor="text-amber-400">
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
          <div className="grid grid-cols-3 gap-2 text-xs py-0.5">
            <div className={`p-1.5 border-2 border-black ${isLight ? 'bg-yellow-300 shadow-[2px_2px_0px_#000]' : 'bg-yellow-400 text-black shadow-[2px_2px_0px_#fff]'}`}>
              <div className="font-black text-[10px]">🥇 P1 WINNER</div>
              <div className="font-black truncate">{f1.lastRace.winner}</div>
            </div>
            <div className={`p-1.5 border-2 border-black ${isLight ? 'bg-neutral-100 shadow-[2px_2px_0px_#000]' : 'bg-neutral-900 text-white shadow-[2px_2px_0px_#fff]'}`}>
              <div className="font-black text-[10px]">🥈 P2</div>
              <div className="font-black truncate">{f1.lastRace.p2.split(' ')[0]} {f1.lastRace.p2.split(' ')[1]}</div>
            </div>
            <div className={`p-1.5 border-2 border-black ${isLight ? 'bg-neutral-100 shadow-[2px_2px_0px_#000]' : 'bg-neutral-900 text-white shadow-[2px_2px_0px_#fff]'}`}>
              <div className="font-black text-[10px]">🥉 P3</div>
              <div className="font-black truncate">{f1.lastRace.p3.split(' ')[0]} {f1.lastRace.p3.split(' ')[1]}</div>
            </div>
          </div>
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
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-cyan-500/20">
              <span className={isLight ? 'text-slate-600' : 'text-gray-400'}>P2: {f1.lastRace.p2}</span>
              <span className={isLight ? 'text-slate-600' : 'text-gray-400'}>P3: {f1.lastRace.p3}</span>
            </div>
          </div>
        </HudBox>
      );
    }

    return (
      <div key="podium" className={`p-3 border ${cardClass}`}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] uppercase font-bold tracking-wider flex items-center space-x-1.5 opacity-80">
            <Award size={13} className="text-amber-500" />
            <span>PREV GP: {f1.lastRace.raceName}</span>
          </span>
          <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center space-x-1">
            <Zap size={10} />
            <span>FL: {f1.lastRace.fastestLapDriver} ({f1.lastRace.fastestLapTime})</span>
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className={`p-1.5 rounded-xl border flex items-center space-x-1.5 ${
            isLight ? 'bg-amber-50/60 border-amber-200' : 'bg-amber-500/10 border-amber-500/20'
          }`}>
            <span className="text-amber-500 font-extrabold text-xs">🥇 P1</span>
            <div className="truncate">
              <p className="font-bold truncate text-[11px]">{f1.lastRace.winner}</p>
              <p className="text-[9px] truncate opacity-70">{f1.lastRace.winnerTeam}</p>
            </div>
          </div>
          <div className={`p-1.5 rounded-xl border flex items-center space-x-1.5 ${innerClass}`}>
            <span className="text-slate-400 font-bold text-xs">🥈 P2</span>
            <div className="truncate">
              <p className="font-bold truncate text-[11px]">{f1.lastRace.p2.split(' ')[0]} {f1.lastRace.p2.split(' ')[1]}</p>
              <p className="text-[9px] truncate opacity-70">{f1.lastRace.p2Team}</p>
            </div>
          </div>
          <div className={`p-1.5 rounded-xl border flex items-center space-x-1.5 ${innerClass}`}>
            <span className="text-amber-700 font-bold text-xs">🥉 P3</span>
            <div className="truncate">
              <p className="font-bold truncate text-[11px]">{f1.lastRace.p3.split(' ')[0]} {f1.lastRace.p3.split(' ')[1]}</p>
              <p className="text-[9px] truncate opacity-70">{f1.lastRace.p3Team}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 3. TITLE BATTLE WIDGET
  const renderTitleBattleWidget = () => {
    const battle = f1.titleBattle;
    if (!battle) return null;

    if (uiStyle === 'tui') {
      return (
        <TuiBox key="titleBattle" title="TITLE_FIGHT_TELEMETRY" badge={`GAP +${battle.pointsGap} PTS`} badgeColor="text-emerald-400">
          <div className="text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 font-bold">P1: {battle.leader} ({battle.leaderPoints} pts)</span>
              <span className="text-red-400 font-bold">P2: {battle.contender} ({battle.contenderPoints} pts)</span>
            </div>
            <div className="w-full bg-gray-900 border border-gray-700 h-2 flex">
              <div className="bg-emerald-500 h-full" style={{ width: `${Math.min(95, Math.max(5, (battle.leaderPoints / (battle.leaderPoints + battle.contenderPoints)) * 100))}%` }} />
              <div className="bg-red-500 h-full flex-1" />
            </div>
            <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
              <span>WCC: {battle.teamLeader} +{battle.teamPointsGap} pts over {battle.teamContender}</span>
              <span>{battle.roundsRemaining} RDS LEFT</span>
            </div>
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
          <div className="py-1 text-xs space-y-1.5">
            <div className="flex items-center justify-between font-black">
              <span style={{ color: battle.leaderColor }}>P1 {battle.leader} ({battle.leaderPoints})</span>
              <span style={{ color: battle.contenderColor }}>P2 {battle.contender} ({battle.contenderPoints})</span>
            </div>
            <div className="w-full border-2 border-black h-3 bg-neutral-200 overflow-hidden flex">
              <div className="h-full bg-emerald-400" style={{ width: `${Math.min(95, Math.max(5, (battle.leaderPoints / (battle.leaderPoints + battle.contenderPoints)) * 100))}%` }} />
              <div className="h-full bg-rose-500 flex-1" />
            </div>
            <div className="flex items-center justify-between text-[10px] font-black uppercase">
              <span>WCC: {battle.teamLeader} (+{battle.teamPointsGap} PTS)</span>
              <span>{battle.roundsRemaining} ROUNDS LEFT</span>
            </div>
          </div>
        </BrutalistBox>
      );
    }

    if (uiStyle === 'hud') {
      return (
        <HudBox key="titleBattle" title="WDC_TITLE_BATTLE_INDEX" code={`GAP_${battle.pointsGap}PTS`} glowColor="cyan">
          <div className="text-xs space-y-1.5 py-0.5">
            <div className="flex items-center justify-between font-mono">
              <span className="font-bold text-cyan-300">P1 {battle.leader}: {battle.leaderPoints} PTS</span>
              <span className="font-bold text-rose-400">P2 {battle.contender}: {battle.contenderPoints} PTS</span>
            </div>
            <div className="w-full bg-black/60 border border-cyan-500/40 h-2 flex">
              <div className="bg-cyan-400 h-full shadow-[0_0_8px_#06b6d4]" style={{ width: `${Math.min(95, Math.max(5, (battle.leaderPoints / (battle.leaderPoints + battle.contenderPoints)) * 100))}%` }} />
              <div className="bg-rose-500 h-full flex-1" />
            </div>
            <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
              <span>WCC: {battle.teamLeader} (+{battle.teamPointsGap} PTS)</span>
              <span>ROUNDS_LEFT: {battle.roundsRemaining}</span>
            </div>
          </div>
        </HudBox>
      );
    }

    return (
      <div key="titleBattle" className={`p-3 border ${cardClass}`}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] uppercase font-bold tracking-wider flex items-center space-x-1.5 opacity-80">
            <Trophy size={13} className="text-emerald-500" />
            <span>CHAMPIONSHIP BATTLE (P1 VS P2)</span>
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            +{battle.pointsGap} PTS GAP
          </span>
        </div>
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
      </div>
    );
  };

  // 4. QUALIFYING WIDGET
  const renderQualifyingWidget = () => {
    const quali = f1.qualifyingResult;
    if (!quali) return null;

    if (uiStyle === 'tui') {
      return (
        <TuiBox key="qualifying" title="PREV_QUALIFYING_GRID" badge="POLE POSITION" badgeColor="text-yellow-400">
          <div className="text-xs space-y-1">
            <div className="flex items-center justify-between text-yellow-400 font-bold">
              <span>POLE: {quali.poleDriver.toUpperCase()} ({quali.poleTeam})</span>
              <span className="font-mono">{quali.poleTime}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] pt-1 border-t border-gray-800 text-gray-400">
              <span>P2: {quali.p2Driver} [{quali.p2Time}]</span>
              <span>P3: {quali.p3Driver} [{quali.p3Time}]</span>
            </div>
          </div>
        </TuiBox>
      );
    }

    if (uiStyle === 'brutalist') {
      return (
        <BrutalistBox key="qualifying" title="QUALIFYING SHOOTOUT" badge="FRONT ROW" badgeColor="bg-yellow-400 text-black">
          <div className="py-1 text-xs space-y-1">
            <div className="flex items-center justify-between font-black">
              <span className="text-amber-500">POLE: {quali.poleDriver} ({quali.poleTeam})</span>
              <span className="font-mono bg-black text-yellow-300 px-1">{quali.poleTime}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1 border-t-2 border-black">
              <span>P2: {quali.p2Driver} ({quali.p2Time})</span>
              <span>P3: {quali.p3Driver} ({quali.p3Time})</span>
            </div>
          </div>
        </BrutalistBox>
      );
    }

    return (
      <div key="qualifying" className={`p-3 border ${cardClass}`}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] uppercase font-bold tracking-wider flex items-center space-x-1.5 opacity-80">
            <Zap size={13} className="text-amber-500" />
            <span>QUALIFYING SHOOTOUT: {quali.raceName}</span>
          </span>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
            POLE: {quali.poleTime}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs font-bold mb-1">
          <span className="text-amber-500">🏆 1st: {quali.poleDriver} ({quali.poleTeam})</span>
          <span className="font-mono text-[11px] text-amber-400">{quali.poleTime}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono opacity-80 pt-1 border-t border-white/5">
          <span>2nd: {quali.p2Driver} ({quali.p2Time})</span>
          <span>3rd: {quali.p3Driver} ({quali.p3Time})</span>
        </div>
      </div>
    );
  };

  // 5. PIT STOP WIDGET
  const renderPitStopWidget = () => {
    const pit = f1.pitStopRecord;
    if (!pit) return null;

    if (uiStyle === 'tui') {
      return (
        <TuiBox key="pitstop" title="DHL_FASTEST_PITSTOP" badge={pit.duration} badgeColor="text-yellow-400">
          <div className="text-xs flex items-center justify-between">
            <span className="font-bold">{pit.driver} • {pit.team}</span>
            <span className="text-[10px] text-gray-400">LAP {pit.lap} • RECORD TIME</span>
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
      <div key="pitstop" className={`p-2.5 border flex items-center justify-between text-xs ${cardClass}`}>
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Wrench size={14} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold block opacity-70">
              DHL FASTEST PIT STOP ({pit.raceName})
            </span>
            <span className="font-bold text-[11px]">{pit.driver} • {pit.team}</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-base font-extrabold font-mono text-amber-500 block">{pit.duration}</span>
          <span className="text-[9px] font-mono opacity-70">Lap {pit.lap}</span>
        </div>
      </div>
    );
  };

  // 6. UPCOMING RACES WIDGET
  const renderUpcomingRacesWidget = () => {
    const races = f1.upcomingRaces;
    if (!races || races.length === 0) return null;

    if (uiStyle === 'tui') {
      return (
        <TuiBox key="upcomingRaces" title="SEASON_CALENDAR_UPCOMING" badge="NEXT ROUNDS" badgeColor="text-cyan-400">
          <div className="space-y-1 text-xs">
            {races.map((r) => (
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
      <div key="upcomingRaces" className={`p-3 border ${cardClass}`}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] uppercase font-bold tracking-wider flex items-center space-x-1.5 opacity-80">
            <Flag size={13} className="text-cyan-400" />
            <span>UPCOMING GRAND PRIX CALENDAR</span>
          </span>
          <span className="text-[10px] font-mono font-bold opacity-75">2026 SEASON</span>
        </div>
        <div className="space-y-1 text-xs">
          {races.map((r) => (
            <div key={r.round} className={`p-1.5 rounded-xl border flex items-center justify-between ${innerClass}`}>
              <div>
                <span className="font-bold text-[11px]">R{r.round} • {r.raceName}</span>
                <p className="text-[9px] opacity-75">{r.istDate}</p>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                in {r.countdown}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 7. CIRCUIT TECHNICAL TELEMETRY WIDGET
  const renderCircuitTelemetryWidget = () => {
    const tel = f1.circuitTelemetry;
    if (!tel) return null;

    if (uiStyle === 'tui') {
      return (
        <TuiBox key="circuitTelemetry" title="CIRCUIT_TECH_TELEMETRY" badge="SPEC SHEET" badgeColor="text-cyan-400">
          <div className="grid grid-cols-4 gap-1 text-[10px] font-mono text-center">
            <div className="p-1 border border-gray-800">
              <div className="text-[8px] text-gray-500">THROTTLE</div>
              <div className="font-bold text-cyan-400">{tel.fullThrottlePercent}%</div>
            </div>
            <div className="p-1 border border-gray-800">
              <div className="text-[8px] text-gray-500">SHIFTS/LAP</div>
              <div className="font-bold">{tel.gearShiftsPerLap}</div>
            </div>
            <div className="p-1 border border-gray-800">
              <div className="text-[8px] text-gray-500">TOP SPEED</div>
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
      <div key="circuitTelemetry" className={`p-2.5 border ${cardClass}`}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] uppercase font-bold tracking-wider flex items-center space-x-1.5 opacity-80">
            <Gauge size={13} className="text-cyan-400" />
            <span>CIRCUIT TECHNICAL SPECS</span>
          </span>
          <span className="text-[9px] font-mono opacity-70">{tel.tyreAllocation}</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5 text-xs text-center font-mono">
          <div className={`p-1.5 rounded-xl border ${innerClass}`}>
            <span className="text-[8px] uppercase block opacity-70">Throttle</span>
            <span className="font-bold text-cyan-400">{tel.fullThrottlePercent}%</span>
          </div>
          <div className={`p-1.5 rounded-xl border ${innerClass}`}>
            <span className="text-[8px] uppercase block opacity-70">Shifts</span>
            <span className="font-bold">{tel.gearShiftsPerLap}</span>
          </div>
          <div className={`p-1.5 rounded-xl border ${innerClass}`}>
            <span className="text-[8px] uppercase block opacity-70">Max Speed</span>
            <span className="font-bold text-red-400">{tel.topSpeedKmh} km/h</span>
          </div>
          <div className={`p-1.5 rounded-xl border ${innerClass}`}>
            <span className="text-[8px] uppercase block opacity-70">Pit Delta</span>
            <span className="font-bold text-amber-400">{tel.pitLaneLossSec}s</span>
          </div>
        </div>
      </div>
    );
  };

  // 8. TRACK WEATHER WIDGET
  const renderTrackWeatherWidget = () => {
    if (uiStyle === 'tui') {
      return (
        <TuiBox key="trackWeather" title="CIRCUIT_WEATHER" badge={`${weather.temperature}°C`} badgeColor="text-cyan-400">
          <div className="flex items-center justify-between text-xs py-0.5">
            <span className="font-bold">{weather.condition.toUpperCase()}</span>
            <span className="text-gray-400 font-mono">WIND: {weather.windSpeed} KM/H • HUM: {weather.humidity}%</span>
          </div>
        </TuiBox>
      );
    }

    if (uiStyle === 'brutalist') {
      return (
        <BrutalistBox key="trackWeather" title="TRACK CONDITIONS" badge="LOCAL METEO" badgeColor="bg-cyan-400 text-black">
          <div className="flex items-center justify-between py-0.5 text-xs">
            <div className="flex items-center space-x-2">
              <CloudSun size={18} className="text-amber-500" />
              <div className="font-mono font-black">{weather.temperature}°C {weather.condition}</div>
            </div>
            <div className="text-right font-mono font-bold text-[10px]">
              <div>HUM: {weather.humidity}% • WIND: {weather.windSpeed} KM/H</div>
            </div>
          </div>
        </BrutalistBox>
      );
    }

    if (uiStyle === 'hud') {
      return (
        <HudBox key="trackWeather" title="TRACK_CONDITIONS" code="CIRCUIT_METEO" glowColor="cyan">
          <div className="flex items-center justify-between py-0.5 text-xs font-mono">
            <span className="font-bold text-cyan-300">{weather.temperature}°C // {weather.condition.toUpperCase()}</span>
            <span className="text-[10px] text-gray-400">WIND: {weather.windSpeed} KM/H // HUM: {weather.humidity}%</span>
          </div>
        </HudBox>
      );
    }

    return (
      <div key="trackWeather" className="h-28">
        <WeatherWidget layout="compact" className="h-full" />
      </div>
    );
  };

  const renderWidgetInTheme = (id: F1WidgetId) => {
    switch (id) {
      case 'countdown':
        return renderCountdownWidget();
      case 'podium':
        return renderPodiumWidget();
      case 'titleBattle':
        return renderTitleBattleWidget();
      case 'qualifying':
        return renderQualifyingWidget();
      case 'pitstop':
        return renderPitStopWidget();
      case 'upcomingRaces':
        return renderUpcomingRacesWidget();
      case 'circuitTelemetry':
        return renderCircuitTelemetryWidget();
      case 'trackWeather':
        return renderTrackWeatherWidget();
      default:
        return null;
    }
  };

  return (
    <div ref={containerRef} className={`h-full flex flex-col space-y-2.5 relative overflow-hidden ${fontClass}`}>
      {/* Top Bar with Widget Management Controls */}
      <div className="flex items-center justify-between px-1 shrink-0">
        <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-wider opacity-75">
          <span>Active Widgets ({visibleWidgets.length})</span>
          {f1AutoFit && (
            <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] flex items-center space-x-1">
              <Sparkles size={9} />
              <span>Auto-Fit</span>
            </span>
          )}
        </div>
        <button
          onClick={() => setIsPickerOpen(true)}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-xl text-[11px] font-medium border transition-all ${
            isLight
              ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800 shadow-sm'
              : 'bg-white/10 hover:bg-white/15 border-white/10 text-white'
          }`}
          title="Select F1 Widgets"
        >
          <Sliders size={12} />
          <span>F1 Widgets</span>
        </button>
      </div>

      {/* Render Active Widgets */}
      <div className="space-y-2.5 overflow-y-auto pr-0.5 flex-1 min-h-0">
        {visibleWidgets.map((w) => renderWidgetInTheme(w.id))}
      </div>

      {/* Interactive Widget Selector Popover / Modal */}
      {isPickerOpen && (
        <div className="absolute inset-0 z-50 p-4 rounded-3xl bg-black/90 backdrop-blur-md border border-white/20 flex flex-col justify-between text-white animate-in fade-in zoom-in-95 duration-200">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/15">
              <div className="flex items-center space-x-2">
                <Sliders size={18} className="text-amber-400" />
                <h3 className="text-sm font-bold tracking-tight">F1 Widgets Selection</h3>
              </div>
              <button
                onClick={() => setIsPickerOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Auto-Fit Toggle */}
            <div className="my-2.5 p-2 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold flex items-center space-x-1.5">
                  <Sparkles size={13} className="text-emerald-400" />
                  <span>Auto-Fit to Screen Height</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Fills remaining vertical space with 1-2 extra widgets dynamically.
                </p>
              </div>
              <button
                onClick={() => setF1AutoFit(!f1AutoFit)}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${
                  f1AutoFit ? 'bg-emerald-600' : 'bg-gray-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    f1AutoFit ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Widgets List */}
            <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
              {F1_AVAILABLE_WIDGETS.map((widget) => {
                const isActive = f1ActiveWidgets.includes(widget.id);
                const Icon = widget.icon;
                return (
                  <button
                    key={widget.id}
                    onClick={() => toggleF1Widget(widget.id)}
                    className={`w-full p-2 rounded-xl border text-left transition-all flex items-center justify-between ${
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
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                      isActive ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-gray-600'
                    }`}>
                      {isActive && <Check size={12} strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2.5 border-t border-white/15 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setF1ActiveWidgets(['countdown', 'podium', 'trackWeather'])}
                className="px-2 py-1 rounded-lg text-[10px] border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300"
              >
                Compact (3)
              </button>
              <button
                onClick={() => setF1ActiveWidgets(F1_AVAILABLE_WIDGETS.map((w) => w.id))}
                className="px-2 py-1 rounded-lg text-[10px] border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300"
              >
                All (8)
              </button>
            </div>
            <button
              onClick={() => setIsPickerOpen(false)}
              className="px-4 py-1 rounded-xl bg-red-600 hover:bg-red-500 font-bold text-xs text-white shadow-lg"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
