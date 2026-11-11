import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Layers, MapPin, Camera, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useDashboard } from '../../state/DashboardContext';
import type { PhotoItem, UIStyle } from '../../types/dashboard';

export interface PhotoStackProps {
  photos?: PhotoItem[];
  currentIndex?: number;
  onNext?: () => void;
  onPrev?: () => void;
  onSelectIndex?: (index: number) => void;
  isLight?: boolean;
  uiStyle?: UIStyle;
  className?: string;
}

interface StackCardItem {
  photo: PhotoItem;
  photoIdx: number;
  id: string;
  isEntering?: boolean;
  isExiting?: boolean;
  fallAngle: number;
  landAngle: number;
}

interface ThemeClasses {
  card: string;
  canvas: string;
  badge: string;
  title: string;
  location: string;
  credit: string;
  dockContainer: string;
  dockBtn: string;
  dotActive: string;
  dotInactive: string;
  nextBtn: string;
  stylePillContainer: string;
  stylePillActive: string;
  stylePillInactive: string;
  hoverHint: string;
}

const getThemeClasses = (uiStyle: UIStyle, isLight: boolean): ThemeClasses => {
  switch (uiStyle) {
    case 'tui':
      return {
        card: `rounded-none p-2.5 pb-3 border-2 font-mono ${
          isLight
            ? 'bg-[#fbfbf9] border-stone-800 text-slate-900 shadow-[6px_6px_0px_#1c1917]'
            : 'bg-black/95 border-green-500/80 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.2)]'
        }`,
        canvas: `rounded-none border ${
          isLight ? 'border-stone-400 bg-stone-100' : 'border-green-500/40 bg-black'
        }`,
        badge: `rounded-none border font-mono text-[10px] ${
          isLight
            ? 'border-stone-800 bg-stone-200 text-stone-900'
            : 'border-green-500 bg-black text-green-400 shadow-[0_0_8px_rgba(34,197,94,0.3)]'
        }`,
        title: `font-mono font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-green-400'}`,
        location: `font-mono text-xs ${isLight ? 'text-stone-600' : 'text-green-300/80'}`,
        credit: `font-mono text-[11px] ${isLight ? 'text-stone-500' : 'text-green-500/70'}`,
        dockContainer: `rounded-none border-2 font-mono ${
          isLight
            ? 'bg-white border-stone-800 shadow-[4px_4px_0px_#1c1917]'
            : 'bg-black border-green-500 shadow-[0_0_12px_rgba(34,197,94,0.25)]'
        }`,
        dockBtn: `p-2 rounded-none border-2 font-mono transition-all cursor-pointer hover:scale-105 active:scale-95 ${
          isLight
            ? 'bg-white hover:bg-stone-100 text-stone-900 border-stone-800 shadow-[3px_3px_0px_#1c1917]'
            : 'bg-black hover:bg-green-950/40 text-green-400 border-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]'
        }`,
        dotActive: `w-5 h-2 rounded-none ${isLight ? 'bg-stone-900' : 'bg-green-400 shadow-[0_0_8px_rgba(34,197,94,0.7)]'}`,
        dotInactive: `w-2 h-2 rounded-none ${isLight ? 'bg-stone-400' : 'bg-green-900'}`,
        nextBtn: `rounded-none border ${
          isLight
            ? 'bg-stone-100 border-stone-800 text-stone-900 shadow-[2px_2px_0px_#1c1917]'
            : 'bg-black border-green-500 text-green-400 shadow-[0_0_8px_rgba(34,197,94,0.3)]'
        }`,
        stylePillContainer: `rounded-none border-2 font-mono text-[11px] ${
          isLight
            ? 'bg-white border-stone-800 shadow-[4px_4px_0px_#1c1917] text-stone-800'
            : 'bg-black border-green-500 shadow-[0_0_12px_rgba(34,197,94,0.25)] text-green-400'
        }`,
        stylePillActive: `rounded-none ${isLight ? 'bg-stone-900 text-white font-bold' : 'bg-green-500 text-black font-bold'}`,
        stylePillInactive: `rounded-none hover:bg-black/10 dark:hover:bg-green-950/40 opacity-70`,
        hoverHint: `rounded-none font-mono ${
          isLight ? 'bg-stone-900 text-white' : 'bg-black border border-green-500 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.4)]'
        }`,
      };

    case 'brutalist':
      return {
        card: `rounded-none p-3 pb-3.5 border-4 ${
          isLight
            ? 'bg-white border-black shadow-[8px_8px_0px_#000] hover:shadow-[12px_12px_0px_#000]'
            : 'bg-black border-white shadow-[8px_8px_0px_var(--color-accent,#ffff00)] hover:shadow-[12px_12px_0px_var(--color-accent,#ffff00)]'
        }`,
        canvas: `rounded-none border-2 ${
          isLight ? 'border-black bg-neutral-100' : 'border-white bg-neutral-900'
        }`,
        badge: `rounded-none border-2 uppercase font-black text-[10px] ${
          isLight
            ? 'bg-white text-black border-black shadow-[2px_2px_0px_#000]'
            : 'bg-black text-white border-white shadow-[2px_2px_0px_var(--color-accent,#ffff00)]'
        }`,
        title: `font-black uppercase tracking-tight ${isLight ? 'text-black' : 'text-white'}`,
        location: `font-bold uppercase text-xs ${isLight ? 'text-neutral-700' : 'text-neutral-300'}`,
        credit: `font-bold uppercase text-[11px] ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`,
        dockContainer: `rounded-none border-4 ${
          isLight ? 'bg-white border-black shadow-[5px_5px_0px_#000]' : 'bg-black border-white shadow-[5px_5px_0px_var(--color-accent,#ffff00)]'
        }`,
        dockBtn: `p-2 rounded-none border-4 transition-all cursor-pointer hover:scale-105 active:scale-95 ${
          isLight
            ? 'bg-white hover:bg-neutral-100 text-black border-black shadow-[4px_4px_0px_#000]'
            : 'bg-black hover:bg-neutral-900 text-white border-white shadow-[4px_4px_0px_var(--color-accent,#ffff00)]'
        }`,
        dotActive: `w-6 h-2.5 rounded-none ${isLight ? 'bg-black' : 'bg-[var(--color-accent,#ffff00)]'}`,
        dotInactive: `w-2.5 h-2.5 rounded-none ${isLight ? 'bg-neutral-300' : 'bg-neutral-700'}`,
        nextBtn: `rounded-none border-2 font-black ${
          isLight
            ? 'bg-white border-black text-black shadow-[3px_3px_0px_#000]'
            : 'bg-black border-white text-white shadow-[3px_3px_0px_var(--color-accent,#ffff00)]'
        }`,
        stylePillContainer: `rounded-none border-4 font-black text-[11px] uppercase ${
          isLight
            ? 'bg-white border-black shadow-[5px_5px_0px_#000] text-black'
            : 'bg-black border-white shadow-[5px_5px_0px_var(--color-accent,#ffff00)] text-white'
        }`,
        stylePillActive: `rounded-none ${isLight ? 'bg-black text-white' : 'bg-white text-black'}`,
        stylePillInactive: `rounded-none hover:bg-neutral-200 dark:hover:bg-neutral-800 opacity-70`,
        hoverHint: `rounded-none border-2 border-black font-black uppercase ${
          isLight ? 'bg-white text-black shadow-[4px_4px_0px_#000]' : 'bg-black text-white border-white shadow-[4px_4px_0px_var(--color-accent,#ffff00)]'
        }`,
      };

    case 'hud':
      return {
        card: `rounded-none p-2.5 pb-3 border font-mono ${
          isLight
            ? 'bg-white/95 border-cyan-500/70 shadow-[0_0_25px_rgba(0,180,216,0.18)]'
            : 'bg-[#030712]/90 border-cyan-500/50 shadow-[0_0_35px_rgba(0,240,255,0.22)]'
        }`,
        canvas: `rounded-none border ${
          isLight ? 'border-cyan-400/40 bg-slate-50' : 'border-cyan-500/30 bg-[#020617]'
        }`,
        badge: `rounded-none border font-mono text-[10px] tracking-widest ${
          isLight
            ? 'border-cyan-500/80 bg-white/90 text-cyan-800 shadow-sm'
            : 'border-cyan-400 bg-[#04091a]/95 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
        }`,
        title: `font-mono font-bold tracking-wide uppercase ${isLight ? 'text-slate-900' : 'text-cyan-100'}`,
        location: `font-mono text-xs ${isLight ? 'text-cyan-700' : 'text-cyan-300/80'}`,
        credit: `font-mono text-[11px] ${isLight ? 'text-cyan-800' : 'text-cyan-400/70'}`,
        dockContainer: `rounded-none border font-mono backdrop-blur-md ${
          isLight ? 'bg-white/95 border-cyan-500/60 shadow-md' : 'bg-[#04091a]/90 border-cyan-500/50 shadow-[0_0_20px_rgba(0,240,255,0.15)]'
        }`,
        dockBtn: `p-2 rounded-none border font-mono transition-all cursor-pointer hover:scale-105 active:scale-95 ${
          isLight
            ? 'bg-white hover:bg-cyan-50 text-cyan-900 border-cyan-500/60 shadow-sm'
            : 'bg-[#04091a] hover:bg-cyan-950/40 text-cyan-300 border-cyan-500/60 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
        }`,
        dotActive: `w-6 h-2 rounded-none ${isLight ? 'bg-cyan-600' : 'bg-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.8)]'}`,
        dotInactive: `w-2 h-2 rounded-none ${isLight ? 'bg-cyan-200' : 'bg-cyan-950 border border-cyan-800'}`,
        nextBtn: `rounded-none border ${
          isLight
            ? 'bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border-cyan-300'
            : 'bg-[#04091a] hover:bg-cyan-950/40 text-cyan-300 border-cyan-500/50'
        }`,
        stylePillContainer: `rounded-none border font-mono text-[11px] uppercase ${
          isLight
            ? 'bg-white/95 border-cyan-500/60 shadow-md text-cyan-900'
            : 'bg-[#04091a]/90 border-cyan-500/50 shadow-[0_0_20px_rgba(0,240,255,0.15)] text-cyan-300'
        }`,
        stylePillActive: `rounded-none ${isLight ? 'bg-cyan-600 text-white font-bold' : 'bg-cyan-500 text-black font-bold'}`,
        stylePillInactive: `rounded-none hover:bg-cyan-100 dark:hover:bg-cyan-950/40 opacity-70`,
        hoverHint: `rounded-none border font-mono ${
          isLight ? 'bg-white border-cyan-500 text-cyan-900' : 'bg-[#04091a] border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.3)]'
        }`,
      };

    case 'eink':
      return {
        card: `rounded-none p-3 pb-3.5 border-2 font-serif ${
          isLight ? 'bg-[#fdfbf7] border-stone-800 shadow-[6px_6px_0px_#1c1917]' : 'bg-[#292524] border-stone-400 shadow-[6px_6px_0px_#000]'
        }`,
        canvas: `rounded-none border ${
          isLight ? 'border-stone-400 bg-stone-100' : 'border-stone-600 bg-stone-900'
        }`,
        badge: `rounded-none border font-serif text-[10px] ${
          isLight ? 'border-stone-800 bg-[#ede8df] text-stone-900 shadow-[2px_2px_0px_#1c1917]' : 'border-stone-400 bg-[#292524] text-stone-200 shadow-[2px_2px_0px_#000]'
        }`,
        title: `font-serif font-bold italic tracking-normal ${isLight ? 'text-stone-900' : 'text-[#f5f2eb]'}`,
        location: `font-serif text-xs italic ${isLight ? 'text-stone-600' : 'text-stone-400'}`,
        credit: `font-serif text-[11px] italic ${isLight ? 'text-stone-500' : 'text-stone-400'}`,
        dockContainer: `rounded-none border-2 font-serif ${
          isLight ? 'bg-[#ede8df] border-stone-800 shadow-[3px_3px_0px_#1c1917]' : 'bg-[#292524] border-stone-400 shadow-[3px_3px_0px_#000]'
        }`,
        dockBtn: `p-2 rounded-none border-2 font-serif transition-all cursor-pointer hover:scale-105 active:scale-95 ${
          isLight
            ? 'bg-[#ede8df] hover:bg-stone-200 text-stone-900 border-stone-800 shadow-[2px_2px_0px_#1c1917]'
            : 'bg-[#292524] hover:bg-stone-800 text-[#f5f2eb] border-stone-400 shadow-[2px_2px_0px_#000]'
        }`,
        dotActive: `w-5 h-2 rounded-none ${isLight ? 'bg-stone-900' : 'bg-stone-200'}`,
        dotInactive: `w-2 h-2 rounded-none ${isLight ? 'bg-stone-300' : 'bg-stone-700'}`,
        nextBtn: `rounded-none border ${
          isLight ? 'bg-[#ede8df] hover:bg-stone-200 text-stone-900 border-stone-800' : 'bg-[#292524] hover:bg-stone-800 text-[#f5f2eb] border-stone-400'
        }`,
        stylePillContainer: `rounded-none border-2 font-serif text-[11px] ${
          isLight ? 'bg-[#ede8df] border-stone-800 shadow-[3px_3px_0px_#1c1917] text-stone-900' : 'bg-[#292524] border-stone-400 shadow-[3px_3px_0px_#000] text-[#f5f2eb]'
        }`,
        stylePillActive: `rounded-none ${isLight ? 'bg-stone-900 text-white font-bold' : 'bg-stone-200 text-stone-900 font-bold'}`,
        stylePillInactive: `rounded-none hover:bg-stone-300 dark:hover:bg-stone-800 opacity-70`,
        hoverHint: `rounded-none border-2 border-stone-800 font-serif ${
          isLight ? 'bg-[#ede8df] text-stone-900' : 'bg-[#292524] border-stone-400 text-stone-100'
        }`,
      };

    case 'retrowave':
      return {
        card: `rounded-2xl p-3 pb-3.5 border-2 ${
          isLight ? 'border-pink-400 bg-white/90 shadow-[0_0_25px_rgba(236,72,153,0.25)]' : 'border-pink-500 bg-[#150424]/90 shadow-[0_0_35px_rgba(255,0,127,0.35)]'
        }`,
        canvas: `rounded-xl border ${
          isLight ? 'border-pink-200 bg-pink-50/50' : 'border-pink-500/30 bg-black/50'
        }`,
        badge: `rounded-full border text-[10px] ${
          isLight
            ? 'border-pink-400 bg-pink-100 text-pink-800 shadow-sm'
            : 'border-pink-500 bg-[#1e0736]/90 text-pink-300 shadow-[0_0_12px_rgba(255,0,127,0.4)]'
        }`,
        title: `font-black italic tracking-wide ${
          isLight ? 'text-slate-900' : 'text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-pink-400 to-rose-400'
        }`,
        location: `text-xs ${isLight ? 'text-pink-700' : 'text-pink-300'}`,
        credit: `text-[11px] ${isLight ? 'text-pink-600' : 'text-pink-400/80'}`,
        dockContainer: `rounded-2xl border-2 backdrop-blur-md ${
          isLight ? 'bg-white/90 border-pink-400 shadow-md' : 'bg-[#1e0736]/90 border-pink-500 shadow-[0_0_25px_rgba(255,0,127,0.35)]'
        }`,
        dockBtn: `p-2 rounded-2xl border-2 transition-all cursor-pointer hover:scale-105 active:scale-95 ${
          isLight
            ? 'bg-white hover:bg-pink-50 text-slate-900 border-pink-400 shadow-sm'
            : 'bg-[#1e0736] hover:bg-pink-950/60 text-white border-pink-500 shadow-[0_0_15px_rgba(255,0,127,0.35)]'
        }`,
        dotActive: `w-6 h-2 rounded-full ${isLight ? 'bg-pink-600' : 'bg-gradient-to-r from-pink-500 to-rose-500 shadow-[0_0_10px_rgba(255,0,127,0.8)]'}`,
        dotInactive: `w-2 h-2 rounded-full ${isLight ? 'bg-pink-200' : 'bg-pink-950 border border-pink-800'}`,
        nextBtn: `rounded-xl border ${
          isLight ? 'bg-pink-50 hover:bg-pink-100 text-pink-800 border-pink-300' : 'bg-[#1e0736] hover:bg-pink-900/40 text-pink-300 border-pink-500/50'
        }`,
        stylePillContainer: `rounded-2xl border-2 text-[11px] ${
          isLight ? 'bg-white/90 border-pink-400 shadow-md text-pink-800' : 'bg-[#1e0736]/90 border-pink-500 shadow-[0_0_25px_rgba(255,0,127,0.35)] text-pink-300'
        }`,
        stylePillActive: `rounded-xl ${
          isLight ? 'bg-pink-600 text-white font-bold' : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold shadow-[0_0_12px_rgba(255,0,127,0.6)]'
        }`,
        stylePillInactive: `rounded-xl hover:bg-pink-100 dark:hover:bg-pink-950/40 opacity-70`,
        hoverHint: `rounded-full border border-pink-400 ${
          isLight ? 'bg-white/95 text-pink-900 shadow-md' : 'bg-[#1e0736] border-pink-500 text-pink-300 shadow-[0_0_20px_rgba(255,0,127,0.5)]'
        }`,
      };

    case 'neumorphic':
      return {
        card: `rounded-3xl p-3.5 pb-4 border transition-all ${
          isLight
            ? 'bg-[#e2e8f0] border-slate-300/40 shadow-[12px_12px_24px_#b8bec9,-12px_-12px_24px_#ffffff]'
            : 'bg-[#14171c] border-white/5 shadow-[12px_12px_24px_#0a0c0f,-12px_-12px_24px_#1e2229]'
        }`,
        canvas: `rounded-2xl border ${
          isLight
            ? 'border-slate-300/50 bg-[#d8dfe8] shadow-[inset_2px_2px_5px_#b8bec9,inset_-2px_-2px_5px_#ffffff]'
            : 'border-white/5 bg-[#0e1014] shadow-[inset_2px_2px_5px_#0a0c0f,inset_-2px_-2px_5px_#1e2229]'
        }`,
        badge: `rounded-xl text-[10px] font-semibold ${
          isLight
            ? 'bg-[#e2e8f0] text-slate-700 shadow-[3px_3px_6px_#b8bec9,-3px_-3px_6px_#ffffff]'
            : 'bg-[#14171c] text-neutral-300 shadow-[3px_3px_6px_#0a0c0f,-3px_-3px_6px_#1e2229]'
        }`,
        title: `font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`,
        location: `text-xs ${isLight ? 'text-slate-600' : 'text-neutral-400'}`,
        credit: `text-[11px] ${isLight ? 'text-slate-500' : 'text-neutral-400'}`,
        dockContainer: `rounded-2xl ${
          isLight ? 'bg-[#e2e8f0] shadow-[5px_5px_12px_#b8bec9,-5px_-5px_12px_#ffffff]' : 'bg-[#14171c] shadow-[5px_5px_12px_#0a0c0f,-5px_-5px_12px_#1e2229]'
        }`,
        dockBtn: `p-2 rounded-2xl transition-all cursor-pointer hover:scale-105 active:scale-95 ${
          isLight
            ? 'bg-[#e2e8f0] text-slate-800 shadow-[4px_4px_10px_#b8bec9,-4px_-4px_10px_#ffffff] active:shadow-[inset_2px_2px_5px_#b8bec9,inset_-2px_-2px_5px_#ffffff]'
            : 'bg-[#14171c] text-white shadow-[4px_4px_10px_#0a0c0f,-4px_-4px_10px_#1e2229] active:shadow-[inset_2px_2px_5px_#0a0c0f,inset_-2px_-2px_5px_#1e2229]'
        }`,
        dotActive: `w-6 h-2 rounded-full ${isLight ? 'bg-slate-700' : 'bg-neutral-200'}`,
        dotInactive: `w-2 h-2 rounded-full ${isLight ? 'bg-slate-400' : 'bg-neutral-600'}`,
        nextBtn: `rounded-xl ${
          isLight
            ? 'bg-[#e2e8f0] text-slate-800 shadow-[3px_3px_6px_#b8bec9,-3px_-3px_6px_#ffffff]'
            : 'bg-[#14171c] text-white shadow-[3px_3px_6px_#0a0c0f,-3px_-3px_6px_#1e2229]'
        }`,
        stylePillContainer: `rounded-2xl text-[11px] ${
          isLight ? 'bg-[#e2e8f0] shadow-[5px_5px_12px_#b8bec9,-5px_-5px_12px_#ffffff] text-slate-700' : 'bg-[#14171c] shadow-[5px_5px_12px_#0a0c0f,-5px_-5px_12px_#1e2229] text-neutral-300'
        }`,
        stylePillActive: `rounded-xl ${
          isLight
            ? 'bg-[#d8dfe8] font-bold text-slate-900 shadow-[inset_2px_2px_4px_#b8bec9,inset_-2px_-2px_4px_#ffffff]'
            : 'bg-[#0e1014] font-bold text-white shadow-[inset_2px_2px_4px_#0a0c0f,inset_-2px_-2px_4px_#1e2229]'
        }`,
        stylePillInactive: `rounded-xl hover:opacity-100 opacity-60`,
        hoverHint: `rounded-xl ${
          isLight
            ? 'bg-[#e2e8f0] text-slate-800 shadow-[4px_4px_10px_#b8bec9,-4px_-4px_10px_#ffffff]'
            : 'bg-[#14171c] text-neutral-100 shadow-[4px_4px_10px_#0a0c0f,-4px_-4px_10px_#1e2229]'
        }`,
      };

    case 'obsidian':
      return {
        card: `rounded-none p-3 pb-3.5 border font-mono ${
          isLight
            ? 'border-slate-300 bg-white shadow-xl text-slate-900'
            : 'border-white/[0.18] bg-[#08080c] shadow-[0_35px_80px_rgba(0,0,0,0.95)] text-[#eef0f3]'
        }`,
        canvas: `rounded-none border ${
          isLight ? 'border-slate-200 bg-slate-50' : 'border-white/[0.08] bg-[#050507]'
        }`,
        badge: `rounded-none border font-mono text-[10px] ${
          isLight ? 'border-slate-300 bg-white text-slate-800 shadow-sm' : 'border-white/20 bg-[#0f0f15] text-[#eef0f3]'
        }`,
        title: `font-mono font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-[#eef0f3]'}`,
        location: `font-mono text-xs ${isLight ? 'text-slate-500' : 'text-[#9a9da6]'}`,
        credit: `font-mono text-[11px] ${isLight ? 'text-slate-400' : 'text-[#7a7d86]'}`,
        dockContainer: `rounded-none border font-mono backdrop-blur-md ${
          isLight ? 'bg-white/90 border-slate-300 shadow-sm' : 'bg-[#0f0f15]/90 border-white/[0.14] text-[#eef0f3]'
        }`,
        dockBtn: `p-2 rounded-none border font-mono transition-all cursor-pointer hover:scale-105 active:scale-95 ${
          isLight
            ? 'bg-white hover:bg-slate-100 text-slate-900 border-slate-300 shadow-sm'
            : 'bg-[#0f0f15] hover:bg-white/10 text-white border-white/20 shadow-md'
        }`,
        dotActive: `w-6 h-2 rounded-none ${isLight ? 'bg-slate-900' : 'bg-white'}`,
        dotInactive: `w-2 h-2 rounded-none ${isLight ? 'bg-slate-300' : 'bg-white/20'}`,
        nextBtn: `rounded-none border ${
          isLight ? 'bg-white hover:bg-slate-100 text-slate-900 border-slate-300' : 'bg-[#0f0f15] hover:bg-white/10 text-white border-white/20'
        }`,
        stylePillContainer: `rounded-none border font-mono text-[11px] ${
          isLight ? 'bg-white/90 border-slate-300 shadow-sm text-slate-800' : 'bg-[#0f0f15]/90 border-white/[0.14] text-[#eef0f3]'
        }`,
        stylePillActive: `rounded-none ${isLight ? 'bg-slate-900 text-white font-bold' : 'bg-white text-black font-bold'}`,
        stylePillInactive: `rounded-none hover:bg-white/10 opacity-70`,
        hoverHint: `rounded-none border font-mono ${
          isLight ? 'bg-white border-slate-400 text-slate-900 shadow-md' : 'bg-[#0f0f15] border-white/20 text-[#eef0f3] shadow-xl'
        }`,
      };

    case 'civic':
      return {
        card: `rounded-xl p-3 pb-3.5 border-2 font-mono ${
          isLight ? 'border-slate-300 bg-white shadow-xl text-slate-900' : 'border-slate-700 bg-[#0b1120] shadow-2xl text-slate-100'
        }`,
        canvas: `rounded-lg border ${
          isLight ? 'border-slate-200 bg-slate-100' : 'border-slate-700 bg-slate-900'
        }`,
        badge: `rounded-md border font-mono text-[10px] ${
          isLight ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-emerald-500/50 bg-emerald-950/80 text-emerald-300'
        }`,
        title: `font-mono font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`,
        location: `font-mono text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`,
        credit: `font-mono text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`,
        dockContainer: `rounded-xl border font-mono backdrop-blur-md ${
          isLight ? 'bg-white/95 border-slate-300 shadow-md' : 'bg-slate-900/95 border-slate-700 shadow-md'
        }`,
        dockBtn: `p-2 rounded-xl border font-mono transition-all cursor-pointer hover:scale-105 active:scale-95 ${
          isLight
            ? 'bg-white hover:bg-slate-100 text-slate-900 border-slate-300 shadow-sm'
            : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-700 shadow-md'
        }`,
        dotActive: `w-6 h-2 rounded-md ${isLight ? 'bg-emerald-600' : 'bg-emerald-400'}`,
        dotInactive: `w-2 h-2 rounded-md ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`,
        nextBtn: `rounded-lg border ${
          isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-600'
        }`,
        stylePillContainer: `rounded-xl border font-mono text-[11px] ${
          isLight ? 'bg-white/95 border-slate-300 shadow-md text-slate-800' : 'bg-slate-900/95 border-slate-700 shadow-md text-slate-200'
        }`,
        stylePillActive: `rounded-md ${isLight ? 'bg-emerald-700 text-white font-bold' : 'bg-emerald-500 text-slate-950 font-bold'}`,
        stylePillInactive: `rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 opacity-70`,
        hoverHint: `rounded-md border font-mono ${
          isLight ? 'bg-white border-slate-300 text-slate-900 shadow-md' : 'bg-slate-900 border-slate-700 text-white shadow-md'
        }`,
      };

    case 'minimal':
      return {
        card: `rounded-xl p-2.5 pb-3 border font-sans ${
          isLight ? 'bg-white/90 border-slate-200/80 shadow-sm text-neutral-900' : 'bg-black/80 border-white/10 shadow-md text-white'
        }`,
        canvas: `rounded-lg bg-black/5 dark:bg-black/40`,
        badge: `rounded-full text-[10px] font-sans ${isLight ? 'bg-black/10 text-neutral-800' : 'bg-white/10 text-white/90'}`,
        title: `font-light tracking-tight ${isLight ? 'text-neutral-900' : 'text-white'}`,
        location: `text-xs font-light ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`,
        credit: `text-[11px] font-light ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`,
        dockContainer: `rounded-full border backdrop-blur-md ${
          isLight ? 'bg-white/70 border-black/5' : 'bg-black/60 border-white/10'
        }`,
        dockBtn: `p-2 rounded-full border backdrop-blur-md transition-all cursor-pointer hover:scale-105 active:scale-95 ${
          isLight ? 'bg-white/70 hover:bg-white text-neutral-800 border-black/5' : 'bg-black/60 hover:bg-black text-white border-white/10'
        }`,
        dotActive: `w-5 h-1.5 rounded-full ${isLight ? 'bg-neutral-800' : 'bg-white'}`,
        dotInactive: `w-1.5 h-1.5 rounded-full ${isLight ? 'bg-neutral-300' : 'bg-neutral-700'}`,
        nextBtn: `rounded-full border ${
          isLight ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-200' : 'bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700'
        }`,
        stylePillContainer: `rounded-full border backdrop-blur-md text-[11px] ${
          isLight ? 'bg-white/70 border-black/5 text-neutral-700' : 'bg-black/60 border-white/10 text-neutral-300'
        }`,
        stylePillActive: `rounded-full ${isLight ? 'bg-neutral-900 text-white font-medium' : 'bg-white text-black font-medium'}`,
        stylePillInactive: `rounded-full hover:opacity-100 opacity-50`,
        hoverHint: `rounded-full ${
          isLight ? 'bg-neutral-900 text-white' : 'bg-white/20 text-white backdrop-blur-md'
        }`,
      };

    case 'modern':
    default:
      return {
        card: `rounded-2xl md:rounded-3xl p-3 md:p-3.5 pb-3 md:pb-3.5 border ${
          isLight
            ? 'bg-white/95 border-slate-200/90 shadow-[0_22px_55px_-10px_rgba(0,0,0,0.18)] hover:shadow-[0_28px_65px_-8px_rgba(0,0,0,0.24)]'
            : 'bg-slate-900/90 backdrop-blur-xl border-white/20 shadow-[0_28px_65px_-12px_rgba(0,0,0,0.85)] hover:shadow-[0_34px_75px_-8px_rgba(0,0,0,0.95)]'
        }`,
        canvas: `rounded-xl bg-black/5 dark:bg-black/40`,
        badge: `rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white`,
        title: `font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`,
        location: `text-xs ${isLight ? 'text-slate-600' : 'text-gray-300'}`,
        credit: `text-[11px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`,
        dockContainer: `rounded-full border backdrop-blur-md ${
          isLight ? 'bg-white/80 border-black/10 shadow-md' : 'bg-slate-900/80 border-white/15 shadow-lg'
        }`,
        dockBtn: `p-2 rounded-full border backdrop-blur-md transition-all cursor-pointer hover:scale-105 active:scale-95 ${
          isLight
            ? 'bg-white/80 hover:bg-white text-slate-800 border-black/10 shadow-md'
            : 'bg-slate-900/80 hover:bg-slate-900 text-white border-white/15 shadow-lg'
        }`,
        dotActive: `w-6 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]`,
        dotInactive: `w-2 h-2 rounded-full bg-current opacity-30 hover:opacity-60`,
        nextBtn: `rounded-full border ${
          isLight
            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
            : 'bg-white/10 hover:bg-white/20 text-white border-white/15'
        }`,
        stylePillContainer: `rounded-full border backdrop-blur-md text-[11px] font-mono ${
          isLight ? 'bg-white/80 border-black/10 shadow-md text-slate-700' : 'bg-slate-900/80 border-white/15 shadow-lg text-gray-300'
        }`,
        stylePillActive: `rounded-full ${isLight ? 'bg-slate-900 text-white font-semibold' : 'bg-white/20 text-white font-semibold'}`,
        stylePillInactive: `rounded-full hover:bg-black/5 dark:hover:bg-white/10 opacity-70`,
        hoverHint: `rounded-full bg-black/70 border border-white/20 text-white`,
      };
  }
};

