import { GetStaticProps } from 'next';
import { dehydrate, QueryClient, useInfiniteQuery } from 'react-query';

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

const fetchPublishers = async ({ pageParam = 1 }): Promise<DataType[]> => {
  const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;

  const { data } = await RAWG.get<DataProps>(
    `/publishers?page_size=40&page=${pageParam}&key=${apiKey}`
  );

  return data?.results;
};
export default function Publishers() {
  const {
    data: publishers,
    isError,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(['getPublishers'], fetchPublishers, {
    getNextPageParam: (_, allPages) => {
      if (allPages.length < 10) return allPages.length + 1;

      return undefined;
    },
  });

  if (isLoading) return <LoadingMsg size={20} />;

  if (isError) return <ErrorMsg />;

  return (
    <div className="flex flex-col items-center gap-4 pb-14">
      <PageList>
        {publishers?.pages?.map((page) =>
          page.map((data) => (
            <PageItem key={data.name} route="publisher" data={data} />
          ))
        )}
      </PageList>

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
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(['getPublishers'], fetchPublishers);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
