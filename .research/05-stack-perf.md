# 05 — Stack & Performance Research

**Project**: Single-page static portfolio site for a Flutter code audit offering.
**Date**: 2026-05-15
**Constraints**: Statically deployable (GitHub Pages or Cloudflare Pages), zero server runtime, ultra-low LCP, INP < 100 ms, CLS 0, total initial transfer under 50 KB ideal (excluding 1 hero image variant), Lighthouse 100/100/100/100.

---

## TL;DR — Final Recommendation

**Stack**: Hand-authored HTML + scoped CSS + tiny progressive-enhancement JS, built with `esbuild` (or no build at all), deployed to **Cloudflare Pages** (preferred over GitHub Pages for Brotli/zstd + Early Hints).

**Why not Astro / 11ty / Hugo / SvelteKit?** They all win for *multi-page* content sites. For a *single* page where the entire markup is hand-controlled, the framework overhead — even Astro's "0 JS" — only adds build complexity, prerender hydration directives we won't use, and a CSS/HTML output minifier we can reproduce in ~30 lines. Going framework-less gets us closest to "the HTML transferred is the HTML rendered."

**Projected byte budget (compressed transfer)**:

| Resource          | Compressed | Notes                                    |
|-------------------|------------|------------------------------------------|
| HTML (with inline critical CSS, inline LCP SVG/JSON-LD) | ~6–9 KB | Brotli-11 of ~25 KB raw |
| Font WOFF2 (1 weight, subset Latin) | ~12–16 KB | Inter or system stack — pick one |
| Deferred CSS (above-fold inlined; rest tiny) | ~1–2 KB | Most CSS lives in `<style>` head |
| JS (only if needed, dynamic island) | 0–2 KB | Theme toggle / contact reveal only |
| **Subtotal (no hero)** | **~20–28 KB** | Comfortably under 50 KB target |
| Hero image (1 AVIF variant + WebP fallback) | ~30–60 KB | Outside the 50 KB target as allowed |

**Projected metrics on a mid-tier 4G mobile**:
- **LCP**: 0.6–0.9 s (single-RTT critical path; preloaded hero with `fetchpriority="high"`).
- **INP**: < 50 ms (effectively no JS on the main thread; only listeners are passive).
- **CLS**: 0 (reserved hero box, font metric overrides, no late-loaded sections that change layout).
- **TBT**: 0 ms (no parse-blocking JS).
- **Lighthouse**: 100/100/100/100 is realistic and audited (see §13).

---

## 1. Static-Site Stack Shootout 2026

### 1.1 Frameworks compared

| Framework | JS shipped by default | Build speed | DX | Image pipeline | View transitions | Best for |
|---|---|---|---|---|---|---|
| **Astro 5/6** | 0 KB (zero-JS-by-default islands) | Slow (~4–7 min on 5K pages) | Excellent; MDX, components, integrations | Built-in `<Image/>` and `<Picture/>` with Sharp → AVIF/WebP, auto `srcset` and `sizes`, `priority` flag | First-class via `<ClientRouter/>` + native `@view-transition` | Content sites, blogs, docs |
| **Eleventy 3 + Vite** | 0 KB by default | Fast (20–100 pages/sec) | Config-light, Nunjucks/Liquid/JS templates | Plugin-based (`eleventy-img`) — manual but capable | Manual (add `@view-transition` CSS) | Truly minimal sites, blogs |
| **Hugo (Go)** | 0 KB | Fastest (5–10× anything Node) | YAML-heavy, templating with `{{ }}` | Native pipeline; WebP yes, AVIF only via external | Manual | High-volume content sites |
| **SvelteKit (adapter-static)** | Ships JS per route (router + hydration) by design | Fast | Excellent | `enhanced:img` via Vite plugin | Built-in (`onNavigate`) | Apps that happen to be static; not pure perf |
| **Nue.js** | Ultra-minimal | Milliseconds | New, content-first | Basic | Manual | Experimental — not yet a safe production bet for a portfolio |
| **Marko 6** | Fine-grained streaming (smallest dynamic) | Fast | Steeper; mostly e-commerce flagship | None first-class | Manual | Streaming SSR e-commerce; overkill here |
| **Vanilla + esbuild / bun build** | Whatever you write | Sub-second | Full control, no abstractions | DIY (sharp CLI, squoosh, or manual) | Native CSS only | Single-page sites where every byte matters |

