import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

const variants = {
  primary:
    "border border-[var(--accent-primary)] bg-[var(--accent-primary)] text-[var(--bg-base)] hover:bg-[var(--accent-primary-hover)] hover:shadow-accent",
  secondary:
    "border border-[var(--border-strong)] bg-[var(--bg-elevated)] text-[var(--text-primary)] hover:border-[var(--text-tertiary)] hover:bg-[var(--bg-floating)]",
  danger:
    "border border-[var(--accent-danger)]/40 bg-[var(--accent-danger)]/10 text-[var(--accent-danger)] hover:bg-[var(--accent-danger)]/15",
  ghost:
    "border border-transparent bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]",
  success:
    "border border-[var(--accent-mentor)]/40 bg-[var(--accent-mentor)]/10 text-[var(--accent-mentor)] hover:bg-[var(--accent-mentor)]/15",
};

const sizes = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-sm",
  md: "h-10 px-4 text-sm gap-2 rounded-md",
  lg: "h-11 px-5 text-sm gap-2 rounded-lg",
};

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  type = "button",
  ...props
}) {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      whileHover={isDisabled ? {} : { y: -1 }}
      whileTap={isDisabled ? {} : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      type={type}
      disabled={isDisabled}
      className={cn(
        "relative inline-flex items-center justify-center font-semibold transition-all duration-150",
        "disabled:cursor-not-allowed disabled:opacity-50",
        sizes[size] ?? sizes.md,
        variants[variant],
        className,
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
      ) : null}
      {children}
    </motion.button>
  );
}
