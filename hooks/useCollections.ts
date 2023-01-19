import { useFirestoreCollectionMutation } from '@react-query-firebase/firestore';
import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { useFirestoreCollectionData } from 'reactfire';
import { db } from '../firebase/firebase.config';

// Hooks
import useUser from './useUser';

// Types
import { GameInterface } from '../lib/types/game';

interface CollectionInfo {
  id?: string;
  name: string;
  createdAt?: string;
  isPublic?: boolean;
  description?: string;
}

export default function useCollections() {
  const user = useUser();

  const userCollectionsRef = collection(
    db,
    `users/${user?.data?.uid}/collections`
  );
  const addNewDataMutation = useFirestoreCollectionMutation(userCollectionsRef);

  const { status, data } = useFirestoreCollectionData(userCollectionsRef, {
    idField: 'id',
  });
  const collections = data as CollectionInfo[];

  const addNewCollection = (collectionInfo: CollectionInfo) => {
    const createdAt = serverTimestamp();

    addNewDataMutation.mutate({ ...collectionInfo, createdAt });
  };

  const removeCollection = async (docId: string) => {
    try {
      const collectionRef = doc(userCollectionsRef, docId);
      await deleteDoc(collectionRef);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const manageCollection = async (
    type: 'add' | 'remove',
    docId: string,
    collectionData: GameInterface
  ): Promise<void> => {
    const batch = writeBatch(db);

    const userDocRef = doc(userCollectionsRef, docId);

    if (type === 'add') {
      batch.update(userDocRef, {
        games: arrayUnion(collectionData),
        updatedAt: serverTimestamp(),
      });
    } else {
      batch.update(userDocRef, {
        games: arrayRemove(collectionData),
        updatedAt: serverTimestamp(),
      });
    }

    await batch.commit();
  };

  return {
    addNewCollection,
    manageCollection,
    status,
    collections,
    removeCollection,
  };
}
