'use client';
import React, { useMemo, useState } from 'react';
import { DemoFrame, Meter, Toggle } from './DemoFrame';
import data from '@/data/graphrag-embeddings.json';

/* ---------------------------------------------------------------------------
 * The retrieval and grading layer from the legal RAG pipeline (flask-server/
 * law.py), running for real.
 *
 * Vectors below are genuine all-MiniLM-L6-v2 embeddings, precomputed with the
 * same model sentence-transformers loads in rate_document_relevance and
 * check_answer_grounding. Cosine similarity, the 0-10 scaling and the 7.0
 * grounding threshold are lifted straight from those two functions, so the
 * numbers here are the numbers the pipeline produces.
 *
 * Two honest gaps. The shipped retriever embeds with nomic-embed-text-v1.5 and
 * only grades with MiniLM; here both stages use MiniLM. And generation runs on
 * llama3.2:3b-instruct-fp16 through local Ollama, which cannot run in a page,
 * so the prompt is assembled and shown rather than answered.
 *
 * The corpus is written for this demo. The real index is built over legal
 * textbooks that are not mine to redistribute.
 * ------------------------------------------------------------------------- */

const K = 4;                 // law.py: max_k = min(4, docs_count)
const GROUNDED_AT = 7.0;     // law.py: is_grounded = grounding_score > 7.0

type Vec = number[];
const cosine = (a: Vec, b: Vec) => a.reduce((s, x, i) => s + x * b[i], 0); // vectors are L2-normalised
/** law.py: float(min(10, max(0, sim * 10))) */
const toScore = (sim: number) => Math.min(10, Math.max(0, sim * 10));

