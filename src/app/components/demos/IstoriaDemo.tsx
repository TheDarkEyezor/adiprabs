'use client';
import React, { useMemo, useState } from 'react';
import { DemoFrame, Slider, Toggle } from './DemoFrame';

/* ---------------------------------------------------------------------------
 * Istoria's ranking step on a fixed sample batch: seven real events, eight
 * baseline photos. The shipped blend is 45/25/18/12 across distance-from-home,
 * message buzz, photo count and CLIP centroid distance. Push CLIP to 100% and
 * the original failure comes straight back: a macro shot of a mug outranks a
 * week in Iceland.
 * ------------------------------------------------------------------------- */

type Moment = {
  label: string;
  real: boolean;
  km: number;        // distance from home, kilometres
  msgs: number;      // messages in the +/-2h window
  photos: number;    // photos in the event
  clip: number;      // cosine distance from the month's CLIP centroid
};

const BATCH: Moment[] = [
  { label: 'A week in Iceland',          real: true,  km: 1850, msgs: 64,  photos: 41, clip: 0.31 },
  { label: "Cousin's wedding",           real: true,  km: 210,  msgs: 96,  photos: 55, clip: 0.35 },
  { label: 'Flight home from the trip',  real: true,  km: 950,  msgs: 38,  photos: 9,  clip: 0.28 },
  { label: 'Coast day trip',             real: true,  km: 78,   msgs: 29,  photos: 19, clip: 0.33 },
  { label: 'Hackathon weekend',          real: true,  km: 41,   msgs: 112, photos: 17, clip: 0.26 },
  { label: 'Gig in Brixton',             real: true,  km: 12,   msgs: 58,  photos: 16, clip: 0.24 },
  { label: "Friend's birthday",          real: true,  km: 8.2,  msgs: 87,  photos: 23, clip: 0.22 },
  { label: 'Macro shot of a coffee mug', real: false, km: 0.0,  msgs: 1,   photos: 1,  clip: 0.92 },
  { label: 'Macro of a plant',           real: false, km: 0.05, msgs: 0,   photos: 1,  clip: 0.86 },
  { label: 'Close-up of a book',         real: false, km: 0.1,  msgs: 0,   photos: 2,  clip: 0.81 },
  { label: 'Screenshot of a receipt',    real: false, km: 0.0,  msgs: 0,   photos: 1,  clip: 0.71 },
  { label: 'Cat on the sofa',            real: false, km: 0.0,  msgs: 3,   photos: 4,  clip: 0.62 },
  { label: 'Desk setup',                 real: false, km: 0.0,  msgs: 2,   photos: 3,  clip: 0.55 },
  { label: 'Tuesday coffee',             real: false, km: 0.6,  msgs: 1,   photos: 1,  clip: 0.34 },
  { label: 'Walk round the block',       real: false, km: 1.1,  msgs: 0,   photos: 2,  clip: 0.29 },
];

const SHIPPED = { km: 0.45, msgs: 0.25, photos: 0.18, clip: 0.12 };
const CLIP_ONLY = { km: 0, msgs: 0, photos: 0, clip: 1 };

type Weights = typeof SHIPPED;

// Min-max over the batch, so every signal lands on the same 0..1 axis before
// the blend. Distance is log-scaled first: 1850km is not 1850x a 1km trip.
function normalizer(values: number[]) {
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  return (v: number) => (hi === lo ? 0 : (v - lo) / (hi - lo));
}

