'use client';
import React from 'react';

/**
 * Shared chrome for every project demo: a mono caption bar over a bordered
 * body. Keeps the demos visually subordinate to the card they sit inside.
 */
export function DemoFrame({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-ink-line rounded-sm overflow-hidden bg-ink-bg/40">
      <div className="flex items-baseline justify-between gap-4 px-4 py-2.5 border-b border-ink-line bg-ink-surface2/40">
        <span className="font-mono text-[11px] tracking-wide2 uppercase text-teal">{title}</span>
        {note && <span className="font-mono text-[10px] text-ink-muted text-right">{note}</span>}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

/** Labelled slider used by the interactive demos. */
export function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
  display,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  display?: string;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between font-mono text-[11px] text-ink-fg2">
        <span>{label}</span>
        <span className="text-teal">{display ?? value.toFixed(2)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="mt-1.5 w-full accent-teal h-1 cursor-pointer"
      />
    </label>
  );
}

/** Small on/off pill for toggling a detector or preset. */
export function Toggle({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`px-2.5 py-1 border rounded-sm font-mono text-[11px] tracking-wide2 uppercase transition-colors ${
        on
          ? 'border-teal-dim text-teal bg-teal/5'
          : 'border-ink-line text-ink-muted hover:text-ink-fg2 hover:border-ink-line2'
      }`}
    >
      {children}
    </button>
  );
}

/** Horizontal score meter. Width is the fraction, colour flags the threshold. */
export function Meter({ value, flagged }: { value: number; flagged?: boolean }) {
  return (
    <div className="h-1 w-full bg-ink-line rounded-sm overflow-hidden">
      <div
        className={`h-full transition-[width] duration-300 ${flagged ? 'bg-amber-live' : 'bg-teal-dim'}`}
        style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%` }}
      />
    </div>
  );
}
