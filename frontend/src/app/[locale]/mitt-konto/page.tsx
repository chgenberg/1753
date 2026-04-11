"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  CalendarClock,
  Camera,
  Gift,
  Heart,
  LayoutDashboard,
  Lock,
  LogOut,
  MapPin,
  Package,
  RefreshCcw,
  Settings,
  ShoppingBag,
  Star,
  Sparkles,
  Trash2,
  TrendingUp,
  User,
  Loader2,
  Save,
  Minus,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { useCart } from "@/providers/cart-provider";
import { useLocale } from "@/providers/locale-provider";
import { authFetch, API_URL } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/notification";
import type { Locale } from "@/lib/i18n/types";
import {
  PRODUCTS,
  getProduct,
  productDisplayName,
  productShortDesc,
  productPrice,
} from "@/lib/products";
import { formatPrice } from "@/lib/currency";
import { LineChartComponent, ChartCard, ScoreRing, ProgressBar } from "@/components/charts";

type View =
  | "oversikt"
  | "hudresa"
  | "ordrar"
  | "rutin"
  | "formaner"
  | "prenumerationer"
  | "onskelista"
  | "installningar";

interface DashboardStats {
  loyaltyPoints: number;
  tier: string;
  orderCount: number;
  memberSince: string;
}

interface Order {
  id: number;
  order_number: string;
  status: string;
  payment_status: string;
  items: { id: string; name: string; qty?: number; quantity?: number; price: number }[];
  total_amount: number;
  shipping_cost: number;
  created_at: string;
}

interface SkinAnalysis {
  id: number;
  score: number | null;
  answers: Record<string, unknown> | null;
  result: {
    summary?: string;
    lifestyle?: { area: string; tip: string; impact: string }[];
    products?: { id: string; reason: string }[];
    avoid?: string[];
  } | null;
  full_text: string;
  created_at: string;
}

interface FaceSnapshot {
  id: number;
  analysis_id: number | null;
  created_at: string;
  score: number | null;
}

interface Address {
  id: number;
  label: string;
  address: string;
  zip: string;
  city: string;
  is_default: boolean;
}

interface WishlistItem {
  product_id: string;
  created_at: string;
}

interface Recommendation {
  id: string;
  name: string;
  shortDesc: string;
  price: number;
}

const SIDEBAR_ITEMS: { id: View; icon: typeof LayoutDashboard }[] = [
  { id: "oversikt", icon: LayoutDashboard },
  { id: "hudresa", icon: TrendingUp },
  { id: "ordrar", icon: Package },
  { id: "rutin", icon: CalendarClock },
  { id: "formaner", icon: Gift },
  { id: "prenumerationer", icon: RefreshCcw },
  { id: "onskelista", icon: Heart },
  { id: "installningar", icon: Settings },
];

const ORDER_STATUSES = ["pending", "confirmed", "fulfilled", "partial", "paid"] as const;
type OrderStatusKey = (typeof ORDER_STATUSES)[number];

function orderStatusClass(status: string): string {
  const s: OrderStatusKey = ORDER_STATUSES.includes(status as OrderStatusKey)
    ? (status as OrderStatusKey)
    : "pending";
  switch (s) {
    case "pending":
      return "bg-amber-50 text-amber-700";
    case "confirmed":
      return "bg-blue-50 text-blue-700";
    case "fulfilled":
      return "bg-green-50 text-green-700";
    case "partial":
      return "bg-orange-50 text-orange-700";
    case "paid":
      return "bg-green-50 text-green-700";
    default:
      return "bg-amber-50 text-amber-700";
  }
}

function normalizeOrderStatus(status: string): OrderStatusKey {
  return ORDER_STATUSES.includes(status as OrderStatusKey) ? (status as OrderStatusKey) : "pending";
}

const TIER_THRESHOLDS: Record<string, { next: string; points: number }> = {
  Brons: { next: "Silver", points: 2000 },
  Silver: { next: "Guld", points: 5000 },
  Guld: { next: "Platina", points: 10000 },
  Platina: { next: "", points: 10000 },
};

const TIER_DISCOUNTS: Record<string, number> = {
  Brons: 0,
  Silver: 5,
  Guld: 8,
  Platina: 12,
};

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-xl bg-red-50 px-5 py-4 text-sm text-red-700">
      {message}
    </div>
  );
}

function relativeDate(
  dateStr: string,
  locale: Locale,
  tfn: (key: string, vars?: Record<string, string | number>) => string
): string {
  const loc = locale === "en" ? "en-GB" : "sv-SE";
  const now = new Date();
  const then = new Date(dateStr);
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays === 0) return tfn("accountDash.relativeToday");
  if (diffDays === 1) return tfn("accountDash.relativeYesterday");
  if (diffDays < 7) return tfn("accountDash.relativeDaysAgo", { n: diffDays });
  if (diffDays < 30) return tfn("accountDash.relativeWeeksAgo", { n: Math.floor(diffDays / 7) });
  return new Date(dateStr).toLocaleDateString(loc, { year: "numeric", month: "long", day: "numeric" });
}

/* ─────────────────── OVERVIEW ─────────────────── */

const TIER_CARD_DEFS = [
  { name: "Brons" as const, threshold: 0, perkKey: "tierBronzePerk" as const },
  { name: "Silver" as const, threshold: 2000, perkKey: "tierSilverPerk" as const },
  { name: "Guld" as const, threshold: 5000, perkKey: "tierGoldPerk" as const },
  { name: "Platina" as const, threshold: 10000, perkKey: "tierPlatPerk" as const },
];

