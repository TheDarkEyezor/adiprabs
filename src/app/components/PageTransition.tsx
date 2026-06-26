'use client';
import React, { useEffect, useRef, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

// ─── Grid config ────────────────────────────────────────────────────────────
const COLS = 10;
const ROWS = 6;
const MAX_DIAG = (ROWS - 1) + (COLS - 1); // 13
const STAGGER   = 0.26;   // total diagonal spread (s)
const TILE_DUR  = 0.38;   // per-tile slide duration (s)
// Last tile finishes at: STAGGER + TILE_DUR = 0.64s
const NAVIGATE_AT  = STAGGER + TILE_DUR + 0.04; // 0.68s — navigate while fully covered
const EXIT_TOTAL   = STAGGER + TILE_DUR;         // 0.64s to fully reveal new page

type Phase = 'idle' | 'in' | 'out';

// ─── Tile — uses translateY so no sub-pixel gaps ever ───────────────────────
function Tile({ row, col, phase }: { row: number; col: number; phase: 'in' | 'out' }) {
  const diag  = row + col;
  const delay = (diag / MAX_DIAG) * STAGGER;
  const isIn  = phase === 'in';

  return (
    <motion.div
      key={`${phase}-${row}-${col}`}
      style={{ gridColumn: col + 1, gridRow: row + 1, willChange: 'transform' }}
      className="bg-ink-bg"
      initial={{ y: isIn ? '-105%' : '0%' }}
      animate={{ y: isIn ? '0%'   : '-105%' }}
      transition={{
        duration: TILE_DUR,
        delay,
        ease: [0.76, 0, 0.24, 1],
      }}
    />
  );
}

// ─── AP monogram shown while screen is fully covered ────────────────────────
function Monogram({ phase }: { phase: 'in' | 'out' }) {
  const isIn = phase === 'in';
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      initial={{ opacity: isIn ? 0 : 1, scale: isIn ? 0.94 : 1 }}
      animate={{ opacity: isIn ? 1 : 0, scale: isIn ? 1 : 0.94 }}
      transition={{
        duration: 0.28,
        delay: isIn ? (STAGGER + TILE_DUR * 0.65) : 0,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <span
        className="font-mono font-medium text-teal select-none"
        style={{ fontSize: 'clamp(3.5rem, 9vw, 7rem)', letterSpacing: '0.3em' }}
      >
        AP
      </span>
    </motion.div>
  );
}

// ─── Main overlay ────────────────────────────────────────────────────────────
export default function PageTransition() {
  const router     = useRouter();
  const phaseRef   = useRef<Phase>('idle');
  const [phase, setPhaseState] = useState<Phase>('idle');
  const pendingRef = useRef<string | null>(null);

  const setPhase = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhaseState(p);
  }, []);

  const startTransition = useCallback((href: string) => {
    if (phaseRef.current !== 'idle') return;
    pendingRef.current = href;
    setPhase('in');

    // Navigate only after tiles fully cover the screen
    setTimeout(() => {
      router.push(pendingRef.current!);
      // Small paint delay, then start reveal
      setTimeout(() => {
        setPhase('out');
        setTimeout(() => setPhase('idle'), (EXIT_TOTAL + 0.1) * 1000);
      }, 80);
    }, NAVIGATE_AT * 1000);
  }, [router, setPhase]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      // Only left-click, no modifier keys
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const a = (e.target as Element).closest<HTMLAnchorElement>('a[href]');
      if (!a) return;

      const href = a.getAttribute('href');
      if (!href || !href.startsWith('/')) return;  // external / mailto / hash
      if (a.target === '_blank') return;            // new-tab links
      if (/\.[a-z]{2,4}$/i.test(href)) return;     // files (.pdf, .png …)
      if (href === window.location.pathname) return; // already on this page

      // ── Capture phase: run BEFORE Next.js <Link> onClick ──
      // stopPropagation prevents the event reaching Link's handler,
      // so router.push() is NOT called until we decide to call it.
      e.stopPropagation();
      e.preventDefault();
      startTransition(href);
    };

    // capture: true — fires before any element's own handlers
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [startTransition]);

  if (phase === 'idle') return null;

  const activePhase = phase as 'in' | 'out';

  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{
        zIndex: 400,
        display: 'grid',
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
      }}
    >
      {Array.from({ length: ROWS }, (_, r) =>
        Array.from({ length: COLS }, (_, c) => (
          <Tile key={`${activePhase}-${r}-${c}`} row={r} col={c} phase={activePhase} />
        )),
      )}
      <Monogram phase={activePhase} />
    </div>
  );
}
