'use client';
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { emitPhase, sleep, NAVIGATE_AT, EXIT_TOTAL } from '@/utils/pageTransition';

interface Props {
  href: string;
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  external?: boolean;
  className?: string;
}

export default function MagneticButton({ href, variant = 'primary', children, external, className }: Props) {
  const ref      = useRef<HTMLAnchorElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const router   = useRouter();
  const pathname = usePathname();

  const isInternal = !external && href.startsWith('/');

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos({
      x: (e.clientX - r.left - r.width / 2) * 0.18,
      y: (e.clientY - r.top  - r.height / 2) * 0.18,
    });
  };

  const onLeave = () => setPos({ x: 0, y: 0 });

  const handleClick = async (e: React.MouseEvent) => {
    if (!isInternal) return;
    if (href === pathname) return;
    e.preventDefault();
    emitPhase('in');
    await sleep(NAVIGATE_AT * 1000);
    router.push(href);
    await sleep(60);
    emitPhase('out');
    await sleep(EXIT_TOTAL * 1000);
    emitPhase('idle');
  };

  const variantCls =
    variant === 'primary'
      ? 'border border-teal-dim text-teal hover:bg-teal-dim/10'
      : 'border border-ink-line text-ink-fg2 hover:text-ink-fg hover:border-ink-line2';

  return (
    <motion.a
      ref={ref}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 350, damping: 20, mass: 0.5 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={handleClick}
      className={`inline-flex items-center gap-2 px-4 py-2.5 font-mono text-mono-sm rounded-sm transition-colors ${variantCls} ${className ?? ''}`}
    >
      {children}
    </motion.a>
  );
}
