import Image from 'next/image';
import Link from 'next/link';

// Hooks
import useBookmarkMutation from '../hooks/useBookmarkMutation';
import useUserBookmarks from '../hooks/useUserBookmarks';

import { Game } from '../pages/game/[slug]';

export interface Details extends Game {
  genres?: [{ name: string }];
}

interface Props {
  details: Details;
  isFromBookmark: boolean;
}

export default function GameCard({ details, isFromBookmark = false }: Props) {
  const { data: bookmarks } = useUserBookmarks();
  const { addNewData, removeData } = useBookmarkMutation();

  const {
    id,
    name,
    slug,
    background_image: backgroundImage,
    released,
    genres,
  } = details;

  const handleAddBookmark = (bookmarkObj: Game) => {
    const hasBeenBookmarked = bookmarks
      .map((bookmark) => bookmark.name)
      .includes(bookmarkObj.name);

    if (!hasBeenBookmarked) addNewData(bookmarkObj);
  };

  return (
    <div className="mb-4 h-full w-full max-w-md overflow-hidden rounded-lg bg-primary-light/20">
      <div className="relative">
        {!backgroundImage ? (
          <div className="flex flex-col items-center justify-center p-10">
            <span className="mb-2 inline-block text-2xl">NO IMAGE</span>
            <svg
              className="h-full w-full text-gray-200"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 640 512"
            >
              <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
            </svg>
          </div>
        ) : (
          <Image
            src={backgroundImage}
            alt={name}
            width={200}
            height={200}
            className="w-full"
          />
        )}

        <button
          type="button"
          onClick={() =>
            isFromBookmark ? removeData(id) : handleAddBookmark(details)
          }
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
            className="inline-block border-b border-b-transparent transition-all duration-100 hover:border-b hover:border-b-secondary"
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
                className="px-2 text-xs text-white/70 first:pl-0"
              >
                {genre.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="button"
        onClick={() =>
          isFromBookmark ? removeData(id) : handleAddBookmark(details)
        }
        className="flex w-full items-center justify-center gap-2 bg-black/20 p-2 backdrop-blur-lg backdrop-filter transition-all duration-300 hover:backdrop-blur-sm md:hidden md:text-h2-light"
      >
        Add
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
  );
}
