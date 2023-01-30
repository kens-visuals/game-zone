import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

// Hooks
import useAuth from '../hooks/useAuth';
import useUser from '../hooks/useUser';
import useFollow from '../hooks/useFollow';
import SignInButton from './SignInButton';

const routes = [
  {
    name: 'Tags',
    icon: (
      <path
        fillRule="evenodd"
        d="M5.25 2.25a3 3 0 00-3 3v4.318a3 3 0 00.879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 005.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 00-2.122-.879H5.25zM6.375 7.5a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z"
        clipRule="evenodd"
      />
    ),
  },
  {
    name: 'Stores',
    icon: (
      <>
        <path d="M5.223 2.25c-.497 0-.974.198-1.325.55l-1.3 1.298A3.75 3.75 0 007.5 9.75c.627.47 1.406.75 2.25.75.844 0 1.624-.28 2.25-.75.626.47 1.406.75 2.25.75.844 0 1.623-.28 2.25-.75a3.75 3.75 0 004.902-5.652l-1.3-1.299a1.875 1.875 0 00-1.325-.549H5.223z" />
        <path
          fillRule="evenodd"
          d="M3 20.25v-8.755c1.42.674 3.08.673 4.5 0A5.234 5.234 0 009.75 12c.804 0 1.568-.182 2.25-.506a5.234 5.234 0 002.25.506c.804 0 1.567-.182 2.25-.506 1.42.674 3.08.675 4.5.001v8.755h.75a.75.75 0 010 1.5H2.25a.75.75 0 010-1.5H3zm3-6a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v3a.75.75 0 01-.75.75h-3a.75.75 0 01-.75-.75v-3zm8.25-.75a.75.75 0 00-.75.75v5.25c0 .414.336.75.75.75h3a.75.75 0 00.75-.75v-5.25a.75.75 0 00-.75-.75h-3z"
          clipRule="evenodd"
        />
      </>
    ),
  },
  {
    name: 'Genres',
    icon: (
      <path d="M5.625 3.75a2.625 2.625 0 100 5.25h12.75a2.625 2.625 0 000-5.25H5.625zM3.75 11.25a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75zM3 15.75a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75zM3.75 18.75a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75z" />
    ),
  },
  {
    name: 'Platforms',
    icon: (
      <path
        fillRule="evenodd"
        d="M2.25 5.25a3 3 0 013-3h13.5a3 3 0 013 3V15a3 3 0 01-3 3h-3v.257c0 .597.237 1.17.659 1.591l.621.622a.75.75 0 01-.53 1.28h-9a.75.75 0 01-.53-1.28l.621-.622a2.25 2.25 0 00.659-1.59V18h-3a3 3 0 01-3-3V5.25zm1.5 0v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5z"
        clipRule="evenodd"
      />
    ),
  },
  {
    name: 'Publishers',
    icon: (
      <path
        fillRule="evenodd"
        d="M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm14.25 6a.75.75 0 01-.22.53l-2.25 2.25a.75.75 0 11-1.06-1.06L15.44 12l-1.72-1.72a.75.75 0 111.06-1.06l2.25 2.25c.141.14.22.331.22.53zm-10.28-.53a.75.75 0 000 1.06l2.25 2.25a.75.75 0 101.06-1.06L8.56 12l1.72-1.72a.75.75 0 10-1.06-1.06l-2.25 2.25z"
        clipRule="evenodd"
      />
    ),
  },
  {
    name: 'Developers',
    icon: (
      <path
        fillRule="evenodd"
        d="M14.447 3.027a.75.75 0 01.527.92l-4.5 16.5a.75.75 0 01-1.448-.394l4.5-16.5a.75.75 0 01.921-.526zM16.72 6.22a.75.75 0 011.06 0l5.25 5.25a.75.75 0 010 1.06l-5.25 5.25a.75.75 0 11-1.06-1.06L21.44 12l-4.72-4.72a.75.75 0 010-1.06zm-9.44 0a.75.75 0 010 1.06L2.56 12l4.72 4.72a.75.75 0 11-1.06 1.06L.97 12.53a.75.75 0 010-1.06l5.25-5.25a.75.75 0 011.06 0z"
        clipRule="evenodd"
      />
    ),
  },
];

