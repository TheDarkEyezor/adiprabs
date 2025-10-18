'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface GradientMorphBackgroundProps {
  interactive?: boolean;
}

const GradientMorphBackground: React.FC<GradientMorphBackgroundProps> = ({
  interactive = true,
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [timeOffset, setTimeOffset] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactive]);

  useEffect(() => {
    // Animate based on time
    const interval = setInterval(() => {
      setTimeOffset((prev) => (prev + 1) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Calculate colors based on time and mouse position
  const color1 = `hsl(${(timeOffset + mousePosition.x) % 360}, 70%, 50%)`;
  const color2 = `hsl(${(timeOffset + mousePosition.y + 120) % 360}, 70%, 40%)`;
  const color3 = `hsl(${(timeOffset + (mousePosition.x + mousePosition.y) / 2 + 240) % 360}, 70%, 35%)`;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Multiple gradient blobs */}
      <motion.div
        className="absolute rounded-full blur-3xl opacity-30"
        style={{
          width: '40%',
          height: '40%',
          background: `radial-gradient(circle, ${color1}, transparent)`,
        }}
        animate={{
          x: [`${mousePosition.x - 20}%`, `${mousePosition.x - 10}%`, `${mousePosition.x - 20}%`],
          y: [`${mousePosition.y - 20}%`, `${mousePosition.y - 30}%`, `${mousePosition.y - 20}%`],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute rounded-full blur-3xl opacity-30"
        style={{
          width: '50%',
          height: '50%',
          background: `radial-gradient(circle, ${color2}, transparent)`,
        }}
        animate={{
          x: [`${100 - mousePosition.x}%`, `${90 - mousePosition.x}%`, `${100 - mousePosition.x}%`],
          y: [`${mousePosition.y}%`, `${mousePosition.y + 10}%`, `${mousePosition.y}%`],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute rounded-full blur-3xl opacity-20"
        style={{
          width: '60%',
          height: '60%',
          background: `radial-gradient(circle, ${color3}, transparent)`,
        }}
        animate={{
          x: [`${mousePosition.x}%`, `${mousePosition.x + 20}%`, `${mousePosition.x}%`],
          y: [`${100 - mousePosition.y}%`, `${90 - mousePosition.y}%`, `${100 - mousePosition.y}%`],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Overlay to maintain base gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] mix-blend-multiply"
        style={{ opacity: 0.8 }}
      />
    </div>
  );
};

export default GradientMorphBackground;
