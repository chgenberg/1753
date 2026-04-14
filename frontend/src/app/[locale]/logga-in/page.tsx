"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Eye, EyeOff, LogIn, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { useLocale } from "@/providers/locale-provider";
import { apiFetch } from "@/lib/api";

function tx(locale: string, sv: string, en: string, es?: string, de?: string, fr?: string): string {
  if (locale === "sv") return sv;
  if (locale === "es") return es || en;
  if (locale === "de") return de || en;
  if (locale === "fr") return fr || en;
  return en;
}

export default function LoginPage() {
  const { t, path, locale } = useLocale();
  const ex = (key: string) => t(`loginPageExtra.${key}`);
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);
      router.push(user?.role === "admin" ? "/admin" : path("account"));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : ex("errorGeneric"));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");

    if (!forgotEmail.trim() || !forgotEmail.includes("@")) {
      setForgotError(tx(locale, "Ange en giltig e-postadress.", "Please enter a valid email address.", "Introduce una dirección de email válida.", "Bitte gib eine gültige E-Mail-Adresse ein.", "Veuillez entrer une adresse e-mail valide."));
      return;
    }

    setForgotLoading(true);
    try {
      await apiFetch("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: forgotEmail, locale }),
      });
      setForgotSent(true);
    } catch {
      setForgotError(tx(locale, "Något gick fel. Försök igen.", "Something went wrong. Please try again.", "Algo salió mal. Inténtalo de nuevo.", "Etwas ist schiefgelaufen. Bitte versuche es erneut.", "Une erreur s'est produite. Veuillez réessayer."));
    } finally {
      setForgotLoading(false);
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

            {forgotMode ? (
              <div className="animate-fade-in">
                {forgotSent ? (
                  <div className="text-center">
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#108474]/10">
                      <Check className="h-7 w-7 text-[#108474]" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">
                      {tx(locale, "Kolla din inkorg", "Check your inbox", "Revisa tu bandeja de entrada", "Prüfe deinen Posteingang", "Vérifiez votre boîte de réception")}
                    </h1>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {tx(locale,
                        "Om det finns ett konto kopplat till den adressen har vi skickat en länk för att välja nytt lösenord. Länken är giltig i 1 timme.",
                        "If there's an account linked to that address, we've sent a link to choose a new password. The link is valid for 1 hour.",
                        "Si hay una cuenta vinculada a esa dirección, hemos enviado un enlace para elegir una nueva contraseña. El enlace es válido durante 1 hora.",
                        "Wenn ein Konto mit dieser Adresse verknüpft ist, haben wir einen Link zum Wählen eines neuen Passworts gesendet. Der Link ist 1 Stunde gültig.",
                        "S'il existe un compte lié à cette adresse, nous avons envoyé un lien pour choisir un nouveau mot de passe. Le lien est valide pendant 1 heure."
                      )}
                    </p>
                    <button
                      onClick={() => { setForgotMode(false); setForgotSent(false); setForgotEmail(""); }}
                      className="mt-6 text-sm font-medium text-[#108474] hover:underline"
                    >
                      {tx(locale, "Tillbaka till inloggning", "Back to login", "Volver al inicio de sesión", "Zurück zur Anmeldung", "Retour à la connexion")}
                    </button>
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                      {tx(locale, "Glömt lösenord?", "Forgot password?", "¿Olvidaste tu contraseña?", "Passwort vergessen?", "Mot de passe oublié ?")}
                    </h1>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                      {tx(locale,
                        "Ange din e-postadress så skickar vi en länk för att välja nytt lösenord.",
                        "Enter your email address and we'll send you a link to choose a new password.",
                        "Introduce tu dirección de email y te enviaremos un enlace para elegir una nueva contraseña.",
                        "Gib deine E-Mail-Adresse ein und wir senden dir einen Link, um ein neues Passwort zu wählen.",
                        "Entrez votre adresse e-mail et nous vous enverrons un lien pour choisir un nouveau mot de passe."
                      )}
                    </p>

                    <form onSubmit={handleForgotPassword} className="mt-8 space-y-5">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium">{t("loginPage.email")}</label>
                        <input
                          type="email"
                          required
                          autoComplete="email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus:outline-none"
                          placeholder={ex("placeholderEmail")}
                        />
                      </div>

                      {forgotError && (
                        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                          {forgotError}
                        </p>
                      )}

                      <Button
                        type="submit"
                        disabled={forgotLoading}
                        className="h-12 w-full rounded-xl text-sm font-medium active:scale-[0.98]"
                      >
                        {forgotLoading ? (
                          tx(locale, "Skickar...", "Sending...", "Enviando...", "Wird gesendet...", "Envoi en cours...")
                        ) : (
                          <>
                            <Mail className="mr-2 h-4 w-4" />
                            {tx(locale, "Skicka återställningslänk", "Send reset link", "Enviar enlace de restablecimiento", "Zurücksetzungslink senden", "Envoyer le lien de réinitialisation")}
                          </>
                        )}
                      </Button>
                    </form>

                    <button
                      onClick={() => { setForgotMode(false); setForgotError(""); }}
                      className="mt-6 block text-center text-sm font-medium text-muted-foreground hover:text-brand-900 md:text-left"
                    >
                      {tx(locale, "Tillbaka till inloggning", "Back to login", "Volver al inicio de sesión", "Zurück zur Anmeldung", "Retour à la connexion")}
                    </button>
                  </>
                )}
              </div>
            ) : (
              <>
                <div className="animate-fade-in">
                  <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                    {t("loginPage.title")}
                  </h1>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {ex("subtitle")}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">{t("loginPage.email")}</label>
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus:outline-none"
                      placeholder={ex("placeholderEmail")}
                    />
                  </div>

                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label className="block text-sm font-medium">
                        {t("loginPage.password")}
                      </label>
                      <button
                        type="button"
                        onClick={() => { setForgotMode(true); setForgotEmail(email); }}
                        className="text-xs font-medium text-[#108474] hover:underline"
                      >
                        {tx(locale, "Glömt lösenord?", "Forgot password?", "¿Olvidaste tu contraseña?", "Passwort vergessen?", "Mot de passe oublié ?")}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-xl border border-input bg-background px-4 py-3 pr-12 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus:outline-none"
                        placeholder={ex("placeholderPassword")}
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
                      ex("loggingIn")
                    ) : (
                      <>
                        <LogIn className="mr-2 h-4 w-4" />
                        {t("loginPage.submit")}
                      </>
                    )}
                  </Button>
                </form>

                <p className="mt-6 text-center text-sm text-muted-foreground md:text-left">
                  {ex("footerPrompt")}{" "}
                  <Link
                    href={path("register")}
                    className="font-medium text-brand-900 hover:underline"
                  >
                    {t("loginPage.register")}
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
