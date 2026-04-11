import type { LandingPage } from "./types";

export const LIFESTYLE_PAGES: LandingPage[] = [
  {
    svSlug: "stress-och-huden",
    enSlug: "stress-and-skin",
    category: "lifestyle",
    productIds: ["duo-ta-da", "ta-da-serum", "fungtastic-mushroom-extract"],
    sv: {
      metaTitle: "Stress och huden – så påverkar stress ditt utseende",
      metaDescription: "Kronisk stress bryter ner din hud inifrån. Lär dig hur kortisol skadar hudbarriären och vad du kan göra åt det. Upptäck 1753 SKINCARE.",
      kicker: "Livsstil & Hud",
      h1: "Stress och huden – din kropp håller poängen",
      lead: "Du kan ha världens bästa hudvårdsrutin och ändå vakna med utbrott, mörka ringar och grå hy. Orsaken? Den sitter inte i din necessär – den sitter i ditt nervsystem.",
      problemTitle: "Vad gör stress med huden?",
      problemBody: "<p>När kroppen uppfattar fara – oavsett om det handlar om ett rovdjur eller en inkorg med 200 olästa mail – aktiveras hypotalamus-hypofys-binjure-axeln (HPA-axeln). Binjurarna pumpar ut kortisol, och hela kroppen ställer om till överlevnadsläge. Huden, kroppens största organ, är bland de första som får betala priset.</p><p>Kroniskt förhöjt kortisol bryter ner kollagen och elastin, de proteiner som håller huden fast och elastisk. Talgproduktionen ökar, porerna täpps till, och inflammatoriska signalämnen flödar genom kroppen. Resultat: akne, eksem, rosacea och en hudbarriär som inte längre klarar sitt jobb. Huden blir reaktiv, torr på ytan men fet i t-zonen, och läker långsammare.</p><p>Forskning från Stanfords dermatologiska avdelning visar att studenter konsekvent får sämre hud under tentaperioder. Det är inte en slump – det är biokemi. Din hud är en ärlig spegel av ditt inre tillstånd, och kronisk stress lämnar avtryck som ingen kräm i världen kan dölja.</p>",
      tipsTitle: "Konkreta sätt att sänka stressen",
      tips: [
        { title: "Andas med magen", body: "Fyra sekunder in, sju sekunder ut. Diafragmaandning aktiverar parasympatiska nervsystemet och sänker kortisol på bara några minuter. Gör det tre gånger om dagen – vid uppvaknandet, efter lunch och innan sömn." },
        { title: "Rör dig dagligen", body: "30 minuter promenad sänker kortisol, ökar blodflödet till huden och frigör endorfiner. Det behöver inte vara crossfit – rörelse i alla former räknas. Målet är konsistens, inte intensitet." },
        { title: "Sätt gränser för skärmar", body: "Blått ljus och konstant stimulans håller nervsystemet i fight-or-flight. Stäng av notiser efter klockan 20 och ge hjärnan en chans att ladda ner. Din hud tackar dig nästa morgon." },
        { title: "Skriv av dig", body: "Journaling sänker bevisligen kortisolnivåer. Skriv tre saker du oroar dig för och tre du är tacksam över. Det tar fem minuter och tvingar hjärnan ur stressloopen." },
        { title: "Adaptogena svampar", body: "Lion's mane, reishi och chaga har i studier visat sig stödja nervsystemet och minska stressrelaterad inflammation. Vår Fungtastic Mushroom Extract ger dig alla tre i en daglig dos." }
      ],
      solutionTitle: "Så stödjer CBD huden under stress",
      solutionBody: "<p>Endocannabinoidsystemet (ECS) är kroppens egna balanserare – det reglerar stress, inflammation och immunsvar. När ECS fungerar optimalt hanterar kroppen stress utan att huden behöver ta smällen. CBD interagerar med CB2-receptorer i hudcellerna och hjälper till att dämpa den inflammatoriska kaskad som kortisol sätter igång.</p><p>Studier visar att CBD kan minska produktionen av proinflammatoriska cytokiner och samtidigt stärka hudbarriärens integritet. Det betyder lugnare hud, färre utbrott och snabbare läkning. Vårt Ta-Da Serum med 10% CBD levererar detta direkt till huden, medan Duo Ta-Da kombinerar serum och olja för maximal barriärstöd.</p><p>Kombinera med Fungtastic Mushroom Extract som jobbar inifrån med adaptogena svampar – för dig som vill adressera stressen på riktigt, inte bara plåstra om symtomen.</p>",
      faq: [
        { q: "Hur snabbt påverkar stress huden?", a: "Kortisolnivåerna stiger inom minuter, men synliga hudförändringar visar sig oftast efter 2–3 dagar av ihållande stress. Kronisk stress ger kumulativa effekter som blir svårare att reparera över tid." },
        { q: "Kan CBD hjälpa mot stressrelaterad akne?", a: "Ja. CBD har sebostatiska och antiinflammatoriska egenskaper som direkt adresserar de mekanismer stress triggar i huden – ökad talgproduktion och inflammation. Det ersätter inte stresshantering, men det ger huden bättre förutsättningar." },
        { q: "Fungerar svampextrakt verkligen mot stress?", a: "Adaptogena svampar som reishi och lion's mane har visat positiva resultat i kliniska studier på stressmarkörer och kortisolnivåer. De ersätter inte andra insatser men kan vara en värdefull pusselbit." },
        { q: "Vilken produkt är bäst för stressad hud?", a: "Börja med Ta-Da Serum för direkt hudvård och komplettera med Fungtastic Mushroom Extract för inre balans. Duo Ta-Da ger dig hela paketet – serum och olja i en rutin." }
      ],
      ctaTitle: "Ge din stressade hud en paus",
      ctaSub: "Stressen försvinner kanske inte imorgon – men din huds reaktion på den kan förändras redan idag."
    },
    en: {
      metaTitle: "Stress and skin – how stress affects your appearance",
      metaDescription: "Chronic stress breaks down your skin from within. Learn how cortisol damages your skin barrier and what you can do about it. Discover 1753 SKINCARE.",
      kicker: "Lifestyle & Skin",
      h1: "Stress and skin – your body keeps the score",
      lead: "You can have the world's best skincare routine and still wake up with breakouts, dark circles, and dull skin. The cause? It's not in your bathroom cabinet – it's in your nervous system.",
      problemTitle: "What does stress do to your skin?",
      problemBody: "<p>When your body perceives danger – whether it's a predator or an inbox with 200 unread emails – the hypothalamic-pituitary-adrenal (HPA) axis fires up. Your adrenal glands flood the body with cortisol, switching everything to survival mode. The skin, your largest organ, is among the first to pay the price.</p><p>Chronically elevated cortisol breaks down collagen and elastin, the proteins that keep skin firm and elastic. Oil production ramps up, pores get clogged, and inflammatory signaling molecules surge through the body. The result: acne, eczema, rosacea, and a skin barrier that can no longer do its job. Skin becomes reactive, dry on the surface but oily in the T-zone, and heals more slowly.</p><p>Research from Stanford's dermatology department shows that students consistently experience worse skin during exam periods. That's not coincidence – it's biochemistry. Your skin is an honest mirror of your inner state, and chronic stress leaves marks that no cream in the world can conceal.</p>",
      tipsTitle: "Practical ways to lower stress",
      tips: [
        { title: "Breathe with your belly", body: "Four seconds in, seven seconds out. Diaphragmatic breathing activates the parasympathetic nervous system and lowers cortisol in just minutes. Do it three times daily – upon waking, after lunch, and before sleep." },
        { title: "Move daily", body: "A 30-minute walk lowers cortisol, increases blood flow to the skin, and releases endorphins. It doesn't have to be crossfit – movement in any form counts. The goal is consistency, not intensity." },
        { title: "Set screen boundaries", body: "Blue light and constant stimulation keep your nervous system in fight-or-flight. Turn off notifications after 8 PM and give your brain a chance to wind down. Your skin will thank you the next morning." },
        { title: "Write it out", body: "Journaling has been proven to lower cortisol levels. Write down three things you're worried about and three you're grateful for. It takes five minutes and forces your brain out of the stress loop." },
        { title: "Adaptogenic mushrooms", body: "Lion's mane, reishi, and chaga have shown promise in studies for supporting the nervous system and reducing stress-related inflammation. Our Fungtastic Mushroom Extract delivers all three in one daily dose." }
      ],
      solutionTitle: "How CBD supports skin under stress",
      solutionBody: "<p>The endocannabinoid system (ECS) is your body's own balancing act – regulating stress, inflammation, and immune response. When ECS functions optimally, your body handles stress without your skin taking the hit. CBD interacts with CB2 receptors in skin cells and helps dampen the inflammatory cascade that cortisol triggers.</p><p>Studies show CBD can reduce the production of pro-inflammatory cytokines while strengthening skin barrier integrity. That means calmer skin, fewer breakouts, and faster healing. Our Ta-Da Serum with 10% CBD delivers this directly to the skin, while Duo Ta-Da combines serum and oil for maximum barrier support.</p><p>Combine with Fungtastic Mushroom Extract, which works from within using adaptogenic mushrooms – for those who want to address stress at its root, not just patch over the symptoms.</p>",
      faq: [
        { q: "How quickly does stress affect the skin?", a: "Cortisol levels rise within minutes, but visible skin changes typically appear after 2–3 days of sustained stress. Chronic stress has cumulative effects that become harder to repair over time." },
        { q: "Can CBD help with stress-related acne?", a: "Yes. CBD has sebostatic and anti-inflammatory properties that directly address the mechanisms stress triggers in the skin – increased oil production and inflammation. It doesn't replace stress management, but it gives your skin better odds." },
        { q: "Do mushroom extracts actually work for stress?", a: "Adaptogenic mushrooms like reishi and lion's mane have shown positive results in clinical studies on stress markers and cortisol levels. They don't replace other efforts but can be a valuable piece of the puzzle." },
        { q: "Which product is best for stressed skin?", a: "Start with Ta-Da Serum for direct skincare and add Fungtastic Mushroom Extract for inner balance. Duo Ta-Da gives you the complete package – serum and oil in one routine." }
      ],
      ctaTitle: "Give your stressed skin a break",
      ctaSub: "The stress might not vanish tomorrow – but your skin's reaction to it can start changing today."
    }
  },
  {
    svSlug: "somn-och-huden",
    enSlug: "sleep-and-skin",
    category: "lifestyle",
    productIds: ["duo-ta-da", "ta-da-serum", "fungtastic-mushroom-extract"],
    sv: {
      metaTitle: "Sömn och huden – därför syns sömnbrist i ansiktet",
      metaDescription: "Dålig sömn åldrar huden snabbare än solskador. Lär dig hur sömn reparerar huden på natten och hur du optimerar din skönhetssömn. 1753 SKINCARE.",
      kicker: "Livsstil & Hud",
      h1: "Sömn och huden – den viktigaste hudvårdsrutinen sker i sängen",
      lead: "Ingen serum i världen kan kompensera för sömnbrist. På natten reparerar, förnyar och avgiftar huden sig själv. Stör du den processen betalar du med rynkor, mörka ringar och en hy som aldrig riktigt vaknar.",
      problemTitle: "Vad händer med huden när du sover?",
      problemBody: "<p>Mellan klockan 23 och 03 når kroppen sin djupaste sömnfas, och det är då magin händer. Tillväxthormon (HGH) frisätts i pulser och kickstartar celldelning och kollagensyntes. Blodflödet till huden ökar med upp till 25 procent, och skadade celler repareras i en takt som dagtid är omöjlig.</p><p>Sömnbrist saboterar hela den här processen. Redan efter en natt med färre än sex timmars sömn ökar kortisolnivåerna, hudbarriären försvagas och transepidermal vattenförlust (TEWL) stiger – huden läcker bokstavligen fukt. Kronisk sömnbrist accelererar hudens åldrande med en faktor som forskare vid University Hospitals Case Medical Center uppskattar till 30 procent snabbare jämfört med de som sover 7–9 timmar.</p><p>Det syns. Studier med ansiktsigenkänning visar att observatörer konsekvent bedömer sömnberövade personer som sjukare, ledsnare och mindre attraktiva. Mörka ringar, hängande mundgipor, blekare hy. Det kallas inte skönhetssömn utan anledning.</p>",
      tipsTitle: "Optimera din sömn för bättre hud",
      tips: [
        { title: "Håll samma tider", body: "Gå och lägg dig och vakna samma tid varje dag – även på helger. Din cirkadiska klocka styr när huden reparerar sig, och oregelbundna tider kastar hela systemet ur balans." },
        { title: "Mörka sovrummet totalt", body: "Även små ljuskällor – standby-lampor, gatlyktor genom gardiner – störer melatoninproduktionen. Investera i mörkläggningsgardiner eller en sovmask. Melatonin är dessutom en potent antioxidant för huden." },
        { title: "Sänk temperaturen", body: "Det optimala sovrummet håller 16–18 grader. Kroppen behöver sänka sin kärntemperatur för att somna, och ett svalt rum gör det enklare. Bonus: svalare temperatur minskar nattliga svettningar som kan irritera huden." },
        { title: "Undvik skärmar sista timmen", body: "Blått ljus från telefoner och datorer förskjuter melatoninfrisättningen med upp till 90 minuter. Byt till en bok, stretching eller en lugn kvällsrutin med hudvård." },
        { title: "Stöd sömnen med adaptogener", body: "Reishi-svamp kallas traditionellt sömnsvampen och har i studier visat sig förbättra sömnkvaliteten. Vår Fungtastic Mushroom Extract innehåller reishi tillsammans med lion's mane och chaga." }
      ],
      solutionTitle: "Nattlig hudvård med CBD",
      solutionBody: "<p>Natten är den perfekta tiden att ge huden CBD. Under sömnen är huden som mest mottaglig för aktiva ingredienser, och blodflödet i huden är på topp. CBD:s antiinflammatoriska egenskaper samverkar med kroppens naturliga reparationsprocesser och hjälper huden att återhämta sig effektivare.</p><p>Vårt Ta-Da Serum applicerat innan sömn ger huden en koncentrerad dos CBD som arbetar i synk med nattens reparationscykel. Duo Ta-Da lägger till en skyddande oljelager som minskar den transepidermala vattenförlusten – särskilt viktigt för dig som sover i torra miljöer eller med element på vintern.</p><p>Komplettera med Fungtastic Mushroom Extract som en del av din kvällsrutin. Reishi stödjer avslappning och sömnkvalitet, medan lion's mane och chaga arbetar med immunförsvaret och inflammationsbalansen under natten.</p>",
      faq: [
        { q: "Hur många timmars sömn behöver huden?", a: "Forskningen pekar på 7–9 timmar för vuxna. Under den tiden genomgår huden fullständiga reparationscykler. Färre än sex timmar per natt visar konsekvent negativa effekter på hudens barriärfunktion och åldrande." },
        { q: "Hjälper CBD mot sömnproblem?", a: "CBD interagerar med receptorer som reglerar sömn-vakenhetscykeln. Många användare rapporterar bättre sömnkvalitet, även om effekten varierar. CBD ersätter inte sömnhygien, men kan vara ett komplement." },
        { q: "Ska jag applicera CBD-serum innan jag sover?", a: "Absolut. Natten är optimal för aktiva ingredienser eftersom huden är i reparationsläge och blodflödet är förhöjt. Applicera Ta-Da Serum som sista steg i din kvällsrutin." },
        { q: "Kan örngottet påverka min hud?", a: "Ja. Bomulls- och silkesörngott i naturmaterial är bäst. Byt minst två gånger per vecka. Syntetmaterial kan fånga värme och fukt som skapar en grogrund för bakterier." }
      ],
      ctaTitle: "Sov dig till bättre hud",
      ctaSub: "Nattens reparation är gratis – men rätt hudvård innan du somnar gör den oändligt mycket effektivare."
    },
    en: {
      metaTitle: "Sleep and skin – why sleep deprivation shows on your face",
      metaDescription: "Poor sleep ages your skin faster than sun damage. Learn how sleep repairs skin at night and how to optimize your beauty sleep. 1753 SKINCARE.",
      kicker: "Lifestyle & Skin",
      h1: "Sleep and skin – your most important skincare routine happens in bed",
      lead: "No serum in the world can compensate for sleep deprivation. At night, your skin repairs, renews, and detoxifies itself. Disrupt that process and you pay with wrinkles, dark circles, and a complexion that never quite wakes up.",
      problemTitle: "What happens to your skin while you sleep?",
      problemBody: "<p>Between 11 PM and 3 AM, your body reaches its deepest sleep phases, and that's when the magic happens. Growth hormone (HGH) is released in pulses, kickstarting cell division and collagen synthesis. Blood flow to the skin increases by up to 25 percent, and damaged cells are repaired at a rate that's impossible during the day.</p><p>Sleep deprivation sabotages this entire process. After just one night of fewer than six hours, cortisol levels rise, the skin barrier weakens, and transepidermal water loss (TEWL) increases – your skin literally leaks moisture. Chronic sleep deprivation accelerates skin aging by a factor that researchers at University Hospitals Case Medical Center estimate at 30 percent faster compared to those sleeping 7–9 hours.</p><p>It shows. Studies using facial recognition demonstrate that observers consistently rate sleep-deprived individuals as sicker, sadder, and less attractive. Dark circles, drooping corners of the mouth, paler complexion. It's not called beauty sleep without reason.</p>",
      tipsTitle: "Optimize your sleep for better skin",
      tips: [
        { title: "Keep consistent hours", body: "Go to bed and wake up at the same time every day – even on weekends. Your circadian clock controls when your skin repairs itself, and irregular schedules throw the entire system off balance." },
        { title: "Make your bedroom pitch dark", body: "Even small light sources – standby lights, streetlights through curtains – disrupt melatonin production. Invest in blackout curtains or a sleep mask. Melatonin is also a potent antioxidant for the skin." },
        { title: "Lower the temperature", body: "The optimal bedroom is 16–18°C (60–65°F). Your body needs to drop its core temperature to fall asleep, and a cool room makes that easier. Bonus: cooler temperatures reduce nighttime sweating that can irritate skin." },
        { title: "Avoid screens the last hour", body: "Blue light from phones and computers delays melatonin release by up to 90 minutes. Switch to a book, stretching, or a calm evening skincare routine instead." },
        { title: "Support sleep with adaptogens", body: "Reishi mushroom is traditionally called the sleep mushroom and has shown improved sleep quality in studies. Our Fungtastic Mushroom Extract contains reishi alongside lion's mane and chaga." }
      ],
      solutionTitle: "Nighttime skincare with CBD",
      solutionBody: "<p>Night is the perfect time to give your skin CBD. During sleep, the skin is most receptive to active ingredients, and blood flow to the skin peaks. CBD's anti-inflammatory properties work in synergy with the body's natural repair processes, helping the skin recover more effectively.</p><p>Our Ta-Da Serum applied before sleep gives your skin a concentrated dose of CBD that works in sync with the night's repair cycle. Duo Ta-Da adds a protective oil layer that reduces transepidermal water loss – especially important if you sleep in dry environments or with the heating on in winter.</p><p>Add Fungtastic Mushroom Extract as part of your evening routine. Reishi supports relaxation and sleep quality, while lion's mane and chaga work on immune function and inflammatory balance throughout the night.</p>",
      faq: [
        { q: "How many hours of sleep does skin need?", a: "Research points to 7–9 hours for adults. During that time, the skin completes full repair cycles. Fewer than six hours per night consistently shows negative effects on skin barrier function and aging." },
        { q: "Does CBD help with sleep problems?", a: "CBD interacts with receptors that regulate the sleep-wake cycle. Many users report better sleep quality, though effects vary. CBD doesn't replace sleep hygiene, but it can be a complement." },
        { q: "Should I apply CBD serum before sleeping?", a: "Absolutely. Night is optimal for active ingredients because the skin is in repair mode and blood flow is elevated. Apply Ta-Da Serum as the last step in your evening routine." },
        { q: "Can my pillowcase affect my skin?", a: "Yes. Cotton and silk pillowcases in natural materials work best. Change at least twice per week. Synthetic materials can trap heat and moisture, creating a breeding ground for bacteria." }
      ],
      ctaTitle: "Sleep your way to better skin",
      ctaSub: "The night's repair is free – but the right skincare before you fall asleep makes it infinitely more effective."
    }
  },
  {
    svSlug: "kost-och-huden",
    enSlug: "diet-and-skin",
    category: "lifestyle",
    productIds: ["duo-ta-da", "ta-da-serum", "duo-kit"],
    sv: {
      metaTitle: "Kost och huden – maten som ger dig bättre hy",
      metaDescription: "Din hud speglar din tallrik. Lär dig vilka livsmedel som ger lyster och vilka som saboterar din hy. Vetenskapligt grundad guide från 1753 SKINCARE.",
      kicker: "Livsstil & Hud",
      h1: "Kost och huden – du är bokstavligen vad du äter",
      lead: "Varje hudcell du har idag byggdes av det du åt för några månader sedan. Kollagen kräver C-vitamin. Cellmembran behöver omega-3. Hudbarriären vill ha zink. Det du lägger på tallriken är den mest underskattade hudvårdsrutinen som finns.",
      problemTitle: "Hur påverkar maten huden?",
      problemBody: "<p>Huden är ett metaboliskt aktivt organ som kräver en konstant ström av näringsämnen för att fungera. Varje dag förnyas miljontals hudceller, och råmaterialet kommer uteslutande från det du äter och dricker. När kosten brister märks det – först långsamt, sedan obönhörligt.</p><p>Den västerländska kosten, rik på raffinerat socker, bearbetade vegetabiliska oljor och ultraprocessad mat, driver systemisk inflammation som manifesterar sig i huden. Högt glykemiskt index höjer insulin och IGF-1, vilket stimulerar talgproduktion och cellproliferation – en perfekt storm för akne. Mejeriprodukter, särskilt skummjölk, har i epidemiologiska studier kopplats till ökad akneförekomst, troligen via hormonella signalvägar.</p><p>Samtidigt saknar många essentiella fettsyror, antioxidanter och mineraler. Zinkbrist är kopplat till akne och försämrad sårläkning. Låga nivåer av omega-3 ger en torrare, mer inflammerad hud. Vitamin A-brist påverkar cellförnyelsen. Huden berättar sanningen om din kost – den kan inte ljuga.</p>",
      tipsTitle: "Mat som ger huden lyster",
      tips: [
        { title: "Ät regnbågens färger", body: "Röda, orange, gröna och lila grönsaker och bär är fulla av antioxidanter som skyddar hudcellerna mot oxidativ stress. Betakaroten från sötpotatis och morötter ger dessutom en naturlig, frisk lyster." },
        { title: "Prioritera omega-3", body: "Fet fisk, valnötter, linfrön och chifrön levererar de essentiella fettsyror som bygger starka cellmembran. Omega-3 är direkt antiinflammatoriskt och hjälper huden behålla fukt och elasticitet." },
        { title: "Minska socker och vitt mjöl", body: "Snabba kolhydrater triggar glykeringprocesser där sockermolekyler binder till kollagen och gör det styvt och sprött. Det kallas AGEs (advanced glycation end-products) och det åldrar huden inifrån." },
        { title: "Ät fermenterat dagligen", body: "Surkål, kimchi, kefir och kombucha matar de goda tarmbakterierna som via tarm-hud-axeln direkt påverkar hudens inflammationsnivå. En frisk tarm ger en friskare hud." },
        { title: "Drick tillräckligt med vatten", body: "Huden består till 64 procent av vatten. Kronisk mild uttorkning gör huden mattare och mindre elastisk. Sikta på 2–3 liter per dag, mer om du tränar eller dricker kaffe." }
      ],
      solutionTitle: "CBD och näring – en dubbel strategi",
      solutionBody: "<p>Medan kosten bygger hudcellerna inifrån jobbar CBD med att skydda dem utifrån. Endocannabinoidsystemet reglerar inflammation, talgproduktion och cellförnyelse – processer som direkt påverkas av vad du äter. CBD stödjer det systemet och hjälper huden hantera de inflammatoriska signaler som en imperfekt kost ibland skickar.</p><p>Ta-Da Serum med 10% CBD levererar antiinflammatoriskt skydd direkt till huden och stärker barriärfunktionen. Duo Ta-Da kombinerar serum och olja för att säkerställa att huden får både aktiva ingredienser och lipider som stärker cellmembranen – precis som omega-3 gör inifrån.</p><p>Det handlar om synergi. Bra kost ger huden råmaterialet den behöver. CBD ger den balansen den förtjänar. Tillsammans blir effekten större än delarna var för sig.</p>",
      faq: [
        { q: "Vilken mat är sämst för huden?", a: "Raffinerat socker, ultraprocessad mat och industriella vegetabiliska oljor toppar listan. De driver inflammation, glykering och oxidativ stress – tre processer som direkt åldrar och skadar huden." },
        { q: "Kan kost verkligen förbättra akne?", a: "Ja. Studier visar att en lågglykemisk kost rik på grönsaker, protein och bra fett kan minska akne med upp till 50 procent efter 12 veckor. Det ersätter inte hudvård, men det ger en kraftfull grund." },
        { q: "Hur lång tid tar det att se resultat?", a: "Hudceller förnyas på cirka 28 dagar, men djupare förändringar i kollagenkvalitet och inflammationsnivå tar 2–3 månader. Ge det tid – du bygger ny hud från grunden." },
        { q: "Ska jag ta kosttillskott för huden?", a: "Helst ska du få näringen från mat. Men zink, omega-3 och vitamin D är tre tillskott som forskningen ger starkt stöd för vid hudproblem. Prata med en kunnig vårdgivare om du är osäker." }
      ],
      ctaTitle: "Bygg bättre hud inifrån och ut",
      ctaSub: "Tallriken är grunden. CBD-hudvården är förstärkningen. Tillsammans ger de din hud allt den behöver."
    },
    en: {
      metaTitle: "Diet and skin – the food that gives you better skin",
      metaDescription: "Your skin mirrors your plate. Learn which foods give you radiance and which sabotage your complexion. Science-based guide from 1753 SKINCARE.",
      kicker: "Lifestyle & Skin",
      h1: "Diet and skin – you literally are what you eat",
      lead: "Every skin cell you have today was built from what you ate a few months ago. Collagen requires vitamin C. Cell membranes need omega-3. The skin barrier wants zinc. What you put on your plate is the most underrated skincare routine in existence.",
      problemTitle: "How does food affect the skin?",
      problemBody: "<p>The skin is a metabolically active organ requiring a constant stream of nutrients to function. Every day, millions of skin cells are renewed, and the raw material comes exclusively from what you eat and drink. When the diet falls short, it shows – first slowly, then relentlessly.</p><p>The Western diet, rich in refined sugar, processed vegetable oils, and ultra-processed food, drives systemic inflammation that manifests in the skin. High glycemic index raises insulin and IGF-1, stimulating oil production and cell proliferation – a perfect storm for acne. Dairy, particularly skim milk, has been linked to increased acne in epidemiological studies, likely through hormonal signaling pathways.</p><p>At the same time, many people lack essential fatty acids, antioxidants, and minerals. Zinc deficiency is linked to acne and impaired wound healing. Low omega-3 levels produce drier, more inflamed skin. Vitamin A deficiency affects cell renewal. Your skin tells the truth about your diet – it cannot lie.</p>",
      tipsTitle: "Foods that give your skin radiance",
      tips: [
        { title: "Eat the rainbow", body: "Red, orange, green, and purple vegetables and berries are packed with antioxidants that protect skin cells from oxidative stress. Beta-carotene from sweet potatoes and carrots also provides a natural, healthy glow." },
        { title: "Prioritize omega-3", body: "Fatty fish, walnuts, flaxseeds, and chia seeds deliver the essential fatty acids that build strong cell membranes. Omega-3 is directly anti-inflammatory and helps skin retain moisture and elasticity." },
        { title: "Reduce sugar and white flour", body: "Fast carbs trigger glycation processes where sugar molecules bind to collagen, making it stiff and brittle. These are called AGEs (advanced glycation end-products) and they age your skin from the inside." },
        { title: "Eat fermented foods daily", body: "Sauerkraut, kimchi, kefir, and kombucha feed the good gut bacteria that directly affect skin inflammation levels via the gut-skin axis. A healthy gut means healthier skin." },
        { title: "Drink enough water", body: "Skin is 64 percent water. Chronic mild dehydration makes skin duller and less elastic. Aim for 2–3 liters per day, more if you exercise or drink coffee." }
      ],
      solutionTitle: "CBD and nutrition – a dual strategy",
      solutionBody: "<p>While diet builds skin cells from within, CBD works to protect them from the outside. The endocannabinoid system regulates inflammation, oil production, and cell renewal – processes directly influenced by what you eat. CBD supports that system and helps the skin handle the inflammatory signals that an imperfect diet sometimes sends.</p><p>Ta-Da Serum with 10% CBD delivers anti-inflammatory protection directly to the skin and strengthens barrier function. Duo Ta-Da combines serum and oil to ensure the skin receives both active ingredients and lipids that reinforce cell membranes – just like omega-3 does from the inside.</p><p>It's about synergy. Good nutrition gives skin the raw material it needs. CBD gives it the balance it deserves. Together, the effect is greater than the sum of its parts.</p>",
      faq: [
        { q: "What food is worst for skin?", a: "Refined sugar, ultra-processed foods, and industrial vegetable oils top the list. They drive inflammation, glycation, and oxidative stress – three processes that directly age and damage the skin." },
        { q: "Can diet really improve acne?", a: "Yes. Studies show that a low-glycemic diet rich in vegetables, protein, and healthy fats can reduce acne by up to 50 percent after 12 weeks. It doesn't replace skincare, but it provides a powerful foundation." },
        { q: "How long before I see results?", a: "Skin cells renew in about 28 days, but deeper changes in collagen quality and inflammation levels take 2–3 months. Give it time – you're building new skin from scratch." },
        { q: "Should I take supplements for my skin?", a: "Ideally, you should get nutrition from food. But zinc, omega-3, and vitamin D are three supplements with strong research support for skin issues. Talk to a knowledgeable healthcare provider if you're unsure." }
      ],
      ctaTitle: "Build better skin from the inside out",
      ctaSub: "Your plate is the foundation. CBD skincare is the amplifier. Together, they give your skin everything it needs."
    }
  },
  {
    svSlug: "hormoner-och-huden",
    enSlug: "hormones-and-skin",
    category: "lifestyle",
    productIds: ["duo-ta-da", "ta-da-serum", "duo-kit"],
    sv: {
      metaTitle: "Hormoner och huden – så styr dina hormoner din hy",
      metaDescription: "Akne, torrhet, pigmentfläckar – hormoner ligger bakom mer än du tror. Förstå kopplingen mellan hormoner och hud. 1753 SKINCARE.",
      kicker: "Livsstil & Hud",
      h1: "Hormoner och huden – det osynliga styrkortet bakom din hy",
      lead: "Varje gång din hy förändras utan uppenbar anledning – utbrott innan mens, plötslig torrhet, pigmentförändringar – är det med stor sannolikhet hormonerna som styr. De är hudens dolda dirigenter, och att förstå dem är nyckeln till att sluta jaga symtom.",
      problemTitle: "Hur påverkar hormoner huden?",
      problemBody: "<p>Huden är ett hormonellt målorgan. Den har receptorer för östrogen, progesteron, testosteron, kortisol, tyreoideahormoner och insulin – och den svarar på varje fluktuation. Under puberteten är det androgener som triggar akne. Under menscykeln styr östrogen och progesteron talgproduktion, vattenretention och inflammationskänslighet vecka för vecka.</p><p>Under graviditet kan melasma (pigmentfläckar) uppstå när melanocyterna överstimuleras av östrogen. I perimenopaus sjunker östrogenproduktionen gradvis, vilket leder till tunnare hud, minskad kollagensyntes och ökad torrhet. Män med fallande testosteron efter 40 tappar hudens tjocklek och elasticitet. PCOS, sköldkörtelrubbningar och insulinresistens är alla hormonella tillstånd som tydligt manifesterar sig i huden.</p><p>Problemet med konventionell hudvård? Den behandlar huden som om den existerar i ett vakuum. Men huden är en del av ett endokrint system i ständig rörelse. Utan att adressera den hormonella balansen reparerar du fasaden medan grunden svajar.</p>",
      tipsTitle: "Stöd din hormonella balans naturligt",
      tips: [
        { title: "Sov 7–9 timmar", body: "Sömn är kritisk för hormontillverkning. Tillväxthormon, melatonin och könshormoner produceras huvudsakligen under natten. Dålig sömn ger kortisolöverskott och hormonkaos som syns direkt i huden." },
        { title: "Balansera blodsockret", body: "Insulintoppar driver androgenproduktion och förvärrar hormonell akne. Ät protein och fett till varje måltid, undvik snabba kolhydrater på tom mage. Stabilt blodsocker betyder stabilare hormoner." },
        { title: "Rör dig rätt", body: "Måttlig träning balanserar östrogen, sänker kortisol och förbättrar insulinkänslighet. Överträning gör tvärtemot – den stressar kroppen och kan störa menscykeln. Lyssna på kroppen." },
        { title: "Hantera xenoöstrogener", body: "Plastförpackningar, konventionell kosmetika och bekämpningsmedel innehåller ämnen som härmar östrogen i kroppen. Byt till glas, välj naturliga produkter och ät ekologiskt när det är möjligt." },
        { title: "Anpassa hudvården efter cykeln", body: "Vecka 1–2 av menscykeln (follikelfas) tål huden mer aktiva ingredienser. Vecka 3–4 (lutealfas) behöver den mer mildhet och barriärstöd. Lyssna istället för att tvinga." }
      ],
      solutionTitle: "CBD och hormonell hudbalans",
      solutionBody: "<p>Endocannabinoidsystemet (ECS) har en nära koppling till det endokrina systemet. ECS-receptorer finns i binjurarna, äggstockarna, sköldkörteln och hypofysen – alla centrala för hormonproduktion. CBD interagerar med ECS och kan bidra till en jämnare signalering mellan dessa organ och huden.</p><p>För hormonell akne, där androgener driver talgöverproduktion, erbjuder CBD sebostatiska egenskaper som reglerar talgkörtlarna utan att torka ut huden. Ta-Da Serum applicerat dagligen ger ett konsekvent antiinflammatoriskt stöd genom hela menscykeln, medan Duo Ta-Da ger extra barriärskydd under lutealfasen när huden är som mest reaktiv.</p><p>Duo-kit med The ONE och I LOVE passar den som vill ha en komplett rutin som adresserar både inflammation och talgbalans – särskilt värdefullt vid PCOS-relaterad akne och perimenopausala hudförändringar.</p>",
      faq: [
        { q: "Varför får jag akne innan mens?", a: "I lutealfasen (vecka 3–4) sjunker östrogen och progesteron stiger, vilket ökar talgproduktionen. Samtidigt är huden mer inflammationskänslig. Det är en hormonell cocktail som ger utbrott, inte brist på rengöring." },
        { q: "Kan CBD balansera hormoner?", a: "CBD påverkar inte hormonnivåerna direkt, men genom att stödja endocannabinoidsystemet kan det hjälpa kroppen att hantera hormonella fluktuationer bättre. Det är ett indirekt men meningsfullt stöd." },
        { q: "Hjälper CBD vid menopausala hudförändringar?", a: "Ja, CBD:s fuktande och antiinflammatoriska egenskaper adresserar de vanligaste problemen – torrhet, tunnare hud och ökad känslighet. Det ersätter inte hormonbehandling men stödjer huden direkt." },
        { q: "Ska jag byta hudvårdsprodukter under menscykeln?", a: "Du behöver inte byta hela rutinen, men anpassa. Mer aktiva ingredienser i follikelfasen, mer mildhet och barriärstöd i lutealfasen. CBD-serum fungerar genom hela cykeln tack vare sin balanserande verkan." }
      ],
      ctaTitle: "Förstå dina hormoner, förstå din hud",
      ctaSub: "Sluta skylla på dig själv. Dina hormoner är mäktiga – men med rätt kunskap och rätt stöd behöver huden inte lida av dem."
    },
    en: {
      metaTitle: "Hormones and skin – how your hormones control your complexion",
      metaDescription: "Acne, dryness, pigmentation – hormones are behind more than you think. Understand the connection between hormones and skin. 1753 SKINCARE.",
      kicker: "Lifestyle & Skin",
      h1: "Hormones and skin – the hidden drivers behind your complexion",
      lead: "Every time your skin changes without obvious reason – breakouts before your period, sudden dryness, pigment shifts – it's most likely hormones pulling the strings. They are your skin's hidden conductors, and understanding them is the key to stop chasing symptoms.",
      problemTitle: "How do hormones affect the skin?",
      problemBody: "<p>The skin is a hormonal target organ. It has receptors for estrogen, progesterone, testosterone, cortisol, thyroid hormones, and insulin – and it responds to every fluctuation. During puberty, androgens trigger acne. Throughout the menstrual cycle, estrogen and progesterone control oil production, water retention, and inflammation sensitivity week by week.</p><p>During pregnancy, melasma (dark patches) can occur when melanocytes are overstimulated by estrogen. In perimenopause, estrogen production gradually declines, leading to thinner skin, decreased collagen synthesis, and increased dryness. Men with declining testosterone after 40 lose skin thickness and elasticity. PCOS, thyroid disorders, and insulin resistance are all hormonal conditions that clearly manifest in the skin.</p><p>The problem with conventional skincare? It treats the skin as if it exists in a vacuum. But the skin is part of an endocrine system in constant motion. Without addressing hormonal balance, you're repairing the facade while the foundation sways.</p>",
      tipsTitle: "Support your hormonal balance naturally",
      tips: [
        { title: "Sleep 7–9 hours", body: "Sleep is critical for hormone production. Growth hormone, melatonin, and sex hormones are produced mainly at night. Poor sleep creates cortisol excess and hormonal chaos that shows directly in the skin." },
        { title: "Balance your blood sugar", body: "Insulin spikes drive androgen production and worsen hormonal acne. Eat protein and fat with every meal, avoid fast carbs on an empty stomach. Stable blood sugar means more stable hormones." },
        { title: "Exercise right", body: "Moderate exercise balances estrogen, lowers cortisol, and improves insulin sensitivity. Overtraining does the opposite – it stresses the body and can disrupt the menstrual cycle. Listen to your body." },
        { title: "Manage xenoestrogens", body: "Plastic packaging, conventional cosmetics, and pesticides contain substances that mimic estrogen in the body. Switch to glass, choose natural products, and eat organic when possible." },
        { title: "Adapt skincare to your cycle", body: "Weeks 1–2 of the menstrual cycle (follicular phase) allow the skin to tolerate more active ingredients. Weeks 3–4 (luteal phase) call for more gentleness and barrier support. Listen instead of forcing." }
      ],
      solutionTitle: "CBD and hormonal skin balance",
      solutionBody: "<p>The endocannabinoid system (ECS) is closely connected to the endocrine system. ECS receptors are found in the adrenal glands, ovaries, thyroid, and pituitary – all central to hormone production. CBD interacts with the ECS and may contribute to smoother signaling between these organs and the skin.</p><p>For hormonal acne, where androgens drive excess oil production, CBD offers sebostatic properties that regulate the sebaceous glands without drying out the skin. Ta-Da Serum applied daily provides consistent anti-inflammatory support throughout the menstrual cycle, while Duo Ta-Da offers extra barrier protection during the luteal phase when skin is most reactive.</p><p>The Duo-kit with The ONE and I LOVE suits those wanting a complete routine addressing both inflammation and oil balance – particularly valuable for PCOS-related acne and perimenopausal skin changes.</p>",
      faq: [
        { q: "Why do I break out before my period?", a: "In the luteal phase (weeks 3–4), estrogen drops and progesterone rises, increasing oil production. At the same time, the skin becomes more inflammation-sensitive. It's a hormonal cocktail causing breakouts, not a lack of cleansing." },
        { q: "Can CBD balance hormones?", a: "CBD doesn't directly affect hormone levels, but by supporting the endocannabinoid system, it can help the body manage hormonal fluctuations better. It's an indirect but meaningful support." },
        { q: "Does CBD help with menopausal skin changes?", a: "Yes, CBD's moisturizing and anti-inflammatory properties address the most common issues – dryness, thinning skin, and increased sensitivity. It doesn't replace hormone therapy but supports the skin directly." },
        { q: "Should I change skincare products during my cycle?", a: "You don't need to overhaul your entire routine, but adapt. More active ingredients during the follicular phase, more gentleness and barrier support during the luteal phase. CBD serum works throughout the cycle thanks to its balancing action." }
      ],
      ctaTitle: "Understand your hormones, understand your skin",
      ctaSub: "Stop blaming yourself. Your hormones are powerful – but with the right knowledge and support, your skin doesn't have to suffer from them."
    }
  },
  {
    svSlug: "tarmhalsa-och-huden",
    enSlug: "gut-health-and-skin",
    category: "lifestyle",
    productIds: ["fungtastic-mushroom-extract", "duo-ta-da", "ta-da-serum"],
    sv: {
      metaTitle: "Tarmhälsa och huden – tarm-hud-axeln förklarad",
      metaDescription: "Tarmen och huden pratar med varandra. Lär dig hur tarmfloran styr inflammation, akne och hudens lyster. Komplett guide från 1753 SKINCARE.",
      kicker: "Livsstil & Hud",
      h1: "Tarmhälsa och huden – allt börjar i magen",
      lead: "Forskarna kallar det tarm-hud-axeln – en direkt kommunikationsväg mellan din tarmflora och din hy. En obalanserad tarm skickar inflammatoriska signaler som huden inte kan ignorera. Vill du fixa huden? Börja med magen.",
      problemTitle: "Hur är tarmen kopplad till huden?",
      problemBody: "<p>Tarmen och huden delar ett embryonalt ursprung och kommunicerar via tre parallella vägar: immunsystemet, nervsystemet och blodomloppet. Din tarmflora – de biljoner bakterier som lever i mag-tarmkanalen – producerar signalsubstanser som direkt påverkar inflammation, immunsvar och till och med hudens talgproduktion.</p><p>När tarmfloran är i obalans, ett tillstånd som kallas dysbios, ökar tarmens genomsläpplighet. Bakteriefragment och inflammatoriska molekyler läcker ut i blodet och når huden, där de triggar immunreaktioner. Det kan manifestera sig som akne, eksem, rosacea eller psoriasis. Studier visar att personer med akne har en signifikant annorlunda tarmflora än de utan.</p><p>SIBO (bakteriell överväxt i tunntarmen) är kopplat till rosacea. IBS-patienter har högre förekomst av hudproblem. Antibiotikaanvändning, stress, dålig kost och brist på fiber matar alla en ond cirkel där tarmen försämras och huden betalar priset. Det är inte en slump att hudproblem ofta samexisterar med magbesvär.</p>",
      tipsTitle: "Bygg en friskare tarm för friskare hud",
      tips: [
        { title: "Ät 30 olika växter i veckan", body: "Mångfald i kosten ger mångfald i tarmfloran. Räkna grönsaker, frukter, bönor, nötter, frön och kryddor. Varje unik växt matar olika bakteriestammar som alla bidrar till en balanserad tarm." },
        { title: "Fermenterade livsmedel dagligen", body: "Surkål, kimchi, kefir, yoghurt och miso tillför levande bakterier till tarmen. En daglig portion kan öka mikrobiomdiversiteten och sänka inflammationsmarkörer mätbart inom veckor." },
        { title: "Prebiotiska fibrer", body: "Lök, vitlök, purjolök, bananer, havre och jordärtskockor innehåller fibrer som specifikt matar de goda bakterierna. Det är inte nog att tillföra bakterier – de behöver mat för att överleva och frodas." },
        { title: "Undvik onödig antibiotika", body: "En antibiotikakur kan slå ut tarmfloran i månader. Använd bara när det är medicinskt nödvändigt, och komplettera alltid med probiotika efteråt. Din hud kan reagera på en antibiotikakur långt efter att den är avslutad." },
        { title: "Svampextrakt för tarmbalans", body: "Medicinska svampar som lion's mane och chaga har visat prebiotikaeffekter och stödjer tarmslemhinnans integritet. Vår Fungtastic Mushroom Extract kombinerar tre svampar som adresserar tarmhälsa från flera håll." },
        { title: "Hantera stress", body: "Tarmen har sitt eget nervsystem med 500 miljoner nervceller. Stress påverkar tarmrörelserna, genomsläppligheten och sammansättningen av tarmfloran direkt via vagusnerven. Stresshantering är tarmvård." }
      ],
      solutionTitle: "Så stödjer våra produkter tarm-hud-axeln",
      solutionBody: "<p>Fungtastic Mushroom Extract är framtagen specifikt för den som förstår att huden börjar i magen. Lion's mane stödjer tarmslemhinnan och har visat antiinflammatoriska egenskaper i mag-tarmkanalen. Chaga är en kraftfull antioxidant som skyddar cellerna mot oxidativ stress. Reishi balanserar immunförsvaret – direkt relevant eftersom 70 procent av immunsystemet sitter i tarmen.</p><p>Utifrån ger Ta-Da Serum med 10% CBD huden det antiinflammatoriska stöd den behöver medan du bygger upp tarmhälsan inifrån. CBD interagerar med CB2-receptorer i huden och hjälper till att dämpa de inflammatoriska signaler som en obalanserad tarm skickar. Duo Ta-Da adderar barriärskydd med sin oljekomponent.</p><p>Att jobba med tarm-hud-axeln kräver tålamod – 8–12 veckor för märkbar förändring. Men det är den mest hållbara vägen till frisk hud vi känner till.</p>",
      faq: [
        { q: "Kan tarmhälsa verkligen påverka akne?", a: "Absolut. Studier visar att personer med akne ofta har lägre mikrobiomdiversitet och högre nivåer av inflammatoriska tarmbakterier. Probiotika har i kontrollerade studier visat sig minska aknelesioner signifikant." },
        { q: "Hur lång tid tar det att förbättra tarmfloran?", a: "Koständringar påverkar tarmfloran inom dagar, men stabila förändringar tar 8–12 veckor av konsekvent insats. Tålamod lönar sig – effekterna på huden kommer gradvis men varaktigt." },
        { q: "Vad gör Fungtastic för tarmen?", a: "Lion's mane stödjer tarmslemhinnans barriär och har visat antiinflammatoriska effekter i studier. Chaga bidrar med antioxidanter, och reishi balanserar immunförsvaret som till stor del styrs från tarmen." },
        { q: "Kan jag ta probiotika och CBD samtidigt?", a: "Ja, de arbetar via olika mekanismer och kompletterar varandra väl. Probiotika adresserar tarmfloran direkt, medan CBD stödjer endocannabinoidsystemet som hjälper kroppen hantera inflammationssignalerna." }
      ],
      ctaTitle: "Börja med magen, se det i ansiktet",
      ctaSub: "Tarm-hud-axeln är inte en trend – det är biologi. Ge tarmen rätt förutsättningar och huden följer efter."
    },
    en: {
      metaTitle: "Gut health and skin – the gut-skin axis explained",
      metaDescription: "Your gut and skin talk to each other. Learn how gut flora controls inflammation, acne, and skin radiance. Complete guide from 1753 SKINCARE.",
      kicker: "Lifestyle & Skin",
      h1: "Gut health and skin – it often starts in the gut",
      lead: "Scientists call it the gut-skin axis – a direct communication pathway between your gut flora and your complexion. An imbalanced gut sends inflammatory signals your skin can't ignore. Want to improve your skin? Start with your gut.",
      problemTitle: "How is the gut connected to the skin?",
      problemBody: "<p>The gut and skin share an embryonic origin and communicate via three parallel pathways: the immune system, the nervous system, and the bloodstream. Your gut microbiome – the trillions of bacteria living in your gastrointestinal tract – produces signaling molecules that directly influence inflammation, immune response, and even the skin's oil production.</p><p>When the gut flora is imbalanced, a condition called dysbiosis, intestinal permeability increases. Bacterial fragments and inflammatory molecules leak into the bloodstream and reach the skin, triggering immune reactions. This can manifest as acne, eczema, rosacea, or psoriasis. Studies show that people with acne have significantly different gut flora compared to those without.</p><p>SIBO (small intestinal bacterial overgrowth) is linked to rosacea. IBS patients have higher rates of skin problems. Antibiotic use, stress, poor diet, and lack of fiber all feed a vicious cycle where the gut deteriorates and the skin pays the price. It's no coincidence that skin problems often coexist with digestive issues.</p>",
      tipsTitle: "Build a healthier gut for healthier skin",
      tips: [
        { title: "Eat 30 different plants per week", body: "Diversity in diet creates diversity in gut flora. Count vegetables, fruits, beans, nuts, seeds, and spices. Each unique plant feeds different bacterial strains that all contribute to a balanced gut." },
        { title: "Fermented foods daily", body: "Sauerkraut, kimchi, kefir, yogurt, and miso introduce live bacteria to the gut. A daily serving can increase microbiome diversity and measurably lower inflammation markers within weeks." },
        { title: "Prebiotic fibers", body: "Onions, garlic, leeks, bananas, oats, and Jerusalem artichokes contain fibers that specifically feed the good bacteria. It's not enough to add bacteria – they need food to survive and thrive." },
        { title: "Avoid unnecessary antibiotics", body: "A course of antibiotics can disrupt gut flora for months. Only use when medically necessary, and always supplement with probiotics afterward. Your skin can react to an antibiotic course long after it's finished." },
        { title: "Mushroom extracts for gut balance", body: "Medicinal mushrooms like lion's mane and chaga have shown prebiotic effects and support intestinal lining integrity. Our Fungtastic Mushroom Extract combines three mushrooms that address gut health from multiple angles." },
        { title: "Manage stress", body: "The gut has its own nervous system with 500 million nerve cells. Stress affects gut motility, permeability, and microbiome composition directly via the vagus nerve. Stress management is gut care." }
      ],
      solutionTitle: "How our products support the gut-skin axis",
      solutionBody: "<p>Fungtastic Mushroom Extract is designed specifically for those who understand that skin starts in the gut. Lion's mane supports the intestinal lining and has shown anti-inflammatory properties in the GI tract. Chaga is a powerful antioxidant that protects cells from oxidative stress. Reishi balances the immune system – directly relevant since 70 percent of the immune system resides in the gut.</p><p>From the outside, Ta-Da Serum with 10% CBD gives the skin the anti-inflammatory support it needs while you build gut health from within. CBD interacts with CB2 receptors in the skin and helps dampen the inflammatory signals an imbalanced gut sends. Duo Ta-Da adds barrier protection with its oil component.</p><p>Working with the gut-skin axis requires patience – 8–12 weeks for noticeable change. But it's the most sustainable path to healthy skin we know of.</p>",
      faq: [
        { q: "Can gut health really affect acne?", a: "Absolutely. Studies show that people with acne often have lower microbiome diversity and higher levels of inflammatory gut bacteria. Probiotics have been shown in controlled studies to significantly reduce acne lesions." },
        { q: "How long does it take to improve gut flora?", a: "Dietary changes affect gut flora within days, but stable changes take 8–12 weeks of consistent effort. Patience pays off – the effects on skin come gradually but lastingly." },
        { q: "What does Fungtastic do for the gut?", a: "Lion's mane supports the intestinal lining barrier and has shown anti-inflammatory effects in studies. Chaga contributes antioxidants, and reishi balances the immune system, which is largely governed from the gut." },
        { q: "Can I take probiotics and CBD at the same time?", a: "Yes, they work through different mechanisms and complement each other well. Probiotics address gut flora directly, while CBD supports the endocannabinoid system that helps the body manage inflammatory signals." }
      ],
      ctaTitle: "Start with your gut, see it in your face",
      ctaSub: "The gut-skin axis isn't a trend – it's biology. Give your gut the right conditions and your skin will follow."
    }
  },
  {
    svSlug: "traning-och-huden",
    enSlug: "exercise-and-skin",
    category: "lifestyle",
    productIds: ["duo-kit", "au-naturel-makeup-remover", "ta-da-serum"],
    sv: {
      metaTitle: "Träning och huden – så påverkar motion ditt utseende",
      metaDescription: "Träning ger huden lyster men kan också ge utbrott. Lär dig hur du tränar smart för bättre hud utan oönskade bieffekter. 1753 SKINCARE.",
      kicker: "Livsstil & Hud",
      h1: "Träning och huden – motion är hudvård inifrån",
      lead: "Ett träningspass ger huden mer än en timmes ansiktsbehandling. Ökat blodflöde, minskad inflammation, bättre sömn. Men gör du det fel kan svetten, friktionen och bakterierna ställa till det. Här är allt du behöver veta.",
      problemTitle: "Hur påverkar träning huden?",
      problemBody: "<p>Under fysisk aktivitet ökar hjärtfrekvensen och blodkärlen vidgas. Blodflödet till huden kan öka med upp till 400 procent, vilket levererar syre och näringsämnen till hudcellerna och fraktar bort avfallsprodukter. Det är som en intern ansiktsbehandling som ingen kräm kan replikera. Regelbunden motion stimulerar dessutom fibroblaster att producera mer kollagen.</p><p>Men träningen har en mörk sida för huden. Svett blandat med bakterier, smink och friktion från kläder och utrustning kan skapa en perfekt grogrund för utbrott. Träningsakne (acne mechanica) uppstår där kläder gnider mot huden – under hjälmar, sportbehåar och på ryggen. Fuktiga miljöer som gym och yogastudios kan förvärra svampinfektioner.</p><p>Överträning är ett annat problem. Extrem fysisk belastning utan tillräcklig återhämtning höjer kortisolnivåerna kroniskt, bryter ner kollagen och sätter immunförsvaret på sparlåga. Det som skulle ge huden lyster ger istället gråhet, trötthet och ökad känslighet. Balans är allt.</p>",
      tipsTitle: "Träna smart för bättre hud",
      tips: [
        { title: "Tvätta ansiktet innan träning", body: "Gå aldrig och träna med smink, solskydd eller dagkräm. Svett blandat med produktrester täpper till porerna och ger utbrott. Tvätta med en mild rengöring eller enbart vatten innan du börjar." },
        { title: "Byt kläder direkt efter", body: "Svettiga kläder mot huden efter träning är en bakteriefest. Byt om så snart du kan – särskilt sportbehå, tights och allt som suttit tätt mot kroppen." },
        { title: "Duscha inom 30 minuter", body: "Svett i sig är inte smutsigt – det är huvudsakligen vatten och salt. Men i kombination med bakterier och talg blir det snabbt problematiskt. En snabb dusch efter träning gör stor skillnad." },
        { title: "Undvik att ta dig i ansiktet", body: "Gym-utrustning bär på mer bakterier än du vill veta. Undvik att röra ansiktet under passet och ha en ren handduk till hands istället." },
        { title: "Hitta din sweet spot", body: "3–5 pass i veckan med blandad intensitet är optimalt. Daglig högintensiv träning utan vila ökar kortisol och motarbetar hudens återhämtning. Inkludera vilopass och lågintensiv rörelse." }
      ],
      solutionTitle: "Hudvård för aktiva – med CBD",
      solutionBody: "<p>Träningshud behöver tre saker: grundlig men mild rengöring, antiinflammatoriskt stöd och barriärreparation. Au Naturel Makeup Remover med MCT-olja löser upp svett, talg och produktrester utan att störa hudbarriären. Det är den perfekta pre-workout-rengöringen och post-workout-återställaren i ett.</p><p>Efter träning, när blodflödet till huden fortfarande är förhöjt och porerna är öppna, är det idealisk tid att applicera aktiva ingredienser. Ta-Da Serum med 10% CBD dämpar den tillfälliga inflammation som träning orsakar och stödjer hudens återhämtning – precis som protein stödjer muskelåterhämtningen.</p><p>Duo-kit med The ONE och I LOVE ger den aktiva livsstilen en komplett hudvårdsrutin som balanserar talgproduktion och stärker barriären. CBD:s sebostatiska effekt är särskilt värdefull för dig som upplever träningsrelaterade utbrott.</p>",
      faq: [
        { q: "Varför får jag utbrott efter träning?", a: "Vanligaste orsakerna: smink under träning, försenad rengöring efter svett, friktion från kläder (acne mechanica), eller bakterier från gym-utrustning. Tvätta ansiktet innan och duscha direkt efter." },
        { q: "Är det bättre att träna med eller utan smink?", a: "Alltid utan. Smink blandat med svett täpper till porerna och skapar en anaerob miljö där bakterier trivs. Om du inte hinner ta bort sminket, använd Au Naturel som snabb rengöring." },
        { q: "Kan träning verkligen förbättra huden?", a: "Ja. Studier visar att regelbunden måttlig motion ökar kollagenproduktion, förbättrar blodcirkulation till huden och sänker systemisk inflammation. Effekten syns oftast efter 4–6 veckors konsekvent träning." },
        { q: "Hur mycket träning är för mycket för huden?", a: "Det varierar, men tecken på överträning inkluderar ökad akne, mörka ringar, grå hy och försenad sårläkning. Om du tränar intensivt dagligen utan vilopass, överväg att dra ner och se om huden förbättras." }
      ],
      ctaTitle: "Tävla hårt, ta hand om huden",
      ctaSub: "Du ger kroppen allt i gymmet. Ge huden samma omsorg efteråt – den förtjänar en lika seriös återhämtning."
    },
    en: {
      metaTitle: "Exercise and skin – how working out affects your appearance",
      metaDescription: "Exercise gives skin radiance but can also cause breakouts. Learn how to train smart for better skin without unwanted side effects. 1753 SKINCARE.",
      kicker: "Lifestyle & Skin",
      h1: "Exercise and skin – working out is skincare from within",
      lead: "A workout gives your skin more than an hour-long facial. Increased blood flow, reduced inflammation, better sleep. But do it wrong and sweat, friction, and bacteria can wreak havoc. Here's everything you need to know.",
      problemTitle: "How does exercise affect the skin?",
      problemBody: "<p>During physical activity, heart rate increases and blood vessels dilate. Blood flow to the skin can increase by up to 400 percent, delivering oxygen and nutrients to skin cells and carrying away waste products. It's like an internal facial that no cream can replicate. Regular exercise also stimulates fibroblasts to produce more collagen.</p><p>But exercise has a dark side for skin. Sweat mixed with bacteria, makeup, and friction from clothing and equipment can create a perfect breeding ground for breakouts. Exercise acne (acne mechanica) occurs where clothing rubs against the skin – under helmets, sports bras, and on the back. Humid environments like gyms and yoga studios can exacerbate fungal infections.</p><p>Overtraining is another problem. Extreme physical stress without adequate recovery chronically elevates cortisol levels, breaks down collagen, and suppresses the immune system. What should give skin radiance instead produces dullness, fatigue, and increased sensitivity. Balance is everything.</p>",
      tipsTitle: "Train smart for better skin",
      tips: [
        { title: "Wash your face before working out", body: "Never exercise with makeup, sunscreen, or day cream on. Sweat mixed with product residue clogs pores and causes breakouts. Cleanse with a mild cleanser or just water before you begin." },
        { title: "Change clothes immediately after", body: "Sweaty clothes against your skin post-workout is a bacteria party. Change as soon as you can – especially sports bras, leggings, and anything that sat tight against the body." },
        { title: "Shower within 30 minutes", body: "Sweat itself isn't dirty – it's mainly water and salt. But combined with bacteria and oil, it quickly becomes problematic. A quick shower after exercise makes a big difference." },
        { title: "Don't touch your face", body: "Gym equipment carries more bacteria than you want to know about. Avoid touching your face during your session and keep a clean towel on hand instead." },
        { title: "Find your sweet spot", body: "3–5 sessions per week with mixed intensity is optimal. Daily high-intensity training without rest increases cortisol and works against skin recovery. Include rest days and low-intensity movement." }
      ],
      solutionTitle: "Skincare for active people – with CBD",
      solutionBody: "<p>Skin around exercise needs three things: thorough but gentle cleansing, anti-inflammatory support, and barrier repair. Au Naturel Makeup Remover with MCT oil dissolves sweat, oil, and product residue without disrupting the skin barrier. It's the perfect pre-workout cleanse and post-workout reset in one.</p><p>After exercise, when blood flow to the skin is still elevated and pores are open, it's the ideal time to apply active ingredients. Ta-Da Serum with 10% CBD calms the temporary inflammation exercise causes and supports the skin's recovery – just like protein supports muscle recovery.</p><p>The Duo-kit with The ONE and I LOVE gives an active lifestyle a complete skincare routine that balances oil production and strengthens the barrier. CBD's sebostatic effect is particularly valuable for those experiencing exercise-related breakouts.</p>",
      faq: [
        { q: "Why do I break out after working out?", a: "Most common causes: makeup during exercise, delayed cleansing after sweating, friction from clothing (acne mechanica), or bacteria from gym equipment. Wash your face before and shower right after." },
        { q: "Is it better to work out with or without makeup?", a: "Always without. Makeup mixed with sweat clogs pores and creates an anaerobic environment where bacteria thrive. If you can't remove makeup in time, use Au Naturel as a quick cleanse." },
        { q: "Can exercise really improve skin?", a: "Yes. Studies show that regular moderate exercise increases collagen production, improves blood circulation to the skin, and lowers systemic inflammation. Effects typically become visible after 4–6 weeks of consistent training." },
        { q: "How much exercise is too much for skin?", a: "It varies, but signs of overtraining include increased acne, dark circles, dull complexion, and delayed wound healing. If you train intensely daily without rest days, consider scaling back and see if your skin improves." }
      ],
      ctaTitle: "Train hard, take care of your skin",
      ctaSub: "You give your body everything in the gym. Give your skin the same attention afterward – it deserves an equally serious recovery."
    }
  },
  {
    svSlug: "solskydd-och-hudvard",
    enSlug: "sun-protection-skincare",
    category: "lifestyle",
    productIds: ["duo-ta-da", "ta-da-serum", "au-naturel-makeup-remover"],
    sv: {
      metaTitle: "Solskydd och hudvård – skydda huden utan att skada den",
      metaDescription: "Solen åldrar huden mer än något annat. Lär dig hur du skyddar dig smart och reparerar solskadad hud naturligt. 1753 SKINCARE.",
      kicker: "Livsstil & Hud",
      h1: "Solskydd och hudvård – den enda anti-aging du verkligen behöver",
      lead: "UV-strålning står för upp till 80 procent av hudens synliga åldrande. Rynkor, pigmentfläckar, slapphet – solen är den största boven. Men det handlar inte om att gömma sig inomhus. Det handlar om att vara smart.",
      problemTitle: "Vad gör solen med huden?",
      problemBody: "<p>Solens UV-strålning kommer i två huvudtyper: UVA och UVB. UVB orsakar solbränna och skador i hudens yttre lager. UVA penetrerar djupare och bryter ner kollagen och elastin i dermis – det är den som ger rynkor, fina linjer och pigmentförändringar. UVA når dig även genom molntäcke och fönsterglas, året om.</p><p>Fotoåldrande, som det kallas, är en kumulativ process. Varje minut i solen utan skydd adderar till den totala exponeringen. DNA-skador ackumuleras i hudcellerna, och kroppens reparationsmekanismer hinner till slut inte med. Resultatet syns ofta först efter 10–20 år – men då är skadan redan gjord.</p><p>Paradoxen är att solen också är livsviktig. D-vitamin, som produceras i huden vid UVB-exponering, är avgörande för immunförsvar, benhälsa och humör. Att aldrig gå ut i solen är inte lösningen. Men att exponera sig oförsiktigt – eller förlita sig enbart på kemiskt solskydd med ifrågasatt innehåll – är inte heller svaret.</p>",
      tipsTitle: "Smart solstrategi för hudens skull",
      tips: [
        { title: "Mineraliskt solskydd framför kemiskt", body: "Zinkoxid och titandioxid ligger ovanpå huden och reflekterar UV istället för att absorbera det. De bryts inte ner i solen, irriterar sällan känslig hud och innehåller inga hormonstörande ämnen som oxybenzon." },
        { title: "Undvik solen 11–15", body: "Mitt på dagen är UV-index som starkast. Planera utomhusaktiviteter till morgon och eftermiddag. Det räcker med 15–20 minuters exponering av underarmar och ansikte för att producera D-vitamin." },
        { title: "Hatt och kläder först", body: "Fysiskt solskydd är alltid överlägset kemiskt. En bredbrättad hatt skyddar ansikte, nacke och öron. Täta tyger med UPF-klassning blockerar UV effektivare än någon kräm." },
        { title: "Applicera tillräckligt", body: "De flesta applicerar bara 25–50 procent av rekommenderad mängd solskydd. Ansiktet kräver en halv tesked, och du behöver applicera om varannan timme vid utomhusvistelse – oftare om du svettas eller badar." },
        { title: "Antioxidanter stärker solskyddet", body: "C-vitamin, E-vitamin och niacinamid applicerade under solskyddet ger ett extra lager skydd mot fria radikaler som UV-strålning skapar. De ersätter inte solskydd men förstärker det." }
      ],
      solutionTitle: "Reparera solskadad hud med CBD",
      solutionBody: "<p>Även med det bästa solskyddet når viss UV-strålning huden och skapar fria radikaler och inflammation. Det är här CBD kommer in som en kraftfull allierad. Studier visar att cannabinoider har antioxidativa egenskaper som neutraliserar fria radikaler och minskar UV-inducerad inflammatorisk respons i hudceller.</p><p>Ta-Da Serum med 10% CBD applicerat efter solexponering hjälper huden att hantera den oxidativa stressen och stödjer reparationsprocessen. CBD:s antiinflammatoriska verkan är särskilt värdefull för solkänslig hud som tenderar att rodna och reagera. Duo Ta-Da adderar en oljekomponent som återställer lipidbarriären som UV kan ha försvagat.</p><p>Au Naturel Makeup Remover är perfekt för att milt avlägsna solskydd på kvällen utan att stressa en redan solexponerad hud. MCT-oljan löser upp mineraliskt solskydd effektivt samtidigt som den vårdar.</p>",
      faq: [
        { q: "Behöver jag solskydd varje dag?", a: "Under svenska vinterhalvåret (oktober–mars) är UV-index för lågt för att orsaka solskador i vardagen. Under sommarhalvåret, ja – dagligen om du är utomhus mer än 15 minuter. Molnigt väder blockerar inte UVA." },
        { q: "Kan CBD ersätta solskydd?", a: "Nej, absolut inte. CBD har antioxidativa egenskaper som kompletterar solskydd, men det filtrerar inte UV-strålning. Använd alltid solskydd som primärt skydd och CBD-hudvård som reparation och förstärkning." },
        { q: "Är kemiskt solskydd farligt?", a: "Ämnen som oxybenzon och octinoxat har visat hormonstörande egenskaper i studier och absorberas i blodet. Mineraliskt solskydd (zinkoxid) är generellt ett säkrare val, särskilt för känslig hud och daglig användning." },
        { q: "Hur reparerar jag redan solskadad hud?", a: "Solskada är kumulativ men huden har förmåga att reparera sig. Antioxidanter (C-vitamin, CBD), retinol och konsekvent solskydd framöver bromsar ytterligare skada. Djupare skador kan kräva professionell behandling." }
      ],
      ctaTitle: "Skydda idag, reparera ikväll",
      ctaSub: "Solen är inte din fiende – men den kräver respekt. Solskydd på morgonen, CBD-återhämtning på kvällen."
    },
    en: {
      metaTitle: "Sun protection and skincare – protect your skin without harming it",
      metaDescription: "The sun ages your skin more than anything else. Learn how to protect yourself smartly and repair sun-damaged skin naturally. 1753 SKINCARE.",
      kicker: "Lifestyle & Skin",
      h1: "Sun protection and skincare – the only anti-aging you truly need",
      lead: "UV radiation accounts for up to 80 percent of visible skin aging. Wrinkles, dark spots, sagging – the sun is the biggest culprit. But it's not about hiding indoors. It's about being smart.",
      problemTitle: "What does the sun do to your skin?",
      problemBody: "<p>The sun's UV radiation comes in two main types: UVA and UVB. UVB causes sunburn and damage to the skin's outer layers. UVA penetrates deeper, breaking down collagen and elastin in the dermis – that's what gives you wrinkles, fine lines, and pigmentation changes. UVA reaches you even through cloud cover and window glass, year-round.</p><p>Photoaging, as it's called, is a cumulative process. Every minute in the sun without protection adds to the total exposure. DNA damage accumulates in skin cells, and eventually the body's repair mechanisms can't keep up. The results often don't show until 10–20 years later – but by then the damage is already done.</p><p>The paradox is that the sun is also vital. Vitamin D, produced in the skin during UVB exposure, is crucial for immune function, bone health, and mood. Never going outside isn't the solution. But exposing yourself carelessly – or relying solely on chemical sunscreens with questionable ingredients – isn't the answer either.</p>",
      tipsTitle: "Smart sun strategy for your skin",
      tips: [
        { title: "Mineral sunscreen over chemical", body: "Zinc oxide and titanium dioxide sit on top of the skin and reflect UV instead of absorbing it. They don't break down in sunlight, rarely irritate sensitive skin, and contain no hormone-disrupting substances like oxybenzone." },
        { title: "Avoid the sun from 11 AM to 3 PM", body: "Midday is when the UV index peaks. Plan outdoor activities for morning and afternoon. Just 15–20 minutes of forearm and face exposure is enough to produce vitamin D." },
        { title: "Hat and clothing first", body: "Physical sun protection always beats chemical. A wide-brimmed hat protects face, neck, and ears. Dense fabrics with UPF ratings block UV more effectively than any cream." },
        { title: "Apply enough", body: "Most people apply only 25–50 percent of the recommended amount of sunscreen. Your face requires half a teaspoon, and you need to reapply every two hours outdoors – more often if you sweat or swim." },
        { title: "Antioxidants boost sun protection", body: "Vitamin C, vitamin E, and niacinamide applied under sunscreen provide an extra layer of protection against free radicals created by UV radiation. They don't replace sunscreen but amplify it." }
      ],
      solutionTitle: "Repair sun-damaged skin with CBD",
      solutionBody: "<p>Even with the best sunscreen, some UV radiation reaches the skin and creates free radicals and inflammation. This is where CBD enters as a powerful ally. Studies show that cannabinoids have antioxidant properties that neutralize free radicals and reduce UV-induced inflammatory response in skin cells.</p><p>Ta-Da Serum with 10% CBD applied after sun exposure helps the skin cope with oxidative stress and supports the repair process. CBD's anti-inflammatory action is especially valuable for sun-sensitive skin that tends to redden and react. Duo Ta-Da adds an oil component that restores the lipid barrier that UV may have weakened.</p><p>Au Naturel Makeup Remover is perfect for gently removing sunscreen in the evening without stressing already sun-exposed skin. The MCT oil dissolves mineral sunscreen effectively while nourishing.</p>",
      faq: [
        { q: "Do I need sunscreen every day?", a: "During the Nordic winter half (October–March), the UV index is too low to cause sun damage in everyday life. During the summer half, yes – daily if you're outdoors more than 15 minutes. Cloudy weather doesn't block UVA." },
        { q: "Can CBD replace sunscreen?", a: "No, absolutely not. CBD has antioxidant properties that complement sunscreen, but it doesn't filter UV radiation. Always use sunscreen as primary protection and CBD skincare for repair and reinforcement." },
        { q: "Is chemical sunscreen dangerous?", a: "Substances like oxybenzone and octinoxate have shown hormone-disrupting properties in studies and are absorbed into the bloodstream. Mineral sunscreen (zinc oxide) is generally a safer choice, especially for sensitive skin and daily use." },
        { q: "How do I repair already sun-damaged skin?", a: "Sun damage is cumulative but the skin has the ability to repair itself. Antioxidants (vitamin C, CBD), retinol, and consistent sun protection going forward slow further damage. Deeper damage may require professional treatment." }
      ],
      ctaTitle: "Protect today, repair tonight",
      ctaSub: "The sun isn't your enemy – but it demands respect. Sunscreen in the morning, CBD recovery in the evening."
    }
  },
  {
    svSlug: "rokning-och-huden",
    enSlug: "smoking-and-skin",
    category: "lifestyle",
    productIds: ["duo-ta-da", "ta-da-serum", "duo-kit"],
    sv: {
      metaTitle: "Rökning och huden – så förstör tobak ditt utseende",
      metaDescription: "Rökning åldrar huden snabbare än nästan allt annat. Lär dig varför och hur du kan reparera skadan. Ärlig guide från 1753 SKINCARE.",
      kicker: "Livsstil & Hud",
      h1: "Rökning och huden – sanningen ingen cigarett berättar",
      lead: "Varje cigarett levererar över 4 000 kemikalier till din kropp, och din hud bär varenda en av dem. Rökare åldras i genomsnitt 10–15 år snabbare i huden. Rynkor, gråhet, slapphet – tobak lämnar signaturer som inte går att dölja.",
      problemTitle: "Hur skadar rökning huden?",
      problemBody: "<p>Tobaksrök attackerar huden via två fronter: inifrån genom blodet och utifrån via direktkontakt. Nikotinet snörper ihop blodkärlen och minskar blodflödet till huden med upp till 40 procent. Det betyder att hudcellerna svälter på syre och näringsämnen. Kollagenproduktionen sjunker medan enzymer som bryter ner kollagen (matrix metalloproteinaser, MMP) ökar – en dubbel förlust som accelererar rynkbildning dramatiskt.</p><p>Fria radikaler i tobaksrök orsakar massiv oxidativ stress. Hudens antioxidantförråd – C-vitamin, E-vitamin, karotenoider – töms. Rökare har mätbart lägre halter av C-vitamin i huden, vilket direkt påverkar kollagensyntesen. Resultatet syns tydligast runt ögon och mun: de karaktäristiska rökarlinjerna och kråkfötterna som uppstår årtionden tidigare än hos icke-rökare.</p><p>Hudbarriären försvagas. Sårläkningen fördröjs med upp till 50 procent. Risken för psoriasis fördubblas. Även passiv rökning påverkar huden mätbart. Det finns inget säkert sätt att röka och behålla frisk hud – det är en biologisk omöjlighet.</p>",
      tipsTitle: "Vägen tillbaka till friskare hud",
      tips: [
        { title: "Sluta röka – huden börjar återhämta sig snabbt", body: "Redan efter 2–4 veckor förbättras blodcirkulationen till huden märkbart. Efter tre månader syns förbättringar i hudtonen. Kollagenproduktionen börjar normaliseras inom ett halvår. Det är aldrig för sent." },
        { title: "Ladda med antioxidanter", body: "C-vitamin, E-vitamin och betakaroten – i mat och hudvård – hjälper till att neutralisera den oxidativa skadan. Rökare behöver dubbelt så mycket C-vitamin som icke-rökare, och huden behöver det både inifrån och utifrån." },
        { title: "Drick mer vatten", body: "Rökning uttorkar huden och försämrar dess förmåga att behålla fukt. Öka vattenintaget till minst 2,5 liter per dag och undvik alkohol och koffein som förvärrar uttorkningen." },
        { title: "Prioritera sömn", body: "Nikotin är en stimulant som stör sömnen. När du slutar röka, investera i sömnkvalitet – det är under natten huden gör sitt tyngsta reparationsarbete. God sömn accelererar hudåterhämtningen." },
        { title: "Var tålmodig", body: "Hudens fullständiga återhämtning efter rökning tar tid – 1–3 år för påtagliga förbättringar i rynkor och hudton. Men varje dag utan cigaretter är en vinst. Huden minns, men den förlåter också." }
      ],
      solutionTitle: "CBD – stöd för hud i återhämtning",
      solutionBody: "<p>Rökskadad hud behöver intensivt stöd på flera fronter: antiinflammation, antioxidation och barriärreparation. CBD adresserar alla tre. Genom att interagera med endocannabinoidsystemets receptorer i huden dämpar CBD den kroniska låggradig inflammation som rökning har grundlagt, och hjälper cellerna att återuppta normal funktion.</p><p>Ta-Da Serum med 10% CBD levererar koncentrerat antiinflammatoriskt och antioxidativt stöd direkt till de mest skadade områdena – runt ögon, mun och käklinje. Duo Ta-Da kombinerar serum och olja och ger den uttorkade, barriärskadade huden den lipidåterställning den desperat behöver.</p><p>Duo-kit med The ONE och I LOVE ger den fulla endocannabinoid-upplevelsen med både CBD och CBG. CBG har i studier visat sig ha ännu starkare antioxidativa egenskaper än CBD – särskilt relevant för hud som utsatts för åratal av oxidativ stress från tobaksrök.</p>",
      faq: [
        { q: "Reparerar huden sig efter att man slutat röka?", a: "Ja, hudens återhämtningsförmåga är anmärkningsvärd. Blodcirkulationen förbättras inom veckor, kollagenproduktionen normaliseras inom månader, och synliga förbättringar i hudton och textur kommer inom 1–3 år. Djupa rynkor kan dock vara permanenta." },
        { q: "Är vaping lika skadligt för huden?", a: "Nikotin oavsett leveransmetod snörper ihop blodkärlen och minskar blodflödet till huden. Vaping saknar förbränningsprodukterna men nikotinets vasokonstraktiva effekt kvarstår. Det är bättre än cigaretter, men inte ofarligt för huden." },
        { q: "Vilka produkter hjälper mest efter rökstopp?", a: "Fokusera på antioxidanter (C-vitamin, CBD), djupfuktning och barriärstöd. Ta-Da Serum ger antiinflammatorisk grund, Duo Ta-Da adderar lipider, och Duo-kit ger hela spektrumet av cannabinoider för maximal återhämtning." },
        { q: "Påverkar passiv rökning huden?", a: "Ja. Studier visar att passiv rökning ökar oxidativ stress i huden och kan bidra till prematur hudåldrande. Om du lever med en rökare, skydda din hud med antioxidanter och undvik exponering i slutna utrymmen." }
      ],
      ctaTitle: "Det är aldrig för sent att börja om",
      ctaSub: "Huden har en enorm förmåga att läka – ge den rätt verktyg och den kommer att överraska dig."
    },
    en: {
      metaTitle: "Smoking and skin – how tobacco destroys your appearance",
      metaDescription: "Smoking ages your skin faster than almost anything else. Learn why and how you can repair the damage. Honest guide from 1753 SKINCARE.",
      kicker: "Lifestyle & Skin",
      h1: "Smoking and skin – the truth no cigarette tells you",
      lead: "Every cigarette delivers over 4,000 chemicals to your body, and your skin bears every single one of them. On average, smokers’ skin ages 10–15 years faster. Wrinkles, dullness, sagging – tobacco leaves signatures that can't be concealed.",
      problemTitle: "How does smoking damage the skin?",
      problemBody: "<p>Tobacco smoke attacks the skin on two fronts: from the inside through the blood and from the outside through direct contact. Nicotine constricts blood vessels and reduces blood flow to the skin by up to 40 percent. This means skin cells starve for oxygen and nutrients. Collagen production drops while enzymes that break down collagen (matrix metalloproteinases, MMPs) increase – a double loss that dramatically accelerates wrinkle formation.</p><p>Free radicals in tobacco smoke cause massive oxidative stress. The skin's antioxidant reserves – vitamin C, vitamin E, carotenoids – are depleted. Smokers have measurably lower levels of vitamin C in the skin, directly affecting collagen synthesis. The results are most visible around the eyes and mouth: the characteristic smoker's lines and crow's feet that appear decades earlier than in non-smokers.</p><p>The skin barrier weakens. Wound healing is delayed by up to 50 percent. The risk of psoriasis doubles. Even secondhand smoke measurably affects the skin. There is no safe way to smoke and maintain healthy skin – it's a biological impossibility.</p>",
      tipsTitle: "The path back to healthier skin",
      tips: [
        { title: "Quit smoking – skin starts recovering quickly", body: "Within just 2–4 weeks, blood circulation to the skin improves noticeably. After three months, improvements in skin tone become visible. Collagen production begins to normalize within six months. It's never too late." },
        { title: "Load up on antioxidants", body: "Vitamin C, vitamin E, and beta-carotene – in food and skincare – help neutralize oxidative damage. Smokers need twice as much vitamin C as non-smokers, and the skin needs it both from the inside and outside." },
        { title: "Drink more water", body: "Smoking dehydrates the skin and impairs its ability to retain moisture. Increase water intake to at least 2.5 liters per day and avoid alcohol and caffeine that worsen dehydration." },
        { title: "Prioritize sleep", body: "Nicotine is a stimulant that disrupts sleep. When you quit smoking, invest in sleep quality – it's during the night that your skin does its heaviest repair work. Good sleep accelerates skin recovery." },
        { title: "Be patient", body: "Full skin recovery after smoking takes time – 1–3 years for significant improvements in wrinkles and skin tone. But every day without cigarettes is a win. Skin remembers, but it also forgives." }
      ],
      solutionTitle: "CBD – support for skin in recovery",
      solutionBody: "<p>Smoke-damaged skin needs intensive support on multiple fronts: anti-inflammatory support, antioxidant support, and barrier repair. CBD addresses all three. By interacting with the endocannabinoid system's receptors in the skin, CBD dampens the chronic low-grade inflammation that smoking has established, helping cells resume normal function.</p><p>Ta-Da Serum with 10% CBD delivers concentrated anti-inflammatory and antioxidant support directly to the most damaged areas – around the eyes, mouth, and jawline. Duo Ta-Da combines serum and oil, giving dehydrated, barrier-damaged skin the lipid restoration it desperately needs.</p><p>The Duo-kit with The ONE and I LOVE delivers the full endocannabinoid experience with both CBD and CBG. CBG has shown even stronger antioxidant properties than CBD in studies – particularly relevant for skin exposed to years of oxidative stress from tobacco smoke.</p>",
      faq: [
        { q: "Does skin repair itself after quitting smoking?", a: "Yes, the skin's recovery ability is remarkable. Blood circulation improves within weeks, collagen production normalizes within months, and visible improvements in skin tone and texture come within 1–3 years. Deep wrinkles, however, may be permanent." },
        { q: "Is vaping equally harmful for skin?", a: "Nicotine regardless of delivery method constricts blood vessels and reduces blood flow to the skin. Vaping lacks the combustion byproducts but nicotine's vasoconstrictive effect remains. It's better than cigarettes, but not harmless for skin." },
        { q: "Which products help most after quitting?", a: "Focus on antioxidants (vitamin C, CBD), deep hydration, and barrier support. Ta-Da Serum provides an anti-inflammatory base, Duo Ta-Da adds lipids, and the Duo-kit delivers the full spectrum of cannabinoids for maximum recovery." },
        { q: "Does secondhand smoke affect the skin?", a: "Yes. Studies show that secondhand smoke increases oxidative stress in the skin and can contribute to premature skin aging. If you live with a smoker, protect your skin with antioxidants and avoid exposure in enclosed spaces." }
      ],
      ctaTitle: "It's never too late to start over",
      ctaSub: "Skin has an enormous ability to heal – give it the right tools and it will surprise you."
    }
  }
];
