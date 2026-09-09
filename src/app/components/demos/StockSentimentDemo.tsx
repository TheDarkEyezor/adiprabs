'use client';
import React, { useMemo, useState } from 'react';
import { DemoFrame, Toggle } from './DemoFrame';

/* ---------------------------------------------------------------------------
 * The feature-engineering half of the Stock Sentiment Dashboard.
 *
 * This is the part of the repo that is actually built: the pandas_ta indicator
 * stack in data_ingestion/preprocess.py and the VADER compound score in
 * news_fetcher.py. Those formulas are reimplemented here exactly, with
 * pandas_ta's default periods.
 *
 * It is NOT a forecaster. The repo's model path trains LightGBM on synthetic
 * columns and the senator-trade features are still stubbed, so there is no
 * honest prediction to show. What you get is the feature row that would be
 * handed to the model.
 *
 * The price series is synthetic and labelled as such: it exists to drive the
 * indicator math, not to represent a real instrument.
 * ------------------------------------------------------------------------- */

type Bar = { close: number; high: number; low: number };

/** Deterministic PRNG so the "synthetic" series is stable across renders. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const REGIMES = {
  trending: { drift: 0.0016, vol: 0.011, seed: 7 },
  choppy: { drift: 0.0, vol: 0.019, seed: 21 },
  selloff: { drift: -0.0028, vol: 0.024, seed: 99 },
} as const;
type Regime = keyof typeof REGIMES;

function makeSeries(regime: Regime, n = 120): Bar[] {
  const { drift, vol, seed } = REGIMES[regime];
  const rnd = mulberry32(seed);
  const bars: Bar[] = [];
  let price = 150;
  for (let i = 0; i < n; i++) {
    // Box-Muller for a normal step.
    const u = Math.max(rnd(), 1e-9), v = rnd();
    const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    price = Math.max(1, price * (1 + drift + vol * z));
    const range = price * vol * (0.6 + rnd() * 0.8);
    bars.push({ close: price, high: price + range * rnd(), low: price - range * rnd() });
  }
  return bars;
}

/* --- indicators, matching pandas_ta defaults ----------------------------- */

const sma = (xs: number[], n: number) =>
  xs.map((_, i) => (i < n - 1 ? NaN : xs.slice(i - n + 1, i + 1).reduce((a, b) => a + b, 0) / n));

/** pandas_ta.ema: SMA seed, then adjust=False recursion with alpha = 2/(n+1). */
function ema(xs: number[], n: number): number[] {
  const a = 2 / (n + 1);
  const out = new Array(xs.length).fill(NaN);
  if (xs.length < n) return out;
  let prev = xs.slice(0, n).reduce((s, x) => s + x, 0) / n;
  out[n - 1] = prev;
  for (let i = n; i < xs.length; i++) { prev = a * xs[i] + (1 - a) * prev; out[i] = prev; }
  return out;
}

/** Wilder's RSI, pandas_ta default length 14. */
function rsi(xs: number[], n = 14): number[] {
  const out = new Array(xs.length).fill(NaN);
  if (xs.length <= n) return out;
  let g = 0, l = 0;
  for (let i = 1; i <= n; i++) {
    const d = xs[i] - xs[i - 1];
    if (d > 0) g += d; else l -= d;
  }
  g /= n; l /= n;
  out[n] = l === 0 ? 100 : 100 - 100 / (1 + g / l);
  for (let i = n + 1; i < xs.length; i++) {
    const d = xs[i] - xs[i - 1];
    g = (g * (n - 1) + Math.max(d, 0)) / n;
    l = (l * (n - 1) + Math.max(-d, 0)) / n;
    out[i] = l === 0 ? 100 : 100 - 100 / (1 + g / l);
  }
  return out;
}

/** pandas_ta.macd(fast=12, slow=26, signal=9). */
function macd(xs: number[]) {
  const f = ema(xs, 12), s = ema(xs, 26);
  const line = xs.map((_, i) => f[i] - s[i]);
  const valid = line.filter((v) => !Number.isNaN(v));
  const sig = ema(valid, 9);
  const offset = line.length - valid.length;
  const signal = new Array(line.length).fill(NaN);
  sig.forEach((v, i) => { signal[i + offset] = v; });
  return { line, signal, hist: line.map((v, i) => v - signal[i]) };
}

/** pandas_ta.bbands(length=20, std=2), population stdev (ddof=0). */
function bbands(xs: number[], n = 20, k = 2) {
  const mid = sma(xs, n);
  const upper = new Array(xs.length).fill(NaN);
  const lower = new Array(xs.length).fill(NaN);
  for (let i = n - 1; i < xs.length; i++) {
    const w = xs.slice(i - n + 1, i + 1);
    const m = mid[i];
    const sd = Math.sqrt(w.reduce((s, x) => s + (x - m) ** 2, 0) / n);
    upper[i] = m + k * sd; lower[i] = m - k * sd;
  }
  return { mid, upper, lower };
}

