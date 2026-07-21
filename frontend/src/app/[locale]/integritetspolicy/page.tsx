import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal-document";
import { getMessages } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/types";
import { localizePath } from "@/lib/i18n/navigation";

const BASE_URL = "https://www.1753skin.com";

// Använd localizePath så att canonical/hreflang alltid matchar de riktiga
// pretty-URL:erna (middleware) – tidigare hårdkodade sökvägar pekade fel
// (t.ex. /en/privacy-policy medan live-URL är /en/privacy).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  const m = getMessages(l);
  return {
    title: m.legalPrivacy.metaTitle,
    description: m.legalPrivacy.metaDescription,
    alternates: {
      canonical: `${BASE_URL}${localizePath(l, "privacy")}`,
      languages: {
        sv: `${BASE_URL}${localizePath("sv", "privacy")}`,
        en: `${BASE_URL}${localizePath("en", "privacy")}`,
        es: `${BASE_URL}${localizePath("es", "privacy")}`,
        de: `${BASE_URL}${localizePath("de", "privacy")}`,
        fr: `${BASE_URL}${localizePath("fr", "privacy")}`,
        "x-default": `${BASE_URL}${localizePath("sv", "privacy")}`,
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
