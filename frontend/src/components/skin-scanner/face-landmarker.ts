/**
 * MediaPipe Face Landmarker integration.
 *
 * Uses 478 face landmarks for precise zone detection and cropping.
 * All processing runs client-side in the browser.
 */

import {
  FaceLandmarker,
  FilesetResolver,
  type FaceLandmarkerResult,
  type NormalizedLandmark,
} from "@mediapipe/tasks-vision";

let landmarkerInstance: FaceLandmarker | null = null;
let loadingPromise: Promise<FaceLandmarker> | null = null;

export async function loadFaceLandmarker(): Promise<FaceLandmarker> {
  if (landmarkerInstance) return landmarkerInstance;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );
    const landmarker = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
        delegate: "GPU",
      },
      runningMode: "IMAGE",
      numFaces: 1,
      outputFaceBlendshapes: false,
      outputFacialTransformationMatrixes: false,
    });
    landmarkerInstance = landmarker;
    return landmarker;
  })();

  return loadingPromise;
}

export interface FaceZoneCrop {
  id: string;
  labelSv: string;
  labelEn: string;
  labelEs: string;
  labelDe: string;
  labelFr: string;
  x: number;
  y: number;
  w: number;
  h: number;
  centerX: number;
  centerY: number;
  dataUrl?: string;
}

const LANDMARK_ZONES: {
  id: string;
  labelSv: string;
  labelEn: string;
  labelEs: string;
  labelDe: string;
  labelFr: string;
  landmarks: number[];
  padding: number;
}[] = [
  {
    id: "forehead", labelSv: "Panna", labelEn: "Forehead", labelEs: "Frente", labelDe: "Stirn", labelFr: "Front",
    landmarks: [10, 67, 109, 108, 69, 104, 68, 71, 21, 54, 103, 338, 337, 297, 299, 333, 298, 301, 251, 284],
    padding: 0.15,
  },
  {
    id: "left_eye_area", labelSv: "Vänster ögonområde", labelEn: "Left eye area", labelEs: "Zona ojo izquierdo", labelDe: "Linker Augenbereich", labelFr: "Zone œil gauche",
    landmarks: [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246],
    padding: 0.35,
  },
  {
    id: "right_eye_area", labelSv: "Höger ögonområde", labelEn: "Right eye area", labelEs: "Zona ojo derecho", labelDe: "Rechter Augenbereich", labelFr: "Zone œil droit",
    landmarks: [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398],
    padding: 0.35,
  },
  {
    id: "nose", labelSv: "Näsa", labelEn: "Nose", labelEs: "Nariz", labelDe: "Nase", labelFr: "Nez",
    landmarks: [1, 2, 98, 327, 168, 6, 197, 195, 5, 4, 45, 275, 440, 220],
    padding: 0.1,
  },
  {
    id: "left_cheek", labelSv: "Vänster kind", labelEn: "Left cheek", labelEs: "Mejilla izquierda", labelDe: "Linke Wange", labelFr: "Joue gauche",
    landmarks: [36, 50, 101, 116, 117, 118, 119, 120, 205, 206, 207, 187, 123, 147, 213],
    padding: 0.1,
  },
  {
    id: "right_cheek", labelSv: "Höger kind", labelEn: "Right cheek", labelEs: "Mejilla derecha", labelDe: "Rechte Wange", labelFr: "Joue droite",
    landmarks: [266, 280, 330, 345, 346, 347, 348, 349, 425, 426, 427, 411, 352, 376, 433],
    padding: 0.1,
  },
  {
    id: "chin", labelSv: "Haka", labelEn: "Chin", labelEs: "Mentón", labelDe: "Kinn", labelFr: "Menton",
    landmarks: [152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 377, 400, 378, 379, 365, 397, 288, 361, 323, 454, 356, 391],
    padding: 0.1,
  },
  {
    id: "t_zone", labelSv: "T-zon", labelEn: "T-zone", labelEs: "Zona T", labelDe: "T-Zone", labelFr: "Zone T",
    landmarks: [10, 151, 9, 8, 168, 6, 197, 195, 5, 4, 1, 2, 98, 327],
    padding: 0.15,
  },
  {
    id: "left_nasolabial", labelSv: "Vänster nasolabialveck", labelEn: "Left nasolabial fold", labelEs: "Pliegue nasolabial izquierdo", labelDe: "Linke Nasolabialfalte", labelFr: "Pli nasolabial gauche",
    landmarks: [205, 50, 117, 118, 101, 36, 206, 48, 64, 98],
    padding: 0.2,
  },
  {
    id: "right_nasolabial", labelSv: "Höger nasolabialveck", labelEn: "Right nasolabial fold", labelEs: "Pliegue nasolabial derecho", labelDe: "Rechte Nasolabialfalte", labelFr: "Pli nasolabial droit",
    landmarks: [425, 280, 346, 347, 330, 266, 426, 278, 294, 327],
    padding: 0.2,
  },
  {
    id: "mouth_area", labelSv: "Munområde", labelEn: "Mouth area", labelEs: "Zona de la boca", labelDe: "Mundbereich", labelFr: "Zone buccale",
    landmarks: [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 375, 321, 405, 314, 17, 84, 181, 91, 146],
    padding: 0.15,
  },
  {
    id: "jawline", labelSv: "Käklinje", labelEn: "Jawline", labelEs: "Línea de la mandíbula", labelDe: "Kieferlinie", labelFr: "Ligne de la mâchoire",
    landmarks: [234, 127, 162, 21, 54, 103, 67, 109, 10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288],
    padding: 0.1,
  },
];

