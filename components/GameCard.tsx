import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

// Hooks
import useUser from '../hooks/useUser';
import useUserBookmarks from '../hooks/useUserBookmarks';
import useBookmarkMutation from '../hooks/useBookmarkMutation';
import useCollections from '../hooks/useCollections';

// Assets
import placeholderImage from '../public/assets/placeholder.avif';

// Types
import { GameInterface } from '../lib/types/game';

interface Props {
  details: GameInterface;
  isFromBookmark?: boolean;
  isTrending?: boolean;
}

export default function GameCard({
  details,
  isFromBookmark = false,
  isTrending = false,
}: Props) {
  const router = useRouter();
  const { currentUser } = useUser();
  const { bookmarksData } = useUserBookmarks();
  const { handleAddBookmark, removeData } = useBookmarkMutation();
  const { collections, manageCollection } = useCollections();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

    return isFromBookmark
      ? removeData(id!)
      : handleAddBookmark(bookmarksData, details);
  };

  return (
    <div
      className={`mb-4 h-full w-full max-w-md overflow-hidden rounded-lg bg-primary-light/20 ${
        isTrending && 'w-80 max-w-xl'
      }`}
    >
      <div className="relative">
        <Image
          src={backgroundImage || placeholderImage}
          alt={name}
          width={200}
          height={200}
          className={`w-full ${isTrending && 'h-32 object-cover object-top'}`}
        />

        <button
          type="button"
          onClick={handleClick}
          className="absolute top-0 left-2 hidden items-center justify-center gap-2 rounded-b-md bg-black/20 p-2  backdrop-blur-xl backdrop-filter transition-all duration-300 hover:backdrop-blur-sm md:flex md:text-h2-light"
        >
          {isFromBookmark ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </button>
      </div>

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

      <button
        type="button"
        onClick={handleClick}
        className="group flex w-full items-center justify-center gap-2 bg-black/20 p-2 backdrop-blur-lg backdrop-filter transition-all duration-300 hover:backdrop-blur-sm md:hidden md:text-h2-light"
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
            Bookmark
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

      <div
        className={`w-full rounded-b bg-primary-dark ${
          isDropdownOpen ? 'inline-block' : 'hidden'
        }`}
      >
        <ul className="h-fit space-y-2 overflow-y-auto p-4 text-white">
          {collections?.map((collection) => (
            <li
              key={collection.id}
              className="flex items-center gap-2 rounded-lg bg-primary-light p-2 px-4 transition-all duration-300 hover:bg-primary-light/50"
            >
              <button
                type="button"
                onClick={() =>
                  manageCollection('add', collection.id!, {
                    id,
                    name,
                    slug,
                    background_image: backgroundImage,
                    released,
                    genres,
                  })
                }
                className="flex w-full items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                  />
                </svg>
                {collection.name}

                {!collection.isPublic && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="ml-auto h-4 w-4 fill-primary-dark"
                  >
                    <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z" />
                    <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.53 15.713l-4.243-4.244a3.75 3.75 0 004.243 4.243z" />
                    <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 00-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 016.75 12z" />
                  </svg>
                )}
              </button>
            </li>
          ))}
        </ul>
        <Link
          href="/collections"
          className="flex w-full items-center justify-center gap-2 bg-black/20 p-2 text-body-2 backdrop-blur-lg backdrop-filter transition-all duration-300 hover:backdrop-blur-sm md:text-body-1"
        >
          Create New Collection
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4 text-white"
          >
            <path
              fillRule="evenodd"
              d="M15.75 2.25H21a.75.75 0 01.75.75v5.25a.75.75 0 01-1.5 0V4.81L8.03 17.03a.75.75 0 01-1.06-1.06L19.19 3.75h-3.44a.75.75 0 010-1.5zm-10.5 4.5a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V10.5a.75.75 0 011.5 0v8.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V8.25a3 3 0 013-3h8.25a.75.75 0 010 1.5H5.25z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
