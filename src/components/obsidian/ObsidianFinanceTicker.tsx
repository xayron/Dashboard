import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

export const ObsidianFinanceTicker: React.FC = () => {
  const { finance } = useDashboard();

  return (
    <div className="w-full bg-[#050507] border-t border-white/[0.12] py-2 px-8 flex items-center justify-between text-xs font-mono text-[#eef0f3] select-none z-20">
      <div className="flex items-center space-x-2 shrink-0 pr-4 border-r border-white/[0.12] text-[#9a9da6]">
        <TrendingUp size={13} className="text-[#5fd49b]" />
        <span className="font-bold tracking-widest text-xs uppercase text-[#eef0f3]">
          MARKETS:
        </span>
      </div>

      <div className="flex-1 flex items-center justify-around overflow-x-auto space-x-6 px-4">
        {finance.map((item) => {
          const isUp = item.change >= 0;
          return (
            <div key={item.id} className="flex items-center space-x-2.5 shrink-0">
              <span className="font-bold text-[#9a9da6]">{item.symbol}:</span>
              <span className="text-[#eef0f3] font-bold">{item.price}</span>
              <span
                className={`text-[11px] font-bold flex items-center ${
                  isUp ? 'text-[#5fd49b]' : 'text-[#e3b341]'
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
