"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionWrapper({
  children,
  className,
  alt,
}: {
  children: ReactNode;
  className?: string;
  alt?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={cn(
        "relative py-20 md:py-28 opacity-0 translate-y-6 transition-all duration-700 ease-out",
        visible && "opacity-100 translate-y-0",
        alt && "bg-brand-50/60",
        className
      )}
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-10">{children}</div>
    </section>
  );
}
