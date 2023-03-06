import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

// Hooks
import useUser from '../hooks/useUser';
import useFollow from '../hooks/useFollow';

// Animations
import { fadeInOut } from '../lib/animations';

// Interfaces
interface Props {
  isSidebarOpen?: boolean;
}

export default function UserProfile({ isSidebarOpen = false }: Props) {
  const { pathname } = useRouter();
  const { currentUser, isUserLoading } = useUser();
  const { followList } = useFollow();

  const followersCount =
    typeof followList('followers') !== undefined &&
    followList('followers')?.length;
  const followingCount =
    typeof followList('following') !== undefined &&
    followList('following')?.length;

  return isUserLoading ? (
    <div className="inline-flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white py-2.5 px-4 text-sm font-medium text-gray-900">
      <svg
        aria-hidden="true"
        role="status"
        className="inline h-4 w-4 animate-spin text-gray-200"
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
      {isSidebarOpen && <span className="ml-2">Loading...</span>}
    </div>
  ) : (
    <motion.div variants={fadeInOut}>
      <div className="flex items-center gap-2">
        {currentUser && (
          <Link
            href={`/user/${currentUser?.uid}`}
            className="rounded-full transition-all duration-300 hover:ring hover:ring-secondary hover:ring-offset-4 hover:ring-offset-primary-dark"
          >
            <Image
              width={100}
              height={100}
              unoptimized
              src={currentUser?.photoURL}
              alt={currentUser?.displayName}
              className={`h-14 w-14 rounded-full md:h-auto md:w-full ${
                pathname.startsWith('/user') && 'border-2 border-white'
              }`}
            />
          </Link>
        )}

        <div
          className={`flex flex-col items-start gap-2 ${
            isSidebarOpen ? 'w-full md:flex' : 'md:hidden'
          }`}
        >
          <span className="w-40 overflow-hidden text-ellipsis text-body-2 text-white">
            {currentUser?.email}
          </span>
          <ul className="flex items-center gap-2 text-sm font-light">
            <li className="flex items-center justify-between gap-2">
              <span className="font-semibold text-gray-900 dark:text-white">
                {followersCount || '0'}
              </span>
              <span className="text-white/50">
                {followersCount === 1 ? 'Follower' : 'Followers'}
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
      </div>

      <Link
        href={`/user/${currentUser?.uid}`}
        className={`mt-4 flex w-full items-center justify-center gap-2 rounded-lg border-4 border-secondary px-3 py-1.5 text-center text-xs font-medium text-white shadow-lg transition-colors duration-300 hover:bg-white hover:text-secondary focus:outline-none focus:ring-2 focus:ring-primary-light ${
          isSidebarOpen ? 'w-full md:flex' : 'md:hidden'
        }`}
      >
        {currentUser?.displayName}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-3 w-3"
        >
          <path
            fillRule="evenodd"
            d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
            clipRule="evenodd"
          />
        </svg>
      </Link>
    </motion.div>
  );
}
