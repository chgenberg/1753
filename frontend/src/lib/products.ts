import type { Locale } from "@/lib/i18n/types";

export interface Product {
  id: string;
  articleNumber: string;
  category: "oil" | "serum" | "kit" | "cleanser" | "supplement";
  name: string;
  nameEn?: string;
  price: number;
  priceEur: number;
  originalPrice: number | null;
  originalPriceEur: number | null;
  reviews: number;
  image: string;
  imageAlt: string;
  shortDesc: string;
  shortDescEn?: string;
  description: string;
  descriptionEn?: string;
  ingredients: string | null;
  ingredientsEn?: string | null;
  size: string | null;
  /** Localised size line for English PDP; falls back to `size` when absent. */
  sizeEn?: string | null;
  sizes?: string[];
  guarantee: string;
  guaranteeEn?: string;
  vatRate: number;
}

export const PRODUCTS: Product[] = [
  {
    id: "duo-ta-da",
    articleNumber: "4004",
    category: "kit",
    name: "DUO-kit + TA-DA Serum",
    nameEn: "DUO kit + TA-DA Serum",
    price: 1495,
    priceEur: 129,
    originalPrice: 2197,
    originalPriceEur: 189,
    reviews: 238,
    image: "/New_Products/DUO+TA-DA.jpg",
    imageAlt: "/New_Products/DUO+TA-DAWoman.jpg",
    shortDesc:
      "Hela rutinen i ett. Tre produkter som stärker huden på djupet – inte bara förbättrar ytan.",
    shortDescEn:
      "The full routine in one. Three products that strengthen skin deeply – not just the surface.",
    description: `<p>Det här är inte ytterligare en hudvårdsrutin. Det här är den enda du behöver.</p>
<p>Tre produkter. Ett syfte: en hud som fungerar bättre på egen hand. Lugnare, starkare, mer motståndskraftig – utan att du behöver tänka på det.</p>

<h3>Varför den här rutinen funkar</h3>
<p>Produkterna är utvecklade för att samverka med hudens egna system – särskilt endocannabinoidsystemet och den mikrobiella balansen. Två faktorer som avgör om din hud klarar sig själv eller ständigt behöver räddas.</p>
<p>Det är hudvård som jobbar med kroppen. Inte mot den.</p>

<h3>Produkterna i kitet</h3>
<p><strong>The ONE Facial Oil</strong> – Din dagliga olja. 10% CBD och 0,2% CBG som skyddar, återfuktar och stärker hudbarriären. Ger huden ett jämnt, friskt uttryck utan att kännas tung. Perfekt för alla hudtyper.</p>
<p><strong>I LOVE Facial Oil</strong> – Kvällens återhämtning. 10% CBD och 5% CBG som lugnar, reparerar och djupåterfuktar medan du sover. Gör störst skillnad för stressad, känslig eller obalanserad hud.</p>
<p><strong>TA-DA Serum</strong> – Boosten som förstärker allt. 3% CBG i ekologisk jojobaolja som appliceras efter oljan. Låser in fukt, ger lyster och stöttar hudens återhämtning.</p>

<h3>Så använder du rutinen</h3>
<p><strong>Morgon:</strong> Skölj ansiktet med ljummet vatten. 3–4 droppar The ONE Facial Oil. 1–2 pump TA-DA Serum.</p>
<p><strong>Kväll:</strong> Rengör huden varsamt. 3–4 droppar I LOVE Facial Oil. 1–2 pump TA-DA Serum.</p>
<p><em>Serumet appliceras efter oljan – inte före. Det gör att huden tar upp näringen mer effektivt.</em></p>`,
    descriptionEn: `<p>This is not another skincare routine. This is the only one you need.</p>
<p>Three products. One goal: skin that works better on its own. Calmer, stronger, more resilient – without you having to think about it.</p>

<h3>Why this routine works</h3>
<p>The formulas are built to work with your skin’s own systems – especially the endocannabinoid system and microbial balance. Two factors that decide whether your skin can take care of itself or constantly needs rescuing.</p>
<p>It is skincare that works with the body. Not against it.</p>

<h3>What’s in the kit</h3>
<p><strong>The ONE Facial Oil</strong> – Your daily oil. 10% CBD and 0.2% CBG to protect, hydrate and strengthen the barrier. Leaves skin looking even and fresh without feeling heavy. Suitable for all skin types.</p>
<p><strong>I LOVE Facial Oil</strong> – Evening recovery. 10% CBD and 5% CBG to calm, repair and deeply hydrate while you sleep. Makes the biggest difference for stressed, sensitive or unbalanced skin.</p>
<p><strong>TA-DA Serum</strong> – The boost that amplifies everything. 3% CBG in organic jojoba oil, applied after your oil. Locks in moisture, adds glow and supports the skin’s recovery.</p>

<h3>How to use it</h3>
<p><strong>Morning:</strong> Rinse with lukewarm water. 3–4 drops of The ONE Facial Oil. 1–2 pumps of TA-DA Serum.</p>
<p><strong>Evening:</strong> Cleanse gently. 3–4 drops of I LOVE Facial Oil. 1–2 pumps of TA-DA Serum.</p>
<p><em>Apply serum after oil – not before. That way the skin absorbs nutrients more effectively.</em></p>`,
    ingredients: null,
    size: null,
    guarantee:
      "Fri frakt.",
    guaranteeEn: "Free shipping.",
    vatRate: 0.25,
  },
  {
    id: "ta-da-serum",
    articleNumber: "1005",
    category: "serum",
    name: "TA-DA Serum",
    nameEn: "TA-DA Serum",
    price: 699,
    priceEur: 59,
    originalPrice: null,
    originalPriceEur: null,
    reviews: 20,
    image: "/New_Products/TA-DA.jpg",
    imageAlt: "/New_Products/TA-DAWoman.jpg",
    shortDesc:
      "CBG-berikat serum som låser in fukt och ger lyster. Din huds bästa kompis – oavsett årstid.",
    shortDescEn:
      "CBG-powered serum that locks in moisture and adds glow. Your skin’s best friend in any season.",
    description: `<p>Torr hud? Det behöver inte vara så. TA-DA Serum är framtaget för att göra en sak riktigt bra: ge din hud fukt som faktiskt stannar kvar.</p>

<h3>Kraften i CBG</h3>
<p>I hjärtat av serumet finns CBG (Cannabigerol) – en kraftfull ingrediens som samarbetar med hudens eget endocannabinoidsystem. Resultatet? Bättre fuktbalans, mindre fuktförlust och en hud som trivs även när klimatet inte gör det.</p>

<h3>Det här får du</h3>
<ul>
<li>Fukt som stannar – inte avdunstar efter en timme</li>
<li>Mindre inflammation och rodnad</li>
<li>Förbättrad elasticitet och fasthet</li>
<li>Synlig lyster redan efter första veckorna</li>
</ul>

<h3>Så använder du serumet</h3>
<p><strong>Morgon:</strong> 3–4 droppar The ONE Facial Oil, följt av 1–2 pump TA-DA Serum.</p>
<p><strong>Kväll:</strong> 3–4 droppar I LOVE Facial Oil, följt av 1–2 pump TA-DA Serum.</p>
<p><em>Serumet appliceras efter oljan för bäst resultat.</em></p>

<h3>Varför 3% CBG?</h3>
<p>Med 1500 mg CBG per flaska i ekologisk jojobaolja får du ett serum med kraftfulla antioxidantegenskaper – perfekt för torr, känslig eller inflammerad hud. Ingen utfyllnad. Bara det huden faktiskt behöver.</p>`,
    descriptionEn: `<p>Dry skin? It doesn’t have to be that way. TA-DA Serum is made to do one thing really well: give your skin moisture that actually stays put.</p>

<h3>The power of CBG</h3>
<p>At the heart of the serum is CBG (cannabigerol) – a potent ingredient that works with your skin’s own endocannabinoid system. The result? Better moisture balance, less water loss and skin that copes even when the climate doesn’t.</p>

<h3>What you get</h3>
<ul>
<li>Moisture that stays – doesn’t evaporate after an hour</li>
<li>Less inflammation and redness</li>
<li>Improved elasticity and firmness</li>
<li>Visible glow within the first weeks</li>
</ul>

<h3>How to use the serum</h3>
<p><strong>Morning:</strong> 3–4 drops of The ONE Facial Oil, then 1–2 pumps of TA-DA Serum.</p>
<p><strong>Evening:</strong> 3–4 drops of I LOVE Facial Oil, then 1–2 pumps of TA-DA Serum.</p>
<p><em>For best results, apply serum after oil.</em></p>

<h3>Why 3% CBG?</h3>
<p>With 1500 mg CBG per bottle in organic jojoba oil you get a serum with strong antioxidant properties – ideal for dry, sensitive or inflamed skin. No filler. Only what skin actually needs.</p>`,
    ingredients:
      "Simmondsia chinensis (Jojoba) Seed Oil (ekologisk), Cannabigerol (CBG, 3% / 1500 mg)",
    ingredientsEn:
      "Simmondsia chinensis (Jojoba) Seed Oil (organic), Cannabigerol (CBG, 3% / 1500 mg)",
    size: "30 ml",
    sizeEn: "30 ml",
    sizes: ["30 ml"],
    guarantee:
      "Fri frakt.",
    guaranteeEn: "Free shipping.",
    vatRate: 0.25,
  },
  {
    id: "duo-kit",
    articleNumber: "1003",
    category: "kit",
    name: "DUO-kit",
    nameEn: "DUO kit",
    price: 1099,
    priceEur: 95,
    originalPrice: 1498,
    originalPriceEur: 129,
    reviews: 515,
    image: "/New_Products/DUO.jpg",
    imageAlt: "/New_Products/DUOwoman.jpg",
    shortDesc:
      "Två ansiktsoljor. En för morgonen, en för kvällen. Komplett hudvård som fungerar med din hud – inte mot den.",
    shortDescEn:
      "Two face oils: one for morning, one for evening. Complete care that works with your skin – not against it.",
    description: `<p>En olja för dagen. En för natten. Mer behöver det inte vara.</p>
<p>DUO-kitet ger dig en komplett hudvårdsrutin som är enkel, effektiv och utvecklad för att stärka huden – inte göra den beroende av fler produkter.</p>

<h3>The ONE Facial Oil – morgonen</h3>
<p>10% CBD och 0,2% CBG. Skyddar hudbarriären, återfuktar på djupet och ger ett jämnt, friskt uttryck. Lätt formula som fungerar för alla hudtyper – fet, torr, känslig eller blandad.</p>
<ul>
<li>Mindre inflammationer och rodnad</li>
<li>Starkare hudbarriär</li>
<li>Synlig glow och lyster</li>
<li>Djup återfuktning utan tyngd</li>
</ul>

<h3>I LOVE Facial Oil – kvällen</h3>
<p>10% CBD och 5% CBG. Natten är hudens tid att återhämta sig. Den här oljan lugnar, reparerar och djupåterfuktar medan du sover. Extra kraftfull för stressad, känslig eller obalanserad hud.</p>
<ul>
<li>Reparerar och lugnar över natten</li>
<li>Djupgående återfuktning med 5% CBG</li>
<li>Ökad elasticitet och fasthet</li>
<li>Mjukare, jämnare hud redan efter veckor</li>
</ul>

<h3>Så använder du kitet</h3>
<p><strong>Morgon:</strong> Applicera 3–4 droppar The ONE Facial Oil på ren hud.</p>
<p><strong>Kväll:</strong> Applicera 3–4 droppar I LOVE Facial Oil på ren hud.</p>
<p><em>Tänk "The ONE I LOVE" för att komma ihåg ordningen.</em></p>`,
    descriptionEn: `<p>One oil for day. One for night. It doesn’t need to be more complicated than that.</p>
<p>The DUO kit gives you a complete routine that is simple, effective and built to strengthen skin – not make it dependent on more products.</p>

<h3>The ONE Facial Oil – morning</h3>
<p>10% CBD and 0.2% CBG. Protects the barrier, hydrates deeply and leaves an even, fresh look. A light formula for all skin types – oily, dry, sensitive or combination.</p>
<ul>
<li>Less inflammation and redness</li>
<li>Stronger barrier</li>
<li>Visible glow</li>
<li>Deep hydration without heaviness</li>
</ul>

<h3>I LOVE Facial Oil – evening</h3>
<p>10% CBD and 5% CBG. Night is when skin recovers. This oil calms, repairs and deeply hydrates while you sleep. Extra strength for stressed, sensitive or unbalanced skin.</p>
<ul>
<li>Repairs and calms overnight</li>
<li>Deep hydration with 5% CBG</li>
<li>Improved elasticity and firmness</li>
<li>Softer, more even skin in just weeks</li>
</ul>

<h3>How to use the kit</h3>
<p><strong>Morning:</strong> Apply 3–4 drops of The ONE Facial Oil to clean skin.</p>
<p><strong>Evening:</strong> Apply 3–4 drops of I LOVE Facial Oil to clean skin.</p>
<p><em>Think “The ONE I LOVE” to remember the order.</em></p>`,
    ingredients: null,
    size: "2 x 10 ml glasflaskor med pipett",
    sizeEn: "2 × 10 ml glass bottles with dropper",
    guarantee:
      "Fri frakt.",
    guaranteeEn: "Free shipping.",
    vatRate: 0.25,
  },
  {
    id: "au-naturel-makeup-remover",
    articleNumber: "1004",
    category: "cleanser",
    name: "Au Naturel Makeup Remover",
    nameEn: "Au Naturel Makeup Remover",
    price: 399,
    priceEur: 34,
    originalPrice: null,
    originalPriceEur: null,
    reviews: 83,
    image: "/New_Products/MR.jpg",
    imageAlt: "/New_Products/MRwoman.jpg",
    shortDesc:
      "Rengöringsolja med MCT och CBD. Tar bort allt – utan att röra hudens naturliga balans.",
    shortDescEn:
      "Cleansing oil with MCT and CBD. Removes everything – without disturbing your skin’s natural balance.",
    description: `<p>De flesta rengöringsprodukter tar bort smuts men skadar hudens naturliga funktioner i processen. Det här är inte en av dem.</p>
<p>Au Naturel löser upp makeup, smuts och luftföroreningar – utan att störa hudens mikrobiom eller endocannabinoidsystem. Din hud lämnas ren, mjuk och redo.</p>

<h3>Bara två ingredienser</h3>
<p><strong>MCT (Caprylic/Capric Triglyceride)</strong> – En lätt olja som binder till fett och smuts utan att täppa till porerna.</p>
<p><strong>CBD (Cannabidiol, 0,2%)</strong> – Lugnar, återfuktar och förbättrar hudens elasticitet. Gör rengöringen till hudvård i sig.</p>

<h3>Det här får du</h3>
<ul>
<li>Ren hud utan den strama känslan</li>
<li>Djup återfuktning redan vid rengöring</li>
<li>Ökad elasticitet och fasthet</li>
<li>Bevarad mikrobiell mångfald</li>
</ul>

<h3>Så använder du den</h3>
<p>Applicera några droppar på ansiktet. Massera in. Avlägsna med en varm, fuktig handduk eller bomullspad. Följ upp med ansiktsolja.</p>`,
    descriptionEn: `<p>Most cleansers remove dirt but damage the skin in the process. This isn’t one of them.</p>
<p>Au Naturel dissolves makeup, grime and pollution – without disrupting the microbiome or endocannabinoid system. Skin is left clean, soft and ready.</p>

<h3>Just two ingredients</h3>
<p><strong>MCT (caprylic/capric triglyceride)</strong> – A light oil that binds to sebum and dirt without clogging pores.</p>
<p><strong>CBD (cannabidiol, 0.2%)</strong> – Calms, hydrates and supports elasticity. Cleansing becomes skincare.</p>

<h3>What you get</h3>
<ul>
<li>Clean skin without that tight feeling</li>
<li>Deep hydration already at the cleanse step</li>
<li>Improved elasticity and firmness</li>
<li>Microbial diversity stays intact</li>
</ul>

<h3>How to use it</h3>
<p>Apply a few drops to the face. Massage in. Remove with a warm, damp cloth or cotton pad. Follow with face oil.</p>`,
    ingredients:
      "Caprylic/Capric Triglyceride (MCT), Cannabidiol (CBD, 0,2%)",
    ingredientsEn: "Caprylic/Capric Triglyceride (MCT), Cannabidiol (CBD, 0.2%)",
    size: "100 ml",
    sizeEn: "100 ml",
    sizes: ["100 ml"],
    guarantee:
      "Fri frakt.",
    guaranteeEn: "Free shipping.",
    vatRate: 0.25,
  },
  {
    id: "fungtastic-mushroom-extract",
    articleNumber: "4001",
    category: "supplement",
    name: "Fungtastic Mushroom Extract",
    nameEn: "Fungtastic Mushroom Extract",
    price: 377,
    priceEur: 32,
    originalPrice: null,
    originalPriceEur: null,
    reviews: 63,
    image: "/New_Products/Fungtastic.jpg",
    imageAlt: "/New_Products/Fungtasticwoman.jpg",
    shortDesc:
      "Fyra medicinska svampar i perfekt balans. Stöd för immunförsvar, fokus, energi och sömn – inifrån.",
    shortDescEn:
      "Four medicinal mushrooms in balance. Support for immunity, focus, energy and sleep – from within.",
    description: `<p>Bra hud börjar inifrån. Fungtastic kombinerar fyra av naturens mest kraftfulla medicinska svampar för att stödja kroppen där det verkligen räknas.</p>

<h3>Fyra svampar – fyra superkrafter</h3>
<ul>
<li><strong>Chaga (25%)</strong> – Immunförsvarets bästa vän. Fullpackad med antioxidanter och Betulinic Acid som stödjer hudens endocannabinoidsystem inifrån.</li>
<li><strong>Lion's Mane (25%)</strong> – Hjärnans favorit. Boostar fokus, minne och mental klarhet.</li>
<li><strong>Cordyceps (25%)</strong> – Kroppens energikälla. Höjer uthållighet och fysisk prestation.</li>
<li><strong>Reishi (25%)</strong> – Lugnet i stormen. Främjar avslappning och djupare sömn.</li>
</ul>

<h3>Varför just dessa svampar?</h3>
<p>Allt började med Chaga och dess innehåll av Betulinic Acid – ett ämne som stödjer kroppens endocannabinoidsystem på samma sätt som CBD gör för huden. Därifrån upptäckte vi Lion's Mane, Cordyceps och Reishi – fyra svampar som tillsammans ger kroppen en helhetsboost.</p>

<h3>Så tar du dem</h3>
<p>2 kapslar dagligen. De flesta känner skillnad efter 2–4 veckor.</p>
<p>400 mg per kapsel (15:1 extrakt). Minst 20% betaglukaner. 100% ekologiskt.</p>

<p><em>Undvik om du är gravid, ammande eller allergisk mot någon ingrediens.</em></p>`,
    descriptionEn: `<p>Great skin starts from within. Fungtastic blends four of nature’s most potent medicinal mushrooms to support the body where it really matters.</p>

<h3>Four mushrooms – four strengths</h3>
<ul>
<li><strong>Chaga (25%)</strong> – Immune support. Packed with antioxidants and betulinic acid that complements the endocannabinoid system from the inside.</li>
<li><strong>Lion’s Mane (25%)</strong> – Focus and clarity. Supports memory and mental sharpness.</li>
<li><strong>Cordyceps (25%)</strong> – Energy and stamina. Supports endurance and physical performance.</li>
<li><strong>Reishi (25%)</strong> – Calm and recovery. Supports relaxation and deeper sleep.</li>
</ul>

<h3>Why these mushrooms?</h3>
<p>It started with Chaga and betulinic acid – a compound that supports the body’s endocannabinoid system much like CBD does for the skin. From there we brought in Lion’s Mane, Cordyceps and Reishi – four mushrooms that work together for a whole-body boost.</p>

<h3>How to take them</h3>
<p>2 capsules daily. Most people notice a difference after 2–4 weeks.</p>
<p>400 mg per capsule (15:1 extract). At least 20% beta-glucans. 100% organic.</p>

<p><em>Avoid if pregnant, breastfeeding or allergic to any ingredient.</em></p>`,
    ingredients:
      "Chaga (25%), Lion's Mane (25%), Cordyceps (25%), Reishi (25%) – 400 mg per kapsel (15:1 extrakt). Betaglukaner: minst 20%.",
    ingredientsEn:
      "Chaga (25%), Lion's Mane (25%), Cordyceps (25%), Reishi (25%) – 400 mg per capsule (15:1 extract). Beta-glucans: at least 20%.",
    size: "60 kapslar",
    sizeEn: "60 capsules",
    sizes: ["60 kapslar"],
    guarantee:
      "Fri frakt.",
    guaranteeEn: "Free shipping.",
    vatRate: 0.12,
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getRelatedProducts(id: string, count = 3): Product[] {
  const product = getProduct(id);
  if (!product) return PRODUCTS.slice(0, count);
  return PRODUCTS.filter(
    (p) => p.id !== id && (p.category === product.category || true)
  ).slice(0, count);
}

export function productDisplayName(p: Product, locale: Locale): string {
  if (locale === "en" && p.nameEn) return p.nameEn;
  return p.name;
}

export function productShortDesc(p: Product, locale: Locale): string {
  if (locale === "en" && p.shortDescEn) return p.shortDescEn;
  return p.shortDesc;
}

export function productDescriptionHtml(p: Product, locale: Locale): string {
  if (locale === "en" && p.descriptionEn) return p.descriptionEn;
  return p.description;
}

export function productIngredients(p: Product, locale: Locale): string | null {
  if (locale === "en" && p.ingredientsEn !== undefined) return p.ingredientsEn;
  return p.ingredients;
}

export function productGuarantee(p: Product, locale: Locale): string {
  if (locale === "en" && p.guaranteeEn) return p.guaranteeEn;
  return p.guarantee;
}

export function productSize(p: Product, locale: Locale): string | null {
  if (locale === "en" && p.sizeEn != null && p.sizeEn !== "") return p.sizeEn;
  return p.size;
}

export function productPrice(p: Product, locale: Locale): number {
  return locale === "en" ? p.priceEur : p.price;
}

export function productOriginalPrice(p: Product, locale: Locale): number | null {
  return locale === "en" ? p.originalPriceEur : p.originalPrice;
}
