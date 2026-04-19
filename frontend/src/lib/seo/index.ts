import type { LandingPage } from "./types";
import { CBD_PAGES } from "./pages-cbd";
import { CBG_PAGES } from "./pages-cbg";
import { CITY_PAGES } from "./pages-cities";
import { EU_CITY_PAGES } from "./pages-cities-eu";
import { GENERAL_PAGES } from "./pages-general";
import { CONDITION_PAGES } from "./pages-conditions";
import { LIFESTYLE_PAGES } from "./pages-lifestyle";
import { AUDIENCE_PAGES } from "./pages-audience";
import { HOWTO_PAGES } from "./pages-howto";
import { TIER1_PAGES } from "./pages-tier1";

export const ALL_LANDING_PAGES: LandingPage[] = [
  ...TIER1_PAGES,
  ...CBD_PAGES,
  ...CBG_PAGES,
  ...CITY_PAGES,
  ...EU_CITY_PAGES,
  ...GENERAL_PAGES,
  ...CONDITION_PAGES,
  ...LIFESTYLE_PAGES,
  ...AUDIENCE_PAGES,
  ...HOWTO_PAGES,
];

export function findPageBySlug(
  slug: string,
  locale: string,
): LandingPage | undefined {
  return ALL_LANDING_PAGES.find((p) => {
    switch (locale) {
      case "es": return (p.esSlug || p.enSlug) === slug;
      case "de": return (p.deSlug || p.enSlug) === slug;
      case "fr": return (p.frSlug || p.enSlug) === slug;
      case "en": return p.enSlug === slug;
      default: return p.svSlug === slug;
    }
  });
}
