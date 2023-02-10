import { Variants } from 'framer-motion';

export const pageAnimationVariants: Variants = {
  initial: {
    y: -10,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, staggerDirection: 0.4, delay: 0.5 },
  },
  exit: {
    y: 10,
    opacity: 0,
  },
};

export const drawerVariants: Variants = {
  initial: {
    x: '150%',
    backdropFilter: `blur(0px)`,
    WebkitBackdropFilter: `blur(0px)`,
  },
  animate: {
    x: 0,
    backdropFilter: `blur(16px)`,
    WebkitBackdropFilter: `blur(16px)`,
    transition: { duration: 0.5, delayChildren: 0.1, staggerChildren: 0.1 },
  },
  exit: {
    x: '150%',
    backdropFilter: `blur(0px)`,
    WebkitBackdropFilter: `blur(0px)`,
    transition: {
      delay: 0.6,
      duration: 0.35,
      staggerChildren: 0.1,
      staggerDirection: -1,
    },
  },
};

export const fadeIn: Variants = {
  closed: { opacity: 0 },
  open: { opacity: 1 },
};

export const fadeInOut: Variants = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -10 },
};

export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      delayChildren: 0.2,
      staggerChildren: 0.1,
    },
  },
  exit: { opacity: 0, y: -10 },
};

export const navVariants = ({
  matches,
  isSidebarOpen,
}: {
  matches: boolean;
  isSidebarOpen: boolean;
}) =>
  matches
    ? {
        initial: {
          y: 0,
          width: isSidebarOpen ? '16rem' : '5rem',
          transition: {
            staggerChildren: 0.1,
            staggerDirection: -1,
            delayChildren: 1.5,
          },
        },
        animate: {
          width: isSidebarOpen ? '16rem' : '5rem',
          transition: {
            staggerChildren: 0.1,
            staggerDirection: 1,
            delayChildren: 1.5,
          },
        },
      }
    : {
        initial: {
          y: -50,
          transition: {
            staggerChildren: 0.1,
            staggerDirection: -1,
            delayChildren: 1.5,
          },
        },
        animate: {
          y: 0,
          transition: {
            staggerChildren: 0.1,
            staggerDirection: 1,
            delayChildren: 1.5,
          },
        },
      };

export const dividerVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      delayChildren: 0.8,
      staggerChildren: 0.2,
    },
  },
};

export const dividerChildrenVariants: Variants = {
  initial: {
    width: 0,
  },
  animate: {
    width: '100%',
    transition: { duration: 0.4 },
  },
};

export const listVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.1,
    },
  },
};

export const itemVariants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
};
