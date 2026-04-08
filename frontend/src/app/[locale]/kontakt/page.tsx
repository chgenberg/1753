"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "@/components/section-wrapper";
import { useLocale } from "@/providers/locale-provider";

export default function ContactPage() {
  const { t } = useLocale();
  const p = (key: string) => t(`contactPage.${key}`);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10">
          <div className="grid items-center gap-10 md:grid-cols-2 lg:gap-16">
            <div className="animate-fade-in">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-brand-500">
                {p("kicker")}
              </p>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                {p("h1")}
              </h1>
              <p className="mt-3 max-w-lg text-base leading-relaxed text-brand-500">
                {p("lead")}
              </p>
            </div>

            <div className="group relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl shadow-brand-900/5">
              <Image
                src="/stock5.jpg"
                alt={p("heroImgAlt")}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/5" />
            </div>
          </div>
        </div>
      </section>

      <SectionWrapper alt>
        <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-6">
            <h2 className="text-lg font-bold tracking-tight">
              {p("infoTitle")}
            </h2>

            <div className="flex items-start gap-4 rounded-xl bg-white p-5 shadow-sm">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50">
                <Mail className="h-5 w-5 text-brand-700" />
              </div>
              <div>
                <p className="text-sm font-medium">{p("emailLabel")}</p>
                <a
                  href="mailto:christopher@1753skincare.com"
                  className="text-sm text-muted-foreground hover:text-brand-900"
                >
                  christopher@1753skincare.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-xl bg-white p-5 shadow-sm">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50">
                <Phone className="h-5 w-5 text-brand-700" />
              </div>
              <div>
                <p className="text-sm font-medium">{p("phoneLabel")}</p>
                <a
                  href="tel:0732305521"
                  className="text-sm text-muted-foreground hover:text-brand-900"
                >
                  0732 - 30 55 21
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-xl bg-white p-5 shadow-sm">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50">
                <MapPin className="h-5 w-5 text-brand-700" />
              </div>
              <div>
                <p className="text-sm font-medium">{p("addressLabel")}</p>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {t("footer.addressLines")}
                </p>
              </div>
            </div>
          </div>

          {sent ? (
            <div className="flex items-center justify-center rounded-2xl bg-green-50 p-10 text-center">
              <div>
                <h3 className="text-lg font-bold tracking-tight text-green-900">
                  {p("thanksTitle")}
                </h3>
                <p className="mt-2 text-sm text-green-700">
                  {p("thanksSub")}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="text-lg font-bold tracking-tight">
                {p("formTitle")}
              </h2>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  {p("nameLabel")}
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus:outline-none"
                  placeholder={p("nameLabel")}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  {t("checkout.email")}
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus:outline-none"
                  placeholder={t("loginPageExtra.placeholderEmail")}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  {p("messageLabel")}
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, message: e.target.value }))
                  }
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus:outline-none"
                  placeholder={p("messagePlaceholder")}
                />
              </div>
              <Button
                type="submit"
                className="h-12 w-full rounded-xl text-sm font-medium active:scale-[0.98]"
              >
                {p("submit")}
              </Button>
            </form>
          )}
        </div>
      </SectionWrapper>
    </>
  );
}
