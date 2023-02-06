import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

// Components
import Drawer from './Drawer';
import Footer from './Footer';
import Divider from './Divider';
import PagesNav from './PagesNav';
import UserProfile from './UserProfile';
import SignInButton from './SignInButton';
import SignOutButton from './SignOutButton';

// Hooks
import useUser from '../hooks/useUser';

// import useFollow from '../hooks/useFollow';

// Interface
interface Props {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isSidebarOpen: any) => void;
}

export default function Navbar({ isSidebarOpen, setIsSidebarOpen }: Props) {
  const { pathname } = useRouter();
  const { currentUser, isUserLoading } = useUser();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => setIsDrawerOpen(false), [pathname]);

  const handleDrawerClick = () =>
    setIsDrawerOpen((drawerState) => !drawerState);

  const routes = [
    {
      name: 'Home',
      path: '/',
      icon: (
        <path
          fillRule="evenodd"
          d="M1.5 7.125c0-1.036.84-1.875 1.875-1.875h6c1.036 0 1.875.84 1.875 1.875v3.75c0 1.036-.84 1.875-1.875 1.875h-6A1.875 1.875 0 011.5 10.875v-3.75zm12 1.5c0-1.036.84-1.875 1.875-1.875h5.25c1.035 0 1.875.84 1.875 1.875v8.25c0 1.035-.84 1.875-1.875 1.875h-5.25a1.875 1.875 0 01-1.875-1.875v-8.25zM3 16.125c0-1.036.84-1.875 1.875-1.875h5.25c1.036 0 1.875.84 1.875 1.875v2.25c0 1.035-.84 1.875-1.875 1.875h-5.25A1.875 1.875 0 013 18.375v-2.25z"
          clipRule="evenodd"
        />
      ),
    },
    {
      name: 'Bookmarks',
      path: '/bookmarks',
      icon: (
        <path
          fillRule="evenodd"
          d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z"
          clipRule="evenodd"
        />
      ),
    },
    {
      name: 'Collections',
      path: '/collections',
      icon: (
        <path d="M19.906 9c.382 0 .749.057 1.094.162V9a3 3 0 00-3-3h-3.879a.75.75 0 01-.53-.22L11.47 3.66A2.25 2.25 0 009.879 3H6a3 3 0 00-3 3v3.162A3.756 3.756 0 014.094 9h15.812zM4.094 10.5a2.25 2.25 0 00-2.227 2.568l.857 6A2.25 2.25 0 004.951 21H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-2.227-2.568H4.094z" />
      ),
    },
    {
      name: 'Messages',
      path: '/messages',
      icon: (
        <>
          <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
          <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
        </>
      ),
    },
  ];

  return (
    <>
      {isDrawerOpen && <Drawer setIsDrawerOpen={setIsDrawerOpen} />}

      <nav
        className={`fixed left-4 z-50 flex w-[calc(100vw_-_2rem)] items-center justify-between rounded-lg bg-primary-dark/50 p-4 shadow-2xl shadow-primary backdrop-blur-2xl backdrop-filter md:static md:left-6 md:h-[calc(100vh_-_2rem)] md:flex-col md:justify-start md:gap-4 ${
          isSidebarOpen ? 'md:w-fit md:items-start' : 'md:w-20 md:items-center'
        }`}
      >
        <span
          className={`text-center font-outfit text-body-2 font-medium uppercase text-white md:mb-4 md:w-full ${
            isSidebarOpen && 'tracking-wider md:text-h2-medium'
          }`}
        >
          <div className="relative">
            <div className="absolute inset-0 h-1 w-full bg-secondary blur" />
            <div className="absolute inset-0 h-0.5 w-full bg-secondary" />
          </div>
          <span className="my-1 inline-block md:my-4">
            Game <br className="md:hidden" /> Zone
          </span>
          <div className="relative">
            <div className="absolute inset-0 h-1 w-full bg-secondary blur" />
            <div className="absolute inset-0 h-0.5 w-full bg-secondary" />
          </div>
        </span>

        {currentUser && (
          <div className="hidden md:mt-2 md:inline-block lg:mt-7">
            <UserProfile isSidebarOpen={isSidebarOpen} />
          </div>
        )}

        <ul
          className={`flex items-center justify-between gap-4 md:flex-col md:items-start ${
            isSidebarOpen ? 'mt-10' : 'md:mt-4'
          }`}
        >
          {routes.map((route) => (
            <li key={route.path} className="group">
              <Link
                href={route.path}
                className="md:flex md:items-center md:gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  className={`h-6 w-6 transition-all duration-300 ${
                    pathname === route.path
                      ? 'fill-white'
                      : 'fill-primary-light group-hover:fill-white'
                  }`}
                >
                  {route.icon}
                </svg>
                <span
                  className={`hidden text-h3 transition-all duration-300 
                  ${isSidebarOpen ? 'md:inline-block' : 'md:hidden'}
                  ${
                    pathname === route.path
                      ? 'text-white'
                      : 'text-primary-light group-hover:text-white'
                  }
                  `}
                >
                  {route.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden w-full md:inline-block ">
          <Divider />
        </div>

        <div className="hidden md:inline-block">
          <PagesNav isSidebarOpen={isSidebarOpen} />
        </div>

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
      </nav>
    </>
  );
}
