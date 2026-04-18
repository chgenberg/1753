import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { locales, type Locale } from "@/lib/i18n/types";
import { localizePath } from "@/lib/i18n/navigation";
import { PRODUCTS } from "@/lib/products";
import { ALL_LANDING_PAGES } from "@/lib/seo";
import { getPageBySlug, getContent, getSlug } from "@/lib/seo/types";
import { getMessages } from "@/lib/i18n";

const BASE_URL = "https://www.1753skin.com";
const LP = "/landing-pages";

const OG_LOCALE: Record<string, string> = { sv: "sv_SE", en: "en_US", es: "es_ES", de: "de_DE", fr: "fr_FR" };

const ARTICLE_PUBLISHED = "2026-01-15";
const ARTICLE_MODIFIED = "2026-04-16";

const DATE_LOCALE: Record<string, string> = { sv: "sv-SE", en: "en-GB", es: "es-ES", de: "de-DE", fr: "fr-FR" };

function formatDate(isoDate: string, locale: string): string {
  try {
    return new Date(isoDate).toLocaleDateString(DATE_LOCALE[locale] || "en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return isoDate;
  }
}

type SourceRef = { text: string; href?: string };

const CATEGORY_SOURCES: Record<string, SourceRef[]> = {
  cbd: [
    { text: "Bíró T, Tóth BI, Haskó G, Paus R, Pacher P. The endocannabinoid system of the skin in health and disease. Trends Pharmacol Sci 2009;30(8):411–420.", href: "https://doi.org/10.1016/j.tips.2009.05.004" },
    { text: "Oláh A, Tóth BI, Borbíró I, et al. Cannabidiol exerts sebostatic and antiinflammatory effects on human sebocytes. J Clin Invest 2014;124(9):3713–3724.", href: "https://doi.org/10.1172/JCI64628" },
    { text: "Tóth KF, Ádám D, Bíró T, Oláh A. Cannabinoid signaling in the skin: therapeutic potential of the c(ut)annabinoid system. Molecules 2019;24(5):918.", href: "https://doi.org/10.3390/molecules24050918" },
  ],
  cbg: [
    { text: "Bíró T, Tóth BI, Haskó G, Paus R, Pacher P. The endocannabinoid system of the skin in health and disease. Trends Pharmacol Sci 2009;30(8):411–420.", href: "https://doi.org/10.1016/j.tips.2009.05.004" },
    { text: "Tóth KF, Ádám D, Bíró T, Oláh A. Cannabinoid signaling in the skin: therapeutic potential of the c(ut)annabinoid system. Molecules 2019;24(5):918.", href: "https://doi.org/10.3390/molecules24050918" },
  ],
  condition: [
    { text: "Byrd AL, Belkaid Y, Segre JA. The human skin microbiome. Nat Rev Microbiol 2018;16(3):143–155.", href: "https://doi.org/10.1038/nrmicro.2017.157" },
    { text: "Salem I, Ramser A, Isham N, Ghannoum MA. The Gut Microbiome as a Major Regulator of the Gut-Skin Axis. Front Microbiol 2018;9:1459.", href: "https://doi.org/10.3389/fmicb.2018.01459" },
    { text: "Lin TK, Zhong L, Santiago JL. Anti-Inflammatory and Skin Barrier Repair Effects of Topical Application of Some Plant Oils. Int J Mol Sci 2017;19(1):70." },
  ],
  lifestyle: [
    { text: "Chen Y, Lyga J. Brain-skin connection: stress, inflammation and skin aging. Inflamm Allergy Drug Targets 2014;13(3):177–190." },
    { text: "Walker MP, van der Helm E. Overnight therapy? The role of sleep in emotional brain processing. Psychol Bull 2009;135(5):731–748." },
    { text: "Katta R, Desai SP. Diet and Dermatology: The Role of Dietary Intervention in Skin Disease. J Clin Aesthet Dermatol 2014;7(7):46–51." },
  ],
  general: [
    { text: "Byrd AL, Belkaid Y, Segre JA. The human skin microbiome. Nat Rev Microbiol 2018;16(3):143–155.", href: "https://doi.org/10.1038/nrmicro.2017.157" },
    { text: "Bíró T, Tóth BI, Haskó G, Paus R, Pacher P. The endocannabinoid system of the skin in health and disease. Trends Pharmacol Sci 2009;30(8):411–420.", href: "https://doi.org/10.1016/j.tips.2009.05.004" },
  ],
  howto: [
    { text: "Lin TK, Zhong L, Santiago JL. Anti-Inflammatory and Skin Barrier Repair Effects of Topical Application of Some Plant Oils. Int J Mol Sci 2017;19(1):70." },
    { text: "Meier L, Stange R, Michalsen A, Uehleke B. Clay jojoba oil facial mask for lesioned skin and mild acne. Forsch Komplementmed 2012;19(2):75–79." },
  ],
  audience: [
    { text: "Byrd AL, Belkaid Y, Segre JA. The human skin microbiome. Nat Rev Microbiol 2018;16(3):143–155.", href: "https://doi.org/10.1038/nrmicro.2017.157" },
  ],
  stad: [
    { text: "Prescott SL, Larcombe DL, Logan AC, et al. The skin microbiome: impact of modern environments on skin ecology, barrier integrity, and systemic immune programming. World Allergy Organ J 2017;10(1):29." },
  ],
};

function getSources(category: string): SourceRef[] {
  return CATEGORY_SOURCES[category] || CATEGORY_SOURCES.general;
}

function tx(locale: string, sv: string, en: string, es?: string, de?: string, fr?: string): string {
  if (locale === "sv") return sv;
  if (locale === "es") return es || en;
  if (locale === "de") return de || en;
  if (locale === "fr") return fr || en;
  return en;
}

function getRelatedPages(current: ReturnType<typeof getPageBySlug>, locale: Locale, max = 6) {
  if (!current) return [];
  const candidates = ALL_LANDING_PAGES.filter(
    (p) => p.svSlug !== current.svSlug,
  );
  const sameCategory = candidates.filter((p) => p.category === current.category);
  const otherCategories = candidates.filter((p) => p.category !== current.category);

  const result = [...sameCategory.slice(0, Math.min(4, sameCategory.length))];
  const remaining = max - result.length;
  if (remaining > 0) result.push(...otherCategories.slice(0, remaining));
  return result.slice(0, max);
}

const CATEGORY_IMAGES: Record<string, { hero: string; secondary?: string }> = {
  general:   { hero: `${LP}/1.webp`, secondary: `${LP}/6.webp` },
  cbd:       { hero: `${LP}/4.webp`, secondary: `${LP}/3.webp` },
  cbg:       { hero: `${LP}/4.webp`, secondary: `${LP}/1.webp` },
  condition: { hero: `${LP}/3.webp`, secondary: `${LP}/5.webp` },
  lifestyle: { hero: `${LP}/2.webp`, secondary: `${LP}/7.webp` },
  howto:     { hero: `${LP}/1.webp`, secondary: `${LP}/4.webp` },
  audience:  { hero: `${LP}/8.webp`, secondary: `${LP}/6.webp` },
  stad:      { hero: `${LP}/6.webp`, secondary: `${LP}/2.webp` },
};

const FALLBACK = { hero: `${LP}/1.webp` };

function getImages(category: string) {
  return CATEGORY_IMAGES[category] || FALLBACK;
}

interface Props {
  params: Promise<{ locale: Locale; slug: string }>;
}

export async function generateStaticParams() {
  const out: { locale: string; slug: string }[] = [];
  for (const page of ALL_LANDING_PAGES) {
    out.push({ locale: "sv", slug: page.svSlug });
    out.push({ locale: "en", slug: page.enSlug });
    if (page.esSlug) out.push({ locale: "es", slug: page.esSlug });
    if (page.deSlug) out.push({ locale: "de", slug: page.deSlug });
    if (page.frSlug) out.push({ locale: "fr", slug: page.frSlug });
  }
  return out;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = getPageBySlug(ALL_LANDING_PAGES, slug, locale as Locale);
  if (!page) return {};
  const c = getContent(page, locale as Locale);
  const images = getImages(page.category);
  const svPath = `/sv/guide/${page.svSlug}`;
  const enPath = `/en/guide/${page.enSlug}`;
  const langs: Record<string, string> = {
    sv: `${BASE_URL}${svPath}`,
    en: `${BASE_URL}${enPath}`,
  };
  if (page.esSlug) langs.es = `${BASE_URL}/es/guide/${page.esSlug}`;
  if (page.deSlug) langs.de = `${BASE_URL}/de/guide/${page.deSlug}`;
  if (page.frSlug) langs.fr = `${BASE_URL}/fr/guide/${page.frSlug}`;
  langs["x-default"] = `${BASE_URL}${svPath}`;
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: {
      canonical: `${BASE_URL}/${locale}/guide/${slug}`,
      languages: langs,
    },
    openGraph: {
      title: c.metaTitle,
      description: c.metaDescription,
      url: `${BASE_URL}/${locale}/guide/${slug}`,
      images: [{ url: `${BASE_URL}${images.hero}`, width: 1200, height: 1200 }],
      locale: OG_LOCALE[locale] || "en_US",
      type: "article",
    },
  };
}

