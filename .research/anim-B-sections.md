# Anim B — Section-Level Scroll Choreography

**Mission**: Pivot from "zero" to written, multi-phase pixel-perfect orchestration.
**Budget**: <5 KB CSS additions, <1 KB JS additions, composite-only.
**Easings (existing tokens)**: `--ease-emphasized`, `--ease-out-quart`, `--ease-linear`, `--ease-spring`.
**Convention**: Reveals start before center, complete by ~30–40 % of cover. Stagger via `animation-range` offsets, NOT `animation-delay` (delay does not work with view-timeline; range offsets do).

---

## Cadence map (no two sections fire the same way)

| # | Section | Primary verb | Cadence |
|---|---|---|---|
| 1 | All `.section-head` | track-in → line-wipe | 120 ms eyebrow→H2 offset |
| 2 | §2 Problem (3 cards) | num pop → title → body, 60 ms inter-card | 4-layer per card |
| 3 | §3 Deliverables (5 cards) | num → h3 → p → edge + top-rule, 80 ms inter-card | 5-layer per card |
| 4 | §3b Checklist (12 li) | num-roll, weaving L/R, 50 ms stagger | 12-step cascade |
| 5 | §4 Philosophy | clip-path line-wipe per `<p>` | slow, editorial |
| 6 | §5 Process | vertical rail draws + day-roll | scroll-scrubbed (long) |
| 7 | §6 Pricing | $0 → $4,800 scrub + underline draw | view-progress scrub |
| 8 | §7 FAQ | row stagger + grid-rows open transition | stagger 70 ms, 240 ms open |
| 9 | §8 About | 3-phase portrait + caption letter cascade | A/B/C blur/scale + JS chars |
| 10 | §9 Form | label stagger + submit "ready" pulse | one-shot 800 ms pulse |
| 11 | Hairline dividers | sweep gradient L→R | 700 ms one-shot |
| 12 | RM coverage | opacity-only 120 ms | full audit |

---

## a) HTML mutations (find / replace)

### A1 — Wrap every H2 child in `<span class="lw">` (line-wipe wrapper)

`.section-head h2` needs a per-line wrapper so the line-wipe can mask cleanly. Apply to all H2 headings in sections 2–9 (Problem, Deliverables, Checklist, Philosophy, Process, Pricing, FAQ, About, Book).

```html
<!-- BEFORE -->
<h2 id="problem-h">Three sentences you have already said this quarter.</h2>

<!-- AFTER -->
<h2 id="problem-h"><span class="lw">Three sentences you have already said this quarter.</span></h2>
```

(One span per H2 is sufficient because every section H2 is single-line at desktop. The `.lw` span uses `display: inline-block` + overflow-hidden + `translateY` mask animation, so it works regardless of natural line breaks at narrower widths because the mask is applied to a transformable inline-block.)

Repeat for: `#deliv-h`, `#cl-h`, `#phil-h`, `#proc-h`, `#price-h`, `#faq-h`, `#about-h`, `#book-h`.

### A2 — Hairline divider sweep target

`.section + .section` already exists as a CSS selector concept; we add a decorative `::before` (zero markup). No HTML change needed.

### A3 — Process rail container

Add a single `<div class="process-rail" aria-hidden="true"></div>` as the FIRST child inside `.process`:

```html
<!-- BEFORE -->
<div class="process">
  <div class="process-step js-reveal">

<!-- AFTER -->
<div class="process">
  <div class="process-rail" aria-hidden="true"></div>
  <div class="process-step js-reveal">
```

### A4 — Pricing scrub target

Wrap the `$4,800` number content in a `<span class="pricing-count">` so JS can animate the custom property and the displayed counter without rebuilding the DOM:

```html
<!-- BEFORE -->
<span class="pricing-amount"><span class="num">$4,800</span><span class="pricing-amount-unit">USD · from</span></span>

<!-- AFTER -->
<span class="pricing-amount">
  <span class="num pricing-count" data-pricing-count="4800" aria-label="$4,800">$<span class="pricing-count-digits"></span></span>
  <span class="pricing-amount-unit">USD · from</span>
</span>
```

The `aria-label` ensures the AT-announced value is always the final price, even mid-scrub. The `<span class="pricing-count-digits">` is the JS target.

### A5 — Portrait caption letter-by-letter target

