"use client";

import Link from "next/link";
import { useLocale } from "@/providers/locale-provider";

export function TopBanner() {
  const { t, path } = useLocale();
  const MESSAGES = [t("topBanner.m0"), t("topBanner.m1"), t("topBanner.m2"), t("topBanner.m3"), t("topBanner.m4")];
  const repeated = [...MESSAGES, ...MESSAGES];
  const separator = "\u00a0\u00a0\u00a0\u2014\u00a0\u00a0\u00a0";

  return (
    <div className="relative z-50 overflow-hidden bg-brand-900 py-2">
      <Link href={path("loyalty")} className="block">
        <div className="flex animate-marquee whitespace-nowrap">
          {[0, 1].map((set) => (
            <span key={set} className="flex shrink-0 items-center">
              {repeated.map((msg, i) => (
                <span key={`${set}-${i}`} className="text-[11px] font-medium tracking-wide text-white/90">
                  {msg}
                  <span className="text-white/30">{separator}</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </Link>
    </div>
  );
}
