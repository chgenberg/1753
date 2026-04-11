"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  CONDITION_COLORS,
  CONDITION_LABELS_SV,
  CONDITION_LABELS_EN,
  type ZoneResult,
} from "./zones";
import { useLocale } from "@/providers/locale-provider";

interface FaceCanvasProps {
  imageSrc: string;
  results: ZoneResult[];
  className?: string;
}

const FACE_OVAL = { x: 0.125, y: 0.05, w: 0.75, h: 0.85 };

export function FaceCanvas({ imageSrc, results, className }: FaceCanvasProps) {
  const { locale } = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imgDims, setImgDims] = useState({ w: 0, h: 0 });
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const img = new Image();
    img.onload = () => setImgDims({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = imageSrc;
  }, [imageSrc]);

  useEffect(() => {
    if (!results.length) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    results.forEach((r, i) => {
      timers.push(
        setTimeout(() => {
          setRevealed((prev) => new Set(prev).add(r.zone.id));
        }, 300 + i * 280)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [results]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !imgDims.w) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 2;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    const scaleX = rect.width / imgDims.w;
    const displayH = imgDims.h * scaleX;

    const faceX = FACE_OVAL.x * rect.width;
    const faceY = FACE_OVAL.y * displayH;
    const faceW = FACE_OVAL.w * rect.width;
    const faceH = FACE_OVAL.h * displayH;

    results.forEach((r) => {
      if (!revealed.has(r.zone.id)) return;
      const { zone, topCondition, confidence } = r;
      if (confidence < 0.15) return;

      const [rx, ry, rw, rh] = zone.rect;
      const zoneCenterX = faceX + (rx + rw / 2) * faceW;
      const zoneCenterY = faceY + (ry + rh / 2) * faceH;

      const labelX = zone.anchor === "left" ? 16 : rect.width - 16;
      const labelY = zone.labelY * displayH;

      const color = CONDITION_COLORS[topCondition] || "#108474";

      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.6;
      ctx.setLineDash([5, 4]);

      ctx.beginPath();
      ctx.moveTo(zoneCenterX, zoneCenterY);
      ctx.lineTo(labelX, labelY);
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(zoneCenterX, zoneCenterY, 5, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.globalAlpha = 1;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(zoneCenterX, zoneCenterY, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      ctx.restore();
    });
  }, [results, revealed, imgDims]);

  const significantResults = results.filter((r) => r.confidence >= 0.15);

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc}
        alt={locale === "en" ? "Skin analysis" : "Hudanalys"}
        className="block h-auto w-full rounded-2xl"
        onLoad={(e) => {
          const el = e.currentTarget;
          setImgDims({ w: el.naturalWidth, h: el.naturalHeight });
        }}
      />

      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      {significantResults.map((r) => {
        const { zone, topCondition, confidence } = r;
        const isRevealed = revealed.has(zone.id);
        const color = CONDITION_COLORS[topCondition] || "#108474";
        const conditionLabel =
          (locale === "en" ? CONDITION_LABELS_EN : CONDITION_LABELS_SV)[topCondition] ||
          topCondition;

        const top = `${zone.labelY * 100}%`;
        const style: React.CSSProperties = {
          top,
          ...(zone.anchor === "left"
            ? { left: 0, paddingLeft: 6 }
            : { right: 0, paddingRight: 6, textAlign: "right" as const }),
        };

        return (
          <div
            key={zone.id}
            className={cn(
              "absolute transition-all duration-500 ease-out",
              isRevealed
                ? "translate-y-0 opacity-100"
                : zone.anchor === "left"
                ? "-translate-x-4 opacity-0"
                : "translate-x-4 opacity-0"
            )}
            style={style}
          >
            <div
              className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 shadow-sm backdrop-blur-md"
              style={{
                backgroundColor: `${color}18`,
                border: `1px solid ${color}30`,
              }}
            >
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              <div>
                <p className="text-xs font-semibold leading-tight" style={{ color }}>
                  {conditionLabel}
                </p>
                <p className="text-[10px] leading-tight text-[#515151]">
                  {(locale === "en" ? zone.labelEn : zone.labelSv)} — {Math.round(confidence * 100)}%
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
