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

const fetchGenre = async (slug: string): Promise<DataType> => {
  const { data } = await RAWG.get<DataType>(`genres/${slug}?key=${API_KEY}`);

  return data;
};

const fetchGames = async ({
  genreSlug,
  pageParam = 1,
}: {
  genreSlug: string;
  pageParam: number;
}): Promise<GameInterface[]> => {
  const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
  const { data } = await RAWG.get<{ results: GameInterface[] }>(
    `/games?key=${apiKey}&discover=true&ordering=popularity&page_size=40&page=${pageParam}&genres=${genreSlug}`
  );

  return data?.results;
};

export default function Genre() {
  const router = useRouter();
  const genreSlug =
    typeof router.query?.slug === 'string' ? router.query.slug : '';

  const {
    data: genre,
    isError: isGenreError,
    isLoading: isGenreLoading,
  } = useQuery(['getGenre', genreSlug], () => fetchGenre(genreSlug), {
    enabled: !!genreSlug,
  });

  const {
    data: games,
    isError: isGamesError,
    isLoading: isGamesLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ['getGames', genreSlug],
    ({ pageParam = 1 }) => fetchGames({ genreSlug, pageParam }),
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length < 40) return undefined;

        if (allPages.length) return allPages.length + 1;

        return undefined;
      },
    }
  );

  if (isGenreLoading || isGamesLoading) return <LoadingCard size={30} />;

  if (isGenreError || isGamesError) return <ErrorCard />;

  return (
    <>
      <Head>
        <title>Genres | {genre?.name}</title>
        <meta name="description" content={genre?.description} />
      </Head>

      <div>
        {genre && <Banner data={genre} />}

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

  await queryClient.prefetchQuery(['getGenre', slug], () => fetchGenre(slug));

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
