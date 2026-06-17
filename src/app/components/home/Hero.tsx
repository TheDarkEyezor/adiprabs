'use client';
import React from 'react';
import { motion } from 'framer-motion';
import HeroGrid from '../effects/HeroGrid';
import { Container, Label, LiveDot } from '../ui/primitives';
import { profile } from '@/data/profile';

export default function Hero() {
  return (
    <section className="relative min-h-[88vh] flex items-center overflow-hidden">
      <HeroGrid />

      <Container className="relative z-10 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center justify-between mb-10">
            <Label number="00">index</Label>
            <div className="hidden md:flex items-center gap-4 font-mono text-mono-sm text-ink-muted">
              <span>{profile.location}</span>
              <span>·</span>
              <LiveDot label="apple sre · placement" />
            </div>
          </div>

          <h1 className="text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] tracking-tightest font-medium text-ink-fg">
            Adi&nbsp;Prabs<span className="caret" aria-hidden />
          </h1>

          <p className="mt-6 max-w-2xl text-xl md:text-2xl text-ink-fg2 leading-snug tracking-snug">
            Computing @ Imperial. SRE @ Apple. I build production AI systems on the side —
            compilers, infra, agents, and the boring glue that turns demos into products.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="/projects"
              className="group inline-flex items-center gap-2 px-4 py-2.5 border border-teal-dim text-teal hover:bg-teal-dim/10 font-mono text-mono-sm rounded-sm transition-colors"
            >
              <span>selected work</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a
              href="/resume"
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-ink-line text-ink-fg2 hover:text-ink-fg hover:border-ink-line2 font-mono text-mono-sm rounded-sm transition-colors"
            >
              long-form CV
            </a>
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-ink-muted hover:text-teal font-mono text-mono-sm rounded-sm transition-colors"
            >
              ↓ resume.pdf
            </a>
          </div>

          {/* Hairline stat strip */}
          <div className="mt-20 pt-8 border-t border-ink-line grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { k: '4', l: 'companies shipped to' },
              { k: '120ms', l: 'p95 backend (vani)' },
              { k: '−76%', l: 'prod bugs (vani)' },
              { k: '1st', l: 'hackathon win (swyftgesture)' },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-mono text-2xl md:text-3xl text-teal tracking-snug">{s.k}</div>
                <div className="mt-1 font-mono text-mono-sm text-ink-muted">{s.l}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
