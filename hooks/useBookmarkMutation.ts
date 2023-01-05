import { useFirestoreCollectionMutation } from '@react-query-firebase/firestore';
import {
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { useFirestore } from 'reactfire';

// Hooks
import useUser from './useUser';

export default function useAddBookmark() {
  const user = useUser();

  const firestore = useFirestore();
  const userBookmarkRef = collection(
    firestore,
    `users/${user?.data?.uid}/bookmarks`
  );
  const addNewDataMutation = useFirestoreCollectionMutation(userBookmarkRef);

  const addNewData = (name: string, slug: string) => {
    const createdAt = serverTimestamp();

    addNewDataMutation.mutate({
      name,
      slug,
      createdAt,
      isBookmarked: true,
    });
  };

  const removeData = async (docId: string) => {
    try {
      const markdownRef = doc(userBookmarkRef, docId);
      await deleteDoc(markdownRef);
    } catch (error) {
      console.error(error);
    }
  };

  return { addNewData, removeData };
}
