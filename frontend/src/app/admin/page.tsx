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
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Stats {
  revenue_today: number;
  orders_today: number;
  revenue_month: number;
  orders_month: number;
  total_revenue: number;
  avg_order_value: number;
  unique_customers: number;
  active_subscriptions: number;
  active_subscribers: number;
}

function formatSEK(amount: number): string {
  return amount.toLocaleString("sv-SE") + " kr";
}

function KpiCard({
  label,
  value,
  icon: Icon,
  isCurrency,
  loading,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  isCurrency?: boolean;
  loading: boolean;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/[0.04] transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#108474]/10">
          <Icon className="h-5 w-5 text-[#108474]" />
        </div>
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

const PRIMARY_KPIS: {
  key: keyof Stats;
  label: string;
  icon: LucideIcon;
  isCurrency: boolean;
}[] = [
  {
    key: "revenue_today",
    label: "Intakter idag",
    icon: TrendingUp,
    isCurrency: true,
  },
  {
    key: "orders_today",
    label: "Ordrar idag",
    icon: ShoppingBag,
    isCurrency: false,
  },
  {
    key: "revenue_month",
    label: "Intakter denna manad",
    icon: CalendarDays,
    isCurrency: true,
  },
  {
    key: "orders_month",
    label: "Ordrar denna manad",
    icon: BarChart3,
    isCurrency: false,
  },
];

const SECONDARY_KPIS: {
  key: keyof Stats;
  label: string;
  icon: LucideIcon;
  isCurrency: boolean;
}[] = [
  {
    key: "total_revenue",
    label: "Totala intakter",
    icon: CreditCard,
    isCurrency: true,
  },
  {
    key: "avg_order_value",
    label: "Snittordervarde",
    icon: TrendingUp,
    isCurrency: true,
  },
  {
    key: "unique_customers",
    label: "Unika kunder",
    icon: Users,
    isCurrency: false,
  },
  {
    key: "active_subscriptions",
    label: "Aktiva prenumerationer",
    icon: Repeat,
    isCurrency: false,
  },
  {
    key: "active_subscribers",
    label: "Nyhetsbrevsprenumeranter",
    icon: Mail,
    isCurrency: false,
  },
];

export default function AdminOverviewPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    async function load() {
      try {
        const data = await authFetch<Stats>("/admin/stats", token!);
        if (!cancelled) setStats(data);
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Kunde inte hamta statistik");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const empty: Stats = {
    revenue_today: 0,
    orders_today: 0,
    revenue_month: 0,
    orders_month: 0,
    total_revenue: 0,
    avg_order_value: 0,
    unique_customers: 0,
    active_subscriptions: 0,
    active_subscribers: 0,
  };

  const data = stats ?? empty;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">
          Oversikt
        </h1>
        <p className="mt-1 text-sm text-[#515151]">
          Valkomstpanel for 1753 SKINCARE
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Primary KPIs */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {PRIMARY_KPIS.map((kpi) => (
          <KpiCard
            key={kpi.key}
            label={kpi.label}
            value={data[kpi.key]}
            icon={kpi.icon}
            isCurrency={kpi.isCurrency}
            loading={loading}
          />
        ))}
      </div>

      {/* Secondary KPIs */}
      <div>
        <h2 className="mb-4 text-lg font-medium text-[#1d1d1f]">
          Detaljerad statistik
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {SECONDARY_KPIS.map((kpi) => (
            <KpiCard
              key={kpi.key}
              label={kpi.label}
              value={data[kpi.key]}
              icon={kpi.icon}
              isCurrency={kpi.isCurrency}
              loading={loading}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
