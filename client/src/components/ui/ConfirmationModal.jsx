import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, X } from "lucide-react";
import { Button } from "./Button";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { cn } from "../../utils/cn";

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm action",
  message = "Are you sure you want to proceed? This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  isLoading = false,
}) {
  const modalRef = useRef(null);

  useFocusTrap(modalRef, isOpen);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === "Escape" && !isLoading) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose, isLoading]);

  const isSuccess = variant === "success";
  const IconComponent = isSuccess ? CheckCircle2 : AlertTriangle;
  const iconStyle = isSuccess
    ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400"
    : "bg-red-500/10 text-red-600 dark:bg-red-400/10 dark:text-red-400";

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 bg-ink-950/40 backdrop-blur-sm"
          onClick={() => !isLoading && onClose()}
          aria-hidden="true"
        />

        {/* Dialog */}
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
          className={cn(
            "relative w-full max-w-sm overflow-hidden rounded-2xl",
            "border border-ink-200/60 bg-white/98 shadow-elevation-4 backdrop-blur-xl",
            "dark:border-white/8 dark:bg-[#0d1526]/98",
          )}
        >
          {/* Close */}
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute right-3 top-3 rounded-lg p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700 dark:hover:bg-white/8 dark:hover:text-ink-200"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="p-6">
            {/* Icon */}
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", iconStyle)}>
              <IconComponent className="h-5 w-5" aria-hidden="true" />
            </div>

            {/* Content */}
            <h2
              id="confirm-modal-title"
              className="mt-4 text-base font-semibold text-ink-950 dark:text-white"
            >
              {title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-ink-500 dark:text-ink-400">
              {message}
            </p>

            {/* Actions */}
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="secondary"
                size="sm"
                disabled={isLoading}
                onClick={onClose}
                className="w-full sm:w-auto"
              >
                {cancelLabel}
              </Button>
              <Button
                variant={variant === "success" ? "success" : "danger"}
                size="sm"
                loading={isLoading}
                onClick={onConfirm}
                className="w-full sm:w-auto"
              >
                {confirmLabel}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body,
  );
}
