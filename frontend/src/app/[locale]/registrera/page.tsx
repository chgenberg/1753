"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { useLocale } from "@/providers/locale-provider";

export default function RegisterPage() {
  const { t, path } = useLocale();
  const ex = (key: string) => t(`registerPageExtra.${key}`);
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6 || !/\d/.test(form.password)) {
      setError(ex("passwordRules"));
      return;
    }
    if (form.password !== form.confirm) {
      setError(ex("passwordMismatch"));
      return;
    }

    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        phone: form.phone.replace(/\D/g, ""),
        password: form.password,
      });
      router.push(path("account"));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : ex("errorGeneric"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-4rem)]">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-[1280px] md:grid-cols-2">
        <div className="relative hidden items-end overflow-hidden bg-brand-50 p-12 md:flex">
          <Image
            src="/video-poster.jpg"
            alt=""
            fill
            className="object-cover opacity-20"
            sizes="50vw"
          />
          <div className="relative z-10 max-w-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-brand-500">
              {ex("asideKicker")}
            </p>
            <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-brand-900">
              {ex("asideTitle1")}
              <br />
              {ex("asideTitle2")}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-brand-600">
              {ex("asideBody")}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-16 md:px-12">
          <div className="w-full max-w-sm">
            <div className="mb-8 flex justify-center md:justify-start">
              <Image src="/1753.webp" alt="1753 SKINCARE" width={40} height={40} />
            </div>
            <div className="animate-fade-in">
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                {t("registerPage.title")}
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {ex("subtitle")}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  {ex("nameLabel")}
                </label>
                <input
                  type="text"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus:outline-none"
                  placeholder={ex("namePlaceholder")}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">{t("loginPage.email")}</label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus:outline-none"
                  placeholder={ex("placeholderEmail")}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  {t("checkout.phone")}
                </label>
                <input
                  type="tel"
                  required
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus:outline-none"
                  placeholder={ex("phonePlaceholder")}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  {t("loginPage.password")}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, password: e.target.value }))
                    }
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 pr-12 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus:outline-none"
                    placeholder={ex("passwordPlaceholder")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-brand-900"
                    aria-label={showPassword ? ex("hidePassword") : ex("showPassword")}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  {ex("confirmLabel")}
                </label>
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  value={form.confirm}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, confirm: e.target.value }))
                  }
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus:outline-none"
                  placeholder={ex("confirmPlaceholder")}
                />
              </div>

              {error && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-xl text-sm font-medium active:scale-[0.98]"
              >
                {loading ? (
                  ex("creating")
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    {t("registerPage.submit")}
                  </>
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground md:text-left">
              {ex("footerPrompt")}{" "}
              <Link
                href={path("login")}
                className="font-medium text-brand-900 hover:underline"
              >
                {t("registerPage.login")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
