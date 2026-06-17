# adiprabs.com — Engineer/System Rebuild Brief

You are continuing a full visual + structural rebuild of Adi Prabs's personal
website (Next.js 14 App Router, Tailwind, Framer Motion, MDX). The new design
system, content data, primitives, navbar, footer, home page, /resume, and
/projects have already been rewritten. Your job is to finish the rest and
ship a clean build.

---

## CONTEXT

- **Person:** Adi Prabs (brand name; full = Aditya Prabakaran). 20, Computing @ Imperial College London, SRE placement @ Apple, side work for funded startups.
- **Aesthetic target:** Engineer/system. Think Linear, Vercel, Rauno, Brian Lovin. Editorial typography, hairline borders, mono labels, lots of whitespace, *single* teal signal accent. Minimal eye candy. NO rainbow gradients, NO glassmorphism orbs, NO particle fields, NO custom cursor — these all existed in the old design and are being stripped.
- **Palette tokens** (defined in `tailwind.config.ts` and `globals.css`):
  - `ink.bg` `#08100F` (page), `ink.surface` `#0E1A18`, `ink.surface2` `#142523`
  - `ink.line` `#1B2D2A`, `ink.line2` `#27403C`
  - `ink.fg` `#E8E6E1`, `ink.fg2` `#B6BDB9`, `ink.muted` `#7C8B86`
  - `teal` `#5EEAD4` (signal), `teal.dim` `#14B8A6` (link/hover)
  - `amber.live` `#F4A261` (only for "now/live" indicators)
- **Type:** Inter (sans, via `var(--font-inter)`) for body/display, JetBrains Mono (via `var(--font-jetbrains)`) for labels/metadata. Both configured in `src/app/layout.tsx`.
- **Primitives** (use these everywhere — at `src/app/components/ui/primitives.tsx`):
  - `<Container>` — max-w-6xl with horizontal padding
  - `<Section>` — vertical rhythm + optional hairline rule
  - `<Label number="03">selected work</Label>` — mono section header
  - `<Tag>...</Tag>` — small uppercase tech chip
  - `<A href>` — editorial link (hairline underline → teal on hover)
  - `<LiveDot label="..." />` — pulsing amber dot
  - `<Kbd>⌘K</Kbd>`
  - `<MetaRow meta={...}>...</MetaRow>` — 3/9 grid row for CV-style listings
- **Content data** lives in `src/data/profile.ts` — `profile`, `roles`, `projects`, `featuredProjects`. Pull from here, don't hardcode.
- **Reference for layout idioms:** look at how `src/app/page.tsx`,
  `src/app/resume/page.tsx`, and `src/app/projects/page.tsx` are structured. Those
  are the reference implementations. The home page sections in
  `src/app/components/home/*.tsx` (Hero, Now, Work, SelectedProjects, About,
  Contact) are also reference material.

---

## WHAT'S ALREADY DONE — DO NOT MODIFY

- `tailwind.config.ts` — palette, type, animations
- `src/app/globals.css` — design system, grain overlay, hairline rules, prose
- `src/app/layout.tsx` — fonts, metadata
- `src/app/components/Navbar.tsx` — new sticky nav
- `src/app/components/Footer.tsx` — new footer
- `src/app/components/ui/primitives.tsx` — Container/Section/Label/Tag/A/LiveDot/Kbd/MetaRow
- `src/app/components/effects/HeroGrid.tsx` — cursor-reactive teal grid (single piece of eye candy)
- `src/app/components/home/Hero.tsx`, `Now.tsx`, `Work.tsx`, `SelectedProjects.tsx`, `About.tsx`, `Contact.tsx`
- `src/app/page.tsx` — composes the home page
- `src/app/resume/page.tsx` — long-form CV + PDF toggle
- `src/app/projects/page.tsx` — filterable project grid
- `src/data/profile.ts` — single source of truth

---

## WHAT YOU NEED TO DO

### 1. Rewrite `/journey` (`src/app/journey/page.tsx`)
A vertical timeline of work + education + leadership + hackathon wins. Currently it imports the old `ParticleField`, `GlassCard`, `SectionHeading`, `TransitionLink` and uses a rainbow palette.

