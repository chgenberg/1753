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
  shortDescEs?: string;
  shortDescDe?: string;
  shortDescFr?: string;
  description: string;
  descriptionEn?: string;
  descriptionEs?: string;
  descriptionDe?: string;
  descriptionFr?: string;
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
      "The full routine in one: three products that help skin become calmer, stronger and more resilient.",
    shortDescEs:
      "La rutina completa en un solo paso: tres productos que ayudan a tu piel a estar más tranquila, fuerte y resistente.",
    shortDescDe:
      "Die komplette Routine in einem: drei Produkte, die deiner Haut helfen, ruhiger, stärker und widerstandsfähiger zu werden.",
    shortDescFr:
      "La routine complète en un seul geste : trois produits qui aident ta peau à devenir plus calme, plus forte et plus résistante.",
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
    descriptionEn: `<p>This is not another skincare routine. It is the one that earns its place.</p>
<p>Three products. One goal: skin that works better on its own. Calmer, stronger and more resilient, without turning your bathroom shelf into a full-time job.</p>

<h3>Why this routine works</h3>
<p>The formulas are made to work with your skin’s own systems, especially the endocannabinoid system and microbial balance. Those two factors often decide whether skin can stay steady on its own or keep swinging out of balance.</p>
<p>This is skincare that works with the body, not against it.</p>

<h3>What’s in the kit</h3>
<p><strong>The ONE Facial Oil</strong> – Your daytime oil. 10% CBD and 0.2% CBG help protect, hydrate and strengthen the barrier. Skin looks fresher and more even, without feeling greasy or heavy. Suitable for all skin types.</p>
<p><strong>I LOVE Facial Oil</strong> – Your evening reset. 10% CBD and 5% CBG help calm, repair and deeply hydrate while you sleep. Especially helpful for stressed, sensitive or unbalanced skin.</p>
<p><strong>TA-DA Serum</strong> – The finishing boost. 3% CBG in organic jojoba oil, applied after your facial oil. It helps lock in moisture, add glow and support recovery.</p>

<h3>How to use it</h3>
<p><strong>Morning:</strong> Rinse with lukewarm water. 3–4 drops of The ONE Facial Oil. 1–2 pumps of TA-DA Serum.</p>
<p><strong>Evening:</strong> Cleanse gently. 3–4 drops of I LOVE Facial Oil. 1–2 pumps of TA-DA Serum.</p>
<p><em>Apply the serum after your oil, not before. That helps the skin hold on to the nourishing oils more effectively.</em></p>`,
    descriptionEs: `<p>Esto no es otra rutina de cuidado facial. Es la única que necesitas.</p>
<p>Tres productos. Un objetivo: una piel que funcione mejor por sí sola. Más tranquila, más fuerte y más resistente, sin convertir tu baño en un segundo trabajo.</p>

<h3>Por qué esta rutina funciona</h3>
<p>Las fórmulas están diseñadas para trabajar con los propios sistemas de tu piel, especialmente el sistema endocannabinoide y el equilibrio microbiano. Esos dos factores suelen decidir si tu piel se mantiene estable o no para de descontrolarse.</p>
<p>Esto es cuidado que trabaja con tu cuerpo. No en su contra.</p>

<h3>Qué incluye el kit</h3>
<p><strong>The ONE Facial Oil</strong> – Tu aceite de día. 10% CBD y 0,2% CBG que protegen, hidratan y refuerzan la barrera cutánea. La piel se ve más fresca y uniforme, sin sensación grasa ni pesada. Apto para todo tipo de piel.</p>
<p><strong>I LOVE Facial Oil</strong> – Tu reinicio nocturno. 10% CBD y 5% CBG que calman, reparan e hidratan en profundidad mientras duermes. Especialmente útil para pieles estresadas, sensibles o desequilibradas.</p>
<p><strong>TA-DA Serum</strong> – El impulso final. 3% CBG en aceite de jojoba ecológico, se aplica después del aceite facial. Sella la hidratación, aporta luminosidad y apoya la recuperación de la piel.</p>

<h3>Cómo usarla</h3>
<p><strong>Mañana:</strong> Enjuaga con agua tibia. 3–4 gotas de The ONE Facial Oil. 1–2 pulsaciones de TA-DA Serum.</p>
<p><strong>Noche:</strong> Limpia suavemente. 3–4 gotas de I LOVE Facial Oil. 1–2 pulsaciones de TA-DA Serum.</p>
<p><em>Aplica el sérum después del aceite, no antes. Así tu piel retiene mejor los aceites nutritivos.</em></p>`,
    descriptionDe: `<p>Das hier ist keine weitere Hautpflegeroutine. Es ist die einzige, die du brauchst.</p>
<p>Drei Produkte. Ein Ziel: Haut, die von selbst besser funktioniert. Ruhiger, stärker und widerstandsfähiger, ohne dass dein Badezimmerregal zum Vollzeitjob wird.</p>

<h3>Warum diese Routine funktioniert</h3>
<p>Die Formeln sind darauf ausgelegt, mit den eigenen Systemen deiner Haut zusammenzuarbeiten, insbesondere dem Endocannabinoid-System und dem mikrobiellen Gleichgewicht. Diese beiden Faktoren entscheiden oft, ob die Haut stabil bleibt oder ständig aus der Balance gerät.</p>
<p>Das ist Pflege, die mit deinem Körper arbeitet. Nicht gegen ihn.</p>

<h3>Was im Kit enthalten ist</h3>
<p><strong>The ONE Facial Oil</strong> – Dein Tagesöl. 10% CBD und 0,2% CBG schützen, spenden Feuchtigkeit und stärken die Hautbarriere. Die Haut sieht frischer und ebenmäßiger aus, ohne fettig oder schwer zu wirken. Für alle Hauttypen geeignet.</p>
<p><strong>I LOVE Facial Oil</strong> – Dein Abend-Reset. 10% CBD und 5% CBG beruhigen, reparieren und spenden intensive Feuchtigkeit, während du schläfst. Besonders hilfreich bei gestresster, empfindlicher oder unausgeglichener Haut.</p>
<p><strong>TA-DA Serum</strong> – Der krönende Boost. 3% CBG in Bio-Jojobaöl, wird nach dem Gesichtsöl aufgetragen. Es hilft, Feuchtigkeit einzuschließen, Glow zu verleihen und die Regeneration zu unterstützen.</p>

<h3>So verwendest du die Routine</h3>
<p><strong>Morgens:</strong> Mit lauwarmem Wasser abspülen. 3–4 Tropfen The ONE Facial Oil. 1–2 Pumpstöße TA-DA Serum.</p>
<p><strong>Abends:</strong> Sanft reinigen. 3–4 Tropfen I LOVE Facial Oil. 1–2 Pumpstöße TA-DA Serum.</p>
<p><em>Das Serum kommt nach dem Öl, nicht davor. So kann die Haut die nährenden Öle besser aufnehmen.</em></p>`,
    descriptionFr: `<p>Ceci n'est pas une énième routine de soin. C'est la seule dont tu as vraiment besoin.</p>
<p>Trois produits. Un seul objectif : une peau qui fonctionne mieux toute seule. Plus calme, plus forte, plus résistante – sans transformer ton étagère de salle de bain en usine à gaz.</p>

<h3>Pourquoi cette routine fonctionne</h3>
<p>Les formules sont conçues pour travailler avec les propres systèmes de ta peau, en particulier le système endocannabinoïde et l'équilibre microbien. Ces deux facteurs déterminent souvent si ta peau tient le coup seule ou ne cesse de se dérégler.</p>
<p>C'est du soin qui travaille avec ton corps. Pas contre lui.</p>

<h3>Ce que contient le kit</h3>
<p><strong>The ONE Facial Oil</strong> – Ton huile de jour. 10% CBD et 0,2% CBG qui protègent, hydratent et renforcent la barrière cutanée. La peau paraît plus fraîche et plus uniforme, sans effet gras ni lourd. Convient à tous les types de peau.</p>
<p><strong>I LOVE Facial Oil</strong> – Ton reset du soir. 10% CBD et 5% CBG qui apaisent, réparent et hydratent en profondeur pendant que tu dors. Particulièrement utile pour les peaux stressées, sensibles ou déséquilibrées.</p>
<p><strong>TA-DA Serum</strong> – Le boost final. 3% CBG dans de l'huile de jojoba bio, à appliquer après ton huile visage. Il aide à sceller l'hydratation, apporter de l'éclat et soutenir la récupération.</p>

<h3>Comment utiliser la routine</h3>
<p><strong>Matin :</strong> Rince à l'eau tiède. 3–4 gouttes de The ONE Facial Oil. 1–2 pressions de TA-DA Serum.</p>
<p><strong>Soir :</strong> Nettoie délicatement. 3–4 gouttes de I LOVE Facial Oil. 1–2 pressions de TA-DA Serum.</p>
<p><em>Applique le sérum après l'huile, pas avant. Cela permet à ta peau de mieux retenir les huiles nourrissantes.</em></p>`,
    ingredients: null,
    size: null,
    guarantee:
      "Fri frakt.",
    guaranteeEn: "Free shipping over €60.",
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
      "A CBG-powered serum that seals in moisture and adds glow, whatever the season.",
    shortDescEs:
      "Un sérum con CBG que sella la hidratación y aporta luminosidad, sea cual sea la estación.",
    shortDescDe:
      "Ein CBG-Serum, das Feuchtigkeit einschließt und Glow verleiht – zu jeder Jahreszeit.",
    shortDescFr:
      "Un sérum au CBG qui scelle l'hydratation et apporte de l'éclat, quelle que soit la saison.",
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
    descriptionEn: `<p>Dry skin does not need another temporary fix. TA-DA Serum is made to do one thing really well: help your skin hold on to moisture that actually stays.</p>

<h3>The power of CBG</h3>
<p>At the heart of the serum is CBG (cannabigerol), a powerful ingredient that works with your skin’s own endocannabinoid system. The result: better moisture balance, less water loss, and skin that still behaves when the weather doesn’t.</p>

<h3>What you get</h3>
<ul>
<li>Moisture that stays instead of disappearing after an hour</li>
<li>Less inflammation and redness</li>
<li>Improved elasticity and firmness</li>
<li>Visible glow within the first few weeks</li>
</ul>

<h3>How to use the serum</h3>
<p><strong>Morning:</strong> 3–4 drops of The ONE Facial Oil, then 1–2 pumps of TA-DA Serum.</p>
<p><strong>Evening:</strong> 3–4 drops of I LOVE Facial Oil, then 1–2 pumps of TA-DA Serum.</p>
<p><em>For best results, apply serum after oil.</em></p>

<h3>Why 3% CBG?</h3>
<p>With 1500 mg of CBG per bottle in organic jojoba oil, this is a concentrated serum with strong antioxidant support for dry, sensitive or inflamed skin. No filler. Just what skin actually needs.</p>`,
    descriptionEs: `<p>La piel seca no necesita otro parche temporal. TA-DA Serum está hecho para hacer una cosa realmente bien: ayudar a tu piel a retener la hidratación de verdad.</p>

<h3>El poder del CBG</h3>
<p>En el corazón del sérum está el CBG (cannabigerol), un ingrediente potente que trabaja con el sistema endocannabinoide de tu propia piel. El resultado: mejor equilibrio de hidratación, menos pérdida de agua y una piel que se comporta incluso cuando el clima no ayuda.</p>

<h3>Lo que consigues</h3>
<ul>
<li>Hidratación que permanece en vez de desaparecer en una hora</li>
<li>Menos inflamación y rojeces</li>
<li>Mayor elasticidad y firmeza</li>
<li>Luminosidad visible en las primeras semanas</li>
</ul>

<h3>Cómo usar el sérum</h3>
<p><strong>Mañana:</strong> 3–4 gotas de The ONE Facial Oil, luego 1–2 pulsaciones de TA-DA Serum.</p>
<p><strong>Noche:</strong> 3–4 gotas de I LOVE Facial Oil, luego 1–2 pulsaciones de TA-DA Serum.</p>
<p><em>Para mejores resultados, aplica el sérum después del aceite.</em></p>

<h3>¿Por qué 3% CBG?</h3>
<p>Con 1500 mg de CBG por frasco en aceite de jojoba ecológico, este es un sérum concentrado con potente soporte antioxidante para pieles secas, sensibles o inflamadas. Sin relleno. Solo lo que tu piel realmente necesita.</p>`,
    descriptionDe: `<p>Trockene Haut braucht keine weitere Notlösung. TA-DA Serum ist dafür gemacht, eine Sache richtig gut zu können: deiner Haut zu helfen, Feuchtigkeit wirklich zu halten.</p>

<h3>Die Kraft von CBG</h3>
<p>Im Herzen des Serums steckt CBG (Cannabigerol), ein kraftvoller Wirkstoff, der mit dem hauteigenen Endocannabinoid-System zusammenarbeitet. Das Ergebnis: bessere Feuchtigkeitsbalance, weniger Wasserverlust und Haut, die sich auch dann benimmt, wenn das Wetter es nicht tut.</p>

<h3>Das bekommst du</h3>
<ul>
<li>Feuchtigkeit, die bleibt, statt nach einer Stunde zu verschwinden</li>
<li>Weniger Entzündungen und Rötungen</li>
<li>Verbesserte Elastizität und Festigkeit</li>
<li>Sichtbarer Glow innerhalb der ersten Wochen</li>
</ul>

<h3>So verwendest du das Serum</h3>
<p><strong>Morgens:</strong> 3–4 Tropfen The ONE Facial Oil, dann 1–2 Pumpstöße TA-DA Serum.</p>
<p><strong>Abends:</strong> 3–4 Tropfen I LOVE Facial Oil, dann 1–2 Pumpstöße TA-DA Serum.</p>
<p><em>Für beste Ergebnisse das Serum nach dem Öl auftragen.</em></p>

<h3>Warum 3% CBG?</h3>
<p>Mit 1500 mg CBG pro Flasche in Bio-Jojobaöl ist das ein konzentriertes Serum mit starker antioxidativer Unterstützung für trockene, empfindliche oder entzündete Haut. Kein Füllstoff. Nur das, was deine Haut wirklich braucht.</p>`,
    descriptionFr: `<p>La peau sèche n'a pas besoin d'un énième pansement temporaire. TA-DA Serum est conçu pour faire une seule chose vraiment bien : aider ta peau à retenir une hydratation qui reste.</p>

<h3>La puissance du CBG</h3>
<p>Au cœur du sérum se trouve le CBG (cannabigérol), un ingrédient puissant qui travaille avec le système endocannabinoïde de ta propre peau. Le résultat : un meilleur équilibre hydrique, moins de perte en eau et une peau qui se tient même quand la météo ne suit pas.</p>

<h3>Ce que tu obtiens</h3>
<ul>
<li>Une hydratation qui reste au lieu de s'évaporer au bout d'une heure</li>
<li>Moins d'inflammation et de rougeurs</li>
<li>Une élasticité et une fermeté améliorées</li>
<li>Un éclat visible dès les premières semaines</li>
</ul>

<h3>Comment utiliser le sérum</h3>
<p><strong>Matin :</strong> 3–4 gouttes de The ONE Facial Oil, puis 1–2 pressions de TA-DA Serum.</p>
<p><strong>Soir :</strong> 3–4 gouttes de I LOVE Facial Oil, puis 1–2 pressions de TA-DA Serum.</p>
<p><em>Pour de meilleurs résultats, applique le sérum après l'huile.</em></p>

<h3>Pourquoi 3% CBG ?</h3>
<p>Avec 1500 mg de CBG par flacon dans de l'huile de jojoba bio, c'est un sérum concentré avec un puissant soutien antioxydant pour les peaux sèches, sensibles ou enflammées. Pas de remplissage. Juste ce dont ta peau a vraiment besoin.</p>`,
    ingredients:
      "Simmondsia chinensis (Jojoba) Seed Oil (ekologisk), Cannabigerol (CBG, 3% / 1500 mg)",
    ingredientsEn:
      "Simmondsia chinensis (Jojoba) Seed Oil (organic), Cannabigerol (CBG, 3% / 1500 mg)",
    size: "30 ml",
    sizeEn: "30 ml",
    sizes: ["30 ml"],
    guarantee:
      "Fri frakt.",
    guaranteeEn: "Free shipping over €60.",
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
      "Two face oils, one for morning and one for evening. Simple skincare that works with your skin, not against it.",
    shortDescEs:
      "Dos aceites faciales: uno para la mañana y otro para la noche. Cuidado sencillo que trabaja con tu piel, no en su contra.",
    shortDescDe:
      "Zwei Gesichtsöle, eines für morgens und eines für abends. Einfache Pflege, die mit deiner Haut arbeitet – nicht gegen sie.",
    shortDescFr:
      "Deux huiles visage : une pour le matin, une pour le soir. Un soin simple qui travaille avec ta peau, pas contre elle.",
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
    descriptionEn: `<p>One oil for the day. One for the night. It does not need to be more complicated than that.</p>
<p>The DUO kit gives you a complete routine that is simple, effective and designed to strengthen skin, not make it dependent on more and more products.</p>

<h3>The ONE Facial Oil – morning</h3>
<p>10% CBD and 0.2% CBG help protect the barrier, hydrate deeply and leave skin looking fresher and more even. A light formula for oily, dry, sensitive and combination skin.</p>
<ul>
<li>Less of the angry, blotchy look</li>
<li>A stronger, steadier skin barrier</li>
<li>Glow that still looks believable in daylight</li>
<li>Deep hydration without the heavy finish</li>
</ul>

<h3>I LOVE Facial Oil – evening</h3>
<p>10% CBD and 5% CBG. Night is when skin recovers, and this oil is made for that window. It helps calm, repair and deeply hydrate while you sleep. Especially helpful for stressed, sensitive or unbalanced skin.</p>
<ul>
<li>Calms and repairs while you sleep</li>
<li>Deep hydration with 5% CBG</li>
<li>Better elasticity and bounce</li>
<li>Softer, more even-looking skin within weeks</li>
</ul>

<h3>How to use the kit</h3>
<p><strong>Morning:</strong> Apply 3–4 drops of The ONE Facial Oil to clean skin.</p>
<p><strong>Evening:</strong> Apply 3–4 drops of I LOVE Facial Oil to clean skin.</p>
<p><em>Think “The ONE I LOVE” if you want an easy way to remember the order.</em></p>`,
    descriptionEs: `<p>Un aceite para el día. Otro para la noche. No tiene que ser más complicado.</p>
<p>El DUO kit te da una rutina completa que es sencilla, efectiva y diseñada para fortalecer la piel, no para hacerla dependiente de más y más productos.</p>

<h3>The ONE Facial Oil – mañana</h3>
<p>10% CBD y 0,2% CBG que protegen la barrera, hidratan en profundidad y dejan la piel con un aspecto más fresco y uniforme. Una fórmula ligera para pieles grasas, secas, sensibles y mixtas.</p>
<ul>
<li>Menos rojeces e irritación</li>
<li>Una barrera cutánea más fuerte y estable</li>
<li>Luminosidad que sigue siendo creíble a la luz del día</li>
<li>Hidratación profunda sin sensación pesada</li>
</ul>

<h3>I LOVE Facial Oil – noche</h3>
<p>10% CBD y 5% CBG. La noche es cuando la piel se recupera, y este aceite está hecho para ese momento. Calma, repara e hidrata en profundidad mientras duermes. Especialmente útil para pieles estresadas, sensibles o desequilibradas.</p>
<ul>
<li>Calma y repara mientras duermes</li>
<li>Hidratación profunda con 5% CBG</li>
<li>Mejor elasticidad y firmeza</li>
<li>Piel más suave y uniforme en semanas</li>
</ul>

<h3>Cómo usar el kit</h3>
<p><strong>Mañana:</strong> Aplica 3–4 gotas de The ONE Facial Oil sobre la piel limpia.</p>
<p><strong>Noche:</strong> Aplica 3–4 gotas de I LOVE Facial Oil sobre la piel limpia.</p>
<p><em>Piensa "The ONE I LOVE" si quieres una forma fácil de recordar el orden.</em></p>`,
    descriptionDe: `<p>Ein Öl für den Tag. Eines für die Nacht. Komplizierter muss es nicht sein.</p>
<p>Das DUO kit gibt dir eine komplette Routine, die einfach und wirksam ist und darauf ausgelegt, die Haut zu stärken – nicht sie von immer mehr Produkten abhängig zu machen.</p>

<h3>The ONE Facial Oil – morgens</h3>
<p>10% CBD und 0,2% CBG schützen die Barriere, spenden intensive Feuchtigkeit und lassen die Haut frischer und ebenmäßiger aussehen. Eine leichte Formel für fettige, trockene, empfindliche und Mischhaut.</p>
<ul>
<li>Weniger Rötungen und gereizte Stellen</li>
<li>Eine stärkere, stabilere Hautbarriere</li>
<li>Glow, der auch bei Tageslicht noch glaubwürdig aussieht</li>
<li>Tiefe Feuchtigkeit ohne schweres Finish</li>
</ul>

<h3>I LOVE Facial Oil – abends</h3>
<p>10% CBD und 5% CBG. Die Nacht ist die Erholungszeit der Haut, und dieses Öl ist genau dafür gemacht. Es beruhigt, repariert und spendet intensive Feuchtigkeit, während du schläfst. Besonders hilfreich bei gestresster, empfindlicher oder unausgeglichener Haut.</p>
<ul>
<li>Beruhigt und repariert im Schlaf</li>
<li>Tiefe Feuchtigkeit mit 5% CBG</li>
<li>Bessere Elastizität und Spannkraft</li>
<li>Weichere, ebenmäßigere Haut innerhalb von Wochen</li>
</ul>

<h3>So verwendest du das Kit</h3>
<p><strong>Morgens:</strong> 3–4 Tropfen The ONE Facial Oil auf die gereinigte Haut auftragen.</p>
<p><strong>Abends:</strong> 3–4 Tropfen I LOVE Facial Oil auf die gereinigte Haut auftragen.</p>
<p><em>Merke dir „The ONE I LOVE" – so vergisst du die Reihenfolge nicht.</em></p>`,
    descriptionFr: `<p>Une huile pour le jour. Une pour la nuit. Pas besoin de compliquer les choses.</p>
<p>Le DUO kit t'offre une routine complète qui est simple, efficace et conçue pour renforcer ta peau – pas pour la rendre dépendante de toujours plus de produits.</p>

<h3>The ONE Facial Oil – matin</h3>
<p>10% CBD et 0,2% CBG qui protègent la barrière, hydratent en profondeur et laissent la peau plus fraîche et plus uniforme. Une formule légère pour les peaux grasses, sèches, sensibles et mixtes.</p>
<ul>
<li>Moins de rougeurs et d'irritations</li>
<li>Une barrière cutanée plus forte et plus stable</li>
<li>Un éclat qui reste crédible en plein jour</li>
<li>Une hydratation profonde sans fini lourd</li>
</ul>

<h3>I LOVE Facial Oil – soir</h3>
<p>10% CBD et 5% CBG. La nuit, c'est le moment où ta peau récupère, et cette huile est faite pour ça. Elle apaise, répare et hydrate en profondeur pendant que tu dors. Particulièrement utile pour les peaux stressées, sensibles ou déséquilibrées.</p>
<ul>
<li>Apaise et répare pendant ton sommeil</li>
<li>Hydratation profonde avec 5% CBG</li>
<li>Une meilleure élasticité et fermeté</li>
<li>Une peau plus douce et plus uniforme en quelques semaines</li>
</ul>

<h3>Comment utiliser le kit</h3>
<p><strong>Matin :</strong> Applique 3–4 gouttes de The ONE Facial Oil sur peau propre.</p>
<p><strong>Soir :</strong> Applique 3–4 gouttes de I LOVE Facial Oil sur peau propre.</p>
<p><em>Retiens « The ONE I LOVE » pour ne jamais oublier l'ordre.</em></p>`,
    ingredients: null,
    size: "2 x 10 ml glasflaskor med pipett",
    sizeEn: "2 × 10 ml glass bottles with dropper",
    guarantee:
      "Fri frakt.",
    guaranteeEn: "Free shipping over €60.",
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
      "A cleansing oil with MCT and CBD that removes makeup and buildup without stripping your skin bare.",
    shortDescEs:
      "Un aceite limpiador con MCT y CBD que elimina el maquillaje y las impurezas sin dejar tu piel desprotegida.",
    shortDescDe:
      "Ein Reinigungsöl mit MCT und CBD, das Make-up und Ablagerungen entfernt, ohne deine Haut auszutrocknen.",
    shortDescFr:
      "Une huile nettoyante au MCT et CBD qui élimine maquillage et impuretés sans agresser ta peau.",
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
    descriptionEn: `<p>Many cleansers strip as they clean. This one doesn’t.</p>
<p>Au Naturel dissolves makeup, grime and pollution without disrupting the microbiome or the endocannabinoid system. Skin is left clean, soft and ready for the next step.</p>

<h3>Just two ingredients</h3>
<p><strong>MCT (caprylic/capric triglyceride)</strong> – A light oil that binds to sebum and dirt without clogging pores.</p>
<p><strong>CBD (cannabidiol, 0.2%)</strong> – Helps calm, hydrate and support elasticity. In other words, cleansing becomes part of your skincare, not the punishment before it.</p>

<h3>What you get</h3>
<ul>
<li>Clean skin without that tight feeling</li>
<li>Hydration even at the cleansing step</li>
<li>Improved elasticity and firmness</li>
<li>Clean skin that doesn’t feel punished</li>
</ul>

<h3>How to use it</h3>
<p>Apply a few drops to the face. Massage in. Remove with a warm, damp cloth or cotton pad. Follow with face oil.</p>`,
    descriptionEs: `<p>La mayoría de los limpiadores arrasan con todo al limpiar. Este no.</p>
<p>Au Naturel disuelve maquillaje, suciedad y contaminación sin alterar el microbioma ni el sistema endocannabinoide. La piel queda limpia, suave y lista para el siguiente paso.</p>

<h3>Solo dos ingredientes</h3>
<p><strong>MCT (caprylic/capric triglyceride)</strong> – Un aceite ligero que se une al sebo y la suciedad sin obstruir los poros.</p>
<p><strong>CBD (cannabidiol, 0,2%)</strong> – Calma, hidrata y mejora la elasticidad. En otras palabras, la limpieza se convierte en parte de tu cuidado facial, no en el castigo que viene antes.</p>

<h3>Lo que consigues</h3>
<ul>
<li>Piel limpia sin esa sensación tirante</li>
<li>Hidratación incluso en el paso de limpieza</li>
<li>Mayor elasticidad y firmeza</li>
<li>Piel limpia que no se siente castigada</li>
</ul>

<h3>Cómo usarlo</h3>
<p>Aplica unas gotas en el rostro. Masajea. Retira con un paño húmedo y tibio o un disco de algodón. Continúa con tu aceite facial.</p>`,
    descriptionDe: `<p>Die meisten Reiniger reißen beim Reinigen alles mit. Dieser nicht.</p>
<p>Au Naturel löst Make-up, Schmutz und Umweltbelastungen, ohne das Mikrobiom oder das Endocannabinoid-System zu stören. Die Haut bleibt sauber, weich und bereit für den nächsten Schritt.</p>

<h3>Nur zwei Inhaltsstoffe</h3>
<p><strong>MCT (Caprylic/Capric Triglyceride)</strong> – Ein leichtes Öl, das Talg und Schmutz bindet, ohne die Poren zu verstopfen.</p>
<p><strong>CBD (Cannabidiol, 0,2%)</strong> – Beruhigt, spendet Feuchtigkeit und unterstützt die Elastizität. Anders gesagt: Die Reinigung wird Teil deiner Hautpflege, nicht die Strafe davor.</p>

<h3>Das bekommst du</h3>
<ul>
<li>Saubere Haut ohne das Spannungsgefühl</li>
<li>Feuchtigkeit schon beim Reinigungsschritt</li>
<li>Verbesserte Elastizität und Festigkeit</li>
<li>Saubere Haut, die sich nicht bestraft anfühlt</li>
</ul>

<h3>So verwendest du es</h3>
<p>Einige Tropfen auf das Gesicht geben. Einmassieren. Mit einem warmen, feuchten Tuch oder Wattepad abnehmen. Anschließend Gesichtsöl auftragen.</p>`,
    descriptionFr: `<p>La plupart des nettoyants décapent en même temps qu'ils nettoient. Pas celui-ci.</p>
<p>Au Naturel dissout maquillage, impuretés et pollution sans perturber le microbiome ni le système endocannabinoïde. Ta peau reste propre, douce et prête pour la suite.</p>

<h3>Seulement deux ingrédients</h3>
<p><strong>MCT (caprylic/capric triglyceride)</strong> – Une huile légère qui se lie au sébum et aux impuretés sans boucher les pores.</p>
<p><strong>CBD (cannabidiol, 0,2%)</strong> – Apaise, hydrate et soutient l'élasticité. Autrement dit, le nettoyage devient partie intégrante de ton soin, pas la punition qui le précède.</p>

<h3>Ce que tu obtiens</h3>
<ul>
<li>Une peau propre sans cette sensation de tiraillement</li>
<li>De l'hydratation dès l'étape du nettoyage</li>
<li>Une élasticité et une fermeté améliorées</li>
<li>Une peau propre qui ne se sent pas agressée</li>
</ul>

<h3>Comment l'utiliser</h3>
<p>Applique quelques gouttes sur le visage. Masse délicatement. Retire avec un linge chaud et humide ou un coton. Enchaîne avec ton huile visage.</p>`,
    ingredients:
      "Caprylic/Capric Triglyceride (MCT), Cannabidiol (CBD, 0,2%)",
    ingredientsEn: "Caprylic/Capric Triglyceride (MCT), Cannabidiol (CBD, 0.2%)",
    size: "100 ml",
    sizeEn: "100 ml",
    sizes: ["100 ml"],
    guarantee:
      "Fri frakt.",
    guaranteeEn: "Free shipping over €60.",
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
      "Four mushrooms in one formula to support immunity, focus, energy and sleep from within.",
    shortDescEs:
      "Cuatro hongos en una fórmula para apoyar la inmunidad, el enfoque, la energía y el sueño desde dentro.",
    shortDescDe:
      "Vier Pilze in einer Formel, die Immunsystem, Fokus, Energie und Schlaf von innen heraus unterstützt.",
    shortDescFr:
      "Quatre champignons dans une seule formule pour soutenir l'immunité, la concentration, l'énergie et le sommeil de l'intérieur.",
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
    descriptionEn: `<p>We care about what happens under the skin, not only on it. Fungtastic brings together four mushrooms chosen to support the body where it matters most.</p>

<h3>Four mushrooms, four jobs</h3>
<ul>
<li><strong>Chaga (25%)</strong> – For immune support and antioxidant defence when the body feels a little under siege.</li>
<li><strong>Lion’s Mane (25%)</strong> – For focus, memory and a clearer head on days that feel mentally crowded.</li>
<li><strong>Cordyceps (25%)</strong> – For energy and stamina that belong to real life, not just the gym.</li>
<li><strong>Reishi (25%)</strong> – For calm, recovery and sleep that actually shows up.</li>
</ul>

<h3>Why these mushrooms?</h3>
<p>It started with Chaga and betulinic acid, a compound that supports the body’s endocannabinoid system in a way that mirrors what CBD does for the skin. From there we added Lion’s Mane, Cordyceps and Reishi: four mushrooms that work with the body instead of trying to bully it.</p>

<h3>How to take them</h3>
<p>2 capsules daily. Most people notice a difference after 2–4 weeks.</p>
<p>400 mg per capsule (15:1 extract). At least 20% beta-glucans. 100% organic.</p>

<p><em>Avoid if you’re pregnant, breastfeeding, or allergic to any ingredient.</em></p>`,
    descriptionEs: `<p>Nos importa lo que pasa debajo de la piel, no solo encima. Fungtastic reúne cuatro hongos elegidos para apoyar al cuerpo donde más importa.</p>

<h3>Cuatro hongos, cuatro funciones</h3>
<ul>
<li><strong>Chaga (25%)</strong> – Para el soporte inmunitario y la defensa antioxidante cuando el cuerpo se siente un poco asediado.</li>
<li><strong>Lion's Mane (25%)</strong> – Para el enfoque, la memoria y una cabeza más clara en esos días mentalmente saturados.</li>
<li><strong>Cordyceps (25%)</strong> – Para la energía y la resistencia de la vida real, no solo la del gimnasio.</li>
<li><strong>Reishi (25%)</strong> – Para la calma, la recuperación y un sueño que realmente aparezca.</li>
</ul>

<h3>¿Por qué estos hongos?</h3>
<p>Todo empezó con el Chaga y el ácido betulínico, un compuesto que apoya el sistema endocannabinoide del cuerpo de forma similar a lo que hace el CBD por la piel. A partir de ahí añadimos Lion's Mane, Cordyceps y Reishi: cuatro hongos que trabajan con el cuerpo en vez de intentar forzarlo.</p>

<h3>Cómo tomarlos</h3>
<p>2 cápsulas al día. La mayoría nota la diferencia después de 2–4 semanas.</p>
<p>400 mg por cápsula (extracto 15:1). Mínimo 20% betaglucanos. 100% ecológico.</p>

<p><em>Evitar si estás embarazada, en periodo de lactancia o eres alérgica a algún ingrediente.</em></p>`,
    descriptionDe: `<p>Uns interessiert, was unter der Haut passiert, nicht nur auf ihr. Fungtastic vereint vier Pilze, die den Körper dort unterstützen, wo es am meisten zählt.</p>

<h3>Vier Pilze, vier Aufgaben</h3>
<ul>
<li><strong>Chaga (25%)</strong> – Für Immununterstützung und antioxidativen Schutz, wenn der Körper sich etwas belagert fühlt.</li>
<li><strong>Lion's Mane (25%)</strong> – Für Fokus, Gedächtnis und einen klareren Kopf an mental überfüllten Tagen.</li>
<li><strong>Cordyceps (25%)</strong> – Für Energie und Ausdauer im echten Leben, nicht nur im Fitnessstudio.</li>
<li><strong>Reishi (25%)</strong> – Für Ruhe, Erholung und einen Schlaf, der tatsächlich etwas bringt.</li>
</ul>

<h3>Warum diese Pilze?</h3>
<p>Es begann mit Chaga und Betulinsäure, einer Verbindung, die das körpereigene Endocannabinoid-System auf eine Weise unterstützt, die widerspiegelt, was CBD für die Haut tut. Von dort aus haben wir Lion's Mane, Cordyceps und Reishi hinzugefügt: vier Pilze, die mit dem Körper arbeiten, statt ihn herumzuschubsen.</p>

<h3>So nimmst du sie ein</h3>
<p>2 Kapseln täglich. Die meisten spüren nach 2–4 Wochen einen Unterschied.</p>
<p>400 mg pro Kapsel (15:1-Extrakt). Mindestens 20% Beta-Glucane. 100% bio.</p>

<p><em>Nicht einnehmen bei Schwangerschaft, Stillzeit oder Allergie gegen einen der Inhaltsstoffe.</em></p>`,
    descriptionFr: `<p>Ce qui se passe sous la peau nous intéresse autant que ce qui se passe dessus. Fungtastic réunit quatre champignons choisis pour soutenir le corps là où ça compte vraiment.</p>

<h3>Quatre champignons, quatre missions</h3>
<ul>
<li><strong>Chaga (25%)</strong> – Pour le soutien immunitaire et la défense antioxydante quand le corps se sent un peu assiégé.</li>
<li><strong>Lion's Mane (25%)</strong> – Pour la concentration, la mémoire et un esprit plus clair les jours où ta tête déborde.</li>
<li><strong>Cordyceps (25%)</strong> – Pour l'énergie et l'endurance du quotidien, pas seulement celle de la salle de sport.</li>
<li><strong>Reishi (25%)</strong> – Pour le calme, la récupération et un sommeil qui se montre enfin.</li>
</ul>

<h3>Pourquoi ces champignons ?</h3>
<p>Tout a commencé avec le Chaga et l'acide bétulinique, un composé qui soutient le système endocannabinoïde du corps d'une manière qui reflète ce que le CBD fait pour la peau. De là, on a ajouté Lion's Mane, Cordyceps et Reishi : quatre champignons qui travaillent avec le corps au lieu d'essayer de le brusquer.</p>

<h3>Comment les prendre</h3>
<p>2 gélules par jour. La plupart des gens remarquent une différence au bout de 2–4 semaines.</p>
<p>400 mg par gélule (extrait 15:1). Au moins 20% de bêta-glucanes. 100% bio.</p>

<p><em>À éviter si tu es enceinte, si tu allaites ou si tu es allergique à l'un des ingrédients.</em></p>`,
    ingredients:
      "Chaga (25%), Lion's Mane (25%), Cordyceps (25%), Reishi (25%) – 400 mg per kapsel (15:1 extrakt). Betaglukaner: minst 20%.",
    ingredientsEn:
      "Chaga (25%), Lion's Mane (25%), Cordyceps (25%), Reishi (25%) – 400 mg per capsule (15:1 extract). Beta-glucans: at least 20%.",
    size: "60 kapslar",
    sizeEn: "60 capsules",
    sizes: ["60 kapslar"],
    guarantee:
      "Fri frakt.",
    guaranteeEn: "Free shipping over €60.",
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

