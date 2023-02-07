import { motion, Variants } from 'framer-motion';

// Components
import PagesNav from './PagesNav';
import SignInButton from './SignInButton';
import SignOutButton from './SignOutButton';
import UserProfile from './UserProfile';

// Hooks
import useUser from '../hooks/useUser';

export default function Drawer() {
  const { currentUser, isUserLoading } = useUser();

  const drawerVariants: Variants = {
    initial: {
      x: '100%',
      opacity: 0,
      backdropFilter: `blur(0px)`,
      WebkitBackdropFilter: `blur(0px)`,
    },
    animate: {
      x: 0,
      opacity: 1,
      backdropFilter: `blur(16px)`,
      WebkitBackdropFilter: `blur(16px)`,
      transition: { duration: 0.5, delayChildren: 0.3, staggerChildren: 1 },
    },
    exit: {
      x: '100%',
      opacity: 0,
      transition: { delay: 0.3, duration: 0.8 },
    },
  };

  const buttonVariants: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  };

  return (
    <div className="fixed z-50 flex h-[96%] w-[calc(100vw_-_2rem)] flex-col items-end">
      <motion.aside
        key="drawer"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={drawerVariants}
        className="mt-20 flex h-full w-60 min-w-max flex-col items-start gap-2 rounded-lg bg-primary-light/40 p-4 shadow-xl shadow-primary-dark backdrop-blur-lg backdrop-filter"
      >
        {currentUser && <UserProfile />}

        <PagesNav />

        <motion.div variants={buttonVariants} className="mt-auto w-full">
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