export default function Drawer() {
  const { pathname } = useRouter();
  const { currentUser, isUserLoading } = useUser();
  const { handleUserSignOut } = useAuth();
  const { followList } = useFollow();

  const followersCount =
    typeof followList('followers') !== undefined &&
    followList('followers')?.length;
  const followingCount =
    typeof followList('following') !== undefined &&
    followList('following')?.length;

  return (
    <div className="fixed z-50 flex h-[calc(100vh_-_2rem)] w-[calc(100vw_-_2rem)] flex-col items-end">
      {/* NOTE: ADD click outside func */}
      <aside className="mt-20 flex h-[calc(100vh_-_2rem)] w-60 flex-col items-end gap-4 rounded-lg bg-primary-light/50 p-4 backdrop-blur-lg backdrop-filter">
        {isUserLoading ? (
          <div className="mr-2 inline-flex items-center rounded-lg border border-gray-200 bg-white py-2.5 px-5 text-sm font-medium text-gray-900">
            <svg
              aria-hidden="true"
              role="status"
              className="mr-2 inline h-4 w-4 animate-spin text-gray-200"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="#1C64F2"
              />
            </svg>
            Loading...
          </div>
        ) : (
          currentUser && (
            <div>
              <div className="mb-2 flex flex-col items-end gap-4">
                <Image
                  width={100}
                  height={100}
                  src={currentUser?.photoURL}
                  alt={currentUser?.displayName}
                  className="h-14 w-14 rounded-full"
                />

                <div className="flex flex-col items-end gap-2">
                  <Link
                    href={`/user/${currentUser?.uid}`}
                    className="rounded-lg bg-blue-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    {currentUser.displayName}
                  </Link>

                  <span className="text-body-2 text-white">
                    {currentUser.email}
                  </span>
                </div>
              </div>

              <ul className="flex items-center justify-end gap-2 text-sm font-light">
                <li className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {followersCount || '0'}
                  </span>
                  <span className="text-white/50">
                    {followersCount === 1 ? 'Follower' : 'Follower'}
                  </span>
                </li>

                <li className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {followingCount || '0'}
                  </span>
                  <span className="text-white/50"> Following</span>
                </li>
              </ul>
            </div>
          )
        )}

        <ul className="mt-12 flex flex-col items-end gap-3 text-white">
          {routes.map((route) => (
            <li key={route.name}>
              <Link
                href={`/${route.name.toLowerCase()}`}
                className={`flex items-center justify-between gap-2 text-h3 transition-all duration-300 ${
                  pathname === `/${route.name.toLowerCase()}`
                    ? 'text-secondary'
                    : 'text-white hover:text-white/50'
                }`}
              >
                {route.name}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="mt-0.5 flex h-4 w-4 items-center justify-center"
                >
                  {route.icon}
                </svg>
              </Link>
            </li>
          ))}
        </ul>

        {!currentUser && !isUserLoading ? (
          <SignInButton isUserLoading={isUserLoading} />
        ) : (
          // <button
          //   type="button"
          //   disabled={isUserLoading}
          //   onClick={handleUserSignIn}
          //   className="mb-2 mt-auto inline-flex w-full items-center rounded-lg bg-[#4285F4] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[#4285F4]/90 focus:outline-none focus:ring-4 focus:ring-[#4285F4]/50"
          // >
          //   <svg
          //     className="mr-2 -ml-1 h-4 w-4"
          //     aria-hidden="true"
          //     focusable="false"
          //     data-prefix="fab"
          //     data-icon="google"
          //     role="img"
          //     xmlns="http://www.w3.org/2000/svg"
          //     viewBox="0 0 488 512"
          //   >
          //     <path
          //       fill="currentColor"
          //       d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
          //     />
          //   </svg>
          //   Sign in with Google
          // </button>
          <button
            type="button"
            onClick={handleUserSignOut}
            className="mt-auto flex w-full items-center justify-center gap-2 rounded-md bg-primary-dark p-2 text-white"
          >
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
            <span>Sign Out</span>
          </button>
        )}
      </aside>
    </div>
  );
}
