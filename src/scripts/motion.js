/* ============================================================
   motion.js v3 — JS-driven animation engine (Web Animations API)
   No reliance on CSS `animation-timeline: view()` — works in every
   browser since 2019.

   - Hero entrance: triggered on DOMContentLoaded, large magnitudes
   - Section reveals: IntersectionObserver + element.animate()
   - Pricing $0 → $4,800 scrub: rAF tween
   - Hero canvas: 60-particle constellation, cursor-reactive
   - Card 3D tilt + cursor-follow brass glow
   - Magnetic CTAs
   - Hero brass rule shimmer loop (4s cadence)
   - Scroll progress bar (rAF, no CSS dep)
   - prefers-reduced-motion → instant fade only (still visible)
   ============================================================ */

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fx = new URLSearchParams(location.search).has("fx") ||
           new URLSearchParams(location.search).has("motion");
const ANIMATE = fx || !reduce;

/* Named easings */
const E = {
  emphasized: "cubic-bezier(0.05, 0.7, 0.1, 1)",
  outQuart:   "cubic-bezier(0.25, 1, 0.5, 1)",
  linear:     "linear",
  /* Spring linear() for line 3 overshoot */
  spring: "linear(0, 0.009, 0.035 2.1%, 0.141 4.4%, 0.55 10.6%, 0.717 13.6%, 0.864 17%, 1.005 20.1%, 1.063 22.3%, 1.094, 1.114, 1.123, 1.123, 1.117, 1.107 33.7%, 1.084 37.5%, 1.027 47%, 1.005 53%, 0.989 60%, 0.984 71%, 0.998 100%)",
};

/* WAAPI sugar */
const fly = (el, kf, opts) => {
  if (!el) return null;
  const a = el.animate(kf, { fill: "forwards", easing: E.emphasized, ...opts });
  return a;
};

/* When reduced-motion is on, deliver an instant fade so users still see
   the element appear (otherwise people without animations think the page
   is broken). 100 ms is below vestibular-trigger thresholds. */
const enterDuration = (n) => ANIMATE ? n : 100;

/* ─────────────────────────────────────────────────────────────
   1. HERO ENTRANCE — fires on DOMContentLoaded, large magnitudes,
      multi-phase, all JS via element.animate().
   ───────────────────────────────────────────────────────────── */
