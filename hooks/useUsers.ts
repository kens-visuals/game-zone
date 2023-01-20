import { collection } from 'firebase/firestore';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';

// Interfaces
import { UserInterface } from './useUser';

export default function useUserBookmarks() {
  const firestore = useFirestore();
  const usersCollection = collection(firestore, `users`);

  const { status, data } = useFirestoreCollectionData(usersCollection);
  const users = data as UserInterface[];

  return { status, users };
}
