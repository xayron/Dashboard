import React from 'react';
import { useDashboard } from '../../state/DashboardContext';

export const NeumorphicFinanceTicker: React.FC = () => {
  const { finance } = useDashboard();

  return (
    <div className="w-full bg-[#1a1d24] py-2 px-8 flex items-center justify-between text-xs select-none z-20 shadow-[0_-4px_12px_#101217]">
      <div className="font-bold uppercase tracking-wider text-neutral-400 text-[10px] shrink-0 pr-4 border-r border-neutral-700/60">
        MARKETS:
      </div>

      <div className="flex-1 flex items-center justify-around overflow-x-auto space-x-4 px-2">
        {finance.map((item) => {
          const isUp = item.change >= 0;
          return (
            <div
              key={item.id}
              className="flex items-center space-x-2 shrink-0 px-3 py-1 rounded-xl bg-[#1a1d24] shadow-[inset_2px_2px_4px_#101217,inset_-2px_-2px_4px_#242831]"
            >
              <span className="text-neutral-400 font-medium text-[11px]">{item.symbol}:</span>
              <span className="text-white font-bold">{item.price}</span>
              <span className={`text-[10px] font-mono font-bold ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isUp ? '+' : ''}{item.changePercent.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
