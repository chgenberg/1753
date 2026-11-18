"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface Flake {
  x: number;
  y: number;
  r: number;
  vy: number;
  sway: number;
  phase: number;
  freq: number;
  alpha: number;
}

/**
 * Stilla snöfall som knappt syns. Ritas på en canvas ovanpå sin förälder
 * (som ska vara `relative`). Flingorna driver lite åt det håll muspekaren är.
 * Står still när den inte syns i fönstret, och ritas inte alls för den som
 * har valt reducerad rörelse.
 */
export function Snow({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let flakes: Flake[] = [];
    let raf = 0;
    let last = 0;
    let inView = false;
    let wind = 0;
    let windTarget = 0;

    const makeFlake = (anywhere: boolean): Flake => {
      const depth = Math.random();
      return {
        x: Math.random() * width,
        y: anywhere ? Math.random() * height : -6,
        r: 0.6 + depth * 1.6,
        vy: 9 + depth * 20,
        sway: 4 + Math.random() * 10,
        phase: Math.random() * Math.PI * 2,
        freq: 0.3 + Math.random() * 0.5,
        alpha: 0.14 + depth * 0.3,
      };
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(80, Math.max(20, (width * height) / 17000)));
      flakes = Array.from({ length: count }, () => makeFlake(true));
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      wind += (windTarget - wind) * Math.min(1, dt * 1.2);
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];
        f.phase += f.freq * dt;
        f.y += f.vy * dt;
        f.x += (Math.cos(f.phase) * f.sway + wind * (0.5 + f.r * 0.3)) * dt;
        if (f.y > height + 6) {
          flakes[i] = makeFlake(false);
          continue;
        }
        if (f.x < -6) f.x = width + 6;
        else if (f.x > width + 6) f.x = -6;
        ctx.globalAlpha = f.alpha;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };
    const start = () => {
      if (raf || !inView || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      windTarget = (e.clientX / window.innerWidth - 0.5) * 28;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else stop();
    });
    intersectionObserver.observe(canvas);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    />
  );
}
