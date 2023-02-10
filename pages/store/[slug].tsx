import Head from 'next/head';
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
import GameCard from '../../components/GameCard';
import ErrorCard from '../../components/ErrorCard';
import LoadingCard from '../../components/LoadingCard';
import GamesListContainer from '../../components/GamesListContainer';

// Helpers
import RAWG from '../../lib/rawg';

// Types
import { GameInterface, DataType } from '../../lib/types/index';

const API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;

const fetchStore = async (slug: string): Promise<DataType> => {
  const { data } = await RAWG.get<DataType>(`stores/${slug}?key=${API_KEY}`);

  return data;
};

const fetchGames = async ({
  storeId,
  pageParam = 1,
}: {
  storeId: number;
  pageParam: number;
}): Promise<GameInterface[]> => {
  const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
  const { data } = await RAWG.get<{ results: GameInterface[] }>(
    `/games?key=${apiKey}&ordering=popularity&page_size=40&page=${pageParam}&stores=${storeId}`
  );

  return data?.results;
};

export default function Store() {
  const router = useRouter();
  const storeSlug =
    typeof router.query?.slug === 'string' ? router.query.slug : '';

  const {
    data: store,
    isError: isTagError,
    isLoading: isTagLoading,
  } = useQuery(['getStore', storeSlug], () => fetchStore(storeSlug), {
    enabled: !!storeSlug,
  });

  const storeId = store?.id as number;

  const {
    data: games,
    isError: isGamesError,
    isLoading: isGamesLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ['getGames', storeId],
    ({ pageParam = 1 }) => fetchGames({ storeId, pageParam }),
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length < 40) return undefined;

        if (allPages.length) return allPages.length + 1;

        return undefined;
      },
    }
  );

  if (isTagLoading || isGamesLoading) return <LoadingCard size={30} />;

  if (isTagError || isGamesError) return <ErrorCard />;

  return (
    <>
      <Head>
        <title>Stores | {store?.name}</title>
        <meta name="description" content={store?.description} />
      </Head>

      <div>
        {store && <Banner data={store} />}

        <div>
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
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const slug = context.params?.slug as string;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(['getStore', slug], () => fetchStore(slug));

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
