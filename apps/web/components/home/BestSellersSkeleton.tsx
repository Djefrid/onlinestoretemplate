export function BestSellersSkeleton() {
  return (
    <section className="section-padding bg-white">
      <div className="container-page">
        {/* Header skeleton */}
        <div className="mb-10 flex items-end justify-between">
          <div className="space-y-2">
            <div className="h-8 w-44 animate-pulse rounded-lg bg-foreground/10" />
            <div className="h-4 w-60 animate-pulse rounded bg-foreground/[0.06]" />
          </div>
          <div className="hidden h-8 w-20 animate-pulse rounded-lg bg-foreground/[0.06] sm:block" />
        </div>

        {/* Cards skeleton */}
        <div className="grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              {/* Image placeholder */}
              <div className="aspect-[4/5] animate-pulse rounded-2xl bg-foreground/[0.08]" />
              {/* Info placeholder */}
              <div className="mt-3 space-y-2 px-0.5">
                <div className="h-3 w-24 animate-pulse rounded bg-foreground/[0.06]" />
                <div className="h-4 w-36 animate-pulse rounded bg-foreground/[0.08]" />
                <div className="h-4 w-20 animate-pulse rounded bg-foreground/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
