/* ============================================================
   motion.js — single 1 KB orchestrator
     1. Nav reveal-on-upscroll (preserves hero on first paint)
     2. Active-section highlight in nav
     3. IntersectionObserver fallback for browsers without
        CSS animation-timeline / view-timeline
     4. Form: honeypot reject + basic UX nicety
     5. Scroll-timeline polyfill (lazy, only if needed)
   ============================================================ */

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const supportsTimeline = CSS.supports("animation-timeline: view()");

/* ─── 1 & 2: Nav reveal + active highlight ──────────────── */
const nav = document.querySelector(".nav");
if (nav) {
  let lastY = 0;
  let revealed = true;
  nav.dataset.revealed = "true";

  const onScroll = () => {
    const y = window.scrollY;
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

  /* Active section highlight */
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

/* ─── 3: .js-reveal handling per scenario ─────────────────────
   - reduce:               mark all visible immediately (no motion).
   - !supportsTimeline:    IntersectionObserver on each element.
   - supportsTimeline:     do NOT mark .is-in; let the @supports CSS keyframes
                           run unimpeded (otherwise the static .is-in opacity
                           fights the keyframe's 0→1 ramp and can flicker on
                           fast scroll exits in Safari 18 TP). */
const reveals = document.querySelectorAll(".js-reveal");
if (reveals.length) {
  if (reduce) {
    reveals.forEach((r) => r.classList.add("is-in"));
  } else if (!supportsTimeline) {
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    reveals.forEach((r) => io.observe(r));
  }
  /* supportsTimeline && !reduce → leave to CSS scroll-timeline */
}

/* ─── 4: Form honeypot + nicety + sticky CTA hide-when-form-in-view ── */
const form = document.querySelector("form[data-intake]");
const stickyCta = document.querySelector("[data-sticky-cta]");
if (form) {
  /* Honeypot + Submit affordance — time-trap added below in 4b. */
  const formOpenedAt = performance.now();
  form.addEventListener("submit", (e) => {
    if (form.elements?.namedItem("company")?.value) { e.preventDefault(); return; }
    if (performance.now() - formOpenedAt < 1500) { e.preventDefault(); return; }
    const btn = form.querySelector("[type=submit]");
    if (btn) btn.textContent = "Sending…";
  });

  /* Hide sticky bottom CTA when the form section is in view — no double-CTA. */
  if (stickyCta && "IntersectionObserver" in window) {
    const target = document.getElementById("book");
    if (target) {
      const io = new IntersectionObserver((ents) => {
        for (const e of ents) stickyCta.dataset.hidden = e.isIntersecting ? "true" : "false";
      }, { rootMargin: "-30% 0% -30% 0%", threshold: 0 });
      io.observe(target);
    }
  }
}

/* No CDN polyfill — the IO fallback above (.js-reveal → .is-in) covers every
   browser without animation-timeline support, and bundling a polyfill would
   double the JS budget for ~5% of users. The CSS @supports block hides the
   scroll-timeline keyframes from unsupported browsers, leaving elements in
   their static visible state. */

/* ─── 5: Pricing scrub — $0 → $4,800 via @property + view() ─── */
const pricingDigits = document.querySelector(".pricing-count-digits");
const pricingHost   = document.querySelector(".pricing-count");
if (pricingDigits && pricingHost && !reduce && supportsTimeline) {
  const target = parseInt(pricingHost.dataset.pricingCount || "4800", 10);
  const style = document.createElement("style");
  style.textContent =
    "@keyframes pricingScrub{from{--pricing-num:0}to{--pricing-num:" + target + "}}" +
    ".pricing-count{animation:pricingScrub linear both;animation-timeline:view();animation-range:entry 10% cover 38%}";
  document.head.appendChild(style);

  const fmt = new Intl.NumberFormat("en-US");
  let raf = 0, inView = false;
  const tick = () => {
    raf = 0;
    const raw = getComputedStyle(pricingHost).getPropertyValue("--pricing-num");
    const n = parseInt(raw, 10) || 0;
    pricingDigits.textContent = fmt.format(n);
    if (inView) raf = requestAnimationFrame(tick);
  };
  new IntersectionObserver((ents) => {
    for (const e of ents) {
      inView = e.isIntersecting;
      if (inView && !raf) raf = requestAnimationFrame(tick);
      if (!inView) pricingDigits.textContent = fmt.format(target);
    }
  }, { rootMargin: "20% 0% 20% 0%", threshold: 0 }).observe(pricingHost);
} else if (pricingDigits) {
  pricingDigits.textContent = "4,800";
}

/* ─── 6: Portrait caption — letter-by-letter on enter ─── */
const cap = document.querySelector(".portrait-caption");
if (cap && !reduce) {
  let i = 0;
  cap.querySelectorAll(":scope > span").forEach((s) => {
    const txt = s.textContent || "";
    s.textContent = "";
    for (const ch of txt) {
      const c = document.createElement("span");
      c.className = "char";
      c.style.setProperty("--i", String(i++));
      c.textContent = ch === " " ? " " : ch;
      s.appendChild(c);
    }
  });
  const about = document.getElementById("about");
  if (about) {
    new IntersectionObserver((ents, obs) => {
      for (const e of ents) if (e.isIntersecting) {
        cap.classList.add("is-typed");
        obs.unobserve(e.target);
      }
    }, { rootMargin: "0% 0% -20% 0%", threshold: 0.2 }).observe(about);
  }
}

/* ─── 7: Micro-interactions — pointermove glow + magnetic CTAs ─── */
if (!reduce) {
  const hosts = document.querySelectorAll(".bento-card,.problem-card,.checklist>li");
  const ctas  = document.querySelectorAll(".cta");
  let pending = false, lastEv = null;
  const onMove = (ev) => {
    lastEv = ev;
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      if (!lastEv) return;
      const target = lastEv.target;
      const host = target && target.closest && target.closest(".bento-card,.problem-card,.checklist>li");
      if (host) {
        const r = host.getBoundingClientRect();
        host.style.setProperty("--mx", ((lastEv.clientX - r.left) / r.width * 100) + "%");
        host.style.setProperty("--my", ((lastEv.clientY - r.top)  / r.height * 100) + "%");
      }
      ctas.forEach((b) => {
        const r = b.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const dx = lastEv.clientX - cx, dy = lastEv.clientY - cy;
        const d = Math.hypot(dx, dy);
        if (d < 80 && d > 0) {
          const k = (1 - d / 80) * 1.5;
          b.style.transform = "translate(" + (dx / d * k) + "px," + (dy / d * k) + "px)";
        } else if (b.style.transform) {
          b.style.transform = "";
        }
      });
    });
  };
  addEventListener("pointermove", onMove, { passive: true });

  /* ─── 8: Sticky CTA one-shot "ready" tease on first reveal ─── */
  if (stickyCta) {
    let fired = false;
    addEventListener("scroll", () => {
      if (fired || window.scrollY < innerHeight * 0.6) return;
      if (stickyCta.dataset.hidden !== "true" &&
          getComputedStyle(stickyCta).display !== "none") {
        fired = true;
        stickyCta.classList.add("is-ready");
        setTimeout(() => stickyCta.classList.remove("is-ready"), 900);
      }
    }, { passive: true });
  }
}
