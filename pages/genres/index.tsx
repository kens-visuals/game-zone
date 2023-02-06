import Head from 'next/head';
import { GetStaticProps } from 'next';
import { dehydrate, QueryClient, useQuery } from 'react-query';

// Componentns
import Divider from '../../components/Divider';
import PageItem from '../../components/PageItem';
import PageList from '../../components/PageList';
import ErrorCard from '../../components/ErrorCard';
import LoadingCard from '../../components/LoadingCard';
import PageHeading from '../../components/PageHeading';

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

  if (isLoading) return <LoadingCard size={20} />;

  if (isError) return <ErrorCard />;

  return (
    <>
      <Head>
        <title>GZ | Genres</title>
        <meta name="description" content="List of genres" />
      </Head>

      <PageHeading heading="Genres" />

      <Divider />

      <PageList>
        {genres?.map((genre) => (
          <PageItem key={genre.name} route="genre" data={genre} />
        ))}
      </PageList>
    </>
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
