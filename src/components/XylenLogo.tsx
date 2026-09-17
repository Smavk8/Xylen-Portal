import React from 'react';

interface XylenLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const XylenLogo: React.FC<XylenLogoProps> = ({ className = '', size = 'md' }) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Icon with circular ring and phone symbol */}
      <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-400 p-0.5 shadow-sm shadow-blue-500/20">
        <div className="w-full h-full rounded-full bg-white flex items-center justify-center relative overflow-hidden">
          {/* Subtle decorative orbital ring */}
          <div className="absolute inset-1 rounded-full border border-blue-200/70" />
          
          {/* Mobile phone glyph */}
          <div className="relative z-10 w-4 h-6 rounded-[3px] bg-gradient-to-b from-blue-600 to-sky-600 flex flex-col items-center justify-between p-[2px] shadow-[0_1px_3px_rgba(30,64,175,0.4)]">
            <div className="w-1.5 h-[1.5px] bg-white/70 rounded-full" />
            <div className="w-full h-3 rounded-[1px] bg-white/20" />
            <div className="w-1 h-1 rounded-full bg-white/80" />
          </div>
        </div>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <span className="text-[20px] font-extrabold tracking-tight text-[#15437a] dark:text-blue-400 leading-none">
          Xylen
        </span>
        <span className="text-[9px] font-bold tracking-[0.2em] text-slate-800 dark:text-slate-200 leading-tight mt-0.5">
          MANAGEMENT
        </span>
      </div>
    </div>
  );
};
