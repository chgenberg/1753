"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { authFetch } from "@/lib/api";
import {
  TrendingUp,
  ShoppingBag,
  CalendarDays,
  Users,
  Repeat,
  Mail,
  CreditCard,
  BarChart3,
  Download,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  KpiCard,
  ChartCard,
  AreaChartComponent,
  BarChartComponent,
  DonutChart,
  ProgressBar,
} from "@/components/charts";

interface Stats {
  revenue_today: number;
  orders_today: number;
  revenue_week: number;
  orders_week: number;
  revenue_month: number;
  orders_month: number;
  total_revenue: number;
  avg_order_value: number;
  unique_customers: number;
  active_subscriptions: number;
  active_subscribers: number;
  total_orders: number;
}

interface DailyData {
  date: string;
  revenue: number;
  orders: number;
}

interface ChartData {
  daily: DailyData[];
  statusDistribution: { name: string; value: number }[];
}

interface TopProduct {
  product_id: string;
  product_name: string;
  total_sold: number;
  total_revenue: number;
}

function formatSEK(amount: number): string {
  return Math.round(amount).toLocaleString("sv-SE") + " kr";
}

function formatShortDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString("sv-SE", { day: "numeric", month: "short" });
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Väntande",
  fulfilled: "Levererad",
  partial: "Delvis",
  returned: "Returnerad",
};

const STATUS_COLORS: Record<string, string> = {
  fulfilled: "#108474",
  pending: "#f59e0b",
  partial: "#f97316",
  returned: "#ef4444",
};



const PRIMARY_KPIS: { key: keyof Stats; label: string; icon: LucideIcon; isCurrency: boolean }[] = [
  { key: "revenue_today", label: "Intäkter idag", icon: TrendingUp, isCurrency: true },
  { key: "orders_today", label: "Ordrar idag", icon: ShoppingBag, isCurrency: false },
  { key: "revenue_month", label: "Intäkter denna månad", icon: CalendarDays, isCurrency: true },
  { key: "orders_month", label: "Ordrar denna månad", icon: BarChart3, isCurrency: false },
];

const SECONDARY_KPIS: { key: keyof Stats; label: string; icon: LucideIcon; isCurrency: boolean }[] = [
  { key: "total_revenue", label: "Totala intäkter", icon: CreditCard, isCurrency: true },
  { key: "avg_order_value", label: "Snittordervärde", icon: TrendingUp, isCurrency: true },
  { key: "unique_customers", label: "Unika kunder", icon: Users, isCurrency: false },
  { key: "active_subscriptions", label: "Aktiva prenumerationer", icon: Repeat, isCurrency: false },
  { key: "active_subscribers", label: "Nyhetsbrevsprenumeranter", icon: Mail, isCurrency: false },
];

