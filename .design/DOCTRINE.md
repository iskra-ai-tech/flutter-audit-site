# Doctrine — Flutter Audit Portfolio

This is the committed product, design, and engineering doctrine after parallel research wave 1. Every decision below is *defensible* and will be aggressively attacked in challenger phases (P04, P07, P09, P15, P17, P20, P21). If a challenger finds blood, this file gets updated and the change cascades.

---

## 1. Positioning (one line)

**A senior Flutter engineer who reads codebases the way an auditor reads a balance sheet — calmly, in 5 days, for a fixed price that doesn't grow if the work runs long.**

Audience: founders / CTOs / heads-of-engineering whose Flutter app is slow, crashy, or scary to onboard new devs to. Awareness level (Schwartz): **Problem-Aware → Solution-Aware**. The page must walk a buyer from "I knew it was bad" to "this is the specific person who can fix it" without ever using the word "synergy", "craft", or "transform".

## 2. Aesthetic doctrine

**Composition**: Editorial calm-tech. The page should feel like Stripe Press redesigned for OLED, by someone who reads `dart analyze` for fun. The site itself is the first audit deliverable — restrained, precise, no wasted line.

**Texture rules**:
- Background is **tinted near-black**, not pure black: `oklch(0.145 0.005 250)` / `#0E1014`. The 0.005 of cool chroma reads "intentional engineering" instead of "default theme".
- Hairlines are **hue-matched solid** OKLCH lines at L=0.22, not alpha-white over bg. Reason: alpha-white blooms on OLED and breaks elevation when surfaces stack.
- No glassmorphism. No neon glow. No Lottie. No marquee. No gradient orbs. No magnetic cursor. No tilt-on-hover. No scrolljack. No parallax that costs more than 1ms paint.
- Asymmetric left-anchored grid. 12 columns at desktop, 1 at mobile. Editorial column at ~640px max-width for body copy. Wider rows for bento.

**Texture additions allowed**:
- Optional 1px dot grid behind hero at 4% accent-tinted brass (decorative only, fades out by 60vh).
- One film-grain noise overlay at 2-3% opacity (1KB SVG, applied via `background-image`). Adds tactility on OLED, reduces banding in dark gradients.

## 3. Color tokens (final, committed)

Hybrid of palette D (Ink & Nothing) + A (Graphite & Brass): the site is grayscale + ONE point of brand memory.

```css
:root {
  /* Surfaces — cool-tinted near-black, NOT #000 */
  --bg:              oklch(0.145 0.005 250);   /* #0E1014 */
  --bg-elevated:     oklch(0.185 0.006 250);   /* #15181D */
  --bg-deep:         oklch(0.110 0.005 250);   /* #08090C — for under-the-fold lift */

  /* Ink — APCA Lc 96/87/58/35 vs bg */
  --ink-strong:      oklch(0.97  0.003 250);   /* #F4F4F6 — headlines */
  --ink:             oklch(0.90  0.005 250);   /* #DFDFE3 — body, target Lc 87 */
  --ink-muted:       oklch(0.68  0.008 250);   /* #9C9DA4 — captions, Lc 58 */
  --ink-faint:       oklch(0.50  0.008 250);   /* #6A6B73 — meta, Lc 35 */

  /* Hairlines — hue-matched solids, not alpha-white */
  --hairline:        oklch(0.22  0.006 250);   /* #1D1F26 */
  --hairline-strong: oklch(0.27  0.006 250);   /* #252830 */

  /* Accent — brass, used in EXACTLY two places */
  --accent:          oklch(0.78  0.12  78);    /* #D9A463 — CTA underline, hero rule */
  --accent-quiet:    oklch(0.62  0.09  78);    /* #9F7A45 — accent hover only */

  /* Signal — for the FAQ section and form validation only */
  --signal-positive: oklch(0.78 0.14 150);     /* #79C58A */
  --signal-warning:  oklch(0.82 0.15  85);     /* #E0BC5C */
  --signal-danger:   oklch(0.70 0.18  25);     /* #D86C5A */
}
```

**Where brass is allowed to appear** — revised after P21 audit:

