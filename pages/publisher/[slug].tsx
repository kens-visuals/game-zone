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
import { DataType, GameInterface } from '../../lib/types/index';

const API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;

const fetchPublisher = async (slug: string): Promise<DataType> => {
  const { data } = await RAWG.get<DataType>(
    `publishers/${slug}?key=${API_KEY}`
  );

  return data;
};

const fetchGames = async ({
  publisherSlug,
  pageParam = 1,
}: {
  publisherSlug: string;
  pageParam: number;
}): Promise<GameInterface[]> => {
  const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
  const { data } = await RAWG.get<{ results: GameInterface[] }>(
    `/games?key=${apiKey}&ordering=popularity&page_size=40&page=${pageParam}&publishers=${publisherSlug}`
  );

  return data?.results;
};

export default function Publisher() {
  const router = useRouter();
  const publisherSlug =
    typeof router.query?.slug === 'string' ? router.query.slug : '';

  const {
    data: publisher,
    isError: isTagError,
    isLoading: isTagLoading,
  } = useQuery(
    ['getPublisher', publisherSlug],
    () => fetchPublisher(publisherSlug),
    { enabled: !!publisherSlug }
  );

  const {
    data: games,
    isError: isGamesError,
    isLoading: isGamesLoading,

    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ['getGames', publisherSlug],
    ({ pageParam = 1 }) => fetchGames({ publisherSlug, pageParam }),
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
        <title>Publishers | {publisher?.name}</title>
        <meta name="description" content={publisher?.description} />
      </Head>

      <div>
        {publisher && <Banner data={publisher} />}

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

  await queryClient.prefetchQuery(['getPublisher', slug], () =>
    fetchPublisher(slug)
  );

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
