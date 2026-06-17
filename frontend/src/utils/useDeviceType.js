import { useState, useEffect } from 'react';

/**
 * Returns true if the primary input is touch (phone/tablet).
 * Uses CSS media query: (hover: none) and (pointer: coarse)
 * This is false on desktop (even with touchscreen monitors as secondary input).
 */
export function useIsTouch() {
  const [isTouch, setIsTouch] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(hover: none) and (pointer: coarse)');
    const handler = (e) => setIsTouch(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return isTouch;
}

/**
 * Returns the current breakpoint bucket.
 * 'mobile'  — < 768px
 * 'tablet'  — 768px – 1023px
 * 'desktop' — ≥ 1024px
 */
export function useBreakpoint() {
  const getBreakpoint = () => {
    if (typeof window === 'undefined') return 'desktop';
    if (window.innerWidth < 768) return 'mobile';
    if (window.innerWidth < 1024) return 'tablet';
    return 'desktop';
  };

  const [bp, setBp] = useState(getBreakpoint);

  useEffect(() => {
    const handler = () => setBp(getBreakpoint());
    window.addEventListener('resize', handler, { passive: true });
    return () => window.removeEventListener('resize', handler);
  }, []);

  return bp;
}
