'use client';
import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Container, Label, Tag } from '../components/ui/primitives';
import { projects, type Project } from '@/data/profile';

const categories = ['All', 'AI/ML', 'Systems', 'Tools', 'Web', 'Hardware'] as const;

function TiltCard({ p, index }: { p: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: '-5%' });

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 200, damping: 20, mass: 0.5 };
  const rotX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), spring);
  const rotY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), spring);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };

  const onLeave = () => { x.set(0); y.set(0); };

  const href = p.github || p.link;
  const inner = (
    <>
      <div className="flex items-center justify-between mb-5">
        <span className="font-mono text-mono-sm text-ink-muted">
          {p.year} · {p.category}
        </span>
        <div className="flex items-center gap-2">
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
      <p className="mt-4 text-ink-fg2/90 leading-relaxed">{p.description}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {p.tech.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>

      {href && (
        <div className="mt-6 font-mono text-mono-sm text-ink-muted group-hover:text-teal transition-colors">
          {p.github ? 'github →' : 'visit →'}
        </div>
      )}
    </>
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
      className="col-span-12 md:col-span-6 lg:col-span-4"
    >
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="card card-accent p-7 group block h-full">
          {inner}
        </a>
      ) : (
        <div id={p.slug} className="card card-accent p-7 group block h-full">
          {inner}
        </div>
      )}
    </motion.div>
  );
}

export default function ProjectsPage() {
  const [cat, setCat] = useState<(typeof categories)[number]>('All');

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
              Projects
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
                  className={`px-3 py-1.5 border rounded-sm font-mono text-mono-sm transition-colors ${
                    cat === c
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
                  <TiltCard key={p.slug} p={p} index={i} />
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