Replacement design:
- Use `Navbar`, `Footer`, `Container`, `Section`, `Label`, `Tag` primitives.
- Header: `<Label number="04">journey</Label>` + h1 "Journey" + subtitle.
- Body: a single vertical hairline rail (1px `border-ink-line`) on the left with timeline events anchored to it. Each event:
  - Left column (`md:col-span-3`): mono date in `text-ink-muted`
  - Middle: a small teal circle/marker on the rail
  - Right (`md:col-span-9`): event title (`text-2xl text-ink-fg tracking-snug`), one-line category (`font-mono text-mono-sm text-ink-muted`), short description (`text-ink-fg2 leading-relaxed`), optional `<Tag>`s
- Categories: `work`, `education`, `leadership`, `award`. Render category as a mono tag, not an emoji+color combo.
- Pull the same role data from `src/data/profile.ts` (`roles`) for work entries. Add the education entry + a hackathon win (SwyftGesture, 1st place) inline. Keep it tight — 6-10 events max.
- No framer-motion required. Simple CSS transitions are fine. If you use motion, only subtle fade-in-on-scroll.

### 2. Rewrite `/booklist` (`src/app/booklist/page.tsx`)
Currently a heavy 3D flip-card grid with glass modal. The book data (id/title/author/review/coverImage/rating/genre, 6 books) should be preserved.

Replacement design:
- Use `Navbar`, `Footer`, `Container`, `Label`.
- Header: `<Label number="05">reading</Label>` + h1 "Reading list" + subtitle ("Books that shaped my thinking. Updated occasionally.").
- Genre filter as mono pill buttons (same pattern as `/projects` filter).
- Two-column editorial layout per book on desktop (4 col cover image + 8 col text), stacked on mobile. Cover image rendered with `next/image` at modest size (no big hover scale).
- For each book: cover, title (`text-2xl text-ink-fg`), author (`font-mono text-mono-sm text-ink-muted`), genre as a `<Tag>`, rating as `★★★★★` (filled = teal, unfilled = `text-ink-dim`), review paragraph (`text-ink-fg2 leading-relaxed`, max-w-reading).
- No modal needed — the review is right there.
- Books separated by hairline `border-t border-ink-line` and `py-10`.

### 3. Restyle the blog list page (`src/app/blog/BlogListClient.tsx`)
Keep the data flow (initialPosts, allTags, searchQuery, selectedTag, useRouter/searchParams). Replace the visual shell:
- Use `Navbar`, `Footer`, `Container`, `Label`, `Tag`.
- Header: `<Label number="03">writing</Label>` + h1 "Writing" + subtitle.
- Search input: bare, with `lucide-react` `Search` icon left-aligned, `border-b border-ink-line focus:border-teal-dim` styling, `bg-transparent`, `font-sans`, `placeholder:text-ink-muted`. NO glass card.
- Tag filter pills: same mono pill pattern as `/projects` filter buttons. Active = `border-teal-dim text-teal`.
- Post list: NOT a card grid. Editorial list. Each row:
  - `border-t border-ink-line py-6 grid grid-cols-12 gap-6`
  - Left (`md:col-span-3`): mono date + reading time, `text-ink-muted`
  - Right (`md:col-span-9`): title (`text-2xl text-ink-fg hover:text-teal transition-colors`), description (`text-ink-fg2 mt-2 max-w-reading`), tags as `<Tag>` row at bottom
  - Wrap each row in `<Link href={`/blog/${post.slug}`}>` (use `next/link`, not `TransitionLink`).
- Empty state: simple text + "clear filters" button (mono pill style).

### 4. Restyle individual blog post page (`src/app/blog/[slug]/BlogPostClient.tsx`)
Currently uses the old visual shell. Replace:
- Use `Navbar`, `Footer`, `Container`, `Label`.
- Top: back link `← writing` (font-mono, hover:text-teal).
- Header block: mono date · reading time · category tags row, then h1 title (`text-4xl md:text-5xl tracking-snug`), then subtitle/description.
- Hairline rule, then prose content inside `<article className="prose prose-invert max-w-reading">`. The prose CSS in globals.css already styles links/code/quotes with the teal palette.
- Keep all existing MDX/markdown rendering, the existing `MDXComponents`, and `BlogPost` component. Just swap the chrome.

### 5. Restyle `/multi-agent-app` page (`src/app/multi-agent-app/page.tsx`)
This is a chat demo. Lightest possible touch:
- Wrap in `Navbar` + `Footer`.
- Use the new color tokens: bg `bg-ink-bg`, message bubbles `bg-ink-surface border border-ink-line`, input `bg-ink-surface border border-ink-line focus:border-teal-dim`, send button in teal-dim text on hairline border.
- Don't restructure logic. Just retheme.

