// Components
import Description from './Description';

// Interfaces
import { GameInterface, GenresTypes } from '../lib/types/game';

interface Props {
  data: GenresTypes | GameInterface;
}

export default function Banner({ data }: Props) {
  const backgroundImage =
    'background_image' in data
      ? data?.background_image
      : data?.image_background;

  return (
    <div
      style={{ backgroundImage: `url(${backgroundImage})` }}
      className="mb-4 bg-auto bg-center bg-no-repeat"
    >
      <div className="h-fit w-full bg-gradient-to-r from-primary-dark/90 to-primary/10 p-4 backdrop-blur-md backdrop-filter">
        <h1 className="w-full max-w-5xl text-h1 font-medium md:text-7xl">
          {data?.name}
        </h1>

        {data?.description && <Description description={data.description} />}
      </div>
    </div>
  );
}