*Primary surfaces (the "brand" appearances):*
1. The 1px underline under every CTA button (`.cta::after`, `.form-submit::after`) — appearance #1.
2. The hero's signature hairline rule (140px wide, 1px) — appearance #2.
3. The hero terminal-caret — appearance #3 (the visual full-stop on the headline; integral to the 4-layer entrance).

*Functional echoes (state-driven, derived from the primary surfaces):*
- `.nav-brand::before` indicator dot (system status, not brand decoration).
- `.faq-item[open] > summary::after` chevron color (open-state cue).
- `.cta-secondary:hover` border-bottom + `.inline-magnet a:hover` border (link hover, derived from CTA underline).
- `:focus-visible` ring on form inputs (focus state).
- `::selection` highlight (browser chrome).

The original "two appearances" rule was the right INSTINCT but mathematically wrong for a page with this many interactive surfaces. The revised rule: **three primary surfaces, with functional echoes permitted on state changes.** What this rules out: brass on body text, brass on borders, brass on backgrounds, brass on icons that aren't already part of a CTA gesture, brass on more than one chrome dot.

P21's accent audit counted 5 primary surfaces; this revision recategorizes 2 of those (caret = primary, magnet-hover = functional echo) and the rest as functional. Discipline holds.

## 4. Typography doctrine

**No webfonts.** System font stack only — 0 KB, 0 CLS, 0 FOUT, perfect rendering everywhere. The "brand typeface" is the *typography system*, not the typeface itself.

```css
--font-sans:  -apple-system, BlinkMacSystemFont, "Segoe UI Variable", "Segoe UI",
              "Helvetica Neue", Roboto, Arial, sans-serif;
--font-mono:  ui-monospace, "SF Mono", "JetBrains Mono", "Cascadia Code",
              Menlo, Consolas, "Roboto Mono", monospace;
```

**Type scale** — perfect-fourth ratio, 1.333:

| Role | Size | Line-height | Weight | Tracking | Use |
|------|------|-------------|--------|----------|-----|
| `--type-display`   | clamp(3.0rem, 8vw, 5.625rem) | 1.02 | 600 | -0.025em | Hero only |
| `--type-headline`  | clamp(2.0rem, 5vw, 3.0rem)   | 1.08 | 600 | -0.02em  | Section heads |
| `--type-title`     | 1.5rem  | 1.25 | 600 | -0.01em | Sub-section |
| `--type-lede`      | clamp(1.125rem, 2vw, 1.25rem) | 1.55 | 400 | -0.005em | Hero sub, lede paragraphs |
| `--type-body`      | 1.0rem  | 1.65 | 400 | -0.003em | Body |
| `--type-small`     | 0.875rem | 1.55 | 400 | 0 | Captions |
| `--type-label`     | 0.75rem | 1.4  | 500 | 0.08em uppercase | Eyebrow tags (mono) |
| `--type-meta`      | 0.75rem | 1.4  | 400 | 0 | Meta, footnotes (mono) |

**Editorial controls in use**:
- `font-variant-numeric: tabular-nums` on all numbers in process steps, pricing, frame counts.
- `font-feature-settings: "ss01", "cv11"` on Inter-equivalent system fonts where supported.
- `hanging-punctuation: first last` on body paragraphs (Safari).
- `text-wrap: balance` on every headline.
- `text-wrap: pretty` on body paragraphs.

## 5. Information architecture (final)

Sticky 64px slim nav on desktop with 6 anchor links. Sticky bottom CTA bar on mobile (no top nav).

Sections, top to bottom:

