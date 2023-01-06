import Link from 'next/link';
import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps } from 'next';
import { dehydrate, QueryClient, useQuery } from 'react-query';

// Helpers
import RAWG from '../../lib/rawg';

export interface Game {
  id: string;
  slug: string;
  name: string;
  released: string;
  background_image: string;
  genres?: [{ name: string }];
}

const fetchGame = async (slug: string): Promise<Game> => {
  const { data } = await RAWG.get<Game>(
    `games/${slug}?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}`
  );

  return data;
};

const fetchScreenshots = async (slug: string) => {
  const { data } = await RAWG.get(
    `games/${slug}/screenshots?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}`
  );

  return data.results;
};

export default function Pokemon() {
  const router = useRouter();
  const gameSlug =
    typeof router.query?.slug === 'string' ? router.query.slug : '';

  const {
    data: game,
    isSuccess,
    isLoading,
    isError,
  } = useQuery(['getGame', gameSlug], () => fetchGame(gameSlug), {
    enabled: !!gameSlug,
  });

  const { data: screens } = useQuery(['getScreens', gameSlug], () =>
    fetchScreenshots(gameSlug)
  );

  if (isLoading) {
    return <div className="center">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="center">
        We could not find your pokemon{' '}
        <span role="img" aria-label="sad">
          😢
        </span>
      </div>
    );
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return (
    isSuccess && (
      <div className="container">
        <h1>Game</h1>
        <span>{game.name}</span>
        <img src={game.background_image} alt="" />

        {screens?.map(({ image }) => (
          <img src={image} alt="" />
        ))}
        <Link href="/">Go back</Link>
      </div>
    )
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const slug = context.params?.slug as string;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(['getGame', slug], () => fetchGame(slug));

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
