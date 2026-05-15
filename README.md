# Flutter Audit Site

A single-page portfolio + sales page for a 3-day Flutter app audit for $500.

Hand-coded HTML/CSS/JS. No framework, no runtime, no tracker. Built as a deliberate counterweight to "agency template" portfolios: editorial near-black, system fonts, restrained motion, one champagne accent.

Targets:

| Metric | Result |
|--------|--------|
| Lighthouse Performance (mobile, simulated) | **100** |
| Lighthouse Accessibility (mobile)          | **100** |
| Lighthouse Best Practices                  | **100** |
| Lighthouse SEO                             | **100** |
| LCP                                        | **0.9 s** |
| TBT                                        | **0 ms** |
| CLS                                        | **0** |
| Total transfer (HTML + CSS + JS)           | **~14 KiB** (Brotli) |
| JS shipped                                 | **~1.6 KiB** |

## Run locally

```bash
npm install
npm run dev            # rebuild on change, serve at http://localhost:8080
npm run build          # one-shot build → ./public
npm run preview        # serve ./public without watching
```

The build:
1. Inlines every `src/styles/*.css` into a single `<style>` in `<head>`.
2. Inlines `src/scripts/motion.js` as a `<script type="module">` before `</body>`.
3. Generates AVIF + WebP responsive portrait variants (320/480/640/960/1280).
4. Minifies HTML, CSS, JS.
5. Brotli-precompresses text assets (quality 11) for Cloudflare Pages `.br` serving.
6. Emits `sitemap.xml`, `robots.txt`, `llms.txt`, `_headers`.

## Install the real portrait

The macOS sandbox blocks Claude Code from reading `~/Desktop` directly, so the photo step is a one-line script you run yourself:

```bash
./bin/install-photo.sh                  # reads ~/Desktop/nikita.png
./bin/install-photo.sh ~/path/photo.png # or pass a path
```

It copies the photo into `.research/`, then rebuilds — the build pipeline does the AVIF/WebP conversion automatically.

## Deploy

### Cloudflare Pages (recommended — Brotli + Early Hints + HTTP/3)

1. Push this repo to GitHub (private OK).
2. In Cloudflare → **Pages → Create project → Connect to Git**.
3. Build command: `npm run build`. Build output: `public`.
4. Add a custom domain in Pages settings.

`public/_headers` already configures security headers + cache policy.

### GitHub Pages (gzip only)

1. Repo → **Settings → Pages → Build and deployment → GitHub Actions**.
2. Use the canned **Static HTML** workflow but set source directory to `public`.
3. Run `npm run build` in CI, upload `public/`, deploy.

(GitHub Pages does not serve Brotli, only gzip. ~10–15% slower delivery than Cloudflare Pages.)

## Replace before going live

The build prints a CI guard warning for these. CI fails with `CI=1`.

- `src/index.html` — Formspree action URL still says `REPLACE_ME`. Either replace with your real Formspree endpoint or swap for a Cloudflare Worker / Resend handler.
- `tools/build.mjs` — `SITE.origin` is `https://flutteraudit.dev`. Change to the real domain.
- `src/index.html` — `<link rel="me">` to GitHub / LinkedIn / Stack Overflow are placeholders.
- The trust microcopy "Audits shipped to Series A through Series C teams" is a soft anchor that you can sharpen once you have specific case-permission.

## Where everything lives

```
src/
  index.html          ← the only page
  styles/             ← inlined in <head> at build time
    tokens.css        ← design tokens (OKLCH + spacing + easing)
    reset.css         ← modern reset
    typography.css    ← editorial typography
    layout.css        ← grid + spacing
    components.css    ← CTA, nav, form, FAQ, pricing, sticky CTA
    hero.css          ← 4-layer hero entrance
    sections.css      ← per-section refinements + inline magnet
    checklist.css     ← §3b 12-point checklist
    animations.css    ← scroll-driven CSS animations
  scripts/
    motion.js         ← nav reveal + form honeypot + IO fallback (~1.6 KiB)
  assets/
    portrait-placeholder.svg  ← shown until install-photo.sh is run
    grain.svg                 ← optional 2-3% noise overlay

tools/
  build.mjs           ← static-site build
  dev.mjs             ← dev server with gzip/Brotli for accurate metrics

bin/
  install-photo.sh    ← one-line manual step for the desktop photo

.research/            ← parallel-agent research outputs (kept for review)
.design/              ← doctrine + every challenger attack report
.copy/                ← draft + final committed copy
```

## License

All rights reserved.
