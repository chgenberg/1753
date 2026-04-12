"use client";

import { useCallback, useEffect, useState } from "react";
import { authFetch } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import {
  Camera,
  Plus,
  Send,
  Clock,
  CheckCircle,
  AlertTriangle,
  Trash2,
  Edit3,
  RefreshCw,
  Share2,
  Sparkles,
  Calendar,
  Image as ImageIcon,
  Link,
  Unlink,
} from "lucide-react";

interface SocialPost {
  id: number;
  platform: string;
  post_type: string;
  image_url: string | null;
  image_path: string | null;
  caption_sv: string | null;
  caption_en: string | null;
  caption_linkedin_sv: string | null;
  caption_linkedin_en: string | null;
  hashtags: string | null;
  reference_images: string[];
  prompt_used: string | null;
  product_ids: string[];
  status: string;
  scheduled_at: string | null;
  published_at: string | null;
  ig_post_id: string | null;
  fb_post_id: string | null;
  li_post_id: string | null;
  error_message: string | null;
  created_at: string;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; icon: typeof CheckCircle }> = {
  draft: { label: "Utkast", bg: "bg-gray-100", text: "text-gray-700", icon: Edit3 },
  scheduled: { label: "Schemalagd", bg: "bg-blue-50", text: "text-blue-700", icon: Clock },
  published: { label: "Publicerad", bg: "bg-green-50", text: "text-green-700", icon: CheckCircle },
  failed: { label: "Misslyckad", bg: "bg-red-50", text: "text-red-700", icon: AlertTriangle },
};

const TYPE_LABELS: Record<string, string> = {
  product: "Produkt",
  lifestyle: "Lifestyle",
  mood: "Stämning",
};

