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
    <div>
      <PageHeading heading="Bookmarks" />

      <Divider />

      {!currentUser ? (
        <div className="flex flex-col items-center justify-center gap-4">
          <h1>No bookmarks yet!</h1>

          <SignInButton isUserLoading={isUserLoading} />
        </div>
      ) : (
        <GamesListContainer>
          {!bookmarksData.length ? (
            <Link href="/">Go to games</Link>
          ) : (
            bookmarksData?.map((bookmark) => (
              <div key={bookmark.createdAt}>
                <GameCard details={bookmark} isFromBookmark />
              </div>
            ))
          )}
        </GamesListContainer>
      )}
    </div>
  );
}
