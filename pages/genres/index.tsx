import Link from 'next/link';
import { GetStaticProps } from 'next';
import { dehydrate, QueryClient, useQuery } from 'react-query';

// Componentns
import ErrorMsg from '../../components/ErrorMsg';
import LoadingMsg from '../../components/LoadingMsg';

// Helpers
import RAWG from '../../lib/rawg';

// Types
import { GenresTypes } from '../../lib/types/game';

interface GenresProps {
  results: GenresTypes[];
}

const fetchGenres = async (): Promise<GenresTypes[]> => {
  const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
  const { data } = await RAWG.get<GenresProps>(`/genres?key=${apiKey}`);

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
    <div className="grid grid-cols-2 gap-2 p-4 md:grid-cols-3 lg:grid-cols-4">
      {genres?.map((genre) => (
        <div
          key={genre.slug}
          style={{ backgroundImage: `url(${genre.image_background})` }}
          className="flex items-center rounded-lg bg-cover bg-center bg-no-repeat"
        >
          <div className="flex h-full w-full flex-col gap-4 overflow-hidden rounded-md bg-primary/80 p-4 backdrop-blur-sm backdrop-filter">
            <Link
              key={genre.slug}
              href={`/genre/${genre.slug}`}
              className="text-h2-light"
            >
              {genre?.name}
            </Link>

            <span className="text-sm text-white/50 ">
              Games count: {genre?.games_count}
            </span>
          </div>
        </div>
      ))}
    </div>
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