export const PhotoStack: React.FC<PhotoStackProps> = ({
  photos: propPhotos,
  currentIndex: propCurrentIndex,
  onNext: propOnNext,
  onPrev: propOnPrev,
  onSelectIndex: propOnSelectIndex,
  isLight: propIsLight,
  uiStyle: propUiStyle,
  className = '',
}) => {
  const dashboard = useDashboard();

  const photos = propPhotos || dashboard.photos || [dashboard.currentPhoto];
  const currentIndex = propCurrentIndex !== undefined ? propCurrentIndex : dashboard.photoIndex;
  const onNext = propOnNext || dashboard.nextPhoto;
  const onPrev = propOnPrev || dashboard.prevPhoto;
  const onSelectIndex = propOnSelectIndex || dashboard.goToPhotoIndex;
  const isLight = propIsLight !== undefined ? propIsLight : dashboard.colorMode === 'light';
  const isKioskMode = dashboard.isKioskMode;
  const uiStyle: UIStyle = propUiStyle || dashboard.uiStyle || 'modern';
  const themeClasses = getThemeClasses(uiStyle, isLight);

  const [isHovered, setIsHovered] = useState(false);
  const [stackStyle, setStackStyle] = useState<'organic' | 'cascade' | 'clean'>('organic');
  const [aspectRatioOverrides, setAspectRatioOverrides] = useState<Record<string, number>>({});

  const totalPhotos = photos.length;
  const prevIndexRef = useRef<number>(currentIndex);
  const isFirstMountRef = useRef<boolean>(true);

  // Compute adaptive card dimensions tailored directly to the photo's true original aspect ratio
  const computeCardDimensions = (aspectRatio: number) => {
    const r = Math.max(0.5, Math.min(2.5, aspectRatio || 1.6));
    const padW = 22;
    const padH = 50;

    // Expanded maximum allowances to occupy maximum space without overlapping overlays
    const maxVh = isKioskMode ? 84 : 78;
    const maxWpx = isKioskMode ? 1480 : 1380;
    const maxWvw = isKioskMode ? 94 : 90;

    if (r >= 1.35) {
      // Wide landscape (16:9, 16:10, 3:2, 21:9)
      return {
        width: `min(${maxWpx}px, ${maxWvw}vw, calc((${maxVh}vh - ${padH}px) * ${r} + ${padW}px))`,
        height: `min(${maxVh}vh, calc(((min(${maxWpx}px, ${maxWvw}vw) - ${padW}px) / ${r}) + ${padH}px))`,
      };
    } else if (r >= 0.95) {
      // Squarish or 4:3 standard
      return {
        width: `min(1100px, 86vw, calc((${maxVh}vh - ${padH}px) * ${r} + ${padW}px))`,
        height: `min(${maxVh}vh, calc(((min(1100px, 86vw) - ${padW}px) / ${r}) + ${padH}px))`,
      };
    } else {
      // Portrait / vertical (e.g. 2:3, 3:4, 9:16)
      const portraitVh = isKioskMode ? 86 : 81;
      return {
        width: `min(680px, 78vw, calc((min(${portraitVh}vh, 940px) - ${padH}px) * ${r} + ${padW}px))`,
        height: `min(${portraitVh}vh, 940px)`,
      };
    }
  };

  // Helper to generate realistic natural scatter angles for physical photo prints
  const getFallAngle = (idx: number) => ((idx * 7) % 11 - 5) * 1.5; // e.g. -6deg, +4.5deg
  const getLandAngle = (idx: number) => ((idx * 5) % 7 - 3) * 0.5; // e.g. -0.5deg, +1.0deg

  // Maintain stack cards in order: [depth 3, depth 2, depth 1, depth 0 (top)]
  const [stackCards, setStackCards] = useState<StackCardItem[]>(() => {
    if (totalPhotos === 0) return [];

    const depthCount = Math.min(4, totalPhotos);
    const initial: StackCardItem[] = [];

    // Pre-populate resting cards under the top card
    for (let d = depthCount - 1; d >= 0; d--) {
      const pIdx = (currentIndex - d + totalPhotos * 10) % totalPhotos;
      const photo = photos[pIdx] || photos[0];
      initial.push({
        photo,
        photoIdx: pIdx,
        id: `init-${photo.id}-${d}`,
        isEntering: false,
        isExiting: false,
        fallAngle: getFallAngle(pIdx),
        landAngle: getLandAngle(pIdx),
      });
    }
    return initial;
  });

  // Preload upcoming photos into browser cache to guarantee instantaneous paint
  useEffect(() => {
    if (totalPhotos <= 1) return;
    const nextIdx1 = (currentIndex + 1) % totalPhotos;
    const nextIdx2 = (currentIndex + 2) % totalPhotos;
    [photos[nextIdx1], photos[nextIdx2]].forEach((p) => {
      if (p?.url) {
        const img = new Image();
        img.src = p.url;
      }
    });
  }, [currentIndex, photos, totalPhotos]);

  // Handle when currentIndex changes: drop new photo on top of the stack!
  useEffect(() => {
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      prevIndexRef.current = currentIndex;
      return;
    }

    const prevIdx = prevIndexRef.current;
    if (prevIdx === currentIndex || totalPhotos === 0) return;

    const newPhoto = photos[currentIndex];
    if (!newPhoto) return;

    // Detect if this was a backward step (previous photo)
    const isBackward =
      (prevIdx - 1 + totalPhotos) % totalPhotos === currentIndex && totalPhotos > 1;

    if (isBackward) {
      // BACKWARD: Top card lifts up and flies away back into the air
      setStackCards((prev) => {
        if (prev.length === 0) return prev;
        const lastIdx = prev.length - 1;
        const updated = [...prev];
        updated[lastIdx] = { ...updated[lastIdx], isExiting: true };
        return updated;
      });

      // After lift animation completes, remove the exited card
      const timer = setTimeout(() => {
        setStackCards((prev) => {
          const filtered = prev.filter((c) => !c.isExiting);
          // If fewer than 3 cards remain, backfill an older card underneath
          if (filtered.length < 3 && totalPhotos > filtered.length) {
            const oldestIdx = filtered[0]?.photoIdx ?? currentIndex;
            const backfillIdx = (oldestIdx - 1 + totalPhotos) % totalPhotos;
            const backfillPhoto = photos[backfillIdx];
            if (backfillPhoto) {
              return [
                {
                  photo: backfillPhoto,
                  photoIdx: backfillIdx,
                  id: `backfill-${backfillPhoto.id}-${Date.now()}`,
                  isEntering: false,
                  isExiting: false,
                  fallAngle: getFallAngle(backfillIdx),
                  landAngle: getLandAngle(backfillIdx),
                },
                ...filtered,
              ];
            }
          }
          return filtered;
        });
      }, 450);

      prevIndexRef.current = currentIndex;
      return () => clearTimeout(timer);
    }

    // FORWARD / NORMAL: Physical drop of new photo on top of the stack!
    const newCardId = `card-${newPhoto.id}-${Date.now()}`;
    const newCard: StackCardItem = {
      photo: newPhoto,
      photoIdx: currentIndex,
      id: newCardId,
      isEntering: true, // starts suspended high above the viewport!
      isExiting: false,
      fallAngle: getFallAngle(currentIndex),
      landAngle: getLandAngle(currentIndex),
    };

    // Keep up to 3 resting cards underneath and place the new falling card on top
    setStackCards((prev) => {
      const resting = prev.filter((c) => !c.isExiting).slice(-3);
      return [...resting, newCard];
    });

    // In the next frame, release the card so physics gravity drops it onto the stack!
    const dropFrame = requestAnimationFrame(() => {
      // Short delay ensures initial transform translates above viewport before transition triggers
      setTimeout(() => {
        setStackCards((prev) =>
          prev.map((c) => (c.id === newCardId ? { ...c, isEntering: false } : c))
        );
      }, 25);
    });

    prevIndexRef.current = currentIndex;
    return () => cancelAnimationFrame(dropFrame);
  }, [currentIndex, photos, totalPhotos]);

  // Compute CSS transform and visual layers based on stack depth
  const getCardTransformStyle = (card: StackCardItem, depthFromTop: number) => {
    // 1. Airborne Falling Card (Entering from above)
    if (card.isEntering) {
      return {
        transform: `translate3d(0, -135%, 0) rotate(${card.fallAngle}deg) scale(1.12)`,
        zIndex: 40,
        opacity: 0,
        boxShadow: '0 45px 90px -10px rgba(0,0,0,0.65)',
        transition: 'none',
      };
    }

    // 2. Airborne Lifting Card (Exiting when going backwards)
    if (card.isExiting) {
      return {
        transform: `translate3d(0, -135%, 0) rotate(${-card.fallAngle}deg) scale(1.12)`,
        zIndex: 40,
        opacity: 0,
        boxShadow: '0 45px 90px -10px rgba(0,0,0,0.65)',
        transition: 'transform 480ms cubic-bezier(0.32, 0, 0.67, 0), opacity 320ms ease-in',
      };
    }

    // 3. Resting Top Card (Depth 0 - Just landed on the stack!)
    if (depthFromTop === 0) {
      return {
        transform: `translate3d(0, 0, 0) rotate(${card.landAngle}deg) scale(1)`,
        zIndex: 30,
        opacity: 1,
        transition:
          'transform 750ms cubic-bezier(0.16, 1, 0.3, 1), opacity 400ms ease-out, box-shadow 750ms ease-out',
      };
    }

    // 4. Stepped Depth Cards Underneath
    if (stackStyle === 'clean') {
      const yOffset = depthFromTop * 9;
      const scale = 1 - depthFromTop * 0.04;
      return {
        transform: `translate3d(0, ${yOffset}px, 0) rotate(0deg) scale(${scale})`,
        zIndex: 30 - depthFromTop,
        opacity: Math.max(0.45, 1 - depthFromTop * 0.16),
        transition: 'transform 650ms cubic-bezier(0.16, 1, 0.3, 1), opacity 450ms ease-out',
      };
    }

    if (stackStyle === 'cascade') {
      const xOffset = depthFromTop * (isHovered ? 24 : 16);
      const yOffset = depthFromTop * (isHovered ? 16 : 10);
      const rotate = depthFromTop * 2.5;
      const scale = 1 - depthFromTop * 0.04;
      return {
        transform: `translate3d(${xOffset}px, ${yOffset}px, 0) rotate(${rotate}deg) scale(${scale})`,
        zIndex: 30 - depthFromTop,
        opacity: Math.max(0.45, 1 - depthFromTop * 0.16),
        transition: 'transform 650ms cubic-bezier(0.16, 1, 0.3, 1), opacity 450ms ease-out',
      };
    }

    // Default: 'organic' physical desk scatter
    const scatterOffsets = [
      { x: 0, y: 0, rot: 0, s: 1 },
      { x: isHovered ? 20 : 12, y: isHovered ? 14 : 9, rot: isHovered ? 5.5 : 4, s: 0.96 },
      { x: isHovered ? -24 : -15, y: isHovered ? 22 : 16, rot: isHovered ? -6 : -4.5, s: 0.92 },
      { x: isHovered ? 12 : 8, y: isHovered ? 30 : 22, rot: isHovered ? 3 : 2, s: 0.88 },
    ];

    const offset = scatterOffsets[depthFromTop] || scatterOffsets[scatterOffsets.length - 1];
    return {
      transform: `translate3d(${offset.x}px, ${offset.y}px, 0) rotate(${offset.rot}deg) scale(${offset.s})`,
      zIndex: 30 - depthFromTop,
      opacity: Math.max(0.45, 1 - depthFromTop * 0.16),
      transition: 'transform 650ms cubic-bezier(0.16, 1, 0.3, 1), opacity 450ms ease-out',
    };
  };

  const activeTopCard = stackCards[stackCards.length - 1];

  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-center p-1 sm:p-2 md:p-3 select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Central Stack Stage Container with Rock-Solid Responsive Dimensions */}
      <div
        className="relative max-w-full flex items-center justify-center pointer-events-auto"
        style={{
          width: isKioskMode ? 'min(1480px, 95vw)' : 'min(1400px, 92vw)',
          height: isKioskMode ? '84vh' : '79vh',
        }}
      >
        {/* Render Stack Cards from Oldest (Bottom) to Newest (Top) */}
        {stackCards.map((card, idxInStack) => {
          const depthFromTop = stackCards.length - 1 - idxInStack;
          const isTop = depthFromTop === 0 && !card.isExiting;
          const style = getCardTransformStyle(card, depthFromTop);
          const effectiveRatio =
            aspectRatioOverrides[card.photo.id] || card.photo.aspectRatio || 1.6;
          const cardDimensions = computeCardDimensions(effectiveRatio);

          return (
            <div
              key={card.id}
              onClick={() => {
                if (isTop) {
                  onNext();
                } else if (!card.isExiting && !card.isEntering) {
                  onSelectIndex?.(card.photoIdx);
                }
              }}
              style={{
                ...style,
                width: cardDimensions.width,
                height: cardDimensions.height,
              }}
              className={`absolute inset-0 m-auto cursor-pointer flex flex-col justify-between overflow-hidden ${themeClasses.card}`}
            >
              {/* Image Canvas Container - Exact Original Aspect Ratio Display */}
              <div className={`relative w-full flex-1 min-h-0 overflow-hidden flex items-center justify-center group ${themeClasses.canvas}`}>
                {/* 4 Tech Corner Reticle Brackets for Tactical HUD Theme */}
                {uiStyle === 'hud' && (
                  <>
                    <span style={{ borderColor: 'var(--color-accent, #00f0ff)' }} className="absolute -top-[2px] -left-[2px] w-3.5 h-3.5 border-t-2 border-l-2 z-20 pointer-events-none" />
                    <span style={{ borderColor: 'var(--color-accent, #00f0ff)' }} className="absolute -top-[2px] -right-[2px] w-3.5 h-3.5 border-t-2 border-r-2 z-20 pointer-events-none" />
                    <span style={{ borderColor: 'var(--color-accent, #00f0ff)' }} className="absolute -bottom-[2px] -left-[2px] w-3.5 h-3.5 border-b-2 border-l-2 z-20 pointer-events-none" />
                    <span style={{ borderColor: 'var(--color-accent, #00f0ff)' }} className="absolute -bottom-[2px] -right-[2px] w-3.5 h-3.5 border-b-2 border-r-2 z-20 pointer-events-none" />
                  </>
                )}

                <img
                  src={card.photo.url}
                  alt={card.photo.title}
                  style={{ aspectRatio: effectiveRatio }}
                  loading={depthFromTop < 2 ? 'eager' : 'lazy'}
                  onLoad={(e) => {
                    const img = e.currentTarget;
                    if (img.naturalWidth && img.naturalHeight) {
                      const naturalRatio = img.naturalWidth / img.naturalHeight;
                      if (Math.abs(naturalRatio - effectiveRatio) > 0.04) {
                        setAspectRatioOverrides((prev) => ({
                          ...prev,
                          [card.photo.id]: naturalRatio,
                        }));
                      }
                    }
                  }}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.triedFallback) {
                      target.dataset.triedFallback = 'true';
                      target.src = '/photos/image-1-daveyr-seasparkle-1000.jpg';
                    }
                  }}
                  className="w-full h-full object-contain drop-shadow-sm"
                />

                {/* Top-Right Stack Counter Badge on Active Top Card */}
                {isTop && (
                  <div className={`absolute top-2.5 right-2.5 z-20 flex items-center space-x-1.5 px-2.5 py-1 pointer-events-none ${themeClasses.badge}`}>
                    <Layers
                      size={11}
                      className={
                        uiStyle === 'tui'
                          ? 'text-green-400'
                          : uiStyle === 'hud'
                          ? 'text-cyan-400'
                          : uiStyle === 'retrowave'
                          ? 'text-pink-400'
                          : uiStyle === 'civic'
                          ? 'text-emerald-500'
                          : 'text-amber-400'
                      }
                    />
                    <span>
                      {card.photoIdx + 1} / {totalPhotos}
                    </span>
                  </div>
                )}

                {/* Tap to Drop Next Card Hover Overlay Hint on Top Card */}
                {isTop && isHovered && (
                  <div className="absolute inset-0 z-20 bg-black/25 backdrop-blur-[1px] opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <span className={`px-3.5 py-1.5 text-xs font-medium tracking-wide flex items-center space-x-1.5 shadow-xl ${themeClasses.hoverHint}`}>
                      <Sparkles size={13} className="text-amber-300 animate-pulse" />
                      <span>Click to drop next photo</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Bezel: Photographic Print Caption Area */}
              <div className="pt-2.5 px-1 shrink-0 flex items-center justify-between text-left">
                <div className="min-w-0 pr-3">
                  <h3 className={`text-sm md:text-base truncate ${themeClasses.title}`}>
                    {card.photo.title}
                  </h3>
                  <div className="flex items-center space-x-3 mt-0.5 text-xs">
                    {card.photo.location && (
                      <span className={`flex items-center truncate ${themeClasses.location}`}>
                        <MapPin
                          size={11}
                          className="mr-1 shrink-0"
                          style={{ color: 'var(--color-accent, #38bdf8)' }}
                        />
                        <span className="truncate">{card.photo.location}</span>
                      </span>
                    )}
                    {card.photo.credit && (
                      <span className={`hidden sm:flex items-center truncate ${themeClasses.credit}`}>
                        <Camera size={10} className="mr-1 shrink-0" />
                        <span className="truncate">{card.photo.credit}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Next Arrow Hint Button on Top Card */}
                {isTop && (
                  <div
                    className={`shrink-0 w-8 h-8 flex items-center justify-center transition-all cursor-pointer ${themeClasses.nextBtn}`}
                    title="Drop next photo"
                  >
                    <ChevronRight size={15} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Stack Navigation Dock & Controls Below the Stack */}
      {!isKioskMode && (
        <div className="mt-2.5 sm:mt-3.5 relative z-30 flex items-center space-x-3 pointer-events-auto shrink-0">
          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            title="Previous Photo"
            aria-label="Previous Photo"
            className={themeClasses.dockBtn}
          >
            <ChevronLeft size={16} />
          </button>

          {/* Stack Dots Pagination */}
          <div className={`flex items-center space-x-1.5 px-3 py-1.5 ${themeClasses.dockContainer}`}>
            {photos.map((p, idx) => {
              const isActive = idx === (activeTopCard?.photoIdx ?? currentIndex);
              return (
                <button
                  key={p.id || idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectIndex?.(idx);
                  }}
                  title={p.title}
                  aria-label={p.title}
                  className={`transition-all duration-300 cursor-pointer ${
                    isActive ? themeClasses.dotActive : themeClasses.dotInactive
                  }`}
                />
              );
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            title="Next Photo (Drop on stack)"
            aria-label="Next Photo"
            className={themeClasses.dockBtn}
          >
            <ChevronRight size={16} />
          </button>

          {/* Stack Style Scatter Selector Pill */}
          <div className={`hidden sm:flex items-center space-x-1 p-1 ${themeClasses.stylePillContainer}`}>
            {(['organic', 'cascade', 'clean'] as const).map((style) => (
              <button
                key={style}
                onClick={(e) => {
                  e.stopPropagation();
                  setStackStyle(style);
                }}
                className={`px-2.5 py-0.5 capitalize cursor-pointer transition-all ${
                  stackStyle === style ? themeClasses.stylePillActive : themeClasses.stylePillInactive
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
