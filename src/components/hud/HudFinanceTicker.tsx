import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Activity } from 'lucide-react';

export const HudFinanceTicker: React.FC = () => {
  const { finance } = useDashboard();

  return (
    <div className="w-full bg-[#030712] border-t border-cyan-500/40 py-1.5 px-6 flex items-center justify-between text-xs font-mono text-cyan-200 select-none z-20">
      <div className="flex items-center space-x-1.5 text-cyan-400 font-bold shrink-0 pr-4 border-r border-cyan-500/30">
        <Activity size={13} className="text-cyan-400" />
        <span>MARKET_FEED:</span>
      </div>

      <div className="flex-1 flex items-center justify-around overflow-x-auto space-x-4 px-2">
        {finance.map((item) => {
          const isUp = item.change >= 0;
          return (
            <div
              key={item.id}
              className="flex items-center space-x-2 shrink-0 px-2 py-0.5 bg-[#050e20] border border-cyan-500/20"
            >
              <span className="text-gray-400">{item.symbol}:</span>
              <span className="text-white font-bold">{item.price}</span>
              <span className={`text-[11px] ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                {isUp ? '▲' : '▼'}{Math.abs(item.changePercent).toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
