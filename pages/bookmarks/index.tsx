// Hooks
import useUser from '../../hooks/useUser';
import useUserBookmarks from '../../hooks/useUserBookmarks';
import GamesListContainer from '../../components/GamesListContainer';
import GameCard from '../../components/GameCard';

export default function Bookmarks() {
  const user = useUser();
  const { status, data: bookmarks } = useUserBookmarks();

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

  if (status === 'loading') {
    return <span>loading...</span>;
  }

  if (status === 'error') {
    return <span>Error</span>;
  }

  return (
    <div className="p-4">
      <GamesListContainer>
        {/* <input type="text" value={query} onChange={handleChange} /> */}
        {user && bookmarks
          ? bookmarks?.map((bookmark) => (
              <div key={bookmark.createdAt}>
                <GameCard details={bookmark} isFromBookmark />
              </div>
            ))
          : null}
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
    </div>
  );
}
