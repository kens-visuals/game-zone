import Image from 'next/image';

// Hooks
import useAuth from '../hooks/useAuth';
import useUser from '../hooks/useUser';

export default function Drawer() {
  const { data: user, isLoading } = useUser();
  const { handleUserSignIn, handleUserSignOut } = useAuth();

  return (
    <div className="fixed flex h-screen w-full flex-col items-end bg-primary-dark/50 ">
      {/* NOTE: ADD click outside func */}
      <div className="flex h-screen w-60 flex-col items-end gap-4 bg-primary-light p-4 pt-20">
        {isLoading ? (
          <div className="animate animate-ping rounded-full">...</div>
        ) : (
          user && (
            <div className="flex flex-col  items-end gap-2">
              <Image
                alt="user"
                width={50}
                height={50}
                src={user?.photoURL}
                className="rounded-full border border-white "
              />
              <div className="text-right font-outfit text-white">
                <span className="inline-block">{user?.displayName}</span>
                <span className="inline-block">{user?.email}</span>
              </div>
            </div>
          )
        )}
        {!user ? (
          <button
            type="button"
            onClick={handleUserSignIn}
            className="flex gap-2 rounded-md bg-primary-dark p-2 text-white"
          >
            <span className="text-white">Sign In</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleUserSignOut}
            className="flex gap-2 rounded-md bg-primary-dark p-2 text-white"
          >
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
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
              />
            </svg>
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </div>
  );
}
