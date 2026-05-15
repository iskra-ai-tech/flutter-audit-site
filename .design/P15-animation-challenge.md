# P15 — Animation Challenge

**Verdict: BLOOD.**

The motion system reads well in the CSS — composite-only, asymmetric durations, four named curves — but the polyfill path is a triple-confirmed dead drop, the reduced-motion path renders a broken hairline, and a permanent caret blink is burning cycles for no narrative reason. The orchestration also crosses the line from "stagger" to "wait" — the hero's last reveal lands 1.16 s after first paint, which is past the bored-of-this threshold for an above-the-fold hero.

The good news: every blood finding is a small surgical fix. None require redesign.

---

## CRITICAL — CSP vs Polyfill (immediate)

**File**: `src/scripts/motion.js:103` + `public/_headers:8`
**Severity**: critical
**Status**: confirmed on all three independent failure modes

```js
// motion.js:103
import("https://cdn.jsdelivr.net/npm/scroll-timeline-polyfill@1.0.0/+esm").catch(() => {});
```

```
script-src 'self' 'unsafe-inline'
```

Three independent failures, any one of which kills it:

1. **CSP blocks the import.** `script-src` whitelist contains `'self'` and `'unsafe-inline'`. `https://cdn.jsdelivr.net` is not in the list. Dynamic `import()` is governed by `script-src` (and `script-src-elem` when present). Result: the polyfill request never gets executed. The `.catch(() => {})` swallows the violation silently, so this fails open with no visible breakage on browsers that *do* support `animation-timeline: view()` — but Safari ≤17 users get nothing.
2. **Version 1.0.0 was unpublished.** Verified against npm registry: `scroll-timeline-polyfill` package's *only* currently-published version is `1.1.0` (created 2024-05-15). The `time` field still lists `1.0.0` (created 2022-10-28) because npm keeps the publish-timestamp metadata after unpublish, but `versions` is `['1.1.0']`. The CDN returns 404 for `@1.0.0/+esm`.
3. **The package has no ESM entry.** Verified `package.json` for both 1.0.0 (when it existed) and 1.1.0: `main`, `module`, `exports` are all undefined. The flackr canonical polyfill ships `dist/scroll-timeline.js` as a side-effect script that mutates `window`, not as an ES module. `+esm` returns 404 for v1.1.0 too. Even if CSP allowed the host and the version existed, `import("…/+esm")` would still fail because there is no ESM build.

**Repro**: Open the deployed site in Safari 17.0 (no `view()` support), scroll past hero, open devtools console. You'll see a CSP violation report and no reveal animations fire on the bento/process/about sections. Cards appear in their pre-animation state (opacity: 0 if scroll-timeline rules apply, or static layout if `@supports` correctly excludes them — see fix below).

**Why it doesn't break visibly today**: The `@supports (animation-timeline: view())` guard in `animations.css:7` means browsers without support don't apply the scroll-timeline rules at all. The JS fallback uses `.js-reveal` + `IntersectionObserver` (motion.js:66-79). That fallback exists. **So the polyfill is doing nothing useful even on supported browsers, and nothing successful on unsupported ones.** It's a no-op import that broadcasts a CSP violation. Delete it.

**Fix (recommended)**: Remove the polyfill block entirely (`motion.js:95-109`). The IO fallback is already in place and works. The `<section>` markup needs `.js-reveal` added to bento/problem/process/about/proof/pricing/portrait nodes (which I assume P10 will handle; verify in HTML pass).

**Fix (alternative, if polyfill is actually wanted)**:
- Bundle the polyfill at build time into `public/assets/scroll-timeline.min.js` (self-hosted).
- Inject via `<script src="/assets/scroll-timeline.min.js" defer>` only when `!CSS.supports('animation-timeline: view()')` — set this from an inline boot script in `<head>`.
- Or: load it from an HTMLScriptElement (`document.createElement('script')`) with a `src` of `/assets/...` to keep `'self'` working.
- Either way: CSP stays restrictive, no external dependency, version is locked.

