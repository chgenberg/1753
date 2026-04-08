import type { Locale } from "@/lib/i18n/types";

export interface LandingPageContent {
  metaTitle: string;
  metaDescription: string;
  kicker: string;
  h1: string;
  lead: string;
  problemTitle: string;
  problemBody: string;
  tipsTitle: string;
  tips: { title: string; body: string }[];
  solutionTitle: string;
  solutionBody: string;
  faq: { q: string; a: string }[];
  ctaTitle: string;
  ctaSub: string;
}

export interface LandingPage {
  svSlug: string;
  enSlug: string;
  category: string;
  productIds: string[];
  sv: LandingPageContent;
  en: LandingPageContent;
}

export function getPageBySlug(
  pages: LandingPage[],
  slug: string,
  locale: Locale,
): LandingPage | undefined {
  return pages.find((p) =>
    locale === "sv" ? p.svSlug === slug : p.enSlug === slug,
  );
}

export function getContent(page: LandingPage, locale: Locale): LandingPageContent {
  return locale === "sv" ? page.sv : page.en;
}
