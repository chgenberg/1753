"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { Camera, Loader2, Upload, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { SectionWrapper } from "@/components/section-wrapper";
import { apiFetch } from "@/lib/api";
import { PRODUCTS } from "@/lib/products";

type Step = "intro" | "upload" | "analyzing" | "result";

interface AnalysisResult {
  analysis: string;
  recommendations: string[];
  productIds: string[];
}

export default function AnalysisPage() {
  const [step, setStep] = useState<Step>("intro");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [useCamera, setUseCamera] = useState(false);

  const handleFile = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setStep("upload");
  }, []);

  const startCamera = useCallback(async () => {
    setUseCamera(true);
    setStep("upload");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setError("Kunde inte starta kameran. Kontrollera dina behörigheter.");
    }
  }, []);

  const captureFromCamera = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    const url = canvas.toDataURL("image/jpeg");
    setPreviewUrl(url);
    const stream = video.srcObject as MediaStream;
    stream?.getTracks().forEach((t) => t.stop());
    setUseCamera(false);
  }, []);

  const analyze = useCallback(async () => {
    if (!previewUrl) return;
    setStep("analyzing");
    setError("");

    try {
      const data = await apiFetch<AnalysisResult>("/analysis", {
        method: "POST",
        body: JSON.stringify({ image: previewUrl }),
      });
      setResult(data);
      setStep("result");
    } catch {
      setError(
        "Analysen misslyckades. Försök med en annan bild eller prova igen."
      );
      setStep("upload");
    }
  }, [previewUrl]);

  const recommendedProducts = result?.productIds
    ? PRODUCTS.filter((p) => result.productIds.includes(p.id))
    : [];

  return (
    <>
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10">
          {step === "intro" && (
            <div className="mx-auto max-w-2xl text-center animate-fade-in">
              <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
                AI-driven
              </p>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Gratis hudanalys
              </h1>
              <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
                Vår AI analyserar din hud holistiskt — inte bara ytan, utan
                hela bilden. Du får personliga rekommendationer för både
                livsstil och produkter.
              </p>

              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Button
                  className="h-13 rounded-xl px-8 text-sm font-medium"
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Ladda upp foto
                </Button>
                <Button
                  variant="outline"
                  className="h-13 rounded-xl px-8 text-sm font-medium"
                  onClick={startCamera}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Använd kamera
                </Button>
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
            </div>
          )}

          {step === "upload" && (
            <div className="mx-auto max-w-lg text-center animate-fade-in">
              <h2 className="text-2xl font-bold tracking-tight">
                {useCamera ? "Ta ett foto" : "Förhandsgranska"}
              </h2>

              <div className="relative mt-6 overflow-hidden rounded-2xl bg-brand-50 shadow-xl shadow-brand-900/5 ring-1 ring-inset ring-black/5">
                {useCamera && !previewUrl ? (
                  <div className="relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full rounded-2xl"
                    />
                    <Button
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 h-12 rounded-xl px-8"
                      onClick={captureFromCamera}
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Ta foto
                    </Button>
                  </div>
                ) : previewUrl ? (
                  <div className="relative aspect-square">
                    <Image
                      src={previewUrl}
                      alt="Förhandsgranskning"
                      fill
                      className="object-cover rounded-2xl"
                    />
                  </div>
                ) : null}
              </div>

              {error && (
                <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              )}

              {previewUrl && (
                <div className="mt-6 flex flex-col gap-3">
                  <Button
                    className="h-12 rounded-xl text-sm font-medium"
                    onClick={analyze}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Analysera min hud
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => {
                      setPreviewUrl(null);
                      setStep("intro");
                    }}
                  >
                    Välj en annan bild
                  </Button>
                </div>
              )}
            </div>
          )}

          {step === "analyzing" && (
            <div className="mx-auto max-w-md text-center animate-fade-in">
              <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-brand-400" />
              <h2 className="text-2xl font-bold tracking-tight">
                Analyserar din hud...
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Vår AI granskar din hud holistiskt. Det tar bara några sekunder.
              </p>
            </div>
          )}

          {step === "result" && result && (
            <div className="mx-auto max-w-3xl animate-fade-in">
              <h2 className="text-3xl font-bold tracking-tight text-center">
                Din hudanalys
              </h2>

              <div className="mt-8 rounded-2xl border border-border p-6 md:p-8">
                <div
                  className="prose prose-sm max-w-none text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: result.analysis }}
                />
              </div>

              {result.recommendations.length > 0 && (
                <div className="mt-8">
                  <h3 className="mb-4 text-lg font-bold tracking-tight">
                    Rekommendationer
                  </h3>
                  <ul className="space-y-3">
                    {result.recommendations.map((rec, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 rounded-xl bg-brand-50/40 p-4 text-sm leading-relaxed"
                      >
                        <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-700" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {step === "result" && recommendedProducts.length > 0 && (
        <SectionWrapper alt>
          <h2 className="mb-8 text-3xl font-bold tracking-tight text-center">
            Rekommenderade produkter
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recommendedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </SectionWrapper>
      )}
    </>
  );
}
