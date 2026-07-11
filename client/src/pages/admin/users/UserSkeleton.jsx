import { Skeleton } from "../../../components/ui/Skeleton";

export function UserSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-6" aria-busy="true" aria-label="Loading users list">
      {/* Header skeleton */}
      <Skeleton className="h-44 w-full rounded-[2rem]" />

      {/* Filters skeleton */}
      <Skeleton className="h-28 w-full rounded-3xl" />

      {/* Grid skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-4 rounded-3xl border border-ink-200 bg-white/50 p-5 dark:border-white/5 dark:bg-white/5"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-36" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-10 w-full rounded-xl mt-3" />
          </div>
        ))}
      </div>
    </div>
  );
}
