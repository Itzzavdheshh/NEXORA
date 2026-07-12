import { motion, AnimatePresence } from "framer-motion";

/**
 * PageTransition — wraps page content with a clean enter/exit animation.
 * Used on every page consistently.
 */
export function PageTransition({ children, className }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
