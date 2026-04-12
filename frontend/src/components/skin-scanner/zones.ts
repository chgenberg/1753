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
  /** Zone crop as [x, y, w, h] relative to the face oval (0-1) */
  rect: [number, number, number, number];
  /** Where to draw the annotation label: "left" or "right" */
  anchor: "left" | "right";
  /** Vertical offset for the label line (0-1, relative to image height) */
  labelY: number;
}

export const FACE_ZONES: FaceZone[] = [
  {
    id: "forehead",
    labelSv: "Panna",
    labelEn: "Forehead",
    rect: [0.2, 0.02, 0.6, 0.25],
    anchor: "right",
    labelY: 0.12,
  },
  {
    id: "t_zone",
    labelSv: "T-zon",
    labelEn: "T-zone",
    rect: [0.32, 0.02, 0.36, 0.65],
    anchor: "left",
    labelY: 0.18,
  },
  {
    id: "left_cheek",
    labelSv: "Vänster kind",
    labelEn: "Left cheek",
    rect: [0.02, 0.35, 0.32, 0.30],
    anchor: "left",
    labelY: 0.45,
  },
  {
    id: "nose",
    labelSv: "Näsa",
    labelEn: "Nose",
    rect: [0.32, 0.32, 0.36, 0.25],
    anchor: "right",
    labelY: 0.38,
  },
  {
    id: "right_cheek",
    labelSv: "Höger kind",
    labelEn: "Right cheek",
    rect: [0.66, 0.35, 0.32, 0.30],
    anchor: "right",
    labelY: 0.55,
  },
  {
    id: "chin",
    labelSv: "Haka",
    labelEn: "Chin",
    rect: [0.25, 0.68, 0.50, 0.28],
    anchor: "left",
    labelY: 0.80,
  },
];

export const CONDITION_LABELS_SV: Record<string, string> = {
  acne: "Akne",
  dermatitis: "Dermatit",
  dryness: "Torr hy",
  eczema: "Eksem",
  enlarged_pores: "Forstorda porer",
  fungal: "Svampinfektion",
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
  fungal: "Fungal infection",
  hyperpigmentation: "Hyperpigmentation",
  normal: "Healthy skin",
  psoriasis: "Psoriasis",
  rosacea: "Rosacea",
  sun_damage: "Sun damage",
  wrinkles: "Wrinkles",
};

export const CONDITION_COLORS: Record<string, string> = {
  acne: "#e55050",
  dermatitis: "#e08040",
  dryness: "#a0900a",
  eczema: "#c06060",
  enlarged_pores: "#7090b0",
  fungal: "#8060c0",
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
}
