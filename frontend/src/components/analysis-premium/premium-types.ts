/**
 * Shared TypeScript-typer för premium-hudanalysen.
 * Importeras av result-komponenten och PDF-exporten så vi har en enda
 * sanningskälla för schemat. Inget i gratis-flödet rör dessa typer.
 */

export interface MetricScore {
  score?: number;
  grade?: number;
  detail?: string;
}

export interface SkinDnaInsight {
  title?: string;
  insight?: string;
  evidenceFromAnswers?: string[];
}

export interface SkinArchetype {
  name?: string;
  tagline?: string;
  description?: string;
}

export interface CircadianRitual {
  ritual?: string;
  why?: string;
}

export interface CircadianRhythm {
  morning?: CircadianRitual;
  midday?: CircadianRitual;
  evening?: CircadianRitual;
}

export interface FoodToAdd {
  food?: string;
  why?: string;
  frequency?: string;
}

export interface FoodToLimit {
  food?: string;
  why?: string;
  alternative?: string;
}

export interface NutritionPlan {
  headline?: string;
  foodsToAdd?: FoodToAdd[];
  foodsToLimit?: FoodToLimit[];
  sampleDay?: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
    snacks?: string;
  };
  hydrationGoal?: string;
}

export interface SupplementSuggestion {
  name?: string;
  dose?: string;
  why?: string;
  evidenceLevel?: "stark" | "medel" | "svag" | "strong" | "medium" | "weak" | string;
}

export interface EnvironmentalFactor {
  impact?: string;
  advice?: string;
}

export interface EnvironmentalFactors {
  uv?: EnvironmentalFactor;
  blueLight?: EnvironmentalFactor;
  pollution?: EnvironmentalFactor;
  climate?: EnvironmentalFactor;
  waterHardness?: EnvironmentalFactor;
}

export interface MicroHabit {
  habit?: string;
  stackWith?: string;
  duration?: string;
}

export interface WeekPlan {
  focus?: string;
  actions?: string[];
  milestone?: string;
}

export interface Protocol4Weeks {
  vision?: string;
  week1?: WeekPlan;
  week2?: WeekPlan;
  week3?: WeekPlan;
  week4?: WeekPlan;
}

export interface ExpectedTrajectory {
  week1?: string;
  week2?: string;
  week3?: string;
  week4?: string;
}

export interface LifestyleArea {
  headline?: string;
  actions?: string[];
  why?: string;
  expectedImpact?: string;
}

export type LifestyleProgram = Record<string, LifestyleArea>;

export interface ProductProtocolStep {
  step?: string;
  product?: string;
  why?: string;
  frequency?: string;
}

export interface ProductProtocol {
  morning?: ProductProtocolStep[];
  evening?: ProductProtocolStep[];
  weekly?: ProductProtocolStep[];
}

export interface ProductRec {
  id: string;
  reason: string;
  usage?: string;
}

export interface IngredientWarning {
  ingredient?: string;
  why?: string;
  alternativeApproach?: string;
}

export interface ProgressTracking {
  rephotoFrequency?: string;
  metricsToTrack?: string[];
  journalingPrompts?: string[];
}

export interface FollowUp {
  recommendedRescanWeeks?: number;
  escalationCriteria?: string[];
}

export interface PrimaryCondition {
  condition?: string;
  confidence?: string;
  reasoning?: string;
}

export interface FaceZone {
  zone?: string;
  label?: string;
  x?: number;
  y?: number;
  condition?: string;
  confidence?: string;
  description?: string;
}

export interface DeepDive {
  rootCauses?: { title?: string; explanation?: string; evidence?: string[] }[];
  systemicConnections?: { system?: string; explanation?: string }[];
  skinHistoryPattern?: string;
}

export interface LifestyleScoreEntry {
  /** 0–100. Lägre värde = större förbättringspotential. */
  score?: number;
  /** Kort förklaring (≤120 tecken) av varför poängen blev som den blev. */
  detail?: string;
  /** En–tre konkreta hävstångar för att höja just detta område. */
  topLevers?: string[];
}

export interface LifestyleScores {
  sleep?: LifestyleScoreEntry;
  stress?: LifestyleScoreEntry;
  nutrition?: LifestyleScoreEntry;
  gut?: LifestyleScoreEntry;
  movement?: LifestyleScoreEntry;
  /**
   * Vilket område som är "svagaste länken". Om AI:n inte returnerar
   * fältet räknar UI/PDF ut det själva via lägsta score.
   */
  weakestLink?: "sleep" | "stress" | "nutrition" | "gut" | "movement";
  /**
   * Kort sammanfattning (1-2 meningar) som binder ihop varför detta är
   * den svaga länken och vad det skulle ge att förbättra den först.
   */
  weakestLinkInsight?: string;
}

