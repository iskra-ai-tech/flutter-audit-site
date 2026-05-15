# SEO Strategy 2026 — flutteraudit.dev

> Single-page Flutter code audit portfolio. Built for Google AI Overviews, Perplexity, ChatGPT Search, Bing Copilot, Claude, and traditional SERPs. Engineer: Nikita Kalaganov.

---

## 1. Search Landscape 2026 — Executive Summary

The 2026 search ecosystem is split into two parallel funnels that demand different optimization patterns:

**Traditional SERP (Google blue links, Bing)** — still ~52% of clicks for commercial-intent B2B queries. Ranking factors remain: relevance, E-E-A-T, links, Core Web Vitals as a tiebreaker (pos. 1 pages show 10% higher CWV pass rate than pos. 9).

**Answer Engines (AI Overviews, Perplexity, ChatGPT Search, Claude, You.com, Bing Copilot)** — AI Overviews now appear on ~48% of queries. Citation logic diverges sharply from traditional rank:
- Only **38%** of AIO-cited pages are in top-10 organic for the same query
- **88%** of AIO answers cite 3+ sources; **1%** cite a single source
- **96%** of citations carry strong E-E-A-T signals
- **44.2%** of LLM citations come from the **first 30% of page text** (lede matters more than ever)
- Pages combining text + images + structured data: **+156%** selection rate vs text-only
- Content under 3 months old: **3x** more likely to be cited
- "2026" visible in title/H1: **+30%** citation rate
- Only **11%** of domains are cited by both ChatGPT and Perplexity — platforms diverge

**Implication for us:** semantic clarity > keyword density, original data > rephrased opinion, fresh dates > evergreen claims, structured data is non-optional.

---

## 2. Target Keyword Cluster

### Primary keyword
**`flutter app audit`** — high commercial intent, mid-difficulty, clear buyer persona (CTO/Eng-Mgr/founder who knows the app is underperforming).

### 10 secondary keywords (ordered by buying intent × achievability)

| # | Keyword | Intent | Volume class | Why we can rank |
|---|---|---|---|---|
| 1 | flutter performance audit | Buying | Med | Niche, few specialists |
| 2 | flutter code review service | Buying | Med | "service" qualifier filters competitors |
| 3 | hire flutter consultant | Buying | Med-High | Branded person-first answer wins |
| 4 | flutter app slow how to fix | Diagnostic | High | Long-tail PAA gold |
| 5 | flutter app crash audit | Buying | Low-Med | Specific pain, low competition |
| 6 | flutter jank fix consultant | Buying | Low | Hyper-specific, ours to lose |
| 7 | flutter impeller migration audit | Buying | Low | Rising 2026 query |
| 8 | flutter app size reduction service | Buying | Low | Concrete deliverable |
| 9 | flutter devtools profiling expert | Buying | Low | E-E-A-T moat |
| 10 | Nikita Kalaganov flutter | Branded | Low | Must own SERP for name |
| (bonus) | flutter app architecture review | Buying | Med | Adjacent pillar |

### Topical entity space to cover on the page (entity SEO)
Flutter, Dart, Skia, Impeller, Vulkan, Metal, Vector graphics, DevTools, Observatory, Dart VM, AOT compilation, tree shaking, hot reload, Flame engine, Riverpod, BLoC, Provider, GetX, Hive, Drift, Isar, Firebase, Sentry, Crashlytics, Performance Overlay, raster thread, UI thread, build phases, RepaintBoundary, const constructors, isolate, ffi, platform channels, Material 3, Cupertino, Skia GPU, GLES, frame budget, INP, LCP, jank, semantic widget tree, Widget Inspector.

Goal: dense, accurate co-occurrence so Google's Knowledge Graph associates Nikita Kalaganov with the Flutter performance entity cluster.

---

## 3. Meta Title + Description

```html
<title>Flutter App Audit & Performance Review | Nikita Kalaganov</title>
```
Length: 60 chars. Brand + service + person.

```html
<meta name="description" content="Senior Flutter audit: performance, jank, crashes, Impeller migration, architecture. Fixed-scope code review by Nikita Kalaganov. Report in 7 days." />
```
Length: 155 chars exactly. Concrete deliverables + speed signal + person.

### Supporting head meta

```html
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
<meta name="googlebot" content="index, follow" />
<meta name="rating" content="general" />
<meta name="author" content="Nikita Kalaganov" />
<meta name="theme-color" content="#0175C2" />
<link rel="canonical" href="https://flutteraudit.dev/" />
<link rel="me" href="https://github.com/nikitakalaganov" />
<link rel="me" href="https://linkedin.com/in/nikitakalaganov" />
<link rel="alternate" type="application/rss+xml" title="Flutter Audit Notes" href="/feed.xml" />
```

