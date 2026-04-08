"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n/types";
import type { Messages } from "@/lib/i18n/strings/sv";
import { t as translate } from "@/lib/i18n/t";
import { localizePath, localizeHomeHash, type AppRoute } from "@/lib/i18n/navigation";

type Ctx = {
  locale: Locale;
  messages: Messages;
  t: (key: string, vars?: Record<string, string | number>) => string;
  path: (
    route: AppRoute,
    params?: { productId?: string; query?: Record<string, string> }
  ) => string;
  homeHash: (hash: string) => string;
};

const LocaleContext = createContext<Ctx | null>(null);

export function LocaleProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages;
  children: ReactNode;
}) {
  const value = useMemo<Ctx>(
    () => ({
      locale,
      messages,
      t: (key, vars) => translate(messages, key, vars),
      path: (route, params) => localizePath(locale, route, params),
      homeHash: (hash) => localizeHomeHash(locale, hash),
    }),
    [locale, messages]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}

/** Safe for components that may render outside locale (e.g. error boundaries) */
export function useLocaleOptional(): Ctx | null {
  return useContext(LocaleContext);
}
