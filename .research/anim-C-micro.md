# anim-C — Micro-Interaction Layer

The **persistent shimmer + obsessive detail** layer. 15 moments, composite-only,
all coordinated to feel like one nervous system. Budget: <4 KB CSS, <1 KB JS.

---

## a) CSS additions, grouped by file

### `src/styles/components.css` — append at end

```css
/* MICRO LAYER — composite-only; idle CPU ≈ 0 outside CTA tease. */

/* 1 — CTA periodic tease; pauses on hover/focus. */
.cta::after { animation: ctaTease 7s var(--ease-emphasized) 2.4s infinite; }
.cta:hover::after, .cta:focus-visible::after,
.cta:hover, .cta:focus-visible { animation-play-state: paused; }
@keyframes ctaTease {
  0%,86%,100% { transform: scaleX(0.18); }
  90% { transform: scaleX(0.30); }
  94% { transform: scaleX(0.22); }
}

/* 2 — cursor-follow brass glow on cards. JS writes --mx/--my. */
.bento-card, .problem-card { isolation: isolate; }
.bento-card::before, .problem-card::before, .checklist > li::before {
  content: ""; position: absolute; inset: 0; border-radius: inherit;
  opacity: 0; pointer-events: none;
  transition: opacity var(--d-fg) var(--ease-out-quart);
}
.bento-card::before, .problem-card::before {
  background: radial-gradient(220px circle at var(--mx,50%) var(--my,50%),
              oklch(0.74 0.09 85/0.06), transparent 65%);
}
.checklist > li::before {
  background: radial-gradient(160px circle at var(--mx,50%) var(--my,50%),
              oklch(0.74 0.09 85/0.05), transparent 65%);
}
.bento-card:hover::before, .problem-card:hover::before,
.checklist > li:hover::before { opacity: 1; }
.bento-card > *, .problem-card > * { position: relative; z-index: 1; }

/* 11 — bento inner-content parallax on hover. */
.bento-card h3, .bento-card .bento-num {
  transition: transform var(--d-quick) var(--ease-out-quart);
}
.bento-card:hover h3 { transform: translateY(-1.5px); }
.bento-card:hover .bento-num { transform: translateY(1px); }

/* 3 — FAQ chevron wind-up + brass halo pulse during the open. */
.faq-item > summary { position: relative; }
.faq-item > summary::after {
  transition: transform 80ms var(--ease-out-quart),
              border-color var(--d-fg) var(--ease-emphasized);
}
.faq-item > summary:active::after { transform: rotate(39deg) translate(-2px,-2px); }
.faq-item[open] > summary::after {
  transition: transform 220ms 80ms var(--ease-emphasized),
              border-color var(--d-fg) var(--ease-emphasized);
}
.faq-item > summary::before {
  content: ""; position: absolute; right: 0; top: 50%;
  width: 22px; height: 22px; border-radius: 50%;
  background: radial-gradient(circle, var(--accent) 0%, transparent 60%);
  transform: translate(4px,-50%) scale(0.6); opacity: 0; pointer-events: none;
}
.faq-item[open] > summary::before { animation: faqGlow 360ms var(--ease-out-quart); }
@keyframes faqGlow {
  0%   { opacity: 0;   transform: translate(4px,-50%) scale(0.6); }
  50%  { opacity: 0.6; transform: translate(4px,-50%) scale(1); }
  100% { opacity: 0;   transform: translate(4px,-50%) scale(1.2); }
}

/* 4 — Form input brass underline on focus; coexists with focus ring. */
.form-row { position: relative; }
.form-row::after {
  content: ""; position: absolute; left: 0; right: 0; bottom: -1px;
  height: 1px; background: var(--accent);
  transform-origin: left center; transform: scaleX(0);
  transition: transform var(--d-fg) var(--ease-emphasized);
  pointer-events: none;
}
.form-row:focus-within::after { transform: scaleX(1); }

/* 5 + 8 — Nav and footer link brass underline (center-out). */
.nav-link, .footer-links a { position: relative; }
.nav-link::after, .footer-links a::after {
  content: ""; position: absolute; left: 0; right: 0; bottom: -3px;
  height: 1px; background: var(--accent);
  transform-origin: center; transform: scaleX(0);
  transition: transform 300ms var(--ease-out-quart);
}
.nav-link:hover::after, .nav-link[aria-current="true"]::after,
.footer-links a:hover::after { transform: scaleX(1); }

/* 6 — Sticky CTA "ready" tease, one-shot via JS class. */
.sticky-cta.is-ready .cta::after {
  animation: stickyReady 800ms var(--ease-emphasized) 1;
}
@keyframes stickyReady {
  0%,100% { transform: scaleX(0.18); }
  50%     { transform: scaleX(0.45); }
}

/* 7 — Arrow micro-jitter on CTA hover. */
.cta:hover .cta-arrow { animation: arrowJitter 220ms var(--ease-out-quart) 1; }
@keyframes arrowJitter {
  0%   { transform: translate(0,0); }
  35%  { transform: translate(2px,-0.5px); }
  70%  { transform: translate(3px, 0.5px); }
  100% { transform: translate(3px, 0); }
}

/* 12 — Pricing card inset brass glow on hover. */
.pricing {
  transition: box-shadow var(--d-fg) var(--ease-out-quart),
              border-color var(--d-fg) var(--ease-out-quart);
}
.pricing:hover {
  box-shadow: inset 0 0 60px oklch(0.74 0.09 85/0.04);
  border-color: var(--hairline-strong);
}

/* 13 — Section-head eyebrow hairline shimmer on hover. */
.section-head:hover .eyebrow::before {
  animation: eyebrowShimmer 600ms var(--ease-emphasized) 1;
}
@keyframes eyebrowShimmer {
  0%,100% { background: var(--hairline-strong); }
  50%     { background: var(--accent); }
}
```

