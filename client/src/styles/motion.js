export const durations = {
  micro: 0.12,
  standard: 0.2,
  page: 0.32,
};

export const easings = {
  enter: [0.16, 1, 0.3, 1],
  exit: [0.65, 0, 0.35, 1],
};

export const transitions = {
  micro: {
    duration: durations.micro,
    ease: easings.enter,
  },
  standard: {
    duration: durations.standard,
    ease: easings.enter,
  },
  page: {
    duration: durations.page,
    ease: easings.enter,
  },
  exit: {
    duration: durations.standard,
    ease: easings.exit,
  },
};

export const fadeUp = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.standard,
  },
  exit: {
    opacity: 0,
    y: 8,
    transition: transitions.exit,
  },
};

export const fadeIn = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: transitions.standard,
  },
  exit: {
    opacity: 0,
    transition: transitions.exit,
  },
};

export const scaleIn = {
  hidden: {
    opacity: 0,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.standard,
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: transitions.exit,
  },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

export const drawer = {
  hidden: {
    x: "-100%",
  },
  visible: {
    x: 0,
    transition: transitions.page,
  },
  exit: {
    x: "-100%",
    transition: {
      duration: durations.page,
      ease: easings.exit,
    },
  },
};

export const buttonMotion = {
  whileHover: {
    y: -1,
    transition: transitions.micro,
  },
  whileTap: {
    scale: 0.98,
    transition: transitions.micro,
  },
};
