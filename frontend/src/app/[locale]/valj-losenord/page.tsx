"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Check, Eye, EyeOff, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { useLocale } from "@/providers/locale-provider";

function SetPasswordForm() {
  const { t, path } = useLocale();
  const sp = useSearchParams();
  const token = sp.get("token") || "";
  const tx = (key: string) => t(`setPasswordPage.${key}`);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError(tx("tooShort"));
      return;
    }
    if (password !== confirm) {
      setError(tx("passwordMismatch"));
      return;
    }

    setLoading(true);
    try {
      await apiFetch("/auth/set-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });
      setDone(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : tx("invalidToken");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="max-w-sm text-center">
          <p className="text-sm text-muted-foreground">{tx("invalidToken")}</p>
        </div>
      </section>
    );
  }

  if (done) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="max-w-sm text-center animate-fade-in">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-green/10">
            <Check className="h-7 w-7 text-green" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{tx("successTitle")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{tx("successBody")}</p>
          <Link href={path("account")}>
            <Button className="mt-6 h-12 rounded-xl px-8">{tx("goToAccount")}</Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Image src="/1753.webp" alt="1753 SKINCARE" width={40} height={40} />
        </div>
        <div className="animate-fade-in text-center">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{tx("title")}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{tx("subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium">{tx("passwordLabel")}</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 pr-12 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus:outline-none"
                placeholder={tx("passwordPlaceholder")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-brand-900"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">{tx("confirmLabel")}</label>
            <input
              type={showPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus:outline-none"
              placeholder={tx("confirmPlaceholder")}
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-xl text-sm font-medium active:scale-[0.98]"
          >
            {loading ? (
              tx("saving")
            ) : (
              <>
                <KeyRound className="mr-2 h-4 w-4" />
                {tx("submit")}
              </>
            )}
          </Button>
        </form>
      </div>
    </section>
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#108474] border-t-transparent" />
        </div>
      }
    >
      <SetPasswordForm />
    </Suspense>
  );
}
