'use client';
import React, { useEffect, useRef } from 'react';

/**
 * HeroGrid — a single, tasteful piece of eye candy.
 * A subtle teal grid where the cursor reveals a soft radial light through it.
 * Disabled on touch devices and respects prefers-reduced-motion.
 */
export default function HeroGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);
  const target = useRef({ x: 50, y: 40 });
  const current = useRef({ x: 50, y: 40 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;
    if (window.matchMedia('(hover: none)').matches) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      target.current.x = ((e.clientX - rect.left) / rect.width) * 100;
      target.current.y = ((e.clientY - rect.top) / rect.height) * 100;
    };

    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.08;
      current.current.y += (target.current.y - current.current.y) * 0.08;
      el.style.setProperty('--mx', `${current.current.x}%`);
      el.style.setProperty('--my', `${current.current.y}%`);
      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove);
    raf.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{
        // CSS vars used by the mask below
        // @ts-ignore
        '--mx': '50%',
        // @ts-ignore
        '--my': '40%',
      } as React.CSSProperties}
    >
      {/* Base subtle grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(94,234,212,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(94,234,212,0.06) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          WebkitMaskImage:
            'radial-gradient(ellipse 85% 70% at 50% 40%, #000 30%, transparent 80%)',
          maskImage:
            'radial-gradient(ellipse 85% 70% at 50% 40%, #000 30%, transparent 80%)',
        }}
      />
      {/* Cursor-following soft glow grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(94,234,212,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(94,234,212,0.35) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          WebkitMaskImage:
            'radial-gradient(circle 220px at var(--mx) var(--my), #000 0%, transparent 70%)',
          maskImage:
            'radial-gradient(circle 220px at var(--mx) var(--my), #000 0%, transparent 70%)',
          transition: 'opacity 300ms ease',
        }}
      />
      {/* Faint vignette to seat the hero */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(20,184,166,0.08), transparent 60%)',
        }}
      />
    </div>
  );
}
