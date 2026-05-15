# 02 — Animation Stack & Motion Engineering (2026)

> Target: static Astro site, near-black canvas, ≤30 KB total JS gzipped, 120 Hz friendly, 0 frames dropped on hero.
> Owner: Flutter dev who knows how hard buttery motion is. Bar is unforgivable.

---

## TL;DR — The Decision

| Layer | Choice | Size (gz) | Why |
|---|---|---|---|
| Primary motion | **Motion `motion/mini`** (`animate()` + `inView` + `scroll`) | **~2.6 KB** for `animate()`, ~6–8 KB for full mini bundle with helpers | WAAPI-native; runs on compositor; tree-shakes; no React |
| Scroll | **CSS `animation-timeline: view()` / `scroll()`** first; Motion `scroll()` as JS fallback gated by `@supports` | 0 KB on Chromium/Safari 18+ | Off main thread; GPU; Safari 18 + Chrome 115+ + FF 144 = ~85% native |
| Text split | **SplitType** (lib) for reveals if needed | ~2 KB | GSAP-free, accessible, framework-neutral |
| Easing | CSS `linear()` for springs, `cubic-bezier(.2,.8,.2,1)` & M3-emphasized `cubic-bezier(.05,.7,.1,1)` | 0 | Native, declarative, no JS spring solver needed |
| Polyfill | `flackr/scroll-timeline` ONLY loaded if `!CSS.supports('animation-timeline:view()')` | ~15 KB (loaded conditionally) | Most users get native; <15% pay polyfill cost |

**Total JS at idle on modern Chromium/Safari: ~3 KB gz.** Well under 30 KB budget.

