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
      <svg width={width} height={height} className="overflow-visible">
        <path d={pathData} fill="none" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  };

  const renderTickerItem = (item: FinanceItem) => {
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

        <div className="flex items-center space-x-2 ml-1">
          {renderSparkline(item.sparkline, isPositive)}
          <div
            className={`inline-flex items-center justify-center text-xs font-semibold font-mono-numbers px-2 py-0.5 rounded-full shrink-0 leading-none ${
              isPositive ? 'text-emerald-500 bg-emerald-500/15' : 'text-rose-500 bg-rose-500/15'
            }`}
          >
            {isPositive ? <TrendingUp size={12} className="mr-1 shrink-0" /> : <TrendingDown size={12} className="mr-1 shrink-0" />}
            <span>{isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%</span>
          </div>
        </div>
      </div>
    );
  };

  const renderGridCard = (item: FinanceItem) => {
    const isPositive = item.change >= 0;
    return (
      <div
        key={item.id}
        className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-all ${
          isLight
            ? 'bg-black/[0.02] border-black/[0.08] hover:bg-black/[0.04]'
            : 'bg-white/5 border-white/10 hover:bg-white/[0.08]'
        }`}
      >
        {/* Top Row: Symbol/Name on Left, Up/Down Indicator Pill aligned on Right */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`text-xs font-semibold tracking-wider uppercase truncate ${
              isLight ? 'text-slate-600' : 'text-gray-300'
            }`}
            title={item.name}
          >
            {item.name}
          </span>
          <div
            className={`inline-flex items-center justify-center text-xs font-semibold font-mono-numbers px-2 py-0.5 rounded-full shrink-0 leading-none ${
              isPositive
                ? 'text-emerald-500 bg-emerald-500/15'
                : 'text-rose-500 bg-rose-500/15'
            }`}
          >
            {isPositive ? (
              <TrendingUp size={12} className="mr-1 shrink-0" />
            ) : (
              <TrendingDown size={12} className="mr-1 shrink-0" />
            )}
            <span>
              {isPositive ? '+' : ''}
              {item.changePercent.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Bottom Row: Price on Left, Sparkline on Right */}
        <div className="flex items-baseline justify-between mt-2.5 pt-1.5 border-t border-current/10">
          <div className="flex items-baseline space-x-1">
            <span className={`text-base font-bold font-mono-numbers ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {item.price}
            </span>
            {item.unit && (
              <span className={`text-[10px] font-medium ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                {item.unit}
              </span>
            )}
          </div>
          <div className="shrink-0 flex items-center">
            {renderSparkline(item.sparkline, isPositive)}
          </div>
        </div>
      </div>
    );
  };

  if (mode === 'grid') {
    return (
      <div className={`grid grid-cols-2 gap-3 ${className}`}>
        {finance.map(item => renderGridCard(item))}
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
              {renderTickerItem(item)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
