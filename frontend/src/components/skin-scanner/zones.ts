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
    rect: [0.15, 0.0, 0.7, 0.28],
    anchor: "right",
    labelY: 0.1,
  },
  {
    id: "t_zone",
    labelSv: "T-zon",
    labelEn: "T-zone",
    rect: [0.3, 0.0, 0.4, 0.7],
    anchor: "left",
    labelY: 0.15,
  },
  {
    id: "left_cheek",
    labelSv: "Vänster kind",
    labelEn: "Left cheek",
    rect: [0.0, 0.35, 0.35, 0.35],
    anchor: "left",
    labelY: 0.42,
  },
  {
    id: "nose",
    labelSv: "Näsa",
    labelEn: "Nose",
    rect: [0.3, 0.3, 0.4, 0.3],
    anchor: "right",
    labelY: 0.35,
  },
  {
    id: "right_cheek",
    labelSv: "Höger kind",
    labelEn: "Right cheek",
    rect: [0.65, 0.35, 0.35, 0.35],
    anchor: "right",
    labelY: 0.55,
  },
  {
    id: "chin",
    labelSv: "Haka",
    labelEn: "Chin",
    rect: [0.2, 0.72, 0.6, 0.28],
    anchor: "left",
    labelY: 0.82,
  },
];

export const CONDITION_LABELS_SV: Record<string, string> = {
  acne: "Akne",
  dermatitis: "Dermatit",
  dryness: "Torr hy",
  eczema: "Eksem",
  fungal: "Svampinfektion",
  hyperpigmentation: "Hyperpigmentering",
  psoriasis: "Psoriasis",
  rosacea: "Rosacea",
  sun_damage: "Solskada",
};

export const CONDITION_COLORS: Record<string, string> = {
  acne: "#e55050",
  dermatitis: "#e08040",
  dryness: "#a0900a",
  eczema: "#c06060",
  fungal: "#8060c0",
  hyperpigmentation: "#705030",
  psoriasis: "#b04090",
  rosacea: "#d05070",
  sun_damage: "#c08020",
};

export interface ZoneResult {
  zone: FaceZone;
  topCondition: string;
  confidence: number;
  allPredictions: { label: string; probability: number }[];
}
