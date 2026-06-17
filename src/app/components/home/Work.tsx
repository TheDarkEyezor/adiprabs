import React from 'react';
import { Container, Label, MetaRow, Tag, LiveDot } from '../ui/primitives';
import { roles } from '@/data/profile';

export default function Work() {
  return (
    <section className="relative">
      <div className="rule" />
      <Container className="py-20 md:py-24">
        <div className="grid grid-cols-12 gap-6 mb-10">
          <div className="col-span-12 md:col-span-3">
            <Label number="02">work</Label>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2 className="text-3xl md:text-4xl tracking-snug text-ink-fg">
              Where I&apos;ve shipped.
            </h2>
            <p className="mt-3 max-w-reading text-ink-fg2">
              Four companies in three years. Each one taught me something specific
              about turning research into production: latency, cost, reliability, or
              all three at once.
            </p>
          </div>
        </div>

        <div className="divide-y divide-ink-line border-t border-ink-line">
          {roles.map((r) => (
            <MetaRow
              key={`${r.company}-${r.period}`}
              meta={
                <div className="space-y-1.5">
                  <div className="text-ink-fg2">{r.period}</div>
                  {r.location && <div>{r.location}</div>}
                  {r.live && <LiveDot label="current" />}
                </div>
              }
            >
              <div className="flex flex-wrap items-baseline gap-x-3">
                <h3 className="text-xl md:text-2xl text-ink-fg tracking-snug">{r.company}</h3>
                <span className="font-mono text-mono-sm text-ink-muted">{r.role}</span>
              </div>

              <ul className="mt-4 space-y-2 max-w-reading">
                {r.bullets.map((b) => (
                  <li key={b} className="flex gap-3 text-ink-fg2 leading-relaxed">
                    <span className="text-teal/70 mt-2 font-mono shrink-0">—</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-wrap gap-2">
                {r.tech.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            </MetaRow>
          ))}
        </div>
      </Container>
    </section>
  );
}