---

## Section 1 — Hero 4-Layer Entrance: Composite-Only Check

### 1.1 Composite-only verification

**File**: `src/styles/hero.css:21-88`
**Severity**: minor (overall pass, with one nuance)

Every animated property in the hero is on the compositor:

| Layer | Selector | Animated props | Compositor? |
|---|---|---|---|
| Grid (bg) | `.hero-grid` | `opacity`, `transform: scale` | yes |
| Rule (mid) | `.hero-rule` | `transform: scaleX` | yes |
| Type (mid-fg) | `.hero-eyebrow`/`.line`/`.hero-lede`/etc. | `opacity`, `transform: translateY` | yes |
| Caret (fg) | `.hero-caret` | `opacity`, `transform: scaleY` | yes |

No `top`/`left`/`width`/`height`/`box-shadow`/`background-position`/animated `clip-path`. Pass on the literal check.

### 1.2 `mask-image` repaint cost (the actual nuance)

**File**: `src/styles/hero.css:22-37`
**Severity**: major
**The claim under test**: "Does `mask-image: radial-gradient(...)` cause repaint when the parent animates `transform: scale`?"

**Answer**: No, *but with a price*. Transform-scaling a masked element does not invalidate the mask — Chromium and Firefox both promote the masked element to a compositor layer (because `will-change: transform, opacity` is set) and the mask becomes a layer effect applied at composite. The bitmap of the dot grid + mask is rasterized once into a backing store, then transform-scaled cheaply.

The cost is *layer memory*, not repaint:
- The hero-grid covers `inset: 0` and is `position: absolute` inside a `position: relative; isolation: isolate` parent. On a 1440×900 viewport that's a 1440×900×4 = ~5.2 MB compositor texture (RGBA, undpr). On retina 2880×1800 = ~20.7 MB.
- On Safari, `mask-image` with a CSS gradient still goes through software rasterization for the mask layer; the radial gradient is re-rasterized only on *resize*, not on transform — so this is fine after first paint.
- However, scaling from 0.985 → 1.0 means the texture is sampled at slightly different resolutions during the 1200 ms — minor sub-pixel interpolation cost on the GPU, well under 1 ms/frame. **Pass.**

### 1.3 `will-change: transform, opacity` lingering cost

**File**: `src/styles/hero.css:36, 72`
**Severity**: minor

`will-change` creates a permanent stacking context and (in Chromium) keeps the GPU layer allocated for the lifetime of the element. The hero entrance animations finish in 1.4 s but the layers stay promoted forever, costing layer memory. For the hero, that's actually correct — hero stays on screen during scroll and the GPU layer means scroll-time transforms are free. But you could shave ~5 MB of GPU memory by removing `will-change` from `.hero-grid` after animation end via a one-shot `animationend` listener that strips the attribute. **Not worth the JS.** Pass.

### 1.4 Caret infinite blink — the permanent cost

**File**: `src/styles/hero.css:175, 180`
**Severity**: **major**

```css
animation: caretIn 240ms var(--ease-out-quart) 980ms forwards,
           caretBlink 1.2s steps(2) 1.4s infinite;
```

This animation **never stops**. As long as the hero element exists in the document, the compositor allocates a frame for the caret every 600 ms (the `50% { opacity: 0 }` keyframe). It's `steps(2)`, so it's a step change in opacity — that's a discrete repaint of a 0.45em × 1em colored box. Cheap. **But:**
- The user scrolls down 600 vh, the hero is far off screen, and the browser is still calling `requestAnimationFrame` for the caret layer at the OS refresh rate to check whether the keyframe needs to step. Chromium's compositor will throttle off-screen animations, but the timer keeps ticking.
- Battery cost on mobile: minor but measurable on a Moto E13 (each wake of the compositor at 8.3 ms intervals costs cycles even for a discrete step animation).
- **Narrative cost**: a blinking caret implies "I am typing" or "I am waiting for input." Both untrue. The headline is already complete by 1.4 s. Why is something blinking?

