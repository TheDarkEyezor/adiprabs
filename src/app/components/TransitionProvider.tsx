'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  subscribePhase,
  type TilePhase,
  TILE_COLS,
  TILE_ROWS,
  TILE_STAGGER,
  TILE_DUR,
} from '@/utils/pageTransition';

const MAX_DIAG = (TILE_ROWS - 1) + (TILE_COLS - 1);

function Tile({ row, col, phase }: { row: number; col: number; phase: 'in' | 'out' }) {
  const delay = ((row + col) / MAX_DIAG) * TILE_STAGGER;
  const isIn  = phase === 'in';
  return (
    <motion.div
      style={{
        gridColumn: col + 1,
        gridRow: row + 1,
        transformOrigin: 'top center',
        willChange: 'transform',
      }}
      className="bg-ink-bg"
      // scaleX 1.02 + scaleY 1.02 at full coverage ensures a 2% physical
      // overlap on every edge — eliminates sub-pixel gaps at all screen sizes.
      initial={{ scaleY: isIn ? 0 : 1.02, scaleX: 1.02 }}
      animate={{ scaleY: isIn ? 1.02 : 0, scaleX: 1.02 }}
      transition={{ duration: TILE_DUR, delay, ease: [0.76, 0, 0.24, 1] }}
    />
  );
}

function Monogram({ phase }: { phase: 'in' | 'out' }) {
  const isIn = phase === 'in';
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      initial={{ opacity: isIn ? 0 : 1, scale: isIn ? 0.94 : 1 }}
      animate={{ opacity: isIn ? 1   : 0, scale: isIn ? 1    : 0.94 }}
      transition={{
        duration: 0.25,
        delay: isIn ? TILE_STAGGER + TILE_DUR * 0.6 : 0,
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

function TileOverlay({ phase }: { phase: 'in' | 'out' }) {
  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{
        zIndex: 400,
        display: 'grid',
        gridTemplateColumns: `repeat(${TILE_COLS}, 1fr)`,
        gridTemplateRows: `repeat(${TILE_ROWS}, 1fr)`,
      }}
    >
      {Array.from({ length: TILE_ROWS }, (_, r) =>
        Array.from({ length: TILE_COLS }, (_, c) => (
          <Tile key={`${phase}-${r}-${c}`} row={r} col={c} phase={phase} />
        )),
      )}
      <Monogram phase={phase} />
    </div>
  );
}

export default function TransitionProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<TilePhase>('idle');

  useEffect(() => subscribePhase(setPhase), []);

  return (
    <>
      {phase !== 'idle' && <TileOverlay phase={phase as 'in' | 'out'} />}
      {children}
    </>
  );
}
