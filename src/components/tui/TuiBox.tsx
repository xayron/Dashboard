import React from 'react';

interface TuiBoxProps {
  title?: string;
  badge?: string;
  badgeColor?: string;
  children: React.ReactNode;
  className?: string;
  borderStyle?: 'single' | 'double' | 'rounded';
  headerRight?: React.ReactNode;
}

export const TuiBox: React.FC<TuiBoxProps> = ({
  title,
  badge,
  badgeColor = 'text-emerald-400',
  children,
  className = '',
  borderStyle = 'single',
  headerRight,
}) => {
  return (
    <div
      className={`font-mono border border-emerald-500/40 bg-black/90 p-3 rounded-none relative flex flex-col ${className}`}
      style={{
        boxShadow: '0 0 15px rgba(16, 185, 129, 0.08)',
      }}
    >
      {/* Terminal Title Bar */}
      {(title || headerRight || badge) && (
        <div className="flex items-center justify-between text-xs pb-2 mb-2 border-b border-emerald-500/30 text-emerald-400 font-bold uppercase tracking-wider select-none">
          <div className="flex items-center space-x-2 truncate">
            <span className="text-emerald-500 font-extrabold">&gt;</span>
            {title && <span>{title}</span>}
            {badge && (
              <span className={`text-[10px] px-1.5 py-0.2 bg-emerald-950/80 border border-emerald-500/40 rounded ${badgeColor}`}>
                [{badge}]
              </span>
            )}
          </div>
          {headerRight && <div className="text-emerald-300/80 text-[11px] shrink-0">{headerRight}</div>}
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 min-h-0 overflow-hidden font-mono text-gray-200">
        {children}
      </div>
    </div>
  );
};
