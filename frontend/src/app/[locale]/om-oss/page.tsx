import Image from "next/image";
import { Heart, Leaf, Shield, Users } from "lucide-react";
import { SectionWrapper } from "@/components/section-wrapper";
import { getMessages } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/types";

const VALUE_ICONS = [Leaf, Heart, Shield, Users] as const;

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const p = getMessages(l).aboutPage;
  const values = p.values.map((v, i) => ({ ...v, icon: VALUE_ICONS[i] }));

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://www.1753skin.com/#founder",
    name: "Christopher Genberg",
    jobTitle: l === "sv" ? "Grundare" : "Founder",
    worksFor: {
      "@type": "Organization",
      "@id": "https://www.1753skin.com/#organization",
      name: "1753 SKINCARE",
    },
    knowsAbout: [
      "CBD skincare",
      "CBG skincare",
      "Endocannabinoid system",
      "Holistic skincare",
      "Nordic skincare",
    ],
    url: "https://www.1753skin.com" + (l === "sv" ? "/sv/om-oss" : "/en/about"),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10">
          <div className="grid items-center gap-10 md:grid-cols-2 lg:gap-16">
            <div className="animate-fade-in">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-brand-500">
                {p.kicker}
              </p>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                {p.h1}
              </h1>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-brand-500">{p.lead1}</p>
              <p className="mt-3 max-w-lg text-base leading-relaxed text-brand-500">{p.lead2}</p>
            </div>

            <div className="group relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl shadow-brand-900/5">
              <Image
                src="/stock.jpg"
                alt={p.heroImgAlt}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/5" />
            </div>
          </div>
        </div>
      </section>

      <div className="relative h-72 overflow-hidden md:h-96">
        <Image
          src="/stock2.jpg"
          alt={p.breakImgAlt}
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-brand-900/30" />
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5" />
      </div>

      <SectionWrapper alt>
        <h2 className="mb-10 text-center text-3xl font-bold tracking-tight">{p.valuesTitle}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-brand-100/60 transition-all duration-300 hover:shadow-lg hover:shadow-brand-900/5"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 ring-1 ring-brand-100">
                <v.icon className="h-5 w-5 text-brand-700" />
              </div>
              <h3 className="mb-1.5 text-sm font-bold tracking-tight text-brand-900">{v.title}</h3>
              <p className="text-[13px] leading-relaxed text-brand-500">{v.desc}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="group relative aspect-[3/2] overflow-hidden rounded-3xl shadow-xl shadow-brand-900/5">
            <Image
              src="/stock3.jpg"
              alt={p.dualImgAlt1}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/5" />
          </div>
          <div className="group relative aspect-[3/2] overflow-hidden rounded-3xl shadow-xl shadow-brand-900/5">
            <Image
              src="/stock4.jpg"
              alt={p.dualImgAlt2}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/5" />
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper alt>
        <h2 className="mb-10 text-center text-3xl font-bold tracking-tight">{p.timelineTitle}</h2>
        <div className="mx-auto max-w-2xl">
          {p.timeline.map((t, i) => (
            <div key={t.year} className="flex gap-6 pb-10 last:pb-0">
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-900 text-xs font-bold text-white">
                  {t.year}
                </div>
                {i < p.timeline.length - 1 && (
                  <div className="mt-2 w-[1px] flex-1 bg-brand-200" />
                )}
              </div>
              <div className="pt-1.5">
                <h3 className="text-base font-bold tracking-tight">{t.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-brand-500">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>
    </>
  );
}
