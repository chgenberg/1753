import type { Metadata } from "next";
import { Suspense } from "react";
import ReviewForm from "./review-form";
import { getMessages } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/types";

const BASE_URL = "https://www.1753skin.com";

const REVIEW_PATHS: Record<string, string> = {
  sv: "/sv/skriv-omdome",
  en: "/en/write-review",
  es: "/es/escribir-resena",
  de: "/de/bewertung-schreiben",
  fr: "/fr/ecrire-avis",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = getMessages(locale as Locale).reviewFormPage;
  const canonicalPath = REVIEW_PATHS[locale] ?? REVIEW_PATHS.en;
  return {
    title: m.metaTitle,
    description: m.metaDescription,
    robots: { index: false, follow: false },
    alternates: {
      canonical: `${BASE_URL}${canonicalPath}`,
      languages: {
        sv: `${BASE_URL}${REVIEW_PATHS.sv}`,
        en: `${BASE_URL}${REVIEW_PATHS.en}`,
        es: `${BASE_URL}${REVIEW_PATHS.es}`,
        de: `${BASE_URL}${REVIEW_PATHS.de}`,
        fr: `${BASE_URL}${REVIEW_PATHS.fr}`,
        "x-default": `${BASE_URL}${REVIEW_PATHS.sv}`,
      },
    },
  };
}

export default function SkrivOmdomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-900" />
        </div>
      }
    >
      <ReviewForm />
    </Suspense>
  );
}