function intl(locale: Locale): boolean {
  return locale !== "sv";
}

export function productDisplayName(p: Product, locale: Locale): string {
  if (intl(locale) && p.nameEn) return p.nameEn;
  return p.name;
}

export function productShortDesc(p: Product, locale: Locale): string {
  if (locale === "es" && p.shortDescEs) return p.shortDescEs;
  if (locale === "de" && p.shortDescDe) return p.shortDescDe;
  if (locale === "fr" && p.shortDescFr) return p.shortDescFr;
  if (intl(locale) && p.shortDescEn) return p.shortDescEn;
  return p.shortDesc;
}

export function productDescriptionHtml(p: Product, locale: Locale): string {
  if (locale === "es" && p.descriptionEs) return p.descriptionEs;
  if (locale === "de" && p.descriptionDe) return p.descriptionDe;
  if (locale === "fr" && p.descriptionFr) return p.descriptionFr;
  if (intl(locale) && p.descriptionEn) return p.descriptionEn;
  return p.description;
}

export function productIngredients(p: Product, locale: Locale): string | null {
  if (intl(locale) && p.ingredientsEn !== undefined) return p.ingredientsEn;
  return p.ingredients;
}

export function productGuarantee(p: Product, locale: Locale): string {
  if (intl(locale) && p.guaranteeEn) return p.guaranteeEn;
  return p.guarantee;
}

export function productSize(p: Product, locale: Locale): string | null {
  if (intl(locale) && p.sizeEn != null && p.sizeEn !== "") return p.sizeEn;
  return p.size;
}

export function productPrice(p: Product, locale: Locale): number {
  return intl(locale) ? p.priceEur : p.price;
}

export function productOriginalPrice(p: Product, locale: Locale): number | null {
  return intl(locale) ? p.originalPriceEur : p.originalPrice;
}
