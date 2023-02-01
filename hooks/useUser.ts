import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useAuthUser } from '@react-query-firebase/auth';
import { auth, db } from '../firebase/firebase.config';

interface UserFollow {
  uid: string;
  email: string;
  photoURL: string;
  displayName: string;
}

export interface UserInterface {
  uid: string;
  email: string;
  photoURL: string;
  createdAt?: string;
  displayName: string;
  following?: UserFollow[];
  followers?: UserFollow[];
}

const options = {
  async onSuccess(newUser: UserInterface) {
    if (!newUser) return;

    const { displayName, email, uid, photoURL } = newUser;
    const userDocRef = doc(db, 'users', uid);

    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
      const createdAt = serverTimestamp();

      try {
        // Create user doc
        await setDoc(userDocRef, {
          uid,
          email,
          photoURL,
          createdAt,
          displayName,
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }
  },
  onError(error: ErrorOptions | undefined) {
    throw new Error(
      'Failed to subscribe to users authentication state!',
      error
    );
  },
};

export default function useUser() {
  const {
    data: currentUser,
    isError: isUserError,
    isLoading: isUserLoading,
    isFetching: isUserFetching,
  } = useAuthUser(['user'], auth, options);

  return { currentUser, isUserError, isUserFetching, isUserLoading };
}
