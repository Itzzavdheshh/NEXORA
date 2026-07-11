import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

const variants = {
  primary:
    "bg-ink-950 text-white shadow-glow hover:bg-ink-800 dark:bg-brand-300 dark:text-ink-950 dark:hover:bg-brand-200",
  secondary:
    "border border-ink-200 bg-white/80 text-ink-800 shadow-sm hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-ink-50 dark:hover:bg-white/20",
  danger:
    "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-100 dark:hover:bg-red-500/20",
  ghost: "text-ink-600 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-white/10",
};

export function Button({
  children,
  className,
  variant = "primary",
  loading = false,
  disabled,
  type = "button",
  ...props
}) {
  return (
    <motion.button
      whileHover={{ y: disabled || loading ? 0 : -1 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      type={type}
      disabled={disabled || loading}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className,
      )}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
      {children}
    </motion.button>
  );
}
