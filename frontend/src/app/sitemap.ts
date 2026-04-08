import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/products";
import { localizePath, type AppRoute } from "@/lib/i18n/navigation";
import { locales } from "@/lib/i18n/types";

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

  return out;
}
