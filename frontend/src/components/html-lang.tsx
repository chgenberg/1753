"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function HtmlLang() {
  const pathname = usePathname();
  useEffect(() => {
    const lang = pathname.startsWith("/en") ? "en" : "sv";
    document.documentElement.lang = lang;
  }, [pathname]);
  return null;
}
