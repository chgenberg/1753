"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Lenis smooth scroll – global scrollkänsla för hela sajten.
 * Avaktiveras automatiskt vid prefers-reduced-motion.
 * Element med data-lenis-prevent (t.ex. varukorgens scrollyta) lämnas ifred.
 */
export function LenisProvider({ children }: { children?: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      anchors: true,
    });

    let raf: number;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
