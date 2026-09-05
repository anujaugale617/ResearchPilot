import React from 'react';

export const ProgressBar = ({
  value = 0,
  max = 100,
  showLabel = false,
  size = 'md',
  variant = 'gradient',
  className = '',
}) => {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const variants = {
    gradient: 'bg-gradient-to-r from-[#2D8CFF] via-[#35D9E8] to-[#43E6D5]',
    primary: 'bg-[#2D8CFF]',
    accent: 'bg-[#35D9E8]',
    success: 'bg-[#43E6D5]',
    warning: 'bg-amber-400',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs text-text-muted mb-1.5">
          <span>Progress</span>
          <span className="font-mono text-white font-medium">{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-[#071426] border border-[#1E314B] rounded-full overflow-hidden p-0.5 ${sizes[size]}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${variants[variant] || variants.gradient}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
