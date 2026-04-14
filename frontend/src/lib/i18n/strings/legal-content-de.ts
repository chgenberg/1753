/** Vertrauenswürdiges HTML für Kaufbedingungen (1753 SKINCARE). {{privacyPath}} wird beim Rendern ersetzt. */

import type { LegalDoc } from "./legal-types";

export const LEGAL_TERMS_DE: LegalDoc = {
  metaTitle: "Allgemeine Geschäftsbedingungen",
  metaDescription:
    "AGB von 1753 SKINCARE – Zahlung, Lieferung, Rückgabe und Reklamationen.",
  h1: "Allgemeine Geschäftsbedingungen",
  updated: "Zuletzt aktualisiert: 2026-03-25",
  sections: [
    {
      h: "1. Allgemeines",
      html: `<p>Diese Bedingungen gelten für Käufe über 1753skincare.com. Die Website wird betrieben von Floranie International AB, Organisationsnummer 559266-5735, Södra Skjutbanevägen 10, 439 55 Åsa, Schweden. Mit Abschluss eines Kaufs akzeptieren Sie diese Bedingungen.</p>`,
    },
    {
      h: "2. Preise",
      html: `<p>Alle Preise verstehen sich inklusive Mehrwertsteuer. Die Preise werden für Besucher aus Schweden in SEK und für internationale Besucher in EUR angezeigt. Wir können Preise ohne vorherige Ankündigung ändern; bereits aufgegebene Bestellungen bleiben unberührt.</p>`,
    },
    {
      h: "3. Zahlung",
      html: `<p>Die Zahlung wird über Viva Wallet abgewickelt mit Unterstützung für Karte (Visa, Mastercard), Swish und andere verfügbare Zahlungsarten. Die Belastung erfolgt, wenn Sie den Kauf abschließen.</p>`,
    },
    {
      h: "4. Lieferung",
      html: `<p>Wir versenden alle Bestellungen mit PostNord Varubrev. Die übliche Lieferzeit beträgt 2–5 Werktage innerhalb Schwedens und 5–10 Werktage für Lieferungen innerhalb der EU. Kostenloser Versand bei Bestellungen über 600 SEK / \u20AC60; andernfalls fällt eine Versandgebühr von 55 SEK / \u20AC6 an.</p>`,
    },
    {
      h: "5. Widerrufsrecht",
      html: `<p>Nach dem Fernabsatzgesetz haben Sie 14 Tage Zeit, nach Erhalt Ihrer Bestellung vom Kauf zurückzutreten. Die Produkte müssen unbenutzt und in der Originalverpackung sein. Kontaktieren Sie uns unter <a href="mailto:hej@1753skincare.com" class="font-medium text-brand-900 underline underline-offset-2">hej@1753skincare.com</a>, um eine Rücksendung einzuleiten.</p>`,
    },
    {
      h: "6. Reklamationen",
      html: `<p>Wenn Sie ein beschädigtes oder falsches Produkt erhalten, können Sie gemäß dem schwedischen Konsumentenkaufrecht (Konsumentköplagen) reklamieren. Kontaktieren Sie uns innerhalb einer angemessenen Frist, nachdem Sie den Mangel entdeckt haben.</p>`,
    },
    {
      h: "7. Personenbezogene Daten",
      html: `<p>Wir verarbeiten Ihre personenbezogenen Daten gemäß unserer <a href="{{privacyPath}}" class="font-medium text-brand-900 underline underline-offset-2">Datenschutzerklärung</a>.</p>`,
    },
    {
      h: "8. Streitigkeiten",
      html: `<p>Streitigkeiten sollten zunächst im gegenseitigen Einvernehmen beigelegt werden. Wenn das nicht möglich ist, können Sie sich an den Allgemeinen Reklamationsausschuss (ARN, Allmänna reklamationsnämnden) oder an die ordentlichen Gerichte wenden. Es gilt schwedisches Recht.</p>`,
    },
    {
      h: "9. Kontakt",
      html: `<p>Floranie International AB<br />Södra Skjutbanevägen 10, 439 55 Åsa, Schweden<br /><a href="mailto:hej@1753skincare.com" class="font-medium text-brand-900 underline underline-offset-2">hej@1753skincare.com</a><br /><a href="tel:0732305521" class="font-medium text-brand-900 underline underline-offset-2">0732-30 55 21</a></p>`,
    },
  ],
};

