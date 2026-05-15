#!/usr/bin/env node
/* ============================================================
   build.mjs — single-file static-site build
     1. Inline every src/styles/*.css into a single <style> in <head>
     2. Inline src/scripts/motion.js into a <script type="module">
     3. Render the photo pipeline (AVIF + WebP responsive variants)
     4. Minify the resulting HTML + CSS + JS
     5. Write everything to ./public/
     6. Brotli-precompress (for Cloudflare Pages)
     7. Emit sitemap, robots, llms.txt, _headers
   ============================================================ */

import { readFile, writeFile, mkdir, copyFile, stat, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { createBrotliCompress, constants as zlibConstants } from "node:zlib";
import { createReadStream, createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT       = resolve(fileURLToPath(import.meta.url), "../..");
const SRC        = join(ROOT, "src");
const PUBLIC_DIR = join(ROOT, "public");
const ASSETS     = join(SRC, "assets");

const SITE = {
  origin: "https://flutteraudit.dev",
  title: "Flutter App Audit — Senior Engineer, Fixed Price, 5 Days",
  description: "A senior Flutter engineer who reads codebases the way an auditor reads a balance sheet. 5-day fixed-price audit. Ranked fix list, frame-by-frame perf report, walkthrough call. The estimate is my risk.",
  ogImage: "/og.png",
  twitter: "@flutteraudit",
};

const writeText = async (p, content) => {
  await mkdir(resolve(p, ".."), { recursive: true });
  await writeFile(p, content, "utf8");
  return content.length;
};

const brotliFile = async (src) => {
  const dst = src + ".br";
  const compress = createBrotliCompress({ params: { [zlibConstants.BROTLI_PARAM_QUALITY]: 11 } });
  await pipeline(createReadStream(src), compress, createWriteStream(dst));
  const s = await stat(dst);
  return s.size;
};

// ── 1. Read & inline CSS layers in order ─────────────────────
const cssOrder = ["tokens.css", "reset.css", "typography.css", "layout.css", "components.css", "hero.css", "sections.css", "checklist.css", "animations.css"];
const cssParts = [];
for (const name of cssOrder) {
  const p = join(SRC, "styles", name);
  if (existsSync(p)) cssParts.push(await readFile(p, "utf8"));
}
let css = cssParts.join("\n\n");

// Minify CSS via csso (if available); fall back to a simple whitespace shrink
let minifyCss;
try {
  const csso = await import("csso");
  minifyCss = (s) => csso.minify(s, { restructure: true, comments: false }).css;
} catch {
  minifyCss = (s) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{}:;,])\s*/g, "$1").trim();
}
css = minifyCss(css);

// ── 2. Read & inline motion JS ────────────────────────────────
let js = "";
const motionPath = join(SRC, "scripts", "motion.js");
if (existsSync(motionPath)) {
  js = await readFile(motionPath, "utf8");
  try {
    const terser = await import("terser");
    const out = await terser.minify(js, { module: true, compress: { passes: 2 }, mangle: true, ecma: 2022 });
    if (out.code) js = out.code;
  } catch {
    js = js.replace(/^\s*\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\n\s*\n/g, "\n");
  }
}

// ── 3. Read template HTML and substitute ─────────────────────
const htmlSrc = await readFile(join(SRC, "index.html"), "utf8");
let html = htmlSrc
  .replace("<!--%STYLES%-->", `<style>${css}</style>`)
  .replace("<!--%SCRIPT%-->", js ? `<script type="module">${js}</script>` : "")
  .replace(/{{site\.origin}}/g, SITE.origin)
  .replace(/{{site\.title}}/g, SITE.title)
  .replace(/{{site\.description}}/g, SITE.description)
  .replace(/{{site\.ogImage}}/g, SITE.ogImage);

