import { motion } from "framer-motion";
import { Button } from "./Button";
import { cn } from "../../utils/cn";

/**
 * EmptyState — contextual empty states connected to real data.
 * Never used as decorative content. Always reflects actual backend state.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  size = "md",
  className,
}) {
  const sizeMap = {
    sm: { wrapper: "py-6 px-4", icon: "h-8 w-8", iconBox: "h-10 w-10 rounded-xl mb-3", title: "text-sm", desc: "text-xs" },
    md: { wrapper: "py-10 px-6", icon: "h-5 w-5", iconBox: "h-12 w-12 rounded-2xl mb-4", title: "text-base", desc: "text-sm" },
    lg: { wrapper: "py-16 px-8", icon: "h-6 w-6", iconBox: "h-14 w-14 rounded-2xl mb-5", title: "text-lg", desc: "text-sm" },
  };

  const s = sizeMap[size] ?? sizeMap.md;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className={cn(
        "flex flex-col items-center text-center",
        s.wrapper,
        className,
      )}
    >
      {Icon && (
        <motion.div
          initial={{ scale: 0.85 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.06, type: "spring", stiffness: 300, damping: 22 }}
          className={cn(
            "mx-auto flex items-center justify-center bg-ink-100/80 text-ink-500",
            "dark:bg-white/10 dark:text-ink-400",
            s.iconBox,
          )}
        >
          <Icon className={s.icon} aria-hidden="true" />
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <p className={cn("font-semibold text-ink-800 dark:text-ink-100", s.title)}>
          {title}
        </p>
        {description && (
          <p className={cn("mx-auto mt-1.5 max-w-sm leading-relaxed text-ink-500 dark:text-ink-400", s.desc)}>
            {description}
          </p>
        )}
        {actionLabel && onAction && (
          <div className="mt-5">
            <Button size="sm" variant="secondary" onClick={onAction}>
              {actionLabel}
            </Button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
