export interface Product {
  id: string;
  articleNumber: string;
  category: "oil" | "serum" | "kit" | "cleanser" | "supplement";
  name: string;
  price: number;
  originalPrice: number | null;
  reviews: number;
  image: string;
  imageAlt: string;
  shortDesc: string;
  description: string;
  ingredients: string | null;
  size: string | null;
  sizes?: string[];
  guarantee: string;
  vatRate: number;
}

export const PRODUCTS: Product[] = [
  {
    id: "duo-ta-da",
    articleNumber: "4004",
    category: "kit",
    name: "DUO-kit + TA-DA Serum",
    price: 1495,
    originalPrice: 2197,
    reviews: 238,
    image: "/New_Products/DUO+TA-DA.jpg",
    imageAlt: "/New_Products/DUO+TA-DAWoman.jpg",
    shortDesc:
      "Hela rutinen i ett. Tre produkter som stärker huden på djupet – inte bara förbättrar ytan.",
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
    ingredients: null,
    size: null,
    guarantee:
      "Fri frakt. 14 dagars öppet köp.",
    vatRate: 0.25,
  },
  {
    id: "ta-da-serum",
    articleNumber: "1005",
    category: "serum",
    name: "TA-DA Serum",
    price: 699,
    originalPrice: null,
    reviews: 20,
    image: "/New_Products/TA-DA.jpg",
    imageAlt: "/New_Products/TA-DAWoman.jpg",
    shortDesc:
      "CBG-berikat serum som låser in fukt och ger lyster. Din huds bästa kompis – oavsett årstid.",
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
    ingredients:
      "Simmondsia chinensis (Jojoba) Seed Oil (ekologisk), Cannabigerol (CBG, 3% / 1500 mg)",
    size: "30 ml",
    sizes: ["30 ml"],
    guarantee:
      "Fri frakt. 14 dagars öppet köp.",
    vatRate: 0.25,
  },
  {
    id: "duo-kit",
    articleNumber: "1003",
    category: "kit",
    name: "DUO-kit",
    price: 1099,
    originalPrice: 1498,
    reviews: 515,
    image: "/New_Products/DUO.jpg",
    imageAlt: "/New_Products/DUOwoman.jpg",
    shortDesc:
      "Två ansiktsoljor. En för morgonen, en för kvällen. Komplett hudvård som fungerar med din hud – inte mot den.",
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
    ingredients: null,
    size: "2 x 10 ml glasflaskor med pipett",
    guarantee:
      "Fri frakt. 14 dagars öppet köp.",
    vatRate: 0.25,
  },
  {
    id: "au-naturel-makeup-remover",
    articleNumber: "1004",
    category: "cleanser",
    name: "Au Naturel Makeup Remover",
    price: 399,
    originalPrice: null,
    reviews: 83,
    image: "/New_Products/MR.jpg",
    imageAlt: "/New_Products/MRwoman.jpg",
    shortDesc:
      "Rengöringsolja med MCT och CBD. Tar bort allt – utan att röra hudens naturliga balans.",
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
    ingredients:
      "Caprylic/Capric Triglyceride (MCT), Cannabidiol (CBD, 0,2%)",
    size: "100 ml",
    sizes: ["100 ml"],
    guarantee:
      "Fri frakt. 14 dagars öppet köp.",
    vatRate: 0.25,
  },
  {
    id: "fungtastic-mushroom-extract",
    articleNumber: "4001",
    category: "supplement",
    name: "Fungtastic Mushroom Extract",
    price: 377,
    originalPrice: null,
    reviews: 63,
    image: "/New_Products/Fungtastic.jpg",
    imageAlt: "/New_Products/Fungtasticwoman.jpg",
    shortDesc:
      "Fyra medicinska svampar i perfekt balans. Stöd för immunförsvar, fokus, energi och sömn – inifrån.",
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
    ingredients:
      "Chaga (25%), Lion's Mane (25%), Cordyceps (25%), Reishi (25%) – 400 mg per kapsel (15:1 extrakt). Betaglukaner: minst 20%.",
    size: "60 kapslar",
    sizes: ["60 kapslar"],
    guarantee:
      "Fri frakt. 14 dagars öppet köp.",
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