| # | Section | ID | Purpose | Animation cue |
|---|---------|-----|---------|---------------|
| 1 | Hero | `#top`   | Pain-mirror headline + primary CTA + the brass hairline | 4-layer entrance |
| 2 | Problem | `#problem` | "If any of these sound familiar" — 3 recognition cards | Stagger reveal on enter |
| 3 | What you get | `#what-you-get` | Bento of 5 audit deliverables | Numerical count-in on outcomes |
| 4 | Proof | `#proof` | One numeric before/after, one quote (placeholder until real ones exist) | Number scrub on scroll |
| 5 | Process | `#process` | 4-step timeline with day numbers | Hairline rule draws as you scroll into step |
| 6 | Free mini-audit (lead magnet + form) | `#checklist` | 48-hour async mini-audit offer | Form fields hairline-pulse on focus |
| 7 | Pricing | `#pricing` | Fixed price, reassurance line directly below | Brass underline reveals under CTA |
| 8 | FAQ | `#faq`   | 6 native `<details>` accordion | Native disclosure rotation |
| 9 | About | `#about` | Portrait + Flutter credentials | Portrait fade-in with grain overlay |
| 10 | Final CTA | `#book` | Repeat send-me-your-repo + reassurance microcopy | Brass underline echoes hero |

The form lives in **two places**: primary in §6 (catches engaged-but-undecided), echoed in §10. This is the CXL/MECLABS pattern.

The pricing reassurance line lives in **two places**: directly under the price in §7, and as microcopy under the §10 CTA button.

## 6. Animation doctrine

**Library**: Motion mini (`motion/mini`) — 2.6 KB gz, WAAPI-native, no React. Loaded as ES module, `import` only the verbs we use.

**Scroll-driven**: CSS-first via `animation-timeline: view()` and `scroll()`. Polyfill (`flackr/scroll-timeline`, ~15 KB) loaded ONLY when `!CSS.supports('animation-timeline: view()')`.

**Easing palette — exactly 4 named curves**:
```css
--ease-emphasized: cubic-bezier(0.05, 0.7, 0.1, 1.0);   /* Material 3 emphasized */
--ease-out-quart:  cubic-bezier(0.25, 1, 0.5, 1);
--ease-linear:     linear;                              /* scrub only */
--ease-spring:     linear(0, 0.009, 0.035 2.1%, 0.141 4.4%, 0.55 10.6%, 0.717 13.6%,
                          0.864, 1.005 20.1%, 1.063 22.3%, 1.094, 1.114, 1.123, 1.123,
                          1.117, 1.107 33.7%, 1.084 37.5%, 1.027 47%, 1.005 53%,
                          0.989 60%, 0.984 71%, 0.998 100%);
```

**Multi-layer orchestration rules**:
1. **Asymmetric durations** across layers. Foreground 220–320ms / mid 420–520ms / background 800–1400ms.
2. **Counter-motion**. When text rises Y+, hairlines expand X+. Nothing moves on the same axis at the same time on adjacent layers.
3. **Stagger by 60–80ms** between sibling reveals. Never the same time.
4. **No motion is decoration**. Every animation either signals causality, communicates structure, or rewards the scroll. If we can delete it and the page is no worse, we delete it.
5. **`prefers-reduced-motion`**: collapse all motion to opacity-only fades at 120ms. Hairline draws become instant. Same narrative, no vestibular triggers.

