import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Brain,
  Camera,
  ChevronDown,
  Eye,
  Fingerprint,
  Layers,
  Lock,
  ScanFace,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import { locales, type Locale } from "@/lib/i18n/types";
import { localizePath } from "@/lib/i18n/navigation";
import { getMessages } from "@/lib/i18n";
import { TechTabs } from "./tech-tabs";

const BASE_URL = "https://www.1753skin.com";
const IMG = "/Landing_page_skinanalys";

const content = {
  sv: {
    metaTitle: "Gratis AI Hudanalys – 15 Hudmetriker, Hudalder och Personlig Rutin | 1753 SKINCARE",
    metaDescription:
      "Få en gratis AI-hudanalys med 15 vetenskapliga hudmetriker, estimerad hudalder, radardiagram och personliga rekommendationer. MediaPipe-precision i 12 ansiktszoner. Under 60 sekunder.",
    kicker: "Avancerad AI-hudanalys",
    h1: "Gratis hudanalys – 15 metriker, hudalder och radardiagram på 60 sekunder",
    lead: "Vår hudanalys kombinerar en specialtränad AI-modell, MediaPipe ansiktslandmarken i 12 zoner och livsstilsfrågor för att ge dig en komplett bild av din hudhälsa. 15 vetenskapliga metriker, estimerad hudalder, Fitzpatrick-typ och ett interaktivt radardiagram. Ingen registrering. Ingen kostnad.",
    statsLabel: ["träningsbilder i modellen", "hudmetriker analyserade", "ansiktszoner kartlagda"],
    stats: ["14 000+", "15", "12"],
    processTitle: "Så fungerar det – tre steg till din hudanalys",
    steps: [
      {
        icon: "camera",
        title: "1. Scanna ditt ansikte",
        body: "Kameran aktiveras direkt i webbläsaren. MediaPipe Face Landmarker identifierar 478 ansiktspunkter och delar in ditt ansikte i 12 precisa zoner – panna, kinder, näsa, haka, ögonområde, käklinje, T-zon och fler. Allt sker lokalt på din enhet.",
      },
      {
        icon: "brain",
        title: "2. Svara på fem frågor",
        body: "Hudtyp, livsstil, sömn, kost och hudmål. Svaren kombineras med ansiktsscannet och zonbilderna för att skapa en komplett profil – inte bara vad AI:n ser, utan hela bilden.",
      },
      {
        icon: "sparkles",
        title: "3. Få din personliga analys",
        body: "Du får 15 detaljerade hudmetriker med poäng och betyg, en estimerad hudalder, Fitzpatrick-hudtyp, interaktivt radardiagram, detaljerad zonanalys, livsstilsrekommendationer och produktförslag. Allt presenterat i ett lättöverskådligt resultat.",
      },
    ],
    mirrorSection: {
      kicker: "Förstå din hud på djupet",
      title: "Din spegel ljuger inte – men den berättar inte hela sanningen",
      body: "Det du ser i spegeln är bara ytan. Under den finns ett komplext samspel mellan mikrobiom, endocannabinoidsystem, hormoner och livsstil. Vår AI mäter 15 separata aspekter av din hud – från fukt och elasticitet till lyster och barriärhälsa – och ger dig verktygen att agera på det.",
    },
    techTitle: "Teknologin bakom analysen",
    techIntro: "Klicka på flikarna för att utforska de fyra pelarna i vår hudanalys.",
    techTabs: [
      {
        id: "model",
        label: "Tränad AI-modell",
        title: "Specialtränad modell + MediaPipe precision",
        body: "Vår bildklassificerare är tränad på över 14 000 verifierade hudbilder – akne, rosacea, hyperpigmentering, torr hud, solskador, eksem, svamp och mer. Modellen körs som ONNX Runtime Web direkt i din webbläsare.\n\nMediaPipe Face Landmarker identifierar 478 ansiktspunkter och skapar 12 exakta ansiktszoner: panna, vänster och höger kind, näsa, haka, ögonområden, T-zon, nasolabialveck, munområde och käklinje. Varje zon analyseras individuellt och skickas som precisionsbilder till GPT-5.4 för djupanalys.",
        highlights: [
          "14 000+ träningsbilder med kvalitetskontroll",
          "MediaPipe Face Landmarker med 478 landmärken",
          "12 precisa ansiktszoner analyserade individuellt",
          "Körs lokalt – noll data lämnar enheten under scanning",
        ],
      },
      {
        id: "fusion",
        label: "Multimodal fusion",
        title: "Fyra datakällor – 15 metriker – ett holistiskt resultat",
        body: "Vår analys kombinerar fyra datakällor i ett multimodalt fusionssystem:\n\n1. ONNX-modellen klassificerar varje zon lokalt (vad kameran ser)\n2. MediaPipe beskär 12 ansiktszoner med kirurgisk precision\n3. Dina livsstilssvar om kost, sömn och stress (vad du berättar)\n4. GPT-5.4 Vision analyserar helbilden + zonbilder holistiskt\n\nResultatet: 15 vetenskapliga hudmetriker (rynkor, porer, pigmentering, rodnad, textur, mörka ringar, fasthet, fukt, hudton, akne, känslighet, solskador, elasticitet, lyster och barriärhälsa) – varje metrik med poäng 0–100, betyg och förklaring. Plus en estimerad hudalder och Fitzpatrick-hudtyp.",
        highlights: [
          "4 datakällor: ONNX + MediaPipe + livsstil + GPT-5.4",
          "15 individuella hudmetriker med poäng och betyg",
          "Estimerad hudalder baserad på visuell bedömning",
          "Fitzpatrick-hudtyp för personaliserade rekommendationer",
        ],
      },
      {
        id: "tracking",
        label: "Uppföljning över tid",
        title: "Följ alla 15 metriker vecka för vecka",
        body: "En enstaka analys ger en ögonblicksbild. Verklig förändring ser du först över tid. Inloggade användare kan spara alla 15 metriker, hudalder och hudpoäng i en tidslinje.\n\nSe hur specifika metriker som fukt, elasticitet eller lyster förbättras när du ändrar din rutin. Vi erbjuder även krypterad bildlagring (AES-256-GCM) för visuell före/efter-jämförelse. Alla bilder krypteras med bankstandard och kan raderas med ett klick.",
        highlights: [
          "Historik för alla 15 metriker och hudalder",
          "Radardiagram som visar utveckling över tid",
          "Krypterad bildlagring (AES-256-GCM)",
          "Fullständig kontroll – radera allt med ett klick",
        ],
      },
      {
        id: "privacy",
        label: "Integritet och säkerhet",
        title: "Din data, dina regler",
        body: "Vi har designat hela analysen med integritet som grundprincip:\n\nAnsiktsscannet och MediaPipe-analysen sker 100 % lokalt i din webbläsare – ingen bild lämnar din enhet under scanningen. Zonbilderna och frågeformuläret skickas krypterat till GPT-5.4 för den holistiska analysen.\n\nBildlagring är helt valfritt och kräver aktivt samtycke. Bilder krypteras med AES-256-GCM innan de sparas. Alla analysdata kan raderas permanent från ditt konto när som helst.",
        highlights: [
          "Scanning och MediaPipe körs 100 % lokalt",
          "Ingen bild laddas upp utan samtycke",
          "AES-256-GCM kryptering för sparade bilder",
          "GDPR-kompatibel – radera allt när som helst",
        ],
      },
    ],
    holisticSection: {
      kicker: "Holistiskt perspektiv",
      title: "Huden speglar hela kroppen",
      body: "Sömn, kost, stress och rörelse påverkar din hud lika mycket som de produkter du använder. Vår analys väger in allt – och kvantifierar det i 15 separata metriker så att du ser exakt vad som behöver uppmärksamhet.",
    },
    conditionsTitle: "Vad vi mäter och analyserar",
    conditions: [
      "Rynkor och fina linjer", "Porer och textur", "Pigmentering", "Rodnad och rosacea",
      "Hudstruktur", "Mörka ringar", "Fasthet och spänst", "Fukt och hydrering",
      "Hudton och jämnhet", "Akne och finnar", "Känslighet", "Solskador",
      "Elasticitet", "Lyster och strålning", "Barriärhälsa", "Hudens mikrobiom",
      "Endocannabinoidsystemet", "Estimerad hudalder",
    ],
    whatYouGetTitle: "Vad du får i din analys",
    whatYouGet: [
      { icon: "target", title: "15 hudmetriker med poäng", body: "Varje metrik – från fukt och elasticitet till lyster och barriärhälsa – utvärderas med poäng 0–100, betyg (1–5) och en personlig förklaring. Presenterat i ett interaktivt radardiagram." },
      { icon: "layers", title: "12-zons ansiktsanalys", body: "MediaPipe identifierar 478 ansiktspunkter och skapar 12 exakta zoner. Varje zon analyseras individuellt – du ser exakt var din hud behöver mest uppmärksamhet." },
      { icon: "heart", title: "Hudalder och Fitzpatrick-typ", body: "Få en estimerad hudalder baserad på visuell bedömning och din Fitzpatrick-hudtyp för mer precisa rekommendationer anpassade efter just din hud." },
      { icon: "leaf", title: "Rutin, livsstil och produkter", body: "Personlig morgon- och kvällsrutin, livsstilsrekommendationer för sömn, kost, stress och rörelse, plus 2–3 produkter matchade mot din hudprofil med 15 % rabatt." },
    ],
    resultsSection: {
      kicker: "Dina resultat",
      title: "Analysen är bara början",
      body: "Spara dina 15 metriker, följ din hudalder och se radardiagrammet utvecklas över tid. Varje ny analys ger dig en tydligare bild av din hudresa – och visar vilka förändringar som faktiskt gör skillnad.",
    },
    faqTitle: "Vanliga frågor om hudanalysen",
    faq: [
      { q: "Är hudanalysen verkligen gratis?", a: "Ja, helt gratis och utan registrering. Du kan göra analysen anonymt direkt i webbläsaren. Registrering krävs bara om du vill spara dina 15 metriker och följa din huds utveckling över tid." },
      { q: "Vad mäter de 15 metrikerna?", a: "Vi utvärderar rynkor, porer, pigmentering, rodnad, textur, mörka ringar, fasthet, fukt, hudton, akne, känslighet, solskador, elasticitet, lyster och barriärhälsa. Varje metrik får ett poäng 0–100 och betyg. Resultatet visas i ett interaktivt radardiagram." },
      { q: "Hur fungerar hudalder-estimeringen?", a: "GPT-5.4 Vision analyserar din hud visuellt och estimerar en hudalder baserad på synliga tecken som rynkor, elasticitet, textur och pigmentering. Det är inte en medicinsk diagnos utan en indikation som hjälper dig förstå din huds tillstånd." },
      { q: "Vad är MediaPipe Face Landmarker?", a: "MediaPipe är Googles teknologi för ansiktsigenkänning. Den identifierar 478 tredimensionella punkter på ditt ansikte och skapar 12 exakta zoner som analyseras individuellt. Allt sker lokalt i din webbläsare – ingen data skickas till Google." },
      { q: "Laddas min bild upp till någon server?", a: "Scanningen och MediaPipe-analysen sker 100 procent lokalt. Zonbilderna skickas krypterat till GPT-5.4 för den holistiska analysen. Om du väljer att spara en bild i ditt konto krypteras den med AES-256-GCM innan lagring." },
      { q: "Kan analysen ersätta ett besök hos en hudterapeut?", a: "Nej, och det är inte meningen heller. Vår analys ger en detaljerad första indikation med 15 metriker och personaliserade tips, men den ersätter inte en medicinsk bedömning. Vid allvarliga hudproblem rekommenderar vi alltid professionell hjälp." },
      { q: "Vad skiljer er analys från andra online-hudanalyser?", a: "De flesta online-hudanalyser ger ett enkelt svar baserat på en selfie. Vår analys kombinerar en specialtränad ONNX-modell (14 000+ träningsbilder), MediaPipe Face Landmarker (12 ansiktszoner), livsstilsdata och GPT-5.4 Vision i ett multimodalt system. Resultatet: 15 individuella hudmetriker, estimerad hudalder, Fitzpatrick-typ, radardiagram och personlig rutin." },
      { q: "Hur lång tid tar analysen?", a: "Hela processen tar cirka 60 sekunder: ansiktsscan med MediaPipe (10 sekunder), fem frågor (30 sekunder) och AI-analys med GPT-5.4 (20 sekunder)." },
      { q: "Fungerar det på mobilen?", a: "Ja, analysen är helt optimerad för mobil. MediaPipe fungerar utmärkt med frontkameran, och hela upplevelsen är designad mobile-first med responsiva resultat." },
    ],
    ctaTitle: "Redo att förstå din hud?",
    ctaSub: "15 metriker. Hudalder. Radardiagram. Gratis. Under 60 sekunder.",
    ctaButton: "Starta gratis hudanalys",
    ctaSecondary: "Läs mer om vår hudvård",
  },
  en: {
    metaTitle: "Free AI Skin Analysis – 15 Skin Metrics, Skin Age and Personal Routine | 1753 SKINCARE",
    metaDescription:
      "Get a free AI skin analysis with 15 scientific skin metrics, estimated skin age, radar chart and personalised recommendations. MediaPipe precision across 12 facial zones. Under 60 seconds.",
    kicker: "Advanced AI skin analysis",
    h1: "Free skin analysis – 15 metrics, skin age and radar chart in 60 seconds",
    lead: "Our skin analysis combines a purpose-trained AI model, MediaPipe face landmarks across 12 zones, and lifestyle questions to give you a complete picture of your skin health. 15 scientific metrics, estimated skin age, Fitzpatrick type and an interactive radar chart. No sign-up. No cost.",
    statsLabel: ["training images in our model", "skin metrics analysed", "facial zones mapped"],
    stats: ["14,000+", "15", "12"],
    processTitle: "How it works – three steps to your skin analysis",
    steps: [
      { icon: "camera", title: "1. Scan your face", body: "The camera activates directly in your browser. MediaPipe Face Landmarker identifies 478 facial points and divides your face into 12 precise zones – forehead, cheeks, nose, chin, eye area, jawline, T-zone and more. Everything runs locally on your device." },
      { icon: "brain", title: "2. Answer five questions", body: "Skin type, lifestyle, sleep, diet, and skin goals. Your answers are combined with the face scan and zone images to create a complete profile – not just what the AI sees, but the full picture." },
      { icon: "sparkles", title: "3. Get your personal analysis", body: "You receive 15 detailed skin metrics with scores and grades, an estimated skin age, Fitzpatrick skin type, interactive radar chart, detailed zone analysis, lifestyle recommendations and product suggestions. All presented in a clear, easy-to-read format." },
    ],
    mirrorSection: {
      kicker: "Understand your skin deeply",
      title: "Your mirror doesn't lie – but it doesn't tell the whole truth",
      body: "What you see in the mirror is only the surface. Beneath it lies a complex interplay of microbiome, endocannabinoid system, hormones, and lifestyle. Our AI measures 15 separate aspects of your skin – from hydration and elasticity to radiance and barrier health – and gives you the tools to act on it.",
    },
    techTitle: "The technology behind the analysis",
    techIntro: "Click the tabs to explore the four pillars of our skin analysis.",
    techTabs: [
      {
        id: "model", label: "Trained AI model", title: "Purpose-trained model + MediaPipe precision",
        body: "Our image classifier has been trained on over 14,000 verified skin images – acne, rosacea, hyperpigmentation, dry skin, sun damage, eczema, dermatitis, psoriasis and more. The model runs as ONNX Runtime Web directly in your browser.\n\nMediaPipe Face Landmarker identifies 478 facial points and creates 12 precise facial zones: forehead, left and right cheek, nose, chin, eye areas, T-zone, nasolabial folds, mouth area and jawline. Each zone is analysed individually and sent as precision images to GPT-5.4 for deep analysis.",
        highlights: ["14,000+ training images with quality control", "MediaPipe Face Landmarker with 478 landmarks", "12 precise facial zones analysed individually", "Runs locally – zero data leaves your device during scanning"],
      },
      {
        id: "fusion", label: "Multimodal fusion", title: "Four data sources – 15 metrics – one holistic result",
        body: "Our analysis combines four data sources in a multimodal fusion system:\n\n1. The ONNX model classifies each zone locally (what the camera sees)\n2. MediaPipe crops 12 facial zones with surgical precision\n3. Your lifestyle answers about diet, sleep and stress (what you tell us)\n4. GPT-5.4 Vision analyses the full image + zone images holistically\n\nThe result: 15 scientific skin metrics (wrinkles, pores, pigmentation, redness, texture, dark circles, firmness, hydration, skin tone, acne, sensitivity, sun damage, elasticity, radiance and barrier health) – each metric with a score of 0–100, a grade and an explanation. Plus an estimated skin age and Fitzpatrick skin type.",
        highlights: ["4 data sources: ONNX + MediaPipe + lifestyle + GPT-5.4", "15 individual skin metrics with scores and grades", "Estimated skin age based on visual assessment", "Fitzpatrick skin type for personalised recommendations"],
      },
      {
        id: "tracking", label: "Tracking over time", title: "Track all 15 metrics week by week",
        body: "A single analysis gives you a snapshot. Real change becomes visible over time. Logged-in users can save all 15 metrics, skin age and skin score on a timeline.\n\nSee how specific metrics like hydration, elasticity or radiance improve when you change your routine. We also offer encrypted photo storage (AES-256-GCM) for visual before/after comparison. All images are encrypted to banking standards and can be deleted with one click.",
        highlights: ["History for all 15 metrics and skin age", "Radar chart showing progress over time", "Encrypted photo storage (AES-256-GCM)", "Full control – delete everything with one click"],
      },
      {
        id: "privacy", label: "Privacy and security", title: "Your data, your rules",
        body: "We designed the entire analysis with privacy as the core principle:\n\nThe face scan and MediaPipe analysis run 100% locally in your browser – no image leaves your device during scanning. The zone images and questionnaire are sent encrypted to GPT-5.4 for the holistic analysis.\n\nPhoto storage is entirely optional and requires active consent. Images are encrypted with AES-256-GCM before storage. All analysis data can be permanently deleted from your account at any time.",
        highlights: ["Scanning and MediaPipe run 100% locally", "No image uploaded without consent", "AES-256-GCM encryption for saved photos", "GDPR-compliant – delete everything at any time"],
      },
    ],
    holisticSection: {
      kicker: "Holistic perspective",
      title: "Your skin mirrors your whole body",
      body: "Sleep, diet, stress, and movement affect your skin just as much as the products you use. Our analysis weighs everything – and quantifies it across 15 separate metrics so you see exactly what needs attention.",
    },
    conditionsTitle: "What we measure and analyse",
    conditions: [
      "Wrinkles and fine lines", "Pores and texture", "Pigmentation", "Redness and rosacea",
      "Skin texture", "Dark circles", "Firmness and tone", "Hydration and moisture",
      "Skin tone evenness", "Acne and breakouts", "Sensitivity", "Sun damage",
      "Elasticity", "Radiance and glow", "Barrier health", "Skin microbiome",
      "Endocannabinoid system", "Estimated skin age",
    ],
    whatYouGetTitle: "What you get in your analysis",
    whatYouGet: [
      { icon: "target", title: "15 skin metrics with scores", body: "Each metric – from hydration and elasticity to radiance and barrier health – is evaluated with a score of 0–100, a grade (1–5) and a personal explanation. Presented in an interactive radar chart." },
      { icon: "layers", title: "12-zone face analysis", body: "MediaPipe identifies 478 facial points and creates 12 precise zones. Each zone is analysed individually – you see exactly where your skin needs the most attention." },
      { icon: "heart", title: "Skin age and Fitzpatrick type", body: "Get an estimated skin age based on visual assessment and your Fitzpatrick skin type for more precise recommendations tailored to your skin." },
      { icon: "leaf", title: "Routine, lifestyle and products", body: "Personal morning and evening routine, lifestyle recommendations for sleep, diet, stress and exercise, plus 2–3 products matched to your skin profile with 15% off." },
    ],
    resultsSection: {
      kicker: "Your results",
      title: "The analysis is just the beginning",
      body: "Save your 15 metrics, track your skin age and watch the radar chart evolve over time. Every new analysis gives you a clearer picture of your skin journey – and shows which changes actually make a difference.",
    },
    faqTitle: "Frequently asked questions about the skin analysis",
    faq: [
      { q: "Is the skin analysis really free?", a: "Yes, completely free with no sign-up required. You can do the analysis anonymously right in your browser. Registration is only needed if you want to save your 15 metrics and track your skin's progress over time." },
      { q: "What do the 15 metrics measure?", a: "We evaluate wrinkles, pores, pigmentation, redness, texture, dark circles, firmness, hydration, skin tone, acne, sensitivity, sun damage, elasticity, radiance and barrier health. Each metric receives a score of 0–100 and a grade. Results are displayed in an interactive radar chart." },
      { q: "How does the skin age estimation work?", a: "GPT-5.4 Vision analyses your skin visually and estimates a skin age based on visible signs like wrinkles, elasticity, texture and pigmentation. It's not a medical diagnosis but an indication that helps you understand your skin's condition." },
      { q: "What is MediaPipe Face Landmarker?", a: "MediaPipe is Google's facial recognition technology. It identifies 478 three-dimensional points on your face and creates 12 precise zones that are analysed individually. Everything runs locally in your browser – no data is sent to Google." },
      { q: "Is my photo uploaded to a server?", a: "The scan and MediaPipe analysis run 100 percent locally. Zone images are sent encrypted to GPT-5.4 for holistic analysis. If you choose to save a photo to your account, it is encrypted with AES-256-GCM before storage." },
      { q: "Can the analysis replace a visit to a dermatologist?", a: "No, and it's not meant to. Our analysis provides a detailed first indication with 15 metrics and personalised tips, but it doesn't replace a medical assessment. For serious skin concerns, we always recommend seeking professional help." },
      { q: "What sets your analysis apart from other online skin analyses?", a: "Most online skin analyses give a simple answer based on a selfie. Our analysis combines a purpose-trained ONNX model (14,000+ training images), MediaPipe Face Landmarker (12 facial zones), lifestyle data and GPT-5.4 Vision in a multimodal system. The result: 15 individual skin metrics, estimated skin age, Fitzpatrick type, radar chart and a personal routine." },
      { q: "How long does the analysis take?", a: "The entire process takes about 60 seconds: face scan with MediaPipe (10 seconds), five questions (30 seconds), and AI analysis with GPT-5.4 (20 seconds)." },
      { q: "Does it work on mobile?", a: "Yes, the analysis is fully optimised for mobile. MediaPipe works perfectly with the front camera, and the entire experience is designed mobile-first with responsive results." },
    ],
    ctaTitle: "Ready to understand your skin?",
    ctaSub: "15 metrics. Skin age. Radar chart. Free. Under 60 seconds.",
    ctaButton: "Start free skin analysis",
    ctaSecondary: "Learn more about our skincare",
  },
};

