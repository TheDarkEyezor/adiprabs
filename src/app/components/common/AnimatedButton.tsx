'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

export interface AnimatedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  gradient?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  gradient = false,
  loading = false,
  fullWidth = false,
  children,
  className,
  ...props
}) => {
  const baseClasses =
    'relative inline-flex items-center justify-center font-semibold rounded-lg transition-all overflow-hidden';

  const variantClasses = {
    primary: gradient
      ? 'bg-gradient-to-r from-[#FF6B6B] to-[#FEC601] text-white'
      : 'bg-[#FF6B6B] text-white hover:bg-[#FF8585]',
    secondary: 'bg-white/10 text-white border border-white/20 hover:bg-white/20',
    ghost: 'bg-transparent text-white hover:bg-white/10',
    outline: 'bg-transparent text-white border-2 border-white/30 hover:border-white/60 hover:bg-white/5',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        loading && 'opacity-70 cursor-not-allowed',
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      disabled={loading || props.disabled}
      type={props.type}
      onClick={props.onClick}
      form={props.form}
      formAction={props.formAction as any}
    >
      {/* Ripple effect overlay */}
      <motion.div
        className="absolute inset-0 bg-white/20"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.5 }}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {loading ? (
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          icon
        )}
        {children}
      </span>
    </motion.button>
  );
};

export default AnimatedButton;
