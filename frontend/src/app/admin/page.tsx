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
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

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

const PIE_COLORS = ["#108474", "#f59e0b", "#f97316", "#ef4444", "#8b5cf6", "#06b6d4"];

function KpiCard({
  label,
  value,
  icon: Icon,
  isCurrency,
  loading,
  trend,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  isCurrency?: boolean;
  loading: boolean;
  trend?: "up" | "down" | null;
}) {
  return (
    <div className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/[0.04] transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#108474]/10 transition-colors group-hover:bg-[#108474]/15">
          <Icon className="h-5 w-5 text-[#108474]" />
        </div>
        {trend && (
          <div className={`flex items-center gap-0.5 text-xs font-medium ${trend === "up" ? "text-emerald-600" : "text-red-500"}`}>
            {trend === "up" ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          </div>
        )}
      </div>
      <div className="mt-4">
        {loading ? (
          <div className="space-y-2">
            <div className="h-8 w-28 animate-pulse rounded-lg bg-[#e6e6e6]" />
            <div className="h-4 w-20 animate-pulse rounded-md bg-[#e6e6e6]" />
          </div>
        ) : (
          <>
            <p className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">
              {isCurrency ? formatSEK(value) : value.toLocaleString("sv-SE")}
            </p>
            <p className="mt-1 text-sm text-[#515151]">{label}</p>
          </>
        )}
      </div>
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="h-[300px] w-full animate-pulse rounded-2xl bg-[#f5f5f7]" />
  );
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-white/95 px-4 py-3 shadow-lg ring-1 ring-black/[0.06] backdrop-blur-lg">
      <p className="text-xs font-medium text-[#515151]">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="mt-1 text-sm font-semibold" style={{ color: p.color }}>
          {p.dataKey === "revenue" ? formatSEK(p.value) : `${p.value} ordrar`}
        </p>
      ))}
    </div>
  );
}

function PieTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { fill: string } }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="rounded-xl bg-white/95 px-4 py-3 shadow-lg ring-1 ring-black/[0.06] backdrop-blur-lg">
      <p className="text-xs font-medium text-[#515151]">{STATUS_LABELS[d.name] || d.name}</p>
      <p className="mt-1 text-sm font-semibold" style={{ color: d.payload.fill }}>
        {d.value} ordrar
      </p>
    </div>
  );
}

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
        {/* Revenue chart */}
        <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/[0.04]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-[#1d1d1f]">Intäkter</h2>
              <p className="text-xs text-[#515151]">Daglig utveckling</p>
            </div>
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
          </div>
          {chartLoading ? (
            <ChartSkeleton />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={formattedDaily} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#108474" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#108474" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e6e6e6" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "#515151" }}
                  tickLine={false}
                  axisLine={{ stroke: "#e6e6e6" }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#515151" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
                  width={50}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#108474"
                  strokeWidth={2.5}
                  fill="url(#revenueGrad)"
                  animationDuration={1200}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Status distribution */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/[0.04]">
          <h2 className="text-lg font-semibold text-[#1d1d1f] mb-1">Orderstatus</h2>
          <p className="text-xs text-[#515151] mb-6">Fördelning</p>
          {chartLoading ? (
            <div className="flex items-center justify-center h-[250px]">
              <div className="h-40 w-40 animate-pulse rounded-full bg-[#f5f5f7]" />
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={chartData?.statusDistribution || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    animationDuration={800}
                    animationEasing="ease-out"
                    stroke="none"
                  >
                    {(chartData?.statusDistribution || []).map((entry, i) => (
                      <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {(chartData?.statusDistribution || []).map((entry, i) => (
                  <div key={entry.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: STATUS_COLORS[entry.name] || PIE_COLORS[i % PIE_COLORS.length] }}
                      />
                      <span className="text-[#515151]">{STATUS_LABELS[entry.name] || entry.name}</span>
                    </div>
                    <span className="font-medium text-[#1d1d1f] tabular-nums">{entry.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Orders bar chart + Top products */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/[0.04]">
          <h2 className="text-lg font-semibold text-[#1d1d1f] mb-1">Ordrar per dag</h2>
          <p className="text-xs text-[#515151] mb-6">Senaste {chartRange} dagarna</p>
          {chartLoading ? (
            <ChartSkeleton />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={formattedDaily} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e6e6e6" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "#515151" }}
                  tickLine={false}
                  axisLine={{ stroke: "#e6e6e6" }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#515151" }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                  width={30}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="orders"
                  fill="#108474"
                  radius={[6, 6, 0, 0]}
                  animationDuration={1000}
                  animationEasing="ease-out"
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top products */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/[0.04]">
          <h2 className="text-lg font-semibold text-[#1d1d1f] mb-1">Toppprodukter</h2>
          <p className="text-xs text-[#515151] mb-6">Mest sålda</p>
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
                const pct = (parseInt(String(product.total_sold)) / parseInt(String(maxSold))) * 100;
                return (
                  <div key={product.product_id} className="group">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-[#f5f5f7] text-[10px] font-bold text-[#515151]">
                          {i + 1}
                        </span>
                        <span className="text-sm font-medium text-[#1d1d1f] truncate">{product.product_name}</span>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                        <span className="text-xs text-[#515151] tabular-nums">{parseInt(String(product.total_sold))} st</span>
                        <span className="text-sm font-semibold text-[#1d1d1f] tabular-nums">
                          {formatSEK(parseInt(String(product.total_revenue)))}
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-[#f5f5f7] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#108474] transition-all duration-700 ease-out"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
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
