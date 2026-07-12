import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Mail,
  Video,
  FileText,
  Check,
  X,
  Sparkles,
  GraduationCap,
  Briefcase,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "../../../components/ui/Button";
import { cn } from "../../../utils/cn";
import { useFocusTrap } from "../../../hooks/useFocusTrap";

const statusColors = {
  pending: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-100",
  confirmed: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-100",
  completed: "border-brand-200 bg-brand-50 text-brand-800 dark:border-brand-400/20 dark:bg-brand-400/10 dark:text-brand-100",
  cancelled: "border-red-200 bg-red-50 text-red-800 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-100",
};

export function BookingDrawer({ isOpen, onClose, booking, onStatusUpdate, isUpdating }) {
  const drawerRef = useRef(null);

  // Trap focus inside drawer
  useFocusTrap(drawerRef, isOpen);

  // Prevent scrolling background when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !isUpdating) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, isUpdating]);

  if (!isOpen || !booking) return null;

  const { id, status, booking_date, start_time, end_time, meeting_type, notes, student } = booking;

  const initials = (student?.full_name || "S")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const formattedDate = booking_date
    ? format(new Date(booking_date), "EEEE, MMMM d, yyyy")
    : "Date not specified";

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-ink-950/40 backdrop-blur-sm"
          onClick={() => {
            if (!isUpdating) onClose();
          }}
        />

        {/* Drawer panel */}
        <motion.div
          ref={drawerRef}
          initial={{ x: "100%" }}

          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 220 }}
          role="dialog"
          aria-modal="true"
          aria-label="Booking Details Drawer"
          className="relative z-50 flex h-full w-full max-w-lg flex-col border-l border-ink-200/80 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-[#101827]/95"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-ink-200/60 px-6 py-5 dark:border-white/10">
            <h2 className="text-lg font-extrabold tracking-tight text-ink-950 dark:text-white">
              Booking details
            </h2>
            <button
              type="button"
              disabled={isUpdating}
              onClick={onClose}
              aria-label="Close details"
              className="rounded-xl p-2 text-ink-500 transition hover:bg-ink-100 dark:hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Student Account Overview */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {student?.avatar_url ? (
                  <img
                    src={student.avatar_url}
                    alt=""
                    className="h-16 w-16 rounded-3xl border border-ink-200 object-cover dark:border-white/10"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-ink-950 text-lg font-extrabold text-white shadow-glow dark:bg-brand-300 dark:text-ink-950">
                    {initials}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-extrabold text-ink-950 dark:text-white">
                    {student?.full_name || "Student User"}
                  </h3>
                  <a
                    href={`mailto:${student?.email}`}
                    className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline dark:text-brand-300"
                  >
                    <Mail className="h-4 w-4" />
                    {student?.email || "No email"}
                  </a>
                </div>
              </div>

              <span
                className={cn(
                  "rounded-full border px-3.5 py-1 text-xs font-extrabold capitalize tracking-[0.04em]",
                  statusColors[status] || "border-ink-200 bg-ink-50 text-ink-700",
                )}
              >
                {status}
              </span>
            </div>

            {/* Session Info */}
            <div className="space-y-4 rounded-3xl border border-ink-200/60 bg-white/50 p-5 dark:border-white/5 dark:bg-white/5">
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-4 w-4 text-ink-400" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-400 dark:text-ink-500">Date</p>
                  <p className="mt-1 text-sm font-extrabold text-ink-900 dark:text-white">{formattedDate}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 text-ink-400" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-400 dark:text-ink-500">Time</p>
                  <p className="mt-1 text-sm font-extrabold text-ink-900 dark:text-white">
                    {start_time?.slice(0, 5)} – {end_time?.slice(0, 5)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Video className="mt-0.5 h-4 w-4 text-ink-400" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-400 dark:text-ink-500">Session Type</p>
                  <p className="mt-1 text-sm font-extrabold text-brand-700 dark:text-brand-300">{meeting_type || "Virtual Session"}</p>
                </div>
              </div>
            </div>

            {/* Session Notes */}
            {notes && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-400 dark:text-ink-500">
                  <FileText className="h-4 w-4" />
                  Student notes
                </div>
                <div className="rounded-2xl border border-ink-200/50 bg-white/50 p-4 text-sm leading-6 text-ink-700 dark:border-white/5 dark:bg-white/4 dark:text-ink-200">
                  {notes}
                </div>
              </div>
            )}

            {/* Student Profile Metadata */}
            {student?.profile && (
              <div className="space-y-3 border-t border-ink-200/60 pt-6 dark:border-white/10">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-400 dark:text-ink-500">
                  <GraduationCap className="h-4 w-4 text-brand-600 dark:text-brand-300" />
                  Student Academic Profile
                </div>

                <div className="grid gap-4 rounded-3xl border border-ink-200/60 bg-white/50 p-5 dark:border-white/5 dark:bg-white/5">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="block text-xs font-semibold text-ink-400 dark:text-ink-500 uppercase tracking-wider">College</span>
                      <span className="mt-1 block font-extrabold text-ink-950 dark:text-white">{student.profile.college || "N/A"}</span>
                    </div>
                    <div>
                      <span className="block text-xs font-semibold text-ink-400 dark:text-ink-500 uppercase tracking-wider">Degree</span>
                      <span className="mt-1 block font-extrabold text-ink-950 dark:text-white">{student.profile.degree || "N/A"}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="block text-xs font-semibold text-ink-400 dark:text-ink-500 uppercase tracking-wider">Branch</span>
                      <span className="mt-1 block font-extrabold text-ink-950 dark:text-white">{student.profile.branch || "N/A"}</span>
                    </div>
                  </div>

                  {student.profile.bio && (
                    <div className="mt-2 border-t border-ink-200/40 pt-3 dark:border-white/5">
                      <span className="block text-xs font-semibold text-ink-400 dark:text-ink-500 uppercase tracking-wider">Bio</span>
                      <p className="mt-1 text-sm leading-6 italic text-ink-600 dark:text-ink-300">
                        "{student.profile.bio}"
                      </p>
                    </div>
                  )}

                  {Array.isArray(student.profile.skills) && student.profile.skills.length > 0 && (
                    <div className="mt-2 border-t border-ink-200/40 pt-3 dark:border-white/5">
                      <span className="block text-xs font-semibold text-ink-400 dark:text-ink-500 uppercase tracking-wider mb-2">Skills</span>
                      <div className="flex flex-wrap gap-1.5">
                        {student.profile.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-lg bg-brand-500/10 px-2.5 py-1 text-xs font-bold text-brand-700 dark:text-brand-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Action Buttons */}
          {(status === "pending" || status === "confirmed") && (
            <div className="border-t border-ink-200/60 bg-ink-50/50 px-6 py-5 dark:border-white/10 dark:bg-white/2">
              <div className="flex gap-3">
                {status === "pending" && (
                  <>
                    <Button
                      variant="primary"
                      loading={isUpdating}
                      onClick={() => onStatusUpdate(id, "confirmed")}
                      className="flex-1"
                    >
                      <Check className="h-4 w-4" />
                      Confirm Booking
                    </Button>
                    <Button
                      variant="danger"
                      loading={isUpdating}
                      onClick={() => onStatusUpdate(id, "cancelled")}
                      className="flex-1"
                    >
                      <X className="h-4 w-4" />
                      Cancel Booking
                    </Button>
                  </>
                )}

                {status === "confirmed" && (
                  <>
                    <Button
                      variant="primary"
                      loading={isUpdating}
                      onClick={() => onStatusUpdate(id, "completed")}
                      className="flex-1"
                    >
                      <Sparkles className="h-4 w-4" />
                      Mark Completed
                    </Button>
                    <Button
                      variant="danger"
                      loading={isUpdating}
                      onClick={() => onStatusUpdate(id, "cancelled")}
                      className="flex-1"
                    >
                      <X className="h-4 w-4" />
                      Cancel Booking
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body,
  );
}
