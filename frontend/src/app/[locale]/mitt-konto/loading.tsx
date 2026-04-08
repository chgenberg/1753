export default function DashboardLoading() {
  return (
    <section>
      <div className="flex min-h-[calc(100vh-4rem)]">
        <aside className="hidden w-64 border-r border-border bg-background md:block">
          <div className="px-5 py-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 animate-pulse rounded-full bg-brand-100" />
              <div className="space-y-1.5">
                <div className="h-4 w-24 animate-pulse rounded bg-brand-100" />
                <div className="h-3 w-32 animate-pulse rounded bg-brand-100" />
              </div>
            </div>
          </div>
        </aside>
        <div className="flex-1 px-6 py-8 md:px-10">
          <div className="mx-auto max-w-4xl space-y-6">
            <div className="h-8 w-40 animate-pulse rounded-lg bg-brand-100" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-28 animate-pulse rounded-xl bg-brand-100" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