function heroEntrance() {
  /* 1a — page-horizon hairline draw + shimmer */
  const horizon = document.querySelector(".hero-hairline");
  if (horizon) {
    fly(horizon, [
      { transform: "scaleX(0)", opacity: 0 },
      { transform: "scaleX(1)", opacity: 1 },
    ], { duration: enterDuration(900), delay: 50, easing: E.outQuart });
  }

  /* 1b — Eyebrow letter-tracking + fade */
  const eyebrow = document.querySelector(".hero-eyebrow-text");
  if (eyebrow) {
    fly(eyebrow, [
      { opacity: 0, letterSpacing: "0.4em", transform: "translateY(6px)" },
      { opacity: 1, letterSpacing: "0.12em", transform: "translateY(0)" },
    ], { duration: enterDuration(800), delay: 180, easing: E.outQuart });
  }

  /* 1c — Byline (avatar + line) */
  const byline = document.querySelector(".hero-byline");
  if (byline) {
    fly(byline, [
      { opacity: 0, transform: "translateY(16px)" },
      { opacity: 1, transform: "translateY(0)" },
    ], { duration: enterDuration(700), delay: 320, easing: E.emphasized });
  }

  /* 1d — Headline lines (clip-and-roll up from below) */
  document.querySelectorAll(".hero-headline .line-inner").forEach((line, i) => {
    const isLast = i === 2;
    fly(line, [
      { transform: "translateY(110%)" },
      { transform: "translateY(0)" },
    ], {
      duration: enterDuration(isLast ? 900 : 700),
      delay: 480 + i * 160,
      easing: isLast ? E.spring : E.emphasized,
    });
  });

  /* 1e — Brass rule draw */
  const rule = document.querySelector(".hero-rule");
  if (rule) {
    fly(rule, [
      { transform: "scaleX(0)" },
      { transform: "scaleX(1)" },
    ], { duration: enterDuration(560), delay: 1050, easing: E.outQuart });

    /* Brass rule shimmer — 4s cadence, infinite, low duty cycle */
    if (ANIMATE) {
      const shimmer = document.createElement("span");
      shimmer.className = "hero-rule-shimmer";
      Object.assign(shimmer.style, {
        position: "absolute", inset: "0",
        background: "linear-gradient(90deg, transparent 0%, oklch(0.97 0.06 85 / 0.95) 50%, transparent 100%)",
        transform: "translateX(-100%)",
        pointerEvents: "none",
      });
      rule.appendChild(shimmer);
      shimmer.animate(
        [
          { transform: "translateX(-100%)", offset: 0 },
          { transform: "translateX(-100%)", offset: 0.78 },
          { transform: "translateX(100%)",  offset: 0.95 },
          { transform: "translateX(100%)",  offset: 1 },
        ],
        { duration: 4200, iterations: Infinity, easing: E.linear, delay: 1700 }
      );
    }
  }

  /* 1f — Foreground stack: lede, CTAs, trust line */
  [".hero-lede", ".hero-ctas", ".hero-trust"].forEach((sel, i) => {
    const el = document.querySelector(sel);
    if (!el) return;
    fly(el, [
      { opacity: 0, transform: "translateY(20px)" },
      { opacity: 1, transform: "translateY(0)" },
    ], { duration: enterDuration(700), delay: 1200 + i * 140, easing: E.emphasized });
  });

  /* 1g — Caret materialise + pulse */
  const caret = document.querySelector(".hero-caret");
  if (caret) {
    fly(caret, [
      { opacity: 0, transform: "scaleY(0.5)" },
      { opacity: 1, transform: "scaleY(1)" },
    ], { duration: enterDuration(260), delay: 1500, easing: E.outQuart });
    if (ANIMATE) {
      caret.animate(
        [{ opacity: 1 }, { opacity: 0.55 }, { opacity: 1 }],
        { duration: 2400, iterations: Infinity, delay: 2200, easing: "ease-in-out" }
      );
    }
  }

  /* 1h — One-shot headline shimmer pass (across the whole H1) */
  if (ANIMATE) {
    const h1 = document.querySelector(".hero-headline");
    if (h1) {
      const shim = document.createElement("span");
      shim.className = "hero-h1-shimmer";
      Object.assign(shim.style, {
        position: "absolute", inset: "0",
        background: "linear-gradient(105deg, transparent 38%, oklch(0.97 0 0 / 0.22) 50%, transparent 62%)",
        pointerEvents: "none",
        transform: "translateX(-30%)",
        mixBlendMode: "screen",
      });
      h1.style.position = h1.style.position || "relative";
      h1.appendChild(shim);
      shim.animate(
        [
          { transform: "translateX(-30%)", opacity: 0 },
          { transform: "translateX(-10%)", opacity: 1, offset: 0.3 },
          { transform: "translateX(30%)",  opacity: 0 },
        ],
        { duration: 1100, delay: 1800, fill: "forwards", easing: E.outQuart }
      );
    }
  }
}

/* ─────────────────────────────────────────────────────────────
   2. SCROLL REVEALS — IntersectionObserver + WAAPI for every
      element across every section. Larger magnitudes than CSS.
   ───────────────────────────────────────────────────────────── */
