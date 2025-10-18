'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

export interface SectionHeadingProps {
  children: React.ReactNode;
  subtitle?: string;
  className?: string;
  gradient?: boolean;
  align?: 'left' | 'center' | 'right';
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  children,
  subtitle,
  className,
  gradient = false,
  align = 'left',
}) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <motion.div
      className={cn('mb-12', alignClasses[align], className)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h2
        className={cn(
          'text-4xl md:text-5xl lg:text-6xl font-bold mb-4',
          gradient && 'bg-gradient-to-r from-[#FF6B6B] via-[#FEC601] to-[#52B788] bg-clip-text text-transparent'
        )}
      >
        {children}
      </h2>
      {subtitle && (
        <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeading;
