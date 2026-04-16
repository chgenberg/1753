import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal-document";
import { getMessages } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/types";
import { localizePath } from "@/lib/i18n/navigation";

const BASE_URL = "https://www.1753skin.com";

const TERMS_PATHS: Record<string, string> = {
  sv: "/sv/villkor",
  en: "/en/terms",
  es: "/es/terminos",
  de: "/de/agb",
  fr: "/fr/conditions",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = getMessages(locale as Locale);
  const canonicalPath = TERMS_PATHS[locale] ?? TERMS_PATHS.en;
  return {
    title: m.legalTerms.metaTitle,
    description: m.legalTerms.metaDescription,
    alternates: {
      canonical: `${BASE_URL}${canonicalPath}`,
      languages: {
        sv: `${BASE_URL}${TERMS_PATHS.sv}`,
        en: `${BASE_URL}${TERMS_PATHS.en}`,
        es: `${BASE_URL}${TERMS_PATHS.es}`,
        de: `${BASE_URL}${TERMS_PATHS.de}`,
        fr: `${BASE_URL}${TERMS_PATHS.fr}`,
        "x-default": `${BASE_URL}${TERMS_PATHS.sv}`,
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
