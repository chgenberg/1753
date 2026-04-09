"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { authFetch } from "@/lib/api";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Users,
  Loader2,
  Download,
} from "lucide-react";

interface Customer {
  customer_email: string;
  customer_name: string;
  customer_phone: string;
  order_count: number;
  total_spent: number;
  last_order: string | null;
  first_order: string | null;
}

interface CustomerListResponse {
  customers: Customer[];
  total: number;
  page: number;
  perPage: number;
}

interface CustomerOrder {
  id: number;
  order_number: string;
  status: string;
  total_amount: number;
  shipping_cost: number;
  created_at: string;
  items: { name: string; quantity: number; price: number }[];
}

interface CustomerSubscription {
  id: number;
  product_name: string;
  status: string;
  interval_days: number;
  recurring_price: number;
  next_charge_date: string | null;
}

interface CustomerDetail {
  customer: Customer;
  orders: CustomerOrder[];
  subscriptions: CustomerSubscription[];
}

function formatSEK(amount: number): string {
  return amount.toLocaleString("sv-SE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }) + " kr";
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "–";
  return new Date(dateStr).toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    pending: "Väntande",
    confirmed: "Bekräftad",
    shipped: "Skickad",
    delivered: "Levererad",
    cancelled: "Avbruten",
    active: "Aktiv",
    paused: "Pausad",
  };
  return map[status] || status;
}

function statusColor(status: string): string {
  switch (status) {
    case "delivered":
    case "active":
      return "bg-emerald-50 text-emerald-700";
    case "shipped":
    case "confirmed":
      return "bg-blue-50 text-blue-700";
    case "pending":
      return "bg-amber-50 text-amber-700";
    case "cancelled":
      return "bg-red-50 text-red-700";
    case "paused":
      return "bg-yellow-50 text-yellow-700";
    default:
      return "bg-gray-50 text-gray-700";
  }
}

export default function AdminCustomersPage() {
  const { token } = useAuth();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [expandedEmail, setExpandedEmail] = useState<string | null>(null);
  const [detailData, setDetailData] = useState<Record<string, CustomerDetail>>({});
  const [detailLoading, setDetailLoading] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const fetchCustomers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (search) params.set("search", search);
      const data = await authFetch<CustomerListResponse>(
        `/admin/customers?${params}`,
        token
      );
      setCustomers(data.customers);
      setTotal(data.total);
      setPerPage(data.perPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunde inte hämta kunder");
    } finally {
      setLoading(false);
    }
  }, [token, page, search]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearch(searchInput);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const toggleExpand = async (email: string) => {
    if (expandedEmail === email) {
      setExpandedEmail(null);
      return;
    }

    setExpandedEmail(email);

    if (detailData[email]) return;

    if (!token) return;
    setDetailLoading(email);
    try {
      const data = await authFetch<CustomerDetail>(
        `/admin/customers/${encodeURIComponent(email)}`,
        token
      );
      setDetailData((prev) => ({ ...prev, [email]: data }));
    } catch {
      setDetailData((prev) => ({
        ...prev,
        [email]: {
          customer: customers.find((c) => c.customer_email === email)!,
          orders: [],
          subscriptions: [],
        },
      }));
    } finally {
      setDetailLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1d1d1f]">
            Kunder
          </h1>
          <p className="mt-1 text-sm text-[#515151]">
            {total} {total === 1 ? "kund" : "kunder"} totalt
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#766a62]" />
            <input
              type="text"
              placeholder="Sök namn, e-post eller telefon..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded-xl border border-[#e6e6e6] bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm transition-shadow placeholder:text-[#766a62] focus:outline-none focus:ring-2 focus:ring-[#108474]/20 focus:border-[#108474]"
            />
          </div>
          <button
            onClick={async () => {
              if (!token) return;
              try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || (typeof window !== "undefined" && window.location.hostname !== "localhost" ? "https://api.1753skin.com/api" : "http://localhost:3001/api");
                const res = await fetch(`${apiUrl}/admin/customers/export`, { headers: { Authorization: `Bearer ${token}` } });
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `kunder-${new Date().toISOString().split("T")[0]}.csv`;
                a.click();
                URL.revokeObjectURL(url);
              } catch { /* silent */ }
            }}
            className="inline-flex flex-shrink-0 items-center gap-2 rounded-xl bg-[#108474] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#0d6d60] hover:shadow-md active:scale-[0.98]"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Exportera CSV</span>
          </button>
        </div>
      </div>

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
        ) : customers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#515151]">
            <Users className="mb-3 h-10 w-10 text-[#e6e6e6]" />
            <p className="text-sm font-medium">Inga kunder hittades</p>
            {search && (
              <p className="mt-1 text-xs">Prova ett annat sökord</p>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e6e6e6] text-left">
                    <th className="px-5 py-3.5 font-medium text-[#766a62]">Namn</th>
                    <th className="px-5 py-3.5 font-medium text-[#766a62]">E-post</th>
                    <th className="hidden px-5 py-3.5 font-medium text-[#766a62] md:table-cell">Telefon</th>
                    <th className="px-5 py-3.5 text-right font-medium text-[#766a62]">Ordrar</th>
                    <th className="hidden px-5 py-3.5 text-right font-medium text-[#766a62] sm:table-cell">Totalt spenderat</th>
                    <th className="hidden px-5 py-3.5 font-medium text-[#766a62] lg:table-cell">Senaste order</th>
                    <th className="w-10 px-3 py-3.5" />
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => {
                    const isExpanded = expandedEmail === c.customer_email;
                    const detail = detailData[c.customer_email];
                    const isLoadingDetail = detailLoading === c.customer_email;

                    return (
                      <CustomerRow
                        key={c.customer_email}
                        customer={c}
                        isExpanded={isExpanded}
                        detail={detail}
                        isLoadingDetail={isLoadingDetail}
                        onToggle={() => toggleExpand(c.customer_email)}
                      />
                    );
                  })}
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

