import { cn } from "../../utils/cn";

export function Skeleton({ className }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl bg-ink-200/70 dark:bg-white/10",
        className,
      )}
    />
  );
}
