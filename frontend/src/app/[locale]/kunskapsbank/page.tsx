import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/types";
import { locales } from "@/lib/i18n/types";
import { localizePath } from "@/lib/i18n/navigation";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const BASE_URL = "https://www.1753skin.com";

function tx(locale: string, sv: string, en: string, es?: string, de?: string, fr?: string): string {
  if (locale === "sv") return sv;
  if (locale === "es") return es || en;
  if (locale === "de") return de || en;
  if (locale === "fr") return fr || en;
  return en;
}

interface Term {
  id: string;
  term: string;
  altTerms?: string[];
  category: string;
  definition: string;
  longer: string;
  sameAs?: string;
  relatedSlugs?: string[];
}

/**
 * Knowledge hub entries. Structure is optimised for both LLM retrieval
 * (definition-style "X is Y that does Z") and Google's knowledge graph
 * (DefinedTerm schema, Wikidata sameAs links).
 */
const TERMS_SV: Term[] = [
  {
    id: "ecs",
    term: "Endocannabinoidsystemet (ECS)",
    altTerms: ["ECS"],
    category: "Biologi",
    definition:
      "Endocannabinoidsystemet är ett kroppseget signalsystem som reglerar balans i immunförsvar, inflammation, smärta, aptit, sömn och hudfunktion. I huden finns systemets CB1- och CB2-receptorer i keratinocyter, talgkörtlar och hårfolliklar.",
    longer:
      "ECS är en av anledningarna till att CBD och CBG fungerar topikalt – de är naturliga ligander till kroppens egna receptorer. När ECS är i balans regleras talgproduktion, inflammation och hudens barriärfunktion automatiskt. Dysreglering kopplas till akne, rosacea och eksem.",
    sameAs: "https://www.wikidata.org/wiki/Q901330",
  },
  {
    id: "cbd",
    term: "CBD (Cannabidiol)",
    category: "Ingredienser",
    definition:
      "CBD är en icke-psykoaktiv molekyl från industrihampa som interagerar med kroppens endocannabinoidsystem. I hudvård används den för sina antiinflammatoriska, talgbalanserande och barriärstärkande egenskaper.",
    longer:
      "1753 SKINCARE använder CBD vid kliniskt relevanta koncentrationer (0,2–10 %), inte spårmängder som är vanligt i massmarknaden. Vetenskaplig evidens visar effekter på talgceller (Oláh et al., J Clin Invest 2014) och på hudens immunförsvar. CBD från industrihampa med <0,2 % THC är lagligt i hela EU.",
    sameAs: "https://www.wikidata.org/wiki/Q422197",
  },
  {
    id: "cbg",
    term: "CBG (Cannabigerol)",
    category: "Ingredienser",
    definition:
      "CBG är moder-cannabinoiden från vilken andra cannabinoider syntetiseras i hampplantan. I hudvård används den för sina starka antioxidativa och hudlugnande effekter.",
    longer:
      "CBG är dyrare att utvinna än CBD eftersom plantan omvandlar den till andra cannabinoider under mognad. 1753 SKINCARE använder CBG i 0,2–5 % koncentration beroende på produkt. TA-DA Serum innehåller 3 % CBG (1 500 mg per flaska).",
    sameAs: "https://www.wikidata.org/wiki/Q5033195",
  },
  {
    id: "hudmikrobiom",
    term: "Hudmikrobiomet",
    category: "Biologi",
    definition:
      "Hudmikrobiomet är ekosystemet av bakterier, svampar och virus som lever på hudens yta. Ett balanserat mikrobiom produktionerar antimikrobiella peptider och håller hudens pH lågt.",
    longer:
      "Ett friskt mikrobiom domineras av kommensala arter som Staphylococcus epidermidis och Cutibacterium acnes i rätt mängd. Obalans (dysbios) är kopplad till akne, rosacea, eksem och atopisk dermatit. Överanvändning av antibakteriella produkter, surfaktanter och parfymer skadar mikrobiomet (Byrd et al., Nature Reviews Microbiology 2018).",
  },
  {
    id: "tarm-hud-axeln",
    term: "Tarm-hud-axeln",
    category: "Biologi",
    definition:
      "Tarm-hud-axeln är den dokumenterade tvåvägskopplingen mellan tarmens mikrobiom och hudens inflammation. Störningar i tarmen ger mätbara skillnader i hudtillstånd.",
    longer:
      "Forskning visar att personer med akne, rosacea och psoriasis ofta har förändrad tarmflora (dysbios). Probiotika och fiberrik kost förbättrar hudtillstånd i kontrollerade studier. 1753:s hudanalys väger in tarmhälsa som 30 % av livsstilsresultatet (Salem et al., Front Microbiol 2018).",
  },
  {
    id: "fitzpatrick",
    term: "Fitzpatrick-skalan",
    category: "Diagnostik",
    definition:
      "Fitzpatrick-skalan klassificerar hudtyp i sex grupper (I–VI) baserat på melaninhalt och reaktion på UV-strålning.",
    longer:
      "Skalan utvecklades 1975 av dermatologen Thomas B. Fitzpatrick på Harvard för att avgöra rätt UV-dos vid PUVA-behandling. Typ I är ljusast (alltid brännande, aldrig brun), typ VI mörkast (brun hud, brinner sällan). 1753:s hudanalys estimerar Fitzpatrick-typen automatiskt från din bild.",
    sameAs: "https://www.wikidata.org/wiki/Q1419373",
  },
  {
    id: "malassezia",
    term: "Malassezia",
    category: "Biologi",
    definition:
      "Malassezia är en grupp jästsvampar som finns naturligt på nästan all hud. I obalans kan de orsaka mjäll, seborroiskt eksem och svampaknerelaterade utslag.",
    longer:
      "Malassezia lever av talgens fettsyror. När hudbarriären är skadad eller talget oxiderat kan de överväxa och trigga inflammation. Det är därför vissa aknetyper inte svarar på vanliga aknekrämer – de behöver antijäst-behandling istället.",
  },
  {
    id: "keratinocyt",
    term: "Keratinocyt",
    category: "Biologi",
    definition:
      "Keratinocyter är hudens dominerande celltyp som producerar proteinet keratin och bygger hudens skyddande barriär. De utgör cirka 90 % av cellerna i överhuden.",
    longer:
      "Keratinocyter bildas i hudens basalskikt och vandrar uppåt i 28–40 dagar innan de stöts bort som döda hudceller. Störd omsättning (t.ex. vid psoriasis, solskada eller åldrande) ger torr, grov eller inflammerad hud.",
  },
  {
    id: "sebocyt",
    term: "Sebocyt",
    category: "Biologi",
    definition:
      "Sebocyter är de celler i talgkörtlarna som producerar sebum – hudens naturliga oljeblandning av triglycerider, vaxestrar och squalen.",
    longer:
      "Sebum skyddar huden från uttorkning och fungerar som antimikrobiell barriär. Överproduktion är central vid akne. CBD har dokumenterad sebostatisk effekt på mänskliga sebocyter (Oláh et al., J Clin Invest 2014).",
  },
  {
    id: "jojoba",
    term: "Jojobaolja (Simmondsia chinensis)",
    category: "Ingredienser",
    definition:
      "Jojobaolja är inte en olja utan en flytande vaxester, strukturellt mycket lik mänsklig sebum. Den är icke-komedogen (grad 0–2) och barriärkompatibel.",
    longer:
      "Jojobas kemi (vaxestrar istället för triglycerider) gör att den inte härsknar, tränger in i hudens övre skikt och inte täpper till porer. Det är därför 1753 använder ekologisk jojoba som bärare i alla oljor – den fungerar för både akne- och torrhudstyper.",
  },
  {
    id: "holistisk-hudvard",
    term: "Holistisk hudvård",
    category: "Filosofi",
    definition:
      "Holistisk hudvård är en helhetssyn där kost, sömn, stress, rörelse och tarmhälsa betraktas som primära faktorer för hudhälsa. Produkter är komplement, inte huvudbehandling.",
    longer:
      "Synsättet bygger på att huden är en spegel av inre biologiska processer. Studier visar att sömn under 6 timmar ger mätbart förhöjd kortisolnivå och försämrad hudregenerering inom 2 dygn. 1753:s hela filosofi utgår från detta.",
  },
];

