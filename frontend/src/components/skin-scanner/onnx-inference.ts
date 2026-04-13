/**
 * ONNX Runtime Web inference for the skin condition classifier.
 *
 * Multi-task model: condition classification + severity grading.
 * Runs entirely in the browser using WASM – no images are sent to any server.
 */

import type { InferenceSession, Tensor } from "onnxruntime-web";

const MODEL_URL = "/models/skin_classifier_q8.onnx";
const META_URL = "/models/model_meta.json";

interface ModelMeta {
  image_size: number;
  labels: string[];
  severity_labels?: string[];
  num_condition_classes?: number;
  num_severity_classes?: number;
  mean: [number, number, number];
  std: [number, number, number];
}

let sessionPromise: Promise<InferenceSession> | null = null;
let meta: ModelMeta | null = null;

async function getOrt() {
  const ort = await import("onnxruntime-web");
  ort.env.wasm.wasmPaths =
    `https://cdn.jsdelivr.net/npm/onnxruntime-web@1.24.3/dist/`;
  return ort;
}

export async function loadMeta(): Promise<ModelMeta> {
  if (meta) return meta;
  const res = await fetch(META_URL);
  meta = await res.json();
  return meta!;
}

export async function loadModel(
  onProgress?: (pct: number) => void
): Promise<InferenceSession> {
  if (sessionPromise) return sessionPromise;

  sessionPromise = (async () => {
    const ort = await getOrt();
    await loadMeta();

    const resp = await fetch(MODEL_URL);
    const total = Number(resp.headers.get("content-length") || 0);
    const reader = resp.body?.getReader();

    if (!reader || !total) {
      const buf = await (await fetch(MODEL_URL)).arrayBuffer();
      onProgress?.(100);
      return ort.InferenceSession.create(buf, {
        executionProviders: ["wasm"],
        graphOptimizationLevel: "all",
      });
    }

    const chunks: Uint8Array[] = [];
    let loaded = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      loaded += value.length;
      onProgress?.(Math.round((loaded / total) * 100));
    }

    const buf = new Uint8Array(loaded);
    let offset = 0;
    for (const chunk of chunks) {
      buf.set(chunk, offset);
      offset += chunk.length;
    }

    return ort.InferenceSession.create(buf.buffer, {
      executionProviders: ["wasm"],
      graphOptimizationLevel: "all",
    });
  })();

  return sessionPromise;
}

function preprocessRegion(
  canvas: HTMLCanvasElement,
  cropX: number,
  cropY: number,
  cropW: number,
  cropH: number,
  size: number,
  mean: number[],
  std: number[]
): Float32Array {
  const offscreen = document.createElement("canvas");
  offscreen.width = size;
  offscreen.height = size;
  const ctx = offscreen.getContext("2d")!;
  ctx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, size, size);

  const imageData = ctx.getImageData(0, 0, size, size);
  const { data } = imageData;
  const floats = new Float32Array(3 * size * size);

  for (let i = 0; i < size * size; i++) {
    floats[i] = (data[i * 4] / 255 - mean[0]) / std[0];
    floats[size * size + i] = (data[i * 4 + 1] / 255 - mean[1]) / std[1];
    floats[2 * size * size + i] = (data[i * 4 + 2] / 255 - mean[2]) / std[2];
  }

  return floats;
}

