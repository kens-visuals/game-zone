import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Hooks
import { CollectionInfo } from '../hooks/useCollections';

// Assets
import placeholderImg from '../public/assets/placeholder.avif';

interface Props {
  isOwner: boolean;
  collection: CollectionInfo;
  removeCollection: (id: string) => void;
}

export default function CollectionItem({
  isOwner = true,
  collection,
  removeCollection,
}: Props) {
  const [readMore, setReadMore] = useState(false);

  return (
    <>
      <div className="mb-4 flex w-full items-start justify-between">
        <div>
          <div className="text-h3">
            <span>Name: </span>
            <span className="ml-1 inline-block text-white">
              {collection.name}
            </span>
          </div>
          <div className="text-body-2">
            <span>By: </span>
            <span className="inline-block text-primary-light/70">
              {collection.createdBy}
            </span>
          </div>
          {collection.description && (
            <>
              <div
                className={`h-12 overflow-y-hidden text-body-2 ${
                  readMore && 'h-fit overflow-visible'
                }`}
              >
                <span>Description: </span>
                <p className="inline-block text-primary-light/70">
                  {collection.description}
                </p>
              </div>
              {collection.description.length > 40 && (
                <button
                  type="button"
                  onClick={() =>
                    readMore ? setReadMore(false) : setReadMore(true)
                  }
                >
                  {readMore ? 'Hide' : 'Read More'}
                </button>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-2 ">
          {collection.isPublic ? (
            <div title="Public Collection">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6"
              >
                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                <path
                  fillRule="evenodd"
                  d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          ) : (
            <div title="Private Collection">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z" />
                <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.53 15.713l-4.243-4.244a3.75 3.75 0 004.243 4.243z" />
                <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 00-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 016.75 12z" />
              </svg>
            </div>
          )}

          {isOwner && (
            <button
              type="button"
              onClick={() => removeCollection(collection.id!)}
              className="text-start"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5 transition-colors duration-200 hover:fill-white"
              >
                <path
                  fillRule="evenodd"
                  d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      <span>{collection.games ? 'Games' : 'No games yet!'}</span>
      <ul className="mt-2 flex -space-x-6 ">
        {collection?.games?.map((game) => (
          <li key={game.id} className="h-full w-16">
            <Link href={`/game/${game.slug}`}>
              <Image
                unoptimized
                width={100}
                height={100}
                alt={game.name}
                src={game?.background_image || placeholderImg}
                className="h-full w-full rounded-lg transition-all duration-200 hover:scale-110"
              />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
