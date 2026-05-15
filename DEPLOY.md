# Deploy

Two paths. Cloudflare Pages is faster and free; GitHub Pages is zero-config.

## Cloudflare Pages (recommended)

Why: Brotli compression (10–15% smaller payload than gzip), free Early Hints (103) on `_headers`, HTTP/3 by default, Workers if you ever need server logic.

1. Push the repo to GitHub (private is fine).
2. dash.cloudflare.com → **Pages → Create application → Connect to Git → Select repo**.
3. Build settings:
   - Production branch: `main`
   - Build command: `npm run build`
   - Build output directory: `public`
   - Root directory: `/` (default)
   - Environment variables: `CI=1` (so the build guard fails on `REPLACE_ME`)
4. **Save and Deploy**. First deploy ~30 seconds.
5. Add a custom domain under **Pages → Settings → Custom domains**.

CF picks up `public/_headers` automatically — no further configuration.

## GitHub Pages (zero-config fallback)

Create `.github/workflows/pages.yml`:

```yaml
name: pages
on:
  push: { branches: [main] }
permissions: { contents: read, pages: write, id-token: write }
concurrency: { group: pages, cancel-in-progress: true }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm install
      - run: CI=1 npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: public }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: { name: github-pages, url: ${{ steps.d.outputs.page_url }} }
    steps:
      - id: d
        uses: actions/deploy-pages@v4
```

Then **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Pre-flight before going live

```bash
# Replace the Formspree placeholder
sed -i '' 's|https://formspree.io/f/REPLACE_ME|https://formspree.io/f/YOUR_REAL_ID|' src/index.html

# Set the real domain
sed -i '' 's|https://flutteraudit.dev|https://YOUR_DOMAIN|' tools/build.mjs

# Set the real <link rel="me"> targets
sed -i '' 's|https://github.com/nikitakalaganov|https://github.com/YOUR_HANDLE|g' src/index.html

# Drop the real photo in
./bin/install-photo.sh ~/Desktop/nikita.png

# Rebuild with the CI guard enabled
CI=1 npm run build

# Lighthouse — should print 100/100/100/100
npm run dev &
CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  npx --yes lighthouse@12 http://localhost:8080/ \
  --quiet --chrome-flags="--headless=new --no-sandbox --disable-gpu" \
  --form-factor=mobile --throttling-method=simulate --preset=experimental
```

## Post-deploy: SEO seeding

1. Add the site to **Google Search Console** → submit `sitemap.xml`.
2. Add to **Bing Webmaster Tools** → import from GSC.
3. Optional: ping IndexNow:
   ```bash
   curl "https://api.indexnow.org/indexnow?url=https://YOUR_DOMAIN/&key=YOUR_INDEXNOW_KEY"
   ```
4. Verify `/llms.txt` is reachable; LLM crawlers will pick it up automatically.
5. After 7 days: branded query `"Nikita Kalaganov flutter"` should be #1 on Google.
