import { motion } from "framer-motion";
import { Calendar, Clock, Check, X, Sparkles, Eye } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../../../utils/cn";

const STATUS_CONFIG = {
  pending:   { label: "Pending",   pill: "bg-amber-500/12 text-amber-300"             },
  confirmed: { label: "Confirmed", pill: "bg-emerald-500/12 text-emerald-300"          },
  completed: { label: "Completed", pill: "bg-amber-500/12 text-accent-primary"},
  cancelled: { label: "Cancelled", pill: "bg-red-500/12 text-red-400"                 },
};

export function BookingCard({ booking, onStatusUpdate, isUpdating, onSelect, index }) {
  const { id, status, booking_date, start_time, end_time, notes, student } = booking;

  const initials = (student?.full_name || "S")
    .split(" ")
    .map(p => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const formattedDate = booking_date
    ? format(new Date(booking_date), "MMM d, yyyy")
    : "Date not specified";

  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.45) }}
      onClick={() => onSelect(booking)}
      className="group relative flex cursor-pointer flex-col justify-between rounded-2xl border border-border-subtle bg-bg-surface p-5 transition duration-200 hover:-translate-y-0.5 hover:border-border-strong"
    >
      {/* Header: Student + Status */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {student?.avatar_url ? (
            <img
              src={student.avatar_url}
              alt=""
              className="h-10 w-10 rounded-xl border border-border-subtle object-cover"
            />
          ) : (
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold text-[var(--bg-base)]"
              style={{ background: "var(--accent-mentor)" }}
            >
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="truncate text-sm font-extrabold text-text-primary">
              {student?.full_name || "Student User"}
            </h3>
            <p className="mt-0.5 truncate text-[11px] text-text-tertiary">
              {student?.email || "No email"}
            </p>
          </div>
        </div>
        <span className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold", cfg.pill)}>
          {cfg.label}
        </span>
      </div>

      {/* Schedule */}
      <div className="mt-4 space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-text-secondary">
          <Calendar className="h-3.5 w-3.5 text-text-tertiary" />
          {formattedDate}
        </div>
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <Clock className="h-3.5 w-3.5 text-text-tertiary" />
          {start_time?.slice(0, 5)} – {end_time?.slice(0, 5)}
        </div>
      </div>

      {/* Notes preview */}
      {notes && (
        <p className="mt-3 line-clamp-1 text-[11px] italic text-text-tertiary">
          "{notes}"
        </p>
      )}

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-3">
        <span className="flex items-center gap-1.5 text-[11px] font-bold" style={{ color: "var(--accent-mentor)" }}>
          <Eye className="h-3.5 w-3.5" />
          View details
        </span>

        {/* Quick actions */}
        {(status === "pending" || status === "confirmed") && (
          <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
            {status === "pending" && (
              <>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => onStatusUpdate(id, "confirmed")}
                  title="Confirm"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/12 text-accent-mentor transition hover:bg-accent-mentor hover:text-[var(--bg-base)] disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => onStatusUpdate(id, "cancelled")}
                  title="Decline"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-400 transition hover:bg-red-500 hover:text-white disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            )}
            {status === "confirmed" && (
              <>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => onStatusUpdate(id, "completed")}
                  title="Mark completed"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/12 text-amber-300 transition hover:bg-amber-500 hover:text-white disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => onStatusUpdate(id, "cancelled")}
                  title="Cancel"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-400 transition hover:bg-red-500 hover:text-white disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
}
