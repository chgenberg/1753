export default function ProductLoading() {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10">
        <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
          <div className="aspect-square animate-pulse rounded-3xl bg-brand-100" />
          <div className="flex flex-col justify-center gap-4">
            <div className="h-6 w-32 animate-pulse rounded-lg bg-brand-100" />
            <div className="h-10 w-3/4 animate-pulse rounded-lg bg-brand-100" />
            <div className="h-20 w-full animate-pulse rounded-lg bg-brand-100" />
            <div className="h-8 w-24 animate-pulse rounded-lg bg-brand-100" />
          </div>
        </div>
      </div>
    </section>
  );
}
