import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from 'react';

// Components
import FollowButton from './FollowButton';

// Hooks
import useUser from '../hooks/useUser';
import useUsers from '../hooks/useUsers';

// Helpers
import RAWG from '../lib/rawg';

// Assets
import placeholderImg from '../public/assets/placeholder.avif';

// Interfaces
import { GameInterface } from '../lib/types/index';

interface SearchGame {
  results: GameInterface[];
}

const fetchSearchedGame = async (
  searchTerm: string
): Promise<GameInterface[]> => {
  const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
  const { data } = await RAWG.get<SearchGame>(
    `/games?key=${apiKey}&search=${searchTerm}&ordering=-added`
  );

  return data.results;
};

export default function SearchResults() {
  const { users } = useUsers();
  const { pathname } = useRouter();
  const { currentUser } = useUser();

  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const filteredUsers = users?.filter((user) =>
    user.displayName.toLowerCase().includes(searchTerm)
  );

  const {
    data,
    isError: isSearchError,
    isLoading: isSearchLoading,
    isFetching: isSearchFetching,
  } = useQuery(['search', searchTerm], () => fetchSearchedGame(searchTerm), {
    enabled: !!searchTerm,
  });

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setIsSearchOpen(true);
  };

  useEffect(() => setIsSearchOpen(false), [pathname]);

  return (
    <>
      <form
        action="#"
        className="flex w-full items-center justify-between gap-4 bg-primary py-4"
      >
        <label htmlFor="search" className="flex w-full gap-4">
          <span className="sr-only">Search games</span>
          <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M27.613 25.72 23.08 21.2a10.56 10.56 0 0 0 2.253-6.533C25.333 8.776 20.558 4 14.667 4S4 8.776 4 14.667c0 5.89 4.776 10.666 10.667 10.666A10.56 10.56 0 0 0 21.2 23.08l4.52 4.533a1.333 1.333 0 0 0 1.893 0 1.333 1.333 0 0 0 0-1.893ZM6.667 14.667a8 8 0 1 1 16 0 8 8 0 0 1-16 0Z"
              fill="#FFF"
            />
          </svg>
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search games and users"
            autoComplete="off"
            className="w-full bg-transparent caret-secondary outline-none placeholder:text-body-1 focus:border-b focus:border-primary-light"
          />
        </label>

        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            aria-label="close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        )}
      </form>

      {/* eslint-disable-next-line no-nested-ternary */}
      {isSearchLoading || isSearchFetching ? (
        <div className="mx-auto w-full rounded-xl bg-primary-dark p-4">
          <span className="inline-block w-full text-center">Loading...</span>
        </div>
      ) : isSearchError ? (
        <div className="mx-auto w-full rounded-xl bg-primary-dark p-4">
          <span className="inline-block w-full text-center">Error</span>
        </div>
      ) : (
        isSearchOpen &&
        searchTerm && (
          <div className="mx-auto mb-4 w-full rounded-xl bg-primary-dark p-4">
            <ul>
              <li className="mb-2">
                {data?.length ? (
                  <span className="text-h3">Games</span>
                ) : (
                  <span className="inline-block w-full text-center">
                    No games found!
                  </span>
                )}
              </li>
              {data &&
                data?.slice(0, 7).map((game) => (
                  <li key={game.slug} className="mb-2 flex items-center gap-4">
                    {game.background_image && (
                      <Image
                        src={game.background_image || placeholderImg}
                        height={50}
                        width={50}
                        alt={game.name}
                        className="h-12 w-10 rounded-md object-cover"
                      />
                    )}
                    <Link href={`/game/${game.slug}`}>{game.name}</Link>
                  </li>
                ))}
            </ul>

            {currentUser && (
              <ul>
                <li className="mt-4 mb-2">
                  {filteredUsers.length ? (
                    <span className="text-h3">Users</span>
                  ) : (
                    <span className="inline-block w-full text-center">
                      No users found!
                    </span>
                  )}
                </li>
                {users &&
                  filteredUsers?.map((user) => (
                    <li key={user.uid} className="mb-2 flex items-center gap-4">
                      {user.photoURL && (
                        <Image
                          src={user.photoURL}
                          height={50}
                          width={50}
                          alt={user.displayName}
                          className="h-12 w-10 rounded-md object-cover"
                        />
                      )}
                      <Link href={`/user/${user.uid}`}>{user.displayName}</Link>

                      {user.uid !== currentUser?.uid && (
                        <div className="flex items-center gap-2 md:ml-auto">
                          <Link
                            href="/messages"
                            className="w-full rounded-md bg-primary-light py-2.5 px-4 text-center transition-all duration-300 hover:bg-primary-light/70 "
                          >
                            Message
                          </Link>

                          <FollowButton user={user} />
                        </div>
                      )}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        )
      )}
    </>
  );
}
