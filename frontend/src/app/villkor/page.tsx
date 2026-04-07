import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Köpvillkor",
  description:
    "Köpvillkor för 1753 SKINCARE – betalning, leverans, ångerrätt och reklamation.",
};

export default function TermsPage() {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-[720px] px-6 md:px-10">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Köpvillkor
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Senast uppdaterad: 2026-03-25
        </p>

        <div className="prose-brand mt-10 space-y-8 text-[15px] leading-relaxed text-brand-600">
          <section>
            <h2 className="text-lg font-bold text-brand-900">1. Allmänt</h2>
            <p>
              Dessa villkor gäller för köp av produkter via 1753skincare.com
              och drivs av Floranie International AB, org.nr 559266-5735,
              Södra Skjutbanevägen 10, 439 55 Åsa. Genom att genomföra ett
              köp godkänner du dessa villkor.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-900">2. Priser</h2>
            <p>
              Alla priser anges i svenska kronor (SEK) inklusive moms. Vi
              förbehåller oss rätten att ändra priser utan föregående
              meddelande, men redan lagda ordrar påverkas inte.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-900">
              3. Betalning
            </h2>
            <p>
              Betalning sker via Viva Wallet med stöd för kort (Visa,
              Mastercard) och andra tillgängliga betalmetoder. Betalningen
              dras i samband med köpet.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-900">
              4. Leverans
            </h2>
            <p>
              Vi skickar alla ordrar via vårt lagersamarbete med Logit. Normal
              leveranstid är 2–5 arbetsdagar inom Sverige. Fri frakt vid köp
              över 700 kr; i övrigt tillkommer en fraktavgift på 49 kr.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-900">
              5. Ångerrätt
            </h2>
            <p>
              Enligt distansavtalslagen har du 14 dagars ångerrätt från det
              att du mottagit din beställning. Produkterna ska vara oanvända
              och i originalförpackning. Kontakta oss på{" "}
              <a
                href="mailto:hej@1753skincare.com"
                className="font-medium text-brand-900 underline underline-offset-2"
              >
                hej@1753skincare.com
              </a>{" "}
              för att påbörja en retur.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-900">
              6. Nöjd-kund-garanti
            </h2>
            <p>
              Utöver lagstadgad ångerrätt erbjuder vi en 14 dagars
              nöjd-kund-garanti. Om du inte är nöjd med resultatet efter att
              ha använt produkterna i 14 dagar, återbetalar vi hela
              köpesumman. Kontakta oss så ordnar vi det.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-900">
              7. Reklamation
            </h2>
            <p>
              Om du har mottagit en skadad eller felaktig produkt har du rätt
              till reklamation enligt konsumentköplagen. Kontakta oss inom
              rimlig tid efter att du upptäckt felet.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-900">
              8. Personuppgifter
            </h2>
            <p>
              Vi hanterar dina personuppgifter i enlighet med vår{" "}
              <a
                href="/integritetspolicy"
                className="font-medium text-brand-900 underline underline-offset-2"
              >
                integritetspolicy
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-900">9. Tvist</h2>
            <p>
              Tvister ska i första hand lösas i samförstånd. Om vi inte kan
              komma överens kan du vända dig till Allmänna reklamationsnämnden
              (ARN) eller till allmän domstol. Svensk lag tillämpas.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-900">
              10. Kontakt
            </h2>
            <p>
              Floranie International AB
              <br />
              Södra Skjutbanevägen 10, 439 55 Åsa
              <br />
              <a
                href="mailto:hej@1753skincare.com"
                className="font-medium text-brand-900 underline underline-offset-2"
              >
                hej@1753skincare.com
              </a>
              <br />
              <a
                href="tel:0732305521"
                className="font-medium text-brand-900 underline underline-offset-2"
              >
                0732-30 55 21
              </a>
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
