import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import { db } from '../firebase/firebase.config';

// Hooks
import useUser from './useUser';

// Type
import { GenresTypes } from '../lib/types/game';

export interface Bookmark {
  name: string;
  slug: string;
  genres: GenresTypes[];
  released: string;
  createdAt: string;
  background_image: string;
}

export default function useUserBookmarks() {
  const { currentUser } = useUser();

  const firestore = useFirestore();
  const gamesCollection = collection(
    firestore,
    `users/${currentUser?.uid}/bookmarks`
  );

  const getCurrentUserBookmarks = (
    userId: string,
    callback: (d: any) => void
  ) => {
    const userCollRef = collection(db, `users/${userId}/bookmarks`);
    const userCollQuery = query(userCollRef, orderBy('createdAt', 'desc'));

    return onSnapshot(userCollQuery, callback);
  };

  const { status, data: bookmarks } = useFirestoreCollectionData(
    gamesCollection,
    { idField: 'id' }
  );
  const bookmarksData = bookmarks as Bookmark[];

  return { status, bookmarksData, getCurrentUserBookmarks };
}
