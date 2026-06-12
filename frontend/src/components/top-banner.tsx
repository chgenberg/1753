"use client";

import Link from "next/link";
import { useLocale } from "@/providers/locale-provider";

export function TopBanner() {
  const { t, path } = useLocale();
  const MESSAGES = [t("topBanner.m0"), t("topBanner.m1"), t("topBanner.m2"), t("topBanner.m3"), t("topBanner.m4")];
  const repeated = [...MESSAGES, ...MESSAGES];

  return (
    <div className="relative z-50 overflow-hidden border-b border-[#e6e6e6]/60 bg-[#f5f5f7] py-[7px]">
      <Link href={path("loyalty")} className="block">
        <div className="flex animate-marquee whitespace-nowrap" style={{ animationDuration: "55s" }}>
          {[0, 1].map((set) => (
            <span key={set} className="flex shrink-0 items-center">
              {repeated.map((msg, i) => (
                <span key={`${set}-${i}`} className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#766a62]">
                  {msg}
                  <span className="mx-8 inline-block h-[3px] w-[3px] -translate-y-[2px] rounded-full bg-[#766a62]/40 align-middle" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </Link>
    </div>
  );
}
