import type { LandingPage } from "./types";

// Frågeformade sidor – samma frågor som folk ställer till AI-assistenter.
// Varje sida börjar med ett kort, ärligt svar. Inga medicinska löften:
// vi säljer kosmetik, inte behandling, och hänvisar till vården där det behövs.
export const QUESTION_PAGES: LandingPage[] = [
  {
    svSlug: "kan-man-anvanda-cbd-vid-perioral-dermatit",
    enSlug: "can-you-use-cbd-for-perioral-dermatitis",
    category: "question",
    productIds: ["ta-da-serum"],
    sv: {
      metaTitle: "Kan man använda CBD vid perioral dermatit? Ett ärligt svar",
      metaDescription: "Perioral dermatit blir ofta värre av krämer och många ingredienser. Vad vi vet, vad vi inte vet och hur du testar CBD-hudvård försiktigt.",
      kicker: "Frågor och svar",
      h1: "Kan man använda CBD vid perioral dermatit?",
      lead: "Kort svar: det finns inga studier på CBD vid perioral dermatit, så ingen kan lova att det hjälper. Har du ett aktivt utbrott rekommenderar hudläkare ofta att du pausar nästan alla produkter. När huden har lugnat sig kan en produkt med mycket få ingredienser vara ett rimligt nästa steg, om du testar försiktigt.",
      problemTitle: "Vad är perioral dermatit?",
      problemBody: "<p>Perioral dermatit är små röda knottror och fjällning runt munnen, ibland även vid näsan och ögonen. Huden svider ofta och känns stram. Tillståndet är vanligast hos unga och medelålders kvinnor.</p><p>Orsaken är inte helt klarlagd, men kända utlösande faktorer är kortisonkrämer i ansiktet, tunga krämer, många produkter i rutinen och ibland vissa tandkrämer. Det är därför tillståndet är så frustrerande: det som känns som omsorg om huden kan göra det värre.</p><p>Behandlingen ställs av läkare. Det kan vara receptbelagda krämer eller ibland en tablettkur. Många hudläkare rekommenderar också nollterapi, alltså att du slutar med alla krämer och allt smink tills huden lugnat sig. Det kan ta några veckor, och huden blir ofta lite sämre innan den blir bättre.</p>",
      tipsTitle: "Så går du försiktigt fram",
      tips: [
        { title: "Pausa först", body: "Har du ett aktivt utbrott, prata med vårdcentralen eller en hudläkare innan du lägger till något nytt. Ofta är färre produkter det viktigaste steget." },
        { title: "Sluta inte med kortison på egen hand", body: "Har du använt kortisonkräm i ansiktet kan huden reagera kraftigt när du slutar. Gör det i samråd med läkare." },
        { title: "En ny produkt i taget", body: "När huden är lugn: introducera en enda produkt och vänta minst en vecka innan nästa. Då vet du vad huden reagerar på." },
        { title: "Testa på en liten yta", body: "Lägg en droppe längs käklinjen eller bakom örat två till tre kvällar i rad innan du använder produkten i hela ansiktet." }
      ],
      solutionTitle: "Var passar CBD-hudvård in?",
      solutionBody: "<p>CBD och CBG påverkar hudens endocannabinoidsystem, som är med och reglerar inflammation och talgproduktion. Laboratoriestudier har visat lugnande effekter på hudceller, men det är inte samma sak som bevis för att det hjälper vid perioral dermatit. Det vill vi vara tydliga med.</p><p>Det vi kan säga är att våra produkter har mycket korta ingredienslistor, utan parfym, eteriska oljor och konserveringsmedel. TA-DA Serum innehåller bara ekologisk jojobaolja och CBG. Jojoba liknar hudens eget talg och räknas som icke-komedogen. Vill du testa CBD-hudvård när huden har lugnat sig är det ett rimligt ställe att börja: en till två droppar på kvällen. Reagerar huden, sluta.</p>",
      faq: [
        { q: "Kan ansiktsolja förvärra perioral dermatit?", a: "Ja, det kan den. Tunga oljor och krämer är en känd utlösande faktor. Lätta oljor med få ingredienser tolereras ofta bättre, men det är individuellt. Börja försiktigt och avbryt om knottrorna ökar." },
        { q: "Hjälper CBD mot perioral dermatit?", a: "Det vet vi inte. Det finns inga kliniska studier på just perioral dermatit. Vi säljer kosmetik, inte behandling, och vi tycker att du ska få ett ärligt svar." },
        { q: "Hur länge varar perioral dermatit?", a: "Med rätt behandling går det ofta över på några veckor till några månader. Det kan komma tillbaka, särskilt om de utlösande faktorerna finns kvar. En läkare kan hjälpa dig att hitta dina." }
      ],
      ctaTitle: "Osäker på var du ska börja?",
      ctaSub: "Skriv till oss på info@1753skin.com och berätta om din hud. Vi svarar personligt och rekommenderar hellre för lite än för mycket."
    },
    en: {
      metaTitle: "Can you use CBD for perioral dermatitis? An honest answer",
      metaDescription: "Perioral dermatitis often gets worse with creams and long ingredient lists. What we know, what we don't, and how to try CBD skincare carefully.",
      kicker: "Questions and answers",
      h1: "Can you use CBD for perioral dermatitis?",
      lead: "Short answer: there are no studies on CBD for perioral dermatitis, so nobody can promise it helps. During an active flare, dermatologists often recommend pausing almost all products. Once the skin has calmed down, a product with very few ingredients can be a reasonable next step, as long as you test it carefully.",
      problemTitle: "What is perioral dermatitis?",
      problemBody: "<p>Perioral dermatitis shows up as small red bumps and flaking around the mouth, sometimes also around the nose and eyes. The skin often stings and feels tight. It is most common in young and middle-aged women.</p><p>The cause is not fully understood, but known triggers include steroid creams on the face, heavy creams, long routines with many products and sometimes certain toothpastes. That is what makes it so frustrating: what feels like caring for your skin can make it worse.</p><p>Treatment is decided by a doctor. It may be a prescription cream or sometimes a course of tablets. Many dermatologists also recommend zero therapy: stopping all creams and makeup until the skin settles. It can take a few weeks, and the skin often gets a little worse before it gets better.</p>",
      tipsTitle: "How to go about it carefully",
      tips: [
        { title: "Pause first", body: "If you have an active flare, talk to your GP or a dermatologist before adding anything new. Fewer products is often the most important step." },
        { title: "Don't stop steroids on your own", body: "If you have used a steroid cream on your face, the skin can react strongly when you stop. Do it with your doctor's guidance." },
        { title: "One new product at a time", body: "Once the skin is calm, introduce a single product and wait at least a week before the next. That way you know what your skin reacts to." },
        { title: "Patch test first", body: "Apply one drop along the jawline or behind the ear for two to three evenings in a row before using the product on your whole face." }
      ],
      solutionTitle: "Where does CBD skincare fit in?",
      solutionBody: "<p>CBD and CBG act on the skin's endocannabinoid system, which helps regulate inflammation and sebum production. Lab studies have shown calming effects on skin cells, but that is not the same as evidence that it helps with perioral dermatitis. We want to be clear about that.</p><p>What we can say is that our products have very short ingredient lists, with no fragrance, essential oils or preservatives. TA-DA Serum contains only organic jojoba oil and CBG. Jojoba resembles the skin's own sebum and is considered non-comedogenic. If you want to try CBD skincare once your skin has calmed down, it is a reasonable place to start: one or two drops in the evening. If your skin reacts, stop.</p>",
      faq: [
        { q: "Can face oil make perioral dermatitis worse?", a: "Yes, it can. Heavy oils and creams are a known trigger. Light oils with few ingredients are often better tolerated, but it varies from person to person. Start carefully and stop if the bumps increase." },
        { q: "Does CBD help with perioral dermatitis?", a: "We don't know. There are no clinical studies on perioral dermatitis specifically. We sell cosmetics, not treatment, and we think you deserve an honest answer." },
        { q: "How long does perioral dermatitis last?", a: "With the right treatment it often clears within a few weeks to a few months. It can come back, especially if the triggers remain. A doctor can help you identify yours." }
      ],
      ctaTitle: "Not sure where to start?",
      ctaSub: "Email us at info@1753skin.com and tell us about your skin. We reply personally and would rather recommend too little than too much."
    }
  },
  {
    svSlug: "kan-man-anvanda-cbd-vid-rosacea",
    enSlug: "can-you-use-cbd-with-rosacea",
    category: "question",
    productIds: ["ta-da-serum", "duo-kit"],
    sv: {
      metaTitle: "Kan man använda CBD vid rosacea? Vad forskningen säger",
      metaDescription: "CBD är ingen behandling för rosacea, men många med rosacea söker milda produkter med få ingredienser. Ett ärligt svar om vad som är känt.",
      kicker: "Frågor och svar",
      h1: "Kan man använda CBD vid rosacea?",
      lead: "Kort svar: CBD är ingen behandling för rosacea och det saknas stora kliniska studier. Men många med rosacea letar efter milda produkter utan parfym och med få ingredienser, och där kan en enkel CBD-olja passa, som komplement till det din läkare rekommenderar.",
      problemTitle: "Vad är rosacea?",
      problemBody: "<p>Rosacea är ett långvarigt hudtillstånd som främst sitter mitt i ansiktet: kinder, näsa, panna och haka. Det kan visa sig som rodnad som kommer och går, synliga små blodkärl, knottror och varblåsor, och ibland irriterade ögon.</p><p>Det finns olika former. Typ 2, den papulopustulösa formen, ger knottror och varblåsor som kan likna akne men utan pormaskar. Vanliga utlösande faktorer är sol, värme, kyla, alkohol, kryddstark mat, stress och produkter som irriterar huden.</p><p>Rosacea behandlas av läkare, till exempel med receptbelagda krämer eller geler, ibland tabletter, och laser mot synliga blodkärl. Hudvård ersätter inte det, men rätt hudvård kan göra vardagen lättare för huden.</p>",
      tipsTitle: "Det som brukar göra mest skillnad",
      tips: [
        { title: "Lär känna dina triggers", body: "För anteckningar i några veckor om mat, väder, stress och produkter. Mönstren blir ofta tydligare än man tror." },
        { title: "Solskydd varje dag", body: "Sol är en av de vanligaste utlösande faktorerna. Mineraliskt solskydd brukar tolereras bäst av känslig hud." },
        { title: "Ljummet vatten och få steg", body: "Varmt vatten och många produkter belastar huden. Tvätta med ljummet vatten och håll rutinen kort." },
        { title: "Undvik parfym och eteriska oljor", body: "Doftämnen är bland de vanligaste orsakerna till att känslig hud reagerar. Läs ingredienslistan, inte bara framsidan." }
      ],
      solutionTitle: "Vad vi vet om CBD och rosacea",
      solutionBody: "<p>Huden har ett eget endocannabinoidsystem som är med och reglerar inflammation. Laboratoriestudier visar att CBD kan dämpa inflammatoriska signaler i hudceller, och översiktsartiklar beskriver en möjlig potential för känslig och inflammerad hud. Men det saknas stora kliniska studier på rosacea, så det är för tidigt att säga att CBD hjälper.</p><p>Det vi kan lova är enkelhet. Våra ansiktsoljor innehåller bara ekologisk jojobaolja, CBD och CBG. TA-DA Serum innehåller bara jojobaolja och CBG. Ingen parfym, inga eteriska oljor, inga konserveringsmedel. Börja med en produkt, testa på en liten yta och använd den som ett komplement till din behandling, inte istället för den.</p>",
      faq: [
        { q: "Kan CBD göra rosacea värre?", a: "All hudvård kan irritera känslig hud, även milda produkter. Parfym, alkohol och eteriska oljor är vanligare orsaker än CBD. Testa alltid på en liten yta först och sluta om huden blir rödare eller svider." },
        { q: "Kan jag använda CBD-olja samtidigt som min receptbelagda kräm?", a: "Fråga din läkare eller ditt apotek först. Om de inte har något emot det brukar man lägga den receptbelagda krämen först och oljan efter, när krämen har torkat in." },
        { q: "Vad betyder rosacea typ 2?", a: "Typ 2 är den papulopustulösa formen, med knottror och varblåsor på en rodnad bakgrund. Den förväxlas ibland med akne och behandlas ofta av läkare med receptbelagda läkemedel." }
      ],
      ctaTitle: "Vill du ha ett personligt råd?",
      ctaSub: "Berätta om din hud på info@1753skin.com. Vi svarar ärligt, även när svaret är att du ska börja med något annat än våra produkter."
    },
    en: {
      metaTitle: "Can you use CBD with rosacea? What the research says",
      metaDescription: "CBD is not a treatment for rosacea, but many people with rosacea look for gentle products with few ingredients. An honest answer about what is known.",
      kicker: "Questions and answers",
      h1: "Can you use CBD with rosacea?",
      lead: "Short answer: CBD is not a treatment for rosacea and large clinical studies are lacking. But many people with rosacea look for gentle, fragrance-free products with few ingredients, and a simple CBD oil can fit there, as a complement to what your doctor recommends.",
      problemTitle: "What is rosacea?",
      problemBody: "<p>Rosacea is a long-term skin condition that mainly affects the centre of the face: cheeks, nose, forehead and chin. It can show up as flushing that comes and goes, small visible blood vessels, bumps and pustules, and sometimes irritated eyes.</p><p>There are different forms. Type 2, the papulopustular form, causes bumps and pustules that can look like acne but without blackheads. Common triggers include sun, heat, cold, alcohol, spicy food, stress and irritating products.</p><p>Rosacea is treated by doctors, for example with prescription creams or gels, sometimes tablets, and laser for visible blood vessels. Skincare does not replace that, but the right skincare can make daily life easier for your skin.</p>",
      tipsTitle: "What tends to make the biggest difference",
      tips: [
        { title: "Get to know your triggers", body: "Keep notes for a few weeks on food, weather, stress and products. The patterns are often clearer than you'd expect." },
        { title: "Sunscreen every day", body: "Sun is one of the most common triggers. Mineral sunscreen is usually best tolerated by sensitive skin." },
        { title: "Lukewarm water and few steps", body: "Hot water and long routines put a strain on the skin. Wash with lukewarm water and keep the routine short." },
        { title: "Avoid fragrance and essential oils", body: "Fragrance is among the most common reasons sensitive skin reacts. Read the ingredient list, not just the front of the bottle." }
      ],
      solutionTitle: "What we know about CBD and rosacea",
      solutionBody: "<p>The skin has its own endocannabinoid system that helps regulate inflammation. Lab studies show that CBD can dampen inflammatory signals in skin cells, and review articles describe possible potential for sensitive and inflamed skin. But there are no large clinical studies on rosacea, so it is too early to say that CBD helps.</p><p>What we can promise is simplicity. Our facial oils contain only organic jojoba oil, CBD and CBG. TA-DA Serum contains only jojoba oil and CBG. No fragrance, no essential oils, no preservatives. Start with one product, patch test it and use it as a complement to your treatment, not instead of it.</p>",
      faq: [
        { q: "Can CBD make rosacea worse?", a: "Any skincare can irritate sensitive skin, even gentle products. Fragrance, alcohol and essential oils are more common culprits than CBD. Always patch test first and stop if your skin gets redder or stings." },
        { q: "Can I use CBD oil alongside my prescription cream?", a: "Ask your doctor or pharmacist first. If they have no objection, people usually apply the prescription cream first and the oil afterwards, once the cream has absorbed." },
        { q: "What does rosacea type 2 mean?", a: "Type 2 is the papulopustular form, with bumps and pustules on a flushed background. It is sometimes mistaken for acne and is often treated by doctors with prescription medication." }
      ],
      ctaTitle: "Want personal advice?",
      ctaSub: "Tell us about your skin at info@1753skin.com. We answer honestly, even when the answer is that you should start with something other than our products."
    }
  },
  {
    svSlug: "kan-man-anvanda-ansiktsolja-vid-seborroiskt-eksem",
    enSlug: "can-you-use-face-oil-with-seborrheic-dermatitis",
    category: "question",
    productIds: ["au-naturel-makeup-remover", "ta-da-serum"],
    sv: {
      metaTitle: "Kan man använda ansiktsolja vid seborroiskt eksem (mjälleksem)?",
      metaDescription: "Seborroiskt eksem hänger ihop med en jästsvamp som trivs på hudens fetter. Därför spelar valet av olja roll. Ett ärligt svar om vad som är känt.",
      kicker: "Frågor och svar",
      h1: "Kan man använda ansiktsolja vid seborroiskt eksem?",
      lead: "Kort svar: försiktigt. Seborroiskt eksem, ofta kallat mjälleksem, hänger ihop med jästsvampen Malassezia som lever på hudens fetter. Vissa oljor kan ge den mer att leva på. Välj få ingredienser, undvik oljor som olivolja och testa på en liten yta först.",
      problemTitle: "Vad är seborroiskt eksem?",
      problemBody: "<p>Seborroiskt eksem ger rodnad och gulaktig eller vit fjällning på ställen där huden har mycket talgkörtlar: vid näsvingarna, i ögonbrynen, vid hårfästet, bakom öronen och i hårbotten, där det märks som mjäll.</p><p>Tillståndet kopplas till jästsvampen Malassezia, som finns på allas hud men som hos vissa ger en inflammatorisk reaktion. Det blir ofta värre på vintern, vid stress och vid sömnbrist, och går i perioder.</p><p>Behandlingen brukar vara svampdödande schampo eller kräm, ibland kortvarigt en mild kortisonkräm. Det får du råd om på apotek eller vårdcentral. Hudvård ersätter inte det, men den kan antingen hjälpa eller stjälpa.</p>",
      tipsTitle: "Det här brukar hjälpa",
      tips: [
        { title: "Följ behandlingen du fått", body: "Svampdödande schampo eller kräm är grunden. Sluta inte med det för att prova något nytt." },
        { title: "Var försiktig med vanliga matoljor", body: "Olivolja och liknande oljor med mycket fria fettsyror rekommenderas ofta inte vid seborroiskt eksem, eftersom Malassezia kan leva på dem." },
        { title: "Sov och varva ner", body: "Stress och sömnbrist är kända triggers för nya perioder. Det låter enkelt, men det gör ofta skillnad." },
        { title: "Testa på liten yta", body: "Prova en ny produkt på ett litet område i några dagar innan du använder den i hela ansiktet." }
      ],
      solutionTitle: "Vilka oljor kan fungera?",
      solutionBody: "<p>Forskningen här är tunn, så vi vill inte lova för mycket. MCT-olja (caprylic/capric triglyceride) nämns ofta som ett av de mer skonsamma alternativen vid seborroiskt eksem. Jojoba är tekniskt sett ett vax och inte en vanlig olja, och liknar hudens eget talg.</p><p>Våra produkter bygger på just de två. Au Naturel Makeup Remover innehåller bara MCT-olja och CBD, och kan användas för att rengöra huden utan skummande tvättmedel. TA-DA Serum innehåller bara jojobaolja och CBG. Det är inte bevisat att CBD eller CBG hjälper mot seborroiskt eksem, men korta ingredienslistor gör det lättare att se hur din hud reagerar.</p>",
      faq: [
        { q: "Är mjälleksem och seborroiskt eksem samma sak?", a: "Ja. Mjälleksem är det vardagliga namnet på seborroiskt eksem. I hårbotten märks det som mjäll, i ansiktet som rodnad och fjällning." },
        { q: "Hjälper CBD mot mjäll eller seborroiskt eksem?", a: "Det finns inga kliniska studier som visar det. CBD påverkar inflammation i laboratorieförsök, men vi kan inte lova någon effekt på seborroiskt eksem." },
        { q: "Ska jag sluta med min svampkräm om jag börjar med olja?", a: "Nej. Följ den behandling du har fått. En olja kan i så fall vara ett komplement, inte en ersättning." }
      ],
      ctaTitle: "Fundera tillsammans med oss",
      ctaSub: "Mejla info@1753skin.com och beskriv din hud. Vi hjälper dig att välja, och säger det rakt ut om vi tror att något annat passar bättre."
    },
    en: {
      metaTitle: "Can you use face oil with seborrheic dermatitis?",
      metaDescription: "Seborrheic dermatitis is linked to a yeast that feeds on skin lipids, so the choice of oil matters. An honest answer about what is known.",
      kicker: "Questions and answers",
      h1: "Can you use face oil with seborrheic dermatitis?",
      lead: "Short answer: carefully. Seborrheic dermatitis is linked to the yeast Malassezia, which lives on the skin's lipids. Some oils can give it more to feed on. Choose few ingredients, avoid oils such as olive oil and patch test first.",
      problemTitle: "What is seborrheic dermatitis?",
      problemBody: "<p>Seborrheic dermatitis causes redness and yellowish or white flaking where the skin has many oil glands: around the sides of the nose, in the eyebrows, along the hairline, behind the ears and on the scalp, where it shows up as dandruff.</p><p>It is linked to the yeast Malassezia, which lives on everyone's skin but triggers an inflammatory reaction in some people. It often gets worse in winter, with stress and with lack of sleep, and comes and goes in periods.</p><p>Treatment is usually an antifungal shampoo or cream, sometimes a short course of a mild steroid cream. A pharmacist or GP can advise you. Skincare does not replace that, but it can either help or make things worse.</p>",
      tipsTitle: "What usually helps",
      tips: [
        { title: "Stick to your treatment", body: "Antifungal shampoo or cream is the foundation. Don't stop using it to try something new." },
        { title: "Be careful with kitchen oils", body: "Olive oil and similar oils rich in free fatty acids are often not recommended for seborrheic dermatitis, because Malassezia can feed on them." },
        { title: "Sleep and slow down", body: "Stress and lack of sleep are known triggers for new flares. It sounds simple, but it often makes a difference." },
        { title: "Patch test", body: "Try a new product on a small area for a few days before using it on your whole face." }
      ],
      solutionTitle: "Which oils can work?",
      solutionBody: "<p>The research here is thin, so we don't want to overpromise. MCT oil (caprylic/capric triglyceride) is often mentioned as one of the gentler options for seborrheic dermatitis. Jojoba is technically a wax rather than a typical oil, and resembles the skin's own sebum.</p><p>Our products are built on exactly those two. Au Naturel Makeup Remover contains only MCT oil and CBD, and can be used to cleanse the skin without foaming cleansers. TA-DA Serum contains only jojoba oil and CBG. It is not proven that CBD or CBG helps with seborrheic dermatitis, but short ingredient lists make it easier to see how your skin reacts.</p>",
      faq: [
        { q: "Is dandruff the same as seborrheic dermatitis?", a: "Dandruff is the mild form of seborrheic dermatitis on the scalp. On the face it shows up as redness and flaking." },
        { q: "Does CBD help with dandruff or seborrheic dermatitis?", a: "There are no clinical studies showing that. CBD affects inflammation in lab experiments, but we cannot promise any effect on seborrheic dermatitis." },
        { q: "Should I stop my antifungal cream if I start using an oil?", a: "No. Follow the treatment you have been given. An oil can be a complement, not a replacement." }
      ],
      ctaTitle: "Let's think it through together",
      ctaSub: "Email info@1753skin.com and describe your skin. We'll help you choose, and tell you straight if we think something else is a better fit."
    }
  },
  {
    svSlug: "vilken-cbd-olja-ska-man-borja-med-vid-kanslig-hud",
    enSlug: "which-cbd-oil-to-start-with-for-sensitive-skin",
    category: "question",
    productIds: ["ta-da-serum", "duo-kit"],
    sv: {
      metaTitle: "Vilken CBD-olja ska man börja med om huden reagerar på allt?",
      metaDescription: "Har du torr, känslig hud som reagerar på det mesta? Börja med en enda produkt med så få ingredienser som möjligt. Så testar du försiktigt.",
      kicker: "Frågor och svar",
      h1: "Vilken CBD-olja ska man börja med om huden reagerar på allt?",
      lead: "Kort svar: börja med en enda produkt med så få ingredienser som möjligt. Hos oss är det TA-DA Serum, som bara innehåller ekologisk jojobaolja och CBG. Testa på en liten yta först och lägg inte till något annat nytt samtidigt.",
      problemTitle: "Varför reagerar huden på allt?",
      problemBody: "<p>När huden reagerar på nästan allt är hudbarriären ofta försvagad. Det yttersta lagret släpper ut fukt och släpper in sådant som irriterar. Huden blir torr, stram och snabb att svida eller rodna.</p><p>Ju fler ingredienser en produkt har, desto fler chanser att någon av dem inte passar just dig. Doftämnen är den vanligaste orsaken till kontaktallergi mot kosmetika, och eteriska oljor och vissa konserveringsmedel är andra vanliga syndare.</p><p>Har du dessutom en diagnos som rosacea, perioral dermatit eller eksem är det klokt att ha kontakt med vården. Hudvård kan göra vardagen bättre för huden, men den ersätter inte behandling.</p>",
      tipsTitle: "Så testar du en ny produkt",
      tips: [
        { title: "Testa på liten yta", body: "En droppe längs käklinjen eller bakom örat, två till tre kvällar i rad. Ingen reaktion? Då kan du gå vidare." },
        { title: "Börja med en till två droppar", body: "Mer är inte bättre. Värm oljan mellan fingertopparna och tryck in den på lätt fuktig hud på kvällen." },
        { title: "Ändra en sak i taget", body: "Byt inte ut hela rutinen på en gång. Då vet du inte vad som hjälper eller vad som stör." },
        { title: "Ge det fyra veckor", body: "Huden förnyar sitt yttersta lager på ungefär en månad. Utvärdera först efter det." }
      ],
      solutionTitle: "Var du börjar hos oss",
      solutionBody: "<p>Alla våra ansiktsprodukter bygger på samma enkla grund: ekologisk jojobaolja plus CBD och/eller CBG. Inget annat. TA-DA Serum har bara två ingredienser, jojoba och CBG, och är därför det enklaste stället att börja.</p><p>Fungerar det bra efter några veckor kan du överväga DUO-kitet: The ONE för morgonen (10 % CBD och 0,2 % CBG) och I LOVE för kvällen (10 % CBD och 5 % CBG). Vi rekommenderar inte att du börjar med två produkter samtidigt om din hud är väldigt reaktiv. Det är bättre att gå långsamt och veta vad som fungerar.</p>",
      faq: [
        { q: "Är CBD-hudvård bra för känslig hud?", a: "Det är individuellt. Korta ingredienslistor utan parfym minskar risken för reaktioner, men ingen produkt passar alla. Testa alltid på en liten yta först." },
        { q: "Varför inte börja med DUO-kitet direkt?", a: "Två nya produkter samtidigt gör det svårt att veta vad huden reagerar på. Har du väldigt reaktiv hud är en produkt i taget säkrare." },
        { q: "Vad gör jag om huden reagerar?", a: "Sluta använda produkten, skölj med ljummet vatten och låt huden vila. Kontakta oss gärna så hjälper vi dig vidare. Blir det värre eller sprider sig, kontakta vården." }
      ],
      ctaTitle: "Vill du ha hjälp att välja?",
      ctaSub: "Skriv till info@1753skin.com och berätta hur din hud reagerar. Vi föreslår hellre en produkt för lite än en för mycket."
    },
    en: {
      metaTitle: "Which CBD oil should you start with if your skin reacts to everything?",
      metaDescription: "Dry, sensitive skin that reacts to almost everything? Start with a single product with as few ingredients as possible. Here's how to test carefully.",
      kicker: "Questions and answers",
      h1: "Which CBD oil should you start with if your skin reacts to everything?",
      lead: "Short answer: start with a single product with as few ingredients as possible. For us, that is TA-DA Serum, which contains only organic jojoba oil and CBG. Patch test first and don't add anything else new at the same time.",
      problemTitle: "Why does skin react to everything?",
      problemBody: "<p>When skin reacts to almost everything, the skin barrier is often weakened. The outer layer lets moisture out and lets irritants in. The skin becomes dry, tight and quick to sting or flush.</p><p>The more ingredients a product has, the more chances that one of them doesn't suit you. Fragrance is the most common cause of contact allergy to cosmetics, and essential oils and certain preservatives are other frequent culprits.</p><p>If you also have a diagnosis such as rosacea, perioral dermatitis or eczema, it is wise to stay in touch with a doctor. Skincare can make daily life better for your skin, but it does not replace treatment.</p>",
      tipsTitle: "How to test a new product",
      tips: [
        { title: "Patch test", body: "One drop along the jawline or behind the ear, two to three evenings in a row. No reaction? Then you can move on." },
        { title: "Start with one or two drops", body: "More is not better. Warm the oil between your fingertips and press it into slightly damp skin in the evening." },
        { title: "Change one thing at a time", body: "Don't replace your whole routine at once. Otherwise you won't know what helps or what bothers your skin." },
        { title: "Give it four weeks", body: "The skin renews its outer layer in about a month. Evaluate after that." }
      ],
      solutionTitle: "Where to start with us",
      solutionBody: "<p>All our facial products share the same simple base: organic jojoba oil plus CBD and/or CBG. Nothing else. TA-DA Serum has only two ingredients, jojoba and CBG, which makes it the simplest place to start.</p><p>If it works well after a few weeks, you can consider the DUO kit: The ONE for the morning (10% CBD and 0.2% CBG) and I LOVE for the evening (10% CBD and 5% CBG). We don't recommend starting with two products at once if your skin is very reactive. It is better to go slowly and know what works.</p>",
      faq: [
        { q: "Is CBD skincare good for sensitive skin?", a: "It varies from person to person. Short, fragrance-free ingredient lists reduce the risk of reactions, but no product suits everyone. Always patch test first." },
        { q: "Why not start with the DUO kit right away?", a: "Two new products at once make it hard to know what your skin is reacting to. If your skin is very reactive, one product at a time is safer." },
        { q: "What do I do if my skin reacts?", a: "Stop using the product, rinse with lukewarm water and let the skin rest. Feel free to contact us and we'll help. If it gets worse or spreads, see a doctor." }
      ],
      ctaTitle: "Want help choosing?",
      ctaSub: "Email info@1753skin.com and tell us how your skin reacts. We would rather suggest one product too few than one too many."
    }
  },
  {
    svSlug: "kan-man-anvanda-ansiktsolja-om-man-har-finnar",
    enSlug: "can-you-use-face-oil-if-you-have-acne",
    category: "question",
    productIds: ["duo-kit", "ta-da-serum"],
    sv: {
      metaTitle: "Kan man använda ansiktsolja om man har finnar?",
      metaDescription: "Det är inte oljan i sig som ger finnar, utan vilken olja och hur mycket. Ett ärligt svar om ansiktsolja, jojoba och CBD vid akne.",
      kicker: "Frågor och svar",
      h1: "Kan man använda ansiktsolja om man har finnar?",
      lead: "Kort svar: ja, många kan det. Det är inte olja i sig som ger finnar, utan vilken olja och hur mycket. Jojoba räknas som icke-komedogen och liknar hudens eget talg. Har du svår akne, ärrbildning eller djupa, ömma knölar ska du däremot träffa läkare.",
      problemTitle: "Varför får man finnar?",
      problemBody: "<p>Finnar uppstår när talg och döda hudceller täpper till en por, bakterier trivs i miljön och huden svarar med inflammation. Hormoner, ärftlighet, stress och sömn påverkar alla hur mycket talg huden producerar och hur kraftigt den reagerar.</p><p>Många med finnar undviker oljor helt och tvättar huden hårt för att få bort fettet. Det kan göra huden torr och irriterad utan att finnarna blir färre. Vissa oljor, som kokosolja, täpper dock lätt till porerna och är inget bra val för hud med finnar.</p><p>Lindrig akne kan ofta skötas med enkla rutiner och receptfria produkter från apoteket. Vid svårare akne finns effektiva behandlingar hos läkare.</p>",
      tipsTitle: "Om du vill testa olja",
      tips: [
        { title: "Välj rätt olja", body: "Jojoba har lågt komedogent värde. Undvik kokosolja och tunga oljor i ansiktet om du är benägen att få finnar." },
        { title: "Använd lite", body: "Två till tre droppar räcker till hela ansiktet. Det ska kännas mjukt, inte fett." },
        { title: "Tvätta inte för hårt", body: "Skummande rengöring flera gånger om dagen kan torka ut huden. En mild rengöring på kvällen räcker för de flesta." },
        { title: "Låt bli att klämma", body: "Att klämma ökar risken för inflammation och ärr. Låt finnen läka i lugn och ro." }
      ],
      solutionTitle: "Vad säger forskningen om CBD och finnar?",
      solutionBody: "<p>En ofta citerad laboratoriestudie från 2014 visade att CBD minskade talgproduktionen och dämpade inflammation i mänskliga talgkörtelceller. Det är intressant, men det är en studie i provrör, inte på människor med akne. Kliniska studier saknas fortfarande.</p><p>Våra ansiktsoljor innehåller bara ekologisk jojobaolja, CBD och CBG, utan parfym eller konserveringsmedel. Många med blandhud och enstaka finnar använder dem utan problem, men det är individuellt. Testa på en liten yta och ge det några veckor. Märker du fler finnar efter två till tre veckor, sluta.</p>",
      faq: [
        { q: "Täpper jojobaolja till porerna?", a: "Jojoba har ett lågt komedogent värde och täpper sällan till porerna. Ingen olja är dock helt riskfri för alla, så börja med lite." },
        { q: "Hjälper CBD mot akne?", a: "Laboratoriestudier är lovande, men det saknas kliniska bevis. Vi kan inte lova att CBD minskar dina finnar." },
        { q: "Kan jag använda olja om jag tar isotretinoin?", a: "Isotretinoin gör ofta huden mycket torr och många behöver extra återfuktning. Fråga din läkare vad som passar dig innan du lägger till något nytt." }
      ],
      ctaTitle: "Osäker på om olja passar dig?",
      ctaSub: "Berätta om din hud på info@1753skin.com. Vi svarar personligt och ärligt."
    },
    en: {
      metaTitle: "Can you use face oil if you have acne?",
      metaDescription: "Oil itself doesn't cause acne; it depends on which oil and how much. An honest answer about face oil, jojoba and CBD for breakouts.",
      kicker: "Questions and answers",
      h1: "Can you use face oil if you have acne?",
      lead: "Short answer: yes, many people can. It isn't oil itself that causes breakouts, but which oil and how much. Jojoba is considered non-comedogenic and resembles the skin's own sebum. If you have severe acne, scarring or deep, painful lumps, however, you should see a doctor.",
      problemTitle: "Why do breakouts happen?",
      problemBody: "<p>Breakouts happen when sebum and dead skin cells block a pore, bacteria thrive in that environment and the skin responds with inflammation. Hormones, genetics, stress and sleep all affect how much sebum the skin produces and how strongly it reacts.</p><p>Many people with acne avoid oils completely and wash their skin hard to remove grease. That can leave the skin dry and irritated without reducing breakouts. Some oils, such as coconut oil, do clog pores easily and are not a good choice for acne-prone skin.</p><p>Mild acne can often be managed with simple routines and over-the-counter products. For more severe acne, doctors have effective treatments.</p>",
      tipsTitle: "If you want to try oil",
      tips: [
        { title: "Choose the right oil", body: "Jojoba has a low comedogenic rating. Avoid coconut oil and heavy oils on your face if you are prone to breakouts." },
        { title: "Use a little", body: "Two to three drops are enough for the whole face. It should feel soft, not greasy." },
        { title: "Don't over-cleanse", body: "Foaming cleansers several times a day can dry out the skin. A gentle cleanse in the evening is enough for most people." },
        { title: "Don't squeeze", body: "Squeezing increases the risk of inflammation and scarring. Let the spot heal in peace." }
      ],
      solutionTitle: "What does the research say about CBD and acne?",
      solutionBody: "<p>A frequently cited lab study from 2014 showed that CBD reduced sebum production and dampened inflammation in human sebaceous gland cells. That is interesting, but it is a test-tube study, not a study of people with acne. Clinical studies are still lacking.</p><p>Our facial oils contain only organic jojoba oil, CBD and CBG, with no fragrance or preservatives. Many people with combination skin and occasional breakouts use them without problems, but it varies. Patch test and give it a few weeks. If you notice more breakouts after two to three weeks, stop.</p>",
      faq: [
        { q: "Does jojoba oil clog pores?", a: "Jojoba has a low comedogenic rating and rarely clogs pores. No oil is completely risk-free for everyone, though, so start with a little." },
        { q: "Does CBD help with acne?", a: "Lab studies are promising, but clinical evidence is lacking. We cannot promise that CBD will reduce your breakouts." },
        { q: "Can I use oil while taking isotretinoin?", a: "Isotretinoin often makes skin very dry and many people need extra moisture. Ask your doctor what suits you before adding anything new." }
      ],
      ctaTitle: "Not sure if oil suits you?",
      ctaSub: "Tell us about your skin at info@1753skin.com. We reply personally and honestly."
    }
  },
  {
    svSlug: "hur-lang-tid-tar-det-innan-cbd-hudvard-ger-effekt",
    enSlug: "how-long-does-cbd-skincare-take-to-work",
    category: "question",
    productIds: ["duo-kit", "ta-da-serum"],
    sv: {
      metaTitle: "Hur lång tid tar det innan CBD-hudvård ger effekt?",
      metaDescription: "Räkna med fyra till sex veckor. Varför det tar tid, vad du kan märka tidigare och när du ska ge upp. Ett ärligt svar från 1753 SKINCARE.",
      kicker: "Frågor och svar",
      h1: "Hur lång tid tar det innan CBD-hudvård ger effekt?",
      lead: "Kort svar: räkna med fyra till sex veckor. Det är ungefär så lång tid det tar för huden att förnya sitt yttersta lager. Att huden känns mjukare kan märkas efter några dagar, men förändringar i balans och känslighet tar längre tid.",
      problemTitle: "Varför tar det tid?",
      problemBody: "<p>Hudens yttersta lager förnyas hela tiden. Hos unga vuxna tar en full omsättning ungefär fyra veckor, och med åldern går det långsammare. Det du ser i spegeln i dag är alltså resultatet av hur huden mått de senaste veckorna.</p><p>Många byter produkt efter en vecka eller två när de inte ser någon skillnad. Då hinner huden aldrig visa vad en produkt faktiskt gör, och den får dessutom hantera ständigt nya ingredienser.</p><p>Hudvård är bara en del av bilden. Sömn, stress, kost och årstid påverkar huden minst lika mycket, och kan både dölja och förstärka effekten av det du använder.</p>",
      tipsTitle: "Så utvärderar du rättvist",
      tips: [
        { title: "Ta en bild varje vecka", body: "Samma ljus, samma tid på dagen, utan smink. Förändringar är svåra att se från dag till dag men tydliga över en månad." },
        { title: "Håll rutinen stabil", body: "Lägg inte till eller ta bort andra produkter under testperioden. Annars vet du inte vad som gör skillnad." },
        { title: "Notera livet runt omkring", body: "Skriv ner stressiga veckor, dålig sömn och mens. Det förklarar ofta svängningar som annars skylls på hudvården." },
        { title: "Bestäm en slutpunkt", body: "Utvärdera efter sex till åtta veckor. Har inget hänt då är produkten kanske inte rätt för dig, och det är helt okej." }
      ],
      solutionTitle: "Vad du kan förvänta dig",
      solutionBody: "<p>Med en ansiktsolja märker de flesta att huden känns mjukare och mindre stram redan de första dagarna, eftersom oljan minskar fuktförlusten. Det är den snabba delen.</p><p>Förändringar i hur ofta huden rodnar, svider eller blir torr tar längre tid, och de är individuella. Vi lovar inga snabba resultat. Använd produkten dagligen, ge den en månad och utvärdera ärligt. Blir huden sämre ska du inte vänta ut det: sluta och hör av dig.</p>",
      faq: [
        { q: "Kan huden bli sämre i början?", a: "Med milda oljor är det ovanligt. Den så kallade utrensningen hör framför allt ihop med aktiva ingredienser som retinol och syror. Blir huden sämre av en olja är det oftare en reaktion, och då ska du sluta." },
        { q: "Hur ofta ska jag använda produkterna?", a: "Två till tre droppar morgon och kväll, på lätt fuktig hud. TA-DA Serum kan användas dagligen eller några gånger i veckan." },
        { q: "Kan jag sluta när huden har blivit bättre?", a: "Ja. Huden blir inte beroende av produkterna. Många fortsätter för att de trivs med dem, men du kan pausa när du vill." }
      ],
      ctaTitle: "Har du frågor om din rutin?",
      ctaSub: "Mejla info@1753skin.com. Vi hjälper dig gärna att lägga upp en enkel rutin och en rimlig plan för att utvärdera den."
    },
    en: {
      metaTitle: "How long does CBD skincare take to work?",
      metaDescription: "Expect four to six weeks. Why it takes time, what you may notice sooner and when to give up. An honest answer from 1753 SKINCARE.",
      kicker: "Questions and answers",
      h1: "How long does CBD skincare take to work?",
      lead: "Short answer: expect four to six weeks. That is roughly how long it takes for the skin to renew its outer layer. Softer-feeling skin can be noticeable within a few days, but changes in balance and sensitivity take longer.",
      problemTitle: "Why does it take time?",
      problemBody: "<p>The skin's outer layer is constantly renewing itself. In young adults a full turnover takes about four weeks, and it slows down with age. What you see in the mirror today reflects how your skin has been doing over the past few weeks.</p><p>Many people switch products after a week or two when they see no difference. Then the skin never gets the chance to show what a product actually does, and it also has to deal with a constant stream of new ingredients.</p><p>Skincare is only part of the picture. Sleep, stress, diet and season affect the skin at least as much, and can both mask and amplify the effect of what you use.</p>",
      tipsTitle: "How to evaluate fairly",
      tips: [
        { title: "Take a photo every week", body: "Same light, same time of day, no makeup. Changes are hard to see day to day but clear over a month." },
        { title: "Keep the routine stable", body: "Don't add or remove other products during the test period. Otherwise you won't know what makes the difference." },
        { title: "Note what's happening in your life", body: "Write down stressful weeks, poor sleep and your cycle. It often explains swings that would otherwise be blamed on skincare." },
        { title: "Set an end point", body: "Evaluate after six to eight weeks. If nothing has happened by then, the product may not be right for you, and that is completely fine." }
      ],
      solutionTitle: "What you can expect",
      solutionBody: "<p>With a face oil, most people notice that their skin feels softer and less tight within the first few days, because the oil reduces moisture loss. That is the quick part.</p><p>Changes in how often the skin flushes, stings or gets dry take longer, and they vary from person to person. We don't promise quick results. Use the product daily, give it a month and evaluate honestly. If your skin gets worse, don't wait it out: stop and get in touch.</p>",
      faq: [
        { q: "Can skin get worse at first?", a: "With gentle oils it is unusual. So-called purging is mainly linked to active ingredients such as retinol and acids. If an oil makes your skin worse, it is more likely a reaction, and you should stop." },
        { q: "How often should I use the products?", a: "Two to three drops morning and evening, on slightly damp skin. TA-DA Serum can be used daily or a few times a week." },
        { q: "Can I stop once my skin has improved?", a: "Yes. Your skin does not become dependent on the products. Many people continue because they like them, but you can pause whenever you want." }
      ],
      ctaTitle: "Questions about your routine?",
      ctaSub: "Email info@1753skin.com. We are happy to help you set up a simple routine and a sensible plan to evaluate it."
    }
  },
  {
    svSlug: "kan-man-anvanda-cbd-hudvard-nar-man-ar-gravid",
    enSlug: "can-you-use-cbd-skincare-while-pregnant",
    category: "question",
    productIds: [],
    sv: {
      metaTitle: "Kan man använda CBD-hudvård när man är gravid eller ammar?",
      metaDescription: "Det finns för lite forskning för att säga att CBD är säkert under graviditet och amning. Vårt ärliga svar och vad du kan göra istället.",
      kicker: "Frågor och svar",
      h1: "Kan man använda CBD-hudvård när man är gravid eller ammar?",
      lead: "Kort svar: det finns för lite forskning för att säga att det är säkert. Hudvård på huden ger mycket lägre exponering än CBD som man äter, men eftersom studier saknas rekommenderar vi att du pratar med din barnmorska eller läkare innan du börjar.",
      problemTitle: "Varför är svaret inte ett enkelt ja?",
      problemBody: "<p>Under graviditeten förändras huden ofta. Den kan bli torrare, mer känslig, få pigmentfläckar eller finnar. Det är förståeligt att vilja ta hand om den, och samtidigt vill man vara försiktig med allt man använder.</p><p>Det finns i dag inga studier som visar att CBD är säkert under graviditet eller amning. Amerikanska läkemedelsmyndigheten FDA avråder från CBD i alla former under graviditet och amning, framför allt på grund av att kunskapen saknas.</p><p>Forskningen gäller främst CBD som man äter. Hudvård tas upp i mycket mindre utsträckning, men mindre är inte samma sak som noll, och det är inte studerat. Därför ger vi inget löfte.</p>",
      tipsTitle: "Om du är gravid eller ammar",
      tips: [
        { title: "Fråga din barnmorska", body: "Ta med produktens ingredienslista. Våra listor är korta, vilket gör dem lätta att bedöma." },
        { title: "Håll rutinen enkel", body: "Mild rengöring, något som återfuktar och solskydd räcker långt. Det är inte rätt tid att testa många nya produkter." },
        { title: "Var försiktig med kosttillskott", body: "Det gäller även svampextrakt som Fungtastic. Ta inga nya kosttillskott under graviditet eller amning utan att rådgöra med vården." },
        { title: "Solskydd mot pigmentfläckar", body: "Graviditetsfläckar förvärras av sol. Ett mineraliskt solskydd är ett enkelt och skonsamt skydd." }
      ],
      solutionTitle: "Vår hållning",
      solutionBody: "<p>Vi rekommenderar inte att du börjar med CBD- eller CBG-hudvård under graviditet eller amning utan att först ha pratat med din barnmorska eller läkare. Det gäller även våra produkter.</p><p>Vill du ha en enkel olja under tiden är ren jojobaolja utan tillsatser ett vanligt och skonsamt alternativ. Har du frågor om exakt vad våra produkter innehåller, mejla oss så skickar vi all information du eller din barnmorska behöver.</p>",
      faq: [
        { q: "Är det farligt om jag redan har använt CBD-hudvård?", a: "Det finns inga kända rapporter om skador från CBD-hudvård på huden, men det är inte heller studerat. Är du orolig, prata med din barnmorska. Det är en helt rimlig fråga att ställa." },
        { q: "Gäller det även Au Naturel Makeup Remover?", a: "Ja, den innehåller 0,2 % CBD. Samma råd gäller: prata med din barnmorska innan du använder den." },
        { q: "Vad kan jag använda istället?", a: "Ren jojobaolja, en mild oparfymerad kräm och mineraliskt solskydd är en enkel och skonsam grund under graviditet och amning." }
      ],
      ctaTitle: "Vill du ha ingredienslistorna?",
      ctaSub: "Mejla info@1753skin.com så skickar vi fullständig information om alla ingredienser, att visa för din barnmorska."
    },
    en: {
      metaTitle: "Can you use CBD skincare while pregnant or breastfeeding?",
      metaDescription: "There is too little research to say CBD is safe during pregnancy and breastfeeding. Our honest answer and what you can do instead.",
      kicker: "Questions and answers",
      h1: "Can you use CBD skincare while pregnant or breastfeeding?",
      lead: "Short answer: there is too little research to say it is safe. Skincare gives much lower exposure than CBD taken by mouth, but since studies are lacking, we recommend talking to your midwife or doctor before you start.",
      problemTitle: "Why isn't the answer a simple yes?",
      problemBody: "<p>Skin often changes during pregnancy. It can become drier, more sensitive, develop pigmentation or breakouts. It is understandable to want to take care of it, and at the same time to be careful with everything you use.</p><p>There are currently no studies showing that CBD is safe during pregnancy or breastfeeding. The US Food and Drug Administration (FDA) advises against CBD in any form during pregnancy and breastfeeding, mainly because the knowledge is missing.</p><p>The research mainly concerns CBD taken by mouth. Skincare is absorbed to a much smaller extent, but smaller is not the same as zero, and it has not been studied. That is why we make no promises.</p>",
      tipsTitle: "If you are pregnant or breastfeeding",
      tips: [
        { title: "Ask your midwife", body: "Bring the product's ingredient list. Ours are short, which makes them easy to assess." },
        { title: "Keep the routine simple", body: "A gentle cleanse, something moisturising and sunscreen go a long way. This is not the time to try lots of new products." },
        { title: "Be careful with supplements", body: "That includes mushroom extracts such as Fungtastic. Don't start new supplements during pregnancy or breastfeeding without consulting your healthcare provider." },
        { title: "Sunscreen against pigmentation", body: "Pregnancy pigmentation gets worse with sun exposure. A mineral sunscreen is simple, gentle protection." }
      ],
      solutionTitle: "Our position",
      solutionBody: "<p>We do not recommend starting CBD or CBG skincare during pregnancy or breastfeeding without first talking to your midwife or doctor. That includes our products.</p><p>If you want a simple oil in the meantime, pure jojoba oil with no additives is a common, gentle option. If you have questions about exactly what our products contain, email us and we will send all the information you or your midwife need.</p>",
      faq: [
        { q: "Is it dangerous if I have already used CBD skincare?", a: "There are no known reports of harm from topical CBD skincare, but it has not been studied either. If you are worried, talk to your midwife. It is a perfectly reasonable question to ask." },
        { q: "Does this apply to Au Naturel Makeup Remover too?", a: "Yes, it contains 0.2% CBD. The same advice applies: talk to your midwife before using it." },
        { q: "What can I use instead?", a: "Pure jojoba oil, a gentle fragrance-free cream and mineral sunscreen make a simple, gentle base during pregnancy and breastfeeding." }
      ],
      ctaTitle: "Want the ingredient lists?",
      ctaSub: "Email info@1753skin.com and we'll send full information on every ingredient, to show your midwife."
    }
  },
  {
    svSlug: "kan-man-bli-allergisk-mot-cbd-hudvard",
    enSlug: "can-you-be-allergic-to-cbd-skincare",
    category: "question",
    productIds: ["ta-da-serum"],
    sv: {
      metaTitle: "Kan man bli allergisk mot CBD-hudvård?",
      metaDescription: "Ja, i sällsynta fall, som mot all hudvård. Så skiljer du irritation från allergi, och så testar du en ny produkt säkert.",
      kicker: "Frågor och svar",
      h1: "Kan man bli allergisk mot CBD-hudvård?",
      lead: "Kort svar: ja, i sällsynta fall, precis som mot vilken hudvård som helst. Allergi mot CBD på huden är ovanligt, men enstaka fall finns beskrivna. Den vanligaste orsaken till kontaktallergi mot kosmetika är doftämnen och vissa konserveringsmedel, och sådana saknar våra produkter.",
      problemTitle: "Irritation eller allergi?",
      problemBody: "<p>Irritation och allergi känns ofta lika men är olika saker. Irritation kommer snabbt, ofta inom minuter: det svider, bränner eller rodnar där produkten hamnat. Den går oftast över när du slutar.</p><p>En kontaktallergi kommer oftast efter ett till tre dygn. Huden kliar, blir röd och eksemartad, och utslagen kan sprida sig utanför området där produkten användes. Har du väl blivit allergisk mot ett ämne brukar det bestå.</p><p>De vanligaste orsakerna till kontaktallergi mot kosmetika är doftämnen, eteriska oljor och vissa konserveringsmedel. Därför är korta ingredienslistor ett bra skydd för den som har reagerat förut.</p>",
      tipsTitle: "Så testar du säkert",
      tips: [
        { title: "Lapptesta i 48 timmar", body: "Lägg lite produkt på insidan av armen eller bakom örat. Vänta två dygn, eftersom allergiska reaktioner kan dröja." },
        { title: "Sluta vid klåda eller utslag", body: "Kliar det, blir det rött eller små blåsor? Sluta direkt och skölj med ljummet vatten." },
        { title: "Sök vård vid kraftig reaktion", body: "Sprider sig utslagen, eller svullnar ansiktet eller läpparna, kontakta vården." },
        { title: "Gör ett allergitest", body: "Har du reagerat på flera produkter kan en hudläkare göra ett lapptest (epikutantest) som visar exakt vad du är allergisk mot." }
      ],
      solutionTitle: "Vad finns i våra produkter?",
      solutionBody: "<p>Våra ansiktsoljor innehåller ekologisk jojobaolja, CBD och CBG. TA-DA Serum innehåller jojobaolja och CBG. Au Naturel Makeup Remover innehåller MCT-olja och CBD. Inga doftämnen, inga eteriska oljor, inga konserveringsmedel.</p><p>Det gör risken lägre, men inte noll. Jojoba är inte en nöt utan fröet från en buske, och allergi mot den är ovanligt. Är du osäker, lapptesta först och kontakta oss gärna innan du köper.</p>",
      faq: [
        { q: "Kan man vara allergisk mot jojobaolja?", a: "Det är ovanligt, men det förekommer. Jojoba är inte en nöt, utan fröet från en buske. Lapptesta om du är osäker." },
        { q: "Är det normalt att det svider?", a: "Nej. En mild olja ska inte svida. Gör den det, sluta och låt huden vila." },
        { q: "Kan man vara allergisk mot hampa eller CBD?", a: "Allergi mot hampa förekommer men är ovanligt, och enstaka fall av hudreaktion på CBD finns beskrivna. Har du en känd hampallergi bör du avstå." }
      ],
      ctaTitle: "Har du reagerat på hudvård förut?",
      ctaSub: "Skriv till info@1753skin.com och berätta vad du har reagerat på. Vi hjälper dig att bedöma om våra produkter kan passa."
    },
    en: {
      metaTitle: "Can you be allergic to CBD skincare?",
      metaDescription: "Yes, in rare cases, as with any skincare. How to tell irritation from allergy, and how to test a new product safely.",
      kicker: "Questions and answers",
      h1: "Can you be allergic to CBD skincare?",
      lead: "Short answer: yes, in rare cases, just like with any skincare. Allergy to topical CBD is unusual, but individual cases have been described. The most common causes of contact allergy to cosmetics are fragrances and certain preservatives, and our products contain neither.",
      problemTitle: "Irritation or allergy?",
      problemBody: "<p>Irritation and allergy often feel similar but are different things. Irritation comes quickly, often within minutes: the skin stings, burns or flushes where the product was applied. It usually fades when you stop.</p><p>A contact allergy usually appears after one to three days. The skin itches, turns red and eczema-like, and the rash can spread beyond where the product was used. Once you have become allergic to a substance, it usually stays that way.</p><p>The most common causes of contact allergy to cosmetics are fragrances, essential oils and certain preservatives. That is why short ingredient lists are good protection for anyone who has reacted before.</p>",
      tipsTitle: "How to test safely",
      tips: [
        { title: "Patch test for 48 hours", body: "Apply a little product to the inside of your arm or behind your ear. Wait two days, because allergic reactions can be delayed." },
        { title: "Stop if it itches or you get a rash", body: "Itching, redness or small blisters? Stop immediately and rinse with lukewarm water." },
        { title: "Seek care for a strong reaction", body: "If the rash spreads, or your face or lips swell, contact a doctor." },
        { title: "Get an allergy test", body: "If you have reacted to several products, a dermatologist can do a patch test that shows exactly what you are allergic to." }
      ],
      solutionTitle: "What's in our products?",
      solutionBody: "<p>Our facial oils contain organic jojoba oil, CBD and CBG. TA-DA Serum contains jojoba oil and CBG. Au Naturel Makeup Remover contains MCT oil and CBD. No fragrance, no essential oils, no preservatives.</p><p>That lowers the risk, but not to zero. Jojoba is not a nut but the seed of a shrub, and allergy to it is rare. If you are unsure, patch test first and feel free to contact us before you buy.</p>",
      faq: [
        { q: "Can you be allergic to jojoba oil?", a: "It is rare, but it happens. Jojoba is not a nut, but the seed of a shrub. Patch test if you are unsure." },
        { q: "Is it normal for it to sting?", a: "No. A gentle oil should not sting. If it does, stop and let your skin rest." },
        { q: "Can you be allergic to hemp or CBD?", a: "Hemp allergy exists but is uncommon, and individual cases of skin reactions to CBD have been described. If you have a known hemp allergy, you should avoid it." }
      ],
      ctaTitle: "Have you reacted to skincare before?",
      ctaSub: "Email info@1753skin.com and tell us what you have reacted to. We'll help you judge whether our products could suit you."
    }
  },
];
