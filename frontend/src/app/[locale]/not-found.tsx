"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getMessages } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/types";
import { locales } from "@/lib/i18n/types";
import { localizePath } from "@/lib/i18n/navigation";

export default function NotFound() {
  const pathname = usePathname() || "/sv";
  const seg = pathname.split("/")[1];
  const locale = (locales.includes(seg as Locale) ? seg : "sv") as Locale;
  const m = getMessages(locale);
  const t = (key: string) => {
    const parts = key.split(".");
    let cur: unknown = m;
    for (const p of parts) {
      if (cur && typeof cur === "object" && p in (cur as object)) {
        cur = (cur as Record<string, unknown>)[p];
      } else return key;
    }
    return typeof cur === "string" ? cur : key;
  };
  const home = localizePath(locale, "home");
  const products = localizePath(locale, "products");

  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-lg px-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-brand-500">
          404
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">{t("notFoundPage.title")}</h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">{t("notFoundPage.sub")}</p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href={home}>
            <Button className="rounded-xl h-12 px-8">{t("notFoundPage.home")}</Button>
          </Link>
          <Link href={products}>
            <Button variant="outline" className="rounded-xl h-12 px-8">
              {t("notFoundPage.products")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
