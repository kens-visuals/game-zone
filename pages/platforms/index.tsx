import { GetStaticProps } from 'next';
import { dehydrate, QueryClient, useInfiniteQuery } from 'react-query';

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

const fetchPlatforms = async ({ pageParam = 1 }): Promise<DataType[]> => {
  const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;

  const { data } = await RAWG.get<DataProps>(
    `/platforms?page_size=40&page=${pageParam}&key=${apiKey}`
  );

  return data?.results;
};
export default function Platforms() {
  const {
    data: platforms,
    isError,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(['getPlatforms'], fetchPlatforms, {
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 40) return undefined;

      if (allPages.length) return allPages.length + 1;

      return undefined;
    },
  });

  if (isLoading) return <LoadingCard size={20} />;

  if (isError) return <ErrorCard />;

  return (
    <div className="flex flex-col items-center gap-4 pb-14">
      <PageList>
        {platforms?.pages?.map((page) =>
          page.map((data) => (
            <PageItem key={data.name} route="platform" data={data} />
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
  await queryClient.prefetchQuery(['getPlatforms'], fetchPlatforms);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