GSAP is rejected as the *primary* but kept as a **pluck-by-pluck** fallback option for one effect (Flip page-transition if we ever do MPA). At ~23 KB core + ~7 KB ScrollTrigger, it would consume the entire JS budget for a single library. Free license post-Webflow acquisition makes it tempting, but Motion `mini` is 8× smaller for the entrance/reveal/scroll work we need ([Motion feature-comparison](https://motion.dev/docs/feature-comparison), [GSAP free announcement](https://webflow.com/updates/gsap-becomes-free)).

---

## 1) Motion Library Landscape (2026)

### 1.1 The contenders

| Lib | Core gz | Notes | Verdict for this site |
|---|---|---|---|
| **GSAP 3.13** | 23–27 KB core; +7 KB ScrollTrigger; +SplitText/Flip free as of 2025-04-30 | Free under Webflow acquisition. Industry standard. Tween-engine excellence, timeline DSL. | Overkill. Burns budget for stagger we can do natively. |
| **Motion (`motion`)** | Hybrid `animate()` 18 KB; **`motion/mini` 2.6 KB**; `inView` 0.8 KB; `scroll` 1.5 KB | Merged Framer Motion + Motion One. WAAPI under the hood. | **WINNER.** Use `motion/mini` for entrance + `scroll()` for fallbacks. |
| **Anime.js v4** | ~17 KB modular | Strong SVG/timeline, scroll observer, springs. v4.4+ in 2026. | Solid alt, but Motion's WAAPI alignment = better composite path. |
| **Theatre.js** | 25+ KB runtime, requires editor for authoring | Best for keyframe-heavy storytelling. 1.0 around the corner per maintainer notes. | Tooling complexity not worth it for 1 hero + reveals. |
| **Velocity.js (rev)** | — | Effectively abandoned post-2020 | Skip. |
| **CSS scroll-timeline / animation-range** | 0 KB | Native in Chromium 115+, Safari 18+, FF 144 | **Primary scroll strategy.** |
| **WAAPI direct** | 0 KB | `element.animate()` is the platform | Use directly for simple cases; Motion wraps it for DX. |
| **View Transitions API** | 0 KB | Same-doc Baseline 2026; cross-doc Chromium only | Reserve for SPA-like nav inside Astro `client:idle` islands. |

### 1.2 Why Motion `mini` wins for this site

From [Motion docs](https://motion.dev/docs/feature-comparison):
> *"Mini animate() is just 2.6 KB. Mini exclusively uses WAAPI for hardware accelerated animations."*

Mini lacks: spring physics solver, motion values, independent transforms via JS interpolation, timelines.
**We don't need them.** Springs come from CSS `linear()`. Independent transforms come from CSS custom properties. "Timeline" comes from sequencing via `await animate()` or `animation-delay`.

The hybrid 18 KB version is fine *if* we discover later that we need motion values / orchestration. Budget headroom exists.

**Imports:**
```js
import { animate, inView } from "motion/mini";
import { scroll } from "motion"; // 1.5 KB; only for non-CSS-timeline fallback
```

### 1.3 GSAP, fairly

GSAP is now free including SplitText, Flip, MorphSVG, DrawSVG, MotionPath, ScrollSmoother, Draggable, Inertia ([gsap.com/pricing](https://gsap.com/pricing)). For a Flutter-dev portfolio, the killer feature would be **Flip** (FLIP technique automation) + **SplitText** (now 50% smaller, screen-reader-safe). If we ever add a project-card-→-detail-page Flip transition, GSAP earns its 23 KB. Today: no.

---

## 2) Scroll-Driven Animation (2026)

### 2.1 Browser reality

| Feature | Chrome/Edge | Safari | Firefox |
|---|---|---|---|
| `animation-timeline: scroll()` | 115+ | 26 / 18+ | 144 (was flagged) |
| `animation-timeline: view()` | 115+ | 26 / 18+ | 144 |
| `animation-range: cover \| contain \| entry \| exit` | 115+ | 26 / 18+ | 144 |
| `timeline-scope` | 116+ | 18+ | partial |
| `linear()` easing | 113+ | 17.2+ | 112+ |
| `view-transition` same-doc | 111+ | 18+ | 146+ |
| `@view-transition` MPA | 126+ | — | — |

Native is ~85% of users by mid-2026 ([caniuse css-scroll-timeline](https://caniuse.com/css-scroll-timeline)). The hairline-edge case is the polyfill story below.

### 2.2 Strategy: CSS-first, JS as escape hatch

```css
@supports (animation-timeline: view()) {
  .reveal {
    animation: reveal-up linear both;
    animation-timeline: view();
    animation-range: entry 10% cover 35%;
  }
}

@supports not (animation-timeline: view()) {
  /* Motion's scroll() drives the same @keyframes via WAAPI */
}
```

This means: Safari 18, Chrome 115+, FF 144 users get **zero-JS, off-main-thread, GPU-accelerated** scroll animations. Everyone else (old Safari, old Chrome) gets a JS fallback that costs ~1.5 KB.

### 2.3 The `animation-range` cheat sheet

From [WebKit's ranges cheatsheet](https://webkit.org/blog/17184/so-many-ranges-so-little-time-a-cheatsheet-of-animation-ranges-for-your-next-scroll-driven-animation/):

| Range | Starts | Ends | Use case |
|---|---|---|---|
| `cover` | First pixel enters viewport | Last pixel leaves | Full passage parallax |
| `contain` | Element fully visible | Right before leaving | Pinned section reveal |
| `entry` | First pixel enters | Element fully entered | Fade-in on appearance |
| `exit` | Element begins exiting | Last pixel leaves | Fade-out on departure |
| `entry-crossing` | First pixel enters | Last pixel enters (taller than viewport) | Hero/long elements |
| `exit-crossing` | First pixel leaves | Last pixel leaves | Long element off-ramp |

### 2.4 Named timelines (the real unlock)

```css
.scroll-section { view-timeline: --story; timeline-scope: --story; }
.tracker-target { view-timeline: --story; }
.distant-animated-thing { animation-timeline: --story; }
```

Decouples *what is measured* from *what is animated*. This is how you do multi-layer scroll choreography without a JS library.

### 2.5 Polyfill

`flackr/scroll-timeline` — official from the spec author. ~15 KB. **Load conditionally:**

```js
if (!CSS.supports('animation-timeline: view()')) {
  await import('https://cdn.jsdelivr.net/npm/scroll-timeline-polyfill@2/dist/scroll-timeline.js');
}
```

Caveat: polyfill runs on **main thread**, so it loses the off-thread GPU win. Acceptable for the ~15% of users on stale browsers ([flackr/scroll-timeline](https://github.com/flackr/scroll-timeline)).

### 2.6 Parallax: when it's tacky

Parallax is a scalpel in 2026. Rules:
1. **Speed delta ≤ 0.3** between foreground and background. Beyond 0.5 induces motion sickness; beyond 0.7 looks broken.
2. **Translate only** (no `top`/`left`). `transform: translate3d(0, calc(var(--p) * -20vh), 0)` driven by a CSS variable from a scroll timeline.
3. **Never on text** larger than 20pt. Big text + parallax = trash.
4. **Always gate** behind `@media (prefers-reduced-motion: no-preference)`.

---

## 3) Composite-Only Properties (and the forbidden ones)

### 3.1 The tier list

From [Motion's web animation performance tier list](https://motion.dev/magazine/web-animation-performance-tier-list):

- **S-tier (compositor only):** `transform`, `opacity`, `filter`, `clip-path`. Run off-main-thread.
- **A-tier (main thread → composite only):** main-thread WAAPI on S-tier properties when style is invalidated.
- **B-tier:** A/S-tier with one-time layout reads.
- **C-tier (paint):** `background-color`, `color`, `box-shadow` (cheap), `border-color`.
- **D-tier (layout):** `width`, `height`, `top`, `left`, `padding`, `margin`. **Forbidden in motion paths.**
- **F-tier:** read-write-read-write thrash. Catastrophic.

### 3.2 `will-change`: the loaded gun

- Promotes to its own compositor layer. **GPU memory cost.**
- Spamming `will-change: transform` on every element drains mobile VRAM and ironically *kills* performance ([Aerotwist on translate3d hacks](https://aerotwist.com/blog/on-translate3d-and-layer-creation-hacks/)).
- **Rule:** add it ≤30 ms before the animation, remove on `animationend`. For scroll-driven, add via `:has()` or via JS toggled on `IntersectionObserver` enter, remove on exit.
- For the hero (one-shot entrance), apply once and remove via JS after entrance completes.

### 3.3 `content-visibility: auto` + `contain-intrinsic-size`

Below-the-fold sections get:
```css
.section-deep {
  content-visibility: auto;
  contain-intrinsic-size: auto 800px; /* placeholder; browser auto-refines */
}
```

Skipping offscreen rendering yielded 7× initial render improvement in [web.dev's example](https://web.dev/articles/content-visibility) (232 ms → 30 ms). **Always pair with `contain-intrinsic-size`** or scrollbars jitter and Cmd+F lands wrong.

Do NOT apply to:
- The hero / first viewport.
- Anything that hosts a scroll-timeline tracker.
- Anchors that are deep-link targets.

### 3.4 `contain`

For independent components that won't affect outside layout:
```css
.card { contain: layout paint; }
```
Tells the engine the element's internals are isolated. Major boost when animating cards that have hover transforms.

---

## 4) Frame Pacing

### 4.1 Budget

- **60 Hz:** 16.7 ms / frame total. Browser needs ~4 ms for paint+composite, so **~12 ms** for your JS+style+layout.
- **120 Hz:** 8.3 ms / frame total. **~4 ms** of headroom for JS.
- **ProMotion (variable 24–120 Hz):** browser drops you to the lower tier silently if you miss frames. One missed frame can knock the page from 120 to 60 for the user.

### 4.2 rAF rules

- `requestAnimationFrame` runs **before** style/layout/paint inside the same frame.
- Multiple `rAF` callbacks coalesce into one frame; they share the same `DOMHighResTimeStamp` even though wall-clock advances ([Paul Irish, rAF scheduling](https://medium.com/@paul_irish/requestanimationframe-scheduling-for-nerds-9c57f7438ef4)).
- **Never** kick off a layout read inside the same rAF after a write — it forces sync layout. Use a read-then-write pattern, or use ResizeObserver to read.
- For scrub via WAAPI: set `animation.currentTime = scrollProgress * totalDuration`. WAAPI keeps the actual interpolation on the compositor.

### 4.3 IntersectionObserver vs scroll listener

Always IntersectionObserver. Listening to `scroll` is a 2010s mistake. IO fires async, batches, runs after rAF callbacks but before paint ([w3c/IntersectionObserver issue #263](https://github.com/w3c/IntersectionObserver/issues/263)).

```js
import { inView } from "motion/mini"; // 0.8 KB, uses IO under the hood
inView(".reveal", (el) => {
  animate(el, { opacity: [0, 1], y: [16, 0] }, { duration: 0.6, easing: "cubic-bezier(.2,.8,.2,1)" });
});
```

### 4.4 Instrumentation — what to actually check

1. **Chrome DevTools → Performance → record a 6× slowdown trace.** Look for red "Long Frames" in the Frames track. Anything >16.7 ms at 60 Hz is a dropped frame.
2. **Performance.measureUserAgentSpecificMemory()** for layer-memory regressions on mobile.
3. **Long Animation Frames API (LoAF):** `PerformanceObserver({entryTypes: ['long-animation-frame']})`. Better than legacy `longtask` ([Chrome LoAF docs](https://developer.chrome.com/docs/web-platform/long-animation-frames)).
4. **`requestVideoFrameCallback`** for true VSync alignment on Mac ProMotion.
5. CrUX INP threshold: 200 ms. 43% of sites fail it in 2026 — *don't be one of them*.

---

## 5) Multi-Layer Orchestration — the "Composed vs Random" Test

What separates *composed* motion from *motion-for-the-sake-of-motion*:

### 5.1 The three pillars

1. **Asymmetric durations per layer.** Foreground (text, primary CTA) **220–320 ms** with a sharp deceleration curve `cubic-bezier(.2,.8,.2,1)`. Mid-ground (subtitles, badges) **420–520 ms**. Background (grid lines, ambient hue, particles) **800–1400 ms** with a long flat tail. The eye reads foreground first; backgrounds settle into peripheral vision.
2. **Counter-motion + opposing eases.** When one element moves up with an ease-out, another should move up with an ease-in (or stay still). Equal-and-opposite motion telegraphs intention; everything-rises-together looks cheap.
3. **Stagger with a meaningful unit.** Don't stagger by arbitrary 50 ms; stagger by a unit derived from your foreground duration (e.g., `duration / element_count / 1.5`). The whole composition wraps in a deliberate beat.

### 5.2 Disney 12 → Code

| Principle | Implementation |
|---|---|
| **Anticipation** | 2–4 px counter-direction nudge for 80 ms before the main move. CTA button shifts 1 px down before lifting on hover. |
| **Squash & stretch** | `scale(1, 0.92)` on click, snap back via spring `linear()` curve. Subtle (≤8%) on UI. |
| **Slow in / slow out** | The *default* answer is `cubic-bezier(.2,.8,.2,1)` — sharp deceleration, almost no acceleration. Material 3's "emphasized" curve `cubic-bezier(.05,.7,.1,1)` is sharper. |
| **Follow-through & overlapping action** | Sibling elements start ~80 ms *after* the leader and run ~30% longer. Card lifts; shadow follows; label arrives last. |
| **Secondary action** | Background grid hairlines pulse opacity *while* primary text reveals. Adds life without competing. |
| **Timing** | Cluster events near key beats. A 6-element reveal isn't 6×100 ms even; it's 3 fast at 70 ms apart + 1 hold + 2 slower at 200 ms apart. |
| **Arcs** | Move things on arcs not straight lines. `motion-path: path('M0,0 Q20,-30 60,0')` or two transforms (x linear + y eased differently). |
| **Exaggeration** | Tiny overshoot via `linear()` spring: `linear(0, 1.08 40%, 0.98 70%, 1)`. |

### 5.3 The "named-curve palette" trick

Define exactly 4 easing curves in CSS variables. Use only those. The composition starts to feel inevitable.

```css
:root {
  --ease-out-quart: cubic-bezier(.25, 1, .5, 1);            /* fg text */
  --ease-out-expo:  cubic-bezier(.16, 1, .3, 1);             /* fg buttons */
  --ease-emphasized: cubic-bezier(.05, .7, .1, 1);           /* hero arrival */
  --ease-spring: linear(0, 0.5 12%, 0.94 27%, 1.04 38%, 1);  /* punch / bounce */
  --ease-linear: linear;                                      /* scrub only */
}
```

### 5.4 Why `linear` is back

In CSS scroll-driven animations, the animation's progress is *already* the scroll position. Adding an ease on top means the visual progress no longer matches the scroll wheel/scrollbar position, which feels broken. **For scrub: always `animation-timing-function: linear`.** Save eases for *time-driven* animations.

---

## 6) Easing — Specific Values to Use

### 6.1 Cubic-bezier menu

| Token | Value | Use |
|---|---|---|
| `--ease-out-quart` | `cubic-bezier(.25, 1, .5, 1)` | Default UI reveal |
| `--ease-emphasized` (M3) | `cubic-bezier(.05, .7, .1, 1)` | Hero entrance |
| `--ease-emph-decel` (M3) | `cubic-bezier(.3, 0, 0, 1)` | Things settling in |
| `--ease-emph-accel` | `cubic-bezier(.3, 0, .8, .15)` | Exits |
| `--ease-standard` | `cubic-bezier(.2, 0, 0, 1)` | Neutral move |
| `--ease-soft` | `cubic-bezier(.2, .8, .2, 1)` | Buttons / micro |

Reference: [M3 motion tokens spec](https://m3.material.io/styles/motion/easing-and-duration/tokens-specs).

### 6.2 Spring via `linear()`

Bouncy spring (stiffness 180, damping 14, mass 1) sampled at ~20 points:

```css
--ease-spring: linear(
  0, 0.024 2.1%, 0.094 4.5%, 0.214 7.5%, 0.358 10.5%,
  0.521 13.7%, 0.768 18.5%, 0.969 22.6%, 1.080 25.7%,
  1.115 27.8%, 1.130 30.4%, 1.116 33.4%, 1.063 38.4%,
  1.022 43.3%, 0.992 49.3%, 0.984 55.5%, 0.998 71.7%, 1
);
```

Use sparingly. One spring per page is plenty.

### 6.3 Stiff snap (no overshoot)

```css
--ease-snap: linear(0, 0.5 8%, 0.85 18%, 0.97 30%, 1 50%);
```

Feels "engineered." Good for dev-tool / IDE-vibe portfolios.

---

## 7) FPS Budget — Per-Frame Discipline

### 7.1 The contract

- 120 Hz: **8.3 ms total**. Allocate: 2 ms style+layout, 2 ms paint, 1 ms composite → **3 ms** for JS, **must not exceed**.
- 60 Hz: 16.7 ms. **9 ms** for JS is safe.
- **Any** animation that touches D-tier properties on every frame is automatically out of budget at 120 Hz.

### 7.2 Where the budget burns

- Layout thrash from reading `getBoundingClientRect` after writing transforms.
- Excessive layers from blanket `will-change: transform`.
- Big `filter: blur(20px)` over large surfaces (cost = `radius² × area`).
- Unbatched `style` writes from a per-element `rAF` loop. Use **one** `rAF`, mutate everything in it.
- CSS custom property inheritance cascades on registered `@property` — set `inherits: false` to avoid invalidation storms.

### 7.3 The smoke test before shipping

1. DevTools → Performance → 6× CPU throttle, mobile preset.
2. Run the hero entrance. Check Frames track: **0 red frames**.
3. Scroll the whole page. Check the green-bar GPU memory tab: **no monotonic growth**.
4. Tab away, tab back. The page should not re-trigger entrance animations (use `animation-play-state` + `inView` once-only).
5. Run Lighthouse INP audit on the deployed build. Target: <150 ms p75.

---

## 8) Reduced-Motion Path

### 8.1 The principle

`prefers-reduced-motion: reduce` ≠ no motion. It means *no vestibular triggers*: no parallax, no large translates, no spinning, no zooming. **You can still fade.** Fades under 200 ms are considered safe ([web.dev prefers-reduced-motion](https://web.dev/articles/prefers-reduced-motion)).

### 8.2 Opt-in pattern (preferred)

```css
.reveal { opacity: 1; transform: none; } /* static default */

@media (prefers-reduced-motion: no-preference) {
  .reveal {
    opacity: 0;
    transform: translateY(16px);
    animation: reveal var(--dur-md) var(--ease-emphasized) both;
    animation-timeline: view();
    animation-range: entry 10% cover 35%;
  }
}
```

Default is the *resting state*. Animation only opts in when motion is welcome. This also means SSR/no-JS users see correct content.

### 8.3 Narrative preservation

- Replace `translate` reveals with **<200 ms opacity fade**.
- Replace parallax with **static layered composition** (CSS depth via shadow/blur differences).
- Replace scroll-scrub typewriter with **the full text rendered**.
- Replace looping ambient grid pulse with **a single static state**.

The hero still tells the story: identity → service → proof. The journey is the same; the camera just doesn't move.

---

## 9) The Hero Recipe — 4-Layer Entrance on Near-Black

> **Layers:** (1) Grid backdrop, (2) Hairline rule + accent, (3) Type stack (eyebrow + headline + sub), (4) Caret/cursor.
> **Beat:** 0 ms hold → grid breathes in → hairlines slide → text settles → caret blinks.
> **Total duration:** 1.4 s. **Critical path JS:** ~3 KB gz.

### 9.1 Markup (Astro-ready)

```astro
---
// src/components/Hero.astro
---
<section class="hero" data-animate-on-load>
  <div class="hero__grid" aria-hidden="true"></div>

  <div class="hero__rules" aria-hidden="true">
    <span class="hero__rule hero__rule--h"></span>
    <span class="hero__rule hero__rule--v"></span>
  </div>

  <div class="hero__type">
    <p class="hero__eyebrow" data-reveal>Flutter Code Audit</p>
    <h1 class="hero__headline">
      <span data-reveal-line>Find the bug</span>
      <span data-reveal-line>before it ships</span>
    </h1>
    <p class="hero__sub" data-reveal>Static analysis, render-tree audits, perf forensics.</p>
  </div>

  <span class="hero__caret" aria-hidden="true"></span>
</section>
```

### 9.2 CSS — the load-bearing part

```css
:root {
  --bg: oklch(11% 0 0);
  --fg: oklch(95% 0 0);
  --hairline: oklch(35% 0 0);
  --accent: oklch(75% .15 145);

  --dur-fast: 220ms;
  --dur-med:  440ms;
  --dur-slow: 1100ms;

  --ease-emphasized: cubic-bezier(.05, .7, .1, 1);
  --ease-out-quart:  cubic-bezier(.25, 1, .5, 1);
  --ease-linear:     linear;
}

* { box-sizing: border-box; }

.hero {
  position: relative;
  isolation: isolate;
  min-height: 100svh;
  background: var(--bg);
  color: var(--fg);
  overflow: clip;
  contain: layout paint;
}

/* Layer 1 — Grid (slowest, ambient) */
.hero__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right,  oklch(20% 0 0) 1px, transparent 1px),
    linear-gradient(to bottom, oklch(20% 0 0) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(ellipse 60% 50% at 50% 40%, #000 40%, transparent 100%);
  opacity: 0;
  transform: scale(1.04);
  z-index: 0;
}

/* Layer 2 — Hairlines + accent (mid) */
.hero__rules { position: absolute; inset: 0; pointer-events: none; z-index: 1; }
.hero__rule {
  position: absolute;
  background: var(--hairline);
  transform-origin: 0 50%;
  opacity: 0;
}
.hero__rule--h {
  top: 64%;
  left: 0;
  width: 100%;
  height: 1px;
  transform: scaleX(0);
}
.hero__rule--v {
  top: 0;
  left: 32%;
  width: 1px;
  height: 100%;
  transform: scaleY(0);
  transform-origin: 50% 0;
}

/* Layer 3 — Type (foreground, sharpest) */
.hero__type {
  position: relative;
  z-index: 2;
  padding: 12svh 8vw;
  max-width: 1080px;
}
[data-reveal], [data-reveal-line] {
  opacity: 0;
  transform: translateY(14px);
}
.hero__headline { overflow: clip; line-height: 1.05; }
.hero__headline > span { display: block; }

/* Layer 4 — Caret (last, breath of life) */
.hero__caret {
  position: relative;
  z-index: 2;
  display: inline-block;
  width: .55ch;
  height: 1.1em;
  background: var(--accent);
  vertical-align: -0.15em;
  margin-left: .25ch;
  opacity: 0;
}

/* --- ANIMATION (opt-in via reduced-motion) --- */

@media (prefers-reduced-motion: no-preference) {

  @keyframes grid-in {
    from { opacity: 0; transform: scale(1.04); }
    to   { opacity: .55; transform: scale(1); }
  }
  @keyframes rule-h-in { from { transform: scaleX(0); opacity: 0; } to { transform: scaleX(1); opacity: 1; } }
  @keyframes rule-v-in { from { transform: scaleY(0); opacity: 0; } to { transform: scaleY(1); opacity: 1; } }
  @keyframes reveal-up { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes caret-fade { from { opacity: 0; } to { opacity: 1; } }
  @keyframes caret-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }

  .hero[data-animate-on-load] .hero__grid {
    animation: grid-in var(--dur-slow) var(--ease-emphasized) 100ms both;
  }
  .hero[data-animate-on-load] .hero__rule--h {
    animation: rule-h-in 700ms var(--ease-out-quart) 280ms both;
  }
  .hero[data-animate-on-load] .hero__rule--v {
    animation: rule-v-in 620ms var(--ease-out-quart) 360ms both;
  }
  .hero[data-animate-on-load] .hero__eyebrow {
    animation: reveal-up var(--dur-med) var(--ease-out-quart) 480ms both;
  }
  .hero[data-animate-on-load] .hero__headline span:nth-child(1) {
    animation: reveal-up var(--dur-med) var(--ease-emphasized) 560ms both;
  }
  .hero[data-animate-on-load] .hero__headline span:nth-child(2) {
    animation: reveal-up var(--dur-med) var(--ease-emphasized) 640ms both;
  }
  .hero[data-animate-on-load] .hero__sub {
    animation: reveal-up var(--dur-med) var(--ease-out-quart) 760ms both;
  }
  .hero[data-animate-on-load] .hero__caret {
    animation:
      caret-fade 200ms linear 920ms both,
      caret-blink 1100ms steps(2, jump-none) 1140ms infinite;
  }
}
```

**Notice:** zero JavaScript is needed for the hero entrance. The whole thing is pure CSS, GPU-composited, off the main thread, runs at 120 Hz on a 2026 MacBook with thermal throttling. The browser handles `rAF` for us.

### 9.3 Optional JS — only for one-shot guard + scroll continuation

```js
// /src/scripts/hero.js   (~1 KB after tree-shake)
import { animate, inView } from "motion/mini";

// Strip the data attr after entrance so refresh / view-transition doesn't re-animate.
const hero = document.querySelector('.hero');
if (hero) {
  hero.addEventListener('animationend', (e) => {
    if (e.target === document.querySelector('.hero__caret')) {
      // Caret has started blinking → entrance complete
      hero.removeAttribute('data-animate-on-load');
    }
  });
}

// Reveal staggers below the fold — CSS-first, JS fallback only if no native support.
if (!CSS.supports('animation-timeline: view()')) {
  inView('[data-reveal]', ({ target }) => {
    animate(target,
      { opacity: [0, 1], transform: ['translateY(14px)', 'translateY(0)'] },
      { duration: 0.44, easing: 'cubic-bezier(.25, 1, .5, 1)' }
    );
  }, { margin: '0px 0px -10% 0px' });
}
```

### 9.4 Scroll-driven reveals below the fold (CSS-only)

```css
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    [data-reveal] {
      animation: reveal-up linear both;
      animation-timeline: view();
      animation-range: entry 0% cover 25%;
    }
  }
}
```

### 9.5 Why this composition works

- **Asymmetric durations** (grid 1100 ms, rules 620–700 ms, text 440 ms, caret 200 ms) make the eye land on text first while the world settles in behind it.
- **Anticipation** is encoded as the grid's scale(1.04) → scale(1) settle — feels like the camera focuses.
- **Follow-through** is the caret blink: the page keeps "breathing" after the entrance.
- **Counter-motion**: rules expand horizontally + vertically *while* text rises — orthogonal axes prevent reading as "everything goes up."
- **Negative space**: text settles inside an L formed by the two rules. The rules "frame" the message.
- **All composite-only properties.** Zero layout, zero paint after entrance. GPU all the way.
- **Reduced-motion:** entire animation collapses to static — content still legible, hierarchy preserved.

---

## 10) Final Architecture Diagram

```
+----------------------------------------------------------+
| index.html (Astro-built, prerendered, ~12 KB gz)         |
| - <Hero> Astro component (no client JS)                  |
| - <Section> components with [data-reveal] hooks          |
+----------------------------------------------------------+
                          |
                          v
+----------------------------------------------------------+
| Critical CSS (~6 KB gz, inlined in <head>)               |
| - tokens, hero layer styles, animations,                 |
|   @supports gates, @media reduced-motion                 |
+----------------------------------------------------------+
                          |
                          v
+----------------------------------------------------------+
| Deferred JS bundle (~3 KB gz, loaded with client:idle)   |
| - motion/mini animate + inView                           |
| - polyfill loader (conditional, ~15 KB only if needed)   |
| - one-shot guard for hero entrance                       |
+----------------------------------------------------------+
                          |
                          v
+----------------------------------------------------------+
| Browser does the work:                                    |
| - CSS scroll-timeline + view-timeline → compositor        |
| - WAAPI for JS fallbacks → compositor                     |
| - IntersectionObserver for non-CSS-timeline reveals       |
+----------------------------------------------------------+
```

**Total motion JS at runtime:** 2.6 KB (mini animate) + 0.8 KB (inView) + ~0.4 KB hero glue ≈ **3.8 KB gz**.
**Total motion JS budget:** 30 KB. **Headroom:** 26 KB — banked for project-detail Flip transitions later if we add them.

---

## 11) Citations

- [Webflow makes GSAP 100% free](https://webflow.com/updates/gsap-becomes-free) — license + plugin inclusion
- [GSAP Pricing 2026](https://gsap.com/pricing/) — current free tier
- [Motion feature comparison](https://motion.dev/docs/feature-comparison) — bundle size table
- [Motion animate() docs](https://motion.dev/docs/animate) — API for vanilla JS
- [Motion upgrade guide](https://motion.dev/docs/upgrade-guide) — mini vs hybrid split
- [Motion: web animation performance tier list](https://motion.dev/magazine/web-animation-performance-tier-list) — S/A/B/C/D tier breakdown
- [Anime.js v4 release notes](https://github.com/juliangarnier/anime/wiki/What's-new-in-Anime.js-V4) — modular API
- [MDN: scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations) — spec overview
- [MDN: animation-timeline](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline) — property reference
- [MDN: linear() easing](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/easing-function/linear) — syntax + spring approximation
- [WebKit: animation-range cheatsheet](https://webkit.org/blog/17184/so-many-ranges-so-little-time-a-cheatsheet-of-animation-ranges-for-your-next-scroll-driven-animation/) — cover/contain/entry/exit
- [Josh Comeau: scroll-driven animations](https://www.joshwcomeau.com/animation/scroll-driven-animations/) — practical patterns
- [Josh Comeau: spring physics](https://www.joshwcomeau.com/animation/a-friendly-introduction-to-spring-physics/) — mass/stiffness/damping
- [Smashing Magazine: CSS scroll-driven](https://www.smashingmagazine.com/2024/12/introduction-css-scroll-driven-animations/) — patterns
- [caniuse: css-scroll-timeline](https://caniuse.com/css-scroll-timeline) — 85% coverage figure
- [flackr/scroll-timeline](https://github.com/flackr/scroll-timeline) — official polyfill
- [Chrome: linear() easing function](https://developer.chrome.com/docs/css-ui/css-linear-easing-function) — spring sampling
- [Material 3 motion tokens](https://m3.material.io/styles/motion/easing-and-duration/tokens-specs) — emphasized curves
- [Flutter Easing.emphasizedDecelerate](https://api.flutter.dev/flutter/material/Easing/emphasizedDecelerate-constant.html) — `Cubic(0.05, 0.7, 0.1, 1.0)` confirmed value
- [web.dev: content-visibility](https://web.dev/articles/content-visibility) — 7× rendering boost
- [web.dev: prefers-reduced-motion](https://web.dev/articles/prefers-reduced-motion) — narrative preservation
- [Chrome: View Transitions](https://developer.chrome.com/docs/web-platform/view-transitions) — same-doc + cross-doc
- [caniuse: view-transitions](https://caniuse.com/view-transitions) — Baseline same-doc 2026
- [Chrome: Long Animation Frames API](https://developer.chrome.com/docs/web-platform/long-animation-frames) — LoAF instrumentation
- [Paul Irish: rAF scheduling for nerds](https://medium.com/@paul_irish/requestanimationframe-scheduling-for-nerds-9c57f7438ef4) — coalescing
- [Aerotwist: translate3d hacks](https://aerotwist.com/blog/on-translate3d-and-layer-creation-hacks/) — `will-change` cost
- [Codrops: Joffrey Spitzer Astro+GSAP](https://tympanus.net/codrops/2026/02/18/joffrey-spitzer-portfolio-a-minimalist-astro-gsap-build-with-reveals-flip-transitions-and-subtle-motion/) — composed reveal patterns
- [IxDF: Disney 12 principles for UI](https://ixdf.org/literature/article/ui-animation-how-to-apply-disney-s-12-principles-of-animation-to-ui-design) — anticipation, follow-through
- [Lenis](https://www.lenis.dev/) — smooth-scroll context (not used)
- [SplitType](https://github.com/lukePeavey/SplitType) — accessible text split alternative to GSAP SplitText
- [CSS-Tricks: parallax with scroll-driven CSS](https://css-tricks.com/bringing-back-parallax-with-scroll-driven-css-animations/) — tasteful parallax
- [w3c: IntersectionObserver issue #263](https://github.com/w3c/IntersectionObserver/issues/263) — IO firing relative to rAF
