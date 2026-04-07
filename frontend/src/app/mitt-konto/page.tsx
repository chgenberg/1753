"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  CalendarClock,
  Gift,
  Heart,
  LayoutDashboard,
  LogOut,
  Package,
  RefreshCcw,
  Settings,
  Star,
  Sparkles,
  TrendingUp,
  User,
  Loader2,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { authFetch } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/notification";

type View =
  | "oversikt"
  | "hudresa"
  | "ordrar"
  | "rutin"
  | "formaner"
  | "prenumerationer"
  | "onskelista"
  | "installningar";

interface DashboardStats {
  loyaltyPoints: number;
  tier: string;
  orderCount: number;
  memberSince: string;
}

interface Order {
  id: number;
  order_number: string;
  status: string;
  payment_status: string;
  items: { id: string; name: string; qty: number; price: number }[];
  total_amount: number;
  shipping_cost: number;
  created_at: string;
}

const SIDEBAR_ITEMS: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "oversikt", label: "Översikt", icon: LayoutDashboard },
  { id: "hudresa", label: "Min hudresa", icon: TrendingUp },
  { id: "ordrar", label: "Mina ordrar", icon: Package },
  { id: "rutin", label: "Min rutin", icon: CalendarClock },
  { id: "formaner", label: "Förmåner", icon: Gift },
  { id: "prenumerationer", label: "Prenumerationer", icon: RefreshCcw },
  { id: "onskelista", label: "Önskelista", icon: Heart },
  { id: "installningar", label: "Inställningar", icon: Settings },
];

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  pending: { label: "Väntar", className: "bg-amber-50 text-amber-700" },
  confirmed: { label: "Bekräftad", className: "bg-blue-50 text-blue-700" },
  fulfilled: { label: "Skickad", className: "bg-green-50 text-green-700" },
  partial: { label: "Delvis klar", className: "bg-orange-50 text-orange-700" },
  paid: { label: "Betald", className: "bg-green-50 text-green-700" },
};

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-xl bg-red-50 px-5 py-4 text-sm text-red-700">
      {message}
    </div>
  );
}

const TIER_THRESHOLDS: Record<string, { next: string; points: number }> = {
  Brons: { next: "Silver", points: 2000 },
  Silver: { next: "Guld", points: 5000 },
  Guld: { next: "Platina", points: 10000 },
  Platina: { next: "", points: 10000 },
};

