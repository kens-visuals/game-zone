import { useEffect, useState } from 'react';
import Link from 'next/link';

// Hooks
import useCollections from '../hooks/useCollections';

// Interfaces
import { GameInterface } from '../lib/types/index';

interface Props {
  game: GameInterface;
  isDropdownOpen: boolean;
}

export default function CollectionsDropdown({ game, isDropdownOpen }: Props) {
  const { collections, manageCollection } = useCollections();
  const [wasAddedToCollection, setWasAddedToCollection] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setWasAddedToCollection(false), 1500);

    return () => clearTimeout(timer);
  }, [wasAddedToCollection]);

  const {
    id,
    name,
    slug,
    background_image: backgroundImage,
    released,
    genres,
  } = game;

  return (
    <div
      className={`w-full rounded-b-md bg-primary-dark ${
        isDropdownOpen ? 'inline-block' : 'hidden'
      }`}
    >
      <ul className="h-fit space-y-2 overflow-y-auto p-4 text-white">
        {collections?.length > 0 ? (
          collections?.map((collection) => (
            <li
              key={collection.id}
              className="flex items-center gap-2 rounded-lg bg-primary-light p-2 px-4 transition-all duration-300 hover:bg-primary-light/50"
            >
              <button
                type="button"
                onClick={() => {
                  setWasAddedToCollection(true);
                  manageCollection('add', collection.id!, {
                    id,
                    name,
                    slug,
                    background_image: backgroundImage,
                    released,
                    genres,
                  });
                }}
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
                {wasAddedToCollection
                  ? `Added to ${collection.name}`
                  : collection.name}

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
          ))
        ) : (
          <li className="rounded-lg bg-primary-light/50 p-2 px-4 text-center text-body-2">
            You should create some collections
          </li>
        )}
      </ul>

      <Link
        href="/collections"
        className="flex w-full items-center justify-center gap-2 rounded-b-md bg-black/20 p-2 text-body-2 underline backdrop-blur-lg backdrop-filter transition-all duration-300 hover:backdrop-blur-sm md:text-body-1"
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
  );
}
