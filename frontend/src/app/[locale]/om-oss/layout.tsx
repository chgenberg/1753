import type { Metadata } from "next";
import { getMessages } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/types";

const BASE_URL = "https://www.1753skin.com";

const ABOUT_PATHS: Record<string, string> = {
  sv: "/sv/om-oss",
  en: "/en/about",
  es: "/es/sobre-nosotros",
  de: "/de/ueber-uns",
  fr: "/fr/a-propos",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = getMessages(locale as Locale).aboutPage;
  const canonicalPath = ABOUT_PATHS[locale] ?? ABOUT_PATHS.en;
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
        sv: `${BASE_URL}${ABOUT_PATHS.sv}`,
        en: `${BASE_URL}${ABOUT_PATHS.en}`,
        es: `${BASE_URL}${ABOUT_PATHS.es}`,
        de: `${BASE_URL}${ABOUT_PATHS.de}`,
        fr: `${BASE_URL}${ABOUT_PATHS.fr}`,
        "x-default": `${BASE_URL}${ABOUT_PATHS.sv}`,
      },
    },
  };
}

export default function OmOssLayout({ children }: { children: React.ReactNode }) {
  return children;
}
