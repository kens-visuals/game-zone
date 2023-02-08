import { Variants } from 'framer-motion';

export const drawerVariants: Variants = {
  initial: {
    x: '100%',
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
    x: '100%',
    backdropFilter: `blur(0px)`,
    WebkitBackdropFilter: `blur(0px)`,
    transition: {
      delay: 0.8,
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
