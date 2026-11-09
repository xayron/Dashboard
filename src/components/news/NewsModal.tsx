import React, { useState } from 'react';
import {
  X,
  Newspaper,
  RotateCcw,
  ExternalLink,
  Flame,
  Globe,
  Cpu,
  TrendingUp,
  FlaskConical,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useDashboard } from '../../state/DashboardContext';
import type { NewsCategory } from '../../types/dashboard';

const CATEGORIES: Array<{ id: NewsCategory; label: string; icon: React.ReactNode }> = [
  { id: 'All', label: 'All Headlines', icon: <Newspaper size={13} /> },
  { id: 'Top Stories', label: 'Top Stories', icon: <Flame size={13} className="text-amber-500" /> },
  { id: 'Tech', label: 'Technology', icon: <Cpu size={13} className="text-cyan-500" /> },
  { id: 'Business', label: 'Markets & Finance', icon: <TrendingUp size={13} className="text-emerald-500" /> },
  { id: 'World', label: 'World News', icon: <Globe size={13} className="text-blue-500" /> },
  { id: 'Science', label: 'Science & Discovery', icon: <FlaskConical size={13} className="text-purple-500" /> },
];

export const NewsModal: React.FC = () => {
  const {
    isNewsOpen,
    setIsNewsOpen,
    news,
    newsCategory,
    setNewsCategory,
    refreshNews,
    uiStyle,
    colorMode,
  } = useDashboard();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const isLight = colorMode === 'light';

  if (!isNewsOpen) return null;

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

  const isTui = uiStyle === 'tui';
  const isHud = uiStyle === 'hud';
  const isBrutalist = uiStyle === 'brutalist';
  const isEink = uiStyle === 'eink';
  const isRetrowave = uiStyle === 'retrowave';
  const isCivic = uiStyle === 'civic';

  const fontClass = isTui || isHud ? 'font-mono' : isEink || isCivic ? 'font-serif' : 'font-sans';

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/75 backdrop-blur-md select-none animate-in fade-in duration-200 ${fontClass}`}>
      <div
        className={`w-full max-w-4xl max-h-[88vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl border transition-all ${
          isTui
            ? (isLight ? 'bg-white border-2 border-black text-black' : 'bg-black border-2 border-green-500 text-green-400 font-mono shadow-[0_0_30px_rgba(34,197,94,0.2)]')
            : isBrutalist
            ? (isLight ? 'bg-white border-4 border-black shadow-[10px_10px_0px_#000] text-black' : 'bg-black border-4 border-white shadow-[10px_10px_0px_#fff] text-white')
            : isEink
            ? (isLight ? 'bg-[#f4efe6] border-2 border-stone-800 text-stone-900 shadow-xl' : 'bg-[#1c1917] border-2 border-stone-600 text-stone-100 shadow-xl')
            : isRetrowave
            ? (isLight ? 'bg-pink-50 border-2 border-pink-400 text-slate-900' : 'bg-[#18032b] border-2 border-pink-500 shadow-[0_0_35px_rgba(236,72,153,0.3)] text-pink-100')
            : isLight
            ? 'bg-white/95 border-black/10 text-slate-900 shadow-[0_25px_60px_rgba(0,0,0,0.15)]'
            : 'bg-slate-950/95 border-white/15 text-white shadow-[0_25px_60px_rgba(0,0,0,0.7)]'
        }`}
      >
        {/* Header Bar */}
        <div className={`p-5 px-6 border-b flex items-center justify-between ${
          isLight ? 'border-black/10 bg-black/[0.02]' : 'border-white/10 bg-white/[0.02]'
        }`}>
          <div className="flex items-center space-x-3">
            <div
              className="p-2.5 rounded-2xl flex items-center justify-center"
              style={{
                backgroundColor: 'var(--theme-accent-soft, rgba(59, 130, 246, 0.15))',
                color: 'var(--color-accent, #3b82f6)',
              }}
            >
              <Newspaper size={22} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold tracking-tight">Top News & Intelligence</h2>
                <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Live Feed</span>
                </span>
              </div>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                Curated breaking headlines across global affairs, markets, and technology
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh News Feed"
              className={`p-2 rounded-xl border transition-all flex items-center space-x-1.5 text-xs font-semibold ${
                isLight
                  ? 'border-black/10 bg-black/5 hover:bg-black/10 text-slate-700'
                  : 'border-white/10 bg-white/5 hover:bg-white/10 text-gray-200'
              }`}
            >
              <RotateCcw size={14} className={isRefreshing ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={() => setIsNewsOpen(false)}
              className={`p-2 rounded-xl transition-all ${
                isLight ? 'hover:bg-black/5 text-slate-500 hover:text-black' : 'hover:bg-white/10 text-gray-400 hover:text-white'
              }`}
              title="Close (Esc)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className={`px-6 py-3 border-b flex items-center space-x-2 overflow-x-auto no-scrollbar ${
          isLight ? 'border-black/5 bg-black/[0.01]' : 'border-white/5 bg-white/[0.01]'
        }`}>
          {CATEGORIES.map(cat => {
            const isSelected = newsCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setNewsCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                  isSelected
                    ? 'shadow-sm ring-1'
                    : (isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-black/5' : 'text-gray-400 hover:text-white hover:bg-white/5')
                }`}
                style={
                  isSelected
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
                {isSelected && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                    {filteredNews.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* News Headlines List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3.5">
          {filteredNews.length === 0 ? (
            <div className={`py-12 text-center text-sm ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>
              No news headlines available in this category.
            </div>
          ) : (
            filteredNews.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  isLight
                    ? 'bg-black/[0.02] border-black/[0.08] hover:border-black/20 hover:bg-black/[0.04]'
                    : 'bg-white/[0.03] border-white/10 hover:border-white/25 hover:bg-white/[0.06]'
                } ${item.isBreaking ? 'ring-1 ring-amber-500/50' : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1.5">
                      {item.isBreaking && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-rose-500/20 text-rose-500 border border-rose-500/30 flex items-center space-x-1">
                          <Flame size={10} />
                          <span>Breaking</span>
                        </span>
                      )}
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        isLight ? 'bg-slate-200 text-slate-700' : 'bg-white/10 text-gray-300'
                      }`}>
                        {item.category}
                      </span>
                      <span className={`text-[11px] font-semibold ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
                        {item.source}
                      </span>
                      <span className={`text-[11px] flex items-center ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>
                        <Clock size={10} className="mr-1" />
                        {item.time}
                      </span>
                    </div>

                    <h3 className={`text-sm sm:text-base font-bold leading-snug ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}>
                      {item.title}
                    </h3>

                    {(item.snippet || item.summary) && (
                      <p className={`text-xs mt-1.5 line-clamp-2 leading-relaxed ${
                        isLight ? 'text-slate-600' : 'text-gray-300'
                      }`}>
                        {item.snippet || item.summary}
                      </p>
                    )}
                  </div>

                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 rounded-xl border shrink-0 transition-all ${
                        isLight
                          ? 'border-black/10 hover:bg-black/5 text-slate-500 hover:text-black'
                          : 'border-white/10 hover:bg-white/10 text-gray-400 hover:text-white'
                      }`}
                      title="Open full coverage"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info bar */}
        <div className={`p-3 px-6 border-t flex items-center justify-between text-xs ${
          isLight ? 'border-black/10 bg-black/[0.02] text-slate-500' : 'border-white/10 bg-white/[0.02] text-gray-400'
        }`}>
          <span>Displaying {filteredNews.length} verified news reports • Updates every 15 minutes</span>
          <span className="font-mono text-[11px]">Press 'N' or ESC to toggle</span>
        </div>
      </div>
    </div>
  );
};
