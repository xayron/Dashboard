import React from 'react';
import { useDashboard } from '../../state/DashboardContext';

export const MinimalFinanceTicker: React.FC = () => {
  const { finance, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  return (
    <div
      className={`w-full border-t py-2 px-10 flex items-center justify-between text-xs font-mono select-none z-20 ${
        isLight ? 'bg-white/90 border-slate-200 text-slate-800' : 'bg-[#09090b] border-white/10 text-neutral-200'
      }`}
    >
      <div className="flex-1 flex items-center justify-around overflow-x-auto space-x-6">
        {finance.map((item) => {
          const isUp = item.change >= 0;
          return (
            <div key={item.id} className="flex items-center space-x-2 shrink-0">
              <span className={`font-light ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>{item.symbol}</span>
              <span className={isLight ? 'text-slate-900 font-medium' : 'text-neutral-200'}>{item.price}</span>
              <span className={`text-[11px] ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                {isUp ? '+' : ''}{item.changePercent.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
