import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-lg px-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-brand-500">
          404
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">
          Sidan kunde inte hittas
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          Sidan du letar efter finns inte eller har flyttats.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/">
            <Button className="rounded-xl h-12 px-8">Till startsidan</Button>
          </Link>
          <Link href="/produkter">
            <Button variant="outline" className="rounded-xl h-12 px-8">
              Se produkter
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