function OverviewView({
  stats,
  loading,
  error,
  userName,
  recommendations,
  recsLoading,
}: {
  stats: DashboardStats | null;
  loading: boolean;
  error: string;
  userName: string;
  recommendations: Recommendation[];
  recsLoading: boolean;
}) {
  const { t, path, locale } = useLocale();
  const loc = locale === "en" ? "en-GB" : "sv-SE";
  const d = (key: string, vars?: Record<string, string | number>) => t(`accountDash.${key}`, vars);
  const { addItem } = useCart();
  const { showToast } = useToast();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-brand-400" />
      </div>
    );
  }

  const tier = stats?.tier ?? "Brons";
  const points = stats?.loyaltyPoints ?? 0;
  const info = TIER_THRESHOLDS[tier] || TIER_THRESHOLDS.Brons;
  const progress = tier === "Platina" ? 100 : Math.min(100, Math.round((points / info.points) * 100));
  const remaining = Math.max(0, info.points - points);
  const discount = TIER_DISCOUNTS[tier] || 0;
  const firstName = userName?.split(" ")[0] || d("overviewGuest");

  return (
    <div className="space-y-8">
      {error && <ErrorBanner message={error} />}

      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {d("overviewGreeting", { name: firstName })}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t(`account.tier.${tier}`)}
          {t("account.memberSuffix")} &middot; {points.toLocaleString(loc)} {t("account.pointsWord")}
          {discount > 0 && (
            <>
              {" "}
              &middot; {discount}% {d("discountSuffix")}
            </>
          )}
        </p>
        {info.next && (
          <div className="mt-4 max-w-md">
            <ProgressBar
              value={progress}
              max={100}
              color="#1C1410"
              label={t(`account.tier.${tier}`)}
              valueLabel={t(`account.tier.${info.next}`)}
              size="sm"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              {d("progressPointsLeft", {
                points: remaining.toLocaleString(loc),
                tier: t(`account.tier.${info.next}`),
              })}
            </p>
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl bg-brand-50 p-6 sm:col-span-2">
          <Package className="mb-2 h-5 w-5 text-brand-700" />
          <p className="text-3xl font-bold tracking-tight">{String(stats?.orderCount ?? 0)}</p>
          <p className="text-sm text-brand-600">{d("orders")}</p>
        </div>
        <div className="rounded-xl bg-brand-50 p-6 sm:col-span-2">
          <Star className="mb-2 h-5 w-5 text-brand-700" />
          <p className="text-3xl font-bold tracking-tight">{points.toLocaleString(loc)}</p>
          <p className="text-sm text-brand-600">{d("points")}</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-5">
        <h3 className="mb-3 text-sm font-bold text-brand-900">{t("account.loyaltyTitle")}</h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {TIER_CARD_DEFS.map((row) => {
            const isActive = row.name === tier;
            const thresholdLabel = row.threshold.toLocaleString(loc);
            return (
              <div
                key={row.name}
                className={cn(
                  "rounded-lg px-3.5 py-3 transition-all",
                  isActive
                    ? "bg-brand-900 text-white ring-2 ring-brand-900 ring-offset-2"
                    : "bg-brand-50 text-brand-700"
                )}
              >
                <p className={cn("text-xs font-bold", isActive ? "text-white" : "text-brand-900")}>
                  {t(`account.tier.${row.name}`)}
                </p>
                <p className={cn("mt-0.5 text-[11px]", isActive ? "text-white/80" : "text-brand-500")}>
                  {t(`account.${row.perkKey}`)}
                </p>
                <p className={cn("mt-1 text-[10px]", isActive ? "text-white/60" : "text-brand-400")}>
                  {thresholdLabel} {t("account.tierPointsSuffix")}
                </p>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">{t("account.loyaltyExplainer")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-white p-5">
          <Gift className="mb-2 h-4 w-4 text-brand-400" />
          <p className="text-lg font-bold">{t(`account.tier.${tier}`)}</p>
          <p className="text-xs text-muted-foreground">{t("account.level")}</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-5">
          <TrendingUp className="mb-2 h-4 w-4 text-brand-400" />
          <p className="text-lg font-bold">
            {stats?.memberSince
              ? new Date(stats.memberSince).toLocaleDateString(loc, { year: "numeric", month: "short" })
              : "-"}
          </p>
          <p className="text-xs text-muted-foreground">{t("account.memberSince")}</p>
        </div>
      </div>

      {!recsLoading && recommendations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-base font-bold tracking-tight">{d("recommendedForYou")}</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {recommendations.map((rec) => {
              const prod = PRODUCTS.find((p) => p.id === rec.id);
              const displayName = prod ? productDisplayName(prod, locale) : rec.name;
              const short = prod ? productShortDesc(prod, locale) : rec.shortDesc;
              return (
                <div
                  key={rec.id}
                  className="flex flex-col justify-between rounded-xl border border-border bg-white p-4 transition-all hover:shadow-md"
                >
                  <div>
                    <p className="text-sm font-bold">{displayName}</p>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{short}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-bold">
                      {formatPrice(prod ? productPrice(prod, locale) : rec.price, locale)}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        addItem(prod?.id || rec.id, 1);
                        showToast(d("added", { name: displayName }), "success");
                      }}
                      className="rounded-lg bg-brand-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-800"
                    >
                      {d("addToCart")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <a
          href={path("products")}
          className="rounded-xl border border-brand-200 px-4 py-2.5 text-sm font-medium text-brand-900 transition-colors hover:bg-brand-50"
        >
          {d("newOrder")}
        </a>
        <a
          href={path("skinAnalysis")}
          className="rounded-xl border border-brand-200 px-4 py-2.5 text-sm font-medium text-brand-900 transition-colors hover:bg-brand-50"
        >
          {d("startAnalysis")}
        </a>
      </div>
    </div>
  );
}

/* ─────────────────── SKIN JOURNEY ─────────────────── */

function ScoreLineChart({ scores, locale }: { scores: { score: number; date: string }[]; locale: string }) {
  if (scores.length < 2) return null;
  const loc = locale === "en" ? "en-GB" : "sv-SE";
  const data = scores
    .slice()
    .reverse()
    .map((s) => ({
      label: new Date(s.date).toLocaleDateString(loc, { day: "numeric", month: "short" }),
      score: s.score,
    }));
  return (
    <LineChartComponent
      data={data}
      dataKey="score"
      height={180}
      valueFormatter={(v) => `${v} / 100`}
    />
  );
}

function SnapshotImage({ id, token, className }: { id: number; token: string; className?: string }) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    const url = `${API_URL}/face-snapshots/${id}/image`;
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.blob() : null))
      .then((blob) => { if (blob) setSrc(URL.createObjectURL(blob)); })
      .catch(() => {});
    return () => { if (src) URL.revokeObjectURL(src); };
  }, [id, token]);
  if (!src) return null;
  return <img src={src} alt="" className={cn("rounded-xl object-cover", className)} />;
}

