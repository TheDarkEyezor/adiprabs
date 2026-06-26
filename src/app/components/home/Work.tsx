'use client';
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Container, Label, MetaRow, Tag, LiveDot } from '../ui/primitives';
import RevealHeading from '../ui/RevealHeading';
import { roles } from '@/data/profile';

function SlideInRow({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: '-8%' });
  const fromLeft = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: fromLeft ? -60 : 60 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

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
            <RevealHeading
              text="Where I've shipped."
              as="h2"
              className="text-3xl md:text-4xl tracking-snug text-ink-fg"
            />
            <p className="mt-3 max-w-reading text-ink-fg2">
              Six companies, three years. Each one taught me something specific
              about turning research into production — latency, cost, reliability,
              security, or all at once.
            </p>
          </div>
        </div>

        <div className="divide-y divide-ink-line border-t border-ink-line overflow-hidden">
          {roles.map((r, index) => (
            <SlideInRow key={`${r.company}-${r.period}`} index={index}>
              <MetaRow
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
            </SlideInRow>
          ))}
        </div>
      </Container>
    </section>
  );
}
