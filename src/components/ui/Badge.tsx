import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'warning' | 'error' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: ReactNode;
}

const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  icon,
}: BadgeProps) => {
  const variants = {
    primary: 'bg-[#171717] text-white border-[#262626]',
    secondary: 'bg-[#080808] text-[#737373] border-[#262626]',
    outline: 'bg-transparent text-[#737373] border-[#404040] border',
    success: 'bg-[#1a1f14] text-[#929852] border-[#2f3b25]',
    warning: 'bg-[#2b1f14] text-[#c59a5f] border-[#5c3822]',
    error: 'bg-[#2a1616] text-[#d88484] border-[#5f2f2f]',
    ghost: 'bg-[#080808]/70 backdrop-blur-[12px] text-white border-[#262626]',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full border font-medium transition-all duration-300',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {icon && <span className="mr-1.5">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
