'use client';
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export interface ParticleFieldProps {
  count?: number;
  colors?: string[];
  className?: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
  moveX: number;
  moveY: number;
}

const ParticleField: React.FC<ParticleFieldProps> = ({
  count = 50,
  colors = ['#FF6B6B', '#FEC601', '#52B788', '#4A90E2'],
  className = '',
}) => {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 5 + 8, // Faster: 8-13 seconds
      delay: Math.random() * 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      moveX: (Math.random() - 0.5) * 60, // More visible movement: ±60px
      moveY: (Math.random() - 0.5) * 60, // More visible movement: ±60px
    }));
  }, [count, colors]);

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
          }}
          initial={{ opacity: 0.3 }}
          animate={{
            x: [`0px`, `${particle.moveX}px`, `${-particle.moveX}px`, `0px`],
            y: [`0px`, `${particle.moveY}px`, `${-particle.moveY}px`, `0px`],
            opacity: [0.3, 0.6, 0.3, 0.3],
            scale: [1, 1.2, 1, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

export default ParticleField;