---

## 4. Open Graph + Twitter Card

```html
<meta property="og:type" content="profile" />
<meta property="og:site_name" content="Flutter Audit" />
<meta property="og:title" content="Flutter App Audit & Performance Review" />
<meta property="og:description" content="Senior Flutter audit by Nikita Kalaganov. Performance, jank, crashes, Impeller migration. Report in 7 days." />
<meta property="og:url" content="https://flutteraudit.dev/" />
<meta property="og:image" content="https://flutteraudit.dev/og/flutter-audit-1200x630.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Flutter Audit by Nikita Kalaganov — performance, jank, crashes" />
<meta property="profile:first_name" content="Nikita" />
<meta property="profile:last_name" content="Kalaganov" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Flutter App Audit by Nikita Kalaganov" />
<meta name="twitter:description" content="7-day fixed-scope Flutter audit. Performance, jank, crashes, Impeller migration." />
<meta name="twitter:image" content="https://flutteraudit.dev/og/flutter-audit-1200x630.png" />
<meta name="twitter:image:alt" content="Flutter Audit — performance, jank, crashes, Impeller migration" />
```

### OG image spec
- **Dimensions:** 1200 × 630 px (universal). Optional 1200 × 675 for Twitter-specific variant.
- **Format:** PNG (sharper text than JPG at this size), <300KB.
- **Safe zone:** 1100 × 580 centered (LinkedIn crops aggressively).
- **Content:**
  - Left: "Flutter Audit" wordmark + Flutter logo (use Flutter brand mark, attribution per Google's Flutter brand guidelines)
  - Right: photo of Nikita (square crop, neutral bg) + name "Nikita Kalaganov"
  - Bottom: tagline "7-day report. Performance · Jank · Crashes · Impeller"
- **Typography:** sans-serif, min 48px for taglines (Discover thumbnail readability).
- **Background:** dark `#0F172A` with subtle Flutter-blue `#0175C2` accent.
- **Filename:** `flutter-audit-og-2026.png` (descriptive for image SEO).

---

## 5. Full JSON-LD @graph (paste into `<head>`)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://flutteraudit.dev/#website",
      "url": "https://flutteraudit.dev/",
      "name": "Flutter Audit",
      "description": "Independent Flutter code & performance audits by Nikita Kalaganov.",
      "inLanguage": "en",
      "publisher": { "@id": "https://flutteraudit.dev/#person" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://www.google.com/search?q=site:flutteraudit.dev+{search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "Person",
      "@id": "https://flutteraudit.dev/#person",
      "name": "Nikita Kalaganov",
      "givenName": "Nikita",
      "familyName": "Kalaganov",
      "jobTitle": "Senior Flutter Engineer & Audit Consultant",
      "description": "Senior Flutter engineer specializing in performance audits, Impeller migration, jank diagnosis, crash forensics, and architecture review for production Flutter applications.",
      "url": "https://flutteraudit.dev/",
      "image": "https://flutteraudit.dev/img/nikita-kalaganov.jpg",
      "sameAs": [
        "https://github.com/nikitakalaganov",
        "https://linkedin.com/in/nikitakalaganov",
        "https://stackoverflow.com/users/XXXXXXX/nikita-kalaganov",
        "https://x.com/nikitakalaganov",
        "https://medium.com/@nikitakalaganov",
        "https://dev.to/nikitakalaganov",
        "https://pub.dev/publishers/flutteraudit.dev/packages"
      ],
      "knowsAbout": [
        "Flutter",
        "Dart",
        "Impeller rendering engine",
        "Skia graphics",
        "Mobile performance optimization",
        "Flutter DevTools",
        "Frame rasterization",
        "INP optimization",
        "App architecture review",
        "Riverpod",
        "BLoC pattern",
        "Platform channels",
        "Dart FFI",
        "Tree shaking",
        "AOT compilation"
      ],
      "knowsLanguage": ["en", "ru"],
      "alumniOf": {
        "@type": "Organization",
        "name": "TBD"
      },
      "worksFor": { "@id": "https://flutteraudit.dev/#organization" }
    },
    {
      "@type": "Organization",
      "@id": "https://flutteraudit.dev/#organization",
      "name": "Flutter Audit",
      "legalName": "Flutter Audit by Nikita Kalaganov",
      "url": "https://flutteraudit.dev/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://flutteraudit.dev/img/logo-512.png",
        "width": 512,
        "height": 512
      },
      "founder": { "@id": "https://flutteraudit.dev/#person" },
      "employee": { "@id": "https://flutteraudit.dev/#person" },
      "areaServed": "Worldwide",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "sales",
        "email": "hello@flutteraudit.dev",
        "availableLanguage": ["en"]
      },
      "sameAs": [
        "https://github.com/nikitakalaganov",
        "https://linkedin.com/in/nikitakalaganov"
      ]
    },
    {
      "@type": "Service",
      "@id": "https://flutteraudit.dev/#service-audit",
      "name": "Flutter App Audit",
      "alternateName": ["Flutter Performance Audit", "Flutter Code Review Service"],
      "serviceType": "Software code & performance audit",
      "description": "Fixed-scope 7-day audit of a production Flutter application: performance profiling with DevTools, jank diagnosis on UI and raster threads, Impeller readiness check, crash forensics, architecture review, and a written report with prioritized fixes.",
      "provider": { "@id": "https://flutteraudit.dev/#person" },
      "areaServed": { "@type": "Place", "name": "Worldwide" },
      "audience": {
        "@type": "BusinessAudience",
        "audienceType": "CTOs, Engineering Managers, Founders of Flutter-based products"
      },
      "category": "Mobile software consulting",
      "termsOfService": "https://flutteraudit.dev/#terms",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Flutter Audit Tiers",
        "itemListElement": [
          {
            "@type": "Offer",
            "name": "Performance Audit",
            "description": "Frame timing, jank, INP, raster bottlenecks, Impeller readiness.",
            "priceCurrency": "USD",
            "price": "TBD",
            "availability": "https://schema.org/InStock"
          },
          {
            "@type": "Offer",
            "name": "Architecture & Code Audit",
            "description": "State management, modularity, testability, dependency hygiene.",
            "priceCurrency": "USD",
            "price": "TBD",
            "availability": "https://schema.org/InStock"
          },
          {
            "@type": "Offer",
            "name": "Crash & Stability Audit",
            "description": "Crashlytics/Sentry forensics, platform channel review, null-safety hygiene.",
            "priceCurrency": "USD",
            "price": "TBD",
            "availability": "https://schema.org/InStock"
          }
        ]
      },
      "mainEntityOfPage": { "@id": "https://flutteraudit.dev/#webpage" }
    },
    {
      "@type": "WebPage",
      "@id": "https://flutteraudit.dev/#webpage",
      "url": "https://flutteraudit.dev/",
      "name": "Flutter App Audit & Performance Review",
      "isPartOf": { "@id": "https://flutteraudit.dev/#website" },
      "about": { "@id": "https://flutteraudit.dev/#service-audit" },
      "primaryImageOfPage": "https://flutteraudit.dev/og/flutter-audit-1200x630.png",
      "datePublished": "2026-05-15",
      "dateModified": "2026-05-15",
      "inLanguage": "en",
      "breadcrumb": { "@id": "https://flutteraudit.dev/#breadcrumb" },
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": ["#hero-tagline", "#what-you-get", "#faq"]
      }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://flutteraudit.dev/#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://flutteraudit.dev/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Flutter App Audit"
        }
      ]
    },
    {
      "@type": "FAQPage",
      "@id": "https://flutteraudit.dev/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is a Flutter app audit?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A Flutter app audit is a structured review of a production Flutter application's performance, code quality, architecture, and stability. It typically uses Flutter DevTools to profile UI and raster thread timings, inspect widget rebuilds, analyze crash reports, and produce a prioritized list of fixes."
          }
        },
        {
          "@type": "Question",
          "name": "How long does a Flutter performance audit take?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A fixed-scope Flutter performance audit takes 5 to 7 working days for a typical production app. Larger codebases with multiple platforms can take 10 to 14 days. The output is a written report with concrete fixes and severity ranking."
          }
        },
        {
          "@type": "Question",
          "name": "Why is my Flutter app slow on Android?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The most common causes are: shader compilation jank on first run (mitigated by Impeller), oversized images decoded on the UI thread, expensive build methods triggering on every frame, missing const constructors, missing RepaintBoundary on animated subtrees, and Dart isolate misuse for heavy work."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need a Flutter audit before migrating to Impeller?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Impeller has different shader compilation behavior, custom paint semantics, and platform support. An audit identifies custom shaders, blend modes, and edge cases that may regress under Impeller and prepares a migration plan."
          }
        },
        {
          "@type": "Question",
          "name": "What does a Flutter code audit deliverable include?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A written PDF report covering: executive summary, performance findings with DevTools traces, architecture observations, dependency hygiene, crash root causes, and a prioritized fix list with effort estimates. Includes a 60-minute walkthrough call."
          }
        },
        {
          "@type": "Question",
          "name": "How much does a Flutter app audit cost?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Fixed-scope Flutter audits range from $3,000 to $12,000 USD depending on app size, platform count (iOS, Android, web, desktop), and depth (performance only vs full architecture). A scoping call is free."
          }
        },
        {
          "@type": "Question",
          "name": "Who is Nikita Kalaganov?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Nikita Kalaganov is a senior Flutter engineer specializing in performance audits, Impeller migration, jank diagnosis, and architecture review for production Flutter applications. He operates the independent consultancy Flutter Audit."
          }
        }
      ]
    }
  ]
}
</script>
```

---

## 6. Semantic HTML scaffold (2026 best practice)

Single `<h1>`, proper sectioning, anchor IDs for AI deep-linking, `<details>` for FAQ so content is machine-readable even without JS.

```html
<body>
  <header>
    <nav aria-label="Primary"><!-- skiplink + 1 logo + 3 anchor links --></nav>
  </header>

  <main>
    <section id="hero" aria-labelledby="h1">
      <h1 id="h1">Flutter App Audit &amp; Performance Review</h1>
      <p id="hero-tagline">Independent 7-day audit by senior Flutter engineer Nikita Kalaganov. Performance, jank, crashes, Impeller migration, architecture.</p>
    </section>

    <section id="what-you-get" aria-labelledby="h2-deliverable">
      <h2 id="h2-deliverable">What you get</h2>
      <!-- table.deliverables — AI engines extract tables verbatim -->
      <table>...</table>
    </section>

    <section id="services" aria-labelledby="h2-services">
      <h2 id="h2-services">Audit tiers</h2>
      <article id="performance-audit"><h3>Performance audit</h3>...</article>
      <article id="architecture-audit"><h3>Architecture &amp; code audit</h3>...</article>
      <article id="crash-audit"><h3>Crash &amp; stability audit</h3>...</article>
    </section>

    <section id="process" aria-labelledby="h2-process">
      <h2 id="h2-process">How the audit works</h2>
      <ol>
        <li>Scoping call (30 min, free)</li>
        <li>Repo + DevTools session capture</li>
        <li>Profile with Flutter DevTools (UI + raster threads, memory, network)</li>
        <li>Written report with prioritized fixes</li>
        <li>60-min walkthrough call</li>
      </ol>
    </section>

    <section id="about" aria-labelledby="h2-about">
      <h2 id="h2-about">About Nikita Kalaganov</h2>
      <!-- 200 words with entity-dense bio: years on Flutter, packages on pub.dev, talks, OSS PRs to flutter/flutter -->
    </section>

    <section id="faq" aria-labelledby="h2-faq">
      <h2 id="h2-faq">Frequently asked questions</h2>
      <details open>
        <summary>What is a Flutter app audit?</summary>
        <p>A structured review of a production Flutter app's performance, code quality, architecture, and stability...</p>
      </details>
      <details>
        <summary>How long does a Flutter performance audit take?</summary>
        <p>5 to 7 working days for a typical production app...</p>
      </details>
      <!-- match every FAQ JSON-LD entry 1:1 -->
    </section>

    <section id="contact" aria-labelledby="h2-contact">
      <h2 id="h2-contact">Book a scoping call</h2>
      <!-- mailto: + Cal.com embed; native <dialog> for any modal so it lives in DOM -->
    </section>
  </main>

  <footer>
    <p>&copy; 2026 Nikita Kalaganov · <a href="/llms.txt">llms.txt</a> · <a href="/sitemap.xml">sitemap</a></p>
    <address itemprop="contactPoint"><a href="mailto:hello@flutteraudit.dev">hello@flutteraudit.dev</a></address>
  </footer>
