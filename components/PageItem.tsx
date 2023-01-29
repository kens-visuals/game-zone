import Link from 'next/link';

import { GenresTypes } from '../lib/types/game';

interface Props {
  route: string;
  data: GenresTypes;
}

export default function PageItem({ route, data }: Props) {
  return (
    <li
      style={{ backgroundImage: `url(${data?.image_background})` }}
      className="flex items-center rounded-lg bg-cover bg-center bg-no-repeat"
    >
      <Link
        href={`/${route}/${data?.slug}`}
        className="flex h-full w-full flex-col justify-between gap-4 overflow-hidden rounded-md bg-primary/80 p-4 backdrop-blur-sm backdrop-filter transition-all duration-300 hover:cursor-pointer hover:bg-primary/50"
      >
        <span className="text-h3 capitalize">{data?.name}</span>

        <span className="text-sm text-white/50 ">
          Games count: {data?.games_count}
        </span>
      </Link>
    </li>
  );
}
