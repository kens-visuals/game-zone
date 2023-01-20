import { collection } from 'firebase/firestore';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';

// Hooks
import useUser from './useUser';

// Type
import { GenresTypes } from '../lib/types/game';

export interface Bookmark {
  name: string;
  slug: string;
  genres: GenresTypes;
  released: string;
  createdAt: string;
  background_image: string;
}

export default function useUserBookmarks() {
  const { user } = useUser();

  const firestore = useFirestore();
  const gamesCollection = collection(firestore, `users/${user?.uid}/bookmarks`);

  const { status, data: bookmarks } = useFirestoreCollectionData(
    gamesCollection,
    { idField: 'id' }
  );
  const bookmarksData = bookmarks as Bookmark[];

  return { status, bookmarksData };
}
