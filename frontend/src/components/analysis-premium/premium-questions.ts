// frontend/src/components/analysis-premium/premium-questions.ts
//
// 35 frågor i 8 kategorier för premium-hudanalysen.
// Fritext, skala 1–10, single/multi-choice. Inline-översättningar (sv/en/es/de/fr)
// så att premium-flödet är självförsörjande utan att röra existerande språkfiler.

export type PremiumQuestionType = "scale" | "select" | "multiselect" | "text" | "longtext" | "number";

export interface PremiumQuestionOption {
  value: string;
  label: { sv: string; en: string; es?: string; de?: string; fr?: string };
}

export interface PremiumQuestion {
  id: string;
  category: PremiumCategoryKey;
  type: PremiumQuestionType;
  required?: boolean;
  prompt: { sv: string; en: string; es?: string; de?: string; fr?: string };
  helper?: { sv: string; en: string; es?: string; de?: string; fr?: string };
  options?: PremiumQuestionOption[];
  min?: number;
  max?: number;
  step?: number;
  /** Visa endast om predicate(answers) är true. Används för hormonkategori. */
  showIf?: (answers: Record<string, Record<string, unknown>>) => boolean;
  /** Maxlängd för text/longtext. */
  maxLength?: number;
}

export type PremiumCategoryKey =
  | "foundation"
  | "sleep"
  | "stress"
  | "nutrition"
  | "movement"
  | "routine"
  | "hormones"
  | "goals";

export const PREMIUM_CATEGORIES: { key: PremiumCategoryKey; i18nKey: string; order: number }[] = [
  { key: "foundation", i18nKey: "catFoundation", order: 1 },
  { key: "sleep",      i18nKey: "catSleep",      order: 2 },
  { key: "stress",     i18nKey: "catStress",     order: 3 },
  { key: "nutrition",  i18nKey: "catNutrition",  order: 4 },
  { key: "movement",   i18nKey: "catMovement",   order: 5 },
  { key: "routine",    i18nKey: "catRoutine",    order: 6 },
  { key: "hormones",   i18nKey: "catHormones",   order: 7 },
  { key: "goals",      i18nKey: "catGoals",      order: 8 },
];

export function tx(
  text: { sv: string; en: string; es?: string; de?: string; fr?: string },
  locale: string
): string {
  if (locale === "sv") return text.sv;
  if (locale === "en") return text.en;
  if (locale === "es") return text.es || text.en;
  if (locale === "de") return text.de || text.en;
  if (locale === "fr") return text.fr || text.en;
  return text.en;
}

const skinTypes: PremiumQuestionOption[] = [
  { value: "dry", label: { sv: "Torr", en: "Dry", es: "Seca", de: "Trocken", fr: "Sèche" } },
  { value: "normal", label: { sv: "Normal", en: "Normal", es: "Normal", de: "Normal", fr: "Normale" } },
  { value: "combo", label: { sv: "Kombinerad", en: "Combination", es: "Mixta", de: "Mischhaut", fr: "Mixte" } },
  { value: "oily", label: { sv: "Fet", en: "Oily", es: "Grasa", de: "Fettig", fr: "Grasse" } },
  { value: "sensitive", label: { sv: "Känslig", en: "Sensitive", es: "Sensible", de: "Empfindlich", fr: "Sensible" } },
];

const sleepQualities: PremiumQuestionOption[] = [
  { value: "poor", label: { sv: "Dålig (vaknar ofta)", en: "Poor (often wakes up)", es: "Mala", de: "Schlecht", fr: "Mauvaise" } },
  { value: "ok", label: { sv: "OK", en: "OK", es: "Aceptable", de: "OK", fr: "Correcte" } },
  { value: "good", label: { sv: "Bra", en: "Good", es: "Buena", de: "Gut", fr: "Bonne" } },
  { value: "excellent", label: { sv: "Utmärkt", en: "Excellent", es: "Excelente", de: "Ausgezeichnet", fr: "Excellente" } },
];

