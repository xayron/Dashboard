import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Sparkles } from 'lucide-react';

export const RetrowaveFinanceTicker: React.FC = () => {
  const { finance } = useDashboard();

  return (
    <div className="w-full bg-[#0c0317] border-t-2 border-fuchsia-500/50 py-1.5 px-6 flex items-center justify-between text-xs font-mono text-cyan-200 select-none z-20 shadow-[0_-4px_15px_rgba(255,42,133,0.15)]">
      <div className="flex items-center space-x-1.5 text-pink-400 font-bold shrink-0 pr-4 border-r border-fuchsia-500/30">
        <Sparkles size={13} className="text-pink-400" />
        <span>TICKER//84:</span>
      </div>

      <div className="flex-1 flex items-center justify-around overflow-x-auto space-x-4 px-2">
        {finance.map((item) => {
          const isUp = item.change >= 0;
          return (
            <div
              key={item.id}
              className="flex items-center space-x-2 shrink-0 px-2 py-0.5 bg-[#16062b] border border-cyan-500/30"
            >
              <span className="text-gray-400">{item.symbol}:</span>
              <span className="text-white font-bold">{item.price}</span>
              <span className={`text-[11px] font-bold ${isUp ? 'text-cyan-400' : 'text-pink-400'}`}>
                {isUp ? '▲' : '▼'}{Math.abs(item.changePercent).toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
