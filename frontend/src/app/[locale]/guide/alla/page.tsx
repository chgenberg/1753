import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ArrowLeft } from "lucide-react";
import { locales, type Locale } from "@/lib/i18n/types";
import { ALL_LANDING_PAGES } from "@/lib/seo";
import { getContent, type LandingPage } from "@/lib/seo/types";
import AllGuidesSearch from "./search";

const BASE_URL = "https://www.1753skin.com";

function getSlug(page: LandingPage, locale: Locale): string {
  switch (locale) {
    case "es": return page.esSlug || page.enSlug;
    case "de": return page.deSlug || page.enSlug;
    case "fr": return page.frSlug || page.enSlug;
    case "en": return page.enSlug;
    default: return page.svSlug;
  }
}

const PATHS: Record<string, string> = {
  sv: "/sv/guide/alla",
  en: "/en/guide/alla",
  es: "/es/guide/alla",
  de: "/de/guide/alla",
  fr: "/fr/guide/alla",
};

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const canonicalPath = PATHS[locale] ?? PATHS.en;
  const ogLocale = ({ sv: "sv_SE", en: "en_US", es: "es_ES", de: "de_DE", fr: "fr_FR" } as Record<string, string>)[locale] || "en_US";
  const title = ({
    sv: `Alla guider (${ALL_LANDING_PAGES.length}) – A–Ö | 1753 SKINCARE`,
    en: `All guides (${ALL_LANDING_PAGES.length}) – A–Z | 1753 SKINCARE`,
    es: `Todas las guías (${ALL_LANDING_PAGES.length}) – A–Z | 1753 SKINCARE`,
    de: `Alle Guides (${ALL_LANDING_PAGES.length}) – A–Z | 1753 SKINCARE`,
    fr: `Tous les guides (${ALL_LANDING_PAGES.length}) – A–Z | 1753 SKINCARE`,
  } as Record<string, string>)[locale] || `All guides (${ALL_LANDING_PAGES.length}) – A–Z | 1753 SKINCARE`;
  const description = ({
    sv: `Sökbar lista över alla våra ${ALL_LANDING_PAGES.length} guider: CBD, CBG, hudtillstånd, ingredienser, livsstil och mer.`,
    en: `Searchable list of all ${ALL_LANDING_PAGES.length} guides: CBD, CBG, skin conditions, ingredients, lifestyle and more.`,
    es: `Lista buscable de todas nuestras ${ALL_LANDING_PAGES.length} guías: CBD, CBG, afecciones cutáneas, ingredientes, estilo de vida y más.`,
    de: `Durchsuchbare Liste aller ${ALL_LANDING_PAGES.length} Guides: CBD, CBG, Hautzustände, Inhaltsstoffe, Lifestyle und mehr.`,
    fr: `Liste consultable de nos ${ALL_LANDING_PAGES.length} guides : CBD, CBG, affections cutanées, ingrédients, mode de vie et plus.`,
  } as Record<string, string>)[locale] || `Searchable list of all ${ALL_LANDING_PAGES.length} guides.`;
  return {
    title,
    description,
    openGraph: { title, description, locale: ogLocale, type: "website", images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "1753 SKINCARE" }] },
    alternates: {
      canonical: `${BASE_URL}${canonicalPath}`,
      languages: {
        sv: `${BASE_URL}${PATHS.sv}`,
        en: `${BASE_URL}${PATHS.en}`,
        es: `${BASE_URL}${PATHS.es}`,
        de: `${BASE_URL}${PATHS.de}`,
        fr: `${BASE_URL}${PATHS.fr}`,
        "x-default": `${BASE_URL}${PATHS.sv}`,
      },
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function AllGuidesPage({ params }: Props) {
  const { locale } = await params;
  const l = locale as Locale;

  const tx = (sv: string, en: string, es?: string, de?: string, fr?: string) => {
    if (l === "sv") return sv;
    if (l === "es") return es || en;
    if (l === "de") return de || en;
    if (l === "fr") return fr || en;
    return en;
  };

  const items = ALL_LANDING_PAGES.map((page) => {
    const c = getContent(page, l);
    const slug = getSlug(page, l);
    return {
      slug,
      title: c.h1,
      lead: c.lead.slice(0, 140),
      category: page.category,
      href: `/${l}/guide/${slug}`,
    };
  }).sort((a, b) => a.title.localeCompare(b.title, l));

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: tx("Alla guider", "All guides", "Todas las guías", "Alle Guides", "Tous les guides"),
    description: tx(
      "Sökbar A-till-Ö-lista över alla våra guider.",
      "Searchable A-to-Z list of all our guides.",
      "Lista buscable de la A a la Z de todas nuestras guías.",
      "Durchsuchbare A-bis-Z-Liste aller Guides.",
      "Liste de A à Z de tous nos guides.",
    ),
    url: `${BASE_URL}/${l}/guide/alla`,
    publisher: { "@id": "https://www.1753skin.com/#organization" },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${BASE_URL}${it.href}`,
        name: it.title,
      })),
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: tx("Hem", "Home", "Inicio", "Startseite", "Accueil"), item: `${BASE_URL}/${l}` },
      { "@type": "ListItem", position: 2, name: tx("Guide", "Guide", "Guía", "Ratgeber", "Guide"), item: `${BASE_URL}/${l}/guide` },
      { "@type": "ListItem", position: 3, name: tx("Alla guider", "All guides", "Todas las guías", "Alle Guides", "Tous les guides"), item: `${BASE_URL}/${l}/guide/alla` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="bg-[#f5f5f7] py-16 md:py-20">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10">
          <Link
            href={`/${l}/guide`}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#108474] transition-colors hover:text-[#0d6e62]"
          >
            <ArrowLeft className="h-4 w-4" />
            {tx("Tillbaka till hubben", "Back to hub", "Volver al hub", "Zurück zum Hub", "Retour au hub")}
          </Link>

          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#108474]">
              {tx("A-Ö", "A-Z", "A-Z", "A-Z", "A-Z")}
            </p>
            <h1 className="text-[2.2rem] font-bold leading-[1.1] tracking-tight text-[#1d1d1f] md:text-[2.8rem]">
              {tx("Alla guider", "All guides", "Todas las guías", "Alle Guides", "Tous les guides")}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-[#515151] md:text-lg">
              {tx(
                `Sök bland alla ${items.length} guider. Skriv ett sökord – filtrering sker direkt.`,
                `Search across all ${items.length} guides. Type a keyword – filtering happens instantly.`,
                `Busca entre todas las ${items.length} guías. Escribe una palabra clave – el filtrado es instantáneo.`,
                `Durchsuche alle ${items.length} Guides. Tippe ein Stichwort – die Filterung erfolgt sofort.`,
                `Recherche parmi les ${items.length} guides. Tape un mot-clé – le filtrage est instantané.`,
              )}
            </p>
            <div className="mt-5 flex items-center justify-center gap-4 text-sm text-[#766a62]">
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                {items.length} {tx("artiklar", "articles", "artículos", "Artikel", "articles")}
              </span>
            </div>
          </div>
        </div>
      </section>

      <AllGuidesSearch
        items={items}
        labels={{
          placeholder: tx(
            "Sök på titel eller kategori...",
            "Search by title or category...",
            "Buscar por título o categoría...",
            "Nach Titel oder Kategorie suchen...",
            "Rechercher par titre ou catégorie...",
          ),
          empty: tx(
            "Inga guider matchade sökningen.",
            "No guides matched your search.",
            "Ninguna guía coincide con tu búsqueda.",
            "Keine Guides gefunden.",
            "Aucun guide ne correspond à votre recherche.",
          ),
          countSuffix: tx("guider", "guides", "guías", "Guides", "guides"),
        }}
      />
    </>
  );
}
