'use client';
import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Container, Label, Tag } from '../components/ui/primitives';
import { projects, Project } from '@/data/profile';

const categories = ['All', 'AI/ML', 'Systems', 'Tools', 'Web', 'Hardware'] as const;

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
        {/* Header */}
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
              <span className="px-3 py-1.5 font-mono text-mono-sm text-ink-muted">
                {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
              </span>
            </div>
          </Container>
        </section>

        {/* Grid */}
        <section className="relative">
          <div className="rule" />
          <Container className="py-16">
            <div className="grid grid-cols-12 gap-px bg-ink-line border border-ink-line">
              {filtered.map((p) => (
                <ProjectCard key={p.slug} p={p} />
              ))}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}

function ProjectCard({ p }: { p: Project }) {
  const href = p.github || p.link;
  const Wrapper: any = href ? 'a' : 'div';
  const wrapperProps: any = href
    ? { href, target: '_blank', rel: 'noopener noreferrer' }
    : { id: p.slug };

  return (
    <Wrapper
      {...wrapperProps}
      className="card card-accent col-span-12 md:col-span-6 lg:col-span-4 p-7 group block"
    >
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
    </Wrapper>
  );
}
