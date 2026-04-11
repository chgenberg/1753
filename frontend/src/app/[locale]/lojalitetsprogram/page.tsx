"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, Gift, ShoppingBag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "@/components/section-wrapper";
import { cn } from "@/lib/utils";
import { useLocale } from "@/providers/locale-provider";

type Tier = "silver" | "gold" | "platina";

const TIERS: {
  id: Tier;
  image: string;
  threshold: number;
  discount: number;
  color: string;
  bgGradient: string;
  ringColor: string;
}[] = [
  {
    id: "silver",
    image: "/Award_program/Silver.jpg",
    threshold: 2000,
    discount: 5,
    color: "text-gray-500",
    bgGradient: "from-gray-50 to-gray-100/50",
    ringColor: "ring-gray-200",
  },
  {
    id: "gold",
    image: "/Award_program/Gold.jpg",
    threshold: 5000,
    discount: 8,
    color: "text-amber-600",
    bgGradient: "from-amber-50 to-amber-100/50",
    ringColor: "ring-amber-200",
  },
  {
    id: "platina",
    image: "/Award_program/Platina.jpg",
    threshold: 10000,
    discount: 12,
    color: "text-brand-700",
    bgGradient: "from-brand-50 to-brand-100/50",
    ringColor: "ring-brand-200",
  },
];

export default function LoyaltyPage() {
  const { t, path, locale } = useLocale();
  const p = (key: string) => t(`loyaltyPage.${key}`);
  const [activeTier, setActiveTier] = useState<Tier>("silver");
  const active = TIERS.find((tier) => tier.id === activeTier)!;

  const tierTitle = p(`${activeTier}Title`);
  const tierPoints = p(`${activeTier}Points`);
  const tierPerk = p(`${activeTier}Perk`);
  const tierDesc = p(`${activeTier}Desc`);
  const tierImageAlt = p(`imageAlt${activeTier.charAt(0).toUpperCase() + activeTier.slice(1)}`);

  return (
    <>
      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-full bg-brand-900 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-white">
              {p("kicker")}
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-brand-900 md:text-5xl lg:text-6xl">
              {p("h1")}
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-brand-500 md:text-lg">
              {p("lead")}
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <SectionWrapper alt>
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-center text-2xl font-bold tracking-tight text-brand-900 md:text-3xl">
            {p("howTitle")}
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { icon: ShoppingBag, titleKey: "howStep1Title", descKey: "howStep1Desc", step: "01" },
              { icon: Star, titleKey: "howStep2Title", descKey: "howStep2Desc", step: "02" },
              { icon: Gift, titleKey: "howStep3Title", descKey: "howStep3Desc", step: "03" },
            ].map((s) => (
              <div key={s.step} className="group text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-900 text-white shadow-lg shadow-brand-900/10 transition-transform duration-300 group-hover:scale-110">
                  <s.icon className="h-6 w-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-brand-400">
                  {s.step}
                </span>
                <h3 className="mt-1 text-base font-bold text-brand-900">{p(s.titleKey)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-500">{p(s.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Tier selector */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10">
          {/* Tab buttons */}
          <div className="mx-auto mb-12 flex max-w-md justify-center gap-2">
            {TIERS.map((tier) => (
              <button
                key={tier.id}
                onClick={() => setActiveTier(tier.id)}
                className={cn(
                  "flex-1 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300",
                  activeTier === tier.id
                    ? "bg-brand-900 text-white shadow-lg shadow-brand-900/20"
                    : "bg-brand-50 text-brand-500 hover:bg-brand-100"
                )}
              >
                {p(`${tier.id}Title`)}
              </button>
            ))}
          </div>

          {/* Active tier display */}
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
            {/* Image */}
            <div
              className={cn(
                "relative aspect-[4/5] overflow-hidden rounded-3xl bg-gradient-to-b shadow-xl ring-1 transition-all duration-500",
                active.bgGradient,
                active.ringColor,
              )}
            >
              <Image
                src={active.image}
                alt={tierImageAlt}
                fill
                className="object-cover transition-all duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/5" />
            </div>

            {/* Info */}
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-b ring-1",
                    active.bgGradient,
                    active.ringColor,
                  )}
                >
                  <Award className={cn("h-5 w-5", active.color)} />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-brand-400">
                  {tierPoints}
                </span>
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-brand-900 md:text-4xl">
                {tierTitle}
              </h2>

              <div className="mt-4 inline-block rounded-full bg-brand-900 px-4 py-1.5 text-sm font-semibold text-white">
                {tierPerk}
              </div>

              <p className="mt-6 max-w-md text-base leading-relaxed text-brand-500">
                {tierDesc}
              </p>

              <div className="mt-10 h-px bg-brand-100" />

              {/* Progress hint */}
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-brand-100">
                  <div
                    className="rounded-full bg-brand-900 transition-all duration-700"
                    style={{
                      width: `${(active.threshold / 10000) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-xs font-semibold text-brand-500 tabular-nums">
                  {active.threshold.toLocaleString(locale === "en" ? "en-GB" : "sv-SE")} / {(10000).toLocaleString(locale === "en" ? "en-GB" : "sv-SE")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Redeem */}
      <SectionWrapper alt>
        <div className="mx-auto max-w-xl text-center">
          <Gift className="mx-auto mb-4 h-8 w-8 text-brand-700" />
          <h2 className="text-2xl font-bold tracking-tight text-brand-900 md:text-3xl">
            {p("redeemTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-brand-500">
            {p("redeemDesc")}
          </p>
        </div>
      </SectionWrapper>

      {/* CTA */}
      <SectionWrapper>
        <div className="relative overflow-hidden rounded-3xl bg-brand-900 px-8 py-16 text-center shadow-xl md:px-16 md:py-20">
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full border border-white/5 animate-float" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full border border-white/5 animate-float [animation-delay:2s]" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              {p("ctaTitle")}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-brand-300">
              {p("ctaSub")}
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href={path("register")}>
                <Button size="lg" className="bg-white text-brand-900 shadow-lg hover:bg-brand-50 hover:shadow-xl">
                  {p("ctaRegister")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href={path("login")}>
                <Button
                  size="lg"
                  className="border border-white/20 bg-transparent text-white shadow-lg hover:bg-white/10"
                >
                  {p("ctaLogin")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}
