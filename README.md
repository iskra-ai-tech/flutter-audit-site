# Flutter Audit Site

A single-page portfolio + sales page for a 3-day Flutter app audit for $500. Lives at **https://flutteraudit.com**.

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

Production lives on **Cloudflare Pages** at `https://flutteraudit.com`. The build is pre-tuned for it: `public/_headers` is CF Pages-native syntax, every text asset is Brotli-precompressed at q=11 so the edge can serve `.br` directly, and the domain is already on Cloudflare nameservers so DNS is wired automatically when the custom domain is bound.

### One-time setup — dashboard (recommended)

1. **Cloudflare → Workers & Pages → Create → Pages → Connect to Git** → authorize Cloudflare to read this GitHub repo (one-time).
2. **Project name:** `flutteraudit` (or any slug — only affects the `*.pages.dev` staging URL).
3. **Production branch:** `main`. **Build command:** `npm run build`. **Build output:** `public`. **Root directory:** *(blank)*.
4. **Environment variable:** `SITE_ORIGIN=https://flutteraudit.com` — drives canonical/OG/sitemap URLs.
5. Deploy. Then **Custom domains → Set up custom domain → `flutteraudit.com`**. CF auto-creates the CNAME flattening on the same zone — no DNS edits in another tab.

Repeat after first deploy: every push to `main` triggers an automatic deploy.

### Alternative — Wrangler CLI (one-shot deploys)

```bash
npm install -g wrangler
wrangler login                                          # opens browser, one time
npm run build                                           # → public/
wrangler pages deploy public --project-name=flutteraudit
```

After the first CLI deploy, bind the custom domain in the dashboard (the CLI doesn't expose a custom-domains command).

### What the edge does for free on CF Pages

- Brotli serving of `*.html.br` / `*.txt.br` / `*.xml.br` (the build emits these).
- HTTP/3 + 0-RTT.
- Edge cache honoring `_headers` `Cache-Control` (immutable for `/assets/*`).
- Auto Let's Encrypt cert + Universal SSL.
- Early Hints when enabled in the Pages project settings.

## Replace before going live

The build prints a CI guard warning for these. CI fails with `CI=1`.

- `src/index.html` — Formspree action URL still says `REPLACE_ME`. Either replace with your real Formspree endpoint or swap for a Cloudflare Worker / Resend handler.
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
