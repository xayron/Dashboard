import React from 'react';
import { useDashboard } from '../../state/DashboardContext';

interface TuiBoxProps {
  title?: string;
  badge?: React.ReactNode;
  badgeColor?: string;
  children: React.ReactNode;
  className?: string;
  borderStyle?: 'single' | 'double' | 'rounded';
  headerRight?: React.ReactNode;
}

export const TuiBox: React.FC<TuiBoxProps> = ({
  title,
  badge,
  badgeColor,
  children,
  className = '',
  borderStyle = 'single',
  headerRight,
}) => {
  const { colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  return (
    <div
      className={`font-mono border tui-box p-3 rounded-none relative flex flex-col ${
        isLight ? 'bg-white/95 text-slate-900' : 'bg-black/90 text-gray-100'
      } ${className}`}
      style={{
        borderColor: 'var(--color-accent, #10b981)',
        boxShadow: isLight
          ? '0 2px 10px var(--color-glow, rgba(0,0,0,0.06))'
          : '0 0 15px var(--color-glow, rgba(16, 185, 129, 0.15))',
      }}
    >
      {/* Terminal Title Bar */}
      {(title || headerRight || badge) && (
        <div
          className="flex items-center justify-between text-xs pb-2 mb-2 border-b font-bold uppercase tracking-wider select-none"
          style={{
            borderColor: 'var(--color-accent-soft, rgba(16, 185, 129, 0.25))',
            color: 'var(--color-accent, #10b981)',
          }}
        >
          <div className="flex items-center space-x-2 truncate">
            <span style={{ color: 'var(--color-accent, #10b981)' }} className="font-extrabold">&gt;</span>
            {title && <span>{title}</span>}
            {badge && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded ${badgeColor || ''}`}
                style={{
                  backgroundColor: 'var(--color-accent-soft, rgba(16, 185, 129, 0.15))',
                  borderColor: 'var(--color-accent, #10b981)',
                  borderWidth: 1,
                  color: 'var(--color-accent, #10b981)',
                }}
              >
                [{badge}]
              </span>
            )}
          </div>
          {headerRight && (
            <div style={{ color: 'var(--color-accent, #10b981)' }} className="text-[11px] shrink-0 opacity-80">
              {headerRight}
            </div>
          )}
        </div>
      )}

      {/* Content Area */}
      <div className={`flex-1 min-h-0 overflow-hidden font-mono ${isLight ? 'text-slate-800' : 'text-gray-200'}`}>
        {children}
      </div>
    </div>
  );
};
