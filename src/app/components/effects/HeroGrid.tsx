'use client';
import { useEffect, useRef } from 'react';

// ── Physics constants ────────────────────────────────────────────────────────
const COLS      = 22;   // grid columns
const ROWS      = 13;   // grid rows
const PUSH_R    = 220;  // cursor influence radius (px)
const PUSH_F    = 30;   // max push displacement (px)
const K_SPRING  = 0.07; // spring constant — lower = slower settle, more oscillation
const K_DAMP    = 0.83; // velocity damping — lower = more bouncy waves
const LINE_A    = 0.11; // base grid line opacity

// Geometry Wars style: cursor pushes the grid mesh, spring physics
// propagates the disturbance outward as each point oscillates back.
export default function HeroGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none)').matches) return;

    const ctx = canvas.getContext('2d')!;

    type Pt = { bx: number; by: number; x: number; y: number; vx: number; vy: number };
    let pts: Pt[] = [];
    let W = 0, H = 0;
    let mx = -9999, my = -9999; // cursor position in canvas CSS px
    let raf = 0;

    // ── Initialise / resize ──────────────────────────────────────────────────
    const init = () => {
      const dpr = window.devicePixelRatio || 1;
      W = canvas.offsetWidth  || window.innerWidth;
      H = canvas.offsetHeight || 500;
      canvas.width  = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width  = `${W}px`;
      canvas.style.height = `${H}px`;
      // setTransform resets any previous scale before applying the new one
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      pts = [];
      for (let r = 0; r <= ROWS; r++) {
        for (let c = 0; c <= COLS; c++) {
          const bx = (c / COLS) * W;
          const by = (r / ROWS) * H;
          pts.push({ bx, by, x: bx, y: by, vx: 0, vy: 0 });
        }
      }
    };

    // ── Animation loop ───────────────────────────────────────────────────────
    const tick = () => {
      ctx.clearRect(0, 0, W, H);

      // Physics: spring + cursor push
      for (const p of pts) {
        // Spring back to base position
        p.vx += (p.bx - p.x) * K_SPRING;
        p.vy += (p.by - p.y) * K_SPRING;

        // Cursor repulsion
        const dx = p.bx - mx;
        const dy = p.by - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < PUSH_R * PUSH_R && d2 > 0) {
          const d = Math.sqrt(d2);
          // Force falls off linearly with distance; use base position so
          // the effect doesn't chain-repulse already-displaced points
          const f = (1 - d / PUSH_R) * PUSH_F;
          p.vx += (dx / d) * f * 0.20;
          p.vy += (dy / d) * f * 0.20;
        }

        p.vx *= K_DAMP;
        p.vy *= K_DAMP;
        p.x  += p.vx;
        p.y  += p.vy;
      }

      // ── Draw ────────────────────────────────────────────────────────────────
      const I = (r: number, c: number) => r * (COLS + 1) + c;

      ctx.lineWidth    = 1;
      ctx.strokeStyle  = `rgba(94,234,212,${LINE_A})`;

      // Horizontal polylines — one beginPath/stroke per row (efficient)
      for (let r = 0; r <= ROWS; r++) {
        ctx.beginPath();
        for (let c = 0; c <= COLS; c++) {
          const p = pts[I(r, c)];
          c === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }

      // Vertical polylines — one beginPath/stroke per column
      for (let c = 0; c <= COLS; c++) {
        ctx.beginPath();
        for (let r = 0; r <= ROWS; r++) {
          const p = pts[I(r, c)];
          r === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }

      raf = requestAnimationFrame(tick);
    };

    // ── Events ───────────────────────────────────────────────────────────────
    // Canvas is pointer-events:none — listen on the parent section instead
    const section = canvas.closest('section') as HTMLElement | null ?? canvas.parentElement!;

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
    };
    const onLeave = () => { mx = -9999; my = -9999; };
    const onResize = () => init();

    section.addEventListener('mousemove', onMove);
    section.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', onResize, { passive: true });

    init();
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      section.removeEventListener('mousemove', onMove);
      section.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