const PRODUCT_OPTIONS = [
  { key: "TheONE", label: "The ONE CBD Face Cream" },
  { key: "ILOVE", label: "I LOVE Facial Oil" },
  { key: "TA-DA", label: "TA-DA Serum" },
  { key: "MR", label: "Makeup Remover" },
  { key: "Fungtastic", label: "Fungtastic Face Mask" },
  { key: "DUO", label: "DUO-kit" },
  { key: "DUO+TA-DA", label: "DUO + TA-DA" },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const BACKEND_BASE = API_URL.replace(/\/api\/?$/, "");

export default function AdminSocialPage() {
  const { token } = useAuth();
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");

  const [showGenerate, setShowGenerate] = useState(false);
  const [genType, setGenType] = useState("product");
  const [genProduct, setGenProduct] = useState("");
  const [genPrompt, setGenPrompt] = useState("");

  const [editingPost, setEditingPost] = useState<SocialPost | null>(null);
  const [editCaption, setEditCaption] = useState("");
  const [editLinkedinCaption, setEditLinkedinCaption] = useState("");
  const [editHashtags, setEditHashtags] = useState("");

  const [schedulePostId, setSchedulePostId] = useState<number | null>(null);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("10:00");
  const [pushToPubler, setPushToPubler] = useState(true);

  const [triggeringDaily, setTriggeringDaily] = useState(false);

  const [publerAccounts, setPublerAccounts] = useState<
    { id: string; name: string; provider: string; avatar?: string }[]
  >([]);
  const [publerConnected, setPublerConnected] = useState(false);
  const [publerWorkspace, setPublerWorkspace] = useState("");

  const loadPosts = useCallback(async () => {
    if (!token) return;
    try {
      const data = await authFetch<SocialPost[]>(
        `/admin/social${filterStatus ? `?status=${filterStatus}` : ""}`,
        token
      );
      setPosts(data);
    } catch (err) {
      console.error("Failed to load posts:", err);
    } finally {
      setLoading(false);
    }
  }, [token, filterStatus]);

  useEffect(() => { loadPosts(); }, [loadPosts]);

  useEffect(() => {
    if (!token) return;
    authFetch<{ connected: boolean; accounts: typeof publerAccounts; workspace: string }>(
      "/admin/social/accounts",
      token
    ).then((data) => {
      setPublerAccounts(data.accounts || []);
      setPublerConnected(data.connected || false);
      setPublerWorkspace(data.workspace || "");
    }).catch(() => {});
  }, [token]);

  async function handleGenerate() {
    if (!token) return;
    setGenerating(true);
    try {
      const body: Record<string, string> = { type: genType };
      if (genProduct) body.productKey = genProduct;
      if (genPrompt.trim()) body.customPrompt = genPrompt.trim();

      await authFetch("/admin/social/generate", token, {
        method: "POST",
        body: JSON.stringify(body),
      });

      setShowGenerate(false);
      setGenPrompt("");
      await loadPosts();
    } catch (err) {
      console.error("Generation failed:", err);
      alert("Bildgenerering misslyckades. Kontrollera att FAL_KEY och GEMINI_API_KEY finns i Railway.");
    } finally {
      setGenerating(false);
    }
  }

  async function handlePublish(postId: number) {
    if (!token || !confirm("Publicera nu till alla kopplade plattformar?")) return;
    try {
      await authFetch(`/admin/social/${postId}/publish`, token, { method: "POST" });
      await loadPosts();
    } catch (err) {
      console.error("Publish failed:", err);
      alert("Publicering misslyckades.");
    }
  }

  async function handleSchedule() {
    if (!token || !schedulePostId || !scheduleDate) return;
    try {
      const dt = new Date(`${scheduleDate}T${scheduleTime}:00`);
      await authFetch(`/admin/social/${schedulePostId}/schedule`, token, {
        method: "POST",
        body: JSON.stringify({ scheduled_at: dt.toISOString(), push_to_publer: pushToPubler }),
      });
      setSchedulePostId(null);
      await loadPosts();
    } catch (err: any) {
      console.error("Schedule failed:", err);
      alert(err?.message || "Schemaläggning misslyckades");
    }
  }

  async function handleDelete(postId: number) {
    if (!token || !confirm("Ta bort detta inlägg?")) return;
    try {
      await authFetch(`/admin/social/${postId}`, token, { method: "DELETE" });
      await loadPosts();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }

  async function handleSaveEdit() {
    if (!token || !editingPost) return;
    try {
      await authFetch(`/admin/social/${editingPost.id}`, token, {
        method: "PUT",
        body: JSON.stringify({ caption_sv: editCaption, caption_linkedin_sv: editLinkedinCaption, hashtags: editHashtags }),
      });
      setEditingPost(null);
      await loadPosts();
    } catch (err) {
      console.error("Save failed:", err);
    }
  }

  async function handleTriggerDaily() {
    if (!token || !confirm("Generera och publicera ett nytt inlagg nu (alla plattformar)?")) return;
    setTriggeringDaily(true);
    try {
      await authFetch("/admin/social/daily-generate", token, { method: "POST" });
      await loadPosts();
    } catch (err) {
      console.error("Daily generation failed:", err);
      alert("Daglig generering misslyckades.");
    } finally {
      setTriggeringDaily(false);
    }
  }

  function openEdit(post: SocialPost) {
    setEditingPost(post);
    setEditCaption(post.caption_sv || "");
    setEditLinkedinCaption(post.caption_linkedin_sv || "");
    setEditHashtags(post.hashtags || "");
  }

  const statusCounts = posts.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#108474] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1d1d1f]">Sociala medier</h1>
          <p className="mt-1 text-sm text-[#515151]">
            Generera och publicera inlägg till Instagram, Facebook och LinkedIn
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleTriggerDaily}
            disabled={triggeringDaily}
            className="inline-flex items-center gap-2 rounded-2xl border border-[#108474] px-5 py-2.5 text-sm font-medium text-[#108474] transition-all hover:bg-[#108474]/5 disabled:opacity-50"
          >
            {triggeringDaily ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Genererar och publicerar...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Publicera nu
              </>
            )}
          </button>
          <button
            onClick={() => setShowGenerate(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#108474] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#0d6b5e]"
          >
            <Sparkles className="h-4 w-4" />
            Generera inlägg
          </button>
        </div>
      </div>

      {/* Publer connection status */}
      <div className={`flex items-center gap-3 rounded-2xl border p-4 ${publerConnected ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"}`}>
        {publerConnected ? (
          <Link className="h-5 w-5 text-green-600" />
        ) : (
          <Unlink className="h-5 w-5 text-amber-600" />
        )}
        <div className="flex-1">
          <p className={`text-sm font-medium ${publerConnected ? "text-green-800" : "text-amber-800"}`}>
            {publerConnected
              ? `Publer ansluten (${publerWorkspace})`
              : "Publer ej ansluten"}
          </p>
          {publerConnected ? (
            <div className="space-y-0.5">
              <p className="text-xs text-green-600">
                {publerAccounts.map((a) => `${a.name} (${a.provider})`).join(", ")}
              </p>
              <p className="text-xs text-green-600/70">
                Daglig auto-publicering kl 10:00 CET
              </p>
            </div>
          ) : (
            <p className="text-xs text-amber-600">
              Koppla Instagram, Facebook och LinkedIn i Publer for att kunna publicera.
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(["draft", "scheduled", "published", "failed"] as const).map((s) => {
          const cfg = STATUS_CONFIG[s];
          const Icon = cfg.icon;
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(filterStatus === s ? "" : s)}
              className={`rounded-2xl border p-4 text-left transition-all ${
                filterStatus === s ? "border-[#108474] ring-1 ring-[#108474]" : "border-[#e6e6e6]"
              } bg-white`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${cfg.text}`} />
                <span className="text-xs font-medium text-[#515151]">{cfg.label}</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-[#1d1d1f]">{statusCounts[s] || 0}</p>
            </button>
          );
        })}
      </div>

      {/* Generate dialog */}
      {showGenerate && (
        <div className="rounded-2xl border border-[#e6e6e6] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#1d1d1f]">Generera nytt inlägg</h2>
          <p className="mt-1 text-sm text-[#515151]">
            AI skapar en bild med referensbilder och en caption automatiskt.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1d1d1f]">Typ</label>
              <select
                value={genType}
                onChange={(e) => setGenType(e.target.value)}
                className="w-full rounded-xl border border-[#e6e6e6] bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#108474]/30"
              >
                <option value="product">Produktbild</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="mood">Stämningsbild</option>
              </select>
            </div>

            {genType !== "mood" && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#1d1d1f]">Produkt</label>
                <select
                  value={genProduct}
                  onChange={(e) => setGenProduct(e.target.value)}
                  className="w-full rounded-xl border border-[#e6e6e6] bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#108474]/30"
                >
                  <option value="">Slumpmässig</option>
                  {PRODUCT_OPTIONS.map((p) => (
                    <option key={p.key} value={p.key}>{p.label}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="sm:col-span-full">
              <label className="mb-1.5 block text-sm font-medium text-[#1d1d1f]">
                Egen prompt (valfritt)
              </label>
              <textarea
                value={genPrompt}
                onChange={(e) => setGenPrompt(e.target.value)}
                rows={3}
                placeholder="Lämna tomt för automatisk prompt..."
                className="w-full rounded-xl border border-[#e6e6e6] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#108474]/30"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#108474] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#0d6b5e] disabled:opacity-50"
            >
              {generating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Genererar...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generera
                </>
              )}
            </button>
            <button
              onClick={() => setShowGenerate(false)}
              className="rounded-2xl border border-[#e6e6e6] px-5 py-2.5 text-sm font-medium text-[#515151] transition-all hover:bg-[#f5f5f7]"
            >
              Avbryt
            </button>
          </div>
        </div>
      )}

      {/* Posts grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          const cfg = STATUS_CONFIG[post.status] || STATUS_CONFIG.draft;
          const StatusIcon = cfg.icon;
          const imgSrc = post.image_path ? `${BACKEND_BASE}${post.image_path}` : null;

          return (
            <div
              key={post.id}
              className="group overflow-hidden rounded-2xl border border-[#e6e6e6] bg-white shadow-sm transition-all hover:shadow-md"
            >
              {/* Image */}
              <div className="relative aspect-square bg-[#f5f5f7]">
                {imgSrc ? (
                  <img
                    src={imgSrc}
                    alt={`Post ${post.id}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-[#e6e6e6]" />
                  </div>
                )}
                <div className="absolute left-3 top-3 flex gap-2">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.bg} ${cfg.text}`}>
                    <StatusIcon className="h-3 w-3" />
                    {cfg.label}
                  </span>
                  <span className="rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
                    {TYPE_LABELS[post.post_type] || post.post_type}
                  </span>
                </div>
                <div className="absolute right-3 top-3 flex gap-1.5">
                  {(post.platform === "all" || post.platform === "both" || post.platform === "instagram") && (
                    <span className="rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white">IG</span>
                  )}
                  {(post.platform === "all" || post.platform === "both" || post.platform === "facebook") && (
                    <span className="rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white">FB</span>
                  )}
                  {(post.platform === "all" || post.platform === "linkedin") && (
                    <span className="rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white">LI</span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="line-clamp-3 text-sm text-[#1d1d1f]">
                  {post.caption_sv || "Ingen caption"}
                </p>
                {post.caption_linkedin_sv && (
                  <p className="mt-1 line-clamp-2 text-xs text-[#515151]">
                    <span className="font-medium">LI:</span> {post.caption_linkedin_sv}
                  </p>
                )}
                {post.hashtags && (
                  <p className="mt-1 line-clamp-1 text-xs text-[#108474]">{post.hashtags}</p>
                )}
                <p className="mt-2 text-xs text-[#515151]">
                  {post.scheduled_at
                    ? `Schemalagd: ${new Date(post.scheduled_at).toLocaleString("sv-SE")}`
                    : post.published_at
                      ? `Publicerad: ${new Date(post.published_at).toLocaleString("sv-SE")}`
                      : `Skapad: ${new Date(post.created_at).toLocaleString("sv-SE")}`
                  }
                </p>
                {post.error_message && (
                  <p className="mt-1 text-xs text-red-600">{post.error_message}</p>
                )}

                {/* Actions */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.status === "draft" && (
                    <>
                      <button
                        onClick={() => handlePublish(post.id)}
                        className="inline-flex items-center gap-1 rounded-xl bg-[#108474] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#0d6b5e]"
                      >
                        <Send className="h-3 w-3" />
                        Publicera
                      </button>
                      <button
                        onClick={() => {
                          setSchedulePostId(post.id);
                          const tomorrow = new Date(Date.now() + 86400_000);
                          setScheduleDate(tomorrow.toISOString().split("T")[0]);
                        }}
                        className="inline-flex items-center gap-1 rounded-xl border border-[#e6e6e6] px-3 py-1.5 text-xs font-medium text-[#515151] hover:bg-[#f5f5f7]"
                      >
                        <Calendar className="h-3 w-3" />
                        Schemalägg
                      </button>
                      <button
                        onClick={() => openEdit(post)}
                        className="inline-flex items-center gap-1 rounded-xl border border-[#e6e6e6] px-3 py-1.5 text-xs font-medium text-[#515151] hover:bg-[#f5f5f7]"
                      >
                        <Edit3 className="h-3 w-3" />
                        Redigera
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="inline-flex items-center gap-1 rounded-xl border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {posts.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#e6e6e6] py-16 text-center">
          <Camera className="mx-auto h-12 w-12 text-[#e6e6e6]" />
          <p className="mt-4 text-sm font-medium text-[#515151]">Inga inlägg ännu</p>
          <p className="mt-1 text-xs text-[#515151]">
            Klicka "Generera inlägg" för att skapa ditt första AI-genererade inlägg.
          </p>
        </div>
      )}

      {/* Schedule dialog */}
      {schedulePostId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSchedulePostId(null)}>
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-[#1d1d1f]">Schemalägg publicering</h3>
            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-[#1d1d1f]">Datum</label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full rounded-xl border border-[#e6e6e6] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#108474]/30"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[#1d1d1f]">Tid</label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full rounded-xl border border-[#e6e6e6] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#108474]/30"
                />
              </div>
              {publerConnected && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pushToPubler}
                    onChange={(e) => setPushToPubler(e.target.checked)}
                    className="h-4 w-4 rounded border-[#e6e6e6] text-[#108474] focus:ring-[#108474]"
                  />
                  <span className="text-sm text-[#1d1d1f]">Skicka direkt till Publer</span>
                </label>
              )}
            </div>
            <div className="mt-5 flex gap-3">
              <button
                onClick={handleSchedule}
                className="flex-1 rounded-2xl bg-[#108474] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0d6b5e]"
              >
                {pushToPubler ? "Schemalägg via Publer" : "Schemalägg"}
              </button>
              <button
                onClick={() => setSchedulePostId(null)}
                className="rounded-2xl border border-[#e6e6e6] px-4 py-2.5 text-sm font-medium text-[#515151] hover:bg-[#f5f5f7]"
              >
                Avbryt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit dialog */}
      {editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setEditingPost(null)}>
          <div className="mx-4 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-[#1d1d1f]">Redigera inlägg #{editingPost.id}</h3>
            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-[#1d1d1f]">Caption – Instagram / Facebook</label>
                <textarea
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-[#e6e6e6] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#108474]/30"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[#1d1d1f]">Caption – LinkedIn</label>
                <textarea
                  value={editLinkedinCaption}
                  onChange={(e) => setEditLinkedinCaption(e.target.value)}
                  rows={6}
                  placeholder="Langre, mer professionell ton for LinkedIn..."
                  className="w-full rounded-xl border border-[#e6e6e6] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#108474]/30"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[#1d1d1f]">Hashtags</label>
                <input
                  type="text"
                  value={editHashtags}
                  onChange={(e) => setEditHashtags(e.target.value)}
                  className="w-full rounded-xl border border-[#e6e6e6] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#108474]/30"
                />
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <button
                onClick={handleSaveEdit}
                className="flex-1 rounded-2xl bg-[#108474] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0d6b5e]"
              >
                Spara
              </button>
              <button
                onClick={() => setEditingPost(null)}
                className="rounded-2xl border border-[#e6e6e6] px-4 py-2.5 text-sm font-medium text-[#515151] hover:bg-[#f5f5f7]"
              >
                Avbryt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