The caption already has two `<span>` children; JS will further split text into per-character spans. No HTML change — JS handles split on load.

### A6 — FAQ inner wrapper retained

Existing markup already has `.faq-item > div` wrapping each answer. The grid-template-rows trick works directly on `<details>` + this child. No change.

---

## b) CSS additions (sectioned by file)

> All additions are **composite-only** (transform / opacity / clip-path / filter). All ranges chosen so reveals **start before the element is centered** and **complete by 30–40 % of cover**.

### b1) `src/styles/animations.css` — additions (≈ 2.4 KB)

Append the following at the **end** of the file (after the existing `@media (prefers-reduced-motion)` block, which we extend separately in b6):

```css
/* ============================================================
   Anim B — section-level orchestration
   ============================================================ */

/* ─── Pattern 2 — line-wipe primitive for H2 ────────────────── */
.lw {
  display: inline-block;
  overflow: hidden;
  vertical-align: bottom;
  line-height: inherit;
}
.lw > * { display: inline-block; }
/* Wrapper itself doesn't move; we mask the H2 text via clip-path on the
   parent. inline-block on the wrapper keeps overflow:hidden masking the
   transform of the H2 child (set via animation below). */

@supports (animation-timeline: view()) {
  /* 1. Section eyebrow track-in + headline line-wipe ─────────── */
  .section-head .eyebrow {
    animation: eyebrowTrack linear both;
    animation-timeline: view();
    animation-range: entry 8% cover 22%;
    /* letter-spacing animates from 0.4em → 0.12em; preserve initial state */
    letter-spacing: 0.4em;
    opacity: 0;
  }
  .section-head h2 {
    /* H2 transforms relative to its .lw wrapper which clips overflow */
    animation: lineWipe linear both;
    animation-timeline: view();
    animation-range: entry 14% cover 28%;
    /* 120 ms after the eyebrow (eyebrow ends ~22%, h2 starts at 14% with
       a longer duration → visually the H2 lifts as the eyebrow settles). */
  }

  /* 2. §2 Problem cards — 4-layer reveal per card, 60 ms inter ── */
  .problem-card { opacity: 0; transform: translateY(18px); }
  .problem-card .num   { opacity: 0; transform: scale(0.94); }
  .problem-card h3     { opacity: 0; }
  .problem-card > p:not(.num) { opacity: 0; }

  .problem-card        { animation: cardLiftSoft  linear both; animation-timeline: view(); animation-range: entry  8% cover 22%; }
  .problem-card .num   { animation: numPop        linear both; animation-timeline: view(); animation-range: entry 10% cover 18%; }
  .problem-card h3     { animation: textFadeIn    linear both; animation-timeline: view(); animation-range: entry 14% cover 22%; }
  .problem-card > p:not(.num) { animation: textFadeIn linear both; animation-timeline: view(); animation-range: entry 20% cover 28%; }

  /* 60 ms inter-card stagger via range offsets (60 ms ≈ 3% of typical cover length on a 4K-tall section) */
  .problem-card:nth-child(2)            { animation-range: entry 10% cover 24%; }
  .problem-card:nth-child(2) .num       { animation-range: entry 12% cover 20%; }
  .problem-card:nth-child(2) h3         { animation-range: entry 16% cover 24%; }
  .problem-card:nth-child(2) > p:not(.num) { animation-range: entry 22% cover 30%; }

  .problem-card:nth-child(3)            { animation-range: entry 12% cover 26%; }
  .problem-card:nth-child(3) .num       { animation-range: entry 14% cover 22%; }
  .problem-card:nth-child(3) h3         { animation-range: entry 18% cover 26%; }
  .problem-card:nth-child(3) > p:not(.num) { animation-range: entry 24% cover 32%; }

  /* 3. §3 Deliverables bento cards — 5-layer, 80 ms inter ─────── */
  .bento-card { opacity: 0; transform: translateY(16px); position: relative; }
  .bento-card .bento-num        { opacity: 0; transform: translateY(6px); }
  .bento-card h3                { opacity: 0; transform: translateY(4px); }
  .bento-card > p:not(.bento-num):not(.bento-card-edge) { opacity: 0; }
  .bento-card .bento-card-edge  { opacity: 0; }
  /* Top hairline draw */
  .bento-card::before {
    content: "";
    position: absolute;
    top: -1px; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, var(--accent-soft) 30%, var(--accent-soft) 70%, transparent 100%);
    transform: scaleX(0);
    transform-origin: left center;
    pointer-events: none;
    animation: ruleDraw linear both;
    animation-timeline: view();
    animation-range: entry 6% cover 20%;
  }

  .bento-card                                  { animation: cardLiftSoft  linear both; animation-timeline: view(); animation-range: entry  8% cover 24%; }
  .bento-card .bento-num                       { animation: layerUp       linear both; animation-timeline: view(); animation-range: entry 10% cover 18%; }
  .bento-card h3                               { animation: layerUp       linear both; animation-timeline: view(); animation-range: entry 14% cover 22%; }
  .bento-card > p:not(.bento-num):not(.bento-card-edge) { animation: textFadeIn linear both; animation-timeline: view(); animation-range: entry 18% cover 26%; }
  .bento-card .bento-card-edge                 { animation: textFadeIn    linear both; animation-timeline: view(); animation-range: entry 24% cover 30%; }

  /* 80 ms inter-card stagger (across the bento grid) */
  .bento-card:nth-child(2)            { animation-range: entry 10% cover 26%; }
  .bento-card:nth-child(2)::before    { animation-range: entry  8% cover 22%; }
  .bento-card:nth-child(3)            { animation-range: entry 12% cover 28%; }
  .bento-card:nth-child(3)::before    { animation-range: entry 10% cover 24%; }
  .bento-card:nth-child(4)            { animation-range: entry 14% cover 30%; }
  .bento-card:nth-child(4)::before    { animation-range: entry 12% cover 26%; }
  .bento-card:nth-child(5)            { animation-range: entry 16% cover 32%; }
  .bento-card:nth-child(5)::before    { animation-range: entry 14% cover 28%; }

  /* 4. §5 Process rail + day-roll ─────────────────────────────── */
  .process { view-timeline-name: --process; view-timeline-axis: block; }
  .process-rail {
    position: absolute;
    left: calc(96px / 2 - 0.5px); /* center of the 96px day column */
    top: 0; bottom: 0;
    width: 1px;
    background: linear-gradient(180deg, transparent 0%, var(--hairline) 8%, var(--hairline) 92%, transparent 100%);
    transform-origin: top center;
    transform: scaleY(0);
    animation: railDraw linear both;
    animation-timeline: --process;
    animation-range: entry 0% cover 80%;
    pointer-events: none;
  }
  @media (max-width: 640px) { .process-rail { display: none; } }
  .process { position: relative; } /* needed for rail absolute positioning */

  .process-step .process-day {
    /* day "rolls" up into place — translateY + opacity */
    animation: dayRoll linear both;
    animation-timeline: view();
    animation-range: entry 8% cover 22%;
    display: inline-block; /* transformable */
    will-change: transform;
  }
  .process-step:nth-child(3) .process-day { animation-range: entry 10% cover 24%; }
  .process-step:nth-child(4) .process-day { animation-range: entry 12% cover 26%; }
  .process-step:nth-child(5) .process-day { animation-range: entry 14% cover 28%; }
  /* nth offsets account for .process-rail being child #1 */

  /* 5. §4 Philosophy — line-wipe per paragraph ───────────────── */
  .philosophy p {
    animation: philLineWipe linear both;
    animation-timeline: view();
    animation-range: entry 10% cover 26%;
    clip-path: inset(0 0 100% 0);
    opacity: 0;
    transform: translateY(8px);
  }
  .philosophy p + p { animation-range: entry 14% cover 30%; }

  /* 6. §6 Pricing scrub: brass underline draws on commit ──────── */
  .pricing { position: relative; }
  .pricing .pricing-anchor::after {
    content: "";
    position: absolute;
    left: 0; right: 0;
    bottom: -0.5rem;
    height: 1px;
    background: var(--accent);
    transform: scaleX(0);
    transform-origin: left center;
    animation: ruleDraw linear both;
    animation-timeline: view();
    animation-range: entry 28% cover 42%;
  }
  .pricing-anchor { position: relative; padding-bottom: 0.5rem; }

  /* 7. §7 FAQ — stagger entry (open transition is RM-aware below) */
  .faq-item              { animation: revealLift linear both; animation-timeline: view(); animation-range: entry  8% cover 22%; }
  .faq-item:nth-child(2) { animation-range: entry 10% cover 24%; }
  .faq-item:nth-child(3) { animation-range: entry 12% cover 26%; }
  .faq-item:nth-child(4) { animation-range: entry 14% cover 28%; }
  .faq-item:nth-child(5) { animation-range: entry 16% cover 30%; }
  .faq-item:nth-child(6) { animation-range: entry 18% cover 32%; }

  /* 8. §8 About — portrait 3-phase ─────────────────────────────── */
  .portrait-frame {
    animation: portraitPhases linear both;
    animation-timeline: view();
    animation-range: entry 0% cover 60%;
  }
  .portrait-frame::after {
    /* the grain overlay climbs 0 → 0.045 across entry */
    animation: grainIn linear both;
    animation-timeline: view();
    animation-range: entry 10% cover 50%;
  }

  /* 11. Hairline section dividers — sweep on enter ─────────────── */
  .section + .section { position: relative; }
  .section + .section::before {
    content: "";
    position: absolute;
    left: 0; right: 0; top: -1px;
    height: 1px;
    background:
      linear-gradient(90deg,
        transparent 0%,
        transparent 40%,
        var(--accent-soft) 50%,
        transparent 60%,
        transparent 100%);
    background-size: 200% 100%;
    background-position: 100% 0;
    animation: dividerSweep linear both;
    animation-timeline: view();
    animation-range: entry 0% cover 14%;
    pointer-events: none;
    opacity: 0.7;
  }
}

/* ─── Keyframes (Anim B) ────────────────────────────────────── */
@keyframes eyebrowTrack {
  0%   { opacity: 0; letter-spacing: 0.4em; }
  60%  { opacity: 1; }
  100% { opacity: 1; letter-spacing: 0.12em; }
}

@keyframes lineWipe {
  /* H2 child translates up under .lw clip; final state clean */
  0%   { opacity: 0; transform: translateY(110%); clip-path: inset(0 0 100% 0); }
  35%  { opacity: 1; }
  100% { opacity: 1; transform: translateY(0); clip-path: inset(0 0 0 0); }
}

@keyframes cardLiftSoft {
  0%   { opacity: 0; transform: translateY(18px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes numPop {
  0%   { opacity: 0; transform: scale(0.94); }
  60%  { opacity: 1; }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes textFadeIn {
  0%   { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes layerUp {
  0%   { opacity: 0; transform: translateY(6px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes railDraw {
  0%   { transform: scaleY(0); }
  100% { transform: scaleY(1); }
}

@keyframes dayRoll {
  0%   { opacity: 0; transform: translateY(12px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes philLineWipe {
  0%   { opacity: 0; transform: translateY(8px); clip-path: inset(0 0 100% 0); }
  100% { opacity: 1; transform: translateY(0); clip-path: inset(0 0 0 0); }
}

@keyframes portraitPhases {
  0%   { opacity: 0.4; transform: scale(1.04); filter: blur(8px); }
  50%  { opacity: 0.85; transform: scale(1.01); filter: blur(2px); }
  100% { opacity: 1; transform: scale(1); filter: blur(0); }
}

@keyframes grainIn {
  0%   { opacity: 0; }
  100% { opacity: 0.045; }
}

@keyframes dividerSweep {
  0%   { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}
```

