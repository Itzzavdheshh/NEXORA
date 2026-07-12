import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  User,
  Power,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { cn } from "../../../utils/cn";
import { useFocusTrap } from "../../../hooks/useFocusTrap";

const roleColors = {
  student: "bg-brand-500/10 text-brand-700 dark:bg-brand-300/10 dark:text-brand-200",
  mentor: "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-300/10 dark:text-emerald-200",
  admin: "bg-violet-500/10 text-violet-700 dark:bg-violet-300/10 dark:text-violet-200",
};

const statusColors = {
  active: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200",
  inactive: "border-ink-200 bg-ink-50 text-ink-700 dark:border-white/10 dark:bg-white/5 dark:text-ink-300",
  suspended: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200",
  rejected: "border-red-200 bg-red-50 text-red-800 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200",
};

export function UserDrawer({ isOpen, onClose, user, onStatusUpdate, isUpdating }) {
  const drawerRef = useRef(null);

  // Trap focus inside drawer when open
  useFocusTrap(drawerRef, isOpen);

  // Prevent scrolling
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


  if (!isOpen || !user) return null;

  const { id, full_name, email, avatar_url, role, status, is_verified, created_at } = user;
  const initials = (full_name || "U")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const formattedDate = created_at
    ? new Date(created_at).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not available";

  const isActive = status === "active";

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-ink-950/40 backdrop-blur-sm"
          onClick={() => {
            if (!isUpdating) onClose();
          }}
        />

        {/* Panel */}
        <motion.div
          ref={drawerRef}
          initial={{ x: "100%" }}

          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 220 }}
          role="dialog"
          aria-modal="true"
          className="relative z-50 flex h-full w-full max-w-lg flex-col border-l border-ink-200/80 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-[#101827]/95"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-ink-200/60 px-6 py-5 dark:border-white/10">
            <h2 className="text-lg font-extrabold tracking-tight text-ink-950 dark:text-white">
              User account details
            </h2>
            <button
              type="button"
              disabled={isUpdating}
              onClick={onClose}
              className="rounded-xl p-2 text-ink-500 hover:bg-ink-100 dark:hover:bg-white/10"
              aria-label="Close details"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Basic metadata */}
            <div className="flex items-center gap-4">
              {avatar_url ? (
                <img
                  src={avatar_url}
                  alt=""
                  className="h-16 w-16 rounded-3xl border border-ink-200 object-cover dark:border-white/10"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-ink-950 text-lg font-extrabold text-white shadow-glow dark:bg-brand-300 dark:text-ink-950">
                  {initials}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-lg font-extrabold text-ink-950 dark:text-white">
                  {full_name}
                </h3>
                <a
                  href={`mailto:${email}`}
                  className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline dark:text-brand-300"
                >
                  <Mail className="h-4 w-4" />
                  {email}
                </a>
              </div>
            </div>

            {/* Badges block */}
            <div className="flex flex-wrap gap-2">
              <span className={cn("rounded-full px-3 py-1 text-xs font-bold capitalize", roleColors[role] || "bg-ink-50 text-ink-600")}>
                Role: {role}
              </span>
              <span className={cn("rounded-full border px-3 py-1 text-xs font-extrabold capitalize tracking-[0.04em]", statusColors[status] || "border-ink-200 bg-ink-50 text-ink-700")}>
                Status: {status}
              </span>
            </div>

            {/* Account Logs */}
            <div className="rounded-3xl border border-ink-200/60 bg-white/50 p-5 dark:border-white/5 dark:bg-white/5 space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-4 w-4 text-ink-400" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-400 dark:text-ink-500">Registration Date</p>
                  <p className="mt-1 text-sm font-extrabold text-ink-900 dark:text-white">{formattedDate}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-4 w-4 text-ink-400" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-400 dark:text-ink-500">Account ID</p>
                  <code className="mt-1 block text-xxs font-bold text-ink-600 dark:text-ink-400 font-mono break-all">{id}</code>
                </div>
              </div>

              <div className="flex items-start gap-3">
                {is_verified ? (
                  <ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-500" />
                ) : (
                  <ShieldAlert className="mt-0.5 h-4 w-4 text-amber-500" />
                )}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-400 dark:text-ink-500">Verification Status</p>
                  <p className="mt-1 text-sm font-extrabold text-ink-900 dark:text-white">
                    {is_verified ? "Verified Professional" : "Unverified / Awaiting validation"}
                  </p>
                </div>
              </div>
            </div>

            {/* Informational Warning for self protection */}
            {role === "admin" && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-400/10 dark:bg-amber-400/5">
                <p className="text-xs leading-5 text-amber-800 dark:text-amber-200">
                  <strong>Notice:</strong> Administrative accounts cannot be deactivated from this dashboard to prevent self-lockout.
                </p>
              </div>
            )}
          </div>

          {/* Action Footer */}
          {role !== "admin" && (
            <div className="border-t border-ink-200/60 bg-ink-50/50 px-6 py-5 dark:border-white/10 dark:bg-white/2">
              <div className="flex gap-3">
                {isActive ? (
                  <Button
                    variant="danger"
                    loading={isUpdating}
                    onClick={() => onStatusUpdate(id, "inactive")}
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4" />
                    Deactivate Account
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    loading={isUpdating}
                    onClick={() => onStatusUpdate(id, "active")}
                    className="flex-1"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Activate Account
                  </Button>
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
