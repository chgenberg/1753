import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { locales, type Locale } from "@/lib/i18n/types";
import { ALL_LANDING_PAGES } from "@/lib/seo";
import { getContent } from "@/lib/seo/types";
import { getMessages } from "@/lib/i18n";

const BASE_URL = "https://www.1753skin.com";

import type { LandingPage } from "@/lib/seo/types";

function getSlug(page: LandingPage, locale: Locale): string {
  switch (locale) {
    case "es": return page.esSlug || page.enSlug;
    case "de": return page.deSlug || page.enSlug;
    case "fr": return page.frSlug || page.enSlug;
    case "en": return page.enSlug;
    default: return page.svSlug;
  }
}

const CATEGORIES: Record<string, Record<string, string>> = {
  howto:     { sv: "Guides och rutiner", en: "Guides & routines", es: "Guías y rutinas", de: "Guides & Routinen", fr: "Guides et routines", icon: "/landing-pages/1.webp" },
  condition: { sv: "Hudtillstånd", en: "Skin conditions", es: "Afecciones cutáneas", de: "Hautzustände", fr: "Affections cutanées", icon: "/landing-pages/3.webp" },
  cbd:       { sv: "CBD för huden", en: "CBD for skin", es: "CBD para la piel", de: "CBD für die Haut", fr: "CBD pour la peau", icon: "/landing-pages/4.webp" },
  cbg:       { sv: "CBG för huden", en: "CBG for skin", es: "CBG para la piel", de: "CBG für die Haut", fr: "CBG pour la peau", icon: "/landing-pages/4.webp" },
  lifestyle: { sv: "Livsstil och hud", en: "Lifestyle & skin", es: "Estilo de vida y piel", de: "Lifestyle & Haut", fr: "Mode de vie et peau", icon: "/landing-pages/2.webp" },
  general:   { sv: "Allmänt om hudvård", en: "General skincare", es: "Cuidado general", de: "Allgemeine Hautpflege", fr: "Soins généraux", icon: "/landing-pages/6.webp" },
  audience:  { sv: "Hudvård för dig", en: "Skincare for you", es: "Cuidado para ti", de: "Hautpflege für dich", fr: "Soins pour vous", icon: "/landing-pages/8.webp" },
  stad:      { sv: "Hudvård i din stad", en: "Skincare in your city", es: "Cuidado en tu ciudad", de: "Hautpflege in deiner Stadt", fr: "Soins dans votre ville", icon: "/landing-pages/6.webp" },
};

interface Props {
  params: Promise<{ locale: string }>;
}

