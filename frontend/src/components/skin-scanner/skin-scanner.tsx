"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Camera,
  CheckSquare,
  ImagePlus,
  Loader2,
  Lock,
  RefreshCw,
  ScanFace,
  Shield,
  Square,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Prediction, SeverityResult, SkinMetrics, ZoneResult as OnnxZoneResult } from "./onnx-inference";
import { FaceCanvas } from "./face-canvas";
import {
  FACE_ZONES,
  CONDITION_COLORS,
  conditionLabel as getCondLabel,
  zoneLabel as getZoneLabel,
  type ZoneResult,
} from "./zones";
import { useLocale } from "@/providers/locale-provider";

function tx(locale: string, sv: string, en: string, es?: string, de?: string, fr?: string): string {
  if (locale === "sv") return sv;
  if (locale === "es") return es || en;
  if (locale === "de") return de || en;
  if (locale === "fr") return fr || en;
  return en;
}

export interface ScanSummary {
  overallTop: Prediction[];
  zones: ZoneResult[];
  consentGiven: boolean;
  imageBase64?: string;
  zoneCrops?: { id: string; dataUrl: string; labelEn?: string }[];
  overallSeverity?: SeverityResult;
  skinMetrics?: SkinMetrics;
}

type ScannerStep = "idle" | "loading-model" | "camera" | "captured" | "analyzing" | "results";

interface SkinScannerProps {
  onComplete?: (summary: ScanSummary) => void;
}