const yesNo: PremiumQuestionOption[] = [
  { value: "yes", label: { sv: "Ja", en: "Yes", es: "Sí", de: "Ja", fr: "Oui" } },
  { value: "no", label: { sv: "Nej", en: "No", es: "No", de: "Nein", fr: "Non" } },
  { value: "unsure", label: { sv: "Osäker", en: "Not sure", es: "No sé", de: "Unsicher", fr: "Pas sûr·e" } },
];

const frequencies: PremiumQuestionOption[] = [
  { value: "never", label: { sv: "Aldrig", en: "Never", es: "Nunca", de: "Nie", fr: "Jamais" } },
  { value: "rarely", label: { sv: "Sällan", en: "Rarely", es: "Rara vez", de: "Selten", fr: "Rarement" } },
  { value: "weekly", label: { sv: "Varje vecka", en: "Weekly", es: "Semanal", de: "Wöchentlich", fr: "Chaque semaine" } },
  { value: "daily", label: { sv: "Dagligen", en: "Daily", es: "Diariamente", de: "Täglich", fr: "Quotidiennement" } },
];

export const PREMIUM_QUESTIONS: PremiumQuestion[] = [
  // -- 1. Grundläggande hud (5 frågor) --
  {
    id: "name", category: "foundation", type: "text", required: true, maxLength: 100,
    prompt: { sv: "Ditt namn", en: "Your name", es: "Tu nombre", de: "Dein Name", fr: "Votre nom" },
  },
  {
    id: "age", category: "foundation", type: "number", required: true, min: 16, max: 99,
    prompt: { sv: "Ålder", en: "Age", es: "Edad", de: "Alter", fr: "Âge" },
  },
  {
    id: "skinType", category: "foundation", type: "select", required: true,
    prompt: { sv: "Vilken hudtyp har du?", en: "What is your skin type?", es: "¿Cuál es tu tipo de piel?", de: "Welcher Hauttyp hast du?", fr: "Quel est votre type de peau ?" },
    options: skinTypes,
  },
  {
    id: "diagnoses", category: "foundation", type: "multiselect",
    prompt: { sv: "Har du fått en hud-diagnos? (välj alla som gäller)", en: "Have you been given a skin diagnosis? (select all)", es: "¿Has recibido un diagnóstico de piel?", de: "Hast du eine Hautdiagnose?", fr: "Avez-vous un diagnostic cutané ?" },
    options: [
      { value: "none", label: { sv: "Ingen", en: "None", es: "Ninguno", de: "Keine", fr: "Aucun" } },
      { value: "acne", label: { sv: "Akne", en: "Acne", es: "Acné", de: "Akne", fr: "Acné" } },
      { value: "rosacea", label: { sv: "Rosacea", en: "Rosacea", es: "Rosácea", de: "Rosacea", fr: "Rosacée" } },
      { value: "eczema", label: { sv: "Eksem / atopisk dermatit", en: "Eczema / atopic dermatitis", es: "Eccema", de: "Ekzem", fr: "Eczéma" } },
      { value: "psoriasis", label: { sv: "Psoriasis", en: "Psoriasis", es: "Psoriasis", de: "Psoriasis", fr: "Psoriasis" } },
      { value: "perioral", label: { sv: "Perioral dermatit", en: "Perioral dermatitis", es: "Dermatitis perioral", de: "Periorale Dermatitis", fr: "Dermatite péri-orale" } },
      { value: "melasma", label: { sv: "Melasma / pigmentfläckar", en: "Melasma / pigmentation", es: "Melasma", de: "Melasma", fr: "Mélasma" } },
    ],
  },
  {
    id: "history", category: "foundation", type: "longtext", maxLength: 500,
    prompt: { sv: "Beskriv din hudhistorik kort: när började problemen, vad har försvunnit/kommit tillbaka?", en: "Describe your skin history briefly: when did issues start, what has gone/returned?", es: "Describe brevemente tu historial cutáneo.", de: "Beschreibe kurz deine Hautgeschichte.", fr: "Décrivez brièvement votre histoire cutanée." },
  },

  // -- 2. Sömn (3 frågor) --
  {
    id: "hours", category: "sleep", type: "number", min: 3, max: 12, required: true,
    prompt: { sv: "Hur många timmar sover du i snitt per natt?", en: "How many hours do you sleep on average?", es: "¿Cuántas horas duermes de media?", de: "Wie viele Stunden schläfst du im Schnitt?", fr: "Combien d'heures dormez-vous en moyenne ?" },
  },
  {
    id: "quality", category: "sleep", type: "select", required: true,
    prompt: { sv: "Hur upplever du sömnkvaliteten?", en: "How do you rate your sleep quality?", es: "¿Cómo es la calidad del sueño?", de: "Wie ist deine Schlafqualität?", fr: "Comment évaluez-vous la qualité du sommeil ?" },
    options: sleepQualities,
  },
  {
    id: "wakeups", category: "sleep", type: "select",
    prompt: { sv: "Vaknar du under natten?", en: "Do you wake up during the night?", es: "¿Te despiertas por la noche?", de: "Wachst du nachts auf?", fr: "Vous réveillez-vous la nuit ?" },
    options: frequencies,
  },

  // -- 3. Stress & mental (4 frågor) --
  {
    id: "level", category: "stress", type: "scale", required: true, min: 1, max: 10, step: 1,
    prompt: { sv: "Stressnivå senaste månaden (1 = lugnt, 10 = mycket stressigt)", en: "Stress level over the past month (1 calm – 10 very stressful)", es: "Nivel de estrés del último mes (1–10)", de: "Stresslevel im letzten Monat (1–10)", fr: "Niveau de stress sur le dernier mois (1–10)" },
  },
  {
    id: "management", category: "stress", type: "multiselect",
    prompt: { sv: "Hur hanterar du stress?", en: "How do you manage stress?", es: "¿Cómo gestionas el estrés?", de: "Wie bewältigst du Stress?", fr: "Comment gérez-vous le stress ?" },
    options: [
      { value: "exercise", label: { sv: "Träning", en: "Exercise", es: "Ejercicio", de: "Sport", fr: "Sport" } },
      { value: "meditation", label: { sv: "Meditation / mindfulness", en: "Meditation / mindfulness", es: "Meditación", de: "Meditation", fr: "Méditation" } },
      { value: "breathing", label: { sv: "Andningsövningar", en: "Breathing exercises", es: "Respiración", de: "Atmen", fr: "Respiration" } },
      { value: "nature", label: { sv: "Tid i naturen", en: "Time in nature", es: "Naturaleza", de: "Natur", fr: "Nature" } },
      { value: "social", label: { sv: "Socialt umgänge", en: "Social time", es: "Vida social", de: "Soziales", fr: "Vie sociale" } },
      { value: "creative", label: { sv: "Kreativitet / hobby", en: "Creativity / hobby", es: "Creatividad", de: "Kreativität", fr: "Créativité" } },
      { value: "none", label: { sv: "Inget särskilt", en: "Nothing in particular", es: "Nada", de: "Nichts", fr: "Rien" } },
    ],
  },
  {
    id: "social", category: "stress", type: "select",
    prompt: { sv: "Hur upplever du dina sociala relationer?", en: "How do you experience your social relationships?", es: "¿Cómo son tus relaciones sociales?", de: "Wie erlebst du deine Beziehungen?", fr: "Comment vivez-vous vos relations ?" },
    options: [
      { value: "supportive", label: { sv: "Stöttande", en: "Supportive", es: "Apoyo", de: "Unterstützend", fr: "Soutenantes" } },
      { value: "neutral", label: { sv: "Neutralt", en: "Neutral", es: "Neutral", de: "Neutral", fr: "Neutres" } },
      { value: "draining", label: { sv: "Dränerande", en: "Draining", es: "Drenantes", de: "Belastend", fr: "Drainantes" } },
      { value: "isolated", label: { sv: "Ensam", en: "Isolated", es: "Aislada", de: "Isoliert", fr: "Isolé·e" } },
    ],
  },
  {
    id: "freeText", category: "stress", type: "longtext", maxLength: 500,
    prompt: { sv: "Något särskilt mentalt eller emotionellt vi bör veta? (frivilligt)", en: "Anything specific mentally/emotionally we should know? (optional)", es: "¿Algo emocional/mental relevante? (opcional)", de: "Etwas Mentales/Emotionales, das wichtig ist? (optional)", fr: "Quelque chose de mental/émotionnel à savoir ? (optionnel)" },
  },

  // -- 4. Kost & tarm (6 frågor) --
  {
    id: "diet", category: "nutrition", type: "select", required: true,
    prompt: { sv: "Hur skulle du beskriva din kost?", en: "How would you describe your diet?", es: "¿Cómo describirías tu dieta?", de: "Wie würdest du deine Ernährung beschreiben?", fr: "Comment décririez-vous votre alimentation ?" },
    options: [
      { value: "balanced", label: { sv: "Balanserad / varierad", en: "Balanced / varied", es: "Equilibrada", de: "Ausgewogen", fr: "Équilibrée" } },
      { value: "vegetarian", label: { sv: "Vegetarisk", en: "Vegetarian", es: "Vegetariana", de: "Vegetarisch", fr: "Végétarienne" } },
      { value: "vegan", label: { sv: "Vegan", en: "Vegan", es: "Vegana", de: "Vegan", fr: "Végane" } },
      { value: "lchf", label: { sv: "LCHF / låg-kolhydrater", en: "LCHF / low-carb", es: "Baja en carbos", de: "Low-Carb", fr: "Faible en glucides" } },
      { value: "paleo", label: { sv: "Paleo", en: "Paleo", es: "Paleo", de: "Paleo", fr: "Paléo" } },
      { value: "processed", label: { sv: "Mest bearbetad mat", en: "Mostly processed", es: "Procesada", de: "Verarbeitet", fr: "Industrielle" } },
      { value: "carnivore", label: { sv: "Animaliskt baserad", en: "Animal-based", es: "Animal", de: "Tierisch", fr: "Animale" } },
    ],
  },
  {
    id: "typicalDay", category: "nutrition", type: "longtext", maxLength: 600,
    prompt: { sv: "Beskriv en typisk dag av mat (frukost, lunch, middag, snacks, drycker)", en: "Describe a typical day of food (breakfast, lunch, dinner, snacks, drinks)", es: "Describe un día típico de comida.", de: "Beschreibe einen typischen Esstag.", fr: "Décrivez une journée alimentaire typique." },
  },
  {
    id: "dairy", category: "nutrition", type: "select",
    prompt: { sv: "Hur ofta äter du mejeri?", en: "How often do you eat dairy?", es: "¿Con qué frecuencia consumes lácteos?", de: "Wie oft konsumierst du Milchprodukte?", fr: "À quelle fréquence consommez-vous des produits laitiers ?" },
    options: frequencies,
  },
  {
    id: "sugar", category: "nutrition", type: "select",
    prompt: { sv: "Hur mycket socker / söta drycker?", en: "How much sugar / sweet drinks?", es: "¿Cuánta azúcar / bebidas dulces?", de: "Wie viel Zucker / Süßgetränke?", fr: "Combien de sucre / boissons sucrées ?" },
    options: frequencies,
  },
  {
    id: "alcoholCaffeine", category: "nutrition", type: "longtext", maxLength: 200,
    prompt: { sv: "Alkohol och koffein: hur mycket per vecka?", en: "Alcohol and caffeine: how much per week?", es: "Alcohol y cafeína por semana", de: "Alkohol und Koffein pro Woche", fr: "Alcool et caféine par semaine" },
  },
  {
    id: "gut", category: "nutrition", type: "multiselect",
    prompt: { sv: "Mag-/tarm-symtom (välj alla som gäller)", en: "Gut / digestive symptoms (select all)", es: "Síntomas digestivos", de: "Magen-/Darm-Symptome", fr: "Symptômes digestifs" },
    options: [
      { value: "none", label: { sv: "Inga", en: "None", es: "Ninguno", de: "Keine", fr: "Aucun" } },
      { value: "bloating", label: { sv: "Uppblåsthet", en: "Bloating", es: "Hinchazón", de: "Blähungen", fr: "Ballonnements" } },
      { value: "gas", label: { sv: "Gasbildning", en: "Gas", es: "Gases", de: "Blähungen", fr: "Gaz" } },
      { value: "constipation", label: { sv: "Förstoppning", en: "Constipation", es: "Estreñimiento", de: "Verstopfung", fr: "Constipation" } },
      { value: "diarrhea", label: { sv: "Diarré", en: "Diarrhoea", es: "Diarrea", de: "Durchfall", fr: "Diarrhée" } },
      { value: "reflux", label: { sv: "Halsbränna / reflux", en: "Heartburn / reflux", es: "Reflujo", de: "Sodbrennen", fr: "Reflux" } },
      { value: "ibs", label: { sv: "IBS / känslig mage", en: "IBS / sensitive stomach", es: "SII", de: "Reizdarm", fr: "SII" } },
    ],
  },

  // -- 5. Rörelse & sol (3 frågor) --
  {
    id: "type", category: "movement", type: "multiselect",
    prompt: { sv: "Vilken typ av rörelse?", en: "What kind of movement?", es: "¿Qué tipo de actividad?", de: "Welche Bewegung?", fr: "Quel type de mouvement ?" },
    options: [
      { value: "walking", label: { sv: "Promenader", en: "Walking", es: "Caminar", de: "Spaziergänge", fr: "Marche" } },
      { value: "running", label: { sv: "Löpning", en: "Running", es: "Correr", de: "Laufen", fr: "Course" } },
      { value: "strength", label: { sv: "Styrketräning", en: "Strength training", es: "Pesas", de: "Krafttraining", fr: "Musculation" } },
      { value: "yoga", label: { sv: "Yoga / pilates", en: "Yoga / pilates", es: "Yoga", de: "Yoga", fr: "Yoga" } },
      { value: "cycling", label: { sv: "Cykling", en: "Cycling", es: "Bicicleta", de: "Radfahren", fr: "Vélo" } },
      { value: "team", label: { sv: "Lagsport", en: "Team sports", es: "Deportes de equipo", de: "Mannschaftssport", fr: "Sport collectif" } },
      { value: "none", label: { sv: "Sällan / aldrig", en: "Rarely / never", es: "Casi nunca", de: "Selten / nie", fr: "Rarement / jamais" } },
    ],
  },
  {
    id: "frequency", category: "movement", type: "select", required: true,
    prompt: { sv: "Hur ofta tränar du?", en: "How often do you exercise?", es: "¿Con qué frecuencia entrenas?", de: "Wie oft trainierst du?", fr: "Avec quelle fréquence ?" },
    options: [
      { value: "0", label: { sv: "Aldrig / sällan", en: "Never / rarely", es: "Nunca", de: "Nie", fr: "Jamais" } },
      { value: "1-2", label: { sv: "1–2 ggr/v", en: "1–2 times/week", es: "1–2/semana", de: "1–2/Woche", fr: "1–2/sem" } },
      { value: "3-5", label: { sv: "3–5 ggr/v", en: "3–5 times/week", es: "3–5/semana", de: "3–5/Woche", fr: "3–5/sem" } },
      { value: "daily", label: { sv: "Dagligen", en: "Daily", es: "Diariamente", de: "Täglich", fr: "Quotidien" } },
    ],
  },
  {
    id: "sun", category: "movement", type: "select", required: true,
    prompt: { sv: "Hur mycket sol får du?", en: "How much sun do you get?", es: "¿Cuánto sol recibes?", de: "Wie viel Sonne bekommst du?", fr: "Combien de soleil ?" },
    options: [
      { value: "very_low", label: { sv: "Knappt alls", en: "Hardly any", es: "Muy poco", de: "Kaum", fr: "Très peu" } },
      { value: "moderate", label: { sv: "Måttligt", en: "Moderate", es: "Moderado", de: "Mäßig", fr: "Modéré" } },
      { value: "high", label: { sv: "Mycket", en: "A lot", es: "Mucho", de: "Viel", fr: "Beaucoup" } },
      { value: "extreme", label: { sv: "Extremt mycket", en: "Extreme", es: "Extremo", de: "Extrem", fr: "Extrême" } },
    ],
  },

  // -- 6. Hudvård idag (5 frågor) --
  {
    id: "products", category: "routine", type: "longtext", maxLength: 500,
    prompt: { sv: "Vilka produkter använder du idag (morgon + kväll)?", en: "What products do you use today (morning + evening)?", es: "¿Qué productos usas (mañana + noche)?", de: "Welche Produkte (morgens + abends)?", fr: "Quels produits (matin + soir) ?" },
  },
  {
    id: "ingredientsAvoid", category: "routine", type: "text", maxLength: 200,
    prompt: { sv: "Ingredienser du undviker / reagerar på", en: "Ingredients you avoid / react to", es: "Ingredientes que evitas", de: "Inhaltsstoffe, die du meidest", fr: "Ingrédients que vous évitez" },
  },
  {
    id: "frequency", category: "routine", type: "select",
    prompt: { sv: "Hur ofta byter du produkter?", en: "How often do you switch products?", es: "¿Cambias productos a menudo?", de: "Wie oft wechselst du Produkte?", fr: "À quelle fréquence changez-vous de produits ?" },
    options: [
      { value: "loyal", label: { sv: "Sällan / lojal", en: "Rarely / loyal", es: "Raramente", de: "Selten", fr: "Rarement" } },
      { value: "seasonal", label: { sv: "Sässongsvis", en: "Seasonally", es: "Por temporada", de: "Saisonal", fr: "Selon les saisons" } },
      { value: "monthly", label: { sv: "Varje månad", en: "Every month", es: "Cada mes", de: "Monatlich", fr: "Chaque mois" } },
      { value: "constantly", label: { sv: "Hela tiden", en: "Constantly", es: "Constantemente", de: "Ständig", fr: "Constamment" } },
    ],
  },
  {
    id: "problemsCurrent", category: "routine", type: "longtext", maxLength: 400,
    prompt: { sv: "Vilka hudproblem upplever du just nu?", en: "What skin issues are you facing right now?", es: "¿Qué problemas tienes ahora?", de: "Welche Hautprobleme aktuell?", fr: "Quels problèmes actuellement ?" },
  },
  {
    id: "pastApproaches", category: "routine", type: "longtext", maxLength: 400,
    prompt: { sv: "Vad har du provat tidigare som inte fungerat?", en: "What have you tried before that didn't work?", es: "¿Qué probaste antes sin éxito?", de: "Was hast du früher ohne Erfolg probiert?", fr: "Qu'avez-vous essayé sans succès ?" },
  },

  // -- 7. Hormonella (4 frågor, villkorade) --
  {
    id: "applies", category: "hormones", type: "select", required: true,
    prompt: { sv: "Är hormonella aspekter relevanta för dig?", en: "Are hormonal aspects relevant for you?", es: "¿Son relevantes los aspectos hormonales?", de: "Sind hormonelle Aspekte relevant?", fr: "Les aspects hormonaux sont-ils pertinents ?" },
    options: yesNo,
  },
  {
    id: "menstrualCycle", category: "hormones", type: "select",
    showIf: (a) => a.hormones?.applies === "yes",
    prompt: { sv: "Hur är din menscykel?", en: "How is your menstrual cycle?", es: "¿Cómo es tu ciclo menstrual?", de: "Wie ist dein Zyklus?", fr: "Comment est votre cycle ?" },
    options: [
      { value: "regular", label: { sv: "Regelbunden", en: "Regular", es: "Regular", de: "Regelmäßig", fr: "Régulier" } },
      { value: "irregular", label: { sv: "Oregelbunden", en: "Irregular", es: "Irregular", de: "Unregelmäßig", fr: "Irrégulier" } },
      { value: "absent", label: { sv: "Frånvarande", en: "Absent", es: "Ausente", de: "Ausbleibend", fr: "Absent" } },
      { value: "menopause", label: { sv: "Klimakterium / efter", en: "Menopause / post", es: "Menopausia", de: "Menopause", fr: "Ménopause" } },
      { value: "na", label: { sv: "Ej tillämpbart", en: "N/A", es: "N/A", de: "N/A", fr: "N/A" } },
    ],
  },
  {
    id: "contraception", category: "hormones", type: "select",
    showIf: (a) => a.hormones?.applies === "yes",
    prompt: { sv: "Hormonell preventivmetod?", en: "Hormonal contraception?", es: "¿Anticoncepción hormonal?", de: "Hormonelle Verhütung?", fr: "Contraception hormonale ?" },
    options: [
      { value: "none", label: { sv: "Nej", en: "No", es: "No", de: "Nein", fr: "Non" } },
      { value: "pill", label: { sv: "P-piller", en: "Pill", es: "Píldora", de: "Pille", fr: "Pilule" } },
      { value: "iud", label: { sv: "Hormonspiral", en: "Hormonal IUD", es: "DIU hormonal", de: "Hormonspirale", fr: "DIU hormonal" } },
      { value: "implant", label: { sv: "Implantat / stav", en: "Implant", es: "Implante", de: "Implantat", fr: "Implant" } },
      { value: "patch", label: { sv: "Plåster / ring", en: "Patch / ring", es: "Parche / anillo", de: "Pflaster", fr: "Patch / anneau" } },
    ],
  },
  {
    id: "pregnancyBreastfeeding", category: "hormones", type: "select",
    showIf: (a) => a.hormones?.applies === "yes",
    prompt: { sv: "Gravid eller ammar?", en: "Pregnant or breastfeeding?", es: "¿Embarazo o lactancia?", de: "Schwanger oder stillend?", fr: "Enceinte ou allaitante ?" },
    options: [
      { value: "no", label: { sv: "Nej", en: "No", es: "No", de: "Nein", fr: "Non" } },
      { value: "pregnant", label: { sv: "Gravid", en: "Pregnant", es: "Embarazada", de: "Schwanger", fr: "Enceinte" } },
      { value: "breastfeeding", label: { sv: "Ammar", en: "Breastfeeding", es: "Lactancia", de: "Stillend", fr: "Allaitement" } },
      { value: "trying", label: { sv: "Försöker bli gravid", en: "Trying to conceive", es: "Buscando embarazo", de: "Kinderwunsch", fr: "Essai de conception" } },
    ],
  },

  // -- 8. Mål & förväntningar (5 frågor) --
  {
    id: "primary", category: "goals", type: "select", required: true,
    prompt: { sv: "Vad är ditt främsta hudmål?", en: "What is your primary skin goal?", es: "¿Cuál es tu objetivo principal?", de: "Was ist dein Hauptziel?", fr: "Quel est votre objectif principal ?" },
    options: [
      { value: "clarity", label: { sv: "Klarare hud, färre utbrott", en: "Clearer skin, fewer breakouts", es: "Piel clara", de: "Klarere Haut", fr: "Peau plus claire" } },
      { value: "calm", label: { sv: "Lugnare hud, mindre rodnad", en: "Calmer skin, less redness", es: "Piel más calmada", de: "Beruhigte Haut", fr: "Peau apaisée" } },
      { value: "glow", label: { sv: "Mer lyster och utstrålning", en: "More glow and radiance", es: "Más luminosidad", de: "Mehr Strahlkraft", fr: "Plus d'éclat" } },
      { value: "antiAge", label: { sv: "Förebygga åldrande", en: "Prevent ageing", es: "Anti-edad", de: "Anti-Aging", fr: "Anti-âge" } },
      { value: "hydration", label: { sv: "Djup återfuktning", en: "Deep hydration", es: "Hidratación", de: "Tiefe Feuchtigkeit", fr: "Hydratation profonde" } },
      { value: "barrier", label: { sv: "Återställa hudbarriären", en: "Restore the barrier", es: "Restaurar barrera", de: "Barriere stärken", fr: "Restaurer la barrière" } },
    ],
  },
  {
    id: "secondary", category: "goals", type: "multiselect",
    prompt: { sv: "Sekundära mål? (välj upp till 3)", en: "Secondary goals? (select up to 3)", es: "Objetivos secundarios", de: "Sekundärziele", fr: "Objectifs secondaires" },
    options: [
      { value: "simplify", label: { sv: "Enklare rutin", en: "Simpler routine", es: "Rutina simple", de: "Einfache Routine", fr: "Routine simple" } },
      { value: "naturalIngredients", label: { sv: "Mer naturligt", en: "More natural", es: "Más natural", de: "Mehr Natur", fr: "Plus naturel" } },
      { value: "saveMoney", label: { sv: "Spara pengar", en: "Save money", es: "Ahorrar", de: "Geld sparen", fr: "Économiser" } },
      { value: "environment", label: { sv: "Mer hållbart", en: "More sustainable", es: "Sostenible", de: "Nachhaltiger", fr: "Plus durable" } },
      { value: "confidence", label: { sv: "Bättre självförtroende", en: "More confidence", es: "Más confianza", de: "Selbstvertrauen", fr: "Confiance" } },
    ],
  },
  {
    id: "deadline", category: "goals", type: "select",
    prompt: { sv: "Finns det en deadline (t.ex. event)?", en: "Any deadline (e.g. an event)?", es: "¿Plazo concreto?", de: "Eine Deadline (z. B. Event)?", fr: "Une échéance (ex. événement) ?" },
    options: [
      { value: "no", label: { sv: "Nej, ingen specifik", en: "No specific one", es: "No", de: "Keine", fr: "Aucune" } },
      { value: "1m", label: { sv: "Inom 1 månad", en: "Within 1 month", es: "1 mes", de: "Innerhalb 1 Monat", fr: "Dans 1 mois" } },
      { value: "3m", label: { sv: "Inom 3 månader", en: "Within 3 months", es: "3 meses", de: "3 Monate", fr: "Dans 3 mois" } },
      { value: "6m", label: { sv: "Inom 6 månader", en: "Within 6 months", es: "6 meses", de: "6 Monate", fr: "Dans 6 mois" } },
      { value: "long", label: { sv: "Långsiktigt", en: "Long term", es: "Largo plazo", de: "Langfristig", fr: "Long terme" } },
    ],
  },
  {
    id: "budget", category: "goals", type: "select",
    prompt: { sv: "Hudvårdsbudget per månad?", en: "Monthly skincare budget?", es: "¿Presupuesto mensual?", de: "Monatsbudget?", fr: "Budget mensuel ?" },
    options: [
      { value: "low", label: { sv: "Under 200 kr", en: "Under 200 SEK", es: "<200 SEK", de: "<200 SEK", fr: "<200 SEK" } },
      { value: "mid", label: { sv: "200–500 kr", en: "200–500 SEK", es: "200–500", de: "200–500", fr: "200–500" } },
      { value: "high", label: { sv: "500–1000 kr", en: "500–1000 SEK", es: "500–1000", de: "500–1000", fr: "500–1000" } },
      { value: "premium", label: { sv: "Över 1000 kr", en: "Over 1000 SEK", es: ">1000", de: ">1000", fr: ">1000" } },
    ],
  },
  {
    id: "freeText", category: "goals", type: "longtext", maxLength: 500,
    prompt: { sv: "Något mer du vill att vår expert ska veta? (frivilligt)", en: "Anything else you want our expert to know? (optional)", es: "¿Algo más?", de: "Sonst noch etwas?", fr: "Autre chose ?" },
  },
];

export const TOTAL_PREMIUM_QUESTIONS = PREMIUM_QUESTIONS.length;

export function visiblePremiumQuestions(answers: Record<string, Record<string, unknown>>): PremiumQuestion[] {
  return PREMIUM_QUESTIONS.filter((q) => !q.showIf || q.showIf(answers));
}
