import { collection, onSnapshot } from 'firebase/firestore';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import { db } from '../firebase/firebase.config';

// Hooks
import useUser from './useUser';
import { orderByDescQuery } from '../lib/helpers';

// Type
import { Bookmark } from '../lib/types/index';

export default function useUserBookmarks() {
  const { currentUser } = useUser();

  const firestore = useFirestore();
  const gamesCollection = collection(
    firestore,
    `users/${currentUser?.uid}/bookmarks`
  );
  const userBookmarksQuery = orderByDescQuery(gamesCollection);

  const getCurrentUserBookmarks = (
    userId: string,
    callback: (d: any) => void
  ) => {
    const userCollRef = collection(db, `users/${userId}/bookmarks`);
    const userCollQuery = orderByDescQuery(userCollRef);

    return onSnapshot(userCollQuery, callback);
  };

  const { status, data: bookmarks } = useFirestoreCollectionData(
    userBookmarksQuery,
    { idField: 'id' }
  );
  const bookmarksData = bookmarks as Bookmark[];

  return { status, bookmarksData, getCurrentUserBookmarks };
}
