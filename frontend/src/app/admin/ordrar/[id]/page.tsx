"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { authFetch } from "@/lib/api";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Undo2,
  Loader2,
  User,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

interface OrderItem {
  name: string;
  articleNumber: string;
  quantity: number;
  price: number;
}

interface Return {
  id: number;
  fortnox_credit_number: string | null;
  ongoing_return_id: string | null;
  status: string;
  reason: string;
  refund_amount: number;
  created_at: string;
  items: { articleNumber: string; quantity: number }[];
}

interface OrderDetail {
  id: number;
  order_number: string;
  status: string;
  payment_status: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address: string;
  zip: string;
  city: string;
  total_amount: number;
  shipping_cost: number;
  created_at: string;
  fortnox_invoice_number: string | null;
  ongoing_order_id: string | null;
  internal_notes: string | null;
  items: OrderItem[];
  returns: Return[];
}

interface ReturnItemInput {
  articleNumber: string;
  name: string;
  maxQuantity: number;
  selected: boolean;
  quantity: number;
}

interface ReturnResult {
  return: {
    id: number;
    fortnox_credit_number: string | null;
    ongoing_return_id: string | null;
  };
  notes: string[];
}

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
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${config.bg} ${config.text}`}
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
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCurrency(amount: number): string {
  return amount.toLocaleString("sv-SE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }) + " kr";
}

function IntegrationStatus({
  label,
  value,
}: {
  label: string;
  value: string | number | null;
}) {
  const hasValue = value !== null && value !== undefined;
  return (
    <div className="flex items-center justify-between rounded-xl bg-[#f5f5f7] px-4 py-3">
      <span className="text-sm text-[#515151]">{label}</span>
      <div className="flex items-center gap-2">
        {hasValue ? (
          <>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-medium text-[#1d1d1f] tabular-nums">
              {value}
            </span>
          </>
        ) : (
          <>
            <XCircle className="h-4 w-4 text-red-400" />
            <span className="text-sm text-[#515151]">Saknas</span>
          </>
        )}
      </div>
    </div>
  );
}

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-brand-100 ${className ?? "h-40"}`}
    />
  );
}