**Fix**: Limit to 5 iterations (≈6 s of presence), then it sits steady or fades:
```css
animation: caretIn 240ms var(--ease-out-quart) 980ms forwards,
           caretBlink 1.2s steps(2) 1.4s 5;  /* 5 iterations, not infinite */
```
Or fade it out after the user has clearly read the headline:
```css
animation: caretIn 240ms var(--ease-out-quart) 980ms forwards,
           caretBlink 1.2s steps(2) 1.4s 4,
           caretOut 240ms var(--ease-emphasized) 6200ms forwards;
@keyframes caretOut { to { opacity: 0; } }
```

---

## Section 2 — Stagger Orchestration

### 2.1 Total stagger duration too long

**File**: `src/styles/hero.css:76-83`
**Severity**: **major**

```
.hero-eyebrow      80ms
.hero-byline      160ms
.hero-headline 1  320ms
.hero-headline 2  400ms
.hero-headline 3  480ms
.hero-lede        640ms
.hero-ctas        760ms
.hero-trust       880ms
```

With `--d-mid = 460ms` (`tokens.css:105`) as the animation duration, the last element (`hero-trust`) finishes at **880 + 460 = 1340 ms** after `DOMContentLoaded`. Add the hero-grid which finishes at `60 + 1200 = 1260 ms` (`--d-slow`).

The doctrine says stagger by 60–80 ms (DOCTRINE.md:140). Audit:
- `eyebrow → byline`: 80 ms (in range)
- `byline → headline-1`: 160 ms (**double the upper bound** — feels like a pause)
- `headline 1 → 2 → 3`: 80 ms each (good)
- `headline-3 → lede`: 160 ms (again double)
- `lede → ctas`: 120 ms (acceptable)
- `ctas → trust`: 120 ms (acceptable)

The two 160 ms gaps are *intentional* — they mark the eyebrow-to-headline and headline-to-body transitions. But the combined total pushes the visible-CTA moment to ~1.2 s. Users will start scrolling at ~0.8 s. The trust line never gets seen on entrance.

**Fix**: Tighten:
```css
.hero-eyebrow      { animation-delay:  60ms; }
.hero-byline       { animation-delay: 120ms; }
.hero-headline .line:nth-child(1) { animation-delay: 220ms; }
.hero-headline .line:nth-child(2) { animation-delay: 280ms; }
.hero-headline .line:nth-child(3) { animation-delay: 340ms; }
.hero-lede        { animation-delay: 440ms; }
.hero-ctas        { animation-delay: 540ms; }
.hero-trust       { animation-delay: 640ms; }
```
Last element finishes at 640 + 460 = 1100 ms. CTA visible at ~0.7 s.

### 2.2 Duration role mismatch — `--d-mid` is overused, `--d-fg` and `--d-bg` aren't

**File**: `src/styles/hero.css` + `tokens.css`
**Severity**: major

Doctrine §6 (DOCTRINE.md:137): foreground 220–320 ms, mid 420–520 ms, bg 800–1400 ms.

Token values (`tokens.css:103-107`):
- `--d-fg: 280ms` ✓ in foreground range
- `--d-mid: 460ms` ✓ in mid range
- `--d-bg: 900ms` ✓ in bg range
- `--d-slow: 1200ms` ✓ in bg range
- `--d-quick: 140ms` (sub-foreground, used for hover states only)

Audit of what's actually used:
- `.hero-grid` uses `--d-slow` (1200 ms) — correct, this is bg.
- `.hero-rule` uses hardcoded `700ms` — **out of doctrine.** The doctrine prescribes 420–520 ms for mid. `--d-mid` (460 ms) is the right token. Currently 700 ms means the rule is *slower than mid* but *faster than bg*. There's no role for that on the chart.
- Type stack uses `--d-mid` (460 ms). Doctrine says foreground 220–320 ms for the type. **Wrong layer.** Type is *foreground* relative to the rule (mid) and grid (bg). Should use `--d-fg` (280 ms).
- `.hero-caret` `caretIn` uses hardcoded `240ms` (foreground range, acceptable, but should be `--d-fg`).