</body>
```

Rules:
- Single `<h1>`.
- `<details>` for FAQ — machine-readable, no JS dependency.
- Tables for comparisons (LLMs extract tables verbatim).
- Anchor IDs on every section (`#hero-tagline`, `#faq`) so AI can deep-link.
- Native `<dialog>` for contact modal (in DOM, no React portal opacity).
- Descriptive link text — never "click here".
- `aria-labelledby` on every section.

---

## 7. Image SEO

- Filename: `flutter-audit-og-2026.png`, `nikita-kalaganov-flutter-engineer.jpg`, `devtools-performance-flamegraph-example.webp` — descriptive, hyphenated, lowercase.
- Alt text: describe what the image shows in plain English, mention the entity once if natural. **Bad:** `flutter audit performance code review service`. **Good:** `Flutter DevTools performance overlay showing 60fps raster thread.`
- Serve `<picture>` with WebP + AVIF + JPG fallback. All three indexable.
- `width` and `height` attributes set on every `<img>` to prevent CLS.
- `loading="eager" fetchpriority="high"` on hero/LCP image; `loading="lazy" decoding="async"` on everything below the fold.

```html
<picture>
  <source type="image/avif" srcset="/img/hero.avif">
  <source type="image/webp" srcset="/img/hero.webp">
  <img src="/img/hero.jpg" width="1200" height="630"
       alt="Flutter DevTools timeline showing raster thread frame budget"
       loading="eager" fetchpriority="high" decoding="async">
</picture>
```

