import Link from 'next/link';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';

// Hooks
import useMediaQuery from '../hooks/useMediaQuery';

// Animations
import { fadeIn, fadeInOut } from '../lib/animations';

// Helpers
import { pageRoutes } from '../lib/routes';

export default function PagesNav({ isSidebarOpen = false }) {
  const { pathname } = useRouter();
  const matches = useMediaQuery('(min-width: 768px)');

  return (
    <motion.ul
      // @ts-ignore
      key={isSidebarOpen}
      initial="initial"
      animate="animate"
      variants={matches ? fadeInOut : {}}
      className="mt-12 hidden flex-col items-start gap-4 text-white md:mt-0 md:flex"
    >
      <AnimatePresence>
        {pageRoutes.map((route) => (
          <motion.li variants={fadeIn} key={route.name} className="group">
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
              <span
                className={`${isSidebarOpen ? 'md:inline-block' : 'md:hidden'}`}
              >
                {route.name}
              </span>
            </Link>
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}
