'use client';
import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);
  const [hovered, setHovered]   = useState(false);
  const [visible, setVisible]   = useState(false);
  const [mounted, setMounted]   = useState(false);

  // Only run on fine-pointer devices (desktop)
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    setMounted(true);
  }, []);

  const spring = { stiffness: 500, damping: 28, mass: 0.5 };
  const x = useSpring(cursorX, spring);
  const y = useSpring(cursorY, spring);

  useEffect(() => {
    if (!mounted) return;

    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setVisible(true);
    };
    const onOver = (e: MouseEvent) => {
      setHovered(!!(e.target as Element).closest('a, button, [role="button"], input, textarea'));
    };
    const onLeave = () => setVisible(false);

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseleave', onLeave);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [mounted, cursorX, cursorY]);

  if (!mounted) return null;

  // Dot size: 8px idle, 22px ring on hover
  const size    = hovered ? 22 : 8;
  const offset  = -size / 2;

  return (
    // Outer div tracks cursor position (spring-smoothed)
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[500]"
      style={{ x, y }}
    >
      {/* Inner div is the visible dot/ring, centered at the cursor point */}
      <motion.div
        className="absolute rounded-full"
        animate={{
          width:           size,
          height:          size,
          x:               offset,
          y:               offset,
          opacity:         visible ? 1 : 0,
          backgroundColor: hovered ? 'transparent' : 'var(--teal)',
          borderWidth:     hovered ? 1.5 : 0,
          borderColor:     'var(--teal)',
          borderStyle:     'solid',
        }}
        transition={{
          width:           { type: 'spring', stiffness: 300, damping: 20 },
          height:          { type: 'spring', stiffness: 300, damping: 20 },
          x:               { type: 'spring', stiffness: 300, damping: 20 },
          y:               { type: 'spring', stiffness: 300, damping: 20 },
          opacity:         { duration: 0.15 },
          backgroundColor: { duration: 0.12 },
          borderWidth:     { duration: 0.12 },
        }}
      />
    </motion.div>
  );
}
