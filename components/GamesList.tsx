import { useEffect, useState } from 'react';
import { GetStaticProps } from 'next';
import { dehydrate, QueryClient, useInfiniteQuery } from 'react-query';

// Components
import GameCard from './GameCard';
import GamesListContainer from './GamesListContainer';
import LoadingMsg from './LoadingMsg';
import ErrorMsg from './ErrorMsg';

// Helpers
import RAWG from '../lib/rawg';

// Types
import { GameInterface } from '../lib/types/game';

interface Games {
  results: GameInterface[];
}

const fetchGames = async ({
  option = 'relevance',
  pageParam = 1,
}): Promise<GameInterface[]> => {
  const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;

  const { data } = await RAWG.get<Games>(
    `/games/lists/main?&discover=true&ordering=-${option}&page_size=40&page=${pageParam}&key=${apiKey}`
  );

  return data?.results;
};

export default function GamesList() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [option, setOption] = useState('name');

  const options = [
    'relevance',
    'name',
    'released',
    'added',
    'created',
    'updated',
    'rating',
    'metacritic',
  ];

  const {
    data: games,
    isError,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ['getGames', option],
    ({ pageParam = 1 }) => fetchGames({ option, pageParam }),
    {
      getNextPageParam: (_, allPages) => {
        if (allPages.length < 10) return allPages.length + 1;

        return undefined;
      },
    }
  );

  useEffect(() => setIsDropdownOpen(false), [isLoading]);

  if (isLoading)
    return (
      <div className="my-4 grid w-full grid-cols-2 gap-4 p-4 md:grid-cols-3 lg:grid-cols-4">
        <LoadingMsg size={30} />
      </div>
    );

  if (isError) return <ErrorMsg />;

  return (
    <div className="flex flex-col items-center gap-4 p-4 pb-14">
      <div className="relative w-full">
        <button
          type="button"
          onClick={() => setIsDropdownOpen((prevState) => !prevState)}
          className="inline-flex w-full items-center justify-between rounded-lg bg-secondary px-4 py-2.5 text-center text-sm font-medium capitalize text-white hover:bg-secondary/80 focus:outline-none focus:ring-4 focus:ring-secondary/20 md:w-52"
        >
          Order by: {option}{' '}
          <svg
            className={`ml-2 h-4 w-4 transition-all duration-300 ${
              isDropdownOpen && 'rotate-180'
            }`}
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isDropdownOpen && (
          <div className="absolute top-12 z-10 w-full divide-y divide-gray-100 overflow-hidden rounded-lg bg-white shadow dark:bg-gray-700 md:w-52">
            <ul className="w-full divide-y divide-primary-dark text-sm text-gray-700 dark:text-gray-200">
              {options.map((opt) => (
                <li key={opt} className="w-full">
                  <button
                    type="button"
                    onClick={() => {
                      setOption(opt);
                    }}
                    className="w-full p-4 capitalize hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    {opt}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <GamesListContainer>
        {games?.pages?.map((page) =>
          page.map((details) => (
            <div key={details.id}>
              <GameCard details={details} />
            </div>
          ))
        )}
      </GamesListContainer>

      <button
        type="button"
        disabled={!hasNextPage || isFetchingNextPage}
        onClick={() => hasNextPage && fetchNextPage()}
        className="rounded-md bg-primary-light px-6 py-2 text-white"
      >
        {/* eslint-disable-next-line no-nested-ternary */}
        {isFetchingNextPage
          ? 'Loading more...'
          : hasNextPage
          ? 'Load More'
          : 'Nothing more to load'}
      </button>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(['getGames'], fetchGames);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
