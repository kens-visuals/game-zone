import Link from 'next/link';
import Image from 'next/image';

// Assets
import placeholderImg from '../public/assets/placeholder.avif';

// Interfaces
import { DataType } from '../lib/types/index';

interface Props {
  route: string;
  data: DataType;
}

export default function PageItem({ route, data }: Props) {
  return (
    <li className="relative flex items-center overflow-hidden rounded-lg md:h-40">
      <Image
        src={data?.image_background || placeholderImg}
        alt={data.name}
        height={100}
        width={100}
        className="absolute h-full w-full object-cover object-top"
      />
      <Link
        href={`/${route}/${data?.slug}`}
        className="flex h-full w-full flex-col justify-between gap-4 overflow-hidden rounded-md bg-primary/80 p-4 backdrop-blur-sm backdrop-filter transition-all duration-300 hover:cursor-pointer hover:bg-primary/20 hover:backdrop-blur-sm md:pt-8"
      >
        <span className="text-h3 capitalize md:text-h2-light">
          {data?.name}
        </span>

        <span className="text-sm text-white/50 ">
          Games count: {data?.games_count}
        </span>
      </Link>
    </li>
  );
}
