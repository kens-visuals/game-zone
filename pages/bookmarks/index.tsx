import Link from 'next/link';

// Components
import GamesListContainer from '../../components/GamesListContainer';
import GameCard from '../../components/GameCard';
import LoadingCard from '../../components/LoadingCard';
import ErrorCard from '../../components/ErrorCard';

// Hooks
import useUser from '../../hooks/useUser';
import useAuth from '../../hooks/useAuth';
import useUserBookmarks from '../../hooks/useUserBookmarks';

export default function Bookmarks() {
  const { currentUser } = useUser();
  const { handleUserSignIn } = useAuth();
  const { status, bookmarksData } = useUserBookmarks();

  //   const [query, setQuery] = useState('');
  //   const [results, setResults] = useState<any[]>([]);

  //   useEffect(() => {
  //     const filteredResults = bookmarks?.filter((item) =>
  //       item.name.toLowerCase().includes(query.toLowerCase())
  //     );

  //     setResults(filteredResults);
  //   }, [bookmarks, query]);

  //   useEffect(() => setResults([]), [bookmarks]);

  //   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //     setQuery(event.target.value);
  //   };

  if (status === 'loading') return <LoadingCard size={10} />;

  if (status === 'error') return <ErrorCard />;

  return (
    <div className="p-4">
      {!currentUser ? (
        <div className="flex flex-col items-center justify-center gap-4">
          <h1>No bookmarks yet!</h1>

          <button
            type="button"
            onClick={handleUserSignIn}
            className="mr-2 mb-2 inline-flex items-center rounded-lg bg-[#4285F4] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[#4285F4]/90 focus:outline-none focus:ring-4 focus:ring-[#4285F4]/50"
          >
            <svg
              className="mr-2 -ml-1 h-4 w-4"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="google"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="currentColor"
                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
              />
            </svg>
            Sign in with Google
          </button>
        </div>
      ) : (
        <GamesListContainer>
          {/* <input type="text" value={query} onChange={handleChange} /> */}
          {!bookmarksData.length ? (
            <Link href="/">Go to games</Link>
          ) : (
            bookmarksData?.map((bookmark) => (
              <div key={bookmark.createdAt}>
                <GameCard details={bookmark} isFromBookmark />
              </div>
            ))
          )}
          {/* {!results
              ? results.map((d) => (
                  <li key={createdAt}>
                    <Link href={`/game/${slug}`}>{name}</Link>{' '}
                    <button type="button" onClick={() => removeData(id)}>
                      Del
                    </button>
                  </li>
                ))
              : user &&
                bookmarks?.map((d) => (
                  <li key={createdAt}>
                    <Link href={`/game/${slug}`}>{name}</Link>
                    <button type="button" onClick={() => removeData(id)}>
                      Del
                    </button>
                  </li>
                ))} */}
        </GamesListContainer>
      )}
    </div>
  );
}
