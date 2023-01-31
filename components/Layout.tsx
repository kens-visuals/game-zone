import { ReactNode, useState } from 'react';

// Components
import Navbar from './Navbar';
import SearchResults from './SearchResults';

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="bg-primary p-4 md:grid md:min-h-screen md:grid-cols-[auto_1fr] md:justify-center md:gap-4 md:overflow-hidden lg:gap-6 lg:px-8">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <main className="pt-16 font-outfit text-white md:h-[calc(100vh_-_2rem)] md:w-full md:overflow-y-scroll md:pt-0">
        <SearchResults />
        {children}
      </main>
    </div>
  );
}