/** Wilder's ATR over true range, length 14. */
function atr(bars: Bar[], n = 14): number[] {
  const tr = bars.map((b, i) =>
    i === 0 ? b.high - b.low
            : Math.max(b.high - b.low, Math.abs(b.high - bars[i - 1].close), Math.abs(b.low - bars[i - 1].close)));
  const out = new Array(bars.length).fill(NaN);
  if (bars.length <= n) return out;
  let prev = tr.slice(1, n + 1).reduce((s, x) => s + x, 0) / n;
  out[n] = prev;
  for (let i = n + 1; i < bars.length; i++) { prev = (prev * (n - 1) + tr[i]) / n; out[i] = prev; }
  return out;
}

/* --- VADER compound, trimmed lexicon ------------------------------------- */

// Real VADER valences, restricted to the words in the sample headlines.
const LEXICON: Record<string, number> = {
  beats: 1.5, beat: 1.4, strong: 2.3, surge: 1.9, surges: 1.9, record: 1.4, growth: 1.7,
  gain: 1.6, gains: 1.6, upgrade: 1.5, optimistic: 2.0, boost: 1.7, wins: 2.4, win: 2.4,
  miss: -1.4, misses: -1.4, weak: -1.9, plunge: -2.5, plunges: -2.5, cuts: -1.1, cut: -1.1,
  loss: -1.8, losses: -1.8, probe: -1.2, lawsuit: -1.8, downgrade: -1.6, warns: -1.7,
  warning: -1.6, fears: -2.0, slump: -1.9, halts: -1.3, recall: -1.2, fraud: -3.0,
  good: 1.9, great: 3.1, bad: -2.5, risk: -1.4, risks: -1.4, delay: -1.3, delays: -1.3,
};
const NEGATIONS = new Set(['not', 'no', 'never', 'none', "n't", 'without', 'lacks', 'lacking']);
const BOOSTERS: Record<string, number> = {
  very: 0.293, extremely: 0.293, hugely: 0.293, massively: 0.293, slightly: -0.293,
  marginally: -0.293, somewhat: -0.293, barely: -0.293,
};