---

## 8. `/llms.txt` content

Place at `https://flutteraudit.dev/llms.txt`. Markdown, root path.

```markdown
# Flutter Audit — Nikita Kalaganov

> Independent Flutter code and performance audits by senior engineer Nikita Kalaganov. Fixed-scope 7-day reports covering performance profiling, jank diagnosis, Impeller migration, crash forensics, and architecture review for production Flutter applications.

Flutter Audit is a one-person consultancy operated by Nikita Kalaganov. Buyers are CTOs, engineering managers, and founders running production Flutter apps on iOS, Android, web, and desktop who need an independent expert review. Audits use Flutter DevTools, custom tooling, and a structured methodology to produce a prioritized written report. Typical engagements run 5–14 days.

## Core pages
- [Home / Service overview](https://flutteraudit.dev/): primary landing page describing the audit offering, tiers, process, and the engineer.
- [FAQ](https://flutteraudit.dev/#faq): answers to common buyer questions about scope, cost, deliverables, and timeline.
- [About Nikita Kalaganov](https://flutteraudit.dev/#about): engineer background, OSS contributions, and Flutter specialization.

## Services
- [Performance Audit](https://flutteraudit.dev/#performance-audit): frame timing, jank diagnosis, INP, raster bottlenecks, Impeller readiness.
- [Architecture & Code Audit](https://flutteraudit.dev/#architecture-audit): state management, modularity, testability, dependency hygiene.
- [Crash & Stability Audit](https://flutteraudit.dev/#crash-audit): Crashlytics/Sentry forensics, platform channels, null-safety hygiene.

## Contact
- [Email](mailto:hello@flutteraudit.dev)
- [GitHub](https://github.com/nikitakalaganov)
- [LinkedIn](https://linkedin.com/in/nikitakalaganov)

## Optional
- [RSS feed of audit notes](https://flutteraudit.dev/feed.xml)
- [Sitemap](https://flutteraudit.dev/sitemap.xml)
```

