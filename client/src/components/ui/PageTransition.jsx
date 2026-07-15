import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/**
 * PageTransition — wraps page content with a clean enter/exit animation.
 * Respects OS/browser prefers-reduced-motion: falls back to instant
 * opacity-only fade instead of the slide when reduced motion is preferred.
 */
export function PageTransition({ children, className }) {
  const prefersReducedMotion = useReducedMotion();

  const variants = prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -6 },
      };

  const transition = prefersReducedMotion
    ? { duration: 0.12 }
    : { duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        {...variants}
        transition={transition}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
