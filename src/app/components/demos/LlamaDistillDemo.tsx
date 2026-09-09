'use client';
import React, { useMemo, useState } from 'react';
import { DemoFrame, Slider, Toggle } from './DemoFrame';

/* ---------------------------------------------------------------------------
 * What QLoRA actually changes, counted exactly.
 *
 * Shapes below are Llama 3.2 3B's published config, so the base and adapter
 * parameter counts are arithmetic, not estimates. Rank and target modules are
 * yours to set: the shipped run's config was not written down, so nothing here
 * claims to be it.
 *
 * The one measured result from the run is the tone match. There are no other
 * benchmarks because none were recorded.
 * ------------------------------------------------------------------------- */

const CFG = {
  hidden: 3072,
  intermediate: 8192,
  layers: 28,
  heads: 24,
  kvHeads: 8,
  headDim: 128,
  vocab: 128256,
};

// [in_features, out_features] per attention/MLP projection.
const MODULES: { name: string; shape: [number, number]; group: 'attention' | 'mlp' }[] = [
  { name: 'q_proj',    shape: [CFG.hidden, CFG.heads * CFG.headDim],   group: 'attention' },
  { name: 'k_proj',    shape: [CFG.hidden, CFG.kvHeads * CFG.headDim], group: 'attention' },
  { name: 'v_proj',    shape: [CFG.hidden, CFG.kvHeads * CFG.headDim], group: 'attention' },
  { name: 'o_proj',    shape: [CFG.heads * CFG.headDim, CFG.hidden],   group: 'attention' },
  { name: 'gate_proj', shape: [CFG.hidden, CFG.intermediate],          group: 'mlp' },
  { name: 'up_proj',   shape: [CFG.hidden, CFG.intermediate],          group: 'mlp' },
  { name: 'down_proj', shape: [CFG.intermediate, CFG.hidden],          group: 'mlp' },
];

// Base parameter count, summed from the same shapes.
const BASE_PARAMS = (() => {
  const perLayer = MODULES.reduce((s, m) => s + m.shape[0] * m.shape[1], 0) + 2 * CFG.hidden;
  return CFG.vocab * CFG.hidden + CFG.layers * perLayer + CFG.hidden; // tied embeddings
})();

