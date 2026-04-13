import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal-document";
import { getMessages } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/types";
import { localizePath } from "@/lib/i18n/navigation";

const BASE_URL = "https://www.1753skin.com";

const PRIVACY_PATHS: Record<string, string> = {
  sv: "/sv/integritetspolicy",
  en: "/en/privacy-policy",
  es: "/es/politica-de-privacidad",
  de: "/de/datenschutz",
  fr: "/fr/politique-de-confidentialite",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = getMessages(locale as Locale);
  const canonicalPath = PRIVACY_PATHS[locale] ?? PRIVACY_PATHS.en;
  return {
    title: m.legalPrivacy.metaTitle,
    description: m.legalPrivacy.metaDescription,
    alternates: {
      canonical: `${BASE_URL}${canonicalPath}`,
      languages: {
        sv: `${BASE_URL}${PRIVACY_PATHS.sv}`,
        en: `${BASE_URL}${PRIVACY_PATHS.en}`,
        es: `${BASE_URL}${PRIVACY_PATHS.es}`,
        de: `${BASE_URL}${PRIVACY_PATHS.de}`,
        fr: `${BASE_URL}${PRIVACY_PATHS.fr}`,
        "x-default": `${BASE_URL}${PRIVACY_PATHS.en}`,
      },
    },
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const m = getMessages(l);
  const privacyPath = localizePath(l, "privacy");
  return <LegalDocument doc={m.legalPrivacy} privacyPath={privacyPath} />;
}
