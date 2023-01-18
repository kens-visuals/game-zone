import { useQuery } from 'react-query';

// Components
import GameCard from './GameCard';
import GamesListContainer from './GamesListContainer';

// Helpers
import RAWG from '../lib/rawg';
import LoadingMsg from './LoadingMsg';
import ErrorMsg from './ErrorMsg';

// Types
import { GameInterface } from '../lib/types/game';

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
    isFetching: isSeriesFetching,
  } = useQuery(['getGameSeries', gameSlug], () => fetchGameSeries(gameSlug));

  if (isSeriesLoading || isSeriesFetching) return <LoadingMsg size={10} />;

  if (isSeriesError) return <ErrorMsg />;

  return series ? (
    <GamesListContainer>
      {series?.map((seria) => (
        <div key={seria.id} className="mt-4">
          <GameCard details={seria} />
        </div>
      ))}
    </GamesListContainer>
  ) : (
    <span>No series available</span>
  );
}
