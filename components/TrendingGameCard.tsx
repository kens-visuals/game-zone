import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

// Hooks
import useUser from '../hooks/useUser';
import useUserBookmarks from '../hooks/useUserBookmarks';
import useBookmarkMutation from '../hooks/useBookmarkMutation';

// Assets
import placeholderImg from '../public/assets/placeholder.avif';

// Types
import { GameInterface } from '../lib/types/index';

interface Props {
  detail: GameInterface;
}

export default function TrendingGameCard({ detail }: Props) {
  const router = useRouter();
  const { currentUser } = useUser();
  const { bookmarksData } = useUserBookmarks();
  const { handleAddBookmark } = useBookmarkMutation();

  const [wasBookmarked, setWasBookmarked] = useState(false);

  const handleClick = (details: GameInterface) => {
    if (!currentUser) return router.push('/bookmarks');

    return handleAddBookmark(bookmarksData, details);
  };

  useEffect(() => {
    const timer = setTimeout(() => setWasBookmarked(false), 1500);

    return () => clearTimeout(timer);
  }, [wasBookmarked]);

  return (
    <div className="relative h-full w-72 max-w-xl overflow-hidden rounded-lg md:h-60 md:w-96">
      <Image
        src={detail.background_image || placeholderImg}
        alt={detail.name}
        width={1000}
        height={1000}
        className="h-48 w-full object-cover object-top md:h-full"
      />

      <div className="absolute bottom-0 w-full py-4 px-3 backdrop-blur-md backdrop-filter">
        <div className="flex items-center justify-between gap-6">
          <Link
            href={`/game/${detail.slug}`}
            className="truncate text-ellipsis border-b border-b-transparent text-body-1 font-medium transition-all duration-100 hover:border-b hover:border-b-secondary"
          >
            {detail.name}
          </Link>

          <button
            type="button"
            onClick={() => {
              handleClick(detail);
              setWasBookmarked(true);
            }}
            className="group flex w-fit items-center justify-center gap-1 text-body-1"
          >
            <span className="hidden md:inline-block">
              {wasBookmarked ? 'Bookmarked' : 'Bookmark'}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6 text-white group-hover:fill-white md:h-4 md:w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
