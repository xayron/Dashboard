import React from 'react';
import { useDashboard } from '../../state/DashboardContext';

export const NeumorphicFinanceTicker: React.FC = () => {
  const { finance, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  return (
    <div
      className={`w-full py-2 px-8 flex items-center justify-between text-xs select-none z-20 ${
        isLight
          ? 'bg-[#e2e8f0] text-slate-800 shadow-[0_-4px_12px_#cbd5e1]'
          : 'bg-[#1a1d24] text-neutral-200 shadow-[0_-4px_12px_#101217]'
      }`}
    >
      <div className={`font-bold uppercase tracking-wider text-[10px] shrink-0 pr-4 border-r ${
        isLight ? 'border-slate-300 text-slate-500' : 'border-neutral-700/60 text-neutral-400'
      }`}>
        MARKETS:
      </div>

      <div className="flex-1 flex items-center justify-around overflow-x-auto space-x-4 px-2">
        {finance.map((item) => {
          const isUp = item.change >= 0;
          return (
            <div
              key={item.id}
              className={`flex items-center space-x-2 shrink-0 px-3 py-1 rounded-xl ${
                isLight
                  ? 'bg-[#e2e8f0] shadow-[inset_2px_2px_4px_#cbd5e1,inset_-2px_-2px_4px_#ffffff]'
                  : 'bg-[#1a1d24] shadow-[inset_2px_2px_4px_#101217,inset_-2px_-2px_4px_#242831]'
              }`}
            >
              <span className={`font-medium text-[11px] ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>{item.symbol}:</span>
              <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{item.price}</span>
              <span className={`text-[10px] font-mono font-bold ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                {isUp ? '+' : ''}{item.changePercent.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
