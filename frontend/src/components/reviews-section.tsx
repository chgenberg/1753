"use client";

import { useEffect, useState, useCallback } from "react";
import { Star, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useLocale } from "@/providers/locale-provider";

interface Review {
  id: number;
  product_id: string;
  reviewer_name: string;
  rating: number;
  title: string;
  body: string;
  reply: string;
  verified: boolean;
  review_date: string;
  location: string;
}

interface ReviewStats {
  count: number;
  avg: number;
  distribution: number[];
}

interface ReviewsResponse {
  reviews: Review[];
  stats: ReviewStats;
}

function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const s = size === "lg" ? "h-5 w-5" : "h-3.5 w-3.5";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(s, i <= rating ? "fill-amber-400 text-amber-400" : "fill-brand-100 text-brand-100")}
        />
      ))}
    </div>
  );
}

function DistributionBar({ star, count, total }: { star: number; count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2 text-xs text-brand-500">
      <span className="w-3 text-right font-medium">{star}</span>
      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-brand-100">
        <div
          className="h-full rounded-full bg-amber-400 transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-6 text-right tabular-nums">{count}</span>
    </div>
  );
}

function ReviewCard({
  review,
  loc,
  t,
}: {
  review: Review;
  loc: string;
  t: (key: string, vars?: Record<string, string | number>) => string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const needsTruncation = review.body.length > 200;
  const displayBody = needsTruncation && !expanded ? review.body.slice(0, 200) + "..." : review.body;

  const date = review.review_date
    ? new Date(review.review_date).toLocaleDateString(loc, { year: "numeric", month: "short", day: "numeric" })
    : null;

  return (
    <div className="group rounded-2xl border border-brand-100 bg-white p-5 transition-all duration-300 hover:shadow-md hover:shadow-brand-900/5">
      <div className="mb-3 flex items-center justify-between">
        <Stars rating={review.rating} />
        {review.verified && (
          <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
            <CheckCircle2 className="h-3 w-3" />
            {t("reviewsUi.verifiedPurchase")}
          </span>
        )}
      </div>

      {review.title && (
        <h3 className="mb-1.5 text-[14px] font-semibold text-brand-900">{review.title}</h3>
      )}

      {review.body && (
        <p className="text-[13px] leading-relaxed text-brand-600">
          {displayBody}
          {needsTruncation && !expanded && (
            <button
              onClick={() => setExpanded(true)}
              className="ml-1 font-medium text-brand-900 hover:underline"
            >
              {t("reviewsUi.readMore")}
            </button>
          )}
        </p>
      )}

      {/* Reply toggle */}
      {review.reply && (
        <div className="mt-3">
          <button
            onClick={() => setShowReply(!showReply)}
            className="flex items-center gap-1.5 text-[11px] font-medium text-brand-400 transition-colors hover:text-brand-600"
          >
            <ChevronUp
              className={cn(
                "h-3 w-3 transition-transform duration-200",
                showReply ? "rotate-0" : "rotate-180"
              )}
            />
            {t("reviewsUi.replyFrom")}
          </button>

          <div
            className={cn(
              "overflow-hidden transition-all duration-300 ease-out",
              showReply ? "mt-2.5 max-h-96 opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <div className="rounded-xl bg-brand-50/60 px-4 py-3">
              <p className="text-[12px] leading-relaxed text-brand-600">{review.reply}</p>
            </div>
          </div>
        </div>
      )}

      {/* Author info */}
      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-brand-400">
        <span className="font-medium text-brand-500">{review.reviewer_name}</span>
        {review.location && (
          <>
            <span className="text-brand-200">&middot;</span>
            <span>{review.location}</span>
          </>
        )}
        {date && (
          <>
            <span className="text-brand-200">&middot;</span>
            <span>{date}</span>
          </>
        )}
      </div>
    </div>
  );
}

export function ReviewsSection({ productId }: { productId: string }) {
  const { t, locale } = useLocale();
  const loc = ({ sv: "sv-SE", en: "en-GB", es: "es-ES", de: "de-DE", fr: "fr-FR" }[locale] || "en-GB");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const PAGE_SIZE = 8;

  useEffect(() => {
    apiFetch<ReviewsResponse>(`/reviews/${productId}?limit=${PAGE_SIZE}&offset=0&locale=${locale}`)
      .then((data) => {
        setReviews(data.reviews);
        setStats(data.stats);
        setHasMore(data.reviews.length === PAGE_SIZE && data.stats.count > PAGE_SIZE);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [productId, locale]);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    apiFetch<ReviewsResponse>(`/reviews/${productId}?limit=${PAGE_SIZE}&offset=${reviews.length}&locale=${locale}`)
      .then((data) => {
        setReviews((prev) => [...prev, ...data.reviews]);
        setHasMore(data.reviews.length === PAGE_SIZE);
      })
      .catch(() => {})
      .finally(() => setLoadingMore(false));
  }, [productId, reviews.length, loadingMore, hasMore, locale]);

  if (loading) {
    return (
      <div className="mt-16 flex justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-200 border-t-brand-900" />
      </div>
    );
  }

  if (!stats || stats.count === 0) return null;

  return (
    <section className="mt-16 border-t border-brand-100 pt-12">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10">
        <h2 className="text-2xl font-bold tracking-tight text-brand-900 md:text-3xl">
          {t("reviewsUi.title")}
        </h2>

        {/* Stats summary */}
        <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-14">
          <div className="flex flex-col items-center sm:items-start">
            <div className="text-5xl font-bold tracking-tight text-brand-900">
              {stats.avg.toFixed(1)}
            </div>
            <div className="mt-1">
              <Stars rating={Math.round(stats.avg)} size="lg" />
            </div>
            <p className="mt-1.5 text-sm text-brand-400">
              {t("reviewsUi.basedOn", { count: stats.count.toLocaleString(loc) })}
            </p>
          </div>

          <div className="flex-1 space-y-2 sm:max-w-xs">
            {[5, 4, 3, 2, 1].map((star) => (
              <DistributionBar
                key={star}
                star={star}
                count={stats.distribution[star - 1]}
                total={stats.count}
              />
            ))}
          </div>
        </div>

        {/* Review cards */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} loc={loc} t={t} />
          ))}
        </div>

        {/* Load more */}
        {hasMore && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="flex items-center gap-2 rounded-full border border-brand-200 px-7 py-3 text-sm font-medium text-brand-600 transition-all hover:border-brand-400 hover:bg-brand-50 disabled:opacity-50"
            >
              {loadingMore ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              {t("reviewsUi.loadMore")}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
