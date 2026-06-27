'use client';
import { useEffect, useRef } from 'react';

// ── Physics constants ─────────────────────────────────────────────────────────
const COLS       = 22;    // grid columns
const ROWS       = 13;    // grid rows
const PUSH_R     = 230;   // cursor influence radius (px)
const PUSH_F     = 38;    // base max displacement (px) — scaled by cursor speed
const K_SPRING   = 0.035; // pull-to-base spring — lower lets waves travel further
const K_NEIGHBOR = 0.10;  // neighbor coupling — THIS is what propagates the wave
const K_DAMP     = 0.86;  // velocity damping — lower = waves travel more cells
const LINE_A     = 0.11;  // base grid line opacity

// How it works:
// 1. Cursor pushes nearby grid points away from their base positions.
// 2. Each point is also coupled to its 4 neighbours (up/down/left/right).
//    If a neighbour is displaced more than me, it "pulls" me toward its
//    displacement — spreading the disturbance across the mesh.
// 3. K_SPRING pulls every point back to rest; K_DAMP bleeds energy each frame.
// 4. Cursor velocity is tracked so a fast swipe creates a proportionally
//    larger impulse, sending a more visible wave a few rows/columns away.

export default function HeroGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none)').matches) return;

    const ctx = canvas.getContext('2d')!;

    type Pt = { bx: number; by: number; x: number; y: number; vx: number; vy: number };
    let pts: Pt[]         = [];
    let nbrs: number[][]  = [];   // pre-computed neighbour indices
    let fx: Float32Array;         // force accumulators — reused every frame (no GC)
    let fy: Float32Array;
    let W = 0, H = 0;

    let mx = -9999, my = -9999;  // cursor position (CSS px)
    let pmx = mx, pmy = my;       // previous cursor position for velocity
    let svx = 0,  svy = 0;        // smoothed cursor velocity (EMA)
    let raf = 0;

    const I = (r: number, c: number) => r * (COLS + 1) + c;

    // ── Init / resize ────────────────────────────────────────────────────────
    const init = () => {
      const dpr = window.devicePixelRatio || 1;
      W = canvas.offsetWidth  || window.innerWidth;
      H = canvas.offsetHeight || 500;
      canvas.width  = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width  = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      pts = [];
      for (let r = 0; r <= ROWS; r++) {
        for (let c = 0; c <= COLS; c++) {
          const bx = (c / COLS) * W;
          const by = (r / ROWS) * H;
          pts.push({ bx, by, x: bx, y: by, vx: 0, vy: 0 });
        }
      }

      // Pre-compute neighbour index lists (4-connected grid)
      nbrs = pts.map((_, idx) => {
        const r = Math.floor(idx / (COLS + 1));
        const c = idx % (COLS + 1);
        const ns: number[] = [];
        if (r > 0)    ns.push(I(r - 1, c));
        if (r < ROWS) ns.push(I(r + 1, c));
        if (c > 0)    ns.push(I(r, c - 1));
        if (c < COLS) ns.push(I(r, c + 1));
        return ns;
      });

      fx = new Float32Array(pts.length);
      fy = new Float32Array(pts.length);
    };

    // ── Animation loop ───────────────────────────────────────────────────────
    const tick = () => {
      ctx.clearRect(0, 0, W, H);

      // Track cursor velocity with an EMA to smooth frame-to-frame jitter
      const rawVx = mx - pmx;
      const rawVy = my - pmy;
      svx = svx * 0.65 + rawVx * 0.35;
      svy = svy * 0.65 + rawVy * 0.35;
      pmx = mx; pmy = my;

      const speed = Math.sqrt(svx * svx + svy * svy);
      // Fast swipe → up to 4× larger push impulse
      const boost = 1 + Math.min(speed * 0.06, 3.0);

      // ── Phase 1: accumulate forces (read positions, don't write yet) ──────
      fx.fill(0);
      fy.fill(0);

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];

        // Spring to base position
        fx[i] += (p.bx - p.x) * K_SPRING;
        fy[i] += (p.by - p.y) * K_SPRING;

        // Neighbour coupling: if a neighbour is displaced more than me,
        // it pulls me toward its displacement — propagating the wave.
        const pDispX = p.x - p.bx;
        const pDispY = p.y - p.by;
        for (const ni of nbrs[i]) {
          const n = pts[ni];
          fx[i] += ((n.x - n.bx) - pDispX) * K_NEIGHBOR;
          fy[i] += ((n.y - n.by) - pDispY) * K_NEIGHBOR;
        }

        // Cursor push (from base position so force doesn't compound
        // on already-displaced points)
        const dx = p.bx - mx;
        const dy = p.by - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < PUSH_R * PUSH_R && d2 > 0) {
          const d  = Math.sqrt(d2);
          const f  = (1 - d / PUSH_R) * PUSH_F * boost;
          fx[i] += (dx / d) * f * 0.20;
          fy[i] += (dy / d) * f * 0.20;
        }
      }

      // ── Phase 2: apply forces and integrate ─────────────────────────────
      for (let i = 0; i < pts.length; i++) {
        const p  = pts[i];
        p.vx = (p.vx + fx[i]) * K_DAMP;
        p.vy = (p.vy + fy[i]) * K_DAMP;
        p.x += p.vx;
        p.y += p.vy;
      }

      // ── Draw ─────────────────────────────────────────────────────────────
      ctx.lineWidth   = 1;
      ctx.strokeStyle = `rgba(94,234,212,${LINE_A})`;

      // Horizontal — one polyline path per row
      for (let r = 0; r <= ROWS; r++) {
        ctx.beginPath();
        for (let c = 0; c <= COLS; c++) {
          const p = pts[I(r, c)];
          c === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }

      // Vertical — one polyline path per column
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
    const section = (canvas.closest('section') as HTMLElement | null) ?? canvas.parentElement!;

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
    };
    const onLeave = () => { mx = -9999; my = -9999; svx = 0; svy = 0; };
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