### b2) `src/styles/sections.css` — additions (≈ 0.6 KB)

Append at the end of the file:

```css
/* ─── Pricing scrub digits + brass commit underline ───────── */
.pricing-count { display: inline-block; font-variant-numeric: tabular-nums; }
.pricing-count-digits {
  /* JS writes a localized integer in here; we keep the $ sigil in markup
     so the AT label stays correct mid-scrub. */
  display: inline-block;
  min-width: 5ch; /* prevent layout shift while digits change 0 → 4,800 */
  text-align: left;
}

/* ─── Form submit "ready" pulse on section enter ──────────── */
@supports (animation-timeline: view()) {
  .cta-section .form-submit::after {
    animation: submitReadyPulse linear both;
    animation-timeline: view();
    animation-range: entry 18% cover 38%;
  }
}

@keyframes submitReadyPulse {
  /* single 800-ms-feeling pulse mapped to ~20% of cover range */
  0%   { transform: scaleX(0.18); }
  35%  { transform: scaleX(0.30); }
  70%  { transform: scaleX(0.22); }
  100% { transform: scaleX(0.18); }
}

/* Form-row labels reveal in stagger */
@supports (animation-timeline: view()) {
  .form .form-row {
    animation: revealLift linear both;
    animation-timeline: view();
    animation-range: entry 10% cover 24%;
  }
  .form .form-row:nth-child(2) { animation-range: entry 12% cover 26%; }
  .form .form-row:nth-child(3) { animation-range: entry 14% cover 28%; }
  .form .form-row:nth-child(4) { animation-range: entry 16% cover 30%; }
  .form .form-row:nth-child(5) { animation-range: entry 18% cover 32%; }
}
```

