import React from 'react';
import { useDashboard } from '../../state/DashboardContext';

interface HudBoxProps {
  title: string;
  code?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'amber' | 'emerald';
  headerRight?: React.ReactNode;
}

export const HudBox: React.FC<HudBoxProps> = ({
  title,
  code,
  children,
  className = '',
  headerRight,
}) => {
  const { colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  return (
    <div
      className={`relative border w-full hud-box p-4 flex flex-col ${
        isLight ? 'bg-white/95 text-slate-900' : 'bg-[#040814]/90 text-cyan-100'
      } ${className}`}
      style={{
        borderColor: 'var(--color-accent-soft, rgba(6, 182, 212, 0.4))',
        boxShadow: isLight
          ? '0 2px 10px var(--color-glow, rgba(0,0,0,0.06))'
          : '0 0 20px var(--color-glow, rgba(0, 240, 255, 0.15))',
      }}
    >
      {/* 4 Tech Corner Brackets */}
      <span style={{ borderColor: 'var(--color-accent, #22d3ee)' }} className="absolute -top-[2px] -left-[2px] w-2.5 h-2.5 border-t-2 border-l-2" />
      <span style={{ borderColor: 'var(--color-accent, #22d3ee)' }} className="absolute -top-[2px] -right-[2px] w-2.5 h-2.5 border-t-2 border-r-2" />
      <span style={{ borderColor: 'var(--color-accent, #22d3ee)' }} className="absolute -bottom-[2px] -left-[2px] w-2.5 h-2.5 border-b-2 border-l-2" />
      <span style={{ borderColor: 'var(--color-accent, #22d3ee)' }} className="absolute -bottom-[2px] -right-[2px] w-2.5 h-2.5 border-b-2 border-r-2" />

      {/* Header */}
      <div
        className="flex items-center justify-between pb-2 mb-3 border-b text-xs font-mono shrink-0"
        style={{ borderColor: 'var(--color-accent-soft, rgba(6, 182, 212, 0.2))' }}
      >
        <div className="flex items-center space-x-2 truncate">
          <span style={{ color: 'var(--color-accent, #22d3ee)' }} className="text-[10px]">❖</span>
          <h3 style={{ color: 'var(--color-accent, #22d3ee)' }} className="font-bold uppercase tracking-wider truncate">
            {title}
          </h3>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          {code && (
            <span
              className="px-1.5 py-0.5 text-[9px] font-mono border rounded-sm"
              style={{
                backgroundColor: 'var(--theme-accent-soft, rgba(6, 182, 212, 0.15))',
                borderColor: 'var(--color-accent, #22d3ee)',
                color: 'var(--color-accent, #22d3ee)',
              }}
            >
              {code}
            </span>
          )}
          {headerRight}
        </div>
      </div>

      <div className={`flex-1 min-h-0 ${isLight ? 'text-slate-800' : 'text-cyan-100'}`}>
        {children}
      </div>
    </div>
  );
};
