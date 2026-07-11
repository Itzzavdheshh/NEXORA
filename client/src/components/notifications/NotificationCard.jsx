import { motion } from "framer-motion";
import {
  Bell,
  BookOpenCheck,
  CalendarCheck,
  CheckCircle2,
  Info,
  Megaphone,
  ShieldAlert,
  Sparkles,
  Star,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "../../utils/cn";

// ── Icon map ──────────────────────────────────────────────────────────────────
const ICON_MAP = {
  booking: CalendarCheck,
  session: CalendarCheck,
  confirmed: CheckCircle2,
  completed: BookOpenCheck,
  cancelled: ShieldAlert,
  reminder: Bell,
  announcement: Megaphone,
  welcome: Star,
  update: Info,
};

function resolveIcon(notification) {
  const text = `${notification.title} ${notification.message}`.toLowerCase();

  for (const [keyword, Icon] of Object.entries(ICON_MAP)) {
    if (text.includes(keyword)) return Icon;
  }

  return Sparkles;
}

// ── Relative timestamp ────────────────────────────────────────────────────────
function RelativeTime({ value }) {
  if (!value) return null;

  try {
    const date = new Date(value);
    const distance = formatDistanceToNow(date, { addSuffix: true });

    return (
      <time
        dateTime={date.toISOString()}
        className="text-xs font-medium text-ink-400 dark:text-ink-500"
        title={date.toLocaleString()}
      >
        {distance}
      </time>
    );
  } catch {
    return null;
  }
}

// ── NotificationCard ─────────────────────────────────────────────────────────
export function NotificationCard({ notification, index, onMarkRead, isMarking }) {
  const isUnread = !notification.is_read;
  const IconComponent = resolveIcon(notification);
  const isPending = isMarking && isUnread;

  const handleMarkRead = (e) => {
    e.stopPropagation();
    if (!isUnread || isPending) return;
    onMarkRead(notification.id);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.035, 0.42) }}
      className={cn(
        "group relative flex gap-4 rounded-2xl border p-4 transition sm:p-5",
        isUnread
          ? "border-brand-200/80 bg-white/90 shadow-sm hover:-translate-y-0.5 hover:shadow-glow dark:border-brand-300/20 dark:bg-[#101827]/90"
          : "border-ink-200/60 bg-white/50 dark:border-white/8 dark:bg-white/5",
      )}
      role="article"
      aria-label={`Notification: ${notification.title || "Update"}`}
    >
      {/* Unread indicator strip */}
      {isUnread && (
        <span
          aria-hidden="true"
          className="absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full bg-brand-500"
        />
      )}

      {/* Icon */}
      <div
        className={cn(
          "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition",
          isUnread
            ? "bg-brand-500/12 text-brand-600 dark:bg-brand-300/12 dark:text-brand-200"
            : "bg-ink-100/80 text-ink-500 dark:bg-white/8 dark:text-ink-300",
        )}
      >
        <IconComponent className="h-4 w-4" aria-hidden="true" />
      </div>

      {/* Body */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <p
            className={cn(
              "text-sm font-bold leading-5",
              isUnread
                ? "text-ink-950 dark:text-white"
                : "text-ink-600 dark:text-ink-300",
            )}
          >
            {notification.title || "Notification"}
          </p>

          <div className="flex items-center gap-2">
            <RelativeTime value={notification.created_at} />

            {isUnread && (
              <span
                className="h-2 w-2 shrink-0 rounded-full bg-brand-500"
                aria-label="Unread"
              />
            )}
          </div>
        </div>

        <p
          className={cn(
            "mt-1.5 text-sm leading-6",
            isUnread
              ? "text-ink-600 dark:text-ink-200"
              : "text-ink-400 dark:text-ink-500",
          )}
        >
          {notification.message || "New Nexora update."}
        </p>

        {/* Mark as read button — only for unread */}
        {isUnread && (
          <button
            type="button"
            onClick={handleMarkRead}
            disabled={isPending}
            aria-label="Mark this notification as read"
            className={cn(
              "mt-3 inline-flex items-center gap-1.5 rounded-lg border border-brand-200/70 bg-brand-50/60 px-3 py-1 text-xs font-semibold text-brand-700 transition",
              "hover:bg-brand-100 dark:border-brand-300/20 dark:bg-brand-300/8 dark:text-brand-200 dark:hover:bg-brand-300/16",
              isPending && "cursor-not-allowed opacity-60",
            )}
          >
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            {isPending ? "Marking…" : "Mark as read"}
          </button>
        )}
      </div>
    </motion.article>
  );
}
