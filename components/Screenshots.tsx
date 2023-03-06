import { useState } from 'react';
import Image from 'next/image';
import { useQuery } from 'react-query';

// Components
import ScreenshotModal from './ScreenshotModal';

// Helpers
import RAWG from '../lib/rawg';

// Interfaces
import { Screenshots as ScreenshotsProps } from '../lib/types/index';

interface Props {
  gameSlug: string;
}

const fetchScreenshots = async (slug: string): Promise<ScreenshotsProps[]> => {
  const API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;

  const { data } = await RAWG.get(`games/${slug}/screenshots?key=${API_KEY}`);

  return data.results;
};

export default function Screenshots({ gameSlug }: Props) {
  const [currImg, setCurrImg] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: screens,
    isLoading: isScreenLoading,
    isFetching: isScreenFetching,
  } = useQuery(['getScreens', gameSlug], () => fetchScreenshots(gameSlug));

  const emptyArray = Array.from({ length: 6 }, () => Math.random());

  if (isScreenLoading || isScreenFetching)
    return (
      <ul className="mt-4 grid grid-flow-dense grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-4">
        {emptyArray.map((el) => (
          <li
            key={el}
            role="status"
            className="animate-pulse space-y-8 md:flex md:items-center md:space-y-0 md:space-x-8"
          >
            <div className="flex h-24 w-full items-center justify-center rounded bg-gray-300 sm:w-96 md:h-48 ">
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
        ))}
      </ul>
    );

  return (
    <>
      <ul className="mt-4 grid grid-flow-dense grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-4">
        {screens?.map(({ image }, idx) => (
          <li key={image}>
            <button
              type="button"
              onClick={() => {
                setCurrImg(idx);
                setIsModalOpen(true);
              }}
            >
              <Image
                key={image}
                src={image}
                width={1000}
                height={1000}
                alt="game screenshot"
                className="w-full rounded-md transition-all duration-300 hover:scale-95 hover:cursor-zoom-in"
              />
            </button>
          </li>
        ))}
      </ul>

      {isModalOpen && (
        <ScreenshotModal
          screens={screens}
          currImg={currImg}
          setCurrImg={setCurrImg}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </>
  );
}
