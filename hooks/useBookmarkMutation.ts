import { useFirestoreCollectionMutation } from '@react-query-firebase/firestore';
import {
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { useFirestore } from 'reactfire';
import { Game } from '../pages/game/[slug]';

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

  const addNewData = (bookmarkObj: Game) => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { name, slug, background_image, released, genres } = bookmarkObj;
    const createdAt = serverTimestamp();

    addNewDataMutation.mutate({
      name,
      slug,
      genres,
      released,
      createdAt,
      background_image,
    });
  };

  const removeData = async (docId: string) => {
    try {
      const markdownRef = doc(userBookmarkRef, docId);
      await deleteDoc(markdownRef);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return { addNewData, removeData };
}
