'use client';
import React, { useMemo, useState } from 'react';
import { DemoFrame, Slider, Toggle, Meter } from './DemoFrame';

/* ---------------------------------------------------------------------------
 * A browser reproduction of SlopFilter's scoring path, running on a fixed
 * sample feed. Same three independent detectors as the extension, same
 * allow-list trick: only vocabulary that survived hand-curation can move a
 * score. Priors here are a trimmed stand-in for the shipped nb_models.json,
 * not the shipped weights themselves.
 * ------------------------------------------------------------------------- */

// AI_ALLOW: tokens whose presence genuinely shifts the read of a passage.
// Value is a scaled log-odds prior, the 1-40 range the trainer writes out.
const AI_ALLOW: Record<string, number> = {
  delve: 38, seamlessly: 36, holistic: 34, landscape: 30, robust: 26,
  comprehensive: 26, insights: 24, navigate: 22, tapestry: 22, elevate: 20,
  certainly: 18, notably: 16, ensure: 15, leverage: 15, foster: 14,
  underscores: 14, moreover: 12, furthermore: 12, additionally: 11,
  therefore: 9, however: 8, overall: 8, explore: 8, provides: 7,
  consider: 6, crucial: 6,
};

// RAGE_ALLOW: rhetoric markers, not vocabulary. Rage-bait is a shape of
// argument, so generic profanity is deliberately excluded below.
const RAGE_ALLOW: Record<string, number> = {
  sheeple: 34, globalists: 32, replacement: 30, traitors: 28, rigged: 26,
  hoax: 24, propaganda: 22, invasion: 22, stolen: 20, censored: 18,
  patriots: 16, agenda: 12, wake: 8,
};

// BLOCK_TOKENS: stripped before the rage model sees the document. Without
// this the Davidson corpus collapses the model into a swear detector.
const BLOCK_TOKENS = new Set(['fuck', 'fucking', 'shit', 'damn', 'crap', 'ass', 'hell', 'bloody']);

// Slop heuristics run alongside the two classifiers, not inside them.
const SLOP_RULES: { id: string; label: string; weight: number; test: (t: string) => boolean }[] = [
  {
    id: 'opener',
    label: 'assistant opener',
    weight: 40,
    test: (t) => /\b(as an ai language model|i cannot|it'?s important to note that|in today'?s fast[- ]paced)\b/i.test(t),
  },
  {
    id: 'buzz',
    label: 'buzzword stack',
    weight: 26,
    test: (t) => (t.match(/\b(synergy|game[- ]?chang\w+|unlock|thought leader|humbled|excited to share|circle back|value[- ]add|10x|disrupt\w*)\b/gi) || []).length >= 2,
  },
  {
    id: 'emdash',
    label: 'em-dash density',
    weight: 22,
    // More than one em dash per 40 words is the tell, not the dash itself.
    test: (t) => (t.match(/—/g) || []).length / Math.max(1, t.split(/\s+/).length) > 1 / 40,
  },
  {
    id: 'triad',
    label: 'rule-of-three listing',
    weight: 16,
    test: (t) => /\b\w+,\s+\w+,?\s+and\s+\w+\b.*\b\w+,\s+\w+,?\s+and\s+\w+\b/i.test(t),
  },
];

type Post = { handle: string; text: string; kind: string };

// Sample feed. Deliberately includes the two cases the blog post is about:
// careful human prose dense with connectives (must survive) and calmly
// delivered rage-bait with no profanity in it (must not).
const FEED: Post[] = [
  {
    handle: '@urbanist_essays',
    kind: 'human, formal register',
    text: 'The zoning reform passed, however the parking minimums stayed. Therefore the marginal cost of a new unit barely moved. Overall I think we mistook a legible win for a material one, and the next round should consider the binding constraint rather than the visible one.',
  },
  {
    handle: '@growth_leader',
    kind: 'generated filler',
    text: 'Excited to share some insights! In today\'s fast-paced landscape, we must delve into a holistic approach that seamlessly unlocks robust, comprehensive value. Let me elevate the conversation and navigate the tapestry of what is truly crucial here.',
  },
  {
    handle: '@k_writes',
    kind: 'human, technical',
    text: 'Spent the weekend tracing a memory leak to a listener we never removed on unmount. Two lines. Four hours. Additionally I learned our profiler lies about retained size when the heap snapshot straddles a GC.',
  },
  {
    handle: '@nightshift_anon',
    kind: 'human, profane, not rage-bait',
    text: 'My landlord has ignored the boiler for three fucking weeks and it is December. I am so done with this shit. Anyway, does anyone know a plumber who works weekends.',
  },
  {
    handle: '@truth_patriot_88',
    kind: 'rage-bait, no profanity',
    text: 'They are pushing the replacement on purpose. The globalists rigged the vote, the media is censored, and the sheeple keep clapping. Patriots know the agenda. Wake up before it is too late.',
  },
  {
    handle: '@ml_notes',
    kind: 'human, hedged',
    text: 'Notably the benchmark only covers English, so I would not read the gap as a capability claim. Moreover the eval set leaked into pretraining for at least two of the models compared.',
  },
  {
    handle: '@founder_journey',
    kind: 'generated, LinkedIn dialect',
    text: 'Humbled and excited to share that we are disrupting the value-add landscape with 10x synergy. This is a game-changing moment for thought leaders everywhere. Let me unlock the insights.',
  },
  {
    handle: '@quiet_gardener',
    kind: 'human, plain',
    text: 'The tomatoes did nothing all summer and then gave me eleven kilos in one week. No idea what changed. The basil next to them died.',
  },
];

