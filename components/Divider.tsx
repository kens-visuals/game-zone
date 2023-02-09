import { motion } from 'framer-motion';

// Animations
import { dividerChildrenVariants, dividerVariants } from '../lib/animations';

export default function Divider() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={dividerVariants}
      className="my-4 grid w-full gap-4"
    >
      <motion.div variants={dividerChildrenVariants} className="relative">
        <div className="absolute inset-0 h-1 w-full bg-secondary blur" />
        <div className="absolute inset-0 h-0.5 w-full bg-secondary" />
      </motion.div>
      <motion.div variants={dividerChildrenVariants} className="relative">
        <div className="absolute inset-0 h-1 w-full bg-secondary blur" />
        <div className="absolute inset-0 h-0.5 w-full bg-secondary" />
      </motion.div>
      <motion.div variants={dividerChildrenVariants} className="relative">
        <div className="absolute inset-0 h-1 w-full bg-secondary blur" />
        <div className="absolute inset-0 h-0.5 w-full bg-secondary" />
      </motion.div>
    </motion.div>
  );
}
