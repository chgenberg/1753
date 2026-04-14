import type { LandingPage } from "./types";

export const EU_CITY_PAGES: LandingPage[] = [
  // ──────────────────────────────────────────────
  // NORDIC (excluding Sweden)
  // ──────────────────────────────────────────────
  {
    svSlug: "hudvard-kopenhamn",
    enSlug: "skincare-copenhagen",
    esSlug: "cuidado-piel-cbd-copenhagen",
    deSlug: "cbd-hautpflege-copenhagen",
    frSlug: "soin-peau-cbd-copenhagen",
    category: "stad",
    productIds: ["duo-kit", "ta-da-serum", "au-naturel-makeup-remover"],
    sv: {
      metaTitle: "Hudvård Köpenhamn – CBD-hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i Köpenhamn. Beställ online med fri frakt över €60. Skydda din hud mot det danska kustklimatet.",
      kicker: "Hudvård i Köpenhamn",
      h1: "Naturlig hudvård för dig i Köpenhamn",
      lead: "Köpenhamns unika mix av havsvind, cykelkultur och skandinavisk mörker ger din hud unika utmaningar. Beställ online – fri frakt över €60, leverans inom 2–4 arbetsdagar.",
      problemTitle: "Köpenhamnshudens utmaningar",
      problemBody: "<p>Köpenhamn är en stad i ständig kontakt med havet. Vinden från Öresund bär med sig salt och fukt som torkar ut huden när den avdunstar. Som Europas mest cykelintensiva stad spenderar köpenhamnare timmar i den öppna luften – vind, regn och kyla mot ett oskyddat ansikte, dag efter dag.</p><p>Danska vintrar är mörka och fuktiga. Bristen på solljus från november till mars innebär utbredd D-vitaminbrist, vilket direkt påverkar hudens immunförsvar och läkningsförmåga. Inomhus är luften torr från uppvärmning, och den snabba växlingen mellan kall fukt ute och torr värme inne stressar hudbarriären.</p><p>Köpenhamns kranvatten är dessutom mycket hårt – bland det hårdaste i Norden – och kalkavlagringar kan irritera känslig hud vid varje tvätt.</p>",
      tipsTitle: "Hudvårdstips för köpenhamnare",
      tips: [
        { title: "Skydda ansiktet på cykeln", body: "Du cyklar förmodligen till jobbet varje dag. Applicera en skyddande olja innan du sätter dig på cykeln – särskilt under de blåsiga månaderna oktober till april." },
        { title: "Investera i ett vattenfilter", body: "Köpenhamns hårda vatten belastar huden. Ett enkelt filter på duschmunstycket kan göra stor skillnad för känslig hud." },
        { title: "Utnyttja hygge-kulturen", body: "Stresshantering är hudvård inifrån. Danskt hygge – ljus, ro, socialt umgänge – sänker kortisol och gynnar huden." },
        { title: "Promenera längs Langelinie", body: "Frisk havsluft i lagom dos ger mineraler och sänker stressnivåer. Håll det kort och återfukta efteråt." },
        { title: "Ät den nordiska kosten", body: "Sill, råg, rotfrukter och fermenterade mejeriprodukter ger omega-3 och probiotika som stödjer huden inifrån." }
      ],
      solutionTitle: "CBD-hudvård levererad till Köpenhamn",
      solutionBody: "<p>1753 SKINCARE skickar från Sverige – de flesta beställningar når Köpenhamn inom 2–4 arbetsdagar. Fri frakt på beställningar över €60.</p><p>Vår DUO-kit med The ONE och I LOVE ger din hud den balans som Köpenhamns klimat kräver. CBD och CBG stärker hudbarriären mot vind, salt och temperaturväxlingar. TA-DA Serum ger extra skydd under de mörka vintermånaderna, och Au Naturel Makeup Remover rengör bort dagens smuts utan att stressa huden.</p>",
      faq: [
        { q: "Levererar ni till Danmark?", a: "Ja, vi skickar från Sverige och de flesta beställningar når Köpenhamn inom 2–4 arbetsdagar. Fri frakt över €60." },
        { q: "Är CBD-hudvård lagligt i Danmark?", a: "Ja, CBD i hudvårdsprodukter är fullt lagligt i Danmark och hela EU." },
        { q: "Vilken produkt passar bäst för Köpenhamns klimat?", a: "DUO-kit ger en bra bas. Komplettera med TA-DA Serum under vintern för extra barriärskydd mot vind och kyla." },
        { q: "Kan jag returnera produkter?", a: "Ja, vi har 30 dagars öppet köp. Kontakta oss så löser vi det." }
      ],
      ctaTitle: "Ge din hud det danska klimatet kräver",
      ctaSub: "Naturlig CBD-hudvård från Sverige till Köpenhamn. Fri frakt över €60."
    },
    en: {
      metaTitle: "Skincare Copenhagen – CBD skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Copenhagen. Order online with free shipping over €60. Protect your skin from Danish coastal winds and dark Scandinavian winters.",
      kicker: "Skincare in Copenhagen",
      h1: "Natural skincare for Copenhagen",
      lead: "Copenhagen's unique mix of sea wind, cycling culture, and Scandinavian darkness gives your skin challenges found nowhere else. Order online – free shipping over €60, delivered within 2–4 business days.",
      problemTitle: "What Copenhagen does to your skin",
      problemBody: "<p>Copenhagen is a city in constant contact with the sea. Wind from the Øresund carries salt and moisture that dries out the skin as it evaporates. As Europe's most cycle-intensive city, Copenhageners spend hours exposed to the elements – wind, rain, and cold against an unprotected face, day after day.</p><p>Danish winters are dark and damp. The lack of sunlight from November to March means widespread vitamin D deficiency, which directly affects the skin's immune response and healing capacity. Indoors, the air is dry from heating, and the rapid shift between cold humidity outside and dry warmth inside stresses the skin barrier constantly.</p><p>Copenhagen's tap water is also extremely hard – among the hardest in Scandinavia – and calcium deposits can irritate sensitive skin with every wash.</p>",
      tipsTitle: "Skincare tips for Copenhageners",
      tips: [
        { title: "Protect your face on the bike", body: "You probably cycle to work every day. Apply a protective oil before getting on your bike – especially during the windy months from October to April." },
        { title: "Invest in a water filter", body: "Copenhagen's hard water takes a toll on the skin. A simple shower filter can make a significant difference for sensitive skin." },
        { title: "Embrace hygge culture", body: "Stress management is skincare from within. Danish hygge – candles, calm, social connection – lowers cortisol and benefits your skin." },
        { title: "Walk along Langelinie", body: "Fresh sea air in moderate doses provides minerals and lowers stress levels. Keep it short and moisturize afterward." },
        { title: "Eat the Nordic diet", body: "Herring, rye, root vegetables, and fermented dairy provide omega-3s and probiotics that support your skin from within." }
      ],
      solutionTitle: "CBD skincare delivered to Copenhagen",
      solutionBody: "<p>1753 SKINCARE ships from Sweden – most orders reach Copenhagen within 2–4 business days. Free shipping on orders over €60.</p><p>Our DUO-kit with The ONE and I LOVE gives your skin the balance Copenhagen's climate demands. CBD and CBG strengthen the skin barrier against wind, salt, and temperature shifts. TA-DA Serum provides extra protection during the dark winter months, and Au Naturel Makeup Remover cleans away the day's grime without stressing the skin.</p>",
      faq: [
        { q: "Do you ship to Denmark?", a: "Yes, we ship from Sweden and most orders reach Copenhagen within 2–4 business days. Free shipping over €60." },
        { q: "Is CBD skincare legal in Denmark?", a: "Yes, CBD in skincare products is fully legal in Denmark and throughout the EU." },
        { q: "Which product is best for Copenhagen's climate?", a: "The DUO-kit provides a great base. Add TA-DA Serum in winter for extra barrier protection against wind and cold." },
        { q: "Can I return products?", a: "Yes, we offer a 30-day return policy. Contact us and we'll sort it out." }
      ],
      ctaTitle: "Give your skin what Copenhagen's climate demands",
      ctaSub: "Natural CBD skincare from Sweden to Copenhagen. Free shipping over €60."
    },
    es: {
      metaTitle: "Cuidado de la piel Copenhague – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Copenhague. Pide online, envío gratis desde 50 €. Protege tu piel del viento costero danés y de los inviernos oscuros escandinavos.",
      kicker: "Cuidado de la piel en Copenhague",
      h1: "Cosmética natural para Copenhague",
      lead: "La mezcla singular de Copenhague – viento del mar, cultura ciclista y oscuridad nórdica – plantea retos de piel que no encontrarás en otro sitio. Pide online: envío gratis desde 50 €, entrega en 2–4 días laborables.",
      problemTitle: "Lo que Copenhague le hace a tu piel",
      problemBody: "<p>Copenhague vive pegada al mar. El viento del Øresund arrastra sal y humedad que, al evaporarse, resecan la piel. Como ciudad donde se pedalea más que casi ninguna en Europa, pasas horas a la intemperie – viento, lluvia y frío en la cara, día tras día.</p><p>Los inviernos daneses son oscuros y húmedos. De noviembre a marzo casi no hay sol: carencia generalizada de vitamina D, con efecto directo en inmunidad y capacidad de reparación de la piel. En interiores el aire se seca con la calefacción, y el salto entre frío húmedo fuera y calor seco dentro castiga la barrera sin descanso.</p><p>El agua del grifo en Copenhague es además muy dura – de las más duras de Escandinavia – y el calcio puede irritar la piel sensible en cada lavado.</p>",
      tipsTitle: "Consejos para quien pedalea (y vive) en Copenhague",
      tips: [
        { title: "Protege el rostro en bici", body: "Seguro que vas al trabajo en bicicleta. Aplica aceite protector antes de montar – sobre todo de octubre a abril, cuando más sopla." },
        { title: "Invierte en filtro de agua", body: "El agua dura castiga la piel. Un filtro sencillo en la ducha marca diferencia si tu piel es sensible." },
        { title: "Aprovecha el hygge", body: "Gestionar el estrés es cuidar la piel por dentro. Velas, calma, compañía – lo danés llama hygge, baja el cortisol y se nota en el cutis." },
        { title: "Paseo por Langelinie", body: "Aire marino en dosis cortas aporta minerales y baja el estrés. No te quedes horas; hidrata después." },
        { title: "Dieta nórdica", body: "Arenque, centeno, tubérculos y lácteos fermentados: omega-3 y probióticos que apoyan la piel desde dentro." }
      ],
      solutionTitle: "Cosmética con CBD con entrega en Copenhague",
      solutionBody: "<p>1753 SKINCARE envía desde Suecia; la mayoría de pedidos llegan a Copenhague en 2–4 días laborables. Envío gratis desde 50 €.</p><p>Nuestro DUO-kit con The ONE y I LOVE equilibra la piel frente al clima de la ciudad. CBD y CBG refuerzan la barrera contra viento, sal y cambios de temperatura. TA-DA Serum da refuerzo en los meses de invierno más oscuros, y Au Naturel Makeup Remover limpia el día sin castigar más la piel.</p>",
      faq: [
        { q: "¿Envían a Dinamarca?", a: "Sí, desde Suecia; en general 2–4 días laborables hasta Copenhague. Envío gratis desde 50 €." },
        { q: "¿La cosmética con CBD es legal en Dinamarca?", a: "Sí, el CBD en productos de cuidado de la piel es plenamente legal en Dinamarca y en la UE." },
        { q: "¿Qué producto encaja mejor con el clima de Copenhague?", a: "El DUO-kit como base. En invierno suma TA-DA Serum para protección extra de barrera frente a viento y frío." },
        { q: "¿Puedo devolver productos?", a: "Sí, 30 días. Escríbenos y lo resolvemos." }
      ],
      ctaTitle: "Dale a tu piel lo que el clima de Copenhague exige",
      ctaSub: "Cosmética natural con CBD de Suecia a Copenhague. Envío gratis desde 50 €."
    },
    de: {
      metaTitle: "Hautpflege Kopenhagen – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für Kopenhagen. Online bestellen, ab 50 € versandkostenfrei. Schutz vor dänischem Küstenwind und dunklen skandinavischen Wintern.",
      kicker: "Hautpflege in Kopenhagen",
      h1: "Natürliche Hautpflege für Kopenhagen",
      lead: "Kopenhagens Mix aus Seewind, Fahrradkultur und skandinavischer Dunkelheit stellt deine Haut vor Herausforderungen, die es so kaum woanders gibt. Online bestellen – ab 50 € versandkostenfrei, Lieferung in 2–4 Werktagen.",
      problemTitle: "Was Kopenhagen mit deiner Haut macht",
      problemBody: "<p>Kopenhagen lebt am Wasser. Wind vom Øresund trägt Salz und Feuchtigkeit, die beim Verdunsten die Haut austrocknen. Als eine der fahrradintensivsten Städte Europas bist du stundenlang den Elementen ausgesetzt – Wind, Regen, Kälte im Gesicht, Tag für Tag.</p><p>Dänische Winter sind dunkel und feucht. Von November bis März fehlt Sonnenlicht – weit verbreiteter Vitamin-D-Mangel, der Immunantwort und Heilung der Haut direkt beeinträchtigt. Drinnen trocknet die Heizungsluft die Haut, und der Wechsel zwischen feuchter Kälte draußen und trockener Wärme drinnen strapaziert die Barriere ständig.</p><p>Kopenhagens Leitungswasser ist extrem hart – mit das härteste in Skandinavien – und Kalk kann bei jedem Waschen empfindliche Haut reizen.</p>",
      tipsTitle: "Hautpflege-Tipps für Kopenhagen",
      tips: [
        { title: "Gesicht auf dem Rad schützen", body: "Du fährst vermutlich täglich zur Arbeit. Schutzöl vor der Fahrt – besonders von Oktober bis April." },
        { title: "Wasser filtern", body: "Hartes Wasser belastet die Haut. Ein einfacher Duschfilter kann für sensible Haut viel ausmachen." },
        { title: "Hygge ernst nehmen", body: "Stressmanagement ist Hautpflege von innen. Dänisches Hygge – Kerzen, Ruhe, Gemeinschaft – senkt Cortisol und tut der Haut gut." },
        { title: "Langelinie", body: "Meeresluft in Maßen liefert Mineralien und senkt Stress. Kurz bleiben, danach eincremen." },
        { title: "Nordische Küche", body: "Hering, Roggen, Wurzelgemüse, fermentierte Milchprodukte – Omega-3 und Probiotika für die Haut von innen." }
      ],
      solutionTitle: "CBD-Hautpflege nach Kopenhagen",
      solutionBody: "<p>1753 SKINCARE versendet aus Schweden – die meisten Bestellungen sind in 2–4 Werktagen in Kopenhagen. Ab 50 € versandkostenfrei.</p><p>Unser DUO-kit mit The ONE und I LOVE gibt deiner Haut das Gleichgewicht, das Kopenhagens Klima verlangt. CBD und CBG stärken die Barriere gegen Wind, Salz und Temperaturwechsel. TA-DA Serum gibt in den dunklen Wintermonaten Extra-Schutz, Au Naturel Makeup Remover entfernt den Alltag schonend.</p>",
      faq: [
        { q: "Liefert ihr nach Dänemark?", a: "Ja, aus Schweden, meist 2–4 Werktage bis Kopenhagen. Ab 50 € versandkostenfrei." },
        { q: "Ist CBD-Hautpflege in Dänemark legal?", a: "Ja, CBD in Hautpflegeprodukten ist in Dänemark und in der EU vollständig legal." },
        { q: "Welches Produkt passt zu Kopenhagens Klima?", a: "Das DUO-kit als Basis. Im Winter TA-DA Serum für extra Barrierenschutz gegen Wind und Kälte." },
        { q: "Kann ich zurücksenden?", a: "Ja, 30 Tage Rückgaberecht. Melde dich bei uns." }
      ],
      ctaTitle: "Gib deiner Haut, was Kopenhagens Klima verlangt",
      ctaSub: "Natürliche CBD-Pflege von Schweden nach Kopenhagen. Ab 50 € versandkostenfrei."
    },
    fr: {
      metaTitle: "Soin du visage Copenhague – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Copenhague. Commande en ligne, livraison offerte dès 50 €. Protège ta peau du vent côtier danois et des hivers nordiques sombres.",
      kicker: "Soins à Copenhague",
      h1: "Soins naturels pour Copenhague",
      lead: "Le cocktail copenhagueois – vent de mer, vélo au quotidien et noir scandinave – crée des défis cutanés introuvables ailleurs. Commande en ligne : livraison offerte dès 50 €, 2–4 jours ouvrés.",
      problemTitle: "Ce que Copenhague fait à ta peau",
      problemBody: "<p>Copenhague vit au contact permanent de la mer. Le vent de l’Øresund charrie sel et humidité qui, en s’évaporant, assèchent la peau. Ville parmi les plus « vélo » d’Europe, tu passes des heures dehors – vent, pluie et froid au visage, jour après jour.</p><p>Les hivers danois sont sombres et humides. De novembre à mars, peu de soleil : carence en vitamine D généralisée, avec impact direct sur immunité et réparation cutanée. À l’intérieur, l’air chauffé sèche ; le passage brut entre humidité froide dehors et chaleur sèche dedans martyrise la barrière.</p><p>L’eau du robinet est très dure – parmi les plus dures du Nord – et le calcaire peut irriter les peaux sensibles à chaque lavage.</p>",
      tipsTitle: "Conseils peau pour Copenhague",
      tips: [
        { title: "Protège le visage à vélo", body: "Tu roules sûrement au boulot tous les jours. Huile protectrice avant de partir – surtout d’octobre à avril." },
        { title: "Filtre à eau", body: "L’eau dure use la peau. Un filtre de douche simple change la donne pour les peaux sensibles." },
        { title: "Embrasse le hygge", body: "Gérer le stress, c’est soigner la peau de l’intérieur. Bougies, calme, lien social – le hygge danois fait baisser le cortisol." },
        { title: "Balade à Langelinie", body: "Air marin modéré : minéraux et baisse de stress. Court, puis hydrate." },
        { title: "Assiette nordique", body: "Hareng, seigle, légumes racines, produits laitiers fermentés – oméga-3 et probiotiques pour la peau." }
      ],
      solutionTitle: "Soins au CBD livrés à Copenhague",
      solutionBody: "<p>1753 SKINCARE expédie depuis la Suède ; la plupart des commandes arrivent à Copenhague en 2–4 jours ouvrés. Livraison offerte dès 50 €.</p><p>Notre DUO-kit avec The ONE et I LOVE rééquilibre la peau face au climat local. CBD et CBG renforcent la barrière contre vent, sel et variations thermiques. TA-DA Serum renforce pendant les mois d’hiver les plus sombres ; Au Naturel Makeup Remover nettoie la journée sans agresser.</p>",
      faq: [
        { q: "Livrez-vous au Danemark ?", a: "Oui, depuis la Suède, en général 2–4 jours ouvrés jusqu’à Copenhague. Livraison offerte dès 50 €." },
        { q: "Les soins au CBD sont-ils légaux au Danemark ?", a: "Oui, le CBD dans les produits de soin est entièrement légal au Danemark et dans l’UE." },
        { q: "Quel produit pour le climat de Copenhague ?", a: "Le DUO-kit en base. En hiver, ajoute TA-DA Serum pour une barrière renforcée contre vent et froid." },
        { q: "Puis-je retourner les produits ?", a: "Oui, 30 jours. Contacte-nous." }
      ],
      ctaTitle: "Offre à ta peau ce que le climat de Copenhague exige",
      ctaSub: "Soins naturels au CBD de la Suède à Copenhague. Livraison offerte dès 50 €."
    }
  },
  {
    svSlug: "hudvard-oslo",
    enSlug: "skincare-oslo",
    esSlug: "cuidado-piel-cbd-oslo",
    deSlug: "cbd-hautpflege-oslo",
    frSlug: "soin-peau-cbd-oslo",
    category: "stad",
    productIds: ["duo-kit", "ta-da-serum", "fungtastic-mushroom-extract"],
    sv: {
      metaTitle: "Hudvård Oslo – CBD-hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i Oslo. Beställ online med fri frakt över €60. Skydda din hud mot norska vintrar och fjordklimatet.",
      kicker: "Hudvård i Oslo",
      h1: "Naturlig hudvård för dig i Oslo",
      lead: "Oslo ligger inklämt mellan fjorden och skogarna – vackert men tufft för huden. Extrema temperaturskillnader, torr fjällvind och Norges mörkaste månader utmanar din hudbarriär. Fri frakt över €60.",
      problemTitle: "Oslohudens utmaningar",
      problemBody: "<p>Oslo har ett av Nordens mest extrema klimat för stadsbor. Vintrarna bjuder på temperaturer ned mot minus tjugo, medan somrarna kan nå trettio grader. Den snabba växlingen mellan årstiderna – och mellan iskall uteluft och övervärmd inomhusmiljö – ger huden aldrig chans att anpassa sig.</p><p>Den norska huvudstaden omges av skog, men stadsluften är inte alltid ren. Vintermånaderna skapar inversioner där kall luft fångar partiklar och avgaser nära marken, särskilt i centrala Oslo. E18:s trafikstråk genom staden bidrar med partiklar som belastar huden dagligen.</p><p>Mörkerperioden är lång – från november till februari får Oslo bara några timmar dagsljus. D-vitaminbristen påverkar hudens läkningsförmåga, och många upplever torrare och gråare hy under vintern.</p>",
      tipsTitle: "Hudvårdstips för oslobor",
      tips: [
        { title: "Ta med hudvård till hytta", body: "Norrmän älskar sina hytteturer, men torr fjälluft och braskaminer suger fukt ur huden. Ta med en rik olja för kvällarna." },
        { title: "Utnyttja bastukulturen", body: "Oslos växande bastukultur vid fjorden är fantastisk för huden – svettningen renar. Återfukta alltid efteråt." },
        { title: "Promenera i Nordmarka", body: "Skogsbad sänker kortisol. Nordmarkas granskogar ger ren luft och lugn – bra för hud och sinne." },
        { title: "Ät norsk fisk", body: "Lax, makrill och sill ger omega-3 som stärker hudbarriären inifrån. Norge har världens bästa tillgång – utnyttja det." },
        { title: "D-vitamin är nödvändigt", body: "Under mörkerperioden behöver de flesta oslobor tillskott. D-vitamin påverkar hudens immunförsvar direkt." }
      ],
      solutionTitle: "CBD-hudvård levererad till Oslo",
      solutionBody: "<p>Vi skickar från Sverige – de flesta beställningar når Oslo inom 2–4 arbetsdagar. Fri frakt över €60.</p><p>DUO-kit med The ONE och I LOVE ger oslohudens barriär det stöd den behöver mot extrema temperaturväxlingar. TA-DA Serum med koncentrerad CBG är perfekt för de iskalla vintermånaderna. Fungtastic Mushroom Extract stärker immunförsvaret inifrån – extra viktigt under den mörka norska vintern.</p>",
      faq: [
        { q: "Levererar ni till Norge?", a: "Ja, vi skickar från Sverige och når Oslo inom 2–4 arbetsdagar. Fri frakt över €60." },
        { q: "Är CBD-hudvård lagligt i Norge?", a: "Ja, CBD i hudvårdsprodukter är lagligt i Norge." },
        { q: "Vilken produkt passar Oslos klimat bäst?", a: "DUO-kit som bas, TA-DA Serum för vintern, och Fungtastic för immunförsvaret under mörkerperioden." },
        { q: "Hur lång tid tar leveransen?", a: "Normalt 2–4 arbetsdagar från Sverige till Oslo." }
      ],
      ctaTitle: "Ge din hud det norska klimatet kräver",
      ctaSub: "Naturlig CBD-hudvård från Sverige till Oslo. Fri frakt över €60."
    },
    en: {
      metaTitle: "Skincare Oslo – CBD skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Oslo. Order online with free shipping over €60. Protect your skin from harsh Norwegian winters and fjord climate extremes.",
      kicker: "Skincare in Oslo",
      h1: "Natural skincare for Oslo",
      lead: "Oslo sits wedged between the fjord and the forests – beautiful but brutal on the skin. Extreme temperature swings, dry mountain wind, and Norway's darkest months challenge your skin barrier year-round. Free shipping over €60.",
      problemTitle: "What Oslo does to your skin",
      problemBody: "<p>Oslo has one of the most extreme climates in Scandinavia for city dwellers. Winters bring temperatures down to minus twenty, while summers can reach thirty degrees. The rapid shift between seasons – and between freezing outdoor air and overheated indoor spaces – never gives the skin a chance to adapt.</p><p>The Norwegian capital is surrounded by forest, but city air is not always clean. Winter months create inversions where cold air traps particles and exhaust near the ground, especially in central Oslo. The E18 traffic corridor through the city contributes particles that stress the skin daily.</p><p>The dark period is long – from November to February, Oslo gets only a few hours of daylight. Vitamin D deficiency affects the skin's healing capacity, and many experience drier, duller complexions during winter.</p>",
      tipsTitle: "Skincare tips for Osloites",
      tips: [
        { title: "Bring skincare to the cabin", body: "Norwegians love their hytte trips, but dry mountain air and wood stoves suck moisture from the skin. Pack a rich oil for the evenings." },
        { title: "Embrace the sauna culture", body: "Oslo's growing fjord-side sauna culture is fantastic for the skin – sweating purifies. Always moisturize afterward." },
        { title: "Walk in Nordmarka", body: "Forest bathing lowers cortisol. Nordmarka's spruce forests offer clean air and calm – good for skin and mind." },
        { title: "Eat Norwegian fish", body: "Salmon, mackerel, and herring provide omega-3s that strengthen the skin barrier from within. Norway has the world's best supply – use it." },
        { title: "Vitamin D is essential", body: "During the dark period, most Oslo residents need supplements. Vitamin D directly affects the skin's immune response." }
      ],
      solutionTitle: "CBD skincare delivered to Oslo",
      solutionBody: "<p>We ship from Sweden – most orders reach Oslo within 2–4 business days. Free shipping on orders over €60.</p><p>The DUO-kit with The ONE and I LOVE gives Oslo skin the barrier support it needs against extreme temperature swings. TA-DA Serum with concentrated CBG is perfect for the freezing winter months. Fungtastic Mushroom Extract strengthens immunity from within – extra important during the dark Norwegian winter.</p>",
      faq: [
        { q: "Do you ship to Norway?", a: "Yes, we ship from Sweden and most orders reach Oslo within 2–4 business days. Free shipping over €60." },
        { q: "Is CBD skincare legal in Norway?", a: "Yes, CBD in skincare products is legal in Norway." },
        { q: "Which product is best for Oslo's climate?", a: "The DUO-kit as a base, TA-DA Serum for winter, and Fungtastic for immunity during the dark period." },
        { q: "How long does shipping take?", a: "Typically 2–4 business days from Sweden to Oslo." }
      ],
      ctaTitle: "Give your skin what Norway's climate demands",
      ctaSub: "Natural CBD skincare from Sweden to Oslo. Free shipping over €60."
    },
    es: {
      metaTitle: "Cuidado de la piel Oslo – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Oslo. Pide online, envío gratis desde 50 €. Protege tu piel de los inviernos noruegos y del clima extremo del fiordo.",
      kicker: "Cuidado de la piel en Oslo",
      h1: "Cosmética natural para Oslo",
      lead: "Oslo, atrapada entre el fiordo y el bosque: preciosa, dura con la piel. Saltos térmicos brutales, viento seco de montaña y los meses más oscuros de Noruega ponen a prueba tu barrera todo el año. Envío gratis desde 50 €.",
      problemTitle: "Lo que Oslo le hace a tu piel",
      problemBody: "<p>Oslo tiene uno de los climas más extremos de Escandinavia para quien vive en ciudad. Inviernos que bajan de veinte bajo cero; veranos que rozan los treinta. Los cambios bruscos de estación – y entre aire gélido fuera y calor seco dentro – no dejan a la piel adaptarse.</p><p>La capital está rodeada de bosque, pero el aire urbano no siempre es limpio. En invierno las inversiones térmicas atrapan partículas y gases cerca del suelo, sobre todo en el centro. El corredor del E18 aporta partículas que cargan la piel cada día.</p><p>La oscuridad se alarga: de noviembre a febrero apenas hay luz diurna. La falta de vitamina D afecta la capacidad de recuperación; muchos notan piel más seca y apagada en invierno.</p>",
      tipsTitle: "Consejos para quien vive en Oslo",
      tips: [
        { title: "Lleva buen cuidado a la hytte", body: "Los noruegos aman la cabaña, pero el aire seco de montaña y la estufa de leña chupan humedad. Un aceite rico por la noche en la maleta." },
        { title: "Sauna junto al fiordo", body: "La sauna a orillas del fiordo limpia a base de sudor; hidrata siempre después." },
        { title: "Paseo en Nordmarka", body: "Baño de bosque: menos cortisol. Abetos, aire limpio – bien para piel y cabeza." },
        { title: "Pescado noruego", body: "Salmón, caballa y arenque: omega-3 para la barrera desde dentro. Noruega tiene de lo mejor; úsalo." },
        { title: "Vitamina D obligatoria", body: "En la oscuridad polar casi todo Oslo necesita suplementos. La D afecta directamente la respuesta inmune de la piel." }
      ],
      solutionTitle: "Cosmética con CBD con entrega en Oslo",
      solutionBody: "<p>Enviamos desde Suecia; la mayoría de pedidos llegan a Oslo en 2–4 días laborables. Envío gratis desde 50 €.</p><p>El DUO-kit con The ONE y I LOVE da a la piel en Oslo el apoyo de barrera frente a los saltos térmicos. TA-DA Serum con CBG concentrado encaja en los meses más gélidos. Fungtastic Mushroom Extract refuerza la inmunidad por dentro – clave en el invierno oscuro noruego.</p>",
      faq: [
        { q: "¿Envían a Noruega?", a: "Sí, desde Suecia; en general 2–4 días laborables hasta Oslo. Envío gratis desde 50 €." },
        { q: "¿La cosmética con CBD es legal en Noruega?", a: "Sí, el CBD en productos de cuidado de la piel es legal en Noruega." },
        { q: "¿Qué producto para el clima de Oslo?", a: "DUO-kit como base, TA-DA Serum en invierno y Fungtastic para apoyo inmunitario en la época oscura." },
        { q: "¿Cuánto tarda el envío?", a: "Normalmente 2–4 días laborables desde Suecia hasta Oslo." }
      ],
      ctaTitle: "Dale a tu piel lo que el clima noruego exige",
      ctaSub: "Cosmética natural con CBD de Suecia a Oslo. Envío gratis desde 50 €."
    },
    de: {
      metaTitle: "Hautpflege Oslo – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für Oslo. Online bestellen, ab 50 € versandkostenfrei. Schutz vor norwegischen Wintern und Fjord-Extremklima.",
      kicker: "Hautpflege in Oslo",
      h1: "Natürliche Hautpflege für Oslo",
      lead: "Oslo zwischen Fjord und Wald – wunderschön, aber brutal für die Haut. Extreme Temperatursprünge, trockener Bergwind und Norwegens dunkelste Monate fordern die Barriere das ganze Jahr. Ab 50 € versandkostenfrei.",
      problemTitle: "Was Oslo mit deiner Haut macht",
      problemBody: "<p>Oslo hat eines der extremsten skandinavischen Stadtklimata. Winter bis minus zwanzig, Sommer bis dreißig Grad. Schnelle Jahreszeitenwechsel – und zwischen eisiger Außenluft und überheizter Innenluft – geben der Haut keine Anpassungszeit.</p><p>Die Hauptstadt liegt im Wald, aber die Stadtluft ist nicht immer sauber. Winter-Inversionen halten Partikel und Abgase bodennah, besonders zentral. Der E18-Verkehrskorridor liefert täglich Partikelbelastung für die Haut.</p><p>Die dunkle Phase ist lang – von November bis Februar nur wenige Tageslichtstunden. Vitamin-D-Mangel beeinträchtigt die Heilungsfähigkeit; viele haben im Winter trockeneren, matteren Teint.</p>",
      tipsTitle: "Hautpflege-Tipps für Oslo",
      tips: [
        { title: "Pflege zur Hütte mitnehmen", body: "Norweger lieben Hytten, aber trockene Bergluft und Kaminöfen ziehen Feuchtigkeit. Reichhaltiges Öl für die Abende einpacken." },
        { title: "Fjord-Sauna", body: "Wachsende Saunakultur am Fjord – Schwitzen reinigt. Danach immer eincremen." },
        { title: "Nordmarka", body: "Waldbaden senkt Cortisol. Fichtenwald, saubere Luft – gut für Haut und Kopf." },
        { title: "Norwegischer Fisch", body: "Lachs, Makrele, Hering – Omega-3 für die Barriere von innen. Norwegen hat die beste Basis." },
        { title: "Vitamin D Pflicht", body: "In der dunklen Phase brauchen die meisten Oslo-Bewohner Supplemente. D wirkt direkt auf die Immunantwort der Haut." }
      ],
      solutionTitle: "CBD-Hautpflege nach Oslo",
      solutionBody: "<p>Wir versenden aus Schweden – meist 2–4 Werktage bis Oslo. Ab 50 € versandkostenfrei.</p><p>Das DUO-kit mit The ONE und I LOVE gibt Oslo-Haut Barrieren-Support gegen extreme Temperaturwechsel. TA-DA Serum mit konzentriertem CBG passt zu den frostigen Wintermonaten. Fungtastic Mushroom Extract stärkt die Immunität von innen – wichtig im dunklen norwegischen Winter.</p>",
      faq: [
        { q: "Liefert ihr nach Norwegen?", a: "Ja, aus Schweden, meist 2–4 Werktage bis Oslo. Ab 50 € versandkostenfrei." },
        { q: "Ist CBD-Hautpflege in Norwegen legal?", a: "Ja, CBD in Hautpflegeprodukten ist in Norwegen legal." },
        { q: "Welches Produkt für Oslos Klima?", a: "DUO-kit als Basis, TA-DA Serum im Winter, Fungtastic für Immunität in der dunklen Zeit." },
        { q: "Wie lange dauert der Versand?", a: "Typisch 2–4 Werktage von Schweden nach Oslo." }
      ],
      ctaTitle: "Gib deiner Haut, was Norwegens Klima verlangt",
      ctaSub: "Natürliche CBD-Pflege von Schweden nach Oslo. Ab 50 € versandkostenfrei."
    },
    fr: {
      metaTitle: "Soin du visage Oslo – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Oslo. Commande en ligne, livraison offerte dès 50 €. Protège ta peau des hivers norvégiens et des extrêmes du fjord.",
      kicker: "Soins à Oslo",
      h1: "Soins naturels pour Oslo",
      lead: "Oslo coincée entre le fjord et la forêt : magnifique, impitoyable pour la peau. Écarts thermiques violents, vent sec de montagne et les mois les plus sombres de Norvège éprouvent ta barrière toute l’année. Livraison offerte dès 50 €.",
      problemTitle: "Ce qu’Oslo fait à ta peau",
      problemBody: "<p>Oslo affiche l’un des climats les plus extrêmes de Scandinavie pour une capitale. Hivers vers moins vingt ; étés vers trente degrés. Les bascules brutales de saison – et entre air glacé dehors et chaleur sèche dedans – ne laissent pas la peau s’habituer.</p><p>La capitale est ceinturée de forêt, mais l’air urbain n’est pas toujours propre. Les inversions hivernales piègent particules et gaz près du sol, surtout au centre. Le couloir de l’E18 ajoute une charge quotidienne pour la peau.</p><p>La nuit polaire s’étire : de novembre à février, quelques heures de jour seulement. Le manque de vitamine D touche la réparation ; beaucoup constatent un teint plus sec et terne en hiver.</p>",
      tipsTitle: "Conseils peau pour Oslo",
      tips: [
        { title: "Skincare en cabane", body: "Les Norvégiens adorent la hytte, mais l’air sec de montagne et le poêle à bois aspirent l’humidité. Un huile riche le soir dans le sac." },
        { title: "Sauna fjord", body: "La culture sauna au bord du fjord purifie à la sueur ; hydrate toujours après." },
        { title: "Nordmarka", body: "Bain de forêt : moins de cortisol. Épicéas, air pur – bon pour peau et moral." },
        { title: "Poisson norvégien", body: "Saumon, maquereau, hareng : oméga-3 pour la barrière de l’intérieur. La Norvège a le meilleur approvisionnement." },
        { title: "Vitamine D non négociable", body: "Pendant la période noire, la plupart des Osloïtes ont besoin de compléments. La D agit directement sur l’immunité cutanée." }
      ],
      solutionTitle: "Soins au CBD livrés à Oslo",
      solutionBody: "<p>On expédie depuis la Suède ; la plupart des commandes arrivent à Oslo en 2–4 jours ouvrés. Livraison offerte dès 50 €.</p><p>Le DUO-kit avec The ONE et I LOVE soutient la barrière face aux écarts thermiques. TA-DA Serum au CBG concentré convient aux mois les plus glacés. Fungtastic Mushroom Extract renforce l’immunité de l’intérieur – crucial pendant l’hiver noir norvégien.</p>",
      faq: [
        { q: "Livrez-vous en Norvège ?", a: "Oui, depuis la Suède, en général 2–4 jours ouvrés jusqu’à Oslo. Livraison offerte dès 50 €." },
        { q: "Les soins au CBD sont-ils légaux en Norvège ?", a: "Oui, le CBD dans les produits de soin est légal en Norvège." },
        { q: "Quel produit pour le climat d’Oslo ?", a: "DUO-kit en base, TA-DA Serum en hiver, Fungtastic pour l’immunité pendant la période sombre." },
        { q: "Délai de livraison ?", a: "En général 2–4 jours ouvrés de la Suède à Oslo." }
      ],
      ctaTitle: "Offre à ta peau ce que le climat norvégien exige",
      ctaSub: "Soins naturels au CBD de la Suède à Oslo. Livraison offerte dès 50 €."
    }
  },
  {
    svSlug: "hudvard-helsingfors",
    enSlug: "skincare-helsinki",
    esSlug: "cuidado-piel-cbd-helsinki",
    deSlug: "cbd-hautpflege-helsinki",
    frSlug: "soin-peau-cbd-helsinki",
    category: "stad",
    productIds: ["duo-kit", "ta-da-serum", "fungtastic-mushroom-extract"],
    sv: {
      metaTitle: "Hudvård Helsingfors – CBD-hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i Helsingfors. Beställ online med fri frakt över €60. Skydda din hud mot finska vintrar och Östersjöklimatet.",
      kicker: "Hudvård i Helsingfors",
      h1: "Naturlig hudvård för dig i Helsingfors",
      lead: "Helsingfors vintrar är bland de hårdaste i EU. Månader av mörker, temperaturer långt under noll och torr inomhusluft utmanar din hud dagligen. Fri frakt över €60, leverans inom 3–5 arbetsdagar.",
      problemTitle: "Helsingforshudens utmaningar",
      problemBody: "<p>Helsingfors ligger vid Finska viken och utsätts för Östersjöns bistra vindar. Vintrarna är långa och mörka – från november till mars dominerar mörker och temperaturer som regelbundet faller under minus femton. Den extrema kylan dränerar huden på fukt, och den torra inomhusluften i finska lägenheter förvärrar torkan ytterligare.</p><p>Bastukulturen är en del av det finska DNA:t, och det är fantastiskt – men snabba temperaturväxlingar från hundra grader i bastun till kall luft utomhus stressar hudbarriären. Finsk kranvatten är mjukt, vilket är bra, men D-vitaminbristen under den extremt långa vintern är en av de värsta i Europa.</p>",
      tipsTitle: "Hudvårdstips för helsingforsbor",
      tips: [
        { title: "Återfukta efter bastun", body: "Bastu öppnar porer och renar, men torkar ut. Applicera en rik olja direkt efter – huden absorberar den bättre när den är varm." },
        { title: "D-vitamin från oktober", body: "Börja med tillskott redan i oktober. Finska vintern ger i princip noll UV-exponering under fem månader." },
        { title: "Promenera i Esplanadi", body: "Frisk Östersjöluft och grönska sänker stressnivåer. Kort promenad, stor effekt." },
        { title: "Ät finsk superkost", body: "Blåbär, havtorn, rågbröd och fet fisk – Finland har superfood i överflöd som stödjer huden inifrån." },
        { title: "Skydda huden i kylan", body: "Under minus tio grader fryser fukten på huden bokstavligen. En skyddande olja är nödvändig innan du går ut." }
      ],
      solutionTitle: "CBD-hudvård levererad till Helsingfors",
      solutionBody: "<p>Vi skickar från Sverige – leverans till Helsingfors inom 3–5 arbetsdagar. Fri frakt över €60.</p><p>DUO-kit ger den finska huden barriärskydd mot extrema temperaturväxlingar. TA-DA Serum med CBG är oumbärligt under de iskalla månaderna. Fungtastic Mushroom Extract stärker immunförsvaret – och finländare vet redan att svampar är kraftfulla.</p>",
      faq: [
        { q: "Levererar ni till Finland?", a: "Ja, vi skickar från Sverige och når Helsingfors inom 3–5 arbetsdagar. Fri frakt över €60." },
        { q: "Är CBD-hudvård lagligt i Finland?", a: "Ja, CBD i hudvårdsprodukter är fullt lagligt i Finland och hela EU." },
        { q: "Vilken produkt för finska vintrar?", a: "TA-DA Serum är ett måste under de kallaste månaderna. Komplettera med DUO-kit som daglig bas." },
        { q: "Hur lång tid tar leveransen?", a: "3–5 arbetsdagar från Sverige till Helsingfors." }
      ],
      ctaTitle: "Ge din hud det finska klimatet kräver",
      ctaSub: "Naturlig CBD-hudvård från Sverige till Helsingfors. Fri frakt över €60."
    },
    en: {
      metaTitle: "Skincare Helsinki – CBD skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Helsinki. Order online with free shipping over €60. Protect your skin from harsh Finnish winters and extreme cold.",
      kicker: "Skincare in Helsinki",
      h1: "Natural skincare for Helsinki",
      lead: "Helsinki winters are among the harshest in the EU. Months of darkness, temperatures far below zero, and bone-dry indoor air challenge your skin daily. Free shipping over €60, delivered within 3–5 business days.",
      problemTitle: "What Helsinki does to your skin",
      problemBody: "<p>Helsinki sits on the Gulf of Finland, exposed to bitter Baltic Sea winds. Winters are long and dark – from November to March, darkness dominates and temperatures regularly drop below minus fifteen. The extreme cold drains moisture from the skin, and the dry indoor air in Finnish apartments makes the dehydration worse.</p><p>Sauna culture is part of Finnish DNA, and it's wonderful – but rapid temperature shifts from a hundred degrees in the sauna to cold outdoor air stress the skin barrier. Finnish tap water is soft, which is good, but the vitamin D deficiency during the extremely long winter is among the worst in Europe.</p>",
      tipsTitle: "Skincare tips for Helsinki residents",
      tips: [
        { title: "Moisturize after sauna", body: "Sauna opens pores and purifies, but dehydrates. Apply a rich oil right after – your skin absorbs it better when warm." },
        { title: "Start vitamin D in October", body: "Begin supplements as early as October. Finnish winter provides essentially zero UV exposure for five months." },
        { title: "Walk along Esplanadi", body: "Fresh Baltic air and greenery lower stress levels. Short walk, big impact." },
        { title: "Eat Finnish superfoods", body: "Bilberries, sea buckthorn, rye bread, and fatty fish – Finland has an abundance of superfoods that support your skin from within." },
        { title: "Protect your skin in the cold", body: "Below minus ten, moisture on the skin literally freezes. A protective oil is essential before stepping outside." }
      ],
      solutionTitle: "CBD skincare delivered to Helsinki",
      solutionBody: "<p>We ship from Sweden – delivery to Helsinki within 3–5 business days. Free shipping on orders over €60.</p><p>The DUO-kit gives Finnish skin the barrier protection it needs against extreme temperature swings. TA-DA Serum with CBG is indispensable during the freezing months. Fungtastic Mushroom Extract strengthens immunity – and Finns already know that mushrooms are powerful.</p>",
      faq: [
        { q: "Do you ship to Finland?", a: "Yes, we ship from Sweden and most orders reach Helsinki within 3–5 business days. Free shipping over €60." },
        { q: "Is CBD skincare legal in Finland?", a: "Yes, CBD in skincare products is fully legal in Finland and throughout the EU." },
        { q: "Which product for Finnish winters?", a: "TA-DA Serum is a must during the coldest months. Complement with the DUO-kit as your daily base." },
        { q: "How long does shipping take?", a: "3–5 business days from Sweden to Helsinki." }
      ],
      ctaTitle: "Give your skin what Finnish winters demand",
      ctaSub: "Natural CBD skincare from Sweden to Helsinki. Free shipping over €60."
    },
    es: {
      metaTitle: "Cuidado de la piel Helsinki – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Helsinki. Pide online, envío gratis desde 50 €. Protege tu piel de los inviernos finlandeses y del frío extremo.",
      kicker: "Cuidado de la piel en Helsinki",
      h1: "Cosmética natural para Helsinki",
      lead: "Los inviernos de Helsinki están entre los más duros de la UE. Meses de oscuridad, temperaturas muy bajo cero y aire interior que reseca ponen a prueba tu piel cada día. Envío gratis desde 50 €; entrega en 3–5 días laborables.",
      problemTitle: "Lo que Helsinki le hace a tu piel",
      problemBody: "<p>Helsinki mira al golfo de Finlandia, expuesta a vientos bálticos crudos. Inviernos largos y oscuros: de noviembre a marzo domina la penumbra y las temperaturas suelen caer por debajo de quince bajo cero. El frío extremo drena humedad de la piel y el aire seco de los pisos finlandeses lo empeora.</p><p>La sauna es parte del ADN finlandés – maravilloso – pero pasar de cien grados en la sauna al aire frío de la calle tensiona la barrera. El agua del grifo es muy blanda, eso ayuda, pero la carencia de vitamina D en un invierno tan largo es de las peores de Europa.</p>",
      tipsTitle: "Consejos para quien vive en Helsinki",
      tips: [
        { title: "Hidrata tras la sauna", body: "La sauna abre y limpia pero también deshidrata. Aceite rico justo después: la piel caliente lo absorbe mejor." },
        { title: "Vitamina D desde octubre", body: "Empieza suplementos pronto. El invierno finlandés casi no da UV durante unos cinco meses." },
        { title: "Paseo por Esplanadi", body: "Aire del báltico y verde bajan el estrés. Corto pero efectivo." },
        { title: "Superalimentos locales", body: "Arándanos, espino amarillo, pan de centeno y pescado graso – Finlandia lo tiene en abundancia para la piel desde dentro." },
        { title: "Aceite antes de salir al frío", body: "Por debajo de diez bajo cero la humedad de la superficie puede helarse. Aceite protector antes de abrir la puerta." }
      ],
      solutionTitle: "Cosmética con CBD con entrega en Helsinki",
      solutionBody: "<p>Enviamos desde Suecia; la entrega a Helsinki suele tardar 3–5 días laborables. Envío gratis desde 50 €.</p><p>El DUO-kit da a la piel finlandesa la protección de barrera frente a cambios térmicos extremos. TA-DA Serum con CBG es imprescindible en los meses más gélidos. Fungtastic Mushroom Extract refuerza la inmunidad – y en Finlandia ya saben que los hongos son potentes.</p>",
      faq: [
        { q: "¿Envían a Finlandia?", a: "Sí, desde Suecia; en general 3–5 días laborables hasta Helsinki. Envío gratis desde 50 €." },
        { q: "¿La cosmética con CBD es legal en Finlandia?", a: "Sí, el CBD en productos de cuidado de la piel es plenamente legal en Finlandia y en la UE." },
        { q: "¿Qué producto para inviernos finlandeses?", a: "TA-DA Serum es clave en los meses más fríos. Combina con DUO-kit como base diaria." },
        { q: "¿Cuánto tarda el envío?", a: "3–5 días laborables de Suecia a Helsinki." }
      ],
      ctaTitle: "Dale a tu piel lo que el invierno finlandés exige",
      ctaSub: "Cosmética natural con CBD de Suecia a Helsinki. Envío gratis desde 50 €."
    },
    de: {
      metaTitle: "Hautpflege Helsinki – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für Helsinki. Online bestellen, ab 50 € versandkostenfrei. Schutz vor finnischen Wintern und extremer Kälte.",
      kicker: "Hautpflege in Helsinki",
      h1: "Natürliche Hautpflege für Helsinki",
      lead: "Helsinki-Wintern gehören zu den härtesten in der EU. Monate der Dunkelheit, Temperaturen weit unter null und knochentrockene Innenluft fordern täglich deine Haut. Ab 50 € versandkostenfrei, Lieferung in 3–5 Werktagen.",
      problemTitle: "Was Helsinki mit deiner Haut macht",
      problemBody: "<p>Helsinki liegt am Finnischen Meerbusen, exponiert für raue Ostseewinde. Winter sind lang und dunkel – von November bis März dominiert Finsternis, Temperaturen regelmäßig unter minus fünfzehn. Extreme Kälte zieht Feuchtigkeit aus der Haut, trockene Luft in finnischen Wohnungen verschärft die Dehydrierung.</p><p>Saunakultur ist finnisches DNA – großartig – aber schnelle Wechsel von hundert Grad in der Sauna zu kalter Außenluft stressen die Barriere. Leitungswasser ist weich, das ist gut, aber Vitamin-D-Mangel im extrem langen Winter gehört zu Europas schlimmsten.</p>",
      tipsTitle: "Hautpflege-Tipps für Helsinki",
      tips: [
        { title: "Nach Sauna eincremen", body: "Sauna öffnet und reinigt, trocknet aber aus. Reichhaltiges Öl direkt danach – warme Haut nimmt es besser auf." },
        { title: "Vitamin D ab Oktober", body: "Supplemente früh starten. Finnischer Winter liefert fünf Monate praktisch keine UV-Exposition." },
        { title: "Esplanadi", body: "Frische Ostseeluft und Grün senken Stress. Kurzer Spaziergang, große Wirkung." },
        { title: "Finnische Superfoods", body: "Heidelbeeren, Sanddorn, Roggenbrot, fetter Fisch – reichlich vorhanden für die Haut von innen." },
        { title: "Öl vor dem Rausgehen", body: "Unter minus zehn kann Feuchtigkeit auf der Haut gefrieren. Schutzöl vor der Tür ist Pflicht." }
      ],
      solutionTitle: "CBD-Hautpflege nach Helsinki",
      solutionBody: "<p>Wir versenden aus Schweden – Lieferung nach Helsinki in 3–5 Werktagen. Ab 50 € versandkostenfrei.</p><p>Das DUO-kit gibt finnischer Haut Barrierenschutz gegen extreme Temperaturwechsel. TA-DA Serum mit CBG ist in den frostigen Monaten unverzichtbar. Fungtastic Mushroom Extract stärkt die Immunität – und Finnen wissen, dass Pilze stark sind.</p>",
      faq: [
        { q: "Liefert ihr nach Finnland?", a: "Ja, aus Schweden, meist 3–5 Werktage bis Helsinki. Ab 50 € versandkostenfrei." },
        { q: "Ist CBD-Hautpflege in Finnland legal?", a: "Ja, CBD in Hautpflegeprodukten ist in Finnland und in der EU vollständig legal." },
        { q: "Welches Produkt für finnische Winter?", a: "TA-DA Serum in den kältesten Monaten ein Muss. Ergänze mit DUO-kit als tägliche Basis." },
        { q: "Wie lange dauert der Versand?", a: "3–5 Werktage von Schweden nach Helsinki." }
      ],
      ctaTitle: "Gib deiner Haut, was finnische Winter verlangen",
      ctaSub: "Natürliche CBD-Pflege von Schweden nach Helsinki. Ab 50 € versandkostenfrei."
    },
    fr: {
      metaTitle: "Soin du visage Helsinki – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Helsinki. Commande en ligne, livraison offerte dès 50 €. Protège ta peau des hivers finlandais et du froid extrême.",
      kicker: "Soins à Helsinki",
      h1: "Soins naturels pour Helsinki",
      lead: "Les hivers d’Helsinki comptent parmi les plus rudes de l’UE. Mois de noirceur, températures très sous zéro et air intérieur ultra sec éprouvent ta peau au quotidien. Livraison offerte dès 50 €, 3–5 jours ouvrés.",
      problemTitle: "Ce qu’Helsinki fait à ta peau",
      problemBody: "<p>Helsinki borde le golfe de Finlande, exposée aux vents baltes mordants. Hivers longs et sombres : de novembre à mars règnent pénombre et grands froids, souvent sous moins quinze. Le froid extrême draine l’humidité de la peau, et l’air sec des appartements finlandais aggrave la déshydratation.</p><p>La culture du sauna fait partie de l’ADN finlandais – formidable – mais le passage brutal de la chaleur du sauna au froid dehors tend la barrière. L’eau du robinet est très douce, ce qui aide, mais la carence en vitamine D pendant un hiver aussi long figure parmi les pires d’Europe.</p>",
      tipsTitle: "Conseils peau pour Helsinki",
      tips: [
        { title: "Hydrate après le sauna", body: "Le sauna ouvre et purifie mais déshydrate aussi. Une huile riche tout de suite après : la peau tiède l’absorbe mieux." },
        { title: "Vitamine D dès octobre", body: "Commence les compléments tôt. L’hiver finlandais offre quasiment zéro UV pendant cinq mois." },
        { title: "Esplanadi", body: "Air de la Baltique et verdure : baisse du stress. Courte marche, gros effet." },
        { title: "Superaliments finlandais", body: "Myrtilles, argousier, pain de seigle, poisson gras – la Finlande regorge de ce qu’il faut pour la peau de l’intérieur." },
        { title: "Huile avant de sortir", body: "Sous moins dix, l’humidité en surface peut geler. Huile barrière avant d’ouvrir la porte." }
      ],
      solutionTitle: "Soins au CBD livrés à Helsinki",
      solutionBody: "<p>On expédie depuis la Suède ; livraison à Helsinki en 3–5 jours ouvrés en général. Livraison offerte dès 50 €.</p><p>Le DUO-kit donne à la peau finlandaise la protection barrière face aux chocs thermiques. TA-DA Serum au CBG est indispensable pendant les mois les plus froids. Fungtastic Mushroom Extract renforce l’immunité – et les Finlandais savent déjà la puissance des champignons.</p>",
      faq: [
        { q: "Livrez-vous en Finlande ?", a: "Oui, depuis la Suède, en général 3–5 jours ouvrés jusqu’à Helsinki. Livraison offerte dès 50 €." },
        { q: "Les soins au CBD sont-ils légaux en Finlande ?", a: "Oui, le CBD dans les produits de soin est entièrement légal en Finlande et dans l’UE." },
        { q: "Quel produit pour les hivers finlandais ?", a: "TA-DA Serum est indispensable les mois les plus froids. Complète avec le DUO-kit en base quotidienne." },
        { q: "Délai de livraison ?", a: "3–5 jours ouvrés de la Suède à Helsinki." }
      ],
      ctaTitle: "Offre à ta peau ce que l’hiver finlandais exige",
      ctaSub: "Soins naturels au CBD de la Suède à Helsinki. Livraison offerte dès 50 €."
    }
  },
  {
    svSlug: "hudvard-reykjavik",
    enSlug: "skincare-reykjavik",
    esSlug: "cuidado-piel-cbd-reykjavik",
    deSlug: "cbd-hautpflege-reykjavik",
    frSlug: "soin-peau-cbd-reykjavik",
    category: "stad",
    productIds: ["duo-ta-da", "duo-kit", "fungtastic-mushroom-extract"],
    sv: {
      metaTitle: "Hudvård Reykjavik – CBD-hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i Reykjavik. Beställ online med fri frakt över €60. Skydda din hud mot Islands extrema klimat.",
      kicker: "Hudvård i Reykjavik",
      h1: "Naturlig hudvård för dig i Reykjavik",
      lead: "Reykjavik har Europas mest extrema klimat – hård vind, vulkanisk luft, mörker och kyla testar din hud varje dag. Fri frakt över €60.",
      problemTitle: "Reykjavikhudens utmaningar",
      problemBody: "<p>Islands huvudstad utsätts för väder som ingen annan europeisk stad upplever. Vinden är konstant och ofta våldsam – genomsnittliga vindhastigheter är bland de högsta i Europa. Vulkanisk aktivitet tillför svavel och fina partiklar till luften, och geotermisk energi innebär att vattnet ofta luktar svavel.</p><p>Vintrarna är mörka men inte lika kalla som man tror – Golfströmmen håller temperaturen runt noll. Men vinden gör att det känns mycket kallare, och den konstanta blåsten dränerar huden på fukt effektivare än ren kyla. Islands vatten är extremt mjukt och rent, men den geotermiska uppvärmningen ger en unik inomhusmiljö.</p>",
      tipsTitle: "Hudvårdstips för reykjavikbor",
      tips: [
        { title: "Vindskydda ansiktet alltid", body: "Islands vind är hudens värsta fiende. En rik olja som barriär innan du går ut är obligatoriskt – året runt." },
        { title: "Utnyttja de geotermiska baden", body: "Blue Lagoon och lokala hotpots ger mineraler som silika och svavel som kan gynna huden. Återfukta efteråt." },
        { title: "D-vitamin hela vintern", body: "Reykjavik har extremt kort dagsljus november–februari. D-vitamintillskott är absolut nödvändigt." },
        { title: "Ät isländsk skyr och fisk", body: "Skyr ger probiotika, och isländsk fisk är bland världens renaste. Omega-3 i varje måltid." },
        { title: "Applicera olja före sömn", body: "Nattetid reparerar huden sig – ge den bästa förutsättningarna med en rik nattrutin." }
      ],
      solutionTitle: "CBD-hudvård levererad till Island",
      solutionBody: "<p>Vi skickar från Sverige – leverans till Reykjavik inom 5–7 arbetsdagar. Fri frakt över €60.</p><p>DUO TA-DA med koncentrerade oljor ger maximal barriär mot Islands extrema vind. DUO-kit stärker och balanserar. Fungtastic Mushroom Extract stödjer immunförsvaret under de mörkaste månaderna.</p>",
      faq: [
        { q: "Levererar ni till Island?", a: "Ja, leverans till Reykjavik inom 5–7 arbetsdagar. Fri frakt över €60." },
        { q: "Är CBD-hudvård lagligt på Island?", a: "Ja, CBD i hudvårdsprodukter är lagligt på Island." },
        { q: "Vilken produkt mot Islands vind?", a: "DUO TA-DA ger den rikaste barriären mot vindtorka. Använd dagligen." },
        { q: "Hur lång tid tar leveransen?", a: "5–7 arbetsdagar från Sverige till Reykjavik." }
      ],
      ctaTitle: "Ge din hud det Islands klimat kräver",
      ctaSub: "Naturlig CBD-hudvård från Sverige till Reykjavik. Fri frakt över €60."
    },
    en: {
      metaTitle: "Skincare Reykjavik – CBD skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Reykjavik. Order online with free shipping over €60. Protect your skin from Iceland's extreme wind, volcanic air, and dark winters.",
      kicker: "Skincare in Reykjavik",
      h1: "Natural skincare for Reykjavik",
      lead: "Reykjavik has Europe's most extreme climate – relentless wind, volcanic air, darkness, and cold test your skin every single day. Free shipping over €60.",
      problemTitle: "What Reykjavik does to your skin",
      problemBody: "<p>Iceland's capital faces weather no other European city experiences. The wind is constant and often violent – average wind speeds are among the highest in Europe. Volcanic activity adds sulfur and fine particles to the air, and geothermal energy means the water often smells of sulfur.</p><p>Winters are dark but not as cold as you might think – the Gulf Stream keeps temperatures around zero. But the wind makes it feel much colder, and the constant blowing strips moisture from the skin more effectively than pure cold. Iceland's water is extremely soft and clean, but the geothermal heating creates a unique indoor environment.</p>",
      tipsTitle: "Skincare tips for Reykjavik residents",
      tips: [
        { title: "Wind-proof your face always", body: "Iceland's wind is your skin's worst enemy. A rich oil as a barrier before going out is mandatory – year-round." },
        { title: "Use the geothermal pools", body: "The Blue Lagoon and local hot pots provide minerals like silica and sulfur that can benefit the skin. Moisturize afterward." },
        { title: "Vitamin D all winter", body: "Reykjavik has extremely short daylight from November to February. Vitamin D supplements are absolutely essential." },
        { title: "Eat Icelandic skyr and fish", body: "Skyr provides probiotics, and Icelandic fish is among the purest in the world. Omega-3s in every meal." },
        { title: "Apply oil before sleep", body: "Nighttime is when your skin repairs itself – give it the best conditions with a rich evening routine." }
      ],
      solutionTitle: "CBD skincare delivered to Iceland",
      solutionBody: "<p>We ship from Sweden – delivery to Reykjavik within 5–7 business days. Free shipping on orders over €60.</p><p>DUO TA-DA with concentrated oils provides maximum barrier protection against Iceland's extreme wind. The DUO-kit strengthens and balances. Fungtastic Mushroom Extract supports immunity during the darkest months.</p>",
      faq: [
        { q: "Do you ship to Iceland?", a: "Yes, delivery to Reykjavik within 5–7 business days. Free shipping over €60." },
        { q: "Is CBD skincare legal in Iceland?", a: "Yes, CBD in skincare products is legal in Iceland." },
        { q: "Which product for Iceland's wind?", a: "DUO TA-DA provides the richest barrier against wind dehydration. Use it daily." },
        { q: "How long does shipping take?", a: "5–7 business days from Sweden to Reykjavik." }
      ],
      ctaTitle: "Give your skin what Iceland's climate demands",
      ctaSub: "Natural CBD skincare from Sweden to Reykjavik. Free shipping over €60."
    },
    es: {
      metaTitle: "Cuidado de la piel Reikiavik – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Reikiavik. Pide online, envío gratis desde 50 €. Protege tu piel del viento extremo, el aire volcánico y los inviernos oscuros de Islandia.",
      kicker: "Cuidado de la piel en Reikiavik",
      h1: "Cosmética natural para Reikiavik",
      lead: "Reikiavik tiene el clima más extremo de Europa: viento sin tregua, aire volcánico, oscuridad y frío que ponen a prueba tu piel cada día. Envío gratis desde 50 €.",
      problemTitle: "Lo que Reikiavik le hace a tu piel",
      problemBody: "<p>La capital islandesa vive un tiempo que casi ninguna otra ciudad europea conoce. El viento es constante y a menudo violento – entre las velocidades medias más altas del continente. La actividad volcánica añade azufre y partículas finas al aire, y la energía geotérmica hace que el agua a veces huela a azufre.</p><p>Los inviernos son oscuros pero no tan gélidos como imaginas: la corriente del Golfo mantiene temperaturas cercanas a cero. El viento, en cambio, hace que lo sientas mucho más frío, y el soplo continuo arrea humedad de la piel mejor que el frío seco. El agua islandesa es extremadamente blanda y limpia, pero la calefacción geotérmica crea un ambiente interior singular.</p>",
      tipsTitle: "Consejos para quien vive en Reikiavik",
      tips: [
        { title: "Cara a prueba de viento, siempre", body: "El viento islandés es el peor enemigo de la piel. Aceite denso como barrera antes de salir – todo el año." },
        { title: "Piscinas geotérmicas", body: "Blue Lagoon y hot pots locales aportan minerales como sílice y azufre que pueden beneficiar la piel. Hidrata después." },
        { title: "Vitamina D todo el invierno", body: "De noviembre a febrero casi no hay luz. Los suplementos son obligatorios." },
        { title: "Skyr y pescado islandés", body: "El skyr aporta probióticos; el pescado islandés está entre los más limpios del planeta. Omega-3 en cada comida que puedas." },
        { title: "Aceite antes de dormir", body: "La piel se repara de noche – dale una rutina nocturna generosa." }
      ],
      solutionTitle: "Cosmética con CBD con entrega en Islandia",
      solutionBody: "<p>Enviamos desde Suecia; la entrega a Reikiavik suele tardar 5–7 días laborables. Envío gratis desde 50 €.</p><p>DUO TA-DA con aceites concentrados ofrece la barrera más rica frente al viento extremo. El DUO-kit equilibra y refuerza. Fungtastic Mushroom Extract apoya la inmunidad en los meses más oscuros.</p>",
      faq: [
        { q: "¿Envían a Islandia?", a: "Sí, a Reikiavik en 5–7 días laborables en general. Envío gratis desde 50 €." },
        { q: "¿La cosmética con CBD es legal en Islandia?", a: "Sí, el CBD en productos de cuidado de la piel es legal en Islandia." },
        { q: "¿Qué producto para el viento islandés?", a: "DUO TA-DA da la barrera más nutritiva contra la deshidratación por viento. Úsalo a diario." },
        { q: "¿Cuánto tarda el envío?", a: "5–7 días laborables de Suecia a Reikiavik." }
      ],
      ctaTitle: "Dale a tu piel lo que el clima islandés exige",
      ctaSub: "Cosmética natural con CBD de Suecia a Reikiavik. Envío gratis desde 50 €."
    },
    de: {
      metaTitle: "Hautpflege Reykjavik – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für Reykjavik. Online bestellen, ab 50 € versandkostenfrei. Schutz vor isländischem Extremwind, vulkanischer Luft und dunklen Wintern.",
      kicker: "Hautpflege in Reykjavik",
      h1: "Natürliche Hautpflege für Reykjavik",
      lead: "Reykjavik hat Europas extremstes Klima – ständiger Wind, vulkanische Luft, Dunkelheit und Kälte testen deine Haut jeden Tag. Ab 50 € versandkostenfrei.",
      problemTitle: "Was Reykjavik mit deiner Haut macht",
      problemBody: "<p>Islands Hauptstadt erlebt Wetter, das kaum eine andere europäische Stadt kennt. Der Wind ist konstant und oft heftig – zu den höchsten Durchschnittsgeschwindigkeiten in Europa. Vulkanische Aktivität bringt Schwefel und Feinstaub in die Luft, geothermische Energie lässt Wasser oft nach Schwefel riechen.</p><p>Winter sind dunkel, aber nicht so kalt wie gedacht – der Golfstrom hält Temperaturen um null. Wind lässt es viel kälter wirken, und ständiges Wehen entzieht der Haut Feuchtigkeit effektiver als reine Kälte. Isländisches Wasser ist extrem weich und sauber, aber geothermische Heizung schafft ein besonderes Innenklima.</p>",
      tipsTitle: "Hautpflege-Tipps für Reykjavik",
      tips: [
        { title: "Gesicht immer windfest", body: "Isländischer Wind ist der Hautfeind Nummer eins. Reichhaltiges Öl als Barriere vor dem Rausgehen – ganzjährig Pflicht." },
        { title: "Geothermische Pools", body: "Blue Lagoon und lokale Hot Pots liefern Mineralien wie Kieselsäure und Schwefel. Danach eincremen." },
        { title: "Vitamin D den ganzen Winter", body: "November bis Februar extrem wenig Tageslicht. Supplemente sind essenziell." },
        { title: "Isländischer Skyr und Fisch", body: "Skyr liefert Probiotika, isländischer Fisch gehört zu den saubersten der Welt. Omega-3 wo möglich." },
        { title: "Öl vor dem Schlaf", body: "Nachts repariert die Haut – reichhaltige Abendroutine gibt beste Bedingungen." }
      ],
      solutionTitle: "CBD-Hautpflege nach Island",
      solutionBody: "<p>Versand aus Schweden – Lieferung nach Reykjavik in 5–7 Werktagen. Ab 50 € versandkostenfrei.</p><p>DUO TA-DA mit konzentrierten Ölen gibt maximale Barrieren-Schutz gegen isländischen Extremwind. Das DUO-kit stärkt und balanciert. Fungtastic Mushroom Extract unterstützt die Immunität in den dunkelsten Monaten.</p>",
      faq: [
        { q: "Liefert ihr nach Island?", a: "Ja, nach Reykjavik in 5–7 Werktagen. Ab 50 € versandkostenfrei." },
        { q: "Ist CBD-Hautpflege in Island legal?", a: "Ja, CBD in Hautpflegeprodukten ist in Island legal." },
        { q: "Welches Produkt gegen isländischen Wind?", a: "DUO TA-DA liefert die reichhaltigste Barriere gegen Wind-Austrocknung. Täglich nutzen." },
        { q: "Wie lange dauert der Versand?", a: "5–7 Werktage von Schweden nach Reykjavik." }
      ],
      ctaTitle: "Gib deiner Haut, was Islands Klima verlangt",
      ctaSub: "Natürliche CBD-Pflege von Schweden nach Reykjavik. Ab 50 € versandkostenfrei."
    },
    fr: {
      metaTitle: "Soin du visage Reykjavik – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Reykjavik. Commande en ligne, livraison offerte dès 50 €. Protège ta peau du vent extrême, de l’air volcanique et des hivers sombres d’Islande.",
      kicker: "Soins à Reykjavik",
      h1: "Soins naturels pour Reykjavik",
      lead: "Reykjavik affiche le climat le plus extrême d’Europe : vent tenace, air volcanique, noirceur et froid qui testent ta peau chaque jour. Livraison offerte dès 50 €.",
      problemTitle: "Ce que Reykjavik fait à ta peau",
      problemBody: "<p>La capitale islandaise subit un temps que peu d’autres villes européennes connaissent. Le vent est constant et souvent violent – parmi les vitesses moyennes les plus élevées du continent. L’activité volcanique ajoute soufre et particules fines ; l’énergie géothermique fait parfois sentir l’eau à l’œuf pourri.</p><p>Les hivers sont sombres mais moins glacés qu’on ne croit – le Gulf Stream tient les températures autour de zéro. Le vent rend la sensation bien plus froide, et le souffle continu arrache l’humidité à la peau plus efficacement que le froid sec. L’eau islandaise est ultra douce et propre, mais le chauffage géothermique crée un intérieur particulier.</p>",
      tipsTitle: "Conseils peau pour Reykjavik",
      tips: [
        { title: "Visage pare-vent, toujours", body: "Le vent islandais est l’ennemi numéro un de la peau. Huile riche en barrière avant de sortir – toute l’année." },
        { title: "Bains géothermiques", body: "Blue Lagoon et hot pots locaux : minéraux comme silice et soufre. Hydrate après." },
        { title: "Vitamine D tout l’hiver", body: "De novembre à février, quasi pas de jour. Compléments indispensables." },
        { title: "Skyr et poisson islandais", body: "Le skyr apporte des probiotiques ; le poisson islandais compte parmi les plus purs. Oméga-3 souvent." },
        { title: "Huile avant le sommeil", body: "La nuit, la peau répare – routine du soir généreuse." }
      ],
      solutionTitle: "Soins au CBD livrés en Islande",
      solutionBody: "<p>Expédition depuis la Suède ; livraison à Reykjavik en 5–7 jours ouvrés en général. Livraison offerte dès 50 €.</p><p>DUO TA-DA aux huiles concentrées offre la barrière la plus riche contre le vent extrême. Le DUO-kit renforce et équilibre. Fungtastic Mushroom Extract soutient l’immunité pendant les mois les plus sombres.</p>",
      faq: [
        { q: "Livrez-vous en Islande ?", a: "Oui, vers Reykjavik en 5–7 jours ouvrés en général. Livraison offerte dès 50 €." },
        { q: "Les soins au CBD sont-ils légaux en Islande ?", a: "Oui, le CBD dans les produits de soin est légal en Islande." },
        { q: "Quel produit pour le vent islandais ?", a: "DUO TA-DA donne la barrière la plus riche contre la déshydratation par le vent. Usage quotidien." },
        { q: "Délai de livraison ?", a: "5–7 jours ouvrés de la Suède à Reykjavik." }
      ],
      ctaTitle: "Offre à ta peau ce que le climat islandais exige",
      ctaSub: "Soins naturels au CBD de la Suède à Reykjavik. Livraison offerte dès 50 €."
    }
  },
  // ──────────────────────────────────────────────
  // CENTRAL EUROPE
  // ──────────────────────────────────────────────
  {
    svSlug: "hudvard-berlin",
    enSlug: "skincare-berlin",
    esSlug: "cuidado-piel-cbd-berlin",
    deSlug: "cbd-hautpflege-berlin",
    frSlug: "soin-peau-cbd-berlin",
    category: "stad",
    productIds: ["duo-kit", "au-naturel-makeup-remover", "ta-da-serum"],
    sv: {
      metaTitle: "Hudvård Berlin – CBD-hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i Berlin. Beställ online med fri frakt över €60. Skydda din hud mot Berlins föroreningar och hårda vatten.",
      kicker: "Hudvård i Berlin",
      h1: "Naturlig hudvård för dig i Berlin",
      lead: "Berlin är rått, kreativt och kompromisslöst – precis som ditt hudvårdsbehov. Föroreningar, extremt hårt vatten och ett kontinentalt klimat med kalla vintrar och heta somrar testar din hud. Fri frakt över €60.",
      problemTitle: "Berlinhudens utmaningar",
      problemBody: "<p>Berlin har Tysklands hårdaste kranvatten. Kalkhalten är extrem och belastar huden vid varje dusch och tvätt – torrhet, irritation och igentäppta porer är vanliga klagomål. Den som flyttat till Berlin från en stad med mjukare vatten märker skillnaden direkt.</p><p>Klimatet är kontinentalt med kalla, gråa vintrar och överraskande heta somrar. Temperaturen kan variera från minus femton i januari till trettifem i juli. Den ständiga växlingen stressar hudbarriären. Berlins trafikföroreningar – särskilt längs huvudstråken som Frankfurter Allee och Kottbusser Damm – belastar huden med fina partiklar och oxidativ stress.</p><p>Lägg till Berlins nattliv – sena kvällar, rökmaskiner i klubbar, för lite sömn – och du har en hud som skriker efter hjälp.</p>",
      tipsTitle: "Hudvårdstips för berlinare",
      tips: [
        { title: "Filtrera ditt vatten", body: "Berlins hårda vatten är huden värsta fiende. Ett duschfilter är den bästa investering du kan göra för din hy." },
        { title: "Dubbel rengöring efter klubbnätter", body: "Rök, svett och smink efter en natt på Berghain behöver en ordentlig dubbelrengöring. Au Naturel först, sedan mild rengöring." },
        { title: "Promenera i Tiergarten", body: "Berlins gröna lunga erbjuder ren luft mitt i staden. Regelbundna promenader sänker kortisol." },
        { title: "Ät i Markthalle Neun", body: "Berlins matscen erbjuder allt – fermenterade grönsaker, benmärgsbuljong, ekologiskt. Huden mår bra av det." },
        { title: "Prioritera sömn", body: "Berlin aldrig sover, men din hud behöver det. Åtta timmar sömn är den mest underskattade hudvårdsprodukten." }
      ],
      solutionTitle: "CBD-hudvård levererad till Berlin",
      solutionBody: "<p>Vi skickar från Sverige – leverans till Berlin inom 3–5 arbetsdagar. Fri frakt över €60.</p><p>DUO-kit ger hudbarriären det stöd den behöver mot Berlins hårda vatten. Au Naturel Makeup Remover rengör bort partiklar och smuts effektivt men milt. TA-DA Serum ger extra skydd under kalla vintermånader.</p>",
      faq: [
        { q: "Levererar ni till Tyskland?", a: "Ja, leverans till Berlin inom 3–5 arbetsdagar. Fri frakt över €60." },
        { q: "Är CBD-hudvård lagligt i Tyskland?", a: "Ja, CBD i hudvård är fullt lagligt i Tyskland." },
        { q: "Vilken produkt mot Berlins hårda vatten?", a: "DUO-kit stärker barriären som hårt vatten försvagar. Au Naturel rengör utan att torka ut." },
        { q: "Hur lång tid tar leveransen?", a: "3–5 arbetsdagar från Sverige till Berlin." }
      ],
      ctaTitle: "Ge din hud det Berlin kräver",
      ctaSub: "Naturlig CBD-hudvård från Sverige till Berlin. Fri frakt över €60."
    },
    en: {
      metaTitle: "Skincare Berlin – CBD skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Berlin. Order online with free shipping over €60. Protect your skin from Berlin's hard water, pollution, and continental climate extremes.",
      kicker: "Skincare in Berlin",
      h1: "Natural skincare for Berlin",
      lead: "Berlin is raw, creative, and uncompromising – just like your skincare needs. Pollution, extremely hard water, and a continental climate with freezing winters and scorching summers test your skin constantly. Free shipping over €60.",
      problemTitle: "What Berlin does to your skin",
      problemBody: "<p>Berlin has the hardest tap water in Germany. Calcium levels are extreme and stress the skin with every shower and wash – dryness, irritation, and clogged pores are common complaints. Anyone who has moved to Berlin from a city with softer water notices the difference immediately.</p><p>The climate is continental with cold, grey winters and surprisingly hot summers. Temperatures can range from minus fifteen in January to thirty-five in July. The constant shifting stresses the skin barrier. Berlin's traffic pollution – especially along main arteries like Frankfurter Allee and Kottbusser Damm – loads the skin with fine particles and oxidative stress.</p><p>Add Berlin's nightlife – late nights, smoke machines in clubs, too little sleep – and you have skin that's crying out for help.</p>",
      tipsTitle: "Skincare tips for Berliners",
      tips: [
        { title: "Filter your water", body: "Berlin's hard water is your skin's worst enemy. A shower filter is the best investment you can make for your complexion." },
        { title: "Double cleanse after club nights", body: "Smoke, sweat, and makeup after a night at Berghain need a proper double cleanse. Au Naturel first, then a gentle wash." },
        { title: "Walk in Tiergarten", body: "Berlin's green lung offers clean air in the middle of the city. Regular walks lower cortisol measurably." },
        { title: "Eat at Markthalle Neun", body: "Berlin's food scene has everything – fermented vegetables, bone broth, organic produce. Your skin benefits from all of it." },
        { title: "Prioritize sleep", body: "Berlin never sleeps, but your skin needs to. Eight hours of sleep is the most underrated skincare product." }
      ],
      solutionTitle: "CBD skincare delivered to Berlin",
      solutionBody: "<p>We ship from Sweden – delivery to Berlin within 3–5 business days. Free shipping on orders over €60.</p><p>The DUO-kit gives your skin barrier the support it needs against Berlin's hard water. Au Naturel Makeup Remover cleans away particles and grime effectively but gently. TA-DA Serum provides extra protection during the cold winter months.</p>",
      faq: [
        { q: "Do you ship to Germany?", a: "Yes, delivery to Berlin within 3–5 business days. Free shipping over €60." },
        { q: "Is CBD skincare legal in Germany?", a: "Yes, CBD in skincare is fully legal in Germany." },
        { q: "Which product for Berlin's hard water?", a: "The DUO-kit strengthens the barrier that hard water weakens. Au Naturel cleanses without drying out." },
        { q: "How long does shipping take?", a: "3–5 business days from Sweden to Berlin." }
      ],
      ctaTitle: "Give your skin what Berlin demands",
      ctaSub: "Natural CBD skincare from Sweden to Berlin. Free shipping over €60."
    },
    es: {
      metaTitle: "Cuidado de la piel Berlín – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Berlín. Pide online, envío gratis desde 50 €. Protege tu piel del agua muy dura, la contaminación y el clima continental.",
      kicker: "Cuidado de la piel en Berlín",
      h1: "Cosmética natural para Berlín",
      lead: "Berlín es cruda, creativa y sin concesiones – igual que lo que tu piel necesita. Contaminación, agua durísima y clima continental con inviernos gélidos y veranos de golpe ponen a prueba tu barrera. Envío gratis desde 50 €.",
      problemTitle: "Lo que Berlín le hace a tu piel",
      problemBody: "<p>Berlín tiene el agua del grifo más dura de Alemania. El calcio es extremo y castiga la piel en cada ducha – sequedad, irritación y poros tapados son el pan de cada día. Quien llega desde una ciudad con agua más blanda lo nota al instante.</p><p>Clima continental: inviernos grises y fríos, veranos sorprendentemente calurosos. De menos quince en enero a treinta y cinco en julio; los vaivenes tensionan la barrera. El tráfico – Frankfurter Allee, Kottbusser Damm y compañía – carga la piel de partículas y estrés oxidativo.</p><p>Suma la vida nocturna: madrugadas, humo en clubes, pocas horas de sueño – y tienes una piel pidiendo auxilio.</p>",
      tipsTitle: "Consejos para quien vive en Berlín",
      tips: [
        { title: "Filtra el agua", body: "El agua dura es tu peor enemiga. Un filtro de ducha es la mejor inversión para tu cutis." },
        { title: "Doble limpieza tras la noche", body: "Humo, sudor y maquillaje tras Berghain piden doble paso: primero Au Naturel, luego limpieza suave." },
        { title: "Tiergarten", body: "El pulmón verde da aire limpio en plena ciudad. Caminar baja el cortisol de verdad." },
        { title: "Markthalle Neun", body: "Verduras fermentadas, caldos, producto ecológico – la escena gastronómica alimenta la piel por dentro." },
        { title: "Duerme", body: "Berlín no duerme, pero tu piel sí lo necesita. Ocho horas son el cosmético más infravalorado." }
      ],
      solutionTitle: "Cosmética con CBD con entrega en Berlín",
      solutionBody: "<p>Enviamos desde Suecia; 3–5 días laborables hasta Berlín. Envío gratis desde 50 €.</p><p>El DUO-kit refuerza la barrera frente al agua dura. Au Naturel Makeup Remover limpia partículas y suciedad sin resecar. TA-DA Serum suma protección en invierno.</p>",
      faq: [
        { q: "¿Envían a Alemania?", a: "Sí, a Berlín en 3–5 días laborables. Envío gratis desde 50 €." },
        { q: "¿El CBD en cosmética es legal en Alemania?", a: "Sí, el CBD en cuidado de la piel es plenamente legal en Alemania." },
        { q: "¿Qué producto para el agua dura de Berlín?", a: "DUO-kit para la barrera; Au Naturel limpia sin tirantez." },
        { q: "¿Plazo de envío?", a: "3–5 días laborables desde Suecia." }
      ],
      ctaTitle: "Dale a tu piel lo que Berlín exige",
      ctaSub: "Cosmética natural con CBD de Suecia a Berlín. Envío gratis desde 50 €."
    },
    de: {
      metaTitle: "Hautpflege Berlin – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für Berlin. Online bestellen, ab 50 € versandkostenfrei. Schutz vor extrem hartem Wasser, Luftschmutz und Kontinentalklima.",
      kicker: "Hautpflege in Berlin",
      h1: "Natürliche Hautpflege für Berlin",
      lead: "Berlin ist rau, kreativ, kompromisslos – genau wie dein Anspruch an die Pflege. Smog, extrem hartes Leitungswasser und ein Kontinentalklima mit eisigen Wintern und brütenden Sommern setzen deiner Haut ständig zu. Ab 50 € versandkostenfrei.",
      problemTitle: "Was Berlin mit deiner Haut macht",
      problemBody: "<p>Berlin hat Deutschlands härtestes Leitungswasser. Der Kalk ist extrem – jede Dusche strapaziert die Haut: Trockenheit, Reizungen, verstopfte Poren. Wer aus weicheren Gefilden zieht, merkt den Unterschied sofort.</p><p>Klima: graue, kalte Winter und überraschend heiße Sommer. Von minus fünfzehn im Januar bis plus fünfunddreißig im Juli – die Barriere kommt kaum zur Ruhe. Verkehrslärm und Abgase an Achsen wie Frankfurter Allee oder Kottbusser Damm laden Feinstaub und oxidativen Stress auf die Haut.</p><p>Dazu Berlins Nachtleben: lange Nächte, Nebel in Clubs, zu wenig Schlaf – Haut am Limit.</p>",
      tipsTitle: "Hautpflege-Tipps für Berlin",
      tips: [
        { title: "Wasser filtern", body: "Berliner Hartwasser ist Feind Nr. 1. Duschfilter – beste Investition fürs Gesicht." },
        { title: "Doppelreinigung nach Club", body: "Rauch, Schweiß, Makeup nach Berghain braucht Saubermachen in zwei Schritten: erst Au Naturel, dann mildes Waschgel." },
        { title: "Tiergarten", body: "Grüne Lunge mitten in der Stadt. Regelmäßig laufen – Cortisol runter, Haut ruhiger." },
        { title: "Markthalle Neun", body: "Fermentiertes, Brühe, Bio – was gut für den Darm ist, hilft oft auch der Haut." },
        { title: "Schlaf nicht vergessen", body: "In Berlin wird nicht geschlafen – deine Haut braucht es trotzdem. Acht Stunden sind unterschätztes Beauty-Produkt." }
      ],
      solutionTitle: "CBD-Hautpflege nach Berlin",
      solutionBody: "<p>Versand aus Schweden – 3–5 Werktage bis Berlin. Ab 50 € versandkostenfrei.</p><p>Das DUO-kit stützt die Barriere gegen Berliner Kalkwasser. Au Naturel Makeup Remover holt Partikel und Schmutz raus, ohne auszutrocknen. TA-DA Serum gibt im Winter Extra-Schutz.</p>",
      faq: [
        { q: "Liefert ihr nach Deutschland?", a: "Ja, nach Berlin in 3–5 Werktagen. Ab 50 € versandkostenfrei." },
        { q: "Ist CBD-Kosmetik in Deutschland legal?", a: "Ja, CBD in Hautpflegeprodukten ist in Deutschland vollständig legal." },
        { q: "Welches Produkt gegen Berliner Hartwasser?", a: "DUO-kit für die Barriere, Au Naturel reinigt ohne auszulaugen." },
        { q: "Wie lange dauert der Versand?", a: "3–5 Werktage von Schweden nach Berlin." }
      ],
      ctaTitle: "Gib deiner Haut, was Berlin von dir verlangt",
      ctaSub: "Natürliche CBD-Pflege von Schweden nach Berlin. Ab 50 € versandkostenfrei."
    },
    fr: {
      metaTitle: "Soin du visage Berlin – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Berlin. Commande en ligne, livraison offerte dès 50 €. Protège ta peau de l’eau très dure, de la pollution et du climat continental.",
      kicker: "Soins à Berlin",
      h1: "Soins naturels pour Berlin",
      lead: "Berlin est brute, créative, sans compromis – comme les exigences de ta peau. Pollution, eau ultra-calcaire et climat continental à saisons extrêmes la mettent à l’épreuve en continu. Livraison offerte dès 50 €.",
      problemTitle: "Ce que Berlin fait à ta peau",
      problemBody: "<p>Berlin a l’eau du robinet la plus dure d’Allemagne. Le calcium est extrême : chaque douche agresse – sécheresse, irritation, pores bouchés. Arriver d’une ville à l’eau plus douce, c’est voir la différence tout de suite.</p><p>Hivers gris et froids, étés caniculaires surprenants. De moins quinze en janvier à trente-cinq en juillet : la barrière n’a pas le temps de s’habituer. La pollution routière – Frankfurter Allee, Kottbusser Damm – charge la peau en particules et stress oxydatif.</p><p>Ajoute les nuits berlinoises : tard, fumée en boîte, peu de sommeil – la peau crie au secours.</p>",
      tipsTitle: "Conseils peau pour Berlin",
      tips: [
        { title: "Filtre ton eau", body: "L’eau dure est l’ennemie numéro un. Filtre de douche : meilleur investissement teint." },
        { title: "Double démaquillage après club", body: "Fumée, sueur, maquillage après Berghain : Au Naturel d’abord, puis nettoyage doux." },
        { title: "Tiergarten", body: "Poumon vert au cœur de la ville. Marches régulières : cortisol en baisse." },
        { title: "Markthalle Neun", body: "Légumes fermentés, bouillons, bio – la scène food nourrit la peau de l’intérieur." },
        { title: "Priorise le sommeil", body: "Berlin ne dort pas, mais ta peau oui. Huit heures : produit beauté sous-estimé." }
      ],
      solutionTitle: "Soins au CBD livrés à Berlin",
      solutionBody: "<p>Expédition depuis la Suède ; 3–5 jours ouvrés jusqu’à Berlin. Livraison offerte dès 50 €.</p><p>Le DUO-kit soutient la barrière face au calcaire. Au Naturel Makeup Remover enlève particules et saleté sans assécher. TA-DA Serum renforce en hiver.</p>",
      faq: [
        { q: "Livrez-vous en Allemagne ?", a: "Oui, à Berlin en 3–5 jours ouvrés. Livraison offerte dès 50 €." },
        { q: "Le CBD en cosmétique est-il légal en Allemagne ?", a: "Oui, le CBD dans les soins est entièrement légal en Allemagne." },
        { q: "Quel produit pour l’eau dure à Berlin ?", a: "DUO-kit pour la barrière ; Au Naturel nettoie sans tiraillements." },
        { q: "Délai de livraison ?", a: "3–5 jours ouvrés depuis la Suède." }
      ],
      ctaTitle: "Offre à ta peau ce que Berlin exige",
      ctaSub: "Soins naturels au CBD de la Suède à Berlin. Livraison offerte dès 50 €."
    }
  },
  {
    svSlug: "hudvard-munchen",
    enSlug: "skincare-munich",
    esSlug: "cuidado-piel-cbd-munich",
    deSlug: "cbd-hautpflege-munich",
    frSlug: "soin-peau-cbd-munich",
    category: "stad",
    productIds: ["duo-kit", "ta-da-serum", "fungtastic-mushroom-extract"],
    sv: {
      metaTitle: "Hudvård München – CBD-hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i München. Beställ online med fri frakt över €60. Skydda din hud mot alpklimatet och bayerska vintrar.",
      kicker: "Hudvård i München",
      h1: "Naturlig hudvård för dig i München",
      lead: "Münchens alprelaterade klimat med Föhn-vindar, kalla vintrar och stark sommar-UV skapar unika hudutmaningar. Fri frakt över €60.",
      problemTitle: "Münchenhudens utmaningar",
      problemBody: "<p>München ligger vid foten av Alperna, och det märks. Föhn-vinden – varm, torr luft som faller ned från bergen – kan sänka luftfuktigheten dramatiskt på bara timmar. Många münchenare upplever huvudvärk och torr, irriterad hud under Föhn-dagar.</p><p>Vintrarna är kalla med temperaturer som regelbundet sjunker under minus tio, medan somrarna bjuder på stark UV-strålning tack vare den höga altituden. Münchens vatten är hårt men av hög kvalitet – det kommer direkt från Alperna.</p>",
      tipsTitle: "Hudvårdstips för münchenare",
      tips: [
        { title: "Extra skydd under Föhn-dagar", body: "När Föhn-vinden blåser torkar huden ut snabbt. Applicera en extra rik olja de dagarna." },
        { title: "Promenera i Englischer Garten", body: "Europas största stadspark ger ren luft och grönska. Perfekt för stressreducering." },
        { title: "UV-skydd på sommaren", body: "Münchens höga altitud innebär starkare UV. Skydda huden och reparera med CBD efter solexponering." },
        { title: "Ät bayerskt och ekologiskt", body: "Münchens ekologiska matkultur och Viktualienmarkt erbjuder allt huden behöver inifrån." },
        { title: "Bada i Eisbach", body: "Kallbad stärker cirkulationen och ger huden en boost. Men återfukta alltid efteråt." }
      ],
      solutionTitle: "CBD-hudvård levererad till München",
      solutionBody: "<p>Vi skickar från Sverige – leverans till München inom 3–5 arbetsdagar. Fri frakt över €60.</p><p>DUO-kit balanserar huden mot klimatväxlingar. TA-DA Serum ger barriärskydd under kalla vintrar och torra Föhn-dagar. Fungtastic Mushroom Extract stödjer immunförsvaret.</p>",
      faq: [
        { q: "Levererar ni till München?", a: "Ja, 3–5 arbetsdagar från Sverige. Fri frakt över €60." },
        { q: "Är CBD lagligt i Tyskland?", a: "Ja, CBD i hudvård är fullt lagligt i Tyskland." },
        { q: "Vilken produkt för Föhn-dagar?", a: "TA-DA Serum ger extra fukt och barriärskydd när Föhn-vinden torkar ut allt." },
        { q: "Hur lång tid tar leveransen?", a: "3–5 arbetsdagar." }
      ],
      ctaTitle: "Ge din hud det alpklimatet kräver",
      ctaSub: "Naturlig CBD-hudvård från Sverige till München. Fri frakt över €60."
    },
    en: {
      metaTitle: "Skincare Munich – CBD skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Munich. Order online with free shipping over €60. Protect your skin from Alpine climate shifts and Föhn winds.",
      kicker: "Skincare in Munich",
      h1: "Natural skincare for Munich",
      lead: "Munich's Alpine-influenced climate with Föhn winds, cold winters, and strong summer UV creates unique skin challenges. Free shipping over €60.",
      problemTitle: "What Munich does to your skin",
      problemBody: "<p>Munich sits at the foot of the Alps, and your skin knows it. The Föhn wind – warm, dry air descending from the mountains – can drop humidity levels dramatically within hours. Many Munich residents experience headaches and dry, irritated skin during Föhn days.</p><p>Winters are cold with temperatures regularly dropping below minus ten, while summers bring strong UV radiation thanks to the higher altitude. Munich's water is hard but high quality – it comes directly from the Alps.</p>",
      tipsTitle: "Skincare tips for Munich residents",
      tips: [
        { title: "Extra protection on Föhn days", body: "When the Föhn wind blows, your skin dries out fast. Apply an extra rich oil on those days." },
        { title: "Walk in Englischer Garten", body: "Europe's largest urban park offers clean air and greenery. Perfect for stress reduction." },
        { title: "UV protection in summer", body: "Munich's higher altitude means stronger UV. Protect your skin and repair with CBD after sun exposure." },
        { title: "Eat Bavarian and organic", body: "Munich's organic food culture and Viktualienmarkt offer everything your skin needs from within." },
        { title: "Swim in the Eisbach", body: "Cold water bathing strengthens circulation and gives the skin a boost. But always moisturize afterward." }
      ],
      solutionTitle: "CBD skincare delivered to Munich",
      solutionBody: "<p>We ship from Sweden – delivery to Munich within 3–5 business days. Free shipping on orders over €60.</p><p>The DUO-kit balances the skin against climate fluctuations. TA-DA Serum provides barrier protection during cold winters and dry Föhn days. Fungtastic Mushroom Extract supports immunity.</p>",
      faq: [
        { q: "Do you ship to Munich?", a: "Yes, 3–5 business days from Sweden. Free shipping over €60." },
        { q: "Is CBD legal in Germany?", a: "Yes, CBD in skincare is fully legal in Germany." },
        { q: "Which product for Föhn days?", a: "TA-DA Serum provides extra moisture and barrier protection when the Föhn wind dries everything out." },
        { q: "How long does shipping take?", a: "3–5 business days." }
      ],
      ctaTitle: "Give your skin what Alpine climate demands",
      ctaSub: "Natural CBD skincare from Sweden to Munich. Free shipping over €60."
    },
    es: {
      metaTitle: "Cuidado de la piel Múnich – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Múnich. Pide online, envío gratis desde 50 €. Protege tu piel del clima alpino y del viento Föhn.",
      kicker: "Cuidado de la piel en Múnich",
      h1: "Cosmética natural para Múnich",
      lead: "El clima de influencia alpina en Múnich – vientos Föhn, inviernos fríos y UV fuerte en verano – crea retos de piel muy particulares. Envío gratis desde 50 €.",
      problemTitle: "Lo que Múnich le hace a tu piel",
      problemBody: "<p>Múnich está a los pies de los Alpes y la piel lo nota. El Föhn – aire cálido y seco que baja de la montaña – puede hundir la humedad ambiental en horas. Muchos muniqueses tienen cefalea y piel seca e irritada esos días.</p><p>Inviernos con temperaturas bajo menos diez; veranos con radiación UV intensa por la altitud. El agua es dura pero excelente – viene directamente de los Alpes.</p>",
      tipsTitle: "Consejos para quien vive en Múnich",
      tips: [
        { title: "Refuerzo en días de Föhn", body: "Cuando sopla el Föhn la piel se seca en nada. Aceite extra rico esos días." },
        { title: "Englischer Garten", body: "El parque urbano más grande de Europa: aire limpio y verde. Baja el estrés." },
        { title: "Protección UV en verano", body: "Más altitud, más UV. Protege y repara con CBD tras el sol." },
        { title: "Bávaro y ecológico", body: "Cultura bio y Viktualienmarkt – lo que la piel pide por dentro." },
        { title: "Eisbach", body: "Agua fría estimula circulación; hidrata después." }
      ],
      solutionTitle: "Cosmética con CBD con entrega en Múnich",
      solutionBody: "<p>Enviamos desde Suecia; 3–5 días laborables hasta Múnich. Envío gratis desde 50 €.</p><p>El DUO-kit equilibra la piel ante los cambios climáticos. TA-DA Serum protege la barrera en invierno y en días de Föhn seco. Fungtastic Mushroom Extract apoya la inmunidad.</p>",
      faq: [
        { q: "¿Envían a Múnich?", a: "Sí, 3–5 días laborables desde Suecia. Envío gratis desde 50 €." },
        { q: "¿El CBD es legal en Alemania?", a: "Sí, el CBD en cosmética es plenamente legal en Alemania." },
        { q: "¿Qué producto para días de Föhn?", a: "TA-DA Serum aporta humedad y barrera cuando el Föhn lo seca todo." },
        { q: "¿Plazo de envío?", a: "3–5 días laborables." }
      ],
      ctaTitle: "Dale a tu piel lo que el clima alpino exige",
      ctaSub: "Cosmética natural con CBD de Suecia a Múnich. Envío gratis desde 50 €."
    },
    de: {
      metaTitle: "Hautpflege München – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für München. Online bestellen, ab 50 € versandkostenfrei. Schutz vor Alpenklima und Föhn.",
      kicker: "Hautpflege in München",
      h1: "Natürliche Hautpflege für München",
      lead: "Münchens alpennahes Klima mit Föhn, kalten Wintern und starker Sommer-UV fordert deine Haut auf eigene Art. Ab 50 € versandkostenfrei.",
      problemTitle: "Was München mit deiner Haut macht",
      problemBody: "<p>München liegt am Alpenrand – die Haut merkt es. Föhn – warme, trockene Fallwinde – kann die Luftfeuchtigkeit innerhalb von Stunden in den Keller ziehen. Viele Münchner haben an Föhn-Tagen Kopfschmerzen und trockene, gereizte Haut.</p><p>Winter unter minus zehn, Sommer mit starker UV-Strahlung durch die Höhenlage. Das Wasser ist hart, aber top – direkt aus den Alpen.</p>",
      tipsTitle: "Hautpflege-Tipps für München",
      tips: [
        { title: "Extra-Schutz bei Föhn", body: "Bei Föhn trocknet die Haut ruckzuck aus. Reichhaltigeres Öl an diesen Tagen." },
        { title: "Englischer Garten", body: "Europas größter Stadtpark – saubere Luft, Grün, Stress runter." },
        { title: "UV im Sommer", body: "Mehr Höhe, mehr UV. Schützen und mit CBD nach der Sonne pflegen." },
        { title: "Bayerisch und Bio", body: "Öko-Kultur und Viktualienmarkt – was innen gut ist, hilft oft auch der Haut." },
        { title: "Eisbach", body: "Kaltwasser regt Kreislauf an – danach eincremen." }
      ],
      solutionTitle: "CBD-Hautpflege nach München",
      solutionBody: "<p>Versand aus Schweden – 3–5 Werktage bis München. Ab 50 € versandkostenfrei.</p><p>Das DUO-kit balanciert bei Klimaschwankungen. TA-DA Serum schützt die Barriere im Winter und an trockenen Föhn-Tagen. Fungtastic Mushroom Extract unterstützt die Immunität.</p>",
      faq: [
        { q: "Liefert ihr nach München?", a: "Ja, 3–5 Werktage aus Schweden. Ab 50 € versandkostenfrei." },
        { q: "Ist CBD in Deutschland legal?", a: "Ja, CBD in Kosmetik ist in Deutschland vollständig legal." },
        { q: "Welches Produkt für Föhn-Tage?", a: "TA-DA Serum gibt extra Feuchtigkeit und Barriere, wenn der Föhn alles austrocknet." },
        { q: "Wie lange dauert der Versand?", a: "3–5 Werktage." }
      ],
      ctaTitle: "Gib deiner Haut, was das Alpenklima verlangt",
      ctaSub: "Natürliche CBD-Pflege von Schweden nach München. Ab 50 € versandkostenfrei."
    },
    fr: {
      metaTitle: "Soin du visage Munich – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Munich. Commande en ligne, livraison offerte dès 50 €. Protège ta peau du climat alpin et du vent de foehn.",
      kicker: "Soins à Munich",
      h1: "Soins naturels pour Munich",
      lead: "Le climat d’influence alpine à Munich – foehn, hivers froids et UV estivaux marqués – crée des défis cutanés bien spécifiques. Livraison offerte dès 50 €.",
      problemTitle: "Ce que Munich fait à ta peau",
      problemBody: "<p>Munich est au pied des Alpes – la peau le sent. Le foehn – air chaud et sec descendant des montagnes – peut faire chuter l’humidité en quelques heures. Beaucoup de Munichois ont mal à la tête et une peau sèche et irritée ces jours-là.</p><p>Hivers sous moins dix ; étés avec UV renforcé par l’altitude. L’eau est dure mais excellente – directement des Alpes.</p>",
      tipsTitle: "Conseils peau pour Munich",
      tips: [
        { title: "Renfort les jours de foehn", body: "Avec le foehn la peau se déshydrate vite. Huile plus riche ces jours-là." },
        { title: "Englischer Garten", body: "Le plus grand parc urbain d’Europe : air pur, vert, stress en baisse." },
        { title: "UV l’été", body: "Plus d’altitude, plus d’UV. Protège et répare au CBD après soleil." },
        { title: "Bavarois et bio", body: "Culture bio et Viktualienmarkt – l’assiette nourrit la peau." },
        { title: "Eisbach", body: "Eau froide stimule la circulation ; hydrate après." }
      ],
      solutionTitle: "Soins au CBD livrés à Munich",
      solutionBody: "<p>Expédition depuis la Suède ; 3–5 jours ouvrés jusqu’à Munich. Livraison offerte dès 50 €.</p><p>Le DUO-kit équilibre la peau face aux variations climatiques. TA-DA Serum protège la barrière en hiver et par temps de foehn sec. Fungtastic Mushroom Extract soutient l’immunité.</p>",
      faq: [
        { q: "Livrez-vous à Munich ?", a: "Oui, 3–5 jours ouvrés depuis la Suède. Livraison offerte dès 50 €." },
        { q: "Le CBD est-il légal en Allemagne ?", a: "Oui, le CBD en cosmétique est entièrement légal en Allemagne." },
        { q: "Quel produit pour les jours de foehn ?", a: "TA-DA Serum apporte humidité et barrière quand le foehn assèche tout." },
        { q: "Délai de livraison ?", a: "3–5 jours ouvrés." }
      ],
      ctaTitle: "Offre à ta peau ce que le climat alpin exige",
      ctaSub: "Soins naturels au CBD de la Suède à Munich. Livraison offerte dès 50 €."
    }
  },
  {
    svSlug: "hudvard-amsterdam",
    enSlug: "skincare-amsterdam",
    esSlug: "cuidado-piel-cbd-amsterdam",
    deSlug: "cbd-hautpflege-amsterdam",
    frSlug: "soin-peau-cbd-amsterdam",
    category: "stad",
    productIds: ["duo-kit", "au-naturel-makeup-remover", "ta-da-serum"],
    sv: {
      metaTitle: "Hudvård Amsterdam – CBD-hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i Amsterdam. Beställ online med fri frakt över €60. Skydda din hud mot fukt, vind och holländsk cykelkultur.",
      kicker: "Hudvård i Amsterdam",
      h1: "Naturlig hudvård för dig i Amsterdam",
      lead: "Amsterdam – kanaler, cyklar och evig fukt. Nordsjövinden, det hårda vattnet och ett klimat som aldrig riktigt bestämmer sig utmanar din hud året runt. Fri frakt över €60.",
      problemTitle: "Amsterdamhudens utmaningar",
      problemBody: "<p>Amsterdam ligger under havsnivån och det märks på klimatet. Luftfuktigheten är hög året runt, men det betyder inte att huden är återfuktad – tvärtom. Nordsjövinden bär med sig salt och piskande regn som bryter ned hudbarriären. Amsterdams cyklister – vilket är alla – utsätter sina ansikten för elementen timmar varje dag.</p><p>Holländskt kranvatten är medelhårt och kalkhalten kan irritera känslig hud. Vintrarna är inte extremt kalla men rått fuktiga, med temperaturer runt noll och en genomträngande fukt som gör kylan mer bitande. Somrarna är milda men oförutsägbara.</p>",
      tipsTitle: "Hudvårdstips för amsterdamare",
      tips: [
        { title: "Skydda ansiktet på cykeln", body: "Du cyklar överallt – applicera en barriärolja innan. Din hud förtjänar lika mycket skydd som dina ben." },
        { title: "Promenera i Vondelpark", body: "Grönska och frisk luft mitt i staden. Regelbundna promenader sänker stressnivåer." },
        { title: "Duschfilter hjälper", body: "Amsterdams vatten är inte det mjukaste. Ett filter kan minska kalkens inverkan på känslig hud." },
        { title: "Ät holländskt – sill och ost", body: "Matjessill ger omega-3 och holländska ostar ger protein. Enkel, lokal hudmat." },
        { title: "Använd fuktare vintertid", body: "Holländska hem med centralvärme blir torra inomhus. En luftfuktare skyddar hudbarriären nattetid." }
      ],
      solutionTitle: "CBD-hudvård levererad till Amsterdam",
      solutionBody: "<p>Vi skickar från Sverige – leverans till Amsterdam inom 3–5 arbetsdagar. Fri frakt över €60.</p><p>DUO-kit stärker barriären mot vind och fuktväxlingar. Au Naturel rengör bort dagens smuts. TA-DA Serum ger extra fukt under blåsiga månader.</p>",
      faq: [
        { q: "Levererar ni till Nederländerna?", a: "Ja, 3–5 arbetsdagar. Fri frakt över €60." },
        { q: "Är CBD-hudvård lagligt i Nederländerna?", a: "Absolut – Nederländerna har en av Europas mest progressiva inställningar till CBD." },
        { q: "Vilken produkt för Amsterdams klimat?", a: "DUO-kit som daglig bas, Au Naturel för rengöring efter cykling." },
        { q: "Hur lång tid tar leveransen?", a: "3–5 arbetsdagar från Sverige." }
      ],
      ctaTitle: "Ge din hud det Amsterdams klimat kräver",
      ctaSub: "Naturlig CBD-hudvård från Sverige till Amsterdam. Fri frakt över €60."
    },
    en: {
      metaTitle: "Skincare Amsterdam – CBD skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Amsterdam. Order online with free shipping over €60. Protect your skin from North Sea winds, humidity, and hard Dutch water.",
      kicker: "Skincare in Amsterdam",
      h1: "Natural skincare for Amsterdam",
      lead: "Amsterdam – canals, bicycles, and eternal dampness. North Sea wind, hard water, and a climate that never quite makes up its mind challenge your skin year-round. Free shipping over €60.",
      problemTitle: "What Amsterdam does to your skin",
      problemBody: "<p>Amsterdam sits below sea level and the climate reflects it. Humidity is high year-round, but that doesn't mean your skin is hydrated – quite the opposite. North Sea wind carries salt and lashing rain that breaks down the skin barrier. Amsterdam's cyclists – which is everyone – expose their faces to the elements for hours every day.</p><p>Dutch tap water is moderately hard and the calcium content can irritate sensitive skin. Winters aren't extremely cold but rawly damp, with temperatures around zero and a penetrating moisture that makes the cold more biting. Summers are mild but unpredictable.</p>",
      tipsTitle: "Skincare tips for Amsterdammers",
      tips: [
        { title: "Protect your face on the bike", body: "You cycle everywhere – apply a barrier oil before heading out. Your skin deserves as much protection as your legs." },
        { title: "Walk in Vondelpark", body: "Greenery and fresh air in the middle of the city. Regular walks measurably lower stress levels." },
        { title: "A shower filter helps", body: "Amsterdam's water isn't the softest. A filter can reduce the impact of calcium on sensitive skin." },
        { title: "Eat Dutch – herring and cheese", body: "Matjes herring provides omega-3s and Dutch cheeses provide protein. Simple, local skin food." },
        { title: "Use a humidifier in winter", body: "Dutch homes with central heating become dry indoors. A humidifier protects the skin barrier at night." }
      ],
      solutionTitle: "CBD skincare delivered to Amsterdam",
      solutionBody: "<p>We ship from Sweden – delivery to Amsterdam within 3–5 business days. Free shipping on orders over €60.</p><p>The DUO-kit strengthens the barrier against wind and humidity fluctuations. Au Naturel cleans away the day's grime. TA-DA Serum provides extra moisture during blustery months.</p>",
      faq: [
        { q: "Do you ship to the Netherlands?", a: "Yes, 3–5 business days. Free shipping over €60." },
        { q: "Is CBD skincare legal in the Netherlands?", a: "Absolutely – the Netherlands has one of Europe's most progressive attitudes toward CBD." },
        { q: "Which product for Amsterdam's climate?", a: "The DUO-kit as a daily base, Au Naturel for cleansing after cycling." },
        { q: "How long does shipping take?", a: "3–5 business days from Sweden." }
      ],
      ctaTitle: "Give your skin what Amsterdam's climate demands",
      ctaSub: "Natural CBD skincare from Sweden to Amsterdam. Free shipping over €60."
    },
    es: {
      metaTitle: "Cuidado de la piel Ámsterdam – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Ámsterdam. Pide online, envío gratis desde 50 €. Protege tu piel del viento del Mar del Norte, la humedad y el agua dura.",
      kicker: "Cuidado de la piel en Ámsterdam",
      h1: "Cosmética natural para Ámsterdam",
      lead: "Ámsterdam: canales, bicis y humedad eterna. Viento del Norte, agua dura y un clima que no se decide – tu piel lo nota todo el año. Envío gratis desde 50 €.",
      problemTitle: "Lo que Ámsterdam le hace a tu piel",
      problemBody: "<p>Ámsterdam está bajo el nivel del mar y el clima lo delata. Hay humedad ambiental todo el año, pero eso no significa piel hidratada – al revés. El viento del Mar del Norte trae sal y lluvia que desgastan la barrera. Aquí todo el mundo va en bici: la cara aguanta horas de intemperie.</p><p>El agua del grifo es moderadamente dura; el calcio puede irritar pieles sensibles. Inviernos no gélidos pero crudos y húmedos, alrededor de cero con una humedad que muerde. Veranos suaves e impredecibles.</p>",
      tipsTitle: "Consejos para quien vive en Ámsterdam",
      tips: [
        { title: "Protege la cara en bici", body: "Vas en bici a todas partes – aceite barrera antes de salir. La cara merece el mismo cuidado que las piernas." },
        { title: "Vondelpark", body: "Verde y aire fresco en el centro. Paseos regulares bajan el estrés." },
        { title: "Filtro de ducha", body: "El agua no es la más blanda. Un filtro reduce el calcio en pieles sensibles." },
        { title: "Arengue y queso", body: "Arengue matjes aporta omega-3; quesos holandeses, proteína. Comida local para la piel." },
        { title: "Humidificador en invierno", body: "La calefación seca el interior. Humidificador de noche = barrera más feliz." }
      ],
      solutionTitle: "Cosmética con CBD con entrega en Ámsterdam",
      solutionBody: "<p>Enviamos desde Suecia; 3–5 días laborables hasta Ámsterdam. Envío gratis desde 50 €.</p><p>El DUO-kit refuerza la barrera frente a viento y cambios de humedad. Au Naturel limpia el día. TA-DA Serum da extra hidratación en meses ventosos.</p>",
      faq: [
        { q: "¿Envían a los Países Bajos?", a: "Sí, 3–5 días laborables. Envío gratis desde 50 €." },
        { q: "¿El CBD en cosmética es legal en los Países Bajos?", a: "Sí – una de las actitudes más abiertas de Europa hacia el CBD." },
        { q: "¿Qué producto para el clima de Ámsterdam?", a: "DUO-kit como base diaria; Au Naturel tras pedalear." },
        { q: "¿Plazo de envío?", a: "3–5 días laborables desde Suecia." }
      ],
      ctaTitle: "Dale a tu piel lo que el clima de Ámsterdam exige",
      ctaSub: "Cosmética natural con CBD de Suecia a Ámsterdam. Envío gratis desde 50 €."
    },
    de: {
      metaTitle: "Hautpflege Amsterdam – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für Amsterdam. Online bestellen, ab 50 € versandkostenfrei. Schutz vor Nordseewind, Feuchtigkeit und hartem Wasser.",
      kicker: "Hautpflege in Amsterdam",
      h1: "Natürliche Hautpflege für Amsterdam",
      lead: "Amsterdam – Grachten, Fahrräder und ewige Feuchte. Nordseewind, hartes Wetter und ein Klima, das sich nicht entscheidet. Ab 50 € versandkostenfrei.",
      problemTitle: "Was Amsterdam mit deiner Haut macht",
      problemBody: "<p>Amsterdam liegt unter dem Meeresspiegel – das spürt die Haut. Hohe Luftfeuchtigkeit heißt nicht automatisch hydratisierte Haut – oft das Gegenteil. Nordseewind bringt Salz und Regen, die die Barriere strapazieren. Fast alle fahren Rad: das Gesicht hängt stundenlang draußen.</p><p>Leitungswasser ist mittelhart; Kalk kann empfindliche Haut reizen. Winter mild aber roh-feucht, um null Grad mit beißender Nässe. Sommer mild und wechselhaft.</p>",
      tipsTitle: "Hautpflege-Tipps für Amsterdam",
      tips: [
        { title: "Gesicht auf dem Rad schützen", body: "Du fährst überall hin – Barrier-Öl vorher. Die Haut will denselben Schutz wie die Beine." },
        { title: "Vondelpark", body: "Grün und frische Luft mitten in der Stadt. Regelmäßige Spaziergänge senken Stress." },
        { title: "Duschfilter", body: "Das Wasser ist nicht das weichste. Ein Filter mildert Kalk für sensible Haut." },
        { title: "Hering und Käse", body: "Matjes liefert Omega-3, holländischer Käse Protein. Lokale Skin-Food-Klassiker." },
        { title: "Luftbefeuchter im Winter", body: "Heizung trocknet die Wohnung. Nachts befeuchten – Barriere bleibt ruhiger." }
      ],
      solutionTitle: "CBD-Hautpflege nach Amsterdam",
      solutionBody: "<p>Versand aus Schweden – 3–5 Werktage nach Amsterdam. Ab 50 € versandkostenfrei.</p><p>Das DUO-kit stärkt die Barriere gegen Wind und Feuchtigkeitsschwankungen. Au Naturel entfernt den Alltagsschmutz. TA-DA Serum gibt extra Feuchtigkeit in stürmischen Monaten.</p>",
      faq: [
        { q: "Liefert ihr in die Niederlande?", a: "Ja, 3–5 Werktage. Ab 50 € versandkostenfrei." },
        { q: "Ist CBD-Kosmetik in den Niederlanden legal?", a: "Ja – eine der progressivsten Haltungen in Europa." },
        { q: "Welches Produkt fürs Amsterdam-Klima?", a: "DUO-kit als Basis, Au Naturel nach dem Radfahren." },
        { q: "Wie lange dauert der Versand?", a: "3–5 Werktage aus Schweden." }
      ],
      ctaTitle: "Gib deiner Haut, was das Amsterdam-Klima verlangt",
      ctaSub: "Natürliche CBD-Pflege von Schweden nach Amsterdam. Ab 50 € versandkostenfrei."
    },
    fr: {
      metaTitle: "Soin du visage Amsterdam – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Amsterdam. Commande en ligne, livraison offerte dès 50 €. Protège ta peau du vent de la mer du Nord, de l’humidité et de l’eau dure.",
      kicker: "Soins à Amsterdam",
      h1: "Soins naturels pour Amsterdam",
      lead: "Amsterdam – canaux, vélos et humidité permanente. Vent du Nord, eau dure et un climat indécis : ta peau en subit les effets toute l’année. Livraison offerte dès 50 €.",
      problemTitle: "Ce qu’Amsterdam fait à ta peau",
      problemBody: "<p>Amsterdam est sous le niveau de la mer – le climat le montre. L’humidité est haute toute l’année, sans pour autant hydrater la peau – souvent l’inverse. Le vent marin apporte sel et pluie qui fragilisent la barrière. Tout le monde à vélo : le visage prend le vent des heures durant.</p><p>L’eau du robinet est modérément dure ; le calcaire peut irriter les peaux sensibles. Hivers pas extrêmement froids mais humides et mordants vers zéro. Étés doux mais capricieux.</p>",
      tipsTitle: "Conseils peau pour Amsterdam",
      tips: [
        { title: "Protège le visage à vélo", body: "Tu roules partout – huile barrière avant de partir. La peau mérite autant de soin que les jambes." },
        { title: "Vondelpark", body: "Vert et air frais au centre. Marches régulières : stress en baisse." },
        { title: "Filtre de douche", body: "L’eau n’est pas la plus douce. Un filtre limite le calcaire sur peaux sensibles." },
        { title: "Hareng et fromage", body: "Hareng matjes : oméga-3 ; fromages néerlandais : protéines. Skin food locale." },
        { title: "Humidificateur l’hiver", body: "Le chauffage assèche l’intérieur. Humidifier la nuit protège la barrière." }
      ],
      solutionTitle: "Soins au CBD livrés à Amsterdam",
      solutionBody: "<p>Expédition depuis la Suède ; 3–5 jours ouvrés jusqu’à Amsterdam. Livraison offerte dès 50 €.</p><p>Le DUO-kit renforce la barrière face au vent et aux variations d’humidité. Au Naturel enlève la saleté du jour. TA-DA Serum apporte de l’humidité en saison venteuse.</p>",
      faq: [
        { q: "Livrez-vous aux Pays-Bas ?", a: "Oui, 3–5 jours ouvrés. Livraison offerte dès 50 €." },
        { q: "Le CBD en cosmétique est-il légal aux Pays-Bas ?", a: "Oui – l’une des attitudes les plus progressistes d’Europe." },
        { q: "Quel produit pour le climat d’Amsterdam ?", a: "DUO-kit au quotidien ; Au Naturel après le vélo." },
        { q: "Délai de livraison ?", a: "3–5 jours ouvrés depuis la Suède." }
      ],
      ctaTitle: "Offre à ta peau ce que le climat d’Amsterdam exige",
      ctaSub: "Soins naturels au CBD de la Suède à Amsterdam. Livraison offerte dès 50 €."
    }
  },
  {
    svSlug: "hudvard-wien",
    enSlug: "skincare-vienna",
    esSlug: "cuidado-piel-cbd-vienna",
    deSlug: "cbd-hautpflege-vienna",
    frSlug: "soin-peau-cbd-vienna",
    category: "stad",
    productIds: ["duo-kit", "ta-da-serum", "au-naturel-makeup-remover"],
    sv: {
      metaTitle: "Hudvård Wien – CBD-hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i Wien. Beställ online med fri frakt över €60. Skydda din hud mot Wiens kontinentala klimat.",
      kicker: "Hudvård i Wien",
      h1: "Naturlig hudvård för dig i Wien",
      lead: "Wien – Europas mest livskvalitativa stad, men med ett kontinentalt klimat som utmanar din hud. Kalla vintrar, heta somrar och stadens unika Pannoniska vindmönster. Fri frakt över €60.",
      problemTitle: "Wienhudens utmaningar",
      problemBody: "<p>Wien har ett utpräglat kontinentalt klimat med kalla, torra vintrar och varma somrar som kan nå trettifem grader. Temperaturskillnaderna mellan årstiderna är stora, och huden utsätts för konstanta anpassningar. Wienervinden – Pannonisk luft från den ungerska slätten – kan vara torr och varm på sommaren, kall och bitande på vintern.</p><p>Stadens vattenkvalitet är utmärkt – alpvatten direkt från bergen – men den torra inomhusluften i Wiens äldre byggnader med radiatorvärme kan vara brutal för huden vintertid.</p>",
      tipsTitle: "Hudvårdstips för wienare",
      tips: [
        { title: "Promenera i Prater", body: "Wiens gröna lunga ger frisk luft och motion. Bra för cirkulationen och stressnivåer." },
        { title: "Utnyttja Wiens kaffekultur rätt", body: "Kaffe i lagom mängd ger antioxidanter. Men balansera med vatten – koffein är uttorkande." },
        { title: "Extra skydd på sommaren", body: "Wiens somrar blir allt hetare. UV-skydd och återfuktning är avgörande juni–augusti." },
        { title: "Ät wienersk kvalitetskost", body: "Wiener Naschmarkt erbjuder allt – frukt, fermenterat, ekologiskt. Huden tackar dig." },
        { title: "Luftfuktare på vintern", body: "Gammal radiatorvärme torkar ut luften. En luftfuktare i sovrummet gör stor skillnad." }
      ],
      solutionTitle: "CBD-hudvård levererad till Wien",
      solutionBody: "<p>Vi skickar från Sverige – leverans till Wien inom 3–5 arbetsdagar. Fri frakt över €60.</p><p>DUO-kit balanserar huden mot Wiens klimatextremer. TA-DA Serum ger extra fukt vintertid. Au Naturel rengör milt efter dagar i stadsluften.</p>",
      faq: [
        { q: "Levererar ni till Österrike?", a: "Ja, 3–5 arbetsdagar. Fri frakt över €60." },
        { q: "Är CBD-hudvård lagligt i Österrike?", a: "Ja, CBD i hudvård är lagligt i Österrike." },
        { q: "Vilken produkt för Wiens vintrar?", a: "TA-DA Serum ger extra barriärskydd mot torr kyla. DUO-kit som daglig bas." },
        { q: "Hur lång tid tar leveransen?", a: "3–5 arbetsdagar från Sverige till Wien." }
      ],
      ctaTitle: "Ge din hud det Wien kräver",
      ctaSub: "Naturlig CBD-hudvård från Sverige till Wien. Fri frakt över €60."
    },
    en: {
      metaTitle: "Skincare Vienna – CBD skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Vienna. Order online with free shipping over €60. Protect your skin from Vienna's continental climate extremes.",
      kicker: "Skincare in Vienna",
      h1: "Natural skincare for Vienna",
      lead: "Vienna – Europe's most liveable city, but with a continental climate that challenges your skin. Cold winters, hot summers, and the city's unique Pannonian wind patterns. Free shipping over €60.",
      problemTitle: "What Vienna does to your skin",
      problemBody: "<p>Vienna has a pronounced continental climate with cold, dry winters and warm summers that can reach thirty-five degrees. The temperature differences between seasons are significant, and the skin faces constant adjustment. The Vienna wind – Pannonian air from the Hungarian plain – can be hot and dry in summer, cold and biting in winter.</p><p>The city's water quality is excellent – Alpine water straight from the mountains – but the dry indoor air in Vienna's older buildings with radiator heating can be brutal for the skin in winter.</p>",
      tipsTitle: "Skincare tips for Viennese residents",
      tips: [
        { title: "Walk in the Prater", body: "Vienna's green lung offers fresh air and exercise. Good for circulation and stress levels." },
        { title: "Use Vienna's coffee culture wisely", body: "Coffee in moderation provides antioxidants. But balance with water – caffeine is dehydrating." },
        { title: "Extra protection in summer", body: "Vienna's summers are getting hotter. UV protection and moisturizing are critical from June to August." },
        { title: "Eat Viennese quality food", body: "Wiener Naschmarkt offers everything – fruit, fermented goods, organic produce. Your skin will thank you." },
        { title: "Humidifier in winter", body: "Old radiator heating dries out the air. A bedroom humidifier makes a significant difference." }
      ],
      solutionTitle: "CBD skincare delivered to Vienna",
      solutionBody: "<p>We ship from Sweden – delivery to Vienna within 3–5 business days. Free shipping on orders over €60.</p><p>The DUO-kit balances the skin against Vienna's climate extremes. TA-DA Serum provides extra moisture in winter. Au Naturel cleanses gently after days in urban air.</p>",
      faq: [
        { q: "Do you ship to Austria?", a: "Yes, 3–5 business days. Free shipping over €60." },
        { q: "Is CBD skincare legal in Austria?", a: "Yes, CBD in skincare is legal in Austria." },
        { q: "Which product for Vienna's winters?", a: "TA-DA Serum provides extra barrier protection against dry cold. DUO-kit as your daily base." },
        { q: "How long does shipping take?", a: "3–5 business days from Sweden to Vienna." }
      ],
      ctaTitle: "Give your skin what Vienna demands",
      ctaSub: "Natural CBD skincare from Sweden to Vienna. Free shipping over €60."
    },
    es: {
      metaTitle: "Cuidado de la piel Viena – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Viena. Pide online, envío gratis desde 50 €. Protege tu piel de los extremos del clima continental.",
      kicker: "Cuidado de la piel en Viena",
      h1: "Cosmética natural para Viena",
      lead: "Viena – una de las ciudades más vivibles de Europa, con un clima continental que no perdona: inviernos fríos, veranos calurosos y vientos pannónicos propios. Envío gratis desde 50 €.",
      problemTitle: "Lo que Viena le hace a tu piel",
      problemBody: "<p>Clima continental marcado: inviernos secos y fríos; veranos que rozan los treinta y cinco. Saltos térmicos entre estaciones – la piel no para de adaptarse. El viento vienés – aire pannónico desde la llanura húngara – en verano caliente y seco; en invierno, frío y cortante.</p><p>El agua es excelente – alpina directa de montaña – pero el aire interior seco de edificios antiguos con radiadores castiga la piel en invierno.</p>",
      tipsTitle: "Consejos para quien vive en Viena",
      tips: [
        { title: "Prater", body: "Pulmón verde: aire y movimiento. Circulación y estrés mejor cuidados." },
        { title: "Café con cabeza", body: "Café con moderación = antioxidantes. Equilibra con agua – la cafeína deshidrata." },
        { title: "Refuerzo en verano", body: "Los veranos suben de temperatura. Protección UV e hidratación de junio a agosto." },
        { title: "Naschmarkt", body: "Fruta, fermentados, bio – la piel lo agradece." },
        { title: "Humidificador en invierno", body: "Radiadores viejos secan el aire. Un humidificador en el dormitorio marca diferencia." }
      ],
      solutionTitle: "Cosmética con CBD con entrega en Viena",
      solutionBody: "<p>Enviamos desde Suecia; 3–5 días laborables hasta Viena. Envío gratis desde 50 €.</p><p>El DUO-kit equilibra la piel ante los extremos climáticos. TA-DA Serum aporta humedad en invierno. Au Naturel limpia con suavidad tras días en el aire urbano.</p>",
      faq: [
        { q: "¿Envían a Austria?", a: "Sí, 3–5 días laborables. Envío gratis desde 50 €." },
        { q: "¿El CBD en cosmética es legal en Austria?", a: "Sí, el CBD en cuidado de la piel es legal en Austria." },
        { q: "¿Qué producto para los inviernos de Viena?", a: "TA-DA Serum refuerza la barrera frente al frío seco; DUO-kit como base diaria." },
        { q: "¿Plazo de envío?", a: "3–5 días laborables desde Suecia hasta Viena." }
      ],
      ctaTitle: "Dale a tu piel lo que Viena exige",
      ctaSub: "Cosmética natural con CBD de Suecia a Viena. Envío gratis desde 50 €."
    },
    de: {
      metaTitle: "Hautpflege Wien – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für Wien. Online bestellen, ab 50 € versandkostenfrei. Schutz vor kontinentalem Klima und pannonischen Winden.",
      kicker: "Hautpflege in Wien",
      h1: "Natürliche Hautpflege für Wien",
      lead: "Wien – lebenswert wie kaum eine Stadt, aber mit kontinentalem Klima: kalte Winter, heiße Sommer und typische pannonische Windmuster. Ab 50 € versandkostenfrei.",
      problemTitle: "Was Wien mit deiner Haut macht",
      problemBody: "<p>Ausgeprägtes Kontinentalklima: trockene, kalte Winter; warme Sommer bis etwa fünfunddreißig Grad. Große Temperatursprünge – die Haut muss ständig umschalten. Der Wiener Wind – pannonische Luft aus der ungarischen Ebene – im Sommer heiß und trocken, im Winter kalt und beißend.</p><p>Das Wasser ist top – Alpenwasser – aber trockene Raumluft in Altbauten mit Radiatoren ist im Winter brutal für die Haut.</p>",
      tipsTitle: "Hautpflege-Tipps für Wien",
      tips: [
        { title: "Prater", body: "Grüne Lunge: frische Luft, Bewegung – gut für Kreislauf und Stress." },
        { title: "Kaffee mit Verstand", body: "In Maßen Antioxidantien – aber mit Wasser ausgleichen, Koffein trocknet aus." },
        { title: "Extra-Schutz im Sommer", body: "Die Sommer werden heißer. UV-Schutz und Feuchtigkeit Juni–August sind Pflicht." },
        { title: "Naschmarkt", body: "Obst, Fermentiertes, Bio – die Haut dankt es dir." },
        { title: "Luftbefeuchter im Winter", body: "Alte Radiatoren trocknen die Luft. Im Schlafzimmer befeuchten hilft enorm." }
      ],
      solutionTitle: "CBD-Hautpflege nach Wien",
      solutionBody: "<p>Versand aus Schweden – 3–5 Werktage nach Wien. Ab 50 € versandkostenfrei.</p><p>Das DUO-kit balanciert bei Wiens Klimaextremen. TA-DA Serum spendet im Winter extra Feuchtigkeit. Au Naturel reinigt mild nach Stadt-Luft-Tagen.</p>",
      faq: [
        { q: "Liefert ihr nach Österreich?", a: "Ja, 3–5 Werktage. Ab 50 € versandkostenfrei." },
        { q: "Ist CBD-Kosmetik in Österreich legal?", a: "Ja, CBD in Hautpflege ist in Österreich erlaubt." },
        { q: "Welches Produkt für Wiener Winter?", a: "TA-DA Serum stärkt die Barriere gegen trockene Kälte; DUO-kit als tägliche Basis." },
        { q: "Wie lange dauert der Versand?", a: "3–5 Werktage aus Schweden nach Wien." }
      ],
      ctaTitle: "Gib deiner Haut, was Wien verlangt",
      ctaSub: "Natürliche CBD-Pflege von Schweden nach Wien. Ab 50 € versandkostenfrei."
    },
    fr: {
      metaTitle: "Soin du visage Vienne – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Vienne. Commande en ligne, livraison offerte dès 50 €. Protège ta peau des extrêmes du climat continental.",
      kicker: "Soins à Vienne",
      h1: "Soins naturels pour Vienne",
      lead: "Vienne – ville très agréable à vivre, mais au climat continental exigeant : hivers froids, étés chauds et vents pannoniens typiques. Livraison offerte dès 50 €.",
      problemTitle: "Ce que Vienne fait à ta peau",
      problemBody: "<p>Climat continental marqué : hivers froids et secs ; étés pouvant atteindre trente-cinq degrés. Écarts saisonniers importants – la peau s’adapte en continu. Le vent viennois – air pannonien venu de la plaine hongroise – chaud et sec l’été, froid et mordant l’hiver.</p><p>L’eau est excellente – alpine – mais l’air sec des vieux immeubles chauffés au radiateur est brutal pour la peau en hiver.</p>",
      tipsTitle: "Conseils peau pour Vienne",
      tips: [
        { title: "Prater", body: "Poumon vert : air et mouvement – circulation et stress mieux gérés." },
        { title: "Café avec mesure", body: "En modération, antioxydants – mais équilibre avec de l’eau : la caféine déshydrate." },
        { title: "Renfort l’été", body: "Les étés se réchauffent. UV et hydratation juin–août sont critiques." },
        { title: "Naschmarkt", body: "Fruits, fermentés, bio – la peau te remercie." },
        { title: "Humidificateur l’hiver", body: "Vieux radiateurs assèchent l’air. Humidifier la chambre change la donne." }
      ],
      solutionTitle: "Soins au CBD livrés à Vienne",
      solutionBody: "<p>Expédition depuis la Suède ; 3–5 jours ouvrés jusqu’à Vienne. Livraison offerte dès 50 €.</p><p>Le DUO-kit équilibre la peau face aux extrêmes. TA-DA Serum hydrate davantage en hiver. Au Naturel nettoie en douceur après les journées en air urbain.</p>",
      faq: [
        { q: "Livrez-vous en Autriche ?", a: "Oui, 3–5 jours ouvrés. Livraison offerte dès 50 €." },
        { q: "Le CBD en cosmétique est-il légal en Autriche ?", a: "Oui, le CBD dans les soins est légal en Autriche." },
        { q: "Quel produit pour les hivers viennois ?", a: "TA-DA Serum renforce la barrière contre le froid sec ; DUO-kit comme base quotidienne." },
        { q: "Délai de livraison ?", a: "3–5 jours ouvrés de la Suède à Vienne." }
      ],
      ctaTitle: "Offre à ta peau ce que Vienne exige",
      ctaSub: "Soins naturels au CBD de la Suède à Vienne. Livraison offerte dès 50 €."
    }
  },
  {
    svSlug: "hudvard-bryssel",
    enSlug: "skincare-brussels",
    esSlug: "cuidado-piel-cbd-brussels",
    deSlug: "cbd-hautpflege-brussels",
    frSlug: "soin-peau-cbd-brussels",
    category: "stad",
    productIds: ["duo-kit", "au-naturel-makeup-remover", "fungtastic-mushroom-extract"],
    sv: {
      metaTitle: "Hudvård Bryssel – CBD-hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i Bryssel. Beställ online med fri frakt över €60. Skydda din hud mot Bryssels fuktiga klimat.",
      kicker: "Hudvård i Bryssel",
      h1: "Naturlig hudvård för dig i Bryssel",
      lead: "Bryssel – Europas politiska hjärta med ett klimat som svänger mellan regniga grå dagar och överraskande milda perioder. Fri frakt över €60.",
      problemTitle: "Brysselhudens utmaningar",
      problemBody: "<p>Bryssel har ett maritimt klimat med rikligt med regn och molnighet. Huden utsätts för konstant fukt utifrån men kan ändå bli uttorkad av uppvärmd inomhusluft. Belgiens trafikföroreningar – särskilt i den trånga Brysselregionen – belastar huden med fina partiklar.</p><p>Bryssels stressiga internationella arbetsmiljö bidrar till förhöjda kortisolnivåer som påverkar hudens hälsa direkt.</p>",
      tipsTitle: "Hudvårdstips för brysselboar",
      tips: [
        { title: "Rengör efter pendlingen", body: "Bryssels trafik och tunnelbana belastar huden med partiklar. Rengör milt så snart du kan." },
        { title: "Promenera i Bois de la Cambre", body: "Bryssels stora park ger ren luft och grönska. Bra för stressreducering." },
        { title: "Belgisk choklad med måtta", body: "Mörk choklad ger antioxidanter. Njut med gott samvete – i lagom mängd." },
        { title: "Luftfuktare hemma", body: "Belgiska hem blir torra inomhus vintertid. En luftfuktare skyddar din hudbarriär." },
        { title: "Hantera EU-stressen", body: "Bryssel är en stressad stad. Meditation, motion och bra sömn – din hud reflekterar din livsstil." }
      ],
      solutionTitle: "CBD-hudvård levererad till Bryssel",
      solutionBody: "<p>Vi skickar från Sverige – leverans till Bryssel inom 3–5 arbetsdagar. Fri frakt över €60.</p><p>DUO-kit stärker barriären. Au Naturel rengör bort föroreningar. Fungtastic stödjer immunförsvaret i den grå belgiska vintern.</p>",
      faq: [
        { q: "Levererar ni till Belgien?", a: "Ja, 3–5 arbetsdagar. Fri frakt över €60." },
        { q: "Är CBD-hudvård lagligt i Belgien?", a: "Ja, CBD i hudvård är lagligt i Belgien." },
        { q: "Vilken produkt för Bryssels klimat?", a: "DUO-kit som bas, Au Naturel för daglig rengöring." },
        { q: "Hur lång tid tar leveransen?", a: "3–5 arbetsdagar." }
      ],
      ctaTitle: "Ge din hud det Bryssel kräver",
      ctaSub: "Naturlig CBD-hudvård från Sverige till Bryssel. Fri frakt över €60."
    },
    en: {
      metaTitle: "Skincare Brussels – CBD skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Brussels. Order online with free shipping over €60. Protect your skin from Brussels' damp climate and urban pollution.",
      kicker: "Skincare in Brussels",
      h1: "Natural skincare for Brussels",
      lead: "Brussels – Europe's political heart with a climate that swings between rainy grey days and surprisingly mild spells. Free shipping over €60.",
      problemTitle: "What Brussels does to your skin",
      problemBody: "<p>Brussels has a maritime climate with plenty of rain and overcast skies. The skin is exposed to constant outdoor moisture but can still become dehydrated from heated indoor air. Belgium's traffic pollution – especially in the congested Brussels region – loads the skin with fine particles.</p><p>Brussels' stressful international work environment contributes to elevated cortisol levels that affect skin health directly.</p>",
      tipsTitle: "Skincare tips for Brussels residents",
      tips: [
        { title: "Cleanse after the commute", body: "Brussels' traffic and metro stress the skin with particles. Cleanse gently as soon as you can." },
        { title: "Walk in Bois de la Cambre", body: "Brussels' great park offers clean air and greenery. Perfect for stress reduction." },
        { title: "Belgian chocolate in moderation", body: "Dark chocolate provides antioxidants. Enjoy guilt-free – in moderate amounts." },
        { title: "Humidifier at home", body: "Belgian homes become dry indoors in winter. A humidifier protects your skin barrier." },
        { title: "Manage the EU stress", body: "Brussels is a stressed city. Meditation, exercise, and good sleep – your skin reflects your lifestyle." }
      ],
      solutionTitle: "CBD skincare delivered to Brussels",
      solutionBody: "<p>We ship from Sweden – delivery to Brussels within 3–5 business days. Free shipping on orders over €60.</p><p>The DUO-kit strengthens the barrier. Au Naturel cleans away pollution. Fungtastic supports immunity during the grey Belgian winter.</p>",
      faq: [
        { q: "Do you ship to Belgium?", a: "Yes, 3–5 business days. Free shipping over €60." },
        { q: "Is CBD skincare legal in Belgium?", a: "Yes, CBD in skincare is legal in Belgium." },
        { q: "Which product for Brussels' climate?", a: "DUO-kit as your base, Au Naturel for daily cleansing." },
        { q: "How long does shipping take?", a: "3–5 business days." }
      ],
      ctaTitle: "Give your skin what Brussels demands",
      ctaSub: "Natural CBD skincare from Sweden to Brussels. Free shipping over €60."
    },
    es: {
      metaTitle: "Cuidado de la piel Bruselas – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Bruselas. Pide online, envío gratis desde 50 €. Protege tu piel del clima húmedo y la contaminación urbana.",
      kicker: "Cuidado de la piel en Bruselas",
      h1: "Cosmética natural para Bruselas",
      lead: "Bruselas – corazón político de Europa con un clima que alterna días grises de lluvia y treguas sorprendentemente suaves. Envío gratis desde 50 €.",
      problemTitle: "Lo que Bruselas le hace a tu piel",
      problemBody: "<p>Clima marítimo: mucha lluvia y cielo cubierto. Humedad exterior constante, pero la piel puede deshidratarse por el aire seco de la calefacción. La contaminación del tráfico – sobre todo en la región congestionada – deposita partículas finas.</p><p>El ritmo laboral internacional y el estrés elevan el cortisol y la piel lo paga.</p>",
      tipsTitle: "Consejos para quien vive en Bruselas",
      tips: [
        { title: "Limpia tras el trayecto", body: "Tráfico y metro cargan la piel de partículas. Limpieza suave en cuanto puedas." },
        { title: "Bois de la Cambre", body: "Gran parque: aire más limpio y verde. Baja el estrés." },
        { title: "Chocolate belga, con mesura", body: "Negro = antioxidantes. Sin culpa – en cantidades razonables." },
        { title: "Humidificador en casa", body: "En invierno el interior se seca. Humidificar protege la barrera." },
        { title: "Gestiona el estrés UE", body: "Ciudad tensa. Meditación, movimiento, sueño – la piel refleja el estilo de vida." }
      ],
      solutionTitle: "Cosmética con CBD con entrega en Bruselas",
      solutionBody: "<p>Enviamos desde Suecia; 3–5 días laborables hasta Bruselas. Envío gratis desde 50 €.</p><p>El DUO-kit refuerza la barrera. Au Naturel elimina la contaminación del día. Fungtastic Mushroom Extract apoya la inmunidad en el invierno gris belga.</p>",
      faq: [
        { q: "¿Envían a Bélgica?", a: "Sí, 3–5 días laborables. Envío gratis desde 50 €." },
        { q: "¿El CBD en cosmética es legal en Bélgica?", a: "Sí, el CBD en cuidado de la piel es legal en Bélgica." },
        { q: "¿Qué producto para el clima de Bruselas?", a: "DUO-kit como base; Au Naturel para la limpieza diaria." },
        { q: "¿Plazo de envío?", a: "3–5 días laborables." }
      ],
      ctaTitle: "Dale a tu piel lo que Bruselas exige",
      ctaSub: "Cosmética natural con CBD de Suecia a Bruselas. Envío gratis desde 50 €."
    },
    de: {
      metaTitle: "Hautpflege Brüssel – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für Brüssel. Online bestellen, ab 50 € versandkostenfrei. Schutz vor feuchtem Klima und urbaner Luftbelastung.",
      kicker: "Hautpflege in Brüssel",
      h1: "Natürliche Hautpflege für Brüssel",
      lead: "Brüssel – politisches Herz Europas, dazwischen regnerisch-graue Tage und überraschend milde Phasen. Ab 50 € versandkostenfrei.",
      problemTitle: "Was Brüssel mit deiner Haut macht",
      problemBody: "<p>Maritimes Klima: viel Regen und Bewölkung. Draußen dauernd Feuchte, drinnen kann die Haut trotzdem austrocknen – Heizluft. Verkehrsabgase, besonders in der dichten Region, setzen Feinstaub auf die Haut.</p><p>Internationaler Job-Stress hebt Cortisol – die Haut reagiert direkt.</p>",
      tipsTitle: "Hautpflege-Tipps für Brüssel",
      tips: [
        { title: "Nach dem Pendeln reinigen", body: "Verkehr und Metro belasten mit Partikeln. Sanft reinigen, sobald es geht." },
        { title: "Bois de la Cambre", body: "Großer Park – sauberere Luft, Grün, Stress runter." },
        { title: "Belgische Schokolade – maßvoll", body: "Zartbitter liefert Antioxidantien. Genießen – aber nicht übertreiben." },
        { title: "Luftbefeuchter zuhause", body: "Im Winter trocknet die Wohnung. Befeuchten schützt die Barriere." },
        { title: "EU-Stress managen", body: "Anstrengende Stadt. Meditation, Bewegung, Schlaf – die Haut spiegelt den Lifestyle." }
      ],
      solutionTitle: "CBD-Hautpflege nach Brüssel",
      solutionBody: "<p>Versand aus Schweden – 3–5 Werktage nach Brüssel. Ab 50 € versandkostenfrei.</p><p>Das DUO-kit stärkt die Barriere. Au Naturel entfernt Schmutz und Abgase. Fungtastic Mushroom Extract unterstützt die Immunität im grauen belgischen Winter.</p>",
      faq: [
        { q: "Liefert ihr nach Belgien?", a: "Ja, 3–5 Werktage. Ab 50 € versandkostenfrei." },
        { q: "Ist CBD-Kosmetik in Belgien legal?", a: "Ja, CBD in Hautpflege ist in Belgien erlaubt." },
        { q: "Welches Produkt fürs Brüssel-Klima?", a: "DUO-kit als Basis, Au Naturel zur täglichen Reinigung." },
        { q: "Wie lange dauert der Versand?", a: "3–5 Werktage." }
      ],
      ctaTitle: "Gib deiner Haut, was Brüssel verlangt",
      ctaSub: "Natürliche CBD-Pflege von Schweden nach Brüssel. Ab 50 € versandkostenfrei."
    },
    fr: {
      metaTitle: "Soin du visage Bruxelles – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Bruxelles. Commande en ligne, livraison offerte dès 50 €. Protège ta peau du climat humide et de la pollution urbaine.",
      kicker: "Soins à Bruxelles",
      h1: "Soins naturels pour Bruxelles",
      lead: "Bruxelles – cœur politique de l’Europe, entre journées grises pluvieuses et éclaircies plus douces qu’on ne croit. Livraison offerte dès 50 €.",
      problemTitle: "Ce que Bruxelles fait à ta peau",
      problemBody: "<p>Climat maritime : pluie et ciel couvert. Humidité dehors, mais la peau peut se déshydrater à cause de l’air chauffé à l’intérieur. La pollution routière – surtout dans la région congestionnée – dépose des particules fines.</p><p>Le rythme de travail international et le stress font monter le cortisol – la peau le ressent.</p>",
      tipsTitle: "Conseils peau pour Bruxelles",
      tips: [
        { title: "Nettoie après les trajets", body: "Trafic et métro chargent la peau en particules. Nettoyage doux dès que possible." },
        { title: "Bois de la Cambre", body: "Grand parc : air plus pur, vert, stress en baisse." },
        { title: "Chocolat belge avec mesure", body: "Le noir apporte des antioxydants. Plaisir sans excès." },
        { title: "Humidificateur à la maison", body: "L’intérieur s’assèche l’hiver. Humidifier protège la barrière." },
        { title: "Gérer le stress UE", body: "Ville tendue. Méditation, mouvement, sommeil – la peau reflète le mode de vie." }
      ],
      solutionTitle: "Soins au CBD livrés à Bruxelles",
      solutionBody: "<p>Expédition depuis la Suède ; 3–5 jours ouvrés jusqu’à Bruxelles. Livraison offerte dès 50 €.</p><p>Le DUO-kit renforce la barrière. Au Naturel enlève la pollution du jour. Fungtastic Mushroom Extract soutient l’immunité pendant l’hiver gris belge.</p>",
      faq: [
        { q: "Livrez-vous en Belgique ?", a: "Oui, 3–5 jours ouvrés. Livraison offerte dès 50 €." },
        { q: "Le CBD en cosmétique est-il légal en Belgique ?", a: "Oui, le CBD dans les soins est légal en Belgique." },
        { q: "Quel produit pour le climat de Bruxelles ?", a: "DUO-kit comme base ; Au Naturel pour le nettoyage quotidien." },
        { q: "Délai de livraison ?", a: "3–5 jours ouvrés." }
      ],
      ctaTitle: "Offre à ta peau ce que Bruxelles exige",
      ctaSub: "Soins naturels au CBD de la Suède à Bruxelles. Livraison offerte dès 50 €."
    }
  },
  // ──────────────────────────────────────────────
  // WESTERN EUROPE (UK, Ireland, France)
  // ──────────────────────────────────────────────
  {
    svSlug: "hudvard-london",
    enSlug: "skincare-london",
    esSlug: "cuidado-piel-cbd-london",
    deSlug: "cbd-hautpflege-london",
    frSlug: "soin-peau-cbd-london",
    category: "stad",
    productIds: ["duo-kit", "au-naturel-makeup-remover", "ta-da-serum"],
    sv: {
      metaTitle: "Hudvård London – CBD-hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i London. Beställ online med fri frakt över €60. Skydda din hud mot Londons föroreningar och extremt hårda vatten.",
      kicker: "Hudvård i London",
      h1: "Naturlig hudvård för dig i London",
      lead: "London – världsmetropolens mörka hemlighet är dess extremt hårda vatten och luftföroreningar som förstör din hud i det tysta. Fri frakt över €60 (cirka £45), leverans inom 5–7 arbetsdagar.",
      problemTitle: "Londonhudens utmaningar",
      problemBody: "<p>Londons kranvatten är bland det hårdaste i Europa. Kalkhalten är så hög att den lämnar vita avlagringar på allt den rör – inklusive din hud. Torr hud, eksem och irritation är vanligare i London än i nästan vilken annan europeisk storstad som helst, och vattnet är en stor bov.</p><p>Luftkvaliteten i centrala London har förbättrats men är fortfarande problematisk. Oxford Street, Piccadilly och de flesta huvudleder har partikelhalter som överstiger WHO:s riktlinjer. Tube – Londons tunnelbana – har extremt höga metallpartikelhalter i luften, liknande Stockholms tunnelbana men i ännu större skala.</p><p>Det grå, fuktiga klimatet med molniga dagar och regn bidrar till D-vitaminbrist hos en stor del av befolkningen, vilket påverkar hudens immunförsvar och läkningsförmåga.</p>",
      tipsTitle: "Hudvårdstips för londonbor",
      tips: [
        { title: "Installera ett duschfilter", body: "Det bästa enskilda du kan göra för din hy i London. Kalkfiltret gör enorm skillnad för torr och irriterad hud." },
        { title: "Rengör efter the Tube", body: "Londons tunnelbana har extremt höga halter av järnpartiklar. En mild rengöring efter pendlingen är avgörande." },
        { title: "Promenera i Hyde Park", body: "Londons parker ger ren luft mitt i smogen. Regelbundna promenader sänker kortisol och gynnar huden." },
        { title: "D-vitamin året runt", body: "London har begränsat solljus. NHS rekommenderar tillskott – lyssna på dem." },
        { title: "Ät från Borough Market", body: "Fermenterade grönsaker, ekologiskt kött, vildlax – Borough Market har allt huden behöver inifrån." }
      ],
      solutionTitle: "CBD-hudvård levererad till London",
      solutionBody: "<p>Vi skickar från Sverige – leverans till London inom 5–7 arbetsdagar. Fri frakt över €60 (cirka £45).</p><p>DUO-kit stärker hudbarriären mot Londons hårda vatten. Au Naturel Makeup Remover rengör bort partiklar och smuts från the Tube utan att stressa huden. TA-DA Serum ger extra barriärskydd under kalla, fuktiga vintermånader.</p>",
      faq: [
        { q: "Levererar ni till Storbritannien?", a: "Ja, leverans inom 5–7 arbetsdagar. Fri frakt över €60 (cirka £45)." },
        { q: "Är CBD-hudvård lagligt i UK?", a: "Ja, CBD i hudvårdsprodukter är fullt lagligt i Storbritannien." },
        { q: "Vilken produkt för Londons hårda vatten?", a: "DUO-kit stärker barriären som hårt vatten försvagar dagligen." },
        { q: "Finns det tull vid leverans?", a: "Beställningar under £135 importeras normalt tullfritt. En liten importmoms kan tillkomma." }
      ],
      ctaTitle: "Ge din hud det London kräver",
      ctaSub: "Naturlig CBD-hudvård från Sverige till London. Fri frakt över €60."
    },
    en: {
      metaTitle: "Skincare London – CBD skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for London. Order online with free shipping over €60. Protect your skin from London's extremely hard water and urban pollution.",
      kicker: "Skincare in London",
      h1: "Natural skincare for London",
      lead: "London – the world capital's dirty secret is its extremely hard water and air pollution that silently destroys your skin. Free shipping over €60 (approximately £45), delivered within 5–7 business days.",
      problemTitle: "What London does to your skin",
      problemBody: "<p>London's tap water is among the hardest in Europe. Calcium levels are so high they leave white deposits on everything they touch – including your skin. Dry skin, eczema, and irritation are more common in London than in almost any other major European city, and the water is a major culprit.</p><p>Air quality in central London has improved but remains problematic. Oxford Street, Piccadilly, and most main roads have particle levels exceeding WHO guidelines. The Tube – London's Underground – has extremely high airborne metal particle levels, similar to Stockholm's subway but on an even larger scale.</p><p>The grey, damp climate with overcast days and rain contributes to vitamin D deficiency in a large portion of the population, which affects the skin's immune response and healing capacity.</p>",
      tipsTitle: "Skincare tips for Londoners",
      tips: [
        { title: "Install a shower filter", body: "The single best thing you can do for your complexion in London. A limescale filter makes an enormous difference for dry and irritated skin." },
        { title: "Cleanse after the Tube", body: "London's Underground has extremely high levels of iron particles. A gentle cleanse after commuting is essential." },
        { title: "Walk in Hyde Park", body: "London's parks offer clean air amid the pollution. Regular walks lower cortisol and benefit the skin." },
        { title: "Vitamin D year-round", body: "London has limited sunlight. The NHS recommends supplements – listen to them." },
        { title: "Eat from Borough Market", body: "Fermented vegetables, organic meat, wild salmon – Borough Market has everything your skin needs from within." }
      ],
      solutionTitle: "CBD skincare delivered to London",
      solutionBody: "<p>We ship from Sweden – delivery to London within 5–7 business days. Free shipping on orders over €60 (approximately £45).</p><p>The DUO-kit strengthens the skin barrier against London's hard water. Au Naturel Makeup Remover cleans away particles and grime from the Tube without stressing the skin. TA-DA Serum provides extra barrier protection during cold, damp winter months.</p>",
      faq: [
        { q: "Do you ship to the UK?", a: "Yes, delivery within 5–7 business days. Free shipping over €60 (approximately £45)." },
        { q: "Is CBD skincare legal in the UK?", a: "Yes, CBD in skincare products is fully legal in the United Kingdom." },
        { q: "Which product for London's hard water?", a: "The DUO-kit strengthens the barrier that hard water weakens on a daily basis." },
        { q: "Are there customs charges?", a: "Orders under £135 are normally imported duty-free. A small import VAT may apply." }
      ],
      ctaTitle: "Give your skin what London demands",
      ctaSub: "Natural CBD skincare from Sweden to London. Free shipping over €60."
    },
    es: {
      metaTitle: "Cuidado de la piel Londres – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Londres. Pide online, envío gratis desde 50 €. Protege tu piel del agua extremadamente dura y la contaminación urbana.",
      kicker: "Cuidado de la piel en Londres",
      h1: "Cosmética natural para Londres",
      lead: "Londres – el secreto sucio de la capital mundial es un agua durísima y un aire que destroza la piel en silencio. Envío gratis desde 50 € (unas 45 £); entrega en 5–7 días laborables.",
      problemTitle: "Lo que Londres le hace a tu piel",
      problemBody: "<p>El agua del grifo en Londres está entre las más duras de Europa. Tanto calcio que deja residuos blancos en todo lo que toca – piel incluida. Piel seca, eccema e irritación son más frecuentes aquí que en casi cualquier gran ciudad europea; el agua es un culpable gordo.</p><p>La calidad del aire en el centro ha mejorado pero sigue siendo problemática. Oxford Street, Piccadilly y las vías principales superan las guías de la OMS. El Tube tiene niveles altísimos de partículas metálicas en el aire – parecido al metro de Estocolmo pero a mayor escala.</p><p>El clima gris y húmedo, con días nublados y lluvia, favorece déficit de vitamina D en mucha población – y eso afecta la respuesta inmune y la capacidad de reparación de la piel.</p>",
      tipsTitle: "Consejos para quien vive en Londres",
      tips: [
        { title: "Filtro de ducha", body: "Lo mejor que puedes hacer por tu cutis en Londres. Quitar cal hace una diferencia enorme en piel seca o irritada." },
        { title: "Limpia tras el Tube", body: "El metro londinense arrastra muchísimas partículas de hierro. Limpieza suave al volver del trayecto: imprescindible." },
        { title: "Hyde Park", body: "Los parques dan aire más limpio entre el smog. Paseos regulares bajan el cortisol y ayudan a la piel." },
        { title: "Vitamina D todo el año", body: "Poco sol. El NHS recomienda suplementos – hazle caso." },
        { title: "Borough Market", body: "Verduras fermentadas, carne ecológica, salmón salvaje – todo lo que la piel pide por dentro." }
      ],
      solutionTitle: "Cosmética con CBD con entrega en Londres",
      solutionBody: "<p>Enviamos desde Suecia; 5–7 días laborables hasta Londres. Envío gratis desde 50 € (unas 45 £).</p><p>El DUO-kit refuerza la barrera frente al agua dura. Au Naturel Makeup Remover limpia partículas y mugre del Tube sin castigar la piel. TA-DA Serum aporta barrera extra en inviernos fríos y húmedos.</p>",
      faq: [
        { q: "¿Envían al Reino Unido?", a: "Sí, 5–7 días laborables. Envío gratis desde 50 € (unas 45 £)." },
        { q: "¿El CBD en cosmética es legal en el Reino Unido?", a: "Sí, el CBD en productos de cuidado de la piel es plenamente legal en el Reino Unido." },
        { q: "¿Qué producto para el agua dura de Londres?", a: "El DUO-kit refuerza la barrera que el agua dura desgasta cada día." },
        { q: "¿Hay aranceles o impuestos de importación?", a: "Pedidos por debajo de 135 £ suelen entrar sin aranceles. Puede aplicarse un IVA de importación reducido." }
      ],
      ctaTitle: "Dale a tu piel lo que Londres exige",
      ctaSub: "Cosmética natural con CBD de Suecia a Londres. Envío gratis desde 50 €."
    },
    de: {
      metaTitle: "Hautpflege London – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für London. Online bestellen, ab 50 € versandkostenfrei. Schutz vor extrem hartem Wasser und urbaner Luftverschmutzung.",
      kicker: "Hautpflege in London",
      h1: "Natürliche Hautpflege für London",
      lead: "London – das schmutzige Geheimnis der Weltstadt: extrem hartes Wasser und Luftverschmutzung, die der Haut leise zusetzen. Ab 50 € (ca. £45) versandkostenfrei, Lieferung in 5–7 Werktagen.",
      problemTitle: "Was London mit deiner Haut macht",
      problemBody: "<p>Londons Leitungswasser gehört zu Europas härtestem. So viel Kalk, dass weiße Rückstände auf allem bleiben – Haut inklusive. Trockene Haut, Ekzeme und Reizungen sind hier häufiger als in fast jeder anderen europäischen Metropole, und das Wasser ist ein Hauptverdächtiger.</p><p>Die Luftqualität im Zentrum hat sich verbessert, bleibt aber problematisch. Oxford Street, Piccadilly und Hauptstraßen überschreiten WHO-Richtwerte. Die Tube hat extrem hohe metallische Partikel in der Luft – ähnlich wie Stockholms U-Bahn, nur größer.</p><p>Das graue, feuchte Klima mit Regen und Bewölkung begünstigt Vitamin-D-Mangel – das schwächt Immunantwort und Regeneration der Haut.</p>",
      tipsTitle: "Hautpflege-Tipps für London",
      tips: [
        { title: "Duschfilter", body: "Das Beste fürs Gesicht in London. Kalkfilter macht einen riesigen Unterschied bei trockener, gereizter Haut." },
        { title: "Nach der Tube reinigen", body: "Extrem hohe Eisenpartikel. Sanfte Reinigung nach dem Pendeln ist Pflicht." },
        { title: "Hyde Park", body: "Parks liefern sauberere Luft im Smog. Spaziergänge senken Cortisol und tun der Haut gut." },
        { title: "Vitamin D ganzjährig", body: "Wenig Sonne. NHS empfiehlt Supplemente – hör drauf." },
        { title: "Borough Market", body: "Fermentiertes Gemüse, Bio-Fleisch, Wildlachs – alles, was die Haut innen braucht." }
      ],
      solutionTitle: "CBD-Hautpflege nach London",
      solutionBody: "<p>Versand aus Schweden – 5–7 Werktage nach London. Ab 50 € (ca. £45) versandkostenfrei.</p><p>Das DUO-kit stärkt die Barriere gegen hartes Wasser. Au Naturel Makeup Remover entfernt Partikel und Schmutz von der Tube ohne Stress für die Haut. TA-DA Serum gibt extra Barriere in kalten, feuchten Wintern.</p>",
      faq: [
        { q: "Liefert ihr ins UK?", a: "Ja, 5–7 Werktage. Ab 50 € (ca. £45) versandkostenfrei." },
        { q: "Ist CBD-Kosmetik im UK legal?", a: "Ja, CBD in Hautpflegeprodukten ist im Vereinigten Königreich vollständig legal." },
        { q: "Welches Produkt fürs harte London-Wasser?", a: "Das DUO-kit stärkt die Barriere, die hartes Wasser täglich schwächt." },
        { q: "Fallen Zollgebühren an?", a: "Bestellungen unter £135 sind meist zollfrei. Eine kleine Import-Umsatzsteuer kann anfallen." }
      ],
      ctaTitle: "Gib deiner Haut, was London verlangt",
      ctaSub: "Natürliche CBD-Pflege von Schweden nach London. Ab 50 € versandkostenfrei."
    },
    fr: {
      metaTitle: "Soin du visage Londres – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Londres. Commande en ligne, livraison offerte dès 50 €. Protège ta peau de l’eau ultra-dure et de la pollution urbaine.",
      kicker: "Soins à Londres",
      h1: "Soins naturels pour Londres",
      lead: "Londres – le secret sale de la capitale mondiale, c’est une eau ultra-calcaire et une pollution qui abîme la peau en silence. Livraison offerte dès 50 € (environ 45 £), délai 5–7 jours ouvrés.",
      problemTitle: "Ce que Londres fait à ta peau",
      problemBody: "<p>L’eau du robinet à Londres compte parmi les plus dures d’Europe. Tant de calcium que tout ce qu’elle touche se couvre de dépôts blancs – la peau y compris. Peau sèche, eczéma et irritations y sont plus fréquents que dans presque toute autre grande ville européenne, et l’eau est un coupable majeur.</p><p>La qualité de l’air au centre s’est améliorée mais reste problématique. Oxford Street, Piccadilly et les grands axes dépassent les repères de l’OMS. Le Tube affiche des niveaux extrêmes de particules métalliques dans l’air – proche du métro de Stockholm, mais à plus grande échelle.</p><p>Le climat gris et humide, pluie et ciel couvert, favorise la carence en vitamine D chez une grande partie de la population – ce qui affecte l’immunité cutanée et la capacité de réparation.</p>",
      tipsTitle: "Conseils peau pour Londres",
      tips: [
        { title: "Filtre de douche", body: "Le meilleur geste pour ton teint à Londres. Anti-calcaire : énorme différence sur peau sèche ou irritée." },
        { title: "Nettoie après le Tube", body: "Le métro londonien charrie des quantités énormes de particules de fer. Nettoyage doux après le trajet : indispensable." },
        { title: "Hyde Park", body: "Les parcs offrent un air plus propre au milieu du smog. Marches régulières : cortisol en baisse, peau qui respire." },
        { title: "Vitamine D toute l’année", body: "Peu de soleil. Le NHS recommande des compléments – écoute-les." },
        { title: "Borough Market", body: "Légumes fermentés, viande bio, saumon sauvage – tout ce dont la peau a besoin de l’intérieur." }
      ],
      solutionTitle: "Soins au CBD livrés à Londres",
      solutionBody: "<p>Expédition depuis la Suède ; 5–7 jours ouvrés jusqu’à Londres. Livraison offerte dès 50 € (environ 45 £).</p><p>Le DUO-kit renforce la barrière face à l’eau dure. Au Naturel Makeup Remover enlève particules et crasse du Tube sans agresser. TA-DA Serum renforce la barrière pendant les hivers froids et humides.</p>",
      faq: [
        { q: "Livrez-vous au Royaume-Uni ?", a: "Oui, 5–7 jours ouvrés. Livraison offerte dès 50 € (environ 45 £)." },
        { q: "Le CBD en cosmétique est-il légal au Royaume-Uni ?", a: "Oui, le CBD dans les soins est entièrement légal au Royaume-Uni." },
        { q: "Quel produit pour l’eau dure à Londres ?", a: "Le DUO-kit renforce la barrière que l’eau dure érode au quotidien." },
        { q: "Y a-t-il des frais de douane ?", a: "Les commandes sous 135 £ sont en principe sans droits. Une petite TVA d’import peut s’appliquer." }
      ],
      ctaTitle: "Offre à ta peau ce que Londres exige",
      ctaSub: "Soins naturels au CBD de la Suède à Londres. Livraison offerte dès 50 €."
    }
  },
  {
    svSlug: "hudvard-dublin",
    enSlug: "skincare-dublin",
    esSlug: "cuidado-piel-cbd-dublin",
    deSlug: "cbd-hautpflege-dublin",
    frSlug: "soin-peau-cbd-dublin",
    category: "stad",
    productIds: ["duo-kit", "ta-da-serum", "fungtastic-mushroom-extract"],
    sv: {
      metaTitle: "Hudvård Dublin – CBD-hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i Dublin. Beställ online med fri frakt över €60. Skydda din hud mot det irländska regnklimatet.",
      kicker: "Hudvård i Dublin",
      h1: "Naturlig hudvård för dig i Dublin",
      lead: "Dublin – vacker, grön och blöt. Det irländska klimatets konstanta regn, vind och begränsade sol utmanar din hud. Fri frakt över €60.",
      problemTitle: "Dublinhudens utmaningar",
      problemBody: "<p>Dublin har ett oceaniskt klimat med regn i genomsnitt varannan dag. Den konstanta fukten och Atlantvinden skapar en miljö där huden aldrig riktigt torkar – men inte heller återfuktas ordentligt. Vinden bär med sig salt från Irländska sjön som bryter ned hudbarriären.</p><p>Solljus är en bristvara. Dublin har i genomsnitt bara 1400 soltimmar per år – bland de lägsta i EU. D-vitaminbristen är utbredd och påverkar hudens hälsa direkt.</p>",
      tipsTitle: "Hudvårdstips för dublinare",
      tips: [
        { title: "Vindskydd är nyckeln", body: "Irländsk vind är konstant. En barriärolja innan du går ut skyddar mot fuktförlust." },
        { title: "Promenera i Phoenix Park", body: "Europas största inhägnade stadspark ger frisk luft och grönska." },
        { title: "D-vitamin är obligatoriskt", body: "HSE rekommenderar tillskott. Med Dublins molntäcke producerar huden nästan inget D-vitamin naturligt." },
        { title: "Irländsk havregrynsgröt", body: "Havre är antiinflammatoriskt och stödjer tarmen – som i sin tur stödjer huden." },
        { title: "Skydda huden i regnvinden", body: "Dubbla doser av rengöring och återfuktning under blåsiga regniga dagar." }
      ],
      solutionTitle: "CBD-hudvård levererad till Dublin",
      solutionBody: "<p>Vi skickar från Sverige – leverans till Dublin inom 3–5 arbetsdagar. Fri frakt över €60.</p><p>DUO-kit stärker barriären mot vind och salt. TA-DA Serum ger extra fukt. Fungtastic stödjer immunförsvaret i det grå irländska klimatet.</p>",
      faq: [
        { q: "Levererar ni till Irland?", a: "Ja, 3–5 arbetsdagar inom EU. Fri frakt över €60." },
        { q: "Är CBD-hudvård lagligt i Irland?", a: "Ja, CBD i hudvård är fullt lagligt i Irland." },
        { q: "Vilken produkt för Dublins klimat?", a: "DUO-kit som bas, TA-DA Serum för extra barriärskydd mot vinden." },
        { q: "Hur lång tid tar leveransen?", a: "3–5 arbetsdagar." }
      ],
      ctaTitle: "Ge din hud det Dublins klimat kräver",
      ctaSub: "Naturlig CBD-hudvård från Sverige till Dublin. Fri frakt över €60."
    },
    en: {
      metaTitle: "Skincare Dublin – CBD skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Dublin. Order online with free shipping over €60. Protect your skin from Ireland's constant rain, wind, and limited sunlight.",
      kicker: "Skincare in Dublin",
      h1: "Natural skincare for Dublin",
      lead: "Dublin – beautiful, green, and wet. The Irish climate's constant rain, wind, and limited sun challenge your skin daily. Free shipping over €60.",
      problemTitle: "What Dublin does to your skin",
      problemBody: "<p>Dublin has an oceanic climate with rain on average every other day. The constant moisture and Atlantic wind create an environment where the skin never truly dries – but isn't properly hydrated either. The wind carries salt from the Irish Sea that breaks down the skin barrier.</p><p>Sunlight is scarce. Dublin averages only 1,400 sunshine hours per year – among the lowest in the EU. Vitamin D deficiency is widespread and directly affects skin health.</p>",
      tipsTitle: "Skincare tips for Dubliners",
      tips: [
        { title: "Wind protection is key", body: "Irish wind is constant. A barrier oil before heading out protects against moisture loss." },
        { title: "Walk in Phoenix Park", body: "Europe's largest enclosed urban park offers fresh air and greenery." },
        { title: "Vitamin D is mandatory", body: "The HSE recommends supplements. With Dublin's cloud cover, your skin produces almost no vitamin D naturally." },
        { title: "Irish porridge oats", body: "Oats are anti-inflammatory and support gut health – which in turn supports your skin." },
        { title: "Protect your skin in the rain-wind", body: "Double up on cleansing and moisturizing during blustery, rainy days." }
      ],
      solutionTitle: "CBD skincare delivered to Dublin",
      solutionBody: "<p>We ship from Sweden – delivery to Dublin within 3–5 business days. Free shipping on orders over €60.</p><p>The DUO-kit strengthens the barrier against wind and salt. TA-DA Serum provides extra moisture. Fungtastic supports immunity in Ireland's grey climate.</p>",
      faq: [
        { q: "Do you ship to Ireland?", a: "Yes, 3–5 business days within the EU. Free shipping over €60." },
        { q: "Is CBD skincare legal in Ireland?", a: "Yes, CBD in skincare is fully legal in Ireland." },
        { q: "Which product for Dublin's climate?", a: "The DUO-kit as your base, TA-DA Serum for extra barrier protection against the wind." },
        { q: "How long does shipping take?", a: "3–5 business days." }
      ],
      ctaTitle: "Give your skin what Dublin's climate demands",
      ctaSub: "Natural CBD skincare from Sweden to Dublin. Free shipping over €60."
    },
    es: {
      metaTitle: "Cuidado de la piel Dublín – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Dublín. Pide online, envío gratis desde 50 €. Protege tu piel de la lluvia constante, el viento y el poco sol.",
      kicker: "Cuidado de la piel en Dublín",
      h1: "Cosmética natural para Dublín",
      lead: "Dublín – verde, bonita y empapada. Lluvia, viento y poco sol del clima irlandés retan tu piel cada día. Envío gratis desde 50 €.",
      problemTitle: "Lo que Dublín le hace a tu piel",
      problemBody: "<p>Clima oceánico: llueve de media un día sí y otro también. La humedad constante y el viento atlántico crean un entorno donde la piel no termina de secarse – pero tampoco se hidrata bien. El viento arrastra sal del mar de Irlanda y desgasta la barrera.</p><p>La luz solar escasea: unas 1.400 horas de sol al año – entre las más bajas de la UE. El déficit de vitamina D es común y afecta directamente a la salud de la piel.</p>",
      tipsTitle: "Consejos para quien vive en Dublín",
      tips: [
        { title: "Protección contra el viento", body: "El viento irlandés no descansa. Aceite barrera antes de salir para frenar la pérdida de humedad." },
        { title: "Phoenix Park", body: "El parque urbano cerrado más grande de Europa: aire y verde." },
        { title: "Vitamina D, obligatoria", body: "El HSE recomienda suplementos. Con tanta nube la piel casi no sintetiza vitamina D." },
        { title: "Porridge de avena irlandés", body: "La avena es antiinflamatoria y cuida el intestino – y eso se nota en la piel." },
        { title: "Refuerzo en días de lluvia y viento", body: "Duplica limpieza e hidratación cuando el temporal aprieta." }
      ],
      solutionTitle: "Cosmética con CBD con entrega en Dublín",
      solutionBody: "<p>Enviamos desde Suecia; 3–5 días laborables hasta Dublín. Envío gratis desde 50 €.</p><p>El DUO-kit refuerza la barrera frente a viento y sal. TA-DA Serum aporta humedad extra. Fungtastic Mushroom Extract apoya la inmunidad en el clima gris irlandés.</p>",
      faq: [
        { q: "¿Envían a Irlanda?", a: "Sí, 3–5 días laborables dentro de la UE. Envío gratis desde 50 €." },
        { q: "¿El CBD en cosmética es legal en Irlanda?", a: "Sí, el CBD en cuidado de la piel es plenamente legal en Irlanda." },
        { q: "¿Qué producto para el clima de Dublín?", a: "DUO-kit como base; TA-DA Serum para barrera extra contra el viento." },
        { q: "¿Plazo de envío?", a: "3–5 días laborables." }
      ],
      ctaTitle: "Dale a tu piel lo que el clima de Dublín exige",
      ctaSub: "Cosmética natural con CBD de Suecia a Dublín. Envío gratis desde 50 €."
    },
    de: {
      metaTitle: "Hautpflege Dublin – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für Dublin. Online bestellen, ab 50 € versandkostenfrei. Schutz vor Dauerregen, Wind und wenig Sonne.",
      kicker: "Hautpflege in Dublin",
      h1: "Natürliche Hautpflege für Dublin",
      lead: "Dublin – schön, grün und nass. Irlands Dauerregen, Wind und wenig Sonne fordern die Haut täglich. Ab 50 € versandkostenfrei.",
      problemTitle: "Was Dublin mit deiner Haut macht",
      problemBody: "<p>Ozeanisches Klima: statistisch regnet es jeden zweiten Tag. Ständige Feuchte und atlantischer Wind – die Haut trocknet nie richtig, wird aber auch nicht richtig hydriert. Wind trägt Salz von der Irischen See und strapaziert die Barriere.</p><p>Sonnenlicht ist Mangelware: nur etwa 1.400 Sonnenstunden pro Jahr – EU-weit unten. Vitamin-D-Mangel ist verbreitet und wirkt direkt auf die Haut.</p>",
      tipsTitle: "Hautpflege-Tipps für Dublin",
      tips: [
        { title: "Windschutz zuerst", body: "Irland hat Dauerwind. Barrier-Öl vor dem Rausgehen reduziert Feuchtigkeitsverlust." },
        { title: "Phoenix Park", body: "Europas größter umschlossener Stadtpark – frische Luft, Grün." },
        { title: "Vitamin D Pflicht", body: "HSE empfiehlt Supplemente. Bei Dublins Wolkendecke produziert die Haut fast kein Vitamin D." },
        { title: "Irisches Haferporridge", body: "Hafer ist entzündungshemmend und gut für den Darm – und damit für die Haut." },
        { title: "Mehr Pflege bei Regenwind", body: "Bei stürmischem Wetter Reinigung und Feuchtigkeit verdoppeln." }
      ],
      solutionTitle: "CBD-Hautpflege nach Dublin",
      solutionBody: "<p>Versand aus Schweden – 3–5 Werktage nach Dublin. Ab 50 € versandkostenfrei.</p><p>Das DUO-kit stärkt die Barriere gegen Wind und Salz. TA-DA Serum spendet extra Feuchtigkeit. Fungtastic Mushroom Extract unterstützt die Immunität im grauen irischen Klima.</p>",
      faq: [
        { q: "Liefert ihr nach Irland?", a: "Ja, 3–5 Werktage innerhalb der EU. Ab 50 € versandkostenfrei." },
        { q: "Ist CBD-Kosmetik in Irland legal?", a: "Ja, CBD in Hautpflege ist in Irland vollständig legal." },
        { q: "Welches Produkt fürs Dublin-Klima?", a: "DUO-kit als Basis, TA-DA Serum für extra Barriere gegen den Wind." },
        { q: "Wie lange dauert der Versand?", a: "3–5 Werktage." }
      ],
      ctaTitle: "Gib deiner Haut, was das Dublin-Klima verlangt",
      ctaSub: "Natürliche CBD-Pflege von Schweden nach Dublin. Ab 50 € versandkostenfrei."
    },
    fr: {
      metaTitle: "Soin du visage Dublin – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Dublin. Commande en ligne, livraison offerte dès 50 €. Protège ta peau de la pluie, du vent et du manque de soleil.",
      kicker: "Soins à Dublin",
      h1: "Soins naturels pour Dublin",
      lead: "Dublin – belle, verte et trempée. Pluie, vent et peu de soleil : le climat irlandais met ta peau à l’épreuve chaque jour. Livraison offerte dès 50 €.",
      problemTitle: "Ce que Dublin fait à ta peau",
      problemBody: "<p>Climat océanique : en moyenne, il pleut un jour sur deux. Humidité constante et vent atlantique – la peau ne sèche jamais vraiment, sans être correctement hydratée non plus. Le vent charrie du sel de la mer d’Irlande et fragilise la barrière.</p><p>La lumière du soleil manque : environ 1 400 heures par an – parmi les plus basses de l’UE. Carence en vitamine D répandue, impact direct sur la peau.</p>",
      tipsTitle: "Conseils peau pour Dublin",
      tips: [
        { title: "Protège-toi du vent", body: "Le vent irlandais ne lâche pas. Huile barrière avant de sortir limite la déshydratation." },
        { title: "Phoenix Park", body: "Le plus grand parc urbain clos d’Europe : air et verdure." },
        { title: "Vitamine D obligatoire", body: "Le HSE recommande des compléments. Sous la couverture nuageuse de Dublin, la peau produit presque pas de vitamine D." },
        { title: "Porridge à l’avoine", body: "L’avoine est anti-inflammatoire et soutient l’intestin – la peau suit." },
        { title: "Renfort par temps de pluie et vent", body: "Double nettoyage et hydratation quand ça souffle et ça mouille." }
      ],
      solutionTitle: "Soins au CBD livrés à Dublin",
      solutionBody: "<p>Expédition depuis la Suède ; 3–5 jours ouvrés jusqu’à Dublin. Livraison offerte dès 50 €.</p><p>Le DUO-kit renforce la barrière face au vent et au sel. TA-DA Serum hydrate davantage. Fungtastic Mushroom Extract soutient l’immunité sous le ciel gris irlandais.</p>",
      faq: [
        { q: "Livrez-vous en Irlande ?", a: "Oui, 3–5 jours ouvrés dans l’UE. Livraison offerte dès 50 €." },
        { q: "Le CBD en cosmétique est-il légal en Irlande ?", a: "Oui, le CBD dans les soins est entièrement légal en Irlande." },
        { q: "Quel produit pour le climat de Dublin ?", a: "DUO-kit comme base ; TA-DA Serum pour une barrière renforcée contre le vent." },
        { q: "Délai de livraison ?", a: "3–5 jours ouvrés." }
      ],
      ctaTitle: "Offre à ta peau ce que le climat de Dublin exige",
      ctaSub: "Soins naturels au CBD de la Suède à Dublin. Livraison offerte dès 50 €."
    }
  },
  {
    svSlug: "hudvard-paris",
    enSlug: "skincare-paris",
    esSlug: "cuidado-piel-cbd-paris",
    deSlug: "cbd-hautpflege-paris",
    frSlug: "soin-peau-cbd-paris",
    category: "stad",
    productIds: ["duo-kit", "au-naturel-makeup-remover", "ta-da-serum"],
    sv: {
      metaTitle: "Hudvård Paris – CBD-hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i Paris. Beställ online med fri frakt över €60. Skydda din hud mot Parisisk föroreningar och hårt vatten.",
      kicker: "Hudvård i Paris",
      h1: "Naturlig hudvård för dig i Paris",
      lead: "Paris – modets huvudstad med smutsiga hemligheter. Luftföroreningar, extremt hårt vatten och stressat storstadsliv utmanar din hud. Fri frakt över €60.",
      problemTitle: "Parishudens utmaningar",
      problemBody: "<p>Paris har bland Europas högsta föroreningsnivåer. Trafikens dieselavgaser, särskilt längs Périphérique och i centrala arrondissement, belastar huden med fina partiklar och kvävedioxid. Parisisk luft är mätbart sämre än de flesta andra EU-huvudstäder.</p><p>Kranvattnet i Paris är mycket hårt – kalkhalten är hög och torkar ut huden vid varje tvätt. Vintrarna är kalla och gråa, somrarna allt hetare med värmeböljor som blivit vanligare. Parisiskt stressliv – métro-boulot-dodo – höjer kortisolnivåerna kroniskt.</p>",
      tipsTitle: "Hudvårdstips för parisbor",
      tips: [
        { title: "Dubbel rengöring varje kväll", body: "Parisisk smog kräver ordentlig rengöring. Au Naturel först, sedan mild tvätt. Aldrig somna med dagens föroreningar på huden." },
        { title: "Promenera i Jardin du Luxembourg", body: "Parisparker ger andrum från föroreningarna. Kort promenad, stor effekt." },
        { title: "Duschfilter är ett måste", body: "Parisiskt kranvatten är brutalt mot huden. Ett kalkfilter förändrar allt." },
        { title: "Franska marknader", body: "Köp färskt på marché – frukt, grönsaker, ost. Parisisk matkultur har allt huden behöver inifrån." },
        { title: "Mindfulness mot stress", body: "Paris lever i högt tempo. Stresshantering är den mest underskattade hudvårdsrutinen." }
      ],
      solutionTitle: "CBD-hudvård levererad till Paris",
      solutionBody: "<p>Vi skickar från Sverige – leverans till Paris inom 3–5 arbetsdagar. Fri frakt över €60.</p><p>DUO-kit stärker barriären mot hårt vatten och föroreningar. Au Naturel rengör bort smog och smuts. TA-DA Serum ger extra fukt under kalla vintermånader.</p>",
      faq: [
        { q: "Levererar ni till Frankrike?", a: "Ja, 3–5 arbetsdagar. Fri frakt över €60." },
        { q: "Är CBD-hudvård lagligt i Frankrike?", a: "Ja, CBD i hudvård har varit fullt lagligt i Frankrike sedan 2022." },
        { q: "Vilken produkt mot Parisisk smog?", a: "Au Naturel Makeup Remover rengör bort föroreningar effektivt men milt." },
        { q: "Hur lång tid tar leveransen?", a: "3–5 arbetsdagar." }
      ],
      ctaTitle: "Ge din hud det Paris kräver",
      ctaSub: "Naturlig CBD-hudvård från Sverige till Paris. Fri frakt över €60."
    },
    en: {
      metaTitle: "Skincare Paris – CBD skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Paris. Order online with free shipping over €60. Protect your skin from Parisian pollution and extremely hard water.",
      kicker: "Skincare in Paris",
      h1: "Natural skincare for Paris",
      lead: "Paris – the fashion capital with dirty secrets. Air pollution, extremely hard water, and stressful city life challenge your skin daily. Free shipping over €60.",
      problemTitle: "What Paris does to your skin",
      problemBody: "<p>Paris has among the highest pollution levels in Europe. Diesel exhaust from traffic, especially along the Périphérique and in central arrondissements, loads the skin with fine particles and nitrogen dioxide. Parisian air is measurably worse than most other EU capitals.</p><p>Tap water in Paris is very hard – calcium levels are high and dehydrate the skin with every wash. Winters are cold and grey, summers increasingly hotter with heat waves becoming more common. The Parisian stress cycle – métro-boulot-dodo – chronically elevates cortisol levels.</p>",
      tipsTitle: "Skincare tips for Parisians",
      tips: [
        { title: "Double cleanse every evening", body: "Parisian smog demands proper cleansing. Au Naturel first, then a gentle wash. Never sleep with the day's pollution on your skin." },
        { title: "Walk in Jardin du Luxembourg", body: "Parisian parks offer respite from pollution. Short walk, big impact." },
        { title: "A shower filter is a must", body: "Parisian tap water is brutal on the skin. A limescale filter changes everything." },
        { title: "French markets", body: "Buy fresh at the marché – fruit, vegetables, cheese. Parisian food culture has everything your skin needs from within." },
        { title: "Mindfulness against stress", body: "Paris lives at a fast pace. Stress management is the most underrated skincare routine." }
      ],
      solutionTitle: "CBD skincare delivered to Paris",
      solutionBody: "<p>We ship from Sweden – delivery to Paris within 3–5 business days. Free shipping on orders over €60.</p><p>The DUO-kit strengthens the barrier against hard water and pollution. Au Naturel cleans away smog and grime. TA-DA Serum provides extra moisture during cold winter months.</p>",
      faq: [
        { q: "Do you ship to France?", a: "Yes, 3–5 business days. Free shipping over €60." },
        { q: "Is CBD skincare legal in France?", a: "Yes, CBD in skincare has been fully legal in France since 2022." },
        { q: "Which product for Parisian smog?", a: "Au Naturel Makeup Remover cleans away pollution effectively but gently." },
        { q: "How long does shipping take?", a: "3–5 business days." }
      ],
      ctaTitle: "Give your skin what Paris demands",
      ctaSub: "Natural CBD skincare from Sweden to Paris. Free shipping over €60."
    },
    es: {
      metaTitle: "Cuidado de la piel París – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para París. Pide online, envío gratis desde 50 €. Protege tu piel de la contaminación parisina y el agua muy dura.",
      kicker: "Cuidado de la piel en París",
      h1: "Cosmética natural para París",
      lead: "París – capital de la moda con trapos sucios: aire cargado, agua durísima y ritmo de gran ciudad que castigan la piel. Envío gratis desde 50 €.",
      problemTitle: "Lo que París le hace a tu piel",
      problemBody: "<p>París está entre las ciudades europeas con más contaminación. Diesel, tráfico – sobre todo en el Périphérique y los arrondissements céntricos – deposita partículas finas y dióxido de nitrógeno. El aire parisino es, a datos en mano, peor que en muchas otras capitales de la UE.</p><p>El agua del grifo es muy dura: mucho calcio que reseca la piel a cada lavado. Inviernos fríos y grises; veranos cada vez más calurosos y olas de calor más frecuentes. El ciclo parisino – métro, boulot, dodo – mantiene el cortisol alto.</p>",
      tipsTitle: "Consejos para quien vive en París",
      tips: [
        { title: "Doble limpieza cada noche", body: "La bruma parisina exige ritual serio. Au Naturel primero, luego lavado suave. Nunca duermas con el día encima." },
        { title: "Jardin du Luxembourg", body: "Los parques dan un respiro al smog. Veinte minutos, efecto real." },
        { title: "Filtro de ducha imprescindible", body: "El agua parisina es brutal. Anti-cal = cambio de juego." },
        { title: "Mercados", body: "Fruta, verdura, queso en el marché – la cultura gastronómica parisina alimenta la piel por dentro." },
        { title: "Antiestrés = skincare", body: "París va a mil. Gestionar el estrés es la rutina infravalorada." }
      ],
      solutionTitle: "Cosmética con CBD con entrega en París",
      solutionBody: "<p>Enviamos desde Suecia; 3–5 días laborables hasta París. Envío gratis desde 50 €.</p><p>El DUO-kit refuerza la barrera frente al agua dura y la polución. Au Naturel limpia smog y suciedad. TA-DA Serum hidrata de más en invierno frío.</p>",
      faq: [
        { q: "¿Envían a Francia?", a: "Sí, 3–5 días laborables. Envío gratis desde 50 €." },
        { q: "¿El CBD en cosmética es legal en Francia?", a: "Sí, el CBD en cuidado de la piel es plenamente legal en Francia desde 2022." },
        { q: "¿Qué producto contra el smog parisino?", a: "Au Naturel Makeup Remover limpia la contaminación con firmeza y sin agresión." },
        { q: "¿Plazo de envío?", a: "3–5 días laborables." }
      ],
      ctaTitle: "Dale a tu piel lo que París exige",
      ctaSub: "Cosmética natural con CBD de Suecia a París. Envío gratis desde 50 €."
    },
    de: {
      metaTitle: "Hautpflege Paris – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für Paris. Online bestellen, ab 50 € versandkostenfrei. Schutz vor Pariser Luftverschmutzung und extrem hartem Wasser.",
      kicker: "Hautpflege in Paris",
      h1: "Natürliche Hautpflege für Paris",
      lead: "Paris – Modehauptstadt mit schmutzigen Geheimnissen: Luftbelastung, extrem hartes Wasser und Großstadtstress strapazieren die Haut. Ab 50 € versandkostenfrei.",
      problemTitle: "Was Paris mit deiner Haut macht",
      problemBody: "<p>Paris zählt zu Europas stärker verschmutzten Städten. Dieselabgase, besonders am Périphérique und in zentralen Arrondissements, setzen Feinstaub und Stickstoffdioxid auf die Haut. Messbar schlechtere Luft als in vielen anderen EU-Hauptstädten.</p><p>Leitungswasser ist sehr hart – viel Kalk, der bei jeder Wäsche austrocknet. Winter grau und kalt, Sommer heißer mit häufigeren Hitzewellen. Pariser Takt – Métro, Boulot, Dodo – hält Cortisol dauerhaft hoch.</p>",
      tipsTitle: "Hautpflege-Tipps für Paris",
      tips: [
        { title: "Abends doppelt reinigen", body: "Smog verlangt Routine. Au Naturel zuerst, dann milde Wäsche. Nie mit dem Tag im Gesicht schlafen." },
        { title: "Jardin du Luxembourg", body: "Parks geben Pause vom Smog. Kurzer Spaziergang, großer Effekt." },
        { title: "Duschfilter Pflicht", body: "Pariser Wasser ist brutal. Kalkfilter ändert alles." },
        { title: "Marché", body: "Obst, Gemüse, Käse frisch vom Markt – Pariser Food-Kultur füttert die Haut von innen." },
        { title: "Stress runter", body: "Paris rennt. Stressmanagement ist die unterschätzte Routine." }
      ],
      solutionTitle: "CBD-Hautpflege nach Paris",
      solutionBody: "<p>Versand aus Schweden – 3–5 Werktage nach Paris. Ab 50 € versandkostenfrei.</p><p>Das DUO-kit stärkt die Barriere gegen hartes Wasser und Feinstaub. Au Naturel entfernt Smog und Schmutz. TA-DA Serum spendet extra in kalten Wintern.</p>",
      faq: [
        { q: "Liefert ihr nach Frankreich?", a: "Ja, 3–5 Werktage. Ab 50 € versandkostenfrei." },
        { q: "Ist CBD-Kosmetik in Frankreich legal?", a: "Ja, CBD in Hautpflege ist seit 2022 vollständig legal in Frankreich." },
        { q: "Welches Produkt gegen Pariser Smog?", a: "Au Naturel Makeup Remover reinigt Belastungen gründlich und sanft." },
        { q: "Wie lange dauert der Versand?", a: "3–5 Werktage." }
      ],
      ctaTitle: "Gib deiner Haut, was Paris verlangt",
      ctaSub: "Natürliche CBD-Pflege von Schweden nach Paris. Ab 50 € versandkostenfrei."
    },
    fr: {
      metaTitle: "Soin du visage Paris – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Paris. Commande en ligne, livraison offerte dès 50 €. Protège ta peau de la pollution parisienne et de l’eau ultra-calcaire.",
      kicker: "Soins à Paris",
      h1: "Soins naturels pour Paris",
      lead: "Paris – capitale de la mode avec des angles morts : pollution de l’air, eau ultra-dure et rythme urbain qui ne pardonnent pas à la peau. Livraison offerte dès 50 €.",
      problemTitle: "Ce que Paris fait à ta peau",
      problemBody: "<p>Paris figure parmi les villes européennes les plus polluées. Gazole, circulation – surtout sur le périph’ et dans les arrondissements centraux – déposent particules fines et dioxyde d’azote sur la peau. À mesure, l’air parisien est souvent pire que dans d’autres capitales de l’UE.</p><p>L’eau du robinet est très calcaire : chaque rinçage assèche un peu plus. Hivers froids et gris ; étés de plus en plus chauds, canicules plus fréquentes. Le rythme métro-boulot-dodo maintient le cortisol en zone rouge.</p>",
      tipsTitle: "Conseils peau pour Paris",
      tips: [
        { title: "Double démaquillage le soir", body: "Le smog parisien mérite un vrai rituel. Au Naturel d’abord, puis un nettoyage doux. Jamais dormir avec la ville sur le visage." },
        { title: "Jardin du Luxembourg", body: "Les parcs offrent une pause face à la pollution. Petite marche, gros effet." },
        { title: "Filtre de douche non négociable", body: "L’eau parisienne est rude. Anti-calcaire : game changer." },
        { title: "Marchés", body: "Fruits, légumes, fromage au marché – la bouffe parisienne nourrit la peau de l’intérieur." },
        { title: "Gérer le stress", body: "Paris va vite. La gestion du stress, c’est la routine sous-estimée." }
      ],
      solutionTitle: "Soins au CBD livrés à Paris",
      solutionBody: "<p>Expédition depuis la Suède ; 3–5 jours ouvrés jusqu’à Paris. Livraison offerte dès 50 €.</p><p>Le DUO-kit renforce la barrière face au calcaire et à la pollution. Au Naturel enlève smog et saleté du jour. TA-DA Serum hydrate davantage pendant l’hiver froid.</p>",
      faq: [
        { q: "Livrez-vous en France ?", a: "Oui, 3–5 jours ouvrés. Livraison offerte dès 50 €." },
        { q: "Le CBD en cosmétique est-il légal en France ?", a: "Oui, le CBD dans les soins est entièrement légal en France depuis 2022." },
        { q: "Quel produit contre le smog parisien ?", a: "Au Naturel Makeup Remover retire la pollution efficacement, sans agresser." },
        { q: "Délai de livraison ?", a: "3–5 jours ouvrés." }
      ],
      ctaTitle: "Offre à ta peau ce que Paris exige",
      ctaSub: "Soins naturels au CBD de la Suède à Paris. Livraison offerte dès 50 €."
    }
  },
  // ──────────────────────────────────────────────
  // SOUTHERN EUROPE
  // ──────────────────────────────────────────────
  {
    svSlug: "hudvard-barcelona",
    enSlug: "skincare-barcelona",
    esSlug: "cuidado-piel-cbd-barcelona",
    deSlug: "cbd-hautpflege-barcelona",
    frSlug: "soin-peau-cbd-barcelona",
    category: "stad",
    productIds: ["duo-kit", "au-naturel-makeup-remover", "ta-da-serum"],
    sv: {
      metaTitle: "Hudvård Barcelona – CBD-hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i Barcelona. Beställ online med fri frakt över €60. Skydda din hud mot medelhavssolen och stadsluften.",
      kicker: "Hudvård i Barcelona",
      h1: "Naturlig hudvård för dig i Barcelona",
      lead: "Barcelona – sol, hav och stadsliv. Men den intensiva UV-strålningen, havsbrisen med salt och trafikföroreningar utmanar din hud mer än du tror. Fri frakt över €60.",
      problemTitle: "Barcelonahudens utmaningar",
      problemBody: "<p>Barcelona har över 2500 soltimmar per år – fantastiskt för livskvaliteten, men krävande för huden. Kumulativ UV-exponering driver prematur åldring, pigmentförändringar och uttorkning. Havsluften från Medelhavet bär med sig salt som torkar ut huden.</p><p>Barcelonas trafikföroreningar är bland de värsta i Spanien. Eixample-kvarterens täta stadsstruktur fångar avgaser, och sommarvärmen förvärrar ozon- och partikelhalterna. Luftkonditionering inomhus torkar ut huden ytterligare.</p>",
      tipsTitle: "Hudvårdstips för barcelonabor",
      tips: [
        { title: "UV-skydd är nummer ett", body: "Barcelonas sol är intensiv. Dagligt UV-skydd är absolut nödvändigt – även i december." },
        { title: "Återfukta efter stranden", body: "Salt och sol torkar ut extremt. Skölj av salt och applicera olja direkt." },
        { title: "Promenera i Parc de la Ciutadella", body: "Grönska och skugga mitt i staden. Bra för hud och sinne." },
        { title: "Spansk medelhavsmat", body: "Olivolja, tomater, avokado, fisk – medelhavskost är bland det bästa som finns för huden." },
        { title: "Undvik mitt-på-dagen-solen", body: "Mellan klockan 12 och 16 är UV-strålningen som starkast. Sök skugga." }
      ],
      solutionTitle: "CBD-hudvård levererad till Barcelona",
      solutionBody: "<p>Vi skickar från Sverige – leverans till Barcelona inom 3–5 arbetsdagar. Fri frakt över €60.</p><p>DUO-kit ger antioxidantskydd mot UV-skador. Au Naturel rengör bort salt och föroreningar. TA-DA Serum ger intensiv återfuktning efter solen.</p>",
      faq: [
        { q: "Levererar ni till Spanien?", a: "Ja, 3–5 arbetsdagar. Fri frakt över €60." },
        { q: "Är CBD-hudvård lagligt i Spanien?", a: "Ja, CBD i hudvård är lagligt i Spanien." },
        { q: "Vilken produkt för Barcelonas sol?", a: "DUO-kit för dagligt antioxidantskydd, TA-DA Serum för återfuktning." },
        { q: "Hur lång tid tar leveransen?", a: "3–5 arbetsdagar." }
      ],
      ctaTitle: "Ge din hud det Barcelonas sol kräver",
      ctaSub: "Naturlig CBD-hudvård från Sverige till Barcelona. Fri frakt över €60."
    },
    en: {
      metaTitle: "Skincare Barcelona – CBD skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Barcelona. Order online with free shipping over €60. Protect your skin from Mediterranean sun, sea salt, and urban pollution.",
      kicker: "Skincare in Barcelona",
      h1: "Natural skincare for Barcelona",
      lead: "Barcelona – sun, sea, and city life. But the intense UV radiation, salty sea breeze, and traffic pollution challenge your skin more than you think. Free shipping over €60.",
      problemTitle: "What Barcelona does to your skin",
      problemBody: "<p>Barcelona gets over 2,500 sunshine hours per year – fantastic for quality of life, but demanding on the skin. Cumulative UV exposure drives premature aging, pigmentation changes, and dehydration. The sea air from the Mediterranean carries salt that dries out the skin.</p><p>Barcelona's traffic pollution is among the worst in Spain. The dense urban grid of the Eixample district traps exhaust fumes, and summer heat worsens ozone and particle levels. Air conditioning indoors dries the skin out further.</p>",
      tipsTitle: "Skincare tips for Barcelona residents",
      tips: [
        { title: "UV protection is number one", body: "Barcelona's sun is intense. Daily UV protection is absolutely essential – even in December." },
        { title: "Moisturize after the beach", body: "Salt and sun dehydrate extremely. Rinse off salt and apply oil immediately." },
        { title: "Walk in Parc de la Ciutadella", body: "Greenery and shade in the middle of the city. Good for skin and mind." },
        { title: "Spanish Mediterranean diet", body: "Olive oil, tomatoes, avocado, fish – the Mediterranean diet is among the best things that exist for the skin." },
        { title: "Avoid midday sun", body: "Between 12 and 4 PM, UV radiation is at its strongest. Seek shade." }
      ],
      solutionTitle: "CBD skincare delivered to Barcelona",
      solutionBody: "<p>We ship from Sweden – delivery to Barcelona within 3–5 business days. Free shipping on orders over €60.</p><p>The DUO-kit provides antioxidant protection against UV damage. Au Naturel cleans away salt and pollution. TA-DA Serum provides intensive moisture recovery after the sun.</p>",
      faq: [
        { q: "Do you ship to Spain?", a: "Yes, 3–5 business days. Free shipping over €60." },
        { q: "Is CBD skincare legal in Spain?", a: "Yes, CBD in skincare is legal in Spain." },
        { q: "Which product for Barcelona's sun?", a: "DUO-kit for daily antioxidant protection, TA-DA Serum for moisture recovery." },
        { q: "How long does shipping take?", a: "3–5 business days." }
      ],
      ctaTitle: "Give your skin what Barcelona's sun demands",
      ctaSub: "Natural CBD skincare from Sweden to Barcelona. Free shipping over €60."
    },
    es: {
      metaTitle: "Cuidado de la piel Barcelona – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Barcelona. Pide online, envío gratis desde 50 €. Protege tu piel del sol mediterráneo, la sal marina y la contaminación.",
      kicker: "Cuidado de la piel en Barcelona",
      h1: "Cosmética natural para Barcelona",
      lead: "Barcelona – sol, mar y vida urbana. Pero el UV intenso, la brisa salada y el tráfico exigen más de tu piel de lo que parece. Envío gratis desde 50 €.",
      problemTitle: "Lo que Barcelona le hace a tu piel",
      problemBody: "<p>Más de 2.500 horas de sol al año: genial para vivir, duro para la piel. El UV acumulado empuja fotoenvejecimiento, cambios de pigmentación y deshidratación. El aire del Mediterráneo arrastra sal que reseca.</p><p>La contaminación por tráfico está entre las peores de España. La trama densa del Eixample atrapa humos; en verano suben ozono y partículas. El aire acondicionado en casa seca aún más.</p>",
      tipsTitle: "Consejos para quien vive en Barcelona",
      tips: [
        { title: "Protección UV, prioridad uno", body: "El sol aquí pega fuerte. Fotoprotección diaria, incluso en diciembre." },
        { title: "Hidrata tras la playa", body: "Sal y sol desecan en serio. Enjuaga la sal y aplica aceite al momento." },
        { title: "Parc de la Ciutadella", body: "Verde y sombra en el centro. Piel y cabeza lo agradecen." },
        { title: "Dieta mediterránea", body: "Aceite de oliva, tomate, aguacate, pescado – de lo mejor para la piel." },
        { title: "Evita el sol central", body: "Entre las 12 y las 16 el UV va al máximo. Busca sombra." }
      ],
      solutionTitle: "Cosmética con CBD con entrega en Barcelona",
      solutionBody: "<p>Enviamos desde Suecia; 3–5 días laborables hasta Barcelona. Envío gratis desde 50 €.</p><p>El DUO-kit aporta antioxidantes frente al daño UV. Au Naturel limpia sal y contaminación. TA-DA Serum recupera humedad tras el sol.</p>",
      faq: [
        { q: "¿Envían a España?", a: "Sí, 3–5 días laborables. Envío gratis desde 50 €." },
        { q: "¿El CBD en cosmética es legal en España?", a: "Sí, el CBD en cuidado de la piel es legal en España." },
        { q: "¿Qué producto para el sol de Barcelona?", a: "DUO-kit para antioxidantes diarios; TA-DA Serum para recuperar hidratación." },
        { q: "¿Plazo de envío?", a: "3–5 días laborables." }
      ],
      ctaTitle: "Dale a tu piel lo que el sol de Barcelona exige",
      ctaSub: "Cosmética natural con CBD de Suecia a Barcelona. Envío gratis desde 50 €."
    },
    de: {
      metaTitle: "Hautpflege Barcelona – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für Barcelona. Online bestellen, ab 50 € versandkostenfrei. Schutz vor Mittelmeersonne, Meersalz und Stadt-smog.",
      kicker: "Hautpflege in Barcelona",
      h1: "Natürliche Hautpflege für Barcelona",
      lead: "Barcelona – Sonne, Meer, Stadtleben. Aber intensives UV, salzige Brise und Verkehr fordern mehr von der Haut, als man denkt. Ab 50 € versandkostenfrei.",
      problemTitle: "Was Barcelona mit deiner Haut macht",
      problemBody: "<p>Über 2.500 Sonnenstunden pro Jahr – toll fürs Leben, hart für die Haut. Kumulatives UV treibt vorzeitige Alterung, Pigmentierung und Austrocknung. Mittelmeerluft trägt Salz, das austrocknet.</p><p>Verkehrsbelastung gehört zu Spaniens schlimmsten. Das dichte Raster des Eixample hält Abgase; im Sommer steigen Ozon und Partikel. Klimaanlage trocknet drinnen zusätzlich.</p>",
      tipsTitle: "Hautpflege-Tipps für Barcelona",
      tips: [
        { title: "UV-Schutz zuerst", body: "Die Sonne hier ist intensiv. Täglicher Lichtschutz – auch im Dezember." },
        { title: "Nach dem Strand feuchthalten", body: "Salz und Sonne entwässern extrem. Salz abspülen, sofort Öl auftragen." },
        { title: "Parc de la Ciutadella", body: "Grün und Schatten mitten in der Stadt. Gut für Haut und Kopf." },
        { title: "Mittelmeerkost", body: "Olivenöl, Tomaten, Avocado, Fisch – top für die Haut." },
        { title: "Mittagssonne meiden", body: "Zwischen 12 und 16 Uhr ist UV am stärksten. Schatten suchen." }
      ],
      solutionTitle: "CBD-Hautpflege nach Barcelona",
      solutionBody: "<p>Versand aus Schweden – 3–5 Werktage nach Barcelona. Ab 50 € versandkostenfrei.</p><p>Das DUO-kit liefert antioxidativen Schutz gegen UV-Schäden. Au Naturel entfernt Salz und Schmutz. TA-DA Serum spendet intensive Feuchtigkeit nach der Sonne.</p>",
      faq: [
        { q: "Liefert ihr nach Spanien?", a: "Ja, 3–5 Werktage. Ab 50 € versandkostenfrei." },
        { q: "Ist CBD-Kosmetik in Spanien legal?", a: "Ja, CBD in Hautpflege ist in Spanien erlaubt." },
        { q: "Welches Produkt für Barcelonas Sonne?", a: "DUO-kit für täglichen antioxidativen Schutz, TA-DA Serum für Feuchtigkeit." },
        { q: "Wie lange dauert der Versand?", a: "3–5 Werktage." }
      ],
      ctaTitle: "Gib deiner Haut, was die Barcelona-Sonne verlangt",
      ctaSub: "Natürliche CBD-Pflege von Schweden nach Barcelona. Ab 50 € versandkostenfrei."
    },
    fr: {
      metaTitle: "Soin du visage Barcelone – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Barcelone. Commande en ligne, livraison offerte dès 50 €. Protège ta peau du soleil méditerranéen, du sel marin et de la pollution.",
      kicker: "Soins à Barcelone",
      h1: "Soins naturels pour Barcelone",
      lead: "Barcelone – soleil, mer et vie urbaine. Mais l’UV intense, la brise salée et le trafic sollicitent ta peau plus que tu ne crois. Livraison offerte dès 50 €.",
      problemTitle: "Ce que Barcelone fait à ta peau",
      problemBody: "<p>Plus de 2 500 heures de soleil par an – top pour le moral, exigeant pour la peau. L’UV cumulé pousse le vieillissement photo, les taches et la déshydratation. L’air méditerranéen charrie du sel qui assèche.</p><p>La pollution routière compte parmi les pires d’Espagne. La maille dense de l’Eixample retient les gaz d’échappement ; en été montent ozone et particules. La clim à l’intérieur assèche encore.</p>",
      tipsTitle: "Conseils peau pour Barcelone",
      tips: [
        { title: "UV en premier", body: "Le soleil tape fort. Protection quotidienne – même en décembre." },
        { title: "Hydrate après la plage", body: "Sel et soleil déshydratent à fond. Rince le sel, huile tout de suite." },
        { title: "Parc de la Ciutadella", body: "Vert et ombre au centre. Peau et esprit gagnent." },
        { title: "Régime méditerranéen", body: "Huile d’olive, tomates, avocat, poisson – parmi le mieux pour la peau." },
        { title: "Évite le plein midi", body: "Entre 12 h et 16 h l’UV est maximal. Cherche l’ombre." }
      ],
      solutionTitle: "Soins au CBD livrés à Barcelone",
      solutionBody: "<p>Expédition depuis la Suède ; 3–5 jours ouvrés jusqu’à Barcelone. Livraison offerte dès 50 €.</p><p>Le DUO-kit apporte des antioxydants contre les dégâts UV. Au Naturel enlève sel et pollution. TA-DA Serum réhydrate après le soleil.</p>",
      faq: [
        { q: "Livrez-vous en Espagne ?", a: "Oui, 3–5 jours ouvrés. Livraison offerte dès 50 €." },
        { q: "Le CBD en cosmétique est-il légal en Espagne ?", a: "Oui, le CBD dans les soins est légal en Espagne." },
        { q: "Quel produit pour le soleil de Barcelone ?", a: "DUO-kit pour l’antioxydation au quotidien ; TA-DA Serum pour récupérer l’hydratation." },
        { q: "Délai de livraison ?", a: "3–5 jours ouvrés." }
      ],
      ctaTitle: "Offre à ta peau ce que le soleil de Barcelone exige",
      ctaSub: "Soins naturels au CBD de la Suède à Barcelone. Livraison offerte dès 50 €."
    }
  },
  {
    svSlug: "hudvard-madrid",
    enSlug: "skincare-madrid",
    esSlug: "cuidado-piel-cbd-madrid",
    deSlug: "cbd-hautpflege-madrid",
    frSlug: "soin-peau-cbd-madrid",
    category: "stad",
    productIds: ["duo-kit", "ta-da-serum", "au-naturel-makeup-remover"],
    sv: {
      metaTitle: "Hudvård Madrid – CBD-hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i Madrid. Beställ online med fri frakt över €60. Skydda din hud mot Madrids torra hetta och extrema klimat.",
      kicker: "Hudvård i Madrid",
      h1: "Naturlig hudvård för dig i Madrid",
      lead: "Madrid – Europas högst belägna huvudstad med ett av kontinentens mest extrema klimat. Brännande somrar, kalla vintrar och extremt torr luft. Fri frakt över €60.",
      problemTitle: "Madridhudens utmaningar",
      problemBody: "<p>Madrid har ett kontinentalt medelhavsklimat med extrema temperaturskillnader. Somrarna når regelbundet fyrtio grader och luftfuktigheten kan sjunka till under tjugo procent. Vintrarna är kalla – ja, det snöar i Madrid – med temperaturer under noll. Uttrycket 'nueve meses de invierno, tres de infierno' beskriver det perfekt.</p><p>Den torra luften året runt dränerar huden på fukt. Madrids höga altitud (650 m) innebär starkare UV-strålning. Luftkonditionering på sommaren och centralvärme på vintern skapar ytterligare torka inomhus.</p>",
      tipsTitle: "Hudvårdstips för madridbor",
      tips: [
        { title: "Återfukta aggressivt", body: "Madrids torra luft kräver mer återfuktning än de flesta europeiska städer. Applicera olja morgon och kväll." },
        { title: "Promenera i Retiro", body: "Madrids gröna juvel ger skugga, frisk luft och ro. Perfekt för hud och sinne." },
        { title: "UV-skydd dagligen", body: "Hög altitud plus intensiv sol – dagligt UV-skydd är obligatoriskt i Madrid." },
        { title: "Spansk kvällsmat", body: "Tapas med olivolja, nötter, torkad frukt och fisk – perfekt hudmat." },
        { title: "Drick vatten konstant", body: "Uttorkning är Madrids ständiga risk. Hydrering inifrån är avgörande för huden." }
      ],
      solutionTitle: "CBD-hudvård levererad till Madrid",
      solutionBody: "<p>Vi skickar från Sverige – leverans till Madrid inom 3–5 arbetsdagar. Fri frakt över €60.</p><p>DUO-kit ger grundläggande barriärskydd. TA-DA Serum med CBG ger intensiv fukt som Madrids torra klimat kräver. Au Naturel rengör milt utan att torka ut ytterligare.</p>",
      faq: [
        { q: "Levererar ni till Spanien?", a: "Ja, 3–5 arbetsdagar. Fri frakt över €60." },
        { q: "Är CBD-hudvård lagligt i Spanien?", a: "Ja, CBD i hudvård är lagligt i Spanien." },
        { q: "Vilken produkt för Madrids torra klimat?", a: "TA-DA Serum ger intensiv fukt. DUO-kit som daglig bas." },
        { q: "Hur lång tid tar leveransen?", a: "3–5 arbetsdagar." }
      ],
      ctaTitle: "Ge din hud det Madrid kräver",
      ctaSub: "Naturlig CBD-hudvård från Sverige till Madrid. Fri frakt över €60."
    },
    en: {
      metaTitle: "Skincare Madrid – CBD skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Madrid. Order online with free shipping over €60. Protect your skin from Madrid's scorching heat and extremely dry air.",
      kicker: "Skincare in Madrid",
      h1: "Natural skincare for Madrid",
      lead: "Madrid – Europe's highest capital with one of the continent's most extreme climates. Scorching summers, cold winters, and extremely dry air year-round. Free shipping over €60.",
      problemTitle: "What Madrid does to your skin",
      problemBody: "<p>Madrid has a continental Mediterranean climate with extreme temperature swings. Summers regularly reach forty degrees and humidity can drop below twenty percent. Winters are cold – yes, it snows in Madrid – with temperatures below zero. The local saying 'nueve meses de invierno, tres de infierno' describes it perfectly.</p><p>The dry air year-round drains moisture from the skin. Madrid's high altitude (650m) means stronger UV radiation. Air conditioning in summer and central heating in winter create additional dryness indoors.</p>",
      tipsTitle: "Skincare tips for Madrid residents",
      tips: [
        { title: "Moisturize aggressively", body: "Madrid's dry air demands more moisturizing than most European cities. Apply oil morning and evening." },
        { title: "Walk in Retiro", body: "Madrid's green jewel offers shade, fresh air, and calm. Perfect for skin and mind." },
        { title: "UV protection daily", body: "High altitude plus intense sun – daily UV protection is mandatory in Madrid." },
        { title: "Spanish evening food", body: "Tapas with olive oil, nuts, dried fruit, and fish – perfect skin food." },
        { title: "Drink water constantly", body: "Dehydration is Madrid's constant risk. Hydrating from within is essential for the skin." }
      ],
      solutionTitle: "CBD skincare delivered to Madrid",
      solutionBody: "<p>We ship from Sweden – delivery to Madrid within 3–5 business days. Free shipping on orders over €60.</p><p>The DUO-kit provides fundamental barrier protection. TA-DA Serum with CBG delivers the intense moisture Madrid's dry climate demands. Au Naturel cleanses gently without further dehydrating.</p>",
      faq: [
        { q: "Do you ship to Spain?", a: "Yes, 3–5 business days. Free shipping over €60." },
        { q: "Is CBD skincare legal in Spain?", a: "Yes, CBD in skincare is legal in Spain." },
        { q: "Which product for Madrid's dry climate?", a: "TA-DA Serum provides intense moisture. DUO-kit as your daily base." },
        { q: "How long does shipping take?", a: "3–5 business days." }
      ],
      ctaTitle: "Give your skin what Madrid demands",
      ctaSub: "Natural CBD skincare from Sweden to Madrid. Free shipping over €60."
    },
    es: {
      metaTitle: "Cuidado de la piel Madrid – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Madrid. Pide online, envío gratis desde 50 €. Protege tu piel del calor abrasador y el aire extremadamente seco.",
      kicker: "Cuidado de la piel en Madrid",
      h1: "Cosmética natural para Madrid",
      lead: "Madrid – capital más alta de Europa y clima de los más extremos del continente. Veranos de infierno, inviernos fríos y aire seco casi siempre. Envío gratis desde 50 €.",
      problemTitle: "Lo que Madrid le hace a tu piel",
      problemBody: "<p>Clima mediterráneo continental con saltos brutales. Veranos que rozan los cuarenta y humedad que puede caer por debajo del veinte por ciento. Inviernos bajo cero – aquí también nieva. El refrán local lo resume: «nueve meses de invierno, tres de infierno».</p><p>El aire seco drena la humedad de la piel. A 650 m de altitud el UV pega más fuerte. Aire acondicionado en verano y calefacción en invierno secan el interior.</p>",
      tipsTitle: "Consejos para quien vive en Madrid",
      tips: [
        { title: "Hidrata sin piedad", body: "El aire madrileño pide más crema que la mayoría de capitales. Aceite mañana y noche." },
        { title: "El Retiro", body: "Sombra, aire y calma en el pulmón verde de la ciudad." },
        { title: "UV todos los días", body: "Altitud + sol fuerte = protección solar diaria, obligatoria." },
        { title: "Tapeo con sentido", body: "Aceite de oliva, frutos secos, fruta seca, pescado – piel feliz." },
        { title: "Agua constante", body: "La deshidratación es el riesgo de fondo. Por dentro cuenta." }
      ],
      solutionTitle: "Cosmética con CBD con entrega en Madrid",
      solutionBody: "<p>Enviamos desde Suecia; 3–5 días laborables hasta Madrid. Envío gratis desde 50 €.</p><p>El DUO-kit refuerza la barrera base. TA-DA Serum con CBG aporta la humedad intensa que exige el clima seco. Au Naturel limpia sin resecar más.</p>",
      faq: [
        { q: "¿Envían a España?", a: "Sí, 3–5 días laborables. Envío gratis desde 50 €." },
        { q: "¿El CBD en cosmética es legal en España?", a: "Sí, el CBD en cuidado de la piel es legal en España." },
        { q: "¿Qué producto para el clima seco de Madrid?", a: "TA-DA Serum para humedad intensa; DUO-kit como base diaria." },
        { q: "¿Plazo de envío?", a: "3–5 días laborables." }
      ],
      ctaTitle: "Dale a tu piel lo que Madrid exige",
      ctaSub: "Cosmética natural con CBD de Suecia a Madrid. Envío gratis desde 50 €."
    },
    de: {
      metaTitle: "Hautpflege Madrid – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für Madrid. Online bestellen, ab 50 € versandkostenfrei. Schutz vor brütender Hitze und extrem trockener Luft.",
      kicker: "Hautpflege in Madrid",
      h1: "Natürliche Hautpflege für Madrid",
      lead: "Madrid – Europas höchstgelegene Hauptstadt mit einem der extremsten Klimas. Glühende Sommer, kalte Winter, dauernd trockene Luft. Ab 50 € versandkostenfrei.",
      problemTitle: "Was Madrid mit deiner Haut macht",
      problemBody: "<p>Kontinentales Mittelmeerklima mit harten Schwankungen. Sommer bis vierzig Grad, Luftfeuchtigkeit unter zwanzig Prozent. Winter unter null – es schneit. Das lokale Sprichwort trifft es: nueve meses de invierno, tres de infierno.</p><p>Trockene Luft zieht Feuchtigkeit aus der Haut. 650 m Höhe = stärkeres UV. Klimaanlage und Heizung trocknen drinnen zusätzlich.</p>",
      tipsTitle: "Hautpflege-Tipps für Madrid",
      tips: [
        { title: "Richtig feuchthalten", body: "Madrids Luft braucht mehr Pflege als die meisten Städte. Öl morgens und abends." },
        { title: "Retiro", body: "Schatten, frische Luft, Ruhe – Madrids grünes Juwel." },
        { title: "Täglich UV-Schutz", body: "Höhenlage plus starke Sonne – Lichtschutz ist Pflicht." },
        { title: "Tapas mit Plan", body: "Olivenöl, Nüsse, Trockenobst, Fisch – perfekte Skin-Food-Kombi." },
        { title: "Ständig trinken", body: "Dehydrierung ist das Dauer-Risiko. Innere Hydration zählt." }
      ],
      solutionTitle: "CBD-Hautpflege nach Madrid",
      solutionBody: "<p>Versand aus Schweden – 3–5 Werktage nach Madrid. Ab 50 € versandkostenfrei.</p><p>Das DUO-kit gibt grundlegenden Barriere-Schutz. TA-DA Serum mit CBG liefert die intensive Feuchtigkeit, die Madrids trockenes Klima verlangt. Au Naturel reinigt mild ohne weiter auszutrocknen.</p>",
      faq: [
        { q: "Liefert ihr nach Spanien?", a: "Ja, 3–5 Werktage. Ab 50 € versandkostenfrei." },
        { q: "Ist CBD-Kosmetik in Spanien legal?", a: "Ja, CBD in Hautpflege ist in Spanien erlaubt." },
        { q: "Welches Produkt fürs trockene Madrid-Klima?", a: "TA-DA Serum für intensive Feuchtigkeit, DUO-kit als tägliche Basis." },
        { q: "Wie lange dauert der Versand?", a: "3–5 Werktage." }
      ],
      ctaTitle: "Gib deiner Haut, was Madrid verlangt",
      ctaSub: "Natürliche CBD-Pflege von Schweden nach Madrid. Ab 50 € versandkostenfrei."
    },
    fr: {
      metaTitle: "Soin du visage Madrid – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Madrid. Commande en ligne, livraison offerte dès 50 €. Protège ta peau de la chaleur torride et de l’air extrêmement sec.",
      kicker: "Soins à Madrid",
      h1: "Soins naturels pour Madrid",
      lead: "Madrid – capitale la plus haute d’Europe, avec un des climats les plus extrêmes. Étés brûlants, hivers froids, air sec en permanence. Livraison offerte dès 50 €.",
      problemTitle: "Ce que Madrid fait à ta peau",
      problemBody: "<p>Climat méditerranéen continental à fortes oscillations. Étés vers quarante degrés, humidité qui peut passer sous vingt pour cent. Hivers sous zéro – il neige. La formule locale : neuf mois d’hiver, trois d’enfer.</p><p>L’air sec vide la peau de son eau. À 650 m d’altitude l’UV est plus intense. Clim l’été, chauffage l’hiver : sécheresse intérieure en plus.</p>",
      tipsTitle: "Conseils peau pour Madrid",
      tips: [
        { title: "Hydrate sans compromis", body: "L’air madrilène exige plus que la plupart des capitales. Huile matin et soir." },
        { title: "Retiro", body: "Ombre, air, calme – le joyau vert de la ville." },
        { title: "UV au quotidien", body: "Altitude + soleil fort = protection solaire obligatoire." },
        { title: "Tapas malins", body: "Huile d’olive, fruits secs, poisson – nourriture peau parfaite." },
        { title: "Eau en continu", body: "La déshydratation est le risque permanent. L’intérieur du corps compte." }
      ],
      solutionTitle: "Soins au CBD livrés à Madrid",
      solutionBody: "<p>Expédition depuis la Suède ; 3–5 jours ouvrés jusqu’à Madrid. Livraison offerte dès 50 €.</p><p>Le DUO-kit renforce la barrière de base. TA-DA Serum au CBG apporte l’hydratation intense qu’exige le climat sec. Au Naturel nettoie sans assécher davantage.</p>",
      faq: [
        { q: "Livrez-vous en Espagne ?", a: "Oui, 3–5 jours ouvrés. Livraison offerte dès 50 €." },
        { q: "Le CBD en cosmétique est-il légal en Espagne ?", a: "Oui, le CBD dans les soins est légal en Espagne." },
        { q: "Quel produit pour le climat sec de Madrid ?", a: "TA-DA Serum pour l’hydratation intense ; DUO-kit comme base quotidienne." },
        { q: "Délai de livraison ?", a: "3–5 jours ouvrés." }
      ],
      ctaTitle: "Offre à ta peau ce que Madrid exige",
      ctaSub: "Soins naturels au CBD de la Suède à Madrid. Livraison offerte dès 50 €."
    }
  },
  {
    svSlug: "hudvard-rom",
    enSlug: "skincare-rome",
    esSlug: "cuidado-piel-cbd-rome",
    deSlug: "cbd-hautpflege-rome",
    frSlug: "soin-peau-cbd-rome",
    category: "stad",
    productIds: ["duo-kit", "au-naturel-makeup-remover", "fungtastic-mushroom-extract"],
    sv: {
      metaTitle: "Hudvård Rom – CBD-hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i Rom. Beställ online med fri frakt över €60. Skydda din hud mot Roms sol, föroreningar och stadsliv.",
      kicker: "Hudvård i Rom",
      h1: "Naturlig hudvård för dig i Rom",
      lead: "Rom – den eviga staden med eviga hudutmaningar. Intensiv sol, trafikföroreningar och het sommarluft testar din hud. Fri frakt över €60.",
      problemTitle: "Romhudens utmaningar",
      problemBody: "<p>Rom har ett varmt medelhavsklimat med heta, torra somrar och milda vintrar. UV-strålningen är stark från april till oktober, och kumulativ solexponering driver prematur hudåldring. Romtrafiken – scooters, bilar, bussar i trånga gator – skapar föroreningsnivåer som överskrider EU-gränsvärden regelbundet.</p><p>Sommarens värmeböljor med temperaturer över fyrtio grader stressar huden enormt. Luftkonditionering inomhus torkar ut ytterligare. Roms kranvatten kommer från akvedukter och är generellt bra, men varierar mellan stadsdelar.</p>",
      tipsTitle: "Hudvårdstips för rombor",
      tips: [
        { title: "UV-skydd är obligatoriskt", body: "Roms sol är intensiv nästan hela året. Dagligt UV-skydd – ingen diskussion." },
        { title: "Promenera tidigt i Villa Borghese", body: "Undvik mitt-på-dagen-hettan. Morgonpromenader i Villa Borghese ger frisk luft och skugga." },
        { title: "Dubbelrengöring varje kväll", body: "Roms föroreningar kräver ordentlig rengöring. Aldrig somna med stadens smuts på huden." },
        { title: "Medelhavskosten", body: "Italiensk matkultur är hudvård inifrån. Olivolja, tomater, fisk, citrus – naturen har gett Italien allt." },
        { title: "Hydrering inifrån", body: "Roms somrar kräver minst två liter vatten dagligen. Dehydrerad kropp ger dehydrerad hud." }
      ],
      solutionTitle: "CBD-hudvård levererad till Rom",
      solutionBody: "<p>Vi skickar från Sverige – leverans till Rom inom 3–5 arbetsdagar. Fri frakt över €60.</p><p>DUO-kit ger antioxidantskydd. Au Naturel rengör bort föroreningar milt. Fungtastic stödjer hudens motståndskraft inifrån.</p>",
      faq: [
        { q: "Levererar ni till Italien?", a: "Ja, 3–5 arbetsdagar. Fri frakt över €60." },
        { q: "Är CBD-hudvård lagligt i Italien?", a: "Ja, CBD i hudvård är lagligt i Italien." },
        { q: "Vilken produkt för Roms klimat?", a: "DUO-kit för dagligt skydd, Au Naturel för rengöring av föroreningar." },
        { q: "Hur lång tid tar leveransen?", a: "3–5 arbetsdagar." }
      ],
      ctaTitle: "Ge din hud det Rom kräver",
      ctaSub: "Naturlig CBD-hudvård från Sverige till Rom. Fri frakt över €60."
    },
    en: {
      metaTitle: "Skincare Rome – CBD skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Rome. Order online with free shipping over €60. Protect your skin from Roman sun, pollution, and Mediterranean heat.",
      kicker: "Skincare in Rome",
      h1: "Natural skincare for Rome",
      lead: "Rome – the eternal city with eternal skin challenges. Intense sun, traffic pollution, and scorching summer air test your skin daily. Free shipping over €60.",
      problemTitle: "What Rome does to your skin",
      problemBody: "<p>Rome has a warm Mediterranean climate with hot, dry summers and mild winters. UV radiation is strong from April to October, and cumulative sun exposure drives premature skin aging. Roman traffic – scooters, cars, buses in narrow streets – creates pollution levels that regularly exceed EU limits.</p><p>Summer heat waves with temperatures above forty degrees stress the skin enormously. Air conditioning indoors dehydrates further. Rome's tap water comes from aqueducts and is generally good, but varies between neighborhoods.</p>",
      tipsTitle: "Skincare tips for Roman residents",
      tips: [
        { title: "UV protection is mandatory", body: "Rome's sun is intense almost year-round. Daily UV protection – no discussion." },
        { title: "Walk early in Villa Borghese", body: "Avoid the midday heat. Morning walks in Villa Borghese offer fresh air and shade." },
        { title: "Double cleanse every evening", body: "Rome's pollution demands proper cleansing. Never sleep with the city's grime on your skin." },
        { title: "The Mediterranean diet", body: "Italian food culture is skincare from within. Olive oil, tomatoes, fish, citrus – nature gave Italy everything." },
        { title: "Hydrate from within", body: "Roman summers demand at least two liters of water daily. A dehydrated body means dehydrated skin." }
      ],
      solutionTitle: "CBD skincare delivered to Rome",
      solutionBody: "<p>We ship from Sweden – delivery to Rome within 3–5 business days. Free shipping on orders over €60.</p><p>The DUO-kit provides antioxidant protection. Au Naturel gently cleans away pollution. Fungtastic supports skin resilience from within.</p>",
      faq: [
        { q: "Do you ship to Italy?", a: "Yes, 3–5 business days. Free shipping over €60." },
        { q: "Is CBD skincare legal in Italy?", a: "Yes, CBD in skincare is legal in Italy." },
        { q: "Which product for Rome's climate?", a: "DUO-kit for daily protection, Au Naturel for pollution cleansing." },
        { q: "How long does shipping take?", a: "3–5 business days." }
      ],
      ctaTitle: "Give your skin what Rome demands",
      ctaSub: "Natural CBD skincare from Sweden to Rome. Free shipping over €60."
    },
    es: {
      metaTitle: "Cuidado de la piel Roma – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Roma. Pide online, envío gratis desde 50 €. Protege tu piel del sol romano, la contaminación y el calor mediterráneo.",
      kicker: "Cuidado de la piel en Roma",
      h1: "Cosmética natural para Roma",
      lead: "Roma – ciudad eterna con retos eternos para la piel. Sol fuerte, tráfico y veranos que queman. Envío gratis desde 50 €.",
      problemTitle: "Lo que Roma le hace a tu piel",
      problemBody: "<p>Clima mediterráneo cálido: veranos secos y calurosos, inviernos suaves. El UV pega de abril a octubre; el sol acumulado acelera el envejecimiento. Scooters, coches y autobuses en calles estrechas superan a menudo los límites UE de contaminación.</p><p>Olas de calor por encima de cuarenta estrésan la piel. El aire acondicionado seca más. El agua del grifo viene de acueductos y suele ser buena, pero cambia según el barrio.</p>",
      tipsTitle: "Consejos para quien vive en Roma",
      tips: [
        { title: "Protección UV obligatoria", body: "El sol romano casi no descansa. Fotoprotección diaria, sin debate." },
        { title: "Villa Borghese al amanecer", body: "Evita el mediodía infernal. Mañana: aire y sombra." },
        { title: "Doble limpieza cada noche", body: "La polución exige ritual. No duermas con la ciudad encima." },
        { title: "Dieta mediterránea", body: "Aceite de oliva, tomate, pescado, cítricos – Italia lo tiene todo." },
        { title: "Hidrátate por dentro", body: "En verano, mínimo dos litros de agua al día. Cuerpo seco = piel seca." }
      ],
      solutionTitle: "Cosmética con CBD con entrega en Roma",
      solutionBody: "<p>Enviamos desde Suecia; 3–5 días laborables hasta Roma. Envío gratis desde 50 €.</p><p>El DUO-kit aporta antioxidantes. Au Naturel limpia la contaminación con suavidad. Fungtastic Mushroom Extract apoya la resistencia de la piel.</p>",
      faq: [
        { q: "¿Envían a Italia?", a: "Sí, 3–5 días laborables. Envío gratis desde 50 €." },
        { q: "¿El CBD en cosmética es legal en Italia?", a: "Sí, el CBD en cuidado de la piel es legal en Italia." },
        { q: "¿Qué producto para el clima de Roma?", a: "DUO-kit para protección diaria; Au Naturel para limpiar la contaminación." },
        { q: "¿Plazo de envío?", a: "3–5 días laborables." }
      ],
      ctaTitle: "Dale a tu piel lo que Roma exige",
      ctaSub: "Cosmética natural con CBD de Suecia a Roma. Envío gratis desde 50 €."
    },
    de: {
      metaTitle: "Hautpflege Rom – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für Rom. Online bestellen, ab 50 € versandkostenfrei. Schutz vor römischer Sonne, Smog und mediterraner Hitze.",
      kicker: "Hautpflege in Rom",
      h1: "Natürliche Hautpflege für Rom",
      lead: "Rom – die ewige Stadt mit ewigen Haut-Herausforderungen. Intensive Sonne, Verkehrssmog und brütende Sommerluft. Ab 50 € versandkostenfrei.",
      problemTitle: "Was Rom mit deiner Haut macht",
      problemBody: "<p>Warmes Mittelmeerklima: heiße, trockene Sommer, milde Winter. Starke UV-Strahlung von April bis Oktober; kumulative Sonne treibt vorzeitige Alterung. Roller, Autos, Busse in engen Gassen – Belastung über EU-Grenzwerte ist keine Seltenheit.</p><p>Hitzewellen über vierzig Grad stressen die Haut massiv. Klimaanlage trocknet zusätzlich. Leitungswasser kommt aus Aquädukten und ist meist gut, variiert aber nach Viertel.</p>",
      tipsTitle: "Hautpflege-Tipps für Rom",
      tips: [
        { title: "UV-Pflicht", body: "Roms Sonne ist fast ganzjährig stark. Täglicher Lichtschutz – keine Diskussion." },
        { title: "Früh in der Villa Borghese", body: "Mittagshitze meiden. Morgens: frische Luft und Schatten." },
        { title: "Abends doppelt reinigen", body: "Smog verlangt Routine. Nie mit Stadtgrime schlafen." },
        { title: "Mittelmeerkost", body: "Olivenöl, Tomaten, Fisch, Zitrus – Italien hat alles." },
        { title: "Von innen trinken", body: "Römische Sommer brauchen mindestens zwei Liter Wasser täglich." }
      ],
      solutionTitle: "CBD-Hautpflege nach Rom",
      solutionBody: "<p>Versand aus Schweden – 3–5 Werktage nach Rom. Ab 50 € versandkostenfrei.</p><p>Das DUO-kit liefert antioxidativen Schutz. Au Naturel entfernt Schmutz und Abgase mild. Fungtastic Mushroom Extract unterstützt die Widerstandskraft der Haut.</p>",
      faq: [
        { q: "Liefert ihr nach Italien?", a: "Ja, 3–5 Werktage. Ab 50 € versandkostenfrei." },
        { q: "Ist CBD-Kosmetik in Italien legal?", a: "Ja, CBD in Hautpflege ist in Italien erlaubt." },
        { q: "Welches Produkt fürs Rom-Klima?", a: "DUO-kit für täglichen Schutz, Au Naturel gegen Smog-Rückstände." },
        { q: "Wie lange dauert der Versand?", a: "3–5 Werktage." }
      ],
      ctaTitle: "Gib deiner Haut, was Rom verlangt",
      ctaSub: "Natürliche CBD-Pflege von Schweden nach Rom. Ab 50 € versandkostenfrei."
    },
    fr: {
      metaTitle: "Soin du visage Rome – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Rome. Commande en ligne, livraison offerte dès 50 €. Protège ta peau du soleil romain, de la pollution et de la chaleur méditerranéenne.",
      kicker: "Soins à Rome",
      h1: "Soins naturels pour Rome",
      lead: "Rome – ville éternelle avec défis cutanés permanents. Soleil intense, pollution routière et étés torrides. Livraison offerte dès 50 €.",
      problemTitle: "Ce que Rome fait à ta peau",
      problemBody: "<p>Climat méditerranéen chaud : étés secs et chauds, hivers doux. UV fort d’avril à octobre ; soleil cumulé = vieillissement accéléré. Scooters, voitures, bus dans des rues étroites : dépassements des seuils UE fréquents.</p><p>Canicules au-dessus de quarante degrés : stress cutané maximal. Clim intérieure assèche encore. L’eau du robinet, issue des aqueducs, est en général bonne mais variable selon le quartier.</p>",
      tipsTitle: "Conseils peau pour Rome",
      tips: [
        { title: "UV non négociable", body: "Le soleil romain tape presque toute l’année. Protection quotidienne, point final." },
        { title: "Villa Borghese tôt", body: "Évite le cœur de journée. Le matin : air et ombre." },
        { title: "Double nettoyage le soir", body: "La pollution impose le rituel. Jamais dormir avec la ville sur le visage." },
        { title: "Régime méditerranéen", body: "Huile d’olive, tomates, poisson, agrumes – l’Italie a tout." },
        { title: "Hydratation interne", body: "Les étés romains : au moins deux litres d’eau par jour." }
      ],
      solutionTitle: "Soins au CBD livrés à Rome",
      solutionBody: "<p>Expédition depuis la Suède ; 3–5 jours ouvrés jusqu’à Rome. Livraison offerte dès 50 €.</p><p>Le DUO-kit apporte une protection antioxydante. Au Naturel enlève la pollution en douceur. Fungtastic Mushroom Extract soutient la résilience de la peau.</p>",
      faq: [
        { q: "Livrez-vous en Italie ?", a: "Oui, 3–5 jours ouvrés. Livraison offerte dès 50 €." },
        { q: "Le CBD en cosmétique est-il légal en Italie ?", a: "Oui, le CBD dans les soins est légal en Italie." },
        { q: "Quel produit pour le climat de Rome ?", a: "DUO-kit au quotidien ; Au Naturel pour nettoyer la pollution." },
        { q: "Délai de livraison ?", a: "3–5 jours ouvrés." }
      ],
      ctaTitle: "Offre à ta peau ce que Rome exige",
      ctaSub: "Soins naturels au CBD de la Suède à Rome. Livraison offerte dès 50 €."
    }
  },
  {
    svSlug: "hudvard-milano",
    enSlug: "skincare-milan",
    esSlug: "cuidado-piel-cbd-milan",
    deSlug: "cbd-hautpflege-milan",
    frSlug: "soin-peau-cbd-milan",
    category: "stad",
    productIds: ["duo-kit", "au-naturel-makeup-remover", "ta-da-serum"],
    sv: {
      metaTitle: "Hudvård Milano – CBD-hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i Milano. Beställ online med fri frakt över €60. Skydda din hud mot Po-dalens föroreningar och fukt.",
      kicker: "Hudvård i Milano",
      h1: "Naturlig hudvård för dig i Milano",
      lead: "Milano – modehuvudstaden med Europas sämsta luftkvalitet. Po-dalens dimma, föroreningar och fuktiga somrar utmanar din hud. Fri frakt över €60.",
      problemTitle: "Milanohudens utmaningar",
      problemBody: "<p>Milano ligger i Po-dalen, omringad av Alperna och Apenninerna. Denna geografiska fälla gör att luftföroreningar stannar kvar – Milano har konsekvent bland Europas sämsta luftkvalitet. Vinterns dimma blandas med avgaser och skapar en grå smog som belastar huden dag efter dag.</p><p>Somrarna är kvävande heta och fuktiga med temperaturer runt trettiofem grader och hög luftfuktighet. Vintrarna är rått kalla med dimma. Huden utsätts för konstant stress – fukt, föroreningar och temperaturväxlingar.</p>",
      tipsTitle: "Hudvårdstips för milanobor",
      tips: [
        { title: "Dubbelrengöring är ett måste", body: "Milanos luftföroreningar kräver grundlig rengöring varje kväll. Annars oxiderar partiklarna på huden under natten." },
        { title: "Promenera i Parco Sempione", body: "Milanos gröna oas bakom Sforzas slott ger andrum från smogen." },
        { title: "Antioxidanter dagligen", body: "CBD:s antioxidativa egenskaper motverkar den oxidativa stressen från Po-dalens föroreningar." },
        { title: "Italiensk kost", body: "Milano har tillgång till fantastisk mat – utnyttja det. Olivolja, grönsaker, fisk." },
        { title: "Anpassa efter säsong", body: "Milanos sommrar och vintrar kräver helt olika rutiner. Lättare produkter på sommaren, rikare på vintern." }
      ],
      solutionTitle: "CBD-hudvård levererad till Milano",
      solutionBody: "<p>Vi skickar från Sverige – leverans till Milano inom 3–5 arbetsdagar. Fri frakt över €60.</p><p>DUO-kit ger dagligt antioxidantskydd mot föroreningar. Au Naturel rengör bort smog effektivt. TA-DA Serum ger extra fukt under torra vintermånader.</p>",
      faq: [
        { q: "Levererar ni till Italien?", a: "Ja, 3–5 arbetsdagar. Fri frakt över €60." },
        { q: "Vilken produkt mot Milanos föroreningar?", a: "Au Naturel Makeup Remover rengör bort dagliga föroreningar. DUO-kit stärker barriären." },
        { q: "Är CBD lagligt i Italien?", a: "Ja, CBD i hudvård är lagligt i Italien." },
        { q: "Hur lång tid tar leveransen?", a: "3–5 arbetsdagar." }
      ],
      ctaTitle: "Ge din hud det Milano kräver",
      ctaSub: "Naturlig CBD-hudvård från Sverige till Milano. Fri frakt över €60."
    },
    en: {
      metaTitle: "Skincare Milan – CBD skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Milan. Order online with free shipping over €60. Protect your skin from the Po Valley's notorious pollution and humidity.",
      kicker: "Skincare in Milan",
      h1: "Natural skincare for Milan",
      lead: "Milan – the fashion capital with Europe's worst air quality. The Po Valley's fog, pollution, and humid summers challenge your skin. Free shipping over €60.",
      problemTitle: "What Milan does to your skin",
      problemBody: "<p>Milan sits in the Po Valley, surrounded by the Alps and the Apennines. This geographical trap means air pollution lingers – Milan consistently has among Europe's worst air quality. Winter fog mixes with exhaust fumes, creating a grey smog that stresses the skin day after day.</p><p>Summers are stiflingly hot and humid with temperatures around thirty-five degrees and high humidity. Winters are rawly cold with fog. The skin faces constant stress – humidity, pollution, and temperature shifts.</p>",
      tipsTitle: "Skincare tips for Milan residents",
      tips: [
        { title: "Double cleansing is a must", body: "Milan's air pollution demands thorough cleansing every evening. Otherwise, particles oxidize on the skin overnight." },
        { title: "Walk in Parco Sempione", body: "Milan's green oasis behind the Sforza Castle offers respite from the smog." },
        { title: "Antioxidants daily", body: "CBD's antioxidant properties counteract the oxidative stress from the Po Valley's pollution." },
        { title: "Italian cuisine", body: "Milan has access to incredible food – take advantage. Olive oil, vegetables, fish." },
        { title: "Adapt to the season", body: "Milan's summers and winters demand completely different routines. Lighter products in summer, richer in winter." }
      ],
      solutionTitle: "CBD skincare delivered to Milan",
      solutionBody: "<p>We ship from Sweden – delivery to Milan within 3–5 business days. Free shipping on orders over €60.</p><p>The DUO-kit provides daily antioxidant protection against pollution. Au Naturel effectively cleans away smog. TA-DA Serum provides extra moisture during dry winter months.</p>",
      faq: [
        { q: "Do you ship to Italy?", a: "Yes, 3–5 business days. Free shipping over €60." },
        { q: "Which product for Milan's pollution?", a: "Au Naturel Makeup Remover cleans away daily pollution. The DUO-kit strengthens the barrier." },
        { q: "Is CBD legal in Italy?", a: "Yes, CBD in skincare is legal in Italy." },
        { q: "How long does shipping take?", a: "3–5 business days." }
      ],
      ctaTitle: "Give your skin what Milan demands",
      ctaSub: "Natural CBD skincare from Sweden to Milan. Free shipping over €60."
    },
    es: {
      metaTitle: "Cuidado de la piel Milán – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Milán. Pide online, envío gratis desde 50 €. Protege tu piel de la contaminación del valle del Po y la humedad.",
      kicker: "Cuidado de la piel en Milán",
      h1: "Cosmética natural para Milán",
      lead: "Milán – capital de la moda con un aire entre los peores de Europa. Niebla del Po, humo y veranos bochornosos. Envío gratis desde 50 €.",
      problemTitle: "Lo que Milán le hace a tu piel",
      problemBody: "<p>Enclavada en el valle del Po, entre Alpes y Apeninos: la geografía atrapa la contaminación. Milán suele figurar en los peores rankings de calidad del aire. En invierno la niebla se mezcla con gases y deja un smog gris que castiga la piel día tras día.</p><p>Veranos sofocantes, unos treinta y cinco grados y mucha humedad. Inviernos crudos con niebla. La piel sufre humedad, partículas y cambios térmicos sin tregua.</p>",
      tipsTitle: "Consejos para quien vive en Milán",
      tips: [
        { title: "Doble limpieza, sí o sí", body: "Sin limpieza profunda cada noche las partículas oxidan sobre la piel mientras duermes." },
        { title: "Parco Sempione", body: "Verde tras el castillo Sforza – respiro lejos del smog." },
        { title: "Antioxidantes a diario", body: "El CBD aporta antioxidantes frente al estrés oxidativo del valle del Po." },
        { title: "Cocina italiana de verdad", body: "Milán come bien: aceite de oliva, verduras, pescado." },
        { title: "Rutina según estación", body: "Verano e invierno no son lo mismo: texturas ligeras vs ricas." }
      ],
      solutionTitle: "Cosmética con CBD con entrega en Milán",
      solutionBody: "<p>Enviamos desde Suecia; 3–5 días laborables hasta Milán. Envío gratis desde 50 €.</p><p>El DUO-kit aporta antioxidantes diarios frente a la polución. Au Naturel limpia el smog con eficacia. TA-DA Serum hidrata más en invierno seco.</p>",
      faq: [
        { q: "¿Envían a Italia?", a: "Sí, 3–5 días laborables. Envío gratis desde 50 €." },
        { q: "¿Qué producto para la contaminación de Milán?", a: "Au Naturel Makeup Remover limpia el día urbano; el DUO-kit refuerza la barrera." },
        { q: "¿El CBD es legal en Italia?", a: "Sí, el CBD en cuidado de la piel es legal en Italia." },
        { q: "¿Plazo de envío?", a: "3–5 días laborables." }
      ],
      ctaTitle: "Dale a tu piel lo que Milán exige",
      ctaSub: "Cosmética natural con CBD de Suecia a Milán. Envío gratis desde 50 €."
    },
    de: {
      metaTitle: "Hautpflege Mailand – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für Mailand. Online bestellen, ab 50 € versandkostenfrei. Schutz vor Po-Ebene-Smog und Schwüle.",
      kicker: "Hautpflege in Mailand",
      h1: "Natürliche Hautpflege für Mailand",
      lead: "Mailand – Modehauptstadt mit Europas schlechtester Luft. Po-Nebel, Abgase und schwüle Sommer. Ab 50 € versandkostenfrei.",
      problemTitle: "Was Mailand mit deiner Haut macht",
      problemBody: "<p>In der Po-Ebene zwischen Alpen und Apennin gefangen – Schadstoffe bleiben hängen. Mailand rangiert dauernd unten bei der Luftqualität. Winternebel mischt sich mit Abgasen zu grauem Smog, der die Haut Tag für Tag strapaziert.</p><p>Sommer drückend heiß, um fünfunddreißig Grad und hohe Luftfeuchtigkeit. Winter roh und neblig. Die Haut bekommt Feuchte, Partikel und Temperaturwechsel nonstop.</p>",
      tipsTitle: "Hautpflege-Tipps für Mailand",
      tips: [
        { title: "Doppelreinigung Pflicht", body: "Ohne gründliche Abendreinigung oxidieren Partikel über Nacht auf der Haut." },
        { title: "Parco Sempione", body: "Grün hinter dem Sforza-Schloss – Atempause vom Smog." },
        { title: "Täglich Antioxidantien", body: "CBD liefert Antioxidantien gegen oxidativen Stress aus der Po-Ebene." },
        { title: "Italienisch essen", body: "Mailand hat großartiges Essen – nutzen. Olivenöl, Gemüse, Fisch." },
        { title: "Saison anpassen", body: "Sommer und Winter brauchen andere Routinen – leichter vs. reichhaltiger." }
      ],
      solutionTitle: "CBD-Hautpflege nach Mailand",
      solutionBody: "<p>Versand aus Schweden – 3–5 Werktage nach Mailand. Ab 50 € versandkostenfrei.</p><p>Das DUO-kit liefert täglichen antioxidativen Schutz gegen Smog. Au Naturel reinigt effektiv. TA-DA Serum spendet extra in trockenen Wintern.</p>",
      faq: [
        { q: "Liefert ihr nach Italien?", a: "Ja, 3–5 Werktage. Ab 50 € versandkostenfrei." },
        { q: "Welches Produkt gegen Mailands Smog?", a: "Au Naturel Makeup Remover entfernt den Alltagsschmutz, das DUO-kit stärkt die Barriere." },
        { q: "Ist CBD in Italien legal?", a: "Ja, CBD in Hautpflege ist in Italien erlaubt." },
        { q: "Wie lange dauert der Versand?", a: "3–5 Werktage." }
      ],
      ctaTitle: "Gib deiner Haut, was Mailand verlangt",
      ctaSub: "Natürliche CBD-Pflege von Schweden nach Mailand. Ab 50 € versandkostenfrei."
    },
    fr: {
      metaTitle: "Soin du visage Milan – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Milan. Commande en ligne, livraison offerte dès 50 €. Protège ta peau de la pollution du bassin du Pô et de l’humidité.",
      kicker: "Soins à Milan",
      h1: "Soins naturels pour Milan",
      lead: "Milan – capitale de la mode avec l’une des pires qualités d’air d’Europe. Brume du Pô, pollution et étés étouffants. Livraison offerte dès 50 €.",
      problemTitle: "Ce que Milan fait à ta peau",
      problemBody: "<p>Coincée dans la plaine du Pô, entre Alpes et Apennins : la pollution stagne. Milan figure souvent en bas des classements européens. En hiver, brouillard et gaz d’échappement forment un smog gris qui épuise la peau jour après jour.</p><p>Étés étouffants, autour de trente-cinq degrés et forte humidité. Hivers crus et brumeux. La peau subit humidité, particules et sauts de température en continu.</p>",
      tipsTitle: "Conseils peau pour Milan",
      tips: [
        { title: "Double nettoyage obligatoire", body: "Sans démaquillage sérieux le soir, les particules s’oxydent sur la peau la nuit." },
        { title: "Parco Sempione", body: "Oasis verte derrière le château Sforza – pause loin du smog." },
        { title: "Antioxydants au quotidien", body: "Le CBD aide contre le stress oxydatif du bassin du Pô." },
        { title: "Cuisine italienne", body: "Milan a une scène food incroyable – huile d’olive, légumes, poisson." },
        { title: "Adapter la saison", body: "Été et hiver = routines différentes : textures légères vs riches." }
      ],
      solutionTitle: "Soins au CBD livrés à Milan",
      solutionBody: "<p>Expédition depuis la Suède ; 3–5 jours ouvrés jusqu’à Milan. Livraison offerte dès 50 €.</p><p>Le DUO-kit apporte une protection antioxydante quotidienne contre la pollution. Au Naturel nettoie le smog efficacement. TA-DA Serum hydrate davantage pendant l’hiver sec.</p>",
      faq: [
        { q: "Livrez-vous en Italie ?", a: "Oui, 3–5 jours ouvrés. Livraison offerte dès 50 €." },
        { q: "Quel produit contre la pollution de Milan ?", a: "Au Naturel Makeup Remover enlève la ville du jour ; le DUO-kit renforce la barrière." },
        { q: "Le CBD est-il légal en Italie ?", a: "Oui, le CBD dans les soins est légal en Italie." },
        { q: "Délai de livraison ?", a: "3–5 jours ouvrés." }
      ],
      ctaTitle: "Offre à ta peau ce que Milan exige",
      ctaSub: "Soins naturels au CBD de la Suède à Milan. Livraison offerte dès 50 €."
    }
  },
  {
    svSlug: "hudvard-lissabon",
    enSlug: "skincare-lisbon",
    esSlug: "cuidado-piel-cbd-lisbon",
    deSlug: "cbd-hautpflege-lisbon",
    frSlug: "soin-peau-cbd-lisbon",
    category: "stad",
    productIds: ["duo-kit", "ta-da-serum", "au-naturel-makeup-remover"],
    sv: {
      metaTitle: "Hudvård Lissabon – CBD-hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i Lissabon. Beställ online med fri frakt över €60. Skydda din hud mot Atlantsolen och Lissabons bris.",
      kicker: "Hudvård i Lissabon",
      h1: "Naturlig hudvård för dig i Lissabon",
      lead: "Lissabon – sol, Atlanten och kullersten. Den intensiva portugisiska solen och Atlantvinden utmanar din hud året runt. Fri frakt över €60.",
      problemTitle: "Lissabonhudens utmaningar",
      problemBody: "<p>Lissabon har över 2800 soltimmar per år – bland de mest solrika huvudstäderna i Europa. Den kumulativa UV-exponeringen driver prematur åldring och pigmentförändringar. Atlantvinden ger en uppfriskande bris men torkar ut huden, särskilt på de berömda kullarna.</p><p>Somrarna är heta och torra, men inte lika extrema som Madrid. Vintrarna är milda men regniga. Lissabons vatten är generellt mjukt och av god kvalitet.</p>",
      tipsTitle: "Hudvårdstips för lissabonbor",
      tips: [
        { title: "UV-skydd dagligen", body: "Lissabons sol är stark nästan hela året. Dagligt UV-skydd är obligatoriskt." },
        { title: "Promenera i Jardim da Estrela", body: "En grön oas mitt i staden med skugga och ro." },
        { title: "Atlantisk fisk", body: "Portugals fiskkultur är fantastisk för huden. Sardiner, bacalhau, grillad fisk – omega-3 i varje måltid." },
        { title: "Återfukta efter vinden", body: "Atlantbrisen torkar ut. Applicera olja efter utomhusvistelse." },
        { title: "Portugisiskt olivolja", body: "Bland världens bästa. Använd den generöst – i mat och på huden." }
      ],
      solutionTitle: "CBD-hudvård levererad till Lissabon",
      solutionBody: "<p>Vi skickar från Sverige – leverans till Lissabon inom 3–5 arbetsdagar. Fri frakt över €60.</p><p>DUO-kit ger antioxidantskydd mot UV. TA-DA Serum ger intensiv fukt efter sol och vind. Au Naturel rengör milt och effektivt.</p>",
      faq: [
        { q: "Levererar ni till Portugal?", a: "Ja, 3–5 arbetsdagar. Fri frakt över €60." },
        { q: "Är CBD-hudvård lagligt i Portugal?", a: "Ja, CBD i hudvård är lagligt i Portugal." },
        { q: "Vilken produkt för Lissabons sol?", a: "DUO-kit som dagligt skydd, TA-DA Serum för intensiv fukt." },
        { q: "Hur lång tid tar leveransen?", a: "3–5 arbetsdagar." }
      ],
      ctaTitle: "Ge din hud det Lissabon kräver",
      ctaSub: "Naturlig CBD-hudvård från Sverige till Lissabon. Fri frakt över €60."
    },
    en: {
      metaTitle: "Skincare Lisbon – CBD skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Lisbon. Order online with free shipping over €60. Protect your skin from the Atlantic sun and Lisbon's ocean breeze.",
      kicker: "Skincare in Lisbon",
      h1: "Natural skincare for Lisbon",
      lead: "Lisbon – sun, Atlantic, and cobblestones. The intense Portuguese sun and Atlantic wind challenge your skin year-round. Free shipping over €60.",
      problemTitle: "What Lisbon does to your skin",
      problemBody: "<p>Lisbon gets over 2,800 sunshine hours per year – among the sunniest capitals in Europe. The cumulative UV exposure drives premature aging and pigmentation changes. The Atlantic wind provides a refreshing breeze but dries out the skin, especially on the famous hills.</p><p>Summers are hot and dry, but not as extreme as Madrid. Winters are mild but rainy. Lisbon's water is generally soft and good quality.</p>",
      tipsTitle: "Skincare tips for Lisbon residents",
      tips: [
        { title: "UV protection daily", body: "Lisbon's sun is strong almost year-round. Daily UV protection is mandatory." },
        { title: "Walk in Jardim da Estrela", body: "A green oasis in the middle of the city with shade and calm." },
        { title: "Atlantic fish", body: "Portugal's fish culture is fantastic for the skin. Sardines, bacalhau, grilled fish – omega-3s in every meal." },
        { title: "Moisturize after the wind", body: "The Atlantic breeze dries you out. Apply oil after time spent outdoors." },
        { title: "Portuguese olive oil", body: "Among the world's best. Use it generously – in food and on the skin." }
      ],
      solutionTitle: "CBD skincare delivered to Lisbon",
      solutionBody: "<p>We ship from Sweden – delivery to Lisbon within 3–5 business days. Free shipping on orders over €60.</p><p>The DUO-kit provides antioxidant protection against UV. TA-DA Serum delivers intense moisture after sun and wind. Au Naturel cleanses gently and effectively.</p>",
      faq: [
        { q: "Do you ship to Portugal?", a: "Yes, 3–5 business days. Free shipping over €60." },
        { q: "Is CBD skincare legal in Portugal?", a: "Yes, CBD in skincare is legal in Portugal." },
        { q: "Which product for Lisbon's sun?", a: "DUO-kit for daily protection, TA-DA Serum for intense moisture." },
        { q: "How long does shipping take?", a: "3–5 business days." }
      ],
      ctaTitle: "Give your skin what Lisbon demands",
      ctaSub: "Natural CBD skincare from Sweden to Lisbon. Free shipping over €60."
    },
    es: {
      metaTitle: "Cuidado de la piel Lisboa – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Lisboa. Pide online, envío gratis desde 50 €. Protege tu piel del sol atlántico y la brisa oceánica.",
      kicker: "Cuidado de la piel en Lisboa",
      h1: "Cosmética natural para Lisboa",
      lead: "Lisboa – sol, Atlántico y adoquines. El sol portugués intenso y el viento del océano retan la piel todo el año. Envío gratis desde 50 €.",
      problemTitle: "Lo que Lisboa le hace a tu piel",
      problemBody: "<p>Más de 2.800 horas de sol al año – entre las capitales más soleadas de Europa. El UV acumulado empuja envejecimiento y manchas. La brisa atlántica refresca pero seca, sobre todo en las colinas emblemáticas.</p><p>Veranos calurosos y secos, menos extremos que Madrid. Inviernos suaves y lluviosos. El agua suele ser blanda y de buena calidad.</p>",
      tipsTitle: "Consejos para quien vive en Lisboa",
      tips: [
        { title: "Protección UV diaria", body: "El sol aquí no descansa casi nunca. Fotoprotección obligatoria." },
        { title: "Jardim da Estrela", body: "Oasis verde en el centro: sombra y calma." },
        { title: "Pescado atlántico", body: "Sardinas, bacalao, pescado a la brasa – omega-3 en cada plato." },
        { title: "Hidrata tras el viento", body: "La brisa seca. Aceite después de estar fuera." },
        { title: "Aceite de oliva portugués", body: "De los mejores del mundo. En la mesa y en la rutina cutánea." }
      ],
      solutionTitle: "Cosmética con CBD con entrega en Lisboa",
      solutionBody: "<p>Enviamos desde Suecia; 3–5 días laborables hasta Lisboa. Envío gratis desde 50 €.</p><p>El DUO-kit aporta antioxidantes frente al UV. TA-DA Serum recupera humedad tras sol y viento. Au Naturel limpia con suavidad y eficacia.</p>",
      faq: [
        { q: "¿Envían a Portugal?", a: "Sí, 3–5 días laborables. Envío gratis desde 50 €." },
        { q: "¿El CBD en cosmética es legal en Portugal?", a: "Sí, el CBD en cuidado de la piel es legal en Portugal." },
        { q: "¿Qué producto para el sol de Lisboa?", a: "DUO-kit como escudo diario; TA-DA Serum para hidratación intensa." },
        { q: "¿Plazo de envío?", a: "3–5 días laborables." }
      ],
      ctaTitle: "Dale a tu piel lo que Lisboa exige",
      ctaSub: "Cosmética natural con CBD de Suecia a Lisboa. Envío gratis desde 50 €."
    },
    de: {
      metaTitle: "Hautpflege Lissabon – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für Lissabon. Online bestellen, ab 50 € versandkostenfrei. Schutz vor atlantischer Sonne und Meeresbrise.",
      kicker: "Hautpflege in Lissabon",
      h1: "Natürliche Hautpflege für Lissabon",
      lead: "Lissabon – Sonne, Atlantik, Kopfsteinpflaster. Intensive portugiesische Sonne und Ozeanwind fordern die Haut ganzjährig. Ab 50 € versandkostenfrei.",
      problemTitle: "Was Lissabon mit deiner Haut macht",
      problemBody: "<p>Über 2.800 Sonnenstunden pro Jahr – zu den sonnigsten Hauptstädten Europas. Kumulatives UV treibt Alterung und Pigmentierung. Atlantikwind kühlt, trocknet aber – besonders auf den Hügeln.</p><p>Sommer heiß und trocken, weniger extrem als Madrid. Winter mild und regnerisch. Wasser meist weich und gut.</p>",
      tipsTitle: "Hautpflege-Tipps für Lissabon",
      tips: [
        { title: "Täglich UV-Schutz", body: "Die Sonne ist fast immer stark. Lichtschutz ist Pflicht." },
        { title: "Jardim da Estrela", body: "Grüne Oase mit Schatten und Ruhe." },
        { title: "Atlantikfisch", body: "Sardinen, Bacalhau, gegrillter Fisch – Omega-3 in jeder Mahlzeit." },
        { title: "Nach dem Wind eincremen", body: "Brise trocknet aus. Öl nach Draußen-Sein." },
        { title: "Portugiesisches Olivenöl", body: "Weltklasse – in Küche und Hautpflege." }
      ],
      solutionTitle: "CBD-Hautpflege nach Lissabon",
      solutionBody: "<p>Versand aus Schweden – 3–5 Werktage nach Lissabon. Ab 50 € versandkostenfrei.</p><p>Das DUO-kit liefert antioxidativen Schutz gegen UV. TA-DA Serum spendet nach Sonne und Wind. Au Naturel reinigt mild und gründlich.</p>",
      faq: [
        { q: "Liefert ihr nach Portugal?", a: "Ja, 3–5 Werktage. Ab 50 € versandkostenfrei." },
        { q: "Ist CBD-Kosmetik in Portugal legal?", a: "Ja, CBD in Hautpflege ist in Portugal erlaubt." },
        { q: "Welches Produkt für Lissabons Sonne?", a: "DUO-kit als täglicher Schutz, TA-DA Serum für intensive Feuchtigkeit." },
        { q: "Wie lange dauert der Versand?", a: "3–5 Werktage." }
      ],
      ctaTitle: "Gib deiner Haut, was Lissabon verlangt",
      ctaSub: "Natürliche CBD-Pflege von Schweden nach Lissabon. Ab 50 € versandkostenfrei."
    },
    fr: {
      metaTitle: "Soin du visage Lisbonne – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Lisbonne. Commande en ligne, livraison offerte dès 50 €. Protège ta peau du soleil atlantique et de la brise océanique.",
      kicker: "Soins à Lisbonne",
      h1: "Soins naturels pour Lisbonne",
      lead: "Lisbonne – soleil, Atlantique et pavés. Le soleil portugais intense et le vent marin sollicitent ta peau toute l’année. Livraison offerte dès 50 €.",
      problemTitle: "Ce que Lisbonne fait à ta peau",
      problemBody: "<p>Plus de 2 800 heures de soleil par an – parmi les capitales les plus ensoleillées d’Europe. L’UV cumulé pousse le vieillissement et les taches. La brise atlantique rafraîchit mais assèche, surtout sur les collines.</p><p>Étés chauds et secs, moins extrêmes qu’à Madrid. Hivers doux et pluvieux. L’eau est en général douce et de bonne qualité.</p>",
      tipsTitle: "Conseils peau pour Lisbonne",
      tips: [
        { title: "UV quotidien", body: "Le soleil tape presque toute l’année. Protection obligatoire." },
        { title: "Jardim da Estrela", body: "Oasis verte au centre : ombre et calme." },
        { title: "Poisson atlantique", body: "Sardines, bacalhau, poisson grillé – oméga-3 à chaque repas." },
        { title: "Hydrate après le vent", body: "La brise assèche. Huile après les sorties." },
        { title: "Huile d’olive portugaise", body: "Parmi les meilleures au monde – cuisine et peau." }
      ],
      solutionTitle: "Soins au CBD livrés à Lisbonne",
      solutionBody: "<p>Expédition depuis la Suède ; 3–5 jours ouvrés jusqu’à Lisbonne. Livraison offerte dès 50 €.</p><p>Le DUO-kit apporte des antioxydants contre l’UV. TA-DA Serum réhydrate après soleil et vent. Au Naturel nettoie en douceur et efficacement.</p>",
      faq: [
        { q: "Livrez-vous au Portugal ?", a: "Oui, 3–5 jours ouvrés. Livraison offerte dès 50 €." },
        { q: "Le CBD en cosmétique est-il légal au Portugal ?", a: "Oui, le CBD dans les soins est légal au Portugal." },
        { q: "Quel produit pour le soleil de Lisbonne ?", a: "DUO-kit au quotidien ; TA-DA Serum pour une hydratation intense." },
        { q: "Délai de livraison ?", a: "3–5 jours ouvrés." }
      ],
      ctaTitle: "Offre à ta peau ce que Lisbonne exige",
      ctaSub: "Soins naturels au CBD de la Suède à Lisbonne. Livraison offerte dès 50 €."
    }
  },
  {
    svSlug: "hudvard-aten",
    enSlug: "skincare-athens",
    esSlug: "cuidado-piel-cbd-athens",
    deSlug: "cbd-hautpflege-athens",
    frSlug: "soin-peau-cbd-athens",
    category: "stad",
    productIds: ["duo-kit", "au-naturel-makeup-remover", "ta-da-serum"],
    sv: {
      metaTitle: "Hudvård Aten – CBD-hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i Aten. Beställ online med fri frakt över €60. Skydda din hud mot grekisk sol, värme och stadsföroreningar.",
      kicker: "Hudvård i Aten",
      h1: "Naturlig hudvård för dig i Aten",
      lead: "Aten – antikens vagga med moderna hudutmaningar. Intensiv sol, urban smog och extrem sommarvärme. Fri frakt över €60.",
      problemTitle: "Atenhudens utmaningar",
      problemBody: "<p>Aten har en av Europas mest intensiva kombinationer av sol och föroreningar. UV-strålningen är stark från mars till oktober, och staden omges av berg som fångar avgaser och smog i ett bassängliknande mönster – det berömda 'nefos'. Somrarna når regelbundet fyrtio grader.</p><p>Luftkonditionering är en nödvändighet men torkar ut huden brutalt. Atens vatten har variabel kvalitet beroende på stadsdel.</p>",
      tipsTitle: "Hudvårdstips för atenbor",
      tips: [
        { title: "UV-skydd året runt", body: "Atens sol är brutal. Skydda dig dagligen – det är icke-förhandlingsbart." },
        { title: "Promenera tidigt i Nationella trädgården", body: "Undvik hettan. Morgonpromenader ger frisk luft och skugga." },
        { title: "Grekisk medelhavsmat", body: "Olivolja, feta, fisk, grönsaker – den grekiska kosten är en av världens bästa för huden." },
        { title: "Hydrering konstant", body: "Atens somrar kräver minst två och en halv liter vatten dagligen." },
        { title: "Rengör bort smogen", body: "Atens luftföroreningar sätter sig på huden. Dubbelrengöring varje kväll." }
      ],
      solutionTitle: "CBD-hudvård levererad till Aten",
      solutionBody: "<p>Vi skickar från Sverige – leverans till Aten inom 3–5 arbetsdagar. Fri frakt över €60.</p><p>DUO-kit ger antioxidantskydd. Au Naturel rengör bort föroreningar. TA-DA Serum ger intensiv fukt.</p>",
      faq: [
        { q: "Levererar ni till Grekland?", a: "Ja, 3–5 arbetsdagar. Fri frakt över €60." },
        { q: "Är CBD-hudvård lagligt i Grekland?", a: "Ja, CBD i hudvård är lagligt i Grekland sedan 2018." },
        { q: "Vilken produkt för Atens klimat?", a: "DUO-kit dagligen, Au Naturel för rengöring, TA-DA Serum för fukt." },
        { q: "Hur lång tid tar leveransen?", a: "3–5 arbetsdagar." }
      ],
      ctaTitle: "Ge din hud det Aten kräver",
      ctaSub: "Naturlig CBD-hudvård från Sverige till Aten. Fri frakt över €60."
    },
    en: {
      metaTitle: "Skincare Athens – CBD skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Athens. Order online with free shipping over €60. Protect your skin from Greek sun, heat, and urban smog.",
      kicker: "Skincare in Athens",
      h1: "Natural skincare for Athens",
      lead: "Athens – cradle of civilization with modern skin challenges. Intense sun, urban smog, and extreme summer heat. Free shipping over €60.",
      problemTitle: "What Athens does to your skin",
      problemBody: "<p>Athens has one of Europe's most intense combinations of sun and pollution. UV radiation is strong from March to October, and the city is surrounded by mountains that trap exhaust fumes and smog in a basin-like pattern – the famous 'nefos'. Summers regularly reach forty degrees.</p><p>Air conditioning is a necessity but brutally dries out the skin. Athens' water quality varies depending on the neighborhood.</p>",
      tipsTitle: "Skincare tips for Athens residents",
      tips: [
        { title: "UV protection year-round", body: "Athens' sun is brutal. Protect yourself daily – it's non-negotiable." },
        { title: "Walk early in the National Garden", body: "Avoid the heat. Morning walks offer fresh air and shade." },
        { title: "Greek Mediterranean diet", body: "Olive oil, feta, fish, vegetables – the Greek diet is one of the world's best for the skin." },
        { title: "Constant hydration", body: "Athens summers demand at least two and a half liters of water daily." },
        { title: "Cleanse away the smog", body: "Athens' air pollution settles on the skin. Double cleanse every evening." }
      ],
      solutionTitle: "CBD skincare delivered to Athens",
      solutionBody: "<p>We ship from Sweden – delivery to Athens within 3–5 business days. Free shipping on orders over €60.</p><p>The DUO-kit provides antioxidant protection. Au Naturel cleans away pollution. TA-DA Serum delivers intense moisture.</p>",
      faq: [
        { q: "Do you ship to Greece?", a: "Yes, 3–5 business days. Free shipping over €60." },
        { q: "Is CBD skincare legal in Greece?", a: "Yes, CBD in skincare has been legal in Greece since 2018." },
        { q: "Which product for Athens' climate?", a: "DUO-kit daily, Au Naturel for cleansing, TA-DA Serum for moisture." },
        { q: "How long does shipping take?", a: "3–5 business days." }
      ],
      ctaTitle: "Give your skin what Athens demands",
      ctaSub: "Natural CBD skincare from Sweden to Athens. Free shipping over €60."
    },
    es: {
      metaTitle: "Cuidado de la piel Atenas – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Atenas. Pide online, envío gratis desde 50 €. Protege tu piel del sol griego, el calor y el smog urbano.",
      kicker: "Cuidado de la piel en Atenas",
      h1: "Cosmética natural para Atenas",
      lead: "Atenas – cuna de la civilización con problemas muy actuales: sol brutal, smog y veranos extremos. Envío gratis desde 50 €.",
      problemTitle: "Lo que Atenas le hace a tu piel",
      problemBody: "<p>Una de las combinaciones más duras de Europa: sol fuerte y contaminación. El UV pega de marzo a octubre; las montañas atrapan gases y smog en cuenca – el famoso «nefos». Veranos que rozan los cuarenta.</p><p>El aire acondicionado salva pero seca la piel de golpe. La calidad del agua varía según el barrio.</p>",
      tipsTitle: "Consejos para quien vive en Atenas",
      tips: [
        { title: "Protección UV todo el año", body: "El sol ateniense no negocia. Protégete cada día." },
        { title: "Jardín Nacional al amanecer", body: "Evita el calor del mediodía. Mañana: aire y sombra." },
        { title: "Dieta mediterránea griega", body: "Aceite de oliva, feta, pescado, verduras – de lo mejor para la piel." },
        { title: "Hidratación constante", body: "En verano, mínimo dos litros y medio de agua al día." },
        { title: "Limpia el smog", body: "La contaminación se deposita en la piel. Doble limpieza cada noche." }
      ],
      solutionTitle: "Cosmética con CBD con entrega en Atenas",
      solutionBody: "<p>Enviamos desde Suecia; 3–5 días laborables hasta Atenas. Envío gratis desde 50 €.</p><p>El DUO-kit aporta antioxidantes. Au Naturel limpia la contaminación. TA-DA Serum hidrata en profundidad.</p>",
      faq: [
        { q: "¿Envían a Grecia?", a: "Sí, 3–5 días laborables. Envío gratis desde 50 €." },
        { q: "¿El CBD en cosmética es legal en Grecia?", a: "Sí, el CBD en cuidado de la piel es legal en Grecia desde 2018." },
        { q: "¿Qué producto para el clima de Atenas?", a: "DUO-kit a diario; Au Naturel para limpiar; TA-DA Serum para humedad." },
        { q: "¿Plazo de envío?", a: "3–5 días laborables." }
      ],
      ctaTitle: "Dale a tu piel lo que Atenas exige",
      ctaSub: "Cosmética natural con CBD de Suecia a Atenas. Envío gratis desde 50 €."
    },
    de: {
      metaTitle: "Hautpflege Athen – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für Athen. Online bestellen, ab 50 € versandkostenfrei. Schutz vor griechischer Sonne, Hitze und urbanem Smog.",
      kicker: "Hautpflege in Athen",
      h1: "Natürliche Hautpflege für Athen",
      lead: "Athen – Wiege der Zivilisation mit modernen Haut-Herausforderungen: intensive Sonne, Smog und extreme Sommerhitze. Ab 50 € versandkostenfrei.",
      problemTitle: "Was Athen mit deiner Haut macht",
      problemBody: "<p>Eine der intensivsten Kombinationen aus Sonne und Verschmutzung in Europa. Starke UV-Strahlung März–Oktober; Berge fangen Abgase im Becken – das berühmte nefos. Sommer regelmäßig bis vierzig Grad.</p><p>Klimaanlage ist Pflicht, trocknet die Haut aber brutal. Wasserqualität variiert je nach Viertel.</p>",
      tipsTitle: "Hautpflege-Tipps für Athen",
      tips: [
        { title: "Ganzjährig UV-Schutz", body: "Athens Sonne verhandelt nicht. Täglich schützen." },
        { title: "Früh im Nationalgarten", body: "Mittagshitze meiden. Morgens: Luft und Schatten." },
        { title: "Griechische Mittelmeerkost", body: "Olivenöl, Feta, Fisch, Gemüse – top für die Haut." },
        { title: "Ständig trinken", body: "Athener Sommer brauchen mindestens zweieinhalb Liter Wasser täglich." },
        { title: "Smog abwaschen", body: "Luftverschmutzung setzt sich ab. Abends doppelt reinigen." }
      ],
      solutionTitle: "CBD-Hautpflege nach Athen",
      solutionBody: "<p>Versand aus Schweden – 3–5 Werktage nach Athen. Ab 50 € versandkostenfrei.</p><p>Das DUO-kit liefert antioxidativen Schutz. Au Naturel entfernt Schmutz und Abgase. TA-DA Serum spendet intensive Feuchtigkeit.</p>",
      faq: [
        { q: "Liefert ihr nach Griechenland?", a: "Ja, 3–5 Werktage. Ab 50 € versandkostenfrei." },
        { q: "Ist CBD-Kosmetik in Griechenland legal?", a: "Ja, CBD in Hautpflege ist in Griechenland seit 2018 erlaubt." },
        { q: "Welches Produkt fürs Athen-Klima?", a: "DUO-kit täglich, Au Naturel zur Reinigung, TA-DA Serum für Feuchtigkeit." },
        { q: "Wie lange dauert der Versand?", a: "3–5 Werktage." }
      ],
      ctaTitle: "Gib deiner Haut, was Athen verlangt",
      ctaSub: "Natürliche CBD-Pflege von Schweden nach Athen. Ab 50 € versandkostenfrei."
    },
    fr: {
      metaTitle: "Soin du visage Athènes – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Athènes. Commande en ligne, livraison offerte dès 50 €. Protège ta peau du soleil grec, de la chaleur et du smog urbain.",
      kicker: "Soins à Athènes",
      h1: "Soins naturels pour Athènes",
      lead: "Athènes – berceau de la civilisation avec défis très actuels : soleil brutal, smog et étés extrêmes. Livraison offerte dès 50 €.",
      problemTitle: "Ce qu’Athènes fait à ta peau",
      problemBody: "<p>L’une des combinaisons les plus intenses d’Europe entre soleil et pollution. UV fort de mars à octobre ; les montagnes piègent les gaz dans un bassin – le célèbre nefos. Étés qui frôlent quarante degrés.</p><p>La clim est indispensable mais assèche la peau brutalement. La qualité de l’eau varie selon les quartiers.</p>",
      tipsTitle: "Conseils peau pour Athènes",
      tips: [
        { title: "UV toute l’année", body: "Le soleil athénien ne négocie pas. Protège-toi chaque jour." },
        { title: "Jardin national tôt", body: "Évite la chaleur de midi. Le matin : air et ombre." },
        { title: "Régime méditerranéen grec", body: "Huile d’olive, feta, poisson, légumes – parmi le mieux pour la peau." },
        { title: "Hydratation constante", body: "Les étés athéniens : au moins deux litres et demi d’eau par jour." },
        { title: "Enlever le smog", body: "La pollution se dépose sur la peau. Double nettoyage chaque soir." }
      ],
      solutionTitle: "Soins au CBD livrés à Athènes",
      solutionBody: "<p>Expédition depuis la Suède ; 3–5 jours ouvrés jusqu’à Athènes. Livraison offerte dès 50 €.</p><p>Le DUO-kit apporte des antioxydants. Au Naturel enlève la pollution. TA-DA Serum hydrate en profondeur.</p>",
      faq: [
        { q: "Livrez-vous en Grèce ?", a: "Oui, 3–5 jours ouvrés. Livraison offerte dès 50 €." },
        { q: "Le CBD en cosmétique est-il légal en Grèce ?", a: "Oui, le CBD dans les soins est légal en Grèce depuis 2018." },
        { q: "Quel produit pour le climat d’Athènes ?", a: "DUO-kit au quotidien ; Au Naturel pour nettoyer ; TA-DA Serum pour l’hydratation." },
        { q: "Délai de livraison ?", a: "3–5 jours ouvrés." }
      ],
      ctaTitle: "Offre à ta peau ce qu’Athènes exige",
      ctaSub: "Soins naturels au CBD de la Suède à Athènes. Livraison offerte dès 50 €."
    }
  },
  // ──────────────────────────────────────────────
  // EASTERN EUROPE & BALTIC
  // ──────────────────────────────────────────────
  {
    svSlug: "hudvard-prag",
    enSlug: "skincare-prague",
    esSlug: "cuidado-piel-cbd-prague",
    deSlug: "cbd-hautpflege-prague",
    frSlug: "soin-peau-cbd-prague",
    category: "stad",
    productIds: ["duo-kit", "ta-da-serum", "au-naturel-makeup-remover"],
    sv: {
      metaTitle: "Hudvård Prag – CBD-hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i Prag. Beställ online med fri frakt över €60. Skydda din hud mot Prags kontinentala klimat och vinterinversioner.",
      kicker: "Hudvård i Prag",
      h1: "Naturlig hudvård för dig i Prag",
      lead: "Prag – en av Europas vackraste städer med ett klimat som utmanar huden. Kalla vintrar med smog, heta somrar och hårt vatten. Fri frakt över €60.",
      problemTitle: "Praghudens utmaningar",
      problemBody: "<p>Prag har ett kontinentalt klimat med kalla, fuktiga vintrar och varma somrar. Vinterinversioner fångar föroreningar i Moldau-dalen och skapar perioder med dålig luftkvalitet. Temperaturer kan sjunka till minus femton på vintern och nå trettio på sommaren.</p><p>Prags kranvatten är medelhårt och den torra inomhusluften i äldre byggnader förvärrar hudtorrheten vintertid.</p>",
      tipsTitle: "Hudvårdstips för pragbor",
      tips: [
        { title: "Extra skydd under inversioner", body: "Vinterns smog kräver grundlig rengöring och antioxidantskydd." },
        { title: "Promenera i Petřín-parken", body: "Höjden ovanför smogen ger renare luft och fantastisk utsikt." },
        { title: "Tjeckisk ölkultur med måtta", body: "Öljäst ger B-vitaminer som gynnar huden – men alkohol dehydrerar. Balans." },
        { title: "Barriärolja innan kylan", body: "Under minus tio behöver huden en extra barriär innan du går ut." },
        { title: "Luftfuktare vintertid", body: "Prags äldre lägenheter med radiatorvärme blir extremt torra." }
      ],
      solutionTitle: "CBD-hudvård levererad till Prag",
      solutionBody: "<p>Vi skickar från Sverige – leverans till Prag inom 3–5 arbetsdagar. Fri frakt över €60.</p><p>DUO-kit balanserar huden. TA-DA Serum ger fukt under torra vintrar. Au Naturel rengör bort vintersmog.</p>",
      faq: [
        { q: "Levererar ni till Tjeckien?", a: "Ja, 3–5 arbetsdagar. Fri frakt över €60." },
        { q: "Är CBD-hudvård lagligt i Tjeckien?", a: "Ja, Tjeckien har progressiva lagar och CBD i hudvård är fullt lagligt." },
        { q: "Vilken produkt för Prags vintrar?", a: "TA-DA Serum för fukt, Au Naturel mot föroreningar." },
        { q: "Hur lång tid tar leveransen?", a: "3–5 arbetsdagar." }
      ],
      ctaTitle: "Ge din hud det Prag kräver",
      ctaSub: "Naturlig CBD-hudvård från Sverige till Prag. Fri frakt över €60."
    },
    en: {
      metaTitle: "Skincare Prague – CBD skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Prague. Order online with free shipping over €60. Protect your skin from Prague's continental climate and winter inversions.",
      kicker: "Skincare in Prague",
      h1: "Natural skincare for Prague",
      lead: "Prague – one of Europe's most beautiful cities with a climate that challenges the skin. Cold winters with smog, hot summers, and hard water. Free shipping over €60.",
      problemTitle: "What Prague does to your skin",
      problemBody: "<p>Prague has a continental climate with cold, damp winters and warm summers. Winter inversions trap pollution in the Vltava valley, creating periods of poor air quality. Temperatures can drop to minus fifteen in winter and reach thirty in summer.</p><p>Prague's tap water is moderately hard and the dry indoor air in older buildings worsens skin dehydration in winter.</p>",
      tipsTitle: "Skincare tips for Prague residents",
      tips: [
        { title: "Extra protection during inversions", body: "Winter smog demands thorough cleansing and antioxidant protection." },
        { title: "Walk in Petřín Park", body: "The elevation above the smog offers cleaner air and fantastic views." },
        { title: "Czech beer culture in moderation", body: "Beer yeast provides B-vitamins that benefit the skin – but alcohol dehydrates. Balance." },
        { title: "Barrier oil before the cold", body: "Below minus ten, your skin needs an extra barrier before going out." },
        { title: "Humidifier in winter", body: "Prague's older apartments with radiator heating become extremely dry." }
      ],
      solutionTitle: "CBD skincare delivered to Prague",
      solutionBody: "<p>We ship from Sweden – delivery to Prague within 3–5 business days. Free shipping on orders over €60.</p><p>The DUO-kit balances the skin. TA-DA Serum provides moisture during dry winters. Au Naturel cleans away winter smog.</p>",
      faq: [
        { q: "Do you ship to the Czech Republic?", a: "Yes, 3–5 business days. Free shipping over €60." },
        { q: "Is CBD skincare legal in the Czech Republic?", a: "Yes, the Czech Republic has progressive laws and CBD in skincare is fully legal." },
        { q: "Which product for Prague's winters?", a: "TA-DA Serum for moisture, Au Naturel against pollution." },
        { q: "How long does shipping take?", a: "3–5 business days." }
      ],
      ctaTitle: "Give your skin what Prague demands",
      ctaSub: "Natural CBD skincare from Sweden to Prague. Free shipping over €60."
    },
    es: {
      metaTitle: "Cuidado de la piel Praga – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Praga. Pide online, envío gratis desde 50 €. Protege tu piel del clima continental y las inversiones invernales.",
      kicker: "Cuidado de la piel en Praga",
      h1: "Cosmética natural para Praga",
      lead: "Praga – una de las ciudades más bellas de Europa, con inviernos de smog, veranos calurosos y agua dura. Envío gratis desde 50 €.",
      problemTitle: "Lo que Praga le hace a tu piel",
      problemBody: "<p>Clima continental: inviernos fríos y húmedos, veranos cálidos. Las inversiones invernales atrapan la contaminación en el valle del Moldava y la calidad del aire se hunde. De menos quince en invierno a unos treinta en verano.</p><p>El agua del grifo es moderadamente dura; el aire seco de los edificios antiguos empeora la deshidratación en invierno.</p>",
      tipsTitle: "Consejos para quien vive en Praga",
      tips: [
        { title: "Refuerzo en inversiones", body: "El smog invernal pide limpieza a fondo y antioxidantes." },
        { title: "Parque Petřín", body: "Más arriba del smog: aire más limpio y vistas." },
        { title: "Cerveza checa, con mesura", body: "La levadura aporta vitaminas B; el alcohol deshidrata. Equilibrio." },
        { title: "Aceite barrera antes del frío", body: "Bajo menos diez, la piel pide una capa extra antes de salir." },
        { title: "Humidificador en invierno", body: "Los pisos antiguos con radiador se quedan en desierto." }
      ],
      solutionTitle: "Cosmética con CBD con entrega en Praga",
      solutionBody: "<p>Enviamos desde Suecia; 3–5 días laborables hasta Praga. Envío gratis desde 50 €.</p><p>El DUO-kit equilibra la piel. TA-DA Serum hidrata en invierno seco. Au Naturel limpia el smog invernal.</p>",
      faq: [
        { q: "¿Envían a la República Checa?", a: "Sí, 3–5 días laborables. Envío gratis desde 50 €." },
        { q: "¿El CBD en cosmética es legal en la República Checa?", a: "Sí; leyes abiertas y CBD en cuidado de la piel totalmente legal." },
        { q: "¿Qué producto para los inviernos de Praga?", a: "TA-DA Serum para humedad; Au Naturel frente a la contaminación." },
        { q: "¿Plazo de envío?", a: "3–5 días laborables." }
      ],
      ctaTitle: "Dale a tu piel lo que Praga exige",
      ctaSub: "Cosmética natural con CBD de Suecia a Praga. Envío gratis desde 50 €."
    },
    de: {
      metaTitle: "Hautpflege Prag – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für Prag. Online bestellen, ab 50 € versandkostenfrei. Schutz vor Kontinentalklima und Winter-Inversionen.",
      kicker: "Hautpflege in Prag",
      h1: "Natürliche Hautpflege für Prag",
      lead: "Prag – eine der schönsten Städte Europas, mit Smog-Winter, heißen Sommern und hartem Wasser. Ab 50 € versandkostenfrei.",
      problemTitle: "Was Prag mit deiner Haut macht",
      problemBody: "<p>Kontinentalklima: kalte, feuchte Winter, warme Sommer. Winterinversionen halten Schmutz im Moldau-Tal – Luftqualität bricht ein. Bis minus fünfzehn im Winter, rund dreißig im Sommer.</p><p>Leitungswasser mittelhart; trockene Raumluft in Altbauten verschärft Winter-Austrocknung.</p>",
      tipsTitle: "Hautpflege-Tipps für Prag",
      tips: [
        { title: "Extra bei Inversion", body: "Winter-Smog braucht gründliche Reinigung und Antioxidantien." },
        { title: "Petřín", body: "Höher als der Smog – sauberere Luft, Aussicht." },
        { title: "Tschechisches Bier – maßvoll", body: "Hefe liefert B-Vitamine, Alkohol trocknet aus. Balance." },
        { title: "Barrier-Öl vor Kälte", body: "Unter minus zehn braucht die Haut Extra-Schutz vor dem Rausgehen." },
        { title: "Luftbefeuchter im Winter", body: "Alte Wohnungen mit Radiator werden zur Wüste." }
      ],
      solutionTitle: "CBD-Hautpflege nach Prag",
      solutionBody: "<p>Versand aus Schweden – 3–5 Werktage nach Prag. Ab 50 € versandkostenfrei.</p><p>Das DUO-kit balanciert. TA-DA Serum spendet in trockenen Wintern. Au Naturel entfernt Winter-Smog.</p>",
      faq: [
        { q: "Liefert ihr in die Tschechische Republik?", a: "Ja, 3–5 Werktage. Ab 50 € versandkostenfrei." },
        { q: "Ist CBD-Kosmetik in Tschechien legal?", a: "Ja, progressive Gesetze – CBD in Hautpflege vollständig legal." },
        { q: "Welches Produkt für Prager Winter?", a: "TA-DA Serum für Feuchtigkeit, Au Naturel gegen Verschmutzung." },
        { q: "Wie lange dauert der Versand?", a: "3–5 Werktage." }
      ],
      ctaTitle: "Gib deiner Haut, was Prag verlangt",
      ctaSub: "Natürliche CBD-Pflege von Schweden nach Prag. Ab 50 € versandkostenfrei."
    },
    fr: {
      metaTitle: "Soin du visage Prague – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Prague. Commande en ligne, livraison offerte dès 50 €. Protège ta peau du climat continental et des inversions hivernales.",
      kicker: "Soins à Prague",
      h1: "Soins naturels pour Prague",
      lead: "Prague – l’une des plus belles villes d’Europe, avec hivers à smog, étés chauds et eau dure. Livraison offerte dès 50 €.",
      problemTitle: "Ce que Prague fait à ta peau",
      problemBody: "<p>Climat continental : hivers froids et humides, étés chauds. Les inversions piègent la pollution dans la vallée de la Moldau – la qualité de l’air s’effondre. Jusqu’à moins quinze en hiver, environ trente en été.</p><p>Eau du robinet moyennement dure ; air sec des vieux immeubles aggrave la déshydratation hivernale.</p>",
      tipsTitle: "Conseils peau pour Prague",
      tips: [
        { title: "Renfort aux inversions", body: "Le smog d’hiver exige nettoyage sérieux et antioxydants." },
        { title: "Petřín", body: "Au-dessus du smog : air plus pur, vue." },
        { title: "Bière tchèque avec mesure", body: "Levure = vitamines B ; alcool déshydrate. Mesure." },
        { title: "Huile barrière avant le froid", body: "Sous moins dix, la peau veut une couche en plus avant de sortir." },
        { title: "Humidificateur l’hiver", body: "Vieux appartements chauffés au radiateur = désert." }
      ],
      solutionTitle: "Soins au CBD livrés à Prague",
      solutionBody: "<p>Expédition depuis la Suède ; 3–5 jours ouvrés jusqu’à Prague. Livraison offerte dès 50 €.</p><p>Le DUO-kit équilibre la peau. TA-DA Serum hydrate l’hiver sec. Au Naturel enlève le smog hivernal.</p>",
      faq: [
        { q: "Livrez-vous en République tchèque ?", a: "Oui, 3–5 jours ouvrés. Livraison offerte dès 50 €." },
        { q: "Le CBD en cosmétique est-il légal en République tchèque ?", a: "Oui, lois progressives – CBD dans les soins entièrement légal." },
        { q: "Quel produit pour les hivers de Prague ?", a: "TA-DA Serum pour l’humidité ; Au Naturel contre la pollution." },
        { q: "Délai de livraison ?", a: "3–5 jours ouvrés." }
      ],
      ctaTitle: "Offre à ta peau ce que Prague exige",
      ctaSub: "Soins naturels au CBD de la Suède à Prague. Livraison offerte dès 50 €."
    }
  },
  {
    svSlug: "hudvard-budapest",
    enSlug: "skincare-budapest",
    esSlug: "cuidado-piel-cbd-budapest",
    deSlug: "cbd-hautpflege-budapest",
    frSlug: "soin-peau-cbd-budapest",
    category: "stad",
    productIds: ["duo-kit", "ta-da-serum", "fungtastic-mushroom-extract"],
    sv: {
      metaTitle: "Hudvård Budapest – CBD-hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i Budapest. Beställ online med fri frakt över €60. Skydda din hud mot Budapests kontinentala extremer.",
      kicker: "Hudvård i Budapest",
      h1: "Naturlig hudvård för dig i Budapest",
      lead: "Budapest – termalbadens stad med ett av Centraleuropas tuffaste klimat för huden. Extrema temperaturer, föroreningar och hård Donau-fukt. Fri frakt över €60.",
      problemTitle: "Budapesthudens utmaningar",
      problemBody: "<p>Budapest har ett extremt kontinentalt klimat. Vintrarna är kalla med temperaturer som faller till minus femton, somrarna heta med regelbundna värmeböljor över trettiofem grader. Donau-fukten gör kylan bitande på vintern och sommarvärmen kvävande.</p><p>Luftkvaliteten i Budapest varierar – vinterinversioner fångar partiklar i Donau-dalen. Stadens vatten är hårt med hög kalkhalt. Termalbadskulturen är fantastisk men kräver eftervård.</p>",
      tipsTitle: "Hudvårdstips för budapestbor",
      tips: [
        { title: "Återfukta efter termalbad", body: "Budapests berömda termalbad ger mineraler men kan torka ut. Applicera olja direkt efter." },
        { title: "Promenera på Margitön", body: "Grön oas mitt i Donau. Frisk luft och lugn." },
        { title: "Barriärskydd i kylan", body: "Budapests vintrar kräver rik olja innan du går ut." },
        { title: "Ungersk paprika och grönsaker", body: "Ungersk matkultur ger C-vitamin och antioxidanter i överflöd." },
        { title: "Luftfuktare hemma", body: "Ungerska lägenheter med centralvärme blir extremt torra vintertid." }
      ],
      solutionTitle: "CBD-hudvård levererad till Budapest",
      solutionBody: "<p>Vi skickar från Sverige – leverans till Budapest inom 3–5 arbetsdagar. Fri frakt över €60.</p><p>DUO-kit balanserar huden. TA-DA Serum ger fukt under extrema vintrar. Fungtastic stödjer immunförsvaret.</p>",
      faq: [
        { q: "Levererar ni till Ungern?", a: "Ja, 3–5 arbetsdagar. Fri frakt över €60." },
        { q: "Är CBD-hudvård lagligt i Ungern?", a: "Ja, CBD i hudvård är lagligt i Ungern." },
        { q: "Vilken produkt för Budapests klimat?", a: "DUO-kit som bas, TA-DA Serum för vintern." },
        { q: "Hur lång tid tar leveransen?", a: "3–5 arbetsdagar." }
      ],
      ctaTitle: "Ge din hud det Budapest kräver",
      ctaSub: "Naturlig CBD-hudvård från Sverige till Budapest. Fri frakt över €60."
    },
    en: {
      metaTitle: "Skincare Budapest – CBD skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Budapest. Order online with free shipping over €60. Protect your skin from Budapest's continental extremes and thermal bath dehydration.",
      kicker: "Skincare in Budapest",
      h1: "Natural skincare for Budapest",
      lead: "Budapest – the city of thermal baths with one of Central Europe's toughest climates for the skin. Extreme temperatures, pollution, and Danube humidity. Free shipping over €60.",
      problemTitle: "What Budapest does to your skin",
      problemBody: "<p>Budapest has an extreme continental climate. Winters are cold with temperatures dropping to minus fifteen, summers hot with regular heat waves above thirty-five degrees. Danube humidity makes the cold biting in winter and the summer heat suffocating.</p><p>Air quality in Budapest varies – winter inversions trap particles in the Danube valley. The city's water is hard with high calcium content. The thermal bath culture is wonderful but requires aftercare.</p>",
      tipsTitle: "Skincare tips for Budapest residents",
      tips: [
        { title: "Moisturize after thermal baths", body: "Budapest's famous thermal baths provide minerals but can dehydrate. Apply oil immediately after." },
        { title: "Walk on Margaret Island", body: "A green oasis in the middle of the Danube. Fresh air and calm." },
        { title: "Barrier protection in the cold", body: "Budapest winters demand a rich oil before going outside." },
        { title: "Hungarian paprika and vegetables", body: "Hungarian food culture provides abundant vitamin C and antioxidants." },
        { title: "Humidifier at home", body: "Hungarian apartments with central heating become extremely dry in winter." }
      ],
      solutionTitle: "CBD skincare delivered to Budapest",
      solutionBody: "<p>We ship from Sweden – delivery to Budapest within 3–5 business days. Free shipping on orders over €60.</p><p>The DUO-kit balances the skin. TA-DA Serum provides moisture during extreme winters. Fungtastic supports immunity.</p>",
      faq: [
        { q: "Do you ship to Hungary?", a: "Yes, 3–5 business days. Free shipping over €60." },
        { q: "Is CBD skincare legal in Hungary?", a: "Yes, CBD in skincare is legal in Hungary." },
        { q: "Which product for Budapest's climate?", a: "DUO-kit as your base, TA-DA Serum for winter." },
        { q: "How long does shipping take?", a: "3–5 business days." }
      ],
      ctaTitle: "Give your skin what Budapest demands",
      ctaSub: "Natural CBD skincare from Sweden to Budapest. Free shipping over €60."
    },
    es: {
      metaTitle: "Cuidado de la piel Budapest – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Budapest. Pide online, envío gratis desde 50 €. Protege tu piel de los extremos continentales y la deshidratación tras los baños termales.",
      kicker: "Cuidado de la piel en Budapest",
      h1: "Cosmética natural para Budapest",
      lead: "Budapest – ciudad de baños termales y uno de los climas más duros de Europa central. Temperaturas extremas, contaminación y humedad del Danubio. Envío gratis desde 50 €.",
      problemTitle: "Lo que Budapest le hace a tu piel",
      problemBody: "<p>Clima continental extremo: inviernos que bajan a menos quince; veranos con olas de calor por encima de treinta y cinco. La humedad del Danubio hace morder el frío y sofocar el calor.</p><p>La calidad del aire varía; las inversiones invernales atrapan partículas en el valle. Agua dura, mucho calcio. Los baños termales son un lujo – si no hidratas después, la piel lo paga.</p>",
      tipsTitle: "Consejos para quien vive en Budapest",
      tips: [
        { title: "Hidrata tras los baños", body: "Los balnearios aportan minerales pero pueden secar. Aceite en cuanto salgas." },
        { title: "Isla Margarita", body: "Verde en medio del Danubio: aire y calma." },
        { title: "Barrera en el frío", body: "Inviernos que exigen aceite rico antes de la calle." },
        { title: "Pimentón y verduras", body: "La cocina húngara llena de vitamina C y antioxidantes." },
        { title: "Humidificador en casa", body: "La calefacción deja los pisos como el Sahara en invierno." }
      ],
      solutionTitle: "Cosmética con CBD con entrega en Budapest",
      solutionBody: "<p>Enviamos desde Suecia; 3–5 días laborables hasta Budapest. Envío gratis desde 50 €.</p><p>El DUO-kit equilibra la piel. TA-DA Serum hidrata en inviernos duros. Fungtastic Mushroom Extract apoya la inmunidad.</p>",
      faq: [
        { q: "¿Envían a Hungría?", a: "Sí, 3–5 días laborables. Envío gratis desde 50 €." },
        { q: "¿El CBD en cosmética es legal en Hungría?", a: "Sí, el CBD en cuidado de la piel es legal en Hungría." },
        { q: "¿Qué producto para el clima de Budapest?", a: "DUO-kit como base; TA-DA Serum para el invierno." },
        { q: "¿Plazo de envío?", a: "3–5 días laborables." }
      ],
      ctaTitle: "Dale a tu piel lo que Budapest exige",
      ctaSub: "Cosmética natural con CBD de Suecia a Budapest. Envío gratis desde 50 €."
    },
    de: {
      metaTitle: "Hautpflege Budapest – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für Budapest. Online bestellen, ab 50 € versandkostenfrei. Schutz vor Kontinental-Extremen und Thermalbad-Austrocknung.",
      kicker: "Hautpflege in Budapest",
      h1: "Natürliche Hautpflege für Budapest",
      lead: "Budapest – Stadt der Thermalbäder und eines der härtesten Klimas in Mitteleuropa. Extreme Temperaturen, Smog und Donau-Feuchte. Ab 50 € versandkostenfrei.",
      problemTitle: "Was Budapest mit deiner Haut macht",
      problemBody: "<p>Extrem kontinentales Klima: Winter bis minus fünfzehn, Sommer mit Hitzewellen über fünfunddreißig. Donau-Feuchte macht Kälte beißend und Hitze erstickend.</p><p>Luftqualität schwankt; Winterinversionen halten Partikel im Tal. Hartes Wasser, viel Kalk. Thermalbäder sind toll – ohne Nachpflege trocknet die Haut aus.</p>",
      tipsTitle: "Hautpflege-Tipps für Budapest",
      tips: [
        { title: "Nach dem Bad eincremen", body: "Thermalwasser spendet Mineralien, kann aber austrocknen. Öl direkt danach." },
        { title: "Margareteninsel", body: "Grün mitten in der Donau – Luft und Ruhe." },
        { title: "Barriere in der Kälte", body: "Winter verlangt reichhaltiges Öl vor dem Rausgehen." },
        { title: "Paprika und Gemüse", body: "Ungarische Küche liefert Vitamin C und Antioxidantien." },
        { title: "Luftbefeuchter zuhause", body: "Heizung macht Wohnungen im Winter zur Wüste." }
      ],
      solutionTitle: "CBD-Hautpflege nach Budapest",
      solutionBody: "<p>Versand aus Schweden – 3–5 Werktage nach Budapest. Ab 50 € versandkostenfrei.</p><p>Das DUO-kit balanciert. TA-DA Serum spendet in harten Wintern. Fungtastic Mushroom Extract unterstützt die Immunität.</p>",
      faq: [
        { q: "Liefert ihr nach Ungarn?", a: "Ja, 3–5 Werktage. Ab 50 € versandkostenfrei." },
        { q: "Ist CBD-Kosmetik in Ungarn legal?", a: "Ja, CBD in Hautpflege ist in Ungarn erlaubt." },
        { q: "Welches Produkt fürs Budapest-Klima?", a: "DUO-kit als Basis, TA-DA Serum für den Winter." },
        { q: "Wie lange dauert der Versand?", a: "3–5 Werktage." }
      ],
      ctaTitle: "Gib deiner Haut, was Budapest verlangt",
      ctaSub: "Natürliche CBD-Pflege von Schweden nach Budapest. Ab 50 € versandkostenfrei."
    },
    fr: {
      metaTitle: "Soin du visage Budapest – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Budapest. Commande en ligne, livraison offerte dès 50 €. Protège ta peau des extrêmes continentaux et de la déshydratation post-thermes.",
      kicker: "Soins à Budapest",
      h1: "Soins naturels pour Budapest",
      lead: "Budapest – ville des bains thermaux et climat parmi les plus rudes d’Europe centrale. Extrêmes de température, pollution, humidité du Danube. Livraison offerte dès 50 €.",
      problemTitle: "Ce que Budapest fait à ta peau",
      problemBody: "<p>Climat continental extrême : hivers vers moins quinze ; étés avec canicules au-dessus de trente-cinq. L’humidité du Danube rend le froid mordant et la chaleur étouffante.</p><p>Qualité de l’air variable ; inversions hivernales dans la vallée. Eau dure, calcaire. Les thermes sont un régal – sans soin après, la peau s’assèche.</p>",
      tipsTitle: "Conseils peau pour Budapest",
      tips: [
        { title: "Hydrate après les bains", body: "Les eaux thermales minéralisent mais peuvent assécher. Huile tout de suite après." },
        { title: "Île Marguerite", body: "Vert au milieu du Danube : air et calme." },
        { title: "Barrière au froid", body: "Hivers qui exigent une huile riche avant de sortir." },
        { title: "Paprika et légumes", body: "La cuisine hongroise regorge de vitamine C et d’antioxydants." },
        { title: "Humidificateur à la maison", body: "Le chauffage transforme les appartements en désert l’hiver." }
      ],
      solutionTitle: "Soins au CBD livrés à Budapest",
      solutionBody: "<p>Expédition depuis la Suède ; 3–5 jours ouvrés jusqu’à Budapest. Livraison offerte dès 50 €.</p><p>Le DUO-kit équilibre la peau. TA-DA Serum hydrate pendant les hivers rudes. Fungtastic Mushroom Extract soutient l’immunité.</p>",
      faq: [
        { q: "Livrez-vous en Hongrie ?", a: "Oui, 3–5 jours ouvrés. Livraison offerte dès 50 €." },
        { q: "Le CBD en cosmétique est-il légal en Hongrie ?", a: "Oui, le CBD dans les soins est légal en Hongrie." },
        { q: "Quel produit pour le climat de Budapest ?", a: "DUO-kit comme base ; TA-DA Serum pour l’hiver." },
        { q: "Délai de livraison ?", a: "3–5 jours ouvrés." }
      ],
      ctaTitle: "Offre à ta peau ce que Budapest exige",
      ctaSub: "Soins naturels au CBD de la Suède à Budapest. Livraison offerte dès 50 €."
    }
  },
  {
    svSlug: "hudvard-warszawa",
    enSlug: "skincare-warsaw",
    esSlug: "cuidado-piel-cbd-warsaw",
    deSlug: "cbd-hautpflege-warsaw",
    frSlug: "soin-peau-cbd-warsaw",
    category: "stad",
    productIds: ["duo-kit", "ta-da-serum", "au-naturel-makeup-remover"],
    sv: {
      metaTitle: "Hudvård Warszawa – CBD-hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i Warszawa. Beställ online med fri frakt över €60. Skydda din hud mot polska vintrar och stadsföroreningar.",
      kicker: "Hudvård i Warszawa",
      h1: "Naturlig hudvård för dig i Warszawa",
      lead: "Warszawa – Polens dynamiska huvudstad med extrema årstider och växande föroreningsproblem. Fri frakt över €60.",
      problemTitle: "Warszawahudens utmaningar",
      problemBody: "<p>Warszawa har ett kontinentalt klimat med kalla vintrar ned mot minus tjugo och varma somrar runt trettiofem grader. Polens kolberoende skapar luftföroreningar som under vintern kan nå alarmerande nivåer. Smog-varningar är vanliga i polska städer.</p><p>Det hårda vattnet och den torra inomhusluften förvärrar hudens torrhet vintertid.</p>",
      tipsTitle: "Hudvårdstips för warszawabor",
      tips: [
        { title: "Skydda mot vintersmogen", body: "Polsk vintersmog kräver grundlig rengöring varje kväll." },
        { title: "Promenera i Łazienki-parken", body: "Warszawas gröna juvel med frisk luft och klassisk skönhet." },
        { title: "Barriärolja i kylan", body: "Under minus tio behöver huden en rik olja som skydd." },
        { title: "Polsk superkost", body: "Syrad kål, rödbetor, ägg – polsk husmanskost ger probiotika och antioxidanter." },
        { title: "Luftfuktare", body: "Torra lägenheter vintertid. En luftfuktare gör enorm skillnad." }
      ],
      solutionTitle: "CBD-hudvård levererad till Warszawa",
      solutionBody: "<p>Vi skickar från Sverige – leverans till Warszawa inom 3–5 arbetsdagar. Fri frakt över €60.</p><p>DUO-kit stärker barriären. TA-DA Serum ger fukt i kylan. Au Naturel rengör bort smog.</p>",
      faq: [
        { q: "Levererar ni till Polen?", a: "Ja, 3–5 arbetsdagar. Fri frakt över €60." },
        { q: "Är CBD-hudvård lagligt i Polen?", a: "Ja, CBD i hudvård är lagligt i Polen." },
        { q: "Vilken produkt för polska vintrar?", a: "TA-DA Serum för fukt, Au Naturel mot smog." },
        { q: "Hur lång tid tar leveransen?", a: "3–5 arbetsdagar." }
      ],
      ctaTitle: "Ge din hud det Warszawa kräver",
      ctaSub: "Naturlig CBD-hudvård från Sverige till Warszawa. Fri frakt över €60."
    },
    en: {
      metaTitle: "Skincare Warsaw – CBD skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Warsaw. Order online with free shipping over €60. Protect your skin from harsh Polish winters and urban smog.",
      kicker: "Skincare in Warsaw",
      h1: "Natural skincare for Warsaw",
      lead: "Warsaw – Poland's dynamic capital with extreme seasons and growing pollution challenges. Free shipping over €60.",
      problemTitle: "What Warsaw does to your skin",
      problemBody: "<p>Warsaw has a continental climate with cold winters down to minus twenty and warm summers around thirty-five degrees. Poland's coal dependency creates air pollution that during winter can reach alarming levels. Smog warnings are common in Polish cities.</p><p>Hard water and dry indoor air worsen skin dehydration in winter.</p>",
      tipsTitle: "Skincare tips for Warsaw residents",
      tips: [
        { title: "Protect against winter smog", body: "Polish winter smog demands thorough cleansing every evening." },
        { title: "Walk in Łazienki Park", body: "Warsaw's green jewel with fresh air and classical beauty." },
        { title: "Barrier oil in the cold", body: "Below minus ten, your skin needs a rich oil as protection." },
        { title: "Polish superfoods", body: "Sauerkraut, beetroot, eggs – Polish home cooking provides probiotics and antioxidants." },
        { title: "Humidifier", body: "Dry apartments in winter. A humidifier makes an enormous difference." }
      ],
      solutionTitle: "CBD skincare delivered to Warsaw",
      solutionBody: "<p>We ship from Sweden – delivery to Warsaw within 3–5 business days. Free shipping on orders over €60.</p><p>The DUO-kit strengthens the barrier. TA-DA Serum provides moisture in the cold. Au Naturel cleans away smog.</p>",
      faq: [
        { q: "Do you ship to Poland?", a: "Yes, 3–5 business days. Free shipping over €60." },
        { q: "Is CBD skincare legal in Poland?", a: "Yes, CBD in skincare is legal in Poland." },
        { q: "Which product for Polish winters?", a: "TA-DA Serum for moisture, Au Naturel against smog." },
        { q: "How long does shipping take?", a: "3–5 business days." }
      ],
      ctaTitle: "Give your skin what Warsaw demands",
      ctaSub: "Natural CBD skincare from Sweden to Warsaw. Free shipping over €60."
    },
    es: {
      metaTitle: "Cuidado de la piel Varsovia – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Varsovia. Pide online, envío gratis desde 50 €. Protege tu piel de los inviernos polacos duros y el smog urbano.",
      kicker: "Cuidado de la piel en Varsovia",
      h1: "Cosmética natural para Varsovia",
      lead: "Varsovia – capital dinámica de Polonia, estaciones extremas y contaminación que crece. Envío gratis desde 50 €.",
      problemTitle: "Lo que Varsovia le hace a tu piel",
      problemBody: "<p>Clima continental: inviernos que rozan los menos veinte; veranos alrededor de treinta y cinco. La dependencia del carbón dispara la contaminación en invierno – alertas de smog frecuentes.</p><p>Agua dura y calefacción seca: combo clásico para piel reseca en invierno.</p>",
      tipsTitle: "Consejos para quien vive en Varsovia",
      tips: [
        { title: "Contra el smog invernal", body: "Limpieza profunda cada noche cuando el aire apesta a carbón." },
        { title: "Parque Łazienki", body: "El pulmón verde de la ciudad: aire más limpio." },
        { title: "Aceite barrera bajo cero", body: "Bajo menos diez, la piel pide aceite graso." },
        { title: "Chucrut y remolacha", body: "Cocina casera polaca: probióticos y antioxidantes." },
        { title: "Humidificador", body: "Pisos secos en invierno – un humidificador cambia el juego." }
      ],
      solutionTitle: "Cosmética con CBD con entrega en Varsovia",
      solutionBody: "<p>Enviamos desde Suecia; 3–5 días laborables hasta Varsovia. Envío gratis desde 50 €.</p><p>El DUO-kit refuerza la barrera. TA-DA Serum hidrata en el frío. Au Naturel limpia el smog.</p>",
      faq: [
        { q: "¿Envían a Polonia?", a: "Sí, 3–5 días laborables. Envío gratis desde 50 €." },
        { q: "¿El CBD en cosmética es legal en Polonia?", a: "Sí, el CBD en cuidado de la piel es legal en Polonia." },
        { q: "¿Qué producto para los inviernos polacos?", a: "TA-DA Serum para humedad; Au Naturel frente al smog." },
        { q: "¿Plazo de envío?", a: "3–5 días laborables." }
      ],
      ctaTitle: "Dale a tu piel lo que Varsovia exige",
      ctaSub: "Cosmética natural con CBD de Suecia a Varsovia. Envío gratis desde 50 €."
    },
    de: {
      metaTitle: "Hautpflege Warschau – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für Warschau. Online bestellen, ab 50 € versandkostenfrei. Schutz vor polnischen Wintern und urbanem Smog.",
      kicker: "Hautpflege in Warschau",
      h1: "Natürliche Hautpflege für Warschau",
      lead: "Warschau – Polens dynamische Hauptstadt mit extremen Jahreszeiten und wachsender Luftbelastung. Ab 50 € versandkostenfrei.",
      problemTitle: "Was Warschau mit deiner Haut macht",
      problemBody: "<p>Kontinentalklima: Winter bis minus zwanzig, Sommer um fünfunddreißig Grad. Kohleabhängigkeit treibt Winter-Smog – Warnungen sind Alltag.</p><p>Hartes Wasser und trockene Heizluft: klassische Winter-Austrocknung.</p>",
      tipsTitle: "Hautpflege-Tipps für Warschau",
      tips: [
        { title: "Gegen Winter-Smog", body: "Gründliche Reinigung jeden Abend, wenn die Luft nach Kohle riecht." },
        { title: "Łazienki-Park", body: "Grünes Juwel – etwas sauberere Luft." },
        { title: "Barrier-Öl unter null", body: "Unter minus zehn braucht die Haut reichhaltiges Öl." },
        { title: "Sauerkraut und Rote Bete", body: "Polnische Hausmannskost: Probiotika und Antioxidantien." },
        { title: "Luftbefeuchter", body: "Trockene Wohnungen im Winter – Befeuchter hilft massiv." }
      ],
      solutionTitle: "CBD-Hautpflege nach Warschau",
      solutionBody: "<p>Versand aus Schweden – 3–5 Werktage nach Warschau. Ab 50 € versandkostenfrei.</p><p>Das DUO-kit stärkt die Barriere. TA-DA Serum spendet in der Kälte. Au Naturel entfernt Smog.</p>",
      faq: [
        { q: "Liefert ihr nach Polen?", a: "Ja, 3–5 Werktage. Ab 50 € versandkostenfrei." },
        { q: "Ist CBD-Kosmetik in Polen legal?", a: "Ja, CBD in Hautpflege ist in Polen erlaubt." },
        { q: "Welches Produkt für polnische Winter?", a: "TA-DA Serum für Feuchtigkeit, Au Naturel gegen Smog." },
        { q: "Wie lange dauert der Versand?", a: "3–5 Werktage." }
      ],
      ctaTitle: "Gib deiner Haut, was Warschau verlangt",
      ctaSub: "Natürliche CBD-Pflege von Schweden nach Warschau. Ab 50 € versandkostenfrei."
    },
    fr: {
      metaTitle: "Soin du visage Varsovie – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Varsovie. Commande en ligne, livraison offerte dès 50 €. Protège ta peau des hivers polonais rudes et du smog urbain.",
      kicker: "Soins à Varsovie",
      h1: "Soins naturels pour Varsovie",
      lead: "Varsovie – capitale dynamique de la Pologne, saisons extrêmes et pollution qui grimpe. Livraison offerte dès 50 €.",
      problemTitle: "Ce que Varsovie fait à ta peau",
      problemBody: "<p>Climat continental : hivers vers moins vingt ; étés autour de trente-cinq. La dépendance au charbon fait exploser la pollution en hiver – alertes smog fréquentes.</p><p>Eau dure et air chauffé sec : combo classique pour une peau déshydratée l’hiver.</p>",
      tipsTitle: "Conseils peau pour Varsovie",
      tips: [
        { title: "Face au smog hivernal", body: "Nettoyage en profondeur chaque soir quand l’air sent le charbon." },
        { title: "Parc Łazienki", body: "Joyau vert – air un peu plus pur." },
        { title: "Huile barrière sous zéro", body: "Sous moins dix, la peau veut une huile riche." },
        { title: "Choucroute et betterave", body: "Cuisine polonaise maison : probiotiques et antioxydants." },
        { title: "Humidificateur", body: "Appartements secs l’hiver – un humidificateur change tout." }
      ],
      solutionTitle: "Soins au CBD livrés à Varsovie",
      solutionBody: "<p>Expédition depuis la Suède ; 3–5 jours ouvrés jusqu’à Varsovie. Livraison offerte dès 50 €.</p><p>Le DUO-kit renforce la barrière. TA-DA Serum hydrate dans le froid. Au Naturel enlève le smog.</p>",
      faq: [
        { q: "Livrez-vous en Pologne ?", a: "Oui, 3–5 jours ouvrés. Livraison offerte dès 50 €." },
        { q: "Le CBD en cosmétique est-il légal en Pologne ?", a: "Oui, le CBD dans les soins est légal en Pologne." },
        { q: "Quel produit pour les hivers polonais ?", a: "TA-DA Serum pour l’humidité ; Au Naturel contre le smog." },
        { q: "Délai de livraison ?", a: "3–5 jours ouvrés." }
      ],
      ctaTitle: "Offre à ta peau ce que Varsovie exige",
      ctaSub: "Soins naturels au CBD de la Suède à Varsovie. Livraison offerte dès 50 €."
    }
  },
  {
    svSlug: "hudvard-tallinn",
    enSlug: "skincare-tallinn",
    esSlug: "cuidado-piel-cbd-tallinn",
    deSlug: "cbd-hautpflege-tallinn",
    frSlug: "soin-peau-cbd-tallinn",
    category: "stad",
    productIds: ["duo-kit", "ta-da-serum", "fungtastic-mushroom-extract"],
    sv: {
      metaTitle: "Hudvård Tallinn – CBD-hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i Tallinn. Beställ online med fri frakt över €60. Skydda din hud mot baltisk kyla och mörka vintrar.",
      kicker: "Hudvård i Tallinn",
      h1: "Naturlig hudvård för dig i Tallinn",
      lead: "Tallinn – den digitala pionjären med ett baltiskt klimat som utmanar din hud. Kalla Östersjövintrar, mörker och vind. Fri frakt över €60.",
      problemTitle: "Tallinnhudens utmaningar",
      problemBody: "<p>Tallinn har ett baltiskt klimat med långa, kalla vintrar och korta somrar. Östersjövinden är konstant och bitande, särskilt i den gamla medeltidsstaden. Vintrarna är mörka med begränsat dagsljus från november till februari. Temperaturer sjunker regelbundet under minus femton.</p><p>D-vitaminbristen är utbredd och påverkar hudens hälsa direkt. Estniskt vatten är generellt mjukt och av god kvalitet.</p>",
      tipsTitle: "Hudvårdstips för tallinnbor",
      tips: [
        { title: "Vindskydd i gamla stan", body: "Tallinns medeltidsgator kanaliserar vinden. En barriärolja är nödvändig." },
        { title: "Estnisk bastukultur", body: "Bastu är tradition – återfukta alltid efteråt." },
        { title: "D-vitamin hela vintern", body: "Baltisk mörker kräver tillskott från oktober till mars." },
        { title: "Promenera i Kadriorg", body: "Kadriorg-parken ger grönska och frisk luft." },
        { title: "Estnisk svart bröd", body: "Rågbröd ger fiber och B-vitaminer som stödjer huden inifrån." }
      ],
      solutionTitle: "CBD-hudvård levererad till Tallinn",
      solutionBody: "<p>Vi skickar från Sverige – leverans till Tallinn inom 3–5 arbetsdagar. Fri frakt över €60.</p><p>DUO-kit stärker barriären mot baltisk vind. TA-DA Serum ger fukt under iskalla vintrar. Fungtastic stödjer immunförsvaret i mörkret.</p>",
      faq: [
        { q: "Levererar ni till Estland?", a: "Ja, 3–5 arbetsdagar. Fri frakt över €60." },
        { q: "Är CBD-hudvård lagligt i Estland?", a: "Ja, CBD i hudvård är lagligt i Estland." },
        { q: "Vilken produkt för baltiska vintrar?", a: "TA-DA Serum för fukt, Fungtastic för immunförsvaret." },
        { q: "Hur lång tid tar leveransen?", a: "3–5 arbetsdagar." }
      ],
      ctaTitle: "Ge din hud det baltiska klimatet kräver",
      ctaSub: "Naturlig CBD-hudvård från Sverige till Tallinn. Fri frakt över €60."
    },
    en: {
      metaTitle: "Skincare Tallinn – CBD skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Tallinn. Order online with free shipping over €60. Protect your skin from Baltic cold and dark Estonian winters.",
      kicker: "Skincare in Tallinn",
      h1: "Natural skincare for Tallinn",
      lead: "Tallinn – the digital pioneer with a Baltic climate that challenges your skin. Cold Baltic Sea winters, darkness, and wind. Free shipping over €60.",
      problemTitle: "What Tallinn does to your skin",
      problemBody: "<p>Tallinn has a Baltic climate with long, cold winters and short summers. The Baltic Sea wind is constant and biting, especially in the medieval Old Town. Winters are dark with limited daylight from November to February. Temperatures regularly drop below minus fifteen.</p><p>Vitamin D deficiency is widespread and directly affects skin health. Estonian water is generally soft and good quality.</p>",
      tipsTitle: "Skincare tips for Tallinn residents",
      tips: [
        { title: "Wind protection in Old Town", body: "Tallinn's medieval streets channel the wind. A barrier oil is essential." },
        { title: "Estonian sauna culture", body: "Sauna is tradition – always moisturize afterward." },
        { title: "Vitamin D all winter", body: "Baltic darkness demands supplements from October to March." },
        { title: "Walk in Kadriorg", body: "Kadriorg Park offers greenery and fresh air." },
        { title: "Estonian black bread", body: "Rye bread provides fiber and B-vitamins that support the skin from within." }
      ],
      solutionTitle: "CBD skincare delivered to Tallinn",
      solutionBody: "<p>We ship from Sweden – delivery to Tallinn within 3–5 business days. Free shipping on orders over €60.</p><p>The DUO-kit strengthens the barrier against Baltic wind. TA-DA Serum provides moisture during freezing winters. Fungtastic supports immunity in the darkness.</p>",
      faq: [
        { q: "Do you ship to Estonia?", a: "Yes, 3–5 business days. Free shipping over €60." },
        { q: "Is CBD skincare legal in Estonia?", a: "Yes, CBD in skincare is legal in Estonia." },
        { q: "Which product for Baltic winters?", a: "TA-DA Serum for moisture, Fungtastic for immunity." },
        { q: "How long does shipping take?", a: "3–5 business days." }
      ],
      ctaTitle: "Give your skin what the Baltic climate demands",
      ctaSub: "Natural CBD skincare from Sweden to Tallinn. Free shipping over €60."
    },
    es: {
      metaTitle: "Cuidado de la piel Tallin – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Tallin. Pide online, envío gratis desde 50 €. Protege tu piel del frío báltico y los inviernos oscuros de Estonia.",
      kicker: "Cuidado de la piel en Tallin",
      h1: "Cosmética natural para Tallin",
      lead: "Tallin – pionera digital con clima báltico implacable: viento del Báltico, oscuridad y frío. Envío gratis desde 50 €.",
      problemTitle: "Lo que Tallin le hace a tu piel",
      problemBody: "<p>Clima báltico: inviernos largos y fríos, veranos cortos. El viento del mar muerde, sobre todo en la ciudad vieja medieval. De noviembre a febrero, poca luz; a menudo bajo menos quince.</p><p>El déficit de vitamina D es habitual y afecta a la piel. El agua suele ser blanda y de buena calidad.</p>",
      tipsTitle: "Consejos para quien vive en Tallin",
      tips: [
        { title: "Protección en el casco antiguo", body: "Las calles medievales canalizan el viento. Aceite barrera imprescindible." },
        { title: "Cultura sauna estonia", body: "Sauna sí – hidrata después siempre." },
        { title: "Vitamina D todo el invierno", body: "La oscuridad báltica pide suplementos de octubre a marzo." },
        { title: "Parque Kadriorg", body: "Verde y aire más fresco." },
        { title: "Pan de centeno negro", body: "Fibra y vitaminas B para la piel por dentro." }
      ],
      solutionTitle: "Cosmética con CBD con entrega en Tallin",
      solutionBody: "<p>Enviamos desde Suecia; 3–5 días laborables hasta Tallin. Envío gratis desde 50 €.</p><p>El DUO-kit refuerza la barrera frente al viento báltico. TA-DA Serum hidrata en inviernos gélidos. Fungtastic Mushroom Extract apoya la inmunidad en la penumbra.</p>",
      faq: [
        { q: "¿Envían a Estonia?", a: "Sí, 3–5 días laborables. Envío gratis desde 50 €." },
        { q: "¿El CBD en cosmética es legal en Estonia?", a: "Sí, el CBD en cuidado de la piel es legal en Estonia." },
        { q: "¿Qué producto para los inviernos bálticos?", a: "TA-DA Serum para humedad; Fungtastic Mushroom Extract para la inmunidad." },
        { q: "¿Plazo de envío?", a: "3–5 días laborables." }
      ],
      ctaTitle: "Dale a tu piel lo que el clima báltico exige",
      ctaSub: "Cosmética natural con CBD de Suecia a Tallin. Envío gratis desde 50 €."
    },
    de: {
      metaTitle: "Hautpflege Tallinn – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für Tallinn. Online bestellen, ab 50 € versandkostenfrei. Schutz vor baltischer Kälte und dunklen estnischen Wintern.",
      kicker: "Hautpflege in Tallinn",
      h1: "Natürliche Hautpflege für Tallinn",
      lead: "Tallinn – digitale Pionierstadt mit baltischem Klima: Ostseewind, Dunkelheit, Kälte. Ab 50 € versandkostenfrei.",
      problemTitle: "Was Tallinn mit deiner Haut macht",
      problemBody: "<p>Baltisches Klima: lange, kalte Winter, kurze Sommer. Ostseewind beißt, besonders in der Altstadt. November–Februar wenig Licht; regelmäßig unter minus fünfzehn.</p><p>Vitamin-D-Mangel ist verbreitet und wirkt auf die Haut. Wasser meist weich und gut.</p>",
      tipsTitle: "Hautpflege-Tipps für Tallinn",
      tips: [
        { title: "Schutz in der Altstadt", body: "Mittelalterliche Gassen kanalisieren Wind. Barrier-Öl ist Pflicht." },
        { title: "Estnische Sauna-Kultur", body: "Sauna ja – danach immer eincremen." },
        { title: "Vitamin D den ganzen Winter", body: "Baltische Dunkelheit braucht Supplemente Oktober–März." },
        { title: "Kadriorg-Park", body: "Grün und frischere Luft." },
        { title: "Estnisches Schwarzbrot", body: "Roggen liefert Ballaststoffe und B-Vitamine für die Haut." }
      ],
      solutionTitle: "CBD-Hautpflege nach Tallinn",
      solutionBody: "<p>Versand aus Schweden – 3–5 Werktage nach Tallinn. Ab 50 € versandkostenfrei.</p><p>Das DUO-kit stärkt die Barriere gegen Ostseewind. TA-DA Serum spendet in eisigen Wintern. Fungtastic Mushroom Extract unterstützt die Immunität in der Dunkelheit.</p>",
      faq: [
        { q: "Liefert ihr nach Estland?", a: "Ja, 3–5 Werktage. Ab 50 € versandkostenfrei." },
        { q: "Ist CBD-Kosmetik in Estland legal?", a: "Ja, CBD in Hautpflege ist in Estland erlaubt." },
        { q: "Welches Produkt für baltische Winter?", a: "TA-DA Serum für Feuchtigkeit, Fungtastic Mushroom Extract für Immunität." },
        { q: "Wie lange dauert der Versand?", a: "3–5 Werktage." }
      ],
      ctaTitle: "Gib deiner Haut, was das Baltikum verlangt",
      ctaSub: "Natürliche CBD-Pflege von Schweden nach Tallinn. Ab 50 € versandkostenfrei."
    },
    fr: {
      metaTitle: "Soin du visage Tallinn – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Tallinn. Commande en ligne, livraison offerte dès 50 €. Protège ta peau du froid balte et des hivers sombres estoniens.",
      kicker: "Soins à Tallinn",
      h1: "Soins naturels pour Tallinn",
      lead: "Tallinn – pionnière du numérique avec un climat balte sans pitié : vent de la Baltique, noirceur et froid. Livraison offerte dès 50 €.",
      problemTitle: "Ce que Tallinn fait à ta peau",
      problemBody: "<p>Climat balte : hivers longs et froids, étés courts. Le vent de mer mord, surtout dans la vieille ville médiévale. De novembre à février, peu de lumière ; souvent sous moins quinze.</p><p>Carence en vitamine D répandue, impact sur la peau. L’eau est en général douce et de bonne qualité.</p>",
      tipsTitle: "Conseils peau pour Tallinn",
      tips: [
        { title: "Protection dans la vieille ville", body: "Les ruelles médiévales canalisent le vent. Huile barrière indispensable." },
        { title: "Culture sauna estonienne", body: "Sauna oui – hydrate toujours après." },
        { title: "Vitamine D tout l’hiver", body: "Obscurité balte = compléments d’octobre à mars." },
        { title: "Parc Kadriorg", body: "Vert et air un peu plus pur." },
        { title: "Pain noir estonien", body: "Seigle : fibres et vitamines B pour la peau de l’intérieur." }
      ],
      solutionTitle: "Soins au CBD livrés à Tallinn",
      solutionBody: "<p>Expédition depuis la Suède ; 3–5 jours ouvrés jusqu’à Tallinn. Livraison offerte dès 50 €.</p><p>Le DUO-kit renforce la barrière face au vent balte. TA-DA Serum hydrate pendant les hivers glacés. Fungtastic Mushroom Extract soutient l’immunité dans la pénombre.</p>",
      faq: [
        { q: "Livrez-vous en Estonie ?", a: "Oui, 3–5 jours ouvrés. Livraison offerte dès 50 €." },
        { q: "Le CBD en cosmétique est-il légal en Estonie ?", a: "Oui, le CBD dans les soins est légal en Estonie." },
        { q: "Quel produit pour les hivers baltes ?", a: "TA-DA Serum pour l’humidité ; Fungtastic Mushroom Extract pour l’immunité." },
        { q: "Délai de livraison ?", a: "3–5 jours ouvrés." }
      ],
      ctaTitle: "Offre à ta peau ce que le climat balte exige",
      ctaSub: "Soins naturels au CBD de la Suède à Tallinn. Livraison offerte dès 50 €."
    }
  },
  {
    svSlug: "hudvard-riga",
    enSlug: "skincare-riga",
    esSlug: "cuidado-piel-cbd-riga",
    deSlug: "cbd-hautpflege-riga",
    frSlug: "soin-peau-cbd-riga",
    category: "stad",
    productIds: ["duo-kit", "ta-da-serum", "fungtastic-mushroom-extract"],
    sv: {
      metaTitle: "Hudvård Riga – CBD-hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i Riga. Beställ online med fri frakt över €60. Skydda din hud mot lettiska vintrar och Daugavas fukt.",
      kicker: "Hudvård i Riga",
      h1: "Naturlig hudvård för dig i Riga",
      lead: "Riga – Art Nouveau-metropolen vid Daugava med kalla baltiska vintrar och fuktigt klimat. Fri frakt över €60.",
      problemTitle: "Rigahudens utmaningar",
      problemBody: "<p>Riga har ett fuktigt kontinentalt klimat med långa, kalla vintrar och korta somrar. Daugava-älven bidrar till hög luftfuktighet, men inomhus är luften torr från uppvärmning. Vintrarna når regelbundet minus femton till minus tjugo, och mörkerperioden är lång.</p><p>Vinden från Rigabukten är bitande och torkar ut huden effektivt. D-vitaminbrist är utbredd.</p>",
      tipsTitle: "Hudvårdstips för rigabor",
      tips: [
        { title: "Vindskydd vid floden", body: "Daugava-vinden är hård. Skydda ansiktet med en barriärolja." },
        { title: "Lettisk bastukultur", body: "Pirts (lettisk bastu) är tradition – fantastiskt för huden med rätt eftervård." },
        { title: "D-vitamin", body: "Lettiska vintrar kräver tillskott." },
        { title: "Promenera i Mežaparks", body: "Rigas gröna förort med skog och frisk luft." },
        { title: "Lettisk råg och fisk", body: "Rågbröd, strömming och fermenterade grönsaker – bra hudmat." }
      ],
      solutionTitle: "CBD-hudvård levererad till Riga",
      solutionBody: "<p>Vi skickar från Sverige – leverans till Riga inom 3–5 arbetsdagar. Fri frakt över €60.</p><p>DUO-kit stärker barriären. TA-DA Serum ger fukt i kylan. Fungtastic stödjer immunförsvaret.</p>",
      faq: [
        { q: "Levererar ni till Lettland?", a: "Ja, 3–5 arbetsdagar. Fri frakt över €60." },
        { q: "Är CBD lagligt i Lettland?", a: "Ja, CBD i hudvård är lagligt i Lettland." },
        { q: "Vilken produkt för Rigas klimat?", a: "DUO-kit som bas, TA-DA Serum för vintern." },
        { q: "Hur lång tid tar leveransen?", a: "3–5 arbetsdagar." }
      ],
      ctaTitle: "Ge din hud det Riga kräver",
      ctaSub: "Naturlig CBD-hudvård från Sverige till Riga. Fri frakt över €60."
    },
    en: {
      metaTitle: "Skincare Riga – CBD skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Riga. Order online with free shipping over €60. Protect your skin from Latvian winters and Daugava River humidity.",
      kicker: "Skincare in Riga",
      h1: "Natural skincare for Riga",
      lead: "Riga – the Art Nouveau metropolis on the Daugava with cold Baltic winters and a damp climate. Free shipping over €60.",
      problemTitle: "What Riga does to your skin",
      problemBody: "<p>Riga has a humid continental climate with long, cold winters and short summers. The Daugava River contributes to high humidity, but indoors the air is dry from heating. Winters regularly reach minus fifteen to minus twenty, and the dark period is long.</p><p>Wind from the Gulf of Riga is biting and effectively dehydrates the skin. Vitamin D deficiency is widespread.</p>",
      tipsTitle: "Skincare tips for Riga residents",
      tips: [
        { title: "Wind protection by the river", body: "The Daugava wind is harsh. Protect your face with a barrier oil." },
        { title: "Latvian sauna culture", body: "Pirts (Latvian sauna) is tradition – wonderful for the skin with proper aftercare." },
        { title: "Vitamin D", body: "Latvian winters demand supplements." },
        { title: "Walk in Mežaparks", body: "Riga's green suburb with forest and fresh air." },
        { title: "Latvian rye and fish", body: "Rye bread, Baltic herring, and fermented vegetables – great skin food." }
      ],
      solutionTitle: "CBD skincare delivered to Riga",
      solutionBody: "<p>We ship from Sweden – delivery to Riga within 3–5 business days. Free shipping on orders over €60.</p><p>The DUO-kit strengthens the barrier. TA-DA Serum provides moisture in the cold. Fungtastic supports immunity.</p>",
      faq: [
        { q: "Do you ship to Latvia?", a: "Yes, 3–5 business days. Free shipping over €60." },
        { q: "Is CBD legal in Latvia?", a: "Yes, CBD in skincare is legal in Latvia." },
        { q: "Which product for Riga's climate?", a: "DUO-kit as your base, TA-DA Serum for winter." },
        { q: "How long does shipping take?", a: "3–5 business days." }
      ],
      ctaTitle: "Give your skin what Riga demands",
      ctaSub: "Natural CBD skincare from Sweden to Riga. Free shipping over €60."
    },
    es: {
      metaTitle: "Cuidado de la piel Riga – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Riga. Pide online, envío gratis desde 50 €. Protege tu piel de los inviernos letones y la humedad del Daugava.",
      kicker: "Cuidado de la piel en Riga",
      h1: "Cosmética natural para Riga",
      lead: "Riga – metrópolis Art Nouveau junto al Daugava: inviernos bálticos fríos y clima húmedo. Envío gratis desde 50 €.",
      problemTitle: "Lo que Riga le hace a tu piel",
      problemBody: "<p>Clima continental húmedo: inviernos largos y fríos, veranos cortos. El río sube la humedad ambiental, pero en casa la calefacción seca. Inviernos entre menos quince y menos veinte; mucha oscuridad.</p><p>El viento del golfo de Riga seca la piel al vuelo. Déficit de vitamina D extendido.</p>",
      tipsTitle: "Consejos para quien vive en Riga",
      tips: [
        { title: "Protección junto al río", body: "El viento del Daugava pega fuerte. Aceite barrera en la cara." },
        { title: "Cultura pirts letona", body: "Sauna letona con buen cuidado después = piel feliz." },
        { title: "Vitamina D", body: "Inviernos letones = suplementos." },
        { title: "Mežaparks", body: "Bosque y aire más limpio en las afueras." },
        { title: "Centeno y pescado", body: "Pan de centeno, arenque del Báltico, fermentados – piel contenta." }
      ],
      solutionTitle: "Cosmética con CBD con entrega en Riga",
      solutionBody: "<p>Enviamos desde Suecia; 3–5 días laborables hasta Riga. Envío gratis desde 50 €.</p><p>El DUO-kit refuerza la barrera. TA-DA Serum hidrata en el frío. Fungtastic Mushroom Extract apoya la inmunidad.</p>",
      faq: [
        { q: "¿Envían a Letonia?", a: "Sí, 3–5 días laborables. Envío gratis desde 50 €." },
        { q: "¿El CBD es legal en Letonia?", a: "Sí, el CBD en cuidado de la piel es legal en Letonia." },
        { q: "¿Qué producto para el clima de Riga?", a: "DUO-kit como base; TA-DA Serum para el invierno." },
        { q: "¿Plazo de envío?", a: "3–5 días laborables." }
      ],
      ctaTitle: "Dale a tu piel lo que Riga exige",
      ctaSub: "Cosmética natural con CBD de Suecia a Riga. Envío gratis desde 50 €."
    },
    de: {
      metaTitle: "Hautpflege Riga – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für Riga. Online bestellen, ab 50 € versandkostenfrei. Schutz vor lettischen Wintern und Daugava-Feuchte.",
      kicker: "Hautpflege in Riga",
      h1: "Natürliche Hautpflege für Riga",
      lead: "Riga – Art-Nouveau-Metropole an der Daugava: kalte baltische Winter und feuchtes Klima. Ab 50 € versandkostenfrei.",
      problemTitle: "Was Riga mit deiner Haut macht",
      problemBody: "<p>Feuchtes Kontinentalklima: lange, kalte Winter, kurze Sommer. Der Fluss erhöht die Außenfeuchte, drinnen trocknet die Heizung. Winter oft minus fünfzehn bis zwanzig; lange Dunkelheit.</p><p>Wind aus der Rigaer Bucht entwässert die Haut rasant. Vitamin-D-Mangel weit verbreitet.</p>",
      tipsTitle: "Hautpflege-Tipps für Riga",
      tips: [
        { title: "Schutz am Fluss", body: "Daugava-Wind ist hart. Barrier-Öl fürs Gesicht." },
        { title: "Lettische Pirts-Kultur", body: "Pirts mit guter Nachpflege – top für die Haut." },
        { title: "Vitamin D", body: "Lettische Winter brauchen Supplemente." },
        { title: "Mežaparks", body: "Wald und frischere Luft am Stadtrand." },
        { title: "Roggen und Fisch", body: "Roggenbrot, Ostseehering, Fermentiertes – Skin Food." }
      ],
      solutionTitle: "CBD-Hautpflege nach Riga",
      solutionBody: "<p>Versand aus Schweden – 3–5 Werktage nach Riga. Ab 50 € versandkostenfrei.</p><p>Das DUO-kit stärkt die Barriere. TA-DA Serum spendet in der Kälte. Fungtastic Mushroom Extract unterstützt die Immunität.</p>",
      faq: [
        { q: "Liefert ihr nach Lettland?", a: "Ja, 3–5 Werktage. Ab 50 € versandkostenfrei." },
        { q: "Ist CBD in Lettland legal?", a: "Ja, CBD in Hautpflege ist in Lettland erlaubt." },
        { q: "Welches Produkt fürs Riga-Klima?", a: "DUO-kit als Basis, TA-DA Serum für den Winter." },
        { q: "Wie lange dauert der Versand?", a: "3–5 Werktage." }
      ],
      ctaTitle: "Gib deiner Haut, was Riga verlangt",
      ctaSub: "Natürliche CBD-Pflege von Schweden nach Riga. Ab 50 € versandkostenfrei."
    },
    fr: {
      metaTitle: "Soin du visage Riga – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Riga. Commande en ligne, livraison offerte dès 50 €. Protège ta peau des hivers lettons et de l’humidité du Daugava.",
      kicker: "Soins à Riga",
      h1: "Soins naturels pour Riga",
      lead: "Riga – métropole Art nouveau au bord du Daugava : hivers baltes froids et climat humide. Livraison offerte dès 50 €.",
      problemTitle: "Ce que Riga fait à ta peau",
      problemBody: "<p>Climat continental humide : hivers longs et froids, étés courts. La rivière augmente l’humidité dehors ; dedans le chauffage assèche. Hivers souvent entre moins quinze et moins vingt ; longue période sombre.</p><p>Le vent du golfe de Riga déshydrate la peau vite. Carence en vitamine D très répandue.</p>",
      tipsTitle: "Conseils peau pour Riga",
      tips: [
        { title: "Protection au bord de l’eau", body: "Le vent du Daugava est violent. Huile barrière sur le visage." },
        { title: "Culture pirts lettone", body: "Pirts avec bons soins après – la peau adore." },
        { title: "Vitamine D", body: "Hivers lettons = compléments." },
        { title: "Mežaparks", body: "Forêt et air plus pur en périphérie." },
        { title: "Seigle et poisson", body: "Pain de seigle, hareng de la Baltique, fermentés – nourriture peau." }
      ],
      solutionTitle: "Soins au CBD livrés à Riga",
      solutionBody: "<p>Expédition depuis la Suède ; 3–5 jours ouvrés jusqu’à Riga. Livraison offerte dès 50 €.</p><p>Le DUO-kit renforce la barrière. TA-DA Serum hydrate dans le froid. Fungtastic Mushroom Extract soutient l’immunité.</p>",
      faq: [
        { q: "Livrez-vous en Lettonie ?", a: "Oui, 3–5 jours ouvrés. Livraison offerte dès 50 €." },
        { q: "Le CBD est-il légal en Lettonie ?", a: "Oui, le CBD dans les soins est légal en Lettonie." },
        { q: "Quel produit pour le climat de Riga ?", a: "DUO-kit comme base ; TA-DA Serum pour l’hiver." },
        { q: "Délai de livraison ?", a: "3–5 jours ouvrés." }
      ],
      ctaTitle: "Offre à ta peau ce que Riga exige",
      ctaSub: "Soins naturels au CBD de la Suède à Riga. Livraison offerte dès 50 €."
    }
  },
  // ──────────────────────────────────────────────
  // ADDITIONAL CENTRAL EUROPE
  // ──────────────────────────────────────────────
  {
    svSlug: "hudvard-hamburg",
    enSlug: "skincare-hamburg",
    esSlug: "cuidado-piel-cbd-hamburg",
    deSlug: "cbd-hautpflege-hamburg",
    frSlug: "soin-peau-cbd-hamburg",
    category: "stad",
    productIds: ["duo-kit", "au-naturel-makeup-remover", "ta-da-serum"],
    sv: {
      metaTitle: "Hudvård Hamburg – CBD-hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i Hamburg. Beställ online med fri frakt över €60. Skydda din hud mot Nordsjöns fukt och hamnstadens föroreningar.",
      kicker: "Hudvård i Hamburg",
      h1: "Naturlig hudvård för dig i Hamburg",
      lead: "Hamburg – hamnstad, Elbphilharmonie och Nordsjövind. Fukt, salt och stadsluft utmanar din hud. Fri frakt över €60.",
      problemTitle: "Hamburghudens utmaningar",
      problemBody: "<p>Hamburg är Tysklands port till världen – och till Nordsjöns fuktiga, salta luft. Elbefloden och hamnen bidrar till konstant hög luftfuktighet, men inomhus är luften torr. Vinden från Nordsjön bär salt som torkar ut huden. Hamburgs klimat är maritimt med milda men gråa vintrar och svalare somrar.</p><p>Hamnens industriella verksamhet och stadens trafik bidrar med partiklar som belastar huden. Hamburgs vatten är medelhårt.</p>",
      tipsTitle: "Hudvårdstips för hamburgare",
      tips: [
        { title: "Skydda mot Nordsjövinden", body: "Hamburgs vind bär salt och fukt. En barriärolja skyddar ansiktet." },
        { title: "Promenera runt Alster", body: "Hamburgs inre sjö ger ro och frisk luft mitt i staden." },
        { title: "Fiskmarknad-frukost", body: "Hamburgs Fischmarkt erbjuder färsk fisk – omega-3 direkt från hamnen." },
        { title: "Rengör efter stadspromenader", body: "Hamnluft och trafikpartiklar sätter sig på huden. Mild rengöring på kvällen." },
        { title: "Luftfuktare vintertid", body: "Trots utomhusfukt blir tyska hem torra inomhus. En fuktare hjälper." }
      ],
      solutionTitle: "CBD-hudvård levererad till Hamburg",
      solutionBody: "<p>Vi skickar från Sverige – leverans till Hamburg inom 3–5 arbetsdagar. Fri frakt över €60.</p><p>DUO-kit stärker barriären mot vind och salt. Au Naturel rengör bort hamnpartiklar. TA-DA Serum ger extra fukt.</p>",
      faq: [
        { q: "Levererar ni till Hamburg?", a: "Ja, 3–5 arbetsdagar. Fri frakt över €60." },
        { q: "Är CBD lagligt i Tyskland?", a: "Ja, CBD i hudvård är fullt lagligt i Tyskland." },
        { q: "Vilken produkt för Hamburgs klimat?", a: "DUO-kit som bas, Au Naturel för daglig rengöring." },
        { q: "Hur lång tid tar leveransen?", a: "3–5 arbetsdagar." }
      ],
      ctaTitle: "Ge din hud det Hamburg kräver",
      ctaSub: "Naturlig CBD-hudvård från Sverige till Hamburg. Fri frakt över €60."
    },
    en: {
      metaTitle: "Skincare Hamburg – CBD skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Hamburg. Order online with free shipping over €60. Protect your skin from North Sea humidity and port city pollution.",
      kicker: "Skincare in Hamburg",
      h1: "Natural skincare for Hamburg",
      lead: "Hamburg – port city, Elbphilharmonie, and North Sea wind. Humidity, salt, and urban air challenge your skin. Free shipping over €60.",
      problemTitle: "What Hamburg does to your skin",
      problemBody: "<p>Hamburg is Germany's gateway to the world – and to the North Sea's damp, salty air. The Elbe River and harbor contribute to constantly high outdoor humidity, but indoors the air is dry. Wind from the North Sea carries salt that dehydrates the skin. Hamburg's climate is maritime with mild but grey winters and cooler summers.</p><p>The harbor's industrial activity and city traffic contribute particles that stress the skin. Hamburg's water is moderately hard.</p>",
      tipsTitle: "Skincare tips for Hamburg residents",
      tips: [
        { title: "Protect against North Sea wind", body: "Hamburg's wind carries salt and moisture. A barrier oil protects the face." },
        { title: "Walk around the Alster", body: "Hamburg's inner lake offers calm and fresh air in the middle of the city." },
        { title: "Fish market breakfast", body: "Hamburg's Fischmarkt offers fresh fish – omega-3s straight from the harbor." },
        { title: "Cleanse after city walks", body: "Harbor air and traffic particles settle on the skin. Gentle cleansing in the evening." },
        { title: "Humidifier in winter", body: "Despite outdoor humidity, German homes become dry indoors. A humidifier helps." }
      ],
      solutionTitle: "CBD skincare delivered to Hamburg",
      solutionBody: "<p>We ship from Sweden – delivery to Hamburg within 3–5 business days. Free shipping on orders over €60.</p><p>The DUO-kit strengthens the barrier against wind and salt. Au Naturel cleans away harbor particles. TA-DA Serum provides extra moisture.</p>",
      faq: [
        { q: "Do you ship to Hamburg?", a: "Yes, 3–5 business days. Free shipping over €60." },
        { q: "Is CBD legal in Germany?", a: "Yes, CBD in skincare is fully legal in Germany." },
        { q: "Which product for Hamburg's climate?", a: "DUO-kit as your base, Au Naturel for daily cleansing." },
        { q: "How long does shipping take?", a: "3–5 business days." }
      ],
      ctaTitle: "Give your skin what Hamburg demands",
      ctaSub: "Natural CBD skincare from Sweden to Hamburg. Free shipping over €60."
    },
    es: {
      metaTitle: "Cuidado de la piel Hamburgo – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Hamburgo. Pide online, envío gratis desde 50 €. Protege tu piel de la humedad del Mar del Norte y la contaminación portuaria.",
      kicker: "Cuidado de la piel en Hamburgo",
      h1: "Cosmética natural para Hamburgo",
      lead: "Hamburgo – puerto, Elbphilharmonie y viento del norte. Humedad, sal y aire urbano que no perdonan. Envío gratis desde 50 €.",
      problemTitle: "Lo que Hamburgo le hace a tu piel",
      problemBody: "<p>Puerta de Alemania al mar: aire húmedo y salado del Báltico y el Norte. El Elba y el puerto mantienen la humedad alta fuera; dentro, la calefacción seca. Clima marítimo, inviernos grises, veranos frescos.</p><p>Industria portuaria y tráfico añaden partículas. Agua del grifo moderadamente dura.</p>",
      tipsTitle: "Consejos para quien vive en Hamburgo",
      tips: [
        { title: "Frente al viento del mar", body: "Viento con sal y rocío. Aceite barrera en la cara." },
        { title: "Dar la vuelta al Alster", body: "El lago interior aporta calma y aire más limpio." },
        { title: "Desayuno en el Fischmarkt", body: "Pescado fresco – omega-3 directo del muelle." },
        { title: "Limpia tras pasear", body: "Aire de puerto y partículas – limpieza suave por la noche." },
        { title: "Humidificador en invierno", body: "Aunque fuera húmedo, en casa el aire se seca." }
      ],
      solutionTitle: "Cosmética con CBD con entrega en Hamburgo",
      solutionBody: "<p>Enviamos desde Suecia; 3–5 días laborables hasta Hamburgo. Envío gratis desde 50 €.</p><p>El DUO-kit refuerza la barrera frente a viento y sal. Au Naturel limpia partículas del puerto. TA-DA Serum aporta humedad extra.</p>",
      faq: [
        { q: "¿Envían a Hamburgo?", a: "Sí, 3–5 días laborables. Envío gratis desde 50 €." },
        { q: "¿El CBD es legal en Alemania?", a: "Sí, el CBD en cosmética es plenamente legal en Alemania." },
        { q: "¿Qué producto para el clima de Hamburgo?", a: "DUO-kit como base; Au Naturel para la limpieza diaria." },
        { q: "¿Plazo de envío?", a: "3–5 días laborables." }
      ],
      ctaTitle: "Dale a tu piel lo que Hamburgo exige",
      ctaSub: "Cosmética natural con CBD de Suecia a Hamburgo. Envío gratis desde 50 €."
    },
    de: {
      metaTitle: "Hautpflege Hamburg – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für Hamburg. Online bestellen, ab 50 € versandkostenfrei. Schutz vor Nordsee-Feuchte, Salzluft und Hafen-Stadtluft.",
      kicker: "Hautpflege in Hamburg",
      h1: "Natürliche Hautpflege für Hamburg",
      lead: "Hamburg – Hafenstadt, Elbphilharmonie, Nordwind. Feuchte, Salz und Großstadtluft – deine Haut merkt alles. Ab 50 € versandkostenfrei.",
      problemTitle: "Was Hamburg mit deiner Haut macht",
      problemBody: "<p>Deutschlands Tor zur Welt – und zur feuchten, salzigen Nordseeluft. Elbe und Hafen halten die Außenfeuchte hoch, drinnen macht die Heizung die Luft knochentrocken. Maritimes Klima: milde, graue Winter, kühlere Sommer.</p><p>Hafenbetrieb und Verkehr setzen Feinstaub auf die Haut. Leitungswasser mittelhart.</p>",
      tipsTitle: "Hautpflege-Tipps für Hamburg",
      tips: [
        { title: "Schutz vor Nordseewind", body: "Wind bringt Salz und Nässe. Barrier-Öl fürs Gesicht." },
        { title: "Runde um die Alster", body: "Innenalster – Ruhe und etwas frischere Luft mitten in der Stadt." },
        { title: "Frühstück am Fischmarkt", body: "Frischer Fisch, Omega-3 quasi vom Kai." },
        { title: "Nach dem Stadtspaziergang reinigen", body: "Hafenluft und Abgase setzen sich ab – abends mild waschen." },
        { title: "Luftbefeuchter im Winter", body: "Draußen feucht, drinnen oft Wüste – Befeuchter hilft." }
      ],
      solutionTitle: "CBD-Hautpflege nach Hamburg",
      solutionBody: "<p>Versand aus Schweden – 3–5 Werktage nach Hamburg. Ab 50 € versandkostenfrei.</p><p>Das DUO-kit stärkt die Barriere gegen Wind und Salz. Au Naturel entfernt Hafen-Staub. TA-DA Serum spendet extra Feuchtigkeit.</p>",
      faq: [
        { q: "Liefert ihr nach Hamburg?", a: "Ja, 3–5 Werktage. Ab 50 € versandkostenfrei." },
        { q: "Ist CBD in Deutschland legal?", a: "Ja, CBD in Kosmetik ist in Deutschland vollständig legal." },
        { q: "Welches Produkt fürs Hamburg-Klima?", a: "DUO-kit als Basis, Au Naturel zur täglichen Reinigung." },
        { q: "Wie lange dauert der Versand?", a: "3–5 Werktage." }
      ],
      ctaTitle: "Gib deiner Haut, was Hamburg verlangt",
      ctaSub: "Natürliche CBD-Pflege von Schweden nach Hamburg. Ab 50 € versandkostenfrei."
    },
    fr: {
      metaTitle: "Soin du visage Hambourg – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Hambourg. Commande en ligne, livraison offerte dès 50 €. Protège ta peau de l’humidité de la mer du Nord et de la pollution portuaire.",
      kicker: "Soins à Hambourg",
      h1: "Soins naturels pour Hambourg",
      lead: "Hambourg – port, Elbphilharmonie et vent du nord. Humidité, sel et air urbain : ta peau en subit les effets. Livraison offerte dès 50 €.",
      problemTitle: "Ce que Hambourg fait à ta peau",
      problemBody: "<p>Porte de l’Allemagne sur le monde – et sur l’air humide et salé de la mer du Nord. L’Elbe et le port maintiennent une humidité extérieure élevée ; dedans le chauffage assèche tout. Climat maritime : hivers doux et gris, étés plus frais.</p><p>Activité portuaire et trafic déposent des particules. Eau modérément dure.</p>",
      tipsTitle: "Conseils peau pour Hambourg",
      tips: [
        { title: "Contre le vent du nord", body: "Vent chargé de sel et d’humidité. Huile barrière sur le visage." },
        { title: "Tour de l’Alster", body: "Le lac intérieur offre calme et air un peu plus pur." },
        { title: "Petit-déjeuner au marché au poisson", body: "Poisson frais – oméga-3 quasi du quai." },
        { title: "Nettoie après la ville", body: "Air de port et particules – nettoyage doux le soir." },
        { title: "Humidificateur l’hiver", body: "Dehors humide, dedans souvent sec – humidifier aide." }
      ],
      solutionTitle: "Soins au CBD livrés à Hambourg",
      solutionBody: "<p>Expédition depuis la Suède ; 3–5 jours ouvrés jusqu’à Hambourg. Livraison offerte dès 50 €.</p><p>Le DUO-kit renforce la barrière face au vent et au sel. Au Naturel enlève les résidus du port. TA-DA Serum apporte de l’humidité en plus.</p>",
      faq: [
        { q: "Livrez-vous à Hambourg ?", a: "Oui, 3–5 jours ouvrés. Livraison offerte dès 50 €." },
        { q: "Le CBD est-il légal en Allemagne ?", a: "Oui, le CBD en cosmétique est entièrement légal en Allemagne." },
        { q: "Quel produit pour le climat de Hambourg ?", a: "DUO-kit comme base ; Au Naturel pour le nettoyage quotidien." },
        { q: "Délai de livraison ?", a: "3–5 jours ouvrés." }
      ],
      ctaTitle: "Offre à ta peau ce que Hambourg exige",
      ctaSub: "Soins naturels au CBD de la Suède à Hambourg. Livraison offerte dès 50 €."
    }
  },
  {
    svSlug: "hudvard-zurich",
    enSlug: "skincare-zurich",
    esSlug: "cuidado-piel-cbd-zurich",
    deSlug: "cbd-hautpflege-zurich",
    frSlug: "soin-peau-cbd-zurich",
    category: "stad",
    productIds: ["duo-kit", "ta-da-serum", "fungtastic-mushroom-extract"],
    sv: {
      metaTitle: "Hudvård Zürich – CBD-hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i Zürich. Beställ online med fri frakt över €60. Skydda din hud mot alpklimatet och Föhn-vinden.",
      kicker: "Hudvård i Zürich",
      h1: "Naturlig hudvård för dig i Zürich",
      lead: "Zürich – Alpernas finansmetropol med ett klimat som växlar mellan Föhn-torka och fuktig dimma. Fri frakt över €60.",
      problemTitle: "Zürichhudens utmaningar",
      problemBody: "<p>Zürich ligger vid foten av Alperna och Zürichsjön. Föhn-vinden – varm, torr luft från bergen – kan sänka luftfuktigheten dramatiskt. Vintrarna är kalla med dimma som hänger över sjön i veckor. Somrarna är varma och fuktiga. Temperaturväxlingarna mellan årstiderna och under Föhn-perioder stressar huden.</p><p>Zürichs vatten är mjukt och av utmärkt kvalitet – en fördel. Men den schweiziska perfektion som präglar arbetslivet bidrar till stress som påverkar huden.</p>",
      tipsTitle: "Hudvårdstips för zürichbor",
      tips: [
        { title: "Extra skydd under Föhn", body: "Föhn-dagar torkar ut huden snabbt. Applicera en extra rik olja." },
        { title: "Bad i Zürichsjön", body: "Sommarbad i sjön ger mineralrikt vatten. Återfukta efteråt." },
        { title: "Promenera längs Limmat", body: "Frisk luft längs floden sänker stressnivåer." },
        { title: "Schweizisk kvalitetskost", body: "Schweiziska mejeriprodukter, fisk från sjön och ekologiskt – allt finns." },
        { title: "Hantera finansstressen", body: "Zürich är en intensiv stad. Stresshantering gynnar huden direkt." }
      ],
      solutionTitle: "CBD-hudvård levererad till Zürich",
      solutionBody: "<p>Vi skickar från Sverige – leverans till Zürich inom 3–5 arbetsdagar. Fri frakt över €60.</p><p>DUO-kit balanserar huden. TA-DA Serum ger extra fukt under Föhn. Fungtastic stödjer immunförsvaret.</p>",
      faq: [
        { q: "Levererar ni till Schweiz?", a: "Ja, 3–5 arbetsdagar. Fri frakt över €60." },
        { q: "Är CBD lagligt i Schweiz?", a: "Ja, Schweiz har Europas mest liberala CBD-lagstiftning." },
        { q: "Vilken produkt för Föhn-dagar?", a: "TA-DA Serum ger extra fukt och barriärskydd." },
        { q: "Hur lång tid tar leveransen?", a: "3–5 arbetsdagar." }
      ],
      ctaTitle: "Ge din hud det Zürich kräver",
      ctaSub: "Naturlig CBD-hudvård från Sverige till Zürich. Fri frakt över €60."
    },
    en: {
      metaTitle: "Skincare Zurich – CBD skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Zurich. Order online with free shipping over €60. Protect your skin from Alpine Föhn winds and Swiss climate shifts.",
      kicker: "Skincare in Zurich",
      h1: "Natural skincare for Zurich",
      lead: "Zurich – the Alpine finance capital with a climate that swings between Föhn dryness and damp fog. Free shipping over €60.",
      problemTitle: "What Zurich does to your skin",
      problemBody: "<p>Zurich sits at the foot of the Alps by Lake Zurich. The Föhn wind – warm, dry air from the mountains – can drop humidity levels dramatically. Winters are cold with fog that hangs over the lake for weeks. Summers are warm and humid. Temperature fluctuations between seasons and during Föhn periods stress the skin.</p><p>Zurich's water is soft and excellent quality – an advantage. But the Swiss perfectionism that defines working life contributes stress that affects the skin.</p>",
      tipsTitle: "Skincare tips for Zurich residents",
      tips: [
        { title: "Extra protection during Föhn", body: "Föhn days dry out the skin rapidly. Apply an extra rich oil." },
        { title: "Swim in Lake Zurich", body: "Summer swimming in the lake provides mineral-rich water. Moisturize afterward." },
        { title: "Walk along the Limmat", body: "Fresh air along the river lowers stress levels." },
        { title: "Swiss quality food", body: "Swiss dairy, lake fish, and organic produce – it's all available." },
        { title: "Manage the finance stress", body: "Zurich is an intense city. Stress management benefits the skin directly." }
      ],
      solutionTitle: "CBD skincare delivered to Zurich",
      solutionBody: "<p>We ship from Sweden – delivery to Zurich within 3–5 business days. Free shipping on orders over €60.</p><p>The DUO-kit balances the skin. TA-DA Serum provides extra moisture during Föhn. Fungtastic supports immunity.</p>",
      faq: [
        { q: "Do you ship to Switzerland?", a: "Yes, 3–5 business days. Free shipping over €60." },
        { q: "Is CBD legal in Switzerland?", a: "Yes, Switzerland has Europe's most liberal CBD legislation." },
        { q: "Which product for Föhn days?", a: "TA-DA Serum provides extra moisture and barrier protection." },
        { q: "How long does shipping take?", a: "3–5 business days." }
      ],
      ctaTitle: "Give your skin what Zurich demands",
      ctaSub: "Natural CBD skincare from Sweden to Zurich. Free shipping over €60."
    },
    es: {
      metaTitle: "Cuidado de la piel Zúrich – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Zúrich. Pide online, envío gratis desde 50 €. Protege tu piel del viento Föhn alpino y los cambios de clima suizo.",
      kicker: "Cuidado de la piel en Zúrich",
      h1: "Cosmética natural para Zúrich",
      lead: "Zúrich – finanzas a los pies de los Alpes: alterna sequedad de Föhn y niebla húmeda sobre el lago. Envío gratis desde 50 €.",
      problemTitle: "Lo que Zúrich le hace a tu piel",
      problemBody: "<p>A orillas del lago de Zúrich, bajo los Alpes. El Föhn baja la humedad de golpe. Inviernos fríos con niebla persistente; veranos cálidos y húmedos. Los saltos térmicos – también entre días de Föhn – estresan la barrera.</p><p>El agua es blanda y excelente. El ritmo laboral suizo intenso sube el estrés – y la piel lo nota.</p>",
      tipsTitle: "Consejos para quien vive en Zúrich",
      tips: [
        { title: "Refuerzo con Föhn", body: "Esos días la piel se seca en horas. Aceite más rico." },
        { title: "Baño en el lago", body: "En verano, agua mineralizada – hidrata después." },
        { title: "Paseo por el Limmat", body: "Aire y menos cortisol junto al río." },
        { title: "Productos suizos de calidad", body: "Lácteos, pescado del lago, bio – fácil de encontrar." },
        { title: "Gestiona el estrés", body: "Ciudad exigente: menos estrés, mejor piel." }
      ],
      solutionTitle: "Cosmética con CBD con entrega en Zúrich",
      solutionBody: "<p>Enviamos desde Suecia; 3–5 días laborables hasta Zúrich. Envío gratis desde 50 €.</p><p>El DUO-kit equilibra la piel. TA-DA Serum hidrata en días de Föhn. Fungtastic Mushroom Extract apoya la inmunidad.</p>",
      faq: [
        { q: "¿Envían a Suiza?", a: "Sí, 3–5 días laborables. Envío gratis desde 50 €." },
        { q: "¿El CBD es legal en Suiza?", a: "Sí, Suiza tiene una de las normativas más abiertas de Europa sobre CBD." },
        { q: "¿Qué producto para días de Föhn?", a: "TA-DA Serum para humedad y barrera extra." },
        { q: "¿Plazo de envío?", a: "3–5 días laborables." }
      ],
      ctaTitle: "Dale a tu piel lo que Zúrich exige",
      ctaSub: "Cosmética natural con CBD de Suecia a Zúrich. Envío gratis desde 50 €."
    },
    de: {
      metaTitle: "Hautpflege Zürich – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für Zürich. Online bestellen, ab 50 € versandkostenfrei. Schutz vor Alpen-Föhn und Schweizer Klimaschwankungen.",
      kicker: "Hautpflege in Zürich",
      h1: "Natürliche Hautpflege für Zürich",
      lead: "Zürich – Finanzmetropole am Zürichsee, zwischen Föhn-Trockenheit und feuchtem Nebel. Ab 50 € versandkostenfrei.",
      problemTitle: "Was Zürich mit deiner Haut macht",
      problemBody: "<p>Am Zürichsee, vor den Alpen. Föhn senkt die Luftfeuchtigkeit rasant. Kalte Winter mit tagelangem Nebel über dem See; warm-feuchte Sommer. Temperatur- und Feuchtesprünge – auch zwischen Föhn-Tagen – stressen die Barriere.</p><p>Das Wasser ist weich und top. Der intensive Schweizer Arbeitsrhythmus hebt den Stress – die Haut reagiert.</p>",
      tipsTitle: "Hautpflege-Tipps für Zürich",
      tips: [
        { title: "Extra bei Föhn", body: "An Föhn-Tagen trocknet die Haut blitzschnell. Reichhaltigeres Öl." },
        { title: "Im Zürichsee schwimmen", body: "Im Sommer mineralhaltiges Wasser – danach eincremen." },
        { title: "Limmat entlang", body: "Frische Luft am Fluss, Stress runter." },
        { title: "Schweizer Qualitätsessen", body: "Milchprodukte, Seefisch, Bio – alles da." },
        { title: "Stress managen", body: "Intensive Stadt – weniger Stress, bessere Haut." }
      ],
      solutionTitle: "CBD-Hautpflege nach Zürich",
      solutionBody: "<p>Versand aus Schweden – 3–5 Werktage nach Zürich. Ab 50 € versandkostenfrei.</p><p>Das DUO-kit balanciert. TA-DA Serum spendet bei Föhn extra. Fungtastic Mushroom Extract unterstützt die Immunität.</p>",
      faq: [
        { q: "Liefert ihr in die Schweiz?", a: "Ja, 3–5 Werktage. Ab 50 € versandkostenfrei." },
        { q: "Ist CBD in der Schweiz legal?", a: "Ja, die Schweiz hat eine der liberalsten CBD-Regelungen Europas." },
        { q: "Welches Produkt für Föhn-Tage?", a: "TA-DA Serum für Feuchtigkeit und extra Barriere." },
        { q: "Wie lange dauert der Versand?", a: "3–5 Werktage." }
      ],
      ctaTitle: "Gib deiner Haut, was Zürich verlangt",
      ctaSub: "Natürliche CBD-Pflege von Schweden nach Zürich. Ab 50 € versandkostenfrei."
    },
    fr: {
      metaTitle: "Soin du visage Zurich – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Zurich. Commande en ligne, livraison offerte dès 50 €. Protège ta peau du foehn alpin et des variations climatiques suisses.",
      kicker: "Soins à Zurich",
      h1: "Soins naturels pour Zurich",
      lead: "Zurich – capitale financière au pied des Alpes, entre assèchement du foehn et brume humide sur le lac. Livraison offerte dès 50 €.",
      problemTitle: "Ce que Zurich fait à ta peau",
      problemBody: "<p>Au bord du lac de Zurich, face aux Alpes. Le foehn fait chuter l’humidité en un clin d’œil. Hivers froids avec brouillard qui s’accroche au lac ; étés chauds et humides. Sauts de température et d’humidité – y compris entre jours de foehn – sollicitent la barrière.</p><p>L’eau est douce et excellente. Le rythme de travail suisse intense monte le stress – la peau le ressent.</p>",
      tipsTitle: "Conseils peau pour Zurich",
      tips: [
        { title: "Renfort au foehn", body: "Les jours de foehn, la peau se déshydrate vite. Huile plus riche." },
        { title: "Baignade dans le lac", body: "En été, eau minéralisée – hydrate après." },
        { title: "Long de la Limmat", body: "Air frais au bord de l’eau, stress en baisse." },
        { title: "Qualité suisse dans l’assiette", body: "Produits laitiers, poisson du lac, bio – tout est là." },
        { title: "Gérer le stress", body: "Ville intense : moins de tension, meilleure peau." }
      ],
      solutionTitle: "Soins au CBD livrés à Zurich",
      solutionBody: "<p>Expédition depuis la Suède ; 3–5 jours ouvrés jusqu’à Zurich. Livraison offerte dès 50 €.</p><p>Le DUO-kit équilibre la peau. TA-DA Serum hydrate davantage par temps de foehn. Fungtastic Mushroom Extract soutient l’immunité.</p>",
      faq: [
        { q: "Livrez-vous en Suisse ?", a: "Oui, 3–5 jours ouvrés. Livraison offerte dès 50 €." },
        { q: "Le CBD est-il légal en Suisse ?", a: "Oui, la Suisse a l’une des législations les plus ouvertes sur le CBD en Europe." },
        { q: "Quel produit pour les jours de foehn ?", a: "TA-DA Serum pour l’humidité et une barrière renforcée." },
        { q: "Délai de livraison ?", a: "3–5 jours ouvrés." }
      ],
      ctaTitle: "Offre à ta peau ce que Zurich exige",
      ctaSub: "Soins naturels au CBD de la Suède à Zurich. Livraison offerte dès 50 €."
    }
  },
  // ──────────────────────────────────────────────
  // ADDITIONAL UK & FRANCE
  // ──────────────────────────────────────────────
  {
    svSlug: "hudvard-manchester",
    enSlug: "skincare-manchester",
    esSlug: "cuidado-piel-cbd-manchester",
    deSlug: "cbd-hautpflege-manchester",
    frSlug: "soin-peau-cbd-manchester",
    category: "stad",
    productIds: ["duo-kit", "ta-da-serum", "fungtastic-mushroom-extract"],
    sv: {
      metaTitle: "Hudvård Manchester – CBD-hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i Manchester. Beställ online med fri frakt över €60. Skydda din hud mot Manchesters berömda regn.",
      kicker: "Hudvård i Manchester",
      h1: "Naturlig hudvård för dig i Manchester",
      lead: "Manchester – musik, fotboll och regn. Nordengelska klimatets konstanta fukt och begränsade sol utmanar din hud. Fri frakt över €60 (cirka £45).",
      problemTitle: "Manchesterhudens utmaningar",
      problemBody: "<p>Manchester har ett av Storbritanniens blötaste klimat. Regn faller nästan varannan dag, och den konstanta fukten kombinerat med vind från Penninska bergen skapar en miljö som sliter på hudbarriären. Trots utomhusfukten är inomhusluften torr från uppvärmning.</p><p>Solljus är en bristvara – Manchester har färre soltimmar än London. D-vitaminbrist är utbredd. Manchesters industriella arv bidrar med restföroreningar i stadsluften.</p>",
      tipsTitle: "Hudvårdstips för manchesterbor",
      tips: [
        { title: "Barriärolja i regnet", body: "Manchester-regnet är oundvikligt. En barriärolja före uteaktiviteter skyddar huden." },
        { title: "Promenera i Heaton Park", body: "Nordengelska parker ger grönska och andrum." },
        { title: "D-vitamin", body: "Med Manchesters molntäcke behöver du tillskott." },
        { title: "Northern Soul food", body: "Hälsoscenen i Northern Quarter erbjuder bra hudmat." },
        { title: "Luftfuktare hemma", body: "Engelska rad-hus med centralvärme blir torra inomhus." }
      ],
      solutionTitle: "CBD-hudvård levererad till Manchester",
      solutionBody: "<p>Vi skickar från Sverige – leverans till Manchester inom 5–7 arbetsdagar. Fri frakt över €60 (cirka £45).</p><p>DUO-kit stärker barriären mot regn och vind. TA-DA Serum ger fukt. Fungtastic stödjer immunförsvaret i det grå klimatet.</p>",
      faq: [
        { q: "Levererar ni till Manchester?", a: "Ja, 5–7 arbetsdagar. Fri frakt över €60 (cirka £45)." },
        { q: "Är CBD lagligt i UK?", a: "Ja, CBD i hudvård är fullt lagligt i Storbritannien." },
        { q: "Vilken produkt för regnet?", a: "DUO-kit som dagligt barriärskydd." },
        { q: "Hur lång tid tar leveransen?", a: "5–7 arbetsdagar." }
      ],
      ctaTitle: "Ge din hud det Manchester kräver",
      ctaSub: "Naturlig CBD-hudvård från Sverige till Manchester. Fri frakt över €60."
    },
    en: {
      metaTitle: "Skincare Manchester – CBD skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Manchester. Order online with free shipping over €60. Protect your skin from Manchester's famous rain and limited sunlight.",
      kicker: "Skincare in Manchester",
      h1: "Natural skincare for Manchester",
      lead: "Manchester – music, football, and rain. The northern English climate's constant dampness and limited sun challenge your skin. Free shipping over €60 (approximately £45).",
      problemTitle: "What Manchester does to your skin",
      problemBody: "<p>Manchester has one of the UK's wettest climates. Rain falls almost every other day, and the constant dampness combined with wind from the Pennine hills creates an environment that wears down the skin barrier. Despite outdoor moisture, indoor air is dry from heating.</p><p>Sunlight is scarce – Manchester has fewer sunshine hours than London. Vitamin D deficiency is widespread. Manchester's industrial heritage contributes residual pollution to the urban air.</p>",
      tipsTitle: "Skincare tips for Mancunians",
      tips: [
        { title: "Barrier oil in the rain", body: "Manchester rain is inevitable. A barrier oil before outdoor activities protects the skin." },
        { title: "Walk in Heaton Park", body: "Northern English parks offer greenery and breathing space." },
        { title: "Vitamin D", body: "With Manchester's cloud cover, you need supplements." },
        { title: "Northern Quarter health food", body: "Manchester's health food scene in the Northern Quarter offers great skin food." },
        { title: "Humidifier at home", body: "English terraced houses with central heating become dry indoors." }
      ],
      solutionTitle: "CBD skincare delivered to Manchester",
      solutionBody: "<p>We ship from Sweden – delivery to Manchester within 5–7 business days. Free shipping on orders over €60 (approximately £45).</p><p>The DUO-kit strengthens the barrier against rain and wind. TA-DA Serum provides moisture. Fungtastic supports immunity in the grey climate.</p>",
      faq: [
        { q: "Do you ship to Manchester?", a: "Yes, 5–7 business days. Free shipping over €60 (approximately £45)." },
        { q: "Is CBD legal in the UK?", a: "Yes, CBD in skincare is fully legal in the United Kingdom." },
        { q: "Which product for the rain?", a: "DUO-kit as daily barrier protection." },
        { q: "How long does shipping take?", a: "5–7 business days." }
      ],
      ctaTitle: "Give your skin what Manchester demands",
      ctaSub: "Natural CBD skincare from Sweden to Manchester. Free shipping over €60."
    },
    es: {
      metaTitle: "Cuidado de la piel Mánchester – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Mánchester. Pide online, envío gratis desde 50 €. Protege tu piel de la lluvia legendaria y el poco sol del norte de Inglaterra.",
      kicker: "Cuidado de la piel en Mánchester",
      h1: "Cosmética natural para Mánchester",
      lead: "Mánchester – música, fútbol y chaparrón permanente. Húmedo, gris y con pocas horas de sol. Envío gratis desde 50 € (unas 45 £); entrega 5–7 días laborables.",
      problemTitle: "Lo que Mánchester le hace a tu piel",
      problemBody: "<p>Uno de los climas más mojados del Reino Unido: llueve casi un día sí y otro también. Humedad constante más viento de los Peninos desgasta la barrera. Fuera húmedo, dentro la calefacción seca.</p><p>Menos sol que en Londres; déficit de vitamina D habitual. El legado industrial deja restos en el aire urbano.</p>",
      tipsTitle: "Consejos para quien vive en Mánchester",
      tips: [
        { title: "Aceite barrera bajo la lluvia", body: "La lluvia mancuniana no negocia. Aceite antes de salir." },
        { title: "Heaton Park", body: "Verde y respiro al norte." },
        { title: "Vitamina D", body: "Con este cielo, suplementos." },
        { title: "Northern Quarter", body: "Tiendas de comida sana – buen combustible para la piel." },
        { title: "Humidificador", body: "Casas adosadas con calefacción = aire seco en casa." }
      ],
      solutionTitle: "Cosmética con CBD con entrega en Mánchester",
      solutionBody: "<p>Enviamos desde Suecia; 5–7 días laborables hasta Mánchester. Envío gratis desde 50 € (unas 45 £).</p><p>El DUO-kit refuerza la barrera frente a lluvia y viento. TA-DA Serum hidrata. Fungtastic Mushroom Extract apoya la inmunidad en el gris.</p>",
      faq: [
        { q: "¿Envían a Mánchester?", a: "Sí, 5–7 días laborables. Envío gratis desde 50 € (unas 45 £)." },
        { q: "¿El CBD es legal en el Reino Unido?", a: "Sí, el CBD en cosmética es plenamente legal en el Reino Unido." },
        { q: "¿Qué producto para la lluvia?", a: "DUO-kit como barrera diaria." },
        { q: "¿Plazo de envío?", a: "5–7 días laborables." }
      ],
      ctaTitle: "Dale a tu piel lo que Mánchester exige",
      ctaSub: "Cosmética natural con CBD de Suecia a Mánchester. Envío gratis desde 50 €."
    },
    de: {
      metaTitle: "Hautpflege Manchester – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für Manchester. Online bestellen, ab 50 € versandkostenfrei. Schutz vor berühmtem Regen und wenig Sonne im Norden Englands.",
      kicker: "Hautpflege in Manchester",
      h1: "Natürliche Hautpflege für Manchester",
      lead: "Manchester – Musik, Fußball, Dauerregen. Ständige Nässe, wenig Sonne. Ab 50 € (ca. £45) versandkostenfrei, Lieferung 5–7 Werktage.",
      problemTitle: "Was Manchester mit deiner Haut macht",
      problemBody: "<p>Eines der regenreichsten Klimas im UK – fast jeden zweiten Tag Niederschlag. Dauerfeuchte plus Wind von den Pennines strapaziert die Barriere. Draußen nass, drinnen Heizung trocknet aus.</p><p>Weniger Sonne als in London, Vitamin-D-Mangel verbreitet. Industrieerbe hinterlässt Restbelastung in der Luft.</p>",
      tipsTitle: "Hautpflege-Tipps für Manchester",
      tips: [
        { title: "Öl gegen Regen", body: "Manchester-Regen ist sicher. Barrier-Öl vor dem Rausgehen." },
        { title: "Heaton Park", body: "Grün und Luft im Norden." },
        { title: "Vitamin D", body: "Bei diesem Himmel Supplemente." },
        { title: "Northern Quarter", body: "Health-Food-Szene – gutes Skin-Food." },
        { title: "Luftbefeuchter", body: "Reihenhäuser mit Heizung = trockene Wohnung." }
      ],
      solutionTitle: "CBD-Hautpflege nach Manchester",
      solutionBody: "<p>Versand aus Schweden – 5–7 Werktage nach Manchester. Ab 50 € (ca. £45) versandkostenfrei.</p><p>Das DUO-kit stärkt die Barriere gegen Regen und Wind. TA-DA Serum spendet Feuchtigkeit. Fungtastic Mushroom Extract unterstützt die Immunität im Grau.</p>",
      faq: [
        { q: "Liefert ihr nach Manchester?", a: "Ja, 5–7 Werktage. Ab 50 € (ca. £45) versandkostenfrei." },
        { q: "Ist CBD im UK legal?", a: "Ja, CBD in Kosmetik ist im Vereinigten Königreich vollständig legal." },
        { q: "Welches Produkt für Regen?", a: "DUO-kit als täglicher Barrier-Schutz." },
        { q: "Wie lange dauert der Versand?", a: "5–7 Werktage." }
      ],
      ctaTitle: "Gib deiner Haut, was Manchester verlangt",
      ctaSub: "Natürliche CBD-Pflege von Schweden nach Manchester. Ab 50 € versandkostenfrei."
    },
    fr: {
      metaTitle: "Soin du visage Manchester – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Manchester. Commande en ligne, livraison offerte dès 50 €. Protège ta peau de la pluie légendaire et du peu de soleil du nord de l’Angleterre.",
      kicker: "Soins à Manchester",
      h1: "Soins naturels pour Manchester",
      lead: "Manchester – musique, foot et pluie en série. Humidité permanente, peu de soleil. Livraison offerte dès 50 € (environ 45 £), délai 5–7 jours ouvrés.",
      problemTitle: "Ce que Manchester fait à ta peau",
      problemBody: "<p>L’un des climats les plus pluvieux du Royaume-Uni : il pleut presque un jour sur deux. Humidité constante et vent des Pennines érodent la barrière. Dehors mouillé, dedans le chauffage assèche.</p><p>Moins de soleil qu’à Londres ; carence en vitamine D fréquente. L’héritage industriel laisse une trace dans l’air urbain.</p>",
      tipsTitle: "Conseils peau pour Manchester",
      tips: [
        { title: "Huile barrière sous la pluie", body: "La pluie mancunienne est une certitude. Huile avant de sortir." },
        { title: "Heaton Park", body: "Vert et air au nord." },
        { title: "Vitamine D", body: "Avec ce ciel, compléments." },
        { title: "Northern Quarter", body: "Scène healthy – bon carburant peau." },
        { title: "Humidificateur", body: "Maisons mitoyennes chauffées = air sec à l’intérieur." }
      ],
      solutionTitle: "Soins au CBD livrés à Manchester",
      solutionBody: "<p>Expédition depuis la Suède ; 5–7 jours ouvrés jusqu’à Manchester. Livraison offerte dès 50 € (environ 45 £).</p><p>Le DUO-kit renforce la barrière face à la pluie et au vent. TA-DA Serum hydrate. Fungtastic Mushroom Extract soutient l’immunité sous le ciel gris.</p>",
      faq: [
        { q: "Livrez-vous à Manchester ?", a: "Oui, 5–7 jours ouvrés. Livraison offerte dès 50 € (environ 45 £)." },
        { q: "Le CBD est-il légal au Royaume-Uni ?", a: "Oui, le CBD en cosmétique est entièrement légal au Royaume-Uni." },
        { q: "Quel produit pour la pluie ?", a: "DUO-kit comme protection barrière au quotidien." },
        { q: "Délai de livraison ?", a: "5–7 jours ouvrés." }
      ],
      ctaTitle: "Offre à ta peau ce que Manchester exige",
      ctaSub: "Soins naturels au CBD de la Suède à Manchester. Livraison offerte dès 50 €."
    }
  },
  {
    svSlug: "hudvard-edinburgh",
    enSlug: "skincare-edinburgh",
    esSlug: "cuidado-piel-cbd-edinburgh",
    deSlug: "cbd-hautpflege-edinburgh",
    frSlug: "soin-peau-cbd-edinburgh",
    category: "stad",
    productIds: ["duo-kit", "ta-da-serum", "fungtastic-mushroom-extract"],
    sv: {
      metaTitle: "Hudvård Edinburgh – CBD-hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i Edinburgh. Beställ online med fri frakt över €60. Skydda din hud mot skotsk vind och kyla.",
      kicker: "Hudvård i Edinburgh",
      h1: "Naturlig hudvård för dig i Edinburgh",
      lead: "Edinburgh – vackert, historiskt och blåsigt. Skotsk vind, kyla och begränsat solljus utmanar din hud. Fri frakt över €60 (cirka £45).",
      problemTitle: "Edinburghhudens utmaningar",
      problemBody: "<p>Edinburgh ligger på Skottlands östkust, exponerad för bitande Nordsjövind. Staden är byggd på kullar, och vinden kanaliseras genom gator och gränder – särskilt Royal Mile. Vintrarna är kalla och mörka, somrarna korta och svala. Regn och dimma är vanliga.</p><p>Skottlands begränsade solljus gör D-vitaminbrist till ett folkhälsoproblem. Edinburgh har dock mjukt vatten – en fördel jämfört med södra England.</p>",
      tipsTitle: "Hudvårdstips för edinburghbor",
      tips: [
        { title: "Vindskydd på Royal Mile", body: "Edinburghs gator kanaliserar vinden. Barriärolja är nödvändig." },
        { title: "Promenera i Arthur's Seat", body: "Edinburghs berg mitt i staden ger motion och frisk luft." },
        { title: "D-vitamin hela vintern", body: "Skotsk mörker kräver tillskott." },
        { title: "Skotsk lax", body: "Skottlands lax och skaldjur ger omega-3 i överflöd." },
        { title: "Varm te-ritual", body: "Varm te värmer inifrån och örteteer kan ge antioxidanter." }
      ],
      solutionTitle: "CBD-hudvård levererad till Edinburgh",
      solutionBody: "<p>Vi skickar från Sverige – leverans till Edinburgh inom 5–7 arbetsdagar. Fri frakt över €60 (cirka £45).</p><p>DUO-kit stärker barriären mot skotsk vind. TA-DA Serum ger extra fukt. Fungtastic stödjer immunförsvaret under de mörka månaderna.</p>",
      faq: [
        { q: "Levererar ni till Skottland?", a: "Ja, 5–7 arbetsdagar. Fri frakt över €60 (cirka £45)." },
        { q: "Är CBD lagligt i UK?", a: "Ja, CBD i hudvård är fullt lagligt." },
        { q: "Vilken produkt för skotsk vind?", a: "DUO-kit som bas, TA-DA Serum för extra skydd." },
        { q: "Hur lång tid tar leveransen?", a: "5–7 arbetsdagar." }
      ],
      ctaTitle: "Ge din hud det Edinburgh kräver",
      ctaSub: "Naturlig CBD-hudvård från Sverige till Edinburgh. Fri frakt över €60."
    },
    en: {
      metaTitle: "Skincare Edinburgh – CBD skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Edinburgh. Order online with free shipping over €60. Protect your skin from Scottish wind, cold, and limited sunlight.",
      kicker: "Skincare in Edinburgh",
      h1: "Natural skincare for Edinburgh",
      lead: "Edinburgh – beautiful, historic, and windswept. Scottish wind, cold, and limited sunlight challenge your skin. Free shipping over €60 (approximately £45).",
      problemTitle: "What Edinburgh does to your skin",
      problemBody: "<p>Edinburgh sits on Scotland's east coast, exposed to biting North Sea wind. The city is built on hills, and the wind channels through streets and closes – especially the Royal Mile. Winters are cold and dark, summers short and cool. Rain and mist are common.</p><p>Scotland's limited sunlight makes vitamin D deficiency a public health issue. Edinburgh does have soft water, however – an advantage compared to southern England.</p>",
      tipsTitle: "Skincare tips for Edinburgh residents",
      tips: [
        { title: "Wind protection on the Royal Mile", body: "Edinburgh's streets channel the wind. A barrier oil is essential." },
        { title: "Walk up Arthur's Seat", body: "Edinburgh's mountain in the city center offers exercise and fresh air." },
        { title: "Vitamin D all winter", body: "Scottish darkness demands supplements." },
        { title: "Scottish salmon", body: "Scotland's salmon and shellfish provide abundant omega-3s." },
        { title: "Warm tea ritual", body: "Warm tea warms from within, and herbal teas can provide antioxidants." }
      ],
      solutionTitle: "CBD skincare delivered to Edinburgh",
      solutionBody: "<p>We ship from Sweden – delivery to Edinburgh within 5–7 business days. Free shipping on orders over €60 (approximately £45).</p><p>The DUO-kit strengthens the barrier against Scottish wind. TA-DA Serum provides extra moisture. Fungtastic supports immunity during the dark months.</p>",
      faq: [
        { q: "Do you ship to Scotland?", a: "Yes, 5–7 business days. Free shipping over €60 (approximately £45)." },
        { q: "Is CBD legal in the UK?", a: "Yes, CBD in skincare is fully legal." },
        { q: "Which product for Scottish wind?", a: "DUO-kit as your base, TA-DA Serum for extra protection." },
        { q: "How long does shipping take?", a: "5–7 business days." }
      ],
      ctaTitle: "Give your skin what Edinburgh demands",
      ctaSub: "Natural CBD skincare from Sweden to Edinburgh. Free shipping over €60."
    },
    es: {
      metaTitle: "Cuidado de la piel Edimburgo – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Edimburgo. Pide online, envío gratis desde 50 €. Protege tu piel del viento escocés, el frío y el poco sol.",
      kicker: "Cuidado de la piel en Edimburgo",
      h1: "Cosmética natural para Edimburgo",
      lead: "Edimburgo – bella, histórica y azotada por el viento. Mar del Norte, frío y pocas horas de luz. Envío gratis desde 50 € (unas 45 £); 5–7 días laborables.",
      problemTitle: "Lo que Edimburgo le hace a tu piel",
      problemBody: "<p>En la costa este de Escocia, expuesta al viento del norte. Calles y closes canalizan el aire – el Royal Mile lo sabe. Inviernos oscuros y fríos; veranos cortos y frescos. Niebla y lluvia frecuentes.</p><p>Poca luz solar: la vitamina D es tema de salud pública. El agua es blanda – pequeña victoria frente al sur de Inglaterra.</p>",
      tipsTitle: "Consejos para quien vive en Edimburgo",
      tips: [
        { title: "Protección en el Royal Mile", body: "El viento entra en cuña entre edificios. Aceite barrera sí o sí." },
        { title: "Arthur's Seat", body: "Montaña urbana: movimiento y aire." },
        { title: "Vitamina D en invierno", body: "Oscuridad escocesa = suplementos." },
        { title: "Salmón escocés", body: "Omega-3 de sobra." },
        { title: "Té caliente", body: "Té de hierbas con antioxidantes – ritual que calienta por dentro." }
      ],
      solutionTitle: "Cosmética con CBD con entrega en Edimburgo",
      solutionBody: "<p>Enviamos desde Suecia; 5–7 días laborables hasta Edimburgo. Envío gratis desde 50 € (unas 45 £).</p><p>El DUO-kit refuerza la barrera frente al viento escocés. TA-DA Serum hidrata más. Fungtastic Mushroom Extract apoya la inmunidad en los meses oscuros.</p>",
      faq: [
        { q: "¿Envían a Escocia?", a: "Sí, 5–7 días laborables. Envío gratis desde 50 € (unas 45 £)." },
        { q: "¿El CBD es legal en el Reino Unido?", a: "Sí, el CBD en cosmética es plenamente legal." },
        { q: "¿Qué producto para el viento escocés?", a: "DUO-kit como base; TA-DA Serum para refuerzo." },
        { q: "¿Plazo de envío?", a: "5–7 días laborables." }
      ],
      ctaTitle: "Dale a tu piel lo que Edimburgo exige",
      ctaSub: "Cosmética natural con CBD de Suecia a Edimburgo. Envío gratis desde 50 €."
    },
    de: {
      metaTitle: "Hautpflege Edinburgh – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für Edinburgh. Online bestellen, ab 50 € versandkostenfrei. Schutz vor schottischem Wind, Kälte und wenig Sonne.",
      kicker: "Hautpflege in Edinburgh",
      h1: "Natürliche Hautpflege für Edinburgh",
      lead: "Edinburgh – schön, historisch, windgepeitscht. Nordsee-Wind, Kälte, wenig Licht. Ab 50 € (ca. £45) versandkostenfrei, 5–7 Werktage.",
      problemTitle: "Was Edinburgh mit deiner Haut macht",
      problemBody: "<p>An Schottlands Ostküste, Nordsee-Wind frontal. Hügelstadt – Wind in Gassen und Closes, besonders Royal Mile. Kalte, dunkle Winter; kurze, kühle Sommer. Nebel und Regen häufig.</p><p>Wenig Sonne, Vitamin-D-Mangel ist Volksgesundheitsthema. Wasser ist weich – Vorteil gegenüber Südengland.</p>",
      tipsTitle: "Hautpflege-Tipps für Edinburgh",
      tips: [
        { title: "Schutz an der Royal Mile", body: "Straßen kanalisieren Wind. Barrier-Öl ist Pflicht." },
        { title: "Arthur's Seat", body: "Berg in der Stadt – Bewegung, frische Luft." },
        { title: "Vitamin D im Winter", body: "Schottische Dunkelheit braucht Supplemente." },
        { title: "Schottischer Lachs", body: "Omega-3 im Überfluss." },
        { title: "Tee-Ritual", body: "Warmer Tee von innen, Kräutertees mit Antioxidantien." }
      ],
      solutionTitle: "CBD-Hautpflege nach Edinburgh",
      solutionBody: "<p>Versand aus Schweden – 5–7 Werktage nach Edinburgh. Ab 50 € (ca. £45) versandkostenfrei.</p><p>Das DUO-kit stärkt die Barriere gegen schottischen Wind. TA-DA Serum spendet extra. Fungtastic Mushroom Extract unterstützt die Immunität in den dunklen Monaten.</p>",
      faq: [
        { q: "Liefert ihr nach Schottland?", a: "Ja, 5–7 Werktage. Ab 50 € (ca. £45) versandkostenfrei." },
        { q: "Ist CBD im UK legal?", a: "Ja, CBD in Kosmetik ist vollständig legal." },
        { q: "Welches Produkt für schottischen Wind?", a: "DUO-kit als Basis, TA-DA Serum für Extra-Schutz." },
        { q: "Wie lange dauert der Versand?", a: "5–7 Werktage." }
      ],
      ctaTitle: "Gib deiner Haut, was Edinburgh verlangt",
      ctaSub: "Natürliche CBD-Pflege von Schweden nach Edinburgh. Ab 50 € versandkostenfrei."
    },
    fr: {
      metaTitle: "Soin du visage Édimbourg – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Édimbourg. Commande en ligne, livraison offerte dès 50 €. Protège ta peau du vent écossais, du froid et du manque de soleil.",
      kicker: "Soins à Édimbourg",
      h1: "Soins naturels pour Édimbourg",
      lead: "Édimbourg – belle, historique et balayée par le vent. Mer du Nord, froid et peu de lumière. Livraison offerte dès 50 € (environ 45 £), 5–7 jours ouvrés.",
      problemTitle: "Ce qu’Édimbourg fait à ta peau",
      problemBody: "<p>Sur la côte est de l’Écosse, exposée au vent de la mer du Nord. Ville vallonnée – ruelles et closes canalisent l’air, surtout sur le Royal Mile. Hivers froids et sombres ; étés courts et frais. Brouillard et pluie fréquents.</p><p>Peu de soleil : la vitamine D est un sujet de santé publique. L’eau est douce – petit avantage par rapport au sud de l’Angleterre.</p>",
      tipsTitle: "Conseils peau pour Édimbourg",
      tips: [
        { title: "Protection sur le Royal Mile", body: "Les rues canalisent le vent. Huile barrière indispensable." },
        { title: "Arthur's Seat", body: "Montagne urbaine : mouvement et air." },
        { title: "Vitamine D tout l’hiver", body: "Obscurité écossaise = compléments." },
        { title: "Saumon écossais", body: "Oméga-3 à foison." },
        { title: "Rituel thé chaud", body: "Thés aux herbes, antioxydants – chaleur de l’intérieur." }
      ],
      solutionTitle: "Soins au CBD livrés à Édimbourg",
      solutionBody: "<p>Expédition depuis la Suède ; 5–7 jours ouvrés jusqu’à Édimbourg. Livraison offerte dès 50 € (environ 45 £).</p><p>Le DUO-kit renforce la barrière face au vent écossais. TA-DA Serum hydrate davantage. Fungtastic Mushroom Extract soutient l’immunité pendant les mois sombres.</p>",
      faq: [
        { q: "Livrez-vous en Écosse ?", a: "Oui, 5–7 jours ouvrés. Livraison offerte dès 50 € (environ 45 £)." },
        { q: "Le CBD est-il légal au Royaume-Uni ?", a: "Oui, le CBD en cosmétique est entièrement légal." },
        { q: "Quel produit pour le vent écossais ?", a: "DUO-kit comme base ; TA-DA Serum pour un renfort." },
        { q: "Délai de livraison ?", a: "5–7 jours ouvrés." }
      ],
      ctaTitle: "Offre à ta peau ce qu’Édimbourg exige",
      ctaSub: "Soins naturels au CBD de la Suède à Édimbourg. Livraison offerte dès 50 €."
    }
  },
  {
    svSlug: "hudvard-lyon",
    enSlug: "skincare-lyon",
    esSlug: "cuidado-piel-cbd-lyon",
    deSlug: "cbd-hautpflege-lyon",
    frSlug: "soin-peau-cbd-lyon",
    category: "stad",
    productIds: ["duo-kit", "ta-da-serum", "au-naturel-makeup-remover"],
    sv: {
      metaTitle: "Hudvård Lyon – CBD-hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i Lyon. Beställ online med fri frakt över €60. Skydda din hud mot Lyons kontinentala klimat.",
      kicker: "Hudvård i Lyon",
      h1: "Naturlig hudvård för dig i Lyon",
      lead: "Lyon – Frankrikes gastronomiska huvudstad med ett kontinentalt klimat som utmanar huden. Kalla vintrar, varma somrar och föroreningar i Rhône-dalen. Fri frakt över €60.",
      problemTitle: "Lyonhudens utmaningar",
      problemBody: "<p>Lyon har ett halvkontinentalt klimat – kallare vintrar och varmare somrar än Paris. Rhône-dalen kan fånga föroreningar under inversioner, särskilt vintertid. Somrarna når regelbundet trettiofem grader med hög luftfuktighet. Stadsvinden – le mistral – blåser ibland upp genom dalen och torkar ut huden brutalt.</p>",
      tipsTitle: "Hudvårdstips för lyonbor",
      tips: [
        { title: "Anpassa efter säsongen", body: "Lyon har distinkta årstider. Lättare fukt på sommaren, rikare oljor på vintern." },
        { title: "Promenera i Parc de la Tête d'Or", body: "Lyons stora stadspark med sjö och botanisk trädgård." },
        { title: "Lyonnais gastronomi", body: "Lyons matvärld ger huden allt den behöver inifrån." },
        { title: "Skydda under mistral", body: "Mistralen torkar ut extremt. Extra barriärolja de dagarna." },
        { title: "Rengör ordentligt", body: "Rhône-dalens föroreningar kräver daglig rengöring." }
      ],
      solutionTitle: "CBD-hudvård levererad till Lyon",
      solutionBody: "<p>Vi skickar från Sverige – leverans till Lyon inom 3–5 arbetsdagar. Fri frakt över €60.</p><p>DUO-kit balanserar huden genom säsongerna. TA-DA Serum ger fukt. Au Naturel rengör bort föroreningar.</p>",
      faq: [
        { q: "Levererar ni till Lyon?", a: "Ja, 3–5 arbetsdagar. Fri frakt över €60." },
        { q: "Är CBD lagligt i Frankrike?", a: "Ja, CBD i hudvård är lagligt i Frankrike sedan 2022." },
        { q: "Vilken produkt för Lyons klimat?", a: "DUO-kit som bas, anpassa säsongsvis." },
        { q: "Hur lång tid tar leveransen?", a: "3–5 arbetsdagar." }
      ],
      ctaTitle: "Ge din hud det Lyon kräver",
      ctaSub: "Naturlig CBD-hudvård från Sverige till Lyon. Fri frakt över €60."
    },
    en: {
      metaTitle: "Skincare Lyon – CBD skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Lyon. Order online with free shipping over €60. Protect your skin from Lyon's continental climate and Rhône Valley pollution.",
      kicker: "Skincare in Lyon",
      h1: "Natural skincare for Lyon",
      lead: "Lyon – France's gastronomic capital with a continental climate that challenges the skin. Cold winters, hot summers, and Rhône Valley pollution. Free shipping over €60.",
      problemTitle: "What Lyon does to your skin",
      problemBody: "<p>Lyon has a semi-continental climate – colder winters and warmer summers than Paris. The Rhône Valley can trap pollution during inversions, especially in winter. Summers regularly reach thirty-five degrees with high humidity. The city wind – le mistral – occasionally blows up through the valley and brutally dehydrates the skin.</p>",
      tipsTitle: "Skincare tips for Lyon residents",
      tips: [
        { title: "Adapt to the season", body: "Lyon has distinct seasons. Lighter moisture in summer, richer oils in winter." },
        { title: "Walk in Parc de la Tête d'Or", body: "Lyon's great urban park with lake and botanical garden." },
        { title: "Lyonnais gastronomy", body: "Lyon's food world gives your skin everything it needs from within." },
        { title: "Protect during mistral", body: "The mistral dehydrates extremely. Extra barrier oil on those days." },
        { title: "Cleanse properly", body: "Rhône Valley pollution demands daily cleansing." }
      ],
      solutionTitle: "CBD skincare delivered to Lyon",
      solutionBody: "<p>We ship from Sweden – delivery to Lyon within 3–5 business days. Free shipping on orders over €60.</p><p>The DUO-kit balances the skin through the seasons. TA-DA Serum provides moisture. Au Naturel cleans away pollution.</p>",
      faq: [
        { q: "Do you ship to Lyon?", a: "Yes, 3–5 business days. Free shipping over €60." },
        { q: "Is CBD legal in France?", a: "Yes, CBD in skincare has been legal in France since 2022." },
        { q: "Which product for Lyon's climate?", a: "DUO-kit as your base, adapt seasonally." },
        { q: "How long does shipping take?", a: "3–5 business days." }
      ],
      ctaTitle: "Give your skin what Lyon demands",
      ctaSub: "Natural CBD skincare from Sweden to Lyon. Free shipping over €60."
    },
    es: {
      metaTitle: "Cuidado de la piel Lyon – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Lyon. Pide online, envío gratis desde 50 €. Protege tu piel del clima continental y la contaminación del valle del Ródano.",
      kicker: "Cuidado de la piel en Lyon",
      h1: "Cosmética natural para Lyon",
      lead: "Lyon – capital gastronómica con inviernos más duros y veranos más calurosos que París, más smog en el valle del Ródano. Envío gratis desde 50 €.",
      problemTitle: "Lo que Lyon le hace a tu piel",
      problemBody: "<p>Clima semicontinental: más frío en invierno y más calor en verano que en París. El valle atrapa la contaminación en inversiones, sobre todo en invierno. Veranos de unos treinta y cinco grados con humedad. A veces sopla el mistral por el valle y seca la piel de golpe.</p>",
      tipsTitle: "Consejos para quien vive en Lyon",
      tips: [
        { title: "Rutina según estación", body: "Verano: texturas ligeras; invierno: aceites más ricos." },
        { title: "Parc de la Tête d'Or", body: "Lago, jardín botánico – oxígeno urbano." },
        { title: "Gastronomía lyonesa", body: "Comer bien aquí es cuidar la piel por dentro." },
        { title: "Con mistral", body: "Viento seco extremo – aceite barrera extra esos días." },
        { title: "Limpieza diaria", body: "El valle deposita suciedad en la piel; limpia cada noche." }
      ],
      solutionTitle: "Cosmética con CBD con entrega en Lyon",
      solutionBody: "<p>Enviamos desde Suecia; 3–5 días laborables hasta Lyon. Envío gratis desde 50 €.</p><p>El DUO-kit equilibra la piel a lo largo del año. TA-DA Serum hidrata. Au Naturel limpia la contaminación.</p>",
      faq: [
        { q: "¿Envían a Lyon?", a: "Sí, 3–5 días laborables. Envío gratis desde 50 €." },
        { q: "¿El CBD es legal en Francia?", a: "Sí, el CBD en cosmética es legal en Francia desde 2022." },
        { q: "¿Qué producto para el clima de Lyon?", a: "DUO-kit como base; adapta texturas según la estación." },
        { q: "¿Plazo de envío?", a: "3–5 días laborables." }
      ],
      ctaTitle: "Dale a tu piel lo que Lyon exige",
      ctaSub: "Cosmética natural con CBD de Suecia a Lyon. Envío gratis desde 50 €."
    },
    de: {
      metaTitle: "Hautpflege Lyon – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für Lyon. Online bestellen, ab 50 € versandkostenfrei. Schutz vor Kontinentalklima und Rhône-Tal-Smog.",
      kicker: "Hautpflege in Lyon",
      h1: "Natürliche Hautpflege für Lyon",
      lead: "Lyon – Frankreichs Gourmet-Hauptstadt: kältere Winter und heißere Sommer als Paris, Smog im Rhône-Tal. Ab 50 € versandkostenfrei.",
      problemTitle: "Was Lyon mit deiner Haut macht",
      problemBody: "<p>Halbkontinentales Klima: Winter kälter, Sommer wärmer als in Paris. Das Tal hält Verschmutzung bei Inversionen, besonders im Winter. Sommer um fünfunddreißig Grad mit Feuchte. Manchmal Mistral durchs Tal – brutal austrocknend.</p>",
      tipsTitle: "Hautpflege-Tipps für Lyon",
      tips: [
        { title: "Saison anpassen", body: "Sommer leichter, Winter reichhaltiger." },
        { title: "Parc de la Tête d'Or", body: "See, Botanik – Stadt-Oase." },
        { title: "Lyoner Küche", body: "Gut essen = Haut von innen versorgen." },
        { title: "Bei Mistral", body: "Trockener Wind – extra Barrier-Öl." },
        { title: "Täglich reinigen", body: "Tal-Smog setzt sich ab – abends waschen." }
      ],
      solutionTitle: "CBD-Hautpflege nach Lyon",
      solutionBody: "<p>Versand aus Schweden – 3–5 Werktage nach Lyon. Ab 50 € versandkostenfrei.</p><p>Das DUO-kit balanciert über die Jahreszeiten. TA-DA Serum spendet Feuchtigkeit. Au Naturel entfernt Schmutz und Abgase.</p>",
      faq: [
        { q: "Liefert ihr nach Lyon?", a: "Ja, 3–5 Werktage. Ab 50 € versandkostenfrei." },
        { q: "Ist CBD in Frankreich legal?", a: "Ja, CBD in Kosmetik ist seit 2022 in Frankreich erlaubt." },
        { q: "Welches Produkt fürs Lyon-Klima?", a: "DUO-kit als Basis, saisonal anpassen." },
        { q: "Wie lange dauert der Versand?", a: "3–5 Werktage." }
      ],
      ctaTitle: "Gib deiner Haut, was Lyon verlangt",
      ctaSub: "Natürliche CBD-Pflege von Schweden nach Lyon. Ab 50 € versandkostenfrei."
    },
    fr: {
      metaTitle: "Soin du visage Lyon – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Lyon. Commande en ligne, livraison offerte dès 50 €. Protège ta peau du climat semi-continental et de la pollution du bassin rhodanien.",
      kicker: "Soins à Lyon",
      h1: "Soins naturels pour Lyon",
      lead: "Lyon – capitale gastronomique avec des hivers plus froids et des étés plus chauds que Paris, et une pollution piégée dans le couloir du Rhône. Livraison offerte dès 50 €.",
      problemTitle: "Ce que Lyon fait à ta peau",
      problemBody: "<p>Climat semi-continental : hivers plus rudes et étés plus torrides qu’à Paris. Le bassin retient la pollution aux inversions, surtout l’hiver. Étés vers trente-cinq degrés avec humidité. Parfois le mistral remonte la vallée et assèche la peau brutalement.</p>",
      tipsTitle: "Conseils peau pour Lyon",
      tips: [
        { title: "Adapter la saison", body: "Été : textures légères ; hiver : huiles plus riches." },
        { title: "Parc de la Tête d'Or", body: "Lac, jardin botanique – poumon vert." },
        { title: "Gastronomie lyonnaise", body: "Bien manger ici, c’est nourrir la peau de l’intérieur." },
        { title: "Sous mistral", body: "Vent sec violent – huile barrière en plus ces jours-là." },
        { title: "Nettoyage quotidien", body: "Le bassin dépose sa couche sur la peau ; nettoie chaque soir." }
      ],
      solutionTitle: "Soins au CBD livrés à Lyon",
      solutionBody: "<p>Expédition depuis la Suède ; 3–5 jours ouvrés jusqu’à Lyon. Livraison offerte dès 50 €.</p><p>Le DUO-kit équilibre la peau au fil des saisons. TA-DA Serum hydrate. Au Naturel enlève la pollution.</p>",
      faq: [
        { q: "Livrez-vous à Lyon ?", a: "Oui, 3–5 jours ouvrés. Livraison offerte dès 50 €." },
        { q: "Le CBD est-il légal en France ?", a: "Oui, le CBD en cosmétique est légal en France depuis 2022." },
        { q: "Quel produit pour le climat de Lyon ?", a: "DUO-kit comme base ; adapte les textures selon la saison." },
        { q: "Délai de livraison ?", a: "3–5 jours ouvrés." }
      ],
      ctaTitle: "Offre à ta peau ce que Lyon exige",
      ctaSub: "Soins naturels au CBD de la Suède à Lyon. Livraison offerte dès 50 €."
    }
  },
  // ──────────────────────────────────────────────
  // ADDITIONAL SOUTHERN EUROPE
  // ──────────────────────────────────────────────
  {
    svSlug: "hudvard-valencia",
    enSlug: "skincare-valencia",
    esSlug: "cuidado-piel-cbd-valencia",
    deSlug: "cbd-hautpflege-valencia",
    frSlug: "soin-peau-cbd-valencia",
    category: "stad",
    productIds: ["duo-kit", "au-naturel-makeup-remover", "ta-da-serum"],
    sv: {
      metaTitle: "Hudvård Valencia – CBD-hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i Valencia. Beställ online med fri frakt över €60. Skydda din hud mot medelhavssolen och havsfukten.",
      kicker: "Hudvård i Valencia",
      h1: "Naturlig hudvård för dig i Valencia",
      lead: "Valencia – sol, paella och Medelhavet. Intensiv UV-strålning, havssalt och hög luftfuktighet utmanar din hud. Fri frakt över €60.",
      problemTitle: "Valenciahudens utmaningar",
      problemBody: "<p>Valencia har över 2600 soltimmar per år och ett varmt medelhavsklimat. UV-strålningen är intensiv, och kombinationen av sol och havssalt torkar ut huden effektivt. Somrarna är heta och fuktiga, vintrarna milda. Luftkonditionering inomhus skapar ytterligare uttorkning.</p>",
      tipsTitle: "Hudvårdstips för valenciabor",
      tips: [
        { title: "UV-skydd dagligen", body: "Valencias sol är stark nästan hela året." },
        { title: "Promenera i Turia-parken", body: "Den torkade flodbädden är nu en grön park genom hela staden." },
        { title: "Medelhavsmat", body: "Paella, apelsiner, olivolja – Valencia har perfekt hudmat." },
        { title: "Skölj av salt", body: "Efter stranden, skölj huden och applicera olja direkt." },
        { title: "Hydrering", body: "Valencias somrar kräver konstant vätskeintag." }
      ],
      solutionTitle: "CBD-hudvård levererad till Valencia",
      solutionBody: "<p>Vi skickar från Sverige – leverans till Valencia inom 3–5 arbetsdagar. Fri frakt över €60.</p><p>DUO-kit ger antioxidantskydd. Au Naturel rengör bort salt och smuts. TA-DA Serum ger fukt efter solen.</p>",
      faq: [
        { q: "Levererar ni till Valencia?", a: "Ja, 3–5 arbetsdagar. Fri frakt över €60." },
        { q: "Är CBD lagligt i Spanien?", a: "Ja, CBD i hudvård är lagligt." },
        { q: "Vilken produkt för sol och hav?", a: "DUO-kit dagligen, TA-DA Serum för extra fukt." },
        { q: "Hur lång tid tar leveransen?", a: "3–5 arbetsdagar." }
      ],
      ctaTitle: "Ge din hud det Valencia kräver",
      ctaSub: "Naturlig CBD-hudvård från Sverige till Valencia. Fri frakt över €60."
    },
    en: {
      metaTitle: "Skincare Valencia – CBD skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Valencia. Order online with free shipping over €60. Protect your skin from Mediterranean sun and sea salt.",
      kicker: "Skincare in Valencia",
      h1: "Natural skincare for Valencia",
      lead: "Valencia – sun, paella, and the Mediterranean. Intense UV radiation, sea salt, and high humidity challenge your skin. Free shipping over €60.",
      problemTitle: "What Valencia does to your skin",
      problemBody: "<p>Valencia gets over 2,600 sunshine hours per year with a warm Mediterranean climate. UV radiation is intense, and the combination of sun and sea salt effectively dehydrates the skin. Summers are hot and humid, winters mild. Air conditioning indoors creates additional dehydration.</p>",
      tipsTitle: "Skincare tips for Valencia residents",
      tips: [
        { title: "UV protection daily", body: "Valencia's sun is strong almost year-round." },
        { title: "Walk in the Turia Gardens", body: "The dried riverbed is now a green park running through the entire city." },
        { title: "Mediterranean diet", body: "Paella, oranges, olive oil – Valencia has perfect skin food." },
        { title: "Rinse off the salt", body: "After the beach, rinse your skin and apply oil immediately." },
        { title: "Hydration", body: "Valencia's summers demand constant fluid intake." }
      ],
      solutionTitle: "CBD skincare delivered to Valencia",
      solutionBody: "<p>We ship from Sweden – delivery to Valencia within 3–5 business days. Free shipping on orders over €60.</p><p>The DUO-kit provides antioxidant protection. Au Naturel cleans away salt and grime. TA-DA Serum provides moisture after the sun.</p>",
      faq: [
        { q: "Do you ship to Valencia?", a: "Yes, 3–5 business days. Free shipping over €60." },
        { q: "Is CBD legal in Spain?", a: "Yes, CBD in skincare is legal." },
        { q: "Which product for sun and sea?", a: "DUO-kit daily, TA-DA Serum for extra moisture." },
        { q: "How long does shipping take?", a: "3–5 business days." }
      ],
      ctaTitle: "Give your skin what Valencia demands",
      ctaSub: "Natural CBD skincare from Sweden to Valencia. Free shipping over €60."
    },
    es: {
      metaTitle: "Cuidado de la piel Valencia – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Valencia. Pide online, envío gratis desde 50 €. Protege tu piel del sol mediterráneo y la sal marina.",
      kicker: "Cuidado de la piel en Valencia",
      h1: "Cosmética natural para Valencia",
      lead: "Valencia – sol, paella y Mediterráneo. UV fuerte, sal y humedad alta. Envío gratis desde 50 €.",
      problemTitle: "Lo que Valencia le hace a tu piel",
      problemBody: "<p>Más de 2.600 horas de sol al año; clima mediterráneo cálido. Sol + sal deshidratan en equipo. Veranos calurosos y húmedos; inviernos suaves. El aire acondicionado en casa seca de más.</p>",
      tipsTitle: "Consejos para quien vive en Valencia",
      tips: [
        { title: "Protección UV diaria", body: "El sol aquí no hace vacaciones casi nunca." },
        { title: "Jardín del Turia", body: "Antiguo cauce convertido en parque verde urbano." },
        { title: "Dieta mediterránea", body: "Paella, naranjas, aceite de oliva – piel agradecida." },
        { title: "Enjuaga la sal", body: "Tras la playa: agua dulce y aceite al momento." },
        { title: "Hidratación", body: "En verano, beber sin parar." }
      ],
      solutionTitle: "Cosmética con CBD con entrega en Valencia",
      solutionBody: "<p>Enviamos desde Suecia; 3–5 días laborables hasta Valencia. Envío gratis desde 50 €.</p><p>El DUO-kit aporta antioxidantes. Au Naturel limpia sal y suciedad. TA-DA Serum recupera humedad tras el sol.</p>",
      faq: [
        { q: "¿Envían a Valencia?", a: "Sí, 3–5 días laborables. Envío gratis desde 50 €." },
        { q: "¿El CBD es legal en España?", a: "Sí, el CBD en cosmética es legal." },
        { q: "¿Qué producto para sol y mar?", a: "DUO-kit a diario; TA-DA Serum para hidratación extra." },
        { q: "¿Plazo de envío?", a: "3–5 días laborables." }
      ],
      ctaTitle: "Dale a tu piel lo que Valencia exige",
      ctaSub: "Cosmética natural con CBD de Suecia a Valencia. Envío gratis desde 50 €."
    },
    de: {
      metaTitle: "Hautpflege Valencia – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für Valencia. Online bestellen, ab 50 € versandkostenfrei. Schutz vor Mittelmeersonne und Meersalz.",
      kicker: "Hautpflege in Valencia",
      h1: "Natürliche Hautpflege für Valencia",
      lead: "Valencia – Sonne, Paella, Mittelmeer. Starkes UV, Salz, hohe Feuchte. Ab 50 € versandkostenfrei.",
      problemTitle: "Was Valencia mit deiner Haut macht",
      problemBody: "<p>Über 2.600 Sonnenstunden, warmes Mittelmeerklima. Sonne plus Salz entwässern gemeinsam. Heiße, feuchte Sommer, milde Winter. Klimaanlage trocknet drinnen zusätzlich.</p>",
      tipsTitle: "Hautpflege-Tipps für Valencia",
      tips: [
        { title: "Täglich UV-Schutz", body: "Die Sonne macht hier kaum Pause." },
        { title: "Turia-Gärten", body: "Ehemaliges Flussbett – grüner Stadtpark." },
        { title: "Mittelmeerkost", body: "Paella, Orangen, Olivenöl – top für die Haut." },
        { title: "Salz abspülen", body: "Nach dem Strand sofort Süßwasser, dann Öl." },
        { title: "Trinken", body: "Sommer braucht konstante Flüssigkeit." }
      ],
      solutionTitle: "CBD-Hautpflege nach Valencia",
      solutionBody: "<p>Versand aus Schweden – 3–5 Werktage nach Valencia. Ab 50 € versandkostenfrei.</p><p>Das DUO-kit liefert antioxidativen Schutz. Au Naturel entfernt Salz und Schmutz. TA-DA Serum spendet nach der Sonne.</p>",
      faq: [
        { q: "Liefert ihr nach Valencia?", a: "Ja, 3–5 Werktage. Ab 50 € versandkostenfrei." },
        { q: "Ist CBD in Spanien legal?", a: "Ja, CBD in Kosmetik ist legal." },
        { q: "Welches Produkt für Sonne und Meer?", a: "DUO-kit täglich, TA-DA Serum für extra Feuchtigkeit." },
        { q: "Wie lange dauert der Versand?", a: "3–5 Werktage." }
      ],
      ctaTitle: "Gib deiner Haut, was Valencia verlangt",
      ctaSub: "Natürliche CBD-Pflege von Schweden nach Valencia. Ab 50 € versandkostenfrei."
    },
    fr: {
      metaTitle: "Soin du visage Valence – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Valence. Commande en ligne, livraison offerte dès 50 €. Protège ta peau du soleil méditerranéen et du sel marin.",
      kicker: "Soins à Valence",
      h1: "Soins naturels pour Valence",
      lead: "Valence – soleil, paella et Méditerranée. UV intense, sel et humidité élevée. Livraison offerte dès 50 €.",
      problemTitle: "Ce que Valence fait à ta peau",
      problemBody: "<p>Plus de 2 600 heures de soleil par an ; climat méditerranéen chaud. Soleil + sel déshydratent ensemble. Étés chauds et humides ; hivers doux. La clim à l’intérieur assèche encore.</p>",
      tipsTitle: "Conseils peau pour Valence",
      tips: [
        { title: "UV quotidien", body: "Le soleil ne prend presque jamais de congé ici." },
        { title: "Jardins du Turia", body: "L’ancien lit de rivière est devenu un parc vert." },
        { title: "Régime méditerranéen", body: "Paella, oranges, huile d’olive – la peau dit merci." },
        { title: "Rincer le sel", body: "Après la plage : eau douce puis huile tout de suite." },
        { title: "Hydratation", body: "Les étés exigent de boire sans arrêt." }
      ],
      solutionTitle: "Soins au CBD livrés à Valence",
      solutionBody: "<p>Expédition depuis la Suède ; 3–5 jours ouvrés jusqu’à Valence. Livraison offerte dès 50 €.</p><p>Le DUO-kit apporte des antioxydants. Au Naturel enlève sel et saleté. TA-DA Serum réhydrate après le soleil.</p>",
      faq: [
        { q: "Livrez-vous à Valence ?", a: "Oui, 3–5 jours ouvrés. Livraison offerte dès 50 €." },
        { q: "Le CBD est-il légal en Espagne ?", a: "Oui, le CBD en cosmétique est légal." },
        { q: "Quel produit pour soleil et mer ?", a: "DUO-kit au quotidien ; TA-DA Serum pour plus d’hydratation." },
        { q: "Délai de livraison ?", a: "3–5 jours ouvrés." }
      ],
      ctaTitle: "Offre à ta peau ce que Valence exige",
      ctaSub: "Soins naturels au CBD de la Suède à Valence. Livraison offerte dès 50 €."
    }
  },
  {
    svSlug: "hudvard-porto",
    enSlug: "skincare-porto",
    esSlug: "cuidado-piel-cbd-porto",
    deSlug: "cbd-hautpflege-porto",
    frSlug: "soin-peau-cbd-porto",
    category: "stad",
    productIds: ["duo-kit", "ta-da-serum", "fungtastic-mushroom-extract"],
    sv: {
      metaTitle: "Hudvård Porto – CBD-hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i Porto. Beställ online med fri frakt över €60. Skydda din hud mot Atlantvinden och portugisisk sol.",
      kicker: "Hudvård i Porto",
      h1: "Naturlig hudvård för dig i Porto",
      lead: "Porto – portvin, Atlanten och azulejos. Atlantvinden och UV-strålningen utmanar din hud dagligen. Fri frakt över €60.",
      problemTitle: "Portohudens utmaningar",
      problemBody: "<p>Porto ligger vid Atlantkusten med ett mildare, fuktigare klimat än Lissabon. Atlantvinden är konstant och bär salt som torkar ut huden. Vintrarna är regniga och milda, somrarna varma men sällan extrema. UV-strålningen är ändå stark tack vare Portos sydliga läge.</p>",
      tipsTitle: "Hudvårdstips för portobor",
      tips: [
        { title: "Vindskydd vid havet", body: "Atlantvinden längs Foz-området torkar ut. Barriärolja före strandpromenader." },
        { title: "Promenera längs Douro", body: "Flodpromenaden ger frisk luft och fantastisk utsikt." },
        { title: "Portugisisk fisk", body: "Sardiner och bacalhau ger omega-3 i överflöd." },
        { title: "UV-skydd", body: "Stark sol även i Porto. Dagligt skydd." },
        { title: "Portvin med måtta", body: "Resveratrol i rött vin ger antioxidanter. Lagom mängd." }
      ],
      solutionTitle: "CBD-hudvård levererad till Porto",
      solutionBody: "<p>Vi skickar från Sverige – leverans till Porto inom 3–5 arbetsdagar. Fri frakt över €60.</p><p>DUO-kit stärker barriären mot vind och salt. TA-DA Serum ger fukt. Fungtastic stödjer immunförsvaret.</p>",
      faq: [
        { q: "Levererar ni till Porto?", a: "Ja, 3–5 arbetsdagar. Fri frakt över €60." },
        { q: "Är CBD lagligt i Portugal?", a: "Ja, CBD i hudvård är lagligt." },
        { q: "Vilken produkt för Portos klimat?", a: "DUO-kit som bas, TA-DA Serum för extra fukt." },
        { q: "Hur lång tid tar leveransen?", a: "3–5 arbetsdagar." }
      ],
      ctaTitle: "Ge din hud det Porto kräver",
      ctaSub: "Naturlig CBD-hudvård från Sverige till Porto. Fri frakt över €60."
    },
    en: {
      metaTitle: "Skincare Porto – CBD skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Porto. Order online with free shipping over €60. Protect your skin from Atlantic winds and Portuguese sun.",
      kicker: "Skincare in Porto",
      h1: "Natural skincare for Porto",
      lead: "Porto – port wine, the Atlantic, and azulejos. Atlantic wind and UV radiation challenge your skin daily. Free shipping over €60.",
      problemTitle: "What Porto does to your skin",
      problemBody: "<p>Porto sits on the Atlantic coast with a milder, more humid climate than Lisbon. The Atlantic wind is constant and carries salt that dries out the skin. Winters are rainy and mild, summers warm but rarely extreme. UV radiation is still strong thanks to Porto's southern location.</p>",
      tipsTitle: "Skincare tips for Porto residents",
      tips: [
        { title: "Wind protection by the sea", body: "The Atlantic wind along the Foz area dehydrates. Barrier oil before beach walks." },
        { title: "Walk along the Douro", body: "The river promenade offers fresh air and fantastic views." },
        { title: "Portuguese fish", body: "Sardines and bacalhau provide abundant omega-3s." },
        { title: "UV protection", body: "Strong sun even in Porto. Daily protection." },
        { title: "Port wine in moderation", body: "Resveratrol in red wine provides antioxidants. In moderation." }
      ],
      solutionTitle: "CBD skincare delivered to Porto",
      solutionBody: "<p>We ship from Sweden – delivery to Porto within 3–5 business days. Free shipping on orders over €60.</p><p>The DUO-kit strengthens the barrier against wind and salt. TA-DA Serum provides moisture. Fungtastic supports immunity.</p>",
      faq: [
        { q: "Do you ship to Porto?", a: "Yes, 3–5 business days. Free shipping over €60." },
        { q: "Is CBD legal in Portugal?", a: "Yes, CBD in skincare is legal." },
        { q: "Which product for Porto's climate?", a: "DUO-kit as your base, TA-DA Serum for extra moisture." },
        { q: "How long does shipping take?", a: "3–5 business days." }
      ],
      ctaTitle: "Give your skin what Porto demands",
      ctaSub: "Natural CBD skincare from Sweden to Porto. Free shipping over €60."
    },
    es: {
      metaTitle: "Cuidado de la piel Oporto – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Oporto. Pide online, envío gratis desde 50 €. Protege tu piel del viento atlántico y el sol portugués.",
      kicker: "Cuidado de la piel en Oporto",
      h1: "Cosmética natural para Oporto",
      lead: "Oporto – vino de Oporto, Atlántico y azulejos. Brisa oceánica y UV constantes. Envío gratis desde 50 €.",
      problemTitle: "Lo que Oporto le hace a tu piel",
      problemBody: "<p>Costa atlántica: más húmedo y suave que Lisboa, pero el viento no para y lleva sal que reseca. Inviernos lluviosos; veranos templados. El UV sigue siendo fuerte por la latitud.</p>",
      tipsTitle: "Consejos para quien vive en Oporto",
      tips: [
        { title: "Protección en el mar", body: "En Foz el viento seca – aceite barrera antes de pasear." },
        { title: "Paseo por el Duero", body: "Aire y vistas junto al río." },
        { title: "Pescado portugués", body: "Sardinas y bacalao – omega-3 a raudales." },
        { title: "Protección UV", body: "Sol fuerte incluso con cielo nublado. Protégete a diario." },
        { title: "Oporto con mesura", body: "Resveratrol en el tinto – un vaso, no la botella." }
      ],
      solutionTitle: "Cosmética con CBD con entrega en Oporto",
      solutionBody: "<p>Enviamos desde Suecia; 3–5 días laborables hasta Oporto. Envío gratis desde 50 €.</p><p>El DUO-kit refuerza la barrera frente a viento y sal. TA-DA Serum hidrata. Fungtastic Mushroom Extract apoya la inmunidad.</p>",
      faq: [
        { q: "¿Envían a Oporto?", a: "Sí, 3–5 días laborables. Envío gratis desde 50 €." },
        { q: "¿El CBD es legal en Portugal?", a: "Sí, el CBD en cosmética es legal." },
        { q: "¿Qué producto para el clima de Oporto?", a: "DUO-kit como base; TA-DA Serum para más humedad." },
        { q: "¿Plazo de envío?", a: "3–5 días laborables." }
      ],
      ctaTitle: "Dale a tu piel lo que Oporto exige",
      ctaSub: "Cosmética natural con CBD de Suecia a Oporto. Envío gratis desde 50 €."
    },
    de: {
      metaTitle: "Hautpflege Porto – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für Porto. Online bestellen, ab 50 € versandkostenfrei. Schutz vor Atlantikwind und portugiesischer Sonne.",
      kicker: "Hautpflege in Porto",
      h1: "Natürliche Hautpflege für Porto",
      lead: "Porto – Portwein, Atlantik, Azulejos. Ozeanwind und UV fordern täglich. Ab 50 € versandkostenfrei.",
      problemTitle: "Was Porto mit deiner Haut macht",
      problemBody: "<p>Atlantikküste: feuchter und milder als Lissabon, aber Wind und Salz trocknen aus. Regenreiche Winter, warme, selten extreme Sommer. UV bleibt wegen der Breite stark.</p>",
      tipsTitle: "Hautpflege-Tipps für Porto",
      tips: [
        { title: "Schutz am Meer", body: "Wind in Foz entwässert – Barrier-Öl vor Spaziergängen." },
        { title: "Douro-Promenade", body: "Frische Luft, tolle Aussicht." },
        { title: "Portugiesischer Fisch", body: "Sardinen, Bacalhau – Omega-3 pur." },
        { title: "UV-Schutz", body: "Starke Sonne auch bei Wolken. Täglich." },
        { title: "Portwein maßvoll", body: "Resveratrol im Rotwein – ein Glas reicht." }
      ],
      solutionTitle: "CBD-Hautpflege nach Porto",
      solutionBody: "<p>Versand aus Schweden – 3–5 Werktage nach Porto. Ab 50 € versandkostenfrei.</p><p>Das DUO-kit stärkt die Barriere gegen Wind und Salz. TA-DA Serum spendet Feuchtigkeit. Fungtastic Mushroom Extract unterstützt die Immunität.</p>",
      faq: [
        { q: "Liefert ihr nach Porto?", a: "Ja, 3–5 Werktage. Ab 50 € versandkostenfrei." },
        { q: "Ist CBD in Portugal legal?", a: "Ja, CBD in Kosmetik ist legal." },
        { q: "Welches Produkt fürs Porto-Klima?", a: "DUO-kit als Basis, TA-DA Serum für extra Feuchtigkeit." },
        { q: "Wie lange dauert der Versand?", a: "3–5 Werktage." }
      ],
      ctaTitle: "Gib deiner Haut, was Porto verlangt",
      ctaSub: "Natürliche CBD-Pflege von Schweden nach Porto. Ab 50 € versandkostenfrei."
    },
    fr: {
      metaTitle: "Soin du visage Porto – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Porto. Commande en ligne, livraison offerte dès 50 €. Protège ta peau des vents atlantiques et du soleil portugais.",
      kicker: "Soins à Porto",
      h1: "Soins naturels pour Porto",
      lead: "Porto – porto, Atlantique et azulejos. Vent océanique et UV au quotidien. Livraison offerte dès 50 €.",
      problemTitle: "Ce que Porto fait à ta peau",
      problemBody: "<p>Côte atlantique : plus humide et doux qu’à Lisbonne, mais le vent charrie du sel qui assèche. Hivers pluvieux ; étés chauds sans extrêmes. L’UV reste fort à cette latitude.</p>",
      tipsTitle: "Conseils peau pour Porto",
      tips: [
        { title: "Protection au bord de l’eau", body: "Le vent à Foz déshydrate – huile barrière avant les balades." },
        { title: "Promenade du Douro", body: "Air frais et panorama." },
        { title: "Poisson portugais", body: "Sardines, bacalhau – oméga-3 à gogo." },
        { title: "Protection UV", body: "Soleil fort même sous nuages. Chaque jour." },
        { title: "Porto avec mesure", body: "Resvératrol dans le rouge – une dose raisonnable." }
      ],
      solutionTitle: "Soins au CBD livrés à Porto",
      solutionBody: "<p>Expédition depuis la Suède ; 3–5 jours ouvrés jusqu’à Porto. Livraison offerte dès 50 €.</p><p>Le DUO-kit renforce la barrière face au vent et au sel. TA-DA Serum hydrate. Fungtastic Mushroom Extract soutient l’immunité.</p>",
      faq: [
        { q: "Livrez-vous à Porto ?", a: "Oui, 3–5 jours ouvrés. Livraison offerte dès 50 €." },
        { q: "Le CBD est-il légal au Portugal ?", a: "Oui, le CBD en cosmétique est légal." },
        { q: "Quel produit pour le climat de Porto ?", a: "DUO-kit comme base ; TA-DA Serum pour plus d’hydratation." },
        { q: "Délai de livraison ?", a: "3–5 jours ouvrés." }
      ],
      ctaTitle: "Offre à ta peau ce que Porto exige",
      ctaSub: "Soins naturels au CBD de la Suède à Porto. Livraison offerte dès 50 €."
    }
  },
  {
    svSlug: "hudvard-florens",
    enSlug: "skincare-florence",
    esSlug: "cuidado-piel-cbd-florence",
    deSlug: "cbd-hautpflege-florence",
    frSlug: "soin-peau-cbd-florence",
    category: "stad",
    productIds: ["duo-kit", "au-naturel-makeup-remover", "ta-da-serum"],
    sv: {
      metaTitle: "Hudvård Florens – CBD-hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i Florens. Beställ online med fri frakt över €60. Skydda din hud mot toskansk sol och stadsvärme.",
      kicker: "Hudvård i Florens",
      h1: "Naturlig hudvård för dig i Florens",
      lead: "Florens – Renässansens vagga med ett klimat som utmanar huden. Het sommar i Arno-dalen, kall vinter och stadsföroreningar. Fri frakt över €60.",
      problemTitle: "Florenshudens utmaningar",
      problemBody: "<p>Florens ligger i en dal omgiven av kullar – vackert men det fångar värmen på sommaren. Temperaturer över fyrtio grader är vanliga juli–augusti. Vintrarna är kalla och fuktiga med dimma. Arno-dalens geografi fångar föroreningar under inversioner.</p>",
      tipsTitle: "Hudvårdstips för florensbor",
      tips: [
        { title: "Undvik sommarvärmen", body: "Sommarhettan i Florens är brutal. UV-skydd och skugga." },
        { title: "Promenera i Boboli-trädgården", body: "Skuggiga gångar och renässanskonst – bra för sinne och hud." },
        { title: "Toskansk olivolja", body: "Bland världens bästa. Generöst i maten." },
        { title: "Rengör efter stadspromenader", body: "Florens föroreningar kräver daglig rengöring." },
        { title: "Drick vatten", body: "Florens fontäner ger gratis rent vatten. Utnyttja dem." }
      ],
      solutionTitle: "CBD-hudvård levererad till Florens",
      solutionBody: "<p>Vi skickar från Sverige – leverans till Florens inom 3–5 arbetsdagar. Fri frakt över €60.</p><p>DUO-kit ger antioxidantskydd. Au Naturel rengör bort föroreningar. TA-DA Serum ger fukt.</p>",
      faq: [
        { q: "Levererar ni till Florens?", a: "Ja, 3–5 arbetsdagar. Fri frakt över €60." },
        { q: "Är CBD lagligt i Italien?", a: "Ja, CBD i hudvård är lagligt." },
        { q: "Vilken produkt för Florens?", a: "DUO-kit dagligen, Au Naturel för rengöring." },
        { q: "Hur lång tid tar leveransen?", a: "3–5 arbetsdagar." }
      ],
      ctaTitle: "Ge din hud det Florens kräver",
      ctaSub: "Naturlig CBD-hudvård från Sverige till Florens. Fri frakt över €60."
    },
    en: {
      metaTitle: "Skincare Florence – CBD skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Florence. Order online with free shipping over €60. Protect your skin from Tuscan sun and Arno Valley heat.",
      kicker: "Skincare in Florence",
      h1: "Natural skincare for Florence",
      lead: "Florence – cradle of the Renaissance with a climate that challenges the skin. Hot Arno Valley summers, cold winters, and urban pollution. Free shipping over €60.",
      problemTitle: "What Florence does to your skin",
      problemBody: "<p>Florence sits in a valley surrounded by hills – beautiful but it traps heat in summer. Temperatures above forty degrees are common in July and August. Winters are cold and damp with fog. The Arno Valley geography traps pollution during inversions.</p>",
      tipsTitle: "Skincare tips for Florence residents",
      tips: [
        { title: "Avoid the summer heat", body: "Summer heat in Florence is brutal. UV protection and shade." },
        { title: "Walk in the Boboli Gardens", body: "Shaded paths and Renaissance art – good for mind and skin." },
        { title: "Tuscan olive oil", body: "Among the world's best. Use it generously in food." },
        { title: "Cleanse after city walks", body: "Florence's pollution demands daily cleansing." },
        { title: "Drink water", body: "Florence's fountains provide free clean water. Use them." }
      ],
      solutionTitle: "CBD skincare delivered to Florence",
      solutionBody: "<p>We ship from Sweden – delivery to Florence within 3–5 business days. Free shipping on orders over €60.</p><p>The DUO-kit provides antioxidant protection. Au Naturel cleans away pollution. TA-DA Serum provides moisture.</p>",
      faq: [
        { q: "Do you ship to Florence?", a: "Yes, 3–5 business days. Free shipping over €60." },
        { q: "Is CBD legal in Italy?", a: "Yes, CBD in skincare is legal." },
        { q: "Which product for Florence?", a: "DUO-kit daily, Au Naturel for cleansing." },
        { q: "How long does shipping take?", a: "3–5 business days." }
      ],
      ctaTitle: "Give your skin what Florence demands",
      ctaSub: "Natural CBD skincare from Sweden to Florence. Free shipping over €60."
    },
    es: {
      metaTitle: "Cuidado de la piel Florencia – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Florencia. Pide online, envío gratis desde 50 €. Protege tu piel del sol toscano y el calor del valle del Arno.",
      kicker: "Cuidado de la piel en Florencia",
      h1: "Cosmética natural para Florencia",
      lead: "Florencia – cuna del Renacimiento: calor de valle en verano, inviernos fríos y niebla, contaminación urbana. Envío gratis desde 50 €.",
      problemTitle: "Lo que Florencia le hace a tu piel",
      problemBody: "<p>Valle rodeado de colinas: el calor se acumula en julio y agosto – más de cuarenta es habitual. Inviernos fríos y húmedos con niebla. La geografía atrapa la contaminación en inversiones.</p>",
      tipsTitle: "Consejos para quien vive en Florencia",
      tips: [
        { title: "Esquiva el calor extremo", body: "Julio–agosto castigan: UV y sombra obligatorios." },
        { title: "Jardines de Boboli", body: "Sombra, arte renacentista – descanso para piel y cabeza." },
        { title: "Aceite de oliva toscano", body: "De los mejores del mundo – úsalo generoso en la cocina." },
        { title: "Limpia tras salir", body: "La ciudad deja residuos en la piel; limpieza nocturna." },
        { title: "Agua de las fontanas", body: "Agua potable gratis – hidrátate caminando." }
      ],
      solutionTitle: "Cosmética con CBD con entrega en Florencia",
      solutionBody: "<p>Enviamos desde Suecia; 3–5 días laborables hasta Florencia. Envío gratis desde 50 €.</p><p>El DUO-kit aporta antioxidantes. Au Naturel limpia la contaminación. TA-DA Serum hidrata.</p>",
      faq: [
        { q: "¿Envían a Florencia?", a: "Sí, 3–5 días laborables. Envío gratis desde 50 €." },
        { q: "¿El CBD es legal en Italia?", a: "Sí, el CBD en cosmética es legal." },
        { q: "¿Qué producto para Florencia?", a: "DUO-kit a diario; Au Naturel para limpiar." },
        { q: "¿Plazo de envío?", a: "3–5 días laborables." }
      ],
      ctaTitle: "Dale a tu piel lo que Florencia exige",
      ctaSub: "Cosmética natural con CBD de Suecia a Florencia. Envío gratis desde 50 €."
    },
    de: {
      metaTitle: "Hautpflege Florenz – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für Florenz. Online bestellen, ab 50 € versandkostenfrei. Schutz vor toskanischer Sonne und Arno-Tal-Hitze.",
      kicker: "Hautpflege in Florenz",
      h1: "Natürliche Hautpflege für Florenz",
      lead: "Florenz – Wiege der Renaissance: Talhitze im Sommer, kalte, neblige Winter, Stadt-Smog. Ab 50 € versandkostenfrei.",
      problemTitle: "Was Florenz mit deiner Haut macht",
      problemBody: "<p>Tal zwischen Hügeln – Sommerhitze stapelt sich, Juli/August oft über vierzig Grad. Kalte, feuchte Winter mit Nebel. Geografie fängt Smog bei Inversionen.</p>",
      tipsTitle: "Hautpflege-Tipps für Florenz",
      tips: [
        { title: "Extremhitze meiden", body: "Juli/August brutal – UV und Schatten." },
        { title: "Boboli-Gärten", body: "Schatten, Renaissance – Ruhe für Haut und Kopf." },
        { title: "Toskanisches Olivenöl", body: "Weltklasse – großzügig in der Küche." },
        { title: "Nach Stadtgang reinigen", body: "Stadt setzt Rückstände – abends reinigen." },
        { title: "Brunnenwasser", body: "Kostenloses Trinkwasser – beim Gehen trinken." }
      ],
      solutionTitle: "CBD-Hautpflege nach Florenz",
      solutionBody: "<p>Versand aus Schweden – 3–5 Werktage nach Florenz. Ab 50 € versandkostenfrei.</p><p>Das DUO-kit liefert antioxidativen Schutz. Au Naturel entfernt Smog. TA-DA Serum spendet Feuchtigkeit.</p>",
      faq: [
        { q: "Liefert ihr nach Florenz?", a: "Ja, 3–5 Werktage. Ab 50 € versandkostenfrei." },
        { q: "Ist CBD in Italien legal?", a: "Ja, CBD in Kosmetik ist legal." },
        { q: "Welches Produkt für Florenz?", a: "DUO-kit täglich, Au Naturel zur Reinigung." },
        { q: "Wie lange dauert der Versand?", a: "3–5 Werktage." }
      ],
      ctaTitle: "Gib deiner Haut, was Florenz verlangt",
      ctaSub: "Natürliche CBD-Pflege von Schweden nach Florenz. Ab 50 € versandkostenfrei."
    },
    fr: {
      metaTitle: "Soin du visage Florence – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Florence. Commande en ligne, livraison offerte dès 50 €. Protège ta peau du soleil toscan et de la chaleur du val d’Arno.",
      kicker: "Soins à Florence",
      h1: "Soins naturels pour Florence",
      lead: "Florence – berceau de la Renaissance : chaleur de cuvette l’été, hivers froids et brume, pollution urbaine. Livraison offerte dès 50 €.",
      problemTitle: "Ce que Florence fait à ta peau",
      problemBody: "<p>Vallée entourée de collines : la chaleur s’accumule en juillet–août, souvent au-dessus de quarante degrés. Hivers froids et humides avec brouillard. La cuvette retient la pollution aux inversions.</p>",
      tipsTitle: "Conseils peau pour Florence",
      tips: [
        { title: "Éviter la canicule", body: "Juillet–août : UV et ombre obligatoires." },
        { title: "Jardins de Boboli", body: "Ombre, art de la Renaissance – pause peau et esprit." },
        { title: "Huile d’olive toscane", body: "Parmi les meilleures – généreuse dans l’assiette." },
        { title: "Nettoie après la ville", body: "La ville laisse une couche – nettoyage le soir." },
        { title: "Eau des fontaines", body: "Potable et gratuite – bois en marchant." }
      ],
      solutionTitle: "Soins au CBD livrés à Florence",
      solutionBody: "<p>Expédition depuis la Suède ; 3–5 jours ouvrés jusqu’à Florence. Livraison offerte dès 50 €.</p><p>Le DUO-kit apporte des antioxydants. Au Naturel enlève la pollution. TA-DA Serum hydrate.</p>",
      faq: [
        { q: "Livrez-vous à Florence ?", a: "Oui, 3–5 jours ouvrés. Livraison offerte dès 50 €." },
        { q: "Le CBD est-il légal en Italie ?", a: "Oui, le CBD en cosmétique est légal." },
        { q: "Quel produit pour Florence ?", a: "DUO-kit au quotidien ; Au Naturel pour nettoyer." },
        { q: "Délai de livraison ?", a: "3–5 jours ouvrés." }
      ],
      ctaTitle: "Offre à ta peau ce que Florence exige",
      ctaSub: "Soins naturels au CBD de la Suède à Florence. Livraison offerte dès 50 €."
    }
  },
  // ──────────────────────────────────────────────
  // ADDITIONAL EASTERN EUROPE
  // ──────────────────────────────────────────────
  {
    svSlug: "hudvard-krakow",
    enSlug: "skincare-krakow",
    esSlug: "cuidado-piel-cbd-krakow",
    deSlug: "cbd-hautpflege-krakow",
    frSlug: "soin-peau-cbd-krakow",
    category: "stad",
    productIds: ["duo-kit", "au-naturel-makeup-remover", "ta-da-serum"],
    sv: {
      metaTitle: "Hudvård Krakow – CBD-hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i Krakow. Beställ online med fri frakt över €60. Skydda din hud mot Krakows smog och kalla vintrar.",
      kicker: "Hudvård i Krakow",
      h1: "Naturlig hudvård för dig i Krakow",
      lead: "Krakow – Polens kulturella hjärta med Europas värsta vintersmog. Kolföroreningar, kalla vintrar och hårt vatten. Fri frakt över €60.",
      problemTitle: "Krakowhudens utmaningar",
      problemBody: "<p>Krakow ligger i Wisła-dalen, omringad av kullar som fångar föroreningar. Under vintern skapar koleldning en av Europas värsta smog-situationer – partikelhalterna kan överstiga WHO:s gränsvärden mångfalt. Vintrarna är kalla, somrarna varma. Krakows vatten är hårt.</p>",
      tipsTitle: "Hudvårdstips för krakowbor",
      tips: [
        { title: "Grundlig rengöring vintertid", body: "Krakows smog kräver dubbelrengöring varje kväll." },
        { title: "Promenera i Planty", body: "Ringparken runt gamla stan ger grönska och renare luft." },
        { title: "Polsk husmanskost", body: "Syrad kål, rödbetor och ägg – bra hudmat." },
        { title: "Barriärolja i kylan", body: "Polska vintrar kräver rik olja." },
        { title: "Wieliczka saltgruva", body: "Det terapeutiska mikroklimet i saltgruvan kan gynna andning och hud." }
      ],
      solutionTitle: "CBD-hudvård levererad till Krakow",
      solutionBody: "<p>Vi skickar från Sverige – leverans till Krakow inom 3–5 arbetsdagar. Fri frakt över €60.</p><p>DUO-kit stärker barriären. Au Naturel rengör bort smog. TA-DA Serum ger fukt i kylan.</p>",
      faq: [
        { q: "Levererar ni till Krakow?", a: "Ja, 3–5 arbetsdagar. Fri frakt över €60." },
        { q: "Är CBD lagligt i Polen?", a: "Ja, CBD i hudvård är lagligt." },
        { q: "Vilken produkt mot smog?", a: "Au Naturel för rengöring, DUO-kit för skydd." },
        { q: "Hur lång tid tar leveransen?", a: "3–5 arbetsdagar." }
      ],
      ctaTitle: "Ge din hud det Krakow kräver",
      ctaSub: "Naturlig CBD-hudvård från Sverige till Krakow. Fri frakt över €60."
    },
    en: {
      metaTitle: "Skincare Krakow – CBD skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Krakow. Order online with free shipping over €60. Protect your skin from Krakow's notorious winter smog and cold.",
      kicker: "Skincare in Krakow",
      h1: "Natural skincare for Krakow",
      lead: "Krakow – Poland's cultural heart with Europe's worst winter smog. Coal pollution, freezing winters, and hard water. Free shipping over €60.",
      problemTitle: "What Krakow does to your skin",
      problemBody: "<p>Krakow sits in the Vistula Valley, surrounded by hills that trap pollution. During winter, coal heating creates one of Europe's worst smog situations – particle levels can exceed WHO limits many times over. Winters are cold, summers warm. Krakow's water is hard.</p>",
      tipsTitle: "Skincare tips for Krakow residents",
      tips: [
        { title: "Thorough cleansing in winter", body: "Krakow's smog demands double cleansing every evening." },
        { title: "Walk in Planty", body: "The ring park around Old Town offers greenery and cleaner air." },
        { title: "Polish home cooking", body: "Sauerkraut, beetroot, and eggs – great skin food." },
        { title: "Barrier oil in the cold", body: "Polish winters demand a rich oil." },
        { title: "Wieliczka salt mine", body: "The therapeutic microclimate in the salt mine can benefit breathing and skin." }
      ],
      solutionTitle: "CBD skincare delivered to Krakow",
      solutionBody: "<p>We ship from Sweden – delivery to Krakow within 3–5 business days. Free shipping on orders over €60.</p><p>The DUO-kit strengthens the barrier. Au Naturel cleans away smog. TA-DA Serum provides moisture in the cold.</p>",
      faq: [
        { q: "Do you ship to Krakow?", a: "Yes, 3–5 business days. Free shipping over €60." },
        { q: "Is CBD legal in Poland?", a: "Yes, CBD in skincare is legal." },
        { q: "Which product against smog?", a: "Au Naturel for cleansing, DUO-kit for protection." },
        { q: "How long does shipping take?", a: "3–5 business days." }
      ],
      ctaTitle: "Give your skin what Krakow demands",
      ctaSub: "Natural CBD skincare from Sweden to Krakow. Free shipping over €60."
    },
    es: {
      metaTitle: "Cuidado de la piel Cracovia – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Cracovia. Pide online, envío gratis desde 50 €. Protege tu piel del smog invernal y el frío polaco.",
      kicker: "Cuidado de la piel en Cracovia",
      h1: "Cosmética natural para Cracovia",
      lead: "Cracovia – corazón cultural de Polonia y uno de los smogs invernales más duros de Europa. Carbón, frío y agua dura. Envío gratis desde 50 €.",
      problemTitle: "Lo que Cracovia le hace a tu piel",
      problemBody: "<p>Valle del Vístula rodeado de colinas: la contaminación queda atrapada. La calefacción con carbón dispara las partículas en invierno – a veces varias veces por encima de los límites de la OMS. Inviernos gélidos; veranos cálidos. Agua dura.</p>",
      tipsTitle: "Consejos para quien vive en Cracovia",
      tips: [
        { title: "Limpieza seria en invierno", body: "Smog nocturno = doble limpieza cada tarde." },
        { title: "Planty", body: "Anillo verde alrededor del casco antiguo – aire algo mejor." },
        { title: "Cocina casera polaca", body: "Chucrut, remolacha, huevos – probióticos y color." },
        { title: "Aceite en el frío", body: "Invierno polaco = aceite graso antes de salir." },
        { title: "Mina de sal de Wieliczka", body: "Microclima salino que algunos notan en piel y respiración." }
      ],
      solutionTitle: "Cosmética con CBD con entrega en Cracovia",
      solutionBody: "<p>Enviamos desde Suecia; 3–5 días laborables hasta Cracovia. Envío gratis desde 50 €.</p><p>El DUO-kit refuerza la barrera. Au Naturel limpia el smog. TA-DA Serum hidrata en el frío.</p>",
      faq: [
        { q: "¿Envían a Cracovia?", a: "Sí, 3–5 días laborables. Envío gratis desde 50 €." },
        { q: "¿El CBD es legal en Polonia?", a: "Sí, el CBD en cosmética es legal." },
        { q: "¿Qué producto contra el smog?", a: "Au Naturel para limpiar; DUO-kit para proteger." },
        { q: "¿Plazo de envío?", a: "3–5 días laborables." }
      ],
      ctaTitle: "Dale a tu piel lo que Cracovia exige",
      ctaSub: "Cosmética natural con CBD de Suecia a Cracovia. Envío gratis desde 50 €."
    },
    de: {
      metaTitle: "Hautpflege Krakau – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für Krakau. Online bestellen, ab 50 € versandkostenfrei. Schutz vor berüchtigtem Winter-Smog und polnischer Kälte.",
      kicker: "Hautpflege in Krakau",
      h1: "Natürliche Hautpflege für Krakau",
      lead: "Krakau – Polens kulturelles Herz und Europas härtester Winter-Smog. Kohle, Frost, hartes Wasser. Ab 50 € versandkostenfrei.",
      problemTitle: "Was Krakau mit deiner Haut macht",
      problemBody: "<p>Weichsel-Tal von Hügeln umgeben – Schmutz bleibt hängen. Kohleheizung explodiert die Partikel im Winter, oft weit über WHO-Grenzen. Kalte Winter, warme Sommer. Hartes Wasser.</p>",
      tipsTitle: "Hautpflege-Tipps für Krakau",
      tips: [
        { title: "Winter-Reinigung", body: "Smog = abends doppelt reinigen." },
        { title: "Planty", body: "Grüner Ring um die Altstadt – etwas frischere Luft." },
        { title: "Polnische Hausmannskost", body: "Sauerkraut, Rote Bete, Eier." },
        { title: "Öl in der Kälte", body: "Polnischer Winter verlangt reichhaltiges Öl." },
        { title: "Salzmine Wieliczka", body: "Therapeutisches Mikroklima – manche spüren es auf Haut und Atemwegen." }
      ],
      solutionTitle: "CBD-Hautpflege nach Krakau",
      solutionBody: "<p>Versand aus Schweden – 3–5 Werktage nach Krakau. Ab 50 € versandkostenfrei.</p><p>Das DUO-kit stärkt die Barriere. Au Naturel entfernt Smog. TA-DA Serum spendet in der Kälte.</p>",
      faq: [
        { q: "Liefert ihr nach Krakau?", a: "Ja, 3–5 Werktage. Ab 50 € versandkostenfrei." },
        { q: "Ist CBD in Polen legal?", a: "Ja, CBD in Kosmetik ist legal." },
        { q: "Welches Produkt gegen Smog?", a: "Au Naturel zur Reinigung, DUO-kit zum Schutz." },
        { q: "Wie lange dauert der Versand?", a: "3–5 Werktage." }
      ],
      ctaTitle: "Gib deiner Haut, was Krakau verlangt",
      ctaSub: "Natürliche CBD-Pflege von Schweden nach Krakau. Ab 50 € versandkostenfrei."
    },
    fr: {
      metaTitle: "Soin du visage Cracovie – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Cracovie. Commande en ligne, livraison offerte dès 50 €. Protège ta peau du smog hivernal et du froid polonais.",
      kicker: "Soins à Cracovie",
      h1: "Soins naturels pour Cracovie",
      lead: "Cracovie – cœur culturel de la Pologne et smog hivernal parmi les pires d’Europe. Charbon, froid, eau dure. Livraison offerte dès 50 €.",
      problemTitle: "Ce que Cracovie fait à ta peau",
      problemBody: "<p>Vallée de la Vistule cernée de collines : la pollution stagne. Le chauffage au charbon fait exploser les particules en hiver – souvent bien au-delà des seuils de l’OMS. Hivers glacés ; étés chauds. Eau dure.</p>",
      tipsTitle: "Conseils peau pour Cracovie",
      tips: [
        { title: "Nettoyage hivernal", body: "Smog = double nettoyage chaque soir." },
        { title: "Planty", body: "Ceinture verte autour de la vieille ville – air un peu plus sain." },
        { title: "Cuisine polonaise maison", body: "Choucroute, betteraves, œufs." },
        { title: "Huile par grand froid", body: "L’hiver polonais exige une huile riche avant de sortir." },
        { title: "Mine de sel de Wieliczka", body: "Microclimat thérapeutique – effet ressenti peau et respiration." }
      ],
      solutionTitle: "Soins au CBD livrés à Cracovie",
      solutionBody: "<p>Expédition depuis la Suède ; 3–5 jours ouvrés jusqu’à Cracovie. Livraison offerte dès 50 €.</p><p>Le DUO-kit renforce la barrière. Au Naturel enlève le smog. TA-DA Serum hydrate dans le froid.</p>",
      faq: [
        { q: "Livrez-vous à Cracovie ?", a: "Oui, 3–5 jours ouvrés. Livraison offerte dès 50 €." },
        { q: "Le CBD est-il légal en Pologne ?", a: "Oui, le CBD en cosmétique est légal." },
        { q: "Quel produit contre le smog ?", a: "Au Naturel pour nettoyer ; DUO-kit pour protéger." },
        { q: "Délai de livraison ?", a: "3–5 jours ouvrés." }
      ],
      ctaTitle: "Offre à ta peau ce que Cracovie exige",
      ctaSub: "Soins naturels au CBD de la Suède à Cracovie. Livraison offerte dès 50 €."
    }
  },
  {
    svSlug: "hudvard-vilnius",
    enSlug: "skincare-vilnius",
    esSlug: "cuidado-piel-cbd-vilnius",
    deSlug: "cbd-hautpflege-vilnius",
    frSlug: "soin-peau-cbd-vilnius",
    category: "stad",
    productIds: ["duo-kit", "ta-da-serum", "fungtastic-mushroom-extract"],
    sv: {
      metaTitle: "Hudvård Vilnius – CBD-hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i Vilnius. Beställ online med fri frakt över €60. Skydda din hud mot baltiska vintrar och torr kyla.",
      kicker: "Hudvård i Vilnius",
      h1: "Naturlig hudvård för dig i Vilnius",
      lead: "Vilnius – Litauens barockpärla med kalla baltiska vintrar och korta somrar. Fri frakt över €60.",
      problemTitle: "Vilniushudens utmaningar",
      problemBody: "<p>Vilnius har ett kontinentalt baltiskt klimat med kalla vintrar ned mot minus tjugo och korta, varma somrar. Staden ligger längre från havet än Riga och Tallinn, vilket ger ännu kallare vintrar. Mörkerperioden är lång, D-vitaminbristen utbredd, och den torra uppvärmda inomhusluften förvärrar hudens torrhet.</p>",
      tipsTitle: "Hudvårdstips för vilniusbor",
      tips: [
        { title: "Barriärolja i kylan", body: "Litauiska vintrar kräver rik olja innan du går ut." },
        { title: "Promenera i Vingis-parken", body: "Vilnius gröna lunga ger frisk luft och ro." },
        { title: "D-vitamin", body: "Baltisk mörker kräver tillskott hela vintern." },
        { title: "Litauisk råg och honung", body: "Rågbröd och lokal honung – enkel, bra hudmat." },
        { title: "Litauisk bastukultur", body: "Pirtis med björkris – traditionell och bra för huden." }
      ],
      solutionTitle: "CBD-hudvård levererad till Vilnius",
      solutionBody: "<p>Vi skickar från Sverige – leverans till Vilnius inom 3–5 arbetsdagar. Fri frakt över €60.</p><p>DUO-kit stärker barriären. TA-DA Serum ger fukt i kylan. Fungtastic stödjer immunförsvaret.</p>",
      faq: [
        { q: "Levererar ni till Litauen?", a: "Ja, 3–5 arbetsdagar. Fri frakt över €60." },
        { q: "Är CBD lagligt i Litauen?", a: "Ja, CBD i hudvård är lagligt." },
        { q: "Vilken produkt för baltiska vintrar?", a: "TA-DA Serum för fukt, Fungtastic för immunförsvaret." },
        { q: "Hur lång tid tar leveransen?", a: "3–5 arbetsdagar." }
      ],
      ctaTitle: "Ge din hud det Vilnius kräver",
      ctaSub: "Naturlig CBD-hudvård från Sverige till Vilnius. Fri frakt över €60."
    },
    en: {
      metaTitle: "Skincare Vilnius – CBD skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Vilnius. Order online with free shipping over €60. Protect your skin from Baltic winters and dry cold.",
      kicker: "Skincare in Vilnius",
      h1: "Natural skincare for Vilnius",
      lead: "Vilnius – Lithuania's baroque jewel with cold Baltic winters and short summers. Free shipping over €60.",
      problemTitle: "What Vilnius does to your skin",
      problemBody: "<p>Vilnius has a continental Baltic climate with cold winters down to minus twenty and short, warm summers. The city sits further from the sea than Riga and Tallinn, making winters even colder. The dark period is long, vitamin D deficiency widespread, and dry heated indoor air worsens skin dehydration.</p>",
      tipsTitle: "Skincare tips for Vilnius residents",
      tips: [
        { title: "Barrier oil in the cold", body: "Lithuanian winters demand a rich oil before going out." },
        { title: "Walk in Vingis Park", body: "Vilnius' green lung offers fresh air and calm." },
        { title: "Vitamin D", body: "Baltic darkness demands supplements all winter." },
        { title: "Lithuanian rye and honey", body: "Rye bread and local honey – simple, great skin food." },
        { title: "Lithuanian sauna culture", body: "Pirtis with birch branches – traditional and great for the skin." }
      ],
      solutionTitle: "CBD skincare delivered to Vilnius",
      solutionBody: "<p>We ship from Sweden – delivery to Vilnius within 3–5 business days. Free shipping on orders over €60.</p><p>The DUO-kit strengthens the barrier. TA-DA Serum provides moisture in the cold. Fungtastic supports immunity.</p>",
      faq: [
        { q: "Do you ship to Lithuania?", a: "Yes, 3–5 business days. Free shipping over €60." },
        { q: "Is CBD legal in Lithuania?", a: "Yes, CBD in skincare is legal." },
        { q: "Which product for Baltic winters?", a: "TA-DA Serum for moisture, Fungtastic for immunity." },
        { q: "How long does shipping take?", a: "3–5 business days." }
      ],
      ctaTitle: "Give your skin what Vilnius demands",
      ctaSub: "Natural CBD skincare from Sweden to Vilnius. Free shipping over €60."
    },
    es: {
      metaTitle: "Cuidado de la piel Vilna – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Vilna. Pide online, envío gratis desde 50 €. Protege tu piel de los inviernos bálticos y el frío seco.",
      kicker: "Cuidado de la piel en Vilna",
      h1: "Cosmética natural para Vilna",
      lead: "Vilna – joya barroca de Lituania: inviernos bálticos duros, veranos cortos, aire interior seco. Envío gratis desde 50 €.",
      problemTitle: "Lo que Vilna le hace a tu piel",
      problemBody: "<p>Clima continental báltico: inviernos hacia menos veinte; veranos breves y cálidos. Más al interior que Riga o Tallin – aún más frío en invierno. Largos meses oscuros, déficit de vitamina D, calefacción que seca la piel por la noche.</p>",
      tipsTitle: "Consejos para quien vive en Vilna",
      tips: [
        { title: "Aceite antes del frío", body: "Invierno lituano = capa grasa antes de abrir la puerta." },
        { title: "Parque Vingis", body: "Pulmón verde: aire y silencio." },
        { title: "Vitamina D", body: "Oscuridad báltica = suplementos todo el invierno." },
        { title: "Centeno y miel", body: "Pan de centeno y miel local – simple y potente." },
        { title: "Pirtis tradicional", body: "Sauna lituana con ramas de abedul – ritual que la piel agradece con buen aftercare." }
      ],
      solutionTitle: "Cosmética con CBD con entrega en Vilna",
      solutionBody: "<p>Enviamos desde Suecia; 3–5 días laborables hasta Vilna. Envío gratis desde 50 €.</p><p>El DUO-kit refuerza la barrera. TA-DA Serum hidrata en el frío. Fungtastic Mushroom Extract apoya la inmunidad.</p>",
      faq: [
        { q: "¿Envían a Lituania?", a: "Sí, 3–5 días laborables. Envío gratis desde 50 €." },
        { q: "¿El CBD es legal en Lituania?", a: "Sí, el CBD en cosmética es legal." },
        { q: "¿Qué producto para inviernos bálticos?", a: "TA-DA Serum para humedad; Fungtastic Mushroom Extract para inmunidad." },
        { q: "¿Plazo de envío?", a: "3–5 días laborables." }
      ],
      ctaTitle: "Dale a tu piel lo que Vilna exige",
      ctaSub: "Cosmética natural con CBD de Suecia a Vilna. Envío gratis desde 50 €."
    },
    de: {
      metaTitle: "Hautpflege Vilnius – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für Vilnius. Online bestellen, ab 50 € versandkostenfrei. Schutz vor baltischen Wintern und trockener Kälte.",
      kicker: "Hautpflege in Vilnius",
      h1: "Natürliche Hautpflege für Vilnius",
      lead: "Vilnius – litauisches Barockjuwel: harte baltische Winter, kurze Sommer, trockene Heizluft. Ab 50 € versandkostenfrei.",
      problemTitle: "Was Vilnius mit deiner Haut macht",
      problemBody: "<p>Kontinentales Baltikum: Winter bis minus zwanzig, kurze warme Sommer. Weiter landeinwärts als Riga und Tallinn – noch kältere Winter. Lange Dunkelheit, Vitamin-D-Mangel, Heizung trocknet die Haut nachts aus.</p>",
      tipsTitle: "Hautpflege-Tipps für Vilnius",
      tips: [
        { title: "Öl vor der Kälte", body: "Litauischer Winter braucht Fettschicht vor der Tür." },
        { title: "Vingis-Park", body: "Grüne Lunge – Luft und Ruhe." },
        { title: "Vitamin D", body: "Baltische Dunkelheit = Supplemente den ganzen Winter." },
        { title: "Roggen und Honig", body: "Roggenbrot, lokaler Honig – einfach und stark." },
        { title: "Litauische Pirtis", body: "Sauna mit Birkenreis – mit guter Nachpflege top für die Haut." }
      ],
      solutionTitle: "CBD-Hautpflege nach Vilnius",
      solutionBody: "<p>Versand aus Schweden – 3–5 Werktage nach Vilnius. Ab 50 € versandkostenfrei.</p><p>Das DUO-kit stärkt die Barriere. TA-DA Serum spendet in der Kälte. Fungtastic Mushroom Extract unterstützt die Immunität.</p>",
      faq: [
        { q: "Liefert ihr nach Litauen?", a: "Ja, 3–5 Werktage. Ab 50 € versandkostenfrei." },
        { q: "Ist CBD in Litauen legal?", a: "Ja, CBD in Kosmetik ist legal." },
        { q: "Welches Produkt für baltische Winter?", a: "TA-DA Serum für Feuchtigkeit, Fungtastic Mushroom Extract für Immunität." },
        { q: "Wie lange dauert der Versand?", a: "3–5 Werktage." }
      ],
      ctaTitle: "Gib deiner Haut, was Vilnius verlangt",
      ctaSub: "Natürliche CBD-Pflege von Schweden nach Vilnius. Ab 50 € versandkostenfrei."
    },
    fr: {
      metaTitle: "Soin du visage Vilnius – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Vilnius. Commande en ligne, livraison offerte dès 50 €. Protège ta peau des hivers baltes et du froid sec.",
      kicker: "Soins à Vilnius",
      h1: "Soins naturels pour Vilnius",
      lead: "Vilnius – joyau baroque de la Lituanie : hivers baltes rudes, étés courts, air chauffé qui assèche. Livraison offerte dès 50 €.",
      problemTitle: "Ce que Vilnius fait à ta peau",
      problemBody: "<p>Climat continental balte : hivers vers moins vingt ; étés chauds mais brefs. Plus à l’intérieur des terres que Riga et Tallinn – hivers encore plus froids. Longue pénombre, carence en vitamine D, chauffage qui dessèche la peau la nuit.</p>",
      tipsTitle: "Conseils peau pour Vilnius",
      tips: [
        { title: "Huile avant le froid", body: "L’hiver lituanien mérite une couche riche avant la porte." },
        { title: "Parc Vingis", body: "Poumon vert – air et calme." },
        { title: "Vitamine D", body: "Obscurité balte = compléments tout l’hiver." },
        { title: "Seigle et miel", body: "Pain de seigle, miel local – simple et efficace." },
        { title: "Pirtis lituanienne", body: "Sauna aux branches de bouleau – avec bons soins après, la peau adore." }
      ],
      solutionTitle: "Soins au CBD livrés à Vilnius",
      solutionBody: "<p>Expédition depuis la Suède ; 3–5 jours ouvrés jusqu’à Vilnius. Livraison offerte dès 50 €.</p><p>Le DUO-kit renforce la barrière. TA-DA Serum hydrate dans le froid. Fungtastic Mushroom Extract soutient l’immunité.</p>",
      faq: [
        { q: "Livrez-vous en Lituanie ?", a: "Oui, 3–5 jours ouvrés. Livraison offerte dès 50 €." },
        { q: "Le CBD est-il légal en Lituanie ?", a: "Oui, le CBD en cosmétique est légal." },
        { q: "Quel produit pour les hivers baltes ?", a: "TA-DA Serum pour l’humidité ; Fungtastic Mushroom Extract pour l’immunité." },
        { q: "Délai de livraison ?", a: "3–5 jours ouvrés." }
      ],
      ctaTitle: "Offre à ta peau ce que Vilnius exige",
      ctaSub: "Soins naturels au CBD de la Suède à Vilnius. Livraison offerte dès 50 €."
    }
  },
];
