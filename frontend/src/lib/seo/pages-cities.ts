import type { LandingPage } from "./types";

export const CITY_PAGES: LandingPage[] = [
  {
    svSlug: "hudvard-stockholm",
    enSlug: "skincare-stockholm",
    esSlug: "cuidado-piel-cbd-stockholm",
    deSlug: "cbd-hautpflege-stockholm",
    frSlug: "soin-peau-cbd-stockholm",
    category: "stad",
    productIds: ["duo-kit", "ta-da-serum", "au-naturel-makeup-remover"],
    sv: {
      metaTitle: "Hudvård Stockholm – CBD-baserad hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i Stockholm. Beställ online med fri frakt över 700 kr. Skydda din hud mot storstadens stress och Stockholmsvintrarna.",
      kicker: "Hudvård i Stockholm",
      h1: "Naturlig hudvård för dig i Stockholm",
      lead: "Stockholms hud har det tufft. Avgaser längs Sveavägen, iskall torr vinterluft från Mälaren och uppvärmd kontorsluft nio månader om året. Din hud förtjänar bättre än aggressiva produkter som gör problemet värre. Beställ online – fri frakt över 700 kr, direkt till din dörr i Stockholm.",
      problemTitle: "Stockholmshudens utmaningar",
      problemBody: "<p>Att bo i Stockholm innebär att din hud utsätts för en unik kombination av påfrestningar. Storstadens luftföroreningar – avgaser från trafiken, partiklar från tunnelbanan, uppvärmd inomhusluft – belastar hudbarriären dag efter dag. Stockholms tunnelbana har bland Europas högsta halter av järnpartiklar i luften, och dessa oxiderar på huden och driver inflammatoriska processer.</p><p>Vintrarna är långa och torra. Temperaturen kan pendla från minus femton ute till tjugofem grader inomhus, och den snabba växlingen mellan kyla och värme stressar huden enormt. Stockholms kranvatten har dessutom medelhög hårdhet – kalkhalter som på sikt kan torka ut och irritera känslig hud.</p><p>Lägg till den typiska stockholmsstressen – pendlingen, deadlines, den ständiga uppkopplingen – och du har en perfekt storm för hudproblem. Stress höjer kortisolnivåerna, som i sin tur driver talgproduktion och inflammation. Din hud berättar vad din livsstil inte gör.</p>",
      tipsTitle: "Hudvårdstips för stockholmare",
      tips: [
        { title: "Ta lunchpromenaden genom Djurgården", body: "Grönområden minskar kortisolnivåer mätbart. Byt tunnelbanan mot en promenad genom Djurgården eller Hagaparken – din hud tackar dig för den friska luften och den sänkta stressnivån." },
        { title: "Investera i en luftfuktare hemma", body: "Stockholmslägenheter med fjärrvärme har extremt torr inomhusluft vintertid, ofta under 20 procent luftfuktighet. En luftfuktare i sovrummet skyddar hudbarriären medan du sover." },
        { title: "Rengör huden direkt efter tunnelbanan", body: "Tunnelbanans metallpartiklar lägger sig på huden och orsakar oxidativ stress. En mild rengöring efter pendlingen gör mer för din hy än du tror." },
        { title: "Ät skandinaviskt och säsongsbaserat", body: "Fet fisk från Östersjön, linfrö, havtorn och fermenterade grönsaker ger din hud omega-3 och antioxidanter inifrån. Stockholms matscen erbjuder allt du behöver." },
        { title: "Skydda ansiktet på cykeln", body: "Stockholm är en cykelstad, men vind och kyla torkar ut huden snabbt. Applicera en skyddande olja innan du sätter dig på cykeln – särskilt från oktober till april." }
      ],
      solutionTitle: "CBD-hudvård levererad till din dörr i Stockholm",
      solutionBody: "<p>Du behöver inte springa runt på Biblioteksgatan och jaga hudvårdsprodukter. 1753 SKINCARE levereras direkt till dig i Stockholm – från vårt lager i Åsa utanför Göteborg, med fri frakt på beställningar över 700 kr.</p><p>Vår DUO-kit med The ONE och I LOVE ger din stockholmshud den balans den desperat behöver. CBD och CBG arbetar med hudens eget endocannabinoidsystem för att lugna inflammation, stärka barriären och motverka den oxidativa stressen från stadslivet. TA-DA Serum med koncentrerad CBG är perfekt för de extra torra vintermånaderna. Och Au Naturel Makeup Remover rengör bort dagens smuts och partiklar utan att stressa huden ytterligare.</p><p>Naturlig, ärlig hudvård som fungerar – oavsett om du bor på Söder, i Vasastan eller ute i Nacka.</p>",
      faq: [
        { q: "Levererar ni till Stockholm?", a: "Absolut. Vi skickar från Åsa utanför Göteborg och de flesta beställningar når Stockholm inom 1–2 arbetsdagar. Fri frakt på beställningar över 700 kr." },
        { q: "Var kan jag köpa CBD-hudvård i Stockholm?", a: "Du kan beställa hela vårt sortiment på 1753skin.com. Vi säljer direkt till dig online – inga mellanhänder, inga butikspålägg. Smidigt levererat hem till dörren." },
        { q: "Fungerar CBD-hudvård mot föroreningsskador?", a: "Ja, CBD har dokumenterade antioxidativa egenskaper som hjälper huden att hantera oxidativ stress från föroreningar. Det ersätter inte solskydd eller rengöring, men stärker hudens egen motståndskraft." },
        { q: "Vilken produkt passar bäst för Stockholms torra vintrar?", a: "DUO-kit ger en bra bas med två oljor som stärker barriären. Komplettera med TA-DA Serum under de kallaste månaderna för extra skydd mot torr inomhusluft och kyla." }
      ],
      ctaTitle: "Ge din stockholmshud det den förtjänar",
      ctaSub: "Naturlig CBD-hudvård direkt till din dörr. Fri frakt över 700 kr."
    },
    en: {
      metaTitle: "Skincare Stockholm – CBD-based skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Stockholm. Order online with free shipping over €60. Protect your skin from urban stress and harsh Swedish winters.",
      kicker: "Skincare in Stockholm",
      h1: "Natural skincare for Stockholm",
      lead: "Skin in Stockholm has it rough. Exhaust fumes along Sveavägen, bone-dry winter air off Lake Mälaren, and heated office air nine months a year. Your skin deserves better than aggressive products that make the problem worse. Order online – free shipping over €60, straight to your door in Stockholm.",
      problemTitle: "What Stockholm does to your skin",
      problemBody: "<p>Living in Stockholm means your skin faces a unique combination of stressors. Urban air pollution – traffic exhaust, subway particles, heated indoor air – attacks your skin barrier day after day. Stockholm's subway system has some of Europe's highest levels of airborne iron particles, which oxidize on the skin and drive inflammatory processes.</p><p>Winters are long and dry. Temperatures can swing from minus fifteen outside to twenty-five degrees indoors, and the rapid shift between cold and heat puts enormous stress on the skin. Stockholm's tap water also has moderate hardness – calcium levels that can dry out and irritate sensitive skin over time.</p><p>Add the typical Stockholm stress – the commute, the deadlines, the constant connectivity – and you have a perfect storm for skin issues. Stress raises cortisol levels, which in turn drives oil production and inflammation. Your skin tells the story your lifestyle won't.</p>",
      tipsTitle: "Skincare tips for Stockholmers",
      tips: [
        { title: "Take your lunch walk through Djurgården", body: "Green spaces measurably lower cortisol levels. Swap the subway for a walk through Djurgården or Hagaparken – your skin will thank you for the fresh air and reduced stress." },
        { title: "Invest in a humidifier at home", body: "Stockholm apartments with district heating have extremely dry indoor air in winter, often below 20 percent humidity. A bedroom humidifier protects your skin barrier while you sleep." },
        { title: "Cleanse right after the subway", body: "The subway's metal particles settle on your skin and cause oxidative stress. A gentle cleanse after commuting does more for your complexion than you think." },
        { title: "Eat Scandinavian and seasonal", body: "Fatty fish, flaxseed, sea buckthorn, and fermented vegetables give your skin omega-3s and antioxidants from within. Stockholm's food scene has everything you need." },
        { title: "Protect your face when cycling", body: "Stockholm is a cycling city, but wind and cold dry out your skin fast. Apply a protective oil before getting on your bike – especially from October to April." }
      ],
      solutionTitle: "CBD skincare delivered to your door in Stockholm",
      solutionBody: "<p>You don't need to run around Biblioteksgatan chasing skincare products. 1753 SKINCARE ships directly to you in Stockholm – from our warehouse in Åsa outside Gothenburg, with free shipping on orders over €60.</p><p>Our DUO-kit with The ONE and I LOVE gives skin in Stockholm the balance it keeps asking for. CBD and CBG work with your skin's own endocannabinoid system to calm inflammation, strengthen the barrier, and counteract oxidative stress from city life. TA-DA Serum with concentrated CBG is perfect for the extra dry winter months. And Au Naturel Makeup Remover cleans away the day's dirt and particles without further stressing the skin.</p><p>Natural, honest skincare that works – whether you live in Södermalm, Vasastan, or out in Nacka.</p>",
      faq: [
        { q: "Do you ship to Stockholm?", a: "Absolutely. We ship from Åsa outside Gothenburg and most orders reach Stockholm within 1–2 business days. Free shipping on orders over €60." },
        { q: "Where can I buy CBD skincare in Stockholm?", a: "You can order our full range at 1753skin.com. We sell directly to you online – no middlemen, no store markups. Conveniently delivered to your door." },
        { q: "Does CBD skincare help against pollution damage?", a: "Yes, CBD has documented antioxidant properties that help the skin handle oxidative stress from pollution. It doesn't replace sunscreen or cleansing, but strengthens your skin's own resilience." },
        { q: "Which product is best for Stockholm's dry winters?", a: "The DUO-kit provides a solid base with two oils that strengthen the barrier. Add TA-DA Serum during the coldest months for extra protection against dry indoor air and freezing temperatures." }
      ],
      ctaTitle: "Give your skin in Stockholm what it deserves",
      ctaSub: "Natural CBD skincare to your door. Free shipping over €60."
    },
    es: {
      metaTitle: "Cuidado de la piel Estocolmo – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Estocolmo. Pide online con envío gratis desde 50 €. Protege tu piel del estrés urbano y de los inviernos suecos duros.",
      kicker: "Cuidado de la piel en Estocolmo",
      h1: "Cosmética natural para Estocolmo",
      lead: "La piel en Estocolmo lo tiene crudo. Gases de escape por Sveavägen, aire invernal seco del lago Mälaren y aire de oficina calefactado nueve meses al año. Tu piel merece algo mejor que productos agresivos que empeoran el problema. Pide online: envío gratis desde 50 €, directo a tu puerta en Estocolmo.",
      problemTitle: "Lo que Estocolmo le hace a tu piel",
      problemBody: "<p>Vivir en Estocolmo significa que tu piel afronta una combinación única de factores de estrés. La contaminación urbana – gases del tráfico, partículas del metro, aire interior calefactado – ataca tu barrera cutánea día tras día. El metro de Estocolmo tiene unos de los niveles más altos de Europa de partículas de hierro en el aire, que se oxidan en la piel y favorecen procesos inflamatorios.</p><p>Los inviernos son largos y secos. Las temperaturas pueden pasar de quince grados bajo cero fuera a veinticinco dentro, y ese cambio brusco entre frío y calor somete enormemente a la piel. El agua del grifo de Estocolmo también tiene dureza media: el calcio puede resecar e irritar la piel sensible con el tiempo.</p><p>Suma el estrés típico de Estocolmo – el trayecto diario, los plazos, la conexión constante – y tienes la tormenta perfecta para problemas de piel. El estrés sube el cortisol, que a su vez dispara la producción de sebo y la inflamación. Tu piel cuenta lo que tu estilo de vida no quiere contar.</p>",
      tipsTitle: "Consejos de cuidado de la piel para estocolmenses",
      tips: [
        { title: "Da tu paseo de mediodía por Djurgården", body: "Los espacios verdes bajan el cortisol de forma medible. Cambia el metro por un paseo por Djurgården o Hagaparken: tu piel agradecerá el aire fresco y menos estrés." },
        { title: "Invierte en un humidificador en casa", body: "Los pisos de Estocolmo con calefacción urbana tienen un aire interior extremadamente seco en invierno, a menudo por debajo del 20 % de humedad. Un humidificador en el dormitorio protege tu barrera mientras duermes." },
        { title: "Límpiate justo después del metro", body: "Las partículas metálicas del metro se depositan en la piel y generan estrés oxidativo. Una limpieza suave después del trayecto hace más por tu cutis de lo que crees." },
        { title: "Come escandinavo y de temporada", body: "Pescado graso, linaza, espino amarillo y vegetales fermentados aportan omega-3 y antioxidantes desde dentro. La escena gastronómica de Estocolmo tiene todo lo que necesitas." },
        { title: "Protege el rostro al ir en bici", body: "Estocolmo es ciudad de bici, pero el viento y el frío resecan la piel rápido. Aplica un aceite protector antes de montar, sobre todo de octubre a abril." }
      ],
      solutionTitle: "Cosmética con CBD a tu puerta en Estocolmo",
      solutionBody: "<p>No hace falta correr por Biblioteksgatan persiguiendo productos. 1753 SKINCARE te envía directamente en Estocolmo – desde nuestro almacén en Åsa, cerca de Gotemburgo, con envío gratis en pedidos superiores a 50 €.</p><p>Nuestro DUO-kit con The ONE y I LOVE da a la piel en Estocolmo el equilibrio que pide a gritos. El CBD y el CBG trabajan con el propio sistema endocannabinoide de la piel para calmar la inflamación, reforzar la barrera y contrarrestar el estrés oxidativo de la vida urbana. TA-DA Serum con CBG concentrado encaja en los meses de invierno más secos. Y Au Naturel Makeup Remover limpia la suciedad y las partículas del día sin estresar más la piel.</p><p>Cosmética natural y honesta que funciona – vivas en Södermalm, Vasastan o en Nacka.</p>",
      faq: [
        { q: "¿Envían a Estocolmo?", a: "Por supuesto. Enviamos desde Åsa, cerca de Gotemburgo, y la mayoría de pedidos llegan a Estocolmo en 1–2 días laborables. Envío gratis en pedidos superiores a 50 €." },
        { q: "¿Dónde puedo comprar cosmética con CBD en Estocolmo?", a: "Puedes pedir toda la gama en 1753skin.com. Vendemos directo online – sin intermediarios ni recargos de tienda. Te llega cómodamente a casa." },
        { q: "¿La cosmética con CBD ayuda frente al daño por contaminación?", a: "Sí, el CBD tiene propiedades antioxidantes documentadas que ayudan a la piel a gestionar el estrés oxidativo por contaminación. No sustituye protector solar ni limpieza, pero refuerza la resistencia propia de la piel." },
        { q: "¿Qué producto va mejor con los inviernos secos de Estocolmo?", a: "El DUO-kit da una base sólida con dos aceites que fortalecen la barrera. Añade TA-DA Serum en los meses más fríos para protección extra frente al aire seco interior y al frío." }
      ],
      ctaTitle: "Dale a tu piel en Estocolmo lo que merece",
      ctaSub: "Cosmética natural con CBD a tu puerta. Envío gratis desde 50 €."
    },
    de: {
      metaTitle: "Hautpflege Stockholm – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für Stockholm. Online bestellen, ab 50 € versandkostenfrei. Schützt deine Haut vor urbanem Stress und harten schwedischen Wintern.",
      kicker: "Hautpflege in Stockholm",
      h1: "Natürliche Hautpflege für Stockholm",
      lead: "Die Haut in Stockholm hat es nicht leicht. Abgase entlang der Sveavägen, knochentrockene Winterluft vom Mälarsee und neun Monate lang beheizte Büroluft. Deine Haut verdient mehr als aggressive Produkte, die alles schlimmer machen. Online bestellen – ab 50 € versandkostenfrei, direkt vor deine Tür in Stockholm.",
      problemTitle: "Was Stockholm mit deiner Haut macht",
      problemBody: "<p>In Stockholm trifft deine Haut auf eine besondere Mischung aus Stressfaktoren. Luftverschmutzung – Verkehrsabgase, U-Bahn-Partikel, trockene Innenraumluft – greift Tag für Tag deine Hautbarriere an. Stockholms U-Bahn hat in Europa mit die höchsten Eisenpartikel-Werte in der Luft; sie oxidieren auf der Haut und fördern Entzündungsprozesse.</p><p>Die Winter sind lang und trocken. Draußen kann es minus fünfzehn sein, drinnen plus fünfundzwanzig – und der schnelle Wechsel zwischen Kälte und Hitze strapaziert die Haut enorm. Stockholms Leitungswasser ist mittelhart; Kalk kann empfindliche Haut mit der Zeit austrocknen und reizen.</p><p>Dazu kommt typischer Stockholm-Stress – Pendeln, Deadlines, ständige Erreichbarkeit – und du hast das perfekte Sturmzentrum für Hautprobleme. Stress hebt den Cortisolspiegel, was Talgproduktion und Entzündung antreibt. Deine Haut erzählt, was dein Lifestyle verschweigt.</p>",
      tipsTitle: "Hautpflege-Tipps für Menschen in Stockholm",
      tips: [
        { title: "Mittagsspaziergang durch Djurgården", body: "Grünflächen senken messbar Cortisol. Tausch die U-Bahn gegen einen Gang durch Djurgården oder Hagaparken – deine Haut dankt es mit frischer Luft und weniger Stress." },
        { title: "Luftbefeuchter zuhause", body: "Stockholmer Wohnungen mit Fernwärme haben im Winter extrem trockene Luft, oft unter 20 % Luftfeuchtigkeit. Ein Schlafzimmer-Luftbefeuchter schützt die Barriere im Schlaf." },
        { title: "Direkt nach der U-Bahn reinigen", body: "Metallpartikel aus der U-Bahn setzen sich auf der Haut ab und verursachen oxidativen Stress. Eine milde Reinigung nach dem Pendeln hilft mehr, als du denkst." },
        { title: "Skandinavisch und saisonal essen", body: "Fetter Fisch, Leinsamen, Sanddorn und fermentiertes Gemüse liefern Omega-3 und Antioxidantien von innen. Stockholms Food-Szene hat alles, was du brauchst." },
        { title: "Gesicht beim Radfahren schützen", body: "Stockholm ist eine Fahrradstadt, aber Wind und Kälte trocknen die Haut schnell aus. Trag Schutzöl, bevor du aufs Rad steigst – besonders von Oktober bis April." }
      ],
      solutionTitle: "CBD-Hautpflege bis vor die Tür in Stockholm",
      solutionBody: "<p>Du musst nicht über die Biblioteksgatan rennen und Produkte jagen. 1753 SKINCARE liefert direkt nach Stockholm – von unserem Lager in Åsa bei Göteborg, ab 50 € versandkostenfrei.</p><p>Unser DUO-kit mit The ONE und I LOVE gibt Haut in Stockholm das Gleichgewicht, das sie braucht. CBD und CBG arbeiten mit dem eigenen Endocannabinoidsystem der Haut, beruhigen Entzündungen, stärken die Barriere und wirken dem oxidativen Stress des Stadtlebens entgegen. TA-DA Serum mit konzentriertem CBG passt zu extra trockenen Wintermonaten. Au Naturel Makeup Remover entfernt Schmutz und Partikel des Tages, ohne die Haut weiter zu strapazieren.</p><p>Natürliche, ehrliche Pflege, die funktioniert – ob du in Södermalm, Vasastan oder draußen in Nacka wohnst.</p>",
      faq: [
        { q: "Liefert ihr nach Stockholm?", a: "Ja. Wir versenden aus Åsa bei Göteborg; die meisten Bestellungen sind in 1–2 Werktagen in Stockholm. Ab 50 € versandkostenfrei." },
        { q: "Wo kann ich CBD-Hautpflege in Stockholm kaufen?", a: "Unter 1753skin.com bestellst du die ganze Range. Direkt online – ohne Zwischenhändler und ohne Ladenaufschlag. Bequem bis zur Tür." },
        { q: "Hilft CBD-Hautpflege gegen Schäden durch Luftverschmutzung?", a: "Ja, CBD hat dokumentierte antioxidative Eigenschaften und unterstützt die Haut beim oxidativen Stress durch Schadstoffe. Es ersetzt keinen Sonnenschutz und keine Reinigung, stärkt aber die eigene Widerstandskraft." },
        { q: "Welches Produkt passt zu Stockholms trockenen Wintern?", a: "Das DUO-kit bildet eine solide Basis mit zwei öligen Produkten für die Barriere. Ergänze im tiefsten Winter TA-DA Serum für extra Schutz vor trockener Innenluft und Kälte." }
      ],
      ctaTitle: "Gib deiner Haut in Stockholm, was sie verdient",
      ctaSub: "Natürliche CBD-Hautpflege bis vor die Tür. Ab 50 € versandkostenfrei."
    },
    fr: {
      metaTitle: "Soin du visage Stockholm – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Stockholm. Commandez en ligne, livraison offerte dès 50 €. Protégez votre peau du stress urbain et des hivers suédois rudes.",
      kicker: "Soins à Stockholm",
      h1: "Soins naturels pour Stockholm",
      lead: "À Stockholm, la peau en voit de dures. Les gaz d’échappement le long de Sveavägen, l’air hivernal sec venu du Mälaren, et l’air de bureau chauffé neuf mois par an. Ta peau mérite mieux que des produits agressifs qui aggravent le problème. Commande en ligne – livraison offerte dès 50 €, directement chez toi à Stockholm.",
      problemTitle: "Ce que Stockholm fait à ta peau",
      problemBody: "<p>Vivre à Stockholm, c’est exposer ta peau à un cocktail unique de contraintes. La pollution urbaine – gaz d’échappement, particules de métro, air intérieur chauffé – attaque la barrière cutanée jour après jour. Le métro de Stockholm affiche parmi les taux européens les plus élevés de particules de fer en suspension, qui s’oxydent sur la peau et alimentent l’inflammation.</p><p>Les hivers sont longs et secs. On peut passer de moins quinze dehors à plus vingt-cinq dedans, et ce va-et-vient brutal entre froid et chaleur met la peau à rude épreuve. L’eau du robinet à Stockholm est moyennement dure : le calcaire peut, à la longue, assécher et irriter les peaux sensibles.</p><p>Ajoute le stress typique stockholmois – trajets, deadlines, hyperconnexion – et tu obtiens la tempête parfaite pour les problèmes de peau. Le stress fait monter le cortisol, ce qui stimule sébum et inflammation. Ta peau raconte ce que ton mode de vie tait.</p>",
      tipsTitle: "Conseils peau pour les Stockholm",
      tips: [
        { title: "Ta balade déjeuner à Djurgården", body: "Les espaces verts font baisser le cortisol de façon mesurable. Échange le métro contre une marche à Djurgården ou Hagaparken – ta peau profitera de l’air frais et du stress en moins." },
        { title: "Investis dans un humidificateur", body: "Les appartements chauffés au réseau à Stockholm ont un air intérieur très sec en hiver, souvent sous 20 % d’humidité. Un humidificateur dans la chambre protège la barrière pendant le sommeil." },
        { title: "Nettoie juste après le métro", body: "Les particules métalliques du métro se déposent sur la peau et créent un stress oxydatif. Un nettoyage doux après les trajets fait plus pour ton teint que tu ne crois." },
        { title: "Mange scandinave et de saison", body: "Poisson gras, graines de lin, argousier et légumes fermentés apportent oméga-3 et antioxydants de l’intérieur. La scène food de Stockholm a tout ce qu’il faut." },
        { title: "Protège le visage à vélo", body: "Stockholm est une ville à vélo, mais vent et froid assèchent vite la peau. Applique une huile protectrice avant de partir – surtout d’octobre à avril." }
      ],
      solutionTitle: "Soins au CBD livrés chez toi à Stockholm",
      solutionBody: "<p>Pas besoin de courir Biblioteksgatan pour chasser les produits. 1753 SKINCARE expédie directement à Stockholm – depuis notre entrepôt à Åsa près de Göteborg, livraison offerte dès 50 €.</p><p>Notre DUO-kit avec The ONE et I LOVE redonne à la peau à Stockholm l’équilibre qu’elle réclame. Le CBD et le CBG agissent avec le système endocannabinoïde de la peau pour calmer l’inflammation, renforcer la barrière et contrer le stress oxydatif de la vie urbaine. TA-DA Serum au CBG concentré convient aux mois d’hiver les plus secs. Au Naturel Makeup Remover enlève saleté et particules sans stresser davantage la peau.</p><p>Des soins naturels et honnêtes qui fonctionnent – que tu vives à Södermalm, Vasastan ou à Nacka.</p>",
      faq: [
        { q: "Livrez-vous à Stockholm ?", a: "Oui. Nous expédions depuis Åsa près de Göteborg ; la plupart des commandes arrivent à Stockholm en 1–2 jours ouvrés. Livraison offerte dès 50 €." },
        { q: "Où acheter des soins au CBD à Stockholm ?", a: "Commande toute la gamme sur 1753skin.com. Vente directe en ligne – sans intermédiaire ni majoration magasin. Livraison pratique à domicile." },
        { q: "Les soins au CBD aident-ils contre la pollution ?", a: "Oui, le CBD a des propriétés antioxydantes documentées qui aident la peau face au stress oxydatif lié à la pollution. Ça ne remplace ni SPF ni nettoyage, mais renforce la résilience naturelle." },
        { q: "Quel produit pour les hivers secs de Stockholm ?", a: "Le DUO-kit offre une base solide avec deux huiles qui renforcent la barrière. Ajoute TA-DA Serum pendant les mois les plus froids pour une protection supplémentaire contre l’air sec intérieur et le gel." }
      ],
      ctaTitle: "Offre à ta peau à Stockholm ce qu’elle mérite",
      ctaSub: "Soins naturels au CBD jusqu’à chez toi. Livraison offerte dès 50 €."
    }
  },
  {
    svSlug: "hudvard-goteborg",
    enSlug: "skincare-gothenburg",
    esSlug: "cuidado-piel-cbd-gothenburg",
    deSlug: "cbd-hautpflege-gothenburg",
    frSlug: "soin-peau-cbd-gothenburg",
    category: "stad",
    productIds: ["duo-kit", "ta-da-serum", "fungtastic-mushroom-extract"],
    sv: {
      metaTitle: "Hudvård Göteborg – CBD-baserad hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård från Åsa, strax utanför Göteborg. Fri frakt över 700 kr. Skydda din hud mot det göteborgska regnet och havsluften.",
      kicker: "Hudvård i Göteborg",
      h1: "Naturlig hudvård för dig i Göteborg",
      lead: "Vi vet hur det är – vi bor precis utanför stan själva. Regnet, havsvinden, de grå novemberdagarna. Göteborgs klimat testar din hud på sätt som stockholmare aldrig förstår. Beställ online – fri frakt över 700 kr, och vi ligger bara en liten leverans bort i Åsa.",
      problemTitle: "Göteborgshudens utmaningar",
      problemBody: "<p>Göteborgs oceaniska klimat är unikt i Sverige. Den fuktiga havsluften från Skagerrak bär med sig salt som lägger sig på huden och kan störa dess naturliga pH-balans. Regnet – ja, det berömda regnet – betyder att huden sällan får riktig solexponering för D-vitaminproduktion, samtidigt som den konstant utsätts för fukt och vind.</p><p>Men paradoxalt nog leder den fuktiga ytterluften till att många underskattar torr hud. Inomhus är situationen en annan: uppvärmda lägenheter i Majorna och Linnéstaden har lika torr luft som överallt annars i Sverige vintertid. Huden ställs inför en konstant fukt-torr-fukt-cykel som försvagar barriären.</p><p>Göteborg är dessutom en hamnstad med industri, och luftkvaliteten varierar. Partiklar från Göta älv-området och hamnverksamheten belastar huden, särskilt om du bor eller jobbar centralt. Lägg till den västkustska livsstilen – ute i alla väder, ofta med blåst i ansiktet – och du förstår varför göteborgshud behöver extra omsorg.</p>",
      tipsTitle: "Hudvårdstips för göteborgare",
      tips: [
        { title: "Utnyttja havsluften rätt", body: "Salt havsluft kan vara både bra och dåligt. Korta promenader längs Saltholmen eller Långedrag ger mineraler och frisk luft, men skölj alltid ansiktet efteråt för att undvika saltinducerad torrhet." },
        { title: "Anpassa rutinen efter säsongen", body: "Göteborgs årstider kräver olika saker. Sommarens saltstänk och sol kräver solskydd och lätt fukt. Vinterns regn och mörker kräver rikare skydd och mer fokus på barriärstärkande produkter." },
        { title: "Stärk immunförsvaret inifrån", body: "D-vitaminbrist är utbredd i Göteborg på grund av den begränsade solexponeringen. Tillskott av D-vitamin och adaptogena svampar stödjer både immunförsvaret och hudens motståndskraft." },
        { title: "Skydda dig mot vinden", body: "Västkustvinden torkar ut huden snabbt, särskilt vid havet. Applicera en skyddande olja som ett barriärlager innan du går ut – det låser in fukten och stänger ute vinden." },
        { title: "Ta bastubad regelbundet", body: "Göteborgare älskar bastun, och det är bra för huden – svettningen öppnar porer och renar. Men komplettera alltid med återfuktning efteråt, annars förlorar du mer fukt än du vinner." }
      ],
      solutionTitle: "CBD-hudvård från dina grannar i Åsa",
      solutionBody: "<p>Vi på 1753 SKINCARE bor och verkar i Åsa, strax söder om Göteborg. Vi vet exakt vad göteborgsklimatet gör med huden – vi lever i det varje dag. Våra produkter är utvecklade med just den här verkligheten i åtanke.</p><p>DUO-kit med The ONE och I LOVE ger din hud den balans som det göteborgska klimatet konstant rubblar. CBD och CBG stärker hudbarriären mot vind, salt och fuktväxlingar. Fungtastic Mushroom Extract med adaptogena svampar stärker immunförsvaret inifrån – extra viktigt i en stad där solen gömmer sig halva året.</p><p>Beställ på 1753skin.com – vi skickar från Åsa och de flesta göteborgsleveranser är framme redan nästa dag. Fri frakt på beställningar över 700 kr. Lokalt skapat, direkt till dig.</p>",
      faq: [
        { q: "Levererar ni till Göteborg?", a: "Vi sitter i Åsa, strax utanför Göteborg – så ja, definitivt. De flesta beställningar når dig inom 1 arbetsdag. Fri frakt över 700 kr." },
        { q: "Var kan jag köpa CBD-hudvård i Göteborg?", a: "Enklast och bäst via 1753skin.com. Vi säljer direkt från Åsa utan mellanhänder, och du får våra produkter snabbare än från någon fysisk butik." },
        { q: "Hjälper CBD-hudvård mot väder och vind?", a: "Ja, CBD stärker hudbarriären och hjälper huden att hantera yttre påfrestningar som vind, salt och temperaturväxlingar. Det skyddar inte som en fysisk barriär, men gör huden mer motståndskraftig." },
        { q: "Tillverkar ni era produkter i Göteborg?", a: "Vi är baserade i Åsa, strax söder om Göteborg. Produkterna utvecklas och distribueras härifrån – det är västkustsk hudvård för västkustens förhållanden." }
      ],
      ctaTitle: "Göteborgs klimat kräver göteborgsk hudvård",
      ctaSub: "Från Åsa till din dörr – naturlig CBD-hudvård som förstår ditt klimat. Fri frakt över 700 kr."
    },
    en: {
      metaTitle: "Skincare Gothenburg – CBD-based skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare from Åsa, just outside Gothenburg. Free shipping over €60. Protect your skin from the Gothenburg rain and ocean air.",
      kicker: "Skincare in Gothenburg",
      h1: "Natural skincare for Gothenburg",
      lead: "We know what it's like – we live just outside the city ourselves. The rain, the ocean wind, the grey November days. Gothenburg's climate tests your skin in ways Stockholmers will never understand. Order online – free shipping over €60, and we're just a short delivery away in Åsa.",
      problemTitle: "What Gothenburg does to your skin",
      problemBody: "<p>Gothenburg's oceanic climate is unique in Sweden. The moist sea air from the Skagerrak carries salt that settles on the skin and can disrupt its natural pH balance. The rain – yes, the famous rain – means the skin rarely gets real sun exposure for vitamin D production, while being constantly exposed to moisture and wind.</p><p>Paradoxically, the humid outdoor air leads many to underestimate dry skin. Indoors, it's a different story: heated apartments in Majorna and Linnéstaden have air just as dry as anywhere in Sweden during winter. The skin faces a constant wet-dry-wet cycle that weakens the barrier.</p><p>Gothenburg is also a port city with industry, and air quality varies. Particles from the Göta river area and harbor operations stress the skin, especially if you live or work in the center. Add the west coast lifestyle – outdoors in all weather, often with wind in your face – and you understand why skin in Gothenburg needs extra care.</p>",
      tipsTitle: "Skincare tips for Gothenburgers",
      tips: [
        { title: "Use the sea air wisely", body: "Salt ocean air can be both good and bad. Short walks along Saltholmen or Långedrag provide minerals and fresh air, but always rinse your face afterward to avoid salt-induced dryness." },
        { title: "Adapt your routine to the season", body: "Gothenburg's seasons demand different things. Summer's salt spray and sun require sunscreen and light moisture. Winter's rain and darkness call for richer protection and more focus on barrier-strengthening products." },
        { title: "Strengthen immunity from within", body: "Vitamin D deficiency is widespread in Gothenburg due to limited sun exposure. Supplements of vitamin D and adaptogenic mushrooms support both the immune system and skin resilience." },
        { title: "Protect yourself from the wind", body: "West coast wind dries out the skin quickly, especially near the sea. Apply a protective oil as a barrier layer before going out – it locks in moisture and shuts out the wind." },
        { title: "Take regular saunas", body: "Gothenburgers love their saunas, and it's great for the skin – sweating opens pores and purifies. But always follow up with moisturizing, or you'll lose more moisture than you gain." }
      ],
      solutionTitle: "CBD skincare from your neighbors in Åsa",
      solutionBody: "<p>We at 1753 SKINCARE live and work in Åsa, just south of Gothenburg. We know exactly what the Gothenburg climate does to skin – we live in it every day. Our products are developed with exactly this reality in mind.</p><p>The DUO-kit with The ONE and I LOVE gives your skin the balance that Gothenburg's climate constantly disrupts. CBD and CBG strengthen the skin barrier against wind, salt, and humidity fluctuations. Fungtastic Mushroom Extract with adaptogenic mushrooms strengthens the immune system from within – extra important in a city where the sun hides half the year.</p><p>Order at 1753skin.com – we ship from Åsa and most Gothenburg deliveries arrive the next day. Free shipping on orders over €60. Locally made, direct to you.</p>",
      faq: [
        { q: "Do you ship to Gothenburg?", a: "We're based in Åsa, just outside Gothenburg – so yes, definitely. Most orders reach you within 1 business day. Free shipping over €60." },
        { q: "Where can I buy CBD skincare in Gothenburg?", a: "Easiest and best through 1753skin.com. We sell directly from Åsa without middlemen, and you'll get our products faster than from any physical store." },
        { q: "Does CBD skincare help against weather and wind?", a: "Yes, CBD strengthens the skin barrier and helps the skin handle external stressors like wind, salt, and temperature changes. It doesn't protect like a physical barrier, but makes your skin more resilient." },
        { q: "Do you make your products in Gothenburg?", a: "We're based in Åsa, just south of Gothenburg. Products are developed and distributed from here – it's west coast skincare for west coast conditions." }
      ],
      ctaTitle: "Gothenburg's climate calls for skincare that gets it",
      ctaSub: "From Åsa to your door – natural CBD skincare that understands your climate. Free shipping over €60."
    },
    es: {
      metaTitle: "Cuidado de la piel Gotemburgo – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD desde Åsa, junto a Gotemburgo. Envío gratis desde 50 €. Protege tu piel de la lluvia y el aire marino de Gotemburgo.",
      kicker: "Cuidado de la piel en Gotemburgo",
      h1: "Cosmética natural para Gotemburgo",
      lead: "Lo sabemos: vivimos justo fuera de la ciudad. La lluvia, el viento del mar, los grises de noviembre. El clima de Gotemburgo pone a prueba tu piel de un modo que en Estocolmo no entienden. Pide online – envío gratis desde 50 €, y estamos a solo un envío de distancia en Åsa.",
      problemTitle: "Lo que Gotemburgo le hace a tu piel",
      problemBody: "<p>El clima oceánico de Gotemburgo es único en Suecia. El aire húmedo del Skagerrak arrastra sal que se deposita en la piel y puede alterar su pH. La lluvia – sí, la famosa – significa poca exposición solar real para la vitamina D, mientras la piel sigue expuesta a humedad y viento.</p><p>Paradójicamente, el aire húmedo exterior hace que muchos subestimen la sequedad. En interiores es otra historia: los pisos calefactados de Majorna y Linnéstaden tienen el mismo aire seco en invierno que en el resto del país. La piel vive un ciclo húmedo-seco-húmedo que debilita la barrera.</p><p>Gotemburgo es puerto e industria, y la calidad del aire varía. Partículas del Göta älv y de la actividad portuaria cargan la piel, sobre todo si vives o trabajas en el centro. Suma el estilo de costa oeste – fuera en cualquier clima, a menudo con viento en la cara – y entiendes por qué la piel aquí pide cuidado extra.</p>",
      tipsTitle: "Consejos para quien vive en Gotemburgo",
      tips: [
        { title: "Aprovecha el aire marino con cabeza", body: "El aire salado puede ayudar o perjudicar. Paseos cortos por Saltholmen o Långedrag aportan minerales y aire limpio, pero enjuaga la cara después para evitar sequedad inducida por sal." },
        { title: "Adapta la rutina a la estación", body: "Las estaciones en Gotemburgo piden cosas distintas. En verano: salpicaduras y sol piden SPF y hidratación ligera. En invierno: lluvia y oscuridad piden más protección rica y barrera fuerte." },
        { title: "Refuerza la inmunidad por dentro", body: "La falta de sol en Gotemburgo deja a muchos con déficit de vitamina D. Suplementos de D y hongos adaptógenos apoyan sistema inmune y resistencia de la piel." },
        { title: "Protégete del viento", body: "El viento de la costa oeste reseca rápido, sobre cerca del mar. Aplica aceite protector como capa barrera antes de salir: retiene humedad y corta el viento." },
        { title: "Sauna con cabeza", body: "En Gotemburgo se ama la sauna, y la piel lo agradece – el sudor abre y limpia. Pero hidrata después o pierdes más agua de la que ganas." }
      ],
      solutionTitle: "Cosmética con CBD de tus vecinos en Åsa",
      solutionBody: "<p>En 1753 SKINCARE vivimos y trabajamos en Åsa, justo al sur de Gotemburgo. Sabemos qué le hace el clima a la piel – lo vivimos cada día. Los productos están pensados para esa realidad.</p><p>El DUO-kit con The ONE y I LOVE devuelve el equilibrio que el clima de Gotemburgo descompensa. CBD y CBG refuerzan la barrera frente a viento, sal y cambios de humedad. Fungtastic Mushroom Extract con hongos adaptógenos apoya la inmunidad por dentro – importante en una ciudad donde el sol se esconde medio año.</p><p>Pide en 1753skin.com – enviamos desde Åsa y muchos pedidos a Gotemburgo llegan al día siguiente. Envío gratis desde 50 €. Hecho cerca, directo a ti.</p>",
      faq: [
        { q: "¿Envían a Gotemburgo?", a: "Estamos en Åsa, junto a Gotemburgo – sí, claro. La mayoría de pedidos llegan en 1 día laborable. Envío gratis desde 50 €." },
        { q: "¿Dónde compro cosmética con CBD en Gotemburgo?", a: "Lo más fácil y mejor: 1753skin.com. Vendemos directo desde Åsa sin intermediarios, y suele llegar antes que desde una tienda física." },
        { q: "¿La cosmética con CBD ayuda con viento y clima?", a: "Sí, el CBD refuerza la barrera y ayuda a la piel con factores externos como viento, sal y cambios de temperatura. No es una barrera física, pero hace la piel más resistente." },
        { q: "¿Fabricáis en Gotemburgo?", a: "Estamos en Åsa, al sur de Gotemburgo. Desarrollo y envío salen de aquí – cuidado de piel de costa oeste para condiciones de costa oeste." }
      ],
      ctaTitle: "El clima de Gotemburgo pide cosmética que lo entienda",
      ctaSub: "De Åsa a tu puerta – cosmética natural con CBD que entiende tu clima. Envío gratis desde 50 €."
    },
    de: {
      metaTitle: "Hautpflege Göteborg – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege aus Åsa, direkt bei Göteborg. Ab 50 € versandkostenfrei. Schützt deine Haut vor Regen und Meeresluft.",
      kicker: "Hautpflege in Göteborg",
      h1: "Natürliche Hautpflege für Göteborg",
      lead: "Wir wissen, wovon wir reden – wir wohnen gleich nebenan. Regen, Seewind, graue November-Tage. Göteborgs Klima fordert deine Haut anders als Stockholm es je verstehen wird. Online bestellen – ab 50 € versandkostenfrei, und wir sind in Åsa nur eine kurze Lieferung entfernt.",
      problemTitle: "Was Göteborg mit deiner Haut macht",
      problemBody: "<p>Göteborgs ozeanisches Klima ist in Schweden einzigartig. Feuchte Seeluft vom Skagerrak trägt Salz, das sich auf der Haut absetzt und das pH stören kann. Der Regen – ja, der berühmte – bedeutet wenig echte Sonne für Vitamin-D-Produktion, während Wind und Nässe ständig anliegen.</p><p>Paradox: Viele unterschätzen trockene Haut, weil es draußen feucht wirkt. Drinnen sieht es anders aus: beheizte Wohnungen in Majorna und Linnéstaden haben im Winter dieselbe trockene Luft wie überall. Die Haut pendelt zwischen nass und trocken – die Barriere leidet.</p><p>Göteborg ist Hafenstadt mit Industrie; die Luftqualität schwankt. Partikel aus dem Göta-Älv-Gebiet und dem Hafen belasten die Haut, besonders zentral. Dazu der Westküsten-Lifestyle – raus bei jedem Wetter, oft Wind im Gesicht – und klar wird, warum Haut hier Extra-Pflege braucht.</p>",
      tipsTitle: "Hautpflege-Tipps für Göteborg",
      tips: [
        { title: "Meeresluft klug nutzen", body: "Salzige Seeluft kann helfen oder schaden. Kurze Spaziergänge an Saltholmen oder Långedrag bringen Mineralien und frische Luft – danach Gesicht abspülen, um salzbedingte Trockenheit zu vermeiden." },
        { title: "Routinen saisonal anpassen", body: "Göteborgs Jahreszeiten wollen Unterschiedliches. Sommer: Sprühnebel und Sonne brauchen Lichtschutz und leichte Feuchtigkeit. Winter: Regen und Dunkelheit brauchen reicheren Schutz und Barrieren-Fokus." },
        { title: "Immunsystem von innen stärken", body: "Vitamin-D-Mangel ist in Göteborg wegen wenig Sonne verbreitet. D und adaptogene Pilze unterstützen Immunsystem und Hautresilienz." },
        { title: "Vor Wind schützen", body: "Westküstenwind trocknet schnell, besonders am Wasser. Schutzöl als Barriere vor dem Rausgehen – Feuchtigkeit drin, Wind draußen." },
        { title: "Regelmäßig sauna", body: "Göteborger lieben die Sauna – gut für die Haut, Schwitzen reinigt. Danach immer eincremen, sonst verlierst du mehr Feuchtigkeit, als du gewinnst." }
      ],
      solutionTitle: "CBD-Hautpflege von den Nachbarn in Åsa",
      solutionBody: "<p>Wir bei 1753 SKINCARE leben und arbeiten in Åsa, südlich von Göteborg. Wir wissen genau, was das Klima mit der Haut macht – wir leben drin. Unsere Produkte sind dafür entwickelt.</p><p>Das DUO-kit mit The ONE und I LOVE gibt deiner Haut das Gleichgewicht zurück, das Göteborgs Klima ständig stört. CBD und CBG stärken die Barriere gegen Wind, Salz und Feuchtigkeitsschwankungen. Fungtastic Mushroom Extract mit adaptogenen Pilzen unterstützt das Immunsystem von innen – wichtig, wenn die Sonne halbes Jahr weg ist.</p><p>Bestell auf 1753skin.com – Versand aus Åsa, viele Göteborg-Lieferungen schon am nächsten Tag. Ab 50 € versandkostenfrei. Lokal gedacht, direkt zu dir.</p>",
      faq: [
        { q: "Liefert ihr nach Göteborg?", a: "Wir sitzen in Åsa, direkt bei Göteborg – ja, klar. Die meisten Bestellungen sind in 1 Werktag da. Ab 50 € versandkostenfrei." },
        { q: "Wo kaufe ich CBD-Hautpflege in Göteborg?", a: "Am einfachsten über 1753skin.com. Direkt aus Åsa ohne Zwischenhändler – oft schneller als im Laden." },
        { q: "Hilft CBD-Hautpflege gegen Wetter und Wind?", a: "Ja, CBD stärkt die Barriere und hilft der Haut bei Wind, Salz und Temperaturwechseln. Kein physischer Schild, aber mehr Widerstandskraft." },
        { q: "Produziert ihr in Göteborg?", a: "Wir sind in Åsa südlich von Göteborg. Entwicklung und Versand von hier – Westküsten-Pflege für Westküsten-Bedingungen." }
      ],
      ctaTitle: "Göteborgs Klima braucht Pflege, die es versteht",
      ctaSub: "Von Åsa bis vor die Tür – natürliche CBD-Pflege, die dein Klima kennt. Ab 50 € versandkostenfrei."
    },
    fr: {
      metaTitle: "Soin du visage Göteborg – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD depuis Åsa, à côté de Göteborg. Livraison offerte dès 50 €. Protège ta peau de la pluie et de l’air marin.",
      kicker: "Soins à Göteborg",
      h1: "Soins naturels pour Göteborg",
      lead: "On sait de quoi on parle – on habite juste à côté. La pluie, le vent du large, les novembres gris. Le climat de Göteborg teste ta peau d’une façon qu’Stockholm ne comprendra jamais. Commande en ligne – livraison offerte dès 50 €, et on n’est qu’à un envoi, à Åsa.",
      problemTitle: "Ce que Göteborg fait à ta peau",
      problemBody: "<p>Le climat océanique de Göteborg est unique en Suède. L’air humide du Skagerrak charrie du sel qui se dépose sur la peau et peut perturber le pH. La pluie – oui, la célèbre – veut dire peu de vrai soleil pour la vitamine D, tout en exposant la peau à humidité et vent en continu.</p><p>Paradoxe : l’air humide dehors fait croire à beaucoup que la peau est hydratée. À l’intérieur, c’est autre chose : les appartements chauffés de Majorna et Linnéstaden ont le même air sec hivernal qu’ailleurs. La peau oscille entre humide et sec – la barrière en souffre.</p><p>Göteborg est port et industrie ; la qualité de l’air varie. Les particules du Göta älv et du port sollicitent la peau, surtout au centre. Ajoute le mode de vie de la côte ouest – dehors par tous les temps, vent au visage – et tu comprends pourquoi la peau ici mérite un soin en plus.</p>",
      tipsTitle: "Conseils peau pour Göteborg",
      tips: [
        { title: "Utilise l’air marin avec discernement", body: "L’air salé peut aider ou nuire. Courtes balades vers Saltholmen ou Långedrag : minéraux et air pur – puis rince le visage pour éviter le dessèchement lié au sel." },
        { title: "Adapte la routine aux saisons", body: "Les saisons à Göteborg exigent des choses différentes. Été : embruns et soleil = protection légère et SPF. Hiver : pluie et noirceur = textures plus riches et barrière renforcée." },
        { title: "Renforce l’immunité de l’intérieur", body: "Carence en vitamine D fréquente à Göteborg faute de soleil. Compléments en D et champignons adaptogènes soutiennent immunité et peau." },
        { title: "Protège-toi du vent", body: "Le vent de la côte ouest assèche vite, surtout au bord de l’eau. Une huile barrière avant de sortir : elle retient l’humidité et bloque le vent." },
        { title: "Sauna régulière", body: "Les Götebourgeois aiment le sauna – la sueur purifie. Hydrate toujours après, sinon tu perds plus d’eau que tu n’en gagnes." }
      ],
      solutionTitle: "Soins au CBD chez tes voisins à Åsa",
      solutionBody: "<p>Chez 1753 SKINCARE on vit et travaille à Åsa, juste au sud de Göteborg. On sait ce que le climat fait à la peau – on y est dedans tous les jours. Nos produits sont pensés pour ça.</p><p>Le DUO-kit avec The ONE et I LOVE redonne à ta peau l’équilibre que le climat de Göteborg bouscule sans cesse. CBD et CBG renforcent la barrière contre vent, sel et variations d’humidité. Fungtastic Mushroom Extract avec champignons adaptogènes soutient l’immunité de l’intérieur – crucial quand le soleil se cache la moitié de l’année.</p><p>Commande sur 1753skin.com – expédition depuis Åsa, beaucoup de livraisons à Göteborg le lendemain. Livraison offerte dès 50 €. Fait tout près, livré chez toi.</p>",
      faq: [
        { q: "Livrez-vous à Göteborg ?", a: "On est à Åsa, à côté de Göteborg – oui, clairement. La plupart des commandes arrivent en 1 jour ouvré. Livraison offerte dès 50 €." },
        { q: "Où acheter des soins au CBD à Göteborg ?", a: "Le plus simple : 1753skin.com. Vente directe depuis Åsa sans intermédiaire – souvent plus rapide qu’en magasin." },
        { q: "Les soins au CBD aident-ils contre vent et météo ?", a: "Oui, le CBD renforce la barrière et aide la peau face au vent, au sel et aux écarts de température. Ce n’est pas un bouclier physique, mais la peau devient plus résiliente." },
        { q: "Fabriquez-vous à Göteborg ?", a: "On est basés à Åsa au sud de Göteborg. Développement et expédition depuis là – soins « côte ouest » pour conditions de côte ouest." }
      ],
      ctaTitle: "Le climat de Göteborg mérite des soins qui le comprennent",
      ctaSub: "D’Åsa jusqu’à chez toi – soins naturels au CBD qui comprennent ton climat. Livraison offerte dès 50 €."
    }
  },
  {
    svSlug: "hudvard-malmo",
    enSlug: "skincare-malmo",
    esSlug: "cuidado-piel-cbd-malmo",
    deSlug: "cbd-hautpflege-malmo",
    frSlug: "soin-peau-cbd-malmo",
    category: "stad",
    productIds: ["duo-kit", "au-naturel-makeup-remover", "ta-da-serum"],
    sv: {
      metaTitle: "Hudvård Malmö – CBD-baserad hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i Malmö. Beställ online med fri frakt över 700 kr. Skydda din hud mot Öresundsvindarna och kalkhaltigt vatten.",
      kicker: "Hudvård i Malmö",
      h1: "Naturlig hudvård för dig i Malmö",
      lead: "Malmö ger din hud en speciell utmaning: Öresundsvindarna som aldrig riktigt slutar, Sveriges kalkhaltigaste kranvatten och en urban miljö i snabb förändring. Din hud behöver stöd som förstår dina förhållanden. Beställ online – fri frakt över 700 kr.",
      problemTitle: "Malmöhudens utmaningar",
      problemBody: "<p>Malmö har Sveriges hårdaste kranvatten. Kalken i vattnet är inte farlig att dricka, men den torkar ut huden vid tvätt, lämnar en film som täpper till porerna och försvagar hudbarriären över tid. Om du har känslig hud i Malmö kan kranvattnet vara en av de största bovarna utan att du ens vet om det.</p><p>Stadens läge vid Öresund innebär konstant vind. Inte den romantiska sortens havsbris, utan en ihållande, uttorkande vind som suger fukten ur huden – särskilt vintertid. Malmö har fler blåsiga dagar per år än de flesta svenska städer, och det märks på huden.</p><p>Som Sveriges tredje stad har Malmö också sin beskärda del av urban stress: trafikföroreningar, högt tempo och den mångkulturella matscenen som erbjuder fantastisk mat men också potentiella triggers för inflammerad hud. Balansen mellan att njuta av livet och ta hand om huden är en konst som malmöiter behöver bemästra.</p>",
      tipsTitle: "Hudvårdstips för malmöiter",
      tips: [
        { title: "Filtrera ditt vatten", body: "Malmös hårda kranvatten är en av de vanligaste men mest förbisedda orsakerna till torr och irriterad hud. Ett vattenfilter i duschen kan göra dramatisk skillnad, särskilt om du har känslig hud." },
        { title: "Skydda dig mot Öresundsvinden", body: "Vinden vid Ribersborg och Västra hamnen torkar ut huden snabbt. Applicera en skyddande olja som barriär innan du går ut – särskilt under de blåsiga vintermånaderna." },
        { title: "Utnyttja närheten till Köpenhamn", body: "Malmö-Köpenhamn-pendlingen innebär extra exponering för torr tågluft och temperaturväxlingar. Ha en liten fuktgivande olja i väskan för att fylla på under dagen." },
        { title: "Ät Malmös regnbåge av mat klokt", body: "Malmös matmångfald är fantastisk – men kryddstark mat, mejeriprodukter och socker kan trigga inflammation i huden. Njut medvetet och komplettera med antiinflammatorisk kost." }
      ],
      solutionTitle: "CBD-hudvård levererad till din dörr i Malmö",
      solutionBody: "<p>Från Åsa utanför Göteborg till din dörr i Malmö – 1753 SKINCARE levererar naturlig CBD-hudvård som faktiskt fungerar mot Malmös unika hudutmaningar. Fri frakt på beställningar över 700 kr.</p><p>Vår DUO-kit med The ONE och I LOVE stärker hudbarriären som Malmös hårda vatten och vind konstant bryter ner. CBD och CBG arbetar med hudens eget system för att balansera fukt och inflammation. Au Naturel Makeup Remover med MCT-olja rengör djupt utan att förvärra den uttorkning som kalkvatten redan orsakar. TA-DA Serum med koncentrerad CBG ger extra lindring under de mest vindpinade perioderna.</p><p>Skönheten med att beställa online är att du slipper springa runt – produkterna kommer till dig, oavsett om du bor i Möllevången, Limhamn eller Rosengård.</p>",
      faq: [
        { q: "Levererar ni till Malmö?", a: "Ja, vi skickar från Åsa utanför Göteborg. De flesta beställningar når Malmö inom 1–2 arbetsdagar. Fri frakt på beställningar över 700 kr." },
        { q: "Var kan jag köpa CBD-hudvård i Malmö?", a: "Beställ direkt på 1753skin.com – vi säljer utan mellanhänder och levererar till din dörr i Malmö. Smidigare och billigare än fysiska butiker." },
        { q: "Hjälper CBD-hudvård mot hårt vatten?", a: "CBD stärker hudbarriären som hårt vatten försvagar. Det neutraliserar inte kalken, men hjälper huden att hantera påfrestningen bättre och behålla sin fuktbalans." },
        { q: "Kan jag använda era produkter om jag har känslig hud?", a: "Absolut. Våra produkter är fria från parfym, parabener och andra vanliga irritanter. CBD har dessutom lugnande egenskaper som gör det extra lämpat för känslig och reaktiv hud." }
      ],
      ctaTitle: "Malmöhud förtjänar malmöanpassad hudvård",
      ctaSub: "Naturlig CBD-hudvård som stärker din hud mot vind och kalkvatten. Fri frakt över 700 kr."
    },
    en: {
      metaTitle: "Skincare Malmö – CBD-based skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Malmö. Order online with free shipping over €60. Protect your skin from Öresund winds and hard water.",
      kicker: "Skincare in Malmö",
      h1: "Natural skincare for Malmö",
      lead: "Malmö presents a special challenge for your skin: the never-ending Öresund winds, Sweden's hardest tap water, and a rapidly evolving urban environment. Your skin needs support that understands your conditions. Order online – free shipping over €60.",
      problemTitle: "What Malmö does to your skin",
      problemBody: "<p>Malmö has the hardest tap water in Sweden. The calcium isn't dangerous to drink, but it dries out the skin when washing, leaves a film that clogs pores, and weakens the skin barrier over time. If you have sensitive skin in Malmö, tap water might be one of the biggest culprits without you even knowing.</p><p>The city's position by the Öresund strait means constant wind. Not the romantic kind of sea breeze, but a persistent, drying wind that sucks moisture from the skin – especially in winter. Malmö has more windy days per year than most Swedish cities, and your skin notices.</p><p>As Sweden's third largest city, Malmö also has its share of urban stress: traffic pollution, fast pace, and the multicultural food scene that offers amazing cuisine but also potential triggers for inflamed skin. Balancing enjoyment and skincare is an art that Malmö residents need to master.</p>",
      tipsTitle: "Skincare tips for Malmö residents",
      tips: [
        { title: "Filter your water", body: "Malmö's hard tap water is one of the most common but overlooked causes of dry, irritated skin. A shower filter can make a dramatic difference, especially if you have sensitive skin." },
        { title: "Shield yourself from Öresund winds", body: "The wind at Ribersborg and Västra hamnen dries out skin fast. Apply a protective oil as a barrier before heading out – especially during the windy winter months." },
        { title: "Mind the Copenhagen commute", body: "The Malmö-Copenhagen commute means extra exposure to dry train air and temperature shifts. Keep a small moisturizing oil in your bag for top-ups during the day." },
        { title: "Enjoy Malmö's food rainbow wisely", body: "Malmö's food diversity is fantastic – but spicy food, dairy, and sugar can trigger skin inflammation. Enjoy mindfully and complement with anti-inflammatory foods." }
      ],
      solutionTitle: "CBD skincare delivered to your door in Malmö",
      solutionBody: "<p>From Åsa outside Gothenburg to your door in Malmö – 1753 SKINCARE delivers natural CBD skincare that actually works against Malmö's unique skin challenges. Free shipping on orders over €60.</p><p>Our DUO-kit with The ONE and I LOVE strengthens the skin barrier that Malmö's hard water and wind constantly break down. CBD and CBG work with your skin's own system to balance moisture and inflammation. Au Naturel Makeup Remover with MCT oil cleanses deeply without worsening the dryness already caused by hard water. TA-DA Serum with concentrated CBG provides extra relief during the windiest periods.</p><p>The beauty of ordering online is that you skip the hassle – products come to you, whether you live in Möllevången, Limhamn, or Rosengård.</p>",
      faq: [
        { q: "Do you ship to Malmö?", a: "Yes, we ship from Åsa outside Gothenburg. Most orders reach Malmö within 1–2 business days. Free shipping on orders over €60." },
        { q: "Where can I buy CBD skincare in Malmö?", a: "Order directly at 1753skin.com – we sell without middlemen and deliver to your door in Malmö. Easier and cheaper than physical stores." },
        { q: "Does CBD skincare help with hard water?", a: "CBD strengthens the skin barrier that hard water weakens. It doesn't neutralize the calcium, but helps the skin handle the stress better and maintain its moisture balance." },
        { q: "Can I use your products if I have sensitive skin?", a: "Absolutely. Our products are free from perfume, parabens, and other common irritants. CBD also has calming properties that make it especially suitable for sensitive and reactive skin." }
      ],
      ctaTitle: "Malmö skin deserves Malmö-adapted skincare",
      ctaSub: "Natural CBD skincare that strengthens your skin against wind and hard water. Free shipping over €60."
    },
    es: {
      metaTitle: "Cuidado de la piel Malmö – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Malmö. Pide online, envío gratis desde 50 €. Protege tu piel del viento del Öresund y del agua dura.",
      kicker: "Cuidado de la piel en Malmö",
      h1: "Cosmética natural para Malmö",
      lead: "Malmö plantea un reto especial: vientos del Öresund que no acaban, el agua del grifo más dura de Suecia y una ciudad en rápida transformación. Tu piel necesita apoyo que entienda tu entorno. Pide online – envío gratis desde 50 €.",
      problemTitle: "Lo que Malmö le hace a tu piel",
      problemBody: "<p>Malmö tiene el agua del grifo más dura de Suecia. El calcio no es peligroso de beber, pero al lavarte reseca la piel, deja una película que puede obstruir poros y debilita la barrera con el tiempo. Si tienes piel sensible en Malmö, el agua puede ser uno de los culpables sin que lo sepas.</p><p>La posición junto al Öresund significa viento constante. No la brisa romántica, sino un viento persistente que chupa humedad de la piel, sobre todo en invierno. Malmö tiene más días ventosos al año que muchas ciudades suecas, y la piel lo nota.</p><p>Como tercera ciudad del país, Malmö suma estrés urbano: tráfico, ritmo y una escena gastronómica multicultural increíble pero con posibles desencadenantes de inflamación en la piel. Equilibrar disfrute y cuidado es un arte que aquí conviene dominar.</p>",
      tipsTitle: "Consejos para quien vive en Malmö",
      tips: [
        { title: "Filtra el agua", body: "El agua dura de Malmö es una causa muy común y muy ignorada de piel seca e irritada. Un filtro en la ducha puede cambiarlo todo si tu piel es sensible." },
        { title: "Protégete del viento del Öresund", body: "En Ribersborg y Västra hamnen el viento reseca rápido. Aceite protector como barrera antes de salir – sobre todo en invierno ventoso." },
        { title: "Ojo al trayecto a Copenhague", body: "El pendlar Malmö–Copenhague suma aire seco de tren y cambios de temperatura. Lleva un aceite pequeño en el bolso para retocar." },
        { title: "Disfruta la variedad gastronómica con cabeza", body: "La oferta en Malmö es brutal – pero picante, lácteos y azúcar pueden disparar inflamación en la piel. Disfruta con intención y suma alimentos antiinflamatorios." }
      ],
      solutionTitle: "Cosmética con CBD a tu puerta en Malmö",
      solutionBody: "<p>De Åsa (cerca de Gotemburgo) a tu puerta en Malmö: 1753 SKINCARE lleva cosmética natural con CBD que responde de verdad a los retos de la piel aquí. Envío gratis en pedidos superiores a 50 €.</p><p>Nuestro DUO-kit con The ONE y I LOVE refuerza la barrera que el agua dura y el viento desgastan. CBD y CBG trabajan con el sistema propio de la piel para equilibrar humedad e inflamación. Au Naturel Makeup Remover con aceite MCT limpia en profundidad sin empeorar la sequedad que el agua dura ya provoca. TA-DA Serum con CBG concentrado aporta alivio extra en los periodos más ventosos.</p><p>Lo bueno de pedir online es que no corres de tienda en tienda: te llega a casa, estés en Möllevången, Limhamn o Rosengård.</p>",
      faq: [
        { q: "¿Envían a Malmö?", a: "Sí, enviamos desde Åsa cerca de Gotemburgo. La mayoría de pedidos llegan en 1–2 días laborables. Envío gratis desde 50 €." },
        { q: "¿Dónde compro cosmética con CBD en Malmö?", a: "Directo en 1753skin.com – sin intermediarios, a tu puerta en Malmö. Más fácil y suele salir mejor que en tienda física." },
        { q: "¿La cosmética con CBD ayuda con el agua dura?", a: "El CBD refuerza la barrera que el agua dura debilita. No neutraliza el calcio, pero ayuda a la piel a aguantar mejor y mantener el equilibrio hídrico." },
        { q: "¿Puedo usar vuestros productos con piel sensible?", a: "Sí. Sin perfume ni parabenos ni irritantes habituales. El CBD además calma – encaja muy bien en pieles sensibles y reactivas." }
      ],
      ctaTitle: "La piel en Malmö merece cosmética pensada para Malmö",
      ctaSub: "Cosmética natural con CBD que refuerza tu piel frente a viento y agua dura. Envío gratis desde 50 €."
    },
    de: {
      metaTitle: "Hautpflege Malmö – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für Malmö. Online bestellen, ab 50 € versandkostenfrei. Schützt vor Öresund-Wind und hartem Wasser.",
      kicker: "Hautpflege in Malmö",
      h1: "Natürliche Hautpflege für Malmö",
      lead: "Malmö stellt deine Haut vor ein besonderes Programm: endlose Öresund-Winde, Schwedens härtestes Leitungswasser und eine Stadt im Wandel. Deine Haut braucht Unterstützung, die die Bedingungen kennt. Online bestellen – ab 50 € versandkostenfrei.",
      problemTitle: "Was Malmö mit deiner Haut macht",
      problemBody: "<p>Malmö hat das härteste Leitungswasser Schwedens. Kalk ist nicht giftig zum Trinken, aber beim Waschen trocknet er die Haut aus, hinterlässt einen Film, der Poren verstopfen kann, und schwächt die Barriere langfristig. Bei empfindlicher Haut in Malmö kann Wasser ein Hauptverdächtiger sein, ohne dass du es merkst.</p><p>Die Lage am Öresund bedeutet ständigen Wind. Keine romantische Brise, sondern anhaltender Trockenwind, der der Haut Feuchtigkeit entzieht – besonders im Winter. Malmö hat mehr windige Tage als viele andere schwedische Städte, und die Haut spürt das.</p><p>Als drittgrößte Stadt kommen urbaner Stress, Verkehr und eine fantastische, multikulturelle Food-Szene dazu – mit möglichen Triggern für entzündliche Haut. Genuss und Pflege in Balance zu halten ist hier eine Kunst.</p>",
      tipsTitle: "Hautpflege-Tipps für Malmö",
      tips: [
        { title: "Wasser filtern", body: "Malmös hartes Wasser ist eine häufige, aber übersehene Ursache für trockene, gereizte Haut. Ein Duschfilter kann vor allem bei sensibler Haut viel ändern." },
        { title: "Vor Öresund-Wind schützen", body: "Wind an Ribersborg und Västra hamnen trocknet schnell. Schutzöl als Barriere vor dem Rausgehen – besonders in windigen Wintermonaten." },
        { title: "Pendeln nach Kopenhagen im Blick", body: "Malmö–Kopenhagen bedeutet trockene Zugluft und Temperaturwechsel. Kleines Feuchtigkeitsöl in der Tasche für zwischendurch." },
        { title: "Malmös kulinarische Vielfalt clever genießen", body: "Die Szene ist großartig – aber scharf, Milchprodukte und Zucker können Hautentzündungen triggern. Bewusst genießen und entzündungsarme Ergänzung." }
      ],
      solutionTitle: "CBD-Hautpflege bis vor die Tür in Malmö",
      solutionBody: "<p>Von Åsa bei Göteborg bis vor deine Tür in Malmö – 1753 SKINCARE liefert natürliche CBD-Pflege, die wirklich zu Malmös Haut-Herausforderungen passt. Ab 50 € versandkostenfrei.</p><p>Unser DUO-kit mit The ONE und I LOVE stärkt die Barriere, die hartes Wasser und Wind ständig angreifen. CBD und CBG arbeiten mit dem eigenen System der Haut für Feuchtigkeit und Entzündungsbalance. Au Naturel Makeup Remover mit MCT-Öl reinigt tief, ohne die Trockenheit zu verschlimmern, die hartes Wasser schon verursacht. TA-DA Serum mit konzentriertem CBG gibt in den windigsten Phasen extra Relief.</p><p>Online bestellen heißt: kein Shop-Marathon – es kommt zu dir, ob Möllevången, Limhamn oder Rosengård.</p>",
      faq: [
        { q: "Liefert ihr nach Malmö?", a: "Ja, wir versenden aus Åsa bei Göteborg. Die meisten Bestellungen sind in 1–2 Werktagen da. Ab 50 € versandkostenfrei." },
        { q: "Wo kaufe ich CBD-Hautpflege in Malmö?", a: "Direkt auf 1753skin.com – ohne Zwischenhändler bis vor die Tür. Einfacher und oft günstiger als im Laden." },
        { q: "Hilft CBD-Hautpflege bei hartem Wasser?", a: "CBD stärkt die Barriere, die hartes Wasser schwächt. Es neutralisiert keinen Kalk, aber die Haut kommt besser zurecht und behält Feuchtigkeit besser." },
        { q: "Kann ich eure Produkte bei empfindlicher Haut nutzen?", a: "Ja. Ohne Parfüm, Parabene und übliche Irritantien. CBD beruhigt zusätzlich – ideal für sensible, reaktive Haut." }
      ],
      ctaTitle: "Haut in Malmö verdient Malmö-taugliche Pflege",
      ctaSub: "Natürliche CBD-Pflege, die Haut gegen Wind und hartes Wasser stärkt. Ab 50 € versandkostenfrei."
    },
    fr: {
      metaTitle: "Soin du visage Malmö – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Malmö. Commande en ligne, livraison offerte dès 50 €. Protège ta peau du vent de l’Öresund et de l’eau très calcaire.",
      kicker: "Soins à Malmö",
      h1: "Soins naturels pour Malmö",
      lead: "Malmö, c’est un défi particulier pour la peau : les vents de l’Öresund qui ne lâchent pas, l’eau du robinet la plus dure de Suède, et une ville qui change vite. Ta peau a besoin d’un soutien qui comprend le terrain. Commande en ligne – livraison offerte dès 50 €.",
      problemTitle: "Ce que Malmö fait à ta peau",
      problemBody: "<p>Malmö a l’eau du robinet la plus dure de Suède. Le calcium n’est pas dangereux à boire, mais au lavage il assèche, laisse un film qui peut boucher les pores et fragilise la barrière avec le temps. Peau sensible à Malmö : l’eau peut être le coupable sans que tu le saches.</p><p>La position sur l’Öresund veut dire vent permanent. Pas la brise idyllique : un vent sec et tenace qui aspire l’humidité de la peau, surtout en hiver. Malmö compte plus de jours de vent que beaucoup d’autres villes suédoises – la peau le sent.</p><p>Troisième ville du pays, Malmö cumule stress urbain, circulation et une scène food multiculturelle géniale mais parfois déclenchante pour une peau inflammée. Trouver l’équilibre entre plaisir et soin, ici, c’est un art.</p>",
      tipsTitle: "Conseils peau pour Malmö",
      tips: [
        { title: "Filtre ton eau", body: "L’eau dure de Malmö est une cause fréquente et méconnue de peau sèche et irritée. Un filtre de douche peut tout changer si ta peau est sensible." },
        { title: "Pare-toi au vent de l’Öresund", body: "À Ribersborg et Västra hamnen le vent assèche vite. Huile barrière avant de sortir – surtout l’hiver quand ça souffle." },
        { title: "Pense au trajet vers Copenhague", body: "Le pendulaire Malmö–Copenhague ajoute air sec de train et écarts de température. Garde une petite huile hydratante dans le sac." },
        { title: "Savoure la diversité culinaire avec méthode", body: "La scène à Malmö est top – mais épicé, produits laitiers et sucre peuvent déclencher l’inflammation cutanée. Profite en conscience et complète avec des aliments anti-inflammatoires." }
      ],
      solutionTitle: "Soins au CBD livrés chez toi à Malmö",
      solutionBody: "<p>D’Åsa près de Göteborg jusqu’à ta porte à Malmö : 1753 SKINCARE livre des soins naturels au CBD qui répondent vraiment aux défis locaux. Livraison offerte dès 50 €.</p><p>Notre DUO-kit avec The ONE et I LOVE renforce la barrière que l’eau dure et le vent usent. CBD et CBG s’alignent sur le système propre de la peau pour équilibrer hydratation et inflammation. Au Naturel Makeup Remover à l’huile MCT nettoie en profondeur sans aggraver la sécheresse déjà causée par l’eau calcaire. TA-DA Serum au CBG concentré apporte un soutien supplémentaire dans les périodes les plus venteuses.</p><p>Commander en ligne, c’est éviter la course aux magasins : ça vient chez toi, que tu sois à Möllevången, Limhamn ou Rosengård.</p>",
      faq: [
        { q: "Livrez-vous à Malmö ?", a: "Oui, on expédie depuis Åsa près de Göteborg. La plupart des commandes arrivent en 1–2 jours ouvrés. Livraison offerte dès 50 €." },
        { q: "Où acheter des soins au CBD à Malmö ?", a: "Directement sur 1753skin.com – sans intermédiaire, à ton domicile à Malmö. Plus simple et souvent plus avantageux qu’en magasin." },
        { q: "Les soins au CBD aident-ils contre l’eau dure ?", a: "Le CBD renforce la barrière que l’eau dure fragilise. Ça ne neutralise pas le calcaire, mais la peau gère mieux le stress et garde son équilibre hydrique." },
        { q: "Puis-je utiliser vos produits si j’ai la peau sensible ?", a: "Oui. Sans parfum, parabènes ni irritants courants. Le CBD apaise en plus – très adapté aux peaux sensibles et réactives." }
      ],
      ctaTitle: "La peau à Malmö mérite des soins pensés pour Malmö",
      ctaSub: "Soins naturels au CBD qui renforcent ta peau contre vent et eau dure. Livraison offerte dès 50 €."
    }
  },
  {
    svSlug: "hudvard-uppsala",
    enSlug: "skincare-uppsala",
    esSlug: "cuidado-piel-cbd-uppsala",
    deSlug: "cbd-hautpflege-uppsala",
    frSlug: "soin-peau-cbd-uppsala",
    category: "stad",
    productIds: ["duo-kit", "fungtastic-mushroom-extract", "ta-da-serum"],
    sv: {
      metaTitle: "Hudvård Uppsala – CBD-baserad hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i Uppsala. Beställ online med fri frakt över 700 kr. Vetenskapligt förankrad hudvård för den medvetna uppsalbon.",
      kicker: "Hudvård i Uppsala",
      h1: "Naturlig hudvård för dig i Uppsala",
      lead: "Uppsala är en stad som tänker – och din hud förtjänar samma eftertanke. Fyrisåns fukt, kalla inlandsvintrar och hektiska tentaperioder sätter sina spår. Beställ online – fri frakt över 700 kr, levererat direkt till Flogsta eller villakvarteret.",
      problemTitle: "Uppsalahudens utmaningar",
      problemBody: "<p>Uppsala har ett typiskt inlandsklimat med kalla, torra vintrar och relativt varma somrar. Temperaturskillnaderna mellan säsongerna är stora – från minus tjugo i januari till plus trettio i juli. Huden ska hantera båda extremerna, och det sliter på barriären. Den torra vinterluften i kombination med uppvärmda föreläsningssalar och bibliotek gör huden uttorkad och slapp.</p><p>Uppsalas kranvatten har medelhög till hög hårdhet, vilket bidrar till torrhet och irritation vid daglig tvätt. Fyrisån och de omgivande lerslätterna skapar dessutom en speciell mikroklimateffekt – fuktig luft som gör att kyla biter extra hårt.</p><p>För Uppsalas stora studentbefolkning tillkommer specifika hudutmaningar: sömnbrist under tentaperioder, stressrelaterade utbrott, tight budget som leder till billiga och aggressiva produkter, och en livsstil som inte alltid prioriterar hudvård. Stress är hudens värsta fiende, och tentastress är en kategori för sig.</p>",
      tipsTitle: "Hudvårdstips för uppsalabor",
      tips: [
        { title: "Gör Stadsskogen till din hudvårdsrutin", body: "En daglig promenad genom Stadsskogen sänker kortisol och ger huden ren luft. Naturen är Uppsalas bästa antistresspiller – använd den, särskilt under tentaperioderna." },
        { title: "Prioritera sömn framför plugg", body: "Huden reparerar sig primärt under sömnen. Åtta timmars sömn gör mer för din hy än någon serum i världen – även om det känns omöjligt under tentaveckorna." },
        { title: "Skydda huden mot den torra inomhusluften", body: "Universitetets föreläsningssalar och Carolinabiblioteket har extremt torr luft vintertid. Ha en liten fuktgivande olja tillgänglig för att fylla på under dagen." },
        { title: "Ät som en medveten uppsalabo", body: "Uppsalas matscen med lokala producenter och saluhallen ger dig tillgång till omega-3-rik fisk, ekologiska grönsaker och fermenterade livsmedel. Investera i din tallrik." }
      ],
      solutionTitle: "CBD-hudvård levererad till din dörr i Uppsala",
      solutionBody: "<p>Vi vet att uppsalabor är kritiska och kräsna – ni vill ha produkter som håller vad de lovar. 1753 SKINCARE bygger på vetenskap, inte marknadsföringsfluff. CBD och CBG interagerar med hudens endocannabinoidsystem, och forskningsunderlaget växer för varje år.</p><p>DUO-kit ger dig den bas som Uppsalas inlandsklimat kräver – två oljor som stärker barriären och balanserar fukt. Fungtastic Mushroom Extract med adaptogena svampar hjälper kroppen hantera stress inifrån, perfekt för dig som lever i tentastressens epicentrum. TA-DA Serum med CBG ger extra stöd under vinterns torraste perioder.</p><p>Beställ på 1753skin.com – vi skickar från Åsa utanför Göteborg, och leveransen når Uppsala inom 1–2 arbetsdagar. Fri frakt över 700 kr.</p>",
      faq: [
        { q: "Levererar ni till Uppsala?", a: "Ja, vi skickar från Åsa utanför Göteborg och de flesta beställningar når Uppsala inom 1–2 arbetsdagar. Fri frakt på beställningar över 700 kr." },
        { q: "Var kan jag köpa CBD-hudvård i Uppsala?", a: "Beställ direkt på 1753skin.com. Vi säljer online utan mellanhänder – det ger dig bästa pris och snabb leverans direkt till dörren." },
        { q: "Finns det forskning bakom CBD-hudvård?", a: "Ja, och den växer. Studier visar att CBD har antiinflammatoriska, antioxidativa och sebostatiska egenskaper. Hudens endocannabinoidsystem är ett aktivt forskningsområde – passande nog för en universitetsstad som Uppsala." },
        { q: "Passar era produkter studenter med tight budget?", a: "DUO-kit ger dig två produkter som täcker det mesta. Det kostar mer per köp men räcker i månader och ersätter flera billigare produkter som ofta gör mer skada än nytta." }
      ],
      ctaTitle: "Smart hudvård för en smart stad",
      ctaSub: "Vetenskapligt grundad CBD-hudvård direkt till din dörr i Uppsala. Fri frakt över 700 kr."
    },
    en: {
      metaTitle: "Skincare Uppsala – CBD-based skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Uppsala. Order online with free shipping over €60. Science-backed skincare for the conscious Uppsala resident.",
      kicker: "Skincare in Uppsala",
      h1: "Natural skincare for Uppsala",
      lead: "Uppsala is a city that thinks – and your skin deserves the same thoughtfulness. The Fyris river moisture, cold inland winters, and hectic exam periods leave their mark. Order online – free shipping over €60, delivered straight to Flogsta or the villa quarter.",
      problemTitle: "What Uppsala does to your skin",
      problemBody: "<p>Uppsala has a typical inland climate with cold, dry winters and relatively warm summers. The temperature differences between seasons are vast – from minus twenty in January to plus thirty in July. The skin has to handle both extremes, and it wears on the barrier. The dry winter air combined with heated lecture halls and libraries leaves skin dehydrated and dull.</p><p>Uppsala's tap water has medium to high hardness, contributing to dryness and irritation from daily washing. The Fyris river and surrounding clay plains also create a special microclimate effect – humid air that makes the cold bite extra hard.</p><p>For Uppsala's large student population, specific skin challenges emerge: sleep deprivation during exams, stress-related breakouts, tight budgets leading to cheap and aggressive products, and a lifestyle that doesn't always prioritize skincare. Stress is skin's worst enemy, and exam stress is in a league of its own.</p>",
      tipsTitle: "Skincare tips for Uppsala residents",
      tips: [
        { title: "Make Stadsskogen your skincare routine", body: "A daily walk through Stadsskogen lowers cortisol and gives your skin clean air. Nature is Uppsala's best anti-stress remedy – use it, especially during exam periods." },
        { title: "Prioritize sleep over studying", body: "Your skin primarily repairs during sleep. Eight hours of sleep does more for your complexion than any serum in the world – even if it feels impossible during exam weeks." },
        { title: "Protect skin from dry indoor air", body: "The university's lecture halls and Carolina Library have extremely dry air in winter. Keep a small moisturizing oil handy for midday top-ups." },
        { title: "Eat like a conscious Uppsala resident", body: "Uppsala's food scene with local producers and the market hall gives you access to omega-3-rich fish, organic vegetables, and fermented foods. Invest in your plate." }
      ],
      solutionTitle: "CBD skincare delivered to your door in Uppsala",
      solutionBody: "<p>We know Uppsala residents are critical and discerning – you want products that deliver on their promises. 1753 SKINCARE is built on science, not marketing fluff. CBD and CBG interact with the skin's endocannabinoid system, and the research base grows every year.</p><p>The DUO-kit gives you the foundation that Uppsala's inland climate demands – two oils that strengthen the barrier and balance moisture. Fungtastic Mushroom Extract with adaptogenic mushrooms helps the body manage stress from within, perfect if you live in the epicenter of exam stress. TA-DA Serum with CBG provides extra support during winter's driest periods.</p><p>Order at 1753skin.com – we ship from Åsa outside Gothenburg, and delivery reaches Uppsala within 1–2 business days. Free shipping over €60.</p>",
      faq: [
        { q: "Do you ship to Uppsala?", a: "Yes, we ship from Åsa outside Gothenburg and most orders reach Uppsala within 1–2 business days. Free shipping on orders over €60." },
        { q: "Where can I buy CBD skincare in Uppsala?", a: "Order directly at 1753skin.com. We sell online without middlemen – giving you the best price and fast delivery right to your door." },
        { q: "Is there research behind CBD skincare?", a: "Yes, and it's growing. Studies show CBD has anti-inflammatory, antioxidant, and sebostatic properties. The skin's endocannabinoid system is an active research area – fittingly enough for a university city like Uppsala." },
        { q: "Do your products work for students on a tight budget?", a: "The DUO-kit gives you two products that cover most needs. It costs more per purchase but lasts for months and replaces several cheaper products that often do more harm than good." }
      ],
      ctaTitle: "Smart skincare for a smart city",
      ctaSub: "Science-backed CBD skincare to your door in Uppsala. Free shipping over €60."
    },
    es: {
      metaTitle: "Cuidado de la piel Uppsala – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Uppsala. Pide online, envío gratis desde 50 €. Cuidado de la piel con base científica para quien vive con conciencia en Uppsala.",
      kicker: "Cuidado de la piel en Uppsala",
      h1: "Cosmética natural para Uppsala",
      lead: "Uppsala es ciudad que piensa – y tu piel merece la misma atención. La humedad del río Fyris, los inviernos continentales fríos y los exámenes a tope dejan huella. Pide online – envío gratis desde 50 €, a Flogsta o a tu barrio de casas.",
      problemTitle: "Lo que Uppsala le hace a tu piel",
      problemBody: "<p>Uppsala tiene clima continental típico: inviernos fríos y secos y veranos bastante cálidos. Los saltos térmicos entre estaciones son enormes – de veinte bajo cero en enero a más treinta en julio. La piel debe aguantar ambos extremos y la barrera sufre. El aire seco de invierno, más aulas y bibliotecas calefactadas, deja la piel deshidratada y apagada.</p><p>El agua del grifo tiene dureza media-alta, lo que suma sequedad e irritación con el lavado diario. El Fyris y las arcillas de alrededor crean un microclima especial: aire húmedo que hace que el frío muerda más de lo que marca el termómetro.</p><p>Con tanta población estudiantil aparecen retos propios: falta de sueño en exámenes, brotes por estrés, presupuesto justo que empuja a productos baratos y agresivos, y un ritmo que a veces deja el cuidado de la piel para después. El estrés es el peor enemigo de la piel, y el de los exámenes es otra liga.</p>",
      tipsTitle: "Consejos para quien vive en Uppsala",
      tips: [
        { title: "Haz de Stadsskogen tu rutina", body: "Un paseo diario por Stadsskogen baja el cortisol y da aire limpio a la piel. La naturaleza es el mejor antídoto al estrés en Uppsala – úsala, sobre todo en época de exámenes." },
        { title: "Prioriza dormir antes que memorizar", body: "La piel se repara sobre todo durmiendo. Ocho horas hacen más por tu cutis que cualquier serum – aunque en semana de exámenes parezca imposible." },
        { title: "Protege la piel del aire seco interior", body: "En invierno las aulas y la Carolina Library tienen un aire extremadamente seco. Lleva un aceite pequeño para retocar a mediodía." },
        { title: "Come con cabeza, estilo uppsalense", body: "La escena gastronómica con productores locales y el mercado te dan pescado rico en omega-3, verdura ecológica y fermentados. Invierte en el plato." }
      ],
      solutionTitle: "Cosmética con CBD a tu puerta en Uppsala",
      solutionBody: "<p>Sabemos que en Uppsala sois críticos: queréis productos que cumplan. 1753 SKINCARE se apoya en ciencia, no en marketing vacío. CBD y CBG interactúan con el sistema endocannabinoide de la piel, y la evidencia crece cada año.</p><p>El DUO-kit te da la base que exige el clima continental de Uppsala: dos aceites que refuerzan la barrera y equilibran la humedad. Fungtastic Mushroom Extract con hongos adaptógenos ayuda al cuerpo a gestionar el estrés por dentro, ideal si vives en el epicentro de los exámenes. TA-DA Serum con CBG aporta refuerzo en los periodos más secos del invierno.</p><p>Pide en 1753skin.com – enviamos desde Åsa cerca de Gotemburgo; la entrega suele llegar a Uppsala en 1–2 días laborables. Envío gratis desde 50 €.</p>",
      faq: [
        { q: "¿Envían a Uppsala?", a: "Sí, desde Åsa cerca de Gotemburgo. La mayoría de pedidos llegan en 1–2 días laborables. Envío gratis desde 50 €." },
        { q: "¿Dónde compro cosmética con CBD en Uppsala?", a: "En 1753skin.com, venta online sin intermediarios – mejor precio y entrega rápida a tu puerta." },
        { q: "¿Hay investigación detrás del CBD en cosmética?", a: "Sí, y crece. Estudios muestran propiedades antiinflamatorias, antioxidantes y sebostáticas. El sistema endocannabinoide cutáneo es un campo activo – encaja en una ciudad universitaria como Uppsala." },
        { q: "¿Sirven para estudiantes con poco presupuesto?", a: "El DUO-kit son dos productos que cubren casi todo. Cuesta más de golpe pero dura meses y sustituye varios baratos que a menudo empeoran las cosas." }
      ],
      ctaTitle: "Cosmética inteligente para una ciudad inteligente",
      ctaSub: "CBD con base científica hasta tu puerta en Uppsala. Envío gratis desde 50 €."
    },
    de: {
      metaTitle: "Hautpflege Uppsala – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für Uppsala. Online bestellen, ab 50 € versandkostenfrei. Wissenschaftlich fundierte Pflege für anspruchsvolle Uppsala-Bewohner.",
      kicker: "Hautpflege in Uppsala",
      h1: "Natürliche Hautpflege für Uppsala",
      lead: "Uppsala denkt mit – und deine Haut verdient dieselbe Sorgfalt. Feuchtigkeit vom Fyris, kalte Binnenland-Winter und hektische Prüfungsphasen hinterlassen Spuren. Online bestellen – ab 50 € versandkostenfrei, bis nach Flogsta oder ins Villenviertel.",
      problemTitle: "Was Uppsala mit deiner Haut macht",
      problemBody: "<p>Uppsala hat typisches Binnenklima: kalte, trockene Winter und relativ warme Sommer. Die Temperatursprünge zwischen den Jahreszeiten sind groß – von minus zwanzig im Januar bis plus dreißig im Juli. Die Haut muss beide Extreme verkraften, und die Barriere leidet. Trockene Winterluft plus beheizte Hörsäle und Bibliotheken lassen die Haut austrocknen und matt wirken.</p><p>Das Leitungswasser ist mittelhart bis hart und trägt bei täglichem Waschen zu Trockenheit und Reizungen bei. Der Fyris und die umliegenden Tongebiete erzeugen ein Mikroklima mit feuchter Luft, die Kälte schärfer spüren lässt als das Thermometer vermuten lässt.</p><p>Für die große Studentenschaft kommen typische Haut-Themen dazu: Schlafmangel in Prüfungszeiten, stressbedingte Breakouts, knappes Budget mit billigen aggressiven Produkten und ein Lifestyle, der Pflege oft vernachlässigt. Stress ist der schlimmste Hautfeind – Prüfungsstress ist eine eigene Liga.</p>",
      tipsTitle: "Hautpflege-Tipps für Uppsala",
      tips: [
        { title: "Mach Stadsskogen zur Routine", body: "Ein täglicher Gang durch Stadsskogen senkt Cortisol und gibt der Haut saubere Luft. Natur ist Uppsalas bestes Anti-Stress-Mittel – nutze sie, besonders in Prüfungsphasen." },
        { title: "Schlaf vor Büffeln", body: "Die Haut regeneriert vor allem im Schlaf. Acht Stunden tun mehr für deinen Teint als jedes Serum – auch wenn es in Prüfungswochen unmöglich scheint." },
        { title: "Schutz vor trockener Innenluft", body: "Hörsäle und Carolina Library haben im Winter extrem trockene Luft. Kleines Feuchtigkeitsöl für Nachmittags-Touch-ups dabei haben." },
        { title: "Iss bewusst wie ein Uppsala-Bewohner", body: "Lokale Produzenten und Markthalle liefern omega-3-reichen Fisch, Bio-Gemüse und Fermentiertes. Investiere in den Teller." }
      ],
      solutionTitle: "CBD-Hautpflege bis vor die Tür in Uppsala",
      solutionBody: "<p>Wir wissen: In Uppsala seid ihr kritisch – ihr wollt Produkte, die halten, was sie versprechen. 1753 SKINCARE basiert auf Wissenschaft, nicht auf Marketing-Fluff. CBD und CBG wirken mit dem endocannabinoiden System der Haut, und die Studienlage wächst.</p><p>Das DUO-kit gibt dir die Basis fürs Binnenklima von Uppsala – zwei Öle für Barriere und Feuchtigkeitsbalance. Fungtastic Mushroom Extract mit adaptogenen Pilzen unterstützt Stressmanagement von innen, perfekt im Epizentrum der Prüfungszeit. TA-DA Serum mit CBG gibt in den trockensten Winterphasen Extra-Support.</p><p>Bestell auf 1753skin.com – Versand aus Åsa bei Göteborg, Lieferung meist in 1–2 Werktagen in Uppsala. Ab 50 € versandkostenfrei.</p>",
      faq: [
        { q: "Liefert ihr nach Uppsala?", a: "Ja, aus Åsa bei Göteborg. Die meisten Bestellungen sind in 1–2 Werktagen da. Ab 50 € versandkostenfrei." },
        { q: "Wo kaufe ich CBD-Hautpflege in Uppsala?", a: "Direkt auf 1753skin.com – online ohne Zwischenhändler, bester Preis, schnell bis zur Tür." },
        { q: "Gibt es Forschung zu CBD in der Hautpflege?", a: "Ja, und sie wächst. Studien zeigen antiinflammatorische, antioxidative und sebostatische Eigenschaften. Das endocannabinoide System der Haut ist ein aktives Feld – passend für eine Universitätsstadt wie Uppsala." },
        { q: "Passen eure Produkte zu knappem Studentenbudget?", a: "Das DUO-kit deckt mit zwei Produkten fast alles ab. Höherer Einkaufspreis, aber monatelange Haltbarkeit – und es ersetzt billige Produkte, die oft mehr schaden als nutzen." }
      ],
      ctaTitle: "Kluge Pflege für eine kluge Stadt",
      ctaSub: "Wissenschaftlich fundierte CBD-Pflege bis vor die Tür in Uppsala. Ab 50 € versandkostenfrei."
    },
    fr: {
      metaTitle: "Soin du visage Uppsala – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Uppsala. Commande en ligne, livraison offerte dès 50 €. Soins appuyés par la science pour celles et ceux qui vivent à Uppsala avec exigence.",
      kicker: "Soins à Uppsala",
      h1: "Soins naturels pour Uppsala",
      lead: "Uppsala, c’est une ville qui réfléchit – et ta peau mérite la même attention. L’humidité du Fyris, les hivers continentaux froids et les sessions d’examens infernales laissent des traces. Commande en ligne – livraison offerte dès 50 €, jusqu’à Flogsta ou ton quartier pavillonnaire.",
      problemTitle: "Ce qu’Uppsala fait à ta peau",
      problemBody: "<p>Uppsala a un climat continental classique : hivers froids et secs, étés assez chauds. Les écarts entre saisons sont énormes – moins vingt en janvier, plus trente en juillet. La peau doit gérer les deux extrêmes, et la barrière en prend un coup. L’air sec d’hiver, avec amphithéâtres et bibliothèques chauffés, assèche et ternit le teint.</p><p>L’eau du robinet est moyennement à très dure, ce qui ajoute sécheresse et irritation au lavage quotidien. Le Fyris et les plaines argileuses autour créent un microclimat humide qui rend le froid plus mordant que ne le suggère le thermomètre.</p><p>Avec une grosse population étudiante : manque de sommeil aux examens, poussées d’acné liées au stress, budget serré et produits agressifs bon marché, et un mode de vie qui repousse parfois les soins. Le stress est l’ennemi numéro un de la peau – et le stress des partiels, c’est encore autre chose.</p>",
      tipsTitle: "Conseils peau pour Uppsala",
      tips: [
        { title: "Fais de Stadsskogen ta routine", body: "Une balade quotidienne à Stadsskogen fait baisser le cortisol et offre de l’air pur à la peau. La nature est le meilleur anti-stress d’Uppsala – surtout aux examens." },
        { title: "Priorise le sommeil au récitatif", body: "La peau se répare surtout en dormant. Huit heures valent mieux que n’importe quel sérum – même si en semaine de partiels ça semble impossible." },
        { title: "Protège-toi de l’air sec des bâtiments", body: "Les amphis et la Carolina Library ont un air d’hiver ultra sec. Garde une petite huile hydratante pour retouches en journée." },
        { title: "Mange en conscience, façon Uppsala", body: "Producteurs locaux et halle couverte : poisson riche en oméga-3, légumes bio, aliments fermentés. Investis dans l’assiette." }
      ],
      solutionTitle: "Soins au CBD livrés chez toi à Uppsala",
      solutionBody: "<p>On sait qu’à Uppsala vous êtes exigeants – vous voulez des produits qui tiennent leurs promesses. 1753 SKINCARE repose sur la science, pas sur le blabla marketing. CBD et CBG dialoguent avec le système endocannabinoïde de la peau, et la littérature scientifique grossit chaque année.</p><p>Le DUO-kit donne la base qu’impose le climat continental d’Uppsala : deux huiles pour barrière et équilibre hydrique. Fungtastic Mushroom Extract aux champignons adaptogènes aide le corps à gérer le stress de l’intérieur – parfait si tu vis l’œil du cyclone des examens. TA-DA Serum au CBG renforce pendant les périodes hivernales les plus sèches.</p><p>Commande sur 1753skin.com – expédition depuis Åsa près de Göteborg, livraison en 1–2 jours ouvrés en général. Livraison offerte dès 50 €.</p>",
      faq: [
        { q: "Livrez-vous à Uppsala ?", a: "Oui, depuis Åsa près de Göteborg. La plupart des commandes arrivent en 1–2 jours ouvrés. Livraison offerte dès 50 €." },
        { q: "Où acheter des soins au CBD à Uppsala ?", a: "Sur 1753skin.com – vente en ligne sans intermédiaire, meilleur prix et livraison rapide à domicile." },
        { q: "Y a-t-il de la recherche sur le CBD en cosmétique ?", a: "Oui, et elle se développe. Des études montrent des effets anti-inflammatoires, antioxydants et sébostatiques. Le système endocannabinoïde cutané est un domaine actif – tout à fait dans l’esprit d’une ville universitaire comme Uppsala." },
        { q: "Ça convient aux étudiants serrés niveau budget ?", a: "Le DUO-kit, ce sont deux produits qui couvrent l’essentiel. Plus cher à l’achat mais ça tient des mois et remplace plusieurs produits bon marché qui font souvent plus de mal que de bien." }
      ],
      ctaTitle: "Des soins malins pour une ville maline",
      ctaSub: "Soins au CBD appuyés par la science jusqu’à chez toi à Uppsala. Livraison offerte dès 50 €."
    }
  },
  {
    svSlug: "hudvard-linkoping",
    enSlug: "skincare-linkoping",
    esSlug: "cuidado-piel-cbd-linkoping",
    deSlug: "cbd-hautpflege-linkoping",
    frSlug: "soin-peau-cbd-linkoping",
    category: "stad",
    productIds: ["duo-kit", "ta-da-serum"],
    sv: {
      metaTitle: "Hudvård Linköping – CBD-baserad hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i Linköping. Beställ online med fri frakt över 700 kr. Skydda din hud mot östgötska inlandsvintrar.",
      kicker: "Hudvård i Linköping",
      h1: "Naturlig hudvård för dig i Linköping",
      lead: "Linköping är en teknikstad med framtiden i blick – men din hud lever i nuet, med kalla östgötska vintrar, torr kontorsluft och stressiga innovationsprojekt. Ge den stöd som matchar din ambitionsnivå. Fri frakt över 700 kr.",
      problemTitle: "Linköpingshudens utmaningar",
      problemBody: "<p>Östergötlands inlandsklimat ger Linköping kalla, torra vintrar och varma somrar med stor temperaturamplitud. Vintrarna kan vara bitande kalla med temperaturer under minus femton, och den torra luften suger fukten ur huden. Sommartid kan temperaturen stiga över trettio grader, och den snabba övergången mellan årstiderna ger huden lite tid att anpassa sig.</p><p>Linköping är en utpräglad kunskaps- och teknikstad med Saab, FOI och universitetet som stora arbetsgivare. Det innebär att många tillbringar långa dagar inomhus framför skärmar, i klimatiserade kontorsmiljöer med torr luft och blått ljus. Skärmtiden påverkar sömnen, som i sin tur påverkar hudens återhämtning.</p><p>Stångån och de omgivande östgötska slätterna skapar ett mikroklimat med fuktig luft som gör att kylan känns råare än temperaturen antyder. Den här kombinationen av rå kyla ute och torr värme inne är särskilt tuff för hudbarriären.</p>",
      tipsTitle: "Hudvårdstips för linköpingsbor",
      tips: [
        { title: "Ta pauser från skärmen", body: "Blått ljus och den uttorkande kontorsluften på teknikföretagen i Mjärdevi är en dålig kombination. Gör det till en vana att ta pauser och gå ut – din hud och dina ögon behöver det." },
        { title: "Utnyttja Trädgårdsföreningen", body: "Linköpings gröna lungor ger dig frisk luft och sänkt stressnivå. En daglig promenad längs Stångån eller genom Trädgårdsföreningen gör skillnad." },
        { title: "Lager på lager – även i hudvården", body: "Precis som du klär dig i lager mot den östgötska kylan, bygg hudvården i lager: rengöring, serum, olja. Varje lager har en funktion." },
        { title: "Prioritera vinterhudvård", body: "Linköpings vintrar kräver extra omsorg. Byt till rikare produkter från oktober till mars och skydda huden med olja innan du går ut i kylan." }
      ],
      solutionTitle: "CBD-hudvård levererad till Linköping",
      solutionBody: "<p>Teknikstaden förtjänar teknikens senaste inom hudvård. CBD-baserad hudvård representerar nästa generation – produkter som arbetar med hudens eget endocannabinoidsystem istället för att forcera resultat med aggressiva kemikalier.</p><p>DUO-kit med The ONE och I LOVE ger din hud den balans som Linköpings torra kontorsluft och kalla vintrar kräver. TA-DA Serum med koncentrerad CBG fungerar som ett booster-lager under de mest krävande perioderna.</p><p>Beställ på 1753skin.com – vi skickar från Åsa utanför Göteborg med fri frakt på beställningar över 700 kr. De flesta leveranser når Linköping inom 1–2 arbetsdagar.</p>",
      faq: [
        { q: "Levererar ni till Linköping?", a: "Ja, vi skickar från Åsa utanför Göteborg och de flesta beställningar når Linköping inom 1–2 arbetsdagar. Fri frakt över 700 kr." },
        { q: "Var kan jag köpa CBD-hudvård i Linköping?", a: "Beställ direkt på 1753skin.com – vi levererar till din dörr i Linköping utan mellanhänder." },
        { q: "Passar CBD-hudvård för torr hud?", a: "Ja, CBD stärker hudbarriären och hjälper huden att behålla fukt. Våra oljor ger dessutom direkt näring till hud som torkas ut av inlandsklimat och kontorsluft." }
      ],
      ctaTitle: "Framtidens hudvård för framtidens stad",
      ctaSub: "CBD-hudvård som arbetar med din hud, inte mot den. Fri frakt över 700 kr till Linköping."
    },
    en: {
      metaTitle: "Skincare Linköping – CBD-based skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Linköping. Order online with free shipping over €60. Protect your skin against harsh inland winters.",
      kicker: "Skincare in Linköping",
      h1: "Natural skincare for Linköping",
      lead: "Linköping is a tech city with eyes on the future – but your skin lives in the present, with cold Östergötland winters, dry office air, and stressful innovation projects. Give it support that matches your ambition. Free shipping over €60.",
      problemTitle: "What Linköping does to your skin",
      problemBody: "<p>Östergötland's inland climate gives Linköping cold, dry winters and warm summers with large temperature swings. Winters can be bitterly cold with temperatures below minus fifteen, and the dry air sucks moisture from the skin. In summer, temperatures can rise above thirty degrees, and the rapid transitions between seasons give skin little time to adapt.</p><p>Linköping is a distinctly knowledge and tech city with Saab, FOI, and the university as major employers. This means many spend long days indoors in front of screens, in climate-controlled offices with dry air and blue light. Screen time affects sleep, which in turn affects the skin's recovery.</p><p>The Stångån river and surrounding Östergötland plains create a microclimate with humid air that makes the cold feel rawer than the temperature suggests. This combination of raw outdoor cold and dry indoor heat is especially tough on the skin barrier.</p>",
      tipsTitle: "Skincare tips for Linköping residents",
      tips: [
        { title: "Take breaks from the screen", body: "Blue light and drying office air at the tech companies in Mjärdevi are a bad combination. Make it a habit to take breaks and go outside – your skin and eyes both need it." },
        { title: "Make use of Trädgårdsföreningen", body: "Linköping's green spaces give you fresh air and lower stress levels. A daily walk along the Stångån or through Trädgårdsföreningen makes a difference." },
        { title: "Layer up – in skincare too", body: "Just as you dress in layers against the Östergötland cold, build your skincare in layers: cleansing, serum, oil. Each layer has a function." },
        { title: "Prioritize winter skincare", body: "Linköping's winters demand extra care. Switch to richer products from October to March and protect skin with oil before heading into the cold." }
      ],
      solutionTitle: "CBD skincare delivered to Linköping",
      solutionBody: "<p>The tech city deserves the latest technology in skincare. CBD-based skincare represents the next generation – products that work with the skin's own endocannabinoid system instead of forcing results with aggressive chemicals.</p><p>The DUO-kit with The ONE and I LOVE gives your skin the balance that Linköping's dry office air and cold winters demand. TA-DA Serum with concentrated CBG works as a booster layer during the most demanding periods.</p><p>Order at 1753skin.com – we ship from Åsa outside Gothenburg with free shipping on orders over €60. Most deliveries reach Linköping within 1–2 business days.</p>",
      faq: [
        { q: "Do you ship to Linköping?", a: "Yes, we ship from Åsa outside Gothenburg and most orders reach Linköping within 1–2 business days. Free shipping over €60." },
        { q: "Where can I buy CBD skincare in Linköping?", a: "Order directly at 1753skin.com – we deliver to your door in Linköping without middlemen." },
        { q: "Is CBD skincare good for dry skin?", a: "Yes, CBD strengthens the skin barrier and helps the skin retain moisture. Our oils also provide direct nourishment to skin dried out by inland climate and office air." }
      ],
      ctaTitle: "Future skincare for a future city",
      ctaSub: "CBD skincare that works with your skin, not against it. Free shipping over €60 to Linköping."
    },
    es: {
      metaTitle: "Cuidado de la piel Linköping – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Linköping. Pide online, envío gratis desde 50 €. Protege tu piel de los inviernos continentales duros.",
      kicker: "Cuidado de la piel en Linköping",
      h1: "Cosmética natural para Linköping",
      lead: "Linköping mira al futuro con ojos de tech – pero tu piel vive el presente: inviernos fríos en Östergötland, aire seco de oficina y proyectos de innovación a presión. Dale un apoyo a la altura de tu ambición. Envío gratis desde 50 €.",
      problemTitle: "Lo que Linköping le hace a tu piel",
      problemBody: "<p>El clima continental de Östergötland da a Linköping inviernos fríos y secos y veranos cálidos con grandes oscilaciones térmicas. En invierno puede hacer menos quince y el aire seco chupa humedad de la piel. En verano se superan los treinta grados y los cambios bruscos de estación no dejan tiempo a la piel para adaptarse.</p><p>Linköping es ciudad de conocimiento y tecnología: Saab, FOI y la universidad concentran jornadas largas ante pantallas, oficinas climatizadas, aire seco y luz azul. Eso afecta al sueño y el sueño a la recuperación de la piel.</p><p>El río Stångån y las llanuras de Östergötland crean un microclima húmedo que hace sentir el frío más crudo de lo que marca el termómetro. Esa mezcla de frío húmedo fuera y calor seco dentro castiga la barrera cutánea.</p>",
      tipsTitle: "Consejos para quien vive en Linköping",
      tips: [
        { title: "Pausas frente a la pantalla", body: "Luz azul y aire seco en Mjärdevi son mala combinación. Sal a la calle a ratos – piel y ojos lo agradecen." },
        { title: "Aprovecha Trädgårdsföreningen", body: "Los pulmones verdes dan aire fresco y menos estrés. Un paseo diario por el Stångån o el parque marca diferencia." },
        { title: "Capas también en cosmética", body: "Como te vistes por capas contra el frío, construye la rutina: limpieza, serum, aceite. Cada capa cumple una función." },
        { title: "Refuerza el invierno", body: "Los inviernos aquí piden más mimo. Texturas más ricas de octubre a marzo y aceite protector antes de salir al frío." }
      ],
      solutionTitle: "Cosmética con CBD con entrega en Linköping",
      solutionBody: "<p>Una ciudad tech merece tecnología de cuidado de piel actual. La cosmética con CBD es el siguiente paso: trabaja con el sistema endocannabinoide de la piel en lugar de forzar con química agresiva.</p><p>El DUO-kit con The ONE y I LOVE equilibra la piel frente al aire seco de oficina y al frío de Linköping. TA-DA Serum con CBG concentrado actúa como capa booster en los momentos más exigentes.</p><p>Pide en 1753skin.com – enviamos desde Åsa cerca de Gotemburgo, envío gratis desde 50 €. La mayoría de envíos llegan en 1–2 días laborables.</p>",
      faq: [
        { q: "¿Envían a Linköping?", a: "Sí, desde Åsa cerca de Gotemburgo. Suele llegar en 1–2 días laborables. Envío gratis desde 50 €." },
        { q: "¿Dónde compro cosmética con CBD en Linköping?", a: "1753skin.com – a tu puerta en Linköping sin intermediarios." },
        { q: "¿La cosmética con CBD va bien para piel seca?", a: "Sí, el CBD refuerza la barrera y ayuda a retener humedad. Nuestros aceites nutren la piel castigada por clima continental y oficinas secas." }
      ],
      ctaTitle: "Cosmética de futuro para una ciudad de futuro",
      ctaSub: "CBD que trabaja con tu piel, no contra ella. Envío gratis desde 50 € a Linköping."
    },
    de: {
      metaTitle: "Hautpflege Linköping – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für Linköping. Online bestellen, ab 50 € versandkostenfrei. Schutz vor harten Binnenland-Wintern.",
      kicker: "Hautpflege in Linköping",
      h1: "Natürliche Hautpflege für Linköping",
      lead: "Linköping blickt tech-in die Zukunft – aber deine Haut lebt im Hier und Jetzt: kalte Östergötland-Winter, trockene Büroluft und stressige Innovationsprojekte. Gib ihr Support, der zu deinem Anspruch passt. Ab 50 € versandkostenfrei.",
      problemTitle: "Was Linköping mit deiner Haut macht",
      problemBody: "<p>Das Binnenklima in Östergötland bringt Linköping kalte, trockene Winter und warme Sommer mit großen Temperatursprüngen. Winter können unter minus fünfzehn fallen, trockene Luft zieht Feuchtigkeit aus der Haut. Im Sommer steigen die Temperaturen über dreißig, und schnelle Jahreszeitenwechsel geben der Haut kaum Zeit zur Anpassung.</p><p>Linköping ist Wissens- und Tech-Stadt mit Saab, FOI und Universität – lange Tage vor Bildschirmen, klimatisierte Büros, trockene Luft, Blaulicht. Das schläft auf den Schlaf und der auf die Hautregeneration.</p><p>Stångån und die Östergötland-Ebene erzeugen feuchte Luft, die Kälte rauer wirken lässt als das Thermometer zeigt. Rohe Kälte draußen und trockene Hitze drinnen – besonders hart für die Barriere.</p>",
      tipsTitle: "Hautpflege-Tipps für Linköping",
      tips: [
        { title: "Pausen vom Bildschirm", body: "Blaulicht und trockene Luft in Mjärdevi sind eine schlechte Kombi. Mach Pausen und geh raus – Haut und Augen brauchen das." },
        { title: "Trädgårdsföreningen nutzen", body: "Grünflächen bringen frische Luft und weniger Stress. Täglich entlang Stångån oder durch den Park – spürbarer Unterschied." },
        { title: "Schichten – auch in der Pflege", body: "Wie Kleidung in Schichten gegen die Kälte: Reinigung, Serum, Öl. Jede Schicht hat ihre Aufgabe." },
        { title: "Winter-Pflege priorisieren", body: "Linköpings Winter brauchen Extra-Fürsorge. Reichere Produkte von Oktober bis März und Schutzöl vor dem Rausgehen." }
      ],
      solutionTitle: "CBD-Hautpflege nach Linköping",
      solutionBody: "<p>Die Tech-Stadt verdient aktuelle Pflege-Tech. CBD-basierte Pflege ist die nächste Generation – arbeitet mit dem eigenen Endocannabinoidsystem der Haut statt mit aggressiver Chemie zu zwingen.</p><p>Das DUO-kit mit The ONE und I LOVE balanciert die Haut gegen trockene Büroluft und kalte Winter. TA-DA Serum mit konzentriertem CBG ist Booster-Schicht in den anspruchsvollsten Phasen.</p><p>Bestell auf 1753skin.com – Versand aus Åsa bei Göteborg, ab 50 € versandkostenfrei. Meist 1–2 Werktage bis Linköping.</p>",
      faq: [
        { q: "Liefert ihr nach Linköping?", a: "Ja, aus Åsa bei Göteborg. Meist 1–2 Werktage. Ab 50 € versandkostenfrei." },
        { q: "Wo kaufe ich CBD-Hautpflege in Linköping?", a: "1753skin.com – bis vor die Tür ohne Zwischenhändler." },
        { q: "Ist CBD-Hautpflege gut bei trockener Haut?", a: "Ja, CBD stärkt die Barriere und hilft, Feuchtigkeit zu halten. Unsere Öle nähren Haut, die unter Binnenklima und Büroluft leidet." }
      ],
      ctaTitle: "Pflege der Zukunft für die Stadt der Zukunft",
      ctaSub: "CBD-Pflege, die mit deiner Haut arbeitet, nicht dagegen. Ab 50 € versandkostenfrei nach Linköping."
    },
    fr: {
      metaTitle: "Soin du visage Linköping – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Linköping. Commande en ligne, livraison offerte dès 50 €. Protège ta peau des hivers continentaux rudes.",
      kicker: "Soins à Linköping",
      h1: "Soins naturels pour Linköping",
      lead: "Linköping a le regard tourné vers la tech – mais ta peau vit le présent : hivers froids en Östergötland, air sec de bureau et projets d’innovation sous pression. Offre-lui un soutien à la hauteur de ton ambition. Livraison offerte dès 50 €.",
      problemTitle: "Ce que Linköping fait à ta peau",
      problemBody: "<p>Le climat continental de l’Östergötland donne à Linköping des hivers froids et secs et des étés chauds à fortes variations. En hiver on peut descendre sous moins quinze, l’air sec aspire l’humidité de la peau. En été les températures dépassent trente degrés et les transitions brutales entre saisons laissent peu de temps d’adaptation.</p><p>Linköping est ville du savoir et de la tech – Saab, FOI, université : longues journées d’écran, bureaux climatisés, air sec, lumière bleue. Ça impacte le sommeil, et le sommeil impacte la réparation cutanée.</p><p>La Stångån et les plaines créent un microclimat humide qui rend le froid plus mordant que ne le dit le thermomètre. Froid humide dehors, chaleur sèche dedans : la barrière trinque.</p>",
      tipsTitle: "Conseils peau pour Linköping",
      tips: [
        { title: "Pauses écran", body: "Lumière bleue et air sec à Mjärdevi : mauvais duo. Sors un peu – peau et yeux disent merci." },
        { title: "Profite de Trädgårdsföreningen", body: "Les espaces verts apportent air pur et moins de stress. Marche quotidienne le long de la Stångån ou dans le parc : ça compte." },
        { title: "Superpose aussi les soins", body: "Comme les couches contre le froid : nettoyage, sérum, huile. Chaque couche a son rôle." },
        { title: "Mets l’accent sur l’hiver", body: "Les hivers ici exigent plus de soin. Produits plus riches d’octobre à mars et huile barrière avant de sortir au froid." }
      ],
      solutionTitle: "Soins au CBD livrés à Linköping",
      solutionBody: "<p>Une ville tech mérite une tech de soins à jour. Les soins au CBD, c’est la génération suivante : ils s’alignent sur le système endocannabinoïde de la peau au lieu de forcer avec des chimies agressives.</p><p>Le DUO-kit avec The ONE et I LOVE rééquilibre la peau face à l’air sec de bureau et au froid de Linköping. TA-DA Serum au CBG concentré joue la couche booster dans les périodes les plus exigeantes.</p><p>Commande sur 1753skin.com – expédition depuis Åsa près de Göteborg, livraison offerte dès 50 €. La plupart des envois arrivent en 1–2 jours ouvrés.</p>",
      faq: [
        { q: "Livrez-vous à Linköping ?", a: "Oui, depuis Åsa près de Göteborg. En général 1–2 jours ouvrés. Livraison offerte dès 50 €." },
        { q: "Où acheter des soins au CBD à Linköping ?", a: "1753skin.com – à ton domicile sans intermédiaire." },
        { q: "Les soins au CBD conviennent aux peaux sèches ?", a: "Oui, le CBD renforce la barrière et aide à retenir l’humidité. Nos huiles nourrissent la peau asséchée par le climat continental et les bureaux secs." }
      ],
      ctaTitle: "Soins d’avenir pour une ville d’avenir",
      ctaSub: "Du CBD qui travaille avec ta peau, pas contre elle. Livraison offerte dès 50 € vers Linköping."
    }
  },
  {
    svSlug: "hudvard-vasteras",
    enSlug: "skincare-vasteras",
    esSlug: "cuidado-piel-cbd-vasteras",
    deSlug: "cbd-hautpflege-vasteras",
    frSlug: "soin-peau-cbd-vasteras",
    category: "stad",
    productIds: ["duo-kit", "au-naturel-makeup-remover"],
    sv: {
      metaTitle: "Hudvård Västerås – CBD-baserad hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i Västerås. Beställ online med fri frakt över 700 kr. Skydda din hud mot Mälarklimatet och torra vintrar.",
      kicker: "Hudvård i Västerås",
      h1: "Naturlig hudvård för dig i Västerås",
      lead: "Västerås vid Mälaren – sommarparadis och vinterutmaning. Fuktiga höstar, iskalla vintrar och den ständiga pendlingen till Stockholm sätter din hud på prov. Beställ naturlig CBD-hudvård online – fri frakt över 700 kr.",
      problemTitle: "Västeråshudens utmaningar",
      problemBody: "<p>Västerås mälarklimat skapar en speciell hudmiljö. Mälaren reglerar temperaturen något men bidrar samtidigt med fukt som gör höstar och vintrar råa och genomträngande. Den kombinationen av fukt och kyla är särskilt påfrestande för hudbarriären – fukten gör att kylan biter djupare än vad termometern visar.</p><p>Många västeråsare pendlar till Stockholm, vilket innebär daglig exponering för torr tågluft, temperaturväxlingar mellan stationer och kontor, och den extra stressen som pendlingen medför. Huden utsätts för en konstant cykel av olika miljöer som den aldrig riktigt hinner anpassa sig till.</p><p>Västerås industritradition med ABB och andra stora företag innebär att en betydande del av befolkningen arbetar i kontorsmiljöer med klimatanläggningar som torkar ut luften. Lunchpromenaden längs Svartån ger visserligen frisk luft, men vintertid går de flesta direkt från kontoret till bilen – och huden får aldrig den paus den behöver.</p>",
      tipsTitle: "Hudvårdstips för västeråsare",
      tips: [
        { title: "Utnyttja Mälaren på sommaren", body: "Bad i Mälaren under sommarhalvåret ger huden mineraler och det kalla vattnet stimulerar blodcirkulationen. Skölj av med sötvatten efteråt och applicera fuktgivande olja." },
        { title: "Skydda huden under pendlingen", body: "Tåget till Stockholm har torr, uppvärmd luft. Applicera en skyddande olja på morgonen och ha en liten flaska i väskan för att fylla på vid behov." },
        { title: "Promenera längs Svartån", body: "Svartåns grönstråk mitt i Västerås ger dig daglig tillgång till frisk luft och en stressreducerande miljö. Gör det till en vana – din hud märker skillnaden." },
        { title: "Anpassa efter Mälarklimatet", body: "Höstens fukt och vinterns kyla kräver rikare produkter. Byt till mer barriärstärkande hudvård från september och håll kvar den till april." }
      ],
      solutionTitle: "CBD-hudvård levererad till Västerås",
      solutionBody: "<p>Från Åsa utanför Göteborg till din dörr i Västerås – 1753 SKINCARE levererar naturlig CBD-hudvård som stärker din hud mot Mälarklimatets påfrestningar. Fri frakt på beställningar över 700 kr.</p><p>DUO-kit med The ONE och I LOVE ger din hud det skydd och den balans som det råa Mälarklimatet kräver. CBD och CBG stärker hudbarriären och motverkar den inflammation som temperaturväxlingar och torr inomhusluft orsakar. Au Naturel Makeup Remover rengör milt efter en lång pendlingsdag utan att stressa huden ytterligare.</p><p>Beställ på 1753skin.com – leverans till Västerås inom 1–2 arbetsdagar.</p>",
      faq: [
        { q: "Levererar ni till Västerås?", a: "Ja, vi skickar från Åsa utanför Göteborg. De flesta beställningar når Västerås inom 1–2 arbetsdagar. Fri frakt över 700 kr." },
        { q: "Var kan jag köpa CBD-hudvård i Västerås?", a: "Beställ direkt på 1753skin.com – vi levererar till din dörr utan mellanhänder eller butikspålägg." },
        { q: "Hjälper CBD-hudvård mot rå kyla?", a: "CBD stärker hudbarriären och hjälper huden att behålla fukt även vid extrema temperaturväxlingar. Det fungerar som ett inre skydd som kompletterar yttre skyddslager." }
      ],
      ctaTitle: "Västeråshud förtjänar bättre",
      ctaSub: "Naturlig CBD-hudvård som stärker din hud mot Mälarklimatet. Fri frakt över 700 kr."
    },
    en: {
      metaTitle: "Skincare Västerås – CBD-based skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Västerås. Order online with free shipping over €60. Protect your skin from the Lake Mälaren climate.",
      kicker: "Skincare in Västerås",
      h1: "Natural skincare for Västerås",
      lead: "Västerås by Lake Mälaren – summer paradise and winter challenge. Damp autumns, freezing winters, and the constant Stockholm commute test your skin. Order natural CBD skincare online – free shipping over €60.",
      problemTitle: "What Västerås does to your skin",
      problemBody: "<p>Västerås's Lake Mälaren climate creates a special skin environment. The lake regulates temperature somewhat but also contributes moisture that makes autumns and winters raw and penetrating. The combination of humidity and cold is especially tough on the skin barrier – the moisture makes the cold bite deeper than the thermometer suggests.</p><p>Many Västerås residents commute to Stockholm, meaning daily exposure to dry train air, temperature shifts between stations and offices, and the extra stress that commuting brings. The skin faces a constant cycle of different environments it never quite adapts to.</p><p>Västerås's industrial tradition with ABB and other major companies means a significant portion of the population works in office environments with climate systems that dry out the air. The lunch walk along Svartån provides fresh air, but in winter most go directly from office to car – and the skin never gets the break it needs.</p>",
      tipsTitle: "Skincare tips for Västerås residents",
      tips: [
        { title: "Make the most of Mälaren in summer", body: "Swimming in Lake Mälaren during summer gives the skin minerals and cold water stimulates blood circulation. Rinse with fresh water afterward and apply moisturizing oil." },
        { title: "Protect skin during the commute", body: "The train to Stockholm has dry, heated air. Apply a protective oil in the morning and keep a small bottle in your bag for touch-ups." },
        { title: "Walk along Svartån", body: "The Svartån green corridor in central Västerås gives you daily access to fresh air and a stress-reducing environment. Make it a habit – your skin notices the difference." },
        { title: "Adapt to the Mälaren climate", body: "Autumn's humidity and winter's cold demand richer products. Switch to more barrier-strengthening skincare from September and keep it through April." }
      ],
      solutionTitle: "CBD skincare delivered to Västerås",
      solutionBody: "<p>From Åsa outside Gothenburg to your door in Västerås – 1753 SKINCARE delivers natural CBD skincare that strengthens your skin against Lake Mälaren's climate demands. Free shipping on orders over €60.</p><p>The DUO-kit with The ONE and I LOVE gives your skin the protection and balance that the raw Mälaren climate requires. CBD and CBG strengthen the skin barrier and counteract inflammation caused by temperature shifts and dry indoor air. Au Naturel Makeup Remover cleanses gently after a long commuting day without further stressing the skin.</p><p>Order at 1753skin.com – delivery to Västerås within 1–2 business days.</p>",
      faq: [
        { q: "Do you ship to Västerås?", a: "Yes, we ship from Åsa outside Gothenburg. Most orders reach Västerås within 1–2 business days. Free shipping over €60." },
        { q: "Where can I buy CBD skincare in Västerås?", a: "Order directly at 1753skin.com – we deliver to your door without middlemen or store markups." },
        { q: "Does CBD skincare help with raw cold?", a: "CBD strengthens the skin barrier and helps it retain moisture even during extreme temperature shifts. It works as an inner shield that complements outer protective layers." }
      ],
      ctaTitle: "Västerås skin deserves better",
      ctaSub: "Natural CBD skincare that strengthens your skin against the Mälaren climate. Free shipping over €60."
    },
    es: {
      metaTitle: "Cuidado de la piel Västerås – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Västerås. Pide online, envío gratis desde 50 €. Protege tu piel del clima del lago Mälaren.",
      kicker: "Cuidado de la piel en Västerås",
      h1: "Cosmética natural para Västerås",
      lead: "Västerås junto al Mälaren – paraíso en verano y reto en invierno. Otoños húmedos, inviernos gélidos y el pendlar constante a Estocolmo ponen a prueba tu piel. Pide cosmética natural con CBD online – envío gratis desde 50 €.",
      problemTitle: "Lo que Västerås le hace a tu piel",
      problemBody: "<p>El clima del Mälaren crea un entorno especial para la piel. El lago modera un poco la temperatura pero aporta humedad que hace otoños e inviernos crudos y penetrantes. Humedad más frío castiga la barrera: el frío cala más hondo de lo que indica el termómetro.</p><p>Muchos van cada día a Estocolmo: aire seco del tren, saltos térmicos entre andén, oficina y calle, más el estrés del trayecto. La piel salta de un ambiente a otro sin acabar de adaptarse.</p><p>La tradición industrial con ABB y grandes empresas significa muchas horas en oficinas con climatización que seca el aire. El paseo del mediodía por Svartån ayuda, pero en invierno muchos pasan del despacho al coche – la piel no respira.</p>",
      tipsTitle: "Consejos para quien vive en Västerås",
      tips: [
        { title: "Aprovecha el Mälaren en verano", body: "Bañarte en el lago en verano aporta minerales y el agua fría estimula la circulación. Enjuaga con agua dulce después y aplica aceite hidratante." },
        { title: "Protege la piel en el pendlar", body: "El tren a Estocolmo lleva aire seco y calefactado. Aceite protector por la mañana y un mini bote en el bolso para retocar." },
        { title: "Camina por Svartån", body: "El corredor verde del Svartån da aire fresco y baja el estrés a diario. Hazlo hábito – la piel lo nota." },
        { title: "Ajusta al clima del Mälaren", body: "La humedad otoñal y el frío invernal piden texturas más ricas. Refuerza la barrera desde septiembre hasta abril." }
      ],
      solutionTitle: "Cosmética con CBD con entrega en Västerås",
      solutionBody: "<p>De Åsa cerca de Gotemburgo a tu puerta en Västerås: 1753 SKINCARE lleva cosmética natural con CBD que refuerza la piel frente a las exigencias del clima del Mälaren. Envío gratis desde 50 €.</p><p>El DUO-kit con The ONE y I LOVE da protección y equilibrio frente al crudo clima lacustre. CBD y CBG refuerzan la barrera y contrarrestan la inflamación por cambios de temperatura y aire interior seco. Au Naturel Makeup Remover limpia con suavidad tras un día de pendlar sin castigar más la piel.</p><p>Pide en 1753skin.com – entrega en Västerås en 1–2 días laborables.</p>",
      faq: [
        { q: "¿Envían a Västerås?", a: "Sí, desde Åsa cerca de Gotemburgo. Suele llegar en 1–2 días laborables. Envío gratis desde 50 €." },
        { q: "¿Dónde compro cosmética con CBD en Västerås?", a: "1753skin.com – a tu puerta sin intermediarios ni recargos de tienda." },
        { q: "¿La cosmética con CBD ayuda con el frío húmedo?", a: "El CBD refuerza la barrera y ayuda a retener humedad aun con cambios bruscos de temperatura. Actúa como apoyo interno junto a capas protectoras externas." }
      ],
      ctaTitle: "La piel en Västerås merece más",
      ctaSub: "Cosmética natural con CBD que refuerza tu piel frente al clima del Mälaren. Envío gratis desde 50 €."
    },
    de: {
      metaTitle: "Hautpflege Västerås – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für Västerås. Online bestellen, ab 50 € versandkostenfrei. Schutz vor Mälaren-Klima.",
      kicker: "Hautpflege in Västerås",
      h1: "Natürliche Hautpflege für Västerås",
      lead: "Västerås am Mälarsee – Sommerparadies, Winter-Herausforderung. Feuchte Herbsttage, eisige Winter und tägliches Pendeln nach Stockholm testen deine Haut. Natürliche CBD-Pflege online – ab 50 € versandkostenfrei.",
      problemTitle: "Was Västerås mit deiner Haut macht",
      problemBody: "<p>Das Mälaren-Klima schafft ein besonderes Haut-Milieu. Der See dämpft Temperaturen etwas, bringt aber Feuchtigkeit, die Herbst und Winter roh und durchdringend macht. Feuchtigkeit plus Kälte strapaziert die Barriere – die Kälte beißt tiefer als das Thermometer zeigt.</p><p>Viele pendeln nach Stockholm: trockene Zugluft, Temperaturwechsel zwischen Bahnhof, Büro und Straße, plus Pendel-Stress. Die Haut springt zwischen Umgebungen, ohne sich richtig einzustellen.</p><p>Industrietradition mit ABB und Großunternehmen bedeutet Büros mit Klimaanlagen, die die Luft austrocknen. Mittagsspaziergang an der Svartån hilft, aber im Winter geht’s oft direkt ins Auto – die Haut bekommt keine Pause.</p>",
      tipsTitle: "Hautpflege-Tipps für Västerås",
      tips: [
        { title: "Mälaren im Sommer nutzen", body: "Baden im See bringt Mineralien, kaltes Wasser regt die Durchblutung an. Danach mit Süßwasser abspülen und feuchtigkeitsspendendes Öl auftragen." },
        { title: "Haut beim Pendeln schützen", body: "Der Zug nach Stockholm hat trockene, beheizte Luft. Morgens Schutzöl, kleine Flasche für Touch-ups." },
        { title: "Entlang Svartån gehen", body: "Die Grünachse gibt täglich frische Luft und Stressabbau. Zur Gewohnheit machen – die Haut merkt es." },
        { title: "Ans Mälaren-Klima anpassen", body: "Herbstfeuchte und Winterkälte brauchen reichere Produkte. Barrieren-Pflege von September bis April." }
      ],
      solutionTitle: "CBD-Hautpflege nach Västerås",
      solutionBody: "<p>Von Åsa bei Göteborg bis vor deine Tür in Västerås – 1753 SKINCARE liefert natürliche CBD-Pflege, die die Haut gegen Mälaren-Bedingungen stärkt. Ab 50 € versandkostenfrei.</p><p>Das DUO-kit mit The ONE und I LOVE gibt Schutz und Balance für das raue Seen-Klima. CBD und CBG stärken die Barriere und wirken Entzündungen entgegen durch Temperaturwechsel und trockene Innenluft. Au Naturel Makeup Remover reinigt mild nach langem Pendeln ohne zusätzliche Belastung.</p><p>Bestell auf 1753skin.com – Lieferung nach Västerås in 1–2 Werktagen.</p>",
      faq: [
        { q: "Liefert ihr nach Västerås?", a: "Ja, aus Åsa bei Göteborg. Meist 1–2 Werktage. Ab 50 € versandkostenfrei." },
        { q: "Wo kaufe ich CBD-Hautpflege in Västerås?", a: "1753skin.com – ohne Zwischenhändler und Ladenaufschlag." },
        { q: "Hilft CBD-Hautpflege bei roher Kälte?", a: "CBD stärkt die Barriere und hilft, Feuchtigkeit auch bei Temperatursprüngen zu halten. Innerer Support ergänzt äußere Schutzschichten." }
      ],
      ctaTitle: "Haut in Västerås verdient mehr",
      ctaSub: "Natürliche CBD-Pflege gegen Mälaren-Klima. Ab 50 € versandkostenfrei."
    },
    fr: {
      metaTitle: "Soin du visage Västerås – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Västerås. Commande en ligne, livraison offerte dès 50 €. Protège ta peau du climat du lac Mälaren.",
      kicker: "Soins à Västerås",
      h1: "Soins naturels pour Västerås",
      lead: "Västerås au bord du Mälaren – paradis l’été, défi l’hiver. Automnes humides, hivers glacés et pendulaire vers Stockholm sans fin. Commande des soins naturels au CBD en ligne – livraison offerte dès 50 €.",
      problemTitle: "Ce que Västerås fait à ta peau",
      problemBody: "<p>Le climat du Mälaren crée un environnement particulier pour la peau. Le lac tempère un peu les températures mais apporte de l’humidité qui rend automnes et hivers crus et pénétrants. Humidité + froid martyrisent la barrière : le froid mord plus profondément que le thermomètre ne le suggère.</p><p>Beaucoup font la navette vers Stockholm : air sec des trains, écarts thermiques quai–bureau–rue, plus le stress du trajet. La peau enchaîne les ambiances sans vraiment s’adapter.</p><p>La tradition industrielle avec ABB et grands employeurs veut dire bureaux climatisés qui assèchent l’air. La balade midi le long de la Svartån aide, mais l’hiver on file souvent du bureau à la voiture – la peau ne respire pas.</p>",
      tipsTitle: "Conseils peau pour Västerås",
      tips: [
        { title: "Profite du Mälaren l’été", body: "Se baigner dans le lac apporte des minéraux ; l’eau froide stimule la circulation. Rince à l’eau douce puis applique une huile hydratante." },
        { title: "Protège la peau en pendulaire", body: "Le train vers Stockholm a un air sec et chauffé. Huile le matin, petit flacon dans le sac pour retouches." },
        { title: "Marche le long de la Svartån", body: "Le couloir vert offre air pur et baisse de stress au quotidien. Prends l’habitude – ta peau le sent." },
        { title: "Adapte-toi au climat du Mälaren", body: "L’humidité d’automne et le froid d’hiver appellent des textures plus riches. Renforce la barrière de septembre à avril." }
      ],
      solutionTitle: "Soins au CBD livrés à Västerås",
      solutionBody: "<p>D’Åsa près de Göteborg jusqu’à chez toi à Västerås : 1753 SKINCARE livre des soins naturels au CBD qui renforcent la peau face aux exigences du climat lacustre. Livraison offerte dès 50 €.</p><p>Le DUO-kit avec The ONE et I LOVE apporte protection et équilibre face au climat rude du lac. CBD et CBG renforcent la barrière et contrebalancent l’inflammation liée aux variations de température et à l’air intérieur sec. Au Naturel Makeup Remover nettoie en douceur après une longue journée de trajets sans agresser davantage.</p><p>Commande sur 1753skin.com – livraison à Västerås en 1–2 jours ouvrés.</p>",
      faq: [
        { q: "Livrez-vous à Västerås ?", a: "Oui, depuis Åsa près de Göteborg. En général 1–2 jours ouvrés. Livraison offerte dès 50 €." },
        { q: "Où acheter des soins au CBD à Västerås ?", a: "1753skin.com – à domicile sans intermédiaire ni majoration magasin." },
        { q: "Les soins au CBD aident-ils contre le froid humide ?", a: "Le CBD renforce la barrière et aide à garder l’humidité malgré les écarts thermiques. C’est un soutien interne qui complète les couches protectrices externes." }
      ],
      ctaTitle: "La peau à Västerås mérite mieux",
      ctaSub: "Soins naturels au CBD qui renforcent ta peau face au climat du Mälaren. Livraison offerte dès 50 €."
    }
  },
  {
    svSlug: "hudvard-orebro",
    enSlug: "skincare-orebro",
    esSlug: "cuidado-piel-cbd-orebro",
    deSlug: "cbd-hautpflege-orebro",
    frSlug: "soin-peau-cbd-orebro",
    category: "stad",
    productIds: ["duo-kit", "fungtastic-mushroom-extract", "au-naturel-makeup-remover"],
    sv: {
      metaTitle: "Hudvård Örebro – CBD-baserad hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i Örebro. Beställ online med fri frakt över 700 kr. Stärk din hud mot Närkeslätten kyla och torra vintrar.",
      kicker: "Hudvård i Örebro",
      h1: "Naturlig hudvård för dig i Örebro",
      lead: "Mitt i Sverige, mitt i Närke – Örebro har ett inlandsklimat som testar huden ordentligt. Kalla vintrar, varma somrar och den typiska slättluften. Din hud behöver stöd som förstår förhållandena. Fri frakt över 700 kr.",
      problemTitle: "Örebrohudens utmaningar",
      problemBody: "<p>Örebro ligger i hjärtat av Närkeslätten, och det märks på klimatet. Inlandsluften är torrare än vid kusten, och temperaturskillnaderna mellan sommar och vinter är stora. Vintrar med temperaturer under minus tjugo är inte ovanliga, och den kalla, torra luften tränger in i varje pore och suger ut fukten.</p><p>Svartån som rinner genom staden skapar visserligen ett vackert stadslandskap, men bidrar också till fuktig dimma under höst och vår – en rå, kall fukt som gör att kylan känns i benen och i huden. Hjälmaren söder om staden förstärker denna effekt.</p><p>Som en mellanstor svensk stad har Örebro en blandning av stadsliv och närhet till natur. Många pendlar med bil, vilket innebär uppvärmd billuft som torkar ut huden, kombinerat med den snabba övergången mellan varm bil och kall utomhusluft. Stressen från arbetslivet syns ofta i huden – utbrott, torrhet, ojämn hudton – men kopplingen görs sällan.</p>",
      tipsTitle: "Hudvårdstips för örebrobor",
      tips: [
        { title: "Utforska Kilsbergen", body: "Skogsluften i Kilsbergen väster om Örebro är fantastisk för både kropp och hud. Regelbundna naturpromenader sänker stresshormoner och ger huden en paus från stadsluften." },
        { title: "Förbered huden för de extrema temperaturskiftena", body: "Örebros stora skillnad mellan inomhus- och utomhustemperatur sliter på huden. Applicera en skyddande olja som barriär innan du går ut, och undvik att ha det för varmt inne." },
        { title: "Drick mer vatten än du tror", body: "Det torra inlandsklimatet avdunstar fukt snabbare än du märker. Sikta på minst två liter vatten om dagen – din hud behöver fukt inifrån lika mycket som utifrån." },
        { title: "Stöd kroppens stresshantering", body: "Adaptogena tillskott som medicinsk svamp kan hjälpa kroppen hantera vardagsstress bättre, vilket direkt påverkar hudens hälsa och utstrålning." }
      ],
      solutionTitle: "CBD-hudvård levererad till Örebro",
      solutionBody: "<p>1753 SKINCARE levererar naturlig CBD-hudvård direkt till din dörr i Örebro. Från Åsa utanför Göteborg till Närkeslätten – fri frakt på beställningar över 700 kr.</p><p>DUO-kit med The ONE och I LOVE ger din hud den näring och det skydd som Örebros inlandsklimat kräver. CBD och CBG stärker barriären och balanserar hudens fuktighet inifrån. Fungtastic Mushroom Extract med adaptogena svampar hjälper kroppen hantera stress – den osynliga fienden som syns i huden. Au Naturel Makeup Remover avslutar dagen med mild rengöring som inte förvärrar torrheten.</p><p>Beställ på 1753skin.com – de flesta leveranser når Örebro inom 1–2 arbetsdagar.</p>",
      faq: [
        { q: "Levererar ni till Örebro?", a: "Ja, vi skickar från Åsa utanför Göteborg och de flesta beställningar når Örebro inom 1–2 arbetsdagar. Fri frakt över 700 kr." },
        { q: "Var kan jag köpa CBD-hudvård i Örebro?", a: "Beställ på 1753skin.com – vi säljer direkt online och levererar hem till dig utan mellanhänder." },
        { q: "Vad gör adaptogena svampar för huden?", a: "Adaptogener som reishi och lion's mane hjälper kroppen hantera stress mer effektivt. Eftersom stress är en av de största drivkrafterna bakom hudproblem, syns effekten ofta i huden – lugnare, jämnare, mer motståndskraftig." }
      ],
      ctaTitle: "Ge din hud Örebroanpassat stöd",
      ctaSub: "Naturlig CBD-hudvård som stärker din hud mot inlandsklimatets utmaningar. Fri frakt över 700 kr."
    },
    en: {
      metaTitle: "Skincare Örebro – CBD-based skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Örebro. Order online with free shipping over €60. Strengthen your skin against the Närke plains cold.",
      kicker: "Skincare in Örebro",
      h1: "Natural skincare for Örebro",
      lead: "In the middle of Sweden, in the heart of Närke – Örebro has an inland climate that really tests the skin. Cold winters, warm summers, and the typical plains air. Your skin needs support that understands the conditions. Free shipping over €60.",
      problemTitle: "What Örebro does to your skin",
      problemBody: "<p>Örebro sits in the heart of the Närke plain, and the climate shows it. Inland air is drier than at the coast, and temperature differences between summer and winter are vast. Winters with temperatures below minus twenty are not uncommon, and the cold, dry air penetrates every pore and drains moisture.</p><p>The Svartån river running through the city creates a beautiful cityscape but also contributes to damp fog during autumn and spring – a raw, cold moisture that makes the chill settle in your bones and your skin. Lake Hjälmaren south of the city amplifies this effect.</p><p>As a mid-sized Swedish city, Örebro offers a mix of city life and proximity to nature. Many commute by car, meaning heated car air that dries out the skin, combined with the rapid shift between warm car and cold outdoors. Work-life stress often shows in the skin – breakouts, dryness, uneven tone – but the connection is rarely made.</p>",
      tipsTitle: "Skincare tips for Örebro residents",
      tips: [
        { title: "Explore Kilsbergen", body: "The forest air in Kilsbergen west of Örebro is fantastic for both body and skin. Regular nature walks lower stress hormones and give your skin a break from city air." },
        { title: "Prepare skin for extreme temperature shifts", body: "Örebro's large difference between indoor and outdoor temperature wears on the skin. Apply a protective oil as a barrier before going out, and avoid keeping it too warm inside." },
        { title: "Drink more water than you think", body: "The dry inland climate evaporates moisture faster than you notice. Aim for at least two liters of water daily – your skin needs hydration from within just as much as from without." },
        { title: "Support your body's stress management", body: "Adaptogenic supplements like medicinal mushrooms can help the body handle everyday stress better, which directly impacts skin health and radiance." }
      ],
      solutionTitle: "CBD skincare delivered to Örebro",
      solutionBody: "<p>1753 SKINCARE delivers natural CBD skincare directly to your door in Örebro. From Åsa outside Gothenburg to the Närke plains – free shipping on orders over €60.</p><p>The DUO-kit with The ONE and I LOVE gives your skin the nourishment and protection that Örebro's inland climate demands. CBD and CBG strengthen the barrier and balance skin moisture from within. Fungtastic Mushroom Extract with adaptogenic mushrooms helps the body manage stress – the invisible enemy that shows on the skin. Au Naturel Makeup Remover ends the day with gentle cleansing that doesn't worsen dryness.</p><p>Order at 1753skin.com – most deliveries reach Örebro within 1–2 business days.</p>",
      faq: [
        { q: "Do you ship to Örebro?", a: "Yes, we ship from Åsa outside Gothenburg and most orders reach Örebro within 1–2 business days. Free shipping over €60." },
        { q: "Where can I buy CBD skincare in Örebro?", a: "Order at 1753skin.com – we sell directly online and deliver to you without middlemen." },
        { q: "What do adaptogenic mushrooms do for the skin?", a: "Adaptogens like reishi and lion's mane help the body handle stress more effectively. Since stress is one of the biggest drivers of skin issues, the effect often shows in the skin – calmer, more even, more resilient." }
      ],
      ctaTitle: "Give your skin Örebro-adapted support",
      ctaSub: "Natural CBD skincare that strengthens your skin against inland climate challenges. Free shipping over €60."
    },
    es: {
      metaTitle: "Cuidado de la piel Örebro – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Örebro. Pide online, envío gratis desde 50 €. Refuerza tu piel frente al frío de la llanura de Närke.",
      kicker: "Cuidado de la piel en Örebro",
      h1: "Cosmética natural para Örebro",
      lead: "En el corazón de Suecia, en el corazón de Närke – Örebro tiene un clima continental que no perdona. Inviernos fríos, veranos cálidos y ese aire de llanura. Tu piel necesita apoyo que entienda el terreno. Envío gratis desde 50 €.",
      problemTitle: "Lo que Örebro le hace a tu piel",
      problemBody: "<p>Örebro está en plena llanura de Närke, y el clima se nota. El aire interior es más seco que en la costa y los saltos entre estaciones son enormes. Inviernos de veinte bajo cero no son raros; el aire frío y seco entra en cada poro y arrastra humedad.</p><p>El río Svartån dibuja un paisaje urbano precioso pero también niebla húmeda en otoño y primavera: frío húmedo que cala en huesos y piel. El lago Hjälmaren al sur refuerza el efecto.</p><p>Ciudad mediana sueca: ciudad y naturaleza cerca. Muchos van en coche: aire calefactado que seca, más el salto brusco de coche caliente a frío exterior. El estrés laboral a menudo se ve en la piel – sequedas, brotes, tono irregular – y casi nadie hace la conexión.</p>",
      tipsTitle: "Consejos para quien vive en Örebro",
      tips: [
        { title: "Explora Kilsbergen", body: "El aire del bosque al oeste de Örebro va bien para cuerpo y piel. Caminatas regulares bajan el estrés y dan un respiro al cutis lejos del aire urbano." },
        { title: "Prepárate para los saltos térmicos", body: "La diferencia dentro-fuera castiga la piel. Aceite barrera antes de salir y evita exceso de calefacción en casa." },
        { title: "Bebe más agua de la que crees", body: "El clima seco interior evaporación rápida. Apunta a al menos dos litros al día – la piel necesita agua de dentro y de fuera." },
        { title: "Apoya el manejo del estrés", body: "Suplementos adaptógenos como hongos medicinales pueden ayudar al estrés diario – y eso se nota en la piel." }
      ],
      solutionTitle: "Cosmética con CBD con entrega en Örebro",
      solutionBody: "<p>1753 SKINCARE lleva cosmética natural con CBD a tu puerta en Örebro. De Åsa cerca de Gotemburgo a la llanura de Närke – envío gratis desde 50 €.</p><p>El DUO-kit con The ONE y I LOVE aporta nutrición y protección que exige el clima continental de Örebro. CBD y CBG refuerzan la barrera y equilibran la humedad. Fungtastic Mushroom Extract con hongos adaptógenos apoya el estrés invisible que se pinta en la piel. Au Naturel Makeup Remover cierra el día con limpieza suave sin empeorar la sequedad.</p><p>Pide en 1753skin.com – la mayoría de envíos llegan en 1–2 días laborables.</p>",
      faq: [
        { q: "¿Envían a Örebro?", a: "Sí, desde Åsa cerca de Gotemburgo. Suele llegar en 1–2 días laborables. Envío gratis desde 50 €." },
        { q: "¿Dónde compro cosmética con CBD en Örebro?", a: "1753skin.com – venta directa online a tu casa sin intermediarios." },
        { q: "¿Qué hacen los hongos adaptógenos por la piel?", a: "Adaptógenos como reishi y lion's mane ayudan al cuerpo a gestionar el estrés. Como el estrés impulsa muchos problemas de piel, a menudo se ve un cutis más calmado y uniforme." }
      ],
      ctaTitle: "Tu piel en Örebro merece apoyo de verdad",
      ctaSub: "Cosmética natural con CBD que refuerza tu piel frente al clima continental. Envío gratis desde 50 €."
    },
    de: {
      metaTitle: "Hautpflege Örebro – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für Örebro. Online bestellen, ab 50 € versandkostenfrei. Stärkt die Haut gegen Närke-Ebene-Kälte.",
      kicker: "Hautpflege in Örebro",
      h1: "Natürliche Hautpflege für Örebro",
      lead: "Mitten in Schweden, im Herzen von Närke – Örebro hat ein Binnenklima, das die Haut ernst nimmt. Kalte Winter, warme Sommer und typische Ebenenluft. Deine Haut braucht Unterstützung, die die Bedingungen kennt. Ab 50 € versandkostenfrei.",
      problemTitle: "Was Örebro mit deiner Haut macht",
      problemBody: "<p>Örebro liegt im Herzen der Närke-Ebene – das Klima zeigt es. Binnenlandluft ist trockener als an der Küste, die Temperaturschwankungen zwischen den Jahreszeiten sind groß. Winter unter minus zwanzig sind keine Seltenheit; kalte, trockene Luft zieht jede Pore aus.</p><p>Die Svartån durch die Stadt schafft schöne Stadtbilder, aber auch neblige Feuchtigkeit im Herbst und Frühling – rohe Kälte, die in Knochen und Haut sitzt. Der Hjälmaren südlich verstärkt den Effekt.</p><p>Als mittelgroße schwedische Stadt: Stadt und Natur nah. Viele pendeln mit dem Auto: beheizte Luft trocknet aus, plus schneller Wechsel warmes Auto zu kalt draußen. Jobstress zeigt sich oft an der Haut – Trockenheit, Breakouts, ungleicher Teint – selten wird der Zusammenhang gesehen.</p>",
      tipsTitle: "Hautpflege-Tipps für Örebro",
      tips: [
        { title: "Kilsbergen erkunden", body: "Waldluft westlich von Örebro tut Körper und Haut gut. Regelmäßige Naturgänge senken Stress und geben der Haut Pause vom Stadtair." },
        { title: "Auf extreme Temperaturwechsel vorbereiten", body: "Großer Unterschied drinnen/draußen strapaziert die Haut. Schutzöl vor dem Rausgehen, drinnen nicht überheizen." },
        { title: "Mehr trinken als du denkst", body: "Trockenes Binnenklima verdunstet Feuchtigkeit schneller, als du merkst. Mindestens zwei Liter täglich – die Haut braucht Wasser von innen und außen." },
        { title: "Stressmanagement unterstützen", body: "Adaptogene wie Heilpilze können den Alltagsstress besser handhabbar machen – das wirkt direkt auf Hautgesundheit und Strahlen." }
      ],
      solutionTitle: "CBD-Hautpflege nach Örebro",
      solutionBody: "<p>1753 SKINCARE liefert natürliche CBD-Pflege direkt nach Örebro. Von Åsa bei Göteborg auf die Närke-Ebene – ab 50 € versandkostenfrei.</p><p>Das DUO-kit mit The ONE und I LOVE gibt Nahrung und Schutz, die Örebros Binnenklima verlangt. CBD und CBG stärken die Barriere und balancieren Feuchtigkeit. Fungtastic Mushroom Extract mit adaptogenen Pilzen unterstützt den unsichtbaren Stress, der auf der Haut sichtbar wird. Au Naturel Makeup Remover beendet den Tag mild, ohne Trockenheit zu verschlimmern.</p><p>Bestell auf 1753skin.com – meist 1–2 Werktage bis Örebro.</p>",
      faq: [
        { q: "Liefert ihr nach Örebro?", a: "Ja, aus Åsa bei Göteborg. Meist 1–2 Werktage. Ab 50 € versandkostenfrei." },
        { q: "Wo kaufe ich CBD-Hautpflege in Örebro?", a: "1753skin.com – direkt online ohne Zwischenhändler." },
        { q: "Was tun adaptogene Pilze für die Haut?", a: "Adaptogene wie Reishi und Löwenmähne helfen dem Körper, Stress besser zu managen. Da Stress ein großer Treiber für Hautprobleme ist, wirkt sich das oft in ruhigerer, gleichmäßigerer Haut aus." }
      ],
      ctaTitle: "Haut in Örebro verdient passenden Support",
      ctaSub: "Natürliche CBD-Pflege gegen Binnenklima-Herausforderungen. Ab 50 € versandkostenfrei."
    },
    fr: {
      metaTitle: "Soin du visage Örebro – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Örebro. Commande en ligne, livraison offerte dès 50 €. Renforce ta peau face au froid des plaines de Närke.",
      kicker: "Soins à Örebro",
      h1: "Soins naturels pour Örebro",
      lead: "Au cœur de la Suède, au cœur du Närke – Örebro impose un climat continental qui ne plaisante pas. Hivers froids, étés chauds et cet air de plaine. Ta peau a besoin d’un soutien qui connaît le terrain. Livraison offerte dès 50 €.",
      problemTitle: "Ce qu’Örebro fait à ta peau",
      problemBody: "<p>Örebro est au cœur de la plaine du Närke, et le climat le rappelle. L’air intérieur est plus sec qu’au bord de mer et les écarts entre saisons sont énormes. Des hivers à moins vingt ne surprennent personne ; l’air froid et sec s’infiltre dans chaque pore et draine l’humidité.</p><p>La Svartån traverse la ville avec beauté, mais aussi brouillard humide en automne et printemps : un froid cru qui mord dans les os et la peau. Le lac Hjälmaren au sud amplifie l’effet.</p><p>Ville suédoise moyenne : urbain et nature proches. Beaucoup roulent en voiture : air chauffé qui assèche, plus le choc entre voiture tiède et froid dehors. Le stress du travail se lit souvent sur la peau – sécheresse, poussées, teint irrégulier – sans qu’on fasse le lien.</p>",
      tipsTitle: "Conseils peau pour Örebro",
      tips: [
        { title: "Explore Kilsbergen", body: "L’air de forêt à l’ouest d’Örebro fait du bien au corps et à la peau. Marches régulières : moins de stress, pause cutanée loin de l’air urbain." },
        { title: "Anticipe les chocs thermiques", body: "Gros écart intérieur-extérieur : la peau trinque. Huile barrière avant de sortir, évite la surchauffe chez toi." },
        { title: "Bois plus que tu ne crois", body: "Climat sec intérieur : l’évaporation file vite. Vise au moins deux litres par jour – la peau veut de l’eau dedans et dehors." },
        { title: "Soutiens la gestion du stress", body: "Compléments adaptogènes comme les champignons médicinaux peuvent aider au stress du quotidien – avec effet visible sur la peau." }
      ],
      solutionTitle: "Soins au CBD livrés à Örebro",
      solutionBody: "<p>1753 SKINCARE livre des soins naturels au CBD directement chez toi à Örebro. D’Åsa près de Göteborg jusqu’à la plaine du Närke – livraison offerte dès 50 €.</p><p>Le DUO-kit avec The ONE et I LOVE apporte nutrition et protection face au climat continental d’Örebro. CBD et CBG renforcent la barrière et équilibrent l’hydratation. Fungtastic Mushroom Extract aux champignons adaptogènes soutient le stress invisible qui se lit sur le visage. Au Naturel Makeup Remover termine la journée en douceur sans aggraver la sécheresse.</p><p>Commande sur 1753skin.com – en général 1–2 jours ouvrés jusqu’à Örebro.</p>",
      faq: [
        { q: "Livrez-vous à Örebro ?", a: "Oui, depuis Åsa près de Göteborg. En général 1–2 jours ouvrés. Livraison offerte dès 50 €." },
        { q: "Où acheter des soins au CBD à Örebro ?", a: "1753skin.com – vente directe en ligne sans intermédiaire." },
        { q: "Que font les champignons adaptogènes pour la peau ?", a: "Des adaptogènes comme reishi et lion's mane aident le corps à mieux gérer le stress. Comme le stress pilote beaucoup de problèmes de peau, on voit souvent un teint plus calme et plus uni." }
      ],
      ctaTitle: "Ta peau à Örebro mérite un vrai soutien",
      ctaSub: "Soins naturels au CBD qui renforcent ta peau face au climat continental. Livraison offerte dès 50 €."
    }
  },
  {
    svSlug: "hudvard-norrkoping",
    enSlug: "skincare-norrkoping",
    esSlug: "cuidado-piel-cbd-norrkoping",
    deSlug: "cbd-hautpflege-norrkoping",
    frSlug: "soin-peau-cbd-norrkoping",
    category: "stad",
    productIds: ["duo-kit", "ta-da-serum", "au-naturel-makeup-remover"],
    sv: {
      metaTitle: "Hudvård Norrköping – CBD-baserad hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i Norrköping. Beställ online med fri frakt över 700 kr. Skydda din hud mot östgötskt klimat och industrihistorisk stolthet.",
      kicker: "Hudvård i Norrköping",
      h1: "Naturlig hudvård för dig i Norrköping",
      lead: "Norrköping är en stad i förnyelse – och kanske är det dags att förnya din hudvårdsrutin också. Bråvikens fukt, östgötska vintrar och en livsstil i förändring sätter spår. Fri frakt över 700 kr, direkt till din dörr.",
      problemTitle: "Norrköpingshudens utmaningar",
      problemBody: "<p>Norrköping vid Bråvikens innersta del har ett klimat som präglas av både kustens fukt och inlandets kyla. Bråviken tillför fukt och dimma, särskilt under höst och vinter, som gör kylan genomträngande. Motalaström som rinner genom industri­landskapet skapar ett mikroklimat med fuktiga, svala förhållanden som kan överraska den som förväntar sig typiskt inlandsklimat.</p><p>Norrköpings industriella arv lever kvar i luftkvaliteten, även om staden gjort enorma framsteg. Hamnen och kvarvarande industri bidrar med partiklar som belastar huden, särskilt i centrala delar och Industrilandskapet. Vinden från Bråviken bär med sig salt och fukt som kan störa hudens pH-balans.</p><p>Många norrköpingsbor pendlar – till Linköping, Stockholm eller inom kommunen – och den dagliga rutten mellan uppvärmd bil, torr kontorsluft och kall utomhusluft är en barriärbrytare. Huden hinner aldrig acklimatisera sig ordentligt, och resultatet syns: torrhet, rodnad, ojämn hudton.</p>",
      tipsTitle: "Hudvårdstips för norrköpingsbor",
      tips: [
        { title: "Promenera i Kolmårdens skog", body: "Kolmårdens barrskogar strax utanför stan ger fantastisk luft med fytoncider som minskar stress och stärker immunförsvaret. Ta helgpromenaden i skogen istället för på stan." },
        { title: "Skydda huden mot Bråvikens fukt", body: "Fuktigt klimat kräver en barriärstärkande rutin. En olja som skyddsfilm efter rengöring låser in fukt utan att tillföra den yttre fukten som kan störa barriären." },
        { title: "Rengör grundligt men milt", body: "Norrköpings kombination av fukt, partiklar och stadsliv kräver ordentlig rengöring – men mild sådan. Aggressiva tvålar förvärrar torrhet och irritation." },
        { title: "Investera i kvällsrutinen", body: "Huden reparerar sig på natten. En enkel kvällsrutin med mild rengöring och skyddande olja gör mer för din hud än dyra behandlingar." }
      ],
      solutionTitle: "CBD-hudvård levererad till Norrköping",
      solutionBody: "<p>1753 SKINCARE levererar naturlig CBD-hudvård direkt till din dörr i Norrköping. Fri frakt på beställningar över 700 kr – vi skickar från Åsa utanför Göteborg.</p><p>DUO-kit med The ONE och I LOVE ger din hud den barriärstärkning som Bråvikens fukt och kyla kräver. CBD och CBG arbetar med hudens eget system för att balansera fukt, minska inflammation och stärka motståndskraften. TA-DA Serum med CBG ger extra boost under de tuffaste vinterperioderna. Au Naturel Makeup Remover rengör bort dagens partiklar och smuts med MCT-olja, utan att kompromissa med barriären.</p><p>Beställ på 1753skin.com – de flesta leveranser når Norrköping inom 1–2 arbetsdagar.</p>",
      faq: [
        { q: "Levererar ni till Norrköping?", a: "Ja, vi skickar från Åsa utanför Göteborg och de flesta beställningar når Norrköping inom 1–2 arbetsdagar. Fri frakt över 700 kr." },
        { q: "Var kan jag köpa CBD-hudvård i Norrköping?", a: "Beställ direkt på 1753skin.com – vi levererar till dig i Norrköping utan mellanhänder. Smidigt och snabbt." },
        { q: "Fungerar CBD mot rodnad och irritation?", a: "Ja, CBD har dokumenterade antiinflammatoriska egenskaper som lugnar rodnad och irritation. Det är inte en quickfix, men över tid upplever de flesta en markant lugnare och jämnare hud." }
      ],
      ctaTitle: "Ge din hud en ny start i Norrköping",
      ctaSub: "CBD-hudvård som arbetar med din hud. Fri frakt över 700 kr till Norrköping."
    },
    en: {
      metaTitle: "Skincare Norrköping – CBD-based skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Norrköping. Order online with free shipping over €60. Protect your skin from coastal moisture and inland cold.",
      kicker: "Skincare in Norrköping",
      h1: "Natural skincare for Norrköping",
      lead: "Norrköping is a city in renewal – and maybe it's time to renew your skincare routine too. Bråviken's moisture, Östergötland winters, and a changing lifestyle leave their mark. Free shipping over €60, straight to your door.",
      problemTitle: "What Norrköping does to your skin",
      problemBody: "<p>Norrköping at the inner end of Bråviken bay has a climate shaped by both coastal moisture and inland cold. Bråviken adds humidity and fog, especially during autumn and winter, making the cold penetrating. The Motala river running through the industrial landscape creates a microclimate with humid, cool conditions that can surprise those expecting typical inland weather.</p><p>Norrköping's industrial heritage lingers in air quality, even though the city has made enormous progress. The harbor and remaining industry contribute particles that stress the skin, especially in central areas and the Industrial Landscape. Wind from Bråviken carries salt and moisture that can disrupt the skin's pH balance.</p><p>Many Norrköping residents commute – to Linköping, Stockholm, or within the municipality – and the daily route between heated car, dry office air, and cold outdoor air is a barrier breaker. The skin never properly acclimatizes, and the result shows: dryness, redness, uneven skin tone.</p>",
      tipsTitle: "Skincare tips for Norrköping residents",
      tips: [
        { title: "Walk in Kolmården's forest", body: "The coniferous forests of Kolmården just outside the city offer fantastic air with phytoncides that reduce stress and strengthen immunity. Take your weekend walk in the forest instead of downtown." },
        { title: "Protect skin from Bråviken's moisture", body: "A humid climate requires a barrier-strengthening routine. An oil as a protective film after cleansing locks in moisture without adding the external humidity that can disrupt the barrier." },
        { title: "Cleanse thoroughly but gently", body: "Norrköping's combination of moisture, particles, and city life requires proper cleansing – but gentle cleansing. Aggressive soaps worsen dryness and irritation." },
        { title: "Invest in the evening routine", body: "Your skin repairs at night. A simple evening routine with gentle cleansing and protective oil does more for your skin than expensive treatments." }
      ],
      solutionTitle: "CBD skincare delivered to Norrköping",
      solutionBody: "<p>1753 SKINCARE delivers natural CBD skincare directly to your door in Norrköping. Free shipping on orders over €60 – we ship from Åsa outside Gothenburg.</p><p>The DUO-kit with The ONE and I LOVE gives your skin the barrier strengthening that Bråviken's moisture and cold demand. CBD and CBG work with the skin's own system to balance moisture, reduce inflammation, and build resilience. TA-DA Serum with CBG provides an extra boost during the toughest winter periods. Au Naturel Makeup Remover cleanses away the day's particles and dirt with MCT oil, without compromising the barrier.</p><p>Order at 1753skin.com – most deliveries reach Norrköping within 1–2 business days.</p>",
      faq: [
        { q: "Do you ship to Norrköping?", a: "Yes, we ship from Åsa outside Gothenburg and most orders reach Norrköping within 1–2 business days. Free shipping over €60." },
        { q: "Where can I buy CBD skincare in Norrköping?", a: "Order directly at 1753skin.com – we deliver to you in Norrköping without middlemen. Easy and fast." },
        { q: "Does CBD help with redness and irritation?", a: "Yes, CBD has documented anti-inflammatory properties that calm redness and irritation. It's not a quick fix, but over time most people experience noticeably calmer, more even skin." }
      ],
      ctaTitle: "Give your skin a fresh start in Norrköping",
      ctaSub: "CBD skincare that works with your skin. Free shipping over €60 to Norrköping."
    },
    es: {
      metaTitle: "Cuidado de la piel Norrköping – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Norrköping. Pide online, envío gratis desde 50 €. Protege tu piel de la humedad costera y el frío interior.",
      kicker: "Cuidado de la piel en Norrköping",
      h1: "Cosmética natural para Norrköping",
      lead: "Norrköping se reinventa – y quizá toca reinventar tu rutina de piel. La humedad del Bråviken, los inviernos de Östergötland y un ritmo de vida que cambia dejan marca. Envío gratis desde 50 €, directo a tu puerta.",
      problemTitle: "Lo que Norrköping le hace a tu piel",
      problemBody: "<p>Norrköping, al fondo del Bråviken, mezcla humedad costera y frío continental. El fiordo aporta niebla y humedad en otoño e invierno; el frío cala. El río Motala atraviesa el paisaje industrial y crea un microclima húmedo y fresco que sorprende si esperabas clima seco de interior.</p><p>El legado industrial aún marca la calidad del aire, aunque la ciudad ha mejorado mucho. Puerto e industria residual aportan partículas, sobre todo en el centro y el paisaje industrial. El viento del Bråviken arrastra sal y humedad que pueden alterar el pH de la piel.</p><p>Muchos van a Linköping, Estocolmo o dentro del municipio: coche caliente, oficina seca, calle fría – la barrera no termina de aclimatarse. Resultado: sequedad, rojeces, tono irregular.</p>",
      tipsTitle: "Consejos para quien vive en Norrköping",
      tips: [
        { title: "Camina en el bosque de Kolmården", body: "Los pinos cerca de la ciudad ofrecen aire con fitoncidas que bajan el estrés y refuerzan la inmunidad. El fin de semana, bosque en lugar de centro comercial." },
        { title: "Protege la piel de la humedad del Bråviken", body: "Clima húmedo: rutina que refuerce barrera. Aceite como película tras limpiar retiene humedad propia sin atrapar solo la humedad exterior problemática." },
        { title: "Limpia bien pero con suavidad", body: "Humedad, partículas y vida urbana piden limpieza seria – pero no agresiva. Jabones fuertes empeoran sequedad e irritación." },
        { title: "Invierte en la rutina nocturna", body: "La piel se repara de noche. Limpieza suave + aceite protector por la noche rinde más que tratamientos caros sueltos." }
      ],
      solutionTitle: "Cosmética con CBD con entrega en Norrköping",
      solutionBody: "<p>1753 SKINCARE lleva cosmética natural con CBD a tu puerta en Norrköping. Envío gratis desde 50 € – enviamos desde Åsa cerca de Gotemburgo.</p><p>El DUO-kit con The ONE y I LOVE refuerza la barrera que exigen la humedad y el frío del Bråviken. CBD y CBG equilibran humedad, bajan inflamación y suman resistencia. TA-DA Serum con CBG da un extra en los inviernos más duros. Au Naturel Makeup Remover con aceite MCT limpia partículas y suciedad del día sin comprometer la barrera.</p><p>Pide en 1753skin.com – la mayoría de envíos en 1–2 días laborables.</p>",
      faq: [
        { q: "¿Envían a Norrköping?", a: "Sí, desde Åsa cerca de Gotemburgo. Suele llegar en 1–2 días laborables. Envío gratis desde 50 €." },
        { q: "¿Dónde compro cosmética con CBD en Norrköping?", a: "1753skin.com – a tu puerta en Norrköping sin intermediarios. Rápido y sencillo." },
        { q: "¿El CBD ayuda con rojeces e irritación?", a: "Sí, el CBD tiene propiedades antiinflamatorias documentadas que calman rojeces e irritación. No es milagro instantáneo, pero con tiempo muchas notan piel más tranquila y uniforme." }
      ],
      ctaTitle: "Un nuevo impulso para tu piel en Norrköping",
      ctaSub: "Cosmética con CBD que trabaja con tu piel. Envío gratis desde 50 € a Norrköping."
    },
    de: {
      metaTitle: "Hautpflege Norrköping – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für Norrköping. Online bestellen, ab 50 € versandkostenfrei. Schutz vor Küstenfeuchte und Binnenland-Kälte.",
      kicker: "Hautpflege in Norrköping",
      h1: "Natürliche Hautpflege für Norrköping",
      lead: "Norrköping erneuert sich – vielleicht ist es Zeit, auch deine Pflegeroutine zu erneuern. Bråviken-Feuchte, Östergötland-Winter und sich wandelnder Lifestyle hinterlassen Spuren. Ab 50 € versandkostenfrei, direkt vor die Tür.",
      problemTitle: "Was Norrköping mit deiner Haut macht",
      problemBody: "<p>Norrköping am inneren Bråviken-Busen verbindet Küstenfeuchte mit Binnenland-Kälte. Bråviken bringt Nebel und Feuchte besonders Herbst und Winter; die Kälte geht unter die Haut. Der Motala-Fluss durch die Industrielandschaft schafft feuchtes, kühles Mikroklima – überraschend, wenn man trockenes Inland erwartet.</p><p>Industrielles Erbe spürt man noch in der Luftqualität, auch wenn die Stadt enorm Fortschritte gemacht hat. Hafen und Restindustrie liefern Partikel, besonders zentral und im Industrielandschaftsbereich. Wind vom Bråviken trägt Salz und Feuchte, die das Haut-pH stören können.</p><p>Viele pendeln – nach Linköping, Stockholm oder lokal: warmes Auto, trockenes Büro, kalte Außenluft – die Barriere findet keinen Rhythmus. Ergebnis: Trockenheit, Rötungen, ungleicher Teint.</p>",
      tipsTitle: "Hautpflege-Tipps für Norrköping",
      tips: [
        { title: "In Kolmårdens Wald gehen", body: "Nadelwälder knapp außerhalb bieten Luft mit Phytonziden – weniger Stress, stärkere Immunität. Wochenendspaziergang im Wald statt in der Innenstadt." },
        { title: "Haut vor Bråviken-Feuchte schützen", body: "Feuchtes Klima braucht barrierenstärkende Routine. Öl als Schutzfilm nach der Reinigung bindet eigene Feuchtigkeit ohne nur äußere Feuchte aufzublasen." },
        { title: "Gründlich aber mild reinigen", body: "Feuchte, Partikel und Stadtleben brauchen saubere Reinigung – aber mild. Aggressive Seifen verschlimmern Trockenheit und Reizung." },
        { title: "In die Abendroutine investieren", body: "Die Haut repariert nachts. Sanfte Reinigung plus Schutzöl abends schlägt viele teure Einzelbehandlungen." }
      ],
      solutionTitle: "CBD-Hautpflege nach Norrköping",
      solutionBody: "<p>1753 SKINCARE liefert natürliche CBD-Pflege direkt nach Norrköping. Ab 50 € versandkostenfrei – Versand aus Åsa bei Göteborg.</p><p>Das DUO-kit mit The ONE und I LOVE stärkt die Barriere, die Bråviken-Feuchte und Kälte verlangen. CBD und CBG balancieren Feuchtigkeit, senken Entzündung und bauen Resilienz auf. TA-DA Serum mit CBG gibt Extra-Boost in den härtesten Winterphasen. Au Naturel Makeup Remover mit MCT-Öl entfernt Tagespartikel und Schmutz ohne die Barriere zu kompromittieren.</p><p>Bestell auf 1753skin.com – meist 1–2 Werktage bis Norrköping.</p>",
      faq: [
        { q: "Liefert ihr nach Norrköping?", a: "Ja, aus Åsa bei Göteborg. Meist 1–2 Werktage. Ab 50 € versandkostenfrei." },
        { q: "Wo kaufe ich CBD-Hautpflege in Norrköping?", a: "1753skin.com – ohne Zwischenhändler bis vor die Tür. Schnell und unkompliziert." },
        { q: "Hilft CBD bei Rötung und Reizung?", a: "Ja, CBD hat dokumentierte entzündungshemmende Eigenschaften, die Rötung und Reizung beruhigen. Kein Sofortwunder, aber über Zeit oft spürbar ruhigere, gleichmäßigere Haut." }
      ],
      ctaTitle: "Neustart für deine Haut in Norrköping",
      ctaSub: "CBD-Pflege, die mit deiner Haut arbeitet. Ab 50 € versandkostenfrei nach Norrköping."
    },
    fr: {
      metaTitle: "Soin du visage Norrköping – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Norrköping. Commande en ligne, livraison offerte dès 50 €. Protège ta peau de l’humidité côtière et du froid intérieur.",
      kicker: "Soins à Norrköping",
      h1: "Soins naturels pour Norrköping",
      lead: "Norrköping se réinvente – et peut-être ta routine peau aussi. L’humidité du Bråviken, les hivers de l’Östergötland et un mode de vie en mouvement laissent des traces. Livraison offerte dès 50 €, directement chez toi.",
      problemTitle: "Ce que Norrköping fait à ta peau",
      problemBody: "<p>Norrköping, au fond du Bråviken, mélange humidité maritime et froid continental. Le fjord ajoute brouillard et humidité en automne et hiver ; le froid transperce. La rivière Motala traverse le paysage industriel et crée un microclimat humide et frais – surprenant si tu t’attendais au sec de l’intérieur.</p><p>L’héritage industriel se lit encore dans la qualité de l’air, même si la ville a beaucoup progressé. Port et industrie résiduelle apportent des particules, surtout au centre et dans la zone industrielle patrimoniale. Le vent du Bråviken charrie sel et humidité qui peuvent perturber le pH cutané.</p><p>Beaucoup font la navette vers Linköping, Stockholm ou en local : voiture chaude, bureau sec, rue froide – la barrière ne s’acclimate pas. Résultat : sécheresse, rougeurs, teint irrégulier.</p>",
      tipsTitle: "Conseils peau pour Norrköping",
      tips: [
        { title: "Marche dans la forêt de Kolmården", body: "Les conifères près de la ville offrent de l’air aux phytoncides : moins de stress, immunité renforcée. Le week-end, forêt plutôt que centre-ville." },
        { title: "Protège la peau de l’humidité du Bråviken", body: "Climat humide : routine qui renforce la barrière. Huile en film après nettoyage : elle retient l’hydratation propre sans se contenter de l’humidité extérieure piégeuse." },
        { title: "Nettoie à fond mais en douceur", body: "Humidité, particules et vie urbaine exigent un vrai nettoyage – pas agressif. Les savons violents aggravent sécheresse et irritation." },
        { title: "Mise sur la routine du soir", body: "La peau se répare la nuit. Nettoyage doux + huile protectrice le soir bat souvent les soins coûteux ponctuels." }
      ],
      solutionTitle: "Soins au CBD livrés à Norrköping",
      solutionBody: "<p>1753 SKINCARE livre des soins naturels au CBD directement chez toi à Norrköping. Livraison offerte dès 50 € – expédition depuis Åsa près de Göteborg.</p><p>Le DUO-kit avec The ONE et I LOVE renforce la barrière face à l’humidité et au froid du Bråviken. CBD et CBG équilibrent l’hydratation, réduisent l’inflammation et renforcent la résilience. TA-DA Serum au CBG concentré booste les hivers les plus rudes. Au Naturel Makeup Remover à l’huile MCT enlève particules et saleté du jour sans sacrifier la barrière.</p><p>Commande sur 1753skin.com – en général 1–2 jours ouvrés jusqu’à Norrköping.</p>",
      faq: [
        { q: "Livrez-vous à Norrköping ?", a: "Oui, depuis Åsa près de Göteborg. En général 1–2 jours ouvrés. Livraison offerte dès 50 €." },
        { q: "Où acheter des soins au CBD à Norrköping ?", a: "1753skin.com – à ton domicile sans intermédiaire. Simple et rapide." },
        { q: "Le CBD aide-t-il contre rougeurs et irritation ?", a: "Oui, le CBD a des propriétés anti-inflammatoires documentées qui apaisent rougeurs et irritation. Pas une solution instantanée, mais avec le temps beaucoup constatent une peau plus calme et plus unie." }
      ],
      ctaTitle: "Un nouveau départ pour ta peau à Norrköping",
      ctaSub: "Des soins au CBD qui travaillent avec ta peau. Livraison offerte dès 50 € vers Norrköping."
    }
  },
  {
    svSlug: "hudvard-helsingborg",
    enSlug: "skincare-helsingborg",
    esSlug: "cuidado-piel-cbd-helsingborg",
    deSlug: "cbd-hautpflege-helsingborg",
    frSlug: "soin-peau-cbd-helsingborg",
    category: "stad",
    productIds: ["duo-kit", "ta-da-serum", "fungtastic-mushroom-extract"],
    sv: {
      metaTitle: "Hudvård Helsingborg – CBD-baserad hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i Helsingborg. Beställ online med fri frakt över 700 kr. Skydda din hud mot Öresundsvinden och skånskt klimat.",
      kicker: "Hudvård i Helsingborg",
      h1: "Naturlig hudvård för dig i Helsingborg",
      lead: "Helsingborg vid Öresunds smalaste punkt – här möter havsvindens salt huden med full kraft. Skånes milda men vindpinade klimat ställer unika krav på hudvården. Beställ online – fri frakt över 700 kr.",
      problemTitle: "Helsingborgshudens utmaningar",
      problemBody: "<p>Helsingborg har ett av Sveriges mest vindexponerade lägen. Öresund är bara fyra kilometer brett här, och vinden tunnlar genom sundet med en intensitet som få andra svenska städer upplever. Havsvindens salt lägger sig på huden, torkar ut den och kan störa den naturliga pH-balansen. Ansiktet är särskilt utsatt – kind, panna och näsa tar stryk varje dag.</p><p>Skånes klimat är mildare än resten av Sverige, med kortare och mindre kalla vintrar. Men det kompenseras av konstant blåst och hög luftfuktighet som skapar en fuktig kyla som kryper in under kläderna och in i huden. Helsingborg har dessutom relativt hårt kranvatten – inte lika extremt som Malmö, men tillräckligt för att påverka känslig hud negativt.</p><p>Staden har en aktiv utomhuskultur – promenader längs Tropical Beach, träning på Ättekulla, löprundor vid Pålsjö. Allt i havsluft och vind. Det är underbart för själen men kräver att huden får rätt stöd efteråt.</p>",
      tipsTitle: "Hudvårdstips för helsingborgare",
      tips: [
        { title: "Skölj bort saltet efter utevistelse", body: "Havsluftens salt som lägger sig på huden bör sköljas bort dagligen. En mild rengöring efter promenaden längs Tropical Beach gör stor skillnad." },
        { title: "Använd olja som vindbarriär", body: "Applicera en skyddande olja innan du går ut – den skapar en barriär mot Öresundsvinden och låser in hudens egen fukt." },
        { title: "Utnyttja Sofiero", body: "Sofiero slottspark och de skånska bokskogarna erbjuder skyddade promenader med ren luft – perfekt för att ge huden en paus från den salthaltiga havsluften." },
        { title: "Anpassa efter den skånska vintern", body: "Skånska vintrar är mildare men blåsigare. Satsa på barriärstärkande produkter snarare än tung vinterfukt – huden behöver skydd mot vind mer än mot extrem kyla." },
        { title: "Stöd immunförsvaret under mörka månader", body: "Helsingborgs höst och vinter ger begränsad solexponering. D-vitamin och adaptogena tillskott stödjer både immunförsvar och hud inifrån." }
      ],
      solutionTitle: "CBD-hudvård levererad till Helsingborg",
      solutionBody: "<p>Från Åsa utanför Göteborg till din dörr i Helsingborg – vi förstår kustklimat. 1753 SKINCARE levererar naturlig CBD-hudvård som stärker din hud mot Öresundsvindens påfrestningar. Fri frakt på beställningar över 700 kr.</p><p>DUO-kit med The ONE och I LOVE ger din hud den barriärstärkning som det vindutsatta Helsingborg kräver. CBD och CBG balanserar och skyddar. TA-DA Serum med koncentrerad CBG fungerar som intensivvård under de mest vindpinade perioderna. Fungtastic Mushroom Extract stödjer immunförsvaret under de mörka skånska vintermånaderna.</p><p>Beställ på 1753skin.com – de flesta leveranser når Helsingborg inom 1–2 arbetsdagar.</p>",
      faq: [
        { q: "Levererar ni till Helsingborg?", a: "Ja, vi skickar från Åsa utanför Göteborg. De flesta beställningar når Helsingborg inom 1–2 arbetsdagar. Fri frakt över 700 kr." },
        { q: "Var kan jag köpa CBD-hudvård i Helsingborg?", a: "Beställ direkt på 1753skin.com – smidigt levererat till din dörr i Helsingborg utan mellanhänder." },
        { q: "Hjälper CBD mot vindtorkad hud?", a: "Ja, CBD stärker hudbarriären och hjälper huden att behålla sin fukt trots vindexponering. Det reparerar inte skadan direkt, men gör huden mer motståndskraftig mot framtida påfrestningar." },
        { q: "Kan jag beställa från Danmark också?", a: "Just nu levererar vi inom Sverige. Men med Helsingborg-Helsingör bara ett färjepass bort hoppas vi kunna erbjuda dansk leverans framöver." }
      ],
      ctaTitle: "Skydda din hud mot Öresundsvinden",
      ctaSub: "Naturlig CBD-hudvård som stärker din barriär. Fri frakt över 700 kr till Helsingborg."
    },
    en: {
      metaTitle: "Skincare Helsingborg – CBD-based skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Helsingborg. Order online with free shipping over €60. Protect your skin from Öresund winds.",
      kicker: "Skincare in Helsingborg",
      h1: "Natural skincare for Helsingborg",
      lead: "Helsingborg at the narrowest point of the Öresund strait – here the sea wind's salt hits the skin at full force. Skåne's mild but wind-battered climate places unique demands on skincare. Order online – free shipping over €60.",
      problemTitle: "What Helsingborg does to your skin",
      problemBody: "<p>Helsingborg has one of Sweden's most wind-exposed locations. The Öresund strait is only four kilometers wide here, and the wind tunnels through with an intensity few other Swedish cities experience. The sea wind's salt settles on the skin, dries it out, and can disrupt the natural pH balance. The face is especially exposed – cheeks, forehead, and nose take a beating every day.</p><p>Skåne's climate is milder than the rest of Sweden, with shorter and less cold winters. But it's compensated by constant wind and high humidity that creates a damp cold that creeps under clothing and into the skin. Helsingborg also has relatively hard tap water – not as extreme as Malmö, but enough to affect sensitive skin negatively.</p><p>The city has an active outdoor culture – walks along Tropical Beach, training at Ättekulla, runs by Pålsjö. All in sea air and wind. It's wonderful for the soul but requires proper skin support afterward.</p>",
      tipsTitle: "Skincare tips for Helsingborg residents",
      tips: [
        { title: "Rinse off the salt after being outside", body: "The sea air's salt that settles on your skin should be rinsed off daily. A gentle cleanse after walking along Tropical Beach makes a big difference." },
        { title: "Use oil as a wind barrier", body: "Apply a protective oil before heading out – it creates a barrier against the Öresund wind and locks in your skin's own moisture." },
        { title: "Make use of Sofiero", body: "Sofiero Castle Park and the Scanian beech forests offer sheltered walks with clean air – perfect for giving your skin a break from the salty sea air." },
        { title: "Adapt to the Scanian winter", body: "Scanian winters are milder but windier. Focus on barrier-strengthening products rather than heavy winter moisture – your skin needs wind protection more than extreme cold protection." },
        { title: "Support immunity during dark months", body: "Helsingborg's autumn and winter offer limited sun exposure. Vitamin D and adaptogenic supplements support both immunity and skin from within." }
      ],
      solutionTitle: "CBD skincare delivered to Helsingborg",
      solutionBody: "<p>From Åsa outside Gothenburg to your door in Helsingborg – we understand coastal climate. 1753 SKINCARE delivers natural CBD skincare that strengthens your skin against the Öresund wind's demands. Free shipping on orders over €60.</p><p>The DUO-kit with The ONE and I LOVE gives your skin the barrier strengthening that wind-exposed Helsingborg requires. CBD and CBG balance and protect. TA-DA Serum with concentrated CBG works as intensive care during the windiest periods. Fungtastic Mushroom Extract supports immunity during the dark Scanian winter months.</p><p>Order at 1753skin.com – most deliveries reach Helsingborg within 1–2 business days.</p>",
      faq: [
        { q: "Do you ship to Helsingborg?", a: "Yes, we ship from Åsa outside Gothenburg. Most orders reach Helsingborg within 1–2 business days. Free shipping over €60." },
        { q: "Where can I buy CBD skincare in Helsingborg?", a: "Order directly at 1753skin.com – conveniently delivered to your door in Helsingborg without middlemen." },
        { q: "Does CBD help wind-dried skin?", a: "Yes, CBD strengthens the skin barrier and helps the skin retain moisture despite wind exposure. It doesn't repair damage directly, but makes the skin more resilient against future stress." },
        { q: "Can I order from Denmark too?", a: "Currently we deliver within Sweden. But with Helsingborg-Helsingør just a ferry ride away, we hope to offer Danish delivery in the future." }
      ],
      ctaTitle: "Protect your skin from the Öresund wind",
      ctaSub: "Natural CBD skincare that strengthens your barrier. Free shipping over €60 to Helsingborg."
    },
    es: {
      metaTitle: "Cuidado de la piel Helsingborg – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Helsingborg. Pide online, envío gratis desde 50 €. Protege tu piel de los vientos del Öresund.",
      kicker: "Cuidado de la piel en Helsingborg",
      h1: "Cosmética natural para Helsingborg",
      lead: "Helsingborg en el punto más estrecho del Öresund – aquí la sal del mar golpea la piel con fuerza. El clima de Skåne, suave pero batido por el viento, exige un cuidado distinto. Pide online – envío gratis desde 50 €.",
      problemTitle: "Lo que Helsingborg le hace a tu piel",
      problemBody: "<p>Helsingborg es de las ciudades suecas más expuestas al viento. El Öresund aquí tiene solo unos cuatro kilómetros de ancho y el viento se canaliza con una intensidad poca veces vista. La sal marina se deposita en la piel, la reseca y puede alterar el pH. El rostro sufre de lleno: mejillas, frente y nariz castigadas cada día.</p><p>El clima de Skåne es más suave que en el resto de Suecia, con inviernos más cortos y menos gélidos, pero lo compensan viento constante y alta humedad: un frío húmedo que se cuela bajo la ropa y en la piel. El agua del grifo es bastante dura – no como en Malmö, pero suficiente para molestar pieles sensibles.</p><p>La vida al aire libre es fuerte – paseos por Tropical Beach, entrenos, carreras junto a Pålsjö, todo con aire y viento de mar. Maravilloso para el ánimo; la piel pide buen cuidado después.</p>",
      tipsTitle: "Consejos para quien vive en Helsingborg",
      tips: [
        { title: "Enjuaga la sal después de salir", body: "La sal del aire marino conviene quitarla cada día. Limpieza suave tras un paseo por Tropical Beach marca diferencia." },
        { title: "Aceite como barrera al viento", body: "Antes de salir, aceite protector: corta el viento del Öresund y retiene la humedad propia." },
        { title: "Aprovecha Sofiero", body: "El parque del castillo de Sofiero y las hayas de Skåne ofrecen paseos más resguardados – buen respiro para la piel lejos del aerosol salino." },
        { title: "Adapta el invierno escandinavo del sur", body: "Inviernos más suaves pero más ventosos: prioriza barrera fuerte antes que cremas hiperpesadas – aquí el enemigo es el viento más que el frío extremo." },
        { title: "Apoya la inmunidad en los meses oscuros", body: "Otoño e invierno dan poco sol. Vitamina D y adaptógenos ayudan a inmunidad y piel por dentro." }
      ],
      solutionTitle: "Cosmética con CBD con entrega en Helsingborg",
      solutionBody: "<p>De Åsa cerca de Gotemburgo a tu puerta en Helsingborg – entendemos clima costero. 1753 SKINCARE lleva cosmética natural con CBD que refuerza la piel frente al viento del Öresund. Envío gratis desde 50 €.</p><p>El DUO-kit con The ONE y I LOVE refuerza la barrera que exige una ciudad tan ventosa. CBD y CBG equilibran y protegen. TA-DA Serum con CBG actúa como cuidado intensivo en los periodos más ventosos. Fungtastic Mushroom Extract apoya la inmunidad en los meses oscuros de Skåne.</p><p>Pide en 1753skin.com – la mayoría de envíos en 1–2 días laborables.</p>",
      faq: [
        { q: "¿Envían a Helsingborg?", a: "Sí, desde Åsa cerca de Gotemburgo. Suele llegar en 1–2 días laborables. Envío gratis desde 50 €." },
        { q: "¿Dónde compro cosmética con CBD en Helsingborg?", a: "1753skin.com – cómodo a tu puerta en Helsingborg sin intermediarios." },
        { q: "¿El CBD ayuda con la piel reseca por el viento?", a: "Sí, el CBD refuerza la barrera y ayuda a retener humedad a pesar del viento. No arregla el daño al instante, pero hace la piel más resistente después." },
        { q: "¿Puedo pedir desde Dinamarca?", a: "De momento enviamos dentro de Suecia. Con Helsingborg–Helsingør a un ferry de distancia, esperamos poder ofrecer envío a Dinamarca más adelante." }
      ],
      ctaTitle: "Protege tu piel del viento del Öresund",
      ctaSub: "Cosmética natural con CBD que refuerza tu barrera. Envío gratis desde 50 € a Helsingborg."
    },
    de: {
      metaTitle: "Hautpflege Helsingborg – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für Helsingborg. Online bestellen, ab 50 € versandkostenfrei. Schutz vor Öresund-Wind.",
      kicker: "Hautpflege in Helsingborg",
      h1: "Natürliche Hautpflege für Helsingborg",
      lead: "Helsingborg an der engsten Stelle des Öresund – hier trifft Meersalz die Haut mit voller Wucht. Skånes mildes, aber windgepeitschtes Klima stellt andere Ansprüche an die Pflege. Online bestellen – ab 50 € versandkostenfrei.",
      problemTitle: "Was Helsingborg mit deiner Haut macht",
      problemBody: "<p>Helsingborg gehört zu Schwedens windexponiertesten Lagen. Der Öresund ist hier nur etwa vier Kilometer breit, der Wind tunnelartig intensiv. Meersalz setzt sich auf der Haut ab, trocknet sie aus und kann das pH stören. Besonders das Gesicht leidt – Wangen, Stirn, Nase täglich im Brennpunkt.</p><p>Skånes Klima ist milder als im übrigen Schweden, Winter kürzer und weniger streng – ausgeglichen durch Dauerwind und hohe Luftfeuchte: feuchte Kälte, die unter Kleidung und in die Haut kriecht. Leitungswasser ist relativ hart – nicht extrem wie in Malmö, aber genug für sensible Haut.</p><p>Aktive Outdoor-Kultur – Spaziergänge an Tropical Beach, Training, Läufe an Pålsjö, alles in Seeluft und Wind. Toll für die Seele; die Haut braucht danach richtige Pflege.</p>",
      tipsTitle: "Hautpflege-Tipps für Helsingborg",
      tips: [
        { title: "Salz nach draußen abspülen", body: "Meersalz sollte täglich runter. Milde Reinigung nach dem Gang an Tropical Beach macht viel aus." },
        { title: "Öl als Windschutz", body: "Vor dem Rausgehen Schutzöl – Barriere gegen Öresund-Wind und Feuchtigkeitsspeicherung." },
        { title: "Sofiero nutzen", body: "Schlosspark Sofiero und skåne Buchenwälder: geschütztere Spaziergänge, Pause für die Haut vom salzigen Seenebel." },
        { title: "Auf skånischen Winter einstellen", body: "Mildere, aber windigere Winter: Barrieren-Fokus statt ultra-schwere Wintercremes – Wind ist hier das Thema, nicht Polarkälte." },
        { title: "Immunität in dunklen Monaten", body: "Herbst und Winter bringen wenig Sonne. Vitamin D und Adaptogene unterstützen Immunsystem und Haut von innen." }
      ],
      solutionTitle: "CBD-Hautpflege nach Helsingborg",
      solutionBody: "<p>Von Åsa bei Göteborg bis vor die Tür in Helsingborg – wir kennen Küstenklima. 1753 SKINCARE liefert natürliche CBD-Pflege, die die Haut gegen Öresund-Wind stärkt. Ab 50 € versandkostenfrei.</p><p>Das DUO-kit mit The ONE und I LOVE stärkt die Barriere, die windgepeitschtes Helsingborg braucht. CBD und CBG balancieren und schützen. TA-DA Serum mit CBG ist Intensivpflege in den windigsten Phasen. Fungtastic Mushroom Extract unterstützt die Immunität in Skånes dunklen Wintermonaten.</p><p>Bestell auf 1753skin.com – meist 1–2 Werktage bis Helsingborg.</p>",
      faq: [
        { q: "Liefert ihr nach Helsingborg?", a: "Ja, aus Åsa bei Göteborg. Meist 1–2 Werktage. Ab 50 € versandkostenfrei." },
        { q: "Wo kaufe ich CBD-Hautpflege in Helsingborg?", a: "1753skin.com – bequem ohne Zwischenhändler bis vor die Tür." },
        { q: "Hilft CBD bei windausgetrockneter Haut?", a: "Ja, CBD stärkt die Barriere und hilft, Feuchtigkeit trotz Wind zu halten. Repariert nicht sofort, macht die Haut aber widerstandsfähiger." },
        { q: "Kann ich aus Dänemark bestellen?", a: "Aktuell liefern wir innerhalb Schwedens. Mit Helsingborg–Helsingør nur eine Fährfahrt entfernt, hoffen wir künftig auf dänische Lieferung." }
      ],
      ctaTitle: "Schütz deine Haut vor dem Öresund-Wind",
      ctaSub: "Natürliche CBD-Pflege für stärkere Barriere. Ab 50 € versandkostenfrei nach Helsingborg."
    },
    fr: {
      metaTitle: "Soin du visage Helsingborg – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Helsingborg. Commande en ligne, livraison offerte dès 50 €. Protège ta peau des vents de l’Öresund.",
      kicker: "Soins à Helsingborg",
      h1: "Soins naturels pour Helsingborg",
      lead: "Helsingborg au point le plus étroit de l’Öresund – ici le sel de mer frappe la peau de plein fouet. Le climat scanien, doux mais martelé par le vent, impose une autre logique de soins. Commande en ligne – livraison offerte dès 50 €.",
      problemTitle: "Ce qu’Helsingborg fait à ta peau",
      problemBody: "<p>Helsingborg compte parmi les villes suédoises les plus exposées au vent. L’Öresund n’a ici qu’environ quatre kilomètres de large ; le vent s’engouffre avec une intensité rare. Le sel marin se dépose, assèche et peut perturber le pH. Le visage prend cher : joues, front, nez, jour après jour.</p><p>Le climat de Skåne est plus doux que dans le reste de la Suède, hivers plus courts et moins rigoureux – compensés par vent permanent et forte humidité : un froid humide qui s’infiltre sous les vêtements et dans la peau. L’eau du robinet est assez dure – moins extrême qu’à Malmö, mais suffisante pour gêner les peaux sensibles.</p><p>La culture outdoor est vivace – balades à Tropical Beach, entraînements, courses vers Pålsjö, le tout dans l’air marin et le vent. Génial pour le moral ; la peau réclame un suivi après.</p>",
      tipsTitle: "Conseils peau pour Helsingborg",
      tips: [
        { title: "Rince le sel après l’extérieur", body: "Le sel marin mérite un rinçage quotidien. Nettoyage doux après une balade à Tropical Beach : effet net." },
        { title: "Huile comme pare-vent", body: "Avant de sortir, huile protectrice : barrière face au vent de l’Öresund et rétention de ton humidité naturelle." },
        { title: "Profite de Sofiero", body: "Le parc du château de Sofiero et les hêtres de Skåne offrent des promenades abritées – pause pour la peau loin du brouillard salin." },
        { title: "Adapte l’hiver du sud suédois", body: "Hivers plus doux mais plus venteux : priorité à la barrière plutôt qu’aux textures ultra-lourdes – ici c’est le vent, pas le grand froid polaire." },
        { title: "Soutiens l’immunité dans le noir", body: "Automne et hiver = peu de soleil. Vitamine D et adaptogènes soutiennent immunité et peau de l’intérieur." }
      ],
      solutionTitle: "Soins au CBD livrés à Helsingborg",
      solutionBody: "<p>D’Åsa près de Göteborg jusqu’à chez toi à Helsingborg – on connaît le climat littoral. 1753 SKINCARE livre des soins naturels au CBD qui renforcent la peau face au vent de l’Öresund. Livraison offerte dès 50 €.</p><p>Le DUO-kit avec The ONE et I LOVE renforce la barrière qu’exige une ville aussi ventée. CBD et CBG équilibrent et protègent. TA-DA Serum au CBG joue les soins intensifs dans les phases les plus venteuses. Fungtastic Mushroom Extract soutient l’immunité pendant les mois sombres de Skåne.</p><p>Commande sur 1753skin.com – en général 1–2 jours ouvrés jusqu’à Helsingborg.</p>",
      faq: [
        { q: "Livrez-vous à Helsingborg ?", a: "Oui, depuis Åsa près de Göteborg. En général 1–2 jours ouvrés. Livraison offerte dès 50 €." },
        { q: "Où acheter des soins au CBD à Helsingborg ?", a: "1753skin.com – livraison pratique sans intermédiaire." },
        { q: "Le CBD aide-t-il la peau desséchée par le vent ?", a: "Oui, le CBD renforce la barrière et aide à garder l’humidité malgré le vent. Ça ne répare pas sur-le-champ, mais rend la peau plus résiliente." },
        { q: "Puis-je commander depuis le Danemark ?", a: "Pour l’instant nous livrons en Suède. Avec Helsingborg–Helsingør à un ferry, on espère proposer la livraison au Danemark plus tard." }
      ],
      ctaTitle: "Protège ta peau du vent de l’Öresund",
      ctaSub: "Soins naturels au CBD pour une barrière plus forte. Livraison offerte dès 50 € vers Helsingborg."
    }
  },
  {
    svSlug: "hudvard-jonkoping",
    enSlug: "skincare-jonkoping",
    esSlug: "cuidado-piel-cbd-jonkoping",
    deSlug: "cbd-hautpflege-jonkoping",
    frSlug: "soin-peau-cbd-jonkoping",
    category: "stad",
    productIds: ["duo-kit", "au-naturel-makeup-remover", "fungtastic-mushroom-extract"],
    sv: {
      metaTitle: "Hudvård Jönköping – CBD-baserad hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i Jönköping. Beställ online med fri frakt över 700 kr. Skydda din hud mot småländska vintrar och Vätternklimatet.",
      kicker: "Hudvård i Jönköping",
      h1: "Naturlig hudvård för dig i Jönköping",
      lead: "Jönköping vid Vätterns södra spets – en stad där småländsk envishet möter naturens krafter. Vätternvindar, kalla inlandsvintrar och den höga höjden ger din hud unika utmaningar. Fri frakt över 700 kr.",
      problemTitle: "Jönköpingshudens utmaningar",
      problemBody: "<p>Jönköpings läge vid Vätterns södra ände skapar ett mikroklimat som skiljer sig från omgivande Småland. Vättern, en av Europas största och djupaste sjöar, kyler ner luften och skapar lokala vindförhållanden som kan vara överraskande starka. Sjöns enorma vattenvolym gör att den sällan fryser, och den konstanta avdunstningen tillför fukt till luften – en kall, rå fukt som skiljer sig från vanlig inlandstorrhet.</p><p>Jönköping ligger dessutom på den småländska högläntan, cirka 300 meter över havet. Den högre altituden innebär starkare UV-strålning och torrare luft, trots närheten till Vättern. Vintrarna är genuint kalla med stabila minusgrader, och övergången mellan årstiderna kan vara abrupt.</p><p>Smålands företagaranda innebär att många jobbar hårt och länge, ofta i tillverknings- och kontorsmiljöer. Stressnivåerna är höga i Skandinaviens mest entreprenöriella region, och det syns i huden – torrhet, utbrott och en trötthet som ingen concealer i världen kan dölja.</p>",
      tipsTitle: "Hudvårdstips för jönköpingsbor",
      tips: [
        { title: "Bada i Vättern", body: "Vätterns iskalla, rena vatten stimulerar blodcirkulationen och ger huden en naturlig boost. Kortvarig exponering för kallt vatten har visat sig stärka immunförsvaret och förbättra hudtonen." },
        { title: "Vandra i Smålands skogar", body: "Store Mosse nationalpark och de omgivande skogarna ger ren luft och stress­lindring. Regelbundna skogspromenader sänker kortisol och ger huden tid att återhämta sig." },
        { title: "Skydda dig mot UV på höjden", body: "Jönköpings höga läge innebär starkare UV-strålning. Glöm inte solskydd även på molniga dagar – UV penetrerar moln och den tunnare atmosfären på höjden förstärker effekten." },
        { title: "Investera i kvällsrutinen", body: "Efter en lång dag i småländsk entreprenörsanda behöver huden återhämtning. En enkel kvällsrutin med mild rengöring och närande olja gör underverk." }
      ],
      solutionTitle: "CBD-hudvård levererad till Jönköping",
      solutionBody: "<p>1753 SKINCARE levererar naturlig CBD-hudvård direkt till din dörr i Jönköping. Från Åsa utanför Göteborg – fri frakt på beställningar över 700 kr.</p><p>DUO-kit med The ONE och I LOVE ger din hud den näring som Vätternklimatet och den småländska vinterkylans kräver. CBD och CBG stärker hudbarriären och balanserar inflammationsprocesser. Au Naturel Makeup Remover med MCT-olja rengör milt efter en dag i Jönköpings blandade klimat. Fungtastic Mushroom Extract stödjer kroppen inifrån – för dig som driver hårt och behöver hjälpa kroppen hänga med.</p><p>Beställ på 1753skin.com – de flesta leveranser når Jönköping inom 1–2 arbetsdagar.</p>",
      faq: [
        { q: "Levererar ni till Jönköping?", a: "Ja, vi skickar från Åsa utanför Göteborg och de flesta beställningar når Jönköping inom 1–2 arbetsdagar. Fri frakt över 700 kr." },
        { q: "Var kan jag köpa CBD-hudvård i Jönköping?", a: "Enklast via 1753skin.com – vi levererar direkt till din dörr utan mellanhänder eller butikspålägg." },
        { q: "Vad gör CBD för hud som utsätts för kyla?", a: "CBD stärker hudbarriären och hjälper huden att behålla fukt och elasticitet trots kyla. Det minskar inflammation och reparerar den skada som temperaturväxlingar orsakar." },
        { q: "Kan jag använda era produkter året runt?", a: "Absolut. Våra produkter är formulerade för att fungera i alla årstider. Justera mängden efter säsong – lite mer under vintern, lite mindre på sommaren." }
      ],
      ctaTitle: "Småländsk envishet förtjänar småländsk hudvård",
      ctaSub: "Naturlig CBD-hudvård som håller lika länge som din arbetsdag. Fri frakt över 700 kr."
    },
    en: {
      metaTitle: "Skincare Jönköping – CBD-based skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Jönköping. Order online with free shipping over €60. Protect your skin from Lake Vättern's climate.",
      kicker: "Skincare in Jönköping",
      h1: "Natural skincare for Jönköping",
      lead: "Jönköping at the southern tip of Lake Vättern – a city where Småland stubbornness meets nature's forces. Vättern winds, cold inland winters, and the high altitude give your skin unique challenges. Free shipping over €60.",
      problemTitle: "What Jönköping does to your skin",
      problemBody: "<p>Jönköping's location at the southern end of Lake Vättern creates a microclimate that differs from surrounding Småland. Vättern, one of Europe's largest and deepest lakes, cools the air and creates local wind conditions that can be surprisingly strong. The lake's enormous water volume means it rarely freezes, and the constant evaporation adds moisture to the air – a cold, raw humidity that differs from typical inland dryness.</p><p>Jönköping also sits on the Småland highlands, about 300 meters above sea level. The higher altitude means stronger UV radiation and drier air, despite the proximity to Vättern. Winters are genuinely cold with stable sub-zero temperatures, and the transition between seasons can be abrupt.</p><p>Småland's entrepreneurial spirit means many work hard and long, often in manufacturing and office environments. Stress levels are high in Scandinavia's most entrepreneurial region, and it shows in the skin – dryness, breakouts, and a fatigue that no concealer in the world can hide.</p>",
      tipsTitle: "Skincare tips for Jönköping residents",
      tips: [
        { title: "Swim in Vättern", body: "Vättern's ice-cold, clean water stimulates blood circulation and gives the skin a natural boost. Brief cold water exposure has been shown to strengthen immunity and improve skin tone." },
        { title: "Hike in Småland's forests", body: "Store Mosse National Park and the surrounding forests provide clean air and stress relief. Regular forest walks lower cortisol and give the skin time to recover." },
        { title: "Protect against UV at altitude", body: "Jönköping's high location means stronger UV radiation. Don't forget sun protection even on cloudy days – UV penetrates clouds and the thinner atmosphere at altitude amplifies the effect." },
        { title: "Invest in the evening routine", body: "After a long day of Småland entrepreneurship, your skin needs recovery. A simple evening routine with gentle cleansing and nourishing oil works wonders." }
      ],
      solutionTitle: "CBD skincare delivered to Jönköping",
      solutionBody: "<p>1753 SKINCARE delivers natural CBD skincare directly to your door in Jönköping. From Åsa outside Gothenburg – free shipping on orders over €60.</p><p>The DUO-kit with The ONE and I LOVE gives your skin the nourishment that the Vättern climate and Småland winter cold demand. CBD and CBG strengthen the skin barrier and balance inflammatory processes. Au Naturel Makeup Remover with MCT oil cleanses gently after a day in Jönköping's mixed climate. Fungtastic Mushroom Extract supports the body from within – for those who push hard and need to help the body keep up.</p><p>Order at 1753skin.com – most deliveries reach Jönköping within 1–2 business days.</p>",
      faq: [
        { q: "Do you ship to Jönköping?", a: "Yes, we ship from Åsa outside Gothenburg and most orders reach Jönköping within 1–2 business days. Free shipping over €60." },
        { q: "Where can I buy CBD skincare in Jönköping?", a: "Easiest through 1753skin.com – we deliver directly to your door without middlemen or store markups." },
        { q: "What does CBD do for cold-exposed skin?", a: "CBD strengthens the skin barrier and helps the skin retain moisture and elasticity despite cold. It reduces inflammation and repairs damage caused by temperature shifts." },
        { q: "Can I use your products year-round?", a: "Absolutely. Our products are formulated to work in all seasons. Adjust the amount by season – a bit more in winter, a bit less in summer." }
      ],
      ctaTitle: "Småland stubbornness deserves Småland skincare",
      ctaSub: "Natural CBD skincare that lasts as long as your workday. Free shipping over €60."
    },
    es: {
      metaTitle: "Cuidado de la piel Jönköping – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Jönköping. Pide online, envío gratis desde 50 €. Protege tu piel del clima del lago Vättern.",
      kicker: "Cuidado de la piel en Jönköping",
      h1: "Cosmética natural para Jönköping",
      lead: "Jönköping en el extremo sur del Vättern – donde la terquedad de Småland choca con la fuerza del clima. Vientos del lago, inviernos continentales fríos y altitud que marcan la piel. Envío gratis desde 50 €.",
      problemTitle: "Lo que Jönköping le hace a tu piel",
      problemBody: "<p>La posición al sur del Vättern crea un microclima distinto al Småland circundante. El Vättern, uno de los lagos más grandes y profundos de Europa, enfría el aire y genera vientos locales sorprendentemente fuertes. Su volumen hace que casi nunca hiele del todo; la evaporación constante añade humedad al aire – fría y cruda, distinta de la sequedad típica del interior.</p><p>Jönköping está en el altiplano smålandés, unos 300 m sobre el nivel del mar. Más altitud implica más UV y aire más seco a pesar del lago. Inviernos fríos y estables; los cambios de estación pueden ser bruscos.</p><p>El espíritu emprendedor de Småland significa jornadas largas, a menudo en fábrica u oficina. El estrés es alto en una de las regiones más emprendedoras de Escandinavia – y se nota en la piel: sequedad, brotes, cansancio que ningún corrector esconde.</p>",
      tipsTitle: "Consejos para quien vive en Jönköping",
      tips: [
        { title: "Baño en el Vättern", body: "Agua helada y limpia estimula circulación y despierta el cutis. Exposiciones breves al frío se han ligado a mejor tono inmune y piel." },
        { title: "Senderismo en los bosques de Småland", body: "Store Mosse y los bosques de alrededor dan aire limpio y bajan el estrés. Caminatas regulares: menos cortisol, tiempo de recuperación para la piel." },
        { title: "Protección UV en altitud", body: "A mayor altitud, más UV. Protege el rostro incluso con nubes – los rayos atraviesan y la atmósfera más fina aquí amplifica el efecto." },
        { title: "Rutina nocturna seria", body: "Tras un día a ritmo smålandés, la piel necesita recuperación. Limpieza suave + aceite nutritivo por la noche cambia mucho." }
      ],
      solutionTitle: "Cosmética con CBD con entrega en Jönköping",
      solutionBody: "<p>1753 SKINCARE lleva cosmética natural con CBD a tu puerta en Jönköping. Desde Åsa cerca de Gotemburgo – envío gratis desde 50 €.</p><p>El DUO-kit con The ONE y I LOVE nutre la piel frente al clima del Vättern y al frío smålandés. CBD y CBG refuerzan la barrera y equilibran la inflamación. Au Naturel Makeup Remover con aceite MCT limpia con suavidad tras un día de microclimas mixtos. Fungtastic Mushroom Extract apoya el cuerpo por dentro – para quien exige mucho al cuerpo cada día.</p><p>Pide en 1753skin.com – la mayoría de envíos en 1–2 días laborables.</p>",
      faq: [
        { q: "¿Envían a Jönköping?", a: "Sí, desde Åsa cerca de Gotemburgo. Suele llegar en 1–2 días laborables. Envío gratis desde 50 €." },
        { q: "¿Dónde compro cosmética con CBD en Jönköping?", a: "Lo más fácil: 1753skin.com – directo a tu puerta sin intermediarios ni recargos." },
        { q: "¿Qué hace el CBD en piel expuesta al frío?", a: "Refuerza la barrera y ayuda a mantener humedad y elasticidad pese al frío. Reduce inflamación y ayuda a reparar el desgaste por cambios térmicos." },
        { q: "¿Puedo usar vuestros productos todo el año?", a: "Sí. Ajusta la cantidad: un poco más en invierno, un poco menos en verano." }
      ],
      ctaTitle: "La terquedad de Småland merece cosmética a su altura",
      ctaSub: "Cosmética natural con CBD que aguanta lo que aguanta tu jornada. Envío gratis desde 50 €."
    },
    de: {
      metaTitle: "Hautpflege Jönköping – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für Jönköping. Online bestellen, ab 50 € versandkostenfrei. Schutz vor Vättern-Klima.",
      kicker: "Hautpflege in Jönköping",
      h1: "Natürliche Hautpflege für Jönköping",
      lead: "Jönköping am südlichen Zipfel des Vättern – wo Småland-Trotz auf Naturkräfte trifft. Vättern-Winde, kalte Binnenland-Winter und Höhenlage fordern die Haut. Ab 50 € versandkostenfrei.",
      problemTitle: "Was Jönköping mit deiner Haut macht",
      problemBody: "<p>Die Lage am südlichen Vättern schafft ein Mikroklima anders als im umgebenden Småland. Der Vättern, einer Europas größten und tiefsten Seen, kühlt die Luft und erzeugt überraschend starke lokale Winde. Das gewaltige Wasservolumen friert selten komplett zu; ständige Verdunstung feuchtet die Luft – kalt und roh, anders als typische Binnentrockenheit.</p><p>Jönköping liegt auf dem Småland-Hochland, etwa 300 Meter über dem Meer. Höhere Lage bedeutet stärkere UV-Strahlung und trockenere Luft trotz Seenähe. Winter sind echt kalt und stabil; Jahreszeitenwechsel können abrupt sein.</p><p>Smålands Unternehmergeist bedeutet lange Tage, oft in Produktion oder Büro. Stress ist hoch in einer der unternehmerischsten Regionen Skandinaviens – sichtbar an der Haut: Trockenheit, Breakouts, Müdigkeit, die kein Concealer kaschiert.</p>",
      tipsTitle: "Hautpflege-Tipps für Jönköping",
      tips: [
        { title: "Im Vättern baden", body: "Eiskaltes, sauberes Wasser regt die Durchblutung an und weckt den Teint. Kurze Kälteexposition ist mit Immunität und Hautton in Verbindung gebracht worden." },
        { title: "In Smålands Wäldern wandern", body: "Store Mosse und umliegende Wälder: saubere Luft, Stressabbau. Regelmäßige Waldgänge senken Cortisol und geben der Haut Erholungszeit." },
        { title: "UV-Schutz in der Höhe", body: "Höher gelegen stärkere UV. Gesicht schützen auch bei Wolken – UV dringt durch, dünnere Atmosphäre verstärkt." },
        { title: "Abendroutine ernst nehmen", body: "Nach langem Småland-Arbeitstag braucht die Haut Recovery. Sanfte Reinigung plus nährendes Öl abends wirkt Wunder." }
      ],
      solutionTitle: "CBD-Hautpflege nach Jönköping",
      solutionBody: "<p>1753 SKINCARE liefert natürliche CBD-Pflege direkt nach Jönköping. Von Åsa bei Göteborg – ab 50 € versandkostenfrei.</p><p>Das DUO-kit mit The ONE und I LOVE nährt die Haut gegen Vättern-Klima und småländische Kälte. CBD und CBG stärken die Barriere und balancieren Entzündungsprozesse. Au Naturel Makeup Remover mit MCT-Öl reinigt mild nach gemischten Klimatagen. Fungtastic Mushroom Extract unterstützt den Körper von innen – für alle, die viel verlangen.</p><p>Bestell auf 1753skin.com – meist 1–2 Werktage bis Jönköping.</p>",
      faq: [
        { q: "Liefert ihr nach Jönköping?", a: "Ja, aus Åsa bei Göteborg. Meist 1–2 Werktage. Ab 50 € versandkostenfrei." },
        { q: "Wo kaufe ich CBD-Hautpflege in Jönköping?", a: "Am einfachsten 1753skin.com – direkt ohne Zwischenhändler." },
        { q: "Was macht CBD für kaltexponierte Haut?", a: "Es stärkt die Barriere, hilft Feuchtigkeit und Elastizität trotz Kälte zu halten, senkt Entzündung und unterstützt Reparatur durch Temperaturwechsel." },
        { q: "Kann ich eure Produkte ganzjährig nutzen?", a: "Ja. Menge anpassen – etwas mehr im Winter, etwas weniger im Sommer." }
      ],
      ctaTitle: "Småland-Trotz verdient Småland-taugliche Pflege",
      ctaSub: "Natürliche CBD-Pflege, die so lange hält wie dein Arbeitstag. Ab 50 € versandkostenfrei."
    },
    fr: {
      metaTitle: "Soin du visage Jönköping – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Jönköping. Commande en ligne, livraison offerte dès 50 €. Protège ta peau du climat du lac Vättern.",
      kicker: "Soins à Jönköping",
      h1: "Soins naturels pour Jönköping",
      lead: "Jönköping à la pointe sud du Vättern – là où l’entêtement du Småland affronte les éléments. Vents du lac, hivers continentaux froids et altitude qui marquent la peau. Livraison offerte dès 50 €.",
      problemTitle: "Ce que Jönköping fait à ta peau",
      problemBody: "<p>La position au sud du Vättern crée un microclimat différent du Småland alentour. Le Vättern, parmi les plus grands et profonds lacs d’Europe, refroidit l’air et génère des vents locaux surprenamment violents. Son volume fait qu’il gèle rarement entièrement ; l’évaporation constante humidifie l’air – froid et cru, autrement que la sécheresse intérieure classique.</p><p>Jönköping est sur le plateau du Småland, vers 300 m d’altitude. Plus d’altitude veut dire plus d’UV et un air plus sec malgré la proximité du lac. Hivers franchement froids et stables ; les passages de saison peuvent être brutaux.</p><p>L’esprit entrepreneurial du Småland veut dire longues journées, souvent en usine ou au bureau. Le stress est élevé dans l’une des régions les plus entreprenantes de Scandinavie – ça se lit sur la peau : sécheresse, poussées, fatigue qu’aucun anti-cernes ne masque.</p>",
      tipsTitle: "Conseils peau pour Jönköping",
      tips: [
        { title: "Baignade dans le Vättern", body: "Eau glacée et propre : circulation stimulée, teint réveillé. Courtes expositions au froid ont été liées à immunité et grain de peau." },
        { title: "Randonnée dans les forêts du Småland", body: "Store Mosse et forêts voisines : air pur, baisse du stress. Marches régulières : moins de cortisol, temps de récupération pour la peau." },
        { title: "Protection UV en altitude", body: "Plus haut = plus d’UV. Protège le visage même sous nuages – les UV traversent et l’atmosphère plus fine ici amplifie." },
        { title: "Routine du soir qui compte", body: "Après une longue journée à la smålandaise, la peau a besoin de récupération. Nettoyage doux + huile nourrissante le soir : effet réel." }
      ],
      solutionTitle: "Soins au CBD livrés à Jönköping",
      solutionBody: "<p>1753 SKINCARE livre des soins naturels au CBD directement chez toi à Jönköping. Depuis Åsa près de Göteborg – livraison offerte dès 50 €.</p><p>Le DUO-kit avec The ONE et I LOVE nourrit la peau face au climat du Vättern et au froid du Småland. CBD et CBG renforcent la barrière et équilibrent l’inflammation. Au Naturel Makeup Remover à l’huile MCT nettoie en douceur après une journée de microclimats variés. Fungtastic Mushroom Extract soutient le corps de l’intérieur – pour ceux qui poussent dur.</p><p>Commande sur 1753skin.com – en général 1–2 jours ouvrés jusqu’à Jönköping.</p>",
      faq: [
        { q: "Livrez-vous à Jönköping ?", a: "Oui, depuis Åsa près de Göteborg. En général 1–2 jours ouvrés. Livraison offerte dès 50 €." },
        { q: "Où acheter des soins au CBD à Jönköping ?", a: "Le plus simple : 1753skin.com – direct chez toi sans intermédiaire." },
        { q: "Que fait le CBD sur peau exposée au froid ?", a: "Il renforce la barrière, aide à garder hydratation et élasticité malgré le froid, réduit l’inflammation et aide à réparer le stress thermique." },
        { q: "Puis-je utiliser vos produits toute l’année ?", a: "Oui. Ajuste les quantités – un peu plus en hiver, un peu moins en été." }
      ],
      ctaTitle: "L’entêtement du Småland mérite des soins à la hauteur",
      ctaSub: "Soins naturels au CBD qui durent comme ta journée de boulot. Livraison offerte dès 50 €."
    }
  },
  {
    svSlug: "hudvard-umea",
    enSlug: "skincare-umea",
    esSlug: "cuidado-piel-cbd-umea",
    deSlug: "cbd-hautpflege-umea",
    frSlug: "soin-peau-cbd-umea",
    category: "stad",
    productIds: ["duo-ta-da", "duo-kit", "fungtastic-mushroom-extract"],
    sv: {
      metaTitle: "Hudvård Umeå – CBD-baserad hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i Umeå. Beställ online med fri frakt över 700 kr. Skydda din hud mot norrländsk extrem kyla och polarnatt.",
      kicker: "Hudvård i Umeå",
      h1: "Naturlig hudvård för dig i Umeå",
      lead: "Umeå – Europas kulturhuvudstad som råkar ligga i ett av Sveriges tuffaste klimat för huden. Minus trettio på vintern, midnattssol på sommaren, och allt däremellan. Din hud behöver extremvårdare, inte standardlösningar. Fri frakt över 700 kr.",
      problemTitle: "Umeåhudens utmaningar",
      problemBody: "<p>Umeå har ett subarktiskt klimat som ställer extrema krav på huden. Vintrarna är långa – från november till mars lever huden med temperaturer som regelbundet kryper under minus tjugo, ibland under minus trettio. Den kalla luften håller nästan ingen fukt alls, och den torra vinterluften suger bokstavligen fukten ur huden. Hudens barriärfunktion sätts på sin yttersta gräns.</p><p>Polarnatten innebär veckor med minimal solexponering, vilket leder till D-vitaminbrist som påverkar hudens immunförsvar och förnyelsecykel. Huden blir blek, tunn och sårbar. Samtidigt innebär midnattssolen på sommaren extrem UV-exponering dygnet runt för hud som inte är van vid det.</p><p>Inomhusklimatet i Umeå är också extremt. Uppvärmda lägenheter och universitetslokaler har luftfuktighet som kan sjunka under 10 procent vintertid – det är torrare än Saharaöknen. Huden torkar, spricker och kliar. Och för Umeås stora studentbefolkning läggs tentastress, sömnbrist och tight budget ovanpå det hela.</p>",
      tipsTitle: "Hudvårdstips för umeåbor",
      tips: [
        { title: "Lager av fukt och olja", body: "I Umeås extrema kyla räcker inte en enda produkt. Bygg hudvården i lager: fukt närmast huden, sedan skyddande olja som barriär. Applicera minst 15 minuter innan du går ut." },
        { title: "Ta D-vitamintillskott på allvar", body: "Under polarnatten producerar kroppen noll D-vitamin. Tillskott är inte valfritt – det är nödvändigt för hudens immunförsvar, förnyelse och motståndskraft." },
        { title: "Utnyttja björkarnas Umeå", body: "Umeå är björkarnas stad, och skogspromenader längs Ume älv ger ren luft och stressreduktion även i minus. Den friska vinterluften, i korta doser med skyddad hud, kan faktiskt vara bra." },
        { title: "Bastubad och kallbad i balans", body: "Norrländsk bastutradition är fantastisk, men den extrema värmen följd av kyla kräver att du återfuktar huden ordentligt efteråt. Avsluta alltid med en närande olja." },
        { title: "Skydda huden mot blåsten vid älven", body: "Vindtunneleffekten längs Ume älv kan göra kyla till extrem kyla. Skydda ansiktet med halsduk och applicera extra olja innan promenader längs vattnet." }
      ],
      solutionTitle: "CBD-hudvård som klarar Umeås klimat",
      solutionBody: "<p>Vi på 1753 SKINCARE förstår att Umeås hud lever under extrema förhållanden. Våra produkter är formulerade för att stärka hudbarriären – inte bara plåstra om den. CBD och CBG arbetar med hudens eget endocannabinoidsystem för att reparera, skydda och balansera, oavsett vad termometern visar.</p><p>DUO-kit + TA-DA Serum-kombination är vår rekommendation för Umeå. Du får tre produkter som tillsammans ger maximal barriärstärkning: The ONE och I LOVE som daglig bas, och TA-DA Serum med koncentrerad CBG för extra intensivvård under de värsta köldknäpparna. Fungtastic Mushroom Extract stödjer immunförsvaret under de mörka månaderna.</p><p>Vi skickar från Åsa utanför Göteborg med fri frakt på beställningar över 700 kr. De flesta leveranser når Umeå inom 2–3 arbetsdagar.</p>",
      faq: [
        { q: "Levererar ni till Umeå?", a: "Ja, vi levererar till hela Sverige. Från Åsa utanför Göteborg når de flesta beställningar Umeå inom 2–3 arbetsdagar. Fri frakt på beställningar över 700 kr." },
        { q: "Var kan jag köpa CBD-hudvård i Umeå?", a: "Beställ direkt på 1753skin.com. Vi levererar till din dörr – smidigast och snabbast i en stad utan fysiska CBD-hudvårdsbutiker." },
        { q: "Klarar era oljor extrem kyla?", a: "Ja, våra oljor är stabila ner till långt under noll grader. Förvara dem i rumstemperatur hemma, och applicera generöst innan du går ut i kylan – de skapar en skyddande barriär." },
        { q: "Borde jag använda mer produkt på vintern?", a: "Ja. I Umeås extrema vinterklimat behöver huden mer skydd. Applicera ett extra lager av The ONE eller I LOVE under de kallaste perioderna, och lägg till TA-DA Serum för intensivvård." }
      ],
      ctaTitle: "Extrem kyla kräver extrem hudvård",
      ctaSub: "CBD-hudvård som stärker din barriär mot Umeås klimat. Fri frakt över 700 kr."
    },
    en: {
      metaTitle: "Skincare Umeå – CBD-based skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Umeå. Order online with free shipping over €60. Protect your skin from subarctic cold and polar night.",
      kicker: "Skincare in Umeå",
      h1: "Natural skincare for Umeå",
      lead: "Umeå – European Capital of Culture that happens to be in one of Sweden's toughest climates for skin. Minus thirty in winter, midnight sun in summer, and everything in between. Your skin needs extreme care, not standard solutions. Free shipping over €60.",
      problemTitle: "What Umeå does to your skin",
      problemBody: "<p>Umeå has a subarctic climate that places extreme demands on the skin. Winters are long – from November to March, the skin lives with temperatures that regularly drop below minus twenty, sometimes below minus thirty. The cold air holds almost no moisture at all, and the dry winter air literally sucks moisture from the skin. The skin's barrier function is pushed to its absolute limit.</p><p>The polar night means weeks with minimal sun exposure, leading to vitamin D deficiency that affects the skin's immune function and renewal cycle. Skin becomes pale, thin, and vulnerable. Meanwhile, the midnight sun in summer means extreme round-the-clock UV exposure for skin that isn't accustomed to it.</p><p>Indoor climate in Umeå is also extreme. Heated apartments and university buildings have humidity that can drop below 10 percent in winter – that's drier than the Sahara desert. Skin dries, cracks, and itches. And for Umeå's large student population, exam stress, sleep deprivation, and tight budgets are piled on top.</p>",
      tipsTitle: "Skincare tips for Umeå residents",
      tips: [
        { title: "Layer moisture and oil", body: "In Umeå's extreme cold, one product isn't enough. Build skincare in layers: moisture closest to the skin, then protective oil as a barrier. Apply at least 15 minutes before going outside." },
        { title: "Take vitamin D supplements seriously", body: "During polar night, your body produces zero vitamin D. Supplements aren't optional – they're essential for skin immunity, renewal, and resilience." },
        { title: "Use the birches' Umeå", body: "Umeå is the city of birches, and forest walks along the Ume river provide clean air and stress reduction even in sub-zero weather. Fresh winter air, in short doses with protected skin, can actually be beneficial." },
        { title: "Balance sauna and cold bathing", body: "Northern Swedish sauna tradition is fantastic, but the extreme heat followed by cold requires proper skin moisturizing afterward. Always finish with a nourishing oil." },
        { title: "Protect skin from river winds", body: "The wind tunnel effect along the Ume river can turn cold into extreme cold. Protect your face with a scarf and apply extra oil before walks along the water." }
      ],
      solutionTitle: "CBD skincare that handles Umeå's climate",
      solutionBody: "<p>At 1753 SKINCARE, we understand that Umeå skin lives under extreme conditions. Our products are formulated to strengthen the skin barrier – not just patch it up. CBD and CBG work with the skin's own endocannabinoid system to repair, protect, and balance, regardless of what the thermometer reads.</p><p>The DUO-kit + TA-DA Serum combination is our recommendation for Umeå. You get three products that together provide maximum barrier strengthening: The ONE and I LOVE as your daily base, and TA-DA Serum with concentrated CBG for extra intensive care during the worst cold snaps. Fungtastic Mushroom Extract supports immunity during the dark months.</p><p>We ship from Åsa outside Gothenburg with free shipping on orders over €60. Most deliveries reach Umeå within 2–3 business days.</p>",
      faq: [
        { q: "Do you ship to Umeå?", a: "Yes, we deliver throughout Sweden. From Åsa outside Gothenburg, most orders reach Umeå within 2–3 business days. Free shipping on orders over €60." },
        { q: "Where can I buy CBD skincare in Umeå?", a: "Order directly at 1753skin.com. We deliver to your door – easiest and fastest in a city without physical CBD skincare stores." },
        { q: "Can your oils handle extreme cold?", a: "Yes, our oils are stable well below zero degrees. Store them at room temperature at home, and apply generously before heading out – they create a protective barrier." },
        { q: "Should I use more product in winter?", a: "Yes. In Umeå's extreme winter climate, the skin needs more protection. Apply an extra layer of The ONE or I LOVE during the coldest periods, and add TA-DA Serum for intensive care." }
      ],
      ctaTitle: "Extreme cold demands extreme skincare",
      ctaSub: "CBD skincare that strengthens your barrier against Umeå's climate. Free shipping over €60."
    },
    es: {
      metaTitle: "Cuidado de la piel Umeå – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Umeå. Pide online, envío gratis desde 50 €. Protege tu piel del frío subártico y la noche polar.",
      kicker: "Cuidado de la piel en Umeå",
      h1: "Cosmética natural para Umeå",
      lead: "Umeå – Capital Europea de la Cultura que, por casualidad, tiene uno de los climas más duros de Suecia para la piel. Treinta bajo cero en invierno, sol de medianoche en verano, y todo lo demás. Tu piel pide cuidado extremo, no estándar. Envío gratis desde 50 €.",
      problemTitle: "Lo que Umeå le hace a tu piel",
      problemBody: "<p>Umeå tiene clima subártico que exige lo máximo a la piel. Inviernos largos: de noviembre a marzo la piel vive temperaturas que suelen bajar de veinte bajo cero, a veces de treinta. El aire frío casi no retiene humedad; el invierno seco literalmente succiona agua de la piel. La función barrera queda al límite.</p><p>La noche polar significa semanas casi sin sol: déficit de vitamina D que afecta inmunidad y renovación de la piel. La piel se ve pálida, fina, vulnerable. En verano el sol de medianoche implica UV extremo casi 24 h para una piel no acostumbrada.</p><p>El clima interior también es extremo: pisos y campus con humedad que en invierno puede caer por debajo del 10 % – más seco que el Sahara. La piel se agrieta y pica. Y con tanta población estudiantil: estrés de exámenes, falta de sueño y poco presupuesto encima.</p>",
      tipsTitle: "Consejos para quien vive en Umeå",
      tips: [
        { title: "Capas de humectación y aceite", body: "En el frío extremo de Umeå no basta un solo producto. Humedad pegada a la piel, luego aceite barrera. Aplica al menos 15 minutos antes de salir." },
        { title: "Vitamina D en serio", body: "En noche polar el cuerpo no fabrica vitamina D. Los suplementos no son un capricho – son clave para inmunidad, renovación y resistencia de la piel." },
        { title: "Aprovecha el Umeå de los abedules", body: "Umeå es ciudad de abedules; paseos junto al río Ume dan aire limpio y menos estrés incluso bajo cero. Aire invernal fresco, en dosis cortas con piel protegida, puede ayudar." },
        { title: "Sauna y frío en equilibrio", body: "La sauna del norte es oro, pero calor extremo + frío después exige hidratar bien. Termina siempre con aceite nutritivo." },
        { title: "Protege el rostro del viento del río", body: "El efecto túnel a lo largo del Ume convierte frío en frío extremo. Bufanda en la cara y aceite extra antes de caminar junto al agua." }
      ],
      solutionTitle: "Cosmética con CBD que aguanta el clima de Umeå",
      solutionBody: "<p>En 1753 SKINCARE sabemos que la piel en Umeå vive condiciones extremas. Los productos fortalecen la barrera – no solo la maquillan. CBD y CBG trabajan con el sistema endocannabinoide para reparar, proteger y equilibrar, pase lo que pase con el termómetro.</p><p>Nuestra recomendación para Umeå: DUO-kit + TA-DA Serum. Tres productos con refuerzo máximo de barrera: The ONE e I LOVE como base diaria, y TA-DA Serum con CBG concentrado para cuidado intensivo en las ola de frío. Fungtastic Mushroom Extract apoya la inmunidad en los meses oscuros.</p><p>Enviamos desde Åsa cerca de Gotemburgo, envío gratis desde 50 €. La mayoría de pedidos llegan a Umeå en 2–3 días laborables.</p>",
      faq: [
        { q: "¿Envían a Umeå?", a: "Sí, a toda Suecia. Desde Åsa la mayoría llega en 2–3 días laborables. Envío gratis desde 50 €." },
        { q: "¿Dónde compro cosmética con CBD en Umeå?", a: "1753skin.com – a tu puerta; lo más práctico en una ciudad sin tiendas físicas dedicadas." },
        { q: "¿Vuestros aceites aguantan frío extremo?", a: "Sí, son estables muy por debajo de cero. Guárdalos a temperatura ambiente; aplica generoso antes de salir al frío – forman barrera protectora." },
        { q: "¿Debo usar más producto en invierno?", a: "Sí. En el invierno extremo de Umeå la piel necesita más protección. Capa extra de The ONE o I LOVE en lo más duro, más TA-DA Serum para intensivo." }
      ],
      ctaTitle: "Frío extremo exige cuidado extremo",
      ctaSub: "Cosmética con CBD que refuerza tu barrera frente al clima de Umeå. Envío gratis desde 50 €."
    },
    de: {
      metaTitle: "Hautpflege Umeå – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für Umeå. Online bestellen, ab 50 € versandkostenfrei. Schutz vor subarktischer Kälte und Polarnacht.",
      kicker: "Hautpflege in Umeå",
      h1: "Natürliche Hautpflege für Umeå",
      lead: "Umeå – Europäische Kulturhauptstadt, zufällig in einem der härtesten schwedischen Klimazonen für die Haut. Minus dreißig im Winter, Mitternachtssonne im Sommer, und alles dazwischen. Deine Haut braucht Extreme Care, keine Standardlösung. Ab 50 € versandkostenfrei.",
      problemTitle: "Was Umeå mit deiner Haut macht",
      problemBody: "<p>Umeå hat subarktisches Klima mit extremen Anforderungen. Winter sind lang – von November bis März lebt die Haut regelmäßig unter minus zwanzig, manchmal unter minus dreißig. Kalte Luft hält fast keine Feuchtigkeit; trockene Winterluft zieht sie buchstäblich aus der Haut. Die Barrierefunktion ist am Limit.</p><p>Polarnacht bedeutet Wochen mit minimaler Sonne: Vitamin-D-Mangel beeinträchtigt Immunantwort und Erneuerungszyklus der Haut. Haut wird blass, dünn, verletzlich. Mitternachtssonne im Sommer bedeutet extreme Rund-um-die-Uhr-UV für ungewohnte Haut.</p><p>Innenklima ist ebenfalls extrem: beheizte Wohnungen und Uni können unter 10 % Luftfeuchtigkeit fallen – trockener als die Sahara. Haut reißt und juckt. Dazu große Studentenschaft: Prüfungsstress, Schlafmangel, knappes Budget.</p>",
      tipsTitle: "Hautpflege-Tipps für Umeå",
      tips: [
        { title: "Feuchtigkeit und Öl schichten", body: "In Umeås extremer Kälte reicht ein Produkt nicht. Aufbau: Feuchtigkeit direkt auf die Haut, dann Schutzöl. Mindestens 15 Minuten vor dem Rausgehen auftragen." },
        { title: "Vitamin D ernst nehmen", body: "In der Polarnacht produziert der Körper null Vitamin D. Supplemente sind nicht optional – essentiell für Immunsystem, Erneuerung und Hautresilienz." },
        { title: "Das birkenreiche Umeå nutzen", body: "Umeå ist Birkenstadt; Waldgänge am Ume-Fluss geben saubere Luft und Stressabbau auch unter Null. Frische Winterluft in kurzen Dosen mit geschützter Haut kann helfen." },
        { title: "Sauna und Kälte ausbalancieren", body: "Nordschwedische Sauna ist großartig, aber Hitze plus Kälte danach braucht richtige Feuchtigkeit. Immer mit nährendem Öl abschließen." },
        { title: "Gesicht vor Flusswind schützen", body: "Windtunnel entlang des Ume macht aus Kälte Extreme-Kälte. Schal ums Gesicht, extra Öl vor Wasserspaziergängen." }
      ],
      solutionTitle: "CBD-Hautpflege, die Umeås Klima packt",
      solutionBody: "<p>Bei 1753 SKINCARE wissen wir: Haut in Umeå lebt unter Extrembedingungen. Unsere Produkte stärken die Barriere – nicht nur kaschieren. CBD und CBG arbeiten mit dem Endocannabinoidsystem der Haut für Reparatur, Schutz und Balance, egal was das Thermometer zeigt.</p><p>Unsere Empfehlung für Umeå: DUO-kit + TA-DA Serum. Drei Produkte für maximale Barrieren-Stärkung: The ONE und I LOVE als tägliche Basis, TA-DA Serum mit konzentriertem CBG für Intensivpflege in Kälteeinbrüchen. Fungtastic Mushroom Extract unterstützt die Immunität in dunklen Monaten.</p><p>Versand aus Åsa bei Göteborg, ab 50 € versandkostenfrei. Meist 2–3 Werktage bis Umeå.</p>",
      faq: [
        { q: "Liefert ihr nach Umeå?", a: "Ja, in ganz Schweden. Von Åsa meist 2–3 Werktage. Ab 50 € versandkostenfrei." },
        { q: "Wo kaufe ich CBD-Hautpflege in Umeå?", a: "1753skin.com – bis vor die Tür; am praktischsten ohne physische CBD-Läden." },
        { q: "Halten eure Öle extremer Kälte stand?", a: "Ja, stabil weit unter null. Bei Raumtemperatur lagern, großzügig vor dem Rausgehen – sie bilden eine Schutzbarriere." },
        { q: "Soll ich im Winter mehr Produkt nutzen?", a: "Ja. In Umeås extremem Winter braucht die Haut mehr Schutz. Extra-Schicht The ONE oder I LOVE in der härtesten Phase plus TA-DA Serum für Intensivpflege." }
      ],
      ctaTitle: "Extreme Kälte verlangt extreme Pflege",
      ctaSub: "CBD-Pflege, die deine Barriere gegen Umeås Klima stärkt. Ab 50 € versandkostenfrei."
    },
    fr: {
      metaTitle: "Soin du visage Umeå – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Umeå. Commande en ligne, livraison offerte dès 50 €. Protège ta peau du froid subarctique et de la nuit polaire.",
      kicker: "Soins à Umeå",
      h1: "Soins naturels pour Umeå",
      lead: "Umeå – capitale européenne de la culture tombée par hasard dans l’un des climats les plus rudes de Suède pour la peau. Moins trente l’hiver, soleil de minuit l’été, et tout entre les deux. Ta peau veut des soins extrêmes, pas des solutions toutes faites. Livraison offerte dès 50 €.",
      problemTitle: "Ce qu’Umeå fait à ta peau",
      problemBody: "<p>Umeå a un climat subarctique qui pousse la peau à bout. Hivers longs : de novembre à mars, la peau vit souvent sous moins vingt, parfois moins trente. L’air froid retient presque aucune humidité ; l’hiver sec aspire littéralement l’eau de la peau. La barrière est à bout de souffle.</p><p>La nuit polaire veut dire des semaines sans soleil : carence en vitamine D qui touche immunité et cycle de renouvellement. La peau devient pâle, fine, fragile. Le soleil de minuit en été, c’est une exposition UV extrême quasi 24 h pour une peau pas préparée.</p><p>L’air intérieur est extrême aussi : logements et campus peuvent descendre sous 10 % d’humidité en hiver – plus sec que le Sahara. La peau craquelle et démange. Et avec beaucoup d’étudiants : stress d’examens, manque de sommeil, budget serré par-dessus.</p>",
      tipsTitle: "Conseils peau pour Umeå",
      tips: [
        { title: "Superpose hydratation et huile", body: "Dans le froid extrême d’Umeå, un seul produit ne suffit. Couche d’hydratation contre la peau, puis huile barrière. Applique au moins 15 minutes avant de sortir." },
        { title: "Prends la vitamine D au sérieux", body: "Pendant la nuit polaire, zéro vitamine D endogène. Les compléments ne sont pas un luxe – ils sont essentiels pour immunité, renouvellement et résilience cutanée." },
        { title: "Profite de l’Umeå des bouleaux", body: "Umeå, ville de bouleaux : les promenades le long de l’Ume offrent air pur et baisse de stress même sous zéro. Air d’hiver frais, en petites doses avec peau protégée, peut faire du bien." },
        { title: "Équilibre sauna et froid", body: "La tradition nordique du sauna est top, mais chaleur extrême puis froid exigent une réhydratation sérieuse. Termine toujours par une huile nourrissante." },
        { title: "Protège le visage du vent de rivière", body: "L’effet tunnel le long de l’Ume transforme le froid en froid extrême. Écharpe sur le visage, huile en plus avant les balades au bord de l’eau." }
      ],
      solutionTitle: "Des soins au CBD qui tiennent le climat d’Umeå",
      solutionBody: "<p>Chez 1753 SKINCARE on sait que la peau à Umeå vit des conditions extrêmes. Nos produits renforcent la barrière – pas seulement la maquillent. CBD et CBG s’alignent sur le système endocannabinoïde pour réparer, protéger et équilibrer, quel que soit le thermomètre.</p><p>Notre reco pour Umeå : DUO-kit + TA-DA Serum. Trois produits pour un renfort barrière maximal : The ONE et I LOVE en base quotidienne, TA-DA Serum au CBG concentré pour soins intensifs pendant les vagues de froid. Fungtastic Mushroom Extract soutient l’immunité pendant les mois noirs.</p><p>Expédition depuis Åsa près de Göteborg, livraison offerte dès 50 €. En général 2–3 jours ouvrés jusqu’à Umeå.</p>",
      faq: [
        { q: "Livrez-vous à Umeå ?", a: "Oui, dans toute la Suède. Depuis Åsa, en général 2–3 jours ouvrés. Livraison offerte dès 50 €." },
        { q: "Où acheter des soins au CBD à Umeå ?", a: "1753skin.com – livraison à domicile ; le plus simple sans magasins physiques dédiés." },
        { q: "Vos huiles résistent-elles au froid extrême ?", a: "Oui, stables bien en dessous de zéro. Range-les à température ambiante ; applique généreusement avant de sortir – elles forment une barrière protectrice." },
        { q: "Dois-je utiliser plus de produit en hiver ?", a: "Oui. En hiver extrême à Umeå, la peau veut plus de protection. Couche supplémentaire de The ONE ou I LOVE aux pires périodes, plus TA-DA Serum en intensif." }
      ],
      ctaTitle: "Froid extrême = soins extrêmes",
      ctaSub: "Soins au CBD qui renforcent ta barrière face au climat d’Umeå. Livraison offerte dès 50 €."
    }
  },
  {
    svSlug: "hudvard-lund",
    enSlug: "skincare-lund",
    esSlug: "cuidado-piel-cbd-lund",
    deSlug: "cbd-hautpflege-lund",
    frSlug: "soin-peau-cbd-lund",
    category: "stad",
    productIds: ["duo-kit", "ta-da-serum"],
    sv: {
      metaTitle: "Hudvård Lund – CBD-baserad hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i Lund. Beställ online med fri frakt över 700 kr. Vetenskapligt grundad hudvård för Sveriges mest forskningsintensiva stad.",
      kicker: "Hudvård i Lund",
      h1: "Naturlig hudvård för dig i Lund",
      lead: "Lund – kunskapsstaden som forskar fram framtiden. Din hud förtjänar samma vetenskapliga eftertanke. Skånes blåsiga klimat, hårt vatten och studentlivets påfrestningar kräver mer än standard. Fri frakt över 700 kr.",
      problemTitle: "Lundahudens utmaningar",
      problemBody: "<p>Lund delar mycket av Skånes klimatutmaningar – blåst, relativt milt men fuktigt klimat, och hårt kranvatten. Men som universitetsstad har Lund sina egna unika hudutmaningar. Stadens 50 000 studenter lever ofta i en cocktail av stress, sömnbrist, tight budget och snabb mat som sätter spår i huden.</p><p>Det skånska vattnet i Lund har hög kalkhalt, vilket långsamt bryter ner hudbarriären vid daglig tvätt. Effekten märks inte direkt, men efter veckor och månader upplever många torr, irriterad och reaktiv hud utan att kunna peka på orsaken. Kalkavlagringar på huden kan dessutom täppa till porer och förvärra akne.</p><p>Lunds kompakta stadskärna gör att de flesta cyklar – bra för kondition men utsätter ansiktet för vind, partiklar och temperaturväxlingar dagligen. Den skånska höstvinden blåser rakt in från sydväst och tar med sig fukt från Öresund som gör kylan genomträngande.</p>",
      tipsTitle: "Hudvårdstips för lundabor",
      tips: [
        { title: "Installera duschfilter", body: "Lunds hårda vatten är en tyst fiende mot din hud. Ett duschfilter som reducerar kalken kan vara den enklaste åtgärden med störst effekt på torr och irriterad hud." },
        { title: "Cykla smart", body: "Lund är en cykelstad, men skydda ansiktet. En tunn olja som barriär innan cykelturen skyddar mot vind och partiklar – tar tio sekunder och gör stor skillnad." },
        { title: "Ta hand om huden under tentaperioder", body: "Stress, sena nätter och snabb mat syns i huden. Håll hudvårdsrutinen enkel men konsekvent under tentaperioderna – det är inte tidpunkten att skippa rengöring och fukt." },
        { title: "Utforska Skåneleden", body: "Skånes vandringsleder runt Lund ger dig frisk luft och stresslindring. Natur är den bästa medicinen mot den kortisoldrivna stresshud som drabbar så många studenter." }
      ],
      solutionTitle: "CBD-hudvård levererad till Lund",
      solutionBody: "<p>I en stad som lever av forskning och kunskap borde hudvården bygga på samma grund. CBD-hudvård är inte fluff – det är produkter som arbetar med hudens endocannabinoidsystem, ett system som forskningen lyfter fram allt mer som centralt för hudhälsa.</p><p>DUO-kit med The ONE och I LOVE ger din lundalägenhetshud den barriärstärkning som det skånska vattnet och klimatet kräver. TA-DA Serum med koncentrerad CBG fungerar som intensivvård under stressiga perioder – tentaveckor, deadlines, de mörka vintermånaderna.</p><p>Beställ på 1753skin.com – vi skickar från Åsa utanför Göteborg. Fri frakt på beställningar över 700 kr, leverans till Lund inom 1–2 arbetsdagar.</p>",
      faq: [
        { q: "Levererar ni till Lund?", a: "Ja, vi skickar från Åsa utanför Göteborg och de flesta beställningar når Lund inom 1–2 arbetsdagar. Fri frakt över 700 kr." },
        { q: "Var kan jag köpa CBD-hudvård i Lund?", a: "Beställ direkt på 1753skin.com. Vi säljer online utan mellanhänder – smidigt levererat till din studentkorridor eller villa." },
        { q: "Finns vetenskapligt stöd för CBD i hudvård?", a: "Ja, forskningen växer. Studier visar antiinflammatoriska, antioxidativa och sebostatiska egenskaper. Lunds universitet ligger i framkant av cannabinoidforskning – fråga din närmaste forskare." },
        { q: "Passar era produkter studentbudget?", a: "DUO-kit kostar 1 099 kr och räcker i flera månader. Per dag är det billigare än en kaffe på Lundagård – och gör mer för din hud." }
      ],
      ctaTitle: "Forskningen talar – CBD fungerar",
      ctaSub: "Vetenskapligt grundad hudvård till din dörr i Lund. Fri frakt över 700 kr."
    },
    en: {
      metaTitle: "Skincare Lund – CBD-based skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Lund. Order online with free shipping over €60. Science-backed skincare for Sweden's research capital.",
      kicker: "Skincare in Lund",
      h1: "Natural skincare for Lund",
      lead: "Lund – the knowledge city researching the future. Your skin deserves the same scientific thoughtfulness. Skåne's windy climate, hard water, and student life demands more than standard. Free shipping over €60.",
      problemTitle: "What Lund does to your skin",
      problemBody: "<p>Lund shares many of Skåne's climate challenges – wind, relatively mild but humid climate, and hard tap water. But as a university city, Lund has its own unique skin challenges. The city's 50,000 students often live in a cocktail of stress, sleep deprivation, tight budgets, and fast food that leaves marks on the skin.</p><p>The Scanian water in Lund has high calcium content, which slowly breaks down the skin barrier through daily washing. The effect isn't immediate, but after weeks and months, many experience dry, irritated, and reactive skin without being able to point to the cause. Calcium deposits on the skin can also clog pores and worsen acne.</p><p>Lund's compact city center means most people cycle – great for fitness but exposing the face to wind, particles, and temperature shifts daily. The Scanian autumn wind blows straight in from the southwest, carrying moisture from the Öresund strait that makes the cold penetrating.</p>",
      tipsTitle: "Skincare tips for Lund residents",
      tips: [
        { title: "Install a shower filter", body: "Lund's hard water is a silent enemy against your skin. A shower filter that reduces calcium can be the simplest action with the greatest effect on dry, irritated skin." },
        { title: "Cycle smart", body: "Lund is a cycling city, but protect your face. A thin oil as a barrier before cycling protects against wind and particles – takes ten seconds and makes a big difference." },
        { title: "Take care of skin during exams", body: "Stress, late nights, and fast food show in the skin. Keep your skincare routine simple but consistent during exam periods – it's not the time to skip cleansing and moisture." },
        { title: "Explore Skåneleden", body: "Skåne's hiking trails around Lund give you fresh air and stress relief. Nature is the best medicine for the cortisol-driven stress skin that affects so many students." }
      ],
      solutionTitle: "CBD skincare delivered to Lund",
      solutionBody: "<p>In a city that lives by research and knowledge, skincare should build on the same foundation. CBD skincare isn't fluff – these are products that work with the skin's endocannabinoid system, a system that research increasingly highlights as central to skin health.</p><p>The DUO-kit with The ONE and I LOVE gives your Lund apartment skin the barrier strengthening that Scanian water and climate demand. TA-DA Serum with concentrated CBG works as intensive care during stressful periods – exam weeks, deadlines, the dark winter months.</p><p>Order at 1753skin.com – we ship from Åsa outside Gothenburg. Free shipping on orders over €60, delivery to Lund within 1–2 business days.</p>",
      faq: [
        { q: "Do you ship to Lund?", a: "Yes, we ship from Åsa outside Gothenburg and most orders reach Lund within 1–2 business days. Free shipping over €60." },
        { q: "Where can I buy CBD skincare in Lund?", a: "Order directly at 1753skin.com. We sell online without middlemen – conveniently delivered to your student corridor or villa." },
        { q: "Is there scientific support for CBD in skincare?", a: "Yes, the research is growing. Studies show anti-inflammatory, antioxidant, and sebostatic properties. Lund University is at the forefront of cannabinoid research – ask your nearest researcher." },
        { q: "Do your products fit a student budget?", a: "The DUO-kit costs \u20AC95 and lasts several months. Per day, it's cheaper than a coffee at Lundagård – and does more for your skin." }
      ],
      ctaTitle: "The research speaks – CBD works",
      ctaSub: "Science-backed skincare to your door in Lund. Free shipping over €60."
    },
    es: {
      metaTitle: "Cuidado de la piel Lund – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Lund. Pide online, envío gratis desde 50 €. Cuidado con base científica en la ciudad sueca más intensa en investigación.",
      kicker: "Cuidado de la piel en Lund",
      h1: "Cosmética natural para Lund",
      lead: "Lund – ciudad del conocimiento que investiga el futuro. Tu piel merece el mismo rigor. Viento de Skåne, agua dura y vida universitaria exigen más que lo estándar. Envío gratis desde 50 €.",
      problemTitle: "Lo que Lund le hace a tu piel",
      problemBody: "<p>Lund comparte muchos retos de Skåne: viento, clima relativamente suave pero húmedo, agua dura. Como ciudad universitaria añade los suyos: unas 50 000 personas en cóctel de estrés, falta de sueño, presupuesto justo y comida rápida que se nota en la piel.</p><p>El agua scania en Lund es muy calcárea; el lavado diario desgasta la barrera poco a poco. No se ve al día siguiente, pero tras semanas muchos tienen piel seca, irritada y reactiva sin saber por qué. El calcio en la superficie también puede obstruir poros y empeorar el acné.</p><p>El centro compacto invita a ir en bici – genial para el cuerpo, pero el rostro aguanta viento, partículas y cambios térmicos cada día. El viento otoñal entra del suroeste arrastrando humedad del Öresund que hace morder el frío.</p>",
      tipsTitle: "Consejos para quien vive en Lund",
      tips: [
        { title: "Filtro de ducha", body: "El agua dura es un enemigo silencioso. Reducir cal en la ducha es a menudo el gesto más simple con mayor impacto en piel seca e irritada." },
        { title: "Bici con cabeza", body: "Lund es ciudad de bici: una fina capa de aceite antes del trayecto protege de viento y partículas – diez segundos, gran diferencia." },
        { title: "Cuida la piel en exámenes", body: "Estrés, noches largas y comida rápida se leen en la cara. Mantén la rutina simple pero constante en exámenes – no es momento de saltarse limpieza e hidratación." },
        { title: "Explora Skåneleden", body: "Los senderos alrededor de Lund dan aire fresco y menos estrés. La naturaleza baja el cortisol mejor que muchas cosas para la piel estresada." }
      ],
      solutionTitle: "Cosmética con CBD con entrega en Lund",
      solutionBody: "<p>En una ciudad que vive de la investigación, el cuidado de la piel debería apoyarse en lo mismo. La cosmética con CBD no es humo: actúa sobre el sistema endocannabinoide, cada vez más central en la ciencia cutánea.</p><p>El DUO-kit con The ONE y I LOVE refuerza la barrera que exigen el agua y el clima scanios. TA-DA Serum con CBG es cuidado intensivo en estrés – exámenes, deadlines, invierno oscuro.</p><p>Pide en 1753skin.com – enviamos desde Åsa cerca de Gotemburgo. Envío gratis desde 50 €; entrega a Lund en 1–2 días laborables.</p>",
      faq: [
        { q: "¿Envían a Lund?", a: "Sí, desde Åsa cerca de Gotemburgo. Suele llegar en 1–2 días laborables. Envío gratis desde 50 €." },
        { q: "¿Dónde compro cosmética con CBD en Lund?", a: "1753skin.com – venta online sin intermediarios, a tu pasillo de residencia o tu casa." },
        { q: "¿Hay evidencia científica del CBD en cosmética?", a: "Sí, crece. Estudios muestran efectos antiinflamatorios, antioxidantes y sebostáticos. La Universidad de Lund está a la vanguardia en cannabinoides – pregunta a quien investiga cerca de ti." },
        { q: "¿Encaja con presupuesto de estudiante?", a: "El DUO-kit cuesta 95 € y dura meses. Por día sale más barato que un café en Lundagård – y hace más por tu piel." }
      ],
      ctaTitle: "La ciencia habla: el CBD funciona",
      ctaSub: "Cuidado con base científica hasta tu puerta en Lund. Envío gratis desde 50 €."
    },
    de: {
      metaTitle: "Hautpflege Lund – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für Lund. Online bestellen, ab 50 € versandkostenfrei. Wissenschaftlich fundierte Pflege in Schwedens Forschungshochburg.",
      kicker: "Hautpflege in Lund",
      h1: "Natürliche Hautpflege für Lund",
      lead: "Lund – Wissensstadt mit Blick in die Forschungszukunft. Deine Haut verdient dieselbe Sorgfalt. Skåne-Wind, hartes Wasser und Studentenleben verlangen mehr als Standard. Ab 50 € versandkostenfrei.",
      problemTitle: "Was Lund mit deiner Haut macht",
      problemBody: "<p>Lund teilt viele Skåne-Herausforderungen – Wind, mildes aber feuchtes Klima, hartes Leitungswasser. Als Universitätsstadt kommen eigene hinzu: rund 50.000 Studierende im Cocktail aus Stress, Schlafmangel, knappem Budget und Fast Food, der auf der Haut landet.</p><p>Das Wasser in Lund ist kalkhaltig; tägliches Waschen frisst die Barriere langsam auf. Nicht sofort sichtbar, aber nach Wochen viele mit trockener, gereizter, reaktiver Haut ohne klare Ursache. Kalkablagerungen können Poren verstopfen und Akne verschlimmern.</p><p>Das kompakte Zentrum bedeutet viel Radfahren – top für Fitness, aber Gesicht bekommt Wind, Partikel und Temperaturwechsel täglich. Herbstwind aus Südwest bringt Öresund-Feuchte, die Kälte beißender macht.</p>",
      tipsTitle: "Hautpflege-Tipps für Lund",
      tips: [
        { title: "Duschfilter", body: "Hartes Wasser ist ein stiller Feind. Kalkreduktion in der Dusche oft der einfachste Hebel mit größtem Effekt bei trockener, gereizter Haut." },
        { title: "Radfahren clever", body: "Lund ist Fahrradstadt – dünnes Öl vor der Fahrt schützt vor Wind und Partikeln. Zehn Sekunden, großer Unterschied." },
        { title: "Haut in Prüfungsphasen", body: "Stress, späte Nächte, Fast Food sieht man. Routine simpel aber konsequent halten – keine Zeit, Reinigung und Feuchtigkeit zu skippen." },
        { title: "Skåneleden erkunden", body: "Wanderwege um Lund: frische Luft, Stressabbau. Natur senkt Cortisol – oft das Beste gegen Stress-Haut." }
      ],
      solutionTitle: "CBD-Hautpflege nach Lund",
      solutionBody: "<p>In einer Stadt, die von Forschung lebt, sollte Pflege dieselbe Basis haben. CBD-Pflege ist kein Marketing – sie arbeitet mit dem endocannabinoiden System der Haut, das die Forschung zunehmend zentral sieht.</p><p>Das DUO-kit mit The ONE und I LOVE stärkt die Barriere gegen skånes Wasser und Klima. TA-DA Serum mit CBG ist Intensivpflege in stressigen Phasen – Prüfungswochen, Deadlines, dunkler Winter.</p><p>Bestell auf 1753skin.com – Versand aus Åsa bei Göteborg. Ab 50 € versandkostenfrei, Lieferung nach Lund in 1–2 Werktagen.</p>",
      faq: [
        { q: "Liefert ihr nach Lund?", a: "Ja, aus Åsa bei Göteborg. Meist 1–2 Werktage. Ab 50 € versandkostenfrei." },
        { q: "Wo kaufe ich CBD-Hautpflege in Lund?", a: "1753skin.com – online ohne Zwischenhändler, bis zum Studentenkorridor oder Haus." },
        { q: "Gibt es wissenschaftliche Belege für CBD in der Pflege?", a: "Ja, die Datenlage wächst. Studien zeigen antiinflammatorische, antioxidative und sebostatische Effekte. Die Universität Lund ist in Cannabinoidforschung vorn – frag die nächste Forschungsgruppe." },
        { q: "Passt das zu Studentenbudget?", a: "Das DUO-kit kostet 95 € und hält Monate. Pro Tag günstiger als ein Kaffee am Lundagård – und tut mehr für die Haut." }
      ],
      ctaTitle: "Die Forschung spricht – CBD funktioniert",
      ctaSub: "Wissenschaftlich fundierte Pflege bis vor die Tür in Lund. Ab 50 € versandkostenfrei."
    },
    fr: {
      metaTitle: "Soin du visage Lund – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Lund. Commande en ligne, livraison offerte dès 50 €. Soins appuyés par la science dans la capitale recherche de la Suède.",
      kicker: "Soins à Lund",
      h1: "Soins naturels pour Lund",
      lead: "Lund – la ville-savoir qui invente demain. Ta peau mérite le même sérieux. Vent de Skåne, eau dure et vie étudiante : il faut plus que du standard. Livraison offerte dès 50 €.",
      problemTitle: "Ce que Lund fait à ta peau",
      problemBody: "<p>Lund partage beaucoup des défis du Skåne : vent, climat plutôt doux mais humide, eau calcaire. En ville universitaire, il y a en plus ~50 000 étudiants dans un cocktail stress, manque de sommeil, budget serré et fast-food qui se lit sur la peau.</p><p>L’eau scanienne à Lund est très riche en calcium ; le lavage quotidien ronge la barrière lentement. Pas visible tout de suite, mais après des semaines beaucoup ont une peau sèche, irritée, réactive sans identifier la cause. Les dépôts de calcium peuvent aussi boucher les pores et aggraver l’acné.</p><p>Le centre compact pousse au vélo – top pour la forme, mais le visage prend vent, particules et chocs thermiques au quotidien. Le vent d’automne arrive du sud-ouest avec l’humidité de l’Öresund qui rend le froid plus mordant.</p>",
      tipsTitle: "Conseils peau pour Lund",
      tips: [
        { title: "Filtre de douche", body: "L’eau dure est une ennemie silencieuse. Réduire le calcaire sous la douche est souvent le geste le plus simple avec le plus gros effet sur peau sèche et irritée." },
        { title: "Vélo malin", body: "Lund est ville à vélo : une fine couche d’huile avant le trajet protège du vent et des particules – dix secondes, gros effet." },
        { title: "Soigne ta peau aux examens", body: "Stress, nuits longues, fast-food : ça se voit. Garde une routine simple mais régulière aux partiels – pas le moment de zapper nettoyage + hydratation." },
        { title: "Explore le Skåneleden", body: "Les sentiers autour de Lund offrent air pur et baisse de stress. La nature fait baisser le cortisol – souvent le meilleur remède anti-peau stressée." }
      ],
      solutionTitle: "Soins au CBD livrés à Lund",
      solutionBody: "<p>Dans une ville qui vit de la recherche, les soins devraient s’appuyer sur la même base. Les soins au CBD ne sont pas du flan : ils s’appuient sur le système endocannabinoïde de la peau, de plus en plus central dans la science dermatologique.</p><p>Le DUO-kit avec The ONE et I LOVE renforce la barrière face à l’eau et au climat scaniens. TA-DA Serum au CBG joue les soins intensifs sous stress – partiels, deadlines, hiver sombre.</p><p>Commande sur 1753skin.com – expédition depuis Åsa près de Göteborg. Livraison offerte dès 50 €, livraison à Lund en 1–2 jours ouvrés.</p>",
      faq: [
        { q: "Livrez-vous à Lund ?", a: "Oui, depuis Åsa près de Göteborg. En général 1–2 jours ouvrés. Livraison offerte dès 50 €." },
        { q: "Où acheter des soins au CBD à Lund ?", a: "1753skin.com – vente en ligne sans intermédiaire, jusqu’à ton couloir de résidence ou ta maison." },
        { q: "Y a-t-il des preuves scientifiques pour le CBD en cosmétique ?", a: "Oui, la littérature grossit. Des études montrent des effets anti-inflammatoires, antioxydants et sébostatiques. L’université de Lund est en pointe sur les cannabinoïdes – demande au labo du coin." },
        { q: "Ça rentre dans un budget étudiant ?", a: "Le DUO-kit coûte 95 € et tient des mois. Par jour, moins cher qu’un café à Lundagård – et ça fait plus pour ta peau." }
      ],
      ctaTitle: "La recherche parle : le CBD marche",
      ctaSub: "Soins fondés sur la science jusqu’à chez toi à Lund. Livraison offerte dès 50 €."
    }
  },
  {
    svSlug: "hudvard-boras",
    enSlug: "skincare-boras",
    esSlug: "cuidado-piel-cbd-boras",
    deSlug: "cbd-hautpflege-boras",
    frSlug: "soin-peau-cbd-boras",
    category: "stad",
    productIds: ["duo-kit", "au-naturel-makeup-remover", "ta-da-serum"],
    sv: {
      metaTitle: "Hudvård Borås – CBD-baserad hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i Borås. Beställ online med fri frakt över 700 kr. Skydda din hud mot Borås berömda regn och Sjuhäradsbygdens klimat.",
      kicker: "Hudvård i Borås",
      h1: "Naturlig hudvård för dig i Borås",
      lead: "Borås – Sveriges regnhuvudstad. Om du bor här vet du redan att din hud har det tufft. Men det behöver inte vara så. Naturlig CBD-hudvård som förstår dina förhållanden – levererad från dina grannar i Åsa. Fri frakt över 700 kr.",
      problemTitle: "Boråshudens utmaningar",
      problemBody: "<p>Borås är inte Sveriges regnigaste stad bara på skämt – det är fakta. Stadens läge i Sjuhäradsbygden, inkilad mellan kullar och sjöar, skapar ett mikroklimat som fångar fukten. Årsnederbörden är bland de högsta i Sverige, och det innebär att din hud lever i en konstant fuktig miljö utomhus – men paradoxalt nog extremt torr inomhus under uppvärmningsperioden.</p><p>Den ständiga fukten kan lura dig att tro att din hud är hydrerad. Men yttre fukt är inte samma sak som hudbarriärens egna fuktretention. Många i Borås har dehydrerad hud utan att veta om det – ytan känns fuktig men barriären är försvagad och läcker fukt inifrån.</p><p>Borås textiltradition lever vidare genom Textilhögskolan och en aktiv modeindustri, och många tänker mer på vad de har PÅ huden (kläder) än hur huden under mår. Kombinationen av regnpendling, ständiga temperaturväxlingar mellan ute och inne, och den stress som ett aktivt yrkesliv innebär, gör att boråsarhud behöver mer medveten omsorg än den ofta får.</p>",
      tipsTitle: "Hudvårdstips för boråsare",
      tips: [
        { title: "Skilja på yttre fukt och hudbarriärens fukt", body: "Bara för att det regnar betyder inte det att din hud är fuktad. Hudbarriären behöver sina egna fettsyror och skyddslager – applicera olja dagligen, oavsett vädret." },
        { title: "Torka huden varsamt efter regn", body: "Regnvatten på huden avdunstar och tar med sig fukt. Torka försiktigt med en ren handduk och applicera skyddande olja efteråt – särskilt i ansiktet." },
        { title: "Utforska Borås djurpark och Rya åsar", body: "Naturen runt Borås ger frisk luft och stresslindring. Rya åsars bokskog och djurparkens grönområden erbjuder skyddade promenader även i regn." },
        { title: "Investera i barriärstärkning", body: "I Borås fuktklimat handlar hudvård mer om att stärka barriären än att tillföra fukt. Oljor som låser in och skyddar är viktigare än vattenbasprodukter som dunstar bort." }
      ],
      solutionTitle: "CBD-hudvård från dina grannar",
      solutionBody: "<p>Vi bor i Åsa, bara en kort bilresa från Borås. Vi vet hur Sjuhäradsbygdens klimat fungerar – regnet, fukten, den snabba växlingen mellan ute och inne. 1753 SKINCARE är skapat med just den här verkligheten i åtanke.</p><p>DUO-kit med The ONE och I LOVE ger din hud den barriärstärkning som regnet och fukten kräver. CBD och CBG arbetar med hudens eget system för att låsa in fukt och stärka skyddsfunktionen inifrån. Au Naturel Makeup Remover rengör milt efter en regnig dag utan att förvärra barriärförsvagningen. TA-DA Serum med CBG ger extra stöd under de gråaste perioderna.</p><p>Beställ på 1753skin.com – fri frakt på beställningar över 700 kr, och leveransen från Åsa når Borås redan nästa dag.</p>",
      faq: [
        { q: "Levererar ni till Borås?", a: "Vi sitter i Åsa, strax söder om Göteborg och nära Borås. De flesta beställningar når dig redan nästa arbetsdag. Fri frakt över 700 kr." },
        { q: "Var kan jag köpa CBD-hudvård i Borås?", a: "Beställ på 1753skin.com – snabbast och smidigast, direkt från oss i Åsa utan mellanhänder." },
        { q: "Behöver min hud fukt när det redan är fuktigt ute?", a: "Ja. Yttre luftfuktighet och hudens egen fuktretention är helt olika saker. Huden behöver sina egna fettsyror och barriärskydd – det levererar inte regn." },
        { q: "Vilken produkt passar bäst i fuktigt klimat?", a: "DUO-kit ger den barriärstärkning som fuktigt klimat kräver. Oljorna låser in hudens fukt utan att lägga till vattenbaserad fukt som dunstar." }
      ],
      ctaTitle: "Borås regn kräver Borås hudvård",
      ctaSub: "Barriärstärkande CBD-hudvård från dina grannar i Åsa. Fri frakt över 700 kr."
    },
    en: {
      metaTitle: "Skincare Borås – CBD-based skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Borås. Order online with free shipping over €60. Protect your skin from Sweden's rain capital climate.",
      kicker: "Skincare in Borås",
      h1: "Natural skincare for Borås",
      lead: "Borås – Sweden's rain capital. If you live here, you already know your skin has it tough. But it doesn't have to be that way. Natural CBD skincare that understands your conditions – delivered from your neighbors in Åsa. Free shipping over €60.",
      problemTitle: "What Borås does to your skin",
      problemBody: "<p>Borås isn't just jokingly called Sweden's rainiest city – it's fact. The city's location in the Sjuhärad region, nestled between hills and lakes, creates a microclimate that traps moisture. Annual precipitation is among the highest in Sweden, meaning your skin lives in a constantly humid outdoor environment – but paradoxically extremely dry indoors during the heating season.</p><p>The constant moisture can trick you into thinking your skin is hydrated. But external humidity isn't the same as the skin barrier's own moisture retention. Many in Borås have dehydrated skin without knowing it – the surface feels moist but the barrier is weakened and leaks moisture from within.</p><p>Borås's textile tradition lives on through the Swedish School of Textiles and an active fashion industry, and many think more about what they wear ON their skin (clothes) than how the skin underneath feels. The combination of rainy commutes, constant temperature shifts between outdoors and indoors, and the stress of an active professional life means Borås skin needs more conscious care than it often gets.</p>",
      tipsTitle: "Skincare tips for Borås residents",
      tips: [
        { title: "Distinguish external moisture from barrier moisture", body: "Just because it rains doesn't mean your skin is moisturized. The skin barrier needs its own fatty acids and protective layers – apply oil daily, regardless of weather." },
        { title: "Dry skin gently after rain", body: "Rainwater on the skin evaporates and takes moisture with it. Gently pat dry with a clean towel and apply protective oil afterward – especially on the face." },
        { title: "Explore Borås Zoo and Rya hills", body: "Nature around Borås provides fresh air and stress relief. Rya hills' beech forest and the zoo's green areas offer sheltered walks even in rain." },
        { title: "Invest in barrier strengthening", body: "In Borås's humid climate, skincare is more about strengthening the barrier than adding moisture. Oils that lock in and protect are more important than water-based products that evaporate." }
      ],
      solutionTitle: "CBD skincare from your neighbors",
      solutionBody: "<p>We live in Åsa, just a short drive from Borås. We know how the Sjuhärad climate works – the rain, the moisture, the rapid shifts between outdoors and indoors. 1753 SKINCARE is created with exactly this reality in mind.</p><p>The DUO-kit with The ONE and I LOVE gives your skin the barrier strengthening that rain and humidity demand. CBD and CBG work with the skin's own system to lock in moisture and strengthen protective function from within. Au Naturel Makeup Remover cleanses gently after a rainy day without worsening barrier weakness. TA-DA Serum with CBG provides extra support during the greyest periods.</p><p>Order at 1753skin.com – free shipping on orders over €60, and delivery from Åsa reaches Borås the next day.</p>",
      faq: [
        { q: "Do you ship to Borås?", a: "We're based in Åsa, just south of Gothenburg and close to Borås. Most orders reach you the next business day. Free shipping over €60." },
        { q: "Where can I buy CBD skincare in Borås?", a: "Order at 1753skin.com – fastest and easiest, directly from us in Åsa without middlemen." },
        { q: "Does my skin need moisture when it's already humid outside?", a: "Yes. External air humidity and the skin's own moisture retention are completely different things. The skin needs its own fatty acids and barrier protection – rain doesn't deliver that." },
        { q: "Which product is best for a humid climate?", a: "The DUO-kit provides the barrier strengthening that humid climates demand. The oils lock in the skin's moisture without adding water-based moisture that evaporates." }
      ],
      ctaTitle: "Borås rain demands Borås skincare",
      ctaSub: "Barrier-strengthening CBD skincare from your neighbors in Åsa. Free shipping over €60."
    },
    es: {
      metaTitle: "Cuidado de la piel Borås – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Borås. Pide online, envío gratis desde 50 €. Protege tu piel de la lluvia legendaria y del clima del Sjuhärad.",
      kicker: "Cuidado de la piel en Borås",
      h1: "Cosmética natural para Borås",
      lead: "Borås – capital sueca de la lluvia. Si vives aquí ya sabes que tu piel lo pasa mal. No tiene por qué ser así. Cosmética natural con CBD que entiende tu entorno – enviada desde tus vecinos en Åsa. Envío gratis desde 50 €.",
      problemTitle: "Lo que Borås le hace a tu piel",
      problemBody: "<p>Borås no es la ciudad más lluviosa de Suecia por broma – es dato. Encajada en el Sjuhärad entre colinas y lagos, atrapa humedad. Las precipitaciones anuales están entre las más altas del país: tu piel vive húmeda fuera pero, en la calefacción, seca en interiores.</p><p>Tanta humedad exterior engaña: no es lo mismo que la hidratación de la barrera. Muchos tienen piel deshidratada sin saberlo – la superficie parece húmeda pero la barrera falla y pierde agua desde dentro.</p><p>La tradición textil sigue viva con la escuela y la moda; muchos piensan en lo que llevan encima más que en la piel de debajo. Lluvia en el trayecto, saltos térmicos y estrés laboral: la piel de Borås pide más cuidado del que a menudo recibe.</p>",
      tipsTitle: "Consejos para quien vive en Borås",
      tips: [
        { title: "Humedad exterior ≠ humedad de barrera", body: "Que llueva no hidrata tu barrera. Necesita sus propios lípidos y capa protectora – aceite a diario, llueva o no." },
        { title: "Seca con suavidad tras la lluvia", body: "El agua de lluvia en la piel evapora y se lleva humedad. Seca con toalla limpia y aceite después – sobre todo en la cara." },
        { title: "Zoo de Borås y Rya åsar", body: "La naturaleza alrededor da aire fresco y menos estrés. Hayedo de Rya y zonas verdes del zoo: paseos posibles incluso con lluvia." },
        { title: "Apuesta por la barrera", body: "En clima húmedo el foco es fortalecer barrera más que añadir litros de crema acuosa. Aceites que retienen y protegen ganan a geles que se evaporan." }
      ],
      solutionTitle: "Cosmética con CBD de tus vecinos en Åsa",
      solutionBody: "<p>Vivimos en Åsa, a un corto trayecto de Borås. Conocemos el clima del Sjuhärad – lluvia, humedad, saltos dentro-fuera. 1753 SKINCARE nació con esa realidad en mente.</p><p>El DUO-kit con The ONE y I LOVE refuerza la barrera que exigen lluvia y humedad. CBD y CBG trabajan con el sistema propio para retener humedad y fortalecer la protección. Au Naturel Makeup Remover limpia con suavidad tras un día húmedo sin debilitar más la barrera. TA-DA Serum con CBG da apoyo extra en los periodos más grises.</p><p>Pide en 1753skin.com – envío gratis desde 50 €; desde Åsa muchas veces al día siguiente en Borås.</p>",
      faq: [
        { q: "¿Envían a Borås?", a: "Estamos en Åsa, al sur de Gotemburgo y cerca de Borås. Muchos pedidos llegan al siguiente día laborable. Envío gratis desde 50 €." },
        { q: "¿Dónde compro cosmética con CBD en Borås?", a: "1753skin.com – lo más rápido, directo desde Åsa sin intermediarios." },
        { q: "¿Necesito más humectación si ya húmedo fuera?", a: "Sí. Humedad ambiental y retención en la barrera son cosas distintas. La piel necesita sus ácidos grasos y su escudo – la lluvia no lo aporta." },
        { q: "¿Qué producto va mejor con clima húmedo?", a: "El DUO-kit da el refuerzo de barrera que pide un clima húmedo. Los aceites retienen la humedad propia sin depender de geles acuosos que se van." }
      ],
      ctaTitle: "La lluvia de Borås pide cosmética de Borås",
      ctaSub: "CBD que refuerza la barrera, desde tus vecinos en Åsa. Envío gratis desde 50 €."
    },
    de: {
      metaTitle: "Hautpflege Borås – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für Borås. Online bestellen, ab 50 € versandkostenfrei. Schutz vor Schwedens Regenhauptstadt-Klima.",
      kicker: "Hautpflege in Borås",
      h1: "Natürliche Hautpflege für Borås",
      lead: "Borås – Schwedens Regenhauptstadt. Wenn du hier wohnst, weißt du: Die Haut hat es schwer. Muss aber nicht so bleiben. Natürliche CBD-Pflege, die deine Bedingungen kennt – von den Nachbarn in Åsa. Ab 50 € versandkostenfrei.",
      problemTitle: "Was Borås mit deiner Haut macht",
      problemBody: "<p>Borås ist nicht nur spaßeshalber die regenreichste Stadt – es ist Fakt. Lage im Sjuhärad zwischen Hügeln und Seen fängt Feuchtigkeit ein. Jahresniederschlag gehört zu den höchsten im Land: Haut lebt draußen feucht, drinnen in der Heizzeit extrem trocken.</p><p>Ständige Außenfeuchtigkeit trügt: Das ist nicht dasselbe wie Barrieren-Hydration. Viele haben dehydrierte Haut ohne es zu merken – Oberfläche wirkt feucht, Barriere ist geschwächt und verliert Wasser von innen.</p><p>Textiltradition mit Hochschule und Modebranche – viele denken mehr über Kleidung auf der Haut als über die Haut darunter. Regenpendeln, Temperaturwechsel, Jobstress: Borås-Haut braucht oft mehr Pflege, als sie bekommt.</p>",
      tipsTitle: "Hautpflege-Tipps für Borås",
      tips: [
        { title: "Außenfeuchte ≠ Barrieren-Feuchte", body: "Regen heißt nicht automatisch hydratisierte Barriere. Sie braucht eigene Fettsäuren und Schutzschicht – täglich Öl, egal wie das Wetter." },
        { title: "Nach Regen sanft abtrocknen", body: "Regenwasser auf der Haut verdunstet und nimmt Feuchtigkeit mit. Mit sauberem Handtuch tupfen, danach Schutzöl – besonders im Gesicht." },
        { title: "Borås Zoo und Rya-Hügel", body: "Natur um Borås: frische Luft, Stressabbau. Buchenwald auf Rya und Grünflächen im Zoo – Spaziergänge auch bei Regen möglich." },
        { title: "In Barrieren investieren", body: "In feuchtem Klima geht es mehr um Barriere stärken als wasserlastige Cremes schichten. Öle, die einbinden und schützen, schlagen verdunstende Wasserprodukte." }
      ],
      solutionTitle: "CBD-Hautpflege von den Nachbarn in Åsa",
      solutionBody: "<p>Wir leben in Åsa, kurze Fahrt von Borås. Wir kennen Sjuhärad-Klima – Regen, Feuchtigkeit, schnelle Drinnen-Draußen-Wechsel. 1753 SKINCARE ist genau dafür gemacht.</p><p>Das DUO-kit mit The ONE und I LOVE stärkt die Barriere, die Regen und Feuchtigkeit fordern. CBD und CBG arbeiten mit dem eigenen System, binden Feuchtigkeit und stärken Schutz von innen. Au Naturel Makeup Remover reinigt mild nach regennassen Tagen ohne Barriere weiter zu schwächen. TA-DA Serum mit CBG gibt Support in den grauesten Phasen.</p><p>Bestell auf 1753skin.com – ab 50 € versandkostenfrei, von Åsa oft schon nächster Tag in Borås.</p>",
      faq: [
        { q: "Liefert ihr nach Borås?", a: "Wir sitzen in Åsa südlich von Göteborg, nah an Borås. Viele Bestellungen nächster Werktag. Ab 50 € versandkostenfrei." },
        { q: "Wo kaufe ich CBD-Hautpflege in Borås?", a: "1753skin.com – am schnellsten, direkt aus Åsa ohne Zwischenhändler." },
        { q: "Brauche ich mehr Feuchtigkeit, wenn es draußen schon feucht ist?", a: "Ja. Außenluftfeuchte und eigene Feuchteretention sind verschiedene Dinge. Die Haut braucht eigene Fettsäuren und Barriere – Regen liefert das nicht." },
        { q: "Welches Produkt für feuchtes Klima?", a: "Das DUO-kit liefert die Barrieren-Stärkung, die feuchtes Klima braucht. Öle binden Hautfeuchtigkeit ohne wasserbasierte Schichten, die verdunsten." }
      ],
      ctaTitle: "Borås-Regen braucht Borås-Pflege",
      ctaSub: "Barrieren-stärkende CBD-Pflege von den Nachbarn in Åsa. Ab 50 € versandkostenfrei."
    },
    fr: {
      metaTitle: "Soin du visage Borås – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Borås. Commande en ligne, livraison offerte dès 50 €. Protège ta peau du climat de la capitale pluvieuse suédoise.",
      kicker: "Soins à Borås",
      h1: "Soins naturels pour Borås",
      lead: "Borås – capitale pluvieuse de la Suède. Si tu vis ici, tu sais déjà que ta peau en bave. Ça n’est pas une fatalité. Des soins naturels au CBD qui comprennent ton terrain – expédiés depuis tes voisins à Åsa. Livraison offerte dès 50 €.",
      problemTitle: "Ce que Borås fait à ta peau",
      problemBody: "<p>Borås n’est pas la ville la plus pluvieuse pour rire – c’est un fait. Nichée dans le Sjuhärad entre collines et lacs, elle retient l’humidité. Les précipitations annuelles comptent parmi les plus hautes du pays : dehors c’est humide, dedans sous chauffage c’est ultra sec.</p><p>L’humidité extérieure trompe : ce n’est pas l’hydratation de la barrière. Beaucoup ont la peau déshydratée sans le savoir – la surface semble humide mais la barrière faiblit et perd de l’eau de l’intérieur.</p><p>La tradition textile vit toujours avec l’école et la mode ; on pense souvent aux vêtements sur la peau plutôt qu’à la peau dessous. Trajets sous la pluie, chocs thermiques, stress pro : la peau à Borås mérite souvent plus d’attention qu’elle n’en reçoit.</p>",
      tipsTitle: "Conseils peau pour Borås",
      tips: [
        { title: "Humidité dehors ≠ humidité de barrière", body: "S’il pleut, ça n’hydrate pas ta barrière. Il lui faut ses propres acides gras et sa couche shield – huile tous les jours, quelle que soit la météo." },
        { title: "Sèche doucement après la pluie", body: "L’eau de pluie sur la peau s’évapore et emporte de l’humidité. Tamponne avec une serviette propre puis huile protectrice – surtout au visage." },
        { title: "Zoo de Borås et Rya åsar", body: "La nature autour apporte air pur et baisse de stress. Hêtraie de Rya et espaces verts du zoo : balades possibles même sous la pluie." },
        { title: "Mise sur le renfort de barrière", body: "Dans un climat humide, on renforce la barrière plutôt qu’on empile des textures très aqueuses. Les huiles retiennent et protègent mieux que les gels qui s’évaporent." }
      ],
      solutionTitle: "Soins au CBD chez tes voisins à Åsa",
      solutionBody: "<p>On habite à Åsa, à courte distance de Borås. On connaît le climat du Sjuhärad – pluie, humidité, va-et-vient intérieur-extérieur. 1753 SKINCARE est pensé pour ça.</p><p>Le DUO-kit avec The ONE et I LOVE renforce la barrière face à la pluie et à l’humidité. CBD et CBG s’alignent sur le système propre pour garder l’humidité et muscler la protection. Au Naturel Makeup Remover nettoie en douceur après un jour humide sans fragiliser plus la barrière. TA-DA Serum au CBG soutient les périodes les plus grises.</p><p>Commande sur 1753skin.com – livraison offerte dès 50 € ; depuis Åsa, souvent le lendemain ouvré à Borås.</p>",
      faq: [
        { q: "Livrez-vous à Borås ?", a: "On est à Åsa au sud de Göteborg, proche de Borås. Beaucoup de commandes le jour ouvré suivant. Livraison offerte dès 50 €." },
        { q: "Où acheter des soins au CBD à Borås ?", a: "1753skin.com – le plus rapide, direct depuis Åsa sans intermédiaire." },
        { q: "J’ai besoin de plus d’hydratation si c’est déjà humide dehors ?", a: "Oui. Humidité ambiante et rétention dans la barrière, ce n’est pas pareil. La peau veut ses acides gras et sa barrière – la pluie ne les fournit pas." },
        { q: "Quel produit pour climat humide ?", a: "Le DUO-kit apporte le renfort de barrière qu’un climat humide exige. Les huiles retiennent l’humidité propre sans s’appuyer sur des couches aqueuses qui s’évaporent." }
      ],
      ctaTitle: "La pluie de Borås mérite des soins à la hauteur",
      ctaSub: "CBD qui renforce la barrière, depuis tes voisins à Åsa. Livraison offerte dès 50 €."
    }
  },
  {
    svSlug: "hudvard-sundsvall",
    enSlug: "skincare-sundsvall",
    esSlug: "cuidado-piel-cbd-sundsvall",
    deSlug: "cbd-hautpflege-sundsvall",
    frSlug: "soin-peau-cbd-sundsvall",
    category: "stad",
    productIds: ["duo-ta-da", "duo-kit", "fungtastic-mushroom-extract"],
    sv: {
      metaTitle: "Hudvård Sundsvall – CBD-baserad hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i Sundsvall. Beställ online med fri frakt över 700 kr. Stärk din hud mot norrlandsvintrar och torr inomhusluft.",
      kicker: "Hudvård i Sundsvall",
      h1: "Naturlig hudvård för dig i Sundsvall",
      lead: "Sundsvall – stenstaden vid havet, mitt i Norrland. Långa vintrar, kort men intensiv sommar och en hud som får kämpa halvåret runt. Du förtjänar produkter som klarar dina förhållanden. Fri frakt över 700 kr.",
      problemTitle: "Sundsvallshudens utmaningar",
      problemBody: "<p>Sundsvall har ett unikt läge vid Bottenhavet, inramat av berget Norra och Södra Stadsberget. Det skapar ett mikroklimat som kan överraska – inversionsskikt vintertid fångar kall luft i dalgången och gör att temperaturen kan sjunka drastiskt. Sundsvall har haft några av Sveriges lägsta uppmätta temperaturer i kustläge.</p><p>Vintrarna är långa och kalla, med temperaturer som regelbundet når minus tjugo och ibland minus trettio. Den torra vinterluften innehåller minimalt med fukt, och huden torkar ut snabbt. Samtidigt ger uppvärmda hem och kontor extremt torr inomhusluft – en dubbel uttorkningseffekt som sliter på hudbarriären.</p><p>Sommaren i Sundsvall är kort men kan vara intensiv, med långa ljusa dagar och överraskande stark sol. Huden som tillbringat sex månader i torr, kall luft utsätts plötsligt för UV-strålning den inte är förberedd på. Övergången är brutal, och många upplever hudproblem precis vid årstidsväxlingarna.</p>",
      tipsTitle: "Hudvårdstips för sundsvallsbor",
      tips: [
        { title: "Förbered huden inför årstidsväxlingar", body: "Sundsvalls dramatiska årstidsväxlingar kräver förberedelse. Börja stärka barriären med rikare produkter redan i september, och trappa ner gradvis i maj." },
        { title: "Vandra på Stadsbergen", body: "Norra och Södra Stadsberget ger dig skog och frisk luft mitt i staden. Regelbundna skogsvandringar sänker stress och stärker immunförsvaret – båda avgörande för hudhälsa." },
        { title: "Luftfukta hemma och på jobbet", body: "Sundsvalls inomhusklimat på vintern kan ha under 15 procent luftfuktighet. En luftfuktare gör dramatisk skillnad för huden – särskilt i sovrummet." },
        { title: "Stöd kroppen inifrån under mörka månader", body: "Sundsvalls vintermörker påverkar D-vitaminproduktion och immunförsvar. Tillskott av D-vitamin och adaptogena svampar stödjer hudens hälsa inifrån." },
        { title: "Skydda ansiktet vid havet", body: "Bottenhavetsvinden längs Sundsvalls kust är kall och rå. En skyddande olja som barriär innan utevistelse vid havet låser in fukten och stänger ute kylan." }
      ],
      solutionTitle: "CBD-hudvård levererad till Sundsvall",
      solutionBody: "<p>1753 SKINCARE levererar naturlig CBD-hudvård som klarar Sundsvalls tuffa förhållanden. Från Åsa utanför Göteborg till din dörr – fri frakt på beställningar över 700 kr.</p><p>Vår starkaste rekommendation för Sundsvall är DUO-kit + TA-DA Serum-kombination. Du får tre produkter som tillsammans ger maximal barriärstärkning för norrlandsvintrar: The ONE och I LOVE som daglig bas, och TA-DA Serum med CBG för intensivvård under köldknäppar. Fungtastic Mushroom Extract stärker immunförsvaret under de mörka månaderna.</p><p>Beställ på 1753skin.com – de flesta leveranser når Sundsvall inom 2 arbetsdagar.</p>",
      faq: [
        { q: "Levererar ni till Sundsvall?", a: "Ja, vi levererar till hela Sverige. De flesta beställningar från Åsa når Sundsvall inom 2 arbetsdagar. Fri frakt på beställningar över 700 kr." },
        { q: "Var kan jag köpa CBD-hudvård i Sundsvall?", a: "Beställ direkt på 1753skin.com – vi levererar till din dörr i Sundsvall utan mellanhänder." },
        { q: "Behöver jag olika produkter för sommar och vinter?", a: "Våra produkter fungerar året runt, men justera mängden. Vintertid i Sundsvall: generöst med olja, gärna dubbla lager. Sommartid: tunnare applicering räcker." },
        { q: "Klarar era produkter att fraktas i kyla?", a: "Ja, våra oljor tål kyla utan att förlora kvalitet. Om paketet är kallt när det anländer, låt det nå rumstemperatur innan användning." }
      ],
      ctaTitle: "Norrlandshud kräver norrlandsstark hudvård",
      ctaSub: "CBD-hudvård som stärker din barriär mot Sundsvalls klimat. Fri frakt över 700 kr."
    },
    en: {
      metaTitle: "Skincare Sundsvall – CBD-based skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Sundsvall. Order online with free shipping over €60. Strengthen your skin against Norrland winters.",
      kicker: "Skincare in Sundsvall",
      h1: "Natural skincare for Sundsvall",
      lead: "Sundsvall – the stone city by the sea, in the heart of Norrland. Long winters, a short but intense summer, and skin that struggles half the year. You deserve products that handle your conditions. Free shipping over €60.",
      problemTitle: "What Sundsvall does to your skin",
      problemBody: "<p>Sundsvall has a unique location by the Bothnian Sea, framed by the North and South City Mountains. This creates a microclimate that can surprise – temperature inversions in winter trap cold air in the valley and temperatures can drop dramatically. Sundsvall has recorded some of Sweden's lowest temperatures for a coastal location.</p><p>Winters are long and cold, with temperatures regularly reaching minus twenty and sometimes minus thirty. The dry winter air holds minimal moisture, and the skin dries out quickly. Meanwhile, heated homes and offices create extremely dry indoor air – a double dehydration effect that wears on the skin barrier.</p><p>Summer in Sundsvall is short but can be intense, with long bright days and surprisingly strong sun. Skin that has spent six months in dry, cold air is suddenly exposed to UV radiation it's not prepared for. The transition is brutal, and many experience skin problems right at the seasonal shifts.</p>",
      tipsTitle: "Skincare tips for Sundsvall residents",
      tips: [
        { title: "Prepare skin for seasonal shifts", body: "Sundsvall's dramatic seasonal changes require preparation. Start strengthening the barrier with richer products in September already, and gradually taper in May." },
        { title: "Hike the City Mountains", body: "The North and South City Mountains give you forest and fresh air right in the city. Regular forest hikes lower stress and strengthen immunity – both crucial for skin health." },
        { title: "Humidify at home and work", body: "Sundsvall's indoor climate in winter can drop below 15 percent humidity. A humidifier makes a dramatic difference for the skin – especially in the bedroom." },
        { title: "Support the body from within during dark months", body: "Sundsvall's winter darkness affects vitamin D production and immunity. Supplements of vitamin D and adaptogenic mushrooms support skin health from within." },
        { title: "Protect your face by the sea", body: "The Bothnian Sea wind along Sundsvall's coast is cold and raw. A protective oil as a barrier before heading to the coast locks in moisture and shuts out the cold." }
      ],
      solutionTitle: "CBD skincare delivered to Sundsvall",
      solutionBody: "<p>1753 SKINCARE delivers natural CBD skincare that handles Sundsvall's tough conditions. From Åsa outside Gothenburg to your door – free shipping on orders over €60.</p><p>Our strongest recommendation for Sundsvall is the DUO-kit + TA-DA Serum combination. You get three products that together provide maximum barrier strengthening for Norrland winters: The ONE and I LOVE as your daily base, and TA-DA Serum with CBG for intensive care during cold snaps. Fungtastic Mushroom Extract strengthens immunity during the dark months.</p><p>Order at 1753skin.com – most deliveries reach Sundsvall within 2 business days.</p>",
      faq: [
        { q: "Do you ship to Sundsvall?", a: "Yes, we deliver throughout Sweden. Most orders from Åsa reach Sundsvall within 2 business days. Free shipping on orders over €60." },
        { q: "Where can I buy CBD skincare in Sundsvall?", a: "Order directly at 1753skin.com – we deliver to your door in Sundsvall without middlemen." },
        { q: "Do I need different products for summer and winter?", a: "Our products work year-round, but adjust the amount. Winter in Sundsvall: generous with oil, double layers if needed. Summer: a thinner application is sufficient." },
        { q: "Can your products handle cold shipping?", a: "Yes, our oils withstand cold without losing quality. If the package is cold on arrival, let it reach room temperature before use." }
      ],
      ctaTitle: "Norrland skin demands Norrland-strength skincare",
      ctaSub: "CBD skincare that strengthens your barrier against Sundsvall's climate. Free shipping over €60."
    },
    es: {
      metaTitle: "Cuidado de la piel Sundsvall – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Sundsvall. Pide online, envío gratis desde 50 €. Refuerza tu piel frente a los inviernos del Norrland y al aire seco interior.",
      kicker: "Cuidado de la piel en Sundsvall",
      h1: "Cosmética natural para Sundsvall",
      lead: "Sundsvall – la ciudad de piedra junto al mar, en el corazón del Norrland. Inviernos largos, verano corto pero intenso, y una piel que pelea medio año. Mereces productos que aguanten tu clima. Envío gratis desde 50 €.",
      problemTitle: "Lo que Sundsvall le hace a tu piel",
      problemBody: "<p>Sundsvall tiene una ubicación única junto al mar de Botnia, entre las montañas norte y sur de la ciudad. Eso crea microclimas sorprendentes: inversiones térmicas en invierno atrapan aire frío en el valle y las temperaturas pueden hundirse. Sundsvall ha registrado algunas de las mínimas más bajas para una ciudad costera sueca.</p><p>Inviernos largos y fríos, a menudo veinte o treinta bajo cero. El aire invernal casi no lleva humedad y la piel se seca rápido. Los hogares y oficinas calefactados añaden un aire interior extremadamente seco – doble deshidratación para la barrera.</p><p>El verano es breve pero puede ser intenso: días largos y sol sorprendentemente fuerte. Tras meses de aire frío y seco, la piel recibe de golpe un UV para el que no está lista. Los cambios de estación son brutales y ahí suelen aparecer los problemas de piel.</p>",
      tipsTitle: "Consejos para quien vive en Sundsvall",
      tips: [
        { title: "Prepárate a los cambios de estación", body: "Los saltos dramáticos piden plan. Refuerza la barrera con texturas más ricas desde septiembre y baja poco a poco en mayo." },
        { title: "Sube a las montañas de la ciudad", body: "Norte y sur dan bosque y aire limpio en plena urbe. Caminatas regulares: menos estrés e inmunidad más fuerte – clave para la piel." },
        { title: "Humidifica casa y trabajo", body: "En invierno la humedad interior puede caer del 15 %. Un humidificador cambia mucho – sobre todo en el dormitorio." },
        { title: "Apoyo por dentro en la oscuridad", body: "La oscuridad invernal afecta vitamina D e inmunidad. Suplementos de D y adaptógenos ayudan a la piel desde dentro." },
        { title: "Protege el rostro junto al mar", body: "El viento del mar de Botnia es frío y crudo. Aceite barrera antes de salir a la costa." }
      ],
      solutionTitle: "Cosmética con CBD con entrega en Sundsvall",
      solutionBody: "<p>1753 SKINCARE lleva cosmética natural con CBD que aguanta las condiciones duras de Sundsvall. De Åsa cerca de Gotemburgo a tu puerta – envío gratis desde 50 €.</p><p>Nuestra recomendación más fuerte aquí: DUO-kit + TA-DA Serum. Tres productos con refuerzo máximo de barrera para inviernos del norte: The ONE e I LOVE como base diaria, TA-DA Serum con CBG para cuidado intensivo en olas de frío. Fungtastic Mushroom Extract apoya la inmunidad en los meses oscuros.</p><p>Pide en 1753skin.com – la mayoría de envíos a Sundsvall en 2 días laborables.</p>",
      faq: [
        { q: "¿Envían a Sundsvall?", a: "Sí, a toda Suecia. Desde Åsa suele llegar en 2 días laborables. Envío gratis desde 50 €." },
        { q: "¿Dónde compro cosmética con CBD en Sundsvall?", a: "1753skin.com – a tu puerta sin intermediarios." },
        { q: "¿Necesito productos distintos en verano e invierno?", a: "Los mismos productos sirven todo el año; ajusta la cantidad. Invierno en Sundsvall: más generoso con el aceite, capas dobles si hace falta. Verano: aplicación más ligera." },
        { q: "¿Aguantan el frío en el transporte?", a: "Sí, los aceites resisten el frío sin perder calidad. Si el paquete llega helado, déjalo a temperatura ambiente antes de usar." }
      ],
      ctaTitle: "La piel del Norrland pide cuidado a la altura",
      ctaSub: "Cosmética con CBD que refuerza tu barrera frente al clima de Sundsvall. Envío gratis desde 50 €."
    },
    de: {
      metaTitle: "Hautpflege Sundsvall – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für Sundsvall. Online bestellen, ab 50 € versandkostenfrei. Stärkt die Haut gegen Norrland-Winter.",
      kicker: "Hautpflege in Sundsvall",
      h1: "Natürliche Hautpflege für Sundsvall",
      lead: "Sundsvall – Steinstadt am Meer, im Herzen Norrlands. Lange Winter, kurzer aber intensiver Sommer, und Haut, die halbes Jahr kämpft. Du verdienst Produkte, die deine Bedingungen packen. Ab 50 € versandkostenfrei.",
      problemTitle: "Was Sundsvall mit deiner Haut macht",
      problemBody: "<p>Sundsvall hat eine einzigartige Lage am Bottnischen Meer, eingerahmt von Nord- und Südstadtbergen. Das schafft überraschende Mikroklimata: Winter-Inversionen fangen kalte Luft im Tal, Temperaturen können stark fallen. Sundsvall hat einige der niedrigsten je gemessenen Werte für eine schwedische Küstenstadt.</p><p>Winter sind lang und kalt, oft minus zwanzig bis minus dreißig. Trockene Winterluft hält kaum Feuchtigkeit, Haut trocknet schnell. Beheizte Häuser und Büros liefern extrem trockene Innenluft – doppelte Dehydration für die Barriere.</p><p>Der Sommer ist kurz, kann aber intensiv sein: lange helle Tage und überraschend starke Sonne. Nach Monaten in kalter, trockener Luft trifft UV die unvorbereitete Haut. Der Jahreszeitenwechsel ist brutal – oft dort Hautprobleme.</p>",
      tipsTitle: "Hautpflege-Tipps für Sundsvall",
      tips: [
        { title: "Auf Jahreszeitenwechsel vorbereiten", body: "Dramatische Wechsel brauchen Plan. Barriere ab September mit reicheren Produkten stärken, im Mai schrittweise reduzieren." },
        { title: "Stadtberge wandern", body: "Nord- und Südblock geben Wald und frische Luft mitten in der Stadt. Regelmäßige Gänge senken Stress und stärken Immunität – entscheidend für Hautgesundheit." },
        { title: "Zuhause und bei der Arbeit befeuchten", body: "Sundsvalls Innenklima kann im Winter unter 15 % Feuchtigkeit fallen. Luftbefeuchter – besonders im Schlafzimmer – macht einen großen Unterschied." },
        { title: "Körper in dunklen Monaten unterstützen", body: "Winterdunkelheit beeinflusst Vitamin D und Immunität. D-Supplemente und Adaptogene unterstützen Hautgesundheit von innen." },
        { title: "Gesicht am Meer schützen", body: "Bottnische See-Wind ist kalt und rau. Schutzöl als Barriere vor Küstengängen." }
      ],
      solutionTitle: "CBD-Hautpflege nach Sundsvall",
      solutionBody: "<p>1753 SKINCARE liefert natürliche CBD-Pflege, die Sundsvalls harte Bedingungen packt. Von Åsa bei Göteborg bis vor die Tür – ab 50 € versandkostenfrei.</p><p>Unsere stärkste Empfehlung: DUO-kit + TA-DA Serum. Drei Produkte für maximale Barrieren-Stärkung in Norrland-Wintern: The ONE und I LOVE als tägliche Basis, TA-DA Serum mit CBG für Intensivpflege in Kälteeinbrüchen. Fungtastic Mushroom Extract stärkt die Immunität in dunklen Monaten.</p><p>Bestell auf 1753skin.com – meist 2 Werktage bis Sundsvall.</p>",
      faq: [
        { q: "Liefert ihr nach Sundsvall?", a: "Ja, in ganz Schweden. Von Åsa meist 2 Werktage. Ab 50 € versandkostenfrei." },
        { q: "Wo kaufe ich CBD-Hautpflege in Sundsvall?", a: "1753skin.com – ohne Zwischenhändler bis vor die Tür." },
        { q: "Brauche ich andere Produkte Sommer und Winter?", a: "Gleiche Produkte ganzjährig, Menge anpassen. Winter Sundsvall: großzügig mit Öl, Doppelschichten wenn nötig. Sommer: dünnere Schicht reicht." },
        { q: "Halten eure Produkte kaltem Versand stand?", a: "Ja, Öle verlieren bei Kälte keine Qualität. Paket kalt angekommen – auf Raumtemperatur kommen lassen vor Gebrauch." }
      ],
      ctaTitle: "Norrland-Haut braucht Norrland-starke Pflege",
      ctaSub: "CBD-Pflege gegen Sundsvalls Klima. Ab 50 € versandkostenfrei."
    },
    fr: {
      metaTitle: "Soin du visage Sundsvall – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Sundsvall. Commande en ligne, livraison offerte dès 50 €. Renforce ta peau face aux hivers du Norrland et à l’air sec intérieur.",
      kicker: "Soins à Sundsvall",
      h1: "Soins naturels pour Sundsvall",
      lead: "Sundsvall – la ville de pierre au bord de la mer, au cœur du Norrland. Hivers longs, été court mais intense, et une peau qui se bat six mois sur douze. Tu mérites des produits à la hauteur de ton climat. Livraison offerte dès 50 €.",
      problemTitle: "Ce que Sundsvall fait à ta peau",
      problemBody: "<p>Sundsvall a une position unique sur la mer de Botnie, encadrée par les monts nord et sud de la ville. Ça crée des microclimats surprenants : les inversions hivernales piègent l’air froid dans la vallée et les températures peuvent plonger. Sundsvall détient certaines des températures les plus basses relevées pour une ville côtière suédoise.</p><p>Hivers longs et froids, souvent moins vingt à moins trente. L’air hivernal retient peu d’humidité et la peau s’assèche vite. Maisons et bureaux chauffés ajoutent un air intérieur extrêmement sec – double déshydratation pour la barrière.</p><p>L’été est court mais peut être intense : longues journées claires et soleil étonnamment fort. Après des mois d’air froid et sec, la peau subit un UV pour lequel elle n’est pas prête. Les changements de saison sont brutaux – souvent là que les problèmes de peau éclatent.</p>",
      tipsTitle: "Conseils peau pour Sundsvall",
      tips: [
        { title: "Prépare les changements de saison", body: "Les bascules dramatiques demandent un plan. Renforce la barrière avec des textures plus riches dès septembre, puis descends progressivement en mai." },
        { title: "Randonne sur les monts de la ville", body: "Nord et sud offrent forêt et air pur en pleine ville. Marches régulières : moins de stress, immunité plus solide – crucial pour la peau." },
        { title: "Humidifie maison et boulot", body: "L’air intérieur hivernal peut tomber sous 15 % d’humidité. Un humidificateur change tout – surtout dans la chambre." },
        { title: "Soutiens le corps dans le noir", body: "Le noir hivernal touche vitamine D et immunité. Compléments en D et adaptogènes aident la peau de l’intérieur." },
        { title: "Protège le visage au bord de l’eau", body: "Le vent de la mer de Botnie est froid et cru. Huile barrière avant les sorties sur le littoral." }
      ],
      solutionTitle: "Soins au CBD livrés à Sundsvall",
      solutionBody: "<p>1753 SKINCARE livre des soins naturels au CBD qui tiennent les conditions rudes de Sundsvall. D’Åsa près de Göteborg jusqu’à chez toi – livraison offerte dès 50 €.</p><p>Notre reco la plus costaud : DUO-kit + TA-DA Serum. Trois produits pour un renfort barrière maximal face aux hivers du nord : The ONE et I LOVE en base quotidienne, TA-DA Serum au CBG pour soins intensifs pendant les vagues de froid. Fungtastic Mushroom Extract soutient l’immunité pendant les mois sombres.</p><p>Commande sur 1753skin.com – en général 2 jours ouvrés jusqu’à Sundsvall.</p>",
      faq: [
        { q: "Livrez-vous à Sundsvall ?", a: "Oui, dans toute la Suède. Depuis Åsa, en général 2 jours ouvrés. Livraison offerte dès 50 €." },
        { q: "Où acheter des soins au CBD à Sundsvall ?", a: "1753skin.com – à ton domicile sans intermédiaire." },
        { q: "Faut-il des produits différents été et hiver ?", a: "Les mêmes produits toute l’année ; ajuste les doses. Hiver à Sundsvall : huile généreuse, doubles couches si besoin. Été : couche plus fine suffit." },
        { q: "Vos produits tiennent-ils le transport par le froid ?", a: "Oui, les huiles résistent au froid sans perdre en qualité. Colis froid à l’arrivée : laisse atteindre température ambiante avant usage." }
      ],
      ctaTitle: "La peau du Norrland veut des soins à sa mesure",
      ctaSub: "Soins au CBD qui renforcent ta barrière face au climat de Sundsvall. Livraison offerte dès 50 €."
    }
  },
  {
    svSlug: "hudvard-gavle",
    enSlug: "skincare-gavle",
    esSlug: "cuidado-piel-cbd-gavle",
    deSlug: "cbd-hautpflege-gavle",
    frSlug: "soin-peau-cbd-gavle",
    category: "stad",
    productIds: ["duo-kit", "ta-da-serum", "fungtastic-mushroom-extract"],
    sv: {
      metaTitle: "Hudvård Gävle – CBD-baserad hudvård | 1753 SKINCARE",
      metaDescription: "Naturlig CBD-hudvård för dig i Gävle. Beställ online med fri frakt över 700 kr. Stärk din hud mot Norrlandsporten klimat.",
      kicker: "Hudvård i Gävle",
      h1: "Naturlig hudvård för dig i Gävle",
      lead: "Gävle – porten till Norrland, där Mellansverige möter den riktiga vintern. Gavleåns fukt, Bottenhavets vind och vintrar som testar din hud på riktigt. Ge den det stöd den förtjänar. Fri frakt över 700 kr.",
      problemTitle: "Gävlehudens utmaningar",
      problemBody: "<p>Gävle ligger vid gränsen mellan Mellansverige och Norrland, och klimatet reflekterar den positionen – kallt nog att vara utmanande, men inte så extremt att alla automatiskt anpassar sig. Vintrarna är långa med temperaturer som regelbundet når minus femton till minus tjugo, och Gavleån som rinner genom staden tillför rå fukt som gör kylan genomträngande.</p><p>Bottenhavets närhet ger Gävle en vind som bär salt och fukt. Längs kusten, vid Bönan och Engeltofta, kan havsvinden vara kraftig och uttorkande. Men mitt i stan, skyddad av bebyggelsen, märker man det knappt – tills man undrar varför huden är så torr trots att man knappt varit utomhus.</p><p>Gävle har en blandning av gammal industritradition och modern tjänstesektor. Många pendlar, antingen lokalt eller ner mot Stockholm, och den dagliga rutten genom olika klimatzoner – hem, bil, tåg, kontor – ger huden en karusell av temperatur och luftfuktighet som den aldrig riktigt vänjer sig vid. Kaffekulturen är stark i Gävle (Gevalia, som bekant), men koffein avvattnar – och det syns i huden.</p>",
      tipsTitle: "Hudvårdstips för gävlebor",
      tips: [
        { title: "Balansera kaffet med vatten", body: "Gävle är en kaffestad, men koffein avvattnar kroppen och huden. Matcha varje kopp kaffe med ett glas vatten – din hud kommer att tacka dig." },
        { title: "Promenera längs Gavleån", body: "Gavleåns grönstråk ger dig daglig tillgång till frisk luft och naturupplevelse. Regelbundna promenader sänker stress och ger huden en paus från inomhusluft." },
        { title: "Anpassa rutinen för norrlandsporten", body: "Gävles klimat är kallare än många tror. Byt till vinterhudvård redan i oktober och håll kvar den till april – underskatta inte Norrlandsportens klimat." },
        { title: "Stöd immunförsvaret under mörka månader", body: "Gävles vinterhalvår ger begränsad solexponering. D-vitamin och adaptogena tillskott stödjer immunförsvar och hudhälsa under de mörkaste månaderna." }
      ],
      solutionTitle: "CBD-hudvård levererad till Gävle",
      solutionBody: "<p>1753 SKINCARE levererar naturlig CBD-hudvård direkt till din dörr i Gävle. Fri frakt på beställningar över 700 kr – vi skickar från Åsa utanför Göteborg.</p><p>DUO-kit med The ONE och I LOVE ger din hud den bas den behöver för att klara Gävles klimat. CBD och CBG stärker barriären och balanserar fukt och inflammation. TA-DA Serum med koncentrerad CBG fungerar som booster under de kallaste månaderna. Fungtastic Mushroom Extract stödjer immunförsvaret under vinterns mörka perioder – för Gävlebor som vill ta hand om huden inifrån och ut.</p><p>Beställ på 1753skin.com – de flesta leveranser når Gävle inom 1–2 arbetsdagar.</p>",
      faq: [
        { q: "Levererar ni till Gävle?", a: "Ja, vi skickar från Åsa utanför Göteborg och de flesta beställningar når Gävle inom 1–2 arbetsdagar. Fri frakt över 700 kr." },
        { q: "Var kan jag köpa CBD-hudvård i Gävle?", a: "Beställ direkt på 1753skin.com – vi levererar till din dörr i Gävle. Ingen butik behövs." },
        { q: "Hjälper CBD mot vintertorr hud?", a: "Ja, CBD stärker hudbarriären och hjälper huden att behålla sin fukt trots kall, torr luft. Våra oljor ger dessutom ett skyddande lager som minskar fuktförlusten." },
        { q: "Kan jag beställa som present?", a: "Absolut. Alla beställningar skickas i diskret, snygg förpackning som fungerar utmärkt som present. Perfekt julklapp för en gävlebo med torr vinterhud." }
      ],
      ctaTitle: "Norrlandsportens hud förtjänar riktig hudvård",
      ctaSub: "CBD-hudvård som stärker din barriär mot Gävles klimat. Fri frakt över 700 kr."
    },
    en: {
      metaTitle: "Skincare Gävle – CBD-based skincare | 1753 SKINCARE",
      metaDescription: "Natural CBD skincare for Gävle. Order online with free shipping over €60. Strengthen your skin against the gateway to Norrland.",
      kicker: "Skincare in Gävle",
      h1: "Natural skincare for Gävle",
      lead: "Gävle – the gateway to Norrland, where central Sweden meets the real winter. The Gavleån moisture, Bothnian Sea winds, and winters that truly test your skin. Give it the support it deserves. Free shipping over €60.",
      problemTitle: "What Gävle does to your skin",
      problemBody: "<p>Gävle sits at the border between central Sweden and Norrland, and the climate reflects that position – cold enough to be challenging, but not so extreme that everyone automatically adapts. Winters are long with temperatures regularly reaching minus fifteen to minus twenty, and the Gavleån river running through the city adds raw moisture that makes the cold penetrating.</p><p>The proximity to the Bothnian Sea gives Gävle a wind that carries salt and moisture. Along the coast, at Bönan and Engeltofta, the sea wind can be strong and drying. But in the city center, sheltered by buildings, you barely notice it – until you wonder why your skin is so dry despite barely being outdoors.</p><p>Gävle has a mix of old industrial tradition and modern service sector. Many commute, either locally or south toward Stockholm, and the daily route through different climate zones – home, car, train, office – gives the skin a carousel of temperature and humidity it never quite gets used to. Coffee culture is strong in Gävle (Gevalia, of course), but caffeine dehydrates – and it shows in the skin.</p>",
      tipsTitle: "Skincare tips for Gävle residents",
      tips: [
        { title: "Balance coffee with water", body: "Gävle is a coffee city, but caffeine dehydrates the body and skin. Match every cup of coffee with a glass of water – your skin will thank you." },
        { title: "Walk along the Gavleån", body: "The Gavleån green corridor gives you daily access to fresh air and nature. Regular walks lower stress and give your skin a break from indoor air." },
        { title: "Adapt your routine for the Norrland gateway", body: "Gävle's climate is colder than many think. Switch to winter skincare in October already and keep it through April – don't underestimate the gateway to Norrland." },
        { title: "Support immunity during dark months", body: "Gävle's winter half gives limited sun exposure. Vitamin D and adaptogenic supplements support immunity and skin health during the darkest months." }
      ],
      solutionTitle: "CBD skincare delivered to Gävle",
      solutionBody: "<p>1753 SKINCARE delivers natural CBD skincare directly to your door in Gävle. Free shipping on orders over €60 – we ship from Åsa outside Gothenburg.</p><p>The DUO-kit with The ONE and I LOVE gives your skin the foundation it needs to handle Gävle's climate. CBD and CBG strengthen the barrier and balance moisture and inflammation. TA-DA Serum with concentrated CBG works as a booster during the coldest months. Fungtastic Mushroom Extract supports immunity during winter's dark periods – for Gävle residents who want to care for their skin from the inside out.</p><p>Order at 1753skin.com – most deliveries reach Gävle within 1–2 business days.</p>",
      faq: [
        { q: "Do you ship to Gävle?", a: "Yes, we ship from Åsa outside Gothenburg and most orders reach Gävle within 1–2 business days. Free shipping over €60." },
        { q: "Where can I buy CBD skincare in Gävle?", a: "Order directly at 1753skin.com – we deliver to your door in Gävle. No store needed." },
        { q: "Does CBD help with winter-dry skin?", a: "Yes, CBD strengthens the skin barrier and helps the skin retain moisture despite cold, dry air. Our oils also provide a protective layer that reduces moisture loss." },
        { q: "Can I order as a gift?", a: "Absolutely. All orders ship in discreet, attractive packaging that works perfectly as a gift. Perfect Christmas present for a Gävle resident with dry winter skin." }
      ],
      ctaTitle: "Gateway to Norrland skin deserves real skincare",
      ctaSub: "CBD skincare that strengthens your barrier against Gävle's climate. Free shipping over €60."
    },
    es: {
      metaTitle: "Cuidado de la piel Gävle – cosmética con CBD | 1753 SKINCARE",
      metaDescription: "Cosmética natural con CBD para Gävle. Pide online, envío gratis desde 50 €. Refuerza tu piel frente al clima de la puerta al Norrland.",
      kicker: "Cuidado de la piel en Gävle",
      h1: "Cosmética natural para Gävle",
      lead: "Gävle – puerta al Norrland, donde el centro de Suecia se encuentra con el invierno de verdad. Humedad del río Gavleån, vientos del mar de Botnia e inviernos que ponen a prueba la piel. Dale el apoyo que merece. Envío gratis desde 50 €.",
      problemTitle: "Lo que Gävle le hace a tu piel",
      problemBody: "<p>Gävle está en la frontera entre Suecia central y el Norrland: lo bastante frío para castigar, no tan extremo como para que todos se adapten sin pensar. Inviernos largos con quince o veinte bajo cero; el Gavleån añade humedad cruda que hace morder el frío.</p><p>Cerca del mar de Botnia, el viento trae sal y humedad. En la costa, en Bönan o Engeltofta, puede ser fuerte y secante. En el centro, protegido por los edificios, casi no lo notas – hasta que la piel está seca sin haber estado mucho fuera.</p><p>Mezcla de industria histórica y servicios modernos. Muchos van en coche o tren a Estocolmo; cada día saltas entre hogar, coche, tren, oficina – carrusel de temperatura y humedad. La cultura del café es fuerte (Gevalia, claro), pero la cafeína deshidrata – y se nota en la piel.</p>",
      tipsTitle: "Consejos para quien vive en Gävle",
      tips: [
        { title: "Equilibra el café con agua", body: "Gävle es ciudad de café; la cafeína deshidrata cuerpo y piel. Un vaso de agua por cada taza – tu piel lo agradecerá." },
        { title: "Camina por el Gavleån", body: "El corredor verde del río da aire fresco y naturaleza a diario. Paseos regulares bajan el estrés y dan un respiro al cutis." },
        { title: "Adapta la rutina a la puerta al norte", body: "El clima es más frío de lo que muchos creen. Cambia a rutina de invierno en octubre y mantén hasta abril – no subestimes la puerta al Norrland." },
        { title: "Apoyo inmunológico en la oscuridad", body: "El semestre oscuro deja poco sol. Vitamina D y adaptógenos ayudan a inmunidad y piel en los meses más negros." }
      ],
      solutionTitle: "Cosmética con CBD con entrega en Gävle",
      solutionBody: "<p>1753 SKINCARE lleva cosmética natural con CBD a tu puerta en Gävle. Envío gratis desde 50 € – enviamos desde Åsa cerca de Gotemburgo.</p><p>El DUO-kit con The ONE y I LOVE da la base para aguantar el clima de Gävle. CBD y CBG refuerzan la barrera y equilibran humedad e inflamación. TA-DA Serum con CBG actúa como refuerzo en los meses más fríos. Fungtastic Mushroom Extract apoya la inmunidad en la oscuridad invernal – para quien quiere cuidar la piel por dentro y por fuera.</p><p>Pide en 1753skin.com – la mayoría de envíos en 1–2 días laborables.</p>",
      faq: [
        { q: "¿Envían a Gävle?", a: "Sí, desde Åsa cerca de Gotemburgo. Suele llegar en 1–2 días laborables. Envío gratis desde 50 €." },
        { q: "¿Dónde compro cosmética con CBD en Gävle?", a: "1753skin.com – a tu puerta en Gävle. Sin necesidad de tienda física." },
        { q: "¿La cosmética con CBD ayuda con la piel seca de invierno?", a: "Sí, el CBD refuerza la barrera y ayuda a retener humedad con aire frío y seco. Los aceites además forman una capa que reduce la pérdida de agua." },
        { q: "¿Puedo pedir como regalo?", a: "Sí. Todo llega en embalaje discreto y cuidado, perfecto para regalo. Ideal para alguien en Gävle con piel seca de invierno." }
      ],
      ctaTitle: "La piel en la puerta del norte merece cuidado de verdad",
      ctaSub: "Cosmética con CBD que refuerza tu barrera frente al clima de Gävle. Envío gratis desde 50 €."
    },
    de: {
      metaTitle: "Hautpflege Gävle – CBD-Pflege | 1753 SKINCARE",
      metaDescription: "Natürliche CBD-Hautpflege für Gävle. Online bestellen, ab 50 € versandkostenfrei. Stärkt die Haut am Tor nach Norrland.",
      kicker: "Hautpflege in Gävle",
      h1: "Natürliche Hautpflege für Gävle",
      lead: "Gävle – Tor nach Norrland, wo Mittelschweden auf echten Winter trifft. Gavleån-Feuchte, Bottnische-See-Winde und Winter, die die Haut testen. Gib ihr die Unterstützung, die sie verdient. Ab 50 € versandkostenfrei.",
      problemTitle: "Was Gävle mit deiner Haut macht",
      problemBody: "<p>Gävle liegt an der Grenze zwischen Mittelschweden und Norrland – kalt genug zum Fordern, nicht so extrem, dass alle automatisch umdenken. Lange Winter mit regelmäßig minus fünfzehn bis minus zwanzig; der Gavleån bringt rohe Feuchte, die Kälte durchdringender macht.</p><p>Nähe zur Bottnischen See: Wind trägt Salz und Feuchte. An der Küste bei Bönan und Engeltofta kann er stark und austrocknend sein. In der geschützten Innenstadt merkst du kaum etwas – bis die Haut trocken ist, obwohl du kaum draußen warst.</p><p>Mix aus alter Industrie und modernem Dienstleistungssektor. Viele pendeln lokal oder nach Stockholm – täglich Karussell zwischen Zuhause, Auto, Zug, Büro: Temperatur und Luftfeuchtigkeit wechseln ständig. Kaffeekultur ist stark (Gevalia natürlich), aber Koffein dehydratisiert – sichtbar an der Haut.</p>",
      tipsTitle: "Hautpflege-Tipps für Gävle",
      tips: [
        { title: "Kaffee mit Wasser balancieren", body: "Gävle ist Kaffeestadt, aber Koffein entwässert Körper und Haut. Zu jeder Tasse ein Glas Wasser – die Haut dankt es." },
        { title: "Entlang Gavleån spazieren", body: "Grünachse am Fluss: täglich frische Luft und Natur. Regelmäßige Spaziergänge senken Stress und geben der Haut Pause von Innenluft." },
        { title: "Routine ans Norrland-Tor anpassen", body: "Gävles Klima ist kälter als viele denken. Winterpflege ab Oktober bis April – Tor nach Norrland nicht unterschätzen." },
        { title: "Immunität in dunklen Monaten stützen", body: "Dunkle Jahreshälfte bringt wenig Sonne. Vitamin D und Adaptogene unterstützen Immunität und Haut in den schwärzesten Monaten." }
      ],
      solutionTitle: "CBD-Hautpflege nach Gävle",
      solutionBody: "<p>1753 SKINCARE liefert natürliche CBD-Pflege direkt nach Gävle. Ab 50 € versandkostenfrei – Versand aus Åsa bei Göteborg.</p><p>Das DUO-kit mit The ONE und I LOVE gibt die Basis für Gävles Klima. CBD und CBG stärken die Barriere und balancieren Feuchtigkeit und Entzündung. TA-DA Serum mit CBG ist Booster in den kältesten Monaten. Fungtastic Mushroom Extract unterstützt die Immunität in dunkler Winterzeit – für Gävle-Bewohner, die Haut innen und außen pflegen wollen.</p><p>Bestell auf 1753skin.com – meist 1–2 Werktage bis Gävle.</p>",
      faq: [
        { q: "Liefert ihr nach Gävle?", a: "Ja, aus Åsa bei Göteborg. Meist 1–2 Werktage. Ab 50 € versandkostenfrei." },
        { q: "Wo kaufe ich CBD-Hautpflege in Gävle?", a: "1753skin.com – bis vor die Tür. Kein Laden nötig." },
        { q: "Hilft CBD bei wintertrockener Haut?", a: "Ja, CBD stärkt die Barriere und hilft, Feuchtigkeit trotz kalter, trockener Luft zu halten. Unsere Öle bilden eine Schutzschicht gegen Feuchtigkeitsverlust." },
        { q: "Kann ich als Geschenk bestellen?", a: "Ja. Alles kommt in dezenter, ansprechender Verpackung – perfekt zum Verschenken. Ideal für Gävle-Bewohner mit trockener Winterhaut." }
      ],
      ctaTitle: "Haut am Tor nach Norrland verdient echte Pflege",
      ctaSub: "CBD-Pflege gegen Gävles Klima. Ab 50 € versandkostenfrei."
    },
    fr: {
      metaTitle: "Soin du visage Gävle – soins au CBD | 1753 SKINCARE",
      metaDescription: "Soins naturels au CBD pour Gävle. Commande en ligne, livraison offerte dès 50 €. Renforce ta peau à la porte du Norrland.",
      kicker: "Soins à Gävle",
      h1: "Soins naturels pour Gävle",
      lead: "Gävle – porte d’entrée du Norrland, là où le centre de la Suède croise l’hiver pour de vrai. Humidité du Gavleån, vents de la mer de Botnie et hivers qui testent la peau. Offre-lui le soutien qu’elle mérite. Livraison offerte dès 50 €.",
      problemTitle: "Ce que Gävle fait à ta peau",
      problemBody: "<p>Gävle se situe à la limite entre la Suède centrale et le Norrland – assez froid pour être exigeant, pas assez extrême pour que tout le monde s’adapte sans y penser. Hivers longs autour de moins quinze à moins vingt ; le Gavleån ajoute une humidité brute qui rend le froid plus mordant.</p><p>La proximité de la mer de Botnie apporte un vent chargé de sel et d’humidité. Sur la côte, à Bönan ou Engeltofta, il peut être fort et desséchant. Au centre, à l’abri des bâtiments, on ne le sent presque pas – jusqu’à ce que la peau soit sèche sans avoir vraiment été dehors.</p><p>Mélange d’industrie historique et de services modernes. Beaucoup font la navette vers Stockholm ou localement : chaque jour, carrousel maison–voiture–train–bureau, température et humidité en boucle. La culture café est forte (Gevalia, évidemment), mais la caféine déshydrate – et ça se voit sur la peau.</p>",
      tipsTitle: "Conseils peau pour Gävle",
      tips: [
        { title: "Équilibre café et eau", body: "Gävle est ville à café, mais la caféine déshydrate corps et peau. Un verre d’eau par tasse – ta peau dira merci." },
        { title: "Marche le long du Gavleån", body: "Le couloir vert le long de la rivière offre air frais et nature au quotidien. Marches régulières : moins de stress, pause pour le teint." },
        { title: "Adapte la routine à la porte du nord", body: "Le climat de Gävle est plus froid qu’on ne croit. Passe en mode hiver dès octobre jusqu’à avril – ne sous-estime pas la porte du Norrland." },
        { title: "Soutiens l’immunité dans le noir", body: "La demi-saison sombre laisse peu de soleil. Vitamine D et adaptogènes aident immunité et peau dans les mois les plus noirs." }
      ],
      solutionTitle: "Soins au CBD livrés à Gävle",
      solutionBody: "<p>1753 SKINCARE livre des soins naturels au CBD directement chez toi à Gävle. Livraison offerte dès 50 € – expédition depuis Åsa près de Göteborg.</p><p>Le DUO-kit avec The ONE et I LOVE donne la base pour tenir le climat de Gävle. CBD et CBG renforcent la barrière et équilibrent hydratation et inflammation. TA-DA Serum au CBG joue le booster pendant les mois les plus froids. Fungtastic Mushroom Extract soutient l’immunité pendant l’hiver sombre – pour celles et ceux qui soignent la peau de l’intérieur comme de l’extérieur.</p><p>Commande sur 1753skin.com – en général 1–2 jours ouvrés jusqu’à Gävle.</p>",
      faq: [
        { q: "Livrez-vous à Gävle ?", a: "Oui, depuis Åsa près de Göteborg. En général 1–2 jours ouvrés. Livraison offerte dès 50 €." },
        { q: "Où acheter des soins au CBD à Gävle ?", a: "1753skin.com – livraison à domicile à Gävle. Pas besoin de magasin." },
        { q: "Le CBD aide-t-il la peau sèche d’hiver ?", a: "Oui, le CBD renforce la barrière et aide à garder l’humidité malgré l’air froid et sec. Les huiles ajoutent une couche qui limite les pertes en eau." },
        { q: "Puis-je commander en cadeau ?", a: "Oui. Tout part dans un emballage discret et soigné, parfait pour offrir. Idéal pour quelqu’un à Gävle avec peau sèche d’hiver." }
      ],
      ctaTitle: "La peau à la porte du nord mérite de vrais soins",
      ctaSub: "Soins au CBD qui renforcent ta barrière face au climat de Gävle. Livraison offerte dès 50 €."
    }
  },
];
