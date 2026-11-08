import React from 'react';
import { useDashboard } from '../../state/DashboardContext';

export const EinkFinanceTicker: React.FC = () => {
  const { finance } = useDashboard();

  return (
    <div className="w-full bg-[#ede8df] border-t-2 border-stone-800 py-2 px-8 flex items-center justify-between text-xs font-serif text-[#1c1917] select-none z-20">
      <div className="font-bold uppercase tracking-widest text-xs shrink-0 pr-4 border-r-2 border-stone-400">
        Exchange Quotes:
      </div>

      <div className="flex-1 flex items-center justify-around overflow-x-auto space-x-6 px-2">
        {finance.map((item) => {
          const isUp = item.change >= 0;
          return (
            <div key={item.id} className="flex items-center space-x-2 shrink-0">
              <span className="font-bold text-stone-700">{item.symbol}:</span>
              <span className="font-mono">{item.price}</span>
              <span className="font-mono text-[11px] font-bold">
                {isUp ? '+' : ''}{item.changePercent.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
