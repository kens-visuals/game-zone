import {
  useAuthSignInWithPopup,
  useAuthSignOut,
} from '@react-query-firebase/auth';
import { auth, googleProvider } from '../firebase/firebase.config';

export default function useAuth() {
  const signInMutation = useAuthSignInWithPopup(auth);
  const signOutMutation = useAuthSignOut(auth);

  const handleUserSignIn = () =>
    signInMutation.mutate({ provider: googleProvider });
  const handleUserSignOut = () => signOutMutation.mutate();

  return { handleUserSignIn, handleUserSignOut };
}
