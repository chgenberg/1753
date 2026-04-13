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

export default function KontaktLayout({ children }: { children: React.ReactNode }) {
  return children;
}
