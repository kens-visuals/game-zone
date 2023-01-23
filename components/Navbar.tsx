import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';

// Components
import Drawer from './Drawer';

// Hooks
import useUser from '../hooks/useUser';
import useAuth from '../hooks/useAuth';

export default function Navbar() {
  const { pathname } = useRouter();
  const { user: currentUser } = useUser();
  const { handleUserSignIn, handleUserSignOut } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleDrawerClick = () =>
    setIsDrawerOpen((drawerState) => !drawerState);

  const routes = [
    {
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
      path: '/genres',
      icon: (
        <path d="M5.625 3.75a2.625 2.625 0 100 5.25h12.75a2.625 2.625 0 000-5.25H5.625zM3.75 11.25a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75zM3 15.75a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75zM3.75 18.75a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75z" />
      ),
    },
    {
      path: '/collections',
      icon: (
        <path d="M19.906 9c.382 0 .749.057 1.094.162V9a3 3 0 00-3-3h-3.879a.75.75 0 01-.53-.22L11.47 3.66A2.25 2.25 0 009.879 3H6a3 3 0 00-3 3v3.162A3.756 3.756 0 014.094 9h15.812zM4.094 10.5a2.25 2.25 0 00-2.227 2.568l.857 6A2.25 2.25 0 004.951 21H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-2.227-2.568H4.094z" />
      ),
    },
  ];

  return (
    <>
      {isDrawerOpen && <Drawer />}

      <nav className="fixed z-50 flex w-full items-center justify-between bg-primary-dark/50 p-4 backdrop-blur-2xl  backdrop-filter">
        <button
          type="button"
          aria-label="hamburger"
          onClick={handleDrawerClick}
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

        <ul className="flex items-center justify-between gap-4">
          {routes.map((route) => (
            <li key={route.path}>
              <Link href={route.path}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={`h-6 w-6 transition-all duration-300 ${
                    pathname === route.path
                      ? 'fill-white'
                      : 'fill-primary-light hover:fill-white'
                  }`}
                >
                  {route.icon}
                </svg>
              </Link>
            </li>
          ))}
        </ul>

        <div className="relative flex items-center">
          <button
            type="button"
            onClick={() => setIsUserMenuOpen((prevState) => !prevState)}
          >
            <img
              className="aspect-square w-8 cursor-pointer rounded-full"
              src={currentUser?.photoURL}
              alt="User dropdown"
            />
          </button>

          <div
            className={`absolute top-12 left-0 z-10 -translate-x-[82%] divide-y divide-primary-light/50 rounded-lg bg-primary/50 text-white shadow backdrop-blur-2xl backdrop-filter ${
              !isUserMenuOpen && 'hidden'
            }`}
          >
            <div className="px-4 py-3 text-sm">
              <span>{currentUser?.displayName}</span>
              <div className="truncate font-medium">{currentUser?.email}</div>
            </div>
            <ul className="py-2 text-sm">
              <li>
                <Link
                  href={`/user/${currentUser?.uid}`}
                  className="block px-4 py-2"
                >
                  Profile
                </Link>
              </li>
            </ul>
            <div className="py-1">
              {!currentUser ? (
                <button
                  type="button"
                  onClick={handleUserSignIn}
                  className="bg flex items-center gap-2 px-4 py-2 text-sm"
                  // className="mr-2 mb-2 inline-flex items-center rounded-lg bg-[#4285F4] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[#4285F4]/90 focus:outline-none focus:ring-4 focus:ring-[#4285F4]/50"
                >
                  Sign in with Google
                  <svg
                    className="mr-2 -ml-1 h-4 w-4"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fab"
                    data-icon="google"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 488 512"
                  >
                    <path
                      fill="currentColor"
                      d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleUserSignOut}
                  // className="flex gap-2 rounded-md bg-primary-dark p-2 text-white"
                  className="bg flex items-center gap-2 px-4 py-2 text-sm"
                >
                  Sign Out
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-4 w-4 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
