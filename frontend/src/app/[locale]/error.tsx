"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getMessages } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/types";
import { locales } from "@/lib/i18n/types";
import { localizePath } from "@/lib/i18n/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname() || "/sv";
  const seg = pathname.split("/")[1];
  const locale = (locales.includes(seg as Locale) ? seg : "sv") as Locale;
  const home = localizePath(locale, "home");

  function tx(sv: string, en: string, es?: string, de?: string, fr?: string) {
    if (locale === "sv") return sv;
    if (locale === "es") return es || en;
    if (locale === "de") return de || en;
    if (locale === "fr") return fr || en;
    return en;
  }

  useEffect(() => {
    console.error("[ErrorBoundary]", error);
  }, [error]);

  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-lg px-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-brand-500">
          {tx("Något gick fel", "Something went wrong", "Algo salió mal", "Etwas ist schiefgelaufen", "Une erreur est survenue")}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-brand-900">
          {tx("Ett oväntat fel uppstod", "We hit a snag", "Ocurrió un error inesperado", "Ein unerwarteter Fehler ist aufgetreten", "Une erreur inattendue s'est produite")}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          {tx(
            "Testa att ladda om sidan. Om felet kvarstår, kontakta oss så löser vi det.",
            "Try reloading the page. If it keeps happening, contact us and we'll sort it out.",
            "Intenta recargar la página. Si el problema persiste, contáctanos y lo resolveremos.",
            "Versuche die Seite neu zu laden. Wenn das Problem weiterhin besteht, kontaktiere uns.",
            "Essayez de recharger la page. Si le problème persiste, contactez-nous."
          )}
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset} className="rounded-xl h-12 px-8">
            {tx("Försök igen", "Try again", "Intentar de nuevo", "Erneut versuchen", "Réessayer")}
          </Button>
          <Link href={home}>
            <Button variant="outline" className="rounded-xl h-12 px-8">
              {tx("Till startsidan", "Back to home", "Volver al inicio", "Zur Startseite", "Retour à l'accueil")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
