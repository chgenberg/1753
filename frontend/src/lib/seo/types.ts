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
  esSlug?: string;
  deSlug?: string;
  frSlug?: string;
  category: string;
  productIds: string[];
  sv: LandingPageContent;
  en: LandingPageContent;
  es?: LandingPageContent;
  de?: LandingPageContent;
  fr?: LandingPageContent;
}

export function getSlug(page: LandingPage, locale: Locale): string {
  switch (locale) {
    case "es": return page.esSlug || page.enSlug;
    case "de": return page.deSlug || page.enSlug;
    case "fr": return page.frSlug || page.enSlug;
    case "en": return page.enSlug;
    default: return page.svSlug;
  }
}

export function getPageBySlug(
  pages: LandingPage[],
  slug: string,
  locale: Locale,
): LandingPage | undefined {
  return pages.find((p) => getSlug(p, locale) === slug);
}

export function getContent(page: LandingPage, locale: Locale): LandingPageContent {
  switch (locale) {
    case "es": return page.es || page.en;
    case "de": return page.de || page.en;
    case "fr": return page.fr || page.en;
    case "en": return page.en;
    default: return page.sv;
  }
}
