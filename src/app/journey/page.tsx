'use client';
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Container, Label, Tag } from '../components/ui/primitives';
import { roles } from '@/data/profile';

type Category = 'all' | 'work' | 'education' | 'leadership' | 'award';

interface TimelineEvent {
  date: string;
  title: string;
  org: string;
  category: Exclude<Category, 'all'>;
  description: string;
  tags?: string[];
}

const workEvents: TimelineEvent[] = roles.map((r) => ({
  date: r.period,
  title: r.role,
  org: r.company,
  category: 'work',
  description: r.bullets[0],
  tags: r.tech.slice(0, 4),
}));

const extraEvents: TimelineEvent[] = [
  {
    date: '2023 — present',
    title: 'BSc Computing',
    org: 'Imperial College London',
    category: 'education',
    description:
      'Studying AI/ML, systems programming, and compilers. Coursework spans distributed systems, functional programming, and low-level C. Expected graduation July 2027.',
    tags: ['AI/ML', 'Systems', 'Compilers'],
  },
  {
    date: '2022',
    title: 'SwyftGesture — 1st Place',
    org: 'Hackathon',
    category: 'award',
    description:
      'Hands-free computer control via webcam — mouse, scroll, and volume gestures using MediaPipe and OpenCV. Won 1st place against 40+ teams.',
    tags: ['Python', 'MediaPipe', 'OpenCV'],
  },
  {
    date: '2019 — 2021',
    title: 'FRC Team Leader',
    org: '#8235 Beyond the Flames',
    category: 'leadership',
    description:
      'Led 20-student team for the FIRST Robotics Competition. Designed robots with Fusion 360, wrote autonomous control in Java and Python. Earned Dean\'s List nomination.',
    tags: ['Java', 'Python', 'Robotics'],
  },
];

const allEvents: TimelineEvent[] = [
  workEvents[0],
  extraEvents[0],
  workEvents[1],
  workEvents[2],
  workEvents[3],
  extraEvents[1],
  extraEvents[2],
];

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'all', label: 'all' },
  { value: 'work', label: 'work' },
  { value: 'education', label: 'education' },
  { value: 'leadership', label: 'leadership' },
  { value: 'award', label: 'award' },
];

export default function JourneyPage() {
  const [cat, setCat] = useState<Category>('all');

  const filtered =
    cat === 'all' ? allEvents : allEvents.filter((e) => e.category === cat);

  return (
    <>
      <Navbar />
      <main className="relative z-10">
        {/* Header */}
        <section className="relative">
          <Container className="pt-16 md:pt-24 pb-10">
            <Label number="04">journey</Label>
            <h1 className="mt-6 text-5xl md:text-7xl tracking-tightest font-medium text-ink-fg">
              Journey
            </h1>
            <p className="mt-4 max-w-reading text-xl text-ink-fg2 leading-snug">
              Work, study, and building — in rough reverse-chronological order.
            </p>

            {/* Filter */}
            <div className="mt-10 flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setCat(c.value)}
                  className={`px-3 py-1.5 border rounded-sm font-mono text-mono-sm transition-colors ${
                    cat === c.value
                      ? 'border-teal-dim text-teal'
                      : 'border-ink-line text-ink-fg2 hover:text-ink-fg hover:border-ink-line2'
                  }`}
                >
                  {c.label}
                </button>
              ))}
              <span className="px-3 py-1.5 font-mono text-mono-sm text-ink-muted">
                {filtered.length} {filtered.length === 1 ? 'event' : 'events'}
              </span>
            </div>
          </Container>
        </section>

        {/* Timeline */}
        <section className="relative">
          <div className="rule" />
          <Container className="py-16">
            <div className="relative">
              {/* Continuous vertical rail (md+) */}
              <div
                className="hidden md:block absolute top-0 bottom-0 left-[25%] w-px bg-ink-line pointer-events-none"
                aria-hidden
              />

              {filtered.map((event) => (
                <div
                  key={`${event.date}-${event.title}`}
                  className="relative grid grid-cols-12 gap-x-8 py-9 border-t border-ink-line first:border-t-0 group"
                >
                  {/* Date */}
                  <div className="col-span-12 md:col-span-3 font-mono text-mono-sm text-ink-muted md:text-right md:pr-8 mb-3 md:mb-0 leading-none pt-0.5">
                    {event.date}
                  </div>

                  {/* Teal dot marker on rail */}
                  <div
                    className="hidden md:block absolute top-[calc(2.25rem+2px)] left-[25%] w-2.5 h-2.5 rounded-full bg-teal ring-2 ring-ink-bg -translate-x-1/2 z-10"
                    aria-hidden
                  />

                  {/* Content */}
                  <div className="col-span-12 md:col-span-9 md:pl-8">
                    <span className="font-mono text-[10px] tracking-wide2 uppercase text-ink-muted">
                      {event.category}
                    </span>
                    <h3 className="mt-1.5 text-2xl text-ink-fg tracking-snug group-hover:text-teal transition-colors">
                      {event.title}
                    </h3>
                    <p className="font-mono text-mono-sm text-ink-muted mt-1">{event.org}</p>
                    <p className="mt-3 text-ink-fg2 leading-relaxed max-w-reading">
                      {event.description}
                    </p>
                    {event.tags && event.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {event.tags.map((t) => (
                          <Tag key={t}>{t}</Tag>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
