import Link from 'next/link';
import { useEffect, useState } from 'react';

// Hooks
import useUser from '../../hooks/useUser';
import useUserData from '../../hooks/useUserData';

export default function Bookmarks() {
  const user = useUser();
  const { status, data } = useUserData();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const filteredResults = data?.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );

    setResults(filteredResults);
  }, [data, query]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  if (status === 'loading') {
    return <span>loading...</span>;
  }

  return (
    <>
      <input type="text" value={query} onChange={handleChange} />

      <ul>
        {results
          ? results.map((d) => (
              <li key={d.createdAt}>
                <Link href={`/game/${d.slug}`}>{d.name}</Link>
              </li>
            ))
          : user &&
            data?.map((d) => (
              <li key={d.createdAt}>
                <Link href={`/game/${d.slug}`}>{d.name}</Link>
              </li>
            ))}
      </ul>
    </>
  );
}
