import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin/",
        // SV
        "/sv/mitt-konto",
        "/sv/kassa",
        "/sv/betalning/",
        "/sv/logga-in",
        "/sv/registrera",
        "/sv/skriv-omdome",
        // EN
        "/en/my-account",
        "/en/checkout",
        "/en/payment/",
        "/en/login",
        "/en/register",
        "/en/write-review",
        // ES
        "/es/mi-cuenta",
        "/es/pagar",
        "/es/pago/",
        "/es/iniciar-sesion",
        "/es/registro",
        "/es/escribir-resena",
        // DE
        "/de/mein-konto",
        "/de/kasse",
        "/de/zahlung/",
        "/de/anmelden",
        "/de/registrieren",
        "/de/bewertung-schreiben",
        // FR
        "/fr/mon-compte",
        "/fr/paiement",
        "/fr/connexion",
        "/fr/inscription",
        "/fr/ecrire-avis",
      ],
    },
    sitemap: "https://www.1753skin.com/sitemap.xml",
  };
}
