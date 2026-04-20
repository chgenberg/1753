import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  trailingSlash: false,
  turbopack: {},
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
    ],
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
  /**
   * 301-redirect known external typos for the skin analysis landing page that
   * Google Search Console surfaced as 404. These slugs are NOT used by our
   * navigation, middleware rewrites, or sitemaps – only by external links /
   * auto-translated inbound URLs. Cross-locale guide-slug typos (e.g.
   * /en/guide/cbd-hautpflege-prague) are handled dynamically inside
   * /[locale]/guide/[slug]/page.tsx via findPageByAnyLocaleSlug.
   */
  async redirects() {
    return [
      { source: "/es/analisis-de-piel", destination: "/es/analisis-piel", permanent: true },
      { source: "/es/analisis-de-la-piel", destination: "/es/analisis-piel", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
