import axios from 'axios';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { GetStaticProps } from 'next';
import Link from 'next/link';

const fetchGames = () =>
  axios
    .get(
      `https://api.rawg.io/api/games?key=aa76b771907042489b43c2ed574953c9&page_size=30`
    )
    .then(({ data }) => data.results);

export default function Pokemon() {
  const {
    isSuccess,
    data: games,
    isLoading,
    isError,
  } = useQuery('getGames', fetchGames, {
    refetchOnWindowFocus: false,
  });

  console.log(games);

  if (isSuccess) {
    return (
      <div className="container">
        <h1>Games</h1>
        {games?.map((el) => (
          <div>
            <Link href={`/game/${el.id}`} key={el.id}>
              <div className="pokemon-card">{el.name}</div>
            </Link>
          </div>
        ))}
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

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery('getGames', fetchGames);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
