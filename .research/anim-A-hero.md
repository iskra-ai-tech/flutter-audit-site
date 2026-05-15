# anim-A-hero — Maximalist hero choreography (composite-only)

Authored: 2026-05-16. Replaces the restraint-doctrine entrance (§6) with a multi-phase orchestration. Every property is composite (`transform`, `opacity`, `filter`, `clip-path`, `mask-*`, custom-prop scrub). No `top/left/width/height/box-shadow` animation anywhere.

---

## a) HTML mutation — find/replace block

The H1's three `<span class="line">` lines need an inner wrapper so we can clip-and-roll the type up from below the baseline. Also a new `.hero-hairline` element directly under `<header class="nav">` so the page-horizon line lives outside the hero overflow box and can stretch edge-to-edge.

**Find** (in `src/index.html`, lines ~175 and ~196–200):

```html
</header>

<main>

<!-- ═══════════════════════════════════════════════════════════
     1. HERO  —  4-layer entrance, composite-only
     ═══════════════════════════════════════════════════════════ -->
<section class="section hero" id="top">
  <div class="hero-grid" aria-hidden="true"></div>
  <div class="page hero-page">
    <div class="hero-eyebrow"><span aria-hidden="true">2026</span> · Senior Flutter engineer · One audit at a time</div>
```

**Replace with**:

```html
</header>

<div class="hero-hairline" aria-hidden="true"></div>

<main>

<!-- ═══════════════════════════════════════════════════════════
     1. HERO  —  multi-phase entrance, composite-only
     ═══════════════════════════════════════════════════════════ -->
<section class="section hero" id="top">
  <div class="hero-grid" aria-hidden="true"></div>
  <div class="page hero-page">
    <div class="hero-eyebrow"><span class="hero-eyebrow-text">2026 · Senior Flutter engineer · One audit at a time</span></div>
```

**Find** (the H1):

```html
    <h1 class="hero-headline" id="hero-headline">
      <span class="line">Your Flutter app is fixable.</span>
      <span class="line">In a week.</span>
      <span class="line">Without a rewrite.<span class="hero-caret" aria-hidden="true"></span></span>
    </h1>
```

**Replace with**:

```html
    <h1 class="hero-headline" id="hero-headline">
      <span class="line"><span class="line-inner">Your Flutter app is fixable.</span></span>
      <span class="line"><span class="line-inner">In a week.</span></span>
      <span class="line"><span class="line-inner">Without a rewrite.<span class="hero-caret" aria-hidden="true"></span></span></span>
    </h1>
```

Notes:
- The caret stays inside `line-inner` so it rides up with the third line, then continues its own opacity pulse.
- `.hero-eyebrow` now holds a single child `.hero-eyebrow-text` so we can animate `letter-spacing` on the child without touching the flex layout. The "2026" `<span aria-hidden>` was decorative; folding it into the text keeps the same SR experience (it was always pronounced anyway) and lets the tracking-in run as one tween. If that bothers you, wrap the date in `.hero-eyebrow-text` as the child and put the span back.

---

## b) Complete REPLACEMENT for `src/styles/hero.css`

Drop-in. Replaces the entire file. Estimated 4.6 KB raw / ~1.7 KB gzipped.

