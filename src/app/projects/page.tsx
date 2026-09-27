'use client';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion';
import ProjectDemoPanel from '../components/demos/ProjectDemoPanel';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Container, Label, Tag, withMetrics } from '../components/ui/primitives';
import { projects, type Project } from '@/data/profile';

const ALL_CATEGORIES = ['AI/ML', 'Systems', 'Tools', 'Web', 'Hardware'] as const;

// Only surface a filter tag if at least one project actually falls under it;
// an empty filter button is a dead end, not a filter.
const categoryCounts = ALL_CATEGORIES.reduce<Record<string, number>>((acc, c) => {
  acc[c] = projects.filter((p) => p.category === c).length;
  return acc;
}, {});
const categories = ['All', ...ALL_CATEGORIES.filter((c) => categoryCounts[c] > 0)];

function TiltCard({
  p,
  index,
  open,
  onToggle,
}: {
  p: Project;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: '-5%' });

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 200, damping: 20, mass: 0.5 };
  const rotX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), spring);
  const rotY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), spring);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Tilting a card you are trying to drag a slider inside of is hostile.
    if (!ref.current || open) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };

  const onLeave = () => { x.set(0); y.set(0); };
  useEffect(() => { if (open) { x.set(0); y.set(0); } }, [open, x, y]);

  const href = p.github || p.link;
  const inner = (
    <>
      <div className="flex items-center justify-between mb-5">
        <span className="font-mono text-mono-sm text-ink-muted">
          {p.year} · {p.category}
        </span>
        <div className="flex items-center gap-2">
          {p.demo && (
            <span className="font-mono text-[10px] tracking-wide2 uppercase text-teal/70">demo</span>
          )}
          {p.status === 'wip' && (
            <span className="font-mono text-[10px] tracking-wide2 uppercase text-amber-live">wip</span>
          )}
          {p.award && (
            <span className="font-mono text-[10px] tracking-wide2 uppercase text-teal">{p.award}</span>
          )}
        </div>
      </div>

      <h3 className="text-2xl text-ink-fg tracking-snug group-hover:text-teal transition-colors">
        {p.title}
      </h3>
      <p className="mt-1.5 text-ink-fg2 italic">{p.tagline}</p>
      <p className="mt-4 text-ink-fg2/90 leading-relaxed">{withMetrics(p.description)}</p>

      {p.parts && (
        <dl className="mt-6 divide-y divide-ink-line border-y border-ink-line">
          {p.parts.map((part) => (
            <div key={part.name} className="py-3.5 sm:grid sm:grid-cols-[9rem_1fr] sm:gap-5">
              <dt className="font-mono text-mono-sm">
                <span className="text-teal">{part.name}</span>
                {part.repo && <span className="block text-ink-muted">{part.repo}</span>}
              </dt>
              <dd className="mt-1 sm:mt-0 text-[14px] text-ink-fg2/85 leading-relaxed">
                {withMetrics(part.role)}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {p.writeups && (p.demo || !href) && (
        <ul className="mt-6 space-y-1.5">
          {p.writeups.map((w) => (
            <li key={w.slug}>
              <a
                href={`/blog/${w.slug}`}
                className="font-mono text-mono-sm text-ink-muted hover:text-teal transition-colors"
              >
                {w.title} →
              </a>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        {p.tech.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>

      {href && !p.demo && (
        <div className="mt-6 font-mono text-mono-sm text-ink-muted group-hover:text-teal transition-colors">
          {p.github ? 'github →' : 'visit →'}
        </div>
      )}
    </>
  );

  // Cards with a demo cannot wrap the whole body in an anchor: the demo has
  // its own controls. They get an explicit footer row instead.
  const body = p.demo ? (
    <div id={p.slug} className="card card-accent p-7 group h-full scroll-mt-24">
      {inner}

      <p className="mt-6 text-[13px] text-ink-fg2/70 leading-relaxed">{p.demo.blurb}</p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-sm border font-mono text-mono-sm tracking-wide2 uppercase transition-colors ${
            open
              ? 'border-ink-line2 text-ink-fg2 hover:text-ink-fg hover:border-teal-dim'
              : 'border-teal-dim bg-teal/10 text-teal hover:bg-teal/20'
          }`}
        >
          <span
            aria-hidden
            className={`inline-block h-1.5 w-1.5 rounded-full ${open ? 'bg-ink-muted' : 'bg-teal animate-shimmer-line'}`}
          />
          {open ? 'close demo' : 'run demo'}
          <span aria-hidden>{open ? '↑' : '↓'}</span>
        </button>
        {href && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 font-mono text-mono-sm text-ink-muted hover:text-teal transition-colors"
          >
            {p.github ? 'github →' : 'visit →'}
          </a>
        )}
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="demo"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-6">
              <ProjectDemoPanel demo={p.demo!} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  ) : href ? (
    <a
      id={p.slug}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="card card-accent p-7 group block h-full scroll-mt-24"
    >
      {inner}
    </a>
  ) : (
    <div id={p.slug} className="card card-accent p-7 group block h-full scroll-mt-24">
      {inner}
    </div>
  );

  return (
    <motion.div
      key={p.slug}
      ref={ref}
      layout
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      exit={{ opacity: 0, y: -16, transition: { duration: 0.2 } }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.06, ease: [0.16, 1, 0.3, 1] }}
      style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 1000 }}
      className={open || p.parts ? 'col-span-12' : 'col-span-12 md:col-span-6 lg:col-span-4'}
    >
      {body}
    </motion.div>
  );
}

export default function ProjectsPage() {
  const [cat, setCat] = useState<(typeof categories)[number]>('All');
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  // A link to /projects#slopfilter should land with the demo already running.
  useEffect(() => {
    const slug = window.location.hash.slice(1);
    if (slug && projects.some((p) => p.slug === slug && p.demo)) setOpenSlug(slug);
  }, []);

  const filtered = useMemo(() => {
    if (cat === 'All') return projects;
    return projects.filter((p) => p.category === cat);
  }, [cat]);

  return (
    <>
      <Navbar />
      <main className="relative z-10">
        <section className="relative">
          <Container className="pt-16 md:pt-24 pb-10">
            <Label number="01">work</Label>
            <h1 className="mt-6 text-5xl md:text-7xl tracking-tightest font-medium text-ink-fg">
              Personal Projects
            </h1>
            <p className="mt-4 max-w-reading text-xl text-ink-fg2 leading-snug">
              Compilers, agents, robots, trading bots, gesture interfaces. Some shipped,
              some in flight, all real.
            </p>

            <div className="mt-10 flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`px-3 py-1.5 border rounded-sm font-mono text-mono-sm transition-colors ${cat === c
                    ? 'border-teal-dim text-teal'
                    : 'border-ink-line text-ink-fg2 hover:text-ink-fg hover:border-ink-line2'
                    }`}
                >
                  {c.toLowerCase()}
                </button>
              ))}
              <motion.span
                key={filtered.length}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-3 py-1.5 font-mono text-mono-sm text-ink-muted"
              >
                {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
              </motion.span>
            </div>
          </Container>
        </section>

        <section className="relative">
          <div className="rule" />
          <Container className="py-16">
            <div
              className="grid grid-cols-12 gap-px bg-ink-line border border-ink-line"
              style={{ perspective: '1200px' }}
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((p, i) => (
                  <TiltCard
                    key={p.slug}
                    p={p}
                    index={i}
                    open={openSlug === p.slug}
                    onToggle={() => setOpenSlug(openSlug === p.slug ? null : p.slug)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
