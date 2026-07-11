import { Bell, RefreshCw } from "lucide-react";
import { Button } from "../ui/Button";
import { cn } from "../../utils/cn";

export function NotificationHeaderStats({
  total,
  unreadCount,
  isFetching,
  isMarkingAllRead,
  onRefresh,
  onMarkAllRead,
}) {
  return (
    <div className="glass-panel rounded-[2rem] p-6 sm:p-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-brand-700 dark:border-brand-300/20 dark:bg-brand-300/10 dark:text-brand-100">
            <Bell className="h-3.5 w-3.5" aria-hidden="true" />
            Notification center
          </p>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink-950 sm:text-4xl dark:text-white">
            Stay in the loop with every update.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-600 dark:text-ink-200">
            All booking confirmations, mentor updates, and system alerts — in one focused place.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {unreadCount > 0 && (
            <Button
              variant="secondary"
              onClick={onMarkAllRead}
              loading={isMarkingAllRead}
              disabled={isMarkingAllRead}
              aria-label="Mark all notifications as read"
            >
              Mark all read
            </Button>
          )}

          <Button
            variant="secondary"
            onClick={onRefresh}
            loading={isFetching}
            disabled={isFetching}
            aria-label="Refresh notifications"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-ink-200/80 bg-white/65 p-4 dark:border-white/10 dark:bg-white/8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-500 dark:text-ink-300">Total</p>
          <p className="mt-2 text-2xl font-extrabold text-ink-950 dark:text-white">{total}</p>
        </div>
        <div className="rounded-2xl border border-ink-200/80 bg-white/65 p-4 dark:border-white/10 dark:bg-white/8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-500 dark:text-ink-300">Unread</p>
          <p className={cn(
            "mt-2 text-2xl font-extrabold",
            unreadCount > 0 ? "text-brand-600 dark:text-brand-200" : "text-ink-950 dark:text-white"
          )}>{unreadCount}</p>
        </div>
        <div className="rounded-2xl border border-ink-200/80 bg-white/65 p-4 dark:border-white/10 dark:bg-white/8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-500 dark:text-ink-300">Read</p>
          <p className="mt-2 text-2xl font-extrabold text-ink-950 dark:text-white">{total - unreadCount}</p>
        </div>
      </div>
    </div>
  );
}
