import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal-document";
import { getMessages } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/types";
import { localizePath } from "@/lib/i18n/navigation";

const BASE_URL = "https://www.1753skin.com";

// Använd localizePath så att canonical/hreflang matchar de riktiga pretty-URL:erna
// (tidigare pekade fr-canonical på /fr/conditions medan live-URL är /fr/cgv).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  const m = getMessages(l);
  return {
    title: m.legalTerms.metaTitle,
    description: m.legalTerms.metaDescription,
    alternates: {
      canonical: `${BASE_URL}${localizePath(l, "terms")}`,
      languages: {
        sv: `${BASE_URL}${localizePath("sv", "terms")}`,
        en: `${BASE_URL}${localizePath("en", "terms")}`,
        es: `${BASE_URL}${localizePath("es", "terms")}`,
        de: `${BASE_URL}${localizePath("de", "terms")}`,
        fr: `${BASE_URL}${localizePath("fr", "terms")}`,
        "x-default": `${BASE_URL}${localizePath("sv", "terms")}`,
      },
    },
  };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const m = getMessages(l);
  const privacyPath = localizePath(l, "privacy");
  return <LegalDocument doc={m.legalTerms} privacyPath={privacyPath} />;
}