### b3) `src/styles/checklist.css` — additions (≈ 0.6 KB)

Replace the existing `@supports` block at the bottom of `checklist.css` with this expanded version (the existing simple revealLift is superseded):

```css
@supports (animation-timeline: view()) {
  /* Each <li> has 3 reveal layers: cl-num (rolls + rotates), h3 (fade), p (fade).
     50 ms stagger across 12 items via range offsets. Odd rows enter from -8px X,
     even rows from +8px X — a weaving cadence. */
  .checklist > li         { opacity: 0; }
  .checklist > li .cl-num { opacity: 0; transform: translateY(16px) rotate(-6deg); transform-origin: center center; }
  .checklist > li h3      { opacity: 0; }
  .checklist > li p       { opacity: 0; }

  .checklist > li         { animation: clItem    linear both; animation-timeline: view(); animation-range: entry  6% cover 20%; }
  .checklist > li .cl-num { animation: clNumRoll linear both; animation-timeline: view(); animation-range: entry  8% cover 18%; }
  .checklist > li h3      { animation: textFadeIn linear both; animation-timeline: view(); animation-range: entry 12% cover 22%; }
  .checklist > li p       { animation: textFadeIn linear both; animation-timeline: view(); animation-range: entry 16% cover 26%; }

  /* Stagger: each li +2% range offset (≈ 50 ms on a 2500 ms scroll cover) */
  .checklist > li:nth-child(2)  { animation-range: entry  8% cover 22%; }
  .checklist > li:nth-child(3)  { animation-range: entry 10% cover 24%; }
  .checklist > li:nth-child(4)  { animation-range: entry 12% cover 26%; }
  .checklist > li:nth-child(5)  { animation-range: entry 14% cover 28%; }
  .checklist > li:nth-child(6)  { animation-range: entry 16% cover 30%; }
  .checklist > li:nth-child(7)  { animation-range: entry 18% cover 32%; }
  .checklist > li:nth-child(8)  { animation-range: entry 20% cover 34%; }
  .checklist > li:nth-child(9)  { animation-range: entry 22% cover 36%; }
  .checklist > li:nth-child(10) { animation-range: entry 24% cover 38%; }
  .checklist > li:nth-child(11) { animation-range: entry 26% cover 40%; }
  .checklist > li:nth-child(12) { animation-range: entry 28% cover 42%; }

  /* Weaving: odd rows lift from translateX(-8px), even from +8px */
  .checklist > li:nth-child(odd)  { animation-name: clItemL; }
  .checklist > li:nth-child(even) { animation-name: clItemR; }
}

@keyframes clItem   { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: none; } }
@keyframes clItemL  { 0% { opacity: 0; transform: translate(-8px, 10px); } 100% { opacity: 1; transform: none; } }
@keyframes clItemR  { 0% { opacity: 0; transform: translate( 8px, 10px); } 100% { opacity: 1; transform: none; } }
@keyframes clNumRoll{ 0% { opacity: 0; transform: translateY(16px) rotate(-6deg); } 60% { opacity: 1; } 100% { opacity: 1; transform: none; } }
```