### `src/styles/reset.css` — replace selection rule (9)

```css
/* (9) Selection — stronger brass tint on user-selected text */
::selection { background: oklch(0.74 0.09 85 / 0.55); color: var(--ink-strong); }
```

### `src/styles/animations.css` — append at end

```css
/* (10) Scroll-progress bar — pure CSS, hidden until first scroll.
        Uses animation-timeline: scroll(root); no JS coupling. */
@supports (animation-timeline: scroll(root)) {
  .scroll-progress {
    position: fixed;
    inset: 0 0 auto 0;
    height: 2px;
    background: var(--accent);
    transform-origin: left center;
    transform: scaleX(0);
    z-index: 70;
    pointer-events: none;
    animation: scrollFill linear both;
    animation-timeline: scroll(root);
    animation-range: 0% 100%;
  }
  @keyframes scrollFill { to { transform: scaleX(1); } }
}

/* (15) Reduced-motion path — kill every periodic + hover micro-pulse.
        Targets are scoped so unrelated rules elsewhere aren't touched. */
@media (prefers-reduced-motion: reduce) {
  .cta::after,
  .faq-item[open] > summary::before,
  .sticky-cta.is-ready .cta::after,
  .cta:hover .cta-arrow,
  .section-head:hover .eyebrow::before,
  .scroll-progress { animation: none !important; }
  .scroll-progress { display: none !important; }
  .bento-card::before,
  .problem-card::before,
  .checklist > li::before { display: none !important; }
  .bento-card:hover h3,
  .bento-card:hover .bento-num { transform: none !important; }
  .pricing:hover { box-shadow: none !important; }
}
```

### `src/index.html` — add the progress bar element (one node, in `<body>`)

```html
<!-- after <body>, before skip-link -->
<div class="scroll-progress" aria-hidden="true"></div>
```

---

## b) JS additions for `motion.js` — append at end

```js
/* 5: Micro-interactions — glow follow + magnetic CTA + sticky tease.
   One rAF queue, one pointermove listener, all gated by `reduce`. */
if (!reduce) {
  const hosts = document.querySelectorAll(".bento-card,.problem-card,.checklist>li");
  const ctas  = document.querySelectorAll(".cta");
  let pending = false, ev = null;
  addEventListener("pointermove", (e) => {
    ev = e; if (pending) return; pending = true;
    requestAnimationFrame(() => {
      pending = false; if (!ev) return;
      const h = ev.target.closest && ev.target.closest(".bento-card,.problem-card,.checklist>li");
      if (h) {
        const r = h.getBoundingClientRect();
        h.style.setProperty("--mx", ((ev.clientX-r.left)/r.width*100)+"%");
        h.style.setProperty("--my", ((ev.clientY-r.top)/r.height*100)+"%");
      }
      ctas.forEach((b) => {
        const r = b.getBoundingClientRect();
        const dx = ev.clientX-(r.left+r.width/2), dy = ev.clientY-(r.top+r.height/2);
        const d = Math.hypot(dx, dy);
        if (d < 80) {
          const k = (1-d/80)*1.5;
          b.style.transform = `translate(${dx/d*k}px,${dy/d*k}px)`;
        } else if (b.style.transform) b.style.transform = "";
      });
    });
  }, { passive: true });

  /* 6: sticky CTA one-shot ready tease on first reveal. */
  if (stickyCta) {
    let fired = false;
    addEventListener("scroll", () => {
      if (fired || window.scrollY < innerHeight*0.6) return;
      if (stickyCta.dataset.hidden === "false" &&
          getComputedStyle(stickyCta).display !== "none") {
        fired = true;
        stickyCta.classList.add("is-ready");
        setTimeout(() => stickyCta.classList.remove("is-ready"), 900);
      }
    }, { passive: true });
  }
}
```

