import type { LandingPage } from "./types";

export const LIFESTYLE_PAGES: LandingPage[] = [
  {
    svSlug: "stress-och-huden",
    enSlug: "stress-and-skin",
    esSlug: "estres-y-piel",
    deSlug: "stress-und-haut",
    frSlug: "stress-et-peau",
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
    },
    es: {
      metaTitle: "Estrés y piel – cómo el estrés afecta tu aspecto",
      metaDescription: "El estrés crónico desgasta tu piel por dentro. Descubre cómo el cortisol daña la barrera cutánea y qué puedes hacer al respecto. Conoce 1753 SKINCARE.",
      kicker: "Estilo de vida y piel",
      h1: "Estrés y piel – tu cuerpo lleva la cuenta",
      lead: "Puedes tener la mejor rutina de cuidado del mundo y aun así despertar con brotes, ojeras y un tono apagado. ¿La causa? No está en tu neceser – está en tu sistema nervioso.",
      problemTitle: "¿Qué le hace el estrés a la piel?",
      problemBody: "<p>Cuando tu cuerpo percibe peligro – ya sea un depredador o una bandeja de entrada con 200 correos sin leer – se activa el eje hipotálamo-hipófisis-suprarrenal (HPA). Las glándulas suprarrenalas inundan el cuerpo de cortisol y todo pasa a modo supervivencia. La piel, tu órgano más grande, es de las primeras en pagar el precio.</p><p>El cortisol crónicamente elevado degrada el colágeno y la elastina, las proteínas que mantienen la piel firme y elástica. La producción de sebo se dispara, los poros se obstruyen y las moléculas señalizadoras inflamatorias recorren el cuerpo. El resultado: acné, eccema, rosácea y una barrera cutánea que ya no cumple su función. La piel se vuelve reactiva, seca en la superficie pero grasa en la zona T, y cicatriza más despacio.</p><p>Investigación del departamento de dermatología de Stanford muestra que los estudiantes tienen peor piel de forma consistente en épocas de exámenes. No es casualidad – es bioquímica. Tu piel es un espejo honesto de tu estado interior, y el estrés crónico deja marcas que ninguna crema del mundo puede ocultar.</p>",
      tipsTitle: "Formas prácticas de bajar el estrés",
      tips: [
        { title: "Respira con el vientre", body: "Cuatro segundos al inhalar, siete al exhalar. La respiración diafragmática activa el sistema nervioso parasimpático y baja el cortisol en minutos. Hazlo tres veces al día – al despertar, después del almuerzo y antes de dormir." },
        { title: "Muévete a diario", body: "Una caminata de 30 minutos reduce el cortisol, aumenta el flujo sanguíneo a la piel y libera endorfinas. No tiene que ser crossfit – cualquier movimiento cuenta. El objetivo es constancia, no intensidad." },
        { title: "Pon límites a las pantallas", body: "La luz azul y la estimulación constante mantienen tu sistema nervioso en modo lucha o huida. Apaga notificaciones después de las 20:00 y deja que el cerebro baje revoluciones. Tu piel te lo agradecerá al día siguiente." },
        { title: "Escríbelo", body: "Escribir un diario ha demostrado bajar niveles de cortisol. Anota tres cosas que te preocupan y tres por las que estás agradecido. Son cinco minutos y sacan al cerebro del bucle del estrés." },
        { title: "Hongos adaptógenos", body: "Lion's mane, reishi y chaga han mostrado potencial en estudios para apoyar el sistema nervioso y reducir la inflamación ligada al estrés. Nuestro Fungtastic Mushroom Extract aporta los tres en una dosis diaria." }
      ],
      solutionTitle: "Cómo el CBD apoya la piel bajo estrés",
      solutionBody: "<p>El sistema endocannabinoide (ECS) es el equilibrio interno del cuerpo: regula el estrés, la inflamación y la respuesta inmune. Cuando el ECS funciona bien, el cuerpo gestiona el estrés sin que la piel pague el pato. El CBD interactúa con los receptores CB2 en las células de la piel y ayuda a amortiguar la cascada inflamatoria que dispara el cortisol.</p><p>Los estudios indican que el CBD puede reducir la producción de citoquinas proinflamatorias y reforzar la integridad de la barrera cutánea. Eso se traduce en piel más tranquila, menos brotes y cicatrización más rápida. Nuestro Ta-Da Serum con 10% CBD lleva esto directo a la piel, mientras Duo Ta-Da combina sérum y aceite para un apoyo máximo a la barrera.</p><p>Combínalo con Fungtastic Mushroom Extract, que actúa desde dentro con hongos adaptógenos – para quien quiere ir a la raíz del estrés, no solo tapar los síntomas.</p>",
      faq: [
        { q: "¿Con qué rapidez afecta el estrés a la piel?", a: "El cortisol sube en minutos, pero los cambios visibles en la piel suelen aparecer tras 2–3 días de estrés sostenido. El estrés crónico tiene efectos acumulativos que cuesta más reparar con el tiempo." },
        { q: "¿Puede el CBD ayudar con el acné relacionado con el estrés?", a: "Sí. El CBD tiene propiedades sebostáticas y antiinflamatorias que atacan directamente lo que el estrés desencadena en la piel – más sebo e inflamación. No sustituye gestionar el estrés, pero da a tu piel mejores cartas." },
        { q: "¿Funcionan de verdad los extractos de hongo para el estrés?", a: "Hongos adaptógenos como reishi y lion's mane han dado resultados positivos en estudios clínicos sobre marcadores de estrés y cortisol. No reemplazan otras medidas, pero pueden ser una pieza valiosa del rompecabezas." },
        { q: "¿Qué producto es mejor para la piel estresada?", a: "Empieza con Ta-Da Serum para cuidado directo y suma Fungtastic Mushroom Extract para equilibrio interior. Duo Ta-Da te da el paquete completo – sérum y aceite en una rutina." }
      ],
      ctaTitle: "Dale un respiro a tu piel estresada",
      ctaSub: "El estrés quizá no desaparezca mañana – pero la reacción de tu piel puede empezar a cambiar hoy."
    },
    de: {
      metaTitle: "Stress und Haut – wie Stress dein Aussehen beeinflusst",
      metaDescription: "Chronischer Stress zerstört deine Haut von innen. Erfahre, wie Cortisol die Hautbarriere schädigt und was du dagegen tun kannst. Entdecke 1753 SKINCARE.",
      kicker: "Lifestyle & Haut",
      h1: "Stress und Haut – dein Körper führt Buch",
      lead: "Du kannst die beste Hautpflege der Welt haben und trotzdem mit Pickeln, Augenringen und fahler Haut aufwachen. Die Ursache? Sie steht nicht im Badezimmerschrank – sie sitzt in deinem Nervensystem.",
      problemTitle: "Was macht Stress mit der Haut?",
      problemBody: "<p>Wenn dein Körper Gefahr wahrnimmt – ob Raubtier oder Posteingang mit 200 ungelesenen Mails – schaltet die hypothalamisch-hypophysär-adrenale Achse (HPA) hoch. Die Nebennieren fluten den Körper mit Cortisol und alles geht in den Überlebensmodus. Die Haut, dein größtes Organ, gehört zu den Ersten, die den Preis zahlen.</p><p>Chronisch erhöhtes Cortisol bricht Kollagen und Elastin ab, die Proteine, die die Haut straff und elastisch halten. Die Talgproduktion steigt, Poren verstopfen und entzündliche Signalstoffe fluten den Körper. Das Ergebnis: Akne, Ekzem, Rosacea und eine Hautbarriere, die ihren Job nicht mehr schafft. Die Haut wird reaktiv, trocken an der Oberfläche aber fettig in der T-Zone und heilt langsamer.</p><p>Forschung der Dermatologie in Stanford zeigt: Studierende haben in Prüfungsphasen konsequent schlechtere Haut. Kein Zufall – das ist Biochemie. Deine Haut ist ein ehrlicher Spiegel deines Inneren, und chronischer Stress hinterlässt Spuren, die keine Creme der Welt kaschieren kann.</p>",
      tipsTitle: "Praktische Wege, Stress zu senken",
      tips: [
        { title: "Bauch atmen", body: "Vier Sekunden ein, sieben aus. Zwerchfellatmung aktiviert das parasympathische Nervensystem und senkt Cortisol in wenigen Minuten. Dreimal täglich – nach dem Aufwachen, nach dem Mittagessen und vor dem Schlaf." },
        { title: "Beweg dich täglich", body: "Ein 30-Minuten-Spaziergang senkt Cortisol, steigert den Blutfluss zur Haut und setzt Endorphine frei. Muss kein Crossfit sein – jede Bewegung zählt. Ziel ist Konstanz, nicht Intensität." },
        { title: "Grenzen für Bildschirme", body: "Blaues Licht und Dauerreiz halten dein Nervensystem im Kampf-oder-Flucht-Modus. Schalte Benachrichtigungen nach 20 Uhr ab und gib dem Gehirn Abkühlzeit. Deine Haut dankt es dir am nächsten Morgen." },
        { title: "Schreib es raus", body: "Journaling senkt nachweislich Cortisol. Schreib drei Sorgen und drei Dankbarkeiten auf. Fünf Minuten – und das Gehirn springt aus der Stressschleife." },
        { title: "Adaptogene Pilze", body: "Lion's mane, Reishi und Chaga zeigen in Studien Potenzial fürs Nervensystem und gegen stressbedingte Entzündung. Unser Fungtastic Mushroom Extract liefert alle drei in einer täglichen Dosis." }
      ],
      solutionTitle: "Wie CBD die Haut unter Stress unterstützt",
      solutionBody: "<p>Das Endocannabinoidsystem (ECS) ist dein inneres Gleichgewicht – es regelt Stress, Entzündung und Immunantwort. Wenn das ECS optimal läuft, bewältigt der Körper Stress, ohne dass die Haut drunterleidet. CBD wirkt auf CB2-Rezeptoren in Hautzellen und dämpft die Entzündungskaskade, die Cortisol auslöst.</p><p>Studien zeigen: CBD kann proinflammatorische Zytokine reduzieren und die Hautbarriere stärken. Das bedeutet ruhigere Haut, weniger Ausbrüche und schnellere Heilung. Unser Ta-Da Serum mit 10% CBD bringt das direkt auf die Haut, Duo Ta-Da kombiniert Serum und Öl für maximale Barrierenunterstützung.</p><p>Ergänze mit Fungtastic Mushroom Extract – von innen mit adaptogenen Pilzen, für alle, die Stress an der Wurzel packen wollen, nicht nur die Symptome flicken.</p>",
      faq: [
        { q: "Wie schnell wirkt sich Stress auf die Haut aus?", a: "Cortisol steigt in Minuten, sichtbare Hautveränderungen zeigen sich meist nach 2–3 Tagen anhaltenden Stresses. Chronischer Stress wirkt kumulativ und wird mit der Zeit schwerer zu reparieren." },
        { q: "Kann CBD bei stressbedingter Akne helfen?", a: "Ja. CBD hat sebostatische und entzündungshemmende Eigenschaften und trifft genau die Mechanismen, die Stress in der Haut auslöst – mehr Talg und Entzündung. Es ersetzt kein Stressmanagement, aber es verbessert die Ausgangslage für die Haut." },
        { q: "Wirken Pilzextrakte wirklich gegen Stress?", a: "Adaptogene Pilze wie Reishi und lion's mane zeigen in klinischen Studien positive Effekte auf Stressmarker und Cortisol. Sie ersetzen nichts anderes, können aber ein wertvolles Puzzleteil sein." },
        { q: "Welches Produkt ist am besten für gestresste Haut?", a: "Starte mit Ta-Da Serum für direkte Pflege und ergänze Fungtastic Mushroom Extract für inneres Gleichgewicht. Duo Ta-Da gibt dir das Komplettpaket – Serum und Öl in einer Routine." }
      ],
      ctaTitle: "Gib deiner gestressten Haut eine Pause",
      ctaSub: "Der Stress verschwindet vielleicht nicht morgen – aber die Reaktion deiner Haut kann schon heute umschwenken."
    },
    fr: {
      metaTitle: "Stress et peau – comment le stress affecte ton apparence",
      metaDescription: "Le stress chronique abîme ta peau de l'intérieur. Comprends comment le cortisol endommage la barrière cutanée et ce que tu peux faire. Découvre 1753 SKINCARE.",
      kicker: "Mode de vie & peau",
      h1: "Stress et peau – ton corps tient les comptes",
      lead: "Tu peux avoir la meilleure routine skincare au monde et te réveiller quand même avec des poussées, des cernes et un teint terne. La cause ? Elle n'est pas dans ta trousse – elle est dans ton système nerveux.",
      problemTitle: "Que fait le stress à la peau ?",
      problemBody: "<p>Quand ton corps perçoit un danger – prédateur ou boîte mail avec 200 mails non lus – l'axe hypothalamo-hypophyso-surrénalien (HPA) s'active. Les surrénales inondent le corps de cortisol et tout passe en mode survie. La peau, ton plus grand organe, est parmi les premières à payer le prix.</p><p>Un cortisol chroniquement élevé dégrade le collagène et l'élastine, les protéines qui gardent la peau ferme et souple. La production de sébum grimpe, les pores se bouchent et les molécules signalant l'inflammation circulent. Résultat : acné, eczéma, rosacée et une barrière cutanée qui ne fait plus son job. La peau devient réactive, sèche en surface mais grasse en zone T, et guérit plus lentement.</p><p>La recherche du service de dermatologie de Stanford montre que les étudiants ont systématiquement une peau plus mauvaise aux examens. Ce n'est pas le hasard – c'est de la biochimie. Ta peau est un miroir honnête de ton état intérieur, et le stress chronique laisse des marques qu'aucune crème au monde ne peut masquer.</p>",
      tipsTitle: "Des gestes concrets pour baisser le stress",
      tips: [
        { title: "Respire avec le ventre", body: "Quatre secondes à l'inspiration, sept à l'expiration. La respiration diaphragmatique active le système nerveux parasympathique et fait chuter le cortisol en quelques minutes. Trois fois par jour – au réveil, après le déjeuner et avant le sommeil." },
        { title: "Bouge chaque jour", body: "Une marche de 30 minutes baisse le cortisol, augmente le flux sanguin vers la peau et libère des endorphines. Pas besoin de crossfit – tout mouvement compte. L'objectif, c'est la régularité, pas l'intensité." },
        { title: "Cadre tes écrans", body: "La lumière bleue et la stimulation permanente maintiennent ton système nerveux en mode combat-fuite. Coupe les notifications après 20 h et laisse ton cerveau redescendre. Ta peau te dira merci le lendemain." },
        { title: "Écris-le", body: "Le journal a prouvé qu'il fait baisser le cortisol. Note trois inquiétudes et trois gratitudes. Cinq minutes – et le cerveau sort de la boucle du stress." },
        { title: "Champignons adaptogènes", body: "Lion's mane, reishi et chaga promettent dans les études pour le système nerveux et l'inflammation liée au stress. Notre Fungtastic Mushroom Extract livre les trois en une dose quotidienne." }
      ],
      solutionTitle: "Comment le CBD soutient la peau sous stress",
      solutionBody: "<p>Le système endocannabinoïde (ECS) est l'équilibre interne du corps – stress, inflammation, immunité. Quand l'ECS fonctionne bien, le corps gère le stress sans que la peau trinque. Le CBD interagit avec les récepteurs CB2 des cellules de la peau et aide à amortir la cascade inflammatoire déclenchée par le cortisol.</p><p>Les études suggèrent que le CBD peut réduire les cytokines pro-inflammatoires tout en renforçant la barrière cutanée. Peau plus calme, moins de poussées, cicatrisation plus rapide. Notre Ta-Da Serum à 10 % de CBD apporte ça directement sur la peau, tandis que Duo Ta-Da combine sérum et huile pour un soutien barrière maximal.</p><p>Associe Fungtastic Mushroom Extract, qui agit de l'intérieur avec des champignons adaptogènes – pour celles et ceux qui veulent traiter le stress à la racine, pas seulement colmater les symptômes.</p>",
      faq: [
        { q: "À quelle vitesse le stress affecte-t-il la peau ?", a: "Le cortisol monte en minutes, mais les changements visibles apparaissent souvent après 2–3 jours de stress soutenu. Le stress chronique s'accumule et devient plus difficile à réparer avec le temps." },
        { q: "Le CBD peut-il aider l'acné liée au stress ?", a: "Oui. Le CBD a des propriétés sébostatiques et anti-inflammatoires qui ciblent ce que le stress déclenche dans la peau – sébum accru et inflammation. Ça ne remplace pas la gestion du stress, mais ça donne à ta peau de meilleures chances." },
        { q: "Les extraits de champignon marchent-ils vraiment sur le stress ?", a: "Des champignons adaptogènes comme le reishi et le lion's mane montrent des résultats positifs dans des études cliniques sur les marqueurs de stress et le cortisol. Ils ne remplacent pas d'autres efforts, mais peuvent être une pièce utile du puzzle." },
        { q: "Quel produit pour une peau stressée ?", a: "Commence par Ta-Da Serum pour un soin direct et ajoute Fungtastic Mushroom Extract pour l'équilibre intérieur. Duo Ta-Da te donne le pack complet – sérum et huile dans une routine." }
      ],
      ctaTitle: "Fais une pause à ta peau stressée",
      ctaSub: "Le stress ne disparaîtra peut-être pas demain – mais la réaction de ta peau peut déjà changer aujourd'hui."
    }
  },
  {
    svSlug: "somn-och-huden",
    enSlug: "sleep-and-skin",
    esSlug: "sueno-y-piel",
    deSlug: "schlaf-und-haut",
    frSlug: "sommeil-et-peau",
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
    },
    es: {
      metaTitle: "Sueño y piel – por qué la falta de sueño se nota en la cara",
      metaDescription: "Mal dormir envejece la piel más rápido que el sol. Descubre cómo el sueño repara la piel por la noche y cómo optimizar tu beauty sleep. 1753 SKINCARE.",
      kicker: "Estilo de vida y piel",
      h1: "Sueño y piel – tu rutina skincare más importante ocurre en la cama",
      lead: "Ningún sérum del mundo compensa la falta de sueño. De noche, la piel se repara, se renueva y se desintoxica. Si rompes ese proceso, pagas con arrugas, ojeras y un tono que nunca despierta del todo.",
      problemTitle: "¿Qué le pasa a la piel mientras duermes?",
      problemBody: "<p>Entre las 23:00 y las 03:00 el cuerpo entra en las fases de sueño más profundas, y ahí ocurre la magia. La hormona del crecimiento (HGH) se libera en pulsos e impulsa la división celular y la síntesis de colágeno. El flujo sanguíneo a la piel puede subir hasta un 25 por ciento, y las células dañadas se reparan a un ritmo imposible de día.</p><p>La privación de sueño sabotea todo eso. Tras una sola noche con menos de seis horas, sube el cortisol, se debilita la barrera cutánea y aumenta la pérdida transepidérmica de agua (TEWL) – la piel literalmente pierde humedad. El sueño crónico insuficiente acelera el envejecimiento cutáneo: investigadores del University Hospitals Case Medical Center estiman hasta un 30 por ciento más rápido frente a quien duerme 7–9 horas.</p><p>Se nota. Estudios con reconocimiento facial muestran que la gente juzga a quien duerme poco como más enfermo, más triste y menos atractivo. Ojeras, comisuras caídas, piel más pálida. No dicen beauty sleep por nada.</p>",
      tipsTitle: "Optimiza el sueño para una piel mejor",
      tips: [
        { title: "Horarios fijos", body: "Acuéstate y levántate a la misma hora todos los días – también el fin de semana. Tu reloj circadiano marca cuándo se repara la piel; horarios irregulares lo desajustan todo." },
        { title: "Oscuridad total en el dormitorio", body: "Hasta luces pequeñas – standby, farolas filtrando – alteran la melatonina. Cortinas blackout o antifaz. La melatonina además es un antioxidante potente para la piel." },
        { title: "Baja la temperatura", body: "Lo ideal: 16–18 °C. El cuerpo necesita bajar la temperatura central para dormir; una habitación fresca ayuda. Bonus: menos sudores nocturnos que irritan la piel." },
        { title: "Evita pantallas la última hora", body: "La luz azul de móvil y ordenador retrasa la melatonina hasta 90 minutos. Cambia por un libro, estiramientos o una rutina nocturna tranquila con skincare." },
        { title: "Apoya el sueño con adaptógenos", body: "El reishi es tradicionalmente el hongo del sueño y en estudios mejora la calidad del descanso. Nuestro Fungtastic Mushroom Extract incluye reishi junto a lion's mane y chaga." }
      ],
      solutionTitle: "Skincare nocturno con CBD",
      solutionBody: "<p>La noche es el momento perfecto para dar CBD a la piel. Durante el sueño la piel es más receptiva a los activos y el flujo sanguíneo pico. Las propiedades antiinflamatorias del CBD encajan con la reparación natural y ayudan a recuperar mejor.</p><p>Nuestro Ta-Da Serum antes de dormir aporta una dosis concentrada de CBD en sintonía con el ciclo nocturno. Duo Ta-Da añade una capa de aceite que reduce la TEWL – clave si duermes en ambientes secos o con calefacción en invierno.</p><p>Suma Fungtastic Mushroom Extract en tu rutina de noche. El reishi apoya la relajación y el sueño; lion's mane y chaga trabajan inmunidad e inflamación mientras descansas.</p>",
      faq: [
        { q: "¿Cuántas horas de sueño necesita la piel?", a: "La investigación apunta a 7–9 horas en adultos. En ese tiempo la piel completa ciclos de reparación. Menos de seis horas de forma constante perjudica la barrera y el envejecimiento." },
        { q: "¿El CBD ayuda con el insomnio?", a: "El CBD interactúa con receptores que regulan el ciclo sueño-vigilia. Muchas personas notan mejor descanso, aunque varía. No sustituye higiene del sueño, pero puede complementar." },
        { q: "¿Debo aplicar sérum CBD antes de dormir?", a: "Sí. La noche es óptima: la piel está en modo reparación y el flujo es mayor. Aplica Ta-Da Serum como último paso de tu rutina nocturna." },
        { q: "¿Influye la funda de almohada?", a: "Sí. Algodón y seda natural funcionan mejor. Cambia al menos dos veces por semana. Los sintéticos atrapan calor y humedad y favorecen bacterias." }
      ],
      ctaTitle: "Duerme hacia una piel mejor",
      ctaSub: "La reparación nocturna es gratis – pero el skincare adecuado antes de dormir la multiplica."
    },
    de: {
      metaTitle: "Schlaf und Haut – warum Schlafmangel im Gesicht sichtbar wird",
      metaDescription: "Schlechter Schlaf altert die Haut schneller als Sonnenschäden. Erfahre, wie Schlaf die Haut nachts repariert und wie du deinen Beauty-Sleep optimierst. 1753 SKINCARE.",
      kicker: "Lifestyle & Haut",
      h1: "Schlaf und Haut – die wichtigste Hautpflege passiert im Bett",
      lead: "Kein Serum der Welt gleicht Schlafmangel aus. Nachts repariert, erneuert und entgiftet sich die Haut. Störst du den Prozess, zahlst du mit Falten, Augenringen und einem Teint, der nie richtig wach wird.",
      problemTitle: "Was passiert mit der Haut beim Schlaf?",
      problemBody: "<p>Zwischen 23 und 3 Uhr erreicht der Körper die tiefsten Schlafphasen – dann passiert die Magie. Wachstumshormon (HGH) wird pulsartig freigesetzt, startet Zellteilung und Kollagensynthese. Der Blutfluss zur Haut steigt um bis zu 25 Prozent, beschädigte Zellen werden in einem Tempo repariert, das tagsüber unmöglich ist.</p><p>Schlafentzug sabotiert das Ganze. Schon nach einer Nacht unter sechs Stunden steigt Cortisol, die Hautbarriere schwächt und der transepidermale Wasserverlust (TEWL) steigt – die Haut verliert buchstäblich Feuchtigkeit. Chronischer Schlafmangel beschleunigt Hautalterung: Forscher am University Hospitals Case Medical Center schätzen bis zu 30 Prozent schneller im Vergleich zu 7–9 Stunden Schlaf.</p><p>Man sieht es. Studien mit Gesichtserkennung zeigen: Schlafdeprivierte werden konsequent als kränker, trauriger und weniger attraktiv bewertet. Augenringe, hängende Mundwinkel, blassere Haut. Nicht umsonst heißt es Beauty Sleep.</p>",
      tipsTitle: "Schlaf optimieren für bessere Haut",
      tips: [
        { title: "Feste Zeiten", body: "Jeden Tag zur gleichen Zeit ins Bett und aufstehen – auch am Wochenende. Deine innere Uhr steuert die Hautreparatur; Chaos im Rhythmus wirft alles aus dem Takt." },
        { title: "Schlafzimmer stockdunkel", body: "Schon kleine Lichtquellen – Standby, Straßenlaternen – stören Melatonin. Verdunkelungsvorhang oder Schlafmaske. Melatonin ist zudem ein starkes Antioxidans für die Haut." },
        { title: "Temperatur runter", body: "Optimal: 16–18 °C. Der Körper muss die Kerntemperatur senken zum Einschlafen; kühler Raum hilft. Bonus: weniger nächtliches Schwitzen, das die Haut reizt." },
        { title: "Letzte Stunde ohne Bildschirm", body: "Blaues Licht von Handy und PC verzögert Melatonin bis zu 90 Minuten. Wechsel zu Buch, Stretching oder ruhiger Abendroutine mit Skincare." },
        { title: "Schlaf mit Adaptogenen stützen", body: "Reishi gilt traditionell als Schlafpilz und verbessert in Studien die Schlafqualität. Unser Fungtastic Mushroom Extract enthält Reishi plus lion's mane und Chaga." }
      ],
      solutionTitle: "Nachtpflege mit CBD",
      solutionBody: "<p>Die Nacht ist ideal für CBD auf der Haut. Im Schlaf ist die Haut am empfänglichsten für Wirkstoffe, der Blutfluss ist hoch. CBDs entzündungshemmende Wirkung passt zur natürlichen Reparatur und unterstützt die Erholung.</p><p>Unser Ta-Da Serum vor dem Schlaf liefert eine konzentrierte CBD-Dosis im Takt der Nachtreparatur. Duo Ta-Da legt eine Ölschicht auf, die den TEWL senkt – besonders wichtig in trockenen Räumen oder mit Heizung im Winter.</p><p>Ergänze mit Fungtastic Mushroom Extract am Abend. Reishi unterstützt Entspannung und Schlaf, lion's mane und Chaga arbeiten an Immunbalance und Entzündung über die Nacht.</p>",
      faq: [
        { q: "Wie viele Stunden Schlaf braucht die Haut?", a: "Die Forschung sagt 7–9 Stunden für Erwachsene. In der Zeit laufen volle Reparaturzyklen. Unter sechs Stunden dauerhaft schadet Barriere und Alterung." },
        { q: "Hilft CBD bei Schlafproblemen?", a: "CBD wirkt auf Rezeptoren, die den Schlaf-Wach-Rhythmus steuern. Viele berichten von besserer Qualität, Effekte variieren. Es ersetzt keine Schlafhygiene, kann aber ergänzen." },
        { q: "CBD-Serum vor dem Schlafen?", a: "Ja. Nacht ist optimal: Haut im Reparaturmodus, erhöhter Blutfluss. Ta-Da Serum als letzter Schritt der Abendroutine." },
        { q: "Beeinflusst das Kissenbezug die Haut?", a: "Ja. Baumwolle und Seide in Naturmaterialien sind am besten. Mindestens zweimal pro Woche wechseln. Synthetik kann Wärme und Feuchtigkeit einschließen – Nährboden für Bakterien." }
      ],
      ctaTitle: "Schlaf dich zu besserer Haut",
      ctaSub: "Nachtreparatur kostet nichts – die richtige Pflege vor dem Einschlafen macht sie unendlich wirksamer."
    },
    fr: {
      metaTitle: "Sommeil et peau – pourquoi le manque de sommeil se voit sur le visage",
      metaDescription: "Mal dormir vieillit la peau plus vite que le soleil. Comprends comment le sommeil répare la peau la nuit et comment optimiser ton beauty sleep. 1753 SKINCARE.",
      kicker: "Mode de vie & peau",
      h1: "Sommeil et peau – ta routine skincare la plus importante, c'est au lit",
      lead: "Aucun sérum au monde ne compense le manque de sommeil. La nuit, la peau se répare, se renouvelle et se détoxe. Si tu coupes ce processus, tu paies en rides, cernes et teint qui ne se réveille jamais vraiment.",
      problemTitle: "Que se passe-t-il pour la peau pendant le sommeil ?",
      problemBody: "<p>Entre 23 h et 3 h, le corps atteint ses phases de sommeil les plus profondes – c'est là que la magie opère. L'hormone de croissance (HGH) est libérée par à-coups, lance la division cellulaire et la synthèse du collagène. Le flux sanguin vers la peau peut augmenter jusqu'à 25 %, et les cellules endommagées se réparent à un rythme impossible de jour.</p><p>La privation de sommeil sabote tout ça. Après une seule nuit à moins de six heures, le cortisol monte, la barrière faiblit et les pertes d'eau transepidermiques (TEWL) augmentent – la peau fuit littéralement son hydratation. Le manque chronique accélère le vieillissement cutané : des chercheurs du University Hospitals Case Medical Center estiment jusqu'à 30 % plus vite que pour 7–9 h de sommeil.</p><p>Ça se voit. Des études avec reconnaissance faciale montrent qu'on juge les personnes privées de sommeil plus malades, plus tristes, moins attirantes. Cernes, commissures tombantes, teint plus pâle. On n'appelle pas ça beauty sleep pour rien.</p>",
      tipsTitle: "Optimise ton sommeil pour une meilleure peau",
      tips: [
        { title: "Des horaires réguliers", body: "Coucher et lever aux mêmes heures tous les jours – week-end inclus. Ton horloge circadienne pilote la réparation de la peau ; l'irrégularité déséquilibre tout." },
        { title: "Chambre noire comme dans un four", body: "Même une petite lumière – veilleuse, rue – perturbe la mélatonine. Rideaux occultants ou masque. La mélatonine est aussi un antioxydant puissant pour la peau." },
        { title: "Baisse la température", body: "Idéal : 16–18 °C. Le corps doit baisser sa température centrale pour s'endormir ; une pièce fraîche aide. Bonus : moins de sueurs nocturnes qui irritent la peau." },
        { title: "Pas d'écrans la dernière heure", body: "La lumière bleue des téléphones et ordis retarde la mélatonine jusqu'à 90 min. Passe à un livre, des étirements ou une routine du soir calme avec skincare." },
        { title: "Soutiens le sommeil avec des adaptogènes", body: "Le reishi est traditionnellement le champignon du sommeil et améliore la qualité du repos dans les études. Notre Fungtastic Mushroom Extract associe reishi, lion's mane et chaga." }
      ],
      solutionTitle: "Soin de nuit au CBD",
      solutionBody: "<p>La nuit est le moment idéal pour du CBD sur la peau. Pendant le sommeil, elle est la plus réceptive aux actifs et le flux sanguin est maximal. L'action anti-inflammatoire du CBD s'aligne sur la réparation naturelle et aide à mieux récupérer.</p><p>Notre Ta-Da Serum avant le coucher apporte une dose concentrée de CBD en phase avec le cycle nocturne. Duo Ta-Da ajoute une couche d'huile qui réduit la TEWL – surtout si tu dors dans un air sec ou avec le chauffage en hiver.</p><p>Ajoute Fungtastic Mushroom Extract le soir. Le reishi soutient détente et sommeil ; lion's mane et chaga travaillent immunité et inflammation pendant la nuit.</p>",
      faq: [
        { q: "Combien d'heures de sommeil pour la peau ?", a: "La recherche indique 7–9 h chez l'adulte. La peau boucle des réparations complètes. Moins de six heures de façon régulière nuit à la barrière et au vieillissement." },
        { q: "Le CBD aide-t-il à dormir ?", a: "Le CBD agit sur des récepteurs qui régulent le cycle veille-sommeil. Beaucoup rapportent un meilleur sommeil, avec des effets variables. Ça ne remplace pas l'hygiène de sommeil mais peut compléter." },
        { q: "Appliquer le sérum CBD avant de dormir ?", a: "Oui. La nuit est optimale : peau en mode réparation, flux élevé. Ta-Da Serum en dernier geste de ta routine du soir." },
        { q: "Ta taie d'oreiller influence-t-elle la peau ?", a: "Oui. Coton et soie naturels sont les meilleurs. Change au moins deux fois par semaine. Le synthétique piège chaleur et humidité – terrain bactérien." }
      ],
      ctaTitle: "Dors-toi une peau meilleure",
      ctaSub: "La réparation nocturne est gratuite – le bon soin avant de dormir la rend infiniment plus efficace."
    }
  },
  {
    svSlug: "kost-och-huden",
    enSlug: "diet-and-skin",
    esSlug: "alimentacion-y-piel",
    deSlug: "ernaehrung-und-haut",
    frSlug: "alimentation-et-peau",
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
    },
    es: {
      metaTitle: "Alimentación y piel – la comida que mejora tu cutis",
      metaDescription: "Tu piel refleja tu plato. Descubre qué alimentos dan luminosidad y cuáles sabotean el cutis. Guía con base científica de 1753 SKINCARE.",
      kicker: "Estilo de vida y piel",
      h1: "Alimentación y piel – literalmente eres lo que comes",
      lead: "Cada célula de piel que tienes hoy se construyó con lo que comiste hace meses. El colágeno pide vitamina C. Las membranas celulares piden omega-3. La barrera quiere zinc. Lo que pones en el plato es la rutina skincare más infravalorada que existe.",
      problemTitle: "¿Cómo afecta la comida a la piel?",
      problemBody: "<p>La piel es un órgano metabólicamente activo que necesita un flujo constante de nutrientes. Cada día se renuevan millones de células, y la materia prima sale solo de lo que comes y bebes. Si la dieta falla, se nota – primero despacio, luego sin piedad.</p><p>La dieta occidental, rica en azúcar refinado, aceites vegetales procesados y ultraprocesados, empuja la inflamación sistémica que se traduce en la piel. Un índice glucémico alto sube insulina e IGF-1, estimula sebo y proliferación celular – tormenta perfecta para el acné. Los lácteos, sobre todo la leche desnatada, se han ligado a más acné en estudios epidemiológicos, probablemente vía señales hormonales.</p><p>Al mismo tiempo, a muchos les faltan ácidos grasos esenciales, antioxidantes y minerales. La falta de zinc va con acné y peor cicatrización. Pocos omega-3, piel más seca e inflamada. Falta de vitamina A, peor renovación celular. La piel dice la verdad sobre tu dieta – no puede mentir.</p>",
      tipsTitle: "Comidas que dan brillo a la piel",
      tips: [
        { title: "Come el arcoíris", body: "Verduras y frutos rojos, naranjas, verdes y morados van cargados de antioxidantes que protegen frente al estrés oxidativo. El betacaroteno de boniato y zanahoria aporta un brillo sano y natural." },
        { title: "Prioriza omega-3", body: "Pescado graso, nueces, linaza y chía aportan los ácidos grasos que fortalecen membranas. El omega-3 es antiinflamatorio directo y ayuda a retener elasticidad y humedad." },
        { title: "Baja azúcar y harina blanca", body: "Los carbohidratos rápidos disparan la glicación: el azúcar se pega al colágeno y lo vuelve rígido y quebradizo. Son las AGEs (advanced glycation end-products) y envejecen la piel por dentro." },
        { title: "Fermentados cada día", body: "Chucrut, kimchi, kéfir y kombucha alimentan la flora buena que, vía eje intestino-piel, baja la inflamación cutánea. Tripa sana, piel más feliz." },
        { title: "Bebe suficiente agua", body: "La piel es un 64 por ciento agua. La deshidratación leve crónica la deja opaca y menos elástica. Apunta a 2–3 litros al día, más si entrenas o tomas café." }
      ],
      solutionTitle: "CBD y nutrición – estrategia doble",
      solutionBody: "<p>Mientras la dieta construye células por dentro, el CBD protege por fuera. El ECS regula inflamación, sebo y renovación – procesos que la comida mueve a su manera. El CBD apoya ese sistema y ayuda a la piel a gestionar las señales inflamatorias que una dieta imperfecta a veces envía.</p><p>Ta-Da Serum con 10% CBD lleva protección antiinflamatoria directa y refuerza la barrera. Duo Ta-Da une sérum y aceite para activos más lípidos que refuerzan membranas – como el omega-3 hace desde dentro.</p><p>Es sinergia. Buena comida da materia prima. El CBD da equilibrio. Juntos, el efecto es mayor que la suma de partes.</p>",
      faq: [
        { q: "¿Qué comida es peor para la piel?", a: "Azúcar refinado, ultraprocesados y aceites vegetales industriales encabezan la lista. Impulsan inflamación, glicación y estrés oxidativo – tres vías que dañan y envejecen la piel." },
        { q: "¿La dieta puede mejorar el acné de verdad?", a: "Sí. Estudios muestran que una dieta de bajo índice glucémico rica en verduras, proteína y grasa de calidad puede bajar el acné hasta un 50 por ciento en 12 semanas. No sustituye skincare, pero sienta una base fuerte." },
        { q: "¿Cuánto tarda en verse el cambio?", a: "Las células se renuevan en unas 28 días, pero cambios profundos en colágeno e inflamación tardan 2–3 meses. Dale tiempo – estás construyendo piel nueva desde cero." },
        { q: "¿Debo tomar suplementos para la piel?", a: "Lo ideal es comerlo. Pero zinc, omega-3 y vitamina D tienen buen respaldo en estudios para problemas de piel. Consulta a un profesional si dudas." }
      ],
      ctaTitle: "Construye mejor piel por dentro y por fuera",
      ctaSub: "El plato es la base. El skincare CBD es el refuerzo. Juntos dan a tu piel lo que necesita."
    },
    de: {
      metaTitle: "Ernährung und Haut – das Essen für bessere Haut",
      metaDescription: "Deine Haut spiegelt deinen Teller. Erfahre, welche Lebensmittel Strahlung geben und welche deinen Teint sabotieren. Wissenschaftlich fundiert von 1753 SKINCARE.",
      kicker: "Lifestyle & Haut",
      h1: "Ernährung und Haut – du bist buchstäblich, was du isst",
      lead: "Jede Hautzelle, die du heute hast, wurde aus dem gebaut, was du vor Monaten gegessen hast. Kollagen braucht Vitamin C. Zellmembranen brauchen Omega-3. Die Barriere will Zink. Was du auf den Teller legst, ist die unterschätzteste Hautpflege überhaupt.",
      problemTitle: "Wie beeinflusst Essen die Haut?",
      problemBody: "<p>Die Haut ist ein stoffwechselaktives Organ und braucht einen steten Strom an Nährstoffen. Täglich erneuern sich Millionen Hautzellen – das Rohmaterial kommt ausschließlich aus Ernährung und Flüssigkeit. Wenn die Ernährung fehlt, sieht man es – erst langsam, dann gnadenlos.</p><p>Die westliche Ernährung, reich an raffiniertem Zucker, verarbeiteten Pflanzenölen und Ultra-Processed Food, treibt systemische Entzündung, die sich in der Haut zeigt. Hoher glykämischer Index hebt Insulin und IGF-1, stimuliert Talg und Zellwachstum – perfekter Sturm für Akne. Milchprodukte, besonders Magermilch, wurden in Studien mit mehr Akne verknüpft, vermutlich über hormonelle Wege.</p><p>Gleichzeitig fehlen vielen essentielle Fettsäuren, Antioxidantien und Mineralien. Zinkmangel hängt mit Akne und langsamer Wundheilung zusammen. Wenig Omega-3: trockenere, entzündlichere Haut. Vitamin-A-Mangel beeinträchtigt die Erneuerung. Die Haut erzählt die Wahrheit über deine Ernährung – sie kann nicht lügen.</p>",
      tipsTitle: "Lebensmittel, die der Haut Strahlung geben",
      tips: [
        { title: "Iss den Regenbogen", body: "Rot, orange, grün, lila – Gemüse und Beeren voller Antioxidantien gegen oxidativen Stress. Beta-Carotin aus Süßkartoffel und Karotte gibt zusätzlich einen natürlichen, frischen Glow." },
        { title: "Omega-3 priorisieren", body: "Fetter Fisch, Walnüsse, Leinsamen und Chia liefern die essentiellen Fettsäuren für starke Membranen. Omega-3 ist direkt entzündungshemmend und hilft Feuchtigkeit und Elastizität zu halten." },
        { title: "Zucker und Weißmehl reduzieren", body: "Schnelle Kohlenhydrate triggern Glykation: Zucker bindet an Kollagen und macht es steif und spröde. Das sind AGEs (advanced glycation end-products) – sie altern die Haut von innen." },
        { title: "Täglich fermentiertes", body: "Sauerkraut, Kimchi, Kefir, Kombucha nähren gute Darmbakterien, die über die Darm-Haut-Achse die Hautentzündung beeinflussen. Gesunder Darm, gesündere Haut." },
        { title: "Genug Wasser trinken", body: "Haut besteht zu 64 Prozent aus Wasser. Chronische leichte Dehydrierung macht sie matter und weniger elastisch. Ziel 2–3 Liter täglich, mehr bei Sport oder Kaffee." }
      ],
      solutionTitle: "CBD und Ernährung – Doppelstrategie",
      solutionBody: "<p>Während die Ernährung Zellen von innen aufbaut, schützt CBD von außen. Das ECS steuert Entzündung, Talg und Erneuerung – alles, was die Ernährung mitbeeinflusst. CBD unterstützt dieses System und hilft der Haut, entzündliche Signale einer unperfekten Ernährung besser zu fangen.</p><p>Ta-Da Serum mit 10% CBD liefert direkten entzündungshemmenden Schutz und stärkt die Barriere. Duo Ta-Da kombiniert Serum und Öl, damit die Haut Wirkstoffe und Lipide bekommt, die Membranen stärken – wie Omega-3 von innen.</p><p>Es geht um Synergie. Gute Ernährung liefert Rohstoffe. CBD liefert Balance. Zusammen wirkt es stärker als die Summe der Teile.</p>",
      faq: [
        { q: "Welches Essen ist am schlechtesten für die Haut?", a: "Raffinierter Zucker, Ultra-Processed Food und industrielle Pflanzenöle führen die Liste an. Sie treiben Entzündung, Glykation und oxidativen Stress – drei Wege, die Haut zu schädigen und zu altern." },
        { q: "Kann Ernährung Akne wirklich verbessern?", a: "Ja. Studien zeigen: low-glykämische Ernährung mit Gemüse, Protein und guten Fetten kann Akne nach 12 Wochen um bis zu 50 Prozent senken. Es ersetzt keine Hautpflege, aber legt ein starkes Fundament." },
        { q: "Wie lange bis man Ergebnisse sieht?", a: "Hautzellen erneuern sich in etwa 28 Tagen, tiefere Veränderungen an Kollagen und Entzündung brauchen 2–3 Monate. Gib Zeit – du baust neue Haut von Grund auf." },
        { q: "Soll ich Nahrungsergänzung für die Haut nehmen?", a: "Am besten über die Ernährung. Aber Zink, Omega-3 und Vitamin D haben starke Studienlage bei Hautproblemen. Frag im Zweifel eine Fachperson." }
      ],
      ctaTitle: "Baue bessere Haut von innen und außen",
      ctaSub: "Der Teller ist das Fundament. CBD-Skincare ist der Verstärker. Zusammen geben sie der Haut alles, was sie braucht."
    },
    fr: {
      metaTitle: "Alimentation et peau – ce qui te donne un meilleur teint",
      metaDescription: "Ta peau reflète ton assiette. Découvre quels aliments apportent de l'éclat et lesquels sabotent le teint. Guide fondé sur la science par 1753 SKINCARE.",
      kicker: "Mode de vie & peau",
      h1: "Alimentation et peau – tu es littéralement ce que tu manges",
      lead: "Chaque cellule de peau que tu as aujourd'hui a été fabriquée avec ce que tu as mangé il y a quelques mois. Le collagène veut de la vitamine C. Les membranes veulent des oméga-3. La barrière veut du zinc. Ce que tu mets dans l'assiette est la routine skincare la plus sous-estimée qui soit.",
      problemTitle: "Comment la nourriture affecte-t-elle la peau ?",
      problemBody: "<p>La peau est un organe métaboliquement actif qui exige un flux constant de nutriments. Chaque jour, des millions de cellules se renouvellent – la matière première vient uniquement de ce que tu manges et bois. Quand l'alimentation faiblit, ça se voit – d'abord lentement, puis sans pitié.</p><p>Le régime occidental, riche en sucre raffiné, huiles végétales transformées et ultra-transformés, pousse l'inflammation systémique qui se lit sur la peau. Un index glycémique élevé monte insuline et IGF-1, stimule sébum et prolifération cellulaire – tempête parfaite pour l'acné. Les produits laitiers, surtout écrémés, sont liés à plus d'acné dans des études, probablement via des voies hormonales.</p><p>En parallèle, beaucoup manquent d'acides gras essentiels, d'antioxydants et de minéraux. Carence en zinc : acné et cicatrisation plus lente. Peu d'oméga-3 : peau plus sèche et inflammée. Manque de vitamine A : renouvellement cellulaire en baisse. La peau dit la vérité sur ton alimentation – elle ne peut pas mentir.</p>",
      tipsTitle: "Les aliments qui donnent de l'éclat",
      tips: [
        { title: "Mange l'arc-en-ciel", body: "Légumes et fruits rouges, orange, verts, violets : antioxidants contre le stress oxydatif. Le bêta-carotène de patate douce et carotte ajoute un glow naturel et sain." },
        { title: "Priorité aux oméga-3", body: "Poissons gras, noix, graines de lin et chia apportent les acides gras qui solidifient les membranes. Les oméga-3 sont anti-inflammatoires directement et aident à garder souplesse et hydratation." },
        { title: "Réduis sucre et farine blanche", body: "Les glucides rapides déclenchent la glycation : le sucre se fixe au collagène et le rend rigide et cassant. Ce sont les AGEs (advanced glycation end-products) – elles vieillissent la peau de l'intérieur." },
        { title: "Fermentés au quotidien", body: "Choucroute, kimchi, kéfir, kombucha nourrissent les bonnes bactéries intestinales qui, via l'axe intestin-peau, modulent l'inflammation cutanée. Un intestin sain, une peau plus sereine." },
        { title: "Bois assez d'eau", body: "La peau est à 64 % d'eau. Une déshydratation légère chronique la rend terne et moins élastique. Vise 2–3 litres par jour, plus si tu t'entraînes ou bois du café." }
      ],
      solutionTitle: "CBD et nutrition – double stratégie",
      solutionBody: "<p>Pendant que l'alimentation construit les cellules de l'intérieur, le CBD protège de l'extérieur. L'ECS règle inflammation, sébum et renouvellement – des processus que l'assiette influence. Le CBD soutient ce système et aide la peau à gérer les signaux inflammatoires qu'une alimentation imparfaite envoie parfois.</p><p>Ta-Da Serum à 10 % de CBD apporte une protection anti-inflammatoire directe et renforce la barrière. Duo Ta-Da combine sérum et huile pour actifs et lipides qui renforcent les membranes – comme les oméga-3 depuis l'intérieur.</p><p>C'est de la synergie. La bonne assiette donne la matière première. Le CBD donne l'équilibre. Ensemble, l'effet dépasse la somme des parties.</p>",
      faq: [
        { q: "Quels aliments sont les pires pour la peau ?", a: "Sucre raffiné, ultra-transformés et huiles végétales industrielles en tête. Ils poussent inflammation, glycation et stress oxydatif – trois voies qui abîment et vieillissent la peau." },
        { q: "L'alimentation peut-elle vraiment améliorer l'acné ?", a: "Oui. Des études montrent qu'un régime à index glycémique bas, riche en légumes, protéines et bonnes graisses, peut réduire l'acné jusqu'à 50 % après 12 semaines. Ça ne remplace pas le skincare mais pose une base solide." },
        { q: "Combien de temps avant de voir des résultats ?", a: "Les cellules se renouvellent en ~28 jours, mais les changements profonds sur collagène et inflammation prennent 2–3 mois. Donne du temps – tu construis une peau neuve depuis zéro." },
        { q: "Dois-je prendre des compléments pour la peau ?", a: "L'idéal, c'est l'assiette. Mais zinc, oméga-3 et vitamine D ont un bon soutien scientifique pour les soucis de peau. Parle-en à un pro si tu hésites." }
      ],
      ctaTitle: "Construis une meilleure peau de l'intérieur et de l'extérieur",
      ctaSub: "L'assiette est la fondation. Le skincare CBD est l'amplificateur. Ensemble, ils donnent à ta peau tout ce qu'il lui faut."
    }
  },
  {
    svSlug: "hormoner-och-huden",
    enSlug: "hormones-and-skin",
    esSlug: "hormonas-y-piel",
    deSlug: "hormone-und-haut",
    frSlug: "hormones-et-peau",
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
    },
    es: {
      metaTitle: "Hormonas y piel – cómo tus hormonas mandan en tu cutis",
      metaDescription: "Acné, sequedad, manchas – las hormonas están detrás de más de lo que crees. Entiende el vínculo hormonas-piel. 1753 SKINCARE.",
      kicker: "Estilo de vida y piel",
      h1: "Hormonas y piel – los directores invisibles de tu cutis",
      lead: "Cada vez que tu piel cambia sin explicación clara – brotes antes de la regla, sequedad de golpe, manchas – lo más probable es que tiren de los hilos las hormonas. Son los directores ocultos; entenderlas es dejar de perseguir solo síntomas.",
      problemTitle: "¿Cómo afectan las hormonas a la piel?",
      problemBody: "<p>La piel es un órgano diana hormonal. Tiene receptores para estrógeno, progesterona, testosterona, cortisol, hormonas tiroideas e insulina – y reacciona a cada oscilación. En la pubertad, los andrógenos disparan el acné. En el ciclo menstrual, estrógeno y progesterona marcan sebo, retención de agua y sensibilidad inflamatoria semana a semana.</p><p>En el embarazo puede aparecer melasma cuando los melanocitos se sobreactivan con el estrógeno. En la perimenopausia baja el estrógeno: piel más fina, menos síntesis de colágeno, más sequedad. En hombres con testosterona en descenso tras los 40, grosor y elasticidad caen. SOP, tiroides e resistencia a la insulina son estados hormonales que se leen claros en la piel.</p><p>El problema del skincare convencional? Trata la piel como si viviera en vacío. Pero forma parte de un sistema endocrino en movimiento constante. Si no tocas el equilibrio hormonal, arreglas la fachada mientras los cimientos se mueven.</p>",
      tipsTitle: "Apoya tu equilibrio hormonal de forma natural",
      tips: [
        { title: "Duerme 7–9 horas", body: "El sueño es clave para fabricar hormonas. Hormona del crecimiento, melatonina y hormonas sexuales se producen sobre todo de noche. Mal dormir deja cortisol alto y caos hormonal que se pinta en la cara." },
        { title: "Estabiliza el azúcar en sangre", body: "Los picos de insulina empujan andrógenos y empeoran el acné hormonal. Mete proteína y grasa en cada comida; evita carbos rápidos en ayunas. Azúcar estable, hormonas más estables." },
        { title: "Muévete con cabeza", body: "El ejercicio moderado equilibra estrógeno, baja cortisol y mejora sensibilidad a la insulina. El sobreentrenamiento hace lo contrario: estrés y ciclos menstruales rotos. Escucha al cuerpo." },
        { title: "Reduce xenoestrógenos", body: "Plásticos, cosmética convencional y pesticidas traen sustancias que imitan estrógeno. Cambia a vidrio, elige productos naturales y orgánico cuando puedas." },
        { title: "Adapta el skincare al ciclo", body: "Semanas 1–2 (fase folicular) toleran más activos. Semanas 3–4 (fase lútea) piden más suavidad y barrera. Escucha en lugar de forzar." }
      ],
      solutionTitle: "CBD y equilibrio cutáneo hormonal",
      solutionBody: "<p>El ECS está ligado al sistema endocrino. Hay receptores ECS en suprarrenales, ovarios, tiroides e hipófisis – piezas centrales de la producción hormonal. El CBD dialoga con el ECS y puede suavizar la señal entre esos órganos y la piel.</p><p>En el acné hormonal, donde los andrógenos disparan el sebo, el CBD aporta acción sebostática que regula glándulas sin resecar. Ta-Da Serum a diario da apoyo antiinflamatorio estable en todo el ciclo; Duo Ta-Da suma barrera extra en la fase lútea, cuando la piel explota más fácil.</p><p>El Duo-kit con The ONE e I LOVE encaja si quieres rutina completa que toque inflamación y equilibrio de sebo – muy útil con acné tipo SOP y cambios de perimenopausia.</p>",
      faq: [
        { q: "¿Por qué me salen granos antes de la regla?", a: "En la fase lútea (semanas 3–4) baja el estrógeno y sube la progesterona: más sebo y piel más propensa a inflamarse. Es cóctel hormonal, no falta de limpieza." },
        { q: "¿El CBD equilibra hormonas?", a: "No mueve niveles hormonales directamente, pero al apoyar el ECS puede ayudar al cuerpo a lidiar mejor con los vaivenes. Es un apoyo indirecto pero real." },
        { q: "¿Ayuda el CBD en la piel menopáusica?", a: "Sí: hidratación y acción antiinflamatoria atacan lo típico – sequedad, piel más fina, más sensibilidad. No sustituye terapia hormonal pero cuida la piel al frente." },
        { q: "¿Debo cambiar productos según el ciclo?", a: "No hace falta rehacer todo, pero ajusta. Más activos en fase folicular; más mimo y barrera en fase lútea. El sérum CBD encaja todo el ciclo por su acción equilibradora." }
      ],
      ctaTitle: "Entiende tus hormonas, entiende tu piel",
      ctaSub: "Deja de culparte. Tus hormonas mandan mucho – pero con conocimiento y buen apoyo, la piel no tiene por qué sufrir por ellas."
    },
    de: {
      metaTitle: "Hormone und Haut – wie Hormone deinen Teint steuern",
      metaDescription: "Akne, Trockenheit, Pigmentierung – Hormone stecken hinter mehr, als du denkst. Verstehe die Verbindung zwischen Hormonen und Haut. 1753 SKINCARE.",
      kicker: "Lifestyle & Haut",
      h1: "Hormone und Haut – die unsichtbaren Dirigenten hinter deinem Teint",
      lead: "Jedes Mal, wenn sich deine Haut ohne klaren Grund verändert – Pickel vor der Periode, plötzliche Trockenheit, Pigmentverschiebungen – ziehen höchstwahrscheinlich Hormone die Fäden. Sie sind die versteckten Dirigenten; sie zu verstehen heißt, aufzuhören, nur Symptomen hinterherzujagen.",
      problemTitle: "Wie beeinflussen Hormone die Haut?",
      problemBody: "<p>Die Haut ist ein hormonelles Zielorgan. Sie hat Rezeptoren für Östrogen, Progesteron, Testosteron, Cortisol, Schilddrüsenhormone und Insulin – und reagiert auf jede Schwankung. In der Pubertät triggern Androgene Akne. Im Zyklus steuern Östrogen und Progesteron Talg, Wassereinlagerungen und Entzündungsempfindlichkeit Woche für Woche.</p><p>In der Schwangerschaft kann Melasma entstehen, wenn Melanozyten durch Östrogen überstimuliert werden. In der Perimenopause sinkt Östrogen: dünnere Haut, weniger Kollagensynthese, mehr Trockenheit. Männer mit sinkendem Testosteron nach 40 verlieren Hautdicke und Elastizität. PCOS, Schilddrüsenerkrankungen und Insulinresistenz sind hormonelle Zustände, die sich klar in der Haut zeigen.</p><p>Das Problem konventioneller Hautpflege? Sie behandelt die Haut wie im Vakuum. Aber sie ist Teil eines endokrinen Systems in ständiger Bewegung. Ohne hormonelles Gleichgewicht reparierst du die Fassade, während das Fundament wackelt.</p>",
      tipsTitle: "Hormonbalance natürlich unterstützen",
      tips: [
        { title: "7–9 Stunden schlafen", body: "Schlaf ist zentral für Hormonproduktion. Wachstumshormon, Melatonin und Sexualhormone entstehen vor allem nachts. Schlafmangel hebt Cortisol und wirkt als hormonelles Chaos direkt auf der Haut." },
        { title: "Blutzucker balancieren", body: "Insulinspikes treiben Androgenproduktion und verschlimmern hormonelle Akne. Protein und Fett zu jeder Mahlzeit, keine schnellen Kohlenhydrate nüchtern. Stabiler Zucker, stabilere Hormone." },
        { title: "Richtig trainieren", body: "Moderater Sport balanciert Östrogen, senkt Cortisol und verbessert Insulinsensitivität. Übertraining macht das Gegenteil – Stress und Zyklusstörungen. Höre auf deinen Körper." },
        { title: "Xenoöstrogene managen", body: "Plastik, konventionelle Kosmetik und Pestizide enthalten östrogenähnliche Stoffe. Wechsel zu Glas, wähle natürliche Produkte und Bio, wenn möglich." },
        { title: "Skincare ans Zyklus anpassen", body: "Wochen 1–2 (Follikelphase) vertragen mehr Wirkstoffe. Wochen 3–4 (Lutealphase) brauchen mehr Sanftheit und Barriereschutz. Zuhören statt erzwingen." }
      ],
      solutionTitle: "CBD und hormonelle Hautbalance",
      solutionBody: "<p>Das ECS hängt eng mit dem endokrinen System zusammen. ECS-Rezeptoren sitzen in Nebennieren, Eierstöcken, Schilddrüse und Hypophyse – alles zentral für Hormone. CBD spricht mit dem ECS und kann die Signalgebung zwischen diesen Organen und der Haut glätten.</p><p>Bei hormoneller Akne, wo Androgene den Talg treiben, liefert CBD sebostatische Wirkung, die Talgdrüsen reguliert ohne auszutrocknen. Ta-Da Serum täglich gibt konstante entzündungshemmende Unterstützung über den Zyklus, Duo Ta-Da extra Barrierenschutz in der Lutealphase, wenn die Haut am reaktivsten ist.</p><p>Das Duo-kit mit The ONE und I LOVE passt, wer Routine will, die Entzündung und Talgbalance adressiert – besonders wertvoll bei PCOS-Akne und perimenopausalen Hautveränderungen.</p>",
      faq: [
        { q: "Warum platze ich vor der Periode aus?", a: "In der Lutealphase (Wochen 3–4) sinkt Östrogen, Progesteron steigt – mehr Talg. Gleichzeitig wird die Haut entzündungsempfindlicher. Das ist hormonelles Cocktail-Chaos, kein Reinigungsdefizit." },
        { q: "Kann CBD Hormone balancieren?", a: "CBD verändert Hormonspiegel nicht direkt, aber indem es das ECS stützt, kann der Körper Schwankungen besser auffangen. Indirekt, aber spürbar." },
        { q: "Hilft CBD bei Haut in der Menopause?", a: "Ja – feuchtigkeitsspendende und entzündungshemmende Wirkung trifft die Klassiker: Trockenheit, dünnere Haut, mehr Empfindlichkeit. Es ersetzt keine Hormontherapie, unterstützt die Haut aber direkt." },
        { q: "Soll ich Produkte im Zyklus wechseln?", a: "Nicht alles neu erfinden, aber anpassen. Mehr Aktive in der Follikelphase, mehr Sanftheit und Barriere in der Lutealphase. CBD-Serum funktioniert dank ausgleichender Wirkung durch den ganzen Zyklus." }
      ],
      ctaTitle: "Verstehe deine Hormone, verstehe deine Haut",
      ctaSub: "Hör auf, dich selbst zu beschuldigen. Deine Hormone sind stark – aber mit Wissen und Support muss deine Haut nicht darunter leiden."
    },
    fr: {
      metaTitle: "Hormones et peau – comment tes hormones pilotent ton teint",
      metaDescription: "Acné, sécheresse, taches – les hormones sont derrière plus que tu ne crois. Comprends le lien hormones-peau. 1753 SKINCARE.",
      kicker: "Mode de vie & peau",
      h1: "Hormones et peau – les chefs d'orchestre cachés de ton teint",
      lead: "Chaque fois que ta peau change sans raison évidente – poussées avant les règles, sécheresse soudaine, taches – ce sont très probablement les hormones qui tirent les ficelles. Ce sont les chefs invisibles ; les comprendre, c'est arrêter de courir après les symptômes seuls.",
      problemTitle: "Comment les hormones agissent-elles sur la peau ?",
      problemBody: "<p>La peau est une cible hormonale. Elle a des récepteurs pour œstrogène, progestérone, testostérone, cortisol, hormones thyroïdiennes et insuline – et réagit à chaque fluctuation. À la puberté, les androgènes déclenchent l'acné. Sur le cycle menstruel, œstrogène et progestérone pilotent sébum, rétention d'eau et sensibilité inflammatoire semaine après semaine.</p><p>En grossesse, le melasma peut apparaître quand les mélanocytes sont surexcités par l'œstrogène. En périménopause, l'œstrogène baisse : peau plus fine, moins de collagène, plus de sécheresse. Chez les hommes dont la testostérone chute après 40 ans, épaisseur et élasticité reculent. SOP, thyroïde et résistance à l'insuline sont des états hormonaux qui se lisent clairement sur la peau.</p><p>Le problème du skincare classique ? Il traite la peau comme isolée. Or elle fait partie d'un système endocrinien en mouvement permanent. Sans toucher l'équilibre hormonal, tu rafistoles la façade pendant que les fondations bougent.</p>",
      tipsTitle: "Soutenir naturellement ton équilibre hormonal",
      tips: [
        { title: "Dors 7–9 h", body: "Le sommeil est critique pour fabriquer des hormones. Hormone de croissance, mélatonine et hormones sexuelles surtout la nuit. Mal dormir laisse un excès de cortisol et un chaos hormonal visible sur la peau." },
        { title: "Stabilise la glycémie", body: "Les pics d'insuline poussent les androgènes et aggravent l'acné hormonale. Protéines et lipides à chaque repas ; évite les glucides rapides à jeun. Glycémie stable, hormones plus stables." },
        { title: "Bouge intelligemment", body: "L'exercice modéré équilibre l'œstrogène, baisse le cortisol et améliore la sensibilité à l'insuline. Le surentraînement fait l'inverse : stress et cycles perturbés. Écoute ton corps." },
        { title: "Réduis les xenoœstrogènes", body: "Plastiques, cosmétiques conventionnels et pesticides contiennent des molécules qui imitent l'œstrogène. Passe au verre, choisis des produits naturels et du bio quand tu peux." },
        { title: "Adapte le skincare au cycle", body: "Semaines 1–2 (phase folliculaire) tolèrent plus d'actifs. Semaines 3–4 (phase lutéale) demandent douceur et barrière. Écoute plutôt que forcer." }
      ],
      solutionTitle: "CBD et équilibre cutané hormonal",
      solutionBody: "<p>L'ECS est étroitement lié au système endocrinien. Des récepteurs ECS sont présents surrénales, ovaires, thyroïde et hypophyse – tous centraux pour les hormones. Le CBD interagit avec l'ECS et peut lisser la signalisation entre ces organes et la peau.</p><p>Pour l'acné hormonale où les androgènes poussent le sébum, le CBD offre une action sébostatique qui régule les glandes sans assécher. Ta-Da Serum quotidien apporte un soutien anti-inflammatoire régulier sur tout le cycle ; Duo Ta-Da ajoute une barrière renforcée en phase lutéale, quand la peau est la plus réactive.</p><p>Le Duo-kit avec The ONE et I LOVE convient si tu veux une routine complète sur inflammation et équilibre de sébum – particulièrement utile pour l'acné liée au SOP et les changements de périménopause.</p>",
      faq: [
        { q: "Pourquoi j'ai des boutons avant les règles ?", a: "En phase lutéale (semaines 3–4), l'œstrogène baisse et la progestérone monte : plus de sébum. En parallèle, la peau devient plus inflammatoire. C'est un cocktail hormonal, pas un manque de nettoyage." },
        { q: "Le CBD équilibre-t-il les hormones ?", a: "Il ne modifie pas directement les taux, mais en soutenant l'ECS, il peut aider le corps à mieux gérer les fluctuations. Un soutien indirect mais concret." },
        { q: "Le CBD aide-t-il la peau ménopausique ?", a: "Oui : hydratation et anti-inflammation ciblent le classique – sécheresse, peau plus fine, sensibilité accrue. Ça ne remplace pas l'hormonothérapie mais soutient la peau en première ligne." },
        { q: "Dois-je changer de produits selon le cycle ?", a: "Pas besoin de tout refaire, mais d'ajuster. Plus d'actifs en phase folliculaire ; plus de douceur et de barrière en phase lutéale. Le sérum CBD tient tout le cycle grâce à son action équilibrante." }
      ],
      ctaTitle: "Comprends tes hormones, comprends ta peau",
      ctaSub: "Arrête de t'accuser. Tes hormones sont puissantes – mais avec les bons repères et le bon soutien, ta peau n'a pas à en pâtir."
    }
  },
  {
    svSlug: "tarmhalsa-och-huden",
    enSlug: "gut-health-and-skin",
    esSlug: "intestino-y-piel",
    deSlug: "darmgesundheit-und-haut",
    frSlug: "intestin-et-peau",
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
    },
    es: {
      metaTitle: "Intestino y piel – el eje intestino-piel explicado",
      metaDescription: "Tu intestino y tu piel hablan entre sí. Descubre cómo la flora intestinal controla inflamación, acné y luminosidad. Guía completa de 1753 SKINCARE.",
      kicker: "Estilo de vida y piel",
      h1: "Salud intestinal y piel – muchas veces empieza en el intestino",
      lead: "La ciencia lo llama eje intestino-piel: una vía directa entre tu microbiota y tu cutis. Un intestino desequilibrado manda señales inflamatorias que la piel no puede ignorar. ¿Quieres mejorar la piel? Empieza por el intestino.",
      problemTitle: "¿Cómo está conectado el intestino con la piel?",
      problemBody: "<p>Intestino y piel comparten origen embrionario y chapan por tres vías: sistema inmune, sistema nervioso y sangre. Tu microbiota – billones de bacterias en el tracto gastrointestinal – produce moléculas señal que influyen en inflamación, respuesta inmune e incluso en la producción de sebo de la piel.</p><p>Cuando la flora se desbalancea (disbiosis), sube la permeabilidad intestinal. Fragmentos bacterianos y moléculas inflamatorias pasan a la sangre, llegan a la piel y disparan reacciones inmunes. Puede traducirse en acné, eccema, rosácea o psoriasis. Quienes tienen acné suelen tener flora intestinal claramente distinta a quienes no.</p><p>SIBO (sobrecrecimiento bacteriano del intestino delgado) se ha ligado a rosácea. Con SII hay más problemas de piel. Antibióticos, estrés, mala dieta y poca fibra alimentan un círculo vicioso: intestino peor, piel que paga. No es casualidad que piel y digestión vayan a menudo de la mano.</p>",
      tipsTitle: "Construye un intestino más sano para una piel más sana",
      tips: [
        { title: "Come 30 plantas distintas por semana", body: "Diversidad en el plato, diversidad en la flora. Cuenta verduras, frutas, legumbres, frutos secos, semillas y especias. Cada planta alimenta cepas distintas que suman a un intestino equilibrado." },
        { title: "Fermentados a diario", body: "Chucrut, kimchi, kéfir, yogur y miso meten bacterias vivas. Una ración diaria puede subir la diversidad del microbioma y bajar marcadores inflamatorios en semanas." },
        { title: "Fibras prebióticas", body: "Cebolla, ajo, puerro, plátano, avena y alcachofa de Jerusalén tienen fibras que alimentan a las buenas. No basta con añadir bacterias: necesitan comida para sobrevivir y prosperar." },
        { title: "Evita antibióticos innecesarios", body: "Un ciclo puede desmontar la flora durante meses. Úsalos solo cuando sea médicamente necesario y repón con probióticos después. La piel puede reaccionar mucho después de terminar el tratamiento." },
        { title: "Extractos de hongo para el intestino", body: "Hongos medicinales como lion's mane y chaga muestran efecto prebiótico y apoyan la integridad de la mucosa. Nuestro Fungtastic Mushroom Extract combina tres hongos que atacan la salud intestinal desde varios frentes." },
        { title: "Gestiona el estrés", body: "El intestino tiene su propio sistema nervioso con unos 500 millones de neuronas. El estrés afecta motilidad, permeabilidad y composición de la flora vía nervio vago. Cuidar el estrés es cuidar el intestino." }
      ],
      solutionTitle: "Cómo nuestros productos apoyan el eje intestino-piel",
      solutionBody: "<p>Fungtastic Mushroom Extract está pensado para quien entiende que la piel empieza en el intestino. Lion's mane apoya el revestimiento intestinal y ha mostrado acción antiinflamatoria en el tracto GI. Chaga es antioxidante potente frente al estrés oxidativo. Reishi equilibra el sistema inmune – relevante porque cerca del 70 por ciento del inmune vive en el intestino.</p><p>Por fuera, Ta-Da Serum con 10% CBD da a la piel el apoyo antiinflamatorio mientras reconstruyes el intestino por dentro. El CBD habla con receptores CB2 en la piel y amortigua las señales inflamatorias de un intestino revuelto. Duo Ta-Da suma barrera con su componente en aceite.</p><p>Trabajar el eje intestino-piel pide paciencia: 8–12 semanas para cambios claros. Pero es el camino más sostenible hacia piel sana que conocemos.</p>",
      faq: [
        { q: "¿La salud intestinal puede afectar de verdad al acné?", a: "Sí. Estudios muestran menor diversidad del microbioma y más bacterias intestinales proinflamatorias en personas con acné. En ensayos controlados, probióticos han reducido lesiones de acné de forma significativa." },
        { q: "¿Cuánto tarda en mejorar la flora?", a: "La dieta mueve la flora en días, pero cambios estables piden 8–12 semanas de constancia. Vale la pena esperar: los efectos en la piel llegan poco a poco y duran." },
        { q: "¿Qué hace Fungtastic por el intestino?", a: "Lion's mane apoya la barrera de la mucosa y ha mostrado efectos antiinflamatorios en estudios. Chaga aporta antioxidantes; reishi equilibra el inmune, que en gran parte se gobierna desde el intestino." },
        { q: "¿Puedo tomar probióticos y CBD a la vez?", a: "Sí, actúan por vías distintas y se complementan. Los probióticos van directo a la flora; el CBD apoya el ECS para que el cuerpo gestione mejor las señales inflamatorias." }
      ],
      ctaTitle: "Empieza por el intestino, míralo en la cara",
      ctaSub: "El eje intestino-piel no es moda – es biología. Dale al intestino lo que necesita y la piel sigue."
    },
    de: {
      metaTitle: "Darmgesundheit und Haut – die Darm-Haut-Achse erklärt",
      metaDescription: "Darm und Haut sprechen miteinander. Erfahre, wie die Darmflora Entzündung, Akne und Strahlung steuert. Kompletter Guide von 1753 SKINCARE.",
      kicker: "Lifestyle & Haut",
      h1: "Darmgesundheit und Haut – oft beginnt es im Darm",
      lead: "Forscher nennen es die Darm-Haut-Achse – eine direkte Leitung zwischen Darmflora und Teint. Ein aus dem Gleichgewicht geratener Darm schickt entzündliche Signale, die die Haut nicht ignorieren kann. Bessere Haut? Fang beim Darm an.",
      problemTitle: "Wie hängt der Darm mit der Haut zusammen?",
      problemBody: "<p>Darm und Haut teilen embryonalen Ursprung und kommunizieren über drei Wege: Immunsystem, Nervensystem, Blutbahn. Dein Mikrobiom – Billionen Bakterien im GI-Trakt – produziert Signalstoffe, die Entzündung, Immunantwort und sogar Talgproduktion der Haut beeinflussen.</p><p>Bei Dysbiose steigt die Darmpermeabilität. Bakterienfragmente und Entzündungsmoleküle gelangen ins Blut, erreichen die Haut und triggern Immunreaktionen. Das kann als Akne, Ekzem, Rosacea oder Psoriasis sichtbar werden. Menschen mit Akne haben messbar andere Darmflora als ohne.</p><p>SIBO (small intestinal bacterial overgrowth) ist mit Rosacea verknüpft. Bei Reizdarm häufiger Hautprobleme. Antibiotika, Stress, schlechte Ernährung und wenig Fiber nähren einen Teufelskreis: Darm leidet, Haut zahlt. Kein Zufall, dass Haut und Verdauung oft zusammen auftreten.</p>",
      tipsTitle: "Baue einen gesünderen Darm für gesündere Haut",
      tips: [
        { title: "30 verschiedene Pflanzen pro Woche", body: "Vielfalt im Teller schafft Vielfalt in der Flora. Zähle Gemüse, Obst, Hülsenfrüchte, Nüsse, Samen, Gewürze. Jede Pflanze füttert andere Stämme für Balance." },
        { title: "Täglich fermentiert", body: "Sauerkraut, Kimchi, Kefir, Joghurt, Miso bringen lebende Bakterien. Eine Portion täglich kann Mikrobiomdiversität steigern und Entzündungsmarker in Wochen senken." },
        { title: "Präbiotische Ballaststoffe", body: "Zwiebel, Knoblauch, Lauch, Banane, Hafer, Topinambur enthalten Fasern, die gute Bakterien füttern. Nur Bakterien zugeben reicht nicht – sie brauchen Futter." },
        { title: "Unnötige Antibiotika meiden", body: "Ein Kurs kann die Flora monatelang stören. Nur medizinisch nötig nutzen und danach mit Probiotika nachhelfen. Die Haut kann noch lange nach dem Kurs reagieren." },
        { title: "Pilzextrakte für den Darm", body: "Heilpilze wie lion's mane und Chaga zeigen präbiotische Effekte und stützen die Darmschleimhaut. Unser Fungtastic Mushroom Extract kombiniert drei Pilze aus mehreren Winkeln." },
        { title: "Stress managen", body: "Der Darm hat ein eigenes Nervensystem mit ~500 Millionen Nervenzellen. Stress wirkt auf Motilität, Permeabilität und Mikrobiom direkt über den Vagus. Stressmanagement ist Darmpflege." }
      ],
      solutionTitle: "Wie unsere Produkte die Darm-Haut-Achse unterstützen",
      solutionBody: "<p>Fungtastic Mushroom Extract ist für alle, die wissen: Haut beginnt im Darm. Lion's mane stützt die Darmschleimhaut und zeigt entzündungshemmende Wirkung im GI-Trakt. Chaga ist starkes Antioxidans gegen oxidativen Stress. Reishi balanciert das Immunsystem – relevant, weil ~70 Prozent des Immunsystems im Darm sitzt.</p><p>Von außen liefert Ta-Da Serum mit 10% CBD antiinflammatorische Unterstützung, während du den Darm von innen aufbaust. CBD wirkt auf CB2-Rezeptoren in der Haut und dämpft Signale eines gestörten Darms. Duo Ta-Da ergänzt Barriereschutz über die Ölkomponente.</p><p>Die Darm-Haut-Achse braucht Geduld – 8–12 Wochen für sichtbare Veränderung. Aber es ist der nachhaltigste Weg zu gesunder Haut, den wir kennen.</p>",
      faq: [
        { q: "Kann Darmgesundheit Akne wirklich beeinflussen?", a: "Ja. Studien zeigen geringere Mikrobiomdiversität und mehr entzündliche Darmbakterien bei Akne. Probiotika reduzierten in kontrollierten Studien Akne-Läsionen signifikant." },
        { q: "Wie lange dauert es, die Flora zu verbessern?", a: "Ernährung wirkt innerhalb von Tagen, stabile Veränderung braucht 8–12 Wochen konsequenter Arbeit. Geduld zahlt sich aus – Hauteffekte kommen graduell und bleiben." },
        { q: "Was macht Fungtastic für den Darm?", a: "Lion's mane stützt die Schleimhautbarriere und zeigte in Studien entzündungshemmende Effekte. Chaga liefert Antioxidantien, Reishi balanciert das Immunsystem, das weitgehend vom Darm gesteuert wird." },
        { q: "Probiotika und CBD gleichzeitig?", a: "Ja, unterschiedliche Mechanismen, gute Ergänzung. Probiotika direkt auf die Flora, CBD unterstützt das ECS bei entzündlichen Signalen." }
      ],
      ctaTitle: "Fang beim Darm an, sieh es im Gesicht",
      ctaSub: "Die Darm-Haut-Achse ist kein Trend – das ist Biologie. Gib dem Darm die richtigen Bedingungen, die Haut folgt."
    },
    fr: {
      metaTitle: "Intestin et peau – l'axe intestin-peau expliqué",
      metaDescription: "Ton intestin et ta peau dialoguent. Comprends comment le microbiote pilote inflammation, acné et éclat. Guide complet 1753 SKINCARE.",
      kicker: "Mode de vie & peau",
      h1: "Santé intestinale et peau – ça commence souvent dans le ventre",
      lead: "Les chercheurs parlent d'axe intestin-peau : une ligne directe entre ton microbiote et ton teint. Un intestin déséquilibré envoie des signaux inflammatoires que la peau ne peut ignorer. Tu veux une meilleure peau ? Commence par l'intestin.",
      problemTitle: "Comment l'intestin est-il lié à la peau ?",
      problemBody: "<p>L'intestin et la peau partagent une origine embryonnaire et échangent par trois voies : immunité, système nerveux, sang. Ton microbiote – des billions de bactéries dans le tube digestif – produit des signaux qui influencent inflammation, immunité et même production de sébum.</p><p>Quand la flora est en dysbiose, la perméabilité intestinale augmente. Des fragments bactériens et des molécules inflammatoires fuient dans le sang, atteignent la peau et déclenchent des réactions. Ça peut donner acné, eczéma, rosacée ou psoriasis. Les personnes acnéiques ont souvent une flore nettement différente.</p><p>Le SIBO (small intestinal bacterial overgrowth) est lié à la rosacée. Avec un syndrome de l'intestin irritable, plus de soucis de peau. Antibiotiques, stress, mauvaise alimentation et manque de fibres nourrissent un cercle vicieux : intestin qui se dégrade, peau qui trinque. Pas un hasard si peau et digestion coexistent.</p>",
      tipsTitle: "Construire un intestin plus sain pour une peau plus saine",
      tips: [
        { title: "30 plantes différentes par semaine", body: "Diversité dans l'assiette, diversité dans la flore. Compte légumes, fruits, légumineuses, noix, graines, épices. Chaque plante nourrit des souches différentes pour un équilibre global." },
        { title: "Fermentés au quotidien", body: "Choucroute, kimchi, kéfir, yaourt, miso apportent des bactéries vivantes. Une portion par jour peut augmenter la diversité du microbiome et faire baisser les marqueurs inflammatoires en quelques semaines." },
        { title: "Fibres prébiotiques", body: "Oignon, ail, poireau, banane, avoine, topinambour : des fibres qui nourrissent les bonnes bactéries. Ajouter des bugs sans leur donner à manger ne suffit pas." },
        { title: "Évite les antibiotiques inutiles", body: "Un traitement peut désorganiser la flore pendant des mois. Utilise-les seulement si nécessaire, puis repose avec des probiotiques. La peau peut réagir longtemps après la fin du cycle." },
        { title: "Extraits de champignons pour l'intestin", body: "Champignons médicinaux comme lion's mane et chaga montrent des effets prébiotiques et soutiennent la muqueuse. Notre Fungtastic Mushroom Extract combine trois champignons sous plusieurs angles." },
        { title: "Gère le stress", body: "L'intestin a son propre système nerveux, ~500 millions de neurones. Le stress agit sur motilité, perméabilité et microbiote via le nerf vague. Gérer le stress, c'est soigner l'intestin." }
      ],
      solutionTitle: "Comment nos produits soutiennent l'axe intestin-peau",
      solutionBody: "<p>Fungtastic Mushroom Extract s'adresse à celles et ceux qui savent que la peau commence dans le ventre. Lion's mane soutient la muqueuse intestinale et montre une action anti-inflammatoire dans le tube digestif. Chaga est un antioxydant puissant face au stress oxydatif. Reishi équilibre l'immunité – pertinent quand ~70 % du système immunitaire est intestinal.</p><p>De l'extérieur, Ta-Da Serum à 10 % de CBD apporte le soutien anti-inflammatoire pendant que tu reconstruis l'intestin de l'intérieur. Le CBD cible les récepteurs CB2 dans la peau et amortit les signaux d'un intestin désordonné. Duo Ta-Da ajoute une barrière grâce à la partie huile.</p><p>Travailler l'axe intestin-peau demande patience : 8–12 semaines pour un vrai changement. Mais c'est la voie la plus durable vers une peau saine que nous connaissons.</p>",
      faq: [
        { q: "La santé intestinale peut-elle vraiment impacter l'acné ?", a: "Oui. Les études montrent une moindre diversité du microbiome et plus de bactéries intestinales pro-inflammatoires chez les personnes acnéiques. Des probiotiques ont significativement réduit les lésions d'acné dans des essais contrôlés." },
        { q: "Combien de temps pour améliorer la flore ?", a: "L'alimentation agit en quelques jours, mais des changements stables prennent 8–12 semaines d'efforts réguliers. La patience paie : les effets sur la peau arrivent progressivement et durent." },
        { q: "Que fait Fungtastic pour l'intestin ?", a: "Lion's mane soutient la barrière muqueuse et a montré des effets anti-inflammatoires en études. Chaga apporte des antioxydants ; reishi équilibre l'immunité largement pilotée depuis l'intestin." },
        { q: "Probiotiques et CBD en même temps ?", a: "Oui, mécanismes différents, bon complément. Les probiotiques ciblent directement la flore ; le CBD soutient l'ECS pour mieux gérer les signaux inflammatoires." }
      ],
      ctaTitle: "Commence par l'intestin, vois-le sur ton visage",
      ctaSub: "L'axe intestin-peau n'est pas une mode – c'est de la biologie. Donne les bonnes conditions à l'intestin, la peau suit."
    }
  },
  {
    svSlug: "traning-och-huden",
    enSlug: "exercise-and-skin",
    esSlug: "ejercicio-y-piel",
    deSlug: "sport-und-haut",
    frSlug: "sport-et-peau",
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
    },
    es: {
      metaTitle: "Ejercicio y piel – cómo el entrenamiento afecta tu aspecto",
      metaDescription: "El ejercicio da luminosidad pero también puede provocar brotes. Aprende a entrenar con cabeza para mejor piel sin efectos secundarios. 1753 SKINCARE.",
      kicker: "Estilo de vida y piel",
      h1: "Ejercicio y piel – moverse es skincare por dentro",
      lead: "Un entreno le da a tu piel más que una hora de facial. Más flujo sanguíneo, menos inflamación, mejor sueño. Pero si lo haces mal, sudor, fricción y bacterias montan el lío. Aquí va lo que necesitas saber.",
      problemTitle: "¿Cómo afecta el ejercicio a la piel?",
      problemBody: "<p>Con actividad física sube el ritmo cardíaco y se dilatan los vasos. El flujo a la piel puede aumentar hasta un 400 por ciento: oxígeno y nutrientes entran, deshechos salen. Es un facial interno que ninguna crema replica. El ejercicio regular además estimula fibroblastos para más colágeno.</p><p>Pero el deporte tiene cara B para la piel. Sudor mezclado con bacterias, maquillaje y roce de ropa y equipo crea caldo perfecto para brotes. El acné del deportista (acne mechanica) aparece donde la ropa frota – bajo cascos, sujetadores deportivos, espalda. Gimnasios y estudios húmedos pueden empeorar infecciones fúngicas.</p><p>El sobreentrenamiento es otro tema. Estrés físico extremo sin recuperación deja el cortisol alto de forma crónica, rompe colágeno y apaga el sistema inmune. Lo que debía dar brillo acaba en palidez, cansancio y piel más reactiva. El equilibrio lo es todo.</p>",
      tipsTitle: "Entrena con inteligencia para mejor piel",
      tips: [
        { title: "Lávate la cara antes de entrenar", body: "Nunca entrenes con maquillaje, protector solar o crema de día. Sudor más residuos tapan poros y disparan brotes. Limpia con un gel suave o solo agua antes de empezar." },
        { title: "Cámbiate en cuanto acabes", body: "Ropa sudada pegada a la piel es fiesta de bacterias. Cambia en cuanto puedas – sujetador, mallas, todo lo que haya estado apretado." },
        { title: "Dúchate en 30 minutos", body: "El sudor en sí no es sucio – es sobre todo agua y sal. Pero con bacterias y sebo se vuelve problemático rápido. Una ducha breve después marca la diferencia." },
        { title: "No te toques la cara", body: "Las máquinas del gym llevan más bacterias de las que quieres saber. Evita mancharte la cara durante el entreno; mejor una toalla limpia a mano." },
        { title: "Encuentra tu punto dulce", body: "3–5 sesiones por semana con intensidad mixta es un buen objetivo. HIIT diario sin descanso sube cortisol y frena la recuperación de la piel. Mete días suaves y movimiento ligero." }
      ],
      solutionTitle: "Skincare para activos – con CBD",
      solutionBody: "<p>La piel deportiva pide tres cosas: limpieza profunda pero suave, apoyo antiinflamatorio y reparación de barrera. Au Naturel Makeup Remover con aceite MCT disuelve sudor, sebo y restos sin romper la barrera. Es tu limpieza pre-entreno y reset post-entreno en uno.</p><p>Después de entrenar, con el flujo aún alto y los poros abiertos, es buen momento para activos. Ta-Da Serum con 10% CBD calma la inflamación pasajera del esfuerzo y apoya la recuperación cutánea – como la proteínea a los músculos.</p><p>El Duo-kit con The ONE e I LOVE da una rutina completa para vida activa: equilibra sebo y refuerza barrera. El efecto sebostático del CBD vale oro si te salen granos ligados al gym.</p>",
      faq: [
        { q: "¿Por qué me salen granos después de entrenar?", a: "Lo más habitual: maquillaje durante el ejercicio, limpieza tardía tras sudar, roce de ropa (acne mechanica) o bacterias del equipo. Lava la cara antes y dúchate en cuanto termines." },
        { q: "¿Mejor entrenar con o sin maquillaje?", a: "Siempre sin. Maquillaje más sudor tapa poros y crea ambiente anaeróbico donde triunfan las bacterias. Si no te da tiempo, usa Au Naturel como limpieza rápida." },
        { q: "¿El ejercicio puede mejorar la piel de verdad?", a: "Sí. Estudios muestran que el ejercicio moderado regular sube colágeno, mejora circulación cutánea y baja inflamación sistémica. Suele notarse tras 4–6 semanas de constancia." },
        { q: "¿Cuánto ejercicio es demasiado para la piel?", a: "Depende, pero señales de sobreentrenamiento incluyen más acné, ojeras, tez apagada y cicatrización lenta. Si entrenas fuerte a diario sin descanso, baja un poco y mira si la piel responde." }
      ],
      ctaTitle: "Entrena fuerte, cuida la piel",
      ctaSub: "Das el máximo en el gym. Después, la piel merece el mismo mimo – una recuperación en serio."
    },
    de: {
      metaTitle: "Sport und Haut – wie Training dein Aussehen beeinflusst",
      metaDescription: "Sport gibt der Haut Strahlung, kann aber auch Pickel triggern. Trainiere smart für bessere Haut ohne Nebenwirkungen. 1753 SKINCARE.",
      kicker: "Lifestyle & Haut",
      h1: "Sport und Haut – Bewegung ist Hautpflege von innen",
      lead: "Ein Workout tut der Haut mehr als eine Stunde Gesichtsbehandlung. Mehr Durchblutung, weniger Entzündung, besserer Schlaf. Machst du es falsch, richten Schweiß, Reibung und Bakterien Chaos an. Hier ist, was du wissen musst.",
      problemTitle: "Wie wirkt sich Training auf die Haut aus?",
      problemBody: "<p>Bei körperlicher Aktivität steigt die Herzfrequenz, Gefäße erweitern sich. Der Blutfluss zur Haut kann um bis zu 400 Prozent steigen – Sauerstoff und Nährstoffe rein, Abfall raus. Wie ein internes Facial, das keine Creme kopiert. Regelmäßiger Sport stimuliert außerdem Fibroblasten für mehr Kollagen.</p><p>Aber Sport hat eine Schattenseite für die Haut. Schweiß mit Bakterien, Makeup und Reibung von Kleidung und Equipment schafft perfekte Pickelbrut. Akne mechanica entsteht, wo Kleidung scheuert – unter Helmen, Sport-BHs, am Rücken. Feuchte Studios können Pilzprobleme verschärfen.</p><p>Übertraining ist ein weiteres Thema. Extreme körperliche Last ohne Erholung hält Cortisol chronisch hoch, bricht Kollagen ab und dämpft das Immunsystem. Statt Glow kommen Mattigkeit, Müdigkeit und mehr Empfindlichkeit. Balance ist alles.</p>",
      tipsTitle: "Smart trainieren für bessere Haut",
      tips: [
        { title: "Gesicht vor dem Training waschen", body: "Nie mit Makeup, Sonnencreme oder Tagescreme trainieren. Schweiß plus Rückstände verstopft Poren. Milde Reinigung oder nur Wasser vor dem Start." },
        { title: "Direkt danach umziehen", body: "Schweißkleidung auf der Haut ist Bakterienparty. So schnell wie möglich wechseln – Sport-BH, Leggings, alles Enganliegende." },
        { title: "Dusche innerhalb von 30 Minuten", body: "Schweiß allein ist nicht schmutzig – hauptsächlich Wasser und Salz. Mit Bakterien und Talg wird es schnell problematisch. Kurze Dusche nach dem Training hilft massiv." },
        { title: "Gesicht nicht anfassen", body: "Geräte im Gym tragen mehr Keime, als du wissen willst. Gesicht während der Session meiden; sauberes Handtuch bereithalten." },
        { title: "Deinen Sweet Spot finden", body: "3–5 Einheiten pro Woche mit gemischter Intensität ist optimal. Tägliches High-Intensity ohne Pause hebt Cortisol und bremst Hautrecovery. Ruhetage und leichte Bewegung einplanen." }
      ],
      solutionTitle: "Hautpflege für Aktive – mit CBD",
      solutionBody: "<p>Sport-Haut braucht drei Dinge: gründliche, milde Reinigung, entzündungshemmende Unterstützung und Barrierereparatur. Au Naturel Makeup Remover mit MCT-Öl löst Schweiß, Talg und Produktreste ohne Barriere zu stören. Perfekte Pre-Workout-Reinigung und Post-Workout-Reset in einem.</p><p>Nach dem Training, wenn der Blutfluss noch hoch und die Poren offen sind, ist Zeit für Wirkstoffe. Ta-Da Serum mit 10% CBD beruhigt die vorübergehende Entzündung vom Training und unterstützt die Hautregeneration – wie Protein die Muskeln.</p><p>Das Duo-kit mit The ONE und I LOVE liefert eine komplette Routine für aktives Leben: Talgbalance und Barriere. CBDs sebostatischer Effekt ist Gold wert bei trainingsbedingten Ausbrüchen.</p>",
      faq: [
        { q: "Warum platze ich nach dem Training?", a: "Häufig: Makeup beim Sport, verspätete Reinigung nach Schweiß, Reibung (Akne mechanica) oder Bakterien vom Equipment. Vorher Gesicht waschen, danach direkt duschen." },
        { q: "Mit oder ohne Makeup trainieren?", a: "Immer ohne. Makeup plus Schweiß verstopft Poren und schafft anaerobe Zone für Bakterien. Wenn keine Zeit ist: Au Naturel als Quick-Cleanse." },
        { q: "Kann Sport die Haut wirklich verbessern?", a: "Ja. Studien: regelmäßiger moderater Sport steigert Kollagen, verbessert Durchblutung und senkt systemische Entzündung. Effekte oft nach 4–6 Wochen Konstanz." },
        { q: "Wie viel Training ist zu viel für die Haut?", a: "Variiert, aber Übertrainingssignale: mehr Akne, Augenringe, fahler Teint, verzögerte Wundheilung. Täglich hart ohne Ruhetag? Reduzieren und die Haut beobachten." }
      ],
      ctaTitle: "Trainiere hart, pflege die Haut",
      ctaSub: "Du gibst im Gym alles. Danach verdient die Haut dieselbe Aufmerksamkeit – eine ebenso ernsthafte Recovery."
    },
    fr: {
      metaTitle: "Sport et peau – comment l'entraînement change ton apparence",
      metaDescription: "Le sport donne de l'éclat mais peut aussi déclencher des poussées. Entraîne-toi intelligemment pour une meilleure peau sans effets indésirables. 1753 SKINCARE.",
      kicker: "Mode de vie & peau",
      h1: "Sport et peau – bouger, c'est du skincare par l'intérieur",
      lead: "Une séance fait plus pour ta peau qu'une heure de soin visage. Meilleure perfusion, moins d'inflammation, meilleur sommeil. Mais mal géré, sueur, friction et bactéries font des ravages. Voici l'essentiel.",
      problemTitle: "Comment le sport affecte-t-il la peau ?",
      problemBody: "<p>Pendant l'effort, le cœur s'accélère, les vaisseaux se dilatent. Le flux vers la peau peut grimper jusqu'à 400 % : oxygène et nutriments entrent, les déchets sortent. C'est un soin visage interne qu'aucune crème ne copie. L'exercice régulier stimule aussi les fibroblastes pour plus de collagène.</p><p>Mais le sport a un versant sombre pour la peau. Sueur + bactéries + maquillage + frottements vêtements et matos = terrain idéal pour les poussées. L'acné mécanique apparaît où ça frotte – sous casques, brassières, dos. Studios humides peuvent aggraver les mycoses.</p><p>Le surentraînement complique tout. Stress physique extrême sans récupération laisse le cortisol chroniquement haut, casse le collagène et affaiblit l'immunité. Au lieu d'éclat : teint terne, fatigue, peau plus réactive. L'équilibre est tout.</p>",
      tipsTitle: "T'entraîner malin pour une meilleure peau",
      tips: [
        { title: "Lave ton visage avant l'effort", body: "Jamais de sport avec maquillage, SPF ou crème de jour. Sueur + résidus bouchent les pores. Nettoyage doux ou eau seule avant de commencer." },
        { title: "Change tout de suite après", body: "Vêtements trempés de sueur collés à la peau, c'est la fête des bactéries. Change dès que tu peux – soutien-gorge de sport, leggings, tout ce qui était serré." },
        { title: "Douche en 30 minutes", body: "La sueur n'est pas sale en soi – surtout eau et sel. Avec bactéries et sébum, ça devient vite problématique. Une douche rapide après change tout." },
        { title: "Ne touche pas ton visage", body: "Les machines de salle portent plus de microbes que tu ne veux le savoir. Évite le visage pendant la séance ; garde une serviette propre sous la main." },
        { title: "Trouve ton sweet spot", body: "3–5 séances par semaine, intensités variées, c'est solide. Du HIIT quotidien sans repos monte le cortisol et freine la récupération cutanée. Ajoute des jours cool et du mouvement doux." }
      ],
      solutionTitle: "Skincare pour les actifs – avec CBD",
      solutionBody: "<p>La peau sportive veut trois choses : nettoyage profond mais doux, soutien anti-inflammatoire, réparation de barrière. Au Naturel Makeup Remover à l'huile MCT dissout sueur, sébum et restes sans casser la barrière. Parfait pré-effort et reset post-effort en un.</p><p>Après l'entraînement, flux encore élevé et pores ouverts : bon moment pour les actifs. Ta-Da Serum à 10 % de CBD calme l'inflammation passagère de l'effort et soutient la récupération – comme les protéines pour les muscles.</p><p>Le Duo-kit avec The ONE et I LOVE offre une routine complète pour vie active : équilibre du sébum et barrière renforcée. L'effet sébostatique du CBD est précieux si tu as des poussées liées au sport.</p>",
      faq: [
        { q: "Pourquoi j'ai des boutons après le sport ?", a: "Souvent : maquillage pendant l'effort, nettoyage tardif après sueur, frottement des vêtements (acné mécanique) ou bactéries du matériel. Lave le visage avant et douche juste après." },
        { q: "Mieux avec ou sans maquillage ?", a: "Toujours sans. Maquillage + sueur bouche les pores et crée un milieu anaérobie où les bactéries adorent. Pas le temps ? Au Naturel en démaquillage express." },
        { q: "Le sport peut-il vraiment améliorer la peau ?", a: "Oui. Des études montrent qu'un exercice modéré régulier augmente le collagène, améliore la circulation cutanée et baisse l'inflammation systémique. Effets souvent visibles après 4–6 semaines régulières." },
        { q: "Quelle dose de sport est trop pour la peau ?", a: "Ça varie, mais signes de surentraînement : plus d'acné, cernes, teint terne, cicatrisation lente. Si tu charges intense tous les jours sans repos, réduis et observe ta peau." }
      ],
      ctaTitle: "Entraîne-toi fort, prends soin de ta peau",
      ctaSub: "Tu donnes tout en salle. Après, ta peau mérite la même attention – une récupération aussi sérieuse."
    }
  },
  {
    svSlug: "solskydd-och-hudvard",
    enSlug: "sun-protection-skincare",
    esSlug: "proteccion-solar-y-piel",
    deSlug: "sonnenschutz-und-hautpflege",
    frSlug: "protection-solaire-et-peau",
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
    },
    es: {
      metaTitle: "Protección solar y piel – protégete sin castigar la piel",
      metaDescription: "El sol envejece la piel más que casi nada. Aprende a protegerte con cabeza y reparar daño solar de forma natural. 1753 SKINCARE.",
      kicker: "Estilo de vida y piel",
      h1: "Protección solar y skincare – el anti-aging que de verdad importa",
      lead: "La radiación UV explica hasta un 80 por ciento del envejecimiento visible de la piel. Arrugas, manchas, flacidez – el sol es el villano principal. Pero no se trata de encerrarse. Se trata de ser lista.",
      problemTitle: "¿Qué le hace el sol a la piel?",
      problemBody: "<p>La radiación UV del sol viene en dos tipos: UVA y UVB. El UVB quema y daña capas externas. El UVA penetra más, rompe colágeno y elastina en la dermis – ahí nacen arrugas, líneas finas y cambios de pigmentación. El UVA llega incluso con nubes y cristales, todo el año.</p><p>El fotoenvejecimiento es acumulativo. Cada minuto al sol sin protección suma. El daño al DNA se acumula en las células y los sistemas de reparación acaban sin dar abasto. A menudo no se ve hasta 10–20 años después – y entonces el golpe ya está dado.</p><p>La paradoja: el sol también es vital. La vitamina D, generada en la piel con UVB, importa para inmunidad, huesos y ánimo. No salir nunca no es la solución. Pero quemarse o depender solo de filtros químicos dudosos tampoco lo es.</p>",
      tipsTitle: "Estrategia solar inteligente para tu piel",
      tips: [
        { title: "Filtro mineral antes que químico", body: "Óxido de zinc y dióxido de titanio se quedan encima y reflejan UV en lugar de absorberlo. No se degradan tanto con la luz solar, irritan poco la piel sensible y evitan disruptores como oxybenzone." },
        { title: "Evita el sol de 11 a 15", body: "A mediodía el índice UV pega fuerte. Planifica actividades al aire libre por la mañana o tarde. Con 15–20 minutos de brazos y cara basta para vitamina D." },
        { title: "Sombrero y ropa primero", body: "La barrera física gana a la química. Un sombrero de ala ancha cubre cara, cuello y orejas. Tejidos densos con UPF bloquean UV mejor que cualquier crema." },
        { title: "Aplica la cantidad correcta", body: "La mayoría usa solo 25–50 por ciento de la dosis recomendada. La cara pide media cucharadita; reaplica cada dos horas al aire libre – más si sudas o nadas." },
        { title: "Antioxidantes refuerzan el SPF", body: "Vitamina C, vitamina E y niacinamida bajo el protector dan capa extra frente a radicales libres del UV. No sustituyen el filtro, lo potencian." }
      ],
      solutionTitle: "Repara piel dañada por el sol con CBD",
      solutionBody: "<p>Aun con buen filtro, algo de UV llega y genera radicales libres e inflamación. Ahí entra el CBD como aliado serio. Estudios sugieren que los cannabinoides tienen acción antioxidante que neutraliza radicales y reduce la respuesta inflamatoria inducida por UV en células de la piel.</p><p>Ta-Da Serum con 10% CBD tras la exposición ayuda a gestionar el estrés oxidativo y apoya la reparación. La acción antiinflamatoria del CBD vale oro en pieles solares sensibles que enrojecen fácil. Duo Ta-Da añade aceite para restaurar la barrera lipídica debilitada por el UV.</p><p>Au Naturel Makeup Remover es ideal para quitar el protector por la noche sin castigar una piel ya expuesta. El aceite MCT disuelve filtros minerales y cuida al mismo tiempo.</p>",
      faq: [
        { q: "¿Necesito protector todos los días?", a: "En invierno nórdico (octubre–marzo) el índice UV suele ser bajo para daño cotidiano. En la mitad cálida del año, sí – a diario si pasas más de 15 minutos fuera. Las nubes no frenan el UVA." },
        { q: "¿El CBD sustituye el protector?", a: "No, en absoluto. El CBD aporta antioxidantes que complementan, pero no filtra UV. Siempre filtro como primera línea y skincare CBD para reparar y reforzar." },
        { q: "¿Son peligrosos los filtros químicos?", a: "Sustancias como oxybenzone y octinoxate han mostrado efectos disruptores en estudios y se absorben en sangre. El mineral (óxido de zinc) suele ser más seguro, sobre todo en piel sensible y uso diario." },
        { q: "¿Cómo reparo piel ya dañada por el sol?", a: "El daño es acumulativo pero la piel puede recuperar. Antioxidantes (vitamina C, CBD), retinol y protección solar constante frenan más deterioro. Daño profundo puede pedir tratamiento profesional." }
      ],
      ctaTitle: "Protege hoy, repara esta noche",
      ctaSub: "El sol no es tu enemigo – pero pide respeto. Filtro por la mañana, recuperación CBD por la noche."
    },
    de: {
      metaTitle: "Sonnenschutz und Hautpflege – schützen ohne zu schaden",
      metaDescription: "Die Sonne altert die Haut mehr als fast alles andere. Lerne, dich clever zu schützen und sonnengeschädigte Haut natürlich zu reparieren. 1753 SKINCARE.",
      kicker: "Lifestyle & Haut",
      h1: "Sonnenschutz und Skincare – das einzige Anti-Aging, das wirklich zählt",
      lead: "UV-Strahlung steht für bis zu 80 Prozent der sichtbaren Hautalterung. Falten, Pigmentflecken, Schlaffheit – die Sonne ist der Hauptverdächtige. Es geht nicht darum, sich einzusperren. Es geht darum, clever zu sein.",
      problemTitle: "Was macht die Sonne mit der Haut?",
      problemBody: "<p>UV-Strahlung kommt in zwei Haupttypen: UVA und UVB. UVB verursacht Sonnenbrand und Schäden in den äußeren Schichten. UVA dringt tiefer, bricht Kollagen und Elastin in der Dermis – Falten, feine Linien, Pigmentverschiebungen. UVA kommt sogar durch Wolken und Fensterglas, ganzjährig.</p><p>Photoaging ist kumulativ. Jede ungeschützte Minute in der Sonne addiert sich. DNA-Schäden häufen sich in Hautzellen, irgendwann schaffen Reparaturmechanismen nicht mehr mit. Oft sieht man es erst 10–20 Jahre später – dann ist der Schaden längst da.</p><p>Das Paradox: Die Sonne ist auch lebenswichtig. Vitamin D, gebildet bei UVB in der Haut, zählt für Immunsystem, Knochen und Stimmung. Nie rauszugehen ist keine Lösung. Aber sorglos bräunen oder nur auf chemische Filter mit fragwürdigen Inhaltsstoffe zu setzen, auch nicht.</p>",
      tipsTitle: "Clevere Sonnenstrategie für die Haut",
      tips: [
        { title: "Mineralischer Sonnenschutz vor chemischem", body: "Zinkoxid und Titandioxid liegen obenauf und reflektieren UV statt es zu absorbieren. Sie zerfallen seltener in der Sonne, reizen selten empfindliche Haut und enthalten keine Hormonstörer wie Oxybenzon." },
        { title: "Sonne 11–15 Uhr meiden", body: "Mittags ist der UV-Index am höchsten. Outdoor-Aktivitäten morgens oder nachmittags planen. 15–20 Minuten Unterarme und Gesicht reichen oft für Vitamin D." },
        { title: "Hut und Kleidung zuerst", body: "Physischer Schutz schlägt Chemie. Ein breitkrempiger Hut schützt Gesicht, Nacken, Ohren. Dichte Stoffe mit UPF blockieren UV effektiver als jede Creme." },
        { title: "Genug auftragen", body: "Die meisten nutzen nur 25–50 Prozent der empfohlenen Menge. Gesicht braucht einen halben Teelöffel, alle zwei Stunden draußen nachcremen – öfter bei Schweiß oder Schwimmen." },
        { title: "Antioxidantien boosten Schutz", body: "Vitamin C, E und Niacinamid unter Sonnencreme liefern Extra-Schutz gegen freie Radikale vom UV. Sie ersetzen keinen Filter, verstärken ihn." }
      ],
      solutionTitle: "Sonnengeschädigte Haut mit CBD reparieren",
      solutionBody: "<p>Selbst mit bestem Filter erreicht etwas UV die Haut und erzeugt freie Radikale und Entzündung. Hier kommt CBD als starker Partner. Studien deuten darauf hin, dass Cannabinoide antioxidative Eigenschaften haben, Radikale neutralisieren und UV-induzierte Entzündungsreaktionen in Hautzellen dämpfen.</p><p>Ta-Da Serum mit 10% CBD nach Sonnenexposition hilft, oxidativen Stress zu bewältigen und Reparatur zu unterstützen. CBDs entzündungshemmende Wirkung ist besonders wertvoll bei sonnenempfindlicher Haut, die schnell rot wird. Duo Ta-Da ergänzt Öl und stellt die Lipidbarriere wieder her, die UV geschwächt hat.</p><p>Au Naturel Makeup Remover ist ideal, abends Sonnenschutz mild zu entfernen, ohne bereits exponierte Haut zu stressen. MCT-Öl löst mineralischen Filter effektiv und pflegt.</p>",
      faq: [
        { q: "Brauche ich täglich Sonnenschutz?", a: "Im nordischen Winterhalbjahr (Oktober–März) ist der UV-Index oft zu niedrig für Alltagsschäden. In der warmen Jahreshälfte ja – täglich, wenn du länger als 15 Minuten draußen bist. Bewölkung stoppt UVA nicht." },
        { q: "Kann CBD Sonnenschutz ersetzen?", a: "Nein, absolut nicht. CBD liefert antioxidative Unterstützung, filtert aber kein UV. Immer Sonnenschutz primär, CBD-Skincare für Reparatur und Verstärkung." },
        { q: "Ist chemischer Sonnenschutz gefährlich?", a: "Stoffe wie Oxybenzon und Octinoxat zeigten in Studien hormonelle Effekte und gelangen ins Blut. Mineralischer Schutz (Zinkoxid) ist meist sicherer, besonders für empfindliche Haut und Daily Use." },
        { q: "Wie repariere ich bereits sonnengeschädigte Haut?", a: "Schaden ist kumulativ, aber die Haut kann sich erholen. Antioxidantien (Vitamin C, CBD), Retinol und konsequenter Schutz bremsen weiteren Schaden. Tiefer Schaden kann professionelle Behandlung brauchen." }
      ],
      ctaTitle: "Heute schützen, heute Nacht reparieren",
      ctaSub: "Die Sonne ist nicht der Feind – aber sie will Respekt. Morgens Filter, abends CBD-Recovery."
    },
    fr: {
      metaTitle: "Protection solaire et peau – protéger sans abîmer",
      metaDescription: "Le soleil vieillit la peau plus que presque tout. Apprends à te protéger intelligemment et réparer les dégâts naturellement. 1753 SKINCARE.",
      kicker: "Mode de vie & peau",
      h1: "Protection solaire et skincare – le seul anti-âge qui compte vraiment",
      lead: "Les UV expliquent jusqu'à 80 % du vieillissement visible de la peau. Rides, taches, relâchement – le soleil est le grand coupable. Ce n'est pas une question de rester enfermé. C'est une question d'intelligence.",
      problemTitle: "Que fait le soleil à la peau ?",
      problemBody: "<p>Les UV du soleil se déclinent en UVA et UVB. L'UVB brûle et abîme les couches externes. L'UVA pénètre plus profond, casse collagène et élastine dans le derme – rides, ridules, pigmentation. L'UVA traverse nuages et vitres, toute l'année.</p><p>Le photo-vieillissement est cumulatif. Chaque minute sans protection s'ajoute. Les dommages à l'ADN s'accumulent dans les cellules et les mécanismes de réparation finissent débordés. Souvent invisible pendant 10–20 ans – et là, le mal est fait.</p><p>Le paradoxe : le soleil est vital. La vitamine D, produite dans la peau sous UVB, compte pour l'immunité, les os, l'humeur. Ne jamais sortir n'est pas la réponse. S'exposer sans filet ni ne compter que sur des filtres chimiques douteux non plus.</p>",
      tipsTitle: "Stratégie solaire maline pour la peau",
      tips: [
        { title: "Écran minéral plutôt que chimique", body: "Oxyde de zinc et dioxyde de titanium restent en surface et réfléchissent l'UV plutôt que l'absorber. Ils se dégradent moins au soleil, irritent rarement les peaux sensibles et évitent des perturbateurs comme l'oxybenzone." },
        { title: "Évite le soleil entre 11 h et 15 h", body: "À midi, l'indice UV explose. Planifie l'extérieur le matin ou l'après-midi. 15–20 minutes avant-bras et visage suffisent souvent pour la vitamine D." },
        { title: "Chapeau et vêtements d'abord", body: "La barrière physique bat la chimie. Un chapeau à large bord protège visage, nuque, oreilles. Des tissus denses avec UPF bloquent l'UV mieux qu'une crème." },
        { title: "Mets assez de produit", body: "La plupart n'appliquent que 25–50 % de la dose conseillée. Le visage veut une demi-cuillère à café ; renouvelle toutes les deux heures dehors – plus si tu transpires ou nages." },
        { title: "Les antioxydants boostent la protection", body: "Vitamine C, E et niacinamide sous la crème solaire ajoutent une couche contre les radicaux libres créés par l'UV. Ils ne remplacent pas l'écran, ils l'amplifient." }
      ],
      solutionTitle: "Réparer une peau abîmée par le soleil avec le CBD",
      solutionBody: "<p>Même avec un bon filtre, un peu d'UV arrive et crée radicaux libres et inflammation. Le CBD entre en allié sérieux. Des études suggèrent des propriétés antioxydantes des cannabinoïdes qui neutralisent les radicaux et réduisent la réponse inflammatoire induite par l'UV dans les cellules cutanées.</p><p>Ta-Da Serum à 10 % de CBD après exposition aide à gérer le stress oxydatif et soutient la réparation. L'action anti-inflammatoire du CBD est précieuse pour les peaux solaires sensibles qui rougissent vite. Duo Ta-Da ajoute une huile qui restaure la barrière lipidique fragilisée par l'UV.</p><p>Au Naturel Makeup Remover enlève délicatement la protection le soir sans agresser une peau déjà sollicitée. L'huile MCT dissout les filtres minéraux tout en nourrissant.</p>",
      faq: [
        { q: "Faut-il un écran tous les jours ?", a: "En hiver nordique (octobre–mars), l'indice UV est souvent trop bas pour des dégâts du quotidien. Pendant la moitié chaude de l'année, oui – quotidien si tu passes plus de 15 minutes dehors. Les nuages ne bloquent pas l'UVA." },
        { q: "Le CBD remplace-t-il la crème solaire ?", a: "Non, jamais. Le CBD apporte des antioxydants complémentaires mais ne filtre pas l'UV. Toujours écran en première ligne, skincare CBD pour réparer et renforcer." },
        { q: "Les filtres chimiques sont-ils dangereux ?", a: "Des molécules comme oxybenzone et octinoxate ont montré des effets perturbateurs dans des études et passent dans le sang. Le minéral (oxyde de zinc) est en général plus sûr, surtout peau sensible et usage quotidien." },
        { q: "Comment réparer une peau déjà abîmée par le soleil ?", a: "Les dégâts sont cumulatifs mais la peau peut se réparer. Antioxydants (vitamine C, CBD), rétinol et protection solaire constante freinent l'emballement. Les dommages profonds peuvent demander un soin pro." }
      ],
      ctaTitle: "Protège aujourd'hui, répare ce soir",
      ctaSub: "Le soleil n'est pas l'ennemi – mais il exige du respect. Écran le matin, récupération CBD le soir."
    }
  },
  {
    svSlug: "rokning-och-huden",
    enSlug: "smoking-and-skin",
    esSlug: "tabaco-y-piel",
    deSlug: "rauchen-und-haut",
    frSlug: "tabac-et-peau",
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
    },
    es: {
      metaTitle: "Tabaco y piel – cómo el tabaco destroza tu aspecto",
      metaDescription: "Fumar envejece la piel más rápido que casi nada. Entiende por qué y cómo reparar el daño. Guía honesta de 1753 SKINCARE.",
      kicker: "Estilo de vida y piel",
      h1: "Tabaco y piel – la verdad que ningún cigarrillo cuenta",
      lead: "Cada cigarrillo mete más de 4.000 químicos en tu cuerpo, y tu piel carga con todos. De media, la piel de quien fuma envejece 10–15 años antes. Arrugas, palidez, flacidez – el tabaco deja firma imposible de ocultar.",
      problemTitle: "¿Cómo daña fumar a la piel?",
      problemBody: "<p>El humo del tabaco ataca por dos frentes: por dentro vía sangre y por fuera en contacto directo. La nicotina contrae vasos y puede reducir hasta un 40 por ciento el flujo a la piel. Las células pasan hambre de oxígeno y nutrientes. Baja la producción de colágeno mientras suben enzimas que lo degradan (matrix metalloproteinases, MMP) – doble golpe que acelera arrugas.</p><p>Los radicales libres del humo generan estrés oxidativo masivo. Las reservas antioxidantes de la piel – vitamina C, E, carotenoides – se vacían. Los fumadores tienen menos vitamina C cutánea medible, con impacto directo en la síntesis de colágeno. Lo más visible es alrededor de ojos y boca: líneas de fumador y patas de gallo décadas antes que en no fumadores.</p><p>La barrera se debilita. La cicatrización puede retrasarse hasta un 50 por ciento. El riesgo de psoriasis se duplica. Hasta el humo de segunda mano deja huella medible. No hay forma segura de fumar y mantener piel sana – es imposible en biología.</p>",
      tipsTitle: "El camino de vuelta hacia una piel más sana",
      tips: [
        { title: "Deja de fumar – la piel recupera rápido", body: "En 2–4 semanas ya mejora la circulación cutánea. A los tres meses se nota el tono. El colágeno empieza a normalizarse en unos seis meses. Nunca es tarde." },
        { title: "Sube antioxidantes", body: "Vitamina C, E y betacaroteno – en comida y en skincare – ayudan a neutralizar el daño oxidativo. Un fumador necesita el doble de vitamina C que un no fumador; la piel lo pide por dentro y por fuera." },
        { title: "Bebe más agua", body: "Fumar deshidrata la piel y rompe su capacidad de retener humedad. Sube a al menos 2,5 litros al día y lima alcohol y cafeína que empeoran la sequedad." },
        { title: "Prioriza el sueño", body: "La nicotina es estimulante y rompe el descanso. Al dejar de fumar, invierte en sueño de calidad – de noche es cuando la piel hace su reparación más pesada. Buen sueño acelera la recuperación." },
        { title: "Ten paciencia", body: "La recuperación completa tras fumar lleva tiempo – 1–3 años para mejoras claras en arrugas y tono. Pero cada día sin cigarrillos suma. La piel recuerda, pero también perdona." }
      ],
      solutionTitle: "CBD – apoyo para piel en recuperación",
      solutionBody: "<p>La piel dañada por el humo pide apoyo intenso: antiinflamación, antioxidantes y reparación de barrera. El CBD toca las tres teclas. Al hablar con los receptores del ECS en la piel, amortigua la inflamación crónica de bajo grado que el tabaco instala y ayuda a las células a volver a la normalidad.</p><p>Ta-Da Serum con 10% CBD concentra apoyo antiinflamatorio y antioxidante donde más castigo hay – ojos, boca, mandíbula. Duo Ta-Da une sérum y aceite y devuelve lípidos a la piel deshidratada y con barrera rota.</p><p>El Duo-kit con The ONE e I LOVE entrega la experiencia cannabinoide completa con CBD y CBG. El CBG ha mostrado en estudios antioxidantes aún más fuertes que el CBD – clave para pieles años bajo estrés oxidativo del humo.</p>",
      faq: [
        { q: "¿Se repara la piel al dejar de fumar?", a: "Sí, la capacidad de recuperación sorprende. La circulación mejora en semanas, el colágeno se normaliza en meses, y tono y textura ganan en 1–3 años. Las arrugas muy profundas pueden quedarse." },
        { q: "¿El vape es igual de malo para la piel?", a: "La nicotina, sea como sea, contrae vasos y baja flujo cutáneo. El vape evita productos de combustión, pero el efecto vasoconstrictor de la nicotina sigue. Mejor que cigarrillos, no inocuo para la piel." },
        { q: "¿Qué productos ayudan más al parar?", a: "Apuesta por antioxidantes (vitamina C, CBD), hidratación profunda y barrera. Ta-Da Serum da base antiinflamatoria, Duo Ta-Da suma lípidos, Duo-kit abre el espectro de cannabinoides para máxima recuperación." },
        { q: "¿El humo pasivo afecta la piel?", a: "Sí. Estudios muestran más estrés oxidativo cutáneo y envejecimiento prematuro. Si vives con fumador, refuerza antioxidantes y evita espacios cerrados con humo." }
      ],
      ctaTitle: "Nunca es tarde para recomenzar",
      ctaSub: "La piel sana con fuerza si le das las herramientas adecuadas – te sorprenderá."
    },
    de: {
      metaTitle: "Rauchen und Haut – wie Tabak dein Aussehen zerstört",
      metaDescription: "Rauchen altert die Haut schneller als fast alles. Verstehe warum und wie du Schaden reparieren kannst. Ehrlicher Guide von 1753 SKINCARE.",
      kicker: "Lifestyle & Haut",
      h1: "Rauchen und Haut – die Wahrheit, die keine Zigarette erzählt",
      lead: "Jede Zigarette liefert über 4.000 Chemikalien in deinen Körper – deine Haut trägt jede einzelne. Im Schnitt altert Raucherhaut 10–15 Jahre schneller. Falten, Mattigkeit, Schlaffheit – Tabak hinterlässt Signaturen, die man nicht versteckt.",
      problemTitle: "Wie schadet Rauchen der Haut?",
      problemBody: "<p>Tabakrauch greift die Haut doppelt an: von innen übers Blut und von außen durch Kontakt. Nikotin verengt Gefäße und kann den Blutfluss zur Haut um bis zu 40 Prozent senken. Hautzellen hungern nach Sauerstoff und Nährstoffen. Kollagenproduktion sinkt, während Enzyme, die Kollagen abbauen (matrix metalloproteinases, MMPs), steigen – doppelter Verlust, der Falten dramatisch beschleunigt.</p><p>Freie Radikale im Rauch erzeugen massiven oxidativen Stress. Die antioxidativen Reserven der Haut – Vitamin C, E, Carotinoide – leeren sich. Raucher haben messbar weniger Vitamin C in der Haut, direkter Treffer für Kollagensynthese. Am sichtbarsten um Augen und Mund: typische Raucherfalten und Krähenfüße Jahrzehnte früher als bei Nichtrauchern.</p><p>Die Barriere schwächt sich. Wundheilung kann um bis zu 50 Prozent verzögert werden. Psoriasis-Risiko verdoppelt sich. Selbst Passivrauch wirkt messbar auf die Haut. Es gibt keinen sicheren Weg zu rauchen und gesunde Haut zu behalten – biologisch unmöglich.</p>",
      tipsTitle: "Der Weg zurück zu gesünderer Haut",
      tips: [
        { title: "Mit dem Rauchen aufhören – Haut erholt sich schnell", body: "Schon nach 2–4 Wochen verbessert sich die Durchblutung sichtbar. Nach drei Monaten wird der Teint besser. Kollagen normalisiert sich in etwa sechs Monaten. Es ist nie zu spät." },
        { title: "Antioxidantien tanken", body: "Vitamin C, E und Beta-Carotin – in Ernährung und Skincare – helfen, oxidativen Schaden zu neutralisieren. Raucher brauchen doppelt so viel Vitamin C wie Nichtraucher; die Haut braucht es innen und außen." },
        { title: "Mehr Wasser trinken", body: "Rauchen dehydriert die Haut und schwächt die Feuchtespeicherung. Mindestens 2,5 Liter täglich, Alkohol und Koffein reduzieren, die Trockenheit verschlimmern." },
        { title: "Schlaf priorisieren", body: "Nikotin ist stimulierend und stört Schlaf. Nach dem Aufhörren in Schlafqualität investieren – nachts passiert die schwerste Hautreparatur. Guter Schlaf beschleunigt Recovery." },
        { title: "Geduld haben", body: "Volle Hautrecovery nach Rauchen braucht Zeit – 1–3 Jahre für deutliche Verbesserungen bei Falten und Teint. Aber jeder tag ohne Zigaretten zählt. Haut erinnert sich, vergibt aber auch." }
      ],
      solutionTitle: "CBD – Unterstützung für regenerierende Haut",
      solutionBody: "<p>Rauchgeschädigte Haut braucht intensive Mehrfronten-Unterstützung: entzündungshemmend, antioxidativ, Barrierereparatur. CBD adressiert alles drei. Über ECS-Rezeptoren in der Haut dämpft es chronische Low-Grade-Entzündung vom Tabak und hilft Zellen, wieder normal zu funktionieren.</p><p>Ta-Da Serum mit 10% CBD liefert konzentrierte antiinflammatorische und antioxidative Hilfe genau dort, wo es am härtesten trifft – Augen, Mund, Kieferlinie. Duo Ta-Da kombiniert Serum und Öl und gibt dehydrierter, barrierengeschädigter Haut dringend nötige Lipide zurück.</p><p>Das Duo-kit mit The ONE und I LOVE bringt das volle Cannabinoid-Erlebnis mit CBD und CBG. CBG zeigte in Studien noch stärkere antioxidative Eigenschaften als CBD – besonders relevant nach Jahren oxidativen Stresses durch Tabakrauch.</p>",
      faq: [
        { q: "Regeneriert sich Haut nach dem Rauchstopp?", a: "Ja, die Erholungsfähigkeit ist bemerkenswert. Durchblutung verbessert sich in Wochen, Kollagen normalisiert in Monaten, sichtbare Verbesserungen in 1–3 Jahren. Tiefe Falten können bleiben." },
        { q: "Ist Vaping genauso schädlich für die Haut?", a: "Nikotin egal welche Lieferform verengt Gefäße und senkt Hautdurchblutung. Vaping hat keine Verbrennungsprodukte, aber Nikotins vasokonstriktiver Effekt bleibt. Besser als Zigaretten, für die Haut nicht harmlos." },
        { q: "Welche Produkte helfen am meisten nach dem Stopp?", a: "Fokus auf Antioxidantien (Vitamin C, CBD), tiefe Feuchtigkeit, Barriereunterstützung. Ta-Da Serum liefert antiinflammatorische Basis, Duo Ta-Da Lipide, Duo-kit das volle Cannabinoidspektrum für maximale Recovery." },
        { q: "Beeinflusst Passivrauch die Haut?", a: "Ja. Studien zeigen erhöhten oxidativen Stress in der Haut und können vorzeitiges Altern fördern. Wenn du mit einem Raucher lebst: Antioxidantien schützen und geschlossene Räume mit Rauch meiden." }
      ],
      ctaTitle: "Es ist nie zu spät für einen Neustart",
      ctaSub: "Haut kann enorm heilen – gib ihr die richtigen Tools und sie wird dich überraschen."
    },
    fr: {
      metaTitle: "Tabac et peau – comment le tabac détruit ton apparence",
      metaDescription: "Fumer vieillit la peau plus vite que presque tout. Comprends pourquoi et comment réparer. Guide honnête 1753 SKINCARE.",
      kicker: "Mode de vie & peau",
      h1: "Tabac et peau – la vérité qu'aucune cigarette ne raconte",
      lead: "Chaque cigarette envoie plus de 4 000 composés dans ton corps, et ta peau porte chacun d'eux. En moyenne, la peau des fumeurs vieillit 10–15 ans plus vite. Rides, terne, relâchement – le tabac laisse une empreinte qu'on ne maquille pas.",
      problemTitle: "Comment le tabac abîme-t-il la peau ?",
      problemBody: "<p>La fumée attaque sur deux fronts : de l'intérieur via le sang et de l'extérieur au contact. La nicotine resserre les vaisseaux et peut réduire jusqu'à 40 % le flux vers la peau. Les cellules manquent d'oxygène et de nutriments. La production de collagène baisse pendant que montent les enzymes qui le dégradent (matrix metalloproteinases, MMP) – double perte qui accélère les rides.</p><p>Les radicaux libres de la fumée créent un stress oxydatif massif. Les réserves antioxydantes de la peau – vitamine C, E, caroténoïdes – se vident. Les fumeurs ont moins de vitamine C cutanée mesurable, avec impact direct sur la synthèse du collagène. Le plus visible : autour des yeux et de la bouche, rides du fumeur et pattes d'oie des décennies plus tôt.</p><p>La barrière faiblit. La cicatrisation peut prendre jusqu'à 50 % de retard. Le risque de psoriasis double. Même la fumée secondaire marque la peau. Il n'existe pas de façon saine de fumer – c'est biologiquement impossible.</p>",
      tipsTitle: "Le chemin vers une peau plus saine",
      tips: [
        { title: "Arrête de fumer – la peau rebondit vite", body: "En 2–4 semaines, la circulation cutanée s'améliore. Après trois mois, le teint gagne. Le collagène recommence à se normaliser vers six mois. Il n'est jamais trop tard." },
        { title: "Charge en antioxydants", body: "Vitamine C, E et bêta-carotène – dans l'assiette et le skincare – aident à neutraliser l'oxydation. Un fumeur a besoin du double de vitamine C qu'un non-fumeur ; la peau veut ça de l'intérieur et de l'extérieur." },
        { title: "Bois plus d'eau", body: "Fumer déshydrate la peau et affaiblit sa rétention d'eau. Vise au moins 2,5 litres par jour et limite alcool et caféine qui aggravent la sécheresse." },
        { title: "Priorise le sommeil", body: "La nicotine stimule et casse le repos. Après l'arrêt, investis dans la qualité du sommeil – c'est la nuit que la peau répare le plus. Bon sommeil = récupération plus rapide." },
        { title: "Sois patiente", body: "La récupération complète après le tabac prend du temps – 1–3 ans pour des gains nets sur rides et teint. Mais chaque jour sans cigarette compte. La peau se souvient, mais elle pardonne aussi." }
      ],
      solutionTitle: "CBD – soutien pour une peau en récupération",
      solutionBody: "<p>La peau abîmée par la fumée exige un soutien intense : anti-inflammation, antioxydants, réparation de barrière. Le CBD touche les trois leviers. Via les récepteurs de l'ECS dans la peau, il amortit l'inflammation chronique bas degré installée par le tabac et aide les cellules à retrouver un fonctionnement normal.</p><p>Ta-Da Serum à 10 % de CBD concentre soutien anti-inflammatoire et antioxydant là où ça fait mal – yeux, bouche, mâchoire. Duo Ta-Da combine sérum et huile et redonne des lipides à une peau déshydratée à barrière compromise.</p><p>Le Duo-kit avec The ONE et I LOVE offre l'expérience cannabinoïde complète avec CBD et CBG. Le CBG a montré en études des propriétés antioxydantes encore plus marquées que le CBD – particulièrement utile après des années de stress oxydatif du tabac.</p>",
      faq: [
        { q: "La peau se répare-t-elle après l'arrêt ?", a: "Oui, la capacité de récupération est remarquable. Circulation en semaines, collagène en mois, améliorations visibles en 1–3 ans. Les rides très profondes peuvent rester." },
        { q: "Le vapotage est-il aussi nocif pour la peau ?", a: "La nicotine, quelle que soit la forme, resserre les vaisseaux et baisse le flux cutané. Le vape évite les produits de combustion, mais l'effet vasoconstricteur de la nicotine reste. Mieux que les cigarettes, pas innocent pour la peau." },
        { q: "Quels produits aident le plus après l'arrêt ?", a: "Mise sur antioxydants (vitamine C, CBD), hydratation profonde et barrière. Ta-Da Serum pose une base anti-inflammatoire, Duo Ta-Da ajoute des lipides, Duo-kit ouvre le spectre des cannabinoïdes pour une récup max." },
        { q: "La fumée passive affecte-t-elle la peau ?", a: "Oui. Des études montrent plus de stress oxydatif cutané et un vieillissement prématuré. Si tu vis avec un fumeur, renforce les antioxydants et évite les espaces clos enfumés." }
      ],
      ctaTitle: "Il n'est jamais trop tard pour recommencer",
      ctaSub: "La peau a une capacité de guérison énorme – donne-lui les bons outils et elle te surprendra."
    }
  }
];
