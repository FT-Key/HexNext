export default function CatalogLoading() {
  return (
    <div className="container mx-auto flex-1 px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">
          <div className="space-y-2 rounded-2xl border bg-card p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-9 animate-pulse rounded-lg bg-muted"
              />
            ))}
          </div>
        </aside>
        <main className="min-w-0">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="h-4 w-32 animate-pulse rounded bg-muted" />
              <div className="h-8 w-48 animate-pulse rounded bg-muted" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl border bg-card">
                  <div className="aspect-square rounded-t-xl bg-muted" />
                  <div className="space-y-2 p-4">
                    <div className="h-4 w-3/4 rounded bg-muted" />
                    <div className="h-5 w-1/2 rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