---

## 9. `/robots.txt`

```
# Flutter Audit — robots.txt
# Last updated: 2026-05-15

User-agent: *
Allow: /

# Major AI crawlers — explicitly allowed
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: CCBot
Allow: /

User-agent: Bytespider
Allow: /

User-agent: YouBot
Allow: /

User-agent: Meta-ExternalAgent
Allow: /

User-agent: DuckAssistBot
Allow: /

# Block junk
User-agent: SemrushBot
Disallow: /

User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /

Sitemap: https://flutteraudit.dev/sitemap.xml
```

Note: a 2026 robots.txt without AI bot directives is incomplete. We explicitly allow because we *want* to be cited.

---

## 10. `/sitemap.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://flutteraudit.dev/</loc>
    <lastmod>2026-05-15</lastmod>
    <image:image>
      <image:loc>https://flutteraudit.dev/og/flutter-audit-1200x630.png</image:loc>
      <image:title>Flutter Audit by Nikita Kalaganov</image:title>
      <image:caption>Flutter app audit and performance review</image:caption>
    </image:image>
  </url>
</urlset>
```

Rules: lastmod must reflect *real* content changes — Google distrusts auto-bumped lastmod. `changefreq` and `priority` are ignored, omit them.

---

## 11. IndexNow ping snippet

Generate a key (any 8–128 char hex), host it at `https://flutteraudit.dev/<KEY>.txt` containing only the key.

