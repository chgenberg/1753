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
    metaTitle: "Gratis AI Hudanalys – Professionell Hudvårdsanalys Online | 1753 SKINCARE",
    metaDescription:
      "Få en gratis, AI-driven hudanalys på 60 sekunder. Vår tränade modell analyserar din hud med samma precision som en hudterapeut. Personaliserade rekommendationer baserat på vetenskap, inte gissningar.",
    kicker: "AI-driven hudanalys",
    h1: "Gratis hudanalys – din hud, analyserad av AI på 60 sekunder",
    lead: "Vår hudanalys kombinerar en specialtränad AI-modell, ditt unika ansiktsscan och livsstilsfrågor för att ge dig en holistisk bild av din hudhälsa. Ingen registrering krävs. Ingen kostnad. Bara vetenskap.",
    statsLabel: ["analyser genomförda", "hudtillstånd analyserade", "sekunder per analys", "nöjda användare"],
    stats: ["12 000+", "14", "~60", "97 %"],
    processTitle: "Så fungerar det – tre steg till din hudanalys",
    steps: [
      {
        icon: "camera",
        title: "1. Scanna ditt ansikte",
        body: "Kameran aktiveras direkt i webbläsaren. Inget laddas upp – vår AI analyserar bilden lokalt på din enhet med ONNX Runtime Web. Din integritet är garanterad.",
      },
      {
        icon: "brain",
        title: "2. Svara på fem frågor",
        body: "Hudtyp, livsstil, sömn, kost och hudmål. Svaren kombineras med ansiktsscannet för att skapa en komplett profil – inte bara vad AI:n ser, utan hela bilden.",
      },
      {
        icon: "sparkles",
        title: "3. Få din personliga analys",
        body: "Du får en hudpoäng (0–100), detaljerad analys av styrkor och svagheter, livsstilsrekommendationer och produktförslag anpassade efter just din hud. Allt på under en minut.",
      },
    ],
    mirrorSection: {
      kicker: "Förstå din hud",
      title: "Din spegel ljuger inte – men den berättar inte hela sanningen",
      body: "Det du ser i spegeln är bara ytan. Under den finns ett komplext samspel mellan mikrobiom, endocannabinoidsystem, hormoner och livsstil. Vår AI ser det du inte kan se – och ger dig verktygen att agera på det.",
    },
    techTitle: "Teknologin bakom analysen",
    techIntro: "Klicka på flikarna för att utforska de fyra pelarna i vår hudanalys.",
    techTabs: [
      {
        id: "model",
        label: "Tränad AI-modell",
        title: "En modell tränad specifikt för hudanalys",
        body: "Vår bildklassificerare är tränad på tusentals bilder av verkliga hudtillstånd – akne, rosacea, hyperpigmentering, fina linjer, dehydrering och mer. Modellen körs som ONNX Runtime Web direkt i din webbläsare, vilket betyder att din ansiktsbild aldrig lämnar din enhet.\n\nModellen identifierar 14 olika hudtillstånd och zonmappar dem till specifika delar av ansiktet: panna, kinder, näsa, haka och ögonområde. Resultatet blir en detaljerad karta över var din hud behöver mest uppmärksamhet.",
        highlights: [
          "14 hudtillstånd identifieras",
          "Zonbaserad analys av fem ansiktsregioner",
          "Körs lokalt – noll data lämnar enheten",
          "ONNX Runtime Web för snabb inferens",
        ],
      },
      {
        id: "fusion",
        label: "Multimodal fusion",
        title: "Tre datakällor – ett holistiskt resultat",
        body: "En bild berättar inte hela historien. Vår analys kombinerar tre datakällor i ett multimodalt fusionssystem:\n\n1. Bildanalys via den tränade modellen (vad kameran ser)\n2. Frågeformulär om livsstil, kost, sömn och stressnivå (vad du berättar)\n3. OpenAI:s vision-modell (GPT-4o) för en holistisk tolkning\n\nResultatet viktas så att livsstilsfaktorer påverkar poängen lika mycket som synliga tillstånd. En person med perfekt hud men dålig sömn och hög stress får en lägre poäng – för att huden till slut kommer att spegla det.",
        highlights: [
          "Bildanalys + livsstil + AI-tolkning",
          "Viktad poäng som fångar hela bilden",
          "Livsstilsfaktorer påverkar 30 % av poängen",
          "GPT-4o för medicinsk grundad holistisk bedömning",
        ],
      },
      {
        id: "tracking",
        label: "Uppföljning över tid",
        title: "Mät din huds utveckling vecka för vecka",
        body: "En enstaka analys ger en ögonblicksbild. Verklig förändring ser du först över tid. Inloggade användare kan spara sina analyser och följa sin hudpoäng i en tidslinje.\n\nVi erbjuder även krypterad bildlagring (AES-256-GCM) för dem som vill se visuell förändring – före och efter-bilder i sitt konto. Alla bilder krypteras med bankstandard och kan raderas med ett klick.",
        highlights: [
          "Hudpoäng-tidslinje i ditt konto",
          "Krypterad bildlagring (AES-256-GCM)",
          "Före/efter-jämförelse",
          "Fullständig kontroll – radera allt med ett klick",
        ],
      },
      {
        id: "privacy",
        label: "Integritet och säkerhet",
        title: "Din data, dina regler",
        body: "Vi har designat hela analysen med integritet som grundprincip:\n\nAnsiktsscannet sker 100 % lokalt i din webbläsare via ONNX Runtime Web – ingen bild laddas upp till våra servrar under scanningsteget. Frågeformuläret kombineras med AI-resultatet och skickas krypterat till OpenAI för den holistiska analysen.\n\nBildlagring är helt valfritt och kräver aktivt samtycke. Bilder krypteras med AES-256-GCM (samma standard som banker använder) innan de sparas. Alla analysdata kan raderas permanent från ditt konto när som helst.",
        highlights: [
          "Ansiktsscan körs 100 % lokalt",
          "Ingen bild laddas upp utan samtycke",
          "AES-256-GCM kryptering för sparade bilder",
          "GDPR-kompatibel – radera allt när som helst",
        ],
      },
    ],
    holisticSection: {
      kicker: "Holistiskt perspektiv",
      title: "Huden speglar hela kroppen",
      body: "Sömn, kost, stress och rörelse påverkar din hud lika mycket som de produkter du använder. Vår analys väger in allt – för att ge dig rekommendationer som faktiskt gör skillnad.",
    },
    conditionsTitle: "Hudtillstånd vi analyserar",
    conditions: [
      "Akne & finnar", "Rosacea & rodnad", "Hyperpigmentering", "Fina linjer & rynkor",
      "Dehydrering", "Stora porer", "Mörka ringar", "Ojämn hudton",
      "Talgöverproduktion", "Solskadad hud", "Känslig hud", "Eksem & irritation",
      "Texturobalans", "Hudens mikrobiom",
    ],
    whatYouGetTitle: "Vad du får i din analys",
    whatYouGet: [
      { icon: "target", title: "Hudpoäng 0–100", body: "En sammanfattande poäng som speglar din hudhälsa – baserad på synliga tillstånd, livsstilsfaktorer och hudens övergripande balans." },
      { icon: "layers", title: "Detaljerad zonanalys", body: "Specifika observationer för varje del av ansiktet: panna, kinder, näsa, haka och ögonområde. Du ser exakt var din hud behöver uppmärksamhet." },
      { icon: "heart", title: "Livsstilsrekommendationer", body: "Personaliserade tips om sömn, kost, stress och rörelse baserat på dina svar. Vi tror att huden speglar hela kroppen." },
      { icon: "leaf", title: "Produktrekommendationer", body: "Max 2–3 produkter som matchar just din hudprofil – aldrig säljigt, alltid relevant. Baserat på dina specifika behov, inte standardpaket." },
    ],
    resultsSection: {
      kicker: "Dina resultat",
      title: "Analysen är bara början",
      body: "Spara dina resultat, följ din utveckling över tid och se hur dina förändringar påverkar din hud. Varje ny analys ger dig en tydligare bild av din hudresa.",
    },
    faqTitle: "Vanliga frågor om hudanalysen",
    faq: [
      { q: "Är hudanalysen verkligen gratis?", a: "Ja, helt gratis och utan registrering. Du kan göra analysen anonymt direkt i webbläsaren. Registrering krävs bara om du vill spara dina resultat och följa din huds utveckling över tid." },
      { q: "Hur exakt är AI-hudanalysen?", a: "Vår modell har tränats på tusentals verifierade hudbilder och uppnår cirka 78–80 procent accuracy på de 14 hudtillstånden. Det motsvarar en erfaren hudterapeuts bedömning vid en visuell inspektion. Den multimodala fusionen med livsstilsdata höjer den kliniska relevansen ytterligare." },
      { q: "Laddas min bild upp till någon server?", a: "Nej. Ansiktsscannet sker 100 procent lokalt i din webbläsare med ONNX Runtime Web. Ingen bild skickas till våra servrar eller tredje part under scanningen. Om du väljer att spara en bild i ditt konto krypteras den med AES-256-GCM innan lagring." },
      { q: "Kan analysen ersätta ett besök hos en hudterapeut?", a: "Nej, och det är inte meningen heller. Vår analys ger en bra första indikation och personaliserade tips, men den ersätter inte en medicinsk bedömning. Vid allvarliga hudproblem rekommenderar vi alltid att du söker professionell hjälp." },
      { q: "Vad är skillnaden mellan er analys och andra online-hudanalyser?", a: "De flesta online-hudanalyser är enkla quiz utan bildanalys, eller använder generiska modeller. Vår analys kombinerar en specialtränad bildklassificerare (14 tillstånd, 5 ansiktszoner), livsstilsdata och GPT-4o:s medicinska kunskap i ett multimodalt fusionssystem. Det ger en holistisk bild som går långt bortom vad en enkel selfie-analys kan erbjuda." },
      { q: "Hur lång tid tar analysen?", a: "Hela processen tar cirka 60 sekunder: ansiktsscan (10 sekunder), fem frågor (30 sekunder) och AI-analys (20 sekunder). Du har ditt resultat på under en minut." },
      { q: "Fungerar det på mobilen?", a: "Ja, analysen är helt optimerad för mobil. Frontkameran fungerar utmärkt, och hela upplevelsen är designad mobile-first." },
    ],
    ctaTitle: "Redo att förstå din hud?",
    ctaSub: "60 sekunder. Gratis. Ingen registrering. Bara vetenskap och din hud.",
    ctaButton: "Starta gratis hudanalys",
    ctaSecondary: "Läs mer om vår hudvård",
  },
  en: {
    metaTitle: "Free AI Skin Analysis – Professional Skincare Analysis Online | 1753 SKINCARE",
    metaDescription:
      "Get a free, AI-powered skin analysis in 60 seconds. Our trained model analyses your skin with the precision of a dermatologist. Personalised recommendations based on science, not guesswork.",
    kicker: "AI-powered skin analysis",
    h1: "Free skin analysis – your skin, analysed by AI in 60 seconds",
    lead: "Our skin analysis combines a purpose-trained AI model, your unique face scan, and lifestyle questions to give you a holistic picture of your skin health. No sign-up required. No cost. Just science.",
    statsLabel: ["analyses completed", "skin conditions analysed", "seconds per analysis", "satisfied users"],
    stats: ["12,000+", "14", "~60", "97%"],
    processTitle: "How it works – three steps to your skin analysis",
    steps: [
      { icon: "camera", title: "1. Scan your face", body: "The camera activates directly in your browser. Nothing is uploaded – our AI analyses the image locally on your device using ONNX Runtime Web. Your privacy is guaranteed." },
      { icon: "brain", title: "2. Answer five questions", body: "Skin type, lifestyle, sleep, diet, and skin goals. Your answers are combined with the face scan to create a complete profile – not just what the AI sees, but the full picture." },
      { icon: "sparkles", title: "3. Get your personal analysis", body: "You receive a skin score (0–100), detailed analysis of strengths and weaknesses, lifestyle recommendations, and product suggestions tailored to your skin. All in under a minute." },
    ],
    mirrorSection: {
      kicker: "Understand your skin",
      title: "Your mirror doesn't lie – but it doesn't tell the whole truth",
      body: "What you see in the mirror is only the surface. Beneath it lies a complex interplay of microbiome, endocannabinoid system, hormones, and lifestyle. Our AI sees what you can't – and gives you the tools to act on it.",
    },
    techTitle: "The technology behind the analysis",
    techIntro: "Click the tabs to explore the four pillars of our skin analysis.",
    techTabs: [
      {
        id: "model", label: "Trained AI model", title: "A model trained specifically for skin analysis",
        body: "Our image classifier has been trained on thousands of images of real skin conditions – acne, rosacea, hyperpigmentation, fine lines, dehydration, and more. The model runs as ONNX Runtime Web directly in your browser, meaning your face image never leaves your device.\n\nThe model identifies 14 different skin conditions and zone-maps them to specific areas of the face: forehead, cheeks, nose, chin, and eye area. The result is a detailed map of where your skin needs the most attention.",
        highlights: ["14 skin conditions identified", "Zone-based analysis of five facial regions", "Runs locally – zero data leaves your device", "ONNX Runtime Web for fast inference"],
      },
      {
        id: "fusion", label: "Multimodal fusion", title: "Three data sources – one holistic result",
        body: "A photo doesn't tell the whole story. Our analysis combines three data sources in a multimodal fusion system:\n\n1. Image analysis via the trained model (what the camera sees)\n2. Lifestyle questionnaire about diet, sleep, and stress levels (what you tell us)\n3. OpenAI's vision model (GPT-4o) for holistic interpretation\n\nThe result is weighted so lifestyle factors influence the score as much as visible conditions. Someone with flawless skin but poor sleep and high stress receives a lower score – because the skin will eventually reflect it.",
        highlights: ["Image analysis + lifestyle + AI interpretation", "Weighted score that captures the full picture", "Lifestyle factors account for 30% of the score", "GPT-4o for medically-grounded holistic assessment"],
      },
      {
        id: "tracking", label: "Tracking over time", title: "Measure your skin's progress week by week",
        body: "A single analysis gives you a snapshot. Real change becomes visible over time. Logged-in users can save their analyses and track their skin score on a timeline.\n\nWe also offer encrypted photo storage (AES-256-GCM) for those who want to see visual change – before and after photos in their account. All images are encrypted to banking standards and can be deleted with one click.",
        highlights: ["Skin score timeline in your account", "Encrypted photo storage (AES-256-GCM)", "Before/after comparison", "Full control – delete everything with one click"],
      },
      {
        id: "privacy", label: "Privacy and security", title: "Your data, your rules",
        body: "We designed the entire analysis with privacy as the core principle:\n\nThe face scan runs 100% locally in your browser via ONNX Runtime Web – no image is uploaded to our servers during scanning. The questionnaire is combined with the AI result and sent encrypted to OpenAI for the holistic analysis.\n\nPhoto storage is entirely optional and requires active consent. Images are encrypted with AES-256-GCM (the same standard banks use) before storage. All analysis data can be permanently deleted from your account at any time.",
        highlights: ["Face scan runs 100% locally", "No image uploaded without consent", "AES-256-GCM encryption for saved photos", "GDPR-compliant – delete everything at any time"],
      },
    ],
    holisticSection: {
      kicker: "Holistic perspective",
      title: "Your skin mirrors your whole body",
      body: "Sleep, diet, stress, and movement affect your skin just as much as the products you use. Our analysis weighs everything – to give you recommendations that actually make a difference.",
    },
    conditionsTitle: "Skin conditions we analyse",
    conditions: [
      "Acne & breakouts", "Rosacea & redness", "Hyperpigmentation", "Fine lines & wrinkles",
      "Dehydration", "Enlarged pores", "Dark circles", "Uneven skin tone",
      "Excess oil production", "Sun-damaged skin", "Sensitive skin", "Eczema & irritation",
      "Texture imbalance", "Skin microbiome",
    ],
    whatYouGetTitle: "What you get in your analysis",
    whatYouGet: [
      { icon: "target", title: "Skin score 0–100", body: "A comprehensive score reflecting your skin health – based on visible conditions, lifestyle factors, and your skin's overall balance." },
      { icon: "layers", title: "Detailed zone analysis", body: "Specific observations for each part of the face: forehead, cheeks, nose, chin, and eye area. You see exactly where your skin needs attention." },
      { icon: "heart", title: "Lifestyle recommendations", body: "Personalised tips on sleep, diet, stress, and exercise based on your answers. We believe skin reflects the whole body." },
      { icon: "leaf", title: "Product recommendations", body: "Up to 2–3 products matched to your specific skin profile – never pushy, always relevant. Based on your actual needs, not standard packages." },
    ],
    resultsSection: {
      kicker: "Your results",
      title: "The analysis is just the beginning",
      body: "Save your results, track your progress over time, and see how your changes affect your skin. Every new analysis gives you a clearer picture of your skin journey.",
    },
    faqTitle: "Frequently asked questions about the skin analysis",
    faq: [
      { q: "Is the skin analysis really free?", a: "Yes, completely free with no sign-up required. You can do the analysis anonymously right in your browser. Registration is only needed if you want to save your results and track your skin's progress over time." },
      { q: "How accurate is the AI skin analysis?", a: "Our model has been trained on thousands of verified skin images and achieves approximately 78–80 percent accuracy across the 14 skin conditions. This matches an experienced aesthetician's assessment during a visual inspection. The multimodal fusion with lifestyle data further increases clinical relevance." },
      { q: "Is my photo uploaded to a server?", a: "No. The face scan runs 100 percent locally in your browser using ONNX Runtime Web. No image is sent to our servers or third parties during scanning. If you choose to save a photo to your account, it is encrypted with AES-256-GCM before storage." },
      { q: "Can the analysis replace a visit to a dermatologist?", a: "No, and it's not meant to. Our analysis provides a solid initial indication and personalised tips, but it doesn't replace a medical assessment. For serious skin concerns, we always recommend seeking professional help." },
      { q: "What sets your analysis apart from other online skin analyses?", a: "Most online skin analyses are simple quizzes without image analysis, or use generic models. Our analysis combines a purpose-trained image classifier (14 conditions, 5 facial zones), lifestyle data, and GPT-4o's medical knowledge in a multimodal fusion system. This delivers a holistic picture far beyond what a simple selfie analysis can offer." },
      { q: "How long does the analysis take?", a: "The entire process takes about 60 seconds: face scan (10 seconds), five questions (30 seconds), and AI analysis (20 seconds). You have your result in under a minute." },
      { q: "Does it work on mobile?", a: "Yes, the analysis is fully optimised for mobile. The front camera works perfectly, and the entire experience is designed mobile-first." },
    ],
    ctaTitle: "Ready to understand your skin?",
    ctaSub: "60 seconds. Free. No sign-up. Just science and your skin.",
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
        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-6 px-6 md:grid-cols-4 md:px-10">
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
