import { GetStaticProps } from 'next';
import { dehydrate, QueryClient, useInfiniteQuery } from 'react-query';

// Components
import GameCard from './GameCard';
import GamesListContainer from './GamesListContainer';

// Helpers
import RAWG from '../lib/rawg';

// Interfaces
import { Game } from '../pages/game/[slug]';

interface Games {
  results: Game[];
}

const fetchGames = async ({ pageParam = 1 }): Promise<Game[]> => {
  const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
  const { data } = await RAWG.get<Games>(
    `/games/lists/main?key=${apiKey}&discover=true&ordering=-relevance&page_size=40&page=${pageParam}`
  );

  return data?.results;
};

export default function GamesList() {
  const {
    data: games,
    isError,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(['getGames'], fetchGames, {
    getNextPageParam: (_, allPages) => {
      if (allPages.length < 10) return allPages.length + 1;

      return undefined;
    },
  });

  console.log(games?.pages);

  if (isLoading) {
    const emptyArray = Array.from({ length: 30 }, () => Math.random());

    return (
      <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-3">
        {emptyArray.map((el) => (
          <div
            key={el}
            role="status"
            className="max-w-sm animate-pulse rounded border border-gray-200 shadow dark:border-gray-700"
          >
            <div className=" flex h-48 items-center justify-center rounded bg-gray-300  dark:bg-gray-700">
              <svg
                className="h-12 w-12 text-gray-200 dark:text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 640 512"
              >
                <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
              </svg>
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="h-2.5 w-28 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="h-2.5 w-12 rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="mt-4 flex items-center space-x-2 p-4">
              <div className="h-2 w-14 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="h-2 w-14 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="h-2 w-14 rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>
            <span className="sr-only">Loading...</span>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div
        id="alert-additional-content-2"
        className="mb-4 rounded-lg border border-red-300 bg-red-50 p-4 text-red-900 dark:border-red-900 dark:bg-gray-800 dark:text-red-400"
        role="alert"
      >
        <div className="flex items-center">
          <svg
            aria-hidden="true"
            className="mr-2 h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <span className="sr-only">Error</span>
          <h3 className="text-lg font-medium">Something went wrong!</h3>
        </div>
        <div className="mt-2 mb-4 text-sm">
          We don&apos;t put more info about this error. Because neither you nor
          we care why this happened, we just want it to work! So just click the
          refresh button and hope for the best, because this is an externa API
          and if they decide to abandon it then we&apos;re all f#¢ked!
        </div>
        <div className="flex ">
          <button
            type="button"
            className="inline-flex items-center rounded-lg bg-red-900 px-3 py-1.5 text-center text-xs font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="mr-2 h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
            Refetch
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 pb-14">
      <GamesListContainer>
        {games?.pages?.map((page) =>
          page.map((details) => (
            <div key={details.slug}>
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
