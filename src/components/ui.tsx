import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
      secondary: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm',
      outline: 'border-2 border-gray-200 bg-transparent hover:bg-gray-50 text-gray-900',
      ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
      danger: 'bg-red-100 text-red-900 hover:bg-red-200',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 py-2 text-sm',
      lg: 'h-12 px-6 text-base',
    };

    return (
      <motion.button
        whileTap={{ scale: 0.97 }}
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn("bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", className)}>
    {children}
  </div>
);

export const Badge = ({ children, variant = 'default' }: { children: React.ReactNode, variant?: 'default' | 'success' | 'warning' | 'neutral' }) => {
    const variants = {
        default: "bg-gray-100 text-gray-800",
        success: "bg-green-100 text-green-800",
        warning: "bg-yellow-100 text-yellow-800",
        neutral: "bg-slate-100 text-slate-600"
    }
    return (
        <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold", variants[variant])}>
            {children}
        </span>
    )
}
