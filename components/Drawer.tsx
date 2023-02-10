import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Link from 'next/link';

// Components
import SignInButton from './SignInButton';
import SignOutButton from './SignOutButton';
import UserProfile from './UserProfile';

// Hooks
import useUser from '../hooks/useUser';

// Animatons
import { drawerVariants, fadeInOut } from '../lib/animations';

// Helpers
import { pageRoutes } from '../lib/routes';

export default function Drawer() {
  const { pathname } = useRouter();
  const { currentUser, isUserLoading } = useUser();

  return (
    <div className="fixed z-50 flex h-[96%] w-[calc(100vw_-_2rem)] flex-col items-end md:hidden">
      <motion.aside
        key="drawer"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={drawerVariants}
        className="mt-20 flex h-full w-60 min-w-max flex-col items-start gap-2 rounded-lg bg-primary-light/40 p-4 shadow-xl shadow-primary-dark backdrop-blur-lg backdrop-filter"
      >
        {currentUser && <UserProfile />}

        <ul className="mt-12 flex flex-col items-start gap-4 text-white md:mt-0 ">
          <AnimatePresence>
            {pageRoutes.map((route) => (
              <motion.li
                key={route.name}
                className="group"
                variants={fadeInOut}
              >
                <Link
                  href={`/${route.name.toLowerCase()}`}
                  className={`flex items-center justify-between gap-2 text-h3 transition-all duration-300 ${
                    pathname === `/${route.name.toLowerCase()}`
                      ? 'text-secondary md:text-white'
                      : 'text-white hover:text-white md:text-primary-light'
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={`h-6 w-6 transition-all duration-300 ${
                      pathname === `/${route.name.toLowerCase()}`
                        ? 'fill-white md:fill-white'
                        : 'fill-white group-hover:fill-white md:fill-primary-light'
                    }`}
                  >
                    {route.icon}
                  </svg>
                  <span>{route.name}</span>
                </Link>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        <motion.div variants={fadeInOut} className="mt-auto w-full">
          {!currentUser && !isUserLoading ? (
            <SignInButton isSidebarOpen isUserLoading={isUserLoading} />
          ) : (
            <SignOutButton />
          )}
        </motion.div>
      </motion.aside>
    </div>
  );
}
