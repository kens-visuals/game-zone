import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps } from 'next';
import { dehydrate, QueryClient, useQuery } from 'react-query';

// Components
import Banner from '../../components/Banner';
import ErrorMsg from '../../components/ErrorMsg';
import GameDetail from '../../components/GameDetail';
import LoadingMsg from '../../components/LoadingMsg';
import GameSeriesList from '../../components/GameSeriesList';
import CollectionsDropdown from '../../components/CollectionsDropdown';

// Helpers
import RAWG from '../../lib/rawg';
import { formatDate } from '../../lib/helpers';

// Hooks
import useBookmarkMutation from '../../hooks/useBookmarkMutation';

// Interfaces
import { GameInterface, Screenshots } from '../../lib/types/game';

const API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;

const fetchGame = async (slug: string): Promise<GameInterface> => {
  const { data } = await RAWG.get<GameInterface>(
    `games/${slug}?key=${API_KEY}`
  );

  return data;
};

const fetchScreenshots = async (slug: string): Promise<Screenshots[]> => {
  const { data } = await RAWG.get(`games/${slug}/screenshots?key=${API_KEY}`);

  return data.results;
};

export default function Game() {
  const router = useRouter();
  const { addNewData } = useBookmarkMutation();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const gameSlug =
    typeof router.query?.slug === 'string' ? router.query.slug : '';

  const {
    data: game,
    isSuccess,
    isLoading,
    isError,
  } = useQuery(['getGame', gameSlug], () => fetchGame(gameSlug), {
    enabled: !!gameSlug,
  });

  const {
    data: screens,
    isLoading: isScreenLoading,
    isFetching: isScreenFetching,
  } = useQuery(['getScreens', gameSlug], () => fetchScreenshots(gameSlug));

  const emptyArray = Array.from({ length: 6 }, () => Math.random());

  if (isLoading) return <LoadingMsg size={1} />;

  if (isError) return <ErrorMsg />;

  return (
    isSuccess && (
      <>
        <Banner data={game} />

        <div className="p-4">
          <button
            type="button"
            onClick={() => addNewData(game)}
            className="mb-4 flex w-full items-center justify-center gap-2 rounded-md border border-transparent bg-primary-dark p-4 text-center transition-colors duration-300 hover:border-primary-light hover:bg-transparent"
          >
            Add to Bookmark
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => setIsDropdownOpen((prevState) => !prevState)}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-md border border-transparent bg-secondary p-4 text-center transition-colors duration-300 hover:border-secondary/70 hover:bg-secondary/70 ${
              isDropdownOpen && 'bg-secondary/80'
            } `}
          >
            Collections
            <svg
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 transition-all duration-300 ${
                isDropdownOpen && 'rotate-180'
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <CollectionsDropdown game={game} isDropdownOpen={isDropdownOpen} />

          <ul className="mt-4 grid grid-flow-dense grid-cols-2 gap-2">
            {isScreenLoading && isScreenFetching
              ? emptyArray.map((el) => (
                  <li
                    key={el}
                    role="status"
                    className="animate-pulse space-y-8 md:flex md:items-center md:space-y-0 md:space-x-8"
                  >
                    <div className="flex h-24 w-full items-center justify-center rounded bg-gray-300 dark:bg-gray-700 sm:w-96">
                      <svg
                        className="h-12 w-12 text-gray-200"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 640 512"
                      >
                        <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
                      </svg>
                    </div>
                    <span className="sr-only">Loading...</span>
                  </li>
                ))
              : screens?.map(({ image }) => (
                  <li key={image}>
                    <Image
                      key={image}
                      src={image}
                      width={1000}
                      height={1000}
                      alt="game screenshot"
                      className="w-full rounded-md"
                    />
                  </li>
                ))}
          </ul>

          <div className="mt-4 rounded-md bg-primary-dark p-4">
            <h2 className="text-h2-medium">Details</h2>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              {game?.parent_platforms && (
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-primary-light">Platforms:</span>
                  <ul className="flex gap-1">
                    {game.parent_platforms.map(({ platform }, idx, arr) => (
                      <li key={platform.name} className="text-body-1 underline">
                        {platform.name}
                        {idx === arr.length - 1 ? '.' : ','}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {game?.genres && (
                <div className="flex items-baseline gap-2">
                  <span className="text-primary-light">Genres:</span>
                  <ul className="flex gap-1">
                    {game.genres.map((genre) => (
                      <li key={genre.name} className="text-body-1">
                        {genre.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {game?.released && (
                <GameDetail name="Released" info={formatDate(game?.released)} />
              )}

              {game?.metacritic && (
                <GameDetail name="Metacritic" info={game.metacritic} />
              )}

              {game?.rating && (
                <GameDetail
                  name="Rating"
                  info={`${game?.rating} / ${game?.rating_top}`}
                />
              )}

              <div className="flex gap-2">
                <h3 className="text-primary-light">Links:</h3>
                {game.website || game.redditurl ? (
                  <div className="flex items-center gap-2">
                    {game?.redditurl && (
                      <a href={game.redditurl} target="_blank" rel="noreferrer">
                        Reddit
                      </a>
                    )}

                    {game?.website && (
                      <div className="flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-4 w-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                          />
                        </svg>
                        <a
                          href={game?.website}
                          target="_blank"
                          rel="noreferrer"
                          className="underline"
                        >
                          Website
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-body-1">N/A</span>
                )}
              </div>

              {game?.tags && (
                <div className="flex items-baseline gap-2">
                  <span className="inline-block text-primary-light">
                    Tags:{' '}
                  </span>
                  <ul className="flex flex-wrap gap-1 text-body-1">
                    {game?.tags.slice(0, 6).map((tag, idx, arr) => (
                      <li key={tag.name} className="underline">
                        {tag.name}
                        {idx === arr.length - 1 ? '.' : ','}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-4  flex w-full overflow-hidden rounded-md">
              {game?.ratings &&
                game.ratings.map((rating) => (
                  <div
                    key={rating.title}
                    style={{ width: `${rating.percent}rem` }}
                    className={`bg-gradient-to-t
              ${
                // eslint-disable-next-line no-nested-ternary
                rating.title === 'exceptional'
                  ? 'from-green-900  to-green-600'
                  : // eslint-disable-next-line no-nested-ternary
                  rating.title === 'recommended'
                  ? 'from-yellow-900  to-yellow-600'
                  : rating.title === 'meh'
                  ? 'from-orange-900  to-orange-600'
                  : 'from-red-900  to-red-600'
              }`}
                  >
                    <span className="inline-block p-2 text-body-1 md:p-4">
                      {rating.title}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          <GameSeriesList gameSlug={gameSlug} />

          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full rounded-md border-2 border-primary-dark bg-primary-dark p-4 text-center text-white transition-colors duration-300 hover:bg-primary-light/70"
            >
              Go Back
            </button>
            <Link
              href="/"
              className="w-full rounded-md border-2 border-primary-dark bg-transparent p-4 text-center text-white  transition-colors duration-300 hover:bg-primary-light/70"
            >
              Go Home
            </Link>
          </div>
        </div>
      </>
    )
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const slug = context.params?.slug as string;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(['getGame', slug], () => fetchGame(slug));

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
