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

const fetchGames = async ({ pageParam = 1 }): Promise<GameInterface[]> => {
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

  if (isLoading)
    return (
      <div className="my-4 grid w-full grid-cols-2 gap-4 p-4 md:grid-cols-3 lg:grid-cols-4">
        <LoadingMsg size={30} />
      </div>
    );

  if (isError) return <ErrorMsg />;

  return (
    <div className="flex flex-col items-center gap-4 p-4 pb-14">
      <h1 className="my-2 self-start text-h1">All Games</h1>

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
