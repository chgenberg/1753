"use client";

import { useEffect, useState, useCallback } from "react";
import { Download, X, Filter, Image as ImageIcon } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useLocale } from "@/providers/locale-provider";
import { cn } from "@/lib/utils";

function tx(locale: string, sv: string, en: string, es?: string, de?: string, fr?: string): string {
  if (locale === "sv") return sv;
  if (locale === "es") return es || en;
  if (locale === "de") return de || en;
  if (locale === "fr") return fr || en;
  return en;
}

interface GalleryImage {
  filename: string;
  url: string;
  type: string;
  product: string;
  size: number;
  created: string;
}

const TYPE_LABELS: Record<string, Record<string, string>> = {
  product: { sv: "Produkt", en: "Product", es: "Producto", de: "Produkt", fr: "Produit" },
  lifestyle: { sv: "Livsstil", en: "Lifestyle", es: "Estilo de vida", de: "Lifestyle", fr: "Style de vie" },
  mood: { sv: "Stämning", en: "Mood", es: "Ambiente", de: "Stimmung", fr: "Ambiance" },
};

export default function GalleryPage() {
  const { locale } = useLocale();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  useEffect(() => {
    apiFetch<{ images: GalleryImage[] }>("/gallery")
      .then((d) => setImages(d.images))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter ? images.filter((i) => i.type === filter) : images;
  const types = [...new Set(images.map((i) => i.type))];

  const handleDownload = useCallback(async (img: GalleryImage) => {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
      const resp = await fetch(`${apiBase}${img.url}`);
      const blob = await resp.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = img.filename;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch {
      window.open(img.url, "_blank");
    }
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-5 pb-24 pt-32">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#108474]/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-[#108474]">
          <ImageIcon className="h-3.5 w-3.5" />
          {tx(locale, "PRESSMATERIAL", "PRESS MATERIAL", "MATERIAL DE PRENSA", "PRESSEMATERIAL", "DOSSIER DE PRESSE")}
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-[#1d1d1f] sm:text-5xl" style={{ letterSpacing: "-0.02em" }}>
          {tx(locale, "Bildgalleri", "Image Gallery", "Galería de imágenes", "Bildergalerie", "Galerie d'images")}
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-[#515151]">
          {tx(
            locale,
            "Ladda ner bilder fritt for press, aterforrsaljare och sociala medier. Alla bilder ar fria att anvanda i samband med 1753 SKINCARE.",
            "Download images freely for press, retailers and social media. All images are free to use in connection with 1753 SKINCARE.",
            "Descarga imagenes libremente para prensa, distribuidores y redes sociales.",
            "Laden Sie Bilder frei herunter fur Presse, Einzelhandler und soziale Medien.",
            "Telechargez librement des images pour la presse, les revendeurs et les reseaux sociaux."
          )}
        </p>
      </div>

      {/* Filter */}
      {types.length > 1 && (
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setFilter(null)}
            className={cn(
              "rounded-full px-5 py-2 text-xs font-semibold transition-all duration-300",
              !filter
                ? "bg-[#1d1d1f] text-white shadow-lg"
                : "bg-[#f5f5f7] text-[#515151] hover:bg-[#e6e6e6]"
            )}
          >
            {tx(locale, "Alla", "All", "Todos", "Alle", "Tous")} ({images.length})
          </button>
          {types.map((type) => {
            const count = images.filter((i) => i.type === type).length;
            const label = TYPE_LABELS[type]?.[locale] || TYPE_LABELS[type]?.en || type;
            return (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={cn(
                  "rounded-full px-5 py-2 text-xs font-semibold transition-all duration-300",
                  filter === type
                    ? "bg-[#1d1d1f] text-white shadow-lg"
                    : "bg-[#f5f5f7] text-[#515151] hover:bg-[#e6e6e6]"
                )}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#e6e6e6] border-t-[#108474]" />
        </div>
      )}

      {/* Grid */}
      {!loading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((img, i) => (
            <div
              key={img.filename}
              className="group relative animate-gallery-pulse cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#108474]/10"
              style={{ animationDelay: `${i * 0.15}s` }}
              onClick={() => setLightbox(img)}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL || ""}${img.url}`}
                  alt={`1753 SKINCARE — ${img.product || img.type}`}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="p-4">
                  <p className="text-sm font-semibold text-white">{img.product || img.type}</p>
                  <p className="text-[11px] text-white/70">
                    {TYPE_LABELS[img.type]?.[locale] || img.type}
                  </p>
                </div>
              </div>

              {/* Pulse ring */}
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5 transition-all duration-300 group-hover:ring-[#108474]/20" />
            </div>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="py-20 text-center text-[#515151]">
          {tx(locale, "Inga bilder att visa.", "No images to display.", "No hay imágenes.", "Keine Bilder.", "Aucune image.")}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative mx-4 max-h-[85vh] max-w-3xl animate-lightbox-in overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL || ""}${lightbox.url}`}
              alt={`1753 SKINCARE — ${lightbox.product}`}
              className="max-h-[70vh] w-full object-contain"
            />
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-sm font-semibold text-[#1d1d1f]">{lightbox.product || lightbox.type}</p>
                <p className="text-[11px] text-[#515151]">
                  {TYPE_LABELS[lightbox.type]?.[locale] || lightbox.type} &middot;{" "}
                  {new Date(lightbox.created).toLocaleDateString(locale === "sv" ? "sv-SE" : locale === "de" ? "de-DE" : locale === "fr" ? "fr-FR" : locale === "es" ? "es-ES" : "en-GB")}
                </p>
              </div>
              <button
                onClick={() => handleDownload(lightbox)}
                className="flex items-center gap-2 rounded-full bg-[#108474] px-5 py-2.5 text-xs font-semibold text-white transition-all duration-300 hover:bg-[#0d6d60] hover:shadow-lg"
              >
                <Download className="h-3.5 w-3.5" />
                {tx(locale, "Ladda ner", "Download", "Descargar", "Herunterladen", "Telecharger")}
              </button>
            </div>

            <button
              onClick={() => setLightbox(null)}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-all duration-200 hover:bg-black/60"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes gallery-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16, 132, 116, 0); }
          50% { box-shadow: 0 0 0 4px rgba(16, 132, 116, 0.08); }
        }
        .animate-gallery-pulse {
          animation: gallery-pulse 3s ease-in-out infinite;
        }
        @keyframes lightbox-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-lightbox-in {
          animation: lightbox-in 0.25s cubic-bezier(0.25, 0.1, 0.25, 1);
        }
      `}</style>
    </main>
  );
}
