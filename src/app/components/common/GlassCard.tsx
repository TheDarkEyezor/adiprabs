'use client';
import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';

export interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  variant?: 'default' | 'interactive' | 'feature';
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  gradient?: string;
  blur?: 'sm' | 'md' | 'lg';
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      variant = 'default',
      children,
      className,
      hoverEffect = false,
      gradient,
      blur = 'md',
      ...motionProps
    },
    ref
  ) => {
    const baseClasses = 'rounded-2xl border backdrop-blur-md';
    
    const variantClasses = {
      default: 'bg-white/5 border-white/10',
      interactive: 'bg-white/10 border-white/20 cursor-pointer',
      feature: 'bg-white/5 border-white/30',
    };

    const blurClasses = {
      sm: 'backdrop-blur-sm',
      md: 'backdrop-blur-md',
      lg: 'backdrop-blur-lg',
    };

    const hoverClasses = hoverEffect
      ? 'transition-all duration-300 hover:bg-white/15 hover:border-white/30 hover:shadow-2xl'
      : '';

    return (
      <motion.div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          blurClasses[blur],
          hoverClasses,
          'relative', // Ensure relative positioning for absolute children
          className
        )}
        whileHover={
          hoverEffect
            ? {
                scale: 1.02,
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              }
            : undefined
        }
        whileTap={hoverEffect ? { scale: 0.98 } : undefined}
        {...motionProps}
      >
        {gradient && (
          <div
            className={`absolute inset-0 rounded-2xl opacity-30 ${gradient}`}
          />
        )}
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

export default GlassCard;