**Composite-only properties**: transform, opacity, filter. Never top/left/width/height. Never `box-shadow` animation (rasterizes — use `filter: drop-shadow` if shadow must animate, but ideally don't animate shadow at all).

**Perf budget per frame at 60Hz**: <3ms scripting, <8ms paint, total <16.7ms. Hero entrance is composite-only and budgets <0.5ms paint after first frame.

## 7. Stack & build

**Source**: hand-authored `index.html` with `<style>` inlined in `<head>` and `<script type="module">` for the ~1KB of animation orchestration. No bundler at runtime.

**Build pipeline** (Node script, ~80 LOC):
1. Lint HTML, format CSS, minify HTML + inline CSS.
2. Generate AVIF + WebP responsive variants of `nikita.png` at widths 400/640/960/1280.
3. Generate `og.png` (1200x630) and `twitter-card.png` (1200x600) from a static template (Sharp + raw composition).
4. Subset zero fonts (we ship system stack).
5. Brotli-precompress every output asset to `.br` (only used if served by Cloudflare).
6. Write `sitemap.xml`, `robots.txt`, `llms.txt`, `_headers` (CF Pages).

**Deploy target**: GitHub repo is private. Deploy via:
- (Primary) **Cloudflare Pages** connected to the repo — gets Brotli, Early Hints, HTTP/3, free.
- (Fallback) **GitHub Pages** — no Brotli, gzip only, but zero setup.

The README documents both paths.

## 8. Performance budget (committed, will be verified in P19/P20)

| Metric | Target | Stretch |
|--------|--------|---------|
| LCP (4G fast) | < 1.0s | < 0.6s |
| INP | < 50ms | < 30ms |
| CLS | 0 | 0 |
| Lighthouse Perf | 100 | 100 |
| Lighthouse Best Practices | 100 | 100 |
| Lighthouse Accessibility | 100 | 100 |
| Lighthouse SEO | 100 | 100 |
| Total initial transfer (text) | < 30 KB | < 20 KB |
| Total initial transfer (incl. LCP image) | < 80 KB | < 60 KB |
| Total page weight (full scroll) | < 250 KB | < 180 KB |
| JS shipped | < 4 KB gz | < 2 KB gz |
| Number of network requests (initial paint) | ≤ 3 | ≤ 2 (HTML + LCP image) |

## 9. SEO doctrine (P18 will implement)

- Primary keyword: `flutter app audit`. Secondary cluster: `flutter performance audit`, `flutter code review service`, `flutter app slow how to fix`, `hire flutter consultant`, `flutter app crash audit`.
- Title: `Flutter App Audit — Senior Engineer, Fixed Price, 5 Days` (60 chars).
- Description: 155 chars, mentions audit + Flutter + 5 days + fixed price + named outcomes.
- JSON-LD `@graph` of: `WebSite` (with `SearchAction`), `Person`, `Service` (with `OfferCatalog`), `WebPage` (with `speakable`), `FAQPage`, `BreadcrumbList`. Ships in one `<script>` tag.
- `<link rel="me">` to GitHub / LinkedIn / Stack Overflow (placeholders until user provides).
- `/llms.txt` written with curated AI-friendly summary.
- `<details open>` on the first FAQ to keep one answer in first paint.
- Visible "2026" in hero sub-tagline.

## 10. Lead magnet (final)

**The free 48-hour async mini-audit.** Prospect sends repo URL or describes a single symptom; gets back a one-page "top 3 things I'd fix first" within 48 hours. Form lives at §6 and §10.

This *replaces* a PDF/checklist lead magnet. The mini-audit IS the audit, in miniature. The form-fill is itself a qualification signal.

## 11. About-the-engineer block (bottom of page)

Goes at §9 — intentional "about-last" placement. Pattern: portrait left, copy right. Copy uses first-person, names the credibility-trigger keywords (debugging, performance, custom animations, shaders, vector_math_64) but frames each around what the *client* gets from that skill.

## 12. What this site will NOT have (anti-pattern shield)

- No scrolljacking, no scroll-hijacking, no fake-progress scroll bars.
- No marquee logo strip ("trusted by") at the top.
- No "Selected Works" with invented case studies.
- No "Contact for pricing" with no anchor (we publish a starting price).
- No countdowns, no fake scarcity, no "only 3 spots left this month".
- No phone field on the form.
- No AI-generated team headshots (real photo at the bottom).
- No "100% bug-free" or any overclaim.
- No removed focus outlines.
- No em-dash spam, no "in today's fast-paced world", no "—and that's where we come in".
- No glassmorphism cards, no neon glow, no gradient orbs, no Lottie hero, no parallax astronauts.
- No magnetic cursor, no tilt-on-hover, no oversized custom cursor.
- No popup, no exit-intent modal, no newsletter sign-up disguised as something else.

These are tracked from `.research/04-anti-patterns.md`. P21 (integral validator) verifies none of them slip in.

---

## What the next 3 challengers must do

- **P04** — destroy the brass-accent decision and the near-black-cool-tint decision specifically. Find the case where it fails.
- **P07** — destroy the hero headline "Your Flutter app shouldn't feel this slow." and the pricing-reassurance line specifically. Find the case where they backfire.
- **P09** — destroy the about-at-bottom IA decision and the dual form placement decision specifically. Find the scroll exit traps.

If any returns blood, this doctrine is revised before P10 scaffolds.
