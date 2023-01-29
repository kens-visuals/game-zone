import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps } from 'next';
import {
  dehydrate,
  QueryClient,
  useInfiniteQuery,
  useQuery,
} from 'react-query';

// Components
import Banner from '../../components/Banner';
import ErrorMsg from '../../components/ErrorMsg';
import GameCard from '../../components/GameCard';
import LoadingMsg from '../../components/LoadingMsg';
import GamesListContainer from '../../components/GamesListContainer';

// Helpers
import RAWG from '../../lib/rawg';

// Types
import { GameInterface, GenresTypes } from '../../lib/types/game';

const API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;

const fetchTag = async (slug: string): Promise<GenresTypes> => {
  const { data } = await RAWG.get<GenresTypes>(`tags/${slug}?key=${API_KEY}`);

  return data;
};

const fetchGames = async ({
  tagSlug,
  pageParam = 1,
}: {
  tagSlug: string;
  pageParam: number;
}): Promise<GameInterface[]> => {
  const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
  const { data } = await RAWG.get<{ results: GameInterface[] }>(
    `/games?key=${apiKey}&ordering=popularity&page_size=40&page=${pageParam}&tags=${tagSlug}`
  );

  return data?.results;
};

export default function Genre() {
  const router = useRouter();
  const tagSlug =
    typeof router.query?.slug === 'string' ? router.query.slug : '';

  const {
    data: tag,
    isError: isTagError,
    isLoading: isTagLoading,
  } = useQuery(['getTag', tagSlug], () => fetchTag(tagSlug), {
    enabled: !!tagSlug,
  });

  const {
    data: games,
    isError: isGamesError,
    isLoading: isGamesLoading,

    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ['getGames', tagSlug],
    ({ pageParam = 1 }) => fetchGames({ tagSlug, pageParam }),
    {
      getNextPageParam: (_, allPages) => {
        if (allPages.length < 10) return allPages.length + 1;

        return undefined;
      },
    }
  );

  if (isTagLoading || isGamesLoading) return <LoadingMsg size={30} />;

  if (isTagError || isGamesError) return <ErrorMsg />;

  return (
    <div>
      {tag && <Banner data={tag} />}

      <div className="p-4">
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
    </div>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const slug = context.params?.slug as string;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(['getTag', slug], () => fetchTag(slug));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: 'blocking',
});