"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { authFetch } from "@/lib/api";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Mail,
  MailCheck,
  MailX,
  Users,
  Zap,
} from "lucide-react";

interface NewsletterStats {
  subscribers: {
    total: number;
    active: number;
    unsubscribed: number;
  };
  flows: Flow[];
  queue: QueueStatus[];
}

interface Flow {
  id: number | string;
  name: string;
  trigger: string;
  steps: number;
  active: boolean;
}

interface QueueStatus {
  id: number | string;
  name: string;
  pending: number;
  sent: number;
  failed: number;
}

interface Subscriber {
  email: string;
  name: string | null;
  status: "active" | "unsubscribed";
  source: string | null;
  created_at: string;
}

interface SubscriberListResponse {
  subscribers: Subscriber[];
  total: number;
  page: number;
  perPage: number;
}

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "Alla" },
  { value: "active", label: "Aktiva" },
  { value: "unsubscribed", label: "Avregistrerade" },
];

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "–";
  return new Date(dateStr).toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AdminNewsletterPage() {
  const { token } = useAuth();

  const [stats, setStats] = useState<NewsletterStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");

  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [subTotal, setSubTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [statusFilter, setStatusFilter] = useState("all");
  const [subLoading, setSubLoading] = useState(true);
  const [subError, setSubError] = useState("");

  const totalPages = Math.max(1, Math.ceil(subTotal / perPage));

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    async function load() {
      setStatsLoading(true);
      setStatsError("");
      try {
        const data = await authFetch<NewsletterStats>(
          "/admin/newsletter/stats",
          token!
        );
        if (!cancelled) setStats(data);
      } catch (err) {
        if (!cancelled)
          setStatsError(
            err instanceof Error ? err.message : "Kunde inte hämta statistik"
          );
      } finally {
        if (!cancelled) setStatsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const fetchSubscribers = useCallback(async () => {
    if (!token) return;
    setSubLoading(true);
    setSubError("");
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (statusFilter !== "all") params.set("status", statusFilter);
      const data = await authFetch<SubscriberListResponse>(
        `/admin/newsletter/subscribers?${params}`,
        token
      );
      setSubscribers(data.subscribers);
      setSubTotal(data.total);
      setPerPage(data.perPage);
    } catch (err) {
      setSubError(
        err instanceof Error
          ? err.message
          : "Kunde inte hämta prenumeranter"
      );
    } finally {
      setSubLoading(false);
    }
  }, [token, page, statusFilter]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#1d1d1f]">
          Nyhetsbrev
        </h1>
        <p className="mt-1 text-sm text-[#515151]">
          Hantera prenumeranter och automationsflöden
        </p>
      </div>

      {/* KPI cards */}
      {statsLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-[#108474]" />
        </div>
      ) : statsError ? (
        <div className="rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-700">
          {statsError}
        </div>
      ) : stats ? (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <KPICard
              icon={Users}
              label="Totalt"
              value={stats.subscribers.total}
              color="text-[#108474]"
              bgColor="bg-emerald-50"
            />
            <KPICard
              icon={MailCheck}
              label="Aktiva"
              value={stats.subscribers.active}
              color="text-[#108474]"
              bgColor="bg-emerald-50"
            />
            <KPICard
              icon={MailX}
              label="Avregistrerade"
              value={stats.subscribers.unsubscribed}
              color="text-red-600"
              bgColor="bg-red-50"
            />
          </div>

          {/* Automation flows */}
          {stats.flows.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold tracking-tight text-[#1d1d1f]">
                Automationsflöden
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {stats.flows.map((flow) => (
                  <div
                    key={flow.id}
                    className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#e6e6e6] transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5f5f7]">
                          <Zap className="h-4 w-4 text-[#108474]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#1d1d1f]">
                            {flow.name}
                          </p>
                          <p className="mt-0.5 text-xs text-[#766a62]">
                            {flow.trigger}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          flow.active
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {flow.active ? "Aktiv" : "Inaktiv"}
                      </span>
                    </div>
                    <p className="mt-3 text-xs text-[#515151]">
                      {flow.steps} {flow.steps === 1 ? "steg" : "steg"} i
                      flödet
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Queue status */}
          {stats.queue.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold tracking-tight text-[#1d1d1f]">
                Sändningskö
              </h2>
              <div className="rounded-2xl bg-white shadow-sm ring-1 ring-[#e6e6e6]">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#e6e6e6] text-left">
                        <th className="px-5 py-3 font-medium text-[#766a62]">
                          Namn
                        </th>
                        <th className="px-5 py-3 text-right font-medium text-[#766a62]">
                          Väntande
                        </th>
                        <th className="px-5 py-3 text-right font-medium text-[#766a62]">
                          Skickade
                        </th>
                        <th className="px-5 py-3 text-right font-medium text-[#766a62]">
                          Misslyckade
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.queue.map((q) => (
                        <tr
                          key={q.id}
                          className="border-b border-[#e6e6e6] last:border-b-0"
                        >
                          <td className="px-5 py-3 font-medium text-[#1d1d1f]">
                            {q.name}
                          </td>
                          <td className="px-5 py-3 text-right tabular-nums text-amber-600">
                            {q.pending}
                          </td>
                          <td className="px-5 py-3 text-right tabular-nums text-emerald-600">
                            {q.sent}
                          </td>
                          <td className="px-5 py-3 text-right tabular-nums text-red-600">
                            {q.failed}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      ) : null}

      {/* Subscribers section */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-[#1d1d1f]">
            Prenumeranter
          </h2>
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
        </div>

        {subError && (
          <div className="rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-700">
            {subError}
          </div>
        )}

        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-[#e6e6e6]">
          {subLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-[#108474]" />
            </div>
          ) : subscribers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#515151]">
              <Mail className="mb-3 h-10 w-10 text-[#e6e6e6]" />
              <p className="text-sm font-medium">
                Inga prenumeranter hittades
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#e6e6e6] text-left">
                      <th className="px-5 py-3.5 font-medium text-[#766a62]">
                        E-post
                      </th>
                      <th className="hidden px-5 py-3.5 font-medium text-[#766a62] sm:table-cell">
                        Namn
                      </th>
                      <th className="px-5 py-3.5 font-medium text-[#766a62]">
                        Status
                      </th>
                      <th className="hidden px-5 py-3.5 font-medium text-[#766a62] md:table-cell">
                        Källa
                      </th>
                      <th className="hidden px-5 py-3.5 font-medium text-[#766a62] lg:table-cell">
                        Registrerad
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((sub) => (
                      <tr
                        key={sub.email}
                        className="border-b border-[#e6e6e6] transition-colors last:border-b-0 hover:bg-[#f5f5f7]/60"
                      >
                        <td className="px-5 py-3.5 text-[#1d1d1f]">
                          {sub.email}
                        </td>
                        <td className="hidden px-5 py-3.5 text-[#515151] sm:table-cell">
                          {sub.name || "–"}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              sub.status === "active"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {sub.status === "active"
                              ? "Aktiv"
                              : "Avregistrerad"}
                          </span>
                        </td>
                        <td className="hidden px-5 py-3.5 text-[#515151] md:table-cell">
                          {sub.source || "–"}
                        </td>
                        <td className="hidden px-5 py-3.5 text-[#515151] lg:table-cell">
                          {formatDate(sub.created_at)}
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
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
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
    </div>
  );
}

function KPICard({
  icon: Icon,
  label,
  value,
  color,
  bgColor,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color: string;
  bgColor: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#e6e6e6] transition-shadow hover:shadow-md">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${bgColor}`}
        >
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
        <div>
          <p className="text-xs font-medium text-[#766a62]">{label}</p>
          <p className="text-2xl font-bold tabular-nums tracking-tight text-[#1d1d1f]">
            {value.toLocaleString("sv-SE")}
          </p>
        </div>
      </div>
    </div>
  );
}
