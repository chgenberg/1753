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
import { getPageBySlug, getContent } from "@/lib/seo/types";
import { getMessages } from "@/lib/i18n";

const HERO_IMAGE = "/New_Products/DUO+TA-DAWoman.jpg";
const BASE_URL = "https://www.1753skin.com";

interface Props {
  params: Promise<{ locale: Locale; slug: string }>;
}

export async function generateStaticParams() {
  const out: { locale: string; slug: string }[] = [];
  for (const page of ALL_LANDING_PAGES) {
    out.push({ locale: "sv", slug: page.svSlug });
    out.push({ locale: "en", slug: page.enSlug });
  }
  return out;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = getPageBySlug(ALL_LANDING_PAGES, slug, locale as Locale);
  if (!page) return {};
  const c = getContent(page, locale as Locale);
  const svPath = `/sv/guide/${page.svSlug}`;
  const enPath = `/en/guide/${page.enSlug}`;
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: {
      canonical: `${BASE_URL}/${locale}/guide/${slug}`,
      languages: { sv: `${BASE_URL}${svPath}`, en: `${BASE_URL}${enPath}` },
    },
    openGraph: {
      title: c.metaTitle,
      description: c.metaDescription,
      url: `${BASE_URL}/${locale}/guide/${slug}`,
      images: [{ url: `${BASE_URL}${HERO_IMAGE}`, width: 1600, height: 1073 }],
      locale: locale === "sv" ? "sv_SE" : "en_GB",
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
        name: l === "sv" ? "Hem" : "Home",
        item: `${BASE_URL}/${l}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: l === "sv" ? "Guide" : "Guide",
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
            <p className="mt-5 text-base leading-relaxed text-[#515151] md:text-lg">
              {c.lead}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={localizePath(l, "products")}
                className="inline-flex h-[52px] items-center gap-2 rounded-full bg-[#108474] px-8 text-sm font-medium text-white transition-all duration-300 hover:bg-[#0d6e61] hover:shadow-lg"
              >
                {l === "sv" ? "Se produkter" : "View products"}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={localizePath(l, "skinAnalysis")}
                className="inline-flex h-[52px] items-center gap-2 rounded-full border border-[#e6e6e6] bg-white/80 px-8 text-sm font-medium text-[#1d1d1f] backdrop-blur-sm transition-all duration-300 hover:border-[#108474] hover:shadow-md"
              >
                <Sparkles className="h-4 w-4 text-[#108474]" />
                {l === "sv" ? "Gratis hudanalys" : "Free skin analysis"}
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl shadow-black/10">
            <Image
              src={HERO_IMAGE}
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

      {/* ── Solution + Products ── */}
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

          {products.length > 0 && (
            <div className="mt-14">
              <h3 className="mb-8 text-center text-xl font-bold tracking-tight text-[#1d1d1f]">
                {l === "sv"
                  ? "Produkter vi rekommenderar"
                  : "Products we recommend"}
              </h3>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map(
                  (p) => p && <ProductCard key={p.id} product={p} />,
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── FAQ ── */}
      {c.faq.length > 0 && (
        <section className="bg-[#f5f5f7] py-16 md:py-24">
          <div className="mx-auto max-w-[1280px] px-6 md:px-10">
            <h2 className="mb-10 text-center text-2xl font-bold tracking-tight text-[#1d1d1f] md:text-3xl">
              {l === "sv" ? "Vanliga frågor" : "Frequently asked questions"}
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
                {l === "sv" ? "Handla nu" : "Shop now"}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={localizePath(l, "skinAnalysis")}
                className="inline-flex h-[52px] items-center gap-2 rounded-full border border-white/20 px-8 text-sm font-medium text-white transition-all duration-300 hover:border-white/40 hover:bg-white/5"
              >
                <Sparkles className="h-4 w-4" />
                {l === "sv" ? "Testa hudanalys" : "Try skin analysis"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