So `--d-mid` (460 ms) is **misapplied to the foreground** (type stack), and *nothing* uses it for the layer that should — `.hero-rule` should be `--d-mid` and isn't.

**Fix**:
```css
.hero-rule { animation: heroRule var(--d-mid) var(--ease-out-quart) 240ms forwards; }
.hero-eyebrow,
.hero-byline,
.hero-headline .line,
.hero-lede,
.hero-ctas,
.hero-trust { animation: heroLift var(--d-fg) var(--ease-emphasized) forwards; }
```

### 2.3 Counter-motion on bento

**File**: `src/styles/animations.css:8-30`
**Severity**: minor

Hero correctly counter-moves: type rises Y+, rule expands X+. **But** the bento cards translate Y+ on scroll-driven reveal (`revealLift`, animations.css:72-75) — and nothing on the page moves on X at the same moment. There's no per-card hairline expanding X+ in counter-motion. The doctrine §6.2 (DOCTRINE.md:138): "When text rises Y+, hairlines expand X+."

You could add a left-edge accent hairline drawing X+ on each card as it enters, paired with the Y rise. But that's adding motion. The cleaner fix: this rule is the doctrine's *aspiration*, not a per-element rule — apply it where there's multi-layer composition (hero, process timeline) and exempt single-layer card reveals.

**Recommended**: clarify the doctrine to "where two layers animate simultaneously, they must counter-axis." Card-only reveals are single-layer.

---

## Section 3 — CSS Scroll-Timeline Correctness

### 3.1 `animation-range: entry 12% cover 28%` semantics

**File**: `src/styles/animations.css:22`
**Severity**: major (subtle bug)

Per CSS Scroll-Driven Animations spec §3 (Scroll Progress Timelines), the `animation-range` shorthand is `<start-name> <start-offset> <end-name> <end-offset>`.

`entry 12% cover 28%` means:
- Start: when the element has entered the scrollport by 12 % of the *entry* phase.
- End: when the element is 28 % through the *cover* phase.

Both `entry` and `cover` are *named ranges* with their own 0–100 % progressions:
- `entry` runs from "first edge enters scrollport" (0 %) to "fully inside" (100 %).
- `cover` runs from "first edge enters" (0 %) to "last edge leaves" (100 %).

These overlap. `cover 28%` is *not* "28 % of the cover phase after entry ends" — it's "28 % through cover," which on a small element starts at the same point as `entry 0%`.

**So `entry 12% cover 28%`**: animation begins when the top edge has progressed 12 % of (element-height + scrollport-height-of-entry-phase) into the scrollport, and ends when 28 % of (element-height + scrollport-height) has scrolled past the top edge. On a 400 px-tall card in a 900 px viewport:
- entry phase length = 400 + 0 = 400 px (entry starts when bottom of element crosses bottom of scrollport, ends when top of element crosses bottom)
- Actually wait, this depends on interpretation. The spec defines:
  - `entry`: 0 = bottom of viewport, 100 % = element fully inside (top of element reaches bottom of viewport)
  - `cover`: 0 = entry 0 %, 100 % = exit 100 %
- For a 400 px element in a 900 px scrollport, `cover` covers 1300 px of scroll. `entry 12%` = 12 % into the first 400 px = ~48 px in. `cover 28%` = 28 % of 1300 px = ~364 px in.
- The animation runs from ~48 px to ~364 px of scroll progress, which is reasonable — it completes well before the element is fully in view.

**The bug** is subtler: the author *probably intended* the second value to mean "28 % of the cover phase *measured from the entry endpoint*," which it does not. Read literally, `entry 12% cover 28%` is fine; read intuitively as "start at 12 % entry, end at 28 % beyond" it's wrong. The range happens to work because the percentages are small. **Pass on the literal correctness, flag for readability.**

