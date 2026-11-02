// Samma gräns som GIFT_THRESHOLD i server.js. Servern avgör om gåvan läggs till;
// här används värdena bara för att visa kunden hur långt det är kvar.
export const GIFT_THRESHOLD = { SEK: 1500, EUR: 130 } as const;
export const GIFT_PRODUCT_ID = "au-naturel-makeup-remover";

export const UPGRADE_FROM_ID = "duo-kit";
export const UPGRADE_TO_ID = "duo-ta-da";
export const UPGRADE_ADDON_ID = "ta-da-serum";