export default function GraphRagDemo() {
  const [qi, setQi] = useState(0);
  const [ai, setAi] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);

  const question = data.questions[qi];
  const answer = data.answers[ai];

  const ranked = useMemo(
    () =>
      data.chunks
        .map((c) => ({ ...c, score: toScore(cosine(question.vec, c.vec)) }))
        .sort((a, b) => b.score - a.score),
    [question],
  );
  const retrieved = ranked.slice(0, K);

  // check_answer_grounding: max similarity against the retrieved context.
  const grounding = useMemo(() => {
    const max = Math.max(...retrieved.map((c) => cosine(answer.vec, c.vec)));
    const score = toScore(max);
    return { score, isGrounded: score > GROUNDED_AT };
  }, [answer, retrieved]);

  // The prompt string from get_answer(), assembled from what was retrieved.
  const prompt = useMemo(
    () =>
      `You are a legal assistant for question-answering tasks. \n\nHere is the legal context to use to answer the question:\n\n${retrieved
        .map((c) => c.text)
        .join('\n\n')}\n\nHere is the conversation history:\n\nUser: ${question.text}\n\nProvide an answer to the user's last question using only the above context. Provide clarification on the people involved and the terms used to describe them. \nIf the answer is not available in the given context, say so. Give reference to laws or legal precedents that are relevant, but do not give any legal advice\n\nUse three sentences maximum and keep the answer concise, unless asked otherwise to elaborate.\n\nAnswer:`,
    [retrieved, question],
  );

  return (
    <DemoFrame
      title="graphrag · retrieval + grading"
      note="real all-MiniLM-L6-v2 vectors; generation runs on local Ollama, not here"
    >
      <div className="mb-3">
        <div className="font-mono text-[10px] tracking-wide2 uppercase text-ink-muted mb-2">
          question
        </div>
        <div className="flex flex-col gap-1">
          {data.questions.map((q, i) => (
            <button
              key={q.text}
              type="button"
              onClick={() => setQi(i)}
              className={`text-left px-2.5 py-1.5 rounded-sm border text-[12px] transition-colors ${
                qi === i
                  ? 'border-teal-dim bg-teal/5 text-teal'
                  : 'border-ink-line text-ink-fg2/80 hover:text-ink-fg2 hover:border-ink-line2'
              }`}
            >
              {q.text}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-7">
          <div className="flex items-baseline justify-between font-mono text-[10px] tracking-wide2 uppercase text-ink-muted mb-2">
            <span>rate_document_relevance</span>
            <span>top {K} of {data.chunks.length} retrieved</span>
          </div>
          <ul className="space-y-1.5">
            {ranked.map((c, i) => {
              const inCtx = i < K;
              return (
                <li
                  key={c.id}
                  className={`rounded-sm border p-2 transition-colors ${
                    inCtx ? 'border-teal-dim/40 bg-teal/[0.04]' : 'border-ink-line opacity-45'
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-mono text-[10px] text-ink-muted">
                      {c.doc} · {c.id}
                    </span>
                    <span className={`font-mono text-[11px] shrink-0 ${inCtx ? 'text-teal' : 'text-ink-muted'}`}>
                      {c.score.toFixed(1)}/10
                    </span>
                  </div>
                  <div className="mt-1"><Meter value={c.score / 10} /></div>
                  {inCtx && (
                    <p className="mt-1.5 text-[12px] text-ink-fg2/85 leading-snug">{c.text}</p>
                  )}
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            onClick={() => setShowPrompt(!showPrompt)}
            className="mt-3 font-mono text-[11px] text-teal hover:underline underline-offset-4"
          >
            {showPrompt ? 'hide assembled prompt' : 'show assembled prompt'}
          </button>
          {showPrompt && (
            <pre className="mt-2 max-h-56 overflow-auto rounded-sm border border-ink-line bg-ink-bg p-3 font-mono text-[10px] leading-4 text-ink-fg2/80 whitespace-pre-wrap">
              {prompt}
            </pre>
          )}
        </div>

        <div className="col-span-12 lg:col-span-5">
          <div className="font-mono text-[10px] tracking-wide2 uppercase text-ink-muted mb-2">
            check_answer_grounding
          </div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {data.answers.map((a, i) => (
              <Toggle key={a.label} on={ai === i} onClick={() => setAi(i)}>{a.label}</Toggle>
            ))}
          </div>
          <p className="text-[12px] text-ink-fg2/85 leading-relaxed border border-ink-line rounded-sm p-2.5">
            {answer.text}
          </p>

          <div className="mt-3 flex items-baseline justify-between font-mono text-[11px]">
            <span className="text-ink-muted">grounding score</span>
            <span className={grounding.isGrounded ? 'text-teal' : 'text-amber-live'}>
              {grounding.score.toFixed(1)}/10 · is_grounded={String(grounding.isGrounded)}
            </span>
          </div>
          <div className="mt-1.5 relative">
            <Meter value={grounding.score / 10} flagged={!grounding.isGrounded} />
            <span
              className="absolute top-[-3px] h-[7px] w-px bg-ink-fg2"
              style={{ left: `${GROUNDED_AT * 10}%` }}
              title="threshold 7.0"
            />
          </div>
          <div className="mt-1 font-mono text-[10px] text-ink-muted text-right">
            threshold {GROUNDED_AT.toFixed(1)}
          </div>

          <div className="mt-4 rounded-sm border border-amber-live/30 p-3">
            <div className="font-mono text-[10px] tracking-wide2 uppercase text-ink-muted mb-1.5">
              what this surfaces
            </div>
            <p className="text-[12px] text-ink-fg2/85 leading-relaxed">
              Retrieval ranks correctly. The grading layer does not hold up. Max-cosine
              needs roughly 0.7 similarity to clear the threshold, which in practice means
              near-verbatim text, so a faithful paraphrase reads as ungrounded. Worse, the
              part-fabricated answer scores <em>highest</em> of the three, because half of it
              is copied from the context and max-similarity never sees the invented half.
            </p>
            <p className="mt-2 text-[12px] text-ink-fg2/85 leading-relaxed">
              A cosine ceiling cannot tell you an answer is faithful. It tells you how much
              of it was copied.
            </p>
          </div>
        </div>
      </div>
    </DemoFrame>
  );
}
