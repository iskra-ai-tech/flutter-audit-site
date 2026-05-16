/* ============================================================
   Liquid Disclosure Engine v4 — multi-layer compositor symphony
   ─────────────────────────────────────────────────────────
   L0  spring height           ODE-solved keyframes → WAAPI
   L1  aurora wash             radial glow scale+fade, WAAPI
   L2  mercury rings (×3)      concentric scale ripples, WAAPI
   L3  chromatic shimmer       RGB-offset sweep bands, WAAPI
   L4  border energy           conic-gradient rotation via
                               @property-registered custom prop
   L5  glyph wave              CSS transitions tied to [open],
                               --gx tagged by radial-distance rank
                               from chevron centre
   L6  chevron 2-stage spring  CSS rotate w/ overshoot bezier,
                               WAAPI halo pulse, SVG path re-draw
   L7  hover pointer spring    pointermove → rAF spring → CSS
                               vars driving radial highlight + tilt
   Master clock is the height spring; subordinate layers are
   one-shot WAAPI calls, each on its own compositor timeline.
   ============================================================ */

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Spring ODE → dense sample points ─────────────────────────
   Semi-implicit Euler: m·ẍ + c·ẋ + k·(x - xT) = 0
   Integrates until |residual| < settle thresholds, returns the
   trajectory as evenly-spaced samples for WAAPI keyframes.
*/
function springSolve({ from, to, stiffness = 180, damping = 22, mass = 1,
                       dt = 6, settleX = 0.001, settleV = 0.08, max = 2400 }) {
  let x = from, v = 0, t = 0;
  const dtSec = dt / 1000;
  const range = Math.abs(to - from) || 1;
  const pts = [{ t: 0, x }];
  while (t < max) {
    const a = (-stiffness * (x - to) - damping * v) / mass;
    v += a * dtSec;
    x += v * dtSec;
    t += dt;
    pts.push({ t, x });
    if (Math.abs(x - to) < range * settleX && Math.abs(v) * dtSec < range * settleV * 0.01) {
      pts[pts.length - 1].x = to;
      break;
    }
  }
  return pts;
}

function springKeyframes(points, prop, fmt) {
  const dur = points[points.length - 1].t || 1;
  const kfs = points.map((p, i) => {
    const offset = i === 0 ? 0 : i === points.length - 1 ? 1 : p.t / dur;
    return { [prop]: fmt(p.x), offset };
  });
  return { keyframes: kfs, duration: dur };
}

/* ── Glyph wrap & radial-rank tagging ───────────────────────── */
function splitWords(container) {
  container.querySelectorAll('p').forEach((p, pIdx) => {
    const original = p.innerHTML;
    const tokens = original.split(/(\s+)/);
    p.innerHTML = '';
    let n = 0;
    tokens.forEach(tok => {
      if (!tok) return;
      if (/^\s+$/.test(tok)) {
        p.appendChild(document.createTextNode(tok));
      } else {
        const span = document.createElement('span');
        span.className = 'cl-word';
        span.style.setProperty('--gx', n + pIdx * 80);
        span.innerHTML = tok;
        p.appendChild(span);
        n++;
      }
    });
  });
  container.dataset.split = '1';
}

function measureRadialRank(container, anchor) {
  const ar = anchor.getBoundingClientRect();
  if (!ar.width) return;
  const ax = ar.left + ar.width / 2;
  const ay = ar.top + ar.height / 2;
  const words = Array.from(container.querySelectorAll('.cl-word'));
  const dist = words.map((w, i) => {
    const r = w.getBoundingClientRect();
    return { i, d: Math.hypot(r.left + r.width / 2 - ax, r.top + r.height / 2 - ay) };
  });
  dist.sort((a, b) => a.d - b.d);
  dist.forEach((d, rank) => words[d.i].style.setProperty('--gx', rank));
  container.dataset.measured = '1';
}

