import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { dehydrate, QueryClient, useQuery } from 'react-query';

// Helpers
import RAWG from '../../lib/rawg';

export interface Game {
  id: number;
  name: string;
  released: string;
  background_image?: string;
}

const fetchGame = async (id: string): Promise<Game> => {
  const { data } = await RAWG.get<Game>(
    `games/${id}?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}`
  );

  return data;
};

export default function Pokemon() {
  const router = useRouter();
  const gameID = typeof router.query?.id === 'string' ? router.query.id : '';

  const {
    data: game,
    isSuccess,
    isLoading,
    isError,
  } = useQuery(['getGame', gameID], () => fetchGame(gameID), {
    enabled: gameID.length > 0,
  });

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
        <Link href="/">Go back</Link>
      </div>
    )
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const id = context.params?.id as string;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(['getGame', id], () => fetchGame(id));

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
