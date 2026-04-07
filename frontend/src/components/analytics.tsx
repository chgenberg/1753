"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { getConsent } from "@/components/cookie-banner";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export function Analytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!GA_ID) return;

    if (getConsent() === "all") {
      setEnabled(true);
    }

    const handler = (e: Event) => {
      if ((e as CustomEvent).detail === "all") {
        setEnabled(true);
      }
    };
    window.addEventListener("cookie-consent", handler);
    return () => window.removeEventListener("cookie-consent", handler);
  }, []);

  if (!GA_ID || !enabled) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            anonymize_ip: true,
            cookie_flags: 'SameSite=None;Secure'
          });
        `}
      </Script>
    </>
  );
}

export function trackEvent(action: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && "gtag" in window && getConsent() === "all") {
    (window as Record<string, unknown> & { gtag: (...args: unknown[]) => void }).gtag("event", action, params);
  }
}
