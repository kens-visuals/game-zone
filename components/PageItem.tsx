import Link from 'next/link';
import Image from 'next/image';

// Interfaces
import { DataType } from '../lib/types/game';

interface Props {
  route: string;
  data: DataType;
}

export default function PageItem({ route, data }: Props) {
  return (
    <li className="relative flex items-center overflow-hidden rounded-lg">
      <Image
        src={data?.image_background}
        alt={data.name}
        height={10}
        width={10}
        quality={10}
        className="absolute h-full w-full object-cover object-top"
      />
      <Link
        href={`/${route}/${data?.slug}`}
        className="flex h-full w-full flex-col justify-between gap-4 overflow-hidden rounded-md bg-primary/80 p-4 backdrop-blur-sm backdrop-filter transition-all duration-300 hover:cursor-pointer hover:bg-primary/20"
      >
        <span className="text-h3 capitalize">{data?.name}</span>

        <span className="text-sm text-white/50 ">
          Games count: {data?.games_count}
        </span>
      </Link>
    </li>
  );
}
