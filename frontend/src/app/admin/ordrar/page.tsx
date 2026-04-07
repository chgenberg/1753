"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { authFetch } from "@/lib/api";
import { Search, ChevronLeft, ChevronRight, Package } from "lucide-react";

interface Order {
  id: number;
  order_number: string;
  status: string;
  payment_status: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  shipping_cost: number;
  created_at: string;
  fortnox_invoice_number: string | null;
  ongoing_order_id: number | null;
}

interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  perPage: number;
}

const STATUS_OPTIONS = [
  { value: "", label: "Alla" },
  { value: "pending", label: "Väntande" },
  { value: "fulfilled", label: "Levererad" },
  { value: "partial", label: "Delvis" },
  { value: "returned", label: "Returnerad" },
] as const;

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  fulfilled: { label: "Levererad", bg: "bg-emerald-50", text: "text-emerald-700" },
  pending: { label: "Väntande", bg: "bg-amber-50", text: "text-amber-700" },
  partial: { label: "Delvis", bg: "bg-orange-50", text: "text-orange-700" },
  returned: { label: "Returnerad", bg: "bg-red-50", text: "text-red-700" },
};

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    bg: "bg-gray-50",
    text: "text-gray-700",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatAmount(total: number, shipping: number): string {
  return (total + shipping).toLocaleString("sv-SE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }) + " kr";
}

function SkeletonRow() {
  return (
    <tr className="border-b border-[#e6e6e6]/60">
      {Array.from({ length: 7 }).map((_, i) => (
        <td key={i} className="px-4 py-3.5">
          <div className="h-4 w-full max-w-[120px] animate-pulse rounded bg-brand-100" />
        </td>
      ))}
    </tr>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const { token } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(20);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    params.set("page", String(page));
    if (status) params.set("status", status);
    if (debouncedSearch) params.set("search", debouncedSearch);

    try {
      const data = await authFetch<OrdersResponse>(
        `/admin/orders?${params.toString()}`,
        token,
      );
      setOrders(data.orders);
      setTotal(data.total);
      setPerPage(data.perPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunde inte hämta ordrar");
    } finally {
      setLoading(false);
    }
  }, [token, page, status, debouncedSearch]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">
            Ordrar
          </h1>
          <p className="mt-1 text-sm text-[#515151]">
            {total} {total === 1 ? "order" : "ordrar"} totalt
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#515151]" />
          <input
            type="text"
            placeholder="Sök order, kund..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-xl border border-[#e6e6e6] bg-white pl-10 pr-4 text-sm text-[#1d1d1f] placeholder:text-[#515151]/60 transition-shadow focus:outline-none focus:ring-2 focus:ring-[#108474]/20 focus:border-[#108474]"
          />
        </div>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="h-10 rounded-xl border border-[#e6e6e6] bg-white px-3 pr-8 text-sm text-[#1d1d1f] transition-shadow focus:outline-none focus:ring-2 focus:ring-[#108474]/20 focus:border-[#108474]"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#e6e6e6]/50">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e6e6e6] bg-[#f5f5f7]/60">
                <th className="px-4 py-3 text-left font-medium text-[#515151]">Order</th>
                <th className="px-4 py-3 text-left font-medium text-[#515151]">Kund</th>
                <th className="px-4 py-3 text-right font-medium text-[#515151]">Belopp</th>
                <th className="px-4 py-3 text-left font-medium text-[#515151]">Status</th>
                <th className="px-4 py-3 text-left font-medium text-[#515151]">Fortnox</th>
                <th className="px-4 py-3 text-left font-medium text-[#515151]">Ongoing</th>
                <th className="px-4 py-3 text-left font-medium text-[#515151]">Datum</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                : orders.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => router.push(`/admin/ordrar/${order.id}`)}
                      className="border-b border-[#e6e6e6]/40 transition-colors hover:bg-[#f5f5f7]/50 cursor-pointer"
                    >
                      <td className="px-4 py-3.5 font-medium text-[#1d1d1f]">
                        #{order.order_number}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="text-[#1d1d1f]">{order.customer_name}</div>
                        <div className="text-xs text-[#515151]">{order.customer_email}</div>
                      </td>
                      <td className="px-4 py-3.5 text-right font-medium text-[#1d1d1f] tabular-nums">
                        {formatAmount(order.total_amount, order.shipping_cost)}
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-3.5 text-[#515151] tabular-nums">
                        {order.fortnox_invoice_number ?? "–"}
                      </td>
                      <td className="px-4 py-3.5 text-[#515151] tabular-nums">
                        {order.ongoing_order_id ?? "–"}
                      </td>
                      <td className="px-4 py-3.5 text-[#515151] whitespace-nowrap">
                        {formatDate(order.created_at)}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {!loading && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50">
              <Package className="h-6 w-6 text-brand-400" />
            </div>
            <p className="text-sm font-medium text-[#1d1d1f]">Inga ordrar hittades</p>
            <p className="mt-1 text-xs text-[#515151]">
              Prova att ändra dina filter eller sökterm
            </p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="px-4 py-6 text-center">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={fetchOrders}
              className="mt-2 text-sm font-medium text-[#108474] hover:underline"
            >
              Försök igen
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && orders.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#515151]">
            Sida {page} av {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#e6e6e6] bg-white px-3 text-sm font-medium text-[#1d1d1f] transition-all hover:bg-[#f5f5f7] disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronLeft className="h-4 w-4" />
              Föregående
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#e6e6e6] bg-white px-3 text-sm font-medium text-[#1d1d1f] transition-all hover:bg-[#f5f5f7] disabled:opacity-40 disabled:pointer-events-none"
            >
              Nästa
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
