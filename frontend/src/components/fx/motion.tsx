"use client";

import { useEffect, useRef, useState } from "react";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

export { displayFont } from "./fonts";

/**
 * Reveal – elementet glider in (opacity 0 → 1, translateY 28px → 0)
 * när det kommer in i viewport.
 */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : `translateY(${y}px)`,
        transition: `opacity 1.1s ${EASE} ${delay}ms, transform 1.1s ${EASE} ${delay}ms`,
        willChange: shown ? undefined : "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

/**
 * Parallax – innehållet är högre än sin ram och glider långsammare än
 * sidan (translateY 0 → -depth px) medan ramen passerar viewporten.
 */
export function Parallax({
  children,
  depth = 50,
  className,
}: {
  children: React.ReactNode;
  depth?: number;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      const r = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 när ramen kommer in nedifrån, 1 när den lämnar uppåt
      const progress = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      inner.style.transform = `translate3d(0, ${(-depth * progress).toFixed(2)}px, 0)`;
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [depth]);

  return (
    <div ref={wrapRef} className={className} style={{ overflow: "hidden", height: "100%" }}>
      <div
        ref={innerRef}
        style={{ height: `calc(100% + ${depth}px)`, willChange: "transform" }}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Marquee – oändligt rullande textremsa (ren CSS-animation).
 */
export function Marquee({ items, className }: { items: string[]; className?: string }) {
  const row = items.join("  ·  ") + "  ·  ";
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className || ""}`} aria-hidden>
      <div className="fx-marquee inline-block">
        <span>{row}</span>
        <span>{row}</span>
      </div>
      <style>{`
        .fx-marquee { animation: fx-marquee 38s linear infinite; }
        @keyframes fx-marquee {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .fx-marquee { animation: none; }
        }
      `}</style>
    </div>
  );
}
