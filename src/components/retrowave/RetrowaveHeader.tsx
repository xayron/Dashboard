import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { Sparkles, Radio, Zap } from 'lucide-react';

export const RetrowaveHeader: React.FC = () => {
  const { systemHealth, activeMode, weather } = useDashboard();

  return (
    <header className="w-full bg-[#150424] border-b-2 border-pink-500 shadow-[0_4px_25px_rgba(255,0,127,0.35)] px-8 py-2.5 flex items-center justify-between text-xs select-none z-30">
      {/* 80s Outrun Sliced Sun Logo & Title */}
      <div className="flex items-center space-x-3.5">
        {/* Sliced Neon Sun Icon */}
        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gradient-to-t from-pink-600 via-rose-500 to-amber-400 p-0.5 flex flex-col justify-between shadow-[0_0_15px_#ff007f]">
          <div className="w-full h-1 bg-[#150424]/90 mt-2" />
          <div className="w-full h-1 bg-[#150424]/90" />
          <div className="w-full h-1 bg-[#150424]/90 mb-1" />
        </div>

        <div>
          <span className="text-sm font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-400 to-fuchsia-400 drop-shadow-[0_0_8px_rgba(255,0,127,0.6)]">
            OUTRUN // 1984
          </span>
          <span className="ml-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40">
            {activeMode}
          </span>
        </div>
      </div>

      {/* Retro Sunset Readouts */}
      <div className="flex items-center space-x-5 text-xs font-bold">
        <span className="text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">
          {weather.temperature}°C {weather.condition.toUpperCase()}
        </span>
        <span className="text-pink-500">★</span>
        <span className="text-pink-200">CPU {systemHealth.cpuUsage}%</span>
        <span className="text-pink-200">RAM {systemHealth.ramUsage}%</span>
        <span className="text-pink-500">★</span>
        <span className="text-amber-400 flex items-center drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">
          <Radio size={12} className="mr-1 animate-pulse" />
          HA: {systemHealth.haStatus.toUpperCase()}
        </span>
      </div>
    </header>
  );
};
