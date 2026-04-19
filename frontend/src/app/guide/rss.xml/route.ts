import { ALL_LANDING_PAGES } from "@/lib/seo";

const BASE = "https://www.1753skin.com";
const FEED_TITLE = "1753 SKINCARE – Guides";
const FEED_DESC =
  "Peer-reviewed, holistic skincare guides on CBD, CBG, the endocannabinoid system, the skin microbiome and lifestyle factors. Updated continuously.";
const FEED_URL = `${BASE}/guide/rss.xml`;
const FEED_LINK = `${BASE}/sv/guide/alla`;

/**
 * RSS 2.0 feed of every guide landing page, emitting the Swedish version as
 * the canonical item and using the latest data-file mtime as `pubDate`.
 * Purpose: help search engines, feed readers and LLM crawlers discover new
 * guides and detect updates without having to crawl the whole sitemap.
 */
export const dynamic = "force-static";
export const revalidate = 3600;

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const buildDate = new Date().toUTCString();

  const items = ALL_LANDING_PAGES.map((p) => {
    const c = p.sv;
    const url = `${BASE}/sv/guide/${p.svSlug}`;
    const title = xmlEscape(c.metaTitle || c.h1);
    const desc = xmlEscape(c.metaDescription || c.lead.slice(0, 280));
    return `    <item>
      <title>${title}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${desc}</description>
      <category>${xmlEscape(p.category)}</category>
      <pubDate>${buildDate}</pubDate>
    </item>`;
  }).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlEscape(FEED_TITLE)}</title>
    <link>${FEED_LINK}</link>
    <atom:link href="${FEED_URL}" rel="self" type="application/rss+xml" />
    <description>${xmlEscape(FEED_DESC)}</description>
    <language>sv-SE</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
