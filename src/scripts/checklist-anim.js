/* ============================================================
   checklist-anim.js — multi-layer physics-driven disclosure
   ─────────────────────────────────────────────────────────
   Each <details data-cl-item> in the §3b checklist is animated
   by a single rAF loop running a damped-spring solver. The
   spring drives ten CSS custom properties on the outer .cl-row,
   each consumed by composite-only CSS transforms / opacity /
   color-mix declarations.

   Layers:
     1  height           spring position × naturalHeight
     2  body opacity     smoothstep(0.15, 0.85, p)
     3  body translateY  (1 − p) × 8px
     4  shimmer sweep    bell(p, 0.45, 0.22) — peak mid-anim
     5  burst            bell(p, 0.55, 0.30) — border bulge
     6  chevron rotate   p × 180° + burst-kick
     7  border accent    color-mix p (hairline → brass)
     8  scribe extent    smoothstep(0.05, 0.45, p)
     9  cascade index    p (children stagger from --i)
    10  outer shadow     p × peak alpha (open box-shadow)

   Spring: stiffness 240, damping 26, mass 1 — lightly under-
   damped (c_crit ≈ 31, ζ ≈ 0.84) → ~10% overshoot then settle
   in ~340 ms. Tuned per the brass-default research preset.
   ============================================================ */

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Spring solver (semi-implicit Euler, dt-clamped) ───────────
function createSpring({ stiffness = 240, damping = 26, mass = 1, restThresh = 0.0008 } = {}) {
  let pos = 0, vel = 0, target = 0;
  return {
    setTarget(t) { target = t; },
    snap(t) { pos = t; vel = 0; target = t; },
    update(dt) {
      const clampedDt = Math.min(dt, 1 / 30);
      const force = -stiffness * (pos - target);
      const damp = -damping * vel;
      const accel = (force + damp) / mass;
      vel += accel * clampedDt;
      pos += vel * clampedDt;
      return pos;
    },
    pos() { return pos; },
    vel() { return vel; },
    target() { return target; },
    isResting() {
      return Math.abs(pos - target) < restThresh && Math.abs(vel) < restThresh * 8;
    },
  };
}

// ── Math helpers ──────────────────────────────────────────────
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smoothstep = (e0, e1, x) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};
// Gaussian bell, peak at `peak`, std-dev `sigma`
const bell = (x, peak, sigma) => Math.exp(-((x - peak) ** 2) / (2 * sigma * sigma));

// ── Per-item state, keyed by the <details> element ────────────
const states = new WeakMap();

function setup(details) {
  if (states.has(details)) return;
  const row = details.closest('li') || details.parentElement;
  const body = details.querySelector('.cl-body');
  const inner = details.querySelector('.cl-body-inner');
  const summary = details.querySelector('.cl-summary');
  if (!row || !body || !inner || !summary) return;

  const state = {
    details, row, body, inner, summary,
    spring: createSpring({ stiffness: 240, damping: 26 }),
    target: details.open ? 1 : 0,
    rafId: 0,
    lastT: 0,
    naturalHeight: 0,
    animating: false,
    closing: false,
  };
  state.spring.snap(state.target);
  paint(state, state.target); // initial pass to sync vars to DOM
  states.set(details, state);

  if (!details.open) body.style.height = '0px';

  // Intercept click on summary; manage open state manually so we can
  // animate the close path (native <details> would snap to display:none).
  summary.addEventListener('click', onClick);
  // Also handle keyboard activation (Space / Enter) which dispatches click,
  // but Safari sometimes emits a separate keydown — we already cover it
  // through the synthesized click event.
}

function onClick(e) {
  const summary = e.currentTarget;
  const details = summary.closest('details');
  const state = states.get(details);
  if (!state) return;

  if (REDUCED) return; // Let native toggle handle it — no choreography.

  e.preventDefault();

  const opening = !details.open;

  // Snapshot live height first (handles mid-animation interrupts).
  if (opening) {
    // Render content so we can measure, while keeping visual height at current spring pos.
    const currentVisualHeight = state.body.offsetHeight;
    details.open = true;
    state.body.style.height = currentVisualHeight + 'px';
    state.naturalHeight = state.body.scrollHeight;
    state.closing = false;
    state.target = 1;
  } else {
    state.naturalHeight = state.body.scrollHeight || state.body.offsetHeight;
    // freeze current visual height
    state.body.style.height = state.body.offsetHeight + 'px';
    state.closing = true;
    state.target = 0;
  }
  state.spring.setTarget(state.target);
  startLoop(state);
}

