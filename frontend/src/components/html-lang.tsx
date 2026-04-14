"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const SUPPORTED = ["en", "es", "de", "fr"] as const;

export function HtmlLang() {
  const pathname = usePathname();
  useEffect(() => {
    const seg = pathname.split("/")[1];
    const lang = (SUPPORTED as readonly string[]).includes(seg) ? seg : "sv";
    document.documentElement.lang = lang;
  }, [pathname]);
  return null;
}