### 6. Clean up legacy files (delete or stub)
Delete these — nothing should import them after your changes:
- `src/app/components/home/CurrentRoles.tsx`
- `src/app/components/home/LatestWork.tsx`
- `src/app/components/home/SkillsShowcase.tsx`
- `src/app/components/Booklist.tsx`
- `src/app/components/Card.tsx`
- `src/app/components/Contact.tsx` (this is the old modal, not the new Contact.tsx in home/)
- `src/app/components/Projects.tsx`
- `src/app/components/Timeline.tsx`
- `src/app/components/Cat.tsx` and `CatContainer.tsx` (unless the multi-agent-app actively needs them — verify before deleting)
- `src/app/components/TransitionLogo.tsx`
- `src/app/components/TransitionLink.tsx`
- `src/app/components/transitions/` (entire folder)
- `src/app/components/effects/` — delete EVERYTHING in here EXCEPT `HeroGrid.tsx`. The deleted set includes ParticleField, ScrollProgress, CustomCursor, EasterEggs, MagneticButton, ProjectPreview, CodeSnippetCarousel, LightModeJudgment, GitHubActivity, GradientMorphBackground, ThemeToggle, FloatingActionButton, PageLoader, ParticleField, RevealText, SkillConstellation, TiltCard. Yes, all of them.
- `src/app/components/common/` (entire folder — GlassCard, SectionHeading, AnimatedButton are replaced by primitives)
- `src/app/components/resume/` (entire folder — replaced by the new `/resume` page)
- `src/app/contexts/PageTransitionContext.tsx`
- `src/app/data/projectsData.tsx` (replaced by `src/data/profile.ts`)

**Before deleting, grep to confirm nothing references each file. If a remaining import exists, fix it first.**

### 7. Verify the build
Run `npm run build` (or `pnpm build` if pnpm-lock exists). Fix any TypeScript or import errors. Common ones:
- Missing `@/utils/animations` import — replace with inline transitions or delete the animation prop entirely.
- Missing `TransitionLink` — replace with `next/link`.
- Tailwind class names that referenced old colors like `from-[#FF6B6B]` — replace with `text-teal`, `border-ink-line`, etc.

### 8. Smoke check
After build passes:
- Run `npm run dev` in the background on port 3000.
- Curl or fetch `/`, `/projects`, `/resume`, `/journey`, `/blog`, `/booklist` and confirm 200s.

---

## STYLE/CODE CONVENTIONS

- TypeScript strict. No `any` unless absolutely needed (e.g. the polymorphic wrapper in `ProjectCard` is acceptable).
- Functional components, no class components.
- `'use client'` only when needed (state, effects, event handlers). Server components by default.
- Tailwind utility classes preferred; arbitrary values only for spacing/typography where the design system doesn't have a token.
- Use `font-mono text-mono-sm` for all metadata/labels. Use `text-mono-sm` rather than `text-xs` for consistency.
- Hairline rules: `<div className="rule" />` (already styled) or `border-t border-ink-line`.
- Cards: `className="card card-accent p-7"` for hover-teal cards, just `card` for static.
- No glassmorphism (`backdrop-blur`). No gradient text. No rainbow borders. No particles.
- Avoid framer-motion unless the interaction genuinely benefits from spring physics. Subtle fade/rise on scroll is fine; everything else is probably overkill.

---

## DEFINITION OF DONE

1. `npm run build` exits 0.
2. All six top-level routes (`/`, `/projects`, `/resume`, `/journey`, `/blog`, `/booklist`) render with the new design system and return 200.
3. All listed legacy files are deleted (no orphan files in `effects/`, `common/`, `resume/`, `transitions/`).
4. No `grep -r "TransitionLink\|ParticleField\|GlassCard\|SectionHeading"` matches in `src/` (these legacy names should be gone).
5. The site reads as **engineer/system** — quiet, dense, teal-accented, one piece of eye candy (HeroGrid). If something still feels loud or "rainbow," tone it down.

When you're done, write a short summary to `REBUILD_DONE.md` listing: files added, files deleted, anything you skipped or punted on, and any visual decisions you made beyond this brief.

Be opinionated. If something in the brief conflicts with making the site genuinely impressive, do the impressive thing and note it in REBUILD_DONE.md.