const fmt = (n: number) =>
  n >= 1e9 ? `${(n / 1e9).toFixed(2)}B` : n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}K` : `${n}`;
const gb = (bytes: number) => `${(bytes / 1024 ** 3).toFixed(2)} GB`;

export default function LlamaDistillDemo() {
  const [rank, setRank] = useState(16);
  const [targets, setTargets] = useState<Set<string>>(new Set(['q_proj', 'v_proj']));

  const toggle = (name: string) => {
    const next = new Set(targets);
    if (next.has(name)) next.delete(name); else next.add(name);
    setTargets(next);
  };

  const rows = useMemo(
    () =>
      MODULES.map((m) => {
        const on = targets.has(m.name);
        // LoRA adds A (r x d_in) and B (d_out x r) per targeted module, per layer.
        const per = on ? rank * (m.shape[0] + m.shape[1]) : 0;
        return { ...m, on, perLayer: per, total: per * CFG.layers };
      }),
    [rank, targets],
  );

  const trainable = rows.reduce((s, r) => s + r.total, 0);
  const pct = (trainable / BASE_PARAMS) * 100;

  const fp16 = BASE_PARAMS * 2;        // 2 bytes per weight
  const nf4 = BASE_PARAMS * 0.5;       // 4-bit base under QLoRA
  const adapterFp16 = trainable * 2;

  return (
    <DemoFrame
      title="llama distillation · what QLoRA trains"
      note="shapes are Llama 3.2 3B's published config; rank and targets are yours to set"
    >
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-5 space-y-4">
          <Slider
            label="lora rank (r)"
            value={rank}
            onChange={(v) => setRank(Math.round(v))}
            min={1}
            max={128}
            step={1}
            display={String(rank)}
          />

          <div>
            <div className="font-mono text-[10px] tracking-wide2 uppercase text-ink-muted mb-2">
              target modules
            </div>
            <div className="flex flex-wrap gap-1.5">
              {MODULES.map((m) => (
                <Toggle key={m.name} on={targets.has(m.name)} onClick={() => toggle(m.name)}>
                  {m.name.replace('_proj', '')}
                </Toggle>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Toggle
                on={targets.size === 2 && targets.has('q_proj') && targets.has('v_proj')}
                onClick={() => setTargets(new Set(['q_proj', 'v_proj']))}
              >
                q,v only
              </Toggle>
              <Toggle
                on={targets.size === MODULES.length}
                onClick={() => setTargets(new Set(MODULES.map((m) => m.name)))}
              >
                all linear
              </Toggle>
            </div>
          </div>

          {/* The headline comparison: base vs adapter. */}
          <div className="border border-ink-line rounded-sm divide-y divide-ink-line">
            {[
              ['base parameters', fmt(BASE_PARAMS), 'frozen, 4-bit'],
              ['trainable parameters', fmt(trainable), `${pct.toFixed(3)}% of base`],
              ['base weights, fp16', gb(fp16), 'before quantisation'],
              ['base weights, nf4', gb(nf4), '4x smaller'],
              ['adapter, fp16', adapterFp16 < 1024 ** 3 ? `${(adapterFp16 / 1024 ** 2).toFixed(1)} MB` : gb(adapterFp16), 'what you ship'],
            ].map(([k, v, note]) => (
              <div key={k} className="flex items-baseline justify-between gap-3 px-3 py-2">
                <span className="font-mono text-[11px] text-ink-muted">{k}</span>
                <span className="text-right">
                  <span className="font-mono text-[12px] text-teal">{v}</span>
                  <span className="block font-mono text-[10px] text-ink-muted">{note}</span>
                </span>
              </div>
            ))}
          </div>

          {/* Proportion bar: trainable is invisible at true scale, which is the point. */}
          <div>
            <div className="flex items-baseline justify-between font-mono text-[10px] text-ink-muted mb-1">
              <span>frozen vs trainable, to scale</span>
              <span className="text-teal">{pct.toFixed(3)}%</span>
            </div>
            <div className="h-3 w-full rounded-sm bg-ink-line overflow-hidden flex">
              <div className="h-full bg-ink-dim" style={{ width: `${100 - pct}%` }} />
              <div className="h-full bg-teal" style={{ width: `${Math.max(pct, 0.25)}%` }} />
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7 space-y-4">
          <div>
            <div className="font-mono text-[10px] tracking-wide2 uppercase text-ink-muted mb-2">
              per-module accounting
            </div>
            <div className="overflow-x-auto rounded-sm border border-ink-line">
              <table className="w-full font-mono text-[11px]">
                <thead>
                  <tr className="text-ink-muted border-b border-ink-line">
                    <th className="text-left px-2.5 py-1.5 font-normal">module</th>
                    <th className="text-right px-2.5 py-1.5 font-normal">shape</th>
                    <th className="text-right px-2.5 py-1.5 font-normal">base</th>
                    <th className="text-right px-2.5 py-1.5 font-normal">lora</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr
                      key={r.name}
                      className={`border-b border-ink-line/60 last:border-0 ${r.on ? 'text-ink-fg2' : 'text-ink-dim'}`}
                    >
                      <td className="px-2.5 py-1.5">
                        <span className={r.on ? 'text-teal' : ''}>{r.name}</span>
                      </td>
                      <td className="text-right px-2.5 py-1.5">{r.shape[0]}×{r.shape[1]}</td>
                      <td className="text-right px-2.5 py-1.5">
                        {fmt(r.shape[0] * r.shape[1] * CFG.layers)}
                      </td>
                      <td className={`text-right px-2.5 py-1.5 ${r.on ? 'text-teal' : ''}`}>
                        {r.on ? fmt(r.total) : '·'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-1.5 font-mono text-[10px] text-ink-muted">
              base column is across all {CFG.layers} layers. lora adds r×(d_in + d_out) per
              targeted module per layer.
            </p>
          </div>

          <div className="border border-teal-dim/30 rounded-sm p-3">
            <div className="font-mono text-[10px] tracking-wide2 uppercase text-ink-muted mb-2">
              measured result
            </div>
            <p className="text-[13px] text-ink-fg2 leading-relaxed">
              <span className="font-mono text-lg text-teal">64%</span> of assessed outputs matched
              ground-truth tone and style, fine-tuned on years of my own message history.
            </p>
            <p className="mt-2 font-mono text-[10px] text-ink-muted leading-relaxed">
              That is the only eval recorded for this run. No perplexity, no held-out benchmark
              suite, no baseline comparison. The numbers on the left are arithmetic from the
              published architecture, not measurements.
            </p>
          </div>
        </div>
      </div>
    </DemoFrame>
  );
}