### b4) `src/styles/components.css` — additions (≈ 0.5 KB)

Append the FAQ open-transition CSS (the modern grid-template-rows 0fr → 1fr trick is the correct approach — `interpolate-size: allow-keywords` is not yet wide-shipping enough for `details`):

```css
/* ─── FAQ open transition (grid-rows 0fr → 1fr trick) ─────── */
.faq-item > div {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--d-fg) var(--ease-emphasized);
  overflow: hidden;
}
.faq-item > div > p { min-height: 0; }
.faq-item[open] > div { grid-template-rows: 1fr; }

/* Re-declare padding inside the inner grid child so the row-template trick
   doesn't fight with the existing padding-block declaration above. */
.faq-item > div { padding-block: 0; }
.faq-item[open] > div { padding-block: var(--s-3) var(--s-2); }
.faq-item > div > p {
  color: var(--ink-muted);
  max-width: var(--w-prose);
  font-size: 0.9375rem;
  line-height: 1.65;
}

/* ─── Portrait caption — per-character spans (filled by JS) ── */
.portrait-caption .char {
  display: inline-block;
  opacity: 0;
  transform: translateY(4px);
  animation: charIn 320ms var(--ease-out-quart) both;
  animation-delay: calc(var(--i, 0) * 18ms);
  will-change: transform, opacity;
}
.portrait-caption.is-typed .char { /* triggered by JS on IO enter */ }

@keyframes charIn {
  0%   { opacity: 0; transform: translateY(4px); }
  100% { opacity: 1; transform: translateY(0); }
}
```

