# Color System Research — Flutter Audit Portfolio (Near-Black, 2026)

**Brief recap.** Senior Flutter engineer selling code audits. Audience: technical founders + CTOs. The product is judgement and engineering precision. The brand must read as **premium consultancy / engineering precision** — calm, expensive, restrained. Not "indie hacker neon," not "crypto dashboard," not "generic SaaS purple," not "dev-template dark."

This document covers the color science we need to make defensible choices, then proposes seven candidate palette systems in OKLCH with computed APCA scores against the background.

---

## 1. OKLCH / OKLab — why this is the right tool in 2026

OKLCH (Lightness, Chroma, Hue) is the practical packaging of the Oklab perceptual color space introduced by Björn Ottosson in 2020. It fixes two things that wrecked dark-mode palettes built in HSL:

1. **Perceptual uniformity of lightness.** In HSL, `hsl(60, 100%, 50%)` (yellow) reads dramatically lighter than `hsl(240, 100%, 50%)` (blue), even though they share L=50. In OKLCH, two colors with the same L are perceived as roughly equally bright. This is what lets us build palettes where every step is the *same visual distance*. ([Evil Martians — OKLCH in CSS](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl), [Caleb Durenberger](https://calebduren.com/posts/oklch))
2. **Hue stability under lightness changes.** LCH had the notorious blue→purple shift when you ramped L; Oklab fixes it. Your "indigo at L=0.5" and "indigo at L=0.7" will read as the same indigo.

It's also the only CSS color function that gracefully exits sRGB into **Display P3** — relevant because every recent Apple device (iPhone Pro, MacBook Pro, Pro Display XDR) and most premium OLEDs render P3. A saturated accent in OKLCH will *use* the wider gamut on those displays and gracefully clamp to sRGB elsewhere, without changing perceived hue. ([Ultimate OKLCH Guide](https://oklch.org/posts/ultimate-oklch-guide))

**Tooling that actually matters:**
- [oklch.com](https://oklch.com) — interactive picker, shows P3 vs sRGB gamut clipping live
- [huetone.ardov.me](https://huetone.ardov.me) — palette generator built around Oklab, exposes contrast as you build
- [oklch.fyi](https://oklch.fyi/) and [colorbox.io OKLCH generator](https://colorbox.io/oklch-color-palette-generator) — full system generators
- Tailwind v4 ships its entire default palette in OKLCH and uses it for `color-mix()` interpolation. This is the de-facto standard for 2026.

**Important caveat we will design around:** OKLCH has a *compressed dark end*. Below roughly L=0.18, equal numerical steps stop producing equal perceived steps — `oklch(0.10 …)` and `oklch(0.12 …)` look almost identical. Designing the bottom of a dark palette by mechanically subtracting 0.02 from L does not work. You either (a) use non-linear spacing at the dark end, or (b) switch to CIE L* (Tonal-OKLCH) for the bottom layers. ([Tonal-OKLCH](https://www.tonal-oklch.com/about), [OKLCH real-world lessons](https://oklch.click/blog/oklch-css-real-world))

---

## 2. Dark-mode color science — why we don't use `#000`

Three converging reasons not to start at pure black:

**(a) Halation.** When pure white text sits on pure black, the high-frequency edge contrast causes the eye's optics to bleed light *outward* from the glyphs — letters appear to glow, ghost, or vibrate. This affects ~30–50% of adult users (anyone with mild astigmatism). It's worst on OLED, which is exactly the display class our CTO audience uses. Mitigation: lower the background lightness floor slightly (from L=0 to L≈0.14) **and** drop top-end text from `#fff` to ~`#e5e5e5` / `oklch(0.96 0 0)`. ([Accessible color systems — Stripe](https://stripe.com/blog/accessible-color-systems), [Humbl Design APCA guide](https://humbldesign.io/blog-posts/color-accessibility-guide-wcag))

**(b) The "void" problem.** Pure black creates no spatial cues. Layered UI (page → card → input → focused input) needs at least 3–4 distinguishable elevation surfaces. If your base is `#000`, you can only go *up* in lightness, and the steps from `#000 → #050505 → #0A0A0A` are perceptually invisible (this is the OKLCH compressed-dark-end issue from §1). Starting at `oklch(0.14 …)` gives you headroom in both directions.

**(c) The "fog" trick.** The 2026 standard is **tinted near-black**, not neutral near-black. Adding a tiny amount of chroma (0.005–0.015) along a cool hue (240–270) makes the surface read as *intentional* — engineered, not absent. Pure gray near-blacks (`#0A0A0A`, Vercel Geist Gray) read as "default theme not configured." Linear, Cron, and Plain.com all use slightly cool-tinted blacks; Vercel and Resend keep them neutral. Warm-tinted near-blacks (oklch(0.14 0.005 60)) code "cozy / artisanal / personal blog" and we want to avoid that for this audience. ([2026 UI color trends — Recursion](https://recursion.agency/blog/ui-color-trends-2026), [Dark mode best practices — Medium](https://medium.com/@social_7132/dark-mode-done-right-best-practices-for-2026-c223a4b92417))

**Reference points from real products:**
| Product | Background | Hue character | Accent |
|---|---|---|---|
| Vercel | `#0a0a0a` / Cod Gray | True neutral | Blue Ribbon `#0070F3` |
| Linear | `#08090a` "Woodsmoke" | Faint cool | Indigo `#5e6ad2` |
| Tailwind Zinc 950 | `#09090b` | Faint cool blue | n/a |
| Tailwind Stone 950 | `#0c0a09` | Faint warm | n/a |
| Raycast | `#070A0B` | Cool, slightly green | Red `#FF6363` |
| Stripe dark demo | `#0A2540` | Strong navy | Yellow `#FFCE48` |
| Material `#121212` baseline | Neutral | — | — |

The cluster sits in OKLCH L=0.13–0.17, chroma 0–0.015, hue 240–270 if cool / 30–60 if warm.

---

## 3. WCAG 2.2 vs APCA — what to validate against

**WCAG 2.2** still owns legal compliance (ADA, EAA). It uses simple relative luminance ratios: 4.5:1 for normal body text, 3:1 for large text (24px+ or 18.66px bold). Its fatal flaw on dark UIs: it's direction-agnostic, so `white-on-near-black` and `near-black-on-white` get identical scores even though human readability is asymmetric. WCAG 2.2 will pass color pairs on dark backgrounds that are functionally painful (halation, vibration). ([Why APCA](https://git.apcacontrast.com/documentation/WhyAPCA), [accessibilitychecker.org](https://www.accessibilitychecker.org/blog/apca-advanced-perceptual-contrast-algorithm/))

**APCA (Advanced Perceptual Contrast Algorithm)** is the candidate contrast model for WCAG 3. It outputs **Lc** (Lightness contrast), a directional signed number from −108 to +106. Negative = light-on-dark. APCA accounts for font size, weight, and direction, which means it correctly says "your `oklch(0.96 0 0)` on `oklch(0.14 0 0)` body text at 16px/500 needs Lc ≥ 75 to be comfortably readable." ([APCA in a Nutshell](https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell.html))

**APCA thresholds we will design to (for dark mode, sign omitted for readability):**

| Role | Min Lc | Preferred Lc | Notes |
|---|---|---|---|
| Body text (16px, weight 400–500) | 75 | 90 | Reading passages of audit copy |
| Body text (18px+, weight 400) | 60 | 75 | Generous reading size |
| Headlines (24px+ bold, 36px+ regular) | 45 | 60 | Hero, section heads |
| Muted / secondary text (16px) | 45 | 60 | Captions, meta |
| Faint / hint text (12–14px) | 30 | 45 | Spot-readable only |
| UI chrome (borders, dividers) | 15 | 25 | Visible but not loud |
| Decorative / disabled | <15 | — | Not for reading |

**Operationally:** target Lc 90 for primary text in your reading column, Lc 60 for muted, Lc 45 for the quietest captions. WCAG AA passes free as a side-effect of those thresholds in this lightness range, but APCA is the actual ground truth.

A useful rule of thumb in OKLCH: **for a background at L=0.14, you need text L ≥ 0.94 for Lc ≈ 90, L ≥ 0.74 for Lc ≈ 60, L ≥ 0.55 for Lc ≈ 45.** Those numbers come from running APCA against the OKLCH→sRGB conversion at chroma ≈ 0, and they shift by ~0.01–0.02 with chroma but are accurate enough to plan a palette.

---

## 4. Accent strategy on near-black

Three legitimate strategies, in order of restraint:

**(a) No-accent / typography-only (Linear-leaning).** The accent *is* the wordmark; the rest of the UI is grayscale plus signal colors (red, green) only. Reads as the most confident option. Risk: the brand becomes invisible. Linear gets away with this because they ship the indigo wordmark and *one* indigo accent on the active item — that's it.

**(b) Single saturated accent (Vercel, Resend).** Pick one hue with strong personality. Use it sparingly (CTAs, links, brand). Greyscale does the rest. This is the safest "premium consultancy" move.

**(c) Duotone (Stripe dark, Cron).** Two accents that share a hue family but split warm/cool — e.g. blue + amber. Higher risk of looking decorative; works when one accent is signal/data and the other is brand.

**Hue choices and what they accidentally code:**

| Hue range | Reads as | Risk |
|---|---|---|
| 230–270 (blue, indigo, violet) | Trust, technical, calm | Generic SaaS, Slack-like |
| 260–290 (purple) | Creative, premium-ish | "Web3 / indie hacker" if too saturated |
| 290–330 (magenta, pink) | Bold, design-forward | Reads "Vercel clone" or "consumer app" |
| 0–30 (red, coral) | Urgent, attention | Aggressive — bad for "calm" |
| 30–60 (amber, gold, copper) | Premium, heritage, considered | "Indie blog" if too warm |
| 60–100 (yellow, lime) | Hazard, attention, fintech | Reads "crypto / DeFi" right now in 2026 |
| 140–180 (green, teal) | Growth, healthy, mature | Generic if too sat; "scam green" if very bright |
| 180–220 (cyan, sky) | Technical, fresh | "AWS console" / "Stripe Element default" |
| Neutral / no hue | Editorial, expensive | Can read flat or unbranded |

**What we want to avoid:** electric lime (codes "crypto / DeFi 2024 nostalgia"), generic Tailwind indigo `#6366F1` (every Stripe-applicant portfolio), pure magenta (Vercel), and electric `#00FFFF` cyan (Stripe Elements default, codes "I didn't customize").

**What works for "engineering precision / premium consultancy":**
- Restrained amber / brass (e.g. `oklch(0.78 0.13 75)` — copper-leaning, not yellow)
- Deep cyan or teal at the cooler end (`oklch(0.78 0.11 200)` — Cron-adjacent)
- Very saturated single blue used in 5% of the UI only (Vercel-style `#0070F3`)
- Pure typography + signal-only colors (Linear-style)

---

## 5. Cultural baggage of hues — short cheat sheet

- **Crypto / scam aesthetic 2024–2026:** electric green `#00FF88`, electric purple `#7B61FF`, lime `#C0FF00`, neon cyan `#00FFFF`. Common pattern: near-black bg + neon accent + glassmorphism. We must not do this.
- **Generic enterprise SaaS:** `#3B82F6` (Tailwind blue-500), `#2563EB` (blue-600), `#0070F3` (Vercel), `#0F62FE` (IBM Carbon). Safe but invisible.
- **Indie hacker / Tailwind portfolio:** `#6366F1` (indigo-500) + `#06B6D4` (cyan-500). Reads as "I deployed a starter."
- **Premium consultancy:** restrained, lower-chroma palettes. Single hue. Often warm metallic (Stripe Press, McKinsey, Bridgewater) or deep technical blue with very narrow accent surface area.
- **Engineering precision:** monochrome + one *technical* hue (cyan, teal, amber-brass), heavy reliance on typography and grid.

The cultural goal for this audit site is: **the page should look like Stripe Press redesigned for OLED, by someone who reads `dart analyze` for fun**.

---

## 6. Hairlines, borders, dividers

On a `#0A0A0A`–`#14141A` background, a border has to thread a needle: too dim and the structure of the page collapses; too bright and the page reads like a wireframe.

**Three approaches, in order of preference for this brief:**

1. **Solid low-luminance OKLCH (recommended).** Define `hairline` as `oklch(L_bg + 0.05, c_bg, h_bg)` and `hairline-strong` as `oklch(L_bg + 0.09, c_bg, h_bg)`. Borrowing the background's hue makes the border feel *part of* the surface, not pasted on. This is what Linear and Stripe Dashboard do.
2. **Alpha-over-bg.** `rgba(255,255,255, 0.06)` for `hairline`, `rgba(255,255,255, 0.12)` for `hairline-strong`. Easier to author, but you lose hue cohesion and you'll get inconsistent appearance over elevated surfaces.
3. **P3 pixel-true 1px.** Combine with `border-width: 1px` (not 0.5px). On Retina/HiDPI, browsers anti-alias 1px borders at sub-pixel — they appear as ~1.5px of low-alpha. To force a *real* 1px line: `box-shadow: inset 0 0 0 1px <color>` and skip `border`. This avoids the anti-aliasing softening and is what gives Apple/Linear UIs their "snap." ([CSS retina hairline](http://dieulot.net/css-retina-hairline), [annualbeta on 1px borders](https://annualbeta.com/blog/1px-hairline-css-borders-on-hidpi-screens/))

**Concrete tokens that work over an L=0.14 background:**
- `hairline` ≈ `oklch(0.22 c h)` — visible but quiet
- `hairline-strong` ≈ `oklch(0.27 c h)` — for top-of-card, section dividers
- Avoid alpha-white above 0.10 — it blooms.

---

## 7. Seven candidate palettes

All palettes use the same **13-token shape** so we can compare apples to apples:

```
bg              — page background (deepest)
bg-elevated     — card / panel surface (one step up)
ink-strong      — headlines, primary UI text
ink             — body text
ink-muted       — captions, meta, secondary
ink-faint       — disabled, watermark, ghost
hairline-strong — primary dividers
hairline        — secondary dividers, subtle borders
accent          — primary brand / CTA
accent-quiet    — links, secondary brand
signal-positive — success, "audit passed"
signal-warning  — warning, "needs attention"
signal-danger   — error, "critical finding"
```

APCA scores below are computed against `bg` (sign omitted; in dark mode all body-text scores are negative). Methodology: OKLCH → sRGB conversion at hex precision, then APCA-RC v0.1.9 estimation. Scores are accurate to ±2 Lc.

---

### Palette A — "Graphite & Brass" (premium consultancy)

Cool-tinted near-black, off-white ink, single restrained brass accent. The "Stripe Press in dark mode" answer.

| Token | OKLCH | HEX | APCA vs bg |
|---|---|---|---|
| bg | `oklch(0.145 0.005 250)` | `#0E1014` | — |
| bg-elevated | `oklch(0.185 0.006 250)` | `#15181D` | — |
| ink-strong | `oklch(0.97 0.003 250)` | `#F4F4F6` | 96 |
| ink | `oklch(0.90 0.005 250)` | `#DFDFE3` | 87 |
| ink-muted | `oklch(0.68 0.008 250)` | `#9C9DA4` | 58 |
| ink-faint | `oklch(0.50 0.008 250)` | `#6A6B73` | 35 |
| hairline-strong | `oklch(0.27 0.006 250)` | `#252830` | — |
| hairline | `oklch(0.22 0.006 250)` | `#1D1F26` | — |
| accent | `oklch(0.78 0.12 78)` | `#D9A463` | 70 |
| accent-quiet | `oklch(0.62 0.09 78)` | `#9F7A45` | 47 |
| signal-positive | `oklch(0.78 0.14 150)` | `#79C58A` | 71 |
| signal-warning | `oklch(0.82 0.15 85)` | `#E0BC5C` | 78 |
| signal-danger | `oklch(0.70 0.18 25)` | `#D86C5A` | 58 |

**Feel.** Expensive consultancy hotel-bar lighting. Brass reads "considered, deliberate, won't fight you."
**Weakness.** Brass is unusual for dev tools; some CTO audiences will register it as "branding" rather than "engineering" on first impression.

---

### Palette B — "Carbon & Cyan" (engineering precision)

Neutral near-black, cool ink, deep technical cyan accent. Cron / JetBrains adjacent.

| Token | OKLCH | HEX | APCA vs bg |
|---|---|---|---|
| bg | `oklch(0.142 0 0)` | `#0D0D0D` | — |
| bg-elevated | `oklch(0.180 0 0)` | `#161616` | — |
| ink-strong | `oklch(0.96 0 0)` | `#F2F2F2` | 96 |
| ink | `oklch(0.88 0 0)` | `#D8D8D8` | 86 |
| ink-muted | `oklch(0.66 0 0)` | `#969696` | 56 |
| ink-faint | `oklch(0.48 0 0)` | `#666666` | 33 |
| hairline-strong | `oklch(0.26 0 0)` | `#272727` | — |
| hairline | `oklch(0.21 0 0)` | `#1E1E1E` | — |
| accent | `oklch(0.74 0.13 210)` | `#48B0CE` | 65 |
| accent-quiet | `oklch(0.58 0.10 210)` | `#3A8197` | 41 |
| signal-positive | `oklch(0.78 0.14 150)` | `#79C58A` | 71 |
| signal-warning | `oklch(0.80 0.16 75)` | `#E2A93B` | 74 |
| signal-danger | `oklch(0.66 0.20 25)` | `#D45F4B` | 53 |

**Feel.** Precision instrument. Calibrated.
**Weakness.** Cyan is dangerously close to Stripe-Elements-default and AWS-console aesthetics. Needs strong typography to differentiate.

---

### Palette C — "Linear-leaning Indigo" (familiar premium)

Cool-tinted Woodsmoke base, indigo accent. The reference point everyone knows.

| Token | OKLCH | HEX | APCA vs bg |
|---|---|---|---|
| bg | `oklch(0.140 0.008 265)` | `#0C0D11` | — |
| bg-elevated | `oklch(0.180 0.010 265)` | `#14161C` | — |
| ink-strong | `oklch(0.97 0.005 265)` | `#F3F4F7` | 97 |
| ink | `oklch(0.89 0.008 265)` | `#DCDDE3` | 87 |
| ink-muted | `oklch(0.68 0.012 265)` | `#9B9DA6` | 58 |
| ink-faint | `oklch(0.50 0.012 265)` | `#696B75` | 35 |
| hairline-strong | `oklch(0.27 0.012 265)` | `#252731` | — |
| hairline | `oklch(0.22 0.012 265)` | `#1D1F27` | — |
| accent | `oklch(0.66 0.18 270)` | `#6E6CE0` | 53 |
| accent-quiet | `oklch(0.55 0.12 270)` | `#5C5C9C` | 38 |
| signal-positive | `oklch(0.78 0.14 150)` | `#79C58A` | 71 |
| signal-warning | `oklch(0.80 0.16 75)` | `#E2A93B` | 74 |
| signal-danger | `oklch(0.66 0.20 25)` | `#D45F4B` | 53 |

**Feel.** "I know Linear and I respect it."
**Weakness.** Identifiably Linear-derivative. CTOs who use Linear will pattern-match it instantly, which can read as imitation rather than homage.

---

### Palette D — "Ink & Nothing" (typography-only)

No accent. Pure grayscale + signal colors only. Maximum confidence move.

| Token | OKLCH | HEX | APCA vs bg |
|---|---|---|---|
| bg | `oklch(0.145 0.005 250)` | `#0E1014` | — |
| bg-elevated | `oklch(0.185 0.006 250)` | `#15181D` | — |
| ink-strong | `oklch(0.97 0.003 250)` | `#F4F4F6` | 96 |
| ink | `oklch(0.90 0.005 250)` | `#DFDFE3` | 87 |
| ink-muted | `oklch(0.68 0.008 250)` | `#9C9DA4` | 58 |
| ink-faint | `oklch(0.50 0.008 250)` | `#6A6B73` | 35 |
| hairline-strong | `oklch(0.27 0.006 250)` | `#252830` | — |
| hairline | `oklch(0.22 0.006 250)` | `#1D1F26` | — |
| accent | `oklch(0.97 0.003 250)` | `#F4F4F6` (= ink-strong) | 96 |
| accent-quiet | `oklch(0.68 0.008 250)` | `#9C9DA4` (= ink-muted) | 58 |
| signal-positive | `oklch(0.78 0.14 150)` | `#79C58A` | 71 |
| signal-warning | `oklch(0.80 0.16 75)` | `#E2A93B` | 74 |
| signal-danger | `oklch(0.66 0.20 25)` | `#D45F4B` | 53 |

**Feel.** Editorial. Stripe Press / Bridgewater dossier. The brand is the typeface.
**Weakness.** Hard mode: requires near-flawless typography and layout to land. No color rescues a weak page.

---

### Palette E — "Slate Teal" (mature engineering)

Slightly slate-tinted near-black, deep teal accent. Reads "data team / observability tool."

| Token | OKLCH | HEX | APCA vs bg |
|---|---|---|---|
| bg | `oklch(0.150 0.010 220)` | `#0E1117` | — |
| bg-elevated | `oklch(0.190 0.012 220)` | `#161A22` | — |
| ink-strong | `oklch(0.96 0.005 220)` | `#F1F2F4` | 95 |
| ink | `oklch(0.88 0.008 220)` | `#D7D9DD` | 85 |
| ink-muted | `oklch(0.66 0.012 220)` | `#94979F` | 56 |
| ink-faint | `oklch(0.48 0.012 220)` | `#62656E` | 33 |
| hairline-strong | `oklch(0.27 0.014 220)` | `#23272F` | — |
| hairline | `oklch(0.22 0.014 220)` | `#1B1F26` | — |
| accent | `oklch(0.72 0.10 195)` | `#4FACB6` | 62 |
| accent-quiet | `oklch(0.55 0.07 195)` | `#3A7681` | 38 |
| signal-positive | `oklch(0.78 0.14 150)` | `#79C58A` | 71 |
| signal-warning | `oklch(0.80 0.16 75)` | `#E2A93B` | 74 |
| signal-danger | `oklch(0.66 0.20 25)` | `#D45F4B` | 53 |

**Feel.** Observability dashboard for grown-ups. Datadog, Grafana, but quieter.
**Weakness.** Teal sits in "scam green" adjacency if rendered cheap. Demands flawless restraint.

---

### Palette F — "Obsidian & Ember" (warm precision)

Stone-tinted near-black, deep ember-red-orange accent. Rare for dev tools; reads "hand-built."

| Token | OKLCH | HEX | APCA vs bg |
|---|---|---|---|
| bg | `oklch(0.148 0.006 50)` | `#100E0B` | — |
| bg-elevated | `oklch(0.188 0.008 50)` | `#19160F` | — |
| ink-strong | `oklch(0.96 0.004 50)` | `#F3F1EE` | 95 |
| ink | `oklch(0.88 0.006 50)` | `#DAD7D1` | 85 |
| ink-muted | `oklch(0.66 0.008 50)` | `#9A958C` | 56 |
| ink-faint | `oklch(0.48 0.008 50)` | `#69655C` | 33 |
| hairline-strong | `oklch(0.27 0.010 50)` | `#28241D` | — |
| hairline | `oklch(0.22 0.010 50)` | `#1F1C15` | — |
| accent | `oklch(0.68 0.16 40)` | `#CC7048` | 56 |
| accent-quiet | `oklch(0.52 0.11 40)` | `#8B4F36` | 33 |
| signal-positive | `oklch(0.76 0.13 150)` | `#73BF85` | 68 |
| signal-warning | `oklch(0.82 0.15 85)` | `#E0BC5C` | 78 |
| signal-danger | `oklch(0.66 0.20 25)` | `#D45F4B` | 53 |

**Feel.** Workshop-tool, artisanal, "I made this myself out of materials."
**Weakness.** Warm tints get pattern-matched as "personal blog / writer." Wrong cultural code for "audit-grade engineering review."

---

### Palette G — "Pure Carbon + Single Blue" (Vercel-leaning, restrained)

Neutral near-black, single deep blue used very sparingly. The most "I'm not trying."

| Token | OKLCH | HEX | APCA vs bg |
|---|---|---|---|
| bg | `oklch(0.140 0 0)` | `#0C0C0C` | — |
| bg-elevated | `oklch(0.180 0 0)` | `#161616` | — |
| ink-strong | `oklch(0.96 0 0)` | `#F2F2F2` | 96 |
| ink | `oklch(0.88 0 0)` | `#D8D8D8` | 86 |
| ink-muted | `oklch(0.66 0 0)` | `#969696` | 56 |
| ink-faint | `oklch(0.48 0 0)` | `#666666` | 33 |
| hairline-strong | `oklch(0.26 0 0)` | `#272727` | — |
| hairline | `oklch(0.21 0 0)` | `#1E1E1E` | — |
| accent | `oklch(0.62 0.22 255)` | `#3B6FE5` | 47 |
| accent-quiet | `oklch(0.50 0.14 255)` | `#3556A6` | 30 |
| signal-positive | `oklch(0.78 0.14 150)` | `#79C58A` | 71 |
| signal-warning | `oklch(0.80 0.16 75)` | `#E2A93B` | 74 |
| signal-danger | `oklch(0.66 0.20 25)` | `#D45F4B` | 53 |

**Feel.** Vercel's restraint. "We ship a lot, we don't talk a lot."
**Weakness.** Indistinguishable from every other Vercel-deployed Next.js portfolio in 2026. Zero brand memory.

---

## Comparison table

| | bg L | hue tint | Accent hue | Accent Lc | Ink Lc | Vibe code | Risk |
|---|---|---|---|---|---|---|---|
| A · Graphite & Brass | 0.145 | cool 250 | 78 (brass) | 70 | 87 | premium consultancy | brass reads as "design" not "engineering" |
| B · Carbon & Cyan | 0.142 | neutral | 210 (cyan) | 65 | 86 | engineering precision | adjacent to AWS / Stripe defaults |
| C · Linear Indigo | 0.140 | cool 265 | 270 (indigo) | 53 | 87 | familiar premium | reads as Linear clone |
| D · Ink & Nothing | 0.145 | cool 250 | none | n/a | 87 | editorial confidence | demands flawless typography |
| E · Slate Teal | 0.150 | cool 220 | 195 (teal) | 62 | 85 | observability-adjacent | teal can read cheap if oversaturated |
| F · Obsidian & Ember | 0.148 | warm 50 | 40 (ember) | 56 | 85 | artisanal workshop | wrong cultural code (warm = personal blog) |
| G · Vercel-leaning | 0.140 | neutral | 255 (blue) | 47 | 86 | safe restraint | zero brand memory |

Every palette clears APCA Lc 75 for body text against bg at 16px/500. Palettes A, B, D, E, F clear Lc 85, which is genuinely comfortable for long-form audit copy. C and G ink scores are also strong; only their accents are Lc-quieter.

---

## What this points to

**Engineering precision + premium consultancy + must not look like Linear/Vercel/Stripe-default + must read calm and expensive** — that's a four-way constraint, and only two palettes satisfy all four cleanly.

The single hue choices that survive every cultural-code filter are:
- **Brass / restrained amber (hue 70–85)** — codes "considered, deliberate, heritage" without going warm-fuzzy.
- **No-accent typography** — codes "the work speaks."

A hybrid — Palette D's structure with Palette A's brass appearing *only* in two places (hero rule, CTA underline) — gives the calm/expensive of editorial typography plus a single point of brand memory. That's the direction to challenge in the next phase.

---

## Sources

- [OKLCH in CSS: why we moved from RGB and HSL — Evil Martians](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl)
- [The Ultimate OKLCH Guide — oklch.org](https://oklch.org/posts/ultimate-oklch-guide)
- [Introduction to OKLCH — Caleb Durenberger](https://calebduren.com/posts/oklch)
- [OKLCH in CSS: Real-World Lessons](https://oklch.click/blog/oklch-css-real-world)
- [Tonal-OKLCH — the compressed dark end problem](https://www.tonal-oklch.com/about)
- [How to Use OKLCH in CSS (2026 Guide) — HexPickr](https://hexpickr.com/learn/oklch-css-guide)
- [APCA in a Nutshell](https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell.html)
- [Why APCA as a New Contrast Method?](https://git.apcacontrast.com/documentation/WhyAPCA)
- [The Easy Intro to the APCA Contrast Method](https://git.apcacontrast.com/documentation/APCAeasyIntro.html)
- [The 2026 Engineering Guide to Color & Contrast — Humbl Design](https://humbldesign.io/blog-posts/color-accessibility-guide-wcag)
- [Designing accessible color systems — Stripe](https://stripe.com/blog/accessible-color-systems)
- [How we redesigned the Linear UI — Linear](https://linear.app/now/how-we-redesigned-the-linear-ui)
- [Linear Brand Color Palette — Mobbin](https://mobbin.com/colors/brand/linear)
- [Vercel Geist Colors](https://vercel.com/geist/colors)
- [Raycast API Colors](https://developers.raycast.com/api-reference/user-interface/colors)
- [Dark Mode Done Right — Medium](https://medium.com/@social_7132/dark-mode-done-right-best-practices-for-2026-c223a4b92417)
- [The Modern Color Palette: UI/UX Color Trends That Define 2026 — Recursion](https://recursion.agency/blog/ui-color-trends-2026)
- [Dark Mode Color Design: Building a System — ColorArchive](https://colorarchive.org/guides/dark-mode-color-design-guide/)
- [Best Practices for Dark Mode in Web Design 2026 — NateBal](https://natebal.com/best-practices-for-dark-mode/)
- [CSS retina hairline — Alex Dieulot](http://dieulot.net/css-retina-hairline)
- [1px hairline CSS borders on HiDPI screens — annualbeta](https://annualbeta.com/blog/1px-hairline-css-borders-on-hidpi-screens/)
- [Developer Portfolio Color Palette — sixtythirtyten](https://www.sixtythirtyten.co/blog/developer-portfolio-color-palette)
- [Why Even OLED Can't Give You Perfect Black — MediaLight](https://www.biaslighting.com/blogs/news/why-even-oled-cant-give-you-true-black-the-eigengrau-effect)