export default function OrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { token } = useAuth();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [retrying, setRetrying] = useState(false);
  const [retryMessage, setRetryMessage] = useState<string | null>(null);

  const [showReturnForm, setShowReturnForm] = useState(false);
  const [returnItems, setReturnItems] = useState<ReturnItemInput[]>([]);
  const [returnReason, setReturnReason] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [submittingReturn, setSubmittingReturn] = useState(false);
  const [returnResult, setReturnResult] = useState<ReturnResult | null>(null);
  const [returnError, setReturnError] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);

    try {
      const data = await authFetch<OrderDetail>(`/admin/orders/${id}`, token);
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunde inte hämta ordern");
    } finally {
      setLoading(false);
    }
  }, [token, id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  function initReturnForm() {
    if (!order) return;
    setReturnItems(
      order.items.map((item) => ({
        articleNumber: item.articleNumber,
        name: item.name,
        maxQuantity: item.quantity,
        selected: false,
        quantity: item.quantity,
      })),
    );
    setReturnReason("");
    setRefundAmount(String(order.total_amount + order.shipping_cost));
    setReturnResult(null);
    setReturnError(null);
    setShowReturnForm(true);
  }

  function toggleReturnItem(index: number) {
    setReturnItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, selected: !item.selected } : item,
      ),
    );
  }

  function updateReturnQuantity(index: number, qty: number) {
    setReturnItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, quantity: Math.max(1, Math.min(qty, item.maxQuantity)) }
          : item,
      ),
    );
  }

  async function handleRetry() {
    if (!token || !order) return;
    setRetrying(true);
    setRetryMessage(null);

    try {
      await authFetch(`/admin/orders/${id}/retry`, token, { method: "POST" });
      setRetryMessage("Ordern har skickats om");
      await fetchOrder();
    } catch (err) {
      setRetryMessage(
        err instanceof Error ? err.message : "Kunde inte skicka om ordern",
      );
    } finally {
      setRetrying(false);
    }
  }

  async function handleSubmitReturn() {
    if (!token) return;

    const selectedItems = returnItems
      .filter((item) => item.selected)
      .map((item) => ({
        articleNumber: item.articleNumber,
        quantity: item.quantity,
      }));

    if (selectedItems.length === 0) {
      setReturnError("Välj minst en produkt att returnera");
      return;
    }

    setSubmittingReturn(true);
    setReturnError(null);

    try {
      const result = await authFetch<ReturnResult>(
        `/admin/orders/${id}/return`,
        token,
        {
          method: "POST",
          body: JSON.stringify({
            items: selectedItems,
            reason: returnReason,
            refundAmount: Number(refundAmount),
          }),
        },
      );
      setReturnResult(result);
      await fetchOrder();
    } catch (err) {
      setReturnError(
        err instanceof Error ? err.message : "Kunde inte skapa returen",
      );
    } finally {
      setSubmittingReturn(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-32 animate-pulse rounded bg-brand-100" />
        <SkeletonBlock className="h-24" />
        <div className="grid gap-6 lg:grid-cols-2">
          <SkeletonBlock className="h-48" />
          <SkeletonBlock className="h-48" />
        </div>
        <SkeletonBlock className="h-56" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-sm text-red-600">{error ?? "Ordern hittades inte"}</p>
        <Link
          href="/admin/ordrar"
          className="mt-4 text-sm font-medium text-[#108474] hover:underline"
        >
          Tillbaka till ordrar
        </Link>
      </div>
    );
  }

  const canRetry = order.status === "pending" || order.status === "partial";

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/admin/ordrar"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#515151] transition-colors hover:text-[#1d1d1f]"
      >
        <ArrowLeft className="h-4 w-4" />
        Tillbaka
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e6e6e6]/50">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-[#1d1d1f]">
              Order #{order.order_number}
            </h1>
            <StatusBadge status={order.status} />
          </div>
          <p className="mt-1 text-sm text-[#515151]">
            {formatDate(order.created_at)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canRetry && (
            <button
              onClick={handleRetry}
              disabled={retrying}
              className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#108474] px-4 text-sm font-medium text-white transition-all hover:bg-[#0d6e62] disabled:opacity-50"
            >
              {retrying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RotateCcw className="h-4 w-4" />
              )}
              Försök igen
            </button>
          )}
          <button
            onClick={initReturnForm}
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-[#e6e6e6] bg-white px-4 text-sm font-medium text-[#1d1d1f] transition-all hover:bg-[#f5f5f7]"
          >
            <Undo2 className="h-4 w-4" />
            Skapa retur
          </button>
        </div>
      </div>

      {retryMessage && (
        <div className="rounded-xl bg-[#f5f5f7] px-4 py-3 text-sm text-[#1d1d1f]">
          {retryMessage}
        </div>
      )}

      {/* Customer + Integrations */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Customer info */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e6e6e6]/50">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#515151]">
            Kund
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-[#515151]" />
              <span className="text-sm text-[#1d1d1f]">{order.customer_name}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-[#515151]" />
              <a
                href={`mailto:${order.customer_email}`}
                className="text-sm text-[#108474] hover:underline"
              >
                {order.customer_email}
              </a>
            </div>
            {order.customer_phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[#515151]" />
                <span className="text-sm text-[#1d1d1f]">{order.customer_phone}</span>
              </div>
            )}
            {order.address && (
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-[#515151]" />
                <div className="text-sm text-[#1d1d1f]">
                  <p>{order.address}</p>
                  <p>
                    {order.zip} {order.city}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Integration status */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e6e6e6]/50">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#515151]">
            Integrationer
          </h2>
          <div className="space-y-3">
            <IntegrationStatus
              label="Fortnox faktura"
              value={order.fortnox_invoice_number}
            />
            <IntegrationStatus
              label="Ongoing order"
              value={order.ongoing_order_id}
            />
          </div>

          <div className="mt-4 rounded-xl bg-[#f5f5f7] px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#515151]">Betalstatus</span>
              <span className="text-sm font-medium text-[#1d1d1f] capitalize">
                {order.payment_status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Order items */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#e6e6e6]/50">
        <div className="border-b border-[#e6e6e6] px-6 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#515151]">
            Produkter
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e6e6e6] bg-[#f5f5f7]/60">
                <th className="px-6 py-3 text-left font-medium text-[#515151]">Produkt</th>
                <th className="px-6 py-3 text-left font-medium text-[#515151]">Artikelnr</th>
                <th className="px-6 py-3 text-right font-medium text-[#515151]">Antal</th>
                <th className="px-6 py-3 text-right font-medium text-[#515151]">Pris</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr
                  key={i}
                  className="border-b border-[#e6e6e6]/40 last:border-b-0"
                >
                  <td className="px-6 py-3.5 font-medium text-[#1d1d1f]">
                    {item.name}
                  </td>
                  <td className="px-6 py-3.5 text-[#515151] tabular-nums">
                    {item.articleNumber}
                  </td>
                  <td className="px-6 py-3.5 text-right text-[#1d1d1f] tabular-nums">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-3.5 text-right font-medium text-[#1d1d1f] tabular-nums">
                    {formatCurrency(item.price)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-[#e6e6e6]">
                <td colSpan={3} className="px-6 py-3 text-right text-sm text-[#515151]">
                  Frakt
                </td>
                <td className="px-6 py-3 text-right text-sm tabular-nums text-[#1d1d1f]">
                  {formatCurrency(order.shipping_cost)}
                </td>
              </tr>
              <tr className="bg-[#f5f5f7]/60">
                <td colSpan={3} className="px-6 py-3 text-right font-semibold text-[#1d1d1f]">
                  Totalt
                </td>
                <td className="px-6 py-3 text-right font-semibold tabular-nums text-[#1d1d1f]">
                  {formatCurrency(order.total_amount + order.shipping_cost)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Internal notes */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e6e6e6]/50">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#515151]">
          Interna anteckningar
        </h2>
        <p className="text-sm text-[#1d1d1f] whitespace-pre-wrap">
          {order.internal_notes || "Inga anteckningar"}
        </p>
      </div>

      {/* Previous returns */}
      {order.returns.length > 0 && (
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e6e6e6]/50">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#515151]">
            Returer
          </h2>
          <div className="space-y-3">
            {order.returns.map((ret) => (
              <div
                key={ret.id}
                className="rounded-xl bg-[#f5f5f7] p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#1d1d1f]">
                      Retur #{ret.id}
                      {ret.fortnox_credit_number && (
                        <span className="ml-2 text-[#515151]">
                          Kreditnr: {ret.fortnox_credit_number}
                        </span>
                      )}
                    </p>
                    <p className="mt-1 text-xs text-[#515151]">{ret.reason}</p>
                    <p className="mt-1 text-xs text-[#515151]">
                      {formatDate(ret.created_at)} — {formatCurrency(ret.refund_amount)}
                    </p>
                  </div>
                  <StatusBadge status={ret.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Return form */}
      {showReturnForm && (
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e6e6e6]/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#515151]">
              Skapa retur
            </h2>
            <button
              onClick={() => setShowReturnForm(false)}
              className="text-sm text-[#515151] hover:text-[#1d1d1f]"
            >
              Avbryt
            </button>
          </div>

          {returnResult ? (
            <div className="rounded-xl bg-emerald-50 p-4">
              <p className="text-sm font-medium text-emerald-800">
                Returen har skapats
              </p>
              {returnResult.return?.fortnox_credit_number && (
                <p className="mt-1 text-sm text-emerald-700">
                  Kreditfaktura: {returnResult.return.fortnox_credit_number}
                </p>
              )}
              {returnResult.return?.ongoing_return_id && (
                <p className="mt-1 text-sm text-emerald-700">
                  Returorder-ID: {returnResult.return.ongoing_return_id}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Item checkboxes */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1d1d1f]">
                  Välj produkter
                </label>
                {returnItems.map((item, index) => (
                  <div
                    key={item.articleNumber}
                    className={`flex items-center gap-4 rounded-xl px-4 py-3 transition-colors ${
                      item.selected ? "bg-[#108474]/5 ring-1 ring-[#108474]/20" : "bg-[#f5f5f7]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.selected}
                      onChange={() => toggleReturnItem(index)}
                      className="h-4 w-4 rounded border-[#e6e6e6] text-[#108474] focus:ring-[#108474]/20"
                    />
                    <div className="flex-1 text-sm text-[#1d1d1f]">
                      {item.name}
                      <span className="ml-2 text-xs text-[#515151]">
                        ({item.articleNumber})
                      </span>
                    </div>
                    {item.selected && (
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-[#515151]">Antal:</label>
                        <input
                          type="number"
                          min={1}
                          max={item.maxQuantity}
                          value={item.quantity}
                          onChange={(e) =>
                            updateReturnQuantity(index, parseInt(e.target.value) || 1)
                          }
                          className="h-8 w-16 rounded-lg border border-[#e6e6e6] bg-white px-2 text-center text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-[#108474]/20"
                        />
                        <span className="text-xs text-[#515151]">
                          / {item.maxQuantity}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Reason */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#1d1d1f]">
                  Anledning
                </label>
                <textarea
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  rows={3}
                  placeholder="Beskriv anledningen till returen..."
                  className="w-full rounded-xl border border-[#e6e6e6] bg-white px-4 py-3 text-sm text-[#1d1d1f] placeholder:text-[#515151]/60 transition-shadow focus:outline-none focus:ring-2 focus:ring-[#108474]/20 focus:border-[#108474] resize-none"
                />
              </div>

              {/* Refund amount */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#1d1d1f]">
                  Återbetalningsbelopp (kr)
                </label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  min={0}
                  step={1}
                  className="h-10 w-full max-w-xs rounded-xl border border-[#e6e6e6] bg-white px-4 text-sm tabular-nums text-[#1d1d1f] transition-shadow focus:outline-none focus:ring-2 focus:ring-[#108474]/20 focus:border-[#108474]"
                />
              </div>

              {returnError && (
                <p className="text-sm text-red-600">{returnError}</p>
              )}

              <button
                onClick={handleSubmitReturn}
                disabled={submittingReturn}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#108474] px-5 text-sm font-medium text-white transition-all hover:bg-[#0d6e62] disabled:opacity-50"
              >
                {submittingReturn && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Skapa retur
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