function landmarkBounds(
  landmarks: NormalizedLandmark[],
  indices: number[],
  padding: number,
  imgW: number,
  imgH: number
): { x: number; y: number; w: number; h: number; cx: number; cy: number } {
  let minX = 1, maxX = 0, minY = 1, maxY = 0;

  for (const idx of indices) {
    const lm = landmarks[idx];
    if (!lm) continue;
    if (lm.x < minX) minX = lm.x;
    if (lm.x > maxX) maxX = lm.x;
    if (lm.y < minY) minY = lm.y;
    if (lm.y > maxY) maxY = lm.y;
  }

  const w = maxX - minX;
  const h = maxY - minY;
  const padX = w * padding;
  const padY = h * padding;

  const x = Math.max(0, Math.round((minX - padX) * imgW));
  const y = Math.max(0, Math.round((minY - padY) * imgH));
  const x2 = Math.min(imgW, Math.round((maxX + padX) * imgW));
  const y2 = Math.min(imgH, Math.round((maxY + padY) * imgH));

  return {
    x,
    y,
    w: x2 - x,
    h: y2 - y,
    cx: (minX + maxX) / 2,
    cy: (minY + maxY) / 2,
  };
}

export function detectFaceZones(
  result: FaceLandmarkerResult,
  imgW: number,
  imgH: number
): FaceZoneCrop[] {
  const face = result.faceLandmarks?.[0];
  if (!face || face.length < 468) return [];

  return LANDMARK_ZONES.map((zone) => {
    const bounds = landmarkBounds(face, zone.landmarks, zone.padding, imgW, imgH);
    return {
      id: zone.id,
      labelSv: zone.labelSv,
      labelEn: zone.labelEn,
      labelEs: zone.labelEs,
      labelDe: zone.labelDe,
      labelFr: zone.labelFr,
      x: bounds.x,
      y: bounds.y,
      w: bounds.w,
      h: bounds.h,
      centerX: bounds.cx,
      centerY: bounds.cy,
    };
  });
}

export function cropZoneImages(
  canvas: HTMLCanvasElement,
  zones: FaceZoneCrop[],
  maxSize = 512
): FaceZoneCrop[] {
  const tmpCanvas = document.createElement("canvas");
  const tmpCtx = tmpCanvas.getContext("2d")!;

  return zones.map((zone) => {
    const scale = Math.min(1, maxSize / Math.max(zone.w, zone.h));
    tmpCanvas.width = Math.round(zone.w * scale);
    tmpCanvas.height = Math.round(zone.h * scale);

    tmpCtx.drawImage(
      canvas,
      zone.x, zone.y, zone.w, zone.h,
      0, 0, tmpCanvas.width, tmpCanvas.height
    );

    return {
      ...zone,
      dataUrl: tmpCanvas.toDataURL("image/jpeg", 0.85),
    };
  });
}

export const ZONE_IDS_FOR_GPT = [
  "forehead",
  "left_cheek",
  "right_cheek",
  "nose",
  "chin",
  "left_eye_area",
] as const;
