// Shared timing constants and a minimal pub/sub for phase state.
// TransitionLink emits phases; TransitionProvider subscribes and renders tiles.

export const TILE_COLS     = 10;
export const TILE_ROWS     = 6;
export const TILE_STAGGER  = 0.26;   // diagonal spread (s)
export const TILE_DUR      = 0.38;   // per-tile slide duration (s)
export const NAVIGATE_AT   = TILE_STAGGER + TILE_DUR + 0.04; // 0.68s — all tiles covering
export const EXIT_TOTAL    = TILE_STAGGER + TILE_DUR + 0.06; // 0.70s — all tiles revealed

export type TilePhase = 'in' | 'out' | 'idle';

type Listener = (phase: TilePhase) => void;
const listeners = new Set<Listener>();

export function subscribePhase(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function emitPhase(phase: TilePhase): void {
  listeners.forEach((fn) => fn(phase));
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
