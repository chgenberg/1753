/** Trusted HTML fragments för köpvillkor (1753 SKINCARE). {{privacyPath}} ersätts vid render. */

import type { LegalDoc } from "./legal-types";

export const LEGAL_TERMS_SV: LegalDoc = {
  metaTitle: "Köpvillkor",
  metaDescription:
    "Köpvillkor för 1753 SKINCARE – betalning, leverans, ångerrätt och reklamation.",
  h1: "Köpvillkor",
  updated: "Senast uppdaterad: 2026-03-25",
  sections: [
    {
      h: "1. Allmänt",
      html: `<p>Dessa villkor gäller för köp av produkter via 1753skincare.com och drivs av Floranie International AB, org.nr 559266-5735, Södra Skjutbanevägen 10, 439 55 Åsa. Genom att genomföra ett köp godkänner du dessa villkor.</p>`,
    },
    {
      h: "2. Priser",
      html: `<p>Alla priser anges i svenska kronor (SEK) inklusive moms. Vi förbehåller oss rätten att ändra priser utan föregående meddelande, men redan lagda ordrar påverkas inte.</p>`,
    },
    {
      h: "3. Betalning",
      html: `<p>Betalning sker via Viva Wallet med stöd för kort (Visa, Mastercard), Swish och andra tillgängliga betalmetoder. Betalningen dras i samband med köpet.</p>`,
    },
    {
      h: "4. Leverans",
      html: `<p>Vi skickar alla ordrar med Postnord Varubrev. Normal leveranstid är 2–5 arbetsdagar inom Sverige. Fri frakt vid köp över 600 kr; i övrigt tillkommer en fraktavgift på 49 kr.</p>`,
    },
    {
      h: "5. Ångerrätt",
      html: `<p>Enligt distansavtalslagen har du 14 dagars ångerrätt från det att du mottagit din beställning. Produkterna ska vara oanvända och i originalförpackning. Kontakta oss på <a href="mailto:hej@1753skincare.com" class="font-medium text-brand-900 underline underline-offset-2">hej@1753skincare.com</a> för att påbörja en retur.</p>`,
    },
    {
      h: "6. Reklamation",
      html: `<p>Om du har mottagit en skadad eller felaktig produkt har du rätt till reklamation enligt konsumentköplagen. Kontakta oss inom rimlig tid efter att du upptäckt felet.</p>`,
    },
    {
      h: "7. Personuppgifter",
      html: `<p>Vi hanterar dina personuppgifter i enlighet med vår <a href="{{privacyPath}}" class="font-medium text-brand-900 underline underline-offset-2">integritetspolicy</a>.</p>`,
    },
    {
      h: "8. Tvist",
      html: `<p>Tvister ska i första hand lösas i samförstånd. Om vi inte kan komma överens kan du vända dig till Allmänna reklamationsnämnden (ARN) eller till allmän domstol. Svensk lag tillämpas.</p>`,
    },
    {
      h: "9. Kontakt",
      html: `<p>Floranie International AB<br />Södra Skjutbanevägen 10, 439 55 Åsa<br /><a href="mailto:hej@1753skincare.com" class="font-medium text-brand-900 underline underline-offset-2">hej@1753skincare.com</a><br /><a href="tel:0732305521" class="font-medium text-brand-900 underline underline-offset-2">0732-30 55 21</a></p>`,
    },
  ],
};

