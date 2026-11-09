import React from 'react';
import { Newspaper, ChevronRight, Flame, Clock, ExternalLink } from 'lucide-react';
import { useDashboard } from '../../state/DashboardContext';

interface NewsWidgetProps {
  className?: string;
  maxItems?: number;
  compact?: boolean;
}

export const NewsWidget: React.FC<NewsWidgetProps> = ({
  className = '',
  maxItems = 3,
  compact = false,
}) => {
  const { news, setManualOverrideMode, colorMode, uiStyle } = useDashboard();
  const isLight = colorMode === 'light';

  const isTui = uiStyle === 'tui';
  const isHud = uiStyle === 'hud';
  const isBrutalist = uiStyle === 'brutalist';
  const isEink = uiStyle === 'eink';
  const isRetrowave = uiStyle === 'retrowave';

  const displayItems = news.slice(0, maxItems);

  if (compact) {
    const topItem = news[0];
    if (!topItem) return null;
    return (
      <div
        onClick={() => setManualOverrideMode('news')}
        className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
          isLight
            ? 'bg-black/[0.03] border-black/[0.08] hover:border-black/20'
            : 'bg-white/5 border-white/10 hover:border-white/20'
        } ${className}`}
      >
        <div className="flex items-center space-x-2.5 min-w-0 flex-1">
          <Newspaper size={14} style={{ color: 'var(--color-accent)' }} className="shrink-0" />
          <div className="truncate">
            <p className={`text-xs font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {topItem.title}
            </p>
            {(topItem.snippet || topItem.summary) && (
              <p className={`text-[10px] truncate ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
                {topItem.snippet || topItem.summary}
              </p>
            )}
            <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
              {topItem.source} • {topItem.time}
            </span>
          </div>
        </div>
        <ChevronRight size={14} className={isLight ? 'text-slate-400' : 'text-gray-400'} />
      </div>
    );
  }

  return (
    <div
      onClick={() => setManualOverrideMode('news')}
      className={`glass-panel p-5 rounded-3xl border flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.005] ${
        isLight
          ? 'border-black/[0.08] hover:border-black/20 bg-white/60 shadow-lg'
          : 'border-white/10 hover:border-white/20 bg-gradient-to-br from-white/[0.04] to-black/40 shadow-xl'
      } ${className}`}
    >
      {/* Top Header */}
      <div className={`flex items-center justify-between pb-2 mb-2.5 border-b ${
        isLight ? 'border-black/[0.08]' : 'border-white/10'
      }`}>
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider">
          <Newspaper size={14} style={{ color: 'var(--color-accent)' }} />
          <span className={isLight ? 'text-slate-900' : 'text-white'}>Top Headlines</span>
          <span className="flex items-center space-x-1 px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>LIVE</span>
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setManualOverrideMode('news');
          }}
          className={`text-[11px] font-bold flex items-center space-x-0.5 hover:underline ${
            isLight ? 'text-blue-600' : 'text-blue-400'
          }`}
          style={{ color: 'var(--color-accent)' }}
        >
          <span>View All</span>
          <ChevronRight size={13} />
        </button>
      </div>

      {/* Headlines List */}
      <div className="space-y-2 flex-1">
        {displayItems.map((item, idx) => (
          <div
            key={item.id}
            className={`p-2.5 rounded-2xl border transition-all ${
              idx === 0
                ? (isLight ? 'bg-black/[0.03] border-black/[0.08]' : 'bg-white/[0.04] border-white/10')
                : (isLight ? 'bg-transparent border-transparent hover:bg-black/[0.02]' : 'bg-transparent border-transparent hover:bg-white/[0.02]')
            }`}
          >
            <div className="flex items-center space-x-1.5 mb-1">
              {item.isBreaking ? (
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-500 border border-rose-500/30 flex items-center space-x-0.5">
                  <Flame size={9} />
                  <span>Breaking</span>
                </span>
              ) : (
                <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                  isLight ? 'bg-slate-200 text-slate-700' : 'bg-white/10 text-gray-300'
                }`}>
                  {item.category}
                </span>
              )}
              <span className={`text-[10px] font-medium truncate ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
                {item.source}
              </span>
              <span className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-gray-400'}`}>
                • {item.time}
              </span>
            </div>

            <p className={`text-xs font-bold line-clamp-1 leading-snug ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              {item.title}
            </p>

            {(item.snippet || item.summary) && (
              <p className={`text-[11px] leading-relaxed line-clamp-2 mt-1 ${
                isLight ? 'text-slate-600' : 'text-gray-300'
              }`}>
                {item.snippet || item.summary}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
