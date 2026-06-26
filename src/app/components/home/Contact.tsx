'use client';
import React from 'react';
import { Container, Label } from '../ui/primitives';
import RevealHeading from '../ui/RevealHeading';
import MagneticButton from '../ui/MagneticButton';
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
            <RevealHeading
              text="Got a hard problem worth solving?"
              as="h2"
              className="text-3xl md:text-5xl tracking-snug text-ink-fg max-w-reading leading-[1.05]"
            />
            <p className="mt-4 max-w-reading text-ink-fg2 text-lg leading-relaxed">
              I take on a small amount of side work and I&apos;m always interested in
              talking to people building something genuinely difficult — especially in
              physical AI, dev infra, or edge inference.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <MagneticButton
                href={`mailto:${profile.emailPublic}?subject=Hello%20Adi`}
                variant="primary"
                external
              >
                <span>{profile.emailPublic}</span>
                <span>→</span>
              </MagneticButton>
              <MagneticButton href={profile.linkedinUrl} variant="secondary" external>
                linkedin
              </MagneticButton>
              <MagneticButton href={profile.githubUrl} variant="secondary" external>
                github
              </MagneticButton>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
