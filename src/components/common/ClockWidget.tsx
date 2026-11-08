import React from 'react';
import { useDashboard } from '../../state/DashboardContext';

interface ClockWidgetProps {
  size?: 'normal' | 'large' | 'compact';
  showSeconds?: boolean;
  showDate?: boolean;
  className?: string;
}

export const ClockWidget: React.FC<ClockWidgetProps> = ({
  size = 'normal',
  showSeconds = true,
  showDate = true,
  className = '',
}) => {
  const { now } = useDashboard();

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  // Formatted date in IST: "Monday, 9 Nov 2026"
  const dateFormatted = now.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  if (size === 'large') {
    return (
      <div className={`flex flex-col ${className}`}>
        <div className="flex items-baseline font-mono-numbers tracking-tight font-extrabold text-white drop-shadow-lg">
          <span className="text-8xl md:text-9xl leading-none font-display">{hours}:{minutes}</span>
          {showSeconds && (
            <span className="ml-3 text-3xl md:text-4xl text-gray-400 font-mono-numbers font-medium w-16">
              {seconds}
            </span>
          )}
          <span className="ml-2 text-xs uppercase tracking-widest text-indigo-400 font-semibold px-2 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-500/30">
            IST
          </span>
        </div>
        {showDate && (
          <div className="mt-2 text-xl md:text-2xl font-medium text-gray-200 tracking-wide drop-shadow">
            {dateFormatted}
          </div>
        )}
      </div>
    );
  }

  if (size === 'compact') {
    return (
      <div className={`flex items-center space-x-2 font-mono-numbers ${className}`}>
        <span className="text-2xl font-bold text-white">{hours}:{minutes}</span>
        {showSeconds && <span className="text-sm text-gray-400">{seconds}</span>}
      </div>
    );
  }

  // Normal size
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-baseline font-mono-numbers tracking-tight font-bold text-white drop-shadow-md">
        <span className="text-6xl md:text-7xl leading-none font-display">{hours}:{minutes}</span>
        {showSeconds && (
          <span className="ml-2 text-2xl text-gray-400 font-mono-numbers">
            {seconds}
          </span>
        )}
        <span className="ml-2 text-xs uppercase tracking-wider text-blue-400 font-semibold px-1.5 py-0.5 rounded bg-blue-950/60 border border-blue-500/20">
          IST
        </span>
      </div>
      {showDate && (
        <div className="mt-1 text-base md:text-lg font-medium text-gray-300">
          {dateFormatted}
        </div>
      )}
    </div>
  );
};