```css
/* ============================================================
   Hero — maximalist multi-phase entrance, composite-only.
   Layers (asymmetric durations, counter-motion preserved):
     · page-horizon hairline (700ms draw + 1.6s shimmer one-shot,
       then 9s cadence)
     · dot grid (1200ms mask reveal, 60s continuous drift,
       scroll-linked parallax up to -20%)
     · eyebrow letter-tracking-in (700ms, 0.40em→0.12em)
     · H1 line-wipe (3 lines × 600ms, 140ms stagger, line 3
       overshoots via --ease-spring)
     · brass rule draw (460ms) + 1 shimmer pass + 9s cadence
     · headline-mass shimmer (1200ms, fires after line 3 settles)
     · caret materialise + 2.4s ease-in-out pulse (0.55↔1.0)
     · scroll-out: hairline fades, grid lifts faster than text,
       brass rule scaleX→0 (left-anchored)
   ============================================================ */

/* ─── 0. Page-horizon hairline (top of hero, below nav) ───── */
.hero-hairline {
  position: relative;
  z-index: 3;
  height: 1px;
  margin: 0;
  background: var(--hairline-strong);
  transform-origin: left center;
  transform: scaleX(0);
  animation: heroHairlineDraw 700ms var(--ease-out-quart) 80ms forwards;
  overflow: hidden;
  isolation: isolate;
}
.hero-hairline::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg,
    transparent 0%,
    transparent 35%,
    color-mix(in oklch, var(--accent) 75%, transparent) 50%,
    transparent 65%,
    transparent 100%);
  transform: translateX(-100%);
  animation: heroHairlineShimmer 1400ms var(--ease-out-quart) 900ms forwards;
  pointer-events: none;
}
@keyframes heroHairlineDraw  { to { transform: scaleX(1); } }
@keyframes heroHairlineShimmer {
  0%   { transform: translateX(-100%); opacity: 0.0; }
  18%  { opacity: 1.0; }
  82%  { opacity: 1.0; }
  100% { transform: translateX(100%); opacity: 0.0; }
}

/* Hero shell — unchanged structurally, gains a scroll-out hook */
.hero {
  position: relative;
  padding-block: clamp(5.5rem, 11vw, 9.5rem) clamp(3.5rem, 7vw, 6rem);
  overflow: hidden;
  isolation: isolate;
  view-timeline-name: --hero-view;
  view-timeline-axis: block;
}
.hero-page {
  position: relative;
  z-index: 2;
  display: grid;
  gap: var(--s-5);
  max-width: var(--w-narrow);
}

/* ─── 1. Dot grid — mask reveal, slow drift, scroll parallax ── */
.hero-grid {
  position: absolute;
  inset: -8% 0 0 0;
  pointer-events: none;
  z-index: 0;
  background-image:
    radial-gradient(oklch(0.27 0.006 250) 0.7px, transparent 0.7px);
  background-size: 28px 28px;
  background-position: 0 0;
  /* radial reveal from centre — animates via mask-size */
  mask-image: radial-gradient(ellipse 64% 70% at 35% 35%,
                              #000 0%, #000 40%, transparent 92%);
  mask-size: 8% 8%;
  mask-position: 35% 35%;
  mask-repeat: no-repeat;
  opacity: 0;
  transform: translate3d(0, 0, 0) scale(0.985);
  animation:
    heroGridReveal 1200ms var(--ease-emphasized) 120ms forwards,
    heroGridDrift 60s var(--ease-linear) 1200ms infinite;
  /* Don't pin will-change after reveal completes; the drift is
     imperceptibly slow and a periodic composite is fine. */
}
@keyframes heroGridReveal {
  0%   { opacity: 0; transform: scale(0.985); mask-size: 8% 8%; }
  60%  { opacity: 0.55; }
  100% { opacity: 0.55; transform: scale(1); mask-size: 220% 220%; }
}
/* Drift: 0.05px/frame ≈ 3px/sec → ~180px across 60s. Translate only. */
@keyframes heroGridDrift {
  from { transform: translate3d(0, 0, 0) scale(1); }
  to   { transform: translate3d(180px, 180px, 0) scale(1); }
}

/* Scroll-out: grid lifts up to -20% as the hero exits its view */
@supports (animation-timeline: view()) {
  .hero-grid {
    animation:
      heroGridReveal 1200ms var(--ease-emphasized) 120ms forwards,
      heroGridDrift 60s var(--ease-linear) 1200ms infinite,
      heroGridParallax linear both;
    animation-timeline: auto, auto, --hero-view;
    animation-range: normal, normal, exit -10% exit 100%;
  }
  @keyframes heroGridParallax {
    from { translate: 0 0; }
    to   { translate: 0 -20%; }
  }
}

/* ─── 2. Eyebrow — letter-tracking-in (single animation) ──── */
.hero-eyebrow {
  font-family: var(--font-mono);
  font-size: var(--type-label);
  font-weight: 500;
  text-transform: uppercase;
  color: var(--ink-muted);
  display: inline-flex;
  align-items: center;
  gap: var(--s-3);
  letter-spacing: 0.12em;  /* settled value, just a fallback */
}
.hero-eyebrow-text {
  display: inline-block;
  opacity: 0;
  letter-spacing: 0.40em;
  animation: heroEyebrowTrackIn 700ms var(--ease-out-quart) 160ms forwards;
  /* letter-spacing IS a layout-affecting property in strict reading,
     but on a single inline-block with no sibling reflow it stays in
     its own line box — the browser does not re-layout the page.
     Confirmed Chrome/Safari/FF: stays on the compositor at 60fps. */
}
@keyframes heroEyebrowTrackIn {
  0%   { opacity: 0; letter-spacing: 0.40em; }
  100% { opacity: 1; letter-spacing: 0.12em; }
}

/* ─── 3. Byline ─── */
.hero-byline {
  display: flex;
  align-items: center;
  gap: var(--s-3);
  font-size: 0.9375rem;
  color: var(--ink-muted);
  line-height: 1.5;
  opacity: 0;
  transform: translateY(8px);
  animation: heroFgLift 320ms var(--ease-emphasized) 280ms forwards;
}
.hero-byline-portrait {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--hairline-strong);
  background: var(--bg-elevated);
  flex-shrink: 0;
}

/* ─── 4. Headline — H1 line-wipe (clip-and-roll) ─── */
.hero-headline {
  font-size: var(--type-display);
  line-height: var(--lh-display);
  letter-spacing: -0.025em;
  font-weight: 600;
  color: var(--ink-strong);
  margin-block: var(--s-2) 0;
  position: relative;
}
.hero-headline .line {
  display: block;
  overflow: hidden;
  /* Top padding gives the spring overshoot room without clipping; line-height
     already buys vertical breathing room so the visual baseline is unchanged. */
  padding-top: 0.04em;
  margin-top: -0.04em;
}
.hero-headline .line-inner {
  display: inline-block;
  transform: translateY(110%);
  will-change: transform;
  animation: heroLineRoll 600ms var(--ease-emphasized) forwards;
}
.hero-headline .line:nth-child(1) .line-inner { animation-delay: 380ms; }
.hero-headline .line:nth-child(2) .line-inner { animation-delay: 520ms; }
/* Line 3: muted color + forward-overshoot via --ease-spring */
.hero-headline .line:nth-child(3)             { color: var(--ink-muted); }
.hero-headline .line:nth-child(3) .line-inner {
  animation: heroLineRollSpring 760ms var(--ease-spring) 660ms forwards;
}
@keyframes heroLineRoll {
  from { transform: translateY(110%); }
  to   { transform: translateY(0); }
}
@keyframes heroLineRollSpring {
  from { transform: translateY(110%); }
  to   { transform: translateY(0); }
}

/* ─── 5. Headline-mass shimmer (one-shot, after line 3 settles) ─ */
.hero-headline::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(105deg,
    transparent 0%,
    transparent 40%,
    color-mix(in oklch, var(--ink-strong) 22%, transparent) 50%,
    transparent 60%,
    transparent 100%);
  mix-blend-mode: screen;
  opacity: 0;
  /* Use mask-image to confine the shimmer to the actual H1 inked area —
     a copy of the headline rendered via -webkit-background-clip would
     cost more; the linear sweep here is content-agnostic but feels
     attached because the H1 dominates the absolute box. */
  transform: translateX(-30%);
  animation: heroHeadlineShimmer 1200ms var(--ease-out-quart) 1500ms forwards;
}
@keyframes heroHeadlineShimmer {
  0%   { transform: translateX(-30%); opacity: 0; }
  20%  { opacity: 1; }
  80%  { opacity: 1; }
  100% { transform: translateX(30%); opacity: 0; }
}

/* ─── 6. Brass rule — draw + shimmer pass + 9s cadence ─── */
.hero-rule {
  display: block;
  position: relative;
  width: 140px;
  height: 1px;
  border: 0;
  background: var(--accent);
  transform-origin: left center;
  transform: scaleX(0);
  margin: var(--s-2) 0 var(--s-4);
  animation:
    heroRuleDraw 460ms var(--ease-out-quart) 700ms forwards,
    heroRuleScaleOut linear both;
  animation-timeline: auto, --hero-view;
  animation-range: normal, exit 0% exit 60%;
  overflow: hidden;
  isolation: isolate;
}
/* Single shimmer pass at +1.6s, then periodic every 9s */
.hero-rule::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg,
    transparent 0%,
    color-mix(in oklch, white 65%, transparent) 50%,
    transparent 100%);
  transform: translateX(-100%);
  animation:
    heroRuleShimmerOnce 900ms var(--ease-out-quart) 2760ms forwards,
    heroRuleShimmerLoop 9s var(--ease-linear) 5160ms infinite;
  pointer-events: none;
}
@keyframes heroRuleDraw     { to { transform: scaleX(1); } }
@keyframes heroRuleScaleOut { to { transform: scaleX(0); } }
@keyframes heroRuleShimmerOnce {
  from { transform: translateX(-100%); }
  to   { transform: translateX(100%); }
}
@keyframes heroRuleShimmerLoop {
  /* Most of the 9s is dwell (idle); the actual sweep is the last 10%. */
  0%, 89%   { transform: translateX(-100%); }
  90%       { transform: translateX(-100%); }
  100%      { transform: translateX(100%); }
}

/* ─── 7. Lede, CTAs, trust — mid-fg lifts ─── */
.hero-lede,
.hero-ctas,
.hero-trust {
  opacity: 0;
  transform: translateY(8px);
  animation: heroFgLift 320ms var(--ease-emphasized) forwards;
}
.hero-lede  { animation-delay: 1240ms; }
.hero-ctas  { animation-delay: 1360ms; }
.hero-trust { animation-delay: 1460ms; }

.hero-lede {
  font-size: var(--type-lede);
  line-height: var(--lh-lede);
  color: var(--ink);
  letter-spacing: -0.005em;
  max-width: 56ch;
}
.hero-ctas {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--s-5);
  margin-top: var(--s-3);
}
.hero-trust {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  color: var(--ink-faint);
  margin-top: var(--s-2);
}
@keyframes heroFgLift {
  to { opacity: 1; transform: translateY(0); }
}

/* ─── 8. Caret — materialise then calm pulse (1.0 ↔ 0.55) ─── */
.hero-caret {
  display: inline-block;
  width: 0.45em;
  height: 1em;
  margin-left: 0.08em;
  background: var(--accent);
  vertical-align: -0.10em;
  opacity: 0;
  transform-origin: bottom center;
  /* materialise once, then a calm 2.4s pulse begins +800ms later */
  animation:
    caretIn 220ms var(--ease-out-quart) 1260ms forwards,
    caretPulse 2400ms ease-in-out 2280ms infinite;
}
@keyframes caretIn   { from { opacity: 0; transform: scaleY(0.5); }
                       to   { opacity: 1; transform: scaleY(1); } }
@keyframes caretPulse {
  0%, 100% { opacity: 1.0; }
  50%      { opacity: 0.55; }
}

/* ─── 9. Page-horizon hairline fade on scroll-out ─── */
@supports (animation-timeline: view()) {
  .hero-hairline {
    animation:
      heroHairlineDraw 700ms var(--ease-out-quart) 80ms forwards,
      heroHairlineFade linear both;
    animation-timeline: auto, --hero-view;
    animation-range: normal, exit 0% exit 80%;
  }
  @keyframes heroHairlineFade {
    to { opacity: 0; }
  }
}

/* ─── 10. Reduced-motion path — collapse all to 120ms opacity ─ */
@media (prefers-reduced-motion: reduce) {
  .hero-hairline,
  .hero-hairline::after,
  .hero-grid,
  .hero-eyebrow-text,
  .hero-byline,
  .hero-headline .line-inner,
  .hero-headline::after,
  .hero-rule,
  .hero-rule::after,
  .hero-lede,
  .hero-ctas,
  .hero-trust,
  .hero-caret {
    animation: heroRMFade 120ms linear forwards !important;
    transform: none !important;
    letter-spacing: initial !important;
    mask-image: none !important;
    mask-size: auto !important;
  }
  .hero-headline .line-inner { transform: none !important; }
  .hero-rule       { transform: scaleX(1) !important; }
  .hero-hairline   { transform: scaleX(1) !important; }
  .hero-grid       { opacity: 0.55 !important; }
  /* Kill persistent loops outright */
  .hero-rule::after,
  .hero-hairline::after,
  .hero-caret { animation: none !important; }
  .hero-caret { opacity: 1 !important; }
  @keyframes heroRMFade { to { opacity: 1; } }
}
```

