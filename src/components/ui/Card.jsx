import React from 'react';

export const Card = ({
  children,
  className = '',
  hover = false,
  glass = false,
  ...props
}) => {
  return (
    <div
      className={`rounded-xl border transition-all duration-200 ${
        glass ? 'glass-panel' : 'bg-[#0D1B2E] border-[#1E314B]'
      } ${
        hover ? 'hover:border-[#2D8CFF]/50 hover:shadow-card hover:-translate-y-0.5' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, action, className = '' }) => (
  <div className={`p-5 pb-3 flex items-start justify-between border-b border-[#1E314B]/60 ${className}`}>
    <div>
      {title && <h3 className="font-semibold text-white text-base tracking-tight">{title}</h3>}
      {subtitle && <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>}
    </div>
    {action && <div className="ml-4 flex-shrink-0">{action}</div>}
  </div>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`p-5 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`p-4 pt-3 border-t border-[#1E314B]/60 bg-[#071426]/40 rounded-b-xl ${className}`}>
    {children}
  </div>
);
