import React from 'react';
import Link from 'next/link';
import { Container, Label, Tag } from '../ui/primitives';
import { featuredProjects } from '@/data/profile';

export default function SelectedProjects() {
  return (
    <section className="relative">
      <div className="rule" />
      <Container className="py-20 md:py-24">
        <div className="grid grid-cols-12 gap-6 mb-10">
          <div className="col-span-12 md:col-span-3">
            <Label number="03">selected work</Label>
          </div>
          <div className="col-span-12 md:col-span-9 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl md:text-4xl tracking-snug text-ink-fg">
              Things I&apos;ve built.
            </h2>
            <Link
              href="/projects"
              className="font-mono text-mono-sm text-teal hover:underline underline-offset-4"
            >
              all projects →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-px bg-ink-line border border-ink-line">
          {featuredProjects.map((p) => (
            <a
              key={p.slug}
              href={p.github || p.link || `/projects#${p.slug}`}
              target={p.github || p.link ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="card card-accent col-span-12 md:col-span-6 p-7 group block"
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
              <p className="mt-2 text-ink-fg2 italic">{p.tagline}</p>
              <p className="mt-4 text-ink-fg2/90 leading-relaxed">{p.description}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {p.tech.slice(0, 6).map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>

              <div className="mt-6 font-mono text-mono-sm text-ink-muted group-hover:text-teal transition-colors">
                {p.github ? 'github →' : 'read more →'}
              </div>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