**Fix (clarity)**: use single named range for clarity. `entry 12% entry 100%` would mean "from 12 % entered to fully entered." That's likely what was wanted. Or use `cover 0% cover 30%` to express "from when the element starts being visible to 30 % through its full traversal."

### 3.2 Stagger via per-card `animation-range`

**File**: `src/styles/animations.css:26-30`
**Severity**: minor

```css
.bento-card:nth-child(2) { animation-range: entry 14% cover 30%; }
.bento-card:nth-child(3) { animation-range: entry 16% cover 32%; }
.bento-card:nth-child(4) { animation-range: entry 18% cover 34%; }
.bento-card:nth-child(5) { animation-range: entry 20% cover 36%; }
```

This is **not a stagger** in the traditional sense. It says "card 2 starts its reveal slightly later in its entry, and ends slightly later in cover." For cards laid out in a grid where all five appear at *similar scroll positions* (a 2-column or 3-column bento), the 2 %-per-card range shift produces a 2 %-of-viewport gap between their starts — a 900 px viewport gives 18 px between card 1 and card 2 starting. That's *too tight* to perceive as stagger. On scroll-snapping or normal scrolling at ~100 px/frame, all five reveals will overlap inside one or two frames.

**Worse**: if cards are laid out in a *single column* (mobile), each card is at a different scroll position naturally, so the per-card range shift compounds with the natural offset — card 5 might start its reveal *after* card 5 is already fully scrolled past the start point, meaning card 5 never plays at all because its `entry 20%` is reached on a part of the scroll where the element is already through entry.

**Fix**: For desktop bento (grid), use `animation-delay` semantics. But scroll-driven animations don't honor `animation-delay`. The correct primitive is `animation-range-start` with a real visual offset and an `animation-range-end` that's a fixed *duration* past start. Currently the CSS uses `animation-range` shorthand which couples start and end.

Cleanest fix: keep `animation-range: entry 12% cover 28%` for all, and stagger via *property*, not range:
```css
.bento-card { --i: 0; animation-delay: calc(var(--i) * 80ms); }
.bento-card:nth-child(2) { --i: 1; }
.bento-card:nth-child(3) { --i: 2; }
/* ... */
```
…except `animation-delay` is **ignored** by `animation-timeline` — that's the whole point of scroll-driven. So the stagger has to be physical (different scroll positions). On a single-column layout, natural offset *is* the stagger. On grid layout, accept that all cards reveal simultaneously and call it composition, not chaos.

**Recommendation**: delete the per-nth-child range overrides for bento on desktop. They produce micro-jitter rather than stagger. Single-column mobile gets natural stagger free.

### 3.3 Safari support story

**Severity**: major (informational)

State as of 2026-05:
- Chrome/Edge 115+: stable since 2023-08.
- Firefox 144+: stable since 2025-09.
- Safari: shipped `view()` in Safari 18 (2024-09), `animation-timeline` keyword in 17.4 (2024-03), `animation-range` in 18.0. **`animation-range` named-range support landed in Safari 18.2 (2024-12).** Earlier 18.x versions partially supported but had bugs around `entry/cover` percentage interpretation (WebKit bug 273475).
- iOS Safari: same versions, so iOS 17 users (significant tail through 2026) do not have `view()`.

**Implication**: the `@supports (animation-timeline: view())` guard returns `true` on Safari 18.0 but the actual range behavior is buggy until 18.2. The site appears to handle this acceptably (cards still translate Y, no broken state) but the per-card range stagger above will fall apart specifically on Safari 18.0/18.1.

---

## Section 4 — Polyfill Loading Strategy

Covered above in CRITICAL. Summary of the path forward:

| Option | Effort | Outcome |
|---|---|---|
| Delete polyfill block | 5 min | IO fallback already exists. Safari ≤17 users see static layout — actually fine because content is in place, just no reveals. |
| Self-host polyfill | ~30 min | Add `scroll-timeline@1.x` to build, output `public/assets/scroll-timeline.min.js`. Inject via `<script src>` only when feature-detect fails. CSP stays restrictive. |
| Add CDN to CSP | 1 min | Adds `https://cdn.jsdelivr.net` to `script-src`. **Strongly discourage** — third-party script execution access is the CSP hole this site is designed to avoid. |

