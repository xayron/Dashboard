import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

export const ObsidianFinanceTicker: React.FC = () => {
  const { finance, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  return (
    <div
      className={`w-full border-t py-2 px-8 flex items-center justify-between text-xs font-mono select-none z-20 ${
        isLight
          ? 'bg-white border-slate-200 text-slate-800 shadow-sm'
          : 'bg-[#050507] border-white/[0.12] text-[#eef0f3]'
      }`}
    >
      <div className={`flex items-center space-x-2 shrink-0 pr-4 border-r ${
        isLight ? 'border-slate-200 text-slate-500' : 'border-white/[0.12] text-[#9a9da6]'
      }`}>
        <TrendingUp size={13} style={{ color: 'var(--color-accent)' }} />
        <span className={`font-bold tracking-widest text-xs uppercase ${isLight ? 'text-slate-900' : 'text-[#eef0f3]'}`}>
          MARKETS:
        </span>
      </div>

      <div className="flex-1 flex items-center justify-around overflow-x-auto no-scrollbar space-x-6 px-4">
        {finance.map((item) => {
          const isUp = item.change >= 0;
          return (
            <div key={item.id} className="flex items-center space-x-2.5 shrink-0">
              <span className={`font-bold ${isLight ? 'text-slate-500' : 'text-[#9a9da6]'}`}>{item.symbol}:</span>
              <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-[#eef0f3]'}`}>{item.price}</span>
              <span
                className={`text-[11px] font-bold flex items-center ${
                  isUp ? (isLight ? 'text-emerald-600' : 'text-emerald-400') : (isLight ? 'text-amber-600' : 'text-amber-400')
                }`}
              >
                {isUp ? <ArrowUpRight size={11} className="mr-0.5" /> : <ArrowDownRight size={11} className="mr-0.5" />}
                {isUp ? '+' : ''}{item.changePercent.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
