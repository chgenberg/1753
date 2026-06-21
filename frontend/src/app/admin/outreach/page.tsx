"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { authFetch } from "@/lib/api";
import { Loader2, Send, Power, ShieldCheck, ShieldAlert, RefreshCw, X } from "lucide-react";

interface OutreachSettings {
  paused: boolean;
  autonomous: boolean;
  daily_cap: number;
  from_name: string;
  from_email: string;
  reply_email: string;
  handoff_emails: string[] | string;
  campaign: string;
}

interface StatusCount { status: string; count: string | number; }
interface OutreachStats {
  byStatus: StatusCount[];
  firstTouchLast24h: number;
  totals: { contacts: string | number; outbound: string | number; inbound: string | number };
}

interface OverviewResponse {
  settings: OutreachSettings;
  stats: OutreachStats;
  campaignActive: boolean;
  emailConfigured: boolean;
  fromEmail: string;
}

interface Contact {
  id: number;
  email: string;
  name: string;
  segment: string;
  status: string;
  campaign: string;
  message_count: string | number;
  last_inbound_at: string | null;
  last_outbound_at: string | null;
  created_at: string;
}

interface ContactListResponse { contacts: Contact[]; total: number; page: number; perPage: number; }

interface Message {
  id: number;
  direction: "inbound" | "outbound";
  subject: string;
  body: string;
  status: string;
  intent: string;
  created_at: string;
}

interface ThreadResponse { contact: Contact; messages: Message[]; }

const SEGMENT_LABEL: Record<string, string> = {
  buyer_duotada: "Köpt DUO+TA-DA",
  buyer_other: "Köpare",
  analysis: "Hudanalys",
  newsletter: "Nyhetsbrev",
};

const STATUS_LABEL: Record<string, string> = {
  queued: "I kö",
  awaiting_reply: "Väntar svar",
  replied: "Svarat",
  handed_off: "Eskalerad",
  not_interested: "Ej intresserad",
  unsubscribed: "Avprenumererad",
  done: "Klar",
  error: "Fel",
};

function fmt(d: string | null): string {
  if (!d) return "–";
  return new Date(d).toLocaleString("sv-SE", { dateStyle: "short", timeStyle: "short" });
}

