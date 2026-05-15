# P21 — Integral Audit (Final Validator)

**Date:** 2026-05-16
**Build:** http://localhost:8123/ (minified, served at 58,692 B HTML)
**Lighthouse:** 100/100/100/100 mobile (asserted, not re-verified here)
**Auditor's posture:** hostile. The page is being read as one composition, not a list of features.

**Verdict: SHIP-WITH-FIXES.** Two contradictions are load-bearing enough that they break the page's central claim (calm, restrained, two-accent doctrine). The rest are minor.

---

## 1. Animation × Copy — does the motion *feel* like the page says it is?

The copy promises: "Five days. One senior engineer. A ranked fix list..." Restrained, declarative, no theatre. The hero promises calm engineering by example.

**What actually happens on first paint:**

- `hero.css:181` — the caret fades in at 740ms, then **blinks 5 times** (`caretBlink 1.2s steps(2) 900ms 5 forwards`). Five blinks = 6 seconds of pulsing brass after the headline lands.
- Hero stagger from 60ms → 640ms (8 separate `animation-delay` rules, `hero.css:79–86`). That's nine elements arriving in sequence.
- The dot grid fades in over 1200ms (`hero.css:35`, `--d-slow`).
- The hero hairline draws (460ms).
- Below the fold, every section uses `revealLift` (translateY 12px, fade) with per-card stagger via `view-timeline` ranges.

**The contradiction:** A blinking caret is performative motion. It draws attention to itself without serving the message. The headline "Without a rewrite." is a statement of restraint — pulsing a brass bar next to it for 6 seconds is the page contradicting itself. A typewriter-effect-caret is on the anti-pattern list (`04-anti-patterns.md:31` — "Typewriter-effect hero"). The implementation here is a single static-position caret, not word-cycling, so it's a softer version of the same pattern, but it's still the page winking at the user.

The doctrine §6 rule 4 reads: *"No motion is decoration. Every animation either signals causality, communicates structure, or rewards the scroll. If we can delete it and the page is no worse, we delete it."* The caret blink fails that test. Delete the blink (keep the bar) and the page is not worse — arguably better.

**Stagger choreography is otherwise honest.** The 60–80ms cascade on cards is below threshold for "performative," and the type stack lands at ~920ms which is faster than most marketing hero entrances. The rest passes.

---

## 2. Doctrine §12 anti-pattern walkthrough

Line-by-line against `.design/DOCTRINE.md:204–217`:

| Pattern | Status | Evidence |
|---|---|---|
| Scrolljacking / scroll-hijack | ABSENT | No `scroll-snap-type` enforcement, no `preventDefault` on wheel. `reset.css:27` sets `scroll-behavior: smooth` only for anchor jumps. |
| Marquee logo strip | ABSENT | Verified. No `<marquee>`, no logos. Hero trust line is text-only ("Series A through Series C teams · NDA on request"). |
| "Selected Works" / fake case studies | ABSENT | Verified. The "Proof" section was deliberately replaced by §4 Philosophy. The original IA in §5 of the doctrine listed `#proof` but the live IA dropped it. Doctrine is stale here, not the page. |
| "Contact for pricing" | ABSENT | `index.html:406` carries `$4,800 USD · from` plus reassurance. JSON-LD also exposes `price: 4800`. |
| Em-dash spam | **3 visible to reader, all defensible** | Body: byline + checklist item 09. Title tag: subtitle separator. Doctrine "drop them" was aimed at *prose clusters* (the LinkedIn-AI-pattern). Two single-em-dash sentences across ~1,700 words is not spam. *Pass with note.* |
| Countdowns / fake scarcity | ABSENT | Verified. |
| Phone field on form | ABSENT | Name / email / repo / symptom. Exactly the doctrine. |
| Removed focus outlines | **PARTIAL VIOLATION** | `reset.css:12` correctly sets `:focus-visible { outline: 0; box-shadow: var(--focus-ring); }`. **But** `components.css:217` and `components.css:280` set `outline: none` on `summary` and on form inputs *without a paired :focus-visible replacement.* The FAQ summaries and form inputs have no visible focus ring at all when keyboard-tabbed. This is the WCAG hit. |
| Em-dash spam in copy | see above | |
| Glassmorphism | PARTIAL | Nav uses `backdrop-filter: saturate(140%) blur(12px)` (`components.css:18`), sticky CTA same (`components.css:477`). The doctrine bans "glassmorphism cards" — these are chrome bars, not cards. Defensible, but the doctrine should say so out loud. |
| Neon, gradient orbs, Lottie, marquee, parallax astronaut, magnetic cursor, tilt-on-hover, scrolljack, popup, exit-intent | ABSENT | Verified. |
| Newsletter sign-up disguised | ABSENT | Form is plainly labelled "Send me your repo" / "What is hurting most right now?" — clearly an audit intake. Hint text says "I reply from a real address. No marketing list." |