export default function IstoriaDemo() {
  const [w, setW] = useState<Weights>(SHIPPED);

  const ranked = useMemo(() => {
    const nKm = normalizer(BATCH.map((m) => Math.log1p(m.km)));
    const nMsgs = normalizer(BATCH.map((m) => m.msgs));
    const nPhotos = normalizer(BATCH.map((m) => m.photos));
    const nClip = normalizer(BATCH.map((m) => m.clip));
    const total = w.km + w.msgs + w.photos + w.clip || 1;

    return BATCH.map((m) => ({
      m,
      score:
        (w.km * nKm(Math.log1p(m.km)) +
          w.msgs * nMsgs(m.msgs) +
          w.photos * nPhotos(m.photos) +
          w.clip * nClip(m.clip)) /
        total,
    })).sort((a, b) => b.score - a.score);
  }, [w]);

  // The interesting number: does any baseline outrank any real event?
  const lowestReal = Math.min(...ranked.filter((r) => r.m.real).map((r) => r.score));
  const highestNoise = Math.max(...ranked.filter((r) => !r.m.real).map((r) => r.score));
  const clean = lowestReal > highestNoise;
  const isShipped = JSON.stringify(w) === JSON.stringify(SHIPPED);
  const isClipOnly = JSON.stringify(w) === JSON.stringify(CLIP_ONLY);

  return (
    <DemoFrame title="istoria · ranking" note="15-moment sample batch, weights live">
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 md:col-span-5 space-y-3">
          <div className="flex flex-wrap gap-2">
            <Toggle on={isShipped} onClick={() => setW(SHIPPED)}>shipped blend</Toggle>
            <Toggle on={isClipOnly} onClick={() => setW(CLIP_ONLY)}>clip only</Toggle>
          </div>

          <Slider label="distance from home" value={w.km} onChange={(v) => setW({ ...w, km: v })}
            display={`${Math.round(w.km * 100)}%`} />
          <Slider label="message buzz" value={w.msgs} onChange={(v) => setW({ ...w, msgs: v })}
            display={`${Math.round(w.msgs * 100)}%`} />
          <Slider label="photo count" value={w.photos} onChange={(v) => setW({ ...w, photos: v })}
            display={`${Math.round(w.photos * 100)}%`} />
          <Slider label="clip centroid distance" value={w.clip} onChange={(v) => setW({ ...w, clip: v })}
            display={`${Math.round(w.clip * 100)}%`} />

          <div className={`border rounded-sm p-3 font-mono text-[11px] leading-relaxed ${
            clean ? 'border-teal-dim/40 text-teal' : 'border-amber-live/40 text-amber-live'
          }`}>
            {clean ? 'separated' : 'overlapping'}: lowest real event {lowestReal.toFixed(2)},
            highest baseline {highestNoise.toFixed(2)}
            <span className="block mt-1 text-ink-muted">
              {clean
                ? 'Every real event ranks above every baseline photo.'
                : 'A baseline photo has climbed above a real event.'}
            </span>
          </div>

          <p className="text-[13px] text-ink-fg2/80 leading-relaxed">
            CLIP measures visual novelty. A macro shot is genuinely unusual against
            an average phone photo, so it wins on embedding distance and loses on
            everything that made the moment worth keeping. Put the slider on{' '}
            <span className="text-teal">clip only</span> to see the mug beat Iceland.
          </p>
        </div>

        <ol className="col-span-12 md:col-span-7 space-y-1">
          {ranked.map((r, i) => (
            <li
              key={r.m.label}
              className="flex items-center gap-3 px-2 py-1.5 rounded-sm bg-ink-surface/50"
            >
              <span className="font-mono text-[10px] text-ink-muted w-5 shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                  r.m.real ? 'bg-teal' : 'bg-ink-dim'
                }`}
                aria-label={r.m.real ? 'real event' : 'baseline photo'}
              />
              <span className={`text-[13px] truncate ${r.m.real ? 'text-ink-fg' : 'text-ink-muted'}`}>
                {r.m.label}
              </span>
              <span className="ml-auto flex items-center gap-2 shrink-0">
                <span className="hidden sm:block h-1 w-16 bg-ink-line rounded-sm overflow-hidden">
                  <span
                    className={`block h-full transition-[width] duration-300 ${
                      r.m.real ? 'bg-teal-dim' : 'bg-ink-dim'
                    }`}
                    style={{ width: `${r.score * 100}%` }}
                  />
                </span>
                <span className="font-mono text-[10px] text-ink-fg2 w-8 text-right">
                  {r.score.toFixed(2)}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </DemoFrame>
  );
}
