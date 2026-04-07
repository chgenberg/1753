"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/providers/cart-provider";
import { apiFetch } from "@/lib/api";

function PaymentSuccessContent() {
  const params = useSearchParams();
  const { clearCart } = useCart();
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const verified = useRef(false);

  useEffect(() => {
    if (verified.current) return;
    verified.current = true;
    clearCart();

    const storedOrder = sessionStorage.getItem("1753_orderNumber");
    if (storedOrder) setOrderNumber(storedOrder);

    const transactionId = params.get("t") || params.get("s");
    if (transactionId) {
      apiFetch<{ orderNumber?: string }>("/orders/verify", {
        method: "POST",
        body: JSON.stringify({
          transactionId,
          orderNumber: storedOrder || undefined,
        }),
      })
        .then((data) => {
          if (data.orderNumber) setOrderNumber(data.orderNumber);
        })
        .catch(() => {});
    }
  }, [params, clearCart]);

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-lg px-6 text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Tack för din beställning!
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          Vi har mottagit din betalning och din order behandlas nu. Du kommer
          snart att få en orderbekräftelse via e-post.
        </p>

        {orderNumber && (
          <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-50 px-5 py-3">
            <Package className="h-4 w-4 text-brand-700" />
            <span className="text-sm font-medium">
              Ordernummer: {orderNumber}
            </span>
          </div>
        )}

        <div className="mt-10 flex flex-col gap-3">
          <Link href="/">
            <Button className="w-full rounded-xl h-12">
              Tillbaka till startsidan
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-lg px-6 text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Behandlar din beställning...
            </h1>
          </div>
        </section>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
