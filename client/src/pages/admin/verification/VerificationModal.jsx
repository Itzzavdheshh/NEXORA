import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ShieldAlert, X } from "lucide-react";
import { Button } from "../../../components/ui/Button";

export function VerificationModal({ isOpen, onClose, mode, mentorName, onConfirm, isMutating }) {
  if (!isOpen) return null;

  const isVerify = mode === "verify";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-ink-950/45 backdrop-blur-sm"
        />

        {/* Panel Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          role="dialog"
          aria-modal="true"
          className="relative z-50 w-full max-w-md rounded-3xl border border-ink-200 bg-white/95 p-6 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-[#101827]/95"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute right-4 top-4 rounded-xl p-2 text-ink-400 hover:bg-ink-100 dark:hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Icon */}
          <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl ${
            isVerify ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-red-500/10 text-red-600 dark:text-red-400"
          }`}>
            {isVerify ? <ShieldCheck className="h-6 w-6" /> : <ShieldAlert className="h-6 w-6" />}
          </div>

          {/* Heading */}
          <h3 className="mt-4 text-center text-lg font-extrabold text-ink-950 dark:text-white">
            {isVerify ? "Verify mentor application?" : "Reject mentor application?"}
          </h3>

          {/* Message */}
          <p className="mt-2 text-center text-xs leading-5 text-ink-600 dark:text-ink-300">
            {isVerify ? (
              <>
                You are about to verify <strong>{mentorName}</strong>. They will immediately gain mentor dashboard access and will be listed for students to book.
              </>
            ) : (
              <>
                You are about to reject the application for <strong>{mentorName}</strong>. This will set their profile status to <strong>rejected</strong>.
              </>
            )}
          </p>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isMutating}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant={isVerify ? "primary" : "danger"}
              onClick={onConfirm}
              loading={isMutating}
              className="flex-1"
            >
              {isVerify ? "Verify" : "Reject"}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
