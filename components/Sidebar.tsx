import useAuth from '../hooks/useAuth';
import useUser from '../hooks/useUser';

export default function Sidebar() {
  const user = useUser();
  const { handleUserSignIn, handleUserSignOut } = useAuth();

  return (
    <div>
      {!user?.data ? (
        <button type="button" onClick={handleUserSignIn}>
          Sign In
        </button>
      ) : (
        <button type="button" onClick={handleUserSignOut}>
          Sign Out
        </button>
      )}
    </div>
  );
}