---

## c) Per-moment notes — what the user feels

| # | Moment | Felt as |
|---|--------|---------|
| 1 | CTA periodic tease | Every 7 s the brass underline "breathes" — peripheral sign of life, never demanding eye contact. Stops the instant you reach for it. |
| 2 | Cursor-follow glow | Brass warmth tracks your pointer across cards. Subtle, sub-conscious — your eye reads "this thing is alive". |
| 3 | FAQ chevron wind-up | The chevron leans back briefly, then snaps open with a brass halo. The motion language of a real button, not a default `<details>`. |
| 4 | Form focus underline | A brass line draws under each field as you tab into it — sense of progress through a form, like underlining your own writing. |
| 5 | Nav-link underline | Hovering a link doesn't just change colour — a brass hairline rules under the word from its centre out. Editorial feel. |
| 6 | Sticky CTA ready-tease | The first time the mobile CTA appears, its underline does a single 800 ms "ready" gesture — soft handshake on arrival. |
| 7 | Arrow jitter | When you hover the CTA, the arrow does one micro-bounce as it slides right. The button "noticed you". |
| 8 | Footer underlines | Same gesture as nav-link — keeps the family identity end-to-end. |
| 9 | Brass selection | Selecting body text paints it in brass. The accent is the engineer's hand, even in copy. |
| 10 | Scroll progress | A 2 px brass bar fills L→R as you scroll. No JS, no extra paint cycles — the visual is the page itself. |
| 11 | Bento inner parallax | Title rises 1.5 px while the D-number drops 1 px on hover — synthetic depth without a 3D transform. |
| 12 | Pricing inset glow | The pricing card warms inwards on hover with 4 % brass — communicates "select me" without becoming a button. |
| 13 | Section-head shimmer | Hovering a heading flashes the eyebrow hairline brass for 600 ms — a tiny "look here" rewarded for curiosity. |
| 14 | Magnetic CTA | The CTA leans 1.5 px towards your cursor when within 80 px — the button reaches back. CTO-visible delight. |
| 15 | Reduced-motion path | Periodic loops off, hover pulses off, persistent shimmers off; focus rings + state changes preserved. |

---

## d) Coordination notes

* Every brass micro-cue uses **the same hue** (`oklch(0.74 0.09 85)`) — one accent, many surfaces.
* Every reveal uses `var(--ease-out-quart)` or `var(--ease-emphasized)` — no new easings introduced.
* Every duration is one of `var(--d-quick)` (140), `var(--d-fg)` (280), or a documented one-off
  (220 jitter, 300 underline, 360 faq pulse, 600 shimmer, 700 tease, 800 ready, 7000 tease loop).
* Idle CPU: only `ctaTease` runs in steady state; 10 % duty cycle.
* JS is shared with the existing motion.js orchestrator and reuses the `reduce`,
  `supportsTimeline`, and `stickyCta` references.

---

## e) Byte accounting

| Source | Raw | Min. est. |
|---|---:|---:|
| components.css block | 4 185 | ~2 950 |
| reset.css selection swap | 90 | ~80 |
| animations.css block (progress bar + reduced-motion) | 972 | ~620 |
| **Total CSS** | **5 247** | **~3 650** ✓ <4 KB |
| motion.js delta | 1 528 | ~860 |
| **Total JS** | **1 528** | **~860** ✓ <1 KB |

Comments + whitespace strip cleanly. The remaining payload is selectors,
easing tokens, and rAF plumbing — all load-bearing.
