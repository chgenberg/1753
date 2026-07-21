import type { LandingPage } from "./types";

/**
 * Ämneskluster runt hudanalys. Syftet är topical authority: dessa
 * informationsguider fångar informationssök ("vad är en hudanalys",
 * "hudålder", "tolka hudmetriker" osv.) och länkar internt till den
 * transaktionella landningssidan /gratis-hudanalys med varierad ankartext.
 *
 * Kategorierna återanvänds medvetet (general/comparison/howto) så att
 * sidorna integreras i guide-hubben, related-artiklar, kategoribilder och
 * schema utan ny plumbing. Innehållet finns på sv + en (primärmarknaderna).
 */
export const SKINANALYSIS_PAGES: LandingPage[] = [
  {
    svSlug: "vad-ar-en-hudanalys",
    enSlug: "what-is-a-skin-analysis",
    category: "general",
    productIds: ["duo-kit", "ta-da-serum"],
    sv: {
      metaTitle: "Vad är en hudanalys? Så fungerar en digital hudanalys | 1753",
      metaDescription:
        "En hudanalys kartlägger hudens tillstånd – fukt, elasticitet, porer, rodnad och mer. Lär dig vad en digital AI-hudanalys mäter och hur du tolkar resultatet.",
      kicker: "Grunderna",
      h1: "Vad är en hudanalys – och vad kan den faktiskt visa?",
      lead: "En hudanalys är en strukturerad bedömning av hudens tillstånd. Förr gjordes den av en hudterapeut med lampa och lupp. Idag kan en AI-baserad hudanalys mäta 15 olika hudmetriker på under en minut – direkt i mobilen.",
      problemTitle: "Varför gissa när du kan mäta?",
      problemBody:
        "<p>De flesta väljer hudvård på känsla, reklam eller vad en vän rekommenderar. Problemet är att din hud är unik: samma produkt kan lugna en persons hud och reta en annans. Utan en utgångspunkt är det omöjligt att veta om det du gör faktiskt fungerar.</p><p>En hudanalys ger dig den utgångspunkten. Istället för att gissa får du objektiva värden på hur din hud mår just nu – och något att jämföra mot om några veckor.</p>",
      tipsTitle: "Vad en modern hudanalys mäter",
      tips: [
        { title: "Fukt och barriär", body: "Hur väl huden håller kvar fukt och hur stark hudbarriären är. Låga värden syns ofta som stramhet, fjällning och känslighet." },
        { title: "Elasticitet och hudålder", body: "Hudens spänst jämfört med din biologiska ålder. Ger en estimerad 'hudålder' som är lätt att följa över tid." },
        { title: "Porer och talg", body: "Porernas synlighet och talgproduktion i olika ansiktszoner – nyckeln till att förstå blandhud och orenheter." },
        { title: "Rodnad och jämnhet", body: "Grad av rodnad, pigmentering och ytstruktur. Viktigt för känslig hud och för att följa inflammation." },
        { title: "Linjer och textur", body: "Fina linjer och ytans jämnhet, zon för zon, så att du ser var huden behöver mest stöd." },
      ],
      solutionTitle: "Så gör du en hudanalys hemma",
      solutionBody:
        "<p>Du behöver ingen klinik. Med en <a href=\"/sv/gratis-hudanalys\">gratis AI-hudanalys</a> tar du en bild i bra ljus, svarar på några frågor om din hud och livsstil, och får ett resultat med 15 metriker, estimerad hudålder och ett radardiagram över 12 ansiktszoner.</p><p>Det viktiga är inte ett enskilt värde utan trenden. Gör analysen, följ en enkel rutin i några veckor och gör om den. Då ser du svart på vitt om huden rör sig åt rätt håll. Vår filosofi är holistisk: sömn, kost, stress och rörelse påverkar huden minst lika mycket som produkterna du använder.</p>",
      faq: [
        { q: "Är en digital hudanalys tillförlitlig?", a: "En AI-hudanalys ersätter inte en läkare, men den ger konsekventa, jämförbara mätvärden som är utmärkta för att följa hudens utveckling över tid. Ta alltid bilden i samma ljus för bäst jämförbarhet." },
        { q: "Hur lång tid tar en hudanalys?", a: "En digital hudanalys tar under 60 sekunder. Du får resultatet direkt på skärmen." },
        { q: "Behöver jag köpa något för att göra analysen?", a: "Nej. Hudanalysen är helt gratis och kräver inget köp." },
        { q: "Hur ofta bör jag göra om den?", a: "Var fjärde till sjätte vecka är lagom – tillräckligt länge för att din hud ska hinna reagera på förändringar i rutin eller livsstil." },
      ],
      ctaTitle: "Få din baslinje idag",
      ctaSub: "Gör en gratis hudanalys och se dina 15 hudmetriker på under en minut.",
    },
    en: {
      metaTitle: "What Is a Skin Analysis? How Digital Skin Analysis Works | 1753",
      metaDescription:
        "A skin analysis maps your skin's condition – hydration, elasticity, pores, redness and more. Learn what a digital AI skin analysis measures and how to read the result.",
      kicker: "The basics",
      h1: "What is a skin analysis – and what can it actually reveal?",
      lead: "A skin analysis is a structured assessment of your skin's condition. It used to require a therapist with a lamp and loupe. Today an AI-based skin analysis can measure 15 skin metrics in under a minute – right on your phone.",
      problemTitle: "Why guess when you can measure?",
      problemBody:
        "<p>Most people choose skincare based on feeling, advertising or a friend's recommendation. The problem is that your skin is unique: the same product can calm one person's skin and irritate another's. Without a baseline it's impossible to know whether what you're doing actually works.</p><p>A skin analysis gives you that baseline. Instead of guessing, you get objective values for how your skin is doing right now – and something to compare against a few weeks from now.</p>",
      tipsTitle: "What a modern skin analysis measures",
      tips: [
        { title: "Hydration and barrier", body: "How well your skin retains moisture and how strong the barrier is. Low values often show up as tightness, flaking and sensitivity." },
        { title: "Elasticity and skin age", body: "Your skin's firmness compared to your biological age, giving an estimated 'skin age' that's easy to track over time." },
        { title: "Pores and sebum", body: "Pore visibility and oil production across facial zones – the key to understanding combination skin and breakouts." },
        { title: "Redness and evenness", body: "Degree of redness, pigmentation and surface texture. Important for sensitive skin and for tracking inflammation." },
        { title: "Lines and texture", body: "Fine lines and surface smoothness, zone by zone, so you see where your skin needs the most support." },
      ],
      solutionTitle: "How to do a skin analysis at home",
      solutionBody:
        "<p>You don't need a clinic. With a <a href=\"/en/free-skin-analysis\">free AI skin analysis</a> you take a photo in good light, answer a few questions about your skin and lifestyle, and get a result with 15 metrics, an estimated skin age and a radar chart across 12 facial zones.</p><p>What matters isn't a single value but the trend. Run the analysis, follow a simple routine for a few weeks and repeat it. Then you'll see clearly whether your skin is moving in the right direction. Our philosophy is holistic: sleep, diet, stress and movement affect your skin at least as much as the products you use.</p>",
      faq: [
        { q: "Is a digital skin analysis reliable?", a: "An AI skin analysis doesn't replace a doctor, but it gives consistent, comparable readings that are excellent for tracking your skin over time. Always take the photo in the same lighting for best comparability." },
        { q: "How long does a skin analysis take?", a: "A digital skin analysis takes under 60 seconds. You get the result instantly on screen." },
        { q: "Do I need to buy anything to do the analysis?", a: "No. The skin analysis is completely free and requires no purchase." },
        { q: "How often should I repeat it?", a: "Every four to six weeks is ideal – long enough for your skin to respond to changes in routine or lifestyle." },
      ],
      ctaTitle: "Get your baseline today",
      ctaSub: "Take a free skin analysis and see your 15 skin metrics in under a minute.",
    },
  },
  {
    svSlug: "ai-hudanalys-vs-hudterapeut",
    enSlug: "ai-skin-analysis-vs-dermatologist",
    category: "comparison",
    productIds: ["duo-kit", "ta-da-serum"],
    sv: {
      metaTitle: "AI-hudanalys online vs hudterapeut – vad är skillnaden? | 1753",
      metaDescription:
        "Ska du göra en hudanalys online eller boka en hudterapeut? Vi jämför pris, tillgänglighet, objektivitet och när du bör välja vad.",
      kicker: "Jämförelse",
      h1: "AI-hudanalys online vs hudterapeut – vad ska du välja?",
      lead: "Båda hjälper dig förstå din hud, men på olika sätt. En AI-hudanalys är snabb, gratis och objektiv. En hudterapeut ger personlig bedömning och behandling. Här är hur de skiljer sig.",
      problemTitle: "Olika verktyg för olika behov",
      problemBody:
        "<p>Många tror att man måste välja mellan teknik och människa. I själva verket kompletterar de varandra. En digital hudanalys är perfekt för att få en baslinje och följa förändring över tid – ofta och kostnadsfritt. En hudterapeut är ovärderlig vid specifika hudbesvär som kräver klinisk bedömning eller behandling.</p>",
      tipsTitle: "Så skiljer de sig",
      tips: [
        { title: "Pris", body: "En AI-hudanalys är gratis och kan göras hur ofta du vill. Ett besök hos hudterapeut kostar ofta flera hundra till över tusen kronor." },
        { title: "Tillgänglighet", body: "Online-analysen är tillgänglig dygnet runt, direkt i mobilen. En terapeut kräver bokning och restid." },
        { title: "Objektivitet", body: "AI mäter samma metriker varje gång utan dagsform. En terapeut tillför erfarenhet och känsla, men bedömningen kan variera mellan personer." },
        { title: "Uppföljning", body: "Digital analys gör det enkelt att jämföra vecka för vecka. Hos terapeuten är uppföljning ofta glesare." },
        { title: "Behandling", body: "Bara en terapeut eller läkare kan utföra fysisk behandling. AI ger insikter och rekommendationer, inte ingrepp." },
      ],
      solutionTitle: "Vår rekommendation",
      solutionBody:
        "<p>Börja med en <a href=\"/sv/gratis-hudanalys\">gratis AI-hudanalys</a> för att få en objektiv baslinje och en personlig rutin. Följ den i några veckor och gör om analysen. Om du har återkommande besvär – kraftig akne, misstänkta hudförändringar eller något som inte läker – boka alltid en hudterapeut eller läkare.</p><p>Tänk på AI-analysen som din vardagliga mätare och hudterapeuten som specialisten du kallar in vid behov. Tillsammans ger de dig både överblick och trygghet.</p>",
      faq: [
        { q: "Kan en AI-hudanalys ställa diagnos?", a: "Nej. En AI-hudanalys mäter hudens tillstånd och ger rekommendationer, men ställer inte medicinska diagnoser. Vid oro för en hudåkomma ska du alltid kontakta vården." },
        { q: "Är online-analysen lika noggrann som en terapeut?", a: "På mätbara metriker som fukt, elasticitet och rodnad är AI mycket konsekvent. En terapeut tillför klinisk erfarenhet som tekniken inte ersätter." },
        { q: "Kan jag använda båda?", a: "Absolut – det är faktiskt den bästa kombinationen. Använd AI för löpande uppföljning och terapeuten för djupare behandling." },
      ],
      ctaTitle: "Testa den kostnadsfria varianten först",
      ctaSub: "Se dina 15 hudmetriker på under en minut – helt gratis.",
    },
    en: {
      metaTitle: "AI Skin Analysis Online vs Dermatologist – What's the Difference? | 1753",
      metaDescription:
        "Should you do a skin analysis online or book a dermatologist? We compare cost, availability, objectivity and when to choose which.",
      kicker: "Comparison",
      h1: "AI skin analysis online vs a dermatologist – which should you choose?",
      lead: "Both help you understand your skin, but in different ways. An AI skin analysis is fast, free and objective. A dermatologist provides personal assessment and treatment. Here's how they differ.",
      problemTitle: "Different tools for different needs",
      problemBody:
        "<p>Many assume you have to choose between technology and a human. In reality they complement each other. A digital skin analysis is perfect for getting a baseline and tracking change over time – often and for free. A dermatologist is invaluable for specific concerns that require clinical assessment or treatment.</p>",
      tipsTitle: "How they differ",
      tips: [
        { title: "Cost", body: "An AI skin analysis is free and can be done as often as you like. A dermatologist visit often costs a significant amount." },
        { title: "Availability", body: "The online analysis is available around the clock, right on your phone. A dermatologist requires an appointment and travel." },
        { title: "Objectivity", body: "AI measures the same metrics every time without an off day. A professional adds experience and intuition, but assessments can vary between people." },
        { title: "Follow-up", body: "Digital analysis makes it easy to compare week by week. With a professional, follow-up is usually less frequent." },
        { title: "Treatment", body: "Only a professional can perform physical treatment. AI provides insights and recommendations, not procedures." },
      ],
      solutionTitle: "Our recommendation",
      solutionBody:
        "<p>Start with a <a href=\"/en/free-skin-analysis\">free AI skin analysis</a> to get an objective baseline and a personal routine. Follow it for a few weeks and repeat the analysis. If you have recurring concerns – severe acne, suspicious skin changes or something that won't heal – always see a dermatologist or doctor.</p><p>Think of the AI analysis as your everyday gauge and the dermatologist as the specialist you call in when needed. Together they give you both overview and peace of mind.</p>",
      faq: [
        { q: "Can an AI skin analysis diagnose conditions?", a: "No. An AI skin analysis measures your skin's condition and gives recommendations, but does not make medical diagnoses. If you're worried about a skin condition, always contact a healthcare professional." },
        { q: "Is the online analysis as accurate as a professional?", a: "On measurable metrics like hydration, elasticity and redness, AI is very consistent. A professional adds clinical experience that technology doesn't replace." },
        { q: "Can I use both?", a: "Absolutely – it's actually the best combination. Use AI for ongoing tracking and the professional for deeper treatment." },
      ],
      ctaTitle: "Try the free option first",
      ctaSub: "See your 15 skin metrics in under a minute – completely free.",
    },
  },
  {
    svSlug: "tolka-dina-hudmetriker",
    enSlug: "understanding-your-skin-metrics",
    category: "howto",
    productIds: ["duo-kit", "ta-da-serum"],
    sv: {
      metaTitle: "Så tolkar du dina 15 hudmetriker efter en hudanalys | 1753",
      metaDescription:
        "Fukt, elasticitet, porer, rodnad, hudålder – vad betyder egentligen värdena i din hudanalys? En guide till att läsa och agera på ditt resultat.",
      kicker: "Guide",
      h1: "Så tolkar du dina 15 hudmetriker",
      lead: "Ett radardiagram fullt av siffror kan kännas överväldigande. Men varje metrik berättar något konkret om din hud – och pekar mot vad du kan göra åt det. Här går vi igenom hur du läser resultatet.",
      problemTitle: "Siffror utan sammanhang säger ingenting",
      problemBody:
        "<p>Efter en hudanalys får du en mängd värden. Det verkliga värdet ligger inte i en enskild siffra utan i hur metrikerna hänger ihop och hur de förändras över tid. Låg fukt tillsammans med hög rodnad pekar ofta mot en försvagad barriär – inte mot att du behöver en starkare produkt.</p>",
      tipsTitle: "Läs metrikerna i grupper",
      tips: [
        { title: "Barriärgruppen", body: "Fukt, stramhet och känslighet hör ihop. Är de låga: fokusera på mild rengöring och återfuktning innan du lägger till aktiva ingredienser." },
        { title: "Åldersgruppen", body: "Elasticitet, fina linjer och hudålder. Här handlar det om långsiktighet – sömn, solskydd och antioxidanter gör mest skillnad över tid." },
        { title: "Talggruppen", body: "Porer, glans och orenheter. Höga värden i T-zonen är normalt. Balansera istället för att torka ut, annars ökar talgproduktionen." },
        { title: "Jämnhetsgruppen", body: "Rodnad, pigmentering och textur. Följ dessa noga om du har känslig eller reaktiv hud – de reagerar snabbast på livsstil." },
        { title: "Zonvärdena", body: "Samma metrik kan skilja sig mellan panna, kinder och haka. Anpassa rutinen zon för zon istället för att behandla hela ansiktet lika." },
      ],
      solutionTitle: "Från resultat till handling",
      solutionBody:
        "<p>Börja med den lägsta metriken i barriärgruppen – det är oftast grunden till andra problem. Gör en förändring i taget, vänta några veckor och kör om din <a href=\"/sv/gratis-hudanalys\">hudanalys</a> för att se effekten. På så sätt vet du vilken förändring som faktiskt gjorde skillnad.</p><p>Kom ihåg att huden speglar hela kroppen. Om värdena står stilla trots en bra rutin, titta på sömn, stress och kost. Ofta ligger svaret där.</p>",
      faq: [
        { q: "Vad är ett 'bra' värde?", a: "Det finns inget universellt idealvärde – det viktiga är din egen trend. Ett värde som förbättras över tid är bättre än en hög startsiffra som sjunker." },
        { q: "Varför skiljer sig värdena mellan ansiktszoner?", a: "Olika zoner har olika mängd talgkörtlar och utsätts för olika belastning. Därför mäter analysen 12 zoner separat." },
        { q: "Hur snabbt kan värdena förändras?", a: "Barriär- och fuktvärden kan röra sig inom några veckor. Elasticitet och hudålder förändras långsammare, över månader." },
      ],
      ctaTitle: "Se dina egna värden",
      ctaSub: "Gör en gratis hudanalys och få ditt radardiagram med 15 metriker.",
    },
    en: {
      metaTitle: "How to Read Your 15 Skin Metrics After a Skin Analysis | 1753",
      metaDescription:
        "Hydration, elasticity, pores, redness, skin age – what do the values in your skin analysis actually mean? A guide to reading and acting on your result.",
      kicker: "Guide",
      h1: "How to read your 15 skin metrics",
      lead: "A radar chart full of numbers can feel overwhelming. But each metric tells you something concrete about your skin – and points toward what you can do about it. Here's how to read the result.",
      problemTitle: "Numbers without context mean nothing",
      problemBody:
        "<p>After a skin analysis you get a set of values. The real value isn't in a single number but in how the metrics relate and how they change over time. Low hydration together with high redness often points to a weakened barrier – not to needing a stronger product.</p>",
      tipsTitle: "Read the metrics in groups",
      tips: [
        { title: "The barrier group", body: "Hydration, tightness and sensitivity belong together. If they're low, focus on gentle cleansing and moisturising before adding active ingredients." },
        { title: "The age group", body: "Elasticity, fine lines and skin age. This is about the long game – sleep, sun protection and antioxidants make the biggest difference over time." },
        { title: "The sebum group", body: "Pores, shine and breakouts. High values in the T-zone are normal. Balance rather than strip, otherwise oil production increases." },
        { title: "The evenness group", body: "Redness, pigmentation and texture. Track these closely if you have sensitive or reactive skin – they respond fastest to lifestyle." },
        { title: "The zone values", body: "The same metric can differ between forehead, cheeks and chin. Tailor your routine zone by zone instead of treating the whole face the same." },
      ],
      solutionTitle: "From result to action",
      solutionBody:
        "<p>Start with the lowest metric in the barrier group – it's usually the root of other issues. Make one change at a time, wait a few weeks and re-run your <a href=\"/en/free-skin-analysis\">skin analysis</a> to see the effect. That way you know which change actually made the difference.</p><p>Remember that skin reflects the whole body. If the values stay flat despite a good routine, look at sleep, stress and diet. The answer is often there.</p>",
      faq: [
        { q: "What is a 'good' value?", a: "There's no universal ideal value – what matters is your own trend. A value that improves over time beats a high starting number that declines." },
        { q: "Why do values differ between facial zones?", a: "Different zones have different amounts of sebaceous glands and face different stress. That's why the analysis measures 12 zones separately." },
        { q: "How fast can the values change?", a: "Barrier and hydration values can move within a few weeks. Elasticity and skin age change more slowly, over months." },
      ],
      ctaTitle: "See your own values",
      ctaSub: "Take a free skin analysis and get your radar chart with 15 metrics.",
    },
  },
  {
    svSlug: "vad-ar-hudalder",
    enSlug: "what-is-skin-age",
    category: "general",
    productIds: ["duo-kit", "ta-da-serum"],
    sv: {
      metaTitle: "Vad är hudålder och hur mäts den? | 1753",
      metaDescription:
        "Hudålder är ett mått på hur gammal din hud ser ut jämfört med din verkliga ålder. Lär dig vad som påverkar hudåldern och hur en hudanalys estimerar den.",
      kicker: "Grunderna",
      h1: "Vad är hudålder – och hur mäts den?",
      lead: "Hudålder beskriver hur gammal din hud ser ut biologiskt, oavsett hur många år du levt. Två personer i samma ålder kan ha flera års skillnad i hudålder – och den är påverkbar.",
      problemTitle: "Kronologisk ålder är bara halva sanningen",
      problemBody:
        "<p>Din kronologiska ålder kan du inte ändra. Men hudens biologiska ålder styrs till stor del av faktorer du kan påverka: solexponering, sömn, kost, stress och hudvårdsrutin. Därför är hudålder ett mer användbart mått än antal levda år när du vill förstå och förbättra din hud.</p>",
      tipsTitle: "Vad som påverkar din hudålder",
      tips: [
        { title: "Solskydd", body: "UV-strålning är den enskilt största orsaken till för tidigt åldrande. Dagligt solskydd är den mest effektiva anti-age-åtgärden som finns." },
        { title: "Sömn", body: "Under djupsömn reparerar huden sig själv. Kronisk sömnbrist syns snabbt som trötthet, minskad elasticitet och ökad rodnad." },
        { title: "Kost och tarm", body: "En näringsrik kost och en balanserad tarmflora stödjer hudens egna reparationsprocesser inifrån." },
        { title: "Stress", body: "Långvarig stress höjer kortisol, som bryter ner kollagen och försvagar hudbarriären. Återhämtning är hudvård." },
        { title: "Konsekvent rutin", body: "Regelbunden, mild hudvård som stödjer hudens egna system slår dyra kurer som stressar huden." },
      ],
      solutionTitle: "Så följer du din hudålder",
      solutionBody:
        "<p>En <a href=\"/sv/gratis-hudanalys\">AI-hudanalys</a> estimerar din hudålder utifrån elasticitet, textur, fina linjer och jämnhet. Det bästa sättet att använda värdet är att följa det över tid: gör analysen, förbättra en livsstilsfaktor och se om hudåldern rör sig nedåt.</p><p>Vi tror på ett holistiskt grepp. Produkter kan stödja huden, men den största effekten på hudålder kommer från sömn, solskydd och återhämtning. Huden speglar hur hela du mår.</p>",
      faq: [
        { q: "Kan man verkligen sänka sin hudålder?", a: "Ja, i den mening att hudens synliga tillstånd – elasticitet, fukt och jämnhet – kan förbättras med bättre vanor och rätt rutin. Det syns ofta i en förnyad analys." },
        { q: "Hur exakt är en estimerad hudålder?", a: "Det är ett relativt mått, inte en exakt siffra. Störst nytta gör det som jämförelsepunkt över tid snarare än som en absolut sanning." },
        { q: "Vad påverkar hudåldern mest?", a: "Solexponering över tid är den dominerande faktorn, följt av sömn, stress och kost." },
      ],
      ctaTitle: "Ta reda på din hudålder",
      ctaSub: "Gör en gratis hudanalys och få en estimerad hudålder på under en minut.",
    },
    en: {
      metaTitle: "What Is Skin Age and How Is It Measured? | 1753",
      metaDescription:
        "Skin age measures how old your skin looks compared to your real age. Learn what affects skin age and how a skin analysis estimates it.",
      kicker: "The basics",
      h1: "What is skin age – and how is it measured?",
      lead: "Skin age describes how old your skin looks biologically, regardless of how many years you've lived. Two people the same age can differ by several years in skin age – and it's changeable.",
      problemTitle: "Chronological age is only half the truth",
      problemBody:
        "<p>You can't change your chronological age. But your skin's biological age is largely driven by factors you can influence: sun exposure, sleep, diet, stress and skincare routine. That makes skin age a more useful measure than years lived when you want to understand and improve your skin.</p>",
      tipsTitle: "What affects your skin age",
      tips: [
        { title: "Sun protection", body: "UV radiation is the single largest cause of premature ageing. Daily sun protection is the most effective anti-ageing step there is." },
        { title: "Sleep", body: "Skin repairs itself during deep sleep. Chronic sleep loss quickly shows up as fatigue, reduced elasticity and increased redness." },
        { title: "Diet and gut", body: "A nutrient-rich diet and a balanced gut flora support the skin's own repair processes from within." },
        { title: "Stress", body: "Prolonged stress raises cortisol, which breaks down collagen and weakens the barrier. Recovery is skincare." },
        { title: "Consistent routine", body: "Regular, gentle skincare that supports the skin's own systems beats expensive treatments that stress the skin." },
      ],
      solutionTitle: "How to track your skin age",
      solutionBody:
        "<p>An <a href=\"/en/free-skin-analysis\">AI skin analysis</a> estimates your skin age from elasticity, texture, fine lines and evenness. The best way to use the value is to track it over time: run the analysis, improve one lifestyle factor and see whether your skin age moves down.</p><p>We believe in a holistic approach. Products can support the skin, but the biggest impact on skin age comes from sleep, sun protection and recovery. Your skin reflects how all of you is doing.</p>",
      faq: [
        { q: "Can you really lower your skin age?", a: "Yes, in the sense that the skin's visible condition – elasticity, hydration and evenness – can improve with better habits and the right routine. It often shows in a repeat analysis." },
        { q: "How accurate is an estimated skin age?", a: "It's a relative measure, not an exact number. It's most useful as a reference point over time rather than an absolute truth." },
        { q: "What affects skin age most?", a: "Sun exposure over time is the dominant factor, followed by sleep, stress and diet." },
      ],
      ctaTitle: "Find out your skin age",
      ctaSub: "Take a free skin analysis and get an estimated skin age in under a minute.",
    },
  },
  {
    svSlug: "hitta-din-hudtyp",
    enSlug: "find-your-skin-type",
    category: "howto",
    productIds: ["duo-kit", "au-naturel"],
    sv: {
      metaTitle: "Hitta din hudtyp – enkelt test hemma | 1753",
      metaDescription:
        "Torr, fet, blandhud, normal eller känslig? Så tar du reda på din hudtyp hemma – och varför en hudanalys ger ett mer exakt svar än spegeltestet.",
      kicker: "Guide",
      h1: "Hitta din hudtyp – enkelt test hemma",
      lead: "Att känna sin hudtyp är utgångspunkten för all hudvård. Men hudtyp är inte statisk – den förändras med årstid, ålder och livsstil. Här är hur du tar reda på din, både med ett enkelt hemtest och med en mer exakt hudanalys.",
      problemTitle: "Varför fel hudtyp leder fel",
      problemBody:
        "<p>Väljer du produkter för fel hudtyp kan du förvärra problemet. Torr hud som behandlas som fet blir ännu torrare; fet hud som överfuktas kan bli glansig och orenad. Många har dessutom blandhud – fet T-zon och torra kinder – vilket kräver olika grepp i olika zoner.</p>",
      tipsTitle: "Enkelt hemtest i tre steg",
      tips: [
        { title: "1. Rengör och vänta", body: "Tvätta ansiktet milt och låt huden vila utan produkter i en timme. Undvik att röra ansiktet." },
        { title: "2. Känn efter", body: "Stramar det överallt? Sannolikt torr hud. Glänser hela ansiktet? Fet hud. Glänsande T-zon men torra kinder? Blandhud." },
        { title: "3. Testa reaktionen", body: "Om huden lätt blir röd, kliar eller svider av nya produkter lutar det åt känslig hud – oavsett övrig typ." },
        { title: "Tänk på årstiden", body: "Samma hud kan vara torr på vintern och normal på sommaren. Gör om testet vid säsongsskifte." },
        { title: "Zon för zon", body: "Behandla inte hela ansiktet lika. De flesta har olika behov på panna, kinder och haka." },
      ],
      solutionTitle: "Ett mer exakt svar",
      solutionBody:
        "<p>Hemtestet ger en fingervisning, men det bygger på känsla. En <a href=\"/sv/gratis-hudanalys\">gratis hudanalys</a> mäter fukt, talg och känslighet i 12 zoner och ger dig ett objektivt svar på hur din hud faktiskt fördelar sig – ofta mer nyanserat än en enkel etikett.</p><p>När du känner din hudtyp blir resten enklare. Vår filosofi är att stödja hudens egna system med milda, holistiska val snarare än att bekämpa symtom med starka produkter.</p>",
      faq: [
        { q: "Kan man ha flera hudtyper samtidigt?", a: "Ja. Blandhud är mycket vanligt, och känslighet kan förekomma tillsammans med vilken typ som helst. Därför mäter en hudanalys zon för zon." },
        { q: "Förändras hudtypen över tid?", a: "Ja, med ålder, hormoner, årstid och livsstil. Gör om ditt test eller din analys någon gång per säsong." },
        { q: "Är känslig hud en egen hudtyp?", a: "Känslighet beskriver hur huden reagerar snarare än dess fett-/fuktbalans, men den är avgörande för produktval och behandlas ofta som en egen dimension." },
      ],
      ctaTitle: "Låt analysen svara",
      ctaSub: "Gör en gratis hudanalys och få din hudtyp kartlagd i 12 zoner.",
    },
    en: {
      metaTitle: "Find Your Skin Type – Simple At-Home Test | 1753",
      metaDescription:
        "Dry, oily, combination, normal or sensitive? How to find your skin type at home – and why a skin analysis gives a more precise answer than the mirror test.",
      kicker: "Guide",
      h1: "Find your skin type – a simple at-home test",
      lead: "Knowing your skin type is the starting point for all skincare. But skin type isn't static – it changes with season, age and lifestyle. Here's how to find yours, both with a simple home test and a more precise skin analysis.",
      problemTitle: "Why the wrong skin type leads you astray",
      problemBody:
        "<p>Choose products for the wrong skin type and you can make the problem worse. Dry skin treated as oily gets drier; oily skin that's over-moisturised can turn shiny and congested. Many people also have combination skin – oily T-zone and dry cheeks – which needs different approaches in different zones.</p>",
      tipsTitle: "Simple home test in three steps",
      tips: [
        { title: "1. Cleanse and wait", body: "Wash your face gently and let the skin rest without products for an hour. Avoid touching your face." },
        { title: "2. Assess how it feels", body: "Tight all over? Likely dry skin. Whole face shiny? Oily. Shiny T-zone but dry cheeks? Combination." },
        { title: "3. Test the reaction", body: "If your skin easily turns red, itches or stings from new products, it leans sensitive – regardless of the other type." },
        { title: "Consider the season", body: "The same skin can be dry in winter and normal in summer. Repeat the test at each season change." },
        { title: "Zone by zone", body: "Don't treat the whole face the same. Most people have different needs on forehead, cheeks and chin." },
      ],
      solutionTitle: "A more precise answer",
      solutionBody:
        "<p>The home test gives a hint, but it's based on feeling. A <a href=\"/en/free-skin-analysis\">free skin analysis</a> measures hydration, sebum and sensitivity across 12 zones and gives you an objective answer to how your skin actually distributes – often more nuanced than a single label.</p><p>Once you know your skin type, the rest gets easier. Our philosophy is to support the skin's own systems with gentle, holistic choices rather than fighting symptoms with harsh products.</p>",
      faq: [
        { q: "Can you have several skin types at once?", a: "Yes. Combination skin is very common, and sensitivity can occur alongside any type. That's why a skin analysis measures zone by zone." },
        { q: "Does skin type change over time?", a: "Yes, with age, hormones, season and lifestyle. Repeat your test or analysis roughly once per season." },
        { q: "Is sensitive skin its own type?", a: "Sensitivity describes how skin reacts rather than its oil/moisture balance, but it's crucial for product choice and is often treated as its own dimension." },
      ],
      ctaTitle: "Let the analysis answer",
      ctaSub: "Take a free skin analysis and get your skin type mapped across 12 zones.",
    },
  },
  {
    svSlug: "hur-ofta-bor-du-gora-en-hudanalys",
    enSlug: "how-often-should-you-do-a-skin-analysis",
    category: "general",
    productIds: ["duo-kit", "ta-da-serum"],
    sv: {
      metaTitle: "Hur ofta bör du göra en hudanalys? | 1753",
      metaDescription:
        "En hudanalys är mest värdefull när du följer den över tid. Så ofta bör du göra om den – och hur du använder resultaten för att faktiskt se förändring.",
      kicker: "Grunderna",
      h1: "Hur ofta bör du göra en hudanalys?",
      lead: "En enskild hudanalys ger en ögonblicksbild. Det verkliga värdet kommer när du gör om den regelbundet och ser hur din hud utvecklas. Men hur ofta är lagom?",
      problemTitle: "För sällan – eller för ofta",
      problemBody:
        "<p>Gör du analysen för sällan missar du kopplingen mellan vad du ändrat och hur huden svarat. Gör du den varje dag reagerar du på brus – huden varierar naturligt med sömn, ljus och vätskebalans. Nyckeln är ett intervall där verkliga förändringar hinner synas.</p>",
      tipsTitle: "Rekommenderat intervall",
      tips: [
        { title: "Baslinje först", body: "Gör din första analys som utgångspunkt. Spara resultatet – det är referensen du jämför mot." },
        { title: "Var 4:e–6:e vecka", body: "Lagom intervall för de flesta. Huden hinner reagera på förändringar i rutin eller livsstil utan att du fastnar i dagsvariationer." },
        { title: "Vid rutinbyte", body: "Byter du produkt eller lägger till en aktiv ingrediens? Gör en analys före och en 4–6 veckor efter för att mäta effekten." },
        { title: "Vid säsongsskifte", body: "Huden förändras mellan vinter och sommar. En analys vid varje säsong hjälper dig anpassa rutinen." },
        { title: "Samma förhållanden", body: "Ta bilden i samma ljus och tid på dygnet varje gång, så blir jämförelsen rättvis." },
      ],
      solutionTitle: "Gör mätningen till en vana",
      solutionBody:
        "<p>Eftersom en <a href=\"/sv/gratis-hudanalys\">hudanalys</a> är gratis och tar under en minut finns inget hinder att göra den regelbundet. Lägg en påminnelse en gång i månaden och behandla det som en snabb hälsokoll för huden.</p><p>Och kom ihåg: om värdena står stilla trots god rutin, titta bortom produkterna. Sömn, stress, kost och rörelse påverkar huden minst lika mycket. Analysen visar vad som händer – livsstilen avgör ofta varför.</p>",
      faq: [
        { q: "Kan jag göra en hudanalys för ofta?", a: "Det är inte skadligt, men resultat med bara några dagars mellanrum påverkas av naturlig dagsvariation. Var 4:e–6:e vecka ger tydligare trender." },
        { q: "Sparas mina tidigare resultat?", a: "Med ett konto kan du följa din hudresa över tid och jämföra analyser direkt mot varandra." },
        { q: "Vad gör jag om värdena försämras?", a: "Backa till din senaste förändring. Ofta räcker det att gå tillbaka en steg i rutinen eller se över sömn och stress." },
      ],
      ctaTitle: "Starta din hudresa",
      ctaSub: "Gör din första gratis hudanalys och skapa din baslinje idag.",
    },
    en: {
      metaTitle: "How Often Should You Do a Skin Analysis? | 1753",
      metaDescription:
        "A skin analysis is most valuable when tracked over time. How often to repeat it – and how to use the results to actually see change.",
      kicker: "The basics",
      h1: "How often should you do a skin analysis?",
      lead: "A single skin analysis gives a snapshot. The real value comes when you repeat it regularly and see how your skin develops. But how often is right?",
      problemTitle: "Too rarely – or too often",
      problemBody:
        "<p>Do the analysis too rarely and you miss the link between what you changed and how the skin responded. Do it every day and you react to noise – skin naturally varies with sleep, light and hydration. The key is an interval where real changes have time to show.</p>",
      tipsTitle: "Recommended interval",
      tips: [
        { title: "Baseline first", body: "Do your first analysis as a starting point. Save the result – it's the reference you compare against." },
        { title: "Every 4–6 weeks", body: "A good interval for most people. Skin has time to respond to changes in routine or lifestyle without getting lost in day-to-day variation." },
        { title: "At routine changes", body: "Switching product or adding an active? Do an analysis before and one 4–6 weeks after to measure the effect." },
        { title: "At season changes", body: "Skin changes between winter and summer. An analysis each season helps you adapt the routine." },
        { title: "Same conditions", body: "Take the photo in the same light and time of day each time, so the comparison is fair." },
      ],
      solutionTitle: "Make measuring a habit",
      solutionBody:
        "<p>Since a <a href=\"/en/free-skin-analysis\">skin analysis</a> is free and takes under a minute, there's no barrier to doing it regularly. Set a monthly reminder and treat it as a quick health check for your skin.</p><p>And remember: if the values stay flat despite a good routine, look beyond the products. Sleep, stress, diet and movement affect the skin at least as much. The analysis shows what's happening – lifestyle often decides why.</p>",
      faq: [
        { q: "Can I do a skin analysis too often?", a: "It's not harmful, but results just days apart are affected by natural daily variation. Every 4–6 weeks gives clearer trends." },
        { q: "Are my previous results saved?", a: "With an account you can follow your skin journey over time and compare analyses directly against each other." },
        { q: "What do I do if the values get worse?", a: "Back out your latest change. Often it's enough to step back one part of the routine or review sleep and stress." },
      ],
      ctaTitle: "Start your skin journey",
      ctaSub: "Take your first free skin analysis and create your baseline today.",
    },
  },
];
