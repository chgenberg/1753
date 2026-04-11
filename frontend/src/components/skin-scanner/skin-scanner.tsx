"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Camera,
  CheckSquare,
  ImagePlus,
  Loader2,
  RefreshCw,
  ScanFace,
  Shield,
  Square,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { loadModel, classifyRegion, type Prediction } from "./onnx-inference";
import { FaceCanvas } from "./face-canvas";
import {
  FACE_ZONES,
  CONDITION_LABELS_SV,
  CONDITION_COLORS,
  type ZoneResult,
} from "./zones";

export interface ScanSummary {
  overallTop: Prediction[];
  zones: ZoneResult[];
  consentGiven: boolean;
  imageBase64?: string;
}

type ScannerStep = "idle" | "loading-model" | "camera" | "captured" | "analyzing" | "results";

interface SkinScannerProps {
  onComplete?: (summary: ScanSummary) => void;
}

export function SkinScanner({ onComplete }: SkinScannerProps) {
  const [step, setStep] = useState<ScannerStep>("idle");
  const [modelProgress, setModelProgress] = useState(0);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [results, setResults] = useState<ZoneResult[]>([]);
  const [overallTop, setOverallTop] = useState<Prediction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
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
      setError("Kunde inte starta kameran. Kontrollera att du gett tillstånd.");
      setStep("idle");
    }
  }, []);

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
      const session = await loadModel((pct) => setModelProgress(pct));
      setStep("analyzing");
      setAnalyzingZone("Helhetsbild");

      const overallPreds = await classifyRegion(
        session,
        canvas,
        0,
        0,
        canvas.width,
        canvas.height
      );
      const faceW = canvas.width * 0.75;
      const faceH = canvas.height * 0.85;
      const faceX = (canvas.width - faceW) / 2;
      const faceY = canvas.height * 0.05;

      const zoneResults: ZoneResult[] = [];

      for (const zone of FACE_ZONES) {
        setAnalyzingZone(zone.labelSv);

        const [rx, ry, rw, rh] = zone.rect;
        const cropX = faceX + rx * faceW;
        const cropY = faceY + ry * faceH;
        const cropW = rw * faceW;
        const cropH = rh * faceH;

        const safeX = Math.max(0, Math.round(cropX));
        const safeY = Math.max(0, Math.round(cropY));
        const safeW = Math.min(Math.round(cropW), canvas.width - safeX);
        const safeH = Math.min(Math.round(cropH), canvas.height - safeY);

        if (safeW < 20 || safeH < 20) continue;

        const preds = await classifyRegion(session, canvas, safeX, safeY, safeW, safeH);

        zoneResults.push({
          zone,
          topCondition: preds[0].label,
          confidence: preds[0].probability,
          allPredictions: preds,
        });
      }

      setResults(zoneResults);
      setOverallTop(overallPreds.slice(0, 3));
      setStep("results");
      onComplete?.({
        overallTop: overallPreds.slice(0, 3),
        zones: zoneResults,
        consentGiven: consent,
        imageBase64: consent ? imageSrc ?? undefined : undefined,
      });
    } catch (err) {
      console.error("Analysis error:", err);
      setError("Något gick fel vid analysen. Försök igen.");
      setStep("captured");
    }
  }, [consent, imageSrc, onComplete]);

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
              Ansiktsskanning
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[#515151]">
              Ta en selfie eller ladda upp ett foto. Vår AI analyserar sex
              ansiktszoner direkt i din enhet — helt privat.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={startCamera}
              className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-full bg-[#108474] px-7 text-sm font-semibold text-white shadow-lg shadow-[#108474]/20 transition-all hover:bg-[#0d6e62] hover:shadow-xl active:scale-[0.97] sm:w-auto"
            >
              <Camera className="h-4.5 w-4.5" />
              Öppna kamera
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-full border-2 border-[#108474] px-7 text-sm font-semibold text-[#108474] transition-all hover:bg-[#108474]/5 active:scale-[0.97] sm:w-auto"
            >
              <ImagePlus className="h-4.5 w-4.5" />
              Ladda upp foto
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-[#766a62]">
            <Shield className="h-3.5 w-3.5" />
            <span>Din bild lämnar aldrig din enhet</span>
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
              Placera ditt ansikte inom ovalen
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={reset}
              className="inline-flex h-10 items-center gap-2 rounded-xl px-5 text-sm font-medium text-[#515151] transition-colors hover:bg-[#f5f5f7]"
            >
              <X className="h-4 w-4" />
              Avbryt
            </button>
            <button
              onClick={captureFromCamera}
              className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:scale-105 active:scale-90"
              aria-label="Ta foto"
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
            <img src={imageSrc} alt="Förhandsvisning" className="block h-auto w-full" />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}

          <button
            type="button"
            onClick={() => setConsent((c) => !c)}
            className={cn(
              "mx-auto flex max-w-sm items-start gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-all duration-300",
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
              Jag godkänner att min bild och mina svar får användas{" "}
              <span className="font-semibold text-[#1d1d1f]">anonymt</span> för
              att förbättra 1753 SKINCAREs AI-hudanalys. Ingen personlig
              information sparas.
            </span>
          </button>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={reset}
              className="inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-medium text-[#515151] transition-colors hover:bg-[#f5f5f7]"
            >
              <RefreshCw className="h-4 w-4" />
              Nytt foto
            </button>
            <button
              onClick={runAnalysis}
              className="inline-flex h-12 items-center gap-2.5 rounded-full bg-[#108474] px-8 text-sm font-semibold text-white shadow-lg shadow-[#108474]/20 transition-all hover:bg-[#0d6e62] hover:shadow-xl active:scale-[0.97]"
            >
              <ScanFace className="h-4.5 w-4.5" />
              Analysera min hy
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
              Laddar analysmodell
            </h3>
            <p className="mt-1 text-sm text-[#515151]">
              {modelProgress < 100
                ? `${modelProgress}% nedladdat`
                : "Förbereder modellen..."}
            </p>
          </div>
          <div className="mx-auto h-2 w-72 overflow-hidden rounded-full bg-[#e6e6e6]">
            <div
              className="h-full rounded-full bg-[#108474] transition-all duration-300 ease-out"
              style={{ width: `${modelProgress}%` }}
            />
          </div>
          <p className="text-xs text-[#766a62]">
            Första gången kräver nedladdning (87 MB). Cachelagras sedan lokalt.
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
              Analyserar din hy
            </h3>
            <p className="mt-2 text-sm text-[#515151]">
              Sex ansiktszoner granskas av vår AI
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
                Översiktlig bedömning
              </h4>
              <div className="flex flex-wrap gap-2">
                {overallTop.map((pred) => {
                  const color = CONDITION_COLORS[pred.label] || "#108474";
                  const labelSv =
                    CONDITION_LABELS_SV[pred.label] || pred.label;
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
                        {labelSv}
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
              Zon för zon
            </h4>
            <div className="grid gap-3 sm:grid-cols-2">
              {results
                .filter((r) => r.confidence >= 0.15)
                .map((r) => {
                  const color =
                    CONDITION_COLORS[r.topCondition] || "#108474";
                  const labelSv =
                    CONDITION_LABELS_SV[r.topCondition] || r.topCondition;
                  return (
                    <div
                      key={r.zone.id}
                      className="rounded-2xl border border-[#e6e6e6] bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-semibold text-[#1d1d1f]">
                          {r.zone.labelSv}
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
                        {labelSv}
                      </p>
                      {r.allPredictions.length > 1 &&
                        r.allPredictions[1].probability > 0.1 && (
                          <p className="mt-1 text-xs text-[#766a62]">
                            Även:{" "}
                            {CONDITION_LABELS_SV[r.allPredictions[1].label] ||
                              r.allPredictions[1].label}{" "}
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
              Din bild analyserades helt lokalt och har inte lämnat din enhet
            </div>

            {!consent && (
              <button
                type="button"
                onClick={() => setConsent(true)}
                className="mx-auto flex max-w-sm items-start gap-3 rounded-2xl border-2 border-transparent bg-[#f5f5f7] px-4 py-3 text-left transition-all hover:border-[#e6e6e6]"
              >
                <Square className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#766a62]/50" />
                <span className="text-xs leading-relaxed text-[#515151]">
                  Jag godkänner att min bild och mina svar får användas{" "}
                  <span className="font-semibold text-[#1d1d1f]">anonymt</span> för
                  att förbättra vår AI-hudanalys.
                </span>
              </button>
            )}

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={reset}
                className="inline-flex h-10 items-center gap-2 rounded-full border-2 border-[#108474] px-6 text-sm font-semibold text-[#108474] transition-all hover:bg-[#108474]/5 active:scale-[0.97]"
              >
                <RefreshCw className="h-4 w-4" />
                Ny skanning
              </button>
            </div>

            <p className="mx-auto max-w-sm text-[11px] leading-relaxed text-[#766a62]/80">
              Denna analys är framtagen med hjälp av artificiell intelligens och
              utgör inte medicinsk rådgivning, diagnos eller behandlingsrekommendation.
              Vid hudbesvär, kontakta alltid en legitimerad dermatolog eller läkare.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