interface Props {
  params: Promise<{ locale: Locale }>;
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const c = content[locale as keyof typeof content] || content.sv;
  const svPath = "/sv/gratis-hudanalys";
  const enPath = "/en/free-skin-analysis";
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: {
      canonical: `${BASE_URL}${locale === "en" ? enPath : svPath}`,
      languages: { sv: `${BASE_URL}${svPath}`, en: `${BASE_URL}${enPath}` },
    },
    openGraph: {
      title: c.metaTitle,
      description: c.metaDescription,
      url: `${BASE_URL}/${locale}/gratis-hudanalys`,
      images: [{ url: `${BASE_URL}${IMG}/1.webp`, width: 1600, height: 1600 }],
      locale: locale === "sv" ? "sv_SE" : "en_GB",
      type: "website",
    },
  };
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  camera: Camera,
  brain: Brain,
  sparkles: Sparkles,
  target: ScanFace,
  layers: Layers,
  heart: Eye,
  leaf: Fingerprint,
};

export default async function FreeAnalysisLanding({ params }: Props) {
  const { locale } = await params;
  const l = (locale as Locale) || "sv";
  const c = content[l as keyof typeof content] || content.sv;
  const analysisPath = localizePath(l, "skinAnalysis");
  const productsPath = localizePath(l, "products");

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: l === "sv" ? "AI Hudanalys" : "AI Skin Analysis",
    description: c.metaDescription,
    provider: { "@type": "Organization", name: "1753 SKINCARE", url: BASE_URL },
    serviceType: "Skin Analysis",
    isRelatedTo: { "@type": "MedicalSpecialty", name: "Dermatology" },
    offers: { "@type": "Offer", price: "0", priceCurrency: "SEK", availability: "https://schema.org/InStock" },
    areaServed: { "@type": "Country", name: l === "sv" ? "Sverige" : "Sweden" },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: l === "sv" ? "Hem" : "Home", item: `${BASE_URL}/${l}` },
      { "@type": "ListItem", position: 2, name: l === "sv" ? "Gratis hudanalys" : "Free skin analysis", item: `${BASE_URL}/${l}/gratis-hudanalys` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* ── Hero with image ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f5f5f7] to-white py-16 md:py-24">
        <div className="mx-auto grid max-w-[1280px] items-center gap-10 px-6 md:grid-cols-2 md:gap-16 md:px-10">
          <div className="max-w-xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#108474]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#108474]">
              <ScanFace className="h-4 w-4" />
              {c.kicker}
            </p>
            <h1 className="text-[2.2rem] font-bold leading-[1.1] tracking-tight text-[#1d1d1f] md:text-[3rem]">
              {c.h1}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-[#515151] md:text-lg">
              {c.lead}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={analysisPath}
                className="inline-flex h-[56px] items-center gap-2 rounded-full bg-[#108474] px-10 text-sm font-medium text-white shadow-lg shadow-[#108474]/20 transition-all duration-300 hover:bg-[#0d6e61] hover:shadow-xl hover:shadow-[#108474]/30"
              >
                {c.ctaButton}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl shadow-black/10 md:aspect-square">
            <Image
              src={`${IMG}/1.webp`}
              alt={l === "sv" ? "Kvinna som analyserar sin hud" : "Woman analysing her skin"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-6 px-6 md:px-10">
          {c.stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl font-bold tracking-tight text-[#1d1d1f] md:text-3xl">{stat}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-[#766a62]">{c.statsLabel[i]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Process Steps ── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10">
          <h2 className="mb-14 text-center text-2xl font-bold tracking-tight text-[#1d1d1f] md:text-3xl">
            {c.processTitle}
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {c.steps.map((step, i) => {
              const Icon = iconMap[step.icon] || Sparkles;
              return (
                <div
                  key={i}
                  className="group relative rounded-2xl bg-white p-8 shadow-sm shadow-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#108474]/10">
                    <Icon className="h-6 w-6 text-[#108474]" />
                  </div>
                  <h3 className="mb-3 text-lg font-bold text-[#1d1d1f]">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-[#515151]">{step.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Mirror Section (image 4) ── */}
      <section className="overflow-hidden bg-[#f5f5f7] py-16 md:py-24">
        <div className="mx-auto grid max-w-[1280px] items-center gap-10 px-6 md:grid-cols-2 md:gap-16 md:px-10">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-xl shadow-black/8 md:aspect-[3/4]">
            <Image
              src={`${IMG}/4.webp`}
              alt={l === "sv" ? "Kvinna tittar i spegeln" : "Woman looking in the mirror"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="max-w-lg">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#108474]">
              {c.mirrorSection.kicker}
            </p>
            <h2 className="text-2xl font-bold leading-tight tracking-tight text-[#1d1d1f] md:text-3xl">
              {c.mirrorSection.title}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[#515151]">
              {c.mirrorSection.body}
            </p>
            <Link
              href={analysisPath}
              className="mt-8 inline-flex h-[48px] items-center gap-2 rounded-full bg-[#108474] px-8 text-sm font-medium text-white transition-all duration-300 hover:bg-[#0d6e61] hover:shadow-lg"
            >
              {c.ctaButton}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Tech Tabs ── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10">
          <h2 className="mb-4 text-center text-2xl font-bold tracking-tight text-[#1d1d1f] md:text-3xl">
            {c.techTitle}
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-sm leading-relaxed text-[#515151]">
            {c.techIntro}
          </p>
          <TechTabs tabs={c.techTabs} />
        </div>
      </section>

      {/* ── Holistic Section (image 3) ── */}
      <section className="overflow-hidden bg-[#f5f5f7] py-16 md:py-24">
        <div className="mx-auto grid max-w-[1280px] items-center gap-10 px-6 md:grid-cols-2 md:gap-16 md:px-10">
          <div className="order-2 max-w-lg md:order-1">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#108474]">
              {c.holisticSection.kicker}
            </p>
            <h2 className="text-2xl font-bold leading-tight tracking-tight text-[#1d1d1f] md:text-3xl">
              {c.holisticSection.title}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[#515151]">
              {c.holisticSection.body}
            </p>
          </div>
          <div className="relative order-1 aspect-[4/5] overflow-hidden rounded-3xl shadow-xl shadow-black/8 md:order-2 md:aspect-[3/4]">
            <Image
              src={`${IMG}/3.webp`}
              alt={l === "sv" ? "Kvinna i naturen, holistisk hudvård" : "Woman in nature, holistic skincare"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* ── Conditions Grid ── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10">
          <h2 className="mb-10 text-center text-2xl font-bold tracking-tight text-[#1d1d1f] md:text-3xl">
            {c.conditionsTitle}
          </h2>
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {c.conditions.map((cond, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl bg-[#f5f5f7] px-4 py-3 transition-all duration-200 hover:bg-[#108474]/10"
              >
                <div className="h-2 w-2 shrink-0 rounded-full bg-[#108474]" />
                <span className="text-sm font-medium text-[#1d1d1f]">{cond}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What You Get + image 5 ── */}
      <section className="bg-[#f5f5f7] py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10">
          <h2 className="mb-12 text-center text-2xl font-bold tracking-tight text-[#1d1d1f] md:text-3xl">
            {c.whatYouGetTitle}
          </h2>
          <div className="grid gap-10 md:grid-cols-5">
            <div className="grid gap-6 md:col-span-3 sm:grid-cols-2">
              {c.whatYouGet.map((item, i) => {
                const Icon = iconMap[item.icon] || Sparkles;
                return (
                  <div
                    key={i}
                    className="rounded-2xl bg-white p-7 shadow-sm shadow-black/5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#108474]/10">
                      <Icon className="h-5 w-5 text-[#108474]" />
                    </div>
                    <h3 className="mb-2 text-base font-bold text-[#1d1d1f]">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-[#515151]">{item.body}</p>
                  </div>
                );
              })}
            </div>
            <div className="relative hidden overflow-hidden rounded-3xl shadow-xl shadow-black/8 md:col-span-2 md:block">
              <Image
                src={`${IMG}/5.webp`}
                alt={l === "sv" ? "Kvinna rör sin hud" : "Woman touching her skin"}
                fill
                className="object-cover"
                sizes="40vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Results Section (image 2) ── */}
      <section className="overflow-hidden py-16 md:py-24">
        <div className="mx-auto grid max-w-[1280px] items-center gap-10 px-6 md:grid-cols-2 md:gap-16 md:px-10">
          <div className="max-w-lg">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#108474]">
              {c.resultsSection.kicker}
            </p>
            <h2 className="text-2xl font-bold leading-tight tracking-tight text-[#1d1d1f] md:text-3xl">
              {c.resultsSection.title}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[#515151]">
              {c.resultsSection.body}
            </p>
            <Link
              href={analysisPath}
              className="mt-8 inline-flex h-[48px] items-center gap-2 rounded-full bg-[#108474] px-8 text-sm font-medium text-white transition-all duration-300 hover:bg-[#0d6e61] hover:shadow-lg"
            >
              {c.ctaButton}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-xl shadow-black/8 md:aspect-square">
            <Image
              src={`${IMG}/2.webp`}
              alt={l === "sv" ? "Kvinna tittar på sina resultat" : "Woman looking at her results"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-[#f5f5f7] py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10">
          <h2 className="mb-10 text-center text-2xl font-bold tracking-tight text-[#1d1d1f] md:text-3xl">
            {c.faqTitle}
          </h2>
          <div className="mx-auto max-w-3xl divide-y divide-[#e6e6e6]">
            {c.faq.map((item, i) => (
              <details key={i} className="group py-5">
                <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-[#1d1d1f]">
                  {item.q}
                  <ChevronDown className="h-5 w-5 shrink-0 text-[#766a62] transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-[#515151]">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10">
          <div className="mx-auto max-w-2xl rounded-3xl bg-[#1d1d1f] px-8 py-14 text-center md:px-16">
            <ScanFace className="mx-auto mb-6 h-12 w-12 text-[#108474]" />
            <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">{c.ctaTitle}</h2>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/70">{c.ctaSub}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href={analysisPath}
                className="inline-flex h-[52px] items-center gap-2 rounded-full bg-[#108474] px-8 text-sm font-medium text-white transition-all duration-300 hover:bg-[#0d6e61]"
              >
                {c.ctaButton}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={productsPath}
                className="inline-flex h-[52px] items-center gap-2 rounded-full border border-white/20 px-8 text-sm font-medium text-white transition-all duration-300 hover:border-white/40 hover:bg-white/5"
              >
                {c.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
