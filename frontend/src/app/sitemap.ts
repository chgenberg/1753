import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/products";
import { localizePath, type AppRoute } from "@/lib/i18n/navigation";
import { locales } from "@/lib/i18n/types";
import type { Locale } from "@/lib/i18n/types";
import { ALL_LANDING_PAGES } from "@/lib/seo";

const BASE = "https://www.1753skin.com";

const SITE_PUBLISHED = new Date("2026-03-24");
const CONTENT_UPDATED = new Date("2026-04-16");
const GUIDES_UPDATED = new Date("2026-04-16");
const PRODUCTS_UPDATED = new Date("2026-04-16");

const PUBLIC_ROUTES: AppRoute[] = [
  "home",
  "products",
  "about",
  "contact",
  "skinAnalysis",
  "terms",
  "privacy",
  "loyalty",
];

const ANALYSIS_SLUGS: Record<string, string> = {
  sv: "gratis-hudanalys",
  en: "free-skin-analysis",
  es: "analisis-piel-gratis",
  de: "kostenlose-hautanalyse",
  fr: "analyse-de-peau-gratuite",
};

function hreflang(pathsByLocale: Record<string, string>) {
  const languages: Record<string, string> = {};
  for (const [l, p] of Object.entries(pathsByLocale)) {
    languages[l] = `${BASE}${p}`;
  }
  languages["x-default"] = languages.sv || languages.en;
  return { languages };
}

/**
 * Sitemap segments:
 *   0 = core pages (public routes + analysis + guide hub + gallery) — all locales
 *   1 = products — all locales
 *   2 = guide articles — sv
 *   3 = guide articles — en
 *   4 = guide articles — es
 *   5 = guide articles — de
 *   6 = guide articles — fr
 */
const GUIDE_LOCALE_IDS: Record<number, Locale> = { 2: "sv", 3: "en", 4: "es", 5: "de", 6: "fr" };

export async function generateSitemaps() {
  return [
    { id: 0 },
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
  ];
}

const HERO_IMAGES = [
  `${BASE}/1753desktop.webp`,
  `${BASE}/1753mobile.webp`,
  `${BASE}/1753.webp`,
];

function buildCoreEntries(): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of PUBLIC_ROUTES) {
      const path = localizePath(locale as Locale, route);
      const pathsByLocale: Record<string, string> = {};
      for (const l of locales) pathsByLocale[l] = localizePath(l as Locale, route);

      const entry: MetadataRoute.Sitemap[number] = {
        url: `${BASE}${path}`,
        lastModified: CONTENT_UPDATED,
        changeFrequency: route === "home" || route === "products" ? "weekly" : "monthly",
        priority: route === "home" ? 1 : route === "products" ? 0.9 : 0.7,
        alternates: hreflang(pathsByLocale),
      };

      if (route === "home") {
        entry.images = HERO_IMAGES;
      } else if (route === "products") {
        entry.images = PRODUCTS.map((p) => `${BASE}${p.image}`);
      }

      out.push(entry);
    }

    const analysisAlternates: Record<string, string> = {};
    for (const l of locales) analysisAlternates[l] = `/${l}/${ANALYSIS_SLUGS[l] || ANALYSIS_SLUGS.en}`;
    out.push({
      url: `${BASE}/${locale}/${ANALYSIS_SLUGS[locale] || ANALYSIS_SLUGS.en}`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: hreflang(analysisAlternates),
      images: [
        `${BASE}/Landing_page_skinanalys/1.webp`,
        `${BASE}/Landing_page_skinanalys/2.webp`,
        `${BASE}/1753.webp`,
      ],
    });

    const guideAlternates: Record<string, string> = {};
    for (const l of locales) guideAlternates[l] = `/${l}/guide`;
    out.push({
      url: `${BASE}/${locale}/guide`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: hreflang(guideAlternates),
    });

    const galleryAlternates: Record<string, string> = {};
    for (const l of locales) galleryAlternates[l] = `/${l}/galleri`;
    out.push({
      url: `${BASE}/${locale}/galleri`,
      lastModified: SITE_PUBLISHED,
      changeFrequency: "monthly",
      priority: 0.5,
      alternates: hreflang(galleryAlternates),
    });

    const knowledgeAlternates: Record<string, string> = {};
    for (const l of locales) knowledgeAlternates[l] = `/${l}/kunskapsbank`;
    out.push({
      url: `${BASE}/${locale}/kunskapsbank`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: hreflang(knowledgeAlternates),
    });
  }

  return out;
}

function buildProductEntries(): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const p of PRODUCTS) {
      const pathsByLocale: Record<string, string> = {};
      for (const l of locales) pathsByLocale[l] = localizePath(l as Locale, "product", { productId: p.id });
      out.push({
        url: `${BASE}${localizePath(locale as Locale, "product", { productId: p.id })}`,
        lastModified: PRODUCTS_UPDATED,
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: hreflang(pathsByLocale),
        images: [`${BASE}${p.image}`],
      });
    }
  }

  return out;
}

function buildGuideEntries(locale: Locale): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = [];

  for (const page of ALL_LANDING_PAGES) {
    const slugs: Record<string, string> = { sv: page.svSlug, en: page.enSlug };
    if (page.esSlug) slugs.es = page.esSlug;
    if (page.deSlug) slugs.de = page.deSlug;
    if (page.frSlug) slugs.fr = page.frSlug;

    const slug = slugs[locale];
    if (!slug) continue;

    const alternatesByLocale: Record<string, string> = {};
    for (const [l, s] of Object.entries(slugs)) alternatesByLocale[l] = `/${l}/guide/${s}`;

    out.push({
      url: `${BASE}/${locale}/guide/${slug}`,
      lastModified: GUIDES_UPDATED,
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: hreflang(alternatesByLocale),
    });
  }

  return out;
}

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  if (id === 0) return buildCoreEntries();
  if (id === 1) return buildProductEntries();

  const guideLocale = GUIDE_LOCALE_IDS[id];
  if (guideLocale) return buildGuideEntries(guideLocale);

  return [];
}