**Recommended**: option 1 unless a real product reason exists for Safari ≤17 to see scroll-driven reveals. The page degrades gracefully without them.

---

## Section 5 — Reduced-Motion Path Correctness

### 5.1 `hero-rule` broken half-drawn state

**File**: `src/styles/hero.css:183-194`
**Severity**: **major**

```css
@media (prefers-reduced-motion: reduce) {
  .hero-grid,
  .hero-rule,
  .hero-eyebrow, .hero-byline, .hero-headline .line, .hero-lede, .hero-ctas, .hero-trust,
  .hero-caret {
    animation-duration: 120ms !important;
    animation-iteration-count: 1 !important;
    animation-timing-function: linear !important;
    transform: none !important;
  }
  .hero-rule { transform: scaleX(1) !important; }
```

Order of cascade:
1. Group selector sets `transform: none !important;` on `.hero-rule` (among others).
2. Following rule sets `.hero-rule { transform: scaleX(1) !important; }`.

Both have `!important`. Per CSS specificity:
- Group selector (`.hero-rule` as part of comma list) = specificity (0,1,0).
- Single-selector `.hero-rule` = specificity (0,1,0).
- Equal specificity → **source order wins.**

The single-selector rule comes *after* the group rule, so `transform: scaleX(1) !important` wins. **The rule renders correctly at full width.** Pass on correctness.

**However**: the animation is still defined on `.hero-rule` and runs with `animation-duration: 120ms !important` and the original `@keyframes heroRule { 0% scaleX(0); 100% scaleX(1) }`. During the 120 ms the animation runs, the `transform: scaleX(1) !important` from the static rule fights with the keyframe's `0% scaleX(0)`. In CSS animations, animated properties override static ones during the running animation *only if the keyframe declares them*. With `!important` on the static rule, the static rule wins over the keyframe — meaning the rule **stays at `scaleX(1)` throughout, never animating to 0**. Pass.

**But the doctrine intent is**: reduced-motion users see no transforms, only fades. They see the rule appear at full width with a 120 ms opacity-only fade. That's fine — except the rule has no `opacity: 0` initial state. So it's actually visible from the start, and the 120 ms animation is a no-op (transform stays at scaleX(1), no opacity in keyframes). Reduced-motion users see the rule at full width from frame 1 with no animation at all. **That's correct behavior** but it's accidental — depending on cascade ordering with two `!important` rules is brittle. Pin it explicitly:

**Fix**:
```css
@media (prefers-reduced-motion: reduce) {
  .hero-rule {
    animation: none !important;
    transform: scaleX(1) !important;
  }
}
```
And drop `.hero-rule` from the group selector.

### 5.2 Caret in reduced motion — visible but useless

**File**: `src/styles/hero.css:195`
**Severity**: minor (semantic)

```css
.hero-caret { animation: none; opacity: 1; }
```

The caret is visible, statically, at full opacity. It looks like a `|` after the last word of the headline. Reduced-motion users see a static brass vertical bar that does nothing.

If the caret implies "more text incoming," and there is no more text incoming (the headline is complete), what semantic role does a static caret play? None. It reads as a typo / orphan / decoration.

**Fix**: hide it for reduced-motion users.
```css
@media (prefers-reduced-motion: reduce) {
  .hero-caret { display: none; }
}
```

---

## Section 6 — FPS Budget Under Stress

### 6.1 FAQ chevron — `rotate() + translate()` jitter

**File**: `src/styles/components.css:227, 232`
**Severity**: minor

```css
.faq-item > summary::after {
  transform: rotate(45deg) translate(-2px, -2px);
  transition: transform var(--d-fg) var(--ease-emphasized), ...;
}
.faq-item[open] > summary::after {
  transform: rotate(-135deg) translate(-2px, -2px);
}
```

