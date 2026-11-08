import React from 'react';
import { useDashboard } from '../../state/DashboardContext';

export const MinimalFinanceTicker: React.FC = () => {
  const { finance } = useDashboard();

  return (
    <div className="w-full bg-[#09090b] border-t border-white/10 py-2 px-10 flex items-center justify-between text-xs font-mono select-none z-20">
      <div className="flex-1 flex items-center justify-around overflow-x-auto space-x-6">
        {finance.map((item) => {
          const isUp = item.change >= 0;
          return (
            <div key={item.id} className="flex items-center space-x-2 shrink-0">
              <span className="text-neutral-400 font-light">{item.symbol}</span>
              <span className="text-neutral-200">{item.price}</span>
              <span className={`text-[11px] ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isUp ? '+' : ''}{item.changePercent.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
