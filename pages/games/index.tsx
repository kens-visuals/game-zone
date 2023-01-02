import { dehydrate, QueryClient, useQuery } from 'react-query';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import RAWG from '../../lib/rawg';

// Hooks
import useUser from '../../hooks/useUser';
import useBookmarkData from '../../hooks/useBookmarkData';

// Interface
import { Game } from '../game/[id]';

const fetchGames = async (): Promise<Game[]> => {
  const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
  const { data } = await RAWG.get(`/games?key=${apiKey}&page_size=30`);

  return data.results;
};

export default function Pokemon() {
  const user = useUser();
  const { addNewData } = useBookmarkData();

  const {
    isSuccess,
    data: games,
    isLoading,
    isError,
  } = useQuery('getGames', fetchGames, {
    refetchOnWindowFocus: false,
  });

  if (isSuccess) {
    return (
      <div className="container">
        <h1>Games</h1>
        <h2>Welcome {user?.data?.email}!</h2>

        {games?.map((el) => (
          <div key={el.id}>
            <Link href={`/game/${el.id}`} key={el.id}>
              <span>{el.name}</span>{' '}
            </Link>
            <button type="button" onClick={() => addNewData(el.name, el.id)}>
              Add new data
            </button>
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
        We could not find your pokemon{' '}
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
