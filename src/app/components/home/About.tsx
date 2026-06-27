'use client';
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Container, Label, A } from '../ui/primitives';
import { profile } from '@/data/profile';

// Terms rendered in teal to add visual personality
const HIGHLIGHTS = [
  'Imperial College London',
  'ML Platforms team at Apple',
  'production AI systems',
  'compilers',
  'agents',
];

function highlight(text: string): React.ReactNode {
  let parts: (string | React.ReactElement)[] = [text];
  HIGHLIGHTS.forEach((term, ti) => {
    parts = parts.flatMap((chunk) => {
      if (typeof chunk !== 'string') return [chunk];
      const segments = chunk.split(term);
      return segments.flatMap((seg, i) =>
        i < segments.length - 1
          ? [seg, <span key={`${ti}-${i}`} className="text-teal">{term}</span>]
          : [seg],
      );
    });
  });
  return parts;
}

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: '-10%' });

  const allParas = [
    ...profile.bio,
    `Reachable at __email__ — most useful when there's a concrete problem attached.`,
  ];

  return (
    <section className="relative">
      <div className="rule" />
      <Container className="py-20 md:py-24">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3">
            <Label number="04">who</Label>
          </div>

          <div ref={ref} className="col-span-12 md:col-span-9">
            <div className="space-y-5 max-w-reading text-lg leading-relaxed text-ink-fg2">
              {profile.bio.map((para, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 18 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.65, delay: i * 0.13, ease: [0.16, 1, 0.3, 1] }}
                >
                  {highlight(para)}
                </motion.p>
              ))}

              {/* Email paragraph */}
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.65,
                  delay: profile.bio.length * 0.13,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                Reachable at{' '}
                <A href={`mailto:${profile.emailPublic}`}>{profile.emailPublic}</A>{' '}
                — most useful when there&apos;s a concrete problem attached.
              </motion.p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
