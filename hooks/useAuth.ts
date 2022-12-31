import {
  useAuthSignInWithPopup,
  useAuthSignOut,
} from '@react-query-firebase/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase/firebase.config';

export default function useAuth() {
  const signInMutation = useAuthSignInWithPopup(auth);
  const signOutMutation = useAuthSignOut(auth);

  const handleUserSignIn = () =>
    signInMutation.mutate({ provider: new GoogleAuthProvider() });
  const handleUserSignOut = () => signOutMutation.mutate();

  return { handleUserSignIn, handleUserSignOut };
}