### 1.2 Key takeaways
- For sites with > 5 pages, Astro is the default winner in 2026: zero-JS HTML output, islands, Sharp-based image pipeline, native View Transitions support.
- For a **single hand-crafted page**, the framework adds steps but does not subtract bytes you wouldn't have already cut. Vanilla wins on bytes; Astro wins on developer affordances (CSS scoping, components, asset hashing, layout primitives).
- Hugo is unbeatable for build speed but its templating tax for a one-page site is not worth it.
- 11ty is the conservative middle ground if we want a build tool that still produces zero-JS HTML out of the box, and to get image plumbing handled.

### 1.3 Decision matrix for this project

A single-page portfolio that brokers a Flutter code audit service has **at most**:
- A hero with H1 + sub + CTA
- 1 hero image / SVG
- Sections: Services, Process, Examples, Pricing, FAQ, Contact
- Maybe one interactive widget (dark-mode toggle, mailto reveal, anchor scroll)

A static `index.html` is literally the right shape. We have no reason to ship a build framework's bootloader.

**Choice**: Vanilla HTML + CSS + minimal JS. Use `esbuild` only to bundle/minify the JS island if we end up writing one; otherwise no build at all.

If the audit grows into a multi-section content site later, the migration path to Astro is trivial (the existing HTML becomes the layout's `<slot/>`).

---

## 2. Astro Specifics (kept for the migration story)

### 2.1 Islands architecture
- Render every component to plain HTML at build; ship JS *only* for components marked with a `client:*` directive.
- Hydration is **per-island** — multiple islands hydrate in parallel; static markup between them is inert.

### 2.2 `client:*` directives — when to use what
| Directive | When |
|---|---|
| `client:load` | Critical immediate interactivity (rare). Hydrates ASAP after parse. |
| `client:idle` | Default for non-critical UI; hydrates during `requestIdleCallback`. |
| `client:visible` | Anything below the fold — defers JS until in viewport. **Best for perf**. |
| `client:media` | Conditional, e.g. only hydrate above some breakpoint. |
| `client:only="react"` | Skips SSR entirely. **Avoid unless required** — leaves a flash of empty markup; loses LCP element. |

### 2.3 Image optimization
- `<Image/>` and `<Picture/>` import from `astro:assets`, backed by Sharp by default (Squoosh or custom service optional).
- `formats={['avif','webp']}` produces a `<picture>` with `<source>` tags + a fallback `<img>`.
- `layout="constrained" | "full-width" | "fixed"` auto-generates `srcset` + `sizes`.
- `priority` attribute applies `fetchpriority="high"` and `loading="eager"`.
- Setting `widths={[400, 800, 1200, 1600]}` and a `sizes="(max-width: 768px) 100vw, 800px"` is the canonical responsive pattern.

### 2.4 CSS scoping
- `<style>` in a `.astro` file is automatically scoped via a data attribute → no global leakage, no specificity wars.
- `<style is:global>` for app-wide layers.
- `<style is:inline>` to render verbatim — useful for critical CSS that must be in the document head and not extracted.

### 2.5 Partial hydration cost
- Each island ships its component code + its framework runtime (React: ~40 KB gzip; Preact: ~3 KB; Svelte: minimal compiled bytes; SolidJS: ~7 KB).
- Use **Preact** or **Solid** (or no framework) where any island is required. Avoid React for islands on a perf-critical page.

---

## 3. Image Strategy 2026

### 3.1 Format winners

| Use case | Format | Why |
|---|---|---|
| Photographs, hero, portraits | **AVIF** primary + WebP fallback in `<picture>` | AVIF compresses 20–50% better than WebP for natural images at the same perceived quality. |
| Small images (< 10 KB target), icons, UI thumbnails | **WebP** (or PNG/SVG) | AVIF's header overhead and slow encoder erase the savings on tiny assets. |
| Icons, simple shapes | **Inline SVG** | Smallest, scalable, themable via `currentColor`. |
| Animation | **Animated WebP** | Animated AVIF tooling is still immature in 2026. |
| Diagrams / line art | **SVG** or **WebP lossless** | AVIF lossless is large; PNG often wins for screenshots. |

**JPEG XL**: Safari supports it (since 17, partial — no animation, no progressive). Chrome 145 (Feb 2026) ships behind a flag; default-on expected H2 2026. *Not safe to rely on yet*. Treat as a future experiment.

### 3.2 Responsive delivery — the canonical pattern

```html
<picture>
  <source
    type="image/avif"
    srcset="hero-400.avif 400w, hero-800.avif 800w, hero-1200.avif 1200w"
    sizes="(max-width: 768px) 100vw, 800px">
  <source
    type="image/webp"
    srcset="hero-400.webp 400w, hero-800.webp 800w, hero-1200.webp 1200w"
    sizes="(max-width: 768px) 100vw, 800px">
  <img
    src="hero-800.jpg"
    alt="Flutter audit hero"
    width="1200"
    height="900"
    fetchpriority="high"
    decoding="async"
    loading="eager">
</picture>
```

For below-the-fold media use `loading="lazy"` and drop `fetchpriority="high"`.

### 3.3 Placeholders — LQIP vs BlurHash vs ThumbHash

| Tech | Size | JS needed? | Color fidelity | Recommendation |
|---|---|---|---|---|
| LQIP (tiny inline base64) | ~150–400 B | No | Highest | Use when bytes allow; SVG-wrapped + blur filter |
| BlurHash | 34 B + ~1.2 KB runtime | Yes | Good | Skip — JS runtime defeats the purpose for a single image |
| ThumbHash | 28 B + small runtime | Yes | Better than BlurHash, supports alpha | Skip for the same reason |

**Choice**: A single low-byte LQIP (or just a solid `background-color: var(--hero-tint)` on the wrapper with reserved aspect-ratio box) is best for a one-image page. A 12–16 KB hero AVIF will arrive in one RTT anyway.

### 3.4 LCP-image best practices (single rule list)
1. Hard-code `width` + `height` on `<img>` → CLS 0.
2. `fetchpriority="high"`, `loading="eager"`, `decoding="async"`.
3. Add `<link rel="preload" as="image" href="…800.avif" imagesrcset="…" imagesizes="…" fetchpriority="high">` in `<head>` — saves ~200–600 ms on LCP.
4. **Never** lazy-load the LCP element. Most common Lighthouse mistake.

### 3.5 Aspect-ratio reservation

```css
.hero-img {
  aspect-ratio: 4 / 3;
  width: 100%;
  height: auto;
  background: #0b0b0b; /* dominant color */
}
```

---

## 4. Font Strategy

### 4.1 The rules
1. **Self-host**. Google Fonts adds a DNS + TLS + 1 extra hop; self-hosting wins 15–30% on font metrics, eliminates third-party tracking, satisfies GDPR. Use Fontsource (NPM packages) or directly download from Google Fonts and serve as static asset.
2. **Use WOFF2 only**. Every browser that supports variable fonts supports WOFF2. (~30% smaller than WOFF.)
3. **Subset aggressively**. `glyphhanger` or `pyftsubset` (fonttools) over your built HTML; output WOFF2 with Brotli. Latin subset alone typically cuts variable-font WOFF2 from ~150 KB → ~16–25 KB. The `subset-font` NPM package is good for build-time scripts.
4. **Ship one file**. Variable font, one axis range (wght 400–700), one style (Roman). 12–16 KB compressed is realistic for ASCII-only Latin.
5. **Preload it**: `<link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>`.

### 4.2 `font-display`
- **`swap`**: text visible immediately; replaces with web font when ready. **The default for body and headings.** Will FOUT but with metric matching → 0 CLS.
- **`optional`**: only swaps if cached or arrives in ~100 ms; otherwise fallback for the whole visit. Safe for body copy on flaky connections; users on first visit get the fallback.
- **`block`**: never use; FOIT.

### 4.3 Zero-CLS fallback recipe (the trick that makes swap free)

Use the `size-adjust`, `ascent-override`, `descent-override`, `line-gap-override` descriptors on a *fallback* `@font-face` so the fallback paints at the exact metrics of the web font, then swaps with no shift.

```css
@font-face {
  font-family: "InterFallback";
  src: local("Arial");
  size-adjust: 107.4%;
  ascent-override: 90%;
  descent-override: 22%;
  line-gap-override: 0%;
}

:root {
  font-family: "Inter", "InterFallback", system-ui, sans-serif;
}
```

Generate exact values with the **Fontaine** CLI or **Capsize** library; both compute the metric overrides from any font file.

### 4.4 Smallest option: skip web fonts entirely
```css
:root {
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  font-family-mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
}
```
0 KB font transfer, 0 ms font CPU, automatic dark mode handling, no CLS. **The most defensible choice for a perf-led portfolio**.

---

## 5. Critical CSS

### 5.1 Strategy
- **Inline above-the-fold styles** in `<style>` in `<head>`.
- **Defer or remove non-critical CSS**. For a single-page site, all CSS *is* critical because the user will scroll the whole page; in that case just minify and inline the lot.
- If we do extract, **Beasties** (maintained fork of Critters, by danielroe) is the right tool — no headless browser, fast, integrates with Astro via `astro-critical-css` or `astro-critters`. Penthouse uses Puppeteer (slow); skip.

### 5.2 Cascade hygiene with `@layer`

```css
@layer reset, tokens, base, layout, components, utilities, overrides;

@layer tokens {
  :root { --color-bg: #0b0b0b; --color-fg: #f5f5f5; /* … */ }
}
@layer base   { html, body { /* … */ } }
@layer layout { .container { /* … */ } }
```

96%+ global browser support; browsers without `@layer` still receive the rules (specificity falls back to source order). Use for predictability, not as a perf feature.

### 5.3 For this project
Inline 100% of CSS in `<style>` in `<head>` — it should be well under 5 KB compressed. No external CSS request → one less RTT.

---

## 6. JavaScript Strategy

### 6.1 The hierarchy of restraint

1. **Ship zero JS** if at all possible.
2. **HTML-only interactions** — `<details>` for FAQ, `:has()` and `:checked` for menus and theme toggles, `<dialog>` for modals, `popover` attribute (Baseline 2026), CSS scroll-snap for galleries.
3. If JS is required, **`<script type="module" defer>`** and inline-bundle the minimal source directly into HTML (`<script type="module">…</script>`) when it's < 1 KB; otherwise an external `.mjs` with `<link rel="modulepreload">`.
4. **Dynamic `import()` on idle/visible** for any optional widget — wrap with `requestIdleCallback` or `IntersectionObserver`.

### 6.2 Loading attribute matrix

| Pattern | Use |
|---|---|
| `<script type="module" defer>` | Anything modern; defers without blocking parse, runs in order after DOM. |
| `<script async>` | Independent, side-effect-only (analytics). Order non-deterministic. |
| `<link rel="modulepreload" href="…">` | When the JS *is* parse-blocking but you need it ready early. Prewarms parsing + dep graph. |
| `<link rel="preload" as="script">` | Last resort — non-module scripts only. |

### 6.3 Speculation Rules API for instant nav (if we ever split pages)

```html
<script type="speculationrules">
{
  "prerender": [{
    "where": { "href_matches": "/*" },
    "eagerness": "moderate"
  }]
}
</script>
```
- Chrome 144+ (Jan 2026): prerender pauses JS at first blocking script, still preloads CSS/images/fonts.
- Chrome 144 mobile: triggers 50 ms after a link enters the viewport.
- Limits: moderate eagerness → 2 prefetches + 2 prerenders concurrent (FIFO).
- Single-page site: not needed. Keep in pocket for future.

### 6.4 For this project
Inline ~500 B of JS if any (theme toggle persisting to `localStorage`, anchor offset). Total JS payload target: < 1 KB compressed.

---

## 7. Network — Hosting, Compression, Hints

### 7.1 Hosting comparison

| Capability | GitHub Pages | Cloudflare Pages |
|---|---|---|
| HTTP/3 | Yes (via Fastly) | Yes |
| Brotli | **No** — gzip only | Yes (level 4 default; level 11 served from origin via pre-compressed assets) |
| Zstandard | No | Yes (preferred by Cloudflare's compression order: zstd > br > gzip) |
| Early Hints (103) | No | Yes (`_headers` file in Pages) |
| Compression Rules (per-path) | No | Yes |
| Per-route custom headers | Limited | Yes via `_headers` |
| Free TLS, custom domain | Yes | Yes |
| HTTP/2 push | Deprecated everywhere | n/a |
| Build pre-compressed `.br` / `.zst` | n/a | Yes |

**Choice: Cloudflare Pages.** Brotli on text assets adds an immediate ~20% transfer reduction vs gzip on a site this small (HTML/CSS/JS). Plus Early Hints support gives us a free RTT-saving prefetch path.

### 7.2 Brotli vs zstd for static assets in 2026
- Brotli wins ~3% smaller on long-cached static text assets versus zstd at the same level. (Brotli's static dictionary is tuned for web text.)
- Zstandard wins on encode speed and ~11% better than gzip with comparable speed; preferred for dynamic / uncached content.
- **For this site**: build assets pre-compressed at **Brotli level 11** (`brotli -q 11`); ship `.br` files alongside originals. Cloudflare Pages will serve them automatically.

### 7.3 Headers we will set (via `_headers` on Cloudflare Pages)
```
/*
  Cache-Control: public, max-age=0, must-revalidate
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: interest-cohort=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/fonts/*
  Cache-Control: public, max-age=31536000, immutable
  Access-Control-Allow-Origin: *
```

### 7.4 Early Hints (103)
Cloudflare Pages automatically caches the `<link>` preload/preconnect headers from the 200 response and re-emits them as 103 Early Hints for subsequent requests. We just write the preloads in `<head>`; Cloudflare's edge takes care of the 103. Free.

### 7.5 Server-Timing
For lab/field measurement, can be emitted from a tiny Cloudflare Pages Function. Not strictly required for a static site, but nice for tracking edge cache hits and origin pull. Pages now emits `Server-Timing: cfWorker;dur=…` automatically (Feb 2026).

---

## 8. Lighthouse 2026 — Scoring Reality

### 8.1 Thresholds (Core Web Vitals, 75th percentile field)
| Metric | Good | Needs improvement | Poor |
|---|---|---|---|
| LCP | ≤ 2.5 s | ≤ 4.0 s | > 4.0 s |
| **INP** | ≤ 200 ms | ≤ 500 ms | > 500 ms |
| CLS | ≤ 0.1 | ≤ 0.25 | > 0.25 |

Our project targets are much stricter: **LCP < 1 s lab, INP < 100 ms, CLS exactly 0**.

### 8.2 Gotchas
1. **Lighthouse can't measure INP**. It estimates from Total Blocking Time + long tasks during load. To "pass" INP in Lighthouse, drive TBT → 0 ms.
2. **Lab vs field**. Lighthouse runs on a simulated Moto G4 + Slow 4G. Real users on iPhones get faster scores; users on slow Android in low-end markets get worse. Test on real devices for INP.
3. **75th percentile** for CWV in Search Console — average is not enough.
4. **LCP element gotchas**: lazy-loading the hero is the #1 mistake. Also: invisible text during webfont load can count as the LCP element and tank the score.
5. **CLS gotchas**: ads, embeds, web font swap without metric overrides, images without dimensions, late-injected banners.
6. **Treemap** (Lighthouse → Treemap link) shows unused bytes per script — useful for islands hygiene.

### 8.3 Best-practices score
Reach 100 by: HTTPS-only, no console errors, no deprecated APIs, no mixed content, valid `<meta charset>` and `<meta viewport>`, no `unload` event handler, image elements with explicit dimensions.

### 8.4 SEO score
Reach 100 with: a single `<h1>`, valid `<title>` ≤ 60 chars, `<meta name="description">` 140–160 chars, `<html lang="en">`, all links with text, all images with `alt`, robots-friendly (no accidental `noindex`).

### 8.5 Accessibility score
Reach 100 with: semantic landmarks (`<header>`, `<main>`, `<footer>`, `<nav>`), color contrast ≥ 4.5:1 body / 3:1 large, focus styles visible, form labels, ARIA only where native HTML can't express.

---

## 9. Micro-Optimizations

| Technique | Use here? | Notes |
|---|---|---|
| `loading="lazy"` on below-fold images | Yes | Default for non-hero. |
| `decoding="async"` on all `<img>` | Yes | Costs nothing, helps a bit. |
| `content-visibility: auto` on long sections | Optional | For below-fold sections — pair with `contain-intrinsic-size`. Helps style/layout/paint metrics. Don't apply to the LCP region. |
| `contain-intrinsic-size: auto 800px;` | Yes | Reserves height for skipped sections to prevent scroll jumps. |
| `<link rel="preload" as="image">` for LCP | Yes | + `imagesrcset` + `imagesizes` + `fetchpriority="high"`. |
| `<link rel="preconnect">` to third parties | Avoid | No third parties planned. |
| `meta http-equiv="x-dns-prefetch-control" content="on"` | n/a | Same — no externals. |
| Speculation Rules `prerender` | Skip for now | Single page. |
| View Transitions API (cross-document) | Skip | Single page. |
| `aspect-ratio` on every media element | Yes | Replaces `width`/`height` placeholders; pairs with images that have dimensions set. |
| `prefers-reduced-motion` media query | Yes | Disable any animations. |
| `prefers-color-scheme` | Yes | Auto dark mode without JS. |

---

## 10. View Transitions — Single-Page Implications

Since we have one page, **cross-document view transitions are not needed**. We can still use `document.startViewTransition()` for *same-document* state changes (e.g. toggling a tab) — supported in Chrome 111+, Edge 111+, Safari 18+, Firefox 133+. Costs 0 bytes; just CSS + a 5-line JS wrapper.

```html
<style>
  @view-transition { navigation: auto; } /* harmless on SPA */
  .panel { view-transition-name: panel; }
</style>
```

---

## 11. Build Pipeline (vanilla path)

```
/site
  /src
    index.html          ← hand-authored; CSS inlined; <script> inlined or modulepreloaded
    /assets
      hero.jpg          ← source
    /fonts
      Inter-Var.woff2   ← subsetted source (optional)
  build.mjs             ← ~50 LOC: image variants + Brotli pre-compress
  /dist                 ← what Cloudflare Pages publishes
```

`build.mjs` responsibilities:
1. Read `index.html`, run through `html-minifier-terser` (preserves data attributes, removes comments).
2. Run `sharp` to emit `hero-{400,800,1200}.{avif,webp}` from `hero.jpg`.
3. (If shipping web fonts) run `subset-font` over `Inter-Var.woff2` to ASCII subset.
4. Pre-compress all text assets: write `.br` (Brotli q=11) and `.zst` siblings.
5. Write `_headers` for Cloudflare Pages.

Run: `node build.mjs`. No frameworks, no plugins, deterministic, ~ < 2 s clean build.

---

## 12. Final Byte Budget Breakdown

### 12.1 Minimum viable (system fonts, no web font)
| File | Raw | Brotli-11 | Notes |
|---|---|---|---|
| `index.html` (incl. inline CSS, inline JS, JSON-LD) | ~22 KB | ~6 KB | Most of the work happens here |
| Hero AVIF (800w, primary src) | ~36 KB | — | Outside the 50 KB budget by allowance |
| Hero WebP (800w, fallback) | ~48 KB | — | Only fetched if no AVIF support (~5% of users) |
| **Total above-the-fold transfer** | **~58 KB** | **~42 KB** | LCP-eligible bytes only |

### 12.2 With one self-hosted variable font (Inter Latin subset)
| File | Raw | Brotli-11 |
|---|---|---|
| `index.html` | ~22 KB | ~6 KB |
| `inter-var-subset.woff2` (already Brotli-internal) | ~16 KB | ~16 KB |
| Hero AVIF 800w | ~36 KB | — |
| **Total** | **~74 KB** | **~58 KB** |

Web font option pushes us slightly over 50 KB *including the hero image*. **Recommendation: ship system fonts** unless brand identity demands otherwise.

### 12.3 Hero variants generated
- 400w AVIF (~14 KB), 800w AVIF (~36 KB), 1200w AVIF (~62 KB)
- 400w WebP (~22 KB), 800w WebP (~48 KB), 1200w WebP (~82 KB)
- Single JPG fallback (1200w, ~110 KB) only for ancient browsers

---

## 13. Lighthouse 100/100/100/100 Audit Checklist (apply to repo)

### Performance
- [ ] LCP element is the hero `<img>`, dimensions set, `fetchpriority="high"`, preloaded with `imagesrcset`.
- [ ] No render-blocking JS (`type="module" defer` or inlined).
- [ ] No render-blocking CSS (all in `<style>` in `<head>`).
- [ ] Total transfer above the fold < 50 KB excluding image.
- [ ] Font (if used) preloaded, subset, `font-display: swap`, fallback metric-matched.
- [ ] All images: `width`/`height` + `aspect-ratio` reserved → CLS = 0.
- [ ] `decoding="async"` on every `<img>`.
- [ ] `loading="lazy"` on below-fold images.
- [ ] No long task > 50 ms during load → TBT 0.

### Accessibility
- [ ] Semantic landmarks (`header`, `main`, `nav`, `footer`).
- [ ] Color contrast ≥ 4.5 (text) / 3 (large).
- [ ] Visible focus states on every interactive element.
- [ ] `<html lang="en">`.
- [ ] All `<img>` have `alt`; decorative images use `alt=""` or `role="presentation"`.
- [ ] All form controls have `<label>` or `aria-label`.
- [ ] `prefers-reduced-motion` respected.

### Best Practices
- [ ] HTTPS-only (Cloudflare Pages default).
- [ ] No console errors, no deprecated APIs.
- [ ] `<meta charset="utf-8">` and `<meta name="viewport" content="width=device-width, initial-scale=1">`.
- [ ] No mixed content.
- [ ] CSP via `_headers`: `Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self';` (adjust for inline `<script>`).
- [ ] No vulnerable libraries (we ship none).

### SEO
- [ ] `<title>` 50–60 chars.
- [ ] `<meta name="description">` 140–160 chars.
- [ ] `<html lang="en">`.
- [ ] Single `<h1>`; logical heading order.
- [ ] All anchors have descriptive text.
- [ ] `robots.txt` and sitemap.xml present.
- [ ] OpenGraph + Twitter card meta.
- [ ] JSON-LD `Service` schema for the audit offering.
- [ ] Canonical link.

---

## 14. Open Questions / Future Decisions

1. **Will we want a blog or case-study section later?** If yes, port to Astro 5 before content reaches > 3 pages — keeps DX sane.
2. **Brand font?** If a custom font is required for identity, subset to single weight + Latin and accept the ~16 KB.
3. **Email contact**: form (needs an endpoint) vs `mailto:` (zero JS). Default to `mailto:` for v1.
4. **Analytics**: Cloudflare Web Analytics (no JS bytes from us; CF injects on request). Avoid Google Analytics — adds ~50 KB + main-thread cost.

---

## 15. Recommended Stack — One-Liner

> **Hand-authored static HTML/CSS (system fonts, single AVIF hero with WebP fallback, inline critical CSS, ~500 B optional ES-module JS), built via `esbuild`/`sharp`/`brotli` in a 50-LOC Node script, deployed to Cloudflare Pages with Brotli-11 pre-compression, Early Hints, and immutable cache headers.**

---

## Sources

- [Astro vs Eleventy vs Hugo vs Jekyll vs Gatsby in 2026](https://gautamkhorana.com/blog/static-site-generators-2026-astro-eleventy-hugo-jekyll-gatsby/)
- [Astro vs SvelteKit: Static-First vs App-First in 2026 — PkgPulse](https://www.pkgpulse.com/blog/astro-vs-sveltekit-2026)
- [Astro 5.0 release notes](https://astro.build/blog/astro-5/)
- [Astro 5.0 Tutorial: Zero-JavaScript Framework Guide (2026) — byteiota](https://byteiota.com/astro-zero-javascript-framework/)
- [Astro 6 in 2026: 100 Core Web Vitals, 90% Less JS](https://www.oscargallegoruiz.com/en/blog/introduction-astro-5/)
- [Islands architecture — Astro Docs](https://docs.astro.build/en/concepts/islands/)
- [Image and Assets API Reference — Astro Docs](https://docs.astro.build/en/reference/modules/astro-assets/)
- [Eleventy + Vite docs](https://www.11ty.dev/docs/server-vite/)
- [11ty and Vite for modern static websites — benswift.me](https://benswift.me/blog/2025/11/24/11ty-and-vite-for-modern-static-websites/)
- [Nue.js docs — Performance optimization](https://nuejs.org/docs/performance-optimization.html)
- [Hugo Image Processing — gohugo.io](https://gohugo.io/content-management/image-processing/)
- [WebP or AVIF for Web Performance? 2026 Benchmark — Pixotter](https://pixotter.com/blog/webp-vs-avif/)
- [AVIF vs WebP in 2026: when to use each — Wux Webtools](https://wuxwebtools.com/en/blog/image-formats-in-2026-when-avif-beats-webp-and-when-it-does-not)
- [ThumbHash — A better compact image placeholder hash](https://evanw.github.io/thumbhash/)
- [A clear look at blurry image placeholders on the web — Mux](https://www.mux.com/blog/blurry-image-placeholders-on-the-web)
- [Optimize Resource Loading: The fetchpriority=high Attribute — DebugBear](https://www.debugbear.com/blog/fetchpriority-attribute)
- [Optimize Largest Contentful Paint — web.dev](https://web.dev/articles/optimize-lcp)
- [Fix your website's LCP by optimizing image loading — MDN](https://developer.mozilla.org/en-US/blog/fix-image-lcp/)
- [Lazy Loading Best Practices For LCP Images In 2026 — webgaro](https://webgaro.com/blog/lazy-loading-best-practices-for-lcp-images/)
- [Glyphhanger — Stefan Judis](https://www.stefanjudis.com/notes/glyphhanger-a-tool-subset-and-optimize-fonts/)
- [How to use variable fonts in the real world — Clearleft](https://clearleft.com/thinking/how-to-use-variable-fonts-in-the-real-world/)
- [Fixing Layout Shifts Caused by Web Fonts — DebugBear](https://www.debugbear.com/blog/web-font-layout-shift)
- [Framework tools for font fallbacks — Chrome for Developers](https://developer.chrome.com/blog/framework-tools-font-fallback/)
- [Self host Google fonts for better Core Web Vitals — corewebvitals.io](https://www.corewebvitals.io/pagespeed/self-host-google-fonts)
- [Fontsource — Introduction](https://fontsource.org/docs/getting-started/introduction)
- [Beasties — GitHub (danielroe)](https://github.com/danielroe/beasties)
- [astro-critical-css — GitHub](https://github.com/rumaan/astro-critical-css)
- [Astro Styling docs](https://docs.astro.build/en/guides/styling/)
- [CSS @layer (Cascade Layers): The Complete Guide for 2026 — DevToolbox](https://devtoolbox.dedyn.io/blog/css-cascade-layers-complete-guide)
- [Speculation Rules API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Speculation_Rules_API)
- [Prerender pages in Chrome — Chrome for Developers](https://developer.chrome.com/docs/web-platform/prerender-pages)
- [View Transition API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)
- [Cross-document view transitions — Chrome for Developers](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document)
- [View transitions — Astro Docs](https://docs.astro.build/en/guides/view-transitions/)
- [GitHub Pages — Brotli discussion](https://github.com/orgs/community/discussions/21655)
- [Content compression — Cloudflare Speed docs](https://developers.cloudflare.com/speed/optimization/content/compression/)
- [Early Hints — Cloudflare Pages docs](https://developers.cloudflare.com/pages/configuration/early-hints/)
- [Cloudflare Pages gets even faster with Early Hints](https://blog.cloudflare.com/early-hints-on-cloudflare-pages/)
- [Server-Timing header — MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Server-Timing)
- [New cfWorker metric in Server-Timing — Cloudflare changelog](https://developers.cloudflare.com/changelog/post/2026-02-18-cfworker-server-timing/)
- [What Are the Core Web Vitals? LCP, INP & CLS Explained (2026)](https://www.corewebvitals.io/core-web-vitals)
- [Core Web Vitals in 2026: The Practical Fixes — DEV](https://dev.to/benriemer/core-web-vitals-in-2026-the-practical-fixes-for-inp-lcp-and-cls-that-actually-work-4ef0)
- [content-visibility CSS property — web.dev](https://web.dev/articles/content-visibility)
- [contain-intrinsic-size — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/contain-intrinsic-size)
- [JPEG XL Is Back in Chrome (2026) — PhotoFormatLab](https://www.photoformatlab.com/blog/jpeg-xl-chrome-browser-support-2026)
- [JPEG XL — Can I use](https://caniuse.com/jpegxl)
- [esbuild docs](https://esbuild.github.io/)
- [The Bun Bundler](https://bun.com/blog/bun-bundler)
- [rel="modulepreload" — MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/modulepreload)
