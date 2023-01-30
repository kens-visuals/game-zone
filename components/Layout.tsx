import { ReactNode } from 'react';

// Components
import Navbar from './Navbar';
import SearchResults from './SearchResults';

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="bg-primary p-4 md:flex md:min-h-screen md:justify-center md:gap-4 md:px-8">
      <Navbar />
      <main className="min-h-screen pt-16 font-outfit text-white md:w-full md:pt-0 md:pl-24">
        <SearchResults />
        {children}
      </main>
    </div>
  );
}
