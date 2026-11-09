import React from 'react';
import { useDashboard } from '../../state/DashboardContext';

export const EinkFinanceTicker: React.FC = () => {
  const { finance, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  return (
    <div
      className={`w-full border-t-2 py-2 px-8 flex items-center justify-between text-xs font-serif select-none z-20 ${
        isLight
          ? 'bg-[#ede8df] border-stone-800 text-[#1c1917]'
          : 'bg-[#292524] border-stone-600 text-[#fafaf9]'
      }`}
    >
      <div className={`font-bold uppercase tracking-widest text-xs shrink-0 pr-4 border-r-2 ${
        isLight ? 'border-stone-400 text-stone-800' : 'border-stone-600 text-stone-200'
      }`}>
        Exchange Quotes:
      </div>

      <div className="flex-1 flex items-center justify-around overflow-x-auto space-x-6 px-2">
        {finance.map((item) => {
          const isUp = item.change >= 0;
          return (
            <div key={item.id} className="flex items-center space-x-2 shrink-0">
              <span className={`font-bold ${isLight ? 'text-stone-700' : 'text-stone-300'}`}>{item.symbol}:</span>
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