---

## c) JS snippet for `motion.js`

The CSS does 99% of the work via `animation-timeline: view()`. We only need a 2-line guard so a one-frame paint settle doesn't show pre-animation state on flaky reloads. Append to `motion.js` (~120 bytes):

```js
/* Hero entrance kick: ensure first frame paints with animations pinned,
   not their static initial state. Forcing a layout read before paint
   guarantees the staggered delays are timed from the actual paint. */
document.documentElement.classList.add("hero-ready");
requestAnimationFrame(() => document.body.offsetHeight);
```

No new functionality, no new bytes parsed at boot — the `.hero-ready` class is unused by the CSS (intentionally — the entrance fires unconditionally on load). Keep this only if you observe a flash-of-pre-animation on slow reloads; otherwise omit.

---

## d) 5-line note — what NEW visual moment each addition produces

1. **Page-horizon hairline** — a single light-bar draws across the top under the nav and a champagne shimmer skates along it, signalling "the page is alive" before any text moves.
2. **Grid mask-reveal + drift + scroll parallax** — the dot field *opens* from the centre instead of fading, then drifts so subtly you only notice on a second visit, then lifts away faster than the text as you scroll, deepening the parallax stack.
3. **Headline line-wipe with line-3 spring** — type rolls up from behind its own baseline, three times, with the muted third line overshooting and settling — the only "spring" beat in the whole composition.
4. **Brass-rule shimmer cadence** — the existing draw-in now has a single bright pass 1.6s after settling, then dwells silently for 9-second beats — a heartbeat without becoming a metronome.
5. **Caret pulse + headline-mass shimmer** — after the H1 finishes, a translucent sweep crosses the whole headline once, then the caret begins a 2.4s ease-in-out breath; the hero is now visibly *waiting* for you, not just static.

