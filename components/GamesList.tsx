import { useEffect, useState } from 'react';
import { GetStaticProps } from 'next';
import { dehydrate, QueryClient, useInfiniteQuery } from 'react-query';
import { AnimatePresence, motion } from 'framer-motion';

// Components
import GameCard from './GameCard';
import ErrorCard from './ErrorCard';
import LoadingCard from './LoadingCard';
import GamesListContainer from './GamesListContainer';

// Helpers
import RAWG from '../lib/rawg';

// Animatiions
import { fadeInDown } from '../lib/animations';

// Types
import { GameInterface } from '../lib/types/index';

interface Games {
  results: GameInterface[];
}

const links = [
  {
    name: 'Main',
    path: '/games/lists/main?&discover=true&page_size=40',
  },
  {
    name: 'Best of the Year',
    path: '/games/lists/greatest?discover=true&page_size=40',
  },
  {
    name: 'Best of 2022',
    path: '/games/lists/greatest?year=2022&discover=true&page_size=40',
  },
  {
    name: 'All time top 250',
    path: '/games/lists/popular?discover=true&page_size=40',
  },
];

const fetchGames = async ({
  pageIndex = 0,
  option = 'relevance',
  pageParam = 1,
}): Promise<GameInterface[]> => {
  const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;

  const { data } = await RAWG.get<Games>(
    `${links[pageIndex].path}&ordering=-${option}&page=${pageParam}&key=${apiKey}`
  );

  return data?.results;
};

export default function GamesList() {
  const [option, setOption] = useState('relevance');
  const [pageIndex, setPageIndex] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ['getGames', option, pageIndex],
    ({ pageParam = 1 }) => fetchGames({ pageIndex, option, pageParam }),
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length < 40) return undefined;

        if (allPages.length) return allPages.length + 1;

        return undefined;
      },
      keepPreviousData: true,
    }
  );

  useEffect(() => setIsDropdownOpen(false), [isLoading, isFetching]);

  if (isLoading) return <LoadingCard size={30} />;

  if (isError) return <ErrorCard />;

  return (
    <div className="flex flex-col items-center gap-4 pb-14">
      <div className="my-8 w-full overflow-y-hidden border-b border-primary-light/50 text-center text-body-1 font-medium text-white/50 md:mb-2">
        <ul className="-mb-[2px] flex w-full overflow-x-scroll">
          {links.map((link, idx) => (
            <li key={link.name}>
              <button
                type="button"
                onClick={() => setPageIndex(idx)}
                className={`w-fit border-t-2 border-transparent p-4 transition-all duration-300 hover:border-white hover:text-white ${
                  idx === pageIndex && 'border-t-secondary text-secondary'
                }`}
              >
                {link.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative w-full md:mb-2">
        <button
          type="button"
          onClick={() => setIsDropdownOpen((prevState) => !prevState)}
          className="inline-flex w-full items-center justify-between rounded-lg bg-secondary p-4 text-center text-body-1 capitalize text-white hover:bg-secondary/80 focus:outline-none focus:ring-4 focus:ring-primary-light/20 md:w-52"
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

        <AnimatePresence>
          {isDropdownOpen && (
            <div className="absolute top-16 z-10 w-full divide-y divide-gray-100 overflow-hidden rounded-lg bg-white shadow dark:bg-gray-700 md:w-52">
              <motion.ul
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeInDown}
                className="w-full divide-y divide-primary-dark text-sm text-gray-700 dark:text-gray-200"
              >
                {options.map((opt) => (
                  <motion.li variants={fadeInDown} key={opt} className="w-full">
                    <button
                      type="button"
                      onClick={() => {
                        setOption(opt);
                      }}
                      className="w-full p-4 capitalize hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      {opt}
                    </button>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          )}
        </AnimatePresence>
      </div>

      <GamesListContainer>
        {games?.pages?.map((page) =>
          page.map((details) => (
            <div key={`${details.id}${Math.random()}`}>
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
