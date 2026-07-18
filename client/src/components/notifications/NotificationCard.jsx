import { motion } from "framer-motion";
import {
  Bell,
  BookOpenCheck,
  CalendarCheck,
  CalendarPlus,
  CheckCircle2,
  Megaphone,
  ShieldAlert,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "../../utils/cn";

// ── Type resolution — order matters: specific before generic ─────────────────
// Each entry: [keyword, Icon, iconGradient, iconColor]
const TYPE_CONFIG = [
  // Most specific first
  ["cancelled",    X,              "from-red-500/20 to-red-600/10",      "text-red-400"],
  ["declined",     X,              "from-red-500/20 to-red-600/10",      "text-red-400"],
  ["rejected",     ShieldAlert,    "from-red-500/20 to-red-600/10",      "text-red-400"],
  ["completed",    BookOpenCheck,  "from-emerald-500/20 to-teal-600/10", "text-emerald-400"],
  ["confirmed",    CheckCircle2,   "from-emerald-500/20 to-green-600/10","text-emerald-400"],
  ["session",      CalendarCheck,  "from-violet-500/20 to-purple-600/10","text-violet-400"],
  ["booking",      CalendarPlus,   "from-blue-500/20 to-indigo-600/10",  "text-blue-400"],
  ["reminder",     Bell,           "from-amber-500/20 to-orange-600/10", "text-amber-400"],
  ["announcement", Megaphone,      "from-pink-500/20 to-rose-600/10",    "text-pink-400"],
  ["welcome",      Star,           "from-yellow-500/20 to-amber-600/10", "text-yellow-400"],
  // Generic fallback last
  ["update",       Sparkles,       "from-sky-500/20 to-cyan-600/10",     "text-sky-400"],
];

function resolveType(notification) {
  const text = `${notification.title} ${notification.message}`.toLowerCase();
  for (const config of TYPE_CONFIG) {
    if (text.includes(config[0])) return config;
  }
  // default
  return ["general", Sparkles, "from-slate-500/20 to-slate-600/10", "text-slate-400"];
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
        className="text-[11px] font-medium text-ink-400 dark:text-ink-500 tabular-nums"
        title={date.toLocaleString()}
      >
        {distance}
      </time>
    );
  } catch {
    return null;
  }
}

// ── Role accent colors ────────────────────────────────────────────────────────
const roleStyles = {
  student: {
    unreadBorder: "border-accent-primary/25 dark:border-accent-primary/20",
    unreadBg: "bg-gradient-to-br from-accent-primary/[0.05] to-transparent dark:from-accent-primary/[0.07] dark:to-transparent",
    unreadStrip: "bg-gradient-to-b from-accent-primary to-accent-primary/40",
    unreadDot: "bg-accent-primary shadow-[0_0_6px_1px_var(--accent-primary)]",
    actionButton:
      "border-accent-primary/25 bg-accent-primary/8 text-accent-primary hover:bg-accent-primary/15 dark:border-accent-primary/20 dark:bg-accent-primary/10 dark:text-accent-primary dark:hover:bg-accent-primary/20",
  },
  mentor: {
    unreadBorder: "border-accent-mentor/25 dark:border-accent-mentor/20",
    unreadBg: "bg-gradient-to-br from-accent-mentor/[0.05] to-transparent dark:from-accent-mentor/[0.07] dark:to-transparent",
    unreadStrip: "bg-gradient-to-b from-accent-mentor to-accent-mentor/40",
    unreadDot: "bg-accent-mentor shadow-[0_0_6px_1px_var(--accent-mentor)]",
    actionButton:
      "border-accent-mentor/25 bg-accent-mentor/8 text-accent-mentor hover:bg-accent-mentor/15 dark:border-accent-mentor/20 dark:bg-accent-mentor/10 dark:text-accent-mentor dark:hover:bg-accent-mentor/20",
  },
  admin: {
    unreadBorder: "border-accent-admin/25 dark:border-accent-admin/20",
    unreadBg: "bg-gradient-to-br from-accent-admin/[0.05] to-transparent dark:from-accent-admin/[0.07] dark:to-transparent",
    unreadStrip: "bg-gradient-to-b from-accent-admin to-accent-admin/40",
    unreadDot: "bg-accent-admin shadow-[0_0_6px_1px_var(--accent-admin)]",
    actionButton:
      "border-accent-admin/25 bg-accent-admin/8 text-accent-admin hover:bg-accent-admin/15 dark:border-accent-admin/20 dark:bg-accent-admin/10 dark:text-accent-admin dark:hover:bg-accent-admin/20",
  },
};