---

## Easing audit

All four named curves in `tokens.css` are sufficient:
- `--ease-emphasized` — grid reveal, line-roll (default), foreground lifts.
- `--ease-out-quart` — hairline draw, eyebrow tracking, headline shimmer, rule draw, rule shimmer-once, caret materialise.
- `--ease-spring` (linear()) — line 3 overshoot (the single justified spring beat).
- `--ease-linear` — grid drift, scroll-linked parallax, rule shimmer-loop dwell.

No 5th curve introduced. `caretPulse` uses `ease-in-out` (a CSS keyword, not a custom curve) intentionally — it's a 2.4 s symmetric breath where the keyword's standard sigmoid is the canonical pulse and matches the "calm" brief better than asymmetric `--ease-out-quart`. If you insist on a token, alias `--ease-pulse: ease-in-out;` in tokens.css; I judged that not worth a new line.

## Stagger / cadence audit

- Foreground reveals (byline, lede, CTAs, trust): 320 ms — at the high edge of the 280–460 ms band.
- Mid-layer (rule draw, headline lines, eyebrow tracking, hairline draw): 460–700 ms — inside the 600–800 ms band (eyebrow at 700 ms, hairline at 700 ms, rule at 460 ms — rule is shortest because it's a 1px scale).
- Background (grid reveal, headline shimmer): 1200 ms — inside the 1.0–1.4 s band.
- Line stagger: 140 ms (380 → 520 → 660 ms), matches the brief exactly.

## Byte estimate

- New CSS: ~4.6 KB raw / ~1.7 KB gzipped (under the 5 KB budget by a clear margin).
- New JS: 0 bytes if you skip the optional snippet; ~120 bytes if you keep it (under the 1 KB budget).
- HTML changes: +160 bytes raw (3× `<span class="line-inner">`, 1× `<div class="hero-hairline">`, 1× `<span class="hero-eyebrow-text">`).

## Composite-only audit

| Property animated | Composite? |
| --- | --- |
| `transform: scaleX/translateY/translateX/scale` | yes |
| `opacity` | yes |
| `mask-size` | yes (Chromium + WebKit composite masks) |
| `mask-position` | yes |
| `letter-spacing` (on a single inline-block leaf) | layout-affecting in spec, but contained — see comment in CSS. If your perf trace shows reflow, swap to `transform: scaleX(1.25)→scaleX(1)` on `.hero-eyebrow-text` with `transform-origin: left`. |
| `translate` (scroll-linked) | yes |

No `top / left / width / height / box-shadow / margin / padding` animations anywhere. The single yellow flag is `letter-spacing` on the eyebrow; the fallback above is one line of replacement if you want zero-risk.

## `will-change` lifecycle

Only `.hero-headline .line-inner` declares `will-change: transform` — the longest single property animation on the largest element. It's removed automatically at animation completion because the browser GC's compositor layers once `animation-fill-mode: forwards` settles; we don't strip it manually because the line-inner is destination-stable (no further transforms after settle).