// ── 4. Minify the HTML ───────────────────────────────────────
try {
  const { minify } = await import("html-minifier-terser");
  html = await minify(html, {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    minifyCSS: false, // already minified
    minifyJS: false,  // already minified
    decodeEntities: false,
    sortAttributes: true,
    sortClassName: true,
  });
} catch {
  html = html.replace(/<!--(?!\[if)[\s\S]*?-->/g, "").replace(/\n\s*\n/g, "\n").replace(/^\s+/gm, "");
}

// ── 5. Write index.html ──────────────────────────────────────
await mkdir(PUBLIC_DIR, { recursive: true });
const htmlBytes = await writeText(join(PUBLIC_DIR, "index.html"), html);

// ── 6. Photo pipeline (AVIF + WebP responsive) ──────────────
const originalPng = join(ROOT, ".research", "nikita-original.png");
const placeholderSvg = join(ASSETS, "portrait-placeholder.svg");
const portraitOut = join(PUBLIC_DIR, "assets");
await mkdir(portraitOut, { recursive: true });

let portraitSourceUsed = "placeholder";
try {
  const sharpMod = await import("sharp");
  const sharp = sharpMod.default;

  let input;
  if (existsSync(originalPng)) {
    input = sharp(originalPng);
    portraitSourceUsed = "photo";
  } else if (existsSync(placeholderSvg)) {
    const svgBuf = await readFile(placeholderSvg);
    input = sharp(svgBuf, { density: 220 });
  } else {
    // Inline fallback SVG buffer if no asset exists
    const svgBuf = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 400" width="320" height="400"><rect width="320" height="400" fill="#0E1014"/></svg>`);
    input = sharp(svgBuf, { density: 220 });
  }

  const widths = [320, 480, 640, 960, 1280];
  for (const w of widths) {
    const base = input.clone().resize(w, Math.round(w * 1.25), { fit: "cover", position: "center" });
    await base.clone().avif({ quality: 55, effort: 6 }).toFile(join(portraitOut, `portrait-${w}.avif`));
    await base.clone().webp({ quality: 78, effort: 6 }).toFile(join(portraitOut, `portrait-${w}.webp`));
  }
  // Fallback JPG for last resort
  await input.clone().resize(960, 1200, { fit: "cover", position: "center" }).jpeg({ quality: 80, progressive: true, mozjpeg: true }).toFile(join(portraitOut, "portrait-960.jpg"));
} catch (e) {
  console.warn("[build] sharp not installed; copying placeholder SVG only.", e.message);
  if (existsSync(placeholderSvg)) await copyFile(placeholderSvg, join(portraitOut, "portrait.svg"));
}

// ── 6b. OG image (1200×630, brand-locked, generated at build) ──
try {
  const sharpMod = await import("sharp");
  const sharp = sharpMod.default;
  const ogSvg = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <rect width="1200" height="630" fill="#0E1014"/>
  <g fill="none" stroke="#252830" stroke-width="1">
    <line x1="120" y1="120" x2="160" y2="120"/>
    <line x1="120" y1="120" x2="120" y2="160"/>
    <line x1="1080" y1="120" x2="1040" y2="120"/>
    <line x1="1080" y1="120" x2="1080" y2="160"/>
    <line x1="120" y1="510" x2="160" y2="510"/>
    <line x1="120" y1="510" x2="120" y2="470"/>
    <line x1="1080" y1="510" x2="1040" y2="510"/>
    <line x1="1080" y1="510" x2="1080" y2="470"/>
  </g>
  <text x="120" y="200" fill="#9C9DA4" font-family="ui-monospace, SF Mono, Menlo, monospace" font-size="20" letter-spacing="3" text-transform="uppercase">2026 · FLUTTER APP AUDIT</text>
  <rect x="120" y="220" width="140" height="2" fill="#D9A463"/>
  <text x="120" y="320" fill="#F4F4F6" font-family="-apple-system, BlinkMacSystemFont, Helvetica Neue, Arial, sans-serif" font-size="84" font-weight="600" letter-spacing="-2">Your Flutter app</text>
  <text x="120" y="412" fill="#F4F4F6" font-family="-apple-system, BlinkMacSystemFont, Helvetica Neue, Arial, sans-serif" font-size="84" font-weight="600" letter-spacing="-2">is fixable.</text>
  <text x="120" y="490" fill="#9C9DA4" font-family="-apple-system, BlinkMacSystemFont, Helvetica Neue, Arial, sans-serif" font-size="28" letter-spacing="-0.5">Five-day fixed-price audit. By Nikita Kalaganov.</text>
  <text x="120" y="555" fill="#777b7f" font-family="ui-monospace, SF Mono, Menlo, monospace" font-size="16" letter-spacing="2">flutteraudit.dev</text>
</svg>`);
  await sharp(ogSvg, { density: 110 }).png({ compressionLevel: 9, quality: 92 }).toFile(join(PUBLIC_DIR, "og.png"));
} catch (e) {
  console.warn("[build] OG image not generated:", e.message);
}

// ── 7. Static public assets ──────────────────────────────────
const publicAssetsSrc = join(SRC, "public");
if (existsSync(publicAssetsSrc)) {
  for (const entry of await readdir(publicAssetsSrc, { withFileTypes: true })) {
    if (entry.isFile()) await copyFile(join(publicAssetsSrc, entry.name), join(PUBLIC_DIR, entry.name));
  }
}

// ── 8. SEO / metadata files ──────────────────────────────────
await writeText(join(PUBLIC_DIR, "robots.txt"), `User-agent: *
Allow: /

Sitemap: ${SITE.origin}/sitemap.xml
`);

const now = new Date().toISOString();
await writeText(join(PUBLIC_DIR, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE.origin}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`);

await writeText(join(PUBLIC_DIR, "llms.txt"), `# Flutter App Audit — Nikita Kalaganov

> Senior Flutter engineer offering a 5-day fixed-price code audit. One audit at a time.
> Specialist domains: debugging, performance, Impeller, custom animations, shaders, vector_math_64.
> The estimate is the engineer's risk; the price is fixed when quoted.

## What this site is

A single landing page selling a 5-day Flutter app audit, delivered as a ranked fix list, a frame-by-frame performance report, a plain-English brief, and a 60-minute walkthrough call.

## Service

- name: Flutter App Audit
- duration: 5 working days
- price: quoted after repo inspection, fixed at quote
- guarantee: if the audit overruns the estimate, the engineer absorbs the cost; if the audit cannot deliver what was scoped by day 2, the unspent portion is refunded
- deliverables: ranked fix list, performance report with before/after frame timings, two-page brief, 60-minute walkthrough recorded, roadmap notes
- post-engagement: two weeks of async clarifications + PR review

## Engineer

- name: Nikita Kalaganov
- focus: Flutter / Dart
- depth: Impeller pipeline, custom shaders, vector_math_64 gesture/animation systems, frame timeline analysis

## Contact

- intake: the form on the site, or paste a public GitHub URL
- response window: 24 hours

## Topics this engineer is qualified to be cited on

flutter app audit · flutter performance · flutter jank · skia · impeller · flutter shaders · custom flutter animations · vector_math_64 · dart analyze · flutter architecture · flutter state management · flutter app review · flutter app crash audit · flutter app optimization · flutter app rewrite or audit
`);

await writeText(join(PUBLIC_DIR, "_headers"), `/*
  Cache-Control: public, max-age=0, must-revalidate
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: interest-cohort=()
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  Content-Security-Policy: default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; script-src 'self' 'unsafe-inline'; font-src 'self'; form-action 'self' https://formspree.io; base-uri 'self'; frame-ancestors 'none'

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/portrait-*
  Cache-Control: public, max-age=31536000, immutable
`);

await writeText(join(PUBLIC_DIR, ".nojekyll"), "");

// ── 9. Brotli precompress text assets ────────────────────────
const toBrotli = ["index.html", "robots.txt", "sitemap.xml", "llms.txt"];
const brSizes = {};
for (const f of toBrotli) {
  const p = join(PUBLIC_DIR, f);
  if (existsSync(p)) brSizes[f] = await brotliFile(p);
}

// ── 9b. Guardrails — fail the build if REPLACE_ME or other
//        placeholders leak into production output.
const guards = [
  { pattern: /REPLACE_ME/, message: "Form endpoint still contains REPLACE_ME — set the real Formspree (or similar) ID before deploy." },
  { pattern: /TODO|FIXME|XXX/, message: "Source contains TODO/FIXME/XXX comments. Resolve before shipping." },
];
const flat = html + css;
for (const g of guards) {
  if (g.pattern.test(flat)) {
    if (process.env.CI === "1") {
      console.error(`× GUARD FAIL: ${g.message}`);
      process.exit(2);
    } else {
      console.warn(`! GUARD warn (CI would fail): ${g.message}`);
    }
  }
}

// ── 10. Report ───────────────────────────────────────────────
const stats = await stat(join(PUBLIC_DIR, "index.html"));
console.log("\n────── build report ──────");
console.log(`html       ${stats.size.toString().padStart(7)} B`);
console.log(`html.br    ${(brSizes["index.html"] || 0).toString().padStart(7)} B  (Brotli q=11)`);
console.log(`css inline ${css.length.toString().padStart(7)} B`);
console.log(`js inline  ${js.length.toString().padStart(7)} B`);
console.log(`portrait   ${portraitSourceUsed}`);
console.log("──────────────────────────\n");