export function SkinScanner({ onComplete }: SkinScannerProps) {
  const { locale } = useLocale();
  const [step, setStep] = useState<ScannerStep>("idle");
  const [modelProgress, setModelProgress] = useState(0);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [results, setResults] = useState<ZoneResult[]>([]);
  const [overallTop, setOverallTop] = useState<Prediction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [analyzingZone, setAnalyzingZone] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const startCamera = useCallback(async () => {
    setStep("camera");
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 960 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch {
      setError(
        tx(locale,
          "Kunde inte starta kameran. Kontrollera att du gett tillstånd.",
          "Could not start the camera. Please check your permissions.",
          "No se pudo iniciar la cámara. Verifica los permisos.",
          "Kamera konnte nicht gestartet werden. Bitte Berechtigungen prüfen.",
          "Impossible de démarrer la caméra. Vérifiez les autorisations.")
      );
      setStep("idle");
    }
  }, [locale]);

  const captureFromCamera = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(video, 0, 0);

    stopCamera();
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setImageSrc(dataUrl);
    setStep("captured");
  }, [stopCamera]);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0);
          setImageSrc(reader.result as string);
          setStep("captured");
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const runAnalysis = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setStep("loading-model");
    setError(null);
    setAnalyzingZone("");

    try {
      const [{ loadModel, classifyRegionMultiTaskTTA, computeSkinMetrics, ensembleZones, loadMeta }, { loadFaceLandmarker, detectFaceZones, cropZoneImages, ZONE_IDS_FOR_GPT }] =
        await Promise.all([
          import("./onnx-inference"),
          import("./face-landmarker"),
        ]);

      setAnalyzingZone(tx(locale, "Laddar modeller...", "Loading models...", "Cargando modelos...", "Modelle werden geladen...", "Chargement des modèles..."));

      const [session] = await Promise.all([
        loadModel((pct) => setModelProgress(pct)),
        loadFaceLandmarker(),
      ]);

      setStep("analyzing");
      setAnalyzingZone(tx(locale, "Detekterar ansiktslandmärken...", "Detecting face landmarks...", "Detectando puntos faciales...", "Gesichtspunkte werden erkannt...", "Détection des points du visage..."));

      const NORMAL_THRESHOLD = 0.35;
      const ENTROPY_THRESHOLD = 2.0;

      function entropy(preds: { probability: number }[]) {
        return -preds.reduce((s, p) => {
          const q = Math.max(p.probability, 1e-10);
          return s + q * Math.log2(q);
        }, 0);
      }

      function applyNormalFilter(preds: { label: string; probability: number }[]) {
        const topProb = preds[0]?.probability ?? 0;
        const e = entropy(preds);
        if (topProb < NORMAL_THRESHOLD || e > ENTROPY_THRESHOLD) {
          return [
            { label: "normal", probability: 1 - topProb },
            ...preds,
          ];
        }
        return preds;
      }

      setAnalyzingZone(tx(locale, "Helhetsbild", "Full face", "Rostro completo", "Gesamtes Gesicht", "Visage complet"));
      const rawOverallResult = await classifyRegionMultiTaskTTA(session, canvas, 0, 0, canvas.width, canvas.height, 5);
      const overallPreds = applyNormalFilter(rawOverallResult.conditions);
      const overallSeverity = rawOverallResult.severity;

      // --- MediaPipe face landmark detection ---
      let mediapipeZones: Awaited<ReturnType<typeof detectFaceZones>> = [];
      let zoneCrops: { id: string; dataUrl: string }[] = [];

      try {
        const landmarker = await loadFaceLandmarker();
        const imgEl = new Image();
        imgEl.src = canvas.toDataURL("image/jpeg", 0.9);
        await new Promise<void>((resolve) => { imgEl.onload = () => resolve(); });

        const result = landmarker.detect(imgEl);
        mediapipeZones = detectFaceZones(result, canvas.width, canvas.height);

        if (mediapipeZones.length > 0) {
          const cropsWithData = cropZoneImages(canvas, mediapipeZones, 512);
          zoneCrops = cropsWithData
            .filter((z) => (ZONE_IDS_FOR_GPT as readonly string[]).includes(z.id) && z.dataUrl)
            .map((z) => ({ id: z.id, dataUrl: z.dataUrl!, labelEn: z.labelEn }));
        }
      } catch (e) {
        console.warn("MediaPipe face detection failed, falling back to grid zones:", e);
      }

      // --- ONNX per-zone classification (use MediaPipe zones if available, fallback to grid) ---
      const zoneResults: ZoneResult[] = [];

      if (mediapipeZones.length > 0) {
        const onnxCompatibleZones = mediapipeZones.filter((z) =>
          ["forehead", "left_cheek", "right_cheek", "nose", "chin", "t_zone"].includes(z.id)
        );

        for (const mz of onnxCompatibleZones) {
          const matchingFaceZone = FACE_ZONES.find((fz) => fz.id === mz.id);
          if (!matchingFaceZone) continue;
          if (mz.w < 20 || mz.h < 20) continue;

          setAnalyzingZone(getZoneLabel(matchingFaceZone, locale));

          const rawResult = await classifyRegionMultiTaskTTA(session, canvas, mz.x, mz.y, mz.w, mz.h, 5);
          const preds = applyNormalFilter(rawResult.conditions);

          zoneResults.push({
            zone: matchingFaceZone,
            topCondition: preds[0].label,
            confidence: preds[0].probability,
            allPredictions: preds,
            severity: rawResult.severity,
          });
        }
      } else {
        const faceW = canvas.width * 0.75;
        const faceH = canvas.height * 0.85;
        const faceX = (canvas.width - faceW) / 2;
        const faceY = canvas.height * 0.05;

        for (const zone of FACE_ZONES) {
          setAnalyzingZone(getZoneLabel(zone, locale));

          const [rx, ry, rw, rh] = zone.rect;
          const safeX = Math.max(0, Math.round(faceX + rx * faceW));
          const safeY = Math.max(0, Math.round(faceY + ry * faceH));
          const safeW = Math.min(Math.round(rw * faceW), canvas.width - safeX);
          const safeH = Math.min(Math.round(rh * faceH), canvas.height - safeY);

          if (safeW < 20 || safeH < 20) continue;

          const rawResult = await classifyRegionMultiTaskTTA(session, canvas, safeX, safeY, safeW, safeH, 5);
          const preds = applyNormalFilter(rawResult.conditions);

          zoneResults.push({
            zone,
            topCondition: preds[0].label,
            confidence: preds[0].probability,
            allPredictions: preds,
            severity: rawResult.severity,
          });
        }
      }

      const onnxZoneResults: OnnxZoneResult[] = zoneResults.map((zr) => ({
        zoneId: zr.zone.id,
        conditions: zr.allPredictions,
        severity: zr.severity || overallSeverity,
      }));
      const skinMetrics = computeSkinMetrics(onnxZoneResults);

      setResults(zoneResults);
      setOverallTop(overallPreds.slice(0, 3));
      setStep("results");
      onComplete?.({
        overallTop: overallPreds.slice(0, 3),
        zones: zoneResults,
        consentGiven: consent,
        imageBase64: imageSrc ?? undefined,
        zoneCrops: zoneCrops.length > 0 ? zoneCrops : undefined,
        overallSeverity,
        skinMetrics,
      });
    } catch (err) {
      console.error("Analysis error:", err);
      setError(
        tx(locale,
          "Något gick fel vid analysen. Försök igen.",
          "Something went wrong during the analysis. Please try again.",
          "Algo salió mal durante el análisis. Inténtalo de nuevo.",
          "Bei der Analyse ist ein Fehler aufgetreten. Bitte erneut versuchen.",
          "Une erreur s'est produite pendant l'analyse. Veuillez réessayer.")
      );
      setStep("captured");
    }
  }, [consent, imageSrc, locale, onComplete]);

  const reset = useCallback(() => {
    setStep("idle");
    setImageSrc(null);
    setResults([]);
    setOverallTop([]);
    setModelProgress(0);
    setError(null);
    setConsent(false);
    setAnalyzingZone("");
    stopCamera();
  }, [stopCamera]);

  return (
    <div className="mx-auto w-full max-w-xl">
      {/* Hidden helpers */}
      <canvas ref={canvasRef} className="hidden" />
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* --- IDLE STATE --- */}
      {step === "idle" && (
        <div className="animate-fade-in space-y-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#108474]/10">
            <ScanFace className="h-10 w-10 text-[#108474]" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-[#1d1d1f]">
              {tx(locale, "Ansiktsskanning", "Face scan", "Escaneo facial", "Gesichtsscan", "Scan du visage")}
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[#515151]">
              {tx(locale,
                "Ta en selfie eller ladda upp ett foto. Vår AI analyserar sex ansiktszoner direkt i din enhet — helt privat.",
                "Take a selfie or upload a photo. Our AI reviews six facial zones directly on your device, completely privately.",
                "Toma un selfie o sube una foto. Nuestra IA analiza seis zonas faciales directamente en tu dispositivo, de forma completamente privada.",
                "Mache ein Selfie oder lade ein Foto hoch. Unsere KI analysiert sechs Gesichtszonen direkt auf deinem Gerät — völlig privat.",
                "Prenez un selfie ou importez une photo. Notre IA analyse six zones du visage directement sur votre appareil — en toute confidentialité.")}
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={startCamera}
              className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-full bg-[#108474] px-7 text-sm font-semibold text-white shadow-lg shadow-[#108474]/20 transition-all hover:bg-[#0d6e62] hover:shadow-xl active:scale-[0.97] sm:w-auto"
            >
              <Camera className="h-4.5 w-4.5" />
              {tx(locale, "Öppna kamera", "Open camera", "Abrir cámara", "Kamera öffnen", "Ouvrir la caméra")}
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-full border-2 border-[#108474] px-7 text-sm font-semibold text-[#108474] transition-all hover:bg-[#108474]/5 active:scale-[0.97] sm:w-auto"
            >
              <ImagePlus className="h-4.5 w-4.5" />
              {tx(locale, "Ladda upp foto", "Upload photo", "Subir foto", "Foto hochladen", "Télécharger une photo")}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-[#766a62]">
            <Shield className="h-3.5 w-3.5" />
            <span>
              {tx(locale,
                "Din bild lämnar aldrig din enhet",
                "Your image never leaves your device",
                "Tu imagen nunca sale de tu dispositivo",
                "Dein Bild verlässt nie dein Gerät",
                "Votre image ne quitte jamais votre appareil")}
            </span>
          </div>
        </div>
      )}

      {/* --- CAMERA VIEW --- */}
      {step === "camera" && (
        <div className="animate-fade-in space-y-4">
          <div className="relative overflow-hidden rounded-2xl bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="block h-auto w-full scale-x-[-1]"
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-[70%] w-[55%] rounded-[50%] border-2 border-white/30 shadow-[0_0_0_9999px_rgba(0,0,0,0.3)]" />
            </div>
            <p className="absolute bottom-4 left-0 right-0 text-center text-sm font-medium text-white/80">
              {tx(locale, "Placera ditt ansikte inom ovalen", "Place your face inside the oval", "Coloca tu rostro dentro del óvalo", "Platziere dein Gesicht im Oval", "Placez votre visage dans l'ovale")}
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={reset}
              className="inline-flex h-10 items-center gap-2 rounded-xl px-5 text-sm font-medium text-[#515151] transition-colors hover:bg-[#f5f5f7]"
            >
              <X className="h-4 w-4" />
              {tx(locale, "Avbryt", "Cancel", "Cancelar", "Abbrechen", "Annuler")}
            </button>
            <button
              onClick={captureFromCamera}
              className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:scale-105 active:scale-90"
              aria-label={tx(locale, "Ta foto", "Take photo", "Tomar foto", "Foto aufnehmen", "Prendre une photo")}
            >
              <div className="h-11 w-11 rounded-full border-[3px] border-[#108474]" />
            </button>
          </div>
        </div>
      )}

      {/* --- CAPTURED (preview before analysis) --- */}
      {step === "captured" && imageSrc && (
        <div className="animate-fade-in space-y-5">
          <div className="overflow-hidden rounded-2xl shadow-lg shadow-black/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt={tx(locale, "Förhandsvisning", "Preview", "Vista previa", "Vorschau", "Aperçu")}
              className="block h-auto w-full"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}

          <div className="mx-auto max-w-sm space-y-2">
            <button
              type="button"
              onClick={() => setConsent((c) => !c)}
              className={cn(
                "flex w-full items-start gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-all duration-300",
                consent
                  ? "border-[#108474]/30 bg-[#108474]/5"
                  : "border-transparent bg-[#f5f5f7] hover:border-[#e6e6e6]"
              )}
            >
              {consent ? (
                <CheckSquare className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#108474]" />
              ) : (
                <Square className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#766a62]/50" />
              )}
              <span className="text-xs leading-relaxed text-[#515151]">
                {locale === "sv" ? (
                  <>Jag godkänner att min bild och mina svar får användas{" "}<span className="font-semibold text-[#1d1d1f]">anonymt</span> för att förbättra 1753 SKINCAREs AI-hudanalys. Ingen personlig information sparas.</>
                ) : locale === "es" ? (
                  <>Acepto que mi imagen y respuestas se utilicen de forma{" "}<span className="font-semibold text-[#1d1d1f]">anónima</span> para mejorar el análisis de piel IA de 1753 SKINCARE. No se almacena información personal.</>
                ) : locale === "de" ? (
                  <>Ich stimme zu, dass mein Bild und meine Antworten{" "}<span className="font-semibold text-[#1d1d1f]">anonym</span> zur Verbesserung der KI-Hautanalyse von 1753 SKINCARE verwendet werden. Es werden keine persönlichen Daten gespeichert.</>
                ) : locale === "fr" ? (
                  <>J&apos;accepte que mon image et mes réponses soient utilisées de manière{" "}<span className="font-semibold text-[#1d1d1f]">anonyme</span> pour améliorer l&apos;analyse de peau IA de 1753 SKINCARE. Aucune information personnelle n&apos;est stockée.</>
                ) : (
                  <>I agree that my image and answers may be used{" "}<span className="font-semibold text-[#1d1d1f]">anonymously</span> to improve 1753 SKINCARE&apos;s AI skin analysis. No personal information is stored.</>
                )}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setShowSecurity(true)}
              className="mx-auto flex items-center gap-1.5 text-[11px] font-medium text-[#766a62]/70 transition-colors hover:text-[#108474]"
            >
              <Lock className="h-3 w-3" />
              {tx(locale, "Säkerhet", "Security", "Seguridad", "Sicherheit", "Sécurité")}
            </button>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={reset}
              className="inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-medium text-[#515151] transition-colors hover:bg-[#f5f5f7]"
            >
              <RefreshCw className="h-4 w-4" />
              {tx(locale, "Nytt foto", "Use another photo", "Otra foto", "Anderes Foto", "Autre photo")}
            </button>
            <button
              onClick={runAnalysis}
              className="inline-flex h-12 items-center gap-2.5 rounded-full bg-[#108474] px-8 text-sm font-semibold text-white shadow-lg shadow-[#108474]/20 transition-all hover:bg-[#0d6e62] hover:shadow-xl active:scale-[0.97]"
            >
              <ScanFace className="h-4.5 w-4.5" />
              {tx(locale, "Analysera min hy", "Analyse my skin", "Analizar mi piel", "Meine Haut analysieren", "Analyser ma peau")}
            </button>
          </div>
        </div>
      )}

      {/* --- LOADING MODEL --- */}
      {step === "loading-model" && (
        <div className="animate-fade-in space-y-6 text-center">
          <div className="relative mx-auto h-16 w-16">
            <Loader2 className="h-16 w-16 animate-spin text-[#108474]" />
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-tight text-[#1d1d1f]">
              {tx(locale, "Laddar analysmodell", "Loading analysis model", "Cargando modelo de análisis", "Analysemodell wird geladen", "Chargement du modèle d'analyse")}
            </h3>
            <p className="mt-1 text-sm text-[#515151]">
              {modelProgress < 100
                ? tx(locale, `${modelProgress}% nedladdat`, `${modelProgress}% downloaded`, `${modelProgress}% descargado`, `${modelProgress}% heruntergeladen`, `${modelProgress}% téléchargé`)
                : tx(locale, "Förbereder modellen...", "Preparing model...", "Preparando modelo...", "Modell wird vorbereitet...", "Préparation du modèle...")}
            </p>
          </div>
          <div className="mx-auto h-2 w-72 overflow-hidden rounded-full bg-[#e6e6e6]">
            <div
              className="h-full rounded-full bg-[#108474] transition-all duration-300 ease-out"
              style={{ width: `${modelProgress}%` }}
            />
          </div>
          <p className="text-xs text-[#766a62]">
            {tx(locale,
              "Första gången kräver nedladdning (87 MB). Cachelagras sedan lokalt.",
              "The first run requires a download (87 MB). After that it is cached locally.",
              "La primera ejecución requiere una descarga (87 MB). Luego se almacena en caché localmente.",
              "Beim ersten Mal ist ein Download erforderlich (87 MB). Danach wird lokal zwischengespeichert.",
              "La première exécution nécessite un téléchargement (87 Mo). Elle est ensuite mise en cache localement.")}
          </p>
        </div>
      )}

      {/* --- ANALYZING --- */}
      {step === "analyzing" && (
        <div className="animate-fade-in space-y-6 text-center">
          <div className="relative mx-auto h-20 w-20">
            <ScanFace className="h-20 w-20 text-[#108474]" />
            <div className="absolute inset-0 animate-ping rounded-full bg-[#108474]/10" />
            <div
              className="absolute inset-[-4px] animate-spin rounded-full border-2 border-transparent border-t-[#108474]"
              style={{ animationDuration: "1.5s" }}
            />
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-tight text-[#1d1d1f]">
              {tx(locale, "Analyserar din hy", "Analysing your skin", "Analizando tu piel", "Deine Haut wird analysiert", "Analyse de votre peau")}
            </h3>
            <p className="mt-2 text-sm text-[#515151]">
              {tx(locale,
                "Sex ansiktszoner granskas av vår AI",
                "Our AI is reviewing six facial zones",
                "Nuestra IA está revisando seis zonas faciales",
                "Unsere KI prüft sechs Gesichtszonen",
                "Notre IA examine six zones du visage")}
            </p>
          </div>
          {analyzingZone && (
            <div className="inline-flex items-center gap-2 rounded-full bg-[#108474]/5 px-4 py-2 text-xs font-medium text-[#108474]">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#108474]" />
              {analyzingZone}
            </div>
          )}
        </div>
      )}

      {/* --- RESULTS --- */}
      {step === "results" && imageSrc && (
        <div className="animate-fade-in space-y-8">
          <FaceCanvas
            imageSrc={imageSrc}
            results={results}
            className="rounded-2xl shadow-xl shadow-black/5"
          />

          {/* Overall summary */}
          {overallTop.length > 0 && (
            <div className="rounded-2xl border border-[#e6e6e6] bg-white p-5 shadow-sm">
              <h4 className="mb-3 text-sm font-bold tracking-tight text-[#1d1d1f]">
                {tx(locale, "Översiktlig bedömning", "Overall read", "Lectura general", "Gesamtbewertung", "Évaluation globale")}
              </h4>
              <div className="flex flex-wrap gap-2">
                {overallTop.map((pred) => {
                  const color = CONDITION_COLORS[pred.label] || "#108474";
                  const localizedLabel = getCondLabel(pred.label, locale);
                  return (
                    <div
                      key={pred.label}
                      className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2"
                      style={{
                        backgroundColor: `${color}12`,
                        border: `1px solid ${color}25`,
                      }}
                    >
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span
                        className="text-sm font-semibold"
                        style={{ color }}
                      >
                        {localizedLabel}
                      </span>
                      <span className="text-xs text-[#766a62]">
                        {Math.round(pred.probability * 100)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Zone-by-zone breakdown */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-tight text-[#1d1d1f]">
              {tx(locale, "Zon för zon", "Zone by zone", "Zona por zona", "Zone für Zone", "Zone par zone")}
            </h4>
            <div className="grid gap-3 sm:grid-cols-2">
              {results
                .filter((r) => r.confidence >= 0.50)
                .map((r) => {
                  const color =
                    CONDITION_COLORS[r.topCondition] || "#108474";
                  const localizedLabel = getCondLabel(r.topCondition, locale);
                  return (
                    <div
                      key={r.zone.id}
                      className="rounded-2xl border border-[#e6e6e6] bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-semibold text-[#1d1d1f]">
                          {getZoneLabel(r.zone, locale)}
                        </span>
                        <span
                          className="rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                          style={{
                            backgroundColor: `${color}15`,
                            color,
                          }}
                        >
                          {Math.round(r.confidence * 100)}%
                        </span>
                      </div>
                      <p className="text-sm font-medium" style={{ color }}>
                        {localizedLabel}
                      </p>
                      {r.allPredictions.length > 1 &&
                        r.allPredictions[1].probability > 0.1 && (
                          <p className="mt-1 text-xs text-[#766a62]">
                            {tx(locale, "Även:", "Also:", "También:", "Auch:", "Aussi :")}{" "}
                            {getCondLabel(r.allPredictions[1].label, locale)}{" "}
                            ({Math.round(r.allPredictions[1].probability * 100)}%)
                          </p>
                        )}
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Privacy badge + consent + actions */}
          <div className="space-y-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#108474]/5 px-4 py-2 text-xs font-medium text-[#108474]">
              <Shield className="h-3.5 w-3.5" />
              {tx(locale,
                "Din bild analyserades helt lokalt och har inte lämnat din enhet",
                "Your image was analysed locally and never left your device",
                "Tu imagen fue analizada localmente y nunca salió de tu dispositivo",
                "Dein Bild wurde lokal analysiert und hat dein Gerät nie verlassen",
                "Votre image a été analysée entièrement en local et n'a pas quitté votre appareil")}
            </div>

            {!consent && (
              <button
                type="button"
                onClick={() => setConsent(true)}
                className="mx-auto flex max-w-sm items-start gap-3 rounded-2xl border-2 border-transparent bg-[#f5f5f7] px-4 py-3 text-left transition-all hover:border-[#e6e6e6]"
              >
                <Square className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#766a62]/50" />
                <span className="text-xs leading-relaxed text-[#515151]">
                  {locale === "sv" ? (
                    <>Jag godkänner att min bild och mina svar får användas{" "}<span className="font-semibold text-[#1d1d1f]">anonymt</span> för att förbättra vår AI-hudanalys.</>
                  ) : locale === "es" ? (
                    <>Acepto que mi imagen y respuestas se utilicen de forma{" "}<span className="font-semibold text-[#1d1d1f]">anónima</span> para mejorar nuestro análisis de piel IA.</>
                  ) : locale === "de" ? (
                    <>Ich stimme zu, dass mein Bild und meine Antworten{" "}<span className="font-semibold text-[#1d1d1f]">anonym</span> zur Verbesserung unserer KI-Hautanalyse verwendet werden.</>
                  ) : locale === "fr" ? (
                    <>J&apos;accepte que mon image et mes réponses soient utilisées de manière{" "}<span className="font-semibold text-[#1d1d1f]">anonyme</span> pour améliorer notre analyse de peau IA.</>
                  ) : (
                    <>I agree that my image and answers may be used{" "}<span className="font-semibold text-[#1d1d1f]">anonymously</span> to improve our AI skin analysis.</>
                  )}
                </span>
              </button>
            )}

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={reset}
                className="inline-flex h-10 items-center gap-2 rounded-full border-2 border-[#108474] px-6 text-sm font-semibold text-[#108474] transition-all hover:bg-[#108474]/5 active:scale-[0.97]"
              >
                <RefreshCw className="h-4 w-4" />
                {tx(locale, "Ny skanning", "New scan", "Nuevo escaneo", "Neuer Scan", "Nouveau scan")}
              </button>
            </div>

            <p className="mx-auto max-w-sm text-[11px] leading-relaxed text-[#766a62]/80">
              {tx(locale,
                "Denna analys är framtagen med hjälp av artificiell intelligens och utgör inte medicinsk rådgivning, diagnos eller behandlingsrekommendation. Vid hudbesvär, kontakta alltid en legitimerad dermatolog eller läkare.",
                "This analysis is generated with the help of artificial intelligence and does not constitute medical advice, diagnosis or treatment recommendations. If you have ongoing skin concerns, always contact a licensed dermatologist or doctor.",
                "Este análisis se genera con la ayuda de inteligencia artificial y no constituye asesoramiento médico, diagnóstico o recomendaciones de tratamiento. Si tienes problemas de piel, consulta siempre a un dermatólogo o médico.",
                "Diese Analyse wurde mit Hilfe künstlicher Intelligenz erstellt und stellt keine medizinische Beratung, Diagnose oder Behandlungsempfehlung dar. Bei Hautproblemen wenden Sie sich immer an einen Dermatologen oder Arzt.",
                "Cette analyse est générée à l'aide d'intelligence artificielle et ne constitue pas un avis médical, un diagnostic ni des recommandations de traitement. En cas de problèmes de peau, consultez toujours un dermatologue ou un médecin agréé.")}
            </p>
          </div>
        </div>
      )}
      {/* Security info modal */}
      {showSecurity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowSecurity(false)}>
          <div
            className="relative mx-4 max-h-[85vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowSecurity(false)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-[#766a62] transition-colors hover:bg-[#f5f5f7]"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#108474]/10">
                <Shield className="h-5 w-5 text-[#108474]" />
              </div>
              <h3 className="text-lg font-bold tracking-tight text-[#1d1d1f]">
                {tx(locale, "Så skyddar vi din data", "How we protect your data", "Cómo protegemos tus datos", "So schützen wir deine Daten", "Comment nous protégeons vos données")}
              </h3>
            </div>

            <div className="space-y-5 text-[13px] leading-relaxed text-[#515151]">
              <div>
                <h4 className="mb-1 font-semibold text-[#1d1d1f]">
                  {tx(locale, "Ansiktsskanningen stannar i din enhet", "Face scan stays on your device", "El escaneo facial permanece en tu dispositivo", "Der Gesichtsscan bleibt auf deinem Gerät", "Le scan facial reste sur votre appareil")}
                </h4>
                <p>
                  {tx(locale,
                    "AI-modellen körs helt i din webbläsare. Ditt foto laddas aldrig upp till någon server under skanningen. Analysen sker lokalt på din enhet med maskininlärningsteknik (ONNX Runtime Web).",
                    "The AI model runs entirely in your browser. Your photo is never uploaded to any server during the scan. The analysis happens locally on your device using machine learning technology (ONNX Runtime Web).",
                    "El modelo de IA se ejecuta por completo en tu navegador. Tu foto nunca se carga en ningún servidor durante el escaneo. El análisis se realiza localmente en tu dispositivo con tecnología de aprendizaje automático (ONNX Runtime Web).",
                    "Das KI-Modell läuft vollständig in deinem Browser. Dein Foto wird während des Scans niemals auf einen Server hochgeladen. Die Analyse erfolgt lokal auf deinem Gerät mit maschinellem Lernen (ONNX Runtime Web).",
                    "Le modèle d'IA s'exécute entièrement dans votre navigateur. Votre photo n'est jamais envoyée sur un serveur pendant le scan. L'analyse se fait localement sur votre appareil avec l'apprentissage automatique (ONNX Runtime Web).")}
                </p>
              </div>

              <div>
                <h4 className="mb-1 font-semibold text-[#1d1d1f]">
                  {tx(locale, "Valfri fotolagring med kryptering", "Optional photo storage with encryption", "Almacenamiento opcional de fotos con cifrado", "Optionale Fotospeicherung mit Verschlüsselung", "Stockage photo optionnel avec chiffrement")}
                </h4>
                <p>
                  {tx(locale,
                    "Om du väljer att spara ditt foto för att följa hudförändringar över tid krypteras det med AES-256-GCM innan det lagras. Detta är samma krypteringsstandard som används av banker och sjukvården. Varje bild får en unik krypteringsnyckel. Bara du kan se dina sparade foton när du är inloggad.",
                    "If you choose to save your photo to track skin changes over time, it is encrypted with AES-256-GCM before being stored. This is the same encryption standard used by banks and healthcare providers. Each image gets a unique encryption key. Only you can view your saved photos when logged in.",
                    "Si eliges guardar tu foto para seguir los cambios de la piel con el tiempo, se cifra con AES-256-GCM antes de almacenarse. Es el mismo estándar de cifrado que usan bancos y proveedores sanitarios. Cada imagen tiene una clave única. Solo tú puedes ver tus fotos guardadas cuando has iniciado sesión.",
                    "Wenn du dein Foto speicherst, um Hautveränderungen über die Zeit zu verfolgen, wird es vor der Speicherung mit AES-256-GCM verschlüsselt. Das ist derselbe Verschlüsselungsstandard wie bei Banken und im Gesundheitswesen. Jedes Bild erhält einen eigenen Schlüssel. Nur du kannst deine gespeicherten Fotos sehen, wenn du angemeldet bist.",
                    "Si vous choisissez d'enregistrer votre photo pour suivre l'évolution de votre peau, elle est chiffrée en AES-256-GCM avant stockage. C'est la même norme que celle des banques et du secteur santé. Chaque image a une clé unique. Seul vous pouvez voir vos photos enregistrées lorsque vous êtes connecté.")}
                </p>
              </div>

              <div>
                <h4 className="mb-1 font-semibold text-[#1d1d1f]">
                  {tx(locale, "Träningsdata anonymiseras", "Training data is anonymised", "Los datos de entrenamiento se anonimizan", "Trainingsdaten werden anonymisiert", "Les données d'entraînement sont anonymisées")}
                </h4>
                <p>
                  {tx(locale,
                    "Om du samtycker till att hjälpa förbättra vår AI sparas en kopia av skanningsdatan separat utan koppling till ditt konto, namn eller personlig information. Datan används enbart för att träna och förbättra hudanalysmodellen.",
                    "If you consent to help improve our AI, a copy of the scan data is stored separately without any link to your account, name or personal information. This data is used solely to train and improve the skin analysis model.",
                    "Si aceptas ayudarnos a mejorar nuestra IA, se guarda por separado una copia de los datos del escaneo sin vinculación a tu cuenta, nombre ni datos personales. Solo se usan para entrenar y mejorar el modelo de análisis de piel.",
                    "Wenn du einwilligst, unsere KI zu verbessern, wird eine Kopie der Scandaten getrennt gespeichert – ohne Verknüpfung mit deinem Konto, Namen oder personenbezogenen Daten. Sie dient ausschließlich dem Training und der Verbesserung des Hautanalysemodells.",
                    "Si vous acceptez d'aider à améliorer notre IA, une copie des données de scan est conservée séparément, sans lien avec votre compte, votre nom ni vos informations personnelles. Elle sert uniquement à entraîner et améliorer le modèle d'analyse de la peau.")}
                </p>
              </div>

              <div>
                <h4 className="mb-1 font-semibold text-[#1d1d1f]">
                  {tx(locale, "Du har kontroll", "You are in control", "Tú tienes el control", "Du hast die Kontrolle", "Vous gardez le contrôle")}
                </h4>
                <p>
                  {tx(locale,
                    "Du kan radera alla dina sparade foton när som helst från ditt konto under \"Min hudresa\". Radering sker omedelbart och permanent. Du kan också använda analysen utan att spara någon data alls.",
                    "You can delete all your saved photos at any time from your account under \"My skin journey\". Deletion is immediate and permanent. You can also use the analysis without saving any data at all.",
                    "Puedes eliminar todas tus fotos guardadas en cualquier momento desde tu cuenta en «Mi viaje de piel». La eliminación es inmediata y permanente. También puedes usar el análisis sin guardar ningún dato.",
                    "Du kannst alle gespeicherten Fotos jederzeit in deinem Konto unter \"Meine Hautreise\" löschen. Die Löschung ist sofort und dauerhaft. Du kannst die Analyse auch nutzen, ohne Daten zu speichern.",
                    "Vous pouvez supprimer toutes vos photos enregistrées à tout moment depuis votre compte, sous « Mon parcours peau ». La suppression est immédiate et définitive. Vous pouvez aussi utiliser l'analyse sans enregistrer aucune donnée.")}
                </p>
              </div>

              <div className="rounded-xl bg-[#f5f5f7] px-4 py-3">
                <p className="text-[11px] text-[#766a62]">
                  {tx(locale,
                    "1753 SKINCARE behandlar personuppgifter i enlighet med GDPR (EU 2016/679). För frågor om din data, kontakta info@1753skin.com.",
                    "1753 SKINCARE processes personal data in accordance with GDPR (EU 2016/679). For questions about your data, contact info@1753skin.com.",
                    "1753 SKINCARE trata los datos personales conforme al RGPD (UE 2016/679). Para preguntas sobre tus datos, contacta con info@1753skin.com.",
                    "1753 SKINCARE verarbeitet personenbezogene Daten gemäß DSGVO (EU 2016/679). Bei Fragen zu deinen Daten kontaktiere info@1753skin.com.",
                    "1753 SKINCARE traite les données personnelles conformément au RGPD (UE 2016/679). Pour toute question sur vos données : info@1753skin.com.")}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowSecurity(false)}
              className="mt-6 w-full rounded-full bg-[#108474] py-3 text-sm font-semibold text-white transition-all hover:bg-[#0d6e62]"
            >
              {tx(locale, "Jag förstår", "Got it", "Entendido", "Verstanden", "Compris")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
