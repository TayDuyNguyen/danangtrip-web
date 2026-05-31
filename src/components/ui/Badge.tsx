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
    primary: 'border-primary/10 bg-primary/10 text-on-surface',
    secondary: 'border-border bg-[#f7f7f7] text-on-surface-subtle',
    outline: 'border border-border bg-transparent text-on-surface-subtle',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-600',
    warning: 'border-amber-200 bg-amber-50 text-amber-700',
    error: 'border-rose-200 bg-rose-50 text-rose-600',
    ghost: 'border-border bg-white/90 text-on-surface shadow-sm backdrop-blur-[12px]',
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
