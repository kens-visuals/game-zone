import useAuth from '../hooks/useAuth';

interface Props {
  isUserLoading: boolean;
  isSidebarOpen?: boolean;
}

export default function SignInButton({ isUserLoading, isSidebarOpen }: Props) {
  const { handleUserSignIn } = useAuth();

  return (
    <button
      type="button"
      disabled={isUserLoading}
      onClick={handleUserSignIn}
      className={`mt-auto inline-flex w-full items-center rounded-lg bg-[#4285F4] text-center text-sm font-medium text-white hover:bg-[#4285F4]/90 focus:outline-none focus:ring-4 focus:ring-[#4285F4]/50 ${
        !isSidebarOpen
          ? 'justify-center p-2'
          : 'justify-center gap-2 px-5 py-2.5'
      }`}
    >
      <svg
        className="h-4 w-4"
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
      <span className={isSidebarOpen ? 'inline-block' : 'hidden'}>
        Sign in with Google
      </span>
    </button>
  );
}
