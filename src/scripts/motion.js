/* ============================================================
   motion.js v4 — Pattern A reveals (CSS class + transition).
   No inline-style mutation on reveals → no layout jump.
   Kept intact: hero canvas, magnetic CTAs, 3D card tilt,
   pricing scrub, scroll progress, nav reveal, form, portrait.
   ============================================================ */

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fx = new URLSearchParams(location.search).has("fx") ||
           new URLSearchParams(location.search).has("motion");
const ANIMATE = fx || !reduce;

/* ─────────────────────────────────────────────────────────────
   1. HERO ENTRANCE — class toggles + setTimeout stagger.
      Final state is the element's natural CSS state.
   ───────────────────────────────────────────────────────────── */
function heroEntrance() {
  const root = document.querySelector(".hero");
  if (!root) return;

  /* Hidden-initial states only apply when .js-motion is on <html>.
     No-JS users see the final state immediately. */
  document.documentElement.classList.add("js-motion");

  if (!ANIMATE) {
    root.classList.add("hero-in");
    document.querySelectorAll(
      ".hero-hairline, .hero-eyebrow-text, .hero-byline, " +
      ".hero-headline .line-inner, .hero-rule, .hero-lede, " +
      ".hero-ctas, .hero-trust, .hero-caret"
    ).forEach((el) => el.classList.add("is-in"));
    return;
  }

  /* Stagger schedule (delays match the previous WAAPI rhythm). */
  const schedule = [
    [".hero-hairline",                 50],
    [".hero-eyebrow-text",            180],
    [".hero-byline",                  320],
    [".hero-headline .line:nth-child(1) .line-inner", 480],
    [".hero-headline .line:nth-child(2) .line-inner", 640],
    [".hero-headline .line:nth-child(3) .line-inner", 800],
    [".hero-rule",                   1050],
    [".hero-lede",                   1200],
    [".hero-ctas",                   1340],
    [".hero-trust",                  1480],
    [".hero-caret",                  1500],
  ];

  schedule.forEach(([sel, delay]) => {
    document.querySelectorAll(sel).forEach((el) => {
      setTimeout(() => el.classList.add("is-in"), delay);
    });
  });

  /* Brass rule shimmer — additive, after the rule has drawn. */
  setTimeout(() => {
    const rule = document.querySelector(".hero-rule");
    if (!rule) return;
    const shimmer = document.createElement("span");
    shimmer.className = "hero-rule-shimmer";
    rule.appendChild(shimmer);
    shimmer.animate(
      [
        { transform: "translateX(-100%)", offset: 0 },
        { transform: "translateX(-100%)", offset: 0.78 },
        { transform: "translateX(100%)",  offset: 0.95 },
        { transform: "translateX(100%)",  offset: 1 },
      ],
      { duration: 4200, iterations: Infinity, easing: "linear" }
    );
  }, 1700);

  /* One-shot H1 shimmer pass. */
  setTimeout(() => {
    const h1 = document.querySelector(".hero-headline");
    if (!h1) return;
    const shim = document.createElement("span");
    shim.className = "hero-h1-shimmer";
    h1.appendChild(shim);
    shim.animate(
      [
        { transform: "translateX(-30%)", opacity: 0 },
        { transform: "translateX(-10%)", opacity: 1, offset: 0.3 },
        { transform: "translateX(30%)",  opacity: 0 },
      ],
      { duration: 1100, fill: "forwards", easing: "cubic-bezier(0.25, 1, 0.5, 1)" }
    );
  }, 1800);

  /* Caret pulse loop. */
  setTimeout(() => {
    const caret = document.querySelector(".hero-caret");
    if (!caret) return;
    caret.animate(
      [{ opacity: 1 }, { opacity: 0.55 }, { opacity: 1 }],
      { duration: 2400, iterations: Infinity, easing: "ease-in-out" }
    );
  }, 2200);
}

/* ─────────────────────────────────────────────────────────────
   2. SCROLL REVEALS — IntersectionObserver toggles .is-in.
      Initial state + transitions live in reveals.css.
   ───────────────────────────────────────────────────────────── */
