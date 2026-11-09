import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { ArrowUpRight, ArrowDownRight, Database } from 'lucide-react';

export const CivicFinanceTicker: React.FC = () => {
  const { finance } = useDashboard();

  return (
    <div className="w-full bg-[#070b14] border-t border-slate-700/60 py-2 px-8 flex items-center justify-between text-xs font-mono text-slate-200 select-none z-20">
      <div className="flex items-center space-x-2 shrink-0 pr-4 border-r border-slate-700/60 text-slate-400">
        <Database size={13} className="text-amber-400" />
        <span className="font-bold tracking-widest text-xs uppercase text-white">
          FISCAL LEDGER:
        </span>
      </div>

      <div className="flex-1 flex items-center justify-around overflow-x-auto space-x-6 px-4">
        {finance.map((item) => {
          const isUp = item.change >= 0;
          return (
            <div key={item.id} className="flex items-center space-x-2.5 shrink-0">
              <span className="font-bold text-slate-400">{item.symbol}:</span>
              <span className="text-white font-bold">{item.price}</span>
              <span
                className={`text-[11px] font-bold flex items-center ${
                  isUp ? 'text-emerald-400' : 'text-rose-400'
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