function setupReveals() {
  /* Each rule: selector, anim fn, opts.
     Initial state is set via style so the element is invisible until
     the IO fires, even on browsers that previously fired CSS animations. */
  const rules = [
    { sel: ".section-head .eyebrow",
      init: { opacity: 0, letterSpacing: "0.4em", transform: "translateY(8px)" },
      kf: [
        { opacity: 0, letterSpacing: "0.4em", transform: "translateY(8px)" },
        { opacity: 1, letterSpacing: "0.12em", transform: "translateY(0)" },
      ],
      opts: { duration: 800, easing: E.outQuart },
    },
    { sel: ".section-head h2",
      init: { opacity: 0, transform: "translateY(34px)", clipPath: "inset(0 0 100% 0)" },
      kf: [
        { opacity: 0, transform: "translateY(34px)", clipPath: "inset(0 0 100% 0)" },
        { opacity: 1, transform: "translateY(0)", clipPath: "inset(0 0 0 0)" },
      ],
      opts: { duration: 900, easing: E.emphasized, delay: 120 },
    },
    { sel: ".section-head .lede",
      init: { opacity: 0, transform: "translateY(20px)" },
      kf: [
        { opacity: 0, transform: "translateY(20px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      opts: { duration: 700, easing: E.emphasized, delay: 260 },
    },
    /* §2 problem cards — 4-layer with stagger */
    { sel: ".problem-card",
      init: { opacity: 0, transform: "translateY(40px)" },
      stagger: 110,
      kf: [
        { opacity: 0, transform: "translateY(40px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      opts: { duration: 850, easing: E.emphasized },
      sub: [
        { sel: ".num", init: { opacity: 0, transform: "scale(0.9)" }, kf: [{ opacity: 0, transform: "scale(0.9)" }, { opacity: 1, transform: "scale(1)" }], opts: { duration: 500, easing: E.outQuart, delay: 200 } },
        { sel: "h3",   init: { opacity: 0 }, kf: [{ opacity: 0 }, { opacity: 1 }], opts: { duration: 600, delay: 350 } },
        { sel: "p:not(.num)", init: { opacity: 0 }, kf: [{ opacity: 0 }, { opacity: 1 }], opts: { duration: 700, delay: 500 } },
      ],
    },
    /* §3 bento cards — 5-layer with stagger + top hairline draw */
    { sel: ".bento-card",
      init: { opacity: 0, transform: "translateY(36px)" },
      stagger: 130,
      kf: [
        { opacity: 0, transform: "translateY(36px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      opts: { duration: 900, easing: E.emphasized },
      after: (el) => {
        /* Draw top hairline */
        const rule = document.createElement("span");
        rule.className = "bento-top-rule";
        Object.assign(rule.style, {
          position: "absolute", top: "-1px", left: "0", right: "0",
          height: "1px",
          background: "linear-gradient(90deg, transparent 0%, var(--accent) 30%, var(--accent) 70%, transparent 100%)",
          transform: "scaleX(0)",
          transformOrigin: "left center",
          pointerEvents: "none",
          zIndex: "3",
        });
        if (getComputedStyle(el).position === "static") el.style.position = "relative";
        el.appendChild(rule);
        rule.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }],
          { duration: 800, easing: E.outQuart, delay: 250, fill: "forwards" });
      },
      sub: [
        { sel: ".bento-num",       init: { opacity: 0, transform: "translateY(8px)" }, kf: [{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "translateY(0)" }], opts: { duration: 500, delay: 250, easing: E.outQuart } },
        { sel: "h3",               init: { opacity: 0, transform: "translateY(6px)" }, kf: [{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "translateY(0)" }], opts: { duration: 600, delay: 400 } },
        { sel: "p:not(.bento-num):not(.bento-card-edge)", init: { opacity: 0 }, kf: [{ opacity: 0 }, { opacity: 1 }], opts: { duration: 700, delay: 550 } },
        { sel: ".bento-card-edge", init: { opacity: 0 }, kf: [{ opacity: 0 }, { opacity: 1 }], opts: { duration: 600, delay: 700 } },
      ],
    },
    /* §3b checklist — 12 items, weaving stagger */
    { sel: ".checklist > li",
      init: (el, i) => {
        const dx = (i % 2 === 0) ? "-10px" : "10px";
        return { opacity: 0, transform: `translate(${dx}, 18px)` };
      },
      kf: (el, i) => {
        const dx = (i % 2 === 0) ? "-10px" : "10px";
        return [
          { opacity: 0, transform: `translate(${dx}, 18px)` },
          { opacity: 1, transform: "translate(0, 0)" },
        ];
      },
      stagger: 70,
      opts: { duration: 700, easing: E.emphasized },
      sub: [
        { sel: ".cl-num", init: { opacity: 0, transform: "translateY(14px) rotate(-6deg)" },
          kf: [{ opacity: 0, transform: "translateY(14px) rotate(-6deg)" }, { opacity: 1, transform: "translateY(0) rotate(0)" }],
          opts: { duration: 600, delay: 200, easing: E.outQuart } },
        { sel: "h3", init: { opacity: 0 }, kf: [{ opacity: 0 }, { opacity: 1 }], opts: { duration: 500, delay: 350 } },
        { sel: "p",  init: { opacity: 0 }, kf: [{ opacity: 0 }, { opacity: 1 }], opts: { duration: 500, delay: 450 } },
      ],
    },
    /* §4 philosophy paragraphs */
    { sel: ".philosophy p",
      init: { opacity: 0, transform: "translateY(20px)", clipPath: "inset(0 0 100% 0)" },
      stagger: 180,
      kf: [
        { opacity: 0, transform: "translateY(20px)", clipPath: "inset(0 0 100% 0)" },
        { opacity: 1, transform: "translateY(0)", clipPath: "inset(0 0 0 0)" },
      ],
      opts: { duration: 1000, easing: E.emphasized },
    },
    /* §5 process steps */
    { sel: ".process-step",
      init: { opacity: 0, transform: "translateY(28px)" },
      stagger: 140,
      kf: [
        { opacity: 0, transform: "translateY(28px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      opts: { duration: 850, easing: E.emphasized },
      sub: [
        { sel: ".process-day", init: { opacity: 0, transform: "translateY(10px)" }, kf: [{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "translateY(0)" }], opts: { duration: 600, delay: 150, easing: E.outQuart } },
      ],
    },
    /* §6 pricing */
    { sel: ".pricing",
      init: { opacity: 0, transform: "translateY(32px)" },
      kf: [
        { opacity: 0, transform: "translateY(32px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      opts: { duration: 950, easing: E.emphasized },
      after: (el) => {
        /* Trigger price scrub via rAF (called from setupPricingScrub) */
        runPricingScrub();
      },
    },
    /* §7 FAQ items */
    { sel: ".faq-item",
      init: { opacity: 0, transform: "translateY(20px)" },
      stagger: 90,
      kf: [
        { opacity: 0, transform: "translateY(20px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      opts: { duration: 700, easing: E.emphasized },
    },
    /* §8 about — portrait phases + body */
    { sel: ".portrait-frame",
      init: { opacity: 0.4, transform: "scale(1.04)", filter: "blur(8px)" },
      kf: [
        { opacity: 0.4, transform: "scale(1.04)", filter: "blur(8px)", offset: 0 },
        { opacity: 0.85, transform: "scale(1.01)", filter: "blur(2px)", offset: 0.55 },
        { opacity: 1, transform: "scale(1)", filter: "blur(0)", offset: 1 },
      ],
      opts: { duration: 1400, easing: E.emphasized },
    },
    { sel: ".about-body",
      init: { opacity: 0, transform: "translateY(24px)" },
      kf: [
        { opacity: 0, transform: "translateY(24px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      opts: { duration: 900, delay: 250, easing: E.emphasized },
    },
    /* §9 form rows */
    { sel: ".form-row",
      init: { opacity: 0, transform: "translateY(18px)" },
      stagger: 100,
      kf: [
        { opacity: 0, transform: "translateY(18px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      opts: { duration: 700, easing: E.emphasized },
    },
  ];

  rules.forEach((rule) => {
    const els = document.querySelectorAll(rule.sel);
    if (!els.length) return;

    /* Set initial state on every matched element */
    els.forEach((el, i) => {
      const init = typeof rule.init === "function" ? rule.init(el, i) : rule.init;
      Object.assign(el.style, init);
    });

    /* Set initial state on sub-elements */
    if (rule.sub) {
      els.forEach((el) => {
        rule.sub.forEach((sub) => {
          el.querySelectorAll(sub.sel).forEach((sel) => {
            const init = typeof sub.init === "function" ? sub.init(sel) : sub.init;
            Object.assign(sel.style, init);
          });
        });
      });
    }

    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        const i = Array.from(els).indexOf(e.target);
        const offset = (rule.stagger || 0) * i;
        const kf = typeof rule.kf === "function" ? rule.kf(e.target, i) : rule.kf;
        const opts = { ...rule.opts, delay: (rule.opts.delay || 0) + offset };

        const anim = e.target.animate(kf, { fill: "forwards", ...opts });
        anim.finished.then(() => {
          /* clean inline styles so hover/transitions own them again */
          const init = typeof rule.init === "function" ? rule.init(e.target, i) : rule.init;
          Object.keys(init).forEach((k) => { e.target.style[k] = ""; });
        }).catch(() => {});

        /* Trigger sub-animations */
        if (rule.sub) {
          rule.sub.forEach((sub) => {
            e.target.querySelectorAll(sub.sel).forEach((sel) => {
              const subKf = typeof sub.kf === "function" ? sub.kf(sel) : sub.kf;
              const subOpts = { ...sub.opts, delay: (sub.opts.delay || 0) + offset };
              const subAnim = sel.animate(subKf, { fill: "forwards", ...subOpts });
              subAnim.finished.then(() => {
                const sInit = typeof sub.init === "function" ? sub.init(sel) : sub.init;
                Object.keys(sInit).forEach((k) => { sel.style[k] = ""; });
              }).catch(() => {});
            });
          });
        }

        if (rule.after) rule.after(e.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });

    els.forEach((el) => io.observe(el));
  });
}

/* ─────────────────────────────────────────────────────────────
   3. PRICING SCRUB — $0 → $4,800 rAF tween (1.2s)
   ───────────────────────────────────────────────────────────── */
let pricingFired = false;
function runPricingScrub() {
  if (pricingFired) return;
  pricingFired = true;
  const digits = document.querySelector(".pricing-count-digits");
  const host = document.querySelector(".pricing-count");
  if (!digits || !host) return;
  const target = parseInt(host.dataset.pricingCount || "4800", 10);
  if (!ANIMATE) { digits.textContent = target.toLocaleString("en-US"); return; }
  const fmt = new Intl.NumberFormat("en-US");
  const dur = 1200;
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min(1, (now - start) / dur);
    /* easeOutCubic */
    const eased = 1 - Math.pow(1 - t, 3);
    digits.textContent = fmt.format(Math.round(target * eased));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  /* Brass commitment underline draw */
  const anchor = document.querySelector(".pricing-anchor");
  if (anchor) {
    let rule = anchor.querySelector(".pricing-commit-rule");
    if (!rule) {
      rule = document.createElement("span");
      rule.className = "pricing-commit-rule";
      Object.assign(rule.style, {
        position: "absolute", left: "0", right: "0", bottom: "-0.5rem",
        height: "1px", background: "var(--accent)",
        transform: "scaleX(0)", transformOrigin: "left center",
        pointerEvents: "none",
      });
      anchor.appendChild(rule);
    }
    rule.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }],
      { duration: 900, easing: E.outQuart, fill: "forwards", delay: 200 });
  }
}

/* ─────────────────────────────────────────────────────────────
   4. HERO CANVAS — 60-particle constellation, cursor-reactive
   ───────────────────────────────────────────────────────────── */
function setupHeroCanvas() {
  if (!ANIMATE) return;
  const host = document.querySelector(".hero");
  if (!host) return;
  if (host.querySelector(".hero-canvas")) return;

  const canvas = document.createElement("canvas");
  canvas.className = "hero-canvas";
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, {
    position: "absolute", inset: "0", width: "100%", height: "100%",
    zIndex: "0", pointerEvents: "none",
  });
  host.insertBefore(canvas, host.firstChild);

  const ctx = canvas.getContext("2d", { alpha: true });
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  let particles = [];
  let mouse = { x: -9999, y: -9999, active: false };
  let raf = 0;
  let running = false;

  const resize = () => {
    const w = host.clientWidth;
    const h = host.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    spawn(w, h);
  };

  const spawn = (w, h) => {
    const density = w < 720 ? 12000 : 18000;
    const count = Math.max(28, Math.min(80, Math.floor((w * h) / density)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r: 0.6 + Math.random() * 1.2,
    }));
  };

  const tick = () => {
    if (!running) { raf = 0; return; }
    const w = host.clientWidth;
    const h = host.clientHeight;
    ctx.clearRect(0, 0, w, h);

    const linkDist = 130;
    const linkSq = linkDist * linkDist;
    const mouseDist = 200;
    const mouseSq = mouseDist * mouseDist;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      p.x = Math.max(0, Math.min(w, p.x));
      p.y = Math.max(0, Math.min(h, p.y));

      /* connect to neighbours */
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < linkSq) {
          const a = (1 - d2 / linkSq) * 0.14;
          ctx.beginPath();
          ctx.strokeStyle = "rgba(217, 164, 99, " + a.toFixed(3) + ")";
          ctx.lineWidth = 0.55;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }

      /* connect to cursor */
      if (mouse.active) {
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const md2 = mdx * mdx + mdy * mdy;
        if (md2 < mouseSq) {
          const a = (1 - md2 / mouseSq) * 0.5;
          ctx.beginPath();
          ctx.strokeStyle = "rgba(232, 188, 130, " + a.toFixed(3) + ")";
          ctx.lineWidth = 0.8;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      /* dot */
      ctx.beginPath();
      ctx.fillStyle = "rgba(217, 164, 99, 0.55)";
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    raf = requestAnimationFrame(tick);
  };

  resize();
  window.addEventListener("resize", () => {
    const t = setTimeout(resize, 100);
  }, { passive: true });

  /* Pause when off-screen */
  const io = new IntersectionObserver((ents) => {
    for (const e of ents) {
      const on = e.isIntersecting;
      if (on && !running) { running = true; raf = requestAnimationFrame(tick); }
      else if (!on && running) { running = false; cancelAnimationFrame(raf); raf = 0; }
    }
  }, { threshold: 0 });
  io.observe(host);

  window.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    if (e.clientY > r.bottom || e.clientY < r.top) {
      mouse.active = false;
      return;
    }
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
    mouse.active = true;
  }, { passive: true });
  window.addEventListener("pointerleave", () => { mouse.active = false; }, { passive: true });
}

/* ─────────────────────────────────────────────────────────────
   5. SCROLL-PROGRESS BAR — rAF, no CSS scroll-timeline dep
   ───────────────────────────────────────────────────────────── */
function setupScrollProgress() {
  const bar = document.querySelector(".scroll-progress");
  if (!bar) return;
  if (!ANIMATE) { bar.style.display = "none"; return; }
  let pending = false;
  const update = () => {
    pending = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? scrollY / max : 0;
    bar.style.transform = "scaleX(" + p.toFixed(4) + ")";
    bar.style.transformOrigin = "left center";
  };
  addEventListener("scroll", () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(update);
  }, { passive: true });
  update();
}

/* ─────────────────────────────────────────────────────────────
   6. CARD 3D TILT + cursor-follow brass glow
   ───────────────────────────────────────────────────────────── */
function setupCardEffects() {
  if (!ANIMATE) return;
  const cards = document.querySelectorAll(".bento-card, .problem-card");
  let pending = false;
  let lastEv = null;
  const onMove = (e) => {
    lastEv = e;
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      if (!lastEv) return;
      cards.forEach((card) => {
        const r = card.getBoundingClientRect();
        const inX = lastEv.clientX >= r.left && lastEv.clientX <= r.right;
        const inY = lastEv.clientY >= r.top  && lastEv.clientY <= r.bottom;
        if (inX && inY) {
          const mx = ((lastEv.clientX - r.left) / r.width) * 100;
          const my = ((lastEv.clientY - r.top) / r.height) * 100;
          const rotX = ((my - 50) / 50) * -3;   /* ±3deg */
          const rotY = ((mx - 50) / 50) *  3;
          card.style.setProperty("--mx", mx + "%");
          card.style.setProperty("--my", my + "%");
          card.style.transform = "perspective(900px) rotateX(" + rotX.toFixed(2) + "deg) rotateY(" + rotY.toFixed(2) + "deg)";
          card.dataset.tilt = "1";
        } else if (card.dataset.tilt === "1") {
          card.style.transform = "";
          card.dataset.tilt = "0";
        }
      });
    });
  };
  addEventListener("pointermove", onMove, { passive: true });

  /* Checklist items — glow only, no tilt (12 items, tilt would feel too much) */
  const liItems = document.querySelectorAll(".checklist > li");
  liItems.forEach((li) => {
    li.addEventListener("pointermove", (e) => {
      const r = li.getBoundingClientRect();
      li.style.setProperty("--mx", (((e.clientX - r.left) / r.width) * 100) + "%");
      li.style.setProperty("--my", (((e.clientY - r.top) / r.height) * 100) + "%");
    }, { passive: true });
  });
}

/* ─────────────────────────────────────────────────────────────
   7. MAGNETIC CTAs — 100 px pull, rAF
   ───────────────────────────────────────────────────────────── */
function setupMagnetic() {
  if (!ANIMATE) return;
  const ctas = document.querySelectorAll(".cta, .form-submit");
  let pending = false;
  let lastEv = null;
  const update = () => {
    pending = false;
    if (!lastEv) return;
    ctas.forEach((b) => {
      const r = b.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = lastEv.clientX - cx;
      const dy = lastEv.clientY - cy;
      const d = Math.hypot(dx, dy);
      if (d < 100 && d > 0) {
        const k = (1 - d / 100) * 4;
        b.style.transform = "translate(" + (dx / d * k).toFixed(2) + "px," + (dy / d * k).toFixed(2) + "px)";
      } else if (b.style.transform) {
        b.style.transform = "";
      }
    });
  };
  addEventListener("pointermove", (e) => {
    lastEv = e;
    if (pending) return;
    pending = true;
    requestAnimationFrame(update);
  }, { passive: true });
}

/* ─────────────────────────────────────────────────────────────
   8. NAV BEHAVIOUR + form intake + sticky CTA (carried over)
   ───────────────────────────────────────────────────────────── */
function setupNav() {
  const nav = document.querySelector(".nav");
  if (!nav) return;
  let lastY = 0;
  let revealed = true;
  nav.dataset.revealed = "true";
  const onScroll = () => {
    const y = scrollY;
    nav.dataset.scrolled = y > 12 ? "true" : "false";
    if (y < 80) {
      if (!revealed) { nav.dataset.revealed = "true"; revealed = true; }
    } else if (y > lastY + 6) {
      if (revealed) { nav.dataset.revealed = "false"; revealed = false; }
    } else if (y < lastY - 6) {
      if (!revealed) { nav.dataset.revealed = "true"; revealed = true; }
    }
    lastY = y;
  };
  let queued = false;
  addEventListener("scroll", () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { onScroll(); queued = false; });
  }, { passive: true });
  onScroll();

  /* Active-section highlight */
  const links = nav.querySelectorAll(".nav-link[href^='#']");
  if (links.length) {
    const map = new Map();
    links.forEach((a) => {
      const id = a.getAttribute("href").slice(1);
      const sec = document.getElementById(id);
      if (sec) map.set(sec, a);
    });
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => {
        const a = map.get(e.target);
        if (!a) return;
        if (e.isIntersecting) {
          links.forEach((l) => l.removeAttribute("aria-current"));
          a.setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-40% 0% -55% 0%", threshold: 0 });
    map.forEach((_, sec) => io.observe(sec));
  }
}

function setupForm() {
  const form = document.querySelector("form[data-intake]");
  const stickyCta = document.querySelector("[data-sticky-cta]");
  if (form) {
    const formOpenedAt = performance.now();
    form.addEventListener("submit", (e) => {
      if (form.elements?.namedItem("company")?.value) { e.preventDefault(); return; }
      if (performance.now() - formOpenedAt < 1500) { e.preventDefault(); return; }
      const btn = form.querySelector("[type=submit]");
      if (btn) btn.textContent = "Sending…";
    });
    if (stickyCta && "IntersectionObserver" in window) {
      const target = document.getElementById("book");
      if (target) {
        new IntersectionObserver((ents) => {
          for (const e of ents) stickyCta.dataset.hidden = e.isIntersecting ? "true" : "false";
        }, { rootMargin: "-30% 0% -30% 0%", threshold: 0 }).observe(target);
      }
    }
  }
  if (stickyCta && ANIMATE) {
    let fired = false;
    addEventListener("scroll", () => {
      if (fired || scrollY < innerHeight * 0.6) return;
      if (stickyCta.dataset.hidden !== "true" && getComputedStyle(stickyCta).display !== "none") {
        fired = true;
        stickyCta.classList.add("is-ready");
        setTimeout(() => stickyCta.classList.remove("is-ready"), 900);
      }
    }, { passive: true });
  }
}

/* ─────────────────────────────────────────────────────────────
   9. PORTRAIT CAPTION — letter-by-letter on enter
   ───────────────────────────────────────────────────────────── */
function setupPortraitCaption() {
  const cap = document.querySelector(".portrait-caption");
  if (!cap || !ANIMATE) return;
  let i = 0;
  cap.querySelectorAll(":scope > span").forEach((s) => {
    const txt = s.textContent || "";
    s.textContent = "";
    for (const ch of txt) {
      const c = document.createElement("span");
      c.style.opacity = "0";
      c.style.display = "inline-block";
      c.textContent = ch === " " ? " " : ch;
      s.appendChild(c);
      c.dataset.idx = String(i++);
    }
  });
  const about = document.getElementById("about");
  if (!about) return;
  new IntersectionObserver((ents, obs) => {
    for (const e of ents) if (e.isIntersecting) {
      obs.unobserve(e.target);
      cap.querySelectorAll("span > span").forEach((c, idx) => {
        c.animate([
          { opacity: 0, transform: "translateY(4px)" },
          { opacity: 1, transform: "translateY(0)" },
        ], { duration: 320, delay: idx * 22, fill: "forwards", easing: E.outQuart });
      });
    }
  }, { rootMargin: "0% 0% -20% 0%", threshold: 0.2 }).observe(about);
}

/* ─────────────────────────────────────────────────────────────
   10. KICK OFF
   ───────────────────────────────────────────────────────────── */
const run = () => {
  setupNav();
  setupForm();
  setupHeroCanvas();
  setupScrollProgress();
  setupCardEffects();
  setupMagnetic();
  setupPortraitCaption();
  heroEntrance();
  setupReveals();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", run, { once: true });
} else {
  run();
}