**One real anti-pattern slipped in:** `outline: none` on `summary` + `input:focus` without a `:focus-visible` fallback on those two surfaces. The global `:focus-visible` selector in `reset.css` *should* still match because specificity is identical, but `outline:none` on `.faq-item > summary` and `.form input:focus` overrides the inherited outline. The box-shadow ring from `--focus-ring` *will* still apply because it's set in `reset.css :focus-visible`, but verify in DevTools. If the cascade order kills it, this is a CATASTROPHIC accessibility regression flagged in `.research/04-anti-patterns.md:191`.

---

## 3. IA × visible page

**Committed IA (DOCTRINE §5):** Hero → Problem → Deliverables → Checklist → Philosophy → Process → Pricing → FAQ → About → Book.

**Live IA (`index.html`):**

| # | Section | ID | Lines |
|---|---|---|---|
| 1 | Hero | `#top` | 182–220 |
| 2 | Problem | `#problem` | 225–250 |
| 3 | Deliverables | `#deliverables` | 255–301 |
| 3b | Checklist | `#checklist` | 307–332 |
| 4 | Philosophy | `#philosophy` | 337–349 |
| 5 | Process | `#process` | 354–392 |
| 6 | Pricing | `#pricing` | 397–422 |
| 7 | FAQ | `#faq` | 427–461 |
| 8 | About | `#about` | 466–492 |
| 9 | Book | `#book` | 497–548 |

**Match: exact.** Pass.

**Sticky nav reveal-on-upscroll** (`motion.js:21–32`):
- Below 80vh: always revealed (sets `revealed = true`).
- Scroll down past +6px: hide.
- Scroll up past −6px: show.

Reads correctly. The desktop nav hides on downscroll, returns on upscroll, with a 6px hysteresis to prevent jitter. Pass.

**Sticky mobile CTA** (`components.css:471–487`): `display: none` by default; `display: grid` only at `max-width: 720px`. Pass.

**Edge case noted:** the desktop nav uses `position: sticky` (`components.css:7`), which means at `y<80` it's always at the top, and at `y>80` it slides offscreen with `translateY(-100%)`. Combined with `body { padding-bottom: 88px }` at mobile, there's no double-sticky problem because the desktop nav is hidden via `display: none` on `.nav-links` only — the nav bar itself stays sticky on mobile too, but with `display: grid` collapsed to two columns (brand + CTA). Could feel busy on small phones: top nav + bottom sticky CTA together. This is a 64px + ~64px footprint on a 700px-tall viewport = 18% of vertical real estate eaten by chrome. Not a violation, but worth observing.

---

## 4. Color × content density

The page averages ~1,700 words of body copy + 12-item checklist + 5-card bento + 4 process steps + 6 FAQs. That is content-rich.

**Does it breathe?** Three pressure points:

