import { GetStaticProps } from 'next';
import { dehydrate, QueryClient, useQuery } from 'react-query';

// Componentns
import PageList from '../../components/PageList';
import PageItem from '../../components/PageItem';
import ErrorCard from '../../components/ErrorCard';
import LoadingCard from '../../components/LoadingCard';

// Helpers
import RAWG from '../../lib/rawg';

// Types
import { DataType } from '../../lib/types/game';

interface DataProps {
  results: DataType[];
}

const fetchStores = async (): Promise<DataType[]> => {
  const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;

  const { data } = await RAWG.get<DataProps>(
    `/stores?page_size=40&&key=${apiKey}`
  );

  return data?.results;
};
export default function Stores() {
  const {
    data: stores,
    isError,
    isLoading,
    isFetching,
  } = useQuery(['getStores'], fetchStores, {
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 40) return undefined;

      if (allPages.length) return allPages.length + 1;

      return undefined;
    },
  });

  if (isLoading || isFetching) return <LoadingCard size={20} />;

  if (isError) return <ErrorCard />;

  return (
    <div className="flex w-full flex-col items-center gap-4 pb-14">
      <PageList>
        {stores?.map((data) => (
          <PageItem key={data.name} route="store" data={data} />
        ))}
      </PageList>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(['getStores'], fetchStores);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
