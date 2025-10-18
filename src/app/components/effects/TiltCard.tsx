'use client';
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useCardTilt } from '@/hooks/useMouseEffects';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  intensity = 1,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const tilt = useCardTilt(cardRef);

  return (
    <motion.div
      ref={cardRef}
      className={`transform-gpu ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      animate={{
        rotateX: tilt.x * intensity,
        rotateY: tilt.y * intensity,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
    >
      {children}
    </motion.div>
  );
};

export default TiltCard;
