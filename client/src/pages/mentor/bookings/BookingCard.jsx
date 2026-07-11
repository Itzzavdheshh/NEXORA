import { motion } from "framer-motion";
import { Calendar, Clock, Mail, Video, Check, X, Sparkles, Eye } from "lucide-react";
import { format } from "date-fns";
import { Button } from "../../../components/ui/Button";
import { cn } from "../../../utils/cn";

const statusColors = {
  pending: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-100",
  confirmed: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-100",
  completed: "border-brand-200 bg-brand-50 text-brand-800 dark:border-brand-400/20 dark:bg-brand-400/10 dark:text-brand-100",
  cancelled: "border-red-200 bg-red-50 text-red-800 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-100",
};

export function BookingCard({ booking, onStatusUpdate, isUpdating, onSelect, index }) {
  const { id, status, booking_date, start_time, end_time, notes, student } = booking;


  const initials = (student?.full_name || "S")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const formattedDate = booking_date
    ? format(new Date(booking_date), "MMM d, yyyy")
    : "Date not specified";

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.45) }}
      onClick={() => onSelect(booking)}
      className="glass-panel group relative flex flex-col justify-between rounded-3xl p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-glow cursor-pointer sm:p-6"
    >
      <div>
        {/* Header: Student Info + Status */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {student?.avatar_url ? (
              <img
                src={student.avatar_url}
                alt=""
                className="h-10 w-10 rounded-xl border border-ink-200 object-cover dark:border-white/10"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-950 text-xs font-extrabold text-white shadow-sm dark:bg-brand-300 dark:text-ink-950">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <h3 className="truncate text-sm font-extrabold text-ink-950 dark:text-white">
                {student?.full_name || "Student User"}
              </h3>
              <p className="mt-0.5 truncate text-xxs font-semibold text-ink-500 dark:text-ink-300">
                {student?.email || "No email"}
              </p>
            </div>
          </div>

          <span
            className={cn(
              "rounded-full border px-2 py-0.5 text-xxs font-extrabold capitalize tracking-[0.04em]",
              statusColors[status] || "border-ink-200 bg-ink-50 text-ink-700",
            )}
          >
            {status}
          </span>
        </div>

        {/* Schedule Info */}
        <div className="mt-4 space-y-1.5 text-xs text-ink-600 dark:text-ink-300">
          <div className="flex items-center gap-2 font-bold text-ink-800 dark:text-ink-200">
            <Calendar className="h-3.5 w-3.5 text-ink-400" />
            {formattedDate}
          </div>
          <div className="flex items-center gap-2 font-semibold">
            <Clock className="h-3.5 w-3.5 text-ink-400" />
            {start_time?.slice(0, 5)} – {end_time?.slice(0, 5)}
          </div>
        </div>

        {/* Short clip notes preview */}
        {notes && (
          <p className="mt-3 line-clamp-1 text-xxs text-ink-400 dark:text-ink-500 italic">
            "{notes}"
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-ink-200/60 pt-3 dark:border-white/10">
        <span className="inline-flex items-center gap-1 text-xxs font-bold text-brand-600 dark:text-brand-300">
          <Eye className="h-3.5 w-3.5" />
          View details
        </span>

        {/* Card actions */}
        {(status === "pending" || status === "confirmed") && (
          <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
            {status === "pending" && (
              <>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => onStatusUpdate(id, "confirmed")}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-700 transition hover:bg-emerald-500 hover:text-white dark:bg-emerald-400/10 dark:text-emerald-200"
                  title="Confirm booking"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => onStatusUpdate(id, "cancelled")}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-700 transition hover:bg-red-500 hover:text-white dark:bg-red-500/10 dark:text-red-200"
                  title="Cancel booking"
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
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/12 text-brand-700 transition hover:bg-brand-500 hover:text-white dark:bg-brand-300/12 dark:text-brand-200"
                  title="Mark completed"
                >
                  <Sparkles className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => onStatusUpdate(id, "cancelled")}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-700 transition hover:bg-red-500 hover:text-white dark:bg-red-500/10 dark:text-red-200"
                  title="Cancel booking"
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
