import React from 'react';
import { useDashboard } from '../../state/DashboardContext';

export const TuiFinanceTicker: React.FC = () => {
  const { finance, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  return (
    <div
      className={`w-full overflow-hidden border-t py-1 px-4 flex items-center font-mono text-xs select-none ${
        isLight ? 'bg-white/95 text-slate-900 border-slate-300' : 'bg-black/95 text-gray-200 border-slate-800'
      }`}
      style={{ borderTopColor: 'var(--color-accent)' }}
    >
      <div
        className="flex items-center space-x-1.5 mr-3 shrink-0 pr-2 border-r font-extrabold uppercase"
        style={{ color: 'var(--color-accent)', borderColor: 'var(--color-accent-soft)' }}
      >
        <span>&gt;&gt; TELETYPE_FEED:</span>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <div className="flex items-center space-x-8 animate-ticker">
          {finance.concat(finance).map((item, idx) => {
            const isPos = item.change >= 0;
            return (
              <div key={`${item.id}-${idx}`} className="shrink-0 flex items-center space-x-2">
                <span className={isLight ? 'text-slate-500 font-bold' : 'text-gray-400 font-bold'}>{item.name}:</span>
                <span className={isLight ? 'text-slate-900 font-extrabold' : 'text-white font-extrabold'}>{item.price}</span>
                <span className={`font-bold ${isPos ? 'text-emerald-500' : 'text-rose-500'}`}>
                  [{isPos ? '+' : ''}{item.changePercent.toFixed(2)}% {isPos ? '▲' : '▼'}]
                </span>
                <span className={isLight ? 'text-slate-300' : 'text-gray-600'}>|</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