function softmax(logits: Float32Array): Float32Array {
  const max = Math.max(...logits);
  const exps = logits.map((v) => Math.exp(v - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((v) => v / sum) as unknown as Float32Array;
}

export interface Prediction {
  label: string;
  probability: number;
}

export interface SeverityResult {
  level: string;
  confidence: number;
}

export interface MultiTaskResult {
  conditions: Prediction[];
  severity: SeverityResult;
}

function splitLogits(
  logits: Float32Array,
  m: ModelMeta
): { condLogits: Float32Array; sevLogits: Float32Array } {
  const numCond = m.num_condition_classes || m.labels.length;
  const numSev = m.num_severity_classes || 4;
  const condLogits = logits.slice(0, numCond);
  const sevLogits = logits.slice(numCond, numCond + numSev);
  return { condLogits, sevLogits };
}

export async function classifyRegion(
  session: InferenceSession,
  canvas: HTMLCanvasElement,
  cropX: number,
  cropY: number,
  cropW: number,
  cropH: number
): Promise<Prediction[]> {
  const result = await classifyRegionMultiTask(session, canvas, cropX, cropY, cropW, cropH);
  return result.conditions;
}

export async function classifyRegionMultiTask(
  session: InferenceSession,
  canvas: HTMLCanvasElement,
  cropX: number,
  cropY: number,
  cropW: number,
  cropH: number
): Promise<MultiTaskResult> {
  const ort = await getOrt();
  const m = await loadMeta();

  const input = preprocessRegion(canvas, cropX, cropY, cropW, cropH, m.image_size, m.mean, m.std);
  const tensor = new ort.Tensor("float32", input, [1, 3, m.image_size, m.image_size]);
  const results = await session.run({ pixel_values: tensor });
  const logits = results.logits.data as Float32Array;

  const hasSeverity = m.severity_labels && m.severity_labels.length > 0;

  if (hasSeverity) {
    const { condLogits, sevLogits } = splitLogits(logits, m);
    const condProbs = softmax(condLogits);
    const sevProbs = softmax(sevLogits);

    const conditions: Prediction[] = m.labels.map((label, i) => ({
      label,
      probability: condProbs[i],
    }));
    conditions.sort((a, b) => b.probability - a.probability);

    const sevLabels = m.severity_labels!;
    let maxSevIdx = 0;
    for (let i = 1; i < sevProbs.length; i++) {
      if (sevProbs[i] > sevProbs[maxSevIdx]) maxSevIdx = i;
    }

    return {
      conditions,
      severity: { level: sevLabels[maxSevIdx], confidence: sevProbs[maxSevIdx] },
    };
  }

  const probs = softmax(logits);
  const conditions: Prediction[] = m.labels.map((label, i) => ({
    label,
    probability: probs[i],
  }));
  conditions.sort((a, b) => b.probability - a.probability);
  return { conditions, severity: { level: "moderate", confidence: 0.5 } };
}

/**
 * Extended TTA: run inference with 5 augmentations and average probabilities.
 * Original + horizontal flip + center crop + brightness variants.
 */
export async function classifyRegionTTA(
  session: InferenceSession,
  canvas: HTMLCanvasElement,
  cropX: number,
  cropY: number,
  cropW: number,
  cropH: number,
  passes: number = 5,
): Promise<Prediction[]> {
  const result = await classifyRegionMultiTaskTTA(session, canvas, cropX, cropY, cropW, cropH, passes);
  return result.conditions;
}

export async function classifyRegionMultiTaskTTA(
  session: InferenceSession,
  canvas: HTMLCanvasElement,
  cropX: number,
  cropY: number,
  cropW: number,
  cropH: number,
  passes: number = 5,
): Promise<MultiTaskResult> {
  const ort = await getOrt();
  const m = await loadMeta();
  const hasSeverity = m.severity_labels && m.severity_labels.length > 0;
  const numCond = m.num_condition_classes || m.labels.length;

  const augmentations: { cx: number; cy: number; cw: number; ch: number; flip: boolean; brightnessShift: number }[] = [
    { cx: cropX, cy: cropY, cw: cropW, ch: cropH, flip: false, brightnessShift: 0 },
    { cx: cropX, cy: cropY, cw: cropW, ch: cropH, flip: true, brightnessShift: 0 },
  ];

  const shrink = 0.08;
  const dx = cropW * shrink;
  const dy = cropH * shrink;
  augmentations.push({ cx: cropX + dx, cy: cropY + dy, cw: cropW - dx * 2, ch: cropH - dy * 2, flip: false, brightnessShift: 0 });
  augmentations.push({ cx: cropX, cy: cropY, cw: cropW, ch: cropH, flip: false, brightnessShift: 15 });
  augmentations.push({ cx: cropX, cy: cropY, cw: cropW, ch: cropH, flip: false, brightnessShift: -15 });

  const usePasses = Math.min(passes, augmentations.length);
  const allCondProbs: number[][] = [];
  const allSevProbs: number[][] = [];

  for (let p = 0; p < usePasses; p++) {
    const aug = augmentations[p];

    let inputCanvas: HTMLCanvasElement = canvas;
    if (aug.flip || aug.brightnessShift !== 0) {
      inputCanvas = document.createElement("canvas");
      inputCanvas.width = canvas.width;
      inputCanvas.height = canvas.height;
      const fCtx = inputCanvas.getContext("2d")!;

      if (aug.brightnessShift !== 0) {
        fCtx.filter = `brightness(${100 + aug.brightnessShift}%)`;
      }

      if (aug.flip) {
        fCtx.translate(canvas.width, 0);
        fCtx.scale(-1, 1);
      }
      fCtx.drawImage(canvas, 0, 0);
    }

    const input = preprocessRegion(inputCanvas, aug.cx, aug.cy, aug.cw, aug.ch, m.image_size, m.mean, m.std);
    const tensor = new ort.Tensor("float32", input, [1, 3, m.image_size, m.image_size]);
    const results = await session.run({ pixel_values: tensor });
    const logits = results.logits.data as Float32Array;

    if (hasSeverity) {
      const { condLogits, sevLogits } = splitLogits(logits, m);
      allCondProbs.push(Array.from(softmax(condLogits)));
      allSevProbs.push(Array.from(softmax(sevLogits)));
    } else {
      allCondProbs.push(Array.from(softmax(logits)));
    }
  }

  const avgCondProbs = m.labels.map((_, i) => {
    const sum = allCondProbs.reduce((acc, p) => acc + (p[i] || 0), 0);
    return sum / allCondProbs.length;
  });

  const conditions: Prediction[] = m.labels.map((label, i) => ({
    label,
    probability: avgCondProbs[i],
  }));
  conditions.sort((a, b) => b.probability - a.probability);

  let severity: SeverityResult = { level: "moderate", confidence: 0.5 };
  if (hasSeverity && allSevProbs.length > 0) {
    const sevLabels = m.severity_labels!;
    const avgSevProbs = sevLabels.map((_, i) => {
      const sum = allSevProbs.reduce((acc, p) => acc + (p[i] || 0), 0);
      return sum / allSevProbs.length;
    });
    let maxIdx = 0;
    for (let i = 1; i < avgSevProbs.length; i++) {
      if (avgSevProbs[i] > avgSevProbs[maxIdx]) maxIdx = i;
    }
    severity = { level: sevLabels[maxIdx], confidence: avgSevProbs[maxIdx] };
  }

  return { conditions, severity };
}

/* ------------------------------------------------------------------ */
/*  Zone ensemble + local skin metrics                                */
/* ------------------------------------------------------------------ */

export interface ZoneResult {
  zoneId: string;
  conditions: Prediction[];
  severity: SeverityResult;
}

export interface SkinMetrics {
  hydration: number;
  elasticity: number;
  pores: number;
  texture: number;
  evenness: number;
  sensitivity: number;
  oiliness: number;
  wrinkles: number;
  darkCircles: number;
  redness: number;
  acneScore: number;
  pigmentation: number;
  sunDamage: number;
  barrier: number;
  overall: number;
}

/**
 * Compute 15 skin metrics from zone-level condition+severity data.
 * Each metric 0–100 (higher = better/healthier).
 */
export function computeSkinMetrics(zones: ZoneResult[]): SkinMetrics {
  const base: SkinMetrics = {
    hydration: 80, elasticity: 80, pores: 85, texture: 85, evenness: 85,
    sensitivity: 85, oiliness: 80, wrinkles: 90, darkCircles: 90,
    redness: 85, acneScore: 90, pigmentation: 85, sunDamage: 90,
    barrier: 85, overall: 85,
  };

  const sevMultiplier: Record<string, number> = {
    none: 0, mild: 0.3, moderate: 0.6, severe: 1.0,
  };

  for (const zone of zones) {
    const topCond = zone.conditions[0];
    if (!topCond || topCond.label === "normal") continue;

    const conf = topCond.probability;
    const sev = sevMultiplier[zone.severity.level] ?? 0.5;
    const impact = conf * sev;

    switch (topCond.label) {
      case "acne":
        base.acneScore -= impact * 35;
        base.pores -= impact * 20;
        base.oiliness -= impact * 15;
        base.texture -= impact * 15;
        break;
      case "dryness":
        base.hydration -= impact * 35;
        base.barrier -= impact * 20;
        base.elasticity -= impact * 15;
        base.texture -= impact * 10;
        break;
      case "eczema":
        base.barrier -= impact * 30;
        base.sensitivity -= impact * 25;
        base.hydration -= impact * 20;
        base.redness -= impact * 15;
        break;
      case "dermatitis":
        base.sensitivity -= impact * 30;
        base.redness -= impact * 25;
        base.barrier -= impact * 20;
        break;
      case "rosacea":
        base.redness -= impact * 35;
        base.sensitivity -= impact * 25;
        base.evenness -= impact * 15;
        break;
      case "hyperpigmentation":
        base.pigmentation -= impact * 35;
        base.evenness -= impact * 25;
        break;
      case "psoriasis":
        base.barrier -= impact * 30;
        base.texture -= impact * 25;
        base.sensitivity -= impact * 20;
        base.redness -= impact * 15;
        break;
      case "sun_damage":
        base.sunDamage -= impact * 35;
        base.elasticity -= impact * 20;
        base.wrinkles -= impact * 15;
        base.pigmentation -= impact * 15;
        break;
    }
  }

  const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v)));
  const keys = Object.keys(base) as (keyof SkinMetrics)[];
  for (const k of keys) {
    if (k !== "overall") {
      (base as unknown as Record<string, number>)[k] = clamp(base[k]);
    }
  }

  const metricKeys = keys.filter((k) => k !== "overall");
  base.overall = clamp(metricKeys.reduce((sum, k) => sum + base[k], 0) / metricKeys.length);

  return base;
}

/**
 * Ensemble results across all zones into a single aggregated prediction set.
 * Weights each zone by its top-condition confidence.
 */
export function ensembleZones(zones: ZoneResult[], labels: string[]): Prediction[] {
  if (zones.length === 0) return [];

  const weightedProbs = new Map<string, number>();
  let totalWeight = 0;

  for (const zone of zones) {
    const topConf = zone.conditions[0]?.probability || 0.5;
    const weight = topConf;
    totalWeight += weight;

    for (const cond of zone.conditions) {
      const prev = weightedProbs.get(cond.label) || 0;
      weightedProbs.set(cond.label, prev + cond.probability * weight);
    }
  }

  const result: Prediction[] = labels.map((label) => ({
    label,
    probability: (weightedProbs.get(label) || 0) / totalWeight,
  }));

  result.sort((a, b) => b.probability - a.probability);
  return result;
}
