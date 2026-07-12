import { Bell, RefreshCw, CheckCheck } from "lucide-react";
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
    <div className="glass-panel rounded-3xl p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="badge badge-brand">
            <Bell className="h-3.5 w-3.5" aria-hidden="true" />
            Notification center
          </p>

          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-ink-950 dark:text-white">
            Stay in the loop
          </h1>

          <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">
            Booking confirmations, mentor updates, and system alerts in one focused place.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onMarkAllRead}
              loading={isMarkingAllRead}
              disabled={isMarkingAllRead}
              aria-label="Mark all notifications as read"
            >
              <CheckCheck className="h-4 w-4" aria-hidden="true" />
              Mark all read
            </Button>
          )}

          <Button
            variant="secondary"
            size="sm"
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
        {[
          ["Total logs", total, "All notifications"],
          ["Unread", unreadCount, "Pending actions", unreadCount > 0],
          ["Read", total - unreadCount, "Processed updates"],
        ].map(([label, value, desc, accent]) => (
          <div
            key={label}
            className="rounded-xl border border-ink-200/60 bg-ink-50/50 p-4 dark:border-white/6 dark:bg-white/3"
          >
            <p className="text-[10px] font-bold uppercase tracking-wide text-ink-500 dark:text-ink-400">{label}</p>
            <p className={cn(
              "mt-1 text-2xl font-extrabold tabular-nums",
              accent ? "text-brand-600 dark:text-brand-300" : "text-ink-950 dark:text-white"
            )}>
              {value}
            </p>
            <p className="mt-1 text-[10px] text-ink-400 dark:text-ink-500">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
