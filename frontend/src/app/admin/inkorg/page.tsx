"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { authFetch } from "@/lib/api";
import {
  ArrowLeft,
  Check,
  Inbox,
  Loader2,
  Mail,
  RefreshCw,
  Send,
  Sparkles,
  Trash2,
  User,
} from "lucide-react";

interface Conversation {
  id: number;
  from_email: string;
  from_name: string;
  subject: string;
  body_text: string;
  ai_draft: string;
  status: string;
  category: string;
  customer_context: Record<string, unknown>;
  admin_reply: string;
  sent_at: string | null;
  created_at: string;
}

interface ListResponse {
  conversations: Conversation[];
  total: number;
  page: number;
  perPage: number;
}

const STATUS_TABS = [
  { value: "", label: "Alla" },
  { value: "pending", label: "Väntande" },
  { value: "sent", label: "Besvarade" },
  { value: "dismissed", label: "Arkiverade" },
];

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("sv-SE", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusBadge(status: string) {
  const map: Record<string, { label: string; cls: string }> = {
    pending: { label: "Väntande", cls: "bg-amber-50 text-amber-700" },
    sent: { label: "Besvarad", cls: "bg-emerald-50 text-emerald-700" },
    dismissed: { label: "Arkiverad", cls: "bg-gray-100 text-gray-500" },
  };
  const s = map[status] || { label: status, cls: "bg-gray-100 text-gray-500" };
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${s.cls}`}>
      {s.label}
    </span>
  );
}

export default function AdminInboxPage() {
  const { token } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState<Conversation | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [actionMsg, setActionMsg] = useState("");

  const fetchList = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (statusFilter) params.set("status", statusFilter);
      const data = await authFetch<ListResponse>(`/admin/inbox?${params}`, token);
      setConversations(data.conversations);
      setTotal(data.total);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, [token, page, statusFilter]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const openConversation = (conv: Conversation) => {
    setSelected(conv);
    setReplyText(conv.admin_reply || conv.ai_draft || "");
    setActionMsg("");
  };

  const handleSend = async () => {
    if (!token || !selected || !replyText.trim()) return;
    setSending(true);
    try {
      await authFetch(`/admin/inbox/${selected.id}/send`, token, {
        method: "POST",
        body: JSON.stringify({ reply: replyText }),
      });
      setActionMsg("Svar skickat!");
      setSelected({ ...selected, status: "sent", admin_reply: replyText, sent_at: new Date().toISOString() });
      fetchList();
    } catch (err) {
      setActionMsg(err instanceof Error ? err.message : "Kunde inte skicka");
    } finally {
      setSending(false);
    }
  };

  const handleRegenerate = async () => {
    if (!token || !selected) return;
    setRegenerating(true);
    try {
      const data = await authFetch<{ aiDraft: string }>(
        `/admin/inbox/${selected.id}/regenerate`,
        token,
        { method: "POST" }
      );
      setReplyText(data.aiDraft);
      setSelected({ ...selected, ai_draft: data.aiDraft });
      setActionMsg("Nytt utkast genererat");
    } catch {
      setActionMsg("Kunde inte generera nytt utkast");
    } finally {
      setRegenerating(false);
    }
  };

  const handleDismiss = async () => {
    if (!token || !selected) return;
    try {
      await authFetch(`/admin/inbox/${selected.id}/dismiss`, token, { method: "POST" });
      setSelected(null);
      fetchList();
    } catch {
      /* silent */
    }
  };

  if (selected) {
    const ctx = selected.customer_context as {
      orders?: { order_number: string; status: string; total_amount: number }[];
      loyaltyPoints?: number;
      tier?: string;
    };

    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelected(null)}
          className="flex items-center gap-2 text-sm text-[#515151] hover:text-[#1d1d1f] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Tillbaka till inkorgen
        </button>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Customer message */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e6e6e6]">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-[#1d1d1f]">{selected.subject}</h2>
                <p className="mt-1 text-sm text-[#515151]">
                  Från: {selected.from_name || selected.from_email}
                  {selected.from_name && (
                    <span className="text-[#766a62]"> &lt;{selected.from_email}&gt;</span>
                  )}
                </p>
                <p className="text-xs text-[#766a62]">{formatDate(selected.created_at)}</p>
              </div>
              {statusBadge(selected.status)}
            </div>

            <div className="rounded-xl bg-[#f5f5f7] p-4 text-sm leading-relaxed text-[#1d1d1f] whitespace-pre-wrap">
              {selected.body_text}
            </div>

            {ctx.orders?.length ? (
              <div className="mt-4">
                <p className="text-xs font-medium text-[#766a62] mb-2 flex items-center gap-1">
                  <User className="h-3 w-3" /> Kundkontext
                </p>
                <div className="space-y-1">
                  {ctx.orders.map((o) => (
                    <p key={o.order_number} className="text-xs text-[#515151]">
                      {o.order_number}: {o.status} ({o.total_amount} kr)
                    </p>
                  ))}
                  {ctx.loyaltyPoints !== undefined && (
                    <p className="text-xs text-[#515151]">
                      Poäng: {ctx.loyaltyPoints} ({ctx.tier})
                    </p>
                  )}
                </div>
              </div>
            ) : null}
          </div>

          {/* Reply editor */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e6e6e6]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#1d1d1f] flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#108474]" />
                AI-genererat svar
              </h2>
              <button
                onClick={handleRegenerate}
                disabled={regenerating}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[#108474] transition-colors hover:bg-[#108474]/10 disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${regenerating ? "animate-spin" : ""}`} />
                {regenerating ? "Genererar..." : "Ny version"}
              </button>
            </div>

            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={16}
              className="w-full rounded-xl border border-[#e6e6e6] bg-[#f5f5f7] px-4 py-3 text-sm leading-relaxed text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#108474]/30 focus:border-[#108474] transition-colors resize-y"
            />

            {actionMsg && (
              <div className="mt-3 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700 flex items-center gap-2">
                <Check className="h-4 w-4" />
                {actionMsg}
              </div>
            )}

            <div className="mt-4 flex gap-3">
              <button
                onClick={handleSend}
                disabled={sending || !replyText.trim() || selected.status === "sent"}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#108474] px-5 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#0d6d60] hover:shadow-md active:scale-[0.98] disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                {sending ? "Skickar..." : selected.status === "sent" ? "Redan skickat" : "Godkänn och skicka"}
              </button>
              {selected.status !== "sent" && (
                <button
                  onClick={handleDismiss}
                  className="flex items-center gap-2 rounded-xl border border-[#e6e6e6] bg-white px-4 py-3 text-sm font-medium text-[#515151] transition-colors hover:bg-[#f5f5f7]"
                >
                  <Trash2 className="h-4 w-4" />
                  Arkivera
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(total / 25));
  const pendingCount = conversations.filter((c) => c.status === "pending").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#1d1d1f] flex items-center gap-3">
          Inkorg
          {pendingCount > 0 && (
            <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-[#108474] px-2 text-xs font-bold text-white">
              {pendingCount}
            </span>
          )}
        </h1>
        <p className="mt-1 text-sm text-[#515151]">
          AI-genererade svarsutkast på inkommande meddelanden
        </p>
      </div>

      <div className="flex gap-1.5 rounded-xl bg-[#f5f5f7] p-1 w-fit">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => { setPage(1); setStatusFilter(tab.value); }}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              statusFilter === tab.value
                ? "bg-white text-[#1d1d1f] shadow-sm"
                : "text-[#515151] hover:text-[#1d1d1f]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-[#e6e6e6]">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-[#108474]" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#515151]">
            <Inbox className="mb-3 h-10 w-10 text-[#e6e6e6]" />
            <p className="text-sm font-medium">Inga meddelanden</p>
            <p className="mt-1 text-xs text-[#766a62]">
              Meddelanden från kontaktformuläret och inkommande mejl visas här
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-[#e6e6e6]">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => openConversation(conv)}
                  className={`flex w-full items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-[#f5f5f7]/60 ${
                    conv.status === "pending" ? "bg-white" : "bg-[#f5f5f7]/30"
                  }`}
                >
                  <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#f5f5f7]">
                    <Mail className={`h-5 w-5 ${conv.status === "pending" ? "text-[#108474]" : "text-[#766a62]"}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className={`truncate text-sm ${conv.status === "pending" ? "font-semibold text-[#1d1d1f]" : "font-medium text-[#515151]"}`}>
                        {conv.from_name || conv.from_email}
                      </p>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {statusBadge(conv.status)}
                        <span className="text-xs text-[#766a62] tabular-nums">
                          {formatDate(conv.created_at)}
                        </span>
                      </div>
                    </div>
                    <p className="mt-0.5 text-sm font-medium text-[#1d1d1f]">{conv.subject}</p>
                    <p className="mt-0.5 truncate text-xs text-[#766a62]">
                      {conv.body_text.slice(0, 120)}
                      {conv.body_text.length > 120 ? "..." : ""}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-[#e6e6e6] px-5 py-3.5">
                <p className="text-xs text-[#515151]">
                  Sida {page} av {totalPages} ({total} meddelanden)
                </p>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-[#1d1d1f] hover:bg-[#f5f5f7] disabled:opacity-30"
                  >
                    Föregående
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-[#1d1d1f] hover:bg-[#f5f5f7] disabled:opacity-30"
                  >
                    Nästa
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
