import React from 'react';
import { Container, Label } from '../ui/primitives';
import { profile } from '@/data/profile';

export default function ContactCTA() {
  return (
    <section className="relative">
      <div className="rule" />
      <Container className="py-20 md:py-28">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3">
            <Label number="05">contact</Label>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2 className="text-3xl md:text-5xl tracking-snug text-ink-fg max-w-reading leading-[1.05]">
              Got a hard problem worth solving?
            </h2>
            <p className="mt-4 max-w-reading text-ink-fg2 text-lg leading-relaxed">
              I take on a small amount of side work and I&apos;m always interested in
              talking to people building something genuinely difficult — especially in
              physical AI, dev infra, or edge inference.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`mailto:${profile.emailPublic}?subject=Hello%20Adi`}
                className="group inline-flex items-center gap-2 px-4 py-2.5 border border-teal-dim text-teal hover:bg-teal-dim/10 font-mono text-mono-sm rounded-sm transition-colors"
              >
                <span>{profile.emailPublic}</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-ink-line text-ink-fg2 hover:text-ink-fg hover:border-ink-line2 font-mono text-mono-sm rounded-sm transition-colors"
              >
                linkedin
              </a>
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-ink-line text-ink-fg2 hover:text-ink-fg hover:border-ink-line2 font-mono text-mono-sm rounded-sm transition-colors"
              >
                github
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
