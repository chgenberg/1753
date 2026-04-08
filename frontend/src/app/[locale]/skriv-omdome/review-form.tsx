"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Star, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useLocale } from "@/providers/locale-provider";

interface TokenData {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  products: { id: string; name: string }[];
}

export default function ReviewForm() {
  const { t, path } = useLocale();
  const r = (key: string, vars?: Record<string, string | number>) => t(`reviewForm.${key}`, vars);
  const noToken = t("reviewForm.noToken");
  const tokenExpired = t("reviewForm.tokenExpired");
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
      setError(noToken);
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
      .catch(() => setError(tokenExpired))
      .finally(() => setLoading(false));
  }, [token, noToken, tokenExpired]);

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
      const msg = err instanceof Error ? err.message : t("common.error");
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  const ratingLabel =
    rating === 5
      ? r("rating5")
      : rating === 4
        ? r("rating4")
        : rating === 3
          ? r("rating3")
          : rating === 2
            ? r("rating2")
            : rating === 1
              ? r("rating1")
              : "";

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
        <h1 className="text-2xl font-bold text-brand-900">{r("invalidLinkTitle")}</h1>
        <p className="mt-3 text-brand-500">{error}</p>
        <Link
          href={path("products")}
          className="mt-6 inline-block rounded-full bg-[#108474] px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-[#0d6e62]"
        >
          {r("toProducts")}
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-emerald-500" />
        <h1 className="text-3xl font-bold tracking-tight text-brand-900">
          {r("thanksTitle")}
        </h1>
        <p className="mt-3 text-lg text-brand-500">
          {r("thanksSub")}
        </p>
        <Link
          href={path("products")}
          className="mt-8 inline-block rounded-full bg-[#108474] px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-[#0d6e62]"
        >
          {r("exploreMore")}
        </Link>
      </div>
    );
  }

  const firstName = tokenData?.customerName?.split(" ")[0] || r("you");

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 md:py-24">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-brand-900 md:text-4xl">
          {r("heading")}
        </h1>
        <p className="mt-3 text-lg text-brand-500">
          {r("greeting", { name: firstName })}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {tokenData?.products && tokenData.products.length > 1 && (
          <div>
            <label className="mb-3 block text-sm font-semibold text-brand-800">
              {r("pickProduct")}
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
            <p className="text-sm text-brand-500">{r("reviewFor")}</p>
            <p className="text-lg font-semibold text-brand-900">{tokenData.products[0].name}</p>
          </div>
        )}

        <div>
          <label className="mb-3 block text-sm font-semibold text-brand-800">
            {r("ratingLabel")}
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
          {rating > 0 && <p className="mt-2 text-sm text-brand-500">{ratingLabel}</p>}
        </div>

        <div>
          <label htmlFor="review-title" className="mb-2 block text-sm font-semibold text-brand-800">
            {r("titleLabel")} <span className="font-normal text-brand-400">{r("optional")}</span>
          </label>
          <input
            id="review-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={r("titlePlaceholder")}
            maxLength={200}
            className="w-full rounded-xl border border-brand-200 bg-white px-4 py-3 text-sm text-brand-900 outline-none transition-all placeholder:text-brand-300 focus:border-[#108474] focus:ring-2 focus:ring-[#108474]/20"
          />
        </div>

        <div>
          <label htmlFor="review-body" className="mb-2 block text-sm font-semibold text-brand-800">
            {r("bodyLabel")}
          </label>
          <textarea
            id="review-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={r("bodyPlaceholder")}
            rows={5}
            maxLength={2000}
            className="w-full resize-none rounded-xl border border-brand-200 bg-white px-4 py-3 text-sm leading-relaxed text-brand-900 outline-none transition-all placeholder:text-brand-300 focus:border-[#108474] focus:ring-2 focus:ring-[#108474]/20"
          />
          <p className="mt-1 text-right text-xs text-brand-300">{body.length}/2000</p>
        </div>

        <div className="rounded-2xl border border-brand-100 bg-brand-50/30 px-5 py-4">
          <div className="flex items-center gap-2 text-xs text-brand-400">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>{r("verifiedBlock")}</span>
          </div>
          <p className="mt-1 text-sm font-medium text-brand-700">
            {tokenData?.customerName}
          </p>
          <p className="text-xs text-brand-400">
            {r("orderPrefix")} {tokenData?.orderNumber}
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
              {r("submitting")}
            </span>
          ) : (
            r("submit")
          )}
        </button>
      </form>
    </div>
  );
}
