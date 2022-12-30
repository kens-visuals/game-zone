import axios from 'axios';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps } from 'next';

const fetchGame = (id: string) =>
  axios
    .get(
      `https://api.rawg.io/api/games/${id}?key=aa76b771907042489b43c2ed574953c9`
    )
    .then(({ data }) => data);

export default function Pokemon() {
  const router = useRouter();
  const gameID = typeof router.query?.id === 'string' ? router.query.id : '';

  const {
    isSuccess,
    data: game,
    isLoading,
    isError,
  } = useQuery(['getGame', gameID], () => fetchGame(gameID), {
    enabled: gameID.length > 0,
  });

  console.log(game);

  if (isSuccess) {
    return (
      <div className="container">
        <h1>Game</h1>
        <span>{game.name}</span>
        <img src={game.background_image} alt="" />
      </div>
    );
  }

  if (isLoading) {
    return <div className="center">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="center">
        We couldn't find your pokemon{' '}
        <span role="img" aria-label="sad">
          😢
        </span>
      </div>
    );
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>;
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
