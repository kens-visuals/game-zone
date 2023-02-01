import { useRouter } from 'next/router';

// Hooks
import useAuth from '../hooks/useAuth';

export default function SignOutButton({ isSidebarOpen = false }) {
  const router = useRouter();
  const { handleUserSignOut } = useAuth();

  return (
    <button
      type="button"
      onClick={() => {
        handleUserSignOut();
        router.push('/');
      }}
      className="mt-auto flex w-full items-center justify-center gap-2 rounded-md bg-primary-dark p-2 text-white transition-all duration-300 hover:bg-primary md:w-full md:bg-primary-light"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-4 w-4 rotate-180 text-white md:h-6 md:w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
        />
      </svg>
      <span className={isSidebarOpen ? 'md:inline-block' : 'md:hidden'}>
        Sign Out
      </span>
    </button>
  );
}
