import { GetStaticProps } from 'next';
import { dehydrate, QueryClient, useQuery } from 'react-query';

// Componentns
import PageList from '../../components/PageList';
import PageItem from '../../components/PageItem';
import ErrorMsg from '../../components/ErrorMsg';
import LoadingMsg from '../../components/LoadingMsg';

// Helpers
import RAWG from '../../lib/rawg';

// Types
import { DataType } from '../../lib/types/game';

interface DataProps {
  results: DataType[];
}

const fetchGenres = async (): Promise<DataType[]> => {
  const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
  const { data } = await RAWG.get<DataProps>(`/genres?key=${apiKey}`);

  return data?.results;
};

export default function Genres() {
  const {
    data: genres,
    isError,
    isLoading,
  } = useQuery(['getGenres'], fetchGenres);

  if (isLoading) return <LoadingMsg size={20} />;

  if (isError) return <ErrorMsg />;

  return (
    <PageList>
      {genres?.map((genre) => (
        <PageItem key={genre.name} route="genre" data={genre} />
      ))}
    </PageList>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(['getGenres'], fetchGenres);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
