export type VideoLocale = "sv" | "en" | "es" | "de" | "fr";

type Texts = Record<VideoLocale, string>;

function t(locale: VideoLocale, texts: Texts): string {
  return texts[locale];
}

export function getTexts(locale: VideoLocale) {
  return {
    // Opener
    freeAnalysis: t(locale, { sv: "Gratis AI-hudanalys", en: "Free AI skin analysis", es: "Análisis de piel con IA gratis", de: "Kostenlose KI-Hautanalyse", fr: "Analyse de peau IA gratuite" }),
    openerSub: t(locale, { sv: "15 vetenskapliga metriker. Personliga rekommendationer.", en: "15 scientific metrics. Personalised recommendations.", es: "15 métricas científicas. Recomendaciones personalizadas.", de: "15 wissenschaftliche Metriken. Persönliche Empfehlungen.", fr: "15 métriques scientifiques. Recommandations personnalisées." }),

    // IntroScreen
    step1: t(locale, { sv: "Steg 1", en: "Step 1", es: "Paso 1", de: "Schritt 1", fr: "Étape 1" }),
    startAnalysis: t(locale, { sv: "Starta din analys", en: "Start your analysis", es: "Inicia tu análisis", de: "Starte deine Analyse", fr: "Lance ton analyse" }),
    introBody: t(locale, {
      sv: "Ange din e-post och besvara sju korta frågor om din hud, livsstil och mål.",
      en: "Enter your email and answer seven short questions about your skin, lifestyle and goals.",
      es: "Introduce tu email y responde siete preguntas cortas sobre tu piel, estilo de vida y objetivos.",
      de: "Gib deine E-Mail ein und beantworte sieben kurze Fragen zu deiner Haut, deinem Lebensstil und deinen Zielen.",
      fr: "Entre ton email et réponds à sept questions courtes sur ta peau, ton mode de vie et tes objectifs.",
    }),
    badgeAI: t(locale, { sv: "AI-driven", en: "AI-powered", es: "Con IA", de: "KI-gesteuert", fr: "Propulsé par IA" }),
    badgeFree: t(locale, { sv: "100% gratis", en: "100% free", es: "100% gratis", de: "100% kostenlos", fr: "100% gratuit" }),
    badge2min: t(locale, { sv: "2 min", en: "2 min", es: "2 min", de: "2 Min", fr: "2 min" }),

    // ScanScene
    step2: t(locale, { sv: "Steg 2", en: "Step 2", es: "Paso 2", de: "Schritt 2", fr: "Étape 2" }),
    faceScan: t(locale, { sv: "Ansiktsskanning", en: "Face scanning", es: "Escaneo facial", de: "Gesichtsscan", fr: "Scan facial" }),
    scanBody: t(locale, {
      sv: "MediaPipe kartlägger 478 punkter och analyserar 12 zoner på ditt ansikte.",
      en: "MediaPipe maps 478 points and analyses 12 zones on your face.",
      es: "MediaPipe mapea 478 puntos y analiza 12 zonas de tu rostro.",
      de: "MediaPipe kartiert 478 Punkte und analysiert 12 Zonen deines Gesichts.",
      fr: "MediaPipe cartographie 478 points et analyse 12 zones de ton visage.",
    }),
    scanLocal: t(locale, {
      sv: "Allt sker lokalt i din enhet.",
      en: "Everything runs locally on your device.",
      es: "Todo se ejecuta localmente en tu dispositivo.",
      de: "Alles läuft lokal auf deinem Gerät.",
      fr: "Tout se passe localement sur ton appareil.",
    }),
    zoneForehead: t(locale, { sv: "Panna", en: "Forehead", es: "Frente", de: "Stirn", fr: "Front" }),
    zoneLeftCheek: t(locale, { sv: "Vänster kind", en: "Left cheek", es: "Mejilla izquierda", de: "Linke Wange", fr: "Joue gauche" }),
    zoneRightCheek: t(locale, { sv: "Höger kind", en: "Right cheek", es: "Mejilla derecha", de: "Rechte Wange", fr: "Joue droite" }),
    zoneNose: t(locale, { sv: "Näsa", en: "Nose", es: "Nariz", de: "Nase", fr: "Nez" }),
    zoneChin: t(locale, { sv: "Haka", en: "Chin", es: "Barbilla", de: "Kinn", fr: "Menton" }),
    zoneTZone: t(locale, { sv: "T-zon", en: "T-zone", es: "Zona T", de: "T-Zone", fr: "Zone T" }),

    // QuizMontage
    step3of4: t(locale, { sv: "STEG 3 AV 4", en: "STEP 3 OF 4", es: "PASO 3 DE 4", de: "SCHRITT 3 VON 4", fr: "ÉTAPE 3 SUR 4" }),
    quizSkinType: t(locale, { sv: "Vilken hudtyp har du?", en: "What is your skin type?", es: "¿Cuál es tu tipo de piel?", de: "Welchen Hauttyp hast du?", fr: "Quel est ton type de peau ?" }),
    quizSkinTypeSub: t(locale, { sv: "Välj det alternativ som stämmer bäst.", en: "Choose the option that fits best.", es: "Elige la opción que mejor se ajuste.", de: "Wähle die passendste Option.", fr: "Choisis l'option qui correspond le mieux." }),
    skinDry: t(locale, { sv: "Torr", en: "Dry", es: "Seca", de: "Trocken", fr: "Sèche" }),
    skinNormal: t(locale, { sv: "Normal", en: "Normal", es: "Normal", de: "Normal", fr: "Normale" }),
    skinCombi: t(locale, { sv: "Kombinerad", en: "Combination", es: "Mixta", de: "Mischhaut", fr: "Mixte" }),
    skinOily: t(locale, { sv: "Oljig", en: "Oily", es: "Grasa", de: "Fettig", fr: "Grasse" }),
    skinSensitive: t(locale, { sv: "Känslig", en: "Sensitive", es: "Sensible", de: "Empfindlich", fr: "Sensible" }),
    quizImprove: t(locale, { sv: "Vad vill du förbättra?", en: "What do you want to improve?", es: "¿Qué quieres mejorar?", de: "Was möchtest du verbessern?", fr: "Que veux-tu améliorer ?" }),
    quizImproveSub: t(locale, { sv: "Välj upp till 4 områden.", en: "Select up to 4 areas.", es: "Selecciona hasta 4 áreas.", de: "Wähle bis zu 4 Bereiche.", fr: "Sélectionne jusqu'à 4 zones." }),
    acne: t(locale, { sv: "Acne / finnar", en: "Acne / blemishes", es: "Acné / granos", de: "Akne / Pickel", fr: "Acné / boutons" }),
    dryness: t(locale, { sv: "Torrhet", en: "Dryness", es: "Sequedad", de: "Trockenheit", fr: "Sécheresse" }),
    redness: t(locale, { sv: "Rodnad", en: "Redness", es: "Rojez", de: "Rötung", fr: "Rougeur" }),
    aging: t(locale, { sv: "Åldrande", en: "Ageing", es: "Envejecimiento", de: "Alterung", fr: "Vieillissement" }),
    largePores: t(locale, { sv: "Stora porer", en: "Large pores", es: "Poros grandes", de: "Große Poren", fr: "Pores dilatés" }),
    dullSkin: t(locale, { sv: "Matt hy", en: "Dull skin", es: "Piel apagada", de: "Fahle Haut", fr: "Teint terne" }),
    quizGoals: t(locale, { sv: "Dina mål och känsligheter", en: "Your goals and sensitivities", es: "Tus objetivos y sensibilidades", de: "Deine Ziele und Empfindlichkeiten", fr: "Tes objectifs et sensibilités" }),
    quizGoalsSub: t(locale, { sv: "Berätta vad du vill uppnå.", en: "Tell us what you want to achieve.", es: "Cuéntanos qué quieres lograr.", de: "Erzähle uns, was du erreichen möchtest.", fr: "Dis-nous ce que tu veux atteindre." }),
    moreGlow: t(locale, { sv: "Mer lyster", en: "More glow", es: "Más brillo", de: "Mehr Ausstrahlung", fr: "Plus d'éclat" }),
    calmRedness: t(locale, { sv: "Lugna rodnad", en: "Calm redness", es: "Calmar rojez", de: "Rötung beruhigen", fr: "Calmer les rougeurs" }),
    clearerSkin: t(locale, { sv: "Renare hud", en: "Clearer skin", es: "Piel más limpia", de: "Reinere Haut", fr: "Peau plus nette" }),
    preventAging: t(locale, { sv: "Förebygga åldrande", en: "Prevent ageing", es: "Prevenir envejecimiento", de: "Alterung vorbeugen", fr: "Prévenir le vieillissement" }),
    deepHydration: t(locale, { sv: "Djupare återfuktning", en: "Deeper hydration", es: "Hidratación profunda", de: "Tiefere Feuchtigkeit", fr: "Hydratation profonde" }),
    simplerRoutine: t(locale, { sv: "Enklare rutin", en: "Simpler routine", es: "Rutina más simple", de: "Einfachere Routine", fr: "Routine plus simple" }),

    // AnalyzingScene
    statusTexts: [
      t(locale, { sv: "Förbereder analys...", en: "Preparing analysis...", es: "Preparando análisis...", de: "Analyse wird vorbereitet...", fr: "Préparation de l'analyse..." }),
      t(locale, { sv: "Bearbetar skanningsdata...", en: "Processing scan data...", es: "Procesando datos del escaneo...", de: "Verarbeite Scandaten...", fr: "Traitement des données..." }),
      t(locale, { sv: "Analyserar hudstruktur...", en: "Analysing skin structure...", es: "Analizando estructura de la piel...", de: "Hautstruktur wird analysiert...", fr: "Analyse de la structure cutanée..." }),
      t(locale, { sv: "Identifierar fokusområden...", en: "Identifying focus areas...", es: "Identificando áreas de enfoque...", de: "Schwerpunkte werden erkannt...", fr: "Identification des zones clés..." }),
      t(locale, { sv: "Beräknar hudmetriker...", en: "Calculating skin metrics...", es: "Calculando métricas de piel...", de: "Hautmetriken werden berechnet...", fr: "Calcul des métriques cutanées..." }),
      t(locale, { sv: "Bygger personliga rekommendationer...", en: "Building personalised recommendations...", es: "Creando recomendaciones personalizadas...", de: "Persönliche Empfehlungen werden erstellt...", fr: "Création des recommandations personnalisées..." }),
      t(locale, { sv: "Klar!", en: "Done!", es: "¡Listo!", de: "Fertig!", fr: "Terminé !" }),
    ],
    aiBuilding: t(locale, { sv: "Vår AI bygger din personliga analys", en: "Our AI is building your personal analysis", es: "Nuestra IA está creando tu análisis personal", de: "Unsere KI erstellt deine persönliche Analyse", fr: "Notre IA construit ton analyse personnalisée" }),

    // ScoreReveal
    yourScore: t(locale, { sv: "Din hudpoäng", en: "Your skin score", es: "Tu puntuación de piel", de: "Dein Hautwert", fr: "Ton score peau" }),
    ofHundred: t(locale, { sv: "av 100", en: "of 100", es: "de 100", de: "von 100", fr: "sur 100" }),
    skinAge: t(locale, { sv: "Biologisk hudålder", en: "Biological skin age", es: "Edad biológica de la piel", de: "Biologisches Hautalter", fr: "Âge biologique de la peau" }),
    ageYears: t(locale, { sv: "32 år", en: "32 years", es: "32 años", de: "32 Jahre", fr: "32 ans" }),
    yourMetrics: t(locale, { sv: "Dina metriker", en: "Your metrics", es: "Tus métricas", de: "Deine Metriken", fr: "Tes métriques" }),
    hydration: t(locale, { sv: "Återfuktning", en: "Hydration", es: "Hidratación", de: "Feuchtigkeit", fr: "Hydratation" }),
    elasticity: t(locale, { sv: "Elasticitet", en: "Elasticity", es: "Elasticidad", de: "Elastizität", fr: "Élasticité" }),
    poreStructure: t(locale, { sv: "Porstruktur", en: "Pore structure", es: "Estructura de poros", de: "Porenstruktur", fr: "Structure des pores" }),
    texture: t(locale, { sv: "Textur", en: "Texture", es: "Textura", de: "Textur", fr: "Texture" }),
    evenness: t(locale, { sv: "Jämnhet", en: "Evenness", es: "Uniformidad", de: "Ebenmäßigkeit", fr: "Uniformité" }),
    sensitivity: t(locale, { sv: "Känslighet", en: "Sensitivity", es: "Sensibilidad", de: "Empfindlichkeit", fr: "Sensibilité" }),

    // ProductsScene
    recommendedProducts: t(locale, { sv: "Rekommenderade produkter", en: "Recommended products", es: "Productos recomendados", de: "Empfohlene Produkte", fr: "Produits recommandés" }),
    basedOnAnalysis: t(locale, { sv: "Baserat på din analys", en: "Based on your analysis", es: "Basado en tu análisis", de: "Basierend auf deiner Analyse", fr: "Basé sur ton analyse" }),
    productCleansing: t(locale, { sv: "MCT + CBD Rengöring", en: "MCT + CBD Cleanser", es: "Limpiador MCT + CBD", de: "MCT + CBD Reinigung", fr: "Nettoyant MCT + CBD" }),

    // OutroCTA
    tryFreeToday: t(locale, { sv: "Prova gratis idag", en: "Try free today", es: "Prueba gratis hoy", de: "Heute kostenlos testen", fr: "Essaie gratuitement" }),
    ctaSub: t(locale, {
      sv: "Få din personliga AI-hudanalys på 2 minuter.",
      en: "Get your personal AI skin analysis in 2 minutes.",
      es: "Obtén tu análisis de piel con IA en 2 minutos.",
      de: "Erhalte deine persönliche KI-Hautanalyse in 2 Minuten.",
      fr: "Obtiens ton analyse de peau IA en 2 minutes.",
    }),
    ctaUrl: t(locale, {
      sv: "1753skin.com/hudanalys",
      en: "1753skin.com/skin-analysis",
      es: "1753skin.com/analisis-de-piel",
      de: "1753skin.com/hautanalyse",
      fr: "1753skin.com/analyse-de-peau",
    }),
    slogan: t(locale, {
      sv: "CBD & CBG hudvård i världsklass",
      en: "World-class CBD & CBG skincare",
      es: "Cuidado de piel CBD & CBG de clase mundial",
      de: "CBD & CBG Hautpflege auf Weltklasse-Niveau",
      fr: "Soins CBD & CBG de classe mondiale",
    }),
  };
}

export type VideoTexts = ReturnType<typeof getTexts>;
