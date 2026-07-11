import { Skeleton } from "../ui/Skeleton";

export function NotificationSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-6" aria-busy="true" aria-label="Loading notifications">
      {/* Header skeleton */}
      <Skeleton className="h-52 w-full" />

      {/* Filters skeleton */}
      <Skeleton className="h-28 w-full" />

      {/* Cards skeleton */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex gap-4 rounded-2xl border border-ink-200/60 bg-white/50 p-5 dark:border-white/8 dark:bg-white/5"
          >
            <Skeleton className="h-10 w-10 shrink-0 rounded-2xl" />
            <div className="flex-1 space-y-3">
              <div className="flex justify-between gap-4">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
