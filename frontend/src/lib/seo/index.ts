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
import { INGREDIENT_PAGES } from "./pages-ingredients";
import { MYTH_PAGES } from "./pages-myths";
import { TREND_PAGES } from "./pages-trends";
import { SYMPTOM_PAGES } from "./pages-symptoms";
import { BODYPART_PAGES } from "./pages-bodyparts";
import { LIFECYCLE_PAGES } from "./pages-lifecycle";
import { COMPARISON_PAGES } from "./pages-comparisons";
import { SEASONAL_PAGES } from "./pages-seasonal";
import { WELLNESS_PAGES } from "./pages-wellness";
import { PROFESSION_PAGES } from "./pages-profession";
import { CITY_V2_PAGES } from "./pages-cities-v2";
import { SCIENCE_PAGES } from "./pages-science";

export const ALL_LANDING_PAGES: LandingPage[] = [
  ...TIER1_PAGES,
  ...INGREDIENT_PAGES,
  ...MYTH_PAGES,
  ...TREND_PAGES,
  ...SYMPTOM_PAGES,
  ...BODYPART_PAGES,
  ...LIFECYCLE_PAGES,
  ...COMPARISON_PAGES,
  ...SEASONAL_PAGES,
  ...WELLNESS_PAGES,
  ...PROFESSION_PAGES,
  ...CITY_V2_PAGES,
  ...SCIENCE_PAGES,
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
