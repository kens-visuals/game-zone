import { useFirestoreCollectionMutation } from '@react-query-firebase/firestore';
import { collection, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from 'reactfire';

// Hooks
import useUser from './useUser';

export default function addBookmarkData() {
  const user = useUser();

  const firestore = useFirestore();
  const userBookmarkRef = collection(
    firestore,
    `users/${user?.data?.uid}/data`
  );
  const addNewDataMutation = useFirestoreCollectionMutation(userBookmarkRef);

  const addNewData = (name: string, gameID: number) => {
    const createdAt = serverTimestamp();

    addNewDataMutation.mutate({
      name,
      gameID,
      createdAt,
    });
  };
  return { addNewData };
}