/* ── L1 Aurora ──────────────────────────────────────────────── */
function fireAurora(item, closing) {
  const aurora = item.querySelector('.cl-fx-aurora');
  if (!aurora) return;
  if (closing) {
    aurora.animate(
      [
        { opacity: 0.4, transform: 'translate(-50%, -50%) scale(1.3)' },
        { opacity: 0,   transform: 'translate(-50%, -50%) scale(0.85)' }
      ],
      { duration: 380, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' }
    );
  } else {
    aurora.animate(
      [
        { opacity: 0,    transform: 'translate(-50%, -50%) scale(0.4)' },
        { opacity: 0.6,  transform: 'translate(-50%, -50%) scale(1.35)', offset: 0.4 },
        { opacity: 0.18, transform: 'translate(-50%, -50%) scale(2.1)',  offset: 0.75 },
        { opacity: 0,    transform: 'translate(-50%, -50%) scale(2.6)' }
      ],
      { duration: 1100, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' }
    );
  }
}

/* ── L2 Mercury rings ───────────────────────────────────────── */
function fireRings(item) {
  const rings = item.querySelectorAll('.cl-fx-ring');
  rings.forEach((ring, i) => {
    ring.animate(
      [
        { opacity: 0,    transform: 'translate(-50%, -50%) scale(0.15)' },
        { opacity: 0.7,  transform: 'translate(-50%, -50%) scale(1.6)', offset: 0.22 },
        { opacity: 0.32, transform: 'translate(-50%, -50%) scale(4.4)', offset: 0.55 },
        { opacity: 0,    transform: 'translate(-50%, -50%) scale(8.5)' }
      ],
      {
        duration: 1200 + i * 90,
        delay: i * 130,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        fill: 'forwards'
      }
    );
  });
}

/* ── L3 Chromatic shimmer ───────────────────────────────────── */
function fireShimmer(item) {
  const bands = item.querySelectorAll('.cl-fx-shimmer-band');
  bands.forEach((b, i) => {
    b.animate(
      [
        { transform: 'translateX(-70%) skewX(-12deg)', opacity: 0 },
        { transform: 'translateX(45%) skewX(-12deg)',  opacity: 1, offset: 0.5 },
        { transform: 'translateX(280%) skewX(-12deg)', opacity: 0 }
      ],
      {
        duration: 920,
        delay: i * 55,
        easing: 'cubic-bezier(0.42, 0, 0.32, 1)',
        fill: 'forwards'
      }
    );
  });
}

/* ── L4 Border energy ───────────────────────────────────────── */
function fireBorderEnergy(item) {
  const be = item.querySelector('.cl-fx-border');
  if (!be) return;
  be.animate(
    [
      { '--be-angle': '0deg',   opacity: 0 },
      { '--be-angle': '160deg', opacity: 0.95, offset: 0.35 },
      { '--be-angle': '320deg', opacity: 0.45, offset: 0.7 },
      { '--be-angle': '460deg', opacity: 0 }
    ],
    { duration: 1500, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' }
  );
}

/* ── L6 Chevron halo + draw ─────────────────────────────────── */
function fireChevron(item) {
  const halo = item.querySelector('.cl-chevron-halo');
  if (halo) {
    halo.animate(
      [
        { opacity: 0,    transform: 'translate(-50%, -50%) scale(0.4)' },
        { opacity: 0.85, transform: 'translate(-50%, -50%) scale(1.05)', offset: 0.35 },
        { opacity: 0,    transform: 'translate(-50%, -50%) scale(2.2)' }
      ],
      { duration: 720, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' }
    );
  }
  const path = item.querySelector('.cl-chevron svg path');
  if (path) {
    // One-shot re-draw of the chevron stroke (subtle accent).
    const len = path.getTotalLength ? path.getTotalLength() : 16;
    path.animate(
      [
        { strokeDasharray: `${len}`, strokeDashoffset: `${len}` },
        { strokeDasharray: `${len}`, strokeDashoffset: '0' }
      ],
      { duration: 560, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', fill: 'forwards' }
    );
  }
}

/* ── L0 Scribe top sweep ────────────────────────────────────── */
function fireScribe(item) {
  const scribe = item.querySelector('.cl-fx-scribe');
  if (!scribe) return;
  scribe.animate(
    [
      { transform: 'scaleX(0)', opacity: 0,    transformOrigin: 'left center' },
      { transform: 'scaleX(1)', opacity: 0.95, transformOrigin: 'left center', offset: 0.55 },
      { transform: 'scaleX(1)', opacity: 0,    transformOrigin: 'right center' }
    ],
    { duration: 760, easing: 'cubic-bezier(0.34, 1.1, 0.64, 1)', fill: 'forwards' }
  );
}

/* ── Master orchestrator ────────────────────────────────────── */
function openItem(details) {
  const body  = details.querySelector('.cl-body');
  const inner = body.querySelector('.cl-body-inner');
  const row   = details.closest('li');
  if (!inner.dataset.split) splitWords(inner);

  // Measure target height & word positions in one forced layout.
  body.style.height = 'auto';
  const targetH = body.scrollHeight;
  if (!inner.dataset.measured) {
    measureRadialRank(inner, details.querySelector('.cl-chevron'));
  }
  body.style.height = '0px';
  void body.offsetHeight; // flush

  const pts = springSolve({
    from: 0, to: targetH,
    stiffness: 210, damping: 26, mass: 1,
    dt: 6
  });
  const { keyframes, duration } = springKeyframes(pts, 'height', v => Math.max(0, v) + 'px');
  const a = body.animate(keyframes, { duration, easing: 'linear', fill: 'forwards' });
  a.onfinish = () => { body.style.height = 'auto'; };

  if (REDUCED) return;
  fireAurora(row, false);
  fireRings(row);
  fireShimmer(row);
  fireBorderEnergy(row);
  fireChevron(row);
  fireScribe(row);
}

function closeItem(details) {
  const body = details.querySelector('.cl-body');
  const row  = details.closest('li');
  const current = body.offsetHeight;
  body.style.height = current + 'px';
  void body.offsetHeight;

  const pts = springSolve({
    from: current, to: 0,
    stiffness: 280, damping: 34, mass: 1,
    dt: 6
  });
  const { keyframes, duration } = springKeyframes(pts, 'height', v => Math.max(0, v) + 'px');
  body.animate(keyframes, { duration, easing: 'linear', fill: 'forwards' });

  if (!REDUCED) fireAurora(row, true);
}

/* ── L7 Hover pointer spring ────────────────────────────────── */
function attachHoverSpring(item) {
  let mx = 0, my = 0;
  let tx = 0, ty = 0;
  let vx = 0, vy = 0;
  const k = 240, c = 32, mass = 1;
  let raf = null;
  let last = 0;
  let active = false;

  function loop(now) {
    const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
    last = now;
    const ax = (-k * (mx - tx) - c * vx) / mass;
    const ay = (-k * (my - ty) - c * vy) / mass;
    vx += ax * dt; vy += ay * dt;
    mx += vx * dt; my += vy * dt;
    item.style.setProperty('--mx', mx.toFixed(4));
    item.style.setProperty('--my', my.toFixed(4));
    const still =
      Math.abs(mx - tx) < 0.0008 && Math.abs(vx) < 0.005 &&
      Math.abs(my - ty) < 0.0008 && Math.abs(vy) < 0.005;
    if (still && !active) {
      item.style.setProperty('--mx', '0');
      item.style.setProperty('--my', '0');
      raf = null; last = 0;
      return;
    }
    raf = requestAnimationFrame(loop);
  }
  function kick() {
    if (!raf) { last = 0; raf = requestAnimationFrame(loop); }
  }

  item.addEventListener('pointerenter', (e) => {
    if (e.pointerType === 'touch') return;
    active = true;
    const r = item.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width  - 0.5) * 2;
    ty = ((e.clientY - r.top)  / r.height - 0.5) * 2;
    item.classList.add('cl-hovered');
    kick();
  });
  item.addEventListener('pointermove', (e) => {
    if (!active) return;
    const r = item.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width  - 0.5) * 2;
    ty = ((e.clientY - r.top)  / r.height - 0.5) * 2;
    kick();
  });
  item.addEventListener('pointerleave', () => {
    active = false;
    tx = 0; ty = 0;
    item.classList.remove('cl-hovered');
    kick();
  });
}

/* ── Init ────────────────────────────────────────────────────── */
function init() {
  document.querySelectorAll('.cl-item').forEach((details) => {
    const row  = details.closest('li');
    const body = details.querySelector('.cl-body');
    if (!row || !body) return;

    body.style.height = details.open ? 'auto' : '0px';

    if (!REDUCED) attachHoverSpring(details);

    details.addEventListener('toggle', () => {
      if (details.open) openItem(details);
      else closeItem(details);
    });
  });

  // Recompute radial-rank when viewport width changes (re-flowed text).
  let resizeRaf = null;
  window.addEventListener('resize', () => {
    if (resizeRaf) return;
    resizeRaf = requestAnimationFrame(() => {
      resizeRaf = null;
      document.querySelectorAll('.cl-item').forEach((details) => {
        const body  = details.querySelector('.cl-body');
        const inner = body && body.querySelector('.cl-body-inner');
        if (!inner || !inner.dataset.measured) return;
        // Only re-measure if currently open (positions are reliable then).
        if (!details.open) return;
        measureRadialRank(inner, details.querySelector('.cl-chevron'));
      });
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
