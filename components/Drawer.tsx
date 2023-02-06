// Components
import PagesNav from './PagesNav';
import SignInButton from './SignInButton';
import SignOutButton from './SignOutButton';
import UserProfile from './UserProfile';

// Hooks
import useUser from '../hooks/useUser';

export default function Drawer() {
  const { currentUser, isUserLoading } = useUser();

  return (
    <div className="fixed z-50 flex h-[96%] w-[calc(100vw_-_2rem)] flex-col items-end">
      <aside className="mt-20 flex h-full w-60 min-w-max flex-col items-start gap-2 rounded-lg bg-primary-light/40 p-4 shadow-xl shadow-primary-dark backdrop-blur-lg backdrop-filter">
        {currentUser && <UserProfile />}

        <PagesNav />

        {!currentUser && !isUserLoading ? (
          <SignInButton isSidebarOpen isUserLoading={isUserLoading} />
        ) : (
          <SignOutButton />
        )}
      </aside>
    </div>
  );
}