const TERMS_EN: Term[] = [
  {
    id: "ecs",
    term: "Endocannabinoid system (ECS)",
    altTerms: ["ECS"],
    category: "Biology",
    definition:
      "The endocannabinoid system is a signalling network that regulates balance in immune function, inflammation, pain, appetite, sleep and skin function. In the skin, CB1 and CB2 receptors are present in keratinocytes, sebaceous glands and hair follicles.",
    longer:
      "The ECS is one reason CBD and CBG work topically — they are natural ligands for the body's own receptors. A balanced ECS self-regulates sebum, inflammation and barrier function. Dysregulation is linked to acne, rosacea and eczema.",
    sameAs: "https://www.wikidata.org/wiki/Q901330",
  },
  {
    id: "cbd",
    term: "CBD (Cannabidiol)",
    category: "Ingredients",
    definition:
      "CBD is a non-psychoactive molecule from industrial hemp that interacts with the endocannabinoid system. In skincare it is used for its anti-inflammatory, sebum-balancing and barrier-supporting properties.",
    longer:
      "1753 SKINCARE uses CBD at clinically relevant concentrations (0.2–10%), not the trace amounts typical in mass-market products. Peer-reviewed evidence shows effects on sebocytes (Oláh et al., J Clin Invest 2014) and on skin immune function. CBD from industrial hemp with <0.2% THC is legal throughout the EU.",
    sameAs: "https://www.wikidata.org/wiki/Q422197",
  },
  {
    id: "cbg",
    term: "CBG (Cannabigerol)",
    category: "Ingredients",
    definition:
      "CBG is the mother cannabinoid from which other cannabinoids are synthesised in the hemp plant. In skincare it is used for its strong antioxidant and calming effects.",
    longer:
      "CBG is more expensive to extract than CBD because the plant converts it into other cannabinoids as it matures. 1753 SKINCARE uses CBG at 0.2–5% depending on the product. TA-DA Serum contains 3% CBG (1 500 mg per bottle).",
    sameAs: "https://www.wikidata.org/wiki/Q5033195",
  },
  {
    id: "hudmikrobiom",
    term: "Skin microbiome",
    category: "Biology",
    definition:
      "The skin microbiome is the ecosystem of bacteria, fungi and viruses that live on the skin's surface. A balanced microbiome produces antimicrobial peptides and maintains low skin pH.",
    longer:
      "A healthy microbiome is dominated by commensals like Staphylococcus epidermidis and Cutibacterium acnes (in proper balance). Disruption (dysbiosis) is linked to acne, rosacea, eczema and atopic dermatitis. Over-use of antibacterial products, surfactants and fragrances damages the microbiome (Byrd et al., Nature Reviews Microbiology 2018).",
  },
  {
    id: "tarm-hud-axeln",
    term: "Gut-skin axis",
    category: "Biology",
    definition:
      "The gut-skin axis is the documented two-way link between gut microbiome balance and skin inflammation. Gut disturbances produce measurable differences in skin conditions.",
    longer:
      "People with acne, rosacea and psoriasis frequently show altered gut flora (dysbiosis). Probiotics and fibre-rich diets improve skin conditions in controlled trials. The 1753 skin analysis weights gut health as 30% of the lifestyle score (Salem et al., Front Microbiol 2018).",
  },
  {
    id: "fitzpatrick",
    term: "Fitzpatrick scale",
    category: "Diagnostics",
    definition:
      "The Fitzpatrick scale classifies skin type into six groups (I–VI) based on melanin content and UV reactivity.",
    longer:
      "Developed in 1975 by dermatologist Thomas B. Fitzpatrick at Harvard to determine correct UV dosing in PUVA therapy. Type I is the fairest (always burns, never tans), type VI the darkest (deeply pigmented, rarely burns). The 1753 skin analysis estimates Fitzpatrick type automatically from your photo.",
    sameAs: "https://www.wikidata.org/wiki/Q1419373",
  },
  {
    id: "malassezia",
    term: "Malassezia",
    category: "Biology",
    definition:
      "Malassezia is a group of yeasts that live naturally on almost all human skin. Out of balance, they cause dandruff, seborrhoeic dermatitis and fungal acne-like rashes.",
    longer:
      "Malassezia feed on sebum fatty acids. When the barrier is compromised or sebum oxidised, they can overgrow and trigger inflammation. This is why some acne types don't respond to conventional acne creams — they need antifungal treatment instead.",
  },
  {
    id: "keratinocyt",
    term: "Keratinocyte",
    category: "Biology",
    definition:
      "Keratinocytes are the dominant cell type in the skin, producing keratin protein and forming the protective barrier. They make up about 90% of cells in the epidermis.",
    longer:
      "Keratinocytes form in the basal layer and migrate upward over 28–40 days before shedding as dead skin cells. Disrupted turnover (in psoriasis, sun damage, ageing) produces dry, rough or inflamed skin.",
  },
  {
    id: "sebocyt",
    term: "Sebocyte",
    category: "Biology",
    definition:
      "Sebocytes are the cells in sebaceous glands that produce sebum — the skin's natural mix of triglycerides, wax esters and squalene.",
    longer:
      "Sebum protects the skin from dehydration and acts as an antimicrobial barrier. Over-production is central to acne. CBD has documented sebostatic action on human sebocytes (Oláh et al., J Clin Invest 2014).",
  },
  {
    id: "jojoba",
    term: "Jojoba oil (Simmondsia chinensis)",
    category: "Ingredients",
    definition:
      "Jojoba is not an oil but a liquid wax ester, structurally very similar to human sebum. It is non-comedogenic (rating 0–2) and barrier-compatible.",
    longer:
      "Jojoba's chemistry (wax esters instead of triglycerides) means it doesn't go rancid, penetrates the upper skin layers and doesn't clog pores. That is why 1753 uses organic jojoba as a carrier in every oil — it works for both acne- and dry-prone skin.",
  },
  {
    id: "holistisk-hudvard",
    term: "Holistic skincare",
    category: "Philosophy",
    definition:
      "Holistic skincare treats diet, sleep, stress, movement and gut health as primary factors for skin health. Products are a complement, not the main treatment.",
    longer:
      "Rooted in the view that skin is a mirror of underlying biological processes. Studies show that less than 6 hours of sleep measurably elevates cortisol and impairs skin regeneration within 48 hours. 1753's entire philosophy builds on this.",
  },
];

