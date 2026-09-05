import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const variants = {
    default: 'bg-[#1E314B]/60 text-text-muted border-[#1E314B]',
    primary: 'bg-[#2D8CFF]/15 text-[#2D8CFF] border-[#2D8CFF]/30',
    accent: 'bg-[#35D9E8]/15 text-[#35D9E8] border-[#35D9E8]/30',
    success: 'bg-[#43E6D5]/15 text-[#43E6D5] border-[#43E6D5]/30',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    danger: 'bg-red-500/15 text-red-400 border-red-500/30',
    purple: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    // Status presets
    planning: 'bg-[#2D8CFF]/15 text-[#2D8CFF] border-[#2D8CFF]/30',
    researching: 'bg-[#35D9E8]/15 text-[#35D9E8] border-[#35D9E8]/30 animate-pulse-subtle',
    verifying: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    synthesizing: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    completed: 'bg-[#43E6D5]/15 text-[#43E6D5] border-[#43E6D5]/30',
    failed: 'bg-red-500/15 text-red-400 border-red-500/30',
    demo: 'bg-gradient-to-r from-[#2D8CFF]/20 to-[#35D9E8]/20 text-[#35D9E8] border-[#35D9E8]/40 font-mono font-semibold',
  };

  const dotColors = {
    default: 'bg-text-muted',
    primary: 'bg-[#2D8CFF]',
    accent: 'bg-[#35D9E8]',
    success: 'bg-[#43E6D5]',
    warning: 'bg-amber-400',
    danger: 'bg-red-400',
    purple: 'bg-purple-400',
    researching: 'bg-[#35D9E8] animate-ping',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border select-none ${
        variants[variant] || variants.default
      } ${sizes[size] || sizes.md} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            dotColors[variant] || dotColors.default
          }`}
        />
      )}
      {children}
    </span>
  );
};