The translate is applied *inside* the rotated frame. As the rotation animates from 45 deg → -135 deg (180 deg sweep), the translate's effective screen-space direction also rotates. At rotation = 45 deg, `translate(-2px, -2px)` moves the chevron up-left in screen space. At rotation = -135 deg, the same `translate(-2px, -2px)` in local frame moves the chevron *down-right* in screen space. So during the animation, the chevron's center walks an arc.

This is sub-pixel motion on a 14 px element. Known concern:
- WebKit historically had sub-pixel snapping on `transform` compositor layers (bug 159272, resolved 2018). Post-fix, transforms animate smoothly.
- Blink rasterizes `transform: rotate` into the compositor layer without re-rasterization; the translate is a transform-origin offset that's applied at composite. No jitter on modern Blink.
- Firefox same — composite-only.

**Verdict**: pass. No jitter on current browsers. The arc walk is *intentional* visually (the chevron seems to nod) and reads as a flourish.

**However**: the translate values are awkward for the design — the chevron is anchored at (-2, -2) in its own frame, which means the visual center of the chevron isn't at the grid cell center. This is a **design** issue, not animation. Fix the geometry instead:
```css
.faq-item > summary::after {
  margin-top: 4px;
  transform-origin: center;
  transform: rotate(45deg);  /* no translate */
}
.faq-item[open] > summary::after {
  transform: rotate(225deg);
}
```
And adjust width/height to make the optical center align. Cleaner cascade.

### 6.2 Moto E13 projected FPS for 5 simultaneous bento reveals

**Severity**: minor

Moto E13 GPU: Mali-G52. Each `.bento-card` reveal is `opacity + translateY` on a card sized roughly 320×220 (mobile single-col) or 420×240 (tablet 2-col). Card has a `linear-gradient(180deg, var(--bg-elevated), var(--bg))` background and a `border-radius: var(--r-3)` (10 px). Both compositor-friendly (gradient is rasterized once, transform animates the layer).

Five compositor layers at ~320×220 = ~280 KB each = ~1.4 MB total. Mali-G52 handles this trivially. Compositor frame at 60 Hz = 16.7 ms budget. Composite of five textures + scroll = ~3 ms on the device. **Pass at 60 fps.**

Real risk: the cards are wrapped in `linear-gradient` backgrounds. If a background-color-only card were used, layer allocation would be even cheaper. Not worth changing.

---

## Section 7 — Composition Coherence

### 7.1 Easing curve audit

**Files**: `tokens.css:93-100`, all CSS files
**Severity**: minor

Doctrine declares 4 named curves: `--ease-emphasized`, `--ease-out-quart`, `--ease-linear`, `--ease-spring`.

Audit:

| Animation | File | Easing | In palette? |
|---|---|---|---|
| `.hero-grid` | hero.css:35 | `--ease-emphasized` | ✓ |
| `.hero-rule` | hero.css:54 | `--ease-out-quart` | ✓ |
| Type stack `heroLift` | hero.css:73 | `--ease-emphasized` | ✓ |
| Caret `caretIn` | hero.css:175 | `--ease-out-quart` | ✓ |
| Caret `caretBlink` | hero.css:176 | `steps(2)` | step function, n/a |
| `revealLift` scroll-driven | animations.css:22 | `linear` (mandatory for scroll-timeline; the timeline IS the timing) | `--ease-linear` ✓ |
| `ruleDraw` scroll-driven | animations.css:34 | `linear` | `--ease-linear` ✓ |
| `portraitIn` scroll-driven | animations.css:46 | `linear` | `--ease-linear` ✓ |
| `.js-reveal` transition | animations.css:55-56 | `--ease-emphasized` | ✓ |
| Nav reveal | animations.css:88-89 | `--ease-emphasized` | ✓ |
| `.nav-link` color | components.css:58 | `--ease-out-quart` | ✓ |
| `.nav-cta` background | components.css:70-71 | `--ease-out-quart` | ✓ |
| `.cta` transition | components.css:95-97 | `--ease-out-quart` | ✓ |
| `.cta::after` underline | components.css:112 | `--ease-emphasized` | ✓ |
| `.cta-arrow` | components.css:122 | `--ease-emphasized` | ✓ |
| `.faq-item summary::after` | components.css:228-229 | `--ease-emphasized` | ✓ |
| `.form input` | components.css:271-272 | `--ease-out-quart` | ✓ |
| `.form-submit` | components.css:301 | `--ease-out-quart` (via `all`) | ✓ |
| `.form-submit::after` | components.css:313 | `--ease-emphasized` | ✓ |

