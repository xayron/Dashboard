import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { BookOpen } from 'lucide-react';

export const EinkHeader: React.FC = () => {
  const { systemHealth, activeMode, weather } = useDashboard();

  return (
    <header className="w-full bg-[#ede8df] text-[#1c1917] px-8 py-2.5 border-b-2 border-stone-800 flex items-center justify-between text-xs font-serif select-none z-30">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1.5 font-bold tracking-widest uppercase text-sm border-r-2 border-stone-800 pr-3">
          <BookOpen size={15} />
          <span>The Daily Chronicle</span>
        </div>
        <span className="italic text-stone-600">Edition 15.6 • {activeMode.toUpperCase()} VIEW</span>
      </div>

      <div className="flex items-center space-x-5 text-xs font-serif">
        <span>Temp: <strong>{weather.temperature}°C</strong> ({weather.condition})</span>
        <span className="text-stone-400">§</span>
        <span>CPU: <strong>{systemHealth.cpuUsage}%</strong></span>
        <span>RAM: <strong>{systemHealth.ramUsage}%</strong></span>
        <span className="text-stone-400">§</span>
        <span>HA: <strong>{systemHealth.haStatus.toUpperCase()}</strong></span>
      </div>
    </header>
  );
};
