import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn";

export function FormField({
  id,
  label,
  error,
  helper,
  className,
  rightSlot,
  leftSlot,
  as = "input",
  children,
  success,
  ...props
}) {
  const Component = as;
  const hasError = Boolean(error);
  const hasSuccess = Boolean(success) && !hasError;

  // Use direct var(--...) bindings to ensure compatibility across all versions of Tailwind and override browser/forms defaults
  const inputBase = cn(
    "w-full rounded-md border px-4 text-sm font-normal text-text-primary bg-bg-surface border-border-subtle",
    "placeholder:text-text-tertiary",
    "shadow-token-sm",
    "transition-all duration-token-standard ease-token-enter",
    "hover:border-border-strong",
    // Focus
    "focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20",
    // Error state
    hasError && "border-accent-danger focus:border-accent-danger focus:ring-[var(--accent-danger)]/20",
    // Success state
    hasSuccess && "border-accent-mentor focus:border-accent-mentor focus:ring-[var(--accent-mentor)]/20",
    // Padding adjustments for slots
    leftSlot ? "pl-10" : "",
    (rightSlot || hasError || hasSuccess) ? "pr-10" : "",
  );

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label
          className="block text-caption font-medium uppercase tracking-token-caption text-text-secondary"
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {/* Left slot */}
        {leftSlot && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
            {leftSlot}
          </div>
        )}

        {as === "select" ? (
          <select
            id={id}
            className={cn(
              inputBase,
              "h-10 appearance-none bg-bg-surface", // match standard size md (h-10)
            )}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${id}-error` : helper ? `${id}-helper` : undefined}
            {...props}
          >
            {children}
          </select>
        ) : (
          <Component
            id={id}
            className={cn(
              inputBase,
              as === "textarea" ? "min-h-28 py-3 leading-relaxed resize-none" : "h-10", // match size md (h-10)
            )}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${id}-error` : helper ? `${id}-helper` : undefined}
            {...props}
          />
        )}

        {/* Right slot — error/success icon takes priority */}
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          {hasError ? (
            <AlertCircle className="h-4 w-4 text-accent-danger" aria-hidden="true" />
          ) : hasSuccess ? (
            <CheckCircle2 className="h-4 w-4 text-accent-mentor" aria-hidden="true" />
          ) : rightSlot ? (
            rightSlot
          ) : null}
        </div>
      </div>

      {/* Animated error / helper message */}
      <AnimatePresence mode="wait">
        {hasError ? (
          <motion.p
            key="error"
            id={`${id}-error`}
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs font-medium text-accent-danger"
          >
            {error.message}
          </motion.p>
        ) : helper ? (
          <motion.p
            key="helper"
            id={`${id}-helper`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs leading-5 text-text-tertiary"
          >
            {helper}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function PasswordToggle({ visible, onClick }) {
  const Icon = visible ? EyeOff : Eye;

  return (
    <button
      type="button"
      aria-label={visible ? "Hide password" : "Show password"}
      className="pointer-events-auto absolute right-3 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-sm text-text-tertiary transition hover:bg-bg-elevated hover:text-text-primary"
      onClick={onClick}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
