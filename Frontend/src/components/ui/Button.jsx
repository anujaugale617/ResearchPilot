import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#071426] disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-[#2D8CFF] hover:bg-[#1E74DB] text-white shadow-glow-primary focus:ring-[#2D8CFF]',
    secondary: 'bg-[#0D1B2E] hover:bg-[#14243B] text-white border border-[#1E314B] hover:border-[#2D8CFF] focus:ring-[#2D8CFF]',
    accent: 'bg-[#35D9E8] hover:bg-[#28B8C5] text-[#071426] font-semibold shadow-glow-accent focus:ring-[#35D9E8]',
    outline: 'bg-transparent border border-[#1E314B] text-text-muted hover:text-white hover:border-[#35D9E8] focus:ring-[#35D9E8]',
    danger: 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 focus:ring-red-500',
    ghost: 'bg-transparent hover:bg-[#14243B] text-text-muted hover:text-white',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
};
