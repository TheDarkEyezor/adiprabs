'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { DemoFrame } from './DemoFrame';
import type { ProjectDemo } from '@/data/profile';

// Interactive demos are code-split: the projects page ships none of this
// until a card is actually expanded.
const loading = () => (
  <div className="border border-ink-line rounded-sm p-8 text-center font-mono text-[11px] text-ink-muted">
    loading demo<span className="caret" aria-hidden />
  </div>
);

const INTERACTIVE = {
  slopfilter: dynamic(() => import('./SlopFilterDemo'), { ssr: false, loading }),
  istoria: dynamic(() => import('./IstoriaDemo'), { ssr: false, loading }),
  swyftgesture: dynamic(() => import('./SwyftGestureDemo'), { ssr: false, loading }),
  wacc: dynamic(() => import('./WaccDemo'), { ssr: false, loading }),
  llama: dynamic(() => import('./LlamaDistillDemo'), { ssr: false, loading }),
  stocksentiment: dynamic(() => import('./StockSentimentDemo'), { ssr: false, loading }),
  graphrag: dynamic(() => import('./GraphRagDemo'), { ssr: false, loading }),
  kagschema: dynamic(() => import('./KagSchemaDemo'), { ssr: false, loading }),
} as const;

export default function ProjectDemoPanel({ demo }: { demo: ProjectDemo }) {
  if (demo.kind === 'interactive') {
    const Component = INTERACTIVE[demo.component];
    return <Component />;
  }

  if (demo.kind === 'video') {
    return (
      <DemoFrame title={demo.title} note={demo.note}>
        <video
          className="w-full rounded-sm border border-ink-line bg-ink-bg"
          src={demo.src}
          poster={demo.poster}
          controls
          muted
          loop
          playsInline
          preload="none"
        />
        {demo.caption && (
          <p className="mt-3 text-[13px] text-ink-fg2/80 leading-relaxed">{demo.caption}</p>
        )}
      </DemoFrame>
    );
  }

  // embed: an external sandbox (StackBlitz, CodeSandbox, a hosted deploy).
  return (
    <DemoFrame title={demo.title} note={demo.note}>
      <div
        className="relative w-full rounded-sm overflow-hidden border border-ink-line bg-ink-bg"
        style={{ aspectRatio: demo.aspect ?? '16 / 10' }}
      >
        <iframe
          src={demo.src}
          title={demo.title}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          className="absolute inset-0 h-full w-full"
        />
      </div>
      {demo.caption && (
        <p className="mt-3 text-[13px] text-ink-fg2/80 leading-relaxed">{demo.caption}</p>
      )}
    </DemoFrame>
  );
}
