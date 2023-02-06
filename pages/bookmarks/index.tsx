import Head from 'next/head';
import Link from 'next/link';

// Components
import Divider from '../../components/Divider';
import GameCard from '../../components/GameCard';
import ErrorCard from '../../components/ErrorCard';
import LoadingCard from '../../components/LoadingCard';
import PageHeading from '../../components/PageHeading';
import SignInButton from '../../components/SignInButton';
import GamesListContainer from '../../components/GamesListContainer';

// Hooks
import useUser from '../../hooks/useUser';
import useUserBookmarks from '../../hooks/useUserBookmarks';

export default function Bookmarks() {
  const { currentUser, isUserLoading } = useUser();
  const { status, bookmarksData } = useUserBookmarks();

  if (status === 'loading') return <LoadingCard size={10} />;

  if (status === 'error') return <ErrorCard />;

  return (
    <>
      <Head>
        <title>GZ | Bookmarks</title>
        <meta
          name="description"
          content={`Games bookmakred by ${currentUser?.displayName}`}
        />
      </Head>

      <div>
        <PageHeading heading="Bookmarks" />

        <Divider />

        {/* eslint-disable-next-line no-nested-ternary */}
        {!currentUser ? (
          <div className="flex flex-col items-center justify-center rounded-md bg-primary-dark p-4">
            <span className="mb-2 inline-block">Sign In to add bookmarks</span>
            <SignInButton isSidebarOpen isUserLoading={isUserLoading} />
          </div>
        ) : !bookmarksData.length ? (
          <div className="mt-8 flex w-full flex-col items-center justify-center gap-4 rounded-md bg-primary-dark p-4">
            <span className="text-center text-h2-light">
              You don&apos;t have any bookmarks yet
            </span>
            <Link
              href="/"
              className="flex w-full items-center justify-center text-body-1 underline hover:text-secondary"
            >
              Go to games
            </Link>
          </div>
        ) : (
          <GamesListContainer>
            {bookmarksData?.map((bookmark) => (
              <div key={bookmark.createdAt}>
                <GameCard details={bookmark} isFromBookmark />
              </div>
            ))}
          </GamesListContainer>
        )}
      </div>
    </>
  );
}
