import type { MetadataRoute } from "next";

const PRIVATE_PATHS = [
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
];

const LLM_FILES = [
  "/llms.txt",
  "/llms-full.txt",
  "/llms-products.txt",
  "/llms-methodology.txt",
  "/llms-science.txt",
  "/llms-guides.txt",
  "/about.md",
  "/methodology.md",
  "/products.md",
];

const ALLOW_LLM = ["/", ...LLM_FILES];

/**
 * Friendly AI crawlers: browse pages on demand for users and/or provide
 * real-time search answers. We explicitly allow these because being cited
 * by them is a growth channel.
 */
const FRIENDLY_AI_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "PerplexityBot",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "Google-Extended",
  "DuckAssistBot",
  "Applebot-Extended",
  "Amazonbot",
  "cohere-ai",
  "YouBot",
  "Meta-ExternalAgent",
  "Meta-ExternalFetcher",
];

/**
 * Training crawlers that bulk-scrape for model training. We allow them but
 * direct them towards the curated LLM files where our story is told most
 * accurately. Add to `disallow` here if you want to opt out later.
 */
const TRAINING_BOTS = [
  "CCBot",
  "Bytespider",
];

export default function robots(): MetadataRoute.Robots {
  const rules: MetadataRoute.Robots["rules"] = [
    {
      userAgent: "*",
      allow: "/",
      disallow: PRIVATE_PATHS,
    },
    ...FRIENDLY_AI_BOTS.map((userAgent) => ({
      userAgent,
      allow: ALLOW_LLM,
      disallow: PRIVATE_PATHS,
    })),
    ...TRAINING_BOTS.map((userAgent) => ({
      userAgent,
      allow: ALLOW_LLM,
      disallow: PRIVATE_PATHS,
    })),
  ];

  return {
    rules,
    sitemap: "https://www.1753skin.com/sitemap.xml",
  };
}