/** VADER's scoring path: valence, boosters, negation, caps, punctuation, then normalise. */
function vader(text: string) {
  const raw = text.match(/[A-Za-z']+|!/g) ?? [];
  const words = raw.filter((w) => w !== '!');
  const lower = words.map((w) => w.toLowerCase());
  const allCaps = words.filter((w) => w.length > 1 && w === w.toUpperCase()).length;
  const isCapsDiff = allCaps > 0 && allCaps < words.length;

  let sum = 0;
  const hits: { word: string; valence: number }[] = [];
  lower.forEach((w, i) => {
    let v = LEXICON[w];
    if (v === undefined) return;
    if (isCapsDiff && words[i] === words[i].toUpperCase()) v += v > 0 ? 0.733 : -0.733;
    for (let d = 1; d <= 3 && i - d >= 0; d++) {
      const prev = lower[i - d];
      if (BOOSTERS[prev] !== undefined) {
        let b = BOOSTERS[prev] * (v > 0 ? 1 : -1);
        if (d === 2) b *= 0.95; if (d === 3) b *= 0.9;
        v += b;
      }
      if (NEGATIONS.has(prev)) v *= -0.74;
    }
    sum += v;
    hits.push({ word: words[i], valence: v });
  });

  // Exclamation emphasis, capped at 4 as VADER does.
  const ex = Math.min((text.match(/!/g) ?? []).length, 4) * 0.292;
  sum += sum > 0 ? ex : sum < 0 ? -ex : 0;

  return { compound: sum / Math.sqrt(sum * sum + 15), hits };
}

const HEADLINES = [
  'Chipmaker beats earnings estimates, shares surge on strong guidance',
  'Regulator opens probe into accounting; company warns of delays',
  'Analysts upgrade the stock after record quarterly growth',
  'Supplier halts shipments, cutting output; management downgrades outlook',
  'Quarterly results were not bad, though margins slightly weak',
];

const n2 = (v: number) => (Number.isNaN(v) ? '·' : v.toFixed(2));

export default function StockSentimentDemo() {
  const [regime, setRegime] = useState<Regime>('trending');
  const bars = useMemo(() => makeSeries(regime), [regime]);
  const closes = useMemo(() => bars.map((b) => b.close), [bars]);

  const f = useMemo(() => {
    const i = closes.length - 1;
    const m = macd(closes);
    const bb = bbands(closes);
    const a = atr(bars);
    const r = rsi(closes);
    return {
      i,
      close: closes[i],
      returns: closes[i] / closes[i - 1] - 1,
      SMA_10: sma(closes, 10)[i], SMA_20: sma(closes, 20)[i], SMA_50: sma(closes, 50)[i],
      EMA_10: ema(closes, 10)[i], EMA_20: ema(closes, 20)[i], EMA_50: ema(closes, 50)[i],
      RSI_14: r[i],
      MACD: m.line[i], MACD_signal: m.signal[i], MACD_hist: m.hist[i],
      BB_upper: bb.upper[i], BB_mid: bb.mid[i], BB_lower: bb.lower[i],
      ATR_14: a[i],
    };
  }, [closes, bars]);

  const scored = useMemo(() => HEADLINES.map((h) => ({ text: h, ...vader(h) })), []);
  const meanSent = scored.reduce((s, x) => s + x.compound, 0) / scored.length;

  // Sparkline over the close series.
  const path = useMemo(() => {
    const lo = Math.min(...closes), hi = Math.max(...closes);
    return closes
      .map((c, i) => `${(i / (closes.length - 1)) * 100},${30 - ((c - lo) / (hi - lo)) * 28}`)
      .join(' ');
  }, [closes]);

  return (
    <DemoFrame
      title="stock sentiment · feature pipeline"
      note="the indicator + sentiment stage, not a forecaster"
    >
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="font-mono text-[10px] tracking-wide2 uppercase text-ink-muted mr-1">
          synthetic series
        </span>
        {(Object.keys(REGIMES) as Regime[]).map((r) => (
          <Toggle key={r} on={regime === r} onClick={() => setRegime(r)}>{r}</Toggle>
        ))}
      </div>

      <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-16 mb-4 rounded-sm border border-ink-line bg-ink-bg">
        <polyline points={path} fill="none" stroke="#14B8A6" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
      </svg>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-6">
          <div className="font-mono text-[10px] tracking-wide2 uppercase text-ink-muted mb-2">
            price features, bar {f.i + 1}
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[11px]">
            {([
              ['close', f.close.toFixed(2)],
              ['returns', (f.returns * 100).toFixed(2) + '%'],
              ['SMA_10', n2(f.SMA_10)], ['SMA_20', n2(f.SMA_20)],
              ['SMA_50', n2(f.SMA_50)], ['EMA_10', n2(f.EMA_10)],
              ['EMA_20', n2(f.EMA_20)], ['EMA_50', n2(f.EMA_50)],
              ['RSI_14', n2(f.RSI_14)], ['ATR_14', n2(f.ATR_14)],
              ['MACD', n2(f.MACD)], ['MACD_signal', n2(f.MACD_signal)],
              ['MACD_hist', n2(f.MACD_hist)], ['BB_mid', n2(f.BB_mid)],
              ['BB_upper', n2(f.BB_upper)], ['BB_lower', n2(f.BB_lower)],
            ] as [string, string][]).map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-ink-line/50 py-0.5">
                <span className="text-ink-muted">{k}</span>
                <span className="text-ink-fg2">{v}</span>
              </div>
            ))}
          </div>
          <p className="mt-2 font-mono text-[10px] text-ink-muted leading-relaxed">
            pandas_ta defaults: RSI 14 (Wilder), MACD 12/26/9, Bollinger 20/2 (ddof=0),
            ATR 14 (Wilder).
          </p>
        </div>

        <div className="col-span-12 lg:col-span-6">
          <div className="flex items-baseline justify-between font-mono text-[10px] tracking-wide2 uppercase text-ink-muted mb-2">
            <span>vader compound</span>
            <span className={meanSent >= 0 ? 'text-teal' : 'text-amber-live'}>
              mean {meanSent.toFixed(3)}
            </span>
          </div>
          <ul className="space-y-1.5">
            {scored.map((s) => (
              <li key={s.text} className="border border-ink-line rounded-sm p-2">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[12px] text-ink-fg2 leading-snug">{s.text}</span>
                  <span className={`font-mono text-[11px] shrink-0 ${s.compound >= 0 ? 'text-teal' : 'text-amber-live'}`}>
                    {s.compound >= 0 ? '+' : ''}{s.compound.toFixed(3)}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {s.hits.map((h, i) => (
                    <span key={i} className="font-mono text-[10px] px-1 rounded-sm bg-ink-surface/70 text-ink-muted">
                      {h.word} {h.valence >= 0 ? '+' : ''}{h.valence.toFixed(2)}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-2 font-mono text-[10px] text-ink-muted leading-relaxed">
            VADER&apos;s own path: lexicon valence, booster and negation windows, caps
            emphasis, then x/sqrt(x²+15). Lexicon trimmed to these headlines.
          </p>
        </div>
      </div>

      <p className="mt-4 text-[13px] text-ink-fg2/80 leading-relaxed">
        This is where the repo actually stops. The feature row above is what gets handed to
        the model, but the training path fits LightGBM on synthetic columns and the
        senator-trade features are still stubbed, so there is no honest prediction to put
        here. Showing the pipeline that exists beats inventing a forecast that does not.
      </p>
    </DemoFrame>
  );
}
