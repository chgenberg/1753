"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { authFetch } from "@/lib/api";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pause,
  Play,
  Repeat,
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  XCircle,
} from "lucide-react";

type SubStatus = "active" | "paused" | "cancelled" | "pending" | "payment_failed";

interface Subscription {
  id: number;
  user_name: string;
  user_email: string;
  product_name: string;
  quantity: number;
  interval_days: number;
  recurring_price: number;
  status: SubStatus;
  next_charge_date: string | null;
  created_at: string;
}

interface SubscriptionListResponse {
  subscriptions: Subscription[];
  total: number;
  page: number;
  perPage: number;
}

interface VivaCheckResult {
  ok: boolean;
  reason: string;
  details?: {
    statusCode?: string | number | null;
    cardLast4?: string | null;
    cardType?: string | number | null;
    cardCountry?: string | null;
    insertDate?: string | null;
  };
  vivaResponse?: unknown;
  httpStatus?: number;
  error?: string;
}

interface VivaCheckResponse {
  subscriptionId: number;
  productName: string;
  customerEmail: string | null;
  status: string;
  vivaInitialTxId: string | null;
  check: VivaCheckResult;
}

interface VivaCheckAllResponse {
  total: number;
  ok: number;
  failing: number;
  results: VivaCheckResponse[];
}

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "Alla" },
  { value: "active", label: "Aktiva" },
  { value: "paused", label: "Pausade" },
  { value: "cancelled", label: "Avbrutna" },
  { value: "pending", label: "Väntande" },
  { value: "payment_failed", label: "Misslyckade" },
];

function formatSEK(amount: number): string {
  return (
    amount.toLocaleString("sv-SE", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }) + " kr"
  );
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "–";
  return new Date(dateStr).toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function intervalLabel(days: number): string {
  if (days === 30) return "Månadsvis";
  if (days === 60) return "Varannan månad";
  if (days === 90) return "Kvartalsvis";
  if (days === 14) return "Varannan vecka";
  if (days === 7) return "Veckovis";
  return `Var ${days}:e dag`;
}

const BADGE_STYLES: Record<SubStatus, string> = {
  active: "bg-emerald-50 text-emerald-700",
  paused: "bg-amber-50 text-amber-700",
  cancelled: "bg-red-50 text-red-700",
  pending: "bg-gray-100 text-gray-600",
  payment_failed: "bg-red-50 text-red-700",
};

const STATUS_LABELS: Record<SubStatus, string> = {
  active: "Aktiv",
  paused: "Pausad",
  cancelled: "Avbruten",
  pending: "Väntande",
  payment_failed: "Betalning misslyckades",
};

const VIVA_REASON_LABELS: Record<string, string> = {
  ok: "Kortet ok",
  no_initial_tx_id: "Ingen tx-ref sparad",
  transaction_not_found: "Hittas inte hos Viva",
  viva_credentials_missing: "Server-config saknas",
  network_error: "Nätverksfel",
};

function vivaReasonLabel(reason: string): string {
  if (VIVA_REASON_LABELS[reason]) return VIVA_REASON_LABELS[reason];
  if (reason.startsWith("tx_status_")) {
    const code = reason.slice("tx_status_".length);
    return `Tx-status ${code || "okänd"}`;
  }
  return reason;
}

