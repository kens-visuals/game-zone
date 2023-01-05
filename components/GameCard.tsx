import Image from 'next/image';
import Link from 'next/link';

// Hooks
import useBookmarkMutation from '../hooks/useBookmarkMutation';
import useUserBookmarks from '../hooks/useUserBookmarks';

import { Game } from '../pages/game/[slug]';

export interface Props extends Game {
  genres?: [{ name: string }];
}

export default function GameCard({ details }: { details: Props }) {
  const { data: bookmarks } = useUserBookmarks();
  const { addNewData } = useBookmarkMutation();
  const {
    name,
    slug,
    background_image: backgroundImage,
    released,
    genres,
  } = details;

  const handleAddBookmark = (
    currentGameName: string,
    currentGameSlug: string
  ) => {
    const hasBeenBookmarked = bookmarks
      .map((bookmark) => bookmark.name)
      .includes(currentGameName);
    // const currentGameId = bookmarks.find(
    //   (bookmark) => bookmark.name === currentGameName
    // )?.id;

    if (!hasBeenBookmarked) addNewData(currentGameName, currentGameSlug);
  };

  return (
    <div className="h-full w-full overflow-hidden rounded-lg bg-primary-light/20 backdrop-blur-lg backdrop-filter">
      <div className="relative ">
        <Image
          src={backgroundImage}
          alt={name}
          width={200}
          height={200}
          className="w-full "
        />
        <button
          type="button"
          onClick={() => handleAddBookmark(name, slug)}
          className="absolute bottom-2 right-0 flex items-center justify-center gap-2 bg-black/20 p-2 backdrop-blur-lg backdrop-filter transition-all duration-300 hover:backdrop-blur-sm md:text-h2-light"
        >
          Add
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
              d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>

      <div className="flex flex-col items-start gap-2 p-4">
        <div className="flex w-full items-center justify-between">
          <Link
            href={`/game/${slug}`}
            className="border-b border-b-transparent transition-all duration-100 hover:border-b hover:border-b-white"
          >
            {name}
          </Link>

          <span className="text-primary-light">{released.slice(0, 4)}</span>
        </div>

        <ul className="flex flex-wrap divide-x-2 divide-primary-light">
          {genres?.map((genre) => (
            <li
              key={genre.name}
              className="px-2 text-xs text-white/70 first:pl-0"
            >
              {genre.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
