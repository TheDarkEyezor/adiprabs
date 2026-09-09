'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DemoFrame, Meter } from './DemoFrame';

/* ---------------------------------------------------------------------------
 * SwyftGesture, ported to the browser.
 *
 * The original (Electro-Vision) is Python: MediaPipe Hands over an OpenCV
 * capture, driving the real cursor through pynput and macOS volume through
 * osascript. MediaPipe's web build gives the same 21 landmarks, so the
 * perception and gesture-classification layers here are a direct port,
 * thresholds included. Only the actuation differs: a browser cannot move your
 * system cursor, so the same coordinates drive the panel on the right.
 *
 * Everything runs locally. No frame leaves the page.
 * ------------------------------------------------------------------------- */

const W = 640;
const H = 480;                        // the original's cap.set(3/4, 640/480)
const TIP_IDS = [4, 8, 12, 16, 20];   // htm.handDetector.tipIds
const LAG_REC = 3;                    // handMouse.py deadzone, pixels
const CLICK_PX = 30;                  // handMouse.py press/release threshold
const VOL_RANGE: [number, number] = [10, 100]; // handVolumeControl.py interp

// MediaPipe assets are vendored under public/ so the demo has no external
// runtime dependency. Point these at a CDN instead to slim the repo.
const WASM_PATH = '/mediapipe/wasm';
const MODEL_PATH = '/mediapipe/hand_landmarker.task';

type Pt = { x: number; y: number };
type Mode = 'idle' | 'mouse' | 'volume';

const HAND_CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20], [0, 17],
];

/**
 * fingerOpen.FingerCounter, verbatim: thumb compares x against the joint
 * below it, the other four compare y against two joints down. Runs on raw
 * (unmirrored) landmarks so the thumb test keeps the sign the original had.
 */
function fingerCounter(lm: Pt[]): number[] {
  const fingers = [lm[TIP_IDS[0]].x > lm[TIP_IDS[0] - 1].x ? 1 : 0];
  for (let id = 1; id < 5; id++) {
    fingers.push(lm[TIP_IDS[id]].y < lm[TIP_IDS[id] - 2].y ? 1 : 0);
  }
  return fingers;
}

const eq = (a: number[], b: number[]) => a.length === b.length && a.every((v, i) => v === b[i]);
const hypot = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);
const interp = (v: number, [i0, i1]: [number, number], [o0, o1]: [number, number]) =>
  o0 + ((Math.min(Math.max(v, i0), i1) - i0) / (i1 - i0)) * (o1 - o0);

// main.py's dispatch table, plus each mode's own exit gesture.
const GESTURES: { fingers: number[]; label: string; means: string }[] = [
  { fingers: [1, 1, 0, 0, 0], label: 'thumb + index', means: 'enter volume mode' },
  { fingers: [1, 1, 1, 0, 0], label: 'thumb + index + middle', means: 'enter mouse mode' },
  { fingers: [0, 1, 1, 0, 0], label: 'index + middle, pinched', means: 'left click' },
  { fingers: [0, 0, 0, 0, 0], label: 'fist', means: 'quit' },
];

