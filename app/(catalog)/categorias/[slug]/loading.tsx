export default function CategoryLoading() {
  return (
    <div className="space-y-6">
      <div className="h-5 w-48 animate-pulse rounded bg-muted" />
      <div className="h-8 w-72 animate-pulse rounded bg-muted" />
      <div className="h-5 w-96 animate-pulse rounded bg-muted" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-80 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    </div>
  );
}
