"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Fast pill-header i frosted glass, centrerad – som claudetype.com.
 * Länkarna går till den riktiga sajten.
 */
export function DemoHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-4 left-1/2 z-50 -translate-x-1/2">
      <nav
        className={`flex items-center gap-1 rounded-full px-2 py-1.5 backdrop-blur-[20px] transition-shadow duration-500 ${
          scrolled ? "shadow-[0_8px_30px_rgba(0,0,0,0.10)]" : "shadow-[0_2px_12px_rgba(0,0,0,0.05)]"
        } bg-white/55`}
        aria-label="Demo-navigation"
      >
        <Link
          href="/sv/produkter"
          className="rounded-full px-4 py-2 text-[13px] font-medium text-[#1d1d1f] transition-colors hover:bg-black/[0.05]"
        >
          Produkter
        </Link>
        <Link
          href="/sv/om-oss"
          className="rounded-full px-4 py-2 text-[13px] font-medium text-[#1d1d1f] transition-colors hover:bg-black/[0.05] max-sm:hidden"
        >
          Om oss
        </Link>
        <Link
          href="/sv"
          className="px-5 font-[family-name:var(--font-fraunces)] text-[19px] tracking-[0.08em] text-[#1d1d1f]"
        >
          1753
        </Link>
        <Link
          href="/sv/gratis-hudanalys"
          className="rounded-full px-4 py-2 text-[13px] font-medium text-[#1d1d1f] transition-colors hover:bg-black/[0.05] max-sm:hidden"
        >
          Hudanalys
        </Link>
        <Link
          href="/sv/kontakt"
          className="rounded-full px-4 py-2 text-[13px] font-medium text-[#1d1d1f] transition-colors hover:bg-black/[0.05]"
        >
          Kontakt
        </Link>
      </nav>
    </header>
  );
}
