import { Skeleton } from "../../../components/ui/Skeleton";

export function VerificationSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-6" aria-busy="true" aria-label="Loading verification requests">
      {/* Header skeleton */}
      <Skeleton className="h-44 w-full rounded-[2rem]" />

      {/* Filters skeleton */}
      <Skeleton className="h-16 w-full rounded-2xl" />

      {/* Grid skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-4 rounded-3xl border border-ink-200 bg-white/50 p-5 dark:border-white/5 dark:bg-white/5"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-11 w-11 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-36" />
              </div>
            </div>
            <div className="space-y-2 border-t border-ink-100 pt-3 dark:border-white/5">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="mt-4 flex gap-2 pt-2">
              <Skeleton className="h-10 flex-1 rounded-xl" />
              <Skeleton className="h-10 flex-1 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
