"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const SUPPORTED = ["en", "es", "de", "fr"] as const;

function detectLang(pathname: string) {
  const seg = pathname.split("/")[1];
  return (SUPPORTED as readonly string[]).includes(seg) ? seg : "sv";
}

export function HtmlLang() {
  const pathname = usePathname();
  useEffect(() => {
    document.documentElement.lang = detectLang(pathname);
  }, [pathname]);
  return null;
}

const SKIP_LABELS: Record<string, string> = {
  sv: "Hoppa till innehåll",
  en: "Skip to content",
  es: "Saltar al contenido",
  de: "Zum Inhalt springen",
  fr: "Aller au contenu",
};

export function SkipLink() {
  const pathname = usePathname();
  const lang = detectLang(pathname);
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:rounded-lg focus:bg-[#108474] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
    >
      {SKIP_LABELS[lang] ?? SKIP_LABELS.sv}
    </a>
  );
}
