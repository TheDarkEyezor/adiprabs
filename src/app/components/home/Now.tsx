'use client';
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Container, Label, LiveDot } from '../ui/primitives';
import { profile } from '@/data/profile';

export default function Now() {
  const ref = useRef<HTMLUListElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: '-10%' });

  return (
    <section className="relative">
      <div className="rule" />
      <Container className="py-20 md:py-24">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3">
            <Label number="01">now</Label>
            <div className="mt-3 flex items-center gap-2 font-mono text-mono-sm text-ink-muted">
              <LiveDot />
              <span>updated {new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }).toLowerCase()}</span>
            </div>
          </div>

          <div className="col-span-12 md:col-span-9">
            <ul ref={ref} className="space-y-3 max-w-reading">
              {profile.now.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="flex gap-3 text-lg leading-relaxed text-ink-fg2"
                >
                  <span className="text-teal/70 mt-2 font-mono shrink-0">—</span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