function SkinJourneyView({ token }: { token: string }) {
  const { t, path, locale } = useLocale();
  const loc = locale === "en" ? "en-GB" : "sv-SE";
  const d = (key: string, vars?: Record<string, string | number>) => t(`accountDash.${key}`, vars);
  const [analyses, setAnalyses] = useState<SkinAnalysis[]>([]);
  const [snapshots, setSnapshots] = useState<FaceSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [compareMode, setCompareMode] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    Promise.all([
      authFetch<SkinAnalysis[]>("/analysis/history", token).catch(() => [] as SkinAnalysis[]),
      authFetch<FaceSnapshot[]>("/face-snapshots", token).catch(() => [] as FaceSnapshot[]),
    ]).then(([a, s]) => {
      setAnalyses(a);
      setSnapshots(s);
    }).finally(() => setLoading(false));
  }, [token]);

  const deleteAllSnapshots = async () => {
    if (!confirm(locale === "en" ? "Delete all saved photos? This cannot be undone." : "Radera alla sparade foton? Detta kan inte ångras.")) return;
    setDeletingAll(true);
    try {
      await authFetch("/face-snapshots", token, { method: "DELETE" });
      setSnapshots([]);
      showToast(locale === "en" ? "All photos deleted" : "Alla foton raderade");
    } catch {
      showToast(locale === "en" ? "Could not delete photos" : "Kunde inte radera foton");
    } finally {
      setDeletingAll(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-brand-400" />
      </div>
    );
  }

  if (analyses.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold tracking-tight">{d("skinJourneyTitle")}</h2>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100/50 p-8 md:p-12">
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-brand-200/30" />
          <div className="absolute -bottom-12 -left-6 h-32 w-32 rounded-full bg-brand-200/20" />
          <div className="relative z-10 max-w-md">
            <BarChart3 className="mb-4 h-8 w-8 text-brand-700" />
            <h3 className="text-xl font-bold tracking-tight text-brand-900">
              {d("skinJourneyEmptyTitle")}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-brand-600">{d("skinJourneyEmptyBody")}</p>
            <a href={path("skinAnalysis")}>
              <Button className="mt-6 h-12 rounded-xl px-8">{d("firstAnalysisCta")}</Button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  const scoredAnalyses = analyses
    .filter((a) => a.score !== null)
    .map((a) => ({ score: a.score as number, date: a.created_at }));
  const latestScore = scoredAnalyses[0]?.score ?? null;
  const oldestScore = scoredAnalyses.length > 1 ? scoredAnalyses[scoredAnalyses.length - 1].score : null;
  const diff = latestScore !== null && oldestScore !== null ? latestScore - oldestScore : null;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold tracking-tight">{d("skinJourneyTitle")}</h2>
      <p className="text-sm text-muted-foreground">
        {analyses.length === 1
          ? d("analysesDoneOne", { count: analyses.length })
          : d("analysesDone", { count: analyses.length })}
      </p>

      <div className="flex flex-wrap items-center gap-6">
        {latestScore !== null && (
          <div className="rounded-xl bg-brand-50 p-6 text-center">
            <p className="text-3xl font-bold text-brand-900">{latestScore}</p>
            <p className="text-xs text-brand-600">{d("latestScore")}</p>
          </div>
        )}
        {diff !== null && diff !== 0 && (
          <div className={cn("rounded-xl p-6 text-center", diff > 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-3xl font-bold", diff > 0 ? "text-green-700" : "text-red-700")}>
              {diff > 0 ? "+" : ""}
              {diff}
            </p>
            <p className={cn("text-xs", diff > 0 ? "text-green-600" : "text-red-600")}>{d("changeLabel")}</p>
          </div>
        )}
      </div>

      {scoredAnalyses.length >= 2 && (
        <ChartCard title={d("skinScoreOverTime")} subtitle={d("skinScoreChartSub", { count: scoredAnalyses.length })}>
          <ScoreLineChart scores={scoredAnalyses} locale={locale} />
        </ChartCard>
      )}

      {/* Face snapshot gallery */}
      {snapshots.length > 0 && (
        <div className="rounded-2xl border border-border bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4 text-brand-500" />
              <h3 className="text-sm font-bold text-brand-900">
                {locale === "en" ? "Your skin over time" : "Din hud över tid"}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {snapshots.length >= 2 && (
                <button
                  onClick={() => setCompareMode(!compareMode)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all",
                    compareMode
                      ? "bg-[#108474] text-white"
                      : "bg-brand-50 text-brand-600 hover:bg-brand-100"
                  )}
                >
                  {locale === "en" ? "Compare" : "Jämför"}
                </button>
              )}
              <button
                onClick={deleteAllSnapshots}
                disabled={deletingAll}
                className="rounded-full p-1.5 text-brand-400 transition-colors hover:bg-red-50 hover:text-red-500"
                title={locale === "en" ? "Delete all photos" : "Radera alla foton"}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {compareMode && snapshots.length >= 2 ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <SnapshotImage id={snapshots[snapshots.length - 1].id} token={token} className="aspect-square w-full" />
                  <p className="mt-1.5 text-[11px] text-brand-500">
                    {new Date(snapshots[snapshots.length - 1].created_at).toLocaleDateString(loc, { month: "short", day: "numeric" })}
                    {snapshots[snapshots.length - 1].score !== null && (
                      <span className="ml-1 font-semibold text-brand-900">{snapshots[snapshots.length - 1].score}p</span>
                    )}
                  </p>
                </div>
                <div className="text-center">
                  <SnapshotImage id={snapshots[0].id} token={token} className="aspect-square w-full" />
                  <p className="mt-1.5 text-[11px] text-brand-500">
                    {new Date(snapshots[0].created_at).toLocaleDateString(loc, { month: "short", day: "numeric" })}
                    {snapshots[0].score !== null && (
                      <span className="ml-1 font-semibold text-brand-900">{snapshots[0].score}p</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 rounded-lg bg-brand-50 px-3 py-2 text-xs text-brand-600">
                <Lock className="h-3 w-3" />
                {locale === "en"
                  ? "Photos are encrypted. Only you can see them."
                  : "Foton är krypterade. Bara du kan se dem."}
              </div>
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {snapshots.map((s) => (
                <div key={s.id} className="flex-shrink-0 text-center">
                  <SnapshotImage id={s.id} token={token} className="h-24 w-24" />
                  <p className="mt-1 text-[10px] text-brand-500">
                    {new Date(s.created_at).toLocaleDateString(loc, { month: "short", day: "numeric" })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="space-y-4">
        {analyses.map((a, idx) => {
          const summary = a.result?.summary;
          return (
            <div key={a.id} className="relative flex gap-4 pb-2">
              {idx < analyses.length - 1 && (
                <div className="absolute left-[11px] top-7 h-full w-0.5 bg-brand-100" />
              )}
              <div className="relative z-10 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 border-brand-900 bg-white">
                <div className="h-2 w-2 rounded-full bg-brand-900" />
              </div>
              <div className="flex-1 rounded-xl border border-border bg-white p-4 transition-all hover:shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold">
                    {a.score !== null && (
                      <span className="mr-2 text-[#108474]">
                        {a.score} {t("accountDash.scorePoints")}
                      </span>
                    )}
                    {new Date(a.created_at).toLocaleDateString(loc, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <span className="text-xs text-muted-foreground">{relativeDate(a.created_at, locale, t)}</span>
                </div>
                {summary && (
                  <p className="mt-2 text-sm text-brand-600">{summary}</p>
                )}
                {a.result?.products && a.result.products.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {a.result.products.map((p) => (
                      <span
                        key={p.id}
                        className="rounded-full bg-[#108474]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#108474]"
                      >
                        {PRODUCTS.find((pr) => pr.id === p.id)
                          ? productDisplayName(PRODUCTS.find((pr) => pr.id === p.id)!, locale)
                          : p.id}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <a href={path("skinAnalysis")}>
        <Button className="mt-4 rounded-xl">{d("newAnalysis")}</Button>
      </a>
    </div>
  );
}

/* ─────────────────── ORDERS + REORDER ─────────────────── */

function OrdersView({ orders, loading, error }: { orders: Order[]; loading: boolean; error: string }) {
  const { t, path, locale } = useLocale();
  const loc = locale === "en" ? "en-GB" : "sv-SE";
  const d = (key: string, vars?: Record<string, string | number>) => t(`accountDash.${key}`, vars);
  const { addItems } = useCart();
  const { showToast } = useToast();

  const handleReorder = (order: Order) => {
    const items = (order.items || []).map((item) => ({
      id: item.id,
      qty: item.qty || 1,
    }));
    if (items.length === 0) return;
    addItems(items);
    showToast(d("reorderToast"), "success");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-brand-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold tracking-tight">{d("ordersTitle")}</h2>
      {error && <ErrorBanner message={error} />}
      {!error && orders.length === 0 ? (
        <div className="rounded-xl border border-border p-8 text-center">
          <ShoppingBag className="mx-auto mb-3 h-12 w-12 text-brand-200" />
          <p className="text-base font-medium text-brand-900">{d("ordersEmptyTitle")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{d("ordersEmptySub")}</p>
          <a href={path("products")}>
            <Button className="mt-4 rounded-xl">{d("seeProducts")}</Button>
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusKey = normalizeOrderStatus(order.status);
            const payKey = normalizeOrderStatus(order.payment_status);
            return (
              <div
                key={order.id}
                className="group rounded-xl border border-border bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold">{order.order_number}</p>
                    <p className="text-xs text-muted-foreground">
                      {relativeDate(order.created_at, locale, t)}
                      <span className="mx-1.5">&middot;</span>
                      {new Date(order.created_at).toLocaleDateString(loc)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                        orderStatusClass(order.payment_status)
                      )}
                    >
                      {t(`account.orderStatus.${payKey}`)}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                        orderStatusClass(order.status)
                      )}
                    >
                      {t(`account.orderStatus.${statusKey}`)}
                    </span>
                  </div>
                </div>
                <div className="mt-3 space-y-1.5">
                  {(order.items || []).map((item, i) => {
                    const qty = Number(item.qty ?? item.quantity) || 1;
                    const price = Number(item.price) || 0;
                    return (
                      <p key={i} className="text-sm text-brand-600">
                        {qty}x {item.name || item.id}{" "}
                        <span className="text-brand-500">
                          {formatPrice(price * qty, locale)}
                        </span>
                      </p>
                    );
                  })}
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-brand-100 pt-3">
                  <button
                    type="button"
                    onClick={() => handleReorder(order)}
                    className="flex items-center gap-1.5 rounded-lg border border-brand-200 px-3 py-1.5 text-xs font-medium text-brand-900 transition-colors hover:bg-brand-50"
                  >
                    <RefreshCcw className="h-3 w-3" />
                    {d("reorder")}
                  </button>
                  <p className="text-sm font-bold">
                    {formatPrice(Number(order.total_amount) || 0, locale)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─────────────────── ROUTINE ─────────────────── */

function RoutineStep({ step, product, isLast }: { step: string; product: string; isLast?: boolean }) {
  return (
    <div className="relative flex gap-4 pb-6">
      {!isLast && (
        <div className="absolute left-[11px] top-7 h-full w-0.5 bg-brand-100" />
      )}
      <div className="relative z-10 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 border-brand-900 bg-white">
        <div className="h-2 w-2 rounded-full bg-brand-900" />
      </div>
      <div className="flex-1 pt-0.5">
        <p className="text-sm font-medium">{step}</p>
        <p className="text-xs text-muted-foreground">{product}</p>
      </div>
    </div>
  );
}

function RoutineView() {
  const { t, locale } = useLocale();
  const d = (key: string, vars?: Record<string, string | number>) => t(`accountDash.${key}`, vars);
  const weekLetters =
    locale === "en" ? ["M", "T", "W", "T", "F", "S", "S"] : ["M", "T", "O", "T", "F", "L", "S"];

  const remover = getProduct("au-naturel-makeup-remover");
  const serum = getProduct("ta-da-serum");
  const removerName = remover ? productDisplayName(remover, locale) : "Au Naturel Makeup Remover";
  const serumName = serum ? productDisplayName(serum, locale) : "TA-DA Serum";
  const morningOil = "The ONE Facial Oil";
  const eveningOil = "I LOVE Facial Oil";

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold tracking-tight">{d("routineTitle")}</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border p-6">
          <h3 className="mb-5 text-base font-bold">{d("morning")}</h3>
          <div>
            <RoutineStep step={d("stepCleanse")} product={removerName} />
            <RoutineStep step={d("stepApplyDrops")} product={morningOil} />
            <RoutineStep step={d("stepSerum")} product={serumName} isLast />
          </div>
        </div>
        <div className="rounded-xl border border-border p-6">
          <h3 className="mb-5 text-base font-bold">{d("evening")}</h3>
          <div>
            <RoutineStep step={d("stepDoubleCleanse")} product={removerName} />
            <RoutineStep step={d("stepApplyDrops")} product={eveningOil} />
            <RoutineStep step={d("stepSerum")} product={serumName} isLast />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-brand-50/40 p-6">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-brand-700" />
          <div>
            <p className="text-sm font-medium">{d("streakTitle")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{d("streakHint")}</p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          {weekLetters.map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] text-muted-foreground">{day}</span>
              <div
                className={cn(
                  "h-7 w-7 rounded-full border-2 transition-colors",
                  i < 3 ? "border-brand-900 bg-brand-900" : "border-brand-200 bg-white"
                )}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── BENEFITS + REDEEM ─────────────────── */

const BENEFIT_TIERS = [
  { name: "Brons" as const, threshold: 0, perkKey: "tierBronzePerk" as const },
  { name: "Silver" as const, threshold: 2000, perkKey: "tierSilverPerk" as const },
  { name: "Guld" as const, threshold: 5000, perkKey: "tierGoldPerk" as const },
  { name: "Platina" as const, threshold: 10000, perkKey: "tierPlatPerk" as const },
];

function BenefitsView({
  tier,
  points,
  token,
  onPointsUpdate,
}: {
  tier: string;
  points: number;
  token: string;
  onPointsUpdate: (pts: number) => void;
}) {
  const { t, locale } = useLocale();
  const loc = locale === "en" ? "en-GB" : "sv-SE";
  const d = (key: string, vars?: Record<string, string | number>) => t(`accountDash.${key}`, vars);
  const { showToast } = useToast();
  const [redeeming, setRedeeming] = useState(false);
  const [redeemAmount, setRedeemAmount] = useState(100);
  const [lastCode, setLastCode] = useState<{ code: string; discountKr: number } | null>(null);

  const currentIdx = BENEFIT_TIERS.findIndex((row) => row.name === tier);
  const nextTier = currentIdx < BENEFIT_TIERS.length - 1 ? BENEFIT_TIERS[currentIdx + 1] : null;
  const remaining = nextTier ? Math.max(0, nextTier.threshold - points) : 0;
  const nextDiscountPct = nextTier ? TIER_DISCOUNTS[nextTier.name] ?? 0 : 0;

  const handleRedeem = async () => {
    setRedeeming(true);
    try {
      const result = await authFetch<{ code: string; discountKr: number; remainingPoints: number }>(
        "/loyalty/redeem",
        token,
        { method: "POST", body: JSON.stringify({ points: redeemAmount }) }
      );
      setLastCode({ code: result.code, discountKr: result.discountKr });
      onPointsUpdate(result.remainingPoints);
      showToast(d("redeemingToast", { code: result.code, kr: result.discountKr }), "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : d("redeemError"), "error");
    } finally {
      setRedeeming(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold tracking-tight">{d("benefitsTitle")}</h2>
        <p className="text-sm text-muted-foreground">{d("benefitsLead")}</p>
      </div>

      <div className="relative flex items-center justify-between px-2">
        <div className="absolute left-0 right-0 top-5 h-0.5 bg-brand-100" />
        {BENEFIT_TIERS.map((row, i) => {
          const reached = i <= currentIdx;
          return (
            <div key={row.name} className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 text-xs font-bold transition-all",
                  reached
                    ? "border-brand-900 bg-brand-900 text-white"
                    : "border-brand-200 bg-white text-muted-foreground"
                )}
              >
                {reached ? "✓" : i + 1}
              </div>
              <p className={cn("text-xs font-medium", reached ? "text-brand-900" : "text-muted-foreground")}>
                {t(`account.tier.${row.name}`)}
              </p>
              <p className={cn("text-[11px]", reached ? "text-brand-600" : "text-muted-foreground")}>
                {t(`account.${row.perkKey}`)}
              </p>
            </div>
          );
        })}
      </div>

      {nextTier && (
        <div className="rounded-xl bg-brand-50 p-5">
          <p className="text-sm font-medium text-brand-900">{d("nextGoal")}</p>
          <p className="mt-1 text-sm text-brand-600">
            {d("nextGoalText", {
              amount: formatPrice(remaining, locale),
              tier: t(`account.tier.${nextTier.name}`),
              discount: `${nextDiscountPct}%`,
            })}
          </p>
        </div>
      )}
      {!nextTier && (
        <div className="rounded-xl bg-brand-50 p-5">
          <p className="text-sm font-medium text-brand-900">{d("tierMaxTitle")}</p>
          <p className="mt-1 text-sm text-brand-600">{d("tierMaxBody")}</p>
        </div>
      )}

      {points >= 100 && (
        <div className="space-y-4 rounded-xl border border-border p-5">
          <h3 className="text-base font-bold">{d("redeemTitle")}</h3>
          <p className="text-sm text-muted-foreground">
            {d("redeemHint", { points: points.toLocaleString(loc) })}
          </p>
          <div className="flex items-center gap-3">
            <select
              value={redeemAmount}
              onChange={(e) => setRedeemAmount(parseInt(e.target.value, 10))}
              className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus:outline-none"
            >
              {[100, 200, 500, 1000]
                .filter((v) => v <= points)
                .map((v) => (
                  <option key={v} value={v}>
                    {d("redeemOption", { points: v, kr: v / 10 })}
                  </option>
                ))}
            </select>
            <Button type="button" onClick={handleRedeem} disabled={redeeming} className="rounded-xl">
              {redeeming && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {d("redeemBtn")}
            </Button>
          </div>
          {lastCode && (
            <div className="rounded-lg bg-green-50 p-4">
              <p className="text-sm font-bold text-green-800">{d("codeTitle")}</p>
              <p className="mt-1 font-mono text-lg font-bold text-green-900">{lastCode.code}</p>
              <p className="mt-1 text-xs text-green-600">{d("codeHint", { kr: lastCode.discountKr })}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─────────────────── SUBSCRIPTIONS ─────────────────── */

interface Subscription {
  id: number;
  status: string;
  product_id: string;
  product_name: string;
  quantity: number;
  interval_days: number;
  discount_percent: number;
  original_price: number;
  recurring_price: number;
  next_charge_date: string | null;
  created_at: string;
}

function SubscriptionsView({ token }: { token: string }) {
  const { t, path, locale } = useLocale();
  const loc = locale === "en" ? "en-GB" : "sv-SE";
  const d = (key: string, vars?: Record<string, string | number>) => t(`accountDash.${key}`, vars);
  const daysWord = t("productDetail.days");
  const { showToast } = useToast();
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editQty, setEditQty] = useState(1);
  const [editInterval, setEditInterval] = useState(60);
  const [saving, setSaving] = useState(false);

  const fetchSubs = useCallback(async () => {
    try {
      const data = await authFetch<Subscription[]>("/subscriptions", token);
      setSubs(data);
    } catch {
      showToast(t("accountDash.subsFetchError"), "error");
    } finally {
      setLoading(false);
    }
  }, [token, showToast, t]);

  useEffect(() => {
    fetchSubs();
  }, [fetchSubs]);

  const handleAction = async (id: number, action: "pause" | "resume" | "cancel") => {
    try {
      if (action === "cancel") {
        if (!window.confirm(d("subsCancelConfirm"))) return;
        await authFetch(`/subscriptions/${id}`, token, { method: "DELETE" });
        showToast(d("subCancelled"), "success");
      } else if (action === "pause") {
        await authFetch(`/subscriptions/${id}/pause`, token, { method: "PUT" });
        showToast(d("subPaused"), "success");
      } else {
        await authFetch(`/subscriptions/${id}/resume`, token, { method: "PUT" });
        showToast(d("subResumed"), "success");
      }
      fetchSubs();
    } catch {
      showToast(t("common.error"), "error");
    }
  };

  const startEdit = (sub: Subscription) => {
    setEditingId(sub.id);
    setEditQty(sub.quantity);
    setEditInterval(sub.interval_days);
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = async (id: number) => {
    setSaving(true);
    try {
      await authFetch(`/subscriptions/${id}`, token, {
        method: "PUT",
        body: JSON.stringify({ quantity: editQty, intervalDays: editInterval }),
      });
      showToast(d("subUpdated"), "success");
      setEditingId(null);
      fetchSubs();
    } catch (err) {
      showToast(err instanceof Error ? err.message : d("subSaveError"), "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-brand-400" />
      </div>
    );
  }

  const activeSubs = subs.filter(
    (s) => s.status === "active" || s.status === "paused" || s.status === "pending"
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold tracking-tight">{d("subsTitle")}</h2>
      <p className="text-sm text-muted-foreground">{d("subsLead")}</p>

      {activeSubs.length === 0 ? (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100/50 p-8">
          <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-brand-200/30" />
          <div className="relative z-10">
            <RefreshCcw className="mb-3 h-8 w-8 text-brand-700" />
            <h3 className="text-lg font-bold text-brand-900">{d("subsEmptyTitle")}</h3>
            <p className="mt-2 text-sm text-brand-600">{d("subsEmptyBody")}</p>
            <a href={path("products")}>
              <Button className="mt-5 rounded-xl">{d("chooseProducts")}</Button>
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {activeSubs.map((sub) => {
            const isEditing = editingId === sub.id;

            return (
              <div key={sub.id} className="rounded-xl border border-border bg-white shadow-sm transition-all">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold">{sub.product_name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {sub.quantity}
                        {d("subscriptionPcs")} &middot; {d("subscriptionEvery", { n: sub.interval_days })}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                        sub.status === "active" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                      )}
                    >
                      {sub.status === "active" ? d("active") : d("paused")}
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-lg font-bold">
                      {formatPrice(sub.recurring_price, locale)}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(sub.original_price, locale)}
                    </span>
                    <span className="rounded bg-green-50 px-1.5 py-0.5 text-[11px] font-medium text-green-700">
                      -{sub.discount_percent}%
                    </span>
                  </div>
                  {sub.next_charge_date && sub.status === "active" && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {d("nextDelivery")}{" "}
                      {new Date(sub.next_charge_date).toLocaleDateString(loc, {
                        day: "numeric",
                        month: "long",
                      })}
                    </p>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-4 border-t border-border bg-brand-50/30 px-5 py-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-brand-700">{d("qtyLabel")}</label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditQty(Math.max(1, editQty - 1))}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-200 bg-white text-brand-700 hover:bg-brand-50"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold">{editQty}</span>
                        <button
                          type="button"
                          onClick={() => setEditQty(Math.min(10, editQty + 1))}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-200 bg-white text-brand-700 hover:bg-brand-50"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-brand-700">{d("intervalLabel")}</label>
                      <div className="flex gap-2">
                        {[30, 60, 90].map((days) => (
                          <button
                            key={days}
                            type="button"
                            onClick={() => setEditInterval(days)}
                            className={cn(
                              "flex-1 rounded-lg border-2 px-3 py-2 text-center text-xs font-medium transition-all",
                              editInterval === days
                                ? "border-brand-900 bg-brand-900 text-white"
                                : "border-brand-200 text-brand-700 hover:border-brand-400"
                            )}
                          >
                            {days} {daysWord}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button
                        type="button"
                        onClick={() => saveEdit(sub.id)}
                        disabled={saving}
                        className="rounded-lg text-xs"
                        size="sm"
                      >
                        {saving ? (
                          <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Save className="mr-1.5 h-3.5 w-3.5" />
                        )}
                        {d("save")}
                      </Button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="rounded-lg border border-brand-200 px-3 py-1.5 text-xs font-medium text-brand-700 hover:bg-white"
                      >
                        {d("cancel")}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 border-t border-border px-5 py-3">
                    <button
                      type="button"
                      onClick={() => startEdit(sub)}
                      className="rounded-lg border border-brand-200 px-3 py-1.5 text-xs font-medium text-brand-900 transition-colors hover:bg-brand-50"
                    >
                      {d("edit")}
                    </button>
                    {sub.status === "active" ? (
                      <button
                        type="button"
                        onClick={() => handleAction(sub.id, "pause")}
                        className="rounded-lg border border-brand-200 px-3 py-1.5 text-xs font-medium text-brand-900 transition-colors hover:bg-brand-50"
                      >
                        {d("pause")}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAction(sub.id, "resume")}
                        className="rounded-lg border border-brand-200 px-3 py-1.5 text-xs font-medium text-brand-900 transition-colors hover:bg-brand-50"
                      >
                        {d("resume")}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleAction(sub.id, "cancel")}
                      className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                      {d("cancel")}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─────────────────── WISHLIST ─────────────────── */

function WishlistView({ token }: { token: string }) {
  const { t, path, locale } = useLocale();
  const loc = locale === "en" ? "en-GB" : "sv-SE";
  const d = (key: string, vars?: Record<string, string | number>) => t(`accountDash.${key}`, vars);
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { showToast } = useToast();

  const fetchWishlist = useCallback(async () => {
    try {
      const data = await authFetch<WishlistItem[]>("/wishlist", token);
      setItems(data);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleRemove = async (productId: string) => {
    try {
      await authFetch(`/wishlist/${productId}`, token, { method: "DELETE" });
      setItems((prev) => prev.filter((i) => i.product_id !== productId));
      showToast(d("removeWishlist"), "success");
    } catch {
      showToast(d("removeError"), "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-brand-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold tracking-tight">{d("wishlistTitle")}</h2>
      {items.length === 0 ? (
        <div className="rounded-xl border border-border p-8 text-center">
          <Heart className="mx-auto mb-3 h-12 w-12 text-brand-200" />
          <p className="text-base font-medium text-brand-900">{d("wishlistEmpty")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{d("wishlistHint")}</p>
          <a href={path("products")}>
            <Button className="mt-4 rounded-xl">{d("seeProducts")}</Button>
          </a>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => {
            const product = PRODUCTS.find((p) => p.id === item.product_id);
            if (!product) return null;
            const name = productDisplayName(product, locale);
            const short = productShortDesc(product, locale);
            return (
              <div
                key={item.product_id}
                className="flex items-center gap-4 rounded-xl border border-border bg-white p-4 transition-all hover:shadow-sm"
              >
                <a href={path("product", { productId: item.product_id })} className="flex-1">
                  <p className="text-sm font-bold">{name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{short}</p>
                  <p className="mt-1 text-sm font-bold">
                    {formatPrice(productPrice(product, locale), locale)}
                  </p>
                </a>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      addItem(product.id, 1);
                      showToast(t("productDetail.addedToCart", { name }), "success");
                    }}
                    className="rounded-lg bg-brand-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-800"
                  >
                    {d("addToCartShort")}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(item.product_id)}
                    className="flex items-center justify-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                    {d("remove")}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─────────────────── SETTINGS + ADDRESSES ─────────────────── */

function SettingsView({ token }: { token: string }) {
  const { t } = useLocale();
  const d = (key: string, vars?: Record<string, string | number>) => t(`accountDash.${key}`, vars);
  const { user } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [saving, setSaving] = useState(false);

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [pwSaving, setPwSaving] = useState(false);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addrLoading, setAddrLoading] = useState(true);
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [addrForm, setAddrForm] = useState({
    label: d("defaultAddrLabel"),
    address: "",
    zip: "",
    city: "",
    isDefault: false,
  });
  const [addrSaving, setAddrSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone ?? "");
    }
  }, [user]);

  useEffect(() => {
    authFetch<Address[]>("/addresses", token)
      .then(setAddresses)
      .catch(() => {})
      .finally(() => setAddrLoading(false));
  }, [token]);

  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await authFetch("/auth/profile", token, {
        method: "PUT",
        body: JSON.stringify({ name, phone }),
      });
      showToast(d("profileSaved"), "success");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : d("saveError"), "error");
    }
    setSaving(false);
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (newPw.length < 6 || !/\d/.test(newPw)) {
      showToast(d("passwordErrorRule"), "error");
      return;
    }
    setPwSaving(true);
    try {
      await authFetch("/auth/password", token, {
        method: "PUT",
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      });
      showToast(d("passwordChanged"), "success");
      setCurrentPw("");
      setNewPw("");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : d("saveError"), "error");
    }
    setPwSaving(false);
  };

  const handleSaveAddress = async (e: FormEvent) => {
    e.preventDefault();
    setAddrSaving(true);
    try {
      const result = await authFetch<Address>("/addresses", token, {
        method: "POST",
        body: JSON.stringify(addrForm),
      });
      setAddresses((prev) =>
        addrForm.isDefault
          ? [result, ...prev.map((a) => ({ ...a, is_default: false }))]
          : [...prev, result]
      );
      setShowAddrForm(false);
      setAddrForm({
        label: d("defaultAddrLabel"),
        address: "",
        zip: "",
        city: "",
        isDefault: false,
      });
      showToast(d("addressSaved"), "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : d("addressSaveError"), "error");
    }
    setAddrSaving(false);
  };

  const handleDeleteAddress = async (id: number) => {
    try {
      await authFetch(`/addresses/${id}`, token, { method: "DELETE" });
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      showToast(d("addressRemoved"), "success");
    } catch {
      showToast(d("addressDeleteError"), "error");
    }
  };

  const initials = (user?.name || "U")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold tracking-tight">{d("settingsTitle")}</h2>

      <div className="flex items-center gap-4 rounded-xl border border-border p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-900 text-lg font-bold text-white">
          {initials}
        </div>
        <div>
          <p className="text-base font-bold">{user?.name}</p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-5 rounded-xl border border-border p-6">
        <h3 className="text-base font-bold">{d("profileTitle")}</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">{d("nameLabel")}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">{d("phoneLabel")}</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus:outline-none"
            />
          </div>
        </div>
        <Button type="submit" disabled={saving} className="rounded-xl active:scale-[0.98]">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {d("saveProfile")}
        </Button>
      </form>

      <form onSubmit={handleChangePassword} className="space-y-4 rounded-xl border border-border p-6">
        <h3 className="text-base font-bold">{d("passwordTitle")}</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">{d("currentPassword")}</label>
            <input
              type="password"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              required
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">{d("newPassword")}</label>
            <input
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              required
              minLength={6}
              placeholder={d("newPasswordPh")}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus:outline-none"
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{d("passwordHint")}</p>
        <Button type="submit" variant="outline" disabled={pwSaving} className="rounded-xl active:scale-[0.98]">
          {pwSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {d("changePassword")}
        </Button>
      </form>

      <div className="space-y-4 rounded-xl border border-border p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold">{d("addressBook")}</h3>
          <button
            type="button"
            onClick={() => setShowAddrForm(!showAddrForm)}
            className="flex items-center gap-1 rounded-lg border border-brand-200 px-3 py-1.5 text-xs font-medium text-brand-900 hover:bg-brand-50"
          >
            {showAddrForm ? <X className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
            {showAddrForm ? d("close") : d("addLabel")}
          </button>
        </div>

        {showAddrForm && (
          <form onSubmit={handleSaveAddress} className="space-y-3 rounded-lg bg-brand-50/50 p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium">{d("labelField")}</label>
                <input
                  type="text"
                  value={addrForm.label}
                  onChange={(e) => setAddrForm({ ...addrForm, label: e.target.value })}
                  placeholder={d("labelPlaceholder")}
                  className="w-full rounded-lg border border-input bg-white px-3 py-2 text-sm focus-visible:ring-1 focus-visible:ring-ring focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">{d("addressField")}</label>
                <input
                  type="text"
                  value={addrForm.address}
                  onChange={(e) => setAddrForm({ ...addrForm, address: e.target.value })}
                  required
                  className="w-full rounded-lg border border-input bg-white px-3 py-2 text-sm focus-visible:ring-1 focus-visible:ring-ring focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">{d("zipField")}</label>
                <input
                  type="text"
                  value={addrForm.zip}
                  onChange={(e) => setAddrForm({ ...addrForm, zip: e.target.value })}
                  required
                  className="w-full rounded-lg border border-input bg-white px-3 py-2 text-sm focus-visible:ring-1 focus-visible:ring-ring focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">{d("cityField")}</label>
                <input
                  type="text"
                  value={addrForm.city}
                  onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })}
                  required
                  className="w-full rounded-lg border border-input bg-white px-3 py-2 text-sm focus-visible:ring-1 focus-visible:ring-ring focus:outline-none"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={addrForm.isDefault}
                onChange={(e) => setAddrForm({ ...addrForm, isDefault: e.target.checked })}
                className="rounded border-brand-300"
              />
              {d("defaultAddress")}
            </label>
            <Button type="submit" disabled={addrSaving} size="sm" className="rounded-lg text-xs">
              {addrSaving && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
              {d("saveAddressBtn")}
            </Button>
          </form>
        )}

        {addrLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-brand-400" />
          </div>
        ) : addresses.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">{d("noAddresses")}</p>
        ) : (
          <div className="space-y-2">
            {addresses.map((addr) => (
              <div key={addr.id} className="flex items-center justify-between rounded-lg border border-border bg-white px-4 py-3">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-brand-400" />
                  <div>
                    <p className="text-sm font-medium">
                      {addr.label}
                      {addr.is_default && (
                        <span className="ml-2 rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-medium text-brand-700">
                          {d("defaultBadge")}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {addr.address}, {addr.zip} {addr.city}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteAddress(addr.id)}
                  className="text-red-400 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────── MAIN PAGE ─────────────────── */

export default function DashboardPage() {
  const { user, token, isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const { t, path } = useLocale();
  const d = (key: string, vars?: Record<string, string | number>) => t(`accountDash.${key}`, vars);
  const [activeView, setActiveView] = useState<View>("oversikt");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingRecs, setLoadingRecs] = useState(true);
  const [errorStats, setErrorStats] = useState("");
  const [errorOrders, setErrorOrders] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      router.push(path("login"));
    }
  }, [isLoggedIn, router, path]);

  useEffect(() => {
    if (!token) return;
    authFetch<DashboardStats>("/dashboard/stats", token)
      .then(setStats)
      .catch(() => setErrorStats(t("accountDash.statsError")))
      .finally(() => setLoadingStats(false));

    authFetch<Order[]>("/dashboard/orders", token)
      .then(setOrders)
      .catch(() => setErrorOrders(t("accountDash.ordersError")))
      .finally(() => setLoadingOrders(false));

    authFetch<Recommendation[]>("/recommendations", token)
      .then(setRecommendations)
      .catch(() => {})
      .finally(() => setLoadingRecs(false));
  }, [token, t]);

  const handlePointsUpdate = (newPoints: number) => {
    setStats((prev) => prev ? { ...prev, loyaltyPoints: newPoints } : prev);
  };

  if (!isLoggedIn) return null;

  function renderView() {
    switch (activeView) {
      case "oversikt":
        return (
          <OverviewView
            stats={stats}
            loading={loadingStats}
            error={errorStats}
            userName={user?.name ?? ""}
            recommendations={recommendations}
            recsLoading={loadingRecs}
          />
        );
      case "hudresa":
        return <SkinJourneyView token={token!} />;
      case "ordrar":
        return <OrdersView orders={orders} loading={loadingOrders} error={errorOrders} />;
      case "rutin":
        return <RoutineView />;
      case "formaner":
        return <BenefitsView tier={stats?.tier ?? "Brons"} points={stats?.loyaltyPoints ?? 0} token={token!} onPointsUpdate={handlePointsUpdate} />;
      case "prenumerationer":
        return <SubscriptionsView token={token!} />;
      case "onskelista":
        return <WishlistView token={token!} />;
      case "installningar":
        return <SettingsView token={token!} />;
      default:
        return null;
    }
  }

  return (
    <section>
      <div className="flex min-h-[calc(100vh-4rem)]">
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={cn(
            "fixed top-16 left-0 z-40 flex h-[calc(100vh-4rem)] w-64 flex-col border-r border-border bg-background transition-transform duration-300 md:relative md:top-0 md:z-0 md:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="border-b border-border px-5 py-6">
            {(() => {
              const t = stats?.tier ?? "Brons";
              const p = stats?.loyaltyPoints ?? 0;
              const info = TIER_THRESHOLDS[t] || TIER_THRESHOLDS.Brons;
              const pct = t === "Platina" ? 100 : Math.min(100, Math.round((p / info.points) * 100));
              return (
                <div className="mb-4 h-1 overflow-hidden rounded-full bg-brand-100">
                  <div className="h-full rounded-full bg-brand-900 transition-all duration-700" style={{ width: `${pct}%` }} />
                </div>
              );
            })()}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-900 text-sm font-bold text-white">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div>
                <p className="text-sm font-bold">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <div className="flex flex-col gap-1">
              {SIDEBAR_ITEMS.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id);
                    setSidebarOpen(false);
                  }}
                  className={cn(
                    "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    activeView === item.id
                      ? "bg-brand-900 text-white"
                      : "text-muted-foreground hover:bg-brand-50"
                  )}
                >
                  {activeView === item.id && (
                    <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-white" />
                  )}
                  <item.icon className="h-4 w-4" />
                  {t(`account.sidebar.${item.id}`)}
                </button>
              ))}
            </div>
          </nav>

          <div className="border-t border-border p-3">
            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              {t("account.logout")}
            </button>
          </div>
        </aside>

        <div className="flex-1 overflow-y-auto px-6 py-8 md:px-10">
          <button
            type="button"
            className="mb-4 flex items-center gap-2 text-sm text-muted-foreground md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <User className="h-4 w-4" />
            {d("menu")}
          </button>
          <div className="mx-auto max-w-4xl" key={activeView} style={{ animation: "var(--animate-fade-in)" }}>
            {renderView()}
          </div>
        </div>
      </div>
    </section>
  );
}