export default function AdminSubscriptionsPage() {
  const { token } = useAuth();

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [vivaResults, setVivaResults] = useState<Record<number, VivaCheckResult>>({});
  const [vivaLoading, setVivaLoading] = useState<number | "all" | null>(null);
  const [vivaSummary, setVivaSummary] = useState<{ ok: number; failing: number } | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const fetchSubscriptions = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (statusFilter !== "all") params.set("status", statusFilter);
      const data = await authFetch<SubscriptionListResponse>(
        `/admin/subscriptions?${params}`,
        token
      );
      setSubscriptions(data.subscriptions);
      setTotal(data.total);
      setPerPage(data.perPage);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Kunde inte hämta prenumerationer"
      );
    } finally {
      setLoading(false);
    }
  }, [token, page, statusFilter]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const handleVivaCheck = async (id: number) => {
    if (!token) return;
    setVivaLoading(id);
    try {
      const data = await authFetch<VivaCheckResponse>(
        `/admin/subscriptions/${id}/viva-check`,
        token
      );
      setVivaResults((prev) => ({ ...prev, [id]: data.check }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Viva-kontroll misslyckades");
    } finally {
      setVivaLoading(null);
    }
  };

  const handleVivaCheckAll = async () => {
    if (!token) return;
    setVivaLoading("all");
    try {
      const data = await authFetch<VivaCheckAllResponse>(
        "/admin/subscriptions/viva-check-all",
        token
      );
      const map: Record<number, VivaCheckResult> = {};
      for (const r of data.results) {
        map[r.subscriptionId] = r.check;
      }
      setVivaResults(map);
      setVivaSummary({ ok: data.ok, failing: data.failing });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bulk-Viva-kontroll misslyckades");
    } finally {
      setVivaLoading(null);
    }
  };

  const handleAction = async (
    id: number,
    action: "pause" | "resume" | "cancel"
  ) => {
    if (action === "cancel") {
      const confirmed = window.confirm(
        "Är du säker på att du vill avbryta denna prenumeration?"
      );
      if (!confirmed) return;
    }

    if (!token) return;
    setActionLoading(id);
    try {
      await authFetch(`/admin/subscriptions/${id}`, token, {
        method: "PUT",
        body: JSON.stringify({ action }),
      });
      await fetchSubscriptions();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Åtgärden misslyckades"
      );
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1d1d1f]">
            Prenumerationer
          </h1>
          <p className="mt-1 text-sm text-[#515151]">
            {total} {total === 1 ? "prenumeration" : "prenumerationer"} totalt
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex gap-1.5 rounded-xl bg-[#f5f5f7] p-1">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => {
                  setPage(1);
                  setStatusFilter(f.value);
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  statusFilter === f.value
                    ? "bg-white text-[#1d1d1f] shadow-sm"
                    : "text-[#515151] hover:text-[#1d1d1f]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleVivaCheckAll}
            disabled={vivaLoading === "all"}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1d1d1f] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[#108474] disabled:opacity-50"
            title="Frågar Viva om alla sparade kort/recurring-tokens fortfarande är giltiga. Inga pengar dras."
          >
            {vivaLoading === "all" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShieldCheck className="h-4 w-4" />
            )}
            Kontrollera alla betalkort
          </button>
        </div>
      </div>

      {vivaSummary && (
        <div className="rounded-2xl bg-white px-5 py-4 text-sm shadow-sm ring-1 ring-[#e6e6e6]">
          <p className="text-[#1d1d1f]">
            Senaste Viva-kontroll:{" "}
            <span className="font-medium text-emerald-700">
              {vivaSummary.ok} ok
            </span>
            {" · "}
            <span className="font-medium text-red-700">
              {vivaSummary.failing} med problem
            </span>
          </p>
          <p className="mt-1 text-xs text-[#766a62]">
            Inga betalningar har dragits – detta är bara en passiv kontroll mot
            Viva.
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-[#e6e6e6]">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-[#108474]" />
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#515151]">
            <Repeat className="mb-3 h-10 w-10 text-[#e6e6e6]" />
            <p className="text-sm font-medium">Inga prenumerationer hittades</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e6e6e6] text-left">
                    <th className="px-5 py-3.5 font-medium text-[#766a62]">
                      Kund
                    </th>
                    <th className="px-5 py-3.5 font-medium text-[#766a62]">
                      Produkt
                    </th>
                    <th className="hidden px-5 py-3.5 text-right font-medium text-[#766a62] sm:table-cell">
                      Pris
                    </th>
                    <th className="hidden px-5 py-3.5 font-medium text-[#766a62] md:table-cell">
                      Intervall
                    </th>
                    <th className="px-5 py-3.5 font-medium text-[#766a62]">
                      Status
                    </th>
                    <th className="hidden px-5 py-3.5 font-medium text-[#766a62] xl:table-cell">
                      Betalkort
                    </th>
                    <th className="hidden px-5 py-3.5 font-medium text-[#766a62] lg:table-cell">
                      Nästa debitering
                    </th>
                    <th className="px-5 py-3.5 text-right font-medium text-[#766a62]">
                      Åtgärder
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((sub) => (
                    <tr
                      key={sub.id}
                      className="border-b border-[#e6e6e6] transition-colors last:border-b-0 hover:bg-[#f5f5f7]/60"
                    >
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-[#1d1d1f]">
                          {sub.user_name}
                        </p>
                        <p className="mt-0.5 text-xs text-[#766a62]">
                          {sub.user_email}
                        </p>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-[#1d1d1f]">{sub.product_name}</p>
                        {sub.quantity > 1 && (
                          <p className="mt-0.5 text-xs text-[#766a62]">
                            {sub.quantity} st
                          </p>
                        )}
                      </td>
                      <td className="hidden px-5 py-3.5 text-right tabular-nums text-[#1d1d1f] sm:table-cell">
                        {formatSEK(sub.recurring_price)}
                      </td>
                      <td className="hidden px-5 py-3.5 text-[#515151] md:table-cell">
                        {intervalLabel(sub.interval_days)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${BADGE_STYLES[sub.status] ?? "bg-gray-100 text-gray-600"}`}
                        >
                          {STATUS_LABELS[sub.status] ?? sub.status}
                        </span>
                      </td>
                      <td className="hidden px-5 py-3.5 xl:table-cell">
                        {(() => {
                          const result = vivaResults[sub.id];
                          if (vivaLoading === sub.id) {
                            return (
                              <Loader2 className="h-4 w-4 animate-spin text-[#108474]" />
                            );
                          }
                          if (!result) {
                            return (
                              <button
                                onClick={() => handleVivaCheck(sub.id)}
                                title="Kontrollera detta kort/recurring-token mot Viva"
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#f5f5f7] px-2.5 py-1 text-xs font-medium text-[#515151] transition-colors hover:bg-[#e6e6e6]"
                              >
                                <ShieldQuestion className="h-3.5 w-3.5" />
                                Kontrollera
                              </button>
                            );
                          }
                          if (result.ok) {
                            const last4 = result.details?.cardLast4;
                            return (
                              <div className="flex flex-col gap-0.5">
                                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                                  <ShieldCheck className="h-3.5 w-3.5" />
                                  Aktiv
                                </span>
                                {last4 && (
                                  <span className="text-[11px] text-[#766a62]">
                                    •••• {last4}
                                  </span>
                                )}
                              </div>
                            );
                          }
                          return (
                            <div className="flex flex-col gap-0.5">
                              <button
                                onClick={() => handleVivaCheck(sub.id)}
                                className="inline-flex w-fit items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700 hover:bg-red-100"
                                title="Klicka för att kontrollera igen"
                              >
                                <ShieldAlert className="h-3.5 w-3.5" />
                                Problem
                              </button>
                              <span className="text-[11px] text-[#766a62]">
                                {vivaReasonLabel(result.reason)}
                              </span>
                            </div>
                          );
                        })()}
                      </td>
                      <td className="hidden px-5 py-3.5 text-[#515151] lg:table-cell">
                        {formatDate(sub.next_charge_date)}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          {actionLoading === sub.id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-[#108474]" />
                          ) : (
                            <>
                              <button
                                onClick={() => handleVivaCheck(sub.id)}
                                title="Kontrollera betalkort mot Viva (xl-skärmar visar resultat i kolumn)"
                                className="rounded-lg p-1.5 text-[#108474] transition-colors hover:bg-emerald-50 xl:hidden"
                                disabled={vivaLoading === sub.id}
                              >
                                {vivaLoading === sub.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <ShieldCheck className="h-4 w-4" />
                                )}
                              </button>
                              {sub.status === "active" && (
                                <button
                                  onClick={() =>
                                    handleAction(sub.id, "pause")
                                  }
                                  title="Pausa"
                                  className="rounded-lg p-1.5 text-amber-600 transition-colors hover:bg-amber-50"
                                >
                                  <Pause className="h-4 w-4" />
                                </button>
                              )}
                              {sub.status === "paused" && (
                                <button
                                  onClick={() =>
                                    handleAction(sub.id, "resume")
                                  }
                                  title="Återuppta"
                                  className="rounded-lg p-1.5 text-emerald-600 transition-colors hover:bg-emerald-50"
                                >
                                  <Play className="h-4 w-4" />
                                </button>
                              )}
                              {(sub.status === "active" ||
                                sub.status === "paused") && (
                                <button
                                  onClick={() =>
                                    handleAction(sub.id, "cancel")
                                  }
                                  title="Avbryt"
                                  className="rounded-lg p-1.5 text-red-500 transition-colors hover:bg-red-50"
                                >
                                  <XCircle className="h-4 w-4" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-[#e6e6e6] px-5 py-3.5">
                <p className="text-xs text-[#515151]">
                  Sida {page} av {totalPages}
                </p>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="rounded-lg p-1.5 text-[#1d1d1f] transition-colors hover:bg-[#f5f5f7] disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="rounded-lg p-1.5 text-[#1d1d1f] transition-colors hover:bg-[#f5f5f7] disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
