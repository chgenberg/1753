import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Integritetspolicy",
  description:
    "Läs om hur 1753 SKINCARE hanterar dina personuppgifter i enlighet med GDPR.",
};

export default function PrivacyPage() {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-[720px] px-6 md:px-10">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Integritetspolicy
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Senast uppdaterad: 2026-03-25
        </p>

        <div className="prose-brand mt-10 space-y-8 text-[15px] leading-relaxed text-brand-600">
          <section>
            <h2 className="text-lg font-bold text-brand-900">
              1. Personuppgiftsansvarig
            </h2>
            <p>
              Floranie International AB, org.nr 559266-5735, Södra
              Skjutbanevägen 10, 439 55 Åsa (&quot;vi&quot;, &quot;oss&quot;,
              &quot;1753 SKINCARE&quot;) ansvarar för behandlingen av dina
              personuppgifter.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-900">
              2. Vilka uppgifter vi samlar in
            </h2>
            <ul className="ml-5 list-disc space-y-1.5">
              <li>
                <strong>Vid köp:</strong> namn, e-postadress, telefonnummer,
                leveransadress och betaluppgifter (hanteras av Viva Wallet).
              </li>
              <li>
                <strong>Vid registrering:</strong> namn, e-postadress,
                telefonnummer och lösenord (lagras krypterat).
              </li>
              <li>
                <strong>Vid hudanalys:</strong> foto som analyseras i realtid
                och inte sparas permanent.
              </li>
              <li>
                <strong>Automatiskt:</strong> teknisk data som IP-adress,
                webbläsartyp och sidvisningar via cookies/lokal lagring.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-900">
              3. Varför vi behandlar dina uppgifter
            </h2>
            <ul className="ml-5 list-disc space-y-1.5">
              <li>Fullgöra köpeavtal (leverans, fakturering, support).</li>
              <li>Hantera ditt kundkonto och orderhistorik.</li>
              <li>
                Ge personaliserade rekommendationer baserat på hudanalys.
              </li>
              <li>
                Skicka orderbekräftelse och, med ditt samtycke, nyhetsbrev.
              </li>
              <li>Förbättra webbplatsen och våra tjänster.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-900">
              4. Rättslig grund
            </h2>
            <p>
              Vi behandlar dina uppgifter med stöd av avtalets fullgörande
              (köp), berättigat intresse (webbanalys, bedrägeribekämpning) och
              samtycke (marknadsföring, cookies). Du kan när som helst
              återkalla ditt samtycke.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-900">
              5. Delning med tredje part
            </h2>
            <p>Vi delar uppgifter med:</p>
            <ul className="ml-5 list-disc space-y-1.5">
              <li>
                <strong>Viva Wallet</strong> – betalningshantering.
              </li>
              <li>
                <strong>Fortnox</strong> – bokföring och fakturering.
              </li>
              <li>
                <strong>Ongoing WMS / Logit</strong> – lagerhantering och
                frakt.
              </li>
              <li>
                <strong>Resend</strong> – e-postutskick.
              </li>
            </ul>
            <p className="mt-2">
              Vi säljer aldrig dina personuppgifter till tredje part.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-900">
              6. Cookies och lokal lagring
            </h2>
            <p>
              Vi använder <strong>lokal lagring (localStorage)</strong> för
              att spara din varukorg och inloggningssession. Vi använder
              <strong> sessionStorage</strong> för temporär orderdata under
              betalning. Vi använder <strong>inga</strong> tredjepartscookies
              utan ditt samtycke.
            </p>
            <p className="mt-2">
              Om du aktiverar analytics-cookies kan anonymiserad
              besöksstatistik samlas in. Du kan när som helst ändra dina
              preferenser via cookiebannern.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-900">
              7. Lagringstid
            </h2>
            <p>
              Kunduppgifter sparas så länge du har ett konto hos oss.
              Orderdata sparas i sju år enligt bokföringslagen. Hudfoton
              raderas direkt efter analys.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-900">
              8. Dina rättigheter
            </h2>
            <p>Enligt GDPR har du rätt att:</p>
            <ul className="ml-5 list-disc space-y-1.5">
              <li>Begära tillgång till dina personuppgifter.</li>
              <li>Begära rättelse eller radering.</li>
              <li>Begränsa eller invända mot behandling.</li>
              <li>Begära dataportabilitet.</li>
              <li>
                Klaga till Integritetsskyddsmyndigheten (IMY) om du anser att
                vi bryter mot GDPR.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-900">9. Kontakt</h2>
            <p>
              Har du frågor om vår hantering av personuppgifter? Kontakta oss
              på{" "}
              <a
                href="mailto:hej@1753skincare.com"
                className="font-medium text-brand-900 underline underline-offset-2"
              >
                hej@1753skincare.com
              </a>{" "}
              eller ring{" "}
              <a
                href="tel:0732305521"
                className="font-medium text-brand-900 underline underline-offset-2"
              >
                0732-30 55 21
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
