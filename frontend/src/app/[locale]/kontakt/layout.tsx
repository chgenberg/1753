import type { Metadata } from "next";
import { getMessages } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/types";

const BASE_URL = "https://www.1753skin.com";

const CONTACT_PATHS: Record<string, string> = {
  sv: "/sv/kontakt",
  en: "/en/contact",
  es: "/es/contacto",
  de: "/de/kontakt",
  fr: "/fr/contact",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = getMessages(locale as Locale).contactPage;
  const canonicalPath = CONTACT_PATHS[locale] ?? CONTACT_PATHS.en;
  return {
    title: m.metaTitle,
    description: m.metaDescription,
    openGraph: {
      title: m.ogTitle,
      description: m.ogDescription,
    },
    alternates: {
      canonical: `${BASE_URL}${canonicalPath}`,
      languages: {
        sv: `${BASE_URL}${CONTACT_PATHS.sv}`,
        en: `${BASE_URL}${CONTACT_PATHS.en}`,
        es: `${BASE_URL}${CONTACT_PATHS.es}`,
        de: `${BASE_URL}${CONTACT_PATHS.de}`,
        fr: `${BASE_URL}${CONTACT_PATHS.fr}`,
        "x-default": `${BASE_URL}${CONTACT_PATHS.en}`,
      },
    },
  };
}

function tx(locale: string, sv: string, en: string, es?: string, de?: string, fr?: string): string {
  if (locale === "sv") return sv;
  if (locale === "es") return es || en;
  if (locale === "de") return de || en;
  if (locale === "fr") return fr || en;
  return en;
}

export default async function KontaktLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: tx(locale, "Kontakt", "Contact", "Contacto", "Kontakt", "Contact"),
    url: `${BASE_URL}${CONTACT_PATHS[locale] || CONTACT_PATHS.en}`,
    mainEntity: {
      "@type": "Organization",
      "@id": "https://www.1753skin.com/#organization",
      name: "1753 SKINCARE",
      telephone: "+46732305521",
      email: "info@1753skin.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Sodra Skjutbanevagen 10",
        addressLocality: "Asa",
        postalCode: "439 55",
        addressCountry: "SE",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      {children}
    </>
  );
}
