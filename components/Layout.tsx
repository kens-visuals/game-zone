import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';

// Components
import Navbar from './Navbar';
import SearchResults from './SearchResults';

// Animations
import { pageAnimationVariants } from '../lib/animations';

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const { pathname } = useRouter();

  useEffect(() => window.scrollTo(0, 0), [pathname]);

  return (
    <div className="min-h-screen w-full overflow-hidden bg-primary p-4 md:grid md:grid-cols-[auto_1fr] md:justify-center md:gap-4 lg:gap-6 lg:px-8">
      <LayoutGroup>
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <motion.main
          layout="position"
          transition={{ type: 'tween' }}
          className="pt-20 font-outfit text-white md:h-[calc(100vh_-_2rem)] md:w-full md:overflow-y-scroll md:pt-0"
        >
          <SearchResults />

          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageAnimationVariants}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </motion.main>
      </LayoutGroup>
    </div>
  );
}
