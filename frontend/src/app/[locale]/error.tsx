"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getMessages } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/types";
import { locales } from "@/lib/i18n/types";
import { localizePath } from "@/lib/i18n/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname() || "/sv";
  const seg = pathname.split("/")[1];
  const locale = (locales.includes(seg as Locale) ? seg : "sv") as Locale;
  const m = getMessages(locale);
  const isEn = locale === "en";
  const home = localizePath(locale, "home");

  useEffect(() => {
    console.error("[ErrorBoundary]", error);
  }, [error]);

  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-lg px-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-brand-500">
          {isEn ? "Something went wrong" : "Något gick fel"}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-brand-900">
          {isEn ? "We hit a snag" : "Ett oväntat fel uppstod"}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          {isEn
            ? "Try reloading the page. If it keeps happening, contact us and we'll sort it out."
            : "Testa att ladda om sidan. Om felet kvarstår, kontakta oss så löser vi det."}
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset} className="rounded-xl h-12 px-8">
            {isEn ? "Try again" : "Försök igen"}
          </Button>
          <Link href={home}>
            <Button variant="outline" className="rounded-xl h-12 px-8">
              {isEn ? "Back to home" : "Till startsidan"}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
