// Julkampanj 2026: en burk Chagala på köpet till den som köper ett DUO-kit.
// Samma värden som JUL_CAMPAIGN i server.js. Servern avgör om burken läggs i
// ordern; här styr värdena bara vad kunden får se (hero, kampanjprodukt och
// gåvoraden i varukorg och kassa).
export const JUL_CAMPAIGN = {
  /** Kampanjprodukten i produktlistan. Den lägger ett DUO-kit i varukorgen. */
  productId: "jul-duo-chagala",
  giftProductId: "chagala",
  qualifyingProductIds: ["duo-kit", "duo-ta-da"],
  /** Produktsidor som visar en länk till julkitet: produkterna som ingår i det. */
  promoProductIds: ["duo-kit", "chagala"],
  startsAt: Date.parse("2026-11-18T00:00:00+01:00"),
  endsAt: Date.parse("2026-12-25T00:00:00+01:00"),
} as const;

export function isJulCampaignActive(now: number = Date.now()): boolean {
  return now >= JUL_CAMPAIGN.startsAt && now < JUL_CAMPAIGN.endsAt;
}

/** True om varukorgen innehåller en produkt som ger Chagala på köpet. */
export function cartQualifiesForJulGift(productIds: string[], now: number = Date.now()): boolean {
  if (!isJulCampaignActive(now)) return false;
  const qualifying: readonly string[] = JUL_CAMPAIGN.qualifyingProductIds;
  return productIds.some((id) => qualifying.includes(id));
}