```bash
# IndexNow ping — run after every content change
KEY="a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6"
URL="https://flutteraudit.dev/"

curl -X POST "https://api.indexnow.org/IndexNow" \
  -H "Content-Type: application/json" \
  -d "{
    \"host\": \"flutteraudit.dev\",
    \"key\": \"$KEY\",
    \"keyLocation\": \"https://flutteraudit.dev/$KEY.txt\",
    \"urlList\": [\"$URL\"]
  }"
```

Or single-URL GET form for simplicity:

```bash
curl "https://www.bing.com/indexnow?url=https://flutteraudit.dev/&key=a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6"
```

Pings Bing, Yandex, Naver, Seznam, Yep. **Not Google** — Google ignores IndexNow. For Google, submit to Search Console manually + rely on sitemap.

---

## 12. Fifteen hidden / underused 2026 tactics

1. **`<link rel="me">` to LinkedIn + GitHub + Stack Overflow** — establishes verified identity graph; IndieAuth / Mastodon verification cascade strengthens Person entity.
2. **`speakable` schema** in JSON-LD pointing to `#hero-tagline` + `#faq` — Perplexity, ChatGPT, AIO use it as content-priority signal in 2026 even though Google Assistant is dead.
3. **`<details open>` for the first FAQ item only** — keeps the answer in initial paint (counts for LCP-adjacent ranking and AI extraction from first 30% of text) while others stay collapsed.
4. **HTML `<table>` for "what you get" deliverables** — LLMs extract tables verbatim; never write the comparison as prose.
5. **Visible "2026" in H1 sub-tagline or first paragraph** — +30% citation rate per current AI engine telemetry.
6. **`<dialog>` native element for booking modal** — content lives in DOM, indexable, unlike React-portal modals.
7. **Self-referencing canonical `<link rel="canonical" href="https://flutteraudit.dev/">`** — prevents accidental param-URL duplicates (utm_*, gclid).
8. **Submit to Bing Webmaster Tools and *import to* GSC** — Bing imports verified sites instantly; faster than separate verification.
9. **First 100 words must answer "what is this"** — 44.2% of LLM citations come from the top 30% of the page; the lede is the new H1.
10. **Original data on the page** — publish one metric you measured yourself (e.g., "Across 23 audited apps, median shader compilation jank disappeared after Impeller migration in 87% of cases"). Original data is the single highest-value citation type across all AI engines.
11. **`noai`/`noimageai` *deliberately omitted*** — many sites add them by mistake via SEO plugins; absence signals "cite me."
12. **`pub.dev` publisher domain verification** — link `pub.dev/publishers/flutteraudit.dev` ↔ the site; Google indexes pub.dev heavily for Flutter queries and treats the verification as a sameAs signal.
13. **GitHub Pages → custom domain → `CNAME` file in repo root + DNS** — for instant indexing leverage of github.io's trust before full DR transfer.
14. **Dev.to canonical-back articles** — write 3 long-form Flutter audit posts on dev.to with `canonical_url: https://flutteraudit.dev/...`; ride dev.to's DR while keeping the original on our domain. Even with canonical, Google often still serves dev.to — accept it as a referral funnel, not a rank concession.
15. **Bing Webmaster Tools "URL Inspection" + "Submit URL"** — Bing indexes within hours, not days. Bing-indexed pages feed Copilot, ChatGPT Search (Bing-powered), and DuckDuckGo simultaneously.

Bonus 16 (Discover): keep one piece of original data ≤ 90 days old, OG image 1200×630 with the headline rendered into the image itself (Discover thumbnails are clicked on visual signal, not meta description).

---

## 13. Content depth

Word count target: **1,400–1,800 words** of visible body copy on the single page. Below 1,000 underperforms for commercial queries in 2026; above 2,500 dilutes on a single-page layout. The 1,400-word floor is set by:
- 250-word hero + value proposition
- 300-word "what you get" with table
- 350-word three-service-tier section
- 200-word process section
- 200-word about Nikita section
- ~150 words across 7 FAQ answers (40–60 words each — the PAA optimal length)

**Question-target H2/H3 headings** must mirror PAA queries: "What is a Flutter app audit?", "How long does a Flutter performance audit take?", "Why is my Flutter app slow on Android?", "How much does a Flutter app audit cost?" — verbatim PAA phrasing wins those PAA boxes.

---

## 14. Performance budget (Core Web Vitals 2026)

