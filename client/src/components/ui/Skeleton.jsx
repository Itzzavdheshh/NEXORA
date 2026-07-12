import { cn } from "../../utils/cn";

/**
 * Skeleton variants for realistic loading placeholders.
 * All connected to real loading states — never used as decoration.
 */
export function Skeleton({ className }) {
  return (
    <div
      className={cn(
        "skeleton-base rounded-xl",
        className,
      )}
      aria-hidden="true"
    />
  );
}

/** A stat card skeleton matching the real card layout */
export function SkeletonStat() {
  return (
    <div className="glass-panel rounded-2xl p-5" aria-hidden="true">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-8 w-14" />
        </div>
        <Skeleton className="h-9 w-9 rounded-xl" />
      </div>
      <Skeleton className="mt-4 h-3 w-32" />
    </div>
  );
}

/** A list row skeleton matching notification/booking rows */
export function SkeletonRow() {
  return (
    <div className="flex gap-3 rounded-xl p-3" aria-hidden="true">
      <Skeleton className="h-9 w-9 shrink-0 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-3 w-full" />
      </div>
    </div>
  );
}

/** A card skeleton matching booking/mentor cards */
export function SkeletonCard() {
  return (
    <div className="glass-panel rounded-2xl p-5 space-y-4" aria-hidden="true">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-8 flex-1 rounded-xl" />
        <Skeleton className="h-8 w-8 rounded-xl" />
      </div>
    </div>
  );
}

/** Hero / page header skeleton */
export function SkeletonHero() {
  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-7" aria-hidden="true">
      <Skeleton className="h-3.5 w-28 rounded-full" />
      <Skeleton className="mt-5 h-8 w-3/4" />
      <Skeleton className="mt-3 h-4 w-1/2" />
    </div>
  );
}
