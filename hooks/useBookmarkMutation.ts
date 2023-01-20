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

// Types
import { GameInterface } from '../lib/types/game';
import { Bookmark } from './useUserBookmarks';

export default function useAddBookmark() {
  const { user } = useUser();

  const firestore = useFirestore();
  const userBookmarkRef = collection(firestore, `users/${user?.uid}/bookmarks`);
  const addNewDataMutation = useFirestoreCollectionMutation(userBookmarkRef);

  const addNewData = (bookmarkObj: GameInterface) => {
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
      const bookmarkRef = doc(userBookmarkRef, docId);
      await deleteDoc(bookmarkRef);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const handleAddBookmark = (
    bookmarks: Bookmark[],
    bookmarkObj: GameInterface
  ) => {
    const hasBeenBookmarked = bookmarks
      .map((bookmark: Bookmark) => bookmark.name)
      .includes(bookmarkObj.name);

    if (!hasBeenBookmarked) addNewData(bookmarkObj);
  };

  return { addNewData, removeData, handleAddBookmark };
}
