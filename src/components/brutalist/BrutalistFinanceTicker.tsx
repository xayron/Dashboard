import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const BrutalistFinanceTicker: React.FC = () => {
  const { finance } = useDashboard();

  return (
    <div className="w-full bg-black border-t-4 border-white py-2 px-6 flex items-center justify-between text-xs font-mono font-bold select-none shadow-[0_-4px_0px_#000] z-20">
      <div className="flex items-center space-x-2 shrink-0 pr-4 border-r-2 border-white/40 text-yellow-400 font-black">
        <span>MARKETS:</span>
      </div>

      <div className="flex-1 flex items-center justify-around overflow-x-auto space-x-4 px-2">
        {finance.map((item) => {
          const isUp = item.change >= 0;
          return (
            <div
              key={item.id}
              className="flex items-center space-x-2 shrink-0 px-2 py-0.5 bg-neutral-900 border border-white/30"
            >
              <span className="font-black text-white">{item.symbol}:</span>
              <span className="font-bold text-neutral-200">{item.price}</span>
              <span
                className={`font-black flex items-center text-[11px] ${
                  isUp ? 'text-lime-400' : 'text-red-400'
                }`}
              >
                {isUp ? <TrendingUp size={11} className="mr-0.5" /> : <TrendingDown size={11} className="mr-0.5" />}
                {isUp ? '+' : ''}{item.changePercent.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
