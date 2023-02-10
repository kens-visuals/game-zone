import { useQuery } from 'react-query';

// Components
import GameCard from './GameCard';
import GamesListContainer from './GamesListContainer';

// Helpers
import RAWG from '../lib/rawg';
import LoadingCard from './LoadingCard';
import ErrorCard from './ErrorCard';

// Types
import { GameInterface } from '../lib/types/index';

interface Props {
  gameSlug: string;
}

const API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;

export default function GameSeriesList({ gameSlug }: Props) {
  const fetchGameSeries = async (slug: string): Promise<GameInterface[]> => {
    const { data } = await RAWG.get(`games/${slug}/game-series?key=${API_KEY}`);

    return data.results;
  };

  const {
    data: series,
    isError: isSeriesError,
    isLoading: isSeriesLoading,
  } = useQuery(['getGameSeries', gameSlug], () => fetchGameSeries(gameSlug));

  if (isSeriesLoading) return <LoadingCard size={10} />;

  if (isSeriesError) return <ErrorCard />;

  return (
    <div className="mt-6">
      <span className="mb-4 inline-block text-h2-medium">Game Series</span>
      {series?.length ? (
        <GamesListContainer>
          {series?.map((seria) => (
            <div key={seria.id}>
              <GameCard details={seria} />
            </div>
          ))}
        </GamesListContainer>
      ) : (
        <div className="w-full rounded-lg bg-primary-dark p-4 text-center">
          <span>No series available</span>
        </div>
      )}
    </div>
  );
}
