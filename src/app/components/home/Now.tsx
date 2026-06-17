import React from 'react';
import { Container, Label, LiveDot } from '../ui/primitives';
import { profile } from '@/data/profile';

export default function Now() {
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
            <ul className="space-y-3 max-w-reading">
              {profile.now.map((item) => (
                <li key={item} className="flex gap-3 text-lg leading-relaxed text-ink-fg2">
                  <span className="text-teal/70 mt-2 font-mono">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
