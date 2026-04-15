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
import { HeroVideo } from "@/components/hero-video";

const BASE_URL = "https://www.1753skin.com";
const IMG = "/Landing_page_skinanalys";

const OG_LOCALE: Record<string, string> = { sv: "sv_SE", en: "en_US", es: "es_ES", de: "de_DE", fr: "fr_FR" };

function tx(locale: string, sv: string, en: string, es?: string, de?: string, fr?: string): string {
  if (locale === "sv") return sv;
  if (locale === "es") return es || en;
  if (locale === "de") return de || en;
  if (locale === "fr") return fr || en;
  return en;
}

const content = {
  sv: {
    metaTitle: "Gratis AI Hudanalys – 15 Hudmetriker, Hudålder och Personlig Rutin | 1753 SKINCARE",
    metaDescription:
      "Få en gratis AI-hudanalys med 15 vetenskapliga hudmetriker, estimerad hudålder, radardiagram och personliga rekommendationer. MediaPipe-precision i 12 ansiktszoner. Under 60 sekunder.",
    kicker: "Avancerad AI-hudanalys",
    h1: "Gratis hudanalys – 15 metriker, hudålder och radardiagram på 60 sekunder",
    lead: "Vår hudanalys kombinerar en specialtränad AI-modell (90 000+ träningsbilder), MediaPipe ansiktslandmarken i 12 zoner och livsstilsfrågor för att ge dig en komplett bild av din hudhälsa. 15 vetenskapliga metriker, biologisk hudålder jämförd med din kronologiska ålder, Fitzpatrick-typ och ett interaktivt radardiagram. Ett konto skapas automatiskt. Ingen kostnad.",
    statsLabel: ["träningsbilder i modellen", "hudmetriker analyserade", "ansiktszoner kartlagda"],
    stats: ["90 000+", "15", "12"],
    processTitle: "Så fungerar det – tre steg till din hudanalys",
    steps: [
      {
        icon: "camera",
        title: "1. Scanna ditt ansikte",
        body: "Kameran aktiveras direkt i webbläsaren. MediaPipe Face Landmarker identifierar 478 ansiktspunkter och delar in ditt ansikte i 12 precisa zoner – panna, kinder, näsa, haka, ögonområde, käklinje, T-zon och fler. Allt sker lokalt på din enhet.",
      },
      {
        icon: "brain",
        title: "2. Ange ålder, kön och svara på sju frågor",
        body: "Ålder och kön hjälper oss kalibrerat analysen. Sedan sju frågor om hudtyp, livsstil, sömn, kost, hudmål, solvanor och hormonell påverkan. Svaren kombineras med ansiktsscannet och zonbilderna för att skapa en komplett profil – inte bara vad AI:n ser, utan hela bilden.",
      },
      {
        icon: "sparkles",
        title: "3. Få din personliga analys",
        body: "Du får 15 detaljerade hudmetriker med poäng och betyg, en biologisk hudålder jämförd med din kronologiska ålder, Fitzpatrick-hudtyp, interaktivt radardiagram, detaljerad zonanalys med klickbara markörer på ditt ansikte, livsstilsrekommendationer och produktförslag. Ett konto skapas automatiskt så du kan följa din hudresa och göra en ny analys varje månad.",
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
        body: "Vår bildklassificerare är tränad på över 90 000 verifierade hudbilder – akne, rosacea, hyperpigmentering, torr hud, solskador, eksem, svamp och mer. Modellen körs som ONNX Runtime Web direkt i din webbläsare.\n\nMediaPipe Face Landmarker identifierar 478 ansiktspunkter och skapar 12 exakta ansiktszoner: panna, vänster och höger kind, näsa, haka, ögonområden, T-zon, nasolabialveck, munområde och käklinje. Varje zon analyseras individuellt och skickas som precisionsbilder till GPT-5.4 för djupanalys.",
        highlights: [
          "90 000+ träningsbilder med kvalitetskontroll",
          "MediaPipe Face Landmarker med 478 landmärken",
          "12 precisa ansiktszoner analyserade individuellt",
          "Körs lokalt – noll data lämnar enheten under scanning",
        ],
      },
      {
        id: "fusion",
        label: "Multimodal fusion",
        title: "Fyra datakällor – 15 metriker – ett holistiskt resultat",
        body: "Vår analys kombinerar fyra datakällor i ett multimodalt fusionssystem:\n\n1. ONNX-modellen klassificerar varje zon lokalt (vad kameran ser)\n2. MediaPipe beskär 12 ansiktszoner med kirurgisk precision\n3. Dina livsstilssvar om kost, sömn och stress (vad du berättar)\n4. GPT-5.4 Vision analyserar helbilden + zonbilder holistiskt\n\nResultatet: 15 vetenskapliga hudmetriker (rynkor, porer, pigmentering, rodnad, textur, mörka ringar, fasthet, fukt, hudton, akne, känslighet, solskador, elasticitet, lyster och barriärhälsa) – varje metrik med poäng 0–100, betyg och förklaring. Plus en estimerad hudålder och Fitzpatrick-hudtyp.",
        highlights: [
          "4 datakällor: ONNX + MediaPipe + livsstil + GPT-5.4",
          "15 individuella hudmetriker med poäng och betyg",
          "Estimerad hudålder baserad på visuell bedömning",
          "Fitzpatrick-hudtyp för personaliserade rekommendationer",
        ],
      },
      {
        id: "tracking",
        label: "Uppföljning över tid",
        title: "Följ alla 15 metriker vecka för vecka",
        body: "En enstaka analys ger en ögonblicksbild. Verklig förändring ser du först över tid. Du kan göra en ny analys en gång per månad och spara alla 15 metriker, hudålder och hudpoäng i en tidslinje.\n\nSe hur specifika metriker som fukt, elasticitet eller lyster förbättras när du ändrar din rutin. Vi erbjuder även krypterad bildlagring (AES-256-GCM) för visuell före/efter-jämförelse. Alla bilder krypteras med bankstandard och kan raderas med ett klick.",
        highlights: [
          "Historik för alla 15 metriker och hudålder",
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
      "Endocannabinoidsystemet", "Estimerad hudålder",
    ],
    whatYouGetTitle: "Vad du får i din analys",
    whatYouGet: [
      { icon: "target", title: "15 hudmetriker med poäng", body: "Varje metrik – från fukt och elasticitet till lyster och barriärhälsa – utvärderas med poäng 0–100, betyg (1–5) och en personlig förklaring. Presenterat i ett interaktivt radardiagram." },
      { icon: "layers", title: "12-zons ansiktsanalys", body: "MediaPipe identifierar 478 ansiktspunkter och skapar 12 exakta zoner. Varje zon analyseras individuellt – du ser exakt var din hud behöver mest uppmärksamhet." },
      { icon: "heart", title: "Hudålder och Fitzpatrick-typ", body: "Få en estimerad hudålder baserad på visuell bedömning och din Fitzpatrick-hudtyp för mer precisa rekommendationer anpassade efter just din hud." },
      { icon: "leaf", title: "Rutin, livsstil och produkter", body: "Personlig morgon- och kvällsrutin, livsstilsrekommendationer för sömn, kost, stress och rörelse, plus 2–3 produkter matchade mot din hudprofil med 15 % rabatt." },
    ],
    resultsSection: {
      kicker: "Dina resultat",
      title: "Analysen är bara början",
      body: "Spara dina 15 metriker, följ din hudålder och se radardiagrammet utvecklas över tid. Du kan göra en ny analys varje månad – varje gång får du en tydligare bild av din hudresa och ser vilka förändringar som faktiskt gör skillnad.",
    },
    faqTitle: "Vanliga frågor om hudanalysen",
    faq: [
      { q: "Är hudanalysen verkligen gratis?", a: "Ja, helt gratis. Ett konto skapas automatiskt så att du kan spara dina 15 metriker och följa din huds utveckling över tid." },
      { q: "Vad mäter de 15 metrikerna?", a: "Vi utvärderar rynkor, porer, pigmentering, rodnad, textur, mörka ringar, fasthet, fukt, hudton, akne, känslighet, solskador, elasticitet, lyster och barriärhälsa. Varje metrik får ett poäng 0–100 och betyg. Resultatet visas i ett interaktivt radardiagram." },
      { q: "Hur fungerar hudålder-estimeringen?", a: "GPT-5.4 Vision analyserar din hud visuellt och estimerar en hudålder baserad på synliga tecken som rynkor, elasticitet, textur och pigmentering. Det är inte en medicinsk diagnos utan en indikation som hjälper dig förstå din huds tillstånd." },
      { q: "Vad är MediaPipe Face Landmarker?", a: "MediaPipe är Googles teknologi för ansiktsigenkänning. Den identifierar 478 tredimensionella punkter på ditt ansikte och skapar 12 exakta zoner som analyseras individuellt. Allt sker lokalt i din webbläsare – ingen data skickas till Google." },
      { q: "Laddas min bild upp till någon server?", a: "Scanningen och MediaPipe-analysen sker 100 procent lokalt. Zonbilderna skickas krypterat till GPT-5.4 för den holistiska analysen. Om du väljer att spara en bild i ditt konto krypteras den med AES-256-GCM innan lagring." },
      { q: "Kan analysen ersätta ett besök hos en hudterapeut?", a: "Nej, och det är inte meningen heller. Vår analys ger en detaljerad första indikation med 15 metriker och personaliserade tips, men den ersätter inte en medicinsk bedömning. Vid allvarliga hudproblem rekommenderar vi alltid professionell hjälp." },
      { q: "Vad skiljer er analys från andra online-hudanalyser?", a: "De flesta online-hudanalyser ger ett enkelt svar baserat på en selfie. Vår analys kombinerar en specialtränad ONNX-modell (90 000+ träningsbilder), MediaPipe Face Landmarker (12 ansiktszoner), livsstilsdata och GPT-5.4 Vision i ett multimodalt system. Resultatet: 15 individuella hudmetriker, biologisk hudålder, Fitzpatrick-typ, radardiagram och personlig rutin." },
      { q: "Hur lång tid tar analysen?", a: "Hela processen tar cirka 60 sekunder: ansiktsscan med MediaPipe (10 sekunder), sju frågor (40 sekunder) och AI-analys med GPT-5.4 (20 sekunder)." },
      { q: "Fungerar det på mobilen?", a: "Ja, analysen är helt optimerad för mobil. MediaPipe fungerar utmärkt med frontkameran, och hela upplevelsen är designad mobile-first med responsiva resultat." },
    ],
    ctaTitle: "Redo att förstå din hud?",
    ctaSub: "15 metriker. Hudålder. Radardiagram. Gratis. Under 60 sekunder.",
    ctaButton: "Starta gratis hudanalys",
    ctaSecondary: "Läs mer om vår hudvård",
    videoLabel: "Se hur det fungerar",
    videoPosterAlt: "Resultat från AI-hudanalysen med poängring och metriker",
  },
  en: {
    metaTitle: "Free AI Skin Analysis – 15 Skin Metrics, Skin Age and Personal Routine | 1753 SKINCARE",
    metaDescription:
      "Get a free AI skin analysis with 15 scientific skin metrics, estimated skin age, radar chart and personalised recommendations. MediaPipe precision across 12 facial zones. Under 60 seconds.",
    kicker: "Advanced AI skin analysis",
    h1: "Free skin analysis – 15 metrics, skin age and radar chart in 60 seconds",
    lead: "Our skin analysis combines a purpose-trained AI model (90,000+ training images), MediaPipe face landmarks across 12 zones, and lifestyle questions to give you a complete picture of your skin health. 15 scientific metrics, biological skin age compared to your chronological age, Fitzpatrick type and an interactive radar chart. An account is automatically created. No cost.",
    statsLabel: ["training images in our model", "skin metrics analysed", "facial zones mapped"],
    stats: ["90,000+", "15", "12"],
    processTitle: "How it works – three steps to your skin analysis",
    steps: [
      { icon: "camera", title: "1. Scan your face", body: "The camera activates directly in your browser. MediaPipe Face Landmarker identifies 478 facial points and divides your face into 12 precise zones – forehead, cheeks, nose, chin, eye area, jawline, T-zone and more. Everything runs locally on your device." },
      { icon: "brain", title: "2. Enter age, gender and answer seven questions", body: "Age and gender help calibrate the analysis. Then seven questions about skin type, lifestyle, sleep, diet, skin goals, sun habits and hormonal influence. Your answers are combined with the face scan and zone images to create a complete profile – not just what the AI sees, but the full picture." },
      { icon: "sparkles", title: "3. Get your personal analysis", body: "You receive 15 detailed skin metrics with scores and grades, a biological skin age compared to your chronological age, Fitzpatrick skin type, interactive radar chart, detailed zone analysis with clickable markers on your face, lifestyle recommendations and product suggestions. An account is automatically created so you can track your skin journey and run a new analysis every month." },
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
        body: "Our image classifier has been trained on over 90,000 verified skin images – acne, rosacea, hyperpigmentation, dry skin, sun damage, eczema, dermatitis, psoriasis and more. The model runs as ONNX Runtime Web directly in your browser.\n\nMediaPipe Face Landmarker identifies 478 facial points and creates 12 precise facial zones: forehead, left and right cheek, nose, chin, eye areas, T-zone, nasolabial folds, mouth area and jawline. Each zone is analysed individually and sent as precision images to GPT-5.4 for deep analysis.",
        highlights: ["90,000+ training images with quality control", "MediaPipe Face Landmarker with 478 landmarks", "12 precise facial zones analysed individually", "Runs locally – zero data leaves your device during scanning"],
      },
      {
        id: "fusion", label: "Multimodal fusion", title: "Four data sources – 15 metrics – one holistic result",
        body: "Our analysis combines four data sources in a multimodal fusion system:\n\n1. The ONNX model classifies each zone locally (what the camera sees)\n2. MediaPipe crops 12 facial zones with surgical precision\n3. Your lifestyle answers about diet, sleep and stress (what you tell us)\n4. GPT-5.4 Vision analyses the full image + zone images holistically\n\nThe result: 15 scientific skin metrics (wrinkles, pores, pigmentation, redness, texture, dark circles, firmness, hydration, skin tone, acne, sensitivity, sun damage, elasticity, radiance and barrier health) – each metric with a score of 0–100, a grade and an explanation. Plus an estimated skin age and Fitzpatrick skin type.",
        highlights: ["4 data sources: ONNX + MediaPipe + lifestyle + GPT-5.4", "15 individual skin metrics with scores and grades", "Estimated skin age based on visual assessment", "Fitzpatrick skin type for personalised recommendations"],
      },
      {
        id: "tracking", label: "Tracking over time", title: "Track all 15 metrics week by week",
        body: "A single analysis gives you a snapshot. Real change becomes visible over time. You can run a new analysis once per month and save all 15 metrics, skin age and skin score on a timeline.\n\nSee how specific metrics like hydration, elasticity or radiance improve when you change your routine. We also offer encrypted photo storage (AES-256-GCM) for visual before/after comparison. All images are encrypted to banking standards and can be deleted with one click.",
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
      body: "Save your 15 metrics, track your skin age and watch the radar chart evolve over time. You can run a new analysis every month – each time you get a clearer picture of your skin journey and see which changes actually make a difference.",
    },
    faqTitle: "Frequently asked questions about the skin analysis",
    faq: [
      { q: "Is the skin analysis really free?", a: "Yes, completely free. An account is automatically created so you can save your 15 metrics and track your skin's progress over time." },
      { q: "What do the 15 metrics measure?", a: "We evaluate wrinkles, pores, pigmentation, redness, texture, dark circles, firmness, hydration, skin tone, acne, sensitivity, sun damage, elasticity, radiance and barrier health. Each metric receives a score of 0–100 and a grade. Results are displayed in an interactive radar chart." },
      { q: "How does the skin age estimation work?", a: "GPT-5.4 Vision analyses your skin visually and estimates a skin age based on visible signs like wrinkles, elasticity, texture and pigmentation. It's not a medical diagnosis but an indication that helps you understand your skin's condition." },
      { q: "What is MediaPipe Face Landmarker?", a: "MediaPipe is Google's facial recognition technology. It identifies 478 three-dimensional points on your face and creates 12 precise zones that are analysed individually. Everything runs locally in your browser – no data is sent to Google." },
      { q: "Is my photo uploaded to a server?", a: "The scan and MediaPipe analysis run 100 percent locally. Zone images are sent encrypted to GPT-5.4 for holistic analysis. If you choose to save a photo to your account, it is encrypted with AES-256-GCM before storage." },
      { q: "Can the analysis replace a visit to a dermatologist?", a: "No, and it's not meant to. Our analysis provides a detailed first indication with 15 metrics and personalised tips, but it doesn't replace a medical assessment. For serious skin concerns, we always recommend seeking professional help." },
      { q: "What sets your analysis apart from other online skin analyses?", a: "Most online skin analyses give a simple answer based on a selfie. Our analysis combines a purpose-trained ONNX model (90,000+ training images), MediaPipe Face Landmarker (12 facial zones), lifestyle data and GPT-5.4 Vision in a multimodal system. The result: 15 individual skin metrics, biological skin age, Fitzpatrick type, radar chart and a personal routine." },
      { q: "How long does the analysis take?", a: "The entire process takes about 60 seconds: face scan with MediaPipe (10 seconds), seven questions (40 seconds), and AI analysis with GPT-5.4 (20 seconds)." },
      { q: "Does it work on mobile?", a: "Yes, the analysis is fully optimised for mobile. MediaPipe works perfectly with the front camera, and the entire experience is designed mobile-first with responsive results." },
    ],
    ctaTitle: "Ready to understand your skin?",
    ctaSub: "15 metrics. Skin age. Radar chart. Free. Under 60 seconds.",
    ctaButton: "Start free skin analysis",
    ctaSecondary: "Learn more about our skincare",
    videoLabel: "See how it works",
    videoPosterAlt: "AI skin analysis results showing score ring and metrics",
  },
  es: {
    metaTitle: "Análisis de Piel con IA Gratis – 15 Métricas, Edad de la Piel y Rutina Personalizada | 1753 SKINCARE",
    metaDescription:
      "Obtén un análisis de piel con IA gratis con 15 métricas científicas, edad estimada de la piel, gráfico radar y recomendaciones personalizadas. Precisión MediaPipe en 12 zonas faciales. En menos de 60 segundos.",
    kicker: "Análisis de piel con IA avanzada",
    h1: "Análisis de piel gratis – 15 métricas, edad de la piel y gráfico radar en 60 segundos",
    lead: "Nuestro análisis de piel combina un modelo de IA entrenado específicamente (90.000+ imágenes de entrenamiento), landmarks faciales de MediaPipe en 12 zonas y preguntas sobre tu estilo de vida para darte una imagen completa de la salud de tu piel. 15 métricas científicas, edad biológica de la piel comparada con tu edad cronológica, tipo Fitzpatrick y un gráfico radar interactivo. Se crea automáticamente una cuenta. Sin coste.",
    statsLabel: ["imágenes de entrenamiento en nuestro modelo", "métricas de piel analizadas", "zonas faciales mapeadas"],
    stats: ["90.000+", "15", "12"],
    processTitle: "Cómo funciona – tres pasos para tu análisis de piel",
    steps: [
      { icon: "camera", title: "1. Escanea tu rostro", body: "La cámara se activa directamente en tu navegador. MediaPipe Face Landmarker identifica 478 puntos faciales y divide tu rostro en 12 zonas precisas – frente, mejillas, nariz, mentón, zona ocular, mandíbula, zona T y más. Todo se ejecuta localmente en tu dispositivo." },
      { icon: "brain", title: "2. Introduce edad, género y responde siete preguntas", body: "La edad y el género ayudan a calibrar el análisis. Luego siete preguntas sobre tipo de piel, estilo de vida, sueño, alimentación, objetivos de piel, hábitos solares e influencia hormonal. Tus respuestas se combinan con el escaneo facial y las imágenes zonales para crear un perfil completo – no solo lo que la IA ve, sino la imagen completa." },
      { icon: "sparkles", title: "3. Obtén tu análisis personalizado", body: "Recibes 15 métricas detalladas de la piel con puntuaciones y calificaciones, una edad biológica de la piel comparada con tu edad cronológica, tipo de piel Fitzpatrick, gráfico radar interactivo, análisis detallado por zonas con marcadores clicables en tu rostro, recomendaciones de estilo de vida y sugerencias de productos. Se crea automáticamente una cuenta para que puedas seguir tu viaje de piel y hacer un nuevo análisis cada mes." },
    ],
    mirrorSection: {
      kicker: "Entiende tu piel en profundidad",
      title: "Tu espejo no miente – pero no te cuenta toda la verdad",
      body: "Lo que ves en el espejo es solo la superficie. Debajo hay una interacción compleja entre microbioma, sistema endocannabinoide, hormonas y estilo de vida. Nuestra IA mide 15 aspectos separados de tu piel – desde la hidratación y elasticidad hasta la luminosidad y la salud de la barrera – y te da las herramientas para actuar.",
    },
    techTitle: "La tecnología detrás del análisis",
    techIntro: "Haz clic en las pestañas para explorar los cuatro pilares de nuestro análisis de piel.",
    techTabs: [
      {
        id: "model", label: "Modelo de IA entrenado", title: "Modelo entrenado específicamente + precisión MediaPipe",
        body: "Nuestro clasificador de imágenes ha sido entrenado con más de 90.000 imágenes de piel verificadas – acné, rosácea, hiperpigmentación, piel seca, daño solar, eccema, dermatitis, psoriasis y más. El modelo se ejecuta como ONNX Runtime Web directamente en tu navegador.\n\nMediaPipe Face Landmarker identifica 478 puntos faciales y crea 12 zonas faciales precisas: frente, mejilla izquierda y derecha, nariz, mentón, zonas oculares, zona T, surcos nasolabiales, zona de la boca y mandíbula. Cada zona se analiza individualmente y se envía como imágenes de precisión a GPT-5.4 para un análisis profundo.",
        highlights: ["90.000+ imágenes de entrenamiento con control de calidad", "MediaPipe Face Landmarker con 478 landmarks", "12 zonas faciales precisas analizadas individualmente", "Se ejecuta localmente – cero datos salen de tu dispositivo durante el escaneo"],
      },
      {
        id: "fusion", label: "Fusión multimodal", title: "Cuatro fuentes de datos – 15 métricas – un resultado holístico",
        body: "Nuestro análisis combina cuatro fuentes de datos en un sistema de fusión multimodal:\n\n1. El modelo ONNX clasifica cada zona localmente (lo que ve la cámara)\n2. MediaPipe recorta 12 zonas faciales con precisión quirúrgica\n3. Tus respuestas sobre alimentación, sueño y estrés (lo que nos cuentas)\n4. GPT-5.4 Vision analiza la imagen completa + imágenes zonales de forma holística\n\nEl resultado: 15 métricas científicas de la piel (arrugas, poros, pigmentación, enrojecimiento, textura, ojeras, firmeza, hidratación, tono de piel, acné, sensibilidad, daño solar, elasticidad, luminosidad y salud de la barrera) – cada métrica con puntuación de 0–100, calificación y explicación. Además de una edad estimada de la piel y tipo de piel Fitzpatrick.",
        highlights: ["4 fuentes de datos: ONNX + MediaPipe + estilo de vida + GPT-5.4", "15 métricas individuales de la piel con puntuaciones y calificaciones", "Edad estimada de la piel basada en evaluación visual", "Tipo de piel Fitzpatrick para recomendaciones personalizadas"],
      },
      {
        id: "tracking", label: "Seguimiento en el tiempo", title: "Sigue las 15 métricas semana a semana",
        body: "Un solo análisis te da una instantánea. El cambio real se ve con el tiempo. Puedes hacer un nuevo análisis una vez al mes y guardar las 15 métricas, la edad de la piel y la puntuación en una línea temporal.\n\nObserva cómo métricas específicas como hidratación, elasticidad o luminosidad mejoran cuando cambias tu rutina. También ofrecemos almacenamiento de fotos cifrado (AES-256-GCM) para comparaciones visuales antes/después. Todas las imágenes se cifran con estándar bancario y se pueden eliminar con un clic.",
        highlights: ["Historial de las 15 métricas y edad de la piel", "Gráfico radar que muestra el progreso a lo largo del tiempo", "Almacenamiento de fotos cifrado (AES-256-GCM)", "Control total – elimina todo con un clic"],
      },
      {
        id: "privacy", label: "Privacidad y seguridad", title: "Tus datos, tus reglas",
        body: "Hemos diseñado todo el análisis con la privacidad como principio fundamental:\n\nEl escaneo facial y el análisis de MediaPipe se ejecutan 100 % localmente en tu navegador – ninguna imagen sale de tu dispositivo durante el escaneo. Las imágenes zonales y el cuestionario se envían cifrados a GPT-5.4 para el análisis holístico.\n\nEl almacenamiento de fotos es completamente opcional y requiere consentimiento activo. Las imágenes se cifran con AES-256-GCM antes del almacenamiento. Todos los datos del análisis se pueden eliminar permanentemente de tu cuenta en cualquier momento.",
        highlights: ["Escaneo y MediaPipe se ejecutan 100 % localmente", "Ninguna imagen se sube sin consentimiento", "Cifrado AES-256-GCM para fotos guardadas", "Compatible con GDPR – elimina todo en cualquier momento"],
      },
    ],
    holisticSection: {
      kicker: "Perspectiva holística",
      title: "Tu piel refleja todo tu cuerpo",
      body: "El sueño, la alimentación, el estrés y el ejercicio afectan tu piel tanto como los productos que usas. Nuestro análisis lo tiene todo en cuenta – y lo cuantifica en 15 métricas separadas para que veas exactamente qué necesita atención.",
    },
    conditionsTitle: "Qué medimos y analizamos",
    conditions: [
      "Arrugas y líneas finas", "Poros y textura", "Pigmentación", "Enrojecimiento y rosácea",
      "Textura de la piel", "Ojeras", "Firmeza y tono", "Hidratación y humedad",
      "Uniformidad del tono", "Acné y brotes", "Sensibilidad", "Daño solar",
      "Elasticidad", "Luminosidad y brillo", "Salud de la barrera", "Microbioma de la piel",
      "Sistema endocannabinoide", "Edad estimada de la piel",
    ],
    whatYouGetTitle: "Qué obtienes en tu análisis",
    whatYouGet: [
      { icon: "target", title: "15 métricas de piel con puntuación", body: "Cada métrica – desde hidratación y elasticidad hasta luminosidad y salud de la barrera – se evalúa con una puntuación de 0–100, una calificación (1–5) y una explicación personalizada. Presentado en un gráfico radar interactivo." },
      { icon: "layers", title: "Análisis facial de 12 zonas", body: "MediaPipe identifica 478 puntos faciales y crea 12 zonas precisas. Cada zona se analiza individualmente – ves exactamente dónde tu piel necesita más atención." },
      { icon: "heart", title: "Edad de la piel y tipo Fitzpatrick", body: "Obtén una edad estimada de la piel basada en evaluación visual y tu tipo de piel Fitzpatrick para recomendaciones más precisas adaptadas a tu piel." },
      { icon: "leaf", title: "Rutina, estilo de vida y productos", body: "Rutina personalizada de mañana y noche, recomendaciones de estilo de vida para sueño, alimentación, estrés y ejercicio, más 2–3 productos adaptados a tu perfil de piel con 15 % de descuento." },
    ],
    resultsSection: {
      kicker: "Tus resultados",
      title: "El análisis es solo el comienzo",
      body: "Guarda tus 15 métricas, sigue la edad de tu piel y observa cómo el gráfico radar evoluciona con el tiempo. Puedes hacer un nuevo análisis cada mes – cada vez obtienes una imagen más clara de tu viaje con la piel y ves qué cambios realmente marcan la diferencia.",
    },
    faqTitle: "Preguntas frecuentes sobre el análisis de piel",
    faq: [
      { q: "¿El análisis de piel es realmente gratis?", a: "Sí, completamente gratis. Se crea automáticamente una cuenta para que puedas guardar tus 15 métricas y seguir el progreso de tu piel a lo largo del tiempo." },
      { q: "¿Qué miden las 15 métricas?", a: "Evaluamos arrugas, poros, pigmentación, enrojecimiento, textura, ojeras, firmeza, hidratación, tono de piel, acné, sensibilidad, daño solar, elasticidad, luminosidad y salud de la barrera. Cada métrica recibe una puntuación de 0–100 y una calificación. Los resultados se muestran en un gráfico radar interactivo." },
      { q: "¿Cómo funciona la estimación de la edad de la piel?", a: "GPT-5.4 Vision analiza tu piel visualmente y estima una edad de la piel basada en signos visibles como arrugas, elasticidad, textura y pigmentación. No es un diagnóstico médico, sino una indicación que te ayuda a entender el estado de tu piel." },
      { q: "¿Qué es MediaPipe Face Landmarker?", a: "MediaPipe es la tecnología de reconocimiento facial de Google. Identifica 478 puntos tridimensionales en tu rostro y crea 12 zonas precisas que se analizan individualmente. Todo se ejecuta localmente en tu navegador – no se envían datos a Google." },
      { q: "¿Se sube mi foto a un servidor?", a: "El escaneo y el análisis de MediaPipe se ejecutan 100 por ciento localmente. Las imágenes zonales se envían cifradas a GPT-5.4 para el análisis holístico. Si eliges guardar una foto en tu cuenta, se cifra con AES-256-GCM antes del almacenamiento." },
      { q: "¿Puede el análisis reemplazar una visita al dermatólogo?", a: "No, y no es la intención. Nuestro análisis proporciona una primera indicación detallada con 15 métricas y consejos personalizados, pero no sustituye una evaluación médica. Ante problemas graves de piel, siempre recomendamos buscar ayuda profesional." },
      { q: "¿Qué diferencia vuestro análisis de otros análisis de piel online?", a: "La mayoría de los análisis de piel online dan una respuesta simple basada en un selfie. Nuestro análisis combina un modelo ONNX entrenado específicamente (90.000+ imágenes de entrenamiento), MediaPipe Face Landmarker (12 zonas faciales), datos de estilo de vida y GPT-5.4 Vision en un sistema multimodal. El resultado: 15 métricas individuales de la piel, edad biológica de la piel, tipo Fitzpatrick, gráfico radar y una rutina personalizada." },
      { q: "¿Cuánto tiempo tarda el análisis?", a: "Todo el proceso tarda unos 60 segundos: escaneo facial con MediaPipe (10 segundos), siete preguntas (40 segundos) y análisis con IA mediante GPT-5.4 (20 segundos)." },
      { q: "¿Funciona en el móvil?", a: "Sí, el análisis está totalmente optimizado para móvil. MediaPipe funciona perfectamente con la cámara frontal, y toda la experiencia está diseñada mobile-first con resultados responsivos." },
    ],
    ctaTitle: "¿Lista para entender tu piel?",
    ctaSub: "15 métricas. Edad de la piel. Gráfico radar. Gratis. En menos de 60 segundos.",
    ctaButton: "Iniciar análisis de piel gratis",
    ctaSecondary: "Descubre nuestro cuidado de la piel",
    videoLabel: "Mira cómo funciona",
    videoPosterAlt: "Resultados del análisis de piel con IA mostrando puntuación y métricas",
  },
  de: {
    metaTitle: "Kostenlose KI-Hautanalyse – 15 Hautmetriken, Hautalter und Persönliche Routine | 1753 SKINCARE",
    metaDescription:
      "Erhalte eine kostenlose KI-Hautanalyse mit 15 wissenschaftlichen Hautmetriken, geschätztem Hautalter, Radardiagramm und personalisierten Empfehlungen. MediaPipe-Präzision in 12 Gesichtszonen. In unter 60 Sekunden.",
    kicker: "Fortschrittliche KI-Hautanalyse",
    h1: "Kostenlose Hautanalyse – 15 Metriken, Hautalter und Radardiagramm in 60 Sekunden",
    lead: "Unsere Hautanalyse kombiniert ein speziell trainiertes KI-Modell (90.000+ Trainingsbilder), MediaPipe-Gesichtslandmarken in 12 Zonen und Lebensstilfragen, um dir ein vollständiges Bild deiner Hautgesundheit zu geben. 15 wissenschaftliche Metriken, biologisches Hautalter im Vergleich zu deinem chronologischen Alter, Fitzpatrick-Typ und ein interaktives Radardiagramm. Ein Konto wird automatisch erstellt. Keine Kosten.",
    statsLabel: ["Trainingsbilder in unserem Modell", "Hautmetriken analysiert", "Gesichtszonen kartiert"],
    stats: ["90.000+", "15", "12"],
    processTitle: "So funktioniert es – drei Schritte zu deiner Hautanalyse",
    steps: [
      { icon: "camera", title: "1. Scanne dein Gesicht", body: "Die Kamera aktiviert sich direkt in deinem Browser. MediaPipe Face Landmarker identifiziert 478 Gesichtspunkte und teilt dein Gesicht in 12 präzise Zonen ein – Stirn, Wangen, Nase, Kinn, Augenbereich, Kieferlinie, T-Zone und mehr. Alles läuft lokal auf deinem Gerät." },
      { icon: "brain", title: "2. Alter, Geschlecht eingeben und sieben Fragen beantworten", body: "Alter und Geschlecht helfen, die Analyse zu kalibrieren. Dann sieben Fragen zu Hauttyp, Lebensstil, Schlaf, Ernährung, Hautziele, Sonnengewohnheiten und hormonellem Einfluss. Deine Antworten werden mit dem Gesichtsscan und den Zonenbildern kombiniert, um ein vollständiges Profil zu erstellen – nicht nur, was die KI sieht, sondern das gesamte Bild." },
      { icon: "sparkles", title: "3. Erhalte deine persönliche Analyse", body: "Du erhältst 15 detaillierte Hautmetriken mit Punktzahlen und Bewertungen, ein biologisches Hautalter im Vergleich zu deinem chronologischen Alter, Fitzpatrick-Hauttyp, interaktives Radardiagramm, detaillierte Zonenanalyse mit klickbaren Markierungen auf deinem Gesicht, Lebensstilempfehlungen und Produktvorschläge. Ein Konto wird automatisch erstellt, damit du deine Hautreise verfolgen und jeden Monat eine neue Analyse durchführen kannst." },
    ],
    mirrorSection: {
      kicker: "Verstehe deine Haut tiefgründig",
      title: "Dein Spiegel lügt nicht – aber er erzählt nicht die ganze Wahrheit",
      body: "Was du im Spiegel siehst, ist nur die Oberfläche. Darunter liegt ein komplexes Zusammenspiel aus Mikrobiom, Endocannabinoid-System, Hormonen und Lebensstil. Unsere KI misst 15 verschiedene Aspekte deiner Haut – von Feuchtigkeit und Elastizität bis zu Strahlkraft und Barriere-Gesundheit – und gibt dir die Werkzeuge, um gezielt zu handeln.",
    },
    techTitle: "Die Technologie hinter der Analyse",
    techIntro: "Klicke auf die Tabs, um die vier Säulen unserer Hautanalyse zu entdecken.",
    techTabs: [
      {
        id: "model", label: "Trainiertes KI-Modell", title: "Speziell trainiertes Modell + MediaPipe-Präzision",
        body: "Unser Bildklassifizierer wurde mit über 90.000 verifizierten Hautbildern trainiert – Akne, Rosazea, Hyperpigmentierung, trockene Haut, Sonnenschäden, Ekzeme, Dermatitis, Psoriasis und mehr. Das Modell läuft als ONNX Runtime Web direkt in deinem Browser.\n\nMediaPipe Face Landmarker identifiziert 478 Gesichtspunkte und erstellt 12 präzise Gesichtszonen: Stirn, linke und rechte Wange, Nase, Kinn, Augenbereiche, T-Zone, Nasolabialfalten, Mundbereich und Kieferlinie. Jede Zone wird einzeln analysiert und als Präzisionsbilder an GPT-5.4 zur Tiefenanalyse gesendet.",
        highlights: ["90.000+ Trainingsbilder mit Qualitätskontrolle", "MediaPipe Face Landmarker mit 478 Landmarken", "12 präzise Gesichtszonen einzeln analysiert", "Läuft lokal – null Daten verlassen dein Gerät während des Scans"],
      },
      {
        id: "fusion", label: "Multimodale Fusion", title: "Vier Datenquellen – 15 Metriken – ein ganzheitliches Ergebnis",
        body: "Unsere Analyse kombiniert vier Datenquellen in einem multimodalen Fusionssystem:\n\n1. Das ONNX-Modell klassifiziert jede Zone lokal (was die Kamera sieht)\n2. MediaPipe beschneidet 12 Gesichtszonen mit chirurgischer Präzision\n3. Deine Lebensstil-Antworten zu Ernährung, Schlaf und Stress (was du uns erzählst)\n4. GPT-5.4 Vision analysiert das Gesamtbild + Zonenbilder ganzheitlich\n\nDas Ergebnis: 15 wissenschaftliche Hautmetriken (Falten, Poren, Pigmentierung, Rötung, Textur, Augenringe, Festigkeit, Feuchtigkeit, Hautton, Akne, Empfindlichkeit, Sonnenschäden, Elastizität, Strahlkraft und Barriere-Gesundheit) – jede Metrik mit einer Punktzahl von 0–100, Bewertung und Erklärung. Dazu ein geschätztes Hautalter und Fitzpatrick-Hauttyp.",
        highlights: ["4 Datenquellen: ONNX + MediaPipe + Lebensstil + GPT-5.4", "15 individuelle Hautmetriken mit Punktzahlen und Bewertungen", "Geschätztes Hautalter basierend auf visueller Beurteilung", "Fitzpatrick-Hauttyp für personalisierte Empfehlungen"],
      },
      {
        id: "tracking", label: "Verfolgung über Zeit", title: "Verfolge alle 15 Metriken Woche für Woche",
        body: "Eine einzelne Analyse gibt dir eine Momentaufnahme. Echte Veränderung wird erst über die Zeit sichtbar. Du kannst einmal pro Monat eine neue Analyse durchführen und alle 15 Metriken, Hautalter und Hautpunktzahl auf einer Zeitachse speichern.\n\nSieh, wie sich spezifische Metriken wie Feuchtigkeit, Elastizität oder Strahlkraft verbessern, wenn du deine Routine änderst. Wir bieten auch verschlüsselte Fotospeicherung (AES-256-GCM) für visuelle Vorher/Nachher-Vergleiche. Alle Bilder werden nach Bankstandard verschlüsselt und können mit einem Klick gelöscht werden.",
        highlights: ["Verlauf aller 15 Metriken und des Hautalters", "Radardiagramm zeigt Fortschritt über Zeit", "Verschlüsselte Fotospeicherung (AES-256-GCM)", "Volle Kontrolle – lösche alles mit einem Klick"],
      },
      {
        id: "privacy", label: "Datenschutz und Sicherheit", title: "Deine Daten, deine Regeln",
        body: "Wir haben die gesamte Analyse mit Datenschutz als Grundprinzip gestaltet:\n\nDer Gesichtsscan und die MediaPipe-Analyse laufen zu 100 % lokal in deinem Browser – kein Bild verlässt dein Gerät während des Scans. Die Zonenbilder und der Fragebogen werden verschlüsselt an GPT-5.4 für die ganzheitliche Analyse gesendet.\n\nDie Fotospeicherung ist vollständig optional und erfordert aktive Zustimmung. Bilder werden vor der Speicherung mit AES-256-GCM verschlüsselt. Alle Analysedaten können jederzeit dauerhaft aus deinem Konto gelöscht werden.",
        highlights: ["Scan und MediaPipe laufen 100 % lokal", "Kein Bild wird ohne Zustimmung hochgeladen", "AES-256-GCM-Verschlüsselung für gespeicherte Fotos", "GDPR-konform – lösche alles jederzeit"],
      },
    ],
    holisticSection: {
      kicker: "Ganzheitliche Perspektive",
      title: "Deine Haut spiegelt deinen ganzen Körper wider",
      body: "Schlaf, Ernährung, Stress und Bewegung beeinflussen deine Haut genauso stark wie die Produkte, die du verwendest. Unsere Analyse berücksichtigt alles – und quantifiziert es in 15 einzelnen Metriken, damit du genau siehst, was Aufmerksamkeit braucht.",
    },
    conditionsTitle: "Was wir messen und analysieren",
    conditions: [
      "Falten und feine Linien", "Poren und Textur", "Pigmentierung", "Rötung und Rosazea",
      "Hauttextur", "Augenringe", "Festigkeit und Straffheit", "Feuchtigkeit und Hydration",
      "Gleichmäßigkeit des Hauttons", "Akne und Unreinheiten", "Empfindlichkeit", "Sonnenschäden",
      "Elastizität", "Strahlkraft und Glanz", "Barriere-Gesundheit", "Haut-Mikrobiom",
      "Endocannabinoid-System", "Geschätztes Hautalter",
    ],
    whatYouGetTitle: "Was du bei deiner Analyse bekommst",
    whatYouGet: [
      { icon: "target", title: "15 Hautmetriken mit Punktzahlen", body: "Jede Metrik – von Feuchtigkeit und Elastizität bis zu Strahlkraft und Barriere-Gesundheit – wird mit einer Punktzahl von 0–100, einer Bewertung (1–5) und einer persönlichen Erklärung bewertet. Präsentiert in einem interaktiven Radardiagramm." },
      { icon: "layers", title: "12-Zonen-Gesichtsanalyse", body: "MediaPipe identifiziert 478 Gesichtspunkte und erstellt 12 präzise Zonen. Jede Zone wird einzeln analysiert – du siehst genau, wo deine Haut die meiste Aufmerksamkeit braucht." },
      { icon: "heart", title: "Hautalter und Fitzpatrick-Typ", body: "Erhalte ein geschätztes Hautalter basierend auf visueller Beurteilung und deinen Fitzpatrick-Hauttyp für präzisere Empfehlungen, die auf deine Haut zugeschnitten sind." },
      { icon: "leaf", title: "Routine, Lebensstil und Produkte", body: "Persönliche Morgen- und Abendroutine, Lebensstilempfehlungen für Schlaf, Ernährung, Stress und Bewegung, plus 2–3 Produkte passend zu deinem Hautprofil mit 15 % Rabatt." },
    ],
    resultsSection: {
      kicker: "Deine Ergebnisse",
      title: "Die Analyse ist erst der Anfang",
      body: "Speichere deine 15 Metriken, verfolge dein Hautalter und beobachte, wie sich das Radardiagramm über die Zeit entwickelt. Du kannst jeden Monat eine neue Analyse durchführen – jedes Mal bekommst du ein klareres Bild deiner Hautreise und siehst, welche Veränderungen wirklich einen Unterschied machen.",
    },
    faqTitle: "Häufig gestellte Fragen zur Hautanalyse",
    faq: [
      { q: "Ist die Hautanalyse wirklich kostenlos?", a: "Ja, komplett kostenlos. Ein Konto wird automatisch erstellt, damit du deine 15 Metriken speichern und den Fortschritt deiner Haut über die Zeit verfolgen kannst." },
      { q: "Was messen die 15 Metriken?", a: "Wir bewerten Falten, Poren, Pigmentierung, Rötung, Textur, Augenringe, Festigkeit, Feuchtigkeit, Hautton, Akne, Empfindlichkeit, Sonnenschäden, Elastizität, Strahlkraft und Barriere-Gesundheit. Jede Metrik erhält eine Punktzahl von 0–100 und eine Bewertung. Die Ergebnisse werden in einem interaktiven Radardiagramm angezeigt." },
      { q: "Wie funktioniert die Hautalter-Schätzung?", a: "GPT-5.4 Vision analysiert deine Haut visuell und schätzt ein Hautalter basierend auf sichtbaren Zeichen wie Falten, Elastizität, Textur und Pigmentierung. Es ist keine medizinische Diagnose, sondern eine Indikation, die dir hilft, den Zustand deiner Haut zu verstehen." },
      { q: "Was ist MediaPipe Face Landmarker?", a: "MediaPipe ist Googles Technologie zur Gesichtserkennung. Sie identifiziert 478 dreidimensionale Punkte in deinem Gesicht und erstellt 12 präzise Zonen, die einzeln analysiert werden. Alles läuft lokal in deinem Browser – keine Daten werden an Google gesendet." },
      { q: "Wird mein Foto auf einen Server hochgeladen?", a: "Der Scan und die MediaPipe-Analyse laufen 100 Prozent lokal. Zonenbilder werden verschlüsselt an GPT-5.4 für die ganzheitliche Analyse gesendet. Wenn du ein Foto in deinem Konto speichern möchtest, wird es vor der Speicherung mit AES-256-GCM verschlüsselt." },
      { q: "Kann die Analyse einen Besuch beim Hautarzt ersetzen?", a: "Nein, und das ist auch nicht die Absicht. Unsere Analyse liefert eine detaillierte erste Einschätzung mit 15 Metriken und personalisierten Tipps, ersetzt aber keine medizinische Beurteilung. Bei ernsthaften Hautproblemen empfehlen wir immer, professionelle Hilfe zu suchen." },
      { q: "Was unterscheidet eure Analyse von anderen Online-Hautanalysen?", a: "Die meisten Online-Hautanalysen geben eine einfache Antwort basierend auf einem Selfie. Unsere Analyse kombiniert ein speziell trainiertes ONNX-Modell (90.000+ Trainingsbilder), MediaPipe Face Landmarker (12 Gesichtszonen), Lebensstildaten und GPT-5.4 Vision in einem multimodalen System. Das Ergebnis: 15 individuelle Hautmetriken, biologisches Hautalter, Fitzpatrick-Typ, Radardiagramm und eine persönliche Routine." },
      { q: "Wie lange dauert die Analyse?", a: "Der gesamte Prozess dauert etwa 60 Sekunden: Gesichtsscan mit MediaPipe (10 Sekunden), sieben Fragen (40 Sekunden) und KI-Analyse mit GPT-5.4 (20 Sekunden)." },
      { q: "Funktioniert es auf dem Handy?", a: "Ja, die Analyse ist vollständig für Mobilgeräte optimiert. MediaPipe funktioniert hervorragend mit der Frontkamera, und das gesamte Erlebnis ist mobile-first gestaltet mit responsiven Ergebnissen." },
    ],
    ctaTitle: "Bereit, deine Haut zu verstehen?",
    ctaSub: "15 Metriken. Hautalter. Radardiagramm. Kostenlos. In unter 60 Sekunden.",
    ctaButton: "Kostenlose Hautanalyse starten",
    ctaSecondary: "Mehr über unsere Hautpflege erfahren",
    videoLabel: "So funktioniert es",
    videoPosterAlt: "Ergebnisse der KI-Hautanalyse mit Bewertungsring und Metriken",
  },
  fr: {
    metaTitle: "Analyse de Peau IA Gratuite – 15 Métriques, Âge de la Peau et Routine Personnalisée | 1753 SKINCARE",
    metaDescription:
      "Obtiens une analyse de peau IA gratuite avec 15 métriques scientifiques, âge estimé de la peau, graphique radar et recommandations personnalisées. Précision MediaPipe sur 12 zones du visage. En moins de 60 secondes.",
    kicker: "Analyse de peau IA avancée",
    h1: "Analyse de peau gratuite – 15 métriques, âge de la peau et graphique radar en 60 secondes",
    lead: "Notre analyse de peau combine un modèle d'IA spécialement entraîné (90 000+ images d'entraînement), les repères faciaux MediaPipe sur 12 zones et des questions sur ton mode de vie pour te donner une image complète de la santé de ta peau. 15 métriques scientifiques, âge biologique de la peau comparé à ton âge chronologique, type Fitzpatrick et un graphique radar interactif. Un compte est automatiquement créé. Sans frais.",
    statsLabel: ["images d'entraînement dans notre modèle", "métriques de peau analysées", "zones du visage cartographiées"],
    stats: ["90 000+", "15", "12"],
    processTitle: "Comment ça marche – trois étapes pour ton analyse de peau",
    steps: [
      { icon: "camera", title: "1. Scanne ton visage", body: "La caméra s'active directement dans ton navigateur. MediaPipe Face Landmarker identifie 478 points du visage et divise ton visage en 12 zones précises – front, joues, nez, menton, zone oculaire, mâchoire, zone T et plus. Tout fonctionne localement sur ton appareil." },
      { icon: "brain", title: "2. Indique ton âge, ton genre et réponds à sept questions", body: "L'âge et le genre aident à calibrer l'analyse. Puis sept questions sur le type de peau, le mode de vie, le sommeil, l'alimentation, les objectifs pour ta peau, les habitudes solaires et l'influence hormonale. Tes réponses sont combinées avec le scan facial et les images zonales pour créer un profil complet – pas seulement ce que l'IA voit, mais l'image complète." },
      { icon: "sparkles", title: "3. Obtiens ton analyse personnalisée", body: "Tu reçois 15 métriques de peau détaillées avec scores et notes, un âge biologique de la peau comparé à ton âge chronologique, type de peau Fitzpatrick, graphique radar interactif, analyse détaillée par zones avec des marqueurs cliquables sur ton visage, recommandations de mode de vie et suggestions de produits. Un compte est automatiquement créé pour que tu puisses suivre ton parcours peau et faire une nouvelle analyse chaque mois." },
    ],
    mirrorSection: {
      kicker: "Comprends ta peau en profondeur",
      title: "Ton miroir ne ment pas – mais il ne te dit pas toute la vérité",
      body: "Ce que tu vois dans le miroir n'est que la surface. En dessous se cache une interaction complexe entre microbiome, système endocannabinoïde, hormones et mode de vie. Notre IA mesure 15 aspects distincts de ta peau – de l'hydratation et l'élasticité à l'éclat et la santé de la barrière – et te donne les outils pour agir.",
    },
    techTitle: "La technologie derrière l'analyse",
    techIntro: "Clique sur les onglets pour explorer les quatre piliers de notre analyse de peau.",
    techTabs: [
      {
        id: "model", label: "Modèle IA entraîné", title: "Modèle spécialement entraîné + précision MediaPipe",
        body: "Notre classificateur d'images a été entraîné sur plus de 90 000 images de peau vérifiées – acné, rosacée, hyperpigmentation, peau sèche, dommages solaires, eczéma, dermatite, psoriasis et plus. Le modèle fonctionne en tant que ONNX Runtime Web directement dans ton navigateur.\n\nMediaPipe Face Landmarker identifie 478 points du visage et crée 12 zones faciales précises : front, joue gauche et droite, nez, menton, zones oculaires, zone T, sillons nasogéniens, zone buccale et mâchoire. Chaque zone est analysée individuellement et envoyée comme images de précision à GPT-5.4 pour une analyse approfondie.",
        highlights: ["90 000+ images d'entraînement avec contrôle qualité", "MediaPipe Face Landmarker avec 478 repères", "12 zones faciales précises analysées individuellement", "Fonctionne localement – zéro donnée ne quitte ton appareil pendant le scan"],
      },
      {
        id: "fusion", label: "Fusion multimodale", title: "Quatre sources de données – 15 métriques – un résultat holistique",
        body: "Notre analyse combine quatre sources de données dans un système de fusion multimodal :\n\n1. Le modèle ONNX classifie chaque zone localement (ce que la caméra voit)\n2. MediaPipe découpe 12 zones du visage avec une précision chirurgicale\n3. Tes réponses sur l'alimentation, le sommeil et le stress (ce que tu nous dis)\n4. GPT-5.4 Vision analyse l'image complète + les images zonales de manière holistique\n\nLe résultat : 15 métriques scientifiques de la peau (rides, pores, pigmentation, rougeurs, texture, cernes, fermeté, hydratation, teint, acné, sensibilité, dommages solaires, élasticité, éclat et santé de la barrière) – chaque métrique avec un score de 0–100, une note et une explication. Plus un âge estimé de la peau et un type de peau Fitzpatrick.",
        highlights: ["4 sources de données : ONNX + MediaPipe + mode de vie + GPT-5.4", "15 métriques de peau individuelles avec scores et notes", "Âge estimé de la peau basé sur évaluation visuelle", "Type de peau Fitzpatrick pour des recommandations personnalisées"],
      },
      {
        id: "tracking", label: "Suivi dans le temps", title: "Suis les 15 métriques semaine après semaine",
        body: "Une seule analyse te donne un instantané. Le vrai changement se voit avec le temps. Tu peux faire une nouvelle analyse une fois par mois et sauvegarder les 15 métriques, l'âge de la peau et le score cutané sur une chronologie.\n\nObserve comment des métriques spécifiques comme l'hydratation, l'élasticité ou l'éclat s'améliorent quand tu changes ta routine. Nous proposons aussi un stockage photo chiffré (AES-256-GCM) pour des comparaisons visuelles avant/après. Toutes les images sont chiffrées selon les normes bancaires et peuvent être supprimées en un clic.",
        highlights: ["Historique des 15 métriques et de l'âge de la peau", "Graphique radar montrant la progression dans le temps", "Stockage photo chiffré (AES-256-GCM)", "Contrôle total – supprime tout en un clic"],
      },
      {
        id: "privacy", label: "Confidentialité et sécurité", title: "Tes données, tes règles",
        body: "Nous avons conçu l'ensemble de l'analyse avec la confidentialité comme principe fondamental :\n\nLe scan facial et l'analyse MediaPipe fonctionnent à 100 % localement dans ton navigateur – aucune image ne quitte ton appareil pendant le scan. Les images zonales et le questionnaire sont envoyés chiffrés à GPT-5.4 pour l'analyse holistique.\n\nLe stockage photo est entièrement optionnel et nécessite un consentement actif. Les images sont chiffrées avec AES-256-GCM avant le stockage. Toutes les données d'analyse peuvent être définitivement supprimées de ton compte à tout moment.",
        highlights: ["Scan et MediaPipe fonctionnent à 100 % localement", "Aucune image téléchargée sans consentement", "Chiffrement AES-256-GCM pour les photos sauvegardées", "Conforme au GDPR – supprime tout à tout moment"],
      },
    ],
    holisticSection: {
      kicker: "Perspective holistique",
      title: "Ta peau reflète tout ton corps",
      body: "Le sommeil, l'alimentation, le stress et l'exercice affectent ta peau autant que les produits que tu utilises. Notre analyse prend tout en compte – et le quantifie en 15 métriques distinctes pour que tu voies exactement ce qui a besoin d'attention.",
    },
    conditionsTitle: "Ce que nous mesurons et analysons",
    conditions: [
      "Rides et ridules", "Pores et texture", "Pigmentation", "Rougeurs et rosacée",
      "Texture de la peau", "Cernes", "Fermeté et tonicité", "Hydratation et humidité",
      "Uniformité du teint", "Acné et imperfections", "Sensibilité", "Dommages solaires",
      "Élasticité", "Éclat et luminosité", "Santé de la barrière", "Microbiome cutané",
      "Système endocannabinoïde", "Âge estimé de la peau",
    ],
    whatYouGetTitle: "Ce que tu obtiens dans ton analyse",
    whatYouGet: [
      { icon: "target", title: "15 métriques de peau avec scores", body: "Chaque métrique – de l'hydratation et l'élasticité à l'éclat et la santé de la barrière – est évaluée avec un score de 0–100, une note (1–5) et une explication personnalisée. Présenté dans un graphique radar interactif." },
      { icon: "layers", title: "Analyse faciale en 12 zones", body: "MediaPipe identifie 478 points du visage et crée 12 zones précises. Chaque zone est analysée individuellement – tu vois exactement où ta peau a le plus besoin d'attention." },
      { icon: "heart", title: "Âge de la peau et type Fitzpatrick", body: "Obtiens un âge estimé de la peau basé sur l'évaluation visuelle et ton type de peau Fitzpatrick pour des recommandations plus précises adaptées à ta peau." },
      { icon: "leaf", title: "Routine, mode de vie et produits", body: "Routine personnalisée matin et soir, recommandations de mode de vie pour le sommeil, l'alimentation, le stress et l'exercice, plus 2–3 produits adaptés à ton profil de peau avec 15 % de réduction." },
    ],
    resultsSection: {
      kicker: "Tes résultats",
      title: "L'analyse n'est que le début",
      body: "Sauvegarde tes 15 métriques, suis l'âge de ta peau et regarde le graphique radar évoluer dans le temps. Tu peux faire une nouvelle analyse chaque mois – à chaque fois, tu obtiens une image plus claire de ton parcours cutané et tu vois quels changements font vraiment la différence.",
    },
    faqTitle: "Questions fréquentes sur l'analyse de peau",
    faq: [
      { q: "L'analyse de peau est-elle vraiment gratuite ?", a: "Oui, entièrement gratuite. Un compte est automatiquement créé pour que tu puisses sauvegarder tes 15 métriques et suivre la progression de ta peau dans le temps." },
      { q: "Que mesurent les 15 métriques ?", a: "Nous évaluons les rides, pores, pigmentation, rougeurs, texture, cernes, fermeté, hydratation, teint, acné, sensibilité, dommages solaires, élasticité, éclat et santé de la barrière. Chaque métrique reçoit un score de 0–100 et une note. Les résultats sont affichés dans un graphique radar interactif." },
      { q: "Comment fonctionne l'estimation de l'âge de la peau ?", a: "GPT-5.4 Vision analyse ta peau visuellement et estime un âge de la peau basé sur des signes visibles comme les rides, l'élasticité, la texture et la pigmentation. Ce n'est pas un diagnostic médical, mais une indication qui t'aide à comprendre l'état de ta peau." },
      { q: "Qu'est-ce que MediaPipe Face Landmarker ?", a: "MediaPipe est la technologie de reconnaissance faciale de Google. Elle identifie 478 points tridimensionnels sur ton visage et crée 12 zones précises qui sont analysées individuellement. Tout fonctionne localement dans ton navigateur – aucune donnée n'est envoyée à Google." },
      { q: "Ma photo est-elle téléchargée sur un serveur ?", a: "Le scan et l'analyse MediaPipe fonctionnent à 100 pour cent localement. Les images zonales sont envoyées chiffrées à GPT-5.4 pour l'analyse holistique. Si tu choisis de sauvegarder une photo dans ton compte, elle est chiffrée avec AES-256-GCM avant le stockage." },
      { q: "L'analyse peut-elle remplacer une visite chez le dermatologue ?", a: "Non, et ce n'est pas le but. Notre analyse fournit une première indication détaillée avec 15 métriques et des conseils personnalisés, mais ne remplace pas une évaluation médicale. En cas de problèmes de peau sérieux, nous recommandons toujours de consulter un professionnel." },
      { q: "Qu'est-ce qui distingue votre analyse des autres analyses de peau en ligne ?", a: "La plupart des analyses de peau en ligne donnent une réponse simple basée sur un selfie. Notre analyse combine un modèle ONNX spécialement entraîné (90 000+ images d'entraînement), MediaPipe Face Landmarker (12 zones du visage), des données de mode de vie et GPT-5.4 Vision dans un système multimodal. Le résultat : 15 métriques de peau individuelles, âge biologique de la peau, type Fitzpatrick, graphique radar et une routine personnalisée." },
      { q: "Combien de temps dure l'analyse ?", a: "L'ensemble du processus prend environ 60 secondes : scan facial avec MediaPipe (10 secondes), sept questions (40 secondes) et analyse IA avec GPT-5.4 (20 secondes)." },
      { q: "Ça fonctionne sur mobile ?", a: "Oui, l'analyse est entièrement optimisée pour mobile. MediaPipe fonctionne parfaitement avec la caméra frontale, et toute l'expérience est conçue mobile-first avec des résultats responsifs." },
    ],
    ctaTitle: "Prêt(e) à comprendre ta peau ?",
    ctaSub: "15 métriques. Âge de la peau. Graphique radar. Gratuit. En moins de 60 secondes.",
    ctaButton: "Lancer l'analyse de peau gratuite",
    ctaSecondary: "En savoir plus sur nos soins",
    videoLabel: "Découvrez comment ça marche",
    videoPosterAlt: "Résultats de l'analyse de peau IA avec anneau de score et métriques",
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
  const c = content[locale as keyof typeof content] || content.en;
  const canonicalMap: Record<string, string> = {
    sv: "/sv/gratis-hudanalys",
    en: "/en/free-skin-analysis",
    es: "/es/analisis-piel-gratis",
    de: "/de/kostenlose-hautanalyse",
    fr: "/fr/analyse-de-peau-gratuite",
  };
  const canonical = canonicalMap[locale] || canonicalMap.en;
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: {
      canonical: `${BASE_URL}${canonical}`,
      languages: {
        sv: `${BASE_URL}${canonicalMap.sv}`,
        en: `${BASE_URL}${canonicalMap.en}`,
        es: `${BASE_URL}${canonicalMap.es}`,
        de: `${BASE_URL}${canonicalMap.de}`,
        fr: `${BASE_URL}${canonicalMap.fr}`,
        "x-default": `${BASE_URL}${canonicalMap.en}`,
      },
    },
    openGraph: {
      title: c.metaTitle,
      description: c.metaDescription,
      url: `${BASE_URL}${canonical}`,
      images: [{ url: `${BASE_URL}${IMG}/1.webp`, width: 1600, height: 1600 }],
      locale: OG_LOCALE[locale] || "en_GB",
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
  const c = content[l as keyof typeof content] || content.en;
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
    name: tx(l, "AI Hudanalys", "AI Skin Analysis", "Análisis de Piel con IA", "KI-Hautanalyse", "Analyse de Peau IA"),
    description: c.metaDescription,
    provider: { "@type": "Organization", name: "1753 SKINCARE", url: BASE_URL },
    serviceType: "Skin Analysis",
    isRelatedTo: { "@type": "MedicalSpecialty", name: "Dermatology" },
    offers: { "@type": "Offer", price: "0", priceCurrency: "SEK", availability: "https://schema.org/InStock" },
    areaServed: { "@type": "Country", name: tx(l, "Sverige", "Sweden", "Suecia", "Schweden", "Suède") },
  };

  const freeAnalysisPaths: Record<string, string> = {
    sv: "/sv/gratis-hudanalys",
    en: "/en/free-skin-analysis",
    es: "/es/analisis-piel-gratis",
    de: "/de/kostenlose-hautanalyse",
    fr: "/fr/analyse-de-peau-gratuite",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: tx(l, "Hem", "Home", "Inicio", "Startseite", "Accueil"), item: `${BASE_URL}/${l}` },
      { "@type": "ListItem", position: 2, name: tx(l, "Gratis hudanalys", "Free skin analysis", "Análisis de piel gratis", "Kostenlose Hautanalyse", "Analyse de peau gratuite"), item: `${BASE_URL}${freeAnalysisPaths[l] || freeAnalysisPaths.sv}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: c.processTitle,
        description: c.metaDescription,
        totalTime: "PT1M",
        step: c.steps.map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: s.title,
          text: s.body,
        })),
      }) }} />

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
          <HeroVideo label={c.videoLabel} posterAlt={c.videoPosterAlt} locale={l} />
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
              alt={tx(l, "Kvinna tittar i spegeln", "Woman looking in the mirror", "Mujer mirándose al espejo", "Frau schaut in den Spiegel", "Femme se regardant dans le miroir")}
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
              alt={tx(l, "Kvinna i naturen, holistisk hudvård", "Woman in nature, holistic skincare", "Mujer en la naturaleza, cuidado holístico de la piel", "Frau in der Natur, ganzheitliche Hautpflege", "Femme dans la nature, soin holistique de la peau")}
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
                alt={tx(l, "Kvinna rör sin hud", "Woman touching her skin", "Mujer tocando su piel", "Frau berührt ihre Haut", "Femme touchant sa peau")}
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
              alt={tx(l, "Kvinna tittar på sina resultat", "Woman looking at her results", "Mujer mirando sus resultados", "Frau betrachtet ihre Ergebnisse", "Femme regardant ses résultats")}
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
