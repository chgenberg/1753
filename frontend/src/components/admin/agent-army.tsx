"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { HelpCircle, Paperclip, Plus, X } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { API_URL, authFetch } from "@/lib/api";
import { parseBriefing } from "@/lib/agent-army/briefing";
import {
  hireFigures,
  portraitSrc,
  ringBoxRem,
  ringColRem,
  ringScale,
  seatStyle,
} from "@/lib/agent-army/desk-ui";

type DeskRule = {
  id: number;
  title: string;
  trigger: string;
  action: string;
  gate: string;
  approved: boolean;
  enabled: boolean;
};

type DeskMessage = {
  id: number | string;
  role: "you" | "agent";
  text: string;
  name?: string | null;
  createdAt: string;
};

type DeskRef = { id: number; kind: string; feel: string; url: string };

type Desk = {
  id: number;
  key: string;
  name: string;
  blurb: string;
  briefing: string;
  accent: string;
  portrait?: number;
  seeded: boolean;
  waiting: number;
  on: number;
  refs: DeskRef[];
  rules: DeskRule[];
  messages: DeskMessage[];
  ideas: string[];
};

type ArmyPayload = {
  desks: Desk[];
  group: { messages: DeskMessage[]; ideas: string[] };
  figures: { available: number[] };
  openai?: { ready: boolean; model?: string };
};

const SEAT_IMG = "h-[60%] w-auto max-w-[66%] object-contain object-center";
const DISPLAY = "font-[family-name:var(--font-fraunces)]";
const ACTION_LABEL: Record<string, string> = {
  "card.open": "Öppna kort",
  "email.draft": "Mejlutkast",
  "copy.draft": "Copyutkast",
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const raw = String(reader.result || "");
      resolve(raw.includes(",") ? raw.split(",")[1] : raw);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function AuthImage({
  src,
  token,
  alt,
  className,
}: {
  src: string;
  token: string;
  alt: string;
  className?: string;
}) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!src.startsWith("/admin/")) return;
    let revoked = "";
    let cancelled = false;
    fetch(`${API_URL}${src}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("bild");
        return res.blob();
      })
      .then((blob) => {
        if (cancelled || !blob) return;
        const url = URL.createObjectURL(blob);
        revoked = url;
        setBlobUrl(url);
      })
      .catch(() => {
        if (!cancelled) setBlobUrl(null);
      });
    return () => {
      cancelled = true;
      if (revoked) URL.revokeObjectURL(revoked);
    };
  }, [src, token]);

  if (!src.startsWith("/admin/")) {
    return <img src={src} alt={alt} className={className} />;
  }
  if (!blobUrl) {
    return <span className={`block bg-[#e6e6e6] ${className || ""}`} />;
  }
  return <img src={blobUrl} alt={alt} className={className} />;
}