**Two unnamed cases**:
- `caretBlink` uses `steps(2)` — a step function, not an easing curve. Acceptable (steps are categorically different from cubic-bezier curves).
- `.cta { transition: ... var(--ease-out-quart) }` uses three properties chained, all on the same curve — fine, but `transition: ... var(--ease-out-quart)` plus `transform: translateY(1px)` on `:active` doesn't have its own transition declaration — meaning the active state is *instant* (no transition), which is correct for an active press but uses no easing.

**`--ease-spring` is NEVER USED.** It's declared in tokens but applied to zero animations. Either delete it or find a use (typically a hairline-bounce or a count-in number). The doctrine says four curves; only three are in use.

**Fix**: Use `--ease-spring` on the CTA arrow nudge or the FAQ chevron — somewhere that benefits from over-shoot. Currently both are on `--ease-emphasized`.

### 7.2 Missing motion

**Severity**: minor

- **Footer**: zero entrance motion. *Correct* — footer is tail, the user has already converted or bounced.
- **Sticky bottom CTA** (mobile, `components.css:471`): appears with no entrance. Should slide in from the bottom after the user scrolls past the hero so it doesn't compete with the hero CTA. Currently it's `position: fixed; display: grid` once mobile breakpoint hits — visible from frame 1 of mobile load. **Minor finding**: add a `transform: translateY(100%)` initial state and reveal it after `scrollY > 80vh`.
- **Form field focus**: doctrine §5 (DOCTRINE.md:109) says "Form fields hairline-pulse on focus." The form input has `border-color` and `background` transitions on focus, but **no pulse**. Either implement the pulse (keyframe that scales the border briefly) or amend the doctrine. Currently the doctrine is unfulfilled.
- **Pricing**: doctrine says "Brass underline reveals under CTA" (DOCTRINE.md:110). The CTA underline already does that via `.cta::after`. Pass — but the *pricing-amount* itself has no entrance flourish. A subtle scrub-in (counting from $-something to the final number) is in the doctrine §5 ("Numerical count-in on outcomes"). Not implemented anywhere yet. Mark for P10 or P16.

### 7.3 The one fix

**If you only fix one thing**: **delete the polyfill import (motion.js:95-109).** It's broken on three grounds, blocked by CSP, and the IO fallback already covers what it was meant to cover. Deleting it removes a CSP violation log line, removes a no-op import, and removes the only third-party network dependency on the page.

If the polyfill is *actually wanted* for Safari ≤17 users (legitimate question — those users will see *static* content, not no content), self-host it as `/assets/scroll-timeline.min.js` and inject via `<script src>`.

---

## Summary table

| Severity | Count | Files |
|---|---|---|
| Critical | 1 | motion.js + _headers (the polyfill triple-fail) |
| Major | 6 | caret infinite, hero stagger total, duration role mismatch (hero-rule + type stack), Safari range bugs, reduced-motion cascade, scroll-range semantics |
| Minor | 6 | mask layer memory, will-change linger, counter-motion scope, FAQ chevron geometry, unused --ease-spring, sticky CTA entrance |

**Net verdict: BLOOD.** Fix the critical and three of the majors and this animation system is genuinely good. The doctrine and the CSS bones are sound; the issues are in the polish layer and the JS-CSP boundary.