export interface PremiumAnalysisResult {
  version?: string;
  scoreOverall?: number;
  scoreLabel?: string;
  skinAge?: number;
  fitzpatrick?: string;
  skinArchetype?: SkinArchetype;
  summary?: string;
  skinDnaInsights?: SkinDnaInsight[];
  lifestyleScores?: LifestyleScores;
  metrics?: Record<string, MetricScore>;
  deepDive?: DeepDive;
  circadianRhythm?: CircadianRhythm;
  nutritionPlan?: NutritionPlan;
  supplementSuggestions?: SupplementSuggestion[];
  environmentalFactors?: EnvironmentalFactors;
  microHabits?: MicroHabit[];
  protocol4Weeks?: Protocol4Weeks;
  expectedTrajectory?: ExpectedTrajectory;
  lifestyleProgram?: LifestyleProgram;
  productProtocol?: ProductProtocol;
  products?: ProductRec[];
  ingredientWarnings?: IngredientWarning[];
  progressTracking?: ProgressTracking;
  redFlags?: string[];
  psychologicalNote?: string;
  positiveAffirmation?: string;
  followUp?: FollowUp;
  primaryCondition?: PrimaryCondition;
  faceZones?: FaceZone[];
}

export interface PremiumPdfStrings {
  title: string;
  resultTitle: string;
  resultScore: string;
  resultScoreOf: string;
  resultSummaryHead: string;
  resultMetricsHead: string;
  resultDeepDiveHead: string;
  rootCausesHead: string;
  systemicConnectionsHead: string;
  protocol4WeeksHead: string;
  weekLabel: string;
  weekFocus: string;
  weekActions: string;
  weekMilestone: string;
  lifestyleProgramHead: string;
  productProtocolHead: string;
  protocolMorning: string;
  protocolEvening: string;
  protocolWeekly: string;
  productsHead: string;
  redFlagsHead: string;
  psychologicalNoteHead: string;
  followUpHead: string;
  followUpRescan: string;
  followUpRescanWeeks: string;
  followUpEscalation: string;
  // Nya sektioner v2
  archetypeHead: string;
  skinDnaHead: string;
  circadianHead: string;
  circadianMorning: string;
  circadianMidday: string;
  circadianEvening: string;
  nutritionHead: string;
  foodsToAdd: string;
  foodsToLimit: string;
  sampleDay: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks: string;
  hydrationGoal: string;
  supplementsHead: string;
  doseLabel: string;
  evidenceLabel: string;
  environmentHead: string;
  envUv: string;
  envBlueLight: string;
  envPollution: string;
  envClimate: string;
  envWater: string;
  envImpact: string;
  envAdvice: string;
  microHabitsHead: string;
  microHabitStackWith: string;
  microHabitDuration: string;
  expectedTrajectoryHead: string;
  ingredientWarningsHead: string;
  ingredientAlternative: string;
  progressTrackingHead: string;
  progressRephoto: string;
  progressMetrics: string;
  progressJournaling: string;
  positiveAffirmationHead: string;
  tocHead: string;
  contactLine: string;
  reportPreparedFor: string;
  reportDate: string;
  pageOf: string;
  signatureLine: string;
  // Tabb-rubriker som UI använder
  generatedBy: string;
  fitzpatrickLabel: string;
  skinAgeLabel: string;
  archetypeLabel: string;
  // Lifestyle scores (sub-poäng per livsstilsområde)
  lifestyleScoresHead: string;
  lifestyleWeakestLink: string;
  lifestyleStartHere: string;
  lifestyleSleep: string;
  lifestyleStress: string;
  lifestyleNutrition: string;
  lifestyleGut: string;
  lifestyleMovement: string;
  lifestyleTopLevers: string;
  // Källförteckning
  sourcesHead: string;
  sourcesIntro: string;
  sourcesCatSleep: string;
  sourcesCatStress: string;
  sourcesCatGut: string;
  sourcesCatEcs: string;
  sourcesCatOmega: string;
  sourcesCatAntioxidants: string;
  sourcesCatMagnesium: string;
  sourcesCatProbiotics: string;
  sourcesCatEnvironment: string;
  sourcesCatBarrier: string;
  sourcesCatDiet: string;
  sourcesCatPsychology: string;
  sourcesDisclaimer: string;
}
