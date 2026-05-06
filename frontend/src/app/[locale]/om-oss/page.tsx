import Image from "next/image";
import { Heart, Leaf, Shield, Users } from "lucide-react";
import { SectionWrapper } from "@/components/section-wrapper";
import { getMessages } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/types";

const VALUE_ICONS = [Leaf, Heart, Shield, Users] as const;

function tx(locale: string, sv: string, en: string, es?: string, de?: string, fr?: string): string {
  if (locale === "sv") return sv;
  if (locale === "es") return es || en;
  if (locale === "de") return de || en;
  if (locale === "fr") return fr || en;
  return en;
}

const ABOUT_PATH: Record<string, string> = {
  sv: "/sv/om-oss",
  en: "/en/about",
  es: "/es/sobre-nosotros",
  de: "/de/ueber-uns",
  fr: "/fr/a-propos",
};

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
    givenName: "Christopher",
    familyName: "Genberg",
    image: "https://www.1753skin.com/Christopher.webp",
    jobTitle: tx(l, "Grundare", "Founder", "Fundador", "Gründer", "Fondateur"),
    description: tx(
      l,
      "Grundare av 1753 SKINCARE. Specialist inom holistisk hudvård och endocannabinoidsystemet.",
      "Founder of 1753 SKINCARE. Specialist in holistic skincare and the endocannabinoid system.",
      "Fundador de 1753 SKINCARE. Especialista en cuidado holístico de la piel y el sistema endocannabinoide.",
      "Gründer von 1753 SKINCARE. Spezialist für ganzheitliche Hautpflege und das Endocannabinoid-System.",
      "Fondateur de 1753 SKINCARE. Spécialiste en soins holistiques et système endocannabinoïde."
    ),
    worksFor: {
      "@type": "Organization",
      "@id": "https://www.1753skin.com/#organization",
      name: "1753 SKINCARE",
    },
    nationality: { "@type": "Country", name: "Sweden" },
    knowsLanguage: ["Swedish", "English"],
    knowsAbout: l === "sv"
      ? ["CBD-hudvård", "CBG-hudvård", "Endocannabinoidsystemet", "Holistisk hudvård", "Hudmikrobiom", "Tarm-hud-axeln", "Nordisk hudvård"]
      : l === "es"
        ? ["Cuidado de la piel con CBD", "Cuidado de la piel con CBG", "Sistema endocannabinoide", "Cuidado holístico de la piel", "Microbioma cutáneo", "Eje intestino-piel", "Cuidado nórdico de la piel"]
        : l === "de"
          ? ["CBD-Hautpflege", "CBG-Hautpflege", "Endocannabinoid-System", "Ganzheitliche Hautpflege", "Hautmikrobiom", "Darm-Haut-Achse", "Nordische Hautpflege"]
          : l === "fr"
            ? ["Soins CBD", "Soins CBG", "Système endocannabinoïde", "Soins holistiques", "Microbiome cutané", "Axe intestin-peau", "Soins nordiques"]
            : ["CBD skincare", "CBG skincare", "Endocannabinoid system", "Holistic skincare", "Skin microbiome", "Gut-skin axis", "Nordic skincare"],
    url: "https://www.1753skin.com" + (ABOUT_PATH[l] || ABOUT_PATH.en),
    sameAs: [
      "https://www.linkedin.com/in/christopher-genberg",
      "https://www.instagram.com/1753.skincare",
    ],
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

      <SectionWrapper>
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-500">
            {p.teamKicker}
          </p>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{p.teamTitle}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-brand-500">
            {p.teamLead}
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl gap-12 md:grid-cols-2 md:gap-10 lg:gap-16">
          <article className="group flex flex-col">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[28px] bg-brand-50 shadow-xl shadow-brand-900/5 ring-1 ring-inset ring-black/5 transition-all duration-500 ease-out group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-brand-900/10">
              <Image
                src="/CG.png"
                alt={p.teamChristopherImgAlt}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/15 to-transparent" />
            </div>
            <div className="mt-6 px-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-700">
                {p.teamChristopherRole}
              </p>
              <h3 className="mt-1.5 text-2xl font-bold tracking-tight text-brand-900">
                {p.teamChristopherName}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-brand-500">
                {p.teamChristopherBio}
              </p>
            </div>
          </article>

          <article className="group flex flex-col">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[28px] bg-brand-50 shadow-xl shadow-brand-900/5 ring-1 ring-inset ring-black/5 transition-all duration-500 ease-out group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-brand-900/10">
              <Image
                src="/Ebba.png"
                alt={p.teamEbbaImgAlt}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/15 to-transparent" />
            </div>
            <div className="mt-6 px-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-700">
                {p.teamEbbaRole}
              </p>
              <h3 className="mt-1.5 text-2xl font-bold tracking-tight text-brand-900">
                {p.teamEbbaName}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-brand-500">
                {p.teamEbbaBio}
              </p>
            </div>
          </article>
        </div>
      </SectionWrapper>
    </>
  );
}
