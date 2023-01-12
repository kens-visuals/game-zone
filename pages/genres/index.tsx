import Link from 'next/link';
import Image from 'next/image';

import { GetStaticProps } from 'next';
import { dehydrate, QueryClient, useQuery } from 'react-query';

// Helpers
import RAWG from '../../lib/rawg';
import { GenresTypes } from '../game/[slug]';

interface GenresProps {
  results: GenresTypes;
}

const fetchGenres = async (): Promise<GenresTypes> => {
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-2 rounded-md p-4 md:grid-cols-3 lg:grid-cols-4">
      {genres?.map((genre) => (
        <div
          style={{ backgroundImage: `url(${genre.image_background})` }}
          className="flex items-center bg-cover bg-center bg-no-repeat"
        >
          <div className="flex h-full w-full flex-col gap-4 bg-primary/80 p-4 backdrop-blur-sm backdrop-filter">
            <Link
              key={genre.slug}
              href={`/genre/${genre.slug}`}
              className="text-h2-medium"
            >
              {genre?.name}
            </Link>

            <span className="text-sm text-white/50 ">
              Games count: {genre?.games_count}
            </span>
          </div>

          {/* <div>{genres.games}</div> */}
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
