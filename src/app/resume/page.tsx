'use client';
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Container, Label, MetaRow, Tag, LiveDot, A } from '../components/ui/primitives';
import { profile, roles } from '@/data/profile';

const education = {
  institution: 'Imperial College London',
  degree: 'MEng in Computing (AI & ML)',
  period: '2023 — 2027 (expected)',
  notes: [
    'On track for First Class · GPA 4.0',
    'Coursework: compilers, OS, ML, distributed systems',
    'Hackathons: 1st place — SwyftGesture (hands-free input)',
  ],
};

const skills: Record<string, string[]> = {
  Languages: ['TypeScript', 'Python', 'C', 'C++', 'Scala', 'Haskell', 'Kotlin', 'JavaScript'],
  Systems: ['Linux', 'Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Azure', 'Vercel'],
  'AI / ML': ['PyTorch', 'LLama 3.2', 'MediaPipe', 'OpenCV', 'MuJoCo', 'MCP', 'Local LLMs'],
  Web: ['Next.js', 'React', 'FastAPI', 'Node.js', 'Tailwind', 'MDX'],
  Reliability: ['Observability', 'Incident response', 'Load testing', 'Distributed tracing'],
};

const languages = [
  { lang: 'English', level: 'Native' },
  { lang: 'French', level: 'Native' },
  { lang: 'Tamil', level: 'Native' },
  { lang: 'Spanish', level: 'Reading & speaking' },
  { lang: 'Hindi', level: 'Reading & speaking' },
];

export default function ResumePage() {
  const [view, setView] = useState<'long' | 'pdf'>('long');

  return (
    <>
      <Navbar />
      <main className="relative z-10">
        {/* Header */}
        <section className="relative">
          <Container className="pt-16 md:pt-24 pb-10">
            <div className="flex items-center justify-between mb-8">
              <Label number="02">cv</Label>
              <div className="flex items-center gap-2 font-mono text-mono-sm">
                <button
                  onClick={() => setView('long')}
                  className={`px-3 py-1.5 border rounded-sm transition-colors ${
                    view === 'long'
                      ? 'border-teal-dim text-teal'
                      : 'border-ink-line text-ink-fg2 hover:text-ink-fg'
                  }`}
                >
                  long-form
                </button>
                <button
                  onClick={() => setView('pdf')}
                  className={`px-3 py-1.5 border rounded-sm transition-colors ${
                    view === 'pdf'
                      ? 'border-teal-dim text-teal'
                      : 'border-ink-line text-ink-fg2 hover:text-ink-fg'
                  }`}
                >
                  pdf
                </button>
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 border border-ink-line text-ink-fg2 hover:text-teal hover:border-teal-dim rounded-sm transition-colors"
                >
                  ↓ download
                </a>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl tracking-tightest font-medium text-ink-fg">
              {profile.name}
            </h1>
            <p className="mt-3 text-xl text-ink-fg2 max-w-reading">
              {profile.tagline}.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-mono-sm text-ink-muted">
              <span>{profile.location}</span>
              <A href={`mailto:${profile.emailPublic}`}>{profile.emailPublic}</A>
              <A href={profile.linkedinUrl} external>linkedin</A>
              <A href={profile.githubUrl} external>github</A>
              <LiveDot label="apple sre · placement" />
            </div>
          </Container>
        </section>

        {view === 'long' ? (
          <>
            {/* Summary */}
            <section className="relative">
              <div className="rule" />
              <Container className="py-16">
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-12 md:col-span-3">
                    <Label>summary</Label>
                  </div>
                  <div className="col-span-12 md:col-span-9 max-w-reading space-y-4 text-lg text-ink-fg2 leading-relaxed">
                    <p>
                      Computing student at Imperial with two years of production-level
                      development experience across three startups and a current SRE
                      placement at Apple.
                    </p>
                    <p>
                      I&apos;m happiest at the seam between research and production —
                      shipping things that demo well in a notebook and don&apos;t fall
                      over under real traffic. Compilers, infra, agents, and the boring
                      glue that turns prototypes into products.
                    </p>
                  </div>
                </div>
              </Container>
            </section>

            {/* Experience */}
            <section className="relative">
              <div className="rule" />
              <Container className="py-16">
                <div className="grid grid-cols-12 gap-6 mb-8">
                  <div className="col-span-12 md:col-span-3">
                    <Label>experience</Label>
                  </div>
                  <div className="col-span-12 md:col-span-9">
                    <h2 className="text-3xl tracking-snug text-ink-fg">Roles</h2>
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

            {/* Education */}
            <section className="relative">
              <div className="rule" />
              <Container className="py-16">
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-12 md:col-span-3">
                    <Label>education</Label>
                    <div className="mt-2 font-mono text-mono-sm text-ink-muted">
                      {education.period}
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-9">
                    <h3 className="text-2xl text-ink-fg tracking-snug">{education.institution}</h3>
                    <p className="mt-1 font-mono text-mono-sm text-ink-muted">{education.degree}</p>
                    <ul className="mt-4 space-y-2 max-w-reading">
                      {education.notes.map((n) => (
                        <li key={n} className="flex gap-3 text-ink-fg2 leading-relaxed">
                          <span className="text-teal/70 mt-2 font-mono shrink-0">—</span>
                          <span>{n}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Container>
            </section>

            {/* Skills */}
            <section className="relative">
              <div className="rule" />
              <Container className="py-16">
                <div className="grid grid-cols-12 gap-6 mb-8">
                  <div className="col-span-12 md:col-span-3">
                    <Label>stack</Label>
                  </div>
                  <div className="col-span-12 md:col-span-9">
                    <h2 className="text-3xl tracking-snug text-ink-fg">What I reach for.</h2>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-6">
                  {Object.entries(skills).map(([cat, items]) => (
                    <div key={cat} className="col-span-12 md:col-span-6 lg:col-span-4">
                      <div className="font-mono text-mono-sm text-teal mb-3">{cat}</div>
                      <div className="flex flex-wrap gap-2">
                        {items.map((s) => (
                          <Tag key={s}>{s}</Tag>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Container>
            </section>

            {/* Languages */}
            <section className="relative">
              <div className="rule" />
              <Container className="py-16">
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-12 md:col-span-3">
                    <Label>languages</Label>
                  </div>
                  <div className="col-span-12 md:col-span-9">
                    <ul className="divide-y divide-ink-line border-t border-ink-line max-w-reading">
                      {languages.map((l) => (
                        <li key={l.lang} className="flex justify-between py-3 text-ink-fg2">
                          <span>{l.lang}</span>
                          <span className="font-mono text-mono-sm text-ink-muted">{l.level}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Container>
            </section>
          </>
        ) : (
          <section className="relative">
            <div className="rule" />
            <Container className="py-12">
              <div className="card p-2 rounded-sm">
                <iframe
                  src={profile.resumeUrl}
                  title="Adi Prabs Resume"
                  className="w-full h-[1100px] bg-ink-surface rounded-sm"
                />
              </div>
            </Container>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