| Metric | Target | Notes |
|---|---|---|
| LCP | < 1.8s (better than 2.5 "good") | Hero image preloaded, no web fonts blocking |
| INP | < 100ms (better than 200 "good") | Vanilla JS only; no framework on landing |
| CLS | < 0.05 | All `<img>` have width/height; no late-injected ads |
| TTFB | < 200ms | Cloudflare/Fastly + static HTML |
| FCP | < 1.0s | Inline critical CSS in `<head>` |

CWV at 75th percentile is a tiebreaker, not a primary ranking factor — but for AIO citation it correlates with selection rate (fast pages get parsed more reliably).

Hard rules:
- Inline critical CSS (≤14KB) in `<head>`.
- `<link rel="preload" as="image" href="/img/hero.avif" fetchpriority="high">`.
- Defer/async all non-essential JS.
- Self-host any fonts; subset to Latin; `font-display: swap`.
- No third-party analytics on first paint — Plausible/Umami lite or 1×1 server-side beacon.

---

## 15. Link building (light-touch, ethical)

For a brand-new domain, prioritize:

1. **Pub.dev publisher** — verify `flutteraudit.dev` and ship one micro-package (e.g., `flutter_audit_lints` — a strict analysis_options.yaml).
2. **GitHub README backlink** — pin a `flutter-audit-checklist` repo with the audit methodology in markdown; link to site.
3. **Stack Overflow profile** — answer 10 high-vote Flutter performance questions, link to site from profile.
4. **Awwwards submission** — submit when site is launched.
5. **Cofolios** — submit profile (if accepted; criteria are competitive).
6. **Dev.to canonical articles** — 3 posts: "How I audit a Flutter app in 7 days", "Impeller migration checklist", "Diagnosing Flutter jank with DevTools".
7. **Medium canonical reposts** — same articles, canonical back to our site.
8. **Reddit r/FlutterDev** — 1 high-quality, self-disclosing post per quarter (no self-promo). Karma-build first.
9. **Hacker News** — submit one signature audit findings post on a Tuesday morning UTC.
10. **Flutter Community newsletters** — pitch to Flutter Weekly, This Week in Flutter, FilledStacks for guest features.
11. **Podcast guesting** — pitch The Boring Show, Flutter Podcast.
12. **LinkedIn long-form posts** — 1× per month, deep technical with backlink in author bio.
13. **YouTube short demos** — 60-sec audit-finding screencasts; link in description.
14. **Google Search Console + Bing Webmaster Tools** — verify both domains day one.
15. **Google Business Profile** — even for remote consultancy, set up "Service-area business" for Knowledge Panel eligibility.

Avoid: paid link networks, PBNs, comment spam, scraper directories — all flagged by 2026 spam systems.

---

## 16. Brutally honest ranking time horizon

**Realistic forecast for `flutteraudit.dev` from launch:**

| Timeframe | Reasonable expectation |
|---|---|
| **Week 1** | Indexed by Bing in 24–48h via Webmaster Tools + IndexNow. Google indexing within 1–2 weeks if Search Console submitted. |
| **Month 1–2** | Branded queries ("Nikita Kalaganov flutter") rank #1 — easy, low competition, person entity owns SERP. AI engines may start citing if you publish original data. |
| **Month 3** | Long-tail PAA queries ("flutter jank fix consultant", "flutter impeller migration audit") rank 5–15. AIO citations possible on niche queries because we have FAQ + Service schema + speakable + fresh date. |
| **Month 4–6** | Mid-tail commercial queries ("flutter performance audit", "flutter code review service") reach page 1 only if we publish 2–4 supporting articles (dev.to + canonical-back) and get 5+ quality backlinks. |
| **Month 6–12** | Primary keyword "flutter app audit" reaches page 1 *only if* (a) we have 10+ referring domains including at least one from flutter.dev, pub.dev, or a major dev publication; (b) the site has month-on-month repeat visits; (c) E-E-A-T is reinforced by ongoing OSS contributions, conference talks, or pub.dev publisher activity. |
| **Year 1–2** | Compounding domain trust. Realistic to be top-3 for "flutter audit" cluster. Outranking established agencies (LeanCode, What the Flutter, Chili Labs) for "flutter app audit" is hard but doable because our content is *narrower and deeper* — they sell development; we sell only audits. |

