import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/products";
import { localizePath, type AppRoute } from "@/lib/i18n/navigation";
import { locales } from "@/lib/i18n/types";
import { ALL_LANDING_PAGES } from "@/lib/seo";

const BASE = "https://www.1753skin.com";

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

function hreflang(pathsByLocale: Record<string, string>) {
  const languages: Record<string, string> = {};
  for (const [l, p] of Object.entries(pathsByLocale)) {
    languages[l] = `${BASE}${p}`;
  }
  languages["x-default"] = languages.en || languages.sv;
  return { languages };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = [];
  const now = new Date();

  // Public routes (per locale, grouped with hreflang)
  for (const locale of locales) {
    for (const route of PUBLIC_ROUTES) {
      const path = localizePath(locale, route);
      const pathsByLocale: Record<string, string> = {};
      for (const l of locales) pathsByLocale[l] = localizePath(l, route);
      out.push({
        url: `${BASE}${path}`,
        lastModified: now,
        changeFrequency: route === "home" || route === "products" ? "weekly" : "monthly",
        priority: route === "home" ? 1 : route === "products" ? 0.9 : 0.7,
        alternates: hreflang(pathsByLocale),
      });
    }

    // Products
    for (const p of PRODUCTS) {
      const pathsByLocale: Record<string, string> = {};
      for (const l of locales) pathsByLocale[l] = localizePath(l, "product", { productId: p.id });
      out.push({
        url: `${BASE}${localizePath(locale, "product", { productId: p.id })}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: hreflang(pathsByLocale),
      });
    }
  }

  // Analysis landing + guide hub (per locale with hreflang)
  const analysisSlugs: Record<string, string> = {
    sv: "gratis-hudanalys",
    en: "free-skin-analysis",
    es: "analisis-piel-gratis",
    de: "kostenlose-hautanalyse",
    fr: "analyse-de-peau-gratuite",
  };
  const analysisAlternates: Record<string, string> = {};
  for (const l of locales) analysisAlternates[l] = `/${l}/${analysisSlugs[l] || analysisSlugs.en}`;
  const guideAlternates: Record<string, string> = {};
  for (const l of locales) guideAlternates[l] = `/${l}/guide`;

  for (const locale of locales) {
    out.push({
      url: `${BASE}/${locale}/${analysisSlugs[locale] || analysisSlugs.en}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: hreflang(analysisAlternates),
    });
    out.push({
      url: `${BASE}/${locale}/guide`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: hreflang(guideAlternates),
    });
  }

  // Gallery (per locale with hreflang)
  const galleryAlternates: Record<string, string> = {};
  for (const l of locales) galleryAlternates[l] = `/${l}/galleri`;
  for (const locale of locales) {
    out.push({
      url: `${BASE}/${locale}/galleri`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
      alternates: hreflang(galleryAlternates),
    });
  }

  // Landing pages / guide articles
  for (const page of ALL_LANDING_PAGES) {
    const slugs: Record<string, string> = { sv: page.svSlug, en: page.enSlug };
    if (page.esSlug) slugs.es = page.esSlug;
    if (page.deSlug) slugs.de = page.deSlug;
    if (page.frSlug) slugs.fr = page.frSlug;

    const alternatesByLocale: Record<string, string> = {};
    for (const [l, s] of Object.entries(slugs)) alternatesByLocale[l] = `/${l}/guide/${s}`;

    for (const [l, s] of Object.entries(slugs)) {
      out.push({
        url: `${BASE}/${l}/guide/${s}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: hreflang(alternatesByLocale),
      });
    }
  }

  return out;
}
