// Kör: node scripts/test-checkout-helpers.js
// Testar reglerna för telefonnummer, språk och trattmätning i services/checkout-helpers.js.

const assert = require("assert");
const h = require("../services/checkout-helpers");

let passed = 0;
function eq(actual, expected, label) {
  assert.deepStrictEqual(actual, expected, `${label}: fick ${JSON.stringify(actual)}, väntade ${JSON.stringify(expected)}`);
  passed++;
}

// --- Svenska nummer: det format kassan alltid skickat ska vara oförändrat ---
eq(h.normalizeSwedishPhone("701234567"), "701234567", "redan normaliserat");
eq(h.normalizeSwedishPhone("0701234567"), "701234567", "nationellt med nolla");
eq(h.normalizeSwedishPhone("0701-234 567"), "701234567", "formaterat");

// --- Nummer med landskod (orsaken till hängande Swish) ---
eq(h.normalizeSwedishPhone("+46701234567"), "701234567", "+46");
eq(h.normalizeSwedishPhone("46701234567"), "701234567", "46 utan plus");
eq(h.normalizeSwedishPhone("0046701234567"), "701234567", "0046");
eq(h.normalizeSwedishPhone("+46 (0)70-123 45 67"), "701234567", "+46 (0)70");

// --- Riktnummer 046 (Lund) får inte tolkas som landskod ---
eq(h.normalizeSwedishPhone("0461234567"), "461234567", "046-nummer nationellt");
eq(h.normalizeSwedishPhone("461234567"), "461234567", "046-nummer som kassan skickar det");
eq(h.normalizeSwedishPhone("+46461234567"), "461234567", "046-nummer med landskod");

// --- Vad Viva får: bara giltiga svenska mobilnummer ---
eq(h.vivaCustomerPhone("701234567", "SE"), "701234567", "mobil → skickas");
eq(h.vivaCustomerPhone("+46701234567", "SE"), "701234567", "mobil med landskod → lagas");
eq(h.vivaCustomerPhone("4670123456", "SE"), null, "kapat nummer från gammal kassa → skickas inte");
eq(h.vivaCustomerPhone("31123456", "SE"), null, "fast telefon → skickas inte");
eq(h.vivaCustomerPhone("", "SE"), null, "tomt");
eq(h.vivaCustomerPhone(undefined, "SE"), null, "saknas");
eq(h.vivaCustomerPhone("4915123456789", "DE"), null, "utländskt nummer → skickas inte");
eq(h.vivaCustomerPhone("701234567", undefined), "701234567", "land saknas → Sverige");

// --- Vad som sparas på ordern ---
eq(h.orderCustomerPhone("701234567", "SE"), "701234567", "order: mobil oförändrad");
eq(h.orderCustomerPhone("+46701234567", "SE"), "701234567", "order: landskod lagas");
eq(h.orderCustomerPhone("4915123456789", "DE"), "4915123456789", "order: utländskt oförändrat");
eq(h.orderCustomerPhone("015123456789", "DE"), "15123456789", "order: utländskt, samma regel som förut");
eq(h.orderCustomerPhone(undefined, "SE"), "", "order: saknas");

// --- Språk ---
eq(h.vivaRequestLang("sv"), "sv-SE", "viva sv");
eq(h.vivaRequestLang("de"), "de-DE", "viva de");
eq(h.vivaRequestLang("en"), "en-GB", "viva en");
eq(h.vivaRequestLang("xx"), "sv-SE", "viva okänt → svenska");
eq(h.storeLocaleFromVivaLang("de-DE"), "de", "retur de-DE");
eq(h.storeLocaleFromVivaLang("en-GB"), "en", "retur en-GB");
eq(h.storeLocaleFromVivaLang("el-GR"), "sv", "retur okänt språk → sv");
eq(h.storeLocaleFromVivaLang(undefined), "sv", "retur saknas → sv");
eq(h.storeLocaleFromVivaLang(["fr-FR", "de-DE"]), "fr", "retur dubbel parameter");
eq(h.storeLocale("fr"), "fr", "locale fr");
eq(h.storeLocale("../etc"), null, "locale skräp");

// --- Trattmätning ---
eq(h.isFunnelEvent("begin_checkout"), true, "känd händelse");
eq(h.isFunnelEvent("drop table"), false, "okänd händelse");
eq(h.isFunnelEvent(undefined), false, "saknad händelse");
eq(h.deviceFromUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Mobile/15E148 Instagram 300.0"), "inapp", "Instagram");
eq(h.deviceFromUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1"), "mobile", "iPhone Safari");
eq(h.deviceFromUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36"), "desktop", "desktop");
eq(h.deviceFromUserAgent(undefined), "desktop", "saknad UA");

console.log(`OK – ${passed} kontroller`);
