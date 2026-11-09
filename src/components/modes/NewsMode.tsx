import React, { useState } from 'react';
import {
  Newspaper,
  Flame,
  Globe,
  Cpu,
  TrendingUp,
  FlaskConical,
  Clock,
  RotateCcw,
  ExternalLink,
  Radio,
  Bookmark,
  Share2,
  Sparkles,
  X,
} from 'lucide-react';
import { useDashboard } from '../../state/DashboardContext';
import type { NewsCategory, NewsItem } from '../../types/dashboard';

const CATEGORIES: Array<{ id: NewsCategory; label: string; icon: React.ReactNode }> = [
  { id: 'All', label: 'All News', icon: <Newspaper size={13} /> },
  { id: 'Top Stories', label: 'Top Stories', icon: <Flame size={13} className="text-amber-500" /> },
  { id: 'Tech', label: 'Technology', icon: <Cpu size={13} className="text-cyan-500" /> },
  { id: 'Business', label: 'Markets', icon: <TrendingUp size={13} className="text-emerald-500" /> },
  { id: 'World', label: 'World Affairs', icon: <Globe size={13} className="text-blue-500" /> },
  { id: 'Science', label: 'Science', icon: <FlaskConical size={13} className="text-purple-500" /> },
];

export const NewsMode: React.FC = () => {
  const {
    news,
    newsCategory,
    setNewsCategory,
    refreshNews,
    setManualOverrideMode,
    colorMode,
    uiStyle,
  } = useDashboard();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const isLight = colorMode === 'light';

  const isTui = uiStyle === 'tui';
  const isHud = uiStyle === 'hud';
  const isBrutalist = uiStyle === 'brutalist';
  const isEink = uiStyle === 'eink';
  const isRetrowave = uiStyle === 'retrowave';
  const isCivic = uiStyle === 'civic';

  const fontClass = isTui || isHud ? 'font-mono' : isEink ? 'font-serif' : 'font-sans';

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshNews();
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  const filteredNews = newsCategory === 'All'
    ? news
    : news.filter(item => item.category === newsCategory);

  const third = Math.max(1, Math.ceil(filteredNews.length / 3));
  const col1Stories = filteredNews.slice(0, third);
  const col2Stories = filteredNews.slice(third, third * 2);
  const col3Stories = filteredNews.slice(third * 2);

  const renderStoryCard = (item: NewsItem, isFeaturedLead = false) => {
    return (
      <div
        key={item.id}
        className={`p-3 rounded-2xl border transition-all ${
          isFeaturedLead
            ? (isLight ? 'bg-black/[0.04] border-black/20 shadow-md ring-1 ring-black/10' : 'bg-white/[0.06] border-white/20 shadow-lg ring-1 ring-white/10')
            : (isLight ? 'glass-panel hover:border-black/20 hover:bg-black/[0.02]' : 'glass-panel hover:border-white/25 hover:bg-white/[0.04]')
        } ${
          isBrutalist
            ? (isLight ? 'border-2 border-black bg-white shadow-[2px_2px_0px_#000]' : 'border-2 border-white bg-black shadow-[2px_2px_0px_#fff]')
            : isEink
            ? (isLight ? 'border border-stone-700 bg-[#ede8df]' : 'border border-stone-600 bg-[#292524]')
            : ''
        }`}
        style={{
          borderColor: isBrutalist || isEink ? undefined : 'var(--color-panel-border, rgba(255, 255, 255, 0.12))',
        }}
      >
        <div className="flex items-center justify-between text-[10px] mb-1">
          <div className="flex items-center space-x-1.5 min-w-0">
            {item.isBreaking ? (
              <span className="px-1.5 py-0.2 rounded font-extrabold uppercase text-[9px] bg-rose-500/20 text-rose-500 border border-rose-500/30 flex items-center space-x-0.5">
                <Flame size={9} />
                <span>Breaking</span>
              </span>
            ) : (
              <span className={`px-1.5 py-0.2 rounded font-bold uppercase text-[9px] ${
                isLight ? 'bg-slate-200 text-slate-700' : 'bg-white/10 text-gray-300'
              }`}>
                {item.category}
              </span>
            )}
            <span className={`font-semibold truncate max-w-[130px] ${isLight ? 'text-slate-700' : 'text-gray-200'}`}>
              {item.source}
            </span>
          </div>

          <span className={`text-[10px] shrink-0 ${isLight ? 'text-slate-400' : 'text-gray-400'}`}>
            {item.time}
          </span>
        </div>

        <h3 className={`${isFeaturedLead ? 'text-xs sm:text-sm font-black' : 'text-xs font-bold'} leading-snug line-clamp-2 ${
          isLight ? 'text-slate-900' : 'text-white'
        }`}>
          {item.title}
        </h3>

        {(item.snippet || item.summary) && (
          <p className={`text-[11px] mt-1 line-clamp-2 leading-relaxed opacity-85 ${
            isLight ? 'text-slate-600' : 'text-gray-300'
          }`}>
            {item.snippet || item.summary}
          </p>
        )}

        {item.url && (
          <div className={`mt-1.5 pt-1.5 border-t flex justify-end text-[10px] ${
            isLight ? 'border-black/5' : 'border-white/5'
          }`}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:underline flex items-center space-x-0.5 ${
                isLight ? 'text-blue-600' : 'text-blue-400'
              }`}
              style={{ color: 'var(--color-accent)' }}
            >
              <span>Read Story</span>
              <ExternalLink size={9} />
            </a>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`w-full h-full p-6 sm:p-8 flex flex-col justify-between overflow-hidden bg-transparent select-none ${fontClass} ${
      isLight ? 'text-slate-900' : 'text-white'
    }`}>
      {/* 1. TOP HEADER & CATEGORY FILTER BAR */}
      <div className={`flex items-center justify-between pb-3 mb-3 border-b ${
        isTui
          ? (isLight ? 'border-black' : 'border-green-500/50')
          : isBrutalist
          ? (isLight ? 'border-b-4 border-black' : 'border-b-4 border-white')
          : isEink
          ? (isLight ? 'border-stone-800' : 'border-stone-600')
          : (isLight ? 'border-black/[0.08]' : 'border-white/10')
      }`}>
        <div className="flex items-center space-x-3">
          <div
            className={`p-2 rounded-2xl border flex items-center justify-center ${
              isBrutalist
                ? (isLight ? 'border-2 border-black shadow-[3px_3px_0px_#000]' : 'border-2 border-white shadow-[3px_3px_0px_#fff]')
                : isEink
                ? (isLight ? 'border-2 border-stone-800 bg-[#ede8df]' : 'border-2 border-stone-500 bg-[#292524]')
                : 'glass-panel shadow-md'
            }`}
            style={{
              backgroundColor: isBrutalist || isEink ? undefined : 'var(--theme-accent-soft, rgba(59, 130, 246, 0.15))',
              borderColor: isBrutalist || isEink ? undefined : 'var(--color-panel-border, rgba(255, 255, 255, 0.15))',
              color: 'var(--color-accent, #3b82f6)',
            }}
          >
            <Newspaper size={18} />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight uppercase">
                {isTui ? 'GLOBAL_DISPATCH_WIRE' : isEink ? 'The Morning Dispatch' : 'Global Intelligence & News'}
              </h1>
              <span className="flex items-center space-x-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Feed</span>
              </span>
            </div>
            <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
              Real-time headlines and verified reporting across geopolitics, tech, and markets
            </p>
          </div>
        </div>

        {/* Categories Bar & Controls */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar">
            {CATEGORIES.map(cat => {
              const isSelected = newsCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setNewsCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                    isSelected
                      ? (isBrutalist
                          ? 'bg-black text-white border-2 border-black font-black'
                          : 'shadow-md ring-1')
                      : (isLight
                          ? 'text-slate-600 hover:text-slate-900 hover:bg-black/5'
                          : 'text-gray-400 hover:text-white hover:bg-white/5')
                  }`}
                  style={
                    isSelected && !isBrutalist
                      ? {
                          backgroundColor: 'var(--color-accent, #3b82f6)',
                          color: 'var(--color-accent-contrast, #ffffff)',
                          borderColor: 'var(--color-accent, #3b82f6)',
                        }
                      : undefined
                  }
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            title="Refresh Feed"
            className={`p-1.5 px-2.5 rounded-xl border transition-all flex items-center space-x-1 text-xs font-semibold ${
              isBrutalist
                ? (isLight ? 'border-2 border-black bg-white shadow-[2px_2px_0px_#000]' : 'border-2 border-white bg-black shadow-[2px_2px_0px_#fff]')
                : (isLight ? 'border-black/10 bg-black/5 hover:bg-black/10' : 'border-white/10 bg-white/5 hover:bg-white/10')
            }`}
          >
            <RotateCcw size={12} className={isRefreshing ? 'animate-spin' : ''} />
            <span className="hidden md:inline">Sync</span>
          </button>

          <button
            onClick={() => setManualOverrideMode(null)}
            title="Return to Dashboard"
            className={`p-1.5 px-2.5 rounded-xl border transition-all flex items-center space-x-1 text-xs font-semibold cursor-pointer ${
              isBrutalist
                ? (isLight ? 'border-2 border-black bg-white hover:bg-gray-100 shadow-[2px_2px_0px_#000]' : 'border-2 border-white bg-black hover:bg-white/10 shadow-[2px_2px_0px_#fff]')
                : (isLight ? 'border-black/10 bg-black/5 hover:bg-black/10 text-slate-700' : 'border-white/10 bg-white/5 hover:bg-white/10 text-gray-300')
            }`}
          >
            <X size={12} />
            <span className="hidden md:inline">Exit</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN 3-COLUMN VERTICAL STACKS (NO HORIZONTAL SUBDIVISIONS) */}
      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
        {/* Column 1 (Cols 1-4): Breaking & Lead Wire (Pure Vertical Stack) */}
        <div className="col-span-4 flex flex-col space-y-2 min-h-0 h-full">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider flex items-center space-x-1" style={{ color: 'var(--color-accent)' }}>
              <Flame size={12} className="text-rose-500" />
              <span>Breaking & Lead Wire</span>
            </span>
            <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
              {col1Stories.length} Reports
            </span>
          </div>

          <div className="space-y-2 overflow-y-auto pr-1 flex-1">
            {col1Stories.map((item, idx) => renderStoryCard(item, idx === 0))}
          </div>
        </div>

        {/* Column 2 (Cols 5-8): Top Stories & Markets (Pure Vertical Stack) */}
        <div className="col-span-4 flex flex-col space-y-2 min-h-0 h-full">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-accent)' }}>
              Top Stories & Markets
            </span>
            <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
              {col2Stories.length} Reports
            </span>
          </div>

          <div className="space-y-2 overflow-y-auto pr-1 flex-1">
            {col2Stories.map((item) => renderStoryCard(item, false))}
          </div>
        </div>

        {/* Column 3 (Cols 9-12): Global Intelligence & Briefings (Pure Vertical Stack) */}
        <div className="col-span-4 flex flex-col space-y-2 min-h-0 h-full">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-accent)' }}>
              Global Wire & Briefings
            </span>
            <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
              {col3Stories.length} Reports
            </span>
          </div>

          <div className="space-y-2 overflow-y-auto pr-1 flex-1">
            {col3Stories.map((item) => renderStoryCard(item, false))}
          </div>
        </div>
      </div>

      {/* 3. Bottom Status Strip */}
      <div className={`mt-3 pt-2 border-t flex items-center justify-between text-[11px] ${
        isLight ? 'border-black/10 text-slate-500' : 'border-white/10 text-gray-400'
      }`}>
        <span className="font-medium">
          Displaying {filteredNews.length} verified news reports across {newsCategory} wire
        </span>
        <span className="font-mono font-bold" style={{ color: 'var(--color-accent)' }}>
          POLLING EVERY 15 MIN • PRESS 'N' TO TOGGLE
        </span>
      </div>
    </div>
  );
};
