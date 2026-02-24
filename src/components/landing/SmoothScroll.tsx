'use client';

import { useEffect, type ReactNode } from 'react';

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let lenis: any;
    let raf: number;

    async function init() {
      try {
        const mod = await import('lenis');
        const Lenis = mod.default;
        lenis = new Lenis({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
        });

        function onFrame(time: number) {
          lenis?.raf(time);
          raf = requestAnimationFrame(onFrame);
        }
        raf = requestAnimationFrame(onFrame);
      } catch {
        /* lenis unavailable — native scroll is fine */
      }
    }

    init();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, []);

  return <>{children}</>;
}
