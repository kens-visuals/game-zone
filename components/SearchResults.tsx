import Link from 'next/link';
import { ChangeEvent, useState } from 'react';
import { useQuery } from 'react-query';
import RAWG from '../lib/rawg';

// Interfaces
import { GameInterface } from '../pages/game/[slug]';

interface SearchGame {
  results: GameInterface[];
}

export default function SearchResults() {
  const [searchTerm, setSearchTerm] = useState('');

  const fetchSearchedGame = async (): Promise<GameInterface[]> => {
    const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
    const { data } = await RAWG.get<SearchGame>(
      `/games?key=${apiKey}&search=${searchTerm}`
    );

    return data.results;
  };

  const {
    data,
    isError: isSearchError,
    isLoading: isSearchLoading,
  } = useQuery(['search', searchTerm], fetchSearchedGame, {
    enabled: !!searchTerm,
  });

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(event.target.value);

  return (
    <>
      <form action="#" className="w-full bg-primary p-4">
        <label htmlFor="search" className="flex gap-4">
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
            placeholder="Search games"
            autoComplete="off"
            className="w-full bg-transparent caret-secondary outline-none placeholder:text-body-1 focus:border-b focus:border-primary-light"
          />
        </label>
      </form>

      {/* eslint-disable-next-line no-nested-ternary */}
      {isSearchLoading ? (
        <div>Loading...</div>
      ) : isSearchError ? (
        <div>Error</div>
      ) : (
        <ul>
          {data &&
            data?.map((game) => (
              <li key={game.slug}>
                <Link href={`/game/${game.slug}`}>{game.name}</Link>
              </li>
            ))}
        </ul>
      )}
    </>
  );
}
