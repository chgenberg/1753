"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/providers/locale-provider";

const CONSENT_KEY = "1753_cookie_consent";

export type ConsentValue = "all" | "necessary" | null;

export function getConsent(): ConsentValue {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CONSENT_KEY) as ConsentValue;
}

export function CookieBanner() {
  const { t, path } = useLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) setVisible(true);
  }, []);

  function accept(level: "all" | "necessary") {
    localStorage.setItem(CONSENT_KEY, level);
    setVisible(false);
    if (level === "all") {
      window.dispatchEvent(new CustomEvent("cookie-consent", { detail: "all" }));
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] p-4 md:p-6">
      <div className="mx-auto flex max-w-xl flex-col gap-4 rounded-2xl border border-brand-100 bg-white/95 p-5 shadow-2xl shadow-brand-900/10 backdrop-blur-lg sm:flex-row sm:items-center sm:gap-6">
        <p className="flex-1 text-sm leading-relaxed text-brand-600">
          {t("cookieBanner.text")}{" "}
          <Link
            href={path("privacy")}
            className="font-medium text-brand-900 underline underline-offset-2"
          >
            {t("cookieBanner.privacyLink")}
          </Link>
          .
        </p>
        <div className="flex flex-shrink-0 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl"
            onClick={() => accept("necessary")}
          >
            {t("cookieBanner.necessary")}
          </Button>
          <Button size="sm" className="rounded-xl" onClick={() => accept("all")}>
            {t("cookieBanner.acceptAll")}
          </Button>
        </div>
      </div>
    </div>
  );
}
