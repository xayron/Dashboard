import React from 'react';

interface BrutalistBoxProps {
  title: string;
  badge?: string;
  badgeColor?: string;
  children: React.ReactNode;
  className?: string;
  shadowColor?: string;
}

export const BrutalistBox: React.FC<BrutalistBoxProps> = ({
  title,
  badge,
  badgeColor = 'bg-yellow-400 text-black',
  children,
  className = '',
  shadowColor = 'shadow-[4px_4px_0px_rgba(255,255,255,0.9)]',
}) => {
  return (
    <div className={`border-2 border-white bg-black p-4 ${shadowColor} flex flex-col ${className}`}>
      {/* Title & Badge Header */}
      <div className="flex items-center justify-between pb-2.5 mb-3 border-b-2 border-white/40">
        <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center">
          <span className="w-2 h-2 mr-2 inline-block" style={{ backgroundColor: 'var(--color-accent, #facc15)' }} />
          {title}
        </h3>
        {badge && (
          <span
            className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-black border border-black shadow-[2px_2px_0px_#000]"
            style={{ backgroundColor: 'var(--color-accent, #facc15)' }}
          >
            {badge}
          </span>
        )}
      </div>

      <div className="flex-1 min-h-0">
        {children}
      </div>
    </div>
  );
};
