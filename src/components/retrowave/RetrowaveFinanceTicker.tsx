import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Sparkles } from 'lucide-react';

export const RetrowaveFinanceTicker: React.FC = () => {
  const { finance } = useDashboard();

  return (
    <div className="w-full bg-[#150424] border-t-2 border-pink-500 py-2 px-8 flex items-center justify-between text-xs text-pink-200 select-none z-20 shadow-[0_-4px_20px_rgba(255,0,127,0.25)]">
      <div className="flex items-center space-x-1.5 text-amber-300 font-black italic shrink-0 pr-4 border-r border-pink-500/40">
        <Sparkles size={13} className="text-pink-400" />
        <span>WALL_ST//84:</span>
      </div>

      <div className="flex-1 flex items-center justify-around overflow-x-auto space-x-4 px-2">
        {finance.map((item) => {
          const isUp = item.change >= 0;
          return (
            <div
              key={item.id}
              className="flex items-center space-x-2 shrink-0 px-3 py-1 rounded-xl bg-[#1e0736] border border-pink-500/30"
            >
              <span className="text-pink-300 font-bold">{item.symbol}:</span>
              <span className="text-white font-mono font-bold">{item.price}</span>
              <span className={`text-[11px] font-mono font-black ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isUp ? '▲' : '▼'}{Math.abs(item.changePercent).toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