export default function AdminOverviewPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartRange, setChartRange] = useState(30);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    async function loadStats() {
      try {
        const data = await authFetch<Stats>("/admin/stats", token!);
        if (!cancelled) setStats(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Kunde inte hämta statistik");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadStats();
    return () => { cancelled = true; };
  }, [token]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    async function loadCharts() {
      setChartLoading(true);
      try {
        const [chart, products] = await Promise.all([
          authFetch<ChartData>(`/admin/stats/chart?days=${chartRange}`, token!),
          authFetch<TopProduct[]>("/admin/stats/top-products", token!),
        ]);
        if (!cancelled) {
          setChartData(chart);
          setTopProducts(products);
        }
      } catch {
        // Charts are non-critical
      } finally {
        if (!cancelled) setChartLoading(false);
      }
    }

    loadCharts();
    return () => { cancelled = true; };
  }, [token, chartRange]);

  const data = stats ?? {
    revenue_today: 0, orders_today: 0, revenue_week: 0, orders_week: 0,
    revenue_month: 0, orders_month: 0, total_revenue: 0, avg_order_value: 0,
    unique_customers: 0, active_subscriptions: 0, active_subscribers: 0, total_orders: 0,
  };

  const formattedDaily = (chartData?.daily || []).map(d => ({
    ...d,
    label: formatShortDate(d.date),
  }));

  async function handleExportStats() {
    if (!token) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || (typeof window !== "undefined" && window.location.hostname !== "localhost" ? "https://api.1753skin.com/api" : "http://localhost:3001/api")}/admin/orders/export`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ordrar-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { /* silent */ }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">Översikt</h1>
          <p className="mt-1 text-sm text-[#515151]">Välkomstpanel för 1753 SKINCARE</p>
        </div>
        <button
          onClick={handleExportStats}
          className="inline-flex items-center gap-2 rounded-xl bg-[#108474] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#0d6d60] hover:shadow-md active:scale-[0.98]"
        >
          <Download className="h-4 w-4" />
          Exportera ordrar
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {/* Primary KPIs */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {PRIMARY_KPIS.map((kpi) => (
          <KpiCard key={kpi.key} label={kpi.label} value={data[kpi.key]} icon={kpi.icon} isCurrency={kpi.isCurrency} loading={loading} />
        ))}
      </div>

      {/* Charts section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard
          title="Intäkter"
          subtitle="Daglig utveckling"
          className="lg:col-span-2"
          actions={
            <div className="flex gap-1 rounded-lg bg-[#f5f5f7] p-1">
              {[7, 14, 30].map(d => (
                <button
                  key={d}
                  onClick={() => setChartRange(d)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                    chartRange === d
                      ? "bg-white text-[#1d1d1f] shadow-sm"
                      : "text-[#515151] hover:text-[#1d1d1f]"
                  }`}
                >
                  {d}d
                </button>
              ))}
            </div>
          }
        >
          <AreaChartComponent
            data={formattedDaily}
            dataKey="revenue"
            loading={chartLoading}
            valueFormatter={(v) => formatSEK(v)}
            yTickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
          />
        </ChartCard>

        <ChartCard title="Orderstatus" subtitle="Fördelning">
          <DonutChart
            data={chartData?.statusDistribution || []}
            colors={STATUS_COLORS}
            labels={STATUS_LABELS}
            loading={chartLoading}
          />
        </ChartCard>
      </div>

      {/* Orders bar chart + Top products */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Ordrar per dag" subtitle={`Senaste ${chartRange} dagarna`}>
          <BarChartComponent
            data={formattedDaily}
            dataKey="orders"
            loading={chartLoading}
            valueFormatter={(v) => `${v} ordrar`}
          />
        </ChartCard>

        <ChartCard title="Toppprodukter" subtitle="Mest sålda">
          {chartLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-4 w-4 animate-pulse rounded bg-[#e6e6e6]" />
                  <div className="h-4 flex-1 animate-pulse rounded bg-[#e6e6e6]" />
                  <div className="h-4 w-16 animate-pulse rounded bg-[#e6e6e6]" />
                </div>
              ))}
            </div>
          ) : topProducts.length === 0 ? (
            <p className="text-sm text-[#515151] py-8 text-center">Ingen data ännu</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((product, i) => {
                const maxSold = topProducts[0]?.total_sold || 1;
                return (
                  <div key={product.product_id} className="flex items-center gap-2.5">
                    <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-[#f5f5f7] text-[10px] font-bold text-[#515151]">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <ProgressBar
                        value={parseInt(String(product.total_sold))}
                        max={parseInt(String(maxSold))}
                        label={product.product_name}
                        valueLabel={`${parseInt(String(product.total_sold))} st · ${formatSEK(parseInt(String(product.total_revenue)))}`}
                        size="sm"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ChartCard>
      </div>

      {/* Secondary KPIs */}
      <div>
        <h2 className="mb-4 text-lg font-medium text-[#1d1d1f]">Detaljerad statistik</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {SECONDARY_KPIS.map((kpi) => (
            <KpiCard key={kpi.key} label={kpi.label} value={data[kpi.key]} icon={kpi.icon} isCurrency={kpi.isCurrency} loading={loading} />
          ))}
        </div>
      </div>
    </div>
  );
}
