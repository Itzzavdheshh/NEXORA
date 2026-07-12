import { Skeleton, SkeletonRow, SkeletonHero } from "../ui/Skeleton";

export function NotificationSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-5" aria-busy="true" aria-label="Loading notifications">
      {/* Header skeleton */}
      <SkeletonHero />

      {/* Filters skeleton */}
      <Skeleton className="h-24 w-full rounded-2xl" />

      {/* Cards skeleton */}
      <div className="space-y-2.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="glass-panel flex gap-4 rounded-2xl p-5"
          >
            <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
            <div className="flex-1 space-y-2.5">
              <div className="flex justify-between items-center gap-4">
                <Skeleton className="h-3.5 w-44" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
