/**
 * DEV-ONLY preview-route för premium-hudanalysen.
 *
 * Renderar PremiumReport med en realistisk mockad payload utan att gå via
 * Viva Wallet eller OpenAI. Används för visuell QA av layout och PDF-export.
 *
 * Indexeras INTE (noindex i metadata).
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PremiumReport } from "@/components/analysis-premium/premium-report";
import type { PremiumAnalysisResult } from "@/components/analysis-premium/premium-types";

export const metadata: Metadata = {
  title: "Premium-hudanalys (Preview)",
  robots: { index: false, follow: false },
};

const ENABLED = (() => {
  const v = String(process.env.PREMIUM_ANALYSIS_ENABLED || "").toLowerCase();
  return v === "1" || v === "true" || v === "yes" || v === "on";
})();

const DEMO_RESULT: PremiumAnalysisResult = {
  version: "premium-v2",
  scoreOverall: 78,
  scoreLabel:
    "Du har en bra grund att stå på, men det finns tydliga möjligheter att lyfta lyster, jämna ut rodnad och stärka mikrobiomet med små men konsekventa förändringar.",
  skinAge: 32,
  fitzpatrick: "II–III",
  skinArchetype: {
    name: "Aurora",
    tagline: "Balanserad blandhud med fin pigmentering",
    description:
      "Du visar typiska tecken på Aurora-arketypen: en zon-T som glansar tidigt på dagen, fina porer i kindområdet och en lätt rodnad runt näsa och haka. Din hud reagerar snabbt på stress och sömnbrist – men svarar också snabbt på återhämtning.",
  },
  summary:
    "Din hud är fundamentalt frisk men signalerar att livsstilen pressar barriär och mikrobiom mer än de kan kompensera för. Sömnen ligger på 5–6 timmar i snitt och stressen rapporteras som 7/10. Det syns i förhöjd glans i pannan, mild rodnad kring näsa och haka samt minskad lyster. Vi rekommenderar ett enkelt 4-veckorsprotokoll med fokus på återhämtning, omega-3-rik kost och endast två produkter på morgonen och kvällen.",
  skinDnaInsights: [
    {
      title: "Kortisol-driven sebumdysreglering",
      insight:
        "Din rapporterade sömn (5–6 h) i kombination med upplevd stress (7/10) och utbrott på haka tyder på en HPA-axel som kontinuerligt höjer sebumproduktionen i T-zonen. Hudens nattliga reparation är förkortad.",
      evidenceFromAnswers: ["Sömn 5–6 h", "Stress 7/10", "Akne på haka", "Trötthet"],
    },
    {
      title: "Tarm-hud-axeln påverkar barriär och mikrobiom",
      insight:
        "Mycket kaffe (4+ koppar) och lite fermenterat samt fiber i din kostbeskrivning samverkar med uppblåsthet och försämrad barriärfunktion på huden – vilket vi ser som lätt deshydrering trots oljig zon.",
      evidenceFromAnswers: ["4–5 koppar kaffe", "Sällan fermenterat", "Uppblåsthet"],
    },
    {
      title: "Tidig pigmenterings-sårbarhet",
      insight:
        "Fitzpatrick II–III + soltid 30–60 min/dag utan skydd och rapporterade soldagar utomlands ger en förhöjd risk för hyperpigmentering på överläpp och kindben. Vi ser tidiga tecken redan nu.",
      evidenceFromAnswers: ["FP II–III", "30–60 min sol/dag", "Resor till varma länder"],
    },
  ],
  lifestyleScores: {
    sleep: {
      score: 55,
      detail:
        "Snittsömn 5–6 h med sent skärmarbete – nattens reparation hinner inte färdigt.",
      topLevers: [
        "Lägg dig 30 min tidigare i 14 dagar",
        "Magnesium glycinat 300 mg 30 min före natt",
        "Inga skärmar i sovrummet",
      ],
    },
    stress: {
      score: 45,
      detail:
        "Upplevd stress 7/10 + få återhämtningspauser – kortisol är förhöjt på eftermiddagen.",
      topLevers: [
        "1 minuts djupandning kl 14",
        "Promenad utomhus efter lunch",
        "Tre tacksamhetsmeningar före sömn",
      ],
    },
    nutrition: {
      score: 65,
      detail:
        "Hyfsat balanserat men för lite omega-3 och fermenterat för en hud som inflammerar.",
      topLevers: [
        "Fet fisk 3 ggr/v",
        "1 portion fermenterat dagligen",
        "Pumpafrön 1 msk varje morgon",
      ],
    },
    gut: {
      score: 50,
      detail:
        "Uppblåsthet + sällan fermenterat + 4+ koppar kaffe indikerar låg mikrobiomdiversitet.",
      topLevers: [
        "Probiotika multistam i 8 v",
        "Sluta med kaffe efter kl 14",
        "Mer fibrer från grönsaker",
      ],
    },
    movement: {
      score: 60,
      detail:
        "Promenader varje dag men sällan styrketräning eller stretching.",
      topLevers: [
        "10 min promenad efter middag",
        "30 min styrka 2 ggr/v",
        "Stretching på morgonen 5 min",
      ],
    },
    weakestLink: "stress",
    weakestLinkInsight:
      "Stress är just nu din enskilt största hudfaktor. Att sänka kortisol-spiken på eftermiddagen ger snabbast effekt på rodnad och haka-utbrott – och stärker både sömn och tarmhälsa som följdeffekt.",
  },
  metrics: {
    hydration: { score: 72, grade: 2, detail: "Lätt deshydrering på kinder, normalvärden i T-zon." },
    barrier: { score: 68, grade: 3, detail: "TEWL något förhöjd, troligen pga sömn och kaffe." },
    elasticity: { score: 80, grade: 2, detail: "God elasticitet för åldern, fin recoil." },
    redness: { score: 60, grade: 3, detail: "Diffus rodnad runt näsa och haka, vaskulär komponent." },
    lustre: { score: 65, grade: 3, detail: "Lyster minskad, troligen pga sömn och kost." },
    pores: { score: 75, grade: 2, detail: "Fina porer, lätt utvidgning i T-zon." },
    pigmentation: { score: 78, grade: 2, detail: "Tidiga tecken på solskador på överläpp och kindben." },
    fineLines: { score: 82, grade: 2, detail: "Mycket fina linjer kring ögon, åldersanpassat." },
    oiliness: { score: 70, grade: 2, detail: "Hyper-sebum i T-zon eftermiddag." },
    sensitivity: { score: 60, grade: 3, detail: "Reagerar på alkohol och eteriska oljor." },
    microbiomeHealth: { score: 68, grade: 3, detail: "Diversitet något låg pga over-cleansing." },
    vascularHealth: { score: 74, grade: 2, detail: "Mikrocirkulation god, lätt vasodilation." },
  },
  deepDive: {
    rootCauses: [
      {
        title: "Sömnbrist + stress = barriärnedbrytning",
        explanation:
          "Med 5–6 timmars sömn pågår fasen för hudens nattliga reparation och autophagy bara 60–70 % av tiden. Samtidigt höjer stressen kortisol som ökar TEWL och påverkar sebumproduktion. Detta är den enskilt största faktorn bakom din lystersänkning och haka-utbrott.",
        evidence: ["Sömn 5–6 h", "Stress 7/10", "Akne på haka", "Lyster minskad"],
      },
      {
        title: "Kaffe + lite fermenterat = mikrobiom-stress",
        explanation:
          "Höga mängder kaffe utan motvikt av prebiotika och probiotika minskar mikrobiomets diversitet både i tarm och hud. Du beskriver uppblåsthet och oregelbunden mage – ett tydligt tarm-hud-mönster.",
        evidence: ["4–5 koppar kaffe", "Sällan fermenterat", "Uppblåsthet"],
      },
      {
        title: "Otillräckligt solskydd för Fitzpatrick II–III",
        explanation:
          "Med din hudtyp och 30–60 min sol/dag bygger du upp pigmentskador i en jämn takt. Vi ser tidiga tecken på fläckar – nu är rätt läge för förebyggande hellre än reparativ vård.",
        evidence: ["FP II–III", "30–60 min sol/dag", "Inga solresor med skydd"],
      },
    ],
    systemicConnections: [
      {
        system: "Tarm-hud-axeln",
        explanation:
          "Lite fiber + kaffe + sällan fermenterat sänker mikrobiomets diversitet → ökar systemisk inflammation → manifesterar i form av rodnad och haka-utbrott.",
      },
      {
        system: "Stress-hud-axeln",
        explanation:
          "Förhöjd kortisol stör hudens egna ECS-system; CB1/CB2 dysreglering visar sig som blandhud med ojämn lyster och fettiga zoner.",
      },
      {
        system: "Sömn-hud-axeln",
        explanation:
          "Reducerad melatonin = reducerad nattlig autophagy = försämrad kollagensyntes över tid. Detta är reversibelt på 4–6 veckor med bättre sömn.",
      },
    ],
    skinHistoryPattern:
      "Din hud har sannolikt fungerat bättre när du varit ledig och sovit längre – det är en stress-driven hud, inte en åldersdriven hud.",
  },
  circadianRhythm: {
    morning: {
      ritual: "Skölj med svalt vatten och applicera 2 droppar I LOVE Facial Oil i lätt fuktig hud.",
      why: "Morgonens högre kortisol gör huden reaktiv – temperaturen och olja på fuktig hud lugnar utan att stressa barriären.",
    },
    midday: {
      ritual: "Mist eller mineralvatten i T-zonen + 30 sek djupandning.",
      why: "Återställer hydrering och sänker eftermiddagens kortisolspik som annars triggar hyperpigmentering.",
    },
    evening: {
      ritual: "DUO-rening + 3 droppar THE ONE Facial Oil i kindområdet.",
      why: "Hudens nattliga reparationsfönster (22–02) drar nytta av lipider och CBD/CBG som stödjer ECS.",
    },
  },
  nutritionPlan: {
    headline:
      "Fokus: omega-3, mer fiber och fermenterat, mindre kaffe efter klockan 14. Inga radikala uteslutningar.",
    foodsToAdd: [
      { food: "Fet fisk (lax, makrill, sardiner)", why: "EPA/DHA stödjer barriär och dämpar inflammation", frequency: "3 ggr/v" },
      { food: "Fermenterat (surkål, kefir, kombucha)", why: "Probiotika ökar mikrobiomets diversitet", frequency: "Dagligen 1 portion" },
      { food: "Bär och mörkgröna blad", why: "Polyfenoler och vitamin C stöttar kollagensyntes", frequency: "Dagligen" },
      { food: "Pumpafrön", why: "Zink + magnesium för läkning och sömn", frequency: "1 msk/dag" },
    ],
    foodsToLimit: [
      { food: "Kaffe efter kl 14", why: "Halveringstid 5–6 h påverkar djupsömn", alternative: "Rooibos eller koffeinfritt grönt te" },
      { food: "Söta drycker och energidrycker", why: "Insulin-spikar driver IGF-1 → akne", alternative: "Vatten med citron + havssalt" },
      { food: "Komjölk i stora mängder", why: "Om akne-benägen kan IGF-1 bidra", alternative: "Havre- eller mandelmjölk, kefir" },
    ],
    sampleDay: {
      breakfast: "Yoghurt med bär, pumpafrön och 1 msk linfrö",
      lunch: "Lax med rotfrukter, mörkgrön sallad och sauerkraut",
      dinner: "Bönor + ris + grillad kyckling + avokado",
      snacks: "Mandlar, äpple med mandelsmör, mörk choklad 85 %",
    },
    hydrationGoal: "2,2 liter vatten per dag, inkl. örtte. Lägg till en nypa havssalt på morgonen.",
  },
  supplementSuggestions: [
    { name: "Omega-3 EPA/DHA", dose: "1500 mg/dag", why: "Stödjer barriär, dämpar systemisk inflammation, stabiliserar humör.", evidenceLevel: "stark" },
    { name: "Magnesium glycinat", dose: "300 mg före läggdags", why: "Förbättrar sömnkvalitet och stödjer återhämtning.", evidenceLevel: "stark" },
    { name: "Probiotika (multistam)", dose: "1 kapsel/dag i 8 v", why: "Bygger upp mikrobiomets diversitet efter perioder med kaffe + stress.", evidenceLevel: "medel" },
  ],
  environmentalFactors: {
    uv: { impact: "medel-hög", advice: "Mineraliskt SPF 30 endast på dagar utomhus > 30 min, samt vid resor till solrika destinationer." },
    blueLight: { impact: "medel", advice: "Stäng skärmar 60 min före läggdags. Ljusinställning till varm efter solnedgång." },
    pollution: { impact: "medel", advice: "Kvällsrening blir extra viktigt om du dagligen rör dig i tätort eller kör mycket bil." },
    climate: { impact: "varierar", advice: "Sänk inomhusvärmen vintertid och använd luftfuktare i sovrummet." },
    waterHardness: { impact: "låg-medel", advice: "Skölj ansiktet med kallt mineralvatten morgon vid hård vattenförsörjning." },
  },
  microHabits: [
    { habit: "Drick 250 ml vatten + en nypa havssalt direkt vid uppvaknande", stackWith: "Innan första kaffet", duration: "30 sek" },
    { habit: "1 minuts djupandning innan toalettbesök på morgonen", stackWith: "Direkt efter att du stigit upp", duration: "60 sek" },
    { habit: "Applicera olja på lätt fuktig hud i stället för torr", stackWith: "Efter morgonduschen", duration: "20 sek" },
    { habit: "Lägg ifrån dig telefonen 30 min före sänggåendet", stackWith: "Efter att du borstat tänderna", duration: "Set en alarmpåminnelse" },
    { habit: "Skriv 1 mening i en hud-journal varje kväll", stackWith: "Bredvid kvällsrutinen", duration: "30 sek" },
  ],
  protocol4Weeks: {
    vision:
      "Efter 4 veckor: tydligt minskad rodnad, jämnare lyster i hela ansiktet, färre haka-utbrott och en hud som känns lugn snarare än reaktiv.",
    week1: {
      focus: "Stabilisera barriär och sömn",
      actions: [
        "Lägg dig 30 min tidigare än normalt",
        "Byt morgonrening till bara svalt vatten",
        "Inkludera 1 omega-3-rik måltid om dagen",
      ],
      milestone: "Du sover minst 6 h 5 nätter denna vecka",
    },
    week2: {
      focus: "Återinför mikrobiomstöd",
      actions: [
        "Starta probiotika och fortsätt omega-3",
        "Lägg till 1 portion fermenterat per dag",
        "Slut med kaffe efter kl 14",
      ],
      milestone: "Märkbart minskad uppblåsthet",
    },
    week3: {
      focus: "Lyster och pigmentering",
      actions: [
        "Inkludera bär och mörkgröna blad varje dag",
        "Mineraliskt SPF endast vid solresor och soldagar",
        "Mist + andning klockan 14 dagligen",
      ],
      milestone: "Vänner kommenterar din lyster",
    },
    week4: {
      focus: "Konsolidera + utvärdera",
      actions: [
        "Foto-dokumentera resultat (samma ljus som vecka 1)",
        "Behåll det som fungerar – gör det till baseline",
        "Reflektera: vad ska jag fortsätta med?",
      ],
      milestone: "Din ’nya normal’ är på plats",
    },
  },
  expectedTrajectory: {
    week1: "Du märker en lätt initial torrhet och eventuellt 1–2 nya utbrott när huden anpassar sig till mindre rening. Det är normalt.",
    week2: "Mage och energi börjar förändras. Hudens textur känns lite slätare på morgonen.",
    week3: "Rodnaden börjar dra ihop sig, lystret kommer tillbaka och du behöver mindre koncealer.",
    week4: "En ny baseline. Hud, mage, sömn och energi i synk – det blir märkbart för andra.",
  },
  lifestyleProgram: {
    sleep: {
      headline: "Sömn är din enskilt största hudbehandling",
      actions: ["Lägg dig 30 min tidigare", "Magnesium 30 min före natten", "Inga skärmar i sovrummet"],
      why: "Melatonin reglerar autophagy som är hudens nattliga städning av skadade celler.",
      expectedImpact: "hög",
    },
    stress: {
      headline: "Sänk kortisolspiken på eftermiddagen",
      actions: ["1 min djupandning kl 14", "Promenad utomhus efter lunch", "Skriv 3 saker du är tacksam för före sömn"],
      why: "Kortisol-rytmen påverkar både sebum och vaskulär ton.",
      expectedImpact: "hög",
    },
    nutrition: {
      headline: "Bygg om från brist till balans",
      actions: ["3 fisk-måltider/v", "Bär dagligen", "Pumpafrön 1 msk"],
      why: "Omega-3, polyfenoler och zink är bristbevisade hos blandhud.",
      expectedImpact: "hög",
    },
    gut: {
      headline: "Återställ mikrobiom-diversiteten",
      actions: ["Fermenterat dagligen", "Probiotika 8 v", "Mer fibrer från grönsaker"],
      why: "Tarm-hud-axeln är bevisad mekanism för rodnad och akne.",
      expectedImpact: "medel",
    },
    movement: {
      headline: "Rörelse istället för intensitet",
      actions: ["10 min promenad efter middag", "30 min styrka 2x/v", "Stretch på morgon"],
      why: "Mikrocirkulation och kortisolsänkning är effekten.",
      expectedImpact: "medel",
    },
  },
  productProtocol: {
    morning: [
      { step: "Skölj med svalt vatten", product: "—", why: "Bevarar nattens mikrobiom-uppbyggnad" },
      { step: "2 droppar I LOVE Facial Oil i lätt fuktig hud", product: "i-love-facial-oil", why: "Lipidåterställning + ECS-stöd" },
    ],
    evening: [
      { step: "DUO – rening", product: "duo-kit", why: "Mild och pH-balanserad – bevarar mikrobiom" },
      { step: "3 droppar THE ONE Facial Oil i kindområdet", product: "the-one-facial-oil", why: "Hjälper nattens reparationsfas" },
    ],
    weekly: [
      { step: "1x Fungtastic Mushroom Extract som mask", product: "fungtastic-mushroom-extract", frequency: "1 g/v", why: "Beta-glukaner stödjer mikrobiomet" },
    ],
  },
  products: [
    {
      id: "duo-ta-da",
      reason:
        "Du behöver hela rutinen: The ONE för dagen, I LOVE för kvällen och TA-DA Serum för att lugna mikrobiom och rodnad. Bundlen ger dig allt det och sparar dig 302 kr jämfört med separat köp.",
      usage: "DUO morgon + kväll. TA-DA på ren hud morgon innan olja.",
    },
    {
      id: "fungtastic-mushroom-extract",
      reason:
        "Adaptogena svampar som lions mane, chaga och cordyceps stödjer din kortisolrytm och mikrobiomdiversitet inifrån – två faktorer som är centrala för just din analys.",
      usage: "1 tsk i morgonkaffet eller smoothien.",
    },
    {
      id: "ta-da-serum",
      reason:
        "Ett separat alternativ om du vill prova TA-DA Serum först. Designad för mikrobiombalans, lyster och kindområdet – vilket är ditt största fokusområde.",
      usage: "1–2 pump på ren hud, morgon och vid behov kväll.",
    },
  ],
  ingredientWarnings: [
    {
      ingredient: "Retinol och retinyl-palmitat",
      why: "Stör barriär och mikrobiom hos rodnad-benägen blandhud.",
      alternativeApproach: "Stötta hudens egna förnyelseprocess via sömn + omega-3 + CBD/CBG.",
    },
    {
      ingredient: "Salicylsyra och AHA i hög koncentration",
      why: "Onödigt aggressivt för en hud som primärt behöver återhämtning.",
      alternativeApproach: "Använd milt enzymbaserat 1x/vecka istället.",
    },
    {
      ingredient: "Eteriska oljor (lavendel, citrus)",
      why: "Du rapporterar känslighet – risk för irritation.",
      alternativeApproach: "Välj produkter utan parfym eller eteriska oljor.",
    },
  ],
  progressTracking: {
    rephotoFrequency: "1x per vecka i samma ljus (morgonljus, framför fönster, ingen smink).",
    metricsToTrack: [
      "Hydrering (känsla 0–10) på morgonen",
      "Antal aktiva utbrott",
      "Lyster (0–10) på eftermiddagen",
      "Sömn-snitt veckan ut",
    ],
    journalingPrompts: [
      "Hur kände min hud sig idag?",
      "Vad åt jag som kan ha påverkat min hud?",
      "Hur sov jag?",
      "Vilken känsla dominerar denna vecka?",
    ],
  },
  redFlags: [
    "Plötsligt utbrott av symmetriska rodnader på halsen → boka tid hos hudläkare",
    "Mage som inte normaliserats efter 4 v → tarmrelaterad utredning kan vara värd",
  ],
  psychologicalNote:
    "Din hud är inte ett problem att lösa – den är en spegel av en livsstil som just nu pressar lite för hårt. Var snäll mot dig själv genom att göra detta i din takt. Konsekvens slår intensitet, alltid.",
  positiveAffirmation:
    "Din hud har redan klarat allt du har bett den om. Nu får den vila, näring och tid att blomma.",
  followUp: {
    recommendedRescanWeeks: 6,
    escalationCriteria: [
      "Om rodnaden blir större eller asymmetrisk inom 3 veckor",
      "Om akne försämras trots livsstilsförändringar",
      "Om du fortsätter sova mindre än 5 h/natt i 2 veckor i rad",
    ],
  },
  primaryCondition: {
    condition: "normal",
    confidence: "high",
    reasoning: "Frisk hud med stress-relaterade variationer. Inga tecken på dermatit eller rosacea.",
  },
};

export default async function PremiumPreviewPage() {
  if (!ENABLED) {
    notFound();
  }
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <p className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <strong>Preview-läge:</strong> Detta är en visuell QA-rendering av
        premium-rapporten med en realistisk demo-payload. Ingen betalning,
        ingen AI-generering, ingen DB-skrivning.
      </p>
      <PremiumReport
        result={DEMO_RESULT}
        email="demo@1753skin.com"
        analysisId={9999}
      />
    </main>
  );
}
