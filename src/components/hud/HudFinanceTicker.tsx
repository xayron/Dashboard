import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Activity } from 'lucide-react';

export const HudFinanceTicker: React.FC = () => {
  const { finance, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  return (
    <div
      className={`w-full border-t py-1.5 px-6 flex items-center justify-between text-xs font-mono select-none z-20 ${
        isLight ? 'bg-white/95 text-slate-900 border-slate-300' : 'bg-[#040814]/95 text-cyan-200 border-cyan-500/40'
      }`}
      style={{ borderTopColor: 'var(--color-accent-soft)' }}
    >
      <div
        className="flex items-center space-x-1.5 font-bold shrink-0 pr-4 border-r"
        style={{ color: 'var(--color-accent)', borderColor: 'var(--color-accent-soft)' }}
      >
        <Activity size={13} style={{ color: 'var(--color-accent)' }} />
        <span>MARKET_FEED:</span>
      </div>

      <div className="flex-1 flex items-center justify-around overflow-x-auto no-scrollbar space-x-4 px-2">
        {finance.map((item) => {
          const isUp = item.change >= 0;
          return (
            <div
              key={item.id}
              className={`flex items-center space-x-2 shrink-0 px-2 py-0.5 border ${
                isLight ? 'bg-slate-100 border-slate-300' : 'bg-[#050e20] border-cyan-500/20'
              }`}
              style={{ borderColor: 'var(--color-accent-soft)' }}
            >
              <span className={isLight ? 'text-slate-500 font-medium' : 'text-gray-400'}>{item.symbol}:</span>
              <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{item.price}</span>
              <span className={`text-[11px] font-bold ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                {isUp ? '▲' : '▼'}{Math.abs(item.changePercent).toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