function setupReveals() {
  const targets = document.querySelectorAll("[data-reveal]");
  if (!targets.length) return;

  if (!ANIMATE) {
    targets.forEach((el) => el.classList.add("is-in"));
    setTimeout(() => runPricingScrub(), 0);
    return;
  }

  /* Pre-compute per-group index so transition-delay can scale by --i. */
  const groups = new Map();
  targets.forEach((el) => {
    const g = el.dataset.revealGroup;
    if (!g) return;
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g).push(el);
  });
  groups.forEach((peers) => {
    peers.forEach((el, idx) => el.style.setProperty("--i", idx));
  });

  const io = new IntersectionObserver((ents) => {
    ents.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      e.target.classList.add("is-in");
      if (e.target.classList.contains("pricing")) runPricingScrub();
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });

  targets.forEach((el) => io.observe(el));
}

/* ─────────────────────────────────────────────────────────────
   3. PRICING SCRUB — $0 → $500 rAF tween (1.2s)
   ───────────────────────────────────────────────────────────── */
let pricingFired = false;
function runPricingScrub() {
  if (pricingFired) return;
  pricingFired = true;
  const digits = document.querySelector(".pricing-count-digits");
  const host = document.querySelector(".pricing-count");
  if (!digits || !host) return;
  const target = parseInt(host.dataset.pricingCount || "500", 10);
  if (!ANIMATE) { digits.textContent = target.toLocaleString("en-US"); return; }
  const fmt = new Intl.NumberFormat("en-US");
  const dur = 1200;
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min(1, (now - start) / dur);
    const eased = 1 - Math.pow(1 - t, 3);
    digits.textContent = fmt.format(Math.round(target * eased));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  const anchor = document.querySelector(".pricing-anchor");
  if (anchor) {
    let rule = anchor.querySelector(".pricing-commit-rule");
    if (!rule) {
      rule = document.createElement("span");
      rule.className = "pricing-commit-rule";
      anchor.appendChild(rule);
    }
    rule.animate(
      [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }],
      { duration: 900, easing: "cubic-bezier(0.25, 1, 0.5, 1)", fill: "forwards", delay: 200 }
    );
  }
}

/* ─────────────────────────────────────────────────────────────
   4. HERO CANVAS — 60-particle constellation
   ───────────────────────────────────────────────────────────── */
function setupHeroCanvas() {
  if (!ANIMATE) return;
  const host = document.querySelector(".hero");
  if (!host) return;
  if (host.querySelector(".hero-canvas")) return;

  const canvas = document.createElement("canvas");
  canvas.className = "hero-canvas";
  canvas.setAttribute("aria-hidden", "true");
  host.insertBefore(canvas, host.firstChild);
  host.classList.add("has-canvas");

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

      ctx.beginPath();
      ctx.fillStyle = "rgba(217, 164, 99, 0.55)";
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    raf = requestAnimationFrame(tick);
  };

  resize();
  window.addEventListener("resize", () => { setTimeout(resize, 100); }, { passive: true });

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
    if (e.clientY > r.bottom || e.clientY < r.top) { mouse.active = false; return; }
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
    mouse.active = true;
  }, { passive: true });
  window.addEventListener("pointerleave", () => { mouse.active = false; }, { passive: true });
}

/* ─────────────────────────────────────────────────────────────
   5. SCROLL-PROGRESS BAR
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
   6. CARD 3D TILT — only when card is already revealed
   ───────────────────────────────────────────────────────────── */
function setupCardEffects() {
  if (!ANIMATE) return;
  const cards = document.querySelectorAll(".bento-card, .problem-card");
  let pending = false;
  let lastEv = null;
  addEventListener("pointermove", (e) => {
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
          card.style.setProperty("--mx", mx + "%");
          card.style.setProperty("--my", my + "%");
          /* Only apply tilt to already-revealed cards — never override
             a transform set by the reveal transition. */
          if (card.classList.contains("is-in")) {
            const rotX = ((my - 50) / 50) * -3;
            const rotY = ((mx - 50) / 50) *  3;
            card.style.transform = "perspective(900px) rotateX(" + rotX.toFixed(2) + "deg) rotateY(" + rotY.toFixed(2) + "deg)";
            card.dataset.tilt = "1";
          }
        } else if (card.dataset.tilt === "1") {
          card.style.transform = "";
          card.dataset.tilt = "0";
        }
      });
    });
  }, { passive: true });

  document.querySelectorAll(".checklist > li").forEach((li) => {
    li.addEventListener("pointermove", (e) => {
      const r = li.getBoundingClientRect();
      li.style.setProperty("--mx", (((e.clientX - r.left) / r.width) * 100) + "%");
      li.style.setProperty("--my", (((e.clientY - r.top) / r.height) * 100) + "%");
    }, { passive: true });
  });
}

