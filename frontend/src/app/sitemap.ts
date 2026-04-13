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

export default function sitemap(): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = [];
  const now = new Date();

  for (const locale of locales) {
    for (const route of PUBLIC_ROUTES) {
      const path = localizePath(locale, route);
      out.push({
        url: `${BASE}${path}`,
        lastModified: now,
        changeFrequency: route === "home" || route === "products" ? "weekly" : "monthly",
        priority: route === "home" ? 1 : route === "products" ? 0.9 : 0.7,
      });
    }

    for (const p of PRODUCTS) {
      out.push({
        url: `${BASE}${localizePath(locale, "product", { productId: p.id })}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  const analysisSlugs: Record<string, string> = {
    sv: "gratis-hudanalys",
    en: "free-skin-analysis",
    es: "analisis-piel-gratis",
    de: "kostenlose-hautanalyse",
    fr: "analyse-de-peau-gratuite",
  };
  for (const locale of locales) {
    out.push({
      url: `${BASE}/${locale}/${analysisSlugs[locale] || analysisSlugs.en}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    });
    out.push({
      url: `${BASE}/${locale}/guide`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  for (const page of ALL_LANDING_PAGES) {
    out.push({
      url: `${BASE}/sv/guide/${page.svSlug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
    out.push({
      url: `${BASE}/en/guide/${page.enSlug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
    if (page.esSlug) {
      out.push({
        url: `${BASE}/es/guide/${page.esSlug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
    if (page.deSlug) {
      out.push({
        url: `${BASE}/de/guide/${page.deSlug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
    if (page.frSlug) {
      out.push({
        url: `${BASE}/fr/guide/${page.frSlug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return out;
}