1. **The bento grid (`index.html:263–294`).** Five cards, all carry the same `linear-gradient(180deg, var(--bg-elevated) 0%, var(--bg) 100%)` background, same `1px solid var(--hairline)` border, same `r-3` radius, same edge-meta footer. The layout class hints at asymmetry (`wide | tall | tall | wide | full`) but visually, with no varying typographic weight or color shift between them, the five cards read as **a list of five things with similar weight**, not a composition. The "bento" promise is structural variation; the visual delivery is uniform.

   **Fix candidate:** D01 (the ranked fix list, the headline deliverable) should carry slightly more visual weight — e.g. ink-strong heading 1 pt larger, or a brass underline on the D01 number specifically. Right now D05 (a roadmap that survives me leaving — the "soft" deliverable) reads with the same weight as D01.

2. **The checklist (12 items, two columns).** This works. The repeating numeric label `01–12` + mono `Grep:` / `Fix:` / `Symptom:` inline tags carry the rhythm. Good editorial restraint. Pass.

3. **The hero → problem transition.** The hero ends with a trust line (mono, faint) and immediately drops into "01 · Symptoms" — same mono treatment for eyebrow. Good continuity, no whiplash. The doctrine anti-pattern of "dark hero → bright midsection whiplash" (`04-anti-patterns.md:24`) is dodged because the entire page is one tinted near-black with a single ~5% gradient lift on the `.cta-section` (`sections.css:107`).

**Verdict on density:** breathes well except in the bento. The bento is the one spot where editorial restraint becomes editorial flatness.

---

## 5. Accent appearance audit

Walking every `var(--accent)` reference:

