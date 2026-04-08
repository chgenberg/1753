import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/sv/mitt-konto",
        "/en/my-account",
        "/sv/kassa",
        "/en/checkout",
        "/sv/betalning/",
        "/en/payment/",
        "/sv/logga-in",
        "/sv/registrera",
        "/en/login",
        "/en/register",
        "/sv/skriv-omdome",
        "/en/write-review",
      ],
    },
    sitemap: "https://www.1753skin.com/sitemap.xml",
  };
}
