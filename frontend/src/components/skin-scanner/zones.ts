/**
 * Face zone definitions for skin analysis.
 *
 * Zones are defined as relative coordinates (0-1) within a face bounding box.
 * The user aligns their face to an oval guide, and we crop each zone for
 * independent classification.
 */

export interface FaceZone {
  id: string;
  labelSv: string;
  labelEn: string;
  labelEs: string;
  labelDe: string;
  labelFr: string;
  /** Zone crop as [x, y, w, h] relative to the face oval (0-1) */
  rect: [number, number, number, number];
  /** Where to draw the annotation label: "left" or "right" */
  anchor: "left" | "right";
  /** Vertical offset for the label line (0-1, relative to image height) */
  labelY: number;
}

export function zoneLabel(zone: FaceZone, locale: string): string {
  switch (locale) {
    case "sv": return zone.labelSv;
    case "es": return zone.labelEs;
    case "de": return zone.labelDe;
    case "fr": return zone.labelFr;
    default: return zone.labelEn;
  }
}

export const FACE_ZONES: FaceZone[] = [
  {
    id: "forehead",
    labelSv: "Panna", labelEn: "Forehead", labelEs: "Frente", labelDe: "Stirn", labelFr: "Front",
    rect: [0.2, 0.02, 0.6, 0.25], anchor: "right", labelY: 0.12,
  },
  {
    id: "t_zone",
    labelSv: "T-zon", labelEn: "T-zone", labelEs: "Zona T", labelDe: "T-Zone", labelFr: "Zone T",
    rect: [0.32, 0.02, 0.36, 0.65], anchor: "left", labelY: 0.18,
  },
  {
    id: "left_cheek",
    labelSv: "Vänster kind", labelEn: "Left cheek", labelEs: "Mejilla izquierda", labelDe: "Linke Wange", labelFr: "Joue gauche",
    rect: [0.02, 0.35, 0.32, 0.30], anchor: "left", labelY: 0.45,
  },
  {
    id: "nose",
    labelSv: "Näsa", labelEn: "Nose", labelEs: "Nariz", labelDe: "Nase", labelFr: "Nez",
    rect: [0.32, 0.32, 0.36, 0.25], anchor: "right", labelY: 0.38,
  },
  {
    id: "right_cheek",
    labelSv: "Höger kind", labelEn: "Right cheek", labelEs: "Mejilla derecha", labelDe: "Rechte Wange", labelFr: "Joue droite",
    rect: [0.66, 0.35, 0.32, 0.30], anchor: "right", labelY: 0.55,
  },
  {
    id: "chin",
    labelSv: "Haka", labelEn: "Chin", labelEs: "Mentón", labelDe: "Kinn", labelFr: "Menton",
    rect: [0.25, 0.68, 0.50, 0.28], anchor: "left", labelY: 0.80,
  },
];

export const CONDITION_LABELS_SV: Record<string, string> = {
  acne: "Akne",
  dermatitis: "Dermatit",
  dryness: "Torr hy",
  eczema: "Eksem",
  enlarged_pores: "Förstorade porer",
  hyperpigmentation: "Hyperpigmentering",
  normal: "Frisk hud",
  psoriasis: "Psoriasis",
  rosacea: "Rosacea",
  sun_damage: "Solskada",
  wrinkles: "Rynkor",
};

export const CONDITION_LABELS_EN: Record<string, string> = {
  acne: "Acne",
  dermatitis: "Dermatitis",
  dryness: "Dry skin",
  eczema: "Eczema",
  enlarged_pores: "Enlarged pores",
  hyperpigmentation: "Hyperpigmentation",
  normal: "Healthy skin",
  psoriasis: "Psoriasis",
  rosacea: "Rosacea",
  sun_damage: "Sun damage",
  wrinkles: "Wrinkles",
};

export const CONDITION_LABELS_ES: Record<string, string> = {
  acne: "Acné",
  dermatitis: "Dermatitis",
  dryness: "Piel seca",
  eczema: "Eccema",
  enlarged_pores: "Poros dilatados",
  hyperpigmentation: "Hiperpigmentación",
  normal: "Piel sana",
  psoriasis: "Psoriasis",
  rosacea: "Rosácea",
  sun_damage: "Daño solar",
  wrinkles: "Arrugas",
};

export const CONDITION_LABELS_DE: Record<string, string> = {
  acne: "Akne",
  dermatitis: "Dermatitis",
  dryness: "Trockene Haut",
  eczema: "Ekzem",
  enlarged_pores: "Vergrößerte Poren",
  hyperpigmentation: "Hyperpigmentierung",
  normal: "Gesunde Haut",
  psoriasis: "Psoriasis",
  rosacea: "Rosazea",
  sun_damage: "Sonnenschaden",
  wrinkles: "Falten",
};

export const CONDITION_LABELS_FR: Record<string, string> = {
  acne: "Acné",
  dermatitis: "Dermatite",
  dryness: "Peau sèche",
  eczema: "Eczéma",
  enlarged_pores: "Pores dilatés",
  hyperpigmentation: "Hyperpigmentation",
  normal: "Peau saine",
  psoriasis: "Psoriasis",
  rosacea: "Rosacée",
  sun_damage: "Dommages solaires",
  wrinkles: "Rides",
};

export function conditionLabel(key: string, locale: string): string {
  switch (locale) {
    case "sv": return CONDITION_LABELS_SV[key] || key;
    case "es": return CONDITION_LABELS_ES[key] || key;
    case "de": return CONDITION_LABELS_DE[key] || key;
    case "fr": return CONDITION_LABELS_FR[key] || key;
    default: return CONDITION_LABELS_EN[key] || key;
  }
}

export const CONDITION_COLORS: Record<string, string> = {
  acne: "#e55050",
  dermatitis: "#e08040",
  dryness: "#a0900a",
  eczema: "#c06060",
  enlarged_pores: "#7090b0",
  hyperpigmentation: "#705030",
  normal: "#108474",
  psoriasis: "#b04090",
  rosacea: "#d05070",
  sun_damage: "#c08020",
  wrinkles: "#908070",
};

export interface ZoneResult {
  zone: FaceZone;
  topCondition: string;
  confidence: number;
  allPredictions: { label: string; probability: number }[];
  severity?: { level: string; confidence: number };
}
