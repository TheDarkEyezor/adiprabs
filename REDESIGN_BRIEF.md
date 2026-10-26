# adiprabs.com — Redesign Brief

> Single source of truth for the redesign. Any future redesign — by Claude Code, by me, by Adi — must obey this brief. If you want to deviate, update the brief first.

---

## 1. What this site is

A **personal site + public build log** for Adi Prabakaran.

It is **not** a CV. It is **not** a portfolio grid. It is **not** a "showcase of skills."

It is a place where someone who heard Adi's name can land, read one paragraph, and immediately understand:

1. Who he is (20, CS @ Imperial, SRE placement @ Apple)
2. What he's actively building right now
3. How to follow what he ships

The site succeeds if a cofounder, YC person, or recruiter spends 60 seconds on it and comes away with the impression: *this person makes things and has taste.*

The site fails if it reads as another templated developer portfolio.

---

## 2. Archetype

**Build log / "Now" page hybrid, with personal-site restraint.**

References to study before writing code:

- https://paco.me — restraint, body-type-as-hero, single column
- https://emilkowal.ski — minimal homepage, one paragraph + newsletter
- https://leerob.io — feed-style updates with dates
- https://joshwcomeau.com — editorial feel, serif headlines

References to **avoid copying**:

- The current site (https://adiprabs.vercel.app/) — v0/Cursor boilerplate signals
- brittanychiang.com — too templated now, ~30% of dev portfolios look like this
- Anything with "Tech Stack Arsenal" or floating particles

---

## 3. Information architecture

**One page. Three blocks. Nothing else.**

### Block A — Intro (top)
- Name
- One paragraph (3–4 sentences max) in Adi's voice. No buzzwords, no "passionate", no "I love building."
- Should mention: Imperial, Apple SRE, current side-build focus, openness to interesting conversations.
- Optional: one real photo, small, next to the paragraph.

### Block B — Now (middle)
- Heading: "Now" or "Currently"
- 3–5 bullet items, each one line, dated to the current month.
- Example items: "Apple SRE placement (until Aug 2026)" / "Building Project Nine (climbing quadruped, MuJoCo)" / "Exploring next venture — see build log below."
- This block updates ~once a month.

### Block C — Build log (bottom, longest)
- Heading: "Log" or "Building"
- Reverse-chronological list of dated entries.
- Each entry: date (e.g. `Jun 16, 2026`), title, 1–3 sentences of body, optional link.
- Entries can be: shipped projects, post-mortems, technical notes, links to writing.
- Render from local MDX files (no CMS).
- **At minimum 5 seed entries** before launch so it doesn't look empty.

### What's removed vs current site
- ❌ AP monogram intro / loader
- ❌ Stat strip (3+/15+/99.9%)
- ❌ "Technical Arsenal" tabs
- ❌ "Latest Work" cards
- ❌ "Featured" project cards (VaNI / Trajex — VaNI is on hold anyway)
- ❌ Contact form (replaced with one mailto link in footer)
- ❌ Floating particles

---

## 4. Visual style

### Typography
- **Headline / serif:** Fraunces (variable) OR GT Sectra. Pick one.
- **Body / sans:** Inter (variable) OR Geist Sans. Pick one. **Not Roboto.**
- **Mono:** Geist Mono OR JetBrains Mono.
- Body size: 17px desktop, 16px mobile.
- Line-height body: 1.65.
- Max content width: 640px (allow up to 720px for log entries if needed).

### Color
- **Two colors total.** Background + foreground.
- Dark mode default. Background `#0a0a0a` or `#111`, foreground near-white `#ededed`.
- Greys allowed for secondary text.
- **One accent** for links + active hover. Suggested starting point: warm ochre `#d4a017` OR deep teal `#3d8a8a`. Adi to pick.
- **No gradients. Zero.** Including the existing `bg-gradient-to-br` navy stack — kill it.
- **No light/dark toggle** in v1. Pick dark and ship.

### Spacing
- Generous vertical rhythm. Section spacing ≥96px on desktop.
- Centered single column. No grid layouts.
- White space *is* the design.

### Motion
- **Motion budget: 3 distinct animations max across the entire site.**
  1. Page enter: opacity fade, 200ms, no translate, no stagger.
  2. Link hover: color transition, 150ms.
  3. Log entry hover: subtle background lift, 150ms.
- That's it. No floating particles, no scroll-triggered fades, no AP logo intro, no loader.
- All easing: `cubic-bezier(0.4, 0, 0.2, 1)` or `ease-out`.
- Total motion budget enforced in PR review.

### Imagery
- One real photo of Adi or his workspace, small, in the intro block. Optional.
- No stock icons. No generic project thumbnails.
- If a log entry needs an image: real screenshot, no decoration.

---

## 5. Content rules

- Hero paragraph: written in first person, no buzzwords. Adi writes it, not Claude.
- No fake metrics. No "3+ years", "99.9% uptime", "15+ projects."
- No "Tech Stack" or "Skills" lists anywhere.
- Every log entry has a date. Format: `Jun 16, 2026`.
- Meta description: one human sentence. Not "Created with NextJS, hosted by Vercel."
- `<title>`: `Adi Prabakaran` (not `AdiPrabs.com`).
- Open Graph image: simple, dark background, name in chosen serif, that's it.

---

## 6. Tech & constraints

- **Stack:** Next.js (app router) + Tailwind, keep current. Replace Framer Motion with hand-rolled CSS transitions where possible (motion budget is small enough that Framer isn't needed).
- **MDX** for log entries. One file per entry under `/content/log/`.
- **No new dependencies** beyond what's needed for MDX rendering.
- **Lighthouse targets:** Performance ≥95, Accessibility ≥95, Best Practices ≥95, SEO ≥95 on desktop and mobile.
- **Total JS bundle:** target <150KB gzipped on the homepage.
- **No client-side animation libraries** beyond what Tailwind provides.

---

## 7. Out of scope for v1

- Light/dark toggle
- Blog post pages with reading time, TOC, etc. (log entries are short — full posts can come later)
- RSS feed (nice-to-have, not blocker)
- Comments
- Analytics dashboard (basic Vercel Analytics is fine)
- Anything labelled "AI-powered"

---

## 8. Definition of done

The redesign is done when:

1. Homepage is three blocks (Intro, Now, Log) with nothing else.
2. ≥5 seed log entries, all dated.
3. All items in the "Don'ts" list (section 9) are absent.
4. Lighthouse scores meet targets.
5. Bundle size meets target.
6. Adi reads the hero paragraph aloud and doesn't cringe.
7. Side-by-side with `paco.me`, the new site doesn't feel less restrained.

---

## 9. Hard "Don'ts" (PR will be rejected if any of these appear)

- ❌ Loader, splash screen, or intro animation
- ❌ Monogram or logo intro
- ❌ Floating particles, orbs, blobs
- ❌ More than one accent color
- ❌ Any gradient (`bg-gradient-*`, `from-*`, `to-*`)
- ❌ More than 3 distinct animations
- ❌ Roboto font
- ❌ "Tech Stack" / "Skills" / "Arsenal" section
- ❌ Fake stats (`3+`, `15+`, `99.9%`)
- ❌ Buzzword hero ("Building AI Solutions", "Full-Stack Developer", "Tech Leader")
- ❌ More than 3 top-level sections
- ❌ Card grids on the homepage
- ❌ "Built with [framework]" footer line
- ❌ Default Next.js meta description

---

## 10. Implementation order (for Claude Code)

Suggested PR sequence:

1. **PR 1: nuke.** Delete loader, monogram intro, particles, stat strip, tech arsenal, featured cards, contact form. Replace homepage with a single-column placeholder. (Should remove ~70% of current code.)
2. **PR 2: typography + color.** Wire chosen fonts (via `next/font`), set the two-color palette, one accent. Remove all gradients globally.
3. **PR 3: intro + now block.** Stub copy — Adi fills in. Real photo optional.
4. **PR 4: MDX log infra.** `/content/log/*.mdx`, list renderer, individual entry pages.
5. **PR 5: 5 seed entries.** Adi writes content; Claude scaffolds files.
6. **PR 6: motion + hover states.** Implement the 3 allowed animations. No more.
7. **PR 7: meta, OG, favicon.** Real `<title>`, description, OG image, favicon.
8. **PR 8: perf pass.** Lighthouse to targets.

Each PR should be reviewable in <10 minutes. If a PR touches more than 2 concerns, split it.

---

_Brief written 2026-06-16. Update this file before deviating._
