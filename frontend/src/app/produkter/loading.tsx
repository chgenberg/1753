export default function ProductsLoading() {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10">
        <div className="mb-12 text-center">
          <div className="mx-auto h-10 w-48 animate-pulse rounded-lg bg-brand-100" />
          <div className="mx-auto mt-3 h-5 w-64 animate-pulse rounded-lg bg-brand-100" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-square animate-pulse rounded-2xl bg-brand-100" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-brand-100" />
              <div className="h-4 w-1/3 animate-pulse rounded bg-brand-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
