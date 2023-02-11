import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

// Hooks
import useMediaQuery from '../hooks/useMediaQuery';

// Animations
import { fadeIn, fadeInOut } from '../lib/animations';

// Helpers
import { mainRoutes } from '../lib/routes';

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
      className={`flex items-center justify-between gap-4 md:flex-col md:items-start ${
        isSidebarOpen ? 'md:mt-4' : 'md:mt-8'
      }`}
    >
      {mainRoutes.map((route) => (
        <motion.li variants={fadeIn} key={route.path} className="group">
          <Link href={route.path} className="md:flex md:items-center md:gap-2">
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
            <motion.span
              variants={fadeIn}
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
            </motion.span>
          </Link>
        </motion.li>
      ))}
    </motion.ul>
  );
}
