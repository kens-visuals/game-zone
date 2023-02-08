import { ReactNode, useState } from 'react';
import { LayoutGroup, motion } from 'framer-motion';

// Components
import Navbar from './Navbar';
import SearchResults from './SearchResults';

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-primary p-4 md:grid md:grid-cols-[auto_1fr] md:justify-center md:gap-4 md:overflow-hidden lg:gap-6 lg:px-8">
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
          {children}
        </motion.main>
      </LayoutGroup>
    </div>
  );
}