export const LEGAL_PRIVACY_SV: LegalDoc = {
  metaTitle: "Integritetspolicy",
  metaDescription:
    "Läs om hur 1753 SKINCARE hanterar dina personuppgifter i enlighet med GDPR.",
  h1: "Integritetspolicy",
  updated: "Senast uppdaterad: 2026-03-25",
  sections: [
    {
      h: "1. Personuppgiftsansvarig",
      html: `<p>Floranie International AB, org.nr 559266-5735, Södra Skjutbanevägen 10, 439 55 Åsa (&quot;vi&quot;, &quot;oss&quot;, &quot;1753 SKINCARE&quot;) ansvarar för behandlingen av dina personuppgifter.</p>`,
    },
    {
      h: "2. Vilka uppgifter vi samlar in",
      html: `<ul class="ml-5 list-disc space-y-1.5"><li><strong>Vid köp:</strong> namn, e-postadress, telefonnummer, leveransadress och betaluppgifter (hanteras av Viva Wallet).</li><li><strong>Vid registrering:</strong> namn, e-postadress, telefonnummer och lösenord (lagras krypterat).</li><li><strong>Vid hudanalys:</strong> foto som analyseras i realtid och inte sparas permanent.</li><li><strong>Automatiskt:</strong> teknisk data som IP-adress, webbläsartyp och sidvisningar via cookies/lokal lagring.</li></ul>`,
    },
    {
      h: "3. Varför vi behandlar dina uppgifter",
      html: `<ul class="ml-5 list-disc space-y-1.5"><li>Fullgöra köpeavtal (leverans, fakturering, support).</li><li>Hantera ditt kundkonto och orderhistorik.</li><li>Ge personaliserade rekommendationer baserat på hudanalys.</li><li>Skicka orderbekräftelse och, med ditt samtycke, nyhetsbrev.</li><li>Förbättra webbplatsen och våra tjänster.</li></ul>`,
    },
    {
      h: "4. Rättslig grund",
      html: `<p>Vi behandlar dina uppgifter med stöd av avtalets fullgörande (köp), berättigat intresse (webbanalys, bedrägeribekämpning) och samtycke (marknadsföring, cookies). Du kan när som helst återkalla ditt samtycke.</p>`,
    },
    {
      h: "5. Delning med tredje part",
      html: `<p>Vi delar uppgifter med:</p><ul class="ml-5 list-disc space-y-1.5 mt-2"><li><strong>Viva Wallet</strong> – betalningshantering.</li><li><strong>Fortnox</strong> – bokföring och fakturering.</li><li><strong>Ongoing WMS / Logit</strong> – lagerhantering och frakt.</li><li><strong>Resend</strong> – e-postutskick.</li></ul><p class="mt-2">Vi säljer aldrig dina personuppgifter till tredje part.</p>`,
    },
    {
      h: "6. Cookies och lokal lagring",
      html: `<p>Vi använder <strong>lokal lagring (localStorage)</strong> för att spara din varukorg och inloggningssession. Vi använder <strong>sessionStorage</strong> för temporär orderdata under betalning. Vi använder <strong>inga</strong> tredjepartscookies utan ditt samtycke.</p><p class="mt-2">Om du aktiverar analytics-cookies kan anonymiserad besöksstatistik samlas in. Du kan när som helst ändra dina preferenser via cookiebannern.</p>`,
    },
    {
      h: "7. Lagringstid",
      html: `<p>Kunduppgifter sparas så länge du har ett konto hos oss. Orderdata sparas i sju år enligt bokföringslagen. Hudfoton raderas direkt efter analys.</p>`,
    },
    {
      h: "8. Dina rättigheter",
      html: `<p>Enligt GDPR har du rätt att:</p><ul class="ml-5 list-disc space-y-1.5 mt-2"><li>Begära tillgång till dina personuppgifter.</li><li>Begära rättelse eller radering.</li><li>Begränsa eller invända mot behandling.</li><li>Begära dataportabilitet.</li><li>Klagomål till Integritetsskyddsmyndigheten (IMY) om du anser att vi bryter mot GDPR.</li></ul>`,
    },
    {
      h: "9. Kontakt",
      html: `<p>Har du frågor om vår hantering av personuppgifter? Kontakta oss på <a href="mailto:hej@1753skincare.com" class="font-medium text-brand-900 underline underline-offset-2">hej@1753skincare.com</a> eller ring <a href="tel:0732305521" class="font-medium text-brand-900 underline underline-offset-2">0732-30 55 21</a>.</p>`,
    },
  ],
};
