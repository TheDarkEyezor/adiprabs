'use client';
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useMagneticEffect } from '@/hooks/useMouseEffects';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  onClick,
  variant = 'primary',
  disabled = false,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const magneticPosition = useMagneticEffect(buttonRef, 0.3);

  const variantClasses = {
    primary: 'bg-gradient-to-r from-[#FF6B6B] to-[#FEC601] text-white',
    secondary: 'glass-card border border-white/20 text-white hover:bg-white/10',
    ghost: 'bg-transparent text-white hover:bg-white/10',
  };

  return (
    <motion.button
      ref={buttonRef}
      className={`px-6 py-3 rounded-lg font-semibold transition-all ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      animate={{
        x: magneticPosition.x,
        y: magneticPosition.y,
      }}
      transition={{
        type: 'spring',
        stiffness: 150,
        damping: 15,
        mass: 0.1,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};

export default MagneticButton;