export default async function GuidePage({ params }: Props) {
  const { locale, slug } = await params;
  const l = locale as Locale;
  const page = getPageBySlug(ALL_LANDING_PAGES, slug, l);
  if (!page) notFound();

  const c = getContent(page, l);
  const t = getMessages(l);
  const images = getImages(page.category);
  const products = page.productIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: tx(l, "Hem", "Home", "Inicio", "Startseite", "Accueil"),
        item: `${BASE_URL}/${l}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: tx(l, "Guide", "Guide", "Guía", "Ratgeber", "Guide"),
        item: `${BASE_URL}/${l}/guide`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: c.h1,
        item: `${BASE_URL}/${l}/guide/${slug}`,
      },
    ],
  };

  const CATEGORY_ENTITIES: Record<string, { name: string; sameAs: string }[]> = {
    cbd: [
      { name: "Cannabidiol", sameAs: "https://www.wikidata.org/wiki/Q422197" },
      { name: "Endocannabinoid system", sameAs: "https://www.wikidata.org/wiki/Q901330" },
    ],
    cbg: [
      { name: "Cannabigerol", sameAs: "https://www.wikidata.org/wiki/Q5033195" },
      { name: "Endocannabinoid system", sameAs: "https://www.wikidata.org/wiki/Q901330" },
    ],
    condition: [
      { name: "Dermatology", sameAs: "https://www.wikidata.org/wiki/Q171171" },
      { name: "Skin", sameAs: "https://www.wikidata.org/wiki/Q1074" },
    ],
    lifestyle: [
      { name: "Skin care", sameAs: "https://www.wikidata.org/wiki/Q2383867" },
    ],
    general: [
      { name: "Skin care", sameAs: "https://www.wikidata.org/wiki/Q2383867" },
    ],
    howto: [
      { name: "Skin care", sameAs: "https://www.wikidata.org/wiki/Q2383867" },
    ],
    audience: [
      { name: "Skin care", sameAs: "https://www.wikidata.org/wiki/Q2383867" },
    ],
    stad: [
      { name: "Skin care", sameAs: "https://www.wikidata.org/wiki/Q2383867" },
    ],
  };

  const aboutEntities = (CATEGORY_ENTITIES[page.category] || CATEGORY_ENTITIES.general).map((e) => ({
    "@type": "Thing",
    name: e.name,
    sameAs: e.sameAs,
  }));

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: c.h1,
    description: c.metaDescription,
    image: `${BASE_URL}${images.hero}`,
    datePublished: ARTICLE_PUBLISHED,
    dateModified: ARTICLE_MODIFIED,
    author: {
      "@type": "Person",
      name: "Christopher Genberg",
      url: `${BASE_URL}/${l}/om-oss`,
    },
    publisher: {
      "@type": "Organization",
      name: "1753 SKINCARE",
      logo: { "@type": "ImageObject", url: `${BASE_URL}/1753.webp` },
    },
    mainEntityOfPage: `${BASE_URL}/${l}/guide/${slug}`,
    inLanguage: l,
    about: aboutEntities,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".article-lead"],
    },
  };

  const howToSchema = page.category === "howto" ? {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: c.h1,
    description: c.lead,
    totalTime: "PT5M",
    step: c.tips.map((tip, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: tip.title,
      text: tip.body,
    })),
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}

      <article>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#f5f5f7] py-20 md:py-28">
        <div className="mx-auto grid max-w-[1280px] items-center gap-10 px-6 md:grid-cols-2 md:gap-16 md:px-10">
          <div className="max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#108474]">
              {c.kicker}
            </p>
            <h1 className="text-[2.2rem] font-bold leading-[1.15] tracking-tight text-[#1d1d1f] md:text-[2.8rem]">
              {c.h1}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#766a62]">
              <span>
                {tx(l, "Av", "By", "Por", "Von", "Par")}{" "}
                <Link href={`/${l}/om-oss`} className="font-medium text-[#1d1d1f] hover:text-[#108474]">
                  Christopher Genberg
                </Link>
              </span>
              <span className="text-[#e6e6e6]" aria-hidden="true">|</span>
              <time dateTime={ARTICLE_PUBLISHED}>
                {tx(l, "Publicerad", "Published", "Publicado", "Veröffentlicht", "Publié")} {formatDate(ARTICLE_PUBLISHED, l)}
              </time>
              <span className="text-[#e6e6e6]" aria-hidden="true">|</span>
              <time dateTime={ARTICLE_MODIFIED} className="text-[#108474]">
                {tx(l, "Uppdaterad", "Updated", "Actualizado", "Aktualisiert", "Mis à jour")} {formatDate(ARTICLE_MODIFIED, l)}
              </time>
            </div>
            <p className="article-lead mt-5 text-base leading-relaxed text-[#515151] md:text-lg">
              {c.lead}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={localizePath(l, "products")}
                className="inline-flex h-[52px] items-center gap-2 rounded-full bg-[#108474] px-8 text-sm font-medium text-white transition-all duration-300 hover:bg-[#0d6e61] hover:shadow-lg"
              >
                {tx(l, "Se produkter", "View products", "Ver productos", "Produkte ansehen", "Voir les produits")}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={localizePath(l, "skinAnalysis")}
                className="inline-flex h-[52px] items-center gap-2 rounded-full border border-[#e6e6e6] bg-white/80 px-8 text-sm font-medium text-[#1d1d1f] backdrop-blur-sm transition-all duration-300 hover:border-[#108474] hover:shadow-md"
              >
                <Sparkles className="h-4 w-4 text-[#108474]" />
                {tx(l, "Gratis hudanalys", "Free skin analysis", "Análisis de piel gratis", "Kostenlose Hautanalyse", "Analyse de peau gratuite")}
              </Link>
            </div>
          </div>
          <div className="relative aspect-square overflow-hidden rounded-3xl shadow-2xl shadow-black/10">
            <Image
              src={images.hero}
              alt={c.h1}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </section>

      {/* ── Problem ── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-[#1d1d1f] md:text-3xl">
              {c.problemTitle}
            </h2>
            <div
              className="mt-6 space-y-4 text-base leading-relaxed text-[#515151]"
              dangerouslySetInnerHTML={{ __html: c.problemBody }}
            />
          </div>
        </div>
      </section>

      {/* ── Tips ── */}
      <section className="bg-[#f5f5f7] py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10">
          <h2 className="mb-12 text-center text-2xl font-bold tracking-tight text-[#1d1d1f] md:text-3xl">
            {c.tipsTitle}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {c.tips.map((tip, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white p-7 shadow-sm shadow-black/5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#108474]/10 text-sm font-bold text-[#108474]">
                  {i + 1}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-[#1d1d1f]">
                  {tip.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#515151]">
                  {tip.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Secondary Image Break ── */}
      {images.secondary && (
        <section className="overflow-hidden py-16 md:py-24">
          <div className="mx-auto grid max-w-[1280px] items-center gap-10 px-6 md:grid-cols-2 md:gap-16 md:px-10">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-xl shadow-black/8 md:aspect-[3/4]">
              <Image
                src={images.secondary}
                alt={c.solutionTitle}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="max-w-lg">
              <h2 className="text-2xl font-bold tracking-tight text-[#1d1d1f] md:text-3xl">
                {c.solutionTitle}
              </h2>
              <div
                className="mt-6 space-y-4 text-base leading-relaxed text-[#515151]"
                dangerouslySetInnerHTML={{ __html: c.solutionBody }}
              />
              <Link
                href={localizePath(l, "products")}
                className="mt-8 inline-flex h-[48px] items-center gap-2 rounded-full bg-[#108474] px-8 text-sm font-medium text-white transition-all duration-300 hover:bg-[#0d6e61] hover:shadow-lg"
              >
                {tx(l, "Se produkter", "View products", "Ver productos", "Produkte ansehen", "Voir les produits")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Solution (text only fallback if no secondary image) ── */}
      {!images.secondary && (
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-[1280px] px-6 md:px-10">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold tracking-tight text-[#1d1d1f] md:text-3xl">
                {c.solutionTitle}
              </h2>
              <div
                className="mt-6 space-y-4 text-base leading-relaxed text-[#515151]"
                dangerouslySetInnerHTML={{ __html: c.solutionBody }}
              />
            </div>
          </div>
        </section>
      )}

      {/* ── Products ── */}
      {products.length > 0 && (
        <section className="bg-[#f5f5f7] py-16 md:py-24">
          <div className="mx-auto max-w-[1280px] px-6 md:px-10">
            <h3 className="mb-8 text-center text-xl font-bold tracking-tight text-[#1d1d1f]">
              {tx(l, "Produkter vi rekommenderar", "Products we recommend", "Productos que recomendamos", "Produkte, die wir empfehlen", "Produits que nous recommandons")}
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map(
                (p) => p && <ProductCard key={p.id} product={p} />,
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      {c.faq.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-[1280px] px-6 md:px-10">
            <h2 className="mb-10 text-center text-2xl font-bold tracking-tight text-[#1d1d1f] md:text-3xl">
              {tx(l, "Vanliga frågor", "Frequently asked questions", "Preguntas frecuentes", "Häufig gestellte Fragen", "Questions fréquentes")}
            </h2>
            <div className="mx-auto max-w-3xl divide-y divide-[#e6e6e6]">
              {c.faq.map((item, i) => (
                <details key={i} className="group py-5">
                  <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-[#1d1d1f]">
                    {item.q}
                    <ChevronDown className="h-5 w-5 shrink-0 text-[#766a62] transition-transform duration-300 group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-[#515151]">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Sources / references ── */}
      {(() => {
        const sources = getSources(page.category);
        if (!sources.length) return null;
        return (
          <section className="py-12 md:py-16">
            <div className="mx-auto max-w-[1280px] px-6 md:px-10">
              <div className="mx-auto max-w-3xl rounded-2xl border border-[#e6e6e6] bg-[#f5f5f7] p-6 md:p-8">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-[#108474]">
                  {tx(l, "Källor", "Sources", "Fuentes", "Quellen", "Sources")}
                </h2>
                <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-[#515151] marker:text-[#766a62]">
                  {sources.map((s, i) => (
                    <li key={i}>
                      {s.href ? (
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline decoration-[#e6e6e6] underline-offset-2 hover:decoration-[#108474] hover:text-[#1d1d1f]"
                        >
                          {s.text}
                        </a>
                      ) : (
                        s.text
                      )}
                    </li>
                  ))}
                </ol>
                <p className="mt-4 text-xs text-[#766a62]">
                  {tx(
                    l,
                    "Artikeln granskad av Christopher Genberg, grundare av 1753 SKINCARE.",
                    "Article reviewed by Christopher Genberg, founder of 1753 SKINCARE.",
                    "Artículo revisado por Christopher Genberg, fundador de 1753 SKINCARE.",
                    "Artikel geprüft von Christopher Genberg, Gründer von 1753 SKINCARE.",
                    "Article relu par Christopher Genberg, fondateur de 1753 SKINCARE."
                  )}
                </p>
              </div>
            </div>
          </section>
        );
      })()}

      {/* ── Related articles ── */}
      {(() => {
        const related = getRelatedPages(page, l);
        if (!related.length) return null;
        return (
          <section className="border-t border-[#e6e6e6] bg-[#f5f5f7] py-16 md:py-24">
            <div className="mx-auto max-w-[1280px] px-6 md:px-10">
              <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-[#1d1d1f]">
                {tx(l, "Relaterade artiklar", "Related articles", "Artículos relacionados", "Verwandte Artikel", "Articles connexes")}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((rp) => {
                  const rc = getContent(rp, l);
                  const rSlug = getSlug(rp, l);
                  return (
                    <Link
                      key={rSlug}
                      href={`/${l}/guide/${rSlug}`}
                      className="group flex items-start gap-3 rounded-2xl border border-[#e6e6e6] bg-white p-5 transition-all duration-300 hover:border-[#108474]/30 hover:shadow-lg hover:shadow-[#108474]/5"
                    >
                      <div className="flex-1">
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#108474]">
                          {rc.kicker}
                        </p>
                        <h3 className="text-sm font-semibold leading-snug text-[#1d1d1f] group-hover:text-[#108474]">
                          {rc.h1}
                        </h3>
                        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[#515151]">
                          {rc.lead.slice(0, 100)}...
                        </p>
                      </div>
                      <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-[#766a62] transition-transform group-hover:translate-x-1 group-hover:text-[#108474]" />
                    </Link>
                  );
                })}
              </div>
              <div className="mt-8 text-center">
                <Link
                  href={`/${l}/guide`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#108474] transition-colors hover:text-[#0d6e62]"
                >
                  {tx(l, "Se alla artiklar", "View all articles", "Ver todos los artículos", "Alle Artikel ansehen", "Voir tous les articles")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        );
      })()}

      </article>

      {/* ── CTA ── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10">
          <div className="mx-auto max-w-2xl rounded-3xl bg-[#1d1d1f] px-8 py-14 text-center md:px-16">
            <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
              {c.ctaTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/70">
              {c.ctaSub}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href={localizePath(l, "products")}
                className="inline-flex h-[52px] items-center gap-2 rounded-full bg-[#108474] px-8 text-sm font-medium text-white transition-all duration-300 hover:bg-[#0d6e61]"
              >
                {tx(l, "Handla nu", "Shop now", "Comprar ahora", "Jetzt kaufen", "Acheter maintenant")}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={localizePath(l, "skinAnalysis")}
                className="inline-flex h-[52px] items-center gap-2 rounded-full border border-white/20 px-8 text-sm font-medium text-white transition-all duration-300 hover:border-white/40 hover:bg-white/5"
              >
                <Sparkles className="h-4 w-4" />
                {tx(l, "Gratis hudanalys – 15 metriker", "Free analysis – 15 metrics", "Análisis gratis – 15 métricas", "Kostenlose Analyse – 15 Metriken", "Analyse gratuite – 15 métriques")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
