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
import type { NewsCategory } from '../../types/dashboard';

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

  const fontClass = isTui || isHud ? 'font-mono' : isEink || isCivic ? 'font-serif' : 'font-sans';

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

  const featuredStory = filteredNews[0] || news[0];
  const secondaryStories = filteredNews.slice(1, 3);
  const centerStories = filteredNews.slice(3, 8);
  const sideStories = filteredNews.slice(8, 16);

  return (
    <div className={`w-full h-full p-8 flex flex-col justify-between overflow-hidden bg-transparent select-none ${fontClass} ${
      isLight ? 'text-slate-900' : 'text-white'
    }`}>
      {/* 1. TOP HEADER & CATEGORY FILTER BAR */}
      <div className={`flex items-center justify-between pb-4 mb-4 border-b ${
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
            className={`p-2.5 rounded-2xl border flex items-center justify-center ${
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
            <Newspaper size={20} />
          </div>

          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-lg font-bold tracking-tight uppercase">
                {isTui ? 'GLOBAL_DISPATCH_WIRE' : isEink ? 'The Morning Dispatch' : 'Global Intelligence & News'}
              </h1>
              <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Feed</span>
              </span>
            </div>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
              Real-time headlines and curated briefings across geopolitics, tech, and markets
            </p>
          </div>
        </div>

        {/* Categories Bar & Refresh */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
            {CATEGORIES.map(cat => {
              const isSelected = newsCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setNewsCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
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
            className={`p-2 rounded-xl border transition-all flex items-center space-x-1 text-xs font-semibold ${
              isBrutalist
                ? (isLight ? 'border-2 border-black bg-white shadow-[2px_2px_0px_#000]' : 'border-2 border-white bg-black shadow-[2px_2px_0px_#fff]')
                : (isLight ? 'border-black/10 bg-black/5 hover:bg-black/10' : 'border-white/10 bg-white/5 hover:bg-white/10')
            }`}
          >
            <RotateCcw size={13} className={isRefreshing ? 'animate-spin' : ''} />
            <span className="hidden md:inline">Sync</span>
          </button>

          <button
            onClick={() => setManualOverrideMode(null)}
            title="Return to Dashboard"
            className={`p-2 rounded-xl border transition-all flex items-center space-x-1 text-xs font-semibold cursor-pointer ${
              isBrutalist
                ? (isLight ? 'border-2 border-black bg-white hover:bg-gray-100 shadow-[2px_2px_0px_#000]' : 'border-2 border-white bg-black hover:bg-white/10 shadow-[2px_2px_0px_#fff]')
                : (isLight ? 'border-black/10 bg-black/5 hover:bg-black/10 text-slate-700' : 'border-white/10 bg-white/5 hover:bg-white/10 text-gray-300')
            }`}
          >
            <X size={13} />
            <span className="hidden md:inline">Exit</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN 3-COLUMN 1080P GRID */}
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left Column (Cols 1-5): Lead Breaking Dispatch + Key Developments */}
        <div className="col-span-5 flex flex-col space-y-3 min-h-0 h-full">
          {/* 1. Lead / Breaking Story Card */}
          {featuredStory && (
            <div
              className={`p-5 rounded-3xl border flex flex-col justify-between transition-all ${
                secondaryStories.length > 0 ? 'flex-[1.2]' : 'flex-1'
              } ${
                isBrutalist
                  ? (isLight ? 'border-4 border-black bg-white shadow-[5px_5px_0px_#000]' : 'border-4 border-white bg-black shadow-[5px_5px_0px_#fff]')
                  : isEink
                  ? (isLight ? 'border-2 border-stone-800 bg-[#ede8df] shadow-md' : 'border-2 border-stone-500 bg-[#292524] shadow-md')
                  : 'glass-panel shadow-xl'
              }`}
              style={{
                borderColor: isBrutalist || isEink ? undefined : 'var(--color-panel-border, rgba(255, 255, 255, 0.15))',
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {featuredStory.isBreaking ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-rose-500/20 text-rose-500 border border-rose-500/30 flex items-center space-x-1">
                        <Flame size={11} />
                        <span>Breaking Dispatch</span>
                      </span>
                    ) : (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        isLight ? 'bg-slate-200 text-slate-700' : 'bg-white/10 text-gray-300'
                      }`}>
                        Featured Story
                      </span>
                    )}
                    <span className={`text-xs font-semibold ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
                      {featuredStory.source}
                    </span>
                  </div>

                  <span className={`text-xs flex items-center ${isLight ? 'text-slate-400' : 'text-gray-400'}`}>
                    <Clock size={11} className="mr-1" />
                    {featuredStory.time}
                  </span>
                </div>

                <h2 className={`text-lg sm:text-xl font-black leading-tight tracking-tight line-clamp-2 ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  {featuredStory.title}
                </h2>

                {(featuredStory.snippet || featuredStory.summary) && (
                  <p className={`text-xs sm:text-sm mt-2 leading-relaxed line-clamp-3 ${
                    isLight ? 'text-slate-600' : 'text-gray-300'
                  }`}>
                    {featuredStory.snippet || featuredStory.summary}
                  </p>
                )}
              </div>

              <div className={`mt-3 pt-3 border-t flex items-center justify-between ${
                isLight ? 'border-black/10' : 'border-white/10'
              }`}>
                <span className="font-bold uppercase tracking-wider text-[11px]" style={{ color: 'var(--color-accent)' }}>
                  CATEGORY: {featuredStory.category}
                </span>

                {featuredStory.url && (
                  <a
                    href={featuredStory.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-3 py-1 rounded-xl border text-xs font-bold transition-all flex items-center space-x-1.5 ${
                      isLight
                        ? 'border-black/10 hover:bg-black/5 text-slate-800'
                        : 'border-white/15 hover:bg-white/10 text-white'
                    }`}
                  >
                    <span>Read Coverage</span>
                    <ExternalLink size={11} />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* 2. Spotlight Developments (Sub-grid with 2 additional stories) */}
          {secondaryStories.length > 0 && (
            <div className="grid grid-cols-2 gap-3 min-h-0 flex-1">
              {secondaryStories.map((story) => (
                <div
                  key={story.id}
                  className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-all ${
                    secondaryStories.length === 1 ? 'col-span-2' : ''
                  } ${
                    isBrutalist
                      ? (isLight ? 'border-2 border-black bg-white shadow-[3px_3px_0px_#000]' : 'border-2 border-white bg-black shadow-[3px_3px_0px_#fff]')
                      : isEink
                      ? (isLight ? 'border border-stone-800 bg-[#ede8df]' : 'border border-stone-600 bg-[#292524]')
                      : 'glass-panel hover:border-white/30'
                  }`}
                  style={{
                    borderColor: isBrutalist || isEink ? undefined : 'var(--color-panel-border, rgba(255, 255, 255, 0.15))',
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className={`px-1.5 py-0.2 rounded font-bold uppercase text-[9px] ${
                        isLight ? 'bg-slate-200 text-slate-700' : 'bg-white/10 text-gray-300'
                      }`}>
                        {story.category}
                      </span>
                      <span className={isLight ? 'text-slate-400' : 'text-gray-400'}>
                        {story.time}
                      </span>
                    </div>

                    <h3 className={`text-xs font-bold leading-snug line-clamp-2 ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}>
                      {story.title}
                    </h3>

                    {(story.snippet || story.summary) && (
                      <p className={`text-[11px] mt-1 line-clamp-2 leading-relaxed opacity-85 ${
                        isLight ? 'text-slate-600' : 'text-gray-300'
                      }`}>
                        {story.snippet || story.summary}
                      </p>
                    )}
                  </div>

                  <div className={`mt-2 pt-2 border-t flex items-center justify-between text-[10px] ${
                    isLight ? 'border-black/5' : 'border-white/5'
                  }`}>
                    <span className="font-semibold truncate max-w-[130px]" style={{ color: 'var(--color-accent)' }}>
                      {story.source}
                    </span>
                    {story.url && (
                      <a
                        href={story.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`hover:underline flex items-center space-x-0.5 ${
                          isLight ? 'text-slate-600' : 'text-gray-300'
                        }`}
                      >
                        <span>Details</span>
                        <ExternalLink size={9} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 3. Compact Status Bar */}
          <div className={`px-3 py-1.5 rounded-xl border flex items-center justify-between text-[11px] ${
            isBrutalist
              ? (isLight ? 'border-2 border-black bg-white' : 'border-2 border-white bg-black')
              : 'glass-panel'
          }`} style={{ borderColor: isBrutalist ? undefined : 'var(--color-panel-border)' }}>
            <span className={`font-semibold ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
              Displaying {filteredNews.length} verified news reports
            </span>
            <span className="font-mono font-bold" style={{ color: 'var(--color-accent)' }}>
              15-MIN REFRESH
            </span>
          </div>
        </div>

        {/* Center Column (Cols 6-8): Top Stream */}
        <div className="col-span-4 flex flex-col space-y-3 min-h-0">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-accent)' }}>
              Top Stories Stream
            </span>
            <span className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
              {centerStories.length} Articles
            </span>
          </div>

          <div className="space-y-3 overflow-y-auto pr-1 flex-1">
            {centerStories.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isBrutalist
                    ? (isLight ? 'border-2 border-black bg-white shadow-[3px_3px_0px_#000]' : 'border-2 border-white bg-black shadow-[3px_3px_0px_#fff]')
                    : isEink
                    ? (isLight ? 'border border-stone-700 bg-[#ede8df]' : 'border border-stone-600 bg-[#292524]')
                    : 'glass-panel hover:border-white/30'
                }`}
                style={{ borderColor: isBrutalist || isEink ? undefined : 'var(--color-panel-border)' }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-1.5">
                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                      isLight ? 'bg-slate-200 text-slate-700' : 'bg-white/10 text-gray-300'
                    }`}>
                      {item.category}
                    </span>
                    <span className={`text-[11px] font-bold ${isLight ? 'text-slate-700' : 'text-gray-200'}`}>
                      {item.source}
                    </span>
                  </div>
                  <span className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-gray-400'}`}>
                    {item.time}
                  </span>
                </div>

                <h3 className={`text-sm font-bold leading-snug ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {item.title}
                </h3>

                {(item.snippet || item.summary) && (
                  <p className={`text-xs mt-1.5 line-clamp-2 leading-relaxed ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
                    {item.snippet || item.summary}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (Cols 9-12): Industry Wire / Quick Ticker */}
        <div className="col-span-3 flex flex-col space-y-3 min-h-0">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-accent)' }}>
              Industry Wire
            </span>
            <span className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
              Briefings
            </span>
          </div>

          <div className="space-y-2.5 overflow-y-auto pr-1 flex-1">
            {(sideStories.length > 0 ? sideStories : filteredNews.slice(0, 5)).map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-2xl border transition-all ${
                  isBrutalist
                    ? (isLight ? 'border-2 border-black bg-white shadow-[2px_2px_0px_#000]' : 'border-2 border-white bg-black shadow-[2px_2px_0px_#fff]')
                    : isEink
                    ? (isLight ? 'border border-stone-400 bg-white/40' : 'border border-stone-700 bg-black/40')
                    : 'glass-panel'
                }`}
                style={{ borderColor: isBrutalist || isEink ? undefined : 'var(--color-panel-border)' }}
              >
                <div className="flex items-center justify-between text-[10px] font-semibold mb-1">
                  <span style={{ color: 'var(--color-accent)' }}>{item.source}</span>
                  <span className={isLight ? 'text-slate-400' : 'text-gray-500'}>{item.time}</span>
                </div>
                <h4 className={`text-xs font-bold line-clamp-2 leading-snug ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {item.title}
                </h4>
                {(item.snippet || item.summary) && (
                  <p className={`text-[11px] mt-1 line-clamp-2 leading-relaxed ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
                    {item.snippet || item.summary}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
