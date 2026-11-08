import React from 'react';

interface HudBoxProps {
  title: string;
  code?: string;
  children: React.ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'amber' | 'emerald';
}

export const HudBox: React.FC<HudBoxProps> = ({
  title,
  code,
  children,
  className = '',
  glowColor = 'cyan',
}) => {
  const colorMap = {
    cyan: {
      border: 'border-cyan-500/40',
      text: 'text-cyan-400',
      corner: 'border-cyan-400',
      badge: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/50',
    },
    amber: {
      border: 'border-amber-500/40',
      text: 'text-amber-400',
      corner: 'border-amber-400',
      badge: 'bg-amber-950/60 text-amber-300 border-amber-500/50',
    },
    emerald: {
      border: 'border-emerald-500/40',
      text: 'text-emerald-400',
      corner: 'border-emerald-400',
      badge: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50',
    },
  }[glowColor];

  return (
    <div className={`relative border ${colorMap.border} bg-[#040814]/90 p-4 shadow-[0_0_20px_rgba(0,240,255,0.08)] flex flex-col ${className}`}>
      {/* 4 Tech Corner Brackets */}
      <span className={`absolute -top-[2px] -left-[2px] w-2.5 h-2.5 border-t-2 border-l-2 ${colorMap.corner}`} />
      <span className={`absolute -top-[2px] -right-[2px] w-2.5 h-2.5 border-t-2 border-r-2 ${colorMap.corner}`} />
      <span className={`absolute -bottom-[2px] -left-[2px] w-2.5 h-2.5 border-b-2 border-l-2 ${colorMap.corner}`} />
      <span className={`absolute -bottom-[2px] -right-[2px] w-2.5 h-2.5 border-b-2 border-r-2 ${colorMap.corner}`} />

      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-cyan-500/20 text-xs font-mono">
        <div className="flex items-center space-x-2">
          <span className="text-cyan-500 text-[10px]">❖</span>
          <h3 className={`font-bold uppercase tracking-wider ${colorMap.text}`}>
            {title}
          </h3>
        </div>
        {code && (
          <span className={`px-1.5 py-0.5 text-[9px] font-mono border ${colorMap.badge}`}>
            {code}
          </span>
        )}
      </div>

      <div className="flex-1 min-h-0">
        {children}
      </div>
    </div>
  );
};
