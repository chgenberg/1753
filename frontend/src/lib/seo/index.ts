import type { LandingPage } from "./types";
import { CBD_PAGES } from "./pages-cbd";
import { CBG_PAGES } from "./pages-cbg";
import { CITY_PAGES } from "./pages-cities";
import { GENERAL_PAGES } from "./pages-general";
import { CONDITION_PAGES } from "./pages-conditions";
import { LIFESTYLE_PAGES } from "./pages-lifestyle";
import { AUDIENCE_PAGES } from "./pages-audience";
import { HOWTO_PAGES } from "./pages-howto";

export const ALL_LANDING_PAGES: LandingPage[] = [
  ...CBD_PAGES,
  ...CBG_PAGES,
  ...CITY_PAGES,
  ...GENERAL_PAGES,
  ...CONDITION_PAGES,
  ...LIFESTYLE_PAGES,
  ...AUDIENCE_PAGES,
  ...HOWTO_PAGES,
];

export function findPageBySlug(
  slug: string,
  locale: "sv" | "en",
): LandingPage | undefined {
  return ALL_LANDING_PAGES.find((p) =>
    locale === "sv" ? p.svSlug === slug : p.enSlug === slug,
  );
}