export const LEGAL_PRIVACY_DE: LegalDoc = {
  metaTitle: "Datenschutzerklärung",
  metaDescription:
    "Wie 1753 SKINCARE Ihre personenbezogenen Daten gemäß DSGVO verarbeitet.",
  h1: "Datenschutzerklärung",
  updated: "Zuletzt aktualisiert: 2026-03-25",
  sections: [
    {
      h: "1. Verantwortlicher",
      html: `<p>Floranie International AB, Organisationsnummer 559266-5735, Södra Skjutbanevägen 10, 439 55 Åsa, Schweden (&quot;wir&quot;, &quot;uns&quot;, &quot;1753 SKINCARE&quot;) ist Verantwortlicher für Ihre personenbezogenen Daten.</p>`,
    },
    {
      h: "2. Welche Daten wir erheben",
      html: `<ul class="ml-5 list-disc space-y-1.5"><li><strong>Beim Kauf:</strong> Name, E-Mail, Telefon, Lieferadresse und Zahlungsdaten (verarbeitet durch Viva Wallet).</li><li><strong>Bei der Registrierung:</strong> Name, E-Mail, Telefon und Passwort (verschlüsselt gespeichert).</li><li><strong>Hautanalyse:</strong> Foto wird in Echtzeit analysiert und nicht dauerhaft gespeichert.</li><li><strong>Automatisch:</strong> technische Daten wie IP-Adresse, Browsertyp und Seitenaufrufe über Cookies/lokalen Speicher.</li></ul>`,
    },
    {
      h: "3. Zweck der Datenverarbeitung",
      html: `<ul class="ml-5 list-disc space-y-1.5"><li>Erfüllung des Kaufvertrags (Lieferung, Rechnungsstellung, Support).</li><li>Verwaltung Ihres Kundenkontos und Ihrer Bestellhistorie.</li><li>Personalisierte Empfehlungen auf Grundlage der Hautanalyse.</li><li>Versand von Bestellbestätigungen und, mit Ihrer Einwilligung, Marketing-E-Mails.</li><li>Verbesserung unserer Website und unserer Dienstleistungen.</li></ul>`,
    },
    {
      h: "4. Rechtsgrundlage",
      html: `<p>Wir stützen uns auf die Vertragserfüllung (Kauf), berechtigte Interessen (Betrugsprävention, Analysen) und Einwilligung (Marketing, Cookies). Sie können Ihre Einwilligung jederzeit widerrufen.</p>`,
    },
    {
      h: "5. Weitergabe an Dritte",
      html: `<p>Wir geben Daten weiter an:</p><ul class="ml-5 list-disc space-y-1.5 mt-2"><li><strong>Viva Wallet</strong> – Zahlungsabwicklung.</li><li><strong>Fortnox</strong> – Buchhaltung und Rechnungsstellung.</li><li><strong>Ongoing WMS / Logit</strong> – Lager und Versand.</li><li><strong>Resend</strong> – transaktionale E-Mails.</li></ul><p class="mt-2">Wir verkaufen Ihre personenbezogenen Daten nicht.</p>`,
    },
    {
      h: "6. Cookies und lokaler Speicher",
      html: `<p>Wir nutzen <strong>localStorage</strong> für Warenkorb und Anmeldesitzung. Wir nutzen <strong>sessionStorage</strong> für temporäre Bestelldaten während des Checkouts. Wir setzen <strong>keine</strong> Cookies Dritter ohne Ihre Einwilligung ein.</p><p class="mt-2">Wenn Sie Analyse-Cookies aktivieren, können anonymisierte Nutzungsstatistiken erhoben werden. Sie können Ihre Einstellungen jederzeit über das Cookie-Banner ändern.</p>`,
    },
    {
      h: "7. Aufbewahrung",
      html: `<p>Kundendaten werden gespeichert, solange Sie ein Kundenkonto haben. Bestelldaten werden gemäß schwedischem Buchführungsrecht sieben Jahre aufbewahrt. Hautfotos werden unmittelbar nach der Analyse gelöscht.</p>`,
    },
    {
      h: "8. Deine Rechte",
      html: `<p>Nach der DSGVO können Sie:</p><ul class="ml-5 list-disc space-y-1.5 mt-2"><li>Auskunft über Ihre Daten verlangen.</li><li>Berichtigung oder Löschung verlangen.</li><li>Die Verarbeitung einschränken oder ihr widersprechen.</li><li>Datenübertragbarkeit verlangen.</li><li>Beschwerde bei der schwedischen Datenschutzbehörde Integritetsskyddsmyndigheten (IMY) einlegen, wenn Sie der Ansicht sind, dass wir gegen die DSGVO verstoßen.</li></ul>`,
    },
    {
      h: "9. Kontakt",
      html: `<p>Fragen zum Umgang mit personenbezogenen Daten? Schreiben Sie an <a href="mailto:hej@1753skincare.com" class="font-medium text-brand-900 underline underline-offset-2">hej@1753skincare.com</a> oder rufen Sie an unter <a href="tel:0732305521" class="font-medium text-brand-900 underline underline-offset-2">0732-30 55 21</a>.</p>`,
    },
  ],
};
