import { ALL_LANDING_PAGES } from "@/lib/seo";

const BASE = "https://www.1753skin.com";
const FEED_TITLE = "1753 SKINCARE – Guides";
const FEED_URL = `${BASE}/guide/atom.xml`;
const FEED_LINK = `${BASE}/sv/guide/alla`;
const FEED_ID = `${BASE}/guide/`;
const AUTHOR_NAME = "Christopher Genberg";
const AUTHOR_EMAIL = "info@1753skin.com";

/**
 * Atom 1.0 feed for the same guide library as /guide/rss.xml. Some
 * crawlers and feed readers prefer Atom because of its stricter schema
 * (dates in ISO 8601, explicit author blocks, id URIs). Keeping both
 * feeds means we don't force clients to negotiate.
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
  const updated = new Date().toISOString();

  const entries = ALL_LANDING_PAGES.map((p) => {
    const c = p.sv;
    const url = `${BASE}/sv/guide/${p.svSlug}`;
    const title = xmlEscape(c.metaTitle || c.h1);
    const summary = xmlEscape(c.metaDescription || c.lead.slice(0, 280));
    return `  <entry>
    <title>${title}</title>
    <link rel="alternate" type="text/html" href="${url}" />
    <id>${url}</id>
    <updated>${updated}</updated>
    <summary>${summary}</summary>
    <category term="${xmlEscape(p.category)}" />
  </entry>`;
  }).join("\n");

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="sv">
  <title>${xmlEscape(FEED_TITLE)}</title>
  <link rel="self" type="application/atom+xml" href="${FEED_URL}" />
  <link rel="alternate" type="text/html" href="${FEED_LINK}" />
  <id>${FEED_ID}</id>
  <updated>${updated}</updated>
  <author>
    <name>${xmlEscape(AUTHOR_NAME)}</name>
    <email>${xmlEscape(AUTHOR_EMAIL)}</email>
    <uri>${BASE}</uri>
  </author>
  <generator uri="${BASE}" version="1.0">1753 SKINCARE guide feed</generator>
${entries}
</feed>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
