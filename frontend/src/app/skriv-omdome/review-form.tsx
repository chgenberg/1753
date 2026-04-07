"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Star, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface TokenData {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  products: { id: string; name: string }[];
}

export default function ReviewForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedProduct, setSelectedProduct] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Ingen giltig länk. Kontrollera att du klickat på rätt länk i mejlet.");
      setLoading(false);
      return;
    }
    apiFetch<TokenData>(`/reviews/verify-token/${token}`)
      .then((data) => {
        setTokenData(data);
        if (data.products?.length === 1) {
          setSelectedProduct(data.products[0].id);
        }
      })
      .catch(() => setError("Länken har gått ut eller är ogiltig. Kontakta oss om du behöver en ny."))
      .finally(() => setLoading(false));
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProduct || !rating) return;

    setSubmitting(true);
    setSubmitError("");
    try {
      await apiFetch("/reviews", {
        method: "POST",
        body: JSON.stringify({ token, productId: selectedProduct, rating, title, body }),
      });
      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Något gick fel";
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-400" />
        <h1 className="text-2xl font-bold text-brand-900">Ogiltig länk</h1>
        <p className="mt-3 text-brand-500">{error}</p>
        <Link
          href="/produkter"
          className="mt-6 inline-block rounded-full bg-[#108474] px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-[#0d6e62]"
        >
          Till produkterna
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-emerald-500" />
        <h1 className="text-3xl font-bold tracking-tight text-brand-900">
          Tack för ditt omdöme!
        </h1>
        <p className="mt-3 text-lg text-brand-500">
          Det betyder enormt mycket för oss och hjälper andra att våga ta steget.
        </p>
        <Link
          href="/produkter"
          className="mt-8 inline-block rounded-full bg-[#108474] px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-[#0d6e62]"
        >
          Utforska fler produkter
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 md:py-24">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-brand-900 md:text-4xl">
          Berätta om din upplevelse
        </h1>
        <p className="mt-3 text-lg text-brand-500">
          Hej {tokenData?.customerName?.split(" ")[0] || "du"}! Dina ord hjälper andra att hitta rätt.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Product selection */}
        {tokenData?.products && tokenData.products.length > 1 && (
          <div>
            <label className="mb-3 block text-sm font-semibold text-brand-800">
              Vilken produkt vill du recensera?
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              {tokenData.products.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedProduct(p.id)}
                  className={cn(
                    "rounded-2xl border-2 px-5 py-4 text-left text-sm font-medium transition-all",
                    selectedProduct === p.id
                      ? "border-[#108474] bg-emerald-50/50 text-brand-900"
                      : "border-brand-100 text-brand-600 hover:border-brand-300"
                  )}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {tokenData?.products?.length === 1 && (
          <div className="rounded-2xl border border-brand-100 bg-brand-50/30 px-5 py-4">
            <p className="text-sm text-brand-500">Recension för</p>
            <p className="text-lg font-semibold text-brand-900">{tokenData.products[0].name}</p>
          </div>
        )}

        {/* Star rating */}
        <div>
          <label className="mb-3 block text-sm font-semibold text-brand-800">
            Ditt betyg
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="group rounded-lg p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={cn(
                    "h-10 w-10 transition-colors",
                    (hoverRating || rating) >= star
                      ? "fill-amber-400 text-amber-400"
                      : "fill-brand-100 text-brand-200 group-hover:text-amber-200"
                  )}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="mt-2 text-sm text-brand-500">
              {rating === 5 && "Fantastiskt!"}
              {rating === 4 && "Riktigt bra!"}
              {rating === 3 && "Helt okej"}
              {rating === 2 && "Kunde vara bättre"}
              {rating === 1 && "Inte nöjd"}
            </p>
          )}
        </div>

        {/* Title */}
        <div>
          <label htmlFor="review-title" className="mb-2 block text-sm font-semibold text-brand-800">
            Rubrik <span className="font-normal text-brand-400">(valfritt)</span>
          </label>
          <input
            id="review-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Sammanfatta din upplevelse i en mening"
            maxLength={200}
            className="w-full rounded-xl border border-brand-200 bg-white px-4 py-3 text-sm text-brand-900 outline-none transition-all placeholder:text-brand-300 focus:border-[#108474] focus:ring-2 focus:ring-[#108474]/20"
          />
        </div>

        {/* Body */}
        <div>
          <label htmlFor="review-body" className="mb-2 block text-sm font-semibold text-brand-800">
            Ditt omdöme
          </label>
          <textarea
            id="review-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Berätta hur produkten fungerar för dig. Hur mår din hud? Vad tycker du om konsistensen, doften? Skulle du rekommendera den?"
            rows={5}
            maxLength={2000}
            className="w-full resize-none rounded-xl border border-brand-200 bg-white px-4 py-3 text-sm leading-relaxed text-brand-900 outline-none transition-all placeholder:text-brand-300 focus:border-[#108474] focus:ring-2 focus:ring-[#108474]/20"
          />
          <p className="mt-1 text-right text-xs text-brand-300">{body.length}/2000</p>
        </div>

        {/* Pre-filled info */}
        <div className="rounded-2xl border border-brand-100 bg-brand-50/30 px-5 py-4">
          <div className="flex items-center gap-2 text-xs text-brand-400">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>Verifierat köp</span>
          </div>
          <p className="mt-1 text-sm font-medium text-brand-700">
            {tokenData?.customerName}
          </p>
          <p className="text-xs text-brand-400">
            Order {tokenData?.orderNumber}
          </p>
        </div>

        {submitError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {submitError}
          </div>
        )}

        <button
          type="submit"
          disabled={!selectedProduct || !rating || submitting}
          className="w-full rounded-full bg-[#108474] px-8 py-4 text-base font-semibold text-white transition-all hover:bg-[#0d6e62] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Skickar...
            </span>
          ) : (
            "Skicka omdöme"
          )}
        </button>
      </form>
    </div>
  );
}
