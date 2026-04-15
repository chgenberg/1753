import { NextRequest } from "next/server";
import { ALL_LANDING_PAGES } from "@/lib/seo";
import { getContent, getSlug } from "@/lib/seo/types";
import type { Locale } from "@/lib/i18n/types";
import { locales } from "@/lib/i18n/types";

const BASE = "https://www.1753skin.com";

const FEED_TITLE: Record<string, string> = {
  sv: "1753 SKINCARE – Hudvårdsguide",
  en: "1753 SKINCARE – Skincare Guide",
  es: "1753 SKINCARE – Guía de Cuidado de la Piel",
  de: "1753 SKINCARE – Hautpflege-Ratgeber",
  fr: "1753 SKINCARE – Guide de Soins",
};

const FEED_DESC: Record<string, string> = {
  sv: "Vetenskapsbaserade artiklar om CBD-hudvård, CBG, hudtillstånd och holistiskt välmående från 1753 SKINCARE.",
  en: "Science-based articles on CBD skincare, CBG, skin conditions and holistic wellness from 1753 SKINCARE.",
  es: "Artículos basados en ciencia sobre cuidado de la piel con CBD, CBG, afecciones cutáneas y bienestar holístico de 1753 SKINCARE.",
  de: "Wissenschaftsbasierte Artikel über CBD-Hautpflege, CBG, Hautzustände und ganzheitliches Wohlbefinden von 1753 SKINCARE.",
  fr: "Articles scientifiques sur les soins CBD, CBG, les affections cutanées et le bien-être holistique de 1753 SKINCARE.",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = (locales.includes(rawLocale as Locale) ? rawLocale : "en") as Locale;
  const now = new Date().toUTCString();

  const items = ALL_LANDING_PAGES
    .filter((page) => {
      const slug = getSlug(page, locale);
      return !!slug;
    })
    .map((page) => {
      const c = getContent(page, locale);
      const slug = getSlug(page, locale);
      const url = `${BASE}/${locale}/guide/${slug}`;
      return `    <item>
      <title><![CDATA[${c.h1}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description><![CDATA[${c.metaDescription}]]></description>
      <pubDate>${now}</pubDate>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${FEED_TITLE[locale] || FEED_TITLE.en}</title>
    <link>${BASE}/${locale}/guide</link>
    <description>${FEED_DESC[locale] || FEED_DESC.en}</description>
    <language>${locale}</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${BASE}/${locale}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