export default function OutreachAdminPage() {
  const { token } = useAuth();
  const [overview, setOverview] = useState<OverviewResponse | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seedText, setSeedText] = useState("");
  const [seedResult, setSeedResult] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [thread, setThread] = useState<ThreadResponse | null>(null);
  const [reply, setReply] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  const loadOverview = useCallback(async () => {
    if (!token) return;
    const data = await authFetch<OverviewResponse>("/admin/outreach", token);
    setOverview(data);
  }, [token]);

  const loadContacts = useCallback(async () => {
    if (!token) return;
    const data = await authFetch<ContactListResponse>(
      `/admin/outreach/contacts?status=${statusFilter}&page=1`,
      token
    );
    setContacts(data.contacts);
  }, [token, statusFilter]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        await Promise.all([loadOverview(), loadContacts()]);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    })();
  }, [loadOverview, loadContacts]);

  async function patchSettings(patch: Partial<OutreachSettings>) {
    if (!token) return;
    setSaving(true);
    try {
      await authFetch("/admin/outreach/settings", token, {
        method: "POST",
        body: JSON.stringify(patch),
      });
      await loadOverview();
    } finally {
      setSaving(false);
    }
  }

  async function runSeed() {
    if (!token) return;
    const emails = seedText
      .split(/[\s,;]+/)
      .map((e) => e.trim())
      .filter((e) => e.includes("@"));
    if (!emails.length) {
      setSeedResult("Inga giltiga e-postadresser hittades.");
      return;
    }
    setSeeding(true);
    setSeedResult(null);
    try {
      const r = await authFetch<{ queued: number; skippedSuppressed: number; skippedExisting: number; failed: number }>(
        "/admin/outreach/seed",
        token,
        { method: "POST", body: JSON.stringify({ emails }) }
      );
      setSeedResult(
        `Köade ${r.queued}. Hoppade över ${r.skippedExisting} (fanns redan), ${r.skippedSuppressed} (avprenumererade), ${r.failed} (fel).`
      );
      setSeedText("");
      await Promise.all([loadOverview(), loadContacts()]);
    } catch (e) {
      setSeedResult(e instanceof Error ? e.message : "Fel vid seedning.");
    } finally {
      setSeeding(false);
    }
  }

  async function openThread(id: number) {
    if (!token) return;
    const data = await authFetch<ThreadResponse>(`/admin/outreach/contacts/${id}`, token);
    setThread(data);
    setReply("");
  }

  async function sendManualReply() {
    if (!token || !thread || !reply.trim()) return;
    setSendingReply(true);
    try {
      await authFetch(`/admin/outreach/contacts/${thread.contact.id}/send`, token, {
        method: "POST",
        body: JSON.stringify({ subject: `Re: ${thread.messages[0]?.subject || "ditt mejl"}`, body: reply }),
      });
      await openThread(thread.contact.id);
      await loadContacts();
    } finally {
      setSendingReply(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#108474]" />
      </div>
    );
  }

  const s = overview?.settings;
  const live = s ? !s.paused : false;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1d1d1f]">Mejlagent</h1>
          <p className="text-sm text-[#515151]">
            Autonom outreach som skriver och svarar som Christopher. Avsändare:{" "}
            <span className="font-medium">{overview?.fromEmail || "(ej konfigurerad)"}</span>
          </p>
        </div>
        <button
          onClick={() => { loadOverview(); loadContacts(); }}
          className="flex items-center gap-2 rounded-full border border-[#e6e6e6] px-4 py-2 text-sm text-[#1d1d1f] hover:bg-[#f5f5f7]"
        >
          <RefreshCw className="h-4 w-4" /> Uppdatera
        </button>
      </div>

      {/* Master-kontroll */}
      <div className="rounded-2xl border border-[#e6e6e6] bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${live ? "bg-[#108474]/10 text-[#108474]" : "bg-[#f5f5f7] text-[#766a62]"}`}>
              <Power className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-semibold text-[#1d1d1f]">{live ? "Live – skickar autonomt" : "Pausad"}</p>
              <p className="text-sm text-[#515151]">
                {live ? `Upp till ${s?.daily_cap} första-mejl/dag. Svarar automatiskt.` : "Inget skickas förrän du slår på."}
              </p>
            </div>
          </div>
          <button
            disabled={saving}
            onClick={() => patchSettings({ paused: live })}
            className={`rounded-full px-6 py-3 text-sm font-semibold text-white transition-colors disabled:opacity-50 ${live ? "bg-[#b3261e] hover:bg-[#9a1f18]" : "bg-[#108474] hover:bg-[#0c6b5d]"}`}
          >
            {saving ? "Sparar…" : live ? "Pausa agenten" : "Sätt agenten live"}
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wide text-[#766a62]">Dagskvot (första-mejl)</span>
            <input
              type="number"
              min={1}
              max={200}
              defaultValue={s?.daily_cap ?? 15}
              onBlur={(e) => patchSettings({ daily_cap: parseInt(e.target.value, 10) || 15 })}
              className="mt-1 h-11 w-full rounded-xl border border-[#e6e6e6] px-3 text-[#1d1d1f] focus:border-[#108474] focus:outline-none focus:ring-2 focus:ring-[#108474]/20"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wide text-[#766a62]">Handoff-mottagare (kommaseparerat)</span>
            <input
              type="text"
              defaultValue={Array.isArray(s?.handoff_emails) ? s?.handoff_emails.join(", ") : ""}
              placeholder="info@1753skin.com"
              onBlur={(e) => patchSettings({ handoff_emails: e.target.value.split(/[\s,;]+/).filter((x) => x.includes("@")) })}
              className="mt-1 h-11 w-full rounded-xl border border-[#e6e6e6] px-3 text-[#1d1d1f] focus:border-[#108474] focus:outline-none focus:ring-2 focus:ring-[#108474]/20"
            />
          </label>
          <div className="flex flex-col justify-end gap-2">
            <Badge ok={overview?.emailConfigured} okText="Resend konfigurerad" badText="Resend saknas" />
            <Badge ok={overview?.campaignActive} okText={`Kampanjkod "${s?.campaign}" aktiv`} badText={`Kod "${s?.campaign}" inaktiv – nämns ej`} />
          </div>
        </div>
      </div>

      {/* Statistik */}
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Kontakter" value={overview?.stats.totals.contacts ?? 0} />
        <StatCard label="Skickade (24h)" value={overview?.stats.firstTouchLast24h ?? 0} />
        <StatCard label="Utgående totalt" value={overview?.stats.totals.outbound ?? 0} />
        <StatCard label="Inkommande totalt" value={overview?.stats.totals.inbound ?? 0} />
      </div>

      {/* Seed */}
      <div className="rounded-2xl border border-[#e6e6e6] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#1d1d1f]">Lägg till mottagare</h2>
        <p className="mt-1 text-sm text-[#515151]">
          Klistra in e-postadresser (separerade med radbrytning eller komma). Segment bestäms automatiskt utifrån köp/hudanalys/nyhetsbrev. Avprenumererade hoppas över. Inget skickas förrän agenten är live.
        </p>
        <textarea
          value={seedText}
          onChange={(e) => setSeedText(e.target.value)}
          rows={4}
          placeholder="kund1@exempel.se&#10;kund2@exempel.se"
          className="mt-3 w-full rounded-xl border border-[#e6e6e6] p-3 text-sm text-[#1d1d1f] focus:border-[#108474] focus:outline-none focus:ring-2 focus:ring-[#108474]/20"
        />
        <div className="mt-3 flex items-center gap-3">
          <button
            disabled={seeding}
            onClick={runSeed}
            className="rounded-full bg-[#108474] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0c6b5d] disabled:opacity-50"
          >
            {seeding ? "Köar…" : "Köa mottagare"}
          </button>
          {seedResult && <span className="text-sm text-[#515151]">{seedResult}</span>}
        </div>
      </div>

      {/* Kontaktlista */}
      <div className="rounded-2xl border border-[#e6e6e6] bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-2 border-b border-[#e6e6e6] p-4">
          {["all", "queued", "awaiting_reply", "replied", "handed_off", "not_interested", "unsubscribed", "error"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${statusFilter === st ? "bg-[#1d1d1f] text-white" : "bg-[#f5f5f7] text-[#515151] hover:bg-[#e6e6e6]"}`}
            >
              {st === "all" ? "Alla" : STATUS_LABEL[st] || st}
            </button>
          ))}
        </div>
        <div className="divide-y divide-[#f0f0f0]">
          {contacts.length === 0 && (
            <p className="p-6 text-center text-sm text-[#766a62]">Inga kontakter ännu.</p>
          )}
          {contacts.map((c) => (
            <button
              key={c.id}
              onClick={() => openThread(c.id)}
              className="flex w-full items-center justify-between gap-4 p-4 text-left hover:bg-[#f5f5f7]"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-[#1d1d1f]">{c.name || c.email}</p>
                <p className="truncate text-xs text-[#766a62]">{c.email}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="hidden rounded-full bg-[#f5f5f7] px-2.5 py-1 text-xs text-[#515151] sm:inline">
                  {SEGMENT_LABEL[c.segment] || c.segment}
                </span>
                <span className="rounded-full bg-[#108474]/10 px-2.5 py-1 text-xs font-medium text-[#108474]">
                  {STATUS_LABEL[c.status] || c.status}
                </span>
                <span className="hidden text-xs text-[#766a62] md:inline">{fmt(c.last_outbound_at || c.created_at)}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tråd-modal */}
      {thread && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-6" onClick={() => setThread(null)}>
          <div
            className="flex max-h-[90dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#e6e6e6] p-4">
              <div className="min-w-0">
                <p className="truncate font-semibold text-[#1d1d1f]">{thread.contact.name || thread.contact.email}</p>
                <p className="truncate text-xs text-[#766a62]">{thread.contact.email} · {SEGMENT_LABEL[thread.contact.segment] || thread.contact.segment}</p>
              </div>
              <button onClick={() => setThread(null)} className="rounded-lg p-2 text-[#766a62] hover:bg-[#f5f5f7]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {thread.messages.length === 0 && <p className="text-center text-sm text-[#766a62]">Inga meddelanden ännu.</p>}
              {thread.messages.map((m) => (
                <div key={m.id} className={`flex ${m.direction === "outbound" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm ${m.direction === "outbound" ? "bg-[#108474] text-white" : "bg-[#f5f5f7] text-[#1d1d1f]"}`}>
                    {m.subject && <p className={`mb-1 text-xs font-semibold ${m.direction === "outbound" ? "text-white/80" : "text-[#766a62]"}`}>{m.subject}</p>}
                    {m.body}
                    <p className={`mt-1 text-[10px] ${m.direction === "outbound" ? "text-white/60" : "text-[#a8a8a8]"}`}>
                      {fmt(m.created_at)}{m.status === "scheduled" ? " · schemalagt" : ""}{m.intent ? ` · ${m.intent}` : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-[#e6e6e6] p-4">
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={3}
                placeholder="Skriv ett manuellt svar (skickas direkt som Christopher)…"
                className="w-full rounded-xl border border-[#e6e6e6] p-3 text-sm text-[#1d1d1f] focus:border-[#108474] focus:outline-none focus:ring-2 focus:ring-[#108474]/20"
              />
              <div className="mt-2 flex justify-end">
                <button
                  disabled={sendingReply || !reply.trim()}
                  onClick={sendManualReply}
                  className="flex items-center gap-2 rounded-full bg-[#108474] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0c6b5d] disabled:opacity-50"
                >
                  <Send className="h-4 w-4" /> {sendingReply ? "Skickar…" : "Skicka svar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-[#e6e6e6] bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-[#766a62]">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-[#1d1d1f]">{value}</p>
    </div>
  );
}

function Badge({ ok, okText, badText }: { ok: boolean | undefined; okText: string; badText: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${ok ? "bg-[#108474]/10 text-[#108474]" : "bg-[#b3261e]/10 text-[#b3261e]"}`}>
      {ok ? <ShieldCheck className="h-3.5 w-3.5" /> : <ShieldAlert className="h-3.5 w-3.5" />}
      {ok ? okText : badText}
    </span>
  );
}
