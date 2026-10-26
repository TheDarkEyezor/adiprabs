# Site vibe-tells hitlist — 2026-07-29

For Claude Code on the Mac. Read alongside `HANDOFF_2026-07-29.md` — this file only covers the AI-generated tells to kill. Nothing here duplicates the four workstreams in the handoff.

Every item: one paragraph of context, then the concrete change, then a PR-sized action verb.

---

## 1. Stat strip — fill the four em-dashes

The strip under the hero currently renders four `—` placeholders with labels underneath. It reads as an unfinished template, not deliberate restraint. Every number needed is already visible on the same homepage inside the `//02 work` Apple bullet, so nothing new is being claimed.

**Change.** Populate the four cells, in this order:

1. `$3M / AZ` — annual capacity savings
2. `72%` — deployment incidents caught by manifest validator
3. `6` — companies shipped to (Apple, 8x, Canopy Labs, Vani, Trajex, Altus Reach)
4. `30+` — SREs using the tooling

All four are traceable to the Apple bullet in `//02 work`; if any of them ever gets pulled from that bullet, this strip has to change too. Adi reviews the PR before merge — no auto-merge.

**Action.** Replace placeholders → open PR → wait for Adi.

---

## 2. SwyftGesture emoji badge — remove the last emoji

The SwyftGesture card renders `🥇 1st place hackathon` as an inline badge. That medal is the only emoji anywhere on the site, which makes it stand out for the wrong reason next to the deliberately restrained section-numbered aesthetic.

**Change.** Two options — Adi picks:

- **Keep the fact, kill the emoji.** Replace with a mono-caps tag: `1ST · HACKATHON` (matches the `//` and mono-caps voice already established in the footer and section labels).
- **Drop the badge entirely.** The fact that it placed 1st can live in the card body copy instead of a badge.

**Action.** Land both variants in the same PR behind a one-line prop; Adi picks in review.

---

## 3. Headline rhythm — break the three-in-a-row full-stop pattern

Three consecutive section headings currently share the same shape — short declarative statement, terminal full stop:

- `//02 work` → "Where I've shipped."
- `//03 selected work` → "Things I've built."
- `//05 contact` → "Got a hard problem worth solving?"

That's the LLM tell most likely to register on a careful reader: parallel construction, uniform cadence, uniform punctuation. `//05` is already a question, which is fine as the odd one out — but the two declaratives in a row are the problem.

**Change.** Pick one of these rewrites per heading; Adi vetoes if needed.

- `//02 work` — keep "Where I've shipped." **or** try `Six places, one thread — production ML that doesn't fall over.` (introduces a mid-sentence dash; also collapses the "job-hopping" read the handoff §3.3 flags).
- `//03 selected work` — try the plain label `Selected work` (no full stop, no verbed sentence), **or** the deliberately non-parallel `What I've built when nobody was watching`.
- `//05 contact` — keep the question. It's the only question in the set and does the rhythm-breaking work on its own.

Minimum bar: at least one of `//02` or `//03` gets rewritten. Both is better.

**Action.** Land the heading variants in a single copy PR alongside item 4 (they're both `//02`/`//04` copy).

---

## 4. `//04 who` copy — kill "boring glue" and "turns demos into products"

The current `//04 who` copy contains a sentence to the effect of *"I'm the boring glue that turns demos into products."* Both phrases are on the LLM-tell list — "boring glue" is a stock self-deprecating construction that's appeared in enough founder bios to be pattern-matchable, and "turning demos into products" is the specific phrasing the handoff flags. The underlying intent (systems generalist, ships over demos) is right; the words are wrong.

**Change.** Replace with one of these two — different rhythms, same intent:

- *"I like the last 20% — the part where a working prototype becomes something someone else can rely on. Latency budgets, failure modes, the boring runbook. That's the work."*
- *"Systems generalist. Happier when a thing is running in production and someone I don't know is using it than when a demo is passing on my laptop."*

Pick one, Adi vetoes if neither lands. Whichever survives, do not reintroduce "boring glue," "turns demos into products," "at scale," or "production-grade" anywhere in the paragraph.

**Action.** Ship in the same PR as item 3.

---

## 5. `//01 now` is stale — flag, do not rewrite

Non-blocking. The `//01 now` block is still dated jun 2026 with four bullets from that snapshot. Content is Adi's voice and shouldn't be paraphrased by anyone else, but he owes four fresh bullets before the next big push — Apple placement status through Aug, SF trip debrief, Nine parked through Sep 4, and current application status (Amboras + others in flight per the handoff).

**Change.** None from Claude Code. Leave the block alone.

**Action.** Note in the PR description for items 3/4 that `//01 now` is due a refresh from Adi, and link this section for context.

---

## PR grouping suggestion

- **PR A** — item 1 (stat strip). Cleanest, smallest, mergeable first.
- **PR B** — item 2 (SwyftGesture badge). Trivial.
- **PR C** — items 3 + 4 (copy rhythm + `//04 who`). Ship together, they're both prose passes on the same file.
- Item 5 doesn't get a PR.
