import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

// Animations
import { listVariants } from '../lib/animations';

interface Props {
  children: ReactNode;
}

export default function PageList({ children }: Props) {
  const { pathname } = useRouter();

  return (
    <motion.ul
      key={pathname}
      initial="initial"
      whileInView="visible"
      variants={listVariants}
      viewport={{ once: true }}
      className="grid w-full grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4"
    >
      {children}
    </motion.ul>
  );
}