export function NotificationCard({ notification, index, onMarkRead, isMarking, role = "student" }) {
  const isUnread = !notification.is_read;
  const isPending = isMarking && isUnread;

  const [, IconComponent, iconGradient, iconColor] = resolveType(notification);
  const activeStyles = roleStyles[role] || roleStyles.student;

  const handleMarkRead = (e) => {
    e.stopPropagation();
    if (!isUnread || isPending) return;
    onMarkRead(notification.id);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4), type: "spring", stiffness: 260, damping: 24 }}
      className={cn(
        "group relative flex gap-4 rounded-2xl border p-4 transition-all duration-200 sm:p-5",
        isUnread
          ? cn(activeStyles.unreadBorder, activeStyles.unreadBg, "shadow-sm hover:shadow-md")
          : "border-ink-200/40 bg-white/30 dark:border-white/[0.07] dark:bg-white/[0.03] hover:bg-white/50 dark:hover:bg-white/[0.05]",
      )}
      role="article"
      aria-label={`Notification: ${notification.title || "Update"}`}
    >
      {/* Unread left strip */}
      {isUnread && (
        <span
          aria-hidden="true"
          className={cn(
            "absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full",
            activeStyles.unreadStrip,
          )}
        />
      )}

      {/* Color-coded icon badge */}
      <div className="mt-0.5 shrink-0">
        <div
          className={cn(
            "relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br transition-transform duration-200 group-hover:scale-105",
            isUnread
              ? iconGradient
              : "from-ink-100/60 to-ink-200/30 dark:from-white/10 dark:to-white/5",
          )}
        >
          {/* Inner glow ring for unread */}
          {isUnread && (
            <span
              aria-hidden="true"
              className={cn(
                "absolute inset-0 rounded-2xl ring-1 ring-inset opacity-40",
                iconColor.replace("text-", "ring-"),
              )}
            />
          )}
          <IconComponent
            className={cn(
              "h-[18px] w-[18px]",
              isUnread ? iconColor : "text-ink-400 dark:text-ink-500",
            )}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Body */}
      <div className="min-w-0 flex-1">
        {/* Title row */}
        <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-0.5">
          <p
            className={cn(
              "text-sm font-bold leading-5 tracking-tight",
              isUnread
                ? "text-ink-950 dark:text-white"
                : "text-ink-500 dark:text-ink-400",
            )}
          >
            {notification.title || "Notification"}
          </p>

          <div className="flex items-center gap-2">
            <RelativeTime value={notification.created_at} />
            {isUnread && (
              <span
                className={cn(
                  "h-2 w-2 shrink-0 rounded-full transition",
                  activeStyles.unreadDot,
                )}
                aria-label="Unread"
              />
            )}
          </div>
        </div>

        {/* Message */}
        <p
          className={cn(
            "mt-1 text-sm leading-[1.65]",
            isUnread
              ? "text-ink-600 dark:text-ink-300"
              : "text-ink-400 dark:text-ink-500",
          )}
        >
          {notification.message || "New Nexora update."}
        </p>

        {/* Mark as read */}
        {isUnread && (
          <button
            type="button"
            onClick={handleMarkRead}
            disabled={isPending}
            aria-label="Mark this notification as read"
            className={cn(
              "mt-3 inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 text-[11px] font-semibold tracking-wide transition-all duration-150",
              activeStyles.actionButton,
              isPending && "cursor-not-allowed opacity-50",
            )}
          >
            <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
            {isPending ? "Marking…" : "Mark as read"}
          </button>
        )}
      </div>
    </motion.article>
  );
}