const GUIDE_PATHS: Record<string, string> = {
  sv: "/sv/guide",
  en: "/en/guide",
  es: "/es/guia",
  de: "/de/ratgeber",
  fr: "/fr/guide",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const svMeta = locale === "sv";
  const canonicalPath = GUIDE_PATHS[locale] ?? GUIDE_PATHS.en;
  return {
    title: svMeta ? "Hudvardsguide -- artiklar och tips" : "Skincare Guide -- articles and tips",
    description: svMeta
      ? "Utforska vara guider om hudvard, CBD, CBG, livsstil och hudtillstand. Vetenskapsbaserade artiklar fran 1753 SKINCARE."
      : "Explore our guides on skincare, CBD, CBG, lifestyle, and skin conditions. Science-based articles from 1753 SKINCARE.",
    alternates: {
      canonical: `${BASE_URL}${canonicalPath}`,
      languages: {
        sv: `${BASE_URL}${GUIDE_PATHS.sv}`,
        en: `${BASE_URL}${GUIDE_PATHS.en}`,
        es: `${BASE_URL}${GUIDE_PATHS.es}`,
        de: `${BASE_URL}${GUIDE_PATHS.de}`,
        fr: `${BASE_URL}${GUIDE_PATHS.fr}`,
        "x-default": `${BASE_URL}${GUIDE_PATHS.en}`,
      },
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function GuidePage({ params }: Props) {
  const { locale } = await params;
  const l = locale as Locale;
  const t = getMessages(l);
  const tx = (sv: string, en: string, es?: string, de?: string, fr?: string) => {
    if (l === "sv") return sv;
    if (l === "es") return es || en;
    if (l === "de") return de || en;
    if (l === "fr") return fr || en;
    return en;
  };

  const grouped: Record<string, typeof ALL_LANDING_PAGES> = {};
  for (const page of ALL_LANDING_PAGES) {
    if (!grouped[page.category]) grouped[page.category] = [];
    grouped[page.category].push(page);
  }

  const categoryOrder = ["howto", "condition", "cbd", "cbg", "lifestyle", "general", "audience", "stad"];

  const hubSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: tx("Hudvardsguide", "Skincare Guide", "Guia de cuidado de la piel", "Hautpflege-Guide", "Guide de soins de la peau"),
    description: l === "sv"
      ? "Samling av vetenskapsbaserade artiklar om hudvard, CBD, CBG och livsstil"
      : "Collection of science-based articles on skincare, CBD, CBG, and lifestyle",
    url: `${BASE_URL}/${l}/guide`,
    publisher: { "@id": "https://www.1753skin.com/#organization" },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: ALL_LANDING_PAGES.length,
      itemListElement: ALL_LANDING_PAGES.slice(0, 20).map((page, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${BASE_URL}/${l}/guide/${getSlug(page, l)}`,
        name: getContent(page, l).h1,
      })),
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: tx("Hem", "Home", "Inicio", "Startseite", "Accueil"), item: `${BASE_URL}/${l}` },
      { "@type": "ListItem", position: 2, name: "Guide", item: `${BASE_URL}/${l}/guide` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hubSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero */}
      <section className="bg-[#f5f5f7] py-20 md:py-28">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#108474]">
              {tx("Kunskapsbanken", "Knowledge hub", "Base de conocimiento", "Wissensdatenbank", "Base de connaissances")}
            </p>
            <h1 className="text-[2.4rem] font-bold leading-[1.1] tracking-tight text-[#1d1d1f] md:text-[3.2rem]">
              {tx("Hudvardsguide", "Skincare Guide", "Guia de cuidado de la piel", "Hautpflege-Guide", "Guide de soins de la peau")}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-[#515151] md:text-lg">
              {tx(
                "Vetenskapsbaserade artiklar om hudvard, livsstil och ingredienser. Varje artikel ar skriven for att ge dig konkret kunskap -- inte salja produkter.",
                "Science-based articles on skincare, lifestyle, and ingredients. Every article is written to give you actionable knowledge -- not to sell products.",
                "Articulos basados en ciencia sobre cuidado de la piel, estilo de vida e ingredientes.",
                "Wissenschaftsbasierte Artikel zu Hautpflege, Lifestyle und Inhaltsstoffen.",
                "Articles scientifiques sur les soins de la peau, le mode de vie et les ingrédients. Chaque article est rédigé pour vous apporter des connaissances concrètes -- pas pour vendre des produits."
              )}
            </p>
            <div className="mt-6 flex items-center justify-center gap-4 text-sm text-[#766a62]">
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                {ALL_LANDING_PAGES.length} {tx("artiklar", "articles", "articulos", "Artikel", "articles")}
              </span>
              <span className="h-4 w-px bg-[#e6e6e6]" />
              <span>{Object.keys(grouped).length} {tx("kategorier", "categories", "categorias", "Kategorien", "catégories")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* AI Analysis CTA */}
      <section className="border-b border-[#e6e6e6] bg-white py-10">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-4 px-6 text-center md:flex-row md:justify-between md:px-10 md:text-left">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-[#1d1d1f]">
              {tx("Vill du veta vad just din hud behover?", "Want to know what your skin needs?", "Quieres saber que necesita tu piel?", "Willst du wissen, was deine Haut braucht?", "Vous voulez savoir ce dont votre peau a besoin ?")}
            </h2>
            <p className="mt-1 text-sm text-[#515151]">
              {tx(
                "Vår gratis AI-hudanalys ger dig 15 hudmetriker, estimerad hudålder och en personlig rutin på 60 sekunder.",
                "Our free AI skin analysis gives you 15 skin metrics, estimated skin age and a personal routine in 60 seconds.",
                "Nuestro analisis de piel gratuito te da 15 metricas, edad estimada de la piel y una rutina personalizada en 60 segundos.",
                "Unsere kostenlose KI-Hautanalyse liefert 15 Hautmetriken, geschatztes Hautalter und eine personliche Routine in 60 Sekunden.",
                "Notre analyse de peau IA gratuite vous offre 15 métriques cutanées, un âge estimé de la peau et une routine personnalisée en 60 secondes."
              )}
            </p>
          </div>
          <Link
            href={`/${l}/hudanalys`}
            className="inline-flex items-center gap-2 rounded-full bg-[#108474] px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-[#0d6e62]"
          >
            <Sparkles className="h-4 w-4" />
            {tx("Starta gratis hudanalys", "Start free skin analysis", "Analisis de piel gratis", "Kostenlose Hautanalyse", "Analyse de peau gratuite")}
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10">
          {categoryOrder.map((cat) => {
            const pages = grouped[cat];
            if (!pages?.length) return null;
            const meta = CATEGORIES[cat] || { sv: cat, en: cat, icon: "/landing-pages/1.webp" };

            return (
              <div key={cat} className="mb-16 last:mb-0">
                <div className="mb-6 flex items-center gap-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5">
                    <Image src={meta.icon} alt="" fill className="object-cover" sizes="48px" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-[#1d1d1f]">
                      {meta[l] || meta.en}
                    </h2>
                    <p className="text-xs text-[#766a62]">
                      {pages.length} {tx("artiklar", "articles", "articulos", "Artikel", "articles")}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {pages.map((page) => {
                    const c = getContent(page, l);
                    const slug = getSlug(page, l);
                    return (
                      <Link
                        key={slug}
                        href={`/${l}/guide/${slug}`}
                        className="group flex items-start gap-3 rounded-2xl border border-[#e6e6e6] bg-white p-4 transition-all duration-300 hover:border-[#108474]/30 hover:shadow-lg hover:shadow-[#108474]/5"
                      >
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold leading-snug text-[#1d1d1f] group-hover:text-[#108474]">
                            {c.h1}
                          </h3>
                          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[#515151]">
                            {c.lead.slice(0, 120)}...
                          </p>
                        </div>
                        <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#766a62] transition-transform group-hover:translate-x-1 group-hover:text-[#108474]" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-[#e6e6e6] bg-[#f5f5f7] py-16">
        <div className="mx-auto max-w-xl px-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-[#1d1d1f]">
            {tx("Hittar du inte det du soker?", "Can't find what you're looking for?", "No encuentras lo que buscas?", "Nicht gefunden, was du suchst?", "Vous ne trouvez pas ce que vous cherchez ?")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#515151]">
            {tx(
              "Var AI-chattbot kan svara pa alla dina fragor om hudvard, ingredienser och livsstil.",
              "Our AI chatbot can answer all your questions about skincare, ingredients, and lifestyle.",
              "Nuestro chatbot de IA puede responder a todas tus preguntas sobre cuidado de la piel, ingredientes y estilo de vida.",
              "Unser KI-Chatbot beantwortet alle deine Fragen zu Hautpflege, Inhaltsstoffen und Lifestyle.",
              "Notre chatbot IA peut répondre à toutes vos questions sur les soins de la peau, les ingrédients et le mode de vie."
            )}
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <Link
              href={`/${l}/hudanalys`}
              className="inline-flex items-center gap-2 rounded-full bg-[#108474] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#0d6e62]"
            >
              {tx("Gor hudanalys", "Take skin analysis", "Analisis de piel", "Hautanalyse starten", "Faire une analyse de peau")}
            </Link>
            <Link
              href={`/${l}/${tx("produkter", "products", "productos", "produkte", "produits")}`}
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#108474] px-6 py-3 text-sm font-semibold text-[#108474] transition-all hover:bg-[#108474]/5"
            >
              {tx("Se produkter", "View products", "Ver productos", "Produkte ansehen", "Voir les produits")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
