import { ReactNode } from 'react';
import Masonry from 'react-masonry-css';

interface Props {
  children: ReactNode;
}

export default function GamesListContainer({ children }: Props) {
  const breakpointColumnsObj = {
    default: 4,
    1100: 2,
    500: 1,
  };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex w-full gap-4"
    >
      {children}
    </Masonry>
  );
}
