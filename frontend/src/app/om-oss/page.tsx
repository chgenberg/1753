"use client";

import Image from "next/image";
import { Heart, Leaf, Shield, Users } from "lucide-react";
import { SectionWrapper } from "@/components/section-wrapper";

const TIMELINE = [
  {
    year: "2017",
    title: "Idén föds",
    desc: "Christopher Genberg, plågad av hudproblem, upptäcker att konventionell hudvård skapar fler problem än den löser.",
  },
  {
    year: "2018",
    title: "Första formuleringen",
    desc: "Efter månader av forskning börjar utvecklingen av de första CBD-baserade formulorna.",
  },
  {
    year: "2019",
    title: "1753 SKINCARE lanseras",
    desc: "Med The ONE Facial Oil och I LOVE Facial Oil som första produkter. Varumärket döps efter Carl von Linnés namn.",
  },
  {
    year: "2022",
    title: "Sortimentet växer",
    desc: "Au Naturel Makeup Remover och DUO-kit lanseras. Vi börjar erbjuda kostillskott med Fungtastic.",
  },
  {
    year: "2024",
    title: "TA-DA Serum",
    desc: "Vårt CBG-berikade serum blir en omedelbar kundvavorit. DUO+TA-DA kit skapas.",
  },
  {
    year: "2025",
    title: "Holistisk hudanalys",
    desc: "Vi lanserar AI-driven hudanalys som ser hela bilden: livsstil, kost, sömn – inte bara ytan.",
  },
];

const VALUES = [
  {
    icon: Leaf,
    title: "Ärlighet",
    desc: "Vi gömmer oss inte bakom marknadsföringsspråk. Varje påstående vi gör kan vi backa upp.",
  },
  {
    icon: Heart,
    title: "Holistisk syn",
    desc: "Huden är en spegling av hela kroppen. Vi behandlar orsaker, inte symptom.",
  },
  {
    icon: Shield,
    title: "Kvalitet",
    desc: "Färre men bättre ingredienser. Ingen produktlinje med 50 steg – bara det din hud faktiskt behöver.",
  },
  {
    icon: Users,
    title: "Community",
    desc: "Vi bygger något tillsammans. Varje kundberättelse inspirerar vår nästa produkt.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10">
          <div className="grid items-center gap-10 md:grid-cols-2 lg:gap-16">
            <div className="animate-fade-in">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-brand-500">
                Vår historia
              </p>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                Vi gick vår egen väg
              </h1>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-brand-500">
                1753 SKINCARE grundades ur en frustration med en hudvårdsindustri
                som prioriterar marknadsföring framför resultat. Vi ville
                bevisa att det finns ett bättre sätt — med naturliga
                cannabinoider och en holistisk syn på hud och hälsa.
              </p>
              <p className="mt-3 max-w-lg text-base leading-relaxed text-brand-500">
                Varumärket är uppkallat efter Carl von Linné (1707–1778), den
                svenska botanikern som klassificerade Cannabis sativa år 1753.
                Hans arv lever vidare i vår strävan att förstå naturens kraft.
              </p>
            </div>

            <div className="group relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl shadow-brand-900/5">
              <Image
                src="/stock.jpg"
                alt="1753 SKINCARE – naturlig hudvård"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/5" />
            </div>
          </div>
        </div>
      </section>

      {/* Full-width image break */}
      <div className="relative h-72 overflow-hidden md:h-96">
        <Image
          src="/stock2.jpg"
          alt="Naturliga ingredienser"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-brand-900/30" />
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5" />
      </div>

      {/* Values */}
      <SectionWrapper alt>
        <h2 className="mb-10 text-center text-3xl font-bold tracking-tight">
          Det vi tror på
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-brand-100/60 transition-all duration-300 hover:shadow-lg hover:shadow-brand-900/5"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 ring-1 ring-brand-100">
                <v.icon className="h-5 w-5 text-brand-700" />
              </div>
              <h3 className="mb-1.5 text-sm font-bold tracking-tight text-brand-900">
                {v.title}
              </h3>
              <p className="text-[13px] leading-relaxed text-brand-500">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Two-image section */}
      <SectionWrapper>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="group relative aspect-[3/2] overflow-hidden rounded-3xl shadow-xl shadow-brand-900/5">
            <Image
              src="/stock3.jpg"
              alt="Hudvård – närbild"
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/5" />
          </div>
          <div className="group relative aspect-[3/2] overflow-hidden rounded-3xl shadow-xl shadow-brand-900/5">
            <Image
              src="/stock4.jpg"
              alt="Naturliga ingredienser"
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/5" />
          </div>
        </div>
      </SectionWrapper>

      {/* Timeline */}
      <SectionWrapper alt>
        <h2 className="mb-10 text-center text-3xl font-bold tracking-tight">
          Vår tidslinje
        </h2>
        <div className="mx-auto max-w-2xl">
          {TIMELINE.map((t, i) => (
            <div key={t.year} className="flex gap-6 pb-10 last:pb-0">
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-900 text-xs font-bold text-white">
                  {t.year}
                </div>
                {i < TIMELINE.length - 1 && (
                  <div className="mt-2 w-[1px] flex-1 bg-brand-200" />
                )}
              </div>
              <div className="pt-1.5">
                <h3 className="text-base font-bold tracking-tight">
                  {t.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-brand-500">
                  {t.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>
    </>
  );
}
