import { useEffect } from 'react';

/**
 * Cinematic auto-scroll for visitors who don't realise the page scrolls: after a short idle at
 * the top the page drifts down at a steady, slow speed (like a camera move), easing in at the
 * start and easing out as it reaches the event details, where it holds for 2 s before
 * carrying on; the venue reel passes quickly, like a fast cut, and it stops at the page end.
 * Any touch, wheel, key or manual scroll pauses it; it resumes after 5 s of stillness.
 * Never runs for reduced-motion visitors.
 */
const SPEED = 62; // px per second through the reels
const SPEED_MILESTONE = 150; // the title sequence is a long scroll track
const SPEED_VENUE = 300; // reel five rolls past quickly
const HOLD_DETAILS_MS = 2000; // reel four rests briefly

export function useScrollNudge(enabled: boolean) {
  useEffect(() => {
    if (!enabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let timer = 0, raf = 0, playing = false, finished = false, first = true, pos = window.scrollY, passedDetails = false;

    const maxY = () => document.documentElement.scrollHeight - window.innerHeight;
    const stopY = () => {
      if (passedDetails) return maxY();
      const d = document.querySelector<HTMLElement>('.details');
      return d ? d.getBoundingClientRect().top + window.scrollY - 32 : maxY();
    };
    const inVenue = () => {
      const v = document.querySelector('.venue');
      if (!v) return false;
      const r = v.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    };
    const inMilestone = () => {
      const m = document.querySelector('.milestone-track');
      if (!m) return false;
      const r = m.getBoundingClientRect();
      return r.top <= 0 && r.bottom > window.innerHeight;
    };

    const start = () => {
      if (finished) return;
      playing = true;
      pos = window.scrollY;
      const t0 = performance.now();
      let prev = t0;
      const frame = (now: number) => {
        if (!playing) return;
        const dt = Math.min(0.05, (now - prev) / 1000);
        prev = now;
        const stop = stopY();
        const ramp = Math.min(1, (now - t0) / 1800); // ease in
        const brake = Math.max(0.12, Math.min(1, (stop - pos) / 360)); // ease out near the details
        const v = inVenue() ? SPEED_VENUE : inMilestone() ? SPEED_MILESTONE : SPEED;
        pos = Math.min(stop, pos + v * ramp * brake * dt);
        window.scrollTo({ top: pos, behavior: 'instant' });
        if (pos >= stop - 0.5) {
          playing = false;
          if (passedDetails) { finished = true; return; }
          passedDetails = true; // rest on the event details, then carry on
          timer = window.setTimeout(start, HOLD_DETAILS_MS);
          return;
        }
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    };
    const pause = () => { playing = false; cancelAnimationFrame(raf); window.clearTimeout(timer); };
    const arm = () => {
      pause();
      if (finished) return;
      timer = window.setTimeout(start, first ? 2500 : 5000);
      first = false;
    };
    // a scroll we didn't make means the visitor is scrolling
    const onScroll = () => { if (Math.abs(window.scrollY - pos) > 3) { pos = window.scrollY; arm(); } };
    arm();
    window.addEventListener('scroll', onScroll, { passive: true });
    const evs = ['wheel', 'touchstart', 'keydown', 'pointerdown'];
    evs.forEach((ev) => window.addEventListener(ev, arm, { passive: true }));
    return () => {
      pause();
      window.removeEventListener('scroll', onScroll);
      evs.forEach((ev) => window.removeEventListener(ev, arm));
    };
  }, [enabled]);
}
