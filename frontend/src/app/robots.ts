import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/mitt-konto/", "/kassa/", "/betalning/"],
    },
    sitemap: "https://1753skincare.com/sitemap.xml",
  };
}
