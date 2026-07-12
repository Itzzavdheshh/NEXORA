import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "./Button";
import { useFocusTrap } from "../../hooks/useFocusTrap";

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

  // Trap focus inside modal
  useFocusTrap(modalRef, isOpen);

  // Prevent scrolling background when open
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
      if (e.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, isLoading]);

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-ink-950/40 backdrop-blur-sm"
          onClick={() => {
            if (!isLoading) onClose();
          }}
        />

        {/* Modal content */}
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.95, y: 16 }}

          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ type: "spring", duration: 0.35 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-ink-200/80 bg-white/95 p-6 shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-[#101827]/95"
        >
          {/* Close button */}
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute right-4 top-4 rounded-xl p-2 text-ink-500 transition hover:bg-ink-100 dark:hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col gap-4">
            {/* Header / Icon */}
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400">
              <AlertTriangle className="h-6 w-6" aria-hidden="true" />
            </div>

            {/* Title & Message */}
            <div>
              <h2
                id="confirm-modal-title"
                className="text-lg font-extrabold tracking-tight text-ink-950 dark:text-white"
              >
                {title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-ink-500 dark:text-ink-300">
                {message}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                variant="secondary"
                disabled={isLoading}
                onClick={onClose}
                className="w-full sm:w-auto"
              >
                {cancelLabel}
              </Button>
              <Button
                variant={variant}
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
