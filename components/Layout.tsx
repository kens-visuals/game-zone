import { ReactNode } from 'react';

// Components
import Navbar from './Navbar';
import SearchResults from './SearchResults';

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-primary p-4 pt-16 font-outfit text-white">
        <SearchResults />
        {children}
      </main>
    </>
  );
}
