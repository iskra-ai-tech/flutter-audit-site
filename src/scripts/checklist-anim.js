/* ============================================================
   checklist-anim.js — multi-layer physics-driven disclosure
   ─────────────────────────────────────────────────────────
   v2 — adds hover spring (research preset: stiffness 900,
   damping 42, ζ≈0.70, ~4% overshoot, ~280 ms settle), smoother
   chevron via smootherstep + bell-curve wind-up (one continuous
   curve, no kink), bulletproof open/close measurement that
   forces a layout flush between display-flip and measurement.

   Each <details data-cl-item> has TWO independent springs:
     1  disclosureSpring  k=240 c=26  (slow, expressive)
     2  hoverSpring       k=900 c=42  (snappy, immediate)

   Both write CSS custom properties to the outer .cl-row (li);
   inheritance fans them down to summary, body, chevron, etc.
   All consumers are composite-only (transform, opacity,
   color-mix) — no per-frame paint or layout outside body height.
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
// Ken Perlin smootherstep — C2-continuous (smooth derivatives).
// Used for the chevron sweep so there's no velocity kink.
const smootherstep = (e0, e1, x) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * t * (t * (t * 6 - 15) + 10);
};
const bell = (x, peak, sigma) => Math.exp(-((x - peak) ** 2) / (2 * sigma * sigma));

// ── Per-item state ────────────────────────────────────────────
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
    disclosure: createSpring({ stiffness: 240, damping: 26 }),
    hover:     createSpring({ stiffness: 900, damping: 42 }),
    target: details.open ? 1 : 0,
    naturalHeight: 0,
    closing: false,
    rafId: 0,
    lastT: 0,
    running: false,
  };
  state.disclosure.snap(state.target);
  state.hover.snap(0);
  paintDisclosure(state, state.target);
  paintHover(state, 0);
  states.set(details, state);

  if (!details.open) body.style.height = '0px';
  else { body.style.height = 'auto'; }

  // Click interception — capture phase + stopImmediatePropagation
  // for maximum cross-browser safety against the native toggle.
  summary.addEventListener('click', onClick, true);

  // Hover springs only run on collapsed items (less surprise when
  // an open item subtly scales).
  row.addEventListener('pointerenter', () => {
    if (REDUCED) return;
    if (state.details.open) return;
    state.hover.setTarget(1);
    startLoop(state);
  });
  row.addEventListener('pointerleave', () => {
    if (REDUCED) return;
    state.hover.setTarget(0);
    startLoop(state);
  });
  // If the user opens an item while hovering, snap the hover spring
  // back to 0 so we don't compound the scales when it later closes.
  details.addEventListener('toggle', () => {
    if (details.open) {
      state.hover.setTarget(0);
      startLoop(state);
    }
  });
}

function onClick(e) {
  const summary = e.currentTarget;
  const details = summary.closest('details');
  const state = states.get(details);
  if (!state) return;
  if (REDUCED) return;

  e.preventDefault();
  e.stopImmediatePropagation();

  const opening = !details.open;

  if (opening) {
    // Render content so we can measure. Reading offsetHeight forces
    // a layout flush — guarantees the browser has applied the
    // [open] change and our CSS overrides before we measure.
    details.open = true;
    state.body.style.height = 'auto';
    // Force layout flush. scrollHeight is the height-clamp-resistant
    // measurement.
    const measured = state.body.scrollHeight || state.body.offsetHeight;
    // Snap visual back to current spring position before animating.
    state.body.style.height = (state.disclosure.pos() * measured).toFixed(2) + 'px';
    // Force another layout flush so the browser registers the
    // pre-animation height before the next paint.
    void state.body.offsetHeight;
    state.naturalHeight = measured;
    state.closing = false;
    state.target = 1;
  } else {
    // Closing: measure the current full height so we can shrink from it.
    state.naturalHeight = state.body.scrollHeight || state.body.offsetHeight;
    state.body.style.height = state.body.offsetHeight + 'px';
    void state.body.offsetHeight;
    state.closing = true;
    state.target = 0;
  }
  state.disclosure.setTarget(state.target);
  startLoop(state);
}

function startLoop(state) {
  if (state.running) return;
  state.running = true;
  state.lastT = performance.now();
  state.body.style.willChange = 'height';
  state.row.style.willChange = 'transform';

  const tick = (now) => {
    const dt = (now - state.lastT) / 1000;
    state.lastT = now;
    const dp = state.disclosure.update(dt);
    const hp = state.hover.update(dt);
    paintDisclosure(state, dp);
    paintHover(state, hp);

    const dRest = state.disclosure.isResting();
    const hRest = state.hover.isResting();
    if (dRest && hRest) {
      state.running = false;
      finalize(state);
      return;
    }
    state.rafId = requestAnimationFrame(tick);
  };
  state.rafId = requestAnimationFrame(tick);
}

function paintDisclosure(state, progress) {
  const { row, body, naturalHeight, closing } = state;

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

  // ── Layer 6: chevron — smootherstep sweep + bell-curve wind-up dip.
  // smootherstep gives C2-continuous motion (no kink). The bell-curve
  // wind-up adds a brief backwards "wind-up" dip near the start (or
  // end, when closing) without breaking the smooth derivative.
  const sweep = smootherstep(0, 1, p) * 180;
  const dipCenter = closing ? 0.85 : 0.15;
  const dipMag    = closing ?   12 :  -12;
  const dip       = bell(p, dipCenter, 0.08) * dipMag;
  const kick      = burst * 10 * (closing ? -1 : 1);
  const chev      = (sweep + dip + kick).toFixed(2) + 'deg';

  // ── Layer 7: border accent ──
  const border = p;

  // ── Layer 8: scribe (hairline along top edge) ──
  const scribe = smoothstep(0.05, 0.45, p);

  // ── Layer 9: cascade (children consume w/ --i stagger) ──
  const cascade = p;

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

// Hover paints its own variable — CSS consumes via scale + lift +
// border breath. Independent from disclosure.
function paintHover(state, hp) {
  state.row.style.setProperty('--cl-hover', Math.max(0, hp).toFixed(4));
}

function finalize(state) {
  const { details, body, row, target } = state;
  if (target === 0) {
    details.open = false;
    body.style.height = '0px';
    paintDisclosure(state, 0);
  } else {
    // Release the height clamp so dynamic content (font resize,
    // viewport zoom) can flow naturally afterwards.
    body.style.height = 'auto';
    paintDisclosure(state, 1);
  }
  // Release compositor layers — permanent will-change is more
  // expensive than briefly toggled will-change.
  body.style.willChange = '';
  row.style.willChange = '';
}

// ── Cursor-follow brass radial glow ───────────────────────────
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
