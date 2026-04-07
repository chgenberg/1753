"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentFailedPage() {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-lg px-6 text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Betalningen misslyckades
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          Något gick fel vid betalningen. Du har inte blivit debiterad. Vänligen
          försök igen eller kontakta oss om problemet kvarstår.
        </p>

        <div className="mt-10 flex flex-col gap-3">
          <Link href="/kassa">
            <Button className="w-full rounded-xl h-12">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Försök igen
            </Button>
          </Link>
          <Link href="/kontakt">
            <Button variant="outline" className="w-full rounded-xl h-12">
              Kontakta oss
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