function startLoop(state) {
  if (state.animating) return;
  state.animating = true;
  state.lastT = performance.now();
  // Promote to its own compositor layer for the duration of the animation,
  // then release on rest so we don't leak GPU memory (one of the research
  // gotchas: permanent will-change is more expensive than not setting it).
  state.body.style.willChange = 'height';
  state.row.style.willChange = 'transform';
  const tick = (now) => {
    const dt = (now - state.lastT) / 1000;
    state.lastT = now;
    const p = state.spring.update(dt);
    paint(state, p);
    if (state.spring.isResting()) {
      state.animating = false;
      finalize(state);
      return;
    }
    state.rafId = requestAnimationFrame(tick);
  };
  state.rafId = requestAnimationFrame(tick);
}

function paint(state, progress) {
  const { row, body, naturalHeight, closing } = state;

  // Visual progress can overshoot the spring's target slightly (bounce).
  const vp = clamp(progress, -0.05, 1.10);
  const p  = clamp(progress, 0, 1);

  // ── Layer 1: body height (with subtle overshoot bulge) ──
  if (naturalHeight > 0) {
    body.style.height = Math.max(0, vp * naturalHeight).toFixed(2) + 'px';
  }

  // ── Layer 2/3: body opacity + slide ──
  const bodyOp    = smoothstep(0.15, 0.85, p);
  const bodyShift = ((1 - p) * 8).toFixed(2) + 'px';

  // ── Layer 4: shimmer sweep (bell-curve mid-anim) ──
  const shimmer = bell(p, 0.45, 0.22);

  // ── Layer 5: burst (border bulge / scale kick) ──
  const burst = bell(p, 0.55, 0.30);

  // ── Layer 6: chevron rotation + wind-up + burst kick ──
  // Wind-up: rotate backwards by 12° during first 15% of progress on open,
  // then forward sweep to 180°. On close, mirror the wind-up at the tail.
  // Burst kick adds a sub-rotation jolt around mid-anim.
  let chevBase;
  if (!closing && p < 0.15) {
    chevBase = lerp(0, -12, p / 0.15);
  } else if (!closing) {
    chevBase = lerp(-12, 180, (p - 0.15) / 0.85);
  } else if (closing && p > 0.85) {
    chevBase = lerp(180, 192, (1 - p) / 0.15);
  } else {
    chevBase = lerp(192, 0, (0.85 - p) / 0.85);
  }
  const chevKick = burst * 14 * (closing ? -1 : 1);
  const chev     = (chevBase + chevKick).toFixed(2) + 'deg';

  // ── Layer 7: border accent (CSS reads var into color-mix) ──
  const border = p;

  // ── Layer 8: scribe (hairline along top edge) ──
  const scribe = smoothstep(0.05, 0.45, p);

  // ── Layer 9: cascade (children consume w/ --i stagger) ──
  const cascade = p;

  // Write to the row (li); inheritance fans these out to details,
  // summary, body, shimmer, scribe — all in one paint.
  const s = row.style;
  s.setProperty('--cl-p',          p.toFixed(4));
  s.setProperty('--cl-vp',         vp.toFixed(4));
  s.setProperty('--cl-body-op',    bodyOp.toFixed(4));
  s.setProperty('--cl-body-shift', bodyShift);
  s.setProperty('--cl-shimmer',    shimmer.toFixed(4));
  s.setProperty('--cl-burst',      burst.toFixed(4));
  s.setProperty('--cl-chev',       chev);
  s.setProperty('--cl-border',     border.toFixed(4));
  s.setProperty('--cl-scribe',     scribe.toFixed(4));
  s.setProperty('--cl-cascade',    cascade.toFixed(4));
}

function finalize(state) {
  const { details, body, row, target } = state;
  if (target === 0) {
    details.open = false;
    body.style.height = '0px';
    paint(state, 0);
  } else {
    // Release the height clamp so dynamic content (resizing fonts,
    // viewport changes) can flow naturally afterwards.
    body.style.height = 'auto';
    paint(state, 1);
  }
  // Release compositor layers (research finding: permanent will-change is
  // more expensive than briefly toggled will-change).
  body.style.willChange = '';
  row.style.willChange = '';
}

// ── Cursor-follow brass radial glow (intensifies during burst) ─
function bindGlow(row) {
  row.addEventListener('pointermove', (e) => {
    const r = row.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    row.style.setProperty('--mx', x.toFixed(1) + '%');
    row.style.setProperty('--my', y.toFixed(1) + '%');
  });
}

// ── Boot ──────────────────────────────────────────────────────
function init() {
  const items = document.querySelectorAll('[data-cl-item]');
  items.forEach((d) => {
    setup(d);
    const row = d.closest('li');
    if (row) bindGlow(row);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
