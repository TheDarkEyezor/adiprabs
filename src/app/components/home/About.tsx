import React from 'react';
import { Container, Label, A } from '../ui/primitives';
import { profile } from '@/data/profile';

export default function About() {
  return (
    <section className="relative">
      <div className="rule" />
      <Container className="py-20 md:py-24">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3">
            <Label number="04">who</Label>
          </div>
          <div className="col-span-12 md:col-span-9">
            <div className="space-y-5 max-w-reading text-lg leading-relaxed text-ink-fg2">
              {profile.bio.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <p>
                Reachable at <A href={`mailto:${profile.emailPublic}`}>{profile.emailPublic}</A>{' '}
                — most useful when there&apos;s a concrete problem attached.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