function OverviewView({ stats, loading, error, userName }: { stats: DashboardStats | null; loading: boolean; error: string; userName: string }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-brand-400" />
      </div>
    );
  }

  const tier = stats?.tier ?? "Brons";
  const points = stats?.loyaltyPoints ?? 0;
  const info = TIER_THRESHOLDS[tier] || TIER_THRESHOLDS.Brons;
  const progress = tier === "Platina" ? 100 : Math.min(100, Math.round((points / info.points) * 100));
  const remaining = Math.max(0, info.points - points);

  return (
    <div className="space-y-8">
      {error && <ErrorBanner message={error} />}

      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Hej, {userName?.split(" ")[0] || "du"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {tier}-medlem &middot; {points.toLocaleString("sv-SE")} poäng
        </p>
        {info.next && (
          <div className="mt-4 max-w-md">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{tier}</span>
              <span>{info.next}</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-brand-100">
              <div
                className="h-full rounded-full bg-brand-900 transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              {remaining.toLocaleString("sv-SE")} poäng kvar till {info.next}
            </p>
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl bg-brand-50 p-6 sm:col-span-2">
          <Package className="mb-2 h-5 w-5 text-brand-700" />
          <p className="text-3xl font-bold tracking-tight">{String(stats?.orderCount ?? 0)}</p>
          <p className="text-sm text-brand-600">Beställningar</p>
        </div>
        <div className="rounded-xl bg-brand-50 p-6 sm:col-span-2">
          <Star className="mb-2 h-5 w-5 text-brand-700" />
          <p className="text-3xl font-bold tracking-tight">{points.toLocaleString("sv-SE")}</p>
          <p className="text-sm text-brand-600">Poäng</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-5">
          <Gift className="mb-2 h-4 w-4 text-brand-400" />
          <p className="text-lg font-bold">{tier}</p>
          <p className="text-xs text-muted-foreground">Nivå</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-5">
          <TrendingUp className="mb-2 h-4 w-4 text-brand-400" />
          <p className="text-lg font-bold">
            {stats?.memberSince
              ? new Date(stats.memberSince).toLocaleDateString("sv-SE", { year: "numeric", month: "short" })
              : "-"}
          </p>
          <p className="text-xs text-muted-foreground">Medlem sedan</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <a href="/produkter" className="rounded-xl border border-brand-200 px-4 py-2.5 text-sm font-medium text-brand-900 transition-colors hover:bg-brand-50">
          Gör en ny beställning
        </a>
        <a href="/hudanalys" className="rounded-xl border border-brand-200 px-4 py-2.5 text-sm font-medium text-brand-900 transition-colors hover:bg-brand-50">
          Starta hudanalys
        </a>
      </div>
    </div>
  );
}

function SkinJourneyView() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold tracking-tight">Min hudresa</h2>
      <p className="text-sm text-muted-foreground">
        Följ din utveckling och se hur din hud förbättras över tid.
      </p>
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100/50 p-8 md:p-12">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-brand-200/30" />
        <div className="absolute -bottom-12 -left-6 h-32 w-32 rounded-full bg-brand-200/20" />
        <div className="relative z-10 max-w-md">
          <BarChart3 className="mb-4 h-8 w-8 text-brand-700" />
          <h3 className="text-xl font-bold tracking-tight text-brand-900">
            Starta din hudresa
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-brand-600">
            Gör en AI-driven hudanalys och få personliga rekommendationer. 
            Vi spårar din utveckling över tid så att du kan se konkreta resultat.
          </p>
          <a href="/hudanalys">
            <Button className="mt-6 h-12 rounded-xl px-8">
              Gör din första hudanalys
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}

function relativeDate(dateStr: string): string {
  const now = new Date();
  const then = new Date(dateStr);
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays === 0) return "Idag";
  if (diffDays === 1) return "Igår";
  if (diffDays < 7) return `${diffDays} dagar sedan`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} veckor sedan`;
  return new Date(dateStr).toLocaleDateString("sv-SE", { year: "numeric", month: "long", day: "numeric" });
}

function OrdersView({ orders, loading, error }: { orders: Order[]; loading: boolean; error: string }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-brand-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold tracking-tight">Mina ordrar</h2>
      {error && <ErrorBanner message={error} />}
      {!error && orders.length === 0 ? (
        <div className="rounded-xl border border-border p-6 text-center">
          <Package className="mx-auto mb-3 h-10 w-10 text-brand-300" />
          <p className="text-sm text-muted-foreground">
            Inga ordrar ännu. Dags att utforska vårt sortiment?
          </p>
          <a href="/produkter">
            <Button className="mt-4 rounded-xl">Se produkter</Button>
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = STATUS_LABELS[order.status] || STATUS_LABELS.pending;
            const paymentStatus = STATUS_LABELS[order.payment_status] || STATUS_LABELS.pending;
            return (
              <div
                key={order.id}
                className="group rounded-xl border border-border bg-white p-5 shadow-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-md"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold">{order.order_number}</p>
                    <p className="text-xs text-muted-foreground">
                      {relativeDate(order.created_at)}
                      <span className="mx-1.5">&middot;</span>
                      {new Date(order.created_at).toLocaleDateString("sv-SE")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-medium", paymentStatus.className)}>
                      {paymentStatus.label}
                    </span>
                    <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-medium", status.className)}>
                      {status.label}
                    </span>
                    <svg className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </div>
                </div>
                <div className="mt-3 space-y-1.5">
                  {(order.items || []).map((item, i) => (
                    <p key={i} className="text-sm text-brand-600">
                      {item.qty}x {item.name || item.id}{" "}
                      <span className="text-brand-500">
                        {((item.price || 0) * item.qty).toLocaleString("sv-SE")} kr
                      </span>
                    </p>
                  ))}
                </div>
                <div className="mt-3 border-t border-brand-100 pt-3 text-right">
                  <p className="text-sm font-bold">
                    {((order.total_amount || 0) / 100).toLocaleString("sv-SE")} kr
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RoutineStep({ step, product, isLast }: { step: string; product: string; isLast?: boolean }) {
  return (
    <div className="relative flex gap-4 pb-6">
      {!isLast && (
        <div className="absolute left-[11px] top-7 h-full w-0.5 bg-brand-100" />
      )}
      <div className="relative z-10 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 border-brand-900 bg-white">
        <div className="h-2 w-2 rounded-full bg-brand-900" />
      </div>
      <div className="flex-1 pt-0.5">
        <p className="text-sm font-medium">{step}</p>
        <p className="text-xs text-muted-foreground">{product}</p>
      </div>
    </div>
  );
}

function RoutineView() {
  const weekDays = ["M", "T", "O", "T", "F", "L", "S"];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold tracking-tight">Min rutin</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border p-6">
          <h3 className="mb-5 text-base font-bold">Morgonrutin</h3>
          <div>
            <RoutineStep step="Rengör" product="Au Naturel Makeup Remover" />
            <RoutineStep step="Applicera 3–4 droppar" product="The ONE Facial Oil" />
            <RoutineStep step="Avsluta med serum" product="TA-DA Serum" isLast />
          </div>
        </div>
        <div className="rounded-xl border border-border p-6">
          <h3 className="mb-5 text-base font-bold">Kvällsrutin</h3>
          <div>
            <RoutineStep step="Dubbelrengöring" product="Au Naturel Makeup Remover" />
            <RoutineStep step="Applicera 3–4 droppar" product="I LOVE Facial Oil" />
            <RoutineStep step="Avsluta med serum" product="TA-DA Serum" isLast />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-brand-50/40 p-6">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-brand-700" />
          <div>
            <p className="text-sm font-medium">Rutinstreak</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Logga din rutin dagligen för att bygga en streak.
            </p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          {weekDays.map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] text-muted-foreground">{day}</span>
              <div className={cn(
                "h-7 w-7 rounded-full border-2 transition-colors",
                i < 3 ? "border-brand-900 bg-brand-900" : "border-brand-200 bg-white"
              )} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BenefitsView({ tier, points }: { tier: string; points: number }) {
  const tiers = [
    { name: "Brons", threshold: 0, discount: "0%" },
    { name: "Silver", threshold: 2000, discount: "5%" },
    { name: "Guld", threshold: 5000, discount: "10%" },
    { name: "Platina", threshold: 10000, discount: "15%" },
  ];

  const currentIdx = tiers.findIndex((t) => t.name === tier);
  const nextTier = currentIdx < tiers.length - 1 ? tiers[currentIdx + 1] : null;
  const remaining = nextTier ? Math.max(0, nextTier.threshold - points) : 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Förmåner</h2>
        <p className="text-sm text-muted-foreground">
          Varje krona du handlar för ger 1 poäng. Högre nivå = bättre rabatter.
        </p>
      </div>

      <div className="relative flex items-center justify-between px-2">
        <div className="absolute left-0 right-0 top-5 h-0.5 bg-brand-100" />
        {tiers.map((t, i) => {
          const reached = i <= currentIdx;
          return (
            <div key={t.name} className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 text-xs font-bold transition-all",
                  reached
                    ? "border-brand-900 bg-brand-900 text-white"
                    : "border-brand-200 bg-white text-muted-foreground"
                )}
              >
                {reached ? "✓" : i + 1}
              </div>
              <p className={cn("text-xs font-medium", reached ? "text-brand-900" : "text-muted-foreground")}>{t.name}</p>
              <p className={cn("text-[11px]", reached ? "text-brand-600" : "text-muted-foreground")}>{t.discount}</p>
            </div>
          );
        })}
      </div>

      {nextTier && (
        <div className="rounded-xl bg-brand-50 p-5">
          <p className="text-sm font-medium text-brand-900">Ditt nästa mål</p>
          <p className="mt-1 text-sm text-brand-600">
            Handla för {remaining.toLocaleString("sv-SE")} kr till för att nå {nextTier.name} och få {nextTier.discount} rabatt på alla köp.
          </p>
        </div>
      )}
      {!nextTier && (
        <div className="rounded-xl bg-brand-50 p-5">
          <p className="text-sm font-medium text-brand-900">Du har nått högsta nivån!</p>
          <p className="mt-1 text-sm text-brand-600">
            Platina-medlem med 15% rabatt på alla köp.
          </p>
        </div>
      )}
    </div>
  );
}

interface Subscription {
  id: number;
  status: string;
  product_id: string;
  product_name: string;
  quantity: number;
  interval_days: number;
  discount_percent: number;
  original_price: number;
  recurring_price: number;
  next_charge_date: string | null;
  created_at: string;
}

function SubscriptionsView({ token }: { token: string }) {
  const { showToast } = useToast();
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubs = useCallback(async () => {
    try {
      const data = await authFetch<Subscription[]>("/subscriptions", token);
      setSubs(data);
    } catch {
      showToast("Kunde inte hämta prenumerationer", "error");
    } finally {
      setLoading(false);
    }
  }, [token, showToast]);

  useEffect(() => {
    fetchSubs();
  }, [fetchSubs]);

  const handleAction = async (id: number, action: "pause" | "resume" | "cancel") => {
    try {
      if (action === "cancel") {
        await authFetch(`/subscriptions/${id}`, token, { method: "DELETE" });
        showToast("Prenumerationen har avbrutits", "success");
      } else if (action === "pause") {
        await authFetch(`/subscriptions/${id}/pause`, token, { method: "PUT" });
        showToast("Prenumerationen är pausad", "success");
      } else {
        await authFetch(`/subscriptions/${id}/resume`, token, { method: "PUT" });
        showToast("Prenumerationen har återupptagits", "success");
      }
      fetchSubs();
    } catch {
      showToast("Något gick fel", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-brand-400" />
      </div>
    );
  }

  const activeSubs = subs.filter((s) => s.status === "active" || s.status === "paused");

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold tracking-tight">Prenumerationer</h2>
      <p className="text-sm text-muted-foreground">
        Spara 15% med automatisk leverans. Pausa eller avbryt nar som helst.
      </p>

      {activeSubs.length === 0 ? (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100/50 p-8">
          <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-brand-200/30" />
          <div className="relative z-10">
            <RefreshCcw className="mb-3 h-8 w-8 text-brand-700" />
            <h3 className="text-lg font-bold text-brand-900">Spara 15% med prenumeration</h3>
            <p className="mt-2 text-sm text-brand-600">
              Valj en produkt att fa levererad automatiskt och spara 15% pa varje leverans. Du valjer intervall (30, 60 eller 90 dagar) vid kassan.
            </p>
            <a href="/produkter">
              <Button className="mt-5 rounded-xl">Välj produkter</Button>
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {activeSubs.map((sub) => (
            <div key={sub.id} className="rounded-xl border border-border bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold">{sub.product_name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {sub.quantity}st &middot; var {sub.interval_days}:e dag
                  </p>
                </div>
                <span className={cn(
                  "rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                  sub.status === "active" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                )}>
                  {sub.status === "active" ? "Aktiv" : "Pausad"}
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-lg font-bold">{sub.recurring_price.toLocaleString("sv-SE")} kr</span>
                <span className="text-sm text-muted-foreground line-through">{sub.original_price.toLocaleString("sv-SE")} kr</span>
                <span className="rounded bg-green-50 px-1.5 py-0.5 text-[11px] font-medium text-green-700">-{sub.discount_percent}%</span>
              </div>
              {sub.next_charge_date && sub.status === "active" && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Nästa leverans: {new Date(sub.next_charge_date).toLocaleDateString("sv-SE", { day: "numeric", month: "long" })}
                </p>
              )}
              <div className="mt-4 flex gap-2">
                {sub.status === "active" ? (
                  <button onClick={() => handleAction(sub.id, "pause")} className="rounded-lg border border-brand-200 px-3 py-1.5 text-xs font-medium text-brand-900 transition-colors hover:bg-brand-50">
                    Pausa
                  </button>
                ) : (
                  <button onClick={() => handleAction(sub.id, "resume")} className="rounded-lg border border-brand-200 px-3 py-1.5 text-xs font-medium text-brand-900 transition-colors hover:bg-brand-50">
                    Återuppta
                  </button>
                )}
                <button onClick={() => handleAction(sub.id, "cancel")} className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50">
                  Avbryt
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function WishlistView() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold tracking-tight">Önskelista</h2>
      <div className="rounded-xl border border-border p-6 text-center">
        <Heart className="mx-auto mb-3 h-10 w-10 text-brand-300" />
        <p className="text-sm text-muted-foreground">
          Din önskelista är tom. Spara produkter du vill ha koll på.
        </p>
        <a href="/produkter">
          <Button className="mt-4 rounded-xl">Se produkter</Button>
        </a>
      </div>
    </div>
  );
}

function SettingsView({ token }: { token: string }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [saving, setSaving] = useState(false);

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone ?? "");
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await authFetch("/auth/profile", token, {
        method: "PUT",
        body: JSON.stringify({ name, phone }),
      });
      showToast("Profilen har uppdaterats", "success");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Kunde inte spara", "error");
    }
    setSaving(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwSaving(true);
    try {
      await authFetch("/auth/password", token, {
        method: "PUT",
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      });
      showToast("Lösenordet har ändrats", "success");
      setCurrentPw("");
      setNewPw("");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Kunde inte ändra lösenord", "error");
    }
    setPwSaving(false);
  };

  const initials = (user?.name || "U")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold tracking-tight">Inställningar</h2>

      <div className="flex items-center gap-4 rounded-xl border border-border p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-900 text-lg font-bold text-white">
          {initials}
        </div>
        <div>
          <p className="text-base font-bold">{user?.name}</p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-5 rounded-xl border border-border p-6">
        <h3 className="text-base font-bold">Profil</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Namn</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Telefon</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus:outline-none"
            />
          </div>
        </div>
        <Button type="submit" disabled={saving} className="rounded-xl active:scale-[0.98]">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Spara ändringar
        </Button>
      </form>

      <form onSubmit={handleChangePassword} className="space-y-4 rounded-xl border border-border p-6">
        <h3 className="text-base font-bold">Byt lösenord</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Nuvarande lösenord</label>
            <input
              type="password"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              required
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Nytt lösenord</label>
            <input
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus:outline-none"
            />
          </div>
        </div>
        <Button type="submit" variant="outline" disabled={pwSaving} className="rounded-xl active:scale-[0.98]">
          {pwSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Byt lösenord
        </Button>
      </form>
    </div>
  );
}

export default function DashboardPage() {
  const { user, token, isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const [activeView, setActiveView] = useState<View>("oversikt");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [errorStats, setErrorStats] = useState("");
  const [errorOrders, setErrorOrders] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/logga-in");
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (!token) return;
    authFetch<DashboardStats>("/dashboard/stats", token)
      .then(setStats)
      .catch(() => setErrorStats("Kunde inte ladda statistik. Försök igen senare."))
      .finally(() => setLoadingStats(false));

    authFetch<Order[]>("/dashboard/orders", token)
      .then(setOrders)
      .catch(() => setErrorOrders("Kunde inte ladda ordrar. Försök igen senare."))
      .finally(() => setLoadingOrders(false));
  }, [token]);

  if (!isLoggedIn) return null;

  function renderView() {
    switch (activeView) {
      case "oversikt":
        return <OverviewView stats={stats} loading={loadingStats} error={errorStats} userName={user?.name ?? ""} />;
      case "hudresa":
        return <SkinJourneyView />;
      case "ordrar":
        return <OrdersView orders={orders} loading={loadingOrders} error={errorOrders} />;
      case "rutin":
        return <RoutineView />;
      case "formaner":
        return <BenefitsView tier={stats?.tier ?? "Brons"} points={stats?.loyaltyPoints ?? 0} />;
      case "prenumerationer":
        return <SubscriptionsView token={token!} />;
      case "onskelista":
        return <WishlistView />;
      case "installningar":
        return <SettingsView token={token!} />;
      default:
        return null;
    }
  }

  return (
    <section>
      <div className="flex min-h-[calc(100vh-4rem)]">
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={cn(
            "fixed top-16 left-0 z-40 flex h-[calc(100vh-4rem)] w-64 flex-col border-r border-border bg-background transition-transform duration-300 md:relative md:top-0 md:z-0 md:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="border-b border-border px-5 py-6">
            {(() => {
              const t = stats?.tier ?? "Brons";
              const p = stats?.loyaltyPoints ?? 0;
              const info = TIER_THRESHOLDS[t] || TIER_THRESHOLDS.Brons;
              const pct = t === "Platina" ? 100 : Math.min(100, Math.round((p / info.points) * 100));
              return (
                <div className="mb-4 h-1 overflow-hidden rounded-full bg-brand-100">
                  <div className="h-full rounded-full bg-brand-900 transition-all duration-700" style={{ width: `${pct}%` }} />
                </div>
              );
            })()}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-900 text-sm font-bold text-white">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div>
                <p className="text-sm font-bold">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <div className="flex flex-col gap-1">
              {SIDEBAR_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id);
                    setSidebarOpen(false);
                  }}
                  className={cn(
                    "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    activeView === item.id
                      ? "bg-brand-900 text-white"
                      : "text-muted-foreground hover:bg-brand-50"
                  )}
                >
                  {activeView === item.id && (
                    <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-white" />
                  )}
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
            </div>
          </nav>

          <div className="border-t border-border p-3">
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              Logga ut
            </button>
          </div>
        </aside>

        <div className="flex-1 overflow-y-auto px-6 py-8 md:px-10">
          <button
            className="mb-4 flex items-center gap-2 text-sm text-muted-foreground md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <User className="h-4 w-4" />
            Meny
          </button>
          <div className="mx-auto max-w-4xl">
            {renderView()}
          </div>
        </div>
      </div>
    </section>
  );
}
