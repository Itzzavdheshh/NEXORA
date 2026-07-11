import { Skeleton } from "../../../components/ui/Skeleton";

export function BookingSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-6" aria-busy="true" aria-label="Loading bookings">
      {/* Header skeleton */}
      <Skeleton className="h-44 w-full rounded-[2rem]" />

      {/* Filters skeleton */}
      <Skeleton className="h-28 w-full rounded-3xl" />

      {/* Cards skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-4 rounded-3xl border border-ink-200/60 bg-white/50 p-5 dark:border-white/8 dark:bg-white/5"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-2xl shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-36" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>

            <div className="space-y-2.5 rounded-2xl border border-ink-100 bg-white/40 p-4 dark:border-white/5 dark:bg-white/5">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>

            <div className="mt-auto space-y-2 pt-2">
              <Skeleton className="h-4 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-10 flex-1 rounded-xl" />
                <Skeleton className="h-10 flex-1 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
