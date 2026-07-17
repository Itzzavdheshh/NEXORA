import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

const variants = {
  primary:
    "border border-accent-primary bg-accent-primary text-[var(--bg-base)] hover:bg-accent-primary-hover hover:shadow-accent",
  secondary:
    "border border-border-strong bg-bg-elevated text-text-primary hover:border-[var(--text-tertiary)] hover:bg-bg-floating",
  danger:
    "border border-accent-danger/40 bg-accent-danger/10 text-accent-danger hover:bg-accent-danger/15",
  ghost:
    "border border-transparent bg-transparent text-text-secondary hover:bg-bg-elevated hover:text-text-primary",
  success:
    "border border-accent-mentor/40 bg-accent-mentor/10 text-accent-mentor hover:bg-accent-mentor/15",
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
