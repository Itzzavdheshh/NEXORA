import { useEffect, useId } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "../../utils/cn";

export function Drawer({ open, onClose, title, children, className }) {
  const titleId = useId();
  const prefersReducedMotion = useReducedMotion();

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // When reduced motion is preferred: instant opacity-only transitions,
  // no slide or spring. When normal: standard spring slide-in from right.
  const backdropVariants = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };

  const drawerVariants = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } };

  const drawerTransition = prefersReducedMotion
    ? { duration: 0.15 }
    : { type: "spring", stiffness: 350, damping: 30 };

  const backdropTransition = { duration: prefersReducedMotion ? 0.1 : 0.2 };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            {...backdropVariants}
            transition={backdropTransition}
            className="fixed inset-0 bg-bg-base/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <motion.div
            {...drawerVariants}
            transition={drawerTransition}
            className={cn(
              "relative z-10 flex h-full w-full max-w-md flex-col border-l border-border-subtle bg-bg-surface p-6 shadow-token-lg",
              className
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-6">
              <h3 id={titleId} className="text-sm font-bold uppercase tracking-wider text-text-primary">
                {title || "Details"}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="rounded-sm p-1 text-text-tertiary hover:bg-bg-elevated hover:text-text-primary transition"
                aria-label="Close drawer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto pr-1">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