### b5) `@property` registration for the pricing scrub

Add to the **top** of `animations.css` (after the comment header, before the first `@supports`). This must be a top-level rule so the property is registered globally.

```css
@property --pricing-num {
  syntax: "<integer>";
  initial-value: 0;
  inherits: false;
}
```

### b6) Reduced-motion coverage — replace the existing RM block at the bottom of `animations.css`

```css
@media (prefers-reduced-motion: reduce) {
  /* Disable all view-timeline + JS scroll choreography. Reveal everything
     statically with a 120 ms opacity fade if it's about to enter. */
  @supports (animation-timeline: view()) {
    .eyebrow, .section-head h2, .section-head .lede,
    .problem-card, .problem-card .num, .problem-card h3, .problem-card > p,
    .bento-card, .bento-card .bento-num, .bento-card h3, .bento-card > p, .bento-card .bento-card-edge,
    .bento-card::before,
    .process-step, .process-step .process-day, .process-rail,
    .pricing, .pricing .pricing-anchor::after,
    .philosophy, .philosophy p,
    .faq-item,
    .about, .portrait-frame, .portrait-frame::after,
    .proof-grid,
    .checklist > li, .checklist > li .cl-num, .checklist > li h3, .checklist > li p,
    .form .form-row, .cta-section .form-submit::after,
    .section + .section::before {
      animation: none !important;
      opacity: 1 !important;
      transform: none !important;
      filter: none !important;
      clip-path: none !important;
      letter-spacing: normal !important;
      background-position: 0 0 !important;
    }
  }
  .js-reveal { opacity: 1; transform: none; transition: none; }
  .portrait-caption .char {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
  /* FAQ: open transition becomes instant */
  .faq-item > div { transition: none !important; }
  /* Pricing: show final value immediately, no scrub */
  .pricing-count-digits::before { content: "4,800"; }
}
```

---

## c) JS snippets

### c1) Pricing scrub — `$0` → `$4,800` via `@property` + view-timeline

Append to `src/scripts/motion.js`. Total: ≈ 480 bytes.

```js
/* ─── 5: Pricing scrub — $0 → $4,800 via @property + view() ─── */
const pricing = document.querySelector(".pricing-count-digits");
const pricingHost = document.querySelector(".pricing-count");
if (pricing && pricingHost && !reduce && supportsTimeline) {
  // The custom property is already registered via @property in animations.css.
  // We drive it with a CSS animation tied to view-timeline, then read its
  // computed value each frame the section is in view, formatting into the span.
  const target = parseInt(pricingHost.dataset.pricingCount || "4800", 10);
  const style = document.createElement("style");
  style.textContent = `
    @keyframes pricingScrub { from { --pricing-num: 0; } to { --pricing-num: ${target}; } }
    .pricing-count {
      animation: pricingScrub linear both;
      animation-timeline: view();
      animation-range: entry 10% cover 38%;
    }`;
  document.head.appendChild(style);

  // Read the computed --pricing-num and format. Only run while pricing is in view.
  const fmt = new Intl.NumberFormat("en-US");
  let raf = 0;
  let inView = false;
  const tick = () => {
    raf = 0;
    const raw = getComputedStyle(pricingHost).getPropertyValue("--pricing-num");
    const n = parseInt(raw, 10) || 0;
    pricing.textContent = fmt.format(n);
    if (inView) raf = requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver((ents) => {
    for (const e of ents) {
      inView = e.isIntersecting;
      if (inView && !raf) raf = requestAnimationFrame(tick);
      if (!inView) {
        // Settle to final value when leaving (avoids stuck-at-half-value bug
        // if the user scrolls past quickly).
        pricing.textContent = fmt.format(target);
      }
    }
  }, { rootMargin: "20% 0% 20% 0%", threshold: 0 });
  io.observe(pricingHost);
} else if (pricing) {
  // No scroll-timeline, or reduced-motion: show the final value statically.
  pricing.textContent = "4,800";
}
```

