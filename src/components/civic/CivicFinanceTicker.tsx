import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

export const CivicFinanceTicker: React.FC = () => {
  const { finance, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  return (
    <div
      className={`w-full border-t-2 py-2.5 px-8 flex items-center justify-between text-xs font-mono select-none z-20 relative ${
        isLight
          ? 'bg-white border-slate-300 text-slate-800 shadow-sm'
          : 'bg-[#0f172a] border-slate-700 text-slate-100 shadow-md'
      }`}
    >
      <div
        className="absolute top-0 inset-x-0 h-0.5"
        style={{
          background: 'linear-gradient(to right, var(--color-accent, #f97316), white, #16a34a)',
        }}
      />

      <div className={`flex items-center space-x-2 shrink-0 pr-4 border-r ${
        isLight ? 'border-slate-300 text-slate-700' : 'border-slate-700 text-slate-300'
      }`}>
        <TrendingUp size={14} style={{ color: 'var(--color-accent, #f97316)' }} />
        <span className={`font-extrabold tracking-widest text-xs uppercase ${
          isLight ? 'text-slate-900' : 'text-slate-100'
        }`}>
          MARKETS:
        </span>
      </div>

      <div className="flex-1 flex items-center justify-around overflow-x-auto space-x-6 px-4">
        {finance.map((item) => {
          const isUp = item.change >= 0;
          return (
            <div key={item.id} className="flex items-center space-x-2.5 shrink-0">
              <span className={`font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{item.symbol}:</span>
              <span className={`font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>{item.price}</span>
              <span
                className={`text-[11px] font-bold flex items-center ${
                  isUp ? 'text-emerald-500' : 'text-red-500'
                }`}
              >
                {isUp ? <ArrowUpRight size={12} className="mr-0.5" /> : <ArrowDownRight size={12} className="mr-0.5" />}
                {isUp ? '+' : ''}{item.changePercent.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
