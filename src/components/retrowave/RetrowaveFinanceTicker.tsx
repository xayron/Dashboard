import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Sparkles } from 'lucide-react';

export const RetrowaveFinanceTicker: React.FC = () => {
  const { finance, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  return (
    <div
      className={`w-full border-t-2 py-2 px-8 flex items-center justify-between text-xs select-none z-20 ${
        isLight
          ? 'bg-white/95 text-slate-900 border-pink-400 shadow-[0_-4px_20px_rgba(236,72,153,0.15)]'
          : 'bg-[#150424] text-pink-200 border-pink-500 shadow-[0_-4px_20px_rgba(255,0,127,0.25)]'
      }`}
      style={{ borderTopColor: 'var(--color-accent)' }}
    >
      <div
        className="flex items-center space-x-1.5 font-black italic shrink-0 pr-4 border-r"
        style={{ color: 'var(--color-accent)', borderColor: 'var(--color-accent-soft)' }}
      >
        <Sparkles size={13} style={{ color: 'var(--color-accent)' }} />
        <span>WALL_ST//84:</span>
      </div>

      <div className="flex-1 flex items-center justify-around overflow-x-auto space-x-4 px-2">
        {finance.map((item) => {
          const isUp = item.change >= 0;
          return (
            <div
              key={item.id}
              className={`flex items-center space-x-2 shrink-0 px-3 py-1 rounded-xl border ${
                isLight ? 'bg-purple-50 border-purple-200' : 'bg-[#1e0736] border-pink-500/30'
              }`}
              style={{ borderColor: 'var(--color-accent-soft)' }}
            >
              <span className={`font-bold ${isLight ? 'text-slate-600' : 'text-pink-300'}`}>{item.symbol}:</span>
              <span className={`font-mono font-bold ${isLight ? 'text-slate-950' : 'text-white'}`}>{item.price}</span>
              <span className={`text-[11px] font-mono font-black ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                {isUp ? '▲' : '▼'}{Math.abs(item.changePercent).toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