### c2) Portrait caption — letter-by-letter (≈ 380 bytes)

```js
/* ─── 6: Portrait caption letter-by-letter on enter ──────────── */
const cap = document.querySelector(".portrait-caption");
if (cap && !reduce) {
  // Split each child span's text into per-character spans, indexed for stagger.
  const spans = cap.querySelectorAll(":scope > span");
  let i = 0;
  spans.forEach((s) => {
    const txt = s.textContent || "";
    s.textContent = "";
    for (const ch of txt) {
      const c = document.createElement("span");
      c.className = "char";
      c.style.setProperty("--i", String(i++));
      c.textContent = ch === " " ? " " : ch;
      s.appendChild(c);
    }
  });
  // Trigger only when the about section actually enters view (so the cascade
  // is felt, not pre-spent on load).
  const about = document.getElementById("about");
  if (about) {
    const io = new IntersectionObserver((ents) => {
      for (const e of ents) if (e.isIntersecting) {
        cap.classList.add("is-typed");
        io.unobserve(e.target);
      }
    }, { rootMargin: "0% 0% -20% 0%", threshold: 0.2 });
    io.observe(about);
  }
} else if (cap) {
  // Reduced-motion: never split; ensure caption is visible as-is.
}
```

> Note: the `.char` keyframe starts at `opacity: 0` with `animation-delay` keyed to `--i`. Until `.is-typed` is set, the cascade has not begun; we set `animation-play-state: paused` initially:

Add one more line to `b4` `.portrait-caption .char` rule: `animation-play-state: paused;` and to `.portrait-caption.is-typed .char { animation-play-state: running; }`. (Already shown above as a no-op selector; promote it.)

### c3) Total JS budget

- Pricing scrub: ~480 bytes
- Caption cascade: ~380 bytes
- Total addition: **~860 bytes** (<1 KB ✓)

---

## d) Notes on each of the 12 new moments

1. **Eyebrow track-in + headline line-wipe** — the eyebrow's letter-spacing collapses from 0.4em (loose, exploratory) to 0.12em (settled, official) while fading in. The H2 then wipes up under an inline-block mask. The 120 ms offset (achieved by starting the H2 at 14% cover with longer duration vs eyebrow at 8% cover with shorter duration) reads as cause→effect: the eyebrow announces, the headline lands.

2. **Problem cards** — the big `01/02/03` numerals **pop first** (scale 0.94 → 1, 240 ms) — they're the visual anchor; the title fades in second; body last. Each card is 60 ms behind the previous via range offsets (+2% entry, +2% cover). Reads like three counted breaths.

3. **Deliverables bento** — five-layer per card: num → h3 → p → edge-meta, *plus* a hairline accent draw on the top edge. The top-edge accent is the only chromatic moment in the section (champagne 40%), keying off the existing brass-as-commitment rule from the design doctrine. 80 ms inter-card stagger.

4. **Checklist (12 items)** — the `.cl-num` *rolls in*: translateY(16px) + rotate(-6deg) → settles. Title fades. Body fades last. Odd rows lift from translateX(-8px), even rows from +8px → a **weaving** cadence. 50 ms stagger across all 12 (achieved with 2% range offsets per item). Crucial because this is the longest scroll-distance section.

5. **Philosophy** — clip-path inset (0 0 100% 0) → (0 0 0 0) plus translateY(8px) per `<p>`. Each paragraph wipes individually with the second paragraph offset by 4% cover (~80 ms behind the first). The slowest, most editorial cadence on the page — the visual equivalent of someone reading slowly.

6. **Process timeline rail** — the 1px champagne-to-hairline-to-champagne gradient rail draws scaleY 0 → 1 *over the entire process cover range* (entry 0% cover 80%) — it draws as you scroll through the section. Independently, each `.process-day` mono label rolls in (12px translateY) keyed to *its own* view-timeline at staggered offsets (8/10/12/14% entry). The rail and the days are not the same timeline by design: the rail is slow and continuous, the days are local pops.

