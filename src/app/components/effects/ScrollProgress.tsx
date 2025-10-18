'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useScrollProgress } from '@/hooks/useScrollProgress';

const ScrollProgress: React.FC = () => {
  const progress = useScrollProgress();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF6B6B] via-[#FEC601] to-[#52B788] origin-left z-50"
      style={{ scaleX: progress / 100 }}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: progress / 100 }}
      transition={{ duration: 0.1 }}
    />
  );
};

export default ScrollProgress;
