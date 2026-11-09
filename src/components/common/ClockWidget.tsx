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
  const { now, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

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
        <div className={`flex items-baseline font-mono-numbers tracking-tight font-extrabold drop-shadow-sm ${
          isLight ? 'text-slate-900' : 'text-white'
        }`}>
          <span className="text-7xl xl:text-8xl leading-none font-display">{hours}:{minutes}</span>
          {showSeconds && (
            <span
              className="ml-2.5 text-2xl xl:text-3xl font-mono-numbers font-medium w-14"
              style={{ color: 'var(--color-accent)' }}
            >
              {seconds}
            </span>
          )}
          <span
            className="ml-2 text-[10px] xl:text-xs uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full border"
            style={{
              color: 'var(--color-accent)',
              backgroundColor: 'var(--theme-accent-soft)',
              borderColor: 'var(--color-border-subtle)',
            }}
          >
            IST
          </span>
        </div>
        {showDate && (
          <div className={`mt-1.5 text-lg xl:text-xl font-medium tracking-wide ${
            isLight ? 'text-slate-600' : 'text-gray-200'
          }`}>
            {dateFormatted}
          </div>
        )}
      </div>
    );
  }

  if (size === 'compact') {
    return (
      <div className={`flex items-center space-x-2 font-mono-numbers ${className}`}>
        <span className={`text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{hours}:{minutes}</span>
        {showSeconds && (
          <span className="text-sm font-semibold" style={{ color: 'var(--color-accent)' }}>
            {seconds}
          </span>
        )}
      </div>
    );
  }

  // Normal size
  return (
    <div className={`flex flex-col ${className}`}>
      <div className={`flex items-baseline font-mono-numbers tracking-tight font-bold drop-shadow-sm ${
        isLight ? 'text-slate-900' : 'text-white'
      }`}>
        <span className="text-6xl md:text-7xl leading-none font-display">{hours}:{minutes}</span>
        {showSeconds && (
          <span className="ml-2 text-2xl font-mono-numbers font-medium" style={{ color: 'var(--color-accent)' }}>
            {seconds}
          </span>
        )}
        <span
          className="ml-2 text-xs uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded border"
          style={{
            color: 'var(--color-accent)',
            backgroundColor: 'var(--theme-accent-soft)',
            borderColor: 'var(--color-border-subtle)',
          }}
        >
          IST
        </span>
      </div>
      {showDate && (
        <div className={`mt-1 text-base md:text-lg font-medium ${
          isLight ? 'text-slate-600' : 'text-gray-300'
        }`}>
          {dateFormatted}
        </div>
      )}
    </div>
  );
};
