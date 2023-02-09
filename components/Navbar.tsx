// import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Components
import Logo from './Logo';
import Drawer from './Drawer';
import Footer from './Footer';
import Divider from './Divider';
import MainNav from './MainNav';
import PagesNav from './PagesNav';
import UserProfile from './UserProfile';
import SignInButton from './SignInButton';
import SignOutButton from './SignOutButton';

// Hooks
import useUser from '../hooks/useUser';
import useMediaQuery from '../hooks/useMediaQuery';

// Animations
import { navVariants } from '../lib/animations';

// Interface
interface Props {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isSidebarOpen: any) => void;
}

export default function Navbar({ isSidebarOpen, setIsSidebarOpen }: Props) {
  const { pathname } = useRouter();
  const { currentUser, isUserLoading } = useUser();
  const matches = useMediaQuery('(min-width: 768px)');

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => setIsDrawerOpen(false), [pathname]);

  const handleDrawerClick = () =>
    setIsDrawerOpen((drawerState) => !drawerState);

  return (
    <>
      <AnimatePresence>{isDrawerOpen && <Drawer />}</AnimatePresence>

      <motion.nav
        layout
        initial="initial"
        animate="animate"
        variants={navVariants({ matches, isSidebarOpen })}
        className={`fixed left-4 z-50 flex w-[calc(100vw_-_2rem)] items-center justify-between rounded-lg bg-primary-dark/50 p-4 shadow-2xl shadow-primary backdrop-blur-2xl backdrop-filter md:static md:left-6 md:h-[calc(100vh_-_2rem)] md:flex-col md:justify-start md:gap-4 ${
          isSidebarOpen ? 'md:w-fit md:items-start' : 'md:w-20 md:items-center'
        }`}
      >
        <Logo isSidebarOpen={isSidebarOpen} />

        {currentUser && (
          <div
            className={`hidden md:mt-2 md:inline-block ${
              isSidebarOpen ? 'lg:mt-2' : 'lg:mt-7'
            }`}
          >
            <UserProfile isSidebarOpen={isSidebarOpen} />
          </div>
        )}

        <MainNav isSidebarOpen={isSidebarOpen} />

        <div className="hidden w-full md:inline-block ">
          <Divider />
        </div>

        <PagesNav isSidebarOpen={isSidebarOpen} />

        <button
          type="button"
          aria-label="hamburger"
          onClick={handleDrawerClick}
          className="md:hidden"
        >
          {/* Hamburger */}
          {isDrawerOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          )}
        </button>

        <button
          type="button"
          onClick={() => setIsSidebarOpen((prevState: boolean) => !prevState)}
          className={`hidden transition-all duration-300 md:mt-auto md:gap-2 ${
            isSidebarOpen ? 'md:flex md:items-center' : 'md:inline-block'
          } `}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            className={`h-6 w-6 fill-secondary transition-all duration-300 ${
              isSidebarOpen && 'rotate-180'
            }`}
          >
            <path
              fillRule="evenodd"
              d="M4.72 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L11.69 12 4.72 5.03a.75.75 0 010-1.06zm6 0a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06L17.69 12l-6.97-6.97a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>

          <span
            className={`hidden text-body-1 text-white ${
              isSidebarOpen ? 'md:inline-block' : 'md:hidden'
            }`}
          >
            Collapse
          </span>
        </button>

        <div className="hidden md:mt-3 md:inline-block md:w-full">
          {currentUser ? (
            <SignOutButton isSidebarOpen={isSidebarOpen} />
          ) : (
            <SignInButton
              isSidebarOpen={isSidebarOpen}
              isUserLoading={isUserLoading}
            />
          )}
        </div>

        <div className="hidden md:mt-3 md:inline-block md:w-full">
          <Footer isSidebarOpen={isSidebarOpen} />
        </div>
      </motion.nav>
    </>
  );
}