/* ─────────────────────────────────────────────────────────────
   7. MAGNETIC CTAs
   ───────────────────────────────────────────────────────────── */
function setupMagnetic() {
  if (!ANIMATE) return;
  const ctas = document.querySelectorAll(".cta, .form-submit");
  let pending = false;
  let lastEv = null;
  addEventListener("pointermove", (e) => {
    lastEv = e;
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
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
    });
  }, { passive: true });
}

/* ─────────────────────────────────────────────────────────────
   8. NAV + form + sticky CTA
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

  const links = nav.querySelectorAll(".nav-link[href^='#']");
  if (links.length) {
    const map = new Map();
    links.forEach((a) => {
      const id = a.getAttribute("href").slice(1);
      const sec = document.getElementById(id);
      if (sec) map.set(sec, a);
    });
    new IntersectionObserver((ents) => {
      ents.forEach((e) => {
        const a = map.get(e.target);
        if (!a) return;
        if (e.isIntersecting) {
          links.forEach((l) => l.removeAttribute("aria-current"));
          a.setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-40% 0% -55% 0%", threshold: 0 }).observe;
    map.forEach((_, sec) => {
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
      io.observe(sec);
    });
  }
}

function setupForm() {
  const form = document.querySelector("form[data-intake]");
  const stickyCta = document.querySelector("[data-sticky-cta]");
  if (form) {
    const formOpenedAt = performance.now();
    const errSlot = form.querySelector(".form-error");
    const btn = form.querySelector("[type=submit]");
    const btnLabel = btn?.querySelector(".form-submit-label");
    const setLabel = (t) => { if (btnLabel) btnLabel.textContent = t; };
    const showError = (msg) => {
      if (!errSlot) return;
      errSlot.textContent = msg;
      errSlot.hidden = false;
    };
    const clearError = () => { if (errSlot) { errSlot.hidden = true; errSlot.textContent = ""; } };

    form.addEventListener("submit", async (e) => {
      /* Honeypot — `_gotcha` is Formspree's reserved field. Bot fills it; bounce silently. */
      if (form.elements?.namedItem("_gotcha")?.value) { e.preventDefault(); return; }
      /* Time-on-form gate — under 1.5 s = scripted submit. */
      if (performance.now() - formOpenedAt < 1500) { e.preventDefault(); return; }
      /* Honor native client-side validation; fall through to browser UI on fail. */
      if (!form.checkValidity()) { return; }

      /* Progressive enhancement: intercept and AJAX-submit so we keep the user
         on the page with an in-DOM success swap. If fetch is unsupported or
         the user is offline, let the native POST run and Formspree's `_next`
         field handles the redirect. */
      if (typeof fetch !== "function" || !navigator.onLine) return;

      e.preventDefault();
      clearError();
      if (btn) btn.disabled = true;
      setLabel("Sending…");

      try {
        const res = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });
        if (res.ok) {
          const wrap = form.parentElement;
          const thanks = document.createElement("div");
          thanks.className = "form-thanks";
          thanks.setAttribute("role", "status");
          thanks.innerHTML = '<p class="eyebrow"><span class="num">08</span>&nbsp;Received</p><h3>Got it.</h3><p class="lede muted">I read every form personally and reply within 24 hours with a fit assessment and a scoped quote. If your repo is private, I will reply with a GitHub handle to invite as a read-only collaborator.</p>';
          form.replaceWith(thanks);
          wrap?.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
        const json = await res.json().catch(() => ({}));
        const msg = json?.errors?.[0]?.message
          || "Submission failed. Email hello@flutteraudit.com directly with the same details.";
        showError(msg);
        if (btn) btn.disabled = false;
        setLabel("Send");
      } catch {
        showError("Network error. Email hello@flutteraudit.com directly with the same details.");
        if (btn) btn.disabled = false;
        setLabel("Send");
      }
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
      c.className = "char";
      c.textContent = ch === " " ? " " : ch;
      c.style.setProperty("--i", String(i++));
      s.appendChild(c);
    }
  });
  const about = document.getElementById("about");
  if (!about) return;
  new IntersectionObserver((ents, obs) => {
    for (const e of ents) if (e.isIntersecting) {
      obs.unobserve(e.target);
      cap.classList.add("is-typed");
    }
  }, { rootMargin: "0% 0% -20% 0%", threshold: 0.2 }).observe(about);
}

/* ─── KICK OFF ───────────────────────────────────────────── */
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
