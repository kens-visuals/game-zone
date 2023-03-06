import { Dispatch, RefObject, SetStateAction } from 'react';
import Image from 'next/image';

// Hooks
import useOutsideClick from '../hooks/useClickOutside';

// Interfaces
import { Screenshots } from '../lib/types/index';

interface Props {
  screens: Screenshots[] | undefined;
  currImg: number;
  setCurrImg: Dispatch<SetStateAction<number>>;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ScreenshotModal({
  screens,
  currImg,
  setCurrImg,
  setIsModalOpen,
}: Props) {
  const callback = () => setIsModalOpen(false);
  const ref = useOutsideClick(callback) as RefObject<HTMLDivElement>;

  const prevImg = () =>
    setCurrImg(
      screens?.length && currImg === 0 ? screens.length - 1 : currImg - 1
    );
  const nextImg = () =>
    setCurrImg(
      screens?.length && currImg >= screens.length - 1 ? 0 : currImg + 1
    );

  return (
    <div className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-black/80 px-4 lg:px-8">
      <div ref={ref} className="relative">
        <div className="md:hidden">
          {screens?.length && (
            <Image
              src={screens[currImg].image}
              width={500}
              height={500}
              alt="game screenshot"
              className="h-full w-full rounded-lg"
            />
          )}
        </div>
        <div className="hidden md:inline-block">
          {screens?.length && (
            <Image
              src={screens[currImg].image}
              width={2500}
              height={2500}
              alt="game screenshot"
              className="h-full w-full rounded-lg"
            />
          )}
        </div>

        <ul className="absolute -bottom-5 left-1/2 z-30 flex -translate-x-1/2 space-x-3 md:bottom-5">
          {screens?.map(({ image }, idx) => (
            <li key={image}>
              <button
                type="button"
                onClick={() => setCurrImg(idx)}
                className={`h-3 w-3 rounded-full ${
                  idx === currImg ? 'bg-secondary' : 'bg-secondary/30'
                }`}
                aria-label="dot"
              />
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="group absolute top-0 left-0 z-30 flex h-full cursor-pointer items-center justify-center px-2 focus:outline-none md:px-4"
          onClick={prevImg}
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-secondary/30 group-hover:bg-secondary/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-secondary sm:h-10 sm:w-10">
            <svg
              aria-hidden="true"
              className="h-5 w-5 text-secondary  sm:h-6 sm:w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="sr-only">Previous</span>
          </span>
        </button>
        <button
          type="button"
          className="group absolute top-0 right-0 z-30 flex h-full cursor-pointer items-center justify-center px-2 focus:outline-none md:px-4"
          onClick={nextImg}
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-secondary/30 group-hover:bg-secondary/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-secondary sm:h-10 sm:w-10">
            <svg
              aria-hidden="true"
              className="h-5 w-5 text-secondary  sm:h-6 sm:w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span className="sr-only">Next</span>
          </span>
        </button>
      </div>
    </div>
  );
}
