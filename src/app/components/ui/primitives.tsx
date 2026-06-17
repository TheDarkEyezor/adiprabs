import React from "react";
import Link from "next/link";

/** Editorial container: 12-col grid, max width, balanced padding. */
export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-6 md:px-10 ${className}`}>
      {children}
    </div>
  );
}

/** Section wrapper: padded vertical rhythm, hairline rule between sections. */
export function Section({
  children,
  id,
  rule = true,
  className = "",
}: {
  children: React.ReactNode;
  id?: string;
  rule?: boolean;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`relative ${className}`}
    >
      {rule && <div className="rule" />}
      <div className="py-20 md:py-28">{children}</div>
    </section>
  );
}

/** Mono label with number, e.g. "// 02 — selected work" */
export function Label({
  number,
  children,
  className = "",
}: {
  number?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`label flex items-center gap-3 ${className}`}>
      <span className="text-ink-muted/70">//</span>
      {number && <span className="text-teal">{number}</span>}
      <span>{children}</span>
    </div>
  );
}

/** Small uppercase tag — used for tech stacks and meta. */
export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center font-mono text-[11px] tracking-wide2 uppercase text-ink-fg2 px-2 py-0.5 border border-ink-line rounded-sm">
      {children}
    </span>
  );
}

/** Inline link with editorial underline that lights teal on hover. */
export function A({
  href,
  children,
  external = false,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
}) {
  if (external || href.startsWith("http") || href.startsWith("mailto:")) {
    return (
      <a
        href={href}
        target={external || href.startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
        className={`link inline-flex items-center gap-1 ${className}`}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={`link inline-flex items-center gap-1 ${className}`}>
      {children}
    </Link>
  );
}

/** Live status indicator. */
export function LiveDot({ label }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-mono-sm text-ink-fg2">
      <span className="live-dot" aria-hidden />
      {label || "live"}
    </span>
  );
}

/** Mono key like ⌘K. */
export function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="font-mono text-[11px] px-1.5 py-0.5 border border-ink-line rounded-sm bg-ink-surface text-ink-fg2">
      {children}
    </kbd>
  );
}

/** Two-column row used in the long-form CV / experience list. */
export function MetaRow({
  meta,
  children,
}: {
  meta: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-12 gap-6 py-6">
      <div className="col-span-12 md:col-span-3 font-mono text-mono-sm text-ink-muted pt-1">
        {meta}
      </div>
      <div className="col-span-12 md:col-span-9">{children}</div>
    </div>
  );
}