export default function SwyftGestureDemo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const landmarkerRef = useRef<{ detectForVideo: (v: HTMLVideoElement, t: number) => { landmarks: Pt[][] }; close: () => void } | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Mutable per-frame state, kept in refs so the rAF loop never re-subscribes.
  const modeRef = useRef<Mode>('idle');
  const checkRef = useRef({ x1: 0, y1: 0, x2: 0, y2: 0 }); // handMouse.py's *Check vars

  const [status, setStatus] = useState<'off' | 'starting' | 'live' | 'error'>('off');
  const [error, setError] = useState('');
  const [fingers, setFingers] = useState<number[] | null>(null); // null = no hand
  const [mode, setMode] = useState<Mode>('idle');
  const [cursor, setCursor] = useState<Pt | null>(null);
  const [pressed, setPressed] = useState(false);
  const [volume, setVolume] = useState(0);
  const [fps, setFps] = useState(0);

  const stop = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    landmarkerRef.current?.close();
    landmarkerRef.current = null;
    modeRef.current = 'idle';
    setMode('idle');
    setCursor(null);
    setPressed(false);
    setStatus('off');
  }, []);

  useEffect(() => stop, [stop]);

  const start = useCallback(async () => {
    setStatus('starting');
    setError('');
    try {
      const vision = await import('@mediapipe/tasks-vision');
      const fileset = await vision.FilesetResolver.forVisionTasks(WASM_PATH);
      const options = (delegate: 'GPU' | 'CPU') => ({
        baseOptions: { modelAssetPath: MODEL_PATH, delegate },
        runningMode: 'VIDEO' as const,
        numHands: 1,
        // htm.handDetector(detectionCon=0.75) in main.py
        minHandDetectionConfidence: 0.75,
        minTrackingConfidence: 0.5,
      });
      const landmarker = await vision.HandLandmarker.createFromOptions(fileset, options('GPU'))
        .catch(() => vision.HandLandmarker.createFromOptions(fileset, options('CPU')));

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: W, height: H, facingMode: 'user' },
      });

      const video = videoRef.current;
      if (!video) throw new Error('video element went away');
      video.srcObject = stream;
      await video.play();

      landmarkerRef.current = landmarker as never;
      streamRef.current = stream;
      setStatus('live');

      let last = -1;
      let prevT = performance.now();

      const loop = () => {
        rafRef.current = requestAnimationFrame(loop);
        const v = videoRef.current;
        const c = canvasRef.current;
        const lmk = landmarkerRef.current;
        if (!v || !c || !lmk || v.readyState < 2) return;
        if (v.currentTime === last) return;
        last = v.currentTime;

        const now = performance.now();
        setFps(Math.round(1000 / Math.max(1, now - prevT)));
        prevT = now;

        const res = lmk.detectForVideo(v, now);
        const ctx = c.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, W, H);

        const norm = res.landmarks?.[0];
        if (!norm) {
          setFingers(null);
          setCursor(null);
          setPressed(false);
          return;
        }

        // Landmarks in the original's pixel space (findPosition's cx, cy).
        const lm: Pt[] = norm.map((p) => ({ x: p.x * W, y: p.y * H }));
        const f = fingerCounter(lm);
        setFingers(f);

        // main.py's mode dispatch, and each mode's exit gesture.
        let m = modeRef.current;
        if (eq(f, [0, 0, 0, 0, 0])) m = 'idle';
        else if (eq(f, [1, 1, 0, 0, 0])) m = 'volume';
        else if (eq(f, [1, 1, 1, 0, 0]) && m !== 'mouse') m = 'mouse';
        else if (m === 'mouse' && eq(f, [1, 1, 1, 0, 1])) m = 'idle';
        else if (m === 'volume' && eq(f, [1, 1, 0, 0, 1])) m = 'idle';
        modeRef.current = m;
        setMode(m);

        // Draw the skeleton, mirrored so the preview reads as a mirror.
        ctx.save();
        ctx.translate(W, 0);
        ctx.scale(-1, 1);
        ctx.strokeStyle = 'rgba(94,234,212,0.55)';
        ctx.lineWidth = 2;
        for (const [a, b] of HAND_CONNECTIONS) {
          ctx.beginPath();
          ctx.moveTo(lm[a].x, lm[a].y);
          ctx.lineTo(lm[b].x, lm[b].y);
          ctx.stroke();
        }
        ctx.fillStyle = '#5EEAD4';
        for (const p of lm) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
          ctx.fill();
        }

        if (m === 'volume') {
          // handVolumeControl.py: thumb tip (4) to index tip (8).
          const len = hypot(lm[4], lm[8]);
          const vol = interp(len, VOL_RANGE, [0, 100]);
          setVolume(vol);
          ctx.strokeStyle = len < 50 ? '#5EEAD4' : '#F4A261';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(lm[4].x, lm[4].y);
          ctx.lineTo(lm[8].x, lm[8].y);
          ctx.stroke();
          for (const p of [lm[4], lm[8]]) {
            ctx.fillStyle = len < 50 ? '#5EEAD4' : '#F4A261';
            ctx.beginPath();
            ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        if (m === 'mouse') {
          // handMouse.py: cursor is the midpoint of middle tip (12) and
          // index tip (8), each axis latched through a 3px deadzone.
          const ck = checkRef.current;
          const [x1, y1] = [lm[12].x, lm[12].y];
          const [x2, y2] = [lm[8].x, lm[8].y];
          if (Math.abs(ck.x1 - x1) > LAG_REC) ck.x1 = x1;
          if (Math.abs(ck.y1 - y1) > LAG_REC) ck.y1 = y1;
          if (Math.abs(ck.x2 - x2) > LAG_REC) ck.x2 = x2;
          if (Math.abs(ck.y2 - y2) > LAG_REC) ck.y2 = y2;
          const cx = (ck.x1 + ck.x2) / 2;
          const cy = (ck.y1 + ck.y2) / 2;

          // The original maps the middle 60% of the frame onto the whole
          // screen, X inverted. Here the "screen" is the panel, 0..1.
          const px = interp(cx, [0.2 * W, 0.8 * W], [1, 0]);
          const py = interp(cy, [0.2 * H, 0.8 * H], [0, 1]);
          setCursor({ x: px, y: py });

          const click = hypot(lm[8], lm[12]);
          setPressed(eq(f, [0, 1, 1, 0, 0]) && click <= CLICK_PX);

          ctx.fillStyle = '#F472B6';
          ctx.beginPath();
          ctx.arc(x1, y1, 10, 0, Math.PI * 2);
          ctx.fill();
          if (f[2] === 1) {
            ctx.beginPath();
            ctx.arc(x2, y2, 10, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          setCursor(null);
          setPressed(false);
        }

        ctx.restore();
      };

      rafRef.current = requestAnimationFrame(loop);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(
        /permission|denied|notallowed/i.test(msg)
          ? 'Camera permission was denied. Nothing runs without it.'
          : msg,
      );
      setStatus('error');
      stop();
    }
  }, [stop]);

  // Panel targets the gesture cursor can land on, standing in for the desktop.
  const TARGETS = ['open', 'save', 'close'];
  // Derived, not state: which target a pressed cursor is currently over.
  const hitIndex = cursor && pressed
    ? Math.min(TARGETS.length - 1, Math.floor(cursor.x * TARGETS.length))
    : -1;

  return (
    <DemoFrame
      title="swyftgesture"
      note="runs locally, no frame leaves your browser"
    >
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-7">
          <div className="relative rounded-sm overflow-hidden border border-ink-line bg-ink-bg" style={{ aspectRatio: `${W} / ${H}` }}>
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ transform: 'scaleX(-1)' }}
              playsInline
              muted
            />
            <canvas
              ref={canvasRef}
              width={W}
              height={H}
              className="absolute inset-0 h-full w-full"
            />

            {status !== 'live' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink-bg/90 p-6 text-center">
                {status === 'starting' ? (
                  <span className="font-mono text-[11px] text-ink-muted">
                    loading hand landmarker<span className="caret" aria-hidden />
                  </span>
                ) : (
                  <>
                    <p className="max-w-sm text-[13px] text-ink-fg2 leading-relaxed">
                      This runs the real thing: MediaPipe hand tracking and the same
                      gesture thresholds as the Python original, in your browser. It
                      needs your camera, and nothing is recorded, uploaded or stored.
                    </p>
                    <button
                      type="button"
                      onClick={start}
                      className="px-3 py-1.5 border border-teal-dim rounded-sm font-mono text-[11px] tracking-wide2 uppercase text-teal hover:bg-teal/5 transition-colors"
                    >
                      enable camera
                    </button>
                    {status === 'error' && (
                      <p className="font-mono text-[11px] text-amber-live max-w-sm">{error}</p>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {status === 'live' && (
            <div className="mt-2 flex items-center justify-between gap-3 font-mono text-[10px] text-ink-muted">
              <span>
                {fingers ? `fingers [${fingers.join(',')}]` : 'no hand'} · mode {mode} · {fps} fps
              </span>
              <button type="button" onClick={stop} className="text-teal hover:underline underline-offset-4">
                stop camera
              </button>
            </div>
          )}
        </div>

        <div className="col-span-12 lg:col-span-5 space-y-4">
          <div>
            <div className="font-mono text-[10px] tracking-wide2 uppercase text-ink-muted mb-2">gestures</div>
            <ul className="space-y-1">
              {GESTURES.map((g) => {
                const active = fingers !== null && eq(fingers, g.fingers);
                return (
                  <li
                    key={g.means}
                    className={`flex items-baseline justify-between gap-3 px-2 py-1 rounded-sm text-[11px] font-mono transition-colors ${
                      active ? 'bg-teal/10 text-teal' : 'text-ink-muted'
                    }`}
                  >
                    <span>[{g.fingers.join(',')}]</span>
                    <span className="text-right">{g.means}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <div className="flex items-baseline justify-between font-mono text-[10px] tracking-wide2 uppercase text-ink-muted mb-2">
              <span>volume</span>
              <span className={mode === 'volume' ? 'text-teal' : ''}>{Math.round(volume)}%</span>
            </div>
            <Meter value={volume / 100} />
            <p className="mt-1 font-mono text-[10px] text-ink-muted">
              thumb-to-index distance, mapped {VOL_RANGE[0]}&ndash;{VOL_RANGE[1]}px
            </p>
          </div>

          <div>
            <div className="font-mono text-[10px] tracking-wide2 uppercase text-ink-muted mb-2">
              cursor target
            </div>
            <div className="relative border border-ink-line rounded-sm bg-ink-bg" style={{ aspectRatio: '16 / 10' }}>
              <div className="absolute inset-0 grid grid-cols-3 gap-px p-px">
                {TARGETS.map((t, i) => (
                  <div
                    key={t}
                    className={`flex items-center justify-center font-mono text-[11px] transition-colors ${
                      hitIndex === i ? 'bg-teal/20 text-teal' : 'bg-ink-surface/60 text-ink-muted'
                    }`}
                  >
                    {t}
                  </div>
                ))}
              </div>
              {cursor && (
                <span
                  className={`absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-colors ${
                    pressed ? 'bg-teal border-teal' : 'bg-transparent border-teal'
                  }`}
                  style={{ left: `${cursor.x * 100}%`, top: `${cursor.y * 100}%` }}
                />
              )}
            </div>
            <p className="mt-1 font-mono text-[10px] text-ink-muted">
              midpoint of index and middle tips, X inverted
            </p>
          </div>
        </div>
      </div>

      <p className="mt-4 text-[13px] text-ink-fg2/80 leading-relaxed">
        The original drives the real cursor through pynput and macOS volume through
        osascript. A browser cannot do either, so the same coordinates land on the
        panel instead. Perception and gesture classification are unchanged, down to
        the {LAG_REC}px deadzone and the {CLICK_PX}px pinch threshold.
      </p>
    </DemoFrame>
  );
}
