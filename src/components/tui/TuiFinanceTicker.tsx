import React from 'react';
import { useDashboard } from '../../state/DashboardContext';

export const TuiFinanceTicker: React.FC = () => {
  const { finance } = useDashboard();

  return (
    <div className="w-full overflow-hidden bg-black border-t border-emerald-500/40 py-1 px-4 flex items-center font-mono text-xs select-none">
      <div className="flex items-center space-x-1.5 mr-3 shrink-0 pr-2 border-r border-emerald-500/30 text-emerald-400 font-extrabold uppercase">
        <span>&gt;&gt; TELETYPE_FEED:</span>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <div className="flex items-center space-x-8 animate-ticker">
          {finance.concat(finance).map((item, idx) => {
            const isPos = item.change >= 0;
            return (
              <div key={`${item.id}-${idx}`} className="shrink-0 flex items-center space-x-2">
                <span className="text-gray-400 font-bold">{item.name}:</span>
                <span className="text-white font-extrabold">{item.price}</span>
                <span className={`font-bold ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                  [{isPos ? '+' : ''}{item.changePercent.toFixed(2)}% {isPos ? '▲' : '▼'}]
                </span>
                <span className="text-gray-600">|</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
