import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

export const CivicFinanceTicker: React.FC = () => {
  const { finance } = useDashboard();

  return (
    <div className="w-full bg-white border-t-2 border-slate-300 py-2.5 px-8 flex items-center justify-between text-xs font-mono text-slate-800 select-none z-20 shadow-sm relative">
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-[#f97316] via-slate-300 to-[#16a34a]" />

      <div className="flex items-center space-x-2 shrink-0 pr-4 border-r border-slate-300 text-slate-700">
        <TrendingUp size={14} className="text-[#f97316]" />
        <span className="font-extrabold tracking-widest text-xs uppercase text-slate-900">
          MARKETS:
        </span>
      </div>

      <div className="flex-1 flex items-center justify-around overflow-x-auto space-x-6 px-4">
        {finance.map((item) => {
          const isUp = item.change >= 0;
          return (
            <div key={item.id} className="flex items-center space-x-2.5 shrink-0">
              <span className="font-bold text-slate-500">{item.symbol}:</span>
              <span className="text-slate-950 font-black">{item.price}</span>
              <span
                className={`text-[11px] font-bold flex items-center ${
                  isUp ? 'text-emerald-700' : 'text-red-600'
                }`}
              >
                {isUp ? <ArrowUpRight size={12} className="mr-0.5" /> : <ArrowDownRight size={12} className="mr-0.5" />}
                {isUp ? '+' : ''}{item.changePercent.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
