import React from 'react';
import { useDashboard } from '../../state/DashboardContext';

interface BrutalistBoxProps {
  title: string;
  badge?: React.ReactNode;
  badgeColor?: string;
  children: React.ReactNode;
  className?: string;
  shadowColor?: string;
  headerRight?: React.ReactNode;
}

export const BrutalistBox: React.FC<BrutalistBoxProps> = ({
  title,
  badge,
  badgeColor = 'bg-yellow-400 text-black',
  children,
  className = '',
  shadowColor,
  headerRight,
}) => {
  const { colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  return (
    <div
      className={`border-2 brutalist-card p-4 flex flex-col ${
        isLight ? 'border-black bg-white text-black' : 'border-white bg-black text-white'
      } ${className}`}
      style={{
        boxShadow: shadowColor ? undefined : isLight ? '4px 4px 0px var(--color-accent, #000)' : '4px 4px 0px var(--color-accent, #fff)',
      }}
    >
      {/* Title & Badge Header */}
      <div className={`flex items-center justify-between pb-2.5 mb-3 border-b-2 shrink-0 ${isLight ? 'border-black/30' : 'border-white/40'}`}>
        <h3 className={`text-xs font-black uppercase tracking-wider flex items-center ${isLight ? 'text-black' : 'text-white'}`}>
          <span className="w-2 h-2 mr-2 inline-block" style={{ backgroundColor: 'var(--color-accent, #facc15)' }} />
          {title}
        </h3>
        <div className="flex items-center space-x-2 shrink-0">
          {badge && (
            <span
              className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-black border border-black shadow-[2px_2px_0px_#000]"
              style={{ backgroundColor: 'var(--color-accent, #facc15)' }}
            >
              {badge}
            </span>
          )}
          {headerRight}
        </div>
      </div>

      <div className={`flex-1 min-h-0 ${isLight ? 'text-black' : 'text-white'}`}>
        {children}
      </div>
    </div>
  );
};
