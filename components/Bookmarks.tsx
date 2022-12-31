// Hooks
import useUser from '../hooks/useUser';
import useUserData from '../hooks/useUserData';

export default function Bookmarks() {
  const user = useUser();
  const { status, data } = useUserData();

  if (status === 'loading') {
    return <span>loading...</span>;
  }

  return (
    <ul>{user && data?.map((d) => <li key={d.createdAt}>{d.title}</li>)}</ul>
  );
}