function getTerms(locale: string): Term[] {
  if (locale === "sv") return TERMS_SV;
  return TERMS_EN;
}

export default async function KnowledgeHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale;
  const terms = getTerms(l);

  const definedTermSchema = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": `${BASE_URL}/${l}/kunskapsbank#glossary`,
    name: tx(l, "Kunskapsbank 1753 SKINCARE", "1753 SKINCARE Knowledge Hub", "Base de Conocimiento 1753 SKINCARE", "1753 SKINCARE Wissensdatenbank", "Base de Connaissances 1753 SKINCARE"),
    inLanguage: l,
    hasDefinedTerm: terms.map((t) => ({
      "@type": "DefinedTerm",
      "@id": `${BASE_URL}/${l}/kunskapsbank#${t.id}`,
      name: t.term,
      description: t.definition,
      inDefinedTermSet: `${BASE_URL}/${l}/kunskapsbank#glossary`,
      termCode: t.id,
      ...(t.sameAs ? { sameAs: t.sameAs } : {}),
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: tx(l, "Hem", "Home", "Inicio", "Startseite", "Accueil"),
        item: `${BASE_URL}/${l}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: tx(l, "Kunskapsbank", "Knowledge Hub", "Base de Conocimiento", "Wissensdatenbank", "Base de Connaissances"),
        item: `${BASE_URL}/${l}/kunskapsbank`,
      },
    ],
  };

  const categories = Array.from(new Set(terms.map((t) => t.category)));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="relative overflow-hidden bg-[#f5f5f7] py-20 md:py-28">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#108474]">
            {tx(l, "Kunskapsbank", "Knowledge hub", "Base de conocimiento", "Wissensdatenbank", "Base de connaissances")}
          </p>
          <h1 className="max-w-3xl text-[2.2rem] font-bold leading-[1.15] tracking-tight text-[#1d1d1f] md:text-[2.8rem]">
            {tx(
              l,
              "Förstå begreppen bakom holistisk hudvård",
              "Understanding the concepts behind holistic skincare",
              "Comprende los conceptos detrás del cuidado holístico de la piel",
              "Die Konzepte hinter ganzheitlicher Hautpflege verstehen",
              "Comprendre les concepts des soins holistiques"
            )}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#515151] md:text-lg">
            {tx(
              l,
              "Från endocannabinoidsystemet till hudmikrobiomet – här hittar du klara, evidensbaserade definitioner av begrepp vi använder i våra produkter och i hudanalysen.",
              "From the endocannabinoid system to the skin microbiome — clear, evidence-based definitions of the concepts we use in our products and in the skin analysis.",
              "Desde el sistema endocannabinoide hasta el microbioma cutáneo: definiciones claras y basadas en evidencia de los conceptos que usamos en nuestros productos y en el análisis de la piel.",
              "Vom Endocannabinoid-System bis zum Hautmikrobiom — klare, evidenzbasierte Definitionen der Konzepte, die wir in unseren Produkten und in der Hautanalyse verwenden.",
              "Du système endocannabinoïde au microbiome cutané — des définitions claires et fondées sur des preuves des concepts utilisés dans nos produits et dans l'analyse de la peau."
            )}
          </p>

          <nav aria-label={tx(l, "Snabbnavigering", "Quick navigation", "Navegación rápida", "Schnellnavigation", "Navigation rapide")} className="mt-10 flex flex-wrap gap-2">
            {terms.map((t) => (
              <a
                key={t.id}
                href={`#${t.id}`}
                className="inline-flex items-center rounded-full border border-[#e6e6e6] bg-white px-4 py-2 text-xs font-medium text-[#1d1d1f] transition-all duration-300 hover:border-[#108474] hover:text-[#108474] hover:shadow-sm"
              >
                {t.term}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10">
          <div className="mx-auto max-w-4xl space-y-8">
            {categories.map((cat) => (
              <div key={cat}>
                <h2 className="mb-6 text-sm font-semibold uppercase tracking-[0.15em] text-[#766a62]">{cat}</h2>
                <dl className="space-y-6">
                  {terms
                    .filter((t) => t.category === cat)
                    .map((t) => (
                      <article
                        id={t.id}
                        key={t.id}
                        className="scroll-mt-24 rounded-3xl border border-[#e6e6e6] bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg md:p-8"
                      >
                        <dt className="flex flex-wrap items-baseline gap-3">
                          <h3 className="text-xl font-bold tracking-tight text-[#1d1d1f] md:text-2xl">
                            {t.term}
                          </h3>
                          {t.altTerms?.map((alt) => (
                            <span key={alt} className="text-xs text-[#766a62]">({alt})</span>
                          ))}
                        </dt>
                        <dd className="mt-4 text-base leading-relaxed text-[#1d1d1f]">
                          {t.definition}
                        </dd>
                        <dd className="mt-3 text-sm leading-relaxed text-[#515151]">
                          {t.longer}
                        </dd>
                        {t.sameAs && (
                          <dd className="mt-4">
                            <a
                              href={t.sameAs}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-[#108474] hover:underline"
                            >
                              {tx(l, "Mer om begreppet", "More about the concept", "Más sobre el concepto", "Mehr zum Begriff", "En savoir plus sur le concept")}
                              <ArrowRight className="h-3 w-3" />
                            </a>
                          </dd>
                        )}
                      </article>
                    ))}
                </dl>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#1d1d1f] py-16 md:py-20">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
              {tx(
                l,
                "Vill du veta mer?",
                "Want to dive deeper?",
                "¿Quieres saber más?",
                "Möchtest du mehr wissen?",
                "Envie d'en savoir plus ?"
              )}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/70">
              {tx(
                l,
                "Läs våra guider eller gör vår gratis hudanalys som använder samma vetenskapliga grund.",
                "Read our guides or try our free skin analysis, built on the same scientific foundation.",
                "Lee nuestras guías o prueba nuestro análisis de piel gratuito basado en los mismos fundamentos científicos.",
                "Lesen Sie unsere Ratgeber oder testen Sie unsere kostenlose Hautanalyse auf derselben wissenschaftlichen Grundlage.",
                "Lisez nos guides ou essayez notre analyse de peau gratuite fondée sur les mêmes bases scientifiques."
              )}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href={`/${l}/guide`}
                className="inline-flex h-[52px] items-center gap-2 rounded-full bg-[#108474] px-8 text-sm font-medium text-white transition-all duration-300 hover:bg-[#0d6e61]"
              >
                {tx(l, "Alla guider", "All guides", "Todas las guías", "Alle Ratgeber", "Tous les guides")}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={localizePath(l, "skinAnalysis")}
                className="inline-flex h-[52px] items-center gap-2 rounded-full border border-white/20 px-8 text-sm font-medium text-white transition-all duration-300 hover:border-white/40 hover:bg-white/5"
              >
                {tx(l, "Gratis hudanalys", "Free skin analysis", "Análisis gratis", "Kostenlose Hautanalyse", "Analyse gratuite")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
