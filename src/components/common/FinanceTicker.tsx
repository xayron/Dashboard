import React from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useDashboard } from '../../state/DashboardContext';
import type { FinanceItem } from '../../types/dashboard';

interface FinanceTickerProps {
  mode?: 'ticker' | 'grid';
  className?: string;
}

export const FinanceTicker: React.FC<FinanceTickerProps> = ({ mode = 'ticker', className = '' }) => {
  const { finance, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  const renderSparkline = (points: number[], isPositive: boolean) => {
    if (!points || points.length < 2) return null;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const width = 48;
    const height = 18;

    const pathData = points
      .map((p, i) => {
        const x = (i / (points.length - 1)) * width;
        const y = height - ((p - min) / range) * (height - 4) - 2;
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');

    const strokeColor = isPositive ? '#22c55e' : '#ef4444';

    return (
      <svg width={width} height={height} className="overflow-visible ml-2">
        <path d={pathData} fill="none" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  };

  const renderItem = (item: FinanceItem) => {
    const isPositive = item.change >= 0;
    return (
      <div
        key={item.id}
        className={`flex items-center space-x-3 px-4 py-2 rounded-xl shrink-0 border ${
          isLight
            ? 'bg-black/[0.03] border-black/[0.08]'
            : 'bg-white/5 border-white/5'
        }`}
      >
        <div className="flex flex-col">
          <span className={`text-[11px] font-semibold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
            {item.name}
          </span>
          <span className={`text-sm font-bold font-mono-numbers ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {item.price}
          </span>
        </div>

        <div className="flex items-center space-x-1.5 ml-1">
          {renderSparkline(item.sparkline, isPositive)}
          <div
            className={`flex items-center text-xs font-semibold font-mono-numbers px-1.5 py-0.5 rounded ${
              isPositive ? 'text-emerald-500 bg-emerald-500/15' : 'text-rose-500 bg-rose-500/15'
            }`}
          >
            {isPositive ? <TrendingUp size={11} className="mr-0.5" /> : <TrendingDown size={11} className="mr-0.5" />}
            <span>{isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%</span>
          </div>
        </div>
      </div>
    );
  };

  if (mode === 'grid') {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-3 gap-3 ${className}`}>
        {finance.map(item => renderItem(item))}
      </div>
    );
  }

  // Horizontal scrolling ticker
  return (
    <div
      className={`w-full overflow-hidden backdrop-blur-md border-t py-1.5 px-4 flex items-center ${
        isLight
          ? 'bg-white/85 border-slate-200 text-slate-800'
          : 'bg-gray-950/80 border-white/10 text-white'
      } ${className}`}
    >
      <div className={`flex items-center space-x-2 mr-4 shrink-0 pr-3 border-r text-xs font-bold uppercase tracking-widest ${
        isLight ? 'border-slate-200 text-slate-500' : 'border-white/10 text-gray-400'
      }`}>
        <DollarSign size={14} style={{ color: 'var(--color-accent)' }} />
        <span>Markets</span>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <div className="flex items-center space-x-6 animate-ticker">
          {finance.concat(finance).map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="shrink-0">
              {renderItem(item)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
