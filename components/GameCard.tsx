import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// Hooks
import useUser from '../hooks/useUser';
import useUserBookmarks from '../hooks/useUserBookmarks';
import useBookmarkMutation from '../hooks/useBookmarkMutation';

// Types
import { GameInterface } from '../lib/types/index';

// Assets
import CollectionsDropdown from './CollectionsDropdown';
import placeholderImage from '../public/assets/placeholder.avif';

interface Props {
  details: GameInterface;
  isFromBookmark?: boolean;
  isTrending?: boolean;
  isFromUser?: boolean;
}

export default function GameCard({
  details,
  isFromBookmark = false,
  isTrending = false,
  isFromUser = false,
}: Props) {
  const router = useRouter();
  const { currentUser } = useUser();
  const { bookmarksData } = useUserBookmarks();
  const { handleAddBookmark, removeBookmark } = useBookmarkMutation();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [wasBookmarked, setWasBookmarked] = useState(false);

  const {
    id,
    name,
    slug,
    background_image: backgroundImage,
    released,
    genres,
  } = details;

  const handleClick = () => {
    if (!currentUser) return router.push('/bookmarks');

    setWasBookmarked(true);

    return isFromBookmark
      ? removeBookmark(id!)
      : handleAddBookmark(bookmarksData, details);
  };

  useEffect(() => {
    const timer = setTimeout(() => setWasBookmarked(false), 1500);

    return () => clearTimeout(timer);
  }, [wasBookmarked]);

  return (
    <div
      className={`mb-4 h-full w-full max-w-md overflow-hidden rounded-lg bg-primary-light/20 ${
        isTrending && 'w-80 max-w-xl'
      }`}
    >
      <Image
        src={backgroundImage || placeholderImage}
        alt={name}
        width={200}
        height={200}
        unoptimized
        className={`w-full ${isTrending && 'h-32 object-cover object-top'}`}
      />

      <div className="flex flex-col items-start gap-2 p-4">
        <div className="flex w-full flex-col justify-between gap-2 md:flex-row">
          <Link
            href={`/game/${slug}`}
            className="inline-block w-fit border-b border-b-transparent transition-all duration-100 hover:border-b hover:border-b-secondary"
          >
            {name}
          </Link>

          {released && (
            <span className="text-primary-light">{released.slice(0, 4)}</span>
          )}
        </div>

        {genres && (
          <ul className="flex flex-wrap divide-x-2 divide-primary-light">
            {genres?.slice(0, 3).map((genre) => (
              <li
                key={genre.name}
                className="px-2 text-xs text-white/70 underline first:pl-0"
              >
                <Link href={`/genre/${genre.slug}`}>{genre.name}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {!isFromUser && (
        <>
          <button
            type="button"
            onClick={handleClick}
            className="group flex w-full items-center justify-center gap-2 bg-black/20 p-2 backdrop-blur-lg backdrop-filter transition-all duration-300 hover:backdrop-blur-sm"
          >
            {isFromBookmark ? (
              <>
                Remove
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-4 w-4 fill-white group-hover:fill-none"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                  />
                </svg>
              </>
            ) : (
              <>
                {wasBookmarked ? 'Bookmarked' : 'Bookmark'}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-4 w-4 text-white group-hover:fill-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                  />
                </svg>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsDropdownOpen((prevState) => !prevState)}
            className="inline-flex w-full items-center justify-center bg-secondary px-4 py-2.5 text-center text-sm font-medium text-white transition-all duration-300 hover:bg-secondary/80"
          >
            Collections{' '}
            <svg
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className={`ml-2 h-4 w-4 transition-all duration-300 ${
                isDropdownOpen && 'rotate-180'
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </>
      )}

      <CollectionsDropdown game={details} isDropdownOpen={isDropdownOpen} />
    </div>
  );
}
