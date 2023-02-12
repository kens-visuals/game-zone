import { useInfiniteQuery } from 'react-query';

// Components
import ErrorCard from './ErrorCard';
import LoadingCard from './LoadingCard';
import PageHeading from './PageHeading';
import TrendingGameCard from './TrendingGameCard';

// Helpers
import RAWG from '../lib/rawg';

// Types
import { GameInterface } from '../lib/types/index';

interface Games {
  results: GameInterface[];
}

const fetchGames = async ({ pageParam = 1 }): Promise<GameInterface[]> => {
  const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
  const { data } = await RAWG.get<Games>(
    `/games/lists/main?key=${apiKey}&ordering=-released&page_size=10&page=${pageParam}`
  );

  return data?.results;
};

export default function TrendingGamesList() {
  const {
    data: games,
    isError,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(['getTrendingGames'], fetchGames, {
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 10) return undefined;

      if (allPages.length) return allPages.length + 1;

      return undefined;
    },
  });

  if (isLoading) return <LoadingCard size={5} isHorizontal />;

  if (isError) return <ErrorCard />;

  return (
    <div className="w-full overflow-hidden md:mb-8">
      <PageHeading heading="New and Upcoming Games" />

      <ul className="scrollbar-hide grid snap-x snap-proximity grid-flow-col items-center gap-4 overflow-x-scroll ">
        {games?.pages.map((page) =>
          page.map((detail) => (
            <li key={detail.slug} className="snap-start">
              <TrendingGameCard detail={detail} />
            </li>
          ))
        )}

        <li className="h-full w-32">
          <button
            type="button"
            disabled={!hasNextPage || isFetchingNextPage}
            onClick={() => hasNextPage && fetchNextPage()}
            className="h-full w-full rounded-md bg-primary-light px-6 py-2 text-white"
          >
            {/* eslint-disable-next-line no-nested-ternary */}
            {isFetchingNextPage
              ? 'Loading more...'
              : hasNextPage
              ? 'Load More'
              : 'Nothing more to load'}
          </button>
        </li>
      </ul>
    </div>
  );
}