const tokenize = (t: string) => t.toLowerCase().match(/[a-z']+/g) ?? [];

/** Document-frequency scoring: presence counts once, repetition does not. */
function nbScore(tokens: string[], priors: Record<string, number>, blocked?: Set<string>) {
  const seen = new Set(tokens.filter((t) => !blocked?.has(t)));
  const hits = Object.keys(priors).filter((k) => seen.has(k));
  const raw = hits.reduce((s, k) => s + priors[k], 0);
  // Squash to 0..1: three strong tokens is already a confident document.
  return { score: 1 - Math.exp(-raw / 55), hits };
}

function slopScore(text: string) {
  const hits = SLOP_RULES.filter((r) => r.test(text));
  const raw = hits.reduce((s, r) => s + r.weight, 0);
  return { score: 1 - Math.exp(-raw / 55), hits: hits.map((h) => h.label) };
}

export default function SlopFilterDemo() {
  const [ai, setAi] = useState(true);
  const [rage, setRage] = useState(true);
  const [slop, setSlop] = useState(true);
  const [threshold, setThreshold] = useState(0.45);
  const [shown, setShown] = useState<Set<number>>(new Set());

  const scored = useMemo(
    () =>
      FEED.map((p) => {
        const tokens = tokenize(p.text);
        const a = nbScore(tokens, AI_ALLOW);
        const r = nbScore(tokens, RAGE_ALLOW, BLOCK_TOKENS);
        const s = slopScore(p.text);
        const active = [
          ai ? { name: 'ai', ...a } : null,
          rage ? { name: 'rage', ...r } : null,
          slop ? { name: 'slop', ...s } : null,
        ].filter(Boolean) as { name: string; score: number; hits: string[] }[];
        // Detectors compose by max, so turning one off can never raise a score.
        const top = active.reduce(
          (best, d) => (d.score > best.score ? d : best),
          { name: 'none', score: 0, hits: [] as string[] },
        );
        return { post: p, top, all: { ai: a, rage: r, slop: s } };
      }),
    [ai, rage, slop],
  );

  const filtered = scored.filter((s) => s.top.score >= threshold).length;

  return (
    <DemoFrame
      title="slopfilter"
      note="reproduction of the extension's scoring path, not the shipped priors"
    >
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="font-mono text-[10px] tracking-wide2 uppercase text-ink-muted mr-1">detectors</span>
        <Toggle on={ai} onClick={() => setAi(!ai)}>ai-text</Toggle>
        <Toggle on={rage} onClick={() => setRage(!rage)}>rage</Toggle>
        <Toggle on={slop} onClick={() => setSlop(!slop)}>slop</Toggle>
      </div>

      <div className="max-w-xs mb-4">
        <Slider
          label="threshold"
          value={threshold}
          onChange={setThreshold}
          min={0.05}
          max={0.95}
          display={threshold.toFixed(2)}
        />
      </div>

      <p className="font-mono text-[11px] text-ink-muted mb-3">
        {filtered} of {FEED.length} hidden. Drop the threshold and watch the human
        essay full of &ldquo;however / therefore / moreover&rdquo; get caught before the
        actual filler does. That is the failure the allow-list exists to stop.
      </p>

      <ul className="space-y-2">
        {scored.map((s, i) => {
          const hidden = s.top.score >= threshold && !shown.has(i);
          return (
            <li key={s.post.handle} className="border border-ink-line rounded-sm p-3 bg-ink-surface/50">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-[11px] text-ink-fg2">{s.post.handle}</span>
                <span className="font-mono text-[10px] text-ink-muted shrink-0">{s.post.kind}</span>
              </div>

              {hidden ? (
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="font-mono text-[11px] text-amber-live">
                    hidden by {s.top.name} ({s.top.score.toFixed(2)})
                    {s.top.hits.length > 0 && (
                      <span className="text-ink-muted"> · {s.top.hits.slice(0, 4).join(', ')}</span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShown(new Set(shown).add(i))}
                    className="font-mono text-[11px] text-teal hover:underline underline-offset-4 shrink-0"
                  >
                    show
                  </button>
                </div>
              ) : (
                <p className="mt-2 text-sm text-ink-fg2/90 leading-relaxed">{s.post.text}</p>
              )}

              <div className="mt-3 grid grid-cols-3 gap-3">
                {(['ai', 'rage', 'slop'] as const).map((k) => {
                  const on = k === 'ai' ? ai : k === 'rage' ? rage : slop;
                  const v = s.all[k].score;
                  return (
                    <div key={k} className={on ? '' : 'opacity-30'}>
                      <div className="flex items-baseline justify-between font-mono text-[10px] text-ink-muted">
                        <span>{k}</span>
                        <span>{v.toFixed(2)}</span>
                      </div>
                      <div className="mt-1">
                        <Meter value={v} flagged={on && v >= threshold} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ul>
    </DemoFrame>
  );
}
