"use client";

import { useCallback, useEffect, useState } from "react";
import { authFetch } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import { Star, MessageSquare, Trash2, Search, ChevronLeft, ChevronRight, X } from "lucide-react";

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

interface Stats {
  totalCount: number;
  perProduct: Record<string, { count: number; avg: number }>;
}

const PRODUCT_NAMES: Record<string, string> = {
  "duo-kit": "DUO-kit",
  "duo-ta-da": "DUO-kit + TA-DA Serum",
  "ta-da-serum": "TA-DA Serum",
  "au-naturel-makeup-remover": "Au Naturel Makeup Remover",
  "fungtastic-mushroom-extract": "Fungtastic Mushroom Extract",
};

const PAGE_SIZE = 20;

export default function AdminRecensionerPage() {
  const { token } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const [filterProduct, setFilterProduct] = useState("");
  const [filterRating, setFilterRating] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [replyingId, setReplyingId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchReviews = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: String(PAGE_SIZE),
        offset: String(page * PAGE_SIZE),
      });
      if (filterProduct) params.set("productId", filterProduct);
      if (filterRating) params.set("rating", filterRating);
      if (searchQuery) params.set("search", searchQuery);

      const data = await authFetch<{ reviews: Review[]; total: number }>(
        `/admin/reviews?${params}`, token
      );
      setReviews(data.reviews);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token, page, filterProduct, filterRating, searchQuery]);

  const fetchStats = useCallback(async () => {
    if (!token) return;
    try {
      const data = await authFetch<Stats>("/admin/reviews/stats", token);
      setStats(data);
    } catch {}
  }, [token]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);
  useEffect(() => { fetchStats(); }, [fetchStats]);

  async function handleSaveReply(reviewId: number) {
    if (!token) return;
    setSaving(true);
    try {
      await authFetch(`/admin/reviews/${reviewId}/reply`, token, {
        method: "PUT",
        body: JSON.stringify({ reply: replyText }),
      });
      setReplyingId(null);
      setReplyText("");
      fetchReviews();
    } catch (err) {
      alert("Kunde inte spara svar");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(reviewId: number) {
    if (!token || !confirm("Vill du verkligen ta bort denna recension?")) return;
    try {
      await authFetch(`/admin/reviews/${reviewId}`, token, { method: "DELETE" });
      fetchReviews();
      fetchStats();
    } catch {
      alert("Kunde inte ta bort recensionen");
    }
  }

  function openReply(review: Review) {
    setReplyingId(review.id);
    setReplyText((review.reply || "").replace(/^\[UTKAST\]\s*/, ""));
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  function Stars({ rating }: { rating: number }) {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <Star key={i} className={`h-3.5 w-3.5 ${i <= rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1d1d1f]">Recensioner</h1>
        {stats && (
          <span className="text-sm text-[#515151]">{stats.totalCount} totalt</span>
        )}
      </div>

      {/* Stats cards */}
      {stats && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {Object.entries(stats.perProduct)
            .sort((a, b) => b[1].count - a[1].count)
            .map(([pid, s]) => (
            <div key={pid} className="rounded-2xl border border-[#e6e6e6] bg-white p-4">
              <p className="text-xs font-medium text-[#766a62] truncate">{PRODUCT_NAMES[pid] || pid}</p>
              <p className="mt-1 text-2xl font-bold text-[#1d1d1f]">{s.avg}</p>
              <p className="text-xs text-[#515151]">{s.count} omdömen</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#766a62]" />
          <input
            type="text"
            placeholder="Sök namn, rubrik eller text..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setPage(0); }}
            className="w-full rounded-xl border border-[#e6e6e6] bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#108474] focus:ring-2 focus:ring-[#108474]/20"
          />
        </div>
        <select
          value={filterProduct}
          onChange={e => { setFilterProduct(e.target.value); setPage(0); }}
          className="rounded-xl border border-[#e6e6e6] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#108474]"
        >
          <option value="">Alla produkter</option>
          {Object.entries(PRODUCT_NAMES).map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>
        <select
          value={filterRating}
          onChange={e => { setFilterRating(e.target.value); setPage(0); }}
          className="rounded-xl border border-[#e6e6e6] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#108474]"
        >
          <option value="">Alla betyg</option>
          {[5, 4, 3, 2, 1].map(r => (
            <option key={r} value={r}>{r} stjärnor</option>
          ))}
        </select>
      </div>

      {/* Review list */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#e6e6e6] border-t-[#108474]" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-2xl border border-[#e6e6e6] bg-white p-12 text-center">
          <p className="text-[#515151]">Inga recensioner hittades</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map(review => (
            <div key={review.id} className="rounded-2xl border border-[#e6e6e6] bg-white p-5 transition-all hover:shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Stars rating={review.rating} />
                    <span className="text-sm font-semibold text-[#1d1d1f]">{review.reviewer_name}</span>
                    {review.verified && (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600">
                        Verifierat köp
                      </span>
                    )}
                    <span className="text-xs text-[#766a62]">
                      {PRODUCT_NAMES[review.product_id] || review.product_id}
                    </span>
                  </div>

                  {review.title && (
                    <p className="mt-2 text-sm font-semibold text-[#1d1d1f]">{review.title}</p>
                  )}
                  {review.body && (
                    <p className="mt-1 text-sm text-[#515151] leading-relaxed">{review.body}</p>
                  )}

                  {review.reply && replyingId !== review.id && (
                    <div className={`mt-3 rounded-xl border-l-2 py-2.5 pl-3.5 pr-3 ${review.reply.startsWith("[UTKAST]") ? "border-amber-400 bg-amber-50/60" : "border-emerald-500 bg-[#f5f5f7]"}`}>
                      <p className="text-[11px] font-semibold text-[#1d1d1f] mb-1">
                        {review.reply.startsWith("[UTKAST]") ? "AI-utkast (väntar på godkännande):" : "Ditt svar:"}
                      </p>
                      <p className="text-xs text-[#515151] leading-relaxed">
                        {review.reply.replace(/^\[UTKAST\]\s*/, "")}
                      </p>
                    </div>
                  )}

                  {replyingId === review.id && (
                    <div className="mt-3 space-y-2">
                      <textarea
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder="Skriv ditt svar till kunden..."
                        rows={3}
                        className="w-full resize-none rounded-xl border border-[#e6e6e6] bg-white px-4 py-3 text-sm outline-none focus:border-[#108474] focus:ring-2 focus:ring-[#108474]/20"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveReply(review.id)}
                          disabled={saving}
                          className="rounded-full bg-[#108474] px-5 py-2 text-xs font-semibold text-white hover:bg-[#0d6e62] disabled:opacity-50"
                        >
                          {saving ? "Sparar..." : "Spara svar"}
                        </button>
                        <button
                          onClick={() => { setReplyingId(null); setReplyText(""); }}
                          className="rounded-full border border-[#e6e6e6] px-5 py-2 text-xs font-medium text-[#515151] hover:bg-[#f5f5f7]"
                        >
                          Avbryt
                        </button>
                        {review.reply && (
                          <button
                            onClick={() => { setReplyText(""); handleSaveReply(review.id); }}
                            className="rounded-full border border-red-200 px-5 py-2 text-xs font-medium text-red-500 hover:bg-red-50"
                          >
                            Ta bort svar
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-2 flex items-center gap-3 text-[11px] text-[#766a62]">
                    {review.location && <span>{review.location}</span>}
                    {review.review_date && (
                      <span>{new Date(review.review_date).toLocaleDateString("sv-SE")}</span>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 gap-1.5">
                  <button
                    onClick={() => replyingId === review.id ? (setReplyingId(null), setReplyText("")) : openReply(review)}
                    className={`rounded-lg p-2 transition-colors ${replyingId === review.id ? "bg-[#108474] text-white" : "text-[#766a62] hover:bg-[#f5f5f7] hover:text-[#108474]"}`}
                    title="Svara"
                  >
                    {replyingId === review.id ? <X className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="rounded-lg p-2 text-[#766a62] transition-colors hover:bg-red-50 hover:text-red-500"
                    title="Ta bort"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#515151]">
            Visar {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} av {total}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="rounded-lg border border-[#e6e6e6] p-2 text-[#515151] hover:bg-[#f5f5f7] disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= totalPages - 1}
              className="rounded-lg border border-[#e6e6e6] p-2 text-[#515151] hover:bg-[#f5f5f7] disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
