// outreach/campaign.js
//
// Verifierad kampanj- och produktfakta för den autonoma mejlagenten.
// ALLT som agenten får påstå om priser/koder/produkter måste komma härifrån
// (eller från e-boken). Inget får hittas på.
//
// Källa: speglar den verifierade listan i CHAT_WIDGET_PROMPT (server.js) +
// frontend/src/lib/products.ts. Håll i synk vid prisändringar.

const db = require("../db");

const CAMPAIGN = {
  code: "sparre",
  packageId: "duo-ta-da",
  packageName: "DUO-kit + TA-DA Serum",
  giftName: "TA-DA Serum",
  giftValueSek: 699,
  link: "https://www.1753skin.com/sv/produkter/duo-ta-da",
};

const SITE_BASE = "https://www.1753skin.com";
const LINK_LOCALES = ["sv", "en", "es", "de", "fr"];

/**
 * Bygger en friktionsfri, mätbar kampanjlänk per segment/språk:
 *  - ?kampanj=<kod> → produktsidan lägger paketet i varukorgen + förbereder koden
 *  - utm_* → klick/köp kan mätas per segment i analytics
 */
function buildCampaignLink(segment = "outreach", locale = "sv") {
  const loc = LINK_LOCALES.includes(locale) ? locale : "sv";
  const params = new URLSearchParams({
    kampanj: CAMPAIGN.code,
    utm_source: "email",
    utm_medium: "outreach",
    utm_campaign: CAMPAIGN.code,
    utm_content: segment || "outreach",
  });
  return `${SITE_BASE}/${loc}/produkter/${CAMPAIGN.packageId}?${params.toString()}`;
}

// Verifierad produktkatalog (svenska priser). Endast dessa fakta får uppges.
const PRODUCT_FACTS = `VERIFIERAD PRODUKTKATALOG (enda tillåtna källan för priser/innehåll):
1. DUO-kit + TA-DA Serum (id: duo-ta-da, 1 495 kr) – komplett rutin: The ONE + I LOVE ansiktsoljor + TA-DA Serum.
2. TA-DA Serum (id: ta-da-serum, 699 kr, 30 ml) – ekologisk jojobaolja (Simmondsia chinensis Seed Oil) + Cannabigerol (CBG) 3 %.
3. DUO-kit (id: duo-kit, 1 099 kr) – The ONE (10 % CBD, 0,2 % CBG) + I LOVE (10 % CBD, 5 % CBG) ansiktsoljor.
4. Au Naturel Makeup Remover (id: au-naturel-makeup-remover, 399 kr, 100 ml) – MCT-olja (Caprylic/Capric Triglyceride) + CBD 0,2 %.
5. Fungtastic Mushroom Extract (id: fungtastic-mushroom-extract, 377 kr, 60 kapslar) – Chaga, Lion's Mane, Cordyceps, Reishi. Kosttillskott, inte ansiktsprodukt.

Övrigt innehåll än ovan finns på förpackning/produktsida – gissa aldrig ingredienser.`;

const CAMPAIGN_BRIEF = `KAMPANJ (mjuk brådska, inget exakt datum):
- Koden "${CAMPAIGN.code}" ger ett ${CAMPAIGN.giftName} (värde ${CAMPAIGN.giftValueSek} kr) på köpet när man köper ${CAMPAIGN.packageName}.
- Länk: ${CAMPAIGN.link}
- Brådska: erbjudandet håller på att ta slut / begränsat antal. Säg ALDRIG ett exakt slutdatum eller antal du inte vet.
- Nämn koden "${CAMPAIGN.code}" BARA om den uttryckligen är aktiverad (det avgörs av systemet, inte av dig). Om du är osäker: beskriv erbjudandet i ord och bjud in till svar, men hitta inte på en kod.`;

/**
 * Säkerhetsguard: kampanjkoden får bara nämnas om den finns och är aktiv i
 * discount_codes. Vi skapar den aldrig automatiskt (ekonomin sätts medvetet av
 * admin i rabattkods-UI:t – regressionsskydd för köpflödet).
 */
async function isCampaignCodeActive() {
  try {
    const row = await db.findDiscountCode(CAMPAIGN.code);
    if (!row || !row.active) return false;
    const now = new Date();
    if (row.valid_from && new Date(row.valid_from) > now) return false;
    if (row.valid_until && new Date(row.valid_until) < now) return false;
    if (row.max_uses && row.used_count >= row.max_uses) return false;
    return true;
  } catch (_) {
    return false;
  }
}

module.exports = { CAMPAIGN, PRODUCT_FACTS, CAMPAIGN_BRIEF, buildCampaignLink, isCampaignCodeActive };