| # | File:line | Surface | Verdict |
|---|---|---|---|
| 1 | `hero.css:50` | `.hero-rule` background | DOCTRINE-APPROVED (appearance #2 in doctrine §3). |
| 2 | `hero.css:175` | `.hero-caret` background | UNAPPROVED. Doctrine §3 lists only CTA underline + hero rule. Hero caret is a third primary surface. |
| 3 | `components.css:43–44` | `.nav-brand::before` dot fill + border | UNAPPROVED. `accent-quiet` fill + `accent` border. This is a fourth surface, in chrome, on every page paint. |
| 4 | `components.css:109` | `.cta::after` underline | DOCTRINE-APPROVED (appearance #1). |
| 5 | `components.css:233` | `.faq-item[open] > summary::after` chevron border | FUNCTIONAL ECHO — signals "open state" — defensible as state-color, but adds a fifth surface. |
| 6 | `components.css:310` | `.form-submit::after` underline | Same pattern as CTA — arguably same appearance class as #4. Defensible. |
| 7 | `sections.css:64` | `.inline-magnet a:hover` border-bottom | UNAPPROVED. Hover-only, but it's a seventh use. |
| 8 | `layout.css:131` | `.rule-accent` utility | Unused in HTML (`grep` of `index.html` for `rule-accent` returns 0). Dead CSS, but doctrine-clean. |
| 9 | `tokens.css:110` | `--focus-ring` outer ring | FUNCTIONAL — accessibility, browser-chrome class, defensible. |
| 10 | `reset.css:13` | `::selection` background | FUNCTIONAL — browser-chrome class, defensible. |

**Tally of *primary content* appearances (not chrome, not state, not focus):**

1. CTA `::after` underline (appearance #1) — APPROVED.
2. Hero rule (appearance #2) — APPROVED.
3. **Hero caret** (appearance #3) — UNAPPROVED.
4. **Nav-brand dot** (appearance #4) — UNAPPROVED.
5. **Inline-magnet link hover border** (appearance #5) — UNAPPROVED.
6. Form-submit `::after` (same pattern as CTA — counts as same class).

**The doctrine's "two appearances" rule is violated.** The page actually runs at three primary appearances + one persistent chrome dot + one hover-only border. That's five surfaces with brass on them, not two.

**The honest path:** revise the doctrine to "**two primary appearances** (CTA underline + hero rule) + **functional echoes** (form-submit underline = same gesture; FAQ chevron + focus ring + selection = state/chrome; nav-brand dot = brand mark)." That accounts for everything *except* the hero caret and the inline-magnet hover border.

**Pre-ship fix recommendation:** kill the brass on `.hero-caret` (use `var(--ink-strong)` so the caret is a typographic mark, not a brand mark) and kill the brass on `.inline-magnet a:hover` (use `var(--ink-muted)` instead). Net result: doctrine holds at "two primary + chrome echoes."

---

## 6. Cross-browser: Safari 17 without polyfill

The doctrine §6 said "Polyfill loaded ONLY when `!CSS.supports('animation-timeline: view()')`." The implementation deleted the polyfill entirely (`motion.js:95–99` explicitly says "No CDN polyfill").

**Walk-through:**

- `animations.css:7` wraps the scroll-driven keyframes in `@supports (animation-timeline: view())`. Safari 17 fails the supports test and skips the entire block.
- `motion.js:12` reads `supportsTimeline = CSS.supports("animation-timeline: view()")`.
- `motion.js:66–79` then says: if **!supportsTimeline && !reduce**, fall back to IntersectionObserver, which toggles `.js-reveal` → `.is-in` and animates via `animations.css:60–63`'s opacity/translate transition.

**Safari 17 user sees:**
- `.js-reveal` elements start at `opacity:0; transform: translateY(10px)` (`animations.css:53–58`).
- IntersectionObserver fires when card is 5% in view and 92% from bottom.
- Card transitions to `opacity:1; transform:none` over 460ms with `--ease-emphasized`.

That works. **Safari 17 gets a graceful, functional fallback.**

**Safari 18 user sees:**
- `@supports` matches. Scroll-driven keyframes engage. `view-timeline` ranges fire.
- Also `motion.js:81–83` adds `.is-in` to every `.js-reveal` immediately on load.

Wait. Let me re-read `motion.js:81–83`:

```js
if (supportsTimeline || reduce) {
  document.querySelectorAll(".js-reveal").forEach((r) => r.classList.add("is-in"));
}
```

This forces `.is-in` on every reveal element if the browser supports timelines. So `.js-reveal` is set to `opacity:1; transform:none` immediately, **independent of scroll position**. The scroll-driven CSS then *re-animates* the same elements via the @supports block.

**Is this a conflict?** The CSS keyframe `revealLift` sets `opacity:1` at 100%. The `.is-in` class also sets `opacity:1`. The view-timeline animation will play forward as element enters and reverse as it leaves (because `linear both` is bidirectional with view-timeline). The `.is-in` class is overridden by the keyframe animation while in the timeline range. Once out of range, the animation snaps back to 0%/100% per `fill-mode: both` and the element flickers.

**Potential bug:** on Safari 18 / Chrome 115+, cards may "un-reveal" as you scroll past them quickly (the view-timeline plays in reverse on exit). The `.is-in` class is supposed to prevent that, but CSS animations win over class-set inline styles. Verify in browser. If true, this is a perceptible flicker on fast scrolls in supported browsers, while Safari 17 (which uses only IntersectionObserver + `transition`) is actually smoother because IO `unobserve(e.target)` permanently locks the reveal.

**Net:** Safari 17 is fine. Safari 18 *might* flicker. Worth a 30-second sanity check in a Safari TP build.

---

## 7. Reduced-motion walkthrough

A user with `prefers-reduced-motion: reduce`:

1. `reset.css:17–22` globally clamps `animation-duration: 0.01ms` and `transition-duration: 0.01ms`.
2. `hero.css:190–208` strips all hero transforms and instantly displays all type. The brass rule is set to `scaleX(1)`. **The caret is `display: none`** (kills the blinking entirely, good).
3. `animations.css:92–105` sets `animation: none !important; opacity:1; transform:none` on every scroll-driven element.
4. `motion.js:11` reads `reduce = matchMedia("(prefers-reduced-motion: reduce)").matches`.
5. `motion.js:66` — the IntersectionObserver fallback is skipped if `reduce` is true.
6. `motion.js:81–83` — `.js-reveal` immediately gets `.is-in` (full opacity, no transform).

**The reduced-motion user reads:**
- Everything visible on first paint, no entrance animation.
- The hero caret is gone (no blink-trigger).
- The dot grid behind the hero is at full 0.55 opacity (no scale animation).
- The brass rule is fully drawn from frame 1.
- Scrolling reveals nothing — every section is fully composed from start.

**Does the page still make sense?** Yes. The page is a sequence of textual sections. Without motion, it reads as a long-form essay — which is exactly the editorial-calm-tech promise of the doctrine. Reducing motion *enhances* the page's stated identity, which is the right outcome.

**One nit:** the hero caret is the only thing that disappears entirely. A motion-free user doesn't see "Without a rewrite.█" — they see "Without a rewrite." with no terminal mark. This is fine, but it means the brass-caret was already decorative. Another argument for downgrading it to ink-strong (see §5).

---

## 8. THE single "if anything ships broken, it's this" issue

**The focus outline regression.**

`reset.css:12` sets a global `:focus-visible` ring via box-shadow. But `components.css:217` (`summary { outline: none; }`) and `components.css:280` (`.form input:focus { outline: none; }`) explicitly remove outlines on the FAQ disclosures and form fields *without paired `:focus-visible` overrides on those same selectors*.

The `:focus-visible` rule in reset.css uses `box-shadow`, not `outline`, so technically it survives. But — and this is the trap — `components.css:280` says `.form input:focus { outline: none; }`. That's `:focus`, not `:focus-visible`. When the box-shadow ring from `:focus-visible` fires, the *outline* is already zeroed. The box-shadow on `--focus-ring` is `0 0 0 2px var(--bg), 0 0 0 4px var(--accent)`. That is **4px of brass around the focused field**. It should render.

**But the form inputs already have a background of `var(--bg-elevated)` and border of `var(--hairline)`.** The 2px inner ring in `var(--bg)` paints over the field's edge. On a dark-grey input on a dark-grey bg, the inner ring goes nearly invisible and the brass outer ring is the only visible focus signal. *That's fine.* The risk is: does box-shadow even paint over an input's own border-radius properly?

Verify in DevTools: tab into `#f-email`. Confirm a brass ring around it. Confirm the summary toggle in the FAQ gets the same ring when keyboard-focused. **If either of these silently absorbs the focus indicator, the page fails WCAG 2.4.7 and your technical buyer reads it in 30 seconds.** It is the most diagnostic single test of the site.

This is **the** ship-blocker if anything is. It's not the worst-looking risk; it's the one a CTO will check first.

---

## Summary table

| Joint | Status | Severity |
|---|---|---|
| Animation × Copy | Caret blink is performative | MAJOR (revise) |
| Anti-pattern slip-ins | `outline:none` on summary + input :focus | **MAJOR (verify focus-visible cascade)** |
| Em-dash spam | 3 visible, all single-use | PASS |
| IA order | Exact match | PASS |
| Sticky nav | Correct upscroll behaviour | PASS |
| Color density | Bento reads as a flat list | MINOR |
| Accent appearances | **5 surfaces vs doctrine's 2** | MAJOR (revise doctrine or remove caret + magnet hover) |
| Safari 17 fallback | Works | PASS |
| Safari 18 timeline | Potential exit-flicker, verify | MINOR |
| Reduced-motion | Page reads as long-form essay | PASS |
| Form intake | Plainly an audit intake, not newsletter | PASS |

---

## Integral health: **8 / 10**

The page does what the doctrine says it does. The integrity breaks in two places (caret-blink, accent-overrun), one of which is mostly an accounting problem (the doctrine undercounts what shipped). The accessibility risk is real but probably fine on inspection.

This is a serious piece of work. Ship it after the focus-ring is verified in browser and the caret-blink is killed.