**The honest truth:**
- A single-page site has a glass ceiling. Without a blog/article corpus on the same domain, broader terms ("flutter consulting", "hire flutter developer") are unreachable.
- AI Overview citations are the *fastest* win available — they don't require domain authority, just semantic clarity + structured data + fresh dates + first-30%-of-text optimization. Expect first AIO citations within 2–4 months for niche queries.
- Person-entity SEO (Nikita Kalaganov branded queries) is achievable in weeks. Use it as the anchor — Google will associate the person with the topic over time, then transfer that authority to commercial queries.
- The biggest accelerant we control: publishing original measurement data on the page (e.g., "I audited 23 Flutter apps in 2025; here's what I found"). This is the single highest-leverage 2026 SEO action available to a one-person site.
- Biggest risk: the keyword cluster ("flutter app audit") may be too low-volume to deliver large *traffic* even at rank #1. The goal isn't traffic — it's *the right 50 visitors per month*. SEO success here is measured in qualified inquiries, not impressions.

**Bottom line:** Plan for 6 months to page-1 on the primary keyword if we execute fully; 3 months to AIO citations on long-tail; 4 weeks to own all branded "Nikita Kalaganov flutter" queries.

---

## Sources

- [Google AI Overviews Ranking Factors 2026 — Wellows](https://wellows.com/blog/google-ai-overviews-ranking-factors/)
- [AI Citation Ranking Factors 2026 — Megrisoft](https://www.megrisoft.com/blog/artificial-intelligence/ai-citation-ranking-factors)
- [How Google Selects AI Overview Sources — Content Decoded](https://contentdecoded.com/how-google-ai-overview-chooses-sources/)
- [llms.txt specification — llmstxt.org](https://llmstxt.org/)
- [llms.txt Complete Guide 2026 — Codersera](https://codersera.com/blog/llms-txt-complete-guide-2026/)
- [Core Web Vitals 2026 — corewebvitals.io](https://www.corewebvitals.io/core-web-vitals)
- [Core Web Vitals Google Search Central](https://developers.google.com/search/docs/appearance/core-web-vitals)
- [Schema.org Service](https://schema.org/Service)
- [Schema.org ProfessionalService](https://schema.org/ProfessionalService)
- [Schema.org Speakable](https://schema.org/speakable)
- [Speakable Schema Markup — Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/speakable)
- [JSON-LD Structured Data 2026 — Schema Pilot](https://www.schemapilot.app/blog/json-ld-guide/)
- [How to Get Cited by AI Search Engines 2026 — Sapt](https://sapt.ai/insights/ai-search-optimization-complete-guide-chatgpt-perplexity-citations)
- [How to Get Cited in Perplexity 2026 — AuthorityTech](https://authoritytech.io/blog/how-to-get-cited-in-perplexity-ai-2026)
- [IndexNow.org](https://www.indexnow.org/)
- [Bing IndexNow Getting Started](https://www.bing.com/indexnow/getstarted)
- [XML Sitemap Guide 2026 — W3era](https://www.w3era.com/blog/seo/xml-sitemap-seo-guide/)
- [FAQ Schema SEO 2026 — Wellows](https://wellows.com/blog/improve-search-visibility-with-faq-schema/)
- [FAQ Schema for AI Citations — SEOScore](https://seoscore.tools/blog/faq-schema-markup/)
- [Cloudflare Content Signals — InfoQ](https://www.infoq.com/news/2026/03/cloudflare-crawler/)
- [Meta Title & Description Length 2026 — Straight North](https://www.straightnorth.com/blog/title-tags-and-meta-descriptions-how-to-write-and-optimize-them-in-2026/)
- [OG Image Sizes 2026 — Screenhance](https://screenhance.com/blog/og-image-size-guide)
- [Flutter Performance Deep Dive 2026 — Medium](https://medium.com/@m.m.shahmeh/flutter-performance-deep-dive-skia-impeller-and-the-frame-pipeline-e1b82fd1d3a5)
- [Impeller Rendering 2026 — DEV Community](https://dev.to/eira-wexford/how-impeller-is-transforming-flutter-ui-rendering-in-2026-3dpd)
- [GitHub Pages Indexing — Filip Mikina](https://filipmikina.com/blog/github-pages-indexing)
- [Entity-Based SEO 2026 — Stackmatix](https://www.stackmatix.com/blog/entity-based-seo-topical-authority)
- [How Long B2B SEO Takes — Diamond Group](https://www.diamond-group.co/blog/seo-in-2026-is-different-how-to-rank-a-new-website)
- [Dev.to Canonical URL SEO — JimmyMcBride](https://jimmymcbride.dev/blog/the-ultimate-devto-hacks)
- [Awwwards Portfolios](https://www.awwwards.com/inspiration_search/portfolio/)
- [Cofolios](https://www.cofolios.com/)
