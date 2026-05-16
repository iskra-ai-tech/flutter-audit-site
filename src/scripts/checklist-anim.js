/* ============================================================
   checklist-anim.js — v3, minimal-JS architecture
   ─────────────────────────────────────────────────────────
   All heavy lifting is delegated to the browser's native
   compositor. JS only:
     1. Manages the height transition on <details>::details-content
        for browsers without `interpolate-size: allow-keywords`
        (Safari as of May 2026) — FLIP-style measure + set
     2. Triggers a one-shot WAAPI shimmer sweep + scribe draw
        on the toggle event. WAAPI runs on the compositor
        thread, animating only transform + opacity.

   No rAF loops. No per-frame CSS custom property writes. No
   pointermove handlers. The browser does the interpolation.
   ============================================================ */

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Native height: auto ↔ 0 transition works directly in Chromium +
// Firefox with `interpolate-size: allow-keywords` declared on :root
// (Baseline 2025). Safari 18.4 supports `::details-content` but not
// `interpolate-size` yet — we feature-detect and run a JS fallback.
const NATIVE_HEIGHT_ANIM = CSS.supports('interpolate-size', 'allow-keywords');

function setupHeightFallback(details) {
  // Only used for browsers without interpolate-size. Mirrors the
  // CSS height transition by measuring scrollHeight + setting inline
  // height, then letting CSS transition handle the actual lerp.
  const body = details.querySelector('.cl-body');
  if (!body) return;

  if (!details.open) body.style.height = '0px';
  else body.style.height = 'auto';

  details.addEventListener('toggle', () => {
    if (details.open) {
      // Render content at auto height so we can measure scrollHeight,
      // then snap visual to 0, then animate up to measured.
      body.style.height = 'auto';
      const target = body.scrollHeight;
      body.style.height = '0px';
      // Force layout flush so the 0 is registered as a transition start.
      void body.offsetHeight;
      body.style.height = target + 'px';

      const onEnd = (e) => {
        if (e.target !== body || e.propertyName !== 'height') return;
        body.style.height = 'auto'; // release for content reflow
        body.removeEventListener('transitionend', onEnd);
      };
      body.addEventListener('transitionend', onEnd);
    } else {
      // Closing — freeze current height in px, force reflow, transition to 0.
      const current = body.offsetHeight;
      body.style.height = current + 'px';
      void body.offsetHeight;
      body.style.height = '0px';
    }
  });
}

function triggerShimmer(row) {
  const shim = row.querySelector('.cl-shimmer');
  if (!shim) return;
  // WAAPI — composite-thread on transform + opacity. The browser
  // interpolates without any per-frame JS work.
  shim.animate(
    [
      { transform: 'translateX(-60%)', opacity: 0 },
      { transform: 'translateX(40%)',  opacity: 1, offset: 0.45 },
      { transform: 'translateX(260%)', opacity: 0 }
    ],
    {
      duration: 720,
      easing: 'cubic-bezier(0.45, 0, 0.35, 1)',
      fill: 'forwards'
    }
  );
}

function triggerScribe(row) {
  const scribe = row.querySelector('.cl-scribe');
  if (!scribe) return;
  scribe.animate(
    [
      { transform: 'scaleX(0)', opacity: 0 },
      { transform: 'scaleX(1)', opacity: 0.85, offset: 0.55 },
      { transform: 'scaleX(1)', opacity: 0 }
    ],
    {
      duration: 620,
      easing: 'cubic-bezier(0.34, 1.2, 0.64, 1)',
      fill: 'forwards'
    }
  );
}

function init() {
  const items = document.querySelectorAll('[data-cl-item]');
  items.forEach((details) => {
    const row = details.closest('li');
    if (!row) return;

    if (!NATIVE_HEIGHT_ANIM && !REDUCED) {
      setupHeightFallback(details);
    }

    details.addEventListener('toggle', () => {
      if (REDUCED) return;
      if (details.open) {
        triggerShimmer(row);
        triggerScribe(row);
      }
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
