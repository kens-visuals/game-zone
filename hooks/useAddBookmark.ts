import { useFirestoreCollectionMutation } from '@react-query-firebase/firestore';
import { collection, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from 'reactfire';

// Hooks
import useUser from './useUser';

export default function useAddBookmark() {
  const user = useUser();

  const firestore = useFirestore();
  const userBookmarkRef = collection(
    firestore,
    `users/${user?.data?.uid}/data`
  );
  const addNewDataMutation = useFirestoreCollectionMutation(userBookmarkRef);

  const addNewData = (name: string, slug: string) => {
    const createdAt = serverTimestamp();

    addNewDataMutation.mutate({
      name,
      slug,
      createdAt,
    });
  };
  return { addNewData };
}