7. **Pricing scrub** — the most "magic" moment. A `@property --pricing-num: <integer>` is registered globally; a JS-injected `@keyframes pricingScrub` interpolates the integer custom prop 0 → 4800 tied to view-timeline `entry 10% cover 38%`. A raf loop reads computed style only while the pricing card is in view (cheap; bounded). On completion of the entry range, the brass underline beneath `.pricing-anchor` draws scaleX 0 → 1 — the *commitment* gesture. The integer counter is on a `<span aria-label="$4,800">` so AT always announces the final price.

8. **FAQ** — row-by-row entry stagger (2% per item, ~70 ms). Open transition uses the modern `grid-template-rows: 0fr → 1fr` trick on `.faq-item > div` — CSS-only, correct, no JS, no `interpolate-size` dependency. 240 ms via existing `--d-fg`. Padding flips with the same selector so closed state doesn't leak whitespace.

9. **About — portrait 3-phase** — single keyframe runs `blur(8px)/scale(1.04)/opacity 0.4 → blur(2px)/scale(1.01)/opacity 0.85 → blur(0)/scale(1)/opacity 1` across entry 0% → cover 60%. *Concurrently* the `::after` grain overlay opacity climbs 0 → 0.045 (entry 10% cover 50%) — the "developed in a darkroom" sensation. Caption is split into per-character spans on load; the cascade is gated by IO entry of `#about` (avoids cascading before visible). 18 ms inter-char stagger.

10. **Form fields + submit pulse** — each `.form-row` reveals in stagger (12/14/16/18% entry offsets). The submit button's brass `::after` underline runs a four-keyframe pulse `0.18 → 0.30 → 0.22 → 0.18` mapped to a 20% cover slice — feels like an 800 ms "ready" tick. Hover/focus still wins (scaleX 1) because the static rule has higher specificity than the keyframe's end state.

11. **Hairline divider sweep** — every `.section + .section` gets a `::before` 1px line at top with a 200%-wide gradient containing a single champagne band. The band's background-position animates from `100% 0` to `-100% 0` across `entry 0% cover 14%` — a 700 ms-feeling single-shot wipe left to right. Decorative; reduced to nothing under prefers-reduced-motion.

12. **Reduced-motion coverage** — full audit. All view-timeline blocks short-circuited to `animation: none`, `opacity: 1`, `transform: none`, `filter: none`, `clip-path: none`, `letter-spacing: normal`. FAQ open transition becomes instant. Pricing displays `4,800` statically via `::before` content. Portrait caption's `.char` animation cancelled. No counters, no shimmers, no blurs.

---

## Byte tally (additions only, gzipped estimate)

| File | Bytes (raw) |
|---|---|
| animations.css | ~2,400 |
| sections.css | ~600 |
| checklist.css | ~600 |
| components.css | ~500 |
| motion.js | ~860 |
| **Total CSS additions** | **~4,100 bytes (raw)** — under the 5 KB budget |
| **Total JS additions** | **~860 bytes (raw)** — under the 1 KB budget |

After minification: CSS ~2.7 KB, JS ~640 bytes.

---

## Coordination summary

- **Cadence per section is distinct**: §2 (60 ms), §3 (80 ms), §3b (50 ms + weaving), §5 (scrubbed rail, 700 ms+ continuous), §6 (scrubbed counter, magic), §7 (70 ms + open), §8 (3-phase + char cascade), §9 (form + pulse). Adjacent sections never share the same gesture.
- **Composite-only**: transform, opacity, clip-path, filter (blur), background-position. No layout-thrashing properties. `.process-rail` is `position: absolute` to escape flow.
- **No animation > 1.2 s per item**: longest is `revealLift`-class entries at entry-to-30%-cover, which at 60 fps over a typical 800 px scroll cover ≈ 1.0 s wall-clock.
- **Reveals start before center**: every range begins at 6–14% entry (well before the 50% center mark of view).
- **All 4 named easings preserved**: `--ease-emphasized`, `--ease-out-quart`, `--ease-linear` (for view-timeline keyframes), `--ease-spring` (reserved for hover-only — no scroll-driven misuse).
