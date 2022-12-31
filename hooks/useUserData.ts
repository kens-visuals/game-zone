import { collection } from 'firebase/firestore';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';

// Hooks
import useUser from './useUser';

export default function useUserData() {
  const user = useUser();

  const firestore = useFirestore();
  const gamesCollection = collection(
    firestore,
    `users/${user?.data?.uid}/data`
  );

  const { status, data } = useFirestoreCollectionData(gamesCollection, {
    idField: 'id',
  });

  return { status, data };
}
