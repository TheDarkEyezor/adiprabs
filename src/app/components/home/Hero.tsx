'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  motion,
  useScroll, useTransform, useSpring,
  useMotionValue, animate,
} from 'framer-motion';
import HeroGrid from '../effects/HeroGrid';
import { Container, Label, LiveDot } from '../ui/primitives';
import MagneticButton from '../ui/MagneticButton';
import { profile } from '@/data/profile';

const stats = [
  { k: '$3M+', l: 'capacity savings per AZ' },
  { k: '72%',  l: 'deployment incidents caught' },
  { k: '6',    l: 'companies shipped to' },
  { k: '30+',  l: 'SREs using my tooling' },
];

// ── Stat counter — starts only when hero reveal is complete ─────────────────
function StatCounter({
  k, l, delay = 0, triggered,
}: {
  k: string; l: string; delay?: number; triggered: boolean;
}) {
  const motionVal = useMotionValue(0);
  const [displayed, setDisplayed] = useState('—');

  useEffect(() => {
    if (!triggered) return;
    const match = k.match(/^([^0-9]*)(\d+)(.*)$/);
    if (!match) { setDisplayed(k); return; }
    const [, pre, num, suf] = match;
    const target = parseInt(num, 10);
    const controls = animate(motionVal, target, {
      duration: 1.5,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplayed(`${pre}${Math.round(v)}${suf}`),
    });
    return controls.stop;
  }, [triggered, k, delay, motionVal]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={triggered ? { opacity: 1 } : {}}
      transition={{ duration: 0.4, delay }}
    >
      <div className="font-mono text-2xl md:text-3xl text-teal tracking-snug">{displayed}</div>
      <div className="mt-1 font-mono text-mono-sm text-ink-muted">{l}</div>
    </motion.div>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────
export default function Hero() {
  const [revealed, setRevealed] = useState(false);

  const { scrollY } = useScroll();
  const portraitY     = useTransform(scrollY, [0, 600], [0, -50]);
  const smoothPortrait = useSpring(portraitY, { stiffness: 80, damping: 20 });

  return (
    // Clip-path sweeps left → right over the entire section (grid + content)
    <motion.section
      className="relative min-h-[88vh] flex items-center overflow-hidden bg-ink-bg"
      initial={{ clipPath: 'inset(0 100% 0 0)' }}
      animate={{ clipPath: 'inset(0 0% 0 0)' }}
      transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => setRevealed(true)}
    >
      <HeroGrid />

      <Container className="relative z-10 py-16 md:py-32">
        <div className="grid grid-cols-12 gap-6 items-end">

          {/* ── Left: text ── */}
          <div className="col-span-12 md:col-span-7">

            {/* Label + status */}
            <div className="flex items-center justify-between mb-8">
              <Label number="00">index</Label>
              <div className="hidden md:flex items-center gap-4 font-mono text-mono-sm text-ink-muted">
                <span>{profile.location}</span>
                <span>·</span>
                <LiveDot label="apple sre · ml platforms" />
              </div>
            </div>

            {/* Mobile portrait */}
            <div className="flex justify-center mb-8 md:hidden">
              <div className="relative w-52 h-64 select-none">
                <Image
                  src="/avatar.png"
                  alt="Adi Prabs"
                  fill
                  className="object-contain"
                  priority
                  draggable={false}
                />
              </div>
            </div>

            {/* Name */}
            <h1 className="text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] tracking-tightest font-medium text-ink-fg">
              Adi&nbsp;Prabs<span className="caret" aria-hidden />
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-xl text-xl md:text-2xl text-ink-fg2 leading-snug tracking-snug">
              Computing @ Imperial. SRE @ Apple. I build production AI systems on the side —
              compilers, infra, agents, and the boring glue that turns demos into products.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <MagneticButton href="/projects" variant="primary">
                <span>selected work</span>
                <span>→</span>
              </MagneticButton>
              <MagneticButton href="/resume" variant="secondary">
                long-form CV
              </MagneticButton>
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-ink-muted hover:text-teal font-mono text-mono-sm rounded-sm transition-colors"
              >
                ↓ resume.pdf
              </a>
            </div>

            {/* Stats — trigger after clip-path reveal completes */}
            <div className="mt-16 pt-8 border-t border-ink-line grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((s, i) => (
                <StatCounter
                  key={s.l}
                  k={s.k}
                  l={s.l}
                  delay={i * 0.12}
                  triggered={revealed}
                />
              ))}
            </div>
          </div>

          {/* ── Right: portrait (desktop) ── */}
          <div className="hidden md:flex col-span-5 justify-center items-end relative">
            <motion.div style={{ y: smoothPortrait }} className="relative w-full flex justify-center">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 h-48 bg-teal/8 blur-3xl rounded-full pointer-events-none" />
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-40 h-24 bg-teal/12 blur-2xl rounded-full pointer-events-none" />
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
                className="relative z-10"
              >
                <Image
                  src="/avatar.png"
                  alt="Adi Prabs"
                  width={380}
                  height={500}
                  className="object-contain drop-shadow-2xl select-none"
                  priority
                  draggable={false}
                />
              </motion.div>
            </motion.div>
          </div>

        </div>
      </Container>
    </motion.section>
  );
}