function IdeasBar({
  ideas,
  open,
  onToggle,
  onPick,
  hint,
}: {
  ideas: string[];
  open: boolean;
  onToggle: () => void;
  onPick: (text: string) => void;
  hint: string;
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5">
        <p className="min-w-0 flex-1 text-[12px] text-[#515151]">{hint}</p>
        <button
          type="button"
          aria-expanded={open}
          aria-label="Förslag på uppdrag"
          onClick={onToggle}
          className={`inline-flex size-8 shrink-0 items-center justify-center rounded-full ${
            open ? "bg-[#108474]/10 text-[#108474]" : "text-[#515151] hover:bg-[#f5f5f7]"
          }`}
        >
          <HelpCircle className="size-4" aria-hidden />
        </button>
      </div>
      {open ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {ideas.map((idea) => (
            <button
              key={idea}
              type="button"
              onClick={() => onPick(idea)}
              className="max-w-full rounded-full border border-[#e6e6e6] bg-[#f5f5f7] px-3 py-1.5 text-left text-[12px] leading-snug hover:border-[#1d1d1f]"
            >
              {idea}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function BriefingPanel({ briefing }: { briefing: string }) {
  const blocks = parseBriefing(briefing);
  if (!blocks.jag && !blocks.gor && !blocks.vet && !blocks.lardom.length) {
    return (
      <p className="mt-3 text-sm text-[#515151]">
        Ingen utbildning än. Skriv i chatten eller ladda upp en referensbild.
      </p>
    );
  }
  return (
    <dl className="mt-3 space-y-3 text-sm">
      {blocks.jag ? (
        <div>
          <dt className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#766a62]">Jag</dt>
          <dd className="mt-1 whitespace-pre-wrap text-[#1d1d1f]">{blocks.jag}</dd>
        </div>
      ) : null}
      {blocks.gor ? (
        <div>
          <dt className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#766a62]">Gör</dt>
          <dd className="mt-1 whitespace-pre-wrap text-[#1d1d1f]">{blocks.gor}</dd>
        </div>
      ) : null}
      {blocks.vet ? (
        <div>
          <dt className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#766a62]">Vet</dt>
          <dd className="mt-1 whitespace-pre-wrap text-[#1d1d1f]">{blocks.vet}</dd>
        </div>
      ) : null}
      {blocks.lardom.length ? (
        <div>
          <dt className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#766a62]">Lärdom</dt>
          <dd className="mt-1 space-y-1 text-[#1d1d1f]">
            {blocks.lardom.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </dd>
        </div>
      ) : null}
      {blocks.saknas ? (
        <div>
          <dt className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#766a62]">Saknas</dt>
          <dd className="mt-1 text-[#1d1d1f]">{blocks.saknas}</dd>
        </div>
      ) : null}
      <p className="text-[12px] text-[#515151]">{blocks.klart ? "Utbildningen är klar." : "Utbildningen pågår."}</p>
    </dl>
  );
}

export function AgentArmy() {
  const { token } = useAuth();
  const [desks, setDesks] = useState<Desk[]>([]);
  const [groupMessages, setGroupMessages] = useState<DeskMessage[]>([]);
  const [groupIdeas, setGroupIdeas] = useState<string[]>([]);
  const [availableFigures, setAvailableFigures] = useState<number[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);
  const [openGroup, setOpenGroup] = useState(false);
  const [openHire, setOpenHire] = useState(false);
  const [hireName, setHireName] = useState("");
  const [hireFigure, setHireFigure] = useState<number | null>(null);
  const [showIdeas, setShowIdeas] = useState(false);
  const [draft, setDraft] = useState("");
  const [nameEdit, setNameEdit] = useState("");
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [confirmRule, setConfirmRule] = useState<{ id: number; title: string } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openaiReady, setOpenaiReady] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const greeted = useRef<Set<string>>(new Set());

  const apply = useCallback((data: ArmyPayload) => {
    setDesks(data.desks || []);
    setGroupMessages(data.group?.messages || []);
    setGroupIdeas(data.group?.ideas || []);
    setAvailableFigures(
      data.figures?.available ?? hireFigures((data.desks || []).map((d) => d.portrait ?? 0)),
    );
    if (typeof data.openai?.ready === "boolean") setOpenaiReady(data.openai.ready);
  }, []);

  const load = useCallback(async () => {
    if (!token) return;
    try {
      const data = await authFetch<ArmyPayload>("/admin/agenter", token);
      apply(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunde inte hämta agenterna");
    }
  }, [token, apply]);

  useEffect(() => {
    void load();
    setMounted(true);
  }, [load]);

  const open = desks.find((d) => d.id === openId) ?? null;

  useEffect(() => {
    if (open) setNameEdit(open.name);
    setShowIdeas(false);
  }, [open]);

  useEffect(() => {
    const el = threadRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [openId, openGroup, desks, groupMessages]);

  useEffect(() => {
    if (!token || !openId || greeted.current.has(String(openId))) return;
    const desk = desks.find((d) => d.id === openId);
    if (!desk || desk.messages.length > 0) return;
    greeted.current.add(String(openId));
    void authFetch("/admin/agenter/" + openId + "/chat", token, {
      method: "POST",
      body: JSON.stringify({ greet: true }),
    }).then(() => load());
  }, [openId, desks, token, load]);

  useEffect(() => {
    if (!token || !openGroup || greeted.current.has("group")) return;
    if (groupMessages.length > 0) return;
    greeted.current.add("group");
    void authFetch("/admin/agenter/group", token, {
      method: "POST",
      body: JSON.stringify({ greet: true }),
    }).then(() => load());
  }, [openGroup, groupMessages.length, token, load]);

  useEffect(() => {
    if (!openId && !openGroup && !openHire) return;
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      if (confirmRule) {
        setConfirmRule(null);
        return;
      }
      if (confirmRemove) {
        setConfirmRemove(false);
        return;
      }
      setOpenId(null);
      setOpenGroup(false);
      setOpenHire(false);
    }
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [openId, openGroup, openHire, confirmRemove, confirmRule]);

  function closeDialog() {
    setConfirmRule(null);
    setConfirmRemove(false);
    setNotice(null);
    setOpenId(null);
    setOpenGroup(false);
    setOpenHire(false);
    setShowIdeas(false);
  }

  async function hire() {
    if (!token) return;
    const name = hireName.trim().slice(0, 40);
    if (!name) return;
    setBusy("hire");
    try {
      const data = await authFetch<ArmyPayload & { hiredId?: number }>("/admin/agenter", token, {
        method: "POST",
        body: JSON.stringify({ name, portrait: hireFigure }),
      });
      apply(data);
      setOpenHire(false);
      if (data.hiredId) setOpenId(data.hiredId);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Kunde inte anställa");
    } finally {
      setBusy(null);
    }
  }

  async function removeDesk() {
    if (!token || !open || open.seeded) return;
    setBusy("remove");
    try {
      apply(await authFetch<ArmyPayload>(`/admin/agenter/${open.id}`, token, { method: "DELETE" }));
      greeted.current.delete(String(open.id));
      setConfirmRemove(false);
      setOpenId(null);
    } finally {
      setBusy(null);
    }
  }

  async function saveName() {
    if (!token || !open) return;
    const name = nameEdit.trim().slice(0, 40);
    if (!name || name === open.name) return;
    setBusy("name");
    try {
      apply(await authFetch<ArmyPayload>(`/admin/agenter/${open.id}`, token, {
        method: "PATCH",
        body: JSON.stringify({ name }),
      }));
    } finally {
      setBusy(null);
    }
  }

  async function sendChat() {
    if (!token || !open || draft.trim().length < 2) return;
    const text = draft.trim();
    setDraft("");
    setBusy("chat");
    setDesks((prev) =>
      prev.map((d) =>
        d.id === open.id
          ? {
              ...d,
              messages: [...d.messages, { id: `tmp-${Date.now()}`, role: "you", text, createdAt: new Date().toISOString() }],
            }
          : d,
      ),
    );
    try {
      apply(await authFetch<ArmyPayload>(`/admin/agenter/${open.id}/chat`, token, {
        method: "POST",
        body: JSON.stringify({ text }),
      }));
    } catch (err) {
      setDraft(text);
      setNotice(err instanceof Error ? err.message : "Chatten kunde inte svara.");
    } finally {
      setBusy(null);
    }
  }

  async function sendGroup() {
    if (!token || draft.trim().length < 2) return;
    const text = draft.trim();
    setDraft("");
    setBusy("group");
    setGroupMessages((prev) => [
      ...prev,
      { id: `tmp-${Date.now()}`, role: "you", text, createdAt: new Date().toISOString() },
    ]);
    try {
      apply(await authFetch<ArmyPayload>("/admin/agenter/group", token, {
        method: "POST",
        body: JSON.stringify({ text }),
      }));
    } catch (err) {
      setDraft(text);
      setNotice(err instanceof Error ? err.message : "Chatten kunde inte svara.");
    } finally {
      setBusy(null);
    }
  }

  async function uploadBrief(file: File) {
    if (!token || !open) return;
    setNotice(null);
    setBusy("brief");
    try {
      const data = await fileToBase64(file);
      apply(await authFetch<ArmyPayload>(`/admin/agenter/${open.id}/brief`, token, {
        method: "POST",
        body: JSON.stringify({ filename: file.name, mime: file.type, data }),
      }));
    } catch {
      setNotice("Kunde inte ladda upp. Filen kan vara för stor eller fel format.");
    } finally {
      setBusy(null);
    }
  }

  async function patchRule(id: number, action: "approve" | "toggle") {
    if (!token) return;
    setBusy(String(id));
    try {
      apply(await authFetch<ArmyPayload>(`/admin/agenter/rules/${id}`, token, {
        method: "PATCH",
        body: JSON.stringify({ action }),
      }));
    } finally {
      setBusy(null);
    }
  }

  async function removeRule() {
    if (!token || !confirmRule) return;
    setBusy(String(confirmRule.id));
    try {
      apply(await authFetch<ArmyPayload>(`/admin/agenter/rules/${confirmRule.id}`, token, { method: "DELETE" }));
      setConfirmRule(null);
    } finally {
      setBusy(null);
    }
  }

  const count = desks.length;
  const scale = ringScale(count || 1);
  const box = ringBoxRem(count || 1);
  const col = ringColRem(count || 1);
  const ringMax =
    count > 10
      ? "max-w-[28rem] sm:max-w-[40rem]"
      : count > 7
        ? "max-w-[26rem] sm:max-w-[38rem]"
        : "max-w-[24rem] sm:max-w-[36rem]";
  const ringVars = {
    "--seat-box": `${box.base}rem`,
    "--seat-box-sm": `${box.sm}rem`,
    "--seat-col": `${col.base}rem`,
    "--seat-col-sm": `${col.sm}rem`,
    "--seat-pad-x": `${0.75 * scale}rem`,
    "--seat-pad-b": `${0.875 * scale}rem`,
    "--seat-pad-t": `${0.5 * scale}rem`,
  } as CSSProperties;

  return (
    <div className="space-y-10">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#766a62]">Agentarmén</p>
        <h1 className={`${DISPLAY} mt-2 text-3xl tracking-[-0.02em] text-[#1d1d1f] sm:text-4xl`}>Uppdragen</h1>
        <p className="mt-3 text-sm leading-relaxed text-[#515151]">
          Samma porträtt som i Billboard Bee. Klicka på en anställd och skriv direkt. Chatten går mot
          samma OpenAI-nyckel som hudanalysen. Kassan och analysprompten rörs inte.
        </p>
        {openaiReady === false ? (
          <p className="mt-3 text-sm text-red-700">OpenAI-nyckeln saknas på servern. Sätt OPENAI_API_KEY.</p>
        ) : openaiReady ? (
          <p className="mt-3 text-sm text-[#108474]">Redo att chatta via OpenAI.</p>
        ) : null}
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      <div className={`relative mx-auto mt-2 aspect-square w-full ${ringMax}`} style={ringVars}>
        <div className="pointer-events-none absolute inset-[16%] rounded-full border border-[#e6e6e6]" aria-hidden />
        <button
          type="button"
          aria-pressed={openGroup}
          aria-label="Gruppchatt"
          onClick={() => {
            setOpenId(null);
            setOpenHire(false);
            setOpenGroup(true);
          }}
          className="absolute left-1/2 top-1/2 z-10 flex w-[7.5rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center sm:w-[8.5rem]"
        >
          <span className="flex h-14 items-center justify-center sm:h-16">
            {(desks.slice(0, 3).length ? desks.slice(0, 3) : [1, 2, 3]).map((item, i) => {
              const desk = typeof item === "number" ? null : item;
              const slot = desk?.portrait ?? (typeof item === "number" ? item : i + 1);
              return (
                <span
                  key={desk?.id ?? slot}
                  className={`size-10 overflow-hidden rounded-full bg-[#f5f5f7] ring-2 ring-white sm:size-11 ${
                    i === 0 ? "" : "-ml-3"
                  } ${openGroup ? "ring-[#108474]" : "ring-white"}`}
                >
                  <img src={portraitSrc(slot)} alt="" className="size-full object-cover object-[50%_12%]" />
                </span>
              );
            })}
          </span>
          <span className={`${DISPLAY} mt-1 text-sm sm:text-base`}>Alla</span>
          <span className="text-[10px] text-[#515151] sm:text-[11px]">Gruppchatt</span>
        </button>

        {desks.map((desk, i) => {
          const jobs = desk.on + desk.waiting;
          const selected = desk.id === openId;
          return (
            <button
              key={desk.id}
              type="button"
              aria-pressed={selected}
              aria-label={desk.name}
              onClick={() => {
                setOpenGroup(false);
                setOpenHire(false);
                setOpenId(desk.id);
              }}
              style={seatStyle(i, count)}
              className="absolute w-[var(--seat-col)] -translate-x-1/2 -translate-y-1/2 text-center sm:w-[var(--seat-col-sm)]"
            >
              <span
                className={`mx-auto flex size-[var(--seat-box)] items-center justify-center overflow-hidden rounded-full bg-[#f5f5f7] shadow-sm transition sm:size-[var(--seat-box-sm)] ${
                  selected
                    ? "ring-2 ring-[#108474] ring-offset-2"
                    : "ring-1 ring-[#e6e6e6] hover:ring-2 hover:ring-[#1d1d1f]"
                }`}
                style={{
                  paddingLeft: "var(--seat-pad-x)",
                  paddingRight: "var(--seat-pad-x)",
                  paddingBottom: "var(--seat-pad-b)",
                  paddingTop: "var(--seat-pad-t)",
                }}
              >
                <img src={portraitSrc(desk.portrait ?? 1)} alt="" className={SEAT_IMG} />
              </span>
              <span className={`${DISPLAY} mt-1.5 block truncate text-[13px] sm:text-sm`}>{desk.name}</span>
              <span className="block text-[10px] text-[#515151] sm:text-[11px]">
                {jobs === 0
                  ? "Inga uppdrag än"
                  : desk.waiting > 0
                    ? `${desk.waiting} väntar på dig`
                    : `${desk.on} igång`}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          disabled={availableFigures.length === 0}
          onClick={() => {
            setOpenId(null);
            setOpenGroup(false);
            setHireName("");
            setHireFigure(null);
            setOpenHire(true);
          }}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-[#e6e6e6] bg-white px-5 text-sm text-[#1d1d1f] shadow-sm transition hover:shadow-md disabled:opacity-40"
        >
          <Plus className="size-4" aria-hidden />
          Ny anställd
        </button>
      </div>

      <section className="mx-auto max-w-3xl rounded-[28px] bg-white p-6 shadow-sm">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#766a62]">Så delar de upp sajten</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            ["Butik", "Start, produkter, om oss. De skriver copy, ändrar inte priser."],
            ["Hudanalys", "Följer upp efter sparad analys. Rör inte quiz eller prompt."],
            ["Kassa", "Ser flödet. Trycker aldrig betala, Viva eller Fortnox."],
            ["Utskick", "Utkast och preview. Inget blast utan ditt ja."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-2xl bg-[#f5f5f7] px-4 py-3">
              <p className={`${DISPLAY} text-lg text-[#1d1d1f]`}>{title}</p>
              <p className="mt-1 text-sm text-[#515151]">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {mounted && open && token
        ? createPortal(
            <div
              className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-[2px] sm:items-center sm:p-6"
              role="dialog"
              aria-modal="true"
              aria-labelledby="desk-dialog-title"
              data-lenis-prevent
              onMouseDown={(e) => {
                if (e.target === e.currentTarget) closeDialog();
              }}
            >
              <div className="flex h-[min(56rem,94dvh)] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl">
                <div className="flex items-start gap-3 border-b border-[#e6e6e6] px-4 py-3 sm:px-5">
                  <span className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f5f5f7] p-1.5 ring-1 ring-[#e6e6e6] sm:size-[4.5rem] sm:p-2">
                    <img src={portraitSrc(open.portrait ?? 1)} alt="" className={SEAT_IMG} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <label className="block">
                      <span className="sr-only">Namn på anställd</span>
                      <input
                        id="desk-dialog-title"
                        value={nameEdit}
                        onChange={(e) => setNameEdit(e.target.value)}
                        onBlur={() => void saveName()}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            (e.target as HTMLInputElement).blur();
                          }
                        }}
                        className={`${DISPLAY} h-9 w-full bg-transparent text-xl outline-none focus:border-b focus:border-[#1d1d1f]`}
                      />
                    </label>
                    <IdeasBar
                      ideas={open.ideas}
                      open={showIdeas}
                      onToggle={() => setShowIdeas((v) => !v)}
                      onPick={(text) => {
                        setDraft(text);
                        setShowIdeas(false);
                      }}
                      hint="Utbilda med chatt eller bild. Du godkänner innan något går ut."
                    />
                  </div>
                  {!open.seeded ? (
                    <button
                      type="button"
                      disabled={busy === "remove"}
                      onClick={() => setConfirmRemove(true)}
                      className="rounded-full px-3 py-2 text-sm text-[#515151] hover:bg-[#f5f5f7]"
                    >
                      Radera
                    </button>
                  ) : null}
                  <button
                    type="button"
                    aria-label="Stäng"
                    onClick={closeDialog}
                    className="-mr-1 rounded-full p-2 text-[#515151] hover:bg-[#f5f5f7]"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.85fr)]">
                  <div className="flex min-h-[16rem] min-w-0 flex-col border-b border-[#e6e6e6] lg:border-b-0 lg:border-r">
                    <div ref={threadRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-5">
                      {open.messages.map((m) => (
                        <div key={m.id} className={`flex ${m.role === "you" ? "justify-end" : "justify-start"}`}>
                          <p
                            className={`max-w-[34rem] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                              m.role === "you"
                                ? "rounded-br-md bg-[#1d1d1f] text-white"
                                : "rounded-bl-md bg-[#f5f5f7] text-[#1d1d1f]"
                            }`}
                          >
                            {m.text}
                          </p>
                        </div>
                      ))}
                    </div>
                    {open.refs.length > 0 ? (
                      <div className="border-t border-[#e6e6e6] px-4 py-3">
                        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#766a62]">Referensbilder</p>
                        <p className="mt-1 text-[12px] text-[#515151]">Samma känsla på nästa bild</p>
                        <div className="mt-2 flex gap-2 overflow-x-auto">
                          {open.refs.map((ref) => (
                            <AuthImage
                              key={ref.id}
                              src={ref.url}
                              token={token}
                              alt=""
                              className="size-14 shrink-0 rounded-lg object-cover ring-1 ring-[#e6e6e6]"
                            />
                          ))}
                        </div>
                      </div>
                    ) : null}
                    {notice ? (
                      <p className="border-t border-[#e6e6e6] px-4 py-2 text-sm text-[#515151]" role="status">
                        {notice}
                      </p>
                    ) : null}
                    <form
                      className="flex items-center gap-2 border-t border-[#e6e6e6] px-3 py-3 sm:px-4"
                      onSubmit={(e) => {
                        e.preventDefault();
                        void sendChat();
                      }}
                    >
                      <input
                        ref={fileRef}
                        type="file"
                        accept=".txt,.md,.pdf,text/plain,application/pdf,image/jpeg,image/png,image/webp,image/gif"
                        className="sr-only"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          e.target.value = "";
                          if (file) void uploadBrief(file);
                        }}
                      />
                      <button
                        type="button"
                        aria-label="Ladda upp arbetsbeskrivning eller referensbild"
                        disabled={busy === "brief"}
                        onClick={() => fileRef.current?.click()}
                        className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-[#e6e6e6] disabled:opacity-40"
                      >
                        <Paperclip className="size-4" aria-hidden />
                      </button>
                      <label className="min-w-0 flex-1">
                        <span className="sr-only">Meddelande till anställd</span>
                        <input
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          placeholder={`Skriv till ${open.name}…`}
                          className="h-11 w-full rounded-full border border-[#e6e6e6] bg-[#f5f5f7] px-4 text-sm outline-none focus:border-[#1d1d1f] focus:ring-2 focus:ring-[#108474]/20"
                        />
                      </label>
                      <button
                        type="submit"
                        disabled={draft.trim().length < 2 || busy === "chat"}
                        className="h-11 shrink-0 rounded-full bg-[#108474] px-5 text-sm text-white disabled:opacity-40"
                      >
                        Skicka
                      </button>
                    </form>
                  </div>

                  <div className="min-w-0 overflow-y-auto bg-[#f5f5f7]/70 px-4 py-4 sm:px-5">
                    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#766a62]">Utbildning</p>
                    <BriefingPanel briefing={open.briefing} />
                    <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.16em] text-[#766a62]">Uppdrag</p>
                    {open.rules.length === 0 ? (
                      <p className="mt-3 text-sm text-[#515151]">Inga uppdrag än. Skriv i chatten.</p>
                    ) : (
                      <ul className="mt-3 space-y-2">
                        {open.rules.map((rule) => (
                          <li key={rule.id} className="rounded-2xl border border-[#e6e6e6] bg-white px-4 py-3">
                            <p className="text-sm font-medium leading-snug">{rule.title}</p>
                            <p className="mt-1 text-[12px] text-[#515151]">
                              {!rule.approved ? "Utkast — körs inte" : rule.enabled ? "Uppgift på" : "Uppgift av"}
                              {rule.gate === "email" ? " · Mejl" : ""}
                              {ACTION_LABEL[rule.action] ? ` · ${ACTION_LABEL[rule.action]}` : ""}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {!rule.approved ? (
                                <button
                                  type="button"
                                  disabled={busy === String(rule.id)}
                                  onClick={() => void patchRule(rule.id, "approve")}
                                  className="h-9 rounded-full bg-[#1d1d1f] px-3.5 text-[13px] text-white disabled:opacity-50"
                                >
                                  Godkänn
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  disabled={busy === String(rule.id)}
                                  onClick={() => void patchRule(rule.id, "toggle")}
                                  className="h-9 rounded-full border border-[#e6e6e6] px-3.5 text-[13px] disabled:opacity-50"
                                >
                                  {rule.enabled ? "Slå av" : "Slå på"}
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => setConfirmRule({ id: rule.id, title: rule.title })}
                                className="h-9 rounded-full px-3 text-[13px] text-[#515151] underline-offset-2 hover:underline"
                              >
                                Ta bort
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                    <p className="mt-4 text-[12px] leading-relaxed text-[#515151]">
                      Godkända uppdrag sparas. De skickar inte mejl och rör inte kassan.
                    </p>
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}

      {mounted && open && confirmRemove
        ? createPortal(
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-6" role="alertdialog" aria-modal="true">
              <div className="w-full max-w-md rounded-[28px] bg-white p-7">
                <p className={`${DISPLAY} text-xl`}>Ta bort den här anställda?</p>
                <div className="mt-6 flex justify-end gap-2">
                  <button type="button" onClick={() => setConfirmRemove(false)} className="h-11 rounded-full border border-[#e6e6e6] px-5 text-sm">
                    Avbryt
                  </button>
                  <button type="button" disabled={busy === "remove"} onClick={() => void removeDesk()} className="h-11 rounded-full bg-[#1d1d1f] px-5 text-sm text-white">
                    Radera
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}

      {mounted && confirmRule
        ? createPortal(
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-6" role="alertdialog" aria-modal="true">
              <div className="w-full max-w-md rounded-[28px] bg-white p-7">
                <p className={`${DISPLAY} text-xl`}>Ta bort uppdraget?</p>
                <p className="mt-2 text-sm text-[#515151]">{confirmRule.title}</p>
                <div className="mt-6 flex justify-end gap-2">
                  <button type="button" onClick={() => setConfirmRule(null)} className="h-11 rounded-full border border-[#e6e6e6] px-5 text-sm">
                    Avbryt
                  </button>
                  <button type="button" disabled={busy === String(confirmRule.id)} onClick={() => void removeRule()} className="h-11 rounded-full bg-[#1d1d1f] px-5 text-sm text-white">
                    Radera
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}

      {mounted && openGroup && token
        ? createPortal(
            <div
              className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3 sm:items-center sm:p-6"
              role="dialog"
              aria-modal="true"
              data-lenis-prevent
              onMouseDown={(e) => {
                if (e.target === e.currentTarget) closeDialog();
              }}
            >
              <div className="flex h-[min(56rem,94dvh)] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl">
                <div className="flex items-start gap-3 border-b border-[#e6e6e6] px-4 py-3 sm:px-5">
                  <span className="flex h-14 shrink-0 items-center sm:h-16">
                    {desks.slice(0, 3).map((desk, i) => (
                      <span key={desk.id} className={`size-10 overflow-hidden rounded-full bg-[#f5f5f7] ring-2 ring-white sm:size-11 ${i === 0 ? "" : "-ml-3"}`}>
                        <img src={portraitSrc(desk.portrait ?? i + 1)} alt="" className="size-full object-cover object-[50%_12%]" />
                      </span>
                    ))}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className={`${DISPLAY} text-xl`}>Alla anställda</h3>
                    <IdeasBar
                      ideas={groupIdeas}
                      open={showIdeas}
                      onToggle={() => setShowIdeas((v) => !v)}
                      onPick={(text) => {
                        setDraft(text);
                        setShowIdeas(false);
                      }}
                      hint="De delar upp. Du godkänner innan något går ut."
                    />
                  </div>
                  <button type="button" aria-label="Stäng" onClick={closeDialog} className="rounded-full p-2 text-[#515151] hover:bg-[#f5f5f7]">
                    <X className="size-5" />
                  </button>
                </div>
                <div className="flex min-h-0 flex-1 flex-col">
                  {notice ? (
                    <p className="border-b border-[#e6e6e6] px-4 py-2 text-sm text-[#515151]" role="status">
                      {notice}
                    </p>
                  ) : null}
                  <div ref={threadRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-5">
                    {groupMessages.map((m) => (
                      <div key={m.id} className={`flex ${m.role === "you" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[34rem] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === "you" ? "rounded-br-md bg-[#1d1d1f] text-white" : "rounded-bl-md bg-[#f5f5f7] text-[#1d1d1f]"}`}>
                          {m.role === "agent" && m.name ? (
                            <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.12em] text-[#766a62]">{m.name}</p>
                          ) : null}
                          <p className="whitespace-pre-wrap">{m.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <form
                    className="flex items-center gap-2 border-t border-[#e6e6e6] px-4 py-3"
                    onSubmit={(e) => {
                      e.preventDefault();
                      void sendGroup();
                    }}
                  >
                    <input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="Fråga läget eller ge ett uppdrag."
                      className="h-11 min-w-0 flex-1 rounded-full border border-[#e6e6e6] bg-[#f5f5f7] px-4 text-sm outline-none focus:border-[#1d1d1f]"
                    />
                    <button type="submit" disabled={draft.trim().length < 2 || busy === "group"} className="h-11 rounded-full bg-[#108474] px-5 text-sm text-white disabled:opacity-40">
                      Skicka
                    </button>
                  </form>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}

      {mounted && openHire
        ? createPortal(
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6"
              role="dialog"
              aria-modal="true"
              onMouseDown={(e) => {
                if (e.target === e.currentTarget) closeDialog();
              }}
            >
              <div className="w-full max-w-lg rounded-[28px] bg-white p-6 sm:p-7">
                <h3 className={`${DISPLAY} text-2xl`}>Ny anställd</h3>
                <p className="mt-2 text-sm text-[#515151]">Välj ett ledigt porträtt från Billboard Bee och ge ett namn.</p>
                <label className="mt-5 block">
                  <span className="sr-only">Namn</span>
                  <input
                    value={hireName}
                    onChange={(e) => setHireName(e.target.value)}
                    placeholder="Namn"
                    className="h-12 w-full rounded-xl border border-[#e6e6e6] px-4 text-sm outline-none focus:ring-2 focus:ring-[#108474]/20"
                  />
                </label>
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {availableFigures.map((n) => (
                    <button
                      key={n}
                      type="button"
                      aria-pressed={hireFigure === n}
                      onClick={() => setHireFigure(n)}
                      className={`flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-[#f5f5f7] ${
                        hireFigure === n ? "ring-2 ring-[#108474]" : "ring-1 ring-[#e6e6e6]"
                      }`}
                    >
                      <img src={portraitSrc(n)} alt={`Figur ${n}`} className="h-[70%] w-auto object-contain" />
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex justify-end gap-2">
                  <button type="button" onClick={closeDialog} className="h-11 rounded-full border border-[#e6e6e6] px-5 text-sm">
                    Avbryt
                  </button>
                  <button
                    type="button"
                    disabled={!hireName.trim() || busy === "hire"}
                    onClick={() => void hire()}
                    className="h-11 rounded-full bg-[#108474] px-5 text-sm text-white disabled:opacity-40"
                  >
                    Anställ
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