function CustomerRow({
  customer,
  isExpanded,
  detail,
  isLoadingDetail,
  onToggle,
}: {
  customer: Customer;
  isExpanded: boolean;
  detail?: CustomerDetail;
  isLoadingDetail: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr
        onClick={onToggle}
        className="cursor-pointer border-b border-[#e6e6e6] transition-colors last:border-b-0 hover:bg-[#f5f5f7]/60"
      >
        <td className="px-5 py-3.5 font-medium text-[#1d1d1f]">
          {customer.customer_name || "–"}
        </td>
        <td className="px-5 py-3.5 text-[#515151]">
          {customer.customer_email}
        </td>
        <td className="hidden px-5 py-3.5 text-[#515151] md:table-cell">
          {customer.customer_phone || "–"}
        </td>
        <td className="px-5 py-3.5 text-right tabular-nums text-[#1d1d1f]">
          {customer.order_count}
        </td>
        <td className="hidden px-5 py-3.5 text-right tabular-nums text-[#1d1d1f] sm:table-cell">
          {formatSEK(customer.total_spent)}
        </td>
        <td className="hidden px-5 py-3.5 text-[#515151] lg:table-cell">
          {formatDate(customer.last_order)}
        </td>
        <td className="px-3 py-3.5 text-[#766a62]">
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </td>
      </tr>

      {isExpanded && (
        <tr>
          <td colSpan={7} className="bg-[#f5f5f7] px-5 py-5">
            {isLoadingDetail ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-[#108474]" />
              </div>
            ) : detail ? (
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Orders */}
                <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-[#e6e6e6]">
                  <h3 className="mb-3 text-sm font-semibold text-[#1d1d1f]">
                    Ordrar ({detail.orders.length})
                  </h3>
                  {detail.orders.length === 0 ? (
                    <p className="text-xs text-[#766a62]">Inga ordrar</p>
                  ) : (
                    <div className="space-y-3">
                      {detail.orders.map((o) => (
                        <div
                          key={o.id}
                          className="flex items-start justify-between rounded-lg bg-[#f5f5f7] p-3"
                        >
                          <div>
                            <p className="text-sm font-medium text-[#1d1d1f]">
                              #{o.order_number}
                            </p>
                            <p className="mt-0.5 text-xs text-[#515151]">
                              {formatDate(o.created_at)}
                            </p>
                            {o.items.length > 0 && (
                              <ul className="mt-1.5 space-y-0.5">
                                {o.items.map((item, idx) => (
                                  <li
                                    key={idx}
                                    className="text-xs text-[#766a62]"
                                  >
                                    {item.quantity}x {item.name} –{" "}
                                    {formatSEK(item.price * item.quantity)}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                          <div className="text-right">
                            <span
                              className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(o.status)}`}
                            >
                              {statusLabel(o.status)}
                            </span>
                            <p className="mt-1 text-sm font-medium tabular-nums text-[#1d1d1f]">
                              {formatSEK(o.total_amount + (o.shipping_cost || 0))}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Subscriptions */}
                <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-[#e6e6e6]">
                  <h3 className="mb-3 text-sm font-semibold text-[#1d1d1f]">
                    Prenumerationer ({detail.subscriptions.length})
                  </h3>
                  {detail.subscriptions.length === 0 ? (
                    <p className="text-xs text-[#766a62]">
                      Inga prenumerationer
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {detail.subscriptions.map((s) => (
                        <div
                          key={s.id}
                          className="flex items-start justify-between rounded-lg bg-[#f5f5f7] p-3"
                        >
                          <div>
                            <p className="text-sm font-medium text-[#1d1d1f]">
                              {s.product_name}
                            </p>
                            <p className="mt-0.5 text-xs text-[#515151]">
                              Var {s.interval_days}:e dag –{" "}
                              {formatSEK(s.recurring_price)}
                            </p>
                            {s.next_charge_date && (
                              <p className="mt-0.5 text-xs text-[#766a62]">
                                Nästa: {formatDate(s.next_charge_date)}
                              </p>
                            )}
                          </div>
                          <span
                            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(s.status)}`}
                          >
                            {statusLabel(s.status)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </td>
        </tr>
      )}
    </>
  );
}
