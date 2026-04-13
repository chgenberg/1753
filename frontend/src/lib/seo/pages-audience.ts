import type { LandingPage } from "./types";

export const AUDIENCE_PAGES: LandingPage[] = [
  {
    svSlug: "hudvard-for-man",
    enSlug: "skincare-for-men",
    esSlug: "cuidado-de-la-piel-para-hombres",
    deSlug: "hautpflege-fuer-maenner",
    frSlug: "soin-de-la-peau-pour-hommes",
    category: "audience",
    productIds: ["duo-kit", "ta-da-serum", "au-naturel-makeup-remover"],
    sv: {
      metaTitle: "Hudvård för män – enkel rutin, verklig skillnad | 1753",
      metaDescription: "Männens hud är tjockare, fetare och tåligare – men den behöver fortfarande omvårdnad. Upptäck en enkel CBD-rutin utan krångel. 1753 SKINCARE.",
      kicker: "Hudvård för män",
      h1: "Hudvård för män – din hud skiter i vad samhället tycker",
      lead: "Männens hud är biologiskt annorlunda. Tjockare, mer talgproducerande, mer kollagen. Men det betyder inte att den klarar sig själv. Det betyder att den behöver rätt saker – inte fler saker.",
      problemTitle: "Varför män har undvikit hudvård – och varför det är dags att sluta",
      problemBody: "<p>Låt oss vara ärliga: hudvårdsindustrin har länge ignorerat män, och män har gärna ignorerat tillbaka. Resultatet är en generation som tvättar ansiktet med samma tvål som kroppen och kallar det en rutin. Det funkar – tills det inte gör det längre.</p><p>Manlig hud producerar upp till dubbelt så mycket talg som kvinnlig hud, har fler kollagenfibrer och är cirka 25 procent tjockare. Det låter som en fördel, men det innebär också att porer täpps igen lättare, att rakning skapar kronisk mikroirritation, och att solen gör mer skada än du tror under ytan.</p><p>Det handlar inte om fåfänga. Det handlar om att ta hand om det största organet du har. En enkel rutin på under en minut kan göra skillnad mellan hud som åldras i förtid och hud som behåller sin styrka. Ingen tio-stegs-process, inga parfymerade krämer, inget tjafs. Bara det din hud faktiskt behöver.</p>",
      tipsTitle: "Enkel hudvård för män som fungerar",
      tips: [
        { title: "Håll det enkelt", body: "Du behöver inte mer än två steg: rengöring och ansiktsolja. Punkt. Gör det till en vana precis som att borsta tänderna – det behöver inte ta längre tid." },
        { title: "Rengör efter rakning", body: "Rakning sliter på hudbarriären. Använd en mild rengöring efter rakning för att undvika irritation och inåtväxande hår. Undvik produkter med alkohol som torkar ut." },
        { title: "Använd solskydd", body: "Ja, även du. Manlig hud har mer kollagen men det skyddar inte mot UV-skador. Solskydd är den enskilt viktigaste anti-aging-åtgärden, oavsett kön." },
        { title: "CBD lugnar efter rakning", body: "CBD har antiinflammatoriska egenskaper som är perfekta för hud som utsätts för daglig rakning. Applicera en CBD-olja direkt efter rakning för att lugna irritation och stödja läkning." }
      ],
      solutionTitle: "1753 SKINCARE – byggd för enkelhet",
      solutionBody: "<p>Vi designade våra produkter för människor som vill ha resultat utan krångel. DUO-kit ger dig allt du behöver i två flaskor: en ansiktsolja med CBD och ett serum med CBG. Det tar under en minut, det fungerar, och du slipper stå framför en hylla med tjugo alternativ.</p><p>CBD och CBG arbetar med hudens eget system för att balansera talgproduktion, lugna inflammation efter rakning och stärka hudbarriären. Det är inte raketvetenskap och det är inte fåfänga. Det är grundläggande underhåll av din hud – precis som du servar bilen eller sköter träningen.</p><p>Ingen parfym, inga onödiga ingredienser, ingen bullshit. Bara cannabinoider som pratar med din hud på det språk den förstår.</p>",
      faq: [
        { q: "Behöver män verkligen hudvård?", a: "Ja. Manlig hud har visserligen mer kollagen och är tjockare, men den producerar också mer talg och utsätts för daglig rakning. Utan grundläggande vård åldras den snabbare och får fler problem med tilltäppta porer och irritation." },
        { q: "Är CBD-hudvård lämplig för män?", a: "Absolut. CBD interagerar med hudens endocannabinoidsystem oavsett kön. Eftersom manlig hud tenderar att producera mer talg och inflammation är CBD:s balanserande egenskaper särskilt relevanta." },
        { q: "Hur enkel kan en rutin vara?", a: "Två steg: rengör och applicera ansiktsolja. Det tar under en minut. Vårt DUO-kit är designat för just detta – en komplett rutin i två produkter." },
        { q: "Fungerar det mot rakirritation?", a: "Ja. CBD har dokumenterade antiinflammatoriska egenskaper som lugnar huden efter rakning. Många av våra manliga kunder rapporterar märkbart mindre rodnad och irritation." }
      ],
      ctaTitle: "Prova en rutin som tar under en minut",
      ctaSub: "Ingen krångel, inga onödiga steg. DUO-kit ger din hud det den behöver – varken mer eller mindre."
    },
    en: {
      metaTitle: "Skincare for men – simple routine, real results | 1753",
      metaDescription: "Men's skin is thicker, oilier, and tougher – but it still needs care. Discover a simple CBD routine without the fuss. 1753 SKINCARE.",
      kicker: "Skincare for men",
      h1: "Skincare for men – your skin doesn't care what society thinks",
      lead: "Men's skin is biologically different. Thicker, oilier, more collagen. But that doesn't mean it takes care of itself. It means it needs the right things – not more things.",
      problemTitle: "Why men have avoided skincare – and why it's time to stop",
      problemBody: "<p>Let's be honest: the skincare industry has long ignored men, and men have happily ignored it back. The result is a generation that washes their face with the same soap they use on their body and calls it a routine. It works – until it doesn't.</p><p>Male skin produces up to twice as much sebum as female skin, has more collagen fibers, and is roughly 25 percent thicker. That sounds like an advantage, but it also means pores clog more easily, shaving creates chronic micro-irritation, and the sun does more damage beneath the surface than you'd think.</p><p>This isn't about vanity. It's about taking care of the largest organ you have. A simple routine under one minute can mean the difference between skin that ages prematurely and skin that keeps its strength. No ten-step process, no perfumed creams, no nonsense. Just what your skin actually needs.</p>",
      tipsTitle: "Simple skincare for men that works",
      tips: [
        { title: "Keep it simple", body: "You need no more than two steps: cleanse and apply face oil. Period. Make it a habit like brushing your teeth – it doesn't need to take any longer." },
        { title: "Cleanse after shaving", body: "Shaving wears down the skin barrier. Use a gentle cleanser post-shave to prevent irritation and ingrown hairs. Avoid products with alcohol that dry out the skin." },
        { title: "Wear sunscreen", body: "Yes, you too. Male skin has more collagen, but that doesn't protect against UV damage. Sunscreen is the single most important anti-aging measure, regardless of gender." },
        { title: "CBD calms post-shave skin", body: "CBD has anti-inflammatory properties that are perfect for skin subjected to daily shaving. Apply a CBD oil right after shaving to calm irritation and support healing." }
      ],
      solutionTitle: "1753 SKINCARE – built for simplicity",
      solutionBody: "<p>We designed our products for people who want results without the fuss. The DUO-kit gives you everything you need in two bottles: a face oil with CBD and a serum with CBG. It takes under a minute, it works, and you don't have to stand in front of a shelf with twenty options.</p><p>CBD and CBG work with your skin's own system to balance oil production, calm post-shave inflammation, and strengthen the skin barrier. It's not rocket science and it's not vanity. It's basic maintenance for your skin – just like servicing your car or keeping up your training.</p><p>No fragrance, no unnecessary ingredients, no nonsense. Just cannabinoids that speak to your skin in the language it understands.</p>",
      faq: [
        { q: "Do men really need skincare?", a: "Yes. Male skin may have more collagen and be thicker, but it also produces more oil and endures daily shaving. Without basic care, it ages faster and develops more issues with clogged pores and irritation." },
        { q: "Is CBD skincare suitable for men?", a: "Absolutely. CBD interacts with the skin's endocannabinoid system regardless of gender. Since male skin tends to produce more sebum and inflammation, CBD's balancing properties are especially relevant." },
        { q: "How simple can a routine be?", a: "Two steps: cleanse and apply face oil. It takes under a minute. Our DUO-kit is designed for exactly this – a complete routine in two products." },
        { q: "Does it help with shaving irritation?", a: "Yes. CBD has documented anti-inflammatory properties that calm the skin after shaving. Many of our male customers report noticeably less redness and irritation." }
      ],
      ctaTitle: "Try a routine that takes under a minute",
      ctaSub: "No fuss, no unnecessary steps. The DUO-kit gives your skin what it needs – nothing more, nothing less."
    },
    es: {
      metaTitle: "Cuidado de la piel para hombres – rutina simple, resultados reales | 1753",
      metaDescription: "La piel masculina es más gruesa, más grasa y más resistente, pero igual necesita cuidado. Descubre una rutina con CBD sin complicaciones. 1753 SKINCARE.",
      kicker: "Cuidado de la piel para hombres",
      h1: "Cuidado de la piel para hombres – a tu piel no le importa lo que piense la sociedad",
      lead: "La piel masculina es distinta a nivel biológico. Más gruesa, más sebacea, más colágeno. Eso no significa que se cuide sola. Significa que necesita lo correcto, no más productos.",
      problemTitle: "Por qué los hombres han evitado el cuidado de la piel – y por qué toca parar",
      problemBody: "<p>Seamos honestos: la industria del skincare lleva años ignorando a los hombres, y ellos la han ignorado encantados. El resultado es una generación que se lava la cara con el mismo jabón del cuerpo y lo llama rutina. Funciona – hasta que deja de funcionar.</p><p>La piel masculina produce hasta el doble de sebo que la femenina, tiene más fibras de colágeno y es unos 25 por ciento más gruesa. Suena ventaja, pero también implica poros que se tapan antes, el afeitado genera microirritación crónica y el sol hace más daño bajo la superficie de lo que crees.</p><p>Esto no es vanidad. Es cuidar el órgano más grande que tienes. Una rutina simple de menos de un minuto puede marcar la diferencia entre una piel que envejece antes de tiempo y una que mantiene fuerza. Sin diez pasos, sin cremas perfumadas, sin tonterías. Solo lo que tu piel de verdad necesita.</p>",
      tipsTitle: "Skincare masculino simple que funciona",
      tips: [
        { title: "Que sea simple", body: "No necesitas más de dos pasos: limpiar y aplicar aceite facial. Punto. Hazlo un hábito como cepillarte los dientes – no tiene por qué llevar más tiempo." },
        { title: "Limpia después de afeitarte", body: "El afeitado desgasta la barrera cutánea. Usa un limpiador suave después para evitar irritación y pelos encarnados. Evita el alcohol que reseca." },
        { title: "Usa protector solar", body: "Sí, tú también. La piel masculina tiene más colágeno, pero eso no protege del daño UV. El SPF es la medida anti-edad número uno, pase el género." },
        { title: "El CBD calma tras el afeitado", body: "El CBD tiene propiedades antiinflamatorias ideales para la piel sometida al afeitado diario. Aplica un aceite con CBD justo después para calmar y apoyar la recuperación." }
      ],
      solutionTitle: "1753 SKINCARE – hecho para la simplicidad",
      solutionBody: "<p>Diseñamos los productos para quien quiere resultados sin drama. El DUO-kit te da todo en dos frascos: aceite facial con CBD y serum con CBG. Menos de un minuto, funciona, y no hace falta elegir entre veinte opciones en el estante.</p><p>CBD y CBG trabajan con el sistema propio de la piel para equilibrar el sebo, calmar la inflamación post-afeitado y reforzar la barrera. No es ciencia espacial ni vanidad. Es mantenimiento básico – como el coche o el entreno.</p><p>Sin perfume, sin ingredientes de relleno, sin humo. Solo cannabinoides que hablan el idioma que tu piel entiende.</p>",
      faq: [
        { q: "¿De verdad los hombres necesitan skincare?", a: "Sí. La piel masculina puede tener más colágeno y ser más gruesa, pero también produce más sebo y sufre el afeitado diario. Sin cuidado básico, envejece antes y acumula poros obstruidos e irritación." },
        { q: "¿El skincare con CBD sirve para hombres?", a: "Por supuesto. El CBD interactúa con el sistema endocannabinoide de la piel sin importar el género. Como la piel masculina suele producir más sebo e inflamación, el equilibrio que aporta el CBD encaja muy bien." },
        { q: "¿Qué tan simple puede ser una rutina?", a: "Dos pasos: limpiar y aplicar aceite facial. Menos de un minuto. Nuestro DUO-kit está pensado exactamente para eso – rutina completa en dos productos." },
        { q: "¿Ayuda con la irritación del afeitado?", a: "Sí. El CBD tiene efectos antiinflamatorios documentados que calman la piel tras el afeitado. Muchos clientes masculinos notan menos rojez e irritación." }
      ],
      ctaTitle: "Prueba una rutina de menos de un minuto",
      ctaSub: "Sin líos ni pasos de más. El DUO-kit da a tu piel lo que necesita – ni más ni menos."
    },
    de: {
      metaTitle: "Hautpflege für Männer – einfache Routine, echte Ergebnisse | 1753",
      metaDescription: "Männerhaut ist dicker, fettiger und robuster – braucht aber trotzdem Pflege. Entdecke eine schlichte CBD-Routine ohne Theater. 1753 SKINCARE.",
      kicker: "Hautpflege für Männer",
      h1: "Hautpflege für Männer – deine Haut interessiert sich nicht für Meinungen",
      lead: "Männerhaut ist biologisch anders. Dicker, mehr Talg, mehr Kollagen. Das heißt nicht, dass sie sich selbst versorgt. Sie braucht das Richtige – nicht mehr Produkte.",
      problemTitle: "Warum Männer Hautpflege gemieden haben – und warum Schluss damit ist",
      problemBody: "<p>Seien wir ehrlich: Die Beauty-Industrie hat Männer lange ignoriert, und Männer haben zurückgeignoriert. Das Ergebnis: eine Generation, die das Gesicht mit derselben Seife wie den Körper wäscht und das Routine nennt. Es klappt – bis es nicht mehr klappt.</p><p>Männerhaut produziert bis zu doppelt so viel Sebum wie Frauenhaut, hat mehr Kollagenfasern und ist rund 25 Prozent dicker. Klingt nach Vorteil, heißt aber auch: Poren verstopfen leichter, Rasur erzeugt chronische Mikroirritation, und die Sonne richtet unter der Oberfläche mehr Schaden an, als du denkst.</p><p>Es geht nicht um Eitelkeit. Es geht um das größte Organ, das du hast. Eine einfache Routine unter einer Minute kann den Unterschied machen zwischen vorzeitig alternder Haut und Haut, die Kraft behält. Kein Zehn-Schritte-Programm, keine parfümierten Cremes, kein Blödsinn. Nur das, was deine Haut wirklich braucht.</p>",
      tipsTitle: "Einfache Männer-Hautpflege, die funktioniert",
      tips: [
        { title: "Bleib minimalistisch", body: "Du brauchst nicht mehr als zwei Schritte: reinigen und Gesichtsöl auftragen. Punkt. Mach es zur Gewohnheit wie Zähneputzen – es muss nicht länger dauern." },
        { title: "Nach der Rasur reinigen", body: "Rasur strapaziert die Hautbarriere. Nutze nach der Rasur einen milden Reiniger gegen Irritation und eingewachsene Haare. Meide alkoholhaltige Produkte, die austrocknen." },
        { title: "Sonnenschutz tragen", body: "Ja, du auch. Mehr Kollagen schützt nicht vor UV-Schaden. Lichtschutz ist die wichtigste Anti-Aging-Maßnahme – unabhängig vom Geschlecht." },
        { title: "CBD beruhigt nach der Rasur", body: "CBD wirkt entzündungshemmend – ideal für täglich rasierte Haut. Trage direkt nach der Rasur ein CBD-Öl auf, um Irritation zu mildern und die Heilung zu unterstützen." }
      ],
      solutionTitle: "1753 SKINCARE – für Einfachheit gebaut",
      solutionBody: "<p>Wir haben unsere Produkte für Menschen entwickelt, die Ergebnisse ohne Aufwand wollen. Das DUO-kit liefert alles in zwei Flaschen: Gesichtsöl mit CBD und Serum mit CBG. Unter einer Minute, es wirkt, und du musst nicht vor zwanzig Varianten stehen.</p><p>CBD und CBG arbeiten mit dem eigenen System der Haut: Talgbalance, Beruhigung nach der Rasur, stärkere Barriere. Keine Raketenwissenschaft, keine Eitelkeit. Basis-Pflege – wie beim Auto oder Training.</p><p>Kein Duft, keine unnötigen Inhaltsstoffe, kein Quatsch. Nur Cannabinoide, die deine Haut verstehen.</p>",
      faq: [
        { q: "Brauchen Männer wirklich Hautpflege?", a: "Ja. Männerhaut hat oft mehr Kollagen und ist dicker, produziert aber auch mehr Talg und erträgt tägliche Rasur. Ohne Basis-Pflege altert sie schneller und neigt zu verstopften Poren und Irritation." },
        { q: "Ist CBD-Hautpflege für Männer geeignet?", a: "Absolut. CBD spricht mit dem endocannabinoiden System der Haut – unabhängig vom Geschlecht. Da Männerhaut tendenziell mehr Sebum und Entzündung hat, passen die ausgleichenden Eigenschaften besonders gut." },
        { q: "Wie einfach darf eine Routine sein?", a: "Zwei Schritte: reinigen und Gesichtsöl. Unter einer Minute. Unser DUO-kit ist genau dafür gedacht – komplette Routine in zwei Produkten." },
        { q: "Hilft es bei Rasurbrand?", a: "Ja. CBD ist dokumentiert entzündungshemmend und beruhigt die Haut nach der Rasur. Viele männliche Kunden berichten von weniger Rötung und Irritation." }
      ],
      ctaTitle: "Probiere eine Routine unter einer Minute",
      ctaSub: "Kein Stress, keine Extra-Schritte. Das DUO-kit gibt deiner Haut, was sie braucht – nicht mehr, nicht weniger."
    },
    fr: {
      metaTitle: "Soin de la peau pour hommes – routine simple, vrais résultats | 1753",
      metaDescription: "La peau masculine est plus épaisse, plus grasse et plus résistante – elle a tout de même besoin de soins. Une routine CBD simple, sans prise de tête. 1753 SKINCARE.",
      kicker: "Soin de la peau pour hommes",
      h1: "Soin de la peau pour hommes – ta peau se fiche de l'avis de la société",
      lead: "La peau masculine est biologiquement différente. Plus épaisse, plus grasse, plus de collagène. Ça ne veut pas dire qu'elle se débrouille toute seule. Elle a besoin du bon – pas de plus en plus de produits.",
      problemTitle: "Pourquoi les hommes ont évité les soins – et pourquoi il est temps d'arrêter",
      problemBody: "<p>Soyons honnêtes : l'industrie du soin a longtemps ignoré les hommes, et les hommes l'ont bien renvoyé l'ascenseur. Résultat : une génération qui lave le visage avec le même savon que le corps et appelle ça une routine. Ça marche – jusqu'à ce que ça casse.</p><p>La peau masculine produit jusqu'à deux fois plus de sébum, a plus de fibres de collagène et est environ 25 % plus épaisse. Ça sonne comme un avantage, mais ça veut aussi dire pores qui se bouchent plus vite, rasage = micro-irritation chronique, et le soleil fait plus de dégâts sous la surface qu'on ne le croit.</p><p>Ce n'est pas de la vanité. C'est prendre soin du plus grand organe que tu as. Une routine simple en moins d'une minute peut faire la différence entre une peau qui vieillit trop tôt et une peau qui garde sa force. Pas dix étapes, pas de crèmes parfumées, pas de blabla. Juste ce dont ta peau a réellement besoin.</p>",
      tipsTitle: "Un soin masculin simple qui tient la route",
      tips: [
        { title: "Reste minimaliste", body: "Il ne te faut pas plus de deux étapes : nettoyer et appliquer une huile visage. Point. Fais-en une habitude comme te brosser les dents – ça ne doit pas prendre plus longtemps." },
        { title: "Nettoie après le rasage", body: "Le rasage fragilise la barrière. Utilise un nettoyant doux après pour limiter irritation et poils incarnés. Évite l'alcool qui assèche." },
        { title: "Mets de la crème solaire", body: "Oui, toi aussi. Plus de collagène ne protège pas des UV. La protection solaire est la mesure anti-âge numéro un, quel que soit le genre." },
        { title: "Le CBD apaise après le rasage", body: "Le CBD a des propriétés anti-inflammatoires parfaites pour une peau rasée tous les jours. Applique une huile au CBD juste après pour calmer et aider la réparation." }
      ],
      solutionTitle: "1753 SKINCARE – pensé pour la simplicité",
      solutionBody: "<p>Nous avons conçu nos produits pour celles et ceux qui veulent des résultats sans prise de tête. Le DUO-kit te donne l'essentiel en deux flacons : huile visage au CBD et sérum au CBG. Moins d'une minute, ça fonctionne, et tu n'as pas vingt options sur l'étagère.</p><p>CBD et CBG travaillent avec le système propre de la peau : équilibre du sébum, calme après rasage, barrière renforcée. Ce n'est pas de la science-fiction ni de la vanité. C'est l'entretien de base – comme la voiture ou l'entraînement.</p><p>Sans parfum, sans ingrédients inutiles, sans blabla. Juste des cannabinoïdes qui parlent le langage de ta peau.</p>",
      faq: [
        { q: "Les hommes ont-ils vraiment besoin de soins ?", a: "Oui. La peau masculine a souvent plus de collagène et est plus épaisse, mais elle produit aussi plus de sébum et subit le rasage quotidien. Sans soins de base, elle vieillit plus vite et accumule pores bouchés et irritations." },
        { q: "Le CBD convient aux hommes ?", a: "Absolument. Le CBD interagit avec le système endocannabinoïde de la peau, quel que soit le genre. Comme la peau masculine produit souvent plus de sébum et d'inflammation, l'effet équilibrant du CBD est particulièrement pertinent." },
        { q: "À quel point une routine peut-elle être simple ?", a: "Deux étapes : nettoyer et appliquer une huile visage. Moins d'une minute. Notre DUO-kit est fait pour ça – routine complète en deux produits." },
        { q: "Ça aide contre l'irritation du rasage ?", a: "Oui. Le CBD a des effets anti-inflammatoires documentés qui apaisent la peau après le rasage. Beaucoup de nos clients hommes voient moins de rougeurs et d'irritation." }
      ],
      ctaTitle: "Essaie une routine en moins d'une minute",
      ctaSub: "Sans prise de tête ni étapes inutiles. Le DUO-kit donne à ta peau ce qu'il lui faut – ni plus ni moins."
    }
  },
  {
    svSlug: "hudvard-gravid",
    enSlug: "skincare-pregnancy",
    esSlug: "cuidado-de-la-piel-embarazo",
    deSlug: "hautpflege-schwangerschaft",
    frSlug: "soin-de-la-peau-grossesse",
    category: "audience",
    productIds: ["au-naturel-makeup-remover", "fungtastic-mushroom-extract"],
    sv: {
      metaTitle: "Hudvård under graviditet – trygg, naturlig omvårdnad | 1753",
      metaDescription: "Graviditet förändrar huden. Hitta trygga, naturliga hudvårdsalternativ med ingredienser du kan lita på. Rådgör alltid med din vårdgivare. 1753 SKINCARE.",
      kicker: "Hudvård under graviditet",
      h1: "Hudvård under graviditet – när kroppen skriver om reglerna",
      lead: "Under graviditeten förändras allt – inklusive huden. Hormoner skapar nya villkor och du vill vara säker på att det du applicerar är tryggt. Det är klokt. Det är moderskap redan innan barnet är fött.",
      problemTitle: "Varför huden ändrar sig under graviditeten",
      problemBody: "<p>Graviditetens hormonella berg-och-dalbana påverkar huden på sätt som få varumärken pratar ärligt om. Östrogen, progesteron och melanocytstimulerade hormoner skapar en cocktail som kan ge allt från strålande hy till akne, pigmentfläckar, torrhet och överkänslighet – ibland allt på samma gång.</p><p>Melasma, den så kallade graviditetsmasken, drabbar upp till 70 procent av gravida. Ökad blodvolym kan ge rosighet och kärlbristningar. Talgproduktionen kan gå i taket eller tvärtom stanna av helt. Hudens barriärfunktion påverkas, vilket gör den mer känslig för irritation.</p><p>Samtidigt krymper listan på ingredienser du kan använda. Retinol, salicylsyra i höga doser, kemiska solfilter – mycket av det som normalt rekommenderas är inte lämpligt under graviditet. Det skapar en frustrerande situation: huden behöver mer omvårdnad än vanligt, men verktygslådan har blivit mindre. Du förtjänar produkter som är trygga nog att använda utan oro.</p>",
      tipsTitle: "Trygg hudvård under graviditeten",
      tips: [
        { title: "Rådgör med din vårdgivare", body: "Innan du börjar med nya produkter under graviditeten – inklusive CBD-baserade – rådgör alltid med din barnmorska eller läkare. Varje graviditet är unik och din vårdgivare känner din situation bäst." },
        { title: "Förenkla rutinen", body: "Mindre är mer under graviditeten. En mild rengöring, en fuktighetsolja och solskydd är ofta allt som behövs. Undvik att introducera många nya produkter samtidigt." },
        { title: "Välj milda ingredienser", body: "Naturliga oljor, svampextrakt och mineralsol är generellt trygga val under graviditet. Undvik starka syror, retinol och produkter med lång ingredienslista full av syntetiska tillsatser." },
        { title: "Skydda mot pigmentering", body: "Hormoner gör huden extra känslig för sol under graviditeten. Använd minerellt solskydd dagligen och undvik direkt solexponering för att minimera risken för melasma." },
        { title: "Lyssna på förändringarna", body: "Huden kan ändra sig från vecka till vecka under graviditeten. Var beredd att anpassa din rutin efter vad huden signalerar – det som fungerade i andra trimestern kanske inte passar i tredje." }
      ],
      solutionTitle: "Naturliga alternativ under graviditeten",
      solutionBody: "<p>Vi vill vara transparenta: vi rekommenderar att du rådgör med din vårdgivare innan du använder CBD-produkter under graviditeten, då forskningen ännu är begränsad. Det är inte en brasklapp – det är ärlig kommunikation.</p><p>Vad vi kan erbjuda med tryggt samvete är Au Naturel, vår makeup remover baserad på naturliga oljor, och Fungtastic svampextrakt med adaptogena svampar som stödjer huden inifrån. Dessa innehåller inga cannabinoider och är formulerade med milda, naturliga ingredienser.</p><p>Graviditet handlar om att lita på kroppen och göra kloka val. Vi finns här med produkter du kan känna dig trygg med, och vi är alltid ärliga om vad vi vet – och vad vi inte vet ännu.</p>",
      faq: [
        { q: "Kan jag använda CBD-hudvård under graviditeten?", a: "Vi rekommenderar att du rådgör med din barnmorska eller läkare innan du använder CBD-produkter under graviditeten. Forskningen om topikalt applicerad CBD under graviditet är ännu begränsad och vi vill att du ska känna dig helt trygg." },
        { q: "Vilka 1753-produkter är lämpliga under graviditet?", a: "Au Naturel makeup remover och Fungtastic svampextrakt innehåller inga cannabinoider och är formulerade med milda, naturliga ingredienser. Rådgör alltid med din vårdgivare för personlig rådgivning." },
        { q: "Varför förändras huden under graviditeten?", a: "Hormoner som östrogen och progesteron påverkar talgproduktion, melaninbildning och hudbarriären. Upp till 70 procent av gravida upplever pigmentförändringar och många får förändrad hudtyp under graviditeten." },
        { q: "När återgår huden till normalt efter förlossningen?", a: "De flesta hormonrelaterade hudförändringar normaliseras inom tre till sex månader efter förlossningen. Pigmentförändringar som melasma kan dock ta längre tid att blekna och behöver ibland aktiv behandling." }
      ],
      ctaTitle: "Trygga val för dig och din hud",
      ctaSub: "Graviditet handlar om tillit – till kroppen, till valet, till produkterna. Vi är här med naturliga alternativ du kan känna dig trygg med."
    },
    en: {
      metaTitle: "Pregnancy skincare – safe, natural care for expectant mothers | 1753",
      metaDescription: "Pregnancy changes your skin. Find safe, natural skincare options with ingredients you can trust. Always consult your healthcare provider. 1753 SKINCARE.",
      kicker: "Pregnancy skincare",
      h1: "Pregnancy skincare – when your body rewrites the rules",
      lead: "During pregnancy, everything changes – including your skin. Hormones create new conditions and you want to be sure what you're applying is safe. That's wise. That's motherhood before the baby is even born.",
      problemTitle: "Why skin changes during pregnancy",
      problemBody: "<p>Pregnancy's hormonal rollercoaster affects the skin in ways few brands talk about honestly. Estrogen, progesterone, and melanocyte-stimulating hormones create a cocktail that can produce anything from glowing skin to acne, dark spots, dryness, and hypersensitivity – sometimes all at once.</p><p>Melasma, the so-called pregnancy mask, affects up to 70 percent of pregnant women. Increased blood volume can cause rosiness and broken capillaries. Sebum production may skyrocket or conversely shut down entirely. The skin barrier is compromised, making it more sensitive to irritation.</p><p>Meanwhile, the list of ingredients you can safely use shrinks. Retinol, high-dose salicylic acid, chemical sunscreens – much of what's normally recommended isn't suitable during pregnancy. This creates a frustrating situation: your skin needs more care than usual, but the toolbox has gotten smaller. You deserve products that are safe enough to use without worry.</p>",
      tipsTitle: "Safe skincare during pregnancy",
      tips: [
        { title: "Consult your healthcare provider", body: "Before starting any new products during pregnancy – including CBD-based ones – always consult your midwife or doctor. Every pregnancy is unique, and your provider knows your situation best." },
        { title: "Simplify your routine", body: "Less is more during pregnancy. A gentle cleanser, a hydrating oil, and sunscreen are often all you need. Avoid introducing many new products at the same time." },
        { title: "Choose gentle ingredients", body: "Natural oils, mushroom extracts, and mineral sunscreen are generally safe choices during pregnancy. Avoid strong acids, retinol, and products with lengthy ingredient lists full of synthetic additives." },
        { title: "Protect against pigmentation", body: "Hormones make skin extra sun-sensitive during pregnancy. Use mineral sunscreen daily and avoid direct sun exposure to minimize the risk of melasma." },
        { title: "Listen to the changes", body: "Skin can change from week to week during pregnancy. Be prepared to adjust your routine based on what your skin signals – what worked in the second trimester might not suit the third." }
      ],
      solutionTitle: "Natural options during pregnancy",
      solutionBody: "<p>We want to be transparent: we recommend consulting your healthcare provider before using CBD products during pregnancy, as research is still limited. That's not a disclaimer – it's honest communication.</p><p>What we can offer with a clear conscience is Au Naturel, our makeup remover based on natural oils, and Fungtastic mushroom extract with adaptogenic mushrooms that support skin from within. These contain no cannabinoids and are formulated with gentle, natural ingredients.</p><p>Pregnancy is about trusting your body and making wise choices. We're here with products you can feel safe with, and we're always honest about what we know – and what we don't know yet.</p>",
      faq: [
        { q: "Can I use CBD skincare during pregnancy?", a: "We recommend consulting your midwife or doctor before using CBD products during pregnancy. Research on topically applied CBD during pregnancy is still limited, and we want you to feel completely safe." },
        { q: "Which 1753 products are suitable during pregnancy?", a: "Au Naturel makeup remover and Fungtastic mushroom extract contain no cannabinoids and are formulated with gentle, natural ingredients. Always consult your healthcare provider for personalized advice." },
        { q: "Why does skin change during pregnancy?", a: "Hormones like estrogen and progesterone affect sebum production, melanin formation, and the skin barrier. Up to 70 percent of pregnant women experience pigmentation changes, and many notice their skin type changing." },
        { q: "When does skin return to normal after birth?", a: "Most hormone-related skin changes normalize within three to six months postpartum. Pigmentation changes like melasma may take longer to fade and sometimes need active treatment." }
      ],
      ctaTitle: "Safe choices for you and your skin",
      ctaSub: "Pregnancy is about trust – in your body, in your choices, in your products. We're here with natural options you can feel safe with."
    },
    es: {
      metaTitle: "Cuidado de la piel en el embarazo – cuidado seguro y natural | 1753",
      metaDescription: "El embarazo cambia la piel. Opciones naturales con ingredientes en los que puedes confiar. Consulta siempre a tu médico. 1753 SKINCARE.",
      kicker: "Cuidado de la piel en el embarazo",
      h1: "Cuidado de la piel en el embarazo – cuando tu cuerpo reescribe las reglas",
      lead: "En el embarazo todo cambia, también la piel. Las hormonas cambian el juego y quieres estar segura de lo que te pones. Es sensatez. Es maternidad antes incluso de que nazca el bebé.",
      problemTitle: "Por qué la piel cambia durante el embarazo",
      problemBody: "<p>La montaña rusa hormonal del embarazo afecta la piel de formas que pocas marcas cuentan con honestidad. Estrógeno, progesterona y hormonas que estimulan melanocitos crean un cóctel que puede dar desde un glow hasta acné, manchas, sequedad e hipersensibilidad – a veces todo a la vez.</p><p>El melasma, la llamada máscara del embarazo, afecta hasta al 70 por ciento de las embarazadas. Más volumen sanguíneo puede dar rubor y capilares rotos. El sebo puede dispararse o apagarse por completo. La barrera cutánea se debilita y la piel se irrita con más facilidad.</p><p>Mientras, la lista de ingredientes seguros se acorta. Retinol, ácido salicílico en dosis altas, filtros químicos – mucho de lo habitual no encaja en el embarazo. Frustración pura: la piel pide más cuidado que nunca y la caja de herramientas se encoge. Mereces productos lo bastante seguros para usarlos sin miedo.</p>",
      tipsTitle: "Skincare seguro durante el embarazo",
      tips: [
        { title: "Consulta a tu equipo médico", body: "Antes de nuevos productos en el embarazo – incluidos los con CBD – habla con tu matrona o médico. Cada embarazo es distinto y quien te conoce es quien debe decidir contigo." },
        { title: "Simplifica la rutina", body: "Menos es más. Limpiador suave, aceite hidratante y protección solar suelen bastar. No metas diez novedades a la vez." },
        { title: "Elige ingredientes suaves", body: "Aceites naturales, extractos de hongos y pantalla mineral suelen ser opciones razonables. Evita ácidos fuertes, retinol y listas kilométricas de sintéticos." },
        { title: "Protege frente a la pigmentación", body: "Las hormonas vuelven la piel más sensible al sol. SPF mineral a diario y menos sol directo reducen el riesgo de melasma." },
        { title: "Escucha los cambios", body: "La piel puede cambiar semana a semana. Ajusta la rutina a lo que te dice – lo que iba bien en el segundo trimestre puede no servir en el tercero." }
      ],
      solutionTitle: "Opciones naturales en el embarazo",
      solutionBody: "<p>Transparencia total: te recomendamos consultar a tu médico antes de usar CBD en el embarazo; la evidencia tópica aún es limitada. No es letra pequeña – es hablar claro.</p><p>Lo que sí podemos ofrecer con la conciencia tranquila es Au Naturel, nuestro desmaquillante a base de aceites, y Fungtastic, extracto de hongos con setas adaptógenas que apoyan la piel por dentro. Sin cannabinoides, formulación suave y natural.</p><p>El embarazo es confiar en el cuerpo y elegir con cabeza. Estamos aquí con opciones que te puedan sentar bien, y siempre decimos lo que sabemos – y lo que aún no sabemos.</p>",
      faq: [
        { q: "¿Puedo usar skincare con CBD si estoy embarazada?", a: "Te recomendamos hablar con tu matrona o médico antes. La investigación sobre CBD tópico en el embarazo sigue siendo limitada; queremos que te sientas totalmente segura." },
        { q: "¿Qué productos 1753 encajan en el embarazo?", a: "Au Naturel makeup remover y Fungtastic mushroom extract no llevan cannabinoides y están formulados con ingredientes suaves y naturales. Consulta siempre a tu equipo para consejo personalizado." },
        { q: "¿Por qué cambia la piel en el embarazo?", a: "Hormonas como estrógeno y progesterona afectan el sebo, la melanina y la barrera. Hasta el 70 por ciento nota cambios de pigmentación y muchas ven cambiar su tipo de piel." },
        { q: "¿Cuándo vuelve la piel a la normalidad tras el parto?", a: "La mayoría de los cambios hormonales se normalizan entre tres y seis meses. El melasma puede tardar más en aclararse y a veces pide tratamiento activo." }
      ],
      ctaTitle: "Elecciones seguras para ti y tu piel",
      ctaSub: "El embarazo es confianza – en el cuerpo, en tus decisiones, en lo que usas. Aquí tienes opciones naturales con las que puedas estar tranquila."
    },
    de: {
      metaTitle: "Hautpflege in der Schwangerschaft – sichere, natürliche Pflege | 1753",
      metaDescription: "Die Schwangerschaft verändert die Haut. Finde sanfte, natürliche Optionen mit Inhaltsstoffen, denen du vertraust. Immer mit deiner Ärztin oder deinem Arzt sprechen. 1753 SKINCARE.",
      kicker: "Hautpflege in der Schwangerschaft",
      h1: "Hautpflege in der Schwangerschaft – wenn dein Körper die Regeln neu schreibt",
      lead: "In der Schwangerschaft ändert sich alles – auch die Haut. Hormone setzen neue Bedingungen, und du willst sicher sein, was du aufträgst. Das ist klug. Das ist schon Mutterliebe, bevor das Kind da ist.",
      problemTitle: "Warum sich die Haut in der Schwangerschaft verändert",
      problemBody: "<p>Die hormonelle Achterbahn der Schwangerschaft wirkt auf die Haut – und kaum eine Marke spricht ehrlich darüber. Östrogen, Progesteron und melanozytenstimulierende Hormone mischen ein Cocktail aus Glow, Akne, Pigmentflecken, Trockenheit und Überempfindlichkeit – manchmal alles zugleich.</p><p>Melasma, die sogenannte Schwangerschaftsmaske, betrifft bis zu 70 Prozent der Schwangeren. Mehr Blutvolumen kann Rötungen und kapillare Schäden begünstigen. Die Talgproduktion explodiert oder bricht ein. Die Barriere wird brüchiger, die Haut reizbarer.</p><p>Gleichzeitig schrumpft die Liste erlaubter Inhaltsstoffe. Retinol, hochdosierte Salicylsäure, chemische Filter – vieles vom Üblichen passt nicht. Frust pur: Die Haut braucht mehr Pflege denn je, aber die Werkzeugkiste wird kleiner. Du verdienst Produkte, die sicher genug sind, ohne Sorge zu nutzen.</p>",
      tipsTitle: "Sichere Hautpflege in der Schwangerschaft",
      tips: [
        { title: "Sprich mit deiner Hebamme oder Ärztin", body: "Bevor du neue Produkte startest – auch CBD-haltige – immer Rücksprache. Jede Schwangerschaft ist anders, und dein Team kennt deine Situation am besten." },
        { title: "Vereinfache die Routine", body: "Weniger ist mehr. Milder Reiniger, feuchtigkeitsspendendes Öl und Sonnenschutz reichen oft. Nicht viele Neuheiten auf einmal testen." },
        { title: "Sanfte Inhaltsstoffe wählen", body: "Natürliche Öle, Pilzextrakte und mineralischer Lichtschutz sind meist solide Wahlen. Starke Säuren, Retinol und endlose INCI-Listen mit Synthetik meiden." },
        { title: "Pigmentierung im Blick", body: "Hormone machen die Haut sonnenempfindlicher. Täglich mineralischer SPF und weniger direkte Sonne senken das Melasma-Risiko." },
        { title: "Auf Veränderungen hören", body: "Die Haut kann wöchentlich anders sein. Passe die Routine an die Signale an – was im zweiten Trimester ging, passt im dritten vielleicht nicht mehr." }
      ],
      solutionTitle: "Natürliche Optionen in der Schwangerschaft",
      solutionBody: "<p>Wir sind transparent: Bitte sprich mit deiner Ärztin oder deinem Arzt, bevor du CBD in der Schwangerschaft nutzt – die Forschung zu topischem CBD ist noch dünn. Das ist kein Haftungsabschuss, sondern ehrliche Kommunikation.</p><p>Mit gutem Gewissen bieten wir Au Naturel, unseren Make-up-Entferner auf Ölbasis, und Fungtastic mushroom extract mit adaptogenen Pilzen für Unterstützung von innen. Keine Cannabinoide, sanfte natürliche Formulierung.</p><p>Schwangerschaft heißt: dem Körper vertrauen und kluge Entscheidungen treffen. Wir sind da mit Produkten, bei denen du dich sicher fühlen kannst – und wir sagen offen, was wir wissen und was noch offen ist.</p>",
      faq: [
        { q: "Darf ich CBD-Hautpflege in der Schwangerschaft nutzen?", a: "Wir empfehlen, vorher mit Hebamme oder Arzt zu sprechen. Die Daten zu topischem CBD sind begrenzt – uns ist wichtig, dass du dich absolut sicher fühlst." },
        { q: "Welche 1753-Produkte passen in der Schwangerschaft?", a: "Au Naturel makeup remover und Fungtastic mushroom extract enthalten keine Cannabinoide und sind mild und natürlich formuliert. Immer individuell mit deinem Team klären." },
        { q: "Warum verändert sich die Haut?", a: "Hormone wie Östrogen und Progesteron beeinflussen Talg, Melanin und die Barriere. Bis zu 70 Prozent bemerken Pigmentveränderungen, viele spüren einen Wechsel des Hauttyps." },
        { q: "Wann normalisiert sich die Haut nach der Geburt?", a: "Die meisten hormonellen Hautveränderungen gleichen sich in drei bis sechs Monaten aus. Melasma kann länger brauchen und manchmal aktive Pflege erfordern." }
      ],
      ctaTitle: "Sichere Entscheidungen für dich und deine Haut",
      ctaSub: "Schwangerschaft ist Vertrauen – in den Körper, in deine Wahl, in deine Produkte. Wir sind da mit natürlichen Optionen, bei denen du dich wohlfühlst."
    },
    fr: {
      metaTitle: "Soin de la peau pendant la grossesse – soins sûrs et naturels | 1753",
      metaDescription: "La grossesse change la peau. Des options naturelles avec des ingrédients de confiance. Consulte toujours ton professionnel de santé. 1753 SKINCARE.",
      kicker: "Soin de la peau pendant la grossesse",
      h1: "Soin de la peau pendant la grossesse – quand ton corps réécrit les règles",
      lead: "Pendant la grossesse, tout bouge – y compris la peau. Les hormones changent la donne et tu veux être sûre de ce que tu appliques. C'est lucide. C'est déjà de la parentalité avant la naissance.",
      problemTitle: "Pourquoi la peau change pendant la grossesse",
      problemBody: "<p>Le manège hormonal de la grossesse agit sur la peau de façon que peu de marques racontent honnêtement. Œstrogène, progestérone et hormones stimulant les mélanocytes forment un cocktail : éclat, acné, taches, sécheresse, hypersensibilité – parfois tout en même temps.</p><p>Le melasma, ce masque de grossesse, touche jusqu'à 70 % des femmes enceintes. Le volume sanguin peut donner des rougeurs et des petits vaisseaux visibles. Le sébum explose ou s'éteint. La barrière se fragilise, la peau s'irrite plus vite.</p><p>En parallèle, la liste des ingrédients ok se raccourcit. Rétinol, acide salicylique à forte dose, filtres chimiques – beaucoup du classique ne convient pas. Frustration : la peau demande plus de soins que jamais, mais la boîte à outils rétrécit. Tu mérites des produits assez sûrs pour les utiliser sans angoisse.</p>",
      tipsTitle: "Soins sûrs pendant la grossesse",
      tips: [
        { title: "Parle à ton équipe soignante", body: "Avant toute nouveauté – y compris au CBD – consulte ta sage-femme ou ton médecin. Chaque grossesse est unique, et c'est ton suivi qui compte." },
        { title: "Simplifie la routine", body: "Moins, c'est souvent mieux. Nettoyant doux, huile hydratante, protection solaire suffisent souvent. Évite d'empiler plein de nouveautés d'un coup." },
        { title: "Choisis des ingrédients doux", body: "Huiles naturelles, extraits de champignons, écran minéral : en général de bons choix. Évite acides agressifs, rétinol et listes INCI interminables de synthétiques." },
        { title: "Protège contre la pigmentation", body: "Les hormones rendent la peau plus sensible au soleil. SPF minéral au quotidien et moins d'exposition directe limitent le risque de melasma." },
        { title: "Écoute les changements", body: "La peau évolue d'une semaine à l'autre. Ajuste selon ce qu'elle te dit – ce qui allait au deuxième trimestre peut ne plus aller au troisième." }
      ],
      solutionTitle: "Options naturelles pendant la grossesse",
      solutionBody: "<p>Transparence : nous te recommandons de consulter ton professionnel de santé avant d'utiliser du CBD pendant la grossesse, la recherche topique reste limitée. Ce n'est pas un disclaimer – c'est parler vrai.</p><p>Ce que nous proposons en toute conscience : Au Naturel, notre démaquillant aux huiles naturelles, et Fungtastic mushroom extract avec champignons adaptogènes pour un soutien de l'intérieur. Pas de cannabinoïdes, formule douce et naturelle.</p><p>La grossesse, c'est faire confiance au corps et choisir avec lucidité. Nous sommes là avec des options naturelles rassurantes, en disant ce que nous savons – et ce qui reste à explorer.</p>",
      faq: [
        { q: "Puis-je utiliser du CBD sur la peau enceinte ?", a: "Nous te conseillons d'en parler à ta sage-femme ou ton médecin avant. Les données sur le CBD topique restent limitées ; nous voulons que tu te sentes totalement en sécurité." },
        { q: "Quels produits 1753 pendant la grossesse ?", a: "Au Naturel makeup remover et Fungtastic mushroom extract ne contiennent pas de cannabinoïdes et sont formulés avec des ingrédients doux et naturels. Toujours un avis personnalisé avec ton équipe." },
        { q: "Pourquoi la peau change-t-elle ?", a: "Des hormones comme œstrogène et progestérone influencent sébum, mélanine et barrière. Jusqu'à 70 % voient des changements de pigmentation ; beaucoup constatent un type de peau différent." },
        { q: "Quand la peau redevient-elle normale après l'accouchement ?", a: "La plupart des effets hormonaux se stabilisent en trois à six mois. Le melasma peut mettre plus longtemps à s'estomper et parfois demander un soin actif." }
      ],
      ctaTitle: "Des choix sûrs pour toi et ta peau",
      ctaSub: "La grossesse, c'est la confiance – dans le corps, dans tes choix, dans tes produits. Nous sommes là avec des options naturelles qui rassurent."
    }
  },
  {
    svSlug: "hudvard-tonaring",
    enSlug: "skincare-teenagers",
    esSlug: "cuidado-de-la-piel-adolescentes",
    deSlug: "hautpflege-teenager",
    frSlug: "soin-de-la-peau-adolescents",
    category: "audience",
    productIds: ["ta-da-serum", "au-naturel-makeup-remover"],
    sv: {
      metaTitle: "Hudvård för tonåringar – en ärlig start utan krångel | 1753",
      metaDescription: "Tonårshuden är inte trasig – den håller på att hitta sig själv. Lär dig grunderna i en enkel hudvårdsrutin som faktiskt hjälper. 1753 SKINCARE.",
      kicker: "Hudvård för tonåringar",
      h1: "Hudvård för tonåringar – din hud är inte problemet, hormoner är det",
      lead: "Puberteten kastar om allt i kroppen och huden är ofta den som får ta smällen synligt. Finnar, fet hy, torrhet – det är inte för att du gör något fel. Det är för att kroppen håller på att bygga om sig.",
      problemTitle: "Varför tonårshud beter sig som den gör",
      problemBody: "<p>När puberteten drar igång ökar produktionen av androgener – hormoner som bland annat styr talgproduktionen i huden. Resultatet är att talgkörtlarna går på högvarv, porerna kan täppas igen och bakterier får en miljö de trivs i. Akne är inte ett hygienproblem – det är ett hormonellt och inflammatoriskt tillstånd som drabbar uppemot 85 procent av alla tonåringar.</p><p>Problemet förvärras av att många tonåringar antingen ignorerar huden helt eller gör för mycket. Aggressiva rengöringar med alkohol, överdriven användning av tillfälliga lösningar och desperat pillande skapar ofta mer skada än nytta. Huden svarar på överdriven rengöring med att producera ännu mer talg – en ond cirkel som är fruktansvärt frustrerande.</p><p>Dessutom bombarderas tonåringar med budskap om hur huden ska se ut – filtrerade bilder, perfekt hy i reklam, kommentarer från omgivningen. Sanningen är att tonårshud genomgår en naturlig process. Den behöver stöd, inte straff. En enkel, genomtänkt rutin kan göra enorm skillnad utan att kosta en förmögenhet.</p>",
      tipsTitle: "Grunderna i en tonårsrutin",
      tips: [
        { title: "Tvätta inte för mycket", body: "Rengör morgon och kväll med en mild rengöring. Inte mer. Överdriven tvätt triggar huden att producera mer talg och förvärrar situationen." },
        { title: "Pilla inte", body: "Vi vet att det är frestande, men att klämma finnar sprider bakterier och skapar ärr. Låt produkterna göra jobbet istället." },
        { title: "Börja med ett serum", body: "Ett lätt serum med aktiva ingredienser absorberas snabbt och känns inte kladdigt. Perfekt om du inte gillar känslan av kräm." },
        { title: "Solskydd varje dag", body: "UV-strålning förvärrar akneärr och pigmentering. Hitta ett lätt solskydd som inte täpper till porerna. Din framtida hud kommer tacka dig." },
        { title: "Ha tålamod", body: "Ingen produkt ger resultat över en natt. Hudens förnyelsecykel är cirka fyra veckor. Ge din rutin minst den tiden innan du bedömer om den fungerar." }
      ],
      solutionTitle: "TA-DA Serum – ett smart första steg",
      solutionBody: "<p>TA-DA Serum med CBG är ett utmärkt första steg in i hudvård. Det är lätt, absorberas snabbt och känns aldrig kladdigt på huden. CBG har lugnande och antiinflammatoriska egenskaper som är relevanta för tonårshud som kämpar med inflammation och överaktiva talgkörtlar.</p><p>Kombinera med Au Naturel för en mild rengöring som inte sliter på hudbarriären. Två steg, under en minut. Det är en rutin som till och med den mest ointresserade tonåringen kan genomföra.</p><p>Vi tror på att börja enkelt och bygga därifrån. En rutin som känns överkomlig både i tid och pengar har större chans att faktiskt bli en vana. Och det är vanan – inte den dyraste produkten – som gör skillnaden.</p>",
      faq: [
        { q: "Från vilken ålder kan man börja med hudvård?", a: "Det finns ingen exakt ålder, men de flesta drar nytta av en enkel rutin från 12–13 års ålder, när talgproduktionen ökar. Rengöring och fukt är grunderna – mer behövs sällan i början." },
        { q: "Är CBG-produkter lämpliga för tonåringar?", a: "CBG är en naturlig, icke-psykoaktiv cannabinoid med lugnande egenskaper. Det finns inga kända risker vid topikalt bruk, men vi rekommenderar alltid att föräldrar är involverade i valet av hudvårdsprodukter för yngre tonåringar." },
        { q: "Hjälper CBD/CBG mot akne?", a: "Forskning visar att cannabinoider kan hjälpa till att reglera talgproduktion och minska inflammation, två centrala faktorer vid akne. Det ersätter inte dermatologisk behandling vid svår akne, men kan vara ett värdefullt komplement." },
        { q: "Hur mycket bör en tonåring lägga på hudvård?", a: "Inte mycket. En enkel rutin med rengöring och ett serum räcker långt. Det handlar om konsekvens, inte pris. En budget-vänlig start med rätt produkter är bättre än dyra produkter som samlar damm." }
      ],
      ctaTitle: "Börja enkelt – det är hela poängen",
      ctaSub: "En rutin som tar under en minut och inte kostar skjortan. TA-DA Serum och Au Naturel är allt du behöver för att starta."
    },
    en: {
      metaTitle: "Skincare for teenagers – an honest start without the fuss | 1753",
      metaDescription: "Teen skin isn't broken – it's finding itself. Learn the basics of a simple skincare routine that actually helps. 1753 SKINCARE.",
      kicker: "Skincare for teenagers",
      h1: "Skincare for teenagers – your skin isn't the problem, hormones are",
      lead: "Puberty throws everything in the body into flux, and skin is often the one visibly taking the hit. Breakouts, oily skin, dryness – it's not because you're doing something wrong. It's because your body is rebuilding itself.",
      problemTitle: "Why teen skin behaves the way it does",
      problemBody: "<p>When puberty kicks in, androgen production increases – hormones that among other things control sebum production in the skin. The result is sebaceous glands going into overdrive, pores getting clogged, and bacteria finding an environment they thrive in. Acne isn't a hygiene problem – it's a hormonal and inflammatory condition that affects up to 85 percent of all teenagers.</p><p>The problem is made worse by the fact that many teenagers either ignore their skin entirely or do too much. Aggressive cleansers with alcohol, overuse of quick fixes, and desperate picking often create more damage than good. The skin responds to over-cleansing by producing even more oil – a vicious cycle that's incredibly frustrating.</p><p>On top of that, teenagers are bombarded with messages about how skin should look – filtered images, perfect complexions in ads, comments from people around them. The truth is that teen skin is going through a natural process. It needs support, not punishment. A simple, thoughtful routine can make an enormous difference without costing a fortune.</p>",
      tipsTitle: "The basics of a teen routine",
      tips: [
        { title: "Don't over-wash", body: "Cleanse morning and evening with a gentle cleanser. No more than that. Over-washing triggers skin to produce more oil and makes things worse." },
        { title: "Don't pick", body: "We know it's tempting, but squeezing spots spreads bacteria and creates scars. Let the products do the work instead." },
        { title: "Start with a serum", body: "A lightweight serum with active ingredients absorbs quickly and doesn't feel greasy. Perfect if you don't like the feel of cream." },
        { title: "Sunscreen every day", body: "UV radiation worsens acne scars and pigmentation. Find a lightweight sunscreen that won't clog pores. Your future skin will thank you." },
        { title: "Be patient", body: "No product gives results overnight. The skin's renewal cycle is about four weeks. Give your routine at least that long before judging whether it works." }
      ],
      solutionTitle: "TA-DA Serum – a smart first step",
      solutionBody: "<p>TA-DA Serum with CBG is an excellent first step into skincare. It's lightweight, absorbs quickly, and never feels greasy on the skin. CBG has calming and anti-inflammatory properties relevant for teen skin dealing with inflammation and overactive sebaceous glands.</p><p>Combine it with Au Naturel for gentle cleansing that doesn't strip the skin barrier. Two steps, under a minute. It's a routine that even the most reluctant teenager can follow through with.</p><p>We believe in starting simple and building from there. A routine that feels manageable in both time and money has a much better chance of actually becoming a habit. And it's the habit – not the most expensive product – that makes the difference.</p>",
      faq: [
        { q: "From what age can you start a skincare routine?", a: "There's no exact age, but most benefit from a simple routine starting at 12–13, when sebum production increases. Cleansing and moisture are the basics – more is rarely needed at first." },
        { q: "Are CBG products suitable for teenagers?", a: "CBG is a natural, non-psychoactive cannabinoid with calming properties. There are no known risks with topical use, but we always recommend parents being involved in skincare product choices for younger teens." },
        { q: "Does CBD/CBG help with acne?", a: "Research shows cannabinoids may help regulate sebum production and reduce inflammation, two central factors in acne. It doesn't replace dermatological treatment for severe acne, but can be a valuable complement." },
        { q: "How much should a teenager spend on skincare?", a: "Not much. A simple routine with cleanser and serum goes a long way. It's about consistency, not price. A budget-friendly start with the right products is better than expensive products gathering dust." }
      ],
      ctaTitle: "Start simple – that's the whole point",
      ctaSub: "A routine that takes under a minute and doesn't break the bank. TA-DA Serum and Au Naturel are all you need to get started."
    },
    es: {
      metaTitle: "Cuidado de la piel para adolescentes – un inicio honesto sin líos | 1753",
      metaDescription: "La piel adolescente no está rota – se está encontrando. Bases de una rutina simple que de verdad ayuda. 1753 SKINCARE.",
      kicker: "Cuidado de la piel para adolescentes",
      h1: "Cuidado de la piel para adolescentes – tu piel no es el problema, lo son las hormonas",
      lead: "La pubertad revuelve todo el cuerpo y la piel suele ser la que lo muestra. Granos, grasa, sequedad – no es porque lo hagas mal. Es porque tu cuerpo se está reconstruyendo.",
      problemTitle: "Por qué la piel adolescente se comporta así",
      problemBody: "<p>Cuando arranca la pubertad sube la producción de andrógenos – hormonas que entre otras cosas mandan en el sebo. Las glándulas sebáceas aceleran, los poros se tapan y las bacterias encuentran fiesta. El acné no es un tema de higiene – es hormonal e inflamatorio y afecta hasta al 85 por ciento de los adolescentes.</p><p>Peor aún: muchos ignoran la piel o hacen demasiado. Limpiadores agresivos con alcohol, parches milagro y pinchar esporádico suelen empeorar. La piel responde al exceso de limpieza produciendo aún más sebo – un círculo cruel y frustrante.</p><p>Encima, bombardeo de imágenes de piel imposible. La verdad: la piel adolescente pasa un proceso natural. Necesita apoyo, no castigo. Una rutina simple y pensada marca diferencia sin vaciar la cuenta.</p>",
      tipsTitle: "Lo básico de una rutina teen",
      tips: [
        { title: "No te laves en exceso", body: "Limpia mañana y noche con algo suave. Nada más. Lavar de más dispara más sebo y empeora el cuadro." },
        { title: "No pinches", body: "Sabemos que pica la tentación, pero exprimir esparce bacterias y deja marcas. Deja que los productos trabajen." },
        { title: "Empieza con un serum", body: "Un serum ligero con activos absorbe rápido y no deja sensación grasa. Ideal si no te gusta la crema." },
        { title: "SPF todos los días", body: "El UV empeora marcas y manchas. Busca un protector ligero que no obstruya poros. Tu piel del futuro te lo agradecerá." },
        { title: "Paciencia", body: "Nada arregla la piel de la noche a la mañana. El ciclo de renovación ronda las cuatro semanas. Dale al menos ese tiempo antes de juzgar." }
      ],
      solutionTitle: "TA-DA Serum – un primer paso inteligente",
      solutionBody: "<p>TA-DA Serum con CBG es un gran primer contacto con el skincare. Ligero, absorbe al instante y nunca se siente pegajoso. El CBG aporta calma e antiinflamación – clave cuando hay inflamación y glándulas hiperactivas.</p><p>Combínalo con Au Naturel para limpiar sin destrozar la barrera. Dos pasos, menos de un minuto. Hasta el adolescente más reacio puede cumplirlo.</p><p>Creemos en empezar simple y crecer desde ahí. Una rutina viable en tiempo y dinero tiene más posibilidades de volverse hábito. Y el hábito – no el producto caro – es lo que cambia el juego.</p>",
      faq: [
        { q: "¿A partir de qué edad empezar?", a: "No hay edad mágica; muchos se benefician desde los 12–13 años cuando sube el sebo. Limpieza e hidratación bastan al inicio – rara vez hace falta más." },
        { q: "¿Los productos con CBG van para adolescentes?", a: "El CBG es un cannabinoide natural, no psicoactivo, con efecto calmante. No hay riesgos conocidos en uso tópico; igual recomendamos que padres o tutores participen en la elección si son muy jóvenes." },
        { q: "¿CBD/CBG ayudan con el acné?", a: "La investigación sugiere que los cannabinoides pueden modular sebo e inflamación – dos pilares del acné. No sustituye dermatología en casos graves, pero puede complementar." },
        { q: "¿Cuánto hay que gastar?", a: "Poco. Limpieza + serum bien elegidos van lejos. Es constancia, no precio. Mejor un inicio asequible que frascos caros guardando polvo." }
      ],
      ctaTitle: "Empieza simple – de eso va el asunto",
      ctaSub: "Rutina de menos de un minuto sin arruinarte. TA-DA Serum y Au Naturel son suficientes para arrancar."
    },
    de: {
      metaTitle: "Hautpflege für Teenager – ein ehrlicher Start ohne Schnickschnack | 1753",
      metaDescription: "Teenagerhaut ist nicht kaputt – sie findet sich. Lerne die Basics einer einfachen Routine, die wirklich hilft. 1753 SKINCARE.",
      kicker: "Hautpflege für Teenager",
      h1: "Hautpflege für Teenager – deine Haut ist nicht das Problem, Hormone sind es",
      lead: "Pubertät wirbelt alles durcheinander, und die Haut zeigt es oft zuerst. Pickel, fettige Haut, Trockenheit – nicht, weil du etwas falsch machst. Dein Körper baut sich gerade um.",
      problemTitle: "Warum sich Teenagerhaut so verhält",
      problemBody: "<p>Mit der Pubertät steigt die Androgenproduktion – Hormone, die unter anderem den Talg steuern. Talgdrüsen laufen heiß, Poren verstopfen, Bakterien fühlen sich wohl. Akne ist kein Hygienethema – sie ist hormonal und entzündlich und betrifft bis zu 85 Prozent aller Teenager.</p><p>Schlimmer: Viele ignorieren die Haut komplett oder übertreiben. Aggressive Reiniger mit Alkohol, Quick-Fix-Übernutzung und Herumdrücken schaden oft mehr. Überreinigung triggert mehr Talg – ein Teufelskreis.</p><p>Dazu kommen unrealistische Bilder von perfekter Haut. Fakt: Teenagerhaut durchläuft einen natürlichen Prozess. Sie braucht Unterstützung, keine Strafe. Eine schlichte, durchdachte Routine hilft enorm – ohne Bankrott.</p>",
      tipsTitle: "Die Basics einer Teen-Routine",
      tips: [
        { title: "Nicht überwaschen", body: "Morgens und abends mild reinigen. Nicht mehr. Zu viel Waschen treibt mehr Talg an und verschlechtert alles." },
        { title: "Nicht ausdrücken", body: "Lockt zwar, verteilt aber Bakterien und hinterlässt Narben. Lass die Produkte arbeiten." },
        { title: "Mit Serum starten", body: "Ein leichtes Serum mit Wirkstoffen zieht schnell ein und fühlt sich nicht fettig an. Ideal, wenn du Cremes nicht magst." },
        { title: "Täglich Lichtschutz", body: "UV verschärft Aknenarben und Pigmentierung. Leichte Formel, die nicht verstopft. Deine zukünftige Haut dankt dir." },
        { title: "Geduld", body: "Kein Produkt wirkt über Nacht. Der Erneuerungszyklus dauert etwa vier Wochen. Gib der Routine mindestens so lange." }
      ],
      solutionTitle: "TA-DA Serum – ein kluger erster Schritt",
      solutionBody: "<p>TA-DA Serum mit CBG ist ein starker Einstieg in die Hautpflege. Leicht, zieht schnell ein, nie klebrig. CBG beruhigt und wirkt entzündungshemmend – relevant bei entzündlicher, überaktiver Teenagerhaut.</p><p>Kombiniere mit Au Naturel für schonende Reinigung ohne Barriere-Kollaps. Zwei Schritte, unter einer Minute. Selbst widerwillige Teenager schaffen das.</p><p>Wir glauben an Start simpel und dann ausbauen. Eine machbare Routine in Zeit und Geld wird eher zur Gewohnheit. Und die Gewohnheit – nicht das teuerste Produkt – macht den Unterschied.</p>",
      faq: [
        { q: "Ab welchem Alter starten?", a: "Kein fixes Alter; viele profitieren ab 12–13, wenn der Talg zunimmt. Reinigung und Feuchtigkeit reichen am Anfang – mehr selten nötig." },
        { q: "Sind CBG-Produkte für Teenager ok?", a: "CBG ist ein natürliches, nicht psychoaktives Cannabinoid mit beruhigender Wirkung. Für topische Nutzung sind keine Risiken bekannt; Eltern sollten bei jüngeren Teenies mitentscheiden." },
        { q: "Helfen CBD/CBG bei Akne?", a: "Studien deuten darauf hin, dass Cannabinoide Talg und Entzündung beeinflussen können – zwei Kerne der Akne. Ersetzt keine Dermatologie bei schwerer Akne, kann aber ergänzen." },
        { q: "Wie viel Geld ausgeben?", a: "Nicht viel. Reiniger plus Serum reichen weit. Es geht um Konstanz, nicht Preis. Günstiger Start mit den richtigen Produkten schlägt teure Staubfänger." }
      ],
      ctaTitle: "Fang simpel an – genau darum geht's",
      ctaSub: "Routine unter einer Minute, ohne die Kasse zu plündern. TA-DA Serum und Au Naturel reichen zum Start."
    },
    fr: {
      metaTitle: "Soin de la peau pour ados – un début honnête sans prise de tête | 1753",
      metaDescription: "La peau d'ado n'est pas cassée – elle se cherche. Les bases d'une routine simple qui aide vraiment. 1753 SKINCARE.",
      kicker: "Soin de la peau pour ados",
      h1: "Soin de la peau pour ados – ce n'est pas ta peau le problème, ce sont les hormones",
      lead: "La puberté secoue tout le corps, et la peau affiche souvent la facture. Boutons, gras, sécheresse – ce n'est pas parce que tu te trompes. Ton corps se reconstruit.",
      problemTitle: "Pourquoi la peau d'ado réagit comme ça",
      problemBody: "<p>Avec la puberté, la production d'androgènes augmente – hormones qui pilotent entre autres le sébum. Les glandes s'emballent, les pores se bouchent, les bactéries adorent. L'acné n'est pas un problème d'hygiène – c'est hormonal et inflammatoire, et ça touche jusqu'à 85 % des ados.</p><p>Pire : beaucoup ignorent la peau ou font trop. Nettoyants agressifs à l'alcool, quick fixes en série et gratter les boutons font souvent plus de mal. Sur-nettoyer pousse la peau à produire encore plus de sébum – cercle vicieux épuisant.</p><p>En plus, les images de peau parfaite partout. Vérité : la peau d'ado traverse un processus naturel. Elle a besoin de soutien, pas de punition. Une routine simple et réfléchie change beaucoup de choses – sans ruiner ton budget.</p>",
      tipsTitle: "Les bases d'une routine ado",
      tips: [
        { title: "Ne sur-lave pas", body: "Nettoie matin et soir avec un produit doux. Pas plus. Trop laver déclenche plus de sébum et empire la situation." },
        { title: "Ne perce pas", body: "Tentant, oui, mais ça propage les bactéries et laisse des cicatrices. Laisse les produits faire le travail." },
        { title: "Commence par un sérum", body: "Un sérum léger avec actifs pénètre vite sans effet gras. Parfait si tu n'aimes pas les crèmes." },
        { title: "Crème solaire chaque jour", body: "Les UV aggravent les marques d'acné et les taches. Choisis une formule légère non comédogène. Ta peau future dira merci." },
        { title: "Patience", body: "Aucun produit ne magie en une nuit. Le cycle de renouvellement fait environ quatre semaines. Donne au moins ce délai avant de juger." }
      ],
      solutionTitle: "TA-DA Serum – un premier pas malin",
      solutionBody: "<p>TA-DA Serum au CBG est une excellente porte d'entrée du soin. Léger, absorption rapide, jamais collant. Le CBG apaise et calme l'inflammation – utile quand les glandes s'emballent.</p><p>Ajoute Au Naturel pour nettoyer sans détruire la barrière. Deux étapes, moins d'une minute. Même les ados les plus réfractaires peuvent tenir le rythme.</p><p>On croit au départ minimaliste, puis on construit. Une routine réaliste en temps et en argent devient plus facilement une habitude. Et c'est l'habitude – pas le produit le plus cher – qui fait la différence.</p>",
      faq: [
        { q: "À partir de quel âge commencer ?", a: "Pas d'âge fixe ; beaucoup gagnent avec une routine simple vers 12–13 ans quand le sébum monte. Nettoyage + hydratation suffisent au début – rarement besoin de plus." },
        { q: "Les produits au CBG conviennent aux ados ?", a: "Le CBG est un cannabinoïde naturel, non psychoactif, apaisant. Pas de risque connu en usage topique ; on recommande que les parents participent au choix pour les plus jeunes." },
        { q: "CBD/CBG et acné ?", a: "La recherche suggère que les cannabinoïdes peuvent moduler sébum et inflammation – deux piliers de l'acné. Ça ne remplace pas un dermatologue si c'est sévère, mais ça peut compléter." },
        { q: "Combien dépenser ?", a: "Pas grand-chose. Nettoyant + sérum bien choisis vont loin. C'est la régularité, pas le prix. Mieux vaut un début accessible que des pots chers qui prennent la poussière." }
      ],
      ctaTitle: "Commence simple – c'est tout le projet",
      ctaSub: "Une routine en moins d'une minute sans flamber le budget. TA-DA Serum et Au Naturel suffisent pour démarrer."
    }
  },
  {
    svSlug: "hudvard-mogen-hud",
    enSlug: "skincare-mature-skin",
    esSlug: "cuidado-de-la-piel-madura",
    deSlug: "hautpflege-reife-haut",
    frSlug: "soin-de-la-peau-mature",
    category: "audience",
    productIds: ["duo-ta-da", "ta-da-serum", "fungtastic-mushroom-extract"],
    sv: {
      metaTitle: "Hudvård för mogen hud – djup näring, inte tomma löften | 1753",
      metaDescription: "Mogen hud behöver djup näring och stöd, inte anti-aging-panik. CBD och CBG ger din hud det den faktiskt efterfrågar. 1753 SKINCARE.",
      kicker: "Hudvård för mogen hud",
      h1: "Hudvård för mogen hud – ålder är inte en sjukdom att behandla",
      lead: "Din hud har levt. Den har skrattat, gråtit, sett sol och vind. Den förtjänar inte produkter som behandlar åldring som ett problem – den förtjänar produkter som ger den vad den behöver i det här kapitlet.",
      problemTitle: "Vad som faktiskt händer med mogen hud",
      problemBody: "<p>Från omkring 25 års ålder minskar kollagenproduktionen med ungefär en procent per år. Vid 50 har du förlorat cirka 25 procent av ditt kollagen. Elastinfibrerna, som ger huden dess studs och elasticitet, bryts ner och ersätts inte i samma takt. Huden blir tunnare, torrare och mer sårbar för yttre påverkan.</p><p>Men det handlar inte bara om kollagen. Hudens endocannabinoidsystem förändras också med åldern. ECS-receptorernas aktivitet minskar, vilket påverkar hudens förmåga att reglera inflammation, cellförnyelse och fuktbalans. Det är delvis därför mogen hud tenderar att vara torrare, känsligare och långsammare att läka.</p><p>Anti-aging-industrin säljer rädsla och förpackar den som lösningar. Men mogen hud behöver inte räddas – den behöver stödjas. Djup näring, stöd till cellförnyelse, inflammationskontroll och barriärstöd. Det är grunderna, och det är vad som faktiskt gör skillnad när man slutar jaga en ungdomlig ideal och börjar ta hand om den hud man har.</p>",
      tipsTitle: "Klok hudvård för mogen hud",
      tips: [
        { title: "Prioritera näring framför anti-aging", body: "Sluta jaga den senaste anti-aging-trenden. Fokusera istället på att ge huden djup näring med oljor och serum som stödjer barriärfunktionen och cellförnyelsen." },
        { title: "Stöd inifrån", body: "Adaptogena svampar och kosttillskott som stödjer kollagenproduktionen gör skillnad inifrån. Huden speglar hela kroppens hälsa, och mogen hud svarar särskilt bra på insatser inifrån." },
        { title: "Var generös med olja", body: "Mogen hud producerar mindre talg och behöver mer extern näring. Ansiktsoljor med CBD absorberas väl och ger den fettlösliga näring som mogen hud längtar efter." },
        { title: "Skydda barriären", body: "Undvik produkter som utmanar hudbarriären – starka syror, aggressiva rengöringar, retinol i höga doser. Mogen hud har en tunnare barriär som behöver stöd, inte stress." }
      ],
      solutionTitle: "1753 SKINCARE för mogen hud",
      solutionBody: "<p>DUO TA-DA kombinerar det bästa från båda världar: CBD-ansiktsolja för djup näring och CBG-serum för koncentrerat stöd till cellförnyelse. Det är en duo som ger mogen hud exakt det den behöver utan att överbelasta med onödiga ingredienser.</p><p>CBD stödjer hudens endocannabinoidsystem som naturligt avtar med åldern, medan CBG arbetar direkt med hudens receptorer för att lugna inflammation och förstärka barriären. Komplettera med Fungtastic svampextrakt för stöd inifrån – adaptogena svampar som bidrar till hela kroppens balans.</p><p>Vi tror inte på anti-aging som koncept. Vi tror på att ge huden de bästa förutsättningarna i varje skede av livet. Mogen hud är inte ett problem att lösa – det är hud som förtjänar den bästa omvårdnaden.</p>",
      faq: [
        { q: "Från vilken ålder räknas huden som mogen?", a: "Det varierar individuellt, men generellt börjar man prata om mogen hud runt 45–50 år när kollagenförlusten blivit tydlig och hudens barriärfunktion förändrats märkbart. Vissa märker det tidigare, andra senare." },
        { q: "Kan CBD hjälpa mot rynkor?", a: "CBD ersätter inte förlorat kollagen, men det stödjer hudens eget endocannabinoidsystem som påverkar cellförnyelse och inflammation. Friskare, mer balanserad hud ser naturligt bättre ut oavsett ålder." },
        { q: "Behöver mogen hud mer produkter?", a: "Inte nödvändigtvis fler, men andra. Mogen hud drar nytta av rikare produkter med djup näring – ansiktsoljor framför lätta lotioner, serum med aktiva ingredienser framför vatten-baserade toner." },
        { q: "Spelar kost och livsstil roll för hudens åldrande?", a: "Absolut. Sömn, kost rik på antioxidanter, stresshantering och rörelse har alla dokumenterad effekt på hudens åldrande. Hudvård utifrån och livsstil inifrån arbetar bäst tillsammans." }
      ],
      ctaTitle: "Ge din hud det den förtjänar",
      ctaSub: "Mogen hud behöver djup näring och intelligent stöd. DUO TA-DA och Fungtastic ger din hud de bästa förutsättningarna – på dina villkor."
    },
    en: {
      metaTitle: "Skincare for mature skin – deep nourishment, not empty promises | 1753",
      metaDescription: "Mature skin needs deep nourishment and support, not anti-aging panic. CBD and CBG give your skin what it actually asks for. 1753 SKINCARE.",
      kicker: "Skincare for mature skin",
      h1: "Skincare for mature skin – aging is not a disease to treat",
      lead: "Your skin has lived. It has laughed, cried, seen sun and wind. It doesn't deserve products that treat aging as a problem – it deserves products that give it what it needs in this chapter.",
      problemTitle: "What actually happens with mature skin",
      problemBody: "<p>From around age 25, collagen production decreases by about one percent per year. By 50, you've lost roughly 25 percent of your collagen. Elastin fibers, which give skin its bounce and elasticity, break down and aren't replaced at the same rate. Skin becomes thinner, drier, and more vulnerable to external factors.</p><p>But it's not just about collagen. The skin's endocannabinoid system also changes with age. ECS receptor activity decreases, affecting the skin's ability to regulate inflammation, cell renewal, and moisture balance. That's partly why mature skin tends to be drier, more sensitive, and slower to heal.</p><p>The anti-aging industry sells fear and packages it as solutions. But mature skin doesn't need saving – it needs support. Deep nourishment, cell renewal support, inflammation control, and barrier support. These are the fundamentals, and they're what actually makes a difference when you stop chasing youthful ideals and start caring for the skin you have.</p>",
      tipsTitle: "Smart skincare for mature skin",
      tips: [
        { title: "Prioritize nourishment over anti-aging", body: "Stop chasing the latest anti-aging trend. Instead, focus on giving skin deep nourishment with oils and serums that support barrier function and cell renewal." },
        { title: "Support from within", body: "Adaptogenic mushrooms and supplements supporting collagen production make a difference from the inside. Skin reflects overall body health, and mature skin responds especially well to internal support." },
        { title: "Be generous with oil", body: "Mature skin produces less sebum and needs more external nourishment. Face oils with CBD absorb well and deliver the fat-soluble nutrition mature skin craves." },
        { title: "Protect the barrier", body: "Avoid products that challenge the skin barrier – strong acids, aggressive cleansers, high-dose retinol. Mature skin has a thinner barrier that needs support, not stress." }
      ],
      solutionTitle: "1753 SKINCARE for mature skin",
      solutionBody: "<p>DUO TA-DA combines the best of both worlds: CBD face oil for deep nourishment and CBG serum for concentrated cell renewal support. It's a duo that gives mature skin exactly what it needs without overloading with unnecessary ingredients.</p><p>CBD supports the skin's endocannabinoid system that naturally declines with age, while CBG works directly with the skin's receptors to calm inflammation and strengthen the barrier. Complement with Fungtastic mushroom extract for support from within – adaptogenic mushrooms that contribute to whole-body balance.</p><p>We don't believe in anti-aging as a concept. We believe in giving skin the best conditions at every stage of life. Mature skin isn't a problem to solve – it's skin that deserves the finest care.</p>",
      faq: [
        { q: "At what age is skin considered mature?", a: "It varies individually, but generally skin is considered mature around 45–50 when collagen loss becomes noticeable and the skin's barrier function has changed significantly. Some notice it earlier, others later." },
        { q: "Can CBD help with wrinkles?", a: "CBD doesn't replace lost collagen, but it supports the skin's own endocannabinoid system, which affects cell renewal and inflammation. Healthier, more balanced skin naturally looks better regardless of age." },
        { q: "Does mature skin need more products?", a: "Not necessarily more, but different. Mature skin benefits from richer products with deep nourishment – face oils over lightweight lotions, serums with active ingredients over water-based toners." },
        { q: "Do diet and lifestyle affect skin aging?", a: "Absolutely. Sleep, a diet rich in antioxidants, stress management, and exercise all have documented effects on skin aging. External skincare and internal lifestyle work best together." }
      ],
      ctaTitle: "Give your skin what it deserves",
      ctaSub: "Mature skin needs deep nourishment and intelligent support. DUO TA-DA and Fungtastic give your skin the best conditions – on your terms."
    },
    es: {
      metaTitle: "Cuidado de la piel madura – nutrición profunda, no promesas vacías | 1753",
      metaDescription: "La piel madura pide nutrición y apoyo, no pánico anti-edad. CBD y CBG dan a tu piel lo que de verdad reclama. 1753 SKINCARE.",
      kicker: "Cuidado de la piel madura",
      h1: "Cuidado de la piel madura – envejecer no es una enfermedad que curar",
      lead: "Tu piel ha vivido. Ha reído, llorado, visto sol y viento. No merece productos que tratan la edad como defecto – merece lo que necesita en este capítulo.",
      problemTitle: "Qué le pasa de verdad a la piel madura",
      problemBody: "<p>A partir de unos 25 años el colágeno baja alrededor de un uno por ciento al año. A los 50 has perdido cerca de un 25 por ciento. Las fibras de elastina, que dan elasticidad, se desgastan y no se repone al mismo ritmo. La piel se adelgaza, se seca y se vuelve más vulnerable.</p><p>No es solo colágeno. El sistema endocannabinoide de la piel también cambia con la edad. Baja la actividad de los receptores ECS, y eso afecta inflamación, renovación celular y equilibrio hídrico. Por eso la piel madura suele ser más seca, más sensible y tarda más en recuperarse.</p><p>La industria anti-edad vende miedo disfrazado de solución. La piel madura no necesita ser salvada – necesita apoyo. Nutrición profunda, ayuda a la renovación, control de inflamación y barrera fuerte. Ahí está la diferencia real cuando dejas de perseguir una juventud imposible y cuidas la piel que tienes.</p>",
      tipsTitle: "Skincare inteligente para piel madura",
      tips: [
        { title: "Nutrición antes que anti-edad", body: "Deja de perseguir cada moda. Apuesta por aceites y serum que alimenten la barrera y la renovación." },
        { title: "Apoyo desde dentro", body: "Hongos adaptógenos y suplementos que apoyan el colágeno marcan diferencia por dentro. La piel refleja el cuerpo entero." },
        { title: "Generosa con el aceite", body: "La piel madura produce menos sebo y pide más nutrición externa. Los aceites con CBD se absorben bien y aportan lo liposoluble que ansía." },
        { title: "Protege la barrera", body: "Evita lo que la desafía – ácidos fuertes, limpiezas agresivas, retinol en dosis altas. La barrera es más fina: necesita contención, no estrés." }
      ],
      solutionTitle: "1753 SKINCARE para piel madura",
      solutionBody: "<p>DUO TA-DA junta lo mejor: aceite facial con CBD para nutrición profunda y TA-DA Serum con CBG para renovación y barrera. Una dupla que da a la piel madura lo que pide sin ingredientes de relleno.</p><p>El CBD apoya el ECS que declina con los años; el CBG habla con los receptores para calmar inflamación y reforzar la barrera. Suma Fungtastic mushroom extract por dentro – hongos adaptógenos para el equilibrio global.</p><p>No creemos en anti-edad como mantra. Creemos en dar a la piel las mejores condiciones en cada etapa. La piel madura no es un problema – es piel que merece el mejor cuidado.</p>",
      faq: [
        { q: "¿A qué edad se considera piel madura?", a: "Depende de cada persona; suele hablarse hacia los 45–50 cuando el colágeno se nota y la barrera cambia. Unos antes, otros después." },
        { q: "¿El CBD ayuda con las arrugas?", a: "No repone colágeno perdido, pero apoya el ECS ligado a renovación e inflamación. Una piel más sana y equilibrada se ve mejor a cualquier edad." },
        { q: "¿Hace falta más productos?", a: "No siempre más, sino otros. La piel madura pide texturas más ricas – aceites antes que lociones ligeras, serum activo antes que tónicos acuosos." },
        { q: "¿Importan dieta y estilo de vida?", a: "Mucho. Sueño, antioxidantes, gestión del estrés y movimiento tienen efecto documentado sobre el envejecimiento cutáneo. Afuera e adentro van juntos." }
      ],
      ctaTitle: "Dale a tu piel lo que merece",
      ctaSub: "Piel madura = nutrición profunda y apoyo listo. DUO TA-DA y Fungtastic te dan las mejores condiciones – a tu manera."
    },
    de: {
      metaTitle: "Hautpflege für reife Haut – tiefe Pflege statt leerer Versprechen | 1753",
      metaDescription: "Reife Haut braucht Nahrung und Support, kein Anti-Aging-Panikmodus. CBD und CBG geben ihr, was sie wirklich will. 1753 SKINCARE.",
      kicker: "Hautpflege für reife Haut",
      h1: "Hautpflege für reife Haut – Altern ist keine Krankheit zum Behandeln",
      lead: "Deine Haut hat gelebt. Gelacht, geweint, Sonne und Wind gesehen. Sie verdient keine Produkte, die Alter als Problem verkaufen – sondern was sie in diesem Kapitel braucht.",
      problemTitle: "Was mit reifer Haut wirklich passiert",
      problemBody: "<p>Ab etwa 25 sinkt die Kollagenproduktion um rund ein Prozent pro Jahr. Mit 50 fehlen etwa 25 Prozent Kollagen. Elastinfasern verlieren Spannkraft und werden nicht im gleichen Tempo ersetzt. Die Haut wird dünner, trockener, anfälliger.</p><p>Es geht nicht nur um Kollagen. Auch das endocannabinoide System der Haut altert. Die ECS-Rezeptoraktivität sinkt – Einfluss auf Entzündung, Zellerneuerung und Feuchtigkeit. Deshalb wirkt reife Haut oft trockener, empfindlicher und heilt langsamer.</p><p>Die Anti-Aging-Industrie verkauft Angst als Lösung. Reife Haut muss nicht gerettet werden – sie braucht Unterstützung. Tiefe Nahrung, Zellerneuerung, Entzündungskontrolle, Barriere-Schutz. Das zählt, wenn du aufhörst, jugendliche Ideale zu jagen und die Haut zu pflegen, die du hast.</p>",
      tipsTitle: "Kluge Pflege für reife Haut",
      tips: [
        { title: "Nahrung vor Anti-Aging-Marketing", body: "Hör auf, jeden Trend zu jagen. Setze auf Öle und Seren, die Barriere und Erneuerung stützen." },
        { title: "Von innen unterstützen", body: "Adaptogene Pilze und Kollagen-unterstützende Supplements wirken von innen. Die Haut spiegelt den ganzen Körper." },
        { title: "Großzügig mit Öl", body: "Reife Haut produziert weniger Talg und braucht mehr äußere Nahrung. CBD-Gesichtsöle ziehen gut ein und liefern fettlösliche Pflege." },
        { title: "Barriere schützen", body: "Meide starke Säuren, aggressive Reiniger, hochdosiertes Retinol. Die Barriere ist dünner – sie braucht Stützung, keinen Stress." }
      ],
      solutionTitle: "1753 SKINCARE für reife Haut",
      solutionBody: "<p>DUO TA-DA vereint das Beste: CBD-Gesichtsöl für tiefe Nahrung und TA-DA Serum mit CBG für Erneuerung und Barriere. Eine Duo, die reifer Haut gibt, was sie braucht – ohne Ballast.</p><p>CBD stützt das ECS, das mit dem Alter nachlässt; CBG spricht Rezeptoren an, mildert Entzündung und stärkt die Barriere. Ergänze mit Fungtastic mushroom extract von innen – adaptogene Pilze für ganzheitliches Gleichgewicht.</p><p>Wir glauben nicht an Anti-Aging als Konzept. Wir glauben an beste Bedingungen in jedem Lebensabschnitt. Reife Haut ist kein Problem – sie verdient beste Pflege.</p>",
      faq: [
        { q: "Ab wann gilt Haut als reif?", a: "Individuell verschieden; oft ab 45–50, wenn Kollagenverlust und Barriere-Veränderung spürbar werden. Manche früher, manche später." },
        { q: "Hilft CBD gegen Falten?", a: "CBD ersetzt kein verlorenes Kollagen, stützt aber das ECS mit Einfluss auf Erneuerung und Entzündung. Gesündere, ausgeglichenere Haut sieht in jedem Alter besser aus." },
        { q: "Braucht reife Haut mehr Produkte?", a: "Nicht unbedingt mehr, aber andere. Reichhaltiger – Öle statt leichter Lotionen, aktive Seren statt wässriger Toner." },
        { q: "Zählen Ernährung und Lifestyle?", a: "Absolut. Schlaf, antioxidative Ernährung, Stressmanagement und Bewegung wirken dokumentiert auf Hautalterung. Äußere Pflege plus innerer Lifestyle – beste Kombi." }
      ],
      ctaTitle: "Gib deiner Haut, was sie verdient",
      ctaSub: "Reife Haut braucht tiefe Nahrung und klugen Support. DUO TA-DA und Fungtastic schaffen die besten Bedingungen – nach deinen Regeln."
    },
    fr: {
      metaTitle: "Soin de la peau mature – nutrition profonde, pas de promesses creuses | 1753",
      metaDescription: "La peau mature veut nutrition et soutien, pas la panique anti-âge. CBD et CBG donnent ce qu'elle demande vraiment. 1753 SKINCARE.",
      kicker: "Soin de la peau mature",
      h1: "Soin de la peau mature – vieillir n'est pas une maladie à soigner",
      lead: "Ta peau a vécu. Elle a ri, pleuré, vu le soleil et le vent. Elle ne mérite pas des produits qui traitent l'âge comme un défaut – elle mérite ce dont elle a besoin maintenant.",
      problemTitle: "Ce qui se passe vraiment sur une peau mature",
      problemBody: "<p>Vers 25 ans, la production de collagène baisse d'environ un pour cent par an. À 50 ans, tu as perdu environ 25 % de ton collagène. Les fibres d'élastine perdent leur rebond et ne se renouvellent pas au même rythme. La peau s'amincit, se dessèche, devient plus fragile.</p><p>Ce n'est pas que le collagène. Le système endocannabinoïde de la peau change aussi avec l'âge. L'activité des récepteurs ECS diminue – impact sur inflammation, renouvellement et hydratation. D'où une peau souvent plus sèche, plus sensible, plus lente à guérir.</p><p>L'industrie anti-âge vend la peur en costume de solution. La peau mature n'a pas besoin d'être sauvée – elle a besoin de soutien. Nutrition profonde, aide au renouvellement, maîtrise de l'inflammation, barrière solide. C'est ça qui compte quand tu arrêtes de courir après une jeunesse idéalisée et que tu soignes la peau que tu as.</p>",
      tipsTitle: "Soins malins pour peau mature",
      tips: [
        { title: "Nutrition avant anti-âge", body: "Laisse tomber la chasse aux tendances. Mise sur huiles et sérums qui nourrissent la barrière et le renouvellement." },
        { title: "Soutien de l'intérieur", body: "Champignons adaptogènes et compléments qui soutiennent le collagène agissent de l'intérieur. La peau reflète tout le corps." },
        { title: "Généreuse avec l'huile", body: "La peau mature produit moins de sébum et veut plus de nutrition externe. Les huiles au CBD pénètrent bien et apportent ce qui est liposoluble." },
        { title: "Protège la barrière", body: "Évite ce qui la fragilise – acides forts, nettoyants agressifs, rétinol à forte dose. La barrière est plus fine : elle a besoin d'appui, pas de stress." }
      ],
      solutionTitle: "1753 SKINCARE pour peau mature",
      solutionBody: "<p>DUO TA-DA combine le meilleur : huile visage au CBD pour nutrition profonde et TA-DA Serum au CBG pour renouvellement et barrière. Un duo qui donne à la peau mature exactement ce qu'il faut – sans fioritures.</p><p>Le CBD soutient l'ECS qui décline avec l'âge ; le CBG parle aux récepteurs pour calmer l'inflammation et renforcer la barrière. Ajoute Fungtastic mushroom extract de l'intérieur – champignons adaptogènes pour l'équilibre global.</p><p>Nous ne croyons pas à l'anti-âge comme dogme. Nous croyons aux meilleures conditions à chaque étape. La peau mature n'est pas un problème – elle mérite les meilleurs soins.</p>",
      faq: [
        { q: "À partir de quel âge parle-t-on de peau mature ?", a: "Ça varie ; souvent vers 45–50 ans quand la perte de collagène et la barrière se font sentir. Certains plus tôt, d'autres plus tard." },
        { q: "Le CBD aide contre les rides ?", a: "Il ne remplace pas le collagène perdu, mais soutient l'ECS lié au renouvellement et à l'inflammation. Une peau plus saine et équilibrée paraît meilleure à tout âge." },
        { q: "Faut-il plus de produits ?", a: "Pas forcément plus, mais autrement. Peau mature aime les textures riches – huiles plutôt que lotions légères, sérums actifs plutôt que toniques aqueux." },
        { q: "Alimentation et mode de vie comptent ?", a: "Oui. Sommeil, alimentation riche en antioxydants, gestion du stress et mouvement ont un effet documenté sur le vieillissement cutané. Soins externes + hygiène de vie : le duo gagnant." }
      ],
      ctaTitle: "Offre à ta peau ce qu'elle mérite",
      ctaSub: "Peau mature = nutrition profonde et soutien intelligent. DUO TA-DA et Fungtastic créent les meilleures conditions – selon tes règles."
    }
  },
  {
    svSlug: "hudvard-kombinerad-hud",
    enSlug: "skincare-combination-skin",
    esSlug: "cuidado-de-la-piel-mixta",
    deSlug: "hautpflege-mischhaut",
    frSlug: "soin-de-la-peau-mixte",
    category: "audience",
    productIds: ["ta-da-serum", "duo-kit", "au-naturel-makeup-remover"],
    sv: {
      metaTitle: "Hudvård för kombinerad hud – balans utan kompromisser | 1753",
      metaDescription: "Kombinerad hud kan inte bestämma sig – fet T-zon, torra kinder. Lär dig balansera utan att välja sida. CBD-hudvård för blandhy. 1753 SKINCARE.",
      kicker: "Hudvård för kombinerad hud",
      h1: "Hudvård för kombinerad hud – sluta tvinga huden att välja sida",
      lead: "Fet i pannan, torr på kinderna, normal på hakan – kanske. Kombinerad hud är hudens sätt att säga att den behöver balans, inte kompromisser. Och de flesta produkter är designade för en hudtyp i taget.",
      problemTitle: "Varför kombinerad hud är svårare än den borde vara",
      problemBody: "<p>Kombinerad hud är faktiskt den vanligaste hudtypen, men paradoxalt nog den mest ignorerade av hudvårdsindustrin. De flesta produkter riktar sig till antingen torr eller fet hud, och ber dig välja. Men om du har kombinerad hud vet du att det inte fungerar så – det som fixar T-zonen torkar ut kinderna, och det som fuktar kinderna gör pannan till en oljereflektor.</p><p>Problemet ligger i att talgkörtlarna i T-zonen (panna, näsa, haka) är mer aktiva än de på kinderna och runt ögonen. Det skapar en hud med minst två olika behov samtidigt. Traditionell hudvård vill kategorisera dig i en ficka och ge dig en lösning, men din hud vägrar passa in.</p><p>Många med kombinerad hud hamnar i en ännu värre cykel: de använder starka produkter på de feta zonerna, vilket triggar ännu mer talgproduktion, och hoppar över fukt på de torra delarna, som blir ännu torrare. Nyckeln är inte att behandla olika zoner olika – det är att ge huden verktyg att balansera sig själv.</p>",
      tipsTitle: "Så balanserar du kombinerad hud",
      tips: [
        { title: "Sluta överbehandla T-zonen", body: "Aggressiva rengöringar på T-zonen triggar mer talgproduktion. Använd samma milda rengöring överallt och låt hudens eget system kalibrera sig." },
        { title: "Använd serum som bas", body: "Ett lätt serum som absorberas snabbt fungerar på hela ansiktet utan att göra feta zoner fetare eller torra zoner torrare. Det är den perfekta mellanvägen." },
        { title: "Lägg olja där det behövs", body: "Om T-zonen klarar sig med bara serum, applicera ansiktsolja enbart på kinderna och de torrare områdena. Det finns inget krav att behandla hela ansiktet identiskt." },
        { title: "Undvik tunga krämer", body: "Tjocka krämer täpper till porer i T-zonen och kan samtidigt vara för lite näring för kinderna. Lättare, oljebaserade produkter ger bättre kontroll." },
        { title: "Rengör varsamt", body: "En mild, balanserad rengöring morgon och kväll är bättre än starka produkter. Au Naturel löser smink och orenheter utan att rubba hudens naturliga balans." }
      ],
      solutionTitle: "CBD – naturlig balansakt för kombinerad hud",
      solutionBody: "<p>CBD är som gjord för kombinerad hud. Eftersom det arbetar med hudens endocannabinoidsystem hjälper det huden att hitta sin egen balans – oavsett om en zon producerar för mycket talg eller för lite. Det är inte magi, det är biologi: ECS reglerar talgproduktionen lokalt.</p><p>TA-DA Serum med CBG fungerar utmärkt som bas på hela ansiktet – det är lätt nog att inte förvärra T-zonen men aktivt nog att stödja cellförnyelse överallt. Komplettera med DUO-kitets CBD-olja på de torrare delarna för djupare näring där det behövs.</p><p>Det fina med cannabinoidbaserad hudvård för kombinerad hud är att du inte behöver två separata rutiner. Du behöver produkter som lyssnar på huden och anpassar sig. Det är precis vad CBD och CBG gör.</p>",
      faq: [
        { q: "Har jag verkligen kombinerad hud?", a: "Om din T-zon (panna, näsa, haka) tenderar att bli blank eller fet medan kinderna känns torra eller normala har du troligen kombinerad hud. Det är den vanligaste hudtypen – du är i gott sällskap." },
        { q: "Ska jag använda olika produkter på olika zoner?", a: "Inte nödvändigtvis. Med rätt produkter – som CBD-baserade som stödjer hudens egen balans – kan du använda samma bas överallt och eventuellt lägga på extra olja på torra områden." },
        { q: "Förvärras kombinerad hud av årstiderna?", a: "Ja, absolut. Vintern kan göra de torra zonerna torrare medan T-zonen förblir fet, och sommaren kan göra allt fetare. Var beredd att justera rutinen efter säsong." },
        { q: "Passar CBD-olja om jag har fet T-zon?", a: "Ja. CBD-olja signalerar till talgkörtlarna att balansera produktionen, inte att öka den. Många med fet hy upplever att CBD-olja faktiskt minskar fettet snarare än förvärrar det." }
      ],
      ctaTitle: "Ge din hud balans – inte kompromisser",
      ctaSub: "Kombinerad hud behöver produkter som lyssnar. TA-DA Serum och DUO-kit ger varje zon precis vad den behöver."
    },
    en: {
      metaTitle: "Skincare for combination skin – balance without compromise | 1753",
      metaDescription: "Combination skin can't make up its mind – oily T-zone, dry cheeks. Learn to balance without picking sides. CBD skincare for combination skin. 1753 SKINCARE.",
      kicker: "Skincare for combination skin",
      h1: "Skincare for combination skin – stop forcing your skin to pick a side",
      lead: "Oily on the forehead, dry on the cheeks, normal on the chin – maybe. Combination skin is your skin's way of saying it needs balance, not compromises. And most products are designed for one skin type at a time.",
      problemTitle: "Why combination skin is harder than it should be",
      problemBody: "<p>Combination skin is actually the most common skin type, yet paradoxically the most ignored by the skincare industry. Most products target either dry or oily skin and ask you to choose. But if you have combination skin, you know it doesn't work that way – what fixes the T-zone dries out the cheeks, and what moisturizes the cheeks turns the forehead into an oil slick.</p><p>The issue is that sebaceous glands in the T-zone (forehead, nose, chin) are more active than those on the cheeks and around the eyes. This creates skin with at least two different needs simultaneously. Traditional skincare wants to categorize you into a box and give you one solution, but your skin refuses to fit.</p><p>Many with combination skin end up in an even worse cycle: they use harsh products on the oily zones, which triggers even more sebum production, and skip moisture on the dry areas, which become even drier. The key isn't treating different zones differently – it's giving skin the tools to balance itself.</p>",
      tipsTitle: "How to balance combination skin",
      tips: [
        { title: "Stop over-treating the T-zone", body: "Aggressive cleansers on the T-zone trigger more oil production. Use the same gentle cleanser everywhere and let the skin's own system calibrate." },
        { title: "Use serum as a base", body: "A lightweight serum that absorbs quickly works across the entire face without making oily zones oilier or dry zones drier. It's the perfect middle ground." },
        { title: "Apply oil where needed", body: "If the T-zone does fine with just serum, apply face oil only on the cheeks and drier areas. There's no requirement to treat the entire face identically." },
        { title: "Avoid heavy creams", body: "Thick creams clog pores in the T-zone while simultaneously being too little nourishment for the cheeks. Lighter, oil-based products give better control." },
        { title: "Cleanse gently", body: "A mild, balanced cleanser morning and evening is better than harsh products. Au Naturel dissolves makeup and impurities without disrupting the skin's natural balance." }
      ],
      solutionTitle: "CBD – a natural balancing act for combination skin",
      solutionBody: "<p>CBD is practically made for combination skin. Because it works with the skin's endocannabinoid system, it helps skin find its own balance – whether a zone is producing too much oil or too little. It's not magic, it's biology: the ECS regulates sebum production locally.</p><p>TA-DA Serum with CBG works beautifully as a base across the entire face – light enough not to worsen the T-zone but active enough to support cell renewal everywhere. Complement with the DUO-kit's CBD oil on drier areas for deeper nourishment where needed.</p><p>The beauty of cannabinoid-based skincare for combination skin is that you don't need two separate routines. You need products that listen to the skin and adapt. That's exactly what CBD and CBG do.</p>",
      faq: [
        { q: "Do I really have combination skin?", a: "If your T-zone (forehead, nose, chin) tends to get shiny or oily while your cheeks feel dry or normal, you likely have combination skin. It's the most common skin type – you're in good company." },
        { q: "Should I use different products on different zones?", a: "Not necessarily. With the right products – like CBD-based ones that support the skin's own balance – you can use the same base everywhere and optionally add extra oil on dry areas." },
        { q: "Does combination skin get worse with the seasons?", a: "Yes, definitely. Winter can make dry zones drier while the T-zone stays oily, and summer can make everything oilier. Be prepared to adjust your routine by season." },
        { q: "Does CBD oil work if I have an oily T-zone?", a: "Yes. CBD oil signals sebaceous glands to balance production, not increase it. Many with oily skin find that CBD oil actually reduces oiliness rather than making it worse." }
      ],
      ctaTitle: "Give your skin balance – not compromises",
      ctaSub: "Combination skin needs products that listen. TA-DA Serum and DUO-kit give every zone exactly what it needs."
    },
    es: {
      metaTitle: "Cuidado de la piel mixta – equilibrio sin renuncias | 1753",
      metaDescription: "La piel mixta no decide – zona T grasa, mejillas secas. Aprende a equilibrar sin elegir bando. Skincare con CBD para piel mixta. 1753 SKINCARE.",
      kicker: "Cuidado de la piel mixta",
      h1: "Cuidado de la piel mixta – deja de obligar a tu piel a elegir un solo bando",
      lead: "Grasa en la frente, seca en las mejillas, normal en la barbilla – quizá. La piel mixta dice que quiere equilibrio, no renuncias. Y la mayoría de productos solo piensan en un tipo a la vez.",
      problemTitle: "Por qué la piel mixta es más difícil de lo que debería",
      problemBody: "<p>La piel mixta es el tipo más común y, a la vez, el más ignorado por la industria. Casi todo apunta a seca o grasa y te pide que elijas. Si eres mixta ya sabes que no va así: lo que arregla la T reseca las mejillas; lo que hidrata las mejillas deja la frente brillando.</p><p>Las glándulas de la T (frente, nariz, mentón) son más activas que en mejillas y contorno de ojos. Tienes al menos dos necesidades a la vez. El skincare clásico quiere meterte en una casilla; tu piel se niega.</p><p>Muchos caen en peor ciclo: productos duros en las zonas grasas = más sebo; saltarse hidratación en las secas = más sequedad. La clave no es tratar cada zona con un manual distinto – es dar a la piel herramientas para equilibrarse sola.</p>",
      tipsTitle: "Cómo equilibrar la piel mixta",
      tips: [
        { title: "No castigues la zona T", body: "Limpiadores agresivos ahí disparan más sebo. Misma limpieza suave en todo el rostro y deja que el sistema se calibre." },
        { title: "Usa serum como base", body: "Un serum ligero que absorbe rápido funciona en toda la cara sin engrasar la T ni resecar las mejillas. El punto medio perfecto." },
        { title: "Aceite solo donde haga falta", body: "Si la T va bien solo con serum, aplica aceite facial solo en mejillas y zonas secas. No hace falta tratar todo igual." },
        { title: "Evita cremas pesadas", body: "Las texturas densas tapan poros en la T y a veces ni alimentan bien las mejillas. Productos más ligeros a base de aceite dan mejor control." },
        { title: "Limpia con suavidad", body: "Limpieza equilibrada mañana y noche gana a lo agresivo. Au Naturel disuelve maquillaje y suciedad sin romper el equilibrio natural." }
      ],
      solutionTitle: "CBD – equilibrio natural para piel mixta",
      solutionBody: "<p>El CBD encaja con piel mixta. Actúa con el sistema endocannabinoide y ayuda a que cada zona encuentre su punto – haya mucho o poco sebo. No es magia: el ECS regula el sebo de forma local.</p><p>TA-DA Serum con CBG es base ideal en todo el rostro: lo bastante ligero para no cargar la T y lo bastante activo para la renovación en todas partes. Añade el aceite CBD del DUO-kit donde necesites más nutrición.</p><p>Lo bueno del enfoque con cannabinoides: no hacen falta dos rutinas paralelas. Productos que escuchan y se adaptan – eso hacen CBD y CBG.</p>",
      faq: [
        { q: "¿De verdad tengo piel mixta?", a: "Si tu T (frente, nariz, mentón) se pone brillante u oleosa y las mejillas están secas o normales, probablemente sí. Es el tipo más habitual – buena compañía." },
        { q: "¿Productos distintos por zona?", a: "No siempre. Con fórmulas que apoyan el equilibrio propio – como las basadas en CBD – puedes usar la misma base y solo reforzar aceite en zonas secas." },
        { q: "¿Empeora con las estaciones?", a: "Sí. En invierno las zonas secas sufren más y la T sigue grasa; en verano todo puede engrasarse más. Ajusta la rutina según la estación." },
        { q: "¿Aceite con CBD si la T es grasa?", a: "Sí. Señaliza a las glándulas para equilibrar, no para producir a lo loco. Mucha piel grasa nota menos brillo con aceite CBD, no más." }
      ],
      ctaTitle: "Equilibrio para tu piel – no renuncias forzadas",
      ctaSub: "La piel mixta pide productos que escuchen. TA-DA Serum y DUO-kit dan a cada zona lo que necesita."
    },
    de: {
      metaTitle: "Hautpflege für Mischhaut – Balance ohne Kompromisse | 1753",
      metaDescription: "Mischhaut kann sich nicht entscheiden – fettige T-Zone, trockene Wangen. Lerne auszubalancieren, ohne eine Seite zu wählen. CBD-Pflege für Mischhaut. 1753 SKINCARE.",
      kicker: "Hautpflege für Mischhaut",
      h1: "Hautpflege für Mischhaut – hör auf, deine Haut zu zwingen, eine Seite zu wählen",
      lead: "Fettig an der Stirn, trocken auf den Wangen, normal am Kinn – vielleicht. Mischhaut sagt: Balance, keine Kompromisse. Die meisten Produkte denken aber nur an einen Hauttyp.",
      problemTitle: "Warum Mischhaut härter ist, als sie sein müsste",
      problemBody: "<p>Mischhaut ist der häufigste Hauttyp – und paradoxerweise oft ignoriert. Produkte zielen auf trocken oder fettig und wollen eine Wahl. Hast du Mischhaut, weißt du: Was die T-Zone fixiert, trocknet die Wangen aus; was die Wangen feuchtet, macht die Stirn glänzend.</p><p>Die Talgdrüsen in der T-Zone (Stirn, Nase, Kinn) sind aktiver als an Wangen und Augenpartie. Mindestens zwei Bedürfnisse gleichzeitig. Klassische Pflege steckt dich in eine Schublade – deine Haut passt nicht rein.</p><p>Viele landen im schlimmeren Teufelskreis: harte Produkte auf fettige Zonen = mehr Talg; Feuchtigkeit auf trockene Zonen auslassen = noch trockener. Der Trick ist nicht, jede Zone anders zu quälen – sondern der Haut Werkzeuge zu geben, sich selbst auszubalancieren.</p>",
      tipsTitle: "Mischhaut ins Gleichgewicht bringen",
      tips: [
        { title: "T-Zone nicht überbehandeln", body: "Aggressive Reiniger dort treiben mehr Öl an. Überall dieselbe milde Reinigung – das System kalibriert sich." },
        { title: "Serum als Basis", body: "Ein leichtes, schnell einziehendes Serum funktioniert im ganzen Gesicht – ohne fettigere T-Zone oder trockenere Wangen. Die goldene Mitte." },
        { title: "Öl nur wo nötig", body: "Reicht der T-Zone Serum allein, Gesichtsöl nur auf Wangen und trockene Stellen. Nichts zwingt dich, alles identisch zu behandeln." },
        { title: "Schwere Cremes meiden", body: "Dicke Cremes verstopfen Poren in der T-Zone und reichen oft nicht für die Wangen. Leichtere, ölbasierte Produkte geben bessere Kontrolle." },
        { title: "Sanft reinigen", body: "Milde, ausgewogene Reinigung morgens und abends schlägt Aggression. Au Naturel löst Make-up und Schmutz ohne das natürliche Gleichgewicht zu stören." }
      ],
      solutionTitle: "CBD – natürliche Balance für Mischhaut",
      solutionBody: "<p>CBD ist praktisch für Mischhaut gemacht. Es arbeitet mit dem ECS und hilft der Haut, ihr Gleichgewicht zu finden – egal ob zu viel oder zu wenig Talg. Keine Magie, Biologie: Das ECS reguliert Talg lokal.</p><p>TA-DA Serum mit CBG ist ideale Basis fürs ganze Gesicht – leicht genug für die T-Zone, aktiv genug für Erneuerung überall. Ergänze mit dem CBD-Öl aus dem DUO-kit auf trockeneren Stellen.</p><p>Der Vorteil cannabinoidbasierter Pflege: keine doppelte Routine nötig. Produkte, die zuhören und sich anpassen – genau das leisten CBD und CBG.</p>",
      faq: [
        { q: "Habe ich wirklich Mischhaut?", a: "Wenn deine T-Zone glänzt oder fettig wirkt und die Wangen trocken oder normal sind, sehr wahrscheinlich. Häufigster Hauttyp – du bist nicht allein." },
        { q: "Unterschiedliche Produkte pro Zone?", a: "Nicht zwingend. Mit Produkten, die das eigene Gleichgewicht stützen – wie CBD-basierten – kannst du überall dieselbe Basis nutzen und bei Bedarf Öl nachlegen." },
        { q: "Wird Mischhaut jahreszeitabhängig schlimmer?", a: "Ja. Im Winter trocknen trockene Zonen aus, die T-Zone bleibt fettig; im Sommer kann alles öliger werden. Passe die Routine der Jahreszeit an." },
        { q: "CBD-Öl bei fettiger T-Zone?", a: "Ja. Es signalisiert den Talgdrüsen Balance, nicht Überproduktion. Viele mit fettiger Haut merken weniger Glanz mit CBD-Öl, nicht mehr." }
      ],
      ctaTitle: "Balance statt Kompromiss",
      ctaSub: "Mischhaut braucht Produkte, die zuhören. TA-DA Serum und DUO-kit liefern jeder Zone genau das Richtige."
    },
    fr: {
      metaTitle: "Soin de la peau mixte – équilibre sans compromis | 1753",
      metaDescription: "La peau mixte hésite – zone T grasse, joues sèches. Apprends à équilibrer sans trancher. Soins CBD pour peau mixte. 1753 SKINCARE.",
      kicker: "Soin de la peau mixte",
      h1: "Soin de la peau mixte – arrête d'obliger ta peau à choisir un camp",
      lead: "Gras au front, sec sur les joues, normal au menton – peut-être. La peau mixte dit qu'elle veut de l'équilibre, pas des compromis à la va-vite. Et la plupart des produits ne visent qu'un type à la fois.",
      problemTitle: "Pourquoi la peau mixte est plus dure qu'elle ne devrait",
      problemBody: "<p>La peau mixte est le type le plus courant – et paradoxalement souvent ignorée. Les produits ciblent sec ou gras et te demandent de choisir. Avec une peau mixte, tu sais que ça ne marche pas : ce qui règle la T assèche les joues ; ce qui hydrate les joues transforme le front en miroir.</p><p>Les glandes de la T (front, nez, menton) sont plus actives que sur les joues et le contour des yeux. Au moins deux besoins en même temps. Le soin classique veut te mettre dans une case – ta peau refuse.</p><p>Beaucoup tombent dans un pire cercle : produits agressifs sur les zones grasses = plus de sébum ; zéro hydratation sur les zones sèches = encore plus sec. La clé n'est pas de traiter chaque zone avec une doctrine différente – c'est de donner à la peau les outils pour s'équilibrer elle-même.</p>",
      tipsTitle: "Comment équilibrer une peau mixte",
      tips: [
        { title: "Arrête de sur-traiter la T", body: "Nettoyants agressifs là-bas déclenchent plus de sébum. Même nettoyant doux partout et laisse le système se calibrer." },
        { title: "Le sérum comme base", body: "Un sérum léger qui pénètre vite marche sur tout le visage sans graisser la T ni dessécher les joues. Le juste milieu." },
        { title: "Huile seulement où il faut", body: "Si la T tient avec le sérum seul, applique l'huile visage sur joues et zones sèches. Pas d'obligation d'uniformiser le protocole." },
        { title: "Évite les crèmes épaisses", body: "Les textures lourdes bouchent les pores de la T et manquent souvent de nutrition pour les joues. Des formules plus légères à base d'huile offrent un meilleur contrôle." },
        { title: "Nettoie en douceur", body: "Nettoyage doux matin et soir bat l'agressivité. Au Naturel dissout maquillage et impuretés sans casser l'équilibre naturel." }
      ],
      solutionTitle: "CBD – équilibre naturel pour peau mixte",
      solutionBody: "<p>Le CBD est fait pour la peau mixte. Il travaille avec l'ECS et aide la peau à trouver son équilibre – trop ou pas assez de sébum. Pas de magie, de la biologie : l'ECS régule le sébum localement.</p><p>TA-DA Serum au CBG est une base idéale sur tout le visage – assez léger pour la T, assez actif pour le renouvellement partout. Complète avec l'huile CBD du DUO-kit sur les zones plus sèches.</p><p>Le beau avec les soins aux cannabinoïdes : pas besoin de deux routines. Des produits qui écoutent et s'adaptent – c'est CBD et CBG.</p>",
      faq: [
        { q: "J'ai vraiment la peau mixte ?", a: "Si ta T (front, nez, menton) brille ou graisse et tes joues sont sèches ou normales, très probablement. Type le plus fréquent – tu es loin d'être seule." },
        { q: "Des produits différents par zone ?", a: "Pas forcément. Avec des formules qui soutiennent l'équilibre naturel – comme au CBD – tu peux utiliser la même base et ajouter de l'huile sur les zones sèches." },
        { q: "Ça empire avec les saisons ?", a: "Oui. L'hiver assèche plus les zones sèches pendant que la T reste grasse ; l'été peut tout rendre plus gras. Ajuste selon la saison." },
        { q: "Huile CBD avec une T grasse ?", a: "Oui. Elle signale aux glandes de équiliser, pas de surproduire. Beaucoup de peaux grasses voient moins de brillance avec une huile CBD, pas plus." }
      ],
      ctaTitle: "De l'équilibre, pas des compromis forcés",
      ctaSub: "La peau mixte veut des produits qui écoutent. TA-DA Serum et DUO-kit donnent à chaque zone ce qu'il lui faut."
    }
  },
  {
    svSlug: "hudvard-30-plus",
    enSlug: "skincare-30s",
    esSlug: "cuidado-de-la-piel-a-los-30",
    deSlug: "hautpflege-mit-30",
    frSlug: "soin-de-la-peau-trentenaires",
    category: "audience",
    productIds: ["duo-kit", "ta-da-serum"],
    sv: {
      metaTitle: "Hudvård i 30-årsåldern – smarta val för framtidens hud | 1753",
      metaDescription: "30-årsåldern är när du bygger grunden för hur din hud kommer se ut resten av livet. CBD-hudvård som investerar i framtiden. 1753 SKINCARE.",
      kicker: "Hudvård i 30-årsåldern",
      h1: "Hudvård i 30-årsåldern – det bästa du kan göra nu är att börja",
      lead: "I 20-årsåldern förlåter huden allt. I 30-årsåldern börjar den skicka räkningen. Det här är årtionde då prevention fortfarande fungerar och varje klok investering i huden betalar sig dubbelt.",
      problemTitle: "Vad som förändras i 30-årsåldern",
      problemBody: "<p>Trettioårsåldern är ett vattendelare-årtionde för huden. Kollagenproduktionen har redan börjat minska – med ungefär en procent per år sedan 25. Cellförnyelsen saktar ner, vilket gör att huden inte regenererar lika snabbt som förr. De första fina linjerna kring ögonen och pannan börjar visa sig, och huden kan plötsligt reagera annorlunda på produkter den tolererade i 20-årsåldern.</p><p>Många upptäcker också att livsstilen börjar synas i ansiktet. Sömnbrist, stress, ofullständig kost och år av ojämnt solskydd lämnar spår som inte längre försvinner av sig själva. Mörka ringar, ojämn hudton och en viss matthet kan smyga sig på.</p><p>Samtidigt är detta det bästa årtionde att börja en seriös hudvårdsrutin. Huden har fortfarande god kapacitet att svara på aktiva ingredienser och de insatser du gör nu har störst effekt på lång sikt. Väntar du till 40 fungerar det fortfarande, men du har förlorat ett årtionde av förebyggande effekt. Det handlar inte om att jaga ungdom – det handlar om att ge huden de bästa förutsättningarna framåt.</p>",
      tipsTitle: "Bygg din rutin i 30-årsåldern",
      tips: [
        { title: "Investera i prevention", body: "Prevention är alltid effektivare än reparation. En konsekvent rutin med solskydd, antioxidanter och aktiva ingredienser nu sparar dig problem i framtiden." },
        { title: "Lägg till aktiva ingredienser", body: "Om du bara använt rengöring och fukt är det dags att lägga till aktiva ingredienser. Ett CBG-serum stödjer cellförnyelse och ger huden det extra stöd den börjar behöva." },
        { title: "Prioritera sömn", body: "Huden reparerar sig nattetid. Kronisk sömnbrist i 30-årsåldern accelererar hudens åldrande mer än de flesta inser. Sikta på sju till åtta timmar." },
        { title: "Ögonområdet förtjänar uppmärksamhet", body: "Huden runt ögonen är tunnast och visar ålder först. Var försiktig med området och använd produkter varsamt – dragging och gnidarörelse skadar den tunna huden." },
        { title: "Konsistens över intensitet", body: "En enkel rutin du gör varje dag slår en avancerad rutin du gör ibland. Bygg en vana som är hållbar – det är den enskilt viktigaste faktorn." }
      ],
      solutionTitle: "DUO-kit – den perfekta starten på ett nytt årtionde",
      solutionBody: "<p>DUO-kit ger dig en komplett CBD-rutin i två steg: ansiktsolja och CBG-serum. Det är designat för att vara enkelt nog att göra varje dag men aktivt nog att ge verklig effekt – precis vad 30-årsåldern kräver.</p><p>CBD stödjer hudens endocannabinoidsystem och hjälper till att balansera de förändringar som börjar ske. CBG i TA-DA Serum arbetar med cellförnyelse och inflammation på ett sätt som ger huden bättre förutsättningar att möta det kommande årtiondet.</p><p>Det här är inte anti-aging, det är pro-skin. Det är att ge huden de bästa verktygen vid den tidpunkt då de gör störst skillnad. En investering i minuter per dag som betalar sig i årtionden framåt.</p>",
      faq: [
        { q: "Är 30 för tidigt för anti-aging?", a: "Vi gillar inte ordet anti-aging, men nej – 30 är den perfekta tidpunkten att börja med aktiva ingredienser. Kollagenproduktionen minskar redan och prevention är alltid effektivare än reparation." },
        { q: "Vilken produkt ska jag börja med i 30-årsåldern?", a: "Börja med DUO-kit som ger dig både CBD-olja och CBG-serum. Det täcker de viktigaste behoven: djup näring, stöd till cellförnyelse och inflammationskontroll." },
        { q: "Märker jag skillnad snabbt?", a: "De flesta märker förbättrad hudkvalitet inom två till fyra veckor – jämnare ton, mer lyster, bättre fuktbalans. De långsiktiga preventiva effekterna syns dock först efter månader och år." },
        { q: "Behöver jag ändra hela min rutin?", a: "Nej. Börja med att lägga till – inte ersätta. Om du redan har en rengöring du gillar, komplettera med TA-DA Serum och ansiktsolja. Bygg gradvis." }
      ],
      ctaTitle: "Börja nu – din framtida hud kommer tacka dig",
      ctaSub: "30-årsåldern är det bästa årtionde att investera i huden. DUO-kit ger dig allt du behöver för att börja."
    },
    en: {
      metaTitle: "Skincare in your 30s – smart choices for future skin | 1753",
      metaDescription: "Your 30s are when you build the foundation for how your skin will look for the rest of your life. CBD skincare that invests in the future. 1753 SKINCARE.",
      kicker: "Skincare in your 30s",
      h1: "Skincare in your 30s – the best thing you can do now is start",
      lead: "In your 20s, skin forgives everything. In your 30s, it starts sending the bill. This is the decade when prevention still works and every smart investment in your skin pays double.",
      problemTitle: "What changes in your 30s",
      problemBody: "<p>Your thirties are a watershed decade for skin. Collagen production has already started declining – by about one percent per year since age 25. Cell turnover slows down, meaning skin doesn't regenerate as quickly as before. The first fine lines around the eyes and forehead start appearing, and skin may suddenly react differently to products it tolerated in your twenties.</p><p>Many also discover that lifestyle starts showing on the face. Sleep deprivation, stress, incomplete nutrition, and years of inconsistent sun protection leave traces that no longer disappear on their own. Dark circles, uneven skin tone, and a certain dullness can creep in.</p><p>At the same time, this is the best decade to start a serious skincare routine. Skin still has great capacity to respond to active ingredients, and the efforts you make now have the greatest long-term impact. If you wait until 40, it still works, but you've lost a decade of preventive benefit. It's not about chasing youth – it's about giving your skin the best conditions going forward.</p>",
      tipsTitle: "Build your routine in your 30s",
      tips: [
        { title: "Invest in prevention", body: "Prevention is always more effective than repair. A consistent routine with sunscreen, antioxidants, and active ingredients now saves you problems down the road." },
        { title: "Add active ingredients", body: "If you've only been using cleanser and moisturizer, it's time to add active ingredients. A CBG serum supports cell renewal and gives skin the extra support it's starting to need." },
        { title: "Prioritize sleep", body: "Skin repairs itself at night. Chronic sleep deprivation in your 30s accelerates skin aging more than most people realize. Aim for seven to eight hours." },
        { title: "The eye area deserves attention", body: "Skin around the eyes is thinnest and shows age first. Be gentle with the area and use products carefully – dragging and rubbing damages the delicate skin." },
        { title: "Consistency over intensity", body: "A simple routine you do every day beats an advanced routine you do sometimes. Build a habit that's sustainable – that's the single most important factor." }
      ],
      solutionTitle: "DUO-kit – the perfect start to a new decade",
      solutionBody: "<p>The DUO-kit gives you a complete CBD routine in two steps: face oil and CBG serum. It's designed to be simple enough to do every day but active enough to deliver real results – exactly what your 30s demand.</p><p>CBD supports the skin's endocannabinoid system and helps balance the changes that start happening. CBG in TA-DA Serum works with cell renewal and inflammation in ways that give skin better prospects for the coming decade.</p><p>This isn't anti-aging, it's pro-skin. It's giving your skin the best tools at the time when they make the biggest difference. An investment of minutes per day that pays off for decades ahead.</p>",
      faq: [
        { q: "Is 30 too early for anti-aging?", a: "We don't like the word anti-aging, but no – 30 is the perfect time to start with active ingredients. Collagen production is already declining and prevention is always more effective than repair." },
        { q: "Which product should I start with in my 30s?", a: "Start with the DUO-kit, which gives you both CBD oil and CBG serum. It covers the most important needs: deep nourishment, cell renewal support, and inflammation control." },
        { q: "Will I notice a difference quickly?", a: "Most people notice improved skin quality within two to four weeks – more even tone, better glow, improved moisture balance. The long-term preventive effects, however, show after months and years." },
        { q: "Do I need to change my entire routine?", a: "No. Start by adding – not replacing. If you already have a cleanser you like, complement with TA-DA Serum and face oil. Build gradually." }
      ],
      ctaTitle: "Start now – your future skin will thank you",
      ctaSub: "Your 30s are the best decade to invest in your skin. The DUO-kit gives you everything you need to begin."
    },
    es: {
      metaTitle: "Cuidado de la piel a los 30 – decisiones listas para el futuro | 1753",
      metaDescription: "Los 30 son cuando construyes la base de cómo se verá tu piel después. Skincare con CBD que invierte en el mañana. 1753 SKINCARE.",
      kicker: "Cuidado de la piel a los 30",
      h1: "Cuidado de la piel a los 30 – lo mejor que puedes hacer es empezar ya",
      lead: "A los 20 la piel perdona casi todo. A los 30 empieza a pasar factura. Es la década en la que la prevención aún paga el doble y cada decisión acertada se nota después.",
      problemTitle: "Qué cambia en los 30",
      problemBody: "<p>Los treinta son un punto de inflexión. El colágeno ya baja – unos uno por ciento al año desde los 25. La renovación celular se frena; la piel no se repone tan rápido. Aparecen las primeras líneas finas y de repente productos que antes iban bien empiezan a chocar.</p><p>También se nota el estilo de vida: mal dormir, estrés, dieta irregular y años de SPF irregular dejan huella que ya no se borra sola. Ojeras, tono desigual, falta de luz.</p><p>A la vez, es la mejor década para una rutina seria. La piel aún responde muy bien a activos; lo que hagas ahora marca el largo plazo. Si esperas a los 40 sigue valiendo, pero pierdes diez años de prevención. No se trata de parecer joven – se trata de dar a tu piel las mejores condiciones de aquí en adelante.</p>",
      tipsTitle: "Arma tu rutina en los 30",
      tips: [
        { title: "Invierte en prevención", body: "Prevenir siempre gana a reparar. Rutina estable con SPF, antioxidantes y activos ahora te ahorra líos después." },
        { title: "Suma activos de verdad", body: "Si solo limpiabas e hidatabas, toca subir nivel. Un serum con CBG apoya renovación y da el extra que la piel empieza a pedir." },
        { title: "Prioriza el sueño", body: "La piel repara de noche. Dormir mal en los 30 acelera el envejecimiento cutáneo más de lo que cree la gente. Apunta a siete u ocho horas." },
        { title: "El contorno de ojos cuenta", body: "Ahí la piel es más fina y envejece antes. Sin arrastrar ni frotar – eso daña la delicadeza de la zona." },
        { title: "Constancia antes que intensidad", body: "Una rutina simple diaria vence a la mega-rutina esporádica. El hábito sostenible es el factor clave." }
      ],
      solutionTitle: "DUO-kit – arranque perfecto para una nueva década",
      solutionBody: "<p>El DUO-kit te da rutina CBD completa en dos pasos: aceite facial y TA-DA Serum con CBG. Pensado para ser fácil cada día y lo bastante activo para notar – justo lo que los 30 exigen.</p><p>El CBD apoya el ECS y ayuda con los primeros cambios. El CBG en TA-DA Serum trabaja renovación e inflamación para que la piel entre mejor en la siguiente década.</p><p>Esto no es anti-edad – es pro-piel. Son herramientas en el momento en que más pesan. Minutos al día que se pagan en años.</p>",
      faq: [
        { q: "¿Es pronto a los 30 para hablar de anti-edad?", a: "No nos gusta la etiqueta anti-edad, pero no – los 30 son un gran momento para activos. El colágeno ya baja y prevenir siempre rinde más que remendar." },
        { q: "¿Con qué producto empiezo?", a: "Con el DUO-kit: aceite CBD + TA-DA Serum con CBG. Cubre nutrición profunda, renovación y control de inflamación." },
        { q: "¿Veré cambios pronto?", a: "Muchos notan mejor tono, brillo y hidratación en dos a cuatro semanas. Los efectos preventivos a largo plazo se ven en meses y años." },
        { q: "¿Tengo que cambiar toda la rutina?", a: "No. Suma sin reemplazar todo. Si tu limpiador te gusta, añade TA-DA Serum y aceite. Construye poco a poco." }
      ],
      ctaTitle: "Empieza ya – tu piel del futuro lo agradecerá",
      ctaSub: "Los 30 son la década top para invertir en piel. El DUO-kit tiene lo esencial para comenzar."
    },
    de: {
      metaTitle: "Hautpflege in den 30ern – kluge Entscheidungen für später | 1753",
      metaDescription: "In den 30ern legst du die Basis, wie deine Haut später aussieht. CBD-Hautpflege, die in die Zukunft investiert. 1753 SKINCARE.",
      kicker: "Hautpflege in den 30ern",
      h1: "Hautpflege in den 30ern – das Beste, was du jetzt tun kannst, ist anzufangen",
      lead: "In den 20ern verzeiht die Haut fast alles. In den 30ern kommt die Rechnung. Das ist das Jahrzehnt, in dem Prävention noch doppelt zahlt und jede kluge Investition sich auszahlt.",
      problemTitle: "Was sich in den 30ern verändert",
      problemBody: "<p>Die dreißiger Jahre sind ein Wendepunkt für die Haut. Kollagen sinkt schon – etwa ein Prozent pro Jahr seit 25. Die Zellerneuerung wird langsamer, die Haut regeneriert nicht mehr so flott. Erste feine Linien erscheinen, und plötzlich verträgt die Haut Produkte nicht mehr wie früher.</p><p>Auch der Lifestyle zeigt sich: Schlafmangel, Stress, unregelmäßige Ernährung, jahrelang inkonsistenter Sonnenschutz hinterlassen Spuren, die nicht mehr von selbst verschwinden. Augenschatten, ungleicher Teint, Mattigkeit.</p><p>Gleichzeitig ist es das beste Jahrzehnt für eine ernsthafte Routine. Die Haut reagiert noch stark auf Wirkstoffe; was du jetzt tust, wirkt am langfristigsten. Wartest du bis 40, geht es auch – aber ein Jahrzehnt Prävention ist weg. Es geht nicht um ewige Jugend – sondern um beste Bedingungen nach vorn.</p>",
      tipsTitle: "Baue deine Routine in den 30ern",
      tips: [
        { title: "In Prävention investieren", body: "Vorbeugen schlägt reparieren. Konstante Routine mit Lichtschutz, Antioxidantien und Wirkstoffen spart später Ärger." },
        { title: "Wirkstoffe ergänzen", body: "Warst du bei Reiniger plus Feuchtigkeit stehen geblieben, ist es Zeit für Aktive. CBG-Serum unterstützt Erneuerung und gibt den Extra-Support, den die Haut jetzt braucht." },
        { title: "Schlaf priorisieren", body: "Die Haut repariert nachts. Chronischer Schlafmangel in den 30ern altert die Haut stärker, als viele denken. Sieben bis acht Stunden anpeilen." },
        { title: "Augenpartie ernst nehmen", body: "Dort ist die Haut am dünnsten und altert zuerst. Sanft arbeiten – Reiben schadet." },
        { title: "Konstanz vor Intensität", body: "Eine einfache tägliche Routine schlägt eine fortgeschrittene, die du nur manchmal machst. Nachhaltige Gewohnheit ist der wichtigste Faktor." }
      ],
      solutionTitle: "DUO-kit – perfekter Start in ein neues Jahrzehnt",
      solutionBody: "<p>Das DUO-kit liefert eine komplette CBD-Routine in zwei Schritten: Gesichtsöl und TA-DA Serum mit CBG. Einfach genug für jeden Tag, aktiv genug für echte Wirkung – genau das, was die 30er verlangen.</p><p>CBD stützt das ECS und hilft, beginnende Veränderungen auszugleichen. CBG im TA-DA Serum arbeitet an Erneuerung und Entzündung – bessere Aussichten fürs nächste Jahrzehnt.</p><p>Das ist kein Anti-Aging-Marketing, sondern pro-Haut. Die besten Tools genau dann, wenn sie den größten Hebel haben. Minuten täglich, die sich über Jahre auszahlen.</p>",
      faq: [
        { q: "Sind die 30 zu früh für Anti-Aging?", a: "Wir mögen das Wort nicht, aber nein – 30 ist ideal für Wirkstoffe. Kollagen sinkt schon, und Prävention schlägt Reparatur." },
        { q: "Mit welchem Produkt starten?", a: "Mit dem DUO-kit: CBD-Öl plus TA-DA Serum mit CBG. Deckt tiefe Nahrung, Erneuerungs-Support und Entzündungskontrolle ab." },
        { q: "Schnell sichtbare Veränderung?", a: "Viele sehen in zwei bis vier Wochen besseren Teint, mehr Glow, bessere Feuchtigkeit. Langfristige Prävention zeigt sich über Monate und Jahre." },
        { q: "Ganze Routine umbauen?", a: "Nein. Ergänzen statt alles ersetzen. Magst du deinen Reiniger, nimm TA-DA Serum und Öl dazu. Schritt für Schritt aufbauen." }
      ],
      ctaTitle: "Fang jetzt an – deine zukünftige Haut dankt dir",
      ctaSub: "Die 30er sind das beste Jahrzehnt, in die Haut zu investieren. Das DUO-kit hat alles Nötige zum Start."
    },
    fr: {
      metaTitle: "Soin de la peau à la trentaine – choix malins pour demain | 1753",
      metaDescription: "La trentaine, c'est quand tu poses les bases de ta peau pour la suite. Soins CBD qui investissent dans l'avenir. 1753 SKINCARE.",
      kicker: "Soin de la peau à la trentaine",
      h1: "Soin de la peau à la trentaine – le meilleur move, c'est de commencer",
      lead: "À la vingtaine, la peau pardonne presque tout. À la trentaine, elle envoie la facture. C'est la décennie où la prévention paie encore double et où chaque bon choix se voit après.",
      problemTitle: "Ce qui change à la trentaine",
      problemBody: "<p>La trentaine est un tournant pour la peau. Le collagène baisse déjà – environ un pour cent par an depuis 25 ans. Le renouvellement ralentit ; la peau ne se refait plus aussi vite. Les premières ridules apparaissent, et des produits tolérés avant peuvent soudain poser problème.</p><p>Le mode de vie aussi se lit sur le visage : manque de sommeil, stress, alimentation irrégulière, années de protection solaire irrégulière laissent des traces qui ne partent plus toutes seules. Cernes, teint irrégulier, manque d'éclat.</p><p>En même temps, c'est la meilleure décennie pour une routine sérieuse. La peau réagit encore très bien aux actifs ; ce que tu fais maintenant a le plus gros impact long terme. Attendre la quarantaine marche encore, mais tu perds dix ans de prévention. Ce n'est pas courir après la jeunesse – c'est donner à ta peau les meilleures conditions pour la suite.</p>",
      tipsTitle: "Construire ta routine à la trentaine",
      tips: [
        { title: "Mise sur la prévention", body: "Prévenir bat toujours réparer. Routine régulière avec SPF, antioxydants et actifs maintenant t'évite des soucis plus tard." },
        { title: "Ajoute des actifs sérieux", body: "Si tu en étais resté à nettoyant + crème, monte d'un cran. Un sérum au CBG soutient le renouvellement et apporte le plus que la peau commence à demander." },
        { title: "Priorise le sommeil", body: "La peau se répare la nuit. Le manque de sommeil chronique à la trentaine vieillit la peau plus qu'on ne croit. Vise sept à huit heures." },
        { title: "Le contour des yeux compte", body: "La peau y est la plus fine et vieillit en premier. Pas de frottements agressifs – ça abîme." },
        { title: "Régularité avant intensité", body: "Une routine simple quotidienne bat une routine avancée faite par à-coups. L'habitude durable est le facteur numéro un." }
      ],
      solutionTitle: "DUO-kit – le bon départ pour une nouvelle décennie",
      solutionBody: "<p>Le DUO-kit offre une routine CBD complète en deux étapes : huile visage et TA-DA Serum au CBG. Assez simple pour chaque jour, assez active pour un vrai effet – exactement ce que la trentaine demande.</p><p>Le CBD soutient l'ECS et aide face aux premiers changements. Le CBG dans TA-DA Serum travaille renouvellement et inflammation pour que la peau affronte la décennie suivante en meilleure forme.</p><p>Ce n'est pas de l'anti-âge – c'est du pro-peau. Les bons outils au moment où ils comptent le plus. Quelques minutes par jour qui se paient sur des années.</p>",
      faq: [
        { q: "À 30 ans, c'est tôt pour l'anti-âge ?", a: "On n'aime pas le mot, mais non – la trentaine est idéale pour les actifs. Le collagène baisse déjà et la prévention bat la réparation." },
        { q: "Par quel produit commencer ?", a: "Le DUO-kit : huile CBD + TA-DA Serum au CBG. Ça couvre nutrition profonde, soutien au renouvellement et maîtrise de l'inflammation." },
        { q: "Des résultats vite ?", a: "Beaucoup voient un meilleur teint, plus d'éclat et une meilleure hydratation en deux à quatre semaines. Les effets préventifs long terme se voient sur des mois et des années." },
        { q: "Je dois tout changer ?", a: "Non. Ajoute plutôt que tout remplacer. Si ton nettoyant te va, ajoute TA-DA Serum et l'huile. Monte en puissance progressivement." }
      ],
      ctaTitle: "Commence maintenant – ta peau future dira merci",
      ctaSub: "La trentaine est la meilleure décennie pour investir dans ta peau. Le DUO-kit a l'essentiel pour débuter."
    }
  },
  {
    svSlug: "hudvard-40-plus",
    enSlug: "skincare-40s",
    esSlug: "cuidado-de-la-piel-a-los-40",
    deSlug: "hautpflege-mit-40",
    frSlug: "soin-de-la-peau-quadragenaires",
    category: "audience",
    productIds: ["duo-ta-da", "ta-da-serum", "fungtastic-mushroom-extract"],
    sv: {
      metaTitle: "Hudvård i 40-årsåldern – tid att uppgradera din rutin | 1753",
      metaDescription: "I 40-årsåldern behöver huden mer stöd och smartare ingredienser. CBD och CBG ger den uppgradering din rutin förtjänar. 1753 SKINCARE.",
      kicker: "Hudvård i 40-årsåldern",
      h1: "Hudvård i 40-årsåldern – din hud behöver en uppgradering, inte en revolution",
      lead: "Fyrtioårsåldern är när huden börjar berätta sanningar. Kollagenet minskar snabbare, hormonella förändringar påverkar fuktbalansen, och allt du gjort – och inte gjort – för huden börjar synas. Det är inte för sent. Det är dags.",
      problemTitle: "Varför 40-årsåldern är en vändpunkt för huden",
      problemBody: "<p>I fyrtioårsåldern har kollagenförlusten accelererat. Du har nu förlorat 15–20 procent av ditt kollagen sedan 25-årsåldern, och nedbrytningen ökar tempo. Elastinfibrerna har tappat mycket av sin spänst, vilket gör att huden inte studsar tillbaka som den brukade. Fina linjer har blivit tydligare rynkor, och gravitationen börjar visa sin effekt.</p><p>Hormonella förändringar spelar också en allt större roll. Östrogennivåerna börjar sjunka, vilket direkt påverkar hudens fuktbindning, tjocklek och elasticitet. Många upplever att huden plötsligt känns torrare och tunnare, att den reagerar på saker den aldrig reagerat på förut.</p><p>Cellförnyelsen har saktat ner markant – från cirka 28 dagar i 20-årsåldern till 40–50 dagar. Det innebär att döda hudceller ligger kvar längre, huden ser mattare ut och aktiva ingredienser behöver längre tid att verka. Men det innebär också att rätt ingredienser gör större skillnad nu, eftersom huden aktivt behöver det stöd den inte längre kan ge sig själv i samma utsträckning.</p>",
      tipsTitle: "Uppgradera din rutin i 40-årsåldern",
      tips: [
        { title: "Byt till rikare produkter", body: "Om du fortfarande använder lätta lotioner och gel-produkter kan det vara dags att byta till oljor och rikare serum. Huden producerar mindre talg och behöver mer extern näring." },
        { title: "Dubbelrengör på kvällen", body: "Börja med en oljebaserad rengöring för att lösa smink och solskydd, följt av en mild rengöring. Det säkerställer ren hud utan att kompromissa med barriären." },
        { title: "Stöd hormonsystemet", body: "Adaptogena svampar och anti-stress-rutiner stödjer hormonsystemet inifrån. Huden speglar hormonbalansen, och 40-årsåldern är när den kopplingen blir tydligast." },
        { title: "Var extra noga med solskydd", body: "Kumulativ solskada är den största enskilda faktorn för hudens åldrande. I 40-årsåldern märks den, men konsekvent solskydd framåt bromsar processen dramatiskt." }
      ],
      solutionTitle: "DUO TA-DA – kraftfull duo för 40-plushud",
      solutionBody: "<p>DUO TA-DA ger dig den mest kompletta cannabinoidbaserade rutinen vi erbjuder: ansiktsolja med CBD för djup näring och TA-DA Serum med 3 procent CBG för koncentrerat stöd till cellförnyelse och hudbarriären.</p><p>I 40-årsåldern är det inte längre tillräckligt med bara fukt. Huden behöver aktiva ingredienser som kommunicerar med dess egna system. CBD stödjer det avtagande endocannabinoidsystemet medan CBG arbetar direkt med receptorer för att stimulera de processer som naturligt saktar ner.</p><p>Komplettera med Fungtastic svampextrakt för stöd inifrån. Adaptogena svampar som chaga och reishi bidrar till inflammation-kontroll och hormonbalans – två saker som direkt påverkar hudens kvalitet i 40-årsåldern. Det är en helhetsstrategi som ger huden det den behöver från alla håll.</p>",
      faq: [
        { q: "Är det för sent att börja med hudvård i 40-årsåldern?", a: "Absolut inte. Huden svarar på aktiva ingredienser i alla åldrar. Du kan inte ångra skada som redan skett, men du kan dramatiskt påverka hur huden utvecklas härifrån. Bästa tiden att börja var för tio år sedan – näst bästa tiden är nu." },
        { q: "Varför känns huden torrare i 40-årsåldern?", a: "Sjunkande östrogennivåer minskar hudens förmåga att binda fukt och producera talg. Dessutom tunnar huden ut, vilket gör att fukt avdunstar snabbare. Rikare produkter med oljor kompenserar för detta." },
        { q: "Hur skiljer sig DUO TA-DA från DUO-kit?", a: "DUO TA-DA inkluderar vår premium-ansiktsolja med högre CBD-koncentration plus TA-DA Serum. Det är vår mest kraftfulla kombination, designad för hud som behöver extra stöd." },
        { q: "Hjälper CBD mot rynkor i 40-årsåldern?", a: "CBD kan inte vända klockan tillbaka, men det stödjer hudens eget system för cellförnyelse och inflammationskontroll. Friskare, mer balanserad hud visar fina linjer och rynkor mindre tydligt." }
      ],
      ctaTitle: "Ge din hud den uppgradering den förtjänar",
      ctaSub: "40-årsåldern kräver smartare hudvård. DUO TA-DA och Fungtastic ger din hud kraften att blomstra i detta nya kapitel."
    },
    en: {
      metaTitle: "Skincare in your 40s – time to upgrade your routine | 1753",
      metaDescription: "In your 40s, skin needs more support and smarter ingredients. CBD and CBG deliver the upgrade your routine deserves. 1753 SKINCARE.",
      kicker: "Skincare in your 40s",
      h1: "Skincare in your 40s – your skin needs an upgrade, not a revolution",
      lead: "Your forties are when skin starts telling truths. Collagen declines faster, hormonal changes affect moisture balance, and everything you've done – and haven't done – for your skin starts to show. It's not too late. It's time.",
      problemTitle: "Why your 40s are a turning point for skin",
      problemBody: "<p>In your forties, collagen loss has accelerated. You've now lost 15–20 percent of your collagen since age 25, and the breakdown is picking up pace. Elastin fibers have lost much of their resilience, meaning skin doesn't bounce back the way it used to. Fine lines have become more defined wrinkles, and gravity is starting to make its presence felt.</p><p>Hormonal changes also play an increasingly significant role. Estrogen levels begin dropping, directly affecting the skin's moisture retention, thickness, and elasticity. Many find their skin suddenly feels drier and thinner, reacting to things it never reacted to before.</p><p>Cell turnover has slowed considerably – from about 28 days in your 20s to 40–50 days. This means dead skin cells linger longer, skin looks duller, and active ingredients need more time to work. But it also means the right ingredients make a bigger difference now, because the skin actively needs the support it can no longer provide itself to the same extent.</p>",
      tipsTitle: "Upgrade your routine in your 40s",
      tips: [
        { title: "Switch to richer products", body: "If you're still using lightweight lotions and gel products, it may be time to switch to oils and richer serums. Skin produces less sebum and needs more external nourishment." },
        { title: "Double-cleanse in the evening", body: "Start with an oil-based cleanser to dissolve makeup and sunscreen, followed by a gentle cleanser. This ensures clean skin without compromising the barrier." },
        { title: "Support the hormonal system", body: "Adaptogenic mushrooms and anti-stress routines support the hormonal system from within. Skin mirrors hormonal balance, and your 40s are when that connection becomes most apparent." },
        { title: "Be extra diligent with sunscreen", body: "Cumulative sun damage is the single biggest factor in skin aging. In your 40s it shows, but consistent sunscreen from here on dramatically slows the process." }
      ],
      solutionTitle: "DUO TA-DA – a powerful duo for 40-plus skin",
      solutionBody: "<p>DUO TA-DA gives you the most complete cannabinoid-based routine we offer: face oil with CBD for deep nourishment and TA-DA Serum with 3 percent CBG for concentrated cell renewal and barrier support.</p><p>In your 40s, moisture alone is no longer enough. Skin needs active ingredients that communicate with its own systems. CBD supports the declining endocannabinoid system while CBG works directly with receptors to stimulate the processes that naturally slow down.</p><p>Complement with Fungtastic mushroom extract for internal support. Adaptogenic mushrooms like chaga and reishi contribute to inflammation control and hormonal balance – two things that directly affect skin quality in your 40s. It's a holistic strategy that gives skin what it needs from all angles.</p>",
      faq: [
        { q: "Is it too late to start skincare in your 40s?", a: "Absolutely not. Skin responds to active ingredients at any age. You can't undo damage that's already done, but you can dramatically influence how skin develops from here. The best time to start was ten years ago – the next best time is now." },
        { q: "Why does skin feel drier in your 40s?", a: "Declining estrogen levels reduce the skin's ability to retain moisture and produce sebum. Additionally, skin thins, allowing moisture to evaporate faster. Richer products with oils compensate for this." },
        { q: "How does DUO TA-DA differ from the DUO-kit?", a: "DUO TA-DA includes our premium face oil with higher CBD concentration plus TA-DA Serum. It's our most powerful combination, designed for skin that needs extra support." },
        { q: "Does CBD help with wrinkles in your 40s?", a: "CBD can't turn back the clock, but it supports the skin's own system for cell renewal and inflammation control. Healthier, more balanced skin shows fine lines and wrinkles less prominently." }
      ],
      ctaTitle: "Give your skin the upgrade it deserves",
      ctaSub: "Your 40s demand smarter skincare. DUO TA-DA and Fungtastic give your skin the power to flourish in this new chapter."
    },
    es: {
      metaTitle: "Cuidado de la piel a los 40 – hora de subir de nivel | 1753",
      metaDescription: "A los 40 la piel pide más apoyo e ingredientes más listos. CBD y CBG suben el listón de tu rutina. 1753 SKINCARE.",
      kicker: "Cuidado de la piel a los 40",
      h1: "Cuidado de la piel a los 40 – tu piel pide mejora, no revolución caótica",
      lead: "Los cuarenta son cuando la piel empieza a decir verdades. El colágeno cae más rápido, las hormonas mueven la hidratación y todo lo que hiciste – o no – por tu piel se nota. No es tarde. Es el momento.",
      problemTitle: "Por qué los 40 son un punto de inflexión",
      problemBody: "<p>En los cuarenta la pérdida de colágeno acelera. Ya has perdido un 15–20 por ciento desde los 25 y el ritmo sube. Las fibras de elastina pierden elasticidad; la piel no rebota igual. Las líneas finas se marcan más y la gravedad se deja notar.</p><p>Los cambios hormonales pesan más. Bajan los estrógenos y eso golpea retención de agua, grosor y elasticidad. De repente la piel se siente más seca y fina y reacciona a cosas que antes pasaban desapercibidas.</p><p>La renovación celular se ha frenado – de unas 28 días en los 20 a 40–50 días. Las células muertas se quedan más tiempo, el brillo baja y los activos necesitan más tiempo. Pero también significa que los ingredientes correctos marcan más diferencia: la piel ya no se autoabastece igual.</p>",
      tipsTitle: "Sube de nivel en los 40",
      tips: [
        { title: "Pásate a texturas más ricas", body: "Si sigues solo con lociones ligeras y geles, prueba aceites y serum más densos. Menos sebo propio = más nutrición externa." },
        { title: "Doble limpieza por la noche", body: "Aceite o bálsamo para maquillaje y SPF, luego limpiador suave. Limpia sin destrozar la barrera." },
        { title: "Apoya el eje hormonal", body: "Hongos adaptógenos y hábitos antiestrés ayudan por dentro. La piel refleja el equilibrio hormonal – en los 40 se nota mucho." },
        { title: "SPF con rigor", body: "El daño solar acumulado es un motor enorme del fotoenvejecimiento. A los 40 se ve; un SPF constante desde ahora frena el proceso con fuerza." }
      ],
      solutionTitle: "DUO TA-DA – dupla potente para piel 40+",
      solutionBody: "<p>DUO TA-DA es nuestra rutina cannabinoide más completa: aceite facial con CBD para nutrición profunda y TA-DA Serum con 3 por ciento CBG para renovación y barrera concentradas.</p><p>A los 40 ya no basta solo hidratar. Hacen falta activos que hablen con los sistemas de la piel. El CBD apoya el ECS en declive; el CBG actúa en receptores para impulsar procesos que naturalmente frenan.</p><p>Suma Fungtastic mushroom extract por dentro: hongos adaptógenos como chaga y reishi apoyan inflamación y equilibrio hormonal – dos palancas directas en la calidad cutánea a los 40. Estrategia integral.</p>",
      faq: [
        { q: "¿Es tarde para empezar skincare a los 40?", a: "Para nada. La piel responde a activos a cualquier edad. No borras el pasado, pero sí cambias mucho el rumbo. Lo ideal era hace diez años; lo segundo mejor es hoy." },
        { q: "¿Por qué noto más sequedad a los 40?", a: "Menos estrógenos = menos capacidad de retener agua y menos sebo. La piel también se adelgaza y pierde agua más rápido. Texturas más ricas en aceite compensan." },
        { q: "¿En qué se diferencia DUO TA-DA del DUO-kit?", a: "DUO TA-DA incluye nuestro aceite premium con más CBD más TA-DA Serum. Es la combinación más potente para piel que pide refuerzo extra." },
        { q: "¿El CBD ayuda con arrugas a los 40?", a: "No devuelve el tiempo, pero apoya renovación e inflamación desde el sistema propio de la piel. Una piel más sana y equilibrada muestra menos las líneas." }
      ],
      ctaTitle: "Dale a tu piel la mejora que merece",
      ctaSub: "Los 40 piden skincare más listo. DUO TA-DA y Fungtastic dan a tu piel fuelle para brillar en este capítulo nuevo."
    },
    de: {
      metaTitle: "Hautpflege in den 40ern – Zeit für ein Upgrade | 1753",
      metaDescription: "In den 40ern braucht die Haut mehr Support und klügere Inhaltsstoffe. CBD und CBG liefern das Upgrade, das deine Routine verdient. 1753 SKINCARE.",
      kicker: "Hautpflege in den 40ern",
      h1: "Hautpflege in den 40ern – deine Haut braucht ein Upgrade, keine Revolution",
      lead: "In den 40ern erzählt die Haut die Wahrheit. Kollagen sinkt schneller, Hormone verändern die Feuchtigkeit, und alles, was du für die Haut getan – oder nicht getan – hast, wird sichtbar. Es ist nicht zu spät. Es ist Zeit.",
      problemTitle: "Warum die 40er ein Wendepunkt sind",
      problemBody: "<p>In den 40ern beschleunigt sich der Kollagenverlust. Seit 25 fehlen dir 15–20 Prozent, und das Tempo steigt. Elastinfasern verlieren Rückstellkraft – die Haut federt nicht mehr wie früher. Feine Linien werden Falten, und die Schwerkraft meldet sich.</p><p>Hormonelle Veränderungen spielen eine größere Rolle. Östrogen sinkt – direkter Einfluss auf Feuchtespeicherung, Dicke und Elastizität. Plötzlich wirkt die Haut trockener und dünner und reagiert auf Dinge, die früher kein Thema waren.</p><p>Die Zellerneuerung ist deutlich langsamer – von etwa 28 Tagen in den 20ern auf 40–50 Tage. Tote Zellen bleiben länger, der Teint wirkt matter, Wirkstoffe brauchen mehr Zeit. Gleichzeitig wirken die richtigen Inhaltsstoffe jetzt stärker, weil die Haut den früheren Selbst-Support verliert.</p>",
      tipsTitle: "Upgrade deine Routine in den 40ern",
      tips: [
        { title: "Zu reicheren Produkten wechseln", body: "Wenn du noch bei leichten Lotions und Gelen bist: Zeit für Öle und kräftigere Seren. Weniger eigener Talg = mehr äußere Nahrung." },
        { title: "Abends Doppelreinigung", body: "Öl zum Auflösen von Make-up und Lichtschutz, danach milder Reiniger. Sauber ohne Barriere-Müll." },
        { title: "Hormonsystem unterstützen", body: "Adaptogene Pilze und Anti-Stress-Routinen wirken von innen. Die Haut spiegelt hormonelles Gleichgewicht – in den 40ern besonders deutlich." },
        { title: "Besonders konsequent zum Lichtschutz", body: "Kumulative UV-Schäden treiben Hautalterung massiv an. In den 40ern sieht man es – konsequenter SPF ab jetzt bremst stark." }
      ],
      solutionTitle: "DUO TA-DA – kraftvolles Duo für 40-plus-Haut",
      solutionBody: "<p>DUO TA-DA ist unsere vollständigste cannabinoidbasierte Routine: CBD-Gesichtsöl für tiefe Nahrung und TA-DA Serum mit 3 Prozent CBG für fokussierte Erneuerung und Barriere.</p><p>In den 40ern reicht Feuchtigkeit allein nicht. Die Haut braucht Aktive, die mit ihren Systemen sprechen. CBD stützt das nachlassende ECS; CBG spricht Rezeptoren an und pusht Prozesse, die natürlich langsamer werden.</p><p>Ergänze mit Fungtastic mushroom extract von innen: adaptogene Pilze wie Chaga und Reishi für Entzündungsbalance und Hormonbalance – zwei Hebel für Hautqualität in den 40ern. Ganzheitlich gedacht.</p>",
      faq: [
        { q: "Ist es zu spät, in den 40ern mit Hautpflege zu starten?", a: "Überhaupt nicht. Haut reagiert in jedem Alter auf Wirkstoffe. Vergangenes bleibt, aber der Verlauf ab jetzt kannst du stark beeinflussen. Am besten vor zehn Jahren – der nächstbeste Zeitpunkt ist jetzt." },
        { q: "Warum wirkt die Haut in den 40ern trockener?", a: "Sinkendes Östrogen schwächt Feuchteretention und Talgproduktion. Die Haut wird dünner, Feuchtigkeit verdunstet schneller. Reichhaltige Öl-Produkte kompensieren." },
        { q: "Unterschied DUO TA-DA zum DUO-kit?", a: "DUO TA-DA enthält unser Premium-Gesichtsöl mit höherer CBD-Konzentration plus TA-DA Serum. Unsere stärkste Kombi für Haut, die Extra-Support braucht." },
        { q: "Hilft CBD gegen Falten in den 40ern?", a: "CBD dreht die Uhr nicht zurück, stützt aber Erneuerung und Entzündungskontrolle über das eigene System. Gesündere, ausgeglichenere Haut zeigt Linien weniger dominant." }
      ],
      ctaTitle: "Gib deiner Haut das Upgrade, das sie verdient",
      ctaSub: "Die 40er verlangen klügere Pflege. DUO TA-DA und Fungtastic geben deiner Haut Kraft für dieses neue Kapitel."
    },
    fr: {
      metaTitle: "Soin de la peau à la quarantaine – passer à la vitesse supérieure | 1753",
      metaDescription: "À la quarantaine, la peau veut plus de soutien et des ingrédients plus malins. CBD et CBG upgradent ta routine. 1753 SKINCARE.",
      kicker: "Soin de la peau à la quarantaine",
      h1: "Soin de la peau à la quarantaine – ta peau veut une montée en gamme, pas une révolution",
      lead: "La quarantaine, c'est quand la peau dit les vraies choses. Le collagène chute plus vite, les hormones bougent l'hydratation, et tout ce que tu as fait – ou pas – pour ta peau se lit sur ton visage. Ce n'est pas trop tard. C'est le bon moment.",
      problemTitle: "Pourquoi la quarantaine est un tournant",
      problemBody: "<p>À la quarantaine, la perte de collagène accélère. Tu as déjà perdu 15 à 20 % depuis 25 ans, et le rythme augmente. Les fibres d'élastine perdent leur ressort – la peau ne rebondit plus comme avant. Les ridules deviennent rides plus marquées, et la gravité se rappelle à toi.</p><p>Les changements hormonaux comptent davantage. La baisse d'œstrogène touche rétention d'eau, épaisseur et élasticité. Du jour au lendemain la peau paraît plus sèche, plus fine, et réagit à des choses qui passaient avant.</p><p>Le renouvellement cellulaire a ralenti – d'environ 28 jours à la vingtaine à 40–50 jours. Les cellules mortes s'accumulent, l'éclat baisse, les actifs mettent plus longtemps. Mais les bons ingrédients frappent plus fort maintenant, parce que la peau ne se soutient plus comme avant.</p>",
      tipsTitle: "Upgrade ta routine à la quarantaine",
      tips: [
        { title: "Passe à des textures plus riches", body: "Si tu en es encore aux lotions légères et gels, vise huiles et sérums plus nourrissants. Moins de sébum maison = plus de nutrition externe." },
        { title: "Double démaquillage le soir", body: "Huile pour dissoudre maquillage et SPF, puis nettoyant doux. Propre sans sacrifier la barrière." },
        { title: "Soutien hormonal", body: "Champignons adaptogènes et routines anti-stress agissent de l'intérieur. La peau reflète l'équilibre hormonal – à la quarantaine, c'est flagrant." },
        { title: "SPF sans relâche", body: "Les dégâts solaires cumulés poussent fort le photo-vieillissement. À la quarantaine ça se voit ; un SPF régulier d'ici freine net le processus." }
      ],
      solutionTitle: "DUO TA-DA – duo puissant pour peau 40+",
      solutionBody: "<p>DUO TA-DA, c'est notre routine cannabinoïde la plus complète : huile visage au CBD pour nutrition profonde et TA-DA Serum avec 3 % de CBG pour renouvellement et barrière ciblés.</p><p>À la quarantaine, l'hydratation seule ne suffit plus. Il faut des actifs qui parlent aux systèmes de la peau. Le CBD soutient l'ECS qui faiblit ; le CBG cible les récepteurs pour relancer ce qui ralentit naturellement.</p><p>Ajoute Fungtastic mushroom extract de l'intérieur : champignons adaptogènes comme chaga et reishi pour inflammation et équilibre hormonal – deux leviers directs sur la qualité de peau à la quarantaine. Vision globale.</p>",
      faq: [
        { q: "Trop tard pour commencer les soins à la quarantaine ?", a: "Pas du tout. La peau répond aux actifs à tout âge. Tu n'effaces pas le passé, mais tu changes la suite. Le meilleur moment, c'était il y a dix ans ; le suivant, c'est maintenant." },
        { q: "Pourquoi ma peau est plus sèche après 40 ?", a: "La baisse d'œstrogène réduit rétention d'eau et production de sébum. La peau s'amincit, l'eau s'échappe plus vite. Des produits plus riches en huiles compensent." },
        { q: "Différence entre DUO TA-DA et DUO-kit ?", a: "DUO TA-DA inclut notre huile premium à plus fort CBD plus TA-DA Serum. Notre combo la plus puissante pour une peau qui veut un soutien maximal." },
        { q: "Le CBD aide les rides à la quarantaine ?", a: "Il ne remonte pas le temps, mais soutient renouvellement et inflammation via le système propre de la peau. Une peau plus saine et équilibrée montre moins les traits." }
      ],
      ctaTitle: "Offre à ta peau l'upgrade qu'elle mérite",
      ctaSub: "La quarantaine exige des soins plus malins. DUO TA-DA et Fungtastic donnent à ta peau l'énergie pour ce nouveau chapitre."
    }
  },
  {
    svSlug: "hudvard-50-plus",
    enSlug: "skincare-50s",
    esSlug: "cuidado-de-la-piel-despues-de-los-50",
    deSlug: "hautpflege-ab-50",
    frSlug: "soin-de-la-peau-apres-50-ans",
    category: "audience",
    productIds: ["duo-ta-da", "ta-da-serum", "fungtastic-mushroom-extract"],
    sv: {
      metaTitle: "Hudvård efter 50 – stöd, näring och respekt för din hud | 1753",
      metaDescription: "Hud efter 50 förtjänar stöd, inte skam. Djup näring med CBD och CBG för hud som levt och har historier att berätta. 1753 SKINCARE.",
      kicker: "Hudvård efter 50",
      h1: "Hudvård efter 50 – din hud har levt ett liv, ge den ett bra nästa kapitel",
      lead: "Efter 50 har huden sett det mesta. Hormoner har förändrats, kollagen har minskat, och huden är tunnare och känsligare. Men den är också vackrare än någonsin – om du ger den det den behöver istället för att jaga det som var.",
      problemTitle: "Hudens verklighet efter 50",
      problemBody: "<p>Efter 50 – särskilt för kvinnor i och efter klimakteriet – sker dramatiska förändringar i huden. Östrogenfallet leder till att huden förlorar upp till 30 procent av sitt kollagen under de första fem åren efter menopaus. Det är ingen gradvis minskning – det är en brant nedgång som påverkar tjocklek, elasticitet och fuktbindning på djupet.</p><p>Hudbarriären försvagas markant. Lipidproduktionen minskar, vilket gör huden mer känslig för uttorkning, irritation och yttre påverkan. Sår läker långsammare, pigmentförändringar kan bli mer uttalade, och huden kan kännas skör på ett sätt den aldrig gjort förut.</p><p>Endocannabinoidsystemets aktivitet har minskat ytterligare, vilket påverkar hudens förmåga att hantera inflammation och cellförnyelse. Torr vinterhud, klåda, och en känsla av att huden inte längre svarar på produkter som fungerade förut – det är vanliga upplevelser som sällan adresseras med respekt och ärlighet av hudvårdsindustrin. Din hud har inte gett upp. Den behöver bara annat stöd nu.</p>",
      tipsTitle: "Omtänksam hudvård efter 50",
      tips: [
        { title: "Maximal näring, minimal irritation", body: "Huden är tunnare och känsligare. Välj rika, lugnande produkter och undvik allt som sticker, bränner eller stressar huden. Om det irriterar är det fel produkt, punkt." },
        { title: "Olja är din bästa vän", body: "Ansiktsoljor levererar näring som huden inte längre producerar själv. CBD-olja ger dessutom stöd till endocannabinoidsystemet som avtar med åldern." },
        { title: "Stöd inifrån är avgörande", body: "Adaptogener, antioxidanter och omega-fettsyror via kost och tillskott gör enorm skillnad för hud över 50. Huden speglar kroppens helhet mer än någonsin." },
        { title: "Nattrutinen är viktigast", body: "Huden reparerar sig nattetid och den processen blir allt viktigare med åldern. Applicera rikligt med närande produkter på kvällen och låt huden arbeta medan du sover." }
      ],
      solutionTitle: "DUO TA-DA och Fungtastic – en trio för mogen styrka",
      solutionBody: "<p>DUO TA-DA ger huden den djupa näring den längtar efter: CBD-ansiktsolja som stöder endocannabinoidsystemet och TA-DA Serum med 3 procent CBG som arbetar med cellförnyelse och barriärstöd. Tillsammans skapar de en kraftfull duo som adresserar de centrala behoven hos hud efter 50.</p><p>Fungtastic svampextrakt kompletterar utifrån med adaptogena svampar som stöder kroppens stressrespons, inflammationshantering och hormonbalans. Det är stöd inifrån som syns utanpå – en helhetsstrategi som respekterar att huden inte kan separeras från resten av kroppen.</p><p>Vi tror att hud efter 50 är vacker. Vi tror att den förtjänar de bästa ingredienserna och den mest omtänksamma vården. Inte för att dölja ålder, utan för att ge den kraft och komfort i varje nytt kapitel.</p>",
      faq: [
        { q: "Varför förändras huden så mycket vid klimakteriet?", a: "Östrogenfallet vid klimakteriet påverkar hudens kollagenproduktion, fuktbindning och barriärfunktion dramatiskt. Upp till 30 procent av kollagenet kan förloras under de första fem åren efter menopaus." },
        { q: "Kan CBD-hudvård hjälpa efter klimakteriet?", a: "CBD stödjer hudens endocannabinoidsystem som naturligt avtar med åldern. Det kan bidra till bättre fuktbalans, lugnare hud och stöd till cellförnyelse – alla relevanta behov efter klimakteriet." },
        { q: "Är det för sent att börja med hudvård efter 50?", a: "Det är aldrig för sent. Huden svarar på näring och aktiva ingredienser i alla åldrar. De förbättringar du kan uppnå kanske ser annorlunda ut än i yngre år, men de är lika verkliga och märkbara." },
        { q: "Hur viktigt är det med stöd inifrån?", a: "Mycket viktigt. Hud efter 50 svarar extra bra på insatser inifrån – adaptogener, antioxidanter, omega-fettsyror och god sömn. Kombinationen av utvärtes vård och invärtes stöd ger de bästa resultaten." }
      ],
      ctaTitle: "Ge din hud det bästa i varje kapitel",
      ctaSub: "Hud efter 50 förtjänar respekt och djup omvårdnad. DUO TA-DA och Fungtastic ger din hud kraft att blomstra – oavsett ålder."
    },
    en: {
      metaTitle: "Skincare after 50 – support, nourishment, and respect for your skin | 1753",
      metaDescription: "Skin after 50 deserves support, not shame. Deep nourishment with CBD and CBG for skin that has lived and has stories to tell. 1753 SKINCARE.",
      kicker: "Skincare after 50",
      h1: "Skincare after 50 – your skin has lived a life, give it a good next chapter",
      lead: "After 50, skin has seen it all. Hormones have shifted, collagen has decreased, and skin is thinner and more sensitive. But it's also more beautiful than ever – if you give it what it needs instead of chasing what was.",
      problemTitle: "Skin's reality after 50",
      problemBody: "<p>After 50 – especially for women during and after menopause – dramatic changes occur in the skin. The estrogen drop leads to skin losing up to 30 percent of its collagen during the first five years after menopause. This isn't a gradual decline – it's a steep drop that profoundly affects thickness, elasticity, and moisture retention.</p><p>The skin barrier weakens significantly. Lipid production decreases, making skin more susceptible to dehydration, irritation, and environmental damage. Wounds heal more slowly, pigmentation changes may become more pronounced, and skin can feel fragile in ways it never has before.</p><p>The endocannabinoid system's activity has decreased further, affecting the skin's ability to manage inflammation and cell renewal. Dry winter skin, itching, and a feeling that skin no longer responds to products that used to work – these are common experiences rarely addressed with respect and honesty by the skincare industry. Your skin hasn't given up. It just needs different support now.</p>",
      tipsTitle: "Thoughtful skincare after 50",
      tips: [
        { title: "Maximum nourishment, minimal irritation", body: "Skin is thinner and more sensitive. Choose rich, calming products and avoid anything that stings, burns, or stresses the skin. If it irritates, it's the wrong product. Period." },
        { title: "Oil is your best friend", body: "Face oils deliver nourishment that skin no longer produces on its own. CBD oil additionally supports the endocannabinoid system that declines with age." },
        { title: "Internal support is crucial", body: "Adaptogens, antioxidants, and omega fatty acids through diet and supplements make an enormous difference for skin over 50. Skin mirrors overall body health more than ever." },
        { title: "The night routine matters most", body: "Skin repairs at night, and that process becomes increasingly important with age. Apply generous amounts of nourishing products in the evening and let skin work while you sleep." }
      ],
      solutionTitle: "DUO TA-DA and Fungtastic – a trio for mature strength",
      solutionBody: "<p>DUO TA-DA gives skin the deep nourishment it craves: CBD face oil supporting the endocannabinoid system and TA-DA Serum with 3 percent CBG working with cell renewal and barrier support. Together they create a powerful duo addressing the central needs of skin after 50.</p><p>Fungtastic mushroom extract complements from within using adaptogenic mushrooms that support the body's stress response, inflammation management, and hormonal balance. It's internal support that shows on the outside – a holistic strategy that respects that skin cannot be separated from the rest of the body.</p><p>We believe skin after 50 is beautiful. We believe it deserves the finest ingredients and the most thoughtful care. Not to hide age, but to give it strength and comfort in every new chapter.</p>",
      faq: [
        { q: "Why does skin change so much during menopause?", a: "The estrogen drop during menopause dramatically affects skin's collagen production, moisture retention, and barrier function. Up to 30 percent of collagen can be lost during the first five years after menopause." },
        { q: "Can CBD skincare help after menopause?", a: "CBD supports the skin's endocannabinoid system that naturally declines with age. It can contribute to better moisture balance, calmer skin, and cell renewal support – all relevant needs after menopause." },
        { q: "Is it too late to start skincare after 50?", a: "It's never too late. Skin responds to nourishment and active ingredients at any age. The improvements you can achieve may look different than in younger years, but they're equally real and noticeable." },
        { q: "How important is internal support?", a: "Very important. Skin after 50 responds especially well to internal efforts – adaptogens, antioxidants, omega fatty acids, and good sleep. The combination of external care and internal support delivers the best results." }
      ],
      ctaTitle: "Give your skin the best in every chapter",
      ctaSub: "Skin after 50 deserves respect and deep care. DUO TA-DA and Fungtastic give your skin the power to flourish – regardless of age."
    },
    es: {
      metaTitle: "Cuidado de la piel después de los 50 – apoyo, nutrición y respeto | 1753",
      metaDescription: "La piel después de 50 merece apoyo, no vergüenza. Nutrición profunda con CBD y CBG para piel con historia. 1753 SKINCARE.",
      kicker: "Cuidado de la piel después de los 50",
      h1: "Cuidado de la piel después de los 50 – tu piel ha vivido; dale un buen siguiente capítulo",
      lead: "Pasados los 50 la piel lo ha visto casi todo. Hormonas distintas, menos colágeno, más fina y sensible. Pero también puede estar más bella que nunca – si le das lo que necesita en lugar de perseguir lo que fue.",
      problemTitle: "La realidad de la piel después de los 50",
      problemBody: "<p>Después de 50 – sobre todo en y tras la menopausia – la piel cambia en serio. La caída de estrógenos puede hacer perder hasta un 30 por ciento del colágeno en los primeros cinco años. No es un declive suave: es un salto que golpea grosor, elasticidad y retención de agua.</p><p>La barrera se debilita mucho. Menos lípidos = más deshidratación, irritación y daño ambiental. Las heridas cicatrizan más lento, la pigmentación puede marcarse más, la piel se siente frágil como nunca.</p><p>La actividad del sistema endocannabinoide también ha bajado, y eso afecta inflamación y renovación. Piel de invierno tirante, picor, sensación de que nada de lo que antes funcionaba responde – experiencias comunes que la industria rara vez trata con respeto. Tu piel no se ha rendido: solo necesita otro tipo de apoyo.</p>",
      tipsTitle: "Skincare con mimo después de los 50",
      tips: [
        { title: "Máxima nutrición, mínima irritación", body: "La piel es más fina y reactiva. Elige texturas ricas y calmantes; si escuece o quema, ese producto no es para ti. Punto." },
        { title: "El aceite es aliado", body: "Los aceites aportan lo que la piel ya no produce sola. El aceite con CBD además apoya el ECS que declina con los años." },
        { title: "Desde dentro cuenta mucho", body: "Adaptógenos, antioxidantes y omega por dieta y suplementos marcan diferencia enorme. La piel refleja al cuerpo entero más que nunca." },
        { title: "La noche manda", body: "La reparación es nocturna y gana peso con la edad. Por la noche, capas generosas de productos nutritivos y deja trabajar a la piel mientras duermes." }
      ],
      solutionTitle: "DUO TA-DA y Fungtastic – trío para fuerza madura",
      solutionBody: "<p>DUO TA-DA da la nutrición profunda que pide la piel: aceite facial con CBD para el ECS y TA-DA Serum con 3 por ciento CBG para renovación y barrera. Juntos cubren los núcleos de la piel 50+.</p><p>Fungtastic mushroom extract suma por dentro hongos adaptógenos que apoyan respuesta al estrés, inflamación y equilibrio hormonal. Apoyo interno que se nota afuera – sin separar piel del resto del cuerpo.</p><p>Creemos que la piel después de 50 es hermosa. Merece los mejores ingredientes y el cuidado más atento. No para esconder la edad, sino para darle fuerza y confort en cada capítulo nuevo.</p>",
      faq: [
        { q: "¿Por qué la piel cambia tanto en la menopausia?", a: "La caída de estrógenos golpea colágeno, retención de agua y barrera. Hasta un 30 por ciento del colágeno puede perderse en los primeros cinco años tras la menopausia." },
        { q: "¿El skincare con CBD ayuda después de la menopausia?", a: "El CBD apoya el ECS que baja con la edad. Puede mejorar equilibrio hídrico, calmar la piel y apoyar la renovación – necesidades clave después de la menopausia." },
        { q: "¿Es tarde para empezar después de los 50?", a: "Nunca es tarde. La piel responde a nutrición y activos a cualquier edad. Los resultados pueden verse distintos que a los 20, pero son reales." },
        { q: "¿Qué tan importante es el apoyo interno?", a: "Muy. La piel 50+ responde especialmente bien a adaptógenos, antioxidantes, omega y buen sueño. Afuera + adentro = mejor resultado." }
      ],
      ctaTitle: "Lo mejor para tu piel en cada capítulo",
      ctaSub: "La piel después de 50 merece respeto y cuidado profundo. DUO TA-DA y Fungtastic le dan fuelle para florecer – a cualquier edad."
    },
    de: {
      metaTitle: "Hautpflege ab 50 – Unterstützung, Nahrung und Respekt | 1753",
      metaDescription: "Haut ab 50 verdient Support, keine Scham. Tiefe Nahrung mit CBD und CBG für Haut mit Geschichte. 1753 SKINCARE.",
      kicker: "Hautpflege ab 50",
      h1: "Hautpflege ab 50 – deine Haut hat gelebt, gib ihr ein starkes nächstes Kapitel",
      lead: "Ab 50 hat die Haut fast alles gesehen. Hormone verschieben sich, Kollagen sinkt, die Haut ist dünner und empfindlicher. Sie kann aber schöner sein denn je – wenn du ihr gibst, was sie braucht, statt dem nachzujagen, was war.",
      problemTitle: "Die Realität der Haut ab 50",
      problemBody: "<p>Ab 50 – besonders bei Frauen in und nach den Wechseljahren – verändert sich die Haut dramatisch. Der Östrogenabfall kann in den ersten fünf Jahren nach der Menopause bis zu 30 Prozent Kollagen kosten. Kein sanfter Abstieg – ein steiler Drop für Dicke, Elastizität und Feuchtespeicherung.</p><p>Die Barriere schwächt sich stark. Weniger Lipide = mehr Dehydrierung, Irritation, Umwelteinflüsse. Wunden heilen langsamer, Pigmentierung kann stärker werden, die Haut wirkt zerbrechlicher als je zuvor.</p><p>Auch das endocannabinoide System ist weniger aktiv – Einfluss auf Entzündung und Erneuerung. Wintertrockenheit, Juckreiz, das Gefühl, nichts wirkt mehr wie früher – häufige Erfahrungen, die die Branche selten respektvoll anspricht. Deine Haut hat nicht aufgegeben – sie braucht nur andere Unterstützung.</p>",
      tipsTitle: "Achtsame Pflege ab 50",
      tips: [
        { title: "Maximale Nahrung, minimale Irritation", body: "Die Haut ist dünner und sensibler. Reichhaltige, beruhigende Produkte; alles, das brennt oder sticht, ist falsch. Punkt." },
        { title: "Öl ist dein Verbündeter", body: "Gesichtsöle liefern, was die Haut nicht mehr selbst herstellt. CBD-Öl unterstützt zusätzlich das ECS, das mit dem Alter nachlässt." },
        { title: "Von innen entscheidend", body: "Adaptogene, Antioxidantien und Omega über Ernährung und Supplements machen einen riesigen Unterschied. Die Haut spiegelt den ganzen Körper stärker denn je." },
        { title: "Die Nachtroutine zählt am meisten", body: "Reparatur läuft nachts und wird mit dem Alter wichtiger. Abends großzügig nahrhaft einpflegen und die Haut arbeiten lassen." }
      ],
      solutionTitle: "DUO TA-DA und Fungtastic – Trio für reife Stärke",
      solutionBody: "<p>DUO TA-DA liefert die tiefe Nahrung, die die Haut will: CBD-Gesichtsöl für das ECS und TA-DA Serum mit 3 Prozent CBG für Erneuerung und Barriere. Zusammen adressieren sie die Kernbedürfnisse ab 50.</p><p>Fungtastic mushroom extract ergänzt von innen mit adaptogenen Pilzen für Stressreaktion, Entzündungsmanagement und Hormonbalance. Innerer Support, der außen sichtbar wird – Haut ist nicht vom Körper trennbar.</p><p>Wir finden Haut ab 50 schön. Sie verdient beste Inhaltsstoffe und aufmerksamste Pflege. Nicht um Alter zu verstecken – sondern Kraft und Komfort in jedem neuen Kapitel.</p>",
      faq: [
        { q: "Warum verändert sich die Haut in den Wechseljahren so stark?", a: "Der Östrogenabfall trifft Kollagenproduktion, Feuchtespeicherung und Barriere massiv. Bis zu 30 Prozent Kollagen können in den ersten fünf Jahren nach der Menopause fehlen." },
        { q: "Hilft CBD-Hautpflege nach den Wechseljahren?", a: "CBD stützt das ECS, das mit dem Alter abnimmt. Es kann Feuchtigkeit, Beruhigung und Erneuerung unterstützen – zentrale Themen danach." },
        { q: "Zu spät, ab 50 mit Hautpflege zu starten?", a: "Nie zu spät. Haut reagiert in jedem Alter auf Nahrung und Wirkstoffe. Ergebnisse sehen anders aus als mit 20 – sind aber real." },
        { q: "Wie wichtig ist innerer Support?", a: "Sehr. Haut ab 50 reagiert besonders auf Adaptogene, Antioxidantien, Omega und guten Schlaf. Äußere Pflege plus innerer Support = bestes Ergebnis." }
      ],
      ctaTitle: "Gib deiner Haut in jedem Kapitel das Beste",
      ctaSub: "Haut ab 50 verdient Respekt und tiefe Pflege. DUO TA-DA und Fungtastic geben Kraft zum Aufblühen – in jedem Alter."
    },
    fr: {
      metaTitle: "Soin de la peau après 50 ans – soutien, nutrition et respect | 1753",
      metaDescription: "La peau après 50 mérite du soutien, pas la honte. Nutrition profonde au CBD et CBG pour une peau qui a vécu. 1753 SKINCARE.",
      kicker: "Soin de la peau après 50 ans",
      h1: "Soin de la peau après 50 ans – ta peau a une histoire ; offre-lui la suite qu'elle mérite",
      lead: "Après 50, la peau a presque tout vu. Hormones différentes, moins de collagène, plus fine et sensible. Elle peut aussi être plus belle que jamais – si tu lui donnes ce dont elle a besoin au lieu de courir après le passé.",
      problemTitle: "La réalité de la peau après 50 ans",
      problemBody: "<p>Après 50 ans – surtout pendant et après la ménopause – la peau bascule fort. La chute d'œstrogènes peut faire perdre jusqu'à 30 % du collagène dans les cinq premières années. Ce n'est pas une lente dérive : c'est une chute qui touche épaisseur, élasticité et rétention d'eau.</p><p>La barrière faiblit net. Moins de lipides = plus de déshydratation, d'irritation et de sensibilité environnementale. Les plaies guérissent plus lentement, la pigmentation peut s'accentuer, la peau semble fragile comme jamais.</p><p>L'activité du système endocannabinoïde a encore baissé, avec effet sur inflammation et renouvellement. Peau d'hiver qui tire, démangegements, impression que plus rien ne réagit comme avant – des expériences que l'industrie aborde rarement avec honnêteté. Ta peau n'a pas abandonné : elle a besoin d'un autre soutien.</p>",
      tipsTitle: "Soins attentionnés après 50 ans",
      tips: [
        { title: "Nutrition max, irritation min", body: "La peau est plus fine et réactive. Choisis des formules riches et apaisantes ; si ça pique ou brûle, ce n'est pas le bon produit. Point." },
        { title: "L'huile est ton alliée", body: "Les huiles visage apportent ce que la peau ne produit plus seule. L'huile au CBD soutient en plus l'ECS qui décline avec l'âge." },
        { title: "L'intérieur est crucial", body: "Adaptogènes, antioxydants et oméga via alimentation et compléments changent beaucoup de choses. La peau reflète le corps entier plus que jamais." },
        { title: "La nuit prime", body: "La réparation est nocturne et gagne en importance avec l'âge. Le soir, des couches généreuses de soins nourrissants et laisse la peau travailler pendant ton sommeil." }
      ],
      solutionTitle: "DUO TA-DA et Fungtastic – trio pour une force mature",
      solutionBody: "<p>DUO TA-DA offre la nutrition profonde que la peau réclame : huile visage au CBD pour l'ECS et TA-DA Serum avec 3 % de CBG pour renouvellement et barrière. Ensemble, ils couvrent les besoins centraux après 50 ans.</p><p>Fungtastic mushroom extract complète de l'intérieur avec des champignons adaptogènes qui soutiennent la réponse au stress, la gestion de l'inflammation et l'équilibre hormonal. Un soutien interne visible de l'extérieur – la peau n'est pas séparable du reste du corps.</p><p>Nous croyons que la peau après 50 est belle. Elle mérite les meilleurs ingrédients et les soins les plus réfléchis. Pas pour cacher l'âge, mais pour lui donner force et confort à chaque nouveau chapitre.</p>",
      faq: [
        { q: "Pourquoi la peau change-t-elle autant à la ménopause ?", a: "La chute d'œstrogènes frappe collagène, rétention d'eau et barrière. Jusqu'à 30 % du collagène peut disparaître dans les cinq premières années après la ménopause." },
        { q: "Le CBD aide-t-il après la ménopause ?", a: "Le CBD soutient l'ECS qui faiblit avec l'âge. Il peut aider l'équilibre hydrique, apaiser et soutenir le renouvellement – des besoins clés ensuite." },
        { q: "Trop tard pour commencer après 50 ans ?", a: "Jamais trop tard. La peau réagit à la nutrition et aux actifs à tout âge. Les gains peuvent différer de ceux de la vingtaine, mais ils sont réels." },
        { q: "À quel point le soutien interne compte ?", a: "Énormément. La peau après 50 répond particulièrement aux adaptogènes, antioxydants, oméga et bon sommeil. Soins externes + soutien interne = meilleur résultat." }
      ],
      ctaTitle: "Le meilleur pour ta peau à chaque chapitre",
      ctaSub: "La peau après 50 mérite respect et soins profonds. DUO TA-DA et Fungtastic lui donnent l'élan pour s'épanouir – à tout âge."
    }
  },
  {
    svSlug: "hudvard-vinter",
    enSlug: "winter-skincare",
    esSlug: "cuidado-de-la-piel-invierno",
    deSlug: "hautpflege-winter",
    frSlug: "soin-de-la-peau-hiver",
    category: "audience",
    productIds: ["duo-ta-da", "ta-da-serum", "au-naturel-makeup-remover"],
    sv: {
      metaTitle: "Hudvård på vintern – skydda huden mot nordisk kyla | 1753",
      metaDescription: "Nordisk vinter är brutal mot huden. Kyla, vind och torr inomhusluft kräver en anpassad rutin. CBD-hudvård för svenska vintrar. 1753 SKINCARE.",
      kicker: "Hudvård på vintern",
      h1: "Hudvård på vintern – nordisk kyla kräver nordisk omvårdnad",
      lead: "Svensk vinter innebär minusgrader ute och uttorkad luft inne. Din hud pendlar mellan två extremer varje dag, och den traditionella hudvården är sällan designad för de villkor vi lever under i Norden.",
      problemTitle: "Varför vintern är hudens tuffaste årstid",
      problemBody: "<p>Den nordiska vintern utsätter huden för en unik dubbelbelastning. Utomhus möts den av temperaturer under noll, bitande vind och låg luftfuktighet. Inomhus väntar uppvärmd luft som kan ha en relativ fuktighet på bara 20–30 procent – lägre än Saharaöknen. Huden pendlar mellan dessa extremer flera gånger om dagen.</p><p>Kyla gör att blodkärlen i huden drar ihop sig, vilket minskar syretillförseln och näringstransporten till hudcellerna. Barriärfunktionen kompromitteras när lipiderna i hudens yttre skikt stelnar i kylan. Resultatet är hud som spricker, flagnar, kliar och rodnar – inte för att den är sjuk, utan för att den utsätts för förhållanden den inte är designad för.</p><p>Dessutom minskar UV-strålningens synliga intensitet på vintern, vilket leder till att många skippar solskydd. Men UVA-strålning – den som driver hudens åldrande och skadar på djupet – är relativt konstant året runt. Snö reflekterar dessutom UV-strålning och kan förstärka exponeringen. Vintern är inte en semester för huden – det är en stresstest som kräver anpassning.</p>",
      tipsTitle: "Överlevnadsguide för huden på vintern",
      tips: [
        { title: "Byt till rikare produkter", body: "Lätta lotioner och gel-produkter räcker inte på vintern. Byt till ansiktsoljor och rikare serum som skapar ett skyddande lager och förhindrar fuktförlust." },
        { title: "Applicera på fuktig hud", body: "Applicera olja och serum på lätt fuktig hud för att låsa in fukten. Det skapar en bättre barriär mot den torra luften både inne och ute." },
        { title: "Undvik het dusch i ansiktet", body: "Varm dusch och tvättning med hett vatten förstör hudens naturliga fettlager. Tvätta ansiktet med ljummet vatten och var extra varsam under vintermånaderna." },
        { title: "Skydda exponerade ytor", body: "Kinder, näsa och läppar är mest utsatta. Applicera extra olja på dessa ytor innan du går ut i kylan. Tänk på det som en buffertzon mellan huden och vädret." },
        { title: "Använd luftfuktare inne", body: "Torr inomhusluft är lika skadlig som kylan ute. En luftfuktare i sovrummet gör stor skillnad för hudens återhämtning nattetid under vintern." }
      ],
      solutionTitle: "CBD-olja som vinterskydd",
      solutionBody: "<p>Ansiktsoljor är vinterns bästa vän, och CBD-olja ger ett dubbelt skydd: fysiskt genom att skapa en närande barriär mot kyla och torr luft, och biologiskt genom att stödja hudens endocannabinoidsystem som extra-belastas under vinterns påfrestningar.</p><p>DUO TA-DA ger dig den mest skyddande kombinationen: CBD-olja för djup näring och barriärskydd, plus TA-DA Serum som stärker hudbarriären inifrån med CBG. Applicera serumet först på fuktig hud, följt av oljan som försegling. Det är en vinterbunkring som ger huden allt den behöver för att klara nordisk kyla.</p><p>Komplettera med Au Naturel för skonsam rengöring som inte stripper bort de naturliga oljor huden desperat behöver behålla under vintern. Vinterhudvård handlar om att bygga upp, inte bryta ner.</p>",
      faq: [
        { q: "Varför blir huden så torr på vintern?", a: "Kall luft håller mindre fukt, uppvärmd inomhusluft har extremt låg luftfuktighet, och kylan minskar hudens egen lipidproduktion. Kombinationen skapar en perfekt storm för uttorkad hud." },
        { q: "Behöver jag solskydd på vintern?", a: "Ja. UVA-strålning som driver hudens åldrande är relativt konstant året runt. Snö reflekterar dessutom UV-strålning. Solskydd är relevant alla årstider i Norden." },
        { q: "Kan CBD hjälpa mot vinterhud?", a: "CBD stödjer hudens barriärfunktion och inflammationshantering, båda extra viktiga under vinterns påfrestningar. Det hjälper huden att behålla fukt och lugnar den irritation som kyla och torr luft orsakar." },
        { q: "När ska jag byta till vinterrutin?", a: "Byt när du märker att din vanliga rutin inte räcker – ofta redan i oktober i Sverige. Byt tillbaka gradvis på våren. Lyssna på huden, inte kalendern." }
      ],
      ctaTitle: "Rusta huden för nordisk vinter",
      ctaSub: "Svensk vinter kräver svenska lösningar. DUO TA-DA ger din hud det skydd och den näring den behöver för att klara kylan."
    },
    en: {
      metaTitle: "Winter skincare – protect your skin from Nordic cold | 1753",
      metaDescription: "Nordic winter is brutal on skin. Cold, wind, and dry indoor air demand an adapted routine. CBD skincare for Scandinavian winters. 1753 SKINCARE.",
      kicker: "Winter skincare",
      h1: "Winter skincare – Nordic cold demands Nordic care",
      lead: "Swedish winter means sub-zero temperatures outside and dehydrated air inside. Your skin commutes between two extremes every day, and traditional skincare is rarely designed for the conditions we live under in Scandinavia.",
      problemTitle: "Why winter is skin's toughest season",
      problemBody: "<p>The Nordic winter subjects skin to a unique double burden. Outdoors, it faces sub-zero temperatures, biting wind, and low humidity. Indoors, heated air can have a relative humidity of just 20–30 percent – lower than the Sahara Desert. Skin swings between these extremes several times daily.</p><p>Cold causes blood vessels in the skin to constrict, reducing oxygen supply and nutrient transport to skin cells. Barrier function is compromised when lipids in the skin's outer layer solidify in the cold. The result is skin that cracks, flakes, itches, and reddens – not because it's sick, but because it's exposed to conditions it wasn't designed for.</p><p>Additionally, the visible intensity of UV radiation decreases in winter, leading many to skip sunscreen. But UVA radiation – the kind that drives skin aging and causes deep damage – remains relatively constant year-round. Snow also reflects UV radiation and can amplify exposure. Winter isn't a vacation for skin – it's a stress test that demands adaptation.</p>",
      tipsTitle: "Skin survival guide for winter",
      tips: [
        { title: "Switch to richer products", body: "Lightweight lotions and gel products won't cut it in winter. Switch to face oils and richer serums that create a protective layer and prevent moisture loss." },
        { title: "Apply to damp skin", body: "Apply oil and serum to slightly damp skin to lock in moisture. This creates a better barrier against dry air both indoors and outdoors." },
        { title: "Avoid hot water on your face", body: "Hot showers and washing with hot water destroy the skin's natural lipid layer. Wash your face with lukewarm water and be extra gentle during winter months." },
        { title: "Protect exposed areas", body: "Cheeks, nose, and lips are most vulnerable. Apply extra oil to these areas before heading out into the cold. Think of it as a buffer zone between skin and weather." },
        { title: "Use a humidifier indoors", body: "Dry indoor air is as damaging as the cold outside. A humidifier in the bedroom makes a significant difference for skin recovery during winter nights." }
      ],
      solutionTitle: "CBD oil as winter protection",
      solutionBody: "<p>Face oils are winter's best friend, and CBD oil provides double protection: physically by creating a nourishing barrier against cold and dry air, and biologically by supporting the skin's endocannabinoid system that's extra-stressed during winter's challenges.</p><p>DUO TA-DA gives you the most protective combination: CBD oil for deep nourishment and barrier protection, plus TA-DA Serum that strengthens the skin barrier from within with CBG. Apply the serum first to damp skin, followed by the oil as a seal. It's winter armor that gives skin everything it needs to handle Nordic cold.</p><p>Complement with Au Naturel for gentle cleansing that doesn't strip away the natural oils skin desperately needs to retain during winter. Winter skincare is about building up, not breaking down.</p>",
      faq: [
        { q: "Why does skin get so dry in winter?", a: "Cold air holds less moisture, heated indoor air has extremely low humidity, and cold reduces the skin's own lipid production. The combination creates a perfect storm for dehydrated skin." },
        { q: "Do I need sunscreen in winter?", a: "Yes. UVA radiation that drives skin aging is relatively constant year-round. Snow also reflects UV radiation. Sunscreen is relevant in all seasons in Scandinavia." },
        { q: "Can CBD help with winter skin?", a: "CBD supports the skin's barrier function and inflammation management, both extra important during winter's stresses. It helps skin retain moisture and calms the irritation caused by cold and dry air." },
        { q: "When should I switch to a winter routine?", a: "Switch when you notice your usual routine isn't enough – often as early as October in Sweden. Transition back gradually in spring. Listen to your skin, not the calendar." }
      ],
      ctaTitle: "Prepare your skin for Nordic winter",
      ctaSub: "Swedish winter demands Swedish solutions. DUO TA-DA gives your skin the protection and nourishment it needs to handle the cold."
    },
    es: {
      metaTitle: "Cuidado de la piel en invierno – protege tu piel del frío nórdico | 1753",
      metaDescription: "El invierno nórdico castiga la piel. Frío, viento y aire interior seco piden rutina a medida. Skincare con CBD para inviernos escandinavos. 1753 SKINCARE.",
      kicker: "Cuidado de la piel en invierno",
      h1: "Cuidado de la piel en invierno – el frío nórdico pide cuidado a la altura",
      lead: "Invierno sueco: bajo cero fuera y aire seco dentro. Tu piel viaja entre dos extremos cada día, y el skincare convencional rara vez está pensado para vivir en el Norte.",
      problemTitle: "Por qué el invierno es la estación más dura para la piel",
      problemBody: "<p>El invierno nórdico somete la piel a una doble carga. Fuera: temperaturas bajo cero, viento y baja humedad. Dentro: calefacción con humedad relativa del 20–30 por ciento – menos que el Sahara. La piel salta entre extremos varias veces al día.</p><p>El frío contrae los vasos, baja oxígeno y nutrientes a las células. La barrera sufre cuando los lípidos de la capa externa se endurecen con el frío. Resultado: grietas, descamación, picor, rojez – no porque esté enferma, sino porque el entorno no es el suyo.</p><p>Además, la UV visible baja en invierno y muchos dejan el SPF. Pero la UVA – la que envejece y daña en profundidad – es relativamente estable todo el año. La nieve refleja UV y amplifica la dosis. El invierno no es vacaciones para la piel: es un test de estrés que exige adaptar la rutina.</p>",
      tipsTitle: "Guía de supervivencia cutánea en invierno",
      tips: [
        { title: "Sube de textura", body: "Las lociones ligeras no suelen bastar. Aceites faciales y serum más ricos crean capa protectora y frenan la pérdida de agua." },
        { title: "Aplica sobre piel húmeda", body: "Aceite y serum sobre piel ligeramente húmeda sellan mejor la hidratación frente al aire seco dentro y fuera." },
        { title: "Nada de agua hirviendo en la cara", body: "Duchas muy calientes y agua caliente al lavar destruyen los lípidos naturales. Usa agua templada y sé extra suave en invierno." },
        { title: "Protege lo expuesto", body: "Mejillas, nariz y labios sufren más. Refuerza con aceite antes de salir al frío – como una zona tampón entre piel y clima." },
        { title: "Humidifica en casa", body: "El aire seco interior hace tanto daño como el frío exterior. Un humidificador en el dormitorio ayuda mucho a la recuperación nocturna." }
      ],
      solutionTitle: "Aceite con CBD como escudo invernal",
      solutionBody: "<p>Los aceites faciales son los mejores aliados del invierno; el aceite con CBD suma doble función: barrera física nutritiva frente a frío y aire seco, y apoyo biológico al ECS, más exigido en este estrés.</p><p>DUO TA-DA es la combinación más protectora: aceite CBD para nutrición y barrera, más TA-DA Serum con CBG para reforzar la barrera desde dentro. Serum primero sobre piel húmeda, luego aceite como sello. Armadura invernal para aguantar el norte.</p><p>Completa con Au Naturel para limpiar sin arrancar los lípidos que la piel necesita conservar. En invierno se trata de construir, no de desgastar.</p>",
      faq: [
        { q: "¿Por qué la piel se reseca tanto en invierno?", a: "El aire frío retiene poca humedad, la calefacción interior seca muchísimo y el frío reduce la producción lipídica propia. La tormenta perfecta para deshidratación." },
        { q: "¿Necesito SPF en invierno?", a: "Sí. La UVA que impulsa el fotoenvejecimiento es relativamente constante todo el año. La nieve refleja UV. En el Norte el SPF importa en todas las estaciones." },
        { q: "¿El CBD ayuda con la piel de invierno?", a: "Apoya barrera e inflamación – dos frentes clave bajo estrés inverno. Ayuda a retener agua y calma la irritación de frío y aire seco." },
        { q: "¿Cuándo pasar a rutina de invierno?", a: "Cuando notes que la habitual ya no basta – a menudo ya en octubre en Suecia. En primavera, vuelve gradualmente. Escucha la piel, no solo el calendario." }
      ],
      ctaTitle: "Prepara tu piel para el invierno nórdico",
      ctaSub: "El invierno sueco pide soluciones a su medida. DUO TA-DA da protección y nutrición para aguantar el frío."
    },
    de: {
      metaTitle: "Hautpflege im Winter – schütze deine Haut vor nordischer Kälte | 1753",
      metaDescription: "Nordischer Winter ist brutal für die Haut. Kälte, Wind und trockene Raumluft brauchen angepasste Routine. CBD-Pflege für skandinavische Winter. 1753 SKINCARE.",
      kicker: "Hautpflege im Winter",
      h1: "Hautpflege im Winter – nordische Kälte verlangt nordische Pflege",
      lead: "Schwedischer Winter: Minusgrade draußen, ausgetrocknete Luft drinnen. Deine Haut pendelt täglich zwischen Extremen, und klassische Pflege ist selten für skandinavische Realität gebaut.",
      problemTitle: "Warum Winter die härteste Jahreszeit für die Haut ist",
      problemBody: "<p>Der nordische Winter belastet die Haut doppelt. Draußen: Frost, Wind, niedrige Luftfeuchtigkeit. Drinnen: beheizte Luft mit 20–30 Prozent relativer Feuchtigkeit – trockener als die Sahara. Mehrmals täglich wechselt die Haut zwischen diesen Polen.</p><p>Kälte zieht Gefäße zusammen – weniger Sauerstoff und Nährstoffe für die Zellen. Die Barriere leidet, wenn Lipide in der äußeren Schicht in der Kälte hart werden. Ergebnis: Risse, Schuppen, Juckreiz, Rötung – nicht weil die Haut krank ist, sondern weil die Bedingungen nicht zu ihr passen.</p><p>Dazu: Die sichtbare UV-Intensität sinkt im Winter, viele lassen den Lichtschutz weg. UVA – der Typ, der Alterung und Tiefenschäden treibt – bleibt aber das Jahr relativ konstant. Schnee reflektiert UV und verstärkt die Dosis. Winter ist kein Urlaub für die Haut – ein Stresstest, der Anpassung will.</p>",
      tipsTitle: "Überlebensguide Haut im Winter",
      tips: [
        { title: "Zu reicheren Produkten wechseln", body: "Leichte Lotions reichen oft nicht. Gesichtsöle und kräftigere Seren bilden Schutz und reduzieren Feuchtigkeitsverlust." },
        { title: "Auf feuchter Haut auftragen", body: "Öl und Serum auf leicht feuchter Haut fixieren Feuchtigkeit besser gegen trockene Luft drinnen und draußen." },
        { title: "Heißes Wasser im Gesicht meiden", body: "Heiße Duschen und heißes Waschen zerstören die Lipidschicht. Lauwarm und extra sanft im Winter." },
        { title: "Exponierte Stellen schützen", body: "Wangen, Nase, Lippen sind am verwundbarsten. Vor dem Rausgehen extra Öl – Puffer zwischen Haut und Wetter." },
        { title: "Luftbefeuchter drinnen", body: "Trockene Raumluft schadet wie Kälte draußen. Ein Befeuchter im Schlafzimmer hilft der nächtlichen Erholung der Haut." }
      ],
      solutionTitle: "CBD-Öl als Winterschutz",
      solutionBody: "<p>Gesichtsöle sind Winters bester Freund; CBD-Öl liefert doppelten Schutz: physisch als nährende Barriere gegen Kälte und trockene Luft, biologisch durch ECS-Support unter Winterstress.</p><p>DUO TA-DA ist die schützendste Kombi: CBD-Öl für tiefe Nahrung und Barriere, plus TA-DA Serum mit CBG zur Barriere-Stärkung von innen. Zuerst Serum auf feuchter Haut, dann Öl als Verschluss. Winterrüstung für nordische Kälte.</p><p>Ergänze mit Au Naturel für schonende Reinigung, ohne die natürlichen Öle herauszuwaschen, die die Haut im Winter braucht. Winterpflege heißt aufbauen, nicht abbauen.</p>",
      faq: [
        { q: "Warum wird die Haut im Winter so trocken?", a: "Kalte Luft speichert wenig Feuchtigkeit, beheizte Innenluft ist extrem trocken, und Kälte drosselt die eigene Lipidproduktion. Perfektes Szenario für Dehydrierung." },
        { q: "Brauche ich im Winter Lichtschutz?", a: "Ja. UVA, die Hautalterung treibt, ist das Jahr relativ gleich. Schnee reflektiert UV. In Skandinavien zählt SPF in jeder Jahreszeit." },
        { q: "Hilft CBD bei Winterhaut?", a: "CBD stützt Barriere und Entzündungsmanagement – beides unter Winterstress besonders wichtig. Es hilft, Feuchtigkeit zu halten und Irritation von Kälte und trockener Luft zu mildern." },
        { q: "Wann auf Winterroutine wechseln?", a: "Wenn die gewohnte Routine nicht mehr reicht – oft schon im Oktober in Schweden. Im Frühling langsam zurück. Haut hören, nicht nur Kalender." }
      ],
      ctaTitle: "Rüste deine Haut für den nordischen Winter",
      ctaSub: "Schwedischer Winter braucht passende Antworten. DUO TA-DA liefert Schutz und Nahrung für die Kälte."
    },
    fr: {
      metaTitle: "Soin de la peau en hiver – protège ta peau du froid nordique | 1753",
      metaDescription: "L'hiver nordique est brutal pour la peau. Froid, vent et air intérieur sec exigent une routine adaptée. Soins CBD pour hivers scandinaves. 1753 SKINCARE.",
      kicker: "Soin de la peau en hiver",
      h1: "Soin de la peau en hiver – le froid nordique mérite des soins à la hauteur",
      lead: "L'hiver suédois, c'est le gel dehors et l'air asséché dedans. Ta peau navigue entre deux extrêmes chaque jour, et le soin classique est rarement pensé pour vivre dans le Nord.",
      problemTitle: "Pourquoi l'hiver est la saison la plus rude pour la peau",
      problemBody: "<p>L'hiver nordique impose une double contrainte. Dehors : sous zéro, vent, faible humidité. Dedans : air chauffé à 20–30 % d'humidité relative – plus sec que le Sahara. La peau oscille entre ces pôles plusieurs fois par jour.</p><p>Le froid resserre les vaisseaux – moins d'oxygène et de nutriments pour les cellules. La barrière souffre quand les lipides de la couche externe durcissent au froid. Résultat : gerçures, desquamation, démangeaisons, rougeurs – pas parce qu'elle est malade, mais parce que l'environnement ne lui convient pas.</p><p>En plus, l'intensité UV visible baisse en hiver et beaucoup zappent le SPF. Mais l'UVA – celle qui vieillit et abîme en profondeur – reste relativement stable toute l'année. La neige réfléchit les UV et augmente l'exposition. L'hiver n'est pas des vacances pour la peau : c'est un test de stress qui demande d'adapter la routine.</p>",
      tipsTitle: "Guide survie peau en hiver",
      tips: [
        { title: "Passe à des textures plus riches", body: "Les lotions légères suffisent rarement. Huiles visage et sérums plus denses créent une couche protectrice et limitent la perte d'eau." },
        { title: "Applique sur peau humide", body: "Huile et sérum sur peau légèrement humide piègent mieux l'hydratation face à l'air sec intérieur et extérieur." },
        { title: "Évite l'eau brûlante sur le visage", body: "Douches brûlantes et rinçage chaud détruisent la couche lipidique. Eau tiède et douceur renforcée en hiver." },
        { title: "Protège les zones exposées", body: "Joues, nez, lèvres prennent le plus. Couche d'huile supplémentaire avant de sortir au froid – zone tampon entre peau et météo." },
        { title: "Humidifie l'intérieur", body: "L'air sec à la maison nuit autant que le froid dehors. Un humidificateur dans la chambre aide la récupération nocturne." }
      ],
      solutionTitle: "Huile au CBD comme bouclier hivernal",
      solutionBody: "<p>Les huiles visage sont les meilleures alliées de l'hiver ; l'huile au CBD double la mise : barrière nourrissante contre froid et air sec, et soutien biologique de l'ECS sollicité par le stress hivernal.</p><p>DUO TA-DA, c'est le combo le plus protecteur : huile CBD pour nutrition et barrière, plus TA-DA Serum au CBG pour renforcer la barrière de l'intérieur. Sérum d'abord sur peau humide, puis huile comme sceau. Armure hivernale pour le nord.</p><p>Complète avec Au Naturel pour nettoyer sans arracher les lipides que la peau doit garder en hiver. L'hiver, on construit – on ne ronge pas la barrière.</p>",
      faq: [
        { q: "Pourquoi la peau est-elle si sèche en hiver ?", a: "L'air froid retient peu d'humidité, l'air chauffé est ultra sec, et le froid réduit la production lipidique. Tempête parfaite pour la déshydratation." },
        { q: "Faut-il du SPF en hiver ?", a: "Oui. L'UVA qui pousse le photo-vieillissement reste relativement stable toute l'année. La neige réfléchit les UV. Au Nord, le SPF compte en toutes saisons." },
        { q: "Le CBD aide la peau d'hiver ?", a: "Il soutient barrière et gestion de l'inflammation – deux leviers cruciaux sous stress hivernal. Ça aide à retenir l'eau et à calmer l'irritation du froid et de l'air sec." },
        { q: "Quand passer en routine hiver ?", a: "Quand ta routine habituelle ne suffit plus – souvent dès octobre en Suède. Au printemps, reviens en douceur. Écoute la peau, pas seulement le calendrier." }
      ],
      ctaTitle: "Prépare ta peau pour l'hiver nordique",
      ctaSub: "L'hiver suédois appelle des réponses adaptées. DUO TA-DA apporte protection et nutrition pour affronter le froid."
    }
  },
  {
    svSlug: "hudvard-sommar",
    enSlug: "summer-skincare",
    esSlug: "cuidado-de-la-piel-verano",
    deSlug: "hautpflege-sommer",
    frSlug: "soin-de-la-peau-ete",
    category: "audience",
    productIds: ["ta-da-serum", "au-naturel-makeup-remover", "duo-kit"],
    sv: {
      metaTitle: "Hudvård på sommaren – skydda och balansera i nordisk sol | 1753",
      metaDescription: "Nordisk sommar med långa dagar och stark sol kräver anpassad hudvård. Lätt CBD-rutin som skyddar utan att belasta. 1753 SKINCARE.",
      kicker: "Hudvård på sommaren",
      h1: "Hudvård på sommaren – solens paradox i Norden",
      lead: "Svensk sommar är magisk – men den är också en utmaning för huden. Långa ljusa dagar, stark UV-strålning och värme förändrar hudens villkor. Din vinterrutin passar inte längre, och det är helt naturligt.",
      problemTitle: "Varför sommaren kräver en annan strategi",
      problemBody: "<p>Den nordiska sommaren är unik. Efter månader av mörker och kyla exploderar ljuset – och huden, som vant sig vid vinterklimat, möter plötsligt stark UV-strålning under dygnets längsta dagar. I juni kan Stockholm ha över 18 timmar med solljus. Det är fantastiskt för själen men krävande för huden.</p><p>Ökad UV-exponering triggar melaninproduktion, fria radikaler och DNA-skador i hudcellerna. Huden svarar med ökad talgproduktion, svettning och en förändrad barriärfunktion. Produkter som fungerade perfekt under vintern kan plötsligt kännas för tunga, täppa till porer och orsaka utbrott.</p><p>Samtidigt lurar myten om att brun hud är frisk hud. Solbränna är hudens stressrespons – ett rop på hjälp, inte ett tecken på hälsa. I Norden är vi särskilt sårbara efter vinterns ljusbrist och den bleka huden som inte hunnit bygga upp sitt melaninförsvar. Sommaren kräver respekt, anpassning och en lättare rutin som skyddar utan att belasta.</p>",
      tipsTitle: "Smart sommarhudvård i Norden",
      tips: [
        { title: "Byt till lättare produkter", body: "Vinteroljor kan kännas för tunga i sommarvärmen. Byt till lättare serum som bas och använd olja bara på kvällen när huden reparerar sig. Låt huden andas dagtid." },
        { title: "Solskydd är inte förhandlingsbart", body: "Applicera solskydd varje morgon, oavsett väder. UV-strålning penetrerar moln. Applicera om varannan timme om du är utomhus, och direkt efter bad eller svett." },
        { title: "Rengör ordentligt på kvällen", body: "Sommarens kombination av solskydd, svett och ökad talgproduktion kräver grundlig men mild rengöring på kvällen. Dubbelrengöring är extra värdefullt i juli och augusti." },
        { title: "Återfukta efter sol", body: "Solexponering torkar ut huden även om du inte bränner dig. Applicera lugnande, återfuktande produkter efter soldagar. CBG-serum ger lugnande stöd utan att vara tungt." },
        { title: "Skydda inifrån", body: "Antioxidanter via kost – bär, grönsaker, frukt – ger huden internt skydd mot fria radikaler som UV-strålning skapar. Den svenska sommaren är full av antioxidant-rik mat." }
      ],
      solutionTitle: "Lätt CBD-rutin för nordisk sommar",
      solutionBody: "<p>Sommaren kallar på en lättare rutin. TA-DA Serum med CBG är det perfekta sommar-steget: tillräckligt lätt för att inte belasta huden i värmen, men tillräckligt aktivt för att stödja cellförnyelse och lugna den inflammation som UV-exponering orsakar.</p><p>Au Naturel fungerar utmärkt som sommarrengöring – mild nog att använda efter svettiga dagar utan att rubba barriären, effektiv nog att lösa solskydd och den extra talg som sommarens värme producerar. Det är den rengöring som inte tar mer än den ger.</p><p>På kvällen kan du lägga till DUO-kitets CBD-olja för djupare näring under hudens nattliga reparation. Sommarrutinen handlar om att vara lätt dagtid och närande nattetid – en rytm som följer hudens egna behov genom dygnets cykler.</p>",
      faq: [
        { q: "Behöver jag ändra rutin på sommaren?", a: "Ja, de flesta bör anpassa sin rutin. Lättare produkter dagtid, fokus på solskydd, och grundligare rengöring på kvällen. Huden har andra behov när temperatur och UV-exponering ökar." },
        { q: "Kan jag använda CBD-olja i solen?", a: "CBD-olja ersätter inte solskydd, men det finns inga kända risker med att använda CBD-produkter i kombination med sol. Applicera solskydd som vanligt och använd CBD-olja som del av din kvällsrutin." },
        { q: "Varför får jag utbrott på sommaren?", a: "Ökad talgproduktion, svett och tunna solskyddsprodukter kan täppa till porer. Grundlig men mild rengöring på kvällen och lättare produkter dagtid hjälper. CBG-serum är lätt nog att inte förvärra problemet." },
        { q: "Är nordisk sol verkligen så stark?", a: "Ja. I juni–juli är UV-indexet i Sverige ofta lika högt som i Medelhavet. Kombinerat med långa dagar och blek hy efter vintern gör det nordisk sommar till en krävande period för huden." }
      ],
      ctaTitle: "Ge huden en smart sommar",
      ctaSub: "Nordisk sommar kräver lätt, skyddande hudvård. TA-DA Serum och Au Naturel ger huden balans genom de ljusa månaderna."
    },
    en: {
      metaTitle: "Summer skincare – protect and balance in Nordic sun | 1753",
      metaDescription: "Nordic summer with long days and strong sun demands adapted skincare. A lightweight CBD routine that protects without weighing you down. 1753 SKINCARE.",
      kicker: "Summer skincare",
      h1: "Summer skincare – the sun's paradox in the Nordics",
      lead: "Swedish summer is magical – but it's also a challenge for skin. Long bright days, strong UV radiation, and heat change the conditions for your skin. Your winter routine no longer fits, and that's completely natural.",
      problemTitle: "Why summer demands a different strategy",
      problemBody: "<p>The Nordic summer is unique. After months of darkness and cold, the light explodes – and skin, accustomed to winter conditions, suddenly meets strong UV radiation during the longest days of the year. In June, Stockholm can have over 18 hours of sunlight. It's wonderful for the soul but demanding on the skin.</p><p>Increased UV exposure triggers melanin production, free radicals, and DNA damage in skin cells. Skin responds with increased oil production, sweating, and altered barrier function. Products that worked perfectly in winter can suddenly feel too heavy, clog pores, and cause breakouts.</p><p>Meanwhile, the myth persists that tan skin is healthy skin. A tan is the skin's stress response – a cry for help, not a sign of health. In the Nordics, we're especially vulnerable after winter's light deprivation and pale skin that hasn't had time to build up its melanin defense. Summer demands respect, adaptation, and a lighter routine that protects without weighing you down.</p>",
      tipsTitle: "Smart summer skincare in the Nordics",
      tips: [
        { title: "Switch to lighter products", body: "Winter oils can feel too heavy in summer heat. Switch to lighter serums as your base and only use oil at night when skin is repairing. Let your skin breathe during the day." },
        { title: "Sunscreen is non-negotiable", body: "Apply sunscreen every morning, regardless of weather. UV radiation penetrates clouds. Reapply every two hours if you're outdoors, and immediately after swimming or sweating." },
        { title: "Cleanse thoroughly at night", body: "Summer's combination of sunscreen, sweat, and increased oil production requires thorough but gentle evening cleansing. Double cleansing is especially valuable in July and August." },
        { title: "Hydrate after sun", body: "Sun exposure dehydrates skin even if you don't burn. Apply calming, hydrating products after sun-filled days. CBG serum provides soothing support without feeling heavy." },
        { title: "Protect from within", body: "Antioxidants through diet – berries, vegetables, fruits – give skin internal protection against the free radicals UV radiation creates. The Swedish summer is full of antioxidant-rich foods." }
      ],
      solutionTitle: "A lightweight CBD routine for Nordic summer",
      solutionBody: "<p>Summer calls for a lighter routine. TA-DA Serum with CBG is the perfect summer step: light enough not to burden skin in the heat, but active enough to support cell renewal and calm the inflammation UV exposure causes.</p><p>Au Naturel works brilliantly as a summer cleanser – gentle enough to use after sweaty days without disrupting the barrier, effective enough to dissolve sunscreen and the extra sebum summer heat produces. It's the cleanser that doesn't take more than it gives.</p><p>In the evening, you can add the DUO-kit's CBD oil for deeper nourishment during skin's nightly repair. The summer routine is about being light during the day and nourishing at night – a rhythm that follows skin's own needs through the daily cycle.</p>",
      faq: [
        { q: "Do I need to change my routine in summer?", a: "Yes, most people should adapt their routine. Lighter products during the day, focus on sun protection, and more thorough evening cleansing. Skin has different needs when temperature and UV exposure increase." },
        { q: "Can I use CBD oil in the sun?", a: "CBD oil doesn't replace sunscreen, but there are no known risks of using CBD products in combination with sun exposure. Apply sunscreen as normal and use CBD oil as part of your evening routine." },
        { q: "Why do I break out in summer?", a: "Increased oil production, sweat, and heavy sunscreen products can clog pores. Thorough but gentle evening cleansing and lighter daytime products help. CBG serum is light enough not to worsen the issue." },
        { q: "Is Nordic sun really that strong?", a: "Yes. In June and July, the UV index in Sweden is often as high as in the Mediterranean. Combined with long days and pale skin after winter, this makes Nordic summer a demanding period for skin." }
      ],
      ctaTitle: "Give your skin a smart summer",
      ctaSub: "Nordic summer demands light, protective skincare. TA-DA Serum and Au Naturel give your skin balance through the bright months."
    },
    es: {
      metaTitle: "Cuidado de la piel en verano – protege y equilibra bajo el sol nórdico | 1753",
      metaDescription: "Verano nórdico: días largos y sol fuerte piden skincare a medida. Rutina ligera con CBD que protege sin pesar. 1753 SKINCARE.",
      kicker: "Cuidado de la piel en verano",
      h1: "Cuidado de la piel en verano – la paradoja del sol en el Norte",
      lead: "El verano sueco es magia pura – y también un reto para la piel. Días largos, UV intenso y calor cambian las reglas. Tu rutina de invierno ya no encaja, y es normal.",
      problemTitle: "Por qué el verano exige otra estrategia",
      problemBody: "<p>El verano nórdico es singular. Tras meses de oscuridad y frío, la luz explota – y la piel, acostumbrada al invierno, choca con un UV fuerte en los días más largos. En junio Estocolmo puede superar las 18 horas de sol. Maravilloso para el ánimo, exigente para la piel.</p><p>Más UV dispara melanina, radicales libres y daño al ADN en las células. La piel responde con más sebo, sudor y una barrera distinta. Lo que iba bien en invierno puede de pronto pesar, tapar poros y provocar brotes.</p><p>Sigue el mito del bronceado = salud. Una quemadura solar es estrés cutáneo – pedido de ayuda, no señal de bienestar. En el Norte somos más vulnerables tras el invierno y la piel clara sin defensa melanínica aún montada. El verano pide respeto, adaptación y rutina más ligera que proteja sin ahogar.</p>",
      tipsTitle: "Skincare de verano listo para el Norte",
      tips: [
        { title: "Aligera las texturas", body: "Los aceites de invierno pueden pesar con calor. Base en serum ligero y reserva el aceite para la noche, cuando la piel repara. Deja respirar de día." },
        { title: "SPF sin debate", body: "Cada mañana, haga el tiempo que haga. El UV atraviesa nubes. Renueva cada dos horas al aire libre y tras baño o sudor." },
        { title: "Limpia bien por la noche", body: "SPF + sudor + más sebo piden limpieza profunda pero suave al acostarse. La doble limpieza brilla en julio y agosto." },
        { title: "Hidrata tras el sol", body: "El sol deshidrata aunque no quemes. Tras los días al aire libre, productos calmantes e hidratantes. TA-DA Serum aporta apoyo ligero sin sensación pesada." },
        { title: "Protección desde dentro", body: "Antioxidantes en la dieta – bayas, verduras, fruta – refuerzan la piel frente a radicales que dispara el UV. El verano sueco está lleno de ellos." }
      ],
      solutionTitle: "Rutina CBD ligera para verano nórdico",
      solutionBody: "<p>El verano pide aligerar. TA-DA Serum con CBG es el paso ideal: lo bastante ligero para no cargar en calor, lo bastante activo para renovación y calmar la inflamación que deja el sol.</p><p>Au Naturel funciona genial como limpiador de verano – suave tras días de sudor sin romper la barrera, efectivo disolviendo SPF y el sebo extra del calor. Limpia sin quitar de más.</p><p>Por la noche puedes sumar el aceite CBD del DUO-kit para nutrir mientras la piel repara. Día ligero, noche nutritiva – ritmo alineado con lo que la piel pide en 24 horas.</p>",
      faq: [
        { q: "¿Debo cambiar la rutina en verano?", a: "Sí, la mayoría conviene ajustar: texturas más ligeras de día, SPF serio y limpieza más minuciosa por la noche. Con más temperatura y UV, las necesidades cambian." },
        { q: "¿Puedo usar aceite CBD con sol?", a: "El aceite CBD no sustituye el SPF; no hay riesgos conocidos combinando CBD y exposición solar. Usa protector como siempre y deja el aceite para la noche." },
        { q: "¿Por qué me salen granos en verano?", a: "Más sebo, sudor y SPF densos pueden obstruir poros. Limpieza nocturna suave pero completa y productos ligeros de día ayudan. TA-DA Serum es ligero y no suele empeorar el tema." },
        { q: "¿El sol nórdico es tan fuerte como dicen?", a: "Sí. En junio–julio el índice UV en Suecia a menudo rivaliza con el Mediterráneo. Sumas días largos y piel clara tras el invierno: verano exigente para la piel." }
      ],
      ctaTitle: "Un verano inteligente para tu piel",
      ctaSub: "El verano nórdico pide skincare ligero y protector. TA-DA Serum y Au Naturel mantienen el equilibrio en los meses de luz."
    },
    de: {
      metaTitle: "Hautpflege im Sommer – schützen und balancieren in nordischer Sonne | 1753",
      metaDescription: "Nordischer Sommer mit langen Tagen und starker Sonne braucht angepasste Pflege. Leichte CBD-Routine, die schützt ohne zu beschweren. 1753 SKINCARE.",
      kicker: "Hautpflege im Sommer",
      h1: "Hautpflege im Sommer – das Sonnen-Paradox im Norden",
      lead: "Schwedischer Sommer ist Magie – und eine Herausforderung für die Haut. Lange helle Tage, starke UV-Strahlung und Hitze ändern die Bedingungen. Deine Winterroutine passt nicht mehr – völlig normal.",
      problemTitle: "Warum der Sommer eine andere Strategie braucht",
      problemBody: "<p>Der nordische Sommer ist einzigartig. Nach Monaten Dunkelheit und Kälte explodiert das Licht – und Haut, die Winter gewohnt ist, trifft plötzlich starke UV während der längsten Tage. Im Juni kann Stockholm über 18 Stunden Sonne haben. Wunderbar für die Seele, anspruchsvoll für die Haut.</p><p>Mehr UV triggert Melanin, freie Radikale und DNA-Schäden in Hautzellen. Die Haut reagiert mit mehr Talg, Schweiß und veränderter Barriere. Was im Winter perfekt war, wirkt plötzlich zu schwer, verstopft Poren und löst Ausbrüche aus.</p><p>Dazu das Mythos-Bräune-gleich-gesund. Sonnenbrand ist Stressreaktion der Haut – Hilferuf, kein Gesundheitszeichen. Im Norden sind wir nach lichtarmem Winter und blasser Haut besonders verwundbar. Sommer verlangt Respekt, Anpassung und leichtere Routine, die schützt ohne zu wiegen.</p>",
      tipsTitle: "Kluge Sommer-Hautpflege im Norden",
      tips: [
        { title: "Zu leichteren Produkten wechseln", body: "Winteröle können in Hitze zu schwer wirken. Leichte Seren als Basis, Öl nur nachts zur Reparatur. Tagsüber atmen lassen." },
        { title: "Lichtschutz ist Pflicht", body: "Jeden Morgen, egal wie das Wetter. UV dringt durch Wolken. Alle zwei Stunden neu auftragen draußen, nach Schwimmen oder Schwitzen sofort." },
        { title: "Abends gründlich reinigen", body: "Lichtschutz, Schweiß und mehr Talg brauchen abends gründliche, milde Reinigung. Doppelreinigung ist im Juli und August Gold wert." },
        { title: "Nach der Sonne feuchten", body: "Sonne entwässert auch ohne Sonnenbrand. Beruhigende, feuchtigkeitsspendende Pflege nach sonnigen Tagen. TA-DA Serum wirkt leicht und unterstützend." },
        { title: "Schutz von innen", body: "Antioxidantien über Ernährung – Beeren, Gemüse, Obst – stärken die Haut gegen UV-induzierte Radikale. Der schwedische Sommer liefert reichlich." }
      ],
      solutionTitle: "Leichte CBD-Routine für nordischen Sommer",
      solutionBody: "<p>Der Sommer will Leichtigkeit. TA-DA Serum mit CBG ist der perfekte Sommerschritt: leicht genug für Hitze, aktiv genug für Erneuerung und Beruhigung der UV-bedingten Entzündung.</p><p>Au Naturel ist ein starker Sommer-Reiniger – mild nach schweißtreibenden Tagen ohne Barriere-Stress, effektiv gegen Lichtschutz und extra Talg in der Hitze. Reinigt, ohne auszulaugen.</p><p>Abends kannst du das CBD-Öl aus dem DUO-kit für tiefere Nahrung in der nächtlichen Reparatur dazunehmen. Tags leicht, nachts nährend – Rhythmus, der den Tageszyklen der Haut folgt.</p>",
      faq: [
        { q: "Muss ich die Routine im Sommer ändern?", a: "Ja, die meisten sollten anpassen: leichtere Produkte tags, Fokus Lichtschutz, gründlichere Abendreinigung. Bei mehr Temperatur und UV ändern sich die Bedürfnisse." },
        { q: "CBD-Öl in der Sonne?", a: "CBD-Öl ersetzt keinen Lichtschutz; bekannte Risiken bei Kombination mit Sonne gibt es nicht. SPF wie gewohnt, CBD-Öl eher abends." },
        { q: "Warum bekomme ich im Sommer Pickel?", a: "Mehr Talg, Schweiß und schwere Sonnencremes können Poren verstopfen. Gründliche, milde Abendreinigung und leichte Tags-Pflege helfen. TA-DA Serum ist leicht genug, um nicht zu verschlimmern." },
        { q: "Ist nordische Sonne wirklich so stark?", a: "Ja. Juni und Juli erreicht der UV-Index in Schweden oft mediterrane Werte. Plus lange Tage und helle Haut nach dem Winter – anspruchsvoll für die Haut." }
      ],
      ctaTitle: "Gib deiner Haut einen klugen Sommer",
      ctaSub: "Nordischer Sommer verlangt leichte, schützende Pflege. TA-DA Serum und Au Naturel halten die Balance in den hellen Monaten."
    },
    fr: {
      metaTitle: "Soin de la peau en été – protéger et équilibrer sous le soleil nordique | 1753",
      metaDescription: "Été nordique : longues journées et soleil fort exigent des soins adaptés. Routine CBD légère qui protège sans alourdir. 1753 SKINCARE.",
      kicker: "Soin de la peau en été",
      h1: "Soin de la peau en été – le paradoxe du soleil dans le Nord",
      lead: "L'été suédois est magique – et un défi pour la peau. Journées longues, UV intense et chaleur bougent les repères. Ta routine d'hiver ne colle plus, et c'est naturel.",
      problemTitle: "Pourquoi l'été impose une autre stratégie",
      problemBody: "<p>L'été nordique est singulier. Après des mois de noir et de froid, la lumière explose – et la peau, habituée à l'hiver, affronte soudain un UV fort pendant les jours les plus longs. En juin, Stockholm peut dépasser 18 heures de soleil. Bon pour le moral, exigeant pour la peau.</p><p>Plus d'UV déclenche mélanine, radicaux libres et dommages à l'ADN. La peau répond avec plus de sébum, de sueur et une barrière modifiée. Ce qui allait bien en hiver peut soudain peser, boucher les pores et provoquer des poussées.</p><p>Le mythe du bronzage = santé persiste. Coup de soleil = stress cutané – appel à l'aide, pas signe de vitalité. Dans le Nord, après l'hiver clair et la peau pâle sans défense mélaninique montée, on est vulnérables. L'été veut respect, adaptation et routine plus légère qui protège sans étouffer.</p>",
      tipsTitle: "Soins d'été malins dans le Nord",
      tips: [
        { title: "Passe au plus léger", body: "Les huiles d'hiver peuvent suffoquer sous la chaleur. Base en sérum léger, huile seulement la nuit pour la réparation. Laisse respirer le jour." },
        { title: "SPF non négociable", body: "Chaque matin, quel que soit le ciel. Les UV traversent les nuages. Réapplication toutes les deux heures dehors, tout de suite après bain ou sueur." },
        { title: "Nettoie à fond le soir", body: "SPF, sueur et sébum en hausse demandent un démaquillage sérieux mais doux. Le double nettoyage vaut de l'or en juillet-août." },
        { title: "Hydrate après soleil", body: "Le soleil déshydrate même sans coup de soleil. Après les journées dehors, soins apaisants et hydratants. TA-DA Serum soutient sans effet lourd." },
        { title: "Protège de l'intérieur", body: "Antioxydants via l'alimentation – baies, légumes, fruits – renforcent la peau face aux radicaux créés par les UV. L'été suédois regorge d'aliments riches en antioxydants." }
      ],
      solutionTitle: "Routine CBD légère pour l'été nordique",
      solutionBody: "<p>L'été appelle à alléger. TA-DA Serum au CBG est l'étape idéale : assez léger pour ne pas étouffer sous la chaleur, assez actif pour le renouvellement et calmer l'inflammation induite par le soleil.</p><p>Au Naturel brille en nettoyant d'été – doux après des journées de sueur sans casser la barrière, efficace sur SPF et sébum supplémentaire de la chaleur. Nettoie sans appauvrir.</p><p>Le soir, ajoute l'huile CBD du DUO-kit pour nourrir pendant la réparation nocturne. Jour léger, nuit nourrissante – un rythme qui suit les besoins de la peau sur 24 h.</p>",
      faq: [
        { q: "Je dois changer ma routine en été ?", a: "Oui, la plupart gagnent à adapter : textures plus légères le jour, SPF sérieux, démaquillage plus minutieux le soir. Température et UV modifient les besoins." },
        { q: "Huile CBD au soleil ?", a: "L'huile CBD ne remplace pas le SPF ; pas de risque connu à combiner CBD et soleil. SPF comme d'habitude, huile plutôt le soir." },
        { q: "Pourquoi des boutons en été ?", a: "Plus de sébum, sueur et écrans solaires épais peuvent boucher les pores. Démaquillage du soir doux mais complet et soins légers le jour aident. TA-DA Serum reste léger." },
        { q: "Le soleil nordique est vraiment si fort ?", a: "Oui. En juin-juillet, l'indice UV en Suède rivalise souvent avec la Méditerranée. Ajoute journées longues et peau pâle après l'hiver : période exigeante pour la peau." }
      ],
      ctaTitle: "Offre à ta peau un été malin",
      ctaSub: "L'été nordique veut des soins légers et protecteurs. TA-DA Serum et Au Naturel gardent l'équilibre pendant les mois lumineux."
    }
  }
];
