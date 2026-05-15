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

/* ─── 3: IntersectionObserver fallback for unsupported browsers ── */
if (!supportsTimeline && !reduce) {
  const reveals = document.querySelectorAll(".js-reveal");
  if (reveals.length) {
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
}

if (supportsTimeline || reduce) {
  document.querySelectorAll(".js-reveal").forEach((r) => r.classList.add("is-in"));
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
