import { Variants } from 'framer-motion';

export const pageNavItemVariants: Variants = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -10 },
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
