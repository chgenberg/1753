/**
 * ONNX Runtime Web inference for the skin condition classifier.
 *
 * Runs entirely in the browser using WASM – no images are sent to any server.
 */

import type { InferenceSession, Tensor } from "onnxruntime-web";

const MODEL_URL = "/models/skin_classifier_q8.onnx";
const META_URL = "/models/model_meta.json";

interface ModelMeta {
  image_size: number;
  labels: string[];
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
    const m = await loadMeta();

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

/**
 * Preprocess an image region for the model.
 * Crops the given rect from the canvas, resizes to model input size, and
 * normalizes with ImageNet mean/std.
 */
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
    floats[i] = (data[i * 4] / 255 - mean[0]) / std[0]; // R
    floats[size * size + i] = (data[i * 4 + 1] / 255 - mean[1]) / std[1]; // G
    floats[2 * size * size + i] = (data[i * 4 + 2] / 255 - mean[2]) / std[2]; // B
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

/**
 * Run inference on a canvas region.
 * Returns predictions sorted by probability (descending).
 */
export async function classifyRegion(
  session: InferenceSession,
  canvas: HTMLCanvasElement,
  cropX: number,
  cropY: number,
  cropW: number,
  cropH: number
): Promise<Prediction[]> {
  const ort = await getOrt();
  const m = await loadMeta();

  const input = preprocessRegion(
    canvas,
    cropX,
    cropY,
    cropW,
    cropH,
    m.image_size,
    m.mean,
    m.std
  );

  const tensor = new ort.Tensor("float32", input, [
    1,
    3,
    m.image_size,
    m.image_size,
  ]);

  const results = await session.run({ pixel_values: tensor });
  const logits = results.logits.data as Float32Array;
  const probs = softmax(logits);

  const predictions: Prediction[] = m.labels.map((label, i) => ({
    label,
    probability: probs[i],
  }));

  predictions.sort((a, b) => b.probability - a.probability);
  return predictions;
}

/**
 * TTA: run inference with multiple augmentations and average probabilities.
 * Horizontal flip + slight crops give more robust results at ~3x inference cost.
 */
export async function classifyRegionTTA(
  session: InferenceSession,
  canvas: HTMLCanvasElement,
  cropX: number,
  cropY: number,
  cropW: number,
  cropH: number,
  passes: number = 3,
): Promise<Prediction[]> {
  const ort = await getOrt();
  const m = await loadMeta();

  const augmentations: [number, number, number, number][] = [
    [cropX, cropY, cropW, cropH],
    [cropX, cropY, cropW, cropH], // will be flipped
  ];

  const shrink = 0.08;
  const dx = cropW * shrink;
  const dy = cropH * shrink;
  augmentations.push([cropX + dx, cropY + dy, cropW - dx * 2, cropH - dy * 2]);

  const allProbs: number[][] = [];

  for (let p = 0; p < Math.min(passes, augmentations.length); p++) {
    const [cx, cy, cw, ch] = augmentations[p];
    const isFlip = p === 1;

    let inputCanvas: HTMLCanvasElement;
    if (isFlip) {
      inputCanvas = document.createElement("canvas");
      inputCanvas.width = canvas.width;
      inputCanvas.height = canvas.height;
      const fCtx = inputCanvas.getContext("2d")!;
      fCtx.translate(canvas.width, 0);
      fCtx.scale(-1, 1);
      fCtx.drawImage(canvas, 0, 0);
    } else {
      inputCanvas = canvas;
    }

    const input = preprocessRegion(inputCanvas, cx, cy, cw, ch, m.image_size, m.mean, m.std);
    const tensor = new ort.Tensor("float32", input, [1, 3, m.image_size, m.image_size]);
    const results = await session.run({ pixel_values: tensor });
    const logits = results.logits.data as Float32Array;
    const probs = softmax(logits);
    allProbs.push(Array.from(probs));
  }

  const avgProbs = m.labels.map((_, i) => {
    const sum = allProbs.reduce((acc, p) => acc + p[i], 0);
    return sum / allProbs.length;
  });

  const predictions: Prediction[] = m.labels.map((label, i) => ({
    label,
    probability: avgProbs[i],
  }));

  predictions.sort((a, b) => b.probability - a.probability);
  return predictions;
}
