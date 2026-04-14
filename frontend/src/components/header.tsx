"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingBag, User, X } from "lucide-react";
import { useCart } from "@/providers/cart-provider";
import { useAuth } from "@/providers/auth-provider";
import { cn } from "@/lib/utils";
import { useLocale } from "@/providers/locale-provider";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

function MagneticLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const reducedMotion = usePrefersReducedMotion();

  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      if (reducedMotion) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      setOffset({ x: x * 0.15, y: y * 0.2 });
    },
    [reducedMotion]
  );

  return (
    <Link
      ref={ref}
      href={href}
      className={cn("group relative", className)}
      onMouseMove={handleMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      style={{
        transform: reducedMotion ? undefined : `translate(${offset.x}px, ${offset.y}px)`,
        transition: reducedMotion ? undefined : "transform 0.3s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <span className="relative">
        {children}
        <span className="absolute -bottom-0.5 left-0 h-[1.5px] w-0 bg-brand-900 transition-all duration-500 ease-[cubic-bezier(0.77,0,0.18,1)] group-hover:w-full" />
      </span>
    </Link>
  );
}

export function Header() {
  const { totalItems, toggleCart } = useCart();
  const { isLoggedIn } = useAuth();
  const { t, path, locale } = useLocale();
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = [
    { href: path("home"), label: t("header.navHome") },
    { href: path("products"), label: t("header.navProducts") },
    { href: path("about"), label: t("header.navAbout") },
    { href: path("skinAnalysis"), label: t("header.navAnalysis") },
    { href: path("contact"), label: t("header.navContact") },
  ];

  const accountHref = isLoggedIn ? path("account") : path("login");

  useEffect(() => {
    const onScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docH > 0 ? (window.scrollY / docH) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!langOpen) return;
    const onClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLangOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [langOpen]);

  const localeOrder = ["sv", "en", "es", "de", "fr"] as const;
  const otherLocales = localeOrder.filter(l => l !== locale);

  const localeLabels: Record<string, string> = {
    sv: "Svenska",
    en: "English",
    es: "Español",
    de: "Deutsch",
    fr: "Français",
  };

  const flags: Record<string, React.ReactNode> = {
    sv: (
      <svg viewBox="0 0 32 32" className="h-5 w-5 rounded-full" aria-hidden="true">
        <circle cx="16" cy="16" r="16" fill="#006AA7" />
        <rect x="0" y="13" width="32" height="6" fill="#FECC02" />
        <rect x="10" y="0" width="6" height="32" fill="#FECC02" />
      </svg>
    ),
    en: (
      <svg viewBox="0 0 32 32" className="h-5 w-5 rounded-full" aria-hidden="true">
        <circle cx="16" cy="16" r="16" fill="#012169" />
        <path d="M4 4l24 24M28 4L4 28" stroke="#fff" strokeWidth="4" />
        <path d="M4 4l24 24M28 4L4 28" stroke="#C8102E" strokeWidth="2" />
        <rect x="0" y="13" width="32" height="6" fill="#fff" />
        <rect x="13" y="0" width="6" height="32" fill="#fff" />
        <rect x="0" y="14" width="32" height="4" fill="#C8102E" />
        <rect x="14" y="0" width="4" height="32" fill="#C8102E" />
      </svg>
    ),
    es: (
      <svg viewBox="0 0 32 32" className="h-5 w-5 rounded-full" aria-hidden="true">
        <circle cx="16" cy="16" r="16" fill="#AA151B" />
        <rect x="0" y="8" width="32" height="16" fill="#F1BF00" />
        <rect x="0" y="0" width="32" height="8" fill="#AA151B" />
        <rect x="0" y="24" width="32" height="8" fill="#AA151B" />
      </svg>
    ),
    de: (
      <svg viewBox="0 0 32 32" className="h-5 w-5 rounded-full" aria-hidden="true">
        <circle cx="16" cy="16" r="16" fill="#FFCC00" />
        <path d="M0 16a16 16 0 0 1 32 0" fill="#000" />
        <path d="M0 16a16 16 0 0 0 0 5.4h32A16 16 0 0 0 32 16z" fill="#DD0000" />
      </svg>
    ),
    fr: (
      <svg viewBox="0 0 32 32" className="h-5 w-5 rounded-full" aria-hidden="true">
        <circle cx="16" cy="16" r="16" fill="#fff" />
        <path d="M0 5.4A16 16 0 0 0 0 26.6V5.4z" fill="#002395" />
        <rect x="0" y="0" width="11" height="32" fill="#002395" />
        <rect x="21" y="0" width="11" height="32" fill="#ED2939" />
      </svg>
    ),
  };

  const currentFlag = flags[locale] || flags.sv;

  return (
    <>
      <div
        className="fixed top-0 left-0 z-[60] h-[2px] bg-brand-700 transition-all duration-150"
        style={{ width: `${progress}%` }}
      />

      <header className="sticky top-0 z-50 h-16 border-b border-brand-100 bg-white">
        <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-6 md:px-10">
          <Link href={path("home")} className="flex-shrink-0">
            <Image
              src="/1753.webp"
              alt={t("header.logoAlt")}
              width={48}
              height={48}
              priority
            />
          </Link>

          <nav className="hidden items-center gap-10 md:flex">
            {nav.map((link) => {
              const isActive = pathname === link.href;
              return (
                <MagneticLink
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-[13px] font-semibold uppercase tracking-[0.08em]",
                    isActive ? "text-brand-700 pointer-events-none" : "text-brand-900"
                  )}
                >
                  {link.label}
                </MagneticLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-1">
            <div ref={langRef} className="relative">
              <button
                onClick={() => setLangOpen(o => !o)}
                className="group relative flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-brand-50"
                aria-label={t("header.langSwitch")}
                aria-expanded={langOpen}
              >
                <span className="overflow-hidden rounded-full ring-1 ring-brand-200/60 transition-all duration-300 group-hover:ring-brand-400 group-hover:shadow-sm">
                  {currentFlag}
                </span>
              </button>

              <div
                className={cn(
                  "absolute right-0 top-full mt-2 flex items-center gap-1.5 rounded-2xl border border-brand-100 bg-white/95 px-2.5 py-2 shadow-lg backdrop-blur-xl transition-all duration-300",
                  langOpen
                    ? "pointer-events-auto translate-y-0 opacity-100 scale-100"
                    : "pointer-events-none -translate-y-1 opacity-0 scale-95"
                )}
              >
                {otherLocales.map(l => (
                  <Link
                    key={l}
                    href={`/${l}`}
                    onClick={() => setLangOpen(false)}
                    className="group/flag flex flex-col items-center gap-1 rounded-xl px-2 py-1.5 transition-colors hover:bg-brand-50"
                    title={localeLabels[l]}
                  >
                    <span className="overflow-hidden rounded-full ring-1 ring-brand-200/40 transition-all duration-200 group-hover/flag:ring-brand-400 group-hover/flag:shadow-sm">
                      {flags[l]}
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-brand-400 transition-colors group-hover/flag:text-brand-700">
                      {l}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href={accountHref}
              className="flex h-10 w-10 items-center justify-center rounded-full text-brand-900 transition-colors hover:bg-brand-50"
              aria-label={t("header.accountAria")}
            >
              <User className="h-[18px] w-[18px]" />
            </Link>

            <button
              onClick={toggleCart}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-brand-900 transition-colors hover:bg-brand-50"
              aria-label={t("header.cartAria")}
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-brand-900 text-[9px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileOpen(true)}
              className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-full transition-colors hover:bg-brand-50 md:hidden"
              aria-label={t("header.openMenuAria")}
            >
              <span className="block h-[1.5px] w-[18px] bg-brand-900" />
              <span className="block h-[1.5px] w-[18px] bg-brand-900" />
              <span className="block h-[1.5px] w-3 bg-brand-900" />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[70] flex flex-col bg-white">
          <div className="flex items-center justify-between border-b border-brand-100 px-6 py-5">
            <Image src="/1753.webp" alt={t("header.logoAlt")} width={48} height={48} />
            <button
              onClick={() => setMobileOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-900 hover:bg-brand-100"
              aria-label={t("header.closeMenuAria")}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-1 flex-col items-center justify-center gap-6">
            {nav.map((link, i) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={isActive ? "#" : link.href}
                  onClick={(e) => {
                    if (isActive) e.preventDefault();
                    setMobileOpen(false);
                  }}
                  className={cn(
                    "text-2xl font-bold tracking-tight opacity-0 animate-fade-in",
                    isActive ? "text-brand-700" : "text-brand-900"
                  )}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="flex items-center gap-3">
              {otherLocales.map(l => (
                <Link
                  key={l}
                  href={`/${l}`}
                  onClick={() => setMobileOpen(false)}
                  className="flex flex-col items-center gap-1.5 rounded-xl px-3 py-2 transition-colors hover:bg-brand-50"
                >
                  <span className="overflow-hidden rounded-full ring-1 ring-brand-200/60">
                    {flags[l]}
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-brand-500">
                    {l}
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-6 h-px w-16 bg-brand-200" />
            <Link
              href={accountHref}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 text-sm font-medium text-brand-500 opacity-0 animate-fade-in"
              style={{ animationDelay: `${nav.length * 80}ms` }}
            >
              <User className="h-4 w-4" />
              {isLoggedIn ? t("header.account") : t("header.login")}
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
