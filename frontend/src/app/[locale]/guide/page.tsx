import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { locales, type Locale } from "@/lib/i18n/types";
import { ALL_LANDING_PAGES } from "@/lib/seo";
import { getContent } from "@/lib/seo/types";
import { getMessages } from "@/lib/i18n";

const BASE_URL = "https://www.1753skin.com";

const CATEGORIES: Record<string, { sv: string; en: string; icon: string }> = {
  howto:     { sv: "Guides och rutiner", en: "Guides & routines", icon: "/landing-pages/1.webp" },
  condition: { sv: "Hudtillstand", en: "Skin conditions", icon: "/landing-pages/3.webp" },
  cbd:       { sv: "CBD for huden", en: "CBD for skin", icon: "/landing-pages/4.webp" },
  cbg:       { sv: "CBG for huden", en: "CBG for skin", icon: "/landing-pages/4.webp" },
  lifestyle: { sv: "Livsstil och hud", en: "Lifestyle & skin", icon: "/landing-pages/2.webp" },
  general:   { sv: "Allmant om hudvard", en: "General skincare", icon: "/landing-pages/6.webp" },
  audience:  { sv: "Hudvard for dig", en: "Skincare for you", icon: "/landing-pages/8.webp" },
  stad:      { sv: "Hudvard i din stad", en: "Skincare in your city", icon: "/landing-pages/6.webp" },
};

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isSv = locale === "sv";
  return {
    title: isSv ? "Hudvardsguide -- artiklar och tips" : "Skincare Guide -- articles and tips",
    description: isSv
      ? "Utforska vara guider om hudvard, CBD, CBG, livsstil och hudtillstand. Vetenskapsbaserade artiklar fran 1753 SKINCARE."
      : "Explore our guides on skincare, CBD, CBG, lifestyle, and skin conditions. Science-based articles from 1753 SKINCARE.",
    alternates: {
      canonical: `${BASE_URL}/${locale}/guide`,
      languages: { sv: `${BASE_URL}/sv/guide`, en: `${BASE_URL}/en/guide` },
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function GuidePage({ params }: Props) {
  const { locale } = await params;
  const l = locale as Locale;
  const isSv = l === "sv";
  const t = getMessages(l);

  const grouped: Record<string, typeof ALL_LANDING_PAGES> = {};
  for (const page of ALL_LANDING_PAGES) {
    if (!grouped[page.category]) grouped[page.category] = [];
    grouped[page.category].push(page);
  }

  const categoryOrder = ["howto", "condition", "cbd", "cbg", "lifestyle", "general", "audience", "stad"];

  const hubSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: isSv ? "Hudvardsguide" : "Skincare Guide",
    description: isSv
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
        url: `${BASE_URL}/${l}/guide/${isSv ? page.svSlug : page.enSlug}`,
        name: getContent(page, l).h1,
      })),
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: isSv ? "Hem" : "Home", item: `${BASE_URL}/${l}` },
      { "@type": "ListItem", position: 2, name: isSv ? "Guide" : "Guide", item: `${BASE_URL}/${l}/guide` },
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
              {isSv ? "Kunskapsbanken" : "Knowledge hub"}
            </p>
            <h1 className="text-[2.4rem] font-bold leading-[1.1] tracking-tight text-[#1d1d1f] md:text-[3.2rem]">
              {isSv ? "Hudvardsguide" : "Skincare Guide"}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-[#515151] md:text-lg">
              {isSv
                ? "Vetenskapsbaserade artiklar om hudvard, livsstil och ingredienser. Varje artikel ar skriven for att ge dig konkret kunskap -- inte salja produkter."
                : "Science-based articles on skincare, lifestyle, and ingredients. Every article is written to give you actionable knowledge -- not to sell products."}
            </p>
            <div className="mt-6 flex items-center justify-center gap-4 text-sm text-[#766a62]">
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                {ALL_LANDING_PAGES.length} {isSv ? "artiklar" : "articles"}
              </span>
              <span className="h-4 w-px bg-[#e6e6e6]" />
              <span>{Object.keys(grouped).length} {isSv ? "kategorier" : "categories"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* AI Analysis CTA */}
      <section className="border-b border-[#e6e6e6] bg-white py-10">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-4 px-6 text-center md:flex-row md:justify-between md:px-10 md:text-left">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-[#1d1d1f]">
              {isSv ? "Vill du veta vad just din hud behover?" : "Want to know what your skin needs?"}
            </h2>
            <p className="mt-1 text-sm text-[#515151]">
              {isSv
                ? "Var gratis AI-hudanalys ger dig personliga rekommendationer pa 60 sekunder."
                : "Our free AI skin analysis gives you personalised recommendations in 60 seconds."}
            </p>
          </div>
          <Link
            href={`/${l}/hudanalys`}
            className="inline-flex items-center gap-2 rounded-full bg-[#108474] px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-[#0d6e62]"
          >
            <Sparkles className="h-4 w-4" />
            {isSv ? "Starta gratis hudanalys" : "Start free skin analysis"}
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
                      {isSv ? meta.sv : meta.en}
                    </h2>
                    <p className="text-xs text-[#766a62]">
                      {pages.length} {isSv ? "artiklar" : "articles"}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {pages.map((page) => {
                    const c = getContent(page, l);
                    const slug = isSv ? page.svSlug : page.enSlug;
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
            {isSv ? "Hittar du inte det du soker?" : "Can't find what you're looking for?"}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#515151]">
            {isSv
              ? "Var AI-chattbot kan svara pa alla dina fragor om hudvard, ingredienser och livsstil."
              : "Our AI chatbot can answer all your questions about skincare, ingredients, and lifestyle."}
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <Link
              href={`/${l}/hudanalys`}
              className="inline-flex items-center gap-2 rounded-full bg-[#108474] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#0d6e62]"
            >
              {isSv ? "Gor hudanalys" : "Take skin analysis"}
            </Link>
            <Link
              href={`/${l}/${isSv ? "produkter" : "products"}`}
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#108474] px-6 py-3 text-sm font-semibold text-[#108474] transition-all hover:bg-[#108474]/5"
            >
              {isSv ? "Se produkter" : "View products"}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
