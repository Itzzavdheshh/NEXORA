import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "./Button";

export function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel rounded-3xl p-7 text-center sm:p-8"
    >
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600 shadow-sm dark:bg-brand-300/10 dark:text-brand-200">
        <Sparkles className="h-5 w-5" aria-hidden="true" />
      </div>
      <h2 className="text-lg font-bold text-ink-950 dark:text-white">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-500 dark:text-ink-300">
        {description}
      </p>
      {actionLabel ? (
        <Button className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </motion.div>
  );
}
